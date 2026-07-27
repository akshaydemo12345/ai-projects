import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import grapesjs from 'grapesjs';
import type { Editor } from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';
import grapesjsPresetWebpage from 'grapesjs-preset-webpage';
// @ts-ignore
import grapesjsBlocksBasic from 'grapesjs-blocks-basic';
import JSZip from 'jszip';
// Swiper v12 — named export
import { Swiper as SwiperClass } from 'swiper/bundle';


import './grapes-custom.css';
import { ArrowLeft, X, Copy, CheckCircle2 } from 'lucide-react';
import { projectsApi, pagesApi, aiApi, Project, LandingPage } from '../../services/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { copyToClipboard } from '@/lib/utils';
import BlocksPanel from './BlocksPanel';
import GlobalStylesPanel from './GlobalStylesPanel';
import { ThankYouEditorPanel } from '../thank-you/ThankYouEditorPanel';
import { BLOCK_DEFS } from './blockDefs';
import Pickr from "@simonwep/pickr";
import "@simonwep/pickr/dist/themes/monolith.min.css";

const hexToRgbStr = (hex: string) => {
  const c = hex.replace('#', '');
  if (c.length === 3) {
    return `${parseInt(c[0] + c[0], 16)}, ${parseInt(c[1] + c[1], 16)}, ${parseInt(c[2] + c[2], 16)}`;
  }
  return `${parseInt(c.substring(0, 2), 16)}, ${parseInt(c.substring(2, 4), 16)}, ${parseInt(c.substring(4, 6), 16)}`;
};

