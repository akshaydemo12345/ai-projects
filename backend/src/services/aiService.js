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

Your task is to generate a visually stunning, highly modern, conversion-focused landing page with premium UI aesthetics and strong visual storytelling.

CRITICAL DESIGN RULES:
- MUST include a modern top navigation header
- The header MUST prominently display the brand LOGO. Use exactly: <img src="{{LOGO_URL}}" alt="Brand Logo" class="h-8 w-auto">
- Hero section must follow immediately below the header
- Use rich visual hierarchy like modern SaaS, healthcare, startup, and agency landing pages
- MUST use high-quality images matching the brand/industry throughout the layout
- EXTREMELY CRITICAL IMAGE RULE: DO NOT use 'unsplash.com' or 'source.unsplash.com' URLs ever! They cause 404 errors!
- For EVERY SINGLE image (hero, services, portraits, backgrounds), you MUST use 'https://picsum.photos/seed/[ANY_UNIQUE_WORD]/1200/800'. It is 100% reliable.
- BACKGROUND IMAGES: YOU MUST USE INLINE STYLES. Example: style="background-image: url('https://picsum.photos/seed/hero/1920/1080'); background-size: cover; background-position: center;"
- DO NOT use Tailwind arbitrary URL values like bg-[url(...)] for background images, as they fail in our editor. Use inline style="" for backgrounds!
- Every major section should include image-driven storytelling
- Use split-screen layouts with text on one side and image on the other
- Alternate image left/right layouts across sections
- Use background images with dark/light gradient overlays
- Use layered cards over images
- Use floating UI cards and stats badges
- Use premium whitespace and section rhythm
- Use modern rounded corners (20px+)
- Use subtle glassmorphism where useful
- Use gradients, shadows, and premium typography
- Use sticky CTA on mobile
- Use micro interactions and hover transitions
- Use reveal animations
- Make layout feel premium like Webflow, Framer, Stripe, Linear, or top healthcare SaaS websites

MANDATORY IMAGE PLACEMENT SYSTEM:
1. Hero Section
   - Full-width premium background image from Unsplash
   - Use doctor/team/business workspace/professional image depending on niche
   - Add gradient overlay for text readability
   - Add floating trust badges over image
   - Add lead form card on hero right side
   - Use asymmetrical layout
   - Add shape dividers or blurred blobs

2. Services / Benefits
   - Use 3-column modern cards
   - Each card can include mini image/icon
   - One side sticky content, one side large image collage
   - Use overlapping cards effect

3. Why Choose Us
   - Left content + right large vertical image
   - Add experience stats floating over image
   - Use timeline style process blocks

4. Mid CTA Banner
   - Full-width background image section
   - Overlay second lead form
   - Strong urgency headline
   - CTA glow button

5. Portfolio / Results
   - Masonry image cards
   - Case study cards
   - Before/after stat blocks
   - Hover zoom image effects

6. Testimonials
   - Customer avatars
   - Team/office image strip
   - Review cards carousel feel

7. Final CTA
   - Emotional people/team image background
   - Form overlay card
   - Repeated CTA

FORM REQUIREMENTS:
- Minimum 2 visible forms
- Hero form = detailed lead form
- Mid CTA = short quick contact form
- Final CTA = optional mini form
- Premium floating form cards with shadow
- Strong focus states
- Validation UI
- Progressively reduced friction

MODERN UI REQUIREMENTS:
- 2026 design trend aesthetics using Tailwind CSS (via CDN: <script src="https://cdn.tailwindcss.com"></script>)
- ALWAYS include a modern Google Font (e.g., 'Inter', 'Outfit', or 'Plus Jakarta Sans')
- Make extensive use of modern CSS Grid & Flexbox layouts with generous spacing (e.g., py-24, gap-12, px-6)
- Apply deep, realistic shadows (shadow-2xl, shadow-soft) and large modern border radiuses (rounded-3xl, rounded-2xl)
- Use glassmorphism effects (backdrop-blur-xl, bg-white/70, bg-white/10 for dark mode) for floating cards and forms
- Use visually stunning background gradients (bg-gradient-to-br, via-purple-50, etc.) and blurred blob shapes
- Beautiful, highly-styled forms with large inputs, subtle borders, focus rings (focus:ring-2), and vibrant glowing CTA buttons
- Build with perfect Mobile-first responsiveness (stacking on mobile, side-by-side on lg screens)
- Semantic production-ready code. Output FULL complete HTML document code enclosed in \`\`\`html block.
- Output only premium frontend code with clear section comments
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

# IMMUTABLE OVERRIDE (CRITICAL):
If the user's custom prompt below requests "Unsplash images" or any other specific API, IGNORE IT. You MUST STILL ONLY USE 'https://picsum.photos/seed/[UNIQUE_TEXT]/1200/800' directly to prevent 404 errors. No exceptions.

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