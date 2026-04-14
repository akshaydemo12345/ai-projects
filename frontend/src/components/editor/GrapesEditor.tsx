import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import grapesjs from 'grapesjs';
import type { Editor } from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';
// @ts-ignore
import grapesjsPresetWebpage from 'grapesjs-preset-webpage';
// @ts-ignore
import grapesjsBlocksBasic from 'grapesjs-blocks-basic';
import './grapes-custom.css';
import { projectsApi, pagesApi, aiApi, Project, LandingPage } from '../../services/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

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
  const [leftTab, setLeftTab] = useState<'blocks' | 'layers' | 'ai' | 'seo'>('blocks');
  const [rightTab, setRightTab] = useState<'styles' | 'traits'>('styles');
  // AI Prompt
  const [aiOpen, setAiOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [editAiOpen, setEditAiOpen] = useState(false);
  const [editAiPrompt, setEditAiPrompt] = useState('');

  // AI Chat Assistant
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'ai', content: string }[]>([
    { role: 'ai', content: 'Hi! I am your AI Assistant. Select an element and tell me how you want to change it (e.g. "make it red", "change text to Hello").' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  // Publish
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState('');
  // SEO Settings
  const [seoOpen, setSeoOpen] = useState(false);
  const [pageTitle, setPageTitle] = useState('');
  const [metaDesc, setMetaDesc] = useState('');
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

  const colorPickerRef = useRef<HTMLDivElement>(null);
  const cpObserverRef = useRef<MutationObserver | null>(null);
  const aiInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (page) {
      setPageTitle(page.metaTitle || page.name || 'Landing Page');
      setMetaDesc(page.metaDescription || '');
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

  // Handle content application
  const applyContentToEditor = (editor: any) => {
    const currentPage = pageDataRef.current;
    if (!editor || !currentPage) return;

    console.log('🔄 Applying content to editor. Page ID:', currentPage._id, 'Status:', currentPage.status);

    let dbContent: string = '';
    let dbStyles: string = '';

    // 1. Resolve Content Structure
    if (typeof currentPage.content === 'object' && currentPage.content !== null) {
      dbContent = currentPage.content.fullHtml || currentPage.content.html || '';
      dbStyles = currentPage.content.fullCss || currentPage.content.css || '';
    } else if (typeof currentPage.content === 'string') {
      dbContent = currentPage.content;
    }

    // Use explicit styles field as priority or fallback
    if (currentPage.styles) {
      dbStyles = currentPage.styles;
    }    // 2. Intelligent Extraction
    if (dbContent.toLowerCase().includes('<body') || dbContent.toLowerCase().includes('<head')) {
      console.log('📄 Full HTML detected. Using standard GrapesJS import...');
      // If it's full HTML, we let GrapesJS handle it via setComponents
      // But we extract styles just in case to avoid duplicates
      try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(dbContent, 'text/html');
        const styles = Array.from(doc.querySelectorAll('style')).map(s => s.textContent).join('\n');
        if (styles) dbStyles = (dbStyles || '') + '\n' + styles;

        // Take body content
        dbContent = doc.body.innerHTML;

        // Apply body style to wrapper
        const bodyStyle = doc.body.getAttribute('style');
        if (bodyStyle) editor.getWrapper().addStyle(bodyStyle);
      } catch (e) { }
    }

    // 3. Set to Editor
    if (dbContent && dbContent.trim().length > 10) {
      console.log('💎 Injecting branding variables and setting content...');

      // Clear then set
      editor.setComponents('');

      // Ensure variables are in the global style manager
      const rootVars = `:root { 
        --primary: ${currentPage.primaryColor}; 
        --secondary: ${currentPage.secondaryColor}; 
        --accent: ${currentPage.secondaryColor};
        --button-gradient: linear-gradient(135deg, ${currentPage.primaryColor}, ${currentPage.secondaryColor});
      }`;

      editor.setStyle(rootVars + (dbStyles || ''));

      // Apply body/wrapper style explicitly if detected
      if (dbStyles.includes('#0f172a') || dbStyles.includes('rgba(15, 23, 42') || dbStyles.includes('var(--slate-950)')) {
        editor.getWrapper().addStyle({ 'background-color': '#0f172a' });
      }

      editor.setComponents(dbContent);
    } else {
      console.warn('⚠️ GrapesJS: Content empty or too short. Setting placeholder.');
      editor.setComponents('<div style="padding: 100px 20px; text-align: center; font-family: sans-serif; color: #64748b;">' +
        '<h2 style="margin-bottom: 10px;">Your Landing Page is Ready</h2>' +
        '<p>Start editing by choosing a block from the left or use the AI generator.</p>' +
        '</div>');
    }
  };

  // Effect to handle editor initialization (ONCE per pageId)
  useEffect(() => {
    if (projectLoading || pageLoading || !page || !project || editorRef.current) return;

    console.log('🚀 Initializing GrapesJS Editor...');
    const editor = grapesjs.init({
      container: '#gjs',
      height: '100%',
      width: 'auto',
      fromElement: false,
      storageManager: false,
      undoManager: { trackSelection: false },
      plugins: [grapesjsPresetWebpage, grapesjsBlocksBasic],
      pluginsOpts: {
        'grapesjs-preset-webpage': {
          blocksBasicOpts: { flexGrid: true },
          addBasicStyle: true,
        },
        'grapesjs-blocks-basic': { flexGrid: true },
      },
      canvas: {
        styles: [
          'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700;800&display=swap',
        ],
        scripts: [
          'https://cdn.tailwindcss.com'
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
      styleManager: {
        appendTo: '#styles-container',
        sectors: [
          { name: 'Layout', open: true, buildProps: ['display', 'flex-direction', 'justify-content', 'align-items', 'flex-wrap', 'gap'] },
          { name: 'Spacing', open: false, buildProps: ['margin', 'padding'] },
          { name: 'Size', open: false, buildProps: ['width', 'min-width', 'max-width', 'height', 'min-height', 'max-height'] },
          { name: 'Position', open: false, buildProps: ['position', 'top', 'right', 'bottom', 'left', 'z-index'] },
          { name: 'Typography', open: false, buildProps: ['font-family', 'font-size', 'font-weight', 'color', 'line-height', 'letter-spacing', 'text-align', 'text-decoration', 'text-transform'] },
          { name: 'Background', open: false, buildProps: ['background-color', 'background', 'background-image', 'background-repeat', 'background-position', 'background-size'] },
          { name: 'Border', open: false, buildProps: ['border', 'border-radius', 'outline'] },
          { name: 'Shadow', open: false, buildProps: ['box-shadow', 'text-shadow'] },
          { name: 'Effects', open: false, buildProps: ['opacity', 'transform', 'transition', 'cursor', 'overflow'] },
        ],
      },
      traitManager: { appendTo: '#traits-container' },
      layerManager: { appendTo: '#layers-container' },
      blockManager: { appendTo: '#blocks-container' },
    });

    editor.on('load', () => {
      console.log('📤 GrapesJS Loaded - applying content');
      applyContentToEditor(editor);
      // Set up custom color picker injection after load
      setTimeout(() => injectCustomColorPickers(editor), 500);

      // ─── Add Custom Lead Form Block ───
      editor.BlockManager.add('lead-form', {
        label: 'Lead Form',
        category: 'Forms',
        content: `
          <div class="lead-form-container" style="padding: 40px; background: #fff; border: 1px solid #e2e8f0; border-radius: 16px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); max-width: 500px; margin: 0 auto; font-family: sans-serif;">
            <h3 style="margin: 0 0 10px 0; font-size: 24px; color: #1e293b; text-align: center;">Get Started Now</h3>
            <p style="margin: 0 0 20px 0; font-size: 14px; color: #64748b; text-align: center;">Fill out your details and we will get back to you.</p>
            <form id="lead-form" style="display: flex; flexDirection: column; gap: 16px;">
              <div style="display: flex; flexDirection: column; gap: 6px;">
                <label style="font-size: 12px; font-weight: 600; color: #475569; text-transform: uppercase;">Name</label>
                <input type="text" name="name" required placeholder="Your Name" style="padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; outline: none;" />
              </div>
              <div style="display: flex; flexDirection: column; gap: 6px;">
                <label style="font-size: 12px; font-weight: 600; color: #475569; text-transform: uppercase;">Email</label>
                <input type="email" name="email" required placeholder="email@example.com" style="padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; outline: none;" />
              </div>
              <div style="display: flex; flexDirection: column; gap: 6px;">
                <label style="font-size: 12px; font-weight: 600; color: #475569; text-transform: uppercase;">Phone</label>
                <input type="tel" name="phone" placeholder="+1 (555) 000-0000" style="padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; outline: none;" />
              </div>
              <button type="submit" style="margin-top: 10px; padding: 14px; background: #7c3aed; color: #fff; border: none; border-radius: 8px; font-weight: 700; cursor: pointer; transition: background 0.2s;">Send Inquiry</button>
            </form>
          </div>
        `,
        attributes: { class: 'fa fa-paper-plane' }
      });
    });

    // Fallback if load already happened
    setTimeout(() => applyContentToEditor(editor), 1000);

    editorRef.current = editor;

    return () => {
      if (cpObserverRef.current) {
        cpObserverRef.current.disconnect();
        cpObserverRef.current = null;
      }
      if (editorRef.current) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, [pageId, projectLoading, pageLoading]);

  // ─── Custom Color Picker Injection ───
  const injectCustomColorPickers = (editor: Editor) => {
    const container = document.getElementById('styles-container');
    if (!container) return;

    const processFields = () => {
      const fields = container.querySelectorAll<HTMLElement>('.gjs-field-colorp:not([data-cp-injected])');
      fields.forEach((fieldEl) => {
        fieldEl.setAttribute('data-cp-injected', 'true');
        const swatch = fieldEl.querySelector<HTMLElement>('.gjs-field-color-picker, .gjs-checker-bg');
        if (!swatch) return;

        swatch.style.cursor = 'pointer';

        swatch.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();

          // Get current color from hidden input
          const hiddenInput = fieldEl.querySelector<HTMLInputElement>('input');
          const rawColor = hiddenInput?.value || swatch.style.background || '#000000';
          const hexColor = normalizeToHex(rawColor);

          // Get CSS property name from parent class or label
          const propWrapper = fieldEl.closest<HTMLElement>('.gjs-sm-property');
          const labelEl = propWrapper?.querySelector('.gjs-sm-label');
          const labelText = (labelEl?.textContent || '').trim().toLowerCase();
          const cssProperty = resolveCssProp(labelText, propWrapper);

          // Position the picker to the LEFT of the right sidebar
          const rect = swatch.getBoundingClientRect();
          const pickerW = 260;
          const pickerH = 380;
          // Open to the left of the sidebar: right edge of picker = left edge of swatch
          let x = rect.left - pickerW - 10;
          // Vertically: align top with swatch, clamp so it stays in viewport
          let y = rect.top;
          if (y + pickerH > window.innerHeight - 10) y = window.innerHeight - pickerH - 10;
          if (y < 10) y = 10;
          // If opening left goes off screen, open below instead
          if (x < 10) {
            x = rect.left;
            y = rect.bottom + 6;
            if (x + pickerW > window.innerWidth - 10) x = window.innerWidth - pickerW - 10;
          }

          setColorPicker({ visible: true, x, y, color: hexColor, fieldEl, cssProperty });
        });
      });
    };

    // Initial scan
    processFields();

    // Watch for new fields (e.g. when sector opens)
    if (cpObserverRef.current) cpObserverRef.current.disconnect();
    const obs = new MutationObserver(processFields);
    obs.observe(container, { childList: true, subtree: true });
    cpObserverRef.current = obs;

    // Also re-inject when component is selected
    editor.on('component:selected', (model) => {
      setTimeout(processFields, 200);

      // Auto-switch to AI tab on selection
      setLeftTab('ai');
      setIsSidebarOpen(true);
      setActiveComponent(model);

      // Update Selection Label for AI
      const tagName = model.get('tagName') || 'div';
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

    editor.on('styleManager:sector:open', () => setTimeout(processFields, 150));
  };

  // ─── Apply color from custom picker ───
  const applyColorFromPicker = (hex: string) => {
    const { fieldEl, cssProperty } = colorPicker;
    setColorPicker(prev => ({ ...prev, color: hex }));

    // Update the visual swatch
    if (fieldEl) {
      const swatch = fieldEl.querySelector<HTMLElement>('.gjs-field-color-picker, .gjs-checker-bg');
      if (swatch) swatch.style.background = hex;
      // Trigger GrapesJS hidden input change
      const hiddenInput = fieldEl.querySelector<HTMLInputElement>('input');
      if (hiddenInput) {
        hiddenInput.value = hex;
        hiddenInput.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }

    // Apply style directly to selected element
    if (editorRef.current && cssProperty) {
      const selected = editorRef.current.getSelected();
      if (selected) selected.addStyle({ [cssProperty]: hex });
    }
  };

  // Effect to re-apply content if page data updates (e.g. after AI edit)
  useEffect(() => {
    if (editorRef.current && page) {
      applyContentToEditor(editorRef.current);

      // Dynamically inject/update branding variables in the canvas head
      const canvas = editorRef.current.Canvas;
      const doc = canvas.getDocument();
      if (!doc) return;
      const head = doc.head;
      const styleId = 'branding-vars';
      let styleEl = head.querySelector(`#${styleId}`);
      if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = styleId;
        head.appendChild(styleEl);
      }
      styleEl.innerHTML = `
        :root {
          --primary: ${page.primaryColor || '#7c3aed'};
          --secondary: ${page.secondaryColor || '#6366f1'};
          --accent: ${page.accentColor || page.secondaryColor || '#6366f1'};
          --button-gradient: linear-gradient(135deg, ${page.primaryColor}, ${page.secondaryColor});
        }
      `;
    }
  }, [page, page?.primaryColor, page?.secondaryColor]);


  // ─── Device ───
  const switchDevice = (d: 'desktop' | 'tablet' | 'mobile') => {
    setActiveDevice(d);
    editorRef.current?.Devices.select(d);
  };

  // ─── Save ───
  const handleSave = async () => {
    if (!editorRef.current) return;
    const html = editorRef.current.getHtml();
    const css = editorRef.current.getCss() || '';

    updatePageMutation.mutate({
      content: html,
      // @ts-ignore
      styles: css,
      metaTitle: pageTitle,
      metaDescription: metaDesc,
    });

    toast.success('Page saved to cloud!');
  };

  // ─── Preview ───
  const handlePreview = () => {
    if (!page?.slug) {
      toast.error('Please save your page first to generate a slug');
      return;
    }
    const previewUrl = `${window.location.origin}/preview/${page.slug}`;
    console.log('🔗 Opening Preview URL:', previewUrl);
    window.open(previewUrl, '_blank');
  };


  // ─── Code ───
  const openCode = () => {
    if (!editorRef.current) return;
    setHtmlCode(editorRef.current.getHtml());
    setCssCode(editorRef.current.getCss() ?? '');
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

  const downloadHtml = () => {
    const blob = new Blob([buildFullHtml(htmlCode, cssCode, pageTitle, metaDesc)], { type: 'text/html' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'landing-page.html';
    a.click();
    toast.success('HTML downloaded!');
  };

  // ─── Publish ───
  const handlePublish = async () => {
    if (!editorRef.current) return;
    setIsPublishing(true);

    try {
      const html = editorRef.current.getHtml();
      const css = editorRef.current.getCss() || '';

      await updatePageMutation.mutateAsync({
        content: html,
        // @ts-ignore
        styles: css,
        status: 'published',
        metaTitle: pageTitle,
        metaDescription: metaDesc,
      });

      setIsPublishing(false);
      // Build the public URL for display
      const slug = pageDataRef.current?.slug || pageId;
      const url = `${window.location.origin}/${slug}`;
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

      const improvedHtml = res.data.improvedContent.fullHtml || res.data.improvedContent;

      if (selected) {
        selected.replaceWith(improvedHtml);
      } else {
        editorRef.current.addComponents(improvedHtml);
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

      const improvedHtml = res.data.improvedContent.fullHtml || res.data.improvedContent;
      selected.replaceWith(improvedHtml);

      setAiLoading(false);
      setEditAiPrompt('');
      setEditAiOpen(false);
      toast.success('✨ Component edited with AI!');
    } catch (err: any) {
      setAiLoading(false);
      toast.error(err.message || 'Failed to edit with AI');
    }
  };

  if (projectLoading || pageLoading || !page || !project) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#1a1a2e]">
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
        background: '#0f0f1a', borderBottom: '1px solid #1e1e2d',
        display: 'flex', alignItems: 'center', padding: '0 16px', gap: 8,
        zIndex: 100, boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
      }}>
        {/* Logo & Page Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginRight: 20 }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: 'linear-gradient(135deg,#7c3aed,#6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 14, fontWeight: 800, boxShadow: '0 4px 12px rgba(124,58,237,0.3)' }}>G</div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 13, letterSpacing: '-0.2px' }}>Grapes Studio</span>
            <span style={{ color: '#64748b', fontSize: 10, fontWeight: 500 }}>{page?.name || 'Untitled Page'}</span>
          </div>
        </div>

        <Sep />

        {/* Code */}
        <TBtn title="Code" onClick={openCode}><CodeIcon /><span style={{ fontSize: 11, marginLeft: 6, fontWeight: 600 }}>Code</span></TBtn>

        <Sep />

        {/* Device Switcher (Centered look) */}
        <div style={{ display: 'flex', background: '#1a1a2e', borderRadius: 8, padding: 2, border: '1px solid #2a2a3e', margin: '0 10px' }}>
          <TBtn title="Desktop" active={activeDevice === 'desktop'} onClick={() => switchDevice('desktop')}><DesktopIcon /></TBtn>
          <TBtn title="Tablet" active={activeDevice === 'tablet'} onClick={() => switchDevice('tablet')} ><TabletIcon /></TBtn>
          <TBtn title="Mobile" active={activeDevice === 'mobile'} onClick={() => switchDevice('mobile')} ><MobileIcon /></TBtn>
        </div>

        <Sep />

        <div style={{ display: 'flex', gap: 2 }}>
          <TBtn title="Undo" onClick={() => editorRef.current?.UndoManager.undo()}><UndoIcon /></TBtn>
          <TBtn title="Redo" onClick={() => editorRef.current?.UndoManager.redo()}><RedoIcon /></TBtn>
        </div>

        <Sep />

        <TBtn title="Clear Canvas" onClick={() => { if (confirm('Clear entire canvas?')) { editorRef.current?.runCommand('core:canvas-clear'); toast.success('Canvas cleared'); } }}><TrashIcon /></TBtn>

        <div style={{ flex: 1 }} />

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={handlePreview} style={{ ...outlineBtn, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '7px 14px' }} title="Live Preview"><EyeIcon /> <span style={{ marginLeft: 6 }}>Preview</span></button>
          <button onClick={handleSave} style={{ ...outlineBtn, background: '#1e293b', border: 'none', color: '#fff', padding: '7px 14px' }} title="Save Changes"><SaveIcon /> <span style={{ marginLeft: 6 }}>Save</span></button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginLeft: 16 }}>
          <button onClick={handlePublish} disabled={isPublishing} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: isPublishing ? '#4c1d95' : 'linear-gradient(135deg, #7c3aed, #6366f1)', color: '#fff', border: 'none', borderRadius: 8,
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
        <div style={{ display: 'flex', height: '100%', borderRight: '1px solid #1e1e2d' }}>
          {/* Vertical Toolbar (Narrow) */}
          <div style={{
            width: 56, flexShrink: 0, background: '#0a0a14',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            padding: '16px 0', gap: 20, borderRight: '1px solid #1e1e2d'
          }}>
            <NavIcon active={isSidebarOpen && leftTab === 'blocks'} onClick={() => { if (leftTab === 'blocks') setIsSidebarOpen(!isSidebarOpen); else { setLeftTab('blocks'); setIsSidebarOpen(true); } }}><GridIcon /><span>Blocks</span></NavIcon>
            <NavIcon active={isSidebarOpen && leftTab === 'layers'} onClick={() => { if (leftTab === 'layers') setIsSidebarOpen(!isSidebarOpen); else { setLeftTab('layers'); setIsSidebarOpen(true); } }}><LayersIcon /><span>Layers</span></NavIcon>
            <NavIcon active={isSidebarOpen && leftTab === 'ai'} onClick={() => { if (leftTab === 'ai') setIsSidebarOpen(!isSidebarOpen); else { setLeftTab('ai'); setIsSidebarOpen(true); } }}><SparklesIcon /><span>AI</span></NavIcon>
            <NavIcon active={isSidebarOpen && leftTab === 'seo'} onClick={() => { if (leftTab === 'seo') setIsSidebarOpen(!isSidebarOpen); else { setLeftTab('seo'); setIsSidebarOpen(true); } }}><SettingsIcon /><span>SEO</span></NavIcon>
            <div style={{ flex: 1 }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 12 }}>
              <button
                onClick={() => navigate('/dashboard')}
                title="Go to Projects"
                style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}
              >
                <div style={{ padding: 8, borderRadius: 10, border: '1px solid #1e1e2d' }}><HomeIcon /></div>
                <span style={{ fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5 }}>Projects</span>
              </button>
              <button
                onClick={() => { toast.info('Logged out'); navigate('/login'); }}
                title="Logout"
                style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}
              >
                <div style={{ padding: 8, borderRadius: 10, border: '1px solid #1e1e2d' }}><LogoutIcon /></div>
                <span style={{ fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5 }}>Logout</span>
              </button>
            </div>
          </div>

          {/* Panel Content (Dynamic) */}
          <div style={{
            width: isSidebarOpen ? 250 : 0,
            opacity: isSidebarOpen ? 1 : 0,
            flexShrink: 0, background: '#12121e',
            display: 'flex', flexDirection: 'column', overflow: 'hidden',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            borderRight: isSidebarOpen ? '1px solid #1e1e2d' : 'none'
          }}>
            <div style={{ padding: '20px 18px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', minWidth: 250 }}>
              <span style={{ color: '#fff', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>{leftTab}</span>
              <button onClick={() => setIsSidebarOpen(false)} style={{ color: '#4a4a6a', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14 }}>✕</button>
            </div>

            {/* Blocks */}
            <div id="blocks-container" style={{ flex: 1, overflowY: 'auto', display: leftTab === 'blocks' ? 'block' : 'none' }} />

            {/* Layers */}
            <div id="layers-container" style={{ flex: 1, overflowY: 'auto', display: leftTab === 'layers' ? 'block' : 'none', padding: '0 10px' }} />

            {/* AI Panel */}
            <div style={{ flex: 1, display: leftTab === 'ai' ? 'flex' : 'none', flexDirection: 'column', overflow: 'hidden' }}>
              <div style={{ flex: 1, padding: 18, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.15)', borderRadius: 14, padding: 16 }}>
                  <p style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.6, margin: 0 }}>
                    Select any element and ask me to edit it. I can change text, colors, styles, or generate entire sections!
                  </p>
                </div>

                {/* Selection Info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 8px' }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
                  <span style={{ color: '#cbd5e1', fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>Editing context:</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#1a1a2e', padding: '8px 12px', borderRadius: 10, border: '1px solid #2a2a3e', width: 'fit-content', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
                  <span style={{ color: '#fff', fontSize: 12, fontWeight: 600 }}>{selectedLabel}</span>
                  <button onClick={() => setSelectedLabel('Body')} style={{ color: '#cbd5e1', background: 'none', border: 'none', marginLeft: 6, cursor: 'pointer', fontSize: 12 }}>✕</button>
                </div>
              </div>

              {/* Input Area (Bottom) */}
              <div style={{ padding: 18, borderTop: '1px solid #1e1e2d', background: '#0a0a14' }}>
                <div style={{
                  background: 'rgba(255,255,255,0.03)', border: '1px solid #2a2a3e', borderRadius: 14,
                  padding: '12px', display: 'flex', flexDirection: 'column', gap: 10,
                  transition: 'border-color 0.2s',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)'
                }}>
                  <textarea
                    ref={aiInputRef}
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        if (chatInput.trim() && !chatLoading && editorRef.current) {
                          const val = chatInput.trim();
                          setChatInput('');
                          const selected = activeComponent || editorRef.current.getSelected();
                          if (!selected) {
                            toast.error('Please select an element first');
                            return;
                          }

                          setChatLoading(true);
                          const el = selected.getEl();
                          if (el) el.classList.add('ai-pulse-active');

                          setTimeout(() => {
                            try {
                              const cmd = val.toLowerCase();
                              let applied = false;

                              // 1. COLORS
                              const colors: Record<string, string> = {
                                'red': '#ef4444', 'blue': '#3b82f6', 'green': '#22c55e', 
                                'black': '#000000', 'white': '#ffffff', 'yellow': '#fbbf24',
                                'orange': '#f97316', 'purple': '#7c3aed', 'pink': '#ec4899',
                                'grey': '#64748b', 'gray': '#64748b'
                              };

                              Object.keys(colors).forEach(c => {
                                if (cmd.includes(c)) {
                                  const currentStyle = selected.getStyle() || {};
                                  if (cmd.includes('bg') || cmd.includes('background')) {
                                    selected.setStyle({ ...currentStyle, 'background-color': colors[c] });
                                  } else {
                                    selected.setStyle({ ...currentStyle, 'color': colors[c] });
                                  }
                                  applied = true;
                                }
                              });

                              // 2. LAYOUT & STYLE
                              const currentStyle = selected.getStyle() || {};
                              let nextStyle = { ...currentStyle };
                              let styleChanged = false;

                              if (cmd.includes('center')) { nextStyle['text-align'] = 'center'; styleChanged = true; }
                              if (cmd.includes('right')) { nextStyle['text-align'] = 'right'; styleChanged = true; }
                              if (cmd.includes('left')) { nextStyle['text-align'] = 'left'; styleChanged = true; }
                              if (cmd.includes('big') || cmd.includes('large')) { nextStyle['font-size'] = '42px'; styleChanged = true; }
                              if (cmd.includes('small')) { nextStyle['font-size'] = '12px'; styleChanged = true; }
                              if (cmd.includes('round')) { nextStyle['border-radius'] = '15px'; styleChanged = true; }
                              if (cmd.includes('circle')) { nextStyle['border-radius'] = '50%'; styleChanged = true; }
                              if (cmd.includes('padding')) { nextStyle['padding'] = '24px'; styleChanged = true; }
                              if (cmd.includes('margin')) { nextStyle['margin'] = '24px'; styleChanged = true; }

                              if (styleChanged) {
                                selected.setStyle(nextStyle);
                                applied = true;
                              }

                              // 3. TEXT CONTENT (Only if explicitly requested)
                              const textKeywords = ['change text to', 'set text to', 'update text to', 'write', 'change text to'];
                              let newText = '';
                              
                              // Check for explicit "write" or "change text to"
                              for (const kw of textKeywords) {
                                if (cmd.includes(kw)) {
                                  const regex = new RegExp(`${kw}\\s*(.*)`, 'i');
                                  const match = val.match(regex);
                                  if (match && match[1]) {
                                    newText = match[1].trim();
                                    break;
                                  }
                                }
                              }

                              // ONLY overwrite content if we have a clear NEW text and it's not just a style command
                              const isStyleOnly = cmd.includes('color') || cmd.includes('bg') || cmd.includes('background') || cmd.includes('size') || cmd.includes('padding') || cmd.includes('margin') || cmd.includes('align');

                              if (newText) {
                                if (selected.get('type') === 'wrapper' || selected.get('tagName')?.toLowerCase() === 'body') {
                                  toast.warning('Select a specific element to edit text.');
                                } else {
                                  selected.components(newText);
                                  applied = true;
                                }
                              } else if (!isStyleOnly && cmd.includes('text') && val.split(' ').length > 2) {
                                  // This handles cases like "text Hello World" without keywords
                                  const possibleContent = val.replace(/text/i, '').trim();
                                  if (possibleContent && !colors[possibleContent]) {
                                      selected.components(possibleContent);
                                      applied = true;
                                  }
                              }

                              if (applied) {
                                toast.success('✨ AI updated it successfully!');
                              } else {
                                toast.info('Try: "red color" or "write welcome"');
                              }
                            } catch (err) {
                              console.error('AI Error:', err);
                              toast.error('AI failed to update. Try again.');
                            } finally {
                              if (el) el.classList.remove('ai-pulse-active');
                              setChatLoading(false);
                            }
                          }, 600);
                        }
                      }
                    }}
                    placeholder="Ask AI anything..."
                    style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: 13, resize: 'none', outline: 'none', minHeight: 60, fontFamily: 'inherit' }}
                  />
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ color: '#4a4a6a', fontSize: 10 }}>Press Enter</span>
                    <button
                      onClick={() => { }}
                      style={{ background: '#7c3aed', color: '#fff', border: 'none', borderRadius: 10, padding: '6px 12px', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                    >Send <SparklesIcon /></button>
                  </div>
                </div>
              </div>
            </div>

            {/* SEO Panel */}
            <div style={{ flex: 1, display: leftTab === 'seo' ? 'flex' : 'none', flexDirection: 'column', padding: 20, gap: 20 }}>
              <div style={{ borderBottom: '1px solid #1e1e2d', paddingBottom: 20 }}>
                <label style={{ display: 'block', color: '#cbd5e1', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', marginBottom: 10, letterSpacing: 1 }}>Page Meta Title</label>
                <input type="text" value={pageTitle} onChange={e => setPageTitle(e.target.value)} placeholder="Enter page title..." style={{ width: '100%', background: '#0a0a14', border: '1px solid #2a2a3e', color: '#fff', borderRadius: 8, padding: '10px 12px', fontSize: 14, outline: 'none' }} />
              </div>
              <div style={{ borderBottom: '1px solid #1e1e2d', paddingBottom: 20 }}>
                <label style={{ display: 'block', color: '#cbd5e1', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', marginBottom: 10, letterSpacing: 1 }}>Meta Description</label>
                <textarea value={metaDesc} onChange={e => setMetaDesc(e.target.value)} placeholder="Enter SEO description..." rows={5} style={{ width: '100%', background: '#0a0a14', border: '1px solid #2a2a3e', color: '#fff', borderRadius: 8, padding: '10px 12px', fontSize: 14, outline: 'none', resize: 'none' }} />
              </div>
              <button onClick={() => { updatePageMutation.mutate({ metaTitle: pageTitle, metaDescription: metaDesc }); toast.success('SEO Settings Saved'); }} style={{ background: 'linear-gradient(135deg, #7c3aed, #6366f1)', color: '#fff', border: 'none', borderRadius: 10, padding: '12px', fontSize: 13, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(124,58,237,0.3)' }}>Update Settings</button>
            </div>
          </div>
        </div>

        {/* ══ CANVAS (light grey bg) ══ */}
        <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#e2e8f0' }}>
          <div id="gjs" style={{ flex: 1, overflow: 'hidden' }} />
        </div>

        {/* ══ RIGHT SIDEBAR ══ */}
        <div style={{
          width: 280, flexShrink: 0, background: '#0f0f1a',
          borderLeft: '1px solid #1e1e2d', display: 'flex', flexDirection: 'column',
        }}>
          {/* Tabs */}
          <div style={{ display: 'flex', padding: '0 10px', borderBottom: '1px solid #1e1e2d', height: 48, alignItems: 'center', background: '#0a0a14' }}>
            <TabButton active={rightTab === 'styles'} onClick={() => setRightTab('styles')}>Styles</TabButton>
            <TabButton active={rightTab === 'traits'} onClick={() => setRightTab('traits')}>Properties</TabButton>
          </div>
          <div id="styles-container" style={{ flex: 1, overflowY: 'auto', display: rightTab === 'styles' ? 'block' : 'none' }} />
          <div id="traits-container" style={{ flex: 1, overflowY: 'auto', display: rightTab === 'traits' ? 'block' : 'none' }} />
        </div>
      </div>

      {/* ═══════════════ AI PROMPT MODAL ═══════════════ */}
      {aiOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 520, background: '#1a1a2e', borderRadius: 16, border: '1px solid #2a2a3e', overflow: 'hidden', boxShadow: '0 25px 60px rgba(0,0,0,.4)' }}>
            {/* Header */}
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #2a2a3e', display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg,#7c3aed,#6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
                      background: '#252540', color: '#a5b4fc', border: '1px solid #2a2a3e',
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
                  width: '100%', background: '#111128', color: '#e2e8f0', border: '1px solid #2a2a3e',
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
                    flex: 2, background: 'linear-gradient(135deg,#7c3aed,#6366f1)', color: '#fff',
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
          <div style={{ width: 440, background: '#1a1a2e', borderRadius: 16, border: '1px solid #2a2a3e', overflow: 'hidden', boxShadow: '0 25px 60px rgba(0,0,0,.4)' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #2a2a3e', display: 'flex', alignItems: 'center', gap: 8 }}>
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
                  width: '100%', background: '#111128', color: '#e2e8f0', border: '1px solid #2a2a3e',
                  borderRadius: 8, padding: 14, fontSize: 13, fontFamily: 'inherit', outline: 'none', resize: 'vertical', boxSizing: 'border-box',
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
                <span style={{ fontSize: 12, color: '#64748b', display: 'flex', alignItems: 'center', gap: 6 }}>
                  Submit with <kbd style={{ background: '#252540', padding: '2px 6px', borderRadius: 4, border: '1px solid #475569', color: '#cbd5e1', fontSize: 11, fontFamily: 'inherit' }}>Ctrl</kbd> + <kbd style={{ background: '#252540', padding: '2px 6px', borderRadius: 4, border: '1px solid #475569', color: '#cbd5e1', fontSize: 11, fontFamily: 'inherit' }}>↵</kbd>
                </span>
                <button
                  onClick={handleEditAiGenerate}
                  disabled={aiLoading || !editAiPrompt.trim()}
                  style={{
                    background: 'linear-gradient(135deg,#7c3aed,#6366f1)', color: '#fff',
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
          <div style={{ width: 480, background: '#1a1a2e', borderRadius: 16, border: '1px solid #2a2a3e', overflow: 'hidden', boxShadow: '0 25px 60px rgba(0,0,0,.4)' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #2a2a3e', display: 'flex', alignItems: 'center', gap: 8 }}>
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
                  style={{ width: '100%', background: '#111128', color: '#e2e8f0', border: '1px solid #2a2a3e', borderRadius: 8, padding: '12px 14px', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', color: '#94a3b8', fontSize: 12, fontWeight: 600, marginBottom: 8 }}>Meta Description</label>
                <textarea
                  value={metaDesc}
                  onChange={e => setMetaDesc(e.target.value)}
                  placeholder="Brief description of your page for search engines..."
                  rows={4}
                  style={{ width: '100%', background: '#111128', color: '#e2e8f0', border: '1px solid #2a2a3e', borderRadius: 8, padding: '12px 14px', fontSize: 13, outline: 'none', boxSizing: 'border-box', resize: 'vertical' }}
                />
              </div>
              <button
                onClick={() => {
                  updatePageMutation.mutate({
                    metaTitle: pageTitle,
                    metaDescription: metaDesc,
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
          <div style={{ width: 500, background: 'linear-gradient(145deg, #1a1a2e, #16213e)', borderRadius: 20, border: '1px solid rgba(124,58,237,0.4)', overflow: 'hidden', boxShadow: '0 30px 80px rgba(0,0,0,0.6)', animation: 'publishPop 0.35s cubic-bezier(0.34,1.56,0.64,1)' }}>
            {/* Top gradient banner */}
            <div style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #6366f1 50%, #06b6d4 100%)', padding: '32px 32px 28px', textAlign: 'center', position: 'relative' }}>
              {/* Confetti dots */}
              {['#fbbf24', '#34d399', '#f87171', '#60a5fa', '#a78bfa'].map((c, i) => (
                <div key={i} style={{ position: 'absolute', width: 8, height: 8, borderRadius: '50%', background: c, top: `${10 + i * 14}%`, left: `${8 + i * 16}%`, opacity: 0.8 }} />
              ))}
              {['#f87171', '#34d399', '#fbbf24'].map((c, i) => (
                <div key={i} style={{ position: 'absolute', width: 6, height: 6, borderRadius: '50%', background: c, top: `${20 + i * 20}%`, right: `${6 + i * 14}%`, opacity: 0.7 }} />
              ))}
              <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', backdropFilter: 'blur(8px)', border: '2px solid rgba(255,255,255,0.2)' }}>
                <span style={{ fontSize: 36 }}>🚀</span>
              </div>
              <h2 style={{ color: '#fff', fontSize: 22, fontWeight: 800, margin: '0 0 8px', letterSpacing: '-0.3px' }}>Your Site is Published!</h2>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, margin: 0, fontWeight: 400 }}>Your landing page is now live on the web</p>
            </div>

            {/* Body */}
            <div style={{ padding: '24px 28px' }}>
              {/* Token verified badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 10, padding: '12px 16px', marginBottom: 20 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: 16 }}>✅</span>
                </div>
                <div>
                  <div style={{ color: '#10b981', fontSize: 13, fontWeight: 700 }}>Token Verified Successfully</div>
                  <div style={{ color: '#6b7280', fontSize: 11, marginTop: 2 }}>Authentication validated · SSL enabled · CDN active</div>
                </div>
              </div>

              {/* Live URL */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', color: '#6b7280', fontSize: 11, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 8 }}>Live URL</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '10px 14px' }}>
                  <span style={{ color: '#10b981', fontSize: 12, flex: 1, fontFamily: 'monospace', wordBreak: 'break-all' }}>{publishedUrl}</span>
                  <button
                    onClick={() => { navigator.clipboard.writeText(publishedUrl); toast.success('URL copied!'); }}
                    style={{ background: 'rgba(124,58,237,0.2)', border: '1px solid rgba(124,58,237,0.3)', color: '#a78bfa', borderRadius: 6, padding: '4px 10px', fontSize: 11, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}
                  >Copy</button>
                </div>
              </div>

              {/* Stats row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 24 }}>
                {[{ icon: '⚡', label: 'Performance', val: 'Fast' }, { icon: '🔒', label: 'Security', val: 'SSL' }, { icon: '🌐', label: 'CDN', val: 'Active' }].map(s => (
                  <div key={s.label} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '10px', textAlign: 'center' }}>
                    <div style={{ fontSize: 20, marginBottom: 4 }}>{s.icon}</div>
                    <div style={{ color: '#e2e8f0', fontSize: 12, fontWeight: 700 }}>{s.val}</div>
                    <div style={{ color: '#4b5563', fontSize: 10 }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={() => window.open(publishedUrl, '_blank')}
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#e2e8f0', borderRadius: 10, padding: '12px 0', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                >
                  <EyeIcon /> View Live
                </button>
                <button
                  onClick={() => navigate('/dashboard')}
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#e2e8f0', borderRadius: 10, padding: '12px 0', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                >
                  🚀 Dashboard
                </button>
                <button
                  onClick={() => setPublishModalOpen(false)}
                  style={{ flex: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: 'linear-gradient(135deg, #7c3aed, #6366f1)', color: '#fff', border: 'none', borderRadius: 10, padding: '12px 0', fontSize: 13, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(124,58,237,0.4)' }}
                >
                  ✓ Done
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
          <div style={{ height: 48, background: '#1a1a2e', borderBottom: '1px solid #2a2a3e', display: 'flex', alignItems: 'center', padding: '0 16px', gap: 10 }}>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>Code Editor</span>
            <div style={{ flex: 1 }} />
            <button onClick={applyCode} style={{ ...modalBtn, background: '#7c3aed' }}>Apply Code</button>
            <button onClick={downloadHtml} style={{ ...modalBtn, background: '#059669' }}>Download HTML</button>
            <button onClick={() => setCodeView(false)} style={{ ...modalBtn, background: '#374151' }}>Close</button>
          </div>
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', overflow: 'hidden' }}>
            <div style={{ display: 'flex', flexDirection: 'column', borderRight: '1px solid #2a2a3e' }}>
              <div style={{ padding: '8px 14px', background: '#0f0f1e', color: '#818cf8', fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>HTML</div>
              <textarea
                value={htmlCode} onChange={e => setHtmlCode(e.target.value)}
                style={{ flex: 1, background: '#0a0a16', color: '#e2e8f0', border: 'none', padding: 16, fontFamily: '"Fira Code",monospace', fontSize: 12, resize: 'none', outline: 'none', lineHeight: 1.7 }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '8px 14px', background: '#0f0f1e', color: '#22d3ee', fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>CSS</div>
              <textarea
                value={cssCode} onChange={e => setCssCode(e.target.value)}
                style={{ flex: 1, background: '#0a0a16', color: '#e2e8f0', border: 'none', padding: 16, fontFamily: '"Fira Code",monospace', fontSize: 12, resize: 'none', outline: 'none', lineHeight: 1.7 }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════ CUSTOM COLOR PICKER ═══════════════ */}
      {colorPicker.visible && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setColorPicker(prev => ({ ...prev, visible: false }))}
            style={{ position: 'fixed', inset: 0, zIndex: 999990 }}
          />
          {/* Picker Panel */}
          <div
            ref={colorPickerRef}
            style={{
              position: 'fixed',
              left: colorPicker.x,
              top: colorPicker.y,
              zIndex: 999999,
              width: 260,
              maxHeight: 'calc(100vh - 20px)',
              overflowY: 'auto',
              background: '#1a1a2e',
              border: '1px solid rgba(124,58,237,0.4)',
              borderRadius: 14,
              boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
              overflow: 'hidden',
              fontFamily: 'Inter, system-ui, sans-serif',
            }}
          >
            {/* Header */}
            <div style={{ padding: '12px 14px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ color: '#a78bfa', fontSize: 11, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase' }}>
                {colorPicker.cssProperty || 'Color'}
              </span>
              <button onClick={() => setColorPicker(prev => ({ ...prev, visible: false }))} style={{ background: 'none', border: 'none', color: '#4a4a6a', cursor: 'pointer', fontSize: 14, lineHeight: 1, padding: 2 }}>✕</button>
            </div>

            {/* Gradient Spectrum Bar */}
            <div style={{ padding: '10px 14px 6px' }}>
              <div style={{ width: '100%', height: 24, borderRadius: 6, background: 'linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)', marginBottom: 6, cursor: 'crosshair', border: '1px solid rgba(255,255,255,0.1)' }}
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const ratio = (e.clientX - rect.left) / rect.width;
                  const hue = Math.round(ratio * 360);
                  const hex = hslToHex(hue, 100, 50);
                  applyColorFromPicker(hex);
                }}
              />
              {/* Lightness bar */}
              <div style={{ width: '100%', height: 16, borderRadius: 6, background: `linear-gradient(to right, #000000, ${colorPicker.color}, #ffffff)`, marginBottom: 8, cursor: 'crosshair', border: '1px solid rgba(255,255,255,0.1)' }}
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const ratio = (e.clientX - rect.left) / rect.width;
                  const lighter = blendWithWhiteBlack(colorPicker.color, ratio);
                  applyColorFromPicker(lighter);
                }}
              />
            </div>

            {/* Hex Input + Preview */}
            <div style={{ padding: '0 14px 10px', display: 'flex', gap: 8, alignItems: 'center' }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: colorPicker.color, border: '2px solid rgba(255,255,255,0.15)', flexShrink: 0 }} />
              <input
                type="text"
                value={colorPicker.color}
                onChange={e => {
                  const val = e.target.value;
                  if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) {
                    setColorPicker(prev => ({ ...prev, color: val }));
                    if (val.length === 7) applyColorFromPicker(val);
                  }
                }}
                style={{ flex: 1, background: '#111128', color: '#e2e8f0', border: '1px solid #252545', borderRadius: 6, padding: '7px 10px', fontSize: 12, fontFamily: 'monospace', outline: 'none' }}
              />
              {/* Native picker as fallback */}
              <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }} title="Open system color picker">
                <input
                  type="color"
                  value={colorPicker.color.length === 7 ? colorPicker.color : '#7c3aed'}
                  onChange={e => applyColorFromPicker(e.target.value)}
                  style={{ width: 28, height: 28, padding: 0, border: '1px solid #252545', borderRadius: 6, cursor: 'pointer', background: 'none' }}
                />
              </label>
            </div>

            {/* Preset Color Swatches */}
            <div style={{ padding: '0 14px 14px' }}>
              <div style={{ fontSize: 9, color: '#4a4a6a', fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 8 }}>Presets</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {[
                  '#000000', '#ffffff', '#f8fafc', '#1e293b', '#334155',
                  '#ef4444', '#f97316', '#eab308', '#22c55e', '#14b8a6',
                  '#3b82f6', '#6366f1', '#7c3aed', '#a855f7', '#ec4899',
                  '#10b981', '#06b6d4', '#8b5cf6', '#f59e0b', '#64748b',
                ].map(c => (
                  <button
                    key={c}
                    onClick={() => applyColorFromPicker(c)}
                    title={c}
                    style={{
                      width: 22, height: 22, borderRadius: 5, background: c,
                      border: colorPicker.color === c ? '2px solid #fff' : '1px solid rgba(255,255,255,0.15)',
                      cursor: 'pointer', padding: 0, flexShrink: 0,
                      boxShadow: colorPicker.color === c ? '0 0 0 2px #7c3aed' : 'none',
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Apply Button */}
            <div style={{ padding: '0 14px 14px' }}>
              <button
                onClick={() => setColorPicker(prev => ({ ...prev, visible: false }))}
                style={{ width: '100%', background: 'linear-gradient(135deg,#7c3aed,#6366f1)', color: '#fff', border: 'none', borderRadius: 8, padding: '9px 0', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
              >
                ✓ Apply Color
              </button>
            </div>
          </div>
        </>
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

const Sep = () => <div style={{ width: 1, height: 20, background: '#2a2a3e', margin: '0 2px' }} />;

const TBtn = ({ children, onClick, title, active = false }: { children: React.ReactNode; onClick: () => void; title?: string; active?: boolean }) => (
  <button title={title} onClick={onClick} style={{
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: active ? 'rgba(124,58,237,0.2)' : 'transparent',
    color: active ? '#a78bfa' : '#94a3b8',
    border: 'none', borderRadius: 5, padding: '5px 8px', cursor: 'pointer',
    transition: 'all .12s', minWidth: 30, height: 30,
  }}
    onMouseEnter={e => { if (!active) { (e.currentTarget as HTMLButtonElement).style.background = '#252540'; (e.currentTarget as HTMLButtonElement).style.color = '#e2e8f0'; } }}
    onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = '#94a3b8'; } }}
  >{children}</button>
);
const TabButton = ({ children, active, onClick }: { children: React.ReactNode; active: boolean; onClick: () => void }) => (
  <button onClick={onClick} style={{
    padding: '12px 16px', fontSize: 11, fontWeight: 700, border: 'none',
    background: 'none', cursor: 'pointer', letterSpacing: 0.5,
    color: active ? '#fff' : '#64748b',
    borderBottom: `2px solid ${active ? '#7c3aed' : 'transparent'}`,
    transition: 'all .2s',
    textTransform: 'uppercase'
  }}>{children}</button>
);

const NavIcon = ({ children, active, onClick }: { children: React.ReactNode; active: boolean; onClick: () => void }) => (
  <button onClick={onClick} style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
    width: '100%', background: 'none', border: 'none', cursor: 'pointer',
    color: active ? '#a78bfa' : '#94a3b8', transition: 'all .2s'
  }}>
    <div style={{ padding: 8, borderRadius: 8, background: active ? 'rgba(124,58,237,0.1)' : 'transparent' }}>
      {children[0]}
    </div>
    <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>{children[1]}</span>
  </button>
);

/* ── Styles ── */
const outlineBtn: React.CSSProperties = {
  display: 'flex', alignItems: 'center', background: 'transparent',
  border: '1px solid #2a2a3e', borderRadius: 7, padding: '6px 12px',
  fontSize: 13, fontWeight: 500, color: '#e2e8f0', cursor: 'pointer',
};
const modalBtn: React.CSSProperties = {
  color: '#fff', border: 'none', borderRadius: 6, padding: '7px 16px',
  fontSize: 12, fontWeight: 600, cursor: 'pointer',
};

/* ── SVG Icons ── */
const CodeIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>;
const DesktopIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>;
const TabletIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="2" width="16" height="20" rx="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></svg>;
const MobileIcon = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></svg>;
const UndoIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 14 4 9 9 4" /><path d="M20 20v-7a4 4 0 0 0-4-4H4" /></svg>;
const RedoIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 14 20 9 15 4" /><path d="M4 20v-7a4 4 0 0 1 4-4h12" /></svg>;
const TrashIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4h6v2" /></svg>;
const EyeIcon = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>;
const SaveIcon = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>;
const SparklesIcon = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3z" /></svg>;
const SettingsIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>;
const RocketIcon = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" /><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" /><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" /><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" /></svg>;
const GridIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>;
const LayersIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>;
const HomeIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>;
const LogoutIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>;

/* ── Build full HTML ── */
const buildFullHtml = (html: string, css: string, title = 'Landing Page', desc = '') => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>${title}</title>
  ${desc ? `<meta name="description" content="${desc}"/>` : ''}
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet"/>
  <style>*,*::before,*::after{box-sizing:border-box}body{margin:0;font-family:'Inter',system-ui,sans-serif}${css}</style>
</head>
<body>${html}</body>
</html>`;

export default GrapesEditor;
