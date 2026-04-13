'use strict';

const https = require('https');
const http = require('http');

/**
 * Robust fetcher that follows redirects and handles both HTTP/HTTPS.
 * @param {string} targetUrl 
 * @param {number} redirects 
 * @returns {Promise<string>}
 */
const fetchUrlContent = (targetUrl, redirects = 0) => {
  return new Promise((resolve, reject) => {
    if (redirects > 5) {
      return reject(new Error('Too many redirects'));
    }

    const urlObj = new URL(targetUrl);
    const client = urlObj.protocol === 'https:' ? https : http;
    
    const options = {
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      }
    };

    const req = client.get(targetUrl, options, (res) => {
      // Handle Redirects (301, 302, 307, 308)
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let redirectUrl = res.headers.location;
        if (!redirectUrl.startsWith('http')) {
          redirectUrl = new URL(redirectUrl, targetUrl).href;
        }
        return resolve(fetchUrlContent(redirectUrl, redirects + 1));
      }

      if (res.statusCode !== 200) {
        return reject(new Error(`Server returned HTTP ${res.statusCode}`));
      }

      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        // Extraction
        const titleMatch = data.match(/<title>(.*?)<\/title>/i);
        const faviconMatch = data.match(/<link[^>]+rel=["'](?:shortcut )?icon["'][^>]+href=["'](.*?)["']/i) ||
                           data.match(/<link[^>]+href=["'](.*?)["'][^>]+rel=["'](?:shortcut )?icon["']/i);
        const ogImageMatch = data.match(/<meta[^>]+property=["']og:image["'][^>]+content=["'](.*?)["']/i);
        const brandMatch = data.match(/<meta[^>]+property=["']og:site_name["'][^>]+content=["'](.*?)["']/i);
        
        let faviconUrl = faviconMatch ? faviconMatch[1] : `https://${urlObj.host}/favicon.ico`;
        if (faviconUrl && !faviconUrl.startsWith('http')) {
          faviconUrl = new URL(faviconUrl, targetUrl).href;
        }

        // Clean body text for AI
        const bodyText = data.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, '')
                            .replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gim, '')
                            .replace(/<[^>]+>/g, ' ')
                            .replace(/\s+/g, ' ')
                            .trim()
                            .substring(0, 6000); // Increased character limit

        resolve(`
          Source URL: ${targetUrl}
          Brand Name: ${brandMatch ? brandMatch[1] : (titleMatch ? titleMatch[1].split('|')[0].trim() : 'N/A')}
          Title: ${titleMatch ? titleMatch[1] : 'N/A'}
          Favicon: ${faviconUrl}
          OG Image: ${ogImageMatch ? ogImageMatch[1] : 'N/A'}
          Page Content: ${bodyText}
        `);
      });
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timed out after 15 seconds'));
    });

    req.on('error', (err) => {
      reject(new Error(`Connection failed: ${err.message}`));
    });
  });
};

/**
 * Analyzes a website URL and generates optimized landing page JSON.
 */
const analyzeWebsite = async (websiteUrl) => {
  const rawContent = await fetchUrlContent(websiteUrl);
  const aiHelper = require('./aiService');

  const prompt = `
    Analyze the following scraped content from a website and create an OPTIMIZED landing page structure in JSON.
    
    SCRAPED CONTENT:
    ${rawContent}
    
    ---
    
    REQUIREMENTS:
    1. Extract the primary brand colors (hex).
    2. Suggest a conversion-optimized headline inspired by the source but better.
    3. Identify the main call-to-action used on the site.
    4. Provide SEO metadata.
    
    RETURN ONLY JSON.
  `;

  return await aiHelper.generateLandingPageContent({
    businessName: 'Website Analysis Agent',
    industry: 'High Conversion',
    pageType: 'lead generation',
    targetAudience: 'Website Owners',
    businessDescription: 'Analyzing existing web structure to improve UX/UI.',
    ctaText: 'Optimized Action',
    aiPrompt: prompt
  });
};

module.exports = { analyzeWebsite };
