'use strict';

const Anthropic = require('@anthropic-ai/sdk');
const logger = require('../utils/logger');
const cheerio = require('cheerio');

const CLAUDE_MODEL_CANDIDATES = [
  'claude-3-5-sonnet-20241022',
  'claude-3-5-haiku-20241022',
  'claude-3-haiku-20240307',
  process.env.ANTHROPIC_MODEL,
].filter(Boolean);

const OpenAI = require('openai');

/**
 * Build SYSTEM prompt (Claude-Level Master UI Designer)
 */
const buildSystemPrompt = () => {
  return `
Act as a world-class UI/UX Design Director and Conversion Strategist with 20+ years of experience.
Your goal is to generate a UNIQUE, premium, high-converting landing page.
 
VARIATION PRIORITY:
- Never repeat a rigid template.
- Pick a fresh visual direction based on user prompt + business context.
- Vary section order, visual hierarchy, spacing rhythm, and composition.
- Avoid producing "same skeleton with replaced text".
- Use at least one distinctive design motif (timeline, bento cards, split hero, editorial layout, diagonal section transitions, or storytelling flow).
 
CRITICAL DESIGN RULES:
- DO NOT generate a navigation menu or navbar links.
- Place only the brand logo near the top inside the hero/banner area: <img src="{{LOGO_URL}}" alt="Brand Logo" class="h-8 w-auto">
- The top area should look like a clean branded banner, not a traditional website navbar.
- Use high-quality images from 'https://picsum.photos/seed/[ANY_UNIQUE_WORD]/1200/800'.
- BACKGROUND IMAGES: Use inline styles only: style="background-image: url('...'); background-size: cover; background-position: center;"
- SECTION RHYTHM: Alternate backgrounds (e.g., bg-white, then bg-gray-50, then a dark section).
- TYPOGRAPHY: Scale your fonts. H1 should be text-5xl to text-7xl for premium feel.
- GLASSMORPHISM: Use backdrop-blur-md with semi-transparent backgrounds for floating elements.
 
REQUIRED COVERAGE (MANDATORY LONG-FORM EXPERIENCE):
1. You MUST generate a minimum of 8 visual sections by default.
2. CRITICAL: If the USER provides a specific list of sections (e.g., "1. Hero, 2. Trust Bar, 3. Why Choose Us...") you MUST include EVERY SINGLE ONE of them in the exact order requested.
3. DO NOT MERGE sections. DO NOT SKIP sections. If the user asks for 15 sections, you generate 15 distinct, high-fidelity sections.
4. Each section must have its own unique design (bento, grid, list, split, etc.) and professional copy.
 
OUTPUT FORMATTING:
- YOU MUST OUTPUT EVERYTHING IN ONE SINGLE \`\`\`html BLOCK.
- BE CONCISE BUT PREMIUM. Every section should be roughly 800-1200 characters of code.
- Avoid extremely verbose descriptions. Use powerful, punchy copy.
- DO NOT split the page into multiple code blocks.
 
LENGTH + COMPLETENESS:
- Generate a full, deep-scroll landing page with ALL requested sections.
- For 15 sections, you should aim for a total output of around 15,000 to 20,000 characters.
- If you are too verbose in the early sections, you will run out of space. BALANCE your length.
- NEVER use placeholders. You MUST write the full HTML and full copy for EVERY requested section.
- DO NOT STOP early. You MUST finish all 15 sections.
 
PLANNING:
- Map out the code density for each section in your head before starting. Ensure section 15 is just as good as section 1.
 
OUTPUT: Full complete HTML enclosed in a SINGLE \`\`\`html block. No explanation.
`;
};


/**
 * Build SYSTEM prompt for Smart Template Enrichment (JSON Content Injector)
 */
