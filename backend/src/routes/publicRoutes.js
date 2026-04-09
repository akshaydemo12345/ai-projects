'use strict';

const express = require('express');
const { 
  getPublicPage, 
  getPublicPageBySlug,
  getPublicPageByDomain, 
  verifyPlugin, 
  getPreview, 
  getPreviewHTML, 
  getPublicPageHTML, 
  downloadPlugin 
} = require('../controllers/publicController');

const router = express.Router();

// ─── Direct API Access ───────────────────────────────────────────────────────
router.get('/api/public/page/:slug', getPublicPageBySlug);

// ─── Public Preview Rendering ────────────────────────────────────────────────

/**
 * @route   GET /preview/:token
 * @desc    Get draft or live page content by temporary preview token
 * @access  Public
 */
router.get('/preview/:token', getPreview);
router.get('/preview/:token/html', getPreviewHTML);

// ─── Public Page Rendering ───────────────────────────────────────────────────

/**
 * @route   GET /p/:slug
 * @desc    Get live published page content by its auto-generated slug
 * @access  Public
 */
router.get('/p/:slug', getPublicPage);

/**
 * @route   GET /p/domain/:domain
 * @desc    Get live published page content by its mapped custom domain
 * @access  Public
 */
router.get('/p/domain/:domain', getPublicPageByDomain);

router.post('/plugin/verify', verifyPlugin);

/**
 * @route   GET /plugin/download
 * @desc    Download the Domain Mapper WordPress plugin ZIP
 * @access  Public
 */
router.get('/plugin/download', downloadPlugin);

/**
 * @route   POST /verify-api-key
 * @desc    Explicit endpoint for verification as requested by the user
 * @access  Public
 */
router.post('/verify-api-key', verifyPlugin);

/**
 * @route   GET /:slug
 * @desc    Get live published page HTML by its slug (for WordPress plugin)
 * @access  Public
 */
router.get('/:slug(*)', getPublicPageHTML);

module.exports = router;
