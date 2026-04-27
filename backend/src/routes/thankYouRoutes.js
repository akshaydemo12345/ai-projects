const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const thankYouController = require('../controllers/thankYouController');

// ─── Public Routes ────────────────────────────────────────────────────────

/**
 * @route   GET /api/thank-you/render/:pageSlug(*)
 * @desc    Render dynamic Thank You page (public, supports pre-slugs)
 */
router.get('/render/:pageSlug(*)', thankYouController.renderThankYouPage);

// ─── Protected Routes (Auth Required) ────────────────────────────────────────

router.use(protect);

/**
 * @route   GET /api/thank-you/layouts
 * @desc    Get all available Thank You layouts
 */
router.get('/layouts', thankYouController.getLayouts);

/**
 * @route   GET /api/thank-you/config/:pageId
 * @desc    Get Thank You config for a specific page
 */
router.get('/config/:pageId', thankYouController.getThankYouConfig);

/**
 * @route   PUT /api/thank-you/config/:pageId
 * @desc    Update Thank You config for a specific page
 */
router.put('/config/:pageId', thankYouController.updateThankYouConfig);

/**
 * @route   POST /api/thank-you/preview
 * @desc    Preview Thank You page with custom content
 */
router.post('/preview', thankYouController.previewThankYouPage);

module.exports = router;