const buildTemplateSystemPrompt = () => {
  return `
Act as a world-class UI/UX Design Director and Conversion Strategist with 20+ years of experience.
Your task is to take the provided Content Map (JSON) of an HTML template and TRANSFORM it into a unique, ultra-premium masterpiece.

GOAL: Return a NEW JSON object containing updated content AND a specialized CSS block to make the design look world-class.

JSON STRUCTURE:
{
  "contentMap": { ... updated keys from the input ... },
  "premiumCss": "/* Your ultra-premium CSS here */",
  "seo": { "title": "...", "description": "..." }
}

RULES FOR CONTENT:
1. TEXT (t- keys): Write high-converting, persuasive, and punchy copy. No placeholders.
2. IMAGES (i- keys): Generate high-quality Unsplash URLs using the 'i-X.src' field. Use descriptive keywords for high-end photography.

RULES FOR PREMIUM CSS:
1. TYPOGRAPHY: Scale the fonts. H1 should be massive (text-5xl to text-7xl). Use Google Fonts imports if needed.
2. DEPTH & GLASSMORPHISM: Add backdrop-blur-md, semi-transparent backgrounds, and soft realistic shadows to cards and sections.
3. RHYTHM: Add padding (py-24, py-32) to sections to let them breathe.
4. COLORS: Use [var(--primary)] and [var(--secondary)] for all branding.
5. ANIMATIONS: Add subtle hover effects and smooth transitions to buttons and cards.
6. MOBILE: Ensure your premium CSS is fully responsive.

CRITICAL: Return ONLY the valid JSON object. No explanation. No markdown code blocks.
`;
};

/**
 * Helper: Extract all text and image content from HTML using Cheerio
 */
const extractContentMap = (html) => {
  const $ = cheerio.load(html);
  const map = {};
  let idCounter = 1;

  // Find text-containing elements
  $('h1, h2, h3, h4, h5, h6, p, span, a, li, label, .pill, button').each((i, el) => {
    const $el = $(el);
    // Only target elements with direct text and no children to avoid overlapping replacements
    const directText = $el.contents().filter(function () {
      return this.nodeType === 3;
    }).text().trim();

    if (directText.length > 1) {
      const id = `t-${idCounter++}`;
      $el.attr('data-ai-id', id);
      map[id] = directText;
    }
  });

  // Find images
  $('img').each((i, el) => {
    const $el = $(el);
    const id = `i-${idCounter++}`;
    $el.attr('data-ai-id', id);
    map[id] = {
      src: $el.attr('src') || '',
      alt: $el.attr('alt') || ''
    };
  });

  return { htmlWithIds: $.html(), contentMap: map };
};

/**
 * Helper: Inject new content back into HTML using Cheerio
 */
const injectContentMap = (htmlWithIds, newMap) => {
  const $ = cheerio.load(htmlWithIds);

  Object.keys(newMap).forEach(id => {
    const value = newMap[id];
    const $el = $(`[data-ai-id="${id}"]`);

    if ($el.length) {
      if (id.startsWith('t-')) {
        // Replace ONLY the text node part to preserve sub-elements if any
        $el.contents().filter(function () {
          return this.nodeType === 3;
        }).first().replaceWith(value);
      } else if (id.startsWith('i-')) {
        if (typeof value === 'object') {
          if (value.src) $el.attr('src', value.src);
          if (value.alt) $el.attr('alt', value.alt);
        } else if (typeof value === 'string') {
          $el.attr('src', value);
        }
      }
    }
  });

  // Remove the temporary IDs
  $('[data-ai-id]').removeAttr('data-ai-id');

  return $.html();
};

/**
 * Build USER prompt (Business Context + Branding)
 */
const buildUserPrompt = (input) => {
  const { businessName, industry, businessDescription, ctaText, logoUrl, primaryColor, secondaryColor, scrapedData } = input;
  const scrapedImages = scrapedData?.images?.slice(0, 5) || [];

  return `
# CONTEXT:
- Name: ${businessName} | Industry: ${industry}
- Desc: ${businessDescription}
- Goal: ${input.aiPrompt} | CTA: ${ctaText || 'Get Started'}
- Colors: Primary [var(--primary)] (${primaryColor}), Secondary [var(--secondary)] (${secondaryColor})
- Logo: {{LOGO_URL}} (${logoUrl})

# RULES:
- Lead form mandatory. 
- Headlines must be conversion-focused. 
- Use [var(--primary)] for background-colors.
- Output detailed content, not placeholders.`;
};

/**
 * Call Claude only
 */
/**
 * Calculate cost based on model and tokens
 */
