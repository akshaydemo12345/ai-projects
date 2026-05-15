'use strict';

const Anthropic = require('@anthropic-ai/sdk');
const logger = require('../utils/logger');
const cheerio = require('cheerio');
const OpenAI = require('openai');

const CLAUDE_MODEL_CANDIDATES = [
  'claude-sonnet-4-20250514',
  'claude-3-5-sonnet-latest',
  'claude-3-5-haiku-latest'
];

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

CRITICAL DESIGN RULES:
- NEVER repeat layouts from previous generations.
- Every generation MUST feel visually different.
- Use Stripe, Linear, Apple, Framer, Vercel inspired design quality.
- Use cinematic spacing.
- Use layered gradients.
- Use glassmorphism.
- Use floating cards.
- Use asymmetrical layouts.
- Use alternating dark/light sections.
- Use premium typography.
- Use deep-scroll storytelling sections.
- Use modern SaaS visuals.
- Use Bento Grid layouts.
- Use Card Mosaic layouts.
- Use Timeline Flow layouts.
- Use editorial layouts.
- Add visual depth everywhere.
- Every section must feel premium.
- Hero section must feel award-winning.

MANDATORY:
- NO NAVBAR LINKS
- ONLY LOGO
- HERO SECTION REQUIRED
- LEAD FORM REQUIRED
- TESTIMONIALS REQUIRED
- FAQ REQUIRED
- FOOTER REQUIRED
- MINIMUM 10 SECTIONS
- FULL PAGE REQUIRED
- NEVER STOP EARLY

LOGO RULE:
Use:
<img src="{{LOGO_URL}}" alt="Logo" class="h-10 w-auto">

IMAGE RULE:
Use:
https://picsum.photos/seed/[keyword]/1200/800

COLORS:
ONLY USE:
var(--primary)
var(--secondary)

TYPOGRAPHY:
- H1 = text-6xl to text-7xl
- Large headings
- Premium whitespace
- Strong hierarchy

OUTPUT:
RETURN ONLY:
\`\`\`html
FULL HTML
\`\`\`

NO EXPLANATION.
`;
};

/**
 * =========================================
 * USER PROMPT
 * =========================================
 */
const buildUserPrompt = (input) => {
  return `
BUSINESS NAME:
${input.businessName}

INDUSTRY:
${input.industry}

BUSINESS DESCRIPTION:
${input.businessDescription}

GOAL:
${input.aiPrompt}

CTA:
${input.ctaText || 'Get Started'}

PRIMARY COLOR:
${input.primaryColor || '#7c3aed'}

SECONDARY COLOR:
${input.secondaryColor || '#6366f1'}

LOGO:
{{LOGO_URL}}

MANDATORY SECTIONS:
1. Hero
2. Brand Banner
3. Lead Form
4. Features
5. Benefits
6. Process
7. Stats
8. Testimonials
9. FAQ
10. CTA
11. Footer

IMPORTANT:
- Use modern premium layouts.
- Use real conversion-focused copy.
- Use unique layouts.
- Form must be visible.
- Complete FULL page.
`;
};

/**
 * =========================================
 * COST CALCULATOR
 * =========================================
 */
const calculateCost = (model, inputTokens, outputTokens) => {
  const pricing = {
    'claude-3-5-sonnet': { input: 0.000003, output: 0.000015 },
    'claude-3-5-haiku': { input: 0.000001, output: 0.000005 },
    'claude-3-haiku': { input: 0.00000025, output: 0.00000125 },
    'claude-sonnet': { input: 0.000003, output: 0.000015 },
    'claude-haiku': { input: 0.00000025, output: 0.00000125 },
    'gpt-4o-mini': { input: 0.00000015, output: 0.0000006 },
    'gpt-4o': { input: 0.000005, output: 0.000015 },
    'default': { input: 0.000003, output: 0.000015 }
  };

  const modelKey = Object.keys(pricing).find(key =>
    model.toLowerCase().includes(key)
  ) || 'default';

  const price = pricing[modelKey];

  return (inputTokens * price.input) + (outputTokens * price.output);
};

/**
 * =========================================
 * CLEAN HTML
 * =========================================
 */
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

/**
 * =========================================
 * PROCESS RESULT
 * =========================================
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

/**
 * =========================================
 * AI CALL (OpenAI with Claude Fallback)
 * =========================================
 */
