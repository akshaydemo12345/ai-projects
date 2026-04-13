<?php
/**
 * Plugin Name:       Domain Mapper SaaS
 * Plugin URI:        https://your-saas.com
 * Description:       Maps DomainA → DomainB via reverse proxy, keeping DomainB URL in browser.
 * Version:           1.1.0
 * Requires at least: 5.8
 * Requires PHP:      7.4
 * Author:            Your SaaS Company
 * License:           Proprietary
 * Text Domain:       domain-mapper
 *
 * @package DomainMapper
 */

defined( 'ABSPATH' ) || exit;

define( 'DM_VERSION',      '1.1.0' );
define( 'DM_FILE',         __FILE__ );
define( 'DM_DIR',          plugin_dir_path( __FILE__ ) );
define( 'DM_URL',          plugin_dir_url( __FILE__ ) );
define( 'DM_OPTION',       'dm_settings' );
define( 'DM_LOG_FILE',     WP_CONTENT_DIR . '/dm-debug.log' );
define( 'DM_API_BASE',     'http://192.168.1.24:5000' );

require_once DM_DIR . 'includes/class-cache.php';
require_once DM_DIR . 'includes/class-api.php';
require_once DM_DIR . 'includes/class-auto-detect.php';
require_once DM_DIR . 'includes/class-rewriter.php';
require_once DM_DIR . 'includes/class-proxy.php';
require_once DM_DIR . 'includes/class-form-interceptor.php';
require_once DM_DIR . 'admin/settings-page.php';

register_activation_hook( DM_FILE,   [ 'DomainMapper_Loader', 'activate' ] );
register_deactivation_hook( DM_FILE, [ 'DomainMapper_Loader', 'deactivate' ] );
add_action( 'plugins_loaded', [ 'DomainMapper_Loader', 'init' ] );

final class DomainMapper_Loader {

    private static ?DomainMapper_Loader $instance = null;
    public DomainMapper_API      $api;
    public DomainMapper_Proxy    $proxy;
    public DomainMapper_Rewriter $rewriter;
    public DomainMapper_Cache    $cache;
    private array $settings = [];

    // ── Activation ────────────────────────────────────────────────────────────

    public static function activate(): void {
        $defaults = [
            'api_key'       => '',
            'source_domain' => '',
            'target_domain' => '',
            'cache_time'    => 300,
            'plan'          => '',
            'status'        => 'inactive',
            'debug_mode'    => false,
            'last_verified' => 0,
        ];
        if ( ! get_option( DM_OPTION ) ) {
            // Auto-populate with detected values before saving
            $defaults = DomainMapper_AutoDetect::auto_populate( $defaults );
            add_option( DM_OPTION, $defaults, '', 'no' );
        }

        // Auto-apply .htaccess rules on activation
        self::write_htaccess();

        // NOTE: We intentionally do NOT write .htaccess rules or register a
        // global catch-all rewrite rule on activation.  Doing so broke Divi
        // Builder and every other aspect of the live site before the admin had
        // a chance to configure anything.  Rewrite rules are only injected
        // via the admin "Apply .htaccess" button once specific paths are set.

        if ( ! wp_next_scheduled( 'dm_hourly_sync' ) ) {
            wp_schedule_event( time(), 'hourly', 'dm_hourly_sync' );
        }
        self::log( 'Plugin activated.', true );
    }

    public static function deactivate(): void {
        wp_clear_scheduled_hook( 'dm_hourly_sync' );
        DomainMapper_Cache::flush_all();
        // Only restore .htaccess if our block is present (i.e. admin applied it).
        self::restore_htaccess();
        flush_rewrite_rules();

        // Remove all settings on deactivation as per user requirement.
        delete_option( DM_OPTION );

        self::log( 'Plugin deactivated. Settings wiped.', true );
    }

    // ── .htaccess management ──────────────────────────────────────────────────

