<?php
/**
 * Admin Settings Page.
 *
 * Renders the plugin configuration UI in wp-admin:
 *  - API key field + live verification button
 *  - Licence status badge
 *  - Cache control
 *
 * NOTE: Developer settings (Source/Target domain) are hidden and auto-managed.
 *
 * @package DomainMapper
 */

defined('ABSPATH') || exit;

/**
 * Class DomainMapper_Settings_Page
 */
class DomainMapper_Settings_Page
{

    /** Slug for the options group. */
    const OPTION_GROUP = 'dm_settings_group';

    /** Page slug. */
    const MENU_SLUG = 'domain-mapper';

    /** Capability required to access the page. */
    const CAPABILITY = 'manage_options';

    /** @var array<string,mixed> */
    private array $settings;

    /** @var DomainMapper_API */
    private DomainMapper_API $api;

    /**
     * @param array<string,mixed> $settings
     * @param DomainMapper_API    $api
     */
    public function __construct(array $settings, DomainMapper_API $api)
    {
        $this->settings = $settings;
        $this->api = $api;

        // AJAX handlers.
        add_action('wp_ajax_dm_verify_api', [$this, 'ajax_verify_api']);
        add_action('wp_ajax_dm_flush_cache', [$this, 'ajax_flush_cache']);
        add_action('wp_ajax_dm_view_log', [$this, 'ajax_view_log']);
        add_action('wp_ajax_dm_clear_log', [$this, 'ajax_clear_log']);
    }

    // ── Menu registration ─────────────────────────────────────────────────────

    public function register_menu(): void
    {
        add_options_page(
            __('Domain Mapper', 'domain-mapper'),
            __('Domain Mapper', 'domain-mapper'),
            self::CAPABILITY,
            self::MENU_SLUG,
            [$this, 'render_page']
        );
    }

    // ── Settings registration ─────────────────────────────────────────────────

    public function register_settings(): void
    {
        register_setting(
            self::OPTION_GROUP,
            DM_OPTION,
            [
                'sanitize_callback' => [$this, 'sanitize_settings'],
            ]
        );

        // ── Section: Licence ──────────────────────────────────────────────
        add_settings_section(
            'dm_section_licence',
            __('Licence & API', 'domain-mapper'),
            '__return_false',
            self::MENU_SLUG
        );

        add_settings_field(
            'dm_api_key',
            __('API Key', 'domain-mapper'),
            [$this, 'field_api_key'],
            self::MENU_SLUG,
            'dm_section_licence'
        );

        add_settings_field(
            'dm_status',
            __('Licence Status', 'domain-mapper'),
            [$this, 'field_status'],
            self::MENU_SLUG,
            'dm_section_licence'
        );

        // Sections for fields that are technically required but hidden from users.
        add_settings_section('dm_section_hidden', '', '__return_false', self::MENU_SLUG);
    }

    /**
     * Sanitise all incoming settings values.
     */
    public function sanitize_settings($raw): array
    {
        if (!is_array($raw)) {
            return $this->settings;
        }

        // 1. Get current settings from DB
        $current = get_option(DM_OPTION, []);
        $clean = is_array($current) ? $current : [];
        $old_key = trim((string) ($clean['api_key'] ?? ''));

        // 2. Get and sanitize new key
        $new_key = isset($raw['api_key']) ? $this->sanitize_api_key($raw['api_key']) : '';

        // STRICT: Do not allow saving an empty API Key
        if (empty($new_key)) {
            add_settings_error(DM_OPTION, 'api_key_empty', __('Error: API Key cannot be blank. Please enter a valid key.', 'domain-mapper'), 'error');
            return $this->settings;
        }

        // 3. Logic for Key Persistence and Verification
        $clean['api_key'] = $new_key; // Persist the key regardless of verification state (unless blank)

        if ($new_key !== $old_key) {
            // KEY CHANGED 
            $is_ajax_verified = isset($raw['verified_token']) && $raw['verified_token'] === md5($new_key . AUTH_KEY);

            if (!$is_ajax_verified) {
                // Save it but keep it INACTIVE
                $clean['status'] = 'inactive';
                $clean['last_verified'] = 0;
                add_settings_error(DM_OPTION, 'api_unverified', __('Notice: API Key saved, but you must click "Verify Now" to activate the service.', 'domain-mapper'), 'warning');
            } else {
                // Key was pre-verified via AJAX
                $clean['status'] = 'active';
                $clean['last_verified'] = time();
                DomainMapper_Cache::flush_all();
            }
        } else {
            // KEY UNCHANGED — Ensure it becomes active if a valid token is provided (manually clicking save after verify)
            $is_ajax_verified = isset($raw['verified_token']) && $raw['verified_token'] === md5($new_key . AUTH_KEY);
            if ($is_ajax_verified) {
                $clean['status'] = 'active';
                $clean['last_verified'] = time();
            }
        }

        // 4. Persistence of hidden fields
        if (empty($clean['source_domain']) || empty($clean['target_domain'])) {
            $clean = DomainMapper_AutoDetect::auto_populate($clean);
        }

        return $clean;
    }

