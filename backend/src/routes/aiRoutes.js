'use strict';

const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { rateLimiter } = require('../middleware/rateLimiter');
const { generateContent, analyzeWebsite, structuredScrape } = require('../controllers/aiController');

const router = express.Router();

// Rate-limit: 5 AI operations per minute per IP
const aiRateLimit = rateLimiter({
  windowMs: 60_000,
  max: 5,
  message: 'Too many AI requests. Please wait a moment before trying again.',
});

/**
 * @route   POST /ai/generate
 * @desc    Generate landing page content using OpenAI
 * @access  Private (JWT)
 */
router.post('/generate', protect, aiRateLimit, generateContent);

/**
 * @route   POST /ai/analyze-website
 * @desc    Analyze an existing website and generate optimized content
 * @access  Private (JWT)
 */
router.post('/analyze-website', protect, aiRateLimit, analyzeWebsite);
router.post('/inspect-website', protect, aiRateLimit, require('../controllers/aiController').inspectWebsite);
router.post('/extract-project', protect, aiRateLimit, require('../controllers/aiController').extractProject);

/**
 * @route   POST /ai/extract-theme-profile
 * @desc    Playwright-based visual theme extraction (colors, fonts, buttons,
 *          shape language) from a live URL — used to match a new project's
 *          landing page to the customer's existing website design.
 * @access  Private (JWT)
 */
router.post('/extract-theme-profile', protect, aiRateLimit, require('../controllers/aiController').extractThemeStyle);

/**
 * @route   POST /ai/structured-scrape
 * @desc    Scrape website and return structured data for landing page generation
 * @access  Private (JWT)
 */
router.post('/structured-scrape', protect, aiRateLimit, structuredScrape);

/**
 * @route   POST /ai/improve
 * @desc    Improve a specific section using AI
 * @access  Private (JWT)
 */
router.post('/improve', protect, aiRateLimit, require('../controllers/aiController').improveSection);
router.post('/generate-description', protect, aiRateLimit, require('../controllers/aiController').generateDescription);
router.post('/project-suggestions', protect, aiRateLimit, require('../controllers/aiController').getProjectSuggestions);
router.post('/pages/project-suggestions', protect, aiRateLimit, require('../controllers/aiController').getProjectSuggestions);
router.post('/optimize-page', protect, aiRateLimit, require('../controllers/aiController').optimizePage);
router.post('/strategic-plan', protect, aiRateLimit, require('../controllers/aiController').getStrategicPlan);
router.post('/editor-chat', protect, aiRateLimit, require('../controllers/aiController').editorChat);

/**
 * @route   GET /ai/proxy-image
 * @desc    Proxy external images to avoid CORS issues (public endpoint)
 * @query   url - The image URL to fetch
 * @access  Public (rate-limited)
 */
const imageRateLimit = rateLimiter({
  windowMs: 60_000,
  max: 30,
  message: 'Too many image requests. Please wait a moment before trying again.',
});
router.get('/proxy-image', imageRateLimit, require('../controllers/aiController').proxyImage);
router.get('/getimg-balance', protect, require('../controllers/aiController').getImgBalance);

module.exports = router;