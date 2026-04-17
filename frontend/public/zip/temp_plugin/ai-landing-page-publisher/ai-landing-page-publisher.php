<?php
/**
 * Plugin Name: AI Landing Page Publisher
 * Plugin URI:  https://your-saas.com
 * Description: Serve your AI-generated landing pages on your WordPress domain without affecting any existing pages.
 * Version:     2.0.0
 * Requires at least: 5.6
 * Requires PHP: 7.2
 * Author:      AI Landing Page Publisher
 * License:     Proprietary
 * Text Domain: ai-landing-page-publisher
 */

defined('ABSPATH') || exit;

// ── Constants ─────────────────────────────────────────────────────────────────
define('AILP_VERSION', '2.0.0');
define('AILP_OPTION', 'ailp_settings');
define('AILP_SLUG', 'ai-landing-page-publisher');

// ── Activation / Deactivation ─────────────────────────────────────────────────

register_activation_hook(__FILE__, 'ailp_activate');
register_deactivation_hook(__FILE__, 'ailp_deactivate');

function ailp_activate()
{
    if (!get_option(AILP_OPTION)) {
        add_option(AILP_OPTION, array(
            'api_key' => '',
            'status' => 'inactive',
            'target_domain' => '',
            'allowed_paths' => '',
        ), '', 'no');
    }
    ailp_register_rewrite_rules();
    flush_rewrite_rules();
}

function ailp_deactivate()
{
    delete_option(AILP_OPTION);
    flush_rewrite_rules();
}

// ── Bootstrap ─────────────────────────────────────────────────────────────────

add_action('init', 'ailp_register_rewrite_rules');
add_filter('query_vars', 'ailp_add_query_vars');
add_action('template_redirect', 'ailp_handle_proxy', 1);

// Admin
add_action('admin_menu', 'ailp_register_menu');
add_action('admin_init', 'ailp_register_settings');
add_action('wp_ajax_ailp_verify', 'ailp_ajax_verify');
add_action('wp_ajax_ailp_flush', 'ailp_ajax_flush');

// ── Rewrite Rules (WordPress-native, no .htaccess changes) ───────────────────

/**
 * Register a rewrite rule for every configured allowed path.
 * WordPress routes e.g. /roofing → index.php?ailp_slug=roofing
 * All other URLs are completely unaffected.
 */
function ailp_register_rewrite_rules()
{
    $paths = ailp_get_allowed_paths();
    foreach ($paths as $raw) {
        $slug = trim($raw, '/');
        if ($slug === '') {
            continue;
        }
        // Match: /slug  and  /slug/anything
        add_rewrite_rule(
            '^' . preg_quote($slug, '#') . '(/.*)?$',
            'index.php?ailp_slug=' . rawurlencode($slug),
            'top'
        );
    }
}

function ailp_add_query_vars($vars)
{
    $vars[] = 'ailp_slug';
    return $vars;
}

// ── Proxy handler ─────────────────────────────────────────────────────────────

