'use strict';

require('dotenv').config();

const cheerio = require('cheerio');
const logger = require('../utils/logger');

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
    const response = await fetch(
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

          response_format: 'b64'
        })
      }
    );

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

      logger.info(
        `[getimg.ai] Image generated successfully`
      );

      return `data:image/jpeg;base64,${data.image}`;
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

  if (
    !htmlContent ||
    typeof htmlContent !== 'string'
  ) {
    return htmlContent;
  }

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
          src.includes('placehold.co')
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
     * GENERATE ALL
     */
    const results = await Promise.all(

      imagesToReplace.map(async (img) => {

        const prompt =
          getPromptForIndustry(
            industry,
            subIndustry,
            img.context
          );

        const width =
          img.context.isHero
            ? 1152
            : 1024;

        const height =
          img.context.isHero
            ? 768
            : 1024;

        const newUrl =
          await generateGetImgUrl(
            prompt,
            width,
            height
          );

        return {
          type: img.type,
          element: img.element,
          originalSrc: img.src,
          newUrl
        };
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

    return $.html();

  } catch (err) {

    logger.error(
      `[ImageGenerationService] ${err.message}`
    );

    return htmlContent;
  }
}

module.exports = {
  replacePlaceholdersInHtml,
  getPromptForIndustry,
  generateGetImgUrl
};