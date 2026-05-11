'use strict';

const express = require('express');
const router = express.Router();

const proxyController = require('../controllers/proxyController');
const { proxyAuth } = require('../middleware/proxyAuth');

/**
 * Dynamic Proxy Route
 */
router.get(/^\/proxy\/(.+)/, proxyAuth, (req, res) => {
  proxyController.handleProxy(req, res);
});

/**
 * Form Proxy
 */
router.post('/proxy-form', proxyAuth, (req, res) => {
  proxyController.handleProxyForm(req, res);
});

/**
 * Health Check
 */
router.get('/proxy-status', (req, res) => {
  res.json({
    status: 'active',
    engine: 'Cheerio/Axios'
  });
});

module.exports = router;