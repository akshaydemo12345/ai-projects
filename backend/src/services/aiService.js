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

// ─── DESIGN DNA ENGINE ───────────────────────────────────────────────────────────
// Generates a completely unique design blueprint on EVERY call.
// No two generations will share the same layout, mood, or visual style.
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const pickN = (arr, n) => [...arr].sort(() => Math.random() - 0.5).slice(0, n);

const layoutPools = {
  'TRUST-BAR': [
    'Marquee continuous scroll with 5-6 sleek brand logo badges with grayscale hover-to-color transition.',
    'Asymmetric horizontal strip featuring 4 clean minimal typography badges separated by vertical glowing lines.',
    'Frosted translucent strip overlapping the Hero background with clean vector trust icons.'
  ],
  'PROBLEM-STATEMENT': [
    'Asymmetric split-row: Left side has a massive italic bold statement, right side has 3 clean bullet cards detailing friction points.',
    'Minimal brutalist design: Large oversized block letters for the main struggle, single highlighted line, and generous whitespace.',
    'Bento layout: 3 cards showing "Friction, Stagnation, Loss" with custom dark border glows.'
  ],
  'SOLUTION-GRID': [
    '3-Column staggered masonry: Each card has varying height, custom hover transform lift, and electric border outlines.',
    'Asymmetrical 2-column list: Left column is sticky with value proposition text, right column flows 4 detailed premium feature cards.',
    'Interactive circular glow circles containing feature lists with glassmorphism backgrounds.'
  ],
  'SOCIAL-PROOF': [
    'Staggered grid of 3 testimonials with floating circular author avatars, translucent cards, and a subtle glowing backdrop.',
    'Oversized clean single-quote layout: 1 main highly compelling quote in Instrument Serif, italic, 3.5rem size, with founder signature.',
    'Bento box array containing review scores, trust pilot rating widget, and user stories.'
  ],
  'PRICING': [
    'Asymmetric pricing cards: 3 cards where the center "Popular" card has a huge floating badge, negative margins, and glowing gradient border.',
    'Ultra-clean list-based pricing tier: Simple minimal rows with pricing on the right, list of features on the left, separated by dotted leader lines.',
    'Horizontal split banner: High-contrast single custom package pricing.'
  ],
  'HOW-IT-WORKS': [
    'Staggered timeline step flow: Custom dotted vertical line down the center with alternating left/right step card blocks.',
    'Horizontal process track: 3 large numbered circles (01, 02, 03) in bold serif typography connected by elegant gradient progress arrows.',
    'Asymmetric grid layout: 3 unequal cards representing steps, each with custom abstract vector background details.'
  ],
  'CASE-STUDY': [
    'Splitscreen layout: Left side contains a large client outcome metric (e.g., +147% ROI) in clamp font size, right side explains the method.',
    'Sleek mock-up display: Floating browser mock-up card overlapping a background grid with dynamic shadow and outline lines.',
    'Grid of 2 asymmetrical highlight panels detailing the challenge, strategy, and result.'
  ],
  'TRANSFORMATION': [
    'Before/After split layout: Left card (Before) in muted grayscale styling, right card (After) in vibrant primary color gradients.',
    'Timeline process card: Asymmetrical timeline showing the shift from pain to positive outcome with smooth border transitions.',
    'Sleek progress bar visualization showcasing dynamic percentage metric growth.'
  ],
  'SERVICES-BENTO': [
    'Asymmetric Bento Grid: 5 premium cards of distinct dimensions displaying specific services, using glassmorphic blurs.',
    'Minimal list strip: 4 massive horizontal service rows that expand on hover with thin dividers.',
    'Grid of staggered border-radius cards with glowing electric vector outlines.'
  ],
  'FAQ-ACCORDION': [
    'Clean left-split column: Left column contains the heading "Got Questions?", right column lists 4-5 native <details> accordion rows.',
    'Centered layout: 5 stacked translucent <details> accordion containers with custom shadow hover and rotating chevron indicators.',
    'Grid layout: 2 columns of beautiful native <details> accordion boxes styled with minimalist bottom borders.'
  ],
  'STATS-STRIP': [
    'Bold horizontal metrics row: 4 large numbers in giant bold font with minimal text captions below, separated by micro vertical border lines.',
    'Floating stats cards: 3 distinct asymmetric cards with dark backgrounds, neon numeric labels, and colorful blur effects.',
    'Minimal editorial stats: Oversized percentage metrics set in clean grids with extremely generous whitespace.'
  ],
  'TESTIMONIALS': [
    'Sleek user review cards: 3 beautiful glassmorphic blocks with circular user faces, company tags, and deep premium drop-shadows.',
    'Oversized single testimonial: 1 main highly compelling customer quote in italic serif display font with bold founder branding.',
    'Asymmetric layout: Staggered row of glowing testimonial cards with individual star ratings.'
  ],
  'TESTIMONIALS-GRID': [
    'Masonry grid of 6 diverse user review cards with different heights and translucent white borders.',
    'Asymmetric cards array: 4 glass blocks staggered with colorful overlay glow points.',
    'Horizontal scroll block: A slider look containing 5 testimonials with hover glow scale animations.'
  ],
  'TRUST-SIGNALS': [
    'Minimal grid featuring 4 certification badges, security labels, and guarantee marks with beautiful neon glow outlines.',
    'Horizontal trust bar: Sleek continuous list of badges with custom borders.',
    'Asymmetric list showing industry achievements, ratings, and active trust metrics.'
  ],
  'CTA-BANNER': [
    'Cinematic pre-footer panel: High-contrast centered heading with a massive outline call-to-action button, background glow blurs, and glass layers.',
    'Splitscreen CTA banner: Left side value proposition, right side sleek single-field email opt-in input.',
    'Asymmetrical curved block with high-end neon outline accents.'
  ],
  'URGENCY-STRIP': [
    'Minimal banner with active limited offer tag, custom static count-down numbers block, and a glowing CTA.',
    'Horizontal floating ticker with real-time text announcements and micro-button.',
    'Vibrant primary colored high-contrast strip with sliding action text.'
  ],
  'PAIN-POINTS': [
    'Clean list format: 4 stark problem statements in giant serif typography, each with an icon marker and clean divider.',
    'Asymmetrical grids showing 3 critical industry problems with custom colored bullet details.',
    'Editorial dark row detailing current market failures with minimalist structural alignment.'
  ],
  'MANIFESTO-HERO': [
    'Oversized statement grid: Giant, bold uppercase text detailing the company mission with custom accent background shadows.',
    'Minimal editorial page entry with a single striking image block and huge headline.',
    'Splitscreen manifesto with left bold values list and right large graphic element.'
  ],
  'CINEMATIC-HERO': [
    'Edge-to-edge dark backdrop video-style canvas with oversized typography and glassmorphic floating CTA.',
    'Diagonal sliced hero layout with a high-fidelity image composition.',
    'Atmospheric neon glow hero with a centered focus card.'
  ],
  'METHODOLOGY': [
    'Step-by-step progress cards: 3 clean vertical panels showing phases of work with thin horizontal connector lines.',
    'Asymmetrical process flow with staggered details and glowing labels.',
    'Editorial bento layout detailing the approach in 4 rich text tiles.'
  ]
};

