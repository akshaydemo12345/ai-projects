'use strict';

/**
 * themeStyleExtractorService.js
 * ------------------------------
 * NEW, standalone Playwright-based extractor that scrapes a live website and
 * returns a structured "theme profile": brand colors, typography, button
 * styles, shape/surface language (radius + shadow), and basic layout/brand
 * assets (logo, favicon).
 *
 * This is intentionally separate from the existing Puppeteer-driven
 * analyzeService / structuredScrapeService / brandingService pipeline (which
 * focuses on SEO/content/business extraction). This module focuses purely on
 * *visual theme* extraction and is meant to feed a "match my existing site's
 * design" feature in the Create Project flow, without touching the existing
 * scraping pipeline.
 *
 * Requires:
 *   npm install playwright
 *   npx playwright install chromium     (downloads the browser binary)
 *
 * Usage:
 *   const { extractThemeProfile } = require('./themeStyleExtractorService');
 *   const profile = await extractThemeProfile('https://example.com');
 */

const logger = require('../utils/logger');

const DEFAULT_TIMEOUT = 45_000;
const VIEWPORT = { width: 1440, height: 900 };
const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';

const CONSENT_SELECTORS = [
  'button[id*="accept" i]',
  'button[class*="accept" i]',
  'button[id*="agree" i]',
  'button[class*="agree" i]',
  'button[id*="consent" i]',
  'button[class*="consent" i]',
  '[aria-label*="Accept" i]',
  '[aria-label*="agree" i]',
];

