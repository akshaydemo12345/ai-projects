<?php
/**
 * HTML Rewriter subsystem.
 *
 * Rewrites DomainB references → DomainA in HTML, CSS, and JS.
 * Carefully protects inline <script> blocks from regex corruption.
 *
 * @package DomainMapper
 */

defined( 'ABSPATH' ) || exit;

class DomainMapper_Rewriter {

    private array  $settings;
    private string $target_host;
    private string $source_host;
    private array  $all_targets; // all domain variants to replace

    public function __construct( array $settings ) {
        $this->settings    = $settings;
        $this->target_host = $this->strip_scheme( $settings['target_domain'] ?? '' );
        $this->source_host = $this->strip_scheme( $settings['source_domain'] ?? '' );
        $this->all_targets = $this->build_target_list();
    }

    // ── Public ────────────────────────────────────────────────────────────────

    /**
     * Full HTML rewrite pipeline.
     */
    public function rewrite( string $html, string $target_base_url ): string {
        if ( empty( $this->target_host ) || empty( $this->source_host ) ) {
            return $html;
        }

        $html = apply_filters( 'dm_before_rewrite', $html, $target_base_url );

        // 1. Extract <script> blocks → protect them from HTML regex passes.
        [ $html, $script_map ] = $this->extract_blocks( $html, 'script' );

        // 2. Extract <style> blocks → handle them separately.
        [ $html, $style_map ] = $this->extract_blocks( $html, 'style' );

        // 3. Rewrite HTML attributes (href, src, action, etc.).
        $html = $this->fix_tag_attributes( $html, $target_base_url );

        // 4. Fix srcset.
        $html = $this->fix_srcset( $html, $target_base_url );

        // 5. Replace remaining absolute / protocol-relative domain refs in HTML.
        $html = $this->str_replace_all_domains( $html );

        // 6. Strip security meta tags.
        $html = $this->strip_security_meta( $html );

        // 7. Restore <style> blocks (rewrite CSS url() inside them).
        $html = $this->restore_style_blocks( $html, $style_map );

        // 8. Restore <script> blocks (safe domain-only replace, no regex).
        $html = $this->restore_script_blocks( $html, $script_map );

        // 9. Inject <base> tag so relative URLs resolve to source domain.
        $html = $this->inject_base_tag( $html );

        $html = apply_filters( 'dm_after_rewrite', $html, $target_base_url );

        DomainMapper_Loader::log( sprintf( 'Rewriter: %s → %s', $this->target_host, $this->source_host ) );

        return $html;
    }

    /**
     * Rewrite a single URL string (Location headers).
     */
    public function rewrite_url( string $url ): string {
        return $this->str_replace_all_domains( $url );
    }

    /**
     * Plain text rewrite for CSS files.
     * Rewrites ALL domain variants (primary + subdomains).
     */
    public function rewrite_text( string $text ): string {
        if ( empty( $this->target_host ) || empty( $this->source_host ) ) {
            return $text;
        }
        return $this->str_replace_all_domains( $text );
    }

    /**
     * Rewrite JS files — PRIMARY domain only.
     *
     * Subdomain URLs in JS (dashboard.*, cdn.*, etc.) are left as-is so the
     * browser-side fetch/XHR interceptor can rewrite them at runtime without
     * causing a double-relay (static rewrite → interceptor rewrite → broken URL).
     */
    public function rewrite_js( string $text ): string {
        if ( empty( $this->target_host ) || empty( $this->source_host ) ) {
            return $text;
        }

        $s = $this->source_host;

        // Only replace the primary/www domain variants — NOT subdomains.
        foreach ( $this->all_targets as $host => $is_primary ) {
            if ( ! $is_primary ) {
                continue; // Skip subdomains — interceptor handles these at runtime.
            }
            $text = str_ireplace( 'https://' . $host, 'http://' . $s, $text );
            $text = str_ireplace( 'http://'  . $host, 'http://' . $s, $text );
            $text = str_ireplace( '//' . $host,        '//' . $s,     $text );
        }

        return $text;
    }

    // ── Block extraction ──────────────────────────────────────────────────────

    /**
     * Extract all <tag>…</tag> blocks, replace with placeholders.
     *
     * @return array{ 0: string, 1: array<string,string> }
     */
    private function extract_blocks( string $html, string $tag ): array {
        $map   = [];
        $index = 0;
        $html  = preg_replace_callback(
            '#<' . $tag . '(\s[^>]*)?>.*?</' . $tag . '>#is',
            function ( array $m ) use ( $tag, &$map, &$index ): string {
                $key       = '<!--DM_' . strtoupper( $tag ) . '_' . $index . '_BLOCK-->';
                $map[$key] = $m[0];
                $index++;
                return $key;
            },
            $html
        ) ?? $html;
        return [ $html, $map ];
    }

    /**
     * Restore <script> blocks with ONLY safe string replacement (no regex).
     */
    private function restore_script_blocks( string $html, array $map ): string {
        foreach ( $map as $key => $original ) {
            $restored = $this->str_replace_all_domains( $original );
            $html     = str_replace( $key, $restored, $html );
        }
        return $html;
    }

