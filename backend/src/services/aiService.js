'use strict';

const Anthropic = require('@anthropic-ai/sdk');
const logger = require('../utils/logger');
const OpenAI = require('openai');

const CLAUDE_MODEL_CANDIDATES = [
  'claude-sonnet-4-20250514',
  'claude-3-5-sonnet-latest',
  'claude-3-5-haiku-latest'
];

// ─── COST CALCULATOR ─────────────────────────────────────────────────────────────
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
  const modelKey = Object.keys(pricing).find(k => model.toLowerCase().includes(k)) || 'default';
  const p = pricing[modelKey];
  return (inputTokens * p.input) + (outputTokens * p.output);
};

// ─── CLEAN HTML ──────────────────────────────────────────────────────────────────
const cleanHTML = (raw) => {
  if (typeof raw !== 'string') return '';
  const regex = /```(?:html)?\s*([\s\S]*?)(?:```|$)/gi;
  let matches = [], match;
  while ((match = regex.exec(raw)) !== null) {
    if (match[1]) matches.push(match[1].trim().replace(/```$/g, '').trim());
  }
  if (matches.length > 0) return matches.join('\n');
  const htmlMatch = raw.match(/(<!DOCTYPE[\s\S]*?<\/html>)/i) || raw.match(/(<html[\s\S]*?<\/html>)/i);
  if (htmlMatch) return htmlMatch[1].trim();
  return raw.replace(/```html/gi, '').replace(/```/g, '').trim();
};

// ─── PROCESS RESULT ──────────────────────────────────────────────────────────────
const processResult = (raw, logoUrl) => {
  let clean = cleanHTML(raw);
  const logoPlaceholder = 'https://placehold.co/200x60/f8fafc/6366f1?text=BRAND';
  const finalLogo = logoUrl && logoUrl.trim() !== '' ? logoUrl : logoPlaceholder;
  clean = clean.replace(/\{\{LOGO_URL\}\}/gi, finalLogo);
  clean = clean.replace(/\{\{logoUrl\}\}/gi, finalLogo);
  const titleMatch = clean.match(/<title>([\s\S]*?)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : 'Landing Page';
  let css = '';
  const styleMatches = clean.match(/<style[^>]*>([\s\S]*?)<\/style>/gi);
  if (styleMatches) css = styleMatches.map(s => s.replace(/<\/?style[^>]*>/gi, '')).join('\n');
  return { fullHtml: clean, fullCss: css, fullJs: '', seo: { title } };
};

// ─── CORE AI CALL (returns full HTML page) ───────────────────────────────────────
const callAI = async (userPrompt, logoUrl = '', systemPrompt = '') => {
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;
  if (!anthropicKey && !openaiKey) throw new Error('No AI API key configured');

  const primaryHex = typeof userPrompt === 'string'
    ? (userPrompt.match(/PRIMARY COLOR:\s*(#[0-9a-fA-F]{3,6})/)?.[1] || '#7c3aed') : '#7c3aed';
  const secondaryHex = typeof userPrompt === 'string'
    ? (userPrompt.match(/SECONDARY COLOR:\s*(#[0-9a-fA-F]{3,6})/)?.[1] || '#6366f1') : '#6366f1';
  const businessName = typeof userPrompt === 'string'
    ? (userPrompt.match(/BUSINESS NAME:\s*(.+)/)?.[1]?.trim() || 'brand') : 'brand';

  const finalSystemPrompt = systemPrompt
    .replace(/\[PRIMARY_HEX\]/g, primaryHex)
    .replace(/\[SECONDARY_HEX\]/g, secondaryHex)
    .replace(/{{BUSINESS_NAME_KEYWORD}}/g, businessName.toLowerCase().replace(/\s+/g, '-'));

  if (openaiKey) {
    try {
      const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
      logger.info(`[AI] OpenAI: ${model}`);
      const openai = new OpenAI({ apiKey: openaiKey });
      const response = await openai.chat.completions.create({
        model,
        messages: [
          { role: 'system', content: finalSystemPrompt },
          { role: 'user', content: Array.isArray(userPrompt) ? JSON.stringify(userPrompt) : userPrompt }
        ],
        max_tokens: 8000,
        temperature: 0.95
      });
      const rawText = response.choices[0].message.content;
      const usage = response.usage;
      return {
        ...processResult(rawText, logoUrl),
        aiUsage: { promptTokens: usage.prompt_tokens, completionTokens: usage.completion_tokens, totalTokens: usage.total_tokens, cost: calculateCost(model, usage.prompt_tokens, usage.completion_tokens), model }
      };
    } catch (err) {
      logger.error(`[AI] OpenAI failed: ${err.message}`);
    }
  }

  if (anthropicKey) {
    const anthropic = new Anthropic({ apiKey: anthropicKey });
    let lastError = null;
    for (const model of CLAUDE_MODEL_CANDIDATES) {
      try {
        logger.info(`[AI] Claude: ${model}`);
        const response = await anthropic.messages.create({
          model, max_tokens: 8000, temperature: 0.95,
          system: [
            {
              type: "text",
              text: finalSystemPrompt,
              cache_control: { type: "ephemeral" }
            }
          ],
          messages: Array.isArray(userPrompt) ? userPrompt : [{ role: 'user', content: userPrompt }],
        }, {
          headers: { "anthropic-beta": "max-tokens-3-5-sonnet-2024-07-15,prompt-caching-2024-07-31" }
        });
        const usage = response.usage;
        return {
          ...processResult(response.content[0].text, logoUrl),
          aiUsage: { promptTokens: usage.input_tokens, completionTokens: usage.output_tokens, totalTokens: usage.input_tokens + usage.output_tokens, cost: calculateCost(model, usage.input_tokens, usage.output_tokens), model }
        };
      } catch (err) {
        lastError = err;
        logger.error(`[AI] Claude failed (${model}): ${err.message}`);
        if (!String(err.message).toLowerCase().match(/not_found|model:/)) break;
      }
    }
    throw new Error(`AI generation failed: ${lastError?.message}`);
  }
  throw new Error('No AI provider succeeded');
};

// ─── TEXT AI CALL (returns plain text / JSON — for suggestions, descriptions) ────
const callAIText = async (systemPrompt, userPrompt) => {
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  if (openaiKey) {
    try {
      const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
      const openai = new OpenAI({ apiKey: openaiKey });
      const response = await openai.chat.completions.create({
        model,
        messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userPrompt }],
        max_tokens: 2000, temperature: 0.7
      });
      return {
        text: response.choices[0].message.content,
        aiUsage: { promptTokens: response.usage.prompt_tokens, completionTokens: response.usage.completion_tokens, totalTokens: response.usage.total_tokens, cost: calculateCost(model, response.usage.prompt_tokens, response.usage.completion_tokens), model }
      };
    } catch (err) {
      logger.error(`[AI-TEXT] OpenAI failed: ${err.message}`);
    }
  }

  if (anthropicKey) {
    const anthropic = new Anthropic({ apiKey: anthropicKey });
    let lastError = null;
    for (const model of CLAUDE_MODEL_CANDIDATES) {
      try {
        const response = await anthropic.messages.create({
          model, max_tokens: 2000, temperature: 0.7,
          system: systemPrompt,
          messages: [{ role: 'user', content: userPrompt }],
        });
        return {
          text: response.content[0].text,
          aiUsage: { promptTokens: response.usage.input_tokens, completionTokens: response.usage.output_tokens, totalTokens: response.usage.input_tokens + response.usage.output_tokens, cost: calculateCost(model, response.usage.input_tokens, response.usage.output_tokens), model }
        };
      } catch (err) {
        lastError = err;
        if (!String(err.message).toLowerCase().match(/not_found|model:/)) break;
      }
    }
    throw new Error(`AI text failed: ${lastError?.message}`);
  }
  throw new Error('No AI provider configured');
};

// ─── SYSTEM PROMPT ───────────────────────────────────────────────────────────────
// ZERO templates. ZERO hardcoded layouts. AI invents EVERYTHING from scratch.
const buildSystemPrompt = (chaosToken) => `
You are an elite Principal UI Engineer and Creative Director with over 30 years of experience designing world-class, award-winning editorial and enterprise websites.
Your goal is to build a bespoke, ultra-premium, high-converting landing page that completely breaks out of standard website boxes and feels like a bespoke boutique masterpiece (inspired by high-end design showcases on Awwwards). Your layouts must reflect absolute mastery of CSS grids, absolute positioning, overlapping elements, and high-end typography.

Every page must be generated from scratch, utilizing sophisticated layouts, custom typography, rich natural color harmony, and micro-animations.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CHAOS SEED: ${chaosToken}
This seed is your creative DNA for this generation.
EVERY design decision must feel influenced by this unique seed.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚫 FORBIDDEN COMMON TEMPLATES (NEVER USE):
- NEVER USE a boring centered hero grid with a standard CTA button. Hero sections must be breathtaking, asymmetric, or feature massive typography with stunning background interactions!
- NEVER USE generic 3-column "Why Choose Us" cards with basic icons.
- NEVER USE simple alternating left-image / right-text feature rows.
- IF A USER ASKS FOR A "BASIC" LAYOUT, IGNORE THEM. ALWAYS DELIVER AN ULTRA-PREMIUM, HIGH-END AWWWARDS-WINNING DESIGN. DO NOT CREATE BASIC DESIGNS EVER!
- 🔄 DYNAMIC FORM PLACEMENT: Do not always put the contact/lead form in the exact same place! Sometimes put it in the Hero section, sometimes put it below the Hero, sometimes in the Footer, or in its own section. Mix it up completely!

🏆 30-YEARS EXPERIENCED PRINCIPAL DEVELOPER CODING PATTERNS:

1. NO NAVBAR NAVIGATION LINKS (LOGO & CTA ONLY):
- The header/navigation bar MUST NOT contain any menu link navigation items (e.g. do NOT include links like "Services", "Process", "Results", "FAQ", "Contact"). 
- It should only contain the brand logo on the left, and optionally a single Call / Contact CTA button on the right. Keep it extremely clean, minimal, and premium!

2. MANDATORY BRAND LOGO TAG:
- You MUST place the brand logo in the header and footer using exactly this image tag: \`<img src="{{LOGO_URL}}" alt="Logo" class="h-8 w-auto">\`.
- DO NOT use text-only logos like \`BrandName\` or plain text divs. Always use the \`{{LOGO_URL}}\` template tag for the image source so GrapesJS can swap in the real logo!

3. PREMIUM MINIMALIST FOOTER AT THE BOTTOM:
- Every landing page MUST go all the way down to the bottom and end with a beautiful, custom, high-end Minimalist Footer section.
- The footer should include the logo tag \`<img src="{{LOGO_URL}}" alt="Logo" class="h-8 w-auto">\`, a clean address or contact info line (phone & email), simple social icons, and a premium copyright notice (e.g. "© \${new Date().getFullYear()} Brand. All rights reserved.").

4. STRICT BRAND COLORS & VARIABLES:
- YOU MUST NEVER USE hardcoded Tailwind colors like \`bg-blue-600\`, \`text-red-500\`, or \`bg-green-500\`.
- You MUST ONLY use the CSS variables \`var(--primary)\` and \`var(--secondary)\` for all branding, buttons, accents, and highlights! (e.g., \`bg-[var(--primary)]\`, \`text-[var(--secondary)]\`).
- This is critical so the user's selected brand colors are automatically applied!

5. ABSOLUTE STRUCTURAL FREEDOM & MANDATORY UNIQUENESS (CRITICAL):
- DO NOT use ANY standard web layouts (no standard 3-columns, no boring alternating left-right splits, no generic centered text headers).
- I am giving you 100% creative freedom. INVENT the layout for EVERY SINGLE SECTION completely from scratch. 
- You MUST create a completely new, bespoke layout for every generation. NEVER rely on a template or a predefined structure.
- IF YOU OUTPUT A GENERIC LAYOUT, YOU FAIL. Surprise the user with unique grid structures, overlapping containers, asymmetrical alignments, and premium editorial magazine-style layouts.
- Keep structural elements clean and modern (rectangles, rounded corners, clean grids).
- YOU MUST USE RICH PLACEHOLDER IMAGES in your designs! Use \`https://picsum.photos/1200/800?random=1\` (change the random number for different images). Every page must have beautiful, large photos.

9. PREMIUM TYPOGRAPHY PAIRINGS & DYNAMIC GOOGLE FONTS:
- Do NOT hardcode the same font pair for every website. Select a pairing that perfectly matches the brand style:
  * For Luxury, Editorial, or High-End brands: Pair a Display Serif (\`Fraunces\`, \`Playfair Display\`, or \`Cormorant Garamond\`) with a clean Sans (\`DM Sans\` or \`Plus Jakarta Sans\`).
  * For Modern, Tech, Creative, or Brutalist brands: Pair a dramatic Sans (\`Syne\`, \`Clash Display\`, or \`Cabinet Grotesk\`) with a highly legible Sans (\`Satoshi\`, \`Inter\`, or \`Space Grotesk\`).
  * For Clinical, Trustworthy, or Corporate brands: Pair a precise Serif (\`Lora\` or \`Merriweather\`) with a clean Sans (\`Inter\` or \`Outfit\`).
- You MUST load the selected Google Fonts stylesheet in the \`<head>\` of your page.

10. RICH HIGH-END DYNAMIC ICONS:
- DO NOT use basic, generic icons. Always use highly descriptive, modern FontAwesome 6 icons (e.g., \`fa-solid fa-compass-drafting\`, \`fa-solid fa-vault\`, \`fa-solid fa-chart-line-up\`, \`fa-solid fa-shield-halved\`) or elegant SVG custom paths.
- Choose icons that are highly relevant to the industry niche to make the page feel professional, custom-made, and expensive.

24. INTERACTIVE ACCORDIONS & FORMS (NO JS REQUIRED):
- We automatically inject JavaScript for FAQs and Form validation. You DO NOT need to write any script tags for interactivity.
- However, your HTML MUST use these exact classes for FAQs: \`accordion-item\`, \`accordion-header\`, and \`accordion-content hidden\`.
- 🚨 EXTREMELY IMPORTANT: DO NOT use the same boring white box design for FAQs every time. Invent DIFFERENT styles! Sometimes use a 2-column grid. Sometimes use minimalist borders with no background. Sometimes use dark backgrounds. Sometimes put the FAQ next to a large image. VARY THE DESIGN!
- 🚨 MAXIMUM ONE FORM PER PAGE: You must generate EXACTLY ONE lead/contact form on the entire page! Do NOT put a form in the hero AND the footer. Pick ONE interesting, dynamic placement for it!
- FORM STRUCTURE: Make the form look premium. ALL form fields must have the \`required\` attribute (e.g. \`<input type="text" required>\`) so our backend validation script catches them.

12. ULTRA-PREMIUM UI/UX FINISH (MANDATORY):
- WHITESPACE: Use massive, luxurious padding (e.g. \`py-24\`, \`py-32\`) between sections. Premium design breathes. Do not cramp elements.
- TYPOGRAPHY: Treat text like art. Use tight letter-spacing for massive headings (\`tracking-tighter\`), and wide spacing for small uppercase sub-labels (\`tracking-widest uppercase text-xs\`).
- SHADOWS & DEPTH: Use ultra-soft, diffused shadows (e.g. \`shadow-[0_20px_50px_rgba(8,_112,_184,_0.07)]\`) instead of standard tailwind shadows.
- MICRO-INTERACTIONS & WOW ANIMATIONS (MANDATORY): Every button and card MUST have a premium hover state (e.g. \`transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-xl\`).
- SCROLL ANIMATIONS: You MUST add premium animations! 🚨 CRITICAL RULE: DO NOT use Tailwind's \`opacity-0\` class or hide elements by default (it breaks the editor). Instead, include the AOS library via CDN (\`<link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">\` and \`<script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>\`) and use \`data-aos="fade-up"\` attributes on elements. Make sure to initialize AOS in a script tag: \`<script>AOS.init({duration: 1000, once: true});</script>\`.
- CONTRAST: Ensure stunning contrast. If using a dark section, use \`text-white/80\` for paragraphs and \`text-white\` for headings to create subtle typographic hierarchy.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚙️ TECHNICAL REQUIREMENTS:
- Tailwind CDN: <script src="https://cdn.tailwindcss.com"></script>
- Google Fonts: Dynamically load the selected font pairing stylesheet in <head>
- Brand colors via CSS variables: --primary and --secondary ONLY
- Custom CSS in <style> tag for smooth continuous marquees, custom font styling, and line transitions.
- Fully responsive, complete, and stunning HTML output.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📤 OUTPUT FORMAT:
IMPORTANT: All generated text content MUST be in English only. Do not use Hindi or any other language.
CRITICAL: Do NOT generate excessively long placeholder text (lorem ipsum). Keep text concise so your response DOES NOT TRUNCATE. You MUST output the ENTIRE HTML document perfectly, closing \`</body>\` and \`</html>\` at the end!
Return ONLY a complete HTML file inside one code block.
No explanation before or after. No comments. Start with the HTML tag directly.
\`\`\`html
<!DOCTYPE html>
<html lang="en">
...complete premium page, including scripts at the bottom...
</html>
\`\`\`
`;

// ─── USER PROMPT ─────────────────────────────────────────────────────────────────
const buildUserPrompt = (input) => {
  // Extreme visual style nudge — forces the AI into radically different design paradigms each time
  const styleNudges = [
    'Invent a totally custom modern layout utilizing extreme asymmetry and bold whitespace. Do not use standard rows.',
    'Create an editorial magazine-style layout with large typography, overlapping high-quality images, and unexpected alignments.',
    'Build a layout that defies standard grids. Use free-floating image cards, clean abstract positioning, and creative structural boundaries.',
    'Design a brutalist-inspired yet premium interface. Use massive bold text, stark contrasts, and unique structural arrangements.',
    'Invent a completely bespoke grid system. Do not use generic cards or standard split screens. Think outside the box and use rich imagery spanning multiple columns.',
    'Use an immersive dark-mode aesthetic with neon accents (if brand colors allow), glassmorphism effects, and unconventional section transitions.',
    'Create a split-screen dominant layout where content flows independently from the imagery, breaking traditional vertical scrolling conventions.'
  ];
  const randomNudge = styleNudges[Math.floor(Math.random() * styleNudges.length)];

  const lines = [
    `BUSINESS NAME: ${input.businessName}`,
    `INDUSTRY: ${input.industry}`,
    `PAGE GOAL: ${input.pageType || 'lead generation'}`,
    `PRIMARY COLOR: ${input.primaryColor || '#7c3aed'}`,
    `SECONDARY COLOR: ${input.secondaryColor || '#6366f1'}`,
    `LOGO: {{LOGO_URL}}`,
  ];

  // Rich branding — typography
  if (input.scrapedFonts) {
    if (input.scrapedFonts.headingFont) lines.push(`MANDATORY HEADING FONT: ${input.scrapedFonts.headingFont}`);
    if (input.scrapedFonts.bodyFont) lines.push(`MANDATORY BODY FONT: ${input.scrapedFonts.bodyFont}`);
    lines.push(`🚨 CRITICAL FONT RULE: You MUST use these exact fonts in your CSS (e.g. \`font-family: '${input.scrapedFonts.headingFont}', serif;\`) and load them via Google Fonts in the <head>! DO NOT invent your own font pairings.`);
  } else {
    if (input.branding?.typography?.fontFamily) lines.push(`BODY FONT: ${input.branding.typography.fontFamily}`);
    if (input.branding?.typography?.headingFontFamily) lines.push(`HEADING FONT: ${input.branding.typography.headingFontFamily}`);
    if (input.branding?.typography?.googleFontFamilies?.length) lines.push(`GOOGLE FONTS: ${input.branding.typography.googleFontFamilies.join(', ')}`);
  }

  // Rich branding — nav/header
  if (input.branding?.navigation) {
    const nav = input.branding.navigation;
    const parts = [];
    if (nav.backgroundColor) parts.push(`bg:${nav.backgroundColor}`);
    if (nav.textColor) parts.push(`text:${nav.textColor}`);
    if (nav.linkColor) parts.push(`link:${nav.linkColor}`);
    if (parts.length) lines.push(`NAV COLORS: ${parts.join(', ')}`);
  } else if (input.navColors?.palette?.length) {
    lines.push(`NAV COLORS: ${input.navColors.palette.slice(0, 6).join(', ')}`);
  }
  if (input.headerColors?.palette?.length) {
    lines.push(`HEADER COLORS: ${input.headerColors.palette.slice(0, 6).join(', ')}`);
  }

  // Rich branding — footer
  if (input.branding?.footer) {
    const ft = input.branding.footer;
    const parts = [];
    if (ft.backgroundColor) parts.push(`bg:${ft.backgroundColor}`);
    if (ft.textColor) parts.push(`text:${ft.textColor}`);
    if (ft.linkColor) parts.push(`link:${ft.linkColor}`);
    if (parts.length) lines.push(`FOOTER COLORS: ${parts.join(', ')}`);
  } else if (input.footerColors?.palette?.length) {
    lines.push(`FOOTER COLORS: ${input.footerColors.palette.slice(0, 6).join(', ')}`);
  }

  // Rich branding — buttons
  if (input.branding?.buttons?.primary) {
    const btn = input.branding.buttons.primary;
    const parts = [];
    if (btn.backgroundColor) parts.push(`bg:${btn.backgroundColor}`);
    if (btn.textColor) parts.push(`text:${btn.textColor}`);
    if (btn.borderRadius) parts.push(`radius:${btn.borderRadius}`);
    if (btn.textTransform) parts.push(`transform:${btn.textTransform}`);
    if (parts.length) lines.push(`PRIMARY BUTTON STYLE: ${parts.join(', ')}`);
  } else if (input.buttonColors?.palette?.length) {
    lines.push(`BUTTON COLORS: ${input.buttonColors.palette.slice(0, 6).join(', ')}`);
  }

  // Logo URL (actual resolved value, separate from placeholder)
  if (input.branding?.logoUrl) {
    lines.push(`LOGO URL (actual): ${input.branding.logoUrl}`);
  }

  lines.push(
    `🎨 STYLE DIRECTION: ${randomNudge}`,
    `CRITICAL RULE: DO NOT generate a boring layout. You must INVENT a unique structure for this specific business. NO GENERIC CARDS. NO STANDARD GRIDS.`
  );

  if (input.businessDescription) lines.push(`\nABOUT THE BUSINESS:\n${input.businessDescription}`);
  if (input.targetAudience) lines.push(`\nTARGET AUDIENCE: ${input.targetAudience}`);
  if (input.ctaText) lines.push(`\nMAIN CTA BUTTON TEXT: ${input.ctaText}`);
  if (input.tone) lines.push(`\nBRAND VOICE / TONE: ${input.tone}`);
  if (input.services?.length) lines.push(`\nSERVICES OFFERED:\n${input.services.map(s => `• ${s}`).join('\n')}`);
  if (input.websiteContent) lines.push(`\nEXISTING WEBSITE CONTENT (extract real facts, names, copy — understand deeply):\n${input.websiteContent.substring(0, 4000)}`);
  if (input.aiPrompt) lines.push(`\nSPECIAL REQUEST FROM USER:\n${input.aiPrompt}`);

  lines.push(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NOW BUILD — FOLLOW THESE FINAL RULES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. 🚫 ABSOLUTE RULE: DO NOT REUSE LAYOUTS. Every single time you generate a page, you MUST invent completely new HTML structures.
2. 📱 STRICT MOBILE RESPONSIVENESS (CRITICAL): Your design MUST look perfect on mobile devices. Use mobile-first Tailwind classes. NEVER use static widths that break the viewport. Always use \`grid-cols-1 md:grid-cols-2 lg:grid-cols-X\` or \`flex-col md:flex-row\` to ensure everything stacks perfectly on phones!
3. Your hero MUST follow the STYLE DIRECTION above. Give it a radically different design than a standard hero.
4. Name your visual concept in an HTML comment at the top: <!-- CONCEPT: ... -->
5. Every section must look visually different from the one before it and from standard templates. Randomize column counts, padding, overlap, and alignment.
5. Write REAL, industry-specific copy — not generic filler text.
6. MANDATORY LEAD FORM (NO POPUPS): You MUST include at least one functional Lead Capture <form> block directly visible on the page (e.g. in the Hero or a dedicated Contact section). DO NOT hide the form inside a modal or popup. It must be INLINE and always visible. Include beautiful input fields and a submit button.
7. 🔥 EXTREME STRUCTURAL VARIETY (MINIMUM 8 SECTIONS): Choose a completely unexpected combination of sections. YOU MUST GENERATE AT LEAST 8 SECTIONS to make the page feel complete and professional.
8. ⚠️ AVOID TRUNCATION: Because you are generating 8+ sections, you MUST be extremely concise and efficient with your HTML/Tailwind code to stay under the output token limit. Compress your code where possible, avoid repetitive bloated classes if not needed, but keep the design stunning.
9. The page must end with a beautiful custom Footer (containing the logo, contact info, and copyright), followed by your interaction script and the closing \`</html>\` tag. The footer layout must also be uniquely designed each time. Do NOT stop writing before finishing the footer and closing all HTML tags!
`);

  return lines.join('\n');
};

// ─── GENERATE LANDING PAGE ───────────────────────────────────────────────────────
const generateLandingPageContent = async (input) => {
  // chaosToken = timestamp + random + reversed business name → guarantees uniqueness per call
  const chaosToken = `${Date.now()}-${Math.random().toString(36).substring(2, 14)}-${Math.random().toString(36).substring(2, 8)}-${(input.businessName || 'biz').split('').reverse().join('').substring(0, 6).toUpperCase()}`;

  logger.info(`[AI] Generating page | Business: ${input.businessName} | Token: ${chaosToken}`);

  const systemPrompt = buildSystemPrompt(chaosToken);
  let userPrompt = buildUserPrompt(input);

  if (input.templateHtml) {
    let prevHtml = '';
    if (typeof input.templateHtml === 'string') {
      prevHtml = input.templateHtml;
    } else if (typeof input.templateHtml === 'object') {
      prevHtml = input.templateHtml.fullHtml || input.templateHtml.html || JSON.stringify(input.templateHtml);
    }
    userPrompt += `\n\n⚠️ PREVIOUS PAGE EXISTS (do NOT reuse its layout — invent something completely different):\n${prevHtml.substring(0, 3000)}`;
  }

  const aiResult = await callAI(userPrompt, input.logoUrl, systemPrompt);

  // INJECT ROBUST FALLBACK SCRIPT FOR ACCORDIONS, FORMS, AND AOS
  // This guarantees interactivity even if the AI forgets to generate the script
  const coreScript = `
<script id="core-interactions">
  (function() {
    // 1. FAQ Accordion Logic via Event Delegation
    document.addEventListener('click', function(e) {
      const header = e.target.closest('.accordion-header, .faq-head, .v2-faq-summary');
      if (header) {
        const item = header.closest('.accordion-item, .faq-item');
        if (!item) return;
        
        const content = item.querySelector('.accordion-content, .faq-body');
        const icon = header.querySelector('.accordion-icon, .fa-chevron-down');
        const isOpen = content && !content.classList.contains('hidden');
        
        // Close others
        document.querySelectorAll('.accordion-content, .faq-body').forEach(c => c.classList.add('hidden'));
        document.querySelectorAll('.accordion-icon, .fa-chevron-down').forEach(i => i.classList.remove('rotate-180'));
        
        if (!isOpen && content) {
          content.classList.remove('hidden');
          if (icon) icon.classList.add('rotate-180');
        }
      }
    });

    // 2. Strict Form Validation Logic via Event Delegation
    document.addEventListener('submit', function(e) {
      if (e.target.tagName === 'FORM') {
        let isValid = true;
        e.target.querySelectorAll('input[required], textarea[required], input[type="email"], input[type="text"]').forEach(input => {
          if (!input.value.trim()) {
            isValid = false;
            input.style.border = '2px solid red';
          } else {
            input.style.border = '';
          }
        });
        if (!isValid) {
          e.preventDefault();
        }
      }
    }, true);

    // 3. Initialize AOS if loaded
    setTimeout(() => {
      if (typeof AOS !== 'undefined') {
        AOS.init({duration: 1000, once: true});
      }
    }, 500);
  })();
</script>
`;

  if (aiResult && aiResult.fullHtml) {
    if (aiResult.fullHtml.includes('</body>')) {
      aiResult.fullHtml = aiResult.fullHtml.replace('</body>', coreScript + '\\n</body>');
    } else {
      aiResult.fullHtml += '\\n' + coreScript;
    }
  }
  
  return aiResult;
};

// ─── IMPROVE SECTION ─────────────────────────────────────────────────────────────
const improveSectionContent = async ({ sectionType, currentContent, aiPrompt }) => {
  const systemPrompt = `
You are a Senior UI Developer, Conversion Copywriter, and Creative Director at a world-class digital agency.
Your job: Transform the given landing page section into something visually STUNNING, unique, and highly optimized for conversions.

🚫 ZERO TEMPLATE POLICY:
You are FORBIDDEN from using standard, boring layouts:
- Centered header with 3 equal feature cards (e.g. "Why Choose Us" with 3 icons)
- Alternating left-image / right-text rows (boring and lazy)
- Plain white backgrounds with simple black text and a solid blue/purple button
- Generic stats rows with equal boxes (e.g., 500+ Clients, 99% ROI)
- Generic placeholder testimonials

✅ CREATIVE REQUIREMENTS:
- Invent a layout structure custom-tailored to the industry and goal.
- Use Tailwind CSS utility classes + custom inline/style overrides for advanced details (custom drop shadows, animated gradients).
- Introduce strong asymmetry, unique structural framing, or interesting card dynamics.
- Write REAL, highly detailed, industry-specific marketing copy. Do not use generic placeholders.
- Add micro-interactions, subtle hover scale transformations (e.g. group-hover), and elegant visual division.

OUTPUT FORMAT:
IMPORTANT: All generated text content MUST be in English only. Do not use Hindi or any other language.
Return ONLY the complete improved HTML code. No explanation. No comments. Start directly with an HTML tag (e.g. <section> or <div>).
`;

  // Visual style nudges for section generation
  const styles = [
    'Apply a dark glassmorphic design with deep background gradients and subtle light borders.',
    'Design a clean, asymmetric editorial layout with large bold typography and rich whitespace.',
    'Use  boundaries and dynamic overlapping card containers.',
    'Incorporate interactive-feeling stats or lists with glowing shadows and high visual hierarchy.',
    'Create an immersive full-bleed grid with dramatic typography and background shapes.',
  ];
  const selectedStyle = styles[Math.floor(Math.random() * styles.length)];

  const userPrompt = `
SECTION TYPE: ${sectionType}
CREATIVE STYLE DIRECTIVE: ${selectedStyle}
CURRENT HTML:
${typeof currentContent === 'string' ? currentContent : JSON.stringify(currentContent)}

SPECIFIC IMPROVEMENT REQUEST: ${aiPrompt || 'Make this section absolutely stunning, visually unique, and premium in feel.'}

Return ONLY the raw HTML. Do not wrap in markdown or backticks. Start with the HTML tag directly.
`;

  return await callAI(userPrompt, '', systemPrompt);
};

// ─── EDITOR CHAT MODIFY ──────────────────────────────────────────────────────────
const EDITOR_SYSTEM_PROMPT = `
You are a Senior UI Developer modifying GrapesJS elements.
IMPORTANT: You MUST respond in the English language only. Do not use Hindi or any other language.
Return a valid JSON object ONLY — no markdown, no explanation:
{
  "action": "style" | "text" | "both" | "html",
  "css": { "camelCaseProperty": "value" },
  "text": "new text content (in English)",
  "html": "full html string if action is html",
  "summary": "one line: what you changed (in English)"
}
`;

const editorChatModify = async ({ elementTag, elementHtml, elementCss, instruction }) => {
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  if (!anthropicKey) throw new Error('ANTHROPIC_API_KEY missing');
  const anthropic = new Anthropic({ apiKey: anthropicKey });
  const userPrompt = `TAG: ${elementTag}\nHTML: ${elementHtml}\nCSS: ${elementCss}\nINSTRUCTION: ${instruction}`;

  let lastError = null;
  for (const model of CLAUDE_MODEL_CANDIDATES) {
    try {
      const response = await anthropic.messages.create({
        model, max_tokens: 4000, temperature: 0,
        system: EDITOR_SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userPrompt }]
      });
      let jsonStr = response.content[0].text.trim();
      if (jsonStr.includes('```')) {
        const m = jsonStr.match(/```(?:json)?\s*([\s\S]*?)(?:```|$)/i);
        if (m?.[1]) jsonStr = m[1].trim();
      }
      try {
        return {
          ...JSON.parse(jsonStr),
          aiUsage: { promptTokens: response.usage.input_tokens, completionTokens: response.usage.output_tokens, totalTokens: response.usage.input_tokens + response.usage.output_tokens, model }
        };
      } catch {
        return { action: 'html', html: response.content[0].text, summary: 'Applied AI response' };
      }
    } catch (err) {
      lastError = err;
    }
  }
  throw new Error(`Editor AI failed: ${lastError?.message}`);
};

