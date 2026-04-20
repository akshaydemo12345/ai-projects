(function() {
  'use strict';

  // Config
  const scriptTag = document.currentScript;
  const API_BASE = (scriptTag ? scriptTag.src : '').replace('/tracker.js', '');
  const CONFIG = {
    apiBase: API_BASE || window.location.origin,
    apiKey: scriptTag ? scriptTag.getAttribute('data-api-key') : null,
    domain: window.location.hostname,
    path: window.location.pathname,
    fullUrl: window.location.href
  };

  /**
   * Initialize Tracking
   */
  function initTracking() {
    // Page View Event
    if (window.gtag) {
      window.gtag('event', 'page_view', {
        page_location: CONFIG.fullUrl,
        page_path: CONFIG.path,
        page_title: document.title
      });
    }
  }

  /**
   * Handle Form Submissions
   */
  function handleForms() {
    document.addEventListener('submit', function(e) {
      const form = e.target;
      if (form.tagName !== 'FORM') return;

      e.preventDefault();

      const formData = new FormData(form);
      const data = {};
      formData.forEach((value, key) => {
        data[key] = value;
      });

      // Add metadata
      data.domain = CONFIG.domain;
      data.pageUrl = CONFIG.fullUrl;
      data.path = CONFIG.path;
      data.timestamp = new Date().toISOString();

      // Submit via API
      fetch(`${CONFIG.apiBase}/api/leads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then(response => response.json())
      .then(result => {
        if (result.success || result.status === 'success') {
          // Fire Conversion Event
          if (window.gtag) {
            window.gtag('event', 'conversion', {
              'send_to': result.gaEventLabel || 'default',
              'event_category': 'form',
              'event_label': CONFIG.path
            });
          }

          // Redirect to Thank You URL
          if (result.thankYouUrl) {
            window.location.href = result.thankYouUrl;
          } else {
            alert('Thank you for your submission!');
            form.reset();
          }
        } else {
          console.error('Lead submission failed:', result.message);
          alert(result.message || 'Submission failed. Please try again.');
        }
      })
      .catch(error => {
        console.error('Error submitting form:', error);
        // Fallback: continue traditional submission if API is totally down? 
        // Requirement says "Fail-Safe Behavior: Do not break page"
      });
    }, true);
  }

  /**
   * Main Loader
   */
  async function loadLandingPage() {
    try {
      const queryParams = new URLSearchParams({
        domain: CONFIG.domain,
        path: CONFIG.path
      });
      if (CONFIG.apiKey) queryParams.append('apiKey', CONFIG.apiKey);

      const response = await fetch(`${CONFIG.apiBase}/api/page?${queryParams.toString()}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          console.log('No dynamic landing page found for this path. Showing original content.');
          return;
        }
        throw new Error(`API failed with status ${response.status}`);
      }

      const data = await response.json();
      
      if (data && data.html) {
        // Stop current execution/rendering
        window.stop ? window.stop() : document.execCommand('Stop');

        // Replace entire document
        document.open();
        document.write(data.html);
        document.close();

        // Re-initialize scripts in the new content (document.write handles some, but let's ensure forms and tracking)
        // Note: document.write executed scripts if they are in the HTML.
        // We need to re-bind form handlers because they were on the old document.
        setTimeout(() => {
          handleForms();
          initTracking();
        }, 100);
      }
    } catch (error) {
      console.error('Landing Page Loader Error:', error);
      // Fail-safe: do nothing, let original index.html show its content
    }
  }

  // Start the process
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadLandingPage);
  } else {
    loadLandingPage();
  }

})();
