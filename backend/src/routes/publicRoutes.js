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
router.get('/api/public/page', getPublicPageBySlug);
router.get('/api/public/page/:slug(*)', getPublicPageBySlug);

// ─── Public Preview Rendering ────────────────────────────────────────────────
router.get('/preview/:token/json', getPreview);
router.get('/preview/:token', (req, res) => {
  const { token } = req.params;
  return res.redirect(307, `/preview/${token}/html`);
});
router.get('/preview/:token/html', getPreviewHTML);
router.get('/preview', getPreviewHTML);

// ─── Public Page Rendering (Query param based) ───────────────────────────────
router.get('/', getPublicPageHTML); 

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


// NOTE: Slug-based public page routing has been removed in favor of query param based page IDs.
// BUG-FIX #4: GET slug route was incorrectly removed. It is still required for:
//   1. WordPress plugin requests that need slug-based page resolution
//   2. Custom-domain / direct hits (e.g. visiting the WP URL directly in a browser)
//   3. Any fallback where page is identified by URL path, not a query param
// MUST come after all specific GET routes above, and BEFORE the POST handler.
router.get('/:slug(*)', getPublicPageHTML);

// Legacy form submissions that still POST to slug-based endpoints are supported here.
router.post('/:slug(*)', handleFormSubmission);

module.exports = router;

