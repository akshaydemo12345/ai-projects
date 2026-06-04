const axios = require('axios');
const jsdom = require('jsdom').JSDOM;
const convert = require('color-convert');
const Vibrant = require('node-vibrant/node');
const playwright = require('playwright');
const tinycolor = require('tinycolor2');
const { URL } = require('url');

/**
 * Extract colors from computed styles of HTML elements
 * Uses weighted approach to identify primary and secondary colors
 */
const extractColorsFromDOM = (html) => {
  try {
    const dom = new jsdom(html);
    const document = dom.window.document;
    
    const colorMap = {};
    const processedElements = new Set();
    
    // Get all elements with background-color or color styles
    const elements = document.querySelectorAll('*');
    
    elements.forEach((element) => {
      if (processedElements.size > 500) return; // Limit processing
      
      const styles = dom.window.getComputedStyle(element);
      const bgColor = styles.backgroundColor;
      const textColor = styles.color;
      
      // Track background colors
      if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)') {
        const normalized = normalizeColor(bgColor);
        if (normalized && !isNeutral(normalized)) {
          colorMap[normalized] = (colorMap[normalized] || 0) + 1;
        }
      }
      
      // Track text colors
      if (textColor && !isNeutral(textColor)) {
        const normalized = normalizeColor(textColor);
        if (normalized) {
          colorMap[normalized] = (colorMap[normalized] || 0) + 0.5; // Less weight for text
        }
      }
      
      processedElements.add(element);
    });
    
    // Sort colors by frequency
    const sortedColors = Object.entries(colorMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([color]) => color);
    
    return sortedColors;
  } catch (error) {
    console.error('Error extracting colors from DOM:', error.message);
    return [];
  }
};

/**
 * Extract hex and rgb color tokens from raw CSS/text
 */
