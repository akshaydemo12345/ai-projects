'use strict';

/**
 * structuredScrapeService.js  —  v7 (Cheerio + node-fetch, Puppeteer-free)
 *
 * Uses node-fetch (primary) + axios (fallback) to fetch pages, then Cheerio
 * for DOM extraction.  No browser process required.
 *
 * Extraction groups (identical to v5):
 *   1. Identity    (name, description, logo, favicon)
 *   2. Colors      (primary / secondary / accent / full palette / exact CSS vars)
 *   3. Logo Colors (extracted specifically from logo image)
 *   4. ThemeSystem (per-component computed colours)
 *   5. Typography  (Google Fonts, computed font families)
 *   6. Images      (rich — url, alt, section, dimensions)
 *   7. Videos      (YouTube / Vimeo / html5)
 *   8. Content     (hero, services, features, testimonials, CTAs, taglines)
 *   9. Forms       (fields with name / label / type / placeholder / required)
 *  10. SEO         (title, description, keywords, OG, Twitter)
 *  11. Sections    (detected page section types)
 *  12. Industry    (keyword-based + AI classification)
 *
 * Package fallback strategy:
 *   HTTP fetch  → node-fetch → axios
 *   Image fetch → node-fetch → axios
 *   SVG render  → @resvg/resvg-js (optional)
 *   Color algo  → node-vibrant → sharp pixel-count → skip
 */

const cheerio = require('cheerio');
const logger = require('../utils/logger');

// ── Optional package loaders ─────────────────────────────────────────────────

const loadOptional = (name) => {
    try { return require(name); } catch { return null; }
};

const axios = loadOptional('axios');
const nodeFetch = loadOptional('node-fetch');
const sharpLib = loadOptional('sharp');
const resvgLib = loadOptional('@resvg/resvg-js');
const Anthropic = loadOptional('@anthropic-ai/sdk');

// node-vibrant v4 named export vs v3 default
let VibrantLib = null;
try {
    const v = require('node-vibrant/node');
    VibrantLib = v.Vibrant || v;
} catch { /* vibrant unavailable — pixel counting fallback */ }

const { extractFormFields: extractFormFieldsFromHtml } =
    require('../utils/formExtractor');

// ── HTTP helpers ─────────────────────────────────────────────────────────────

const DEFAULT_UA =
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
    '(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

const DEFAULT_HEADERS = {
    'User-Agent': DEFAULT_UA,
    'Accept': 'text/html,application/xhtml+xml,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'Cache-Control': 'no-cache',
    'Upgrade-Insecure-Requests': '1',
};

/**
 * Fetch a URL and return { html, finalUrl }.
 * Primary: node-fetch   Fallback: axios
 */
const fetchHtml = async (url, timeoutMs = 30_000) => {
    // ── node-fetch ──
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

    // ── axios fallback ──
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

    throw new Error('No HTTP client available (install node-fetch or axios)');
};

/**
 * Fetch binary (image) data as a Buffer.
 * Primary: node-fetch   Fallback: axios
 */
