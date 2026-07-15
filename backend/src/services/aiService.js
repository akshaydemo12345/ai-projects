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
const CLAUDE_MODEL_CANDIDATES = [CLAUDE_MODELS.primary, CLAUDE_MODELS.fast];

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
  'in-hero',            // right inside the hero section (side-by-side)
  'after-features',     // section 3 — early, high visibility
  'after-about',        // mid page
  'after-testimonials', // late page
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
//  🚨 BUG FIX: max_tokens was set to 1600 — nowhere near enough
//  for a full 6+ section HTML page. This is what caused pages to
//  cut off halfway through the hero. Raised to 8000 for both
//  providers, and one automatic retry-with-higher-budget added
//  if the returned HTML looks truncated.
// ═══════════════════════════════════════════════════════════
const MAX_OUTPUT_TOKENS = 8000;

const callAI = async (userPrompt, logoUrl = '', systemPrompt = '') => {
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;
  const preferOpenAI = process.env.PREFER_OPENAI === 'true';
  if (!anthropicKey && !openaiKey) throw new Error('No AI API key configured');

  const promptStr = typeof userPrompt === 'string' ? userPrompt : '';
  const primaryHex = promptStr.match(/PRIMARY COLOR:\s*(#[0-9a-fA-F]{3,6})/)?.[1] || '#7c3aed';
  const secondaryHex = promptStr.match(/SECONDARY COLOR:\s*(#[0-9a-fA-F]{3,6})/)?.[1] || '#6366f1';
  const businessName = promptStr.match(/BUSINESS NAME:\s*(.+)/)?.[1]?.trim() || 'brand';

  const finalSystemPrompt = systemPrompt
    .replace(/\[PRIMARY_HEX\]/g, primaryHex)
    .replace(/\[SECONDARY_HEX\]/g, secondaryHex)
    .replace(/\{\{BUSINESS_NAME_KEYWORD\}\}/g, businessName.toLowerCase().replace(/\s+/g, '-'));

  // Helper to call OpenAI (extracted so it can be used as primary or fallback)
  const tryOpenAI = async () => {
    if (!openaiKey) throw new Error('No OpenAI API key configured');
    const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
    logger.info(`[AI] OpenAI: ${model}`);
    const openai = new OpenAI({ apiKey: openaiKey });
    const response = await openai.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: finalSystemPrompt },
        { role: 'user', content: Array.isArray(userPrompt) ? JSON.stringify(userPrompt) : userPrompt }
      ],
      max_tokens: MAX_OUTPUT_TOKENS,
      temperature: 0.95
    });
    const rawText = response.choices[0].message.content;
    const usage = response.usage;
    return {
      ...processResult(rawText, logoUrl),
      aiUsage: { promptTokens: usage.prompt_tokens, completionTokens: usage.completion_tokens, totalTokens: usage.total_tokens, cost: calculateCost(model, usage.prompt_tokens, usage.completion_tokens), model }
    };
  };

  if (openaiKey && preferOpenAI) {
    try {
      return await tryOpenAI();
    } catch (err) {
      logger.error(`[AI] OpenAI (preferred) failed: ${err.message}`);
      // fall through to Claude below
    }
  }

  if (anthropicKey) {
    const anthropic = new Anthropic({ apiKey: anthropicKey });
    let lastError = null;
    for (const model of CLAUDE_MODEL_CANDIDATES) {
      try {
        logger.info(`[AI] Claude: ${model}`);
        const response = await anthropic.messages.create({
          model, max_tokens: MAX_OUTPUT_TOKENS, temperature: 0.95,
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
        let result = {
          ...processResult(response.content[0].text, logoUrl),
          aiUsage: { promptTokens: usage.input_tokens, completionTokens: usage.output_tokens, totalTokens: usage.input_tokens + usage.output_tokens, cost: calculateCost(model, usage.input_tokens, usage.output_tokens), model }
        };

        // Safety net: if the model got cut off mid-page (stop_reason max_tokens
        // or missing closing tags/footer), ask it once to finish the document.
        if (response.stop_reason === 'max_tokens' || isHtmlIncomplete(result.fullHtml)) {
          logger.warn('[AI] Output looked truncated — requesting continuation');
          try {
            const continued = await anthropic.messages.create({
              model, max_tokens: MAX_OUTPUT_TOKENS, temperature: 0.7,
              system: finalSystemPrompt,
              messages: [
                { role: 'user', content: userPrompt },
                { role: 'assistant', content: response.content[0].text },
                { role: 'user', content: 'Your previous response was cut off before the page was finished. Continue EXACTLY where you left off (do not repeat any earlier HTML) and finish the remaining sections plus the footer, ending with </body></html>.' }
              ],
            });
            const combinedRaw = response.content[0].text + '\n' + continued.content[0].text;
            const cUsage = continued.usage;
            result = {
              ...processResult(combinedRaw, logoUrl),
              aiUsage: {
                promptTokens: usage.input_tokens + cUsage.input_tokens,
                completionTokens: usage.output_tokens + cUsage.output_tokens,
                totalTokens: usage.input_tokens + usage.output_tokens + cUsage.input_tokens + cUsage.output_tokens,
                cost: calculateCost(model, usage.input_tokens, usage.output_tokens) + calculateCost(model, cUsage.input_tokens, cUsage.output_tokens),
                model
              }
            };
          } catch (contErr) {
            logger.error(`[AI] Continuation attempt failed: ${contErr.message}`);
          }
        }

        return result;
      } catch (err) {
        lastError = err;
        logger.error(`[AI] Claude failed (${model}): ${err.message}`);
        if (!String(err.message).toLowerCase().match(/not_found|model:/)) break;
      }
    }
    // Claude failed — fall back to OpenAI if available
    if (openaiKey) {
      logger.warn('[AI] All Claude models failed, falling back to OpenAI');
      return await tryOpenAI();
    }
    throw lastError || new Error('All AI providers failed');
  }

  return await tryOpenAI();
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
];

const CARD_STYLES = [
  'rounded-2xl cards with soft diffused shadows',
  'sharp rounded-none cards with bold 2-3px borders (neo-brutalist feel)',
  'frosted glass cards — translucent background, backdrop-blur, thin light border',
  'borderless content blocks separated only by generous whitespace and a thin 1px divider line',
  'cards with a single colored accent bar along the top edge',
  'pill/rounded-full badges and capsule-shaped containers',
];

const ACCENT_MOTIFS = [
  'a few large blurred brand-color gradient orbs positioned absolutely in the background (blur-3xl, opacity-20)',
  'a faint grid-line pattern overlay behind dark sections',
  'thin dashed divider lines separating sections',
  'large ghost/outline numerals or icons behind section headings',
  'small uppercase tracked-out brand-color kicker labels above every section heading',
  'no extra decoration at all — pure typography, whitespace, and color carry the design',
];

const TYPOGRAPHY_PAIRS = [
  'massive bold sans-serif headlines with tracking-tighter, clean sans-serif body text',
  'large serif display headlines paired with simple sans-serif body text (editorial feel)',
  'uppercase tracked-out headlines paired with normal-case body text (structured, technical feel)',
  'mixed-weight headlines (a thin word next to a bold word in the same line) with sans-serif body text',
];

// Pool of possible middle-page sections. Hero, the contact form, and the
// footer are always present and are NOT part of this pool. Every generation
// shuffles this pool and takes 5 of them in random order — with 14 items,
// C(14,5) × 5! (order matters) gives well over 240,000 distinct sequences.
const SECTION_POOL = [
  'Trust bar: horizontal scrolling logo/credential marquee',
  'Stats row: 3-4 bold large numbers with short labels',
  'Features: asymmetric bento-grid cards (mixed col-spans, varied sizes)',
  'Features: zig-zag rows alternating image-left/text-right then text-left/image-right',
  'Features: clean 3-column icon + heading + paragraph cards',
  'About/Story: full-bleed image with an overlaid text caption',
  'Process: numbered step timeline, vertical or horizontal',
  'Testimonials: masonry layout with uneven card heights',
  'Testimonials: one large featured quote plus 2-3 smaller supporting quotes',
  'Testimonials: staggered/offset 2-column grid of quote cards',
  'Gallery: horizontal scrolling image showcase (flex-row overflow-x-auto)',
  'Gallery: 2x2 or 3x2 image grid with short captions',
  'FAQ: accordion section using accordion-item / accordion-header / accordion-content classes',
  'Pricing or package comparison: 2-3 simple plan cards',
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
  const middleSections = shuffle(SECTION_POOL).slice(0, 5);
  return { colorMode, heroLayout, cardStyle, accentMotif, typography, middleSections };
};

// ═══════════════════════════════════════════════════════════
//  SYSTEM PROMPT
// ═══════════════════════════════════════════════════════════
const buildSystemPrompt = (chaosToken) => `
You are an elite Principal UI Engineer and Creative Director with over 15 years of experience designing world-class, premium enterprise and SaaS websites.
Your goal is to build a clean, modern, ultra-premium, high-converting landing page that feels trustworthy, professional, and visually stunning. Your layouts must reflect absolute mastery of CSS grids, beautiful whitespace, and high-end typography.

Every page you build looks like it was crafted by a senior designer at a top agency — not generated. It has a clear visual identity, professional copy, and real personality.

CHAOS SEED: ${chaosToken}
This seed shapes your creative decisions. Every generation must feel genuinely fresh and different from any other — you will be given a specific LAYOUT DNA and SECTION BLUEPRINT below; follow them exactly, do not default to a generic "safe" layout.

🚫 FORBIDDEN BAD PRACTICES (NEVER USE):
- NEVER USE plain text without proper padding or margins.
- NEVER USE outdated, ugly color combinations. Always keep it harmonious.
- NEVER cramp elements together. Always use generous whitespace (e.g. py-24).
- NEVER reuse the exact same hero/section pattern you might default to — actively follow the LAYOUT DNA given to you.

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
- The footer should include the logo tag \`<img src="{{LOGO_URL}}" alt="Logo" class="h-8 w-auto">\`, a clean address or contact info line (phone & email), simple social icons, and a copyright notice.
- 🚨 COPYRIGHT RULE: Use EXACTLY the copyright text found in the user's website content if available. DO NOT add the current year or make up your own copyright string! If no copyright is provided, just write "© BrandName. All rights reserved." without any year.

4. STRICT BRAND COLORS & VARIABLES:
- YOU MUST NEVER USE hardcoded Tailwind colors like \`bg-blue-600\`, \`text-red-500\`, or \`bg-green-500\`.
- You MUST ONLY use the CSS variables \`var(--primary)\` and \`var(--secondary)\` for all branding, buttons, accents, and highlights! (e.g., \`bg-[var(--primary)]\`, \`text-[var(--secondary)]\`).
- This is critical so the user's selected brand colors are automatically applied!

5. PREMIUM & HIGH-CONVERTING STRUCTURE (CRITICAL):
- Use proven, high-converting web layouts, but strictly following the SECTION BLUEPRINT you are given — do not invent your own section order.
- Keep structural elements clean and modern (rectangles, rounded-2xl or rounded-3xl corners, clean grids) UNLESS the LAYOUT DNA explicitly says otherwise (e.g. neo-brutalist = no border-radius).
- YOU MUST USE RICH PLACEHOLDER IMAGES in your designs! Use \`https://picsum.photos/1200/800?random=N\` (change N for every image, never reuse the same number twice on one page). Every page must have beautiful, large photos.

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
Contains: H1 headline + subparagraph + ONE CTA button (unless the form placement below says the form goes in-hero).
Image backgrounds: use picsum.photos/1600/900?random=[N]
Always add a proper dark overlay so white text is readable.

INTERACTIVE ACCORDIONS & FORMS (NO JS REQUIRED):
- We automatically inject JavaScript for FAQs and Form validation. You DO NOT need to write any script tags for interactivity.
- Your HTML MUST use these exact classes for FAQs: \`accordion-item\`, \`accordion-header\`, and \`accordion-content hidden\`.
- 🚨 VARY THE FAQ DESIGN as instructed in the user prompt — never default to a plain white box every time.
- 🚨 MAXIMUM ONE FORM PER PAGE: You must generate EXACTLY ONE lead/contact form on the entire page, in the placement specified in the user prompt.
- FORM STRUCTURE: Make the form look premium. ALL form fields must have the \`required\` attribute (e.g. \`<input type="text" required>\`) so our backend validation script catches them.

ULTRA-PREMIUM UI/UX FINISH (MANDATORY & CRITICAL):
You MUST design at an "Awwwards-winning" luxury agency level. Generic designs are unacceptable.
- WHITESPACE IS LUXURY: Use massive padding (e.g., \`py-32\`, \`py-40\`, \`gap-16\`). Let elements breathe. NEVER cramp text.
- TYPOGRAPHY AS ART: Use extreme typographic contrast. Use \`tracking-tighter\` for massive 6xl+ headings, and \`tracking-widest uppercase text-[10px] font-bold text-[var(--primary)]\` for small kickers/subheadings.
- PREMIUM BACKGROUNDS: Do not just use solid colors. Use subtle radial gradients, mesh gradients, or large dark backgrounds with subtle glowing orbs (e.g. absolute divs with \`bg-[var(--primary)] blur-3xl opacity-20\`).
- GLASSMORPHISM & BORDERS: Use \`backdrop-blur-lg bg-white/10 border border-white/20\` for cards on top of dark/image backgrounds.
- OVERLAPPING LAYOUTS: Break out of the box! Make images overlap into the section above/below using negative margins (\`-mt-16\`) or absolute positioning.
- GRADIENT TEXT: Use gradient text for key emphasis in headlines: \`bg-clip-text text-transparent bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]\`.
- SHADOWS & DEPTH: Use ultra-soft, diffused shadows (e.g. \`shadow-[0_30px_60px_rgba(0,_0,_0,_0.08)]\`) and scale effects.
- 🚨 FORBIDDEN CSS (CRITICAL): NEVER use \`clip-path\`, \`polygon\`, or \`diagonal-slice\`. Clip paths break the GrapesJS editor UI rendering! Keep containers as standard rectangles with rounded corners (unless LAYOUT DNA says no border-radius).
- 🚨 NO WOW.JS: DO NOT use the \`wow.js\` library or \`wow\` classes. ONLY use AOS for scroll animations!
- MICRO-INTERACTIONS: Every button and card MUST have a premium hover state (e.g. \`transition-all duration-700 ease-out hover:-translate-y-2 hover:shadow-2xl\`).
- SCROLL ANIMATIONS: Include the AOS library via CDN (\`<link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">\` and \`<script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>\`) and use \`data-aos="fade-up"\` / \`data-aos="zoom-in"\` with different delays. Initialize AOS: \`<script>AOS.init({duration: 1000, once: true});</script>\`.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚙️ TECHNICAL REQUIREMENTS:
- Tailwind CDN: <script src="https://cdn.tailwindcss.com"></script>
- FontAwesome 6 for icons: <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
- Google Fonts: Dynamically load the selected font pairing stylesheet in <head>
- Brand colors via CSS variables: --primary and --secondary ONLY
- Fully responsive, complete, and stunning HTML output.
- 📱 MOBILE FIRST: use \`grid-cols-1 md:grid-cols-2 lg:grid-cols-X\` or \`flex-col md:flex-row\` everywhere so it never breaks on phones.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📤 OUTPUT FORMAT & TOKEN LIMITS (CRITICAL):
IMPORTANT: All generated text content MUST be in English only. Do not use Hindi or any other language.
CRITICAL TOKEN LIMIT: You have a generous output budget of ${MAX_OUTPUT_TOKENS} tokens — use it well, but budget carefully across ALL sections so you never run out before the footer.
- NEVER write massive inline SVG codes. ALWAYS use FontAwesome 6 classes (e.g., <i class="fa-solid fa-star"></i>).
- NEVER use Tailwind's arbitrary URL classes for background images (e.g. \`bg-[url('...')]\`). You MUST use inline styles for background images (e.g. \`<div style="background-image: url('...')">\`). This is critical to prevent CSS parser crashes.
- Keep your HTML DOM structure clean and avoid excessively deep nested divs.
- Do NOT generate excessively long placeholder text. Keep text punchy and concise — 1-2 sentences per paragraph max — so the ENTIRE page including the footer fits comfortably within budget.
- 🚨 PRIORITY ORDER IF RUNNING LOW ON BUDGET: it is far better to finish ALL sections with shorter copy than to write long copy and leave the page unfinished. ALWAYS reach the closing \`</footer></body></html>\`.
You MUST output the ENTIRE HTML document perfectly, closing \`</body>\` and \`</html>\` at the end!
Return ONLY a complete HTML file inside one code block.
No explanation before or after. No comments outside the HTML. Start with the HTML tag directly.
\`\`\`html
<!DOCTYPE html>
<html lang="en">
...complete premium page, including scripts at the bottom...
</html>
\`\`\`
`;

// ─── USER PROMPT ─────────────────────────────────────────────────────────────────
const buildUserPrompt = (input, recipe, formHTML, placement) => {
  // Random FAQ layout constraints to prevent repetitive white-box accordion designs
  const faqNudges = [
    'FAQ DESIGN: Use a strict 2-column grid. No backgrounds on the items, just clean subtle bottom borders.',
    'FAQ DESIGN: Place the FAQs in a narrow, elegant card floating over a large background image.',
    'FAQ DESIGN: Use a completely dark, immersive background for the FAQ section with glowing border highlights on the active item.',
    'FAQ DESIGN: Put the FAQ title and a massive image on the left half of the screen, and the accordion items stacked tightly on the right half.',
    'FAQ DESIGN: Use a stark minimalist approach. Huge bold typography for the questions, no boxes, just pure text and subtle icons.'
  ];
  const randomFaqNudge = faqNudges[Math.floor(Math.random() * faqNudges.length)];

  const placementLabel = `CONTACT FORM PLACEMENT: ${placement}`;

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

  // ── PROCEDURAL LAYOUT RECIPE — freshly randomized every single call.
  //    This is the main creative-direction lever. It combines 5 independent
  //    style axes plus a freshly shuffled section order, so the odds of two
  //    generations looking alike are astronomically low. ──
  lines.push(
    `\n━━━ LAYOUT RECIPE FOR THIS PAGE (MANDATORY — FOLLOW EXACTLY, DO NOT SUBSTITUTE YOUR OWN DEFAULT) ━━━`,
    `COLOR MODE: ${recipe.colorMode.rule}`,
    `HERO LAYOUT: ${recipe.heroLayout}`,
    `CARD / CONTAINER STYLE: use ${recipe.cardStyle} for every card, feature block, and testimonial throughout the page.`,
    `DECORATIVE ACCENT: ${recipe.accentMotif}`,
    `TYPOGRAPHY PAIRING: ${recipe.typography}`,
    `🚨 This exact combination was randomly generated fresh for this request. Follow it precisely — it is what makes this page visually distinct from any other page you've ever generated. Do not fall back on a "safe" generic layout.`
  );

  lines.push(`🧩 ${randomFaqNudge}`);
  lines.push(`CRITICAL RULE: You must design a highly professional, modern, and trustworthy layout tailored to this specific business.`);

  if (input.websiteContent) {
    lines.push(`\n━━━ SCRAPED WEBSITE CONTENT (use real names, facts, copy from this) ━━━`);
    lines.push(input.websiteContent.substring(0, 3500));
  }

  const orderedSections = [
    'Section 1 (Hero): follow the HERO LAYOUT above',
    ...recipe.middleSections.map((s, i) => `Section ${i + 2} (${s.split(':')[0]}): ${s}`),
    `Section ${recipe.middleSections.length + 2} (Contact/Form): placement specified below`,
  ];

  lines.push(`\n━━━ MANDATORY SECTION ORDER (YOU MUST FOLLOW THIS EXACT SEQUENCE, ${orderedSections.length} SECTIONS + FOOTER) ━━━`);
  lines.push(orderedSections.join('\n'));

  lines.push(`\n━━━ CONTACT FORM PLACEMENT ━━━`);
  lines.push(placementLabel);

  lines.push(`\n━━━ CONTACT FORM HTML (insert this VERBATIM inside the correct section) ━━━`);
  lines.push(formHTML);

  lines.push(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NOW BUILD — FOLLOW THESE FINAL RULES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. 📱 STRICT MOBILE RESPONSIVENESS (CRITICAL): Your design MUST look perfect on mobile devices.
2. Your hero MUST follow the HERO LAYOUT + COLOR MODE above exactly. Make it look extremely premium and trustworthy.
3. Name your visual concept in an HTML comment at the top, e.g. <!-- RECIPE: ${recipe.colorMode.id} / ${recipe.cardStyle.slice(0, 30)}... -->
4. Write REAL, industry-specific copy — not generic filler text.
5. MANDATORY LEAD FORM (NO POPUPS): Include the given Lead Capture <form> block directly visible on the page, in the placement specified above. DO NOT hide it in a modal or popup. It must be INLINE and always visible. Style the form's outer wrapper card to match the CARD / CONTAINER STYLE above.
6. 🔥 STRICT SECTION-ORDER COMPLIANCE: You MUST GENERATE AT LEAST ${orderedSections.length} SECTIONS (never fewer than 6) in the exact order listed in "MANDATORY SECTION ORDER" above. Do NOT invent your own section order or skip any listed section.
7. ⚠️ COMPLETE THE FULL PAGE: Write concise, punchy copy so the entire document — every section plus the footer — fits and finishes within the token budget. An unfinished page is a failure even if the sections you did write look good.
8. The page MUST end with a beautiful custom <footer> (logo, contact info, copyright), followed by the closing </html> tag. The footer must also use the same COLOR MODE and CARD STYLE as the rest of the page. Do NOT stop writing before finishing the footer and closing all HTML tags!
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

  // Resolve form from DB / scrape / fallback
  const { formHTML, placement, fieldCount, source } = resolveForm(input);

  logger.info(`[AI] Generate | Business:${input.businessName} | ColorMode:${recipe.colorMode.id} | Sections:${recipe.middleSections.length + 2} | Form:${source}(${fieldCount} fields) | Placement:${placement} | Token:${chaosToken}`);

  const systemPrompt = buildSystemPrompt(chaosToken);
  let userPrompt = buildUserPrompt(input, recipe, formHTML, placement);

  if (input.templateHtml) {
    let prevHtml = '';
    if (typeof input.templateHtml === 'string') {
      prevHtml = input.templateHtml;
    } else if (typeof input.templateHtml === 'object') {
      prevHtml = input.templateHtml.fullHtml || input.templateHtml.html || JSON.stringify(input.templateHtml);
    }
    userPrompt += `\n\n⚠️ PREVIOUS PAGE EXISTS (do NOT reuse its layout — invent something completely different, matching the NEW recipe above):\n${prevHtml.substring(0, 2000)}`;
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
  // Expose new procedural layout utilities too
  buildLayoutRecipe,
  COLOR_MODES,
  HERO_LAYOUTS,
  CARD_STYLES,
  ACCENT_MOTIFS,
  TYPOGRAPHY_PAIRS,
  SECTION_POOL,
};
