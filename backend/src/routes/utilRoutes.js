'use strict';

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getImageBrightness } = require('../controllers/utilController');

// GET /api/utils/image-brightness?url=<encoded-url>
// Authenticated — fetches external image server-side (bypasses browser CORS)
// and returns the computed average brightness (0–1) or null.
router.get('/image-brightness', protect, getImageBrightness);

module.exports = router;