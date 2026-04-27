'use strict';

const Anthropic = require('@anthropic-ai/sdk');
const logger = require('../utils/logger');

const CLAUDE_MODEL_CANDIDATES = [
  'claude-3-haiku-20240307', // Extremely cheap and fast
  'claude-3-5-haiku-20241022',
  'claude-3-5-sonnet-20241022',
  process.env.ANTHROPIC_MODEL,
].filter(Boolean);

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
Act as a Precision Content Engineer.
Your ONLY task is to take the provided HTML template and replace its text content and images based on the user's business context.

CRITICAL RULES:
1. YOU MUST NOT ALTER THE HTML STRUCTURE, CLASSES, OR IDS. 
2. YOU MUST NOT ADD OR REMOVE ANY SECTIONS.
3. You are a content injector, not a designer. Maintain the exact layout provided.
4. Replace placeholder text with high-quality, conversion-focused copy.
5. Update <img> src attributes using 'https://picsum.photos/seed/[KEYWORD]/1200/800'.
6. If the user asks for specific form fields, you MAY modify the <input> tags inside the existing <form>, but DO NOT change the form's layout or container.
7. Return the FULL updated HTML in a single \`\`\`html block. No explanation.
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

# IMAGES (SCRAPED):
${scrapedImages.map((img, i) => `${i + 1}. ${img.url} (${img.type})`).join('\n')}

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
  // Approximate pricing for Claude models
  const pricing = {
    'claude-3-5-sonnet': { input: 0.000003, output: 0.000015 },
    'claude-3-haiku': { input: 0.00000025, output: 0.00000125 },
    'claude-3-opus': { input: 0.000015, output: 0.000075 },
    'default': { input: 0.000003, output: 0.000015 } // Default to Sonnet pricing
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

  if (!anthropicKey) {
    logger.error('Anthropic API key is missing');
    throw new Error('ANTHROPIC_API_KEY is not configured in .env');
  }

  // Inject colors into system prompt
  const primaryHex = userPrompt.match(/- PRIMARY COLOR: (#[0-9a-fA-F]{3,6})/)?.[1] || '#7c3aed';
  const secondaryHex = userPrompt.match(/- SECONDARY COLOR: (#[0-9a-fA-F]{3,6})/)?.[1] || '#6366f1';

  const finalSystemPrompt = systemPrompt
    .replace(/\[PRIMARY_HEX\]/g, primaryHex)
    .replace(/\[SECONDARY_HEX\]/g, secondaryHex);

  const anthropic = new Anthropic({ apiKey: anthropicKey });
  let lastError = null;

  for (const model of CLAUDE_MODEL_CANDIDATES) {
    try {
      logger.info(`[AI] Attempting Claude model: ${model}`);

      // Handle both string prompt and structured messages (for Vision)
      const messageContent = typeof userPrompt === 'string'
        ? userPrompt
        : userPrompt;

      const response = await anthropic.messages.create({
        model,
        max_tokens: 1200, // Strictly capped to 1200 tokens to minimize costs
        temperature: 0.7,
        system: finalSystemPrompt,
        messages: Array.isArray(messageContent) ? messageContent : [{ role: 'user', content: messageContent }],
      });

      const rawText = response.content[0].text;
      const usage = response.usage;

      logger.info(`[AI] Raw response received. Length: ${rawText.length} characters. Usage: ${JSON.stringify(usage)}`);

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
      const msg = String(err.message || '');
      const isModelNotFound = msg.includes('not_found_error') || msg.includes('model:');
      if (!isModelNotFound) break;
    }
  }

  throw new Error(`Claude generation failed: ${lastError?.message || 'Unknown Claude error'}`);
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
    // Case 1: Empty input - generate full landing page brief from scratch
    prompt = `
      You are an expert prompt engineer for an AI Landing Page Builder.
      Your task is to generate a detailed landing page description for a business in the "${industry}" industry.
      Page Name: "${pageName}"
      Project Context: ${projectDesc}

      The response should include:
      - business overview
      - target audience
      - key services
      - unique selling points
      - CTA goal
      - preferred tone
      - required sections (hero, services, testimonials, form, FAQ, contact)
      - suggested form fields (industry-specific)
      - image ideas
      - video ideas
      - trust building content
      - FAQ ideas

      Make the content suitable for generating a high-converting landing page.

      OUTPUT FORMAT:
      Generate a comprehensive landing page prompt that includes:
      - A clear opening statement starting with "Create a..." or "Design a..."
      - Target audience description
      - Required sections (hero section with CTA, services/features, testimonials, lead form, FAQ, contact section)
      - Specific form fields (name, phone, email, budget, etc. based on industry)
      - Trust badges and social proof elements
      - Design style recommendations
      - Call-to-action placement

      Make it 100-150 words, highly specific and conversion-focused.
      Return ONLY the raw string. No quotes.
    `;
  } else {
    // Case 2: User already typed something - expand and improve
    prompt = `
      Expand and improve this landing page idea into a complete landing page prompt.

      Include:
      - hero section
      - CTA
      - industry-specific form
      - testimonials
      - FAQs
      - trust badges
      - image ideas
      - video ideas
      - service sections
      - strong conversion-focused content

      User Input:
      ${currentPrompt}
      
      Additional Context:
      Page Name: "${pageName}"
      Industry: "${industry}"
      Project Description: ${projectDesc}

      OUTPUT FORMAT:
      Generate a comprehensive landing page prompt (150-250 words) that is ready to be used by an AI design engine.
      Return ONLY the raw string. No quotes.
    `;
  }

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const model = CLAUDE_MODEL_CANDIDATES[0];
  const response = await anthropic.messages.create({
    model,
    max_tokens: 500,
    messages: [{ role: 'user', content: prompt }],
  });

  const usage = response.usage;
  const suggestion = response.content[0].text.trim().replace(/^"|"$/g, '');

  return {
    suggestion,
    aiUsage: {
      promptTokens: usage.input_tokens,
      completionTokens: usage.output_tokens,
      totalTokens: usage.input_tokens + usage.output_tokens,
      cost: calculateCost(model, usage.input_tokens, usage.output_tokens),
      model: model
    }
  };
};

/**
 * Generate a strategic landing page structure (Expert CRO Strategist)
 */
const generateStrategicStructure = async (input) => {
  const { businessName, industry, businessDescription, services = [], websiteContent = '' } = input;

  const systemPrompt = `
