import { useEffect, useRef, useState, useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { pagesApi } from '@/services/api';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const PublicLandingPage = () => {
  const { "*": splat } = useParams();
  const [searchParams] = useSearchParams();
  
  const token = searchParams.get('token') || searchParams.get('previewToken');
  const pgParam = searchParams.get('pg');
  const pageId = searchParams.get('page') || searchParams.get('pageId');
  const isThankYouStatus = searchParams.get('status') === 'thank-you' || window.location.hash.includes('status=thank-you');

  const resolvedSlug = useMemo(() => {
    if (!splat) return pgParam || '';
    const cleanSplat = splat.split('?')[0].split('#')[0];
    return cleanSplat.startsWith('preview/') ? cleanSplat.replace('preview/', '') : cleanSplat;
  }, [splat, pgParam]);

  const [blobUrl, setBlobUrl] = useState<string>('');

  const { data: pageResponse, isLoading, error } = useQuery({
    queryKey: ['public-page', pageId || resolvedSlug, token],
    queryFn: () => {
      if (pageId) return pagesApi.getByPageId(pageId, token || undefined);
      return pagesApi.getBySlug(resolvedSlug!, token || undefined);
    },
    enabled: !!pageId || !!resolvedSlug,
    retry: 1,
    staleTime: 0,
    gcTime: 0
  });

  const documentToWrite = useMemo(() => {
    if (!pageResponse) return '';
    const res = pageResponse as any;
    const meta = res.meta || {};
    
    let aiHtml = res.landingPageContent || res.data || (typeof res.content === 'string' ? res.content : res.content?.fullHtml) || '';
    let aiCss = res.landingPageStyles || res.styles || (typeof res.content === 'object' ? res.content?.fullCss : '') || '';
    
    const BRAND_COLOR = res.primaryColor || meta?.primaryColor || '#7c3aed';
    const SECONDARY_COLOR = res.secondaryColor || meta?.secondaryColor || '#4f46e5';
    const renderId = Date.now();

    const coreDependencies = `
      <script src="https://cdn.tailwindcss.com?v=${renderId}"></script>
      <script>
        tailwind.config = { theme: { extend: { colors: { primary: '${BRAND_COLOR}', secondary: '${SECONDARY_COLOR}' } } } };
        window.onload = () => { if(window.tailwind) tailwind.track(); };
      </script>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css?v=${renderId}" />
      <style>
        :root { --primary: ${BRAND_COLOR}; --secondary: ${SECONDARY_COLOR}; }
        html, body { margin: 0; padding: 0; min-height: 100vh; font-family: 'Inter', sans-serif; background-color: #fff; }
        img { max-width: 100%; height: auto; }
        ${aiCss}
      </style>
    `;

    let cleanHtml = aiHtml.replace(/```html/gi, '').replace(/```/g, '').trim();
    if (!cleanHtml) return '';

    if (cleanHtml.toLowerCase().includes('<html')) {
      let doc = cleanHtml;
      if (doc.toLowerCase().includes('<head')) {
        doc = doc.replace(/<head[^>]*>/i, m => m + coreDependencies);
      } else {
        doc = doc.replace(/<html[^>]*>/i, m => m + '<head>' + coreDependencies + '</head>');
      }
      return doc;
    } else {
      return `<!DOCTYPE html><html><head><meta charset="utf-8">${coreDependencies}</head><body>${cleanHtml}</body></html>`;
    }
  }, [pageResponse]);

  useEffect(() => {
    if (documentToWrite) {
      const blob = new Blob([documentToWrite], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      setBlobUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [documentToWrite]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
        <p className="text-slate-600 font-medium">Fetching design...</p>
      </div>
    );
  }

  // --- PREMIUM THANK YOU SCREEN ---
  if (isThankYouStatus) {
    const res = pageResponse as any;
    const primaryColor = res?.primaryColor || '#7c3aed';
    
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 p-6 text-center text-white overflow-hidden relative">
        {/* Animated Background Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/20 blur-[120px] animate-pulse"></div>
        
        <div className="relative z-10 max-w-lg glass p-12 rounded-[2.5rem] border border-white/10 shadow-2xl scale-in-center">
          <div className="mb-8 flex justify-center">
            <div className="p-4 bg-primary/10 rounded-full">
              <CheckCircle2 className="h-16 w-16 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-extrabold mb-4 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            Success!
          </h1>
          <p className="text-xl text-slate-400 mb-8 leading-relaxed">
            Thank you for reaching out. Your details have been securely sent to our team. We'll be in touch shortly.
          </p>
          <button 
            onClick={() => {
              const url = new URL(window.location.href);
              url.searchParams.delete('status');
              window.location.href = url.origin + url.pathname + url.search;
            }}
            className="w-full py-4 bg-primary text-white rounded-2xl font-bold hover:brightness-110 transition-all shadow-lg shadow-primary/25"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const isPreviewMode = window.location.pathname.startsWith('/preview/') || !!token;
  const status = (pageResponse as any)?.meta?.status || (pageResponse as any)?.status;
  const hasContent = !!documentToWrite;

  if (error || !hasContent || (!isPreviewMode && status === 'archived')) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Design Not Found</h1>
        <p className="text-slate-600 mb-6">Error: {error ? (error as any).message : (resolvedSlug ? "Empty Content for " + resolvedSlug : "No Slug Provided")}</p>
        <button onClick={() => window.location.reload()} className="px-6 py-2 bg-primary text-white rounded-lg">Retry Reload</button>
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
