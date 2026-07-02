import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { pagesApi } from '@/services/api';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Helper: convert hex color to "R, G, B" string for use in rgba()
const hexToRgbStr = (hex: string): string => {
  const c = hex.replace('#', '');
  if (c.length === 3) {
    return `${parseInt(c[0] + c[0], 16)}, ${parseInt(c[1] + c[1], 16)}, ${parseInt(c[2] + c[2], 16)}`;
  }
  return `${parseInt(c.substring(0, 2), 16)}, ${parseInt(c.substring(2, 4), 16)}, ${parseInt(c.substring(4, 6), 16)}`;
};

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
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false
  });

  useEffect(() => {
    if (isThankYouStatus && (pageResponse || resolvedSlug)) {
      const slug = (pageResponse as any)?.slug || resolvedSlug || '';
      if (slug) {
        setLoadingThankYou(true);
        const isPreviewMode = window.location.pathname.startsWith('/preview');
        const queryParams = isPreviewMode ? '?preview=true' : '';
        fetch(`${API_URL}/api/thank-you/render/${slug}${queryParams}`)
          .then(r => r.text())
          .then(html => {
            if (html && html.length > 200) {
              let htmlWithBase = html.replace(/href="\//g, `href="${window.location.origin}/`);
              htmlWithBase = htmlWithBase.replace(/<a /g, '<a target="_parent" ');
              setThankYouHtml(htmlWithBase);
            }
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

    // Prevent actual API submission AND validation in preview mode
    if (window.parent && window.parent.location.pathname.includes('/preview')) {
      var existingModal = document.getElementById('preview-mode-modal');
      if (existingModal) existingModal.remove();
      var modalHtml = '<div id="preview-mode-modal" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 999999; display: flex; align-items: center; justify-content: center; background: rgba(15, 23, 42, 0.7); backdrop-filter: blur(8px); opacity: 0; animation: pModalFadeIn 0.3s forwards; font-family: system-ui, -apple-system, sans-serif;">' +
        '<div style="background: #ffffff; width: 90%; max-width: 400px; border-radius: 20px; padding: 32px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); text-align: center; transform: scale(0.95); animation: pModalScaleUp 0.3s forwards;">' +
          '<div style="width: 60px; height: 60px; background: #FEF2F2; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;">' +
            '<svg style="width: 30px; height: 30px; color: #EF4444;" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>' +
          '</div>' +
          '<h3 style="font-size: 20px; font-weight: 700; color: #0F172A; margin: 0 0 12px; letter-spacing: -0.02em;">Preview Mode Active</h3>' +
          '<p style="font-size: 15px; color: #64748B; margin: 0 0 28px; line-height: 1.5;">Form submissions are disabled in preview mode. Publish your page to accept real submissions.</p>' +
          '<button onclick="document.getElementById(&apos;preview-mode-modal&apos;).remove()" style="width: 100%; background: #0F172A; color: #ffffff; border: none; padding: 14px; border-radius: 12px; font-size: 15px; font-weight: 600; cursor: pointer; transition: background 0.2s;" onmouseover="this.style.background=&apos;#1E293B&apos;" onmouseout="this.style.background=&apos;#0F172A&apos;">Got it, close</button>' +
        '</div>' +
        '<style>@keyframes pModalFadeIn { to { opacity: 1; } } @keyframes pModalScaleUp { to { transform: scale(1); } }</style>' +
      '</div>';
      document.body.insertAdjacentHTML('beforeend', modalHtml);
      return;
    }
    
    var isValid = true;
    f.querySelectorAll('input[required], textarea[required]').forEach(function(input) {
      if (!input.dataset.valSetup) {
        input.dataset.valSetup = 'true';
        input.addEventListener('input', function() {
          if (input.value.trim()) {
            input.style.outline = '2px solid #22c55e';
            input.style.outlineOffset = '1px';
            input.style.borderColor = '#22c55e';
            if (input.nextElementSibling && input.nextElementSibling.classList.contains('val-error')) {
              input.nextElementSibling.style.display = 'none';
            }
          } else {
            input.style.outline = '2px solid #ef4444';
            input.style.outlineOffset = '1px';
            input.style.borderColor = '#ef4444';
            if (input.nextElementSibling && input.nextElementSibling.classList.contains('val-error')) {
              input.nextElementSibling.style.display = 'block';
            }
          }
        });
      }

      if (!input.value.trim()) {
        isValid = false;
        input.style.outline = '2px solid #ef4444';
        input.style.outlineOffset = '1px';
        input.style.borderColor = '#ef4444';
        
        // Dynamically wrap input if it's a direct child of a grid/flex (fixes error placement)
        if (!input.parentElement.classList.contains('val-wrapper')) {
            var wrapper = document.createElement('div');
            wrapper.className = 'val-wrapper';
            wrapper.style.display = 'flex';
            wrapper.style.flexDirection = 'column';
            wrapper.style.width = '100%';
            
            var computed = window.getComputedStyle(input);
            if (window.getComputedStyle(input.parentElement).display === 'grid') {
                wrapper.style.gridColumn = input.style.gridColumn || computed.gridColumn;
                wrapper.style.gridRow = input.style.gridRow || computed.gridRow;
            }
            
            input.parentNode.insertBefore(wrapper, input);
            wrapper.appendChild(input);
        }

        if (!input.nextElementSibling || !input.nextElementSibling.classList.contains('val-error')) {
          var fieldName = input.getAttribute('placeholder') || input.getAttribute('name') || 'This field';
          var err = document.createElement('span');
          err.className = 'val-error';
          err.style.color = '#ef4444';
          err.style.fontSize = '12px';
          err.style.display = 'block';
          err.style.marginTop = '4px';
          err.textContent = fieldName + ' is required';
          input.parentNode.insertBefore(err, input.nextSibling);
        } else {
          input.nextElementSibling.style.display = 'block';
        }
      } else {
        input.style.outline = '2px solid #22c55e';
        input.style.outlineOffset = '1px';
        input.style.borderColor = '#22c55e';
      }
    });
    
    if (!isValid) return;

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
    const BRAND_PRIMARY = res.primaryColor || meta?.primaryColor || '#7c3aed';
    const BRAND_SECONDARY = res.secondaryColor || meta?.secondaryColor || '#6366f1';

    // ─── Replace ALL placeholders in both HTML and CSS ───
    // IMPORTANT: RGB placeholders must use actual "R, G, B" strings, not hex!
    // Otherwise rgba(SECONDARY_RGB_PLACEHOLDER, 0.2) breaks with rgba(#1a3a2e, 0.2)
    let pRgb = '124, 58, 237';
    let sRgb = '99, 102, 241';
    try { pRgb = hexToRgbStr(BRAND_PRIMARY); } catch (e) { }
    try { sRgb = hexToRgbStr(BRAND_SECONDARY); } catch (e) { }

    const applyPlaceholders = (str: string) => str
      .replace(/PRIMARY_COLOR_PLACEHOLDER/g, BRAND_PRIMARY)
      .replace(/SECONDARY_COLOR_PLACEHOLDER/g, BRAND_SECONDARY)
      .replace(/PRIMARY_RGB_PLACEHOLDER/g, pRgb)
      .replace(/SECONDARY_RGB_PLACEHOLDER/g, sRgb)
      // Also clean up any circular var() references that may have been saved
      .replace(/:\s*var\(--primary\)/g, `: ${BRAND_PRIMARY}`)
      .replace(/:\s*var\(--secondary\)/g, `: ${BRAND_SECONDARY}`)
      .replace(/LOGO_PLACEHOLDER/g, res.logoUrl ? `<img src="${res.logoUrl}" alt="Logo" style="height:40px;object-fit:contain;" />` : '<span style="font-weight:700;">Your Brand</span>')
      .replace(/PROJECT_NAME_PLACEHOLDER/g, res.metaTitle || res.title || 'Your Brand');

    aiHtml = applyPlaceholders(aiHtml);
    aiCss = applyPlaceholders(aiCss);

    // ─── Also replace any remaining var(--primary) references with real color fallback ───
    const BRAND_COLOR = BRAND_PRIMARY;

    let extractedTitle = res.metaTitle || res.title || 'Your Brand';
    let extractedFavicon = '';

    if (res.content && res.content.fullHtml) {
      const titleMatch = res.content.fullHtml.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
      if (titleMatch) extractedTitle = titleMatch[1].trim();

      const faviconMatch = res.content.fullHtml.match(/<link[^>]*rel="icon"[^>]*href="([^"]*)"[^>]*>/i);
      if (faviconMatch) extractedFavicon = `<link rel="icon" href="${faviconMatch[1]}"/>`;
    }

    const coreDependencies = `
      <base href="${window.location.origin}/" />
      <title>${extractedTitle}</title>
      ${extractedFavicon}
      ${aiHtml.includes('swiper') ? `
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" />
      <script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
      <style id="swiper-custom-fixes">
        .swiper-button-next:after, .swiper-button-prev:after { content: '' !important; display: block !important; width: 100%; height: 100%; background-color: var(--swiper-navigation-color, currentColor); -webkit-mask-size: contain; -webkit-mask-position: center; -webkit-mask-repeat: no-repeat; mask-size: contain; mask-position: center; mask-repeat: no-repeat; }
        .swiper-button-prev:after, .swiper-rtl .swiper-button-next:after { -webkit-mask-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M15 18l-6-6 6-6'/%3E%3C/svg%3E"); mask-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M15 18l-6-6 6-6'/%3E%3C/svg%3E"); }
        .swiper-button-next:after, .swiper-rtl .swiper-button-prev:after { -webkit-mask-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M9 18l6-6-6-6'/%3E%3C/svg%3E"); mask-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M9 18l6-6-6-6'/%3E%3C/svg%3E"); }
        .swiper-pagination-bullet { background: #000 !important; opacity: 0.5; }
        .swiper-pagination-bullet-active { background: var(--primary) !important; opacity: 1; }
      </style>
      <script id="swiper-global-init">
        (function() {
          function initAllSwipers() {
            if (typeof window.Swiper === 'undefined') {
              setTimeout(initAllSwipers, 100);
              return;
            }
            document.querySelectorAll('.swiper-container').forEach(function(self) {
              if (self.__swiper) return;
              
              // Clean up remnants from GrapesJS editor state so Swiper can init fresh
              self.classList.remove('swiper-initialized', 'swiper-horizontal', 'swiper-vertical', 'swiper-backface-hidden');
              self.querySelectorAll('.swiper-slide-duplicate').forEach(function(dup) { dup.remove(); });
              self.querySelectorAll('.swiper-slide').forEach(function(s) {
                 const el = s;
                 el.classList.remove('swiper-slide-active', 'swiper-slide-next', 'swiper-slide-prev', 'swiper-slide-visible');
                 el.removeAttribute('data-swiper-slide-index');
                 el.style.opacity = '';
                 el.style.transform = '';
                 el.style.width = '';
                 el.style.height = '';
                 el.style.margin = '';
              });
              self.querySelectorAll('.swiper-wrapper').forEach(function(w) {
                 w.removeAttribute('style');
              });
              var paginationEl = self.querySelector('.swiper-pagination');
              if (paginationEl) paginationEl.innerHTML = '';

              var getAttr = function(k) { 
                if (self.dataset && self.dataset[k] !== undefined) return self.dataset[k];
                var kebab = k.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
                return self.getAttribute(k) || self.getAttribute('data-' + kebab) || self.getAttribute('data-' + k) || null; 
              };
              var bool = function(k) { var v = getAttr(k); return v !== null && v !== 'false'; };
              var num = function(k, fb) { return parseFloat(getAttr(k) || String(fb)) || fb; };
              var props = {
                observer: true, observeParents: true,
                direction: bool('vertical') ? 'vertical' : 'horizontal',
                loop: bool('loop') !== false ? true : false,
                freeMode: bool('freeMode'), autoHeight: bool('autoHeight'),
                initialSlide: num('initialSlide', 0), speed: num('speed', 300), effect: getAttr('effect') || 'slide',
                parallax: bool('parallax'), 
                slidesPerView: num('slidesPerView', 2),
                spaceBetween: num('spaceBetween', 30),
                slidesPerGroup: num('slidesPerGroup', 1),
                centeredSlides: bool('centeredSlides'), rewind: bool('rewind'),
                keyboard: bool('keyboard') ? { enabled: true } : false,
                mousewheel: bool('mousewheel'), grabCursor: bool('grabCursor'),
                lazy: bool('lazy') ? { loadPrevNext: true } : false,
              };
              if (bool('autoplay')) {
                props.autoplay = {
                  delay: num('autoplayDelay', 3000), disableOnInteraction: bool('autoplayDisableOnInteraction'),
                  pauseOnMouseEnter: bool('autoplayPauseOnMouseEnter'), reverseDirection: bool('autoplayReverseDirection')
                };
              }
              if (bool('navigation')) {
                props.navigation = { nextEl: self.querySelector('.swiper-button-next'), prevEl: self.querySelector('.swiper-button-prev') };
              }
              props.pagination = {
                el: self.querySelector('.swiper-pagination'), type: getAttr('pagination') || 'bullets',
                clickable: true
              };
              if (bool('scrollbar')) {
                props.scrollbar = { el: self.querySelector('.swiper-scrollbar'), hide: true };
              }
              props.breakpoints = {
                320: { slidesPerView: 1, spaceBetween: 10 },
                768: { slidesPerView: props.slidesPerView > 1 ? 2 : 1, spaceBetween: 20 },
                1024: { slidesPerView: props.slidesPerView, spaceBetween: props.spaceBetween }
              };
              props.slidesPerView = 1;
              self.__swiper = new window.Swiper(self, props);
            });
          }
          if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initAllSwipers);
          } else {
            initAllSwipers();
          }
        })();
      </script>` : ''}
      ${aiHtml.includes('<details') ? `
      <style id="faq-custom-fixes">
        details { cursor: pointer; }
        summary { list-style: none; position: relative; font-weight: 600; padding-right: 24px; }
        summary::-webkit-details-marker { display: none; }
        summary:not([class*="faq"])::after { content: '+'; position: absolute; right: 0; top: 50%; transform: translateY(-50%); transition: transform 0.3s ease; font-weight: 400; font-size: 1.2rem; }
        details[open] summary:not([class*="faq"])::after { transform: translateY(-50%) rotate(45deg); }
        details:not([class*="faq"]) p { margin-top: 10px; color: var(--text-muted, #4b5563); }
      </style>` : ''}
      <script src="https://cdn.tailwindcss.com"></script>
      <script>
        tailwind.config = { theme: { extend: { colors: { primary: '${BRAND_PRIMARY}', secondary: '${BRAND_SECONDARY}' } } } };
      </script>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" />
      
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@300;400;600;700&family=Fraunces:ital,wght@0,100..900;1,100..900&family=DM+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
      <style>
        :root {
          --primary: ${BRAND_PRIMARY};
          --secondary: ${BRAND_SECONDARY};
          --accent: ${BRAND_SECONDARY};
          --gold: ${BRAND_PRIMARY};
          --forest: ${BRAND_PRIMARY};
          --btn-bg: ${BRAND_PRIMARY};
          --btn-text: #ffffff;
          --paper: #f7f4ef;
          --mist: #e8e4dc;
          --ink: #0a0a0a;
          --white: #ffffff;
          --button-gradient: linear-gradient(135deg, ${BRAND_PRIMARY}, ${BRAND_SECONDARY});
        }
        html, body { margin: 0; padding: 0; min-height: 100vh; font-family: 'Inter', sans-serif; background: #fff; color: #1e293b; overflow-x: hidden; }
        form:not([class*="form"]) input, form:not([class*="form"]) select, form:not([class*="form"]) textarea { border: 1px solid #cbd5e1; border-radius: 10px; padding: 14px 18px; width: 100%; margin-bottom: 20px; display: block; box-sizing: border-box; font-size: 16px; transition: border-color 0.2s; }
        form:not([class*="form"]) input:focus { border-color: ${BRAND_PRIMARY}; outline: none; box-shadow: 0 0 0 4px ${BRAND_PRIMARY}15; }
        label { display: block; font-weight: 600; margin-bottom: 8px; font-size: 14px; color: #475569; }
        form { width: 100%; max-width: 100%; }
        .float-badge { z-index: 1 !important; }
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
            
            // Counter animation
            var counters = document.querySelectorAll("[data-count]");
            for (var j = 0; j < counters.length; j++) {
              var counter = counters[j];
              var cTop = counter.getBoundingClientRect().top;
              if (cTop < window.innerHeight - 50) {
                if (!counter.classList.contains("counted")) {
                  counter.classList.add("counted");
                  let target = parseInt(counter.getAttribute("data-count") || "0", 10);
                  let suffix = counter.getAttribute("data-suffix") || "";
                  let currentCount = 0;
                  let increment = Math.ceil(target / 40);
                  if (target > 0) {
                    let interval = setInterval((function(c, t, inc, suf) {
                      return function() {
                        currentCount += inc;
                        if (currentCount >= t) {
                          currentCount = t;
                          clearInterval(interval);
                        }
                        c.innerText = currentCount + suf;
                      };
                    })(counter, target, increment, suffix), 40);
                  }
                }
              }
            }
            
            // To-top button logic (fallback for all templates)
            var toTopBtn = document.getElementById('toTop') || document.querySelector('.to-top');
            if (toTopBtn) {
              if (window.scrollY > 200) {
                toTopBtn.classList.add('show');
                toTopBtn.style.opacity = '1';
                toTopBtn.style.transform = 'translateY(0)';
              } else {
                toTopBtn.classList.remove('show');
                toTopBtn.style.opacity = '0';
                toTopBtn.style.transform = 'translateY(20px)';
              }
              // Add click listener if not already added
              if (!toTopBtn.hasAttribute('data-click-bound')) {
                toTopBtn.setAttribute('data-click-bound', 'true');
                toTopBtn.addEventListener('click', function() {
                  window.scrollTo({top: 0, behavior: 'smooth'});
                });
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

          // ─── Tab interaction (law01 and any tab-based template) ───
          function initTabs() {
            // Enable JS-driven styles (animate-up, tab CSS etc)
            document.body.classList.add('js-enabled');

            // Make all animate-up/animate-fade elements visible via IntersectionObserver
            if ('IntersectionObserver' in window) {
              var animObserver = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                  if (entry.isIntersecting) entry.target.classList.add('in-view');
                });
              }, { threshold: 0.1 });
              document.querySelectorAll('.animate-up, .animate-fade').forEach(function(el) {
                animObserver.observe(el);
              });
              // Also trigger on scroll
              setTimeout(function() {
                document.querySelectorAll('.animate-up, .animate-fade').forEach(function(el) {
                  var rect = el.getBoundingClientRect();
                  if (rect.top < window.innerHeight) el.classList.add('in-view');
                });
              }, 200);
            } else {
              document.querySelectorAll('.animate-up, .animate-fade').forEach(function(el) {
                el.classList.add('in-view');
              });
            }

            // Tab switching — index-based, works with any tab structure
            document.querySelectorAll('.tabs-container').forEach(function(container) {
              var allTabs = Array.from(container.querySelectorAll('.tab-item'));
              var allPanels = Array.from(container.querySelectorAll('.tab-content-box'));
              if (!allTabs.length) return;

              // Ensure first tab is active if none are marked active
              var hasActive = allPanels.some(function(p) { return p.classList.contains('active'); });
              if (!hasActive) {
                allTabs[0].classList.add('active');
                if (allPanels[0]) allPanels[0].classList.add('active');
              }

              allTabs.forEach(function(tabEl, index) {
                tabEl.style.cursor = 'pointer';
                tabEl.addEventListener('click', function(e) {
                  allTabs.forEach(function(t) { 
                    t.classList.remove('active'); 
                    t.style.borderBottomColor = 'transparent';
                    t.style.color = '#4b5563';
                  });
                  allPanels.forEach(function(p) { 
                    p.classList.remove('active'); 
                    p.style.display = 'none';
                  });
                  tabEl.classList.add('active');
                  tabEl.style.borderBottomColor = 'var(--primary, #6366f1)';
                  tabEl.style.color = 'var(--primary, #6366f1)';
                  if (allPanels[index]) {
                    allPanels[index].classList.add('active');
                    allPanels[index].style.display = 'block';
                  }
                });
              });
            });

            // ─── Custom FAQ toggles (e.g. Travel template & AI generation) ───
            document.addEventListener('click', function(e) {
              const faqHead = e.target.closest('.faq-head, .v2-faq-summary, .accordion-header');
              if (faqHead && !faqHead.closest('details')) {
                const item = faqHead.closest('.faq-item, .accordion-item');
                if (item) {
                  const allItems = document.querySelectorAll('.faq-item, .accordion-item');
                  
                  const content = item.querySelector('.faq-body, .accordion-content');
                  const icon = faqHead.querySelector('.accordion-icon, .fa-chevron-down');
                  const isOpen = content && !content.classList.contains('hidden');

                  allItems.forEach(function(el) {
                    if (el !== item) {
                      el.classList.remove('active');
                      const c = el.querySelector('.faq-body, .accordion-content');
                      if (c) c.classList.add('hidden');
                      const i = el.querySelector('.accordion-icon, .fa-chevron-down');
                      if (i) i.classList.remove('rotate-180');
                    }
                  });
                  item.classList.toggle('active');
                  
                  if (!isOpen && content) {
                    content.classList.remove('hidden');
                    if (icon) icon.classList.add('rotate-180');
                  } else if (isOpen && content) {
                    content.classList.add('hidden');
                    if (icon) icon.classList.remove('rotate-180');
                  }
                }
              }

              // ─── Custom Dropdowns (e.g. Travel template) ───
              const dropdownToggle = e.target.closest('.dropdown-toggle');
              if (dropdownToggle) {
                e.stopPropagation();
                dropdownToggle.classList.toggle('active');
                const menu = dropdownToggle.parentElement.querySelector('.dropdown-menu');
                if (menu) menu.classList.toggle('active');
              } else {
                document.querySelectorAll('.dropdown-toggle, .dropdown-menu').forEach(function(el) {
                  el.classList.remove('active');
                });
              }
            });
          }

          if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initTabs);
          } else {
            initTabs();
          }
        }();
      </script>
    `;

    const leadScript = buildLeadScript(res);
    let cleanHtml = aiHtml.replace(/```html/gi, '').replace(/```/g, '').trim();
    if (!cleanHtml) {
      return `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;background:#fff;color:#333;margin:0;"><div><h2 style="margin-bottom:10px;">Page is empty</h2><p>Please open this page in the Editor to generate or add content.</p></div></body></html>`;
    }

    // ── SANITIZE CORRUPTED SWIPER DOM ──
    try {
      const p = new DOMParser();
      const d = p.parseFromString(cleanHtml, 'text/html');
      d.querySelectorAll('.swiper-slide-duplicate').forEach(el => el.remove());
      d.querySelectorAll('.swiper-slide').forEach(s => {
        const el = s as HTMLElement;
        if (el.style) {
          el.style.height = '';
          el.style.opacity = '';
          el.style.transform = '';
          el.style.width = '';
          el.style.margin = '';
        }
        el.classList.remove('swiper-slide-active', 'swiper-slide-next', 'swiper-slide-prev', 'swiper-slide-visible');
        el.removeAttribute('data-swiper-slide-index');
      });
      d.querySelectorAll('.swiper-wrapper').forEach(w => (w as HTMLElement).removeAttribute('style'));
      d.querySelectorAll('.swiper-container').forEach(c => {
        c.classList.remove('swiper-initialized', 'swiper-horizontal', 'swiper-vertical', 'swiper-backface-hidden');
        c.setAttribute('data-slides-per-view', '2');
        c.setAttribute('data-mobile-breakpoint', 'true');
        c.setAttribute('data-tablet-breakpoint', 'true');
      });
      cleanHtml = d.body.innerHTML;
    } catch (e) { }

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

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white p-6 text-center">
        <AlertCircle className="h-16 w-16 text-red-500 mb-6" />
        <h1 className="text-3xl font-bold mb-4 text-slate-900">Page Not Found</h1>
        <p className="text-lg text-slate-600 max-w-md">
          The page you are looking for does not exist, or you need a valid preview token to view this draft.
        </p>
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