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
              <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
              <script src="https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js"><\/script>
              <style>
                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
                @keyframes bgPulse { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
                @keyframes fadeUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
                @keyframes checkPop { 0%{transform:scale(0) rotate(-15deg);opacity:0} 60%{transform:scale(1.15) rotate(4deg);opacity:1} 80%{transform:scale(0.95) rotate(-2deg)} 100%{transform:scale(1) rotate(0deg);opacity:1} }
                @keyframes ringPulse { 0%{box-shadow:0 0 0 0 rgba(124,58,237,0.7)} 70%{box-shadow:0 0 0 30px rgba(124,58,237,0)} 100%{box-shadow:0 0 0 0 rgba(124,58,237,0)} }
                @keyframes floatOrb { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(30px,-40px) scale(1.05)} 66%{transform:translate(-20px,20px) scale(0.97)} }
                @keyframes starTwinkle { 0%,100%{opacity:0.3;transform:scale(0.8)} 50%{opacity:1;transform:scale(1.2)} }
                @keyframes btnShimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
                @keyframes btnGlow { 0%,100%{box-shadow:0 0 20px rgba(124,58,237,0.5),0 8px 32px rgba(99,102,241,0.4)} 50%{box-shadow:0 0 40px rgba(124,58,237,0.8),0 12px 48px rgba(99,102,241,0.6)} }
                @keyframes arrowBounce { 0%,100%{transform:translateX(0)} 50%{transform:translateX(5px)} }
                body { font-family:'Plus Jakarta Sans',system-ui,sans-serif; background:#050816; min-height:100vh; display:flex; align-items:center; justify-content:center; overflow-x:hidden; position:relative; }
                .orb { position:fixed; border-radius:50%; filter:blur(80px); pointer-events:none; z-index:0; animation:floatOrb 12s ease-in-out infinite; }
                .orb-1 { width:500px; height:500px; background:radial-gradient(circle,rgba(124,58,237,0.35) 0%,transparent 70%); top:-10%; left:-10%; }
                .orb-2 { width:400px; height:400px; background:radial-gradient(circle,rgba(99,102,241,0.3) 0%,transparent 70%); top:40%; right:-8%; animation-delay:3s; }
                .orb-3 { width:350px; height:350px; background:radial-gradient(circle,rgba(16,185,129,0.2) 0%,transparent 70%); bottom:-5%; left:20%; animation-delay:6s; }
                .stars-layer { position:fixed; inset:0; z-index:0; pointer-events:none; overflow:hidden; }
                .star { position:absolute; border-radius:50%; background:#fff; animation:starTwinkle ease-in-out infinite; }
                #lottie-confetti { position:fixed; inset:0; z-index:5; pointer-events:none; width:100%; height:100%; }
                .ty-card { position:relative; z-index:10; background:rgba(255,255,255,0.04); backdrop-filter:blur(20px); -webkit-backdrop-filter:blur(20px); border:1px solid rgba(255,255,255,0.1); border-radius:32px; padding:56px 52px; max-width:520px; width:90%; text-align:center; box-shadow:0 32px 64px rgba(0,0,0,0.5),inset 0 1px 0 rgba(255,255,255,0.1); animation:fadeUp 0.8s cubic-bezier(0.22,1,0.36,1) 0.3s both; }
                .check-wrap { display:inline-flex; align-items:center; justify-content:center; width:96px; height:96px; background:linear-gradient(135deg,${BRAND_COLOR},#6366f1); border-radius:50%; margin:0 auto 32px; animation:checkPop 0.7s cubic-bezier(0.34,1.56,0.64,1) 0.8s both,ringPulse 2.5s ease-out 1.5s infinite; box-shadow:0 16px 48px rgba(124,58,237,0.5); }
                .check-wrap svg { color:white; }
                .ty-badge { display:inline-flex; align-items:center; gap:6px; background:rgba(16,185,129,0.15); border:1px solid rgba(16,185,129,0.4); border-radius:100px; padding:6px 16px; font-size:12px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:#10b981; margin-bottom:20px; animation:fadeUp 0.6s ease 0.5s both; }
                .ty-badge::before { content:''; width:8px; height:8px; background:#10b981; border-radius:50%; box-shadow:0 0 8px #10b981; animation:starTwinkle 1.2s ease infinite; display:inline-block; }
                .ty-title { font-size:clamp(38px,6vw,58px); font-weight:900; color:#ffffff; letter-spacing:-0.03em; line-height:1.05; margin-bottom:8px; animation:fadeUp 0.6s ease 0.9s both; }
                .ty-title span { background:linear-gradient(135deg,${BRAND_COLOR},#818cf8,#10b981); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
                .ty-sub { font-size:17px; color:rgba(255,255,255,0.55); line-height:1.65; margin-bottom:36px; animation:fadeUp 0.6s ease 1.1s both; }
                .ty-divider { height:1px; background:linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent); margin:0 0 32px; animation:fadeUp 0.6s ease 1.2s both; }
                .ty-stats { display:flex; justify-content:center; gap:32px; margin-bottom:36px; animation:fadeUp 0.6s ease 1.3s both; }
                .ty-stat { text-align:center; }
                .ty-stat-num { font-size:26px; font-weight:800; color:#ffffff; display:block; line-height:1; margin-bottom:4px; }
                .ty-stat-lbl { font-size:11px; color:rgba(255,255,255,0.4); text-transform:uppercase; letter-spacing:0.08em; font-weight:600; }
                .ty-btn { display:inline-flex; align-items:center; justify-content:center; gap:12px; background:linear-gradient(135deg,${BRAND_COLOR} 0%,#6366f1 50%,${BRAND_COLOR} 100%); background-size:200% auto; color:#ffffff !important; padding:18px 44px; border-radius:100px; font-size:16px; font-weight:700; text-decoration:none; transition:transform 0.25s cubic-bezier(0.34,1.56,0.64,1),box-shadow 0.25s ease; animation:btnShimmer 3s linear infinite,btnGlow 2.5s ease-in-out infinite,fadeUp 0.6s ease 1.4s both; letter-spacing:0.01em; position:relative; overflow:hidden; }
                .ty-btn::before { content:''; position:absolute; inset:0; background:linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.25) 50%,transparent 100%); background-size:200% auto; animation:btnShimmer 2.5s linear infinite; border-radius:inherit; }
                .ty-btn:hover { transform:scale(1.06) translateY(-2px); box-shadow:0 0 50px rgba(124,58,237,0.7),0 16px 48px rgba(99,102,241,0.6); }
                .ty-btn:active { transform:scale(0.98); }
                .ty-btn .arrow-icon { animation:arrowBounce 1.2s ease-in-out infinite; }
                .ty-footer { margin-top:28px; font-size:13px; color:rgba(255,255,255,0.3); animation:fadeUp 0.6s ease 1.5s both; }
                .ty-footer a { color:rgba(255,255,255,0.5); text-decoration:underline; transition:color 0.2s; }
                .ty-footer a:hover { color:white; }
              </style>
            </head>
            <body>
              <div class="orb orb-1"></div>
              <div class="orb orb-2"></div>
              <div class="orb orb-3"></div>
              <div class="stars-layer" id="stars-layer"></div>
              <div id="lottie-confetti"></div>
              <div class="ty-card">
                <div class="ty-badge">Submission Confirmed</div>
                <div class="check-wrap">
                  <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <h1 class="ty-title">Thank <span>You!</span></h1>
                <p class="ty-sub">We've received your request and our team of experts<br>will get back to you within <strong style="color:rgba(255,255,255,0.7)">24 hours</strong>.</p>
                <div class="ty-divider"></div>
                <div class="ty-stats">
                  <div class="ty-stat"><span class="ty-stat-num">~1h</span><span class="ty-stat-lbl">Avg. Response</span></div>
                  <div class="ty-stat"><span class="ty-stat-num">98%</span><span class="ty-stat-lbl">Satisfaction</span></div>
                  <div class="ty-stat"><span class="ty-stat-num">5&#9733;</span><span class="ty-stat-lbl">Rated Service</span></div>
                </div>
                <a href="${REDIRECT_URL}" class="ty-btn">
                  Visit Our Website
                  <svg class="arrow-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </a>
                <p class="ty-footer">Need help? <a href="mailto:support@example.com">Contact Support</a></p>
              </div>
              <script>
                (function() {
                  var layer = document.getElementById('stars-layer');
                  for (var i = 0; i < 90; i++) {
                    var s = document.createElement('div');
                    s.className = 'star';
                    var size = Math.random() * 2.5 + 0.5;
                    s.style.cssText = 'width:'+size+'px;height:'+size+'px;left:'+Math.random()*100+'%;top:'+Math.random()*100+'%;opacity:'+(Math.random()*0.6+0.1)+';animation-duration:'+(Math.random()*3+2)+'s;animation-delay:'+Math.random()*5+'s';
                    layer.appendChild(s);
                  }
                })();
                (function() {
                  var anim = lottie.loadAnimation({
                    container: document.getElementById('lottie-confetti'),
                    renderer: 'svg',
                    loop: false,
                    autoplay: true,
                    path: '/assets/thankyou.json'
                  });
                  anim.addEventListener('complete', function() {
                    var el = document.getElementById('lottie-confetti');
                    el.style.transition = 'opacity 1s ease';
                    el.style.opacity = '0';
                    setTimeout(function() { el.style.display = 'none'; }, 1000);
                  });
                })();
              <\/script>
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
