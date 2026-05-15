<?php
/**
 * Cache subsystem.
 *
 * Wraps WordPress transients for both API responses and proxied page content.
 * All keys are namespaced to avoid collisions.
 *
 * @package DomainMapper
 */

defined( 'ABSPATH' ) || exit;

/**
 * Class DomainMapper_Cache
 */
class DomainMapper_Cache {

    /** Transient key prefix for page cache. */
    const PREFIX_PAGE = 'dm_page_';

    /** Transient key prefix for API response cache. */
    const PREFIX_API = 'dm_api_';

    /** Maximum transient key length accepted by WordPress (including prefix). */
    const MAX_KEY_LEN = 172;

    /** @var array<string,mixed> Plugin settings */
    private array $settings;

    /**
     * @param array<string,mixed> $settings
     */
    public function __construct( array $settings ) {
        $this->settings = $settings;
    }

    // ── Page cache ────────────────────────────────────────────────────────────

    /**
     * Retrieve a cached proxy response.
     *
     * @param  string      $uri  Request URI including query string.
     * @return string|false      Cached HTML or false on miss.
     */
    public function get_page( string $uri ) {
        return get_transient( $this->page_key( $uri ) );
    }

    /**
     * Store a proxy response.
     *
     * @param string $uri      Request URI.
     * @param string $content  HTML content to cache.
     * @param int    $ttl      Time-to-live in seconds (0 = use setting).
     */
    public function set_page( string $uri, string $content, int $ttl = 0 ): void {
        if ( $ttl <= 0 ) {
            $ttl = (int) ( $this->settings['cache_time'] ?? 300 );
        }
        set_transient( $this->page_key( $uri ), $content, $ttl );
    }

    /**
     * Delete a single page cache entry.
     *
     * @param string $uri
     */
    public function delete_page( string $uri ): void {
        delete_transient( $this->page_key( $uri ) );
    }

    // ── API cache ─────────────────────────────────────────────────────────────

    /**
     * Retrieve a cached API verification response.
     *
     * @param  string      $api_key
     * @return array|false
     */
    public function get_api( string $api_key ) {
        return get_transient( $this->api_key( $api_key ) );
    }

    /**
     * Store an API verification response.
     *
     * @param string $api_key
     * @param array  $data   Decoded API response.
     * @param int    $ttl    Seconds.
     */
    public function set_api( string $api_key, array $data, int $ttl = 3600 ): void {
        set_transient( $this->api_key( $api_key ), $data, $ttl );
    }

    /**
     * Bust the API cache for a given key.
     *
     * @param string $api_key
     */
    public function delete_api( string $api_key ): void {
        delete_transient( $this->api_key( $api_key ) );
    }

    /**
     * Flush ALL domain-mapper transients.
     * We don't delete them; we just increment the version number,
     * which makes all previous cache keys invalid.
     */
    public static function flush_all(): void {
        self::increment_version();
        DomainMapper_Loader::log( 'Cache: Globally flushed via version increment.', true );
    }

    /**
     * Get the current cache version.
     */
    private static function get_cache_version(): int {
        return (int) get_option( 'dm_cache_version', 1 );
    }

    /**
     * Increment the cache version number.
     */
    private static function increment_version(): void {
        $version = self::get_cache_version();
        update_option( 'dm_cache_version', $version + 1, 'no' );
    }

    // ── Key helpers ───────────────────────────────────────────────────────────

    /**
     * Build a safe transient key for a URI.
     *
     * @param  string $uri
     * @return string
     */
    private function page_key( string $uri ): string {
        // Include plugin version and cache version in key.
        $version = defined( 'DM_VERSION' ) ? DM_VERSION : '1';
        $cv      = self::get_cache_version();
        
        return self::PREFIX_PAGE . substr( md5( $uri . '|v' . $version . '|cv' . $cv ), 0, 32 );
    }

    /**
     * Build a safe transient key for an API key.
     *
     * @param  string $api_key
     * @return string
     */
    private function api_key( string $api_key ): string {
        $cv = self::get_cache_version();
        return self::PREFIX_API . substr( md5( $api_key . '|cv' . $cv ), 0, 32 );
    }
}
