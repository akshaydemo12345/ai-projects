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
  const regex = /```(?:html)?\s*([\s\S]*?)(?:```|$)/gi;
  let matches = [], match;
  while ((match = regex.exec(raw)) !== null) {
    if (match[1]) matches.push(match[1].trim().replace(/```$/g, '').trim());
  }
  if (matches.length > 0) return matches.join('\n');

  const htmlMatch = raw.match(/(<!DOCTYPE[\s\S]*?<\/html>)/i) || raw.match(/(<html[\s\S]*?<\/html>)/i);
  if (htmlMatch) return htmlMatch[1].trim();

  let cleaned = raw.replace(/```html/gi, '').replace(/```/g, '').trim();
  // Strip conversational text before the first HTML tag if it exists
  const firstTagIndex = cleaned.search(/<\w+/);
  if (firstTagIndex > 0) {
    cleaned = cleaned.substring(firstTagIndex);
  }
  return cleaned.trim();
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

  // Final system prompt to send to model
  const finalSystemPrompt = resolved;

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
        max_tokens: 16000,
        temperature: 0.95
      });
      const rawText = response.choices[0].message.content;
      const usage = response.usage;

      // Try parse JSON if the model returned structured output
      const tryParseJson = (txt) => {
        if (!txt || typeof txt !== 'string') return null;
        let s = txt.trim();
        const fm = s.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
        if (fm?.[1]) s = fm[1].trim();
        try { return JSON.parse(s); } catch (e) { return null; }
      };

      const parsed = tryParseJson(rawText);
      if (parsed) {
        const fullHtml = parsed.fullHtml || parsed.html || parsed.htmlString || '';
        return { fullHtml, meta: parsed.meta || {}, sections: parsed.sections || [], rawJson: parsed, aiUsage: { promptTokens: usage.prompt_tokens, completionTokens: usage.completion_tokens, totalTokens: usage.total_tokens, cost: calculateCost(model, usage.prompt_tokens, usage.completion_tokens), model } };
      }

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
          model, max_tokens: 16000, temperature: 0.95,
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
        const rawText = response.content[0].text;

        const tryParseJson = (txt) => {
          if (!txt || typeof txt !== 'string') return null;
          let s = txt.trim();
          const fm = s.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
          if (fm?.[1]) s = fm[1].trim();
          try { return JSON.parse(s); } catch (e) { return null; }
        };

        const parsed = tryParseJson(rawText);
        if (parsed) {
          const fullHtml = parsed.fullHtml || parsed.html || parsed.htmlString || '';
          return { fullHtml, meta: parsed.meta || {}, sections: parsed.sections || [], rawJson: parsed, aiUsage: { promptTokens: usage.input_tokens, completionTokens: usage.output_tokens, totalTokens: usage.input_tokens + usage.output_tokens, cost: calculateCost(model, usage.input_tokens, usage.output_tokens), model } };
        }

        return {
          ...processResult(rawText, logoUrl),
          aiUsage: { promptTokens: usage.input_tokens, completionTokens: usage.output_tokens, totalTokens: usage.input_tokens + usage.output_tokens, cost: calculateCost(model, usage.input_tokens, usage.output_tokens), model }
        };
      } catch (err) {
        lastError = err;
        logger.error(`[AI] Claude failed (${model}): ${err.message}`);
        if (!String(err.message).toLowerCase().match(/not_found|model:/)) break;
      }
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
You are an elite Principal UI Engineer and Creative Director with over 15 years of experience designing world-class, premium enterprise and SaaS websites.
Your goal is to build a clean, modern, ultra-premium, high-converting landing page that feels trustworthy, professional, and visually stunning. Your layouts must reflect absolute mastery of CSS grids, beautiful whitespace, and high-end typography.

Every page you build looks like it was crafted by a senior designer at a top agency — not generated. It has a clear visual identity, professional copy, and real personality.

CHAOS SEED: ${chaosToken}
This seed shapes your creative decisions. Every generation must feel genuinely fresh and different from any other.

🚫 FORBIDDEN BAD PRACTICES (NEVER USE):
- NEVER USE plain text without proper padding or margins.
- NEVER USE outdated, ugly color combinations. Always keep it harmonious.
- NEVER cramp elements together. Always use generous whitespace (e.g. py-24).
- 🔄 DYNAMIC FORM PLACEMENT: Do not always put the contact/lead form in the exact same place! Sometimes put it in the Hero section, sometimes put it below the Hero, sometimes in the Footer, or in its own section. Mix it up completely!

🏆 30-YEARS EXPERIENCED PRINCIPAL DEVELOPER CODING PATTERNS:

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

3. PREMIUM MINIMALIST FOOTER AT THE BOTTOM:
- Every landing page MUST go all the way down to the bottom and end with a beautiful, custom, high-end Minimalist Footer section.
- The footer should include the logo tag \`<img src="{{LOGO_URL}}" alt="Logo" class="h-8 w-auto">\`, a clean address or contact info line (phone & email), simple social icons, and a copyright notice.
- 🚨 COPYRIGHT RULE: Use EXACTLY the copyright text found in the user's website content if available. DO NOT add the current year or make up your own copyright string! If no copyright is provided, just write "© BrandName. All rights reserved." without any year.

4. STRICT BRAND COLORS & VARIABLES:
- YOU MUST NEVER USE hardcoded Tailwind colors like \`bg-blue-600\`, \`text-red-500\`, or \`bg-green-500\`.
- You MUST ONLY use the CSS variables \`var(--primary)\` and \`var(--secondary)\` for all branding, buttons, accents, and highlights! (e.g., \`bg-[var(--primary)]\`, \`text-[var(--secondary)]\`).
- This is critical so the user's selected brand colors are automatically applied!

5. PREMIUM & HIGH-CONVERTING STRUCTURE (CRITICAL):
- Use proven, high-converting web layouts (e.g., elegant 3-column feature cards, beautiful alternating left-right image/text sections, strong centered or split-screen hero headers).
- Create a highly reliable, beautiful, modern layout that users immediately understand and trust.
- Keep structural elements clean and modern (rectangles, rounded-2xl or rounded-3xl corners, clean grids).
- YOU MUST USE RICH PLACEHOLDER IMAGES in your designs! Use \`https://picsum.photos/1200/800?random=1\` (change the random number for different images). Every page must have beautiful, large photos.

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

24. INTERACTIVE ACCORDIONS & FORMS (NO JS REQUIRED):
- We automatically inject JavaScript for FAQs and Form validation. You DO NOT need to write any script tags for interactivity.
- However, your HTML MUST use these exact classes for FAQs: \`accordion-item\`, \`accordion-header\`, and \`accordion-content hidden\`.
- 🚨 EXTREMELY IMPORTANT: DO NOT use the same boring white box design for FAQs every time. Invent DIFFERENT styles! Sometimes use a 2-column grid. Sometimes use minimalist borders with no background. Sometimes use dark backgrounds. Sometimes put the FAQ next to a large image. VARY THE DESIGN!
- 🚨 MAXIMUM ONE FORM PER PAGE: You must generate EXACTLY ONE lead/contact form on the entire page! Do NOT put a form in the hero AND the footer. Pick ONE interesting, dynamic placement for it!
- FORM STRUCTURE: Make the form look premium. ALL form fields must have the \`required\` attribute (e.g. \`<input type="text" required>\`) so our backend validation script catches them.

12. ULTRA-PREMIUM UI/UX FINISH (MANDATORY & CRITICAL):
You MUST design at an "Awwwards-winning" luxury agency level. Generic designs are unacceptable.
- WHITESPACE IS LUXURY: Use massive padding (e.g., \`py-32\`, \`py-40\`, \`gap-16\`). Let elements breathe. NEVER cramp text.
- TYPOGRAPHY AS ART: Use extreme typographic contrast. Use \`tracking-tighter\` for massive 6xl+ headings, and \`tracking-widest uppercase text-[10px] font-bold text-[var(--primary)]\` for small kickers/subheadings. 
- PREMIUM BACKGROUNDS: Do not just use solid colors. Use subtle radial gradients, mesh gradients, or large dark backgrounds with subtle glowing orbs (e.g. absolute divs with \`bg-[var(--primary)] blur-3xl opacity-20\`).
- GLASSMORPHISM & BORDERS: Use \`backdrop-blur-lg bg-white/10 border border-white/20\` for cards on top of dark/image backgrounds. 
- OVERLAPPING LAYOUTS: Break out of the box! Make images overlap into the section above/below using negative margins (\`-mt-16\`) or absolute positioning.
- GRADIENT TEXT: Always use gradient text for key emphasis in headlines: \`bg-clip-text text-transparent bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]\`.
- SHADOWS & DEPTH: Use ultra-soft, diffused shadows (e.g. \`shadow-[0_30px_60px_rgba(0,_0,_0,_0.08)]\`) and scale effects.
- 🚨 FORBIDDEN CSS (CRITICAL): NEVER use \`clip-path\`, \`polygon\`, or \`diagonal-slice\`. Clip paths break the GrapesJS editor UI rendering! Keep containers as standard rectangles with rounded corners.
- 🚨 NO WOW.JS: DO NOT use the \`wow.js\` library or \`wow\` classes. ONLY use AOS for scroll animations!
- MICRO-INTERACTIONS & AWESOME ANIMATIONS: Every button and card MUST have a premium hover state (e.g. \`transition-all duration-700 ease-out hover:-translate-y-2 hover:shadow-2xl\`).
- SCROLL ANIMATIONS: Include the AOS library via CDN (\`<link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">\` and \`<script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>\`) and heavily use \`data-aos="fade-up"\` and \`data-aos="zoom-in"\` with different delays. Initialize AOS in the script tag: \`<script>AOS.init({duration: 1000, once: true});</script>\`.

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
📤 OUTPUT FORMAT & TOKEN LIMITS (CRITICAL):
IMPORTANT: All generated text content MUST be in English only. Do not use Hindi or any other language.
CRITICAL TOKEN LIMIT: You have a generous output budget of 16,000 tokens — use it well!
- NEVER write massive inline SVG codes. ALWAYS use FontAwesome 6 classes (e.g., <i class="fa-solid fa-star"></i>).
- NEVER use Tailwind's arbitrary URL classes for background images (e.g. \`bg-[url('...')]\`). You MUST use inline styles for background images (e.g. \`<div style="background-image: url('...')">\`). This is critical to prevent CSS parser crashes.
- Keep your HTML DOM structure clean and avoid excessively deep nested divs.
- Do NOT generate excessively long placeholder text. Keep text punchy and concise.
You MUST output the ENTIRE HTML document perfectly, closing \`</body>\` and \`</html>\` at the end!
Return ONLY a complete HTML file inside one code block.
No explanation before or after. No comments. Start with the HTML tag directly.
\`\`\`html
<!DOCTYPE html>
<html lang="en">
...complete premium page, including scripts at the bottom...
</html>
\`\`\`
`;

// ─── WEBSITE PROFILE + CUSTOM TEXT FLATTENER ──────────────────────────────────────
// Merges project.websiteProfile (scraped brand data) with any free-text the user
// typed in (business goals, services, audience, USPs) into one context block
// the AI can use as ground truth for copywriting.
const buildBusinessContext = (input) => {
  const wp = input.websiteProfile || {};
  const parts = [];

  // ── User-provided custom text (grammar/spelling assumed already cleaned upstream,
  //    but we still surface it verbatim so the AI can extract goals/USPs from it) ──
  if (input.customText && input.customText.trim()) {
    parts.push(`USER-PROVIDED BUSINESS NOTES (authoritative — merge with brand data below, resolve conflicts in favor of these notes):\n${input.customText.trim()}`);
  }
  if (input.businessDescription) parts.push(`BUSINESS DESCRIPTION: ${input.businessDescription}`);
  if (input.targetAudience) parts.push(`TARGET AUDIENCE: ${input.targetAudience}`);
  if (input.aiPrompt) {
    let parsedPrompt = null;
    try {
      const cleanedPrompt = input.aiPrompt.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
      parsedPrompt = JSON.parse(cleanedPrompt);
    } catch (e) {
      // Not JSON
    }

    if (parsedPrompt && typeof parsedPrompt === 'object') {
      parts.push(`\n━━━ STRUCTURED LANDING PAGE INSTRUCTIONS (CRITICAL DIRECTIVES) ━━━`);
      if (parsedPrompt.pageGoal) {
        parts.push(`PAGE GOAL/TYPE: ${parsedPrompt.pageGoal}`);
      }
      if (parsedPrompt.targetAudience) {
        parts.push(`TARGET AUDIENCE (Focus copy for them): ${parsedPrompt.targetAudience}`);
      }
      if (parsedPrompt.headline) {
        parts.push(`HERO HEADLINE (You MUST use this exact headline or a minor variation in the hero section): "${parsedPrompt.headline}"`);
      }
      if (parsedPrompt.subheadline) {
        parts.push(`HERO SUBHEADLINE (You MUST use this exact subheadline in the hero section): "${parsedPrompt.subheadline}"`);
      }
      if (parsedPrompt.sections && Array.isArray(parsedPrompt.sections)) {
        parts.push(`MANDATORY SECTIONS SEQUENCE: ${parsedPrompt.sections.join(' -> ')}`);
      }
      if (parsedPrompt.tone) {
        parts.push(`WRITING TONE: ${parsedPrompt.tone}`);
      }
      if (parsedPrompt.cta) {
        if (parsedPrompt.cta.primary) {
          parts.push(`PRIMARY CTA BUTTON TEXT: ${parsedPrompt.cta.primary}`);
        }
        if (parsedPrompt.cta.secondary) {
          parts.push(`SECONDARY CTA BUTTON TEXT: ${parsedPrompt.cta.secondary}`);
        }
      }
      if (parsedPrompt.keyServices && Array.isArray(parsedPrompt.keyServices)) {
        parts.push(`KEY SERVICES TO FEATURE:\n${parsedPrompt.keyServices.map(s => `- ${s}`).join('\n')}`);
      }
      if (parsedPrompt.uniqueSellingPoints && Array.isArray(parsedPrompt.uniqueSellingPoints)) {
        parts.push(`UNIQUE SELLING POINTS (USPs) TO FEATURE:\n${parsedPrompt.uniqueSellingPoints.map(u => `- ${u}`).join('\n')}`);
      }
      if (parsedPrompt.specialInstructions) {
        parts.push(`SPECIAL LAYOUT & DESIGN DIRECTIVES:\n${parsedPrompt.specialInstructions}`);
      }
    } else {
      parts.push(`SPECIFIC INSTRUCTIONS FROM USER: ${input.aiPrompt}`);
    }
  }

  // ── Hero copy from scrape ──
  const hero = wp.content?.hero;
  if (hero?.title || hero?.subtitle) {
    parts.push(`EXISTING HERO COPY (use as inspiration, improve if possible): Title: "${hero.title || ''}" | Subtitle: "${hero.subtitle || ''}" | CTA: "${hero.ctaText || ''}"`);
  }

  // ── Taglines ──
  if (wp.content?.taglines?.length) {
    parts.push(`BRAND TAGLINES: ${wp.content.taglines.join(' | ')}`);
  }

  // ── Services ──
  const services = wp.content?.services?.length ? wp.content.services : null;
  if (services) {
    parts.push(`SERVICES/PRODUCTS:\n` + services.map(s => `- ${s.title}${s.description ? `: ${s.description}` : ''}`).join('\n'));
  } else if (input.services?.length) {
    parts.push(`SERVICES/PRODUCTS: ${input.services.join(', ')}`);
  }

  // ── Features / key selling points ──
  if (wp.content?.features?.length) {
    parts.push(`KEY FEATURES / SELLING POINTS:\n` + wp.content.features.map(f => `- ${f.title}${f.description ? `: ${f.description}` : ''}`).join('\n'));
  }

  // ── Testimonials ──
  if (wp.content?.testimonials?.length) {
    parts.push(`REAL TESTIMONIALS (use these, do not invent fake ones if these exist):\n` + wp.content.testimonials.map(t => `- "${t.text}" — ${t.name}${t.company ? `, ${t.company}` : ''}${t.rating ? ` (${t.rating}★)` : ''}`).join('\n'));
  }

  // ── Existing CTAs ──
  if (wp.content?.ctas?.length) {
    parts.push(`EXISTING CTA COPY: ` + wp.content.ctas.map(c => `${c.title || ''}${c.buttonText ? ` [Button: ${c.buttonText}]` : ''}`).filter(Boolean).join(' | '));
  }

  // ── Section heading style ──
  if (wp.content?.sectionHeadings?.length) {
    parts.push(`EXISTING SECTION HEADING STYLE (for tone matching): ${wp.content.sectionHeadings.join(' | ')}`);
  }

  // ── Identity / description ──
  if (wp.identity?.description) {
    parts.push(`BRAND DESCRIPTION: ${wp.identity.description}`);
  }

  // ── SEO keywords for tone/topic grounding ──
  if (wp.seo?.keywords?.length) {
    parts.push(`SEO KEYWORDS (weave naturally into copy): ${wp.seo.keywords.slice(0, 10).join(', ')}`);
  }

  return parts.join('\n\n');
};

// ─── USER PROMPT ─────────────────────────────────────────────────────────────────
const buildUserPrompt = (input, dna = {}, formHTML = '', placement = 'after-features') => {
  // Visual style nudge to ensure professional variety
  const styleNudges = [
    'Create a clean, modern SaaS-style layout with soft shadows, rounded corners, and clear sections.',
    'Design an elegant, premium corporate layout with high-quality images, clean typography, and a trustworthy feel.',
    'Build a vibrant, high-converting marketing page with bold clear CTAs, soft gradients, and modern feature grids.',
    'Use a minimalist, highly readable design with generous whitespace, subtle borders, and a focus on typography.',
    'Design a highly professional service-business layout with clear benefits, trust badges, and easy-to-read content blocks.'
  ];
  const randomNudge = styleNudges[Math.floor(Math.random() * styleNudges.length)];

  // Random FAQ layout constraints to prevent repetitive white-box accordion designs
  const faqNudges = [
    'FAQ DESIGN: Use a strict 2-column grid. No backgrounds on the items, just clean subtle bottom borders.',
    'FAQ DESIGN: Place the FAQs in a narrow, elegant card floating over a large background image.',
    'FAQ DESIGN: Use a completely dark, immersive background for the FAQ section with glowing border highlights on the active item.',
    'FAQ DESIGN: Put the FAQ title and a massive image on the left half of the screen, and the accordion items stacked tightly on the right half.',
    'FAQ DESIGN: Use a stark minimalist approach. Huge bold typography for the questions, no boxes, just pure text and subtle icons.'
  ];
  const randomFaqNudge = faqNudges[Math.floor(Math.random() * faqNudges.length)];

  const lines = [
    `BUSINESS NAME: ${input.businessName}`,
    `INDUSTRY: ${input.industry}`,
    `PAGE GOAL: ${input.pageType || 'lead generation and inquiries'}`,
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
    `🎨 OVERALL STYLE DIRECTION: ${randomNudge}`,
    `🧩 ${randomFaqNudge}`,
    `CRITICAL RULE: You must design a highly professional, modern, and trustworthy layout tailored to this specific business.`
  );

  // ── Merged websiteProfile + custom user text (business goals, services, USPs) ──
  const businessContext = buildBusinessContext(input);
  if (businessContext) {
    lines.push(`\n━━━ BUSINESS CONTEXT (websiteProfile + user notes — ground all copy in this, write a UNIQUE page tailored to THIS business, not a generic template) ━━━`);
    lines.push(businessContext);
  }

  if (input.websiteContent) {
    lines.push(`\n━━━ SCRAPED WEBSITE CONTENT (use real names, facts, copy from this) ━━━`);
    lines.push(input.websiteContent.substring(0, 3500));
  }

  // Human-readable placement label for the AI prompt (safe default provided)
  const placementLabel = `CONTACT FORM PLACEMENT: ${placement}`;
  lines.push(`\n━━━ CONTACT FORM PLACEMENT ━━━`);
  lines.push(placementLabel);

  lines.push(`\n━━━ CONTACT FORM HTML (insert this VERBATIM inside the contact section) ━━━`);
  lines.push(formHTML);

  lines.push(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NOW BUILD — FOLLOW THESE FINAL RULES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. 📱 STRICT MOBILE RESPONSIVENESS (CRITICAL): Your design MUST look perfect on mobile devices. Use mobile-first Tailwind classes. NEVER use static widths that break the viewport. Always use \`grid-cols-1 md:grid-cols-2 lg:grid-cols-X\` or \`flex-col md:flex-row\` to ensure everything stacks perfectly on phones!
2. Your hero MUST follow the STYLE DIRECTION above. Make it look extremely premium and trustworthy.
3. Name your visual concept in an HTML comment at the top: <!-- CONCEPT: ... -->
4. Write REAL, industry-specific copy — not generic filler text.
6. MANDATORY LEAD FORM (NO POPUPS): You MUST include at least one functional Lead Capture <form> block directly visible on the page (e.g. in the Hero or a dedicated Contact section). DO NOT hide the form inside a modal or popup. It must be INLINE and always visible. Include beautiful input fields and a submit button.
7. 🔥 EXTREME STRUCTURAL VARIETY (MINIMUM 8 SECTIONS): Choose a completely unexpected combination of sections. YOU MUST GENERATE AT LEAST 8 SECTIONS to make the page feel complete and professional.
8. ⚠️ COMPLETE THE FULL PAGE: You have 16,000 output tokens available — more than enough! You MUST generate all 8+ sections completely. Do NOT rush or skip sections. Every section should be fully designed and coded.
9. The page must end with a beautiful custom Footer (containing the logo, contact info, and copyright), followed by your interaction script and the closing \`</html>\` tag. The footer layout must also be uniquely designed each time. Do NOT stop writing before finishing the footer and closing all HTML tags!
`);

  return lines.join('\n');
};

// If the caller requests structured JSON output, return prompt text to request JSON
const appendJsonOutputInstructions = (input) => {
  if (!input) return '';
  const wantJson = input.outputFormat === 'json' || input.returnJson === true || input.forceJson === true;
  if (!wantJson) return '';
  return `\n\nIMPORTANT: Return ONLY valid JSON (no markdown, no explanation, no code fences). The JSON must follow this exact schema:\n{\n  "fullHtml": "<complete HTML page as a single string>",\n  "meta": { "title": "page title", "primaryColor": "#xxxxxx", "secondaryColor": "#xxxxxx" },\n  "sections": [ { "id": "hero", "html": "<section html>" } ],\n  "aiDebug": { "concept": "short concept label" }\n}\nIf you cannot produce all fields, still return a valid JSON object with the available keys. Do NOT include any extra top-level text.`;
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
  // Optionally request structured JSON output when the caller sets the flag
  userPrompt += appendJsonOutputInstructions(input);

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
    // 1. Ultimate Heuristic AI FAQ / Accordion Logic via Event Delegation
    document.addEventListener('click', function(e) {
      let current = e.target;
      let toggled = false;
      while (current && current !== document.body && !toggled) {
         const nextEl = current.nextElementSibling;
         if (nextEl && (nextEl.tagName === 'DIV' || nextEl.tagName === 'P' || nextEl.tagName === 'UL')) {
            const isHidden = nextEl.classList.contains('hidden') || nextEl.style.display === 'none';
            const isVisible = nextEl.offsetHeight > 0 && !isHidden;
            const hasIcon = current.querySelector('svg, i.fa, i.fas, i.far, i.fab, i.material-icons') || current.tagName === 'BUTTON';
            const isPointer = window.getComputedStyle(current).cursor === 'pointer' || current.classList.contains('cursor-pointer') || current.tagName === 'BUTTON' || current.closest('.faq-item, .accordion-item');
            
            if (hasIcon && isPointer) {
               if (isHidden) {
                  nextEl.classList.remove('hidden');
                  nextEl.style.display = 'block';
                  const icon = current.querySelector('svg, i');
                  if (icon) {
                     icon.classList.add('rotate-180');
                     if(icon.classList.contains('fa-plus')) { icon.classList.remove('fa-plus'); icon.classList.add('fa-minus'); }
                  }
                  toggled = true;
                  break;
               } else if (isVisible) {
                  nextEl.classList.add('hidden');
                  nextEl.style.display = 'none';
                  const icon = current.querySelector('svg, i');
                  if (icon) {
                     icon.classList.remove('rotate-180');
                     if(icon.classList.contains('fa-minus')) { icon.classList.remove('fa-minus'); icon.classList.add('fa-plus'); }
                  }
                  toggled = true;
                  break;
               }
            }
         }
         
         const container = current;
         const hiddenChild = Array.from(container.children).find(c => c.classList.contains('hidden') || c.style.display === 'none');
         const hasPointer = window.getComputedStyle(container).cursor === 'pointer' || container.classList.contains('cursor-pointer') || container.classList.contains('faq-item') || container.classList.contains('accordion-item');
         
         if (hiddenChild && hasPointer && container.querySelector('svg, i')) {
            hiddenChild.classList.remove('hidden');
            hiddenChild.style.display = 'block';
            const icon = container.querySelector('svg, i');
            if (icon) {
               icon.classList.add('rotate-180');
               if(icon.classList.contains('fa-plus')) { icon.classList.remove('fa-plus'); icon.classList.add('fa-minus'); }
            }
            toggled = true;
            break;
         } else if (hasPointer && container.querySelector('svg, i') && container.children.length >= 2) {
            const visibleChild = Array.from(container.children).find(c => (c.tagName === 'DIV' || c.tagName === 'P') && c !== container.firstElementChild && c.offsetHeight > 0 && !c.classList.contains('hidden'));
            if (visibleChild && container.firstElementChild && container.firstElementChild.contains(e.target)) {
               visibleChild.classList.add('hidden');
               visibleChild.style.display = 'none';
               const icon = container.querySelector('svg, i');
               if (icon) {
                  icon.classList.remove('rotate-180');
                  if(icon.classList.contains('fa-minus')) { icon.classList.remove('fa-minus'); icon.classList.add('fa-plus'); }
               }
               toggled = true;
               break;
            }
         }
         current = current.parentElement;
      }
    });

    // Check if we are inside GrapesJS editor (published pages don't have data-gjs-type)
    var isInEditor = !!document.querySelector('[data-gjs-type]') || document.body.classList.contains('gjs-dashed');
    
    // 2. Form Validation (runs everywhere so you can see red borders in editor)
    document.addEventListener('submit', function(e) {
      if (e.target.tagName === 'FORM') {
        e.target.setAttribute('novalidate', 'true'); // Disable native browser tooltips
        var isValid = true;
        var inputs = e.target.querySelectorAll('input:not([type="submit"]):not([type="hidden"]):not([type="button"]), textarea, select');
        
        inputs.forEach(function(input) {
          if (!input.dataset.valSetup) {
            input.dataset.valSetup = 'true';
            input.addEventListener('input', function() {
              if (input.value.trim()) {
                input.style.outline = '2px solid #22c55e';
                input.style.outlineOffset = '1px';
                input.style.borderColor = '#22c55e';
                if (input.nextElementSibling && input.nextElementSibling.classList.contains('val-error')) {
                  input.nextElementSibling.style.display = 'none';
                }
              } else {
                input.style.outline = '2px solid #ef4444';
                input.style.outlineOffset = '1px';
                input.style.borderColor = '#ef4444';
                if (input.nextElementSibling && input.nextElementSibling.classList.contains('val-error')) {
                  input.nextElementSibling.style.display = 'block';
                }
              }
            });
          }

          if (!input.value.trim()) {
            isValid = false;
            input.style.outline = '2px solid #ef4444';
            input.style.outlineOffset = '1px';
            input.style.borderColor = '#ef4444';
            
            // Dynamically wrap input if it's a direct child of a grid/flex (fixes error placement)
            if (!input.parentElement.classList.contains('val-wrapper')) {
                var wrapper = document.createElement('div');
                wrapper.className = 'val-wrapper';
                wrapper.style.display = 'flex';
                wrapper.style.flexDirection = 'column';
                wrapper.style.width = '100%';
                
                var computed = window.getComputedStyle(input);
                if (window.getComputedStyle(input.parentElement).display === 'grid') {
                    wrapper.style.gridColumn = input.style.gridColumn || computed.gridColumn;
                    wrapper.style.gridRow = input.style.gridRow || computed.gridRow;
                }
                
                input.parentNode.insertBefore(wrapper, input);
                wrapper.appendChild(input);
            }

            if (!input.nextElementSibling || !input.nextElementSibling.classList.contains('val-error')) {
              var fieldName = input.getAttribute('placeholder') || input.getAttribute('name') || 'This field';
              var err = document.createElement('span');
              err.className = 'val-error';
              err.style.color = '#ef4444';
              err.style.fontSize = '12px';
              err.style.display = 'block';
              err.style.marginTop = '4px';
              err.style.fontWeight = '500';
              err.textContent = '*' + fieldName.replace(/\\*$/, '').trim() + ' is required';
              input.parentNode.insertBefore(err, input.nextSibling);
            } else {
              input.nextElementSibling.style.display = 'block';
            }
          } else {
            input.style.outline = '2px solid #22c55e';
            input.style.outlineOffset = '1px';
            input.style.borderColor = '#22c55e';
          }
        });
        
        // Block submission if invalid OR if we are inside the editor (to prevent iframe redirect)
        if (!isValid || isInEditor) {
          e.preventDefault();
          e.stopImmediatePropagation();
        } else if (!isInEditor) {
          // If valid and in production, we show a success message!
          e.preventDefault(); // Stop actual post so we can show message
          var btn = e.target.querySelector('button[type="submit"]') || e.target.querySelector('input[type="submit"]');
          var origText = btn ? (btn.innerText || btn.value) : '';
          if (btn) {
            if(btn.innerText) btn.innerText = 'Sending...';
            else btn.value = 'Sending...';
          }
          setTimeout(function() {
            e.target.innerHTML = '<div style="padding: 20px; text-align: center; border: 2px dashed #22c55e; border-radius: 8px; background: rgba(34,197,94,0.1); color: #166534;"><h3 style="margin: 0 0 10px 0; font-size: 20px;">Thank You!</h3><p style="margin: 0;">Your request has been submitted successfully.</p></div>';
          }, 1000);
        }
      }
    }, true);

    // 3. Initialize AOS only on PUBLISHED page (not in editor)
    if (!isInEditor) {
      setTimeout(function() {
        if (typeof AOS !== 'undefined') {
          AOS.init({duration: 1000, once: true});
        }
      }, 500);
    }
  })();
</script>
`;


  if (aiResult && aiResult.fullHtml) {
    if (aiResult.fullHtml.includes('</body>')) {
      aiResult.fullHtml = aiResult.fullHtml.replace('</body>', coreScript + '\n</body>');
    } else {
      aiResult.fullHtml += '\n' + coreScript;
    }
  }

  return aiResult;
};

// ═══════════════════════════════════════════════════════════
//  IMPROVE SECTION
// ═══════════════════════════════════════════════════════════
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
//  DESCRIPTION SUGGESTION  (Structured JSON prompt)
// ═══════════════════════════════════════════════════════════
const generateDescriptionSuggestion = async ({ pageName, industry, projectDesc, currentPrompt, websiteProfile, scrapedData, uiOverrides }) => {
  const sys = `You are an elite Landing Page Strategist and Conversion Copywriter.
Your job is to generate a STRUCTURED JSON prompt that will be fed to an AI page generator to build a high-converting landing page.

RULES:
1. Return ONLY valid JSON — no markdown, no backticks, no explanation before or after.
2. The JSON must follow this EXACT schema:
{
  "pageGoal": "lead generation | sales | booking | event | waitlist | coming soon",
  "targetAudience": "Specific audience description",
  "headline": "Compelling hero headline for the page",
  "subheadline": "Supporting subtitle that expands on the headline",
  "sections": ["hero", "features", "about", "services", "testimonials", "faq", "contact", "footer"],
  "tone": "professional | friendly | premium | bold | minimal | corporate",
  "cta": {
    "primary": "Primary CTA button text",
    "secondary": "Secondary CTA text (optional)"
  },
  "keyServices": ["Service 1", "Service 2", "Service 3"],
  "uniqueSellingPoints": ["USP 1", "USP 2", "USP 3"],
  "specialInstructions": "Any additional creative direction or specific requirements for the page layout and content"
}
3. Ground ALL content in the REAL business data provided — use actual services, features, testimonials.
4. If a CURRENT PROMPT (free text) is provided by the user, CORRECT any spelling/grammar errors, understand the user's INTENT, and restructure it into the JSON schema above — preserving their ideas but making them professional and actionable.
5. The "sections" array should list 8-10 relevant section types based on the industry and page goal.
6. Write "headline" and "subheadline" as actual compelling copy — not instructions.
7. "keyServices" must reflect the REAL services from the business data.
8. "specialInstructions" should contain creative direction about layout style, imagery, and any industry-specific elements (e.g. "before/after gallery for roofing", "booking calendar for healthcare").
9. ALL text content MUST be in English only.`;

  const lines = [
    `PAGE NAME: ${pageName}`,
    `INDUSTRY: ${industry}`,
    `PROJECT/BUSINESS DESCRIPTION: ${projectDesc || 'not provided'}`,
  ];

  // Reuse the same flattener used for full-page generation so Magic Write
  // and the actual page generator are grounded in identical business data.
  const businessContext = buildBusinessContext({
    websiteProfile,
    businessDescription: projectDesc,
  });
  if (businessContext) {
    lines.push(`\n━━━ BRAND & BUSINESS DATA (use this to make the JSON specific and real) ━━━`);
    lines.push(businessContext);
  }

  // Live UI color/font overrides — current brand styling context
  if (uiOverrides) {
    const styleParts = [];
    if (uiOverrides.primaryColor) styleParts.push(`primary:${uiOverrides.primaryColor}`);
    if (uiOverrides.secondaryColor) styleParts.push(`secondary:${uiOverrides.secondaryColor}`);
    if (uiOverrides.accentColor) styleParts.push(`accent:${uiOverrides.accentColor}`);
    if (uiOverrides.headingFont) styleParts.push(`heading font:${uiOverrides.headingFont}`);
    if (uiOverrides.bodyFont) styleParts.push(`body font:${uiOverrides.bodyFont}`);
    if (styleParts.length) lines.push(`\nCURRENT BRAND STYLING: ${styleParts.join(', ')}`);
  }

  // Fallback to scrapedData hero/services if websiteProfile is empty
  if (!websiteProfile?.content && scrapedData) {
    if (scrapedData.hero?.title || scrapedData.hero?.subtitle) {
      lines.push(`\nSCRAPED HERO COPY: "${scrapedData.hero?.title || ''}" / "${scrapedData.hero?.subtitle || ''}"`);
    }
    if (scrapedData.services?.length) {
      lines.push(`SCRAPED SERVICES: ${scrapedData.services.map(s => s.title || s).join(', ')}`);
    }
  }

  if (currentPrompt && currentPrompt.trim()) {
    lines.push(`\nUSER'S CURRENT TEXT (correct any errors, understand intent, convert to JSON schema): ${currentPrompt}`);
  } else {
    lines.push(`\nNo user prompt provided — generate a fresh JSON prompt from scratch based on the business data above.`);
  }

  const user = lines.join('\n');
  const r = await callAIText(sys, user);

  // Parse AI output — strip markdown fences if present, extract valid JSON
  let rawText = r.text.trim();
  rawText = rawText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();

  let parsed = null;
  try {
    parsed = JSON.parse(rawText);
  } catch (e) {
    // If AI returned invalid JSON, try to extract JSON from the response
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        parsed = JSON.parse(jsonMatch[0]);
      } catch (_) { /* fallback below */ }
    }
  }

  // If parsing succeeded, return formatted JSON string; otherwise return raw text
  const formattedJson = parsed ? JSON.stringify(parsed, null, 2) : rawText;

  return { suggestion: formattedJson, text: formattedJson, json: parsed, aiUsage: r.aiUsage };
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