const generateDesignDNA = () => {
  const heroStyles = [
    'SPLIT-SCREEN: left text + right full-bleed image (60/40 split)',
    'FULL-BLEED CINEMATIC: edge-to-edge background image with dark overlay, headline centered',
    'ASYMMETRIC OFFSET: headline top-left, CTA bottom-right, image floats in middle breaking the grid',
    'DIAGONAL CUT: background sliced at 8deg angle, text left, abstract shape right',
    'MAGAZINE EDITORIAL: large oversized serif headline, small image top-right, subtext at bottom',
    'MINIMAL TYPOGRAPHIC: no image, giant bold statement, single accent line, brutal whitespace',
    'STACKED LAYERS: headline above fold, image below bleeding into next section',
    'SIDEBAR HERO: fixed left sidebar nav + massive scrollable right content area',
    'GLASSMORPHISM CARD: blurred glass panel floating over gradient mesh background',
    'BENTO GRID HERO: 4-6 asymmetric cards forming the hero, each with micro-content',
    'VIDEO LOOP STYLE: dark background with autoplay-style static frame + pulsing glow effects',
    'FLOATING ISLAND: content on elevated card with deep shadow, background is solid bold color',
  ];

  const colorMoods = [
    'DARK MODE LUXE: near-black backgrounds (#0a0a0f), neon accent highlights, white text',
    'LIGHT AIRY: white and pale backgrounds, soft pastels, minimal color, clean space',
    'BOLD CONTRAST: pitch black sections alternating with pure white, striking color pops',
    'EARTH TONES: warm creams, terracotta, deep olive, feels organic and premium',
    'NEON CYBER: dark purple/navy base with electric green or cyan accents',
    'MONOCHROME GRADIENT: single hue from light to dark across the page',
    'WARM SUNSET: amber, deep orange, coral, feels energetic and human',
    'CORPORATE ELEVATED: deep navy, sharp white, subtle gold/silver accents, trustworthy',
    'FROSTED GLASS: translucent panels, muted backgrounds, light refractions',
    'DEEP JEWEL: emerald, sapphire, amethyst tones — rich and opulent',
  ];

  const layoutGrids = [
    'ASYMMETRIC: most sections break grid — content intentionally misaligned for dynamic feel',
    'MASONRY: image and text blocks cascade in uneven column layout',
    'FULL-WIDTH ALTERNATING: each section flips — image left/text right, then text left/image right',
    'CARD GRID: 2-col on desktop, flowing cards with varied heights and hover states',
    'TIMELINE VERTICAL: content flows down a center line with alternating left/right items',
    'MAGAZINE LAYOUT: some sections occupy 70% width, others 100%, creates editorial rhythm',
    'BENTO BOXES: sections divided into asymmetric grid boxes of varying sizes',
    'COLUMN SPLIT: persistent 2-column layout where left is sticky and right scrolls',
    'DIAGONAL BANDS: sections have clipped diagonal edges between them',
    'OVERLAPPING ELEMENTS: images and text elements overlap section boundaries for depth',
  ];

  const typographyMoods = [
    'BRUTALIST: massive font sizes (clamp 4rem-10rem), tight line-height, uppercase weight',
    'ELEGANT SERIF: mix of serif display font for headings + clean sans for body',
    'GEOMETRIC SANS: ultra-clean, uniform weight, generous tracking on headings',
    'EDITORIAL: large italic headlines, small caps for labels, varied font weights',
    'HUMANIST: warm rounded fonts, conversational sizing, approachable feel',
    'TECH MONO: monospace accents for data/numbers, sans-serif for prose',
  ];

  const formPlacements = [
    'CONTACT-SECTION: Do NOT put any form in the Hero. Place a beautiful high-converting button in Hero linking to `#lead-form`. Put the lead capture form in a dedicated visual contact section near the bottom of the page.',
    'SPLIT-HERO-RIGHT: Place the form in the Hero section, on the right side of the screen as a floating card.',
    'MID-SECTION-BENTO: Place the form in the middle of the page (Section 4 or 5) inside a Bento Grid box with glowing border shadows.',
    'PRE-FOOTER-CTA: Place the form inside a cinematic full-width pre-footer banner section with a dark premium gradient background.',
    'ASYMMETRIC-FLOATING: Place the form as a floating offset section overlapping the services and testimonials grid.'
  ];

  const formStyles = [
    'GLASSMORPHIC CARD: Glassmorphic form (backdrop-blur-md, border border-white/10, subtle white/5 background) with sleek input outlines.',
    'MINIMALIST BORDERS: Form with transparent background, pure bottom-borders (border-b-2) on inputs, and glowing neon submit button.',
    'DARK CONTRAST: High-contrast form with solid deep background, bright inputs, and custom colored labels.',
    'EDITORIAL BOX: Clean grid form with heavy borders (border-2 border-black/80), serif labels, and a solid block shadow button.',
    'NEON GLOW: Dark futuristic card with subtle neon border glow, rounded inputs, and electric color gradients.'
  ];

  const sectionSequences = [
    ['TRUST-BAR', 'HERO', 'PROBLEM-STATEMENT', 'SOLUTION-GRID', 'SOCIAL-PROOF', 'FORM-SECTION', 'PRICING', 'MINIMALIST-FOOTER'],
    ['HERO', 'STATS-STRIP', 'HOW-IT-WORKS', 'CASE-STUDY', 'FORM-SECTION', 'TESTIMONIALS', 'FAQ-ACCORDION', 'MINIMALIST-FOOTER'],
    ['HERO', 'VIDEO-PROOF', 'FEATURE-DEEP-DIVE', 'COMPARISON-TABLE', 'FORM-SECTION', 'GUARANTEE', 'TRUST-SIGNALS', 'MINIMALIST-FOOTER'],
    ['HERO', 'PAIN-POINTS', 'TRANSFORMATION', 'SERVICES-BENTO', 'FORM-SECTION', 'REVIEWS', 'FAQ-ACCORDION', 'MINIMALIST-FOOTER'],
    ['MANIFESTO-HERO', 'WHO-WE-SERVE', 'METHODOLOGY', 'RESULTS', 'FORM-SECTION', 'PRESS-LOGOS', 'BADGES-ROW', 'MINIMALIST-FOOTER'],
    ['SPLIT-HERO', 'QUICK-WINS', 'PROCESS-STEPS', 'FORM-SECTION', 'TESTIMONIALS-GRID', 'CTA-BANNER', 'FAQ-ACCORDION', 'MINIMALIST-FOOTER'],
    ['CINEMATIC-HERO', 'NUMBERS', 'SERVICES-CAROUSEL', 'FOUNDER-STORY', 'FORM-SECTION', 'TRUST-SIGNALS', 'FAQ-ACCORDION', 'MINIMALIST-FOOTER'],
    ['HERO', 'INTERACTIVE-TABS', 'BEFORE-AFTER', 'BADGES', 'FORM-SECTION', 'URGENCY-STRIP', 'FAQ-ACCORDION', 'MINIMALIST-FOOTER'],
  ];

  const selectedSequence = pick(sectionSequences);

  return {
    heroStyle: pick(heroStyles),
    colorMood: pick(colorMoods),
    layoutGrid: pick(layoutGrids),
    typographyMood: pick(typographyMoods),
    formPlacement: pick(formPlacements),
    formStyle: pick(formStyles),
    sectionSequence: selectedSequence,
    sectionCount: selectedSequence.length,
    mustInclude: pickN(['a bold stat strip with 3-4 metrics', 'a quote-style testimonial with photo', 'a 3-step process visualization', 'a comparison or before/after block', 'a guarantee or trust badge row', 'a founder or team mini-bio', 'an FAQ accordion', 'a pricing or package display', 'a case study or result highlight'], 3),
  };
};