const extractColorsFromCssText = (text) => {
  const colors = new Set();
  if (!text) return [];
  // hex colors
  const hexRe = /#([0-9a-fA-F]{3,8})\b/g;
  let m;
  while ((m = hexRe.exec(text))) {
    const h = '#' + m[1].toUpperCase();
    // normalize short hex like #FFF -> #FFFFFF
    if (m[1].length === 3) {
      const a = m[1].split('').map(c => c + c).join('');
      colors.add('#' + a.toUpperCase());
    } else {
      colors.add(h);
    }
  }

  // rgb/rgba
  const rgbRe = /rgba?\((\d+),\s*(\d+),\s*(\d+)/g;
  while ((m = rgbRe.exec(text))) {
    const r = parseInt(m[1], 10);
    const g = parseInt(m[2], 10);
    const b = parseInt(m[3], 10);
    const hex = '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('').toUpperCase();
    colors.add(hex);
  }

  return Array.from(colors);
};

/**
 * Fetch external CSS files linked in document and extract colors
 */
const extractColorsFromExternalCss = async (document, baseUrl) => {
  try {
    const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
      .map(l => l.href)
      .filter(Boolean);

    // also include style tags
    const inlineStyles = Array.from(document.querySelectorAll('style')).map(s => s.textContent || '');

    const cssTexts = [...inlineStyles];
    for (let href of links.slice(0, 10)) {
      try {
        // resolve relative urls
        const resolved = new URL(href, baseUrl).toString();
        const resp = await axios.get(resolved, { timeout: 5000 });
        cssTexts.push(resp.data);
      } catch (err) {
        // ignore failing CSS fetches
      }
    }

    const colorSet = new Set();
    cssTexts.forEach(txt => {
      extractColorsFromCssText(txt).forEach(c => colorSet.add(c));
    });

    return Array.from(colorSet);
  } catch (err) {
    return [];
  }
};

/**
 * Extract dominant colors from key images on the page using Vibrant
 */
const extractColorsFromImages = async (document, baseUrl) => {
  try {
    const candidates = new Set();

    // meta og:image, twitter:image
    const metaImg = document.querySelector('meta[property="og:image"]')?.content || document.querySelector('meta[name="twitter:image"]')?.content;
    if (metaImg) candidates.add(metaImg);

    // common logo selectors
    const logo = document.querySelector('img.logo, img[alt*="logo" i], img[id*="logo" i]')?.src;
    if (logo) candidates.add(logo);

    // hero/banner candidates (class/id contains hero/banner/main)
    const heroImgs = Array.from(document.querySelectorAll('img'))
      .filter(img => {
        const cls = (img.className || '').toString().toLowerCase();
        const id = (img.id || '').toString().toLowerCase();
        const src = (img.src || '').toString().toLowerCase();
        return cls.includes('hero') || cls.includes('banner') || id.includes('hero') || id.includes('banner') || src.includes('hero') || src.includes('banner');
      })
      .map(i => i.src)
      .filter(Boolean);
    heroImgs.slice(0, 5).forEach(u => candidates.add(u));

    // fallback: first few images on page
    const firstImgs = Array.from(document.querySelectorAll('img')).slice(0, 10).map(i => i.src).filter(Boolean);
    firstImgs.forEach(u => candidates.add(u));

    const results = [];
    const list = Array.from(candidates).slice(0, 8);
    for (let src of list) {
      try {
        const resolved = new URL(src, baseUrl).toString();
        const resp = await axios.get(resolved, { responseType: 'arraybuffer', timeout: 7000 });
        const buf = Buffer.from(resp.data, 'binary');
        const palette = await Vibrant.from(buf).getPalette();
        if (palette) {
          Object.values(palette).forEach(swatch => {
            if (swatch && swatch.getHex) {
              results.push(swatch.getHex().toUpperCase());
            }
          });
        }
      } catch (err) {
        // ignore per-image errors
      }
    }

    // unique and return
    return Array.from(new Set(results));
  } catch (err) {
    return [];
  }
};

/**
 * Convert RGB/RGBA to hex
 */
const normalizeColor = (color) => {
  // Match rgb/rgba
  const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (rgbMatch) {
    const [, r, g, b] = rgbMatch;
    return '#' + [r, g, b].map(x => parseInt(x).toString(16).padStart(2, '0')).join('').toUpperCase();
  }
  
  // Already hex
  if (color.startsWith('#')) {
    return color.toUpperCase();
  }

  // HSL/HSLA
  const hsl = parseHslColor(color);
  if (hsl) {
    return hsl;
  }
  
  // Named colors - basic mapping
  const colorNames = {
    'white': '#FFFFFF',
    'black': '#000000',
    'red': '#FF0000',
    'blue': '#0000FF',
    'green': '#008000',
    'gray': '#808080',
    'grey': '#808080',
    'transparent': null,
  };
  
  return colorNames[color.toLowerCase()] || null;
};

/**
 * Check if a color is neutral (grayscale)
 */
const isNeutral = (hexColor) => {
  if (!hexColor || hexColor.length < 7) return true;
  
  const rgb = convert.hex.rgb(hexColor);
  const [r, g, b] = rgb;
  
  // If all channels are similar, it's neutral
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const saturation = max === 0 ? 0 : (max - min) / max;
  
  return saturation < 0.15; // Low saturation = neutral
};

/**
 * Find best contrasting text color (black or white) for given background
 */
const getContrastingTextColor = (hexBgColor) => {
  try {
    const rgb = convert.hex.rgb(hexBgColor);
    const brightness = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
    return brightness > 155 ? '#1F2937' : '#FFFFFF'; // Dark text for light bg, white for dark
  } catch (error) {
    return '#1F2937'; // Default dark color
  }
};

/**
 * Get complementary color for accent
 */
const getComplementaryColor = (hexColor) => {
  try {
    const rgb = convert.hex.rgb(hexColor);
    const hsv = convert.rgb.hsv(rgb);
    hsv[0] = (hsv[0] + 180) % 360; // Rotate hue by 180 degrees
    const complementaryRgb = convert.hsv.rgb(hsv);
    return '#' + complementaryRgb.map(x => x.toString(16).padStart(2, '0')).join('').toUpperCase();
  } catch (error) {
    return '#F97316'; // Default accent
  }
};

const normalizeCssColor = (color) => {
  if (!color) return null;
  const tc = tinycolor(color);
  if (!tc.isValid()) return null;
  if (tc.getAlpha && tc.getAlpha() === 0) return null;
  return tc.toHexString().toUpperCase();
};

const parseHslColor = (color) => {
  const hslMatch = color.match(/hsla?\((\d+),\s*(\d+)%?,\s*(\d+)%?/);
  if (!hslMatch) return null;
  const h = parseInt(hslMatch[1], 10);
  const s = parseInt(hslMatch[2], 10);
  const l = parseInt(hslMatch[3], 10);
  return '#' + convert.hsl.hex([h, s, l]).toUpperCase();
};

const getComputedElementStyle = (element, property) => {
  try {
    if (!element) return null;
    const styles = element.ownerDocument.defaultView.getComputedStyle(element);
    return styles ? styles.getPropertyValue(property) : null;
  } catch (error) {
    return null;
  }
};

const resolveElementColors = (document, selectors) => {
  for (const selector of selectors) {
    const el = document.querySelector(selector);
    if (!el) continue;
    const bg = getComputedElementStyle(el, 'background-color');
    const txt = getComputedElementStyle(el, 'color');
    const border = getComputedElementStyle(el, 'border-color');
    const normalizedBg = normalizeColor(bg);
    const normalizedText = normalizeColor(txt);
    const normalizedBorder = normalizeColor(border);
    if (normalizedBg || normalizedText) {
      return {
        background: normalizedBg || null,
        color: normalizedText || null,
        border: normalizedBorder || null,
      };
    }
  }
  return {
    background: null,
    color: null,
    border: null,
  };
};

const extractComputedBrandingFromWebsite = async (websiteUrl) => {
  if (!websiteUrl) {
    throw new Error('Website URL is required for computed branding extraction');
  }

  let url = websiteUrl;
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }

  const browser = await playwright.chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  });
  const page = await context.newPage();
  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(1000);

  const raw = await page.evaluate(() => {
    const normalize = (value) => {
      if (!value) return null;
      const trimmed = value.trim();
      if (!trimmed || trimmed === 'transparent' || trimmed === 'rgba(0, 0, 0, 0)') return null;
      return trimmed;
    };

    const isVisible = (el) => {
      if (!el || !(el instanceof Element)) return false;
      const styles = window.getComputedStyle(el);
      if (styles.visibility === 'hidden' || styles.display === 'none' || styles.opacity === '0') return false;
      const rect = el.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    };

    const getStyle = (el, property) => {
      if (!el) return null;
      return normalize(window.getComputedStyle(el).getPropertyValue(property));
    };

    const findFirstVisible = (selectors) => {
      for (const selector of selectors) {
        const nodes = Array.from(document.querySelectorAll(selector));
        for (const node of nodes) {
          if (isVisible(node)) return node;
        }
      }
      return null;
    };

    const sampleColors = (selectors, property, limit = 20) => {
      const colors = [];
      for (const selector of selectors) {
        const nodes = Array.from(document.querySelectorAll(selector));
        for (const node of nodes) {
          if (!isVisible(node)) continue;
          const value = getStyle(node, property);
          if (value) colors.push(value);
          if (colors.length >= limit) break;
        }
        if (colors.length >= limit) break;
      }
      return colors;
    };

    const mostFrequent = (items) => {
      const counts = {};
      for (const item of items) {
        if (!item) continue;
        counts[item] = (counts[item] || 0) + 1;
      }
      return Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([value]) => value)[0] || null;
    };

    const headerSelectors = ['header', 'nav', '.navbar', '.site-header', '.main-header', '.topbar', '.header'];
    const footerSelectors = ['footer', '.footer', '.site-footer', '.page-footer', '.footer-section'];
    const buttonSelectors = ['.btn-primary', 'button.primary', '.button-primary', '.btn', 'button', 'a.button', '.call-to-action', '.cta'];
    const ctaSelectors = ['.cta', 'button.cta', 'a.cta', 'button', 'a[href*="/buy" i]', 'a[href*="/shop" i]', 'a[href*="/cart" i]', 'a[href*="/signup" i]', 'a[href*="/login" i]'];
    const linkSelectors = ['a', 'nav a', 'header a', 'footer a', '.menu a', '.nav-link'];
    const textSelectors = ['body', 'h1', 'h2', 'h3', 'p', '.hero-title', '.headline'];
    const heroSelectors = ['.hero', '.banner', '.hero-section', '.top-section', '.hero-banner', '.main-hero'];

    const headerEl = findFirstVisible(headerSelectors);
    const footerEl = findFirstVisible(footerSelectors);
    const buttonEl = findFirstVisible(buttonSelectors);
    const ctaEl = findFirstVisible(ctaSelectors);
    const pageEl = findFirstVisible(['body', 'html']);
    const heroEl = findFirstVisible(heroSelectors);

    const headerBackground = getStyle(headerEl, 'background-color');
    const headerText = getStyle(headerEl, 'color');
    const headerBorder = getStyle(headerEl, 'border-color');
    const headerLink = mostFrequent(sampleColors(['nav a', 'header a', ...headerSelectors], 'color', 30));

    const footerBackground = getStyle(footerEl, 'background-color');
    const footerText = getStyle(footerEl, 'color');
    const footerBorder = getStyle(footerEl, 'border-color');
    const footerLink = mostFrequent(sampleColors(['footer a', '.footer a'], 'color', 30));

    const buttonBackground = getStyle(buttonEl, 'background-color');
    const buttonText = getStyle(buttonEl, 'color');
    const buttonBorder = getStyle(buttonEl, 'border-color');

    const ctaBackground = getStyle(ctaEl, 'background-color');
    const ctaText = getStyle(ctaEl, 'color');
    const ctaBorder = getStyle(ctaEl, 'border-color');

    const pageBackground = getStyle(pageEl, 'background-color');
    const heroBackground = getStyle(heroEl, 'background-color');

    const bodyText = mostFrequent(sampleColors(textSelectors, 'color', 40));
    const linkColor = mostFrequent(sampleColors(linkSelectors, 'color', 50));
    const borderColor = mostFrequent(sampleColors(['*'], 'border-color', 50));

    return {
      header: {
        background: headerBackground,
        text: headerText,
        border: headerBorder,
        link: headerLink,
      },
      footer: {
        background: footerBackground,
        text: footerText,
        border: footerBorder,
        link: footerLink,
      },
      buttons: {
        primary: {
          background: buttonBackground,
          text: buttonText,
          border: buttonBorder,
        },
        cta: {
          background: ctaBackground,
          text: ctaText,
          border: ctaBorder,
        },
      },
      text: {
        body: bodyText,
        link: linkColor,
      },
      background: {
        page: pageBackground,
        hero: heroBackground,
      },
      border: {
        page: borderColor,
      },
      links: {
        default: linkColor,
        cta: ctaText,
      },
    };
  });

  await browser.close();

  const colors = {
    header: {
      background: normalizeCssColor(raw.header.background),
      text: normalizeCssColor(raw.header.text),
      border: normalizeCssColor(raw.header.border),
      link: normalizeCssColor(raw.header.link),
    },
    footer: {
      background: normalizeCssColor(raw.footer.background),
      text: normalizeCssColor(raw.footer.text),
      border: normalizeCssColor(raw.footer.border),
      link: normalizeCssColor(raw.footer.link),
    },
    buttons: {
      primary: {
        background: normalizeCssColor(raw.buttons.primary.background),
        text: normalizeCssColor(raw.buttons.primary.text),
        border: normalizeCssColor(raw.buttons.primary.border),
      },
      cta: {
        background: normalizeCssColor(raw.buttons.cta.background),
        text: normalizeCssColor(raw.buttons.cta.text),
        border: normalizeCssColor(raw.buttons.cta.border),
      },
    },
    text: {
      body: normalizeCssColor(raw.text.body),
      link: normalizeCssColor(raw.text.link),
    },
    background: {
      page: normalizeCssColor(raw.background.page) || '#FFFFFF',
      hero: normalizeCssColor(raw.background.hero),
    },
    border: {
      page: normalizeCssColor(raw.border.page),
    },
    links: {
      default: normalizeCssColor(raw.links.default),
      cta: normalizeCssColor(raw.links.cta),
    },
  };

  const detectedColors = [
    colors.header.background,
    colors.header.text,
    colors.footer.background,
    colors.footer.text,
    colors.buttons.primary.background,
    colors.buttons.primary.text,
    colors.buttons.cta.background,
    colors.buttons.cta.text,
    colors.text.body,
    colors.links.default,
  ].filter(Boolean);

  const pickPrimary = detectedColors[0] || '#7C3AED';
  const pickSecondary = detectedColors.find((c) => c && c !== pickPrimary) || '#6366F1';
  const pickAccent = detectedColors.find((c) => c && c !== pickPrimary && c !== pickSecondary) || getComplementaryColor(pickPrimary);

  return {
    header: colors.header,
    footer: colors.footer,
    buttons: colors.buttons,
    text: colors.text,
    background: colors.background,
    border: colors.border,
    links: colors.links,
    colors: {
      primary: pickPrimary,
      secondary: pickSecondary,
      accent: pickAccent,
    },
  };
};

