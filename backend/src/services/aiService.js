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
}) => {
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

# PROJECT CONTEXT:
- Name: ${businessName}
- Industry: ${industry || 'Service'}
- Goal: ${businessDescription}
- Audience: ${targetAudience}
- Main CTA: ${ctaText}

# USER'S VISION (CUSTOM PROMPT):
"${aiPrompt || 'Create a world-class, modern, high-conversion SaaS landing page.'}"

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
  if (logoUrl) {
    clean = clean.replace(/\{\{LOGO_URL\}\}/g, logoUrl);
  } else {
    // Prevent broken images if logo is omitted
    clean = clean.replace(/\{\{LOGO_URL\}\}/g, 'https://placehold.co/150x50/f8fafc/0f172a?text=LOGO');
  }

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
  const systemPrompt = buildSystemPrompt();
  const userPrompt = buildUserPrompt(input);
  return await callAI(userPrompt, input.logoUrl, systemPrompt);
};

const improveSectionContent = async ({ sectionType, currentContent, aiPrompt }) => {
  const prompt = `Improve this ${sectionType}: ${JSON.stringify(currentContent)}. Instruction: ${aiPrompt}`;
  return await callAI(prompt);
};

module.exports = { generateLandingPageContent, improveSectionContent };