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

      const leadCaptureScript = `
        <script>
          console.log("🚀 Lead Capture System Initialized. Target: ${API_URL}");
          
          function showSuccessModal() {
            let modal = document.getElementById('pc-success-modal');
            if (!modal) {
              modal = document.createElement('div');
              modal.id = 'pc-success-modal';
              modal.innerHTML = \`
                <div style="position:fixed; z-index:99999; left:0; top:0; width:100%; height:100%; background:rgba(0,0,0,0.5); backdrop-filter:blur(8px); display:flex; align-items:center; justify-content:center; opacity:0; transition:opacity 0.3s ease; font-family: 'Inter', system-ui, -apple-system, sans-serif;">
                  <div style="background:white; padding:40px; border-radius:30px; max-width:420px; width:90%; text-align:center; transform:translateY(20px); transition:transform 0.3s ease; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);">
                    <div style="width:80px; height:80px; background:#ecfdf5; border-radius:50%; display:flex; align-items:center; justify-content:center; margin:0 auto 24px;">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    <h3 style="margin:0 0 12px; font-size:28px; font-weight:800; color:#111827;">Thank you!</h3>
                    <p style="margin:0 0 32px; color:#4b5563; font-size:16px; line-height:1.6;">Your message has been sent successfully. We'll get back to you shortly.</p>
                    <button onclick="document.getElementById('pc-success-modal').remove()" style="background:#111827; color:white; border:none; padding:16px 32px; border-radius:15px; font-size:16px; font-weight:600; cursor:pointer; width:100%; transition:all 0.2s;">Continue</button>
                  </div>
                </div>
              \`;
              document.body.appendChild(modal);
              
              // Trigger animation
              setTimeout(() => {
                const backdrop = modal.querySelector('div');
                const content = backdrop.querySelector('div');
                backdrop.style.opacity = '1';
                content.style.transform = 'translateY(0)';
              }, 10);
            }
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
                showSuccessModal();
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
