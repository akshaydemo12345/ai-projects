'use strict';

const Page = require('../models/Page');
const Project = require('../models/Project');
const Lead = require('../models/Lead');
const AppError = require('../utils/AppError');
const { normalizeDomain } = require('../utils/validation');
const { generateTrackingScripts } = require('../utils/tracking');
const path = require('path');
const fs = require('fs');

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
    const { slug } = req.params;

    const page = await Page.findOneAndUpdate(
      { slug, isDeleted: { $ne: true } }, // We allow draft for preview if needed, but normally "published"
      { $inc: { views: 1 } },
      { new: true }
    ).select('title slug content styles landingPageContent landingPageStyles thankYouPageContent thankYouPageStyles seo template domain status previewToken projectId views primaryColor secondaryColor accentColor logoUrl websiteUrl thankYouUrl');

    if (!page) return next(new AppError('Page not found', 404));

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
    ).select('title slug content seo template domain publishedAt views projectId status');

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

    const rawScript = `!function(){var A="${apiBaseUrl}",SL="${pageSlug}",PI="${pageId}",PJ="${projectId}";function send(d,f,b,t,n){n=n||1;fetch(A+"/api/leads",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(d),mode:"cors"}).then(function(r){return r.json()}).then(function(r){if(r.status==="success"||r.status==="error"){f.reset();var ev=new CustomEvent('submit-success',{detail:{leadId:r.data&&r.data.leadId?r.data.leadId:'none'}});document.dispatchEvent(ev);var tyUrl=window.pageThankYouUrl||"";if(tyUrl&&tyUrl.trim()!==""){window.location.replace(tyUrl)}else if(window.location.pathname&&window.location.pathname!=='/'){var currentPath=window.location.pathname.replace(/\\/+$/,'');window.location.replace(window.location.origin+currentPath+"/thank-you")}else if(SL){window.location.replace(window.location.origin+"/"+SL+"/thank-you")}else{window.location.replace(window.location.href.split('?')[0].replace(/\\/+$/,'')+"/thank-you")}}}).catch(function(e){if(n<3){setTimeout(function(){send(d,f,b,t,n+1)},2000)}else{var currentPath=window.location.pathname.replace(/\\/+$/,'');window.location.replace(window.location.origin+currentPath+"/thank-you")}})}document.addEventListener("submit",function(e){var f=e.target;if(f.tagName!=="FORM")return;if(f.getAttribute("data-submitting")==="true"){e.preventDefault();return}f.setAttribute("data-submitting","true");e.preventDefault();e.stopImmediatePropagation();var b=f.querySelector('button[type="submit"]')||f.querySelector("button");var t=b?(b.textContent||"Submit"):"Submit";if(b){b.disabled=true;b.textContent="Sending...";b.style.opacity="0.7";b.style.cursor="not-allowed"}var fd=new FormData(f);var nameVal=fd.get("name")||fd.get("first_name")||fd.get("firstName")||fd.get("fullname");if(!nameVal){var nameInput=f.querySelector('input[name*="name"]')||f.querySelector('input[type="text"]');if(nameInput)nameVal=nameInput.value}var data={pageSlug:SL,pageId:PI,projectId:PJ,name:String(nameVal||"").trim(),email:(fd.get("email")||(f.querySelector('input[type="email"]')?f.querySelector('input[type="email"]').value:"")||"unknown@example.com").trim(),phone:(fd.get("phone")||fd.get("tel")||"").trim(),message:(fd.get("message")||(f.querySelector('textarea')?f.querySelector('textarea').value:"")).trim()};send(data,f,b,t,1)},true)}();`;
  const encodedScript = Buffer.from(rawScript).toString('base64');
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
  const aiCss  = (typeof content === 'object' && content?.fullCss) ? content.fullCss : (page.styles || page.landingPageStyles || '');
  const aiJs   = typeof content === 'object' ? (content?.fullJs || '') : '';

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
  const seoTitle       = (page.metaTitle       || seo?.title       || title || 'Landing Page').trim();
  const seoDescription = (page.metaDescription || seo?.description || '').trim();
  const seoKeywords    = Array.isArray(seo?.keywords) ? seo.keywords.join(', ') : (seo?.keywords || '');

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
    `<meta name="robots" content="noindex, nofollow">`,
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
      if (finalHeaderScript) {
        html = html.replace(/<\/head>/i, `${finalHeaderScript}\n</head>`);
      }
      // Inject Thank You URL config in head so it's available early
      html = html.replace(/<\/head>/i, `${thankYouRedirectScript}\n</head>`);
    }

    // 5. Inject lead script before </body>
    if (/<\/body>/i.test(html)) {
      html = html.replace(
        /<\/body>/i,
        `${leadScript}\n${finalFooterScript}\n</body>`
      );
    } else {
      html = html + leadScript + finalFooterScript;
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
    }).select('title content styles seo status');

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
    
    // Split slug to handle /slug/thank-you sub-paths
    const slugParts = cleanSlug.split('/');
    const normalizedSlug = slugParts[0]; // The actual page slug is always the first part
    const isThankYou = slugParts.length > 1 && slugParts[1] === 'thank-you';

    if (!normalizedSlug) return next(new AppError('Page not found', 404));

    const page = await Page.findOneAndUpdate(
      { slug: normalizedSlug, isDeleted: { $ne: true } },
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!page) return next(new AppError('Page not found or not published', 404));

    // ─── SMART DOMAIN AUTHORIZATION ───
    if (page.projectId) {
      const project = await Project.findById(page.projectId);
      if (project) {
        // Increment project views
        await Project.findByIdAndUpdate(page.projectId, { $inc: { views: 1 } });

        const forwardedHost = req.headers['x-forwarded-host'];
        const hostHeader   = req.headers['host'];
        const referer      = req.headers['referer'];
        
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
    const hostHeader   = req.headers['host'];
    const requestHost  = forwardedHost || hostHeader || '';
    const canonicalUrl = requestHost
      ? `http${req.secure ? 's' : ''}://${requestHost}/${normalizedSlug}`
      : '';

    res.setHeader('Content-Type', 'text/html');
    
    if (isThankYou) {
      if (page.thankYouPageContent) {
        // Render the exact custom thank you page the user built in the GrapesJS editor
        const tyPageMock = {
          ...page.toObject(),
          content: page.thankYouPageContent,
          styles: page.thankYouPageStyles,
          title: `${page.title || 'Landing Page'} - Thank You`
        };
        return res.status(200).send(renderFullHTML(tyPageMock, canonicalUrl, true));
      }

      // Render the generic success/thank-you template if no custom layout is built
      // Delegate this intelligently to the thankYouController which handles all layouts & configs flawlessly.
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
 */
exports.handleFormSubmission = async (req, res, next) => {
  try {
    const slug = String(req.params.slug || req.params[0] || '').trim();
    const normalizedSlug = slug.replace(/^\/+|\/+$/g, '');
    
    const page = await Page.findOne({ slug: normalizedSlug, isDeleted: { $ne: true } });
    if (!page) return next(new AppError('Page not found', 404));

    // Capture fields
    const { name, first_name, last_name, email, phone, tel, message, comments } = req.body;
    
    // ─── STRICT VALIDATION: Safely extract ───
    const leadName = (name || (first_name ? `${first_name} ${last_name || ''}`.trim() : 'Contact')).trim();
    const leadEmail = (email || 'anonymous@example.com').trim().toLowerCase();
    const leadPhone = (phone || tel || '').trim();
    const leadMessage = (message || comments || '').trim();

    const recentLead = await Lead.findOne({
      email: leadEmail,
      pageSlug: normalizedSlug,
      createdAt: { $gt: new Date(Date.now() - 5000) }
    });

    if (!recentLead) {
      await Lead.create({
        name: leadName,
        email: leadEmail,
        phone: leadPhone,
        message: leadMessage,
        pageSlug: normalizedSlug,
        pageId: page._id || undefined,
        projectId: page.projectId || undefined,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        domain: req.headers.host || 'unknown',
        url: req.headers.referer || req.originalUrl || 'unknown'
      });
      if (page.projectId) {
        await Project.findByIdAndUpdate(page.projectId, { $inc: { leadCount: 1 } });
      }
    }

    const thankYouUrl = page.thankYouUrl?.trim() ? page.thankYouUrl : `/${normalizedSlug}/thank-you`;
    
    if (req.xhr || req.headers.accept?.includes('json') || req.get('Content-Type')?.includes('json')) {
      return res.status(201).json({ status: 'success', message: 'Lead saved', redirect: thankYouUrl });
    }

    return res.redirect(thankYouUrl);


  } catch (err) {
    console.error('❌ Form submission error:', err);
    next(err);
  }
};

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
    
    res.status(200).json({
      status: 'active',
      plan: 'pro',
      cache_time: 300,
      projectId: project._id,
      projectName: project.name,
      source_url: project.websiteUrl,
      target_url: normalizedBackendBase,
      relay_url: normalizedBackendBase,
      allowed_paths: [...pages.map(p => `/${p.slug}`), '/api/leads'],
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

/**
 * POST /api/leads
 * Unified lead submission handler for dynamic landing pages.
 */
exports.submitDynamicLead = async (req, res, next) => {
  try {
    const data = req.body;
    const { domain, pageUrl, url, pageSlug, path: reqPath, email } = data;

    if (!email) {
      return res.status(400).json({ status: 'error', message: 'Email is required' });
    }

    // 1. Find the page associated with this submission
    // Support multiple field patterns for maximum compatibility with tracker/embed/SDKs
    const targetSlug = pageSlug || data.slug || (reqPath || '').replace(/^\/+|\/+$/g, '').split('/')[0];
    
    let page = await Page.findOne({ 
      slug: targetSlug, 
      isDeleted: { $ne: true } 
    });

    // Fallback search if still not found
    if (!page && pageSlug) {
        page = await Page.findOne({ slug: pageSlug });
    }

    // Create the lead
    const lead = await Lead.create({
      name: data.name || data.first_name || 'Contact',
      email: email.trim().toLowerCase(),
      phone: data.phone || data.tel || '',
      message: data.message || data.comments || '',
      domain: domain || 'unknown',
      url: pageUrl || url || page.url || 'unknown',
      pageSlug: targetSlug || 'unknown',
      pageId: page ? page._id : null,
      projectId: page ? page.projectId : null,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    // Update Project lead count
    if (page && page.projectId) {
      await Project.findByIdAndUpdate(page.projectId, { $inc: { leadCount: 1 } });
    }

    // Return success with thank you info
    const thankYouUrl = page && page.thankYouUrl 
      ? page.thankYouUrl 
      : (page ? `/${page.slug}/thank-you` : null);

    res.status(201).json({
      status: 'success',
      success: true,
      message: 'Lead captured successfully',
      thankYouUrl,
      gaEventLabel: page ? page.slug : 'direct'
    });

  } catch (err) {
    next(err);
  }
};

