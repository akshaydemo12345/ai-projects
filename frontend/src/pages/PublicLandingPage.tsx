import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { pagesApi } from '@/services/api';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const PublicLandingPage = () => {
  const { "*": splat } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const token = searchParams.get('token') || searchParams.get('previewToken');
  const pgParam = searchParams.get('pg');
  const pageId = searchParams.get('page') || searchParams.get('pageId');

  // Detect thank-you path
  const isThankYouPath = useMemo(() => {
    if (!splat) return false;
    return splat.endsWith('/thank-you') || splat.includes('thank-you');
  }, [splat]);

  const [isThankYouStatus, setIsThankYouStatus] = useState(isThankYouPath || searchParams.get('status') === 'thank-you');
  const [blobUrl, setBlobUrl] = useState<string>('');
  const [thankYouHtml, setThankYouHtml] = useState<string>('');
  const [loadingThankYou, setLoadingThankYou] = useState(false);

  useEffect(() => {
    if (isThankYouPath) setIsThankYouStatus(true);
  }, [isThankYouPath]);

  const resolvedSlug = useMemo(() => {
    if (!splat) return pgParam || '';
    let cleanSplat = splat.split('?')[0].split('#')[0];
    if (cleanSplat.endsWith('/thank-you')) cleanSplat = cleanSplat.replace('/thank-you', '');
    return cleanSplat.startsWith('preview/') ? cleanSplat.replace('preview/', '') : cleanSplat;
  }, [splat, pgParam]);

  const { data: pageResponse, isLoading, error } = useQuery({
    queryKey: ['public-page', pageId || resolvedSlug, token],
    queryFn: () => {
      if (pageId) return pagesApi.getByPageId(pageId, token || undefined);
      return pagesApi.getBySlug(resolvedSlug!, token || undefined);
    },
    enabled: !!pageId || !!resolvedSlug,
    retry: 1
  });

  useEffect(() => {
    if (isThankYouStatus && (pageResponse || resolvedSlug)) {
      const slug = (pageResponse as any)?.slug || resolvedSlug || '';
      if (slug) {
        setLoadingThankYou(true);
        fetch(`${API_URL}/api/thank-you/render/${slug}`)
          .then(r => r.text())
          .then(html => {
            if (html && html.length > 200) setThankYouHtml(html);
          })
          .catch(e => console.error('Error fetching thank you:', e))
          .finally(() => setLoadingThankYou(false));
      }
    }
  }, [isThankYouStatus, pageResponse, resolvedSlug]);

  const buildLeadScript = useCallback((res: any) => {
    const apiBaseUrl = (API_URL || '').replace(/\/+$/, '');
    const pId = res?.meta?._id || res?._id || pageId || '';
    const projId = res?.meta?.projectId || res?.projectId || '';
    const slug = res?.slug || res?.meta?.slug || resolvedSlug || '';

    return `
<script>
!function(){
  var A="${apiBaseUrl}", PI="${pId}", PJ="${projId}", SL="${slug}";

  function doThankYouRedirect(){
    try {
      if(window.parent && window.parent !== window){
        window.parent.postMessage({type:'LEAD_FORM_SUCCESS', slug: SL}, '*');
      }
    } catch(e){}
    var currentUrl = window.parent.location.href.split('?')[0].split('#')[0];
    if(!currentUrl.endsWith('/thank-you')){
      window.parent.location.href = currentUrl + (currentUrl.endsWith('/') ? '' : '/') + 'thank-you';
    }
  }

  function handleFormSubmit(e){
    var f = e.target;
    if(f.tagName!=="FORM") return;
    
    e.preventDefault();
    e.stopImmediatePropagation();
    
    if(f.getAttribute("data-submitting")==="true") return;
    f.setAttribute("data-submitting","true");

    var b=f.querySelector('button[type="submit"]')||f.querySelector("button");
    if(b){b.disabled=true; b.textContent="Processing..."; b.style.opacity="0.6"}

    var data={pageId:PI, projectId:PJ, pageSlug:SL, timestamp:new Date().getTime()};

    f.querySelectorAll('input, select, textarea').forEach(function(el){
      var originalKey = el.name || el.id || el.placeholder || el.type;
      if(!originalKey) return;
      
      var val = el.value?String(el.value).trim():"";
      if(!val) return;

      // 1. Keep the original key for backend normalization
      data[originalKey] = val;

      // 2. Add smart aliases for dashboard recognition
      var searchStr = (originalKey + " " + (el.placeholder || "") + " " + (el.id || "")).toLowerCase();
      if(searchStr.includes('email')) data['email'] = val;
      if(searchStr.includes('phone') || searchStr.includes('tel') || searchStr.includes('contact')) data['phone'] = val;
      if(searchStr.includes('name')) data['name'] = val;
    });

    fetch(A+"/api/leads",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify(data),
      mode:"cors"
    })
    .then(function(r){return r.json()})
    .then(function(r){
      f.reset();
      doThankYouRedirect();
    })
    .catch(function(e){
      doThankYouRedirect();
    });
  }

  document.addEventListener("submit", handleFormSubmit, true);
  
  function cleanup(){
    document.querySelectorAll('form').forEach(function(f){
      f.removeAttribute('onsubmit');
      f.setAttribute('novalidate', 'true');
    });
  }
  cleanup();
  setInterval(cleanup, 2000);
}();
</script>`;
  }, [resolvedSlug, pageId]);

  const documentToWrite = useMemo(() => {
    if (!pageResponse) return '';
    const res = pageResponse as any;
    const meta = res.meta || {};
    let aiHtml = res.landingPageContent || res.data || (typeof res.content === 'string' ? res.content : res.content?.fullHtml) || '';
    let aiCss = res.landingPageStyles || res.styles || (typeof res.content === 'object' ? res.content?.fullCss : '') || '';
    const BRAND_COLOR = res.primaryColor || meta?.primaryColor || '#7c3aed';

    const coreDependencies = `
      <script src="https://cdn.tailwindcss.com"></script>
      <script>
        tailwind.config = { theme: { extend: { colors: { primary: '${BRAND_COLOR}' } } } };
      </script>
      <!-- All possible icon libraries -->
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" />
      
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;700&family=Inter:wght@400;700&family=Outfit:wght@400;700&display=swap" rel="stylesheet">
      <style>
        :root { --primary: ${BRAND_COLOR}; }
        html, body { margin: 0; padding: 0; min-height: 100vh; font-family: 'Inter', sans-serif; background: #fff; color: #1e293b; }
        input, select, textarea { border: 1px solid #cbd5e1 !important; border-radius: 10px !important; padding: 14px 18px !important; width: 100%; margin-bottom: 20px; display: block; box-sizing: border-box; font-size: 16px; transition: border-color 0.2s; }
        input:focus { border-color: ${BRAND_COLOR} !important; outline: none !important; box-shadow: 0 0 0 4px ${BRAND_COLOR}15; }
        label { display: block; font-weight: 600; margin-bottom: 8px; font-size: 14px; color: #475569; }
        form { width: 100%; max-width: 100%; }
        ${aiCss}
      </style>
      <script>
        !function() {
          function reveal() {
            var reveals = document.querySelectorAll(".reveal-on-scroll");
            for (var i = 0; i < reveals.length; i++) {
              var windowHeight = window.innerHeight;
              var elementTop = reveals[i].getBoundingClientRect().top;
              var elementVisible = 50;
              if (elementTop < windowHeight - elementVisible || elementTop < 100) {
                reveals[i].classList.add("revealed");
              }
            }
          }
          window.addEventListener("scroll", reveal);
          window.addEventListener("resize", reveal);
          document.addEventListener("DOMContentLoaded", reveal);
          // Run repeatedly on load to prevent any race condition
          var intervals = [50, 100, 300, 500, 1000, 1500];
          intervals.forEach(function(t) { setTimeout(reveal, t); });
          // Failsafe: reveal everything after 2 seconds so page is NEVER blank
          setTimeout(function() {
            document.querySelectorAll(".reveal-on-scroll").forEach(function(el) {
              el.classList.add("revealed");
            });
          }, 2000);
        }();
      </script>
    `;

    const leadScript = buildLeadScript(res);
    let cleanHtml = aiHtml.replace(/```html/gi, '').replace(/```/g, '').trim();
    if (!cleanHtml) return '';

    // Keep AI-generated scripts and events fully intact so interactive elements (FAQ accordions, menus, sliders) work natively!
    // cleanHtml = cleanHtml.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, '');
    // cleanHtml = cleanHtml.replace(/\s*on[a-z]+\s*=\s*["'][\s\S]*?["']/gi, '');

    if (cleanHtml.toLowerCase().includes('<html')) {
      let doc = cleanHtml;
      if (doc.toLowerCase().includes('<head')) doc = doc.replace(/<head[^>]*>/i, m => m + coreDependencies);
      else doc = doc.replace(/<html[^>]*>/i, m => m + '<head>' + coreDependencies + '</head>');
      return doc.replace(/<\/body>/i, leadScript + '</body>');
    } else {
      return `<!DOCTYPE html><html><head><meta charset="utf-8">${coreDependencies}</head><body>${cleanHtml}${leadScript}</body></html>`;
    }
  }, [pageResponse, buildLeadScript]);

  useEffect(() => {
    if (documentToWrite) {
      const blob = new Blob([documentToWrite], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      setBlobUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [documentToWrite]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'LEAD_FORM_SUCCESS') {
        const slug = (pageResponse as any)?.slug || resolvedSlug;
        navigate(`/${slug}/thank-you`);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [pageResponse, resolvedSlug, navigate]);

  if (isLoading || (isThankYouStatus && loadingThankYou)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
        <p className="text-slate-600 font-medium">Loading...</p>
      </div>
    );
  }

  if (isThankYouStatus) {
    if (thankYouHtml) {
      return (
        <div className="w-full h-screen bg-white">
          <iframe srcDoc={thankYouHtml} title="Thank You" className="w-full h-full border-none" />
        </div>
      );
    }
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white text-center p-6">
        <CheckCircle2 className="h-16 w-16 text-emerald-500 mb-6" />
        <h1 className="text-3xl font-bold mb-4 text-slate-900">Success!</h1>
        <p className="text-lg text-slate-600">Thank you for your submission.</p>
        <button onClick={() => navigate(`/${resolvedSlug}`)} className="mt-8 px-8 py-3 bg-primary text-white rounded-xl font-bold">Back to Site</button>
      </div>
    );
  }

  return (
    <div className="w-full h-screen overflow-hidden bg-white">
      <iframe key={blobUrl} src={blobUrl} title="Preview" className="w-full h-full border-none" />
    </div>
  );
};

export default PublicLandingPage;