// ─────────────────────────────────────────────────────────────────────────────
// In-browser extraction script. Runs inside page.evaluate(), so it must be
// fully self-contained (no closures over outer Node variables).
// ─────────────────────────────────────────────────────────────────────────────
/* istanbul ignore next */
function browserExtractTheme() {
  // ---- helpers -------------------------------------------------------------
  const toHex = (rgbStr) => {
    if (!rgbStr) return null;
    const m = rgbStr.match(/rgba?\(([^)]+)\)/i);
    if (!m) return rgbStr.startsWith('#') ? rgbStr : null;
    const parts = m[1].split(',').map((s) => parseFloat(s.trim()));
    const [r, g, b, a = 1] = parts;
    if (a === 0) return null; // fully transparent — ignore
    const hex = (n) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0');
    return `#${hex(r)}${hex(g)}${hex(b)}`;
  };

  const isNeutral = (hex) => {
    if (!hex) return true;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const sat = max === 0 ? 0 : (max - min) / max;
    // Treat near-white, near-black, and low-saturation greys as "neutral"
    return (max > 245 && min > 235) || (max < 18) || sat < 0.12;
  };

  const isVisible = (el) => {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return false;
    const cs = window.getComputedStyle(el);
    return cs.visibility !== 'hidden' && cs.display !== 'none' && parseFloat(cs.opacity || '1') > 0.05;
  };

  // ---- body / base typography ----------------------------------------------
  const bodyEl = document.body;
  const bodyCs = window.getComputedStyle(bodyEl);
  const htmlCs = window.getComputedStyle(document.documentElement);

  const base = {
    backgroundColor: toHex(bodyCs.backgroundColor) || toHex(htmlCs.backgroundColor),
    textColor: toHex(bodyCs.color),
    fontFamily: bodyCs.fontFamily,
    fontSize: bodyCs.fontSize,
    lineHeight: bodyCs.lineHeight,
    fontWeight: bodyCs.fontWeight,
  };

  // ---- headings --------------------------------------------------------------
  const headings = {};
  ['h1', 'h2', 'h3', 'h4'].forEach((tag) => {
    const els = Array.from(document.querySelectorAll(tag)).filter(isVisible);
    if (!els.length) return;
    const el = els[0];
    const cs = window.getComputedStyle(el);
    headings[tag] = {
      color: toHex(cs.color),
      fontSize: cs.fontSize,
      fontWeight: cs.fontWeight,
      fontFamily: cs.fontFamily,
      lineHeight: cs.lineHeight,
      letterSpacing: cs.letterSpacing,
      textTransform: cs.textTransform,
      sampleText: (el.textContent || '').trim().slice(0, 80),
    };
  });

  // ---- buttons ---------------------------------------------------------------
  const buttonEls = Array.from(
    document.querySelectorAll(
      'button, a.btn, a[class*="button" i], [class*="btn-" i], [class*="btn_" i], input[type="submit"], input[type="button"], [role="button"]'
    )
  ).filter(isVisible);

  const buttonSignatures = new Map(); // signature -> { sample, count }
  buttonEls.slice(0, 250).forEach((el) => {
    const cs = window.getComputedStyle(el);
    const bg = toHex(cs.backgroundColor);
    const color = toHex(cs.color);
    const radius = cs.borderTopLeftRadius;
    const sig = `${bg}|${color}|${radius}`;
    if (!buttonSignatures.has(sig)) {
      buttonSignatures.set(sig, {
        count: 0,
        sample: {
          backgroundColor: bg,
          color: color,
          borderRadius: radius,
          border: cs.borderWidth !== '0px' ? `${cs.borderWidth} ${cs.borderStyle} ${toHex(cs.borderColor) || cs.borderColor}` : 'none',
          boxShadow: cs.boxShadow === 'none' ? 'none' : cs.boxShadow,
          padding: cs.padding,
          fontSize: cs.fontSize,
          fontWeight: cs.fontWeight,
          textTransform: cs.textTransform,
          letterSpacing: cs.letterSpacing,
          sampleText: (el.textContent || el.value || '').trim().slice(0, 40),
        },
      });
    }
    buttonSignatures.get(sig).count += 1;
  });
  const buttons = Array.from(buttonSignatures.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 6)
    .map((entry) => ({ ...entry.sample, occurrences: entry.count }));

  // ---- color palette (frequency across visible elements) --------------------
  const colorFreq = new Map();
  const bump = (hex) => {
    if (!hex || isNeutral(hex)) return;
    colorFreq.set(hex, (colorFreq.get(hex) || 0) + 1);
  };

  // Extract individual color stops from CSS gradient strings.
  // Handles: rgb(), rgba(), #rrggbb, #rgb — all common formats inside gradients.
  const extractGradientColors = (bgImage) => {
    if (!bgImage || bgImage === 'none') return;
    // Only process gradient values
    if (!/gradient/i.test(bgImage)) return;
    // Match rgb()/rgba() color stops
    const rgbMatches = bgImage.match(/rgba?\([^)]+\)/gi) || [];
    rgbMatches.forEach((c) => bump(toHex(c)));
    // Match hex color stops (#rrggbb or #rgb)
    const hexMatches = bgImage.match(/#[0-9a-fA-F]{3,8}\b/g) || [];
    hexMatches.forEach((c) => {
      // Only use valid 3- or 6-digit hex
      if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(c)) bump(c);
    });
  };

  const sampleEls = Array.from(document.querySelectorAll('body *')).filter(isVisible).slice(0, 1200);
  sampleEls.forEach((el) => {
    const cs = window.getComputedStyle(el);
    bump(toHex(cs.backgroundColor));
    bump(toHex(cs.color));
    if (cs.borderTopColor && cs.borderTopWidth !== '0px') bump(toHex(cs.borderTopColor));
    // ── Gradient extraction ────────────────────────────────────────────────
    // `background-color` is transparent for gradient elements — colors live in
    // `background-image` as `linear-gradient(...)` / `radial-gradient(...)`.
    extractGradientColors(cs.backgroundImage);
    // Also check the shorthand `background` property in case the browser
    // resolves it differently (some browsers expose it there instead).
    extractGradientColors(cs.background);
  });
  const palette = Array.from(colorFreq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([hex, count]) => ({ hex, occurrences: count }));

  // ---- shape language: border-radius + shadow frequency ----------------------
  const radiusFreq = new Map();
  const shadowFreq = new Map();
  const cardLikeEls = Array.from(document.querySelectorAll('body *'))
    .filter(isVisible)
    .filter((el) => {
      const r = el.getBoundingClientRect();
      return r.width > 100 && r.height > 60;
    })
    .slice(0, 600);
  cardLikeEls.forEach((el) => {
    const cs = window.getComputedStyle(el);
    if (cs.borderTopLeftRadius && cs.borderTopLeftRadius !== '0px') {
      radiusFreq.set(cs.borderTopLeftRadius, (radiusFreq.get(cs.borderTopLeftRadius) || 0) + 1);
    }
    if (cs.boxShadow && cs.boxShadow !== 'none') {
      shadowFreq.set(cs.boxShadow, (shadowFreq.get(cs.boxShadow) || 0) + 1);
    }
  });
  const topRadii = Array.from(radiusFreq.entries()).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([v]) => v);
  const topShadows = Array.from(shadowFreq.entries()).sort((a, b) => b[1] - a[1]).slice(0, 2).map(([v]) => v);

  // ---- links / accent color --------------------------------------------------
  const linkEls = Array.from(document.querySelectorAll('a')).filter(isVisible).slice(0, 100);
  const linkColorFreq = new Map();
  linkEls.forEach((el) => {
    const hex = toHex(window.getComputedStyle(el).color);
    if (hex && !isNeutral(hex)) linkColorFreq.set(hex, (linkColorFreq.get(hex) || 0) + 1);
  });
  const linkColor = Array.from(linkColorFreq.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] || null;

  // ---- logo + favicon ---------------------------------------------------------
  const logoEl =
    document.querySelector('header img[class*="logo" i]') ||
    document.querySelector('img[alt*="logo" i]') ||
    document.querySelector('a[class*="logo" i] img') ||
    document.querySelector('header img');
  const logoUrl = logoEl ? logoEl.src : null;

  const faviconEl =
    document.querySelector('link[rel="icon"]') ||
    document.querySelector('link[rel="shortcut icon"]') ||
    document.querySelector('link[rel="apple-touch-icon"]');
  const faviconUrl = faviconEl ? faviconEl.href : null;

  // ---- max content width (typical container) ----------------------------------
  const mainEl = document.querySelector('main') || document.body;
  const containerWidth = mainEl ? Math.round(mainEl.getBoundingClientRect().width) : null;

  return {
    base,
    headings,
    buttons,
    palette,
    accentColor: palette.find((p) => p.hex)?.hex || linkColor || null,
    linkColor,
    shape: { borderRadii: topRadii, boxShadows: topShadows },
    layout: { containerWidth },
    brand: { logoUrl, faviconUrl },
    pageTitle: document.title,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Cookie-banner dismissal (best effort, non-fatal)
// ─────────────────────────────────────────────────────────────────────────────
async function dismissConsentBanners(page) {
  for (const sel of CONSENT_SELECTORS) {
    try {
      const el = await page.$(sel);
      if (el) {
        await el.click({ timeout: 1500 }).catch(() => {});
        await page.waitForTimeout(300);
        break;
      }
    } catch (_) {
      // non-fatal
    }
  }
}

/**
 * Extract a visual theme profile from a live URL using Playwright.
 *
 * @param {string} url
 * @param {{ timeout?: number, screenshot?: boolean }} [opts]
 * @returns {Promise<object>} theme profile
 */
async function extractThemeProfile(url, opts = {}) {
  if (!url || typeof url !== 'string') {
    const err = new Error('A valid URL is required');
    err.code = 'INVALID_URL';
    throw err;
  }

  let chromium;
  try {
    // eslint-disable-next-line global-require
    ({ chromium } = require('playwright'));
  } catch (e) {
    const err = new Error(
      'Playwright is not installed. Run `npm install playwright && npx playwright install chromium`.'
    );
    err.code = 'PLAYWRIGHT_NOT_INSTALLED';
    throw err;
  }

  const { timeout = DEFAULT_TIMEOUT, screenshot = true } = opts;
  const normalizedUrl = /^[a-z][a-z0-9+.-]*:\/\//i.test(url) ? url : `https://${url}`;

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });

  try {
    const context = await browser.newContext({
      viewport: VIEWPORT,
      userAgent: USER_AGENT,
    });
    const page = await context.newPage();

    // Skip heavy/irrelevant resources for speed.
    await page.route('**/*', (route) => {
      const type = route.request().resourceType();
      if (['media', 'font', 'websocket'].includes(type)) return route.abort();
      return route.continue();
    });

    let response;
    try {
      response = await page.goto(normalizedUrl, { waitUntil: 'networkidle', timeout });
    } catch (navErr) {
      const err = new Error(`Failed to load ${normalizedUrl}: ${navErr.message}`);
      err.code = 'SITE_BLOCKED';
      throw err;
    }

    const status = response ? response.status() : null;
    if (status && [403, 406, 429, 451].includes(status)) {
      const err = new Error(`Site responded with HTTP ${status} — likely blocking automated access.`);
      err.code = 'SITE_BLOCKED';
      throw err;
    }

    await dismissConsentBanners(page);
    await page.waitForTimeout(500); // let any late CSS/JS theming settle

    const extracted = await page.evaluate(browserExtractTheme);

    let screenshotBase64 = null;
    if (screenshot) {
      const buf = await page.screenshot({ type: 'jpeg', quality: 70 });
      screenshotBase64 = `data:image/jpeg;base64,${buf.toString('base64')}`;
    }

    return {
      sourceUrl: normalizedUrl,
      finalUrl: page.url(),
      scrapedAt: new Date().toISOString(),
      ...extracted,
      screenshot: screenshotBase64,
    };
  } finally {
    await browser.close().catch(() => {});
  }
}

