import { useEffect, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { pagesApi } from '@/services/api';
import { Loader2, AlertCircle } from 'lucide-react';

const PublicLandingPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const iframeRef = useRef<HTMLIFrameElement>(null);

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

      const leadCaptureScript = `
        <script>
          console.log("🚀 Lead Capture System Initialized. Target: ${API_URL}");
          
          function showSuccessPage() {
            // Remove existing modal if any
            const existing = document.getElementById('pc-success-page');
            if (existing) existing.remove();

            const successPage = document.createElement('div');
            successPage.id = 'pc-success-page';
            successPage.style.cssText = "position:fixed; inset:0; z-index:999999; background:#ffffff; display:flex; flex-direction:column; align-items:center; justify-content:center; opacity:0; transition:opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1); font-family: 'Inter', system-ui, sans-serif; text-align:center; overflow:hidden;";

            // Sparkle Background CSS
            const style = document.createElement('style');
            style.textContent = \`
              @keyframes pc-sparkle {
                0%, 100% { transform: scale(0); opacity: 0; filter: blur(0px); }
                50% { transform: scale(1.2); opacity: 1; filter: blur(1px); }
              }
              @keyframes pc-float {
                0% { transform: translate(0, 0); }
                50% { transform: translate(15px, -25px); }
                100% { transform: translate(-10px, -50px); }
              }
              .pc-sparkle {
                position: absolute;
                border-radius: 50%;
                pointer-events: none;
                z-index: 1;
                transition: background 1s ease;
              }
              .pc-content {
                position: relative;
                z-index: 10;
                max-width: 500px;
                padding: 40px;
                transform: translateY(30px);
                transition: transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
              }
              .pc-success-icon {
                width: 100px;
                height: 100px;
                background: rgba(16, 185, 129, 0.1);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 32px;
                color: #10b981;
                box-shadow: 0 0 40px rgba(16, 185, 129, 0.3);
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
                background: ${BRAND_COLOR};
                color: white;
                padding: 18px 40px;
                border-radius: 100px;
                font-size: 16px;
                font-weight: 700;
                text-decoration: none;
                transition: all 0.3s ease;
                box-shadow: 0 10px 25px -5px rgba(${BRAND_COLOR === '#7c3aed' ? '124, 58, 237' : '0,0,0'}, 0.4);
              }
              .pc-btn:hover {
                transform: scale(1.05);
                box-shadow: 0 20px 30px -10px rgba(${BRAND_COLOR === '#7c3aed' ? '124, 58, 237' : '0,0,0'}, 0.5);
              }
            \`;
            document.head.appendChild(style);

            // Generate Enhanced Sparkles
            const colors = ['#ffffff', '#ffd700', '${BRAND_COLOR}', '#ffffff'];
            for (let i = 0; i < 120; i++) {
              const sparkle = document.createElement('div');
              sparkle.className = 'pc-sparkle';
              const size = Math.random() * 5 + 1;
              const color = colors[Math.floor(Math.random() * colors.length)];
              
              sparkle.style.width = size + 'px';
              sparkle.style.height = size + 'px';
              sparkle.style.left = Math.random() * 100 + '%';
              sparkle.style.top = Math.random() * 110 + '%'; // Start slightly lower
              sparkle.style.background = color;
              sparkle.style.boxShadow = \`0 0 \${size * 2}px \${color}\`;
              
              const duration = Math.random() * 4 + 3;
              const delay = Math.random() * 8;
              sparkle.style.animation = \`
                pc-sparkle \${duration}s infinite \${delay}s ease-in-out,
                pc-float \${duration * 2}s infinite \${delay}s linear
              \`;
              
              successPage.appendChild(sparkle);
            }


            successPage.innerHTML += \`
              <div class="pc-content" id="pc-content">
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
            \`;

            document.body.appendChild(successPage);

            // Animate In
            setTimeout(() => {
              successPage.style.opacity = '1';
              document.getElementById('pc-content').style.transform = 'translateY(0)';
            }, 50);
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
                showSuccessPage();
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
            // Only intercept forms that look like lead capture
            if (form.querySelector('input[type="email"]') || form.id === 'lead-form') {
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
                name: formData.get('name') || formData.get('first_name') || '',
                email: formData.get('email') || '',
                phone: formData.get('phone') || formData.get('tel') || '',
                message: formData.get('message') || formData.get('comments') || ''
              };

              submitLead(data, form, btn, originalBtnText);
            }
          });
        </script>
      `;

      let finalHtml = aiHtml;

      // Ensure styles and scripts are injected even into full documents
      const isFullDoc = finalHtml.toLowerCase().includes('<!doctype') || finalHtml.toLowerCase().includes('<html');
      
      if (isFullDoc) {
        // Inject styles into head of full document if provided separately
        if (aiCss && aiCss.trim() && !finalHtml.toLowerCase().includes('id="ai-generated-styles"')) {
          const styleTag = `<style id="ai-generated-styles">${aiCss}</style>`;
          if (finalHtml.toLowerCase().includes('</head>')) {
            finalHtml = finalHtml.replace(/<\/head>/i, styleTag + '</head>');
          } else if (finalHtml.toLowerCase().includes('<head>')) {
            finalHtml = finalHtml.replace(/<head>/i, '<head>' + styleTag);
          } else {
            finalHtml = finalHtml.replace(/<html[^>]*>/i, (m) => m + '<head>' + styleTag + '</head>');
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

      const doc = iframeRef.current.contentDocument;
      if (doc) {
        doc.open();
        doc.write(finalHtml);
        doc.close();
      }
    }
  }, [pageData]);

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
        sandbox="allow-scripts allow-forms allow-same-origin"
      />
    </div>
  );
};

export default PublicLandingPage;
