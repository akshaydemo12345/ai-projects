'use strict';

const Anthropic = require('@anthropic-ai/sdk');
const logger = require('../utils/logger');
const OpenAI = require('openai');

// ═══════════════════════════════════════════════════════════
//  MODELS  (verified June 2026)
// ═══════════════════════════════════════════════════════════
const CLAUDE_MODELS = {
  primary: 'claude-sonnet-4-6',
  fast: 'claude-haiku-4-5-20251001',
};

// ═══════════════════════════════════════════════════════════
//  COST CALCULATOR
// ═══════════════════════════════════════════════════════════
const PRICING = {
  'claude-sonnet-4-6': { input: 3e-6, output: 15e-6 },
  'claude-haiku-4-5': { input: 1e-6, output: 5e-6 },
  'gpt-4o-mini': { input: 1.5e-7, output: 6e-7 },
  'gpt-4o': { input: 5e-6, output: 15e-6 },
};

const calculateCost = (model, inp, out) => {
  const key = Object.keys(PRICING).find(k => model.toLowerCase().startsWith(k));
  const p = key ? PRICING[key] : PRICING['claude-sonnet-4-6'];
  return inp * p.input + out * p.output;
};

// ═══════════════════════════════════════════════════════════
//  CLEAN HTML  — strip markdown fences
// ═══════════════════════════════════════════════════════════
const cleanHTML = (raw) => {
  if (typeof raw !== 'string') return '';
  const fence = /```(?:html)?\s*([\s\S]*?)(?:```|$)/gi;
  const hits = [];
  let m;
  while ((m = fence.exec(raw)) !== null) if (m[1]) hits.push(m[1].trim().replace(/```$/, '').trim());
  if (hits.length) return hits.join('\n');
  const doc = raw.match(/(<!DOCTYPE[\s\S]*?<\/html>)/i) || raw.match(/(<html[\s\S]*?<\/html>)/i);
  if (doc) return doc[1].trim();
  return raw.replace(/```html/gi, '').replace(/```/g, '').trim();
};

// ═══════════════════════════════════════════════════════════
//  FORM FIELD BUILDER
//  Converts scraped/DB form fields into HTML with validation.
//  Falls back to universal 4-field form if no fields supplied.
// ═══════════════════════════════════════════════════════════

/**
 * Normalise a raw field object coming from scraper / DB.
 * Accepted shapes:
 *   { label, name, type, placeholder, required }
 *   { fieldLabel, fieldName, inputType, isRequired }
 *   plain string  →  treated as label, name derived
 */
const normaliseField = (raw) => {
  if (typeof raw === 'string') {
    const name = raw.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
    return { label: raw, name, type: 'text', placeholder: raw, required: true };
  }
  const label = raw.label || raw.fieldLabel || raw.name || 'Field';
  const name = raw.name || raw.fieldName ||
    label.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
  const type = raw.type || raw.inputType || 'text';
  const placeholder = raw.placeholder || raw.hint || label;
  const required = raw.required !== undefined ? raw.required :
    raw.isRequired !== undefined ? raw.isRequired : true;
  return { label, name, type, placeholder, required };
};

/**
 * Universal fallback — used when scraper returned nothing.
 * Always appropriate for any business.
 */
const FALLBACK_FIELDS = [
  { label: 'Your Name', name: 'name', type: 'text', placeholder: 'Full Name', required: true },
  { label: 'Email Address', name: 'email', type: 'email', placeholder: 'you@example.com', required: true },
  { label: 'Phone', name: 'phone', type: 'tel', placeholder: '+91 98765 43210', required: false },
  { label: 'Message', name: 'message', type: 'textarea', placeholder: 'How can we help you?', required: true },
];

/**
 * Builds the <form> HTML block from an array of field configs.
 * @param {Array}  fields      – normalised field objects
 * @param {string} submitLabel – CTA text for submit button
 */
const buildFormHTML = (fields, submitLabel = 'Send Message') => {
  const fieldHtml = fields.map(f => {
    const errMsg = f.type === 'email'
      ? 'Please enter a valid email address.'
      : 'This field is required.';

    const inputAttrs = [
      `name="${f.name}"`,
      `placeholder="${f.placeholder}"`,
      `class="w-full rounded-xl border border-gray-200 p-3 text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition"`,
      f.required ? 'required' : '',
    ].filter(Boolean).join(' ');

    const input = f.type === 'textarea'
      ? `<textarea ${inputAttrs} rows="4"></textarea>`
      : `<input type="${f.type}" ${inputAttrs} />`;

    return `
    <div class="mb-5">
      <label class="block text-sm font-semibold mb-1 text-gray-700">${f.label}${f.required ? ' <span class="text-red-500">*</span>' : ''}</label>
      ${input}
      ${f.required ? `<p class="field-error hidden text-red-500 text-xs mt-1">${errMsg}</p>` : ''}
    </div>`;
  }).join('');

  return `
<div class="form-wrapper" style="max-width:620px;margin:0 auto;">
  <form id="contact-form" novalidate autocomplete="off">
    ${fieldHtml}
    <button type="submit"
      class="w-full py-4 rounded-xl font-bold text-white text-lg tracking-wide transition-all duration-200 hover:opacity-90 hover:scale-[1.02]"
      style="background:var(--primary)">
      ${submitLabel}
    </button>
  </form>
</div>`.trim();
};

/**
 * Extracts form fields from scraped website content.
 * Looks for structural hints: input labels, field groups, contact sections.
 * Returns null when nothing useful is found (caller uses fallback).
 * @param {string} scrapedText
 * @returns {Array|null}
 */
const extractFieldsFromScrape = (scrapedText) => {
  if (!scrapedText || typeof scrapedText !== 'string') return null;

  // If scrape data is already a parsed object with a `formFields` key (ideal DB shape)
  try {
    const parsed = JSON.parse(scrapedText);
    if (Array.isArray(parsed.formFields) && parsed.formFields.length) {
      return parsed.formFields.map(normaliseField);
    }
    if (Array.isArray(parsed.fields) && parsed.fields.length) {
      return parsed.fields.map(normaliseField);
    }
  } catch (_) { /* not JSON — fall through to text heuristics */ }

  const text = scrapedText.toLowerCase();

  // Heuristic: look for labelled patterns common in scraped HTML text
  const labelPatterns = [
    /(?:label|field|input)[:\s]+["']?([a-z][a-z\s]{2,30})["']?/gi,
    /(?:placeholder)[:\s]+["']([^"']{3,40})["']/gi,
  ];

  const found = new Set();
  for (const rx of labelPatterns) {
    let hit;
    while ((hit = rx.exec(scrapedText)) !== null) {
      const raw = hit[1].trim();
      if (raw.length > 2 && raw.length < 40) found.add(raw);
    }
  }

  // Known field keywords mapping → field configs
  const knownMap = {
    'name': { label: 'Full Name', name: 'name', type: 'text', placeholder: 'Your full name', required: true },
    'full name': { label: 'Full Name', name: 'name', type: 'text', placeholder: 'Your full name', required: true },
    'first name': { label: 'First Name', name: 'first_name', type: 'text', placeholder: 'First name', required: true },
    'last name': { label: 'Last Name', name: 'last_name', type: 'text', placeholder: 'Last name', required: true },
    'email': { label: 'Email Address', name: 'email', type: 'email', placeholder: 'you@example.com', required: true },
    'phone': { label: 'Phone Number', name: 'phone', type: 'tel', placeholder: '+91 98765 43210', required: false },
    'mobile': { label: 'Mobile Number', name: 'mobile', type: 'tel', placeholder: '+91 98765 43210', required: false },
    'company': { label: 'Company Name', name: 'company', type: 'text', placeholder: 'Your company', required: false },
    'organisation': { label: 'Organisation', name: 'organisation', type: 'text', placeholder: 'Organisation name', required: false },
    'subject': { label: 'Subject', name: 'subject', type: 'text', placeholder: 'What is this about?', required: true },
    'message': { label: 'Message', name: 'message', type: 'textarea', placeholder: 'Your message…', required: true },
    'enquiry': { label: 'Enquiry', name: 'enquiry', type: 'textarea', placeholder: 'Your enquiry…', required: true },
    'query': { label: 'Your Query', name: 'query', type: 'textarea', placeholder: 'Describe your query…', required: true },
    'address': { label: 'Address', name: 'address', type: 'text', placeholder: 'Your address', required: false },
    'city': { label: 'City', name: 'city', type: 'text', placeholder: 'Your city', required: false },
    'pincode': { label: 'Pincode / ZIP', name: 'pincode', type: 'text', placeholder: '400001', required: false },
    'budget': { label: 'Budget Range', name: 'budget', type: 'text', placeholder: 'e.g. ₹50,000 – ₹1L', required: false },
    'service': { label: 'Service Needed', name: 'service', type: 'text', placeholder: 'Which service?', required: false },
    'date': { label: 'Preferred Date', name: 'date', type: 'date', placeholder: '', required: false },
    'website': { label: 'Website URL', name: 'website', type: 'url', placeholder: 'https://yoursite.com', required: false },
  };

  const fields = [];
  const seenNames = new Set();

  for (const raw of found) {
    const lower = raw.toLowerCase();
    for (const [key, cfg] of Object.entries(knownMap)) {
      if (lower.includes(key) && !seenNames.has(cfg.name)) {
        fields.push(cfg);
        seenNames.add(cfg.name);
        break;
      }
    }
  }

  // If too few matched → supplement with email + message if missing
  if (!seenNames.has('email')) fields.push(knownMap['email']);
  if (!seenNames.has('message') && !seenNames.has('enquiry')) fields.push(knownMap['message']);
  if (fields.length < 2) return null; // not enough signal — use fallback

  // Put name first, email second, message/textarea last
  fields.sort((a, b) => {
    const order = { name: 0, first_name: 1, last_name: 2, email: 3, phone: 4, mobile: 4 };
    const aScore = order[a.name] ?? 50;
    const bScore = b.type === 'textarea' ? 99 : (order[b.name] ?? 50);
    return aScore - bScore + (a.type === 'textarea' ? 99 : 0);
  });

  return fields;
};

// ═══════════════════════════════════════════════════════════
//  RESOLVE FORM  — pick fields, build HTML, decide placement
// ═══════════════════════════════════════════════════════════

const FORM_PLACEMENTS = [
  'after-features',    // section 3 — early, high visibility
  'after-about',       // section 4
  'after-testimonials',// section 6
  'before-footer',     // last section before footer
];

/**
 * Main form resolver. Called before building the AI prompt.
 * @param {object} input  – full generator input
 * @returns {{ formHTML: string, placement: string, fieldCount: number, source: string }}
 */
const resolveForm = (input) => {
  let fields = null;
  let source = 'fallback';

  // ── 1. Explicit DB / API-supplied fields (highest priority) ──
  if (Array.isArray(input.formFields) && input.formFields.length) {
    fields = input.formFields.map(normaliseField);
    source = 'database';
    logger.info('[AI] Form: using database-supplied fields');
  }

  // ── 2. Extract from scraped website content ──
  if (!fields && input.websiteContent) {
    const extracted = extractFieldsFromScrape(input.websiteContent);
    if (extracted && extracted.length >= 2) {
      fields = extracted;
      source = 'scrape';
      logger.info(`[AI] Form: extracted ${fields.length} fields from scrape`);
    } else {
      logger.info('[AI] Form: scrape had no recognisable form fields — using fallback');
    }
  }

  // ── 3. Website had no form / no content at all → always add fallback ──
  // This guarantees EVERY generated page has a contact form, no matter what.
  if (!fields) {
    fields = FALLBACK_FIELDS;
    source = 'fallback';
    logger.info('[AI] Form: no form found in source — adding universal contact form');
  }

  const submitLabel = input.ctaText || input.formSubmitLabel || 'Send Message';
  const formHTML = buildFormHTML(fields, submitLabel);

  // ── Placement logic ──
  let placement;
  if (source === 'database' && input.formPlacement) {
    // Controller explicitly told us where to put it
    placement = input.formPlacement;
  } else if (source === 'database') {
    placement = 'after-features'; // DB forms are important — show early
  } else if (source === 'scrape' && fields.length >= 4) {
    placement = 'after-about';    // Detailed scrape form → mid-page
  } else {
    // Fallback or minimal scrape → random placement keeps pages varied
    placement = FORM_PLACEMENTS[Math.floor(Math.random() * FORM_PLACEMENTS.length)];
  }

  logger.info(`[AI] Form: source=${source} fields=${fields.length} placement=${placement}`);

  return { formHTML, placement, fieldCount: fields.length, source };
};

// ═══════════════════════════════════════════════════════════
//  FORM VALIDATION SCRIPT (injected post-process)
// ═══════════════════════════════════════════════════════════
const VALIDATION_SCRIPT = `<script>
(function(){
  function init(){
    var form=document.getElementById('contact-form');
    if(!form)return;
    form.addEventListener('submit',function(e){
      e.preventDefault();
      var ok=true;
      form.querySelectorAll('[required]').forEach(function(f){
        var err=f.nextElementSibling;
        var bad=!f.value.trim()||(f.type==='email'&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value));
        if(bad){
          f.style.borderColor='#ef4444';f.style.outline='2px solid #ef4444';
          if(err&&err.classList.contains('field-error'))err.classList.remove('hidden');
          ok=false;
        }else{
          f.style.borderColor='';f.style.outline='';
          if(err&&err.classList.contains('field-error'))err.classList.add('hidden');
        }
      });
      if(ok){
        var w=form.closest('.form-wrapper');
        if(w)w.innerHTML='<div style="text-align:center;padding:3rem 1rem"><div style="font-size:3.5rem;margin-bottom:1rem">\u2705</div><h3 style="font-size:1.75rem;font-weight:700;margin-bottom:.75rem">Thank You!</h3><p style="color:#6b7280">We received your message and will get back to you shortly.</p></div>';
      }
    });
  }
  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();
})();
</script>`;

// ═══════════════════════════════════════════════════════════
//  SELECTIVE SCROLL ANIMATION ENGINE
//  — Injected once, ultra-lightweight (~400 bytes gzip)
//  — Uses IntersectionObserver for performance
//  — AI is instructed to use ONLY on big reveal moments
//    (hero content, section headings, feature cards, stats)
//    NOT on every paragraph or every child element
// ═══════════════════════════════════════════════════════════
const SCROLL_ANIMATION_ENGINE = `<style>
/* Scroll reveal — only elements with [data-reveal] animate */
[data-reveal]{opacity:0;transition:opacity .65s ease,transform .65s ease;will-change:transform,opacity}
[data-reveal="up"]   {transform:translateY(48px)}
[data-reveal="left"] {transform:translateX(-48px)}
[data-reveal="right"]{transform:translateX(48px)}
[data-reveal="scale"]{transform:scale(.9)}
[data-reveal].in     {opacity:1!important;transform:none!important}
[data-delay="1"]{transition-delay:.12s}
[data-delay="2"]{transition-delay:.24s}
[data-delay="3"]{transition-delay:.36s}
[data-delay="4"]{transition-delay:.48s}
@media(prefers-reduced-motion:reduce){[data-reveal]{opacity:1;transform:none;transition:none}}
</style>
<script>
(function(){
  if(!('IntersectionObserver' in window)){
    document.querySelectorAll('[data-reveal]').forEach(function(el){el.classList.add('in')});
    return;
  }
  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}});
  },{threshold:0.12,rootMargin:'0px 0px -40px 0px'});
  document.querySelectorAll('[data-reveal]').forEach(function(el){io.observe(el)});
})();
</script>`;

// ═══════════════════════════════════════════════════════════
//  INJECT ALL SCRIPTS  post-process after AI output
// ═══════════════════════════════════════════════════════════
const injectScripts = (html) => {
  if (!html) return html;

  // Remove any AI-generated contact-form scripts (we own form JS)
  html = html.replace(
    /<script[^>]*>[\s\S]*?getElementById\s*\(\s*['"]contact-form['"]\s*\)[\s\S]*?<\/script>/gi,
    ''
  );

  const toInject = SCROLL_ANIMATION_ENGINE + '\n' + VALIDATION_SCRIPT + '\n';

  // Inject animation CSS right after opening <head> for fastest paint
  if (html.includes('<head>')) {
    html = html.replace('<head>', '<head>\n' + SCROLL_ANIMATION_ENGINE);
    // Then inject only form validation before </body>
    return html.includes('</body>')
      ? html.replace('</body>', VALIDATION_SCRIPT + '\n</body>')
      : html + VALIDATION_SCRIPT;
  }

  return html.includes('</body>')
    ? html.replace('</body>', toInject + '</body>')
    : html + toInject;
};

// ═══════════════════════════════════════════════════════════
//  PROCESS RESULT  — clean + logo swap + inject + extract meta
// ═══════════════════════════════════════════════════════════
const processResult = (raw, logoUrl) => {
  let html = cleanHTML(raw);

  const fallbackLogo = 'https://placehold.co/200x60/f8fafc/6366f1?text=BRAND';
  const logo = logoUrl?.trim() || fallbackLogo;
  html = html
    .replace(/\{\{LOGO_URL\}\}/gi, logo)
    .replace(/\{\{logoUrl\}\}/gi, logo);

  html = injectScripts(html);

  const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : 'Landing Page';
  const css = (html.match(/<style[^>]*>([\s\S]*?)<\/style>/gi) || [])
    .map(s => s.replace(/<\/?style[^>]*>/gi, '')).join('\n');

  return { fullHtml: html, fullCss: css, fullJs: '', seo: { title } };
};

// ═══════════════════════════════════════════════════════════
//  RETRY HELPER
// ═══════════════════════════════════════════════════════════
const withRetry = async (fn, { retries = 3, baseDelayMs = 2000 } = {}) => {
  let last;
  for (let i = 0; i < retries; i++) {
    try { return await fn(); }
    catch (err) {
      last = err;
      const s = err.status ?? err.statusCode;
      if (s !== 429 && s !== 529 || i === retries - 1) throw err;
      const delay = baseDelayMs * 2 ** i;
      logger.warn(`[AI] Rate-limited (${s}), retry in ${delay}ms`);
      await new Promise(r => setTimeout(r, delay));
    }
  }
  throw last;
};

// ═══════════════════════════════════════════════════════════
//  CORE AI CALL
// ═══════════════════════════════════════════════════════════
const callAI = async (userPrompt, logoUrl = '', systemPrompt = '') => {
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;
  const preferOpenAI = process.env.PREFER_OPENAI === 'true';
  if (!anthropicKey && !openaiKey) throw new Error('No AI API key configured');

  const promptStr = typeof userPrompt === 'string' ? userPrompt : '';
  const primaryHex = promptStr.match(/PRIMARY COLOR:\s*(#[0-9a-fA-F]{3,6})/)?.[1] || '#7c3aed';
  const secondaryHex = promptStr.match(/SECONDARY COLOR:\s*(#[0-9a-fA-F]{3,6})/)?.[1] || '#6366f1';
  const businessName = promptStr.match(/BUSINESS NAME:\s*(.+)/)?.[1]?.trim() || 'brand';

  const resolved = systemPrompt
    .replace(/\[PRIMARY_HEX\]/g, primaryHex)
    .replace(/\[SECONDARY_HEX\]/g, secondaryHex)
    .replace(/\{\{BUSINESS_NAME_KEYWORD\}\}/g, businessName.toLowerCase().replace(/\s+/g, '-'));

  const messages = Array.isArray(userPrompt) ? userPrompt : [{ role: 'user', content: userPrompt }];

  const tryAnthropic = async () => {
    if (!anthropicKey) throw new Error('No ANTHROPIC_API_KEY');
    const client = new Anthropic({ apiKey: anthropicKey });
    const model = CLAUDE_MODELS.primary;
    logger.info(`[AI] Claude ${model}`);

    const res = await withRetry(() => client.messages.create({
      model,
      max_tokens: 16000,
      temperature: 0.9,
      system: [{ type: 'text', text: resolved, cache_control: { type: 'ephemeral' } }],
      messages,
    }));

    const { usage } = res;
    const cost = calculateCost(model, usage.input_tokens, usage.output_tokens);
    logger.info(`[AI] done | in:${usage.input_tokens} out:${usage.output_tokens} $${cost.toFixed(6)}`);
    return {
      ...processResult(res.content[0].text, logoUrl),
      aiUsage: {
        promptTokens: usage.input_tokens,
        completionTokens: usage.output_tokens,
        totalTokens: usage.input_tokens + usage.output_tokens,
        cachedTokens: usage.cache_read_input_tokens ?? 0,
        cost, model,
      },
    };
  };

  const tryOpenAI = async () => {
    if (!openaiKey) throw new Error('No OPENAI_API_KEY');
    const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
    const client = new OpenAI({ apiKey: openaiKey });
    const res = await withRetry(() => client.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: resolved },
        { role: 'user', content: typeof userPrompt === 'string' ? userPrompt : JSON.stringify(userPrompt) },
      ],
      max_tokens: 16000, temperature: 0.9,
    }));
    const { usage } = res;
    const cost = calculateCost(model, usage.prompt_tokens, usage.completion_tokens);
    return {
      ...processResult(res.choices[0].message.content, logoUrl),
      aiUsage: {
        promptTokens: usage.prompt_tokens, completionTokens: usage.completion_tokens,
        totalTokens: usage.total_tokens, cachedTokens: 0, cost, model
      },
    };
  };

  if (preferOpenAI && openaiKey) {
    try { return await tryOpenAI(); } catch (e) { logger.warn(`[AI] OpenAI failed, trying Claude: ${e.message}`); }
  }
  if (anthropicKey) {
    try { return await tryAnthropic(); }
    catch (e) {
      logger.error(`[AI] Claude failed: ${e.message}`);
      if (openaiKey) return tryOpenAI();
      throw e;
    }
  }
  return tryOpenAI();
};

// ═══════════════════════════════════════════════════════════
//  TEXT AI CALL  (Haiku — JSON / short structured outputs)
// ═══════════════════════════════════════════════════════════
const callAIText = async (systemPrompt, userPrompt) => {
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  if (anthropicKey) {
    const client = new Anthropic({ apiKey: anthropicKey });
    const model = CLAUDE_MODELS.fast;
    try {
      const res = await withRetry(() => client.messages.create({
        model, max_tokens: 2000, temperature: 0.7,
        system: systemPrompt, messages: [{ role: 'user', content: userPrompt }],
      }));
      const { usage } = res;
      return {
        text: res.content[0].text, aiUsage: {
          promptTokens: usage.input_tokens, completionTokens: usage.output_tokens,
          totalTokens: usage.input_tokens + usage.output_tokens,
          cost: calculateCost(model, usage.input_tokens, usage.output_tokens), model,
        }
      };
    } catch (e) { logger.error(`[AI-TEXT] Claude: ${e.message}`); if (!openaiKey) throw e; }
  }

  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
  const client = new OpenAI({ apiKey: openaiKey });
  const res = await withRetry(() => client.chat.completions.create({
    model, messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userPrompt }],
    max_tokens: 2000, temperature: 0.7,
  }));
  const { usage } = res;
  return {
    text: res.choices[0].message.content, aiUsage: {
      promptTokens: usage.prompt_tokens, completionTokens: usage.completion_tokens,
      totalTokens: usage.total_tokens, cost: calculateCost(model, usage.prompt_tokens, usage.completion_tokens), model,
    }
  };
};

// ═══════════════════════════════════════════════════════════
//  10 LAYOUT DNA  — each generation picks one at random
//  These are visual directions, not templates.
//  Contrast rules are embedded in each description.
// ═══════════════════════════════════════════════════════════
const LAYOUT_DNA = [
  {
    id: 'editorial-split',
    label: 'Editorial Split',
    hero: 'Full-viewport hero: 58% left column (very dark #0d0d0d bg, white text, massive 6xl headline, eyebrow label, single CTA), 42% right column is a full-height picsum photo with no overlay.',
    sections: 'Features: large alternating rows (image left/text right). Testimonials: horizontal 3-col cards with thick left border accent. Stats: bold number row on brand-color bg (white text).',
    vibe: 'Premium editorial magazine. Strong typographic hierarchy. Monochromatic dark accent.',
  },
  {
    id: 'cinematic-dark',
    label: 'Cinematic Dark',
    hero: 'Full-bleed picsum background, dense rgba(0,0,0,0.62) overlay, centered white headline with letter-spacing, elegant white subtext, ghost-border CTA button.',
    sections: 'Dark body (#0f0f1a). Services: glowing border cards (border: 1px solid rgba(255,255,255,0.1), dark bg, white text). Testimonials: dark cards white text. Stats: gradient accent bar.',
    vibe: 'Dark luxury. Everything on dark must be white or light. Zero light sections except form.',
  },
  {
    id: 'bento-minimal',
    label: 'Bento Minimal',
    hero: 'Clean #f9fafb hero, huge serif display headline (dark #111), short subtext, brand-color CTA, tiny decorative dash/line accent. No background image.',
    sections: 'Services: asymmetric bento grid (CSS grid-template-areas, varied cell sizes). About: white/light with a real image. Testimonials: quote-card masonry. FAQ: clean border-bottom accordion.',
    vibe: 'Modern minimal SaaS. Light backgrounds = dark text. Brand color only for CTAs and accents.',
  },
  {
    id: 'gradient-wave',
    label: 'Gradient Wave',
    hero: 'Diagonal gradient hero (primary → secondary), white headline, white subtext, white rounded CTA.',
    sections: 'Alternating light/dark sections for visual rhythm — dark sections ALWAYS get white text and white icon cards. Light sections get dark text. Stats on brand gradient (white numbers). Testimonials: gradient border cards.',
    vibe: 'Energetic, colorful. Each section clearly signals its background-to-text relationship.',
  },
  {
    id: 'neo-brutalist',
    label: 'Neo-Brutalist',
    hero: 'Split: left 50% brand primary (white text, massive bold uppercase H1), right 50% white (dark text, key stat or graphic). Thick 3px black borders on buttons and cards.',
    sections: 'Services: thick-bordered rectangular cards with icon. No border-radius on anything. FAQ: stark bordered accordion. Testimonials: newspaper-column style. One loud accent color.',
    vibe: 'Bold, opinionated, confident. Dark side = white text. Light side = dark text. Always.',
  },
  {
    id: 'glassmorphism',
    label: 'Glassmorphism',
    hero: 'Rich purple/blue gradient bg (#1a0533 to #0a1628), frosted glass hero card (background:rgba(255,255,255,0.07);backdrop-filter:blur(14px);border:1px solid rgba(255,255,255,0.12)), all text white.',
    sections: 'Dark background throughout. Glass cards (rgba white, white text, subtle border). Stats bar: solid brand gradient, white. Footer: #050505, white text.',
    vibe: 'Premium dark tech. Every single text element on dark/glass must be white or #e2e8f0.',
  },
  {
    id: 'soft-luxury',
    label: 'Soft Luxury',
    hero: 'Warm ivory #faf8f4 hero, large serif display headline in #1a1208, muted gold brand accent, minimal CTA. No background image — pure typography.',
    sections: 'All light sections — dark text throughout. Generous whitespace. Services: minimal icon + text. Testimonials: italic serif quotes with author photo. Stats: subtle bordered boxes.',
    vibe: 'Refined, premium, human. All light = dark text. Brand gold used sparingly on borders/icons.',
  },
  {
    id: 'dashboard-card',
    label: 'Dashboard / SaaS',
    hero: 'Split layout: left panel dark (#111827) with white headline + key benefits list, right panel light (#f3f4f6) showing a mock product UI card/screenshot (use a picsum as product image).',
    sections: 'Features as horizontal feature rows (icon + heading + paragraph). Pricing-style testimonial cards. FAQ clean. Light body overall — dark text.',
    vibe: 'Tech product, trust-building. Dark hero panel = white text. Light body = dark text.',
  },
  {
    id: 'bold-magazine',
    label: 'Bold Magazine',
    hero: 'Fullscreen picsum image, gradient overlay (transparent to #000 80%), bottom-anchored text (white H1, white subtext). Strong CTA with brand accent.',
    sections: 'Wide section dividers. Feature cards with colored top border accent. Testimonials: large serif quote marks, light gray bg (dark text). Stats: black bg, white numbers.',
    vibe: 'Editorial energy. Image sections = white text. Light content sections = dark text.',
  },
  {
    id: 'asymmetric-split',
    label: 'Premium Asymmetric',
    hero: '70/30 split: text side light (#fff, dark text H1), image side is full-height picsum with dark overlay and white caption. No hero form.',
    sections: 'Features: numbered large items (not generic grid). About: full-bleed image with text overlay (dark overlay + white text). Testimonials: offset grid. Stats: brand color bg (white).',
    vibe: 'Architectural precision. Image overlays = white text. Light sections = dark text. Always clear.',
  },
];

// ═══════════════════════════════════════════════════════════
//  SYSTEM PROMPT
// ═══════════════════════════════════════════════════════════
const buildSystemPrompt = (chaosToken) => `
You are a Principal UI Engineer and Creative Director with 25 years of experience building world-class, award-winning landing pages for Fortune 500 brands and high-growth startups.

