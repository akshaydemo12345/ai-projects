<?php
/**
 * Proxy Engine.
 *
 * Handles two types of requests:
 *  1. Normal proxied pages  → fetched from target domain
 *  2. API/form relay        → /dm-relay/DOMAIN/PATH requests
 *                             These are rewritten subdomains (dashboard.*, etc.)
 *                             that need to be fetched from their real host.
 *
 * @package DomainMapper
 */

defined('ABSPATH') || exit;

class DomainMapper_Proxy
{

    private array $settings;
    private DomainMapper_Cache $cache;
    private DomainMapper_Rewriter $rewriter;
    private DomainMapper_API $api;

    const MAX_REDIRECTS = 5;
    const TIMEOUT = 30;
    const RELAY_PREFIX = '/dm-relay/';

    const DROP_RESPONSE_HEADERS = [
        'transfer-encoding',
        'content-encoding',
        'content-length',
        'connection',
        'keep-alive',
        'x-frame-options',
        'content-security-policy',
        'x-content-security-policy',
        'x-webkit-csp',
        'strict-transport-security',
        'access-control-allow-origin',
        'access-control-allow-credentials',
        'access-control-allow-methods',
        'access-control-allow-headers',
        'access-control-expose-headers',
    ];

    const DROP_REQUEST_HEADERS = [
        'host',
        'connection',
        'x-forwarded-for',
        'x-real-ip',
        'cf-connecting-ip',
    ];

    const WP_PASSTHROUGH_PREFIXES = [
        '/wp-admin/',
        '/wp-login.php',
        '/wp-cron.php',
        '/wp-json/',
        '/xmlrpc.php',
        '/wp-includes/',
        '/wp-content/plugins/domain-mapper/',
    ];

    public function __construct(
        array $settings,
        DomainMapper_Cache $cache,
        DomainMapper_Rewriter $rewriter,
        DomainMapper_API $api
    ) {
        $this->settings = $settings;
        $this->cache = $cache;
        $this->rewriter = $rewriter;
        $this->api = $api;
    }

    // ── Entry-point ───────────────────────────────────────────────────────────

    public function intercept(): void
    {
        if (
            is_admin() || wp_doing_ajax() || wp_doing_cron() ||
            (defined('REST_REQUEST') && REST_REQUEST) ||
            (defined('WP_CLI') && WP_CLI)
        ) {
            return;
        }

        $request_uri = $_SERVER['REQUEST_URI'] ?? '/';

        // ── 1. Interceptor / Relay request? (Always handle early) ────────────
        if (str_starts_with($request_uri, '/dm-interceptor.js')) {
            header('Content-Type: application/javascript; charset=UTF-8');
            header('Cache-Control: public, max-age=3600');
            header('X-Content-Type-Options: nosniff');
            if ( class_exists( 'DomainMapper_Form_Interceptor' ) ) {
                $fi = new DomainMapper_Form_Interceptor( $this->settings );
                echo trim( $fi->get_js_body() );
            }
            exit;
        }

        if (str_starts_with($request_uri, self::RELAY_PREFIX)) {
            $this->handle_relay($request_uri);
            return;
        }

        $path = '/' . ltrim(strtok($request_uri, '?') ?: '/', '/');

        // ── 2. Always skip WP core paths ──────────────────────────────────────
        if ($this->is_wp_passthrough($path)) {
            return;
        }

        // ── 3. High-Priority Proxy Check ─────────────────────────────────────
        // If it's a known lander, and NOT a real WP post, we intercept here.
        if ($this->is_path_allowed($path)) {
            if (!$this->is_existing_content($path)) {
                $this->handle_request($request_uri);
            }
        }
    }

