'use strict';

const axios = require('axios');
const cheerio = require('cheerio');
const logger = require('../utils/logger');

/**
 * Enhanced structured web scraping service for landing page generation
 * Extracts assets, content, and structure from websites
 */

/**
 * Main function to scrape and structure website content
 */
const scrapeWebsiteStructure = async (websiteUrl) => {
  try {
    // STEP 1: FETCH WEBSITE
    const html = await fetchWebsite(websiteUrl);
    const $ = cheerio.load(html);
    const baseUrl = new URL(websiteUrl).href;

    // STEP 2: EXTRACT ASSETS
    const images = extractImages($, baseUrl);
    const videos = extractVideos($, baseUrl);
    const textContent = extractTextContent($);
    const formFields = extractFormFields($);

    // STEP 3: DETECT STRUCTURE
    const structuredContent = detectStructure($, images, textContent);

    // STEP 4: CLEAN & OPTIMIZE
    const cleanedContent = cleanAndOptimize(structuredContent, images, videos);

    // STEP 5: META INFORMATION
    const meta = extractMeta($);

    // OUTPUT FORMAT
    return {
      website: websiteUrl,
      formFields: formFields,
      assets: [
        ...images.map(img => ({
          type: 'image',
          url: img.url,
          section: img.section || 'unknown'
        })),
        ...videos.map(vid => ({
          type: 'video',
          url: vid.url,
          platform: vid.platform
        }))
      ],
      structuredContent: cleanedContent,
      meta
    };

  } catch (error) {
    logger.error(`Structured scraping failed for ${websiteUrl}:`, error.message);
    throw new Error(`Failed to scrape website: ${error.message}`);
  }
};

/**
 * Fetch website HTML
 */
const fetchWebsite = async (url) => {
  const response = await axios.get(url, {
    timeout: 30000,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    }
  });
  return response.data;
};

/**
 * Extract images with section classification
 */
const extractImages = ($, baseUrl) => {
  const images = [];
  const seenUrls = new Set();

  // Unwanted patterns
  const unwantedPatterns = [
    /icon/i, /sprite/i, /tracking/i, /pixel/i, /beacon/i, /analytics/i,
    /1x1/i, /spacer/i, /dot\.gif/i, /clear\.gif/i, /placeholder/i,
    /favicon/i, /apple-touch-icon/i, /loading/i, /spinner/i,
    /arrow/i, /bullet/i, /check/i, /close/i, /menu/i, /hamburger/i,
    /social.*icon/i, /bg\.png/i, /background.*small/i
  ];

  $('img').each((i, el) => {
    const src = $(el).attr('src');
    const alt = $(el).attr('alt')?.trim() || '';
    const width = $(el).attr('width') ? parseInt($(el).attr('width')) : 0;
    const height = $(el).attr('height') ? parseInt($(el).attr('height')) : 0;
    const parentClass = $(el).parent().attr('class')?.toLowerCase() || '';

    if (!src || src.length < 5) return;
    if (src.startsWith('data:')) return;
    if (seenUrls.has(src)) return;

    // Skip logos smaller than 100px
    if ((alt.toLowerCase().includes('logo') || parentClass.includes('logo')) && (width < 100 || height < 100)) {
      return;
    }

    // Skip unwanted patterns
    const combinedText = `${src} ${alt} ${parentClass}`.toLowerCase();
    if (unwantedPatterns.some(pattern => pattern.test(combinedText))) return;

    // Skip very small images
    if ((width > 0 && width < 50) || (height > 0 && height < 50)) return;

    // Convert to absolute URL
    let fullUrl = src;
    if (!src.startsWith('http')) {
      try {
        fullUrl = new URL(src, baseUrl).href;
      } catch (e) {
        return;
      }
    }

    // Detect section
    const section = detectImageSection($, el, alt, parentClass);

    images.push({
      url: fullUrl,
      alt,
      section,
      width,
      height
    });

    seenUrls.add(src);
  });

  // Extract background images from inline styles
  $('[style*="background-image"]').each((i, el) => {
    const style = $(el).attr('style');
    const match = style.match(/url\(['"]?([^'")]+)['"]?\)/);
    if (match) {
      let bgUrl = match[1];
      if (!bgUrl.startsWith('http')) {
        try {
          bgUrl = new URL(bgUrl, baseUrl).href;
        } catch (e) {
          return;
        }
      }
      if (!seenUrls.has(bgUrl)) {
        images.push({
          url: bgUrl,
          alt: 'Background image',
          section: detectImageSection($, el, '', $(el).attr('class')?.toLowerCase() || '')
        });
        seenUrls.add(bgUrl);
      }
    }
  });

  return images;
};

