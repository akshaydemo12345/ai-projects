'use strict';

const cheerio = require('cheerio');
const logger = require('../utils/logger');

// Load API key from env or fallback to user provided one
const API_KEY = process.env.GETIMG_API_KEY || 'key-54NsebEgusxOP4O2zxmaMfI7CvHeJ1q7sDxHs6ajZf34soSsgRWbsK9RYDQlYfy3KCGPaZpyvqbKtGZS33M1tM50BbWhhOmY';

/**
 * Generate image using getimg.ai API
 * @param {string} promptText - The description of the image to generate
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @returns {Promise<string|null>} Signed URL of the generated image
 */
async function generateGetImgUrl(promptText, width = 512, height = 512) {
  try {
    logger.info(`[getimg.ai] Generating image with prompt: "${promptText}" (${width}x${height})`);
    
    let response = await fetch('https://api.getimg.ai/v1/stable-diffusion-xl/text-to-image', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        model: 'stable-diffusion-xl-v1-0',
        prompt: promptText,
        negative_prompt: '(deformed iris, deformed pupils, semi-realistic, cgi, 3d, render, sketch, cartoon, drawing, anime:1.4), text, close up, cropped, out of frame, worst quality, low quality, jpeg artifacts, ugly, duplicate, morbid, mutilated, extra fingers, mutated hands, poorly drawn hands, poorly drawn face, mutation, deformed, blurry, dehydrated, bad anatomy, bad proportions, extra limbs, cloned face, disfigured, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, fused fingers, too many fingers, long neck, creepy',
        width,
        height,
        steps: 30,
        response_format: 'url'
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      logger.error(`[getimg.ai] SDXL API error: ${response.status} - ${errorText}`);
      return null;
    }

    const data = await response.json();
    if (data && data.url) {
      logger.info(`[getimg.ai] Image generated successfully: ${data.url}`);
      return data.url;
    } else {
      logger.warn(`[getimg.ai] API response missing url field: ${JSON.stringify(data)}`);
      return null;
    }
  } catch (error) {
    logger.error(`[getimg.ai] Exception during API call: ${error.message}`);
    return null;
  }
}

/**
 * Construct an optimized Stable Diffusion prompt dynamically based on industry, sub-industry, and page context
 */
