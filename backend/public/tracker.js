(function() {
  'use strict';

  const scriptTag = document.currentScript;
  const API_BASE = (scriptTag ? scriptTag.src : '').replace('/tracker.js', '');
  const CONFIG = {
    apiBase: API_BASE || window.location.origin,
    apiKey: scriptTag ? scriptTag.getAttribute('data-api-key') : null,
    domain: window.location.hostname,
    path: window.location.pathname,
    fullUrl: window.location.href
  };
  const landingUrl = window.location.href;
  const previousReferrer = document.referrer;

  function cacheUtmParameters() {
    try {
      const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid', 'msclkid'];
      const params = new URLSearchParams(window.location.search);
      utmKeys.forEach(key => {
        const value = params.get(key);
        if (value) {
          sessionStorage.setItem('dm_' + key, value);
        }
      });
    } catch (e) {}
  }

  function cacheReferer() {
    try {
      const ref = document.referrer;
      if (ref) sessionStorage.setItem('dm_referer', ref);
    } catch (e) {}
  }

  function getUTMParameters() {
    const utms = {};
    try {
      const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid', 'msclkid'];
      const params = new URLSearchParams(window.location.search);
      utmKeys.forEach(key => {
        const stored = sessionStorage.getItem('dm_' + key);
        const query = params.get(key);
        const value = query || stored;
        if (value) utms[key.toLowerCase()] = value;
      });
    } catch (e) {}
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
    document.addEventListener('submit', function(e) {
      const form = e.target;
      if (form.tagName !== 'FORM') return;
      e.preventDefault();

      cacheUtmParameters();
      cacheReferer();
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
      const referralSource = document.referrer ? new URL(document.referrer).hostname : 'Direct';
      const referralUrl = window.location.href;

      Object.assign(data, {
        domain: CONFIG.domain,
        url: referralUrl,
        path: CONFIG.path,
        pageId: CONFIG.pageId,
        projectId: CONFIG.projectId,
        timestamp: new Date().toISOString(),
        trackingDetails: {
          referral_url: referralUrl,
          referral_source: referralSource
        },
        referer: previousReferrer || '',
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
            if (result.thankYouUrl) window.location.href = result.thankYouUrl;
            else form.reset();
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
