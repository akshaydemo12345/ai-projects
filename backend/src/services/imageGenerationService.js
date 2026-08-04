'use strict';

require('dotenv').config();

const cheerio = require('cheerio');
const sharp = require('sharp');
const logger = require('../utils/logger');
const fs = require('fs');
const path = require('path');
const config = require('../config');

/**
 * API KEY
 * ENV first, fallback second
 */
const API_KEY =
  process.env.GETIMG_API_KEY ||
  '3eN1TZwy915cfl344JDr5FKOQGtrRTV8MsKS519K9nqhWakXqh5bU9BU6iwebRIorqNuMYF7hxK3V85jZ1F3ZKAxBbqZq3wQ';

console.log('🔑 GETIMG KEY:', API_KEY?.slice(0, 20));

/**
 * GENERATE IMAGE
 */
async function generateGetImgUrl(
  promptText,
  width = 512,
  height = 512
) {

  try {

    logger.info(
      `[getimg.ai] Generating image: ${promptText}`
    );

    // Make sure API key starts with key- if it doesn't already
    const actualKey = API_KEY.startsWith('key-') ? API_KEY : `key-${API_KEY}`;

    /**
     * UPDATED API ENDPOINT
     */
    let response;
    let retries = 3;
    let delay = 1000; // start with 1 second delay

    while (retries > 0) {
      response = await fetch(
        'https://api.getimg.ai/v1/flux-schnell/text-to-image',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${actualKey}`,
            'Content-Type': 'application/json',
            Accept: 'application/json'
          },
          body: JSON.stringify({
            prompt: promptText,
            width,
            height,
            steps: 4,
            output_format: 'jpeg',
            response_format: 'url'
          })
        }
      );

      if (response.status === 429) {
        logger.warn(`[getimg.ai] Rate limited. Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // exponential backoff
        retries--;
      } else {
        break; // break out of retry loop if success or other error
      }
    }

    /**
     * RAW RESPONSE
     */
    const rawText = await response.text();

    /**
     * INVALID KEY
     */
    if (response.status === 401) {

      logger.error(
        `[getimg.ai] INVALID API KEY: ${rawText}`
      );

      return null;
    }

    /**
     * OTHER ERROR
     */
    if (!response.ok) {

      logger.error(
        `[getimg.ai] API ERROR ${response.status}: ${rawText}`
      );

      return null;
    }

    /**
     * PARSE JSON
     */
    let data = {};

    try {

      data = JSON.parse(rawText);

    } catch (e) {

      logger.error(
        `[getimg.ai] JSON parse failed`
      );

      return null;
    }

    /**
     * BASE64 IMAGE
     */
    if (data?.image) {
      logger.info(`[getimg.ai] Image generated successfully. Compressing with sharp and saving to disk...`);
      try {
        const buffer = Buffer.from(data.image, 'base64');
        const compressedBuffer = await sharp(buffer)
          .resize({ width, height, fit: 'inside', withoutEnlargement: true })
          .webp({ quality: 60 }) // High compression to keep it in KBs
          .toBuffer();

        const uploadsDir = path.join(__dirname, '../../public/uploads');
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }

        const fileName = `ai_img_${Date.now()}_${Math.random().toString(36).substring(7)}.webp`;
        const filePath = path.join(uploadsDir, fileName);

        fs.writeFileSync(filePath, compressedBuffer);

        const baseUrl = config.api.baseUrl.endsWith('/') ? config.api.baseUrl.slice(0, -1) : config.api.baseUrl;
        const fileUrl = `${baseUrl}/uploads/${fileName}`;

        logger.info(`[getimg.ai] Image saved successfully to ${fileUrl}`);
        return fileUrl;
      } catch (err) {
        logger.error(`[getimg.ai] Compression/Save failed: ${err.message}`);
        return null;
      }
    }

    /**
     * URL IMAGE
     */
    if (data?.url) {

      logger.info(
        `[getimg.ai] Image generated via url`
      );

      return data.url;
    }

    logger.warn(
      `[getimg.ai] Invalid response`
    );

    return null;

  } catch (error) {

    logger.error(
      `[getimg.ai] Exception: ${error.message}`
    );

    return null;
  }
}

/**
 * BUILD PROMPT
 */
