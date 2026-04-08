'use strict';

const Page = require('../models/Page');
const AppError = require('../utils/AppError');

/**
 * GET /p/:slug
 * Public endpoint — serves the live JSON content of a published page.
 */
exports.getPublicPage = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const page = await Page.findOneAndUpdate(
      { slug, status: 'published' },
      { $inc: { views: 1 } },
      { new: true }
    ).select('title slug content seo template domain publishedAt views');

    if (!page) return next(new AppError('Page not found or not published', 404));

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
  
  const aiHtml = (content.fullHtml || '').trim();
  const aiCss = content.fullCss || '';
  const aiJs = content.fullJs || '';

  // ─── 0. SMART REDETECT: Full Document vs Fragment ────────────────────────
  // If the AI generated a full document (doctype or html tag), serve it DIRECTLY.
  // This prevents double-nested <html> and <body> tags which break styles/scripts.
  if (aiHtml.toLowerCase().includes('<!doctype') || aiHtml.toLowerCase().includes('<html')) {
    return aiHtml;
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
    ).select('title slug content seo template domain publishedAt views');

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

    const page = await Page.findOne({ apiToken, status: 'published' }).select(
      'title slug content seo template domain publishedAt'
    );

    if (!page) {
      return next(new AppError('Invalid API token or page is unpublished.', 401));
    }

    const backendBaseUrl = process.env.APP_BASE_URL || 'http://127.0.0.1:5000';
    const normalizedBackendBase = backendBaseUrl.replace(/\/+$/, '');
    
    res.status(200).json({
      status: 'active',
      plan: 'pro',
      cache_time: 300,
      target_url: normalizedBackendBase,
      allowed_paths: [ `/${page.slug}` ],
      message: 'License verified and active.'
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
