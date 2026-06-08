'use strict';

const axios = require('axios');
const cheerio = require('cheerio');
const sharp = require('sharp');
const { Resvg } = require('@resvg/resvg-js');
const logger = require('../utils/logger');

const svgMarkupToDataUrl = (markup) => {
  const cleaned = markup.trim();
  return `data:image/svg+xml;base64,${Buffer.from(cleaned).toString('base64')}`;
};

const normalizeImageUrl = (src, baseUrl) => {
  if (!src) return '';
  let normalized = src.trim();

  if (/^<svg[\s\S]*<\/svg>$/i.test(normalized)) {
    return svgMarkupToDataUrl(normalized);
  }

  if (/^(data|blob|javascript|chrome-extension):/i.test(normalized)) {
    if (/^data:image\/(svg\+xml|png|jpe?g|webp|avif);/i.test(normalized)) {
      return normalized;
    }
    return '';
  }

  if (normalized.startsWith('//')) {
    normalized = `https:${normalized}`;
  }

  if (!/^https?:\/\//i.test(normalized)) {
    try {
      normalized = new URL(normalized, baseUrl).href;
    } catch (e) {
      return '';
    }
  }
  return normalized;
};

const extractCssUrl = (value, baseUrl) => {
  if (!value || typeof value !== 'string') return '';
  const match = value.match(/url\(\s*['"]?([^'")]+)['"]?\s*\)/i);
  if (match && match[1]) {
    return normalizeImageUrl(match[1], baseUrl);
  }
  return normalizeImageUrl(value, baseUrl);
};

const isLogoUrlCandidate = (url) => {
  if (!url) return false;
  const lower = url.toLowerCase();

  // Verify image format support (PNG, JPG, GIF, SVG, WebP, AVIF)
  const supportedFormats = /\.(png|jpg|jpeg|gif|svg|webp|avif)(\?|#|$)/i;
  const isDataUrl = /^data:image\/(png|jpg|jpeg|gif|svg\+xml|webp|avif);/i.test(lower);
  if (!supportedFormats.test(lower) && !isDataUrl) {
    return false;
  }

  if (lower.includes('favicon')) {
    // Allow brand logo paths that include "favicon" only when they also contain explicit logo branding
    if (lower.includes('logo-and-favicon') || lower.includes('logos-logo') || lower.includes('logo') || lower.includes('brand-sites')) {
      return true;
    }
    return false;
  }

  const invalid = [
    'icon', 'pixel', 'sprite', 'tracking', 'badge', 'share', 'social', 'og-image', 'logo-preview', 'logo-mask', 'marker', 'loading', 'placeholder', 'button', 'avatar', 'profile', 'thumb', 'thumbnail', 'partner', 'premier', 'award', 'certified', 'sponsor'
  ];
  return !invalid.some((pattern) => lower.includes(pattern));
};

const scoreLogoCandidate = ($, el, src, origin) => {
  let score = 0;
  const lowerSrc = src.toLowerCase();
  const alt = ($(el).attr('alt') || '').trim().toLowerCase();
  const cls = ($(el).attr('class') || '').trim().toLowerCase();
  const parentClasses = ($(el).parent().attr('class') || '').trim().toLowerCase();
  const linkHref = ($(el).closest('a').attr('href') || '').trim();

  if (lowerSrc.includes('logo')) score += 20;
  if (alt.includes('logo')) score += 35;
  if (cls.includes('logo') || parentClasses.includes('logo')) score += 40;
  if (cls.includes('brand') || parentClasses.includes('brand') || lowerSrc.includes('brand')) score += 15;
  if (alt && !alt.includes('logo') && !alt.includes('icon')) score += 10;

  if (linkHref) {
    const normalizedLink = linkHref.startsWith('/') ? `${origin}${linkHref}` : normalizeImageUrl(linkHref, origin);
    if (normalizedLink && (normalizedLink === origin || normalizedLink === `${origin}/` || normalizedLink.includes(origin))) {
      score += 25;
    }
    if (/home|index|welcome/i.test(linkHref)) score += 10;
  }

  const rejectPatterns = [/banner/i, /hero/i, /promo/i, /slider/i, /carousel/i, /gallery/i, /product/i, /service/i, /feature/i, /about/i, /contact/i];
  if (rejectPatterns.some((pattern) => pattern.test(lowerSrc) || pattern.test(cls) || pattern.test(alt))) {
    score -= 25;
  }

  if (/partner|premier|award|certified|sponsor|badge|bing|google/i.test(lowerSrc + ' ' + alt + ' ' + cls)) {
    score -= 100;
  }

  const width = parseInt($(el).attr('width') || '0', 10) || 0;
  const height = parseInt($(el).attr('height') || '0', 10) || 0;
  const area = width * height;
  if (area >= 2500) score += 15;
  if (area > 0 && area < 500) score -= 10;

  if ($(el).closest('header, .header, nav, .navbar, .site-branding, .logo').length) score += 20;
  if (/social|icon|avatar|menu|button/.test(cls + ' ' + alt)) score -= 20;

  return score;
};

const extractCssBackgroundLogoCandidates = async ($, baseUrl) => {
  const urls = new Set();
  const cssTexts = await collectExternalCssTexts($, baseUrl);
  cssTexts.forEach((cssText) => {
    const ruleRegex = /([^{]+)\{([^}]*url\([^}]+\)[^}]*)\}/gi;
    let ruleMatch;
    while ((ruleMatch = ruleRegex.exec(cssText)) !== null) {
      const selector = (ruleMatch[1] || '').toLowerCase();
      const body = ruleMatch[2] || '';
      if (/logo|brand|navbar|header|site-branding|branding|footer|identity/i.test(selector)) {
        const url = extractCssUrl(body, baseUrl);
        if (url) urls.add(url);
      }
    }
  });
  return Array.from(urls);
};

const findInlineSvgLogoCandidates = ($, baseUrl) => {
  const candidates = [];
  const svgSelectors = [
    'svg[id*="logo" i]',
    'svg[class*="logo" i]',
    'svg[aria-label*="logo" i]',
    '.logo svg',
    '.site-branding svg',
    'header .logo svg',
    'nav .logo svg',
    '.navbar svg',
    '.brand svg',
    '.branding svg'
  ];

  $(svgSelectors.join(',')).each((i, el) => {
    const svgMarkup = $.html(el);
    if (!svgMarkup) return;
    const dataUrl = svgMarkupToDataUrl(svgMarkup);
    candidates.push({ src: dataUrl, el });
  });

  return candidates;
};

const findHeaderLogoImage = ($, baseUrl) => {
  const selectors = [
    'a[data-qa="hd-logo"] img',
    '.header__logo img',
    '.header__logo a img',
    'header .header__logo img',
    'header .logo img',
    '.site-header .logo img',
    '.site-branding img',
    'img[alt*="go to home page" i]',
    'img[alt*="home page" i]',
    'img[alt*="go to homepage" i]'
  ];

  for (const selector of selectors) {
    const el = $(selector).first();
    if (!el || !el.length) continue;
    const rawSrc = (el.attr('src') || el.attr('data-src') || el.attr('data-lazy-src') || el.attr('data-original') || '').trim();
    const src = extractCssUrl(rawSrc, baseUrl);
    if (src && isLogoUrlCandidate(src)) {
      return src;
    }
  }
  return '';
};

const findBestLogo = async ($, baseUrl, faviconUrl = null) => {
  const origin = new URL(baseUrl).origin;
  const candidates = [];
  const seen = new Set();

  // Priority 1: Exact header logo with specific selectors (highest priority)
  const exactSelectors = [
    'a[data-qa="hd-logo"] img',
    '.header__logo img',
    '.site-branding img',
    'img[itemprop="logo"]',
    'img[alt*="go to home page" i]',
    'img[alt*="home page" i]'
  ];

  for (const selector of exactSelectors) {
    const el = $(selector).first();
    if (el.length) {
      const src = (el.attr('src') || el.attr('data-src') || '').trim();
      if (src) {
        const fullUrl = normalizeImageUrl(src, baseUrl);
        if (fullUrl && !seen.has(fullUrl)) {
          candidates.push({ src: fullUrl, score: 100, priority: 1 });
          seen.add(fullUrl);
        }
      }
    }
  }

  // Priority 2: SVG logos (keep as SVG, don't convert)
  $('svg').each((i, el) => {
    const $el = $(el);
    const cls = ($el.attr('class') || '').toLowerCase();
    const id = ($el.attr('id') || '').toLowerCase();
    const isLogo = cls.includes('logo') || id.includes('logo') ||
      $el.closest('.logo, .site-branding, header').length > 0;

    if (isLogo) {
      const svgMarkup = $.html(el);
      const dataUrl = `data:image/svg+xml;base64,${Buffer.from(svgMarkup).toString('base64')}`;
      if (!seen.has(dataUrl)) {
        candidates.push({ src: dataUrl, score: 95, priority: 2 });
        seen.add(dataUrl);
      }
    }
  });

  // Priority 3: Regular logo selectors with scoring
  const logoSelectors = [
    'img[id*="logo" i]', 'img[class*="logo" i]', 'img[src*="logo" i]',
    'img[alt*="logo" i]', '.logo img', '.navbar-brand img', '.brand img'
  ];

  logoSelectors.forEach((selector) => {
    $(selector).each((i, el) => {
      const rawSrc = ($(el).attr('src') || $(el).attr('data-src') || '').trim();
      const src = normalizeImageUrl(rawSrc, baseUrl);
      if (src && !seen.has(src)) {
        const score = scoreLogoCandidate($, el, src, origin);
        candidates.push({ src, score, priority: 3 });
        seen.add(src);
      }
    });
  });

  // Sort by priority then score
  candidates.sort((a, b) => {
    if (a.priority !== b.priority) return a.priority - b.priority;
    return b.score - a.score;
  });

  // Return best candidate or fallback to favicon
  if (candidates.length > 0) {
    return candidates[0].src;
  }

  // FALLBACK: Return favicon if available
  if (faviconUrl && faviconUrl !== '') {
    return faviconUrl;
  }

  return '';
};

