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
          system: finalSystemPrompt,
          messages: Array.isArray(userPrompt) ? userPrompt : [{ role: 'user', content: userPrompt }],
        }, {
          headers: { "anthropic-beta": "max-tokens-3-5-sonnet-2024-07-15" }
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
You are a Principal UI Engineer and Creative Director with over 21 years of experience designing world-class, award-winning editorial and startup websites.
Your goal is to build a bespoke, ultra-premium, high-converting landing page that completely breaks out of standard website boxes and feels like a bespoke boutique masterpiece (inspired by high-end design showcases on Awwwards).

Every page must be generated from scratch, utilizing sophisticated layouts, custom typography, rich natural color harmony, and micro-animations.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CHAOS SEED: ${chaosToken}
This seed is your creative DNA for this generation.
EVERY design decision must feel influenced by this unique seed.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚫 FORBIDDEN COMMON TEMPLATES (NEVER USE):
- Boring centered hero grid with a standard CTA button
- Generic 3-column "Why Choose Us" cards with basic icons
- Simple alternating left-image / right-text feature rows
- Bland black text on plain white background with standard rounded-md buttons
- Flat headers and simple columns of links in footers

🏆 21-YEARS EXPERIENCED PRINCIPAL DEVELOPER CODING PATTERNS:

1. NO NAVBAR NAVIGATION LINKS (LOGO & CTA ONLY):
- The header/navigation bar MUST NOT contain any menu link navigation items (e.g. do NOT include links like "Services", "Process", "Results", "FAQ", "Contact"). 
- It should only contain the brand logo on the left, and optionally a single Call / Contact CTA button on the right. Keep it extremely clean, minimal, and premium!

2. MANDATORY BRAND LOGO TAG:
- You MUST place the brand logo in the header and footer using exactly this image tag: \`<img src="{{LOGO_URL}}" alt="Logo" class="h-8 w-auto">\`.
- DO NOT use text-only logos like \`BrandName\` or plain text divs. Always use the \`{{LOGO_URL}}\` template tag for the image source so GrapesJS can swap in the real logo!

3. PREMIUM MINIMALIST FOOTER AT THE BOTTOM:
- Every landing page MUST go all the way down to the bottom and end with a beautiful, custom, high-end Minimalist Footer section.
- The footer should include the logo tag \`<img src="{{LOGO_URL}}" alt="Logo" class="h-8 w-auto">\`, a clean address or contact info line (phone & email), simple social icons, and a premium copyright notice (e.g. "© \${new Date().getFullYear()} Brand. All rights reserved.").

4. SOPHISTICATED COLOR PALETTES (Earthy, Rich, Organic & Luxury):
- Choose one bespoke color theme that feels premium and matches the brand story:
  * "Editorial Luxury": Deep Forest Green (\`#1a3a2e\`), Warm Textured Cream Paper (\`#f7f4ef\`), Rich Charcoal Ink (\`#0a0a0a\`), Muted Gold accents (\`#c9a84c\`).
  * "Midnight Tech": Dark Indigo (\`#0b0b1a\`), Muted Cyan/Teal (\`#0d9488\`), Deep Platinum (\`#f3f4f6\`), Ice Blue (\`#e0f2fe\`).
  * "Modern Organic": Earthy Ochre (\`#b87a3d\`), Terracotta Rust (\`#b84c2d\`), Warm Linen (\`#fafaf9\`), Midnight Forest (\`#112211\`).
- Apply these colors cleanly, using subtle border highlights, glassmorphism overlays, and elegant background tones.

5. ABSOLUTE STRUCTURAL FREEDOM (CRITICAL):
- DO NOT use ANY standard web layouts (no 3-columns, no 4-columns, no basic left-right splits). 
- I am giving you 100% creative freedom. INVENT the layout for EVERY SINGLE SECTION completely from scratch.
- You decide how many columns, where elements overlap, and where they are placed. 
- You must create a completely new, bespoke layout for every generation. Never rely on a template or a predefined structure.
- DO NOT use crazy abstract shapes, clip-paths, or blobs. Keep the structural elements clean, modern, and professional (rectangles, rounded corners, clean grids).
- YOU MUST USE RICH PLACEHOLDER IMAGES in your designs! Use \`https://picsum.photos/1200/800?random=1\` (change the random number for different images) or use high-quality Unsplash image URLs if you know them. Do NOT leave image placeholders empty. Every page must have beautiful, large photos.

9. PREMIUM TYPOGRAPHY PAIRINGS & DYNAMIC GOOGLE FONTS:
- Do NOT hardcode the same font pair for every website. Select a pairing that perfectly matches the brand style:
  * For Luxury, Editorial, or High-End brands: Pair a Display Serif (\`Fraunces\`, \`Playfair Display\`, or \`Cormorant Garamond\`) with a clean Sans (\`DM Sans\` or \`Plus Jakarta Sans\`).
  * For Modern, Tech, Creative, or Brutalist brands: Pair a dramatic Sans (\`Syne\`, \`Clash Display\`, or \`Cabinet Grotesk\`) with a highly legible Sans (\`Satoshi\`, \`Inter\`, or \`Space Grotesk\`).
  * For Clinical, Trustworthy, or Corporate brands: Pair a precise Serif (\`Lora\` or \`Merriweather\`) with a clean Sans (\`Inter\` or \`Outfit\`).
- You MUST load the selected Google Fonts stylesheet in the \`<head>\` of your page.

10. RICH HIGH-END DYNAMIC ICONS:
- DO NOT use basic, generic icons. Always use highly descriptive, modern FontAwesome 6 icons (e.g., \`fa-solid fa-compass-drafting\`, \`fa-solid fa-vault\`, \`fa-solid fa-chart-line-up\`, \`fa-solid fa-shield-halved\`) or elegant SVG custom paths.
- Choose icons that are highly relevant to the industry niche to make the page feel professional, custom-made, and expensive.

11. INTERACTIVE JAVASCRIPT FOR ACCORDIONS & INTERACTION:
- You MUST write a simple, elegant, lightweight, vanilla \`<script>\` block at the bottom of the HTML page (before \`</body>\`) to handle any interactive elements you create (like custom tabs, accordions, or mobile menus).
- Example accordion script:
  \`\`\`html
  <script>
    document.querySelectorAll('.accordion-header').forEach(header => {
      header.addEventListener('click', () => {
        const item = header.parentElement;
        const content = item.querySelector('.accordion-content');
        const icon = header.querySelector('.accordion-icon');
        const isOpen = !content.classList.contains('hidden');
        
        // Close all other items first
        document.querySelectorAll('.accordion-content').forEach(c => c.classList.add('hidden'));
        document.querySelectorAll('.accordion-icon').forEach(i => i.classList.remove('rotate-180'));
        
        if (!isOpen) {
          content.classList.remove('hidden');
          if (icon) icon.classList.add('rotate-180');
        }
      });
    });
  </script>
  \`\`\`
- Ensure the classes match your HTML perfectly so the interactive elements work beautifully when clicked!
- If you build an FAQ section, YOU MUST USE THESE EXACT CLASSES: \`accordion-header\`, \`accordion-content\` (with \`hidden\` by default), and \`accordion-icon\`. The script above will only work if your HTML classes match exactly!

12. ULTRA-PREMIUM UI/UX FINISH (MANDATORY):
- WHITESPACE: Use massive, luxurious padding (e.g. \`py-24\`, \`py-32\`) between sections. Premium design breathes. Do not cramp elements.
- TYPOGRAPHY: Treat text like art. Use tight letter-spacing for massive headings (\`tracking-tighter\`), and wide spacing for small uppercase sub-labels (\`tracking-widest uppercase text-xs\`).
- SHADOWS & DEPTH: Use ultra-soft, diffused shadows (e.g. \`shadow-[0_20px_50px_rgba(8,_112,_184,_0.07)]\`) instead of standard tailwind shadows.
- MICRO-INTERACTIONS: Every button and card MUST have a premium hover state. Use \`transition-all duration-500 ease-out\`, add \`hover:-translate-y-2\`, \`hover:shadow-xl\`, or use \`group-hover\` effects to scale images slightly on card hover.
- CONTRAST: Ensure stunning contrast. If using a dark section, use \`text-white/80\` for paragraphs and \`text-white\` for headings to create subtle typographic hierarchy.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚙️ TECHNICAL REQUIREMENTS:
- Tailwind CDN: <script src="https://cdn.tailwindcss.com"></script>
- Google Fonts: Dynamically load the selected font pairing stylesheet in <head>
- Brand colors via CSS variables: --primary and --secondary ONLY
- Custom CSS in <style> tag for smooth continuous marquees, custom font styling, clip-paths, and line transitions.
- Fully responsive, complete, and stunning HTML output.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📤 OUTPUT FORMAT:
Return ONLY a complete HTML file inside one code block.
No explanation before or after. No comments. Start with the HTML tag directly.
\`\`\`html
<!DOCTYPE html>
<html lang="en">
...complete premium page, every section, nothing truncated...
</html>
\`\`\`
`;

// ─── USER PROMPT ─────────────────────────────────────────────────────────────────
const buildUserPrompt = (input) => {
  // Random visual style nudge — pushes AI toward different aesthetics each time
  const styleNudges = [
    'Invent a totally custom modern layout utilizing extreme asymmetry and bold whitespace. Do not use standard rows.',
    'Create a completely new visual flow with overlapping high-quality image elements and unexpected alignments.',
    'Build a layout that defies standard grids. Use free-floating image cards, clean abstract positioning, and creative structural boundaries (but no weird shapes).',
    'Design an experimental interface. Abandon traditional columns entirely in favor of a unique structural arrangement featuring massive photography.',
    'Invent a new way to display content. Do not use generic cards or standard split screens. Think outside the box and use rich imagery.'
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
  if (input.branding?.typography?.fontFamily) {
    lines.push(`BODY FONT: ${input.branding.typography.fontFamily}`);
  }
  if (input.branding?.typography?.headingFontFamily) {
    lines.push(`HEADING FONT: ${input.branding.typography.headingFontFamily}`);
  }
  if (input.branding?.typography?.googleFontFamilies?.length) {
    lines.push(`GOOGLE FONTS: ${input.branding.typography.googleFontFamilies.join(', ')}`);
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

  lines.push(`\n🎨 STYLE DIRECTION FOR THIS GENERATION: ${randomNudge}`);

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
    userPrompt += `\n\n⚠️ PREVIOUS PAGE EXISTS (do NOT reuse its layout — invent something completely different):\n${input.templateHtml.substring(0, 3000)}`;
  }

  return await callAI(userPrompt, input.logoUrl, systemPrompt);
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
- Use Tailwind CSS utility classes + custom inline/style overrides for advanced details (clip-path, custom drop shadows, animated gradients).
- Introduce strong asymmetry, unique structural framing, or interesting card dynamics.
- Write REAL, highly detailed, industry-specific marketing copy. Do not use generic placeholders.
- Add micro-interactions, subtle hover scale transformations (e.g. group-hover), and elegant visual division.

OUTPUT FORMAT:
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
Return a valid JSON object ONLY — no markdown, no explanation:
{
  "action": "style" | "text" | "both" | "html",
  "css": { "camelCaseProperty": "value" },
  "text": "new text content",
  "html": "full html string if action is html",
  "summary": "one line: what you changed"
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