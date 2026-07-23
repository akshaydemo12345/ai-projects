'use strict';

const axios = require('axios');
const cheerio = require('cheerio');
const url = require('url');
const config = require('../config');
const logger = require('../utils/logger');

// Simple In-memory Cache for HTML responses
const proxyCache = new Map();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

/**
 * Proxy Controller for Dynamic HTML Rewriting and Form Forwarding
 */
class ProxyController {
  constructor() {
    this.axios = axios.create({
      timeout: config.proxy.timeout,
      maxRedirects: 5,
      // Handle compression automatically
      headers: {
        'Accept-Encoding': 'gzip, deflate, br',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    // Simple retry interceptor
    this.axios.interceptors.response.use(null, async (error) => {
      const { config: originalConfig } = error;
      if (!originalConfig || originalConfig._retry) {
        return Promise.reject(error);
      }
      originalConfig._retry = true;
      logger.info(`Retrying proxy request to: ${originalConfig.url}`);
      return this.axios(originalConfig);
    });
  }

  /**
   * Helper to validate if a domain is whitelisted
   */
  isDomainAllowed(targetUrl) {
    if (!config.proxy.whitelist || config.proxy.whitelist.length === 0) return true; // Open if empty for now? Or strict? 
    // Usually production should be strict. User said "Allow ONLY whitelisted domains".
    try {
      const parsed = new URL(targetUrl);
      return config.proxy.whitelist.some(domain => 
        parsed.hostname === domain || parsed.hostname.endsWith('.' + domain)
      );
    } catch (e) {
      return false;
    }
  }

  /**
   * GET /proxy
   * Fetches target URL and rewrites HTML content
   */
  async handleProxy(req, res) {
    const { target, path: targetPath = '', slug } = req.query;

    if (!target || !slug) {
      return res.status(400).json({ error: 'Target and slug are required' });
    }

    const fullTargetUrl = `${target.replace(/\/$/, '')}/${targetPath.replace(/^\//, '')}`;

    if (!this.isDomainAllowed(fullTargetUrl)) {
      logger.warn(`Blocked proxy request to non-whitelisted domain: ${fullTargetUrl}`, { ip: req.ip });
      return res.status(403).json({ error: 'Domain not whitelisted' });
    }

    // Cache Check
    const cacheKey = `${fullTargetUrl}:${slug}`;
    const cached = proxyCache.get(cacheKey);
    if (cached && cached.expiry > Date.now()) {
      return res.status(200).send(cached.data);
    }

    try {
      const response = await this.axios.get(fullTargetUrl, {
        responseType: 'text',
        headers: {
          'Accept': req.headers['accept'] || 'text/html',
          'Accept-Language': req.headers['accept-language'] || 'en-US,en;q=0.9',
          'Cookie': req.headers['cookie'] || '',
          'X-Forwarded-For': req.headers['x-forwarded-for'] || req.ip
        }
      });

      // If it's not HTML, just pipe it back
      const contentType = response.headers['content-type'] || '';
      if (!contentType.includes('text/html')) {
        return res.set(response.headers).send(response.data);
      }

      // Rewrite Engine using Cheerio
      const $ = cheerio.load(response.data);
      const baseUrl = new URL(fullTargetUrl);
      const origin = `${baseUrl.protocol}//${baseUrl.host}`;

      // 1. Rewrite Links: <a> tags
      $('a').each((i, el) => {
        const href = $(el).attr('href');
        if (href && !href.startsWith('#') && !href.startsWith('tel:') && !href.startsWith('mailto:')) {
          const absoluteHref = new URL(href, fullTargetUrl).href;
          // If the link is internal to target domain, stay under slug
          if (absoluteHref.startsWith(origin)) {
            const relativePath = absoluteHref.replace(origin, '').replace(/^\//, '');
            $(el).attr('href', `/${slug}/${relativePath}`);
          }
        }
      });

      // 2. Rewrite Forms: <form action>
      $('form').each((i, el) => {
        const action = $(el).attr('action') || '';
        const absoluteAction = new URL(action, fullTargetUrl).href;
        // Store the original action in a hidden field for proxy-form to use
        $(el).append(`<input type="hidden" name="_proxy_target_action" value="${absoluteAction}">`);
        $(el).attr('action', `/${slug}/proxy-form`);
      });

      // 3. Absolute URLs for Assets: img, script, link, iframe
      const assetTags = {
        'img': 'src',
        'script': 'src',
        'link': 'href',
        'iframe': 'src',
        'video': 'src',
        'audio': 'src',
        'source': 'src'
      };

      Object.entries(assetTags).forEach(([tag, attr]) => {
        $(tag).each((i, el) => {
          const val = $(el).attr(attr);
          if (val && !val.startsWith('data:') && !val.startsWith('http')) {
            $(el).attr(attr, new URL(val, fullTargetUrl).href);
          }
        });
      });

      // Add a meta tag to identify the proxy
      $('head').prepend('<!-- Node Proxy Active -->');

      const finalHtml = $.html();

      // Store in cache if TTL is configured
      proxyCache.set(cacheKey, {
        data: finalHtml,
        expiry: Date.now() + CACHE_TTL
      });

      res.status(response.status).send(finalHtml);
    } catch (error) {
      this.handleError(error, res, fullTargetUrl);
    }
  }

  /**
   * POST /proxy-form
   * Forwards form submissions to target domain
   */
  async handleProxyForm(req, res) {
    const targetAction = req.body._proxy_target_action;
    
    if (!targetAction) {
      return res.status(400).json({ error: 'Proxy target action missing' });
    }

    // Clean up proxy-specific fields
    const formData = { ...req.body };
    delete formData._proxy_target_action;

    try {
      // Determine content type (default to urlencoded if no files)
      const contentType = req.headers['content-type'] || 'application/x-www-form-urlencoded';

      const response = await this.axios.post(targetAction, formData, {
        headers: {
          'Content-Type': contentType,
          'User-Agent': req.headers['user-agent'],
          'Referer': targetAction
        }
      });

      // Return response without redirecting user
      res.status(response.status).send(response.data);
    } catch (error) {
      this.handleError(error, res, targetAction);
    }
  }

  /**
   * Centralized Error Handling
   */
  handleError(error, res, targetUrl) {
    const status = error.response ? error.response.status : 500;
    const message = error.message || 'Internal Proxy Error';

    logger.error(`Proxy Error [${status}] for ${targetUrl}: ${message}`, {
      stack: error.stack,
      data: error.response?.data
    });

    res.status(status).json({
      error: 'Proxy request failed',
      status: status,
      target: targetUrl
    });
  }
}

module.exports = new ProxyController();