/**
 * Detect which section an image belongs to
 */
const detectImageSection = ($, el, alt, parentClass) => {
  const $el = $(el);
  const $parents = $el.parents();

  for (let i = 0; i < Math.min($parents.length, 5); i++) {
    const $parent = $parents.eq(i);
    const className = $parent.attr('class')?.toLowerCase() || '';
    const id = $parent.attr('id')?.toLowerCase() || '';

    if (className.includes('hero') || id.includes('hero') || alt.includes('hero')) return 'hero';
    if (className.includes('banner') || id.includes('banner')) return 'hero';
    if (className.includes('service') || id.includes('service')) return 'services';
    if (className.includes('feature') || id.includes('feature')) return 'features';
    if (className.includes('testimonial') || id.includes('testimonial') || alt.includes('testimonial')) return 'testimonial';
    if (className.includes('pricing') || id.includes('pricing')) return 'pricing';
    if (className.includes('contact') || id.includes('contact')) return 'contact';
    if (className.includes('cta') || id.includes('cta')) return 'cta';
  }

  return 'unknown';
};

/**
 * Extract form fields from website
 */
const extractFormFields = ($) => {
  const forms = [];
  
  $('form').each((i, formEl) => {
    const $form = $(formEl);
    const fields = [];
    
    // Extract all input fields
    $form.find('input, select, textarea').each((j, fieldEl) => {
      const $field = $(fieldEl);
      const type = $field.attr('type') || $field.prop('tagName').toLowerCase();
      const name = $field.attr('name') || '';
      const placeholder = $field.attr('placeholder') || '';
      const label = $field.closest('label').text().trim() || 
                   $field.prev('label').text().trim() || 
                   $field.parent().find('label').first().text().trim() || '';
      const required = $field.attr('required') !== undefined;
      
      // Skip hidden fields and submit buttons
      if (type === 'hidden' || type === 'submit' || type === 'button') return;
      
      fields.push({
        type,
        name: name || `field_${fields.length}`,
        label: label || placeholder,
        placeholder,
        required
      });
    });
    
    if (fields.length > 0) {
      forms.push({
        action: $form.attr('action') || '',
        method: $form.attr('method') || 'POST',
        fields
      });
    }
  });
  
  return forms;
};

/**
 * Extract videos
 */
const extractVideos = ($, baseUrl) => {
  const videos = [];

  // HTML5 videos
  $('video').each((i, el) => {
    const src = $(el).attr('src');
    const poster = $(el).attr('poster');
    
    if (src) {
      let fullUrl = src;
      if (!src.startsWith('http')) {
        try {
          fullUrl = new URL(src, baseUrl).href;
        } catch (e) {
          return;
        }
      }
      videos.push({
        url: fullUrl,
        platform: 'html5',
        poster: poster ? (poster.startsWith('http') ? poster : new URL(poster, baseUrl).href) : null
      });
    }
  });

  // YouTube and Vimeo iframes
  $('iframe').each((i, el) => {
    const src = $(el).attr('src');
    if (!src) return;

    let platform = null;
    let videoId = null;

    if (src.includes('youtube.com') || src.includes('youtu.be')) {
      platform = 'youtube';
      const match = src.match(/(?:youtube\.com\/embed\/|youtu\.be\/)([^/?]+)/);
      if (match) videoId = match[1];
    } else if (src.includes('vimeo.com')) {
      platform = 'vimeo';
      const match = src.match(/vimeo\.com\/(\d+)/);
      if (match) videoId = match[1];
    }

    if (platform && videoId) {
      videos.push({
        url: src.startsWith('http') ? src : new URL(src, baseUrl).href,
        platform,
        videoId
      });
    }
  });

  return videos;
};