    private function sanitize_api_key($key): string
    {
        $key = sanitize_text_field((string) $key);
        return trim(preg_replace('/[^a-zA-Z0-9_\-:@\/.]/', '', $key));
    }

    // ── Field renderers ───────────────────────────────────────────────────────

    public function field_api_key(): void
    {
        $value = $this->settings['api_key'] ?? '';
        $status = $this->settings['status'] ?? 'inactive';
        $verified_token = ('active' === $status) ? md5($value . AUTH_KEY) : '';
        ?>
                <div style="display:flex;gap:8px;align-items:center;">
                    <input
                        type="password"
                        id="dm_api_key"
                        name="<?php echo esc_attr(DM_OPTION); ?>[api_key]"
                        value="<?php echo esc_attr($value); ?>"
                        class="regular-text"
                        autocomplete="new-password"
                        placeholder="sk-xxxxxxxxxxxxxxxx"
                    />
                    <input type="hidden" id="dm_verified_token" name="<?php echo esc_attr(DM_OPTION); ?>[verified_token]" value="<?php echo esc_attr($verified_token); ?>" />
            
                    <button type="button" id="dm-verify-btn" class="button button-secondary">
                        <?php esc_html_e('Verify Now', 'domain-mapper'); ?>
                    </button>
                    <span id="dm-verify-status" style="margin-left:8px; font-weight: 600;"></span>
                </div>
                <p class="description"><?php esc_html_e('Enter your API key to activate the connection.', 'domain-mapper'); ?></p>
                <?php
    }

    public function field_status(): void
    {
        $status = $this->settings['status'] ?? 'inactive';
        $last_verified = $this->settings['last_verified'] ?? 0;

        $badge_color = ('active' === $status) ? '#0073aa' : '#d63638';
        $badge_text = ('active' === $status) ? '✅ Active' : '❌ Inactive';
        ?>
                <div id="dm-status-badge" style="
            display: inline-block;
            background: <?php echo esc_attr($badge_color); ?>;
            color: #fff;
            padding: 5px 15px;
            border-radius: 4px;
            font-weight: bold;
            text-transform: uppercase;
            font-size: 12px;
        ">
                    <?php echo esc_html($badge_text); ?>
                </div>
                <?php if ($last_verified): ?>
                        <p class="description"><?php printf('Verified %s ago', human_time_diff($last_verified)); ?></p>
                <?php endif; ?>
                <?php
    }

    // ── Page render ───────────────────────────────────────────────────────────

    public function render_page(): void
    {
        if (!current_user_can(self::CAPABILITY)) {
            wp_die(__('Insufficient permissions.', 'domain-mapper'));
        }
        ?>
                <div class="wrap" id="dm-settings-wrap">
                    <h1>🔀 <?php esc_html_e('Site Accelerator Settings', 'domain-mapper'); ?></h1>

                    <div id="dm-js-notices"></div>
                    <?php settings_errors(DM_OPTION); ?>

                    <div style="display:flex; gap:20px; margin-top:20px;">
                        <div style="flex:1; max-width:800px;">
                            <form method="post" action="options.php" id="dm-settings-form">
                                <div class="postbox" style="padding:20px;">
                                    <?php
                                    settings_fields(self::OPTION_GROUP);
                                    do_settings_sections(self::MENU_SLUG);
                                    ?>
                                </div>

                                <div style="margin-top:20px;">
                                    <?php
                                    submit_button(
                                        __('Save Settings', 'domain-mapper'),
                                        'primary',
                                        'submit',
                                        true,
                                        ['id' => 'dm-save-btn']
                                    );
                                    ?>
                                </div>

                                <!-- Developer settings are hidden from end users -->
                                <div style="display:none;">
                                    <input type="text" name="<?php echo esc_attr(DM_OPTION); ?>[source_domain]" value="<?php echo esc_attr($this->settings['source_domain'] ?? ''); ?>" />
                                    <input type="text" name="<?php echo esc_attr(DM_OPTION); ?>[target_domain]" value="<?php echo esc_attr($this->settings['target_domain'] ?? ''); ?>" />
                                    <input type="checkbox" name="<?php echo esc_attr(DM_OPTION); ?>[debug_mode]" value="1" <?php checked(!empty($this->settings['debug_mode'])); ?> />
                                </div>
                            </form>
                        </div>

                        <div style="width:300px;">
                            <div class="postbox" style="padding:15px;">
                                <h3 style="margin-top:0;">⚡ Performance</h3>
                                <p class="description">Automatic cache synchronization is enabled. Changes on your dashboard reflect here instantly.</p>
                                <hr>
                                <button type="button" id="dm-flush-cache-btn" class="button button-link" style="color:#d63638; padding:0;">
                                    🗑 Manual Flush Cache (Fallback)
                                </button>
                                <span id="dm-flush-status" style="display:block; margin-top:5px; font-size:11px;"></span>
                            </div>
                        </div>
                    </div>
                </div>
                <?php
    }

