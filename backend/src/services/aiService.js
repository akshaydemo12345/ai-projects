'use strict';

const Anthropic = require('@anthropic-ai/sdk');
const logger = require('../utils/logger');
const cheerio = require('cheerio');

/**
 * =========================================
 * PREMIUM CLAUDE MODELS
 * =========================================
 */
const CLAUDE_MODEL_CANDIDATES = [
<<<<<<< HEAD
  process.env.ANTHROPIC_MODEL,
  'claude-3-5-sonnet-latest',
  'claude-3-5-haiku-latest',
  'claude-3-opus-latest',
].filter(Boolean);
=======
  'claude-sonnet-4-20250514',
  'claude-3-5-sonnet-latest',
  'claude-3-5-haiku-latest'
];
>>>>>>> b6865f31404e3cb3ef6c418ad20bb52997091034

const OpenAI = require('openai');

/**
 * =========================================
 * PREMIUM SYSTEM PROMPT
 * =========================================
 */
const buildSystemPrompt = (seed = '') => {
  return `
You are a World-Class Senior UI/UX Design Director and Conversion Architect.

MISSION:
Generate a COMPLETE premium landing page with a UNIQUE layout every single time.

DESIGN SEED:
${seed}

CRITICAL RULES:
- NEVER generate duplicate layouts.
- Every page MUST feel premium like Stripe, Linear, Framer, Apple.
- Use different section flow every generation.
- Use asymmetric layouts.
- Use layered gradients.
- Use glassmorphism.
- Use floating cards.
- Use alternating dark/light sections.
- Use premium typography.
- Use deep-scroll storytelling layouts.
- Use modern SaaS visuals.
- Use Bento Grid sections sometimes.
- Use Split Hero sometimes.
- Use Timeline Flow sometimes.
- Use Card Mosaic layouts sometimes.

MANDATORY:
- NO NAVBAR LINKS
- TOP HEADER MUST CONTAIN ONLY LOGO

- Logo MUST use this exact HTML:
<img src="{{LOGO_URL}}" alt="Logo" class="h-12 w-auto object-contain">

- Logo MUST appear at top-left.
- Logo MUST be visible on both dark and light backgrounds.
- NEVER remove or modify {{LOGO_URL}}

- HERO SECTION REQUIRED
- LEAD FORM REQUIRED
- TESTIMONIALS REQUIRED
- FAQ REQUIRED
- FOOTER REQUIRED
- MINIMUM 8 SECTIONS
- FULL PAGE REQUIRED
- NEVER STOP EARLY

IMAGE RULES:
Use:
https://picsum.photos/seed/[keyword]/1200/800

COLORS:
ONLY USE:
var(--primary)
var(--secondary)

TYPOGRAPHY:
- H1 = text-6xl to text-7xl
- modern spacing
- premium whitespace

TECH STACK:
- TailwindCSS CDN
- Responsive Design
- Modern Animations
- Mobile First
- Premium spacing
- Glassmorphism cards
- Smooth hover effects

OUTPUT:
RETURN ONLY:
\`\`\`html
FULL HTML
\`\`\`

NO EXPLANATION.
`;
};

/**
<<<<<<< HEAD
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
=======
 * =========================================
 * USER PROMPT
 * =========================================
>>>>>>> b6865f31404e3cb3ef6c418ad20bb52997091034
 */