/**
 * Extract meaningful marketing text content
 */
const extractTextContent = ($) => {
  const content = [];

  // Remove navigation, footer, scripts, etc.
  const $body = $('body').clone();
  $body.find('nav, footer, script, style, noscript, iframe, svg, .cookie-banner, .popup').remove();

  // Headings
  $('h1, h2, h3').each((i, el) => {
    const text = $(el).text().trim();
    const tag = el.tagName.toLowerCase();
    if (text.length > 10) {
      content.push({
        type: 'text',
        category: 'heading',
        content: text,
        level: tag
      });
    }
  });

  // Hero section text
  const heroSelectors = ['.hero', 'header', '.banner', '[class*="hero"]'];
  heroSelectors.forEach(selector => {
    $(selector).each((i, el) => {
      $(el).find('p, span, div').each((j, textEl) => {
        const text = $(textEl).text().trim();
        if (text.length > 20 && text.length < 300) {
          content.push({
            type: 'text',
            category: 'hero',
            content: text
          });
        }
      });
    });
  });

  // Service descriptions
  $('[class*="service"], [class*="feature"]').each((i, el) => {
    const title = $(el).find('h1, h2, h3, h4').first().text().trim();
    const description = $(el).find('p').first().text().trim();
    
    if (title && description) {
      content.push({
        type: 'text',
        category: 'service',
        content: `${title}: ${description}`
      });
    }
  });

  // CTA buttons and links
  $('button, a[href]').each((i, el) => {
    const text = $(el).text().trim();
    const className = $(el).attr('class')?.toLowerCase() || '';
    
    if (text.length > 3 && text.length < 50 && 
        (className.includes('cta') || className.includes('button') || 
         className.includes('submit') || className.includes('action'))) {
      content.push({
        type: 'text',
        category: 'cta',
        content: text
      });
    }
  });

  // Testimonials
  $('[class*="testimonial"], [class*="review"]').each((i, el) => {
    const text = $(el).text().trim();
    if (text.length > 30 && text.length < 500) {
      content.push({
        type: 'text',
        category: 'testimonial',
        content: text
      });
    }
  });

  // Taglines
  $('p').each((i, el) => {
    const text = $(el).text().trim();
    const parentClass = $(el).parent().attr('class')?.toLowerCase() || '';
    
    // Short, punchy text in prominent positions
    if (text.length > 15 && text.length < 150 && 
        (parentClass.includes('hero') || parentClass.includes('banner') || parentClass.includes('headline'))) {
      content.push({
        type: 'text',
        category: 'tagline',
        content: text
      });
    }
  });

  return content;
};

/**
 * Detect structure and organize content into sections
 */
