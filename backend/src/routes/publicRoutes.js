'use strict';

const express = require('express');
const { 
  getPublicPageBySlug,
  getPublicPageByDomain, 
  verifyPlugin, 
  getPreview, 
  getPreviewHTML, 
  getPublicPageHTML, 
  handleFormSubmission,
  downloadPlugin,
  getSitemap,
  getRobotsTxt,
} = require('../controllers/publicController');

const router = express.Router();

// ─── JSON API: used by the React frontend ────────────────────────────────────
router.get('/api/public/page/:slug(*)', getPublicPageBySlug);

// ─── Public Preview Rendering ────────────────────────────────────────────────
router.get('/preview/:token', getPreview);
router.get('/preview/:token/html', getPreviewHTML);

// ─── Domain + Plugin Routes ──────────────────────────────────────────────────
router.get('/domain/:domain', getPublicPageByDomain);
router.post('/plugin/verify', verifyPlugin);
router.post('/verify-api-key', verifyPlugin);
router.get('/plugin/download', downloadPlugin);

// ─── SEO: Sitemap & Robots ────────────────────────────────────────────────────
router.get('/sitemap.xml', getSitemap);
router.get('/robots.txt', getRobotsTxt);
router.get('/api/page', require('../controllers/publicController').getDynamicPage);
router.post('/api/leads', require('../controllers/publicController').submitDynamicLead);


// ─── Smart Slug Route (HTML for browsers/WP, JSON for API clients) ───────────
/**
 * @route   GET /:slug
 * @desc    Serves full rendered HTML to browsers and WordPress plugin.
 *          Returns JSON only if the client explicitly sends Accept: application/json.
 * @access  Public
 */
router.get('/:slug(*)', (req, res, next) => {
  const acceptsJson = req.headers['accept']?.includes('application/json');
  const isApiClient = req.headers['x-api-token'] || req.headers['x-requested-with'] === 'XMLHttpRequest';

  // Only return JSON for explicit API/AJAX requests from the React dashboard
  if (acceptsJson && isApiClient) {
    return next(); // Fall through to error handler as a 404
  }

  // Default: render full HTML (for browsers, WordPress plugin, iframes)
  return getPublicPageHTML(req, res, next);
});

/**
 * @route   POST /:slug
 * @desc    Auto-handles form submissions POSTed directly to a page slug.
 *          Redirects to /:slug/thank-you upon success.
 */
router.post('/:slug(*)', handleFormSubmission);

module.exports = router;

