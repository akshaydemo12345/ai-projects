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
      const searchParams = new URLSearchParams(window.location.search);
      const hashRaw = window.location.hash.replace(/^#+\/*/, '');
      const isThankYou = searchParams.get('status') === 'thank-you' ||
        hashRaw.includes('status=thank-you') ||
        window.location.pathname.replace(/\/+$/, '').endsWith('/thank-you');

      // We use the public endpoint that returns the rendered HTML or at least the raw data
      const endpoint = /^[0-9a-fA-F]{24}$/.test(String(page || ''))
        ? `${apiBase}/api/public/page?page=${encodeURIComponent(page)}`
        : `${apiBase}/api/public/page/${encodeURIComponent(page)}`;
      const response = await fetch(endpoint, {
        headers: {
          'bypass-tunnel-reminder': 'true'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to load page: ${response.status}`);
      }

      const result = await response.json();

      if (result.status !== 'success') {
        throw new Error(result.message || 'Unknown error from API');
      }

      let content = result.data;
      let css = (typeof content === 'object' && content?.fullCss) ? content.fullCss : (result.styles || result.landingPageStyles || '');
      let js = typeof content === 'object' ? (content?.fullJs || '') : '';
      let title = result.meta?.title || 'Landing Page';

      const pageId = result.pageId || (result.meta && result.meta._id);
      const projectId = result.projectId || (result.meta && result.meta.projectId);

      if (isThankYou) {
        if (result.thankYouPageContent) {
          content = result.thankYouPageContent;
          css = result.thankYouPageStyles || css;
          title = title + ' - Thank You';
        } else {
          // Default thank you message if no custom page is built
          content = `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 80vh; text-align: center; font-family: sans-serif; padding: 20px;">
                <div style="font-size: 64px; margin-bottom: 24px;">✅</div>
                <h1 style="font-size: 32px; color: #111827; margin-bottom: 16px;">Thank You for your submission!</h1>
                <p style="font-size: 18px; color: #4b5563; max-width: 500px; line-height: 1.6;">We have received your details and our team will get back to you shortly.</p>
                <a href="${window.location.pathname.replace(/\/thank-you\/?$/, '')}${window.location.search}" style="margin-top: 32px; background: ${result.primaryColor || '#7c3aed'}; color: white; padding: 12px 32px; border-radius: 50px; text-decoration: none; font-weight: bold; transition: opacity 0.2s;">Return to Home</a>
            </div>
           `;
        }
      }

      const html = typeof content === 'string' ? content : (content?.fullHtml || '');

      // ─── RESOLVE THANK YOU URL ────────────────────────────────────────
      // Priority: page.thankYouUrl (custom URL set in page settings) > default embed thank-you
      const customThankYouUrl = result.thankYouUrl || (result.meta && result.meta.thankYouUrl) || '';

      // Branding fallback
      const pColor = result.primaryColor || '#7c3aed';
      const sColor = result.secondaryColor || '#6366f1';
      const detectDark = (css.includes('#0f172a') || html.includes('bg-slate-950') || html.includes('bg-[#0f172a]'));
      const finalLogo = result.logoUrl || '';

      let processedHtml = html;
      if (finalLogo) {
        processedHtml = processedHtml.replace(/https:\/\/via\.placeholder\.com\/[^\s"'>]+/g, finalLogo);
        processedHtml = processedHtml.replace(/https:\/\/i\.ibb\.co\/vzB7pLq\/Logo\.png/g, finalLogo);
        processedHtml = processedHtml.replace(/\{\{LOGO_URL\}\}/gi, finalLogo);
        processedHtml = processedHtml.replace(/\{\{logoUrl\}\}/gi, finalLogo);
      }

      // Clean the entire document for a pure landing page experience
      document.open();
      document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <base href="${apiBase}/">
          <title>${title}</title>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
          <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Sharp:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
          <script src="https://unpkg.com/lucide@latest"><\/script>
          <style>
            :root {
              --primary: ${pColor};
              --secondary: ${sColor};
              --accent: ${sColor};
              --button-gradient: linear-gradient(135deg, ${pColor}, ${sColor});
            }
            body { 
              background-color: ${detectDark ? '#0f172a' : '#ffffff'}; 
              color: ${detectDark ? '#f8fafc' : '#0f172a'}; 
              margin: 0; 
              overflow-x: hidden;
            }
            /* Guarantee form input visibility overrides */
            input, textarea, select {
              color: #0f172a !important;
              background-color: #f8fafc !important;
              border: 1px solid #cbd5e1 !important;
            }
            input::placeholder, textarea::placeholder {
              color: #94a3b8 !important;
            }
            .material-symbols-outlined, .material-symbols-rounded, .material-symbols-sharp {
              font-family: 'Material Symbols Outlined', 'Material Symbols Rounded', 'Material Symbols Sharp', sans-serif;
              font-weight: normal;
              font-style: normal;
              font-size: 24px;
              line-height: 1;
              letter-spacing: normal;
              text-transform: none;
              display: inline-block;
              white-space: nowrap;
              word-wrap: normal;
              direction: ltr;
              -webkit-font-smoothing: antialiased;
              text-rendering: optimizeLegibility;
              -moz-osx-font-smoothing: grayscale;
              font-feature-settings: 'liga';
            }
            ${css}
          </style>
          ${!isThankYou ? '<script src="https://cdn.tailwindcss.com"><\/script>' : ''}
          ${!isThankYou ? `<meta name="dm-page-id" content="${pageId}">` : ''}
          ${!isThankYou ? `<meta name="dm-project-id" content="${projectId}">` : ''}
          <script>
            // Persist SDK Routing: Listen for hash changes even after document replacement
            window.addEventListener('hashchange', function() {
               console.log('SDK: Hash changed, reloading for routing...');
               window.location.reload();
            });
            window.addEventListener('DOMContentLoaded', function() {
               if (window.lucide) window.lucide.createIcons();
            });
          </script>
        </head>
        <body>
          ${processedHtml}
          ${js ? `<script>${js}<\/script>` : ''}
        </body>
        </html>
      `);
      document.close();

      console.log('PageCraft AI: Embedded page loaded successfully');

      // Initialize Lead Capture if not already in thank you state
      if (!isThankYou) {
        initLeadCapture(apiBase, page, customThankYouUrl, pageId, projectId);
      }

    } catch (err) {
      console.error('PageCraft AI Error:', err);
    }
  }

  /**
   * ─── LEAD CAPTURE & THANK YOU REDIRECT ENGINE ─────────────────────────────
   * Handles form submission on embedded pages.
   */
  function initLeadCapture(apiBase, slug, customThankYouUrl, pageId, projectId) {
    document.addEventListener('submit', async function (e) {
      const form = e.target;
      if (form.tagName !== 'FORM') return;

      // Prevent double submission
      if (form.getAttribute('data-submitting') === 'true') {
        e.preventDefault();
        return;
      }

      e.preventDefault();
      console.log('PageCraft AI: Submitting lead for page:', slug);

      form.setAttribute('data-submitting', 'true');
      const submitBtn = form.querySelector('button[type="submit"]') || form.querySelector('button');
      const originalBtnText = submitBtn ? submitBtn.textContent : 'Submit';

      // Show Global Loader
      showGlobalLoader();

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
      }

      const formData = new FormData(form);
      const data = {};
      const capturedFormFields = [];

      formData.forEach((value, key) => {
        data[key] = value;
      });

      Array.from(form.elements).forEach((el, index) => {
        if (!(el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || el instanceof HTMLSelectElement)) return;
        let name = el.name || el.id || el.getAttribute('data-name');
        let label = el.getAttribute('data-label') || el.getAttribute('aria-label') || el.getAttribute('placeholder') || '';

        if (!name) {
          const labelEl = document.querySelector(`label[for="${el.id}"]`) || el.closest('label');
          const source = (labelEl ? labelEl.innerText : '') || label || '';
          if (source) {
            name = source.toLowerCase().trim()
              .replace(/[^a-z0-9]/g, '_')
              .replace(/_+/g, '_')
              .replace(/^_|_$/g, '');
            label = source.trim();
          }
        }

        if (!name) {
          name = `field_${index}`;
        }
        if (!label) {
          label = name;
        }

        let value = '';
        if (el.type === 'checkbox') {
          value = el.checked ? (el.value || 'Yes') : '';
        } else if (el.type === 'radio') {
          if (!el.checked) return;
          value = el.value;
        } else {
          value = el.value;
        }

        capturedFormFields.push({
          name,
          label,
          value,
          type: el.type || el.tagName.toLowerCase()
        });
      });

      // --- Robust Lead Data Extraction ---

      // 1. Detect Email (Mandatory for Backend)
      if (!data.email) {
        data.email = data.Email || data.EMAIL || data.email_address || data.mail || data['entry.123456789'] || // Common hidden fields
          (form.querySelector('input[type="email"]') ? form.querySelector('input[type="email"]').value : "") ||
          (form.querySelector('input[name*="email" i]') ? form.querySelector('input[name*="email" i]').value : "");
      }

      // 2. Detect Name
      if (!data.name) {
        data.name = data.Name || data.NAME || data.first_name || data.fullname || data.fname || data.user_name ||
          (form.querySelector('input[name*="name" i]') ? form.querySelector('input[name*="name" i]').value : "") ||
          (form.querySelector('input[placeholder*="Name" i]') ? form.querySelector('input[placeholder*="Name" i]').value : "");
      }

      // 3. Detect Phone (extra context)
      if (!data.phone) {
        data.phone = data.Phone || data.PHONE || data.tel || data.telephone || data.mobile || data.contact ||
          (form.querySelector('input[type="tel"]') ? form.querySelector('input[type="tel"]').value : "") ||
          (form.querySelector('input[name*="phone" i]') ? form.querySelector('input[name*="phone" i]').value : "");
      }

      // 4. Detect Message (extra context)
      if (!data.message) {
        data.message = data.Message || data.MESSAGE || data.comments || data.inquiry || data.notes ||
          (form.querySelector('textarea') ? form.querySelector('textarea').value : "") ||
          (form.querySelector('input[name*="message" i]') ? form.querySelector('input[name*="message" i]').value : "");
      }

      // Add metadata
      const referralSource = document.referrer ? new URL(document.referrer).hostname : 'Direct';
      const referralUrl = window.location.href;

      data.domain = window.location.hostname;
      data.url = referralUrl;
      data.path = window.location.pathname;
      data.pageSlug = slug;
      data.pageId = pageId;
      data.projectId = projectId;
      data.trackingDetails = {
        referral_url: referralUrl,
        referral_source: referralSource
      };
      data.referer = previousReferrer || '';
      Object.assign(data, getUTMParameters());
      data.formData = capturedFormFields;

      try {
        const response = await fetch(`${apiBase}/api/leads`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'bypass-tunnel-reminder': 'true'
          },
          body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok && (result.success || result.status === 'success')) {
          console.log('PageCraft AI: Lead captured successfully');

          // Dispatch event for external trackers
          document.dispatchEvent(new CustomEvent('pagecraft_lead_success', { detail: result.data }));

          // ─── SMART THANK YOU REDIRECT ──────────────────────────────────
          // Priority 1: Custom external thank you URL from page settings
          if (customThankYouUrl && customThankYouUrl.trim() !== '') {
            const trimmedUrl = customThankYouUrl.trim();
            if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')) {
              window.location.href = trimmedUrl;
              return;
            }
            window.location.href = apiBase + trimmedUrl;
            return;
          }

          // Priority 2: Path-based thank-you redirect — no query string, no flash
          const currentUrl = new URL(window.location.href);
          const thankYouPath = currentUrl.pathname.replace(/\/+$/, '') + '/thank-you';
          // Silently update the browser URL without triggering a page reload
          history.pushState({}, '', currentUrl.origin + thankYouPath + currentUrl.search);
          // Re-render page content in place — loader stays visible, no visible flash
          loadPage();
          return;

        } else {
          console.error('PageCraft AI: Server returned error', result);
          hideGlobalLoader();
          alert('Error: ' + (result.message || 'Submission failed'));
        }
      } catch (err) {
        console.error('Lead submission error:', err);
        const currentUrl = new URL(window.location.href);
        const thankYouPath = currentUrl.pathname.replace(/\/+$/, '') + '/thank-you';
        history.pushState({}, '', currentUrl.origin + thankYouPath + currentUrl.search);
        loadPage();
      } finally {
        form.removeAttribute('data-submitting');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalBtnText;
        }
      }
    });
  }

  function showGlobalLoader() {
    let loader = document.getElementById('pagecraft-loader');
    if (!loader) {
      loader = document.createElement('div');
      loader.id = 'pagecraft-loader';
      loader.innerHTML = `
        <div class="pc-loader-backdrop"></div>
        <div class="pc-loader-content">
          <div class="pc-loader-visual">
            <div class="pc-loader-ring"></div>
            <div class="pc-loader-ring"></div>
            <div class="pc-loader-ring"></div>
            <div class="pc-loader-check">✓</div>
          </div>
          <div class="pc-loader-text-group">
            <div class="pc-loader-title">Sending Data</div>
            <div class="pc-loader-status">Finalizing your request...</div>
          </div>
          <div class="pc-loader-progress">
             <div class="pc-loader-bar"></div>
          </div>
        </div>
      `;
      document.body.appendChild(loader);

      const style = document.createElement('style');
      style.innerHTML = `
        #pagecraft-loader {
          position: fixed;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2147483647;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          opacity: 0;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          pointer-events: none;
        }
        #pagecraft-loader.active {
          opacity: 1;
          pointer-events: auto;
        }
        .pc-loader-backdrop {
          position: absolute;
          inset: 0;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(15px) saturate(180%);
          -webkit-backdrop-filter: blur(15px) saturate(180%);
        }
        .pc-loader-content {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 90%;
          max-width: 400px;
          padding: 40px;
          border-radius: 32px;
          background: #ffffff;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(0,0,0,0.05);
          text-align: center;
          transform: translateY(20px) scale(0.95);
          transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        #pagecraft-loader.active .pc-loader-content {
          transform: translateY(0) scale(1);
        }
        .pc-loader-visual {
          position: relative;
          width: 80px;
          height: 80px;
          margin-bottom: 24px;
        }
        .pc-loader-ring {
          position: absolute;
          inset: 0;
          border: 3px solid transparent;
          border-top-color: var(--primary, #7c3aed);
          border-radius: 50%;
          animation: pc-spin 1.5s cubic-bezier(0.5, 0, 0.5, 1) infinite;
        }
        .pc-loader-ring:nth-child(2) {
          inset: 8px;
          border-top-color: var(--secondary, #6366f1);
          animation-direction: reverse;
          animation-duration: 1s;
        }
        .pc-loader-ring:nth-child(3) {
          inset: 16px;
          border-top-color: var(--accent, #9333ea);
          animation-duration: 2s;
        }
        .pc-loader-check {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          color: var(--primary, #7c3aed);
          opacity: 0;
          transform: scale(0.5);
          transition: all 0.3s ease;
        }
        .pc-loader-text-group {
          margin-bottom: 24px;
        }
        .pc-loader-title {
          font-size: 24px;
          font-weight: 800;
          color: #111827;
          letter-spacing: -0.5px;
          margin-bottom: 8px;
        }
        .pc-loader-status {
          font-size: 15px;
          color: #6b7280;
          font-weight: 500;
        }
        .pc-loader-progress {
          width: 100%;
          height: 6px;
          background: #f3f4f6;
          border-radius: 10px;
          overflow: hidden;
        }
        .pc-loader-bar {
          width: 30%;
          height: 100%;
          background: linear-gradient(90deg, var(--primary, #7c3aed), var(--secondary, #6366f1));
          border-radius: 10px;
          animation: pc-progress 2s infinite ease-in-out;
        }
        
        @keyframes pc-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pc-progress {
          0% { transform: translateX(-100%); width: 30%; }
          50% { width: 60%; }
          100% { transform: translateX(200%); width: 30%; }
        }

        @media (max-width: 480px) {
          .pc-loader-content {
            padding: 30px 20px;
            width: 85%;
          }
          .pc-loader-title { font-size: 20px; }
          .pc-loader-visual { width: 60px; height: 60px; }
        }
      `;
      document.head.appendChild(style);
    }

    // Show with delay to ensure browser paints
    setTimeout(() => {
      loader.classList.add('active');
    }, 10);
  }

  function hideGlobalLoader() {
    const loader = document.getElementById('pagecraft-loader');
    if (loader) {
      loader.classList.remove('active');
    }
  }

  // Support for browsers that might have already finished loading
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadPage);
  } else {
    loadPage();
  }
})();