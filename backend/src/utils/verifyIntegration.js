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
      // Nothing was actually fetched/scanned, so callers must not treat this
      // as proof the integration is gone — it's an inconclusive result.
      reachable: false,
      message: 'Project is missing a website URL or API token, so integration cannot be verified.'
    };
  }

  let html;
  try {
    // We only need the raw HTML to scan for the embed script/token — waiting
    // for full network-idle (default) makes this fail on real sites that keep
    // background connections alive (analytics, chat widgets, etc.). Stop as
    // soon as the initial document is parsed, and give it a more realistic
    // timeout so this publish-time gate doesn't false-fail on normal sites.
    const result = await fetchPageHtml(url, { timeout: 30000, waitUntil: 'domcontentloaded' });
    html = result.html;
  } catch (fetchErr) {
    const status = fetchErr.response?.status;

    // reachable: false on every branch below — the page could not be
    // fetched at all, so a "not verified" result here says nothing about
    // whether the integration is actually present. Callers should treat
    // this as inconclusive (keep last-known status) rather than as a real
    // "integration removed" signal.
    if (status === 403 || status === 401) {
      return {
        verified: false,
        method: null,
        reachable: false,
        message: 'The website blocked our verification request (403). It may have bot/firewall protection enabled.'
      };
    }
    if (status === 404) {
      return {
        verified: false,
        method: null,
        reachable: false,
        message: 'The website URL could not be found (404). Please check it is still correct.'
      };
    }
    return {
      verified: false,
      method: null,
      reachable: false,
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

  // Fallback: If HTML scan did not detect token, attempt a REST API ping to the WordPress plugin
  if (!found && url && token) {
    try {
      const restEndpoint = `${url.replace(/\/$/, '')}/wp-json/domain-mapper/v1/flush?api_key=${encodeURIComponent(token)}`;
      const response = await fetch(restEndpoint, {
        method: 'POST',
        headers: {
          'X-DM-API-Key': token,
          'User-Agent': 'Buildify-Verifier/1.0'
        },
        signal: AbortSignal.timeout(5000)
      });

      if (response.ok) {
        found = true;
        foundIn = 'meta'; // Classify as plugin integration
      }
    } catch (restErr) {
      // REST ping attempt failed — plugin is likely deactivated or not installed
    }
  }

  return {
    verified: found,
    method: foundIn,
    // The page WAS successfully fetched and scanned, so this result — found
    // or not — reflects the site's actual current state. If `found` is
    // false here, that's a real "integration is not present right now"
    // signal (script removed, plugin deactivated, etc.), not a fluke of
    // network access, and callers should act on it.
    reachable: true,
    message: found
      ? `Integration script/plugin detected in ${foundIn} ✅`
      : 'Integration script/plugin was not found on the website. It may have been removed, deactivated, or the site may have changed.'
  };
};

module.exports = { verifyProjectIntegration };