    /**
     * Inject Domain Mapper rewrite rules into the root .htaccess.
     *
     * Rules are scoped to the configured allowed_paths only.
     * Everything else (Divi Builder, REST API, uploads, themes, etc.)
     * is left completely untouched.
     */
    public static function write_htaccess(): void {
        $htaccess = ABSPATH . '.htaccess';

        // Build per-path RewriteRules from the allowed_paths setting.
        $settings = get_option( DM_OPTION, [] );
        $raw_paths = $settings['allowed_paths'] ?? '';
        $path_rules = '';
        
        if ( ! empty( $raw_paths ) ) {
            // Specific paths configured — create rules for each
            foreach ( preg_split( '/[\r\n,]+/', $raw_paths ) as $line ) {
                $line = trim( $line );
                if ( $line !== '' ) {
                    $is_wildcard = false;
                    if ( str_ends_with( $line, '/*' ) ) {
                        $is_wildcard = true;
                        $line = rtrim( substr( $line, 0, -2 ), '/' );
                    }

                    $line = trim( $line, '/\\s' );
                    $escaped = preg_quote( $line, '#' );

                    if ( $is_wildcard ) {
                        $path_rules .= "    RewriteRule ^{$escaped}(/.*)?$ index.php [QSA,L]\n";
                    } else {
                        $path_rules .= "    RewriteRule ^{$escaped}/?$ index.php [QSA,L]\n";
                    }
                }
            }
        }

        if ( empty( $path_rules ) ) {
            // No specific paths — NO global rules. 
            // This prevents the plugin from breaking the site before paths are synced.
            $path_rules = "    # No paths configured yet. Site runs normally.\n";
        }

        $dm_block = <<<HTACCESS
# BEGIN DomainMapper
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /

    # ── 1. Always serve WordPress core & admin paths directly ────────────
    RewriteRule ^wp-admin(/.*)?$                        -   [L]
    RewriteRule ^wp-login\.php                          -   [L]
    RewriteRule ^wp-cron\.php                           -   [L]
    RewriteRule ^xmlrpc\.php                            -   [L]
    RewriteRule ^wp-includes/(.*)$                      -   [L]

    # ── 2. Always serve this plugin's own files directly ─────────────────
    RewriteRule ^wp-content/plugins/(.*)$               -   [L]

    # ── 3. Always serve themes, uploads and other wp-content directly ─────
    RewriteRule ^wp-content/(.*)$                       -   [L]

    # ── 4. Route proxy paths through index.php ────────────────────────────
$path_rules
</IfModule>
# END DomainMapper
HTACCESS;

        if ( ! file_exists( $htaccess ) ) {
            // phpcs:ignore WordPress.WP.AlternativeFunctions.file_system_operations_file_put_contents
            file_put_contents( $htaccess, $dm_block . "\n" );
            self::log( '.htaccess created with path-specific rules.', true );
            return;
        }

        $current = file_get_contents( $htaccess );

        // Already has our block — replace it.
        if ( strpos( $current, '# BEGIN DomainMapper' ) !== false ) {
            $current = preg_replace(
                '#\# BEGIN DomainMapper.*?\# END DomainMapper\s*#s',
                $dm_block . "\n",
                $current
            );
        } else {
            // Prepend before the WordPress block so DM rules win.
            $current = $dm_block . "\n" . $current;
        }

        // phpcs:ignore WordPress.WP.AlternativeFunctions.file_system_operations_file_put_contents
        file_put_contents( $htaccess, $current );
        self::log( '.htaccess updated with path-specific rules.', true );
    }

    /**
     * Remove the DomainMapper block from .htaccess on deactivation.
     */
    public static function restore_htaccess(): void {
        $htaccess = ABSPATH . '.htaccess';
        if ( ! file_exists( $htaccess ) ) {
            return;
        }
        $current = file_get_contents( $htaccess );
        if ( strpos( $current, '# BEGIN DomainMapper' ) === false ) {
            return; // Nothing to remove.
        }
        $cleaned = preg_replace(
            '#\# BEGIN DomainMapper.*?\# END DomainMapper\s*#s',
            '',
            $current
        );
        // phpcs:ignore WordPress.WP.AlternativeFunctions.file_system_operations_file_put_contents
        file_put_contents( $htaccess, $cleaned );
        self::log( '.htaccess restored.', true );
    }