// Broad regex: captures ANY CSS variable that holds a hex or rgb color value.
// Brand-weighted selection still happens downstream via variableColorEntries filtering.
const CSS_VAR_COLOR_REGEX = /--([\.\w-]+)\s*:\s*(#[A-Fa-f0-9]{3,6}|rgba?\([^)]+\))/gi;
const CSS_COLOR_PROP_REGEX = /(background(?:-color)?|color|border(?:-color)?|fill|stroke)\s*:\s*(#[A-Fa-fA-F0-9]{3,6}|rgba?\([^)]+\))/gi;
const STYLESHEET_LINK_SELECTOR = 'link[rel="stylesheet"][href], link[rel="preload"][as="style"][href], link[rel="stylesheet"][type="text/css"][href]';

const normalizeColorValue = (value) => {
  if (!value || typeof value !== 'string') return '';
  const normalized = rgbToHex(value.trim());
  return normalized ? normalized : '';
};

const parseCssVariables = (cssText) => {
  const variables = {};
  let match;
  CSS_VAR_COLOR_REGEX.lastIndex = 0;
  while ((match = CSS_VAR_COLOR_REGEX.exec(cssText)) !== null) {
    const name = match[1].toLowerCase();
    const value = normalizeColorValue(match[2]);
    if (value) {
      variables[name] = value;
    }
  }
  return variables;
};

const parseCssColorDeclarations = (cssText) => {
  const colors = [];
  let match;
  CSS_COLOR_PROP_REGEX.lastIndex = 0;
  while ((match = CSS_COLOR_PROP_REGEX.exec(cssText)) !== null) {
    const value = normalizeColorValue(match[2]);
    if (value) {
      colors.push(value);
    }
  }
  return colors;
};

const collectExternalCssTexts = async ($, baseUrl) => {
  const content = [];
  $('style').each((i, el) => {
    const styleContent = $(el).html();
    if (styleContent) content.push(styleContent);
  });

  const hrefs = new Set();
  $(STYLESHEET_LINK_SELECTOR).each((i, el) => {
    const href = ($(el).attr('href') || '').trim();
    const resolved = normalizeImageUrl(href, baseUrl);
    if (resolved) hrefs.add(resolved);
  });

  for (const href of hrefs) {
    try {
      const response = await axios.get(href, {
        timeout: 12000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
          'Accept': 'text/css,*/*;q=0.1'
        }
      });
      if (response.data && typeof response.data === 'string') {
        content.push(response.data);
      }
    } catch (err) {
      logger.warn(`Failed to fetch stylesheet ${href}: ${err.message}`);
    }
  }

  return content;
};

const collectInlineStyleColors = ($, selectors = ['*']) => {
  const collected = [];
  selectors.forEach((selector) => {
    $(selector).each((i, el) => {
      const style = ($(el).attr('style') || '').trim();
      let match;
      CSS_COLOR_PROP_REGEX.lastIndex = 0;
      while ((match = CSS_COLOR_PROP_REGEX.exec(style)) !== null) {
        const value = normalizeColorValue(match[2]);
        if (value) collected.push(value);
      }
    });
  });
  return collected;
};

const uniqueHexColors = (colors = []) => Array.from(new Set((colors || []).filter(Boolean).map((c) => c.toLowerCase())));

const getDistinctColor = (baseColor, candidates, minDistance = 45) => {
  if (!baseColor || !candidates || candidates.length === 0) return '';
  return candidates.find((color) => {
    if (!color || color.toLowerCase() === baseColor.toLowerCase()) return false;
    return getColorDistance(baseColor, color) >= minDistance;
  }) || '';
};

const selectFirstNonNeutral = (colors) => {
  if (!colors || colors.length === 0) return '';
  return colors.find((color) => !isNeutralColor(color)) || '';
};

const selectDistinctColor = (baseColor, candidates) => {
  return selectDistinctColorWithDistance(baseColor, candidates, 35);
};

const selectDistinctColorWithDistance = (baseColor, candidates, minDistance = 35) => {
  if (!baseColor || !candidates || candidates.length === 0) return '';
  return candidates.find((color) => {
    if (!color) return false;
    const normalized = color.toLowerCase();
    if (normalized === baseColor.toLowerCase()) return false;
    return getColorDistance(baseColor, normalized) >= minDistance;
  }) || '';
};

const collectMetaColors = ($) => {
  const colors = [];
  const themeColor = normalizeColorValue($('meta[name="theme-color"]').attr('content') || '');
  const tileColor = normalizeColorValue($('meta[name="msapplication-TileColor"]').attr('content') || '');
  const msapplicationTileColor = normalizeColorValue($('meta[name="msapplication-TileColor"]').attr('content') || '');
  if (themeColor) colors.push(themeColor);
  if (tileColor) colors.push(tileColor);
  if (msapplicationTileColor) colors.push(msapplicationTileColor);
  return colors;
};

const extractThemeColors = async ($, baseUrl, logoUrl) => {
  logger.info(`Extracting theme colors - Logo: ${logoUrl}, BaseUrl: ${baseUrl}`);

  // COLLECT EXACT COLORS FIRST (highest priority)
  const exactColors = {
    primary: null,
    secondary: null,
    accent: null,
    background: null,
    text: null
  };

  // 1. Priority 1: CSS custom properties (--primary, --brand, etc.)
  const cssTexts = await collectExternalCssTexts($, baseUrl);
  const cssVariables = {};
  const cssColorValues = [];

  cssTexts.forEach((cssText) => {
    // Parse CSS variables
    const varMatches = cssText.match(/--([a-zA-Z][a-zA-Z0-9-]*)\s*:\s*([^;]+)/g);
    if (varMatches) {
      varMatches.forEach(match => {
        const [key, value] = match.split(':');
        const varName = key.trim().substring(2);
        const varValue = value.trim();
        if (varName && varValue) {
          cssVariables[varName] = normalizeColorValue(varValue);
        }
      });
    }

    // Parse regular color declarations
    const colorMatches = cssText.match(/(?:color|background(?:-color)?|border(?:-color)?|fill|stroke)\s*:\s*(#[A-Fa-f0-9]{3,6}|rgba?\([^)]+\))/gi);
    if (colorMatches) {
      colorMatches.forEach(match => {
        const color = match.split(':')[1].trim();
        cssColorValues.push(normalizeColorValue(color));
      });
    }
  });

  // Check for primary color variables
  const primaryVarPatterns = ['primary', 'brand', 'theme', 'main', 'color-primary', 'brand-primary', '--primary'];
  const secondaryVarPatterns = ['secondary', 'accent', 'color-secondary', 'brand-secondary', '--secondary'];

  for (const [varName, colorValue] of Object.entries(cssVariables)) {
    const lowerName = varName.toLowerCase();
    if (!exactColors.primary && primaryVarPatterns.some(p => lowerName.includes(p))) {
      exactColors.primary = colorValue;
    }
    if (!exactColors.secondary && secondaryVarPatterns.some(p => lowerName.includes(p))) {
      exactColors.secondary = colorValue;
    }
    if (!exactColors.accent && lowerName.includes('accent')) {
      exactColors.accent = colorValue;
    }
  }

  // 2. Priority 2: Meta theme colors
  const metaTheme = $('meta[name="theme-color"]').attr('content');
  if (metaTheme && !exactColors.primary) {
    exactColors.primary = normalizeColorValue(metaTheme);
  }

  const metaMsTile = $('meta[name="msapplication-TileColor"]').attr('content');
  if (metaMsTile && !exactColors.secondary) {
    exactColors.secondary = normalizeColorValue(metaMsTile);
  }

  // 3. Priority 3: Button colors (most reliable for primary)
  if (!exactColors.primary) {
    const primaryBtns = $('.btn-primary, .button-primary, .cta-button, button[class*="primary"]');
    for (let i = 0; i < primaryBtns.length; i++) {
      const style = $(primaryBtns[i]).attr('style') || '';
      const match = style.match(/background(?:-color)?:\s*([#][0-9a-fA-F]{3,6}|rgba?\([^)]+\))/i);
      if (match) {
        exactColors.primary = normalizeColorValue(match[1]);
        if (exactColors.primary) break;
      }
    }
  }

  // 4. Priority 4: Logo colors (last resort for primary)
  let logoPalette = [];
  if (!exactColors.primary && logoUrl) {
    logoPalette = (await extractBrandColorsFromLogo(logoUrl)) || [];
    if (logoPalette.length > 0) {
      exactColors.primary = logoPalette[0];
      if (logoPalette.length > 1) exactColors.secondary = logoPalette[1];
    }
  }

  // Ensure we have valid colors
  const primaryColor = exactColors.primary || generateAccentColor('#7c3aed');
  const secondaryColor = exactColors.secondary || getDistinctColor(primaryColor, [primaryColor], 35) || generateSecondaryColor(primaryColor);

  // Extract exact background and text colors from body
  const bodyBg = $('body').css('background-color');
  const bodyText = $('body').css('color');
  const backgroundColor = exactColors.background || normalizeColorValue(bodyBg) || '#ffffff';
  const textColor = exactColors.text || normalizeColorValue(bodyText) || '#1f2937';

  // Extract component colors
  let navColors = { palette: [] }, headerColors = { palette: [] }, footerColors = { palette: [] }, componentButtonColors = { palette: [] };
  try {
    navColors = await extractComponentColors($, baseUrl, 'nav');
    headerColors = await extractComponentColors($, baseUrl, 'header');
    footerColors = await extractComponentColors($, baseUrl, 'footer');
    componentButtonColors = await extractComponentColors($, baseUrl, '.btn, button, a.btn, a.button');
  } catch (e) {
    logger.debug(`Component color extraction error: ${e.message}`);
  }

  logger.info(`Exact colors extracted - Primary: ${primaryColor}, Secondary: ${secondaryColor}`);

  return {
    primaryColor,
    secondaryColor,
    accentColor: exactColors.accent || generateAccentColor(primaryColor),
    backgroundColor,
    textColor,
    confidence: exactColors.primary ? 'high' : 'medium',
    buttonColors: {
      primaryBg: primaryColor,
      primaryText: getContrastingTextColor(primaryColor),
      secondaryBg: secondaryColor,
      secondaryText: getContrastingTextColor(secondaryColor)
    },
    componentColors: {
      nav: navColors,
      header: headerColors,
      footer: footerColors,
      buttons: componentButtonColors
    },
    colors: [primaryColor, secondaryColor, ...logoPalette, ...cssColorValues].filter(Boolean),
    exactCssVariables: cssVariables
  };
};

/**
 * Fetches and extracts metadata from a website URL.
 * Used for "Quick Inspect" before generating a page.
 */
const inspectWebsite = async (url) => {
  try {
    const response = await axios.get(url, {
      timeout: 30000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
      }
    });

    const $ = cheerio.load(response.data);
    const urlObj = new URL(url);

    // 1. Basic SEO
    const title = $('title').text().trim() || $('meta[property="og:title"]').attr('content') || '';
    const description = $('meta[name="description"]').attr('content') || $('meta[property="og:description"]').attr('content') || '';

    // 2. Favicon (extract first for fallback)
    let favicon = $('link[rel="icon"]').attr('href') ||
      $('link[rel="shortcut icon"]').attr('href') ||
      $('link[rel="apple-touch-icon"]').attr('href');
    if (favicon && !favicon.startsWith('http')) {
      favicon = new URL(favicon, url).href;
    }
    if (!favicon) {
      favicon = `${urlObj.origin}/favicon.ico`;
    }

    // 3. Logo with favicon fallback
    let logo = findHeaderLogoImage($, url) || await findBestLogo($, url, favicon) || $('meta[property="og:image"]').attr('content') || $('link[rel="image_src"]').attr('href') || '';
    if (logo && !logo.startsWith('http') && !logo.startsWith('data:')) {
      try {
        logo = new URL(logo, url).href;
      } catch (e) {
        logger.debug(`Failed to resolve logo URL ${logo}: ${e.message}`);
      }
    }

    if (!logo && favicon) {
      logo = favicon;
    }

    // 4. Color Extraction with exact colors
    const theme = await extractThemeColors($, url, logo);
    const suggestedColors = uniqueHexColors([
      ...(theme.colors || []),
      theme.primaryColor,
      theme.secondaryColor
    ]);

    // 5. Fonts
    const fonts = [];
    $('link[href*="fonts.googleapis.com"], link[href*="fonts.gstatic.com"]').each((i, el) => {
      const href = $(el).attr('href');
      const match = href.match(/family=([^&:]+)/);
      if (match) fonts.push(match[1].replace(/\+/g, ' '));
    });

    // 6. Main Content (for AI context)
    const bodyText = $('body').clone();
    bodyText.find('script, style, nav, footer, noscript, iframe, svg').remove();
    const cleanText = bodyText.text().replace(/\s+/g, ' ').trim().substring(0, 5000);

    // 7. Social Links
    const socialLinks = {};
    $('a[href*="facebook.com"], a[href*="twitter.com"], a[href*="linkedin.com"], a[href*="instagram.com"]').each((i, el) => {
      const href = $(el).attr('href');
      if (href.includes('facebook.com')) socialLinks.facebook = href;
      if (href.includes('twitter.com') || href.includes('x.com')) socialLinks.twitter = href;
      if (href.includes('linkedin.com')) socialLinks.linkedin = href;
      if (href.includes('instagram.com')) socialLinks.instagram = href;
    });

    return {
      url,
      title,
      description,
      favicon,
      logo,
      fonts: [...new Set(fonts)],
      primaryColor: theme.primaryColor,
      secondaryColor: theme.secondaryColor,
      accentColor: theme.accentColor,
      backgroundColor: theme.backgroundColor,
      textColor: theme.textColor,
      colors: theme.colors,
      componentColors: theme.componentColors,
      navColors: theme.componentColors.nav,
      headerColors: theme.componentColors.header,
      footerColors: theme.componentColors.footer,
      buttonColors: theme.componentColors.buttons,
      suggestedColors,
      socialLinks,
      rawContent: cleanText,
      exactCssVariables: theme.exactCssVariables
    };
  } catch (err) {
    logger.error(`Scraping failed for ${url}: ${err.message}`);
    throw new Error(`Failed to access website: ${err.message}`);
  }
};

function rgbToHex(color) {
  if (!color || typeof color !== 'string') return '';
  const normalized = color.trim().toLowerCase();

  const hexMatch = normalized.match(/^#([a-f0-9]{3}|[a-f0-9]{6})$/i);
  if (hexMatch) {
    let hex = hexMatch[1].toLowerCase();
    if (hex.length === 3) {
      hex = hex.split('').map((ch) => ch + ch).join('');
    }
    return `#${hex}`;
  }

  const rgbMatch = normalized.match(/^rgba?\(\s*(\d{1,3})[\s,]+(\d{1,3})[\s,]+(\d{1,3})/i);
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1], 10).toString(16).padStart(2, '0');
    const g = parseInt(rgbMatch[2], 10).toString(16).padStart(2, '0');
    const b = parseInt(rgbMatch[3], 10).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`;
  }
  return color;
}

// Helper to calculate color distance (simple Euclidean)
function getColorDistance(hex1, hex2) {
  if (!hex1 || !hex2 || !hex1.startsWith('#') || !hex2.startsWith('#')) return 0;

  const r1 = parseInt(hex1.slice(1, 3), 16);
  const g1 = parseInt(hex1.slice(3, 5), 16);
  const b1 = parseInt(hex1.slice(5, 7), 16);

  const r2 = parseInt(hex2.slice(1, 3), 16);
  const g2 = parseInt(hex2.slice(3, 5), 16);
  const b2 = parseInt(hex2.slice(5, 7), 16);

  return Math.sqrt(
    Math.pow(r1 - r2, 2) +
    Math.pow(g1 - g2, 2) +
    Math.pow(b1 - b2, 2)
  );
}

// Helper to get saturation
function getSaturation(hex) {
  if (!hex || !hex.startsWith('#') || hex.length < 7) return 0;
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;

  return max === 0 ? 0 : d / max;
}

function isNeutralColor(hex) {
  if (!hex || !hex.startsWith('#') || hex.length < 7) return true;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  // Stricter neutral check: check if R, G, B are very close to each other
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;

  // If r, g, b are within 30 units of each other, it's likely a grey/white/black
  if (diff < 30) return true;

  // Filter out extremes
  if (max < 40) return true; // Too dark
  if (min > 230) return true; // Too light

  return false;
}

/**
 * Analyzes a website and returns AI-generated landing page options.
 * This is the full generation step.
 */
const analyzeWebsite = async (websiteUrl) => {
  const metadata = await inspectWebsite(websiteUrl);
  const aiHelper = require('./aiService');

  const prompt = `
    Analyze the following metadata extracted from ${websiteUrl} and create a PREMIUM, high-converting landing page.
    
    WEBSITE METADATA:
    Title: ${metadata.title}
    Description: ${metadata.description}
    Detected Fonts: ${metadata.fonts.join(', ')}
    Main Content: ${metadata.rawContent}
    
    DIRECTIONS:
    1. Extract the essence of their brand (colors, tone, value proposition).
    2. Create an improved structure that follows current 2026 SaaS/Service landing page trends.
    3. Use their existing content as context but rewrite everything for maximum conversion.
    4. MUST return a JSON with fullHtml and fullCss.
  `;

  return await aiHelper.generateLandingPageContent({
    businessName: metadata.title.split('|')[0].trim(),
    industry: 'Business Service',
    pageType: 'lead generation',
    businessDescription: metadata.description || metadata.rawContent.substring(0, 200),
    logoUrl: metadata.logo,
    primaryColor: metadata.primaryColor,
    secondaryColor: metadata.secondaryColor,
    navColors: metadata.navColors,
    headerColors: metadata.headerColors,
    footerColors: metadata.footerColors,
    buttonColors: metadata.buttonColors,
    aiPrompt: `${prompt}

    ADDITIONAL STYLE NOTES:
    - Use the source website's header and footer palette for the top navigation and bottom footer styling.
    - Keep the landing page's header/footer visual tone aligned with the original site brand colors.
    - Prefer strong contrast for nav/footer text when using dark brand backgrounds.
  `
  });
};

/**
 * Deterministic brand color analysis
 * Prioritizes logo colors and CSS file colors as requested
 */
// const analyzeBrandColors = async ($, logoUrl) => {
//   let primaryColor = '';
//   let secondaryColor = '';
//   let confidence = 'low';
//   const buttonColors = { primaryBg: '', primaryText: '', primaryHover: '', secondaryBg: '', secondaryText: '' };

//   // PRIORITY 1: Logo colors (as requested - primary source)
//   if (logoUrl) {
//     try {
//       logger.info(`Extracting colors from logo: ${logoUrl}`);
//       const logoColors = await extractBrandColorsFromLogo(logoUrl);
//       logger.info(`Logo colors extracted: ${JSON.stringify(logoColors)}`);
//       if (logoColors && logoColors.length > 0) {
//         primaryColor = logoColors[0];
//         if (logoColors.length > 1) {
//           secondaryColor = logoColors[1];
//         }
//         confidence = 'high';
//       }
//     } catch (e) {
//       logger.warn(`Logo color extraction failed: ${e.message}`);
//     }
//   } else {
//     logger.warn('No logo URL provided for color extraction');
//   }

//   // PRIORITY 2: CSS variables (--primary, --secondary, --brand, --main)
//   if (!primaryColor) {
//     let cssColorsFound = [];
//     $('style').each((i, el) => {
//       const styleContent = $(el).html();

//       // Common brand variables
//       const patterns = [
//         /--(?:primary|brand|main|accent|theme|theme-primary|primary-color)[^:]*:\s*([#]?[a-fA-F0-9]{3,6}|rgb\([^)]+\))/gi,
//         /--(?:secondary|theme-secondary|secondary-color)[^:]*:\s*([#]?[a-fA-F0-9]{3,6}|rgb\([^)]+\))/gi
//       ];

//       patterns.forEach((pattern, pIdx) => {
//         let match;
//         while ((match = pattern.exec(styleContent)) !== null) {
//           const color = rgbToHex(match[1].trim());
//           if (!isNeutralColor(color)) {
//             if (pIdx === 0 && !primaryColor) {
//               primaryColor = color;
//               confidence = 'high';
//             } else if (pIdx === 1 && !secondaryColor) {
//               secondaryColor = color;
//             }
//             cssColorsFound.push(color);
//           }
//         }
//       });
//     });
//     logger.info(`CSS variables found: ${JSON.stringify(cssColorsFound)}`);
//   }

//   // PRIORITY 3: Button classes
//   if (!primaryColor) {
//     const primarySelectors = [
//       '.btn-primary', '.button-primary', '.btn_red', '.btn_blue', '.btn_green',
//       '.button_red', '.button_blue', '.button_green', '.btn-main', '.btn-theme'
//     ];
//     for (const selector of primarySelectors) {
//       const el = $(selector).first();
//       if (el.length) {
//         // Since cheerio doesn't compute styles, look for inline style or common classes
//         const style = el.attr('style') || '';
//         const bgMatch = style.match(/background(?:-color)?:\s*([#]?[a-fA-F0-9]{3,6}|rgb\([^)]+\))/i);
//         if (bgMatch) {
//           const color = rgbToHex(bgMatch[1].trim());
//           if (!isNeutralColor(color)) {
//             primaryColor = color;
//             confidence = 'high';
//             break;
//           }
//         }
//       }
//     }
//   }

//   if (!secondaryColor) {
//     const secondaryBtnColor = $('.btn-secondary, .button-secondary').first().css('background-color');
//     logger.info(`Secondary button color: ${secondaryBtnColor}`);
//     if (secondaryBtnColor && secondaryBtnColor !== 'rgba(0, 0, 0, 0)' && secondaryBtnColor !== 'transparent') {
//       const hexColor = rgbToHex(secondaryBtnColor);
//       if (!isNeutralColor(hexColor)) {
//         secondaryColor = hexColor;
//       }
//     }
//   }

//   // PRIORITY 4: Meta theme-color
//   if (!primaryColor) {
//     const metaColor = $('meta[name="theme-color"]').attr('content')?.trim() || '';
//     if (metaColor && !isNeutralColor(metaColor)) {
//       primaryColor = rgbToHex(metaColor);
//       confidence = 'medium';
//     }
//   }

//   // PRIORITY 5: CTA/Button colors from inline styles
//   if (!primaryColor) {
//     const ctaSelectors = ['button', 'a.btn', 'a.button', '[class*="cta"]'];
//     const buttonBgColors = [];
//     const buttonTextColors = [];

//     ctaSelectors.forEach(selector => {
//       $(selector).each((i, el) => {
//         if (i >= 10) return false;
//         const style = $(el).attr('style') || '';

//         const bgMatch = style.match(/background(?:-color)?:\s*([#]?[a-fA-F0-9]{3,6}|rgb\([^)]+\))/i);
//         if (bgMatch) {
//           const color = rgbToHex(bgMatch[1].trim());
//           if (!isNeutralColor(color)) {
//             buttonBgColors.push(color);
//           }
//         }

//         const textMatch = style.match(/color:\s*([#]?[a-fA-F0-9]{3,6}|rgb\([^)]+\))/i);
//         if (textMatch) {
//           const color = rgbToHex(textMatch[1].trim());
//           if (!isNeutralColor(color)) {
//             buttonTextColors.push(color);
//           }
//         }
//       });
//     });

//     if (buttonBgColors.length > 0) {
//       const colorCounts = {};
//       buttonBgColors.forEach(color => {
//         colorCounts[color] = (colorCounts[color] || 0) + 1;
//       });
//       const sorted = Object.entries(colorCounts).sort((a, b) => b[1] - a[1]);
//       if (sorted.length > 0) {
//         primaryColor = sorted[0][0];
//         confidence = 'high';
//       }
//       if (sorted.length > 1) {
//         secondaryColor = sorted[1][0];
//       }
//     }

//     // Store button colors for theme system
//     if (buttonBgColors.length > 0) {
//       const colorCounts = {};
//       buttonBgColors.forEach(color => {
//         colorCounts[color] = (colorCounts[color] || 0) + 1;
//       });
//       const sorted = Object.entries(colorCounts).sort((a, b) => b[1] - a[1]);
//       if (sorted.length > 0) {
//         buttonColors.primaryBg = sorted[0][0];
//         buttonColors.primaryHover = generateHoverColor(sorted[0][0]);
//       }
//       if (sorted.length > 1) {
//         buttonColors.secondaryBg = sorted[1][0];
//       }
//     }
//     if (buttonTextColors.length > 0) {
//       const colorCounts = {};
//       buttonTextColors.forEach(color => {
//         colorCounts[color] = (colorCounts[color] || 0) + 1;
//       });
//       const sorted = Object.entries(colorCounts).sort((a, b) => b[1] - a[1]);
//       if (sorted.length > 0) {
//         buttonColors.primaryText = sorted[0][0];
//       }
//     }
//   }

//   // Fallback: if still no secondary color, use button text color
//   if (!secondaryColor && buttonColors.primaryText) {
//     secondaryColor = buttonColors.primaryText;
//   }

//   // Ultimate fallback: if still no colors, use common brand colors
//   if (!primaryColor) {
//     primaryColor = '#7c3aed'; // Default purple
//     confidence = 'low';
//   }
//   if (!secondaryColor) {
//     secondaryColor = '#6366f1'; // Default indigo
//   }

//   logger.info(`Final colors - Primary: ${primaryColor}, Secondary: ${secondaryColor}, Confidence: ${confidence}`);

//   return {
//     primaryColor,
//     secondaryColor,
//     confidence,
//     buttonColors
//   };
// };

const analyzeBrandColors = async ($, logoUrl, baseUrl) => {
  const theme = await extractThemeColors($, baseUrl, logoUrl);
  logger.info(`Brand colors detected: primary=${theme.primaryColor}, secondary=${theme.secondaryColor}`);
  return theme;
}

// Industry classification uses keyword matching only (see detectIndustryFromServices / detectSubIndustryFromServices)

/**
 * Universal website analysis and landing page generation system
 */
const extractProjectData = async (url) => {
  try {
    // Normalize URL - ensure it has a protocol
    let normalizedUrl = url.trim();
    if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
      normalizedUrl = 'https://' + normalizedUrl;
    }

    let response;
    // Shared headers that mimic a real browser — reduces 403s on bot-detecting CDNs
    const BROWSER_HEADERS = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none',
      'Sec-Fetch-User': '?1',
      'Cache-Control': 'max-age=0',
      'Referer': 'https://www.google.com/',
    };

    try {
      // Strategy 1: direct fetch (fast, works for most sites)
      response = await axios.get(normalizedUrl, { timeout: 20000, headers: BROWSER_HEADERS });
    } catch (firstErr) {
      const isHardFail = /4\d\d/.test(String(firstErr.response?.status));
      if (isHardFail) {
        // 403/404/410 etc. — retrying with the same URL won't help, fall through to partial analysis
        logger.warn(`[analyzeService] Fetch blocked (${firstErr.response?.status}) for ${normalizedUrl} — continuing with partial data`);
      } else {
        // Timeout or network error — try www. variant if bare domain, then extend timeout once
        logger.debug(`[analyzeService] First fetch failed (${firstErr.message}), retrying ${normalizedUrl}…`);
        try {
          const urlObj = new URL(normalizedUrl);
          // If already has www, try without it; if not, try adding it
          const altHost = urlObj.hostname.startsWith('www.')
            ? urlObj.hostname.slice(4)
            : 'www.' + urlObj.hostname;
          const altUrl = normalizedUrl.replace(urlObj.hostname, altHost);
          response = await axios.get(altUrl, { timeout: 30000, headers: BROWSER_HEADERS });
        } catch (altErr) {
          logger.warn(`[analyzeService] Both fetch attempts failed for ${normalizedUrl}: ${altErr.message} — continuing with partial data`);
        }
      }
    }

    // If we still have no response, build partial data from what we already know
    // rather than returning fully generated fake content
    if (!response) {
      const domainParts = new URL(normalizedUrl).hostname.replace('www.', '').split('.');
      const rawName = domainParts[0] || 'My Brand';
      const projectName = rawName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      logger.warn(`[analyzeService] No HTML retrieved for ${normalizedUrl} — returning domain-derived partial data`);
      // Return minimal partial data — no fake generated colors or services
      // brandingService (Playwright) will still run separately and may succeed
      return {
        websiteUrl: normalizedUrl,
        projectName,
        projectDesc: '',
        projectLogo: '',
        theme: null,
        primaryColor: null,
        secondaryColor: null,
        colors: [],
        services: [],
        keywords: [],
        industry: 'General',
        themeSystem: {},
        _fetchFailed: true,   // flag so caller can detect partial result
      };
    }

    const $ = cheerio.load(response.data);

    // ============ STEP 1: CLEAN BRAND NAME EXTRACTION ============
    let projectName = '';
    try {
      // Priority 1: og:site_name
      projectName = $('meta[property="og:site_name"]').attr('content')?.trim() || '';

      // Priority 2: application-name
      if (!projectName) {
        projectName = $('meta[name="application-name"]').attr('content')?.trim() || '';
      }

      // Priority 3: Logo alt text (cleaned)
      if (!projectName) {
        const logoAlt = $('img[alt*="logo" i], img[class*="logo" i], img[src*="logo" i]').first().attr('alt') || '';
        projectName = logoAlt.replace(/logo/gi, '').trim();
      }

      // Priority 4: Title cleaning
      if (!projectName) {
        const title = $('title').text().trim();
        if (title) {
          const parts = title.split(/[|:\-]/).map(p => p.trim());
          const meaningfulParts = parts.filter(p =>
            p.length > 2 &&
            p.length < 30 &&
            !p.includes('Home') &&
            !p.includes('Page') &&
            !p.includes('Official')
          );
          projectName = meaningfulParts.length > 0 ?
            meaningfulParts.reduce((shortest, current) => current.length < shortest.length ? current : shortest) :
            parts[0];
        }
      }

      // Priority 5: Domain fallback
      if (!projectName) {
        try {
          const domain = new URL(normalizedUrl).hostname.replace('www.', '');
          projectName = domain
            .split('.')
            .slice(0, -1)
            .join('.')
            .replace(/([a-z])([A-Z])/g, '$1 $2')
            .replace(/-/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase());
        } catch (e) {
          projectName = 'Unknown Brand';
        }
      }

      // Clean project name - remove marketing words
      projectName = projectName
        .replace(/\b(get|start|learn|discover|boost|grow|improve|transform)\b/gi, '')
        .replace(/\s+/g, ' ')
        .trim();
    } catch (e) {
      logger.warn(`Brand name extraction failed: ${e.message}`);
      projectName = normalizedUrl.split('//')[1]?.split('/')[0] || 'Unknown Brand';
    }

    // ============ STEP 2: SEO DATA EXTRACTION ============
    let projectDesc = '';
    let projectLogo = '';
    let favicon = '';

    try {
      projectDesc = $('meta[name="description"]').attr('content')?.trim() ||
        $('meta[property="og:description"]').attr('content')?.trim() || '';

      // LOGO EXTRACTION REFINEMENT: Prioritize actual logo elements over OG:Image (which is often a banner)
      const extractedLogo = findHeaderLogoImage($, normalizedUrl) || (await findBestLogo($, normalizedUrl)) || $('meta[property="og:image"]').attr('content')?.trim() || $('link[rel="image_src"]').attr('href')?.trim() || '';
      if (extractedLogo) {
        projectLogo = normalizeImageUrl(extractedLogo, normalizedUrl);
      }

      favicon = $('link[rel="icon"]').attr('href') || $('link[rel="shortcut icon"]').attr('href') || $('link[rel="apple-touch-icon"]').attr('href');
      if (favicon) {
        favicon = normalizeImageUrl(favicon, normalizedUrl);
      } else {
        favicon = `${new URL(normalizedUrl).origin}/favicon.ico`;
      }

      if (!projectLogo && favicon) {
        projectLogo = favicon;
      }
    } catch (e) {
      logger.warn(`SEO/Logo extraction failed: ${e.message}`);
    }

    // Color extraction - deterministic brand color analysis + page theme extraction
    let primaryColor = '';
    let secondaryColor = '';
    let buttonColors = { primaryBg: '', primaryText: '', primaryHover: '', secondaryBg: '', secondaryText: '' };
    let theme = { primaryColor: '', secondaryColor: '', accentColor: '', backgroundColor: '', textColor: '', colors: [], buttonColors: {}, componentColors: {} };
    const colorSet = new Set();
    let colors = [];

    try {
      theme = await extractThemeColors($, normalizedUrl, projectLogo);
      primaryColor = theme.primaryColor || primaryColor;
      secondaryColor = theme.secondaryColor || secondaryColor;
      buttonColors = { ...buttonColors, ...theme.buttonColors };
      colors = uniqueHexColors([...(theme.colors || [])]);
    } catch (e) {
      logger.warn(`Theme extraction failed: ${e.message}`);
    }

    try {
      const brandColors = await analyzeBrandColors($, projectLogo, normalizedUrl);
      primaryColor = primaryColor || brandColors.primaryColor;
      secondaryColor = secondaryColor || brandColors.secondaryColor;
      buttonColors = { ...buttonColors, ...brandColors.buttonColors };
      colors = uniqueHexColors([...(colors || []), ...(brandColors.colors || [])]);
    } catch (e) {
      logger.warn(`Color extraction failed: ${e.message}`);
    }

    if (!colors || colors.length === 0) {
      colors = [primaryColor, secondaryColor].filter(Boolean).map((value) => rgbToHex(value)).filter(Boolean);
    }

    // Hard defaults if everything failed
    if (!primaryColor) {
      primaryColor = generateAccentColor('#5b21b6');
      logger.warn(`No primary color extracted - using dynamically generated color: ${primaryColor}`);
    }
    if (!secondaryColor) {
      secondaryColor = generateSecondaryColor(primaryColor, colors);
      logger.warn(`No secondary color extracted - using dynamically generated color: ${secondaryColor}`);
    }

    // Ensure they are NEVER the same color in the final output
    if (primaryColor.toLowerCase() === secondaryColor.toLowerCase()) {
      secondaryColor = getDistinctColor(primaryColor, colors) || '#1e293b';
    }

    // ============ STEP 3: SMART SERVICE EXTRACTION ============
    const services = new Set();

    try {
      // LAYER 1: URL-based extraction
      $('a[href*="service" i], a[href*="product" i], a[href*="solution" i], a[href*="seo" i], a[href*="marketing" i], a[href*="design" i], a[href*="development" i]').each((i, el) => {
        const text = $(el).text().trim();
        if (text && text.length > 2 && text.length < 60 && !isCTA(text)) {
          services.add(text);
        }
      });

      // LAYER 2: Section-based extraction
      $('section, div, article').each((i, el) => {
        const id = $(el).attr('id')?.toLowerCase() || '';
        const cls = $(el).attr('class')?.toLowerCase() || '';

        if (id.includes('service') || id.includes('feature') || id.includes('solution') ||
          cls.includes('service') || cls.includes('feature') || cls.includes('solution') ||
          cls.includes('offering') || cls.includes('product')) {

          $(el).find('h2, h3, h4, h5, h6').each((j, item) => {
            const text = $(item).text().trim();
            if (text && text.length > 2 && text.length < 60 && !isCTA(text) && !isSentence(text)) {
              services.add(text);
            }
          });
        }
      });

      // LAYER 3: Structured lists in service sections
      $('section, div, article').each((i, el) => {
        const id = $(el).attr('id')?.toLowerCase() || '';
        const cls = $(el).attr('class')?.toLowerCase() || '';

        if (id.includes('service') || id.includes('feature') || id.includes('solution') ||
          cls.includes('service') || cls.includes('feature') || cls.includes('solution')) {

          $(el).find('li').each((j, item) => {
            const text = $(item).text().trim();
            if (text && text.length > 2 && text.length < 60 && !isCTA(text) && !isSentence(text)) {
              services.add(text);
            }
          });
        }
      });

      // LAYER 4: Schema markup extraction
      $('script[type="application/ld+json"]').each((i, el) => {
        try {
          const schema = JSON.parse($(el).text());
          if (Array.isArray(schema)) {
            schema.forEach(item => extractServicesFromSchema(item, services));
          } else {
            extractServicesFromSchema(schema, services);
          }
        } catch (e) {
          // Skip invalid JSON
        }
      });
    } catch (e) {
      logger.warn(`Service extraction failed: ${e.message}`);
    }

    // ============ STEP 4: ENHANCED KEYWORD EXTRACTION ============
    let keywords = [];
    try {
      keywords = $('meta[name="keywords"]').attr('content')?.split(',')?.map(k => k.trim()).filter(k => k) || [];

      // FALLBACK: Use keywords if no services found
      if (services.size < 3 && keywords.length > 0) {
        keywords.slice(0, 10).forEach(keyword => {
          if (keyword.length > 2 && keyword.length < 60 && !isCTA(keyword)) {
            services.add(keyword);
          }
        });
      }
    } catch (e) {
      logger.warn(`Keyword/Fallback extraction failed: ${e.message}`);
    }

    // FALLBACK: Generate services from project name
    if (services.size < 3) {
      const generatedServices = generateServicesFromProjectName(projectName);
      generatedServices.forEach(service => services.add(service));
    }

    // Clean and filter services
    const cleanedServices = [...services]
      .filter(service =>
        service.length > 2 &&
        service.length < 60 &&
        !isCTA(service) &&
        !isSentence(service) &&
        !service.includes('©') &&
        !service.includes('All rights reserved')
      )
      .slice(0, 15);

    // If no meta keywords, generate from services and content
    if (keywords.length === 0) {
      const generatedKeywords = new Set();

      // Add services as keywords
      cleanedServices.forEach(service => {
        if (service.length > 2 && service.length < 30) {
          generatedKeywords.add(service.toLowerCase());
        }
      });

      // Extract keywords from title and description
      const titleWords = projectName.toLowerCase().split(/\s+/).filter(w => w.length > 2);
      const descWords = projectDesc.toLowerCase().split(/\s+/).filter(w => w.length > 3);

      titleWords.forEach(word => generatedKeywords.add(word));
      descWords.slice(0, 10).forEach(word => generatedKeywords.add(word));

      // Common industry keywords based on content
      const content = $('body').text().toLowerCase();
      const industryKeywords = [
        'digital marketing', 'seo', 'web design', 'agency', 'marketing',
        'social media', 'ppc', 'advertising', 'branding', 'content',
        'development', 'consulting', 'strategy', 'optimization', 'analytics'
      ];

      industryKeywords.forEach(keyword => {
        if (content.includes(keyword)) {
          generatedKeywords.add(keyword);
        }
      });

      keywords = Array.from(generatedKeywords).slice(0, 15);
    }

    // Detect industry & sub-industry using keyword matching
    const detectedIndustry = detectIndustryFromServices(cleanedServices);
    const detectedSubIndustry = detectSubIndustryFromServices(cleanedServices, detectedIndustry);

    // Detect brand personality from content
    const brandPersonality = detectBrandPersonality(projectDesc, $('body').text());

    // Extract dynamic page sections from website structure
    const dynamicSections = extractDynamicSections($);

    // Generate complete advanced branding system
    const themeSystem = generateAdvancedBrandingSystem(
      projectName || 'Unknown Brand',
      detectedIndustry,
      brandPersonality,
      primaryColor,
      secondaryColor,
      buttonColors,
      colors,
      projectDesc,
      dynamicSections
    );

    // Get all extracted colors (for database storage)
    const allColors = colors.length > 0 ? colors.slice(0, 10) : [];
    if (primaryColor && !allColors.includes(primaryColor)) {
      allColors.push(primaryColor);
    }
    if (secondaryColor && !allColors.includes(secondaryColor)) {
      allColors.push(secondaryColor);
    }

    const bulkMedia = extractBulkMedia($, normalizedUrl);
    const structuredData = extractStructuredData($);

    // Add form fields to scrapedData if not already present
    if (structuredData.forms && structuredData.forms.length > 0) {
      structuredData.forms = structuredData.forms;
    }

    return {
      websiteUrl: normalizedUrl,
      projectName: projectName || 'Unknown Brand',
      projectDesc,
      projectLogo,
      theme: primaryColor, // Keep theme for backward compatibility
      primaryColor,
      secondaryColor,
      accentColor: themeSystem.colors.accent,
      backgroundColor: themeSystem.colors.background,
      textColor: themeSystem.colors.text,
      colors: allColors, // All extracted colors for database storage
      componentColors: theme.componentColors,
      navColors: theme.componentColors.nav,
      headerColors: theme.componentColors.header,
      footerColors: theme.componentColors.footer,
      buttonColors: theme.componentColors.buttons,
      themeData: theme,
      services: cleanedServices,
      keywords,
      industry: detectedIndustry,
      subIndustry: detectedSubIndustry,
      favicon,
      themeSystem, // Complete theme system for design
      scrapedData: {
        favicon,
        images: bulkMedia.images,
        videos: bulkMedia.videos,
        ...structuredData,
        rawText: $('body').text().replace(/\s+/g, ' ').trim().substring(0, 5000)
      }
    };
  } catch (err) {
    logger.error(`Extraction failed for ${url}: ${err.message}`);
    throw new Error(`Failed to extract data: ${err.message}`);
  }
};

const generateAccentColor = (primaryColor) => {
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const rgb = hexToRgb(primaryColor);
  if (!rgb) return '#f59e0b'; // Default amber

  // Generate a complementary color
  const compR = 255 - rgb.r;
  const compG = 255 - rgb.g;
  const compB = 255 - rgb.b;

  return `#${compR.toString(16).padStart(2, '0')}${compG.toString(16).padStart(2, '0')}${compB.toString(16).padStart(2, '0')}`;
};

const generateHoverColor = (color) => {
  const lightenDarkenColor = (col, amt) => {
    let usePound = false;
    if (col[0] === '#') {
      col = col.slice(1);
      usePound = true;
    }
    let num = parseInt(col, 16);
    let r = (num >> 16) + amt;
    if (r > 255) r = 255; else if (r < 0) r = 0;
    let b = ((num >> 8) & 0x00FF) + amt;
    if (b > 255) b = 255; else if (b < 0) b = 0;
    let g = (num & 0x0000FF) + amt;
    if (g > 255) g = 255; else if (g < 0) g = 0;
    return (usePound ? '#' : '') + (g | (b << 8) | (r << 16)).toString(16).padStart(6, '0');
  };

  if (!color || !color.startsWith('#')) return color;
  return lightenDarkenColor(color, -20);
};

const generateBackgroundColor = (primaryColor) => {
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const rgb = hexToRgb(primaryColor);
  if (!rgb) return '#f9fafb';

  // Generate a very light variant of the primary color for background
  const bgR = Math.min(255, rgb.r + 200);
  const bgG = Math.min(255, rgb.g + 200);
  const bgB = Math.min(255, rgb.b + 200);

  return `#${bgR.toString(16).padStart(2, '0')}${bgG.toString(16).padStart(2, '0')}${bgB.toString(16).padStart(2, '0')}`;
};

const generateTextColor = (primaryColor) => {
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const rgb = hexToRgb(primaryColor);
  if (!rgb) return '#1f2937';

  // Calculate luminance to decide if text should be dark or light
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;

  // If background is light (luminance > 0.5), use dark text, otherwise use light text
  return luminance > 0.5 ? '#1f2937' : '#f9fafb';
};

const generateSecondaryColor = (primaryColor, extractedColors = []) => {
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  // If we have extracted colors, find one that's distinct from primary
  if (extractedColors && extractedColors.length > 0) {
    const distinct = extractedColors.find(color =>
      color && color.toLowerCase() !== primaryColor.toLowerCase() &&
      getColorDistance(primaryColor, color) > 35
    );
    if (distinct) return distinct;
  }

  const rgb = hexToRgb(primaryColor);
  if (!rgb) return '#0ea5e9';

  // Generate a complementary secondary color (shift hue)
  const compR = Math.max(0, Math.min(255, rgb.r - 50));
  const compG = Math.max(0, Math.min(255, rgb.g + 80));
  const compB = Math.max(0, Math.min(255, rgb.b + 100));

  return `#${compR.toString(16).padStart(2, '0')}${compG.toString(16).padStart(2, '0')}${compB.toString(16).padStart(2, '0')}`;
};

const extractDynamicSections = ($) => {
  const sections = new Set();

  // Extract from navigation links
  $('nav a, header a, .navigation a, .menu a').each((i, el) => {
    const text = $(el).text().trim().toLowerCase();
    if (text.length > 2 && text.length < 30) {
      // Normalize section names
      const sectionName = normalizeSectionName(text);
      if (sectionName) {
        sections.add(sectionName);
      }
    }
  });

  // Extract from section IDs and classes
  $('section[id], div[id*="section"], div[class*="section"]').each((i, el) => {
    const id = $(el).attr('id')?.toLowerCase() || '';
    const cls = $(el).attr('class')?.toLowerCase() || '';

    // Extract from ID
    if (id) {
      const sectionName = normalizeSectionName(id.replace(/section|-|_/g, ' '));
      if (sectionName) {
        sections.add(sectionName);
      }
    }

    // Extract from class
    if (cls) {
      const classParts = cls.split(/\s+/);
      classParts.forEach(part => {
        if (part.includes('section') || part.includes('area') || part.includes('block')) {
          const sectionName = normalizeSectionName(part.replace(/section|area|block|-|_/g, ' '));
          if (sectionName) {
            sections.add(sectionName);
          }
        }
      });
    }
  });

  // Extract from heading structure
  $('h1, h2, h3').each((i, el) => {
    const text = $(el).text().trim().toLowerCase();
    if (text.length > 2 && text.length < 40 && i < 10) { // Limit to first 10 headings
      const sectionName = normalizeSectionName(text);
      if (sectionName) {
        sections.add(sectionName);
      }
    }
  });

  // Extract from footer links
  $('footer a').each((i, el) => {
    const text = $(el).text().trim().toLowerCase();
    if (text.length > 2 && text.length < 30) {
      const sectionName = normalizeSectionName(text);
      if (sectionName) {
        sections.add(sectionName);
      }
    }
  });

  // Convert to array and ensure common sections are present
  const sectionArray = Array.from(sections);

  // Ensure hero is present (almost always needed)
  if (!sectionArray.includes('hero')) {
    sectionArray.unshift('hero');
  }

  // Ensure contact/cta is present
  if (!sectionArray.includes('contact') && !sectionArray.includes('cta')) {
    sectionArray.push('cta');
  }

  // Limit to reasonable number
  return sectionArray.slice(0, 8);
};

const normalizeSectionName = (text) => {
  // Common section mappings
  const sectionMappings = {
    'home': 'hero',
    'main': 'hero',
    'about us': 'about',
    'our story': 'about',
    'what we do': 'services',
    'our work': 'portfolio',
    'case studies': 'portfolio',
    'our team': 'team',
    'get in touch': 'contact',
    'reach us': 'contact',
    'pricing plans': 'pricing',
    'our prices': 'pricing',
    'testimonials': 'reviews',
    'customer reviews': 'reviews',
    'faq': 'faq',
    'questions': 'faq',
    'blog': 'blog',
    'news': 'blog',
    'products': 'products',
    'shop': 'products',
    'features': 'features'
  };

  const normalized = text.trim().toLowerCase();

  // Check if it matches a known section
  if (sectionMappings[normalized]) {
    return sectionMappings[normalized];
  }

  // Check for partial matches
  for (const [key, value] of Object.entries(sectionMappings)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return value;
    }
  }

  // Return original if no mapping found
  // Filter out common non-section words
  const nonSectionWords = ['click', 'here', 'read', 'more', 'view', 'all', 'see', 'get', 'now', 'learn', 'about'];
  if (nonSectionWords.some(word => normalized === word)) {
    return null;
  }

  return normalized.replace(/\s+/g, '-');
};

const detectBrandPersonality = (description, bodyText) => {
  const text = (description + ' ' + bodyText).toLowerCase();

  const personalityIndicators = {
    'Professional': ['professional', 'expert', 'experienced', 'quality', 'reliable', 'trusted', 'certified', 'licensed'],
    'Corporate': ['enterprise', 'corporate', 'business', 'global', 'international', ' Fortune', 'industry leader'],
    'Modern': ['innovative', 'cutting-edge', 'modern', 'contemporary', 'forward-thinking', 'disruptive', 'revolutionary'],
    'Minimal': ['simple', 'clean', 'minimal', 'essential', 'streamlined', 'focused', 'clarity'],
    'Tech-focused': ['technology', 'software', 'digital', 'platform', 'app', 'saas', 'cloud', 'ai', 'automation'],
    'Local Service': ['local', 'community', 'neighborhood', 'nearby', 'serving', 'your area', 'hometown'],
    'Premium': ['premium', 'luxury', 'exclusive', 'high-end', 'elite', 'bespoke', 'custom', 'premium quality']
  };

  let scores = {};
  for (const [personality, indicators] of Object.entries(personalityIndicators)) {
    scores[personality] = indicators.reduce((count, indicator) => {
      return count + (text.includes(indicator) ? 1 : 0);
    }, 0);
  }

  // Find highest scoring personality
  const maxScore = Math.max(...Object.values(scores));
  if (maxScore === 0) return 'Professional'; // Default fallback

  return Object.entries(scores).find(([_, score]) => score === maxScore)[0];
};

const generateAdvancedBrandingSystem = (projectName, industry, brandPersonality, primaryColor, secondaryColor, buttonColors, extractedColors, description, dynamicSections) => {
  const rgbToHex = (rgb) => {
    if (rgb.startsWith('#')) return rgb;
    const match = rgb.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (match) {
      const r = parseInt(match[1]).toString(16).padStart(2, '0');
      const g = parseInt(match[2]).toString(16).padStart(2, '0');
      const b = parseInt(match[3]).toString(16).padStart(2, '0');
      return `#${r}${g}${b}`;
    }
    return rgb;
  };

  const lightenDarkenColor = (col, amt) => {
    let usePound = false;
    if (col[0] === '#') {
      col = col.slice(1);
      usePound = true;
    }
    let num = parseInt(col, 16);
    let r = (num >> 16) + amt;
    if (r > 255) r = 255; else if (r < 0) r = 0;
    let b = ((num >> 8) & 0x00FF) + amt;
    if (b > 255) b = 255; else if (b < 0) b = 0;
    let g = (num & 0x0000FF) + amt;
    if (g > 255) g = 255; else if (g < 0) g = 0;
    return (usePound ? '#' : '') + (g | (b << 8) | (r << 16)).toString(16).padStart(6, '0');
  };

  // Ensure colors are in HEX format
  const primary = primaryColor ? rgbToHex(primaryColor) : '#7c3aed';
  const secondary = secondaryColor ? rgbToHex(secondaryColor) : '#6366f1';

  // Accent color - use button color if available and distinct, otherwise generate
  let accent = buttonColors.primaryBg && buttonColors.primaryBg !== primary ? buttonColors.primaryBg : generateAccentColor(primary);
  accent = rgbToHex(accent);

  // Background color - clean white/light
  const background = '#ffffff';

  // Text color - high readability
  const text = '#1f2937';

  // UI mapping based on brand personality
  const uiMapping = {
    buttonPrimary: 'accent',
    buttonSecondary: 'primary',
    headerBackground: brandPersonality === 'Minimal' ? 'background' : 'primary',
    sectionAltBackground: brandPersonality === 'Modern' ? 'secondary' : 'background'
  };

  // Font suggestions based on personality
  const fontSuggestions = {
    'Professional': { heading: 'Inter, system-ui, sans-serif', body: 'Inter, system-ui, sans-serif' },
    'Corporate': { heading: 'Georgia, serif', body: 'Arial, sans-serif' },
    'Modern': { heading: 'Poppins, system-ui, sans-serif', body: 'Inter, system-ui, sans-serif' },
    'Minimal': { heading: 'Helvetica Neue, sans-serif', body: 'Helvetica Neue, sans-serif' },
    'Tech-focused': { heading: 'Roboto Mono, monospace', body: 'Inter, system-ui, sans-serif' },
    'Local Service': { heading: 'Open Sans, sans-serif', body: 'Open Sans, sans-serif' },
    'Premium': { heading: 'Playfair Display, serif', body: 'Lato, sans-serif' }
  };

  const fonts = fontSuggestions[brandPersonality] || fontSuggestions['Professional'];

  // Use dynamically extracted sections from website structure
  const sections = dynamicSections && dynamicSections.length > 0
    ? dynamicSections
    : ['hero', 'services', 'about', 'testimonials', 'cta']; // Fallback

  // Generate headline from description
  const headline = description ? description.split('.')[0].substring(0, 60) : projectName;
  const subheadline = description ? description.substring(0, 120) : `Leading ${industry} solutions`;

  return {
    projectName,
    industry,
    brandPersonality,
    colors: {
      primary,
      secondary,
      accent,
      background,
      text
    },
    uiMapping,
    fonts,
    landingPage: {
      headline,
      subheadline,
      sections
    }
  };
};

const isCTA = (text) => {
  const ctaWords = ['get', 'start', 'learn', 'discover', 'boost', 'grow', 'improve', 'transform', 'contact', 'call', 'email'];
  const lowerText = text.toLowerCase();
  return ctaWords.some(word => lowerText.includes(word));
};

const isSentence = (text) => {
  return text.length > 60 || text.includes('.') || text.includes('?') || text.includes('!');
};

const extractServicesFromSchema = (schema, services) => {
  if (schema['@type'] === 'Service' || schema['@type'] === 'Product') {
    if (schema.name) services.add(schema.name);
    if (schema.serviceType) services.add(schema.serviceType);
    if (schema.category) services.add(schema.category);
  }

  if (schema.offers && Array.isArray(schema.offers)) {
    schema.offers.forEach(offer => {
      if (offer.itemOffered && offer.itemOffered.name) {
        services.add(offer.itemOffered.name);
      }
    });
  }
};

const { Vibrant } = require('node-vibrant/node');

/**
 * Extract fill/stroke hex colors directly from raw SVG markup.
 * These are exact brand colors — more reliable than Vibrant palette sampling.
 */
const extractColorsFromSvgMarkup = (svgMarkup) => {
  const colors = new Set();
  const attrRe = /(?:fill|stroke)="(#[0-9a-fA-F]{3,6})"/gi;
  const styleRe = /(?:fill|stroke)\s*:\s*(#[0-9a-fA-F]{3,6})/gi;
  let m;
  while ((m = attrRe.exec(svgMarkup)) !== null) {
    const c = normalizeColorValue(m[1]);
    if (c && !isNeutralColor(c)) colors.add(c);
  }
  while ((m = styleRe.exec(svgMarkup)) !== null) {
    const c = normalizeColorValue(m[1]);
    if (c && !isNeutralColor(c)) colors.add(c);
  }
  return Array.from(colors);
};

const extractBrandColorsFromLogo = async (logoUrl) => {
  try {
    let imageBuffer;
    let svgMarkup = null;
    if (!logoUrl) return null;

    if (logoUrl.startsWith('data:')) {
      const match = logoUrl.match(/^data:([^;]+);base64,(.*)$/);
      if (!match) return null;
      const mimeType = match[1];
      imageBuffer = Buffer.from(match[2], 'base64');

      // Fix: use .includes('svg') to handle 'image/svg+xml' and edge-case variants
      if (mimeType.includes('svg')) {
        svgMarkup = imageBuffer.toString('utf8');
        const resvg = new Resvg(imageBuffer, { fitTo: { mode: 'width', value: 256 } });
        imageBuffer = resvg.render().asPng();
      }
    } else if (logoUrl.startsWith('http')) {
      const response = await axios.get(logoUrl, {
        responseType: 'arraybuffer',
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        },
      });
      let buf = Buffer.from(response.data);

      const contentType = response.headers['content-type'] || '';
      if (contentType.includes('svg') || logoUrl.match(/\.svg(\?|$)/i)) {
        svgMarkup = buf.toString('utf8');
        const resvg = new Resvg(buf, { fitTo: { mode: 'width', value: 256 } });
        buf = resvg.render().asPng();
      }
      imageBuffer = buf;
    }

    // Priority 1: extract colors directly from SVG markup (exact brand colors)
    if (svgMarkup) {
      const svgColors = extractColorsFromSvgMarkup(svgMarkup);
      if (svgColors.length > 0) {
        logger.info(`SVG direct colors extracted: ${svgColors.slice(0, 3).join(', ')}`);
        // Still run Vibrant as supplementary but prefer SVG-native colors
        try {
          const resizedBuffer = await sharp(imageBuffer)
            .resize(250, 250, { fit: 'inside', withoutEnlargement: true })
            .png()
            .toBuffer();
          const palette = await Vibrant.from(resizedBuffer).maxColorCount(64).getPalette();
          const vibrantColors = Object.values(palette)
            .filter((swatch) => swatch && swatch.hex)
            .sort((a, b) => (b._population || 0) - (a._population || 0))
            .map((swatch) => swatch.hex)
            .filter(Boolean);
          // Merge: SVG-native first, then any distinct Vibrant colors not already present
          const merged = [...svgColors];
          for (const vc of vibrantColors) {
            if (!merged.some((c) => c.toLowerCase() === vc.toLowerCase())) merged.push(vc);
          }
          return merged.slice(0, 3);
        } catch (_) {
          return svgColors.slice(0, 3);
        }
      }
    }

    // Priority 2: Vibrant palette for raster logos
    const resizedBuffer = await sharp(imageBuffer)
      .resize(250, 250, { fit: 'inside', withoutEnlargement: true })
      .png()
      .toBuffer();

    const palette = await Vibrant.from(resizedBuffer).maxColorCount(64).getPalette();
    const colors = Object.values(palette)
      .filter((swatch) => swatch && swatch.hex)
      .sort((a, b) => (b._population || 0) - (a._population || 0))
      .map((swatch) => swatch.hex)
      .filter(Boolean);

    if (!colors || colors.length === 0) {
      return null;
    }

    return colors.slice(0, 3);
  } catch (error) {
    logger.warn(`Failed to extract color from logo (${logoUrl}): ${error.message}`);
    return null;
  }
};

const extractColorsFromPageAssets = async ($, baseUrl, maxImages = 12) => {
  try {
    const urls = new Set();

    // Collect <img> sources
    $('img').each((i, el) => {
      const src = ($(el).attr('src') || $(el).attr('data-src') || $(el).attr('data-lazy-src') || '').trim();
      if (src) urls.add(normalizeImageUrl(src, baseUrl));
    });

    // Collect background-image from inline styles
    $('[style]').each((i, el) => {
      const style = ($(el).attr('style') || '').toString();
      const match = style.match(/background(?:-image)?\s*:\s*url\(([^)]+)\)/i);
      if (match && match[1]) {
        const raw = match[1].replace(/['"\s]/g, '');
        urls.add(normalizeImageUrl(raw, baseUrl));
      }
    });

    // Targeted selectors for nav, footer, buttons, hero, cta
    const selectors = ['header', 'nav', 'footer', '.hero', '.masthead', '.site-banner', '.cta', 'button', 'a.btn', '.btn', '.banner'];
    selectors.forEach((sel) => {
      $(sel).find('img').each((i, el) => {
        const s = ($(el).attr('src') || '').trim();
        if (s) urls.add(normalizeImageUrl(s, baseUrl));
      });
    });

    // Also parse external CSS for url(...) occurrences
    const cssTexts = await collectExternalCssTexts($, baseUrl);
    cssTexts.forEach((cssText) => {
      const urlRegex = /url\(([^)]+)\)/gi;
      let m;
      while ((m = urlRegex.exec(cssText)) !== null) {
        const raw = (m[1] || '').replace(/['"\s]/g, '');
        if (raw && !/^data:/i.test(raw)) urls.add(normalizeImageUrl(raw, baseUrl));
      }
    });

    // Filter and limit URLs
    const finalUrls = Array.from(urls).filter(Boolean).slice(0, maxImages);
    const allColors = [];

    for (const u of finalUrls) {
      try {
        const resp = await axios.get(u, {
          responseType: 'arraybuffer',
          timeout: 10000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36',
            'Accept': 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
            'Referer': baseUrl,
            'Sec-Fetch-Dest': 'image',
            'Sec-Fetch-Mode': 'no-cors',
            'Sec-Fetch-Site': 'cross-site'
          },
          maxRedirects: 5
        });
        const buf = Buffer.from(resp.data);
        const resized = await sharp(buf).resize(300, 300, { fit: 'inside', withoutEnlargement: true }).png().toBuffer();
        const palette = await Vibrant.from(resized).maxColorCount(64).getPalette();
        Object.values(palette).forEach((sw) => {
          if (sw && sw.hex) allColors.push(sw.hex);
        });
      } catch (e) {
        logger.debug(`Failed to extract colors from page asset ${u}: ${e.message}`);
      }
    }

    return uniqueHexColors(allColors);
  } catch (err) {
    logger.warn(`extractColorsFromPageAssets failed: ${err.message}`);
    return [];
  }
};

const extractComponentColors = async ($, baseUrl, selector, maxImages = 6) => {
  try {
    // Inline style colors inside the selector
    const inlineColors = collectInlineStyleColors($, [selector]);

    // Gather image/background-image URLs inside the selector
    const urls = new Set();
    $(selector).find('img').each((i, el) => {
      const src = ($(el).attr('src') || $(el).attr('data-src') || '').trim();
      if (src) urls.add(normalizeImageUrl(src, baseUrl));
    });
    $(selector).find('[style]').each((i, el) => {
      const style = ($(el).attr('style') || '').toString();
      const m = style.match(/url\(([^)]+)\)/i);
      if (m && m[1]) {
        const raw = m[1].replace(/['"\s]/g, '');
        urls.add(normalizeImageUrl(raw, baseUrl));
      }
    });

    const final = Array.from(urls).filter(Boolean).slice(0, maxImages);
    const palette = [];
    for (const u of final) {
      try {
        const resp = await axios.get(u, {
          responseType: 'arraybuffer',
          timeout: 10000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36',
            'Accept': 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
            'Referer': baseUrl,
            'Sec-Fetch-Dest': 'image',
            'Sec-Fetch-Mode': 'no-cors',
            'Sec-Fetch-Site': 'cross-site'
          },
          maxRedirects: 5
        });
        const buf = Buffer.from(resp.data);
        const resized = await sharp(buf).resize(300, 300, { fit: 'inside', withoutEnlargement: true }).png().toBuffer();
        const p = await Vibrant.from(resized).maxColorCount(32).getPalette();
        Object.values(p).forEach((sw) => { if (sw && sw.hex) palette.push(sw.hex); });
      } catch (e) {
        logger.debug(`component Vibrant fail ${u}: ${e.message}`);
      }
    }

    const paletteDistinct = uniqueHexColors([...(inlineColors || []), ...palette]);
    const backgroundCandidate = selectFirstNonNeutral(inlineColors) || paletteDistinct[0] || '';
    const primary = selectFirstNonNeutral(paletteDistinct) || '';
    const textColor = primary ? generateTextColor(primary) : (selectFirstNonNeutral(inlineColors) || '#1f2937');
    const hover = primary ? generateHoverColor(primary) : '';

    return {
      selector,
      palette: paletteDistinct,
      backgroundCandidate,
      primary,
      textColor,
      hover
    };
  } catch (err) {
    logger.warn(`extractComponentColors(${selector}) failed: ${err.message}`);
    return { selector, palette: [], backgroundCandidate: '', primary: '', textColor: '', hover: '' };
  }
};

const extractColorPalette = (data, channels) => {
  const colorCounts = {};

  // Step size - use smaller step for better accuracy, but keep performance
  const step = channels * 5;

  for (let i = 0; i < data.length; i += step) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = channels >= 4 ? data[i + 3] : 255;

    // Skip fully transparent pixels
    if (a < 80) continue;

    // Skip absolute extremes (white/black)
    if (r > 250 && g > 250 && b > 250) continue;
    if (r < 5 && g < 5 && b < 5) continue;

    // Simple quantization - group similar colors but keep more precision
    const quantize = (val) => Math.round(val / 8) * 8;
    const qr = quantize(r);
    const qg = quantize(g);
    const qb = quantize(b);

    // Weighted score for colors: frequency + (saturation * 2)
    // We want brand colors to be vibrant, not just common
    const maxVal = Math.max(r, g, b);
    const minVal = Math.min(r, g, b);
    const saturation = maxVal === 0 ? 0 : (maxVal - minVal) / maxVal;

    const colorKey = `${qr},${qg},${qb}`;
    // Score increases with frequency and substantially with saturation
    const weight = 1 + (saturation * 5);
    colorCounts[colorKey] = (colorCounts[colorKey] || 0) + weight;
  }

  // Sort by frequency
  const sortedColors = Object.entries(colorCounts || {})
    .sort((a, b) => b[1] - a[1])
    .map(([colorKey]) => {
      const [r, g, b] = (colorKey || '').split(',').map(Number);
      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    });

  return sortedColors;
};

const detectIndustryFromServices = (services) => {
  if (!services || services.length === 0) return 'General';

  const serviceText = services.join(' ').toLowerCase();

  // Dynamic industry detection with context-aware logic
  const industryPatterns = {
    // Home Services - context-based detection
    // Agency - marketing and creative services
    'Agency': ['marketing', 'seo', 'ppc', 'advertising', 'social media', 'content', 'branding', 'lead generation', 'campaign', 'design', 'creative', 'logo', 'graphic', 'photography', 'video production', 'web design', 'agency'],

    // SaaS / Software - technology and platform indicators
    'SaaS': ['software', 'platform', 'dashboard', 'analytics', 'automation', 'cloud', 'saas', 'subscription', 'api', 'integration', 'workflow', 'productivity', 'collaboration'],

    // Digital Marketing - marketing and advertising
    // Finance - financial services
    'Finance': ['finance', 'accounting', 'investment', 'insurance', 'lending', 'crypto', 'wealth management', 'financial', 'banking'],

    // Education - learning and training
    'Education': ['training', 'course', 'learning', 'education', 'certification', 'teaching', 'tutorial', 'online courses', 'tutoring'],

    // Technology - tech services
    'Technology': ['technology', 'ai', 'iot', 'cybersecurity', 'cloud', 'mobile', 'hardware', 'development', 'software'],

    // Consulting - professional advisory
    'Consulting': ['consulting', 'advisory', 'strategy', 'management', 'professional services'],

    // Healthcare - medical and wellness
    'Healthcare': ['medical', 'healthcare', 'doctor', 'clinic', 'hospital', 'wellness', 'therapy', 'pharmacy', 'health'],

    // Real Estate - property and housing
    'Real Estate': ['real estate', 'property', 'housing', 'rental', 'apartment', 'home buying', 'mortgage', 'listing'],

    // E-commerce - online selling
    'E-commerce': ['ecommerce', 'online store', 'shopping cart', 'product catalog', 'shipping', 'checkout', 'payment processing'],

    // Professional Services
    'Professional Services': ['consulting', 'legal', 'accounting', 'financial', 'advisory', 'professional'],

    // Education
    'Education': ['training', 'course', 'learning', 'education', 'certification', 'teaching', 'tutorial'],

    // Creative Services
    'Creative Services': ['design', 'creative', 'branding', 'logo', 'graphic', 'photography', 'video production']
  };

  // Score each industry based on keyword matches
  let scores = {};
  for (const [industry, keywords] of Object.entries(industryPatterns)) {
    scores[industry] = keywords.reduce((count, keyword) => {
      return count + (serviceText.includes(keyword) ? 1 : 0);
    }, 0);
  }

  // Find highest scoring industry
  const maxScore = Math.max(...Object.values(scores));
  if (maxScore > 0) {
    return Object.entries(scores).find(([_, score]) => score === maxScore)[0];
  }

  // Fallback to basic keyword matching
  const basicIndustryMap = {
    'web design': 'Agency',
    'development': 'Technology',
    'agency': 'Agency',
    'fitness': 'Healthcare',
    'gym': 'Healthcare',
    'insurance': 'Finance',
    'finance': 'Finance',
    'restaurant': 'Hospitality',
    'food': 'Hospitality',
    'legal': 'Legal',
    'law': 'Legal',
    'consulting': 'Consulting',
    'accounting': 'Finance',
    'real estate': 'Real Estate',
    'healthcare': 'Healthcare',
    'education': 'Education',
    'technology': 'Technology',
    'construction': 'Construction',
    'beauty': 'Beauty & Wellness',
    'wellness': 'Beauty & Wellness',
    'ecommerce': 'E-commerce',
    'software': 'SaaS',
    'marketing': 'Agency'
  };

  for (const [keyword, industry] of Object.entries(basicIndustryMap)) {
    if (serviceText.includes(keyword)) {
      return industry;
    }
  }

  return 'General';
};

const detectSubIndustryFromServices = (services, industry) => {
  if (!services || services.length === 0) return '';

  const serviceText = services.join(' ').toLowerCase();

  // Sub-industry patterns based on industry
  const subIndustryPatterns = {
    'SaaS': {
      'Marketing SaaS': ['marketing', 'campaign', 'lead generation', 'crm', 'email marketing'],
      'HR SaaS': ['hr', 'human resources', 'recruiting', 'talent', 'payroll', 'employee'],
      'Fintech': ['finance', 'payment', 'banking', 'investment', 'crypto', 'lending'],
      'Analytics': ['analytics', 'data', 'reporting', 'dashboard', 'insights', 'metrics'],
      'Security': ['security', 'cybersecurity', 'protection', 'encryption', 'compliance'],
      'E-commerce SaaS': ['ecommerce', 'shopping', 'store', 'inventory', 'pos'],
      'Productivity': ['productivity', 'collaboration', 'workflow', 'task', 'project management'],
      'Customer Support': ['support', 'helpdesk', 'ticketing', 'customer service', 'chat']
    },
    'Agency': {
      'Digital Marketing': ['digital marketing', 'marketing', 'campaign', 'advertising'],
      'Creative': ['creative', 'design', 'graphic', 'art', 'visual'],
      'Branding': ['branding', 'brand', 'identity', 'logo'],
      'SEO': ['seo', 'search engine', 'optimization', 'ranking'],
      'PPC': ['ppc', 'pay per click', 'google ads', 'advertising'],
      'Web Design': ['web design', 'website', 'ui/ux', 'frontend'],
      'Social Media': ['social media', 'social', 'facebook', 'instagram', 'twitter'],
      'PR': ['pr', 'public relations', 'media', 'press'],
      'Content Strategy': ['content', 'blog', 'writing', 'strategy']
    },
    'E-commerce': {
      'Fashion': ['fashion', 'clothing', 'apparel', 'style'],
      'Electronics': ['electronics', 'gadgets', 'tech', 'devices'],
      'Health & Beauty': ['health', 'beauty', 'cosmetics', 'wellness'],
      'Furniture': ['furniture', 'home', 'decor', 'interior'],
      'Food & Beverage': ['food', 'beverage', 'restaurant', 'catering'],
      'Subscription': ['subscription', 'monthly', 'recurring', 'box'],
      'Home Goods': ['home goods', 'household', 'kitchen', 'bathroom'],
      'Sports': ['sports', 'fitness', 'outdoor', 'equipment']
    },
    'Healthcare': {
      'Dentistry': ['dentistry', 'dental', 'teeth', 'oral'],
      'Medical Clinic': ['clinic', 'medical', 'doctor', 'healthcare'],
      'Wellness Spa': ['spa', 'wellness', 'relaxation', 'massage'],
      'Fitness Studio': ['fitness', 'gym', 'workout', 'exercise'],
      'Telehealth': ['telehealth', 'telemedicine', 'remote', 'virtual'],
      'Physical Therapy': ['physical therapy', 'rehab', 'therapy'],
      'Cosmetic Surgery': ['cosmetic', 'surgery', 'aesthetic', 'beauty']
    },
    'Real Estate': {
      'Residential': ['residential', 'home', 'house', 'apartment'],
      'Commercial': ['commercial', 'office', 'business', 'property'],
      'Property Management': ['property management', 'leasing', 'tenant'],
      'Agent/Brokerage': ['agent', 'brokerage', 'real estate agent', 'broker'],
      'Vacation Rentals': ['vacation', 'rental', 'vacation rental', 'airbnb'],
      'Land Development': ['development', 'land', 'construction', 'building']
    },
    'Finance': {
      'Accounting': ['accounting', 'bookkeeping', 'tax', 'financial'],
      'Investment': ['investment', 'portfolio', 'wealth', 'stocks'],
      'Insurance': ['insurance', 'coverage', 'policy', 'risk'],
      'Lending': ['lending', 'loan', 'mortgage', 'credit'],
      'Crypto': ['crypto', 'cryptocurrency', 'bitcoin', 'blockchain'],
      'Wealth Management': ['wealth management', 'financial planning', 'advisor']
    },
    'Education': {
      'Online Courses': ['online courses', 'elearning', 'course', 'education'],
      'Tutoring': ['tutoring', 'private lessons', 'teaching'],
      'Academy': ['academy', 'school', 'training institute'],
      'Corporate Training': ['corporate training', 'professional development'],
      'Test Prep': ['test prep', 'exam preparation', 'tutoring'],
      'School': ['school', 'education', 'learning', 'students']
    },
    'Technology': {
      'AI': ['ai', 'artificial intelligence', 'machine learning', 'automation'],
      'IoT': ['iot', 'internet of things', 'smart devices', 'connected'],
      'Cybersecurity': ['cybersecurity', 'security', 'protection', 'threat'],
      'Cloud': ['cloud', 'cloud computing', 'aws', 'azure'],
      'Mobility': ['mobile', 'app development', 'ios', 'android'],
      'Hardware': ['hardware', 'devices', 'electronics', 'gadgets']
    },
    'Consulting': {
      'Management': ['management consulting', 'business strategy', 'operations'],
      'HR': ['hr consulting', 'human resources', 'talent management'],
      'IT': ['it consulting', 'technology consulting', 'systems'],
      'Strategy': ['strategy consulting', 'business strategy', 'planning'],
      'Financial': ['financial consulting', 'finance', 'accounting'],
      'Legal': ['legal consulting', 'law', 'compliance']
    },
    'Construction': {
      'Contractors': ['contractors', 'construction', 'building'],
      'Home Renovation': ['renovation', 'remodeling', 'home improvement'],
      'Architecture': ['architecture', 'design', 'planning'],
      'Builders': ['builders', 'construction', 'development'],
      'Remodeling': ['remodeling', 'renovation', 'upgrade'],
      'Interior Design': ['interior design', 'decor', 'interior']
    },
    'Hospitality': {
      'Hotels': ['hotels', 'lodging', 'accommodation'],
      'Restaurants': ['restaurants', 'food', 'dining'],
      'Events': ['events', 'event planning', 'weddings'],
      'Travel Agency': ['travel agency', 'travel', 'tourism'],
      'Catering': ['catering', 'food service', 'events'],
      'Resorts': ['resorts', 'vacation', 'luxury']
    },
    'Legal': {
      'Law Firm': ['law firm', 'legal services', 'attorney'],
      'Immigration': ['immigration', 'visa', 'citizenship'],
      'Corporate Law': ['corporate law', 'business law', 'contracts'],
      'Personal Injury': ['personal injury', 'accident', 'liability'],
      'Family Law': ['family law', 'divorce', 'custody'],
      'Patent Law': ['patent law', 'intellectual property', 'trademark']
    },
    'Beauty & Wellness': {
      'Salon': ['salon', 'hair', 'beauty', 'styling'],
      'Spa': ['spa', 'wellness', 'relaxation', 'treatment'],
      'Nutrition': ['nutrition', 'diet', 'health', 'wellness'],
      'Yoga Studio': ['yoga', 'meditation', 'mindfulness'],
      'Cosmetics': ['cosmetics', 'makeup', 'beauty products'],
      'Personal Care': ['personal care', 'skincare', 'grooming']
    },
    'General': {
      'Professional Services': ['professional services', 'consulting', 'expertise'],
      'Local Business': ['local business', 'community', 'neighborhood'],
      'Startup': ['startup', 'entrepreneur', 'innovation'],
      'Nonprofit': ['nonprofit', 'charity', 'community service']
    }
  };

  // Get sub-industry patterns for the detected industry
  const industrySubs = subIndustryPatterns[industry];
  if (!industrySubs) return '';

  // Score each sub-industry
  let scores = {};
  for (const [subIndustry, keywords] of Object.entries(industrySubs)) {
    scores[subIndustry] = keywords.reduce((count, keyword) => {
      return count + (serviceText.includes(keyword) ? 1 : 0);
    }, 0);
  }

  // Find highest scoring sub-industry
  const maxScore = Math.max(...Object.values(scores));
  if (maxScore > 0) {
    return Object.entries(scores).find(([_, score]) => score === maxScore)[0];
  }

  return '';
};


const generateServicesFromProjectName = (projectName) => {
  const name = projectName.toLowerCase();

  if (name.includes('fitness') || name.includes('gym')) {
    return ['Personal Training', 'Gym Membership', 'Yoga Classes', 'Nutrition Coaching'];
  }
  if (name.includes('agency') || name.includes('marketing')) {
    return ['Digital Marketing', 'SEO Services', 'Web Design', 'Content Creation'];
  }
  if (name.includes('design') || name.includes('creative')) {
    return ['Brand Design', 'UI/UX Design', 'Logo Design', 'Graphic Design'];
  }
  if (name.includes('tech') || name.includes('software')) {
    return ['Software Development', 'Web Development', 'Mobile Apps', 'Cloud Solutions'];
  }
  if (name.includes('consulting') || name.includes('advisor')) {
    return ['Business Consulting', 'Strategy Planning', 'Market Research', 'Growth Advisory'];
  }

  return ['Professional Services', 'Expert Consulting', 'Custom Solutions', 'Quality Support'];
};
const extractBulkMedia = ($, baseUrl) => {
  const media = {
    images: [],
    videos: []
  };

  const images = [];
  const seenUrls = new Set();

  // Unwanted image patterns - these should be filtered out (less strict)
  const unwantedPatterns = [
    /tracking/i, /pixel/i, /beacon/i, /analytics/i,
    /1x1/i, /spacer/i, /dot\.gif/i, /clear\.gif/i,
    /favicon/i, /apple-touch-icon/i
  ];

  // Relevant image patterns - prioritize these
  const relevantPatterns = [
    /hero/i, /banner/i, /slider/i, /showcase/i, /feature/i,
    /product/i, /service/i, /portfolio/i, /team/i, /testimonial/i,
    /about/i, /office/i, /workspace/i, /meeting/i, /client/i,
    /screenshot/i, /dashboard/i, /interface/i, /app/i, /software/i
  ];

  $('img').each((i, el) => {
    const src = $(el).attr('src');
    const alt = $(el).attr('alt')?.trim() || '';
    const title = $(el).attr('title')?.trim() || '';
    const cls = $(el).attr('class')?.trim() || '';
    const width = $(el).attr('width') ? parseInt($(el).attr('width')) : 0;
    const height = $(el).attr('height') ? parseInt($(el).attr('height')) : 0;

    if (!src || src.length < 5) return;

    // Skip data URIs and base64 images
    if (src.startsWith('data:')) return;

    // Skip if URL already seen
    if (seenUrls.has(src)) return;

    // Check for unwanted patterns in URL, alt, or class
    const combinedText = `${src} ${alt} ${cls}`.toLowerCase();
    const isUnwanted = unwantedPatterns.some(pattern => pattern.test(combinedText));
    if (isUnwanted) return;

    // Skip very small images (likely icons or tracking pixels)
    if ((width > 0 && width < 50) || (height > 0 && height < 50)) return;

    // Skip images with very small dimensions in filename
    if (src.match(/\d+x\d+/i)) {
      const dims = src.match(/(\d+)x(\d+)/i);
      if (dims && (parseInt(dims[1]) < 100 || parseInt(dims[2]) < 100)) return;
    }

    try {
      let fullUrl = src;
      try {
        if (!src.startsWith('http')) {
          fullUrl = new URL(src, baseUrl).href;
        }

        let type = 'general';
        const metaText = (alt + ' ' + cls + ' ' + title).toLowerCase();

        if (metaText.includes('logo')) type = 'logo';
        else if (metaText.includes('hero') || metaText.includes('banner') || metaText.includes('slider')) type = 'banner';
        else if (metaText.includes('testimonial') || metaText.includes('user') || metaText.includes('avatar') || metaText.includes('team')) type = 'person';
        else if (metaText.includes('product') || metaText.includes('item') || metaText.includes('service')) type = 'product';
        else if (metaText.includes('gallery') || metaText.includes('portfolio')) type = 'gallery';

        images.push({ url: fullUrl, alt, type, context: title || cls });
      } catch (e) { }
    } catch (e) { }
  });

  // Sort images by relevance and add to media
  images.sort((a, b) => {
    const aRelevance = relevantPatterns.some(p => p.test(a.context || '')) ? 1 : 0;
    const bRelevance = relevantPatterns.some(p => p.test(b.context || '')) ? 1 : 0;
    return bRelevance - aRelevance || (b.alt?.length || 0) - (a.alt?.length || 0);
  });

  media.images = images;

  // 2. Extract Videos (iframes and video tags)
  $('video, iframe[src*="youtube.com"], iframe[src*="vimeo.com"], iframe[src*="dailymotion.com"]').each((i, el) => {
    let src = $(el).attr('src') || $(el).find('source').attr('src');

    if (src && src.length > 5) {
      try {
        if (!src.startsWith('http') && !src.startsWith('//')) {
          src = new URL(src, baseUrl).href;
        }
        media.videos.push({ url: src, type: el.name === 'video' ? 'direct' : 'embed' });
      } catch (e) { }
    }
  });

  return {
    images: media.images.slice(0, 40),
    videos: media.videos.slice(0, 10)
  };
};;

const extractStructuredData = ($) => {
  const data = {
    testimonials: [],
    pricing: [],
    partners: [],
    faq: [],
    ctas: [],
    forms: []
  };

  // 0. Form Fields Extraction (detailed)
  $('form').each((i, formEl) => {
    const $form = $(formEl);
    const fields = [];

    $form.find('input, select, textarea').each((j, fieldEl) => {
      const $field = $(fieldEl);
      const type = $field.attr('type') || $field.prop('tagName').toLowerCase();
      const name = $field.attr('name') || '';
      const placeholder = $field.attr('placeholder') || '';
      const label = $field.closest('label').text().trim() ||
        $field.prev('label').text().trim() ||
        $field.parent().find('label').first().text().trim() || '';
      const required = $field.attr('required') !== undefined;

      if (type !== 'hidden' && type !== 'submit' && type !== 'button') {
        fields.push({
          type,
          name: name || `field_${fields.length}`,
          label: label || placeholder,
          placeholder,
          required
        });
      }
    });

    if (fields.length > 0) {
      data.forms.push({
        id: $form.attr('id') || `form_${i}`,
        action: $form.attr('action') || '',
        method: $form.attr('method') || 'POST',
        fields
      });
    }
  });

  // 1. CTA Detection
  $('a, button').each((i, el) => {
    const text = $(el).text().trim();
    const href = $(el).attr('href');
    if (text.length > 3 && text.length < 50 && (text.toLowerCase().includes('start') || text.toLowerCase().includes('get') || text.toLowerCase().includes('trial') || text.toLowerCase().includes('sign up') || text.toLowerCase().includes('contact'))) {
      if (!data.ctas.includes(text)) data.ctas.push(text);
    }
  });

  // 2. Form & Input Detection (Aggressive)
  let foundForm = false;
  $('form').each((i, el) => {
    foundForm = true;
    const inputs = [];
    $(el).find('input, textarea, select').each((j, input) => {
      const type = $(input).attr('type');
      if (type === 'hidden' || type === 'submit') return;
      const placeholder = $(input).attr('placeholder') || $(input).prev('label').text().trim() || $(input).attr('name') || $(input).attr('id');
      if (placeholder) inputs.push(placeholder);
    });
    if (inputs.length > 0) data.forms.push({ id: $(el).attr('id') || 'scraped-form', inputs });
  });

  // If no <form> tag, look for clusters of inputs (common in modern apps/popups)
  if (!foundForm) {
    const looseInputs = [];
    $('input:not([type="hidden"]), textarea, select').each((i, input) => {
      const placeholder = $(input).attr('placeholder') || $(input).prev('label').text().trim() || $(input).attr('name');
      if (placeholder && !looseInputs.includes(placeholder)) looseInputs.push(placeholder);
    });
    if (looseInputs.length >= 2) {
      data.forms.push({ id: 'detected-inputs', inputs: looseInputs.slice(0, 10) });
    }
  }

  // Testimonials heuristic
  $(':contains("testimonial"), :contains("what they say"), :contains("reviews")').each((i, el) => {
    const section = $(el).closest('section, div');
    const text = section.text().replace(/\s+/g, ' ').trim();
    if (text.length > 50 && text.length < 1000) {
      if (data.testimonials.length < 5) data.testimonials.push(text);
    }
  });

  // Pricing heuristic
  $(':contains("$"), :contains("₹"), :contains("£"), :contains("/month"), :contains("/year")').each((i, el) => {
    const text = $(el).text().trim();
    if (text.length > 1 && text.length < 40) {
      if (data.pricing.length < 10) data.pricing.push(text);
    }
  });

  // Partners/Clients heuristic
  $('img[alt*="partner" i], img[alt*="client" i], img[alt*="logo" i]').each((i, el) => {
    const src = $(el).attr('src');
    if (src && data.partners.length < 20) data.partners.push(src);
  });

  return data;
};

module.exports = { analyzeWebsite, inspectWebsite, extractProjectData, extractBulkMedia, extractStructuredData };