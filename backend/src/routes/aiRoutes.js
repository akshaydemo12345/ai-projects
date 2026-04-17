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
router.post('/optimize-page', protect, aiRateLimit, require('../controllers/aiController').optimizePage);
router.post('/strategic-plan', protect, aiRateLimit, require('../controllers/aiController').getStrategicPlan);

module.exports = router;