    // ── Bootstrap ─────────────────────────────────────────────────────────────

    public static function init(): void {
        if ( null === self::$instance ) {
            self::$instance = new self();
            self::$instance->check_domain_change();
        }
    }

    /**
     * Automatically detect domain change and reset verification if needed.
     */
    private function check_domain_change(): void {
        if ( is_admin() || wp_doing_ajax() || wp_doing_cron() ) {
            return;
        }

        $current_host = sanitize_text_field( $_SERVER['HTTP_HOST'] ?? '' );
        $stored_host  = $this->settings['verified_domain'] ?? '';

        if ( ! empty( $stored_host ) && $current_host !== $stored_host ) {
             self::log( "Domain change detected: {$stored_host} -> {$current_host}. Resetting verification.", true );
             $this->settings['status'] = 'inactive';
             $this->settings['verified_domain'] = '';
             update_option( DM_OPTION, $this->settings );
        }

        // Auto-verify in background if inactive or time elapsed (e.g. 24h)
        $last_v = (int) ( $this->settings['last_verified'] ?? 0 );
        if ( $this->settings['status'] !== 'active' || ( time() - $last_v ) > DAY_IN_SECONDS ) {
            if ( ! empty( $this->settings['api_key'] ) ) {
                // We use a non-blocking check or just do it once per hour via cron, 
                // but for "auto-background" on init, we can do it if status is inactive.
                if ( $this->settings['status'] !== 'active' ) {
                   $this->api->verify( true );
                }
            }
        }
    }

    public static function instance(): DomainMapper_Loader {
        return self::$instance;
    }

    private function __construct() {
        $this->settings = $this->load_settings();
        $this->cache    = new DomainMapper_Cache( $this->settings );
        $this->api      = new DomainMapper_API( $this->settings, $this->cache );
        $this->rewriter = new DomainMapper_Rewriter( $this->settings );
        $this->proxy    = new DomainMapper_Proxy( $this->settings, $this->cache, $this->rewriter, $this->api );

        $this->register_hooks();
    }

    private function load_settings(): array {
        $defaults = [
            'api_key'         => '',
            'source_domain'   => '',
            'target_domain'   => '',
            'cache_time'      => 300,
            'plan'            => '',
            'status'          => 'inactive',
            'debug_mode'      => false,
            'last_verified'   => 0,
            'allowed_paths'   => '',
            'verified_domain' => '',
        ];
        $stored = get_option( DM_OPTION, [] );
        return wp_parse_args( is_array( $stored ) ? $stored : [], $defaults );
    }

    private function register_hooks(): void {
        // Admin.
        if ( is_admin() ) {
            $admin = new DomainMapper_Settings_Page( $this->settings, $this->api );
            add_action( 'admin_menu',            [ $admin, 'register_menu' ] );
            add_action( 'admin_init',            [ $admin, 'register_settings' ] );
            add_action( 'admin_notices',         [ $admin, 'admin_notices' ] );
            add_action( 'admin_enqueue_scripts', [ $admin, 'enqueue_scripts' ] );
            // Button to re-apply htaccess.
            add_action( 'wp_ajax_dm_rewrite_htaccess', [ $this, 'ajax_rewrite_htaccess' ] );
        }

        // REST API for remote cache flushing.
        add_action( 'rest_api_init', [ $this, 'register_rest_routes' ] );

        // Proxy — priority 1, before anything else.
        // The proxy's intercept() checks is_path_allowed() internally and
        // returns early when no paths are configured, so it is safe to register
        // unconditionally here.
        add_action( 'init', [ $this->proxy, 'intercept' ], 1 );
        add_action( 'template_redirect', [ $this->proxy, 'maybe_proxy_404' ] );

        // Only disable canonical redirects for paths that are actively proxied.
        // This prevents disrupting Divi Builder and native WP pages.
        add_filter( 'redirect_canonical', [ $this, 'maybe_disable_canonical' ], 1 );

        // Only bypass 404 handling for paths that are actively proxied.
        add_filter( 'pre_handle_404', [ $this, 'maybe_bypass_404' ], 1, 2 );

        // NOTE: We do NOT register a global catch-all rewrite rule.
        // A catch-all ^(.+)/?$ → index.php intercepts every page including
        // Divi Builder AJAX requests and core WP REST endpoints.  The proxy
        // works correctly at the PHP level via the 'init' hook above.

        // Cron.
        add_action( 'dm_hourly_sync', [ $this->api, 'sync' ] );

        // i18n.
        add_action( 'init', [ $this, 'load_textdomain' ] );
    }