const detectStructure = ($, images, textContent) => {
  const structure = {
    hero: {
      headline: '',
      subheadline: '',
      images: []
    },
    services: [],
    features: [],
    testimonials: [],
    pricing: [],
    cta: {
      text: '',
      buttons: []
    }
  };

  // Extract hero content
  const heroSelectors = ['.hero', 'header', '.banner', '[class*="hero"]', '[class*="banner"]'];
  heroSelectors.forEach(selector => {
    $(selector).first().find('h1, h2').each((i, el) => {
      const text = $(el).text().trim();
      if (!structure.hero.headline && text.length > 10) {
        structure.hero.headline = text;
      } else if (!structure.hero.subheadline && text.length > 10) {
        structure.hero.subheadline = text;
      }
    });
  });

  // Extract hero images
  structure.hero.images = images
    .filter(img => img.section === 'hero')
    .slice(0, 3)
    .map(img => img.url);

  // Extract services
  $('[class*="service"], [class*="Service"]').each((i, el) => {
    const title = $(el).find('h1, h2, h3, h4').first().text().trim();
    const description = $(el).find('p').first().text().trim();
    const image = $(el).find('img').first().attr('src');
    
    if (title && structure.services.length < 10) {
      structure.services.push({
        title,
        description: description || '',
        image: image || ''
      });
    }
  });

  // Extract features
  $('[class*="feature"], [class*="Feature"]').each((i, el) => {
    const title = $(el).find('h1, h2, h3, h4').first().text().trim();
    const description = $(el).find('p').first().text().trim();
    
    if (title && structure.features.length < 10) {
      structure.features.push({
        title,
        description: description || ''
      });
    }
  });

  // Extract testimonials
  $('[class*="testimonial"], [class*="review"]').each((i, el) => {
    const text = $(el).find('p, blockquote').first().text().trim();
    const author = $(el).find('[class*="author"], [class*="name"]').first().text().trim();
    
    if (text.length > 30 && structure.testimonials.length < 10) {
      structure.testimonials.push({
        text,
        author: author || 'Anonymous'
      });
    }
  });

  // Extract pricing
  $('[class*="price"], [class*="pricing"]').each((i, el) => {
    const title = $(el).find('h1, h2, h3').first().text().trim();
    const price = $(el).find('[class*="price"], [class*="amount"]').first().text().trim();
    const features = $(el).find('li').map((j, li) => $(li).text().trim()).get();
    
    if (title && structure.pricing.length < 10) {
      structure.pricing.push({
        title,
        price: price || '',
        features: features.slice(0, 5)
      });
    }
  });

  // Extract CTA
  $('button, a[href]').each((i, el) => {
    const text = $(el).text().trim();
    const className = $(el).attr('class')?.toLowerCase() || '';
    
    if (text.length > 3 && text.length < 50 && 
        (className.includes('cta') || className.includes('button'))) {
      if (structure.cta.buttons.length < 5) {
        structure.cta.buttons.push(text);
      }
    }
  });

  return structure;
};

/**
 * Clean and optimize content
 */
const cleanAndOptimize = (structuredContent, images, videos) => {
  const cleaned = JSON.parse(JSON.stringify(structuredContent));

  // Remove duplicates
  const seenStrings = new Set();
  
  // Clean hero
  cleaned.hero.headline = cleanText(cleaned.hero.headline, seenStrings);
  cleaned.hero.subheadline = cleanText(cleaned.hero.subheadline, seenStrings);
  cleaned.hero.images = [...new Set(cleaned.hero.images)].slice(0, 3);

  // Clean services
  cleaned.services = cleaned.services
    .filter(s => s.title && s.title.length > 5)
    .map(s => ({
      title: cleanText(s.title, seenStrings),
      description: cleanText(s.description, seenStrings),
      image: s.image
    }))
    .slice(0, 10);

  // Clean features
  cleaned.features = cleaned.features
    .filter(f => f.title && f.title.length > 5)
    .map(f => ({
      title: cleanText(f.title, seenStrings),
      description: cleanText(f.description, seenStrings)
    }))
    .slice(0, 10);

  // Clean testimonials
  cleaned.testimonials = cleaned.testimonials
    .filter(t => t.text && t.text.length > 20)
    .map(t => ({
      text: cleanText(t.text, seenStrings),
      author: cleanText(t.author, seenStrings)
    }))
    .slice(0, 10);

  // Clean pricing
  cleaned.pricing = cleaned.pricing
    .filter(p => p.title && p.title.length > 5)
    .slice(0, 10);

  // Clean CTA
  cleaned.cta.text = cleanText(cleaned.cta.text, seenStrings);
  cleaned.cta.buttons = [...new Set(cleaned.cta.buttons)].slice(0, 5);

  return cleaned;
};

/**
 * Clean individual text
 */
const cleanText = (text, seenStrings) => {
  if (!text) return '';
  const cleaned = text.trim().replace(/\s+/g, ' ');
  if (seenStrings.has(cleaned)) return '';
  if (cleaned.length < 20 && cleaned.length > 0) return '';
  seenStrings.add(cleaned);
  return cleaned;
};

/**
 * Extract meta information
 */
const extractMeta = ($) => {
  const title = $('title').text().trim() || $('meta[property="og:title"]').attr('content') || '';
  const description = $('meta[name="description"]').attr('content') || 
                    $('meta[property="og:description"]').attr('content') || '';

  return {
    title,
    description
  };
};

module.exports = {
  scrapeWebsiteStructure
};
