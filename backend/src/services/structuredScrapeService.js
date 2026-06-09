'use strict';

/**
 * structuredScrapeService.js  —  v5 (Puppeteer-powered with exact color extraction + Logo Colors)
 *
 * Uses Puppeteer to fully render pages (JS, lazy-load, CSS-in-JS) before
 * extracting branding data. Falls back to a lightweight axios+cheerio pass
 * if Puppeteer is unavailable.
 *
 * Extraction groups:
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
 *  12. Industry    (keyword-based classification)
 */

const cheerio = require('cheerio');
const axios = require('axios');
const logger = require('../utils/logger');
const { openPage } = require('../utils/puppeteerFetch');
const Anthropic = (() => { try { return require('@anthropic-ai/sdk'); } catch { return null; } })();
// node-vibrant v4: named export { Vibrant }  — v3: default export
// This one-liner handles both versions correctly
const { Vibrant = require('node-vibrant/node') } = require('node-vibrant/node');

/** Promise-based sleep — replaces page.waitForTimeout (removed in Puppeteer v22+) */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const { extractFormFields: extractFormFieldsFromHtml } = require('../utils/formExtractor');

// ─── Helpers ──────────────────────────────────────────────────────────────────

const toAbsUrl = (src, base) => {
    if (!src || src.startsWith('data:')) return null;
    if (src.startsWith('http')) return src;
    if (src.startsWith('//')) return 'https:' + src;
    try { return new URL(src, base).href; } catch { return null; }
};

const cleanStr = (s) => (s || '').trim().replace(/\s+/g, ' ');

/**
 * Extract fill/stroke hex colors directly from raw SVG markup
 */
