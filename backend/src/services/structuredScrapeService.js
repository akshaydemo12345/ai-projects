'use strict';

const cheerio = require('cheerio');
const logger = require('../utils/logger');

const loadOptional = (name) => {
    try { return require(name); } catch { return null; }
};

const axios = loadOptional('axios');          // fallback HTML fetch + binary/text asset downloads
const nodeFetch = loadOptional('node-fetch');  // fallback HTML fetch + binary/text asset downloads
const sharpLib = loadOptional('sharp');
const resvgLib = loadOptional('@resvg/resvg-js');
const Anthropic = loadOptional('@anthropic-ai/sdk');
const playwright = loadOptional('playwright'); // primary HTML fetch — renders JS before cheerio parses

let VibrantLib = null;
try {
    const v = require('node-vibrant/node');
    VibrantLib = v.Vibrant || v;
} catch { /* vibrant unavailable */ }

const { extractFormFields: extractFormFieldsFromHtml } = require('../utils/formExtractor');

const DEFAULT_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
    '(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

const DEFAULT_HEADERS = {
    'User-Agent': DEFAULT_UA,
    'Accept': 'text/html,application/xhtml+xml,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'Cache-Control': 'no-cache',
    'Upgrade-Insecure-Requests': '1',
};

/**
 * fetchHtmlWithPlaywright — render the page in a real (headless) browser and
 * return the fully-rendered HTML (post-JS execution) plus the final URL after
 * redirects. This replaces the old axios/node-fetch + cheerio-only fetch so
 * that JS-rendered content (React/Vue SPAs, lazy-loaded sections, dynamically
 * injected meta tags) is captured before cheerio parses it.
 *
 * cheerio is still used afterwards for the actual DOM querying/extraction —
 * only the network fetch + rendering step changes.
 */