module.exports = { extractThemeProfile, mapThemeProfileToThemeData };

/**
 * Map the raw Playwright theme profile (extractThemeProfile output) into the
 * `themeData` shape expected by structuredScrapeService.buildWebsiteProfile(),
 * so it can flow straight into `websiteProfile.theme` alongside (and taking
 * priority over) the existing heuristic-derived header/navigation/buttons/footer.
 *
 * @param {object|null} themeProfile - output of extractThemeProfile()
 * @returns {object|null}
 */
function mapThemeProfileToThemeData(themeProfile) {
  if (!themeProfile) return null;

  const primaryBtn = themeProfile.buttons?.[0] || null;
  const secondaryBtn = themeProfile.buttons?.[1] || null;
  const bg = themeProfile.base?.backgroundColor || '';
  const text = themeProfile.base?.textColor || '';
  const accent = themeProfile.accentColor || '';
  const link = themeProfile.linkColor || accent;

  return {
    header: {
      background: bg,
      text: text,
      border: '',
    },
    navigation: {
      background: bg,
      text: link,
      active: accent,
      hover: link,
      border: '',
    },
    buttons: {
      primaryBg: primaryBtn?.backgroundColor || accent || '',
      primaryText: primaryBtn?.color || '#ffffff',
      primaryBorder: primaryBtn?.border && primaryBtn.border !== 'none' ? primaryBtn.border : '',
      primaryHoverBg: '',
      primaryHoverText: '',
      secondaryBg: secondaryBtn?.backgroundColor || '',
      secondaryText: secondaryBtn?.color || '',
      borderRadius: primaryBtn?.borderRadius || '',
    },
    footer: {
      background: bg,
      text: text,
    },
    typography: {
      fontFamily: themeProfile.base?.fontFamily || '',
      baseFontSize: themeProfile.base?.fontSize || '',
      headings: themeProfile.headings || {},
    },
    shape: themeProfile.shape || {},
  };
}