const fetchBinary = async (url, referer = '', timeoutMs = 10_000) => {
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

// ── Generic helpers ───────────────────────────────────────────────────────────

const toAbsUrl = (src, base) => {
    if (!src || src.startsWith('data:')) return null;
    if (src.startsWith('http')) return src;
    if (src.startsWith('//')) return 'https:' + src;
    try { return new URL(src, base).href; } catch { return null; }
};

const cleanStr = (s) => (s || '').trim().replace(/\s+/g, ' ');

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

// ── Industry classification ───────────────────────────────────────────────────

const INDUSTRY_MAP = [
    { industry: 'Beauty & Personal Care', sub: 'Natural Skincare', kws: ['skincare', 'beauty', 'cosmetic', 'serum', 'moisturizer', 'natural skin', 'organic beauty', 'skin care'] },
    { industry: 'Beauty & Personal Care', sub: 'Hair Care', kws: ['shampoo', 'conditioner', 'hair oil', 'hair care', 'hair growth'] },
    { industry: 'Healthcare', sub: 'Dental Clinic', kws: ['dental', 'dentist', 'tooth', 'oral health', 'orthodontic'] },
    { industry: 'Healthcare', sub: 'Medical Services', kws: ['hospital', 'clinic', 'doctor', 'physician', 'healthcare', 'medical', 'health center'] },
    { industry: 'Healthcare', sub: 'Pharmacy', kws: ['pharmacy', 'medicine', 'drug store', 'pharmaceutical'] },
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

const classifyIndustryByKeywords = (textCorpus) => {
    const lower = (textCorpus || '').toLowerCase();
    const scores = {};
    for (const entry of INDUSTRY_MAP) {
        const score = entry.kws.reduce((acc, kw) => acc + (lower.includes(kw) ? 1 : 0), 0);
        if (score > 0) {
            const key = entry.industry;
            if (!scores[key] || scores[key].score < score) scores[key] = { score, sub: entry.sub };
        }
    }
    const sorted = Object.entries(scores).sort((a, b) => b[1].score - a[1].score);
    if (sorted.length === 0) return null;
    const [industry, { sub }] = sorted[0];
    return { industry, subIndustry: sub, score: sorted[0][1].score };
};

const classifyIndustryWithAI = async (textCorpus) => {
    if (!Anthropic) return null;
    try {
        const client = new Anthropic();
        const subMap = INDUSTRY_MAP.map(e => e.industry + ' > ' + e.sub).join(', ');
        const snippet = (textCorpus || '').slice(0, 800);
        const prompt =
            'Classify this website into one industry category.\n\nWebsite text:\n' + snippet +
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
        if (parsed.industry && parsed.subIndustry) return parsed;
    } catch (e) {
        logger.warn('[Industry] AI classify failed: ' + e.message);
    }
    return null;
};

const classifyIndustry = async (textCorpus) => {
    const kwResult = classifyIndustryByKeywords(textCorpus);
    if (kwResult && kwResult.score >= 2) return { industry: kwResult.industry, subIndustry: kwResult.subIndustry };
    const aiResult = await classifyIndustryWithAI(textCorpus);
    if (aiResult) return aiResult;
    if (kwResult) return { industry: kwResult.industry, subIndustry: kwResult.subIndustry };
    return { industry: 'General', subIndustry: 'Business' };
};

// ── Colour helpers ────────────────────────────────────────────────────────────

const isNeutralHex = (hex) => {
    if (!hex || hex.length < 7) return true;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    const sat = max === 0 ? 0 : (max - min) / max;
    const lum = (r * 299 + g * 587 + b * 114) / 1000;
    return sat < 0.12 || lum > 235 || lum < 20;
};

const normaliseCssColor = (raw) => {
    if (!raw) return null;
    const s = raw.trim();
    if (!s || s === 'transparent' || s === 'rgba(0, 0, 0, 0)' || s === 'rgb(0, 0, 0)') return null;

    const h6 = s.match(/^#([0-9a-fA-F]{6})$/); if (h6) return ('#' + h6[1]).toUpperCase();
    const h3 = s.match(/^#([0-9a-fA-F]{3})$/); if (h3) return ('#' + h3[1].split('').map(c => c + c).join('')).toUpperCase();
    const h8 = s.match(/^#([0-9a-fA-F]{8})$/); if (h8) return ('#' + h8[1].slice(0, 6)).toUpperCase();

    const rgb = s.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
    if (rgb) {
        const [, r, g, b] = rgb.map(Number);
        return ('#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')).toUpperCase();
    }

    const hsl = s.match(/hsla?\(\s*([\d.]+)\s*,\s*([\d.]+)%?\s*,\s*([\d.]+)%?/);
    if (hsl) {
        let [h, sat, l] = [parseFloat(hsl[1]), parseFloat(hsl[2]) / 100, parseFloat(hsl[3]) / 100];
        const k = n => { const kk = (n + h / 30) % 12; const a2 = sat * Math.min(l, 1 - l); return l - a2 * Math.max(-1, Math.min(kk - 3, 9 - kk, 1)); };
        return ('#' + [0, 8, 4].map(n => Math.round(k(n) * 255).toString(16).padStart(2, '0')).join('')).toUpperCase();
    }
    return null;
};

/**
 * Extract fill/stroke hex colors directly from raw SVG markup
 */
const extractColorsFromSvgMarkup = (svgMarkup) => {
    const colors = new Set();
    if (!svgMarkup) return [];
    // Match fill/stroke in attribute form: fill="#abc" or fill="rgb(...)"
    const attrRe = /(?:fill|stroke)="([^"]+)"/gi;
    // Match fill/stroke in style form: fill: #abc or fill: rgb(...)
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

// ── Logo color extraction (Cheerio-side, no browser page needed) ─────────────

/**
 * Extract dominant colors from a logo URL or data URI.
 * Uses node-fetch (primary) → axios (fallback) for HTTP images.
 *
 * @param {string}  logoUrl    Absolute URL or data URI
 * @param {*}       _page      Unused (kept for API compat with v5)
 * @param {string}  baseUrl    Base URL for relative paths
 * @param {boolean} isFavicon  Use favicon pixel-counting path
 */
const extractLogoColors = async (logoUrl, _page, baseUrl, isFavicon = false) => {
    if (!logoUrl) return { primary: null, secondary: null, palette: [], source: null };

    try {
        let imageBuffer;
        let isSvg = false;
        let svgMarkup = null;

        // ── 1. Data URI ──
        if (logoUrl.startsWith('data:image/')) {
            const match = logoUrl.match(/^data:([^;]+);base64,(.*)$/);
            if (match) {
                isSvg = match[1].includes('svg');
                imageBuffer = Buffer.from(match[2], 'base64');
                if (isSvg) svgMarkup = imageBuffer.toString('utf8');
            }
        }
        // ── 2. HTTP/HTTPS ──
        else {
            let resolvedUrl = logoUrl;
            if (!logoUrl.startsWith('http') && baseUrl) {
                try { resolvedUrl = new URL(logoUrl, baseUrl).toString(); } catch (_) { }
            }

            try {
                imageBuffer = await fetchBinary(resolvedUrl, baseUrl);
                const urlLower = resolvedUrl.toLowerCase();
                isSvg = urlLower.includes('.svg') || urlLower.includes('image/svg');
                // Also sniff the buffer — SVGs start with '<svg' or '<?xml'
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

        // ── 3. SVG — direct color extraction ──
        if (isSvg && svgMarkup) {
            const svgColors = extractColorsFromSvgMarkup(svgMarkup);
            logger.info(`[LogoColors] SVG direct colors: ${svgColors.slice(0, 3).join(', ')}`);

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

        // ── 4a. Favicon / ICO → pixel frequency counting ──
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
                let colors = nonNeutral.length > 0
                    ? nonNeutral
                    : sorted.filter(c => !['#FFFFFF', '#000000', '#FEFEFE', '#F8F8F8'].includes(c));

                // Deduplicate visually similar colours
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
                    logger.info(`[LogoColors] Favicon pixel colors: ${deduped.slice(0, 3).join(', ')}`);
                    return { primary: deduped[0] || null, secondary: deduped[1] || null, palette: deduped.slice(0, 5), source: 'favicon-pixel' };
                }
                logger.warn('[LogoColors] Favicon pixel extraction yielded no colors, falling back to Vibrant');
            } catch (e) {
                logger.warn(`[LogoColors] Favicon pixel extraction failed: ${e.message}`);
            }
        }

        // ── 4b. Raster → Vibrant ──
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
                logger.info(`[LogoColors] Vibrant colors (${source}): ${colors.slice(0, 3).join(', ')}`);
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

// ── Section keywords ──────────────────────────────────────────────────────────

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

// ── Cheerio-based extractor ───────────────────────────────────────────────────
// Mirrors every extraction group from the v5 IN_BROWSER_EXTRACTOR

const extractWithCheerio = ($, html, baseUrl) => {

    // ── helpers ──
    const getText = (el) => cleanStr($(el).text());
    const getAttr = (el, a) => ($(el).attr(a) || '').trim();

    const getRealSrc = (el) => {
        const $el = $(el);
        return (
            $el.attr('data-src') ||
            $el.attr('data-lazy-src') ||
            $el.attr('data-original') ||
            $el.attr('data-lazy') ||
            ($el.attr('srcset') || '').split(/[\s,]+/)[0] ||
            $el.attr('src') || null
        );
    };

    const toAbs = (src) => {
        if (!src) return null;
        if (src.startsWith('data:')) return src;
        return toAbsUrl(src, baseUrl);
    };

    // ── section detection helper ──
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

    // ─────────────────────────────────────────────────────────
    // 1. Identity
    // ─────────────────────────────────────────────────────────
    const pageTitle = cleanStr($('title').first().text());
    const metaDesc =
        $('meta[name="description"]').attr('content') ||
        $('meta[property="og:description"]').attr('content') || '';
    const ogTitle = $('meta[property="og:title"]').attr('content') || '';

    const LOGO_IMG_EXTS = /\.(jpe?g|png|gif|bmp|webp|tiff?|svg|ai|eps|apng|raw|cr2|nef|arw)(\?.*)?$/i;

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

    const LOGO_SELECTORS = [
        'img.logo', 'img[alt*="logo" i]', 'img[id*="logo" i]', 'img[class*="logo" i]',
        'img[src*="logo" i]',
        '.logo img', '.navbar-brand img', '.site-logo img', '.header-logo img',
        'a.logo img', '.brand img',
        'a[href="/"] img',
        'header img', 'nav img', '.navbar img', '.site-header img',
        'meta[property="og:image"]',
    ];

    // ── Inline SVG logo detection (checked before <img> selectors) ──
    // Many modern sites embed the logo as an inline <svg> inside header/nav.
    const INLINE_SVG_CONTAINERS = [
        '[role="banner"] svg', 'header svg', 'nav svg',
        '[class*="logo"] svg', '[id*="logo"] svg',
        '.navbar-brand svg', '.site-header svg', '.site-logo svg',
    ];

    let logoUrl = null;
    let logoFormat = null;
    let inlineSvgLogoMarkup = null;

    for (const sel of INLINE_SVG_CONTAINERS) {
        const el = $(sel).first();
        if (!el.length) continue;
        const markup = $.html(el);
        // Require at least one visible shape element — skip degenerate/icon-only SVGs
        const hasShape = /<(path|rect|circle|ellipse|polygon|use|image)/i.test(markup);
        const w = parseInt(el.attr('width') || '0', 10);
        const h = parseInt(el.attr('height') || '0', 10);
        const tooSmall = (w > 0 && w < 24) || (h > 0 && h < 24);
        if (hasShape && !tooSmall && markup.length > 60) {
            inlineSvgLogoMarkup = markup;
            logoFormat = 'svg-inline-dom';
            logoUrl = 'data:image/svg+xml,' + encodeURIComponent(markup);
            logger.info(`[Scraper] Inline SVG logo found via "${sel}"`);
            break;
        }
    }

    if (!logoUrl) {
        for (const sel of LOGO_SELECTORS) {
            const el = $(sel).first();
            if (!el.length) continue;

            if (el.is('meta')) {
                const content = el.attr('content');
                const abs = toAbs(content);
                if (abs && isSupportedImageSrc(abs)) { logoUrl = abs; logoFormat = 'og-image'; break; }
            } else {
                const src = getRealSrc(el);
                const absSrc = toAbs(src);
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
    }

    // Favicon
    const faviconSelectors = [
        'link[rel="icon"][sizes="any"]',
        'link[rel="icon"][type="image/svg+xml"]',
        'link[rel="icon"][sizes="192x192"]',
        'link[rel="icon"][sizes="128x128"]',
        'link[rel="icon"][sizes="64x64"]',
        'link[rel="icon"][sizes="48x48"]',
        'link[rel="icon"][sizes="32x32"]',
        'link[rel="icon"][sizes="16x16"]',
        'link[rel="shortcut icon"]',
        'link[rel="icon"]',
        'link[rel="apple-touch-icon"]',
        'link[rel="apple-touch-icon-precomposed"]',
        'meta[name="msapplication-TileImage"]',
    ];

    let favicon = null;
    for (const sel of faviconSelectors) {
        const el = $(sel).first();
        if (el.length) {
            favicon = el.attr('href') || el.attr('content') || null;
            if (favicon) break;
        }
    }
    if (!favicon) favicon = new URL(baseUrl).origin + '/favicon.ico';
    favicon = toAbs(favicon);

    if (!logoUrl && favicon) { logoUrl = favicon; logoFormat = 'favicon-fallback'; }

    // ─────────────────────────────────────────────────────────
    // 2. Colors — parse <style> / inline styles / meta tags
    //    (Cheerio cannot run computed CSS; we extract static declarations)
    // ─────────────────────────────────────────────────────────

    const cssVariables = {};
    const metaColors = {};
    const cssVarRegex = /--([a-zA-Z][a-zA-Z0-9-]*)\s*:\s*([^;}{]+)/g;

    $('style').each((_, el) => {
        const cssText = $(el).html() || '';
        let m;
        cssVarRegex.lastIndex = 0;
        while ((m = cssVarRegex.exec(cssText)) !== null) {
            cssVariables[m[1]] = m[2].trim();
        }
    });

    const metaTheme = $('meta[name="theme-color"]').attr('content');
    const metaMsTile = $('meta[name="msapplication-TileColor"]').attr('content');
    const metaOgColor = $('meta[property="og:color"]').attr('content');
    if (metaTheme) metaColors.themeColor = metaTheme;
    if (metaMsTile) metaColors.msTileColor = metaMsTile;
    if (metaOgColor) metaColors.ogColor = metaOgColor;

    // Extract inline-style background/foreground colors from key elements
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

    // Attempt to get primary color from CSS vars
    let exactPrimary = null, exactSecondary = null;
    const primaryVarNames = ['primary', 'brand', 'theme', 'main', 'color-primary', 'brand-primary'];
    const secondaryVarNames = ['secondary', 'accent', 'color-secondary', 'brand-secondary'];
    for (const [varName, colorValue] of Object.entries(cssVariables)) {
        const lower = varName.toLowerCase();
        if (!exactPrimary && primaryVarNames.some(p => lower.includes(p))) exactPrimary = normaliseCssColor(colorValue);
        if (!exactSecondary && secondaryVarNames.some(p => lower.includes(p))) exactSecondary = normaliseCssColor(colorValue);
    }

    // Collect color hints from HTML attributes (data-color, bg-color class names, etc.)
    const allBgs = [], allTexts = [];
    $('[style]').each((_, el) => {
        const style = $(el).attr('style') || '';
        const bg = style.match(/background(?:-color)?\s*:\s*([^;]+)/i);
        const fg = style.match(/(?:^|;)\s*color\s*:\s*([^;]+)/i);
        if (bg) allBgs.push(bg[1].trim());
        if (fg) allTexts.push(fg[1].trim());
    });

    const themeColors = {
        button: {
            bg: extractInlineBg('.btn-primary, .button-primary, .cta-btn, .wp-block-button__link, .btn, button') ||
                normaliseCssColor($('.btn-primary,.btn,.button').first().attr('style')?.match(/background[^;]*/)?.[0]),
            text: extractInlineColor('.btn-primary, .btn, button'),
        },
        header: {
            bg: extractInlineBg('header, .header, .site-header, .main-header, nav, .navbar'),
            text: extractInlineColor('header, .header, nav, .navbar'),
        },
        footer: {
            bg: extractInlineBg('footer, .footer, .site-footer'),
            text: extractInlineColor('footer, .footer, .site-footer'),
        },
        hero: {
            bg: extractInlineBg('.hero, .banner, .hero-section, .hero-banner'),
        },
        page: { bg: extractInlineBg('body') },
        exact: { cssVariables, meta: metaColors, elements: {} },
    };

    // ─────────────────────────────────────────────────────────
    // 3. Typography
    // ─────────────────────────────────────────────────────────

    const googleFontLinks = $('link[href*="fonts.googleapis.com"]').map((_, el) => $(el).attr('href')).get();

    // Also catch Google Fonts loaded via @import inside <style> blocks
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

    const bodyFontFamily = null; // computed style unavailable in Cheerio
    const headingFontFamily = null;
    const bodyFontSize = null;

    // ─────────────────────────────────────────────────────────
    // 4. Images
    // ─────────────────────────────────────────────────────────

    // ── UNWANTED: test only the URL *pathname*, not the hostname.
    // CDN subdomains like "icons.cloudfront.net" would otherwise poison every image.
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

    // ── Inline <svg> elements — captured with a synthetic URL so consumers
    //    know the logo/hero is an embedded SVG rather than an external file.
    $('svg').each((idx, el) => {
        const $el = $(el);
        const w = parseInt($el.attr('width') || '0', 10);
        const h = parseInt($el.attr('height') || '0', 10);
        if ((w > 0 && w < 24) || (h > 0 && h < 24)) return;  // skip tiny icons
        const hasVisibleContent = $el.find('path, rect, circle, ellipse, polygon, use, image').length > 0;
        if (!hasVisibleContent) return;
        const syntheticUrl = `inline-svg:${idx}`;
        if (seenImgUrls.has(syntheticUrl)) return;
        const alt = cleanStr($el.attr('aria-label') || $el.attr('title') || '');
        const markup = $.html($el);
        images.push({
            url: syntheticUrl,
            alt,
            width: w || null,
            height: h || null,
            section: getSectionForEl($el),
            markup,          // raw SVG source for downstream consumers
        });
        seenImgUrls.add(syntheticUrl);
    });

    // ── Background images from inline styles ──
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

    // ─────────────────────────────────────────────────────────
    // 5. Videos
    // ─────────────────────────────────────────────────────────

    const videos = [];
    $('video').each((_, el) => {
        const src = toAbs($(el).attr('src'));
        const poster = toAbs($(el).attr('poster'));
        if (src) videos.push({ url: src, platform: 'html5', videoId: null, poster: poster || null, section: getSectionForEl($(el)) });
    });
    $('iframe').each((_, el) => {
        const src = $(el).attr('src') || '';
        if (!src) return;
        if (src.includes('youtube.com') || src.includes('youtu.be')) {
            const m = src.match(/(?:youtube\.com\/embed\/|youtu\.be\/)([^/?&]+)/);
            videos.push({ url: toAbs(src) || src, platform: 'youtube', videoId: m?.[1] || null, poster: null, section: getSectionForEl($(el)) });
        } else if (src.includes('vimeo.com')) {
            const m = src.match(/vimeo\.com\/(\d+)/);
            videos.push({ url: toAbs(src) || src, platform: 'vimeo', videoId: m?.[1] || null, poster: null, section: getSectionForEl($(el)) });
        }
    });

    // ─────────────────────────────────────────────────────────
    // 6. Content
    // ─────────────────────────────────────────────────────────

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

    const features = [];
    $('[class*="feature" i], [class*="Feature"]').each((_, el) => {
        const h = cleanStr($(el).find('h1,h2,h3,h4,h5').first().text());
        const d = cleanStr($(el).find('p').first().text());
        if (h && !features.find(f => f.title === h)) features.push({ title: h, description: d || '' });
        if (features.length >= 15) return false;
    });

    const testimonials = [];
    $('[class*="testimonial" i], [class*="review" i], [class*="feedback" i]').each((_, el) => {
        const text = cleanStr($(el).find('p, blockquote, [class*="text" i], [class*="content" i]').first().text());
        const author = cleanStr($(el).find('[class*="author" i], [class*="name" i], [class*="person" i], cite').first().text());
        const company = cleanStr($(el).find('[class*="company" i], [class*="org" i], [class*="designation" i]').first().text());
        const rating = null;
        if (text && text.length > 20 && !testimonials.find(t => t.text === text)) {
            testimonials.push({ text, name: author || 'Anonymous', company: company || '', rating });
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

    // ─────────────────────────────────────────────────────────
    // 7. Forms
    // ─────────────────────────────────────────────────────────

    const forms = [];
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
            forms.push({ action: $(formEl).attr('action') || '', method: ($(formEl).attr('method') || 'POST').toUpperCase(), fields });
        }
    });

    // ─────────────────────────────────────────────────────────
    // 8. SEO
    // ─────────────────────────────────────────────────────────

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

    // ─────────────────────────────────────────────────────────
    // 9. Detected sections
    // ─────────────────────────────────────────────────────────

    const foundSections = new Set();
    $('section, article, div[id], div[class], header, footer, nav, main').each((_, el) => {
        const combined = (($(el).attr('class') || '') + ' ' + ($(el).attr('id') || '')).toLowerCase();
        for (const [sec, kws] of Object.entries(SECTION_KEYWORDS)) {
            if (kws.some(k => combined.includes(k))) foundSections.add(sec);
        }
    });

    return {
        pageTitle, metaDesc, ogTitle,
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

// ── Post-process extracted data ───────────────────────────────────────────────

const buildPalette = (raw) => {
    const { themeColors, allBgs, allTexts, allBorders } = raw;

    const exactColors = themeColors?.exact || {};
    const cssVars = exactColors.cssVariables || {};
    const metaCols = exactColors.meta || {};

    let exactPrimary = null, exactSecondary = null;
    const primaryVarNames = ['primary', 'brand', 'theme', 'main', 'color-primary', 'brand-primary', '--primary', '--brand', '--theme-color'];
    const secondaryVarNames = ['secondary', 'accent', 'color-secondary', 'brand-secondary', '--secondary', '--accent'];

    for (const [varName, colorValue] of Object.entries(cssVars)) {
        const lowerName = varName.toLowerCase();
        if (!exactPrimary && primaryVarNames.some(p => lowerName.includes(p))) exactPrimary = normaliseCssColor(colorValue);
        if (!exactSecondary && secondaryVarNames.some(p => lowerName.includes(p))) exactSecondary = normaliseCssColor(colorValue);
    }

    const metaPrimary = normaliseCssColor(metaCols.themeColor);
    const metaSecondary = normaliseCssColor(metaCols.msTileColor);

    const candidates = [
        exactPrimary || metaPrimary,
        themeColors?.button?.bg,
        themeColors?.header?.bg,
        themeColors?.footer?.bg,
        themeColors?.hero?.bg,
        themeColors?.header?.link,
        exactSecondary || metaSecondary,
        ...allBgs,
        ...allTexts,
        ...(allBorders || []),
    ]
        .map(normaliseCssColor)
        .filter(Boolean)
        .filter(c => !isNeutralHex(c));

    const palette = [...new Set(candidates)].slice(0, 20);
    const primary = exactPrimary || metaPrimary || palette[0] || '#333333';
    const secondary = exactSecondary || metaSecondary || palette.find(c => c !== primary) || '#555555';
    const accent = palette.find(c => c !== primary && c !== secondary) || '#888888';

    return { primary, secondary, accent, palette, exact: { cssVariables: cssVars, meta: metaCols } };
};

// ── Main export ───────────────────────────────────────────────────────────────

/**
 * scrapeWebsiteStructure
 *
 * Fetches the URL with node-fetch (primary) / axios (fallback),
 * extracts all 12 data groups via Cheerio, and returns the same
 * output shape as v5.
 */
const scrapeWebsiteStructure = async (websiteUrl) => {
    const startedAt = Date.now();

    logger.info(`[Scraper] Starting Cheerio scrape for ${websiteUrl}`);

    // ── Fetch HTML ──
    let html, finalUrl;
    try {
        ({ html, finalUrl } = await fetchHtml(websiteUrl, 30_000));
    } catch (err) {
        logger.warn(`[Scraper] First attempt failed (${err.message}), retrying with alternate UA…`);
        // Some sites block the default Chrome UA — try a generic curl-like UA
        const origUA = DEFAULT_HEADERS['User-Agent'];
        DEFAULT_HEADERS['User-Agent'] = 'curl/8.4.0';
        try {
            ({ html, finalUrl } = await fetchHtml(websiteUrl, 20_000));
        } finally {
            DEFAULT_HEADERS['User-Agent'] = origUA;
        }
    }

    const $ = cheerio.load(html);
    const baseUrl = finalUrl || websiteUrl;

    // ── Run Cheerio extractor ──
    const raw = extractWithCheerio($, html, baseUrl);

    // ── Logo detection format helper ──
    const LOGO_IMG_EXTS = /\.(jpe?g|png|gif|bmp|webp|tiff?|svg|ai|eps|apng|raw|cr2|nef|arw)(\?.*)?$/i;
    const detectLogoFormat = (url) => {
        if (!url) return null;
        if (url.startsWith('data:image/svg')) return 'svg-inline';
        if (url.startsWith('data:image/')) return 'data-uri';
        const m = url.match(LOGO_IMG_EXTS);
        return m ? m[1].toLowerCase() : 'unknown';
    };

    // ── Identity ──
    const identity = {
        name: cleanStr(raw.pageTitle || raw.ogTitle || ''),
        description: cleanStr(raw.metaDesc || ''),
        logoUrl: raw.logoUrl
            ? (raw.logoUrl.startsWith('data:') ? raw.logoUrl : (toAbsUrl(raw.logoUrl, baseUrl) || raw.logoUrl))
            : '',
        faviconUrl: raw.favicon
            ? (toAbsUrl(raw.favicon, baseUrl) || raw.favicon)
            : `${new URL(baseUrl).origin}/favicon.ico`,
        logoFormat: raw.logoFormat || detectLogoFormat(raw.logoUrl),
        logoSource: raw.logoUrl ? (raw.logoFormat === 'favicon-fallback' ? 'favicon-fallback' : 'scraped') : null,
    };

    if (identity.logoUrl) {
        logger.info(`[Scraper] Logo found — format: ${identity.logoFormat} → ${identity.logoUrl.slice(0, 120)}`);
    }

    if (!identity.logoUrl && identity.faviconUrl) {
        identity.logoUrl = identity.faviconUrl;
        identity.logoFormat = detectLogoFormat(identity.faviconUrl) || 'favicon-ico';
        identity.logoSource = 'favicon-fallback';
        logger.info(`[Scraper] Logo not found — using favicon: ${identity.faviconUrl}`);
    }

    // ── Logo Colors ──
    // node-fetch / axios used internally by extractLogoColors
    let logoColors = { primary: null, secondary: null, palette: [], source: null };

    const logoSourceUrl = identity.logoSource !== 'favicon-fallback' ? identity.logoUrl : null;
    const faviconFallback = identity.faviconUrl || null;

    if (logoSourceUrl) {
        try {
            logoColors = await extractLogoColors(logoSourceUrl, null, baseUrl, false);
            logger.info(`[Scraper] Logo colors: primary=${logoColors.primary}, source=${logoColors.source}`);
        } catch (e) {
            logger.warn(`[Scraper] Logo color extraction failed: ${e.message}`);
        }
    }

    if (!logoColors.primary && faviconFallback) {
        try {
            logger.info(`[Scraper] Trying favicon colors: ${faviconFallback}`);
            const favColors = await extractLogoColors(faviconFallback, null, baseUrl, true);
            if (favColors.primary) {
                logoColors = favColors;
                logger.info(`[Scraper] Favicon colors: primary=${logoColors.primary}`);
            }
        } catch (e) {
            logger.warn(`[Scraper] Favicon color extraction failed: ${e.message}`);
        }
    }

    if (!logoColors.primary) {
        const pagePalette = buildPalette(raw);
        if (pagePalette.primary) {
            logoColors = { primary: pagePalette.primary, secondary: pagePalette.secondary || null, palette: pagePalette.palette || [], source: 'css-fallback' };
            logger.info(`[Scraper] Using CSS color as fallback: primary=${logoColors.primary}`);
        }
    }

    // ── Colors ──
    const colors = buildPalette(raw);

    // ── ThemeSystem ──
    const tc = raw.themeColors;
    const norm = normaliseCssColor;
    const themeSystem = {
        button: { background: norm(tc.button?.bg), color: norm(tc.button?.text), border: null },
        header: { background: norm(tc.header?.bg), color: norm(tc.header?.text), border: null, link: null },
        navigation: { background: norm(tc.header?.bg), color: null, active: null },
        footer: { background: norm(tc.footer?.bg), color: norm(tc.footer?.text), border: null, link: null },
        hero: { background: norm(tc.hero?.bg) },
        page: { background: norm(tc.page?.bg) || '#FFFFFF' },
        bodyText: null,
        linkColor: null,
        exactCssVars: colors.exact.cssVariables,
        metaColors: colors.exact.meta,
        exactElements: {},
    };

    // ── Typography ──
    const typography = {
        primaryFont: raw.googleFontFamilies[0] || null,
        headingFont: raw.googleFontFamilies[1] || raw.googleFontFamilies[0] || null,
        bodyFont: null,
        googleFontFamilies: raw.googleFontFamilies,
        bodyFontSize: null,
    };

    const images = (raw.images || []).map(img => ({
        ...img,
        url: img.url.startsWith('inline-svg:') ? img.url : (toAbsUrl(img.url, baseUrl) || img.url),
    }));
    const videos = (raw.videos || []).map(vid => ({ ...vid, url: toAbsUrl(vid.url, baseUrl) || vid.url }));

    const content = raw.content || {};
    const forms = raw.forms || [];

    const sm = raw.seoMeta || {};
    const seo = {
        title: cleanStr(raw.pageTitle || ''),
        metaDescription: sm.description || raw.metaDesc || '',
        metaKeywords: (sm.keywords || '').split(',').map(k => k.trim()).filter(Boolean),
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

    const { industry, subIndustry } = await classifyIndustry(textCorpus);

    const formFields = extractFormFieldsFromHtml(html);
    const durationMs = Date.now() - startedAt;

    if (!identity.logoUrl) logger.warn('[Scraper] logo URL not found');
    if (!identity.name) logger.warn('[Scraper] project name not found');
    if (!colors.primary) logger.warn('[Scraper] primary colour not found');
    if (images.length === 0) logger.warn('[Scraper] no images extracted');
    if (sections.length === 0) logger.warn('[Scraper] no sections detected');
    logger.info(`[Scraper] Completed in ${durationMs}ms — ${images.length} images, ${videos.length} videos, ${sections.length} sections`);

    return {
        identity,
        colors,
        logoColors,
        themeSystem,
        typography,
        images,
        videos,
        content,
        forms,
        formFields,
        seo,
        sections,
        industry,
        subIndustry,
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
            fonts: { googleFontFamilies: typography.googleFontFamilies, primaryFont: typography.primaryFont, headingFont: typography.headingFont },
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
};

/**
 * buildWebsiteProfile — identical to v5; maps scrapeWebsiteStructure output
 * into the Project.websiteProfile shape.
 */
const buildWebsiteProfile = (scraped, themeData = null) => {
    if (!scraped) return null;

    const {
        identity = {}, colors = {}, logoColors = {}, themeSystem = {},
        typography = {}, images = [], videos = [], content = {},
        forms = {}, seo = {}, sections = [],
        industry, subIndustry, scrapedAt, sourceUrl, finalUrl,
    } = scraped;

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
            palette: logoColors.palette || [],
            source: logoColors.source || null,
        },

        industry: {
            industry: industry || '',
            subIndustry: subIndustry || '',
            confidence: null,
            detectedFrom: [],
        },

        colors: {
            primary: primaryColor,
            secondary: secondaryColor,
            accent: accentColor,
            palette: Array.isArray(colors.palette) ? colors.palette : [],
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

            const btnBg = first(exactBtnBg, themeSystem?.button?.background, cssPrimary, metaThemeColor, p);
            const btnText = first(themeSystem?.button?.color, '#ffffff');
            const headerBg = first(exactHeaderBg, themeSystem?.header?.background, themeSystem?.page?.background, '#ffffff');
            const headerText = first(themeSystem?.header?.color, themeSystem?.bodyText, '#212221');
            const navText = first(themeSystem?.header?.link, themeSystem?.linkColor, cssPrimary, headerText);
            const navBg = first(themeSystem?.navigation?.background, headerBg);
            const navActive = first(themeSystem?.navigation?.active, cssPrimary, p);
            const footerBg = first(exactFooterBg, themeSystem?.footer?.background, '#212221');
            const footerText = first(themeSystem?.footer?.color, '#898B8A');

            return {
                header: themeData?.header || { background: headerBg, text: headerText },
                navigation: themeData?.navigation || { background: navBg, text: navText, active: navActive },
                buttons: {
                    primaryBg: btnBg,
                    primaryText: btnText,
                    secondaryBg: first(cssSecondary, sec, p),
                    secondaryText: '#ffffff',
                },
                footer: { background: footerBg, text: footerText },
            };
        })(),

        fonts: {
            primaryFont: typography.primaryFont || '',
            headingFont: typography.headingFont || '',
            googleFonts: Array.isArray(typography.googleFontFamilies) ? typography.googleFontFamilies : [],
            bodyFont: typography.bodyFont || '',
            bodyFontSize: typography.bodyFontSize || '',
        },

        images: (Array.isArray(images) ? images : []).map(img => ({
            url: img.url || '',
            alt: img.alt || '',
            section: img.section || 'unknown',
            width: img.width || null,
            height: img.height || null,
            ...(img.markup ? { markup: img.markup } : {}),
        })),

        videos: (Array.isArray(videos) ? videos : []).map(vid => ({
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
            taglines: Array.isArray(content.taglines) ? content.taglines : [],
            services: (Array.isArray(content.services) ? content.services : []).map(s => ({ title: s.title || '', description: s.description || '', icon: s.icon || '' })),
            features: (Array.isArray(content.features) ? content.features : []).map(f => ({ title: f.title || '', description: f.description || '', icon: f.icon || '' })),
            testimonials: (Array.isArray(content.testimonials) ? content.testimonials : []).map(t => ({ name: t.name || t.author || '', company: t.company || '', text: t.text || '', rating: t.rating || null })),
            ctas: (Array.isArray(content.ctaTexts) ? content.ctaTexts : []).map(text => ({ title: '', description: '', buttonText: text })),
            sectionHeadings: Array.isArray(content.sectionHeadings) ? content.sectionHeadings : [],
        },

        forms: (Array.isArray(forms) ? forms : [])
            .filter(f => Array.isArray(f.fields) && f.fields.length > 0)
            .map((f, i) => ({
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
            keywords: Array.isArray(seo.metaKeywords) ? seo.metaKeywords : [],
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

        sections: (Array.isArray(sections) ? sections : []).map((s, idx) => ({
            type: typeof s === 'string' ? s : (s.type || ''),
            enabled: true,
            order: idx,
            data: typeof s === 'object' ? (s.data || null) : null,
        })),

        extraction: {
            sourceUrl: sourceUrl || '',
            finalUrl: finalUrl || sourceUrl || '',
            scrapedAt: scrapedAt ? new Date(scrapedAt) : new Date(),
            extractionVersion: '6.0',
            durationMs: scraped.durationMs || 0,
        },
    };
};

module.exports = { scrapeWebsiteStructure, buildWebsiteProfile, extractLogoColorsFromUrl: extractLogoColors };