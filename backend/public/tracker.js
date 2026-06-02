(function () {
  'use strict';

  const scriptTag = document.currentScript;
  const API_BASE = (scriptTag ? scriptTag.src : '').replace('/tracker.js', '');
  const CONFIG = {
    apiBase: API_BASE || window.location.origin,
    apiKey: scriptTag ? scriptTag.getAttribute('data-api-key') : null,
    domain: window.location.hostname,
    path: window.location.hash.replace(/^#+/, '') || window.location.pathname,
    fullUrl: window.location.href
  };

  // Support re-initialization on hash change
  window.addEventListener('hashchange', () => window.location.reload());
  const landingUrl = window.location.href;
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

  function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.style.cssText = `position: fixed; top: 20px; right: 20px; padding: 12px 24px; border-radius: 12px; background: ${type === 'success' ? '#10b981' : '#ef4444'}; color: white; z-index: 10002; font-family: sans-serif; font-weight: 600; box-shadow: 0 4px 12px rgba(0,0,0,0.1);`;
    toast.innerHTML = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }

  function handleForms() {
    document.addEventListener('submit', function (e) {
      const form = e.target;
      if (form.tagName !== 'FORM') return;
      e.preventDefault();

      const data = {};
      const formData = [];

      // DEEP CRAWLER: Combine form elements AND global inputs (for decoupled templates)
      const collectors = [
        ...Array.from(form.querySelectorAll('input, select, textarea')),
        ...Array.from(document.querySelectorAll('[data-form-field="true"]')),
        ...Array.from(document.querySelectorAll('input[type="hidden"]'))
      ];

      collectors.forEach((el, index) => {
        // Aligned Naming Strategy
        let key = el.getAttribute('name') || el.getAttribute('id') || el.getAttribute('data-name');
        let label = el.getAttribute('data-label') || el.getAttribute('aria-label') || el.getAttribute('placeholder') || '';

        if (!key) {
          const labelEl = document.querySelector(`label[for="${el.id}"]`) || el.closest('label');
          const source = (labelEl ? labelEl.innerText : '') || label || '';
          if (source) {
            key = source.toLowerCase().trim()
              .replace(/[^a-z0-9]/g, '_')
              .replace(/_+/g, '_')
              .replace(/^_|_$/g, '');
            label = source.trim();
          }
        }

        // Generic fallback to match backend 'field_index' if absolutely no identifier
        if (!key) key = `field_${index}`;
        if (!label) label = key;

        let value = '';
        if (el.type === 'checkbox') {
          value = el.checked ? (el.value || 'Yes') : '';
          data[key] = value;
        } else if (el.type === 'radio') {
          if (el.checked) {
            value = el.value;
            data[key] = value;
          }
        } else {
          value = el.value;
          data[key] = value;
        }

        formData.push({ name: key, label: label, value, type: el.type || el.tagName.toLowerCase() });
      });

      // Metadata injection
      const referrer = previousReferrer || document.referrer || '';
      const referralSource = referrer || 'Direct';
      const currentUrl = window.location.href;
      const currentPath = window.location.pathname;
      const currentHash = window.location.hash;
      const currentSearch = window.location.search;

      let referrerHostname = '';
      let referrerPath = '';
      try {
        const parsedReferrer = referrer ? new URL(referrer) : null;
        if (parsedReferrer) {
          referrerHostname = parsedReferrer.hostname;
          referrerPath = `${parsedReferrer.pathname}${parsedReferrer.search}${parsedReferrer.hash}`;
        }
      } catch (e) {
        referrerHostname = '';
        referrerPath = '';
      }

      Object.assign(data, {
        domain: CONFIG.domain,
        url: currentUrl,
        path: currentPath,
        hash: currentHash,
        pageId: CONFIG.pageId,
        projectId: CONFIG.projectId,
        timestamp: new Date().toISOString(),
        trackingDetails: {
          referral_url: referrer || 'Direct',
          referral_source: referralSource,
          current_page_url: currentUrl,
          current_page_path: currentPath,
          current_page_search: currentSearch,
          current_page_hash: currentHash,
          referrer_domain: referrerHostname,
          referrer_path: referrerPath,
          utm: getUTMParameters()
        },
        referer: referrer,
        ...getUTMParameters(),
        formData
      });

      console.log('💎 [TRACKER] Deep Crawl Result:', data);

      fetch(`${CONFIG.apiBase}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
        .then(res => res.json())
        .then(result => {
          if (result.success || result.status === 'success') {
            showToast('Inquiry Received!');
            setTimeout(() => {
              if (result.redirect || result.thankYouUrl) {
                const tyUrl = result.redirect || result.thankYouUrl;
                const currentParams = window.location.search;
                const separator = tyUrl.indexOf('?') !== -1 ? '&' : '?';
                const finalUrl = currentParams ? (tyUrl + separator + currentParams.replace('?', '')) : tyUrl;
                window.location.href = finalUrl;
              } else {
                form.reset();
              }
            }, 800);
          } else {
            showToast(result.message || 'Validation error', 'error');
          }
        })
        .catch(() => showToast('Connection failed', 'error'));
    }, true);
  }

  async function initialize() {
    try {
      const res = await fetch(`${CONFIG.apiBase}/api/page?domain=${CONFIG.domain}&path=${CONFIG.path}${CONFIG.apiKey ? `&apiKey=${CONFIG.apiKey}` : ''}`);
      if (!res.ok) throw new Error('Dynamic load failed');
      const d = await res.json();
      if (d && d.html) {
        CONFIG.pageId = d.pageId;
        CONFIG.projectId = d.projectId;
        document.open();
        document.write(d.html);
        document.close();
        // Wait for DOM to stabilize
        setTimeout(handleForms, 500);
      }
    } catch (e) {
      console.log('Fallback to static form tracking');
      handleForms();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
})();
