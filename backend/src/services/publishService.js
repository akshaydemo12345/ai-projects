'use strict';

const logger = require('../utils/logger');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

/**
 * Background Service for Publishing Pages
 * Handles Nginx configuration and SSL certificate generation (Let's Encrypt).
 */

class PublishService {
  /**
   * Provisions a custom domain by creating an Nginx config and requesting SSL.
   * NOTE: For an actual production deployment, this requires sudo/root access
   * or a specialized worker service with permissions to reload Nginx and run Certbot.
   * 
   * @param {string} domain - The custom domain or subdomain
   * @param {string} slug - The page slug to route to
   */
  static async provisionDomain(domain, slug) {
    logger.info(`Starting provisioning job for domain: ${domain} (slug: ${slug})`);

    try {
      // 1. Generate Nginx Config
      const nginxConfig = `
server {
    listen 80;
    server_name ${domain};
    
    location / {
        proxy_pass http://127.0.0.1:${process.env.PORT || 5000}/p/domain/${domain};
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
      `.trim();

      // In a real environment, you'd write this to /etc/nginx/sites-available/
      logger.info(`[Job Simulation] Generated Nginx config for ${domain}`);
      logger.debug(nginxConfig);

      // 2. Validate Nginx and Reload
      // await exec('sudo nginx -t && sudo systemctl reload nginx');
      logger.info(`[Job Simulation] Nginx reloaded successfully`);

      // 3. Setup SSL with Certbot
      // await exec(`sudo certbot --nginx -d ${domain} --non-interactive --agree-tos -m admin@example.com`);
      logger.info(`[Job Simulation] SSL certificate generated for ${domain}`);

    } catch (err) {
      logger.error(`Domain provisioning failed for ${domain}`, { error: err.message });
      throw err;
    }
  }

  /**
   * Asynchronously handles domain publishing as a background job.
   */
  static triggerPublishJob(domain, slug) {
    // Fire and forget (in a real app, use BullMQ / Redis for reliable jobs)
    setImmediate(async () => {
      try {
        await this.provisionDomain(domain, slug);
      } catch (err) {
        logger.error(`Background job error for ${domain}`, { error: err.message });
      }
    });
  }
}

module.exports = PublishService;