// ─── SYSTEM PROMPT ───────────────────────────────────────────────────────────────
const buildSystemPrompt = (chaosToken, designDNA, sectionVisualMap) => `
You are a world-class UI/UX Design Director, Conversion Architect, and Senior Frontend Developer.

RANDOMNESS SEED: ${chaosToken}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎨 DESIGN DNA — MANDATORY BLUEPRINT FOR THIS GENERATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
These are NOT suggestions. You MUST implement every single one of these exactly.

🦸 HERO STYLE: ${designDNA.heroStyle}
🎨 COLOR MOOD: ${designDNA.colorMood}
📐 LAYOUT GRID: ${designDNA.layoutGrid}
✍️  TYPOGRAPHY: ${designDNA.typographyMood}
🔘 FORM PLACEMENT: ${designDNA.formPlacement}
🎨 FORM STYLE: ${designDNA.formStyle}

📋 MANDATORY SECTION-BY-SECTION VISUAL MAP:
${sectionVisualMap.map(line => `   - ${line}`).join('\n')}

🔒 YOU MUST ALSO INCLUDE THESE 3 UNIQUE ELEMENTS:
${designDNA.mustInclude.map((m, i) => `   ${i + 1}. ${m}`).join('\n')}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚨 NO NAVIGATION MENU IN HEADER/NAVBAR HARD RULE:
- The header/navbar MUST NOT contain a navigation menu or links (Do NOT generate list items, hamburger dropdown lists, or anchors for 'Home', 'About', 'Services', 'Pricing', etc.). 
- The header/navbar should ONLY contain the brand logo on the left, and a single prominent high-converting Call-to-Action (CTA) Button on the right (e.g. "Get Started" or "Book a Call"). 
- This keeps the layout ultra-clean, modern, distraction-free, and dramatically improves conversions!

🚨 TOKEN OPTIMIZATION & INLINE ICONS STRATEGY (PREVENT TRUNCATION):
- To ensure the entire landing page generates fully from the Hero all the way down to the Footer without getting cut off early:
- You are STRONGLY FORBIDDEN from generating custom inline SVG <path> codes for decorative graphics or icons. Large SVG vector blocks consume massive amounts of output tokens and cause early truncation.
- Instead, you MUST use standard FontAwesome icons (e.g., <i class="fa-solid fa-check text-xl"></i>, <i class="fa-solid fa-rocket"></i>, <i class="fa-solid fa-phone"></i>, <i class="fa-solid fa-chevron-down"></i>) which are already fully loaded and supported in the environment.
- Keep the page HTML clean, lightweight, punchy, and highly conversion-optimized.

🚨 SECTION UNIQUE STYLING HARD RULE:
- You are FORBIDDEN from repeating any layout style, structure, or card grid design between sections. Every single section MUST have a totally unique layout, visual density, and alignment as specified in the SECTION-BY-SECTION VISUAL MAP.
- For example, if Section 3 uses a 3-column card grid, Section 4 must NOT use a 3-column card grid; it must use an asymmetric split row, bento grid, timeline, or horizontal strip. Every section must have a unique layout signature!

🚨 CRITICAL RULES FOR FORM PLACEMENT & STYLING (WOW FACTOR):
1. FORM PLACEMENT HARD RULE:
   - If FORM PLACEMENT is "CONTACT-SECTION", you are FORBIDDEN from putting a form in the Hero. The Hero MUST contain a stunning CTA button linking to "#lead-form" and the form MUST be in the bottom "FORM-SECTION".
   - If FORM PLACEMENT is "SPLIT-HERO-RIGHT", you MUST place the form inside a floating card layout in the Hero section on the right side.
   - If FORM PLACEMENT is "MID-SECTION-BENTO", the Hero section has NO form; instead place the form in the middle of the page (Section 5 or 6) inside a beautiful asymmetric grid box.
2. FORM DESIGN DIVERSITY:
   - Never write the same form style. You must implement the "${designDNA.formStyle}" style perfectly with beautiful, custom styled input elements.
   - Include relevant fields (e.g. name, email, phone, custom message/dropdown specific to this industry).
   - Submit buttons must have smooth transitions and active hover glows.

🚨 NO-SCRIPT ACCORDION & FAQ RULE:
- For accordions, FAQ grids, or toggle tabs, you are FORBIDDEN from writing custom Javascript click handlers (like document.querySelectorAll). GrapesJS sandboxes block custom scripts from executing.
- Instead, you MUST use native HTML5 <details> and <summary> elements styled beautifully with Tailwind!
- Example FAQ accordion pattern:
  <details class="group border-b border-black/10 py-6 cursor-pointer">
    <summary class="flex justify-between items-center font-semibold text-lg list-none">
      <span>Question text goes here?</span>
      <span class="transition-transform duration-300 group-open:rotate-180"><i class="fa-solid fa-chevron-down text-sm"></i></span>
    </summary>
    <div class="mt-4 text-black/60 leading-relaxed">
      Detailed answer text goes here.
    </div>
  </details>
- Using details/summary makes accordions 100% interactive instantly in both editor preview and live site without a single line of JS!

🚨 ULTRA-PREMIUM & "WOW-FACTOR" STYLING RULES:
1. TYPOGRAPHY PAIRINGS (Import these Google Fonts in your <style> tag):
   - If BRUTALIST: Import 'Syne' & 'Space Grotesk'
   - If ELEGANT SERIF: Import 'Instrument Serif' & 'Plus Jakarta Sans'
   - If GEOMETRIC SANS: Import 'Outfit' & 'Inter'
   - If EDITORIAL: Import 'Cormorant Garamond' & 'DM Sans'
   - If HUMANIST: Import 'Schibsted Grotesk' & 'Albert Sans'
   - If TECH MONO: Import 'JetBrains Mono' & 'Space Mono'
2. VISUAL DEPTH & ATMOSPHERE:
   - Always add 2-3 dynamic glowing background blur blobs (<div class="absolute rounded-full filter blur-[120px] opacity-20 pointer-events-none ...">) to create depth.
   - Never use standard borders; instead use semi-transparent borders with backdrop filters (backdrop-filter: blur(16px)) for high-end glassmorphism.
   - Ensure all cards have extremely refined shadows (e.g., shadow-[0_8px_30px_rgb(0,0,0,0.04)]).
3. MICRO-ANIMATIONS & HOVER STATES:
   - Every single interactive element (buttons, links, cards, icons) must have high-fidelity hover animations (e.g., transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-lg).
4. HIGH-END LAYOUT BLOCKS:
   - Use Bento grids with asymmetrical heights and rich imagery.
   - Use dynamic overlapping margins (e.g., -mt-20) to make elements float over boundaries seamlessly.
   - Use custom decorative SVG dividers or minimal vector lines instead of boring horizontal rules.

YOUR JOB:
Read the business. Understand the audience. Execute the Design DNA and premium rules above with surgical precision.

STRICT ANTI-TEMPLATE RULES:
- BANNED: hero → 3 feature cards → testimonials → CTA (generic template, never use)
- BANNED: stock phrases like "We provide excellent services", "Your success is our priority"
- BANNED: identical section structure to any previous generation
- BANNED: using grid-based layouts when the DNA says asymmetric (and vice versa)
- Every section must earn its place — no filler, no padding sections

QUALITY STANDARDS:
- Hero: visitor understands the value within 3 seconds
- Copy: hyper-specific to this business and audience — sounds like a human expert, not a robot
- Form: fields exactly right for this industry (dental ≠ SaaS ≠ legal ≠ fitness)
- Trust signals: what THIS industry's buyers actually care about
- Visual rhythm: density alternates (heavy → light → heavy) to keep eyes moving
- Minimum 7 distinct sections — no section repeats its visual pattern

TECHNICAL REQUIREMENTS:
- CSS variables at :root level: --primary: [PRIMARY_HEX]; --secondary: [SECONDARY_HEX];
- Use var(--primary) and var(--secondary) for ALL brand color references
- Logo: <img src="{{LOGO_URL}}" alt="Logo" style="height:48px;width:auto;object-fit:contain;">
- Images: https://picsum.photos/seed/[unique-descriptive-keyword]/[width]/[height]
- Tailwind CDN: <script src="https://cdn.tailwindcss.com"></script>
- Custom CSS in <style> tag for animations, textures, and anything Tailwind can't do
- Fully mobile responsive — hamburger menu on mobile, stacked layout
- Include a lead capture form with fields specific to this industry

OUTPUT FORMAT:
Return ONLY the complete HTML inside one code block:
\`\`\`html
<!DOCTYPE html>
...full page...
</html>
\`\`\`

No explanation. No commentary. No notes. Just the complete HTML.
`;

