/**
 * Buildify AI — Script Integration embed loader.
 * ------------------------------------------------------------------------
 * Usage (must be the FIRST thing in <head>, not async/defer — see below):
 *
 *   <script src="https://YOUR_API_HOST/embed.js" data-token="PC-XXXX"></script>
 *
 * WHY THIS FILE WAS REWRITTEN
 * ------------------------------------------------------------------------
 * The previous version fetched the landing-page HTML asynchronously and
 * injected it into the DOM via `element.innerHTML = data.html`. Browsers
 * never execute <script> tags that are inserted via innerHTML (a standard
 * security restriction), which is why published pages served through the
 * Script integration were missing scripts and any styling that depended on
 * those scripts running — while the Preview URL (a real page load) and the
 * WordPress Plugin path (HTML rendered server-side by PHP, then served as a
 * real page load) both worked fine.
 *
 * FIX
 * ------------------------------------------------------------------------
 * This version makes a SYNCHRONOUS request (deliberately — this is why the
 * script must be un-deferred and placed first in <head>, so it can run and
 * finish before the browser starts parsing/painting the host page's own
 * "not found" content) and, if a matching landing page exists, replaces the
 * entire document with `document.write()`. Content written this way is fed
 * through the browser's normal HTML parser, so <script>, <style>, and
 * <link rel="stylesheet"> tags all execute/apply exactly as they would on a
 * real page load — no manual re-execution hacks required.
 *
 * If the script ever ends up loaded late (e.g. async/defer set by mistake,
 * or injected after the document has already finished loading), a
 * best-effort fallback path is used instead: fetch the HTML, inject it, and
 * manually re-create any <script> tags so they still execute. This is a
 * safety net only — correct placement (see above) is what avoids the
 * "flash of native 404 content" the integration instructions warn about.
 */
(function () {
  'use strict';

  var currentScript =
    document.currentScript ||
    (function () {
      var scripts = document.getElementsByTagName('script');
      return scripts[scripts.length - 1];
    })();

  if (!currentScript) return;

  var token = currentScript.getAttribute('data-token');
  var explicitPageId = currentScript.getAttribute('data-page-id');

  if (!token) {
    console.error('[Buildify AI] embed.js is missing the required data-token attribute.');
    return;
  }

  // Derive the API base from this script's own src, so the same file works
  // across environments (localhost, staging, production) without edits.
  var apiBase = currentScript.src.replace(/\/embed\.js(?:\?.*)?$/, '');

  var domain = window.location.hostname;
  var path = window.location.pathname;

  function buildApiUrl() {
    var params = [
      'domain=' + encodeURIComponent(domain),
      'path=' + encodeURIComponent(path),
      'apiKey=' + encodeURIComponent(token)
    ];
    if (explicitPageId) {
      params.push('pageId=' + encodeURIComponent(explicitPageId));
    }
    return apiBase + '/api/page?' + params.join('&');
  }

  function parseResponse(rawText) {
    try {
      var data = JSON.parse(rawText);
      if (data && data.status === 'success' && data.html) return data;
      return null;
    } catch (err) {
      console.error('[Buildify AI] Could not parse embed response:', err);
      return null;
    }
  }

  // ── Re-execute <script> tags inside a container that was populated via
  // innerHTML (browsers won't run them otherwise). Only used by the
  // late-load fallback path below — the primary path (document.write)
  // doesn't need this since the browser's parser handles it natively.
  function executeScripts(container) {
    if (!container) return;
    var scripts = container.querySelectorAll('script');
    window.__PC_SCRIPT_REGISTRY__ = window.__PC_SCRIPT_REGISTRY__ || {};
    var registry = window.__PC_SCRIPT_REGISTRY__;

    scripts.forEach(function (oldScript) {
      var src = oldScript.getAttribute('src');
      if (src) {
        if (registry[src]) {
          oldScript.remove();
          return;
        }
        registry[src] = true;
      }

      var newScript = document.createElement('script');
      Array.prototype.forEach.call(oldScript.attributes, function (attr) {
        newScript.setAttribute(attr.name, attr.value);
      });
      newScript.textContent = oldScript.textContent || '';

      if (oldScript.parentNode) {
        oldScript.parentNode.replaceChild(newScript, oldScript);
      }
    });
  }

  // ── PRIMARY PATH: synchronous request + full document.write() ──────────
  function loadSync() {
    var xhr = new XMLHttpRequest();
    try {
      xhr.open('GET', buildApiUrl(), false); // false => synchronous
      xhr.send(null);
    } catch (err) {
      console.error('[Buildify AI] embed.js request failed:', err);
      return;
    }

    if (xhr.status !== 200) {
      // No matching landing page for this URL — leave the host page alone
      // so its own content (or native 404) renders normally.
      return;
    }

    var data = parseResponse(xhr.responseText);
    if (!data) return;

    document.open();
    document.write(data.html);
    document.close();
  }

  // ── FALLBACK PATH: used only if this script somehow runs after the
  // document has already finished loading (wrong placement). document.write
  // is unsafe to call at that point (it would wipe the already-rendered
  // page unexpectedly in some browsers), so fetch + inject + re-execute
  // scripts manually instead.
  function loadAsyncFallback() {
    console.warn(
      '[Buildify AI] embed.js loaded after the page finished parsing. ' +
      'For best results, place this script — without async/defer — as the ' +
      'first item in <head>. Falling back to async injection.'
    );

    fetch(buildApiUrl())
      .then(function (res) {
        return res.status === 200 ? res.text() : null;
      })
      .then(function (rawText) {
        if (!rawText) return;
        var data = parseResponse(rawText);
        if (!data) return;

        var container = document.createElement('div');
        container.innerHTML = data.html;

        // Move any <style>/<link> tags from the fetched document's <head>
        // into the real document <head> so they take effect the same way
        // they would on a normal page load.
        var fetchedHead = container.querySelector('head');
        if (fetchedHead) {
          Array.prototype.slice.call(fetchedHead.children).forEach(function (node) {
            document.head.appendChild(node);
          });
        }

        var fetchedBody = container.querySelector('body') || container;
        document.body.innerHTML = '';
        Array.prototype.slice.call(fetchedBody.childNodes).forEach(function (node) {
          document.body.appendChild(node);
        });

        executeScripts(document.body);
        executeScripts(document.head);
      })
      .catch(function (err) {
        console.error('[Buildify AI] embed.js fallback request failed:', err);
      });
  }

  if (document.readyState === 'loading') {
    // Script is running early, as intended — safe to block and fully
    // replace the document.
    loadSync();
  } else {
    loadAsyncFallback();
  }
})();