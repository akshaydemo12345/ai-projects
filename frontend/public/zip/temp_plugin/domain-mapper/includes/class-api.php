<?php
/**
 * API subsystem.
 *
 * Handles all communication with the remote SaaS verification endpoint.
 *
 * @package DomainMapper
 */

defined( 'ABSPATH' ) || exit;

class DomainMapper_API {

    private array $settings;
    private DomainMapper_Cache $cache;
    const TIMEOUT = 15;

    public function __construct( array $settings, DomainMapper_Cache $cache ) {
        $this->settings = $settings;
        $this->cache    = $cache;
    }

    public function verify( bool $force = false ): array {
        $token = $this->settings['api_key'] ?? '';
        
        if ( empty( $token ) ) {
            return $this->error_result( __( 'API Key is required.', 'domain-mapper' ) );
        }

        // ── Dynamic Token Logic ──
        $raw = $token;
        if ( strpos( $token, '@@' ) === false ) {
            $decoded = base64_decode( $token, true );
            if ( $decoded && strpos( $decoded, '@@' ) !== false ) {
                $raw = $decoded;
            }
        }

        // Use the hardcoded backend URL for this project if no custom endpoint is provided in the key.
        if ( strpos( $raw, '@@' ) === false ) {
             $endpoint = 'http://my-ai-backend.test:5000/plugin/verify';
             $api_key  = $raw;
        } else {
             list( $endpoint, $api_key ) = explode( '@@', $raw, 2 );
             // Map legacy /plugin/verify if provided in string
             if (!str_contains($endpoint, '/plugin/verify')) {
                 $endpoint = rtrim($endpoint, '/') . '/plugin/verify';
             }
        }
        
        $endpoint = esc_url_raw( $endpoint );

        // Automatically use current host if not configured.
        $domain = empty($this->settings['source_domain']) ? ($_SERVER['HTTP_HOST'] ?? '') : $this->settings['source_domain'];

        if ( empty( $api_key ) || empty( $domain ) ) {
            return $this->error_result( __( 'API Key and Domain are required.', 'domain-mapper' ) );
        }

        // Cache check.
        if ( ! $force ) {
            $cached = $this->cache->get_api( $token );
            if ( is_array( $cached ) ) {
                return $this->parse_response( $cached );
            }
        }

        $response = wp_remote_post(
            $endpoint,
            [
                'timeout'    => self::TIMEOUT,
                'user-agent' => 'SiteAccelerator/' . DM_VERSION . '; ' . home_url(),
                'sslverify'  => false, // Disabled for local testing environments
                'body'       => [
                    'api_key' => sanitize_text_field( $api_key ),
                    'domain'  => sanitize_text_field( $domain ),
                ],
                'headers'    => [
                    'Accept'       => 'application/json',
                    'X-DM-Version' => DM_VERSION,
                ],
            ]
        );

        if ( is_wp_error( $response ) ) {
            $msg = $response->get_error_message();
            DomainMapper_Loader::log( 'API error: ' . $msg, true );
            $this->mark_inactive( $msg );
            return $this->error_result( $msg );
        }

        $code = (int) wp_remote_retrieve_response_code( $response );
        $body = wp_remote_retrieve_body( $response );

        if ( $code !== 200 ) {
            $data = json_decode( $body, true );
            $msg  = ( ! empty( $data['message'] ) ) ? (string) $data['message'] : 'Invalid API Key';
            $this->mark_inactive( $msg );
            return $this->error_result( $msg );
        }

        $data = json_decode( $body, true );
        if ( ! is_array( $data ) ) {
            return $this->error_result( 'Invalid server response' );
        }

        $result = $this->parse_response( $data );

        if ( $result['ok'] ) {
            $ttl = max( 60, (int) ( $data['cache_time'] ?? 300 ) );
            $this->cache->set_api( $token, $data, $ttl );
            $this->update_options( $data );
        } else {
            $this->mark_inactive( $result['message'] );
        }

        return $result;
    }

    public function sync(): void {
        $this->verify( true );
    }

    public function is_active(): bool {
        return 'active' === ( $this->settings['status'] ?? '' );
    }

    private function parse_response( array $data ): array {
        $status = sanitize_key( $data['status'] ?? '' );
        if ( 'active' !== $status ) {
            return $this->error_result( 'License is not active' );
        }

        return [
            'ok'      => true,
            'message' => 'License active.',
            'data'    => $data,
        ];
    }

    private function error_result( string $message, array $data = [] ): array {
        return [ 'ok' => false, 'message' => $message, 'data' => $data ];
    }

    private function update_options( array $data ): void {
        $stored = get_option( DM_OPTION, [] );
        $stored = is_array( $stored ) ? $stored : [];

        $stored['status']        = 'active';
        $stored['plan']          = sanitize_text_field( $data['plan'] ?? '' );
        $stored['cache_time']    = max( 60, (int) ( $data['cache_time'] ?? 300 ) );
        $stored['last_verified'] = time();

        // Source domain (DomainA).
        if ( ! empty( $data['source_url'] ) ) {
            $stored['source_domain'] = (string) preg_replace( '#^https?://#i', '', rtrim( $data['source_url'], '/' ) );
        }

        // Target domain (DomainB).
        if ( ! empty( $data['target_url'] ) ) {
            $stored['target_domain'] = (string) rtrim( $data['target_url'], '/' );
        }

        // Allowed paths.
        if ( isset( $data['allowed_paths'] ) ) {
            $paths = is_array( $data['allowed_paths'] ) ? implode( "\n", $data['allowed_paths'] ) : (string) $data['allowed_paths'];
            $prev  = $stored['allowed_paths'] ?? '';
            $stored['allowed_paths'] = sanitize_textarea_field( $paths );
            
            if ( $stored['allowed_paths'] !== $prev ) {
                add_action( 'shutdown', [ 'DomainMapper_Loader', 'write_htaccess' ] );
            }
        }

        $this->settings = $stored;
        update_option( DM_OPTION, $stored, 'no' );
    }

    private function mark_inactive( string $reason ): void {
        $stored = get_option( DM_OPTION, [] );
        $stored['status']     = 'inactive';
        $stored['last_error'] = $reason;
        update_option( DM_OPTION, $stored, 'no' );
    }
}
