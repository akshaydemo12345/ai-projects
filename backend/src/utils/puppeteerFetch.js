'use strict';

/**
 * puppeteerFetch.js
 * -----------------
 * Shared Puppeteer-based page fetcher - uses full puppeteer package
 * No external dependencies required
 */

const puppeteer = require('puppeteer');

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
    '--hide-scrollbars',
    '--mute-audio',
    '--disable-logging',
    '--log-level=3',
];

/**
 * Open a new browser + page, navigate to URL
 * Caller MUST call browser.close()
 *
 * @param {string} url
 * @param {{ timeout?: number, waitUntil?: string }} [opts]
 * @returns {Promise<{ browser, page, finalUrl: string }>}
 */
const openPage = async (url, opts = {}) => {
    const { timeout = DEFAULT_TIMEOUT, waitUntil = 'networkidle2' } = opts;

    console.log(`🚀 Launching browser for: ${url}`);

    let browser;
    try {
        browser = await puppeteer.launch({
            headless: 'new',
            args: LAUNCH_ARGS,
        });
        console.log('✅ Browser launched successfully');
    } catch (launchErr) {
        console.error('❌ Failed to launch browser:', launchErr.message);

        // Retry with minimal arguments
        browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        console.log('✅ Browser launched with minimal args');
    }

    try {
        const page = await browser.newPage();

        // Realistic viewport
        await page.setViewport({ width: 1440, height: 900 });

        // Realistic user agent
        await page.setUserAgent(
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
            '(KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
        );

        // Set default timeout
        page.setDefaultTimeout(timeout);

        // Block unnecessary assets for faster loading
        await page.setRequestInterception(true);
        page.on('request', (req) => {
            const type = req.resourceType();
            if (['media', 'font', 'websocket', 'images'].includes(type)) {
                req.abort();
            } else {
                req.continue();
            }
        });

        console.log(`🌐 Navigating to: ${url}`);

        // Navigate with retry logic
        let lastError;
        for (let attempt = 1; attempt <= 2; attempt++) {
            try {
                await page.goto(url, { waitUntil, timeout });
                lastError = null;
                break;
            } catch (navErr) {
                lastError = navErr;
                console.warn(`Navigation attempt ${attempt} failed: ${navErr.message}`);
                if (attempt === 1 && waitUntil === 'networkidle2') {
                    // Retry with domcontentloaded
                    console.log('Retrying with domcontentloaded...');
                    await page.goto(url, { waitUntil: 'domcontentloaded', timeout });
                    lastError = null;
                    break;
                }
            }
        }

        if (lastError) {
            throw lastError;
        }

        // Dismiss cookie banners
        await dismissConsentBanners(page).catch(() => { });

        const finalUrl = page.url();
        console.log(`✅ Page loaded: ${finalUrl}`);

        return { browser, page, finalUrl };
    } catch (err) {
        await browser.close().catch(() => { });
        throw err;
    }
};

/**
 * Fetch HTML only, then close browser
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
        await browser.close().catch(() => { });
    }
};

/**
 * Click cookie/consent banners
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
        '[aria-label*="Accept all"]',
        '[aria-label*="Accept cookies"]',
        '.accept-cookies',
        '.cookie-accept',
        '#accept-cookies',
        '#cookie-accept',
        '.cookie-consent-accept',
        'button:contains("Accept")',
        'button:contains("OK")',
        'button:contains("Allow")',
    ];

    for (const sel of acceptSelectors) {
        try {
            const el = await page.$(sel);
            if (el && await el.isVisible()) {
                await el.click();
                console.log(`✅ Clicked consent banner: ${sel}`);
                await new Promise(r => setTimeout(r, 500));
                break;
            }
        } catch (_) {
            // Selector not found or not clickable, continue
        }
    }
};

/**
 * Close browser safely
 *
 * @param {import('puppeteer').Browser} browser
 */
const closeBrowser = async (browser) => {
    if (browser) {
        try {
            await browser.close();
            console.log('🔒 Browser closed');
        } catch (err) {
            console.warn('Error closing browser:', err.message);
        }
    }
};

module.exports = { openPage, fetchPageHtml, closeBrowser };