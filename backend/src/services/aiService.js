'use strict';

const Anthropic = require('@anthropic-ai/sdk');
const OpenAI = require('openai');
const logger = require('../utils/logger');

/**
 * Build SYSTEM prompt (Claude-Level Master UI Designer)
 */
const buildSystemPrompt = () => {
  return `
You are a WORLD-CLASS UI/UX Designer and Lead Frontend Architect from a top-tier digital agency (like Stripe, Vercel, or Apple).
Your task is to generate a landing page that looks and feels like a $25,000+ premium custom-built masterpiece.

# CORE DESIGN LAWS (NON-NEGOTIABLE):
1. **TYPOGRAPHY (The Foundation)**: 
   - Use 'Plus Jakarta Sans' or 'Inter' from Google Fonts.
   - HERO HEADLINES: 700+ weight, letter-spacing: -0.04em, line-height: 1.1. Use solid [PRIMARY_HEX] for highlights.
2. **COLOR & BRANDING (SOLID ONLY)**:
   - **NO GRADIENTS**: Do not use linear-gradients or radial-gradients for buttons or backgrounds.
   - Use the provided PRIMARY and SECONDARY hex codes as SOLID colors.
   - SECTION ALTERNATION: Use [PRIMARY_HEX] for the Hero section background, and use [SECONDARY_HEX] or a light/dark neutral for subsequent sections to create contrast.
3. **BUTTON ARCHITECTURE**:
   - Primary Buttons: SOLID background [PRIMARY_HEX], rounded-lg (8px), bold, high-contrast text.
   - Secondary Buttons: SOLID [SECONDARY_HEX] or bordered.
4. **MODERN LAYOUTS**:
   - BENTO GRIDS: Use for features. Cards should be solid containers with 1px borders.
   - DEPTH: Use soft shadows (0 10px 30px rgba(0,0,0,0.1)) rather than blurs or gradients.
5. **SPACING**: Sections must have 100px+ vertical padding.

# CONTENT QUALITY:
- Write compelling, conversion-focused copy.
- Structure: Clear Hero -> Trusted By -> Features (Bento) -> Social Proof -> FAQ -> conversion-focused Footer.
- Ensure 100% Mobile Responsiveness.

# TECHNICAL REQUIREMENTS:
- LOGO INTEGRATION: Place the logo image (use src="{{LOGO_URL}}") in the Navbar. Ensure it has a professional max-height (45px). If no logo is provided, use the Business Name as a text-brand.
- Return ONLY full HTML (<!DOCTYPE html>).
- All CSS must be inside a <style> tag.
- Load Lucide Icons: <script src="https://unpkg.com/lucide@latest"></script>. Call lucide.createIcons() at the end.
- STARS: For ratings (★★★★★), use Lucide 'star' icons instead of text.
- Use only Vanilla CSS (No Tailwind, No Bootstrap).
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
- PRIMARY COLOR: ${primaryColor || '#d23f1b'}
- SECONDARY COLOR: ${secondaryColor || '#c7d186'}
- LOGO: ${logoUrl ? 'Provided ({{LOGO_URL}})' : 'Create a text-based agency logo'}

**CRITICAL**: Ignore any other colors mentioned in the text below. Use ONLY these HEX codes.

# PROJECT CONTEXT:
- Name: ${businessName}
- Industry: ${industry || 'Service'}
- Goal: ${businessDescription}
- Audience: ${targetAudience}
- Main CTA: ${ctaText}

# USER'S VISION (CUSTOM PROMPT):
"${aiPrompt || 'Create a world-class, modern, high-conversion SaaS landing page.'}"

# FINAL TASK: 
Build a pixel-perfect, premium landing page using the custom prompt's structure but with the high-fidelity designer persona and my branding assets.
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

  // --- Try OpenAI First ---
  if (openaiKey) {
    const openai = new OpenAI({ apiKey: openaiKey });
    try {
      logger.info(`[AI] Attempting OpenAI GPT-4o...`);
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

  // --- Try Anthropic Fallback ---
  if (anthropicKey) {
    const anthropic = new Anthropic({ apiKey: anthropicKey });
    try {
      logger.info(`[AI] Attempting Claude...`);
      const response = await anthropic.messages.create({
        model: process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-latest',
        max_tokens: 4048,
        system: finalSystemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
      });
      return processResult(res.content[0].text, logoUrl);
    } catch (err) {
      logger.error(`[AI] Anthropic failed: ${err.message}`);
    }
  }

  throw new Error('All AI providers failed.');
};

/**
 * Post-Processing
 */
const processResult = (raw, logoUrl) => {
  let clean = cleanHTML(raw);
  if (logoUrl) clean = clean.replace(/\{\{LOGO_URL\}\}/g, logoUrl);

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
  const systemPrompt = buildSystemPrompt();
  const userPrompt = buildUserPrompt(input);
  return await callAI(userPrompt, input.logoUrl, systemPrompt);
};

const improveSectionContent = async ({ sectionType, currentContent, aiPrompt }) => {
  const prompt = `Improve this ${sectionType}: ${JSON.stringify(currentContent)}. Instruction: ${aiPrompt}`;
  return await callAI(prompt);
};

module.exports = { generateLandingPageContent, improveSectionContent };