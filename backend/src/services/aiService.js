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

// Backwards-compatible list used elsewhere in the codebase
// 🔧 TO GO LIVE (EXPENSIVE BUT BEST QUALITY): Uncomment the line below and comment the testing line
const CLAUDE_MODEL_CANDIDATES = [CLAUDE_MODELS.primary, CLAUDE_MODELS.fast];

// 🔧 FOR TESTING (CHEAP & FAST): Keep this active
// const CLAUDE_MODEL_CANDIDATES = [CLAUDE_MODELS.fast];

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
//  HTML COMPLETENESS CHECK
//  Detects a truncated / cut-off AI response so the caller can
//  retry with more budget instead of shipping a half page.
// ═══════════════════════════════════════════════════════════
const isHtmlIncomplete = (html) => {
  if (!html || typeof html !== 'string') return true;
  const closesHtml = /<\/html>\s*$/i.test(html.trim());
  const closesBody = /<\/body>/i.test(html);
  const hasFooter = /<footer/i.test(html) || /class="[^"]*footer/i.test(html);
  // A finished page should close its tags AND contain a footer.
  return !(closesHtml && closesBody && hasFooter);
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
  'in-hero',            // right inside the hero section
  'in-hero',            // (weighted 2x)
  'after-features',     // section 3 — early, high visibility
  'after-features',     // (weighted 2x)
  'after-about',        // mid page
  'own-section',        // dedicated full-width contact section
  'before-footer',      // last section before footer
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

  // ── Placement logic ──
  let placement;
  if (input.formPlacement) {
    // Controller explicitly told us where to put it
    placement = input.formPlacement;
  } else {
    // Completely randomize form placement to keep pages structurally unique!
    // (sometimes in-hero, sometimes after-about, before-footer, etc.)
    placement = FORM_PLACEMENTS[Math.floor(Math.random() * FORM_PLACEMENTS.length)];
  }

  logger.info(`[AI] Form: source=${source} fields=${fields.length} placement=${placement}`);

  return { fields, submitLabel, placement, fieldCount: fields.length, source };
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
        if(w)w.innerHTML='\\x3Cdiv style="text-align:center;padding:3rem 1rem"\\x3E\\x3Cdiv style="font-size:3.5rem;margin-bottom:1rem"\\x3E\\u2705\\x3C/div\\x3E\\x3Ch3 style="font-size:1.75rem;font-weight:700;margin-bottom:.75rem"\\x3EThank You!\\x3C/h3\\x3E\\x3Cp style="color:#6b7280"\\x3EWe received your message and will get back to you shortly.\\x3C/p\\x3E\\x3C/div\\x3E';
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
    if (html.includes('</body>')) {
      return html.replace('</body>', VALIDATION_SCRIPT + '\n</body>');
    } else {
      return html + '\n' + VALIDATION_SCRIPT + '\n</body>\n</html>';
    }
  }

  if (html.includes('</body>')) {
    return html.replace('</body>', toInject + '\n</body>');
  } else {
    return html + '\n' + toInject + '\n</body>\n</html>';
  }
};

// ═══════════════════════════════════════════════════════════
//  PROCESS RESULT  — clean + logo swap + inject + extract meta
// ═══════════════════════════════════════════════════════════
const processResult = (raw, logoUrl, businessName) => {
  let html = cleanHTML(raw);

  const safeBusinessName = businessName?.trim() || 'BRAND';
  const fallbackLogo = `https://placehold.co/200x60/f8fafc/6366f1?text=${encodeURIComponent(safeBusinessName)}`;
  const logo = logoUrl?.trim() || fallbackLogo;

  html = html
    .replace(/\{\{LOGO_URL\}\}/gi, logo)
    .replace(/\{\{logoUrl\}\}/gi, logo);

  // Force replace any image that is identified as a logo, just in case AI used a generic path
  html = html.replace(/<img([^>]*)>/gi, (match, attrs) => {
    const attrsLow = attrs.toLowerCase();
    // Catch common logo attributes but exclude client/trusted logos
    if ((attrsLow.includes('logo') && !attrsLow.includes('client') && !attrsLow.includes('partner') && !attrsLow.includes('trusted')) ||
      attrsLow.includes('id="page-logo"') ||
      attrsLow.includes('alt="logo"')) {

      // If the source already contains our logo, skip
      if (attrs.includes(logo)) return match;

      if (attrs.includes('src=')) {
        return `<img${attrs.replace(/src=["'][^"']*["']/i, `src="${logo}"`)}>`;
      } else {
        return `<img src="${logo}"${attrs}>`;
      }
    }
    return match;
  });

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
const withRetry = async (fn, { retries = 4, baseDelayMs = 2000 } = {}) => {
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
//  🚨 BUG FIX: max_tokens was set to 1600 — nowhere near enough
//  for a full 6+ section HTML page. This is what caused pages to
//  cut off halfway through the hero. Raised to 8000 for both
//  providers, and one automatic retry-with-higher-budget added
//  if the returned HTML looks truncated.
// ═══════════════════════════════════════════════════════════
const MAX_OUTPUT_TOKENS = 8000;

// Safety-net timeout for a single AI provider call. This is generous enough
// to never trip during normal generation (even at higher MAX_OUTPUT_TOKENS),
// it only guards against a genuinely hung upstream request tying up a
// background job/process indefinitely.
const AI_CALL_TIMEOUT_MS = 240000; // 4 minutes

// ═══════════════════════════════════════════════════════════
//  RAW AI CALL  — returns plain text (no fence-parsing, no
//  post-processing). Used by the two-pass landing-page generator
//  so we can stitch two separate completions together cleanly.
//  Works with either provider via a shared `messages` array of
//  { role: 'user' | 'assistant', content: string }.
// ═══════════════════════════════════════════════════════════
const callAIRaw = async ({ messages, systemPrompt, maxTokens = MAX_OUTPUT_TOKENS, temperature = 0.9 }) => {
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;
  const preferOpenAI = process.env.PREFER_OPENAI === 'true';
  if (!anthropicKey && !openaiKey) throw new Error('No AI API key configured');

  const tryOpenAIRaw = async () => {
    if (!openaiKey) throw new Error('No OpenAI API key configured');
    const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
    const openai = new OpenAI({ apiKey: openaiKey, timeout: AI_CALL_TIMEOUT_MS });
    const response = await openai.chat.completions.create({
      model,
      messages: [{ role: 'system', content: systemPrompt }, ...messages],
      max_tokens: maxTokens,
      temperature,
    });
    const usage = response.usage;
    return {
      text: response.choices[0].message.content,
      finishReason: response.choices[0].finish_reason,
      usage: { promptTokens: usage.prompt_tokens, completionTokens: usage.completion_tokens, totalTokens: usage.total_tokens, cost: calculateCost(model, usage.prompt_tokens, usage.completion_tokens), model },
    };
  };

  if (openaiKey && preferOpenAI) {
    try { return await tryOpenAIRaw(); }
    catch (err) { logger.error(`[AI-RAW] OpenAI (preferred) failed: ${err.message}`); }
  }

  if (anthropicKey) {
    const anthropic = new Anthropic({ apiKey: anthropicKey });
    let lastErrStr = null;
    for (const model of CLAUDE_MODEL_CANDIDATES) {
      try {
        const response = await anthropic.messages.create({
          model, max_tokens: maxTokens, temperature,
          system: [{ type: 'text', text: systemPrompt, cache_control: { type: 'ephemeral' } }],
          messages,
        }, { headers: { 'anthropic-beta': 'prompt-caching-2024-07-31, max-tokens-3-5-sonnet-2024-07-15' }, timeout: AI_CALL_TIMEOUT_MS });
        const usage = response.usage;
        return {
          text: response.content[0].text,
          finishReason: response.stop_reason,
          usage: { promptTokens: usage.input_tokens, completionTokens: usage.output_tokens, totalTokens: usage.input_tokens + usage.output_tokens, cost: calculateCost(model, usage.input_tokens, usage.output_tokens), model },
        };
      } catch (err) {
        let msg = err.message || String(err);
        const jsonMatch = msg.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            const parsed = JSON.parse(jsonMatch[0]);
            if (parsed?.error?.message) msg = parsed.error.message;
            else if (parsed?.message) msg = parsed.message;
          } catch (_) {}
        }
        lastErrStr = msg;
        logger.error(`[AI-RAW] Claude failed (${model}): ${msg}`);
        if (!String(err.message).toLowerCase().match(/not_found|model:/)) break;
      }
    }
    if (openaiKey) {
      logger.warn('[AI-RAW] All Claude models failed, falling back to OpenAI');
      return await tryOpenAIRaw();
    }
    throw new Error(lastErrStr || 'All AI providers failed');
  }

  return await tryOpenAIRaw();
};