/**
 * Fetch website HTML and extract branding colors
 */
const fetchAndExtractBranding = async (websiteUrl) => {
  try {
    if (!websiteUrl) {
      throw new Error('Website URL is required');
    }

    // Normalize URL
    let url = websiteUrl;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    console.log('Fetching branding from:', url);

    // Fetch the website with a timeout
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/91.0.4472.124',
      },
      maxRedirects: 5,
    });

    const html = response.data;

    // Build a DOM for richer extraction
    const dom = new jsdom(html, { url });
    const document = dom.window.document;

    // Gather colors from multiple sources
    const domColors = extractColorsFromDOM(html); // low weight
    const cssColors = await extractColorsFromExternalCss(document, url); // medium weight
    const imageColors = await extractColorsFromImages(document, url); // medium-high weight
    const computedBranding = await extractComputedBrandingFromWebsite(url).catch((err) => {
      console.warn('Computed branding extraction failed:', err.message);
      return null;
    });

    // meta theme-color and og:image based colors
    const metaTheme = document.querySelector('meta[name="theme-color"]')?.content || document.querySelector('meta[property="theme-color"]')?.content;
    const metaOg = document.querySelector('meta[property="og:image"]')?.content || document.querySelector('meta[name="twitter:image"]')?.content;

    // Frequency map with weights
    const freq = {};
    const pushColor = (c, w = 1) => {
      if (!c) return;
      const norm = normalizeColor(c) || c;
      if (!norm) return;
      if (isNeutral(norm)) return;
      const key = norm.toUpperCase();
      freq[key] = (freq[key] || 0) + w;
    };

    // theme color gets highest priority
    if (metaTheme) pushColor(metaTheme, 6);

    // CSS tokens (3 each)
    cssColors.forEach(c => pushColor(c, 3));

    // Image palette colors (2 each)
    imageColors.forEach(c => pushColor(c, 2));

    // DOM colors (1 each)
    domColors.forEach(c => pushColor(c, 1));

    // If theme image exists, try to extract palette (already in imageColors) but give a bump
    if (metaOg) pushColor(metaOg, 2);

    // Build sorted color list
    const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]).map(([c]) => c);

    // Fallback to any discovered colors if strict extraction failed
    const combinedFallback = [...new Set([...(sorted || []), ...(imageColors || []), ...(cssColors || []), ...(domColors || [])])];

    const colors = combinedFallback.map(c => (c || '').toUpperCase()).filter(Boolean);

    const primaryColor = computedBranding?.colors?.primary || colors[0] || '#7C3AED';
    const secondaryColor = computedBranding?.colors?.secondary || colors.find((c, index) => index > 0 && c !== primaryColor && !isNeutral(c)) || getComplementaryColor(primaryColor) || '#6366F1';
    const accentColor = computedBranding?.colors?.accent || colors.find(c => c !== primaryColor && c !== secondaryColor && !isNeutral(c)) || getComplementaryColor(primaryColor) || '#F97316';

    const pageTheme = computedBranding?.background?.page ? { background: computedBranding.background.page, color: computedBranding.text?.body, border: computedBranding.border?.page } : resolveElementColors(document, ['body', 'html']);
    const navTheme = computedBranding?.header ? { background: computedBranding.header.background, color: computedBranding.header.text, border: computedBranding.header.border } : resolveElementColors(document, ['nav', '.navbar', '.site-header', 'header', '.topbar', '.header']);
    const footerTheme = computedBranding?.footer ? { background: computedBranding.footer.background, color: computedBranding.footer.text, border: computedBranding.footer.border } : resolveElementColors(document, ['footer', '.site-footer', '.footer', '.page-footer']);
    const primaryButtonTheme = computedBranding?.buttons?.primary ? { background: computedBranding.buttons.primary.background, color: computedBranding.buttons.primary.text, border: computedBranding.buttons.primary.border } : resolveElementColors(document, ['.btn-primary', 'button.primary', '.button-primary', 'button', '.btn']);
    const secondaryButtonTheme = computedBranding?.buttons?.cta ? { background: computedBranding.buttons.cta.background, color: computedBranding.buttons.cta.text, border: computedBranding.buttons.cta.border } : resolveElementColors(document, ['.btn-secondary', 'button.secondary', '.button-secondary', '.secondary-button']);

    const bodyBackground = pageTheme.background || '#ffffff';
    const bodyText = pageTheme.color || getContrastingTextColor(bodyBackground);

    const navBackground = navTheme.background || bodyBackground;
    const navText = navTheme.color || primaryColor;
    const footerBackground = footerTheme.background || '#1f2937';
    const footerText = footerTheme.color || getContrastingTextColor(footerBackground);
    const footerBorder = footerTheme.border || getComplementaryColor(footerBackground);

    const branding = {
      logo: computedBranding?.logoUrl || null,
      logoUrl: computedBranding?.logoUrl || null,
      favicon: computedBranding?.favicon || null,
      companyName: computedBranding?.companyName || null,
      tagline: computedBranding?.tagline || null,
      colors: {
        primary: computedBranding?.colors?.primary || primaryColor,
        secondary: computedBranding?.colors?.secondary || secondaryColor,
        accent: computedBranding?.colors?.accent || accentColor,
        background: bodyBackground,
        surface: computedBranding?.background?.page || pageTheme.background || '#f9fafb',
        text: bodyText,
        textLight: computedBranding?.text?.body || getContrastingTextColor(bodyBackground) === '#FFFFFF' ? '#D1D5DB' : '#9CA3AF',
        heading: normalizeCssColor(computedBranding?.text?.body) || '#111827',
        mutedText: computedBranding?.text?.body || '#6b7280',
        border: pageTheme.border || '#e5e7eb',
        success: '#22c55e',
        warning: '#f59e0b',
        danger: '#ef4444',
        gradient: computedBranding?.colors?.gradient || ['#7c3aed', '#6366f1'],
      },
      typography: {
        fontFamily: computedBranding?.typography?.fontFamily || 'Inter, sans-serif',
        headingFontFamily: computedBranding?.typography?.headingFontFamily || 'Inter, sans-serif',
        baseFontSize: computedBranding?.typography?.baseFontSize || '16px',
        headingScale: {
          h1: computedBranding?.typography?.headingScale?.h1 || '2.5rem',
          h2: computedBranding?.typography?.headingScale?.h2 || '2rem',
          h3: computedBranding?.typography?.headingScale?.h3 || '1.75rem',
          h4: computedBranding?.typography?.headingScale?.h4 || '1.5rem',
        },
        fontWeight: {
          light: computedBranding?.typography?.fontWeight?.light || '300',
          normal: computedBranding?.typography?.fontWeight?.normal || '400',
          medium: computedBranding?.typography?.fontWeight?.medium || '500',
          bold: computedBranding?.typography?.fontWeight?.bold || '700',
        },
        letterSpacing: computedBranding?.typography?.letterSpacing || '0.02em',
        lineHeight: computedBranding?.typography?.lineHeight || '1.6',
      },
      buttons: {
        primary: {
          backgroundColor: computedBranding?.buttons?.primary?.background || primaryButtonTheme.background || primaryColor,
          textColor: computedBranding?.buttons?.primary?.text || primaryButtonTheme.color || getContrastingTextColor(primaryButtonTheme.background || primaryColor),
          borderRadius: computedBranding?.buttons?.primary?.borderRadius || '8px',
          padding: '12px 24px',
          fontSize: computedBranding?.buttons?.primary?.fontSize || '14px',
          fontWeight: computedBranding?.buttons?.primary?.fontWeight || '600',
          borderColor: computedBranding?.buttons?.primary?.border || primaryButtonTheme.border || primaryColor,
          hoverBackgroundColor: computedBranding?.buttons?.primary?.hoverBackgroundColor || '#6d28d9',
          hoverTextColor: computedBranding?.buttons?.primary?.hoverTextColor || '#ffffff',
          boxShadow: computedBranding?.buttons?.primary?.boxShadow || '0 10px 20px rgba(124, 58, 237, 0.15)',
          textTransform: computedBranding?.buttons?.primary?.textTransform || 'uppercase',
        },
        secondary: {
          backgroundColor: computedBranding?.buttons?.secondary?.background || secondaryButtonTheme.background || bodyBackground,
          textColor: computedBranding?.buttons?.secondary?.text || secondaryButtonTheme.color || primaryColor,
          borderRadius: computedBranding?.buttons?.secondary?.borderRadius || '8px',
          padding: '12px 24px',
          fontSize: computedBranding?.buttons?.secondary?.fontSize || '14px',
          fontWeight: computedBranding?.buttons?.secondary?.fontWeight || '600',
          borderColor: computedBranding?.buttons?.secondary?.border || secondaryButtonTheme.border || primaryColor,
          hoverBackgroundColor: computedBranding?.buttons?.secondary?.hoverBackgroundColor || '#eef2ff',
          hoverTextColor: computedBranding?.buttons?.secondary?.hoverTextColor || primaryColor,
          boxShadow: computedBranding?.buttons?.secondary?.boxShadow || '0 10px 20px rgba(99, 102, 241, 0.08)',
          textTransform: computedBranding?.buttons?.secondary?.textTransform || 'uppercase',
        },
      },
      navigation: {
        backgroundColor: computedBranding?.navigation?.backgroundColor || navBackground,
        textColor: computedBranding?.navigation?.textColor || navText,
        linkColor: computedBranding?.navigation?.linkColor || primaryColor,
        activeLinkColor: computedBranding?.navigation?.activeLinkColor || primaryColor,
        hoverColor: computedBranding?.navigation?.hoverColor || '#2563eb',
        hoverBackgroundColor: computedBranding?.navigation?.hoverBackgroundColor || (navTheme.background ? (getContrastingTextColor(navTheme.background) === '#FFFFFF' ? '#F3F4F6' : '#E5E7EB') : '#f3f4f6'),
        borderColor: computedBranding?.navigation?.borderColor || navTheme.border || '#e5e7eb',
        shadow: computedBranding?.navigation?.shadow || '0 10px 30px rgba(15, 23, 42, 0.08)',
        height: computedBranding?.navigation?.height || '64px',
        padding: computedBranding?.navigation?.padding || '0 24px',
        sticky: computedBranding?.navigation?.sticky ?? false,
        transparent: computedBranding?.navigation?.transparent ?? false,
        logoMaxHeight: computedBranding?.navigation?.logoMaxHeight || '40px',
        fontFamily: computedBranding?.navigation?.fontFamily || 'Inter, sans-serif',
        fontWeight: computedBranding?.navigation?.fontWeight || '500',
        fontSize: computedBranding?.navigation?.fontSize || '14px',
      },
      footer: {
        backgroundColor: computedBranding?.footer?.backgroundColor || footerBackground,
        textColor: computedBranding?.footer?.textColor || footerText,
        linkColor: computedBranding?.footer?.linkColor || secondaryColor,
        borderTopColor: computedBranding?.footer?.borderTopColor || footerBorder,
        padding: computedBranding?.footer?.padding || '48px 24px',
        fontSize: computedBranding?.footer?.fontSize || '14px',
        layout: computedBranding?.footer?.layout || 'columns',
        socialIconStyle: computedBranding?.footer?.socialIconStyle || 'rounded',
      },
      sections: {
        hero: {
          backgroundColor: computedBranding?.sections?.hero?.backgroundColor || (computedBranding?.background?.hero || heroBackground),
          textAlign: computedBranding?.sections?.hero?.textAlign || 'center',
          padding: computedBranding?.sections?.hero?.padding || '120px 0',
        },
        cards: {
          backgroundColor: computedBranding?.sections?.cards?.backgroundColor || '#ffffff',
          borderRadius: computedBranding?.sections?.cards?.borderRadius || '16px',
          shadow: computedBranding?.sections?.cards?.shadow || '0 20px 40px rgba(15, 23, 42, 0.08)',
          borderColor: computedBranding?.sections?.cards?.borderColor || '#e5e7eb',
        },
        formSection: {
          backgroundColor: computedBranding?.sections?.formSection?.backgroundColor || '#f8fafc',
        },
      },
      forms: {
        inputBackground: computedBranding?.forms?.inputBackground || inputBackground || '#ffffff',
        inputBorderColor: computedBranding?.forms?.inputBorderColor || inputBorderColor || '#d1d5db',
        inputRadius: computedBranding?.forms?.inputRadius || inputRadius || '12px',
        labelColor: computedBranding?.forms?.labelColor || labelColor || '#111827',
        placeholderColor: computedBranding?.forms?.placeholderColor || inputPlaceholderColor || '#6b7280',
        focusBorderColor: computedBranding?.forms?.focusBorderColor || inputBorderColor || '#7c3aed',
        inputHeight: computedBranding?.forms?.inputHeight || inputHeight || '48px',
        fontFamily: computedBranding?.forms?.fontFamily || inputFontFamily || 'Inter, sans-serif',
      },
      layout: {
        borderRadius: {
          small: computedBranding?.layout?.borderRadius?.small || '6px',
          medium: computedBranding?.layout?.borderRadius?.medium || '12px',
          large: computedBranding?.layout?.borderRadius?.large || '24px',
        },
        spacing: computedBranding?.layout?.spacing || {
          xs: '8px',
          sm: '12px',
          md: '20px',
          lg: '32px',
          xl: '48px',
        },
        containerWidth: computedBranding?.layout?.containerWidth || layoutContainerWidth || '1200px',
      },
      effects: {
        boxShadow: computedBranding?.effects?.boxShadow || cardShadow || primaryButtonTheme.boxShadow || '0 20px 60px rgba(15, 23, 42, 0.08)',
        hoverShadow: computedBranding?.effects?.hoverShadow || cardShadow || primaryButtonTheme.boxShadow || '0 16px 40px rgba(15, 23, 42, 0.1)',
        transition: computedBranding?.effects?.transition || 'all 200ms ease',
      },
      assets: {
        heroImages: computedBranding?.assets?.heroImages || [],
        banners: computedBranding?.assets?.banners || [],
      },
      scrapedBrandingData: {
        sourceUrl: websiteUrl,
        scrapedAt: new Date(),
        fonts: computedBranding?.scrapedBrandingData?.fonts || [],
        extractedColors: computedBranding?.scrapedBrandingData?.extractedColors || colors,
        headerSelector: computedBranding?.scrapedBrandingData?.headerSelector || '',
        footerSelector: computedBranding?.scrapedBrandingData?.footerSelector || '',
        buttonSelectors: computedBranding?.scrapedBrandingData?.buttonSelectors || [],
      },
    };

    return {
      success: true,
      message: 'Branding extracted successfully',
      data: {
        ...branding,
        computedBranding,
      },
    };
  } catch (error) {
    console.error('Error fetching branding:', error.message);

    return {
      success: false,
      message: `Failed to extract branding: ${error.message}`,
      data: getDefaultBranding(),
    };
  }
};

