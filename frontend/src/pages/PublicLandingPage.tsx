import { useEffect, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { pagesApi } from '@/services/api';
import { Loader2, AlertCircle } from 'lucide-react';

const PublicLandingPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const isThankYouPage = window.location.pathname.endsWith('/thank-you');

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
        document.title = meta.title;
      }

      const aiHtml = (typeof content === 'string' ? content : (content?.fullHtml || '')).trim();
      const aiCss = (typeof content === 'object' && content?.fullCss) ? content.fullCss : (pageData.styles || '');
      const aiJs = typeof content === 'object' ? (content?.fullJs || '') : '';

      const API_URL = import.meta.env.VITE_API_BASE_URL || window.location.origin;
      const PAGE_ID = meta?.projectId || '';
      const PAGE_SLUG = slug || '';
      const BRAND_COLOR = pageData.primaryColor || '#7c3aed';
      const REDIRECT_URL = pageData.websiteUrl || '#';
      const previewPrefix = window.location.pathname.startsWith('/preview/') ? '/preview/' : '/';

      const leadCaptureScript = `
        <script>
          console.log("🚀 Lead Capture System Initialized. Target: ${API_URL}");
          
          function redirectToSuccessPage() {
            window.top.location.href = "${previewPrefix}${PAGE_SLUG}/thank-you";
          }

          async function submitLead(data, form, btn, originalBtnText, attempt = 1) {
            console.log("📤 Submitting lead (Attempt " + attempt + "):", data);
            
            try {
              const response = await fetch("${API_URL}/api/leads", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
                mode: 'cors'
              });

              const result = await response.json();
              console.log("📥 API Response:", result);

              if (result.status === 'success') {
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
                setTimeout(() => submitLead(data, form, btn, originalBtnText, attempt + 1), 2000);
              } else {
                alert("Submission failed: " + err.message + ". Please try again later.");
                if (btn) {
                  btn.disabled = false;
                  btn.innerHTML = originalBtnText;
                }
              }
            }
          }


          document.addEventListener('submit', function(e) {
            const form = e.target;
            
            if (form && form.tagName === 'FORM') {
              form.setAttribute('method', 'POST'); // Ensure POST method is used
              e.preventDefault();
              
              const btn = form.querySelector('button[type="submit"]') || form.querySelector('button');
              const originalBtnText = btn ? btn.innerHTML : 'Submit';
              if (btn) {
                btn.disabled = true;
                btn.innerHTML = 'Sending...';
              }

              const formData = new FormData(form);
              const data = {
                pageSlug: "${PAGE_SLUG}",
                projectId: "${PAGE_ID}",
                name: formData.get('name') || formData.get('first_name') || (form.querySelector('input[type="text"]') ? form.querySelector('input[type="text"]').value : ''),
                email: formData.get('email') || (form.querySelector('input[type="email"]') ? form.querySelector('input[type="email"]').value : ''),
                phone: formData.get('phone') || formData.get('tel') || (form.querySelector('input[type="tel"]') ? form.querySelector('input[type="tel"]').value : ''),
                message: formData.get('message') || formData.get('comments') || (form.querySelector('textarea') ? form.querySelector('textarea').value : '')
              };

              submitLead(data, form, btn, originalBtnText);
            }
          });
        </script>
      `;

      let finalHtml = aiHtml;

      const detectDark = (aiCss.includes('#0f172a') || aiHtml.includes('bg-[#0f172a]') || aiHtml.includes('bg-slate-950'));
      const brandingStyles = `
        <style id="branding-vars">
          :root {
            --primary: ${BRAND_COLOR};
            --secondary: ${pageData.secondaryColor || '#6366f1'};
            --accent: ${pageData.secondaryColor || '#6366f1'};
            --button-gradient: linear-gradient(135deg, ${BRAND_COLOR}, ${pageData.secondaryColor || '#6366f1'});
          }
          body { 
            background-color: ${detectDark ? '#0f172a' : '#ffffff'};
            color: ${detectDark ? '#f8fafc' : '#0f172a'};
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
        // Render Thank You content directly into iframe
        const thankYouHtml = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <title>Thank You | ${pageData.name}</title>
              <meta name="viewport" content="width=device-width, initial-scale=1">
              <style>
                @keyframes pc-sparkle {
                  0%, 100% { transform: scale(0); opacity: 0; filter: blur(0px); }
                  50% { transform: scale(1.2); opacity: 1; filter: blur(1px); }
                }
                @keyframes pc-float {
                  0% { transform: translate(0, 0); }
                  50% { transform: translate(15px, -25px); }
                  100% { transform: translate(-10px, -50px); }
                }
                body { 
                  margin: 0; 
                  font-family: 'Inter', system-ui, -apple-system, sans-serif; 
                  background: #ffffff;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  min-height: 100vh;
                  text-align: center;
                  overflow: hidden;
                }
                .pc-sparkle {
                  position: absolute;
                  border-radius: 50%;
                  pointer-events: none;
                  z-index: 1;
                }
                .pc-content {
                  position: relative;
                  z-index: 10;
                  max-width: 500px;
                  padding: 40px;
                }
                .pc-success-icon {
                  width: 100px;
                  height: 100px;
                  background: #7c3aed;
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  margin: 0 auto 32px;
                  color: #ffffffff;
                  box-shadow: 0 0 40px #7c3aed36;
                }
                .pc-title {
                  font-size: 56px;
                  font-weight: 900;
                  color: #0f172a;
                  margin: 0 0 16px;
                  letter-spacing: -0.02em;
                }
                .pc-desc {
                  font-size: 18px;
                  line-height: 1.6;
                  color: #64748b;
                  margin-bottom: 40px;
                }
                .pc-btn {
                  display: inline-flex;
                  align-items: center;
                  gap: 10px;
                  background: ${BRAND_COLOR} !important;
                  color: white !important;
                  padding: 18px 40px;
                  border-radius: 100px;
                  font-size: 16px;
                  font-weight: 700;
                  text-decoration: none;
                  transition: all 0.3s ease;
                }
                .pc-btn:hover {
                  transform: scale(1.05);
                }
              </style>
            </head>
            <body>
              <div class="pc-content">
                <div class="pc-success-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                </div>
                <h1 class="pc-title">Thank You!</h1>
                <p class="pc-desc">
                  We've received your consultation request. Our team of experts will review your details and reach out to you within 24 hours.
                </p>
                <a href="${REDIRECT_URL}" class="pc-btn">
                  Visit Our Website
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </a>
                <p style="margin-top:24px; font-size:13px; color:#94a3b8;">Need help? Contact us at support@example.com</p>
              </div>
              <script>
                // Generate Dynamic Sparkles
                const colors = ['#ffffff', '#ffd700', '${BRAND_COLOR}', '#ffffff'];
                for (let i = 0; i < 120; i++) {
                  const sparkle = document.createElement('div');
                  sparkle.className = 'pc-sparkle';
                  const size = Math.random() * 5 + 1;
                  const color = colors[Math.floor(Math.random() * colors.length)];
                  sparkle.style.width = size + 'px';
                  sparkle.style.height = size + 'px';
                  sparkle.style.left = Math.random() * 100 + '%';
                  sparkle.style.top = Math.random() * 110 + '%';
                  sparkle.style.background = color;
                  sparkle.style.boxShadow = '0 0 ' + (size * 2) + 'px ' + color;
                  const duration = Math.random() * 4 + 3;
                  const delay = Math.random() * 8;
                  sparkle.style.animation = 'pc-sparkle ' + duration + 's infinite ' + delay + 's ease-in-out, pc-float ' + (duration * 2) + 's infinite ' + delay + 's linear';
                  document.body.appendChild(sparkle);
                }
              </script>
            </body>
          </html>
        `;
        const doc = iframeRef.current.contentDocument;
        if (doc) {
          doc.open();
          doc.write(thankYouHtml);
          doc.close();
        }
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
