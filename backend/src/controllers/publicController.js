'use strict';

const Page = require('../models/Page');
const Project = require('../models/Project');
const Lead = require('../models/Lead');
const FormSchema = require('../models/FormSchema');
const AppError = require('../utils/AppError');
const { normalizeDomain } = require('../utils/validation');
const { generateTrackingScripts } = require('../utils/tracking');
const path = require('path');
const fs = require('fs');
const { validateForm } = require('../utils/dynamicValidator');
const logger = require('../utils/logger');

/**
 * Normalizes script content - wraps in script tags if not already present
 */
const normalizeScript = (value = '') => {
  const trimmed = value.trim();

  if (!trimmed) return '';

  const hasScriptTag = /<script[\s\S]*?>[\s\S]*?<\/script>/i.test(trimmed);

  if (hasScriptTag) {
    return trimmed;
  }

  return `<script>${trimmed}</script>`;
};

/**
 * GET /api/public/page/:slug
 * 100% Public endpoint — serves content WITHOUT requiring tokens.
 */
exports.getPublicPageBySlug = async (req, res, next) => {
  try {
    const rawSlug = String(req.params.slug || req.params[0] || '').trim();
    const cleanSlug = rawSlug.replace(/^\/+|\/+$/g, '');
    const slugParts = cleanSlug.split('/');

    let isThankYou = false;
    let pageSlug = "";
    let urlPreSlug = "";

    if (slugParts.length > 1 && slugParts[slugParts.length - 1] === 'thank-you') {
      isThankYou = true;
      pageSlug = slugParts[slugParts.length - 2];
      urlPreSlug = slugParts.slice(0, slugParts.length - 2).join('/');
    } else {
      pageSlug = slugParts[slugParts.length - 1];
      urlPreSlug = slugParts.slice(0, slugParts.length - 1).join('/');
    }

    if (!pageSlug) return next(new AppError('Page not found', 404));

    // Find all potential pages with this slug
    const potentialPages = await Page.find({ slug: pageSlug, isDeleted: { $ne: true } });
    let pageDoc = null;

    if (potentialPages.length > 0) {
      for (const p of potentialPages) {
        const project = await Project.findById(p.projectId);
        const projectPreSlug = (project?.preSlug || "").replace(/^\/+|\/+$/g, '');
        if (projectPreSlug === urlPreSlug) {
          pageDoc = p;
          break;
        }
      }
    }

    // Fallback: Legacy support (only if no page found via dynamic detection)
    if (!pageDoc && slugParts.length === 1) {
      pageDoc = await Page.findOne({ slug: slugParts[0], isDeleted: { $ne: true } });
      // Only use legacy if the project has NO preSlug
      if (pageDoc) {
        const project = await Project.findById(pageDoc.projectId);
        if (project && project.preSlug) {
          pageDoc = null; // Enforce preSlug
        }
      }
    }

    if (!pageDoc) return next(new AppError('Page not found', 404));

    // Increment views
    const page = await Page.findByIdAndUpdate(
      pageDoc._id,
      { $inc: { views: 1 } },
      { new: true }
    ).select('title slug content styles landingPageContent landingPageStyles thankYouPageContent thankYouPageStyles seo template domain status previewToken projectId views primaryColor secondaryColor accentColor logoUrl websiteUrl thankYouUrl mainHeader mainFooter thankYouHeader thankYouFooter thankYouConversionScript noIndex noFollow metaTitle metaDescription');

    // ─── BRANDING FALLBACK: Use project values if page values are missing ───
    let primaryColor = page.primaryColor;
    let secondaryColor = page.secondaryColor;
    let logoUrl = page.logoUrl;

    if (page.projectId) {
      const project = await Project.findById(page.projectId);
      if (project) {
        if (!primaryColor) primaryColor = project.primaryColor;
        if (!secondaryColor) secondaryColor = project.secondaryColor;
        if (!logoUrl) logoUrl = project.logoUrl;

        // Increment project views as well
        await Project.findByIdAndUpdate(page.projectId, { $inc: { views: 1 } });

        // Check lock
        if (project.websiteUrl) {
          const forwardedHost = req.headers['x-forwarded-host'];
          const referer = req.headers['referer'];

          let incomingRequestDomain = "";
          if (forwardedHost) {
            incomingRequestDomain = normalizeDomain(forwardedHost);
          } else if (referer) {
            incomingRequestDomain = normalizeDomain(referer);
          }

          const isProxied = req.headers['x-proxy-by'] || forwardedHost;

          if (isProxied && incomingRequestDomain && incomingRequestDomain !== project.websiteUrl) {
            return res.status(403).json({
              status: 'error',
              message: 'This landing page is not authorized for this domain.'
            });
          }
        }
      }
    }

    res.status(200).json({
      status: 'success',
      data: page.content,
      styles: page.styles,
      landingPageContent: page.landingPageContent,
      landingPageStyles: page.landingPageStyles,
      primaryColor: primaryColor,
      secondaryColor: secondaryColor,
      accentColor: page.accentColor || secondaryColor,
      logoUrl: logoUrl,
      websiteUrl: page.websiteUrl,
      thankYouUrl: page.thankYouUrl,
      thankYouPageContent: page.thankYouPageContent,
      thankYouPageStyles: page.thankYouPageStyles,
      meta: {
        _id: page._id,
        title: page.title,
        seo: page.seo,
        status: page.status,
        projectId: page.projectId,
        primaryColor: primaryColor,
        secondaryColor: secondaryColor,
        logoUrl: logoUrl,
        websiteUrl: page.websiteUrl,
        thankYouUrl: page.thankYouUrl,
        hasCustomThankYou: !!page.thankYouPageContent
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /p/:slug
 * Deprecated or updated to not require tokens if public.
 */
exports.getPublicPage = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const page = await Page.findOneAndUpdate(
      { slug, isDeleted: { $ne: true } }, // Allow drafts to be viewed at this URL
      { $inc: { views: 1 } },
      { new: true }
    ).select('title slug content seo template domain publishedAt views projectId status mainHeader mainFooter thankYouHeader thankYouFooter thankYouConversionScript noIndex noFollow metaTitle metaDescription');

    if (!page) return next(new AppError('Page not found', 404));

    // If it's not published, we just serve it normally for the dashboard "View" click
    // This solves the 'Page Not Found' issue after generation

    res.status(200).json({
      status: 'success',
      data: { page },
    });
  } catch (err) {
    next(err);
  }
};

// ─── Shared Rendering Logic ──────────────────────────────────────────────────

/**
 * Builds the lead capture injection script.
 * Uses absolute APP_BASE_URL so it works from any domain (WordPress, custom domain, etc.)
 */
const buildLeadCaptureScript = (page) => {
  const apiBaseUrl = (process.env.APP_BASE_URL || 'http://localhost:5000').replace(/\/+$/, '');
  const pageSlug = page.slug || '';
  const pageId = String(page._id || '');
  const projectId = String(page.projectId || '');

  const rawScript = `!function(){
  var A="${apiBaseUrl}", SL="${pageSlug}", PI="${pageId}", PJ="${projectId}";
  
  // Persistence Utility
  function sUTM(){
    var q=new URLSearchParams(window.location.search);
    if(window.location.hash&&window.location.hash.indexOf("?")!==-1){
      var hq=new URLSearchParams(window.location.hash.split("?")[1]);
      hq.forEach(function(v,k){if(!q.has(k))q.append(k,v)});
    }
    var keys=["utm_source","utm_medium","utm_campaign","utm_term","utm_content","gclid","fbclid","msclkid"];
    keys.forEach(function(k){
      var v=q.get(k);
      if(v){
        try{sessionStorage.setItem("dm_"+k,v)}catch(e){}
      }
    });
  }
  sUTM();

  function getUTM(){
    var u={};
    var keys=["utm_source","utm_medium","utm_campaign","utm_term","utm_content","gclid","fbclid","msclkid"];
    keys.forEach(function(k){
      var v=null;
      try{v=sessionStorage.getItem("dm_"+k)}catch(e){}
      if(!v){
        var q=new URLSearchParams(window.location.search);
        v=q.get(k);
      }
      if(v)u[k]=v;
    });
    return u;
  }

  function send(d,f,b,t,n){
    n=n||1;
    fetch(A+"/api/leads",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify(d),
      mode:"cors"
    })
    .then(function(r){return r.json()})
    .then(function(r){
      if(r.status==="success"||r.status==="error"){
        f.reset();
        var ev=new CustomEvent('submit-success',{detail:{leadId:r.data&&r.data.leadId?r.data.leadId:'none'}});
        document.dispatchEvent(ev);
        var tyUrl=window.pageThankYouUrl||"";
        if(tyUrl&&tyUrl.trim()!==""){
          window.location.replace(tyUrl)
        }else if(window.location.pathname&&window.location.pathname!=='/'){
          var currentPath=window.location.pathname.replace(/\\/+$/,'');
          window.location.replace(window.location.origin+currentPath+"/thank-you")
        }else if(SL){
          window.location.replace(window.location.origin+"/"+SL+"/thank-you")
        }else{
          window.location.replace(window.location.href.split('?')[0].replace(/\\/+$/,'')+"/thank-you")
        }
      }
    })
    .catch(function(e){
      if(n<3){setTimeout(function(){send(d,f,b,t,n+1)},2000)}
      else{
        var currentPath=window.location.pathname.replace(/\\/+$/,'');
        window.location.replace(window.location.origin+currentPath+"/thank-you")
      }
    })
  }

  document.addEventListener("submit",function(e){
    var f=e.target;
    if(f.tagName!=="FORM")return;
    if(f.getAttribute("data-submitting")==="true"){e.preventDefault();return}
    f.setAttribute("data-submitting","true");
    e.preventDefault();
    e.stopImmediatePropagation();

    var b=f.querySelector('button[type="submit"]')||f.querySelector("button");
    var t=b?(b.textContent||"Submit"):"Submit";
    if(b){
      b.disabled=true;
      b.textContent="Sending...";
      b.style.opacity="0.7";
      b.style.cursor="not-allowed"
    }

    var fd=new FormData(f);
    var data={
      pageSlug:SL,
      pageId:PI,
      projectId:PJ,
      timestamp:new Date().getTime()
    };

    // Capture every single named field in the form, prioritizing non-empty values
    f.querySelectorAll('input, select, textarea').forEach(function(el) {
      if (el.name) {
        var val = el.value ? String(el.value).trim() : "";
        if (el.type === 'checkbox' || el.type === 'radio') {
          if (el.checked) data[el.name] = val;
        } else if (val !== "") {
          data[el.name] = val;
        }
      }
    });

    fd.forEach(function(v,k){
      if(k && v && String(v).trim() !== "") data[k]=v;
    });

    var utms=getUTM();
    Object.keys(utms).forEach(function(k){data[k]=utms[k]});

    // Smart identify primary fields if they aren't explicitly named correctly
    if(!data.name || data.name === ""){
       var nV = fd.get("name") || fd.get("full_name") || fd.get("fullname") || "";
       if(!nV) {
         var nIn = f.querySelector('input[name*="name"]') || f.querySelector('input[placeholder*="Name"]');
         if(nIn) nV = nIn.value;
       }
       if(nV) data.name = String(nV).trim();
    }

    if(!data.email || data.email === ""){
       var eV = fd.get("email") || fd.get("user_email") || "";
       if(!eV) {
         var eIn = f.querySelector('input[type="email"]') || f.querySelector('input[name*="email"]');
         if(eIn) eV = eIn.value;
       }
       if(eV) data.email = String(eV).trim();
    }

    console.log('📡 [TRACKER] Final Data for submission:', data);
    send(data,f,b,t,1)
  },true);
}();`;
  const minifiedScript = rawScript.replace(/\s+/g, ' ').trim();
  const encodedScript = Buffer.from(minifiedScript).toString('base64');
  return `<script id="dm-lead-tracker">eval(atob("${encodedScript}"));</script>`;
};

/**
 * Shared helper to render a high-converting landing page from AI-generated content.
 * Always injects the lead capture script so forms work on WordPress, custom domains, etc.
 */
const renderFullHTML = (page, canonicalUrl = '', isThankYou = false) => {
  const { title, content, seo } = page || {};
  if (!content) return '<html><body><p>Loading your AI design...</p></body></html>';

  const aiHtml = (typeof content === 'string' ? content : (content?.fullHtml || '')).trim();
  const aiCss = (typeof content === 'object' && content?.fullCss) ? content.fullCss : (page.styles || page.landingPageStyles || '');
  const aiJs = typeof content === 'object' ? (content?.fullJs || '') : '';

  let finalHtml = aiHtml;

  // ─── DYNAMIC REPLACEMENTS: Logo & Branding ──────────────────────────────
  const finalLogo = page.logoUrl || '';
  if (finalLogo) {
    // 1. Replace known placeholders
    finalHtml = finalHtml.replace(/https:\/\/via\.placeholder\.com\/[^\s"'>]+/g, finalLogo);
    finalHtml = finalHtml.replace(/https:\/\/i\.ibb\.co\/vzB7pLq\/Logo\.png/g, finalLogo);
    finalHtml = finalHtml.replace(/https:\/\/picsum\.photos\/seed\/saaslogo\/[^\s"'>]+/g, finalLogo);

    // 2. Attribute-agnostic logo replacement
    finalHtml = finalHtml.replace(/<img([^>]*)id="page-logo"([^>]*)>/gi, (match, p1, p2) => {
      const combined = p1 + p2;
      const updated = combined.replace(/src="[^"]*"/gi, '');
      return `<img src="${finalLogo}"${updated} id="page-logo">`;
    });
  }

  // Clean placeholders
  finalHtml = finalHtml.replace(/https:\/\/(fastly\.)?picsum\.photos\/[^\s"'>]+/g, 'https://via.placeholder.com/1200x800?text=Brand+Image');

  const leadScript = buildLeadCaptureScript(page);
  const mainHeaderScript = normalizeScript(page.mainHeader);
  const mainFooterScript = normalizeScript(page.mainFooter);
  const thankYouHeaderScript = normalizeScript(page.thankYouHeader);
  const thankYouFooterScript = normalizeScript(page.thankYouFooter);
  const thankYouConversionScript = normalizeScript(page.thankYouConversionScript);

  let finalHeaderScript = mainHeaderScript;
  let finalFooterScript = mainFooterScript;

  if (isThankYou) {
    if (thankYouHeaderScript) finalHeaderScript += '\n' + thankYouHeaderScript;
    if (thankYouFooterScript) finalFooterScript += '\n' + thankYouFooterScript;
    if (thankYouConversionScript) finalFooterScript += '\n' + thankYouConversionScript;
  }

  // ── Thank You Redirect Script ────────────────────────────────────────────
  // Handles Gravity Forms and generic form submission success events
  const thankYouUrl = page.thankYouUrl?.trim() || '';
  const rawTyScript = `!function(){window.pageThankYouUrl=${JSON.stringify(thankYouUrl)};window.pageSlug=${JSON.stringify(page.slug)};function doRedirect(){if(window.pageThankYouUrl&&window.pageThankYouUrl.trim()){window.location.replace(window.pageThankYouUrl)}else if(window.pageSlug){window.location.replace('/'+window.pageSlug+'/thank-you')}}document.addEventListener('gform_confirmation_loaded',function(){doRedirect()});document.addEventListener('submit-success',function(){doRedirect()});if(window.location.hash&&window.location.hash.includes('gf_')){doRedirect()}document.addEventListener('DOMContentLoaded',function(){var forms=document.querySelectorAll('form');forms.forEach(function(form){if(form.hasAttribute('data-no-redirect'))return;form.addEventListener('submit',function(){})})})}();`;
  const encodedTyScript = Buffer.from(rawTyScript).toString('base64');
  const thankYouRedirectScript = `<script>eval(atob("${encodedTyScript}"));</script>`;

  // ── Resolved SEO values from DB (always authoritative) ──────────────────
  // The Page Settings modal saves to page.metaTitle / page.metaDescription (flat fields)
  // page.seo.title / page.seo.description are legacy fallbacks
  const seoTitle = (page.metaTitle || seo?.title || title || 'Landing Page').trim();
  const seoDescription = (page.metaDescription || seo?.description || '').trim();
  const seoKeywords = Array.isArray(seo?.keywords) ? seo.keywords.join(', ') : (seo?.keywords || '');

  // ── Inject Branding Variables ─────────────────────────────────────────────
  const pColor = page.primaryColor || '#7c3aed';
  const sColor = page.secondaryColor || '#6366f1';
  const detectDark = (aiCss.includes('#0f172a') || aiHtml.includes('bg-slate-950') || aiHtml.includes('bg-[#0f172a]'));

  const brandingStyles = `
<style id="branding-vars">
  :root {
    --primary: ${pColor};
    --secondary: ${sColor};
    --accent: ${sColor};
    --button-gradient: linear-gradient(135deg, ${pColor}, ${sColor});
  }
  body { 
    background-color: ${detectDark ? '#0f172a' : '#ffffff'}; 
    color: ${detectDark ? '#f8fafc' : '#0f172a'}; 
    margin: 0; 
    overflow-x: hidden;
  }
  /* Guarantee form input visibility overrides */
  input, textarea, select {
    color: #0f172a !important;
    background-color: #f8fafc !important;
    border: 1px solid #cbd5e1 !important;
  }
  input::placeholder, textarea::placeholder {
    color: #94a3b8 !important;
  }
</style>`;

  // ── JSON-LD WebPage Schema ────────────────────────────────────────────────
  const schemaOrg = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    'name': seoTitle,
    'description': seoDescription,
    ...(canonicalUrl ? { 'url': canonicalUrl } : {}),
    'inLanguage': 'en',
  };

  // ── Full SEO head block ───────────────────────────────────────────────────
  const seoMetaBlock = [
    `<title>${seoTitle}</title>`,
    `<meta name="description" content="${seoDescription.replace(/"/g, '&quot;')}">`,
    seoKeywords ? `<meta name="keywords" content="${seoKeywords.replace(/"/g, '&quot;')}">` : '',
    (() => {
      const noIndex = page.noIndex === true ? true : false; // default false (index)
      const noFollow = page.noFollow === true ? true : false; // default false (follow)
      if (!noIndex && !noFollow) return `<meta name="robots" content="index, follow">`;
      const directives = [];
      if (noIndex) directives.push('noindex'); else directives.push('index');
      if (noFollow) directives.push('nofollow'); else directives.push('follow');
      return `<meta name="robots" content="${directives.join(', ')}">`;  
    })(),
    canonicalUrl ? `<link rel="canonical" href="${canonicalUrl}">` : '',
    `<link rel="preconnect" href="https://fonts.googleapis.com">`,
    `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>`,
    `<link rel="dns-prefetch" href="//fonts.googleapis.com">`,
    `<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">`,
    `<script src="https://cdn.tailwindcss.com"></script>`,
    `<script type="application/ld+json">${JSON.stringify(schemaOrg)}</script>`,
  ].filter(Boolean).join('\n    ');


  // ── Full document (AI returned <!DOCTYPE html>) ───────────────────────────
  if (aiHtml.toLowerCase().includes('<!doctype') || aiHtml.toLowerCase().includes('<html')) {
    let html = aiHtml;

    // 1. Replace existing <title>...</title> with DB value
    if (/<title[\s>]/i.test(html)) {
      html = html.replace(/<title[^>]*>.*?<\/title>/is, `<title>${seoTitle}</title>`);
    }

    // 2. Replace existing meta description with DB value (or add if missing)
    if (/<meta[^>]+name=["']description["'][^>]*>/i.test(html)) {
      html = html.replace(
        /<meta[^>]+name=["']description["'][^>]*>/i,
        `<meta name="description" content="${seoDescription.replace(/"/g, '&quot;')}">`
      );
    } else {
      // Inject after <title> if no description meta exists
      html = html.replace(
        /(<title[^>]*>.*?<\/title>)/is,
        `$1\n    <meta name="description" content="${seoDescription.replace(/"/g, '&quot;')}">`
      );
    }

    // 3. Replace or inject keywords meta
    if (seoKeywords) {
      if (/<meta[^>]+name=["']keywords["'][^>]*>/i.test(html)) {
        html = html.replace(
          /<meta[^>]+name=["']keywords["'][^>]*>/i,
          `<meta name="keywords" content="${seoKeywords.replace(/"/g, '&quot;')}">`
        );
      } else {
        html = html.replace(
          /(<meta[^>]+name=["']description["'][^>]*>)/i,
          `$1\n    <meta name="keywords" content="${seoKeywords.replace(/"/g, '&quot;')}">`
        );
      }
    }

    // 4. Strip any AI-generated OG/Twitter tags (not needed)
    html = html.replace(/<meta[^>]+property=["']og:[^"']*["'][^>]*>/gi, '');
    html = html.replace(/<meta[^>]+name=["']twitter:[^"']*["'][^>]*>/gi, '');

    // 5. Inject/replace robots meta tag based on page settings
    const _noIndex = page.noIndex === true;
    const _noFollow = page.noFollow === true;
    const _robotsContent = [_noIndex ? 'noindex' : 'index', _noFollow ? 'nofollow' : 'follow'].join(', ');
    const _robotsMeta = `<meta name="robots" content="${_robotsContent}">`;
    if (/<meta[^>]+name=["']robots["'][^>]*>/i.test(html)) {
      html = html.replace(/<meta[^>]+name=["']robots["'][^>]*>/i, _robotsMeta);
    } else {
      html = html.replace(/(<meta[^>]+name=["']description["'][^>]*>)/i, `$1\n    ${_robotsMeta}`);
    }

    if (/<\/head>/i.test(html)) {
      // Force inject Tailwind, Fonts, and Branding if missing
      if (!html.includes('cdn.tailwindcss.com')) {
        html = html.replace(/<\/head>/i, `  <script src="https://cdn.tailwindcss.com"></script>\n</head>`);
      }
      if (!html.includes('fonts.googleapis.com')) {
        html = html.replace(/<\/head>/i, `  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">\n</head>`);
      }
      if (!html.includes('--primary:')) {
        html = html.replace(/<\/head>/i, `${brandingStyles}\n</head>`);
      }
      // Inject AI-generated CSS if not already present
      if (aiCss && !html.includes(aiCss.substring(0, 20))) {
        html = html.replace(/<\/head>/i, `  <style>${aiCss}</style>\n</head>`);
      }
      if (finalHeaderScript) {
        html = html.replace(/<\/head>/i, `${finalHeaderScript}\n</head>`);
      }
      // Metadata for relay tracking
      const trackingMeta = `
    <meta name="dm-page-id" content="${page._id}">
    <meta name="dm-project-id" content="${page.projectId}">
    <meta name="dm-page-slug" content="${page.slug}">`;
      html = html.replace(/<\/head>/i, `${trackingMeta}\n${thankYouRedirectScript}\n</head>`);
    }

    // 5. Inject lead script and AI JS before </body>
    const jsInjection = aiJs ? `<script>${aiJs}</script>` : '';
    if (/<\/body>/i.test(html)) {
      html = html.replace(
        /<\/body>/i,
        `${jsInjection}\n${leadScript}\n${finalFooterScript}\n</body>`
      );
    } else {
      html = html + jsInjection + leadScript + finalFooterScript;
    }

    return html;
  }

  // ─── Legacy/Structured fragment fallback ──────────────────────────────────
  const pageData = content.pageContent || content;

  const renderLegacyContent = (data) => {
    let html = '';
    if (data.hero) {
      html += `
      <section class="hero-section">
        <div class="container hero-content">
          ${data.hero.badge ? `<div class="badge">${data.hero.badge}</div>` : ''}
          <h1>${data.hero.headline || data.hero.heading || ''}</h1>
          <p>${data.hero.subheadline || data.hero.subheading || ''}</p>
          <div class="hero-actions">
            ${data.hero.primaryCta ? `<button class="btn-primary">${data.hero.primaryCta}</button>` : ''}
            ${data.hero.secondaryCta ? `<button class="btn-secondary">${data.hero.secondaryCta}</button>` : ''}
          </div>
        </div>
      </section>`;
    }
    return html || '<p>No content generated.</p>';
  };

  let finalBodyContent = aiHtml || renderLegacyContent(pageData);
  let bodyAttributes = '';

  // Extract and remove inner <body> wrapper if GrapesJS generated one
  const bodyMatch = finalBodyContent.match(/<body([^>]*)>/i);
  if (bodyMatch) {
    bodyAttributes = bodyMatch[1];
    finalBodyContent = finalBodyContent.replace(/<body[^>]*>/i, '');
    finalBodyContent = finalBodyContent.replace(/<\/body>/i, '');
  }

  const fallbackStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');
    body { font-family: 'Inter', sans-serif; margin: 0; padding: 0; }
  `;

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="dm-page-id" content="${page._id}">
    <meta name="dm-project-id" content="${page.projectId}">
    <meta name="dm-page-slug" content="${page.slug}">
    ${seoMetaBlock}
    ${brandingStyles}
    ${finalHeaderScript}
    ${thankYouRedirectScript}
    <style>${aiCss || (aiHtml ? '' : fallbackStyles)}</style>
</head>
<body${bodyAttributes}>
    ${finalBodyContent}
    ${aiJs ? `<script>${aiJs}</script>` : ''}
    ${leadScript}
    ${finalFooterScript}
</body>
</html>`;
};


/**
 * GET /preview/:token/html
 * Serves draft content as full rendered HTML.
 */
exports.getPreviewHTML = async (req, res, next) => {
  try {
    const { token } = req.params;
    const page = await Page.findOne({
      $or: [
        { previewToken: token },
        { slug: token },
        { _id: token && token.length === 24 ? token : null }
      ],
    }).select('title content styles seo status metaTitle metaDescription noIndex noFollow mainHeader mainFooter thankYouHeader thankYouFooter thankYouConversionScript thankYouUrl primaryColor secondaryColor logoUrl slug projectId');

    if (!page) return next(new AppError('Preview expired or invalid', 404));

    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(renderFullHTML(page));
  } catch (err) {
    next(err);
  }
};

/**
 * GET /:slug
 * Public endpoint — serves the live HTML content of a published page.
 */
exports.getPublicPageHTML = async (req, res, next) => {
  try {
    const rawSlug = String(req.params.slug || req.params[0] || '').trim();
    const cleanSlug = rawSlug.replace(/^\/+|\/+$/g, '');

    // ─── DYNAMIC SLUG DETECTION (Pre-Slug Support) ───
    const slugParts = cleanSlug.split('/');
    let isThankYou = false;
    let pageSlug = "";
    let urlPreSlug = "";

    if (slugParts.length > 1 && slugParts[slugParts.length - 1] === 'thank-you') {
      isThankYou = true;
      pageSlug = slugParts[slugParts.length - 2];
      urlPreSlug = slugParts.slice(0, slugParts.length - 2).join('/');
    } else {
      pageSlug = slugParts[slugParts.length - 1];
      urlPreSlug = slugParts.slice(0, slugParts.length - 1).join('/');
    }

    if (!pageSlug) return next(new AppError('Page not found', 404));

    // Find all potential pages with this slug
    const potentialPages = await Page.find({ slug: pageSlug, isDeleted: { $ne: true } });
    let page = null;

    if (potentialPages.length > 0) {
      // Filter by project preSlug
      for (const p of potentialPages) {
        const project = await Project.findById(p.projectId);
        const projectPreSlug = (project?.preSlug || "").replace(/^\/+|\/+$/g, '');
        if (projectPreSlug === urlPreSlug) {
          page = p;
          break;
        }
      }
    }

    // Fallback: Legacy support (only if no page found via dynamic detection)
    if (!page && slugParts.length === 1) {
      const legacySlug = slugParts[0];
      page = await Page.findOne({ slug: legacySlug, isDeleted: { $ne: true } });
      // Only use legacy if the project has NO preSlug
      if (page) {
        const project = await Project.findById(page.projectId);
        if (project && project.preSlug) {
          page = null; // Enforce preSlug
        }
      }
    }

    if (!page) return next(new AppError('Page not found or not published', 404));

    // Increment views
    page.views += 1;
    await page.save({ validateBeforeSave: false });

    // Use the actual detected slug for canonical and redirection
    const normalizedSlug = pageSlug;

    // ─── SMART DOMAIN AUTHORIZATION ───
    if (page.projectId) {
      const project = await Project.findById(page.projectId);
      if (project) {
        // Increment project views
        await Project.findByIdAndUpdate(page.projectId, { $inc: { views: 1 } });

        const forwardedHost = req.headers['x-forwarded-host'];
        const hostHeader = req.headers['host'];
        const referer = req.headers['referer'];

        let host = forwardedHost || hostHeader || '';
        if (!host && referer) {
          try {
            host = new URL(referer).hostname;
          } catch (e) {
            host = referer.split('/')[2] || referer;
          }
        }

        let incomingRequestDomain = normalizeDomain(host);
        const saasDomain = normalizeDomain(process.env.APP_DOMAIN || 'localhost');

        // 1. If no websiteUrl is set, lock it to this domain (Auto-Authorize)
        if (!project.websiteUrl && incomingRequestDomain && incomingRequestDomain !== saasDomain) {
          project.websiteUrl = incomingRequestDomain;
          await project.save();
          console.log(`✨ Auto-authorized project "${project.name}" to domain: ${incomingRequestDomain}`);
        }

        // 2. Check Authorization
        const isOwnerDomain = (incomingRequestDomain === saasDomain);
        const isAuthorizedDomain = (incomingRequestDomain === project.websiteUrl);

        if (!isOwnerDomain && !isAuthorizedDomain && project.websiteUrl) {
          // Instead of a hard 403, we show a helpful "Setup Needed" page
          console.warn(`🛑 Domain Blocked: ${incomingRequestDomain} is not ${project.websiteUrl}`);
          return res.status(200).send(`
            <html>
              <head><title>Setup Required</title><script src="https://cdn.tailwindcss.com"></script></head>
              <body class="bg-slate-50 flex items-center justify-center min-h-screen p-6 text-center">
                <div class="max-width-md bg-white p-10 rounded-3xl shadow-xl border border-slate-100">
                  <div class="text-6xl mb-6">⚙️</div>
                  <h1 class="text-2xl font-bold text-slate-900 mb-4">Domain Authorization Required</h1>
                  <p class="text-slate-600 mb-8 leading-relaxed">
                    This landing page is currently locked to <strong>${project.websiteUrl}</strong>.<br>
                    To use it on <strong>${incomingRequestDomain}</strong>, please update your project settings in the dashboard.
                  </p>
                  <a href="${process.env.APP_BASE_URL}/projects/${project._id}" class="inline-block bg-indigo-600 text-white px-8 py-3 rounded-full font-bold hover:bg-indigo-700 transition-all">Go to Dashboard</a>
                </div>
              </body>
            </html>
          `);
        }
      }
    }

    // ── Build canonical URL from the requesting host (WP domain) ─────────
    const forwardedHost = req.headers['x-forwarded-host'];
    const hostHeader = req.headers['host'];
    const requestHost = forwardedHost || hostHeader || '';
    const canonicalUrl = requestHost
      ? `http${req.secure ? 's' : ''}://${requestHost}/${cleanSlug}`
      : '';

    res.setHeader('Content-Type', 'text/html');

    if (isThankYou) {
      if (page.thankYouPageContent) {
        const tyPageMock = {
          ...page.toObject(),
          content: page.thankYouPageContent,
          styles: page.thankYouPageStyles,
          title: `${page.title || 'Landing Page'} - Thank You`
        };
        return res.status(200).send(renderFullHTML(tyPageMock, canonicalUrl, true));
      }
      req.params.pageSlug = normalizedSlug;
      return require('./thankYouController').renderThankYouPage(req, res, next);
    }

    res.status(200).send(renderFullHTML(page, canonicalUrl));
  } catch (err) {
    console.error('❌ Public Page Error:', err);
    next(err);
  }
};

/**
 * POST /:slug
 * Smart form handler that captures data and redirects to success page.
 * Uses the new DYNAMIC lead architecture.
 */
exports.handleFormSubmission = async (req, res, next) => {
  try {
    const rawData = { ...req.body };
    let { pageId, pageSlug, projectId } = rawData;

    // --- SMART CONTEXT RESOLUTION ---
    // If slug is missing (relay) or ends with 'proxy-form', resolve it
    if (!pageSlug || pageSlug.endsWith('/proxy-form') || pageSlug === 'proxy-form') {
      const referer = req.get('referer') || '';
      const urlSlug = req.params.slug || '';
      
      // Try to get slug from URL param (stripping proxy-form)
      let detectedSlug = urlSlug.replace(/\/proxy-form$/i, '');
      
      // If still no slug, try parsing referer
      if (!detectedSlug && referer) {
        try {
          const refPath = new URL(referer).pathname.replace(/^\/+|\/+$/g, '');
          detectedSlug = refPath;
        } catch (e) {}
      }
      
      if (detectedSlug) pageSlug = detectedSlug.replace(/\/thank-you$/i, '');
    }

    // Normalize slug parts for lookup
    const cleanPageSlug = pageSlug ? pageSlug.split('/').filter(Boolean).pop() : null;

    // 1. Resolve Page ID first if missing (critical for FormSchema lookup)
    if (!pageId && pageSlug) {
      const pageDoc = await Page.findOne({ 
        $or: [{ slug: pageSlug }, { slug: cleanPageSlug }] 
      }).select('_id projectId').lean();

      if (pageDoc) {
        pageId = pageDoc._id;
        projectId = projectId || pageDoc.projectId;
      }
    }

    // 2. Fetch Dynamic Schema using resolved IDs
    const FormSchema = require('../models/FormSchema');
    const schema = await FormSchema.findOne({
      $or: [
        { page_id: pageId },
        { project_id: projectId, page_slug: pageSlug } // Note: page_slug doesn't exist in model but kept for legacy
      ].filter(obj => Object.values(obj)[0])
    }).lean();

    if (!schema || !schema.fields?.length) {
      console.warn(`[PUBLIC_FORM] No schema found for PageId: "${pageId}", Slug: "${pageSlug}"`);
      
      // If it's a traditional form, don't just return JSON
      if (!req.xhr && !req.headers.accept?.includes('json')) {
         return res.status(404).send('<h1>Form Configuration Missing</h1><p>Please ensure you have configured a form in the landing page editor and published it.</p>');
      }
      
      return res.status(400).json({ status: 'fail', message: 'Form schema not found. Please ensure page is published and form is configured.' });
    }

    // 2. Helpers for Dynamic Matching
    const normalizeKey = (str = "") => String(str || "").toLowerCase().trim().replace(/[^a-z0-9]/g, "");
    const slugify = (str = "") => String(str || "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");

    function getSmartFieldValue(field, body = {}) {
      const normalizedBody = {};
      Object.keys(body).forEach(key => { normalizedBody[normalizeKey(key)] = body[key]; });

      const label = (field.label || "").toLowerCase();
      const labelSlug = slugify(field.label);
      const labelWords = label.split(/\s+/).filter(w => w.length > 2);

      const candidates = [
        field.field_name,
        field.name,
        field.id,
        labelSlug,
        normalizeKey(field.label)
      ];

      labelWords.forEach(w => candidates.push(w));

      // Intelligent fallback by Broad Types
      candidates.push(field.type);

      if (field.type === "email") candidates.push("email", "email_address", "mail");
      if (["tel", "phone", "mobile"].includes(field.type)) candidates.push("phone", "tel", "contact", "mobile", "whatsapp");
      if (["text", "textarea"].includes(field.type)) {
        if (label.includes("name")) candidates.push("name", "fullname", "firstname", "lname");
        if (label.includes("msg") || label.includes("message") || label.includes("comment") || label.includes("note")) {
          candidates.push("message", "msg", "comments", "notes", "description", "details");
        }
        if (label.includes("subject") || label.includes("title")) candidates.push("subject", "title", "topic");
      }
      if (field.type === "number") candidates.push("amount", "quantity", "count", "age", "price");
      if (field.type === "date" || field.type === "time") candidates.push("date", "time", "appointment", "schedule", "on_date");
      if (field.type === "select" || field.type === "radio") candidates.push("service", "category", "type", "option", "selection", "plan");
      if (field.type === "checkbox") candidates.push("agree", "accept", "consent", "newsletter", "terms");

      const uniqueCandidates = [...new Set(candidates.filter(Boolean))];

      for (const key of uniqueCandidates) {
        const n = normalizeKey(key);
        if (normalizedBody[n] !== undefined && normalizedBody[n] !== null) {
          const val = normalizedBody[n];
          return (typeof val === 'string') ? val.trim() : val;
        }
      }
      return "";
    }

    // 3. Validate & Map
    const missingFields = [];
    const leadData = {};

    for (const field of schema.fields) {
      const value = getSmartFieldValue(field, rawData);

      if (field.required && !value) {
        missingFields.push(field.label || field.field_name);
      }

      // Store using ONE persistent key (prioritize semantic name)
      const storageKey = field.name || field.field_name;
      if (value !== undefined) {
        leadData[storageKey] = value;
      }
    }

    if (missingFields.length > 0) {
      return res.status(400).json({ status: 'fail', message: 'Required fields missing', fields: missingFields });
    }

    // 4. UTMs
    const utm = {};
    const utmFields = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid', 'msclkid'];
    utmFields.forEach(k => { if (rawData[k]) utm[k] = rawData[k]; });

    // 5. Create Lead
    const lead = await Lead.create({
      projectId: schema.project_id,
      pageId: schema.page_id,
      pageSlug: pageSlug || schema.page_slug,
      data: leadData,
      utm,
      meta: {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        domain: rawData.domain || req.get('origin'),
        url: rawData.url || req.get('referer')
      }
    });

    if (schema.project_id) {
      const Project = require('../models/Project');
      const emailService = require('../services/emailService');

      await Project.findByIdAndUpdate(schema.project_id, { $inc: { leadCount: 1 } }).catch(() => { });
      
      const project = await Project.findById(schema.project_id).lean();
      if (project) {
        console.log(`📬 Processing email notifications for project: ${project.name}`);
        const now = new Date().toLocaleString();
        
        // 1. Admin Notification
        if (project.adminNotification?.enabled && (project.adminNotification.email || project.adminEmail)) {
          const adminEmail = project.adminNotification.email || project.adminEmail;
          let adminMsg = project.adminNotification.message || "New lead captured.";
          
          // Simple template replacement
          adminMsg = adminMsg
            .replace(/{{lead_name}}/g, leadData.name || 'Unknown')
            .replace(/{{lead_email}}/g, leadData.email || 'Not provided')
            .replace(/{{lead_phone}}/g, leadData.phone || 'Not provided')
            .replace(/{{lead_message}}/g, leadData.message || 'No message')
            .replace(/{{page_slug}}/g, pageSlug || schema.page_slug || '')
            .replace(/{{timestamp}}/g, now);

          emailService.sendEmail({
            to: adminEmail,
            subject: project.adminNotification.subject?.replace(/{{page_slug}}/g, pageSlug || '') || `New Lead from ${pageSlug}`,
            htmlContent: adminMsg.replace(/\n/g, '<br>'),
            fromName: project.fromName,
            fromEmail: project.fromEmail
          }).catch(err => console.error('Admin Email Error:', err));
        }

        // 2. User Auto-Reply
        if (project.userNotification?.enabled && leadData.email) {
          let userMsg = project.userNotification.message || "Thank you for reaching out!";
          userMsg = userMsg.replace(/{{name}}/g, leadData.name || 'there');

          emailService.sendEmail({
            to: leadData.email,
            subject: project.userNotification.subject || "Thank you for contacting us!",
            htmlContent: userMsg.replace(/\n/g, '<br>'),
            fromName: project.fromName,
            fromEmail: project.fromEmail
          }).catch(err => console.error('User Email Error:', err));
        }
      }
    }

    // 6. Resolve Thank You URL (Check Page settings for custom URL)
    let thankYouUrl = rawData.redirect;
    
    if (!thankYouUrl) {
      const pageDoc = await Page.findById(schema.page_id).select('thankYouUrl slug projectId');
      if (pageDoc && pageDoc.thankYouUrl) {
        thankYouUrl = pageDoc.thankYouUrl;
      } else {
        // Build default redirect path (retaining path context)
        thankYouUrl = `/${pageSlug || schema.page_slug || pageDoc?.slug}/thank-you`;
      }
    }

    // Final response
    if (req.xhr || req.headers.accept?.includes('json')) {
      return res.status(201).json({
        status: 'success',
        message: 'Intelligence Captured',
        data: { leadId: lead._id },
        redirect: thankYouUrl
      });
    }

    return res.redirect(thankYouUrl);

  } catch (err) {
    console.error('❌ Dynamic Form Submission Error:', err);
    next(err);
  }
};

/**
 * Modern JSON handler for AJAX trackers
 */
exports.submitDynamicLead = exports.handleFormSubmission;


/**
 * GET /p/domain/:domain
 * Serves live page by custom domain.
 */
exports.getPublicPageByDomain = async (req, res, next) => {
  try {
    const { domain } = req.params;

    const page = await Page.findOneAndUpdate(
      { domain, status: 'published' },
      { $inc: { views: 1 } },
      { new: true }
    ).select('title slug content seo template domain publishedAt views projectId');

    if (!page) return next(new AppError('No published page found for this domain', 404));

    res.status(200).json({
      status: 'success',
      data: { page },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /plugin/verify
 */
exports.verifyPlugin = async (req, res, next) => {
  try {
    const { api_key, domain } = req.body;
    let apiToken = api_key;

    if (!apiToken && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      apiToken = req.headers.authorization.split(' ')[1];
    }

    if (!apiToken) {
      return next(new AppError('API token is required for verification', 400));
    }

    const project = await Project.findOne({ apiToken });

    if (!project) {
      return res.status(401).json({ status: 'error', message: 'Invalid API token. No project found.' });
    }

    console.log(`🔑 Plugin Verification Request: Token=[${apiToken}] | Domain=[${domain}]`);

    if (domain) {
      const incomingDomain = normalizeDomain(domain);

      if (!project.websiteUrl) {
        // Lock the project to this domain on first use
        project.websiteUrl = incomingDomain;
        await project.save();
        console.log(`🔒 Project "${project.name}" locked to domain: ${incomingDomain}`);
      } else if (project.websiteUrl !== incomingDomain) {
        // Domain mismatch!
        console.error(`🛑 Domain Security Violation for Project "${project.name}": Expected ${project.websiteUrl}, got ${incomingDomain}`);
        return res.status(403).json({
          status: 'error',
          message: 'Website URL not match. This API key is already linked to another website. Please create a new project for this domain.'
        });
      }
    }

    const pages = await Page.find({ projectId: project._id, status: 'published' }).select(
      'title slug content seo template domain publishedAt'
    );

    const backendBaseUrl = process.env.APP_BASE_URL || 'http://127.0.0.1:5000';
    const normalizedBackendBase = backendBaseUrl.replace(/\/+$/, '');

    const preSlug = (project.preSlug || "").replace(/^\/+|\/+$/g, '');
    const allowedPaths = [];
    pages.forEach(p => {
      const pageSlug = p.slug.replace(/^\/+|\/+$/g, '');
      const fullSlug = preSlug ? `/${preSlug}/${pageSlug}` : `/${pageSlug}`;
      allowedPaths.push(fullSlug);
      allowedPaths.push(`${fullSlug}/thank-you`);
      allowedPaths.push(`${fullSlug}/proxy-form`);
    });

    res.status(200).json({
      status: 'active',
      plan: 'pro',
      cache_time: 300,
      projectId: project._id,
      projectName: project.name,
      source_url: project.websiteUrl,
      target_url: normalizedBackendBase,
      relay_url: normalizedBackendBase,
      allowed_paths: [...allowedPaths, '/api/leads'],
      message: `License verified. Project "${project.name}" is active.`
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /public/preview/:token
 */
exports.getPreview = async (req, res, next) => {
  try {
    const { token } = req.params;

    const page = await Page.findOneAndUpdate(
      {
        $or: [
          { previewToken: token },
          { slug: token },
          { _id: token.length === 24 ? token : null }
        ]
      },
      { $inc: { views: 1 } },
      { new: true }
    ).select('title slug content seo template domain status previewToken previewUrl');

    if (!page) return next(new AppError('Preview expired or invalid link', 404));

    res.status(200).json({
      status: 'success',
      data: {
        page,
        isPreview: true,
        tempUrl: `${process.env.APP_BASE_URL}/preview/${page.previewToken || page._id}`
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /plugin/download
 * Serves the WordPress plugin ZIP file from the backend or frontend public directory.
 * Ensures correct headers for ZIP file downloads.
 */
exports.downloadPlugin = async (req, res, next) => {
  try {
    // Try multiple locations in order of preference
    const possiblePaths = [
      // Backend public/zip directory
      path.resolve(__dirname, '../../public/zip/domain-mapper.zip'),
      path.resolve(__dirname, '../../public/zip/domain-mapper-test.zip'),
      path.resolve(__dirname, '../../public/zip/ai-landing-page-publisher.zip'),
      // Frontend public/zip directory
      path.resolve(__dirname, '../../../frontend/public/zip/domain-mapper.zip'),
      path.resolve(__dirname, '../../../frontend/public/zip/domain-mapper-backup.zip'),
    ];

    let zipPath = null;
    for (const filePath of possiblePaths) {
      if (fs.existsSync(filePath)) {
        zipPath = filePath;
        console.log(`Found plugin ZIP at: ${zipPath}`);
        break;
      }
    }

    if (!zipPath) {
      return next(new AppError('Plugin ZIP file not available on server. Please contact support.', 404));
    }

    // Set correct headers for forcing a ZIP download
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename="domain-mapper.zip"');

    // Stream the file for efficiency
    const fileStream = fs.createReadStream(zipPath);
    fileStream.pipe(res);

    fileStream.on('error', (err) => {
      console.error('Download stream error:', err);
      if (!res.headersSent) {
        next(new AppError('Error occurred while downloading the file', 500));
      }
    });
  } catch (err) {
    next(err);
  }
};
/**
 * GET /sitemap.xml
 * Auto-generates a sitemap for all published pages bound to a project websiteUrl.
 */
exports.getSitemap = async (req, res) => {
  try {
    const pages = await Page.find({ isDeleted: { $ne: true } })
      .select('slug metaTitle publishedAt updatedAt projectId')
      .populate({ path: 'projectId', select: 'websiteUrl' })
      .lean();

    const host = req.headers['x-forwarded-host'] || req.headers['host'] || '';
    const baseUrl = `http${req.secure ? 's' : ''}://${host}`;

    const urlEntries = pages
      .filter(p => p.slug)
      .map(p => {
        const loc = `${baseUrl}/${p.slug}`;
        const lastmod = (p.publishedAt || p.updatedAt || new Date()).toISOString().split('T')[0];
        return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>`;
      })
      .join('\n');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries}\n</urlset>`;

    res.setHeader('Content-Type', 'application/xml; charset=UTF-8');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.status(200).send(xml);
  } catch (err) {
    res.status(500).send('<?xml version="1.0"?><urlset />');
  }
};

/**
 * GET /robots.txt
 * Serves a permissive robots.txt that points to sitemap.
 */
exports.getRobotsTxt = (req, res) => {
  const host = req.headers['x-forwarded-host'] || req.headers['host'] || '';
  const baseUrl = `http${req.secure ? 's' : ''}://${host}`;
  const txt = [
    'User-agent: *',
    'Allow: /',
    '',
    `Sitemap: ${baseUrl}/sitemap.xml`,
  ].join('\n');
  res.setHeader('Content-Type', 'text/plain; charset=UTF-8');
  res.setHeader('Cache-Control', 'public, max-age=86400');
  res.status(200).send(txt);
};

/**
 * GET /api/page?domain={domain}&path={path}
 * Dynamically returns landing page HTML for the tracker script.
 */
exports.getDynamicPage = async (req, res, next) => {
  try {
    const { domain, path: reqPath, apiKey } = req.query;

    if (!domain || !reqPath) {
      return res.status(400).json({ status: 'error', message: 'Domain and path are required' });
    }

    // Normalize path to slug
    const cleanSlug = reqPath.replace(/^\/+|\/+$/g, '').split('/')[0];

    if (!cleanSlug) {
      return res.status(404).json({ status: 'error', message: 'No slug found in path' });
    }

    // 1. Find the project first if apiKey is provided
    let project = null;
    if (apiKey) {
      project = await Project.findOne({ apiToken: apiKey });
    }

    // 2. Find the page
    const pageQuery = {
      slug: cleanSlug,
      isDeleted: { $ne: true },
      status: 'published'
    };

    // If we have a project from apiKey, use its ID for strictness
    if (project) {
      pageQuery.projectId = project._id;
    }

    const page = await Page.findOneAndUpdate(
      pageQuery,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!page) {
      return res.status(404).json({ status: 'error', message: 'Landing page not found or not published' });
    }

    // 3. SMART DOMAIN AUTHORIZATION
    if (page.projectId) {
      if (!project) project = await Project.findById(page.projectId);

      if (project) {
        const incomingRequestDomain = normalizeDomain(domain);
        const saasDomain = normalizeDomain(process.env.APP_DOMAIN || 'localhost');

        // Allow auto-authorize if apiKey matches or if project has no domain yet
        const isApiKeyMatch = (apiKey && project.apiToken === apiKey);

        if (!project.websiteUrl && incomingRequestDomain && incomingRequestDomain !== saasDomain) {
          project.websiteUrl = incomingRequestDomain;
          await project.save();
        }

        // Project-wide domain check (skip if valid API Key is present)
        if (!isApiKeyMatch && project.websiteUrl && incomingRequestDomain !== project.websiteUrl && incomingRequestDomain !== saasDomain) {
          return res.status(403).json({ status: 'error', message: `Domain ${incomingRequestDomain} is not authorized for this project.` });
        }
      }
    }

    const html = renderFullHTML(page, `http://${domain}/${cleanSlug}`);

    res.status(200).json({
      status: 'success',
      html,
      projectId: page.projectId,
      pageId: page._id
    });
  } catch (err) {
    next(err);
  }
};

// End of file

