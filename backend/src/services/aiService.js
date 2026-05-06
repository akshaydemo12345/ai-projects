'use strict';

const Anthropic = require('@anthropic-ai/sdk');
const logger = require('../utils/logger');

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
  return `Act as a world-class UI/UX Designer. Goal: Generate a unique, premium, high-converting landing page.
DESIGN: 
- No navbar/nav links. Logo only: <img src="{{LOGO_URL}}" class="h-8 w-auto">.
- Use scraped images if provided, else 'https://picsum.photos/seed/design/1200/800'.
- BG Images: inline style="background-image: url('...').
- High-impact typography (H1: text-6xl). Use backdrop-blur-md for floating UI.
- CRITICAL: Use [var(--primary)] and [var(--secondary)] for ALL brand colors. No HEX.
OUTPUT:
- SINGLE \`\`\`html block only.
- 5+ distinct sections (Hero, Form, Features, Social Proof, FAQ, Footer).
- MANDATORY: Visible lead form in Hero or Section 2.
- Max 2000 tokens. Be concise. Minimal Tailwind classes. No placeholders.`;
};

/**
 * Build SYSTEM prompt for Smart Template Enrichment (Content Injector)
 */
const buildTemplateSystemPrompt = () => {
  return `
Act as a World-Class Creative UI/UX Designer & Senior Copywriter.
Your task is to take the provided HTML template as a foundation and EVOLVE it into a unique, high-end masterpiece tailored to the user's vision.

CREATIVE FREEDOM:
1. You MAY enhance the layout, rearrange sections, and add new creative elements to improve the UI/UX.
2. You SHOULD improve the typography, spacing, and visual hierarchy to make it feel even more premium.
3. Keep the premium design system (Tailwind classes, glassmorphism, gradients) but make it unique.
4. Replace placeholder text with persuasive, high-converting copy.
5. Update <img> src attributes using high-quality Unsplash keywords: 'https://images.unsplash.com/photo-[RANDOM_ID]?auto=format&fit=crop&q=80&w=1200&[KEYWORD]'.
   (Note: Use descriptive keywords like 'luxury-travel', 'modern-office', 'premium-healthcare' to ensure high-end photography).

CRITICAL REQUIREMENTS:
- Use [var(--primary)] and [var(--secondary)] for ALL brand colors. No hardcoded HEX.
- Output a complete, valid HTML document with all necessary styles.
- Return the FULL updated HTML in a single \`\`\`html block. No explanation.
`;
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

  const finalSystemPrompt = systemPrompt
    .replace(/\[PRIMARY_HEX\]/g, primaryHex)
    .replace(/\[SECONDARY_HEX\]/g, secondaryHex);

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
        max_tokens: 4000,
        temperature: 0.7
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
          max_tokens: 4000,
          temperature: 0.7,
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
  // 1. SKIP separate strategy call for speed!
  // 2. Build the Persona-based System Prompt
  const systemPrompt = input.templateHtml ? buildTemplateSystemPrompt() : buildSystemPrompt();

  // Extract scrapedImages from scrapedData if available
  const scrapedImages = input.scrapedData?.images || [];

  // 3. Build a detailed user prompt that combines identity and goal
  let userPrompt = `
${buildUserPrompt(input)}

# SPEED OPTIMIZATION:
Generate this page FAST. Do not over-elaborate.

# MANDATORY LAYOUT SECTIONS (HIGH-CONVERTING LANDING PAGE):
1. Hero Section with dynamic branding, strong headline, and clear Call to Action.
2. Lead Generation Form with industry-specific fields - MUST BE VISIBLE AND FUNCTIONAL. This is NON-NEGOTIABLE.
3. Industry Context (Benefits, Features, and Value Propositions).
4. Social Proof / Reviews / Testimonials.
5. Trust Building Section (stats, achievements, certifications, trust badges).
6. FAQs Section addressing common objections.
7. Simple Footer with contact information.

# CORE REQUIREMENTS:
- Generate a complete, high-converting landing page.
- Include strong hero section with compelling headline.
- Include CTA in strategic positions.
- Include industry-specific form with relevant fields.
- Include meaningful, benefit-driven content throughout.
- Include industry-relevant images (real estate: homes, healthcare: doctors, etc.).
- Include relevant video suggestions where useful (testimonials, demos, explainers).
- Include testimonials section with realistic customer quotes.
- Include FAQs section addressing common objections.
- Include trust-building sections (badges, stats, achievements).
- Include SEO-friendly headings with proper hierarchy (H1, H2, H3).
- Make layout depend on industry for optimal user experience.
- Form position should depend on business type (hero side, sticky, bottom, popup).
- Content should be persuasive and conversion-focused.
- Use modern landing page structure with alternating backgrounds.
- Vary section designs (bento, grid, list, split, etc.) for visual interest.
`;

  // 4. Handle Template Enrichment if applicable
  if (input.templateHtml) {
    userPrompt = `
    # CRITICAL TASK: SMART TEMPLATE CONTENT REPLACEMENT
    ${input.templateHtml}
    
    USER'S VISION: "${input.aiPrompt}"
    `;
  }

  // 5. Handle Vision / Image-to-Design
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