    /**
     * Fallback for 404s. If WP gave up, check if we have a lander for this.
     * Includes a "Self-Healing" check for newly created pages.
     */
    public function maybe_proxy_404(): void
    {
        if (!is_404()) {
            return;
        }

        $request_uri = $_SERVER['REQUEST_URI'] ?? '/';

        // Interceptor serving moved to intercept() for performance

        $path = '/' . ltrim(strtok($request_uri, '?') ?: '/', '/');

        // Check again. If still not allowed, try a quick background sync 
        // if we haven't synced in the last 60 seconds.
        if (!$this->is_path_allowed($path)) {
            $last_sync = (int) ($this->settings['last_sync'] ?? 0);
            if (time() - $last_sync > 60) {
                DomainMapper_Loader::log("Proxy: 404 detected and path not allowed. Attempting auto-sync for '{$path}'", true);
                $this->api->sync();
                // Reload settings after sync
                $this->settings = get_option(DM_OPTION, []);
            }
        }

        if ($this->is_path_allowed($path)) {
            DomainMapper_Loader::log("Proxy: 404 Fallback triggered for {$path}", true);
            $this->handle_request($request_uri);
        }
    }

    /**
     * Check if the given path matches any existing WordPress content.
     */
    private function is_existing_content(string $path): bool
    {
        $slug = ltrim(rtrim($path, '/'), '/');
        if (empty($slug)) {
            return true; // Root is always native
        }

        // 1. Direct page lookup by slug
        $page = get_page_by_path($slug, OBJECT, 'page');
        if ($page && $page->ID > 0)
            return true;

        // 2. Direct post lookup by slug
        $post = get_page_by_path($slug, OBJECT, 'post');
        if ($post && $post->ID > 0)
            return true;

        // 3. Resolve URL (handles custom permalinks)
        $post_id = url_to_postid(home_url($path));
        if ($post_id > 0)
            return true;

        return false;
    }

    // ── Relay handler (subdomains / external form endpoints) ─────────────────

    /**
     * Handles /dm-relay/ENCODED_HOST/PATH requests.
     */
    private function handle_relay(string $request_uri): void
    {
        $after = substr($request_uri, strlen(self::RELAY_PREFIX));
        $parts = explode('/', ltrim($after, '/'), 2);
        $host = sanitize_text_field($parts[0] ?? '');
        $path = '/' . ($parts[1] ?? '');
        $qs = $_SERVER['QUERY_STRING'] ?? '';

        if (empty($host)) {
            http_response_code(400);
            exit;
        }

        if (!$this->is_relay_host_allowed($host)) {
            DomainMapper_Loader::log('Relay: blocked host – ' . $host, true);
            http_response_code(403);
            exit;
        }

        $upstream = 'https://' . $host . $path;
        if (preg_match('/^(localhost|127\.0\.0\.|192\.168\.|10\.|172\.1[6-9]\.|172\.2[0-9]\.|172\.3[01]\.)/i', $host)) {
            $upstream = 'http://' . $host . $path;
        }
        if ($qs) {
            $upstream .= '?' . $qs;
        }

        DomainMapper_Loader::log('Relay: ' . ($_SERVER['REQUEST_METHOD'] ?? 'GET') . ' ' . $upstream);

        $method = strtoupper(sanitize_text_field($_SERVER['REQUEST_METHOD'] ?? 'GET'));
        $response = $this->fetch_upstream($upstream, $method, $host);

        if (is_wp_error($response)) {
            http_response_code(502);
            exit;
        }

        $code = (int) wp_remote_retrieve_response_code($response);
        $content_type = (string) wp_remote_retrieve_header($response, 'content-type');
        $body = wp_remote_retrieve_body($response);

        http_response_code($code);

        $origin = $_SERVER['HTTP_ORIGIN'] ?? ('http://' . ($this->settings['source_domain'] ?? ''));
        if (!headers_sent()) {
            header('Access-Control-Allow-Origin: ' . $origin);
            header('Access-Control-Allow-Credentials: true');
            header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
            header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
            header('Vary: Origin');
        }

        if ('OPTIONS' === $method) {
            http_response_code(204);
            exit;
        }

        $this->forward_response_headers($response);

        if ($this->is_html($content_type, $body)) {
            $body = $this->rewriter->rewrite($body, $upstream);
        } elseif ($this->is_css($content_type)) {
            $body = $this->rewriter->rewrite_text($body);
        } elseif ($this->is_js($content_type)) {
            $body = $this->rewriter->rewrite_js($body);
        }

        if (!headers_sent()) {
            if ($content_type) {
                header('Content-Type: ' . $content_type);
            }
            header('Cache-Control: no-cache');
        }

        if (ob_get_length()) {
            ob_clean();
        }
        echo $body;
        exit;
    }