// ─── USER PROMPT ─────────────────────────────────────────────────────────────────
const buildUserPrompt = (input, designDNA, sectionVisualMap) => {
  const lines = [
    `BUSINESS NAME: ${input.businessName}`,
    `INDUSTRY: ${input.industry}`,
    `PAGE GOAL: ${input.pageType || 'lead generation'}`,
    `PRIMARY COLOR: ${input.primaryColor || '#7c3aed'}`,
    `SECONDARY COLOR: ${input.secondaryColor || '#6366f1'}`,
    `LOGO: {{LOGO_URL}}`,
  ];

  if (input.businessDescription) lines.push(`\nABOUT THE BUSINESS:\n${input.businessDescription}`);
  if (input.targetAudience) lines.push(`\nTARGET AUDIENCE: ${input.targetAudience}`);
  if (input.ctaText) lines.push(`\nMAIN CTA BUTTON TEXT: ${input.ctaText}`);
  if (input.tone) lines.push(`\nBRAND VOICE / TONE: ${input.tone}`);
  if (input.services?.length) lines.push(`\nSERVICES OFFERED:\n${input.services.map(s => `• ${s}`).join('\n')}`);
  if (input.websiteContent) lines.push(`\nEXISTING WEBSITE CONTENT (use to extract real copy and understand the business deeply):\n${input.websiteContent.substring(0, 4000)}`);
  if (input.aiPrompt) lines.push(`\nSPECIAL REQUEST FROM USER:\n${input.aiPrompt}`);

  lines.push(`
DESIGN EXECUTION REMINDER:
- Header / Navigation Bar MUST NOT have any menu links or hamburger lists. Logo on left, one single CTA button on right. No navigation list anchors allowed.
- Hero MUST be: ${designDNA.heroStyle}
- Color mood MUST be: ${designDNA.colorMood}
- Grid MUST be: ${designDNA.layoutGrid}
- FORM PLACEMENT MUST BE: ${designDNA.formPlacement}
- FORM STYLE MUST BE: ${designDNA.formStyle}
- Follow the section sequence EXACTLY as given in system prompt (at least 7 distinct premium sections)
- Refer to the MANDATORY SECTION-BY-SECTION VISUAL MAP and style each section with its unique target layout. No two sections can share the same design style!
- Use native HTML5 <details> and <summary> for FAQs/accordions to guarantee zero-JS flawless interactivity.
- This design must look NOTHING like a standard template

NOW BUILD THE PAGE:
Execute the Design DNA and the Section-by-Section styling with surgical precision for this exact business.
Write real, specific copy — not placeholders. Sound like a human expert, not a robot.
Every section moves the visitor closer to converting. Make sure the output generation completes fully down to the footer!
`);

  return lines.join('\n');
};

