/**
 * PageCraft AI - Smart Embed SDK
 * Usage: <script src=".../embed.js" data-token="TOKEN" data-page="SLUG" async></script>
 */
(function() {
  const currentScript = document.currentScript || (function() {
     const scripts = document.getElementsByTagName('script');
     return scripts[scripts.length - 1];
  })();

  const url = new URL(currentScript.src, window.location.origin);
  const token = currentScript.getAttribute('data-token') || url.searchParams.get('token');
  const searchParams = new URLSearchParams(window.location.search);
  const page = currentScript.getAttribute('data-page') || searchParams.get('page') || window.location.pathname.replace(/^\/+|\/+$/g, '').split('/')[0];
  const apiBase = url.origin;

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
      const isThankYou = searchParams.get('status') === 'thank-you' || window.location.pathname.replace(/\/+$/, '').endsWith('/thank-you');

      // We use the public endpoint that returns the rendered HTML or at least the raw data
      const response = await fetch(`${apiBase}/api/public/page/${page}`);
      
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
                <a href="${window.location.pathname}${window.location.search.replace('status=thank-you', '').replace('&&', '&').replace(/\?$/, '')}" style="margin-top: 32px; background: ${result.primaryColor || '#7c3aed'}; color: white; padding: 12px 32px; border-radius: 50px; text-decoration: none; font-weight: bold; transition: opacity 0.2s;">Return to Home</a>
            </div>
           `;
        }
      }

      const html = typeof content === 'string' ? content : (content?.fullHtml || '');
      const thankYouUrl = result.thankYouUrl || (result.meta && result.meta.thankYouUrl);

      // Clean the entire document for a pure landing page experience
      document.open();
      document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${title}</title>
          <style>
            :root {
              --primary: ${result.primaryColor || '#7c3aed'};
              --secondary: ${result.secondaryColor || '#6366f1'};
              --accent: ${result.accentColor || result.secondaryColor || '#6366f1'};
            }
            ${css}
          </style>
          ${!isThankYou ? '<script src="https://cdn.tailwindcss.com"></script>' : ''}
        </head>
        <body>
          ${html}
          ${js ? `<script>${js}</script>` : ''}
        </body>
        </html>
      `);
      document.close();

      console.log('PageCraft AI: Embedded page loaded successfully');
      
      // Initialize Lead Capture if not already in thank you state
      if (!isThankYou) {
        initLeadCapture(apiBase, page, thankYouUrl);
      }

    } catch (err) {
      console.error('PageCraft AI Error:', err);
    }
  }

  function initLeadCapture(apiBase, slug, fallbackThankYouUrl) {
    document.addEventListener('submit', async function(e) {
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
      
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
      }

      const formData = new FormData(form);
      const data = {};
      formData.forEach((value, key) => {
        data[key] = value;
      });

      // --- Robust Lead Data Extraction ---
      
      // 1. Detect Email (Mandatory for Backend)
      if (!data.email) {
        data.email = data.Email || data.EMAIL || data.email_address || data.mail || 
                     (form.querySelector('input[type="email"]') ? form.querySelector('input[type="email"]').value : "") ||
                     (form.querySelector('input[name*="email" i]') ? form.querySelector('input[name*="email" i]').value : "");
      }
      
      // 2. Detect Name
      if (!data.name) {
        data.name = data.Name || data.NAME || data.first_name || data.fullname ||
                    (form.querySelector('input[name*="name" i]') ? form.querySelector('input[name*="name" i]').value : "");
      }

      // Add metadata
      data.domain = window.location.hostname;
      data.url = window.location.href;
      data.path = window.location.pathname;
      data.pageSlug = slug;

      try {
        const response = await fetch(`${apiBase}/api/leads`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok && (result.success || result.status === 'success')) {
          console.log('PageCraft AI: Lead captured successfully');
          
          // Dispatch event for external trackers
          document.dispatchEvent(new CustomEvent('pagecraft_lead_success', { detail: result.data }));

          // Handle Redirection
          const thankYouUrl = result.thankYouUrl || (result.data && result.data.thankYouUrl) || fallbackThankYouUrl;
          
          if (thankYouUrl && !thankYouUrl.includes('/thank-you')) {
             // If a custom external URL is provided, go there
             window.location.href = thankYouUrl;
          } else {
            // Intelligent Redirect for PHP/Query Param sites and standard paths
            const currentUrl = new URL(window.location.href);
            if (currentUrl.searchParams.has('page')) {
                currentUrl.searchParams.set('status', 'thank-you');
                window.location.href = currentUrl.toString();
            } else if (window.location.pathname.length > 1) {
                // If it's a clean URL like /test-page, go to /test-page/thank-you (but only if on Node/Clean URL server)
                // However, on many deployments, appending /thank-you is safer
                if (thankYouUrl) {
                    window.location.href = thankYouUrl;
                } else {
                    window.location.href = window.location.origin + window.location.pathname.replace(/\/$/, '') + '/thank-you';
                }
            } else {
                // Root page
                currentUrl.searchParams.set('status', 'thank-you');
                window.location.href = currentUrl.toString();
            }
          }
        } else {
          console.error('PageCraft AI: Server returned error', result);
          alert('Error: ' + (result.message || 'Submission failed'));
        }
      } catch (err) {
        console.error('Lead submission error:', err);
        alert('Submission failed. Please try again.');
      } finally {
        form.removeAttribute('data-submitting');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalBtnText;
        }
      }
    });
  }

  // Support for browsers that might have already finished loading
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadPage);
  } else {
    loadPage();
  }
})();