Every page you build looks like it was crafted by a senior designer at a top agency — not generated. It has a clear visual identity, professional copy, and real personality.

CHAOS SEED: ${chaosToken}
This seed shapes your creative decisions. Every generation must feel genuinely fresh and different from any other.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 CONTRAST LAW — ABSOLUTE, NON-NEGOTIABLE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BEFORE writing any section, state its background. Then set text accordingly:
  • Dark background (#000 → #666)   → text: #ffffff or #f1f5f9
  • Brand color background          → text: #ffffff always
  • Image + dark overlay            → overlay rgba(0,0,0,.55+), text: #ffffff
  • Light background (#aaa → #fff)  → text: #111827 or #1e293b
  • Gradient dark → light           → use white text on dark side only

NEVER: dark bg + dark text. NEVER: brand bg + gray/dark text.
The footer is ALWAYS dark — text is ALWAYS light (#e2e8f0 or white).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 SCROLL ANIMATIONS — SELECTIVE & MEANINGFUL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
A scroll-reveal engine (IntersectionObserver) is auto-injected.
It uses data-reveal and data-delay attributes.

USE data-reveal ONLY on these high-impact elements:
  • Section heading + subheading wrapper  → data-reveal="up"
  • Feature/service card grid container or each card  → data-reveal="up" + data-delay="1/2/3"
  • Stats numbers row  → data-reveal="scale"
  • Testimonial cards (stagger)  → data-reveal="up" data-delay="1/2/3"
  • Contact form section wrapper  → data-reveal="up"
  • About section image + text side  → data-reveal="left"/"right"

DO NOT put data-reveal on:
  • Paragraphs inside cards (too granular — looks cheap)
  • Navbar, footer, hero (these are always visible)
  • Buttons, labels, or inline text spans
  • Every single child element (defeats the purpose)

Max ~15–20 data-reveal elements per page. Quality over quantity.
Example:
  <div class="grid grid-cols-3 gap-8">
    <div class="card" data-reveal="up" data-delay="1">…</div>
    <div class="card" data-reveal="up" data-delay="2">…</div>
    <div class="card" data-reveal="up" data-delay="3">…</div>
  </div>

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 ABSOLUTE FORBIDDEN (any = broken output)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• CSS clip-path on any element
• SVG blobs or abstract SVG decorations
• Generic 3-col "icon + title + 2 lines" grid for services
• More than ONE link in navbar (logo + CTA only)
• Any <input> <form> <textarea> inside the Hero section
• Truncated HTML — must end with </body></html>
• Lorem ipsum — use real, industry-specific copy
• Placeholder comments like <!-- more items --> or <!-- repeat -->

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 NAVBAR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Sticky. Contains ONLY:
  Left: <img src="{{LOGO_URL}}" alt="Logo" style="height:2rem;width:auto">
  Right: ONE styled CTA button
Nothing else. No links. No hamburger menu. Ultra-minimal premium.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 HERO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Follow the LAYOUT DNA hero description exactly.
Contains: H1 headline + subparagraph + ONE CTA button.
ZERO forms. ZERO inputs. ZERO email boxes. EVER.
Image backgrounds: use picsum.photos/1600/900?random=[N]
Always add a proper dark overlay so white text is readable.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 LOGO USAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Use {{LOGO_URL}} in: navbar (img tag) + footer (img tag).
Never apply CSS color filters to the logo image.
On dark backgrounds the logo image will display correctly as-is.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 CONTACT FORM — PRE-BUILT, INSERT AS-IS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
The EXACT form HTML is provided in the user prompt under "CONTACT FORM HTML".
Copy it verbatim inside the contact section. Do NOT modify field structure.
Do NOT add extra scripts for this form — validation is injected automatically.
Wrap the section with a heading ("Get In Touch" or similar) and appropriate styling.

If the section has a dark background:
  • Set color:#fff on labels and section heading
  • Set the form wrapper background to a slightly lighter dark shade so it stands out
  • Keep input fields with white background and dark text always

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 COLORS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
In <style>:
  :root {
    --primary: [PRIMARY_HEX];
    --secondary: [SECONDARY_HEX];
    --primary-dark: (manually darken primary ~15%);
    --on-primary: #ffffff;
  }
Rule: anywhere you write background:var(--primary) or background:var(--secondary),
ALSO write color:var(--on-primary) on the same element.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 IMAGES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Landscape photos: https://picsum.photos/900/600?random=[1-99]
Portraits / team: https://i.pravatar.cc/150?img=[1-70]
Never empty src. Never missing alt text.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 TYPOGRAPHY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Choose a Google Font pairing fitting the industry:
  Luxury/fashion     → Cormorant Garamond + Jost
  Tech / SaaS        → Space Grotesk + Inter
  Health / wellness  → DM Serif Display + Nunito
  Legal / finance    → Libre Baskerville + Source Sans 3
  Food / restaurant  → Playfair Display + Lato
  Education          → Merriweather + Poppins
  Creative / agency  → Syne + DM Sans
  General            → Plus Jakarta Sans + Inter

Set display font on headings (h1–h3), body font on body/p.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 REQUIRED SECTIONS (follow LAYOUT DNA for order & style)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Navbar (sticky, logo + CTA)
2. Hero (per DNA — no form)
3. Features/Services (creative layout per DNA — NOT generic 3-col icon grid)
4. About/Story (real image, real narrative)
5. Stats / Social Proof numbers (3–4 impactful numbers)
6. Testimonials (3+ full testimonials with name, title, avatar)
7. FAQ (accordion, 5+ fully-written real Q&A pairs)
8. Contact Form (placement per user prompt — insert PRE-BUILT form HTML verbatim)
9. Footer (dark, 4-col: brand | services | links | contact, with logo + social icons)

All sections fully written. No placeholders. No truncation.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 ICONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
Use industry-specific icons (not generic checkmarks for everything).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 ACCORDION JS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Add before </body>:
<script>
document.querySelectorAll('.faq-q').forEach(function(btn){
  btn.addEventListener('click',function(){
    var ans=this.nextElementSibling;
    var ic=this.querySelector('.faq-icon');
    ans.classList.toggle('hidden');
    if(ic)ic.style.transform=ans.classList.contains('hidden')?'rotate(0deg)':'rotate(180deg)';
  });
});
</script>

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 HOVER MICRO-INTERACTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Cards: hover:-translate-y-1 hover:shadow-2xl transition-all duration-300
Buttons: hover:opacity-90 hover:scale-105 transition duration-200
Images inside cards: overflow-hidden, img hover:scale-105 transition duration-500

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 TECHNICAL STACK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
<script src="https://cdn.tailwindcss.com"></script>
FontAwesome 6 CDN + Google Fonts CDN + custom <style> block.
No clip-path. No SVG filters. No external animation libraries.

OUTPUT: ONE complete HTML file in a single code block.
No text before or after. Start with <!DOCTYPE html>. End with </body></html>.
`;

// ═══════════════════════════════════════════════════════════
//  USER PROMPT BUILDER
// ═══════════════════════════════════════════════════════════
const buildUserPrompt = (input, dna, formHTML, formPlacement) => {
  const placementLabel = {
    'after-features': 'Place the Contact section as Section 3, right after Features/Services.',
    'after-about': 'Place the Contact section as Section 4, right after About/Story.',
    'after-testimonials': 'Place the Contact section after Testimonials (Section 6).',
    'before-footer': 'Place the Contact section as the last section before the Footer.',
  }[formPlacement] || 'Place the Contact section before the Footer.';

  const lines = [
    `BUSINESS NAME: ${input.businessName}`,
    `INDUSTRY: ${input.industry}`,
    `PAGE GOAL: ${input.pageType || 'lead generation and inquiries'}`,
    `PRIMARY COLOR: ${input.primaryColor || '#7c3aed'}`,
    `SECONDARY COLOR: ${input.secondaryColor || '#6366f1'}`,
    `LOGO: {{LOGO_URL}}`,
  ];

  // Optional colour palette hints from logo analyser
  if (input.navColors?.palette?.length) lines.push(`NAV PALETTE: ${input.navColors.palette.slice(0, 5).join(', ')}`);
  if (input.footerColors?.palette?.length) lines.push(`FOOTER PALETTE: ${input.footerColors.palette.slice(0, 5).join(', ')}`);
  if (input.buttonColors?.palette?.length) lines.push(`BUTTON PALETTE: ${input.buttonColors.palette.slice(0, 5).join(', ')}`);

  lines.push(`\n━━━ LAYOUT DNA: ${dna.label} ━━━`);
  lines.push(`HERO DIRECTION: ${dna.hero}`);
  lines.push(`SECTIONS STYLE: ${dna.sections}`);
  lines.push(`VISUAL VIBE: ${dna.vibe}`);

  if (input.aiPrompt) {
    lines.push(`\n━━━ USER VISION (HIGHEST PRIORITY — follow exactly) ━━━\n${input.aiPrompt}`);
  }

  if (input.businessDescription) lines.push(`\nBUSINESS DESCRIPTION: ${input.businessDescription}`);
  if (input.targetAudience) lines.push(`TARGET AUDIENCE: ${input.targetAudience}`);
  if (input.ctaText) lines.push(`PRIMARY CTA TEXT: ${input.ctaText}`);
  if (input.tone) lines.push(`COPY TONE: ${input.tone}`);
  if (input.services?.length) lines.push(`SERVICES/OFFERINGS:\n${input.services.map(s => `  • ${s}`).join('\n')}`);

  if (input.websiteContent) {
    lines.push(`\n━━━ SCRAPED WEBSITE CONTENT (use real names, facts, copy from this) ━━━`);
    lines.push(input.websiteContent.substring(0, 3500));
  }

  lines.push(`\n━━━ CONTACT FORM PLACEMENT ━━━`);
  lines.push(placementLabel);

  lines.push(`\n━━━ CONTACT FORM HTML (insert this VERBATIM inside the contact section) ━━━`);
  lines.push(formHTML);

  lines.push(`
━━━ FINAL SELF-CHECK (verify before outputting) ━━━
[ ] Hero has NO form, NO input, NO email field
[ ] Contact section contains the EXACT form HTML above (not modified)
[ ] Every dark background section has white/light text
[ ] Footer is dark with light text (#e2e8f0 or white)
[ ] data-reveal used on ~15 key elements only (section headings, cards, stats, testimonials)
[ ] All 9 sections present and fully written with real copy
[ ] No Lorem Ipsum anywhere
[ ] Output ends with </body></html>
`);

  return lines.join('\n');
};

// ═══════════════════════════════════════════════════════════
//  GENERATE LANDING PAGE  — main export
// ═══════════════════════════════════════════════════════════
const generateLandingPageContent = async (input) => {
  const chaosToken = [
    Date.now(),
    Math.random().toString(36).slice(2, 14),
    Math.random().toString(36).slice(2, 8),
    (input.businessName || 'biz').split('').reverse().join('').slice(0, 6).toUpperCase(),
  ].join('-');

  // Pick layout DNA
  const dna = LAYOUT_DNA[Math.floor(Math.random() * LAYOUT_DNA.length)];

  // Resolve form from DB / scrape / fallback
  const { formHTML, placement, fieldCount, source } = resolveForm(input);

  logger.info(`[AI] Generate | Business:${input.businessName} | Layout:${dna.label} | Form:${source}(${fieldCount} fields) | Placement:${placement} | Token:${chaosToken}`);

  const systemPrompt = buildSystemPrompt(chaosToken);
  let userPrompt = buildUserPrompt(input, dna, formHTML, placement);

  if (input.templateHtml) {
    userPrompt += `\n\n━━━ PREVIOUS PAGE (invent a COMPLETELY DIFFERENT layout — do not reuse) ━━━\n${input.templateHtml.substring(0, 2000)}`;
  }

  return await callAI(userPrompt, input.logoUrl, systemPrompt);
};

// ═══════════════════════════════════════════════════════════
//  IMPROVE SECTION
// ═══════════════════════════════════════════════════════════
const improveSectionContent = async ({ sectionType, currentContent, aiPrompt }) => {
  const styles = [
    'Dark glassmorphic — deep gradient bg, frosted card, ALL text white.',
    'Clean asymmetric editorial — large bold typography, light bg, dark text.',
    'Dynamic overlapping cards — high contrast (dark cards = white text, light cards = dark text).',
    'Glowing accent shadows — light bg, dark headings, brand-colored icon accents.',
    'Full-bleed bold color blocks — each block clearly sets its own text color.',
  ];
  const system = `You are a Senior UI Developer. Rewrite this section to be stunning and conversion-focused.
CONTRAST LAW: dark bg → white text. light bg → dark text. Always.
FORBIDDEN: clip-path. SVG blobs. Lorem ipsum. Generic 3-col icon grid.
REQUIRED: data-reveal on section heading and cards. Hover animations. Mobile responsive.
OUTPUT: raw HTML only. No explanation. No markdown fences.`;
  const style = styles[Math.floor(Math.random() * styles.length)];
  const user = `SECTION TYPE: ${sectionType}\nSTYLE: ${style}\nCURRENT HTML:\n${typeof currentContent === 'string' ? currentContent : JSON.stringify(currentContent)}\nREQUEST: ${aiPrompt || 'Make this premium and unique with proper contrast and selective scroll animations.'}`;
  return callAI(user, '', system);
};

// ═══════════════════════════════════════════════════════════
//  EDITOR CHAT MODIFY
// ═══════════════════════════════════════════════════════════
const editorChatModify = async ({ elementTag, elementHtml, elementCss, instruction }) => {
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  if (!anthropicKey) throw new Error('ANTHROPIC_API_KEY missing');
  const client = new Anthropic({ apiKey: anthropicKey });
  const model = CLAUDE_MODELS.fast;
  const system = `You are a Senior UI Developer modifying GrapesJS elements.
Return ONLY valid JSON, no markdown:
{"action":"style"|"text"|"both"|"html","css":{"camelCaseProperty":"value"},"text":"new text","html":"full html","summary":"one line change description"}
CONTRAST RULE: if setting dark background, also set light text color in same css object.`;
  const user = `TAG:${elementTag}\nHTML:${elementHtml}\nCSS:${elementCss}\nINSTRUCTION:${instruction}`;
  const res = await withRetry(() => client.messages.create({ model, max_tokens: 4000, temperature: 0, system, messages: [{ role: 'user', content: user }] }));
  let json = res.content[0].text.trim();
  const fm = json.match(/```(?:json)?\s*([\s\S]*?)(?:```|$)/i);
  if (fm?.[1]) json = fm[1].trim();
  const { usage } = res;
  try {
    return { ...JSON.parse(json), aiUsage: { promptTokens: usage.input_tokens, completionTokens: usage.output_tokens, totalTokens: usage.input_tokens + usage.output_tokens, model } };
  } catch {
    return { action: 'html', html: res.content[0].text, summary: 'Applied AI response' };
  }
};

// ═══════════════════════════════════════════════════════════
//  DESCRIPTION SUGGESTION
// ═══════════════════════════════════════════════════════════
const generateDescriptionSuggestion = async ({ pageName, industry, projectDesc, currentPrompt }) => {
  const sys = `You are a Landing Page Conversion Copywriter. Write a compelling business description. 3-4 sentences. Benefit-driven. No generic filler. Return ONLY the description text.`;
  const user = `PAGE:${pageName}\nINDUSTRY:${industry}\nBUSINESS:${projectDesc || 'not provided'}\nIMPROVE:${currentPrompt || 'none'}`;
  const r = await callAIText(sys, user);
  return { suggestion: r.text.trim(), text: r.text.trim(), aiUsage: r.aiUsage };
};

// ═══════════════════════════════════════════════════════════
//  PROJECT SUGGESTIONS
// ═══════════════════════════════════════════════════════════
const generateProjectSuggestions = async ({ projectName, industry, projectDescription, services, pageTitles }) => {
  const sys = `You are a digital marketing strategist. Return ONLY valid JSON array: [{"title":"Page Name","description":"Goal in one sentence"}]. No markdown.`;
  const user = [`PROJECT:${projectName}|INDUSTRY:${industry}`, `DESCRIPTION:${projectDescription}`, services?.length ? `SERVICES:${services.join(', ')}` : '', pageTitles?.length ? `AVOID:${pageTitles.join(', ')}` : '', 'Generate 6 unique landing page ideas.'].filter(Boolean).join('\n');
  const r = await callAIText(sys, user);
  try { return JSON.parse(r.text.trim().replace(/```json|```/g, '').trim()); }
  catch { logger.error('[AI] project suggestions JSON parse failed'); return []; }
};

// ═══════════════════════════════════════════════════════════
//  STRATEGIC STRUCTURE
// ═══════════════════════════════════════════════════════════
const generateStrategicStructure = async (input) => {
  const sys = `You are a CRO specialist. Return ONLY valid JSON: {"sections":[{"type":"...","goal":"...","keyMessage":"..."}]}. No markdown.`;
  const user = [`BUSINESS:${input.businessName}|INDUSTRY:${input.industry}`, `DESCRIPTION:${input.businessDescription}`, input.services?.length ? `SERVICES:${input.services.join(', ')}` : ''].filter(Boolean).join('\n');
  const r = await callAIText(sys, user);
  try { return { plan: JSON.parse(r.text.trim().replace(/```json|```/g, '').trim()), aiUsage: r.aiUsage }; }
  catch { return { plan: { sections: [] }, aiUsage: r.aiUsage }; }
};

// ═══════════════════════════════════════════════════════════
//  OPTIMIZE STRUCTURE
// ═══════════════════════════════════════════════════════════
const optimizeStrategicStructure = async ({ projectData, scrapedData, existingPage }) => {
  const sys = `You are a CRO specialist. Return ONLY valid JSON: {"sections":[...],"improvements":[...]}. No markdown.`;
  const user = `PROJECT:${JSON.stringify(projectData)}\nSCRAPED:${JSON.stringify(scrapedData)}\nEXISTING:${JSON.stringify(existingPage)}`;
  const r = await callAIText(sys, user);
  try { return { plan: JSON.parse(r.text.trim().replace(/```json|```/g, '').trim()), aiUsage: r.aiUsage }; }
  catch { return { plan: { sections: [] }, aiUsage: r.aiUsage }; }
};

// ═══════════════════════════════════════════════════════════
//  EXPORTS
// ═══════════════════════════════════════════════════════════
module.exports = {
  generateLandingPageContent,
  improveSectionContent,
  editorChatModify,
  generateDescriptionSuggestion,
  generateProjectSuggestions,
  generateStrategicStructure,
  optimizeStrategicStructure,
  callAIText,
  // Expose form utilities for use in routes/controllers if needed
  resolveForm,
  buildFormHTML,
  extractFieldsFromScrape,
  normaliseField,
};
