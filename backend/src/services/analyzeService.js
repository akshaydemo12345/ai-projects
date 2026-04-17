'use strict';

const axios = require('axios');
const cheerio = require('cheerio');
const sharp = require('sharp');
const logger = require('../utils/logger');

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

    // 3. Logo Detection Refined
    const logoSelectors = [
      'img[id*="logo" i]', 'img[class*="logo" i]', 'img[src*="logo" i]', 'img[alt*="logo" i]',
      '.header img', 'header img', '.navbar img'
    ];
    
    for (const selector of logoSelectors) {
      const found = $(selector).first();
      if (found.length) {
        const src = found.attr('src')?.trim();
        if (src && !src.includes('banner') && !src.includes('hero')) {
          logo = src;
          break;
        }
      }
    }

    if (!logo) {
      logo = $('meta[property="og:image"]').attr('content') || '';
    }
    if (logo && !logo.startsWith('http')) {
      logo = new URL(logo, url).href;
    }

    // 4. Color Extraction (Heuristic)
    const suggestedColors = [];
    const themeColor = $('meta[name="theme-color"]').attr('content');
    if (themeColor) suggestedColors.push(themeColor);

    // Look for background colors in inline styles of main elements
    $('[style*="background-color"]').slice(0, 5).each((i, el) => {
      const style = $(el).attr('style');
      const match = style.match(/background-color:\s*(#[a-fA-F0-0]{3,6}|rgb\([^)]+\))/);
      if (match && !suggestedColors.includes(match[1])) suggestedColors.push(match[1]);
    });

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
      suggestedColors: [...new Set(suggestedColors)],
      socialLinks,
      rawContent: cleanText
    };
  } catch (err) {
    logger.error(`Scraping failed for ${url}: ${err.message}`);
    throw new Error(`Failed to access website: ${err.message}`);
  }
};

function rgbToHex(color) {
  if (!color) return '';
  if (color.startsWith('#')) return color;
  const match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (match) {
    const r = parseInt(match[1]).toString(16).padStart(2, '0');
    const g = parseInt(match[2]).toString(16).padStart(2, '0');
    const b = parseInt(match[3]).toString(16).padStart(2, '0');
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
    aiPrompt: prompt
  });
};

/**
 * Deterministic brand color analysis
 * Prioritizes logo colors and CSS file colors as requested
 */