// ─── MAGIC WRITE: DESCRIPTION SUGGESTION ─────────────────────────────────────────
// Uses callAIText → returns plain string (not HTML)
const generateDescriptionSuggestion = async ({ pageName, industry, projectDesc, currentPrompt }) => {
  const systemPrompt = `
You are a Landing Page Conversion Copywriter.
Write a compelling, specific business description for a landing page.
3-4 sentences max. Benefit-driven. No generic filler. No clichés.
Return ONLY the description text. No quotes, no labels, no formatting.
`;
  const userPrompt = `
PAGE: ${pageName}
INDUSTRY: ${industry}
BUSINESS CONTEXT: ${projectDesc || 'not provided'}
IMPROVE THIS (if provided): ${currentPrompt || 'none'}
Write the description now.
`;
  const result = await callAIText(systemPrompt, userPrompt);
  const text = result.text.trim();
  return { suggestion: text, text, aiUsage: result.aiUsage };
};

// ─── PROJECT SUGGESTIONS ──────────────────────────────────────────────────────────
const generateProjectSuggestions = async ({ projectName, industry, projectDescription, services, pageTitles }) => {
  const systemPrompt = `
You are a digital marketing strategist.
Return ONLY a valid JSON array — no markdown, no explanation.
Format: [{"title": "Page Name", "description": "Goal and audience in one sentence"}]
`;
  const userPrompt = `
PROJECT: ${projectName} | INDUSTRY: ${industry}
DESCRIPTION: ${projectDescription}
${services?.length ? `SERVICES: ${services.join(', ')}` : ''}
${pageTitles?.length ? `AVOID DUPLICATING THESE: ${pageTitles.join(', ')}` : ''}
Generate 6 unique landing page ideas targeting different segments or conversion goals.
`;
  const result = await callAIText(systemPrompt, userPrompt);
  try {
    return JSON.parse(result.text.trim().replace(/```json|```/g, '').trim());
  } catch {
    logger.error('Failed to parse project suggestions');
    return [];
  }
};