    private function is_relay_host_allowed(string $host): bool
    {
        $target_bare = preg_replace('/^www\./i', '', $this->settings['target_domain'] ?? '');
        $target_bare = preg_replace('#^https?://#i', '', $target_bare);

        if (str_ends_with($host, '.' . $target_bare) || $host === $target_bare) {
            return true;
        }

        $extra = $this->settings['extra_relay_domains'] ?? '';
        if (!empty($extra)) {
            foreach (preg_split('/[\r\n,]+/', $extra) as $line) {
                $line = trim(preg_replace('#^https?://#i', '', $line));
                if ($line !== '' && strtolower($host) === strtolower($line)) {
                    return true;
                }
            }
        }

        $wildcards = ['.kxcdn.com', '.cloudfront.net', '.agencyplatform.com', '.edeveloperz.com', '.crazyegg.com'];
        foreach ($wildcards as $w) {
            if (str_ends_with(strtolower($host), $w)) {
                return true;
            }
        }

        $third_party = ['analytics.edeveloperz.com', 'script.crazyegg.com'];
        if (in_array(strtolower($host), $third_party, true)) {
            return true;
        }

        return false;
    }

    // ── Normal page handler ───────────────────────────────────────────────────

    private function handle_request(string $request_uri): void
    {
        $method = strtoupper(sanitize_text_field($_SERVER['REQUEST_METHOD'] ?? 'GET'));
        $target_url = $this->build_target_url($request_uri);

        DomainMapper_Loader::log(sprintf('Proxy: %s %s → %s', $method, $request_uri, $target_url), true);

        if ('GET' === $method) {
            $cached = $this->cache->get_page($request_uri);
            if (false !== $cached) {
                DomainMapper_Loader::log('Proxy: cache hit.');
                $this->send_html($cached);
                return;
            }
        }

        $response = $this->fetch_upstream($target_url, $method);

        if (is_wp_error($response)) {
            $this->send_error($response->get_error_message());
            return;
        }

        $code = (int) wp_remote_retrieve_response_code($response);
        $content_type = (string) wp_remote_retrieve_header($response, 'content-type');
        $body = wp_remote_retrieve_body($response);

        http_response_code($code);

        if ($this->is_html($content_type)) {
            $rewritten = $this->rewriter->rewrite($body, $target_url);
            if ('GET' === $method && 200 === $code) {
                $this->cache->set_page($request_uri, $rewritten);
            }
            $this->forward_response_headers($response);
            $this->send_html($rewritten);
            return;
        }

        if ($this->is_css($content_type)) {
            $this->send_text($this->rewriter->rewrite_text($body), $content_type, $response);
            return;
        }

        if ($this->is_js($content_type)) {
            $this->send_text($this->rewriter->rewrite_js($body), $content_type, $response);
            return;
        }

        if ($this->is_json($content_type)) {
            $this->send_text($this->rewriter->rewrite_text($body), $content_type, $response);
            return;
        }

        $this->passthrough($response, $body);
    }

    // ── Fetch ─────────────────────────────────────────────────────────────────