function getPromptForIndustry(
  industry,
  subIndustry,
  context
) {

  const ind =
    (industry || 'Business').trim();

  const sub =
    (subIndustry || '').trim();

  const topic =
    sub
      ? `${sub} in ${ind} industry`
      : ind;

  const sectionKeywords = [
    context?.sectionId,
    context?.sectionClass,
    context?.parentId,
    context?.parentClass,
    context?.idAttr,
    context?.classAttr
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  let sceneType = '';

  /**
   * HERO
   */
  if (
    context?.isHero ||
    sectionKeywords.includes('hero') ||
    sectionKeywords.includes('banner')
  ) {

    sceneType =
      'cinematic business hero section, premium office, modern environment, wide composition';

    /**
     * TEAM
     */
  } else if (
    sectionKeywords.includes('team') ||
    sectionKeywords.includes('staff')
  ) {

    sceneType =
      'professional business team, smiling employees, modern office';

    /**
     * SERVICES
     */
  } else if (
    sectionKeywords.includes('service') ||
    sectionKeywords.includes('feature')
  ) {

    sceneType =
      'business service showcase, workflow, professional environment';

    /**
     * TESTIMONIAL
     */
  } else if (
    sectionKeywords.includes('testimonial') ||
    sectionKeywords.includes('review')
  ) {

    sceneType =
      'happy customer, successful client, business success';

    /**
     * CONTACT
     */
  } else if (
    sectionKeywords.includes('contact') ||
    sectionKeywords.includes('footer')
  ) {

    sceneType =
      'modern office reception, welcoming workspace';

    /**
     * DEFAULT
     */
  } else {

    sceneType =
      'professional business photography';
  }

  return `
professional ultra realistic photography of ${topic},
${sceneType},
photorealistic,
8k,
masterpiece,
cinematic lighting,
sharp focus,
DSLR photography
`;
}

/**
 * REPLACE PLACEHOLDERS
 */
async function replacePlaceholdersInHtml(
  htmlContent,
  industry,
  subIndustry
) {

  // 👇 Enable live AI images by default; can be disabled with DISABLE_AI_IMAGES=true in .env
  const DISABLE_AI_IMAGES_FOR_TESTING = process.env.DISABLE_AI_IMAGES === 'true';
  // 👆

  if (!htmlContent || typeof htmlContent !== 'string') {
    return { html: htmlContent, imageCount: 0 };
  }

  if (DISABLE_AI_IMAGES_FOR_TESTING) {
    console.log('[TESTING MODE] 🛑 AI Image Generation is DISABLED. Keeping original template images.');
    return { html: htmlContent, imageCount: 0 };
  }

  const getLocalFallbackImage = (indStr, html = '') => {
    const ind = (indStr || '').toLowerCase();
    const htmlLower = html.toLowerCase();
    if (ind.includes('law') || htmlLower.includes('lawfirm')) return '/assets/templates/LawFirm/templates03/justice.jpg';
    if (ind.includes('health') || ind.includes('medical') || ind.includes('dental') || htmlLower.includes('healthcare')) return '/assets/templates/healthcare/templates03/screnshort82.png';
    if (ind.includes('travel') || ind.includes('tour') || htmlLower.includes('travel')) return '/assets/templates/travel/templates03/dest-venice.jpg';
    if (ind.includes('finance') || ind.includes('bank') || htmlLower.includes('finance')) return '/assets/templates/finance/templates03/screenshot1.png';
    return '/assets/templates/finance/templates01/screenshot.png'; // default
  };

  try {

    const $ = cheerio.load(htmlContent);

    const imagesToReplace = [];

    /**
     * IMG TAGS
     */
    $('img').each((index, element) => {

      const src =
        $(element).attr('src');

      if (
        src &&
        (
          src.includes('unsplash.com') ||
          src.includes('picsum.photos') ||
          src.includes('freepik.com') ||
          src.includes('placehold.co') ||
          (src.includes('/assets/') && !DISABLE_AI_IMAGES_FOR_TESTING)
        )
      ) {

        const idAttr =
          $(element).attr('id') || '';

        const classAttr =
          $(element).attr('class') || '';

        const parentId =
          $(element).parent().attr('id') || '';

        const parentClass =
          $(element).parent().attr('class') || '';

        const sectionId =
          $(element)
            .closest('section')
            .attr('id') || '';

        const sectionClass =
          $(element)
            .closest('section')
            .attr('class') || '';

        const isHero =
          classAttr.includes('hero') ||
          parentClass.includes('hero') ||
          index === 0;

        imagesToReplace.push({
          type: 'img',
          element,
          src,
          context: {
            idAttr,
            classAttr,
            parentId,
            parentClass,
            sectionId,
            sectionClass,
            isHero,
            index
          }
        });
      }
    });

    logger.info(
      `[ImageGenerationService] Found ${imagesToReplace.length} images`
    );

    /**
     * GENERATE ALL IN PARALLEL WITH FAILSAFE FALLBACKS
     */
    const results = await Promise.all(
      imagesToReplace.map(async (img) => {
        try {
          let newUrl;
          if (DISABLE_AI_IMAGES_FOR_TESTING) {
            newUrl = getLocalFallbackImage(industry, htmlContent);
          } else {
            const prompt = getPromptForIndustry(industry, subIndustry, img.context);
            const width = 800;
            const height = 600;
            newUrl = await generateGetImgUrl(prompt, width, height);
          }

          return {
            type: img.type,
            element: img.element,
            originalSrc: img.src,
            newUrl: newUrl || getLocalFallbackImage(industry, htmlContent)
          };
        } catch (err) {
          logger.error(`[ImageGenerationService] Error generating image: ${err.message}`);
          return {
            type: img.type,
            element: img.element,
            originalSrc: img.src,
            newUrl: getLocalFallbackImage(industry, htmlContent)
          };
        }
      })
    );

    /**
     * APPLY URLS
     */
    results.forEach((res) => {

      if (!res?.newUrl) {

        logger.warn(
          `[ImageGenerationService] Failed for ${res.originalSrc}`
        );

        return;
      }

      $(res.element).attr(
        'src',
        res.newUrl
      );

      logger.info(
        `[ImageGenerationService] Replaced image`
      );
    });

    let finalHtml = $.html();

    /**
     * REGEX FOR ANY REMAINING STOCK URLS (e.g. background-image)
     */
    const stockRegex = /((?:https?:\/\/(?:[a-zA-Z0-9-]+\.)*(?:unsplash\.com|picsum\.photos|freepik\.com|placehold\.co)|\/assets\/)[^'"\s\)\>]*)/gi;

    let match;
    const remainingUrls = [];
    while ((match = stockRegex.exec(finalHtml)) !== null) {
      const url = match[1];
      if (DISABLE_AI_IMAGES_FOR_TESTING && url.includes('/assets/')) {
        continue;
      }
      if (!remainingUrls.some(r => r.url === url)) {
        const startIdx = Math.max(0, match.index - 300);
        const precedingText = finalHtml.substring(startIdx, match.index).toLowerCase();
        const isHero = precedingText.includes('hero') || precedingText.includes('banner');

        remainingUrls.push({ url, isHero });
      }
    }

    let remainingResults = [];
    if (remainingUrls.length > 0) {
      logger.info(`[ImageGenerationService] Found ${remainingUrls.length} background/inline images`);

      remainingResults = await Promise.all(
        remainingUrls.map(async (item) => {
          try {
            const context = {
              isHero: item.isHero,
              sectionClass: item.isHero ? 'hero' : ''
            };
            let newUrl;
            if (DISABLE_AI_IMAGES_FOR_TESTING) {
              newUrl = getLocalFallbackImage(industry, htmlContent);
            } else {
              const prompt = getPromptForIndustry(industry, subIndustry, context);
              const width = 1200;
              const height = 800;
              newUrl = await generateGetImgUrl(prompt, width, height);
            }

            return { originalUrl: item.url, newUrl: newUrl || getLocalFallbackImage(industry, htmlContent) };
          } catch (err) {
            logger.error(`[ImageGenerationService] Error generating background image: ${err.message}`);
            return { originalUrl: item.url, newUrl: getLocalFallbackImage(industry, htmlContent) };
          }
        })
      );

      remainingResults.forEach(res => {
        if (res && res.newUrl) {
          finalHtml = finalHtml.split(res.originalUrl).join(res.newUrl);
          logger.info(`[ImageGenerationService] Replaced background image: ${res.originalUrl}`);
        }
      });
    }

    const totalImagesGenerated = results.filter(r => r.newUrl).length +
      (typeof remainingResults !== 'undefined' ? remainingResults.filter(r => r.newUrl).length : 0);

    return { html: finalHtml, imageCount: totalImagesGenerated };

  } catch (err) {

    logger.error(
      `[ImageGenerationService] ${err.message}`
    );

    return { html: htmlContent, imageCount: 0 };
  }
}

module.exports = {
  replacePlaceholdersInHtml,
  getPromptForIndustry,
  generateGetImgUrl
};