function getPromptForIndustry(industry, subIndustry, context) {
  const ind = (industry || 'Business').trim();
  const sub = (subIndustry || '').trim();
  const alt = (context?.altText || '').trim();
  const isHero = context?.isHero || false;
  const index = context?.index || 0;
  
  // Create a base topic combining industry and sub-industry
  const topic = sub ? `${sub} in the ${ind} industry` : ind;
  
  // Extract contextual keywords from the element's position in the DOM
  const sectionKeywords = [
    context?.sectionId, 
    context?.sectionClass, 
    context?.parentId, 
    context?.parentClass, 
    context?.idAttr, 
    context?.classAttr
  ].filter(Boolean).join(' ').toLowerCase();

  let sceneType = '';
  
  // Dynamically determine the scene based on section keywords
  if (isHero || sectionKeywords.includes('hero') || sectionKeywords.includes('banner') || sectionKeywords.includes('header')) {
    sceneType = 'epic wide shot, grand establishment, main service showcase, welcoming environment, high impact, stunning architecture';
  } else if (sectionKeywords.includes('team') || sectionKeywords.includes('about') || sectionKeywords.includes('staff')) {
    sceneType = 'professional friendly portrait of staff, team at work, human interaction, diverse professionals, attractive models, perfect symmetrical faces, bright smiles';
  } else if (sectionKeywords.includes('service') || sectionKeywords.includes('feature') || sectionKeywords.includes('offer')) {
    sceneType = 'service in action, detailed feature showcase, professional equipment or process, high quality';
  } else if (sectionKeywords.includes('testimonial') || sectionKeywords.includes('review') || sectionKeywords.includes('client')) {
    sceneType = 'happy satisfied client, successful outcome, positive expression, authentic moment, attractive models, perfect symmetrical faces';
  } else if (sectionKeywords.includes('contact') || sectionKeywords.includes('footer') || sectionKeywords.includes('location')) {
    sceneType = 'welcoming reception, modern office building exterior or interior, customer support, beautiful environment';
  } else {
    // Default variations based on index to ensure variety if context is missing
    const mod = index % 4;
    if (mod === 0) {
      sceneType = 'beautiful modern establishment, clean interior or exterior, professional environment';
    } else if (mod === 1) {
      sceneType = 'professionals at work, interacting with clients or tools, friendly atmosphere, attractive models, perfect symmetrical faces';
    } else if (mod === 2) {
      sceneType = 'close-up detail of products, materials, or service delivery, high quality';
    } else {
      sceneType = 'lifestyle shot, happy customers or successful business outcome, bright and positive, attractive models, perfect symmetrical faces';
    }
  }

  // Construct the final dynamic prompt
  let promptText = `professional high-quality photography of ${topic}`;
  
  // Note: We deliberately IGNORE the template's original image altText here.
  // Templates have hardcoded alt texts (e.g., "African Savanna" in a Travel template)
  // which will completely conflict if the user applies that template to a different industry (e.g., "Agency").
  // Relying on the section keywords (hero, team, etc.) ensures relevance to the USER's industry.
  
  promptText += `. Scene: ${sceneType}. RAW photo, highly detailed, photorealistic, 8k resolution, (masterpiece, best quality, ultra-detailed, highly detailed:1.2), natural cinematic lighting, sharp focus, award-winning photography, DSLR.`;

  // Contrast hint for overlaid text visibility
  if (context?.isLightText || isHero) {
    promptText += ` Ensure the image has a dark, moody, or slightly underexposed composition so that overlaid white text will be highly legible.`;
  } else if (context?.isDarkText) {
    promptText += ` Ensure the image is very bright, well-lit, and airy so that overlaid dark text will be highly legible.`;
  }

  return promptText;
}

/**
 * Parses HTML, finds all Unsplash, Picsum, and Freepik images, generates relevant getimg.ai images, and replaces them.
 * @param {string} htmlContent - The page HTML content
 * @param {string} industry - The project industry
 * @param {string} subIndustry - The project sub-industry
 * @returns {Promise<string>} The updated HTML with replaced image URLs
 */
