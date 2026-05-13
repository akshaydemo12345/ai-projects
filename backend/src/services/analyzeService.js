'use strict';

const axios = require('axios');
const cheerio = require('cheerio');
const sharp = require('sharp');
const logger = require('../utils/logger');

const normalizeImageUrl = (src, baseUrl) => {
  if (!src) return '';
  let normalized = src.trim();
  if (/^(data|blob|javascript|chrome-extension):/i.test(normalized)) return '';
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

const isLogoUrlCandidate = (url) => {
  if (!url) return false;
  const lower = url.toLowerCase();
  const invalid = [
    'favicon', 'icon', 'pixel', 'sprite', 'tracking', 'badge', 'share', 'social', 'og-image', 'logo-preview', 'logo-mask', 'marker', 'loading', 'placeholder', 'button', 'avatar', 'profile', 'thumb', 'thumbnail', 'partner', 'premier', 'award', 'certified', 'sponsor'
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

const findBestLogo = ($, baseUrl) => {
  const logoSelectors = [
    'img[id*="logo" i]',
    'img[class*="logo" i]',
    'img[src*="logo" i]',
    'img[alt*="logo" i]',
    'img[data-src*="logo" i]',
    '.logo img',
    '.logo a img',
    'header .logo img',
    'header .logo a img',
    'nav .logo img',
    'nav .logo a img',
    'a[class*="logo" i] img',
    'div[class*="logo" i] img',
    'div[class*="logo" i] a img',
    '.site-branding img',
    '.site-branding a img',
    '.brand img',
    '.brand a img',
    '.header img',
    'header img',
    '.navbar img',
    '.navbar a img',
    '.nav img',
    '.nav a img',
    '.navigation .logo img',
    '.navigation .logo a img',
    '.menu-header-menu-container .logo img',
    '.menu-header-menu-container .logo a img',
    'img[src*="brand" i]',
    'img[src*="identity" i]',
    'img[alt*="brand" i]',
    'img[alt*="identity" i]'
  ];

  const origin = new URL(baseUrl).origin;
  const candidates = [];
  const seen = new Set();

  logoSelectors.forEach((selector) => {
    $(selector).each((i, el) => {
      const rawSrc = ($(el).attr('src') || $(el).attr('data-src') || $(el).attr('data-lazy-src') || $(el).attr('data-original') || '').trim();
      const src = normalizeImageUrl(rawSrc, baseUrl);
      if (!src || seen.has(src) || !isLogoUrlCandidate(src)) return;
      seen.add(src);
      const score = scoreLogoCandidate($, el, src, origin);
      candidates.push({ src, score, order: candidates.length, area: (parseInt($(el).attr('width') || '0', 10) || 0) * (parseInt($(el).attr('height') || '0', 10) || 0) });
    });
  });

  if (candidates.length === 0) return '';
  candidates.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (b.area !== a.area) return b.area - a.area;
    return a.order - b.order;
  });
  return candidates[0].src;
};

const CSS_VAR_COLOR_REGEX = /--([\w-]*?(?:primary|secondary|accent|brand|theme|main)[\w-]*)\s*:\s*(#[A-Fa-f0-9]{3,6}|rgba?\([^)]+\))/gi;
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
  if (!baseColor || !candidates || candidates.length === 0) return '';
  return candidates.find((color) => {
    if (!color) return false;
    const normalized = color.toLowerCase();
    if (normalized === baseColor.toLowerCase()) return false;
    return getColorDistance(baseColor, normalized) >= 35;
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

  const logoPalette = logoUrl ? (await extractBrandColorsFromLogo(logoUrl)) || [] : [];
  logger.info(`Logo palette extracted: ${JSON.stringify(logoPalette)}`);

  // Strong preference for logo palette
  let primaryColor = selectFirstNonNeutral(logoPalette) || '';
  let secondaryColor = primaryColor ? selectDistinctColor(primaryColor, logoPalette) : '';

  const cssTexts = await collectExternalCssTexts($, baseUrl);
  const cssVariables = {};
  const cssColorValues = [];
  cssTexts.forEach((cssText) => {
    Object.assign(cssVariables, parseCssVariables(cssText));
    cssColorValues.push(...parseCssColorDeclarations(cssText));
  });

  const variableColorEntries = Object.entries(cssVariables).map(([name, color]) => ({ name, color }));
  const explicitPrimaryColors = variableColorEntries
    .filter((entry) => /primary|brand|main|theme/i.test(entry.name))
    .map((entry) => entry.color);
  const explicitSecondaryColors = variableColorEntries
    .filter((entry) => /secondary|accent/i.test(entry.name))
    .map((entry) => entry.color);

  const buttonBgColors = collectInlineStyleColors($, ['button', 'a.btn', 'a.button', '[class*=\"btn\"]', '[class*=\"button\"]', '[class*=\"cta\"]']);
  const buttonTextColors = collectInlineStyleColors($, ['button', 'a.btn', 'a.button', '[class*=\"btn\"]', '[class*=\"button\"]', '[class*=\"cta\"]']);
  const heroBgColors = collectInlineStyleColors($, ['header', '.hero', '.site-header', '.masthead', '.topbar', '.navbar', '.site-banner', '.hero-section', '.page-header', '.branding']);
  const textColors = collectInlineStyleColors($, ['p', 'span', 'a', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']);
  const metaColors = collectMetaColors($);

  const allColors = uniqueHexColors([
    ...logoPalette,
    ...Object.values(cssVariables),
    ...cssColorValues,
    ...buttonBgColors,
    ...buttonTextColors,
    ...heroBgColors,
    ...textColors,
    ...metaColors
  ]);

  if (!primaryColor) {
    primaryColor = selectFirstNonNeutral(explicitPrimaryColors)
      || selectFirstNonNeutral(buttonBgColors)
      || selectFirstNonNeutral(heroBgColors)
      || selectFirstNonNeutral(cssColorValues)
      || selectFirstNonNeutral(metaColors)
      || selectFirstNonNeutral(allColors) || '';
  }

  if (!secondaryColor) {
    secondaryColor = selectDistinctColor(primaryColor, explicitSecondaryColors)
      || selectDistinctColor(primaryColor, buttonBgColors)
      || selectDistinctColor(primaryColor, heroBgColors)
      || selectDistinctColor(primaryColor, metaColors)
      || selectDistinctColor(primaryColor, cssColorValues)
      || selectDistinctColor(primaryColor, logoPalette)
      || selectDistinctColor(primaryColor, allColors) || '';
  }

  const accentColor = selectDistinctColor(primaryColor, explicitSecondaryColors)
    || selectDistinctColor(primaryColor, buttonBgColors)
    || selectDistinctColor(primaryColor, cssColorValues)
    || selectDistinctColor(primaryColor, allColors)
    || secondaryColor || '#f59e0b';

  const backgroundColor = selectFirstNonNeutral([].concat(
    collectInlineStyleColors($, ['body', 'section', '.hero', '.site-header', '.site-banner', '.page-header']),
    [normalizeColorValue($('body').css('background-color') || '')]
  )) || '#ffffff';

  const textColor = selectFirstNonNeutral(textColors)
    || selectDistinctColor(backgroundColor, textColors)
    || '#1f2937';

  const buttonColorPrimaryBg = selectFirstNonNeutral(buttonBgColors);
  const buttonColorSecondaryBg = buttonBgColors.find((color) => color !== buttonColorPrimaryBg) || '';
  const buttonColorPrimaryText = selectFirstNonNeutral(buttonTextColors) || textColor;

  const buttonColors = {
    primaryBg: buttonColorPrimaryBg || primaryColor,
    primaryText: buttonColorPrimaryText,
    primaryHover: buttonColorPrimaryBg ? generateHoverColor(buttonColorPrimaryBg) : generateHoverColor(primaryColor),
    secondaryBg: buttonColorSecondaryBg || secondaryColor,
    secondaryText: buttonColorPrimaryText
  };

  if (!primaryColor) {
    primaryColor = '#7c3aed';
  }
  if (!secondaryColor) {
    secondaryColor = getDistinctColor(primaryColor, allColors) || '#6366f1';
  }
  if (primaryColor.toLowerCase() === secondaryColor.toLowerCase()) {
    secondaryColor = getDistinctColor(primaryColor, allColors) || '#1e293b';
  }

  const confidence = logoPalette.length > 0 ? 'high' : 'medium';

  logger.info(`Final theme colors - Primary: ${primaryColor}, Secondary: ${secondaryColor}, Accent: ${accentColor}, Text: ${textColor}, Background: ${backgroundColor}, Confidence: ${confidence}`);

  return {
    primaryColor,
    secondaryColor,
    accentColor,
    backgroundColor,
    textColor,
    confidence,
    buttonColors,
    colors: allColors
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

    // 2. Favicon
    let favicon = $('link[rel="shortcut icon"]').attr('href') ||
      $('link[rel="icon"]').attr('href') ||
      $('link[rel="apple-touch-icon"]').attr('href');
    if (favicon && !favicon.startsWith('http')) {
      favicon = new URL(favicon, url).href;
    } else if (!favicon) {
      favicon = `${urlObj.origin}/favicon.ico`;
    }

    let logo = findBestLogo($, url) || $('meta[property="og:image"]').attr('content') || $('link[rel="image_src"]').attr('href') || '';
    if (logo && !logo.startsWith('http')) {
      logo = new URL(logo, url).href;
    }

    // 4. Color Extraction (Heuristic)
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
      suggestedColors,
      socialLinks,
      rawContent: cleanText
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

  return '';
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
    aiPrompt: prompt
  });
};

/**
 * Deterministic brand color analysis
 * Prioritizes CSS theme colors first, then falls back to logo palette and inline styles.
 */
const analyzeBrandColors = async ($, logoUrl, baseUrl) => {
  const theme = await extractThemeColors($, baseUrl, logoUrl);
  logger.info(`Brand colors detected: primary=${theme.primaryColor}, secondary=${theme.secondaryColor}`);
  return theme;
};

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
    try {
      response = await axios.get(normalizedUrl, {
        timeout: 15000,
        headers: {
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
        }
      });
    } catch (fetchErr) {
      logger.warn(`Initial fetch failed for ${normalizedUrl}: ${fetchErr.message}. Proceeding with Lite analysis.`);
      // FALLBACK: Lite analysis when scraping is blocked (e.g., 403, 404, Timeout)
      const domainParts = new URL(normalizedUrl).hostname.replace('www.', '').split('.');
      const rawName = domainParts[0] || 'My Brand';
      const projectName = rawName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

      const primaryColor = '#4f46e5';
      const secondaryColor = '#0ea5e9';

      return {
        websiteUrl: normalizedUrl,
        projectName: projectName,
        projectDesc: `${projectName} - Modern business solutions.`,
        projectLogo: '',
        theme: primaryColor,
        primaryColor,
        secondaryColor,
        colors: [primaryColor, secondaryColor, '#ffffff', '#1f2937'],
        services: [`${projectName} Services`, 'Consulting', 'Support'],
        keywords: [rawName.toLowerCase(), 'business', 'online'],
        industry: 'General',
        themeSystem: generateAdvancedBrandingSystem(projectName, 'General', 'Professional', primaryColor, secondaryColor, {}, [primaryColor, secondaryColor], `A company called ${projectName}`, [])
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

    try {
      projectDesc = $('meta[name="description"]').attr('content')?.trim() ||
        $('meta[property="og:description"]').attr('content')?.trim() || '';

      const extractedLogo = findBestLogo($, normalizedUrl) || $('meta[property="og:image"]').attr('content')?.trim() || $('link[rel="image_src"]').attr('href')?.trim() || '';
      if (extractedLogo) {
        projectLogo = normalizeImageUrl(extractedLogo, normalizedUrl);
      }
    } catch (e) {
      logger.warn(`SEO/Logo extraction failed: ${e.message}`);
    }

    // Color extraction - deterministic brand color analysis
    let primaryColor = '';
    let secondaryColor = '';
    let buttonColors = { primaryBg: '', primaryText: '', primaryHover: '', secondaryBg: '', secondaryText: '' };
    let colors = [];

    try {
      const brandColors = await analyzeBrandColors($, projectLogo, normalizedUrl);
      primaryColor = brandColors.primaryColor;
      secondaryColor = brandColors.secondaryColor;
      buttonColors = brandColors.buttonColors;
      colors = brandColors.colors || [];
    } catch (e) {
      logger.warn(`Color extraction failed: ${e.message}`);
    }

    if (!colors || colors.length === 0) {
      colors = [primaryColor, secondaryColor].filter(Boolean).map((value) => rgbToHex(value)).filter(Boolean);
    }

    if (!primaryColor) primaryColor = '#4f46e5';
    if (!secondaryColor) secondaryColor = '#0ea5e9';

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

    // Detect industry from services
    const detectedIndustry = detectIndustryFromServices(cleanedServices);

    // Detect sub-industry from services and industry
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
      services: cleanedServices,
      keywords,
      industry: detectedIndustry,
      subIndustry: detectedSubIndustry,
      themeSystem, // Complete theme system for design
      scrapedData: {
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

const extractBrandColorsFromLogo = async (logoUrl) => {
  try {
    let input;
    if (logoUrl.startsWith('http')) {
      const response = await axios.get(logoUrl, {
        responseType: 'arraybuffer',
        timeout: 5000,
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36' }
      });
      input = response.data;
    } else {
      input = logoUrl;
    }

    // Download the image using sharp
    const { data, info } = await sharp(input)
      .resize(250, 250, { // Larger size for better color accuracy
        fit: 'inside',
        withoutEnlargement: true
      })
      .raw()
      .toBuffer({ resolveWithObject: true });

    // Analyze actual pixel data and extract color palette
    const colorPalette = extractColorPalette(data, info.channels);

    if (!colorPalette || colorPalette.length === 0) {
      return null;
    }

    // Return top 3 most dominant colors for brand palette
    return colorPalette.slice(0, 3);
  } catch (error) {
    logger.warn(`Failed to extract color from logo (${logoUrl}): ${error.message}`);
    return null;
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
    // Agency - marketing and creative services
    'Agency': ['marketing', 'seo', 'ppc', 'advertising', 'social media', 'content', 'branding', 'lead generation', 'campaign', 'design', 'creative', 'logo', 'graphic', 'photography', 'video production', 'web design', 'agency'],

    // SaaS - technology and platform indicators
    'SaaS': ['software', 'platform', 'dashboard', 'analytics', 'automation', 'cloud', 'saas', 'subscription', 'api', 'integration', 'workflow', 'productivity', 'collaboration'],

    // E-commerce - online selling
    'E-commerce': ['ecommerce', 'online store', 'shopping cart', 'product catalog', 'shipping', 'checkout', 'payment processing', 'store', 'inventory'],

    // Healthcare - medical and wellness
    'Healthcare': ['medical', 'healthcare', 'doctor', 'clinic', 'hospital', 'wellness', 'therapy', 'pharmacy', 'health', 'fitness', 'gym', 'spa'],

    // Real Estate - property and housing
    'Real Estate': ['real estate', 'property', 'housing', 'rental', 'apartment', 'home buying', 'mortgage', 'listing', 'agent', 'brokerage'],

    // Finance - financial services
    'Finance': ['finance', 'accounting', 'investment', 'insurance', 'lending', 'crypto', 'wealth management', 'financial', 'banking'],

    // Education - learning and training
    'Education': ['training', 'course', 'learning', 'education', 'certification', 'teaching', 'tutorial', 'online courses', 'tutoring'],

    // Technology - tech services
    'Technology': ['technology', 'ai', 'iot', 'cybersecurity', 'cloud', 'mobile', 'hardware', 'development', 'software'],

    // Consulting - professional advisory
    'Consulting': ['consulting', 'advisory', 'strategy', 'management', 'professional services'],

    // Construction - building and renovation
    'Construction': ['construction', 'contractors', 'renovation', 'architecture', 'builders', 'remodeling', 'interior design'],

    // Hospitality - hotels, restaurants, events
    'Hospitality': ['hospitality', 'hotels', 'restaurants', 'events', 'travel agency', 'catering', 'resorts', 'food'],

    // Legal - law services
    'Legal': ['legal', 'law firm', 'attorney', 'immigration', 'corporate law', 'personal injury', 'family law'],

    // Beauty & Wellness - beauty and personal care
    'Beauty & Wellness': ['beauty', 'wellness', 'salon', 'spa', 'nutrition', 'yoga', 'cosmetics', 'personal care'],

    // General - fallback
    'General': ['professional services', 'local business', 'startup', 'nonprofit', 'business']
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