/**
 * Get default branding configuration
 */
const getDefaultBranding = () => {
  return {
    logo: '',
    logoUrl: '',
    favicon: '',
    companyName: '',
    tagline: '',
    colors: {
      primary: '#7c3aed',
      secondary: '#6366f1',
      accent: '#f97316',
      background: '#ffffff',
      surface: '#f9fafb',
      text: '#1f2937',
      textLight: '#6b7280',
      heading: '#111827',
      mutedText: '#6b7280',
      border: '#e5e7eb',
      success: '#22c55e',
      warning: '#f59e0b',
      danger: '#ef4444',
      gradient: ['#7c3aed', '#6366f1'],
    },
    typography: {
      fontFamily: 'Inter, sans-serif',
      headingFontFamily: 'Inter, sans-serif',
      baseFontSize: '16px',
      headingScale: {
        h1: '2.5rem',
        h2: '2rem',
        h3: '1.75rem',
        h4: '1.5rem',
      },
      fontWeight: {
        light: '300',
        normal: '400',
        medium: '500',
        bold: '700',
      },
      letterSpacing: '0.02em',
      lineHeight: '1.6',
    },
    navigation: {
      backgroundColor: '#ffffff',
      textColor: '#1f2937',
      linkColor: '#7c3aed',
      activeLinkColor: '#7c3aed',
      hoverColor: '#2563eb',
      hoverBackgroundColor: '#f3f4f6',
      borderColor: '#e5e7eb',
      shadow: '0 10px 30px rgba(15, 23, 42, 0.08)',
      height: '64px',
      padding: '0 24px',
      sticky: false,
      transparent: false,
      logoMaxHeight: '40px',
      fontFamily: 'Inter, sans-serif',
      fontWeight: '500',
      fontSize: '14px',
    },
    footer: {
      backgroundColor: '#1f2937',
      textColor: '#f3f4f6',
      linkColor: '#60a5fa',
      borderTopColor: '#374151',
      padding: '48px 24px',
      fontSize: '14px',
      layout: 'columns',
      socialIconStyle: 'rounded',
    },
    buttons: {
      primary: {
        backgroundColor: '#7c3aed',
        textColor: '#ffffff',
        borderRadius: '8px',
        borderColor: '#7c3aed',
        padding: '12px 24px',
        fontSize: '14px',
        fontWeight: '600',
        hoverBackgroundColor: '#6d28d9',
        hoverTextColor: '#ffffff',
        boxShadow: '0 10px 20px rgba(124, 58, 237, 0.15)',
        textTransform: 'uppercase',
      },
      secondary: {
        backgroundColor: '#ffffff',
        textColor: '#7c3aed',
        borderRadius: '8px',
        borderColor: '#7c3aed',
        padding: '12px 24px',
        fontSize: '14px',
        fontWeight: '600',
        hoverBackgroundColor: '#eef2ff',
        hoverTextColor: '#7c3aed',
        boxShadow: '0 10px 20px rgba(99, 102, 241, 0.08)',
        textTransform: 'uppercase',
      },
    },
    sections: {
      hero: {
        backgroundColor: '#ffffff',
        textAlign: 'center',
        padding: '120px 0',
      },
      cards: {
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        shadow: '0 20px 40px rgba(15, 23, 42, 0.08)',
        borderColor: '#e5e7eb',
      },
      formSection: {
        backgroundColor: '#f8fafc',
      },
    },
    forms: {
      inputBackground: '#ffffff',
      inputBorderColor: '#d1d5db',
      inputRadius: '12px',
      labelColor: '#111827',
      placeholderColor: '#6b7280',
      focusBorderColor: '#7c3aed',
      inputHeight: '48px',
      fontFamily: 'Inter, sans-serif',
    },
    layout: {
      borderRadius: {
        small: '6px',
        medium: '12px',
        large: '24px',
      },
      spacing: {
        xs: '8px',
        sm: '12px',
        md: '20px',
        lg: '32px',
        xl: '48px',
      },
      containerWidth: '1200px',
    },
    effects: {
      boxShadow: '0 20px 60px rgba(15, 23, 42, 0.08)',
      hoverShadow: '0 16px 40px rgba(15, 23, 42, 0.1)',
      transition: 'all 200ms ease',
    },
    assets: {
      heroImages: [],
      banners: [],
    },
    computedBranding: {},
    brandingSourceUrl: '',
    lastScrapedAt: null,
    scrapedBrandingData: {
      sourceUrl: '',
      scrapedAt: null,
      fonts: [],
      extractedColors: [],
      headerSelector: '',
      footerSelector: '',
      buttonSelectors: [],
    },
  };
};

module.exports = {
  fetchAndExtractBranding,
  extractComputedBrandingFromWebsite,
  getDefaultBranding,
  getContrastingTextColor,
  getComplementaryColor,
};
