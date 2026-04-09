<?php
/**
 * Form Interceptor.
 *
 * Injects a JavaScript shim into every proxied HTML page that:
 *  1. Intercepts all fetch() and XMLHttpRequest calls made by the page JS.
 *  2. If the target URL is a known external domain (agencyplatform subdomains etc.),
 *     rewrites it to go through /dm-relay/ instead.
 *  3. Adds CORS credentials to all requests so cookies are forwarded.
 *
 * This solves the "form JS fetches from dashboard.agencyplatform.com at runtime"
 * problem without needing to statically rewrite every JS file.
 *
 * @package DomainMapper
 */

defined( 'ABSPATH' ) || exit;

class DomainMapper_Form_Interceptor {

    private array $settings;

    public function __construct( array $settings ) {
        $this->settings = $settings;
    }

    /**
     * Build the JS interceptor script tag to inject into <head>.
     *
     * @return string   A <script> block (no src, inline).
     */
    public function get_script(): string {
        $source       = $this->settings['source_domain'] ?? '';
        $target       = $this->strip_scheme( $this->settings['target_domain'] ?? '' );
        $bare         = preg_replace( '/^www\./i', '', $target );
        $relay_prefix = 'http://' . $source . '/dm-relay/';

        // Build list of domains that need to go through relay.
        $relay_domains = $this->get_relay_domains( $bare );

        // Encode for JS.
        $relay_prefix_js  = esc_js( $relay_prefix );
        $relay_domains_js = wp_json_encode( $relay_domains );
        $source_js        = esc_js( $source );
        $target_js        = esc_js( $target );

        return <<<JS
<script id="dm-interceptor">
(function() {
    'use strict';

    var DEBUG         = true;
    var RELAY_PREFIX  = '{$relay_prefix_js}';
    var SOURCE_HOST   = '{$source_js}';
    var TARGET_HOST   = '{$target_js}';
    var RELAY_DOMAINS = {$relay_domains_js};

    /**
     * Rewrite a URL: if it points to a relay domain, route via /dm-relay/.
     */
    function rewriteUrl(url) {
        if (!url || typeof url !== 'string') return url;
        var oldUrl = url;

        // 1. Clean up double slashes (except protocol) e.g. host//path -> host/path
        url = url.replace(/([^:])\/\//g, "$1/");

        if (url.indexOf('data:') === 0 || url.indexOf('blob:') === 0 || url.indexOf('dm-relay') !== -1) return url;

        // Normalize // to http:// or https:// if it's a protocol-relative URL
        if (url.indexOf('//') === 0 && url.indexOf('//' + SOURCE_HOST) === -1) {
             // If it's something like //signup_v2.php, it's actually root-relative but formatted weirdly by some scripts
             if (url.indexOf('//') === 0 && url.split('/').length < 4) {
                 url = '/' + url.substring(2);
             }
        }

        // Handle root-relative paths (e.g. /signup_v2.php)
        if (url.startsWith('/') && !url.startsWith('//')) {
            // These are almost always intended for the upstream target. 
            // We route them through relay to ensures they hit the target even on a subsite.
            var newUrl = 'http://' + SOURCE_HOST + '/dm-relay/' + TARGET_HOST + url;
            if (DEBUG) console.log('[DomainMapper] Relaying root-relative:', url, '->', newUrl);
            return newUrl;
        }

        // Handle absolute URLs
        try {
            var u = new URL(url, window.location.href);
            
            // 2. Handle absolute URLs to permitted relay domains
            for (var i = 0; i < RELAY_DOMAINS.length; i++) {
                if (u.hostname === RELAY_DOMAINS[i] || u.hostname.endsWith('.' + RELAY_DOMAINS[i])) {
                    var relayed = 'http://' + SOURCE_HOST + '/dm-relay/' + u.hostname + u.pathname + u.search + u.hash;
                    if (DEBUG) console.log('[DomainMapper] Relaying absolute:', url, '->', relayed);
                    return relayed;
                }
            }

            // 3. Handle absolute/relative URLs pointing back to SOURCE_HOST root (forms/AJAX)
            if (u.hostname === SOURCE_HOST) {
                var p = u.pathname;
                // If it's a known white-label endpoint at the root, relay it to the TARGET.
                // We exclude WP core paths to avoid breaking local admin.
                if ((p.indexOf('.php') !== -1 || u.search.indexOf('action=') !== -1) && !p.startsWith('/wp-')) {
                     var relayedSource = 'http://' + SOURCE_HOST + '/dm-relay/' + TARGET_HOST + p + u.search + u.hash;
                     if (DEBUG) console.log('[DomainMapper] Relaying source-target:', url, '->', relayedSource);
                     return relayedSource;
                }
            }
        } catch(e) {}

        return url;
    }

    // ── Intercept fetch() ────────────────────────────────────────────────────
    var _originalFetch = window.fetch;
    window.fetch = function(input, init) {
        try {
            if (typeof input === 'string') {
                input = rewriteUrl(input);
            } else if (input && input.url) {
                var newUrl = rewriteUrl(input.url);
                if (newUrl !== input.url) {
                    input = new Request(newUrl, input);
                }
            }
            init = init || {};
            init.credentials = init.credentials || 'include';
        } catch(e) {}
        return _originalFetch.call(this, input, init);
    };

    // ── Intercept XMLHttpRequest ─────────────────────────────────────────────
    var _XHROpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        try {
            url = rewriteUrl(url);
        } catch(e) {}
        this.withCredentials = true;
        var args = Array.prototype.slice.call(arguments);
        args[1] = url;
        return _XHROpen.apply(this, args);
    };

    // ── Intercept Beacon / EventSource ───────────────────────────────────────
    if (navigator.sendBeacon) {
        var _origBeacon = navigator.sendBeacon.bind(navigator);
        navigator.sendBeacon = function(url, data) {
            return _origBeacon(rewriteUrl(url), data);
        };
    }
    if (window.EventSource) {
        var _origES = window.EventSource;
        window.EventSource = function(url, config) {
            return new _origES(rewriteUrl(url), config);
        };
    }

    // ── Intercept dynamic <script> / <link> / <img> injection ────────────────
    var _origCreateElement = document.createElement.bind(document);
    document.createElement = function(tag) {
        var el = _origCreateElement(tag);
        var t = (tag || '').toLowerCase();
        if (t === 'script' || t === 'link' || t === 'img' || t === 'iframe' || t === 'form') {
            var _origSetAttr = el.setAttribute.bind(el);
            el.setAttribute = function(name, value) {
                if ((name === 'src' || name === 'href' || name === 'action') && typeof value === 'string') {
                    value = rewriteUrl(value);
                }
                return _origSetAttr(name, value);
            };
            try {
                var props = (t === 'form') ? ['action'] : ['src', 'href'];
                props.forEach(function(prop) {
                    var proto = Object.getPrototypeOf(el);
                    var orig = Object.getOwnPropertyDescriptor(proto, prop);
                    if (!orig) return;
                    Object.defineProperty(el, prop, {
                        set: function(v) { orig.set.call(this, rewriteUrl(v)); },
                        get: function()  { return orig.get.call(this); },
                        configurable: true
                    });
                });
            } catch(e) {}
        }
        return el;
    };

    // ── Intercept Image / Script Prototypes ───────────────────────────────
    try {
        var _hookProp = function(proto, prop) {
            var orig = Object.getOwnPropertyDescriptor(proto, prop);
            if (!orig) return;
            Object.defineProperty(proto, prop, {
                set: function(v) { orig.set.call(this, rewriteUrl(v)); },
                get: function()  { return orig.get.call(this); },
                configurable: true
            });
        };
        _hookProp(HTMLImageElement.prototype, 'src');
        _hookProp(HTMLScriptElement.prototype, 'src');
        _hookProp(HTMLIFrameElement.prototype, 'src');
    } catch(e) {}

    // ── Intercept window.open (some popups use this) ─────────────────────────
    var _origOpen = window.open;
    window.open = function(url, target, features) {
        url = rewriteUrl(url);
        return _origOpen.call(this, url, target, features);
    };

    // ── Intercept Form Actions ───────────────────────────────────────────────
    try {
        var _origSubmit = HTMLFormElement.prototype.submit;
        HTMLFormElement.prototype.submit = function() {
            this.action = rewriteUrl(this.action);
            return _origSubmit.apply(this, arguments);
        };
    } catch(e) {}

    // ── Intercept document.write (legacy form loaders) ───────────────────────
    var _origWrite = document.write.bind(document);
    document.write = function(markup) {
        if (typeof markup === 'string') {
            // High-res replacement for common domains in markup
            for (var i = 0; i < RELAY_DOMAINS.length; i++) {
                var d = RELAY_DOMAINS[i];
                var re = new RegExp('https?:\\\\/\\\\/([a-z0-9\\\\-\\.]*'+d.replace('.', '\\\\.')+')', 'gi');
                markup = markup.replace(re, function(m, host) {
                   return 'http://' + SOURCE_HOST + '/dm-relay/' + host;
                });
            }
        }
        return _origWrite(markup);
    };

    // ── MutationObserver: catch dynamically injected script/link nodes ────────
    var _observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (!node || !node.tagName) return;
                var tag = node.tagName.toLowerCase();
                if (tag === 'script' && node.src) {
                    var rewritten = rewriteUrl(node.src);
                    if (rewritten !== node.src) {
                        node.src = rewritten;
                    }
                }
                if (tag === 'link' && node.href) {
                    var rewrittenHref = rewriteUrl(node.href);
                    if (rewrittenHref !== node.href) {
                        node.href = rewrittenHref;
                    }
                }
                if (tag === 'iframe' && node.src) {
                    var rewrittenIframe = rewriteUrl(node.src);
                    if (rewrittenIframe !== node.src) {
                        node.src = rewrittenIframe;
                    }
                }
            });
        });
    });
    _observer.observe(document.documentElement, { childList: true, subtree: true });

    console.log('[DomainMapper] Interceptor v2 active. Relay domains:', RELAY_DOMAINS);
})();
</script>
JS;
    }

    /**
     * Return the full list of domains that should route through relay.
     *
     * @param  string $bare_domain  e.g. agencyplatform.com
     * @return string[]
     */
    private function get_relay_domains( string $bare_domain ): array {
        $domains = [];

        // Standard subdomains.
        foreach ( [ 'dashboard', 'cdn', 'static', 'assets', 'api', 'app', 'media', 'img' ] as $sub ) {
            $domains[] = $sub . '.' . $bare_domain;
        }

        // Extra relay domains from settings.
        $extra = $this->settings['extra_relay_domains'] ?? '';
        if ( ! empty( $extra ) ) {
            foreach ( preg_split( '/[\r\n,]+/', $extra ) as $line ) {
                $line = trim( preg_replace( '#^https?://#i', '', $line ) );
                if ( $line !== '' && ! in_array( $line, $domains, true ) ) {
                    $domains[] = $line;
                }
            }
        }

        // Auto-detect base white-label domains for wildcard matching in JS.
        $base_wildcards = [
            'kxcdn.com',
            'cloudfront.net',
            'agencyplatform.com',
            'edeveloperz.com',
            'crazyegg.com',
            'analytics.edeveloperz.com',
            'script.crazyegg.com',
        ];

        foreach ( $base_wildcards as $d ) {
            if ( ! in_array( $d, $domains, true ) ) {
                $domains[] = $d;
            }
        }

        return array_values( array_unique( array_filter( $domains ) ) );
    }

    private function strip_scheme( string $url ): string {
        return (string) preg_replace( '#^https?://#i', '', rtrim( $url, '/' ) );
    }
}