You are a World-Class Creative UX Strategist, Conversion Scientist, and Senior Art Director.
Your task is NOT just to structure a page, but to INNOVATE and DIFFERENTIATE.

### CORE BEHAVIOR:
1. DESIGN THINKING: Analyze the audience's emotional state and intent.
2. CREATIVE DIFFERENTIATION: Avoid generic blocks. Suggest modern, high-end UI patterns used by Apple, Stripe, and high-end design agencies.
3. FORM INNOVATION: Move beyond basic forms. Suggest multi-step flows, conversational UI, or interactive cost calculators to reduce friction.
4. EMOTIONAL HERO: Design a hero section that isn't just a headline—it's a "hook" with a strong visual and emotional narrative.

### OUTPUT FORMAT (STRICT JSON):
{
  "industry_context": {
    "category": "Specific Industry",
    "target_audience_profile": "Psychographic analysis of the user",
    "color_mood": "Color palette suggestion based on industry psychology",
    "typography_style": "Font pairing style (e.g., Bold Serif + Clean Sans)",
    "overall_feel": "Minimal / Premium / Urgent / Friendly"
  },
  "page_strategy": {
    "primary_conversion_goal": "e.g., Immediate Phone Call / High-Value Lead Form",
    "strategic_hook": "The 'Big Idea' that makes this page different"
  },
  "sections": [
    {
      "name": "Section Name",
      "purpose": "Conversion reasoning",
      "content": {
        "headline": "High-impact headline",
        "subheadline": "Benefit-driven microcopy",
        "points": ["Unique USPs"]
      },
      "innovation_idea": "🔥 MANDATORY: One creative idea (e.g., interactive element, sticky reveal, unique scroll effect)",
      "ui_ux_suggestion": "🎨 Design guidance (split layouts, card depth, micro-interactions)",
      "cta": "Text for the call to action"
    }
  ],
  "form_innovation": {
    "type": "Multi-step / Conversational / Simple / Calculator",
    "placement": "Hero / Sticky Side / Bottom",
    "fields": ["Necessary fields"],
    "interaction_ux": "How the user interacts (e.g. progress bar, inline validation)"
  },
  "conversion_notes": ["Why this layout will beat a generic template"],
  "design_directives": ["Specific visual rules to follow for premium quality"]
}
`;

  const userPrompt = `
INPUT DATA:
- Industry: ${industry}
- Business Name: ${businessName}
- Services: ${services.join(', ')}
- Description: ${businessDescription}
- Website/Context: ${websiteContent.substring(0, 5000)}