const buildUserPrompt = (input) => {
  return `
BUSINESS NAME:
${input.businessName}

<<<<<<< HEAD
# RULES:
- Lead form mandatory. 
- Headlines must be conversion-focused. 
- Use [var(--primary)] for background-colors.
- Output detailed content, not placeholders.`;
=======
INDUSTRY:
${input.industry}

BUSINESS DESCRIPTION:
${input.businessDescription}

GOAL:
${input.aiPrompt}

CTA:
${input.ctaText || 'Get Started'}

LOGO URL:
{{LOGO_URL}}

PRIMARY COLOR:
${input.primaryColor || '#7c3aed'}

SECONDARY COLOR:
${input.secondaryColor || '#6366f1'}

MANDATORY SECTIONS:
1. Header with Logo
2. Hero
3. Lead Form
4. Features
5. Benefits
6. Testimonials
7. Stats
8. FAQ
9. CTA Banner
10. Footer

IMPORTANT:
- Form must be visible.
- Use real content.
- Use modern premium layout.
- Use unique layout.
- Complete FULL page.
- Make page feel ultra premium.
- Add premium cards.
- Add gradient backgrounds.
- Add hover animations.
- Add glassmorphism.
- Add deep scroll sections.
`;
>>>>>>> b6865f31404e3cb3ef6c418ad20bb52997091034
};

/**
 * =========================================
 * COST CALCULATOR
 * =========================================
 */
const calculateCost = (model, inputTokens, outputTokens) => {
<<<<<<< HEAD
  const pricing = {
    'claude-3-5-sonnet': { input: 0.000003, output: 0.000015 },
    'claude-3-5-haiku': { input: 0.000001, output: 0.000005 },
    'claude-3-haiku': { input: 0.00000025, output: 0.00000125 },
    'gpt-4o-mini': { input: 0.00000015, output: 0.0000006 },
    'gpt-4o': { input: 0.000005, output: 0.000015 },
    'default': { input: 0.000003, output: 0.000015 }
=======

  const pricing = {
    'claude-sonnet': {
      input: 0.000003,
      output: 0.000015
    },

    'claude-haiku': {
      input: 0.00000025,
      output: 0.00000125
    },

    default: {
      input: 0.000003,
      output: 0.000015
    }
>>>>>>> b6865f31404e3cb3ef6c418ad20bb52997091034
  };

  const modelKey =
    Object.keys(pricing).find(key =>
      model.toLowerCase().includes(key)
    ) || 'default';

  const price = pricing[modelKey];

  return (
    (inputTokens * price.input) +
    (outputTokens * price.output)
  );
};

/**
 * =========================================
 * CLEAN HTML
 * =========================================
 */
<<<<<<< HEAD
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

/**
 * GrapesJS Editor Chat — Returns structured JSON for element modification
 */
const editorChatModify = async ({ elementTag, elementHtml, elementCss, instruction }) => {
  const systemPrompt = `You are a web design AI inside a GrapesJS editor. The user gives an instruction in Hindi or English to modify a specific HTML element.

Return ONLY a valid JSON object, no markdown, no explanation:
{
  "action": "style" | "text" | "html" | "both",
  "css": { "camelCaseProp": "value" },
  "text": "new text content",
  "html": "new full HTML",
  "summary": "brief English description of change"
}

Hindi: lal=red, nila=blue, hara=green, kala=black, safed=white, peela=yellow, baingani=purple, gulabi=pink, bada/bado=larger font, chota=smaller, gol=border-radius, center=center align, bold/mota=font-weight bold, background/peechha=background-color.`;

  const userPrompt = `Element: <${elementTag}>
HTML: ${elementHtml.slice(0, 1500)}
CSS: ${elementCss}
Instruction: ${instruction}`;

  const result = await callAI(userPrompt, '', systemPrompt);
  const rawText = result.fullHtml || '{}';

  // Strip any markdown fences
  const clean = rawText.replace(/^```(?:json)?\n?/i, '').replace(/\n?```\s*$/i, '').trim();

  try {
    const jsonMatch = clean.match(/\{[\s\S]*\}/);
    return JSON.parse(jsonMatch ? jsonMatch[0] : clean);
  } catch {
    return { action: 'html', html: rawText, summary: 'AI applied changes' };
  }
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
=======
const cleanHTML = (raw) => {

  if (!raw) return '';

  const regex =
    /```(?:html)?\s*([\s\S]*?)(?:```|$)/gi;

  const matches = [];

  let match;

  while ((match = regex.exec(raw)) !== null) {

    if (match[1]) {
      matches.push(match[1].trim());
    }
  }

  if (matches.length > 0) {
    return matches.join('\n');
  }

  return raw
    .replace(/```html/gi, '')
    .replace(/```/g, '')
    .trim();
};

/**
 * =========================================
 * PROCESS RESULT
 * =========================================
 */
const processResult = (raw, logoUrl) => {

  let clean = cleanHTML(raw);

  const finalLogo =
    logoUrl && logoUrl.trim() !== ''
      ? logoUrl
      : 'https://placehold.co/200x60?text=LOGO';

  clean = clean.replace(
    /\{\{LOGO_URL\}\}/gi,
    finalLogo
  );

  clean = clean.replace(
    /\{\{logoUrl\}\}/gi,
    finalLogo
  );

  const titleMatch = clean.match(
    /<title>(.*?)<\/title>/i
  );

  const title =
    titleMatch
      ? titleMatch[1]
      : 'Landing Page';

  return {

    fullHtml: clean,

    fullCss: '',

    fullJs: '',

    seo: {
      title
    }
  };
};

/**
 * =========================================
 * CLAUDE AI CALL
 * =========================================
 */
const callAI = async (
  userPrompt,
  logoUrl = '',
  systemPrompt = ''
) => {

  const anthropicKey =
    process.env.ANTHROPIC_API_KEY;

  if (!anthropicKey) {

    throw new Error(
      'ANTHROPIC_API_KEY missing'
    );
  }

  const anthropic = new Anthropic({
    apiKey: anthropicKey
  });

  let lastError = null;

  for (const model of CLAUDE_MODEL_CANDIDATES) {

    try {

      logger.info(
        `[AI] Attempting Claude model: ${model}`
      );

      const response =
        await anthropic.messages.create({

          model,

          max_tokens: 20000,

          temperature: 1,

          system: systemPrompt,

          messages: [
            {
              role: 'user',
              content: userPrompt
            }
          ]
        });

      const rawText =
        response.content[0].text;

      const usage =
        response.usage;

      const result =
        processResult(
          rawText,
          logoUrl
        );

      return {

        ...result,

        aiUsage: {

          promptTokens:
            usage.input_tokens,

          completionTokens:
            usage.output_tokens,

          totalTokens:
            usage.input_tokens +
            usage.output_tokens,

          cost: calculateCost(
            model,
            usage.input_tokens,
            usage.output_tokens
          ),

          model
        }
      };

    } catch (err) {

      lastError = err;

      logger.error(
        `[AI] Claude failed (${model}): ${err.message}`
      );
    }
  }

  throw new Error(
    `Claude generation failed: ${lastError?.message}`
  );
>>>>>>> b6865f31404e3cb3ef6c418ad20bb52997091034
};

/**
 * =========================================
 * GENERATE LANDING PAGE
 * =========================================
 */
<<<<<<< HEAD
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
=======
const generateLandingPageContent =
  async (input) => {

    const uniqueSeed = `
${input.businessName}
-${input.industry}
-${Date.now()}
-${Math.random()
        .toString(36)
        .substring(2, 8)}
`;

    const systemPrompt =
      buildSystemPrompt(uniqueSeed);

    const userPrompt =
      buildUserPrompt(input);

    return await callAI(
      userPrompt,
      input.logoUrl,
      systemPrompt
    );
  };

/**
 * =========================================
 * IMPROVE SECTION
 * =========================================
 */
const improveSectionContent =
  async ({
    sectionType,
    currentContent,
    aiPrompt
  }) => {
>>>>>>> b6865f31404e3cb3ef6c418ad20bb52997091034

const prompt = `
Improve this section.

TYPE:
${sectionType}

CURRENT CONTENT:
${JSON.stringify(currentContent)}

INSTRUCTION:
${aiPrompt}
`;

return await callAI(prompt);
  };

/**
 * =========================================
 * GENERATE DESCRIPTION
 * =========================================
 */
const generateDescriptionSuggestion =
  async ({
    pageName,
    industry,
    projectDesc,
    currentPrompt
  }) => {

    const prompt = `
Generate a premium landing page description.

PAGE:
${pageName}

INDUSTRY:
${industry}

DESCRIPTION:
${projectDesc}

PROMPT:
${currentPrompt}

Generate highly premium,
conversion-focused copy.
`;

    const result =
      await callAI(prompt);

    return {
      suggestion:
        result.fullHtml || ''
    };
  };

/**
 * =========================================
 * PROJECT SUGGESTIONS
 * =========================================
 */
const generateProjectSuggestions =
  async ({
    projectName,
    industry,
    projectDescription
  }) => {

    const prompt = `
Generate 6 premium landing page ideas.

PROJECT:
${projectName}

INDUSTRY:
${industry}

DESCRIPTION:
${projectDescription}

Return ONLY JSON array.
`;

    const result =
      await callAI(prompt);

    try {

      return JSON.parse(
        result.fullHtml
      );

    } catch {

      return [];
    }
  };

/**
 * =========================================
 * STRATEGIC STRUCTURE
 * =========================================
 */
const generateStrategicStructure =
  async (input) => {

    const prompt = `
Generate a strategic landing page structure.

BUSINESS:
${input.businessName}

INDUSTRY:
${input.industry}

DESCRIPTION:
${input.businessDescription}

Return JSON only.
`;

    const result =
      await callAI(prompt);

    try {

      return JSON.parse(
        result.fullHtml
      );

    } catch {

      return {
        sections: []
      };
    }
  };

/**
 * =========================================
 * OPTIMIZE STRUCTURE
 * =========================================
 */
const optimizeStrategicStructure =
  async ({
    projectData,
    scrapedData,
    existingPage
  }) => {

    const prompt = `
Optimize this landing page.

PROJECT:
${JSON.stringify(projectData)}

SCRAPED:
${JSON.stringify(scrapedData)}

EXISTING:
${JSON.stringify(existingPage)}

Return JSON only.
`;

    const result =
      await callAI(prompt);

    try {

      return JSON.parse(
        result.fullHtml
      );

    } catch {

      return {
        sections: []
      };
    }
  };

/**
 * =========================================
 * EDITOR CHAT MODIFY
 * =========================================
 */
const editorChatModify =
  async ({
    elementTag,
    elementHtml,
    instruction
  }) => {

    const prompt = `
Modify this HTML element.

TAG:
${elementTag}

HTML:
${elementHtml}

INSTRUCTION:
${instruction}

Return JSON only.
`;

    const result =
      await callAI(prompt);

    try {

      return JSON.parse(
        result.fullHtml
      );

    } catch {

      return {
        action: 'html',
        html: result.fullHtml
      };
    }
  };

/**
 * =========================================
 * EXPORTS
 * =========================================
 */
module.exports = {

  generateLandingPageContent,

  improveSectionContent,
<<<<<<< HEAD
  editorChatModify,
=======

>>>>>>> b6865f31404e3cb3ef6c418ad20bb52997091034
  generateDescriptionSuggestion,

  generateProjectSuggestions,

  generateStrategicStructure,

  optimizeStrategicStructure,

  editorChatModify
};