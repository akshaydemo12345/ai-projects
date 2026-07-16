'use strict';

const cheerio = require('cheerio');
const { fetchPageHtml } = require('./puppeteerFetch');

/**
 * verifyIntegration.js
 * --------------------
 * Live-checks whether a project's embed script/token is ACTUALLY present on
 * its website right now, by fetching the live page and scanning it.
 *
 * This is intentionally never cached and always hits the network. A project's
 * `isVerified` flag in the DB reflects the *last known* state, not the
 * current one — the site owner can remove the script, migrate hosts, or
 * deactivate a plugin at any time after the initial Verify click. Anything
 * that gates a real action (like publishing a page) on "is this integration
 * present" must call this fresh, not read the stored boolean.
 *
 * @param {{ websiteUrl?: string, url?: string, apiToken?: string }} project
 * @returns {Promise<{ verified: boolean, method: string|null, message: string }>}
 */
const verifyProjectIntegration = async (project) => {
  const url = project?.websiteUrl || project?.url;
  const token = project?.apiToken;

  if (!url || !token) {
    return {
      verified: false,
      method: null,
      message: 'Project is missing a website URL or API token, so integration cannot be verified.'
    };
  }

  let html;
  try {
    const result = await fetchPageHtml(url, { timeout: 15000 });
    html = result.html;
  } catch (fetchErr) {
    const status = fetchErr.response?.status;

    if (status === 403 || status === 401) {
      return {
        verified: false,
        method: null,
        message: 'The website blocked our verification request (403). It may have bot/firewall protection enabled.'
      };
    }
    if (status === 404) {
      return {
        verified: false,
        method: null,
        message: 'The website URL could not be found (404). Please check it is still correct.'
      };
    }
    return {
      verified: false,
      method: null,
      message: `Could not reach the website to verify the integration: ${fetchErr.message}`
    };
  }

  const $ = cheerio.load(html);
  let found = false;
  let foundIn = null;

  $('script').each((i, el) => {
    const src = $(el).attr('src') || '';
    const content = $(el).html() || '';
    const attrs = $(el).toString();

    if (src.includes(token) || content.includes(token) || attrs.includes(token)) {
      found = true;
      foundIn = 'script';
    }
  });

  if (!found) {
    $('meta').each((i, el) => {
      const content = $(el).attr('content') || '';
      if (content.includes(token)) {
        found = true;
        foundIn = 'meta';
      }
    });
  }

  if (!found && html.includes(token)) {
    found = true;
    foundIn = 'raw-html';
  }

  return {
    verified: found,
    method: foundIn,
    message: found
      ? `Integration script detected in ${foundIn} ✅`
      : 'Integration script was not found on the website. It may have been removed, deactivated, or the site may have changed.'
  };
};

module.exports = { verifyProjectIntegration };