const mergeUsage = (a, b) => ({
  promptTokens: a.promptTokens + b.promptTokens,
  completionTokens: a.completionTokens + b.completionTokens,
  totalTokens: a.totalTokens + b.totalTokens,
  cost: a.cost + b.cost,
  model: b.model,
});

// ═══════════════════════════════════════════════════════════
//  TEXT AI CALL  (Haiku — JSON / short structured outputs)
// ═══════════════════════════════════════════════════════════
const callAIText = async (systemPrompt, userPrompt) => {
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;
  const TEXT_CALL_TIMEOUT_MS = 60000; // short-output calls should never legitimately take this long

  if (anthropicKey) {
    const client = new Anthropic({ apiKey: anthropicKey, timeout: TEXT_CALL_TIMEOUT_MS });
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
  const client = new OpenAI({ apiKey: openaiKey, timeout: TEXT_CALL_TIMEOUT_MS });
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
//  PROCEDURAL LAYOUT ENGINE
//  Instead of picking from a small fixed list (which repeats
//  fast — only 12×5=60 combos, birthday-paradox means you see
//  a repeat within ~8-10 generations), we build every page from
//  SIX independent axes that get combined fresh every call:
//    colorMode × heroLayout × cardStyle × accentMotif ×
//    typography × (randomly shuffled section order)
//  6 × 8 × 6 × 6 × 4 × (14-pick-5 shuffled permutations, which
//  alone is over 240,000 orderings) = effectively never repeats
//  in practice, even across thousands of generations.
// ═══════════════════════════════════════════════════════════

const COLOR_MODES = [
  { id: 'light-minimal', rule: 'Clean light body (#ffffff / #f9fafb) throughout. NO hero background image. Dark (#111) text everywhere. Brand color reserved for CTAs, icons, and small accents only.' },
  { id: 'dark-luxury', rule: 'Full dark theme throughout (#0d0d0d / #0f0f1a body). White or light-gray text everywhere except the form (which stays on a white card for readability). Glowing brand-color accents.' },
  { id: 'image-overlay', rule: 'Hero and 1-2 other sections use large full-bleed picsum photography with a dark gradient overlay (white text on top). Remaining sections are light with dark text. Never put dark text directly on an unoverlaid photo.' },
  { id: 'gradient-brand', rule: 'Hero and one closing section use a diagonal or radial primary→secondary brand gradient (white text on top). Body sections alternate light (dark text) and dark (white text) — always match text color to its own background.' },
  { id: 'glass-dark', rule: 'Deep dark gradient background (#1a0533 to #0a1628 style) runs through the whole page. Cards are frosted glass: backdrop-blur, translucent white border, white/#e2e8f0 text throughout.' },
  { id: 'warm-ivory', rule: 'Warm ivory/cream background (#faf8f4) throughout, no hero image, dark warm-brown/black serif text. Brand color used sparingly as a thin accent line or small badge, never as a large fill.' },
  { id: 'monochrome-pop', rule: 'Strictly black, white, and gray throughout the entire page. Only buttons, links, and tiny key accents use the primary brand color for a dramatic pop.' },
  { id: 'neon-cyber', rule: 'Extremely dark, almost black background (#000000). Bright neon primary and secondary colors used for glowing text, borders, and intense gradients. High contrast.' },
  { id: 'earthy-organic', rule: 'Soft sage greens, warm tans, and off-whites. Never use pure #fff or #000. Use muted brand colors and brown/dark-green text for a calming, natural feel.' },
  { id: 'vibrant-duotone', rule: 'High energy! Alternating sections of solid primary color (with white text) and solid white (with primary color text). Extremely bold blocking.' },
  { id: 'pastel-dream', rule: 'Very light, washed-out pastel backgrounds (light blue, light pink, pale yellow). Dark muted text. Soft, friendly, and approachable.' },
  { id: 'corporate-blue', rule: 'Classic trustworthy enterprise feel. White background, light gray sections, and a strong, deep navy/blue primary color. Clean and conservative.' }
];

const STANDALONE_FORM_STYLES = [
  'a 50/50 split layout: contact details (address, map, email) on the left, and the form on the right.',
  'a massive, perfectly centered card floating over a beautiful blurred background image.',
  'an inverted high-contrast section: background color deeply contrasts the page body, with appropriately contrasting text.',
  'a minimalistic, borderless form where inputs are just single bottom-border lines (no boxes).',
  'an asymmetric overlapping layout: the form card overlaps an image collage next to it.',
  'a stark typography-led layout: massive "SAY HELLO" text running down the left side vertically, form on the right.',
  'a grid layout: the inputs are arranged in a multi-column CSS grid instead of just stacking vertically.',
  'a playful skeuomorphic style: inputs look like pressed physical buttons or paper slots.',
  'a two-tone split background: the left half of the screen is primary color, the right half is white. The form sits exactly in the middle.',
  'a highly padded, premium museum feel: tiny form in the absolute center surrounded by massive white space.'
];

const HERO_LAYOUTS = [
  'Full-viewport split roughly 55/45: headline+CTA on one side, a large image or product mock on the other.',
  'Centered hero with no image — massive headline, short subtext, one CTA, small decorative kicker/badge above the headline.',
  'Full-bleed background treatment (image or gradient per the color mode), centered text, strong overlay so text stays readable.',
  'Asymmetric ~70/30 split where the image bleeds off the edge of the viewport.',
  'Two-panel hero: one solid-color panel with a short benefits list, the other panel shows a product/photo mock.',
  'Bottom-anchored text sitting over a full-bleed image or gradient, gradient fades from transparent at top to solid at bottom.',
  'Offset/overlapping composition — a small stat card or badge visually overlaps the corner of the hero image.',
  'Slanted-feel hero using an angled CSS gradient background (NOT clip-path) instead of a photo.',
  'Ultra-wide masonry: headline on top left, followed by a beautiful 3-image collage taking up the right half of the hero.',
  'Floating central card: the entire hero content sits inside a massive, elevated rounded-3xl card floating over a blurred background.',
  'Dual-CTA split: headline in center, with two equally prominent buttons (primary and secondary) side-by-side below it.',
  'Side-navigation feel: title and text pressed hard against the left edge in a narrow column, massive bleeding image on the right.',
  'Text-heavy editorial hero: huge drop-cap, multiple paragraphs of compelling copy, a subtle abstract illustration on the side.',
  'Grid-locked hero: The hero is split into 4 distinct quadrants (boxes with borders) containing text, image, stats, and CTA respectively.',
  'Vertical split: Top half is a solid high-contrast color with bright text, bottom half is a massive panoramic image.',
  'Circular cutout: A massive circular image mask on the right, with sleek typography wrapping on the left.',
  'Video-player mockup: A huge 16:9 faux-video player in the center, with the headline sitting elegantly above it.',
  'Search-bar focus: Instead of a normal CTA button, the hero features a massive, prominent search input bar in the center.',
  'Diagonal split: An angled background gradient separating a solid color top left from an image bottom right (using standard CSS gradients, NO clip-path).',
  'Marquee background: The background of the hero is a continuous scrolling marquee of huge, faint typography.',
  'Bottom-up layout: The main headline is pushed to the absolute bottom left of the hero section, overlapping the next section.',
  'Floating elements: Small floating avatars, icons, and stat-bubbles scattered randomly around a centered headline.',
  'Step-by-step hero: Headline on left, and a quick 3-step visual process diagram (1-2-3) on the right.',
  'Interactive terminal: For dev tools, a faux code-editor window dominating the right half of the screen.',
  'Typographic poster: No imagery, just extremely huge, tightly-spaced, beautifully set typography filling the entire viewport.',
  'Layered depth: Foreground text, middle-ground cutout image, background subtle pattern—creating a 3D parallax feel.',
  'Split screen with alternating scroll: Left side is sticky with the headline, right side shows a grid of small images.',
  'Hero with side-tabs: A large hero area with vertical navigation tabs on the far right edge to switch content.',
  'Magazine cover: Massive headline behind a cutout portrait image, overlapping the text like a fashion magazine.',
  'Minimalist wireframe: Stripped back, thin borders, blueprint aesthetic with raw text and structural outlines.',
  'Immersive focal mode: Deep solid background matching the color theme, single glowing gradient orb behind a contrasting headline.',
  'Polaroid scatter: Headline on the left, right side features a scattered pile of polaroid-style image frames.',
  'Data dashboard: Right half of the hero is a complex, beautiful, semi-transparent UI dashboard mockup.',
  'Typographic portrait: The shape of the text block forms a silhouette, or text wraps tightly around an irregular image.',
  'Horizontal scroll teaser: Hero that suggests horizontal movement, with items bleeding off the right edge of the screen.'
];

const CARD_STYLES = [
  'rounded-2xl cards with soft diffused shadows',
  'sharp rounded-none cards with bold 2-3px borders (neo-brutalist feel)',
  'frosted glass cards — translucent background, backdrop-blur, thin light border',
  'borderless content blocks separated only by generous whitespace and a thin 1px divider line',
  'cards with a single colored accent bar along the top edge',
  'pill/rounded-full badges and capsule-shaped containers',
  'cards with subtle inner-shadows (inset) and thick padding',
  'cards wrapped in a glowing, semi-transparent brand-color border',
  'asymmetric borders: thick left border, no other borders, light background fill',
  'overlapping stacked cards effect (using absolute positioning or negative margins)',
  'monochrome high-contrast cards with vibrant neon text/icon highlights',
  'cards with a harsh drop shadow (e.g., box-shadow: 8px 8px 0px var(--primary))',
  'cards that look like torn paper or have jagged SVG edges',
  'hyper-minimalist cards: no background, no border, just an icon and text floating in space',
  'cards with a gradient border mask (border is a gradient, background is solid)',
  'skeuomorphic cards: subtle gradients and highlights to look like physical plastic or metal',
  'origami cards: folded corner effects using CSS triangles',
  'cards with a massive, faded watermark icon filling the background',
  'two-tone cards: top half is image/color, bottom half is white text area, sharp division',
  'interactive-lift cards: designed to look pressed down, lifting up on hover',
  'cards wrapped in dotted or dashed borders for a playful/blueprint feel',
  'cards with extreme padding (p-12 or p-16) for a highly spacious, premium museum feel',
  'textured cards with a subtle noise/grain texture overlay matching the background',
  'cards that are perfectly square (aspect-square) regardless of content',
  'cards shaped like arches (rounded-t-full, straight bottom)'
];

const ACCENT_MOTIFS = [
  'a few large blurred brand-color gradient orbs positioned absolutely in the background (blur-3xl, opacity-20)',
  'a faint grid-line pattern overlay behind the background',
  'thin dashed divider lines separating sections',
  'large ghost/outline numerals or icons behind section headings',
  'small uppercase tracked-out brand-color kicker labels above every section heading',
  'no extra decoration at all — pure typography, whitespace, and color carry the design',
  'subtle abstract SVG wave shapes at the top and bottom boundaries of sections',
  'tiny plus (+) signs forming a subtle repeating pattern in the background',
  'sharp diagonal slashes acting as separators between columns',
  'a persistent thin border around the entire viewport (body framed in a box)',
  'colored dot matrices (halftone patterns) floating in corners of sections',
  'vertical typography running down the left and right margins of the page',
  'massive oversized quotation marks used purely as background decoration',
  'retro 8-bit style pixelated accents or borders',
  'hand-drawn/scribbled SVG arrows pointing to important elements'
];

const TYPOGRAPHY_PAIRS = [
  'massive bold sans-serif headlines with tracking-tighter, clean sans-serif body text',
  'large serif display headlines paired with simple sans-serif body text (editorial feel)',
  'uppercase tracked-out headlines paired with normal-case body text (structured, technical feel)',
  'mixed-weight headlines (a thin word next to a bold word in the same line) with sans-serif body text',
  'monospaced technical fonts for headlines, clean sans-serif for body',
  'ultra-thin elegant sans-serif headlines with slightly thicker body text',
  'italicized serif headlines mixed with brutalist heavy sans-serif subheadings',
  'all-lowercase massive, friendly sans-serif headlines',
  'condensed, tall, and tight sans-serif headlines (like Impact or Anton style)',
  'playful rounded sans-serif fonts for a friendly, approachable SaaS feel'
];

const INTERACTION_EFFECTS = [
  'Cards and images slightly scale up (hover:scale-105) with a smooth transition (transition-transform duration-300). Buttons have a subtle hover shadow.',
  'Elements lift aggressively on hover (-translate-y-2) with a harsh drop shadow appearing underneath (hover:shadow-[8px_8px_0_0_#000]).',
  'Buttons feature a subtle internal gradient that shifts on hover. Cards glow slightly with the brand color on hover (hover:shadow-[0_0_15px_var(--primary)]).',
  'Links feature an animated underline that expands from left to right on hover. Images have a very slow, continuous zoom-in effect inside a fixed container (overflow-hidden).',
  'Cards tilt slightly (using transform rotate) or skew when hovered for a dynamic, playful feeling.',
  'Buttons are magnetic-style: very rounded (rounded-full) and they slightly shrink (hover:scale-95) when clicked. Cards have no hover effect, keeping it extremely static and editorial.',
  'Everything feels hyper-responsive: extremely fast transitions (duration-150), bright hover text colors, and prominent outline rings on focus/hover.',
  'Images turn from grayscale to full-color on hover (grayscale hover:grayscale-0). Buttons have an arrow icon that slides 4px to the right on hover (group-hover:translate-x-1).'
];

const SECTION_TRANSITIONS = [
  'Use harsh diagonal angled cuts (achieved via rotated SVG shapes or angled CSS gradients, NEVER clip-path) to transition between sections instead of straight horizontal lines.',
  'Use beautiful fluid SVG wave dividers at the top and bottom of dark sections to create a liquid, organic flow.',
  'Use slight overlapping negative margins so sections visually break out of their horizontal boundaries and overlap the section above them.',
  'Keep section dividers perfectly straight and flat, but use a thick 4px border-bottom in the primary color between every single section.',
  'Use jagged, torn-paper style SVG dividers between sections for a grunge/creative aesthetic.',
  'No background color changes between sections; the entire page flows as one continuous canvas separated only by massive whitespace.',
  'Use staggered overlapping rectangles so the transition between sections looks like a solid staircase.',
  'Every section is a standalone "card" with rounded corners floating on a universal background color (e.g. gray body, white sections).'
];

// Pool of possible middle-page sections. Hero, the contact form, and the
// footer are always present and are NOT part of this pool. Every generation
// shuffles this pool and takes 5 of them in random order — with 14 items,
// C(14,5) × 5! (order matters) gives well over 240,000 distinct sequences.
const SECTION_POOL = [
  'Trust bar: horizontal scrolling logo/credential marquee',
  'Trust bar: grayscale logos in a static, perfectly centered 5-column grid',
  'Stats row: 3-4 bold large numbers with short labels',
  'Stats row: huge typographic numbers running off the edge of the screen',
  'Features: asymmetric bento-grid cards (mixed col-spans, varied sizes)',
  'Features: zig-zag rows alternating image-left/text-right then text-left/image-right',
  'Features: clean 3-column icon + heading + paragraph cards',
  'Features: 4-column ultra-minimalist grid (tiny icon, huge title, no border)',
  'Features: vertical list with massive numbers (01, 02, 03) anchoring each row',
  'Features: interactive-looking horizontal tabs (design it to look like clicked tabs)',
  'Features: single massive feature block with a side-by-side overlapping image collage',
  'Features: inverted contrast section highlighting 3 core benefits with glowing icons',
  'About/Story: full-bleed image with an overlaid text caption box on the bottom right',
  'About/Story: split 50/50 screen with a rich background color on the text side',
  'About/Story: narrow, centered single column of beautiful editorial text (like a magazine)',
  'About/Story: large founder portrait on left, personal signature and quote on right',
  'Process: numbered step timeline, vertical or horizontal',
  'Process: 3 connected overlapping circles or interconnected cards',
  'Process: zigzag stepping stones design leading down the page',
  'Testimonials: masonry layout with uneven card heights',
  'Testimonials: one large featured quote plus 2-3 smaller supporting quotes',
  'Testimonials: staggered/offset 2-column grid of quote cards',
  'Testimonials: horizontally scrolling overflow row of square review cards',
  'Testimonials: single massive, dramatic quote centered on screen with a large avatar',
  'Gallery: horizontal scrolling image showcase (flex-row overflow-x-auto)',
  'Gallery: 2x2 or 3x2 image grid with short captions',
  'Gallery: asymmetrical collage (one huge image, two small stacked images)',
  'FAQ: accordion section using accordion-item / accordion-header / accordion-content classes',
  'FAQ: 2-column grid of raw text questions and answers (no boxes, just pure text)',
  'FAQ: sidebar with a sticky heading on the left, questions scrolling on the right',
  'Pricing or package comparison: 2-3 simple plan cards',
  'Pricing: single premium package breakdown (one large, highly detailed card)',
  'Video Placeholder: A massive 16:9 black box with a centered play icon (use an SVG) mimicking a video player',
  'Call to Action: A narrow, highly-colored banner stripping across the page with a single button',
  'Mission Statement: A massive full-screen bold typographic statement, no images',
];

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

/**
 * Builds one fully-random "recipe" for a single generation.
 * Called fresh on every request — nothing here is cached or reused.
 */
const buildLayoutRecipe = () => {
  const colorMode = pick(COLOR_MODES);
  const heroLayout = pick(HERO_LAYOUTS);
  const cardStyle = pick(CARD_STYLES);
  const accentMotif = pick(ACCENT_MOTIFS);
  const typography = pick(TYPOGRAPHY_PAIRS);
  const interaction = pick(INTERACTION_EFFECTS);
  const transition = pick(SECTION_TRANSITIONS);

  const featureSections = SECTION_POOL.filter(s => s.startsWith('Features:'));
  const testimonialSections = SECTION_POOL.filter(s => s.startsWith('Testimonials:'));
  const otherSections = SECTION_POOL.filter(s => !s.startsWith('Features:') && !s.startsWith('Testimonials:'));

  // Guarantee at least 1 Feature and 1 Testimonial section for a high-converting baseline
  let middleSections = [
    pick(featureSections),
    pick(testimonialSections),
    ...shuffle(otherSections).slice(0, 3)
  ];
  middleSections = shuffle(middleSections);

  return { colorMode, heroLayout, cardStyle, accentMotif, typography, interaction, transition, middleSections };
};

// ═══════════════════════════════════════════════════════════
//  SYSTEM PROMPT
// ═══════════════════════════════════════════════════════════
const buildSystemPrompt = (chaosToken) => `
You are an absolute legend: a veteran Principal UI Engineer and Creative Director with over 30 years of elite development experience crafting world-class, premium enterprise and SaaS websites.
Your goal is to build a clean, modern, ultra-premium, high-converting landing page that feels trustworthy, professional, and visually stunning. Your layouts must reflect absolute mastery of CSS grids, flawless semantic HTML5, fluid responsive design, beautiful whitespace, and high-end typography.

Every line of code you write is a masterclass in frontend development. Every page you build looks like it was meticulously hand-crafted by an elite team at a top global agency over months — not generated. It has a clear visual identity, professional copy, and absolute pixel-perfect precision.

CHAOS SEED: ${chaosToken}
This seed shapes your creative decisions. Every generation must feel genuinely fresh and different from any other — you will be given a specific LAYOUT RECIPE and SECTIONS LIST below; follow them exactly, do not default to a generic "safe" layout.

🚫 FORBIDDEN BAD PRACTICES (NEVER USE):
- NEVER USE plain text without proper padding or margins.
- NEVER USE outdated, ugly color combinations. Always keep it harmonious.
- NEVER cramp elements together. Always use generous whitespace (e.g. py-24).
- NEVER reuse the exact same hero/section pattern you might default to — actively follow the LAYOUT RECIPE given to you.
- NEVER CREATE A GENERIC DESIGN: Every generation MUST look visually distinct and structurally unique compared to a standard corporate site. Force asymmetrical layouts or overlapping elements if the recipe allows it!
- EXTREME STRUCTURAL VARIETY REQUIRED: Every single section on the page MUST have a completely different internal HTML structure and grid layout from the others. If one section uses a 2-column grid, the next MUST use an overlapping masonry layout, a full-bleed asymmetric background, or horizontal scrolling cards. DO NOT repeat the same basic flex/grid layouts. Be wildly creative with Tailwind classes!

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

3. PREMIUM MINIMALIST FOOTER AT THE BOTTOM (MANDATORY):
- Every landing page MUST go all the way down to the bottom and end with a beautiful, custom, high-end Minimalist Footer section wrapped in a real <footer> tag.
- The footer should include the logo tag \`<img src="{{LOGO_URL}}" alt="Logo" class="h-14 w-auto object-contain">\`, a clean address or contact info line (phone & email), simple social icons, and a copyright notice.
- 🚨 COPYRIGHT RULE: Use EXACTLY the copyright text found in the user's website content if available. DO NOT add the current year or make up your own copyright string! If no copyright is provided, just write "© BrandName. All rights reserved." without any year.

4. STRICT BRAND COLORS & VARIABLES:
- YOU MUST NEVER USE hardcoded Tailwind colors like \`bg-blue-600\`, \`text-red-500\`, or \`bg-green-500\`.
- You MUST ONLY use the CSS variables \`var(--primary)\` and \`var(--secondary)\` for all branding, buttons, accents, and highlights! (e.g., \`bg-[var(--primary)]\`, \`text-[var(--secondary)]\`).
- This is critical so the user's selected brand colors are automatically applied!

5. PREMIUM & HIGH-CONVERTING STRUCTURE (CRITICAL):
- Use proven, high-converting web layouts, but strictly following the SECTIONS LIST you are given — do not invent your own section order unless explicitly requested by the user.
- 🚨 DEFAULT LANDING PAGE RULE: If the user provides a very short prompt like "landing page", you MUST automatically ensure the page feels complete. It must have a strong Hero, clear Features/Benefits, Trust-building Testimonials, an FAQ, and a Lead Form, even if they didn't explicitly list them.
- Keep structural elements clean and modern (rectangles, rounded-2xl or rounded-3xl corners, clean grids) UNLESS the LAYOUT RECIPE explicitly says otherwise.
- YOU MUST USE RICH PLACEHOLDER IMAGES in your designs! Use \`https://picsum.photos/1200/800?random=N\` (change N for every image, never reuse the same number twice on one page). Every page must have beautiful, large photos.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 NAVBAR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Sticky. Contains ONLY:
  Left: <img src="{{LOGO_URL}}" id="page-logo" alt="Logo" style="height:6rem; max-width:300px; width:auto; object-fit:contain">
  Right: ONE styled CTA button
Nothing else. No links. No hamburger menu. Ultra-minimal premium.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 HERO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Follow the LAYOUT RECIPE hero description exactly.
Contains: H1 headline + subparagraph + ONE CTA button (unless the form placement below says the form goes in-hero).
Image backgrounds: use picsum.photos/1600/900?random=[N]
Ensure text is completely readable against the background (e.g., use a dark overlay for white text, or a light frosted overlay for dark text).

INTERACTIVE ACCORDIONS & FORMS (NO JS REQUIRED):
- We automatically inject JavaScript for FAQs and Form validation. You DO NOT need to write any script tags for interactivity.
- Your HTML MUST use these exact classes for FAQs: \`accordion-item\`, \`accordion-header\`, and \`accordion-content hidden\`.
- 🚨 CRITICAL FAQ RULE: You MUST include a FontAwesome icon (e.g., \`<i class="fa-solid fa-plus"></i>\` or \`<i class="fa-solid fa-chevron-down"></i>\`) inside EVERY \`accordion-header\`! Without this icon, the accordion will NOT open.
- 🚨 MAXIMUM ONE FORM PER PAGE: You must generate EXACTLY ONE lead/contact form on the entire page. The <form> tag MUST have id="contact-form".
- FORM STRUCTURE: Make the form look premium. ALL form fields must have the \`required\` attribute (e.g. \`<input type="text" required>\`) so our backend validation script catches them.

ULTRA-PREMIUM UI/UX FINISH (MANDATORY & CRITICAL):
You MUST design at an "Awwwards-winning" luxury agency level. Generic designs are unacceptable.
- WHITESPACE IS LUXURY: Use massive padding (e.g., \`py-32\`, \`py-40\`, \`gap-16\`). Let elements breathe. NEVER cramp text.
- TYPOGRAPHY AS ART: Use extreme typographic contrast. Use \`tracking-tighter\` for massive 6xl+ headings, and \`tracking-widest uppercase text-[10px] font-bold text-[var(--primary)]\` for small kickers/subheadings.
- PREMIUM BACKGROUNDS: Do not just use flat solid colors. Use subtle radial gradients, mesh gradients, or abstract soft glowing orbs (e.g. absolute divs with \`bg-[var(--primary)] blur-3xl opacity-20\`). Ensure it matches the requested COLOR MODE.
- GLASSMORPHISM & BORDERS: Use \`backdrop-blur-md\` and subtle borders for cards when placed on top of images or complex gradients to maintain readability.
- OVERLAPPING LAYOUTS: Break out of the box! Make images overlap into the section above/below using negative margins (\`-mt-16\`) or absolute positioning.
- GRADIENT TEXT: Use gradient text for key emphasis in headlines: \`bg-clip-text text-transparent bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]\`.
- SHADOWS & DEPTH: Use ultra-soft, diffused shadows (e.g. \`shadow-[0_30px_60px_rgba(0,_0,_0,_0.08)]\`) and scale effects.
- 🚨 FORBIDDEN CSS (CRITICAL): NEVER use \`clip-path\`, \`polygon\`, or \`diagonal-slice\`. Clip paths break the GrapesJS editor UI rendering! Keep containers as standard rectangles with rounded corners (unless LAYOUT RECIPE says no border-radius).
- 🚨 NO WOW.JS: DO NOT use the \`wow.js\` library or \`wow\` classes. ONLY use AOS for scroll animations!
- MICRO-INTERACTIONS: Every button and card MUST have a premium hover state (e.g. \`transition-all duration-700 ease-out hover:-translate-y-2 hover:shadow-2xl\`).
- SCROLL ANIMATIONS: ONLY use AOS for scroll animations (data-aos="fade-up"). 🚨 CRITICAL: NEVER write your own custom CSS for animations (e.g. NEVER write [data-reveal] or opacity: 0 rules). Custom opacity: 0 rules break the editor! ALWAYS use AOS via CDN (<link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚙️ TECHNICAL REQUIREMENTS:
- Tailwind CDN: <script src="https://cdn.tailwindcss.com"></script>
- FontAwesome 6 for icons: <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
- Google Fonts: Dynamically load the selected font pairing stylesheet in <head>
- Brand colors via CSS variables: --primary and --secondary ONLY
- Fully responsive, complete, and stunning HTML output.
- 📱 MOBILE FIRST: use \`grid-cols-1 md:grid-cols-2 lg:grid-cols-X\` or \`flex-col md:flex-row\` everywhere. If you use \`flex\` for rows, you MUST add \`flex-wrap\` so content never overflows on small screens! Never let elements break the viewport width.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📤 OUTPUT FORMAT & TWO-PART GENERATION (CRITICAL):
IMPORTANT: All generated text content MUST be in English only. Do not use Hindi or any other language.
🚨 THIS PAGE IS BUILT ACROSS TWO SEPARATE RESPONSES FROM YOU (PART 1 and PART 2), so it never runs out of budget before reaching the footer. Each user message below will tell you exactly which part you are writing and which sections belong ONLY to that part. Never write a section that isn't listed for the CURRENT part, and never write a section twice.
- NEVER write massive inline SVG codes. ALWAYS use FontAwesome 6 classes (e.g., <i class="fa-solid fa-star"></i>).
- NEVER use Tailwind's arbitrary URL classes for background images (e.g. \`bg-[url('...')]\`). You MUST use inline styles for background images (e.g. \`<div style="background-image: url('...')">\`). This is critical to prevent CSS parser crashes.
- Keep your HTML DOM structure clean and avoid excessively deep nested divs.
- Do NOT generate excessively long placeholder text. Keep text punchy and concise — 1-2 sentences per paragraph max.
- 🚨 OUTPUT RAW HTML ONLY. Do NOT wrap your response in markdown code fences (no \`\`\` anywhere). Do NOT add any explanation, commentary, or preamble — start your response directly with HTML markup (or, in Part 2, directly with the next section's opening tag).
- Follow the per-part instructions given in each user message exactly — they tell you precisely where to start and stop.
`;

// ─── USER PROMPT ─────────────────────────────────────────────────────────────────
const buildBrandingLines = (input, recipe) => {
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
  if (input.logoUrl || input.branding?.logoUrl) {
    const actualLogo = input.logoUrl || input.branding?.logoUrl;
    lines.push(`LOGO URL (actual): ${actualLogo}`);
    lines.push(`🚨 CRITICAL LOGO RULE: You MUST use exactly this URL for all logos in the navbar and footer: <img src="${actualLogo}" alt="Logo">. NEVER use a placeholder text or different image for the logo!`);
  } else {
    lines.push(`🚨 CRITICAL LOGO RULE: You MUST use exactly this code for all logos in the navbar and footer: <img src="{{LOGO_URL}}" id="page-logo" alt="Logo">`);
  }

  // ── AUTONOMOUS DESIGN FREEDOM ──
  lines.push(
    `\n━━━ DYNAMIC DESIGN FREEDOM (INVENT A UNIQUE DESIGN LANGUAGE) ━━━`,
    `AUTONOMOUS DESIGN: Do NOT use a standard or fixed layout! You MUST invent a COMPLETELY UNIQUE, ultra-premium design language for this specific page.`,
    `COLOR MODE & THEME: ${recipe.colorMode?.rule || 'Use a clean light theme with dark text and brand color accents.'}`,
    `🚨 STRICT COLOR COMMAND: You MUST strictly obey the COLOR MODE & THEME above. If it asks for a LIGHT theme, you are completely FORBIDDEN from using dark backgrounds (bg-gray-900, bg-black, etc). If it asks for a light theme, text must be dark (text-gray-900). Failing to follow this theme is a catastrophic failure.`,
    `HERO LAYOUT: Invent a unique, high-converting hero section (e.g., overlapping images, asymmetrical splits, glassmorphism, or immersive full-bleed backgrounds).`,
    `CARD / CONTAINER STYLE: Invent a beautiful card style (e.g., neo-brutalist borders, soft diffused shadows, frosted glass, or minimal floating elements) and apply it consistently.`,
    `DECORATIVE ACCENT: Add unique decorative elements (e.g., glowing background orbs, faint grid-lines, overlapping shapes, or minimalist typography patterns).`,
    `SECTION TRANSITIONS: ${recipe.transition || 'Use dynamic fluid SVG waves or staggered overlaps between sections to break the boxy grid look (NO clip-paths).'}`,
    `MICRO-INTERACTIONS: ${recipe.interaction || 'Ensure buttons have premium hover states and cards use subtle transform transitions.'}`,
    `SECTION VARIETY: Make every section structurally different from the others. Surprise me with creative use of CSS grids, negative margins, and Tailwind classes.`
  );

  return lines;
};

// ─── PHASE 1 PROMPT: <head> + navbar + hero + first half of sections ──────────────
// 🔧 FIX: now accepts `formCtx` = { formInHero, formInPart1, fields, submitLabel, placement } so that when
// placement === 'in-hero' the form is actually written into the hero here in Part 1
// (previously the form was ALWAYS inserted somewhere inside Part 2's sections,
// no matter what `placement` said — 'in-hero' was silently ignored).
const buildUserPromptPart1 = (input, recipe, sectionsPart1, sectionsPart2Count, formCtx = {}) => {
  const { formInHero = false, formInPart1 = false, fields = [], submitLabel = 'Send Message', placement = '' } = formCtx;

  const faqNudges = [
    'FAQ DESIGN: Use a strict 2-column grid. No backgrounds on the items, just clean subtle bottom borders.',
    'FAQ DESIGN: Place the FAQs in a narrow, elegant card floating over a large background image.',
    'FAQ DESIGN: Use a completely dark, immersive background for the FAQ section with glowing border highlights on the active item.',
    'FAQ DESIGN: Put the FAQ title and a massive image on the left half of the screen, and the accordion items stacked tightly on the right half.',
    'FAQ DESIGN: Use a stark minimalist approach. Huge bold typography for the questions, no boxes, just pure text and subtle icons.'
  ];
  const randomFaqNudge = faqNudges[Math.floor(Math.random() * faqNudges.length)];

  const lines = buildBrandingLines(input, recipe);
  lines.push(`🧩 ${randomFaqNudge} (only relevant if a FAQ section appears in THIS part's list below)`);
  lines.push(`CRITICAL RULE: You must design a highly professional, modern, and trustworthy layout tailored to this specific business.`);

  // 🔧 FIX: form-in-hero support — previously 'in-hero' placement was chosen
  // randomly by resolveForm() but never actually honored anywhere in the code.
  if (formInHero) {
    const heroFormStyles = [
      'positioned on the RIGHT side of the hero, balancing the text on the left.',
      'positioned on the LEFT side of the hero, with the main headline/image on the right.',
      'designed as a floating, semi-transparent OVERLAY card directly on top of the hero background image.',
      'placed dead-center below the headline as a sleek, wide, inline horizontal form.',
      'built into a dark Sidebar on the edge of the hero section.',
      'placed inside a glassmorphism card overlapping the bottom edge of the hero.'
    ];
    const randomHeroFormStyle = heroFormStyles[Math.floor(Math.random() * heroFormStyles.length)];

    lines.push(`\n━━━ CONTACT FORM GOES IN THE HERO (MANDATORY) ━━━`);
    lines.push(`The Hero section (Section 1) MUST include an inline contact form ${randomHeroFormStyle} — it must sit naturally within the hero layout.`);
    lines.push(`The <form> tag MUST have id="contact-form".`);
    lines.push(`You MUST integrate exactly these fields: ${JSON.stringify(fields)}`);
    lines.push(`The submit button MUST have text: "${submitLabel}".`);
    lines.push(`All required fields must have the \`required\` attribute.`);
    lines.push(`This is the ONLY form on the page — do not add another one anywhere else. There is no separate Contact/Form section in Part 2.`);
  }

  if (input.aiPrompt) {
    lines.push(`\n━━━ USER'S SPECIFIC INSTRUCTIONS ━━━`);
    lines.push(`The user has explicitly requested: "${input.aiPrompt}"`);
    lines.push(`🚨 CRITICAL INSTRUCTION: You MUST incorporate the user's specific request into the page copy, design, and sections! If they ask for specific sections (e.g. pricing, testimonials, features, maps), you must weave them into the layout and content, even if it means modifying the randomly assigned sections below.`);
  }

  if (input.websiteContent) {
    lines.push(`\n━━━ SCRAPED WEBSITE CONTENT (use real names, facts, copy from this) ━━━`);
    lines.push(input.websiteContent.substring(0, 3500));
  }

  let listedSections = [];

  if (input.aiPrompt && input.aiPrompt.includes('EXACTLY 6 sections')) {
    // If the industry prompt is strict, we ONLY build exactly what it says.
    listedSections = [
      'Section 1 (Hero): follow the HERO LAYOUT above',
      ...sectionsPart1.map((s, i) => `Section ${i + 2}: ${s}`)
    ];
  } else {
    listedSections = [
      'Section 1 (Hero): follow the HERO LAYOUT above' + (formInHero ? ' — INCLUDING the inline contact form described above' : ''),
      ...sectionsPart1.map((s, i) => `Section ${i + 2} (${s.split(':')[0]}): ${s}`),
    ];
  }

  if (formInPart1 && !formInHero && fields && fields.length > 0 && !(input.aiPrompt && input.aiPrompt.includes('EXACTLY 6 sections'))) {
    const placementLabel = `CONTACT FORM PLACEMENT: ${placement}`;
    const formInsertIndex = Math.floor(Math.random() * (listedSections.length + 1));
    listedSections.splice(formInsertIndex, 0, `Section (Contact/Form): ${placementLabel}`);
  }

  // Re-number sequentially
  const renumberedSections = listedSections.map((s, i) => s.replace(/Section \d+ \(/, `Section ${i + 1} (`).replace('Section (', `Section ${i + 1} (`));

  lines.push(`\n━━━ SECTIONS FOR THIS PART (WRITE ONLY THESE, IN THIS ORDER) ━━━`);
  lines.push(renumberedSections.join('\n'));

  if (formInPart1 && !formInHero && fields && fields.length > 0) {
    lines.push(`\n━━━ CONTACT FORM REQUIREMENTS ━━━`);
    lines.push(`Design a beautiful Contact Form for the section labeled (Contact/Form).`);
    lines.push(`You MUST integrate these fields: ${JSON.stringify(fields)}`);
    lines.push(`The form MUST have id="contact-form" on the <form> tag.`);
    lines.push(`The submit button MUST have text: "${submitLabel}".`);
    const randomFormStyle = STANDALONE_FORM_STYLES[Math.floor(Math.random() * STANDALONE_FORM_STYLES.length)];
    lines.push(`Adapt the layout to fit the section seamlessly. Specifically, design it as: ${randomFormStyle}`);
  }

  lines.push(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
THIS IS PART 1 OF 2 — FOLLOW THESE RULES EXACTLY:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Output RAW HTML ONLY. Do NOT wrap your answer in markdown code fences (no \`\`\`). Do NOT add any explanation, comments, or preamble outside the HTML.
2. Write, IN ORDER: <!DOCTYPE html>, <html>, a complete <head> (Tailwind CDN, FontAwesome, Google Fonts, AOS CSS, <title>, CSS variables for --primary/--secondary), the opening <body>, the sticky navbar (logo left + one CTA button right, nothing else), then EXACTLY the sections listed above in "SECTIONS FOR THIS PART" — nothing more.
3. ${formInHero ? 'The contact form is already written INSIDE the hero section as instructed above. Do NOT write a separate contact-form section later.' : formInPart1 ? 'Do NOT write a footer.' : 'Do NOT write the contact form. Do NOT write a footer.'} Do NOT write closing </body> or </html> tags. Do NOT write the AOS init script.
4. Simply STOP writing immediately after the closing tag of the last section listed above. There will be a PART 2 that continues this exact document — a total of ${sectionsPart1.length + sectionsPart2Count} content sections plus a footer${formInPart1 ? '' : ' plus a contact form'} are still to come, but NOT in this response.
5. 📱 Mobile-first responsive classes throughout (grid-cols-1 md:grid-cols-2 lg:grid-cols-X, flex-col md:flex-row).
6. Name your visual concept in an HTML comment right after <body>: <!-- RECIPE: ${recipe.colorMode.id} / ${recipe.cardStyle.slice(0, 30)}... -->
7. CRITICAL CTA BEHAVIOR: Every single "Call to Action" button across the entire page (in the navbar, hero, or sections) MUST have \`href="#contact-form"\`. Do not use "#contact" or "#form".
8. Write REAL, industry-specific copy — not generic filler text. Keep paragraphs to 1-2 punchy sentences.
`);

  return lines.join('\n');
};

// 🔧 FIX #1: now receives `formInHero` — if the form was already written into the
//    hero in Part 1, we must NOT insert another Contact/Form section here.
// 🔧 FIX #2: now also receives and forwards `input.websiteContent` — previously
//    Part 2 (which usually contains Features/Testimonials/FAQ/Pricing) had NO
//    access to the scraped business content at all, so the AI fell back to
//    generic filler copy for most of the page.
const buildUserPromptPart2 = (input, recipe, sectionsPart2, fields, submitLabel, placement, sectionsPart1Count, formInHero = false, formInPart1 = false) => {
  const placementLabel = `CONTACT FORM PLACEMENT: ${placement}`;

  const lines = [
    `Continue the SAME landing page from PART 1 above. Do NOT repeat any earlier HTML (the <head>, navbar, hero, or earlier sections are already written — you have them as context). Continue writing EXACTLY where PART 1 left off.`,
    `\n━━━ DYNAMIC DESIGN FREEDOM REMINDER ━━━`,
    `Remember: Do NOT use a fixed, hardcoded layout! Continue using the completely unique, ultra-premium design language you invented in PART 1.`,
    `Make sure every new section generated in this part has a structurally different internal HTML layout from the previous ones!`,
  ];

  if (input.aiPrompt) {
    lines.push(`\n━━━ USER'S SPECIFIC INSTRUCTIONS (REMINDER) ━━━`);
    lines.push(`The user requested: "${input.aiPrompt}"`);
    lines.push(`🚨 Make sure to fulfill these requirements in the remaining sections below!`);
  }

  // 🔧 FIX: give Part 2 the same scraped business content as Part 1, so
  // Features / Testimonials / FAQ / Pricing sections stay factually relevant
  // to the actual website instead of generic AI filler.
  if (input.websiteContent) {
    lines.push(`\n━━━ SCRAPED WEBSITE CONTENT (use real names, facts, copy from this — do NOT invent generic filler) ━━━`);
    lines.push(input.websiteContent.substring(0, 3500));
  }

  let listedSections = [];
  if (input.aiPrompt && input.aiPrompt.includes('EXACTLY 6 sections')) {
    listedSections = sectionsPart2.map((s, i) => `Section: ${s}`);
  } else {
    listedSections = sectionsPart2.map((s, i) => `Section (${s.split(':')[0]}): ${s}`);
  }

  // 🔧 FIX: only insert a separate Contact/Form section when the form is NOT
  // already generated in Part 1 (either in hero or as a standalone section).
  // AND DO NOT insert it if we are strictly following industry prompts 6 sections
  if (!formInPart1 && !(input.aiPrompt && input.aiPrompt.includes('EXACTLY 6 sections'))) {
    // Randomly insert the form among the remaining sections in Part 2, instead of always at the very end
    const formInsertIndex = Math.floor(Math.random() * (listedSections.length + 1));
    listedSections.splice(formInsertIndex, 0, `Section (Contact/Form): ${placementLabel}`);
  }

  // Re-number sequentially
  const renumberedSections = listedSections.map((s, i) => s.replace('Section (', `Section ${sectionsPart1Count + i + 2} (`));

  lines.push(`\n━━━ SECTIONS FOR THIS PART (WRITE ONLY THESE, IN THIS ORDER, THEN THE FOOTER) ━━━`);
  lines.push(renumberedSections.join('\n'));

  if (!formInHero) {
    lines.push(`\n━━━ CONTACT FORM REQUIREMENTS ━━━`);
    lines.push(`Design a beautiful Contact Form for the section labeled (Contact/Form).`);
    lines.push(`You MUST integrate these fields: ${JSON.stringify(fields)}`);
    lines.push(`The form MUST have id="contact-form" on the <form> tag.`);
    lines.push(`The submit button MUST have text: "${submitLabel}".`);
    const randomFormStyle = STANDALONE_FORM_STYLES[Math.floor(Math.random() * STANDALONE_FORM_STYLES.length)];
    lines.push(`Adapt the layout to fit the section. Specifically, design it as: ${randomFormStyle}`);
  } else {
    lines.push(`\n━━━ CONTACT FORM REMINDER ━━━`);
    lines.push(`The contact form was already written INSIDE the hero section back in Part 1 (id="contact-form"). Do NOT add another form anywhere in this part.`);
  }

  lines.push(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
THIS IS PART 2 OF 2 (FINAL) — FOLLOW THESE RULES EXACTLY:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Output RAW HTML ONLY. Do NOT wrap your answer in markdown code fences. Do NOT add any explanation, comments, or preamble.
2. Do NOT rewrite the <head>, navbar, hero, or any section from PART 1. Start directly with the next section.
3. ${formInHero
      ? 'The lead form already exists inside the hero from Part 1 — do NOT add a second form anywhere in this part.'
      : 'MANDATORY LEAD FORM (NO POPUPS): Design a custom, responsive HTML form in the Contact/Form section. It MUST contain the required fields above, the form tag MUST have id="contact-form", and it must be INLINE (never in a popup).'}
4. After all sections${formInHero ? '' : ' and the form'}, write a complete, beautiful custom <footer> tag: logo image \`<img src="{{LOGO_URL}}" id="page-logo" alt="Logo" class="h-20 md:h-32 w-auto object-contain">\`, contact info line (phone & email), simple social icons, and a copyright line. If website content earlier contained an exact copyright string, use it verbatim with no year added; otherwise write "© BrandName. All rights reserved." with no year.
5. After the footer, include the AOS init script: \`<script>AOS.init({duration: 1000, once: true});</script>\`
6. Then close \`</body>\` and \`</html>\`. This MUST be the very last thing you write — the document must be 100% complete and valid.
7. CRITICAL CTA BEHAVIOR: Every single "Call to Action" button in this part MUST have \`href="#contact-form"\`. Do not use "#contact" or "#form".
8. 📱 Mobile-first responsive classes throughout. Keep copy punchy (1-2 sentences per paragraph) so you comfortably finish within budget — an unfinished document is a failure even if it looks good so far.
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

  // Build a fresh procedural recipe — 6 independent axes combined at random
  // every single call. No fixed list to exhaust, so pages don't repeat.
  const recipe = buildLayoutRecipe();

  let sectionsPart1 = [];
  let sectionsPart2 = [];

  // 🔧 NEW FIX: Parse custom numbered sections from the user prompt
  let requestedSections = [];
  if (input.aiPrompt) {
    const sectionLines = input.aiPrompt.split('\n')
      .map(l => l.trim())
      .filter(l => /^\d+[\)\.]\s/.test(l) && l.length > 5);
      
    if (sectionLines.length >= 3) {
      requestedSections = sectionLines.map(l => l.replace(/^\d+[\)\.]\s/, '').trim());
    }
  }

  if (requestedSections.length > 0) {
    // Filter out Hero and Footer as they are added automatically by the system prompt
    let middle = requestedSections.filter(s => 
      !s.toLowerCase().includes('hero') && 
      !s.toLowerCase().includes('footer')
    );
    if (middle.length === 0) middle = requestedSections;
    recipe.middleSections = middle;
    const midPoint = Math.ceil(middle.length / 2);
    sectionsPart1 = middle.slice(0, midPoint);
    sectionsPart2 = middle.slice(midPoint);
  } else if (input.aiPrompt && input.aiPrompt.includes('EXACTLY 6 sections')) {
    const lines = input.aiPrompt.split('\n');
    const mid1 = lines.find(l => l.startsWith('3.'))?.replace('3. ', '').trim();
    const mid2 = lines.find(l => l.startsWith('4.'))?.replace('4. ', '').trim();
    const mid3 = lines.find(l => l.startsWith('5.'))?.replace('5. ', '').trim();

    if (mid1 && mid2 && mid3) {
      recipe.middleSections = [mid1, mid2, mid3];
      sectionsPart1 = [mid1];
      sectionsPart2 = [mid2, mid3];
    } else {
      sectionsPart1 = recipe.middleSections.slice(0, 3);
      sectionsPart2 = recipe.middleSections.slice(3);
    }
  } else {
    sectionsPart1 = recipe.middleSections.slice(0, 3);
    sectionsPart2 = recipe.middleSections.slice(3);
  }

  // Resolve form from DB / scrape / fallback
  const { fields, submitLabel, placement, fieldCount, source } = resolveForm(input);

  // 🔧 FIX: this flag now actually drives where the form gets written.
  const formInHero = placement === 'in-hero';

  // Completely randomize whether the standalone form section is written in Part 1 (top half) or Part 2 (bottom half).
  // 80% chance the standalone form is placed in Part 1 (top half) to ensure high visibility.
  const formInPart1 = formInHero || Math.random() > 0.2;

  logger.info(`[AI] Generate | Business:${input.businessName} | ColorMode:${recipe.colorMode.id} | Sections:${recipe.middleSections.length + 2} (2-pass) | Form:${source}(${fieldCount} fields) | Placement:${placement} | Token:${chaosToken}`);

  const systemPrompt = buildSystemPrompt(chaosToken);

  let userPromptPart1 = buildUserPromptPart1(
    input, recipe, sectionsPart1, sectionsPart2.length,
    { formInHero, formInPart1, fields, submitLabel, placement }
  );
  if (input.templateHtml) {
    let prevHtml = '';
    if (typeof input.templateHtml === 'string') {
      prevHtml = input.templateHtml;
    } else if (typeof input.templateHtml === 'object') {
      prevHtml = input.templateHtml.fullHtml || input.templateHtml.html || JSON.stringify(input.templateHtml);
    }
    userPromptPart1 += `\n\n⚠️ PREVIOUS PAGE EXISTS (do NOT reuse its layout — invent something completely different, matching the NEW recipe above):\n${prevHtml.substring(0, 2000)}`;
  }

  // ── PASS 1: <head> + navbar + hero + first 3 sections. Fresh full budget. ──
  if (typeof input.onProgress === 'function') {
    try { await input.onProgress(25, 'Generating Header & Navigation...', 'generating_header'); } catch (e) { }
  }

  const pass1 = await callAIRaw({ messages: [{ role: 'user', content: userPromptPart1 }], systemPrompt, maxTokens: MAX_OUTPUT_TOKENS, temperature: 0.95 });
  let rawPart1 = pass1.text.replace(/```html/gi, '').replace(/```/g, '').trim();

  if (typeof input.onProgress === 'function') {
    try { await input.onProgress(40, 'Writing Hero Section & Headline Copy...', 'writing_hero'); } catch (e) { }
  }

  const userPromptPart2 = buildUserPromptPart2(input, recipe, sectionsPart2, fields, submitLabel, placement, sectionsPart1.length, formInHero, formInPart1);

  if (typeof input.onProgress === 'function') {
    try { await input.onProgress(50, 'Creating Features & Services Section...', 'creating_features'); } catch (e) { }
  }

  // ── PASS 2: remaining sections + form + footer + closing tags. Fresh full budget. ──
  let pass2 = await callAIRaw({
    messages: [
      { role: 'user', content: userPromptPart1 },
      { role: 'assistant', content: rawPart1 },
      { role: 'user', content: userPromptPart2 },
    ],
    systemPrompt, maxTokens: MAX_OUTPUT_TOKENS, temperature: 0.85,
  });
  let rawPart2 = pass2.text.replace(/```html/gi, '').replace(/```/g, '').trim();

  if (typeof input.onProgress === 'function') {
    try { await input.onProgress(60, 'Generating Testimonials & Social Proof...', 'testimonials'); } catch (e) { }
  }

  // Safety net: if PASS 2 itself still got cut off before reaching the
  // footer (rare, since it only has to write ~3 sections + form + footer),
  // ask once more to finish, exactly like before but now on a much smaller
  // remaining chunk so it reliably completes.
  let combinedRaw = rawPart1 + '\n' + rawPart2;
  if (pass2.finishReason === 'max_tokens' || isHtmlIncomplete(combinedRaw)) {
    logger.warn('[AI] Part 2 still looked truncated — requesting one more continuation');
    try {
      const pass3 = await callAIRaw({
        messages: [
          { role: 'user', content: userPromptPart1 },
          { role: 'assistant', content: rawPart1 },
          { role: 'user', content: userPromptPart2 },
          { role: 'assistant', content: rawPart2 },
          { role: 'user', content: 'You were cut off before finishing. Continue EXACTLY where you left off (do not repeat any earlier HTML) and finish the remaining sections, the footer, the AOS init script, and close </body></html>. Output raw HTML only, no markdown fences.' },
        ],
        systemPrompt, maxTokens: MAX_OUTPUT_TOKENS, temperature: 0.7,
      });
      const rawPart3 = pass3.text.replace(/```html/gi, '').replace(/```/g, '').trim();
      combinedRaw = rawPart1 + '\n' + rawPart2 + '\n' + rawPart3;
      pass2.usage = mergeUsage(pass2.usage, pass3.usage);
    } catch (contErr) {
      logger.error(`[AI] Final continuation attempt failed: ${contErr.message}`);
    }
  }

  const totalUsage = mergeUsage(pass1.usage, pass2.usage);
  const aiResult = { ...processResult(combinedRaw, input.logoUrl, input.businessName), aiUsage: totalUsage };

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
         const hasPointer = window.getComputedStyle(container).cursor === 'pointer' || container.classList.contains('cursor-pointer') || container.classList.contains('faq-item') || container.classList.contains('accordion-item') || container.classList.contains('accordion-header');

         // Added fallback so it opens even if AI forgets the icon
         if (hiddenChild && hasPointer) {
            hiddenChild.classList.remove('hidden');
            hiddenChild.style.display = 'block';
            const icon = container.querySelector('svg, i');
            if (icon) {
               icon.classList.add('rotate-180');
               if(icon.classList.contains('fa-plus')) { icon.classList.remove('fa-plus'); icon.classList.add('fa-minus'); }
               if(icon.classList.contains('fa-chevron-down')) { icon.classList.remove('fa-chevron-down'); icon.classList.add('fa-chevron-up'); }
            }
            toggled = true;
            break;
         } else if (hasPointer && container.children.length >= 2) {
            const visibleChild = Array.from(container.children).find(c => (c.tagName === 'DIV' || c.tagName === 'P') && c !== container.firstElementChild && c.offsetHeight > 0 && !c.classList.contains('hidden'));
            if (visibleChild && container.firstElementChild && container.firstElementChild.contains(e.target)) {
               visibleChild.classList.add('hidden');
               visibleChild.style.display = 'none';
               const icon = container.querySelector('svg, i');
               if (icon) {
                  icon.classList.remove('rotate-180');
                  if(icon.classList.contains('fa-minus')) { icon.classList.remove('fa-minus'); icon.classList.add('fa-plus'); }
                  if(icon.classList.contains('fa-chevron-up')) { icon.classList.remove('fa-chevron-up'); icon.classList.add('fa-chevron-down'); }
               }
               toggled = true;
               break;
            }
         }
         current = current.parentElement;
      }
    });

    // Check if we are inside GrapesJS editor (gjs-dashed is dynamically added in the canvas)
    var isInEditor = document.body.classList.contains('gjs-dashed');

    // 1.5 Smooth scroll to form for CTA buttons
    document.addEventListener('click', function(e) {
      var el = e.target.closest('a, button');
      if (!el) return;
      var href = el.getAttribute('href');
      var isCTA = (href === '#' || href === '#contact-form' || href === '#contact' || href === '#form' || href === 'javascript:void(0);' || href === 'javascript:void(0)') || 
                  (el.tagName === 'BUTTON' && el.type !== 'submit') ||
                  (el.className && typeof el.className === 'string' && (el.className.includes('btn') || el.className.includes('cta') || el.className.includes('link-primary')));
      if (isCTA && !el.closest('form') && !el.closest('.tabs-container') && !el.closest('.dropdown-menu') && !el.closest('.accordion-item') && !el.closest('.faq-item')) {
        e.preventDefault();
        e.stopPropagation();
        var formElement = document.querySelector('form#contact-form') || document.querySelector('form');
        if (formElement) {
          formElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          formElement.style.transition = 'box-shadow 0.3s';
          formElement.style.boxShadow = '0 0 0 4px var(--primary)';
          setTimeout(function() { formElement.style.boxShadow = 'none'; }, 1000);
        }
      }
    }, true);

    // 2. Form Validation (runs everywhere so you can see red borders in editor)
    document.addEventListener('submit', function(e) {
      if (e.target.tagName === 'FORM') {
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
            e.target.innerHTML = '\\x3Cdiv style="padding: 20px; text-align: center; border: 2px dashed #22c55e; border-radius: 8px; background: rgba(34,197,94,0.1); color: #166534;"\\x3E\\x3Ch3 style="margin: 0 0 10px 0; font-size: 20px;"\\x3EThank You!\\x3C/h3\\x3E\\x3Cp style="margin: 0;"\\x3EYour request has been submitted successfully.\\x3C/p\\x3E\\x3C/div\\x3E';
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
    // ─── Forcefully add required attribute to all form inputs to prevent blank submissions ───
    aiResult.fullHtml = aiResult.fullHtml.replace(/<input(?![^>]*type="(?:submit|hidden|button|radio|checkbox)")[^>]*>/gi, (match) => {
      if (!match.includes('required')) return match.replace('<input', '<input required="required"');
      return match;
    });
    aiResult.fullHtml = aiResult.fullHtml.replace(/<textarea[^>]*>/gi, (match) => {
      if (!match.includes('required')) return match.replace('<textarea', '<textarea required="required"');
      return match;
    });
    aiResult.fullHtml = aiResult.fullHtml.replace(/<select[^>]*>/gi, (match) => {
      if (!match.includes('required')) return match.replace('<select', '<select required="required"');
      return match;
    });

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

  const res = await callAIText(system, user);
  return { suggestion: cleanHTML(res.text), aiUsage: res.aiUsage };
};

// ─── EDITOR CHAT MODIFY ──────────────────────────────────────────────────────────
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
// Generic, industry-flavored fallback used only when the AI call itself
// fails outright (e.g. provider overloaded/rate-limited past all retries).
// Keeps the suggestions panel useful instead of empty during an outage.
const FALLBACK_SUGGESTION_TEMPLATES = [
  { title: 'Lead Generation Page', description: 'Capture qualified leads with a focused offer and contact form.' },
  { title: 'Service Overview Page', description: 'Showcase your core services and what makes them different.' },
  { title: 'Special Offer / Promo Page', description: 'Highlight a limited-time deal to drive quick conversions.' },
  { title: 'Customer Testimonials Page', description: 'Build trust with social proof from happy customers.' },
  { title: 'Free Consultation Page', description: 'Encourage visitors to book a no-obligation consultation.' },
  { title: 'FAQ & Pricing Page', description: 'Answer common questions and clarify pricing upfront.' },
];

const buildFallbackSuggestions = (industry) => {
  const label = industry ? ` for ${industry}` : '';
  return FALLBACK_SUGGESTION_TEMPLATES.map(t => ({
    title: t.title,
    description: `${t.description}${label ? ` Tailored${label}.` : ''}`,
  }));
};

const generateProjectSuggestions = async ({ projectName, industry, projectDescription, services, pageTitles }) => {
  const sys = `You are a digital marketing strategist. Return ONLY valid JSON array: [{"title":"Page Name","description":"Goal in one sentence"}]. No markdown.`;
  const user = [`PROJECT:${projectName}|INDUSTRY:${industry}`, `DESCRIPTION:${projectDescription}`, services?.length ? `SERVICES:${services.join(', ')}` : '', pageTitles?.length ? `AVOID:${pageTitles.join(', ')}` : '', 'Generate 6 unique landing page ideas.'].filter(Boolean).join('\n');
  let r;
  try {
    r = await callAIText(sys, user);
  } catch (err) {
    // Provider outage/overload (e.g. 529) or rate limit exhausted all retries —
    // degrade to generic suggestions rather than surfacing an empty panel.
    logger.error(`[AI] project suggestions call failed, using fallback: ${err.message}`);
    return buildFallbackSuggestions(industry);
  }
  try { return JSON.parse(r.text.trim().replace(/```json|```/g, '').trim()); }
  catch { logger.error('[AI] project suggestions JSON parse failed'); return buildFallbackSuggestions(industry); }
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
  // Expose new procedural layout utilities too
  buildLayoutRecipe,
  COLOR_MODES,
  HERO_LAYOUTS,
  CARD_STYLES,
  ACCENT_MOTIFS,
  TYPOGRAPHY_PAIRS,
  SECTION_POOL,
};