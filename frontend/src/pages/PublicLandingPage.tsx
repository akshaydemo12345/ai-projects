import { useEffect, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { pagesApi } from '@/services/api';
import { Loader2, AlertCircle } from 'lucide-react';

const PublicLandingPage = () => {
  const { "*": splat } = useParams();
  const [searchParams] = useSearchParams();
  const pgSlug = searchParams.get('pg');
  
  // Resolve slug from splat or pathname to support nested preSlugs
  const rawPath = window.location.pathname.replace(/^\/+|\/+$/g, '');
  // Strip /thank-you from path to get the page slug
  const path = rawPath.replace(/\/thank-you$/i, '');
  
  const slug = (path.startsWith('preview/') ? path.replace('preview/', '') : path) || pgSlug;
  
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const isThankYouPage = window.location.pathname.endsWith('/thank-you') || searchParams.get('thankyou') === 'true';

  // We might need the token from the URL if the backend requires it
  const token = searchParams.get('token');

  const { data: pageData, isLoading, error } = useQuery({
    queryKey: ['public-page', slug],
    queryFn: () => pagesApi.getBySlug(slug!),
    enabled: !!slug,
    retry: 1,
  });

  useEffect(() => {
    if (pageData && iframeRef.current) {
      const { data: content, meta } = pageData;

      // Update browser tab title
      if (meta?.title) {
        document.title = `${meta.title} | Preview`;
      }

      // Sync meta tags for the main document (to be visible in Inspect)
      const targetDesc = pageData.metaDescription || pageData.seo?.description || 'High-converting AI landing page.';
      const metaDescriptions = document.querySelectorAll('meta[name="description"]');
      if (metaDescriptions.length > 0) {
        metaDescriptions.forEach(tag => tag.setAttribute('content', targetDesc));
      } else {
        const newTag = document.createElement('meta');
        newTag.setAttribute('name', 'description');
        newTag.setAttribute('content', targetDesc);
        document.head.appendChild(newTag);
      }

      // Update OG/Twitter tags if they exist for better SEO preview feel
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) ogTitle.setAttribute('content', meta?.title || 'Preview');
      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) ogDesc.setAttribute('content', targetDesc);

      const aiHtml = (typeof content === 'string' ? content : (content?.fullHtml || '')).trim();
      const aiCss = (typeof content === 'object' && content?.fullCss) ? content.fullCss : (pageData.landingPageStyles || pageData.styles || '');
      const aiJs = typeof content === 'object' ? (content?.fullJs || '') : '';

      const API_URL = import.meta.env.VITE_API_BASE_URL || window.location.origin;
      const PROJECT_ID = meta?.projectId || pageData?.projectId || '';
      const ACTUAL_PAGE_ID = meta?._id || pageData?._id || '';
      const PAGE_SLUG = slug || '';
      const BRAND_COLOR = pageData.primaryColor || meta?.primaryColor || '#7c3aed';
      const REDIRECT_URL = pageData.websiteUrl || '#';
      const THANK_YOU_URL = pageData.thankYouUrl || '';
      const previewPrefix = window.location.pathname.startsWith('/preview/') ? '/preview/' : '/';

      const leadCaptureScript = `
        <script>
          console.log("🚀 Lead Capture System Initialized. Target: ${API_URL}");
          
          function persistUTMs() {
            var q = new URLSearchParams(window.location.search);
            var keys = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "fbclid", "msclkid"];
            keys.forEach(function(k) {
              var v = q.get(k);
              if (v) { try { sessionStorage.setItem('dm_' + k, v); } catch (e) {} }
            });
          }
          persistUTMs();

          function getUTMs() {
            var utms = {};
            var keys = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "fbclid", "msclkid"];
            keys.forEach(function(k) {
              var v = null;
              try { v = sessionStorage.getItem('dm_' + k); } catch (e) {}
              if (!v) v = new URLSearchParams(window.location.search).get(k);
              if (v) utms[k] = v;
            });
            return utms;
          }

          function redirectToSuccessPage() {
            var thankYouUrl = "${THANK_YOU_URL}";
            if (thankYouUrl && thankYouUrl.trim()) {
              window.top.location.href = thankYouUrl;
            } else {
              window.top.location.href = "${previewPrefix}${PAGE_SLUG}/thank-you";
            }
          }

          async function submitLead(data, form, btn, originalBtnText, attempt) {
            attempt = attempt || 1;
            console.log("📤 Submitting lead (Attempt " + attempt + "):", data);
            
            try {
              var response = await fetch("${API_URL}/api/leads", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
              });
              
              var result = await response.json();
              console.log("📥 API Response:", result);

              if (result.status === 'success' || result.status === 'error') {
                redirectToSuccessPage();
                form.reset();
                if (btn) {
                  btn.disabled = false;
                  btn.innerHTML = originalBtnText;
                }
              } else {
                throw new Error(result.message || 'Server returned error');
              }
            } catch (err) {
              console.error("❌ Lead Submission Error:", err);
              
              if (attempt < 3) {
                console.log("🔄 Retrying in 2 seconds...");
                if (btn) btn.innerHTML = 'Retrying...';
                setTimeout(function() { submitLead(data, form, btn, originalBtnText, attempt + 1); }, 2000);
              } else {
                var errorDiv = document.createElement('div');
                errorDiv.style.cssText = "position: fixed; top: 20px; right: 20px; background: #ef4444; color: white; padding: 12px 20px; borderRadius: 8px; boxShadow: 0 4px 12px rgba(0,0,0,0.15); zIndex: 9999; font-family: sans-serif; fontSize: 14px; fontWeight: 500; border-left: 4px solid #b91c1c; animation: slideIn 0.3s ease-out;";
                errorDiv.innerHTML = "<b>Submission failed:</b> " + err.message;
                document.body.appendChild(errorDiv);
                setTimeout(function() {
                  errorDiv.style.opacity = '0';
                  errorDiv.style.transition = 'opacity 0.5s ease-out';
                  setTimeout(function() { errorDiv.remove(); }, 500);
                }, 4000);

                if (btn) {
                  btn.disabled = false;
                  btn.innerHTML = originalBtnText;
                }
              }
            }
          }


          document.addEventListener('submit', function(e) {
            var form = e.target;
            
            if (form && form.tagName === 'FORM') {
              form.setAttribute('method', 'POST');
              e.preventDefault();
              
              var btn = form.querySelector('button[type="submit"]') || form.querySelector('button');
              var originalBtnText = btn ? btn.innerHTML : 'Submit';
              if (btn) {
                btn.disabled = true;
                btn.innerHTML = 'Sending...';
              }

              var formData = new FormData(form);
              var data = {
                pageSlug: "${PAGE_SLUG}",
                projectId: "${PROJECT_ID}",
                pageId: "${ACTUAL_PAGE_ID}"
              };

              // Merge UTMs
              var utms = getUTMs();
              for (var k in utms) { data[k] = utms[k]; }

              // Capture all fields dynamically
              formData.forEach(function(value, key) {
                if (!data[key]) data[key] = value;
              });

              // Fallbacks for standard fields
              if (!data.name) {
                var nInput = form.querySelector('input[type="text"]');
                data.name = formData.get('name') || formData.get('first_name') || (nInput ? nInput.value : "") || '';
              }
              if (!data.email) {
                var eInput = form.querySelector('input[type="email"]');
                data.email = formData.get('email') || (eInput ? eInput.value : "") || 'unknown@example.com';
              }
              if (!data.phone) {
                var pInput = form.querySelector('input[type="tel"]');
                data.phone = formData.get('phone') || formData.get('tel') || (pInput ? pInput.value : "") || '';
              }
              if (!data.message) {
                var mInput = form.querySelector('textarea');
                data.message = formData.get('message') || formData.get('comments') || (mInput ? mInput.value : "") || '';
              }

              submitLead(data, form, btn, originalBtnText);
            }
          });
        </script>
      `;

      let finalHtml = aiHtml;

      // ─── DYNAMIC REPLACEMENTS: Logo & Context ──────────────────────────────
      const finalLogo = pageData.logoUrl || meta?.logoUrl || '';
      console.log("🎨 Applying Branding. Logo:", finalLogo, "Primary:", BRAND_COLOR);
      
      if (finalLogo) {
        // 1. Replace known placeholders
        finalHtml = finalHtml.replace(/https:\/\/via\.placeholder\.com\/[^\s"'>]+/g, finalLogo);
        finalHtml = finalHtml.replace(/https:\/\/i\.ibb\.co\/vzB7pLq\/Logo\.png/g, finalLogo);
        finalHtml = finalHtml.replace(/https:\/\/picsum\.photos\/seed\/saaslogo\/[^\s"'>]+/g, finalLogo);
        
        // 2. Smart attribute-agnostic logo replacement
        finalHtml = finalHtml.replace(/<img([^>]*)id="page-logo"([^>]*)>/gi, (match, p1, p2) => {
          const combined = p1 + p2;
          const updated = combined.replace(/src="[^"]*"/gi, '');
          return `<img src="${finalLogo}"${updated} id="page-logo">`;
        });
      }

      // ─── REMOVE PICSUM PLACEHOLDERS (if they leak from AI/defaults) ─────────
      finalHtml = finalHtml.replace(/https:\/\/(fastly\.)?picsum\.photos\/[^\s"'>]+/g, 'https://via.placeholder.com/1200x800?text=Brand+Image');

      // Better Dark Mode detection 
      const isDark = aiCss.toLowerCase().includes('background-color: #0') || 
                     aiCss.toLowerCase().includes('background: #0') || 
                     aiCss.toLowerCase().includes('background-color: black') ||
                     aiCss.toLowerCase().includes('background: black') ||
                     aiHtml.toLowerCase().includes('bg-slate-900') ||
                     aiHtml.toLowerCase().includes('bg-[#0') ||
                     aiHtml.toLowerCase().includes('saas-hero-container') ||
                     aiHtml.toLowerCase().includes('agency-container');

      const brandingStyles = `
        <style id="branding-vars">
          :root {
            --primary: ${BRAND_COLOR};
            --secondary: ${pageData.secondaryColor || '#6366f1'};
            --accent: ${pageData.secondaryColor || '#6366f1'};
            --button-gradient: linear-gradient(135deg, ${BRAND_COLOR}, ${pageData.secondaryColor || '#6366f1'});
          }
          body { 
            margin: 0;
            padding: 0;
            overflow-x: hidden;
            min-height: 100vh;
            background-color: ${isDark ? '#0a0a0f' : '#ffffff'};
            color: ${isDark ? '#f8fafc' : '#0f172a'};
          }
          
          /* Forced project-based background matching if user didn't specify */
          .saas-hero-container, .agency-container, .lead-gen-container, .business-container {
             background-color: ${isDark ? '#0a0a0f' : '#ffffff'} !important;
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
        </style>
      `;

      const coreDependencies = `
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
        ${brandingStyles}
      `;

      // Ensure styles and scripts are injected even into full documents
      const isFullDoc = finalHtml.toLowerCase().includes('<!doctype') || finalHtml.toLowerCase().includes('<html');

      if (isFullDoc) {
        // Inject styles into head of full document if provided separately
        if (aiCss && aiCss.trim() && !finalHtml.toLowerCase().includes('id="ai-generated-styles"')) {
          const styleTag = `<style id="ai-generated-styles">${aiCss}</style>`;
          if (finalHtml.toLowerCase().includes('</head>')) {
            finalHtml = finalHtml.replace(/<\/head>/i, styleTag + coreDependencies + '</head>');
          } else if (finalHtml.toLowerCase().includes('<head>')) {
            finalHtml = finalHtml.replace(/<head>/i, '<head>' + styleTag + coreDependencies);
          } else {
            finalHtml = finalHtml.replace(/<html[^>]*>/i, (m) => m + '<head>' + styleTag + coreDependencies + '</head>');
          }
        } else {
          if (finalHtml.toLowerCase().includes('</head>')) {
            finalHtml = finalHtml.replace(/<\/head>/i, coreDependencies + '</head>');
          }
        }

        // Inject lead capture
        if (finalHtml.toLowerCase().includes('</body>')) {
          finalHtml = finalHtml.replace(/<\/body>/i, leadCaptureScript + '</body>');
        } else {
          finalHtml += leadCaptureScript;
        }
      } else {
        // It's a fragment: Wrap it with proper metadata and reset styles
        // Strip <body> and </body> if they exist to avoid nesting
        const bodyInner = finalHtml
          .replace(/<body[^>]*>/i, '')
          .replace(/<\/body>/i, '');

        finalHtml = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <title>${meta?.title || 'Landing Page'}</title>
              <meta name="viewport" content="width=device-width, initial-scale=1">
              ${meta?.seo?.description ? `<meta name="description" content="${meta.seo.description}">` : ''}
              <base href="${window.location.origin}">
              ${coreDependencies}
              <style>
                /* Modern Reset */
                * { box-sizing: border-box; }
                body { margin: 0; font-family: 'Inter', system-ui, -apple-system, sans-serif; line-height: 1.5; -webkit-font-smoothing: antialiased; }
                img { max-width: 100%; height: auto; display: block; }
                
                ${aiCss}
              </style>
            </head>
            <body>
              ${bodyInner}
              <script>${aiJs}</script>
              ${leadCaptureScript}
            </body>
          </html>
        `;
      }

      if (isThankYouPage) {
        // Fetch dynamic Thank You page from backend
        const API_URL = import.meta.env.VITE_API_BASE_URL || window.location.origin;
        fetch(`${API_URL}/api/thank-you/render/${slug}`)
          .then(response => {
            if (!response.ok) {
              throw new Error('Failed to load Thank You page');
            }
            return response.text();
          })
          .then(html => {
            const doc = iframeRef.current.contentDocument;
            if (doc) {
              doc.open();
              doc.write(html);
              doc.close();
            }
          })
          .catch(err => {
            console.error('Error loading Thank You page:', err);
            // Fallback to simple Thank You message
            const fallbackHtml = `
              <!DOCTYPE html>
              <html>
                <head>
                  <meta charset="utf-8">
                  <title>Thank You</title>
                  <style>
                    body { font-family: system-ui, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; background: #f5f5f5; }
                    .container { text-align: center; padding: 40px; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                    h1 { color: #333; margin-bottom: 16px; }
                    p { color: #666; margin: 0; }
                  </style>
                </head>
                <body>
                  <div class="container">
                    <h1>Thank You!</h1>
                    <p>We have received your request and will contact you soon.</p>
                  </div>
                </body>
              </html>
            `;
            const doc = iframeRef.current.contentDocument;
            if (doc) {
              doc.open();
              doc.write(fallbackHtml);
              doc.close();
            }
          });
        return;
      }

      const doc = iframeRef.current.contentDocument;
      if (doc) {
        doc.open();
        doc.write(finalHtml);
        doc.close();
      }
    }
  }, [pageData, window.location.pathname]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
        <p className="text-slate-600 font-medium">Loading your experience...</p>
      </div>
    );
  }

  if (error || !pageData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6 text-center">
        <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="h-8 w-8 text-red-600" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Page Not Found</h1>
        <p className="text-slate-600 max-w-md mx-auto mb-6">
          The landing page you are looking for doesn't exist or is not currently published.
        </p>
        <a
          href="/"
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          Go to Home
        </a>
      </div>
    );
  }

  return (
    <div className="w-full h-screen overflow-hidden">
      <iframe
        ref={iframeRef}
        title={pageData?.meta?.title || "Landing Page"}
        className="w-full h-full border-none"
        sandbox="allow-scripts allow-forms allow-same-origin allow-top-navigation allow-top-navigation-by-user-activation"
      />
    </div>
  );
};

export default PublicLandingPage;
