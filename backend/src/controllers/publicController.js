'use strict';

const Page = require('../models/Page');
const Project = require('../models/Project');
const Lead = require('../models/Lead');
const AppError = require('../utils/AppError');
const { normalizeDomain } = require('../utils/validation');
const path = require('path');
const fs = require('fs');

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
    ).select('title slug content styles seo template domain status previewToken projectId views');

    if (!page) return next(new AppError('Page not found', 404));

    // ─── DOMAIN SECURITY: Verify match if proxied ───
    if (page.projectId) {
      const project = await Project.findById(page.projectId);
      if (project) {
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

    // For public published pages, we don't check status strictly here if we want same logic for preview
    // But the requirements say "published URL should work", so we can check if it's published or if it's a preview request
    
    res.status(200).json({
      status: 'success',
      data: page.content,
      styles: page.styles,
      // We also include meta for the frontend to set title/description
      meta: {
        title: page.title,
        seo: page.seo,
        status: page.status,
        projectId: page.projectId
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

  // Serve a secure, clean external script tag instead of a massive inline blob
  return `<script src="${apiBaseUrl}/api/leads/tracker.js" id="dm-lead-tracker" data-api-url="${apiBaseUrl}" data-page-slug="${pageSlug}" data-page-id="${pageId}" data-project-id="${projectId}" defer></script>`;
};

/**
 * Shared helper to render a high-converting landing page from AI-generated content.
 * Always injects the lead capture script so forms work on WordPress, custom domains, etc.
 */
const renderFullHTML = (page, canonicalUrl = '') => {
  const { title, content, seo } = page || {};
  if (!content) return '<html><body><p>Loading your AI design...</p></body></html>';
  
  const aiHtml = (typeof content === 'string' ? content : (content?.fullHtml || '')).trim();
  const aiCss  = (typeof content === 'object' && content?.fullCss) ? content.fullCss : (page.styles || '');
  const aiJs   = typeof content === 'object' ? (content?.fullJs || '') : '';

  const leadScript = buildLeadCaptureScript(page);

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
    `<meta name="robots" content="index, follow">`,
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
    }

    // 5. Inject lead script before </body>
    if (/<\/body>/i.test(html)) {
      html = html.replace(/<\/body>/i, `${leadScript}\n</body>`);
    } else {
      html = html + leadScript;
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

  const bodyContent = aiHtml || renderLegacyContent(pageData);

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
    <style>${aiCss || (aiHtml ? '' : fallbackStyles)}</style>
</head>
<body>
    ${bodyContent}
    ${aiJs ? `<script>${aiJs}</script>` : ''}
    ${leadScript}
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

    // ─── DOMAIN SECURITY: Verify match unconditionally if websiteUrl is set ───
    if (page.projectId) {
      const project = await Project.findById(page.projectId);
      if (project) {
        // Increment project views
        await Project.findByIdAndUpdate(page.projectId, { $inc: { views: 1 } });

        // Check lock only if websiteUrl is defined
        if (project.websiteUrl) {
          const forwardedHost = req.headers['x-forwarded-host'];
          const referer = req.headers['referer'];
          const host = req.headers['host'];
          
          // Determine the site domain requesting this page
          let incomingRequestDomain = "";
          if (forwardedHost) {
            incomingRequestDomain = normalizeDomain(forwardedHost);
          } else if (host) {
            incomingRequestDomain = normalizeDomain(host);
          } else if (referer) {
            incomingRequestDomain = normalizeDomain(referer);
          }

          const saasDomain = normalizeDomain(process.env.APP_DOMAIN || 'localhost');
          const isOwnerDomain = (incomingRequestDomain === saasDomain);
          const isAuthorizedDomain = (incomingRequestDomain === project.websiteUrl);

          console.log(`🔍 DOMAIN CHECK for ${normalizedSlug}: Request from [${incomingRequestDomain}] | Bound to [${project.websiteUrl}] | SaaS [${saasDomain}]`);

          if (!isOwnerDomain && !isAuthorizedDomain) {
            console.error(`🛑 BLOCKING ACCESS: Domain [${incomingRequestDomain}] is not authorized for Project [${project.name}]. Only [${project.websiteUrl}] or [${saasDomain}] are allowed.`);
            
            return res.status(403).send(`
              <html>
                <body style="font-family:sans-serif; text-align:center; padding:100px 20px; color:#64748b; background:#f8fafc;">
                  <div style="max-width:500px; margin:0 auto; background:white; padding:40px; border-radius:32px; box-shadow:0 20px 25px -5px rgba(0,0,0,0.1);">
                    <div style="font-size:64px; margin-bottom:24px;">🔒</div>
                    <h1 style="color:#0f172a; margin-bottom:12px;">Domain Unauthorized</h1>
                    <p style="margin-bottom:24px; line-height:1.6;">This landing page is securely locked to its registered domain of record. It cannot be displayed here.</p>
                    <div style="text-align:left; background:#f1f5f9; padding:20px; border-radius:16px; font-size:13px;">
                      <div style="margin-bottom:8px;"><b>Registered Domain:</b> <span style="color:#2563eb;">${project.websiteUrl}</span></div>
                      <div><b>Attempted Domain:</b> <span style="color:#dc2626;">${incomingRequestDomain || 'unknown'}</span></div>
                    </div>
                    <p style="font-size:12px; margin-top:30px; color:#94a3b8;">Ref ID: ${project._id}</p>
                  </div>
                </body>
              </html>
            `);
          }
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
      // Render the success/thank-you template
      const brandColor = page.primaryColor || '#7c3aed';
      const redirectUrl = page.websiteUrl || '#';
      
      const thankYouHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thank You | ${page.title}</title>
    <style>
      @keyframes pc-sparkle { 0%, 100% { transform: scale(0); opacity: 0; filter: blur(0px); } 50% { transform: scale(1.2); opacity: 1; filter: blur(1px); } }
      @keyframes pc-float { 0% { transform: translate(0, 0); } 50% { transform: translate(15px, -25px); } 100% { transform: translate(-10px, -50px); } }
      body { margin: 0; font-family: 'Inter', system-ui, -apple-system, sans-serif; background: #ffffff; display: flex; align-items: center; justify-content: center; min-height: 100vh; text-align: center; overflow: hidden; }
      .pc-sparkle { position: absolute; border-radius: 50%; pointer-events: none; z-index: 1; }
      .pc-content { position: relative; z-index: 10; max-width: 500px; padding: 40px; }
      .pc-success-icon { width: 100px; height: 100px; background: rgba(16, 185, 129, 0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 32px; color: #10b981; box-shadow: 0 0 40px rgba(16, 185, 129, 0.3); }
      .pc-title { font-size: 56px; font-weight: 900; color: #0f172a; margin: 0 0 16px; letter-spacing: -0.02em; }
      .pc-desc { font-size: 18px; line-height: 1.6; color: #64748b; margin-bottom: 40px; }
      .pc-btn { display: inline-flex; align-items: center; gap: 10px; background: ${brandColor} !important; color: white !important; padding: 18px 40px; border-radius: 100px; font-size: 16px; font-weight: 700; text-decoration: none; transition: all 0.3s ease; }
      .pc-btn:hover { transform: scale(1.05); }
    </style>
</head>
<body>
    <div class="pc-content">
        <div class="pc-success-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
        </div>
        <h1 class="pc-title">Thank You!</h1>
        <p class="pc-desc">Successfully received your request. Our team will reach out shortly.</p>
        <a href="${redirectUrl}" class="pc-btn">Visit Our Website</a>
    </div>
    <script>
      const colors = ['#ffffff', '#ffd700', '${brandColor}', '#ffffff'];
      for (let i = 0; i < 80; i++) {
        const s = document.createElement('div');
        s.className = 'pc-sparkle';
        const size = Math.random() * 5 + 1;
        const color = colors[Math.floor(Math.random() * colors.length)];
        s.style.width = size + 'px'; s.style.height = size + 'px';
        s.style.left = Math.random() * 100 + '%'; s.style.top = Math.random() * 110 + '%';
        s.style.background = color; s.style.boxShadow = '0 0 ' + (size * 2) + 'px ' + color;
        const d = Math.random() * 4 + 3;
        const dl = Math.random() * 8;
        s.style.animation = 'pc-sparkle ' + d + 's infinite ' + dl + 's ease-in-out, pc-float ' + (d * 2) + 's infinite ' + dl + 's linear';
        document.body.appendChild(s);
      }
    </script>
</body>
</html>`;
      return res.status(200).send(thankYouHtml);
    }

    res.status(200).send(renderFullHTML(page, canonicalUrl));
  } catch (err) {
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

    // Capture fields (handle both name and first_name/last_name combinations)
    const { name, first_name, last_name, email, phone, tel, message, comments } = req.body;
    
    const leadName = name || (first_name ? `${first_name} ${last_name || ''}`.trim() : 'Unknown Lead');
    const leadEmail = email || `missing-email-${Date.now()}@unknown.com`;
    const leadPhone = phone || tel || '';
    const leadMessage = message || comments || '';

    // Create the lead
    const lead = await Lead.create({
      name: leadName,
      email: leadEmail,
      phone: leadPhone,
      message: leadMessage,
      pageSlug: normalizedSlug,
      pageId: page._id,
      projectId: page.projectId,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    // Update Project lead count
    if (page.projectId) {
      await Project.findByIdAndUpdate(page.projectId, { $inc: { leadCount: 1 } });
    }

    // Detect if AJAX or Natural Form
    const isAjax = req.xhr || req.headers.accept?.includes('json') || req.get('Content-Type')?.includes('json');

    if (isAjax) {
      return res.status(201).json({
        status: 'success',
        message: 'Lead saved',
        redirect: `/${normalizedSlug}/thank-you`
      });
    }

    // Traditional Form Redirect
    res.redirect(`/${normalizedSlug}/thank-you`);

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
