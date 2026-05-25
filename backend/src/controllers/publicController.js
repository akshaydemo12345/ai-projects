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
const config = require('../config');
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
 * GET /api/public/page
 * Supports query param page={pageId} or legacy slug-based page lookups.
 * 100% Public endpoint — serves content WITHOUT requiring tokens for published pages.
 */
exports.getPublicPageBySlug = async (req, res, next) => {
  try {
    const requestedPageId = String(req.query.page || req.query.pageId || '').trim();
    const pgSlug = String(req.query.pg || '').trim();
    const previewToken = String(req.query.token || req.query.previewToken || '').trim();
    let pageDoc = null;

    // 1. Resolve via ID or Preview Token
    if (requestedPageId) {
      if (/^[0-9a-fA-F]{24}$/.test(requestedPageId)) {
        pageDoc = await Page.findOne({ _id: requestedPageId, isDeleted: { $ne: true } });
      }
      if (!pageDoc) {
        pageDoc = await Page.findOne({ previewToken: requestedPageId, isDeleted: { $ne: true } });
      }

      // If not found by ID/Token, treat requestedPageId as a potential slug
      if (!pageDoc && requestedPageId && !/^[0-9a-fA-F]{24}$/.test(requestedPageId)) {
        const cleanSlug = requestedPageId.replace(/^\/+|\/+$/g, '');
        const slugParts = cleanSlug.split('/');
        let pageSlug = '';
        let urlPreSlug = '';

        if (slugParts.length > 1 && slugParts[slugParts.length - 1] === 'thank-you') {
          pageSlug = slugParts[slugParts.length - 2];
          urlPreSlug = slugParts.slice(0, slugParts.length - 2).join('/');
        } else {
          pageSlug = slugParts[slugParts.length - 1];
          urlPreSlug = slugParts.slice(0, slugParts.length - 1).join('/');
        }

        if (pageSlug) {
          const potentialPages = await Page.find({ slug: pageSlug, isDeleted: { $ne: true } });
          for (const p of potentialPages) {
            const project = await Project.findById(p.projectId);
            const projectPreSlug = (project?.preSlug || '').replace(/^\/+|\/+$/g, '');
            if (projectPreSlug === urlPreSlug) {
              pageDoc = p;
              break;
            }
          }

          if (!pageDoc && slugParts.length === 1) {
            const p = await Page.findOne({ slug: slugParts[0], isDeleted: { $ne: true } });
            if (p) {
              const proj = await Project.findById(p.projectId);
              if (proj && !proj.preSlug) pageDoc = p;
            }
          }
        }
      }
    }

    // 2. Resolve via 'pg' query parameter (Priority fallback)
    if (!pageDoc && pgSlug) {
      const cleanSlug = pgSlug.replace(/^\/+|\/+$/g, '');
      const slugParts = cleanSlug.split('/');
      let pageSlug = '';
      let urlPreSlug = '';

      if (slugParts.length > 1 && slugParts[slugParts.length - 1] === 'thank-you') {
        pageSlug = slugParts[slugParts.length - 2];
        urlPreSlug = slugParts.slice(0, slugParts.length - 2).join('/');
      } else {
        pageSlug = slugParts[slugParts.length - 1];
        urlPreSlug = slugParts.slice(0, slugParts.length - 1).join('/');
      }

      if (pageSlug) {
        const potentialPages = await Page.find({ slug: pageSlug, isDeleted: { $ne: true } });
        if (potentialPages.length > 0) {
          for (const p of potentialPages) {
            const project = await Project.findById(p.projectId);
            const projectPreSlug = (project?.preSlug || '').replace(/^\/+|\/+$/g, '');
            if (projectPreSlug === urlPreSlug) {
              pageDoc = p;
              break;
            }
          }
        }

        if (!pageDoc && slugParts.length === 1) {
          pageDoc = await Page.findOne({ slug: slugParts[0], isDeleted: { $ne: true } });
          if (pageDoc) {
            const project = await Project.findById(pageDoc.projectId);
            if (project && project.preSlug) {
              pageDoc = null;
            }
          }
        }
      }
    }

    // 3. Resolve via URL path slug
    if (!pageDoc) {
      const rawSlug = String(req.params.slug || req.params[0] || '').trim();
      let cleanSlug = rawSlug.replace(/^\/+|\/+$/g, '');
      cleanSlug = cleanSlug.replace(/^api\/v1\/proxy\//i, '');
      const slugParts = cleanSlug.split('/');

      let pageSlug = '';
      let urlPreSlug = '';

      if (slugParts.length > 1 && slugParts[slugParts.length - 1] === 'thank-you') {
        pageSlug = slugParts[slugParts.length - 2];
        urlPreSlug = slugParts.slice(0, slugParts.length - 2).join('/');
      } else {
        pageSlug = slugParts[slugParts.length - 1];
        urlPreSlug = slugParts.slice(0, slugParts.length - 1).join('/');
      }

      if (!pageSlug) return next(new AppError('Page not found', 404));

      const potentialPages = await Page.find({ slug: pageSlug, isDeleted: { $ne: true } });

      if (potentialPages.length > 0) {
        for (const p of potentialPages) {
          const project = await Project.findById(p.projectId);
          const projectPreSlug = (project?.preSlug || '').replace(/^\/+|\/+$/g, '');
          if (projectPreSlug === urlPreSlug) {
            pageDoc = p;
            break;
          }
        }
      }

      if (!pageDoc && slugParts.length === 1) {
        pageDoc = await Page.findOne({ slug: slugParts[0], isDeleted: { $ne: true } });
        if (pageDoc) {
          const project = await Project.findById(pageDoc.projectId);
          if (project && project.preSlug) {
            pageDoc = null;
          }
        }
      }

      // Final exact match fallback for JSON API
      if (!pageDoc) {
        pageDoc = await Page.findOne({ slug: cleanSlug, isDeleted: { $ne: true } });
      }
    }

    if (!pageDoc) return next(new AppError('Page not found', 404));

    if (pageDoc.status !== 'published' && previewToken && previewToken !== pageDoc.previewToken) {
      return next(new AppError('Page not found', 404));
    }
    // Removed strict token requirement for drafts based on user request

    const page = await Page.findByIdAndUpdate(
      pageDoc._id,
      { $inc: { views: 1 } },
      { new: true }
    ).select('title slug content styles landingPageContent landingPageStyles thankYouPageContent thankYouPageStyles seo template domain status previewToken projectId views primaryColor secondaryColor accentColor logoUrl websiteUrl thankYouUrl mainHeader mainFooter thankYouHeader thankYouFooter thankYouConversionScript noIndex noFollow metaTitle metaDescription');

    let primaryColor = page.primaryColor;
    let secondaryColor = page.secondaryColor;
    let logoUrl = page.logoUrl;
    let websiteUrl = page.websiteUrl;

    if (page.projectId) {
      const project = await Project.findById(page.projectId);
      if (project) {
        if (!primaryColor) primaryColor = project.primaryColor;
        if (!secondaryColor) secondaryColor = project.secondaryColor;
        if (!logoUrl) logoUrl = project.logoUrl;
        if (!websiteUrl) websiteUrl = project.websiteUrl;

        await Project.findByIdAndUpdate(page.projectId, { $inc: { views: 1 } });

        if (project.websiteUrl) {
          // BUG-FIX #1: x-forwarded-host may be a comma-list when nginx/reverse-proxy sits
          // in front of Node. e.g. "rsdevelopercachechecking.rocketsites.ai, apiserver.ai-..."
          // Always take only the FIRST (leftmost / original client) hop.
          const rawForwardedHost = req.headers['x-forwarded-host'];
          const forwardedHost = rawForwardedHost ? rawForwardedHost.split(',')[0].trim() : null;
          const referer = req.headers['referer'];

          let incomingRequestDomain = '';
          if (forwardedHost) {
            incomingRequestDomain = normalizeDomain(forwardedHost);
          } else if (referer) {
            incomingRequestDomain = normalizeDomain(referer);
          }

          const saasDomain = normalizeDomain(process.env.APP_DOMAIN || 'localhost');
          const isProxied = req.headers['x-proxy-by'] || (forwardedHost && incomingRequestDomain !== saasDomain);
          const isDevDomain = (incomingRequestDomain.endsWith('.test') || incomingRequestDomain === 'localhost' || incomingRequestDomain === '127.0.0.1');

          //   if (isProxied && incomingRequestDomain && incomingRequestDomain !== normalizeDomain(project.websiteUrl) && incomingRequestDomain !== saasDomain && !isDevDomain) {
          //     return res.status(403).json({
          //       status: 'error',
          //       message: 'This landing page is not authorized for this domain.'
          //     });
          //   }
        }
      }
    }

    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'content="no-store"');
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
      websiteUrl: websiteUrl,
      thankYouUrl: page.thankYouUrl,
      thankYouPageContent: page.thankYouPageContent,
      thankYouPageStyles: page.thankYouPageStyles,
      meta: {
        _id: page._id,
        title: page.metaTitle || page.title,
        metaTitle: page.metaTitle,
        metaDescription: page.metaDescription,
        seo: {
          title: page.metaTitle || page.seo?.title || page.title,
          description: page.metaDescription || page.seo?.description || ''
        },
        status: page.status,
        projectId: page.projectId,
        primaryColor: primaryColor,
        secondaryColor: secondaryColor,
        logoUrl: logoUrl,
        websiteUrl: websiteUrl,
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
    const { slug: rawSlug } = req.params;
    const slug = (rawSlug || "").replace(/^api\/v1\/proxy\//i, '');

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
  const apiBaseUrl = (config.api?.baseUrl || process.env.API_BASE_URL || 'http://localhost:5000').replace(/\/+$/, '');
  const pageSlug = page.slug || '';
  const pageId = String(page._id || '');
  const projectId = String(page.projectId || '');

  const rawScript = `!function(){
  var A="${apiBaseUrl}", SL="${pageSlug}", PI="${pageId}", PJ="${projectId}";
  
  // Persistence Utility: Capture UTMs Immediately
  function sUTM(){
    var q=new URLSearchParams(window.location.search);
    try {
      if(window.top !== window && window.top.location.search) {
        var pq = new URLSearchParams(window.top.location.search);
        pq.forEach(function(v,k){if(!q.has(k))q.append(k,v)});
      }
    } catch(e) {}
    if(window.location.hash&&window.location.hash.indexOf("?")!==-1){
      var hq=new URLSearchParams(window.location.hash.split("?")[1]);
      hq.forEach(function(v,k){if(!q.has(k))q.append(k,v)});
    }
    var keys=["utm_source","utm_medium","utm_campaign","utm_term","utm_content","gclid","fbclid","msclkid"];
    var hasUtm = false;
    for (var i = 0; i < keys.length; i++) {
      if (q.get(keys[i])) { hasUtm = true; break; }
    }
    keys.forEach(function(k){
      try {
        if (hasUtm) {
          var v = q.get(k);
          if (v) {
            sessionStorage.setItem("dm_"+k,v);
            localStorage.setItem("dm_"+k,v);
          } else {
            sessionStorage.removeItem("dm_"+k);
            localStorage.removeItem("dm_"+k);
          }
        } else {
          sessionStorage.removeItem("dm_"+k);
          localStorage.removeItem("dm_"+k);
        }
      } catch(e) {}
    });
    console.log("💎 [TRACKER] UTM Captured on load:", {
      source: sessionStorage.getItem("dm_utm_source"),
      medium: sessionStorage.getItem("dm_utm_medium")
    });
  }
  sUTM();

  function getUTM(k){
    var v=null;
    try{
      v=sessionStorage.getItem("dm_"+k) || localStorage.getItem("dm_"+k);
    }catch(e){}
    if(!v){
      var q=new URLSearchParams(window.location.search);
      v=q.get(k);
    }
    return v || "";
  }

  function send(d,f,b,t,n){
    n=n||1;
    fetch(A+"/api/leads",{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        "Accept":"application/json"
      },
      body:JSON.stringify(d),
      mode:"cors"
    })
    .then(function(r){return r.json()})
    .then(function(r){
      if(r.status==="success"||r.status==="error"){
        f.reset();
        var ev=new CustomEvent('submit-success',{detail:{leadId:r.data&&r.data.leadId?r.data.leadId:'none'}});
        document.dispatchEvent(ev);
        
        // Prioritize redirect returned by API
        if (r.redirect) {
          window.location.replace(r.redirect);
          return;
        }

        var tyUrl=window.pageThankYouUrl||"";
        if(tyUrl&&tyUrl.trim()!==""){
          // Append current params to preserve tracking
          var currentParams = window.location.search;
          var separator = tyUrl.indexOf('?') !== -1 ? '&' : '?';
          var finalUrl = currentParams ? (tyUrl + separator + currentParams.replace('?', '')) : tyUrl;
          window.location.replace(finalUrl);
        } else {
          var u = new URL(window.location.href);
          window.location.replace(u.origin + u.pathname + u.search + '#' + SL + '?status=thank-you');
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
    var data = {
      pageSlug: SL,
      pageId: PI,
      projectId: PJ,
      timestamp: new Date().getTime(),
      pageurl: window.location.href,  // full current URL with slug + UTM params (backend Issue #3 fix)
      url: window.location.href,
      domain: window.location.hostname
    };

    // Capture every single named field in the form
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

    // Also include FormData for complex cases
    fd.forEach(function(v, k) {
      if (k && v && String(v).trim() !== "" && !data[k]) data[k] = v;
    });

    // UTM capture
    var utmKeys = ["utm_source","utm_medium","utm_campaign","utm_term","utm_content","gclid","fbclid","msclkid"];
    utmKeys.forEach(function(k){
      data[k] = getUTM(k);
    });

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
  const apiBaseUrl = (config.api?.baseUrl || process.env.API_BASE_URL || 'http://localhost:5000').replace(/\/+$/, '');
  const { title, content, seo, metaTitle, metaDescription } = page || {};
  if (!content) return '<html><body><p>Loading your AI design...</p></body></html>';

  const aiHtml = (typeof content === 'string' ? content : (content?.fullHtml || '')).trim();
  const aiCss = (typeof content === 'object' && content?.fullCss) ? content.fullCss : (page.styles || page.landingPageStyles || '');
  const aiJs = typeof content === 'object' ? (content?.fullJs || '') : '';

  let finalHtml = aiHtml;

  // ─── FIX RELATIVE /assets/ PATHS → Absolute CDN/API URL ─────────────────
  // This ensures old saved pages with local /assets/ paths render correctly
  // on any external domain without needing republishing.
  finalHtml = finalHtml.replace(/src="\/assets\//g, `src="${apiBaseUrl}/assets/`);
  finalHtml = finalHtml.replace(/src='\/assets\//g, `src='${apiBaseUrl}/assets/`);
  finalHtml = finalHtml.replace(/url\(\/assets\//g, `url(${apiBaseUrl}/assets/`);
  finalHtml = finalHtml.replace(/url\('\/assets\//g, `url('${apiBaseUrl}/assets/`);
  finalHtml = finalHtml.replace(/url\("\/assets\//g, `url("${apiBaseUrl}/assets/`);
  // Also fix old saved content with hardcoded localhost:5000/assets/ → production URL
  finalHtml = finalHtml.replace(/src="https?:\/\/localhost:\d+\/assets\//g, `src="${apiBaseUrl}/assets/`);
  finalHtml = finalHtml.replace(/src='https?:\/\/localhost:\d+\/assets\//g, `src='${apiBaseUrl}/assets/`);
  finalHtml = finalHtml.replace(/url\(https?:\/\/localhost:\d+\/assets\//g, `url(${apiBaseUrl}/assets/`);

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

  // Clean placeholders (Disabled to allow real Picsum images to render beautifully)
  // finalHtml = finalHtml.replace(/https:\/\/(fastly\.)?picsum\.photos\/[^\s"'>]+/g, 'https://via.placeholder.com/1200x800?text=Brand+Image');

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
  const rawTyScript = `!function(){window.pageThankYouUrl=${JSON.stringify(thankYouUrl)};window.pageSlug=${JSON.stringify(page.slug)};function doRedirect(){if(window.pageThankYouUrl&&window.pageThankYouUrl.trim()){window.location.replace(window.pageThankYouUrl)}else{var u=new URL(window.location.href);window.location.replace(u.origin+u.pathname+u.search+"#"+window.pageSlug+"?status=thank-you")}}document.addEventListener('gform_confirmation_loaded',function(){doRedirect()});document.addEventListener('submit-success',function(){doRedirect()});if(window.location.hash&&window.location.hash.includes('gf_')){doRedirect()}document.addEventListener('DOMContentLoaded',function(){var forms=document.querySelectorAll('form');forms.forEach(function(form){if(form.hasAttribute('data-no-redirect'))return;form.addEventListener('submit',function(){})})})}();`;
  const encodedTyScript = Buffer.from(rawTyScript).toString('base64');
  const thankYouRedirectScript = `<script>eval(atob("${encodedTyScript}"));</script>`;

  // ── Resolved SEO values from DB (always authoritative) ──────────────────
  // The Page Settings modal saves to metaTitle / metaDescription (flat fields)
  // seo.title / seo.description are legacy fallbacks
  const seoTitle = (metaTitle || seo?.title || title || 'Landing Page').trim();
  const seoDescription = (metaDescription || seo?.description || '').trim();
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
    `<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">`,
    `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />`,
    `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />`,
    `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Sharp:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />`,
    `<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">`,
    `<style>
      .material-symbols-outlined, .material-symbols-rounded, .material-symbols-sharp {
        font-family: 'Material Symbols Outlined', 'Material Symbols Rounded', 'Material Symbols Sharp', sans-serif;
        font-weight: normal;
        font-style: normal;
        font-size: 24px;
        line-height: 1;
        letter-spacing: normal;
        text-transform: none;
        display: inline-block;
        white-space: nowrap;
        word-wrap: normal;
        direction: ltr;
        -webkit-font-smoothing: antialiased;
        text-rendering: optimizeLegibility;
        -moz-osx-font-smoothing: grayscale;
        font-feature-settings: 'liga';
      }
    </style>`,
    `<script src="https://unpkg.com/lucide@latest"><\/script>`,
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
      // Force inject Base URL for assets
      if (!html.includes('<base ')) {
        html = html.replace(/<head>/i, `<head>\n  <base href="${apiBaseUrl}/">`);
      }

      // Force inject SEO and Performance tags
      const extraMeta = `
    ${canonicalUrl ? `<link rel="canonical" href="${canonicalUrl}">` : ''}
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="dns-prefetch" href="//fonts.googleapis.com">`;

      if (!html.includes('name="robots"')) {
        html = html.replace(/<\/head>/i, `${extraMeta}\n</head>`);
      }

      // Inject CDN libraries (FA icons + Material Symbols) if missing
      if (!html.includes('font-awesome') && !html.includes('fontawesome')) {
        html = html.replace(/<\/head>/i, `  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">\n</head>`);
      }
      if (!html.includes('Material+Symbols') && !html.includes('material-symbols')) {
        html = html.replace(/<\/head>/i, `  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />\n</head>`);
      }

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
      if (aiCss) {
        let processedCss = aiCss
          .replace(/PRIMARY_COLOR_PLACEHOLDER/g, pColor)
          .replace(/SECONDARY_COLOR_PLACEHOLDER/g, sColor)
          .replace(/LOGO_URL_PLACEHOLDER/g, finalLogo);

        if (!html.includes('id="ai-generated-styles"')) {
          html = html.replace(/<\/head>/i, `  <style id="ai-generated-styles">${processedCss}</style>\n</head>`);
        }
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
    <base href="${apiBaseUrl}/">
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
    <script>
      document.addEventListener('DOMContentLoaded', function() {
        if (window.lucide) window.lucide.createIcons();
      });
    </script>
</body>
</html>`;
};


/**
 * GET /preview/:token/html or /preview?page={pageId}&token={previewToken}
 * Serves draft or published content as full rendered HTML.
 */
exports.getPreviewHTML = async (req, res, next) => {
  try {
    const pageId = String(req.query.page || req.query.pageId || '').trim();
    const token = String(req.params.token || req.query.token || req.query.previewToken || '').trim();
    let page = null;

    if (pageId && /^[0-9a-fA-F]{24}$/.test(pageId)) {
      page = await Page.findById(pageId).select('title content styles seo status metaTitle metaDescription noIndex noFollow mainHeader mainFooter thankYouHeader thankYouFooter thankYouConversionScript thankYouUrl primaryColor secondaryColor logoUrl slug projectId previewToken');
      if (page && page.status !== 'published') {
        if (token && token !== page.previewToken) {
          return next(new AppError('Preview expired or invalid', 404));
        }
      }
    }

    if (!page) {
      const tokenId = token && token.length === 24 ? token : null;
      page = await Page.findOne({
        $or: [
          { previewToken: token },
          { _id: tokenId }
        ],
      }).select('title content styles seo status metaTitle metaDescription noIndex noFollow mainHeader mainFooter thankYouHeader thankYouFooter thankYouConversionScript thankYouUrl primaryColor secondaryColor logoUrl slug projectId previewToken');
    }

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
    const requestedPageId = String(req.query.page || req.query.pageId || '').trim();
    const pgSlug = String(req.query.pg || '').trim();
    const previewToken = String(req.query.token || req.query.previewToken || '').trim();
    const isThankYou = String(req.query.status || req.query.thankyou || '').toLowerCase() === 'thank-you';
    const forceRender = req.query.render === 'true';
    let page = null;

    // 1. Resolve via ID or Preview Token
    const idFromSlug = (req.params.slug && /^[0-9a-fA-F]{24}$/.test(req.params.slug)) ? req.params.slug : null;
    const lookupId = requestedPageId || idFromSlug;

    if (lookupId) {
      if (/^[0-9a-fA-F]{24}$/.test(lookupId)) {
        page = await Page.findOne({ _id: lookupId, isDeleted: { $ne: true } });
      }
      if (!page) {
        page = await Page.findOne({ previewToken: requestedPageId, isDeleted: { $ne: true } });
      }

      // If not found by ID/Token, treat requestedPageId as a potential slug
      if (!page && requestedPageId && !/^[0-9a-fA-F]{24}$/.test(requestedPageId)) {
        const cleanSlug = requestedPageId.replace(/^\/+|\/+$/g, '');
        const slugParts = cleanSlug.split('/');
        let pageSlug = '';
        let urlPreSlug = '';

        if (slugParts.length > 1 && slugParts[slugParts.length - 1] === 'thank-you') {
          pageSlug = slugParts[slugParts.length - 2];
          urlPreSlug = slugParts.slice(0, slugParts.length - 2).join('/');
        } else {
          pageSlug = slugParts[slugParts.length - 1];
          urlPreSlug = slugParts.slice(0, slugParts.length - 1).join('/');
        }

        if (pageSlug) {
          const potentialPages = await Page.find({ slug: pageSlug, isDeleted: { $ne: true } });
          for (const p of potentialPages) {
            const project = await Project.findById(p.projectId);
            const projectPreSlug = (project?.preSlug || '').replace(/^\/+|\/+$/g, '');
            if (projectPreSlug === urlPreSlug) {
              page = p;
              break;
            }
          }

          if (!page && slugParts.length === 1) {
            const p = await Page.findOne({ slug: slugParts[0], isDeleted: { $ne: true } });
            if (p) {
              const proj = await Project.findById(p.projectId);
              if (proj && !proj.preSlug) page = p;
            }
          }
        }
      }
    }

    // 2. Resolve via 'pg' query parameter (Priority fallback)
    if (!page && pgSlug) {
      const cleanSlug = pgSlug.replace(/^\/+|\/+$/g, '');
      const slugParts = cleanSlug.split('/');
      let pageSlug = '';
      let urlPreSlug = '';

      if (slugParts.length > 1 && slugParts[slugParts.length - 1] === 'thank-you') {
        pageSlug = slugParts[slugParts.length - 2];
        urlPreSlug = slugParts.slice(0, slugParts.length - 2).join('/');
      } else {
        pageSlug = slugParts[slugParts.length - 1];
        urlPreSlug = slugParts.slice(0, slugParts.length - 1).join('/');
      }

      if (pageSlug) {
        const potentialPages = await Page.find({ slug: pageSlug, isDeleted: { $ne: true } });
        if (potentialPages.length > 0) {
          for (const p of potentialPages) {
            const project = await Project.findById(p.projectId);
            const projectPreSlug = (project?.preSlug || '').replace(/^\/+|\/+$/g, '');
            if (projectPreSlug === urlPreSlug) {
              page = p;
              break;
            }
          }
        }

        if (!page && slugParts.length === 1) {
          page = await Page.findOne({ slug: slugParts[0], isDeleted: { $ne: true } });
          if (page) {
            const project = await Project.findById(page.projectId);
            if (project && project.preSlug) {
              page = null;
            }
          }
        }
      }
    }

    // 3. Resolve via URL path slug
    if (!page) {
      const rawSlug = String(req.params.slug || req.params[0] || '').trim();
      let cleanSlug = rawSlug.replace(/^\/+|\/+$/g, '');
      cleanSlug = cleanSlug.replace(/^api\/v1\/proxy\//i, '');
      const slugParts = cleanSlug.split('/');

      let pageSlug = '';
      let urlPreSlug = '';

      if (slugParts.length > 1 && slugParts[slugParts.length - 1] === 'thank-you') {
        pageSlug = slugParts[slugParts.length - 2];
        urlPreSlug = slugParts.slice(0, slugParts.length - 2).join('/');
      } else {
        pageSlug = slugParts[slugParts.length - 1];
        urlPreSlug = slugParts.slice(0, slugParts.length - 1).join('/');
      }

      if (!pageSlug && !forceRender) {
        // If it's a domain-only hit, check if the domain itself is mapped to a page
        const domainPage = await Page.findOne({ domain: req.get('host'), status: 'published', isDeleted: { $ne: true } });
        if (domainPage) {
          page = domainPage;
        } else {
          // Serve a bootstrap script that can resolve hash fragments (e.g. /#testing1234)
          // without changing the URL (staying on /#testing1234)
          return res.status(200).send(`
            <!DOCTYPE html>
            <html>
            <head>
              <title>Loading...</title>
              <style>
                body { font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #f8fafc; }
                .loader { border: 4px solid #f3f3f3; border-top: 4px solid #3498db; border-radius: 50%; width: 30px; height: 30px; animation: spin 2s linear infinite; }
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
              </style>
              <script>
                (function() {
                  var hash = window.location.hash;
                  if (hash && hash.length > 1) {
                    var slug = hash.substring(1).split('?')[0];
                    if (slug) {
                      // Fetch the actual HTML content for this slug
                      // We use a query param 'render=true' to tell the server to skip bootstrap
                      fetch('/' + slug + '?render=true' + window.location.search.replace('?', '&'))
                        .then(function(r) { 
                          if (!r.ok) throw new Error('Not found');
                          return r.text(); 
                        })
                        .then(function(html) {
                          document.open();
                          document.write(html);
                          document.close();
                        })
                        .catch(function(e) {
                          document.body.innerHTML = '<div style="text-align:center"><h1>404 - Page Not Found</h1><p>The requested page could not be located.</p></div>';
                        });
                      return;
                    }
                  }
                  document.body.innerHTML = '<div style="text-align:center"><h1>404</h1><p>Please provide a page slug in the URL hash (e.g. /#your-page).</p></div>';
                })();
              </script>
            </head>
            <body>
              <div class="loader"></div>
            </body>
            </html>
          `);
        }
      }

      const potentialPages = await Page.find({ slug: pageSlug, isDeleted: { $ne: true } });

      if (potentialPages.length > 0) {
        for (const p of potentialPages) {
          const project = await Project.findById(p.projectId);
          const projectPreSlug = (project?.preSlug || '').replace(/^\/+|\/+$/g, '');
          if (projectPreSlug === urlPreSlug) {
            page = p;
            break;
          }
        }
      }

      if (!page && slugParts.length === 1) {
        page = await Page.findOne({ slug: slugParts[0], isDeleted: { $ne: true } });
        if (page) {
          const project = await Project.findById(page.projectId);
          if (project && project.preSlug) {
            page = null;
          }
        }
      }

      // Final exact match fallback for HTML
      if (!page) {
        page = await Page.findOne({ slug: cleanSlug, isDeleted: { $ne: true } });
      }
    }

    if (!page) return next(new AppError('Page not found or no page id provided', 404));

    if (page.status !== 'published' && previewToken && previewToken !== page.previewToken) {
      return next(new AppError('Page not found or not published', 404));
    }

    // Increment views
    page.views += 1;
    await page.save({ validateBeforeSave: false });

    // Use the actual slug value for compatibility, but canonical root URL is query parameter based.
    const normalizedSlug = page.slug || '';

    // ─── SMART DOMAIN AUTHORIZATION ───
    if (page.projectId) {
      const project = await Project.findById(page.projectId);
      if (project) {
        // Increment project views
        await Project.findByIdAndUpdate(page.projectId, { $inc: { views: 1 } });

        // BUG-FIX #1: x-forwarded-host may be a comma-list when nginx/reverse-proxy sits
        // in front of Node. e.g. "rsdevelopercachechecking.rocketsites.ai, apiserver.ai-..."
        // Always take only the FIRST (leftmost / original client) hop.
        const rawForwardedHost = req.headers['x-forwarded-host'];
        const forwardedHost = rawForwardedHost ? rawForwardedHost.split(',')[0].trim() : null;
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
        const isAuthorizedDomain = (incomingRequestDomain === normalizeDomain(project.websiteUrl));
        const isDevDomain = (incomingRequestDomain.endsWith('.test') || incomingRequestDomain === 'localhost' || incomingRequestDomain === '127.0.0.1');

        // Relaxed authorization to match getPublicPageBySlug (commented out hard block)
        if (!isOwnerDomain && !isAuthorizedDomain && !isDevDomain && project.websiteUrl) {
          console.warn(`⚠️ Domain Mismatch (Logged but allowed): ${incomingRequestDomain} is not ${project.websiteUrl}`);
          // return res.status(200).send(`... Setup Required ...`);
        }
      }
    }

    // ── Build canonical URL from the requesting host (WP domain) ─────────
    // BUG-FIX #1: take only first value of x-forwarded-host (may be comma-list from reverse-proxy)
    const rawFwdHost = req.headers['x-forwarded-host'];
    const requestHost = (rawFwdHost ? rawFwdHost.split(',')[0].trim() : null) || req.headers['host'] || '';
    const canonicalUrl = requestHost
      ? `http${req.secure ? 's' : ''}://${requestHost}/?page=${page._id}`
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

    res.status(200).send(renderFullHTML(page, canonicalUrl, isThankYou));
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
    // Resolve pageSlug from URL params or referer if missing or a generic relay path
    const isRelayPath = !pageSlug || pageSlug.endsWith('/proxy-form') || pageSlug === 'proxy-form';
    if (isRelayPath) {
      const referer = req.get('referer') || '';
      const urlParamSlug = String(req.params.slug || req.params[0] || '').trim().replace(/^api\/v1\/proxy\//i, '');
      
      let detectedSlug = urlParamSlug;

      // If URL param is empty, try parsing referer
      if (!detectedSlug && referer) {
        try {
          const refUrl = new URL(referer);
          detectedSlug = refUrl.pathname.replace(/^\/+|\/+$/g, '');
          // If it's on a custom domain or mapped path, the first part might be the slug
          if (!detectedSlug && refUrl.searchParams.has('page')) {
             // Fallback to query param if present
          }
        } catch (e) { }
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

    // ── FIX: Resolve pageSlug from the Page document BEFORE Lead.create ──────
    // The WP proxy form only posts raw fields (name, phone, etc.) — no metadata.
    // schema.page_slug does NOT exist in FormSchema, so it is always undefined.
    // We must look up the real slug now, while we have schema.page_id guaranteed.
    if (!pageSlug || !projectId) {
      try {
        const _pg = await Page.findById(schema.page_id).select('slug projectId').lean();
        if (_pg) {
          if (!pageSlug) pageSlug = _pg.slug;
          if (!projectId) projectId = String(_pg.projectId || '');
        }
      } catch (_e) { /* non-fatal */ }
    }
    if (!pageSlug) pageSlug = String(schema.page_id); // absolute last-resort

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
      if (field.type === "date" || field.type === "time") candidates.push(
        "date", "time", "appointment", "schedule", "on_date",
        "travel_date", "traveldate", "departure_date", "departuredate",
        "checkin", "check_in", "check_in_date", "checkout", "check_out",
        "booking_date", "bookingdate", "arrival_date", "arrivaldate",
        "visit_date", "visitdate", "preferred_date", "preferreddate",
        "start_date", "startdate", "end_date", "enddate",
        "from_date", "fromdate", "to_date", "todate",
        "service_date", "servicedate", "event_date", "eventdate"
      );
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

      const storageKey = field.name || field.field_name;
      if (value !== undefined) {
        leadData[storageKey] = value;
      }
    }

    // Passthrough: also capture any submitted key NOT matched by the schema.
    // Handles field-name drift (HTML name="travel_date" vs schema label "date").
    const _sysKeys = new Set(['pageId', 'pageSlug', 'projectId', 'timestamp', 'url', 'domain',
      'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
      'gclid', 'fbclid', 'msclkid', 'redirect', 'pageUrl', 'referer']);
    const _schemaKeys = new Set(schema.fields.map(f => normalizeKey(f.name || f.field_name)));
    Object.entries(rawData).forEach(([k, v]) => {
      if (!_sysKeys.has(k) && v !== undefined && v !== null && String(v).trim() !== '') {
        const nk = normalizeKey(k);
        if (!_schemaKeys.has(nk) && !Object.keys(leadData).some(lk => normalizeKey(lk) === nk)) {
          leadData[k] = typeof v === 'string' ? v.trim() : v;
        }
      }
    });

    // FIX: Soft-warn — NEVER hard-fail on missing required fields.
    // Previously this returned 400 and the lead was lost entirely.
    // Now we log the warning and save with whatever data was received.
    // Only hard-fail when the post is completely empty (bot protection).
    if (missingFields.length > 0) {
      logger.warn(`[FORM] Missing required fields [${missingFields.join(', ')}] on "${pageSlug}" — saving with available data`);
    }
    const _allEmpty = Object.values(leadData).every(v => !v || String(v).trim() === '');
    if (_allEmpty && schema.fields.length > 0) {
      return res.status(400).json({ status: 'fail', message: 'No form data received', fields: missingFields });
    }

    // 4. UTMs Extraction
    const utm = {};
    const utmFields = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid', 'msclkid'];

    // First, try from request body
    utmFields.forEach(k => { if (rawData[k]) utm[k] = rawData[k]; });

    // Fallback: Parse from URL if missing
    const sourceUrl = rawData.url || rawData.pageUrl || rawData.referer || req.get('referer');
    if (sourceUrl && sourceUrl.includes('?')) {
      try {
        const urlParams = new URLSearchParams(sourceUrl.split('?')[1]);
        utmFields.forEach(k => {
          const val = urlParams.get(k);
          if (val && !utm[k]) utm[k] = val; // Only fill if not already present
        });
      } catch (e) { }
    }

    console.log("📥 [PUBLIC-FORM] REQ BODY:", JSON.stringify(rawData, null, 2));
    console.log("🚩 [PUBLIC-FORM] UTM VALUES:", utm);

    // 5. Create Lead
    const lead = await Lead.create({
      projectId: schema.project_id || projectId,
      pageId: schema.page_id || pageId,
      pageSlug: pageSlug,          // FIX: always resolved above — never undefined
      data: leadData,
      utm,
      // Spread UTM fields to top level for insurance
      ...utm,
      meta: {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        domain: rawData.domain || req.get('origin'),
        url: rawData.url || rawData.pageUrl || req.get('referer')
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
          const pColor = project.primaryColor || '#7c3aed';
          // Intro message removed per user request

          const adminMsg = `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #334155; margin: 0; padding: 0; background-color: #f8fafc; }
                .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; }
                .header { background-color: ${pColor}; padding: 40px 20px; text-align: center; color: #ffffff; }
                .header h1 { margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.025em; }
                .header p { margin: 10px 0 0; opacity: 0.8; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 600; }
                .content { padding: 40px; }
                .intro { font-size: 14px; color: #64748b; margin-bottom: 30px; text-align: center; white-space: pre-line; }
                .data-card { background-color: #f8fafc; border: 1px solid #f1f5f9; border-radius: 12px; padding: 20px; margin-bottom: 30px; }
                .data-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e2e8f0; }
                .data-row:last-child { border-bottom: none; }
                .label { font-size: 10px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; }
                .value { font-size: 14px; font-weight: 600; color: #1e293b; }
                .footer { padding: 30px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center; font-size: 11px; color: #94a3b8; }
                .footer p { margin: 5px 0; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>New Lead Captured</h1>
                  <p>${project.fromName || 'System Notification'}</p>
                </div>
                <div class="content">
                  <div class="data-card">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      ${Object.entries(leadData).map(([key, value]) => `
                      <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                          <div class="label">${key.replace(/_/g, ' ')}</div>
                          <div class="value">${value || 'Not provided'}</div>
                        </td>
                      </tr>`).join('')}
                      ${Object.entries(utm).map(([key, value]) => value ? `
                      <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                          <div class="label">${key.replace(/_/g, ' ')}</div>
                          <div class="value">${value}</div>
                        </td>
                      </tr>` : '').join('')}
                      <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                          <div class="label">Page</div>
                          <div class="value">${pageSlug || ''}</div>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0;">
                          <div class="label">Referral URL</div>
                          <div class="value" style="word-break: break-all; font-size: 13px;">
                            ${rawData.url || rawData.pageUrl || 'Direct'}
                          </div>
                        </td>
                      </tr>
                    </table>
                  </div>
                </div>
                <div class="footer">
                  <p>Powered by AI Landing Page Builder</p>
                  <p>&copy; ${new Date().getFullYear()} ${project.fromName || 'All Rights Reserved'}</p>
                </div>
              </div>
            </body>
            </html>
          `;

          emailService.sendEmail({
            to: adminEmail,
            subject: project.adminNotification.subject?.replace(/{{page_slug}}/g, pageSlug || '') || `New Lead from ${pageSlug}`,
            htmlContent: adminMsg,
            fromName: project.fromName,
            fromEmail: project.fromEmail,
            brevoKey: project.brevoKey
          }).catch(err => console.error('Admin Email Error:', err));
        }

        // 2. User Auto-Reply
        const userEmail = leadData.email || leadData.email_address;
        if (project.userNotification?.enabled && userEmail) {
          const pColor = project.primaryColor || '#7c3aed';
          const userName = leadData.name || leadData.full_name || 'there';
          const customUserMessage = project.userNotification.message || "Thank you for reaching out to us! We have received your inquiry and our team is already looking into it. We will get back to you as soon as possible.";

          const userMsg = `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #334155; margin: 0; padding: 0; background-color: #f8fafc; }
                .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; }
                .header { background-color: ${pColor}; padding: 40px 20px; text-align: center; color: #ffffff; }
                .header .logo { width: 48px; height: 48px; background: rgba(255,255,255,0.2); border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: bold; }
                .header h1 { margin: 0; font-size: 22px; font-weight: 700; }
                .content { padding: 40px; text-align: center; }
                .content h2 { color: #1e293b; margin-top: 0; }
                .content p { color: #64748b; font-size: 15px; margin-bottom: 30px; white-space: pre-line; }
                .footer { padding: 30px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center; font-size: 11px; color: #94a3b8; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <div class="logo">${(project.fromName || 'L')[0]}</div>
                  <h1>Message Received</h1>
                </div>
                <div class="content">
                  <h2>Hello ${userName},</h2>
                  <p>${customUserMessage}</p>
                  <div style="margin: 30px 0;">
                    <span style="padding: 12px 24px; border-radius: 50px; background-color: ${pColor}; color: #ffffff; font-weight: 700; font-size: 14px; text-decoration: none;">We'll talk soon!</span>
                  </div>
                </div>
                <div class="footer">
                  <p>This is an automated confirmation from ${project.fromName || 'our team'}.</p>
                  <p>&copy; ${new Date().getFullYear()} ${project.fromName || 'All Rights Reserved'}</p>
                </div>
              </div>
            </body>
            </html>
          `;

          emailService.sendEmail({
            to: userEmail,
            subject: project.userNotification.subject || "Thank you for contacting us!",
            htmlContent: userMsg,
            fromName: project.fromName,
            fromEmail: project.fromEmail,
            brevoKey: project.brevoKey
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
        thankYouUrl = `/${pageSlug || schema.page_slug || pageDoc?.slug}?status=thank-you`;
      }
    }

    // Ensure absolute URL for JSON response
    // BUG-FIX #1: split comma-list from reverse-proxy x-forwarded-host
    const rawFwdHostForm = req.get('x-forwarded-host');
    const host = (rawFwdHostForm ? rawFwdHostForm.split(',')[0].trim() : null) || req.get('host');
    let absoluteThankYouUrl = thankYouUrl;
    if (host && absoluteThankYouUrl.startsWith('/')) {
      const protocol = req.protocol || 'http';
      absoluteThankYouUrl = `${protocol}://${host}${absoluteThankYouUrl}`;
    }

    logger.info(`🎯 [FORM-SUBMIT] Redirection: ${thankYouUrl} (Absolute: ${absoluteThankYouUrl})`);

    // Final response
    if (req.xhr || req.headers.accept?.includes('json') || req.headers['content-type']?.includes('json')) {
      return res.status(201).json({
        status: 'success',
        message: 'Intelligence Captured',
        data: { leadId: lead._id },
        redirect: absoluteThankYouUrl
      });
    }

    // Traditional redirect: Use JS-based redirect to force URL update in proxied environments
    return res.status(200).send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Redirecting...</title>
        <meta http-equiv="refresh" content="0;url=${absoluteThankYouUrl}">
      </head>
      <body>
        <p>Redirecting to <a href="${absoluteThankYouUrl}">${absoluteThankYouUrl}</a>...</p>
        <script>
          window.location.replace("${absoluteThankYouUrl}");
        </script>
      </body>
      </html>
    `);

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
      console.warn(`🔑 [VERIFY] Invalid API Token Attempt: [${apiToken}]`);
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
      } else if (normalizeDomain(project.websiteUrl) !== incomingDomain) {
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

    const normalizedBackendBase = `${config.api.baseUrl}/api/v1/proxy`;

    const preSlug = (project.preSlug || "").replace(/^\/+|\/+$/g, '');
    const allowedPaths = [];
    pages.forEach(p => {
      const pageSlug = p.slug.replace(/^\/+|\/+$/g, '');
      const fullSlug = preSlug ? `/${preSlug}/${pageSlug}` : `/${pageSlug}`;
      allowedPaths.push(fullSlug);
      allowedPaths.push(`${fullSlug}/thank-you`);
      allowedPaths.push(`${fullSlug}/proxy-form`);
    });

    logger.info(`✅ [PLUGIN-VERIFY] Success for domain: ${domain} (Project: ${project.name})`);

    res.status(200).json({
      status: 'active',
      source_url: project.websiteUrl || domain,   // BUG-FIX #3: plugin's class-api.php reads this in update_options()
      target_url: normalizedBackendBase,
      target_domain: config.api.baseUrl.replace(/^https?:\/\//i, ''),
      allowed_paths: [...allowedPaths, '/api/leads'],
      plan: 'pro',
      cache_time: 300,
      settings: {
        site_name: project.name,
        primary_color: project.primaryColor || '#007bff',
      }
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

    const frontendUrl = config.frontend?.url || process.env.FRONTEND_URL || process.env.APP_BASE_URL || 'http://localhost:5000';
    const previewUrl = page.previewToken
      ? `${frontendUrl}/preview?page=${page._id}&token=${page.previewToken}`
      : `${frontendUrl}/preview?page=${page._id}`;

    res.status(200).json({
      status: 'success',
      data: {
        page,
        isPreview: true,
        tempUrl: previewUrl
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
      path.resolve(__dirname, '../../public/zip/buildify-ai.zip'),
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
    res.setHeader('Content-Disposition', 'attachment; filename="buildify-ai.zip"');

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

    // BUG-FIX #1: split comma-list from reverse-proxy
    const rawFwdHostSitemap = req.headers['x-forwarded-host'];
    const host = (rawFwdHostSitemap ? rawFwdHostSitemap.split(',')[0].trim() : null) || req.headers['host'] || '';
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
  // BUG-FIX #1: split comma-list from reverse-proxy
  const rawFwdHostRobots = req.headers['x-forwarded-host'];
  const host = (rawFwdHostRobots ? rawFwdHostRobots.split(',')[0].trim() : null) || req.headers['host'] || '';
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

    // Normalize path to slug (handle nested paths/pre-slugs)
    const cleanSlug = reqPath.replace(/^\/+|\/+$/g, '');

    if (!cleanSlug || cleanSlug === '') {
      return res.status(404).json({ status: 'error', message: 'No slug found in path' });
    }

    // ─── NESTED SLUG RESOLUTION ───
    const slugParts = cleanSlug.split('/');
    let pageSlug = '';
    let urlPreSlug = '';

    if (slugParts.length > 1 && slugParts[slugParts.length - 1] === 'thank-you') {
      pageSlug = slugParts[slugParts.length - 2];
      urlPreSlug = slugParts.slice(0, slugParts.length - 2).join('/');
    } else {
      pageSlug = slugParts[slugParts.length - 1];
      urlPreSlug = slugParts.slice(0, slugParts.length - 1).join('/');
    }

    if (!pageSlug) {
      return res.status(404).json({ status: 'error', message: 'Page not found' });
    }

    // 1. Find the project first if apiKey is provided
    let project = null;
    if (apiKey) {
      project = await Project.findOne({ apiToken: apiKey });
    }

    // 2. Find the page
    let page = null;
    const potentialPages = await Page.find({ slug: pageSlug, isDeleted: { $ne: true } });

    if (potentialPages.length > 0) {
      for (const p of potentialPages) {
        const proj = await Project.findById(p.projectId);
        const projectPreSlug = (proj?.preSlug || '').replace(/^\/+|\/+$/g, '');

        // If we have a specific project from apiKey, ensure it matches
        if (project && String(project._id) !== String(p.projectId)) continue;

        if (projectPreSlug === urlPreSlug) {
          page = p;
          if (!project) project = proj;
          break;
        }
      }
    }

    // Fallback for single-part slugs (only if no nested match found)
    if (!page && slugParts.length === 1) {
      const p = await Page.findOne({ slug: slugParts[0], isDeleted: { $ne: true } });
      if (p) {
        const proj = await Project.findById(p.projectId);
        if (proj && !proj.preSlug) {
          page = p;
          if (!project) project = proj;
        }
      }
    }

    if (!page || page.status !== 'published') {
      return res.status(404).json({ status: 'error', message: 'Landing page not found or not published' });
    }

    // Increment views
    page.views += 1;
    await page.save({ validateBeforeSave: false });

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
        if (!isApiKeyMatch && project.websiteUrl && incomingRequestDomain !== normalizeDomain(project.websiteUrl) && incomingRequestDomain !== saasDomain) {
          return res.status(403).json({ status: 'error', message: `Domain ${incomingRequestDomain} is not authorized for this project.` });
        }
      }
    }

    const html = renderFullHTML(page, `https://${domain}/${cleanSlug}`);

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