const analyzeBrandColors = async ($, logoUrl) => {
  let primaryColor = '';
  let secondaryColor = '';
  let confidence = 'low';
  const buttonColors = { primaryBg: '', primaryText: '', primaryHover: '', secondaryBg: '', secondaryText: '' };
  
  // PRIORITY 1: Logo colors (as requested - primary source)
  if (logoUrl) {
    try {
      logger.info(`Extracting colors from logo: ${logoUrl}`);
      const logoColors = await extractBrandColorsFromLogo(logoUrl);
      logger.info(`Logo colors extracted: ${JSON.stringify(logoColors)}`);
      if (logoColors && logoColors.length > 0) {
        primaryColor = logoColors[0];
        if (logoColors.length > 1) {
          secondaryColor = logoColors[1];
        }
        confidence = 'high';
      }
    } catch (e) {
      logger.warn(`Logo color extraction failed: ${e.message}`);
    }
  } else {
    logger.warn('No logo URL provided for color extraction');
  }
  
  // PRIORITY 2: CSS variables (--primary, --secondary, --brand, --main)
  if (!primaryColor) {
    let cssColorsFound = [];
    $('style').each((i, el) => {
      const styleContent = $(el).html();
      
      // Common brand variables
      const patterns = [
        /--(?:primary|brand|main|accent|theme|theme-primary|primary-color)[^:]*:\s*([#]?[a-fA-F0-9]{3,6}|rgb\([^)]+\))/gi,
        /--(?:secondary|theme-secondary|secondary-color)[^:]*:\s*([#]?[a-fA-F0-9]{3,6}|rgb\([^)]+\))/gi
      ];

      patterns.forEach((pattern, pIdx) => {
        let match;
        while ((match = pattern.exec(styleContent)) !== null) {
          const color = rgbToHex(match[1].trim());
          if (!isNeutralColor(color)) {
            if (pIdx === 0 && !primaryColor) {
              primaryColor = color;
              confidence = 'high';
            } else if (pIdx === 1 && !secondaryColor) {
              secondaryColor = color;
            }
            cssColorsFound.push(color);
          }
        }
      });
    });
    logger.info(`CSS variables found: ${JSON.stringify(cssColorsFound)}`);
  }
  
  // PRIORITY 3: Button classes
  if (!primaryColor) {
    const primarySelectors = [
      '.btn-primary', '.button-primary', '.btn_red', '.btn_blue', '.btn_green', 
      '.button_red', '.button_blue', '.button_green', '.btn-main', '.btn-theme'
    ];
    for (const selector of primarySelectors) {
      const el = $(selector).first();
      if (el.length) {
        // Since cheerio doesn't compute styles, look for inline style or common classes
        const style = el.attr('style') || '';
        const bgMatch = style.match(/background(?:-color)?:\s*([#]?[a-fA-F0-9]{3,6}|rgb\([^)]+\))/i);
        if (bgMatch) {
          const color = rgbToHex(bgMatch[1].trim());
          if (!isNeutralColor(color)) {
            primaryColor = color;
            confidence = 'high';
            break;
          }
        }
      }
    }
  }
  
  if (!secondaryColor) {
    const secondaryBtnColor = $('.btn-secondary, .button-secondary').first().css('background-color');
    logger.info(`Secondary button color: ${secondaryBtnColor}`);
    if (secondaryBtnColor && secondaryBtnColor !== 'rgba(0, 0, 0, 0)' && secondaryBtnColor !== 'transparent') {
      const hexColor = rgbToHex(secondaryBtnColor);
      if (!isNeutralColor(hexColor)) {
        secondaryColor = hexColor;
      }
    }
  }
  
  // PRIORITY 4: Meta theme-color
  if (!primaryColor) {
    const metaColor = $('meta[name="theme-color"]').attr('content')?.trim() || '';
    if (metaColor && !isNeutralColor(metaColor)) {
      primaryColor = rgbToHex(metaColor);
      confidence = 'medium';
    }
  }
  
  // PRIORITY 5: CTA/Button colors from inline styles
  if (!primaryColor) {
    const ctaSelectors = ['button', 'a.btn', 'a.button', '[class*="cta"]'];
    const buttonBgColors = [];
    const buttonTextColors = [];
    
    ctaSelectors.forEach(selector => {
      $(selector).each((i, el) => {
        if (i >= 10) return false;
        const style = $(el).attr('style') || '';
        
        const bgMatch = style.match(/background(?:-color)?:\s*([#]?[a-fA-F0-9]{3,6}|rgb\([^)]+\))/i);
        if (bgMatch) {
          const color = rgbToHex(bgMatch[1].trim());
          if (!isNeutralColor(color)) {
            buttonBgColors.push(color);
          }
        }
        
        const textMatch = style.match(/color:\s*([#]?[a-fA-F0-9]{3,6}|rgb\([^)]+\))/i);
        if (textMatch) {
          const color = rgbToHex(textMatch[1].trim());
          if (!isNeutralColor(color)) {
            buttonTextColors.push(color);
          }
        }
      });
    });
    
    if (buttonBgColors.length > 0) {
      const colorCounts = {};
      buttonBgColors.forEach(color => {
        colorCounts[color] = (colorCounts[color] || 0) + 1;
      });
      const sorted = Object.entries(colorCounts).sort((a, b) => b[1] - a[1]);
      if (sorted.length > 0) {
        primaryColor = sorted[0][0];
        confidence = 'high';
      }
      if (sorted.length > 1) {
        secondaryColor = sorted[1][0];
      }
    }
    
    // Store button colors for theme system
    if (buttonBgColors.length > 0) {
      const colorCounts = {};
      buttonBgColors.forEach(color => {
        colorCounts[color] = (colorCounts[color] || 0) + 1;
      });
      const sorted = Object.entries(colorCounts).sort((a, b) => b[1] - a[1]);
      if (sorted.length > 0) {
        buttonColors.primaryBg = sorted[0][0];
        buttonColors.primaryHover = generateHoverColor(sorted[0][0]);
      }
      if (sorted.length > 1) {
        buttonColors.secondaryBg = sorted[1][0];
      }
    }
    if (buttonTextColors.length > 0) {
      const colorCounts = {};
      buttonTextColors.forEach(color => {
        colorCounts[color] = (colorCounts[color] || 0) + 1;
      });
      const sorted = Object.entries(colorCounts).sort((a, b) => b[1] - a[1]);
      if (sorted.length > 0) {
        buttonColors.primaryText = sorted[0][0];
      }
    }
  }
  
  // Fallback: if still no secondary color, use button text color
  if (!secondaryColor && buttonColors.primaryText) {
    secondaryColor = buttonColors.primaryText;
  }
  
  // Ultimate fallback: if still no colors, use common brand colors
  if (!primaryColor) {
    primaryColor = '#7c3aed'; // Default purple
    confidence = 'low';
  }
  if (!secondaryColor) {
    secondaryColor = '#6366f1'; // Default indigo
  }
  
  logger.info(`Final colors - Primary: ${primaryColor}, Secondary: ${secondaryColor}, Confidence: ${confidence}`);
  
  return {
    primaryColor,
    secondaryColor,
    confidence,
    buttonColors
  };
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
      
      // LOGO EXTRACTION REFINEMENT: Prioritize actual logo elements over OG:Image (which is often a banner)
      const logoSelectors = [
        'img[id*="logo" i]', 'img[class*="logo" i]', 'img[src*="logo" i]', 'img[alt*="logo" i]',
        '.header img', 'header img', '.navbar img', '.nav img'
      ];
      
      for (const selector of logoSelectors) {
        const found = $(selector).first();
        if (found.length) {
          const src = found.attr('src')?.trim();
          // Filter out obvious banners/heros from logo candidates
          if (src && !src.includes('banner') && !src.includes('hero') && !src.includes('og-image')) {
            projectLogo = src;
            break;
          }
        }
      }

      // Fallback to og:image ONLY if no specific logo found
      if (!projectLogo) {
        projectLogo = $('meta[property="og:image"]').attr('content')?.trim() || '';
      }

      if (projectLogo && !projectLogo.startsWith('http')) {
        projectLogo = new URL(projectLogo, normalizedUrl).href;
      }
    } catch (e) {
      logger.warn(`SEO/Logo extraction failed: ${e.message}`);
    }
    
    // Color extraction - deterministic brand color analysis
    let primaryColor = '';
    let secondaryColor = '';
    let buttonColors = { primaryBg: '', primaryText: '', primaryHover: '', secondaryBg: '', secondaryText: '' };
    const colorSet = new Set();
    let colors = [];

    try {
      const brandColors = await analyzeBrandColors($, projectLogo);
      primaryColor = brandColors.primaryColor;
      secondaryColor = brandColors.secondaryColor;
      buttonColors = brandColors.buttonColors;
      
      // Extract colors from CSS and inline styles
      // From inline styles
      $('[style*="color"]').each((i, el) => {
        const style = $(el).attr('style') || '';
        const colorMatch = style.match(/color:\s*([#]?[a-fA-F0-9]{3,6}|rgb\([^)]+\)|rgba\([^)]+\))/gi);
        if (colorMatch) {
          colorMatch.forEach(color => {
            const cleanColor = color.replace(/color:\s*/i, '').trim();
            if (cleanColor.startsWith('#') || cleanColor.startsWith('rgb')) {
              colorSet.add(cleanColor);
            }
          });
        }
      });
      
      // From CSS classes that commonly contain colors
      const colorClasses = ['primary', 'secondary', 'accent', 'main', 'brand', 'theme'];
      colorClasses.forEach(className => {
        $(`[class*="${className}"]`).each((i, el) => {
          const style = $(el).attr('style') || '';
          const colorMatch = style.match(/(?:color|background|background-color):\s*([#]?[a-fA-F0-9]{3,6}|rgb\([^)]+\)|rgba\([^)]+\))/gi);
          if (colorMatch) {
            colorMatch.forEach(color => {
              const cleanColor = color.replace(/(?:color|background|background-color):\s*/i, '').trim();
              if (cleanColor.startsWith('#') || cleanColor.startsWith('rgb')) {
                colorSet.add(cleanColor);
              }
            });
          }
        });
      });
      
      // Convert RGB to hex and filter neutrals
      colors = Array.from(colorSet)
        .map(rgbToHex)
        .filter(c => c.startsWith('#'))
        .sort((a, b) => getSaturation(b) - getSaturation(a)); // Sort by saturation descending
      
      const vibrantColors = colors.filter(c => !isNeutralColor(c));
      
      // Set primary color from vibrant list
      if (!primaryColor && vibrantColors.length > 0) {
        primaryColor = vibrantColors[0];
      }
      
      // If primary is still empty, take best from any colors
      if (!primaryColor && colors.length > 0) {
        primaryColor = colors[0];
      }
      
      // Set secondary color (must be distinct)
      if (!secondaryColor) {
        // First try to find another vibrant color that is distinct
        secondaryColor = vibrantColors.find(c => getColorDistance(primaryColor, c) > 60) || '';
        
        // If not found, try ANY distinct color (including darker/lighter neutrals)
        if (!secondaryColor) {
          secondaryColor = colors.find(c => getColorDistance(primaryColor, c) > 80) || '';
        }
      }
      
      // Final "emergency" color generation if they are still too similar
      if (primaryColor && (!secondaryColor || getColorDistance(primaryColor, secondaryColor) < 50)) {
        // Generate a distinct version of primary (darker/lighter or shifted)
        const r = parseInt(primaryColor.slice(1, 3), 16);
        const g = parseInt(primaryColor.slice(3, 5), 16);
        const b = parseInt(primaryColor.slice(5, 7), 16);
        
        // If it's a light color, make it much darker; if dark, make it lighter
        const brightness = (r + g + b) / 3;
        if (brightness > 128) {
          // Make it a dark contrast
          secondaryColor = `#${Math.max(0, r-100).toString(16).padStart(2, '0')}${Math.max(0, g-100).toString(16).padStart(2, '0')}${Math.max(0, b-100).toString(16).padStart(2, '0')}`;
        } else {
          // Make it a light accent
          secondaryColor = `#${Math.min(255, r+100).toString(16).padStart(2, '0')}${Math.min(255, g+100).toString(16).padStart(2, '0')}${Math.min(255, b+100).toString(16).padStart(2, '0')}`;
        }
      }
    } catch (e) {
      logger.warn(`Color extraction failed: ${e.message}`);
    }
    
    // Hard defaults if everything failed
    if (!primaryColor) primaryColor = '#4f46e5';
    if (!secondaryColor) secondaryColor = '#0ea5e9';
    
    // Ensure they are NEVER the same color in the final output
    if (primaryColor.toLowerCase() === secondaryColor.toLowerCase()) {
      secondaryColor = '#1e293b'; // Default dark slate secondary
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
      keywords = $('meta[name="keywords"]').attr('content')?.split(',').map(k => k.trim()).filter(k => k) || [];
      
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
    
    const bulkImages = extractBulkImages($, normalizedUrl);
    const structuredData = extractStructuredData($);

    return {
      websiteUrl: normalizedUrl,
      projectName: projectName || 'Unknown Brand',
      projectDesc,
      projectLogo,
      theme: primaryColor, // Keep theme for backward compatibility
      primaryColor,
      secondaryColor,
      colors: allColors, // All extracted colors for database storage
      services: cleanedServices,
      keywords,
      industry: detectedIndustry,
      themeSystem, // Complete theme system for design
      scrapedImages: bulkImages, // Top-level scraped images for easy access
      scrapedData: {
        images: bulkImages,
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
  const sortedColors = Object.entries(colorCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([colorKey]) => {
      const [r, g, b] = colorKey.split(',').map(Number);
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
    'Home Services': ['roofing', 'plumbing', 'electrical', 'hvac', 'landscaping', 'cleaning', 'pest control', 'handyman', 'painting', 'carpentry', 'moving', 'storage'],
    
    // SaaS / Software - technology and platform indicators
    'SaaS / Software': ['software', 'platform', 'dashboard', 'analytics', 'automation', 'cloud', 'saas', 'subscription', 'api', 'integration', 'workflow'],
    
    // Digital Marketing - marketing and advertising
    'Digital Marketing': ['marketing', 'seo', 'ppc', 'advertising', 'social media', 'content', 'branding', 'lead generation', 'campaign'],
    
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
    'web design': 'Web Design',
    'development': 'Software Development',
    'agency': 'Digital Agency',
    'fitness': 'Health & Fitness',
    'gym': 'Health & Fitness',
    'insurance': 'Insurance',
    'finance': 'Finance',
    'restaurant': 'Food & Restaurant'
  };
  
  for (const [keyword, industry] of Object.entries(basicIndustryMap)) {
    if (serviceText.includes(keyword)) {
      return industry;
    }
  }
  
  return 'General';
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

const extractBulkImages = ($, baseUrl) => {
  const images = [];
  const seenUrls = new Set();
  
  // Unwanted image patterns - these should be filtered out
  const unwantedPatterns = [
    /icon/i, /sprite/i, /tracking/i, /pixel/i, /beacon/i, /analytics/i,
    /1x1/i, /spacer/i, /dot\.gif/i, /clear\.gif/i, /placeholder/i,
    /favicon/i, /apple-touch-icon/i, /loading/i, /spinner/i,
    /arrow/i, /bullet/i, /check/i, /close/i, /menu/i, /hamburger/i,
    /social.*icon/i, /facebook.*icon/i, /twitter.*icon/i, /linkedin.*icon/i,
    /bg\.png/i, /background.*small/i, /pattern/i, /texture/i
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
      if (!src.startsWith('http')) {
        fullUrl = new URL(src, baseUrl).href;
      }
      
      // Categorize images based on metadata
      let type = 'general';
      let relevance = 'medium';
      
      // Check for relevant patterns
      const isRelevant = relevantPatterns.some(pattern => pattern.test(combinedText));
      if (isRelevant) {
        relevance = 'high';
      }
      
      if (alt.toLowerCase().includes('logo') || cls.toLowerCase().includes('logo')) {
        type = 'logo';
        relevance = 'high';
      } else if (alt.toLowerCase().includes('hero') || cls.toLowerCase().includes('banner') || cls.toLowerCase().includes('slider')) {
        type = 'banner';
        relevance = 'high';
      } else if (alt.toLowerCase().includes('testimonial') || alt.toLowerCase().includes('user') || alt.toLowerCase().includes('person') || alt.toLowerCase().includes('team')) {
        type = 'person';
        relevance = 'medium';
      } else if (alt.toLowerCase().includes('product') || cls.toLowerCase().includes('product') || cls.toLowerCase().includes('item')) {
        type = 'product';
        relevance = 'high';
      } else if (alt.toLowerCase().includes('office') || alt.toLowerCase().includes('workspace') || alt.toLowerCase().includes('meeting')) {
        type = 'environment';
        relevance = 'medium';
      } else if (alt.toLowerCase().includes('screenshot') || alt.toLowerCase().includes('dashboard') || alt.toLowerCase().includes('interface')) {
        type = 'screenshot';
        relevance = 'high';
      }
      
      // Only add if it's relevant or general with good metadata
      if (relevance === 'high' || (relevance === 'medium' && (alt.length > 10 || cls.length > 10))) {
        images.push({
          url: fullUrl,
          alt,
          type,
          context: title || cls,
          relevance,
          width,
          height
        });
        seenUrls.add(src);
      }
    } catch (e) {
      // Skip invalid URLs
    }
  });
  
  // Sort by relevance (high first), then by quality of metadata
  images.sort((a, b) => {
    if (a.relevance !== b.relevance) {
      return a.relevance === 'high' ? -1 : 1;
    }
    // Prefer images with better alt text
    return (b.alt?.length || 0) - (a.alt?.length || 0);
  });
  
  // Return top relevant images, capped at 20
  return images.slice(0, 20);
};

const extractStructuredData = ($) => {
  const data = {
    testimonials: [],
    pricing: [],
    partners: [],
    faq: []
  };

  // Testimonials heuristic
  $(':contains("testimonial"), :contains("what they say"), :contains("reviews")').each((i, el) => {
    const section = $(el).closest('section, div');
    const text = section.text().replace(/\s+/g, ' ').trim();
    if (text.length > 50 && text.length < 1000) {
      data.testimonials.push(text);
    }
  });

  // Pricing heuristic
  $(':contains("$"), :contains("₹"), :contains("£"), :contains("/month"), :contains("/year")').each((i, el) => {
    const text = $(el).text().trim();
    if (text.length > 1 && text.length < 40) {
      data.pricing.push(text);
    }
  });

  // Partners/Clients heuristic
  $('img[alt*="partner" i], img[alt*="client" i], img[alt*="logo" i]').each((i, el) => {
    const src = $(el).attr('src');
    if (src) data.partners.push(src);
  });

  return data;
};

module.exports = { analyzeWebsite, inspectWebsite, extractProjectData, extractBulkImages, extractStructuredData };

