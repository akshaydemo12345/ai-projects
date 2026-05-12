'use strict';

const Anthropic = require('@anthropic-ai/sdk');
const logger = require('../utils/logger');

/**
 * =========================================
 * PREMIUM CLAUDE MODELS
 * =========================================
 */
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
};

/**
 * =========================================
 * COST CALCULATOR
 * =========================================
 */
const calculateCost = (model, inputTokens, outputTokens) => {

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

  generateDescriptionSuggestion,

  generateProjectSuggestions,

  generateStrategicStructure,

  optimizeStrategicStructure,

  editorChatModify
};