    /**
     * Admin notices.
     */
    public function admin_notices(): void
    {
        $screen = get_current_screen();
        if (!$screen || 'settings_page_' . self::MENU_SLUG !== $screen->id) {
            return;
        }

        $status = $this->settings['status'] ?? 'inactive';
        if ('inactive' === $status && !empty($this->settings['api_key'])) {
            printf(
                '<div id="dm-notice-inactive" class="notice notice-warning is-dismissible"><p><strong>Domain Mapper:</strong> %s</p></div>',
                esc_html__('Licence is inactive. Please verify your API Key.', 'domain-mapper')
            );
        }
    }

    /**
     * Enqueue scripts.
     */
    public function enqueue_scripts(string $hook): void
    {
        if ('settings_page_' . self::MENU_SLUG !== $hook) {
            return;
        }

        wp_enqueue_script(
            'dm-admin',
            DM_URL . 'admin/admin.js',
            ['jquery'],
            DM_VERSION,
            true
        );

        wp_localize_script('dm-admin', 'dmAdmin', [
            'nonce' => wp_create_nonce('dm_admin_nonce'),
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'i18n' => [
                'verifying' => __('Verifying...', 'domain-mapper'),
                'failed' => __('Verification failed', 'domain-mapper'),
                'flushing' => __('Flushing...', 'domain-mapper'),
            ],
        ]);
    }

    // ── AJAX handlers ─────────────────────────────────────────────────────────

    public function ajax_verify_api(): void
    {
        check_ajax_referer('dm_admin_nonce', 'nonce');

        $api_key = isset($_POST['api_key']) ? $this->sanitize_api_key($_POST['api_key']) : '';

        if (empty($api_key) || strlen($api_key) < 10) {
            wp_send_json_error(['message' => 'API Key is too short.']);
        }

        $response = wp_remote_post('http://my-ai-backend.test:5000/verify-api-key', [
            'timeout' => 15,
            'headers' => ['Content-Type' => 'application/json'],
            'body' => json_encode(['api_key' => $api_key])
        ]);

        if (is_wp_error($response)) {
            wp_send_json_error(['message' => 'Connection to server failed.']);
        }

        $body = json_decode(wp_remote_retrieve_body($response), true);

        if (isset($body['status']) && 'active' === $body['status']) {
            wp_send_json_success([
                'message' => 'API Verified Successfully',
                'token' => md5($api_key . AUTH_KEY)
            ]);
        } else {
            wp_send_json_error(['message' => $body['message'] ?? 'Invalid API Key']);
        }
    }

    public function ajax_flush_cache(): void
    {
        check_ajax_referer('dm_admin_nonce', 'nonce');
        DomainMapper_Cache::flush_all();
        wp_send_json_success(['message' => 'Cache cleared.']);
    }

    public function ajax_view_log(): void
    {
        check_ajax_referer('dm_admin_nonce', 'nonce');
        if (!file_exists(DM_LOG_FILE)) {
            wp_send_json_success(['log' => '']);
            return;
        }
        $log = file_get_contents(DM_LOG_FILE);
        wp_send_json_success(['log' => $log]);
    }

    public function ajax_clear_log(): void
    {
        check_ajax_referer('dm_admin_nonce', 'nonce');
        if (file_exists(DM_LOG_FILE)) {
            file_put_contents(DM_LOG_FILE, '');
        }
        wp_send_json_success();
    }
}
