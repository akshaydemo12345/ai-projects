'use strict';

const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { rateLimiter } = require('../middleware/rateLimiter');
const { generateContent, analyzeWebsite } = require('../controllers/aiController');

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

/**
 * @route   POST /ai/improve
 * @desc    Improve a specific section using AI
 * @access  Private (JWT)
 */
router.post('/improve', protect, aiRateLimit, require('../controllers/aiController').improveSection);

module.exports = router;
