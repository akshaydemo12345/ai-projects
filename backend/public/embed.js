/**
 * PageCraft AI - Smart Embed SDK
 * Usage: <script src=".../embed.js" data-token="TOKEN" data-page="SLUG" async></script>
 */
(function () {
  console.log('Running....');
  const currentScript = document.currentScript || (function () {
    const scripts = document.getElementsByTagName('script');
    return scripts[scripts.length - 1];
  })();

  const url = new URL(currentScript.src, window.location.origin);
  const token = currentScript.getAttribute('data-token') || url.searchParams.get('token');
  const searchParams = new URLSearchParams(window.location.search);
  const qPage = searchParams.get('pg') || searchParams.get('landing') || searchParams.get('page') || searchParams.get('p') || searchParams.get('slug') || searchParams.get('route');
  const attrPageId = currentScript.getAttribute('data-page-id');
  const attrPage = currentScript.getAttribute('data-page');
  const hashRaw = window.location.hash.replace(/^#+\/*/, ''); // Remove # and leading slashes
  // Support both #lp/test-script and #page=lp/test-script, while stripping query params
  const hashPage = (hashRaw.includes('page=') ? hashRaw.split('page=')[1] : hashRaw).split('?')[0].replace(/\/+$/, '');
  const pathParts = window.location.pathname.replace(/^\/+|\/+$/g, '').split('/');
  const rawPathPage = pathParts.length > 0 && pathParts[0] !== '' ? pathParts.join('/') : null;
  // Strip trailing /thank-you so slug resolves correctly on direct access to the thank-you URL
  const pathPage = rawPathPage ? rawPathPage.replace(/\/thank-you\/?$/, '') : null;

  // PRIORITY: URL (Query > Hash) > Script Attributes > URL Path
  // This enables dynamic routing via URL even if a data-page is set on the script tag.
  const page = qPage || hashPage || attrPageId || attrPage || pathPage;

  console.log('💎 [SDK] Resolved Slug:', page);

  // Re-initialize on hash change to support SPA-like navigation
  window.addEventListener('hashchange', () => {
    console.log('🔄 [SDK] Hash changed, reloading for routing...');
    window.location.reload();
  });

  const apiBase = url.origin;

  function buildLandingUrl() {
    const origin = window.location.origin;
    const path = window.location.pathname.replace(/\/+$|^\/+$/g, '');
    const search = window.location.search;
    const currentFullUrl = window.location.href;

    // If the browser URL already contains a path, preserve it exactly.
    if (path && path !== '') {
      return currentFullUrl;
    }

    // If no path is present, but we know the page slug, reconstruct the intended URL.
    if (page) {
      const pagePath = page.startsWith('/') ? page : `/${page}`;
      const params = new URLSearchParams(search);
      ['pg', 'landing', 'page', 'p'].forEach(key => params.delete(key));
      const queryString = params.toString();
      return `${origin}${pagePath}${queryString ? `?${queryString}` : ''}`;
    }

    return currentFullUrl;
  }

  const landingUrl = buildLandingUrl();
  const previousReferrer = document.referrer;
  console.log('🌐 [SDK] Landing URL for tracking:', previousReferrer);

  /**
   * Captures UTM parameters strictly from the current browser URL.
   * If a parameter is absent from the URL, its value resolves to null.
   * SessionStorage and LocalStorage are avoided to satisfy no-caching constraints.
   */
  function getUTMParameters() {
    const utms = {};
    try {
      const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid', 'msclkid'];
      
      // Parse main URL search params
      let params = new URLSearchParams(window.location.search);
      
      // Fallback/Merge with hash-based query parameters (useful in SPAs)
      if (window.location.hash && window.location.hash.includes('?')) {
        const hashQuery = window.location.hash.split('?')[1];
        const hashParams = new URLSearchParams(hashQuery);
        hashParams.forEach((v, k) => {
          if (!params.has(k)) {
            params.append(k, v);
          }
        });
      }
      
      let hasUtm = false;
      for (let i = 0; i < utmKeys.length; i++) {
        if (params.get(utmKeys[i])) { hasUtm = true; break; }
      }

      utmKeys.forEach(key => {
        let val = params.get(key);
        if (hasUtm) {
          if (val) {
            try { sessionStorage.setItem('dm_' + key, val); localStorage.setItem('dm_' + key, val); } catch(e){}
          } else {
            try { sessionStorage.removeItem('dm_' + key); localStorage.removeItem('dm_' + key); } catch(e){}
          }
        } else {
          try { sessionStorage.removeItem('dm_' + key); localStorage.removeItem('dm_' + key); } catch(e){}
        }

        // Read from storage if we didn't just clear it and URL lacked it
        if (!val) {
          try { val = sessionStorage.getItem('dm_' + key) || localStorage.getItem('dm_' + key); } catch(e){}
        }

        utms[key.toLowerCase()] = val || null;
      });
    } catch (e) {
      const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid', 'msclkid'];
      utmKeys.forEach(key => {
        utms[key.toLowerCase()] = null;
      });
    }
    return utms;
  }

  console.log('🚀 PageCraft AI: Initializing...', {
    detectedPage: page,
    source: qPage ? 'URL Query' : attrPage ? 'Data Attribute' : hashPage ? 'Hash' : pathPage ? 'URL Path' : 'None',
    token: token ? 'Provided' : 'Missing',
    href: window.location.href
  });

  if (!token) {
    console.error('PageCraft AI: Missing data-token in embed script');
    return;
  }

  if (!page || page === '') {
    console.error('PageCraft AI: Could not determine page slug from data-page or URL path');
    return;
  }

  async function loadPage() {
    try {
      console.log('PageCraft AI: Loading page...', page);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      // We use the public endpoint that returns the rendered HTML or at least the raw data
      const endpoint = /^[0-9a-fA-F]{24}$/.test(String(page || ''))
        ? `${apiBase}/api/public/page?page=${encodeURIComponent(page)}`
        : `${apiBase}/api/public/page/${encodeURIComponent(page)}`;
      const response = await fetch(endpoint, {
        headers: {
          'bypass-tunnel-reminder': 'true'
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Failed to load page: ${response.status}`);
      }

      const result = await response.json();

      if (result.status !== 'success' && !result.data) {
        throw new Error(result.message || 'Unknown error from API');
      }

      const target = `${apiBase}/${encodeURIComponent(page)}`;
      window.location.replace(target);

    } catch (err) {
      console.error('PageCraft AI Error:', err);
    }
  }

  // Support for browsers that might have already finished loading
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadPage);
  } else {
    loadPage();
  }
})();