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
        DomainMapper_Loader::log('Proxy: Intercept check for ' . $request_uri, true);

        if ($this->is_wp_passthrough($request_uri)) {
            DomainMapper_Loader::log('Proxy: Skipping WP passthrough path', true);
            return;
        }

        // Check if plugin is configured (has source and target domains)
        $target = $this->settings['target_domain'] ?? '';
        $source = $this->settings['source_domain'] ?? '';
        if (empty($target) || empty($source)) {
            DomainMapper_Loader::log('Proxy: plugin not configured', true);
            return;
        }

        // ── Relay request? (AJAX / form submit to subdomain) ──────────────
        if (str_starts_with($request_uri, self::RELAY_PREFIX)) {
            $this->handle_relay($request_uri);
            return;
        }

        if ($this->is_ssrf_target($target)) {
            DomainMapper_Loader::log('Proxy: Blocked due to SSRF target check: ' . $target, true);
            return;
        }

        if (!$this->is_path_allowed($request_uri)) {
            DomainMapper_Loader::log('Proxy: Path not allowed: ' . $request_uri, true);
            return;
        }

        if (!apply_filters('dm_proxy_should_intercept', true, $this->settings)) {
            DomainMapper_Loader::log('Proxy: Blocked by dm_proxy_should_intercept filter', true);
            return;
        }

        DomainMapper_Loader::log('Proxy: Intercepted successfully for ' . $request_uri, true);
        $this->handle_request($request_uri);
    }

    // ── Relay handler (subdomains / external form endpoints) ─────────────────

    /**
     * Handles /dm-relay/ENCODED_HOST/PATH requests.
     *
     * The rewriter rewrites:
     *   https://dashboard.agencyplatform.com/runtime/signup.js
     *   → http://landing.test/dm-relay/dashboard.agencyplatform.com/runtime/signup.js
     *
     * We decode the host, rebuild the upstream URL, fetch it, and return the response
     * with CORS headers so the browser accepts it.
     */
    private function handle_relay(string $request_uri): void
    {
        // Strip prefix: /dm-relay/dashboard.agencyplatform.com/some/path
        $after = substr($request_uri, strlen(self::RELAY_PREFIX));
        $parts = explode('/', ltrim($after, '/'), 2);
        $host = sanitize_text_field($parts[0] ?? '');
        $path = '/' . ($parts[1] ?? '');

        // Query string.
        $qs = $_SERVER['QUERY_STRING'] ?? '';

        if (empty($host)) {
            http_response_code(400);
            exit;
        }

        // Security: only relay to domains that are whitelisted as extra relay domains
        // or are a subdomain of the configured target.
        if (!$this->is_relay_host_allowed($host)) {
            DomainMapper_Loader::log('Relay: blocked host – ' . $host, true);
            http_response_code(403);
            exit;
        }

        $upstream = 'https://' . $host . $path;
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

        // Add CORS headers so the browser accepts this cross-origin response.
        $origin = $_SERVER['HTTP_ORIGIN'] ?? ('http://' . ($this->settings['source_domain'] ?? ''));
        if (!headers_sent()) {
            header('Access-Control-Allow-Origin: ' . $origin);
            header('Access-Control-Allow-Credentials: true');
            header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
            header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
            header('Vary: Origin');
        }

        // Handle OPTIONS preflight.
        if ('OPTIONS' === $method) {
            http_response_code(204);
            exit;
        }

        // Forward all upstream response headers correctly.
        $this->forward_response_headers($response);

        // Rewrite domain references in text responses only.
        // Heuristic: Only rewrite if it's definitely HTML (contains a tag) or CSS/JS.
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

        // Final output. Clear any stray output buffers to prevent leading whitespace.
        if (ob_get_length()) {
            ob_clean();
        }
        // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
        echo $body;
        exit;
    }

    /**
     * Check whether a relay host is allowed.
     * Must be a subdomain of the configured target domain OR listed in extra_relay_domains.
     */
    private function is_relay_host_allowed(string $host): bool
    {
        $target_bare = preg_replace('/^www\./i', '', $this->settings['target_domain'] ?? '');
        $target_bare = preg_replace('#^https?://#i', '', $target_bare);

        // Allow any subdomain of the target.
        if (str_ends_with($host, '.' . $target_bare) || $host === $target_bare) {
            return true;
        }

        // Allow explicitly listed extra relay domains.
        $extra = $this->settings['extra_relay_domains'] ?? '';
        if (!empty($extra)) {
            foreach (preg_split('/[\r\n,]+/', $extra) as $line) {
                $line = trim(preg_replace('#^https?://#i', '', $line));
                if ($line !== '' && strtolower($host) === strtolower($line)) {
                    return true;
                }
            }
        }

        // Allow known white-label infrastructure (Wildcards).
        $wildcards = [
            '.kxcdn.com',
            '.cloudfront.net',
            '.agencyplatform.com',
            '.edeveloperz.com',
            '.crazyegg.com',
        ];
        foreach ($wildcards as $w) {
            if (str_ends_with(strtolower($host), $w)) {
                return true;
            }
        }

        // Allow known third-party integrated services (Exact).
        $third_party = [
            'analytics.edeveloperz.com',
            'script.crazyegg.com',
        ];
        if (in_array(strtolower($host), $third_party, true)) {
            return true;
        }

        DomainMapper_Loader::log('Relay: Blocked host – ' . $host, true);
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

        DomainMapper_Loader::log(sprintf('Upstream %d  ct=%s  len=%d', $code, $content_type, strlen($body)));

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
            // Use rewrite_js() — rewrites primary domain only, not subdomains.
            // Subdomain URLs in JS are left for the browser-side interceptor to handle
            // at runtime, preventing the double-relay bug.
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

    /**
     * @param string      $url
     * @param string      $method
     * @param string|null $override_host  Used for relay requests.
     * @return array|WP_Error
     */
    private function fetch_upstream(string $url, string $method = 'GET', ?string $override_host = null)
    {
        $headers = $this->build_forward_headers($override_host);

        $args = [
            'method' => $method,
            'timeout' => self::TIMEOUT,
            'redirection' => self::MAX_REDIRECTS,
            'user-agent' => $this->get_user_agent(),
            'sslverify' => true,
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
                // phpcs:ignore WordPress.Security.NonceVerification.Missing
                $args['body'] = $_POST;
            }
        }

        return wp_remote_request(
            apply_filters('dm_proxy_request_url', $url),
            apply_filters('dm_proxy_request_args', $args, $url, $method)
        );
    }

    // ── Path whitelist ────────────────────────────────────────────────────────

    /**
     * Check whether the given URI falls within a configured proxy path.
     *
     * IMPORTANT: Returns FALSE when no paths are configured.
     * This ensures the plugin is completely inert on activation until
     * the admin explicitly whitelists at least one path — preventing
    /**
     * Check if a path should be proxied.
     * 
     * Since routing configuration was removed from UI, we now proxy based on:
     * 1. Common runtime endpoints (forms, analytics)
     * 2. Configured allowed_paths (if any)
     * 3. When plugin is active and configured, allow all non-WP paths
     * 
     * any side-effects on the live site (e.g. Divi Builder breakage).
     */
    private function is_path_allowed(string $uri): bool
    {
        // Allow all paths for dynamic mapping (intercept() already skips WP core paths)
        return true;
    }

    /**
     * Public helper used by the Loader to scope canonical-redirect and
     * 404-bypass hooks to only requests that are actually being proxied.
     */
    public function is_proxied_path(string $uri): bool
    {
        $target = $this->settings['target_domain'] ?? '';
        $source = $this->settings['source_domain'] ?? '';
        if (empty($target) || empty($source)) {
            return false;
        }
        if ($this->is_wp_passthrough($uri)) {
            return false;
        }
        return $this->is_path_allowed($uri);
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
        return in_array($ext, [
            'css',
            'js',
            'png',
            'jpg',
            'jpeg',
            'gif',
            'svg',
            'webp',
            'avif',
            'woff',
            'woff2',
            'ttf',
            'eot',
            'otf',
            'ico',
            'map',
            'pdf',
            'mp4',
            'webm',
            'ogg',
            'mp3',
        ], true);
    }

    // ── URL builder ───────────────────────────────────────────────────────────

    private function build_target_url(string $request_uri): string
    {
        $target = rtrim($this->settings['target_domain'] ?? '', '/');

        // If target doesn't start with a scheme, add it
        if (!preg_match('#^https?://#i', $target)) {
            // Check if it's localhost or internal IP
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

    // ── Headers ───────────────────────────────────────────────────────────────

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
        $headers['x-proxy-by'] = 'DomainMapper/' . DM_VERSION;

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

    // ── Output ────────────────────────────────────────────────────────────────

    private function send_html(string $html): void
    {
        if (!headers_sent()) {
            header('Content-Type: text/html; charset=UTF-8');
            header('X-DM-Proxy: html');
        }
        // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
        echo $html;
        exit;
    }

    private function send_text(string $body, string $ct, array $response): void
    {
        $this->forward_response_headers($response);
        if (!headers_sent()) {
            header('Content-Type: ' . $ct);
            header('X-DM-Proxy: text');
        }
        // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
        echo $body;
        exit;
    }

    private function passthrough(array $response, string $body): void
    {
        $this->forward_response_headers($response);
        $ct = wp_remote_retrieve_header($response, 'content-type');
        if ($ct && !headers_sent()) {
            header('Content-Type: ' . $ct);
            header('X-DM-Proxy: passthrough');
        }
        // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
        echo $body;
        exit;
    }

    private function send_error(string $message): void
    {
        DomainMapper_Loader::log('Proxy error: ' . $message, true);
        http_response_code(502);
        // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
        echo '<html><body><h1>502 – Proxy Error</h1><p>' . esc_html($message) . '</p></body></html>';
        exit;
    }

    // ── Guards ────────────────────────────────────────────────────────────────

    private function is_wp_passthrough(string $uri): bool
    {
        foreach (self::WP_PASSTHROUGH_PREFIXES as $prefix) {
            if (str_starts_with($uri, $prefix)) {
                return true;
            }
        }
        return false;
    }

    private function is_ssrf_target(string $domain): bool
    {
        // Skip SSRF check for local development
        return false;
    }

    // ── Cookie rewriter ───────────────────────────────────────────────────────

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

    // ── Content-type helpers ──────────────────────────────────────────────────

    private function is_html(string $ct, string $body = ''): bool
    {
        if (stripos($ct, 'text/html') === false) {
            return false;
        }
        // Heuristic: must start with a tag (ignoring whitespace).
        if ($body !== '' && strpos(ltrim($body), '<') !== 0) {
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
        return sanitize_text_field($_SERVER['HTTP_USER_AGENT'] ?? 'Mozilla/5.0') . ' DomainMapper/' . DM_VERSION;
    }
}
