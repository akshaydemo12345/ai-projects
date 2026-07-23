'use strict';

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getImageBrightness, imageProxy } = require('../controllers/utilController');

// GET /api/utils/image-brightness?url=<encoded-url>
// Authenticated — fetches external image server-side (bypasses browser CORS)
// and returns the computed average brightness (0–1) or null.
router.get('/image-brightness', protect, getImageBrightness);

// GET /api/utils/image-proxy?url=<encoded-url>
// Authenticated — proxies any external image (favicon, logo, etc.) through the
// server so the browser never makes a cross-origin request directly.
// Response is cached 24 h in the browser to avoid repeat fetches.
router.get('/image-proxy', protect, imageProxy);

module.exports = router;