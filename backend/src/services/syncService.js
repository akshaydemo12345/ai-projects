'use strict';

const http = require('http');
const https = require('https');
const logger = require('../utils/logger');

/**
 * Service to synchronize with remote WordPress sites using the Domain Mapper plugin.
 */
class SyncService {
  /**
   * Triggers a remote cache flush on the WordPress site using native Node.js modules.
   * 
   * @param {string} domain The WordPress domain (e.g. my-wordpress-site.test)
   * @param {string} apiToken The API key configured in the WordPress plugin
   */
  static async flushWordPressCache(domain, apiToken) {
    if (!domain || !apiToken) return;

    return new Promise((resolve) => {
      try {
        const isLocal = domain.endsWith('.test') || domain.endsWith('.local') || domain === '127.0.0.1' || domain.includes(':');
        const lib = isLocal ? http : https;
        const port = domain.includes(':') ? domain.split(':')[1] : (isLocal ? 80 : 443);
        const host = domain.includes(':') ? domain.split(':')[0] : domain;
        
        const options = {
          hostname: host,
          port: port,
          path: '/wp-json/domain-mapper/v1/flush',
          method: 'POST',
          headers: {
            'X-DM-API-Key': apiToken,
            'Content-Type': 'application/json',
            'Content-Length': 0
          },
          timeout: 5000
        };

        logger.info(`🔄 Triggering remote flush for ${domain}...`);

        const req = lib.request(options, (res) => {
          let data = '';
          res.on('data', (chunk) => { data += chunk; });
          res.on('end', () => {
            if (res.statusCode === 200) {
              logger.info(`✅ Successfully flushed cache on ${domain}`);
            } else {
              logger.warn(`⚠️ Flush failed with status ${res.statusCode} for ${domain}`);
            }
            resolve(true);
          });
        });

        req.on('error', (err) => {
          logger.error(`❌ Failed to flush cache on ${domain}: ${err.message}`);
          resolve(false);
        });

        req.on('timeout', () => {
          req.destroy();
          logger.warn(`⏱️ Flush timeout on ${domain}`);
          resolve(false);
        });

        req.end();
      } catch (err) {
        logger.error(`❌ Sync error for ${domain}: ${err.message}`);
        resolve(false);
      }
    });
  }
}

module.exports = SyncService;
