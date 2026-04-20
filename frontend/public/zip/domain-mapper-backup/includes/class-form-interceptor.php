<?php
/**
 * Form Interceptor.
 *
 * Provides two APIs:
 *   get_script()   — emits a single clean external <script src="..."> tag into the HTML.
 *   get_js_body()  — returns the raw JS body served by class-proxy.php at /dm-interceptor.js.
 *
 * This keeps ALL proxy logic out of "View Page Source" on the client domain.
 *
 * @package DomainMapper
 */

defined( 'ABSPATH' ) || exit;

class DomainMapper_Form_Interceptor {

    private array $settings;

    public function __construct( array $settings ) {
        $this->settings = $settings;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Public API
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Returns a single clean external <script> tag.
     * The JS body is served at /dm-interceptor.js by class-proxy.php.
     */
    public function get_script(): string {
        $source = $this->strip_scheme( $this->settings['source_domain'] ?? '' );
        if ( empty( $source ) ) {
            return '';
        }
        return '<script src="http://' . esc_attr( $source ) . '/dm-interceptor.js" defer></script>';
    }

    /**
     * Returns the raw JS interceptor body (no surrounding <script> tags).
     * Called by class-proxy.php to serve /dm-interceptor.js.
     */
    public function get_js_body(): string {
        $source       = $this->strip_scheme( $this->settings['source_domain'] ?? '' );
        $target       = $this->strip_scheme( $this->settings['target_domain'] ?? '' );
        $bare         = (string) preg_replace( '/^www\./i', '', $target );
        $relay_prefix = 'http://' . $source . '/dm-relay/';
        $relay_domains = $this->get_relay_domains( $bare );

        $rp  = addslashes( $relay_prefix );
        $rds = wp_json_encode( $relay_domains );
        $sh  = addslashes( $source );
        $th  = addslashes( $target );

        return <<<JS
(function() {
    'use strict';

    var SOURCE_HOST   = '{$sh}';
    var TARGET_HOST   = '{$th}';
    var RELAY_PREFIX  = '{$rp}';
    var RELAY_DOMAINS = {$rds};

    function rewriteUrl(url) {
        if (!url || typeof url !== 'string') return url;
        url = url.replace(/([^:])\/\//g, '\$1/');
        if (
            url.indexOf('data:')     === 0 ||
            url.indexOf('blob:')     === 0 ||
            url.indexOf('dm-relay')  !== -1
        ) return url;

        // Protocol-relative
        if (url.indexOf('//') === 0 && url.indexOf('//' + SOURCE_HOST) === -1) {
            if (url.split('/').length < 4) { url = '/' + url.substring(2); }
        }

        // Root-relative
        if (url.charAt(0) === '/' && url.charAt(1) !== '/') {
            return 'http://' + SOURCE_HOST + '/dm-relay/' + TARGET_HOST + url;
        }

        // Absolute
        try {
            var u = new URL(url, window.location.href);
            for (var i = 0; i < RELAY_DOMAINS.length; i++) {
                if (u.hostname === RELAY_DOMAINS[i] || u.hostname.endsWith('.' + RELAY_DOMAINS[i])) {
                    return 'http://' + SOURCE_HOST + '/dm-relay/' + u.hostname + u.pathname + u.search + u.hash;
                }
            }
            if (u.hostname === SOURCE_HOST) {
                var p = u.pathname;
                if ((p.indexOf('.php') !== -1 || u.search.indexOf('action=') !== -1) && !p.startsWith('/wp-')) {
                    return 'http://' + SOURCE_HOST + '/dm-relay/' + TARGET_HOST + p + u.search + u.hash;
                }
            }
        } catch(e) {}
        return url;
    }

    // Intercept fetch()
    var _origFetch = window.fetch;
    window.fetch = function(input, init) {
        try {
            if (typeof input === 'string') {
                input = rewriteUrl(input);
            } else if (input && input.url) {
                var nu = rewriteUrl(input.url);
                if (nu !== input.url) input = new Request(nu, input);
            }
            init = init || {};
            init.credentials = init.credentials || 'include';
        } catch(e) {}
        return _origFetch.call(this, input, init);
    };

    // Intercept XHR
    var _origXHROpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        try { url = rewriteUrl(url); } catch(e) {}
        this.withCredentials = true;
        var args = Array.prototype.slice.call(arguments);
        args[1] = url;
        return _origXHROpen.apply(this, args);
    };

    // Intercept sendBeacon
    if (navigator.sendBeacon) {
        var _origBeacon = navigator.sendBeacon.bind(navigator);
        navigator.sendBeacon = function(url, data) { return _origBeacon(rewriteUrl(url), data); };
    }

    // Intercept createElement src/href/action setters
    var _origCE = document.createElement.bind(document);
    document.createElement = function(tag) {
        var el  = _origCE(tag);
        var t   = (tag || '').toLowerCase();
        if (t === 'script' || t === 'link' || t === 'img' || t === 'iframe' || t === 'form') {
            var _origSA = el.setAttribute.bind(el);
            el.setAttribute = function(name, value) {
                if ((name === 'src' || name === 'href' || name === 'action') && typeof value === 'string') {
                    value = rewriteUrl(value);
                }
                return _origSA(name, value);
            };
        }
        return el;
    };

    // Hook prototype src property on img/script/iframe
    try {
        var _hook = function(proto, prop) {
            var orig = Object.getOwnPropertyDescriptor(proto, prop);
            if (!orig) return;
            Object.defineProperty(proto, prop, {
                set: function(v) { orig.set.call(this, rewriteUrl(v)); },
                get: function()  { return orig.get.call(this); },
                configurable: true
            });
        };
        _hook(HTMLImageElement.prototype,  'src');
        _hook(HTMLScriptElement.prototype, 'src');
        _hook(HTMLIFrameElement.prototype,  'src');
    } catch(e) {}

    // Intercept form.submit()
    try {
        var _origSubmit = HTMLFormElement.prototype.submit;
        HTMLFormElement.prototype.submit = function() {
            this.action = rewriteUrl(this.action);
            if (this.action.indexOf('/dm-relay/') !== -1) {
                this.method = 'POST';
            }
            return _origSubmit.apply(this, arguments);
        };
    } catch(e) {}

    // Lead Capture Logic
    async function submitLead(data, form, btn, originalBtnText) {
        try {
            // Dummy UI Simulation - NO BACKEND
            console.log("Dummy API Call - Simulating Lead Creation", data);
            await new Promise(function(resolve) { setTimeout(resolve, 800); }); // Fake network delay
            var result = { status: 'success', dummy: true };

            if (result.status === 'success') {
                form.reset();
                var currentPath = window.location.pathname;
                var thankYouPath = currentPath.endsWith('/') ? currentPath + 'thank-you' : currentPath + '/thank-you';
                window.location.href = thankYouPath;
            } else {
                throw new Error(result.message || 'Server error');
            }
        } catch (err) {
            console.error("Lead Error:", err);
            // Fallback to traditional submission if AJAX fails
            form.method = 'POST';
            form.action = rewriteUrl(form.action);
            form.submit();
        }
    }

    // High-priority interceptor for natural form submissions
    document.addEventListener('submit', function(e) {
        var form = e.target;
        if (form && form.tagName === 'FORM') {
            form.method = 'POST'; // Force POST exactly at submission
            form.action = rewriteUrl(form.action);

            // Intercept ALL forms for dummy UI simulation (prevent Gravity Forms bypass)
            if (true) {
                e.preventDefault();
                e.stopImmediatePropagation();
                
                var btn = form.querySelector('button[type="submit"]') || form.querySelector('button');
                var originalText = btn ? btn.innerHTML : 'Submit';
                if (btn) {
                    btn.disabled = true;
                    btn.innerHTML = 'Sending...';
                }

                var fd = new FormData(form);
                var data = {
                    pageSlug: window.location.pathname.split('/').filter(Boolean).pop() || '',
                    name: fd.get('name') || fd.get('first_name') || '',
                    email: fd.get('email') || '',
                    phone: fd.get('phone') || fd.get('tel') || '',
                    message: fd.get('message') || fd.get('comments') || ''
                };

                submitLead(data, form, btn, originalText);
            }
        }
    }, true);

    // Bulletproof: Force POST on click of any submit-like button
    document.addEventListener('click', function(e) {
        var el = e.target;
        if (el && (el.type === 'submit' || el.tagName === 'BUTTON')) {
            var form = el.form || el.closest('form');
            if (form) {
                form.method = 'POST';
                form.action = rewriteUrl(form.action);
            }
        }
    }, true);

    // Initial pass for methods
    function syncMethods() {
        var forms = document.getElementsByTagName('form');
        for (var i = 0; i < forms.length; i++) {
            forms[i].method = 'POST';
        }
    }
    syncMethods();
    setInterval(syncMethods, 2000); // Repeat every 2s for dynamic forms

})();
JS;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Private helpers
    // ─────────────────────────────────────────────────────────────────────────

    private function get_relay_domains( string $bare_domain ): array {
        $domains = [];
        foreach ( [ 'dashboard', 'cdn', 'static', 'assets', 'api', 'app', 'media', 'img' ] as $sub ) {
            $domains[] = $sub . '.' . $bare_domain;
        }
        $extra = $this->settings['extra_relay_domains'] ?? '';
        if ( ! empty( $extra ) ) {
            foreach ( preg_split( '/[\r\n,]+/', $extra ) as $line ) {
                $line = trim( (string) preg_replace( '#^https?://#i', '', $line ) );
                if ( $line !== '' && ! in_array( $line, $domains, true ) ) {
                    $domains[] = $line;
                }
            }
        }
        foreach ( [ 'kxcdn.com', 'cloudfront.net', 'agencyplatform.com', 'edeveloperz.com', 'crazyegg.com' ] as $d ) {
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
