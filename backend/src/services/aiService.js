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

5. CINEMATIC HERO SPLIT & OVERLAPPING METRICS:
- Structure a dynamic 2-column hero split:
  * Left Column: Rich background color (e.g. Deep Forest or Charcoal), a glowing luxury subtitle badge with a custom symbol (e.g., "✦ EXPERTISE"), a massive bold title using elegant font styling (with italicized accent words: \`em { font-style: italic; color: var(--gold); }\`), and customized CTA buttons.
  * Right Column: Light textured background displaying a massive, low-contrast, stylized background experience/client number (e.g., "32" or "10" using clamp font sizing and light text color) to act as a background element. Place a grid of actual metrics (with vertical border highlights) and a beautiful floating premium contact/lead card overlapping it.

6. CONTINUOUS BRAND TICKER / MARQUEE:
- Include a sleek, seamless loop brand marquee ticker block with a slow linear scroll animation, dividing the Hero from the content. It must slide continuously with logos/names and stars.

7. DYNAMIC STAGGERED NODE TIMELINE:
- For process or services sections, build a responsive staggered vertical timeline.
- Draw a central vertical highlight line, and alternate rows left/right. Place custom interactive node dots in the center that expand and transform on hover (\`group-hover:scale-110 group-hover:bg-gold\`). On mobile, cleanly collapse this into a left-aligned vertical layout.

8. STACKED MAGAZINE TESTIMONIALS:
- Design an asymmetric layout with one massive featured testimonial block (featuring large absolute-positioned quote marks \`content: '"'; font-size: 180px;\` and outcome tags) alongside a grid of smaller author review cards.

9. SIDE-STICKY FAQ & SMOOTH ACCORDIONS:
- Split the FAQ section: a left sticky panel displaying a large dramatic title and a direct CTA link, and a right panel containing clean, interactive accordions with custom rotation triggers on toggle.

10. PREMIUM TYPOGRAPHY PAIRINGS & DYNAMIC GOOGLE FONTS:
- Do NOT hardcode the same font pair for every website. Select a pairing that perfectly matches the brand style:
  * For Luxury, Editorial, or High-End brands: Pair a Display Serif (\`Fraunces\`, \`Playfair Display\`, or \`Cormorant Garamond\`) with a clean Sans (\`DM Sans\` or \`Plus Jakarta Sans\`).
  * For Modern, Tech, Creative, or Brutalist brands: Pair a dramatic Sans (\`Syne\`, \`Clash Display\`, or \`Cabinet Grotesk\`) with a highly legible Sans (\`Satoshi\`, \`Inter\`, or \`Space Grotesk\`).
  * For Clinical, Trustworthy, or Corporate brands: Pair a precise Serif (\`Lora\` or \`Merriweather\`) with a clean Sans (\`Inter\` or \`Outfit\`).
- You MUST load the selected Google Fonts stylesheet in the \`<head>\` of your page.

11. RICH HIGH-END DYNAMIC ICONS:
- DO NOT use basic, generic icons. Always use highly descriptive, modern FontAwesome 6 icons (e.g., \`fa-solid fa-compass-drafting\`, \`fa-solid fa-vault\`, \`fa-solid fa-chart-line-up\`, \`fa-solid fa-shield-halved\`) or elegant SVG custom paths.
- Choose icons that are highly relevant to the industry niche to make the page feel professional, custom-made, and expensive.

12. INTERACTIVE JAVASCRIPT FOR ACCORDIONS & INTERACTION:
- You MUST write a simple, elegant, lightweight, vanilla \`<script>\` block at the bottom of the HTML page (before \`</body>\`) to handle the FAQ accordion click events and any other interactive elements.
- Example accordion script:
  \`\`\`html
  <script>
    document.querySelectorAll('.faq-accordion-header').forEach(header => {
      header.addEventListener('click', () => {
        const item = header.parentElement;
        const content = item.querySelector('.faq-accordion-content');
        const icon = header.querySelector('.faq-icon');
        const isOpen = !content.classList.contains('hidden');
        
        // Close all other items first
        document.querySelectorAll('.faq-accordion-content').forEach(c => c.classList.add('hidden'));
        document.querySelectorAll('.faq-icon').forEach(i => i.classList.remove('rotate-180'));
        
        if (!isOpen) {
          content.classList.remove('hidden');
          if (icon) icon.classList.add('rotate-180');
        }
      });
    });
  </script>
  \`\`\`
- Ensure the classes match your HTML perfectly so the accordions expand and collapse beautifully when clicked!

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
    'Make the hero dark and dramatic with a bold full-bleed visual.',
    'Use a magazine-editorial layout with large imagery and strong typography.',
    'Design around whitespace — minimal, precise, every element intentional.',
    'Use a split-screen layout with strong color contrast between panels.',
    'Make it feel like a premium luxury brand — dark palette, gold accents, refined.',
    'Use bold oversized typography as the main visual element in the hero.',
    'Create a diagonal/angled design — clip-paths and skewed sections throughout.',
    'Go glassmorphism — deep gradient background with frosted glass cards.',
    'Make it feel like a tech startup — dark mode, neon accents, monospace details.',
    'Use an organic/warm design — earthy tones, rounded shapes, human imagery.',
    'Make the hero a full-viewport image with overlay text and dramatic gradient.',
    'Use a horizontal timeline for the process section — unexpected and engaging.',
    'Design with a retro/brutalist feel — bold outlines, flat colors, strong grid.',
    'Use floating cards layered over each other for a 3D depth effect.',
    'Make it feel trustworthy and clinical — clean white, precise layout, authority.',
  ];
  const randomNudge = styleNudges[Math.floor(Math.random() * styleNudges.length)];

  const lines = [
    `BUSINESS NAME: ${input.businessName}`,
    `INDUSTRY: ${input.industry}`,
    `PAGE GOAL: ${input.pageType || 'lead generation'}`,
    `PRIMARY COLOR: ${input.primaryColor || '#7c3aed'}`,
    `SECONDARY COLOR: ${input.secondaryColor || '#6366f1'}`,
    `LOGO: {{LOGO_URL}}`,
    `\n🎨 STYLE DIRECTION FOR THIS GENERATION: ${randomNudge}`,
  ];

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
1. INVENT the layout — do NOT copy any known template pattern
2. Your hero MUST follow the STYLE DIRECTION above
3. Name your visual concept in an HTML comment at the top: <!-- CONCEPT: ... -->
4. Every section must look visually different from the one before it
5. Write REAL, industry-specific copy — not generic filler text
6. Form fields must match this industry's actual customer needs
7. Include hover animations, scroll reveals, at least one premium effect
8. Complete every section — NEVER truncate or leave a placeholder
9. You MUST generate exactly these 7 components in this order: Floating Header → Cinematic Hero Split → Brand Marquee Ticker → Staggered Node Timeline → Stacked Testimonials → Side-Sticky FAQ with Accordions → Premium Minimalist Footer. 
10. The Premium Minimalist Footer must be the absolute bottom-most visual element of the page, followed by your accordion interaction script and the closing \`</html>\` tag. Do NOT stop writing before finishing the footer and closing all HTML tags.
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
    'Use diagonal clip-path boundaries and dynamic overlapping card containers.',
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
  optimizeStrategicStructure
};