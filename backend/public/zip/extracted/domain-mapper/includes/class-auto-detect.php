<?php
/**
 * Auto-detection utilities for Domain Mapper
 *
 * Automatically detects and validates:
 * - Source Domain (WordPress domain)
 * - Target Domain (Backend domain)
 *
 * @package DomainMapper
 */

defined( 'ABSPATH' ) || exit;

class DomainMapper_AutoDetect {

    /**
     * Get the current WordPress domain (Source Domain)
     *
     * @return string The domain name without scheme or port (e.g., "my-wordpress-site.test")
     */
    public static function get_source_domain(): string {
        // Parse home_url to get domain
        $home_url = home_url();
        $parsed   = wp_parse_url( $home_url );
        $host     = $parsed['host'] ?? '';

        if ( empty( $host ) ) {
            return '';
        }

        // Remove port if present
        if ( strpos( $host, ':' ) !== false ) {
            list( $host ) = explode( ':', $host, 2 );
        }

        return strtolower( trim( $host ) );
    }

    /**
     * Detect target domain from API Key format
     *
     * The API key can be in format: http://127.0.0.1:5000@@token
     *
     * @param string $api_key The API key with optional endpoint
     * @return string The target domain (e.g., "127.0.0.1:5000")
     */
    public static function get_target_domain_from_api_key( $api_key ): string {
        $api_key = (string) $api_key;

        // Try to decode if base64 encoded
        if ( strpos( $api_key, '@@' ) === false ) {
            $decoded = base64_decode( $api_key, true );
            if ( $decoded && strpos( $decoded, '@@' ) !== false ) {
                $api_key = $decoded;
            }
        }

        // Extract domain from endpoint@@token format
        if ( strpos( $api_key, '@@' ) !== false ) {
            list( $endpoint ) = explode( '@@', $api_key, 2 );
            $endpoint = trim( $endpoint );

            if ( ! empty( $endpoint ) && filter_var( $endpoint, FILTER_VALIDATE_URL ) ) {
                $parsed = wp_parse_url( $endpoint );
                $host   = $parsed['host'] ?? '';
                $port   = $parsed['port'] ?? '';

                if ( ! empty( $host ) ) {
                    return $port ? "{$host}:{$port}" : $host;
                }
            }
        }

        return '';
    }

    /**
     * Get default target domain (localhost fallback)
     *
     * @return string Default backend domain
     */
    public static function get_default_target_domain(): string {
        return '127.0.0.1:5000';
    }

    /**
     * Validate domain format
     *
     * @param string $domain Domain to validate
     * @return bool True if domain is valid
     */
    public static function is_valid_domain( $domain ): bool {
        $domain = trim( $domain );

        // Allow domains with optional port: example.com:8080
        if ( preg_match( '/^[a-zA-Z0-9][a-zA-Z0-9\-\.]*[a-zA-Z0-9]+(:\d+)?$/', $domain ) ) {
            return true;
        }

        // Allow IP addresses with optional port: 127.0.0.1:5000
        if ( preg_match( '/^(\d{1,3}\.){3}\d{1,3}(:\d+)?$/', $domain ) ) {
            return true;
        }

        return false;
    }

    /**
     * Auto-populate settings if not already configured
     *
     * Called during activation or first load to set sensible defaults
     *
     * @param array $settings Current settings
     * @return array Updated settings
     */
    public static function auto_populate( array $settings ): array {
        // Auto-detect source domain if not set
        if ( empty( $settings['source_domain'] ) ) {
            $detected = self::get_source_domain();
            if ( $detected && self::is_valid_domain( $detected ) ) {
                $settings['source_domain'] = $detected;
            }
        }

        // Auto-detect target domain from API key if not set
        if ( empty( $settings['target_domain'] ) ) {
            $api_key = $settings['api_key'] ?? '';
            $detected = self::get_target_domain_from_api_key( $api_key );
            if ( $detected && self::is_valid_domain( $detected ) ) {
                $settings['target_domain'] = $detected;
            } else {
                // Fallback to default
                $settings['target_domain'] = self::get_default_target_domain();
            }
        }

        return $settings;
    }

    /**
     * Get auto-detected display values
     *
     * Returns what would be auto-detected without modifying saved settings
     *
     * @return array [ 'source' => '...', 'target' => '...' ]
     */
    public static function get_suggestions(): array {
        $settings = get_option( DM_OPTION, [] );

        return [
            'source'      => self::get_source_domain(),
            'target'      => self::get_target_domain_from_api_key( $settings['api_key'] ?? '' ) ?: self::get_default_target_domain(),
            'source_set'  => ! empty( $settings['source_domain'] ),
            'target_set'  => ! empty( $settings['target_domain'] ),
        ];
    }
}