    /**
     * Restore <style> blocks with CSS url() rewriting.
     */
    private function restore_style_blocks( string $html, array $map ): string {
        foreach ( $map as $key => $original ) {
            $rewritten = preg_replace_callback(
                '#url\(\s*(["\']?)([^"\')\s]+)\1\s*\)#i',
                function ( array $m ): string {
                    $url = $this->str_replace_all_domains( $m[2] );
                    return 'url(' . $m[1] . $url . $m[1] . ')';
                },
                $original
            ) ?? $original;
            $rewritten = $this->str_replace_all_domains( $rewritten );
            $html      = str_replace( $key, $rewritten, $html );
        }
        return $html;
    }

    // ── HTML rewrite passes ───────────────────────────────────────────────────

    /**
     * Rewrite URL-bearing attributes in HTML tags.
     */
    private function fix_tag_attributes( string $html, string $base ): string {
        $map = apply_filters( 'dm_rewrite_tag_attr_map', [
            'a'      => [ 'href' ],
            'form'   => [ 'action' ],
            'link'   => [ 'href' ],
            'img'    => [ 'src', 'data-src', 'data-lazy-src', 'data-original' ],
            'source' => [ 'src' ],
            'iframe' => [ 'src' ],
            'video'  => [ 'src', 'poster' ],
            'audio'  => [ 'src' ],
            'input'  => [ 'src' ],
            'script' => [ 'src' ],
        ] );

        foreach ( $map as $tag => $attrs ) {
            foreach ( $attrs as $attr ) {
                $html = preg_replace_callback(
                    '#(<' . preg_quote( $tag, '#' ) . '(?:\s[^>]*)?\s'
                    . preg_quote( $attr, '#' )
                    . '\s*=\s*)(["\'])([^"\']*)\2#i',
                    function ( array $m ) use ( $base, $tag, $attr ): string {
                        $url = $m[3];
                        
                        // Special handling for form actions — route through relay if root-relative
                        if ($tag === 'form' && $attr === 'action' && str_starts_with($url, '/') && !str_starts_with($url, '//')) {
                            $target = $this->target_host;
                            if ($target) {
                                return $m[1] . $m[2] . 'http://' . $this->source_host . '/dm-relay/' . $target . $url . $m[2];
                            }
                        }

                        $url = $this->resolve_url( $url, $base );
                        return $m[1] . $m[2] . $url . $m[2];
                    },
                    $html
                ) ?? $html;
            }
        }

        // Force method="POST" on all forms to avoid URL exposure
        $html = preg_replace_callback(
            '#(<form(?:\s[^>]*)?)(\s+method\s*=\s*["\'])(get)(["\'])#i',
            function ( array $m ): string {
                return $m[1] . $m[2] . 'POST' . $m[4];
            },
            $html
        ) ?? $html;

        // Ensure all forms have method="POST" if missing
        $html = preg_replace_callback(
            '#<form(?:\s[^>]*)?>#i',
            function ( array $m ): string {
                if (stripos($m[0], 'method=') === false) {
                    return str_replace('<form', '<form method="POST"', $m[0]);
                }
                return $m[0];
            },
            $html
        ) ?? $html;

        return $html;
    }

    /**
     * Rewrite srcset attributes.
     */
    private function fix_srcset( string $html, string $base ): string {
        return preg_replace_callback(
            '#(srcset\s*=\s*)(["\'])([^"\']+)\2#i',
            function ( array $m ) use ( $base ): string {
                $parts = explode( ',', $m[3] );
                $parts = array_map( function ( string $part ) use ( $base ): string {
                    $part   = trim( $part );
                    $pieces = preg_split( '/\s+/', $part, 2 );
                    $url    = $this->resolve_url( $pieces[0] ?? '', $base );
                    return isset( $pieces[1] ) ? $url . ' ' . $pieces[1] : $url;
                }, $parts );
                return $m[1] . $m[2] . implode( ', ', $parts ) . $m[2];
            },
            $html
        ) ?? $html;
    }

    /**
     * Strip CSP / X-Frame-Options meta tags.
     */
    private function strip_security_meta( string $html ): string {
        $html = preg_replace( '#<meta[^>]+http-equiv\s*=\s*["\']Content-Security-Policy["\'][^>]*>#i', '', $html ) ?? $html;
        $html = preg_replace( '#<meta[^>]+http-equiv\s*=\s*["\']X-Frame-Options["\'][^>]*>#i', '', $html ) ?? $html;
        return $html;
    }