const fetchHtmlWithPlaywright = async (url, timeoutMs = 30000) => {
    if (!playwright) throw new Error('playwright not available');

    let browser = null;
    try {
        browser = await playwright.chromium.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
            headless: true,
        });
        const context = await browser.newContext({
            viewport: { width: 1440, height: 900 },
            userAgent: DEFAULT_UA,
            locale: 'en-US',
            ignoreHTTPSErrors: true,
        });
        const page = await context.newPage();

        // Block heavy assets we don't need for HTML extraction — keeps loads fast
        // NOTE: previously fonts were blocked here which prevented @font-face
        // and remote font files from being fetched. That breaks font detection
        // downstream. Do not abort 'font' requests so fonts can be discovered.
        await page.route('**/*', (route) => {
            const type = route.request().resourceType();
            if (['media', 'websocket'].includes(type)) return route.abort();
            return route.continue();
        });

        let navigated = false;
        try {
            await page.goto(url, { waitUntil: 'networkidle', timeout: timeoutMs });
            navigated = true;
        } catch (e1) {
            logger.warn(`[Scraper] playwright networkidle failed: ${e1.message}`);
            try {
                await page.goto(url, { waitUntil: 'domcontentloaded', timeout: timeoutMs });
                navigated = true;
            } catch (e2) {
                logger.warn(`[Scraper] playwright domcontentloaded failed: ${e2.message}`);
                await page.goto(url, { timeout: timeoutMs }).catch(() => { });
                await page.waitForTimeout(2000);
            }
        }

        // Best-effort cookie/consent dismissal so banners don't block content
        try {
            const acceptSelectors = [
                'button[id*="accept" i]', 'button[class*="accept" i]',
                'button[id*="agree" i]', 'button[class*="agree" i]',
                '[aria-label*="Accept" i]',
            ];
            for (const sel of acceptSelectors) {
                const el = await page.$(sel);
                if (el) { await el.click().catch(() => { }); await page.waitForTimeout(300); break; }
            }
        } catch (_) { /* non-fatal */ }

        const html = await page.content();
        const finalUrl = page.url() || url;

        // Collect computed/loaded font families and Google Fonts links from the rendered page.
        let fontsInfo = { computedFamilies: [], loadedFamilies: [], googleFontLinks: [] };
        try {
            const computedFamilies = await page.evaluate(() => {
                const families = new Set();
                const add = (s) => {
                    if (!s) return;
                    s.split(',').forEach(f => {
                        const name = f.replace(/['"]/g, '').trim();
                        if (name) families.add(name);
                    });
                };
                try { add(getComputedStyle(document.body).fontFamily); } catch (e) { }
                try { const h = document.querySelector('h1,h2,h3'); if (h) add(getComputedStyle(h).fontFamily); } catch (e) { }
                // sample some elements to catch inline font-family overrides
                try {
                    const els = Array.from(document.querySelectorAll('*')).slice(0, 300);
                    els.forEach(el => { try { add(getComputedStyle(el).fontFamily); } catch (e) { } });
                } catch (e) { }
                return Array.from(families).slice(0, 12);
            });

            const loadedFamilies = await page.evaluate(() => {
                try {
                    return Array.from(document.fonts || []).map(f => (f.family || '').replace(/['"]/g, '').trim()).filter(Boolean);
                } catch (e) { return []; }
            });

            const googleFontLinks = await page.$$eval('link[href*="fonts.googleapis.com" i]', els => els.map(l => l.href));

            fontsInfo = { computedFamilies: computedFamilies || [], loadedFamilies: Array.from(new Set(loadedFamilies || [])), googleFontLinks: googleFontLinks || [] };
        } catch (e) {
            logger.warn(`[Scraper] font detection failed: ${e.message}`);
        }

        // ✅ ADD THIS BLOCK
        const isCaptchaRedirect = /\/(sgcaptcha|captcha|bot-check|challenge|cf-challenge)/i.test(finalUrl);

        if (isCaptchaRedirect) {
            logger.warn(`[Scraper] Bot-detection redirect detected: ${finalUrl}`);
            throw new Error(`Blocked by bot detection: ${finalUrl}`);
        }

        logger.info(`[Scraper] playwright render OK${navigated ? '' : ' (partial)'}: ${finalUrl}`);
        return { html, finalUrl, fonts: fontsInfo };
    } finally {
        if (browser) await browser.close().catch(() => { });
    }
};

const fetchHtml = async (url, timeoutMs = 30000) => {
    // Primary: Playwright (real browser, executes JS, sees fully-rendered DOM)
    if (playwright) {
        try {
            return await fetchHtmlWithPlaywright(url, timeoutMs);
        } catch (e) {
            logger.warn(`[Scraper] playwright fetch failed (${e.message}), falling back to node-fetch/axios`);
        }
    }

    // Fallback: node-fetch (static HTML only, no JS execution)
    if (nodeFetch) {
        try {
            const controller = new AbortController();
            const tid = setTimeout(() => controller.abort(), timeoutMs);
            try {
                const res = await nodeFetch(url, {
                    headers: DEFAULT_HEADERS,
                    redirect: 'follow',
                    signal: controller.signal,
                });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const html = await res.text();
                const finalUrl = res.url || url;
                logger.info(`[Scraper] node-fetch OK: ${finalUrl}`);
                return { html, finalUrl };
            } finally {
                clearTimeout(tid);
            }
        } catch (e) {
            logger.warn(`[Scraper] node-fetch failed (${e.message}), trying axios`);
        }
    }

    // Last resort: axios (static HTML only)
    if (axios) {
        const res = await axios.get(url, {
            timeout: timeoutMs,
            headers: DEFAULT_HEADERS,
            maxRedirects: 10,
            responseType: 'text',
            validateStatus: s => s < 500,
        });
        const finalUrl = res.request?.res?.responseUrl || url;
        logger.info(`[Scraper] axios fallback OK: ${finalUrl}`);
        return { html: res.data, finalUrl };
    }

    throw new Error('No HTML fetcher available (install playwright, node-fetch, or axios)');
};

const fetchText = async (url, timeoutMs = 10000) => {
    if (nodeFetch) {
        try {
            const controller = new AbortController();
            const tid = setTimeout(() => controller.abort(), timeoutMs);
            try {
                const res = await nodeFetch(url, { headers: DEFAULT_HEADERS, redirect: 'follow', signal: controller.signal });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return await res.text();
            } finally {
                clearTimeout(tid);
            }
        } catch (e) {
            logger.warn(`[Scraper] fetchText node-fetch failed for ${url}: ${e.message}`);
        }
    }
    if (axios) {
        const res = await axios.get(url, { timeout: timeoutMs, headers: DEFAULT_HEADERS, maxRedirects: 5, responseType: 'text', validateStatus: s => s < 500 });
        return res.data;
    }
    return null;
};

const fetchBinary = async (url, referer = '', timeoutMs = 10000) => {
    const headers = {
        'User-Agent': DEFAULT_UA,
        Accept: 'image/*,*/*',
        Referer: referer || url,
    };

    if (nodeFetch) {
        try {
            const controller = new AbortController();
            const tid = setTimeout(() => controller.abort(), timeoutMs);
            try {
                const res = await nodeFetch(url, { headers, redirect: 'follow', signal: controller.signal });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return await res.buffer();
            } finally {
                clearTimeout(tid);
            }
        } catch (e) {
            logger.warn(`[fetchBinary] node-fetch failed (${e.message}), trying axios`);
        }
    }

    if (axios) {
        const res = await axios.get(url, {
            timeout: timeoutMs,
            headers,
            maxRedirects: 5,
            responseType: 'arraybuffer',
        });
        return Buffer.from(res.data);
    }

    throw new Error('No HTTP client available for binary fetch');
};

const toAbsUrl = (src, base) => {
    if (!src) return null;

    // ✅ Explicit reject
    if (src.startsWith('data:')) {
        return null;
    }

    try {
        return new URL(src, base).href;
    } catch (e) {
        logger.warn(`[toAbsUrl] Invalid URL: ${src}`);
        return null;
    }
};

const cleanStr = (s) => (s || '').trim().replace(/\s+/g, ' ');
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const INDUSTRY_MAP = [
    { industry: 'Home Services', sub: 'Plumbing & Drain', kws: ['drain', 'drain cleaning', 'drain cleaning services', 'sewer', 'sewer cleaning', 'hydro jetting', 'hydro-jetting', 'plumber', 'plumbing', 'clog', 'clogs', 'clogged drain', 'drain repair', 'rooter', 'augering', 'drainage', 'sewer line', 'sewer repair'] },
    { industry: 'Home Services', sub: 'HVAC & AC', kws: ['hvac', 'air conditioning', 'ac repair', 'heating', 'furnace', 'heat pump', 'air conditioner', 'duct cleaning'] },
    { industry: 'Beauty & Personal Care', sub: 'Natural Skincare', kws: ['skincare', 'beauty', 'cosmetic', 'serum', 'moisturizer', 'natural skin', 'organic beauty', 'skin care'] },
    { industry: 'Beauty & Personal Care', sub: 'Hair Care', kws: ['shampoo', 'conditioner', 'hair oil', 'hair care', 'hair growth'] },
    { industry: 'Healthcare', sub: 'Dental Clinic', kws: ['dental', 'dentist', 'tooth', 'oral health', 'orthodontic'] },
    { industry: 'Healthcare', sub: 'Medical Services', kws: ['hospital', 'clinic', 'doctor', 'physician', 'healthcare', 'medical', 'health center'] },
    { industry: 'Healthcare', sub: 'Pharmacy', kws: ['pharmacy', 'medicine', 'drug store', 'pharmaceutical'] },
    { industry: 'Marketing & Advertising', sub: 'Digital Marketing Agency', kws: ['seo', 'search engine optimization', 'ppc', 'pay per click', 'smo', 'social media marketing', 'digital marketing', 'link building', 'affiliate management', 'web design and development', 'online marketing', 'search engine marketing'] },
    { industry: 'Marketing & Advertising', sub: 'Advertising Agency', kws: ['ad agency', 'advertising agency', 'media buying', 'brand campaign', 'creative agency'] },
    { industry: 'SaaS', sub: 'Marketing Automation', kws: ['marketing automation', 'email campaign', 'crm', 'lead generation', 'funnel'] },
    { industry: 'SaaS', sub: 'Project Management', kws: ['project management', 'task management', 'team collaboration', 'workflow'] },
    { industry: 'SaaS', sub: 'Analytics Platform', kws: ['analytics', 'data dashboard', 'reporting', 'business intelligence', 'bi tool'] },
    { industry: 'Real Estate', sub: 'Residential Properties', kws: ['residential', 'apartment', 'house for sale', 'property', 'real estate', 'buy home'] },
    { industry: 'Real Estate', sub: 'Commercial Properties', kws: ['commercial real estate', 'office space', 'retail space', 'commercial property'] },
    { industry: 'E-Commerce', sub: 'Fashion & Apparel', kws: ['clothing', 'fashion', 'apparel', 'dress', 'outfit', 'wear'] },
    { industry: 'E-Commerce', sub: 'Electronics', kws: ['electronics store', 'buy electronics', 'online electronics shop', 'gadget store', 'tech store', 'buy smartphone', 'buy laptop online'] },
    { industry: 'Food & Beverage', sub: 'Restaurant', kws: ['restaurant', 'menu', 'dining', 'eat', 'cuisine', 'food delivery', 'order food'] },
    { industry: 'Food & Beverage', sub: 'Organic Food', kws: ['organic food', 'natural food', 'vegan', 'plant-based', 'healthy eating'] },
    { industry: 'Education', sub: 'Online Learning', kws: ['online course', 'e-learning', 'edtech', 'tutorial', 'certification', 'lms'] },
    { industry: 'Education', sub: 'K-12 School', kws: ['school', 'kindergarten', 'primary school', 'secondary school', 'k-12'] },
    { industry: 'Finance', sub: 'Fintech', kws: ['fintech', 'payment gateway', 'digital banking', 'neobank', 'wallet'] },
    { industry: 'Finance', sub: 'Insurance', kws: ['insurance', 'policy', 'premium', 'claim', 'coverage', 'insurer'] },
    { industry: 'Travel & Tourism', sub: 'Travel Agency', kws: ['travel agency', 'tour package', 'holiday', 'vacation', 'tour operator'] },
    { industry: 'Travel & Tourism', sub: 'Hotel & Hospitality', kws: ['hotel', 'resort', 'stay', 'accommodation', 'hospitality', 'lodging'] },
    { industry: 'Technology', sub: 'Consumer Electronics', kws: ['iphone', 'ipad', 'macbook', 'imac', 'airpods', 'apple watch', 'galaxy', 'pixel phone', 'smartwatch', 'tablet', 'laptop', 'desktop computer', 'consumer electronics', 'wearable', 'earbuds', 'headphones', 'smart home', 'home automation'] },
    { industry: 'Technology', sub: 'Hardware & Devices', kws: ['processor', 'chip', 'semiconductor', 'gpu', 'cpu', 'motherboard', 'graphics card', 'ram', 'ssd', 'hardware', 'computer parts'] },
    { industry: 'Technology', sub: 'IT Services', kws: ['it services', 'software development', 'web development', 'digital agency', 'tech consulting'] },
    { industry: 'Fitness & Wellness', sub: 'Gym & Fitness', kws: ['gym', 'fitness', 'workout', 'yoga', 'crossfit', 'personal training'] },
    { industry: 'Legal', sub: 'Law Firm', kws: ['law firm', 'attorney', 'lawyer', 'legal services', 'advocate'] },
    { industry: 'Nonprofit', sub: 'NGO', kws: ['ngo', 'nonprofit', 'charity', 'donation', 'foundation', 'social cause'] },
];

// New weighted keyword classifier
// Accepts either a single string (legacy) or an object { title, meta, body }
const classifyIndustryByKeywords = (input) => {
    const parts = { title: '', meta: '', body: '' };
    if (!input) input = '';
    if (typeof input === 'string') {
        parts.body = input;
    } else {
        parts.title = (input.title || '') + '';
        parts.meta = (input.meta || '') + '';
        parts.body = (input.body || '') + '';
    }

    const noise = ['home', 'about', 'contact', 'services', 'copyright', 'privacy policy', 'read more', 'click here'];
    const normalize = (s) => (s || '').toLowerCase().replace(/\s+/g, ' ');
    const title = normalize(parts.title);
    const meta = normalize(parts.meta);
    const body = normalize(parts.body);

    const scores = {};
    const matched = new Set();

    const matchCount = (hay, kw) => {
        if (!kw) return 0;
        const k = kw.toLowerCase();
        // phrase match
        try {
            if (k.includes(' ')) {
                // count occurrences of phrase
                let idx = 0, cnt = 0;
                while ((idx = hay.indexOf(k, idx)) !== -1) { cnt++; idx += k.length; }
                return cnt;
            }
            // single word - match word boundaries
            const re = new RegExp('\\b' + k.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&') + '\\b', 'g');
            const m = hay.match(re);
            return m ? m.length : 0;
        } catch (e) {
            return hay.includes(k) ? 1 : 0;
        }
    };

    for (const entry of INDUSTRY_MAP) {
        let score = 0;
        for (const kw of entry.kws) {
            // remove global noise words from consideration
            if (noise.includes((kw || '').toLowerCase())) continue;
            const inTitle = matchCount(title, kw);
            const inMeta = matchCount(meta, kw);
            const inBody = matchCount(body, kw);
            const kwScore = (inTitle * 2) + (inMeta * 2) + inBody; // title/meta weighted 2x
            if (kwScore > 0) matched.add(kw);
            score += kwScore;
        }
        if (score > 0) {
            const key = entry.industry;
            if (!scores[key] || scores[key].score < score) scores[key] = { score, sub: entry.sub };
        }
    }

    const sorted = Object.entries(scores).sort((a, b) => b[1].score - a[1].score);
    if (sorted.length === 0) return null;
    const [industry, { sub, score }] = sorted[0];
    return { industry, subIndustry: sub, matchedKeywords: Array.from(matched), score };
};

const classifyIndustryWithAI = async (textCorpus) => {
    if (!Anthropic) return null;
    try {
        const client = new Anthropic();
        const subMap = INDUSTRY_MAP.map(e => e.industry + ' > ' + e.sub).join(', ');
        const snippet = (textCorpus || '').slice(0, 800);
        const prompt = 'Classify this website into one industry category.\n\nWebsite text:\n' + snippet +
            '\n\nAvailable categories (industry > subIndustry):\n' + subMap +
            '\n\nRespond ONLY with valid JSON: {"industry": "...", "subIndustry": "..."}. No explanation.';
        const msg = await client.messages.create({
            model: 'claude-haiku-4-5-20251001',
            max_tokens: 80,
            messages: [{ role: 'user', content: prompt }],
        });
        const text = ((msg.content && msg.content[0] && msg.content[0].text) || '').trim()
            .replace(/```[a-z]*/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(text);
        if (parsed.industry && parsed.subIndustry) return { ...parsed, score: 1, source: 'ai' };
    } catch (e) {
        logger.warn('[Industry] AI classify failed: ' + e.message);
    }
    return null;
};

const classifyIndustry = async (textCorpusOrParts) => {
    // Prefer keyword-based classifier (fast, no external API). We accept either a
    // simple string (body) or an object {title, meta, body} so title/meta can be weighted.
    const kwResult = classifyIndustryByKeywords(textCorpusOrParts);
    if (!kwResult) return { industry: 'General', subIndustry: 'Business', matchedKeywords: [], score: 0, confidence: 0, source: 'default' };

    const source = kwResult.score >= 2 ? 'keywords' : 'keywords-low';
    const confidence = source === 'keywords'
        ? Math.min(1, kwResult.score / 5)
        : Math.min(0.4, kwResult.score / 5);
    return { industry: kwResult.industry, subIndustry: kwResult.subIndustry, matchedKeywords: kwResult.matchedKeywords || [], score: kwResult.score, confidence, source };
};

const isNeutralHex = (hex) => {
    if (!hex || hex.length < 7) return true;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    const sat = max === 0 ? 0 : (max - min) / max;
    const lum = (r * 299 + g * 587 + b * 114) / 1000;
    // FIX 1: Loosened thresholds — dark brand colors (navy, dark green) and light
    // pastels (lavender, cream) were being incorrectly rejected with sat<0.12/lum>235/lum<20.
    // Now only truly achromatic greys/whites/blacks are rejected.
    return sat < 0.08 || lum > 245 || lum < 8;
};

// Derives a secondary color from a single primary hex by shifting its lightness.
// Used as a last-resort fallback when pixel/palette extraction only yields one
// distinct color (e.g. a monochrome favicon icon), so `secondary` isn't left null
// when there genuinely is no second color to detect.
const deriveShadeHex = (hex, amount = 0.28) => {
    if (!hex || hex.length < 7) return null;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const lum = (r * 299 + g * 587 + b * 114) / 1000;
    // Darken bright colors, lighten dark ones, so the shade stays visually distinct.
    const factor = lum > 140 ? -amount : amount;
    const adjust = (v) => Math.round(Math.min(255, Math.max(0, v + (factor > 0 ? (255 - v) : v) * factor)));
    const rr = adjust(r), gg = adjust(g), bb = adjust(b);
    return '#' + [rr, gg, bb].map(v => v.toString(16).padStart(2, '0')).join('').toUpperCase();
};

const clamp01 = (value) => Math.min(1, Math.max(0, value));
const linearToSrgb = (value) => {
    const v = clamp01(value);
    return v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055;
};
const oklabToHex = (L, a, b) => {
    const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
    const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
    const s_ = L - 0.0894841775 * a - 1.2914855480 * b;

    const rLin = 4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_;
    const gLin = -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_;
    const bLin = -0.0041960863 * l_ - 0.7034186147 * m_ + 1.7076147010 * s_;

    const rgb = [rLin, gLin, bLin].map((v) => Math.round(clamp01(linearToSrgb(v)) * 255));
    if (rgb.some((v) => Number.isNaN(v))) return null;
    return '#' + rgb.map((v) => v.toString(16).padStart(2, '0')).join('').toUpperCase();
};
const oklchToHex = (L, C, h) => {
    const rad = (h % 360) * Math.PI / 180;
    const a = Math.cos(rad) * C;
    const b = Math.sin(rad) * C;
    return oklabToHex(L, a, b);
};

const normaliseCssColor = (raw) => {
    if (raw === null || raw === undefined) return null;
    const s = (typeof raw === 'string' ? raw : String(raw)).trim().replace(/\s+/g, ' ');
    if (!s || /^transparent$/i.test(s) || /^rgba?\(\s*0\s*[ ,]+\s*0\s*[ ,]+\s*0\s*[ ,\/]\s*0\s*\)$/i.test(s) || /^rgb\(\s*0\s*,\s*0\s*,\s*0\s*\)$/i.test(s)) return null;

    const h6 = s.match(/^#([0-9a-fA-F]{6})$/); if (h6) return ('#' + h6[1]).toUpperCase();
    const h3 = s.match(/^#([0-9a-fA-F]{3})$/); if (h3) return ('#' + h3[1].split('').map(c => c + c).join('')).toUpperCase();
    const h8 = s.match(/^#([0-9a-fA-F]{8})$/); if (h8) return ('#' + h8[1].slice(0, 6)).toUpperCase();

    const parseRgbComponent = (value) => {
        if (value.endsWith('%')) {
            const pct = parseFloat(value.slice(0, -1));
            return Math.round(Math.min(100, Math.max(0, pct)) * 2.55);
        }
        return Math.round(Math.min(255, Math.max(0, parseInt(value, 10) || 0)));
    };

    const rgb = s.match(/rgba?\(\s*([\d.]+%?)\s*[ ,]+\s*([\d.]+%?)\s*[ ,]+\s*([\d.]+%?)(?:\s*[ ,\/]\s*[\d.]+%?)?\s*\)/i);
    if (rgb) {
        const [, r, g, b] = rgb;
        return ('#' + [r, g, b].map(parseRgbComponent).map(x => x.toString(16).padStart(2, '0')).join('')).toUpperCase();
    }

    const hsl = s.match(/hsla?\(\s*([\d.]+)(?:deg)?\s*[ ,]+\s*([\d.]+)%\s*[ ,]+\s*([\d.]+)%(?:\s*[ ,\/]\s*[\d.]+%?)?\s*\)/i);
    if (hsl) {
        let [h, sat, l] = [parseFloat(hsl[1]), parseFloat(hsl[2]) / 100, parseFloat(hsl[3]) / 100];
        const k = (n) => {
            const a = sat * Math.min(l, 1 - l);
            const f = (n + h / 30) % 12;
            return l - a * Math.max(-1, Math.min(f - 3, 9 - f, 1));
        };
        return ('#' + [0, 8, 4].map(n => Math.round(k(n) * 255).toString(16).padStart(2, '0')).join('')).toUpperCase();
    }

    const oklch = s.match(/oklch\(\s*([\d.]+%?)\s+([\d.]+)\s+([\d.]+)(?:deg)?(?:\s*\/\s*[\d.]+%?)?\s*\)/i);
    if (oklch) {
        const L = String(oklch[1]).endsWith('%') ? parseFloat(oklch[1]) / 100 : parseFloat(oklch[1]);
        const C = parseFloat(oklch[2]);
        const h = parseFloat(oklch[3]);
        if (!Number.isNaN(L) && !Number.isNaN(C) && !Number.isNaN(h)) {
            return oklchToHex(L, C, h);
        }
    }

    return null;
};

const extractColorsFromSvgMarkup = (svgMarkup) => {
    const colors = new Set();
    if (!svgMarkup) return [];
    const attrRe = /(?:fill|stroke)="([^"]+)"/gi;
    const styleRe = /(?:fill|stroke)\s*:\s*([^;}"'\s][^;}"']*)/gi;
    let m;
    while ((m = attrRe.exec(svgMarkup)) !== null) {
        const c = normaliseCssColor(m[1].trim());
        if (c && !isNeutralHex(c)) colors.add(c);
    }
    while ((m = styleRe.exec(svgMarkup)) !== null) {
        const c = normaliseCssColor(m[1].trim());
        if (c && !isNeutralHex(c)) colors.add(c);
    }
    return Array.from(colors);
};

// Parse @font-face blocks from CSS text and return array of { family, srcs }
const parseFontFacesFromCss = (cssText) => {
    if (!cssText) return [];
    const blocks = cssText.match(/@font-face\s*{[\s\S]*?}/gi) || [];
    const out = [];
    for (const blk of blocks) {
        try {
            const famMatch = blk.match(/font-family\s*:\s*([^;]+);/i);
            let family = famMatch ? famMatch[1].trim().replace(/^['\"]|['\"]$/g, '') : null;
            const srcMatch = blk.match(/src\s*:\s*([^;]+)/i);
            const srcs = [];
            if (srcMatch) {
                // find url(...) occurrences
                const urlRe = /url\(([^)]+)\)/gi;
                let m;
                while ((m = urlRe.exec(srcMatch[1])) !== null) {
                    let u = m[1].trim().replace(/^['\"]|['\"]$/g, '');
                    if (u) srcs.push(u);
                }
            }
            if (family || srcs.length) out.push({ family: family || null, srcs });
        } catch (e) { /* skip malformed */ }
    }
    return out;
};

// Fetch and parse external CSS and inline <style> blocks to discover @font-face rules.
const discoverFontsFromCss = async ($, baseUrl) => {
    const discovered = { families: [], srcs: [], cssLinks: [] };
    try {
        // collect stylesheet links
        const linkHrefs = [];
        $('link[rel="stylesheet"]').each((_, el) => {
            const href = ($(el).attr('href') || '').trim(); if (href) linkHrefs.push(href);
        });

        // also check @import inside style tags
        const inlineStyles = [];
        $('style').each((_, el) => { inlineStyles.push($(el).html() || ''); });

        // fetch each external CSS and parse
        for (const rawHref of linkHrefs) {
            const abs = toAbsUrl(rawHref, baseUrl);
            if (!abs) continue;
            discovered.cssLinks.push(abs);
            try {
                const cssText = await fetchText(abs, 15000);
                if (!cssText) continue;
                // parse @font-face
                const ffaces = parseFontFacesFromCss(cssText);
                for (const f of ffaces) {
                    if (f.family) discovered.families.push(f.family);
                    for (const s of f.srcs) discovered.srcs.push(toAbsUrl(s, abs) || s);
                }
                // also look for @import rules to fetch nested CSS
                const importRe = /@import\s+(?:url\()?['\"]?([^'\")]+)['\"]?\)?/gi;
                let im;
                while ((im = importRe.exec(cssText)) !== null) {
                    const impUrl = toAbsUrl(im[1], abs);
                    if (impUrl) {
                        try {
                            const nested = await fetchText(impUrl, 15000);
                            if (nested) {
                                const nf = parseFontFacesFromCss(nested);
                                for (const f of nf) {
                                    if (f.family) discovered.families.push(f.family);
                                    for (const s of f.srcs) discovered.srcs.push(toAbsUrl(s, impUrl) || s);
                                }
                            }
                        } catch (e) { /* ignore nested fetch */ }
                    }
                }
            } catch (e) { logger.warn(`[Scraper] fetch CSS failed ${abs}: ${e.message}`); }
        }

        // parse inline styles
        for (const cssText of inlineStyles) {
            const ffaces = parseFontFacesFromCss(cssText);
            for (const f of ffaces) {
                if (f.family) discovered.families.push(f.family);
                for (const s of f.srcs) discovered.srcs.push(s);
            }
            // also parse @import inside inline styles
            const importRe = /@import\s+(?:url\()?['\"]?([^'\")]+)['\"]?\)?/gi;
            let im2;
            while ((im2 = importRe.exec(cssText)) !== null) {
                const impUrl = toAbsUrl(im2[1], baseUrl);
                if (impUrl) {
                    try {
                        const nested = await fetchText(impUrl, 15000);
                        if (nested) {
                            const nf = parseFontFacesFromCss(nested);
                            for (const f of nf) {
                                if (f.family) discovered.families.push(f.family);
                                for (const s of f.srcs) discovered.srcs.push(toAbsUrl(s, impUrl) || s);
                            }
                        }
                    } catch (e) { /* ignore */ }
                }
            }
        }
    } catch (e) {
        logger.warn(`[Scraper] discoverFontsFromCss failed: ${e.message}`);
    }
    // dedupe
    discovered.families = Array.from(new Set(discovered.families.map(f => f && f.trim()).filter(Boolean)));
    discovered.srcs = Array.from(new Set(discovered.srcs.filter(Boolean)));
    discovered.cssLinks = Array.from(new Set(discovered.cssLinks.filter(Boolean)));
    return discovered;
};

const extractLogoColors = async (logoUrl, _page, baseUrl, isFavicon = false) => {
    if (!logoUrl) {
        return { primary: null, secondary: null, palette: [], source: null };
    }

    // ✅ NEW GUARD
    if (logoUrl.startsWith('data:') && !logoUrl.startsWith('data:image/')) {
        logger.warn(`[LogoColors] Skipping non-image data URI: ${logoUrl.slice(0, 50)}`);
        return { primary: null, secondary: null, palette: [], source: null };
    }

    try {
        let imageBuffer;
        let isSvg = false;
        let svgMarkup = null;

        if (logoUrl.startsWith('data:image/')) {
            const match = logoUrl.match(/^data:([^;]+);base64,(.*)$/);
            if (match) {
                isSvg = match[1].includes('svg');
                imageBuffer = Buffer.from(match[2], 'base64');
                if (isSvg) svgMarkup = imageBuffer.toString('utf8');
            }
        } else {
            let resolvedUrl = logoUrl;
            if (!logoUrl.startsWith('http') && baseUrl) {
                try { resolvedUrl = new URL(logoUrl, baseUrl).toString(); } catch (_) { }
            }

            try {
                imageBuffer = await fetchBinary(resolvedUrl, baseUrl);
                const urlLower = resolvedUrl.toLowerCase();
                isSvg = urlLower.includes('.svg') || urlLower.includes('image/svg');
                if (!isSvg && imageBuffer.length > 4) {
                    const head = imageBuffer.slice(0, 100).toString('utf8');
                    isSvg = head.includes('<svg') || head.includes('<?xml');
                }
                if (isSvg) svgMarkup = imageBuffer.toString('utf8');
            } catch (e) {
                logger.warn(`[LogoColors] fetch failed for ${resolvedUrl}: ${e.message}`);
                return { primary: null, secondary: null, palette: [], source: null };
            }
        }

        if (!imageBuffer) return { primary: null, secondary: null, palette: [], source: null };

        if (isSvg && svgMarkup) {
            const svgColors = extractColorsFromSvgMarkup(svgMarkup);
            if (svgColors.length > 0) {
                if (resvgLib && sharpLib && VibrantLib) {
                    try {
                        const { Resvg } = resvgLib;
                        const resvg = new Resvg(svgMarkup, { fitTo: { mode: 'width', value: 256 } });
                        const pngBuffer = resvg.render().asPng();
                        const palette = await VibrantLib.from(pngBuffer).getPalette();
                        const vibrantColors = Object.values(palette)
                            .filter(s => s && s.hex)
                            .sort((a, b) => (b.population || 0) - (a.population || 0))
                            .map(s => s.hex.toUpperCase());
                        const merged = [...svgColors];
                        for (const vc of vibrantColors) {
                            if (!merged.some(c => c.toLowerCase() === vc.toLowerCase())) merged.push(vc);
                        }
                        return { primary: merged[0] || null, secondary: merged[1] || null, palette: merged.slice(0, 5), source: 'svg-direct' };
                    } catch (_) { /* fall through */ }
                }
                return { primary: svgColors[0] || null, secondary: svgColors[1] || null, palette: svgColors.slice(0, 5), source: 'svg-direct' };
            }
        }

        const isIco = (logoUrl || '').toLowerCase().includes('.ico');
        const useFaviconPath = isFavicon || isIco;

        if (useFaviconPath && sharpLib) {
            try {
                const { data } = await sharpLib(imageBuffer)
                    .resize(64, 64, { fit: 'inside', withoutEnlargement: true })
                    .ensureAlpha()
                    .raw()
                    .toBuffer({ resolveWithObject: true });

                const colorCount = {};
                for (let i = 0; i < data.length; i += 4) {
                    const [r, g, b, a] = [data[i], data[i + 1], data[i + 2], data[i + 3]];
                    if (a < 30) continue;
                    const rq = Math.round(r / 8) * 8;
                    const gq = Math.round(g / 8) * 8;
                    const bq = Math.round(b / 8) * 8;
                    const hex = '#' + [rq, gq, bq].map(v => Math.min(255, v).toString(16).padStart(2, '0')).join('').toUpperCase();
                    colorCount[hex] = (colorCount[hex] || 0) + 1;
                }

                const sorted = Object.entries(colorCount).sort((a, b) => b[1] - a[1]).map(([hex]) => hex);
                const nonNeutral = sorted.filter(c => !isNeutralHex(c));
                let colors = nonNeutral.length > 0 ? nonNeutral : sorted.filter(c => !['#FFFFFF', '#000000', '#FEFEFE', '#F8F8F8'].includes(c));

                // If neutral-filtering left us with too few colors to derive a secondary,
                // pad the candidate list with the next most common non-pure-white/black
                // pixels (even if borderline "neutral") so `secondary` isn't just dropped.
                if (colors.length < 2) {
                    const padding = sorted.filter(c =>
                        !colors.includes(c) && !['#FFFFFF', '#000000', '#FEFEFE', '#F8F8F8'].includes(c)
                    );
                    colors = colors.concat(padding);
                }
                const deduped = [];
                for (const hex of colors) {
                    const r1 = parseInt(hex.slice(1, 3), 16);
                    const g1 = parseInt(hex.slice(3, 5), 16);
                    const b1 = parseInt(hex.slice(5, 7), 16);
                    const isSim = deduped.some(h => {
                        const r2 = parseInt(h.slice(1, 3), 16);
                        const g2 = parseInt(h.slice(3, 5), 16);
                        const b2 = parseInt(h.slice(5, 7), 16);
                        return Math.abs(r1 - r2) < 20 && Math.abs(g1 - g2) < 20 && Math.abs(b1 - b2) < 20;
                    });
                    if (!isSim) deduped.push(hex);
                    if (deduped.length >= 5) break;
                }
                if (deduped.length > 0) {
                    const primary = deduped[0] || null;
                    // Only one distinct color survived filtering/dedup (common for
                    // single-color icon favicons) — synthesize a secondary shade
                    // instead of returning null.
                    const secondary = deduped[1] || (primary ? deriveShadeHex(primary) : null);
                    const palette = secondary && deduped.length < 2 ? [...deduped, secondary].slice(0, 5) : deduped.slice(0, 5);
                    return { primary, secondary, palette, source: 'favicon-pixel' };
                }
            } catch (e) {
                logger.warn(`[LogoColors] Favicon pixel extraction failed: ${e.message}`);
            }
        }

        if (VibrantLib && sharpLib) {
            try {
                const resized = await sharpLib(imageBuffer)
                    .resize(250, 250, { fit: 'inside', withoutEnlargement: true })
                    .flatten({ background: '#FFFFFF' })
                    .png()
                    .toBuffer();
                const palette = await VibrantLib.from(resized).maxColorCount(64).getPalette();
                const colors = Object.values(palette)
                    .filter(s => s && s.hex)
                    .sort((a, b) => (b.population || 0) - (a.population || 0))
                    .map(s => s.hex.toUpperCase())
                    .filter(c => c && !isNeutralHex(c));
                const source = useFaviconPath ? 'favicon-vibrant' : 'vibrant';
                return { primary: colors[0] || null, secondary: colors[1] || null, palette: colors.slice(0, 5), source };
            } catch (e) {
                logger.warn(`[LogoColors] Vibrant failed: ${e.message}`);
            }
        }
        return { primary: null, secondary: null, palette: [], source: null };
    } catch (err) {
        logger.warn(`[LogoColors] Unexpected error: ${err.message}`);
        return { primary: null, secondary: null, palette: [], source: null };
    }
};

// Non-browser fallback: extract dominant colors from available images (logo, favicon, hero, first N images)
const extractColorsFromImagesFallback = async (raw, baseUrl) => {
    const tryUrls = [];
    if (raw.logoUrl) tryUrls.push(raw.logoUrl);
    if (raw.favicon) tryUrls.push(raw.favicon);
    if (Array.isArray(raw.images) && raw.images.length) {
        // prioritize hero images
        const hero = raw.images.find(i => i.section === 'hero');
        if (hero && hero.url) tryUrls.push(hero.url);
        // then a few page images
        for (const img of raw.images.slice(0, 8)) if (img.url) tryUrls.push(img.url);
    }

    const seen = new Set();
    const buffers = [];
    for (let u of tryUrls) {
        if (!u) continue;
        if (u.startsWith('inline-svg:')) {
            const idx = parseInt(u.split(':')[1] || '0', 10);
            const img = raw.images && raw.images[idx];
            if (img && img.markup) {
                const svcs = extractColorsFromSvgMarkup(img.markup);
                svcs.forEach(c => seen.add(c));
            }
            continue;
        }
        let abs = u;
        if (!u.startsWith('http') && baseUrl) {
            try { abs = new URL(u, baseUrl).href; } catch (_) { abs = u; }
        }
        if (!abs || seen.has(abs)) continue;
        seen.add(abs);
        try {
            const buf = await fetchBinary(abs, baseUrl, 10000);
            if (buf && buf.length) buffers.push(buf);
        } catch (e) {
            logger.warn(`[Scraper] fallback image fetch failed ${abs}: ${e.message}`);
        }
        if (buffers.length >= 6) break;
    }

    const palette = [];
    const addToPalette = (hex) => {
        if (!hex) return;
        const n = normaliseCssColor(hex);
        if (!n) return;
        if (!isNeutralHex(n) && !palette.includes(n)) palette.push(n);
    };

    const colorFromBuffer = async (buf) => {
        if (!buf) return null;
        // SVG already handled above
        if (VibrantLib) {
            try {
                const v = await VibrantLib.from(buf).getPalette();
                const order = ['Vibrant', 'DarkVibrant', 'LightVibrant', 'Muted', 'DarkMuted', 'LightMuted'];
                for (const k of order) {
                    const sw = v[k];
                    if (sw && sw.getHex) return sw.getHex().toUpperCase();
                }
            } catch (e) { /* fallthrough */ }
        }
        if (sharpLib) {
            try {
                const p = await sharpLib(buf).resize(1, 1).raw().toBuffer();
                const r = p[0], g = p[1], b = p[2];
                return ('#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')).toUpperCase();
            } catch (e) { /* ignore */ }
        }
        return null;
    };

    for (const b of buffers) {
        try {
            const hex = await colorFromBuffer(b);
            addToPalette(hex);
        } catch (e) { /* ignore */ }
    }

    // Also include CSS-derived candidates
    (raw.allBgs || []).slice(0, 20).forEach(addToPalette);
    (raw.allTexts || []).slice(0, 20).forEach(addToPalette);

    // Helper: compute saturation & luminance
    const hexToRgb = (h) => {
        if (!h || h[0] !== '#') return null;
        const hv = h.length === 7 ? h.slice(1) : h.length === 4 ? h.slice(1).split('').map(c => c + c).join('') : null;
        if (!hv) return null;
        return [parseInt(hv.slice(0, 2), 16), parseInt(hv.slice(2, 4), 16), parseInt(hv.slice(4, 6), 16)];
    };
    const rgbToHsl = (r, g, b) => {
        r /= 255; g /= 255; b /= 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h = 0, s = 0, l = (max + min) / 2;
        if (max !== min) {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) { case r: h = (g - b) / d + (g < b ? 6 : 0); break; case g: h = (b - r) / d + 2; break; case b: h = (r - g) / d + 4; break; }
            h = Math.round(h * 60);
        }
        return { h, s, l };
    };
    const saturation = (hex) => { const rgb = hexToRgb(hex); if (!rgb) return 0; return rgbToHsl(...rgb).s; };
    const luminance = (hex) => { const rgb = hexToRgb(hex); if (!rgb) return 0; return rgbToHsl(...rgb).l; };

    // Decide header/nav/button/footer heuristics
    const pickHeader = () => {
        // prefer explicit CSS
        const hcss = raw.themeColors?.header?.bg; if (hcss) return normaliseCssColor(hcss);
        // prefer logo dominant
        if (raw.logoUrl) {
            const p = palette[0]; if (p) return p;
        }
        return palette[0] || null;
    };
    const pickNav = () => {
        const ncss = raw.themeColors?.navigation?.background; if (ncss) return normaliseCssColor(ncss);
        return palette[0] || null;
    };
    const pickButton = () => {
        const bcss = raw.themeColors?.button?.bg; if (bcss) return normaliseCssColor(bcss);
        // pick most saturated color
        const sorted = palette.slice().sort((a, b) => saturation(b) - saturation(a));
        return sorted[0] || palette[0] || null;
    };
    const pickFooter = () => {
        const fcss = raw.themeColors?.footer?.bg; if (fcss) return normaliseCssColor(fcss);
        // pick darkest
        const sorted = palette.slice().sort((a, b) => luminance(a) - luminance(b));
        return sorted[0] || null;
    };

    // derive a representative screenshot from first buffer when renderer isn't available
    let screenshotDataUri = null;
    try {
        if (buffers.length) {
            const buf = buffers[0];
            const start = buf.toString('utf8', 0, Math.min(buf.length, 256));
            if (/^\s*<svg[\s\S]*<\/svg>\s*$/i.test(start) || /^<\?xml/i.test(start)) {
                // treat as SVG markup
                screenshotDataUri = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(buf.toString('utf8'));
            } else {
                screenshotDataUri = `data:image/png;base64,${buf.toString('base64')}`;
            }
        } else if (raw.logoUrl) {
            screenshotDataUri = raw.logoUrl.startsWith('data:') ? raw.logoUrl : toAbsUrl(raw.logoUrl, baseUrl) || raw.logoUrl;
        }
    } catch (e) { /* ignore */ }

    // compute a body color by averaging image buffers if possible
    let body = null;
    try {
        const cols = [];
        for (const b of buffers) {
            const h = await colorFromBuffer(b);
            if (h) cols.push(h);
        }
        if (cols.length) {
            const rgbs = cols.map(hexToRgb).filter(Boolean);
            if (rgbs.length) {
                const sum = rgbs.reduce((acc, c) => [acc[0] + c[0], acc[1] + c[1], acc[2] + c[2]], [0, 0, 0]);
                const avg = sum.map(v => Math.round(v / rgbs.length));
                body = ('#' + avg.map(x => x.toString(16).padStart(2, '0')).join('')).toUpperCase();
            }
        }
        if (!body && palette.length) body = palette[0];
    } catch (e) { body = palette[0] || null; }

    return { palette, header: pickHeader(), navigation: pickNav(), button: pickButton(), footer: pickFooter(), body, screenshot: screenshotDataUri };
};

// Given a Vibrant getPalette() result (an object keyed by swatch name —
// Vibrant/DarkVibrant/LightVibrant/Muted/DarkMuted/LightMuted), return the
// swatch that actually covers the most pixels in the sampled region, i.e.
// the true "majority" color — not just whichever swatch type happens to be
// first in the object (that was the previous, incorrect behavior).
const pickMajoritySwatch = (paletteObj) => {
    if (!paletteObj) return null;
    const swatches = Object.values(paletteObj).filter(sw => sw && typeof sw.getHex === 'function');
    if (!swatches.length) return null;
    const population = (sw) => {
        if (typeof sw.getPopulation === 'function') return sw.getPopulation() || 0;
        if (typeof sw.population === 'number') return sw.population;
        return 0;
    };
    swatches.sort((a, b) => population(b) - population(a));
    const top = swatches[0];
    return top.getHex ? top.getHex().toUpperCase() : null;
};

// TRUE majority-color extractor by actual pixel frequency.
// Unlike Vibrant (which only ever returns 6 fixed "aesthetic" categories —
// Vibrant/DarkVibrant/LightVibrant/Muted/DarkMuted/LightMuted — and can
// therefore miss whatever color literally covers the most pixels on screen),
// this reads the raw decoded pixels of the screenshot/crop, buckets them into
// a small quantized palette, and counts real frequency. This is what actually
// answers "what color shows up the most in this screenshot".
const getPixelHistogramColors = async (buffer, { maxColors = 8, ignoreNeutral = true, bucketSize = 16 } = {}) => {
    if (!sharpLib || !buffer) return [];
    try {
        const { data, info } = await sharpLib(buffer)
            .resize(150, 150, { fit: 'inside' })
            .ensureAlpha()
            .raw()
            .toBuffer({ resolveWithObject: true });
        const channels = info.channels || 4;
        const counts = new Map();
        const bucket = (v) => Math.min(255, Math.round(v / bucketSize) * bucketSize);
        for (let i = 0; i + channels <= data.length; i += channels) {
            if (channels === 4 && data[i + 3] < 16) continue; // skip transparent pixels
            const r = bucket(data[i]);
            const g = bucket(data[i + 1]);
            const b = bucket(data[i + 2]);
            const key = `${r},${g},${b}`;
            counts.set(key, (counts.get(key) || 0) + 1);
        }
        const total = data.length / channels;
        const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]);
        const results = sorted.map(([key, count]) => {
            const [r, g, b] = key.split(',').map(Number);
            const hex = ('#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')).toUpperCase();
            return { hex, share: total ? count / total : 0 };
        });
        const filtered = ignoreNeutral ? results.filter(r => !isNeutralHex(r.hex)) : results;
        return filtered.slice(0, maxColors).map(r => r.hex);
    } catch (e) {
        logger.warn(`[Scraper] pixel histogram extraction failed: ${e.message}`);
        return [];
    }
};

// Capture a full-page screenshot and extract region colors (header, nav, button, footer)
const captureRenderedColors = async (url) => {
    if (!playwright) {
        logger.warn('[Scraper] captureRenderedColors skipped — playwright not installed, screenshot-based colors unavailable');
        return null;
    }
    if (!sharpLib && !VibrantLib) {
        logger.warn('[Scraper] captureRenderedColors skipped — neither sharp nor vibrant available, screenshot-based colors unavailable');
        return null;
    }
    let browser = null;
    try {
        browser = await playwright.chromium.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'], headless: true });
        const context = await browser.newContext({
            viewport: { width: 1280, height: 900 },
            userAgent: DEFAULT_UA,
            locale: 'en-US',
            ignoreHTTPSErrors: true,
        });
        const page = await context.newPage();

        // Try navigation with progressively relaxed wait strategies to avoid long timeouts on heavy pages
        let navigated = false;
        try {
            await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
            navigated = true;
        } catch (e1) {
            logger.warn(`[Scraper] page.goto networkidle failed: ${e1.message}`);
            try {
                await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
                navigated = true;
            } catch (e2) {
                logger.warn(`[Scraper] page.goto domcontentloaded failed: ${e2.message}`);
                try {
                    await page.goto(url, { waitUntil: 'load', timeout: 60000 });
                    navigated = true;
                } catch (e3) {
                    logger.warn(`[Scraper] page.goto load failed: ${e3.message}`);
                }
            }
        }
        if (!navigated) {
            // final attempt: open without waiting and proceed to screenshot after a short delay
            try {
                await page.goto(url, { timeout: 20000 });
                await page.waitForTimeout(3500);
            } catch (e) {
                logger.warn(`[Scraper] final non-waiting goto failed: ${e.message}`);
            }
        }

        const fullBuffer = await page.screenshot({ fullPage: true });
        const computedTheme = await page.evaluate(() => {
            const isTransparentBg = (bg) => {
                if (!bg) return true;
                return /^(transparent|none|rgba\(0,\s*0,\s*0,\s*0\))$/i.test(bg.trim());
            };

            const safeQuery = (selectors) => {
                let firstMatch = null;
                for (const selector of selectors) {
                    try {
                        const el = document.querySelector(selector);
                        if (!el) continue;
                        if (!firstMatch) firstMatch = el;
                        const style = window.getComputedStyle(el);
                        const bg = style.getPropertyValue('background-color') || style.getPropertyValue('background') || null;
                        if (!isTransparentBg(bg)) return el;
                    } catch (_) {
                        continue;
                    }
                }
                return firstMatch;
            };

            const getComputed = (el) => {
                if (!el) return null;
                const style = window.getComputedStyle(el);
                return {
                    background: style.getPropertyValue('background-color') || style.getPropertyValue('background') || null,
                    color: style.getPropertyValue('color') || null,
                    border: style.getPropertyValue('border-color') || style.getPropertyValue('border-top-color') || style.getPropertyValue('border-bottom-color') || null,
                };
            };

            const selectors = {
                header: ['header', '.site-header', '.main-header', '#header', '.header', '.navbar'],
                navigation: ['nav', '.navigation', '#site-navigation', '.navbar', '.site-nav', '.main-nav'],
                button: ['.btn-primary', '.button-primary', 'button.primary', '.wp-block-button__link', '.btn', 'button', 'a.button', '.cta', '.call-to-action'],
                footer: ['footer', '.site-footer', '.footer'],
                hero: ['.hero', '.banner', '.hero-section', '.hero-banner'],
                page: ['body', 'html'],
            };

            const elementComputed = {};
            for (const [key, sels] of Object.entries(selectors)) {
                const el = safeQuery(sels);
                if (!el) continue;
                elementComputed[key] = getComputed(el);
            }
            const navLink = safeQuery(['nav a', '.navbar a', '.site-nav a', 'header a']);
            if (navLink) {
                const style = window.getComputedStyle(navLink);
                elementComputed.navigation = {
                    ...(elementComputed.navigation || {}),
                    link: style.getPropertyValue('color') || null,
                };
            }

            const rootStyle = window.getComputedStyle(document.documentElement);
            const cssVariables = {};
            for (let i = 0; i < rootStyle.length; i += 1) {
                const name = rootStyle[i];
                if (typeof name === 'string' && name.startsWith('--')) {
                    const value = rootStyle.getPropertyValue(name).trim();
                    if (value) cssVariables[name] = value;
                }
            }

            const bodyBackground = window.getComputedStyle(document.body).getPropertyValue('background-color') || null;
            return { cssVariables, elementComputed, bodyBackground };
        });

        const selectors = {
            header: ['header', '.site-header', '.main-header', '#header', '.header'],
            navigation: ['nav', '.navbar', '.site-nav', '.main-nav'],
            button: ['.btn-primary', '.button-primary', 'button.primary', '.cta', 'a.button'],
            footer: ['footer', '.site-footer', '.footer'],
            body: ['body', 'main', '#main', '.page', '.site'],
        };

        const colors = { palette: [], computedTheme };
        // PRIMARY: true pixel-frequency histogram — counts actual pixels in the
        // decoded screenshot, so palette[0] genuinely is the color that covers
        // the most area on the rendered page (this is what "majority color"
        // should mean). Vibrant is appended afterwards purely as enrichment
        // (it can surface a distinct accent color the histogram's quantization
        // buckets together with something else), never as the primary source.
        try {
            const histogramColors = await getPixelHistogramColors(fullBuffer, { maxColors: 10, ignoreNeutral: true });
            if (histogramColors.length) colors.palette.push(...histogramColors);
        } catch (e) { logger.warn(`[Scraper] full-page histogram failed: ${e.message}`); }

        if (VibrantLib) {
            try {
                const v = await VibrantLib.from(fullBuffer).getPalette();
                const swatches = Object.values(v).filter(sw => sw && sw.getHex);
                const population = (sw) => (typeof sw.getPopulation === 'function' ? sw.getPopulation() || 0 : (sw.population || 0));
                swatches.sort((a, b) => population(b) - population(a));
                const vibrantColors = swatches.map(s => s.getHex().toUpperCase()).filter(Boolean);
                for (const c of vibrantColors) if (!colors.palette.includes(c)) colors.palette.push(c);
            } catch (e) { /* ignore */ }
        }
        if (!colors.palette.length) {
            logger.warn('[Scraper] no colors extracted from screenshot — sharp/vibrant may be unavailable or screenshot capture failed');
        }

        // Helper to crop region and get the majority (most-pixels) dominant color.
        // Histogram (true pixel count) is tried first since it reflects what's
        // actually on screen; Vibrant's fixed swatch categories are only used
        // as a fallback when the histogram has nothing usable (e.g. a nearly
        // monochrome crop where every pixel is filtered as neutral).
        const getRegionColor = async (bbox) => {
            if (!bbox || bbox.width === 0 || bbox.height === 0) return null;
            if (!sharpLib) return null;
            try {
                const cropped = await sharpLib(fullBuffer).extract({ left: Math.max(0, Math.floor(bbox.x)), top: Math.max(0, Math.floor(bbox.y)), width: Math.max(1, Math.floor(bbox.width)), height: Math.max(1, Math.floor(bbox.height)) }).toBuffer();
                const histColors = await getPixelHistogramColors(cropped, { maxColors: 3, ignoreNeutral: true });
                if (histColors.length) return histColors[0];
                if (VibrantLib) {
                    const pv = await VibrantLib.from(cropped).getPalette();
                    const majority = pickMajoritySwatch(pv);
                    if (majority) return majority;
                }
                return null;
            } catch (e) { return null; }
        };

        for (const [key, sels] of Object.entries(selectors)) {
            let bbox = null;
            for (const sel of sels) {
                try {
                    const el = await page.$(sel);
                    if (!el) continue;
                    const box = await el.boundingBox();
                    if (box && box.width > 5 && box.height > 5) { bbox = box; break; }
                } catch (e) { /* ignore selector errors */ }
            }
            // For body we prefer sampling a central area if possible
            if (key === 'body') {
                let bodyColor = null;
                try {
                    if (sharpLib) {
                        const meta = await sharpLib(fullBuffer).metadata();
                        const w = meta.width || 1280;
                        const h = meta.height || 900;
                        const cw = Math.min(800, Math.floor(w * 0.6));
                        const ch = Math.min(600, Math.floor(h * 0.6));
                        const left = Math.max(0, Math.floor((w - cw) / 2));
                        const top = Math.max(0, Math.floor((h - ch) / 2));
                        const cropped = await sharpLib(fullBuffer).extract({ left, top, width: Math.max(1, cw), height: Math.max(1, ch) }).toBuffer();
                        const histColors = await getPixelHistogramColors(cropped, { maxColors: 3, ignoreNeutral: true });
                        if (histColors.length) bodyColor = histColors[0];
                        if (!bodyColor && VibrantLib) {
                            const pv = await VibrantLib.from(cropped).getPalette();
                            const majority = pickMajoritySwatch(pv);
                            if (majority) bodyColor = majority;
                        }
                        if (!bodyColor) {
                            const p = await sharpLib(cropped).resize(1, 1).raw().toBuffer();
                            const r = p[0], g = p[1], b = p[2];
                            bodyColor = ('#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')).toUpperCase();
                        }
                    } else {
                        // fallback to palette
                        bodyColor = colors.palette && colors.palette.length ? colors.palette[0] : null;
                    }
                } catch (e) {
                    bodyColor = colors.palette && colors.palette.length ? colors.palette[0] : null;
                }
                colors[key] = bodyColor || null;
            } else {
                colors[key] = await getRegionColor(bbox) || null;
            }
        }

        // attach screenshot as data-uri (small risk of large memory — truncated)
        const screenshotDataUri = `data:image/png;base64,${fullBuffer.toString('base64')}`;
        await browser.close(); browser = null;
        return { screenshot: screenshotDataUri, colors, computed: computedTheme };
    } catch (e) {
        try { if (browser) await browser.close(); } catch (ignore) { }
        logger.warn(`[Scraper] captureRenderedColors failed: ${e.message}`);
        return null;
    }
};

const SECTION_KEYWORDS = {
    hero: ['hero', 'banner', 'jumbotron', 'masthead', 'splash', 'top-section'],
    about: ['about', 'who-we-are', 'our-story', 'mission', 'vision'],
    services: ['service', 'services', 'what-we-do', 'offering', 'solution'],
    features: ['feature', 'features', 'capability', 'benefit', 'why-us', 'why-choose'],
    testimonials: ['testimonial', 'review', 'feedback', 'client-say', 'what-client'],
    pricing: ['pricing', 'price', 'plan', 'package', 'tariff'],
    faq: ['faq', 'question', 'accordion', 'help'],
    contact: ['contact', 'get-in-touch', 'reach-us', 'reach-out'],
    footer: ['footer', 'bottom'],
};

const extractWithCheerio = ($, html, baseUrl) => {
    const getText = (el) => cleanStr($(el).text());
    const getAttr = (el, a) => ($(el).attr(a) || '').trim();

    const getRealSrc = (el) => {
        const $el = $(el);
        // FIX 2: Parse srcset properly — sort by width descriptor and pick highest res.
        // Old code split on /[\s,]+/ which could mangle "img.png 800w, img@2x.png 1200w".
        const srcset = $el.attr('srcset') || '';
        let bestSrcsetUrl = null;
        if (srcset) {
            const candidates = srcset.split(',').map(s => {
                const parts = s.trim().split(/\s+/);
                const descriptor = parts[1] || '';
                const width = parseInt(descriptor) || 0;
                return { url: parts[0], width };
            }).filter(c => c.url);
            if (candidates.length > 0) {
                candidates.sort((a, b) => b.width - a.width);
                bestSrcsetUrl = candidates[0].url;
            }
        }
        return (
            $el.attr('data-src') ||
            $el.attr('data-lazy-src') ||
            $el.attr('data-original') ||
            $el.attr('data-lazy') ||
            bestSrcsetUrl ||
            $el.attr('src') || null
        );
    };

    const toAbs = (src) => {
        if (!src) return null;
        if (src.startsWith('data:')) return src;
        return toAbsUrl(src, baseUrl);
    };

    const getSectionForEl = ($el) => {
        let cur = $el.parent();
        for (let i = 0; i < 8 && cur.length; i++) {
            const combined = ((cur.attr('class') || '') + ' ' + (cur.attr('id') || '')).toLowerCase();
            for (const [sec, kws] of Object.entries(SECTION_KEYWORDS)) {
                if (kws.some(k => combined.includes(k))) return sec;
            }
            cur = cur.parent();
        }
        return 'unknown';
    };

    const pageTitle = cleanStr($('title').first().text());
    const metaDesc = $('meta[name="description"]').attr('content') || $('meta[property="og:description"]').attr('content') || '';
    const ogTitle = $('meta[property="og:title"]').attr('content') || '';
    const ogSiteName = $('meta[property="og:site_name"]').attr('content') || '';

    const LOGO_IMG_EXTS = /\.(jpe?g|png|gif|bmp|webp|tiff?|svg|ai|eps|apng|raw|cr2|nef|arw|ico)(\?.*)?$/i;
    const isSupportedImageSrc = (src) => {
        if (!src) return false;
        if (src.startsWith('data:image/')) return true;
        try {
            const path = new URL(src, baseUrl).pathname;
            return LOGO_IMG_EXTS.test(path);
        } catch {
            return LOGO_IMG_EXTS.test(src);
        }
    };

    // FIX 9: The top-priority logo selectors matched ANY <img> on the entire page whose
    // class/id/alt/src merely contained the substring "logo" — not scoped to the header/nav
    // at all. Pages that show partner/certification badges (e.g. a "Bing partner logo" image
    // sitting in a mid-page trust-badges section) have "logo" right there in their alt text,
    // so that badge was winning over the real site logo — which often has no literal "logo"
    // word in its alt/class (e.g. alt="ebrandz") but does sit inside <header>/<nav>. Fix:
    // try header/nav-scoped matches (with or without the "logo" keyword) first, and only
    // fall back to an unscoped keyword match anywhere on the page as a last resort.
    const LOGO_SELECTORS = [
        // 1. Highest confidence — scoped to header/nav AND has an explicit logo marker.
        'header img[class*="logo" i]', 'nav img[class*="logo" i]', '.navbar img[class*="logo" i]', '.site-header img[class*="logo" i]',
        'header img[class*="custom-logo" i]', 'nav img[class*="custom-logo" i]', '.site-header img[class*="custom-logo" i]',
        'header img[class*="site-logo" i]', 'nav img[class*="site-logo" i]', '.site-header img[class*="site-logo" i]',
        'header img[id*="logo" i]', 'nav img[id*="logo" i]',
        'header img[alt*="logo" i]', 'nav img[alt*="logo" i]', '.site-header img[alt*="logo" i]',
        'header img[src*="logo" i]', 'nav img[src*="logo" i]',
        'a.custom-logo-link img', '.custom-logo img', '.elementor-widget-theme-site-logo img', '.et_pb_menu_logo img', '.elementor-nav-menu__logo img',
        // Beaver Builder / FL Builder patterns
        '.fl-logo img', '.fl-module-logo img', '.fl-builder-content img', '.fl-node img', '.bb-logo img',
        // 2. Wrapper-based logo containers (the wrapper's own class/id carries the signal).
        '[class*="logo" i] img', '[id*="logo" i] img',
        '.navbar-brand img', '.site-logo img', '.header-logo img', '.brand-logo img',
        // 3. Common CMS/framework patterns
        'a.logo img', '.brand img', '.site-header img', '.main-header img',
        // 4. Plain header/nav image, no "logo" keyword needed — being located in the
        //    header/nav is itself a strong signal, and should beat an unscoped keyword
        //    match found elsewhere on the page (e.g. a partner badge in the body/footer).
        'a[href="/"] img', 'header img', 'nav img', '.navbar img',
        // 5. Unscoped keyword fallback — last resort before inline SVG / og:image, since a
        //    "logo" keyword match with no location signal is the weakest evidence (it's what
        //    incorrectly matched partner/certification badges in the past).
        'img[class*="logo" i]', 'img[class*="custom-logo" i]', 'img[id*="logo" i]', 'img[alt*="logo" i]', 'img[src*="logo" i]',
        // 6. og:image last — often a social banner, not the actual logo
        'meta[property="og:image"]',
    ];

    // FIX 6: Inline-<svg> detection used to run BEFORE the <img>-based LOGO_SELECTORS loop,
    // using very generic selectors like 'header svg' / 'nav svg' / '[role="banner"] svg'.
    // Those match ANY svg sitting in the header/nav — dropdown chevrons, hamburger icons,
    // search icons, social icons — not just an actual logo. On sites where the real logo is
    // a plain <img> (e.g. a PNG) but the header also contains a small UI icon (e.g. a
    // dropdown-arrow svg with classes like "group-hover:rotate-180"), that icon was winning
    // and being reported as the logo instead of the real image. Fix: try the higher-confidence
    // <img>/og:image selectors first, and only fall back to inline SVG if nothing real is
    // found — and even then, skip elements that look like utility icons rather than blindly
    // taking the first SVG match.
    const INLINE_SVG_CONTAINERS = [
        // Logo-specific containers first — highest confidence among the SVG fallbacks.
        '[class*="logo"] svg', '[id*="logo"] svg',
        '.navbar-brand svg', '.site-header svg', '.site-logo svg',
        // Generic header/nav containers last — these need the utility-icon filter below.
        '[role="banner"] svg', 'header svg', 'nav svg',
    ];

    const UTILITY_ICON_PATTERN = /\b(icon|chevron|arrow|caret|dropdown|toggle|hamburger|burger|menu[-_]?icon|search|cart|social|close|expand|collapse|rotate|accordion|nav[-_]?icon)\b/i;

    const looksLikeUtilityIcon = (el) => {
        const self = `${el.attr('class') || ''} ${el.attr('id') || ''}`;
        const parent = el.parent();
        const parentAttrs = `${parent.attr('class') || ''} ${parent.attr('id') || ''}`;
        if (UTILITY_ICON_PATTERN.test(self) || UTILITY_ICON_PATTERN.test(parentAttrs)) return true;

        // Many UI icons (chevrons, carets, hamburgers) are sized purely via CSS classes
        // (e.g. Tailwind's "w-4 h-4") rather than width/height attributes, so the old
        // attribute-only size check never caught them. A small square viewBox (typical
        // icon-font/SVG-sprite size) is a strong tell unless something nearby says "logo".
        const viewBox = el.attr('viewBox') || el.attr('viewbox') || '';
        const vb = viewBox.trim().split(/\s+/).map(Number);
        if (vb.length === 4 && vb[2] > 0 && vb[2] <= 32 && vb[3] > 0 && vb[3] <= 32) {
            if (!/logo|brand/i.test(self) && !/logo|brand/i.test(parentAttrs)) return true;
        }
        return false;
    };

    let logoUrl = null;
    let logoFormat = null;
    let inlineSvgLogoMarkup = null;

    // 1. Try <img>-based selectors and og:image first — these are the highest-confidence
    //    signals and should win whenever a real logo image actually exists on the page.
    for (const sel of LOGO_SELECTORS) {
        const el = $(sel).first();
        if (!el.length) continue;
        if (el.is('meta')) {
            const content = el.attr('content');
            const abs = toAbs(content);
            // og:image is our last resort — reject it if it looks like a banner
            // (wide aspect from explicit attributes, or URL keywords like /og/, /social/, /share/, /banner/)
            if (abs && isSupportedImageSrc(abs)) {
                const bannerPathRe = /\/(og[-_]?image|social[-_]share|share[-_]image|og-banner|banner|meta[-_]img|preview[-_]img|twitter[-_]card|og\/|social\/)/i;
                if (!bannerPathRe.test(abs)) {
                    logoUrl = abs; logoFormat = 'og-image'; break;
                }
                logger.info(`[Scraper] Skipping og:image banner: ${abs}`);
            }
        } else {
            const src = getRealSrc(el);
            const absSrc = toAbs(src);

            // FIX 10: Banner-dimension check was too aggressive.
            // Most website logos are deliberately wide (horizontal layout), so an aspect ratio > 3.5
            // is normal for a logo, NOT a sign of a banner. Only apply strict dimension filtering
            // for lower-confidence selectors (generic keyword matches with no location signal).
            // For high-confidence selectors like "header img[class*='logo']" that are already
            // scoped to header/nav, trust the location signal over dimension assumptions.
            const isHighConfidenceSelector = /(^header |^nav |\.navbar|\.site-header|\.brand-logo|\.site-logo|\.header-logo|a\.logo|a\[href="\/"]\s+img|header\s+img|nav\s+img|\.navbar\s+img)/i.test(sel);
            
            if (!isHighConfidenceSelector) {
                // Only apply strict dimension check to low-confidence selectors (fallbacks)
                const isBannerDimension = (() => {
                    const w = parseInt(el.attr('width') || '0', 10);
                    const h = parseInt(el.attr('height') || '0', 10);
                    return w > 0 && h > 0 && (w / h) > 5; // Relaxed from 3.5 to 5 (e.g., 500x100 is still OK)
                })();
                if (isBannerDimension) {
                    logger.info(`[Scraper] Skipping banner-shaped image via "${sel}" (aspect ratio > 5)`);
                    continue;
                }
            }

            if (!absSrc && src && src.startsWith('data:image/')) {
                logoUrl = src;
                logoFormat = src.startsWith('data:image/svg') ? 'svg-inline' : 'data-uri';
                break;
            }
            if (absSrc && isSupportedImageSrc(absSrc)) {
                logoUrl = absSrc;
                logoFormat = absSrc.toLowerCase().includes('.svg') ? 'svg-url' : 'raster-url';
                break;
            }
        }
    }

    // 2. Only fall back to inline <svg> if no real logo image was found, and skip anything
    //    that looks like a utility icon (chevrons, hamburgers, search/cart/social icons, etc.)
    //    instead of blindly taking the first SVG match in the header/nav.
    if (!logoUrl) {
        for (const sel of INLINE_SVG_CONTAINERS) {
            const matches = $(sel).toArray();
            let found = false;
            for (const rawEl of matches) {
                const el = $(rawEl);
                if (looksLikeUtilityIcon(el)) continue;
                const markup = $.html(el);
                const hasShape = /<(path|rect|circle|ellipse|polygon|use|image)/i.test(markup);
                const w = parseInt(el.attr('width') || '0', 10);
                const h = parseInt(el.attr('height') || '0', 10);
                const tooSmall = (w > 0 && w < 24) && (h > 0 && h < 24);
                if (hasShape && !tooSmall && markup.length > 60) {
                    inlineSvgLogoMarkup = markup;
                    logoFormat = 'svg-inline-dom';
                    logoUrl = 'data:image/svg+xml,' + encodeURIComponent(markup);
                    logger.info(`[Scraper] Inline SVG logo found via "${sel}"`);
                    found = true;
                    break;
                }
            }
            if (found) break;
        }
    }

    // FIX 5: JSON-LD structured data logo extraction.
    // Many sites (especially those following Google's guidelines) define their logo
    // in <script type="application/ld+json"> — this was completely missed before.
    if (!logoUrl) {
        $('script[type="application/ld+json"]').each((_, el) => {
            if (logoUrl) return false; // already found
            try {
                const jsonText = $(el).html() || '';
                const data = JSON.parse(jsonText);
                const entries = Array.isArray(data) ? data : [data];
                for (const entry of entries) {
                    const logoField =
                        (entry.logo && (entry.logo.url || (typeof entry.logo === 'string' ? entry.logo : null))) ||
                        (entry.image && (entry.image.url || (typeof entry.image === 'string' ? entry.image : null)));
                    if (logoField) {
                        const abs = toAbs(logoField);
                        if (abs && isSupportedImageSrc(abs)) {
                            logoUrl = abs;
                            logoFormat = abs.toLowerCase().includes('.svg') ? 'svg-url' : 'raster-url';
                            logger.info(`[Scraper] JSON-LD logo found: ${abs}`);
                            return false; // break .each()
                        }
                    }
                }
            } catch (_) { /* malformed JSON-LD — skip */ }
        });
    }

    const faviconSelectors = [
        'link[rel="icon"][sizes="any"]', 'link[rel="icon"][type="image/svg+xml"]',
        'link[rel="icon"][sizes="192x192"]', 'link[rel="icon"][sizes="128x128"]',
        'link[rel="icon"][sizes="64x64"]', 'link[rel="icon"][sizes="48x48"]',
        'link[rel="icon"][sizes="32x32"]', 'link[rel="icon"][sizes="16x16"]',
        'link[rel="shortcut icon"]', 'link[rel="icon"]', 'link[rel="apple-touch-icon"]',
        'link[rel="apple-touch-icon-precomposed"]', 'meta[name="msapplication-TileImage"]',
    ];

    let favicon = null;
    for (const sel of faviconSelectors) {
        const el = $(sel).first();
        if (el.length) {
            favicon = el.attr('href') || el.attr('content') || null;
            if (favicon) break;
        }
    }
    try {
        const origin = new URL(originalUrl || baseUrl).origin;
        if (!favicon) favicon = origin + '/favicon.ico';
    } catch (e) {
        logger.warn('[Scraper] Failed to build favicon fallback');
    } favicon = toAbs(favicon);
    if (!logoUrl && favicon) { logoUrl = favicon; logoFormat = 'favicon-fallback'; }

    const cssVariables = {};
    const allBgs = [], allTexts = [];
    const cssVarRegex = /--([a-zA-Z][a-zA-Z0-9-]*)\s*:\s*([^;}{]+)/g;

    $('style').each((_, el) => {
        const cssText = $(el).html() || '';
        let m;
        cssVarRegex.lastIndex = 0;
        while ((m = cssVarRegex.exec(cssText)) !== null) {
            cssVariables[m[1]] = m[2].trim();
        }
        const hexRe = /#([0-9a-fA-F]{6})\b/g;
        let hexMatch;
        while ((hexMatch = hexRe.exec(cssText)) !== null) {
            allBgs.push('#' + hexMatch[1]);
        }
    });

    const metaTheme = $('meta[name="theme-color"]').attr('content');
    const metaMsTile = $('meta[name="msapplication-TileColor"]').attr('content');
    const metaOgColor = $('meta[property="og:color"]').attr('content');
    const metaColors = {};
    if (metaTheme) metaColors.themeColor = metaTheme;
    if (metaMsTile) metaColors.msTileColor = metaMsTile;
    if (metaOgColor) metaColors.ogColor = metaOgColor;

    const extractInlineBg = (sel) => {
        const el = $(sel).first();
        if (!el.length) return null;
        const style = el.attr('style') || '';
        const m = style.match(/background(?:-color)?\s*:\s*([^;]+)/i);
        return m ? normaliseCssColor(m[1].trim()) : null;
    };
    const extractInlineColor = (sel) => {
        const el = $(sel).first();
        if (!el.length) return null;
        const style = el.attr('style') || '';
        const m = style.match(/(?:^|;)\s*color\s*:\s*([^;]+)/i);
        return m ? normaliseCssColor(m[1].trim()) : null;
    };
    // FIX 7: bg and text used to be pulled via two separate $(sel).first() calls with
    // slightly different selector lists (e.g. header bg checked '.site-header'/'.main-header'
    // too, but header text didn't). Since "first matching element in the DOM" can differ
    // between two different selector lists, bg and text could end up coming from two
    // unrelated elements — e.g. a white-background element supplies "bg" while some other
    // nav/header-like element supplies a white "text" color, yielding invisible white-on-white
    // text even though neither element individually had that problem. Pulling both values from
    // a single matched element guarantees they're at least internally consistent.
    const extractInlineColors = (sel) => {
        const el = $(sel).first();
        if (!el.length) return { bg: null, text: null };
        const style = el.attr('style') || '';
        const bg = style.match(/background(?:-color)?\s*:\s*([^;]+)/i);
        const fg = style.match(/(?:^|;)\s*color\s*:\s*([^;]+)/i);
        return {
            bg: bg ? normaliseCssColor(bg[1].trim()) : null,
            text: fg ? normaliseCssColor(fg[1].trim()) : null,
        };
    };

    let exactPrimary = null, exactSecondary = null;
    const primaryVarNames = ['primary', 'brand', 'theme', 'main', 'color-primary', 'brand-primary'];
    const secondaryVarNames = ['secondary', 'accent', 'color-secondary', 'brand-secondary'];
    for (const [varName, colorValue] of Object.entries(cssVariables)) {
        const lower = varName.toLowerCase();
        if (!exactPrimary && primaryVarNames.some(p => lower.includes(p))) exactPrimary = normaliseCssColor(colorValue);
        if (!exactSecondary && secondaryVarNames.some(p => lower.includes(p))) exactSecondary = normaliseCssColor(colorValue);
    }

    $('[style]').each((_, el) => {
        const style = $(el).attr('style') || '';
        const bg = style.match(/background(?:-color)?\s*:\s*([^;]+)/i);
        const fg = style.match(/(?:^|;)\s*color\s*:\s*([^;]+)/i);
        if (bg) allBgs.push(bg[1].trim());
        if (fg) allTexts.push(fg[1].trim());
    });

    $('[data-color], [data-bg-color], [data-background-color]').each((_, el) => {
        const c = $(el).attr('data-color') || $(el).attr('data-bg-color') || $(el).attr('data-background-color');
        if (c) allBgs.push(c);
    });

    const buttonColors = extractInlineColors('.btn-primary, .button-primary, .cta-btn, .wp-block-button__link, .btn, button');
    const headerColors = extractInlineColors('header, .header, .site-header, .main-header, nav, .navbar');
    const footerColors = extractInlineColors('footer, .footer, .site-footer');

    const themeColors = {
        button: { bg: buttonColors.bg, text: buttonColors.text },
        header: { bg: headerColors.bg, text: headerColors.text },
        footer: { bg: footerColors.bg, text: footerColors.text },
        hero: { bg: extractInlineBg('.hero, .banner, .hero-section, .hero-banner') },
        page: { bg: extractInlineBg('body') },
        exact: { cssVariables, meta: metaColors, elements: {} },
    };

    let bodyFontFamily = null, headingFontFamily = null, bodyFontSize = null;

    for (const [varName, val] of Object.entries(cssVariables)) {
        const lower = varName.toLowerCase();
        if (!bodyFontFamily && (lower.includes('font-body') || lower.includes('body-font') || lower === 'font-family')) {
            bodyFontFamily = val.split(',')[0].trim().replace(/['"]/g, '');
        }
        if (!headingFontFamily && (lower.includes('font-heading') || lower.includes('heading-font'))) {
            headingFontFamily = val.split(',')[0].trim().replace(/['"]/g, '');
        }
    }

    const bodyStyle = $('body').attr('style') || '';
    const bodyFontMatch = bodyStyle.match(/font-family\s*:\s*([^;]+)/i);
    if (!bodyFontFamily && bodyFontMatch) bodyFontFamily = bodyFontMatch[1].split(',')[0].trim().replace(/['"]/g, '');

    $('style').each((_, el) => {
        const css = $(el).html() || '';
        const bodyRule = css.match(/body\s*\{([^}]+)\}/i);
        if (bodyRule) {
            const ffm = bodyRule[1].match(/font-family\s*:\s*([^;]+)/i);
            if (!bodyFontFamily && ffm) bodyFontFamily = ffm[1].split(',')[0].trim().replace(/['"]/g, '');
            const fsm = bodyRule[1].match(/font-size\s*:\s*([^;]+)/i);
            if (!bodyFontSize && fsm) bodyFontSize = fsm[1].trim();
        }
    });

    const googleFontLinks = $('link[href*="fonts.googleapis.com"]').map((_, el) => $(el).attr('href')).get();
    $('style').each((_, el) => {
        const css = $(el).html() || '';
        const importRe = /@import\s+url\(['"]?(https?:\/\/fonts\.googleapis\.com[^'")\s]+)['"]?\)/gi;
        let im;
        while ((im = importRe.exec(css)) !== null) googleFontLinks.push(im[1]);
    });
    const googleFontFamilies = [...new Set(googleFontLinks.flatMap(href => {
        try {
            const fp = new URL(href).searchParams.get('family');
            return fp ? fp.split('|').map(f => f.split(':')[0].replace(/\+/g, ' ').trim()) : [];
        } catch { return []; }
    }))];

    if (!bodyFontFamily && googleFontFamilies.length) bodyFontFamily = googleFontFamilies[0];

    const isUnwantedUrl = (absUrl) => {
        try {
            const { pathname } = new URL(absUrl);
            return /icon|sprite|tracking|pixel|beacon|analytics|1x1|spacer|dot\.gif|clear\.gif|favicon|loading|spinner|arrow|bullet|check[^o]|close|hamburger/i.test(pathname);
        } catch { return false; }
    };

    const images = [];
    const seenImgUrls = new Set();

    $('img').each((_, el) => {
        const src = getRealSrc($(el));
        const url = toAbs(src);
        if (!url || seenImgUrls.has(url)) return;
        if (isUnwantedUrl(url)) return;
        const w = parseInt($(el).attr('width') || '0', 10);
        const h = parseInt($(el).attr('height') || '0', 10);
        if ((w > 0 && w < 50) || (h > 0 && h < 50)) return;
        const alt = cleanStr($(el).attr('alt') || '');
        images.push({ url, alt, width: w || null, height: h || null, section: getSectionForEl($(el)) });
        seenImgUrls.add(url);
    });

    $('svg').each((idx, el) => {
        const $el = $(el);
        const w = parseInt($el.attr('width') || '0', 10);
        const h = parseInt($el.attr('height') || '0', 10);
        if ((w > 0 && w < 24) || (h > 0 && h < 24)) return;
        const hasVisibleContent = $el.find('path, rect, circle, ellipse, polygon, use, image').length > 0;
        if (!hasVisibleContent) return;
        const syntheticUrl = `inline-svg:${idx}`;
        if (seenImgUrls.has(syntheticUrl)) return;
        const alt = cleanStr($el.attr('aria-label') || $el.attr('title') || '');
        const markup = $.html($el);
        images.push({ url: syntheticUrl, alt, width: w || null, height: h || null, section: getSectionForEl($el), markup });
        seenImgUrls.add(syntheticUrl);
    });

    $('[style*="background"]').each((_, el) => {
        const style = $(el).attr('style') || '';
        const m = style.match(/url\(['"]?([^'")\s]+)['"]?\)/);
        if (!m) return;
        const url = toAbs(m[1]);
        if (!url || seenImgUrls.has(url) || url.startsWith('data:')) return;
        if (isUnwantedUrl(url)) return;
        images.push({ url, alt: 'background', width: null, height: null, section: getSectionForEl($(el)) });
        seenImgUrls.add(url);
    });

    // Extract images from <picture><source> elements (common WebP delivery pattern)
    $('picture').each((_, el) => {
        const $pic = $(el);
        // Prefer the highest-quality source (WebP > others), fall back to inner <img>
        const sources = $pic.find('source').toArray();
        let bestUrl = null;
        // First pass: pick WebP source with srcset
        for (const src of sources) {
            const type = ($(src).attr('type') || '').toLowerCase();
            const srcset = $(src).attr('srcset') || '';
            if (type.includes('webp') && srcset) {
                const candidates = srcset.split(',').map(s => {
                    const parts = s.trim().split(/\s+/);
                    const width = parseInt(parts[1]) || 0;
                    return { url: parts[0], width };
                }).filter(c => c.url);
                if (candidates.length > 0) {
                    candidates.sort((a, b) => b.width - a.width);
                    bestUrl = toAbs(candidates[0].url);
                }
                break;
            }
        }
        // Second pass: any source with srcset
        if (!bestUrl) {
            for (const src of sources) {
                const srcset = $(src).attr('srcset') || '';
                if (srcset) {
                    const candidates = srcset.split(',').map(s => {
                        const parts = s.trim().split(/\s+/);
                        const width = parseInt(parts[1]) || 0;
                        return { url: parts[0], width };
                    }).filter(c => c.url);
                    if (candidates.length > 0) {
                        candidates.sort((a, b) => b.width - a.width);
                        bestUrl = toAbs(candidates[0].url);
                        break;
                    }
                }
            }
        }
        // Fallback to inner <img> (already captured above, but covers edge cases)
        if (!bestUrl) {
            const innerImg = $pic.find('img').first();
            if (innerImg.length) {
                bestUrl = toAbs(getRealSrc(innerImg));
            }
        }
        if (!bestUrl || seenImgUrls.has(bestUrl)) return;
        if (isUnwantedUrl(bestUrl)) return;
        const innerImg = $pic.find('img').first();
        const alt = cleanStr(innerImg.attr('alt') || '');
        const w = parseInt(innerImg.attr('width') || '0', 10);
        const h = parseInt(innerImg.attr('height') || '0', 10);
        if ((w > 0 && w < 50) || (h > 0 && h < 50)) return;
        images.push({ url: bestUrl, alt, width: w || null, height: h || null, section: getSectionForEl($pic) });
        seenImgUrls.add(bestUrl);
    });

    const videos = [];
    const seenVideoKeys = new Set();
    const addVideo = (v) => {
        if (!v || !v.url) return;
        const key = v.videoId ? `${v.platform}:${v.videoId}` : v.url;
        if (seenVideoKeys.has(key)) return;
        seenVideoKeys.add(key);
        videos.push(v);
    };
    $('video').each((_, el) => {
        const src = toAbs($(el).attr('src'));
        const poster = toAbs($(el).attr('poster'));
        if (src) addVideo({ url: src, platform: 'html5', videoId: null, poster: poster || null, section: getSectionForEl($(el)) });
    });
    $('iframe').each((_, el) => {
        const src = $(el).attr('src') || '';
        if (!src) return;
        if (src.includes('youtube.com') || src.includes('youtu.be')) {
            const m = src.match(/(?:youtube\.com\/embed\/|youtu\.be\/)([^/?&]+)/);
            addVideo({ url: toAbs(src) || src, platform: 'youtube', videoId: m?.[1] || null, poster: null, section: getSectionForEl($(el)) });
        } else if (src.includes('vimeo.com')) {
            const m = src.match(/vimeo\.com\/(\d+)/);
            addVideo({ url: toAbs(src) || src, platform: 'vimeo', videoId: m?.[1] || null, poster: null, section: getSectionForEl($(el)) });
        }
    });

    let heroHeading = '', heroSubheading = '';
    const heroSels = ['.hero h1', '.banner h1', '[class*="hero"] h1', 'header h1', 'main h1', 'h1'];
    for (const sel of heroSels) {
        const t = cleanStr($(sel).first().text());
        if (!heroHeading && t.length > 5) { heroHeading = t; break; }
    }
    const h2Sels = ['.hero h2', '.banner h2', '[class*="hero"] h2', 'header h2', 'main h2', 'h2'];
    for (const sel of h2Sels) {
        const t = cleanStr($(sel).first().text());
        if (!heroSubheading && t.length > 5) { heroSubheading = t; break; }
    }

    const services = [];
    $('[class*="service" i], [class*="Service"]').each((_, el) => {
        const h = cleanStr($(el).find('h1,h2,h3,h4,h5').first().text());
        const d = cleanStr($(el).find('p').first().text());
        if (h && !services.find(s => s.title === h)) services.push({ title: h, description: d || '' });
        if (services.length >= 15) return false;
    });
    if (services.length === 0) {
        $('section, .section, [id*="service" i], [id*="what-we-do" i]').each((_, sec) => {
            $(sec).find('h3, h4').each((__, heading) => {
                const h = cleanStr($(heading).text());
                const d = cleanStr($(heading).next('p').text() || $(heading).parent().find('p').first().text());
                if (h && h.length > 3 && !services.find(s => s.title === h)) {
                    services.push({ title: h, description: d || '' });
                }
                if (services.length >= 12) return false;
            });
            if (services.length >= 12) return false;
        });
    }

    const features = [];
    $('[class*="feature" i], [class*="Feature"]').each((_, el) => {
        const h = cleanStr($(el).find('h1,h2,h3,h4,h5').first().text());
        const d = cleanStr($(el).find('p').first().text());
        if (h && !features.find(f => f.title === h)) features.push({ title: h, description: d || '' });
        if (features.length >= 15) return false;
    });
    if (features.length === 0) {
        $('section, .section, [id*="feature" i], [id*="benefit" i]').each((_, sec) => {
            $(sec).find('h3, h4').each((__, heading) => {
                const h = cleanStr($(heading).text());
                const d = cleanStr($(heading).next('p').text() || $(heading).parent().find('p').first().text());
                if (h && h.length > 3 && !features.find(f => f.title === h)) {
                    features.push({ title: h, description: d || '' });
                }
                if (features.length >= 12) return false;
            });
            if (features.length >= 12) return false;
        });
    }

    const testimonials = [];
    $('[class*="testimonial" i], [class*="review" i], [class*="feedback" i], [itemtype*="Review"], [itemtype*="Testimonial"]').each((_, el) => {
        const text = cleanStr($(el).find('[itemprop="reviewBody"], [itemprop="description"], p, blockquote, [class*="text" i], [class*="content" i]').first().text());
        const author = cleanStr($(el).find('[itemprop="author"], [itemprop="name"], [class*="author" i], [class*="name" i], [class*="person" i], cite, strong').first().text());
        const company = cleanStr($(el).find('[itemprop="worksFor"], [class*="company" i], [class*="org" i], [class*="designation" i], [class*="role" i]').first().text());
        const ratingEl = $(el).find('[aria-label*="star" i], [data-rating], [class*="star" i], [class*="rating" i]').first();
        const ratingRaw = ratingEl.attr('data-rating') || ratingEl.attr('aria-label') || '';
        const ratingMatch = ratingRaw.match(/(\d+(\.\d+)?)/);
        const rating = ratingMatch ? parseFloat(ratingMatch[1]) : null;
        if (text && text.length > 20 && !testimonials.find(t => t.text === text)) {
            testimonials.push({ text, name: author || '', company: company || '', rating });
        }
        if (testimonials.length >= 10) return false;
    });

    const ctaTexts = [];
    $('button, a[href], [class*="cta" i], [class*="btn" i]').each((_, el) => {
        const txt = cleanStr($(el).text());
        const cls = ($(el).attr('class') || '').toLowerCase();
        if (txt.length > 2 && txt.length < 60 && (cls.includes('cta') || cls.includes('btn') || cls.includes('button'))) {
            if (!ctaTexts.includes(txt)) ctaTexts.push(txt);
        }
        if (ctaTexts.length >= 10) return false;
    });
    if (ctaTexts.length === 0) {
        const heroSel = '.hero, .banner, [class*="hero"], [id*="hero"], header';
        $(heroSel).find('a[href], button').each((_, el) => {
            const txt = cleanStr($(el).text());
            if (txt.length > 2 && txt.length < 60 && !ctaTexts.includes(txt)) {
                ctaTexts.push(txt);
            }
            if (ctaTexts.length >= 6) return false;
        });
    }

    const taglines = [];
    $('[class*="tagline" i], [class*="headline" i], [class*="slogan" i], [class*="subheading" i]').each((_, el) => {
        const txt = cleanStr($(el).text());
        if (txt.length > 5 && txt.length < 150 && !taglines.includes(txt)) taglines.push(txt);
        if (taglines.length >= 8) return false;
    });

    const sectionHeadings = [];
    $('h2, h3').each((_, el) => {
        const txt = cleanStr($(el).text());
        if (txt.length > 5 && txt.length < 150 && !sectionHeadings.includes(txt)) sectionHeadings.push(txt);
        if (sectionHeadings.length >= 25) return false;
    });

    const forms = [];
    const seenFormSignatures = new Set();
    $('form').each((_, formEl) => {
        const fields = [];
        $(formEl).find('input, select, textarea').each((__, fieldEl) => {
            const type = $(fieldEl).attr('type') || fieldEl.tagName.toLowerCase();
            if (['hidden', 'submit', 'button', 'reset', 'image'].includes(type)) return;
            const name = $(fieldEl).attr('name') || $(fieldEl).attr('id') || '';
            const ph = $(fieldEl).attr('placeholder') || '';
            const id = $(fieldEl).attr('id');
            let label = '';
            if (id) label = cleanStr($(`label[for="${id}"]`).first().text());
            if (!label) {
                const parentLabel = $(fieldEl).closest('label');
                if (parentLabel.length) label = cleanStr(parentLabel.text());
            }
            fields.push({ name: name || `field_${fields.length}`, label: label || ph, type, placeholder: ph, required: $(fieldEl).is('[required]') });
        });
        if (fields.length > 0) {
            const action = $(formEl).attr('action') || '';
            const method = ($(formEl).attr('method') || 'POST').toUpperCase();
            // Signature catches forms that are structurally identical (same action/method/fields),
            // which happens when a site repeats the same embedded widget/modal multiple times.
            const signature = `${action}|${method}|${fields.map(f => `${f.name}:${f.type}`).join(',')}`;
            if (seenFormSignatures.has(signature)) return;
            seenFormSignatures.add(signature);
            forms.push({ action, method, fields });
        }
    });

    const seoMeta = {};
    $('meta').each((_, el) => {
        const prop = $(el).attr('property') || '';
        const name = $(el).attr('name') || '';
        const content = $(el).attr('content') || '';
        if (prop.startsWith('og:')) seoMeta['og_' + prop.slice(3)] = content;
        if (name.startsWith('twitter:')) seoMeta['tw_' + name.slice(8)] = content;
        if (name === 'description') seoMeta.description = content;
        if (name === 'keywords') seoMeta.keywords = content;
        if (name === 'robots') seoMeta.robots = content;
        if (name === 'theme-color') seoMeta.themeColor = content;
        if (prop === 'theme-color') seoMeta.themeColor = seoMeta.themeColor || content;
    });
    const canonical = $('link[rel="canonical"]').attr('href') || baseUrl;

    const foundSections = new Set();
    $('section, article, div[id], div[class], header, footer, nav, main').each((_, el) => {
        const combined = (($(el).attr('class') || '') + ' ' + ($(el).attr('id') || '')).toLowerCase();
        for (const [sec, kws] of Object.entries(SECTION_KEYWORDS)) {
            if (kws.some(k => combined.includes(k))) foundSections.add(sec);
        }
    });

    return {
        pageTitle, metaDesc, ogTitle, ogSiteName,
        logoUrl, logoFormat, favicon,
        themeColors, allBgs, allTexts, allBorders: [],
        googleFontFamilies, bodyFontFamily, headingFontFamily, bodyFontSize,
        images: images.slice(0, 40),
        videos,
        content: { heroHeading, heroSubheading, services: services.slice(0, 12), features: features.slice(0, 12), testimonials, ctaTexts: ctaTexts.slice(0, 10), taglines, sectionHeadings: sectionHeadings.slice(0, 20) },
        forms,
        seoMeta, canonical,
        detectedSections: [...foundSections],
        textCorpusSample: [pageTitle, metaDesc, heroHeading, heroSubheading, ...sectionHeadings.slice(0, 10)].join(' '),
    };
};

const enhanceThemeAndLogo = async ($, html, baseUrl, raw) => {
    try {
        const externalCssLinks = [];
        $('link[rel="stylesheet"]').each((_, el) => {
            const href = $(el).attr('href');
            const abs = toAbsUrl(href, baseUrl);
            if (abs) externalCssLinks.push(abs);
        });

        // FIX 6: Deduplicate CSS URLs before fetching — same stylesheet can be linked
        // multiple times (e.g. minified + unminified). Also switched Promise.all →
        // Promise.allSettled so one failing fetch doesn't abort the rest.
        const uniqueCssLinks = [...new Set(externalCssLinks.slice(0, 8))];
        const cssResults = await Promise.allSettled(uniqueCssLinks.map(async (href) => {
            try {
                const css = await fetchText(href, 8000);
                return css;
            } catch (e) {
                logger.warn(`[Scraper] enhanceThemeAndLogo: failed to fetch CSS ${href}: ${e.message}`);
                return null;
            }
        }));
        const externalCssTexts = cssResults
            .filter(r => r.status === 'fulfilled' && r.value)
            .map(r => r.value);

        const inlineCssTexts = [];
        $('style').each((_, el) => {
            const txt = $(el).html();
            if (txt) inlineCssTexts.push(txt);
        });

        const allCssTexts = [...inlineCssTexts, ...externalCssTexts];

        const parseCssRules = (cssText) => {
            const rules = [];
            if (!cssText) return rules;
            const css = cssText.replace(/\/\*[\s\S]*?\*\//g, '');
            let i = 0;
            const n = css.length;
            const readBlock = (start) => {
                let depth = 0, j = start;
                for (; j < n; j++) {
                    if (css[j] === '{') depth++;
                    else if (css[j] === '}') { depth--; if (depth === 0) return j; }
                }
                return n - 1;
            };
            while (i < n) {
                const openIdx = css.indexOf('{', i);
                if (openIdx === -1) break;
                const header = css.slice(i, openIdx).trim();
                const closeIdx = readBlock(openIdx);
                const body = css.slice(openIdx + 1, closeIdx);
                if (header.startsWith('@media') || header.startsWith('@supports') || header.startsWith('@layer')) {
                    parseCssRules(body).forEach(r => rules.push({ ...r, atRule: header }));
                } else if (header && !header.startsWith('@')) {
                    header.split(',').map(s => s.trim()).filter(Boolean).forEach(selector => {
                        rules.push({ selector, body, atRule: null });
                    });
                }
                i = closeIdx + 1;
            }
            return rules;
        };

        let allRules = [];
        allCssTexts.forEach(txt => { allRules = allRules.concat(parseCssRules(txt)); });

        const parseDeclarations = (body) => {
            const decls = {};
            body.split(';').forEach(decl => {
                const idx = decl.indexOf(':');
                if (idx === -1) return;
                const prop = decl.slice(0, idx).trim().toLowerCase();
                const value = decl.slice(idx + 1).trim();
                if (prop && value) decls[prop] = value;
            });
            return decls;
        };

        const newCssVariables = {};
        const cssVariablesList = [];
        allRules.forEach(rule => {
            const decls = parseDeclarations(rule.body);
            Object.entries(decls).forEach(([prop, value]) => {
                if (prop.startsWith('--')) {
                    const name = prop.replace(/^--/, '');
                    if (!(name in newCssVariables)) newCssVariables[name] = value;
                    cssVariablesList.push({ variable: prop, value, selector: rule.selector, atRule: rule.atRule || null });
                }
            });
        });

        // FIX 7: Loop-based CSS variable resolution — the old single-pass regex only
        // resolved one level of var() nesting. Chained variables like:
        //   --btn-bg: var(--color-primary)
        //   --color-primary: var(--brand)
        //   --brand: #FF6B00
        // now correctly resolve all the way to #FF6B00.
        const resolveVarRefs = (value, varMap, depth = 0) => {
            if (!value || depth > 10) return value;
            let result = value;
            let changed = true;
            let iterations = 0;
            while (changed && iterations < 10) {
                changed = false;
                const m = result.match(/var\(\s*(--[\w-]+)\s*(?:,\s*([^)]+))?\)/);
                if (!m) break;
                const [, varName, fallback] = m;
                const key = varName.replace(/^--/, '');
                const resolved = varMap[key] || (fallback ? fallback.trim() : null);
                if (resolved) {
                    result = result.replace(m[0], resolved.trim());
                    changed = true;
                }
                iterations++;
            }
            return result || null;
        };

        const HEADER_SELECTORS = [
            'header', '.site-header', '#header', '#masthead', '.main-header', '.topbar', '.header', '.navbar',
            '.elementor-location-header', '.elementor-header', '.elementor-top-section', '.ast-header-break-point', '.ast-site-header-wrap',
            '.et_header_style_left', '.et-fixed-header', '.et_menu_container', '.et_pb_menu', '.avia-menu', '.site-header-wrap', '.astra-header', '.site-branding',
        ];
        const NAV_SELECTORS = [
            'nav', '.navigation', '#site-navigation', '.navbar', '.nav', '.site-nav', '.main-nav',
            '.elementor-nav-menu--main', '.elementor-nav-menu', '.et_menu_container', '.et-menu-nav', '.ast-builder-menu', '.astra-menu', '.main-navigation', '.nav-menu',
        ];
        const NAV_LINK_SELECTORS = ['nav a', '.navbar a', '.navigation a', '.nav a', '.menu a', '.site-nav a', 'header a', '.elementor-nav-menu a', '.et-menu-nav a', '.astra-menu a'];
        const BUTTON_SELECTORS = [
            '.btn-primary', 'button.primary', '.button-primary', '.wp-block-button__link', '.btn', 'button', 'a.button', '.cta', '.call-to-action',
            '.elementor-button', '.elementor-button-link', '.et_pb_button', '.et_pb_promo_button', '.avia-button', '.astra-button', '.wp-block-button__link',
        ];

        const matchRulesForSelectors = (rules, targets) => {
            const base = {}, hover = {}, active = {};
            for (const target of targets) {
                for (const rule of rules) {
                    const sel = rule.selector;
                    const pseudoMatch = sel.match(/^(.*?):(hover|active|visited|focus)$/);
                    const core = pseudoMatch ? pseudoMatch[1].trim() : sel;
                    const pseudo = pseudoMatch ? pseudoMatch[2] : null;
                    const matches = core === target
                        || core.endsWith(' ' + target)
                        || core.endsWith('>' + target)
                        || core.split(/[\s>]+/).pop() === target
                        // Also match when the target appears anywhere in the selector
                        // (covers cases like "a.btn-primary", ".btn-primary.btn", etc.).
                        || core.includes(target);
                    if (!matches) continue;
                    const decls = parseDeclarations(rule.body);
                    if (pseudo === 'hover') Object.assign(hover, decls);
                    else if (pseudo === 'active') Object.assign(active, decls);
                    else Object.assign(base, decls);
                }
            }
            return { base, hover, active };
        };

        const resolveProp = (decls, prop) => {
            if (!decls || !decls[prop]) return null;
            const resolved = resolveVarRefs(decls[prop], newCssVariables) || decls[prop];
            return normaliseCssColor(resolved);
        };

        // Resolve chained var() references (e.g. --color-primary: var(--brand-600))
        // in the variables map itself. Without this, anything downstream that reads
        // `cssVariables`/`newCssVariables` directly (buildPalette's primary/secondary
        // detection, findCssVarColor, etc.) sees the raw unresolved "var(--brand-600)"
        // string, normaliseCssColor() can't parse it, and the real color is silently
        // dropped in favor of a wrong fallback — even though resolveVarRefs already
        // knows how to resolve it (it's used for header/nav/button computed colors).
        Object.keys(newCssVariables).forEach((k) => {
            const resolved = resolveVarRefs(newCssVariables[k], newCssVariables);
            if (resolved) newCssVariables[k] = resolved;
        });
        cssVariablesList.forEach((entry) => {
            const resolved = resolveVarRefs(entry.value, newCssVariables);
            if (resolved) entry.value = resolved;
        });

        const headerMatch = matchRulesForSelectors(allRules, HEADER_SELECTORS);
        const navMatch = matchRulesForSelectors(allRules, NAV_SELECTORS);
        const navLinkMatch = matchRulesForSelectors(allRules, NAV_LINK_SELECTORS);
        const buttonMatch = matchRulesForSelectors(allRules, BUTTON_SELECTORS);

        const headerComputed = {
            background: resolveProp(headerMatch.base, 'background-color') || resolveProp(headerMatch.base, 'background'),
            text: resolveProp(headerMatch.base, 'color'),
            border: resolveProp(headerMatch.base, 'border-color') || resolveProp(headerMatch.base, 'border-bottom-color'),
            link: resolveProp(navLinkMatch.base, 'color'),
        };
        const navComputed = {
            background: resolveProp(navMatch.base, 'background-color') || resolveProp(navMatch.base, 'background'),
            text: resolveProp(navMatch.base, 'color'),
            border: resolveProp(navMatch.base, 'border-color'),
            linkColors: {
                default: resolveProp(navLinkMatch.base, 'color'),
                hover: resolveProp(navLinkMatch.hover, 'color'),
                active: resolveProp(navLinkMatch.active, 'color'),
            },
        };
        const buttonComputed = {
            background: resolveProp(buttonMatch.base, 'background-color') || resolveProp(buttonMatch.base, 'background'),
            text: resolveProp(buttonMatch.base, 'color'),
            border: resolveProp(buttonMatch.base, 'border-color'),
            hoverBackground: resolveProp(buttonMatch.hover, 'background-color') || resolveProp(buttonMatch.hover, 'background'),
            hoverText: resolveProp(buttonMatch.hover, 'color'),
        };

        const darkSelectors = ['.dark', '.dark-mode', '[data-theme="dark"]', 'html.dark', 'body.dark'];
        const darkRules = allRules.filter(r => {
            if (r.atRule && /prefers-color-scheme:\s*dark/i.test(r.atRule)) return true;
            return darkSelectors.some(ds => r.selector === ds || r.selector.startsWith(ds + ' ') || r.selector.startsWith(ds + '.'));
        });
        const darkOverrides = { background: null, text: null, links: null, buttons: null, borders: null };
        let darkEnabled = darkRules.length > 0 || Object.keys(newCssVariables).some(k => /dark/i.test(k));
        darkRules.forEach(r => {
            const decls = parseDeclarations(r.body);
            const bg = resolveProp(decls, 'background-color') || resolveProp(decls, 'background');
            const txt = resolveProp(decls, 'color');
            const border = resolveProp(decls, 'border-color');
            if (bg && !darkOverrides.background) darkOverrides.background = bg;
            if (txt && !darkOverrides.text) darkOverrides.text = txt;
            if (border && !darkOverrides.borders) darkOverrides.borders = border;
            if (/a$|a:|link/.test(r.selector) && txt && !darkOverrides.links) darkOverrides.links = txt;
            if (/btn|button|cta/.test(r.selector) && bg && !darkOverrides.buttons) darkOverrides.buttons = bg;
        });

        const frameworks = [];
        let platform = 'Plain HTML';
        const evidence = {};

        // Basic WordPress platform detection
        if (/wp-content|wp-includes|wp-json/i.test(html) || $('meta[name="generator"][content*="WordPress" i]').length || Object.keys(newCssVariables).some(k => k.startsWith('wp--'))) {
            platform = 'WordPress';
            evidence.wordpress = true;
        }

        // Builder-specific heuristics & evidence collection
        const builders = [];

        // Elementor
        const elemEvidence = [];
        if (/elementor/i.test(html)) elemEvidence.push('html contains "elementor"');
        if ($('[class*="elementor"]').length) elemEvidence.push('DOM has elementor classes');
        if (Object.keys(newCssVariables).some(k => k.toLowerCase().startsWith('e-global-') || k.toLowerCase().includes('elementor'))) elemEvidence.push('css variables indicate elementor');
        if ($('link[href*="elementor"]').length || $('script[src*="elementor"]').length) elemEvidence.push('asset URL contains elementor');
        if (elemEvidence.length) { frameworks.push('Elementor'); evidence.elementor = elemEvidence; builders.push({ name: 'Elementor', evidence: elemEvidence, confidence: Math.min(0.95, 0.4 + Math.min(5, elemEvidence.length) * 0.15) }); }

        // Divi
        const diviEvidence = [];
        if (/et_pb_|divi/i.test(html)) diviEvidence.push('html contains et_pb/divi');
        if ($('[class*="et_pb_"]').length || $('[class*="et_builder"]').length) diviEvidence.push('DOM has et_pb_/et_builder classes');
        if (Object.keys(newCssVariables).some(k => k.toLowerCase().startsWith('et_pb_') || k.toLowerCase().includes('divi'))) diviEvidence.push('css variables indicate divi');
        if ($('link[href*="divi"]').length || $('script[src*="divi"]').length) diviEvidence.push('asset URL contains divi');
        if (diviEvidence.length) { frameworks.push('Divi'); evidence.divi = diviEvidence; builders.push({ name: 'Divi', evidence: diviEvidence, confidence: Math.min(0.95, 0.35 + Math.min(5, diviEvidence.length) * 0.13) }); }

        // Gutenberg (WordPress block editor)
        const gutenbergEvidence = [];
        if (/wp-block-/i.test(html)) gutenbergEvidence.push('html contains wp-block classes');
        if (Object.keys(newCssVariables).some(k => k.toLowerCase().startsWith('wp--preset') || k.toLowerCase().includes('wp--preset'))) gutenbergEvidence.push('css variables indicate wp presets');
        if ($('[class*="wp-block-"]').length) gutenbergEvidence.push('DOM has wp-block classes');
        if (gutenbergEvidence.length) { frameworks.push('Gutenberg'); evidence.gutenberg = gutenbergEvidence; builders.push({ name: 'Gutenberg', evidence: gutenbergEvidence, confidence: Math.min(0.9, 0.3 + Math.min(5, gutenbergEvidence.length) * 0.12) }); }

        // Beaver Builder (FL Builder)
        const beaverEvidence = [];
        if (/fl-builder|beaver|fl-node|fl-module-/i.test(html)) beaverEvidence.push('html contains fl-builder/beaver markers');
        if ($('[class*="fl-"]').length || $('[class*="fl-module"]').length || $('[class*="fl-row"]').length) beaverEvidence.push('DOM has fl- classes');
        if ($('link[href*="beaver"]').length || $('script[src*="beaver"]').length || $('link[href*="fl-builder"]').length) beaverEvidence.push('asset URL contains beaver/fl-builder');
        if (beaverEvidence.length) { frameworks.push('Beaver Builder'); evidence.beaver = beaverEvidence; builders.push({ name: 'Beaver Builder', evidence: beaverEvidence, confidence: Math.min(0.9, 0.3 + Math.min(5, beaverEvidence.length) * 0.12) }); }

        // Non-WordPress site builders — additive detection only. This does NOT
        // change how colors/logo/header/etc. are scraped (those already use
        // generic rendered-DOM selectors and work on any platform); it only
        // improves the `platform`/`frameworks` metadata reported back.
        const wixEvidence = [];
        if (/wixstatic\.com|wix\.com/i.test(html)) wixEvidence.push('asset URL/domain references wix');
        if ($('meta[name="generator"][content*="Wix" i]').length) wixEvidence.push('meta generator = Wix');
        if ($('[class*="wixui-"]').length || $('[data-testid*="wix" i]').length) wixEvidence.push('DOM has wixui-/data-testid wix markers');
        if (wixEvidence.length) { platform = 'Wix'; frameworks.push('Wix'); evidence.wix = wixEvidence; builders.push({ name: 'Wix', evidence: wixEvidence, confidence: Math.min(0.95, 0.4 + Math.min(5, wixEvidence.length) * 0.15) }); }

        const squarespaceEvidence = [];
        if (/squarespace\.com|static1\.squarespace\.com/i.test(html)) squarespaceEvidence.push('asset URL/domain references squarespace');
        if ($('meta[name="generator"][content*="Squarespace" i]').length) squarespaceEvidence.push('meta generator = Squarespace');
        if ($('[class*="sqs-"]').length) squarespaceEvidence.push('DOM has sqs- classes');
        if (squarespaceEvidence.length) { platform = 'Squarespace'; frameworks.push('Squarespace'); evidence.squarespace = squarespaceEvidence; builders.push({ name: 'Squarespace', evidence: squarespaceEvidence, confidence: Math.min(0.95, 0.4 + Math.min(5, squarespaceEvidence.length) * 0.15) }); }

        const webflowEvidence = [];
        if ($('html[data-wf-site], html[data-wf-page]').length) webflowEvidence.push('html tag has data-wf-site/data-wf-page');
        if (/website-files\.com|webflow\.com/i.test(html)) webflowEvidence.push('asset URL/domain references webflow');
        if (webflowEvidence.length) { platform = 'Webflow'; frameworks.push('Webflow'); evidence.webflow = webflowEvidence; builders.push({ name: 'Webflow', evidence: webflowEvidence, confidence: Math.min(0.95, 0.4 + Math.min(5, webflowEvidence.length) * 0.15) }); }

        const shopifyEvidence = [];
        if (/cdn\.shopify\.com|myshopify\.com/i.test(html)) shopifyEvidence.push('asset URL/domain references shopify');
        if (/Shopify\.theme|window\.Shopify/i.test(html)) shopifyEvidence.push('inline script references Shopify object');
        if (shopifyEvidence.length) { platform = 'Shopify'; frameworks.push('Shopify'); evidence.shopify = shopifyEvidence; builders.push({ name: 'Shopify', evidence: shopifyEvidence, confidence: Math.min(0.95, 0.4 + Math.min(5, shopifyEvidence.length) * 0.15) }); }

        const dudaEvidence = [];
        if (/irp\.cdn-website\.com|duda\.co|dudamobile/i.test(html)) dudaEvidence.push('asset URL/domain references duda');
        if ($('[class*="dmBody"], [class*="dm-"]').length) dudaEvidence.push('DOM has dmBody/dm- classes');
        if (dudaEvidence.length) { platform = 'Duda'; frameworks.push('Duda'); evidence.duda = dudaEvidence; builders.push({ name: 'Duda', evidence: dudaEvidence, confidence: Math.min(0.95, 0.4 + Math.min(5, dudaEvidence.length) * 0.15) }); }

        if (/bootstrap/i.test(html) || $('.navbar, .container, .row, .col-md-6, .btn-primary').length || Object.keys(newCssVariables).some(k => k.startsWith('bs-'))) {
            frameworks.push('Bootstrap'); evidence.bootstrap = true;
        }
        if ($('.grid-x, .cell, .top-bar').length) {
            frameworks.push('Foundation'); evidence.foundation = true;
        }
        const tailwindClassRe = /\b(?:flex|grid|text-(?:xs|sm|lg|xl|\d)|bg-(?:gray|blue|red|green|primary)-\d{2,3}|p[xytblr]?-\d|m[xytblr]?-\d|rounded-(?:md|lg|xl|full)|justify-center|items-center)\b/;
        let tailwindFound = false;
        $('[class]').each((i, el) => {
            if (tailwindFound) return false;
            if (tailwindClassRe.test($(el).attr('class') || '')) tailwindFound = true;
        });
        if (tailwindFound) { frameworks.push('Tailwind'); evidence.tailwind = true; }
        if (/_next\/static/i.test(html) || $('#__next').length) { frameworks.push('Next.js'); evidence.nextjs = true; }
        else if ($('[data-reactroot]').length) { frameworks.push('React'); evidence.react = true; }

        raw.themeColors = raw.themeColors || {};
        raw.themeColors.exact = raw.themeColors.exact || { cssVariables: {}, meta: {}, elements: {} };

        // Merge CSS variables into exact map and store each variable under
        // both forms (with and without leading `--`) so downstream lookups
        // (which may search for either form) reliably find values.
        const existingCssVars = raw.themeColors.exact.cssVariables || {};
        const mergedCssVars = { ...existingCssVars };
        Object.entries(newCssVariables).forEach(([k, v]) => {
            if (!(k in mergedCssVars)) mergedCssVars[k] = v;
            const withDash = '--' + k;
            if (!(withDash in mergedCssVars)) mergedCssVars[withDash] = v;
        });
        raw.themeColors.exact.cssVariables = mergedCssVars;
        raw.themeColors.exact.cssVariablesList = cssVariablesList;

        // Better section-wise selection with debug reasons
        raw.themeColors.header = raw.themeColors.header || {};
        raw.themeColors.navigation = raw.themeColors.navigation || {};
        raw.themeColors.button = raw.themeColors.button || {};

        const chooseSection = (name, opts) => {
            // opts: {inlineFn, cssValue, imageValue, paletteFallback}
            const candidates = [];
            let source = null;
            // 1) inline styles from DOM
            try {
                if (opts.inlineFn) {
                    const v = opts.inlineFn();
                    if (v) { candidates.push({ v, source: 'inline' }); }
                }
            } catch (_) { }
            // 2) CSS rules (computed)
            if (opts.cssValue) candidates.push({ v: opts.cssValue, source: 'css' });
            // 3) image/rendered sample
            if (opts.imageValue) candidates.push({ v: opts.imageValue, source: 'image' });
            // 4) palette or logo
            if (opts.paletteFallback) candidates.push({ v: opts.paletteFallback, source: 'palette' });

            // pick first non-neutral normalized color
            for (const c of candidates) {
                const norm = normaliseCssColor(c.v);
                if (!norm) continue;
                if (!isNeutralHex(norm)) { source = c.source; return { value: norm, source }; }
            }
            // fallback: none
            return { value: null, source: 'none' };
        };

        // inline extractors using cheerio
        const inlineHeaderBg = () => {
            for (const sel of HEADER_SELECTORS) {
                const val = extractInlineBg(sel);
                if (val) return val;
            }
            return null;
        };
        const inlineNavBg = () => {
            for (const sel of NAV_SELECTORS) {
                const val = extractInlineBg(sel);
                if (val) return val;
            }
            return null;
        };
        const inlineButtonFromDom = () => {
            // scan multiple button selectors and pick most frequent inline bg
            const freq = {};
            for (const sel of BUTTON_SELECTORS) {
                $(sel).each((i, el) => {
                    const style = ($(el).attr('style') || '').match(/background(?:-color)?:\s*([^;]+)/i);
                    if (style && style[1]) {
                        const n = normaliseCssColor(style[1].trim());
                        if (n) freq[n] = (freq[n] || 0) + 1;
                    }
                });
            }
            const entries = Object.entries(freq).sort((a, b) => b[1] - a[1]);
            return entries.length ? entries[0][0] : null;
        };

        const paletteFallback = (raw.logoColors && raw.logoColors.palette && raw.logoColors.palette[0]) || (raw.colors && raw.colors[0]) || (raw.allBgs && raw.allBgs[0]) || null;

        const headerPick = chooseSection('header', { inlineFn: inlineHeaderBg, cssValue: headerComputed.background, imageValue: null, paletteFallback });
        if (!raw.themeColors.header.bg && headerPick.value) raw.themeColors.header.bg = headerPick.value;
        if (!raw.themeColors.header.text && headerComputed.text) raw.themeColors.header.text = headerComputed.text;
        if (!raw.themeColors.header.border && headerComputed.border) raw.themeColors.header.border = headerComputed.border;
        if (!raw.themeColors.header.link && headerComputed.link) raw.themeColors.header.link = headerComputed.link;

        const navPick = chooseSection('navigation', { inlineFn: inlineNavBg, cssValue: navComputed.background, imageValue: null, paletteFallback });
        if (!raw.themeColors.navigation.background && navPick.value) raw.themeColors.navigation.background = navPick.value;
        if (!raw.themeColors.navigation.color && navComputed.text) raw.themeColors.navigation.color = navComputed.text;
        if (!raw.themeColors.navigation.border && navComputed.border) raw.themeColors.navigation.border = navComputed.border;
        raw.themeColors.navigation.linkColors = {
            default: raw.themeColors.navigation.linkColors?.default || navComputed.linkColors.default || null,
            hover: raw.themeColors.navigation.linkColors?.hover || navComputed.linkColors.hover || null,
            active: raw.themeColors.navigation.linkColors?.active || navComputed.linkColors.active || null,
        };

        const btnPick = chooseSection('button', { inlineFn: inlineButtonFromDom, cssValue: buttonComputed.background, imageValue: null, paletteFallback });
        if (!raw.themeColors.button.bg && btnPick.value) raw.themeColors.button.bg = btnPick.value;
        if (!raw.themeColors.button.text && buttonComputed.text) raw.themeColors.button.text = buttonComputed.text;
        raw.themeColors.button.border = raw.themeColors.button.border || buttonComputed.border || null;
        raw.themeColors.button.hoverBackground = raw.themeColors.button.hoverBackground || buttonComputed.hoverBackground || null;
        raw.themeColors.button.hoverText = raw.themeColors.button.hoverText || buttonComputed.hoverText || null;

        // attach per-section reasons into debug payload
        try {
            raw._debugTheme = raw._debugTheme || {};
            raw._debugTheme.sections = raw._debugTheme.sections || {};
            raw._debugTheme.sections.header = { value: raw.themeColors.header.bg || null, source: headerPick.source || null };
            raw._debugTheme.sections.navigation = { value: raw.themeColors.navigation.background || null, source: navPick.source || null };
            raw._debugTheme.sections.button = { value: raw.themeColors.button.bg || null, source: btnPick.source || null };
        } catch (e) { /* ignore */ }

        raw.darkMode = { enabled: darkEnabled, overrides: darkOverrides };

        raw.frameworkInfo = { platform, frameworks, evidence };

        if (!raw.logoUrl) {
            const logoEl = $([
                '.custom-logo img', 'a.custom-logo-link img', 'img.custom-logo', '.elementor-widget-theme-site-logo img', '.et_pb_menu_logo img', '.elementor-nav-menu__logo img',
                '.site-header img', 'header img.logo', 'img.logo', 'img[alt*="logo" i]', 'img[id*="logo" i]',
                'header img', 'nav img', '.navbar img', '.brand img', 'a[href="/"] img', '#masthead img',
            ].join(', ')).first();
            if (logoEl && logoEl.length) {
                const src = logoEl.attr('data-src') || logoEl.attr('data-lazy-src') || logoEl.attr('src');
                const abs = toAbsUrl(src, baseUrl);
                if (abs) {
                    raw.logoUrl = abs;
                    raw.logoFormat = abs.toLowerCase().includes('.svg') ? 'svg-url' : 'raster-url';
                }
            }
            if (!raw.logoUrl) {
                const svgEl = $('header svg, nav svg, .navbar svg, .site-header svg, .brand svg').first();
                if (svgEl && svgEl.length) {
                    raw.logoUrl = 'data:image/svg+xml,' + encodeURIComponent($.html(svgEl));
                    raw.logoFormat = 'svg-inline-dom';
                }
            }
        }

        // Attach debugging info to help diagnose theme/color detection issues.
        try {
            raw._debugTheme = {
                cssVariableKeys: Object.keys(mergedCssVars).slice(0, 200),
                cssVariablesSample: Object.fromEntries(Object.entries(mergedCssVars).slice(0, 20)),
                cssVariablesList: cssVariablesList.slice(0, 50),
                headerComputed,
                navComputed,
                buttonComputed,
                darkEnabled,
                darkOverrides,
                allBgs: allBgs.slice(0, 200),
                allTexts: allTexts.slice(0, 200),
                frameworks,
                platform,
            };
        } catch (xx) {
            // ignore debug attach errors
        }
        return raw;
    } catch (e) {
        logger.warn(`[Scraper] enhanceThemeAndLogo failed (non-fatal): ${e.message}`);
        return raw; // never break the pipeline
    }
};

const buildPalette = (raw) => {
    const { themeColors, allBgs, allTexts, allBorders, renderColors } = raw;
    const exactColors = themeColors?.exact || {};
    const cssVars = exactColors.cssVariables || {};
    const exactElements = exactColors.elements || {};
    const metaCols = exactColors.meta || {};

    let exactPrimary = null, exactSecondary = null;
    const primaryVarNames = [
        'primary', 'brand', 'theme', 'main', 'color-primary', 'brand-primary', '--primary', '--brand', '--theme-color',
        '--e-global-color-primary', '--e-global-color-secondary', '--e-global-color-text', '--e-global-color-accent',
        '--et_pb_accent_color', '--et_pb_text_color', '--wp--preset--color--primary', '--wp--preset--color--base',
    ];
    const secondaryVarNames = [
        'secondary', 'accent', 'color-secondary', 'brand-secondary', '--secondary', '--accent',
        '--e-global-color-secondary', '--e-global-color-accent', '--et_pb_accent_color', '--wp--preset--color--secondary',
    ];

    for (const [varName, colorValue] of Object.entries(cssVars)) {
        const lowerName = varName.toLowerCase();
        const normalized = normaliseCssColor(colorValue);
        if (!exactPrimary && primaryVarNames.some(p => lowerName.includes(p))) exactPrimary = normalized;
        if (!exactSecondary && secondaryVarNames.some(p => lowerName.includes(p))) exactSecondary = normalized;
    }

    for (const [elementKey, elementValue] of Object.entries(exactElements)) {
        const lowerKey = elementKey.toLowerCase();
        const normalized = normaliseCssColor(elementValue);
        if (!normalized) continue;
        if (!exactPrimary && primaryVarNames.some(p => lowerKey.includes(p))) exactPrimary = normalized;
        if (!exactSecondary && secondaryVarNames.some(p => lowerKey.includes(p))) exactSecondary = normalized;
    }

    const metaPrimary = normaliseCssColor(metaCols.themeColor);
    const metaSecondary = normaliseCssColor(metaCols.msTileColor);

    // Screenshot-majority fallback: only used when the site doesn't declare
    // primary/secondary via CSS variables, named elements, or meta theme-color.
    // renderColors comes from captureRenderedColors, which renders the page,
    // takes a full screenshot, and (via pickMajoritySwatch) picks colors by
    // actual pixel population — i.e. "read the screenshot, take the color
    // that covers the most area" — for the button, header, nav, and footer
    // regions, plus a population-sorted full-page palette as a last resort.
    const screenshotCandidates = [
        renderColors?.button,
        renderColors?.header,
        renderColors?.navigation,
        renderColors?.footer,
        ...(Array.isArray(renderColors?.palette) ? renderColors.palette : []),
    ]
        .map(normaliseCssColor)
        .filter(Boolean)
        .filter(c => !isNeutralHex(c));
    const screenshotPrimary = screenshotCandidates[0] || null;
    const screenshotSecondary = screenshotCandidates.find(c => c !== screenshotPrimary) || null;

    // Sanity check: a CSS variable named "primary"/"brand"/"theme" is often a
    // reliable signal, but on some sites those variable names are reused for
    // small/unrelated elements and don't match what's actually visible on the
    // page. If we have a screenshot to compare against and the CSS-derived
    // color doesn't visually appear anywhere near the top of the rendered
    // page (within a small color-distance tolerance), trust the screenshot's
    // real majority color instead — it's what a human looking at the site
    // would actually call the brand color.
    const hexToRgb = (hex) => {
        if (!hex || hex[0] !== '#' || hex.length !== 7) return null;
        return [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)];
    };
    const colorDistance = (hexA, hexB) => {
        const a = hexToRgb(hexA), b = hexToRgb(hexB);
        if (!a || !b) return Infinity;
        return Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2);
    };
    const appearsInScreenshot = (hex) => screenshotCandidates.some(c => colorDistance(hex, c) < 40);

    let effectiveExactPrimary = exactPrimary;
    if (exactPrimary && screenshotCandidates.length && !appearsInScreenshot(exactPrimary)) {
        logger.warn(`[Scraper] CSS-derived primary ${exactPrimary} not visually present in screenshot — using screenshot majority color instead`);
        effectiveExactPrimary = null;
    }
    let effectiveExactSecondary = exactSecondary;
    if (exactSecondary && screenshotCandidates.length && !appearsInScreenshot(exactSecondary)) {
        effectiveExactSecondary = null;
    }

    const candidates = [
        effectiveExactPrimary || metaPrimary,
        themeColors?.button?.bg,
        themeColors?.header?.bg,
        themeColors?.footer?.bg,
        themeColors?.hero?.bg,
        themeColors?.header?.link,
        effectiveExactSecondary || metaSecondary,
        screenshotPrimary,
        screenshotSecondary,
        ...Object.values(cssVars),
        ...Object.values(exactElements),
        ...allBgs,
        ...allTexts,
        ...(allBorders || []),
    ]
        .map(normaliseCssColor)
        .filter(Boolean)
        .filter(c => !isNeutralHex(c));

    const palette = [...new Set(candidates)].slice(0, 20);
    const primary = effectiveExactPrimary || metaPrimary || screenshotPrimary || palette[0];
    const secondary = effectiveExactSecondary || metaSecondary || screenshotSecondary || palette.find(c => c !== primary);
    const accent = palette.find(c => c !== primary && c !== secondary);

    return {
        primary, secondary, accent, palette,
        rawPrimary: exactPrimary || metaPrimary || null,
        rawSecondary: exactSecondary || metaSecondary || null,
        // Explicit per-tier values so callers can implement their own priority
        // order (e.g. "screenshot first, then logo, then declared") instead of
        // being locked into the CSS-first order baked into `primary`/`secondary`.
        screenshotPrimary, screenshotSecondary,
        declaredPrimary: effectiveExactPrimary || metaPrimary || null,
        declaredSecondary: effectiveExactSecondary || metaSecondary || null,
        exact: { cssVariables: cssVars, cssVariablesList: exactColors.cssVariablesList || [], meta: metaCols },
    };
};

const scrapeWebsiteStructure = async (websiteUrl) => {
    const startedAt = Date.now();
    logger.info(`[Scraper] Starting Playwright-rendered scrape for ${websiteUrl}`);

    let html, finalUrl, fontsFromRender;
    try {
        ({ html, finalUrl, fonts: fontsFromRender } = await fetchHtml(websiteUrl, 30000));
    } catch (err) {
        logger.warn(`[Scraper] First attempt failed (${err.message}), retrying with alternate UA…`);
        const origUA = DEFAULT_HEADERS['User-Agent'];
        DEFAULT_HEADERS['User-Agent'] = 'curl/8.4.0';
        try {
            ({ html, finalUrl, fonts: fontsFromRender } = await fetchHtml(websiteUrl, 20000));
        } finally {
            DEFAULT_HEADERS['User-Agent'] = origUA;
        }
    }

    logger.info(`[Scraper] fontsFromRender: ${JSON.stringify(fontsFromRender || {})}`);

    const $ = cheerio.load(html);
    const baseUrl = finalUrl || websiteUrl;
    const raw = extractWithCheerio($, html, baseUrl);
    // Attach Playwright-detected fonts if available
    try {
        raw.fonts = raw.fonts || {};
        if (fontsFromRender) {
            raw.fonts.computedFamilies = fontsFromRender.computedFamilies || [];
            raw.fonts.loadedFamilies = fontsFromRender.loadedFamilies || [];
            raw.fonts.googleFontLinks = fontsFromRender.googleFontLinks || [];
            // heuristic primary/body/heading mapping
            raw.fonts.bodyFont = raw.fonts.loadedFamilies[0] || raw.fonts.computedFamilies[0] || '';
            raw.fonts.headingFont = (raw.fonts.computedFamilies || []).find(f => f && f !== raw.fonts.bodyFont) || raw.fonts.bodyFont || '';
            // Extract simple google font family names from links
            try {
                raw.fonts.googleFonts = (raw.fonts.googleFontLinks || []).flatMap(l => {
                    try {
                        const url = new URL(l);
                        const q = url.searchParams.get('family') || '';
                        return q.split('&family=').map(s => s.split(':')[0].replace(/\+/g, ' '));
                    } catch (e) { return []; }
                }).filter(Boolean);
            } catch (e) { raw.fonts.googleFonts = raw.fonts.googleFonts || []; }
        }

        // Fallback: discover fonts via CSS/@font-face parsing (external CSS + inline <style>)
        try {
            const cssFound = await discoverFontsFromCss($, baseUrl);
            logger.info(`[Scraper] cssFound: ${JSON.stringify(cssFound || {})}`);
            if (cssFound) {
                raw.fonts.cssDiscovered = cssFound;
                raw.fonts.googleFonts = Array.from(new Set([...(raw.fonts.googleFonts || []), ...cssFound.families]));
                raw.fonts.loadedFamilies = Array.from(new Set([...(raw.fonts.loadedFamilies || []), ...cssFound.families]));
                // If body/heading missing, try to pick from discovered families
                if (!raw.fonts.bodyFont && raw.fonts.loadedFamilies.length) raw.fonts.bodyFont = raw.fonts.loadedFamilies[0];
                if (!raw.fonts.headingFont && raw.fonts.loadedFamilies.length) raw.fonts.headingFont = raw.fonts.loadedFamilies[1] || raw.fonts.loadedFamilies[0];
            }
        } catch (e) { logger.warn(`[Scraper] CSS font discovery failed: ${e.message}`); }
    } catch (e) { logger.warn(`[Scraper] merging fonts failed: ${e.message}`); }
    await enhanceThemeAndLogo($, html, baseUrl, raw);
    // Normalize legacy fields used later in the pipeline
    try {
        if (raw.fonts) {
            if (!raw.bodyFontFamily && raw.fonts.bodyFont) raw.bodyFontFamily = raw.fonts.bodyFont;
            if (!raw.headingFontFamily && raw.fonts.headingFont) raw.headingFontFamily = raw.fonts.headingFont;
            if (!raw.googleFontFamilies || !Array.isArray(raw.googleFontFamilies) || raw.googleFontFamilies.length === 0) raw.googleFontFamilies = raw.fonts.googleFonts || [];
            if (!raw.bodyFontSize && raw.fonts.bodyFontSize) raw.bodyFontSize = raw.fonts.bodyFontSize;
        }
    } catch (e) { /* non-fatal */ }

    // Attempt to capture a rendered screenshot and use rendered-region colors.
    // If renderer is not available (server without browsers), fall back to image-based heuristics.
    // snapshot pre-capture theme values so we can report what changed
    const preCapture = {
        header: raw.themeColors?.header?.bg || null,
        navigation: raw.themeColors?.navigation?.background || null,
        button: raw.themeColors?.button?.bg || null,
        footer: raw.themeColors?.footer?.bg || null,
    };

    let renderResult = null;
    let captureSource = null;
    try {
        renderResult = await captureRenderedColors(finalUrl || websiteUrl);
        if (renderResult) {
            raw.screenshot = renderResult.screenshot;
            raw.renderColors = renderResult.colors;
            raw.renderComputed = renderResult.colors.computedTheme || renderResult.computed;
            // merge rendered computed CSS values into exact theme metadata
            raw.themeColors = raw.themeColors || {};
            raw.themeColors.exact = raw.themeColors.exact || { cssVariables: {}, meta: {}, elements: {} };
            if (renderResult.computed?.cssVariables) {
                raw.themeColors.exact.cssVariables = { ...raw.themeColors.exact.cssVariables, ...renderResult.computed.cssVariables };
            }
            if (renderResult.computed?.elementComputed) {
                raw.themeColors.exact.elements = { ...raw.themeColors.exact.elements, ...renderResult.computed.elementComputed };
            }
            // use rendered region colors and computed DOM colors as fallbacks for themeColors where missing
            raw.themeColors.header = raw.themeColors.header || {};
            raw.themeColors.navigation = raw.themeColors.navigation || {};
            raw.themeColors.button = raw.themeColors.button || {};
            const computedHeaderBg = renderResult.computed?.elementComputed?.header?.background;
            const computedHeaderColor = renderResult.computed?.elementComputed?.header?.color;
            const computedNavBg = renderResult.computed?.elementComputed?.navigation?.background;
            const computedNavColor = renderResult.computed?.elementComputed?.navigation?.color;
            const computedButtonBg = renderResult.computed?.elementComputed?.button?.background;
            const computedButtonColor = renderResult.computed?.elementComputed?.button?.color;
            const computedFooterBg = renderResult.computed?.elementComputed?.footer?.background;
            const computedPageBg = renderResult.computed?.bodyBackground;

            if (!raw.themeColors.header.bg && computedHeaderBg) raw.themeColors.header.bg = computedHeaderBg;
            if (!raw.themeColors.header.bg && renderResult.colors.header) raw.themeColors.header.bg = renderResult.colors.header;
            if (!raw.themeColors.header.text && computedHeaderColor) raw.themeColors.header.text = computedHeaderColor;
            if (!raw.themeColors.navigation.background && computedNavBg) raw.themeColors.navigation.background = computedNavBg;
            if (!raw.themeColors.navigation.background && renderResult.colors.navigation) raw.themeColors.navigation.background = renderResult.colors.navigation;
            if (!raw.themeColors.navigation.color && computedNavColor) raw.themeColors.navigation.color = computedNavColor;
            if (!raw.themeColors.button.bg && computedButtonBg) raw.themeColors.button.bg = computedButtonBg;
            if (!raw.themeColors.button.bg && renderResult.colors.button) raw.themeColors.button.bg = renderResult.colors.button;
            if (!raw.themeColors.button.text && computedButtonColor) raw.themeColors.button.text = computedButtonColor;
            if (!raw.themeColors.footer) raw.themeColors.footer = {};
            if (!raw.themeColors.footer.bg && computedFooterBg) raw.themeColors.footer.bg = computedFooterBg;
            if (!raw.themeColors.footer.bg && renderResult.colors.footer) raw.themeColors.footer.bg = renderResult.colors.footer;
            if (!raw.themeColors.page?.bg && computedPageBg) {
                raw.themeColors.page = raw.themeColors.page || {};
                raw.themeColors.page.bg = computedPageBg;
            }
            // merge rendered palette into allBgs for palette building
            if (Array.isArray(renderResult.colors.palette) && renderResult.colors.palette.length) {
                raw.allBgs = (raw.allBgs || []).concat(renderResult.colors.palette.map(c => c));
            }
            if (renderResult.computed?.cssVariables) {
                raw.allBgs = (raw.allBgs || []).concat(Object.values(renderResult.computed.cssVariables));
            }
            captureSource = 'render';
        } else {
            // Playwright/render not available or returned null -> use image-based fallback
            const fb = await extractColorsFromImagesFallback(raw, baseUrl);
            if (fb) {
                raw.renderColors = raw.renderColors || {};
                if (fb.palette && fb.palette.length) raw.allBgs = (raw.allBgs || []).concat(fb.palette);
                raw.themeColors = raw.themeColors || {};
                raw.themeColors.header = raw.themeColors.header || {};
                raw.themeColors.navigation = raw.themeColors.navigation || {};
                raw.themeColors.button = raw.themeColors.button || {};
                if (!raw.themeColors.header.bg && fb.header) raw.themeColors.header.bg = fb.header;
                if (!raw.themeColors.navigation.background && fb.navigation) raw.themeColors.navigation.background = fb.navigation;
                if (!raw.themeColors.button.bg && fb.button) raw.themeColors.button.bg = fb.button;
                if (!raw.themeColors.footer) raw.themeColors.footer = {};
                if (!raw.themeColors.footer.bg && fb.footer) raw.themeColors.footer.bg = fb.footer;
                captureSource = 'image-fallback';
            }
        }
    } catch (e) {
        logger.warn(`[Scraper] render capture failed: ${e.message}`);
        // attempt fallback on error as well
        try {
            const fb2 = await extractColorsFromImagesFallback(raw, baseUrl);
            if (fb2) {
                if (fb2.palette && fb2.palette.length) raw.allBgs = (raw.allBgs || []).concat(fb2.palette);
                raw.themeColors = raw.themeColors || {};
                raw.themeColors.header = raw.themeColors.header || {};
                raw.themeColors.navigation = raw.themeColors.navigation || {};
                raw.themeColors.button = raw.themeColors.button || {};
                if (!raw.themeColors.header.bg && fb2.header) raw.themeColors.header.bg = fb2.header;
                if (!raw.themeColors.navigation.background && fb2.navigation) raw.themeColors.navigation.background = fb2.navigation;
                if (!raw.themeColors.button.bg && fb2.button) raw.themeColors.button.bg = fb2.button;
                if (!raw.themeColors.footer) raw.themeColors.footer = {};
                if (!raw.themeColors.footer.bg && fb2.footer) raw.themeColors.footer.bg = fb2.footer;
                captureSource = 'image-fallback';
            }
        } catch (ee) {
            logger.warn(`[Scraper] fallback image extraction also failed: ${ee.message}`);
        }
    }

    // attach per-section capture debug info (what changed and source)
    try {
        raw._debugTheme = raw._debugTheme || {};
        const postCapture = {
            header: raw.themeColors?.header?.bg || null,
            navigation: raw.themeColors?.navigation?.background || null,
            button: raw.themeColors?.button?.bg || null,
            footer: raw.themeColors?.footer?.bg || null,
        };
        const sections = {};
        for (const k of ['header', 'navigation', 'button', 'footer']) {
            const before = preCapture[k];
            const after = postCapture[k];
            let source = 'none';
            if (after && before && after === before) source = 'pre-existing';
            else if (renderResult && renderResult.colors && renderResult.colors[k] && after === renderResult.colors[k]) source = 'render';
            else if (captureSource === 'image-fallback' && after) source = 'image-fallback';
            else if (after) source = 'computed';
            sections[k] = { value: after, source };
        }
        // determine palette used and 'other' remaining colors
        const paletteUsed = Array.isArray(renderResult?.colors?.palette) ? renderResult.colors.palette.slice() : (captureSource === 'image-fallback' ? (raw.allBgs || []).slice() : []);
        const usedVals = new Set(Object.values(sections).map(s => s.value).filter(Boolean));
        const other = paletteUsed.filter(c => c && !usedVals.has(c));
        raw._debugTheme.capture = {
            pathUsed: renderResult ? 'render' : (captureSource || 'none'),
            sections,
            paletteUsed,
            other,
        };
    } catch (err) { /* ignore */ }

    const rawTitle = cleanStr(raw.pageTitle || raw.ogTitle || '');
    const siteName = raw.ogSiteName || '';
    const cleanedTitle = rawTitle
        .replace(/\s*[\|–—\-:]{1,2}\s*.{0,60}$/, '')
        .replace(/\s*[\|–—\-:]{1,2}\s*.{0,60}$/, '')
        .trim();
    const identityName = siteName || cleanedTitle || '';

    const LOGO_IMG_EXTS = /\.(jpe?g|png|gif|bmp|webp|tiff?|svg|ai|eps|apng|raw|cr2|nef|arw|ico)(\?.*)?$/i;
    const detectLogoFormat = (url) => {
        if (!url) return null;
        if (url.startsWith('data:image/svg')) return 'svg-inline';
        if (url.startsWith('data:image/')) return 'data-uri';
        const m = url.match(LOGO_IMG_EXTS);
        return m ? m[1].toLowerCase() : 'unknown';
    };

    const identity = {
        name: identityName,
        description: cleanStr(raw.metaDesc || ''),
        logoUrl: raw.logoUrl ? (raw.logoUrl.startsWith('data:') ? raw.logoUrl : (toAbsUrl(raw.logoUrl, baseUrl) || raw.logoUrl)) : '',
        faviconUrl: raw.favicon ? (toAbsUrl(raw.favicon, baseUrl) || raw.favicon) : `${new URL(baseUrl).origin}/favicon.ico`,
        logoFormat: raw.logoFormat || detectLogoFormat(raw.logoUrl),
        logoSource: raw.logoUrl ? (raw.logoFormat === 'favicon-fallback' ? 'favicon-fallback' : 'scraped') : null,
    };
    if (!identity.logoUrl && identity.faviconUrl) {
        identity.logoUrl = identity.faviconUrl;
        identity.logoFormat = detectLogoFormat(identity.faviconUrl) || 'favicon-ico';
        identity.logoSource = 'favicon-fallback';
    }

    // ── Color resolution priority chain ──────────────────────────────────
    // Tier 1: SCREENSHOT — real pixels from the rendered page (most reliable
    //         signal of what the site actually looks like).
    // Tier 2: LOGO / FAVICON — dominant colors pulled from the brand mark.
    // Tier 3: DECLARED — colors the site itself declares via CSS variables
    //         or meta theme-color tags.
    // Each tier is only attempted if the previous one produced nothing.
    const pagePalette = buildPalette(raw);

    let logoColors = { primary: null, secondary: null, palette: [], source: null };

    if (pagePalette.screenshotPrimary) {
        logoColors = {
            primary: pagePalette.screenshotPrimary,
            secondary: pagePalette.screenshotSecondary || null,
            palette: pagePalette.palette || [],
            source: 'screenshot',
        };
        logger.info(`[Scraper] Color source: screenshot majority (${logoColors.primary})`);
    } else {
        logger.warn('[Scraper] Screenshot color extraction unavailable/empty — trying logo next');

        const logoSourceUrl = identity.logoSource !== 'favicon-fallback' ? identity.logoUrl : null;
        const faviconFallback = identity.faviconUrl || null;

        if (logoSourceUrl) {
            try {
                const lc = await extractLogoColors(logoSourceUrl, null, baseUrl, false);
                if (lc.primary) logoColors = { ...lc, source: lc.source || 'logo' };
            } catch (e) {
                logger.warn(`[Scraper] Logo color extraction failed: ${e.message}`);
            }
        }
        if (!logoColors.primary && faviconFallback) {
            try {
                const favColors = await extractLogoColors(faviconFallback, null, baseUrl, true);
                if (favColors.primary) logoColors = { ...favColors, source: 'favicon' };
            } catch (e) {
                logger.warn(`[Scraper] Favicon color extraction failed: ${e.message}`);
            }
        }

        if (logoColors.primary) {
            logger.info(`[Scraper] Color source: ${logoColors.source} (${logoColors.primary})`);
        } else {
            logger.warn('[Scraper] Logo/favicon color extraction unavailable/empty — falling back to declared colors');
            if (pagePalette.declaredPrimary || pagePalette.primary) {
                logoColors = {
                    primary: pagePalette.declaredPrimary || pagePalette.primary,
                    secondary: pagePalette.declaredSecondary || pagePalette.secondary || null,
                    palette: pagePalette.palette || [],
                    source: 'declared',
                };
                logger.info(`[Scraper] Color source: declared CSS/meta (${logoColors.primary})`);
            } else {
                logger.warn('[Scraper] No color could be resolved from screenshot, logo, or declared CSS/meta');
            }
        }
    }

    const colors = pagePalette;

    const tc = raw.themeColors;
    const norm = normaliseCssColor;
    const themeSystem = {
        button: {
            background: norm(tc.button?.bg),
            color: norm(tc.button?.text),
            border: norm(tc.button?.border) || null,
            hoverBackground: norm(tc.button?.hoverBackground) || null,
            hoverText: norm(tc.button?.hoverText) || null,
        },
        header: {
            background: norm(tc.header?.bg),
            color: norm(tc.header?.text),
            border: norm(tc.header?.border) || null,
            link: norm(tc.header?.link) || null,
        },
        navigation: {
            background: norm(tc.navigation?.background) || norm(tc.header?.bg),
            color: norm(tc.navigation?.color) || null,
            border: norm(tc.navigation?.border) || null,
            active: norm(tc.navigation?.linkColors?.active) || null,
            linkColors: {
                default: norm(tc.navigation?.linkColors?.default) || null,
                hover: norm(tc.navigation?.linkColors?.hover) || null,
                active: norm(tc.navigation?.linkColors?.active) || null,
            },
        },
        footer: { background: norm(tc.footer?.bg), color: norm(tc.footer?.text), border: null, link: null },
        hero: { background: norm(tc.hero?.bg) },
        page: { background: norm(tc.page?.bg) || '#FFFFFF' },
        bodyText: null,
        linkColor: null,
        exactCssVars: colors.exact.cssVariables,
        exactCssVarsList: colors.exact.cssVariablesList || [],
        metaColors: colors.exact.meta,
        exactElements: {},
    };

    const typography = (() => {
        const primaryFont = raw.bodyFontFamily || raw.googleFontFamilies[0] || null;
        const headingFont = raw.headingFontFamily || raw.googleFontFamilies[1] || raw.googleFontFamilies[0] || null;
        return {
            primaryFont,
            headingFont: headingFont && headingFont !== primaryFont ? headingFont : null,
            bodyFont: primaryFont,
            googleFontFamilies: raw.googleFontFamilies,
            bodyFontSize: raw.bodyFontSize || null,
        };
    })();

    // Dedup helper — keeps the first occurrence for a given key.
    const dedupeBy = (arr, keyFn) => {
        const seen = new Set();
        const out = [];
        for (const item of arr) {
            const key = keyFn(item);
            if (key == null || seen.has(key)) continue;
            seen.add(key);
            out.push(item);
        }
        return out;
    };

    const images = dedupeBy(
        (raw.images || []).map(img => ({
            ...img,
            url: img.url.startsWith('inline-svg:') ? img.url : (toAbsUrl(img.url, baseUrl) || img.url),
        })),
        img => img.url
    );
    const videos = dedupeBy(
        (raw.videos || []).map(vid => ({ ...vid, url: toAbsUrl(vid.url, baseUrl) || vid.url })),
        vid => vid.videoId ? `${vid.platform}:${vid.videoId}` : vid.url
    );

    const content = raw.content || {};
    const forms = raw.forms || [];

    const sm = raw.seoMeta || {};
    const seo = {
        title: cleanStr(raw.pageTitle || ''),
        metaDescription: sm.description || raw.metaDesc || '',
        metaKeywords: [...new Set((sm.keywords || '').split(',').map(k => k.trim()).filter(Boolean))],
        canonicalUrl: raw.canonical || baseUrl,
        robotsTag: sm.robots || '',
        openGraph: {
            title: sm.og_title || '',
            description: sm.og_description || '',
            image: sm.og_image || '',
            url: sm.og_url || '',
            site_name: sm.og_site_name || '',
        },
        twitterCard: {
            card: sm.tw_card || '',
            title: sm.tw_title || '',
            description: sm.tw_description || '',
            image: sm.tw_image || '',
        },
    };

    const sections = raw.detectedSections || [];

    const textCorpus = [
        identity.name, identity.description,
        content.heroHeading, content.heroSubheading,
        ...(content.services || []).map(s => s.title + ' ' + s.description),
        ...(content.sectionHeadings || []),
        seo.metaKeywords.join(' '),
        raw.textCorpusSample || '',
    ].join(' ');

    const classificationInput = {
        title: seo.title,
        meta: (seo.metaDescription || '') + ' ' + (seo.metaKeywords || []).join(' '),
        body: textCorpus,
    };

    const { industry, subIndustry, matchedKeywords, score: industryScore, confidence: industryConfidence, source: industrySource } = await classifyIndustry(classificationInput);

    const formFieldsFromExtractor = extractFormFieldsFromHtml(html);
    const mergedForms = [...forms];
    if (Array.isArray(formFieldsFromExtractor) && formFieldsFromExtractor.length > 0) {
        for (const ff of formFieldsFromExtractor) {
            const isDupe = mergedForms.some(f => f.action && f.action === ff.action);
            if (!isDupe) mergedForms.push(ff);
        }
    }

    const durationMs = Date.now() - startedAt;
    logger.info(`[Scraper] Completed in ${durationMs}ms — ${images.length} images, ${videos.length} videos, ${sections.length} sections`);

    const result = {
        identity,
        colors,
        logoColors,
        themeSystem,
        theme: themeSystem,
        fonts: typography,
        darkMode: raw.darkMode || { enabled: false, overrides: {} },
        frameworkInfo: raw.frameworkInfo || { platform: 'Plain HTML', frameworks: [], evidence: {} },
        typography,
        images,
        videos,
        content,
        forms: mergedForms,
        formFields: formFieldsFromExtractor,
        seo,
        sections,
        industry,
        subIndustry,
        industryScore,
        industryConfidence,
        industrySource,
        scrapedAt: new Date().toISOString(),
        sourceUrl: websiteUrl,
        finalUrl: finalUrl || websiteUrl,
        durationMs,
        website: websiteUrl,
        assets: [
            ...images.map(img => ({ type: 'image', url: img.url, section: img.section || 'unknown' })),
            ...videos.map(vid => ({ type: 'video', url: vid.url, platform: vid.platform })),
        ],
        structuredContent: {
            hero: { headline: content.heroHeading, subheadline: content.heroSubheading, images: images.filter(i => i.section === 'hero').slice(0, 3).map(i => i.url) },
            services: content.services,
            features: content.features,
            testimonials: content.testimonials,
            cta: { buttons: content.ctaTexts },
        },
        meta: {
            title: seo.title,
            description: seo.metaDescription,
            favicon: identity.faviconUrl,
            logoUrl: identity.logoUrl,
            fonts: {
                googleFontFamilies: typography.googleFontFamilies,
                primaryFont: typography.primaryFont || '',
                headingFont: typography.headingFont || '',
                bodyFont: typography.bodyFont || '',
                bodyFontSize: typography.bodyFontSize || '',
            },
            canonicalUrl: seo.canonicalUrl,
            keywords: seo.metaKeywords,
            robots: seo.robotsTag,
            openGraphImage: seo.openGraph?.image || '',
            twitterImage: seo.twitterCard?.image || '',
            twitterCard: seo.twitterCard?.card || '',
            themeColor: sm.themeColor || '',
            siteName: seo.openGraph?.site_name || '',
        },
    };

    if (
        (!result.sections || result.sections.length === 0) &&
        (!result.images || result.images.length <= 2)
    ) {
        logger.error('[Scraper] Empty scrape result — likely blocked');
        throw new Error('Scraping failed: No meaningful content extracted');
    }

    return result;
};

const buildWebsiteProfile = (scraped, themeData = null) => {
    if (!scraped) return null;

    // ─── FINAL DEDUP SAFETY NET ─────────────────────────────────────────────
    // This is the last step before data is saved to the Project model, so it
    // dedupes every array field regardless of how it was produced upstream
    // (extraction overlap, multiple scrape passes, merges, etc).
    // For primitives (strings), pass keyFn = (x) => x. For objects, pass a
    // function that returns the field(s) that define uniqueness.
    const dedupeArray = (arr, keyFn) => {
        if (!Array.isArray(arr)) return [];
        const seen = new Set();
        const out = [];
        for (const item of arr) {
            const key = keyFn(item);
            if (key == null || key === '') continue;
            if (seen.has(key)) continue;
            seen.add(key);
            out.push(item);
        }
        return out;
    };

    const {
        identity = {}, colors = {}, logoColors = {}, themeSystem = {},
        typography = {}, images = [], videos = [], content = {},
        forms = [], seo = {}, sections = [],
        industry, subIndustry, industryScore, industryConfidence, industrySource,
        scrapedAt, sourceUrl, finalUrl,
        darkMode = { enabled: false, overrides: {} },
        frameworkInfo = { platform: 'Plain HTML', frameworks: [], evidence: {} },
    } = scraped;

    // `logoColors` already encodes the full screenshot → logo/favicon → declared
    // priority chain resolved in scrapeWebsiteStructure, so it must win here.
    // `colors.primary` (raw CSS-first heuristic) is only a last-resort fallback
    // for the rare case logoColors ended up with nothing at all.
    const primaryColor = logoColors.primary || colors.primary || '';
    const secondaryColor = logoColors.secondary || colors.secondary || '';
    const accentColor = colors.accent || '';

    return {
        identity: {
            name: identity.name || identity.brandName || '',
            description: identity.description || seo.metaDescription || '',
            logoUrl: identity.logoUrl || identity.logo || '',
            logoFormat: identity.logoFormat || null,
            logoSource: identity.logoSource || null,
            favicon: identity.faviconUrl || identity.favicon || '',
        },
        logoColors: {
            primary: logoColors.primary || null,
            secondary: logoColors.secondary || null,
            palette: dedupeArray(logoColors.palette, c => c),
            source: logoColors.source || null,
            cssOverrode: !!(colors.primary && logoColors.primary && colors.primary !== logoColors.primary),
        },
        industry: {
            industry: industry || '',
            subIndustry: subIndustry || '',
            confidence: industryConfidence ?? null,
            detectedFrom: industrySource ? [industrySource] : [],
        },
        colors: {
            primary: primaryColor,
            secondary: secondaryColor,
            rawPrimary: colors.rawPrimary || '',
            rawSecondary: colors.rawSecondary || '',
            accent: accentColor,
            palette: dedupeArray(colors.palette, c => c),
            pagePrimary: colors.primary || '',
            pageSecondary: colors.secondary || '',
        },
        theme: (() => {
            const p = primaryColor;
            const sec = secondaryColor;
            const cssVars = colors.exact?.cssVariables || {};
            const elemColors = themeSystem?.exactCssVars || cssVars;
            const exactElements = themeSystem?.exactElements || {};
            const metaThemeColor = normaliseCssColor(colors.exact?.meta?.themeColor || themeSystem?.metaColors?.themeColor);

            const findCssVarColor = (keywords) => {
                for (const [varName, val] of Object.entries(elemColors)) {
                    if (keywords.some(k => varName.toLowerCase().includes(k))) {
                        const n = normaliseCssColor(val);
                        if (n && !isNeutralHex(n)) return n;
                    }
                }
                return null;
            };
            const cssPrimary = findCssVarColor(['primary', 'brand', 'main', 'theme']);
            const cssSecondary = findCssVarColor(['secondary', 'accent']);
            const first = (...vals) => vals.find(v => v && v !== '') || '';

            const exactBtnBg = exactElements.primaryBrandBg;
            const exactHeaderBg = exactElements.headerBrandBg;
            const exactFooterBg = exactElements.footerBrandBg;

            // Defense-in-depth: even with FIX 7's same-element extraction, other sources in
            // this fallback chain (exact*Bg from a different pass, meta theme-color, etc.)
            // could still independently land on the same hex for bg and text, producing
            // invisible text. If that happens, swap text for a contrasting default instead
            // of trusting the coincidental match.
            const hexLuminance = (hex) => {
                if (!hex || hex[0] !== '#' || hex.length !== 7) return null;
                const r = parseInt(hex.slice(1, 3), 16) / 255;
                const g = parseInt(hex.slice(3, 5), 16) / 255;
                const b = parseInt(hex.slice(5, 7), 16) / 255;
                return 0.2126 * r + 0.7152 * g + 0.0722 * b;
            };
            const ensureContrast = (bg, text) => {
                if (!bg || !text || bg.toLowerCase() !== text.toLowerCase()) return text;
                const lum = hexLuminance(bg);
                if (lum === null) return text;
                return lum > 0.5 ? '#212221' : '#ffffff';
            };

            // FIX 8: Removed `p` (page-level primary palette color) from button background
            // fallback chain — it frequently resolves to body text or page background color,
            // not the actual button color. Only trust explicit button-origin sources.
            const btnBg = first(exactBtnBg, themeSystem?.button?.background, cssPrimary, metaThemeColor);
            const btnText = ensureContrast(btnBg, first(themeSystem?.button?.color, '#ffffff'));
            const headerBg = first(exactHeaderBg, themeSystem?.header?.background, themeSystem?.page?.background, '#ffffff');
            const headerText = ensureContrast(headerBg, first(themeSystem?.header?.color, themeSystem?.bodyText, '#212221'));
            const navText = ensureContrast(headerBg, first(themeSystem?.header?.link, themeSystem?.linkColor, cssPrimary, headerText));
            const navBg = first(themeSystem?.navigation?.background, headerBg);
            const navActive = first(themeSystem?.navigation?.active, cssPrimary, p);
            const footerBg = first(exactFooterBg, themeSystem?.footer?.background, '#212221');
            const footerText = ensureContrast(footerBg, first(themeSystem?.footer?.color, '#898B8A'));

            const navHover = first(themeSystem?.navigation?.linkColors?.hover, cssSecondary);
            const navBorder = themeSystem?.header?.border || '';
            const btnBorder = themeSystem?.button?.border || '';
            const btnHoverBg = themeSystem?.button?.hoverBackground || '';
            const btnHoverText = themeSystem?.button?.hoverText || '';

            return {
                header: themeData?.header || { background: headerBg, text: headerText, border: navBorder },
                navigation: themeData?.navigation || { background: navBg, text: navText, active: navActive, hover: navHover, border: navBorder },
                buttons: {
                    primaryBg: btnBg,
                    primaryText: btnText,
                    primaryBorder: btnBorder,
                    primaryHoverBg: btnHoverBg,
                    primaryHoverText: btnHoverText,
                    secondaryBg: first(cssSecondary, sec, p),
                    secondaryText: '#ffffff',
                },
                footer: { background: footerBg, text: footerText },
            };
        })(),
        fonts: {
            primaryFont: typography.primaryFont || '',
            headingFont: typography.headingFont || '',
            googleFonts: dedupeArray(typography.googleFontFamilies, f => f),
            bodyFont: typography.bodyFont || '',
            bodyFontSize: typography.bodyFontSize || '',
        },
        images: dedupeArray(images, img => img.url).map(img => ({
            url: img.url || '',
            alt: img.alt || '',
            section: img.section || 'unknown',
            width: img.width || null,
            height: img.height || null,
            ...(img.markup ? { markup: img.markup } : {}),
        })),
        videos: dedupeArray(videos, vid => vid.videoId ? `${vid.platform}:${vid.videoId}` : vid.url).map(vid => ({
            url: vid.url || '',
            platform: vid.platform || '',
            videoId: vid.videoId || '',
            poster: vid.poster || '',
            section: vid.section || '',
        })),
        content: {
            hero: {
                title: content.heroHeading || '',
                subtitle: content.heroSubheading || '',
                ctaText: (content.ctaTexts && content.ctaTexts[0]) || '',
            },
            taglines: dedupeArray(content.taglines, t => t),
            services: dedupeArray(content.services, s => s.title).map(s => ({ title: s.title || '', description: s.description || '', icon: s.icon || '' })),
            features: dedupeArray(content.features, f => f.title).map(f => ({ title: f.title || '', description: f.description || '', icon: f.icon || '' })),
            testimonials: dedupeArray(content.testimonials, t => t.text).map(t => ({ name: t.name || t.author || '', company: t.company || '', text: t.text || '', rating: t.rating || null })),
            ctas: dedupeArray(content.ctaTexts, text => text).map(text => ({ title: '', description: '', buttonText: text })),
            sectionHeadings: dedupeArray(content.sectionHeadings, h => h),
        },
        forms: dedupeArray(
            (Array.isArray(forms) ? forms : []).filter(f => Array.isArray(f.fields) && f.fields.length > 0),
            f => `${f.action || ''}|${(f.fields || []).map(fld => `${fld.name}:${fld.type}`).join(',')}`
        ).map((f, i) => ({
            formName: f.formName || f.id || f.action || `form_${i}`,
            fields: f.fields.map(field => ({
                name: String(field.name || `field_${i}`),
                label: String(field.label || field.placeholder || ''),
                type: String(field.type || 'text'),
                placeholder: String(field.placeholder || ''),
                required: !!field.required,
            })),
        })),
        seo: {
            title: seo.title || '',
            description: seo.metaDescription || '',
            canonicalUrl: seo.canonicalUrl || '',
            robots: seo.robotsTag || '',
            keywords: dedupeArray(seo.metaKeywords, k => k),
            openGraph: {
                title: seo.openGraph?.title || '',
                description: seo.openGraph?.description || '',
                image: seo.openGraph?.image || '',
                url: seo.openGraph?.url || '',
            },
            twitter: {
                card: seo.twitterCard?.card || '',
                title: seo.twitterCard?.title || '',
                description: seo.twitterCard?.description || '',
                image: seo.twitterCard?.image || '',
            },
        },
        sections: dedupeArray(sections, s => typeof s === 'string' ? s : (s.type || null)).map((s, idx) => ({
            type: typeof s === 'string' ? s : (s.type || ''),
            enabled: true,
            order: idx,
            data: typeof s === 'object' ? (s.data || null) : null,
        })),
        extraction: {
            sourceUrl: sourceUrl || '',
            finalUrl: finalUrl || sourceUrl || '',
            scrapedAt: scrapedAt ? new Date(scrapedAt) : new Date(),
            extractionVersion: '7.1',
            durationMs: scraped.durationMs || 0,
        },
        darkMode,
        frameworkInfo,
    };
};

module.exports = { scrapeWebsiteStructure, buildWebsiteProfile, extractLogoColorsFromUrl: extractLogoColors };