const extractColorsFromSvgMarkup = (svgMarkup) => {
    const colors = new Set();
    if (!svgMarkup) return [];

    // Match fill="..." or stroke="..."
    const attrRe = /(?:fill|stroke)="(#[0-9a-fA-F]{3,6})"/gi;
    // Match inline styles fill: #... or stroke: #...
    const styleRe = /(?:fill|stroke)\s*:\s*(#[0-9a-fA-F]{3,6})/gi;

    let m;
    while ((m = attrRe.exec(svgMarkup)) !== null) {
        const c = normaliseCssColor(m[1]);
        if (c && !isNeutralHex(c)) colors.add(c);
    }
    while ((m = styleRe.exec(svgMarkup)) !== null) {
        const c = normaliseCssColor(m[1]);
        if (c && !isNeutralHex(c)) colors.add(c);
    }

    // Also check for currentColor references
    if (svgMarkup.includes('currentColor')) {
        // currentColor typically inherits from parent, skip for now
    }

    return Array.from(colors);
};

/**
 * Extract dominant colors specifically from the logo image.
 * Uses axios for the HTTP fetch (no Puppeteer page required) so this works
 * from any call context — scrape pipeline, branding extract-from-website, etc.
 *
 * @param {string} logoUrl   Absolute URL or data URI of the logo
 * @param {object} _page     Unused (kept for signature compatibility)
 * @param {string} baseUrl   Base URL for resolving relative paths
 */
const extractLogoColors = async (logoUrl, page, baseUrl, isFavicon = false) => {
    if (!logoUrl) return { primary: null, secondary: null, palette: [], source: null };

    try {
        let imageBuffer;
        let isSvg = false;
        let svgMarkup = null;

        // ── 1. Data URI (inline SVG or base64 raster) ──
        if (logoUrl.startsWith('data:image/')) {
            const match = logoUrl.match(/^data:([^;]+);base64,(.*)$/);
            if (match) {
                isSvg = match[1].includes('svg');
                imageBuffer = Buffer.from(match[2], 'base64');
                if (isSvg) svgMarkup = imageBuffer.toString('utf8');
            }
        }
        // ── 2. HTTP/HTTPS URL ──
        else {
            // Resolve relative URLs
            let resolvedUrl = logoUrl;
            if (!logoUrl.startsWith('http') && baseUrl) {
                try { resolvedUrl = new URL(logoUrl, baseUrl).toString(); } catch (_) { }
            }

            // ── 2a. Try axios first (fast, no browser overhead) ──
            let axiosFailed = false;
            try {
                const resp = await axios.get(resolvedUrl, {
                    responseType: 'arraybuffer',
                    timeout: 8000,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
                        'Accept': 'image/*,*/*',
                        'Referer': baseUrl || resolvedUrl,
                    },
                    maxRedirects: 5,
                });
                imageBuffer = Buffer.from(resp.data);
                const contentType = (resp.headers['content-type'] || '').toLowerCase();
                isSvg = contentType.includes('svg') || resolvedUrl.toLowerCase().includes('.svg');
                if (isSvg) svgMarkup = imageBuffer.toString('utf8');
            } catch (fetchErr) {
                logger.warn(`[LogoColors] axios fetch failed for ${resolvedUrl}: ${fetchErr.message}`);
                axiosFailed = true;
            }

            // ── 2b. axios failed — use Puppeteer page to fetch (same session, cookies, anti-bot bypass) ──
            if (axiosFailed && page) {
                try {
                    logger.info(`[LogoColors] Retrying via Puppeteer page.evaluate: ${resolvedUrl}`);
                    const b64 = await page.evaluate(async (url) => {
                        try {
                            const res = await fetch(url, { credentials: 'include' });
                            if (!res.ok) return null;
                            const buf = await res.arrayBuffer();
                            const bytes = new Uint8Array(buf);
                            let bin = '';
                            for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
                            return btoa(bin);
                        } catch (e) { return null; }
                    }, resolvedUrl);

                    if (b64) {
                        imageBuffer = Buffer.from(b64, 'base64');
                        isSvg = resolvedUrl.toLowerCase().includes('.svg');
                        if (isSvg) svgMarkup = imageBuffer.toString('utf8');
                        logger.info(`[LogoColors] Puppeteer fetch succeeded for ${resolvedUrl} (${imageBuffer.length} bytes)`);
                    } else {
                        logger.warn(`[LogoColors] Puppeteer fetch returned null for ${resolvedUrl}`);
                        return { primary: null, secondary: null, palette: [], source: null };
                    }
                } catch (pageErr) {
                    logger.warn(`[LogoColors] Puppeteer fetch failed for ${resolvedUrl}: ${pageErr.message}`);
                    return { primary: null, secondary: null, palette: [], source: null };
                }
            } else if (axiosFailed) {
                // No page available and axios failed — nothing we can do
                return { primary: null, secondary: null, palette: [], source: null };
            }
        }

        if (!imageBuffer) {
            logger.warn(`[LogoColors] No image buffer for ${logoUrl}`);
            return { primary: null, secondary: null, palette: [], source: null };
        }

        // ── 3. SVG: extract fill/stroke colors directly, optionally via Vibrant ──
        if (isSvg && svgMarkup) {
            const svgColors = extractColorsFromSvgMarkup(svgMarkup);
            logger.info(`[LogoColors] SVG direct colors: ${svgColors.slice(0, 3).join(', ')}`);

            if (svgColors.length > 0) {
                // Try rendering SVG → PNG → Vibrant for richer palette
                try {
                    const { Resvg } = require('@resvg/resvg-js');
                    const resvg = new Resvg(svgMarkup, { fitTo: { mode: 'width', value: 256 } });
                    const pngBuffer = resvg.render().asPng();
                    const palette = await Vibrant.from(pngBuffer).getPalette();
                    const vibrantColors = Object.values(palette)
                        .filter(s => s && s.hex)
                        .sort((a, b) => (b.population || 0) - (a.population || 0))
                        .map(s => s.hex.toUpperCase());

                    const merged = [...svgColors];
                    for (const vc of vibrantColors) {
                        if (!merged.some(c => c.toLowerCase() === vc.toLowerCase())) merged.push(vc);
                    }
                    return { primary: merged[0] || null, secondary: merged[1] || null, palette: merged.slice(0, 5), source: 'svg-direct' };
                } catch (_) {
                    return { primary: svgColors[0] || null, secondary: svgColors[1] || null, palette: svgColors.slice(0, 5), source: 'svg-direct' };
                }
            }
        }

        // ── 4. Raster image (PNG / JPEG / WebP / ICO …) ──
        const sharp = require('sharp');

        const isIco = (logoUrl || '').toLowerCase().includes('.ico');
        const useFaviconPath = isFavicon || isIco;

        // ── 4a. Favicon / ICO path — pixel frequency counting via sharp raw pixels ──
        // Vibrant.js uses k-means clustering and FAILS on small icons (16–64px).
        // Direct pixel frequency counting is reliable for favicons.
        if (useFaviconPath) {
            try {
                // Convert to raw RGBA pixels — handles ICO multi-frame, WebP, PNG, etc.
                const { data, info } = await sharp(imageBuffer)
                    .resize(64, 64, { fit: 'inside', withoutEnlargement: true })
                    .ensureAlpha()
                    .raw()
                    .toBuffer({ resolveWithObject: true });

                // Count pixel colors, skip transparent/near-transparent pixels
                const colorCount = {};
                for (let i = 0; i < data.length; i += 4) {
                    const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
                    if (a < 30) continue; // skip transparent
                    // Quantize to reduce near-identical colors (round to nearest 8)
                    const rq = Math.round(r / 8) * 8;
                    const gq = Math.round(g / 8) * 8;
                    const bq = Math.round(b / 8) * 8;
                    const hex = '#' + [rq, gq, bq].map(v => Math.min(255, v).toString(16).padStart(2, '0')).join('').toUpperCase();
                    colorCount[hex] = (colorCount[hex] || 0) + 1;
                }

                // Sort by frequency
                const sorted = Object.entries(colorCount)
                    .sort((a, b) => b[1] - a[1])
                    .map(([hex]) => hex);

                // Try non-neutral colors first; if none, accept anything except pure white/black
                const nonNeutral = sorted.filter(c => !isNeutralHex(c));
                let colors = nonNeutral.length > 0
                    ? nonNeutral
                    : sorted.filter(c => c !== '#FFFFFF' && c !== '#000000' && c !== '#FEFEFE' && c !== '#F8F8F8');

                // Deduplicate visually similar colors (within 20 units per channel)
                const deduplicated = [];
                for (const hex of colors) {
                    const r1 = parseInt(hex.slice(1, 3), 16);
                    const g1 = parseInt(hex.slice(3, 5), 16);
                    const b1 = parseInt(hex.slice(5, 7), 16);
                    const isSimilar = deduplicated.some(h => {
                        const r2 = parseInt(h.slice(1, 3), 16);
                        const g2 = parseInt(h.slice(3, 5), 16);
                        const b2 = parseInt(h.slice(5, 7), 16);
                        return Math.abs(r1 - r2) < 20 && Math.abs(g1 - g2) < 20 && Math.abs(b1 - b2) < 20;
                    });
                    if (!isSimilar) deduplicated.push(hex);
                    if (deduplicated.length >= 5) break;
                }

                logger.info(`[LogoColors] Favicon pixel colors: ${deduplicated.slice(0, 3).join(', ')}`);
                if (deduplicated.length > 0) {
                    return {
                        primary: deduplicated[0] || null,
                        secondary: deduplicated[1] || null,
                        palette: deduplicated.slice(0, 5),
                        source: 'favicon-pixel',
                    };
                }
                logger.warn('[LogoColors] Favicon pixel extraction yielded no colors, falling back to Vibrant');
            } catch (pixelErr) {
                logger.warn(`[LogoColors] Favicon pixel extraction failed: ${pixelErr.message}, falling back to Vibrant`);
            }
        }

        // ── 4b. Standard raster path — Vibrant (good for large logos/photos) ──
        try {
            const resizedBuffer = await sharp(imageBuffer)
                .resize(250, 250, { fit: 'inside', withoutEnlargement: true })
                .flatten({ background: '#FFFFFF' })
                .png()
                .toBuffer();

            const palette = await Vibrant.from(resizedBuffer).maxColorCount(64).getPalette();
            const colors = Object.values(palette)
                .filter(s => s && s.hex)
                .sort((a, b) => (b.population || 0) - (a.population || 0))
                .map(s => s.hex.toUpperCase())
                .filter(c => c && !isNeutralHex(c));

            const colorSource = useFaviconPath ? 'favicon-vibrant' : 'vibrant';
            logger.info(`[LogoColors] Vibrant colors (${colorSource}): ${colors.slice(0, 3).join(', ')}`);
            return { primary: colors[0] || null, secondary: colors[1] || null, palette: colors.slice(0, 5), source: colorSource };
        } catch (vibrantErr) {
            logger.warn(`[LogoColors] Vibrant failed: ${vibrantErr.message}`);
            return { primary: null, secondary: null, palette: [], source: null };
        }

    } catch (err) {
        logger.warn(`[LogoColors] Unexpected error: ${err.message}`);
        return { primary: null, secondary: null, palette: [], source: null };
    }
};

