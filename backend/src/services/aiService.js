'use strict';

const Anthropic = require('@anthropic-ai/sdk');
const logger = require('../utils/logger');

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
const calculateCost = (
  model,
  inputTokens,
  outputTokens
) => {

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
const processResult = (
  raw,
  logoUrl
) => {

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

  const titleMatch =
    clean.match(
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

  const anthropic =
    new Anthropic({
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

          max_tokens: 16000,

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
};

/**
 * =========================================
 * GENERATE LANDING PAGE
 * =========================================
 */
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
 * EXPORTS
 * =========================================
 */
module.exports = {

  generateLandingPageContent,

  improveSectionContent,

  generateDescriptionSuggestion,

  generateProjectSuggestions,

  generateStrategicStructure,

  optimizeStrategicStructure,

  editorChatModify
};