const GrapesEditor = () => {
  const { projectId: projId, pageId } = useParams<{ projectId: string, pageId: string }>();
  const queryClient = useQueryClient();
  const editorRef = useRef<Editor | null>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { data: project, isLoading: projectLoading } = useQuery({
    queryKey: ['project', projId],
    queryFn: () => projectsApi.getById(projId!),
    enabled: !!projId,
  });

  const { data: page, isLoading: pageLoading } = useQuery({
    queryKey: ['page', projId, pageId],
    queryFn: () => pagesApi.getById(projId!, pageId!),
    enabled: !!projId && !!pageId,
  });

  const updatePageMutation = useMutation({
    mutationFn: (data: Partial<LandingPage>) => pagesApi.update(projId!, pageId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['page', projId, pageId] });
      queryClient.invalidateQueries({ queryKey: ['project', projId] });
    }
  });

  const [codeView, setCodeView] = useState(false);
  const [htmlCode, setHtmlCode] = useState('');
  const [cssCode, setCssCode] = useState('');
  const [activeDevice, setActiveDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const initialMode = searchParams.get('mode') === 'thankyou' ? 'thank-you' : 'landing';
  const [leftTab, setLeftTab] = useState<'blocks' | 'theme' | 'layers' | 'ai' | 'seo' | 'thank-you' | 'icons'>(initialMode === 'thank-you' ? 'thank-you' : 'blocks');
  const [rightTab, setRightTab] = useState<'styles' | 'traits'>('styles');
  const [mode, setMode] = useState<'landing' | 'thank-you'>(initialMode);

  const modeRef = useRef(mode);
  useEffect(() => { modeRef.current = mode; }, [mode]);

  // AI Prompt
  const [aiOpen, setAiOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [editAiOpen, setEditAiOpen] = useState(false);
  const [editAiPrompt, setEditAiPrompt] = useState('');

  // AI Chat Assistant
  const [chatOpen, setChatOpen] = useState(false);

  const WELCOME_MSG = { role: 'ai' as const, content: "Hi! How can I help you today? 😊" };

  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'ai', content: string, undoData?: any }[]>(() => {
    try {
      const saved = localStorage.getItem(`ai_chat_messages_${pageId}`);
      return saved ? JSON.parse(saved) : [WELCOME_MSG];
    } catch { return [WELCOME_MSG]; }
  });
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // AI Change History — persisted in localStorage per page
  const [aiHistory, setAiHistory] = useState<{ id: string; timestamp: string; prompt: string; element: string; summary: string }[]>(() => {
    try {
      const saved = localStorage.getItem(`ai_history_${pageId}`);
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [showHistory, setShowHistory] = useState(false);

  // Persist aiHistory & chatMessages to localStorage on every change
  useEffect(() => {
    try { localStorage.setItem(`ai_history_${pageId}`, JSON.stringify(aiHistory)); } catch { }
  }, [aiHistory, pageId]);

  useEffect(() => {
    try { localStorage.setItem(`ai_chat_messages_${pageId}`, JSON.stringify(chatMessages)); } catch { }
  }, [chatMessages, pageId]);

  // AI API Key (Claude - stored in localStorage)
  const [aiApiKey, setAiApiKey] = useState<string>(() => localStorage.getItem('ai_editor_claude_key') || '');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [aiProvider, setAiProvider] = useState<'claude' | 'demo'>(() => (localStorage.getItem('ai_editor_claude_key') ? 'claude' : 'demo'));

  // Publish
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);
  // SEO Settings
  const [seoOpen, setSeoOpen] = useState(false);
  const [pageTitle, setPageTitle] = useState('');
  const [metaDesc, setMetaDesc] = useState('');
  const [noIndex, setNoIndex] = useState(false);
  const [noFollow, setNoFollow] = useState(false);
  const [themePrimary, setThemePrimary] = useState('#818cf8');
  const [themeSecondary, setThemeSecondary] = useState('#6366f1');
  // Custom Color Picker
  const [colorPicker, setColorPicker] = useState<{
    visible: boolean;
    x: number;
    y: number;
    color: string;
    fieldEl: HTMLElement | null;
    cssProperty: string;
  }>({ visible: false, x: 0, y: 0, color: '#000000', fieldEl: null, cssProperty: '' });

  // Selection Context
  const [selectedLabel, setSelectedLabel] = useState<string>('Body');
  const [activeComponent, setActiveComponent] = useState<any>(null);
  const [isAiProcessing, setIsAiProcessing] = useState(false);

  // UI Panels
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);
  // Editor instance in state so GlobalStylesPanel re-renders when editor is ready
  const [editorInstance, setEditorInstance] = useState<Editor | null>(null);
  const [isEditorFullyLoaded, setIsEditorFullyLoaded] = useState(false);
  // CSS loading state — show overlay while template CSS loads
  const [isCanvasLoading, setIsCanvasLoading] = useState(false);

  const [siteStatus, setSiteStatus] = useState<'draft' | 'published' | 'republished' | 'unpublished'>('draft');

  const colorPickerRef = useRef<HTMLDivElement>(null);

  const aiInputRef = useRef<HTMLTextAreaElement>(null);

  const [extractedTemplateScripts, setExtractedTemplateScripts] = useState<string>('');

  useEffect(() => {
    if (page) {
      setPageTitle(page.metaTitle || page.name || 'Landing Page');
      setMetaDesc(page.metaDescription || '');
      setNoIndex(page.noIndex || false);
      setNoFollow(page.noFollow || false);
      setThemePrimary(page.primaryColor || '#818cf8');
      setThemeSecondary(page.secondaryColor || '#6366f1');
      setSiteStatus(page.status || 'draft');

      // Extract and backup ALL template scripts from raw db page content so they are never lost on save/publish
      try {
        let rawHtml = '';
        if (page.landingPageContent) {
          rawHtml = page.landingPageContent;
        } else if (typeof page.content === 'object' && page.content !== null) {
          rawHtml = page.content.fullHtml || page.content.html || '';
        } else if (typeof page.content === 'string') {
          rawHtml = page.content;
        }

        if (rawHtml) {
          // Match ALL script tags (both inline and src-based)
          const allScriptMatches: string[] = rawHtml.match(/<script\b[^>]*>[\s\S]*?<\/script>/gi) || [];
          // Filter out only tailwind CDN + tailwind config scripts (they are re-added on publish)
          const filteredScripts = allScriptMatches.filter(s => {
            if (s.includes('cdn.tailwindcss.com')) return false;
            if (s.includes('tailwind.config')) return false;
            return true;
          });
          if (filteredScripts.length > 0) {
            setExtractedTemplateScripts(filteredScripts.join('\n'));
          }
        }
      } catch (e) {
        console.warn('Failed to backup template scripts:', e);
      }
    }
  }, [page]);


  // Ref to track page data for closures
  const pageDataRef = useRef(page);
  useEffect(() => {
    pageDataRef.current = page;
  }, [page]);

  // Auto-focus AI input when tab switches to AI
  useEffect(() => {
    if (leftTab === 'ai' && isSidebarOpen) {
      setTimeout(() => aiInputRef.current?.focus(), 150);
    }
  }, [leftTab, isSidebarOpen]);

  // ── Sync Document Metadata for SPA ──
  useEffect(() => {
    if (page) {
      const currentTitle = page.metaTitle || page.name || 'Landing Page';
      document.title = `${currentTitle} | AI Project Hub`;

      // Update ALL meta description tags to be sure
      const metaDescriptions = document.querySelectorAll('meta[name="description"]');
      const targetContent = page.metaDescription || 'High-converting AI landing page.';

      if (metaDescriptions.length > 0) {
        metaDescriptions.forEach(tag => tag.setAttribute('content', targetContent));
      } else {
        const newTag = document.createElement('meta');
        newTag.setAttribute('name', 'description');
        newTag.setAttribute('content', targetContent);
        document.head.appendChild(newTag);
      }
    }
  }, [page?.name, page?.metaTitle, page?.metaDescription]);

  // Handle content application
  const applyContentToEditor = (editor: any, forcedMode?: 'landing' | 'thank-you') => {
    const currentPage = pageDataRef.current;
    if (!editor || !currentPage) return;

    const activeMode = forcedMode || mode;
    console.log('🔄 Applying content to editor. Mode:', activeMode, 'Page ID:', currentPage._id);

    // ── Show loading overlay while content + CSS load ──
    setIsCanvasLoading(true);

    let dbContent: string = '';
    let dbStyles: string = '';

    // 1. Resolve Content Structure based on Mode
    if (activeMode === 'thank-you') {
      dbContent = currentPage.thankYouPageContent || '';
      dbStyles = currentPage.thankYouPageStyles || '';

      // Treat known placeholders as completely empty so they don't flash on the screen
      if (dbContent.includes('Landing Page is Ready') || dbContent.includes('Your request has been successfully submitted')) {
        dbContent = '';
        dbStyles = '';
      }

      // Inject base template styles so components dragged into the Thank You page retain their design
      if (currentPage.styles) {
        dbStyles = currentPage.styles + '\n' + dbStyles;
      }
    } else {
      // Landing Page Mode (Legacy Support)
      if (currentPage.landingPageContent) {
        dbContent = currentPage.landingPageContent;
        dbStyles = currentPage.landingPageStyles || '';
      } else if (typeof currentPage.content === 'object' && currentPage.content !== null) {
        dbContent = currentPage.content.fullHtml || currentPage.content.html || '';
        dbStyles = currentPage.content.fullCss || currentPage.content.css || '';
      } else if (typeof currentPage.content === 'string') {
        dbContent = currentPage.content;
      }

      if (currentPage.styles && !dbStyles) {
        dbStyles = currentPage.styles;
      }
    }

    let extractedScripts: { src: string, innerHTML: string }[] = [];
    let extractedBodyStyle: string | null = null;
    let extractedBodyClass: string | null = null;

    // ── SANITIZE CORRUPTED SWIPER DOM ──
    try {
      const p = new DOMParser();
      const d = p.parseFromString(dbContent, 'text/html');
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
      d.querySelectorAll('.swiper-container').forEach(c => c.classList.remove('swiper-initialized', 'swiper-horizontal', 'swiper-vertical', 'swiper-backface-hidden'));
      dbContent = d.body.innerHTML;

      // Fix for older pages corrupted with leaked validation script text
      dbContent = dbContent.replace(/'; \} \}\); \} document\.readyState === 'loading'\?document\.addEventListener\('DOMContentLoaded',init\):init\(\); \}\)\(\);/g, '');
    } catch (e) { }

    // 2. Intelligent Extraction
    if (dbContent.toLowerCase().includes('<body') || dbContent.toLowerCase().includes('<head') || dbContent.toLowerCase().includes('<html')) {
      console.log('📄 Full HTML structure detected. Extracting components...');
      try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(dbContent, 'text/html');

        // Extract Styles
        const styleTags = Array.from(doc.querySelectorAll('style'));
        const extractedStyles = styleTags.map(s => s.textContent).join('\n');
        if (extractedStyles) {
          dbStyles = (dbStyles || '') + '\n' + extractedStyles;
        }
        styleTags.forEach(s => s.remove());

        // Extract scripts to be injected AFTER setComponents
        const scriptTags = Array.from(doc.querySelectorAll('script'));
        extractedScripts = scriptTags.map(scriptEl => ({
          src: scriptEl.src,
          innerHTML: scriptEl.innerHTML
        })).filter(scriptData => {
          // ── PREVENT MASSIVE LAG: Do not load Tailwind CDN twice! ──
          // GrapesJS already loads it via canvas: { scripts: [...] }.
          // Loading it again causes 3MB memory leak and sequential load delays.
          if (scriptData.src && scriptData.src.includes('tailwindcss.com')) return false;
          return true;
        });
        scriptTags.forEach(s => s.remove());

        const linkElements = Array.from(doc.querySelectorAll('link'));
        const links = linkElements.map(l => l.outerHTML);

        const canvasDoc = editor.Canvas.getDocument();
        if (canvasDoc) {
          links.forEach(linkHtml => {
            if (!canvasDoc.head.innerHTML.includes(linkHtml)) {
              canvasDoc.head.insertAdjacentHTML('beforeend', linkHtml);
            }
          });
        }
        linkElements.forEach(l => l.remove());

        // Take body content or fallback to full text if body is somehow empty
        let bodyHtml = doc.body.innerHTML.trim();
        if (!bodyHtml || bodyHtml.length < 10) {
          console.warn('⚠️ Body was empty after parsing, using raw content fallback.');
          bodyHtml = dbContent.replace(/<head>[\s\S]*?<\/head>/i, '').replace(/<html[^>]*>|<\/html>|<body[^>]*>|<\/body>/gi, '');
        }
        // Strip style tags from body so GrapesJS doesn't parse massive CSS rules into CssComposer
        dbContent = bodyHtml.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');

        // Save body style and classes to apply AFTER setComponents
        extractedBodyStyle = doc.body.getAttribute('style');
        extractedBodyClass = doc.body.getAttribute('class');
      } catch (e) {
        console.error('❌ Failed to parse full HTML, using raw fallback:', e);
      }
    }

    // 3. Set to Editor
    if (dbContent && dbContent.trim().length > 10) {
      console.log('💎 Injecting branding variables and setting content...');

      // Clear then set
      editor.setComponents('');
      try {
        if (editor.DomComponents && editor.DomComponents.clear) editor.DomComponents.clear();
        // @ts-ignore
        if (editor.Css && editor.Css.clear) editor.Css.clear();
        // @ts-ignore
        if (editor.UndoManager && editor.UndoManager.clear) editor.UndoManager.clear();
      } catch (e) {
        console.warn('GrapesJS soft clear returned a warning:', e);
      }

      // Inject :root CSS variables
      const canvasDoc = editor.Canvas.getDocument();

      // ─── Placeholder Replacement (Dynamic) ───
      const primaryColor = currentPage.primaryColor || '#818cf8';
      const secondaryColor = currentPage.secondaryColor || '#6366f1';

      let pRgb = "124, 58, 237";
      let sRgb = "99, 102, 241";
      try {
        pRgb = hexToRgbStr(primaryColor);
        sRgb = hexToRgbStr(secondaryColor);
      } catch (e) { }

      let finalStyles = (dbStyles || '');

      // Recover hardcoded hex colors to dynamic variables for existing/previously saved pages
      if (primaryColor) {
        const escapedColor = primaryColor.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        const regex = new RegExp(`(?<!--primary\\s*:\\s*)(?<!--primary-dark\\s*:\\s*)(?<!--p3-primary\\s*:\\s*)(?<!--p3-primary-mid\\s*:\\s*)(?<!--primary-container\\s*:\\s*)(?<!--primary-temp\\s*:\\s*)${escapedColor}`, 'gi');
        finalStyles = finalStyles.replace(regex, 'var(--primary)');
      }
      if (secondaryColor) {
        const escapedColor = secondaryColor.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        const regex = new RegExp(`(?<!--secondary\\s*:\\s*)${escapedColor}`, 'gi');
        finalStyles = finalStyles.replace(regex, 'var(--secondary)');
      }

      // 1. Replace the actual variable definitions in :root first with the HEX values for base to avoid circular references
      finalStyles = finalStyles
        .replace(/--primary\s*:\s*PRIMARY_COLOR_PLACEHOLDER/g, `--primary: ${primaryColor}`)
        .replace(/--secondary\s*:\s*SECONDARY_COLOR_PLACEHOLDER/g, `--secondary: ${secondaryColor}`)
        .replace(/--primary-rgb\s*:\s*PRIMARY_RGB_PLACEHOLDER/g, `--primary-rgb: ${pRgb}`)
        .replace(/--secondary-rgb\s*:\s*SECONDARY_RGB_PLACEHOLDER/g, `--secondary-rgb: ${sRgb}`);

      // 2. Replace any other placeholders in styles with CSS variables to keep them dynamic
      finalStyles = finalStyles
        .replace(/PRIMARY_COLOR_PLACEHOLDER/g, 'var(--primary)')
        .replace(/SECONDARY_COLOR_PLACEHOLDER/g, 'var(--secondary)')
        .replace(/PRIMARY_RGB_PLACEHOLDER/g, 'var(--primary-rgb)')
        .replace(/SECONDARY_RGB_PLACEHOLDER/g, 'var(--secondary-rgb)')
        .replace(/LOGO_URL_PLACEHOLDER/g, currentPage.logoUrl || '')
        .replace(/LOGO_PLACEHOLDER/g, currentPage.logoUrl ? `<img src="${currentPage.logoUrl}" alt="Logo" />` : 'LOGO')
        .replace(/PROJECT_NAME_PLACEHOLDER/g, currentPage.title || 'Your Brand');

      // ─── Inject template CSS FIRST into canvas <iframe> ───
      // (branding-vars must come AFTER template-styles so it wins the cascade)
      if (canvasDoc) {
        let templateStyleTag = canvasDoc.getElementById('template-styles') as HTMLStyleElement | null;
        if (!templateStyleTag) {
          templateStyleTag = canvasDoc.createElement('style');
          templateStyleTag.id = 'template-styles';
          canvasDoc.head.appendChild(templateStyleTag);
        }
        templateStyleTag.innerHTML = finalStyles;
      }

      // Intentionally skipping editor.setStyle(finalStyles) here because loading massive AI CSS into
      // the CssComposer causes severe 2-5s freezes during both page load and component selection.
      // ─── Inject branding-vars AFTER template-styles so it wins the cascade ───
      if (canvasDoc) {
        // Ensure icon fonts and classes are always present for both Landing and Thank You pages
        const fontLinks = `
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" />
          <script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
        `;
        if (!canvasDoc.head.innerHTML.includes('Material+Symbols+Outlined')) {
          canvasDoc.head.insertAdjacentHTML('beforeend', fontLinks);
        }

        let coreIconStyles = canvasDoc.getElementById('core-icon-styles');
        if (!coreIconStyles) {
          coreIconStyles = canvasDoc.createElement('style');
          coreIconStyles.id = 'core-icon-styles';
          canvasDoc.head.appendChild(coreIconStyles);
        }
        coreIconStyles.innerHTML = `
          .material-symbols-outlined {
            font-family: 'Material Symbols Outlined' !important;
            font-weight: normal; font-style: normal; font-size: 24px; line-height: 1;
            letter-spacing: normal; text-transform: none; display: inline-block;
            white-space: nowrap; word-wrap: normal; direction: ltr; -webkit-font-smoothing: antialiased;
          }
        `;

        // Remove existing branding-vars if present so we re-insert at end
        const existingBranding = canvasDoc.getElementById('branding-vars');
        if (existingBranding) existingBranding.remove();

        const brandingTag = canvasDoc.createElement('style');
        brandingTag.id = 'branding-vars';
        canvasDoc.head.appendChild(brandingTag); // append at END so it wins cascade
        brandingTag.innerHTML = `
        /* Editor Image Safeguards */
        /* Editor Image Safeguards */
        .flex img, [class*="flex"] img { flex-shrink: 0 !important; }
        img { max-width: 100%; object-fit: cover; }
        :root { 
          --primary: ${primaryColor}; 
          --secondary: ${secondaryColor}; 
          --accent: ${secondaryColor};
          --gold: ${primaryColor};
          --forest: ${primaryColor};
          --button-gradient: linear-gradient(135deg, ${primaryColor}, ${secondaryColor});
        }
        
        input, textarea, select {
          color: #0f172a !important;
          background-color: #ffffff !important;
        }
        input::placeholder, textarea::placeholder {
          color: #94a3b8 !important;
        }
        `;
        const allButtons = canvasDoc.querySelectorAll('form button');
        allButtons.forEach((btn: Element) => {
          if (btn.getAttribute('type') === 'button') {
            btn.setAttribute('type', 'submit');
          }
        });

        // Remove existing editor-interaction script if present
        const existingInteractionScript = canvasDoc.getElementById('editor-interactions');
        if (existingInteractionScript) existingInteractionScript.remove();

        const interactionScript = canvasDoc.createElement('script');
        interactionScript.id = 'editor-interactions';
        interactionScript.innerHTML = `
          // Add js-enabled so template CSS (active tab visibility) works in editor
          document.body.classList.add('js-enabled');
          // Immediately make all animated elements visible in editor (no scroll trigger needed)
          document.querySelectorAll('.animate-up, .animate-fade').forEach(function(el) {
            el.classList.add('in-view');
          });

          // ── BLOCK all form submissions in editor to prevent page reload / red borders ──
          document.addEventListener('submit', function(e) {
            e.preventDefault();
            e.stopPropagation();
            return false;
          }, true);

          // ── Remove native HTML5 validation in editor (prevents red borders from required fields) ──
          document.querySelectorAll('form').forEach(function(form) {
            form.setAttribute('novalidate', 'novalidate');
          });

          // ── Remove red border inline styles left over from any validation scripts ──
          document.querySelectorAll('input, textarea, select').forEach(function(el) {
            el.style.border = '';
          });

          document.addEventListener('click', function(e) {
            // Native details/summary toggle removed from here. Now handled securely via GrapesJS component:selected event.
            // ── Handle AI-generated Accordion / FAQ (accordion-header + accordion-content) ──
            const accHeader = e.target.closest('.accordion-header');
            if (accHeader) {
              const item = accHeader.closest('.accordion-item');
              if (item) {
                const content = item.querySelector('.accordion-content');
                const icon = accHeader.querySelector('.accordion-icon, .fa-chevron-down, .fa-plus, .fa-minus');
                const isOpen = content && !content.classList.contains('hidden');

                // Close all other accordion items
                document.querySelectorAll('.accordion-item').forEach(function(otherItem) {
                  if (otherItem !== item) {
                    const otherContent = otherItem.querySelector('.accordion-content');
                    const otherIcon = otherItem.querySelector('.accordion-icon, .fa-chevron-down, .fa-plus, .fa-minus');
                    if (otherContent) otherContent.classList.add('hidden');
                    if (otherIcon) { otherIcon.classList.remove('rotate-180'); otherIcon.classList.remove('fa-minus'); otherIcon.classList.add('fa-plus'); }
                  }
                });

                // Toggle this item
                if (content) {
                  if (isOpen) {
                    content.classList.add('hidden');
                    if (icon) { icon.classList.remove('rotate-180'); icon.classList.remove('fa-minus'); icon.classList.add('fa-plus'); }
                  } else {
                    content.classList.remove('hidden');
                    if (icon) { icon.classList.add('rotate-180'); icon.classList.remove('fa-plus'); icon.classList.add('fa-minus'); }
                  }
                }
              }
            }

            // Handle tab clicks for law01 and any tab-based template
            const tabItem = e.target.closest('.tab-item');
            if (tabItem) {
              const container = tabItem.closest('.tabs-container');
              if (container) {
                const allTabs = Array.from(container.querySelectorAll('.tab-item'));
                const allPanels = Array.from(container.querySelectorAll('.tab-content-box'));
                const tabIndex = allTabs.indexOf(tabItem);
                allTabs.forEach(function(t: any) { 
                  t.classList.remove('active'); 
                  t.style.borderBottomColor = 'transparent'; 
                  t.style.color = '#4b5563'; 
                });
                allPanels.forEach(function(p: any) { 
                  p.classList.remove('active'); 
                  p.style.display = 'none'; 
                });
                tabItem.classList.add('active');
                (tabItem as any).style.borderBottomColor = 'var(--primary, #6366f1)';
                (tabItem as any).style.color = 'var(--primary, #6366f1)';
                if (allPanels[tabIndex]) {
                  allPanels[tabIndex].classList.add('active');
                  (allPanels[tabIndex] as any).style.display = 'block';
                }
              }
            }

            // Handle custom FAQ toggles (e.g. Healthcare, Travel, Law templates)
            const faqHead = e.target.closest('.faq-head, .v2-faq-summary, .faq-item-head, .faq-item, .hc7-faq-item-head, .hc7-faq-item');
            if (faqHead && !faqHead.closest('details')) {
              const item = faqHead.closest('.faq-item, .hc7-faq-item');
              if (item) {
                const allItems = document.querySelectorAll('.faq-item, .hc7-faq-item');
                allItems.forEach(el => {
                  if (el !== item) el.classList.remove('active');
                });
                item.classList.toggle('active');
              }
            }

            // ── Handle Doctors Slider (hc7-doc-prev / hc7-doc-next) ──
            const docPrev = e.target.closest('.hc7-doc-prev');
            const docNext = e.target.closest('.hc7-doc-next');
            if (docPrev || docNext) {
              const grid = document.querySelector('.hc7-doctor-grid') as HTMLElement;
              if (grid) {
                const cards = grid.querySelectorAll('.hc7-doctor-card');
                if (cards.length) {
                  let curIdx = parseInt(grid.getAttribute('data-index') || '0', 10);
                  const w = window.innerWidth;
                  const visible = w <= 600 ? 1 : (w <= 992 ? 2 : 4);
                  const maxIdx = Math.max(0, cards.length - visible);
                  if (docNext) {
                    curIdx = curIdx < maxIdx ? curIdx + 1 : 0;
                  } else {
                    curIdx = curIdx > 0 ? curIdx - 1 : maxIdx;
                  }
                  grid.setAttribute('data-index', String(curIdx));
                  const cardWidth = (cards[0] as HTMLElement).offsetWidth;
                  const moveAmount = (cardWidth + 24) * curIdx;
                  grid.style.transform = 'translateX(-' + moveAmount + 'px)';
                }
              }
            }

            // ── Handle Testimonial Slider (hc7-testimonial-prev / hc7-testimonial-next / hc7-testimonial-dots) ──
            const testPrev = e.target.closest('.hc7-testimonial-prev');
            const testNext = e.target.closest('.hc7-testimonial-next');
            const testDot = e.target.closest('.hc7-testimonial-dots span');
            if (testPrev || testNext || testDot) {
              const slides = document.querySelectorAll('.hc7-testimonial-slide');
              const dots = document.querySelectorAll('.hc7-testimonial-dots span');
              if (slides.length) {
                let curSlide = 0;
                slides.forEach((s, idx) => { if (s.classList.contains('active')) curSlide = idx; });
                if (testDot) {
                  const dotsArr = Array.from(dots);
                  curSlide = dotsArr.indexOf(testDot as any);
                  if (curSlide < 0) curSlide = 0;
                } else if (testNext) {
                  curSlide = (curSlide + 1) % slides.length;
                } else if (testPrev) {
                  curSlide = (curSlide - 1 + slides.length) % slides.length;
                }
                slides.forEach((s, idx) => {
                  if (idx === curSlide) s.classList.add('active');
                  else s.classList.remove('active');
                });
                dots.forEach((d, idx) => {
                  if (idx === curSlide) d.classList.add('active');
                  else d.classList.remove('active');
                });
              }
            }

            // Handle custom Dropdowns (e.g. Travel template)
            const dropdownToggle = e.target.closest('.dropdown-toggle');
            if (dropdownToggle) {
              e.stopPropagation();
              dropdownToggle.classList.toggle('active');
              const menu = dropdownToggle.parentElement.querySelector('.dropdown-menu');
              if (menu) menu.classList.toggle('active');
            } else {
              document.querySelectorAll('.dropdown-toggle, .dropdown-menu').forEach(el => el.classList.remove('active'));
            }

            // ── Pure CSS Peer Checked Accordions / Checkboxes ──
            const label = e.target.closest('label');
            if (label) {
               const forAttr = label.getAttribute('for');
               const input = forAttr ? document.getElementById(forAttr) : label.querySelector('input');
               if (input && (input.type === 'radio' || input.type === 'checkbox')) {
                  if (input.type === 'radio' && input.name) {
                     document.querySelectorAll('input[type="radio"][name="'+input.name+'"]').forEach(r => r.checked = false);
                  }
                  input.checked = !input.checked;
               }
            }

            // ── Ultimate Heuristic AI FAQ Toggle Fallback ──
            // Catch-all for AI generated FAQs, Accordions, and Dropdowns (no strict class names required)
            let current = e.target;
            let toggled = false;
            while (current && current !== document.body && !toggled) {
               const nextEl = current.nextElementSibling;
               if (nextEl && (nextEl.tagName === 'DIV' || nextEl.tagName === 'P' || nextEl.tagName === 'UL')) {
                  const isHidden = nextEl.classList.contains('hidden') || nextEl.style.display === 'none';
                  const isVisible = nextEl.offsetHeight > 0 && !isHidden;
                  
                  const hasIcon = current.querySelector('svg, i.fa, i.fas, i.far, i.fab, i.material-icons') || current.tagName === 'BUTTON';
                  const isPointer = window.getComputedStyle(current).cursor === 'pointer' || current.classList.contains('cursor-pointer') || current.tagName === 'BUTTON' || current.closest('.faq-item, .accordion-item');
                  
                  if (hasIcon && isPointer) {
                     if (isHidden) {
                        nextEl.classList.remove('hidden');
                        nextEl.style.display = 'block';
                        const icon = current.querySelector('svg, i');
                        if (icon) {
                           icon.classList.add('rotate-180');
                           if(icon.classList.contains('fa-plus')) { icon.classList.remove('fa-plus'); icon.classList.add('fa-minus'); }
                        }
                        toggled = true;
                        break;
                     } else if (isVisible) {
                        nextEl.classList.add('hidden');
                        nextEl.style.display = 'none';
                        const icon = current.querySelector('svg, i');
                        if (icon) {
                           icon.classList.remove('rotate-180');
                           if(icon.classList.contains('fa-minus')) { icon.classList.remove('fa-minus'); icon.classList.add('fa-plus'); }
                        }
                        toggled = true;
                        break;
                     }
                  }
               }
               
               // Alternative case: clicking inside a container where a child is hidden
               const container = current;
               const hiddenChild = Array.from(container.children).find(c => c.classList.contains('hidden') || c.style.display === 'none');
               const hasPointer = window.getComputedStyle(container).cursor === 'pointer' || container.classList.contains('cursor-pointer') || container.classList.contains('faq-item') || container.classList.contains('accordion-item');
               
               if (hiddenChild && hasPointer && container.querySelector('svg, i')) {
                  hiddenChild.classList.remove('hidden');
                  hiddenChild.style.display = 'block';
                  const icon = container.querySelector('svg, i');
                  if (icon) {
                     icon.classList.add('rotate-180');
                     if(icon.classList.contains('fa-plus')) { icon.classList.remove('fa-plus'); icon.classList.add('fa-minus'); }
                  }
                  toggled = true;
                  break;
               } else if (hasPointer && container.querySelector('svg, i') && container.children.length >= 2) {
                  // Closing case
                  const visibleChild = Array.from(container.children).find(c => (c.tagName === 'DIV' || c.tagName === 'P') && c !== container.firstElementChild && c.offsetHeight > 0 && !c.classList.contains('hidden'));
                  if (visibleChild && container.firstElementChild && container.firstElementChild.contains(e.target)) {
                     visibleChild.classList.add('hidden');
                     visibleChild.style.display = 'none';
                     const icon = container.querySelector('svg, i');
                     if (icon) {
                        icon.classList.remove('rotate-180');
                        if(icon.classList.contains('fa-minus')) { icon.classList.remove('fa-minus'); icon.classList.add('fa-plus'); }
                     }
                     toggled = true;
                     break;
                  }
               }
               
               current = current.parentElement;
            }
          }, true);
        `;
        canvasDoc.body.appendChild(interactionScript);
      }



      // ─── Synchronous Branding & Logo Replacement ───
      if (currentPage.logoUrl) {
        dbContent = dbContent.replace(/https:\/\/via\.placeholder\.com\/[^\s"'>]+/g, currentPage.logoUrl);
        dbContent = dbContent.replace(/https:\/\/i\.ibb\.co\/vzB7pLq\/Logo\.png/g, currentPage.logoUrl);
        dbContent = dbContent.replace(/https:\/\/picsum\.photos\/seed\/saaslogo\/[^\s"'>]+/g, currentPage.logoUrl);

        // Flexible attribute replacement
        dbContent = dbContent.replace(/<img([^>]*)id="page-logo"([^>]*)>/gi, (match, p1, p2) => {
          const combined = p1 + p2;
          const updated = combined.replace(/src="[^"]*"/gi, '');
          return `<img src="${currentPage.logoUrl}"${updated} id="page-logo">`;
        });
      }

      if (currentPage.primaryColor) {
        let pColor = currentPage.primaryColor.trim();
        if (pColor && pColor !== '#ffffff' && pColor !== '#000000') {
          dbContent = dbContent.replace(new RegExp(pColor, 'gi'), 'var(--primary)');
          if (pColor.length === 9) {
            dbContent = dbContent.replace(new RegExp(pColor.slice(0, 7), 'gi'), 'var(--primary)');
          }
        }
      }
      if (currentPage.secondaryColor) {
        let sColor = currentPage.secondaryColor.trim();
        if (sColor && sColor !== '#ffffff' && sColor !== '#000000') {
          dbContent = dbContent.replace(new RegExp(sColor, 'gi'), 'var(--secondary)');
          if (sColor.length === 9) {
            dbContent = dbContent.replace(new RegExp(sColor.slice(0, 7), 'gi'), 'var(--secondary)');
          }
        }
      }

      dbContent = dbContent.replace(/\[var\(--primary\)\]/g, '[var(--primary)]');
      dbContent = dbContent.replace(/\[var\(--secondary\)\]/g, '[var(--secondary)]');

      // ─── Replace all script-generated placeholders in HTML content ───
      dbContent = dbContent
        .replace(/PRIMARY_COLOR_PLACEHOLDER/g, 'var(--primary)')
        .replace(/SECONDARY_COLOR_PLACEHOLDER/g, 'var(--secondary)')
        .replace(/PRIMARY_RGB_PLACEHOLDER/g, pRgb)
        .replace(/SECONDARY_RGB_PLACEHOLDER/g, sRgb)
        .replace(/LOGO_PLACEHOLDER/g, currentPage.logoUrl ? `<img src="${currentPage.logoUrl}" alt="Logo" style="height:40px;object-fit:contain;" />` : '<span style="font-weight:700;font-size:1.5rem;">Your Brand</span>')
        .replace(/PROJECT_NAME_PLACEHOLDER/g, currentPage.title || 'Your Brand');

      // ─── Apply Tailwind config into canvas frame so it actually executes in the editor ───
      if (canvasDoc) {
        let twScript = canvasDoc.getElementById('tw-config');
        if (!twScript) {
          twScript = canvasDoc.createElement('script');
          twScript.id = 'tw-config';
          canvasDoc.head.appendChild(twScript);
        }
        twScript.innerHTML = `
          tailwind.config = {
            theme: {
              extend: {
                colors: {
                  primary: 'var(--primary)',
                  secondary: 'var(--secondary)',
                  accent: 'var(--accent)'
                }
              }
            }
          }
        `;

        let blockSubmitScript = canvasDoc.getElementById('block-submit');
        if (!blockSubmitScript) {
          blockSubmitScript = canvasDoc.createElement('script');
          blockSubmitScript.id = 'block-submit';
          canvasDoc.head.appendChild(blockSubmitScript);
        }
        blockSubmitScript.innerHTML = `
          document.addEventListener('submit', function(e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            alert('Form submission is disabled inside the Editor.');
          }, true);
        `;
      }

      // ─── Auto-heal missing <summary> tags stripped by AI generators ───
      // If a <details> tag does not immediately contain a <summary>, inject a fallback summary
      // so that GrapesJS can render it as a selectable/editable text component.
      dbContent = dbContent.replace(/(<details[^>]*>)(?!\s*<summary)/gi, '$1\n<summary class="ft-header"><h3 class="ft-title">Custom Heading</h3><span class="ft-icon-toggle"><i class="fa-solid fa-chevron-down"></i></span></summary>\n');

      // ─── Auto-heal missing Swiper data-gjs-type attributes ───
      // AI generators often generate .swiper-container but strip the data-gjs-type which breaks the slider in GrapesJS.
      dbContent = dbContent.replace(/class="([^"]*\bswiper-container\b[^"]*)"(?![^>]*data-gjs-type)/gi, 'class="$1" data-gjs-type="swiper-container"');
      dbContent = dbContent.replace(/class="([^"]*\bswiper-wrapper\b[^"]*)"(?![^>]*data-gjs-type)/gi, 'class="$1" data-gjs-type="swiper-wrapper"');
      dbContent = dbContent.replace(/class="([^"]*\bswiper-slide\b[^"]*)"(?![^>]*data-gjs-type)/gi, 'class="$1" data-gjs-type="swiper-slide"');

      // ─── Auto-heal missing Swiper properties stripped by AI ───
      // If AI stripped data-slides-per-view, force it to 2 for testimonials slider so it doesn't collapse to 1
      dbContent = dbContent.replace(/(<div[^>]*class="[^"]*\bswiper-container\b[^"]*"[^>]*)/gi, (match) => {
        let newMatch = match;
        const isTravel03 = newMatch.includes('new-design-slider');
        const targetSlides = isTravel03 ? '1' : '2';

        if (!newMatch.includes('data-slides-per-view')) {
          newMatch = newMatch + ` data-slides-per-view="${targetSlides}"`;
        } else {
          newMatch = newMatch.replace(/data-slides-per-view="[^"]*"/, `data-slides-per-view="${targetSlides}"`);
        }

        if (!newMatch.includes('data-mobile-breakpoint')) {
          newMatch = newMatch + ' data-mobile-breakpoint="true"';
        }
        if (!newMatch.includes('data-tablet-breakpoint')) {
          newMatch = newMatch + ' data-tablet-breakpoint="true"';
        }
        return newMatch;
      });

      editor.setComponents(dbContent);

      // ── Apply Extracted Body Classes & Styles to Wrapper ──
      const wrapper = editor.getWrapper();
      if (wrapper) {
        if (extractedBodyClass) {
          extractedBodyClass.split(' ').filter(Boolean).forEach(c => wrapper.addClass(c));
        }
        if (extractedBodyStyle) {
          try {
            // @ts-ignore
            if (typeof parseInlineStyle !== 'undefined') wrapper.addStyle(parseInlineStyle(extractedBodyStyle));
          } catch (e) { }
        }
      }

      // ── Hide loader after canvas has had time to render CSS/fonts ──
      // Re-add js-enabled + in-view after setComponents so animations & tabs work in editor
      setTimeout(() => {
        try {
          const cDoc = editor.Canvas.getDocument();
          if (cDoc && cDoc.body) {
            cDoc.body.classList.add('js-enabled');
            // Make all animated elements visible (no scroll needed in editor)
            cDoc.querySelectorAll('.animate-up, .animate-fade').forEach((el: Element) => {
              el.classList.add('in-view');
            });
            cDoc.querySelectorAll('.reveal').forEach((el: Element) => el.classList.add('in'));

            // Show final counter numbers instead of '0' in the editor
            cDoc.querySelectorAll('[data-count]').forEach((el: Element) => {
              const target = el.getAttribute('data-count');
              if (target && (el.textContent?.trim() === '0' || el.textContent?.trim() === '0+')) {
                el.textContent = target + (parseInt(target, 10) >= 100 ? '+' : '');
              }
            });

            // Execute extracted scripts safely AFTER components are set (Parallel external, then inline to avoid race conditions)
            if (extractedScripts && extractedScripts.length > 0) {
              const externalScripts = extractedScripts.filter(s => s.src);
              const inlineScripts = extractedScripts.filter(s => !s.src);

              let loadedCount = 0;
              let inlineRan = false;
              const runInlineScripts = () => {
                if (inlineRan) return;
                inlineRan = true;
                inlineScripts.forEach(scriptData => {
                  const newScript = cDoc.createElement('script');
                  newScript.innerHTML = scriptData.innerHTML;
                  cDoc.body.appendChild(newScript);
                });
              };

              if (externalScripts.length > 0) {
                // Fallback timeout just in case a CDN network request hangs
                setTimeout(runInlineScripts, 3000);

                externalScripts.forEach(scriptData => {
                  const newScript = cDoc.createElement('script');
                  newScript.src = scriptData.src;
                  newScript.onload = newScript.onerror = () => {
                    loadedCount++;
                    if (loadedCount === externalScripts.length) runInlineScripts();
                  };
                  cDoc.body.appendChild(newScript);
                });
              } else {
                runInlineScripts();
              }
            }
          }
        } catch (e) { /* ignore */ }
        setIsCanvasLoading(false);
      }, 200);
    } else {
      if (activeMode === 'thank-you') {
        // Do not inject placeholder. The ThankYouEditorPanel will auto-fetch and apply the default template.
        // Keep the loading overlay visible until onSelect completes. Add a 5s fallback just in case.
        editor.setComponents('');
        setTimeout(() => setIsCanvasLoading(false), 5000);
      } else {
        editor.setComponents(`<div style="padding: 100px 20px; text-align: center; font-family: sans-serif; color: #64748b;">` +
          `<h2 style="margin-bottom: 10px;">Landing Page is Ready</h2>` +
          `<p>Start editing by choosing a block from the left or use the AI generator.</p>` +
          `</div>`);
        setTimeout(() => setIsCanvasLoading(false), 400);
      }
    }
  };

  // Effect to handle editor initialization (ONCE per pageId)
  useEffect(() => {
    if (projectLoading || pageLoading || !page || !project || editorRef.current) return;

    console.log('🚀 Initializing GrapesJS Editor...');

    // ─── Style GrapesJS Modal Header Only ───
    const style = document.createElement('style');
    style.innerHTML = `
      .gjs-mdl-header { background-color: #1f2937 !important; border-bottom: 1px solid #1f2937 !important; padding: 15px 20px !important; }
      .gjs-mdl-title { color: #f8fafc !important; font-weight: bold !important; font-size: 16px !important; }
      .gjs-mdl-btn-close { color: #94a3b8 !important; }
      .gjs-mdl-content { background-color: #111827 !important; padding: 0 !important; }
      
      /* Asset Manager Upload Styling */
      .gjs-am-uploadFile {
        background-color: #1f2937 !important;
        border: 2px dashed #374151 !important;
        color: #9ca3af !important;
        padding: 40px 20px !important;
        border-radius: 12px !important;
        margin: 20px !important;
        text-align: center !important;
      }
      .gjs-am-assets-cont {
        background-color: #111827 !important;
        padding: 15px !important;
      }
      .gjs-am-add-asset {
        background-color: #1f2937 !important;
        color: #f3f4f6 !important;
        border: 1px solid #374151 !important;
        padding: 8px 12px !important;
        border-radius: 6px !important;
      }
      .gjs-am-asset {
        background-color: #1f2937 !important;
        border-radius: 8px !important;
        margin: 5px !important;
      }
    `;
    document.head.appendChild(style);

    // ── SILENCE CASH-DOM WARNINGS BY FORCING PASSIVE LISTENERS ──
    const passiveScript = document.createElement('script');
    passiveScript.innerHTML = `
      (function() {
        var originalAddEventListener = EventTarget.prototype.addEventListener;
        EventTarget.prototype.addEventListener = function(type, listener, options) {
          if (type === 'touchstart' || type === 'touchmove' || type === 'mousewheel') {
            if (typeof options === 'boolean') {
              options = { capture: options, passive: true };
            } else if (!options || typeof options === 'object') {
              options = options || {};
              options.passive = true;
            }
          }
          return originalAddEventListener.call(this, type, listener, options);
        };
      })();
    `;
    document.head.prepend(passiveScript);

    const pickrColorPlugin = (ed: any) => {
      ed.StyleManager.addType('pickr-color', {
        create({ props, change }: any) {
          const el = document.createElement('div');
          el.style.display = 'flex';
          el.style.alignItems = 'center';
          el.style.width = '100%';
          el.style.border = '1px solid #d1d5db';
          el.style.borderRadius = '4px';
          el.style.padding = '4px 6px';
          el.style.backgroundColor = '#ffffff';

          const pickrBtn = document.createElement('div');
          pickrBtn.className = 'custom-grapesjs-pickr';
          pickrBtn.style.width = '18px';
          pickrBtn.style.height = '18px';
          pickrBtn.style.borderRadius = '3px';
          pickrBtn.style.border = '1px solid rgba(0,0,0,0.1)';
          pickrBtn.style.cursor = 'pointer';
          pickrBtn.style.flexShrink = '0';

          const inputHex = document.createElement('input');
          inputHex.type = 'text';
          inputHex.style.width = '100%';
          inputHex.style.marginLeft = '8px';
          inputHex.style.border = 'none';
          inputHex.style.background = 'transparent';
          inputHex.style.color = '#111827';
          inputHex.style.fontSize = '12px';
          inputHex.style.outline = 'none';
          el.appendChild(pickrBtn);
          el.appendChild(inputHex);

          const applyUpdate = (val: string, partial: boolean) => {
            // Pass to emit()
            change({ value: val, partial });
          };

          const toHexAny = (hex: string) => {
            if (!hex) return '';
            if (hex.startsWith('#') && (hex.length === 9 || hex.length === 7)) return hex;
            if (hex.startsWith('#') && hex.length === 5) {
              const [, r, g, b, a] = hex;
              return `#${r}${r}${g}${g}${b}${b}${a}${a}`;
            }
            if (hex.startsWith('#') && hex.length === 4) {
              const [, r, g, b] = hex;
              return `#${r}${r}${g}${g}${b}${b}`;
            }
            return hex.length === 6 ? `#${hex}` : hex.length === 8 ? `#${hex}` : '';
          };

          const initPickr = () => {
            if ((el as any).__pickr) return;
            const initialVal = inputHex.value || '';
            const pickr = Pickr.create({
              el: pickrBtn,
              theme: 'monolith',
              default: initialVal || null,
              useAsButton: true,
              components: {
                preview: true, opacity: true, hue: true,
                interaction: { hex: true, input: true, save: true, clear: true }
              }
            });

            pickr.on('change', (color: Pickr.HSVaColor) => {
              const hex = color ? toHexAny(color.toHEXA().toString()) : '';
              pickrBtn.style.backgroundColor = hex || 'transparent';
              inputHex.value = hex;
              applyUpdate(hex, true);
            });

            pickr.on('save', (color: Pickr.HSVaColor) => {
              const hex = color ? toHexAny(color.toHEXA().toString()) : '';
              pickrBtn.style.backgroundColor = hex || 'transparent';
              inputHex.value = hex;
              applyUpdate(hex, false);
              pickr.hide();
            });

            pickr.on('clear', () => {
              pickrBtn.style.backgroundColor = 'transparent';
              inputHex.value = '';
              applyUpdate('', false);
              pickr.hide();
            });

            inputHex.addEventListener('change', (e: any) => {
              const val = e.target.value;
              const hex = toHexAny(val);
              if (hex) {
                pickr.setColor(hex);
                pickrBtn.style.backgroundColor = hex;
                applyUpdate(hex, false);
              } else {
                pickr.setColor(null);
                pickrBtn.style.backgroundColor = 'transparent';
                applyUpdate('', false);
              }
            });

            (el as any).__pickr = pickr;
          };

          setTimeout(() => {
            if (el.offsetWidth > 0) initPickr();
            else {
              const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                  initPickr();
                  observer.disconnect();
                }
              });
              observer.observe(el);
            }
          }, 50);

          (el as any).__inputHex = inputHex;
          (el as any).__pickrBtn = pickrBtn;

          return el;
        },

        emit({ updateStyle }: any, { value, partial }: any) {
          updateStyle(value, { partial });
        },

        update({ value, el }: any) {
          if (!el) return;
          const val = value || '';
          if (el.__inputHex) el.__inputHex.value = val;
          if (el.__pickrBtn) el.__pickrBtn.style.backgroundColor = val || 'transparent';
          const pickr = el.__pickr;
          if (pickr) {
            if (val) pickr.setColor(val, true);
            else pickr.setColor(null, true);
          }
        }
      });
    };

    // ─────────────────────────────────────────────────────────────────────────────
    // customSwiperPlugin — drop-in replacement for the existing function
    // Fixes:
    //   1. Accordion headers now reliably toggle (class-based, survives re-renders)
    //   2. Swiper traits (Pagination Type, Slides Per View, etc.) actually apply
    //   3. MutationObserver re-applies collapsed state after every panel refresh
    // ─────────────────────────────────────────────────────────────────────────────

    // ─────────────────────────────────────────────────────────────────────────────
    // customSwiperPlugin — fully fixed accordion + swiper traits
    // ─────────────────────────────────────────────────────────────────────────────

    const customSwiperPlugin = (editor: Editor) => {

      // ── Inject accordion-collapsed CSS once ──
      if (!document.getElementById('accordion-collapsed-style')) {
        const s = document.createElement('style');
        s.id = 'accordion-collapsed-style';
        s.innerHTML = `.gjs-trt-trait__wrp.accordion-collapsed { display: none !important; }`;
        document.head.appendChild(s);
      }

      // ── Custom trait type: accordion-header ──
      editor.TraitManager.addType('accordion-header', {
        createLabel() { return ''; },
        createInput({ trait }: any) {
          const el = document.createElement('div');
          el.style.cssText = 'width:100%; display:block;';
          el.innerHTML = `
    <div class="trait-accordion-header" data-open="false"
      style="cursor:pointer;display:flex;justify-content:space-between;align-items:center;
             padding:12px 14px;background:#ffffff;border-bottom:1px solid #e2e8f0;
             font-weight:600;font-size:13px;color:#0f172a;width:100%;
             box-sizing:border-box;user-select:none;">
      <span>${trait.get('label')}</span>
      <svg class="accordion-icon" width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="#64748b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
        style="flex-shrink:0;transition:transform 0.2s;transform:rotate(0deg);pointer-events:none;">
        <polyline points="9 18 15 12 9 6"></polyline>
      </svg>
    </div>
  `;
          return el;
        },
        onEvent({ elInput }: any) { }
      });

      // ════════════════════════════════════════════════
      // ACCORDION HELPERS
      // ════════════════════════════════════════════════

      const getWrapperEl = (header: HTMLElement): HTMLElement | null => {
        let node: HTMLElement | null = header;
        while (node) {
          if (
            node.classList.contains('gjs-trt-trait__wrp') ||
            node.classList.contains('gjs-trt-trait-container') ||
            (node.parentElement && node.parentElement.classList.contains('gjs-trt-traits'))
          ) {
            return node;
          }
          node = node.parentElement as HTMLElement | null;
        }
        return null;
      };

      const getSiblingWrappers = (wrapperEl: HTMLElement): HTMLElement[] => {
        const result: HTMLElement[] = [];
        let next = wrapperEl.nextElementSibling as HTMLElement | null;
        while (next) {
          if (next.querySelector('.trait-accordion-header')) break;
          result.push(next);
          next = next.nextElementSibling as HTMLElement | null;
        }
        return result;
      };

      const applyAccordionState = (header: HTMLElement) => {
        const isOpen = header.dataset.open === 'true';
        const icon = header.querySelector('.accordion-icon') as HTMLElement | null;
        if (icon) icon.style.transform = isOpen ? 'rotate(90deg)' : 'rotate(0deg)';

        const wrapperEl = getWrapperEl(header);
        if (!wrapperEl) return;

        getSiblingWrappers(wrapperEl).forEach(sibling => {
          if (isOpen) {
            sibling.classList.remove('accordion-collapsed');
          } else {
            sibling.classList.add('accordion-collapsed');
          }
        });
      };

      // LAYER 1 — capture-phase click
      const accordionClickHandler = (e: MouseEvent) => {
        const header = (e.target as Element).closest('.trait-accordion-header') as HTMLElement | null;
        if (!header) return;
        e.stopImmediatePropagation();
        header.dataset.open = header.dataset.open === 'true' ? 'false' : 'true';
        applyAccordionState(header);
      };
      document.addEventListener('click', accordionClickHandler, true);

      // LAYER 2 — initialize all headers (collapsed by default)
      const initAllAccordionHeaders = () => {
        document.querySelectorAll<HTMLElement>('.trait-accordion-header').forEach(header => {
          if (!header.dataset.open) header.dataset.open = 'false';
          applyAccordionState(header);
        });
      };

      // LAYER 3 — MutationObserver: re-apply state whenever traits panel changes
      let debounce: ReturnType<typeof setTimeout>;
      const observer = new MutationObserver(() => {
        clearTimeout(debounce);
        debounce = setTimeout(initAllAccordionHeaders, 150);
      });

      setTimeout(() => {
        const target =
          document.querySelector('#traits-container') ||
          document.querySelector('.gjs-trt-traits') ||
          document.body;
        observer.observe(target, { childList: true, subtree: true });
        initAllAccordionHeaders();
      }, 500);

      // ════════════════════════════════════════════════
      // SWIPER BLOCK + COMPONENTS
      // ════════════════════════════════════════════════

      // ─── SWIPER BLOCK + COMPONENTS ───

      editor.Components.addType('details', {
        isComponent: el => el.tagName === 'DETAILS',
        model: {
          defaults: {
            traits: [
              {
                type: 'checkbox',
                name: 'open',
                label: 'Accordion Open'
              }
            ]
          }
        }
      });

      editor.Components.addType('custom-tabs', {
        isComponent: el => {
          if (el && el.classList && el.classList.contains('tabs-container')) {
            return { type: 'custom-tabs' };
          }
        },
        model: {
          defaults: {
            script: function () {
              var container = this;
              var allTabs = Array.prototype.slice.call(container.querySelectorAll('.tab-item'));
              var allPanels = Array.prototype.slice.call(container.querySelectorAll('.tab-content-box'));

              allTabs.forEach(function (tabEl, index) {
                tabEl.addEventListener('click', function () {
                  allTabs.forEach(function (t) { t.classList.remove('active'); t.style.borderBottomColor = 'transparent'; t.style.color = '#4b5563'; });
                  allPanels.forEach(function (p) { p.classList.remove('active'); p.style.display = 'none'; });

                  tabEl.classList.add('active');
                  tabEl.style.borderBottomColor = '#6366f1';
                  tabEl.style.color = '#6366f1';

                  if (allPanels[index]) {
                    allPanels[index].classList.add('active');
                    allPanels[index].style.display = 'block';
                  }
                });
              });
            }
          }
        }
      });

      editor.BlockManager.add('tabs', {
        label: '<i class="fa fa-folder"></i><br/>Tabs',
        category: 'Basic',
        content: `
      <div data-gjs-type="custom-tabs" class="tabs-container" data-gjs-droppable="false" style="width: 100%; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; background: #fff;">
        <div style="display: flex; border-bottom: 1px solid #e5e7eb; background: #f9fafb;" data-gjs-droppable="false">
          <div class="tab-item active" data-gjs-droppable="false" style="padding: 12px 24px; cursor: pointer; font-weight: 600; font-size: 14px; border-bottom: 2px solid #6366f1; color: #6366f1; transition: all 0.2s;">Tab 1</div>
          <div class="tab-item" data-gjs-droppable="false" style="padding: 12px 24px; cursor: pointer; font-weight: 500; font-size: 14px; border-bottom: 2px solid transparent; color: #4b5563; transition: all 0.2s;">Tab 2</div>
          <div class="tab-item" data-gjs-droppable="false" style="padding: 12px 24px; cursor: pointer; font-weight: 500; font-size: 14px; border-bottom: 2px solid transparent; color: #4b5563; transition: all 0.2s;">Tab 3</div>
        </div>
        <div style="padding: 24px;" data-gjs-droppable="false">
          <div class="tab-content-box active" data-gjs-droppable="true" style="display: block;">
            <h3 style="margin-top: 0;">Content for Tab 1</h3>
            <p>This is the first tab content. You can add text, images, or any other elements here.</p>
          </div>
          <div class="tab-content-box" data-gjs-droppable="true" style="display: none;">
            <h3 style="margin-top: 0;">Content for Tab 2</h3>
            <p>This is the second tab content. Customize it to your needs.</p>
          </div>
          <div class="tab-content-box" data-gjs-droppable="true" style="display: none;">
            <h3 style="margin-top: 0;">Content for Tab 3</h3>
            <p>This is the third tab content area.</p>
          </div>
        </div>
      </div>
`
      });

      editor.BlockManager.add('swiper-slider', {
        label: '<i class="fa fa-arrows-h"></i><br/>Swiper Slider',
        category: 'Basic',
        content: `
  <div data-gjs-type="swiper-container"
       class="swiper-container my-swiper relative overflow-hidden bg-gray-100 min-h-[300px]"
       data-navigation="true"
       data-pagination="bullets"
       style="--swiper-navigation-color:#000;--swiper-pagination-color:#000;">
    <div data-gjs-type="swiper-wrapper" class="swiper-wrapper">
      <div data-gjs-type="swiper-slide" class="swiper-slide p-10 flex flex-col items-center justify-center bg-gray-200 min-h-[300px] w-full">Slide 1</div>
      <div data-gjs-type="swiper-slide" class="swiper-slide p-10 flex flex-col items-center justify-center bg-gray-300 min-h-[300px] w-full">Slide 2</div>
      <div data-gjs-type="swiper-slide" class="swiper-slide p-10 flex flex-col items-center justify-center bg-gray-400 min-h-[300px] w-full">Slide 3</div>
    </div>
    <div data-gjs-type="swiper-pagination" class="swiper-pagination absolute bottom-4 left-0 w-full flex justify-center gap-2"></div>
    <div data-gjs-type="swiper-button-prev" class="swiper-button-prev absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/50 rounded-full flex items-center justify-center cursor-pointer !text-black !scale-75" style="z-index:10;"></div>
    <div data-gjs-type="swiper-button-next" class="swiper-button-next absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/50 rounded-full flex items-center justify-center cursor-pointer !text-black !scale-75" style="z-index:10;"></div>
  </div>
`
      });

      // ─── SWIPER: Grid Slider Block (3 columns, cards layout) ───
      editor.BlockManager.add('swiper-grid', {
        label: '<i class="fa fa-th"></i><br/>Grid Slider',
        category: 'Basic',
        content: `
  <div data-gjs-type="swiper-container"
       class="swiper-container my-swiper relative overflow-hidden bg-white py-8"
       data-slides-per-view="3"
       data-space-between="24"
       data-navigation="true"
       data-pagination="bullets"
       style="--swiper-navigation-color:#6366f1;--swiper-pagination-color:#6366f1;">
    <div data-gjs-type="swiper-wrapper" class="swiper-wrapper">
      <div data-gjs-type="swiper-slide" class="swiper-slide" style="width:calc(33.333% - 16px)">
        <div style="background:#f9fafb;border-radius:12px;padding:24px;border:1px solid #e5e7eb;display:flex;flex-direction:column;gap:12px;height:100%;">
          <div style="width:100%;height:160px;background:linear-gradient(135deg,#6366f1,#818cf8);border-radius:8px;"></div>
          <h3 style="font-size:18px;font-weight:700;color:#111827;margin:0;">Grid Item 1</h3>
          <p style="font-size:14px;color:#6b7280;margin:0;line-height:1.6;">Description for this grid item. Add your content here.</p>
        </div>
      </div>
      <div data-gjs-type="swiper-slide" class="swiper-slide" style="width:calc(33.333% - 16px)">
        <div style="background:#f9fafb;border-radius:12px;padding:24px;border:1px solid #e5e7eb;display:flex;flex-direction:column;gap:12px;height:100%;">
          <div style="width:100%;height:160px;background:linear-gradient(135deg,#8b5cf6,#a78bfa);border-radius:8px;"></div>
          <h3 style="font-size:18px;font-weight:700;color:#111827;margin:0;">Grid Item 2</h3>
          <p style="font-size:14px;color:#6b7280;margin:0;line-height:1.6;">Description for this grid item. Add your content here.</p>
        </div>
      </div>
      <div data-gjs-type="swiper-slide" class="swiper-slide" style="width:calc(33.333% - 16px)">
        <div style="background:#f9fafb;border-radius:12px;padding:24px;border:1px solid #e5e7eb;display:flex;flex-direction:column;gap:12px;height:100%;">
          <div style="width:100%;height:160px;background:linear-gradient(135deg,#ec4899,#f472b6);border-radius:8px;"></div>
          <h3 style="font-size:18px;font-weight:700;color:#111827;margin:0;">Grid Item 3</h3>
          <p style="font-size:14px;color:#6b7280;margin:0;line-height:1.6;">Description for this grid item. Add your content here.</p>
        </div>
      </div>
      <div data-gjs-type="swiper-slide" class="swiper-slide" style="width:calc(33.333% - 16px)">
        <div style="background:#f9fafb;border-radius:12px;padding:24px;border:1px solid #e5e7eb;display:flex;flex-direction:column;gap:12px;height:100%;">
          <div style="width:100%;height:160px;background:linear-gradient(135deg,#f59e0b,#fbbf24);border-radius:8px;"></div>
          <h3 style="font-size:18px;font-weight:700;color:#111827;margin:0;">Grid Item 4</h3>
          <p style="font-size:14px;color:#6b7280;margin:0;line-height:1.6;">Description for this grid item. Add your content here.</p>
        </div>
      </div>
    </div>
    <div data-gjs-type="swiper-pagination" class="swiper-pagination" style="position:relative;margin-top:20px;text-align:center;"></div>
    <div data-gjs-type="swiper-button-prev" class="swiper-button-prev" style="color:#6366f1;"></div>
    <div data-gjs-type="swiper-button-next" class="swiper-button-next" style="color:#6366f1;"></div>
  </div>
`
      });

      // ─── SWIPER: Card Slider Block (image + text cards) ───
      editor.BlockManager.add('swiper-cards', {
        label: '<i class="fa fa-id-card"></i><br/>Card Slider',
        category: 'Basic',
        content: `
  <div data-gjs-type="swiper-container"
       class="swiper-container my-swiper relative overflow-hidden bg-gray-50 py-10"
       data-slides-per-view="1"
       data-navigation="true"
       data-pagination="fraction"
       data-effect="slide"
       style="--swiper-navigation-color:#111827;--swiper-pagination-color:#111827;">
    <div data-gjs-type="swiper-wrapper" class="swiper-wrapper">
      <div data-gjs-type="swiper-slide" class="swiper-slide w-full" style="display:flex;align-items:center;justify-content:center;padding:40px 80px;gap:60px;min-height:400px;">
        <div style="flex:0 0 45%;height:300px;background:linear-gradient(135deg,#1e1b4b,#312e81);border-radius:16px;overflow:hidden;">
          <img src="https://picsum.photos/seed/card1/600/400" alt="Slide Image" style="width:100%;height:100%;object-fit:cover;"/>
        </div>
        <div style="flex:1;display:flex;flex-direction:column;gap:16px;">
          <span style="font-size:12px;font-weight:600;color:#6366f1;text-transform:uppercase;letter-spacing:2px;">Category</span>
          <h2 style="font-size:32px;font-weight:800;color:#111827;margin:0;line-height:1.2;">Card Title One</h2>
          <p style="font-size:16px;color:#4b5563;margin:0;line-height:1.7;">This is a beautifully designed card slide. Add your description text here. This layout is perfect for showcasing features, testimonials, or portfolio items.</p>
          <a href="#" style="display:inline-flex;align-items:center;gap:8px;background:#6366f1;color:#fff;padding:12px 28px;border-radius:8px;font-weight:600;font-size:15px;text-decoration:none;width:fit-content;">Learn More →</a>
        </div>
      </div>
      <div data-gjs-type="swiper-slide" class="swiper-slide w-full" style="display:flex;align-items:center;justify-content:center;padding:40px 80px;gap:60px;min-height:400px;">
        <div style="flex:0 0 45%;height:300px;background:linear-gradient(135deg,#065f46,#059669);border-radius:16px;overflow:hidden;">
          <img src="https://picsum.photos/seed/card2/600/400" alt="Slide Image" style="width:100%;height:100%;object-fit:cover;"/>
        </div>
        <div style="flex:1;display:flex;flex-direction:column;gap:16px;">
          <span style="font-size:12px;font-weight:600;color:#059669;text-transform:uppercase;letter-spacing:2px;">Category</span>
          <h2 style="font-size:32px;font-weight:800;color:#111827;margin:0;line-height:1.2;">Card Title Two</h2>
          <p style="font-size:16px;color:#4b5563;margin:0;line-height:1.7;">Second slide with a different color scheme. Customize the image, title, description, and button to match your content.</p>
          <a href="#" style="display:inline-flex;align-items:center;gap:8px;background:#059669;color:#fff;padding:12px 28px;border-radius:8px;font-weight:600;font-size:15px;text-decoration:none;width:fit-content;">Learn More →</a>
        </div>
      </div>
      <div data-gjs-type="swiper-slide" class="swiper-slide w-full" style="display:flex;align-items:center;justify-content:center;padding:40px 80px;gap:60px;min-height:400px;">
        <div style="flex:0 0 45%;height:300px;background:linear-gradient(135deg,#7c2d12,#dc2626);border-radius:16px;overflow:hidden;">
          <img src="https://picsum.photos/seed/card3/600/400" alt="Slide Image" style="width:100%;height:100%;object-fit:cover;"/>
        </div>
        <div style="flex:1;display:flex;flex-direction:column;gap:16px;">
          <span style="font-size:12px;font-weight:600;color:#dc2626;text-transform:uppercase;letter-spacing:2px;">Category</span>
          <h2 style="font-size:32px;font-weight:800;color:#111827;margin:0;line-height:1.2;">Card Title Three</h2>
          <p style="font-size:16px;color:#4b5563;margin:0;line-height:1.7;">Third slide. Each slide can have its own unique design, image, and call to action button to drive conversions.</p>
          <a href="#" style="display:inline-flex;align-items:center;gap:8px;background:#dc2626;color:#fff;padding:12px 28px;border-radius:8px;font-weight:600;font-size:15px;text-decoration:none;width:fit-content;">Learn More →</a>
        </div>
      </div>
    </div>
    <div data-gjs-type="swiper-pagination" class="swiper-pagination" style="position:absolute;bottom:20px;width:100%;text-align:center;font-size:14px;font-weight:600;color:#111827;"></div>
    <div data-gjs-type="swiper-button-prev" class="swiper-button-prev" style="color:#111827;background:rgba(255,255,255,0.9);border-radius:50%;width:44px;height:44px;z-index:10;"></div>
    <div data-gjs-type="swiper-button-next" class="swiper-button-next" style="color:#111827;background:rgba(255,255,255,0.9);border-radius:50%;width:44px;height:44px;z-index:10;"></div>
  </div>
`
      });

      // ─── SWIPER: Hero Slider Block (full-width hero with background image) ───
      editor.BlockManager.add('swiper-hero', {
        label: '<i class="fa fa-image"></i><br/>Hero Slider',
        category: 'Basic',
        content: `
  <div data-gjs-type="swiper-container"
       class="swiper-container my-swiper relative overflow-hidden"
       data-slides-per-view="1"
       data-navigation="true"
       data-pagination="bullets"
       data-autoplay="true"
       data-autoplay-delay="4000"
       data-effect="fade"
       style="--swiper-navigation-color:#fff;--swiper-pagination-color:#fff;min-height:500px;">
    <div data-gjs-type="swiper-wrapper" class="swiper-wrapper">
      <div data-gjs-type="swiper-slide" class="swiper-slide w-full" style="position:relative;min-height:500px;background:linear-gradient(135deg,#1e1b4b 0%,#312e81 50%,#4f46e5 100%);display:flex;align-items:center;justify-content:center;">
        <div style="text-align:center;color:#fff;padding:40px;max-width:700px;">
          <span style="font-size:13px;font-weight:600;letter-spacing:3px;text-transform:uppercase;opacity:0.8;display:block;margin-bottom:16px;">Welcome to Our Platform</span>
          <h1 style="font-size:52px;font-weight:900;margin:0 0 20px;line-height:1.1;">Hero Slide One</h1>
          <p style="font-size:18px;opacity:0.85;margin:0 0 32px;line-height:1.7;">Powerful hero section with full-width background. Perfect for landing pages, portfolios, and product showcases.</p>
          <div style="display:flex;gap:16px;justify-content:center;flex-wrap:wrap;">
            <a href="#" style="background:#fff;color:#4f46e5;padding:14px 32px;border-radius:8px;font-weight:700;font-size:16px;text-decoration:none;">Get Started</a>
            <a href="#" style="border:2px solid rgba(255,255,255,0.6);color:#fff;padding:14px 32px;border-radius:8px;font-weight:600;font-size:16px;text-decoration:none;">Learn More</a>
          </div>
        </div>
      </div>
      <div data-gjs-type="swiper-slide" class="swiper-slide w-full" style="position:relative;min-height:500px;background:linear-gradient(135deg,#064e3b 0%,#065f46 50%,#059669 100%);display:flex;align-items:center;justify-content:center;">
        <div style="text-align:center;color:#fff;padding:40px;max-width:700px;">
          <span style="font-size:13px;font-weight:600;letter-spacing:3px;text-transform:uppercase;opacity:0.8;display:block;margin-bottom:16px;">Discover More</span>
          <h1 style="font-size:52px;font-weight:900;margin:0 0 20px;line-height:1.1;">Hero Slide Two</h1>
          <p style="font-size:18px;opacity:0.85;margin:0 0 32px;line-height:1.7;">Each hero slide can have its own gradient background, headline, and call-to-action buttons. Customize freely.</p>
          <div style="display:flex;gap:16px;justify-content:center;flex-wrap:wrap;">
            <a href="#" style="background:#fff;color:#059669;padding:14px 32px;border-radius:8px;font-weight:700;font-size:16px;text-decoration:none;">Get Started</a>
            <a href="#" style="border:2px solid rgba(255,255,255,0.6);color:#fff;padding:14px 32px;border-radius:8px;font-weight:600;font-size:16px;text-decoration:none;">Learn More</a>
          </div>
        </div>
      </div>
      <div data-gjs-type="swiper-slide" class="swiper-slide w-full" style="position:relative;min-height:500px;background:linear-gradient(135deg,#450a0a 0%,#7f1d1d 50%,#dc2626 100%);display:flex;align-items:center;justify-content:center;">
        <div style="text-align:center;color:#fff;padding:40px;max-width:700px;">
          <span style="font-size:13px;font-weight:600;letter-spacing:3px;text-transform:uppercase;opacity:0.8;display:block;margin-bottom:16px;">Take Action</span>
          <h1 style="font-size:52px;font-weight:900;margin:0 0 20px;line-height:1.1;">Hero Slide Three</h1>
          <p style="font-size:18px;opacity:0.85;margin:0 0 32px;line-height:1.7;">Third hero slide. Use autoplay to automatically cycle through slides and keep your visitors engaged.</p>
          <div style="display:flex;gap:16px;justify-content:center;flex-wrap:wrap;">
            <a href="#" style="background:#fff;color:#dc2626;padding:14px 32px;border-radius:8px;font-weight:700;font-size:16px;text-decoration:none;">Get Started</a>
            <a href="#" style="border:2px solid rgba(255,255,255,0.6);color:#fff;padding:14px 32px;border-radius:8px;font-weight:600;font-size:16px;text-decoration:none;">Learn More</a>
          </div>
        </div>
      </div>
    </div>
    <div data-gjs-type="swiper-pagination" class="swiper-pagination" style="position:absolute;bottom:24px;width:100%;text-align:center;z-index:10;"></div>
    <div data-gjs-type="swiper-button-prev" class="swiper-button-prev" style="color:#fff;z-index:10;"></div>
    <div data-gjs-type="swiper-button-next" class="swiper-button-next" style="color:#fff;z-index:10;"></div>
  </div>
`
      });

      // ── reinitSwiper: destroy old instance and create new one in the canvas ──
      const reinitSwiper = (component: any, retryCount = 0) => {
        const canvasWin = editor.Canvas.getWindow() as any;

        // If Swiper not loaded yet, retry up to 10 times (5 seconds)
        if (typeof canvasWin.Swiper === 'undefined') {
          if (retryCount < 10) {
            setTimeout(() => reinitSwiper(component, retryCount + 1), 500);
          } else {
            console.warn('Swiper: CDN script not loaded after retries');
          }
          return;
        }

        const el = component.getEl() as HTMLElement | null;
        if (!el) return;

        // Destroy old swiper instance
        if ((el as any).__swiper) {
          try { (el as any).__swiper.destroy(true, true); } catch (_) { }
          (el as any).__swiper = null;
        }

        // --- CRITICAL CLEANUP ---
        el.classList.remove('swiper-initialized', 'swiper-horizontal', 'swiper-vertical', 'swiper-backface-hidden');
        el.querySelectorAll('.swiper-slide-duplicate').forEach((dup) => dup.remove());
        el.querySelectorAll('.swiper-slide').forEach((s: any) => {
          s.classList.remove('swiper-slide-active', 'swiper-slide-next', 'swiper-slide-prev', 'swiper-slide-visible');
          s.removeAttribute('data-swiper-slide-index');
          s.style.opacity = '';
          s.style.transform = '';
          s.style.width = '';
          s.style.margin = '';
        });
        el.querySelectorAll('.swiper-wrapper').forEach((w: any) => {
          w.removeAttribute('style');
          w.style.transform = '';
        });
        const paginationEl = el.querySelector('.swiper-pagination');
        if (paginationEl) paginationEl.innerHTML = '';
        // -------------------------

        const attrs = component.getAttributes();
        const bool = (k: string) => {
          let v = attrs[k];
          const kebab = k.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
          if ((v === undefined || v === false || v === 'false') && attrs['data-' + kebab] !== undefined) v = attrs['data-' + kebab];
          if ((v === undefined || v === false || v === 'false') && el.dataset && el.dataset[k] !== undefined) v = el.dataset[k];
          return v !== undefined && v !== null && String(v) !== 'false';
        };
        const num = (k: string, fb: number) => {
          let v = attrs[k];
          const kebab = k.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
          if ((v === undefined || v === fb || v === String(fb)) && attrs['data-' + kebab] !== undefined) v = attrs['data-' + kebab];
          if ((v === undefined || v === fb || v === String(fb)) && el.dataset && el.dataset[k] !== undefined) v = el.dataset[k];
          return parseFloat(String(v ?? fb)) || fb;
        };
        const str = (k: string, fb: string) => {
          let v = attrs[k];
          const kebab = k.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
          if ((v === undefined || v === fb) && attrs['data-' + kebab] !== undefined) v = attrs['data-' + kebab];
          if ((v === undefined || v === fb) && el.dataset && el.dataset[k] !== undefined) v = el.dataset[k];
          return v !== undefined ? String(v) : fb;
        };

        const props: any = {
          observer: true,
          observeParents: true,
          direction: bool('vertical') ? 'vertical' : 'horizontal',
          loop: bool('loop') !== false ? true : false, // Default to true if not explicitly false
          freeMode: bool('freeMode'),
          autoHeight: bool('autoHeight'),
          initialSlide: num('initialSlide', 0),
          speed: num('speed', 300),
          effect: str('effect', 'slide'),
          parallax: bool('parallax'),
          slidesPerView: num('slidesPerView', 2), // Default 2
          spaceBetween: num('spaceBetween', 30), // Default 30
          slidesPerGroup: num('slidesPerGroup', 1),
          centeredSlides: bool('centeredSlides'),
          rewind: bool('rewind'),
          keyboard: bool('keyboard') ? { enabled: true } : false,
          mousewheel: bool('mousewheel'),
          grabCursor: bool('grabCursor'),
          lazy: bool('lazy') ? { loadPrevNext: true } : false,
        };

        if (bool('autoplay')) {
          props.autoplay = {
            delay: num('autoplayDelay', 3000),
            disableOnInteraction: bool('autoplayDisableOnInteraction'),
            pauseOnMouseEnter: bool('autoplayPauseOnMouseEnter'),
            reverseDirection: bool('autoplayReverseDirection'),
          };
        } else {
          props.autoplay = false;
        }

        if (bool('navigation')) {
          props.navigation = {
            nextEl: el.querySelector('.swiper-button-next'),
            prevEl: el.querySelector('.swiper-button-prev'),
          };
        }

        props.pagination = {
          el: el.querySelector('.swiper-pagination'),
          type: str('pagination', 'bullets') || 'bullets',
          clickable: true,
        };

        if (bool('scrollbar')) {
          props.scrollbar = { el: el.querySelector('.swiper-scrollbar'), hide: true };
        }

        // Apply Responsive Breakpoints (Mobile First)
        props.breakpoints = {
          // Mobile (0px and up)
          320: {
            slidesPerView: 1,
            spaceBetween: 10
          },
          // Tablet (768px and up)
          768: {
            slidesPerView: props.slidesPerView > 1 ? 2 : 1,
            spaceBetween: 20
          },
          // Desktop (1024px and up)
          1024: {
            slidesPerView: props.slidesPerView,
            spaceBetween: props.spaceBetween
          }
        };

        // For mobile-first Swiper, the base slidesPerView should be 1, but we use breakpoints to scale it up.
        // So we override the base slidesPerView to 1, and let breakpoints handle the rest.
        props.slidesPerView = 1;

        try {
          (el as any).__swiper = new canvasWin.Swiper(el, props);
          console.log('✅ Swiper reinit OK — slidesPerView:', props.slidesPerView, 'effect:', props.effect);
        } catch (err) {
          console.warn('Swiper reinit error:', err);
        }
      };


      const SWIPER_TRAIT_NAMES = [
        'vertical', 'loop', 'freeMode', 'autoHeight', 'navigation', 'initialSlide', 'speed', 'effect',
        'autoplay', 'autoplayDelay', 'autoplayDisableOnInteraction', 'autoplayPauseOnMouseEnter',
        'autoplayReverseDirection', 'pagination', 'dynamicBullets', 'clickableBullets', 'scrollbar',
        'parallax', 'mobileBreakpoint', 'tabletBreakpoint', 'slidesPerView', 'spaceBetween',
        'slidesPerGroup', 'centeredSlides', 'rewind', 'keyboard', 'mousewheel', 'grabCursor', 'lazy',
      ];

      editor.Components.addType('swiper-container', {
        extend: 'default',
        isComponent: el => {
          if (el.classList && el.classList.contains('swiper-container')) {
            return { type: 'swiper-container' };
          }
        },
        model: {
          defaults: {
            name: 'Swiper Slider',
            traits: [
              { type: 'checkbox', name: 'vertical', label: 'Vertical', valueTrue: 'true', valueFalse: 'false' },
              { type: 'checkbox', name: 'loop', label: 'Loop', valueTrue: 'true', valueFalse: 'false' },
              { type: 'checkbox', name: 'freeMode', label: 'Free Mode', valueTrue: 'true', valueFalse: 'false' },
              { type: 'checkbox', name: 'autoHeight', label: 'Auto Height', valueTrue: 'true', valueFalse: 'false' },
              { type: 'checkbox', name: 'navigation', label: 'Navigation', valueTrue: 'true', valueFalse: 'false', value: 'true' },
              { type: 'number', name: 'initialSlide', label: 'Initial Slide', value: 0 },
              { type: 'number', name: 'speed', label: 'Speed (ms)', value: 300 },

              { type: 'accordion-header', name: 'hdr-effects', label: 'Effects' },
              {
                type: 'select', name: 'effect', label: 'Effect Type',
                options: [
                  { id: 'slide', name: 'Slide' },
                  { id: 'fade', name: 'Fade' },
                  { id: 'cube', name: 'Cube' },
                  { id: 'coverflow', name: 'Coverflow' },
                  { id: 'flip', name: 'Flip' },
                ]
              },

              { type: 'accordion-header', name: 'hdr-autoplay', label: 'Autoplay' },
              { type: 'checkbox', name: 'autoplay', label: 'Enable Autoplay', valueTrue: 'true', valueFalse: 'false' },
              { type: 'number', name: 'autoplayDelay', label: 'Autoplay Delay (ms)', value: 3000 },
              { type: 'checkbox', name: 'autoplayDisableOnInteraction', label: 'Disable on Interaction', valueTrue: 'true', valueFalse: 'false', value: 'true' },
              { type: 'checkbox', name: 'autoplayPauseOnMouseEnter', label: 'Pause on Hover', valueTrue: 'true', valueFalse: 'false' },
              { type: 'checkbox', name: 'autoplayReverseDirection', label: 'Reverse Direction', valueTrue: 'true', valueFalse: 'false' },

              { type: 'accordion-header', name: 'hdr-pagination', label: 'Pagination' },
              {
                type: 'select', name: 'pagination', label: 'Pagination Type',
                options: [
                  { id: '', name: 'None' },
                  { id: 'bullets', name: 'Bullets' },
                  { id: 'fraction', name: 'Fraction' },
                  { id: 'progressbar', name: 'Progressbar' },
                ]
              },
              { type: 'checkbox', name: 'dynamicBullets', label: 'Dynamic Bullets', valueTrue: 'true', valueFalse: 'false' },
              { type: 'checkbox', name: 'clickableBullets', label: 'Clickable Bullets', valueTrue: 'true', valueFalse: 'false' },

              { type: 'accordion-header', name: 'hdr-scrollbar', label: 'Scrollbar' },
              { type: 'checkbox', name: 'scrollbar', label: 'Enable Scrollbar', valueTrue: 'true', valueFalse: 'false' },

              { type: 'accordion-header', name: 'hdr-parallax', label: 'Parallax' },
              { type: 'checkbox', name: 'parallax', label: 'Enable Parallax', valueTrue: 'true', valueFalse: 'false' },

              { type: 'accordion-header', name: 'hdr-responsive', label: 'Responsive' },
              { type: 'checkbox', name: 'mobileBreakpoint', label: 'Enable Mobile Breakpoint', valueTrue: 'true', valueFalse: 'false' },
              { type: 'checkbox', name: 'tabletBreakpoint', label: 'Enable Tablet Breakpoint', valueTrue: 'true', valueFalse: 'false' },

              { type: 'accordion-header', name: 'hdr-extra', label: 'Extra' },
              { type: 'number', name: 'slidesPerView', label: 'Slides Per View', value: 1, step: 0.1 },
              { type: 'number', name: 'spaceBetween', label: 'Space Between', value: 0 },

              { type: 'accordion-header', name: 'hdr-layout', label: 'Layout' },
              { type: 'number', name: 'slidesPerGroup', label: 'Slides Per Group', value: 1 },
              { type: 'checkbox', name: 'centeredSlides', label: 'Centered Slides', valueTrue: 'true', valueFalse: 'false' },
              { type: 'checkbox', name: 'rewind', label: 'Rewind', valueTrue: 'true', valueFalse: 'false' },

              { type: 'accordion-header', name: 'hdr-controls', label: 'Controls' },
              { type: 'checkbox', name: 'keyboard', label: 'Keyboard Control', valueTrue: 'true', valueFalse: 'false' },
              { type: 'checkbox', name: 'mousewheel', label: 'Mousewheel Control', valueTrue: 'true', valueFalse: 'false' },
              { type: 'checkbox', name: 'grabCursor', label: 'Grab Cursor', valueTrue: 'true', valueFalse: 'false' },

              { type: 'accordion-header', name: 'hdr-lazy', label: 'Lazy Loading' },
              { type: 'checkbox', name: 'lazy', label: 'Lazy Load Images', valueTrue: 'true', valueFalse: 'false' },
            ] as any,
          },

          init() {
            // Nuke any legacy script saved in the DB that causes infinite MutationObserver loops
            this.set('script', '');

            (this as any).triggerReinit = () => reinitSwiper(this);
            (this as any)._lastSwiperTraits = '';

            this.on('change:attributes', () => {
              const attrs = this.getAttributes();

              // Only reinit if a Swiper-related trait actually changed
              const currentTraits = SWIPER_TRAIT_NAMES.reduce((acc, name) => {
                acc[name] = attrs[name];
                return acc;
              }, {} as any);
              const currentTraitsStr = JSON.stringify(currentTraits);

              if ((this as any)._lastSwiperTraits === currentTraitsStr) {
                return; // Prevent infinite loops from DOM mutations syncing back
              }
              (this as any)._lastSwiperTraits = currentTraitsStr;

              const el = this.getEl() as HTMLElement | null;
              if (el) {
                SWIPER_TRAIT_NAMES.forEach(name => {
                  const val = attrs[name];
                  if (val !== undefined && val !== null) {
                    el.dataset[name] = String(val);
                  } else {
                    delete el.dataset[name]; // Clean up dataset if trait is removed
                  }
                });
              }
              reinitSwiper(this);
            });

            // Initialize Swiper on component mount
            setTimeout(() => (this as any).triggerReinit(), 500);
          }
        }
      });

      editor.Components.addType('swiper-wrapper', {
        isComponent: el => el.classList && el.classList.contains('swiper-wrapper'),
        model: {
          defaults: {
            name: 'Swiper Wrapper',
            draggable: '[data-gjs-type="swiper-container"]',
            droppable: '[data-gjs-type="swiper-slide"]',
            selectable: false,
            hoverable: false,
          }
        }
      });

      editor.Components.addType('swiper-slide', {
        isComponent: el => el.classList && el.classList.contains('swiper-slide'),
        model: {
          defaults: {
            name: 'Swiper Slide',
            draggable: '[data-gjs-type="swiper-wrapper"]',
            droppable: true,
          }
        }
      });

      editor.Components.addType('swiper-pagination', {
        isComponent: el => el.classList && el.classList.contains('swiper-pagination'),
        model: {
          defaults: { name: 'Pagination', selectable: false, hoverable: false, droppable: false },
          init() { this.set('script', ''); }
        }
      });

      editor.Components.addType('swiper-button-prev', {
        isComponent: el => el.classList && el.classList.contains('swiper-button-prev'),
        model: {
          defaults: { name: 'Prev Button', selectable: false, hoverable: false, droppable: false },
          init() { this.set('script', ''); }
        }
      });

      editor.Components.addType('swiper-button-next', {
        isComponent: el => el.classList && el.classList.contains('swiper-button-next'),
        model: {
          defaults: { name: 'Next Button', selectable: false, hoverable: false, droppable: false },
          init() { this.set('script', ''); }
        }
      });
    };
    const editor = grapesjs.init({
      container: '#gjs',
      height: '100%',
      width: 'auto',
      fromElement: false,
      storageManager: false,
      undoManager: { trackSelection: false },
      parser: {
        optionsHtml: {
          allowScripts: true
        }
      },
      plugins: [grapesjsPresetWebpage, grapesjsBlocksBasic, pickrColorPlugin, customSwiperPlugin],
      pluginsOpts: {
        'grapesjs-preset-webpage': {
          blocksBasicOpts: { flexGrid: true },
          addBasicStyle: true,
        },
        'grapesjs-blocks-basic': { flexGrid: true },
      },
      canvas: {
        styles: [
          'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700;800;900&family=Montserrat:wght@300;400;600;700;800&family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Dancing+Script:wght@600&family=DM+Serif+Display&family=Manrope:wght@300;400;600;700&family=Outfit:wght@300;400;600;700&family=Public+Sans:wght@300;400;600;700&display=swap',
          'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
          'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200',
          'https://fonts.googleapis.com/icon?family=Material+Icons',
          // Swiper CSS is injected directly via npm package (see SwiperBundle injection below)
        ],
        scripts: [
          'https://cdn.tailwindcss.com',
        ],
      },
      deviceManager: {
        devices: [
          { id: 'desktop', name: 'Desktop', width: '' },
          { id: 'tablet', name: 'Tablet', width: '768px', widthMedia: '992px' },
          { id: 'mobile', name: 'Mobile', width: '375px', widthMedia: '480px' },
        ],
      },
      panels: { defaults: [] },
      selectorManager: {
        componentFirst: true,
        appendTo: '#selectors-container',
      },
      styleManager: {
        appendTo: '#styles-container',
        sectors: [
          {
            id: 'layout',
            name: 'Layout',
            open: false,
            buildProps: ['display', 'flex-direction', 'justify-content', 'align-items', 'flex-wrap', 'align-content', 'gap', 'row-gap', 'column-gap'],
          },
          {
            id: 'size',
            name: 'Size',
            open: false,
            buildProps: ['width', 'height', 'min-width', 'min-height', 'max-width', 'max-height', 'object-fit', 'object-position'],
            properties: [
              {
                property: 'object-fit',
                type: 'select',
                default: 'fill',
                options: [
                  { id: 'fill', name: 'Fill' },
                  { id: 'contain', name: 'Contain' },
                  { id: 'cover', name: 'Cover' },
                  { id: 'none', name: 'None' },
                  { id: 'scale-down', name: 'Scale-down' }
                ]
              }
            ]
          },
          {
            id: 'space',
            name: 'Space',
            open: false,
            buildProps: ['padding', 'margin'],
          },
          {
            id: 'position',
            name: 'Position',
            open: false,
            buildProps: ['position', 'top', 'right', 'bottom', 'left', 'z-index'],
            properties: [
              {
                property: 'position',
                type: 'select',
                default: 'static',
                options: [
                  { id: 'static', name: 'Static' },
                  { id: 'relative', name: 'Relative' },
                  { id: 'absolute', name: 'Absolute' },
                  { id: 'fixed', name: 'Fixed' },
                  { id: 'sticky', name: 'Sticky' }
                ]
              }
            ]
          },
          {
            id: 'typography',
            name: 'Typography',
            open: false,
            buildProps: ['font-family', 'font-size', 'font-weight', 'letter-spacing', 'color', 'line-height', 'text-align', 'text-decoration', 'vertical-align', 'text-transform', 'direction'],
            properties: [
              {
                property: 'color',
                type: 'pickr-color',
              },
              {
                property: 'text-align',
                type: 'select',
                default: 'left',
                options: [
                  { id: 'left', name: 'Left' },
                  { id: 'center', name: 'Center' },
                  { id: 'right', name: 'Right' },
                  { id: 'justify', name: 'Justify' }
                ]
              },
              {
                property: 'text-decoration',
                type: 'select',
                default: 'none',
                options: [
                  { id: 'none', name: 'None' },
                  { id: 'underline', name: 'Underline' },
                  { id: 'overline', name: 'Overline' },
                  { id: 'line-through', name: 'Line-through' }
                ]
              },
              {
                property: 'text-transform',
                type: 'select',
                default: 'none',
                options: [
                  { id: 'none', name: 'None' },
                  { id: 'capitalize', name: 'Capitalize' },
                  { id: 'uppercase', name: 'Uppercase' },
                  { id: 'lowercase', name: 'Lowercase' }
                ]
              },
              {
                property: 'vertical-align',
                type: 'select',
                default: 'baseline',
                options: [
                  { id: 'baseline', name: 'Baseline' },
                  { id: 'top', name: 'Top' },
                  { id: 'middle', name: 'Middle' },
                  { id: 'bottom', name: 'Bottom' }
                ]
              },
              {
                property: 'direction',
                type: 'select',
                default: 'ltr',
                options: [
                  { id: 'ltr', name: 'LTR' },
                  { id: 'rtl', name: 'RTL' }
                ]
              }
            ]
          },
          {
            id: 'background',
            name: 'Background',
            open: false,
            buildProps: ['background-color', 'background-image', 'background-repeat', 'background-position', 'background-attachment', 'background-size', 'background-clip'],
            properties: [
              {
                property: 'background-color',
                type: 'pickr-color',
              },
              { property: 'background-repeat', name: 'Bg Repeat' },
              { property: 'background-position', name: 'Bg Position' },
              { property: 'background-attachment', name: 'Bg Attach' },
              { property: 'background-size', name: 'Bg Size' },
              {
                property: 'background-clip',
                name: 'Clip',
                type: 'select',
                full: true,
                default: 'border-box',
                options: [
                  { id: 'border-box', name: 'Border Box' },
                  { id: 'padding-box', name: 'Padding Box' },
                  { id: 'content-box', name: 'Content Box' },
                  { id: 'text', name: 'Text' }
                ]
              }
            ]
          },
          {
            id: 'border',
            name: 'Border',
            open: false,
            buildProps: ['border-radius', 'border'],
          },
          {
            id: 'effects',
            name: 'Effects',
            open: false,
            buildProps: [
              'opacity', 'mix-blend-mode', 'cursor', 'box-shadow', 'text-shadow', 'filter', 'backdrop-filter',
              'transition', 'transform', 'transform-origin', 'overflow', 'backface-visibility', 'transform-style'
            ],
            properties: [
              {
                property: 'opacity',
                type: 'slider',
                full: true,
                min: 0,
                max: 1,
                step: 0.01,
                default: '1'
              },
              { extend: 'box-shadow' },
              { extend: 'text-shadow' },
              { extend: 'transition' },
              { extend: 'transform' },
              {
                property: 'filter',
                type: 'stack',
                layerSeparator: ' ',
                properties: [
                  { name: 'Value', property: 'filter-value', type: 'text', default: 'blur(5px)' }
                ]
              },
              {
                property: 'backdrop-filter',
                type: 'stack',
                layerSeparator: ' ',
                properties: [
                  { name: 'Value', property: 'backdrop-filter-value', type: 'text', default: 'blur(5px)' }
                ]
              },
              {
                property: 'mix-blend-mode',
                name: 'Blend mode',
                type: 'select',
                full: true,
                default: 'normal',
                options: [
                  { id: 'normal', name: 'Normal' },
                  { id: 'multiply', name: 'Multiply' },
                  { id: 'screen', name: 'Screen' },
                  { id: 'overlay', name: 'Overlay' },
                  { id: 'darken', name: 'Darken' },
                  { id: 'lighten', name: 'Lighten' },
                  { id: 'color-dodge', name: 'Color Dodge' },
                  { id: 'color-burn', name: 'Color Burn' },
                  { id: 'hard-light', name: 'Hard Light' },
                  { id: 'soft-light', name: 'Soft Light' },
                  { id: 'difference', name: 'Difference' },
                  { id: 'exclusion', name: 'Exclusion' },
                  { id: 'hue', name: 'Hue' },
                  { id: 'saturation', name: 'Saturation' },
                  { id: 'color', name: 'Color' },
                  { id: 'luminosity', name: 'Luminosity' }
                ]
              },
              {
                property: 'cursor',
                type: 'select',
                full: true,
                default: 'auto',
                options: [
                  { id: 'auto', name: 'Auto' },
                  { id: 'default', name: 'Default' },
                  { id: 'pointer', name: 'Pointer' },
                  { id: 'wait', name: 'Wait' },
                  { id: 'text', name: 'Text' },
                  { id: 'move', name: 'Move' },
                  { id: 'help', name: 'Help' },
                  { id: 'not-allowed', name: 'Not Allowed' },
                  { id: 'crosshair', name: 'Crosshair' },
                  { id: 'grab', name: 'Grab' },
                  { id: 'grabbing', name: 'Grabbing' }
                ]
              },
              {
                property: 'overflow',
                type: 'select',
                default: 'visible',
                options: [
                  { id: 'visible', name: 'Visible' },
                  { id: 'hidden', name: 'Hidden' },
                  { id: 'scroll', name: 'Scroll' },
                  { id: 'auto', name: 'Auto' }
                ]
              },
              {
                property: 'backface-visibility',
                name: 'Backface',
                type: 'select',
                default: 'visible',
                options: [
                  { id: 'visible', name: 'Visible' },
                  { id: 'hidden', name: 'Hidden' }
                ]
              },
              {
                property: 'transform-style',
                name: 'Children transform',
                type: 'select',
                default: 'flat',
                options: [
                  { id: 'flat', name: 'Flat' },
                  { id: 'preserve-3d', name: 'Preserve-3D' }
                ]
              }
            ]
          }
        ]
      },
      traitManager: { appendTo: '#traits-container' },
      layerManager: { appendTo: '#layers-container' },
      blockManager: { appendTo: '#blocks-container' },
    });

    // ─── Pre-Load Registration (Ensures existing HTML icons are typed correctly) ───
    editor.DomComponents.addType('icon', {
      isComponent: el => (el.tagName === 'I' || el.tagName === 'SPAN') &&
        (el.classList && (el.classList.contains('fa') || el.classList.contains('fas') || el.classList.contains('fab') || el.classList.contains('far'))),
      model: {
        defaults: {
          tagName: 'i',
          droppable: false,
          editable: false,
          resizable: true,
          // Explicitly allow all style properties
          stylable: [
            'color', 'font-size', 'width', 'height',
            'margin', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
            'padding', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
            'display', 'opacity', 'cursor', 'background-color',
            'border', 'border-radius', 'text-align',
            'position', 'top', 'right', 'bottom', 'left', 'z-index',
            'transform', 'transition', 'box-shadow',
          ],
          traits: [
            {
              type: 'button',
              text: 'Select Icon',
              full: true,
              command: 'open-icon-picker',
            }
          ]
        }
      }
    });

    editor.DomComponents.addType('input', {
      isComponent: el => el.tagName === 'INPUT',
      model: {
        defaults: {
          tagName: 'input',
          traits: [
            'id', 'name', 'placeholder', 'type', { type: 'checkbox', name: 'required', label: 'Required' },
            { type: 'text', label: 'Label Text', name: 'data-label' }
          ],
          attributes: { style: 'width: 100%; padding: 12px; border-radius: 8px; border: 1px solid #e5e7eb; outline: none; font-family: inherit;' }
        }
      }
    });

    editor.DomComponents.addType('textarea', {
      isComponent: el => el.tagName === 'TEXTAREA',
      model: {
        defaults: {
          tagName: 'textarea',
          traits: [
            'id', 'name', 'placeholder', { type: 'checkbox', name: 'required', label: 'Required' },
            { type: 'text', label: 'Label Text', name: 'data-label' }
          ],
          attributes: { style: 'width: 100%; padding: 12px; border-radius: 8px; border: 1px solid #e5e7eb; outline: none; min-height: 100px; font-family: inherit;' }
        }
      }
    });

    editor.DomComponents.addType('select', {
      isComponent: el => el.tagName === 'SELECT',
      model: {
        defaults: {
          tagName: 'select',
          traits: [
            'id', 'name', { type: 'checkbox', name: 'required', label: 'Required' },
            { type: 'text', label: 'Label Text', name: 'data-label' },
            {
              type: 'options',
              label: 'Options',
              name: 'options',
            }
          ],
          attributes: { style: 'width: 100%; padding: 12px; border-radius: 8px; border: 1px solid #e5e7eb; outline: none; background: #fff; font-family: inherit; min-height: 45px;' }
        }
      }
    });

    // ─── SELECT OPTIONS SYNC LOGIC ───
    editor.on('component:update:attributes:options-list', (component) => {
      if (component.get('tagName') !== 'select') return;
      const optionsStr = component.getAttributes()['options-list'];
      if (!optionsStr) return;

      try {
        const options = optionsStr.split(',').filter(Boolean).map((opt: string) => {
          const parts = opt.split(':');
          const val = parts[0]?.trim();
          const name = parts[1]?.trim() || val;
          return { tagName: 'option', attributes: { id: val }, content: name };
        });

        if (options.length > 0) {
          component.components().reset(options);
        }
      } catch (err) {
        console.error('Error parsing options-list:', err);
      }
    });

    editor.DomComponents.addType('checkbox', {
      isComponent: el => el.tagName === 'INPUT' && (el as HTMLInputElement).type === 'checkbox',
      model: {
        defaults: {
          tagName: 'input',
          traits: [
            'id', 'name', 'value', 'checked', { type: 'checkbox', name: 'required', label: 'Required' },
            { type: 'text', label: 'Label Text', name: 'data-label' }
          ],
          attributes: { type: 'checkbox', style: 'width: 16px; height: 16px; cursor: pointer;' }
        }
      }
    });

    editor.DomComponents.addType('radio', {
      isComponent: el => el.tagName === 'INPUT' && (el as HTMLInputElement).type === 'radio',
      model: {
        defaults: {
          tagName: 'input',
          traits: [
            'id', 'name', 'value', 'checked', { type: 'checkbox', name: 'required', label: 'Required' },
            { type: 'text', label: 'Label Text', name: 'data-label' }
          ],
          attributes: { type: 'radio', style: 'width: 16px; height: 16px; cursor: pointer;' }
        }
      }
    });

    editor.DomComponents.addType('button', {
      model: {
        defaults: {
          traits: [
            'name', 'type',
            { type: 'text', label: 'Label Text', name: 'text' }
          ],
          attributes: { style: 'background: #818cf8; color: #fff; padding: 12px 24px; border-radius: 50px; border: none; cursor: pointer; font-weight: 600; font-family: inherit;' }
        }
      }
    });

    editor.DomComponents.addType('custom-code', {
      isComponent: el => (el.classList && el.classList.contains('gjs-custom-code')) || el.getAttribute?.('data-gjs-type') === 'custom-code',
      model: {
        defaults: {
          tagName: 'div',
          name: 'Custom Code',
          classes: ['gjs-custom-code'],
          droppable: false,
          editable: false,
          attributes: { 'data-gjs-type': 'custom-code' },
          traits: [
            {
              type: 'button',
              text: 'Edit Code',
              full: true,
              command: 'open-custom-code-editor',
            }
          ],
        }
      }
    });

    // ─── Custom Code Editor Command ───
    editor.Commands.add('open-custom-code-editor', {
      run(editor, sender) {
        const selected = editor.getSelected();
        if (!selected) return;

        const modal = editor.Modal;
        const container = document.createElement('div');
        // Retrieve code: prioritize data-code, then inner content
        let currentCode = selected.getAttributes()['data-code'] || '';

        if (!currentCode) {
          // Fallback: try to get the inner HTML from components
          const components = selected.get('components');
          if (components && components.length > 0) {
            currentCode = selected.toHTML().replace(/^<div[^>]*>|<\/div>$/gi, '');
          } else {
            currentCode = selected.get('content') || '';
          }
        }

        // If it's the default placeholder, show empty string
        if (currentCode.includes('Click to Edit Custom Code') || currentCode.includes('Paste your HTML code here')) {
          currentCode = '';
        }

        container.style.backgroundColor = '#161622';
        container.style.padding = '20px';
        container.style.borderRadius = '12px';
        container.style.color = '#e5e7eb';

        container.innerHTML = `
          <div style="padding: 0 0 16px;">
            <p style="color: #94a3b8; font-size: 13px; margin: 0 0 12px;">Paste your HTML/Shortcode below and click "Save Changes"</p>
            <textarea id="custom-html-edit-input" rows="12" placeholder="&lt;div&gt;Your HTML here...&lt;/div&gt;"
              style="width:100%; background:#0f172a; color:#e5e7eb; border:1px solid #1f2937; border-radius:8px; padding:12px; font-family:'Fira Code',monospace; font-size:13px; outline:none; resize:vertical; box-sizing:border-box;"
            >${currentCode}</textarea>
          </div>
          <div style="display:flex; gap:10px; justify-content:flex-end; margin-top:8px;">
            <button id="custom-code-edit-cancel" style="background:#1f2937; color:#94a3b8; border:1px solid #1f2937; border-radius:8px; padding:8px 20px; cursor:pointer; font-size:13px;">Cancel</button>
            <button id="custom-code-edit-save" style="background:linear-gradient(135deg,#818cf8,#6366f1); color:#fff; border:none; border-radius:8px; padding:8px 20px; cursor:pointer; font-size:13px; font-weight:700;">Save Changes</button>
          </div>
        `;

        const btnSave = container.querySelector('#custom-code-edit-save') as HTMLButtonElement;
        const btnCancel = container.querySelector('#custom-code-edit-cancel') as HTMLButtonElement;
        const input = container.querySelector('#custom-html-edit-input') as HTMLTextAreaElement;

        btnSave.addEventListener('click', () => {
          const newHtml = input.value;
          // Store the raw code in a custom attribute for later editing
          selected.addAttributes({ 'data-code': newHtml });
          selected.set('content', newHtml);
          // Force re-render of components
          selected.components(newHtml);
          modal.close();
        });

        btnCancel.addEventListener('click', () => modal.close());

        modal.setTitle('Edit Custom Code');
        modal.setContent(container);
        modal.open();

        // Auto-focus and SELECT the text for easy replacement
        setTimeout(() => {
          input.focus();
          input.select();
        }, 50);
      }
    });

    // ─── Native GrapesJS Icon Picker Command ───
    editor.Commands.add('open-icon-picker', {
      run(editor, sender) {
        const selected = editor.getSelected();
        if (!selected) return;

        const modal = editor.Modal;
        const container = document.createElement('div');
        container.className = 'icon-picker-container';
        container.innerHTML = `
          <div style="padding: 10px; margin-bottom: 15px; background: #111827; border-radius: 8px;">
            <input type="text" id="icon-search" placeholder="Search icons..." 
              style="width: 100%; padding: 10px; background: #0f172a; border: 1px solid #1f2937; color: #fff; border-radius: 6px; outline: none;">
          </div>
          <div id="icon-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(60px, 1fr)); gap: 10px; max-height: 400px; overflow-y: auto; padding: 5px;">
          </div>
        `;

        const icons = [
          // General
          'fa-star', 'fa-heart', 'fa-user', 'fa-home', 'fa-search', 'fa-envelope',
          'fa-bell', 'fa-camera', 'fa-check', 'fa-times', 'fa-cog', 'fa-settings',
          'fa-arrow-right', 'fa-arrow-left', 'fa-arrow-up', 'fa-arrow-down',
          'fa-chevron-right', 'fa-chevron-left', 'fa-chevron-up', 'fa-chevron-down',
          'fa-play', 'fa-pause', 'fa-stop', 'fa-forward', 'fa-backward',
          // Files & Media
          'fa-music', 'fa-video', 'fa-image', 'fa-file', 'fa-folder', 'fa-file-pdf',
          'fa-file-word', 'fa-file-excel', 'fa-file-image', 'fa-file-video', 'fa-file-audio',
          'fa-file-code', 'fa-file-alt', 'fa-file-archive', 'fa-folder-open',
          // Actions
          'fa-edit', 'fa-save', 'fa-trash', 'fa-trash-alt', 'fa-copy', 'fa-cut', 'fa-paste',
          'fa-lock', 'fa-unlock', 'fa-key', 'fa-eye', 'fa-eye-slash', 'fa-download', 'fa-upload',
          'fa-share', 'fa-share-alt', 'fa-reply', 'fa-forward', 'fa-redo', 'fa-undo',
          'fa-print', 'fa-compress', 'fa-expand', 'fa-plus', 'fa-minus', 'fa-times-circle',
          'fa-check-circle', 'fa-info-circle', 'fa-exclamation-circle', 'fa-question-circle',
          // Security & Account
          'fa-shield-alt', 'fa-user-shield', 'fa-user-lock', 'fa-fingerprint',
          'fa-id-card', 'fa-id-badge', 'fa-address-card', 'fa-passport',
          // People & Social
          'fa-users', 'fa-user-friends', 'fa-user-plus', 'fa-user-minus', 'fa-user-check',
          'fa-comment', 'fa-comments', 'fa-thumbs-up', 'fa-thumbs-down',
          'fa-heart-broken', 'fa-hand-peace', 'fa-hands-helping',
          // Medical & Health
          'fa-user-md', 'fa-stethoscope', 'fa-tooth', 'fa-heartbeat', 'fa-heart',
          'fa-hospital', 'fa-ambulance', 'fa-pills', 'fa-syringe', 'fa-prescription-bottle',
          'fa-thermometer', 'fa-bandage', 'fa-brain', 'fa-capsules', 'fa-dna',
          'fa-first-aid', 'fa-flask', 'fa-microscope', 'fa-notes-medical',
          'fa-wheelchair', 'fa-user-nurse', 'fa-vials', 'fa-x-ray', 'fa-lungs',
          'fa-virus', 'fa-virus-slash', 'fa-hand-holding-medical', 'fa-laptop-medical',
          // Communication
          'fa-phone', 'fa-phone-alt', 'fa-phone-volume', 'fa-fax', 'fa-map-marker-alt',
          'fa-map', 'fa-globe', 'fa-globe-americas', 'fa-wifi', 'fa-satellite-dish',
          // Technology
          'fa-laptop', 'fa-mobile-alt', 'fa-tablet-alt', 'fa-desktop', 'fa-cloud',
          'fa-server', 'fa-database', 'fa-code', 'fa-terminal', 'fa-microchip',
          'fa-robot', 'fa-cogs', 'fa-code-branch', 'fa-bug', 'fa-plug',
          'fa-broadcast-tower', 'fa-satellite', 'fa-hard-drive', 'fa-memory',
          // Business & Finance
          'fa-calendar', 'fa-clock', 'fa-chart-bar', 'fa-chart-pie', 'fa-chart-line',
          'fa-shopping-cart', 'fa-credit-card', 'fa-wallet', 'fa-money-bill',
          'fa-money-check', 'fa-receipt', 'fa-percentage', 'fa-tag', 'fa-tags',
          'fa-barcode', 'fa-qrcode', 'fa-store', 'fa-cash-register',
          // Delivery & Transport
          'fa-gift', 'fa-truck', 'fa-plane', 'fa-car', 'fa-bicycle', 'fa-ship',
          'fa-train', 'fa-bus', 'fa-motorcycle', 'fa-rocket', 'fa-parachute-box',
          // Nature & Weather
          'fa-bolt', 'fa-fire', 'fa-leaf', 'fa-water', 'fa-sun', 'fa-moon',
          'fa-cloud-sun', 'fa-cloud-rain', 'fa-snowflake', 'fa-wind', 'fa-mountain',
          'fa-tree', 'fa-seedling', 'fa-paw', 'fa-dove', 'fa-fish',
          // Emoji
          'fa-smile', 'fa-grin', 'fa-laugh', 'fa-meh', 'fa-frown', 'fa-sad-cry',
          'fa-angry', 'fa-surprise', 'fa-kiss', 'fa-grimace', 'fa-tired',
          // Misc
          'fa-trophy', 'fa-medal', 'fa-award', 'fa-certificate', 'fa-graduation-cap',
          'fa-book', 'fa-bookmark', 'fa-newspaper', 'fa-pen', 'fa-pencil-alt',
          'fa-paint-brush', 'fa-palette', 'fa-magic', 'fa-wand-magic-sparkles',
          'fa-gem', 'fa-crown', 'fa-hat-wizard', 'fa-dice', 'fa-gamepad',
          'fa-headphones', 'fa-microphone', 'fa-camera-retro', 'fa-film',
          'fa-utensils', 'fa-coffee', 'fa-pizza-slice', 'fa-hamburger',
          'fa-glass-cheers', 'fa-cocktail', 'fa-wine-glass', 'fa-beer',
        ];


        const renderGrid = (filter = '') => {
          const grid = container.querySelector('#icon-grid')!;
          grid.innerHTML = '';
          icons.filter(i => i.includes(filter)).forEach(icon => {
            const btn = document.createElement('button');
            btn.style.cssText = 'display: flex; flex-direction: column; align-items: center; padding: 15px 5px; background: #111827; border: 1px solid #1f2937; border-radius: 8px; color: #e5e7eb; cursor: pointer; transition: all 0.2s;';
            btn.innerHTML = `<i class="fas ${icon}" style="font-size: 20px; margin-bottom: 5px;"></i><div style="font-size: 9px; opacity: 0.7; overflow: hidden; width: 100%; text-overflow: ellipsis;">${icon.replace('fa-', '')}</div>`;
            btn.onclick = () => {
              const classModels = selected.getClasses();
              const classes = Array.isArray(classModels) ? classModels : (classModels.models ? classModels.models.map((c: any) => c.id || c.get('name')) : []);

              const filteredClasses = classes.filter((c: string) => !c.startsWith('fa-') && c !== 'fas' && c !== 'far' && c !== 'fab');
              filteredClasses.push('fas');
              filteredClasses.push(icon);

              selected.setClass(filteredClasses);
              modal.close();
            };
            btn.onmouseenter = () => { btn.style.background = '#1f2937'; btn.style.borderColor = '#818cf8'; };
            btn.onmouseleave = () => { btn.style.background = '#111827'; btn.style.borderColor = '#1f2937'; };
            grid.appendChild(btn);
          });
        };

        renderGrid();
        container.querySelector('#icon-search')!.addEventListener('input', (e: any) => renderGrid(e.target.value));

        modal.setTitle('Select Icon');
        modal.setContent(container);
        modal.open();
      }
    });

    editor.on('load', () => {
      setIsEditorFullyLoaded(true);
      console.log('📤 GrapesJS Loaded - applying content');

      // ── Inject Swiper (npm package) into canvas iframe window ──
      // This makes window.Swiper available inside the canvas so the
      // component script can use it without loading any CDN
      try {
        const canvasWin = editor.Canvas.getWindow() as any;
        const canvasDoc = editor.Canvas.getDocument();
        if (canvasWin && !canvasWin.Swiper) {
          // SwiperClass is the constructor — inject directly into canvas window
          canvasWin.Swiper = SwiperClass;
          console.log('✅ Swiper injected into canvas window:', typeof SwiperClass);
        }
        // Also inject Swiper CSS into canvas <head>
        if (canvasDoc && !canvasDoc.getElementById('swiper-bundle-css')) {
          const swiperStyle = canvasDoc.createElement('style');
          swiperStyle.id = 'swiper-bundle-css';
          // Inline the essential Swiper CSS so no network request is needed
          swiperStyle.innerHTML = `
            .swiper{margin-left:auto;margin-right:auto;position:relative;overflow:hidden;list-style:none;padding:0;z-index:1;display:block}
            .swiper-vertical>.swiper-wrapper{flex-direction:column}
            .swiper-wrapper{position:relative;width:100%;height:100%;z-index:1;display:flex;transition-property:transform;transition-timing-function:var(--swiper-wrapper-transition-timing-function,initial);box-sizing:content-box}
            .swiper-android .swiper-slide,.swiper-ios .swiper-slide,.swiper-wrapper{transform:translateZ(0)}
            .swiper-horizontal>.swiper-wrapper{flex-direction:row}
            .swiper-slide{flex-shrink:0;width:100%;height:100%;position:relative;transition-property:transform}
            .swiper-slide-invisible-blank{visibility:hidden}
            .swiper-autoheight,.swiper-autoheight .swiper-slide{height:auto}
            .swiper-autoheight .swiper-wrapper{align-items:flex-start;transition-property:transform,height}
            .swiper-backface-hidden .swiper-slide{transform:translateZ(0);-webkit-backface-visibility:hidden;backface-visibility:hidden}
            .swiper-3d.swiper-css-mode .swiper-wrapper{perspective:1200px}
            .swiper-3d .swiper-wrapper{transform-style:preserve-3d}
            .swiper-3d{perspective:1200px}
            .swiper-3d .swiper-cube-shadow,.swiper-3d .swiper-slide,.swiper-3d .swiper-slide-shadow,.swiper-3d .swiper-slide-shadow-bottom,.swiper-3d .swiper-slide-shadow-left,.swiper-3d .swiper-slide-shadow-right,.swiper-3d .swiper-slide-shadow-top{transform-style:preserve-3d}
            .swiper-3d .swiper-slide-shadow,.swiper-3d .swiper-slide-shadow-bottom,.swiper-3d .swiper-slide-shadow-left,.swiper-3d .swiper-slide-shadow-right,.swiper-3d .swiper-slide-shadow-top{position:absolute;left:0;top:0;width:100%;height:100%;pointer-events:none;z-index:10}
            .swiper-3d .swiper-slide-shadow{background:rgba(0,0,0,.15)}
            .swiper-3d .swiper-slide-shadow-left{background-image:linear-gradient(to left,rgba(0,0,0,.5),rgba(0,0,0,0))}
            .swiper-3d .swiper-slide-shadow-right{background-image:linear-gradient(to right,rgba(0,0,0,.5),rgba(0,0,0,0))}
            .swiper-3d .swiper-slide-shadow-top{background-image:linear-gradient(to top,rgba(0,0,0,.5),rgba(0,0,0,0))}
            .swiper-3d .swiper-slide-shadow-bottom{background-image:linear-gradient(to bottom,rgba(0,0,0,.5),rgba(0,0,0,0))}
            .swiper-css-mode>.swiper-wrapper{overflow:auto;scrollbar-width:none;-ms-overflow-style:none}
            .swiper-css-mode>.swiper-wrapper::-webkit-scrollbar{display:none}
            .swiper-css-mode>.swiper-wrapper>.swiper-slide{scroll-snap-align:start start}
            .swiper-css-mode.swiper-horizontal>.swiper-wrapper{scroll-snap-type:x mandatory}
            .swiper-css-mode.swiper-vertical>.swiper-wrapper{scroll-snap-type:y mandatory}
            .swiper-css-mode.swiper-free-mode>.swiper-wrapper{scroll-snap-type:none}
            .swiper-css-mode.swiper-free-mode>.swiper-wrapper>.swiper-slide{scroll-snap-align:none}
            .swiper-css-mode.swiper-centered>.swiper-wrapper::before{content:'';flex-shrink:0;order:9999}
            .swiper-css-mode.swiper-centered>.swiper-wrapper>.swiper-slide:first-child{margin-inline-start:var(--swiper-centered-offset-before)}
            .swiper-css-mode.swiper-centered .swiper-wrapper>.swiper-slide{scroll-snap-align:center center;scroll-snap-stop:always}
            .swiper-button-next,.swiper-button-prev{position:absolute;top:50%;width:calc(var(--swiper-navigation-size)/44*27);height:var(--swiper-navigation-size);margin-top:calc(0px - var(--swiper-navigation-size)/2);z-index:10;cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--swiper-navigation-color,var(--swiper-theme-color))}
            :root{--swiper-navigation-size:44px}
            .swiper-button-next.swiper-button-disabled,.swiper-button-prev.swiper-button-disabled{opacity:.35;cursor:auto;pointer-events:none}
            .swiper-button-next.swiper-button-hidden,.swiper-button-prev.swiper-button-hidden{opacity:0;cursor:auto;pointer-events:none}
            .swiper-navigation-disabled .swiper-button-next,.swiper-navigation-disabled .swiper-button-prev{display:none!important}
            .swiper-button-next svg,.swiper-button-prev svg{width:100%;height:100%;object-fit:contain;transform-origin:center}
            .swiper-rtl .swiper-button-next svg,.swiper-rtl .swiper-button-prev svg{transform:rotate(180deg)}
            .swiper-button-prev,.swiper-rtl .swiper-button-next{left:10px;right:auto}
            .swiper-button-next,.swiper-rtl .swiper-button-prev{right:10px;left:auto}
            .swiper-button-lock{display:none}
            .swiper-button-next svg,.swiper-button-prev svg{display:none!important}
            .swiper-button-next:after,.swiper-button-prev:after{content:''!important;display:block!important;width:100%;height:100%;background-color:var(--swiper-navigation-color,currentColor);-webkit-mask-size:contain;-webkit-mask-position:center;-webkit-mask-repeat:no-repeat;mask-size:contain;mask-position:center;mask-repeat:no-repeat}
            .swiper-button-prev:after,.swiper-rtl .swiper-button-next:after{-webkit-mask-image:url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M15 18l-6-6 6-6'/%3E%3C/svg%3E");mask-image:url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M15 18l-6-6 6-6'/%3E%3C/svg%3E")}
            .swiper-button-next:after,.swiper-rtl .swiper-button-prev:after{-webkit-mask-image:url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M9 18l6-6-6-6'/%3E%3C/svg%3E");mask-image:url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M9 18l6-6-6-6'/%3E%3C/svg%3E")}
            .swiper-pagination{position:absolute;text-align:center;transition:.3s opacity;transform:translateZ(0);z-index:10}
            .swiper-pagination.swiper-pagination-hidden{opacity:0}
            .swiper-pagination-disabled>.swiper-pagination,.swiper-pagination.swiper-pagination-disabled{display:none!important}
            .swiper-horizontal>.swiper-pagination-bullets,.swiper-pagination-bullets.swiper-pagination-horizontal,.swiper-pagination-custom,.swiper-pagination-fraction{bottom:var(--swiper-pagination-bottom,8px);top:var(--swiper-pagination-top,auto);left:0;width:100%}
            .swiper-pagination-bullets-dynamic{overflow:hidden;font-size:0}
            .swiper-pagination-bullets-dynamic .swiper-pagination-bullet{transform:scale(.33);position:relative}
            .swiper-pagination-bullets-dynamic .swiper-pagination-bullet-active-main{transform:scale(1)}
            .swiper-pagination-bullets-dynamic .swiper-pagination-bullet-active-prev{transform:scale(.66)}
            .swiper-pagination-bullets-dynamic .swiper-pagination-bullet-active-prev-prev{transform:scale(.33)}
            .swiper-pagination-bullets-dynamic .swiper-pagination-bullet-active-next{transform:scale(.66)}
            .swiper-pagination-bullets-dynamic .swiper-pagination-bullet-active-next-next{transform:scale(.33)}
            .swiper-pagination-bullet{width:var(--swiper-pagination-bullet-width,var(--swiper-pagination-bullet-size,8px));height:var(--swiper-pagination-bullet-height,var(--swiper-pagination-bullet-size,8px));display:inline-block;border-radius:var(--swiper-pagination-bullet-border-radius,50%);background:var(--swiper-pagination-bullet-inactive-color,#000);opacity:var(--swiper-pagination-bullet-inactive-opacity,.2)}
            button.swiper-pagination-bullet{border:none;margin:0;padding:0;box-shadow:none;-webkit-appearance:none;appearance:none}
            .swiper-pagination-clickable .swiper-pagination-bullet{cursor:pointer}
            .swiper-pagination-bullet:only-child{display:none!important}
            .swiper-pagination-bullet-active{opacity:var(--swiper-pagination-bullet-opacity,1);background:var(--swiper-pagination-color,var(--swiper-theme-color))}
            .swiper-vertical>.swiper-pagination-bullets,.swiper-pagination-bullets.swiper-pagination-vertical{right:var(--swiper-pagination-right,8px);left:var(--swiper-pagination-left,auto);top:50%;transform:translate3d(0px,-50%,0)}
            .swiper-vertical>.swiper-pagination-bullets .swiper-pagination-bullet,.swiper-pagination-bullets.swiper-pagination-vertical .swiper-pagination-bullet{margin:var(--swiper-pagination-bullet-vertical-gap,6px) auto;display:block}
            .swiper-horizontal>.swiper-pagination-bullets .swiper-pagination-bullet,.swiper-pagination-bullets.swiper-pagination-horizontal .swiper-pagination-bullet{margin:0 var(--swiper-pagination-bullet-horizontal-gap,4px)}
            .swiper-pagination-progressbar{background:rgba(0,0,0,.25);position:absolute}
            .swiper-pagination-progressbar .swiper-pagination-progressbar-fill{background:var(--swiper-pagination-color,var(--swiper-theme-color));position:absolute;left:0;top:0;width:100%;height:100%;transform:scale(0);transform-origin:left top}
            .swiper-rtl .swiper-pagination-progressbar .swiper-pagination-progressbar-fill{transform-origin:right top}
            .swiper-horizontal>.swiper-pagination-progressbar,.swiper-pagination-progressbar.swiper-pagination-horizontal,.swiper-pagination-progressbar.swiper-pagination-vertical.swiper-pagination-progressbar-opposite,.swiper-vertical>.swiper-pagination-progressbar.swiper-pagination-progressbar-opposite{width:100%;height:4px;left:0;top:0}
            .swiper-horizontal>.swiper-pagination-progressbar.swiper-pagination-progressbar-opposite,.swiper-pagination-progressbar.swiper-pagination-horizontal.swiper-pagination-progressbar-opposite,.swiper-pagination-progressbar.swiper-pagination-vertical.swiper-pagination-horizontal,.swiper-vertical>.swiper-pagination-progressbar{width:4px;height:100%;left:0;top:0}
            .swiper-pagination-lock{display:none}
          `;
          canvasDoc.head.appendChild(swiperStyle);
          console.log('✅ Swiper CSS injected into canvas from npm package');
        }
      } catch (e) {
        console.warn('Could not inject Swiper into canvas:', e);
      }

      // ─── Initialize Travel-03 Destination Slider in Editor Canvas ───
      // The template's svg onload script is stripped by GrapesJS, so we
      // manually initialize Swiper for .dest-swiper here.
      setTimeout(() => {
        try {
          const canvasWin = editor.Canvas.getWindow() as any;
          const canvasDoc = editor.Canvas.getDocument();
          if (!canvasWin || !canvasDoc) return;

          const initTravel03Slider = () => {
            if (typeof canvasWin.Swiper === 'undefined') return;
            const destContainer = canvasDoc.querySelector('.dest-swiper');
            if (!destContainer) return;

            // Destroy existing instance to avoid duplicates
            if (canvasWin.t03DestSwiper) {
              try { canvasWin.t03DestSwiper.destroy(true, true); } catch (_) { }
              canvasWin.t03DestSwiper = null;
            }

            canvasWin.t03DestSwiper = new canvasWin.Swiper('.dest-swiper', {
              wrapperClass: 'dest-grid',
              slideClass: 'dest',
              slidesPerView: 1.2,
              spaceBetween: 20,
              loop: true,
              breakpoints: {
                640: { slidesPerView: 2.2 },
                900: { slidesPerView: 3.2 },
                1200: { slidesPerView: 4 },
              },
            });

            // Wire up arrow buttons — they use onclick="if(window.t03DestSwiper)..."
            // but window inside the canvas iframe IS canvasWin, so this just works.
            console.log('✅ Travel-03 dest-swiper initialized in editor canvas');
          };

          // Run immediately and also after a short delay for slow renders
          initTravel03Slider();
          setTimeout(initTravel03Slider, 800);
          setTimeout(initTravel03Slider, 2000);
        } catch (e) {
          console.warn('Could not initialize Travel-03 slider in editor:', e);
        }
      }, 600);

      // ─── Inject FAQ Toggle Logic inside Editor Canvas ───
      try {
        const canvasDoc = editor.Canvas.getDocument();
        if (canvasDoc) {
          canvasDoc.addEventListener('click', (e: any) => {
            // ── Healthcare 07 Sliders & FAQ in Canvas ──
            const docPrev = e.target.closest('.hc7-doc-prev');
            const docNext = e.target.closest('.hc7-doc-next');
            if (docPrev || docNext) {
              const grid = canvasDoc.querySelector('.hc7-doctor-grid') as HTMLElement;
              if (grid) {
                const cards = grid.querySelectorAll('.hc7-doctor-card');
                if (cards.length) {
                  let curIdx = parseInt(grid.getAttribute('data-index') || '0', 10);
                  const w = canvasDoc.defaultView?.innerWidth || 1200;
                  const visible = w <= 600 ? 1 : (w <= 992 ? 2 : 4);
                  const maxIdx = Math.max(0, cards.length - visible);
                  if (docNext) {
                    curIdx = curIdx < maxIdx ? curIdx + 1 : 0;
                  } else {
                    curIdx = curIdx > 0 ? curIdx - 1 : maxIdx;
                  }
                  grid.setAttribute('data-index', String(curIdx));
                  const cardWidth = (cards[0] as HTMLElement).offsetWidth || 260;
                  const moveAmount = (cardWidth + 24) * curIdx;
                  grid.style.transform = 'translateX(-' + moveAmount + 'px)';
                }
              }
            }

            const testPrev = e.target.closest('.hc7-testimonial-prev');
            const testNext = e.target.closest('.hc7-testimonial-next');
            const testDot = e.target.closest('.hc7-testimonial-dots span');
            if (testPrev || testNext || testDot) {
              const slides = canvasDoc.querySelectorAll('.hc7-testimonial-slide');
              const dots = canvasDoc.querySelectorAll('.hc7-testimonial-dots span');
              if (slides.length) {
                let curSlide = 0;
                slides.forEach((s: any, idx: number) => { if (s.classList.contains('active')) curSlide = idx; });
                if (testDot) {
                  const dotsArr = Array.from(dots);
                  curSlide = dotsArr.indexOf(testDot as any);
                  if (curSlide < 0) curSlide = 0;
                } else if (testNext) {
                  curSlide = (curSlide + 1) % slides.length;
                } else if (testPrev) {
                  curSlide = (curSlide - 1 + slides.length) % slides.length;
                }
                slides.forEach((s: any, idx: number) => {
                  if (idx === curSlide) s.classList.add('active');
                  else s.classList.remove('active');
                });
                dots.forEach((d: any, idx: number) => {
                  if (idx === curSlide) d.classList.add('active');
                  else d.classList.remove('active');
                });
              }
            }

            const hc7FaqHead = e.target.closest('.hc7-faq-item-head, .hc7-faq-item');
            if (hc7FaqHead) {
              const item = hc7FaqHead.closest('.hc7-faq-item');
              if (item) {
                const wasActive = item.classList.contains('active');
                canvasDoc.querySelectorAll('.hc7-faq-item').forEach((el: any) => el.classList.remove('active'));
                if (!wasActive) item.classList.add('active');
              }
            }

            let accHeader = e.target.closest('.accordion-header, .faq-header, .faq-head, .v2-faq-summary, .accordion-button');
            let item, content, icon;

            // Fallback for generic tailwind accordions (e.g. older generated pages)
            if (!accHeader) {
              const genericHeader = e.target.closest('.cursor-pointer, [cursor="pointer"]');
              if (genericHeader && genericHeader.parentElement) {
                const sibling = genericHeader.nextElementSibling;
                if (sibling && (sibling.classList.contains('hidden') || genericHeader.querySelector('svg, i'))) {
                  accHeader = genericHeader;
                  item = genericHeader.parentElement;
                  content = sibling;
                  icon = genericHeader.querySelector('svg, i');
                }
              }
            }

            if (accHeader) {
              if (!item) item = accHeader.closest('.accordion-item, .faq-item, .border-b, [class*="border"]');
              if (!item) return;

              if (!content) content = item.querySelector('.accordion-content, .faq-body, .faq-answer') || accHeader.nextElementSibling;
              if (!content) return;

              if (!icon) icon = accHeader.querySelector('.accordion-icon, .fa-chevron-down, .fa-plus, .fa-minus, svg');

              const isOpen = !content.classList.contains('hidden');

              // Close all others first
              canvasDoc.querySelectorAll('.accordion-content, .faq-body, .faq-answer').forEach((c: any) => {
                if (c !== content) {
                  c.classList.add('hidden');
                  const comp = editor.DomComponents.getWrapper()?.find(`[id="${c.id}"]`)[0];
                  if (comp) comp.addClass('hidden');
                }
              });

              // Open this one if it was closed, or close if open
              if (!isOpen) {
                content.classList.remove('hidden');
                const comp = editor.DomComponents.getWrapper()?.find(`[id="${content.id}"]`)[0];
                if (comp) comp.removeClass('hidden');

                if (icon) {
                  icon.classList.add('rotate-180');
                  if (icon.classList.contains('fa-plus')) { icon.classList.remove('fa-plus'); icon.classList.add('fa-minus'); }
                }
              } else {
                content.classList.add('hidden');
                const comp = editor.DomComponents.getWrapper()?.find(`[id="${content.id}"]`)[0];
                if (comp) comp.addClass('hidden');

                if (icon) {
                  icon.classList.remove('rotate-180');
                  if (icon.classList.contains('fa-minus')) { icon.classList.remove('fa-minus'); icon.classList.add('fa-plus'); }
                }
              }
            }
          });
        }
      } catch (err) {
        console.warn('Failed to inject editor canvas FAQ logic', err);
      }

      // Restore custom font options in Typography sector
      try {
        const styleManager = editor.StyleManager;
        const fontProp = styleManager.getProperty('Typography', 'font-family');
        if (fontProp) {
          fontProp.set('options', [
            { id: 'Inter', name: 'Inter' },
            { id: 'Plus Jakarta Sans', name: 'Plus Jakarta Sans' },
            { id: 'Montserrat', name: 'Montserrat' },
            { id: 'Playfair Display', name: 'Playfair Display' },
            { id: 'Dancing Script', name: 'Dancing Script' },
            { id: 'DM Serif Display', name: 'DM Serif Display' },
            { id: 'Manrope', name: 'Manrope' },
            { id: 'Outfit', name: 'Outfit' },
          ]);
        }
      } catch (e) {
        console.warn('Could not set custom fonts in style manager', e);
      }

      // ── Remove min value constraints on spacing/position to allow negative values ──
      try {
        const styleManager = editor.StyleManager;

        // Padding and Margin are composite properties
        ['padding', 'margin'].forEach(propName => {
          // Cast to any: getProperty() returns base Property, but padding/margin are PropertyComposite
          const prop = styleManager.getProperty('Space', propName) as any;
          if (prop && typeof prop.getProperties === 'function') {
            prop.getProperties().forEach((p: any) => {
              p.set('min', ''); // Remove the minimum limit
            });
          }
        });

        // Top, Right, Bottom, Left are regular properties under Position
        ['top', 'right', 'bottom', 'left'].forEach(propName => {
          const prop = styleManager.getProperty('Position', propName);
          if (prop) {
            prop.set('min', ''); // Remove the minimum limit
          }
        });
      } catch (e) {
        console.warn('Could not update min constraints for spacing properties', e);
      }

      // ── Cleanup legacy inline styles from icons so Style Manager works ──
      try {
        const wrapper = editor.getWrapper();
        if (wrapper) {
          // Find all icons and remove inline color/font-size to let Style Manager take over
          const icons = wrapper.findType('icon');
          icons.forEach((icon: any) => {
            const style = icon.getStyle();
            let changed = false;
            if (style.color === 'var(--primary)' || style.color === '#818cf8') {
              delete style.color;
              changed = true;
            }
            if (style['font-size'] === '32px') {
              delete style['font-size'];
              changed = true;
            }
            if (changed) {
              icon.setStyle(style);
            }
          });
        }
      } catch (e) {
        console.warn('Could not cleanup legacy icon styles', e);
      }

      // ── Inject global canvas reset — prevents body margin/padding causing scroll issues ──
      try {
        const canvasDoc = editor.Canvas.getDocument();
        if (canvasDoc) {
          const resetStyle = canvasDoc.createElement('style');
          resetStyle.id = 'gjs-canvas-reset';
          resetStyle.innerHTML = `
            html, body {
              margin: 0 !important;
              padding: 0 !important;
              overflow-x: hidden;
            }
            /* FORCE ALL ANIMATED ELEMENTS TO BE VISIBLE IN THE EDITOR */
            [data-aos], .fade-up, .opacity-0 {
              opacity: 1 !important;
              transform: none !important;
              visibility: visible !important;
            }
          `;
          canvasDoc.head.appendChild(resetStyle);
        }
      } catch (e) { /* canvas not ready */ }

      // Configure RTE after load to avoid TS errors in init
      const rte = editor.RichTextEditor;
      rte.add('foreColor', {
        icon: '<i class="fa fa-font" style="color: #6366f1"></i>',
        attributes: { title: 'Text Color' },
        result: (rte: any, action: any) => {
          const color = prompt('Enter color (hex or name):', '#6366f1');
          if (color) rte.exec('foreColor', color);
        }
      });
      rte.add('hiliteColor', {
        icon: '<i class="fa fa-paint-brush"></i>',
        attributes: { title: 'Background Color' },
        result: (rte: any, action: any) => {
          const color = prompt('Enter background color:', '#ffff00');
          if (color) rte.exec('hiliteColor', color);
        }
      });


      // ── Auto-open custom code editor on canvas click (icon picker is now double-click only) ──
      setTimeout(() => {
        try {
          const frameEl = editor.Canvas.getFrameEl() as HTMLIFrameElement;
          const frameDoc = frameEl?.contentDocument;
          if (frameDoc) {
            frameDoc.addEventListener('click', () => {
              setTimeout(() => {
                const selected = editor.getSelected();
                if (!selected) return;
                const type = selected.get('type');
                const classes = selected.getClasses ? selected.getClasses() : [];
                const isCustomCode = type === 'custom-code' || (Array.isArray(classes) && classes.includes('gjs-custom-code'));
                if (isCustomCode) {
                  editor.runCommand('open-custom-code-editor');
                }
                // NOTE: Icon picker is opened on double-click only (component:dblclick below)
              }, 50);
            }, true);
          }
        } catch (e) { /* Canvas frame not ready yet */ }
      }, 1500);


      // ─── Auto-open editor on drop ───
      editor.on('block:drag:stop', (model) => {
        if (!model) return;
        const classes = model.getClasses ? model.getClasses() : [];
        const isCustomCode = model.get('type') === 'custom-code' || classes.includes('gjs-custom-code') || (model.getAttributes?.()['data-gjs-type'] === 'custom-code');
        if (isCustomCode) {
          setTimeout(() => {
            editor.select(model);
            editor.runCommand('open-custom-code-editor');
          }, 100);
        }
      });

      // ─── Auto-reveal animated components when dragged to canvas ───
      editor.on('component:add', (model) => {
        const makeVisible = (comp: any) => {
          const classes = comp.getClasses ? comp.getClasses() : [];
          if (classes.includes('animate-up') || classes.includes('animate-fade')) {
            comp.addClass('in-view');
          }
          const components = comp.components();
          if (components && components.length) {
            components.forEach((child: any) => makeVisible(child));
          }
        };
        makeVisible(model);

        // Update Swiper if a new slide is added
        if (model.is('swiper-slide')) {
          const classes = model.getClasses();
          if (!classes.includes('swiper-slide-duplicate')) {
            const parent = model.closest('[data-gjs-type="swiper-container"]');
            if (parent && typeof (parent as any).triggerReinit === 'function') {
              setTimeout(() => {
                (parent as any).triggerReinit();
              }, 250);
            }
          }
        }
      });

      editor.on('component:remove', (model) => {
        if (model.is('swiper-slide')) {
          const classes = model.getClasses();
          if (!classes.includes('swiper-slide-duplicate')) {
            const parent = model.closest('[data-gjs-type="swiper-container"]');
            if (parent && typeof (parent as any).triggerReinit === 'function') {
              setTimeout(() => {
                (parent as any).triggerReinit();
              }, 250);
            }
          }
        }
      });

      editor.on('component:dblclick', (model) => {
        const tagName = model.get('tagName');
        const classes = model.getClasses();
        const isIcon = model.is('icon') || tagName === 'i' || classes.some((c: string) => c.startsWith('fa') || c === 'fas' || c === 'fa');

        if (isIcon) {
          editor.runCommand('open-icon-picker');
        } else if (model.get('type') === 'custom-code') {
          editor.runCommand('open-custom-code-editor');
        }
      });


      editor.BlockManager.add('icon', {
        label: '<i class="fas fa-star" style="font-size: 24px; margin-bottom: 8px;"></i><div>Icon</div>',
        category: 'Basic',
        content: {
          type: 'icon',
          classes: ['fas', 'fa-star'],
          style: { 'display': 'inline-block' }
        }
      });

      editor.BlockManager.add('custom-code', {
        label: '<i class="fas fa-code" style="font-size: 24px; margin-bottom: 8px;"></i><div>Custom Code</div>',
        category: 'Basic',
        content: {
          type: 'custom-code',
          classes: ['gjs-custom-code'],
          content: '<div style="padding: 20px; background: rgba(124,58,237,0.1); border: 1px dashed #818cf8; border-radius: 8px; text-align: center; color: #818cf8; font-size: 13px; pointer-events: none;">Click to Edit Custom Code / Shortcode</div>',
        }
      });

      // ─── Register Form Traits (Automatic mapping to HTML tags) ───
      editor.DomComponents.addType('form', {
        isComponent: el => el.tagName === 'FORM',
        model: {
          defaults: {
            traits: [
              { type: 'text', name: 'id', label: 'ID' },
              { type: 'text', name: 'title', label: 'Title' },
              { type: 'text', name: 'action', label: 'Action URL' },
              { type: 'select', name: 'method', label: 'Method', options: [{ id: 'POST', name: 'POST' }, { id: 'GET', name: 'GET' }] },
              { type: 'text', name: 'success-msg', label: 'Success Message' },
              { type: 'text', name: 'redirect-url', label: 'Redirect URL' },
            ],
          },
        },
      });

      editor.DomComponents.addType('input', {
        isComponent: el => el.tagName === 'INPUT',
        model: {
          defaults: {
            traits: [
              { type: 'text', name: 'id', label: 'ID' },
              { type: 'text', name: 'name', label: 'Field Name' },
              { type: 'text', name: 'placeholder', label: 'Placeholder' },
              { type: 'checkbox', name: 'required', label: 'Required' },
              {
                type: 'select', name: 'type', label: 'Type', options: [
                  { id: 'text', name: 'Text' },
                  { id: 'email', name: 'Email' },
                  { id: 'number', name: 'Number' },
                  { id: 'tel', name: 'Phone' },
                  { id: 'password', name: 'Password' },
                ]
              },
            ],
          },
        },
      });

      editor.DomComponents.addType('textarea', {
        isComponent: el => el.tagName === 'TEXTAREA',
        model: {
          defaults: {
            traits: [
              { type: 'text', name: 'id', label: 'ID' },
              { type: 'text', name: 'name', label: 'Field Name' },
              { type: 'text', name: 'placeholder', label: 'Placeholder' },
              { type: 'checkbox', name: 'required', label: 'Required' },
            ],
          },
        },
      });

      editor.DomComponents.addType('select', {
        isComponent: el => el.tagName === 'SELECT',
        model: {
          defaults: {
            traits: [
              { type: 'text', name: 'id', label: 'ID' },
              { type: 'text', name: 'name', label: 'Field Name' },
              { type: 'checkbox', name: 'required', label: 'Required' },
              {
                type: 'button',
                name: 'add-option',
                text: 'Add Option',
                command: (ed: any, trait: any) => {
                  const model = trait.target;
                  model.components().add({ type: 'option', content: 'New Option', attributes: { id: 'new' } });
                }
              }
            ],
          },
        },
      });

      // ─── Register Form Embed Component ───
      editor.DomComponents.addType('form-embed', {
        isComponent: el => el.classList && el.classList.contains('form-embed-container'),
        model: {
          defaults: {
            tagName: 'div',
            draggable: true,
            droppable: false,
            attributes: {
              class: 'form-embed-container',
              'data-gjs-type': 'form-embed'
            },
            embedCode: '',
            embedType: 'html',
            traits: [
              {
                type: 'textarea',
                name: 'embedCode',
                label: 'Embed Code',
                placeholder: 'Paste your HubSpot, Typeform, or Jotform code here...',
                changeProp: true
              },
              {
                type: 'select',
                name: 'embedType',
                label: 'Embed Type',
                options: [
                  { id: 'embed', name: 'Embed' },
                  { id: 'iframe', name: 'IFrame' },
                  { id: 'script', name: 'Script' },
                  { id: 'html', name: 'HTML' },
                ],
                changeProp: true,
              },
            ],
          },
          init() {
            // Listen for property changes from the traits panel
            this.on('change:embedCode change:embedType', this.handleUpdate);

            // Initial sync from attributes if loading from HTML
            const attrCode = this.getAttributes()['data-embed-code'];
            const attrType = this.getAttributes()['data-embed-type'];
            if (attrCode && !this.get('embedCode')) this.set('embedCode', attrCode, { silent: true });
            if (attrType && !this.get('embedType')) this.set('embedType', attrType, { silent: true });

            // If we have code, ensure it's rendered as components for export
            if (this.get('embedCode')) {
              this.handleUpdate();
            }
          },
          handleUpdate() {
            const code = this.get('embedCode') || '';
            const type = this.get('embedType') || 'html';

            // Store values in attributes so they survive save/load (persistence)
            this.addAttributes({
              'data-embed-code': code,
              'data-embed-type': type
            });

            // Important: Use a wrapper to keep the content isolated from GrapesJS selection logic if it's a script.
            // Using components() ensures the code is included in the exported HTML.
            this.components(`<div class="embed-inner-wrapper">${code}</div>`);

            // Trigger a view refresh
            this.trigger('rerender-view');
          },
        },
        view: {
          init() {
            this.listenTo(this.model, 'change:embedCode change:embedType rerender-view', this.render);
          },
          onRender() {
            const model = this.model;
            const code = model.get('embedCode');
            const type = String(model.get('embedType') || 'html').toUpperCase();
            if (!code) {
              this.el.innerHTML = `
                <div style="padding: 40px 24px; border: 2px dashed #e5e7eb; text-align: center; color: #64748b; background: #f8fafc; border-radius: 12px; font-family: sans-serif; pointer-events: none;">
                  <div style="font-size: 40px; margin-bottom: 16px; filter: grayscale(1);">🔌</div>
                  <div style="font-weight: 700; color: #0f172a; margin-bottom: 6px; font-size: 16px;">Form Embed Module</div>
                  <div style="font-size: 13px; max-width: 300px; margin: 0 auto; line-height: 1.5;">Paste your HubSpot, Jotform, or Typeform code in the <b>Properties</b> panel on the right.</div>
                </div>
              `;
            }

            // Add the "Active" badge
            const badge = document.createElement('div');
            badge.className = 'embed-badge';
            badge.style.cssText = `
              position: absolute; top: 0; right: 0; background: #6366f1; color: white;
              padding: 2px 10px; font-size: 10px; font-weight: 800; border-bottom-left-radius: 8px;
              z-index: 100; pointer-events: none; text-transform: uppercase; letter-spacing: 0.5px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            `;
            badge.innerText = `${type} Active`;
            this.el.style.position = 'relative';
            this.el.appendChild(badge);

            // Create a preview container
            const previewContainer = document.createElement('div');
            previewContainer.className = 'embed-preview-container';
            previewContainer.style.width = '100%';
            previewContainer.style.minHeight = '100px';
            this.el.appendChild(previewContainer);

            // For Script/Embed/IFrame types, we use an iframe for the EDITOR PREVIEW.
            // This prevents complex scripts from breaking the main editor or disappearing after render.
            if (type === 'script' || type === 'embed' || type === 'iframe' || code.includes('<script')) {
              const iframe = document.createElement('iframe');
              iframe.className = 'embed-preview-iframe';
              iframe.style.width = '100%';
              iframe.style.border = 'none';
              iframe.style.minHeight = '200px';
              iframe.style.display = 'block';
              iframe.style.pointerEvents = 'none'; // Allow clicking the component itself for selection
              previewContainer.appendChild(iframe);

              const doc = iframe.contentWindow?.document;
              if (doc) {
                doc.open();
                doc.write(`
                  <!DOCTYPE html>
                  <html>
                    <head>
                      <style>
                        body { margin: 0; padding: 0; font-family: sans-serif; display: flex; justify-content: center; overflow: hidden; }
                        * { max-width: 100%; }
                      </style>
                    </head>
                    <body>
                      <div id="embed-wrapper">${code}</div>
                      <script>
                        function updateHeight() {
                          try {
                            const wrapper = document.getElementById('embed-wrapper');
                            const height = wrapper ? wrapper.offsetHeight : document.body.scrollHeight;
                            if (height > 0 && window.frameElement) {
                              window.frameElement.style.height = (height + 20) + 'px';
                            }
                          } catch (e) {}
                        }
                        window.onload = updateHeight;
                        // Use ResizeObserver for more immediate feedback if available
                        if (window.ResizeObserver) {
                          const ro = new ResizeObserver(updateHeight);
                          ro.observe(document.body);
                        } else {
                          setInterval(updateHeight, 2000);
                        }
                      </script>
                    </body>
                  </html>
                `);
                doc.close();
              }
            } else {
              // Standard HTML preview
              previewContainer.innerHTML = code;
            }
          },
        },
      });

      applyContentToEditor(editor);
      contentAppliedRef.current = true;
      // Set up custom color picker injection after load
      setTimeout(() => setupEditorEvents(editor), 500);

      // ─── Add Native GrapesJS Custom Blocks ───
      const bm = editor.BlockManager;

      // 1. BASIC CATEGORY
      bm.add('custom-section', { label: 'Section', category: 'Basic', attributes: { class: 'fa fa-square-o' }, content: '<section style="padding:50px 20px; width: 100%; min-height: 50px; background:#f9fafb;"></section>' });
      bm.add('custom-1col', { label: '1 Column', category: 'Basic', attributes: { class: 'fa fa-bars' }, content: '<div style="display:flex; padding:20px; min-height: 50px; justify-content:center;"><div style="flex:1;">1 Column</div></div>' });
      bm.add('custom-2col', { label: '2 Columns', category: 'Basic', attributes: { class: 'fa fa-columns' }, content: '<div style="display:flex; padding:20px; min-height: 50px; gap: 20px;"><div style="flex:1; padding: 10px; border: 1px dashed #ccc;">Column 1</div><div style="flex:1; padding: 10px; border: 1px dashed #ccc;">Column 2</div></div>' });
      bm.add('custom-3col', { label: '3 Columns', category: 'Basic', attributes: { class: 'fa fa-th' }, content: '<div style="display:flex; padding:20px; min-height: 50px; gap: 20px;"><div style="flex:1; padding: 10px; border: 1px dashed #ccc;">Col 1</div><div style="flex:1; padding: 10px; border: 1px dashed #ccc;">Col 2</div><div style="flex:1; padding: 10px; border: 1px dashed #ccc;">Col 3</div></div>' });
      bm.add('custom-heading', { label: 'Heading', category: 'Basic', attributes: { class: 'fa fa-header' }, content: '<h2 style="margin: 0 0 15px 0; font-family: sans-serif; font-weight: bold;">Heading Text</h2>' });
      bm.add('custom-text', { label: 'Text', category: 'Basic', attributes: { class: 'fa fa-font' }, content: '<p style="margin: 0 0 15px 0; line-height: 1.5; font-family: sans-serif; color: #4b5563;">Insert your text here</p>' });
      bm.add('custom-link', { label: 'Link', category: 'Basic', attributes: { class: 'fa fa-link' }, content: { type: 'link', content: 'Link Text', href: '#' } });
      bm.add('custom-image', { label: 'Image', category: 'Basic', attributes: { class: 'fa fa-picture-o' }, content: { type: 'image', style: { color: 'black' }, activeOnRender: 1 } });
      bm.add('custom-quote', { label: 'Quote', category: 'Basic', attributes: { class: 'fa fa-quote-right' }, content: '<blockquote style="border-left: 4px solid var(--primary); padding-left: 15px; margin: 20px 0; font-style: italic; color: #4b5563;">Insert your quote here.</blockquote>' });
      bm.add('custom-icon', { label: 'Icon', category: 'Basic', attributes: { class: 'fa fa-diamond' }, content: '<div style="display:inline-block; font-size:32px; color:var(--primary);">★</div>' });

      // 2. FORMS CATEGORY
      bm.add('custom-form', {
        label: 'Form',
        category: 'Forms',
        attributes: { class: 'fa fa-wpforms' },
        content: {
          type: 'form',
          droppable: true,
          style: { padding: '20px', border: '1px solid var(--input-border)', borderRadius: '8px', minHeight: '100px', backgroundColor: 'var(--form-bg)' },
          components: [
            {
              type: 'label',
              content: 'Email',
              editable: true,
              style: { color: 'var(--label-color)', display: 'block', marginBottom: '5px' }
            },
            {
              type: 'input',
              attributes: { type: 'email', placeholder: 'your@email.com' },
              style: { width: '100%', padding: '8px', color: 'var(--input-text)', background: 'var(--input-bg)', border: '1px solid var(--input-border)', borderRadius: '4px', marginBottom: '15px' }
            },
            {
              type: 'button',
              content: 'Submit',
              attributes: { type: 'submit' },
              style: { padding: '10px 20px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }
            }
          ]
        }
      });

      bm.add('custom-input', {
        label: 'Input',
        category: 'Forms',
        attributes: { class: 'fa fa-keyboard-o' },
        content: {
          type: 'input',
          attributes: { placeholder: 'Type here...' },
          style: { padding: '8px', width: '100%', border: '1px solid var(--input-border)', borderRadius: '4px', color: 'var(--input-text)', background: 'var(--input-bg)' }
        }
      });

      bm.add('custom-textarea', {
        label: 'Textarea',
        category: 'Forms',
        attributes: { class: 'fa fa-file-text-o' },
        content: {
          type: 'textarea',
          attributes: { placeholder: 'Type message...' },
          style: { padding: '8px', width: '100%', border: '1px solid var(--input-border)', borderRadius: '4px', minHeight: '100px', color: 'var(--input-text)', background: 'var(--input-bg)' }
        }
      });

      bm.add('custom-select', {
        label: 'Select',
        category: 'Forms',
        attributes: { class: 'fa fa-caret-square-o-down' },
        content: {
          type: 'select',
          style: { padding: '8px', width: '100%', border: '1px solid var(--input-border)', borderRadius: '4px', color: 'var(--input-text)', background: 'var(--input-bg)' },
          components: [
            { type: 'option', content: 'Option 1', attributes: { id: '1' } },
            { type: 'option', content: 'Option 2', attributes: { id: '2' } }
          ]
        }
      });

      bm.add('custom-check', {
        label: 'Checkbox',
        category: 'Forms',
        attributes: { class: 'fa fa-check-square-o' },
        content: {
          style: { display: 'flex', alignItems: 'center', gap: '8px', padding: '5px' },
          components: [
            { type: 'checkbox', style: { width: 'auto' } },
            { type: 'text', tagName: 'span', content: 'Checkbox Label', style: { color: 'var(--label-color)' } }
          ]
        }
      });

      bm.add('custom-radio', {
        label: 'Radio',
        category: 'Forms',
        attributes: { class: 'fa fa-dot-circle-o' },
        content: {
          style: { display: 'flex', alignItems: 'center', gap: '8px', padding: '5px' },
          components: [
            { type: 'radio', attributes: { name: 'radioGrp' }, style: { width: 'auto' } },
            { type: 'text', tagName: 'span', content: 'Radio Label', style: { color: 'var(--label-color)' } }
          ]
        }
      });

      bm.add('custom-button', {
        label: 'Button',
        category: 'Forms',
        attributes: { class: 'fa fa-hand-pointer-o' },
        content: {
          type: 'button',
          content: 'Button Text',
          style: { display: 'inline-block', padding: '12px 24px', backgroundColor: 'var(--primary)', color: '#ffffff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', textAlign: 'center' }
        }
      });

      bm.add('custom-label', {
        label: 'Label',
        category: 'Forms',
        attributes: { class: 'fa fa-tag' },
        content: {
          type: 'label',
          content: 'Field Label',
          style: { fontSize: '14px', fontWeight: '500', color: 'var(--label-color)', display: 'block', marginBottom: '5px' }
        }
      });

      bm.add('form-embed', {
        label: 'Form Embed',
        category: 'Embeds',
        attributes: { class: 'fa fa-code' },
        content: {
          type: 'form-embed',
        }
      });

      // 3. EXTRA CATEGORY
      bm.add('custom-video', { label: 'Video', category: 'Extra', attributes: { class: 'fa fa-youtube-play' }, content: { type: 'video', src: 'https://youtube.com/embed/dQw4w9WgXcQ', style: { height: '350px', width: '100%' } } });
      bm.add('custom-map', { label: 'Google Maps', category: 'Extra', attributes: { class: 'fa fa-map-marker' }, content: { type: 'map', style: { height: '350px' } } });
      bm.add('custom-linkblock', { label: 'Link Block', category: 'Extra', attributes: { class: 'fa fa-link' }, content: { type: 'link', content: '<div>Link Block Content</div>', style: { display: 'inline-block', padding: '10px' } } });
      bm.add('custom-countdown', { label: 'Countdown', category: 'Extra', attributes: { class: 'fa fa-clock-o' }, content: '<div data-gjs-type="countdown" style="text-align: center; font-size: 2rem; font-weight: bold; padding: 20px;">00:00:00:00</div>' });

      // 4. DATA CATEGORY
      bm.add('custom-table', { label: 'Data Table', category: 'Data', attributes: { class: 'fa fa-table' }, content: '<table style="width:100%; border-collapse: collapse; margin: 20px 0;"><tr style="background:#f1f5f9;"><th style="border:1px solid #ccc; padding:10px;">Header 1</th><th style="border:1px solid #ccc; padding:10px;">Header 2</th></tr><tr><td style="border:1px solid #ccc; padding:10px;">Row 1 Col 1</td><td style="border:1px solid #ccc; padding:10px;">Row 1 Col 2</td></tr></table>' });
      bm.add('custom-dynamic-fields', { label: 'Dynamic Fields', category: 'Data', attributes: { class: 'fa fa-database' }, content: '<div style="padding: 15px; border: 1px dashed var(--primary); background: rgba(124,58,237,0.05); text-align: center; font-family: monospace; color: var(--primary);">{{ DYNAMIC_CONTENT }}</div>' });

      // ─── Add Custom Lead Form Block ───
      editor.BlockManager.add('lead-form', {
        label: 'Lead Form',
        category: 'Forms',
        attributes: { class: 'fa fa-paper-plane' },
        content: {
          type: 'form',
          droppable: true,
          style: { padding: '40px', background: 'var(--form-bg)', border: '1px solid var(--input-border)', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', maxWidth: '500px', margin: '0 auto' },
          components: [
            { type: 'text', tagName: 'h3', content: 'Get Started Now', editable: true, style: { margin: '0 0 10px 0', fontSize: '24px', color: '#1e293b', textAlign: 'center', fontWeight: 'bold' } },
            { type: 'text', tagName: 'p', content: 'Fill out your details and we will get back to you.', editable: true, style: { margin: '0 0 20px 0', fontSize: '14px', color: '#64748b', textAlign: 'center' } },
            {
              tagName: 'div',
              droppable: true,
              style: { display: 'flex', flexDirection: 'column', gap: '16px' },
              components: [
                {
                  droppable: true,
                  tagName: 'div',
                  components: [
                    { type: 'label', content: 'Name', editable: true, style: { fontSize: '12px', fontWeight: '600', color: 'var(--label-color)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' } },
                    { type: 'input', attributes: { type: 'text', name: 'name', required: 'true', placeholder: 'Your Name' }, style: { width: '100%', padding: '12px', border: '1px solid var(--input-border)', borderRadius: '8px', outline: 'none', color: 'var(--input-text)', background: 'var(--input-bg)' } }
                  ]
                },
                {
                  droppable: true,
                  tagName: 'div',
                  components: [
                    { type: 'label', content: 'Email', editable: true, style: { fontSize: '12px', fontWeight: '600', color: 'var(--label-color)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' } },
                    { type: 'input', attributes: { type: 'email', name: 'email', required: 'true', placeholder: 'email@example.com' }, style: { width: '100%', padding: '12px', border: '1px solid var(--input-border)', borderRadius: '8px', outline: 'none', color: 'var(--input-text)', background: 'var(--input-bg)' } }
                  ]
                },
                {
                  droppable: true,
                  tagName: 'div',
                  components: [
                    { type: 'label', content: 'Phone', editable: true, style: { fontSize: '12px', fontWeight: '600', color: 'var(--label-color)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' } },
                    { type: 'input', attributes: { type: 'tel', name: 'phone', placeholder: '+1 (555) 000-0000' }, style: { width: '100%', padding: '12px', border: '1px solid var(--input-border)', borderRadius: '8px', outline: 'none', color: 'var(--input-text)', background: 'var(--input-bg)' } }
                  ]
                },
                {
                  type: 'button',
                  content: 'Send Inquiry',
                  attributes: { type: 'submit' },
                  style: { marginTop: '10px', padding: '14px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }
                }
              ]
            }
          ]
        }
      });

      // 5. REGISTER ALL BLOCKS FROM BLOCK_DEFS
      BLOCK_DEFS.forEach((b: any) => {
        if (!bm.get(b.type)) {
          bm.add(b.type, {
            label: b.label,
            category: b.category,
            content: b.defaultContent,
          });
        }
      });

      // 6. DYNAMIC LABEL SYNC LOGIC
      editor.on('component:update:attributes:data-label', (component) => {
        const newLabel = component.getAttributes()['data-label'];
        if (!newLabel) return;

        // Find associated label: 
        // 1. Check parent for a label
        // 2. Check siblings for a label
        const parent = component.parent();
        if (parent) {
          const labelComp = parent.components().find((c: any) => c.get('tagName') === 'label');
          if (labelComp) {
            // If it's a wrapper label like <label>Text <input/></label>
            if (labelComp === component.parent() && labelComp.get('tagName') === 'label') {
              const content = labelComp.get('content') || '';
              // Simple replacement for radio/checkbox labels
              labelComp.set('content', `${newLabel} `);
            } else {
              labelComp.set('content', newLabel);
            }
          }
        }
      });
    });

    // Fallback removed — editor.on('load') handles first apply,
    // and the useEffect([page, isEditorFullyLoaded]) handles late page data arrival.

    editorRef.current = editor;
    setEditorInstance(editor); // Trigger re-render so GlobalStylesPanel gets editor
    (window as any).editorInstance = editor; // Expose to iframe interaction script

    return () => {
      if (editorRef.current) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, [pageId, projectLoading, pageLoading]);

  // ─── Setup Editor Events (Tabs & Labels) ───
  const setupEditorEvents = (editor: Editor) => {
    editor.on('component:selected', (model: any) => {
      const tagName = model.get('tagName') || 'div';
      const classes = model.getClasses();
      const isIcon = tagName === 'i' || classes.some((c: string) => c.startsWith('fa') || c === 'fas' || c === 'fa');

      const isCustomCode = model.get('type') === 'custom-code' ||
        classes.includes('gjs-custom-code') ||
        (model.getAttributes?.()['data-gjs-type'] === 'custom-code');

      // 1. Handle UI Tab Switching
      if (isCustomCode) {
        setRightTab('traits');
      }

      // 2. Handle Native Details/Summary Toggle on Click (including children of summary)
      let summaryModel = model;
      while (summaryModel && summaryModel.get('tagName')?.toLowerCase() !== 'summary') {
        summaryModel = summaryModel.parent();
      }
      if (summaryModel && summaryModel.get('tagName')?.toLowerCase() === 'summary') {
        const detailsModel = summaryModel.parent();
        if (detailsModel && detailsModel.get('tagName')?.toLowerCase() === 'details') {
          const attrs = Object.assign({}, detailsModel.getAttributes());
          if (attrs.open) {
            delete attrs.open;
          } else {
            attrs.open = 'open';
          }
          detailsModel.setAttributes(attrs);
        }
      }

      // 3. Handle FAQ Toggle when selected in Editor
      let currentModel: any = model;
      let faqWrapper: any = null;
      while (currentModel) {
        const classes = currentModel.getClasses?.() || [];
        if (classes.includes('hc7-faq-item') || classes.includes('faq-item')) {
          faqWrapper = currentModel;
          break;
        }
        currentModel = currentModel.parent();
      }
      if (faqWrapper) {
        const el = faqWrapper.getEl();
        if (el) {
          const wasActive = el.classList.contains('active');
          const doc = el.ownerDocument;
          doc.querySelectorAll('.hc7-faq-item, .faq-item').forEach((f: any) => f.classList.remove('active'));
          if (!wasActive) el.classList.add('active');
        }
      }

      // 4. Handle Doctors Slider Arrow Click when selected in Editor
      let docNavModel: any = model;
      let isDocPrev = false;
      let isDocNext = false;
      while (docNavModel) {
        const classes = docNavModel.getClasses?.() || [];
        if (classes.includes('hc7-doc-prev')) { isDocPrev = true; break; }
        if (classes.includes('hc7-doc-next')) { isDocNext = true; break; }
        docNavModel = docNavModel.parent();
      }
      if (isDocPrev || isDocNext) {
        const doc = docNavModel.getEl()?.ownerDocument;
        if (doc) {
          const grid = doc.querySelector('.hc7-doctor-grid') as HTMLElement;
          if (grid) {
            const cards = grid.querySelectorAll('.hc7-doctor-card');
            if (cards.length) {
              let curIdx = parseInt(grid.getAttribute('data-index') || '0', 10);
              const w = doc.defaultView?.innerWidth || 1200;
              const visible = w <= 600 ? 1 : (w <= 992 ? 2 : 4);
              const maxIdx = Math.max(0, cards.length - visible);
              if (isDocNext) {
                curIdx = curIdx < maxIdx ? curIdx + 1 : 0;
              } else {
                curIdx = curIdx > 0 ? curIdx - 1 : maxIdx;
              }
              grid.setAttribute('data-index', String(curIdx));
              const cardWidth = (cards[0] as HTMLElement).offsetWidth || 260;
              const moveAmount = (cardWidth + 24) * curIdx;
              grid.style.transform = 'translateX(-' + moveAmount + 'px)';
            }
          }
        }
      }

      // 5. Handle Testimonial Slider Nav when selected in Editor
      let testNavModel: any = model;
      let isTestPrev = false;
      let isTestNext = false;
      let isTestDot = false;
      while (testNavModel) {
        const classes = testNavModel.getClasses?.() || [];
        const parentClasses = testNavModel.parent()?.getClasses?.() || [];
        if (classes.includes('hc7-testimonial-prev')) { isTestPrev = true; break; }
        if (classes.includes('hc7-testimonial-next')) { isTestNext = true; break; }
        if (testNavModel.get('tagName')?.toLowerCase() === 'span' && parentClasses.includes('hc7-testimonial-dots')) {
          isTestDot = true;
          break;
        }
        testNavModel = testNavModel.parent();
      }
      if (isTestPrev || isTestNext || isTestDot) {
        const doc = testNavModel.getEl()?.ownerDocument;
        if (doc) {
          const slides = doc.querySelectorAll('.hc7-testimonial-slide');
          const dots = doc.querySelectorAll('.hc7-testimonial-dots span');
          if (slides.length) {
            let curSlide = 0;
            slides.forEach((s: any, idx: number) => { if (s.classList.contains('active')) curSlide = idx; });
            if (isTestDot) {
              const el = testNavModel.getEl();
              const dotsArr = Array.from(dots);
              curSlide = dotsArr.indexOf(el as any);
              if (curSlide < 0) curSlide = 0;
            } else if (isTestNext) {
              curSlide = (curSlide + 1) % slides.length;
            } else if (isTestPrev) {
              curSlide = (curSlide - 1 + slides.length) % slides.length;
            }
            slides.forEach((s: any, idx: number) => {
              if (idx === curSlide) s.classList.add('active');
              else s.classList.remove('active');
            });
            dots.forEach((d: any, idx: number) => {
              if (idx === curSlide) d.classList.add('active');
              else d.classList.remove('active');
            });
          }
        }
      }

      // Restore Swiper Pagination if wiped by GrapesJS re-render
      const swiperContainer = model.is('swiper-container') ? model : model.closest('[data-gjs-type="swiper-container"]');
      if (swiperContainer) {
        setTimeout(() => {
          const el = swiperContainer.getEl() as any;
          if (el && el.__swiper && el.__swiper.pagination) {
            el.__swiper.pagination.render();
            el.__swiper.pagination.update();
            if (el.__swiper.navigation) el.__swiper.navigation.update();
          }
        }, 150);
      }

      setActiveComponent(model);

      // Update Selection Label for AI
      const type = model.get('type') || '';
      const name = model.get('name') || type || tagName;

      // Capitalize first letter and format
      let readableName = name.charAt(0).toUpperCase() + name.slice(1);
      if (readableName === 'Wrapper') readableName = 'Body';
      setSelectedLabel(readableName);
    });

    editor.on('component:deselected', () => {
      setSelectedLabel('Body');
    });
  };



  // ─── Branding Sync (Reactive to Sidebar) ───
  useEffect(() => {
    if (editorRef.current) {
      const canvas = editorRef.current.Canvas;
      const doc = canvas.getDocument();
      if (!doc) return;

      const head = doc.head;
      const styleId = 'branding-vars';
      let styleEl = head.querySelector(`#${styleId}`);
      if (!styleEl) {
        styleEl = doc.createElement('style');
        styleEl.id = styleId;
        head.appendChild(styleEl);
      }

      // Update variables in real-time
      styleEl.innerHTML = `
        :root, body {
          --primary: ${themePrimary} !important;
          --secondary: ${themeSecondary} !important;
          --accent: ${themeSecondary} !important;
          --gold: ${themePrimary} !important;
          --forest: ${themePrimary} !important;
          --button-gradient: linear-gradient(135deg, ${themePrimary}, ${themeSecondary});
        }
      `;
      console.log('🎨 Branding variables updated in canvas:', themePrimary, themeSecondary);
    }
  }, [themePrimary, themeSecondary]);

  // Initial content load — runs when page data arrives AND editor is already ready
  // (covers the case where page loads AFTER the editor 'load' event)
  const contentAppliedRef = useRef(false);
  useEffect(() => {
    if (editorRef.current && page && isEditorFullyLoaded && !contentAppliedRef.current) {
      contentAppliedRef.current = true;
      applyContentToEditor(editorRef.current);
    }
  }, [page, isEditorFullyLoaded]);

  // Initialize hasSaved if page already has content
  useEffect(() => {
    if (page && (page.landingPageContent || page.content)) {
      setHasSaved(true);
    }
  }, [page]);


  // ─── Device ───
  const switchDevice = (d: 'desktop' | 'tablet' | 'mobile') => {
    setActiveDevice(d);
    editorRef.current?.Devices.select(d);
  };

  // ─── Save ───
  const handleSave = async () => {
    if (!editorRef.current) return;
    setIsSaving(true);
    console.log('💾 Saving page content...');
    let html = editorRef.current.getHtml();
    let css = editorRef.current.getCss() || '';
    let js = editorRef.current.getJs() || '';

    // Fix relative assets to absolute URLs for external plugins
    const makeAbsolute = (str: string) => {
      const origin = window.location.origin;
      return str.replace(/\/assets\/templates\//g, origin + '/assets/templates/')
        .replace(new RegExp(origin + origin, 'g'), origin);
    };
    html = makeAbsolute(html);
    css = makeAbsolute(css);

    // Capture internal global styles injected by GlobalStylesPanel
    const canvasDoc = editorRef.current.Canvas.getDocument();
    const themeStyleTag = canvasDoc.getElementById('global-theme-styles');
    const brandingStyleTag = canvasDoc.getElementById('branding-vars');
    const templateStyleTag = canvasDoc.getElementById('template-styles');

    const templateCss = templateStyleTag?.innerHTML || '';

    const globalCss = templateCss + '\n' + (themeStyleTag?.innerHTML || '') + '\n' + (brandingStyleTag?.innerHTML || '');

    const styleData = globalCss + '\n' + css;

    // Extract all custom script tags from the canvas document using the unified helper
    let canvasScripts = '';
    try {
      const canvasDoc = editorRef.current.Canvas.getDocument();
      if (canvasDoc) canvasScripts = extractCanvasScripts(canvasDoc);
    } catch (e) {
      console.warn('Failed to extract scripts from canvas:', e);
    }

    // Merge canvas scripts with backed-up template scripts (deduplicates by src/content)
    const customScripts = mergeScripts(canvasScripts, extractedTemplateScripts);
    let htmlWithScripts = customScripts ? html + '\n' + customScripts : html;
    if (js) {
      htmlWithScripts += `\n<script>\n${js}\n</script>`;
    }

    const updateData: Partial<LandingPage> = {
      metaTitle: pageTitle,
      metaDescription: metaDesc,
      primaryColor: themePrimary,
      secondaryColor: themeSecondary,
      accentColor: themeSecondary,
      landingPageContent: mode === 'landing' ? htmlWithScripts : page?.landingPageContent,
      landingPageStyles: mode === 'landing' ? styleData : page?.landingPageStyles,
      thankYouPageContent: mode === 'thank-you' ? htmlWithScripts : page?.thankYouPageContent,
      thankYouPageStyles: mode === 'thank-you' ? styleData : page?.thankYouPageStyles,
    };

    if (mode === 'landing') {
      updateData.content = htmlWithScripts;
      updateData.styles = styleData;
    } else {
      updateData.content = page?.landingPageContent;
      updateData.styles = page?.landingPageStyles;
    }

    try {
      await updatePageMutation.mutateAsync(updateData);
      setHasSaved(true);
      toast.success(`${mode === 'thank-you' ? 'Thank You' : 'Landing'} page saved!`);
    } catch (err) {
      toast.error('Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  const switchMode = async (newMode: 'landing' | 'thank-you') => {
    if (newMode === mode) return;

    // 1. Save current editor state into memory/local page state so it isn't lost on switch
    if (editorRef.current) {
      let html = editorRef.current.getHtml();
      let css = editorRef.current.getCss() || '';

      const makeAbsolute = (str: string) => {
        const origin = window.location.origin;
        return str.replace(/\/assets\/templates\//g, origin + '/assets/templates/')
          .replace(new RegExp(origin + origin, 'g'), origin);
      };
      html = makeAbsolute(html);
      css = makeAbsolute(css);
      const js = editorRef.current.getJs() || '';
      const canvasDoc = editorRef.current.Canvas.getDocument();
      const themeStyleTag = canvasDoc.getElementById('global-theme-styles');
      const brandingStyleTag = canvasDoc.getElementById('branding-vars');
      const templateStyleTag = canvasDoc.getElementById('template-styles');

      const templateCss = templateStyleTag?.innerHTML || '';
      const globalCss = templateCss + '\n' + (themeStyleTag?.innerHTML || '') + '\n' + (brandingStyleTag?.innerHTML || '');

      // Extract scripts to ensure they aren't lost
      let canvasScripts = '';
      try {
        if (canvasDoc) canvasScripts = extractCanvasScripts(canvasDoc);
      } catch (e) {
        console.warn('Failed to extract scripts from canvas:', e);
      }
      const customScripts = mergeScripts(canvasScripts, extractedTemplateScripts);
      let htmlWithScripts = customScripts ? html + '\n' + customScripts : html;
      if (js) {
        htmlWithScripts += `\n<script>\n${js}\n</script>`;
      }

      if (page) {
        if (mode === 'landing') {
          page.landingPageContent = htmlWithScripts;
          page.landingPageStyles = globalCss + '\n' + css;
        } else {
          page.thankYouPageContent = htmlWithScripts;
          page.thankYouPageStyles = globalCss + '\n' + css;
        }
      }
    }

    // 2. Switch Mode
    setMode(newMode);

    // Sync URL
    const newParams = new URLSearchParams(searchParams);
    if (newMode === 'thank-you') newParams.set('mode', 'thankyou');
    else newParams.delete('mode');
    navigate(`?${newParams.toString()}`, { replace: true });

    // 3. Update Sidebar Tab
    if (newMode === 'thank-you') {
      setLeftTab('thank-you');
      setIsSidebarOpen(true);
    } else if (leftTab === 'thank-you') {
      setLeftTab('blocks');
    }

    // 4. Load content of new mode — single call with loader
    setTimeout(() => {
      if (editorRef.current) {
        setIsCanvasLoading(true);
        applyContentToEditor(editorRef.current, newMode);
      }
    }, 150);
  };

  // ─── Preview ───
  const handlePreview = async () => {
    if (!page?.slug) {
      toast.error('Please save your page first to generate a slug');
      return;
    }
    try {
      toast.loading('Saving latest changes for preview...', { id: 'preview-save' });
      await handleSave();
      toast.dismiss('preview-save');
    } catch (e) {
      toast.dismiss('preview-save');
      console.warn('Auto-save before preview failed:', e);
    }
    const preSlug = project?.preSlug?.replace(/^\/+|\/+$/g, '') || '';
    const token = page.previewToken ? `?token=${page.previewToken}` : '';
    const previewUrl = `${window.location.origin}/preview/${preSlug ? preSlug + '/' : ''}${page.slug}${token}`;
    console.log('🔗 Opening Preview URL:', previewUrl);
    window.open(previewUrl, '_blank');
  };


  // ─── Code ───
  const openCode = () => {
    if (!editorRef.current) return;
    const rawHtml = editorRef.current.getHtml();
    const rawCss = editorRef.current.getCss() ?? '';
    setHtmlCode(formatHtmlPretty(rawHtml));
    setCssCode(formatCssPretty(rawCss));
    setCodeView(true);
  };

  // ─── Apply code ───
  const applyCode = () => {
    if (!editorRef.current) return;
    editorRef.current.setComponents(htmlCode);
    editorRef.current.setStyle(cssCode);
    toast.success('Code applied!');
    setCodeView(false);
  };

  const downloadHtml = async () => {
    if (!editorRef.current) {
      toast.error('Editor not ready');
      return;
    }

    // Extract all custom script tags from the canvas document using the unified helper
    let canvasScriptsForDownload = '';
    let globalCssForDownload = '';
    const js = editorRef.current.getJs() || '';
    try {
      const canvasDoc = editorRef.current.Canvas.getDocument();
      if (canvasDoc) {
        canvasScriptsForDownload = extractCanvasScripts(canvasDoc);

        const themeStyleTag = canvasDoc.getElementById('global-theme-styles');
        const brandingStyleTag = canvasDoc.getElementById('branding-vars');
        const templateStyleTag = canvasDoc.getElementById('template-styles');

        const cleanTemplateCss = (templateStyleTag?.innerHTML || '')
          .replace(/var\\(--primary\\)/g, themePrimary)
          .replace(/var\\(--secondary\\)/g, themeSecondary);

        globalCssForDownload = cleanTemplateCss + '\\n' + (themeStyleTag?.innerHTML || '') + '\\n' + (brandingStyleTag?.innerHTML || '');
      }
    } catch (e) {
      console.warn('Failed to extract scripts or styles from canvas for download:', e);
    }

    // Merge canvas scripts with backed-up template scripts (deduplicates by src/content)
    const customScripts = mergeScripts(canvasScriptsForDownload, extractedTemplateScripts);

    // 1. Get raw content directly from editor to ensure latest state
    let landingHtml = mode === 'landing' ? editorRef.current.getHtml() : (page?.landingPageContent || '');
    let landingCss = mode === 'landing' ? globalCssForDownload + '\\n' + (editorRef.current.getCss() || '') : (page?.landingPageStyles || '');

    let thankYouHtml = mode === 'thank-you' ? editorRef.current.getHtml() : (page?.thankYouPageContent || '');
    let thankYouCss = mode === 'thank-you' ? globalCssForDownload + '\\n' + (editorRef.current.getCss() || '') : (page?.thankYouPageStyles || '');

    if (mode === 'landing' && customScripts) {
      landingHtml = landingHtml + '\n' + customScripts;
    } else if (mode === 'thank-you' && customScripts) {
      thankYouHtml = thankYouHtml + '\n' + customScripts;
    }
    if (js) {
      landingHtml += `\n<script>\n${js}\n</script>`;
      thankYouHtml += `\n<script>\n${js}\n</script>`;
    }

    let formattedLandingHtml = formatHtmlPretty(landingHtml);
    let formattedLandingCss = formatCssPretty(landingCss);
    let formattedThankYouHtml = thankYouHtml ? formatHtmlPretty(thankYouHtml) : '';
    let formattedThankYouCss = thankYouCss ? formatCssPretty(thankYouCss) : '';

    const cssFileName = 'landing-page.css';
    const tyCssFileName = 'thankyou-page.css';
    const pageTitle = page?.name || 'Landing Page';
    const metaDesc = page?.metaDescription || '';

    // 2. Setup Zip
    const zip = new JSZip();
    const landingPageFolder = zip.folder('landing-page');
    if (!landingPageFolder) {
      toast.error('Failed to create download package');
      return;
    }
    // ── Create img/ subfolder inside landing-page/ ──
    const imgFolder = landingPageFolder.folder('img');
    if (!imgFolder) {
      toast.error('Failed to create img folder');
      return;
    }

    // 3. Extract and Download Images
    const imageUrls = new Set<string>();
    const getFullUrl = (url: string) => {
      if (!url || url.startsWith('data:')) return null;
      if (url.startsWith('http') || url.startsWith('//')) return url.startsWith('//') ? `https:${url}` : url;
      try { return new URL(url, window.location.origin).href; } catch (e) { return null; }
    };

    // Match src="...", url('...'), url("..."), background-image: url(...)
    const imgRegex = /(?:src|data-src|poster)=["']([^"'>]+)["']|url\(['"]?([^'")]+)['"]?\)/g;
    [formattedLandingHtml, formattedLandingCss, formattedThankYouHtml, formattedThankYouCss].forEach(content => {
      let m;
      while ((m = imgRegex.exec(content)) !== null) {
        const rawUrl = m[1] || m[2];
        const url = getFullUrl(rawUrl);
        if (url) imageUrls.add(url);
      }
    });

    const imageMap: Record<string, string> = {};
    const downloadPromises = Array.from(imageUrls).map(async (origUrl) => {
      const fullUrl = getFullUrl(origUrl);
      if (!fullUrl) return;
      try {
        let blob: Blob | null = null;
        try {
          const res = await fetch(fullUrl, { mode: 'cors' });
          if (res.ok) blob = await res.blob();
        } catch (e) {
          try {
            const res = await fetch(`https://images.weserv.nl/?url=${encodeURIComponent(fullUrl)}`);
            if (res.ok) blob = await res.blob();
          } catch (e2) { }
        }

        if (blob) {
          const urlHash = Math.random().toString(36).substr(2, 6);
          const rawFilename = fullUrl.split('/').pop()?.split('?')[0] || 'image';
          let extension = blob.type.split('/')[1] || 'png';
          if (extension === 'jpeg') extension = 'jpg';
          if (extension === 'svg+xml') extension = 'svg';
          if (extension === 'webp') extension = 'webp';

          // Truncate original name and add hash to keep it short but unique
          let cleanBase = rawFilename.replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9]/g, '_').substr(0, 20);
          if (!cleanBase) cleanBase = 'asset';
          const filename = `${cleanBase}_${urlHash}.${extension}`;

          // ── Save image inside img/ subfolder ──
          imgFolder.file(filename, blob);
          // Map original URL → relative path from HTML file (img/filename)
          imageMap[origUrl] = `img/${filename}`;
        }
      } catch (err) { }
    });

    await Promise.all(downloadPromises);

    // 4. Replace ALL original URLs with img/filename paths in HTML and CSS
    const sortedUrls = Object.keys(imageMap).sort((a, b) => b.length - a.length);
    sortedUrls.forEach((oldUrl) => {
      const newPath = imageMap[oldUrl]; // e.g. "img/hero_abc123.jpg"
      const escaped = oldUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(escaped, 'g');
      formattedLandingHtml = formattedLandingHtml.replace(regex, newPath);
      formattedLandingCss = formattedLandingCss.replace(regex, newPath);
      formattedThankYouHtml = formattedThankYouHtml.replace(regex, newPath);
      formattedThankYouCss = formattedThankYouCss.replace(regex, newPath);
    });

    // Final sweep: Convert any remaining relative /path/ src refs to absolute (for images not downloaded)
    const origin = window.location.origin;
    const relativeRegex = /src=["']\/([^"'>][^"'>]*)["']/g;
    formattedLandingHtml = formattedLandingHtml.replace(relativeRegex, `src="${origin}/$1"`);
    formattedThankYouHtml = formattedThankYouHtml.replace(relativeRegex, `src="${origin}/$1"`);

    // 5. Build final HTML files
    const finalLandingHtml = buildFullHtml(formattedLandingHtml, formattedLandingCss, pageTitle, metaDesc, cssFileName);

    // 6. Generate ZIP
    landingPageFolder.file('landing-page.html', finalLandingHtml);
    landingPageFolder.file(cssFileName, formattedLandingCss);
    if (formattedThankYouHtml) {
      const tyTitle = `${pageTitle} - Thank You`;
      const finalTyHtml = buildFullHtml(formattedThankYouHtml, formattedThankYouCss, tyTitle, metaDesc, tyCssFileName);
      landingPageFolder.file('thankyou-page.html', finalTyHtml);
      landingPageFolder.file(tyCssFileName, formattedThankYouCss);
    }

    const totalImages = Object.keys(imageMap).length;
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const zipUrl = URL.createObjectURL(zipBlob);
    const zipAnchor = document.createElement('a');
    zipAnchor.href = zipUrl;
    zipAnchor.download = `${page?.slug || 'landing-page'}-package.zip`;
    zipAnchor.click();
    URL.revokeObjectURL(zipUrl);
    toast.success(`✅ Downloaded! HTML + CSS + ${totalImages} image(s) in img/ folder`);
  };

  // ─── Publish ───
  const handlePublish = async () => {
    if (!editorRef.current) return;

    if (!project?.isVerified) {
      toast.error('Please verify that the required plugin or script is installed and configured correctly before publishing the page.', {
        style: { color: '#ef4444' }
      });
      return;
    }

    setIsPublishing(true);

    try {
      let html = editorRef.current.getHtml();
      let css = editorRef.current.getCss() || '';

      // Capture internal global styles injected by GlobalStylesPanel
      const canvasDoc = editorRef.current.Canvas.getDocument();
      const themeStyleTag = canvasDoc.getElementById('global-theme-styles');
      const brandingStyleTag = canvasDoc.getElementById('branding-vars');
      const templateStyleTag = canvasDoc.getElementById('template-styles');

      const templateCss = templateStyleTag?.innerHTML || '';

      const globalCss = templateCss + '\n' + (themeStyleTag?.innerHTML || '') + '\n' + (brandingStyleTag?.innerHTML || '');
      const styleData = globalCss + '\n' + css;

      // Extract scripts from canvas using unified helper, then merge with backup
      let canvasScriptsPub = '';
      try {
        if (canvasDoc) canvasScriptsPub = extractCanvasScripts(canvasDoc);
      } catch (e) {
        console.warn('Failed to extract scripts from canvas:', e);
      }
      const customScripts = mergeScripts(canvasScriptsPub, extractedTemplateScripts);

      // Build a FULL self-contained HTML document for publish.
      // This is the key fix: published page has all CSS + JS inline so it works standalone.
      let fullPublishHtml = buildPublishHtml(html, styleData, customScripts, {
        title: pageTitle,
        desc: metaDesc,
        primaryColor: themePrimary,
        secondaryColor: themeSecondary,
      });

      // Fix relative assets to absolute URLs for external plugins ONLY for the published output
      const makeAbsolute = (str: string) => {
        const origin = window.location.origin;
        return str.replace(/\/assets\/templates\//g, origin + '/assets/templates/')
          .replace(new RegExp(origin + origin, 'g'), origin);
      };
      fullPublishHtml = makeAbsolute(fullPublishHtml);

      // Also keep the raw body HTML for editor reload
      const htmlWithScripts = customScripts ? html + '\n' + customScripts : html;

      const updateData: Partial<LandingPage> = {
        status: 'published',
        metaTitle: pageTitle,
        metaDescription: metaDesc,
        primaryColor: themePrimary,
        secondaryColor: themeSecondary,
        accentColor: themeSecondary,
        // landingPageContent stores the full standalone HTML so the public page works correctly
        landingPageContent: mode === 'landing' ? fullPublishHtml : page?.landingPageContent,
        landingPageStyles: mode === 'landing' ? styleData : page?.landingPageStyles,
        thankYouPageContent: mode === 'thank-you' ? fullPublishHtml : page?.thankYouPageContent,
        thankYouPageStyles: mode === 'thank-you' ? styleData : page?.thankYouPageStyles,
      };

      if (mode === 'landing') {
        // content.fullHtml = complete standalone HTML; content.html = body only for editor reload
        updateData.content = { fullHtml: fullPublishHtml, html: htmlWithScripts };
        updateData.styles = styleData;
      } else {
        updateData.content = page?.landingPageContent;
        updateData.styles = page?.landingPageStyles;
      }

      await updatePageMutation.mutateAsync(updateData);

      setIsPublishing(false);
      // Build the public URL for display
      const slug = pageDataRef.current?.slug || pageId;
      const preSlugPrefix = project?.preSlug?.replace(/^\/+|\/+$/g, '') || '';

      // Use project websiteUrl (normalized by backend) or fallback to current origin
      const baseUrl = project?.websiteUrl || project?.url || window.location.origin;
      const url = `${baseUrl.replace(/\/+$/, '')}/${preSlugPrefix ? preSlugPrefix + '/' : ''}${slug}`;

      setPublishedUrl(url);
      setPublishModalOpen(true);
    } catch (err) {
      setIsPublishing(false);
      toast.error('Failed to publish page');
    }
  };

  // ─── AI prompt ───
  const handleAiGenerate = async () => {
    if (!aiPrompt.trim() || !editorRef.current) return;
    setAiLoading(true);

    const selected = editorRef.current.getSelected();
    const prompt = aiPrompt.trim();

    try {
      const res = await aiApi.improve({
        sectionType: selected ? selected.get('tagName') || 'section' : 'new section',
        currentContent: selected ? selected.toHTML() : '<div>New AI Content</div>',
        aiPrompt: prompt,
        pageId
      });

      let improvedHtml: string = res.data.improvedContent.fullHtml || res.data.improvedContent;

      // ── Extract <style> blocks from AI HTML and inject into template-styles ──
      const styleTagRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
      let extractedCss = '';
      let match;
      while ((match = styleTagRegex.exec(improvedHtml)) !== null) {
        extractedCss += match[1] + '\n';
      }
      // Remove style tags from HTML before adding to canvas
      const cleanHtml = improvedHtml.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');

      if (extractedCss.trim()) {
        const canvasDoc = editorRef.current.Canvas.getDocument();
        if (canvasDoc) {
          let templateStyleTag = canvasDoc.getElementById('template-styles') as HTMLStyleElement | null;
          if (!templateStyleTag) {
            templateStyleTag = canvasDoc.createElement('style');
            templateStyleTag.id = 'template-styles';
            canvasDoc.head.appendChild(templateStyleTag);
          }
          templateStyleTag.innerHTML += '\n/* AI Generated */\n' + extractedCss;
        }
        // Intentionally skipping editorRef.current.setStyle to prevent massive click lag
      }

      if (selected) {
        selected.replaceWith(cleanHtml || improvedHtml);
      } else {
        editorRef.current.addComponents(cleanHtml || improvedHtml);
      }

      setAiLoading(false);
      setAiPrompt('');
      setAiOpen(false);
      toast.success('✨ AI section generated!');
    } catch (err: any) {
      setAiLoading(false);
      toast.error(err.message || 'Failed to generate AI content');
    }
  };

  const handleEditAiGenerate = async () => {
    if (!editAiPrompt.trim() || !editorRef.current) return;
    const selected = editorRef.current.getSelected();
    if (!selected) return;

    setAiLoading(true);
    const prompt = editAiPrompt.trim();

    try {
      const res = await aiApi.improve({
        sectionType: selected.get('tagName') || 'component',
        currentContent: selected.toHTML(),
        aiPrompt: prompt,
        pageId
      });

      let improvedHtml: string = res.data.improvedContent.fullHtml || res.data.improvedContent;

      // ── Extract <style> blocks and inject into template-styles ──
      const styleTagRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
      let extractedCss = '';
      let match;
      while ((match = styleTagRegex.exec(improvedHtml)) !== null) {
        extractedCss += match[1] + '\n';
      }
      const cleanHtml = improvedHtml.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');

      if (extractedCss.trim()) {
        const canvasDoc = editorRef.current.Canvas.getDocument();
        if (canvasDoc) {
          let templateStyleTag = canvasDoc.getElementById('template-styles') as HTMLStyleElement | null;
          if (!templateStyleTag) {
            templateStyleTag = canvasDoc.createElement('style');
            templateStyleTag.id = 'template-styles';
            canvasDoc.head.appendChild(templateStyleTag);
          }
          templateStyleTag.innerHTML += '\n/* AI Edit */\n' + extractedCss;
        }
        // Intentionally skipping setStyle to prevent SelectorManager lag
      }

      selected.replaceWith(cleanHtml || improvedHtml);

      setAiLoading(false);
      setEditAiPrompt('');
      setEditAiOpen(false);
      toast.success('✨ Component edited with AI!');
    } catch (err: any) {
      setAiLoading(false);
      toast.error(err.message || 'Failed to edit with AI');
    }
  };

  // ─── AI Chat Processor (Real GPT API) ───
  const handleAiUndo = (data: any, msgIndex: number) => {
    if (!editorRef.current || !data || !data.selectedId) return;
    const editor = editorRef.current;

    // Revert the component
    let targetComp = null;
    const findComponentById = (component: any, targetId: string): any => {
      if (!component) return null;
      if (component.getId() === targetId) return component;
      const children = component.components().models;
      for (let i = 0; i < children.length; i++) {
        const found = findComponentById(children[i], targetId);
        if (found) return found;
      }
      return null;
    };
    targetComp = findComponentById(editor.getWrapper(), data.selectedId);

    if (!targetComp) {
      // Fallback: try to just use currently selected
      targetComp = activeComponent || editor.getSelected();
    }

    if (targetComp) {
      const state = data.before;
      const action = data.action;
      if ((action === 'style' || action === 'both') && state.css) {
        targetComp.setStyle(state.css);
      }
      if ((action === 'text' || action === 'both') && state.text) {
        if (targetComp.get('type') !== 'wrapper') targetComp.components(state.text);
      }
      if (action === 'html' && state.html) {
        targetComp.replaceWith(state.html);
      }
    }

    // Put prompt back into text box
    if (data.prompt) {
      setChatInput(data.prompt);
      setTimeout(() => {
        if (aiInputRef.current) {
          aiInputRef.current.focus();
          aiInputRef.current.value = data.prompt;
        }
      }, 50);
    }

    // Remove this message and the previous user message from chat
    setChatMessages(prev => {
      const newMsgs = [...prev];
      // remove the AI message
      newMsgs.splice(msgIndex, 1);
      // remove the preceding user message if it matches the prompt
      if (msgIndex - 1 >= 0 && newMsgs[msgIndex - 1].role === 'user') {
        newMsgs.splice(msgIndex - 1, 1);
      }
      return newMsgs;
    });

    toast.success('Reverted! Prompt moved to input.');
  };

  const processAiChat = async (overrideVal?: string | React.MouseEvent) => {
    const isString = typeof overrideVal === 'string';
    const val = (isString ? overrideVal : chatInput).trim();
    if (!val || chatLoading || !editorRef.current) return;

    if (!isString) setChatInput('');

    const selected = activeComponent || editorRef.current.getSelected();
    if (!selected) {
      setChatMessages(prev => [...prev,
      { role: 'user', content: val },
      { role: 'ai', content: '⚠️ Please select an element on the canvas first, then write your command.' }
      ]);
      return;
    }

    // Add user message
    setChatMessages(prev => [...prev, { role: 'user', content: val }]);
    setChatLoading(true);

    const el = selected.getEl();
    if (el) el.classList.add('ai-pulse-active');

    const elementHtml = selected.toHTML();
    const elementCss = JSON.stringify(selected.getStyle() || {});
    const elementTag = selected.get('tagName') || 'div';
    const elementType = selected.get('type') || 'element';

    try {
      let aiResponse = '';

      // ── Call dedicated /ai/editor-chat backend endpoint ──
      const res = await aiApi.editorChat({
        elementTag,
        elementHtml: elementHtml.slice(0, 1500),
        elementCss,
        instruction: val
      });

      // res.data is directly: { action, css, text, html, summary }
      const parsed = res.data || {};

      // Apply changes to the selected component
      editorRef.current.UndoManager.stop();
      editorRef.current.UndoManager.start();
      let changeApplied = false;
      let changeSummary = parsed.summary || 'AI change applied';

      const aiCss = parsed.css || parsed.style || parsed.styles || {};
      const aiText = parsed.text || parsed.content || parsed.text_content;
      const aiHtml = parsed.html || parsed.modified_html || parsed.new_html;
      const action = parsed.action || (aiHtml ? 'html' : aiCss ? 'style' : aiText ? 'text' : 'both');

      const beforeHtml = selected.toHTML();
      const beforeCss = selected.getStyle();
      const beforeText = selected.components().models.map(m => m.get('content')).join('');

      if ((action === 'style' || action === 'both') && aiCss && Object.keys(aiCss).length > 0) {
        // Convert camelCase to kebab-case for GrapesJS
        const kebabCss: Record<string, string> = {};
        Object.entries(aiCss).forEach(([key, value]) => {
          const kebab = key.replace(/([A-Z])/g, '-$1').toLowerCase();
          kebabCss[kebab] = value as string;
        });
        const currentStyle = selected.getStyle() || {};
        selected.setStyle({ ...currentStyle, ...kebabCss });
        changeApplied = true;
      }

      if ((action === 'text' || action === 'both') && aiText) {
        if (selected.get('type') !== 'wrapper') {
          selected.components(aiText);
          changeApplied = true;
        }
      }

      let finalSelectedId = selected.getId();
      if (action === 'html' && aiHtml) {
        const newComps = selected.replaceWith(aiHtml);
        if (newComps && newComps.length > 0) {
          finalSelectedId = newComps[0].getId();
        } else if (newComps && !Array.isArray(newComps)) {
          finalSelectedId = newComps.getId();
        }
        changeApplied = true;
      }

      if (changeApplied) {
        aiResponse = `✅ Done! ${changeSummary}`;
        const historyEntry = {
          id: Date.now().toString(),
          timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
          prompt: val,
          element: `${elementTag} · ${selectedLabel}`,
          summary: changeSummary
        };
        setAiHistory(prev => [historyEntry, ...prev].slice(0, 30));
        editorRef.current.UndoManager.stop();
        toast.success('✨ AI changes applied successfully!');
      } else {
        aiResponse = '🤔 AI provided a response but no changes were made. Please be more specific.';
      }

      const undoData = {
        action,
        selectedId: finalSelectedId,
        prompt: val,
        before: { html: beforeHtml, css: beforeCss, text: beforeText },
        after: { html: aiHtml, css: aiCss, text: aiText }
      };
      setChatMessages(prev => [...prev, { role: 'ai', content: aiResponse, undoData }]);
    } catch (err: any) {
      console.error('AI Chat Error:', err);
      const errMsg = err?.message || 'Unknown error';
      setChatMessages(prev => [...prev, {
        role: 'ai',
        content: `❌ Error: ${errMsg}\n\nPlease check your API key (click on the ⚙️ icon).`
      }]);
    } finally {
      if (el) el.classList.remove('ai-pulse-active');
      setChatLoading(false);
      // Auto-scroll chat
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  };

  if (projectLoading || pageLoading || !page || !project) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#111827]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-white font-medium">Loading Editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'Inter, system-ui, sans-serif', background: '#f5f5f5', overflow: 'hidden' }}>

      {/* ═══════════════ TOP BAR ═══════════════ */}
      <div style={{
        height: 54, flexShrink: 0,
        background: '#ffffff', borderBottom: '1px solid #dedede',
        display: 'flex', alignItems: 'center', padding: '0 16px', gap: 8,
        zIndex: 100, boxShadow: 'rgba(0, 0, 0, 0.3) 0px 2px 10px'
      }}>
        {/* Logo & Page Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginRight: 20 }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: 'linear-gradient(135deg,#818cf8,#6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 14, fontWeight: 800, boxShadow: '0 4px 12px rgba(124,58,237,0.3)' }}>
            {page?.name?.charAt(0).toUpperCase() || 'P'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <span style={{ color: '#111827', fontWeight: 700, fontSize: 14, letterSpacing: '-0.2px' }}>{page?.name || 'Untitled Page'}</span>
          </div>
        </div>

        <Sep />

        {/* Back Button */}
        {/* <button
          onClick={() => navigate(`/dashboard/projects/${projId}`)}
          style={{
            ...outlineBtn,
            background: 'rgba(0,0,0,0.05)',
            border: '1px solid rgba(0,0,0,0.1)',
            color: '#3b82f6',
            padding: '6px 12px',
            fontSize: 11,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}
          title="Back to Dashboard"
        >
          <ArrowLeft size={14} /> Back
        </button> */}


        {/* Mode Switcher */}
        <div style={{ display: 'flex', background: '#f3f4f6', borderRadius: 8, padding: 2, border: '1px solid #e5e7eb', margin: '0 10px' }}>
          <TBtn title="Edit Landing Page" active={mode === 'landing'} onClick={() => switchMode('landing')}>
            <LayoutIcon /><span style={{ marginLeft: 6, fontSize: 11, fontWeight: 600 }}>Landing Page</span>
          </TBtn>
          <TBtn title="Edit Thank You Page" active={mode === 'thank-you'} onClick={() => switchMode('thank-you')}>
            <SuccessIcon /><span style={{ marginLeft: 6, fontSize: 11, fontWeight: 600 }}>Thank You Page</span>
          </TBtn>
        </div>

        <Sep />

        {/* Device Switcher (Centered look) */}
        <div style={{ display: 'flex', background: '#f3f4f6', borderRadius: 8, padding: 2, border: '1px solid #e5e7eb', margin: '0 10px' }}>
          <TBtn title="Desktop" active={activeDevice === 'desktop'} onClick={() => switchDevice('desktop')}><DesktopIcon /></TBtn>
          <TBtn title="Tablet" active={activeDevice === 'tablet'} onClick={() => switchDevice('tablet')} ><TabletIcon /></TBtn>
          <TBtn title="Mobile" active={activeDevice === 'mobile'} onClick={() => switchDevice('mobile')} ><MobileIcon /></TBtn>
        </div>

        <Sep />

        <div style={{ flex: 1 }} />

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={downloadHtml}
            disabled={!hasSaved}
            style={{
              ...outlineBtn,
              background: !hasSaved ? 'rgba(52,211,153,0.05)' : 'rgba(52,211,153,0.1)',
              border: !hasSaved ? '1px solid rgba(52,211,153,0.2)' : '1px solid rgba(52,211,153,0.5)',
              color: '#059669',
              padding: '7px 14px',
              opacity: !hasSaved ? 0.5 : 1,
              cursor: !hasSaved ? 'not-allowed' : 'pointer'
            }}
            title={!hasSaved ? "Please save your page first before downloading" : "Download HTML Package"}
          >
            <DownloadIcon /> <span style={{ marginLeft: 6 }}>Download HTML</span>
          </button>

          {/* Status Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginRight: 8 }}>
            <span style={{ color: '#111827', fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5 }}>Status:</span>
            <select
              value={siteStatus}
              onChange={(e) => {
                const val = e.target.value as any;
                if (val === 'published' && !project?.isVerified) {
                  toast.error('Please verify that the required plugin or script is installed and configured correctly before publishing the page.', {
                    style: { color: '#ef4444' }
                  });
                  // Revert the select element visually
                  e.target.value = siteStatus;
                  return;
                }
                setSiteStatus(val);
                // 🚀 Actually update the database!
                updatePageMutation.mutate({ status: val });

                if (val === 'unpublished') {
                  toast.success('Page has been unpublished.');
                } else if (val === 'draft') {
                  toast.success('Page status changed to Draft.');
                } else if (val === 'published') {
                  toast.success('Page has been published successfully.');
                }
              }}
              style={{
                background: '#f9fafb', border: '1px solid #d1d5db', color: '#111827',
                borderRadius: 6, padding: '4px 24px 4px 10px', fontSize: 11, fontWeight: 700, outline: 'none', cursor: 'pointer',
                appearance: 'none', backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'10\' height=\'10\' fill=\'%2364748b\' viewBox=\'0 0 16 16\'%3E%3Cpath d=\'M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z\'/%3E%3C/svg%3E")',
                backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center'
              }}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="unpublished">Unpublished</option>
            </select>
          </div>

          <button
            onClick={() => {
              if (siteStatus === 'unpublished') {
                toast.error('Cannot preview an Unpublished site. Please change status to Published first.');
                return;
              }
              handlePreview();
            }}
            style={{ ...outlineBtn, background: '#f3f4f6', border: '1px solid #e5e7eb', color: '#111827', padding: '7px 14px' }}
            title="Live Preview"
          >
            <EyeIcon />
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            style={{ ...outlineBtn, background: '#111827', border: 'none', color: '#fff', padding: '7px 14px', opacity: isSaving ? 0.5 : 1, cursor: isSaving ? 'not-allowed' : 'pointer' }}
            title="Save Changes"
          >
            {isSaving ? <SpinnerIcon /> : <SaveIcon />}
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginLeft: 16 }}>
          <button onClick={handlePublish} disabled={isPublishing} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: isPublishing ? '#4c1d95' : 'linear-gradient(135deg, #818cf8, #6366f1)', color: '#fff', border: 'none', borderRadius: 8,
            padding: '7px 22px', fontSize: 13, fontWeight: 800, cursor: isPublishing ? 'not-allowed' : 'pointer',
            boxShadow: isPublishing ? 'none' : '0 4px 15px rgba(124,58,237,0.4)',
            transition: 'all 0.2s', textTransform: 'uppercase', letterSpacing: 0.5
          }}>
            {isPublishing ? 'Publishing...' : <><RocketIcon /> Publish</>}
          </button>
        </div>
      </div>

      {/* ═══════════════ MAIN BODY ═══════════════ */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* ══ DUAL-COLUMN LEFT SIDEBAR ══ */}
        <div style={{ display: 'flex', height: '100%', borderRight: '1px solid #dedede' }}>
          {/* Vertical Toolbar (Narrow) */}
          <div style={{
            width: 58, flexShrink: 0, background: '#fff',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            padding: '16px 0px', gap: 18, borderRight: '1px solid #dedede'
          }}>
            <NavIcon title="Blocks" active={leftTab === 'blocks'} onClick={() => { if (leftTab === 'blocks') setIsSidebarOpen(!isSidebarOpen); else { setLeftTab('blocks'); setIsSidebarOpen(true); } }}><GridIcon /><span>Blocks</span></NavIcon>
            <NavIcon title="Theme Options" active={leftTab === 'theme'} onClick={() => { if (leftTab === 'theme') setIsSidebarOpen(!isSidebarOpen); else { setLeftTab('theme'); setIsSidebarOpen(true); } }}><PaletteIcon /><span>Theme</span></NavIcon>
            <NavIcon title="Layer Manager" active={leftTab === 'layers'} onClick={() => { if (leftTab === 'layers') setIsSidebarOpen(!isSidebarOpen); else { setLeftTab('layers'); setIsSidebarOpen(true); } }}><LayersIcon /><span>Layers</span></NavIcon>
            <NavIcon title="AI Assistant" active={leftTab === 'ai'} onClick={() => { if (leftTab === 'ai') setIsSidebarOpen(!isSidebarOpen); else { setLeftTab('ai'); setIsSidebarOpen(true); } }}><SparklesIcon /><span>AI</span></NavIcon>
            {mode === 'thank-you' && (
              <NavIcon title="Templates" active={leftTab === 'thank-you'} onClick={() => { if (leftTab === 'thank-you') setIsSidebarOpen(!isSidebarOpen); else { setLeftTab('thank-you'); setIsSidebarOpen(true); } }}>
                <SuccessIcon /><span>Templates</span>
              </NavIcon>
            )}

            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 18, paddingBottom: 8 }}>
              <NavIcon active={false} onClick={() => navigate(`/dashboard/projects/${projId}`)} title="Go back to Project">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12"></line>
                  <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
              </NavIcon>
            </div>
          </div>

          {/* Panel Content (Dynamic) */}
          <div style={{
            width: isSidebarOpen ? 280 : 0,
            opacity: isSidebarOpen ? 1 : 0,
            flexShrink: 0, background: '#fff',
            display: 'flex', flexDirection: 'column', overflow: 'hidden',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            borderRight: isSidebarOpen ? '1px solid #e5e7eb' : 'none'
          }}>
            <div style={{ padding: '20px 18px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', minWidth: 280, backgroundColor: '#fff' }}>
              <span style={{ color: '#000', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                {leftTab === 'thank-you' ? 'Thank You Page Templates' : leftTab}
              </span>
              <button onClick={() => setIsSidebarOpen(false)} style={{ color: '#000', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, opacity: 0.7 }}>✕</button>
            </div>

            <div style={{ flex: 1, display: leftTab === 'blocks' ? 'flex' : 'none', overflow: 'hidden' }}>
              <BlocksPanel
                onAdd={(type) => {
                  if (!editorRef.current) return;
                  const editor = editorRef.current;

                  if (type === 'icon') {
                    // Add a default icon then open the picker
                    const added = editor.addComponents({
                      type: 'icon',
                      classes: ['fas', 'fa-star'],
                      style: { 'display': 'inline-block', 'cursor': 'pointer' }
                    });
                    if (added && added[0]) {
                      editor.select(added[0]);
                      setTimeout(() => editor.runCommand('open-icon-picker'), 100);
                    }
                    return;
                  }

                  if (type === 'custom-code') {
                    const added = editor.addComponents({
                      type: 'custom-code',
                      classes: ['gjs-custom-code'],
                      content: '<div style="padding: 20px; background: rgba(124,58,237,0.1); border: 1px dashed #818cf8; border-radius: 8px; text-align: center; color: #818cf8; font-size: 13px; pointer-events: none;">Click to Edit Custom Code / Shortcode</div>',
                    });
                    if (added && added[0]) {
                      editor.select(added[0]);
                      setTimeout(() => editor.runCommand('open-custom-code-editor'), 100);
                    }
                    return;
                  }

                  const block = editor.BlockManager.get(type);
                  if (block) {
                    editor.addComponents(block.get('content'));
                  }
                }}
                onDragStart={(type, ev) => {
                  if (!editorRef.current) return;
                  const block = editorRef.current.BlockManager.get(type);
                  if (block) {
                    editorRef.current.BlockManager.startDrag(block, { event: ev.nativeEvent } as any);
                  }
                }}
              />
            </div>

            {/* Hidden Native Blocks Container */}
            <div id="blocks-container" style={{ display: 'none' }} />

            {/* Theme / Styles */}
            <div style={{ flex: 1, display: leftTab === 'theme' ? 'flex' : 'none', overflow: 'hidden' }}>
              <GlobalStylesPanel
                editor={editorInstance}
                initialPrimary={page?.primaryColor}
                initialSecondary={page?.secondaryColor}
                initialStylesCss={mode === 'landing' ? page?.landingPageStyles : page?.thankYouPageStyles}
                onBrandingColorsChange={({ primary, secondary }) => {
                  setThemePrimary(primary);
                  setThemeSecondary(secondary);
                }}
              />
            </div>

            {/* Layers */}
            <div id="layers-container" style={{ flex: 1, overflowY: 'auto', display: leftTab === 'layers' ? 'block' : 'none', padding: '10px', background: '#fff' }} />


            {/* AI Panel - Full Featured */}
            <div style={{ flex: 1, display: leftTab === 'ai' ? 'flex' : 'none', flexDirection: 'column', overflow: 'hidden', minWidth: 280 }}>

              {/* ── AI Panel Header Tabs ── */}
              <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #e5e7eb', background: '#f9fafb', padding: '0 12px' }}>
                <button
                  onClick={() => setShowHistory(false)}
                  style={{ flex: 1, padding: '10px 0', background: 'none', border: 'none', color: showHistory ? '#6b7280' : '#4f46e5', fontSize: 11, fontWeight: 700, cursor: 'pointer', borderBottom: showHistory ? 'none' : '2px solid #6366f1', transition: 'all 0.2s' }}
                >✨ AI Chat</button>
                <button
                  onClick={() => setShowHistory(true)}
                  style={{ flex: 1, padding: '10px 0', background: 'none', border: 'none', color: showHistory ? '#4f46e5' : '#6b7280', fontSize: 11, fontWeight: 700, cursor: 'pointer', borderBottom: showHistory ? '2px solid #6366f1' : 'none', transition: 'all 0.2s', position: 'relative' }}
                >
                  🕐 History
                  {aiHistory.length > 0 && <span style={{ marginLeft: 4, background: '#6366f1', color: '#fff', borderRadius: 100, padding: '1px 6px', fontSize: 9 }}>{aiHistory.length}</span>}
                </button>
                <button
                  onClick={() => setShowApiKeyInput(v => !v)}
                  title="API Key Settings"
                  style={{ padding: '6px 8px', background: showApiKeyInput ? 'rgba(99,102,241,0.1)' : 'none', border: 'none', color: aiApiKey ? '#10b981' : '#6b7280', cursor: 'pointer', borderRadius: 6, fontSize: 14 }}
                >⚙️</button>
              </div>

              {/* ── API Key Settings ── */}
              {showApiKeyInput && (
                <div style={{ padding: '12px 14px', background: '#fff', borderBottom: '1px solid #e5e7eb' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                    <span style={{ fontSize: 12 }}>🤖</span>
                    <span style={{ fontSize: 10, color: '#4f46e5', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Claude (Anthropic) API Key</span>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <input
                      type="password"
                      value={aiApiKey}
                      onChange={e => setAiApiKey(e.target.value)}
                      placeholder="sk-ant-api03-..."
                      style={{ flex: 1, background: '#f9fafb', border: '1px solid #d1d5db', color: '#000', borderRadius: 7, padding: '7px 10px', fontSize: 12, outline: 'none' }}
                    />
                    <button
                      onClick={() => {
                        if (aiApiKey.trim()) {
                          localStorage.setItem('ai_editor_claude_key', aiApiKey.trim());
                          setAiProvider('claude');
                          toast.success('✅ Claude API Key saved!');
                        } else {
                          localStorage.removeItem('ai_editor_claude_key');
                          setAiProvider('demo');
                          toast.info('API Key removed. Using demo mode.');
                        }
                        setShowApiKeyInput(false);
                      }}
                      style={{ background: '#6366f1', color: '#fff', border: 'none', borderRadius: 7, padding: '7px 12px', fontSize: 11, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}
                    >Save</button>
                  </div>
                  <div style={{ fontSize: 10, color: aiApiKey ? '#10b981' : '#f97316', marginTop: 6 }}>
                    {aiApiKey ? '✅ Claude AI active (claude-3-5-haiku)' : '⚠️ Demo mode — limited commands only'}
                  </div>
                  <div style={{ fontSize: 9, color: '#9ca3af', marginTop: 4 }}>Key is stored locally in your browser only.</div>
                </div>
              )}

              {/* ── HISTORY TAB ── */}
              {showHistory ? (
                <div style={{ flex: 1, overflowY: 'auto', padding: 14, display: 'flex', flexDirection: 'column', gap: 10, background: '#fff' }}>
                  {aiHistory.length > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                      <span style={{ fontSize: 10, color: '#6b7280' }}>{aiHistory.length} changes saved · reload pe bhi rahega ✅</span>
                      <button
                        onClick={() => { setAiHistory([]); localStorage.removeItem(`ai_history_${pageId}`); }}
                        style={{ fontSize: 10, color: '#ef4444', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 6, padding: '3px 8px', cursor: 'pointer' }}
                      >🗑️ Clear All</button>
                    </div>
                  )}
                  {aiHistory.length === 0 ? (
                    <div
                      style={{
                        textAlign: 'center',
                        color: '#6b7280',
                        fontSize: 13,
                        padding: '32px 0',
                        lineHeight: 1.6,
                      }}
                    >
                      <div style={{ fontSize: 32, marginBottom: 10 }}>✨</div>

                      No AI updates yet.<br />
                      Select any element and give a prompt to start editing.
                    </div>
                  ) : (
                    aiHistory.map(h => (
                      <div key={h.id} style={{ background: '#f9fafb', borderRadius: 10, border: '1px solid #e5e7eb', padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 5 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: 9, color: '#6b7280', fontWeight: 700 }}>🕐 {h.timestamp}</span>
                          <span style={{ fontSize: 9, background: 'rgba(99,102,241,0.1)', color: '#4f46e5', padding: '2px 7px', borderRadius: 100 }}>{h.element}</span>
                        </div>
                        <div style={{ fontSize: 12, color: '#111827', fontStyle: 'italic' }}>"{h.prompt}"</div>
                        <div style={{ fontSize: 11, color: '#10b981' }}>✅ {h.summary}</div>
                      </div>
                    ))
                  )}
                </div>
              ) : (
                <>
                  {/* ── CHAT TAB ── */}

                  {/* Selection Context Bar */}
                  <div style={{ padding: '8px 14px', background: '#fff', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: activeComponent ? '#10b981' : '#f97316', boxShadow: activeComponent ? '0 0 6px #10b981' : '0 0 6px #f97316', flexShrink: 0 }} />
                    <span style={{ color: '#4b5563', fontSize: 10, fontWeight: 600, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {activeComponent ? `🎯 ${selectedLabel}` : '⬅️ Select an element on canvas'}
                    </span>
                    <button
                      onClick={() => { setChatMessages([WELCOME_MSG]); localStorage.removeItem(`ai_chat_messages_${pageId}`); }}
                      title="Clear chat"
                      style={{ fontSize: 11, color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer', padding: '1px 4px' }}
                    >🗑️</button>
                    <span style={{ fontSize: 9, color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '2px 6px', borderRadius: 100, whiteSpace: 'nowrap' }}>
                      🤖 Claude AI
                    </span>
                  </div>

                  {/* Chat Messages */}
                  <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 10, background: '#fff' }}>
                    {chatMessages.map((msg, i) => (
                      <div key={i} style={{ display: 'flex', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row', gap: 8, alignItems: 'flex-end' }}>
                        {msg.role === 'ai' && (
                          <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'linear-gradient(135deg,#818cf8,#6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, flexShrink: 0, color: '#fff' }}>✨</div>
                        )}
                        <div style={{
                          maxWidth: '80%',
                          background: msg.role === 'user' ? 'linear-gradient(135deg,#818cf8,#6366f1)' : '#f3f4f6',
                          color: msg.role === 'user' ? '#fff' : '#111827',
                          borderRadius: msg.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                          padding: '9px 12px',
                          fontSize: 12,
                          lineHeight: 1.6,
                          border: msg.role === 'ai' ? '1px solid #e5e7eb' : 'none',
                          whiteSpace: 'pre-line',
                          wordBreak: 'break-word'
                        }}>
                          {msg.content}
                          {msg.role === 'ai' && msg.content.includes('✅ Done!') && (
                            <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
                              <button
                                onClick={() => msg.undoData && handleAiUndo(msg.undoData, i)}
                                style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 6, padding: '6px 12px', fontSize: 12, color: '#4b5563', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 500, transition: 'all 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
                                onMouseOver={(e) => e.currentTarget.style.borderColor = '#6366f1'}
                                onMouseOut={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7v6h6" /><path d="M21 17a9 9 0 00-9-9 9 9 0 00-6 2.3L3 13" /></svg>
                                Undo
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    {chatLoading && (
                      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
                        <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'linear-gradient(135deg,#818cf8,#6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: '#fff' }}>✨</div>
                        <div style={{ background: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: '14px 14px 14px 4px', padding: '10px 14px', display: 'flex', gap: 5, alignItems: 'center' }}>
                          {[0, 1, 2].map(d => (
                            <div key={d} style={{ width: 6, height: 6, borderRadius: '50%', background: '#818cf8', animation: `bounce 1.2s ${d * 0.2}s infinite` }} />
                          ))}
                        </div>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>

                  {/* Quick Ideas */}
                  <div style={{ padding: '8px 14px 0', background: '#f9fafb' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {['Make it Dark Mode', 'Change to blue theme', 'Make text larger', 'Fix spelling'].map(s => (
                        <button key={s} onClick={() => processAiChat(s)} disabled={chatLoading} style={{ fontSize: 10, border: '1px solid #e5e7eb', borderRadius: 100, padding: '4px 10px', background: '#fff', cursor: chatLoading ? 'not-allowed' : 'pointer', color: '#4b5563', transition: 'all 0.2s' }}>{s}</button>
                      ))}
                    </div>
                  </div>

                  {/* Input Area */}
                  <div style={{ padding: '8px 14px 12px', borderTop: 'none', background: '#f9fafb' }}>
                    <div style={{ background: '#fff', border: `1px solid ${chatInput.trim() ? '#6366f1' : '#d1d5db'}`, borderRadius: 14, padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 8, transition: 'border-color 0.2s', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)' }}>
                      <textarea
                        ref={aiInputRef}
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            processAiChat();
                          }
                        }}
                        placeholder="How can I help you..."
                        style={{ background: 'transparent', border: 'none', color: '#000', fontSize: 12, resize: 'none', outline: 'none', minHeight: 54, fontFamily: 'inherit', lineHeight: 1.5 }}
                      />
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ color: '#9ca3af', fontSize: 10 }}>Enter ↵ to send · Shift+Enter for newline</span>
                        <button
                          onClick={processAiChat}
                          disabled={chatLoading || !chatInput.trim()}
                          style={{ background: chatLoading || !chatInput.trim() ? '#e5e7eb' : 'linear-gradient(135deg,#818cf8,#6366f1)', color: chatLoading || !chatInput.trim() ? '#9ca3af' : '#fff', border: 'none', borderRadius: 10, padding: '6px 14px', fontSize: 12, fontWeight: 700, cursor: chatLoading || !chatInput.trim() ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 5, transition: 'all 0.2s' }}
                        >
                          {chatLoading ? '...' : <><SparklesIcon /> Send</>}
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* SEO Panel */}
            <div style={{ flex: 1, display: leftTab === 'seo' ? 'flex' : 'none', flexDirection: 'column', padding: 20, gap: 20 }}>
              <div style={{ borderBottom: '1px solid #1f2937', paddingBottom: 20 }}>
                <label style={{ display: 'block', color: '#9ca3af', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', marginBottom: 10, letterSpacing: 1 }}>Page Meta Title</label>
                <input type="text" value={pageTitle} onChange={e => setPageTitle(e.target.value)} placeholder="Enter page title..." style={{ width: '100%', background: '#0f172a', border: '1px solid #1f2937', color: '#fff', borderRadius: 8, padding: '10px 12px', fontSize: 14, outline: 'none' }} />
              </div>
              <div style={{ borderBottom: '1px solid #1f2937', paddingBottom: 20 }}>
                <label style={{ display: 'block', color: '#9ca3af', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', marginBottom: 10, letterSpacing: 1 }}>Meta Description</label>
                <textarea value={metaDesc} onChange={e => setMetaDesc(e.target.value)} placeholder="Enter SEO description..." rows={5} style={{ width: '100%', background: '#0f172a', border: '1px solid #1f2937', color: '#fff', borderRadius: 8, padding: '10px 12px', fontSize: 14, outline: 'none', resize: 'none' }} />
              </div>
              <button onClick={() => { updatePageMutation.mutate({ metaTitle: pageTitle, metaDescription: metaDesc }); toast.success('SEO Settings Saved'); }} style={{ background: 'linear-gradient(135deg, #818cf8, #6366f1)', color: '#fff', border: 'none', borderRadius: 10, padding: '12px', fontSize: 13, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(124,58,237,0.3)' }}>Update Settings</button>
            </div>

            {/* Thank You Panel */}
            <div style={{ flex: 1, display: leftTab === 'thank-you' ? 'flex' : 'none', flexDirection: 'column', overflow: 'hidden' }}>
              {leftTab === 'thank-you' && (
                <ThankYouEditorPanel
                  key={`${pageId}-${mode}`}
                  pageId={pageId || ''}
                  industry={page?.industry}
                  isCanvasEmpty={
                    !page?.thankYouPageContent ||
                    page.thankYouPageContent.trim() === '' ||
                    !page?.thankYouPageStyles ||
                    page.thankYouPageStyles.trim() === '' ||
                    page.thankYouPageContent.includes('Landing Page is Ready') ||
                    page.thankYouPageContent.includes('Your request has been successfully submitted')
                  }
                  onSave={() => {
                    toast.success('Thank You settings saved!');
                    handleSave(); // 🚀 Also save the canvas HTML/CSS so they don't get out of sync!
                    queryClient.invalidateQueries({ queryKey: ['page', projId, pageId] });
                  }}
                  onSelect={async (html, css) => {
                    if (modeRef.current !== 'thank-you') {
                      console.warn('Blocked Thank You template from applying in Landing mode');
                      return;
                    }
                    if (editorRef.current) {
                      console.log(`🎬 Applying Thank You template to canvas... (HTML length: ${html?.length})`);
                      setIsCanvasLoading(true);

                      // Clear editor state
                      editorRef.current.setComponents('');
                      try {
                        if (editorRef.current.DomComponents?.clear) editorRef.current.DomComponents.clear();
                        // @ts-ignore
                        if (editorRef.current.Css?.clear) editorRef.current.Css.clear();
                        // @ts-ignore
                        if (editorRef.current.UndoManager?.clear) editorRef.current.UndoManager.clear();
                      } catch (e) { }

                      let finalHtml = html;
                      let finalCss = css || '';

                      // Parse full HTML document
                      if (html.toLowerCase().includes('<body')) {
                        try {
                          const parser = new DOMParser();
                          const doc = parser.parseFromString(html, 'text/html');

                          // Extract styles
                          const styleTags = Array.from(doc.querySelectorAll('style')).map(s => s.textContent).join('\n');
                          if (styleTags) finalCss = (finalCss || '') + '\n' + styleTags;

                          // Backup scripts
                          const allTemplateScripts = Array.from(doc.querySelectorAll('script'));
                          const newBackupScripts = allTemplateScripts
                            .filter(s => {
                              const src = s.getAttribute('src') || '';
                              if (src.includes('cdn.tailwindcss.com')) return false;
                              if (s.innerHTML.includes('tailwind.config')) return false;
                              return true;
                            })
                            .map(s => s.outerHTML)
                            .join('\n');
                          if (newBackupScripts) {
                            setExtractedTemplateScripts(newBackupScripts);
                          }

                          finalHtml = doc.body.innerHTML;
                        } catch (e) {
                          console.error('Error parsing Thank You HTML:', e);
                        }
                      } else {
                        const scriptMatches = html.match(/<script\b[^>]*>[\s\S]*?<\/script>/gi) || ([] as string[]);
                        const filteredScripts = scriptMatches.filter((s: string) =>
                          !s.includes('cdn.tailwindcss.com') && !s.includes('tailwind.config')
                        );
                        if (filteredScripts.length > 0) {
                          setExtractedTemplateScripts(filteredScripts.join('\n'));
                        }
                      }

                      // Apply content — strip body{} rules and style tags to avoid iframe margin issues and CssComposer lag
                      finalHtml = finalHtml.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
                      editorRef.current.setComponents(finalHtml);
                      if (finalCss) {
                        // ⚠️ Remove body margin/padding from template CSS to prevent iframe scroll issues
                        const cleanCss = finalCss
                          .replace(/body\s*\{[^}]*margin[^}]*\}/gi, '')
                          .replace(/body\s*\{[^}]*padding[^}]*\}/gi, '');
                        // Intentionally skipping setStyle to avoid SelectorManager click lag
                      }

                      // Inject CSS directly into canvas iframe for reliable rendering
                      try {
                        const canvasDoc = editorRef.current.Canvas.getDocument();
                        if (canvasDoc && finalCss) {
                          let tplTag = canvasDoc.getElementById('template-styles') as HTMLStyleElement | null;
                          if (!tplTag) {
                            tplTag = canvasDoc.createElement('style');
                            tplTag.id = 'template-styles';
                            canvasDoc.head.appendChild(tplTag);
                          }
                          // Reset body margin/padding in canvas to prevent scrollbar/padding issues
                          tplTag.innerHTML = `
                          body, html { margin: 0 !important; padding: 0 !important; overflow-x: hidden; }
                          ${finalCss}
                        `;
                        }
                      } catch (e) { }

                      editorRef.current.refresh();
                      setTimeout(() => setIsCanvasLoading(false), 200);
                    }
                  }}
                />
              )}
            </div>
          </div>
        </div>

        {/* ══ CANVAS (light grey bg) ══ */}
        <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#e5e7eb' }}>
          <div id="gjs" style={{ flex: 1, overflow: 'hidden' }} />
          {/* ── CSS Loading Overlay — shown while template CSS/fonts load ── */}
          {isCanvasLoading && (
            <div style={{
              position: 'absolute', inset: 0, zIndex: 50,
              background: 'rgba(226, 232, 240, 0.85)',
              backdropFilter: 'blur(2px)',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: 14,
              pointerEvents: 'none',
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: '50%',
                border: '3px solid rgba(124,58,237,0.15)',
                borderTop: '3px solid #818cf8',
                animation: 'spin 0.8s linear infinite',
              }} />
              <p style={{ color: '#818cf8', fontWeight: 700, fontSize: 13, letterSpacing: 0.3, margin: 0 }}>
                Loading template...
              </p>
              <style dangerouslySetInnerHTML={{ __html: `@keyframes spin { to { transform: rotate(360deg); } }` }} />
            </div>
          )}
        </div>

        {/* ══ RIGHT SIDEBAR ══ */}
        <div style={{ position: 'relative', display: 'flex' }}>
          <button
            onClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
            className="absolute top-6 z-50 h-6 w-6 rounded-full border border-gray-200 bg-white flex items-center justify-center shadow-sm hover:shadow hover:bg-gray-50 text-gray-500 hover:text-gray-900 transition-all duration-300 cursor-pointer"
            style={{ left: isRightSidebarOpen ? '-12px' : '-36px' }}
            title="Toggle Right Sidebar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
              <path d={isRightSidebarOpen ? "m15 18-6-6 6-6" : "m9 18 6-6-6-6"}></path>
            </svg>
          </button>

          <div className="gjs-editor gjs-one-bg" style={{
            width: isRightSidebarOpen ? 280 : 0,
            opacity: isRightSidebarOpen ? 1 : 0,
            overflow: 'hidden',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            flexShrink: 0, background: '#ffffff',
            borderLeft: isRightSidebarOpen ? '1px solid #e5e7eb' : 'none',
            display: 'flex', flexDirection: 'column',
          }}>
            {/* Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb', height: 48, alignItems: 'center', background: '#ffffff' }}>
              <TabButton active={rightTab === 'styles'} onClick={() => setRightTab('styles')}>Styles</TabButton>
              <TabButton active={rightTab === 'traits'} onClick={() => setRightTab('traits')}>Properties</TabButton>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', display: rightTab === 'styles' ? 'block' : 'none', background: '#ffffff' }}>
              <div id="styles-container" />

              <details className="selectors-accordion" style={{ background: '#ffffff', borderBottom: '1px solid #e5e7eb' }}>
                <summary className="gs-style-manager-sector-header" style={{ listStyle: 'none' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', fontSize: '13px', fontWeight: 500, color: '#111827', marginLeft: '5px' }}>
                      Classes & States
                    </div>
                    <div className="gs-cmp-accordion-handler-toggle selectors-arrow" style={{ display: 'flex', alignItems: 'center' }}>
                    </div>
                  </div>
                </summary>
                <div id="selectors-container" style={{ padding: '12px', background: '#fff' }} />
              </details>

              <style dangerouslySetInnerHTML={{
                __html: `
              .selectors-accordion summary::-webkit-details-marker { display: none; }
              .selectors-accordion[open] .selectors-arrow { transform: rotate(90deg); }
              .selectors-arrow { transition: transform 0.2s; }
              #selectors-container .gjs-clm-tags:nth-child(n+2) { display: none !important; }
            `}} />
            </div>
            <div id="traits-container" style={{ flex: 1, overflowY: 'auto', display: rightTab === 'traits' ? 'block' : 'none', background: '#ffffff' }} />
          </div>
        </div>
      </div>

      {/* ═══════════════ AI PROMPT MODAL ═══════════════ */}
      {aiOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 520, background: '#111827', borderRadius: 16, border: '1px solid #1f2937', overflow: 'hidden', boxShadow: '0 25px 60px rgba(0,0,0,.4)' }}>
            {/* Header */}
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #1f2937', display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg,#818cf8,#6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <SparklesIcon />
              </div>
              <span style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>AI Section Generator</span>
              <div style={{ flex: 1 }} />
              <button onClick={() => setAiOpen(false)} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', fontSize: 18, lineHeight: 1 }}>✕</button>
            </div>

            {/* Body */}
            <div style={{ padding: 20 }}>
              <p style={{ color: '#94a3b8', fontSize: 13, margin: '0 0 12px' }}>
                Describe what you want to add or change. If you select an element on canvas first, AI will replace that section.
              </p>

              {/* Quick prompts */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
                {['Add hero section', 'Add contact form', 'Add pricing table', 'Add testimonials', 'Add FAQ section', 'Add CTA banner'].map(q => (
                  <button
                    key={q}
                    onClick={() => setAiPrompt(q)}
                    style={{
                      background: '#252540', color: '#a5b4fc', border: '1px solid #1f2937',
                      borderRadius: 6, padding: '5px 12px', fontSize: 11, fontWeight: 500, cursor: 'pointer',
                    }}
                  >{q}</button>
                ))}
              </div>

              <textarea
                value={aiPrompt}
                onChange={e => setAiPrompt(e.target.value)}
                placeholder="e.g., Create a hero section with a lead capture form for a roofing company..."
                rows={4}
                style={{
                  width: '100%', background: '#111128', color: '#e5e7eb', border: '1px solid #1f2937',
                  borderRadius: 8, padding: 14, fontSize: 13, fontFamily: 'inherit', outline: 'none', resize: 'vertical', boxSizing: 'border-box',
                }}
              />

              <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                <button onClick={() => setAiOpen(false)} style={{ flex: 1, background: '#252540', color: '#94a3b8', border: 'none', borderRadius: 8, padding: '11px 0', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                  Cancel
                </button>
                <button
                  onClick={handleAiGenerate}
                  disabled={aiLoading || !aiPrompt.trim()}
                  style={{
                    flex: 2, background: 'linear-gradient(135deg,#818cf8,#6366f1)', color: '#fff',
                    border: 'none', borderRadius: 8, padding: '11px 0', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                    opacity: (aiLoading || !aiPrompt.trim()) ? 0.5 : 1,
                  }}
                >
                  {aiLoading ? '✨ Generating...' : '✨ Generate Section'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════ EDIT COMPONENT AI MODAL ═══════════════ */}
      {editAiOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 440, background: '#111827', borderRadius: 16, border: '1px solid #1f2937', overflow: 'hidden', boxShadow: '0 25px 60px rgba(0,0,0,.4)' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #1f2937', display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(124,58,237,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c084fc' }}>
                <SparklesIcon />
              </div>
              <span style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>Edit component with AI</span>
              <div style={{ flex: 1 }} />
              <button onClick={() => setEditAiOpen(false)} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', fontSize: 18, lineHeight: 1 }}>✕</button>
            </div>
            <div style={{ padding: 20 }}>
              <label style={{ display: 'block', color: '#94a3b8', fontSize: 13, fontWeight: 500, marginBottom: 8 }}>Describe your changes</label>
              <textarea
                value={editAiPrompt}
                onChange={e => setEditAiPrompt(e.target.value)}
                onKeyDown={e => {
                  if (e.ctrlKey && e.key === 'Enter') {
                    handleEditAiGenerate();
                  }
                }}
                placeholder="e.g. Make the text more compelling and add a secondary button."
                rows={3}
                autoFocus
                style={{
                  width: '100%', background: '#111128', color: '#e5e7eb', border: '1px solid #1f2937',
                  borderRadius: 8, padding: 14, fontSize: 13, fontFamily: 'inherit', outline: 'none', resize: 'vertical', boxSizing: 'border-box',
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
                <span style={{ fontSize: 12, color: '#64748b', display: 'flex', alignItems: 'center', gap: 6 }}>
                  Submit with <kbd style={{ background: '#252540', padding: '2px 6px', borderRadius: 4, border: '1px solid #475569', color: '#9ca3af', fontSize: 11, fontFamily: 'inherit' }}>Ctrl</kbd> + <kbd style={{ background: '#252540', padding: '2px 6px', borderRadius: 4, border: '1px solid #475569', color: '#9ca3af', fontSize: 11, fontFamily: 'inherit' }}>↵</kbd>
                </span>
                <button
                  onClick={handleEditAiGenerate}
                  disabled={aiLoading || !editAiPrompt.trim()}
                  style={{
                    background: 'linear-gradient(135deg,#818cf8,#6366f1)', color: '#fff',
                    border: 'none', borderRadius: 8, padding: '9px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                    opacity: (aiLoading || !editAiPrompt.trim()) ? 0.5 : 1, display: 'flex', alignItems: 'center', gap: 6
                  }}
                >
                  {aiLoading ? 'Editing...' : 'Edit with AI'} <SparklesIcon />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════ SEO MODAL ═══════════════ */}
      {seoOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 480, background: '#111827', borderRadius: 16, border: '1px solid #1f2937', overflow: 'hidden', boxShadow: '0 25px 60px rgba(0,0,0,.4)' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #1f2937', display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg,#10b981,#3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <SettingsIcon />
              </div>
              <span style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>SEO & Page Settings</span>
              <div style={{ flex: 1 }} />
              <button onClick={() => setSeoOpen(false)} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', fontSize: 18, lineHeight: 1 }}>✕</button>
            </div>
            <div style={{ padding: 24 }}>
              <div style={{ marginBottom: 18 }}>
                <label style={{ display: 'block', color: '#94a3b8', fontSize: 12, fontWeight: 600, marginBottom: 8 }}>Page Title</label>
                <input
                  type="text"
                  value={pageTitle}
                  onChange={e => setPageTitle(e.target.value)}
                  placeholder="E.g. My Awesome Landing Page"
                  style={{ width: '100%', background: '#111128', color: '#e5e7eb', border: '1px solid #1f2937', borderRadius: 8, padding: '12px 14px', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', color: '#94a3b8', fontSize: 12, fontWeight: 600, marginBottom: 8 }}>Meta Description</label>
                <textarea
                  value={metaDesc}
                  onChange={e => setMetaDesc(e.target.value)}
                  placeholder="Brief description of your page for search engines..."
                  rows={4}
                  style={{ width: '100%', background: '#111128', color: '#e5e7eb', border: '1px solid #1f2937', borderRadius: 8, padding: '12px 14px', fontSize: 13, outline: 'none', boxSizing: 'border-box', resize: 'vertical' }}
                />
              </div>
              <div style={{ marginBottom: 24, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#e5e7eb', fontSize: 13, cursor: 'pointer' }}>
                  <input type="checkbox" checked={noIndex} onChange={e => setNoIndex(e.target.checked)} style={{ cursor: 'pointer' }} />
                  Hide from search engines (noindex)
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#e5e7eb', fontSize: 13, cursor: 'pointer' }}>
                  <input type="checkbox" checked={noFollow} onChange={e => setNoFollow(e.target.checked)} style={{ cursor: 'pointer' }} />
                  Do not follow links (nofollow)
                </label>
              </div>
              <button
                onClick={() => {
                  updatePageMutation.mutate({
                    metaTitle: pageTitle,
                    metaDescription: metaDesc,
                    noIndex,
                    noFollow
                  });
                  setSeoOpen(false);
                  toast.success('SEO Settings updated!');
                }}
                style={{ width: '100%', background: 'linear-gradient(135deg,#10b981,#3b82f6)', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 0', fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'opacity 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════ PUBLISH SUCCESS MODAL ═══════════════ */}
      {publishModalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 99999, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
          <div style={{ width: 500, background: 'linear-gradient(145deg, #111827, #16213e)', borderRadius: 20, border: '1px solid rgba(124,58,237,0.4)', overflow: 'hidden', boxShadow: '0 30px 80px rgba(0,0,0,0.6)', animation: 'publishPop 0.35s cubic-bezier(0.34,1.56,0.64,1)' }}>
            {/* Top gradient banner */}
            <div style={{ background: 'linear-gradient(135deg, #818cf8 0%, #6366f1 50%, #06b6d4 100%)', padding: '32px 32px 28px', textAlign: 'center', position: 'relative' }}>
              {/* Confetti dots */}
              {['#fbbf24', '#34d399', '#f87171', '#60a5fa', '#818cf8'].map((c, i) => (
                <div key={i} style={{ position: 'absolute', width: 8, height: 8, borderRadius: '50%', background: c, top: `${10 + i * 14}%`, left: `${8 + i * 16}%`, opacity: 0.8 }} />
              ))}
              {['#f87171', '#34d399', '#fbbf24'].map((c, i) => (
                <div key={i} style={{ position: 'absolute', width: 6, height: 6, borderRadius: '50%', background: c, top: `${20 + i * 20}%`, right: `${6 + i * 14}%`, opacity: 0.7 }} />
              ))}
              <button
                onClick={() => setPublishModalOpen(false)}
                style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', cursor: 'pointer', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.2s', zIndex: 10 }}
                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.5)'}
                onMouseOut={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.3)'}
              >
                <X size={18} strokeWidth={2.5} />
              </button>
              <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', backdropFilter: 'blur(8px)', border: '2px solid rgba(255,255,255,0.2)' }}>
                <span style={{ fontSize: 36 }}>🚀</span>
              </div>
              <h2 style={{ color: '#fff', fontSize: 22, fontWeight: 800, margin: '0 0 8px', letterSpacing: '-0.3px' }}>Your site is now live!</h2>
            </div>

            {/* Body */}
            <div style={{ padding: '24px 28px' }}>
              {/* Live URL */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', color: '#6b7280', fontSize: 11, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 8 }}>Live URL</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '10px 14px' }}>
                  <a href={publishedUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#10b981', fontSize: 12, flex: 1, textDecoration: 'underline', fontFamily: 'monospace', wordBreak: 'break-all', fontWeight: 600 }}>{publishedUrl}</a>
                  <button
                    onClick={async (e) => {
                      const btn = e.currentTarget;
                      const originalContent = btn.innerHTML;
                      const success = await copyToClipboard(publishedUrl);
                      if (success) {
                        toast.success('URL copied to clipboard!');
                        btn.innerHTML = '<span style="display:flex;align-items:center;gap:4px">Copied!</span>';
                        btn.style.background = 'rgba(16,185,129,0.2)';
                        btn.style.color = '#34d399';
                        setTimeout(() => {
                          btn.innerHTML = originalContent;
                          btn.style.background = 'rgba(124,58,237,0.2)';
                          btn.style.color = '#818cf8';
                        }, 2000);
                      } else {
                        toast.error('Failed to copy. Please copy manually.');
                      }
                    }}
                    style={{ background: 'rgba(124,58,237,0.2)', border: '1px solid rgba(124,58,237,0.3)', color: '#818cf8', borderRadius: 6, padding: '6px 12px', fontSize: 11, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0, transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 6 }}
                  >
                    <Copy size={12} />
                    Copy
                  </button>
                </div>
              </div>





              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: 10 }}>

                <button
                  onClick={() => {
                    setPublishModalOpen(false);
                    setSiteStatus('published');
                    toast.success('Site successfully published and status updated!');
                  }}
                  style={{ flex: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: 'linear-gradient(135deg, #818cf8, #6366f1)', color: '#fff', border: 'none', borderRadius: 10, padding: '12px 0', fontSize: 13, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(124,58,237,0.4)' }}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
          <style dangerouslySetInnerHTML={{ __html: `@keyframes publishPop { 0%{opacity:0;transform:scale(0.85) translateY(20px)} 100%{opacity:1;transform:scale(1) translateY(0)} }` }} />
        </div>
      )}



      {/* ═══════════════ CODE VIEW MODAL ═══════════════ */}
      {codeView && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,.9)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ height: 48, background: '#111827', borderBottom: '1px solid #1f2937', display: 'flex', alignItems: 'center', padding: '0 16px', gap: 10 }}>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>Code Editor</span>
            <div style={{ flex: 1 }} />
            <button onClick={applyCode} style={{ ...modalBtn, background: '#818cf8' }}>Apply Code</button>
            <button onClick={downloadHtml} style={{ ...modalBtn, background: '#059669' }}>Download HTML</button>
            <button onClick={() => setCodeView(false)} style={{ ...modalBtn, background: '#374151' }}>Close</button>
          </div>
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', overflow: 'hidden' }}>
            <div style={{ display: 'flex', flexDirection: 'column', borderRight: '1px solid #1f2937' }}>
              <div style={{ padding: '8px 14px', background: '#0f0f1e', color: '#818cf8', fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>HTML</div>
              <textarea
                value={htmlCode} onChange={e => setHtmlCode(e.target.value)}
                style={{ flex: 1, background: '#0a0a16', color: '#e5e7eb', border: 'none', padding: 16, fontFamily: '"Fira Code",monospace', fontSize: 12, resize: 'none', outline: 'none', lineHeight: 1.7 }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '8px 14px', background: '#0f0f1e', color: '#22d3ee', fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>CSS</div>
              <textarea
                value={cssCode} onChange={e => setCssCode(e.target.value)}
                style={{ flex: 1, background: '#0a0a16', color: '#e5e7eb', border: 'none', padding: 16, fontFamily: '"Fira Code",monospace', fontSize: 12, resize: 'none', outline: 'none', lineHeight: 1.7 }}
              />
            </div>
          </div>
        </div>
      )}


    </div>
  );
};

/* ══════ HELPER COMPONENTS ══════ */

/* ── Color Picker Helpers ── */
const normalizeToHex = (color: string): string => {
  if (!color || color === 'transparent' || color === 'none') return '#000000';
  color = color.trim();
  if (color.startsWith('#')) {
    if (color.length === 4) return '#' + color[1] + color[1] + color[2] + color[2] + color[3] + color[3];
    return color.slice(0, 7);
  }
  const m = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (m) return '#' + [m[1], m[2], m[3]].map(n => parseInt(n).toString(16).padStart(2, '0')).join('');
  return '#000000';
};

const resolveCssProp = (label: string, wrapper: HTMLElement | null): string => {
  const labelMap: Record<string, string> = {
    'color': 'color', 'text color': 'color', 'font color': 'color', 'colour': 'color',
    'background': 'background-color', 'background color': 'background-color',
    'background-color': 'background-color', 'bg color': 'background-color', 'bg': 'background-color',
    'border': 'border-color', 'border color': 'border-color', 'border-color': 'border-color',
    'text-shadow': 'text-shadow', 'box-shadow': 'box-shadow',
  };
  if (labelMap[label]) return labelMap[label];
  // Try to extract from wrapper class names
  if (wrapper) {
    const cls = Array.from(wrapper.classList).join(' ');
    if (cls.includes('background-color')) return 'background-color';
    if (cls.includes('border-color')) return 'border-color';
    if (cls.includes('color')) return 'color';
  }
  return label || 'color';
};

const hslToHex = (h: number, s: number, l: number): string => {
  s /= 100; l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const clr = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * clr).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};

const blendWithWhiteBlack = (hex: string, ratio: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const blend = (channel: number) => {
    if (ratio < 0.5) return Math.round(channel * (ratio * 2));
    return Math.round(channel + (255 - channel) * ((ratio - 0.5) * 2));
  };
  return '#' + [blend(r), blend(g), blend(b)].map(n => n.toString(16).padStart(2, '0')).join('');
};

const Sep = () => <div style={{ width: 1, height: 20, background: '#e5e7eb', margin: '0 2px' }} />;

const TBtn = ({ children, onClick, title, active = false }: { children: React.ReactNode; onClick: () => void; title?: string; active?: boolean }) => (
  <button title={title} onClick={onClick} style={{
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: active ? '#fff' : 'transparent',
    color: active ? '#4f46e5' : '#64748b',
    boxShadow: active ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
    border: 'none', borderRadius: 5, padding: '5px 8px', cursor: 'pointer',
    transition: 'all .12s', minWidth: 30, height: 30,
  }}
    onMouseEnter={e => { if (!active) { (e.currentTarget as HTMLButtonElement).style.background = '#e5e7eb'; (e.currentTarget as HTMLButtonElement).style.color = '#111827'; } }}
    onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = '#64748b'; } }}
  >{children}</button>
);
const TabButton = ({ children, active, onClick }: { children: React.ReactNode; active: boolean; onClick: () => void }) => (
  <button onClick={onClick} style={{
    flex: 1, padding: '0 16px', height: '100%', fontSize: 13, fontWeight: 500, border: 'none',
    background: 'none', cursor: 'pointer', letterSpacing: 0,
    color: active ? '#818cf8' : '#4b5563',
    borderBottom: `2px solid ${active ? '#818cf8' : 'transparent'}`,
    transition: 'all .2s',
    textTransform: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 0
  }}>{children}</button>
);

const NavIcon = ({ children, active, onClick, title }: { children: React.ReactNode; active: boolean; onClick: () => void; title?: string }) => (
  <button onClick={onClick} className="group relative" style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
    width: '100%', background: 'none', border: 'none', cursor: 'pointer',
    color: active ? '#6366f1' : '#000000', transition: 'all .2s'
  }}>
    <div style={{ padding: 8, borderRadius: 8, background: active ? 'rgba(99,102,241,0.1)' : 'transparent' }}>
      {Array.isArray(children) ? children[0] : children}
    </div>
    <div className="absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 px-2.5 py-1.5 bg-slate-800 text-white text-xs font-medium rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-md">
      {title || (Array.isArray(children) ? children[1] : null)}
    </div>
  </button>
);

/* ── Styles ── */
const outlineBtn: React.CSSProperties = {
  display: 'flex', alignItems: 'center', background: 'transparent',
  border: '1px solid #1f2937', borderRadius: 7, padding: '6px 12px',
  fontSize: 13, fontWeight: 500, color: '#e5e7eb', cursor: 'pointer',
};
const modalBtn: React.CSSProperties = {
  color: '#fff', border: 'none', borderRadius: 6, padding: '7px 16px',
  fontSize: 12, fontWeight: 600, cursor: 'pointer',
};

/* ── SVG Icons ── */
const LayoutIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="3" y1="9" x2="21" y2="9" /></svg>;
const CodeIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>;
const DesktopIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>;
const TabletIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="2" width="16" height="20" rx="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></svg>;
const MobileIcon = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></svg>;
const UndoIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 14 4 9 9 4" /><path d="M20 20v-7a4 4 0 0 0-4-4H4" /></svg>;
const RedoIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 14 20 9 15 4" /><path d="M4 20v-7a4 4 0 0 1 4-4h12" /></svg>;
const ZapIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
);
const TrashIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4h6v2" /></svg>;
const EyeIcon = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>;
const SaveIcon = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>;
const SparklesIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3z" /></svg>;
const SettingsIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>;
const RocketIcon = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" /><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" /><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" /><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" /></svg>;
const GridIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>;
const LayersIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>;
const SuccessIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;
const GemIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h12l4 6-10 12L2 9Z" /><path d="M11 3 8 9l3 12" /><path d="m13 3 3 6-3 12" /><path d="M2 9h20" /></svg>;

const HomeIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>;
const LogoutIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>;
const PaletteIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c1.06 0 1.92-.86 1.92-1.92 0-.49-.19-.94-.5-1.28-.3-.32-.48-.75-.48-1.2 0-.96.79-1.74 1.76-1.74h2.15c2.81 0 5.15-2.3 5.15-5.15C22 6.35 17.5 2 12 2zm-4.5 9c-.83 0-1.5-.67-1.5-1.5S6.67 8 7.5 8s1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm3.5-3.5c-.83 0-1.5-.67-1.5-1.5S10.17 4.5 11 4.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4 0c-.83 0-1.5-.67-1.5-1.5S14.17 4.5 15 4.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm3.5 3.5c-.83 0-1.5-.67-1.5-1.5S17.67 8 18.5 8s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" /></svg>;
const DownloadIcon = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>;
const SpinnerIcon = () => (
  <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

/**
 * mergeScripts — Intelligently merge two sets of <script> tag strings.
 * Uses `src` attribute as key for external scripts and inner content as key
 * for inline scripts so that duplicates are never included.
 * Tailwind CDN and tailwind.config scripts are always filtered out here
 * since they are injected separately by PublicLandingPage.
 */
function mergeScripts(canvasScripts: string, backupScripts: string): string {
  const unique = new Map<string, string>();

  const addScripts = (html: string) => {
    if (!html) return;
    const matches = html.match(/<script\b[^>]*>[\s\S]*?<\/script>/gi) || ([] as string[]);
    matches.forEach((tag: string) => {
      // Skip tailwind — added by renderer
      if (tag.includes('cdn.tailwindcss.com')) return;
      if (tag.includes('tailwind.config')) return;

      // Determine dedup key: src for external, trimmed body for inline
      const srcMatch = tag.match(/src=["']([^"']+)["']/i);
      if (srcMatch) {
        const src = srcMatch[1].trim();
        if (!unique.has(src)) unique.set(src, tag);
      } else {
        const body = tag.replace(/<script\b[^>]*>/i, '').replace(/<\/script>/i, '').trim();
        if (body && !unique.has(body)) unique.set(body, tag);
      }
    });
  };

  addScripts(canvasScripts);
  addScripts(backupScripts);
  return Array.from(unique.values()).join('\n');
}

/**
 * extractCanvasScripts — Pull all <script> tags from a GrapesJS canvas document.
 * Skips Tailwind CDN (re-injected by renderer) and tailwind.config blocks.
 */
function extractCanvasScripts(canvasDoc: Document): string {
  const scriptTags = Array.from(canvasDoc.querySelectorAll('script'));
  const unique = new Map<string, string>();
  scriptTags.forEach(s => {
    const src = s.getAttribute('src');
    if (src && src.includes('cdn.tailwindcss.com')) return;
    if (s.innerHTML.includes('tailwind.config')) return;
    const key = src ? src : s.innerHTML.trim();
    if (key && !unique.has(key)) unique.set(key, s.outerHTML);
  });
  return Array.from(unique.values()).join('\n');
}

/**
 * buildPublishHtml — Build a complete, self-contained HTML document
 * that works correctly when served standalone (via WordPress plugin or direct URL).
 * This ensures CSS, JS, and all interactive features work after publish.
 */
function buildPublishHtml(
  bodyHtml: string,
  css: string,
  scripts: string,
  opts: { title?: string; desc?: string; primaryColor?: string; secondaryColor?: string }
): string {
  const primary = opts.primaryColor || '#818cf8';
  const secondary = opts.secondaryColor || '#6366f1';
  const title = (opts.title || 'Landing Page').replace(/"/g, '&quot;');
  const desc = (opts.desc || '').replace(/"/g, '&quot;');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>${title}</title>
  ${desc ? `<meta name="description" content="${desc}"/>` : ''}
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            primary: '${primary}',
            secondary: '${secondary}'
          }
        }
      }
    };
  </script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"/>
  <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"/>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"/>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700;800;900&family=Montserrat:wght@300;400;600;700;800&family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Manrope:wght@300;400;600;700&family=Outfit:wght@300;400;600;700&display=swap" rel="stylesheet"/>
  <style>
    :root {
      --primary: ${primary};
      --secondary: ${secondary};
      --accent: ${secondary};
      --gold: ${primary};
      --forest: ${primary};
      --btn-bg: ${primary};
      --btn-text: #ffffff;
      --button-gradient: linear-gradient(135deg, ${primary}, ${secondary});
    }
    *, *::before, *::after { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; min-height: 100vh; }
    ${css}
  </style>
</head>
<body>
${bodyHtml}
${scripts}
<script>
(function() {
  function initPublishedPage() {
    // 1. Enable JS-driven styles
    document.body.classList.add('js-enabled');

    // 2. Scroll animations
    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) entry.target.classList.add('in-view');
        });
      }, { threshold: 0.1 });
      document.querySelectorAll('.animate-up, .animate-fade').forEach(function(el) {
        observer.observe(el);
      });
    } else {
      // Fallback: show all immediately
      document.querySelectorAll('.animate-up, .animate-fade').forEach(function(el) {
        el.classList.add('in-view');
      });
    }

    // 3. Tab interactions — index-based, works with any tab structure
    document.querySelectorAll('.tabs-container').forEach(function(container) {
      var allTabs = Array.from(container.querySelectorAll('.tab-item'));
      var allPanels = Array.from(container.querySelectorAll('.tab-content-box'));

      // Ensure first tab is active if none are
      var hasActive = allPanels.some(function(p) { return p.classList.contains('active'); });
      if (!hasActive && allTabs.length > 0) {
        allTabs[0].classList.add('active');
        if (allPanels[0]) {
          allPanels[0].classList.add('active');
          allPanels[0].style.display = 'block';
        }
      }

      allTabs.forEach(function(tabEl, index) {
        tabEl.style.cursor = 'pointer';
        tabEl.addEventListener('click', function() {
          allTabs.forEach(function(t) { t.classList.remove('active'); });
          allPanels.forEach(function(p) { p.classList.remove('active'); p.style.display = 'none'; });
          tabEl.classList.add('active');
          if (allPanels[index]) {
            allPanels[index].classList.add('active');
            allPanels[index].style.display = 'block';
          }
        });
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPublishedPage);
  } else {
    initPublishedPage();
  }
})();
</script>
</body>
</html>`;
}

function parseInlineStyle(styleStr: string): Record<string, string> {
  const styleObj: Record<string, string> = {};
  if (!styleStr) return styleObj;
  // Split by semicolon not inside parentheses (to handle data URLs/functions)
  const props = styleStr.split(/;(?![^(]*\))/);
  props.forEach(prop => {
    const [key, ...valParts] = prop.split(':');
    if (key && valParts.length > 0) {
      styleObj[key.trim()] = valParts.join(':').trim();
    }
  });
  return styleObj;
}

function buildFullHtml(html: string, css: string, title = 'Landing Page', desc = '', externalCssFile = 'landing-page.css') {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>${title}</title>
  ${desc ? `<meta name="description" content="${desc}"/>` : ''}
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&family=Material+Icons&display=swap" rel="stylesheet"/>
  <link rel="stylesheet" href="./${externalCssFile}"/>
  <style>*,*::before,*::after{box-sizing:border-box}body{margin:0;font-family:'Inter',system-ui,sans-serif}</style>
</head>
<body>${html}</body>
</html>`;
}

function formatCssPretty(css: string): string {
  return css
    .replace(/\s+/g, ' ')
    .replace(/\s*{\s*/g, ' {\n  ')
    .replace(/;\s*/g, ';\n  ')
    .replace(/\s*}\s*/g, '\n}\n\n')
    .replace(/\n\s*\n\s*\n/g, '\n\n')
    .trim();
}

function formatHtmlPretty(html: string): string {
  if (!html.trim()) return '';
  const container = document.createElement('div');
  container.innerHTML = html;
  const formatNode = (node: Node, indentLevel: number): string => {
    const indent = '  '.repeat(indentLevel);
    if (node.nodeType === Node.TEXT_NODE) {
      const text = (node.textContent || '').trim();
      return text ? `${indent}${text}\n` : '';
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return '';

    const el = node as HTMLElement;
    const tag = el.tagName.toLowerCase();
    const attrs = Array.from(el.attributes)
      .map((attr) => `${attr.name}="${attr.value}"`)
      .join(' ');
    const openTag = attrs ? `<${tag} ${attrs}>` : `<${tag}>`;
    const closeTag = `</${tag}>`;
    const children = Array.from(el.childNodes);

    if (!children.length) {
      return `${indent}${openTag}${closeTag}\n`;
    }

    const childrenTextOnly = children.every(
      (child) => child.nodeType === Node.TEXT_NODE && (child.textContent || '').trim()
    );

    if (childrenTextOnly) {
      const inlineText = children.map((child) => (child.textContent || '').trim()).join(' ');
      return `${indent}${openTag}${inlineText}${closeTag}\n`;
    }

    let result = `${indent}${openTag}\n`;
    children.forEach((child) => {
      result += formatNode(child, indentLevel + 1);
    });
    result += `${indent}${closeTag}\n`;
    return result;
  };

  return Array.from(container.childNodes)
    .map((node) => formatNode(node, 0))
    .join('')
    .trim();
}

export default GrapesEditor;