function ailp_handle_proxy()
{
    $slug = get_query_var('ailp_slug', '');

    // Fallback: if rewrite rules didn't catch it (e.g. permalinks off), check manually
    if ($slug === '') {
        $path = trim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/');
        foreach (ailp_get_allowed_paths() as $allowed) {
            if (trim($allowed, '/') === $path) {
                $slug = $path;
                break;
            }
        }
    }

    if ($slug === '') {
        return; // Not our request
    }

    $settings = get_option(AILP_OPTION, array());

    // Must be verified/active
    if (empty($settings['status']) || $settings['status'] !== 'active') {
        return;
    }

    $target = isset($settings['target_domain']) ? trim($settings['target_domain']) : '';
    if ($target === '') {
        return;
    }

    // Build upstream URL
    $request_uri = isset($_SERVER['REQUEST_URI']) ? $_SERVER['REQUEST_URI'] : '/' . $slug;
    $upstream = ailp_build_upstream_url($target, $request_uri);

    // Fetch from upstream
    $method = isset($_SERVER['REQUEST_METHOD']) ? strtoupper($_SERVER['REQUEST_METHOD']) : 'GET';
    $args = array(
        'timeout' => 30,
        'redirection' => 5,
        'sslverify' => false,
        'headers' => ailp_forward_headers($target),
    );

    if (in_array($method, array('POST', 'PUT', 'PATCH'), true)) {
        $raw_body = file_get_contents('php://input');
        $args['body'] = $raw_body !== false ? $raw_body : '';
        $ct = isset($_SERVER['CONTENT_TYPE']) ? $_SERVER['CONTENT_TYPE'] : '';
        if ($ct) {
            $args['headers']['Content-Type'] = $ct;
        }
    }

    $response = wp_remote_request($upstream, array_merge($args, array('method' => $method)));

    if (is_wp_error($response)) {
        status_header(502);
        echo '<h1>502 — Could not reach the landing page server.</h1><p>' . esc_html($response->get_error_message()) . '</p>';
        exit;
    }

    $status_code = wp_remote_retrieve_response_code($response);
    $body = wp_remote_retrieve_body($response);
    $content_type = wp_remote_retrieve_header($response, 'content-type');

    // Rewrite domain references in the body and sanitize internal traces safely
    $source_host = isset($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : '';
    if ($source_host && $target) {
        $body = ailp_sanitize_and_rewrite_body($body, $target, $source_host, $content_type);
    }

    // Send response
    status_header((int)$status_code ?: 200);

    // Forward safe headers
    $skip = array(
        'transfer-encoding',
        'content-encoding',
        'content-length',
        'connection',
        'x-frame-options',
        'content-security-policy',
        'strict-transport-security'
    );
    foreach (wp_remote_retrieve_headers($response) as $name => $value) {
        if (!in_array(strtolower($name), $skip, true)) {
            header($name . ': ' . $value);
        }
    }

    if ($content_type) {
        header('Content-Type: ' . $content_type);
    }

    // CORS headers for form submissions from any origin
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');

    echo $body;
    exit;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function ailp_get_allowed_paths()
{
    $settings = get_option(AILP_OPTION, array());
    $raw = isset($settings['allowed_paths']) ? $settings['allowed_paths'] : '';
    if ($raw === '') {
        return array();
    }
    $paths = array();
    foreach (preg_split('/[\r\n,]+/', $raw) as $line) {
        $line = trim($line);
        if ($line !== '') {
            $paths[] = '/' . ltrim($line, '/');
        }
    }
    return $paths;
}

function ailp_build_upstream_url($target, $request_uri)
{
    // Strip scheme if any, normalise target
    $target = preg_replace('#^https?://#i', '', rtrim($target, '/'));
    $path = strtok($request_uri, '?');
    $qs = isset($_SERVER['QUERY_STRING']) ? $_SERVER['QUERY_STRING'] : '';
    $url = 'http://' . $target . $path;
    if ($qs) {
        $url .= '?' . $qs;
    }
    return $url;
}

function ailp_forward_headers($target_host)
{
    $headers = array();
    $pass = array('accept', 'accept-language', 'accept-encoding', 'user-agent', 'referer', 'cookie', 'x-requested-with');
    foreach ($_SERVER as $key => $value) {
        if (substr($key, 0, 5) !== 'HTTP_') {
            continue;
        }
        $name = strtolower(str_replace('_', '-', substr($key, 5)));
        if (in_array($name, $pass, true)) {
            $headers[$name] = $value;
        }
    }
    $headers['host'] = $target_host;
    $headers['x-forwarded-for'] = isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : '';
    return $headers;
}

/**
 * Sanitize and Rewrite domain references in HTML/CSS/JS so that the proxied page
 * renders cleanly, safely, and securely on the WordPress domain.
 */
function ailp_sanitize_and_rewrite_body($body, $target, $source_host, $content_type)
{
    $ct = strtolower($content_type);
    $is_html = (strpos($ct, 'html') !== false);
    
    if (!$is_html && strpos($ct, 'css') === false && strpos($ct, 'javascript') === false && strpos($ct, 'json') === false) {
        return $body;
    }

    $target_bare = preg_replace('#^https?://#i', '', rtrim($target, '/'));

    // Aggressive masking: replace ALL target domain variations with client domain
    $body = str_ireplace('https://' . $target_bare, 'https://' . $source_host, $body);
    $body = str_ireplace('http://' . $target_bare, 'https://' . $source_host, $body); // Force HTTPS on frontend usually
    $body = str_ireplace('//' . $target_bare, '//' . $source_host, $body);
    $body = str_ireplace('\/\/' . $target_bare, '\/\/' . $source_host, $body); // Handle JSON escaped slashes

    if ($is_html) {
        // 1. Remove HTML comments (except IE conditionals) securely
        $body = preg_replace('/<!--(?!\s*(?:\[if [^\]]+]|<!|>))(?:(?!-->).)*-->/s', '', $body);
        
        // 2. Remove standard WordPress noise generators (useful if SaaS runs WP)
        $body = preg_replace('/<meta name="?generator"?[^>]+>/i', '', $body);
        $body = preg_replace('/<link rel="?https:\/\/api\.w\.org\/"?[^>]+>/i', '', $body);
        $body = preg_replace('/<link rel="?(?:alternate|EditURI|wlwmanifest|shortlink)"?[^>]+>/i', '', $body);
        
        // 3. Remove WP Emoji Noise
        $body = preg_replace('/<script[^>]*>window\._wpemojiSettings.*?<\/script>/is', '', $body);
        $body = preg_replace('/<script[^>]+src="[^"]+wp-emoji-release\.min\.js"[^>]*><\/script>/is', '', $body);
        
        // 4. Remove WP Embed script
        $body = preg_replace('/<script[^>]+src="[^"]+wp-embed\.min\.js"[^>]*><\/script>/is', '', $body);
        
        // 5. Remove builder trace comments (Divi/Elementor) or any left over footprints
        $body = preg_replace('/<!--\s*(?:Divi|Elementor|WP|Plugin)[^>]*-->/i', '', $body);
        
        // 6. Cleanup excessive empty newlines created by regex stripping
        $body = preg_replace("/(^[\r\n]*|[\r\n]+)[\s\t]*[\r\n]+/", "\n", $body);
    }

    return $body;
}

// ── Admin Settings Page ───────────────────────────────────────────────────────

function ailp_register_menu()
{
    add_options_page(
        'AI Landing Page Publisher',
        'AI Landing Page Publisher',
        'manage_options',
        AILP_SLUG,
        'ailp_render_settings_page'
    );
}

function ailp_register_settings()
{
    register_setting('ailp_settings_group', AILP_OPTION, array('sanitize_callback' => 'ailp_sanitize_settings'));
}

function ailp_sanitize_settings($raw)
{
    if (!is_array($raw)) {
        return get_option(AILP_OPTION, array());
    }

    $current = get_option(AILP_OPTION, array());
    $clean = is_array($current) ? $current : array();

    if (isset($raw['api_key'])) {
        $clean['api_key'] = trim(sanitize_text_field($raw['api_key']));
    }

    // After saving, flush rewrite rules so new slugs take effect immediately
    flush_rewrite_rules();

    return $clean;
}

function ailp_render_settings_page()
{
    if (!current_user_can('manage_options')) {
        return;
    }
    $settings = get_option(AILP_OPTION, array());
    $status = isset($settings['status']) ? $settings['status'] : 'inactive';
    $api_key = isset($settings['api_key']) ? $settings['api_key'] : '';
    $target = isset($settings['target_domain']) ? $settings['target_domain'] : '';
    $paths = isset($settings['allowed_paths']) ? $settings['allowed_paths'] : '';
?>
    <div class="wrap">
        <h1>🚀 AI Landing Page Publisher</h1>

        <div id="ailp-notice" style="margin:10px 0;"></div>

        <div style="display:flex;gap:24px;margin-top:20px;align-items:flex-start;">
            <!-- Main Card -->
            <div style="flex:1;max-width:700px;background:#fff;border:1px solid #c3c4c7;border-radius:6px;padding:24px;">
                <h2 style="margin-top:0;">Licence & Connection</h2>

                <table class="form-table" role="presentation">
                    <tr>
                        <th scope="row"><label for="ailp-api-key">Project API Token</label></th>
                        <td>
                            <div style="display:flex;gap:8px;align-items:center;">
                                <input type="password" id="ailp-api-key" value="<?php echo esc_attr($api_key); ?>"
                                    class="regular-text" placeholder="Paste your project token here"
                                    autocomplete="new-password" />
                                <button type="button" id="ailp-verify-btn" class="button button-primary">Verify &
                                    Activate</button>
                            </div>
                            <p class="description">Copy your <strong>API Token</strong> from the SaaS dashboard Project
                                Settings.</p>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">Status</th>
                        <td>
                            <span id="ailp-status-badge" style="
                                display:inline-block;
                                padding:4px 14px;
                                border-radius:4px;
                                font-weight:700;
                                font-size:12px;
                                background:<?php echo $status === 'active' ? '#00a32a' : '#d63638'; ?>;
                                color:#fff;
                            ">
                                <?php echo $status === 'active' ? '✅ ACTIVE' : '❌ INACTIVE'; ?>
                            </span>
                            <?php if ($target): ?>
                                <p class="description" style="margin-top:6px;">Connected to:
                                    <code><?php echo esc_html($target); ?></code></p>
                            <?php
    endif; ?>
                        </td>
                    </tr>
                    <?php if ($paths): ?>
                        <tr>
                            <th scope="row">Proxied Slugs</th>
                            <td>
                                <?php foreach (explode(',', str_replace(array("\r", "\n"), ',', $paths)) as $p): ?>
                                    <?php $p = trim($p);
            if ($p): ?>
                                        <code
                                            style="display:inline-block;margin:2px 4px 2px 0;">/<?php echo esc_html(ltrim($p, '/')); ?></code>
                                    <?php
            endif; ?>
                                <?php
        endforeach; ?>
                            </td>
                        </tr>
                    <?php
    endif; ?>
                </table>
            </div>

            <!-- Help Card -->
            <div style="width:280px;background:#fff;border:1px solid #c3c4c7;border-radius:6px;padding:20px;">
                <h3 style="margin-top:0;">📋 How it works</h3>
                <ol style="padding-left:18px;font-size:13px;line-height:1.7;">
                    <li>Create a project on your SaaS dashboard.</li>
                    <li>Publish a landing page with a slug (e.g. <code>roofing</code>).</li>
                    <li>Download the plugin & paste your API Key above.</li>
                    <li>Click <strong>Verify & Activate</strong>.</li>
                    <li>Visit <code>http://yoursite.com/roofing</code> — done! ✅</li>
                </ol>
                <p style="font-size:13px;">Your existing WordPress pages, admin, and all other URLs are <strong>completely
                        unaffected</strong>.</p>
            </div>
        </div>
    </div>

    <script>
        (function ($) {
            $('#ailp-verify-btn').on('click', function () {
                var btn = $(this);
                var apiKey = $('#ailp-api-key').val().trim();
                var notice = $('#ailp-notice');

                if (!apiKey) {
                    notice.html('<div class="notice notice-error"><p>Please enter an API key.</p></div>');
                    return;
                }

                btn.prop('disabled', true).text('Verifying…');
                notice.html('');

                $.post(ajaxurl, {
                    action: 'ailp_verify',
                    api_key: apiKey,
                    nonce: '<?php echo esc_js(wp_create_nonce('ailp_verify')); ?>'
                }, function (resp) {
                    btn.prop('disabled', false).text('Verify & Activate');
                    if (resp.success) {
                        notice.html('<div class="notice notice-success"><p>' + resp.data.message + '</p></div>');
                        // Refresh badge
                        $('#ailp-status-badge').css('background', '#00a32a').text('✅ ACTIVE');
                    } else {
                        notice.html('<div class="notice notice-error"><p>' + resp.data.message + '</p></div>');
                    }
                }).fail(function () {
                    btn.prop('disabled', false).text('Verify & Activate');
                    notice.html('<div class="notice notice-error"><p>Request failed. Is your SaaS backend running?</p></div>');
                });
            });
        })(jQuery);
    </script>
    <?php
}

// ── AJAX: Verify API Key with SaaS backend ────────────────────────────────────

function ailp_ajax_verify()
{
    check_ajax_referer('ailp_verify', 'nonce');

    if (!current_user_can('manage_options')) {
        wp_send_json_error(array('message' => 'Insufficient permissions.'));
    }

    $api_key = isset($_POST['api_key']) ? trim(sanitize_text_field(wp_unslash($_POST['api_key']))) : '';

    if ($api_key === '') {
        wp_send_json_error(array('message' => 'API key is required.'));
    }

    // Call the SaaS backend to verify
    $parts = explode('@@', $api_key, 2);

    // Default backend if not provided in the token. 
    // Using the current detected machine IP (192.168.1.7) for local network reliability.
    $default_backend = 'http://192.168.1.7:5000';

    if (count($parts) === 2) {
        $endpoint = trim($parts[0]);
        $token = trim($parts[1]);
    }
    else {
        $endpoint = $default_backend;
        $token = $api_key;
    }

    if ($endpoint === '' || !filter_var($endpoint, FILTER_VALIDATE_URL)) {
        wp_send_json_error(array('message' => 'Invalid API token or backend URL configuration.'));
    }

    // Make sure endpoint points to verify
    if (strpos($endpoint, '/plugin/verify') === false) {
        $endpoint = rtrim($endpoint, '/') . '/plugin/verify';
    }

    $calling_domain = home_url();

    $response = wp_remote_post(esc_url_raw($endpoint), array(
        'timeout' => 15,
        'headers' => array('Content-Type' => 'application/json'),
        'body' => wp_json_encode(array(
            'api_key' => $token,
            'domain' => $calling_domain,
        )),
    ));

    if (is_wp_error($response)) {
        wp_send_json_error(array('message' => 'Could not reach backend: ' . $response->get_error_message()));
    }

    $code = wp_remote_retrieve_response_code($response);
    $body = json_decode(wp_remote_retrieve_body($response), true);

    if ($code !== 200 || !isset($body['status']) || $body['status'] !== 'active') {
        $msg = isset($body['message']) ? $body['message'] : 'Verification failed (HTTP ' . $code . ')';
        wp_send_json_error(array('message' => $msg));
    }

    // Save verified settings
    $settings = get_option(AILP_OPTION, array());
    $settings['api_key'] = $api_key;
    $settings['status'] = 'active';
    // Mapping from backend response: target_url -> target_domain, allowed_paths -> allowed_paths
    $settings['target_domain'] = isset($body['target_url']) ? $body['target_url'] : '';
    $settings['allowed_paths'] = isset($body['allowed_paths']) ? implode("\n", (array)$body['allowed_paths']) : '';
    update_option(AILP_OPTION, $settings);

    // Re-register rewrite rules with the new paths
    ailp_register_rewrite_rules();
    flush_rewrite_rules();

    $project_name = isset($body['projectName']) ? $body['projectName'] : 'Project';
    $paths_display = isset($body['allowed_paths']) ? implode(', ', (array)$body['allowed_paths']) : '';
    wp_send_json_success(array(
        'message' => '✅ Activated! "' . esc_html($project_name) . '" is live: ' . esc_html($paths_display),
    ));
}

// ── AJAX: Flush rewrite rules ─────────────────────────────────────────────────

function ailp_ajax_flush()
{
    check_ajax_referer('ailp_verify', 'nonce');
    flush_rewrite_rules();
    wp_send_json_success(array('message' => 'Rewrite rules flushed.'));
}