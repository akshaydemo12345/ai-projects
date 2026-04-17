'use strict';

const Anthropic = require('@anthropic-ai/sdk');
const OpenAI = require('openai');
const logger = require('../utils/logger');

/**
 * Build SYSTEM prompt (Claude-Level Master UI Designer)
 */
const buildSystemPrompt = () => {
  return `
Act as a world-class 20+ years experienced UI/UX design director, conversion strategist, frontend architect, and full-stack developer specializing in award-winning landing pages.

Your task is to generate a visually stunning, highly modern, conversion-focused landing page based on a provided STRATEGIC INNOVATION PLAN. You must NOT use a generic structure; instead, execute the "Innovation Ideas" and "Big Idea" precisely while applying premium UI aesthetics.

CRITICAL DESIGN RULES:
- MUST include a modern top navigation header with the brand LOGO: <img src="{{LOGO_URL}}" alt="Brand Logo" class="h-8 w-auto">
- MUST use high-quality images matching the industry context from https://picsum.photos/seed/[ANY_UNIQUE_WORD]/1200/800.
- EXTREMELY CRITICAL: DO NOT use 'unsplash.com' or 'source.unsplash.com' URLs ever!
- BACKGROUND IMAGES: Use INLINE STYLES: style="background-image: url('...'); background-size: cover; background-position: center;"
- SEMANTIC REFINEMENT: Use high-level HTML5 semantic tags (<header>, <main>, <section>, <footer>) with perfect accessibility.
- CLAUDE-OPTIMIZED DESIGN: Leverage Claude's ability to create sophisticated layouts like Bento Grids, layered card stacks, and high-contrast professional color blocking.
- DEPTH & MOTION: Use complex Tailwind utility combinations for depth (drop-shadow-2xl, backdrop-blur-md) and subtle hover-reveal states.
- STRATEGIC EXECUTION: Transform the "Innovation Idea" provided for each section into a unique, functional UI component.
- VISUAL STORYTELLING: Use advanced layouts (split-screens, card stacks, bento-grids, or reveal-on-scroll) to differentiate from templates.
- FORM INNOVATION: Implement the suggested "Smart Form Strategy" (Multi-step, conversational, etc.).
- AESTHETICS: Modern rounded corners (28px+), deep shadows, organic waves, or sharp professional geometries depending on the mood.
- TYPOGRAPHY: Set the typography according to the suggested mood.
- RESPONSIVENESS: Ensure innovation translates perfectly to mobile (e.g., sticky buttons, simplified multi-step forms).

MANDATORY EXECUTION:
1. Translate the "Strategic Conversion Plan" segments into high-fidelity HTML/CSS components.
2. Ensure sections feel connected through consistent branding and design "rhythm".
3. Add reveal animations and micro-interactions for a premium feel.
4. Output FULL complete HTML document code enclosed in \`\`\`html block.
`;
};

/**
 * Build USER prompt (Business Context + Branding)
 */
const buildUserPrompt = ({
  businessName,
  industry,
  businessDescription,
  targetAudience,
  ctaText,
  aiPrompt,
  primaryColor,
  secondaryColor,
  logoUrl,
  services = [],
  keywords = [],
  noIndex = false,
  noFollow = false,
}) => {
  const robots = [noIndex ? 'noindex' : '', noFollow ? 'nofollow' : ''].filter(Boolean).join(',');
  
  // Extract potential trust signals (numbers, awards, etc.) from description
  const trustSignals = businessDescription ? (businessDescription.match(/(\d+,?\d*\+?|\d+%\+?)/g) || []) : [];
  const topServices = services.slice(0, 6); // Focus on top 6 services

  return `
# BRAND IDENTITY:
- PRIMARY COLOR (Buttons/Accents): ${primaryColor || '#7c3aed'}
- SECONDARY COLOR: ${secondaryColor || '#6366f1'}
- LOGO: {{LOGO_URL}} (Use this tag exactly in the header)

# BUSINESS PROFILE:
- Brand Name: ${businessName}
- Industry: ${industry || 'Modern Business'}
- Value Proposition: ${businessDescription}
- Audience: ${targetAudience || 'Targeted Professionals'}
- Core Services: ${topServices.join(', ')}
${trustSignals.length > 0 ? `- KEY STATS/TRUST: ${trustSignals.join(', ')}` : ''}

# STRATEGIC GOAL:
"${aiPrompt || 'Create a world-class landing page focusing on lead generation and brand authority.'}"

# CONTENT GUIDELINES:
1. Headlines: Use power-words and conversion-focused copywriting.
2. Structure: 
   - Hero: Catchy headline incorporating "${businessName}". Subtitle should expand on the value prop.
   - Services: Detail blocks for ${topServices.slice(0, 4).join(', ')}.
   - Features: Explain HOW you help "${targetAudience}".
   - Social Proof: Use the industry context to create realistic testimonial names and high-authority trust badges.
3. Call to Action: Use "${ctaText || 'Get Started'}" as the primary command.

# IMMUTABLE RULES:
- Only use https://picsum.photos for images.
- Use {{LOGO_URL}} exactly in the header.
- Apply ${primaryColor} for primary buttons.
- Ensure the page feels unique and tailored to the "${industry}" niche.
`;
};

