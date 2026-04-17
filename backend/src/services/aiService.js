'use strict';

const Anthropic = require('@anthropic-ai/sdk');
const logger = require('../utils/logger');

const CLAUDE_MODEL_CANDIDATES = [
  process.env.ANTHROPIC_MODEL,
  'claude-sonnet-4-6',
  'claude-sonnet-4-5-20250929',
  'claude-sonnet-4-20250514',
  'claude-haiku-4-5-20251001',
].filter(Boolean);

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
- BE EXTREMELY CONCISE TO MINIMIZE COST. Every section should be roughly 600-800 characters of high-impact code. 
- Avoid any redundant Tailwind classes or overly wordy descriptions.
- DO NOT split the page into multiple code blocks.

LENGTH + COMPLETENESS:
- Generate a full, deep-scroll landing page with ALL requested sections.
- For 15 sections, aim for a total output around 12,000 to 15,000 characters. 
- You MUST finish all sections within a 5000 token limit.
- NEVER use placeholders. Keep HTML semantic and clean.

PLANNING:
- Budget roughly 300 tokens per section to ensure you reach the Footer.

OUTPUT: Full complete HTML enclosed in a SINGLE \`\`\`html block. No explanation.
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
# BRAND IDENTITY (TRUTH):
- PRIMARY COLOR PREVIEW: ${primaryColor || '#d23f1b'}
- SECONDARY COLOR PREVIEW: ${secondaryColor || '#c7d186'}
- LOGO: ${logoUrl ? 'Provided ({{LOGO_URL}})' : 'Create a text-based agency logo'}

**CRITICAL RULE FOR COLORS**: 
You MUST NEVER use exact HEX codes (like bg-[#d23f1b]) or Tailwind base colors (like bg-blue-500) for brand elements.
You MUST ALWAYS use the dynamic CSS variables: \`[var(--primary)]\` and \`[var(--secondary)]\`.
Examples of ONLY ALLOWED syntax for brand colors:
- \`bg-[var(--primary)]\`
- \`text-[var(--primary)]\`
- \`border-[var(--secondary)]\`
- \`hover:bg-[var(--primary)]\`

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

# DIVERSITY + STRUCTURE INSTRUCTIONS:
- Treat this request as a fresh creative direction.
- You MUST provide a minimum of 8 visual sections if no specific list is provided.
- **ABSOLUTE MANDATE**: If the USER'S VISION (CUSTOM PROMPT) contains a numbered list, bullet points, or a sequence of sections (like Hero, FAQ, Pricing, etc.), you MUST treat this as a strict requirement. 
- You MUST generate EVERY SINGLE SECTION mentioned in the user's prompt. 
- DO NOT OMIT anything. If the user asks for 15 sections, you produce 15 high-quality sections.
- Every section must have a unique layout and high-fidelity copy.

# LEAD FORM INSTRUCTION:
- If a 'Lead Form' or 'Contact Form' is requested, include inputs: Name, Email, Phone, and 'Submit' button.
- Apply semantic HTML and premium styling with [var(--primary)] buttons.

# IMMUTABLE OVERRIDE (CRITICAL):
- You MUST STILL ONLY USE 'https://picsum.photos/seed/[UNIQUE_TEXT]/1200/800' directly to prevent 404 errors. No exceptions.
- Do not use Unsplash, Pexels, or any other external API.

# FINAL TASK: 
Build a pixel-perfect, premium landing page using the user's custom prompt's structure as a STRICT BLUEPRINT. Ensure EVERY requested section is built with unique, premium design and deep content. LONG-FORM ONLY.
`;
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
      const response = await anthropic.messages.create({
        model,
        max_tokens: 5000,
        temperature: 0.7,
        system: finalSystemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
      });

      const rawText = response.content[0].text;
      logger.info(`[AI] Raw response received. Length: ${rawText.length} characters.`);

      return processResult(rawText, logoUrl);
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
  if (styleMatches) {
    css = styleMatches.map(s => s.replace(/<\/?style[^>]*>/gi, '')).join('\n');
  }

  return { fullHtml: clean, fullCss: css, fullJs: '', seo: { title } };
};

const cleanHTML = (raw) => {
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

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const response = await anthropic.messages.create({
    model: CLAUDE_MODEL_CANDIDATES[0],
    max_tokens: 400,
    messages: [{ role: 'user', content: prompt }],
  });

  return response.content[0].text.trim().replace(/^"|"$/g, '');
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
  const response = await anthropic.messages.create({
    model: CLAUDE_MODEL_CANDIDATES[0],
    max_tokens: 8192,
    messages: [
      { role: 'user', content: systemPrompt + '\n\n' + userPrompt }
    ],
  });

  try {
    let text = response.content[0].text;
    // Remove markdown code blocks if present
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    // Try to parse as JSON
    try {
      return JSON.parse(text);
    } catch (parseErr) {
      // Fallback: try to extract JSON from the text
      logger.warn('Initial JSON parse failed, attempting extraction:', parseErr.message);
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          return JSON.parse(jsonMatch[0]);
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
  const response = await anthropic.messages.create({
    model: CLAUDE_MODEL_CANDIDATES[0],
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