    private function fetch_upstream(string $url, string $method = 'GET', ?string $override_host = null)
    {
        $headers = $this->build_forward_headers($override_host);

        $args = [
            'method' => $method,
            'timeout' => self::TIMEOUT,
            'redirection' => self::MAX_REDIRECTS,
            'user-agent' => $this->get_user_agent(),
            'sslverify' => false, // Set to false for maximum compatibility
            'blocking' => true,
            'headers' => $headers,
            'cookies' => $this->build_forward_cookies(),
        ];

        if (in_array($method, ['POST', 'PUT', 'PATCH'], true)) {
            $raw = file_get_contents('php://input');
            if (!empty($raw)) {
                $args['body'] = $raw;
                $ct = $_SERVER['CONTENT_TYPE'] ?? '';
                if ($ct) {
                    $args['headers']['content-type'] = $ct;
                }
            } else {
                $args['body'] = array_merge($_POST, $_FILES);
            }
        }

        return wp_remote_request(
            apply_filters('dm_proxy_request_url', $url),
            apply_filters('dm_proxy_request_args', $args, $url, $method)
        );
    }

    // ── Path whitelist ────────────────────────────────────────────────────────

    private function is_path_allowed(string $uri): bool
    {
        $path = '/' . ltrim(strtok($uri, '?') ?: '/', '/');

        if (str_starts_with($path, '/api/leads')) {
            return true;
        }

        $allowed = $this->get_allowed_paths();
        if (empty($allowed)) {
            return false;
        }

        foreach ($allowed as $pattern) {
            $pattern = '/' . ltrim($pattern, '/');

            // 1. Exact match (rtrimmed for slash-agnosticism)
            if (rtrim($path, '/') === rtrim($pattern, '/')) {
                return true;
            }

            // 2. Wildcard match (e.g. /lp/*)
            if (str_ends_with($pattern, '*')) {
                $base = rtrim(substr($pattern, 0, -1), '/');
                if ($path === $base || str_starts_with($path, $base . '/')) {
                    return true;
                }
            }

            // 3. Implicit sub-path match for slugs (e.g. /roofing/assets/...)
            // If the pattern is an allowed lander, we must allow its assets.
            $pattern_no_slash = rtrim($pattern, '/');
            if (!empty($pattern_no_slash) && $pattern_no_slash !== '/') {
                if (str_starts_with($path, $pattern_no_slash . '/')) {
                    return true;
                }
            }
        }
        return false;
    }

    public function is_proxied_path(string $uri): bool
    {
        if (!$this->api->is_active()) {
            return false;
        }

        $path = '/' . ltrim(strtok($uri, '?') ?: '/', '/');

        // Basic passthrough check
        if ($this->is_wp_passthrough($path)) {
            return false;
        }

        // Never proxy homepage via this check to avoid breaking native site
        if ($path === '/') {
            return false;
        }

        // Must be allowed path
        if (!$this->is_path_allowed($path)) {
            return false;
        }

        // Must NOT be existing content
        if ($this->is_existing_content($path)) {
            return false;
        }

        return true;
    }

    private function get_allowed_paths(): array
    {
        $raw = $this->settings['allowed_paths'] ?? '';
        if (empty($raw)) {
            return [];
        }
        $paths = [];
        foreach (preg_split('/[\r\n,]+/', $raw) as $line) {
            $line = trim($line);
            if ($line !== '') {
                $paths[] = '/' . ltrim($line, '/');
            }
        }
        return $paths;
    }