// ─── GENERATE LANDING PAGE ───────────────────────────────────────────────────────
const generateLandingPageContent = async (input) => {
  // Generate a unique chaos token
  const chaosToken = `${Date.now()}-${Math.random().toString(36).substring(2, 12)}-${(input.businessName || '').split('').reverse().join('').substring(0, 6)}-${Math.random().toString(36).substring(2, 8)}`;

  // Generate a completely random Design DNA blueprint
  const designDNA = generateDesignDNA();

  // Dynamically map each section in the sequence to a totally randomized visual pool layout
  const selectedSequence = designDNA.sectionSequence;
  const sectionVisualMap = selectedSequence.map((section, idx) => {
    if (idx === 0) {
      return `Section 1 (${section}): Must use Hero Style [${designDNA.heroStyle}] and Color Mood [${designDNA.colorMood}]. Ensure it is a visually stunning entrance with NO navigation links inside the header (logo left, CTA button right only).`;
    }
    if (section === 'FORM-SECTION') {
      return `Section ${idx + 1} (${section}): Lead Capture Form. Must use Form Placement [${designDNA.formPlacement}] and Form Style [${designDNA.formStyle}]. Ensure the lead capture fields are highly specific to this industry.`;
    }
    if (section === 'MINIMALIST-FOOTER') {
      return `Section ${idx + 1} (${section}): A sleek minimalist footer with a clean brand logo on the left, legal links in the center, and a copyright text on the right.`;
    }

    const pool = layoutPools[section] || [
      'Asymmetric layout with stunning typography, rich details, and high-fidelity custom spacing.',
      'Sleek glassmorphic card block with glowing elements and electric borders.',
      'Editorial minimalist grid with bold serif subheadings and plenty of breathing room.'
    ];
    return `Section ${idx + 1} (${section}): Styled as: "${pick(pool)}". Must be visually distinct from all other sections on the page.`;
  });

  logger.info(`[AI] Generating page | Business: ${input.businessName} | Token: ${chaosToken}`);
  logger.info(`[AI] Design DNA | Hero: ${designDNA.heroStyle.split(':')[0]} | Mood: ${designDNA.colorMood.split(':')[0]} | Form Placement: ${designDNA.formPlacement.split(':')[0]}`);

  const systemPrompt = buildSystemPrompt(chaosToken, designDNA, sectionVisualMap);
  let userPrompt = buildUserPrompt(input, designDNA, sectionVisualMap);

  if (input.templateHtml) {
    userPrompt += `\n\nPREVIOUS DESIGN FOR REFERENCE ONLY (do NOT copy its structure or layout — the new design must look completely different):\n${input.templateHtml}`;
  }

  return await callAI(userPrompt, input.logoUrl, systemPrompt);
};

// ─── IMPROVE SECTION ─────────────────────────────────────────────────────────────
const improveSectionContent = async ({ sectionType, currentContent, aiPrompt }) => {
  const systemPrompt = `
You are a Senior UI Developer and Conversion Copywriter.
Improve this landing page section — make it more visually compelling and persuasive.
Return ONLY the improved HTML inside a code block. No explanation.
`;
  const userPrompt = `
SECTION TYPE: ${sectionType}
CURRENT HTML/CONTENT: ${JSON.stringify(currentContent)}
IMPROVEMENT INSTRUCTION: ${aiPrompt || 'Make this section more compelling, visually stronger, and conversion-focused.'}
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