'use strict';

const express = require('express');
const { getPublicPage, getPublicPageByDomain, verifyPlugin, getPreview, getPreviewHTML, getPublicPageHTML } = require('../controllers/publicController');

const router = express.Router();

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

/**
 * @route   POST /plugin/verify
 * @desc    Verify a plugin token and fetch configuration (WordPress/Shopify)
 * @access  Public
 */
router.post('/plugin/verify', verifyPlugin);

/**
 * @route   GET /:slug
 * @desc    Get live published page HTML by its slug (for WordPress plugin)
 * @access  Public
 */
router.get('/:slug(*)', getPublicPageHTML);

module.exports = router;
