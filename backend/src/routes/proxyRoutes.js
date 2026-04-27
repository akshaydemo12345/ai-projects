'use strict';

const express = require('express');
const router = express.Router();
const proxyController = require('../controllers/proxyController');
const { proxyAuth } = require('../middleware/proxyAuth');

/**
 * Proxy Routes
 */

// GET /proxy?target=...&path=...&slug=...
router.get('/proxy', proxyAuth, (req, res) => proxyController.handleProxy(req, res));

// POST /proxy-form
router.post('/proxy-form', proxyAuth, (req, res) => proxyController.handleProxyForm(req, res));

// Optional: Health check or info (unprotected)
router.get('/proxy-status', (req, res) => {
  res.json({ status: 'active', engine: 'Cheerio/Axios' });
});

module.exports = router;