Think before generating. Adapt based on the industry automatically. Focus on conversions.
Generate ONLY the JSON object.
`;

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  let messages = [
    { role: 'user', content: systemPrompt + '\n\n' + userPrompt }
  ];

  if (input.figmaImage) {
    const imageMatch = input.figmaImage.match(/^data:(image\/[a-z]+);base64,(.+)$/);
    if (imageMatch) {
      messages = [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: imageMatch[1],
                data: imageMatch[2]
              }
            },
            {
              type: 'text',
              text: `${systemPrompt}\n\n${userPrompt}\n\nIMPORTANT: Use the provided design image as the master reference for the sections and layout in the JSON response.`
            }
          ]
        }
      ];
    }
  }

  const model = CLAUDE_MODEL_CANDIDATES[0];

  const response = await anthropic.messages.create({
    model,
    max_tokens: 1200,
    messages: messages,
  });

  const usage = response.usage;
  const aiUsage = {
    promptTokens: usage.input_tokens,
    completionTokens: usage.output_tokens,
    totalTokens: usage.input_tokens + usage.output_tokens,
    cost: calculateCost(model, usage.input_tokens, usage.output_tokens),
    model: model
  };

  try {
    let text = response.content[0].text;
    // Remove markdown code blocks if present
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    // Try to parse as JSON
    try {
      const plan = JSON.parse(text);
      return { plan, aiUsage };
    } catch (parseErr) {
      // Fallback: try to extract JSON from the text
      logger.warn('Initial JSON parse failed, attempting extraction:', parseErr.message);
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const plan = JSON.parse(jsonMatch[0]);
          return { plan, aiUsage };
        } catch (extractErr) {
          logger.error('JSON extraction also failed:', extractErr.message);
          throw new Error('Strategic Plan Generation Failed');
        }
      }
      throw new Error('Strategic Plan Generation Failed');
    }
  } catch (err) {
    logger.error('Failed to parse CRO strategy JSON:', err.message);
    throw new Error('Strategic Plan Generation Failed');
  }
};

/**
 * AI Landing Page Optimization Engine
 * Fixes, improves, and upgrades existing landing pages using real data.
 */
const optimizeStrategicStructure = async ({ projectData, scrapedData, existingPage }) => {
  const systemPrompt = `
You are a World-Class Landing Page Optimization Engine and Senior CRO Architect.
Your job is NOT to generate a basic page, but to FIX, IMPROVE, and UPGRADE an existing one using real-world data.

### CORE OBJECTIVES:
1. SMART IMAGE MAPPING: Analyze scrapedData images (banners, listings, products) and map them intelligently to hero, services, or gallery sections.
2. INDUSTRY-SPECIFIC LOGIC: 
   - Real Estate: Property search UI, buy/rent/sell flags, city-based cards.
   - SaaS: Demo CTAs, feature grids, integration trust-badges.
   - Service: Focus on high-visibility trust scores and lead-capture forms.
3. FORM OPTIMIZATION: Decide the best position and type of form based on friction reduction.
4. INNOVATION LAYER: Every section must have one creative improvement (interactive UI, sticky triggers, etc.)

### OUTPUT FORMAT (STRICT JSON):
{
  "improvements": {
    "structure_changes": ["Briefly describe what was moved/changed"],
    "removed_sections": ["What was redundant"],
    "added_sections": ["What new CRO elements were added"]
  },
  "images": {
    "hero": "Scraped URL for hero",
    "mapped": {
      "section_name": "Mapped image URL"
    }
  },
  "sections": [
    {
      "name": "Section Name",
      "content": "Updated high-converting content object",
      "innovation": "🔥 Mandatory innovation details",
      "ui_suggestion": "🎨 Premium UX/UI layout guidance"
    }
  ],
  "forms": [
    {
      "position": "hero | mid | bottom | sticky",
      "type": "search | lead | detailed",
      "fields": ["Required fields"],
      "cta": "Conversion-focused text"
    }
  ],
  "conversion_score_estimate": "Predicted improvement percentage",
  "notes": ["Expert rationale on the changes"]
}
`;

  const userPrompt = `
# INPUT DATA:
- Project Context: ${JSON.stringify(projectData)}
- Scraped Content: ${JSON.stringify(scrapedData)}
- Existing Page Blueprint: ${JSON.stringify(existingPage)}

# TASK:
Transform this existing structure into a high-converting masterpiece. Use the real scraped images intentionally. If an image looks like a banner, use it for the Hero. If they are product/property photos, use them in cards.
`;

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const model = CLAUDE_MODEL_CANDIDATES[0];

  const response = await anthropic.messages.create({
    model,
    max_tokens: 1200,
    temperature: 0.1,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
  });

  const usage = response.usage;
  const aiUsage = {
    promptTokens: usage.input_tokens,
    completionTokens: usage.output_tokens,
    totalTokens: usage.input_tokens + usage.output_tokens,
    cost: calculateCost(model, usage.input_tokens, usage.output_tokens),
    model: model
  };

  try {
    const text = response.content[0].text;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const plan = JSON.parse(jsonMatch ? jsonMatch[0] : text);
    return { plan, aiUsage };
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