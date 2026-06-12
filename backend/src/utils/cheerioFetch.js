'use strict';

/**
 * cheerioFetch.js — Cheerio + node-fetch based page fetcher
 * Drop-in replacement for puppeteerFetch.js
 *
 * Strategy:
 *   Primary  → node-fetch  (fast, lightweight)
 *   Fallback → axios       (if node-fetch fails or is unavailable)
 *
 * Returns a { html, finalUrl, $ } object so callers that used openPage()
 * can still get the cheerio instance for DOM queries.
 */

const logger = require('./logger');

// ── Package availability checks ──────────────────────────────────────────────

let nodeFetch = null;
let axiosLib = null;
let cheerioLib = null;

try {
    nodeFetch = require('node-fetch');
    logger.info('[cheerioFetch] node-fetch loaded ✓');
} catch (e) {
    logger.warn('[cheerioFetch] node-fetch not available, will try axios');
}

try {
    axiosLib = require('axios');
    logger.info('[cheerioFetch] axios loaded ✓');
} catch (e) {
    logger.warn('[cheerioFetch] axios not available');
}

try {
    cheerioLib = require('cheerio');
    logger.info('[cheerioFetch] cheerio loaded ✓');
} catch (e) {
    throw new Error('[cheerioFetch] cheerio is required but not installed');
}

// ── Request helpers ──────────────────────────────────────────────────────────

const DEFAULT_HEADERS = {
    'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
        '(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Accept':
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
    'Cache-Control': 'no-cache',
};

const DEFAULT_TIMEOUT = 30_000;

/**
 * Fetch HTML via node-fetch (primary)
 */
const fetchWithNodeFetch = async (url, opts = {}) => {
    if (!nodeFetch) throw new Error('node-fetch not available');

    const { timeout = DEFAULT_TIMEOUT } = opts;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await nodeFetch(url, {
            method: 'GET',
            headers: DEFAULT_HEADERS,
            redirect: 'follow',
            signal: controller.signal,
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status} ${response.statusText}`);
        }

        const html = await response.text();
        const finalUrl = response.url || url;
        return { html, finalUrl };
    } finally {
        clearTimeout(timer);
    }
};

/**
 * Fetch HTML via axios (fallback)
 */
const fetchWithAxios = async (url, opts = {}) => {
    if (!axiosLib) throw new Error('axios not available');

    const { timeout = DEFAULT_TIMEOUT } = opts;

    const response = await axiosLib.get(url, {
        timeout,
        headers: DEFAULT_HEADERS,
        maxRedirects: 10,
        responseType: 'text',
        validateStatus: (s) => s < 500,
    });

    return {
        html: response.data,
        finalUrl: response.request?.res?.responseUrl || url,
    };
};

/**
 * Fetch binary data (images) — node-fetch primary, axios fallback
 * Returns a Buffer.
 */
const fetchBinary = async (url, opts = {}) => {
    const { timeout = DEFAULT_TIMEOUT, referer = url } = opts;

    const imgHeaders = {
        ...DEFAULT_HEADERS,
        Accept: 'image/*,*/*',
        Referer: referer,
    };

    // ── Try node-fetch first ──
    if (nodeFetch) {
        try {
            const controller = new AbortController();
            const timer = setTimeout(() => controller.abort(), timeout);
            try {
                const resp = await nodeFetch(url, {
                    headers: imgHeaders,
                    redirect: 'follow',
                    signal: controller.signal,
                });
                if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
                const buf = await resp.buffer();
                return buf;
            } finally {
                clearTimeout(timer);
            }
        } catch (e) {
            logger.warn(`[cheerioFetch] node-fetch binary failed for ${url}: ${e.message}, trying axios`);
        }
    }

    // ── Fallback: axios ──
    if (axiosLib) {
        const resp = await axiosLib.get(url, {
            timeout,
            headers: imgHeaders,
            maxRedirects: 5,
            responseType: 'arraybuffer',
        });
        return Buffer.from(resp.data);
    }

    throw new Error('No HTTP client available for binary fetch');
};

// ── Main exported functions (mirror puppeteerFetch API) ──────────────────────

/**
 * openPage — fetch a URL and return html + cheerio instance.
 *
 * Mirrors the puppeteerFetch.openPage() signature so callers can swap with
 * minimal changes.  The returned `page` object is a thin cheerio-backed shim.
 *
 * @param {string} url
 * @param {object} opts  { timeout }
 * @returns {{ html, finalUrl, $, page, browser }}
 */
const openPage = async (url, opts = {}) => {
    let html, finalUrl;
    let fetchError = null;

    // ── Primary: node-fetch ──
    if (nodeFetch) {
        try {
            ({ html, finalUrl } = await fetchWithNodeFetch(url, opts));
            logger.info(`[cheerioFetch] node-fetch success: ${finalUrl}`);
        } catch (e) {
            fetchError = e;
            logger.warn(`[cheerioFetch] node-fetch failed (${e.message}), falling back to axios`);
        }
    }

    // ── Fallback: axios ──
    if (!html && axiosLib) {
        try {
            ({ html, finalUrl } = await fetchWithAxios(url, opts));
            logger.info(`[cheerioFetch] axios fallback success: ${finalUrl}`);
            fetchError = null;
        } catch (e) {
            fetchError = e;
            logger.error(`[cheerioFetch] axios fallback also failed: ${e.message}`);
        }
    }

    if (!html) {
        throw fetchError || new Error(`Failed to fetch ${url}: no HTML client succeeded`);
    }

    const $ = cheerioLib.load(html);

    // ── Cheerio-backed "page" shim ──
    // Exposes the subset of the puppeteer page API that structuredScrapeService
    // actually uses (evaluate, content, url).
    const page = {
        _html: html,
        _finalUrl: finalUrl,
        url: () => finalUrl,
        content: async () => html,
        /**
         * page.evaluate() shim — runs fn(args) in Node context (not browser).
         * For in-browser extractors that rely on window/document this returns null;
         * structuredScrapeService detects that and uses the cheerio path instead.
         */
        evaluate: async (fn, ...args) => {
            if (typeof fn !== 'function') return null;
            // If fn body references browser globals → return null so caller falls back
            const body = fn.toString();
            if (/\b(document|window|location|fetch|btoa|navigator)\b/.test(body)) {
                return null; // caller must use cheerio path
            }
            try { return await fn(...args); } catch { return null; }
        },
        /** Cheerio $ instance for direct DOM queries */
        $,
    };

    // ── "browser" shim — no-op close ──
    const browser = { close: async () => { } };

    return { html, finalUrl, $, page, browser };
};

/**
 * fetchPageHtml — convenience wrapper
 */
const fetchPageHtml = async (url, opts = {}) => {
    const { html, finalUrl } = await openPage(url, opts);
    return { html, finalUrl };
};

// ── No-op stubs (kept for API parity with puppeteerFetch) ──

const dismissConsentBanners = async () => { };
const closeBrowser = async () => { };

module.exports = {
    openPage,
    fetchPageHtml,
    closeBrowser,
    fetchBinary,       // extra helper used inside structuredScrapeService
    dismissConsentBanners,
};