'use strict';

const Page = require('../models/Page');
const Project = require('../models/Project');
const AppError = require('../utils/AppError');
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
      { 
        $or: [
          { slug }, 
          { previewToken: slug }, 
          { _id: slug.length === 24 ? slug : null }
        ],
        isDeleted: { $ne: true } 
      },
      { $inc: { views: 1 } },
      { new: true }
    ).select('title slug content styles seo template domain status previewToken projectId');

    if (!page) return next(new AppError('Page not found', 404));

    // For public published pages, we don't check status strictly here if we want same logic for preview
    // But the requirements say "published URL should work", so we can check if it's published or if it's a preview request
    
    res.status(200).json({
      status: 'success',
      data: page.content,
      // We also include meta for the frontend to set title/description
      meta: {
        title: page.title,
        styles: page.styles,
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
      { slug, status: 'published' },
      { $inc: { views: 1 } },
      { new: true }
    ).select('title slug content styles seo template domain publishedAt views projectId');

    if (!page) return next(new AppError('Page not found or not published', 404));

    // Token check removed as per requirements for public pages
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
 * Shared helper to render a high-converting landing page from AI-generated JSON.
 * 100% AI-generated code (No hardcoded structures).
 */
const renderFullHTML = (page) => {
  const { title, content, seo, _id } = page || {};
  if (!content) return '<html><body><p>Loading your AI design...</p></body></html>';
  
  // Handle content being a string (full document) or an object (structured)
  const aiHtml = (typeof content === 'string' ? content : (content?.fullHtml || '')).trim();
  const aiCss = (typeof content === 'object' ? (content?.fullCss || '') : '') || (page.styles || '');
  const aiJs = typeof content === 'string' ? '' : (content?.fullJs || '');

  // ─── 0. SMART REDETECT: Full Document vs Fragment ────────────────────────
  // If the AI generated a full document (doctype or html tag), serve it with styles.
  if (aiHtml.toLowerCase().includes('<!doctype') || aiHtml.toLowerCase().includes('<html')) {
    let finalDoc = aiHtml;
    if (aiCss && !finalDoc.toLowerCase().includes('<style')) {
      if (finalDoc.toLowerCase().includes('</head>')) {
        finalDoc = finalDoc.replace(/<\/head>/i, `<style>${aiCss}</style></head>`);
      } else {
        finalDoc = `<style>${aiCss}</style>` + finalDoc;
      }
    }
    return finalDoc;
  }
  
  // ─── 1. Legacy/Structured Mapper (Fallback) ────────────────────────────────
  const pageData = content.pageContent || content;
  const design = pageData.design || {};

  const renderLegacyContent = (data) => {
    let html = '';
    if (data.hero) {
      html += `
      <section class="hero-section">
        <div class="mesh-gradient"></div>
        <div class="container hero-content animate-in-up">
          ${data.hero.badge ? `<div class="badge">${data.hero.badge}</div>` : ''}
          <h1 class="heading-xl">${data.hero.headline || data.hero.heading || ''}</h1>
          <p class="text-lg">${data.hero.subheadline || data.hero.subheading || ''}</p>
          <div class="hero-actions">
            ${data.hero.primaryCta ? `<button class="btn-primary glow">${data.hero.primaryCta}</button>` : ''}
            ${data.hero.secondaryCta ? `<button class="btn-secondary">${data.hero.secondaryCta}</button>` : ''}
          </div>
        </div>
      </section>`;
    }
    return html || '<p>No content generated.</p>';
  };

  const bodyContent = aiHtml || renderLegacyContent(pageData);

  // Fallback Styles if aiCss is missing
  const fallbackStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');
    body { font-family: 'Inter', sans-serif; margin: 0; padding: 0; }
  `;

    const leadCaptureScript = `
    <script>
      (function() {
        const API_URL = "${process.env.APP_BASE_URL || 'http://localhost:5000'}";
        const PAGE_SLUG = "${page.slug}";
        const PROJECT_ID = "${page.projectId}";

        async function submitLead(data, form, btn, originalBtnText) {
          console.log("Attempting lead submission to:", API_URL + "/api/leads", data);
          try {
            const response = await fetch(API_URL + "/api/leads", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(data),
              mode: 'cors'
            });

            console.log("Response status:", response.status);
            const result = await response.json();
            if (result.status === 'success') {
              form.innerHTML = '<div style="text-align:center; padding: 40px 20px;"><h3 style="color:#059669; font-size: 24px; margin-bottom: 10px;">Thank you!</h3><p style="color:#4b5563;">Your inquiry was sent successfully. We will contact you soon.</p></div>';
            } else {
              throw new Error(result.message || 'Server error');
            }
          } catch (err) {
            alert("Submission failed. Please try again later.");
            if (btn) {
              btn.disabled = false;
              btn.innerHTML = originalBtnText;
            }
          }
        }

        document.addEventListener('submit', function(e) {
          const form = e.target;
          if (form.querySelector('input[type="email"]') || form.id === 'lead-form') {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            const originalBtnText = btn ? btn.innerHTML : 'Submit';
            if (btn) {
              btn.disabled = true;
              btn.innerHTML = 'Sending...';
            }

            const formData = new FormData(form);
            const data = {
              pageSlug: PAGE_SLUG,
              projectId: PROJECT_ID,
              name: formData.get('name') || formData.get('first_name') || '',
              email: formData.get('email') || '',
              phone: formData.get('phone') || formData.get('tel') || '',
              message: formData.get('message') || ''
            };

            submitLead(data, form, btn, originalBtnText);
          }
        });
      })();
    </script>`;

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
    ${leadCaptureScript}
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
    }).select('title content seo status');

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
      { slug: normalizedSlug, status: 'published' },
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!page) return next(new AppError('Page not found or not published', 404));

    // Security: Domain Lock for proxied requests
    const project = await Project.findById(page.projectId);
    const proxyHost = req.headers['x-forwarded-host'] || req.headers['x-proxy-domain'];
    
    if (project && project.websiteUrl && proxyHost) {
      const normalize = (u) => u.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/+$/, '').split('/')[0].toLowerCase();
      const projectDomain = normalize(project.websiteUrl);
      const requestDomain = normalize(proxyHost);

      if (projectDomain && requestDomain && projectDomain !== requestDomain) {
        return next(new AppError(`Unauthorized: This page is locked to ${projectDomain}.`, 403));
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
      return next(new AppError('Invalid API token. No project found.', 401));
    }

    // Security: Match installing domain with saved websiteUrl
    const requestOrigin = domain || req.headers.origin || req.headers.referer || '';
    if (project.websiteUrl && requestOrigin) {
      const normalize = (u) => u.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/+$/, '').split('/')[0].toLowerCase();
      const projectDomain = normalize(project.websiteUrl);
      const originDomain = normalize(requestOrigin);

      if (projectDomain && originDomain && projectDomain !== originDomain) {
        return next(new AppError(`Licensing Error: This token is locked to "${projectDomain}". You are currently on "${originDomain}". Please update the Website URL in your Project Settings if this is correct.`, 403));
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
      target_url: normalizedBackendBase,
      allowed_paths: pages.map(p => `/${p.slug}`),
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
    ).select('title slug content styles seo template domain status previewToken previewUrl');

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
      return next(new AppError('Plugin ZIP file not found. Please contact support.', 404));
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
