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
 * EDITOR CHAT MODIFY
 * =========================================
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
HTML: ${elementHtml?.slice(0, 1500)}
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

/**
 * =========================================
 * PROJECT SUGGESTIONS
 * =========================================
 */
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
    const parsed = JSON.parse(responseText);
    if (Array.isArray(parsed)) return parsed;
    const arrayMatch = responseText.match(/\[.*\]/s);
    if (arrayMatch) return JSON.parse(arrayMatch[0]);
  } catch (e) {
    // Fallback: split by newlines and clean up
    return responseText.split('\n')
      .map(line => line.replace(/^["'\d\.\s-]+/, '').replace(/["'\s]+$/, '').trim())
      .filter(line => line.length > 5)
      .slice(0, 6);
  }
  return [];
};

/**
 * =========================================
 * GENERATE DESCRIPTION
 * =========================================
 */
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
 * =========================================
 * STRATEGIC STRUCTURE
 * =========================================
 */
const generateStrategicStructure = async (input) => {
  const { businessName, industry, businessDescription, services = [] } = input;

  const systemPrompt = `Act as a World-Class UX Strategist. Output ONLY valid JSON for a landing page structure.`;
  const userPrompt = `Industry: ${industry}, Business: ${businessName}, Services: ${services.join(', ')}, Description: ${businessDescription}. Generate structure JSON.`;

  const result = await callAI(userPrompt, '', systemPrompt);

  try {
    let text = result.fullHtml || '';
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    return { plan: JSON.parse(jsonMatch ? jsonMatch[0] : text), aiUsage: result.aiUsage };
  } catch (err) {
    logger.error('Strategic Plan JSON Error:', err.message);
    throw new Error('Strategic Plan Generation Failed');
  }
};

/**
 * =========================================
 * OPTIMIZE STRUCTURE
 * =========================================
 */
const optimizeStrategicStructure = async ({ projectData, scrapedData, existingPage }) => {
  const systemPrompt = `You are a CRO Architect. Map images and optimize sections. Output ONLY JSON.`;
  const userPrompt = `Optimize this page: ${JSON.stringify(existingPage)} using ${JSON.stringify(projectData)}. Context: ${JSON.stringify(scrapedData)}`;

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