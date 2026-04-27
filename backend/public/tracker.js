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

  function getUTMParameters() {
    const utms = {};
    try {
      const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid', 'msclkid'];
      utmKeys.forEach(key => {
        const val = sessionStorage.getItem('dm_' + key) || (new URLSearchParams(window.location.search)).get(key);
        if (val) utms[key.toLowerCase()] = val;
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

      const data = {};
      
      // DEEP CRAWLER: Combine form elements AND global inputs (for decoupled templates)
      const collectors = [
        ...Array.from(form.querySelectorAll('input, select, textarea')),
        ...Array.from(document.querySelectorAll('[data-form-field="true"]')),
        ...Array.from(document.querySelectorAll('input[type="hidden"]'))
      ];

      collectors.forEach((el, index) => {
        // Aligned Naming Strategy
        let key = el.getAttribute('name') || el.getAttribute('id') || el.getAttribute('data-name');
        
        if (!key) {
          const label = document.querySelector(`label[for="${el.id}"]`) || el.closest('label');
          const source = (label ? label.innerText : '') || el.getAttribute('placeholder') || '';
          if (source) {
            key = source.toLowerCase().trim()
                  .replace(/[^a-z0-9]/g, '_')
                  .replace(/_+/g, '_')
                  .replace(/^_|_$/g, '');
          }
        }

        // Generic fallback to match backend 'field_index' if absolutely no identifier
        if (!key) key = `field_${index}`;

        // Value Extractors
        if (el.type === 'checkbox') {
          data[key] = el.checked ? (el.value || 'Yes') : '';
        } else if (el.type === 'radio') {
          if (el.checked) data[key] = el.value;
        } else {
          data[key] = el.value;
        }
      });

      // Metadata injection
      Object.assign(data, {
        domain: CONFIG.domain,
        pageUrl: CONFIG.fullUrl,
        path: CONFIG.path,
        timestamp: new Date().toISOString(),
        ...getUTMParameters()
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
      const res = await fetch(`${CONFIG.apiBase}/api/page?domain=${CONFIG.domain}&path=${CONFIG.path}`);
      if (!res.ok) throw new Error('Dynamic load failed');
      const d = await res.json();
      if (d && d.html) {
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
