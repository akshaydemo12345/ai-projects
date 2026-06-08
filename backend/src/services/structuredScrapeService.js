'use strict';

/**
 * structuredScrapeService.js  —  v3 (Puppeteer-powered)
 *
 * Uses Puppeteer to fully render pages (JS, lazy-load, CSS-in-JS) before
 * extracting branding data.  Falls back to a lightweight axios+cheerio pass
 * if Puppeteer is unavailable.
 *
 * Extraction groups:
 *   1. Identity    (name, description, logo, favicon)
 *   2. Colors      (primary / secondary / accent / full palette)
 *   3. ThemeSystem (per-component computed colours)
 *   4. Typography  (Google Fonts, computed font families)
 *   5. Images      (rich — url, alt, section, dimensions)
 *   6. Videos      (YouTube / Vimeo / html5)
 *   7. Content     (hero, services, features, testimonials, CTAs, taglines)
 *   8. Forms       (fields with name / label / type / placeholder / required)
 *   9. SEO         (title, description, keywords, OG, Twitter)
 *  10. Sections    (detected page section types)
 *  11. Industry    (keyword-based classification)
 */

const cheerio = require('cheerio');
const logger = require('../utils/logger');
const { openPage } = require('../utils/puppeteerFetch');

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
  { industry: 'E-Commerce', sub: 'Electronics', kws: ['electronics', 'gadget', 'smartphone', 'laptop', 'tech store'] },
  { industry: 'Food & Beverage', sub: 'Restaurant', kws: ['restaurant', 'menu', 'dining', 'eat', 'cuisine', 'food delivery', 'order food'] },
  { industry: 'Food & Beverage', sub: 'Organic Food', kws: ['organic food', 'natural food', 'vegan', 'plant-based', 'healthy eating'] },
  { industry: 'Education', sub: 'Online Learning', kws: ['online course', 'e-learning', 'edtech', 'tutorial', 'certification', 'lms'] },
  { industry: 'Education', sub: 'K-12 School', kws: ['school', 'kindergarten', 'primary school', 'secondary school', 'k-12'] },
  { industry: 'Finance', sub: 'Fintech', kws: ['fintech', 'payment gateway', 'digital banking', 'neobank', 'wallet'] },
  { industry: 'Finance', sub: 'Insurance', kws: ['insurance', 'policy', 'premium', 'claim', 'coverage', 'insurer'] },
  { industry: 'Travel & Tourism', sub: 'Travel Agency', kws: ['travel agency', 'tour package', 'holiday', 'vacation', 'tour operator'] },
  { industry: 'Travel & Tourism', sub: 'Hotel & Hospitality', kws: ['hotel', 'resort', 'stay', 'accommodation', 'hospitality', 'lodging'] },
  { industry: 'Technology', sub: 'IT Services', kws: ['it services', 'software development', 'web development', 'digital agency', 'tech consulting'] },
  { industry: 'Fitness & Wellness', sub: 'Gym & Fitness', kws: ['gym', 'fitness', 'workout', 'yoga', 'crossfit', 'personal training'] },
  { industry: 'Legal', sub: 'Law Firm', kws: ['law firm', 'attorney', 'lawyer', 'legal services', 'advocate'] },
  { industry: 'Nonprofit', sub: 'NGO', kws: ['ngo', 'nonprofit', 'charity', 'donation', 'foundation', 'social cause'] },
];