    /**
     * Disable canonical redirects when proxy is active.
     *
     * @param  string|false $redirect_url
     * @return string|false
     */
    public function maybe_disable_canonical( $redirect_url ) {
        $uri = $_SERVER['REQUEST_URI'] ?? '/';
        // Only suppress canonical redirect for paths the proxy will actually serve.
        if ( ! is_admin() && $this->proxy->is_proxied_path( $uri ) ) {
            return false;
        }
        return $redirect_url;
    }

    /**
     * Prevent WordPress from showing its 404 page for unknown paths.
     * Only applicable to paths that the proxy is configured to handle.
     *
     * @param  bool      $bypass
     * @param  \WP_Query $q
     * @return bool
     */
    public function maybe_bypass_404( bool $bypass, $q ): bool {
        $uri = $_SERVER['REQUEST_URI'] ?? '/';
        // Only bypass 404 for paths the proxy will actually serve.
        if ( ! is_admin() && $this->proxy->is_proxied_path( $uri ) ) {
            return true;
        }
        return $bypass;
    }

    /** AJAX: re-apply .htaccess rules without deactivating the plugin. */
    public function ajax_rewrite_htaccess(): void {
        check_ajax_referer( 'dm_admin_nonce', 'nonce' );
        if ( ! current_user_can( 'manage_options' ) ) {
            wp_send_json_error();
        }
        self::write_htaccess();
        wp_send_json_success( [ 'message' => '.htaccess updated successfully.' ] );
    }

    /** ── REST API ───────────────────────────────────────────────────────────── */

    public function register_rest_routes(): void {
        register_rest_route( 'domain-mapper/v1', '/flush', [
            'methods'             => 'POST',
            'callback'            => [ $this, 'rest_flush_cache' ],
            'permission_callback' => [ $this, 'check_rest_permission' ],
        ] );
    }

    /**
     * Verify that the request comes from our backend using the API key.
     */
    public function check_rest_permission( \WP_REST_Request $request ): bool {
        $header_key = $request->get_header( 'X-DM-API-Key' );
        $stored_key = $this->settings['api_key'] ?? '';

        if ( empty( $stored_key ) ) {
            return false;
        }

        // Exact match of the configured API key.
        return hash_equals( $stored_key, (string) $header_key );
    }

    /**
     * Trigger a full cache flush.
     */
    public function rest_flush_cache( \WP_REST_Request $request ): \WP_REST_Response {
        DomainMapper_Cache::flush_all();
        self::log( 'REST: Full cache flush triggered by backend.', true );

        return new \WP_REST_Response( [
            'ok'      => true,
            'message' => __( 'Cache flushed successfully.', 'domain-mapper' ),
        ], 200 );
    }

    public function load_textdomain(): void {
        load_plugin_textdomain( 'domain-mapper', false, dirname( plugin_basename( DM_FILE ) ) . '/languages' );
    }

    public static function log( string $message, bool $force = false ): void {
        $settings = get_option( DM_OPTION, [] );
        if ( empty( $settings['debug_mode'] ) && ! $force ) {
            return;
        }
        $entry = sprintf( "[%s] %s\n", gmdate( 'Y-m-d H:i:s' ), $message );
        // phpcs:ignore WordPress.WP.AlternativeFunctions.file_system_operations_file_put_contents
        file_put_contents( DM_LOG_FILE, $entry, FILE_APPEND | LOCK_EX );
    }
}