const calculateCost = (model, inputTokens, outputTokens) => {
  const pricing = {
    'claude-3-5-sonnet': { input: 0.000003, output: 0.000015 },
    'claude-3-5-haiku': { input: 0.000001, output: 0.000005 },
    'claude-3-haiku': { input: 0.00000025, output: 0.00000125 },
    'gpt-4o-mini': { input: 0.00000015, output: 0.0000006 },
    'gpt-4o': { input: 0.000005, output: 0.000015 },
    'default': { input: 0.000003, output: 0.000015 }
  };

  const modelKey = Object.keys(pricing).find(key => model.toLowerCase().includes(key)) || 'default';
  const { input, output } = pricing[modelKey];

  return (inputTokens * input) + (outputTokens * output);
};

/**
 * Call Claude only
 */
const callAI = async (userPrompt, logoUrl = '', systemPrompt = '') => {
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  if (!anthropicKey && !openaiKey) {
    logger.error('AI API keys are missing');
    throw new Error('Neither ANTHROPIC_API_KEY nor OPENAI_API_KEY is configured');
  }

  const primaryHex = userPrompt.match(/- PRIMARY COLOR: (#[0-9a-fA-F]{3,6})/)?.[1] || '#7c3aed';
  const secondaryHex = userPrompt.match(/- SECONDARY COLOR: (#[0-9a-fA-F]{3,6})/)?.[1] || '#6366f1';
  const businessName = userPrompt.match(/- Name: ([\s\S]*?) \|/)?.[1] || 'design';

  const finalSystemPrompt = systemPrompt
    .replace(/\[PRIMARY_HEX\]/g, primaryHex)
    .replace(/\[SECONDARY_HEX\]/g, secondaryHex)
    .replace(/{{BUSINESS_NAME_KEYWORD}}/g, businessName.toLowerCase().replace(/\s+/g, '-'));

  // 1. Try OpenAI first if available (often more reliable)
  if (openaiKey) {
    try {
      const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
      logger.info(`[AI] Attempting OpenAI model: ${model}`);
      const openai = new OpenAI({ apiKey: openaiKey });

      const response = await openai.chat.completions.create({
        model,
        messages: [
          { role: 'system', content: finalSystemPrompt },
          { role: 'user', content: Array.isArray(userPrompt) ? JSON.stringify(userPrompt) : userPrompt }
        ],
        max_tokens: 8000,
        temperature: 0.8
      });

      const rawText = response.choices[0].message.content;
      const usage = response.usage;
      const result = processResult(rawText, logoUrl);

      return {
        ...result,
        aiUsage: {
          promptTokens: usage.prompt_tokens,
          completionTokens: usage.completion_tokens,
          totalTokens: usage.total_tokens,
          cost: calculateCost(model, usage.prompt_tokens, usage.completion_tokens),
          model: model
        }
      };
    } catch (err) {
      logger.error(`[AI] OpenAI failed: ${err.message}`);
      // Continue to Anthropic fallback
    }
  }

  // 2. Fallback to Anthropic candidates
  if (anthropicKey) {
    const anthropic = new Anthropic({ apiKey: anthropicKey });
    let lastError = null;

    for (const model of CLAUDE_MODEL_CANDIDATES) {
      try {
        logger.info(`[AI] Attempting Claude model: ${model}`);

        const messageContent = typeof userPrompt === 'string'
          ? userPrompt
          : userPrompt;

        const response = await anthropic.messages.create({
          model,
          max_tokens: 8000,
          temperature: 0.8,
          system: finalSystemPrompt,
          messages: Array.isArray(messageContent) ? messageContent : [{ role: 'user', content: messageContent }],
        });

        const rawText = response.content[0].text;
        const usage = response.usage;
        const result = processResult(rawText, logoUrl);

        return {
          ...result,
          aiUsage: {
            promptTokens: usage.input_tokens,
            completionTokens: usage.output_tokens,
            totalTokens: usage.input_tokens + usage.output_tokens,
            cost: calculateCost(model, usage.input_tokens, usage.output_tokens),
            model: model
          }
        };
      } catch (err) {
        lastError = err;
        logger.error(`[AI] Claude model failed (${model}): ${err.message}`);
        const msg = String(err.message || '').toLowerCase();
        const isModelNotFound = msg.includes('not_found') || msg.includes('model:');
        if (!isModelNotFound) break;
      }
    }
    throw new Error(`AI generation failed: ${lastError?.message || 'Unknown error'}`);
  }

  throw new Error('AI generation failed: No provider succeeded');
};

/**
 * Post-Processing
 */
const processResult = (raw, logoUrl) => {
  let clean = cleanHTML(raw);
  // Case-insensitive replacement for logo tag
  const logoPlaceholder = 'https://placehold.co/200x60/f8fafc/6366f1?text=BRAND';
  const finalLogo = logoUrl && logoUrl.trim() !== '' ? logoUrl : logoPlaceholder;

  clean = clean.replace(/\{\{LOGO_URL\}\}/gi, finalLogo);
  clean = clean.replace(/\{\{logoUrl\}\}/gi, finalLogo);


  const titleMatch = clean.match(/<title>([\s\S]*?)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : 'Landing Page';

  let css = '';
  const styleMatches = clean.match(/<style[^>]*>([\s\S]*?)<\/style>/gi);
  if (styleMatches && Array.isArray(styleMatches)) {
    css = styleMatches.map(s => s.replace(/<\/?style[^>]*>/gi, '')).join('\n');
  }

  return { fullHtml: clean, fullCss: css, fullJs: '', seo: { title } };
};

const cleanHTML = (raw) => {
  if (typeof raw !== 'string') return '';
  // Enhanced regex to find all ```html ... ``` blocks.
  // The closing ``` is now optional (?) to handle truncated responses.
  const regex = /```(?:html)?\s*([\s\S]*?)(?:```|$)/gi;
  let matches = [];
  let match;
  while ((match = regex.exec(raw)) !== null) {
    if (match[1]) {
      let content = match[1].trim();
      // If content ends with backticks that weren't captured by the non-greedy match, clean them
      content = content.replace(/```$/g, '').trim();
      matches.push(content);
    }
  }

  // If we found any blocks, join them.
  if (matches.length > 0) return matches.join('\n');

  // fallback logic if no code blocks are found at all
  const htmlMatch = raw.match(/(<!DOCTYPE[\s\S]*?<\/html>)/i) || raw.match(/(<html[\s\S]*?<\/html>)/i);
  if (htmlMatch) return htmlMatch[1].trim();

  return raw.replace(/```html/gi, '').replace(/```/g, '').trim();
};

const generateLandingPageContent = async (input) => {
  // 1. Build the Master AI Designer System Prompt
  const systemPrompt = buildSystemPrompt();

  // 2. Build the User Context and Prompt
  let userPrompt = `
${buildUserPrompt(input)}

# INSTRUCTION:
Generate a world-class, premium landing page. 
${input.templateHtml ? 'Use the following HTML as DESIGN INSPIRATION/BASELINE, but EVOLVE it into a unique, custom-designed masterpiece. Do not feel restricted by its structure.' : ''}
${input.templateHtml ? `\n# BASELINE INSPIRATION:\n${input.templateHtml}\n` : ''}

# CORE REQUIREMENTS:
- Generate a complete, high-converting landing page with 8+ sections.
- Include strong hero section with compelling headline (massive typography).
- Include CTA in strategic positions.
- Include industry-specific form.
- Use bento grids, mesh gradients, and glassmorphism.
- Include testimonials, FAQs, and trust badges.
- Content should be persuasive and conversion-focused.
- Vary section designs for visual interest.
`;

  // 3. Handle Vision / Image-to-Design
  const result = await callAI(userPrompt, input.logoUrl, systemPrompt);
  return result;
};

const improveSectionContent = async ({ sectionType, currentContent, aiPrompt }) => {
  const prompt = `Improve this ${sectionType}: ${JSON.stringify(currentContent)}. Instruction: ${aiPrompt}`;
  return await callAI(prompt);
};

const generateProjectSuggestions = async ({ projectName, industry, projectDescription, services, pageTitles }) => {
  const servicesText = services && services.length > 0 ? services.join(', ') : 'various services';
  const pageTitlesText = pageTitles && pageTitles.length > 0 ? pageTitles.join(', ') : 'none';

  const prompt = `
    Generate 6 short landing page description suggestions for this business.

    Project Name: ${projectName}
    Industry: ${industry}
    Business Description: ${projectDescription || 'Not provided'}
    Services: ${servicesText}
    Existing Pages: ${pageTitlesText}

    Each suggestion should:
    - be 1 sentence
    - be concise (10-20 words)
    - be related to lead generation
    - be useful for a landing page
    - help the user quickly generate a page
    - be different from existing pages

    OUTPUT FORMAT:
    Return ONLY a JSON array of strings, like this:
    ["suggestion 1", "suggestion 2", "suggestion 3", "suggestion 4", "suggestion 5", "suggestion 6"]
    No other text, no markdown, no code blocks.
  `;

  const result = await callAI(prompt);
  const responseText = result.fullHtml || '';

  try {
    // Try to parse as JSON array
    const parsed = JSON.parse(responseText);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    // If not an array, try to extract array from response
    const arrayMatch = responseText.match(/\[.*\]/s);
    if (arrayMatch) {
      return JSON.parse(arrayMatch[0]);
    }
    // Fallback: split by newlines and clean up
    return responseText.split('\n')
      .map(line => line.replace(/^["'\d\.\s-]+/, '').replace(/["'\s]+$/, '').trim())
      .filter(line => line.length > 5)
      .slice(0, 6);
  } catch (e) {
    // Fallback: split by newlines and clean up
    return responseText.split('\n')
      .map(line => line.replace(/^["'\d\.\s-]+/, '').replace(/["'\s]+$/, '').trim())
      .filter(line => line.length > 5)
      .slice(0, 6);
  }
};

const generateDescriptionSuggestion = async ({ pageName, industry, projectDesc, currentPrompt }) => {
  let prompt;

  if (!currentPrompt || currentPrompt.trim() === '') {
    prompt = `
      You are an expert prompt engineer for an AI Landing Page Builder.
      Generate a detailed landing page description for:
      Page Name: "${pageName}"
      Industry: "${industry}"
      Context: ${projectDesc}
      Make it 100-150 words, conversion-focused. Return ONLY the raw string.
    `;
  } else {
    prompt = `
      Expand and improve this landing page idea:
      User Input: ${currentPrompt}
      Page Name: "${pageName}"
      Industry: "${industry}"
      Context: ${projectDesc}
      Make it 150-250 words. Return ONLY the raw string.
    `;
  }

  const result = await callAI(prompt);
  return {
    suggestion: result.fullHtml || result.fullCss || 'Failed to generate suggestion',
    aiUsage: result.aiUsage
  };
};

/**
 * Generate a strategic landing page structure (Expert CRO Strategist)
 */
const generateStrategicStructure = async (input) => {
  const { businessName, industry, businessDescription, services = [], websiteContent = '' } = input;

  const systemPrompt = `Act as a World-Class UX Strategist. Output ONLY valid JSON for a landing page structure.`;
  const userPrompt = `Industry: ${industry}, Business: ${businessName}, Services: ${services.join(', ')}, Description: ${businessDescription}. Generate structure JSON.`;

  const result = await callAI(userPrompt, '', systemPrompt);

  try {
    let text = result.fullHtml || '';
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const plan = JSON.parse(text);
    return { plan, aiUsage: result.aiUsage };
  } catch (err) {
    logger.error('Strategic Plan JSON Error:', err.message);
    throw new Error('Strategic Plan Generation Failed');
  }
};

/**
 * AI Landing Page Optimization Engine
 * Fixes, improves, and upgrades existing landing pages using real data.
 */
const optimizeStrategicStructure = async ({ projectData, scrapedData, existingPage }) => {
  const systemPrompt = `You are a CRO Architect. Map images and optimize sections. Output ONLY JSON.`;
  const userPrompt = `Optimize this page: ${JSON.stringify(existingPage)} using ${JSON.stringify(projectData)}.`;

  const result = await callAI(userPrompt, '', systemPrompt);

  try {
    const text = result.fullHtml || '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const plan = JSON.parse(jsonMatch ? jsonMatch[0] : text);
    return { plan, aiUsage: result.aiUsage };
  } catch (err) {
    logger.error('Optimization Engine JSON Error:', err.message);
    throw new Error('Optimization Engine Failed');
  }
};

module.exports = {
  generateLandingPageContent,
  improveSectionContent,
  generateDescriptionSuggestion,
  generateProjectSuggestions,
  generateStrategicStructure,
  optimizeStrategicStructure
};