    /**
     * Inject <base href="http://source-domain/"> right after <head>.
     * This ensures any relative URL the browser encounters resolves correctly.
     */
    private function inject_base_tag( string $html ): string {
        $source = $this->source_host;
        if ( empty( $source ) ) {
            return $html;
        }

        $base_tag = '<base href="http://' . esc_attr( $source ) . '/">';

        $interceptor = '';
        if ( class_exists( 'DomainMapper_Form_Interceptor' ) ) {
            // Serve the interceptor cleanly via an external virtual path
            $interceptor = '<script src="http://' . esc_attr( $source ) . '/dm-interceptor.js" defer></script>';
        }

        $inject = "\n" . $base_tag . "\n" . $interceptor . "\n";

        // IMPORTANT: Use str_replace / str_ireplace — NOT preg_replace.
        // The injected JS contains $1, ${1} etc. which preg_replace treats as
        // backreferences and silently corrupts or drops the entire script block.
        if ( stripos( $html, '<head>' ) !== false ) {
            return str_ireplace( '<head>', '<head>' . $inject, $html );
        }

        // <head> with attributes e.g. <head lang="en">
        if ( preg_match( '#<head\s[^>]*>#i', $html, $m ) ) {
            return str_ireplace( $m[0], $m[0] . $inject, $html );
        }

        return $inject . $html;
    }

    // ── Domain string replacement ─────────────────────────────────────────────

    /**
     * Replace ALL known target domain variants with the source domain.
     * This is the core replacement used everywhere.
     */
    private function str_replace_all_domains( string $text ): string {
        $s = $this->source_host;

        foreach ( $this->all_targets as $host => $is_primary ) {
            if ( empty( $host ) ) {
                continue;
            }

            if ( $is_primary ) {
                // Primary target → rewrite directly to source domain.
                $text = str_ireplace( 'https://' . $host, 'http://' . $s, $text );
                $text = str_ireplace( 'http://'  . $host, 'http://' . $s, $text );
                $text = str_ireplace( '//' . $host,       '//' . $s,      $text );
            } else {
                // Subdomain / extra domain → route through /dm-relay/HOST/
                // so the proxy can fetch it server-side (bypasses CORS).
                $relay = 'http://' . $s . '/dm-relay/' . $host;
                $text  = str_ireplace( 'https://' . $host, $relay, $text );
                $text  = str_ireplace( 'http://'  . $host, $relay, $text );
                $text  = str_ireplace( '//' . $host,       '//' . $s . '/dm-relay/' . $host, $text );
            }
        }

        return $text;
    }

    /**
     * Build the list of all target domain variants to replace.
     * Includes www, bare, and common subdomains.
     *
     * @return string[]
     */
    /**
     * Build map of target domains to proxy.
     * Key = hostname, Value = true (primary, rewrite to source)
     *                        false (subdomain, rewrite to relay)
     *
     * @return array<string,bool>
     */
    private function build_target_list(): array {
        $t    = $this->target_host;
        $bare = (string) preg_replace( '/^www\./i', '', $t );

        $map = [];

        // Primary domains → true (direct replacement).
        foreach ( [ $t, 'www.' . $bare, $bare ] as $host ) {
            if ( $host ) {
                $map[ $host ] = true;
            }
        }

        // Subdomains → false (relay replacement).
        $sub_prefixes = [ 'cdn', 'static', 'assets', 'dashboard', 'media', 'img', 'api', 'app' ];
        foreach ( $sub_prefixes as $prefix ) {
            $host = $prefix . '.' . $bare;
            if ( $host && ! isset( $map[ $host ] ) ) {
                $map[ $host ] = false;
            }
        }

        // Extra relay domains from settings.
        $extra = $this->settings['extra_relay_domains'] ?? '';
        if ( ! empty( $extra ) ) {
            foreach ( preg_split( '/[
,]+/', $extra ) as $line ) {
                $line = trim( $line );
                $line = (string) preg_replace( '#^https?://#i', '', $line );
                if ( $line && ! isset( $map[ $line ] ) ) {
                    $map[ $line ] = false; // relay
                }
            }
        }

        return $map;
    }

    // ── URL helpers ───────────────────────────────────────────────────────────

    /**
     * Resolve a URL against a base, then domain-replace it.
     */
    private function resolve_url( string $url, string $base ): string {
        $url = trim( $url );

        if ( '' === $url ) {
            return $url;
        }

        $first = $url[0] ?? '';

        if ( '#' === $first
            || str_starts_with( $url, 'javascript:' )
            || str_starts_with( $url, 'data:' )
            || str_starts_with( $url, 'mailto:' )
            || str_starts_with( $url, 'tel:' )
        ) {
            return $url;
        }

        // Absolute URL — just domain-replace.
        if ( preg_match( '#^https?://#i', $url ) ) {
            return $this->str_replace_all_domains( $url );
        }

        // Protocol-relative.
        if ( str_starts_with( $url, '//' ) ) {
            return $this->str_replace_all_domains( 'https:' . $url );
        }

        // Root-relative → prepend source origin.
        if ( '/' === $first ) {
            return 'http://' . $this->source_host . $url;
        }

        // Truly relative → resolve against base dir, then domain-replace.
        $base_dir = preg_replace( '#/[^/]*(\?.*)?$#', '/', $base );
        return $this->str_replace_all_domains( $base_dir . $url );
    }

    private function strip_scheme( string $url ): string {
        return (string) preg_replace( '#^https?://#i', '', rtrim( $url, '/' ) );
    }
}
