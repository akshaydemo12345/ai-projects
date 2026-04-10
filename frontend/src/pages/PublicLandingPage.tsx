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
    queryFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/public/page/${slug}`);
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Page not found');
      
      // result.data is page.content
      // result.meta contains title, seo etc.
      return result;
    },
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
      const aiCss = (typeof content === 'object' ? (content?.fullCss || '') : '') || (meta?.styles || '');
      const aiJs = (typeof content === 'object' ? (content?.fullJs || '') : '') || '';
      
      const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      const PROJECT_ID = meta?.projectId || '';
      const PAGE_SLUG = slug || '';

      const leadCaptureScript = `
        <script>
          console.log("🚀 Lead Capture System Initialized. Target: ${API_URL}");
          
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
                form.innerHTML = '<div style="text-align:center; padding: 40px 20px;"><h3 style="color:#059669; font-size: 24px; margin-bottom: 10px;">Thank you!</h3><p style="color:#4b5563;">Your inquiry was sent successfully. We will contact you soon.</p></div>';
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
              
              const btn = form.querySelector('button[type="submit"]');
              const originalBtnText = btn ? btn.innerHTML : 'Submit';
              if (btn) {
                btn.disabled = true;
                btn.innerHTML = 'Sending...';
              }

              const formData = new FormData(form);
              const data = {
                pageSlug: "${PAGE_SLUG}",
                projectId: "${PROJECT_ID}",
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

      // If it's a full HTML already, inject script and styles
      if (finalHtml.toLowerCase().includes('</body>')) {
        // Inject Lead Capture Script
        finalHtml = finalHtml.replace(/<\/body>/i, leadCaptureScript + '</body>');
        
        // Inject Styles if they are not already in the HTML and we have them
        if (aiCss && !finalHtml.toLowerCase().includes('<style')) {
           if (finalHtml.toLowerCase().includes('</head>')) {
             finalHtml = finalHtml.replace(/<\/head>/i, `<style>${aiCss}</style></head>`);
           } else {
             // If no head, just prepend styles
             finalHtml = `<style>${aiCss}</style>` + finalHtml;
           }
        }
      } else {
        // Fragment: Wrap it in a full document structure
        finalHtml = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <title>${meta?.title || 'Landing Page'}</title>
              <meta name="viewport" content="width=device-width, initial-scale=1">
              ${meta?.seo?.description ? `<meta name="description" content="${meta.seo.description}">` : ''}
              <base href="${window.location.origin}">
              <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
              <style>
                /* Modern Reset */
                * { box-sizing: border-box; }
                body { margin: 0; font-family: 'Inter', system-ui, -apple-system, sans-serif; line-height: 1.5; -webkit-font-smoothing: antialiased; }
                img { max-width: 100%; height: auto; display: block; }
                
                ${aiCss}
              </style>
            </head>
            <body>
              ${aiHtml}
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