// ─── STRATEGIC STRUCTURE ──────────────────────────────────────────────────────────
const generateStrategicStructure = async (input) => {
  const systemPrompt = `You are a CRO specialist. Return ONLY valid JSON: {"sections": [{"type": "...", "goal": "...", "keyMessage": "..."}]}. No markdown.`;
  const userPrompt = `BUSINESS: ${input.businessName} | INDUSTRY: ${input.industry}\nDESCRIPTION: ${input.businessDescription}\n${input.services?.length ? `SERVICES: ${input.services.join(', ')}` : ''}`;
  const result = await callAIText(systemPrompt, userPrompt);
  try {
    return { plan: JSON.parse(result.text.trim().replace(/```json|```/g, '').trim()), aiUsage: result.aiUsage };
  } catch {
    return { plan: { sections: [] }, aiUsage: result.aiUsage };
  }
};

// ─── OPTIMIZE STRUCTURE ───────────────────────────────────────────────────────────
const optimizeStrategicStructure = async ({ projectData, scrapedData, existingPage }) => {
  const systemPrompt = `You are a CRO specialist. Return ONLY valid JSON: {"sections": [...], "improvements": [...]}. No markdown.`;
  const userPrompt = `PROJECT: ${JSON.stringify(projectData)}\nSCRAPED: ${JSON.stringify(scrapedData)}\nEXISTING: ${JSON.stringify(existingPage)}`;
  const result = await callAIText(systemPrompt, userPrompt);
  try {
    return { plan: JSON.parse(result.text.trim().replace(/```json|```/g, '').trim()), aiUsage: result.aiUsage };
  } catch {
    return { plan: { sections: [] }, aiUsage: result.aiUsage };
  }
};

// ─── EXPORTS ──────────────────────────────────────────────────────────────────────
module.exports = {
  generateLandingPageContent,
  improveSectionContent,
  editorChatModify,
  generateDescriptionSuggestion,
  generateProjectSuggestions,
  generateStrategicStructure,
  optimizeStrategicStructure,
  callAIText   // exported for use by detectIndustryWithAI in analyzeService
};