const callAI = async (userPrompt, logoUrl = '', systemPrompt = '') => {
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  if (!anthropicKey && !openaiKey) {
    logger.error('AI API keys are missing');
    throw new Error('Neither ANTHROPIC_API_KEY nor OPENAI_API_KEY is configured');
  }

  // Extract metadata if possible for dynamic system prompt replacement
  const primaryHex = typeof userPrompt === 'string' ? (userPrompt.match(/- PRIMARY COLOR: (#[0-9a-fA-F]{3,6})/)?.[1] || '#7c3aed') : '#7c3aed';
  const secondaryHex = typeof userPrompt === 'string' ? (userPrompt.match(/- SECONDARY COLOR: (#[0-9a-fA-F]{3,6})/)?.[1] || '#6366f1') : '#6366f1';
  const businessName = typeof userPrompt === 'string' ? (userPrompt.match(/- Name: ([\s\S]*?) \|/)?.[1] || 'design') : 'design';

  const finalSystemPrompt = systemPrompt
    .replace(/\[PRIMARY_HEX\]/g, primaryHex)
    .replace(/\[SECONDARY_HEX\]/g, secondaryHex)
    .replace(/{{BUSINESS_NAME_KEYWORD}}/g, businessName.toLowerCase().replace(/\s+/g, '-'));

  // 1. Try OpenAI first if available
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
 * =========================================
 * GENERATE LANDING PAGE
 * =========================================
 */
const generateLandingPageContent = async (input) => {
  const uniqueSeed = `
${input.businessName}
-${input.industry}
-${Date.now()}
-${Math.random().toString(36).substring(2, 8)}
`;

  const systemPrompt = buildSystemPrompt(uniqueSeed);

  let userPrompt = `
${buildUserPrompt(input)}

# INSTRUCTION:
Generate a world-class, premium landing page. 
${input.templateHtml ? 'Use the following HTML as DESIGN INSPIRATION/BASELINE, but EVOLVE it into a unique, custom-designed masterpiece. Do not feel restricted by its structure.' : ''}
${input.templateHtml ? `\n# BASELINE INSPIRATION:\n${input.templateHtml}\n` : ''}

# CORE REQUIREMENTS:
- Generate a complete, high-converting landing page with 10+ sections.
- Include strong hero section with compelling headline (massive typography).
- Include CTA in strategic positions.
- Include industry-specific form.
- Use bento grids, mesh gradients, and glassmorphism.
- Include testimonials, FAQs, and trust badges.
- Content should be persuasive and conversion-focused.
- Vary section designs for visual interest.
`;

  return await callAI(userPrompt, input.logoUrl, systemPrompt);
};

/**
 * =========================================
 * IMPROVE SECTION
 * =========================================
 */
const improveSectionContent = async ({ sectionType, currentContent, aiPrompt }) => {
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
 * EDITOR SYSTEM PROMPT
 * =========================================
 */
const EDITOR_SYSTEM_PROMPT = `
You are a Senior UI Developer. You modify GrapesJS elements based on instructions.
You MUST return a valid JSON object with the following structure:
{
  "action": "style" | "text" | "both" | "html",
  "css": { "camelCaseProperty": "value" },
  "text": "new text content",
  "html": "full new html if action is html",
  "summary": "short summary of what you did"
}

RULES:
- If changing color/spacing/size, use "action": "style" and provide "css".
- If changing text content, use "action": "text" and provide "text".
- Use "both" for both.
- Use "html" ONLY if you need to rewrite the entire structure.
- RETURN ONLY THE JSON OBJECT. NO MARKDOWN. NO EXPLANATION.
`;

/**
 * =========================================
 * EDITOR CHAT MODIFY
 * =========================================
 */
const editorChatModify = async ({
  elementTag,
  elementHtml,
  elementCss,
  instruction
}) => {
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  if (!anthropicKey) throw new Error('ANTHROPIC_API_KEY missing');

  const anthropic = new Anthropic({ apiKey: anthropicKey });

  const userPrompt = `
TAG: ${elementTag}
HTML: ${elementHtml}
CSS: ${elementCss}
INSTRUCTION: ${instruction}
`;

  let lastError = null;
  for (const model of CLAUDE_MODEL_CANDIDATES) {
    try {
      logger.info(`[AI-EDITOR] Attempting model: ${model}`);
      const response = await anthropic.messages.create({
        model,
        max_tokens: 4000,
        temperature: 0,
        system: EDITOR_SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userPrompt }]
      });

      const rawText = response.content[0].text;

      // Try to parse JSON directly or extract it if AI added markdown
      let jsonStr = rawText.trim();
      if (jsonStr.includes('```')) {
        const match = jsonStr.match(/```(?:json)?\s*([\s\S]*?)(?:```|$)/i);
        if (match && match[1]) jsonStr = match[1].trim();
      }

      try {
        const parsed = JSON.parse(jsonStr);
        return {
          ...parsed,
          aiUsage: {
            promptTokens: response.usage.input_tokens,
            completionTokens: response.usage.output_tokens,
            totalTokens: response.usage.input_tokens + response.usage.output_tokens,
            model
          }
        };
      } catch (parseErr) {
        logger.error('[AI-EDITOR] JSON Parse failed, returning raw as HTML fallback');
        return {
          action: 'html',
          html: rawText,
          summary: 'Applied raw AI response'
        };
      }
    } catch (err) {
      lastError = err;
      logger.error(`[AI-EDITOR] Model failed (${model}): ${err.message}`);
    }
  }

  throw new Error(`Editor AI failed: ${lastError?.message}`);
};

/**
 * =========================================
 * GENERATE DESCRIPTION
 * =========================================
 */
const generateDescriptionSuggestion = async ({
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

Generate highly premium, conversion-focused copy.
`;

  const result = await callAI(prompt);
  return {
    suggestion: result.fullHtml || ''
  };
};

/**
 * =========================================
 * PROJECT SUGGESTIONS
 * =========================================
 */
const generateProjectSuggestions = async ({
  projectName,
  industry,
  projectDescription,
  services,
  pageTitles
}) => {
  const prompt = `
Generate 6 premium landing page ideas.

PROJECT:
${projectName}

INDUSTRY:
${industry}

DESCRIPTION:
${projectDescription}
${services ? `SERVICES: ${services.join(', ')}` : ''}
${pageTitles ? `EXISTING PAGES: ${pageTitles.join(', ')}` : ''}

Return ONLY JSON array of objects with "title" and "description".
`;

  const result = await callAI(prompt);
  try {
    let text = result.fullHtml.trim();
    if (text.includes('```')) {
      const match = text.match(/```(?:json)?\s*([\s\S]*?)(?:```|$)/i);
      if (match) text = match[1].trim();
    }
    return JSON.parse(text);
  } catch (err) {
    logger.error('Failed to parse project suggestions:', err.message);
    return [];
  }
};

/**
 * =========================================
 * STRATEGIC STRUCTURE
 * =========================================
 */
const generateStrategicStructure = async (input) => {
  const prompt = `
Generate a strategic landing page structure.

BUSINESS:
${input.businessName}

INDUSTRY:
${input.industry}

DESCRIPTION:
${input.businessDescription}

Return JSON only with "plan" object containing "sections".
`;

  const result = await callAI(prompt);
  try {
    let text = result.fullHtml.trim();
    if (text.includes('```')) {
      const match = text.match(/```(?:json)?\s*([\s\S]*?)(?:```|$)/i);
      if (match) text = match[1].trim();
    }
    return {
      plan: JSON.parse(text),
      aiUsage: result.aiUsage
    };
  } catch (err) {
    logger.error('Failed to parse strategic structure:', err.message);
    return {
      plan: { sections: [] },
      aiUsage: result.aiUsage
    };
  }
};

/**
 * =========================================
 * OPTIMIZE STRUCTURE
 * =========================================
 */
const optimizeStrategicStructure = async ({
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

Return JSON only with "plan" object.
`;

  const result = await callAI(prompt);
  try {
    let text = result.fullHtml.trim();
    if (text.includes('```')) {
      const match = text.match(/```(?:json)?\s*([\s\S]*?)(?:```|$)/i);
      if (match) text = match[1].trim();
    }
    return {
      plan: JSON.parse(text),
      aiUsage: result.aiUsage
    };
  } catch (err) {
    logger.error('Failed to parse optimized structure:', err.message);
    return {
      plan: { sections: [] },
      aiUsage: result.aiUsage
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
  editorChatModify,
  generateDescriptionSuggestion,
  generateProjectSuggestions,
  generateStrategicStructure,
  optimizeStrategicStructure
};