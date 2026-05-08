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
// Legacy form submissions that still POST to slug-based endpoints are supported here.
router.post('/:slug(*)', handleFormSubmission);

module.exports = router;