/**
 * Call AI models with fallback
 */
const callAI = async (userPrompt, logoUrl = '', systemPrompt = '') => {
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  if (!anthropicKey && !openaiKey) {
    logger.error('No API keys configured');
    throw new Error('API keys are not configured in .env');
  }

  // Inject colors into system prompt
  const primaryHex = userPrompt.match(/- PRIMARY COLOR: (#[0-9a-fA-F]{3,6})/)?.[1] || '#7c3aed';
  const secondaryHex = userPrompt.match(/- SECONDARY COLOR: (#[0-9a-fA-F]{3,6})/)?.[1] || '#6366f1';

  const finalSystemPrompt = systemPrompt
    .replace(/\[PRIMARY_HEX\]/g, primaryHex)
    .replace(/\[SECONDARY_HEX\]/g, secondaryHex);

  // --- Try Anthropic (Claude 3.5 Sonnet) First for Design Quality ---
  if (anthropicKey) {
    const anthropic = new Anthropic({ apiKey: anthropicKey });
    try {
      logger.info(`[AI] Attempting Newest Claude 3.5 Sonnet (2024-10-22) for premium design...`);
      const response = await anthropic.messages.create({
        model: process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-20241022',
        max_tokens: 8192,
        temperature: 0.1, // Lower temperature for more consistent, high-end code structure
        system: finalSystemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
      });
      return processResult(response.content[0].text, logoUrl);
    } catch (err) {
      logger.error(`[AI] Anthropic failed: ${err.message}`);
    }
  }

  // --- Try OpenAI Fallback ---
  if (openaiKey) {
    const openai = new OpenAI({ apiKey: openaiKey });
    try {
      logger.info(`[AI] Attempting OpenAI fallback...`);
      const response = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4o',
        messages: [
          { role: 'system', content: finalSystemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 4000,
      });
      return processResult(response.choices[0].message.content, logoUrl);
    } catch (err) {
      logger.error(`[AI] OpenAI failed: ${err.message}`);
    }
  }

  throw new Error('All AI providers failed. Check your API keys.');
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
  if (styleMatches) {
    css = styleMatches.map(s => s.replace(/<\/?style[^>]*>/gi, '')).join('\n');
  }

  return { fullHtml: clean, fullCss: css, fullJs: '', seo: { title } };
};

const cleanHTML = (raw) => {
  const codeBlockMatch = raw.match(/```html\s*([\s\S]*?)```/i) || raw.match(/```\s*([\s\S]*?)```/i);
  if (codeBlockMatch) return codeBlockMatch[1].trim();
  const htmlMatch = raw.match(/(<!DOCTYPE[\s\S]*?<\/html>)/i) || raw.match(/(<html[\s\S]*?<\/html>)/i);
  if (htmlMatch) return htmlMatch[1].trim();
  return raw.replace(/```html/gi, '').replace(/```/g, '').trim();
};

const generateLandingPageContent = async (input) => {
  // 1. Generate a Strategic Conversion Plan (CRO Analyst)
  logger.info(`[AI] Generating Strategic Plan for ${input.businessName}...`);
  const strategicPlan = await generateStrategicStructure(input);
  
  // 2. Build the Persona-based System Prompt
  const systemPrompt = buildSystemPrompt();
  
  // 3. Build a detailed User Prompt that incorporates the plan
  const userPrompt = `
${buildUserPrompt(input)}

# STRATEGIC INNOVATION PLAN (MANDATORY EXECUTION):
This blueprint was created by a Lead UX Strategist for ${strategicPlan.industry_context.category}.

## 1. DESIGN DIRECTION:
- Color Mood: ${strategicPlan.industry_context.color_mood}
- Typography Style: ${strategicPlan.industry_context.typography_style}
- Overall Feel: ${strategicPlan.industry_context.overall_feel}
- Audience Profile: ${strategicPlan.industry_context.target_audience_profile}
- The "Big Idea" (Hook): ${strategicPlan.page_strategy.strategic_hook}

## 2. INNOVATIVE SECTIONS:
${strategicPlan.sections.map(s => `
### ${s.name}
- Strategic Purpose: ${s.purpose}
- Content: ${s.content.headline} | ${s.content.subheadline}
- Innovation Idea (MUST IMPLEMENT): ${s.innovation_idea}
- UI/UX Directive: ${s.ui_ux_suggestion}
`).join('\n')}

## 3. SMART FORM STRATEGY:
- Innovation: ${strategicPlan.form_innovation.type}
- UX Interaction: ${strategicPlan.form_innovation.interaction_ux}
- Placement: ${strategicPlan.form_innovation.placement}
- Essential Fields: ${strategicPlan.form_innovation.fields.join(', ')}

# FINAL INSTRUCTION:
Do NOT follow a generic template. Execute the INNOVATION ideas provided for each section. Use the Color Mood and Typography directives to make this page feel premium and visually distinct.
`;

  return await callAI(userPrompt, input.logoUrl, systemPrompt);
};

const improveSectionContent = async ({ sectionType, currentContent, aiPrompt }) => {
  const prompt = `Improve this ${sectionType}: ${JSON.stringify(currentContent)}. Instruction: ${aiPrompt}`;
  return await callAI(prompt);
};

const generateDescriptionSuggestion = async ({ pageName, industry, projectDesc }) => {
  const prompt = `
    You are an expert prompt engineer for an AI Landing Page Builder.
    Your task is to generate an EXTRA DEEP and detailed landing page description for a page named "${pageName}" in the "${industry}" industry.
    Project Context: ${projectDesc}.

    The description MUST include the following important details to help the AI generate a world-class design:
    1. TARGET AUDIENCE: Who is this for? (e.g. Busy homeowners, high-end investors)
    2. PRIMARY HOOK: What is the main emotional or logical trigger?
    3. KEY SECTIONS: Explicitly mention sections like:
       - Visually strong Hero with a specific background idea.
       - Trust building section (testimonials, partners, certifications).
       - Detailed services or product showcase.
       - Direct-action Lead Form or specialized interactive component.
       - FAQ or Process section.
    4. DESIGN FEEL: Suggest a specific aesthetic (e.g. "Clean, minimal white-space with high-end typography and subtle glassmorphism").

    OUTPUT FORMAT: 
    Generate a 30-60 word prompt that starts with "Create a..." or "Design a...". 
    Make it highly specific and conversion-focused.
    Return ONLY the raw string. No quotes.
  `;
  
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    max_tokens: 400,
  });
  
  return response.choices[0].message.content.trim().replace(/^"|"$/g, '');
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

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    temperature: 0.7,
    response_format: { type: 'json_object' }
  });

  try {
    return JSON.parse(response.choices[0].message.content);
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
  const response = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 4000,
    temperature: 0.1,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
  });

  try {
    const text = response.content[0].text;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    return JSON.parse(jsonMatch ? jsonMatch[0] : text);
  } catch (err) {
    logger.error('Optimization Engine JSON Error:', err.message);
    throw new Error('Optimization Engine Failed');
  }
};

module.exports = { 
  generateLandingPageContent, 
  improveSectionContent, 
  generateDescriptionSuggestion, 
  generateStrategicStructure,
  optimizeStrategicStructure
};