const classifyIndustry = (textCorpus) => {
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
  if (sorted.length === 0) return { industry: 'General', subIndustry: 'Business' };
  const [industry, { sub }] = sorted[0];
  return { industry, subIndustry: sub };
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
const IN_BROWSER_EXTRACTOR = () => {
  /* ── helpers ── */
  const cleanText = (s) => (s || '').trim().replace(/\s+/g, ' ');

  const isVisible = (el) => {
    if (!el) return false;
    const s = window.getComputedStyle(el);
    if (s.display === 'none' || s.visibility === 'hidden' || s.opacity === '0') return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 || r.height > 0; // allow 0-height sections (position:fixed, etc.)
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

  /* ── 1. Identity ── */
  const pageTitle = cleanText(document.title);
  const metaDesc = document.querySelector('meta[name="description"]')?.content ||
    document.querySelector('meta[property="og:description"]')?.content || '';
  const ogTitle = document.querySelector('meta[property="og:title"]')?.content || '';

  const logoEl = findFirstVisible([
    'img.logo', 'img[alt*="logo" i]', 'img[id*="logo" i]', 'img[class*="logo" i]',
    '.logo img', 'header img', 'nav img', '.navbar img', '.site-header img',
    'a[href="/"] img', '.brand img', '.navbar-brand img',
  ]);
  const logoUrl = toAbs(getRealSrc(logoEl));

  const faviconEl = document.querySelector('link[rel="icon"]') ||
    document.querySelector('link[rel="shortcut icon"]') ||
    document.querySelector('link[rel="apple-touch-icon"]');
  const favicon = faviconEl ? faviconEl.href : (location.origin + '/favicon.ico');

  /* ── 2. Theme / computed colours ── */
  const headerSelectors = [
    'header', 'nav', '.navbar', '.site-header', '.main-header', '.topbar', '.header',
    // WordPress-specific
    '#masthead', '#site-header', '#header', '#top-bar', '.wp-block-template-part',
    '#main-header', '.ast-header-html-markup', '.hfeed > header',
    '[class*="header"]', '[id*="header"]',
  ];
  const footerSelectors = [
    'footer', '.footer', '.site-footer', '.page-footer', '.footer-section',
    // WordPress-specific
    '#colophon', '#site-footer', '#footer', '.wp-block-template-part[class*="footer"]',
    '.footer-widget-area', '.ast-footer-html-markup',
    '[class*="footer"]', '[id*="footer"]',
  ];
  const buttonSelectors = [
    '.btn-primary', 'button.primary', '.button-primary', '.cta-btn', '.btn-cta',
    // WordPress / WooCommerce / Elementor
    '.wp-block-button__link', '.wc-block-components-button', '.elementor-button',
    '.ast-button', '.et_pb_button', '.fl-button',
    '.btn', 'button[type="submit"]', 'a.button', 'input[type="submit"]',
    'button', 'a[class*="btn"]', 'a[class*="button"]',
  ];
  const heroSelectors = [
    '.hero', '.banner', '.hero-section', '.top-section', '.hero-banner', '.main-hero',
    // WordPress-specific
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

  /* Helper: walk an element's ancestors looking for the first non-transparent bg */
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
  };

  /* collect all visible background & text colours for palette */
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
  /* background-image from inline styles & computed */
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
  // Hero
  let heroHeading = '', heroSubheading = '';
  const heroSels = ['.hero', 'header', '.banner', '[class*="hero"]', '[class*="banner"]', 'main', 'body'];
  for (const sel of heroSels) {
    const el = document.querySelector(sel);
    if (!el) continue;
    const h1 = cleanText(el.querySelector('h1')?.textContent);
    const h2 = cleanText(el.querySelector('h2')?.textContent);
    if (!heroHeading && h1.length > 5) heroHeading = h1;
    if (!heroSubheading && h2.length > 5) heroSubheading = h2;
    if (heroHeading && heroSubheading) break;
  }
  if (!heroHeading) heroHeading = cleanText(document.querySelector('h1')?.textContent || '');

  // Services
  const services = [];
  for (const el of Array.from(document.querySelectorAll('[class*="service" i], [class*="Service"]'))) {
    const h = cleanText(el.querySelector('h1,h2,h3,h4,h5')?.textContent);
    const d = cleanText(el.querySelector('p')?.textContent);
    if (h && !services.find(s => s.title === h)) services.push({ title: h, description: d || '' });
    if (services.length >= 15) break;
  }

  // Features
  const features = [];
  for (const el of Array.from(document.querySelectorAll('[class*="feature" i], [class*="Feature"]'))) {
    const h = cleanText(el.querySelector('h1,h2,h3,h4,h5')?.textContent);
    const d = cleanText(el.querySelector('p')?.textContent);
    if (h && !features.find(f => f.title === h)) features.push({ title: h, description: d || '' });
    if (features.length >= 15) break;
  }

  // Testimonials
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

  // CTA buttons
  const ctaTexts = [];
  for (const el of Array.from(document.querySelectorAll('button, a[href], [class*="cta" i], [class*="btn" i]'))) {
    const txt = cleanText(el.textContent);
    const cls = (el.className || '').toString().toLowerCase();
    if (txt.length > 2 && txt.length < 60 && (cls.includes('cta') || cls.includes('btn') || cls.includes('button'))) {
      if (!ctaTexts.includes(txt)) ctaTexts.push(txt);
    }
    if (ctaTexts.length >= 10) break;
  }

  // Taglines
  const taglines = [];
  for (const el of Array.from(document.querySelectorAll('[class*="tagline" i], [class*="headline" i], [class*="slogan" i], [class*="subheading" i]'))) {
    const txt = cleanText(el.textContent);
    if (txt.length > 5 && txt.length < 150 && !taglines.includes(txt)) taglines.push(txt);
    if (taglines.length >= 8) break;
  }

  // Section headings
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

  /* ── 9. Detected sections ── */
  const foundSections = new Set();
  const sectionKeywords = {
    hero: ['hero', 'banner', 'jumbotron', 'masthead', 'splash'],
    about: ['about', 'who-we-are', 'our-story', 'mission'],
    services: ['service', 'services', 'offering', 'solution'],
    features: ['feature', 'features', 'benefit', 'why-us'],
    testimonials: ['testimonial', 'review', 'feedback'],
    pricing: ['pricing', 'price', 'plan', 'package'],
    faq: ['faq', 'question', 'accordion'],
    contact: ['contact', 'get-in-touch', 'reach-us'],
    footer: ['footer', 'bottom'],
  };
  for (const el of Array.from(document.querySelectorAll('section, article, div[id], div[class], header, footer, nav, main'))) {
    const combined = ((el.className || '') + ' ' + (el.id || '')).toLowerCase();
    for (const [sec, kws] of Object.entries(sectionKeywords)) {
      if (kws.some(k => combined.includes(k))) foundSections.add(sec);
    }
  }

  return {
    pageTitle, metaDesc, ogTitle, logoUrl, favicon,
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

  // Collect candidates: theme-colour meta first (highest signal), then computed element colours
  const candidates = [
    seoMeta.themeColor,
    themeColors.button?.bg,
    themeColors.header?.bg,
    themeColors.footer?.bg,
    themeColors.hero?.bg,
    themeColors.header?.link,
    themeColors.linkColor,
    themeColors.bodyText,
    ...allBgs,
    ...allTexts,
    ...allBorders,
  ]
    .map(normaliseCssColor)
    .filter(Boolean)
    .filter(c => !isNeutralHex(c));

  // Deduplicate preserving order
  const palette = [...new Set(candidates)].slice(0, 20);

  const primary = palette[0] || '#333333';
  const secondary = palette.find(c => c !== primary) || '#555555';
  const accent = palette.find(c => c !== primary && c !== secondary) || '#888888';

  return { primary, secondary, accent, palette };
};

// ─── Main export ──────────────────────────────────────────────────────────────

const scrapeWebsiteStructure = async (websiteUrl) => {
  const startedAt = Date.now();
  let browser, page, finalUrl;

  try {
    logger.info(`[Scraper] Starting Puppeteer scrape for ${websiteUrl}`);

    // ── Open page with Puppeteer ─────────────────────────────────────────────
    const result = await openPage(websiteUrl, { waitUntil: 'networkidle2', timeout: 45000 })
      .catch(async (err) => {
        // Fallback: less strict wait condition if networkidle2 times out
        logger.warn(`[Scraper] networkidle2 failed (${err.message}), retrying with domcontentloaded`);
        return openPage(websiteUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
      });

    browser = result.browser;
    page = result.page;
    finalUrl = result.finalUrl;

    // Give JS-heavy sites a little extra time to finish rendering
    await sleep(1500);

    // Scroll to trigger lazy-loaded images
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

    // ── Run all in-browser extraction ────────────────────────────────────────
    const raw = await page.evaluate(IN_BROWSER_EXTRACTOR);

    // ── Also grab the final rendered HTML for cheerio-based fallbacks ────────
    const html = await page.content();
    const $ = cheerio.load(html);
    const baseUrl = finalUrl || websiteUrl;

    // ── Post-process ─────────────────────────────────────────────────────────

    // Identity
    const identity = {
      name: cleanStr(raw.pageTitle || raw.ogTitle || ''),
      description: cleanStr(raw.metaDesc || ''),
      logoUrl: raw.logoUrl ? toAbsUrl(raw.logoUrl, baseUrl) || raw.logoUrl : '',
      faviconUrl: raw.favicon ? toAbsUrl(raw.favicon, baseUrl) || raw.favicon
        : `${new URL(baseUrl).origin}/favicon.ico`,
    };

    // Colors
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
    };

    // Typography
    const typography = {
      primaryFont: raw.googleFontFamilies[0] || cleanStr(raw.bodyFontFamily || '').split(',')[0].replace(/['"]/g, '').trim() || null,
      headingFont: raw.googleFontFamilies[1] || raw.googleFontFamilies[0] || cleanStr(raw.headingFontFamily || '').split(',')[0].replace(/['"]/g, '').trim() || null,
      bodyFont: cleanStr(raw.bodyFontFamily || '').split(',')[0].replace(/['"]/g, '').trim() || null,
      googleFontFamilies: raw.googleFontFamilies,
      bodyFontSize: raw.bodyFontSize || null,
    };

    // Images — fix any relative URLs missed in-browser
    const images = (raw.images || []).map(img => ({
      ...img,
      url: toAbsUrl(img.url, baseUrl) || img.url,
    }));

    // Videos
    const videos = (raw.videos || []).map(vid => ({
      ...vid,
      url: toAbsUrl(vid.url, baseUrl) || vid.url,
    }));

    // Content (already clean from in-browser)
    const content = raw.content || {};

    // Forms
    const forms = (raw.forms || []);

    // SEO
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

    // Sections
    const sections = raw.detectedSections || [];

    // Industry classification
    const textCorpus = [
      identity.name, identity.description,
      content.heroHeading, content.heroSubheading,
      ...(content.services || []).map(s => s.title + ' ' + s.description),
      ...(content.sectionHeadings || []),
      seo.metaKeywords.join(' '),
      raw.textCorpusSample || '',
    ].join(' ');
    const { industry, subIndustry } = classifyIndustry(textCorpus);

    // Legacy form fields
    const formFields = extractFormFieldsFromHtml(html);

    const durationMs = Date.now() - startedAt;

    // Logs
    if (!identity.logoUrl) logger.warn('[Scraper] logo URL not found');
    if (!identity.name) logger.warn('[Scraper] project name not found');
    if (!colors.primary) logger.warn('[Scraper] primary colour not found');
    if (images.length === 0) logger.warn('[Scraper] no images extracted');
    if (sections.length === 0) logger.warn('[Scraper] no sections detected');
    logger.info(`[Scraper] Completed in ${durationMs}ms — ${images.length} images, ${videos.length} videos, ${sections.length} sections`);

    return {
      // Core groups
      identity,
      colors,
      themeSystem,
      typography,
      images,
      videos,
      content,
      forms,
      formFields,   // legacy
      seo,
      sections,
      industry,
      subIndustry,

      // Meta
      scrapedAt: new Date().toISOString(),
      sourceUrl: websiteUrl,
      finalUrl: finalUrl || websiteUrl,
      durationMs,

      // Legacy compatibility shape
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

// ─── buildWebsiteProfile ──────────────────────────────────────────────────────
/**
 * Maps raw scrapeWebsiteStructure output → the websiteProfile schema shape
 * stored on Project documents.
 *
 * @param {object} scraped   - result of scrapeWebsiteStructure()
 * @param {object|null} themeData - optional theme override
 */
const buildWebsiteProfile = (scraped, themeData = null) => {
  if (!scraped) return null;

  const {
    identity = {},
    colors = {},
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

  return {
    identity: {
      name: identity.name || identity.brandName || '',
      description: identity.description || seo.metaDescription || '',
      logoUrl: identity.logoUrl || identity.logo || '',
      favicon: identity.faviconUrl || identity.favicon || '',
    },

    industry: {
      industry: industry || '',
      subIndustry: subIndustry || '',
      confidence: null,
      detectedFrom: [],
    },

    colors: {
      primary: colors.primary || '',
      secondary: colors.secondary || '',
      accent: colors.accent || '',
      palette: Array.isArray(colors.palette) ? colors.palette : [],
    },

    theme: (() => {
      // Resolved palette colours – used as intelligent fallbacks when computed
      // CSS values come back null (transparent/black defaults stripped by normaliseCssColor).
      const p = colors.primary || '';
      const sec = colors.secondary || '';

      // Pick first truthy value
      const first = (...vals) => vals.find(v => v && v !== '') || '';

      // Button – prefer actual computed value, fall back to brand primary
      const btnBg = first(themeSystem?.button?.background, p);
      const btnText = first(themeSystem?.button?.color, '#ffffff');

      // Header – many WordPress themes render a white/transparent bar; use page bg as fallback
      const headerBg = first(themeSystem?.header?.background, themeSystem?.page?.background, '#ffffff');
      const headerText = first(themeSystem?.header?.color, themeSystem?.bodyText, '#212221');

      // Navigation text – prefer explicit link colour from nav anchors
      const navText = first(themeSystem?.header?.link, themeSystem?.linkColor, headerText);
      const navBg = first(themeSystem?.navigation?.background, headerBg);
      const navActive = first(themeSystem?.navigation?.active, p);

      // Footer
      const footerBg = first(themeSystem?.footer?.background, '#212221');
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
          secondaryBg: first(sec, p),
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
      extractionVersion: '3.0',
    },
  };
};

module.exports = { scrapeWebsiteStructure, buildWebsiteProfile };