async function replacePlaceholdersInHtml(htmlContent, industry, subIndustry) {
  if (!htmlContent || typeof htmlContent !== 'string') return htmlContent;

  try {
    const $ = cheerio.load(htmlContent);
    const imagesToReplace = [];

    // Find all images matching Unsplash, Picsum, or Freepik
    $('img').each((index, element) => {
      const src = $(element).attr('src');
      if (src && (
        src.includes('unsplash.com') || 
        src.includes('picsum.photos') || 
        src.includes('freepik.com') ||
        src.includes('placehold.co')
      )) {
        const altText = $(element).attr('alt') || '';
        
        // Identify hero image (typically first image or has hero/banner classes)
        const idAttr = $(element).attr('id') || '';
        const classAttr = $(element).attr('class') || '';
        const parentId = $(element).parent().attr('id') || '';
        const parentClass = $(element).parent().attr('class') || '';
        
        const isHero = idAttr.includes('hero') || classAttr.includes('hero') || 
                       parentId.includes('hero') || parentClass.includes('hero') ||
                       index === 0;

        const sectionId = $(element).closest('section, div[id], div[class*="section"]').attr('id') || '';
        const sectionClass = $(element).closest('section, div[class*="section"]').attr('class') || '';

        // Check if there are explicit light/dark text classes within this section
        const isLightText = parentClass.includes('text-white') || parentClass.includes('text-light') || classAttr.includes('text-white');
        const isDarkText = parentClass.includes('text-dark') || parentClass.includes('text-black');

        const context = {
          altText,
          idAttr,
          classAttr,
          parentId,
          parentClass,
          sectionId,
          sectionClass,
          isHero,
          isLightText,
          isDarkText,
          index
        };

        imagesToReplace.push({
          type: 'img',
          element,
          src,
          context
        });
      }
    });

    // Find all elements with inline style containing url(...)
    $('[style*="url("]').each((index, element) => {
      const styleAttr = $(element).attr('style');
      if (!styleAttr) return;

      const match = styleAttr.match(/url\(['"]?(https?:\/\/[^'")\s]+)['"]?\)/i);
      if (match) {
        const src = match[1];
        if (src && (
          src.includes('unsplash.com') || 
          src.includes('picsum.photos') || 
          src.includes('freepik.com') ||
          src.includes('placehold.co')
        )) {
          const idAttr = $(element).attr('id') || '';
          const classAttr = $(element).attr('class') || '';
          const parentId = $(element).parent().attr('id') || '';
          const parentClass = $(element).parent().attr('class') || '';
          
          const isHero = idAttr.includes('hero') || classAttr.includes('hero') || 
                         parentId.includes('hero') || parentClass.includes('hero') ||
                         $(element).is('section.hero') || $(element).hasClass('hero');

          const sectionId = $(element).closest('section, div[id], div[class*="section"]').attr('id') || '';
          const sectionClass = $(element).closest('section, div[class*="section"]').attr('class') || '';

          // Look for text elements inside the background container to determine contrast needs
          const innerHtml = $(element).html() || '';
          const isLightText = innerHtml.includes('text-white') || innerHtml.includes('color: #fff') || innerHtml.includes('color: white');
          const isDarkText = innerHtml.includes('text-dark') || innerHtml.includes('text-black');

          const context = {
            altText: 'background image',
            idAttr,
            classAttr,
            parentId,
            parentClass,
            sectionId,
            sectionClass,
            isHero,
            isLightText,
            isDarkText,
            index: index + 100
          };

          imagesToReplace.push({
            type: 'style',
            element,
            src,
            context
          });
        }
      }
    });

    if (imagesToReplace.length === 0) {
      return htmlContent;
    }

    logger.info(`[ImageGenerationService] Found ${imagesToReplace.length} placeholder images (including background-images) to replace for industry: "${industry}", sub-industry: "${subIndustry}"`);

    // Call getimg.ai API in parallel
    const generationPromises = imagesToReplace.map(async (img) => {
      const prompt = getPromptForIndustry(industry, subIndustry, img.context);
      
      // Landscape (1152x768) for hero images, square (1024x1024) for cards and portraits
      const width = img.context.isHero ? 1152 : 1024;
      const height = img.context.isHero ? 768 : 1024;

      const newUrl = await generateGetImgUrl(prompt, width, height);
      return {
        type: img.type,
        element: img.element,
        originalSrc: img.src,
        newUrl
      };
    });

    const results = await Promise.all(generationPromises);

    // Apply the new URLs
    results.forEach((res) => {
      if (res.newUrl) {
        if (res.type === 'style') {
          const oldStyle = $(res.element).attr('style') || '';
          const updatedStyle = oldStyle.replace(res.originalSrc, res.newUrl);
          $(res.element).attr('style', updatedStyle);
        } else {
          $(res.element).attr('src', res.newUrl);
        }
        logger.info(`[ImageGenerationService] Replaced image: ${res.originalSrc} -> ${res.newUrl}`);
      } else {
        logger.warn(`[ImageGenerationService] Failed to generate replacement image for ${res.originalSrc}. Keeping original.`);
      }
    });

    return $.html();
  } catch (err) {
    logger.error(`[ImageGenerationService] Error in replacePlaceholdersInHtml: ${err.message}`);
    return htmlContent;
  }
}

module.exports = {
  replacePlaceholdersInHtml,
  getPromptForIndustry,
  generateGetImgUrl
};
