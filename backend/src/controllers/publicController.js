'use strict';

const Page = require('../models/Page');
const Project = require('../models/Project');
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

  return `
<script>
(function() {
  var API_URL = "${apiBaseUrl}";
  var PAGE_SLUG = "${pageSlug}";
  var PAGE_ID = "${pageId}";
  var PROJECT_ID = "${projectId}";

  function showSuccessModal() {
    var modal = document.getElementById("pc-success-modal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "pc-success-modal";
      modal.innerHTML = \`
        <div style="position:fixed; z-index:99999; left:0; top:0; width:100%; height:100%; background:rgba(0,0,0,0.5); backdrop-filter:blur(8px); display:flex; align-items:center; justify-content:center; opacity:0; transition:opacity 0.3s ease; font-family: 'Inter', system-ui, -apple-system, sans-serif;">
          <div style="background:white; padding:40px; border-radius:30px; max-width:420px; width:90%; text-align:center; transform:translateY(20px); transition:transform 0.3s ease; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);">
            <div style="width:80px; height:80px; background:#ecfdf5; border-radius:50%; display:flex; align-items:center; justify-content:center; margin:0 auto 24px;">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <h3 style="margin:0 0 12px; font-size:28px; font-weight:800; color:#111827;">Thank you!</h3>
            <p style="margin:0 0 32px; color:#4b5563; font-size:16px; line-height:1.6;">Your message has been sent successfully. We'll get back to you shortly.</p>
            <button onclick="document.getElementById('pc-success-modal').remove()" style="background:#111827; color:white; border:none; padding:16px 32px; border-radius:15px; font-size:16px; font-weight:600; cursor:pointer; width:100%; transition:all 0.2s;">Continue</button>
          </div>
        </div>
      \`;
      document.body.appendChild(modal);
      
      setTimeout(function() {
        var backdrop = modal.querySelector("div");
        var content = backdrop.querySelector("div");
        backdrop.style.opacity = "1";
        content.style.transform = "translateY(0)";
      }, 10);
    }
  }

  function submitLead(data, form, btn, originalBtnText, attempt) {
    attempt = attempt || 1;
    fetch(API_URL + "/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      mode: "cors"
    })
    .then(function(r) { return r.json(); })
    .then(function(result) {
      if (result.status === "success") {
        showSuccessModal();
        form.reset();
        if (btn) { btn.disabled = false; btn.textContent = originalBtnText; }
      } else {
        throw new Error(result.message || "Server error");
      }
    })
    .catch(function(err) {
      if (attempt < 3) {
        if (btn) btn.textContent = "Retrying...";
        setTimeout(function() { submitLead(data, form, btn, originalBtnText, attempt + 1); }, 2000);
      } else {
        alert("Submission failed: " + err.message);
        if (btn) { btn.disabled = false; btn.textContent = originalBtnText; }
      }
    });
  }

  document.addEventListener("submit", function(e) {
    var form = e.target;
    if (!form.querySelector('input[type="email"]') && form.id !== "lead-form") return;
    e.preventDefault();

    var btn = form.querySelector('button[type="submit"]') || form.querySelector('button');
    var originalBtnText = btn ? (btn.textContent || "Submit") : "Submit";
    if (btn) { btn.disabled = true; btn.textContent = "Sending..."; }

    var fd = new FormData(form);
    submitLead({
      pageSlug: PAGE_SLUG,
      pageId:   PAGE_ID,
      projectId: PROJECT_ID,
      name:    fd.get("name") || fd.get("first_name") || "",
      email:   fd.get("email") || "",
      phone:   fd.get("phone") || fd.get("tel") || "",
      message: fd.get("message") || fd.get("comments") || ""
    }, form, btn, originalBtnText, 1);
  });
})();
</script>`;
};

/**
 * Shared helper to render a high-converting landing page from AI-generated content.
 * Always injects the lead capture script so forms work on WordPress, custom domains, etc.
 */
const renderFullHTML = (page) => {
  const { title, content, seo } = page || {};
  if (!content) return '<html><body><p>Loading your AI design...</p></body></html>';
  
  const aiHtml = (typeof content === 'string' ? content : (content?.fullHtml || '')).trim();
  const aiCss  = (typeof content === 'object' && content?.fullCss) ? content.fullCss : (page.styles || '');
  const aiJs   = typeof content === 'object' ? (content?.fullJs || '') : '';

  const leadScript = buildLeadCaptureScript(page);

  // Full document (AI returned <!DOCTYPE html>) — inject script before </body>
  if (aiHtml.toLowerCase().includes('<!doctype') || aiHtml.toLowerCase().includes('<html')) {
    if (aiHtml.toLowerCase().includes('</body>')) {
      return aiHtml.replace(/<\/body>/i, leadScript + '\n</body>');
    }
    return aiHtml + leadScript;
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
    <title>${title || (seo ? seo.title : 'AI Created Site')}</title>
    <style>${aiCss || (aiHtml ? '' : fallbackStyles)}</style>
    ${seo ? `<meta name="description" content="${seo.description || ''}">` : ''}
</head>
<body>
    ${bodyContent}
    <script>${aiJs || ''}</script>
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
    const slug = String(req.params.slug || req.params[0] || '').trim();
    const normalizedSlug = slug.replace(/^\/+|\/+$/g, '');

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

    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(renderFullHTML(page));
  } catch (err) {
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
 * Serves the domain-mapper.zip file from the backend public directory.
 * Ensures correct headers for ZIP file downloads.
 */
exports.downloadPlugin = async (req, res, next) => {
  try {
    const zipPath = path.resolve(__dirname, '../../public/zip/domain-mapper.zip');

    if (!fs.existsSync(zipPath)) {
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
