'use strict';

const express = require('express');
const router = express.Router();

const { proxyAuth } = require('../middleware/proxyAuth');
const {
  getPublicPageHTML,
  handleFormSubmission,
} = require('../controllers/publicController');

/**
 * Health check — no auth required.
 * MUST be declared BEFORE the wildcard catch-all routes below.
 */
router.get('/proxy-status', (req, res) => {
  res.json({ status: 'active', engine: 'direct-html' });
});

/**
 * GET /api/v1/proxy/<preSlug>/<slug>
 *
 * The WordPress plugin fetches landing-page HTML here.
 * app.use('/api/v1/proxy', router) already strips the prefix, so the path
 * arriving here is e.g. "/ppc/testing-seo" — NOT "/proxy/ppc/testing-seo".
 *
 * BUG-FIX #2: The original route was:
 *   router.get(/^\/proxy\/(.+)/, proxyAuth, proxyController.handleProxy)
 * That regex NEVER matched because the "/proxy/" prefix was already stripped,
 * so every WordPress plugin request fell through with no handler.
 * Fix: use a plain wildcard that matches all remaining paths.
 */
router.get('/*', proxyAuth, getPublicPageHTML);

/**
 * POST /api/v1/proxy/<slug> — form submission relay from WordPress
 */
router.post('/*', proxyAuth, handleFormSubmission);

module.exports = router;