// ─── Industry classification ──────────────────────────────────────────────────

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
        const prompt = 'Classify this website into one industry category.\n\nWebsite text:\n' + snippet + '\n\nAvailable categories (industry > subIndustry):\n' + subMap + '\n\nRespond ONLY with valid JSON: {"industry": "...", "subIndustry": "..."}. No explanation.';
        const msg = await client.messages.create({
            model: 'claude-haiku-4-5-20251001',
            max_tokens: 80,
            messages: [{ role: 'user', content: prompt }],
        });
        const text = ((msg.content && msg.content[0] && msg.content[0].text) || '').trim().replace(/```[a-z]*/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(text);
        if (parsed.industry && parsed.subIndustry) return parsed;
    } catch (e) {
        logger.warn('[Industry] AI classify failed: ' + e.message);
    }
    return null;
};

const classifyIndustry = async (textCorpus) => {
    const kwResult = classifyIndustryByKeywords(textCorpus);
    if (kwResult && kwResult.score >= 2) {
        return { industry: kwResult.industry, subIndustry: kwResult.subIndustry };
    }
    const aiResult = await classifyIndustryWithAI(textCorpus);
    if (aiResult) return aiResult;
    if (kwResult) return { industry: kwResult.industry, subIndustry: kwResult.subIndustry };
    return { industry: 'General', subIndustry: 'Business' };
};

// ─── Colour helpers (Node-side, post Puppeteer extraction) ────────────────────

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

/** Normalise any CSS colour string → #RRGGBB or null */
const normaliseCssColor = (raw) => {
    if (!raw) return null;
    const s = raw.trim();
    if (!s || s === 'transparent' || s === 'rgba(0, 0, 0, 0)' || s === 'rgb(0, 0, 0)') return null;

    // hex 3 / 4 / 6 / 8
    const h6 = s.match(/^#([0-9a-fA-F]{6})$/);
    if (h6) return ('#' + h6[1]).toUpperCase();
    const h3 = s.match(/^#([0-9a-fA-F]{3})$/);
    if (h3) return ('#' + h3[1].split('').map(c => c + c).join('')).toUpperCase();
    const h8 = s.match(/^#([0-9a-fA-F]{8})$/);
    if (h8) return ('#' + h8[1].slice(0, 6)).toUpperCase();

    // rgb / rgba
    const rgb = s.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
    if (rgb) {
        const [, r, g, b] = rgb.map(Number);
        return ('#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')).toUpperCase();
    }

    // hsl / hsla (approximate)
    const hsl = s.match(/hsla?\(\s*([\d.]+)\s*,\s*([\d.]+)%?\s*,\s*([\d.]+)%?/);
    if (hsl) {
        let [h, sat, l] = [parseFloat(hsl[1]), parseFloat(hsl[2]) / 100, parseFloat(hsl[3]) / 100];
        const k = n => { const kk = (n + h / 30) % 12; const a2 = sat * Math.min(l, 1 - l); return l - a2 * Math.max(-1, Math.min(kk - 3, 9 - kk, 1)); };
        return ('#' + [0, 8, 4].map(n => Math.round(k(n) * 255).toString(16).padStart(2, '0')).join('')).toUpperCase();
    }

    return null;
};

// ─── Section keywords ─────────────────────────────────────────────────────────

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

// ─── The big in-browser extraction function (runs inside page.evaluate) ───────

/* eslint-disable no-undef */
const IN_BROWSER_EXTRACTOR = async () => {
    // ─── Define SECTION_KEYWORDS at the very beginning ───
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

    /* ── helpers ── */
    const cleanText = (s) => (s || '').trim().replace(/\s+/g, ' ');

    const isVisible = (el) => {
        if (!el) return false;
        const s = window.getComputedStyle(el);
        if (s.display === 'none' || s.visibility === 'hidden' || s.opacity === '0') return false;
        const r = el.getBoundingClientRect();
        return r.width > 0 || r.height > 0;
    };

    const getStyle = (el, prop) => {
        if (!el) return null;
        const v = window.getComputedStyle(el).getPropertyValue(prop).trim();
        return (v && v !== 'transparent' && v !== 'rgba(0, 0, 0, 0)') ? v : null;
    };

    const findFirstVisible = (selectors) => {
        for (const sel of selectors) {
            for (const node of Array.from(document.querySelectorAll(sel))) {
                if (isVisible(node)) return node;
            }
        }
        return null;
    };

    const getRealSrc = (el) => {
        if (!el) return null;
        return el.getAttribute('data-src') ||
            el.getAttribute('data-lazy-src') ||
            el.getAttribute('data-original') ||
            el.getAttribute('data-lazy') ||
            el.getAttribute('srcset')?.split(/[\s,]+/)?.[0] ||
            el.getAttribute('src') || null;
    };

    const toAbs = (src) => {
        if (!src || src.startsWith('data:')) return null;
        try { return new URL(src, location.href).href; } catch { return null; }
    };

    const mostFrequent = (arr) => {
        const counts = {};
        for (const v of arr) { if (v) counts[v] = (counts[v] || 0) + 1; }
        return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || null;
    };

    /* ── Extract exact CSS variables and computed colors ── */
    const getExactStyles = () => {
        const exactColors = {
            cssVariables: {},
            elements: {},
            meta: {}
        };

        // Extract CSS custom properties (variables)
        const stylesheets = document.styleSheets;
        const cssVarRegex = /--([a-zA-Z][a-zA-Z0-9-]*)\s*:\s*([^;]+)/g;

        try {
            for (const sheet of stylesheets) {
                try {
                    const rules = sheet.cssRules || sheet.rules;
                    if (!rules) continue;

                    for (const rule of rules) {
                        if (rule.style && rule.selectorText) {
                            const styleText = rule.style.cssText;
                            let match;
                            cssVarRegex.lastIndex = 0;
                            while ((match = cssVarRegex.exec(styleText)) !== null) {
                                const varName = match[1];
                                const varValue = match[2].trim();
                                exactColors.cssVariables[varName] = varValue;
                            }
                        }
                    }
                } catch (e) {
                    // Cross-origin stylesheet - skip
                }
            }
        } catch (e) { }

        // Extract from specific high-value elements
        const importantSelectors = [
            { name: 'primaryBrand', selectors: ['.btn-primary', '.button-primary', '[class*="primary"]', '.cta-button', '.hero .btn'] },
            { name: 'secondaryBrand', selectors: ['.btn-secondary', '.button-secondary', '[class*="secondary"]'] },
            { name: 'accentBrand', selectors: ['.accent', '[class*="accent"]', '.highlight'] },
            { name: 'headerBrand', selectors: ['header', '.header', '.site-header', 'nav', '.navbar'] },
            { name: 'footerBrand', selectors: ['footer', '.footer', '.site-footer'] },
            { name: 'linkBrand', selectors: ['a:not(button a)', '.nav-link', '.menu-link'] }
        ];

        for (const item of importantSelectors) {
            for (const selector of item.selectors) {
                const el = document.querySelector(selector);
                if (el && isVisible(el)) {
                    const bgColor = getStyle(el, 'background-color');
                    const color = getStyle(el, 'color');
                    if (bgColor && !exactColors.elements[item.name]) {
                        exactColors.elements[`${item.name}Bg`] = bgColor;
                    }
                    if (color && !exactColors.elements[`${item.name}Text`]) {
                        exactColors.elements[`${item.name}Text`] = color;
                    }
                }
            }
        }

        // Extract meta theme colors
        const metaTheme = document.querySelector('meta[name="theme-color"]');
        if (metaTheme) exactColors.meta.themeColor = metaTheme.content;

        const metaMsTile = document.querySelector('meta[name="msapplication-TileColor"]');
        if (metaMsTile) exactColors.meta.msTileColor = metaMsTile.content;

        const metaOgColor = document.querySelector('meta[property="og:color"]');
        if (metaOgColor) exactColors.meta.ogColor = metaOgColor.content;

        return exactColors;
    };

    /* ── 1. Identity ── */
    const pageTitle = cleanText(document.title);
    const metaDesc = document.querySelector('meta[name="description"]')?.content ||
        document.querySelector('meta[property="og:description"]')?.content || '';
    const ogTitle = document.querySelector('meta[property="og:title"]')?.content || '';

    // ── Logo extraction — all image formats + SVG inline + favicon fallback ──────
    const LOGO_IMAGE_EXTS = /\.(jpe?g|png|gif|bmp|webp|tiff?|svg|ai|eps|apng|raw|cr2|nef|arw)(\?.*)?$/i;

    const isSupportedImageSrc = (src) => {
        if (!src) return false;
        if (src.startsWith('data:image/')) return true;
        try {
            const path = new URL(src, location.href).pathname;
            return LOGO_IMAGE_EXTS.test(path);
        } catch {
            return LOGO_IMAGE_EXTS.test(src);
        }
    };

    const extractBgImageUrl = (el) => {
        try {
            const bg = window.getComputedStyle(el).backgroundImage;
            const m = bg && bg.match(/url\(["']?([^"')]+)["']?\)/);
            return m ? m[1] : null;
        } catch { return null; }
    };

    // Helper to fetch SVG content and convert to data URI
    const fetchSvgAsDataUri = async (url) => {
        try {
            const response = await fetch(url);
            const svgText = await response.text();
            // Check if it's valid SVG
            if (svgText.trim().startsWith('<svg')) {
                const base64 = btoa(unescape(encodeURIComponent(svgText)));
                return `data:image/svg+xml;base64,${base64}`;
            }
        } catch (e) {
            console.warn('Failed to fetch SVG:', e);
        }
        return null;
    };

    const LOGO_SELECTORS = [
        // ── Tier 1: Explicit logo-named SVGs (highest confidence, catches Apple-style inline SVG logos) ──
        'svg.logo', 'svg[class*="logo" i]', 'svg[id*="logo" i]',
        '.logo svg', '.navbar-brand svg', '.site-logo svg', '.header-logo svg', '.brand svg',
        'a[href="/"] svg',
        // Generic header/nav SVG — catches bare SVG logos in header/nav (Apple, etc.)
        'header svg', 'nav svg', '.navbar svg', '.site-header svg',
        // ── Tier 2: Explicit logo-named IMGs ──
        'img.logo', 'img[alt*="logo" i]', 'img[id*="logo" i]', 'img[class*="logo" i]',
        'img[src*="logo" i]',
        '.logo img', '.navbar-brand img', '.site-logo img', '.header-logo img',
        'a.logo', '.logo', '.navbar-brand', '.site-logo', '.header-logo',
        '.brand img',
        'a[href="/"] img',
        // ── Tier 3: Generic header/nav IMG — only after all named+SVG checks ──
        'header img', 'nav img', '.navbar img', '.site-header img',
        // ── Tier 4: Last resort ──
        'meta[property="og:image"]',
    ];

    let logoUrl = null;
    let logoFormat = null;

    for (const sel of LOGO_SELECTORS) {
        const el = document.querySelector(sel);
        if (!el || !isVisible(el)) continue;

        if (el.tagName === 'IMG') {
            const src = getRealSrc(el);
            const absSrc = toAbs(src);

            // FIX: also handle data: URIs that toAbs() drops (e.g. Apple's inline SVG logo)
            if (!absSrc && src && src.startsWith('data:image/')) {
                logoUrl = src;
                logoFormat = src.startsWith('data:image/svg') ? 'svg-inline' : 'data-uri';
                break;
            }

            // Check if it's an SVG file
            if (absSrc && (absSrc.toLowerCase().includes('.svg') || absSrc.toLowerCase().includes('.svg?'))) {
                try {
                    const svgDataUri = await fetchSvgAsDataUri(absSrc);
                    if (svgDataUri) {
                        logoUrl = svgDataUri;
                        logoFormat = 'svg-url-to-datauri';
                        break;
                    }
                } catch (e) {
                    // Fallback to original URL
                }
            }

            if (absSrc && isSupportedImageSrc(absSrc)) {
                logoUrl = absSrc;
                logoFormat = absSrc.toLowerCase().includes('.svg') ? 'svg-url' : 'raster-url';
                break;
            }

        } else if (el.tagName === 'SVG') {
            // Inline <svg> — serialize to base64 data URI with proper UTF-8 handling
            const svgHtml = el.outerHTML;
            // Fix: Use a chunk-based approach to avoid call stack overflow on large SVGs.
            // btoa(String.fromCharCode(...largeUint8Array)) blows the stack when the array
            // has tens of thousands of entries; iterate in chunks instead.
            const utf8Bytes = new TextEncoder().encode(svgHtml);
            let binary = '';
            const CHUNK = 8192;
            for (let i = 0; i < utf8Bytes.length; i += CHUNK) {
                binary += String.fromCharCode(...utf8Bytes.subarray(i, i + CHUNK));
            }
            const base64 = btoa(binary);
            logoUrl = `data:image/svg+xml;base64,${base64}`;
            logoFormat = 'svg-inline';
            break;

        } else if (el.tagName === 'META') {
            const content = el.getAttribute('content');
            const abs = toAbs(content);
            if (abs && isSupportedImageSrc(abs)) {
                logoUrl = abs;
                logoFormat = 'og-image';
                break;
            }

        } else {
            // Container element - try CSS background-image
            const bg = extractBgImageUrl(el);
            if (bg) {
                const abs = toAbs(bg);
                if (abs && isSupportedImageSrc(abs)) {
                    logoUrl = abs;
                    logoFormat = 'css-background';
                    break;
                }
            }
            const nestedImg = el.querySelector('img');
            if (nestedImg && isVisible(nestedImg)) {
                const src = toAbs(getRealSrc(nestedImg));
                if (src && isSupportedImageSrc(src)) {
                    logoUrl = src;
                    logoFormat = src.toLowerCase().includes('.svg') ? 'svg-url' : 'raster-url';
                    break;
                }
            }
        }
    }

    // ── Favicon extraction ──
    let favicon = null;
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

    for (const selector of faviconSelectors) {
        const el = document.querySelector(selector);
        if (el) {
            favicon = el.getAttribute('href') || el.getAttribute('content');
            if (favicon) break;
        }
    }
    if (!favicon || favicon === '') {
        favicon = location.origin + '/favicon.ico';
    }
    favicon = toAbs(favicon);

    // If no logo found, fall back to favicon
    if (!logoUrl && favicon) {
        logoUrl = favicon;
        logoFormat = 'favicon-fallback';
    }

    /* ── 2. Theme / computed colours with exact extraction ── */
    const exactColors = getExactStyles();

    const headerSelectors = [
        'header', 'nav', '.navbar', '.site-header', '.main-header', '.topbar', '.header',
        '#masthead', '#site-header', '#header', '#top-bar', '.wp-block-template-part',
        '#main-header', '.ast-header-html-markup', '.hfeed > header',
        '[class*="header"]', '[id*="header"]',
    ];
    const footerSelectors = [
        'footer', '.footer', '.site-footer', '.page-footer', '.footer-section',
        '#colophon', '#site-footer', '#footer', '.wp-block-template-part[class*="footer"]',
        '.footer-widget-area', '.ast-footer-html-markup',
        '[class*="footer"]', '[id*="footer"]',
    ];
    const buttonSelectors = [
        '.btn-primary', 'button.primary', '.button-primary', '.cta-btn', '.btn-cta',
        '.wp-block-button__link', '.wc-block-components-button', '.elementor-button',
        '.ast-button', '.et_pb_button', '.fl-button',
        '.btn', 'button[type="submit"]', 'a.button', 'input[type="submit"]',
        'button', 'a[class*="btn"]', 'a[class*="button"]',
    ];
    const heroSelectors = [
        '.hero', '.banner', '.hero-section', '.top-section', '.hero-banner', '.main-hero',
        '.wp-block-cover', '.elementor-section.elementor-top-section:first-of-type',
        '.et_pb_section:first-of-type', '.fl-builder-content > .fl-row:first-of-type',
        '[class*="hero"]', '[class*="banner"]', '[class*="cover"]',
    ];

    const headerEl = findFirstVisible(headerSelectors);
    const footerEl = findFirstVisible(footerSelectors);
    const buttonEl = findFirstVisible(buttonSelectors);
    const heroEl = findFirstVisible(heroSelectors);

    const sampleColors = (selectors, property, limit = 30) => {
        const out = [];
        for (const sel of selectors) {
            for (const node of Array.from(document.querySelectorAll(sel))) {
                if (!isVisible(node)) continue;
                const v = getStyle(node, property);
                if (v) out.push(v);
                if (out.length >= limit) return out;
            }
        }
        return out;
    };

    const inheritedBg = (el, maxDepth = 6) => {
        let cur = el;
        for (let i = 0; i < maxDepth && cur && cur !== document.body; i++) {
            const v = getStyle(cur, 'background-color');
            if (v) return v;
            cur = cur.parentElement;
        }
        return null;
    };

    const rawHeaderBg = getStyle(headerEl, 'background-color') || inheritedBg(headerEl);
    const rawFooterBg = getStyle(footerEl, 'background-color') || inheritedBg(footerEl);
    const rawButtonBg = getStyle(buttonEl, 'background-color');
    const rawButtonText = getStyle(buttonEl, 'color');

    const themeColors = {
        header: {
            bg: rawHeaderBg,
            text: getStyle(headerEl, 'color'),
            border: getStyle(headerEl, 'border-color'),
            link: mostFrequent(sampleColors([
                'nav a', 'header a', '.navbar a', '.nav-link', '.menu-item a',
                '#masthead a', '.site-navigation a', '.main-navigation a',
                '[class*="nav"] a', '[class*="menu"] a',
            ], 'color', 40)),
        },
        footer: {
            bg: rawFooterBg,
            text: getStyle(footerEl, 'color'),
            border: getStyle(footerEl, 'border-color'),
            link: mostFrequent(sampleColors([
                'footer a', '.footer a', '#colophon a', '#site-footer a',
                '[class*="footer"] a',
            ], 'color', 20)),
        },
        button: {
            bg: rawButtonBg,
            text: rawButtonText,
            border: getStyle(buttonEl, 'border-color'),
        },
        hero: { bg: getStyle(heroEl, 'background-color') || inheritedBg(heroEl) },
        page: { bg: getStyle(document.body, 'background-color') },
        bodyText: mostFrequent(sampleColors(['p', 'span', 'li', 'body'], 'color', 40)),
        linkColor: mostFrequent(sampleColors([
            'a', 'nav a', '.nav-link', '.menu-item a',
            'header a', '[class*="nav"] a',
        ], 'color', 40)),
        exact: exactColors
    };

    const allBgs = sampleColors(['section', 'div', 'header', 'footer', 'nav', 'main', 'article'], 'background-color', 80);
    const allTexts = sampleColors(['h1', 'h2', 'h3', 'p', 'a', 'button', '.btn', 'span'], 'color', 80);
    const allBorders = sampleColors(['*'], 'border-color', 40);

    /* ── 3. Typography ── */
    const googleFontLinks = Array.from(document.querySelectorAll('link[href*="fonts.googleapis.com"]')).map(l => l.href);
    const googleFontFamilies = [...new Set(googleFontLinks.flatMap(href => {
        try {
            const fp = new URL(href).searchParams.get('family');
            return fp ? fp.split('|').map(f => f.split(':')[0].replace(/\+/g, ' ').trim()) : [];
        } catch { return []; }
    }))];

    const bodyFontFamily = getStyle(document.body, 'font-family');
    const headingEl = findFirstVisible(['h1', 'h2', 'h3']);
    const headingFontFamily = getStyle(headingEl, 'font-family');
    const bodyFontSize = getStyle(document.body, 'font-size');

    /* ── 4. Images ── */
    const UNWANTED = /icon|sprite|tracking|pixel|beacon|analytics|1x1|spacer|dot\.gif|clear\.gif|favicon|loading|spinner|arrow|bullet|check[^o]|close|hamburger/i;

    const getSectionForEl = (el) => {
        let cur = el.parentElement;
        for (let i = 0; i < 8 && cur; i++) {
            const combined = ((cur.className || '') + ' ' + (cur.id || '')).toLowerCase();
            for (const [sec, kws] of Object.entries({
                hero: ['hero', 'banner', 'jumbotron', 'splash'],
                about: ['about', 'our-story', 'mission'],
                services: ['service', 'offering', 'solution'],
                features: ['feature', 'benefit', 'why-us'],
                testimonials: ['testimonial', 'review', 'feedback'],
                pricing: ['pricing', 'price', 'plan'],
                contact: ['contact', 'reach'],
                footer: ['footer'],
            })) {
                if (kws.some(k => combined.includes(k))) return sec;
            }
            cur = cur.parentElement;
        }
        return 'unknown';
    };

    const images = [];
    const seenImgUrls = new Set();
    for (const img of Array.from(document.querySelectorAll('img'))) {
        const src = getRealSrc(img);
        const url = toAbs(src);
        if (!url || seenImgUrls.has(url)) continue;
        if (UNWANTED.test(url)) continue;
        const w = img.naturalWidth || parseInt(img.getAttribute('width') || '0');
        const h = img.naturalHeight || parseInt(img.getAttribute('height') || '0');
        if ((w > 0 && w < 50) || (h > 0 && h < 50)) continue;
        const alt = cleanText(img.alt);
        images.push({ url, alt, width: w || null, height: h || null, section: getSectionForEl(img) });
        seenImgUrls.add(url);
    }
    for (const el of Array.from(document.querySelectorAll('[style*="background-image"], [style*="background"]'))) {
        const style = el.getAttribute('style') || '';
        const m = style.match(/url\(['"]?([^'")\s]+)['"]?\)/);
        if (!m) continue;
        const url = toAbs(m[1]);
        if (!url || seenImgUrls.has(url) || url.startsWith('data:')) continue;
        images.push({ url, alt: 'background', width: null, height: null, section: getSectionForEl(el) });
        seenImgUrls.add(url);
    }

    /* ── 5. Videos ── */
    const videos = [];
    for (const vid of Array.from(document.querySelectorAll('video'))) {
        const src = toAbs(vid.getAttribute('src'));
        const poster = toAbs(vid.getAttribute('poster'));
        if (src) videos.push({ url: src, platform: 'html5', videoId: null, poster: poster || null, section: getSectionForEl(vid) });
    }
    for (const iframe of Array.from(document.querySelectorAll('iframe'))) {
        const src = iframe.getAttribute('src') || '';
        if (!src) continue;
        if (src.includes('youtube.com') || src.includes('youtu.be')) {
            const m = src.match(/(?:youtube\.com\/embed\/|youtu\.be\/)([^/?&]+)/);
            videos.push({ url: toAbs(src) || src, platform: 'youtube', videoId: m?.[1] || null, poster: null, section: getSectionForEl(iframe) });
        } else if (src.includes('vimeo.com')) {
            const m = src.match(/vimeo\.com\/(\d+)/);
            videos.push({ url: toAbs(src) || src, platform: 'vimeo', videoId: m?.[1] || null, poster: null, section: getSectionForEl(iframe) });
        }
    }

    /* ── 6. Content ── */
    let heroHeading = '', heroSubheading = '';
    const heroSels = ['.hero', 'header', '.banner', '[class*="hero"]', '[class*="banner"]', 'main', 'body'];
    for (const sel of heroSels) {
        const el = document.querySelector(sel);
        if (!el) continue;
        const h1 = cleanText(el.querySelector('h1')?.textContent);
        const h2 = cleanText(el.querySelector('h2')?.textContent);
        if (!heroHeading && h1 && h1.length > 5) heroHeading = h1;
        if (!heroSubheading && h2 && h2.length > 5) heroSubheading = h2;
        if (heroHeading && heroSubheading) break;
    }
    if (!heroHeading) heroHeading = cleanText(document.querySelector('h1')?.textContent || '');

    const services = [];
    for (const el of Array.from(document.querySelectorAll('[class*="service" i], [class*="Service"]'))) {
        const h = cleanText(el.querySelector('h1,h2,h3,h4,h5')?.textContent);
        const d = cleanText(el.querySelector('p')?.textContent);
        if (h && !services.find(s => s.title === h)) services.push({ title: h, description: d || '' });
        if (services.length >= 15) break;
    }

    const features = [];
    for (const el of Array.from(document.querySelectorAll('[class*="feature" i], [class*="Feature"]'))) {
        const h = cleanText(el.querySelector('h1,h2,h3,h4,h5')?.textContent);
        const d = cleanText(el.querySelector('p')?.textContent);
        if (h && !features.find(f => f.title === h)) features.push({ title: h, description: d || '' });
        if (features.length >= 15) break;
    }

    const testimonials = [];
    for (const el of Array.from(document.querySelectorAll('[class*="testimonial" i], [class*="review" i], [class*="feedback" i]'))) {
        const text = cleanText(el.querySelector('p, blockquote, [class*="text" i], [class*="content" i]')?.textContent);
        const author = cleanText(el.querySelector('[class*="author" i], [class*="name" i], [class*="person" i], cite')?.textContent);
        const company = cleanText(el.querySelector('[class*="company" i], [class*="org" i], [class*="designation" i]')?.textContent);
        const ratingEl = el.querySelector('[class*="rating" i], [class*="star" i]');
        const rating = ratingEl ? parseFloat(ratingEl.getAttribute('data-rating') || ratingEl.textContent) || null : null;
        if (text && text.length > 20 && !testimonials.find(t => t.text === text)) {
            testimonials.push({ text, name: author || 'Anonymous', company: company || '', rating });
        }
        if (testimonials.length >= 10) break;
    }

    const ctaTexts = [];
    for (const el of Array.from(document.querySelectorAll('button, a[href], [class*="cta" i], [class*="btn" i]'))) {
        const txt = cleanText(el.textContent);
        const cls = (el.className || '').toString().toLowerCase();
        if (txt.length > 2 && txt.length < 60 && (cls.includes('cta') || cls.includes('btn') || cls.includes('button'))) {
            if (!ctaTexts.includes(txt)) ctaTexts.push(txt);
        }
        if (ctaTexts.length >= 10) break;
    }

    const taglines = [];
    for (const el of Array.from(document.querySelectorAll('[class*="tagline" i], [class*="headline" i], [class*="slogan" i], [class*="subheading" i]'))) {
        const txt = cleanText(el.textContent);
        if (txt.length > 5 && txt.length < 150 && !taglines.includes(txt)) taglines.push(txt);
        if (taglines.length >= 8) break;
    }

    const sectionHeadings = [];
    for (const el of Array.from(document.querySelectorAll('h2, h3'))) {
        const txt = cleanText(el.textContent);
        if (txt.length > 5 && txt.length < 150 && !sectionHeadings.includes(txt)) sectionHeadings.push(txt);
        if (sectionHeadings.length >= 25) break;
    }

    /* ── 7. Forms ── */
    const forms = [];
    for (const formEl of Array.from(document.querySelectorAll('form'))) {
        const fields = [];
        for (const fieldEl of Array.from(formEl.querySelectorAll('input, select, textarea'))) {
            const type = fieldEl.getAttribute('type') || fieldEl.tagName.toLowerCase();
            if (['hidden', 'submit', 'button', 'reset', 'image'].includes(type)) continue;
            const name = fieldEl.getAttribute('name') || fieldEl.getAttribute('id') || '';
            const ph = fieldEl.getAttribute('placeholder') || '';
            const label = (() => {
                const lid = fieldEl.getAttribute('id');
                if (lid) {
                    const lel = document.querySelector(`label[for="${lid}"]`);
                    if (lel) return cleanText(lel.textContent);
                }
                const parentLabel = fieldEl.closest('label');
                if (parentLabel) return cleanText(parentLabel.textContent);
                const prev = fieldEl.previousElementSibling;
                if (prev && prev.tagName === 'LABEL') return cleanText(prev.textContent);
                return '';
            })();
            fields.push({ name: name || `field_${fields.length}`, label: label || ph, type, placeholder: ph, required: fieldEl.hasAttribute('required') });
        }
        if (fields.length > 0) {
            forms.push({ action: formEl.getAttribute('action') || '', method: (formEl.getAttribute('method') || 'POST').toUpperCase(), fields });
        }
    }

    /* ── 8. SEO ── */
    const seoMeta = {};
    for (const el of Array.from(document.querySelectorAll('meta'))) {
        const prop = el.getAttribute('property') || '';
        const name = el.getAttribute('name') || '';
        const content = el.getAttribute('content') || '';
        if (prop.startsWith('og:')) seoMeta['og_' + prop.slice(3)] = content;
        if (name.startsWith('twitter:')) seoMeta['tw_' + name.slice(8)] = content;
        if (name === 'description') seoMeta.description = content;
        if (name === 'keywords') seoMeta.keywords = content;
        if (name === 'robots') seoMeta.robots = content;
        if (name === 'theme-color') seoMeta.themeColor = content;
        if (prop === 'theme-color') seoMeta.themeColor = seoMeta.themeColor || content;
    }
    const canonical = document.querySelector('link[rel="canonical"]')?.href || location.href;

    /* ── 9. Detected sections using SECTION_KEYWORDS ── */
    const foundSections = new Set();
    for (const el of Array.from(document.querySelectorAll('section, article, div[id], div[class], header, footer, nav, main'))) {
        const combined = ((el.className || '') + ' ' + (el.id || '')).toLowerCase();
        for (const [sec, kws] of Object.entries(SECTION_KEYWORDS)) {
            if (kws.some(k => combined.includes(k))) foundSections.add(sec);
        }
    }

    return {
        pageTitle, metaDesc, ogTitle,
        logoUrl, logoFormat, favicon,
        themeColors, allBgs, allTexts, allBorders,
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
/* eslint-enable no-undef */

// ─── Post-process extracted data (Node-side) ──────────────────────────────────

const buildPalette = (raw) => {
    const { themeColors, allBgs, allTexts, allBorders, seoMeta } = raw;

    // First priority: exact CSS variables and meta tags
    const exactColors = themeColors?.exact || {};
    const cssVars = exactColors.cssVariables || {};
    const metaColors = exactColors.meta || {};

    // Look for common primary/secondary variable names
    let exactPrimary = null;
    let exactSecondary = null;

    const primaryVarNames = ['primary', 'brand', 'theme', 'main', 'color-primary', 'brand-primary', '--primary', '--brand', '--theme-color'];
    const secondaryVarNames = ['secondary', 'accent', 'color-secondary', 'brand-secondary', '--secondary', '--accent'];

    for (const [varName, colorValue] of Object.entries(cssVars)) {
        const lowerName = varName.toLowerCase();
        if (!exactPrimary && primaryVarNames.some(p => lowerName.includes(p))) {
            exactPrimary = normaliseCssColor(colorValue);
        }
        if (!exactSecondary && secondaryVarNames.some(p => lowerName.includes(p))) {
            exactSecondary = normaliseCssColor(colorValue);
        }
    }

    // Meta theme colors (high priority)
    const metaPrimary = normaliseCssColor(metaColors.themeColor);
    const metaSecondary = normaliseCssColor(metaColors.msTileColor);

    // Collect all candidates
    const candidates = [
        exactPrimary || metaPrimary,
        themeColors.button?.bg,
        themeColors.header?.bg,
        themeColors.footer?.bg,
        themeColors.hero?.bg,
        themeColors.header?.link,
        themeColors.linkColor,
        themeColors.bodyText,
        exactSecondary || metaSecondary,
        ...allBgs,
        ...allTexts,
        ...allBorders,
    ]
        .map(normaliseCssColor)
        .filter(Boolean)
        .filter(c => !isNeutralHex(c));

    const palette = [...new Set(candidates)].slice(0, 20);

    const primary = exactPrimary || metaPrimary || palette[0] || '#333333';
    const secondary = exactSecondary || metaSecondary || palette.find(c => c !== primary) || '#555555';
    const accent = palette.find(c => c !== primary && c !== secondary) || '#888888';

    return { primary, secondary, accent, palette, exact: { cssVariables: cssVars, meta: metaColors } };
};

// ─── Main export ──────────────────────────────────────────────────────────────

const scrapeWebsiteStructure = async (websiteUrl) => {
    const startedAt = Date.now();
    let browser, page, finalUrl;

    try {
        logger.info(`[Scraper] Starting Puppeteer scrape for ${websiteUrl}`);

        const result = await openPage(websiteUrl, { waitUntil: 'networkidle2', timeout: 45000 })
            .catch(async (err) => {
                logger.warn(`[Scraper] networkidle2 failed (${err.message}), retrying with domcontentloaded`);
                return openPage(websiteUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
            });

        browser = result.browser;
        page = result.page;
        finalUrl = result.finalUrl;

        await sleep(1500);

        await page.evaluate(() => {
            return new Promise((resolve) => {
                let totalHeight = 0;
                const dist = 400;
                const timer = setInterval(() => {
                    window.scrollBy(0, dist);
                    totalHeight += dist;
                    if (totalHeight >= Math.min(document.body.scrollHeight, 6000)) {
                        clearInterval(timer);
                        window.scrollTo(0, 0);
                        resolve();
                    }
                }, 120);
            });
        }).catch(() => { });

        await sleep(800);

        const raw = await page.evaluate(IN_BROWSER_EXTRACTOR);
        const html = await page.content();
        const $ = cheerio.load(html);
        const baseUrl = finalUrl || websiteUrl;

        // ── Supported logo image extensions (server-side mirror of browser constant) ──
        const LOGO_IMG_EXTS = /\.(jpe?g|png|gif|bmp|webp|tiff?|svg|ai|eps|apng|raw|cr2|nef|arw)(\?.*)?$/i;

        const detectLogoFormat = (url) => {
            if (!url) return null;
            if (url.startsWith('data:image/svg')) return 'svg-inline';
            if (url.startsWith('data:image/')) return 'data-uri';
            const m = url.match(LOGO_IMG_EXTS);
            return m ? m[1].toLowerCase() : 'unknown';
        };

        // Identity
        const identity = {
            name: cleanStr(raw.pageTitle || raw.ogTitle || ''),
            description: cleanStr(raw.metaDesc || ''),
            logoUrl: raw.logoUrl
                ? (raw.logoUrl.startsWith('data:') ? raw.logoUrl : (toAbsUrl(raw.logoUrl, baseUrl) || raw.logoUrl))
                : '',
            faviconUrl: raw.favicon ? toAbsUrl(raw.favicon, baseUrl) || raw.favicon
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
            logger.info(`[Scraper] Logo not found — using favicon as Project Logo: ${identity.faviconUrl}`);
        }

        // ── Extract Logo Colors ──
        // Priority: real logo → favicon fallback.
        // page object passed so Puppeteer fetch can be used if axios is blocked.
        let logoColors = { primary: null, secondary: null, palette: [], source: null };

        const logoSourceUrl = identity.logoSource !== 'favicon-fallback' ? identity.logoUrl : null;
        const faviconFallback = identity.faviconUrl || null;

        if (logoSourceUrl) {
            // ── Case 1: Real logo found ──
            try {
                logoColors = await extractLogoColors(logoSourceUrl, page, baseUrl, false);
                logger.info(`[Scraper] Logo colors extracted: primary=${logoColors.primary}, secondary=${logoColors.secondary}, source=${logoColors.source}`);
            } catch (logoErr) {
                logger.warn(`[Scraper] Logo color extraction failed (non-fatal): ${logoErr.message}`);
            }
        }

        // ── Case 2: Logo extraction failed or no logo — try favicon ──
        if (!logoColors.primary && faviconFallback) {
            try {
                logger.info(`[Scraper] Attempting color extraction from favicon: ${faviconFallback}`);
                const favColors = await extractLogoColors(faviconFallback, page, baseUrl, true);
                if (favColors.primary) {
                    logoColors = favColors;
                    logger.info(`[Scraper] Favicon colors extracted: primary=${logoColors.primary}, secondary=${logoColors.secondary}, source=${logoColors.source}`);
                } else {
                    logger.warn('[Scraper] Favicon color extraction returned no colors');
                }
            } catch (favErr) {
                logger.warn(`[Scraper] Favicon color extraction failed (non-fatal): ${favErr.message}`);
            }
        }

        // ── Case 3: Last resort — pull primary color from CSS/page palette ──
        if (!logoColors.primary) {
            const pagePalette = buildPalette(raw);
            if (pagePalette.primary) {
                logoColors = {
                    primary: pagePalette.primary,
                    secondary: pagePalette.secondary || null,
                    palette: pagePalette.palette || [],
                    source: 'css-fallback',
                };
                logger.info(`[Scraper] Using CSS page color as fallback: primary=${logoColors.primary}`);
            } else {
                logger.warn('[Scraper] No colors extracted from logo, favicon, or CSS');
            }
        }

        // Colors with exact extraction
        const colors = buildPalette(raw);

        // ThemeSystem — normalised computed colours per UI region
        const tc = raw.themeColors;
        const norm = normaliseCssColor;
        const themeSystem = {
            button: { background: norm(tc.button?.bg), color: norm(tc.button?.text), border: norm(tc.button?.border) },
            header: { background: norm(tc.header?.bg), color: norm(tc.header?.text), border: norm(tc.header?.border), link: norm(tc.header?.link) },
            navigation: { background: norm(tc.header?.bg), color: norm(tc.header?.link), active: null },
            footer: { background: norm(tc.footer?.bg), color: norm(tc.footer?.text), border: norm(tc.footer?.border), link: norm(tc.footer?.link) },
            hero: { background: norm(tc.hero?.bg) },
            page: { background: norm(tc.page?.bg) || '#FFFFFF' },
            bodyText: norm(tc.bodyText),
            linkColor: norm(tc.linkColor),
            exactCssVars: colors.exact.cssVariables,
            metaColors: colors.exact.meta,
            exactElements: Object.fromEntries(
                Object.entries(colors.exact.elements || {}).map(([k, v]) => [k, norm(v)])
            ),
        };

        // Typography
        const typography = {
            primaryFont: raw.googleFontFamilies[0] || cleanStr(raw.bodyFontFamily || '').split(',')[0].replace(/['"]/g, '').trim() || null,
            headingFont: raw.googleFontFamilies[1] || raw.googleFontFamilies[0] || cleanStr(raw.headingFontFamily || '').split(',')[0].replace(/['"]/g, '').trim() || null,
            bodyFont: cleanStr(raw.bodyFontFamily || '').split(',')[0].replace(/['"]/g, '').trim() || null,
            googleFontFamilies: raw.googleFontFamilies,
            bodyFontSize: raw.bodyFontSize || null,
        };

        const images = (raw.images || []).map(img => ({
            ...img,
            url: toAbsUrl(img.url, baseUrl) || img.url,
        }));

        const videos = (raw.videos || []).map(vid => ({
            ...vid,
            url: toAbsUrl(vid.url, baseUrl) || vid.url,
        }));

        const content = raw.content || {};
        const forms = (raw.forms || []);

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
            logoColors,  // Added: logo-specific colors
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
                themeColor: raw.seoMeta?.themeColor || '',
                siteName: seo.openGraph?.site_name || '',
            },
        };

    } catch (error) {
        logger.error(`[Scraper] Failed for ${websiteUrl}: ${error.message}`);
        throw new Error(`Failed to scrape website: ${error.message}`);
    } finally {
        if (browser) await browser.close().catch(() => { });
    }
};

/**
 * Build comprehensive website profile from scraped data
 * @param {Object} scraped - Raw scraped data from scrapeWebsiteStructure
 * @param {Object} themeData - Optional additional theme data
 * @returns {Object} Formatted website profile
 */
const buildWebsiteProfile = (scraped, themeData = null) => {
    if (!scraped) return null;

    const {
        identity = {},
        colors = {},
        logoColors = {},  // Added: logo-specific colors
        themeSystem = {},
        typography = {},
        images = [],
        videos = [],
        content = {},
        forms = [],
        seo = {},
        sections = [],
        industry,
        subIndustry,
        scrapedAt,
        sourceUrl,
        finalUrl,
    } = scraped;

    // Use logo colors as primary if available, fallback to page colors
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

        // Logo-specific colors (from the logo image itself)
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
            // Page-wide colors (fallback)
            pagePrimary: colors.primary || '',
            pageSecondary: colors.secondary || '',
        },

        theme: (() => {
            const p = primaryColor;
            const sec = secondaryColor;

            // Exact CSS vars aur element-level extracted colors
            const cssVars = colors.exact?.cssVariables || {};
            const elemColors = themeSystem?.exactCssVars || cssVars;
            const exactElements = themeSystem?.exactElements || {};
            const metaThemeColor = normaliseCssColor(colors.exact?.meta?.themeColor || themeSystem?.metaColors?.themeColor);

            // CSS vars se primary/secondary nikalo (agar themeSystem se nahi mila toh)
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

            // Exact element-level extracted colors
            const exactBtnBg = exactElements.primaryBrandBg || normaliseCssColor(themeSystem?.exactCssVars?.primaryBrandBg);
            const exactHeaderBg = exactElements.headerBrandBg || normaliseCssColor(themeSystem?.exactCssVars?.headerBrandBg);
            const exactFooterBg = exactElements.footerBrandBg || normaliseCssColor(themeSystem?.exactCssVars?.footerBrandBg);

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
                header: themeData?.header || {
                    background: headerBg,
                    text: headerText,
                },
                navigation: themeData?.navigation || {
                    background: navBg,
                    text: navText,
                    active: navActive,
                },
                buttons: {
                    primaryBg: btnBg,
                    primaryText: btnText,
                    secondaryBg: first(cssSecondary, sec, p),
                    secondaryText: '#ffffff',
                },
                footer: {
                    background: footerBg,
                    text: footerText,
                },
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
            services: (Array.isArray(content.services) ? content.services : []).map(s => ({
                title: s.title || '',
                description: s.description || '',
                icon: s.icon || '',
            })),
            features: (Array.isArray(content.features) ? content.features : []).map(f => ({
                title: f.title || '',
                description: f.description || '',
                icon: f.icon || '',
            })),
            testimonials: (Array.isArray(content.testimonials) ? content.testimonials : []).map(t => ({
                name: t.name || t.author || '',
                company: t.company || '',
                text: t.text || '',
                rating: t.rating || null,
            })),
            ctas: (Array.isArray(content.ctaTexts) ? content.ctaTexts : []).map(text => ({
                title: '',
                description: '',
                buttonText: text,
            })),
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
            extractionVersion: '5.0',
            durationMs: scraped.durationMs || 0,
        },
    };
};

module.exports = { scrapeWebsiteStructure, buildWebsiteProfile, extractLogoColorsFromUrl: extractLogoColors };