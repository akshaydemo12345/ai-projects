'use strict';

/**
 * puppeteerFetch.js
 * -----------------
 * Shared Puppeteer-based page fetcher — replaces the former axios + cheerio
 * pattern used throughout the scraping pipeline.
 *
 * Why Puppeteer instead of axios + cheerio?
 *  - Executes JavaScript, so dynamically-rendered content (React/Vue SPAs,
 *    lazy-loaded images, CSS-in-JS colour variables) is fully available.
 *  - Handles redirects, HSTS, and cookie-consent banners automatically.
 *  - Returns both the final HTML *and* a live `page` handle so callers can
 *    query the DOM directly via evaluate() without re-parsing.
 *
 * Usage (one-shot – caller gets HTML string):
 *   const { html, finalUrl } = await fetchPageHtml(url);
 *
 * Usage (advanced – caller gets a live page handle):
 *   const { browser, page, finalUrl } = await openPage(url);
 *   // … do work …
 *   await browser.close();
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const DEFAULT_TIMEOUT = 45_000;

const LAUNCH_ARGS = [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-gpu',
    '--disable-extensions',
    '--disable-background-networking',
    '--no-first-run',
    '--no-zygote',
    '--single-process',
];

/**
 * Resolve the Chrome/Chromium executable path.
 * Priority:
 *   1. PUPPETEER_EXECUTABLE_PATH env var (set this in your .env for production)
 *   2. Puppeteer's own downloaded browser (works after `npm install puppeteer`)
 *   3. Common system paths (linux servers, Docker images)
 */
const resolveChromePath = () => {
    if (process.env.PUPPETEER_EXECUTABLE_PATH) {
        return process.env.PUPPETEER_EXECUTABLE_PATH;
    }

    // Puppeteer ≥ 20 stores the browser in its own cache
    try {
        const execPath = puppeteer.executablePath();
        if (execPath && fs.existsSync(execPath)) return execPath;
    } catch (_) { }

    // Common system paths
    const candidates = [
        '/usr/bin/google-chrome',
        '/usr/bin/google-chrome-stable',
        '/usr/bin/chromium-browser',
        '/usr/bin/chromium',
        '/snap/bin/chromium',
    ];
    for (const p of candidates) {
        if (fs.existsSync(p)) return p;
    }

    return undefined; // Let Puppeteer decide
};

const CHROME_PATH = resolveChromePath();

/**
 * Open a new browser + page, navigate to `url`, and wait for the network to
 * settle.  Caller MUST call `browser.close()`.
 *
 * @param {string} url
 * @param {{ timeout?: number, waitUntil?: string }} [opts]
 * @returns {Promise<{ browser, page, finalUrl: string }>}
 */
const openPage = async (url, opts = {}) => {
    const { timeout = DEFAULT_TIMEOUT, waitUntil = 'networkidle2' } = opts;

    const launchOpts = {
        headless: 'new',
        args: LAUNCH_ARGS,
    };
    if (CHROME_PATH) launchOpts.executablePath = CHROME_PATH;

    const browser = await puppeteer.launch(launchOpts);

    try {
        const page = await browser.newPage();

        // Realistic viewport + UA so sites serve full desktop HTML
        await page.setViewport({ width: 1440, height: 900 });
        await page.setUserAgent(
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
            '(KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
        );

        // Block heavy binary assets we never need – keeps loads fast
        await page.setRequestInterception(true);
        page.on('request', (req) => {
            const type = req.resourceType();
            if (['media', 'font', 'websocket'].includes(type)) {
                req.abort();
            } else {
                req.continue();
            }
        });

        await page.goto(url, { waitUntil, timeout });

        // Try to dismiss GDPR / cookie banners so they don't obscure content
        await dismissConsentBanners(page).catch(() => { });

        const finalUrl = page.url();
        return { browser, page, finalUrl };
    } catch (err) {
        await browser.close();
        throw err;
    }
};

/**
 * Navigate to `url`, grab the fully-rendered HTML, then close the browser.
 * Use this when you only need the HTML string.
 *
 * @param {string} url
 * @param {{ timeout?: number }} [opts]
 * @returns {Promise<{ html: string, finalUrl: string }>}
 */
const fetchPageHtml = async (url, opts = {}) => {
    const { browser, page, finalUrl } = await openPage(url, opts);
    try {
        const html = await page.content();
        return { html, finalUrl };
    } finally {
        await browser.close();
    }
};

/**
 * Click away common cookie / consent banners.
 * Non-fatal — errors are swallowed by the caller.
 *
 * @param {import('puppeteer').Page} page
 */
const dismissConsentBanners = async (page) => {
    const acceptSelectors = [
        'button[id*="accept"]',
        'button[class*="accept"]',
        'button[id*="agree"]',
        'button[class*="agree"]',
        'button[id*="consent"]',
        'button[class*="consent"]',
        '[aria-label*="Accept"]',
        '[aria-label*="agree"]',
    ];

    for (const sel of acceptSelectors) {
        try {
            const el = await page.$(sel);
            if (el) {
                await el.click();
                await new Promise(r => setTimeout(r, 300));
                break;
            }
        } catch (_) { }
    }
};

module.exports = { openPage, fetchPageHtml };