    private function is_asset_request(string $uri): bool
    {
        if (str_starts_with($uri, '/wp-content/')) {
            return true;
        }
        $ext = strtolower(pathinfo(strtok($uri, '?') ?: '', PATHINFO_EXTENSION));
        return in_array($ext, ['css', 'js', 'png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'avif', 'woff', 'woff2', 'ttf', 'eot', 'otf', 'ico', 'map', 'pdf', 'mp4', 'webm', 'ogg', 'mp3'], true);
    }

    private function build_target_url(string $request_uri): string
    {
        $target = rtrim($this->settings['target_domain'] ?? '', '/');
        if (!preg_match('#^https?://#i', $target)) {
            if (preg_match('/^(localhost|127\.0\.0\.|192\.168\.|10\.|172\.1[6-9]\.|172\.2[0-9]\.|172\.3[01]\.)/i', $target)) {
                $target = 'http://' . $target;
            } else {
                $target = 'https://' . $target;
            }
        }
        $path = strtok($request_uri, '?') ?: '/';
        $query = $_SERVER['QUERY_STRING'] ?? '';
        $url = rtrim($target, '/') . '/' . ltrim($path, '/');
        if ($query) {
            $url .= '?' . $query;
        }
        return $url;
    }

    private function build_forward_headers(?string $override_host = null): array
    {
        $headers = [];
        $drop = array_map('strtolower', self::DROP_REQUEST_HEADERS);
        foreach ($_SERVER as $key => $value) {
            if (strpos($key, 'HTTP_') !== 0) {
                continue;
            }
            $name = str_replace('_', '-', strtolower(substr($key, 5)));
            if (in_array($name, $drop, true)) {
                continue;
            }
            $headers[$name] = sanitize_text_field((string) $value);
        }
        if ($override_host) {
            $headers['host'] = $override_host;
            $headers['referer'] = 'https://' . $override_host . '/';
            $headers['origin'] = 'https://' . $override_host;
        } else {
            $target_host = wp_parse_url('https://' . ltrim($this->settings['target_domain'] ?? '', 'https://'), PHP_URL_HOST);
            if ($target_host) {
                $headers['host'] = $target_host;
                $headers['referer'] = 'https://' . $target_host . '/';
                $headers['origin'] = 'https://' . $target_host;
            }
        }
        $headers['x-forwarded-host'] = $_SERVER['HTTP_HOST'] ?? '';
        // Removed X-Proxy-By header to prevent exposure
        return apply_filters('dm_proxy_forward_headers', $headers);
    }

    private function build_forward_cookies(): array
    {
        $cookies = [];
        foreach ($_COOKIE as $name => $value) {
            if (str_starts_with($name, 'wordpress_') || str_starts_with($name, 'wp-settings')) {
                continue;
            }
            $cookies[sanitize_text_field($name)] = sanitize_text_field((string) $value);
        }
        return apply_filters('dm_proxy_forward_cookies', $cookies);
    }

    private function forward_response_headers(array $response): void
    {
        $drop = array_map('strtolower', self::DROP_RESPONSE_HEADERS);
        $all_headers = wp_remote_retrieve_headers($response);
        if (is_object($all_headers) && method_exists($all_headers, 'getAll')) {
            $all_headers = $all_headers->getAll();
        }
        if (!is_array($all_headers)) {
            return;
        }
        foreach ($all_headers as $name => $value) {
            if (in_array(strtolower($name), $drop, true)) {
                continue;
            }
            if ('location' === strtolower($name)) {
                $value = $this->rewriter->rewrite_url((string) $value);
            }
            if ('set-cookie' === strtolower($name)) {
                $cookies = is_array($value) ? $value : [$value];
                foreach ($cookies as $cookie) {
                    $cookie = $this->rewrite_cookie((string) $cookie);
                    if (!headers_sent()) {
                        header('Set-Cookie: ' . $cookie, false);
                    }
                }
                continue;
            }
            if (!headers_sent()) {
                header($name . ': ' . $value, false);
            }
        }
    }

    private function sanitize_final_html(string $html): string
    {
        // 1. Remove HTML comments maliciously exposing tech stack, but preserve IE conditionals
        $html = preg_replace('/<!--(?!\s*(?:\[if [^\]]+]|<!|>))(?:(?!-->).)*-->/s', '', $html);

        // 2. Remove standard WordPress noise generators (useful if SaaS runs WP)
        $html = preg_replace('/<meta name="?generator"?[^>]+>/i', '', $html);
        $html = preg_replace('/<link rel="?https:\/\/api\.w\.org\/"?[^>]+>/i', '', $html);
        $html = preg_replace('/<link rel="?(?:alternate|EditURI|wlwmanifest|shortlink)"?[^>]+>/i', '', $html);
        
        // 3. Remove WP Emoji Noise
        $html = preg_replace('/<script[^>]*>window\._wpemojiSettings.*?<\/script>/is', '', $html);
        $html = preg_replace('/<style[^>]*>img\.wp-smiley.*?<\/style>/is', '', $html);
        $html = preg_replace('/<script[^>]+src="[^"]+wp-emoji-release\.min\.js"[^>]*><\/script>/is', '', $html);
        
        // 4. Remove WP Embed script
        $html = preg_replace('/<script[^>]+src="[^"]+wp-embed\.min\.js"[^>]*><\/script>/is', '', $html);
        
        // 5. Remove builder trace comments (Divi/Elementor) or any left over footprints
        $html = preg_replace('/<!--\s*(?:Divi|Elementor|WP|Plugin|DM-Proxy)[^>]*-->/i', '', $html);
        
        // 6. Remove internal hidden proxy/sync JSON blobs
        $html = preg_replace('/<script[^>]+id="?dm-state"?[^>]*>.*?<\/script>/is', '', $html);

        // 7. Cleanup excessive empty newlines created by regex stripping
        $html = preg_replace("/(^[\r\n]*|[\r\n]+)[\s\t]*[\r\n]+/", "\n", $html);

        return $html;
    }

    /**
     * Beautify HTML so View Page Source shows clean, properly indented markup.
     * Protects <style> and <script> blocks from being reformatted.
     */
    private function beautify_html(string $html): string
    {
        // Void (self-closing) elements — never increase indent after these
        $void_tags = ['area','base','br','col','embed','hr','img','input',
                      'link','meta','param','source','track','wbr'];

        // ── 1. Protect <style> and <script> inner content ────────────────────
        $protected = [];
        $html = preg_replace_callback(
            '#(<(?:style|script)(?:[^>]*)>)(.*?)(</(?:style|script)>)#is',
            function (array $m) use (&$protected): string {
                $key = '%%PROTECTED_' . count($protected) . '%%';
                $protected[$key] = $m[0];
                return $key;
            },
            $html
        ) ?? $html;

        // ── 2. Ensure a newline before every tag ─────────────────────────────
        $html = preg_replace('/</', "\n<", $html) ?? $html;
        // Put DOCTYPE back on first line cleanly
        $html = ltrim($html);

        // ── 3. Split into lines and re-indent ─────────────────────────────────
        $lines  = explode("\n", $html);
        $indent = 0;
        $pad    = '    '; // 4-space indent
        $out    = [];

        foreach ($lines as $raw) {
            $line = trim($raw);
            if ($line === '') {
                continue;
            }

            // Detect closing tag  </tag>
            if (preg_match('/^<\/(\w+)/i', $line, $cm)) {
                $indent = max(0, $indent - 1);
            }

            $out[] = str_repeat($pad, $indent) . $line;

            // After writing, detect opening tag and decide whether to indent children
            if (
                preg_match('/^<(\w+)/i', $line, $om) &&           // it's an opening tag
                !preg_match('/^<\//', $line) &&                    // not a closing tag
                !preg_match('/\/>$/', $line) &&                    // not self-closing />
                !in_array(strtolower($om[1]), $void_tags, true) && // not a void element
                !preg_match('/<\/' . preg_quote($om[1], '/') . '>\s*$/i', $line) // tag not closed on same line
            ) {
                $indent++;
            }
        }

        $html = implode("\n", $out);

        // ── 4. Restore protected blocks ───────────────────────────────────────
        foreach ($protected as $key => $original) {
            $html = str_replace($key, $original, $html);
        }

        // ── 5. Remove excessive blank lines ──────────────────────────────────
        $html = preg_replace("/\n{3,}/", "\n\n", $html) ?? $html;

        return $html;
    }

    private function send_html(string $html): void
    {
        // Clear out any existing output buffering to avoid mixed WordPress markup in View Source
        while (ob_get_level() > 0) {
            ob_end_clean();
        }

        $html = $this->sanitize_final_html($html);
        $html = $this->beautify_html($html);

        if (!headers_sent()) {
            header('Content-Type: text/html; charset=UTF-8');
        }
        echo $html;
        exit;
    }

    private function send_text(string $body, string $ct, array $response): void
    {
        $this->forward_response_headers($response);
        if (!headers_sent()) {
            header('Content-Type: ' . $ct);
            // Removed X-DM-Proxy header
        }
        echo $body;
        exit;
    }

    private function passthrough(array $response, string $body): void
    {
        $this->forward_response_headers($response);
        $ct = wp_remote_retrieve_header($response, 'content-type');
        if ($ct && !headers_sent()) {
            header('Content-Type: ' . $ct);
            // Removed X-DM-Proxy header
        }
        echo $body;
        exit;
    }

    private function send_error(string $message): void
    {
        DomainMapper_Loader::log('Proxy error: ' . $message, true);
        http_response_code(502);
        echo '<html><body><h1>502 – Proxy Error</h1><p>' . esc_html($message) . '</p></body></html>';
        exit;
    }

    private function is_wp_passthrough(string $uri): bool
    {
        // Built-in WP prefixes
        foreach (self::WP_PASSTHROUGH_PREFIXES as $prefix) {
            if (str_starts_with($uri, $prefix)) {
                return true;
            }
        }

        // Dynamic checks
        if (strpos($uri, 'wp-login') !== false || strpos($uri, 'wp-signup') !== false) {
            return true;
        }

        if (is_feed() || is_trackback() || is_robots() || is_favicon()) {
            return true;
        }

        if (defined('REST_REQUEST') && REST_REQUEST) {
            return true;
        }

        return false;
    }

    private function is_ssrf_target(string $domain): bool
    {
        return false;
    }

    private function rewrite_cookie(string $cookie): string
    {
        $t = (string) preg_replace('#^https?://#i', '', rtrim($this->settings['target_domain'] ?? '', '/'));
        $s = (string) preg_replace('#^https?://#i', '', rtrim($this->settings['source_domain'] ?? '', '/'));
        $bare = (string) preg_replace('/^www\./i', '', $t);
        if ($t) {
            $cookie = str_ireplace('Domain=.' . $t, 'Domain=' . $s, $cookie);
            $cookie = str_ireplace('Domain=' . $t, 'Domain=' . $s, $cookie);
            $cookie = str_ireplace('Domain=.' . $bare, 'Domain=' . $s, $cookie);
            $cookie = str_ireplace('Domain=' . $bare, 'Domain=' . $s, $cookie);
        }
        if (!is_ssl()) {
            $cookie = preg_replace('/;\s*Secure/i', '', $cookie) ?? $cookie;
        }
        $cookie = preg_replace('/SameSite=\w+/i', 'SameSite=Lax', $cookie) ?? $cookie;
        return $cookie;
    }

    private function is_html(string $ct, string $body = ''): bool
    {
        if (stripos($ct, 'text/html') === false) {
            return false;
        }
        return true;
    }
    private function is_css(string $ct): bool
    {
        return (bool) preg_match('#text/css#i', $ct);
    }
    private function is_js(string $ct): bool
    {
        return (bool) preg_match('#(javascript|application/x-javascript|application/javascript)#i', $ct);
    }
    private function is_json(string $ct): bool
    {
        return (bool) preg_match('#application/json#i', $ct);
    }

    private function get_user_agent(): string
    {
        // Don't expose DomainMapper internal footprint
        return sanitize_text_field($_SERVER['HTTP_USER_AGENT'] ?? 'Mozilla/5.0') . ' Compatible';
    }
}
