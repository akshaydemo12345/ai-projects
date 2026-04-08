import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import grapesjs from 'grapesjs';
import type { Editor } from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';
// @ts-ignore
import grapesjsPresetWebpage from 'grapesjs-preset-webpage';
// @ts-ignore
import grapesjsBlocksBasic from 'grapesjs-blocks-basic';
import './grapes-custom.css';
import { getProjects, saveProjects } from '../../pages/ProjectsPage';

const GrapesEditor = () => {
  const editorRef = useRef<Editor | null>(null);
  const navigate = useNavigate();
  const [codeView, setCodeView] = useState(false);
  const [htmlCode, setHtmlCode] = useState('');
  const [cssCode, setCssCode] = useState('');
  const [activeDevice, setActiveDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [leftTab, setLeftTab] = useState<'blocks' | 'layers'>('blocks');
  const [rightTab, setRightTab] = useState<'styles' | 'traits'>('styles');
  // AI Prompt
  const [aiOpen, setAiOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [editAiOpen, setEditAiOpen] = useState(false);
  const [editAiPrompt, setEditAiPrompt] = useState('');
  
  // AI Chat Assistant
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{role: 'user' | 'ai', content: string}[]>([
    { role: 'ai', content: 'Hi! I am your AI Assistant. Select an element and tell me how you want to change it (e.g. "make it red", "change text to Hello").' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  
  // Publish
  const [isPublishing, setIsPublishing] = useState(false);
  // SEO Settings
  const [seoOpen, setSeoOpen] = useState(false);
  const [pageTitle, setPageTitle] = useState('Landing Page');
  const [metaDesc, setMetaDesc] = useState('');

  useEffect(() => {
    // Load SEO Data on mount
    const projId = localStorage.getItem('editor_project_id');
    const pageId = localStorage.getItem('editor_page_id');
    if (projId && pageId) {
      const proj = getProjects().find(p => p.id === projId);
      const page = proj?.pages.find(p => p.id === pageId);
      if (page) {
        setPageTitle(page.metaTitle || page.name || 'Landing Page');
        setMetaDesc(page.metaDescription || '');
      }
    }

    if (editorRef.current) return;

    const editor = grapesjs.init({
      container: '#gjs',
      height: '100%',
      width: 'auto',
      fromElement: false,
      storageManager: {
        type: 'local',
        autosave: true,
        autoload: true,
        stepsBeforeSave: 1,
        id: `grapes-lp-${pageId || 'default'}-`,
      },
      undoManager: { trackSelection: false },
      plugins: [grapesjsPresetWebpage, grapesjsBlocksBasic],
      pluginsOpts: {
        [grapesjsPresetWebpage]: {
          blocksBasicOpts: { flexGrid: true },
          addBasicStyle: true,
        },
        [grapesjsBlocksBasic]: { flexGrid: true },
      },
      canvas: {
        styles: ['https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap'],
      },
      deviceManager: {
        devices: [
          { id: 'desktop', name: 'Desktop', width: '' },
          { id: 'tablet',  name: 'Tablet',  width: '768px',  widthMedia: '992px' },
          { id: 'mobile',  name: 'Mobile',  width: '375px',  widthMedia: '480px' },
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

    // Fix color picker positioning — runs continuously to catch every picker open
    const fixAllPickers = () => {
      // Target all possible color picker containers GrapesJS uses
      const selectors = [
        '.sp-container:not(.sp-hidden)',
        '.gjs-color-picker',
        '.pcr-app.visible',
      ];
      selectors.forEach(sel => {
        document.querySelectorAll(sel).forEach((el) => {
          const htmlEl = el as HTMLElement;
          // Skip if already fixed or hidden
          if (htmlEl.dataset.fixed === '1' && htmlEl.style.position === 'fixed') return;
          if (htmlEl.offsetParent === null && !htmlEl.classList.contains('visible')) return;

          // Find the color swatch trigger
          const allSwatches = document.querySelectorAll('.gjs-field-color-picker, .gjs-field-colorp-c, .sp-replacer');
          let triggerRect: DOMRect | null = null;
          allSwatches.forEach(sw => {
            const r = sw.getBoundingClientRect();
            if (r.width > 0 && r.height > 0 && r.top > 0) {
              triggerRect = r;
            }
          });

          const pickerH = htmlEl.offsetHeight || 260;
          const pickerW = htmlEl.offsetWidth || 250;
          const vh = window.innerHeight;
          const vw = window.innerWidth;

          htmlEl.style.position = 'fixed';
          htmlEl.style.zIndex = '99999';
          htmlEl.dataset.fixed = '1';

          if (triggerRect) {
            const tr = triggerRect as DOMRect;
            // Position to the left of the sidebar trigger
            let left = tr.left - pickerW - 12;
            if (left < 8) left = tr.right + 8;
            if (left + pickerW > vw) left = vw - pickerW - 8;

            let top = tr.top;
            if (top + pickerH > vh) top = vh - pickerH - 8;
            if (top < 8) top = 8;

            htmlEl.style.top = `${top}px`;
            htmlEl.style.left = `${left}px`;
          } else {
            // Center on screen
            htmlEl.style.top = `${Math.max(8, (vh - pickerH) / 2)}px`;
            htmlEl.style.left = `${Math.max(8, (vw - pickerW) / 2)}px`;
          }
        });
      });
    };

    // Poll every 100ms to catch pickers as they appear
    const pickerInterval = setInterval(fixAllPickers, 100);

    // Also run on click
    document.addEventListener('click', () => {
      setTimeout(fixAllPickers, 30);
      setTimeout(fixAllPickers, 150);
    });

    // Load initial HTML + CSS from CreatePageFlow if available
    const initialHtml = localStorage.getItem('grapes-initial-html');
    const initialCss = localStorage.getItem('grapes-initial-css');
    if (initialHtml) {
      // Clear saved project to show the new HTML for this specific page
      const pId = pageId || 'default';
      localStorage.removeItem(`grapes-lp-${pId}-html`);
      localStorage.removeItem(`grapes-lp-${pId}-components`);
      localStorage.removeItem(`grapes-lp-${pId}-css`);
      localStorage.removeItem(`grapes-lp-${pId}-styles`);
      localStorage.removeItem(`grapes-lp-${pId}-assets`);

      editor.on('load', () => {
        editor.setComponents(initialHtml);
        if (initialCss) {
          editor.setStyle(initialCss);
        }
        localStorage.removeItem('grapes-initial-html');
        localStorage.removeItem('grapes-initial-css');
      });
    }

    // Add custom AI command to open our React Modal
    editor.Commands.add('open-ai-modal', {
      run() {
        setAiOpen(true);
      }
    });

    editor.Commands.add('open-edit-ai-modal', {
      run() {
        setEditAiOpen(true);
      }
    });

    // Add AI icon to element toolbar when selected
    editor.on('component:selected', (model) => {
      const toolbar = model.get('toolbar');
      const id = 'custom-ai-action';
      if (toolbar && !toolbar.some((t: any) => t.id === id)) {
        // unshift adds it to the beginning of the toolbar, we will add it to the beginning
        toolbar.unshift({
          id,
          command: 'open-edit-ai-modal',
          // using the Sparkles icon SVG but in string format
          label: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c084fc" stroke-width="2.5" class="gjs-no-pointer" style="margin-top:2px"><path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3z"/></svg>`,
        });
        model.set('toolbar', toolbar);
      }
    });

    editorRef.current = editor;

    return () => {
      clearInterval(pickerInterval);
      if (editorRef.current) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, []);

  // ─── Device ───
  const switchDevice = (d: 'desktop' | 'tablet' | 'mobile') => {
    setActiveDevice(d);
    editorRef.current?.Devices.select(d);
  };

  // ─── Save ───
  const handleSave = () => {
    if (!editorRef.current) return;
    localStorage.setItem('grapes-preview-html', buildFullHtml(editorRef.current.getHtml(), editorRef.current.getCss() ?? '', pageTitle, metaDesc));
    toast.success('Page saved!');
  };

  // ─── Preview ───
  const handlePreview = () => {
    if (!editorRef.current) return;
    localStorage.setItem('grapes-preview-html', buildFullHtml(editorRef.current.getHtml(), editorRef.current.getCss() ?? '', pageTitle, metaDesc));
    window.open('/preview', '_blank');
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
  const handlePublish = () => {
    if (!editorRef.current) return;
    setIsPublishing(true);
    
    // Simulate token verification delay
    setTimeout(() => {
      localStorage.setItem('grapes-preview-html', buildFullHtml(editorRef.current!.getHtml(), editorRef.current!.getCss() ?? '', pageTitle, metaDesc));
      
      // Save current status to local storage page metadata
      const projId = localStorage.getItem('editor_project_id');
      const pageId = localStorage.getItem('editor_page_id');
      if (projId && pageId) {
        const projects = getProjects();
        const updated = projects.map(proj => {
          if (proj.id === projId) {
            return {
              ...proj,
              pages: proj.pages.map(page => page.id === pageId ? { ...page, status: "published" as const } : page)
            };
          }
          return proj;
        });
        saveProjects(updated);
      }
      
      setIsPublishing(false);
      toast.success('Token Verified & Page published!');
      if (projId && pageId) navigate(`/dashboard/published?project=${projId}&page=${pageId}`);
      else navigate('/dashboard/published');
    }, 1500);
  };

  // ─── AI prompt ───
  const handleAiGenerate = () => {
    if (!aiPrompt.trim() || !editorRef.current) return;
    setAiLoading(true);

    // Get selected component
    const selected = editorRef.current.getSelected();
    const prompt = aiPrompt.trim();

    // Simulate AI response with generated HTML based on prompt
    setTimeout(() => {
      let generatedHtml = '';

      if (prompt.toLowerCase().includes('form') || prompt.toLowerCase().includes('contact')) {
        generatedHtml = `
<section style="background:#fff;padding:60px 40px;font-family:'Inter',sans-serif;">
  <div style="max-width:600px;margin:0 auto;text-align:center;">
    <h2 style="font-size:28px;font-weight:800;color:#0f172a;margin:0 0 10px;">${prompt.slice(0, 50)}</h2>
    <p style="font-size:15px;color:#64748b;margin:0 0 30px;">Fill out the form below and we'll get back to you shortly.</p>
    <form action="#" method="POST" style="text-align:left;">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px;">
        <input type="text" name="name" placeholder="Your Name" required style="width:100%;border:1px solid #e2e8f0;border-radius:8px;padding:12px 14px;font-size:14px;box-sizing:border-box;font-family:inherit;" />
        <input type="email" name="email" placeholder="Email Address" required style="width:100%;border:1px solid #e2e8f0;border-radius:8px;padding:12px 14px;font-size:14px;box-sizing:border-box;font-family:inherit;" />
      </div>
      <textarea name="message" rows="4" placeholder="Your message..." style="width:100%;border:1px solid #e2e8f0;border-radius:8px;padding:12px 14px;font-size:14px;box-sizing:border-box;font-family:inherit;resize:vertical;margin-bottom:12px;"></textarea>
      <button type="submit" style="width:100%;background:#7c3aed;color:#fff;border:none;border-radius:8px;padding:14px;font-size:15px;font-weight:700;cursor:pointer;">Submit</button>
    </form>
  </div>
</section>`;
      } else if (prompt.toLowerCase().includes('hero') || prompt.toLowerCase().includes('banner')) {
        generatedHtml = `
<section style="background:linear-gradient(135deg,#0f172a,#1e293b);padding:80px 40px;font-family:'Inter',sans-serif;text-align:center;">
  <div style="max-width:800px;margin:0 auto;">
    <h1 style="font-size:48px;font-weight:800;color:#fff;line-height:1.2;margin:0 0 20px;">${prompt.slice(0, 60)}</h1>
    <p style="font-size:18px;color:rgba(255,255,255,0.7);line-height:1.7;margin:0 0 32px;">Transform your business with our proven solutions. Get started today and see results within 30 days.</p>
    <div style="display:flex;gap:16px;justify-content:center;">
      <a href="#" style="background:#7c3aed;color:#fff;padding:14px 32px;border-radius:8px;font-size:15px;font-weight:700;text-decoration:none;">Get Started</a>
      <a href="#" style="background:transparent;color:#fff;border:2px solid rgba(255,255,255,0.4);padding:14px 32px;border-radius:8px;font-size:15px;font-weight:600;text-decoration:none;">Learn More</a>
    </div>
  </div>
</section>`;
      } else if (prompt.toLowerCase().includes('pricing') || prompt.toLowerCase().includes('plan')) {
        generatedHtml = `
<section style="background:#f8fafc;padding:80px 40px;font-family:'Inter',sans-serif;">
  <div style="max-width:1000px;margin:0 auto;text-align:center;">
    <h2 style="font-size:36px;font-weight:800;color:#0f172a;margin:0 0 40px;">Choose Your Plan</h2>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:24px;">
      <div style="background:#fff;border-radius:14px;padding:32px;border:1px solid #e2e8f0;">
        <div style="font-size:18px;font-weight:700;color:#0f172a;margin-bottom:6px;">Basic</div>
        <div style="font-size:42px;font-weight:800;color:#7c3aed;">$29<span style="font-size:14px;color:#64748b;">/mo</span></div>
        <p style="font-size:13px;color:#64748b;margin:12px 0 24px;">For individuals.</p>
        <a href="#" style="display:block;background:#7c3aed;color:#fff;padding:12px;border-radius:8px;font-weight:700;text-decoration:none;">Choose Plan</a>
      </div>
      <div style="background:linear-gradient(135deg,#7c3aed,#6366f1);border-radius:14px;padding:32px;position:relative;">
        <div style="position:absolute;top:-12px;left:50%;transform:translateX(-50%);background:#f59e0b;color:#fff;font-size:10px;font-weight:700;padding:3px 14px;border-radius:100px;">POPULAR</div>
        <div style="font-size:18px;font-weight:700;color:#fff;margin-bottom:6px;">Pro</div>
        <div style="font-size:42px;font-weight:800;color:#fff;">$79<span style="font-size:14px;color:rgba(255,255,255,0.7);">/mo</span></div>
        <p style="font-size:13px;color:rgba(255,255,255,0.75);margin:12px 0 24px;">For teams.</p>
        <a href="#" style="display:block;background:#fff;color:#7c3aed;padding:12px;border-radius:8px;font-weight:700;text-decoration:none;">Choose Plan</a>
      </div>
      <div style="background:#fff;border-radius:14px;padding:32px;border:1px solid #e2e8f0;">
        <div style="font-size:18px;font-weight:700;color:#0f172a;margin-bottom:6px;">Enterprise</div>
        <div style="font-size:42px;font-weight:800;color:#7c3aed;">Custom</div>
        <p style="font-size:13px;color:#64748b;margin:12px 0 24px;">For large teams.</p>
        <a href="#" style="display:block;background:#7c3aed;color:#fff;padding:12px;border-radius:8px;font-weight:700;text-decoration:none;">Contact Us</a>
      </div>
    </div>
  </div>
</section>`;
      } else if (prompt.toLowerCase().includes('testimonial') || prompt.toLowerCase().includes('review')) {
        generatedHtml = `
<section style="background:#fff;padding:80px 40px;font-family:'Inter',sans-serif;">
  <div style="max-width:1000px;margin:0 auto;text-align:center;">
    <h2 style="font-size:36px;font-weight:800;color:#0f172a;margin:0 0 40px;">What People Say</h2>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:24px;">
      <div style="background:#f8fafc;border-radius:14px;padding:28px;text-align:left;">
        <div style="color:#f59e0b;margin-bottom:12px;">★★★★★</div>
        <p style="font-size:14px;color:#0f172a;line-height:1.7;margin:0 0 20px;font-style:italic;">"Absolutely incredible results. Our traffic increased by 300% in just 3 months."</p>
        <div style="font-weight:700;font-size:14px;color:#0f172a;">John Smith</div>
        <div style="font-size:12px;color:#64748b;">CEO, Tech Corp</div>
      </div>
      <div style="background:#f8fafc;border-radius:14px;padding:28px;text-align:left;">
        <div style="color:#f59e0b;margin-bottom:12px;">★★★★★</div>
        <p style="font-size:14px;color:#0f172a;line-height:1.7;margin:0 0 20px;font-style:italic;">"Best investment we've made for our marketing. Highly recommend their services."</p>
        <div style="font-weight:700;font-size:14px;color:#0f172a;">Jane Doe</div>
        <div style="font-size:12px;color:#64748b;">CMO, StartupXYZ</div>
      </div>
      <div style="background:#f8fafc;border-radius:14px;padding:28px;text-align:left;">
        <div style="color:#f59e0b;margin-bottom:12px;">★★★★★</div>
        <p style="font-size:14px;color:#0f172a;line-height:1.7;margin:0 0 20px;font-style:italic;">"Revenue doubled in a year. The team is professional and delivers on every promise."</p>
        <div style="font-weight:700;font-size:14px;color:#0f172a;">Mike Johnson</div>
        <div style="font-size:12px;color:#64748b;">Founder, LocalBiz</div>
      </div>
    </div>
  </div>
</section>`;
      } else {
        // Generic section
        generatedHtml = `
<section style="background:#f8fafc;padding:60px 40px;font-family:'Inter',sans-serif;">
  <div style="max-width:900px;margin:0 auto;text-align:center;">
    <h2 style="font-size:32px;font-weight:800;color:#0f172a;margin:0 0 16px;">${prompt.slice(0, 60)}</h2>
    <p style="font-size:16px;color:#64748b;line-height:1.7;margin:0 0 24px;">This section was generated from your AI prompt. Click to select and edit any element to customize it to your needs.</p>
    <a href="#" style="display:inline-block;background:#7c3aed;color:#fff;padding:14px 32px;border-radius:8px;font-size:15px;font-weight:700;text-decoration:none;">Learn More</a>
  </div>
</section>`;
      }

      if (selected) {
        // Replace selected component content
        selected.replaceWith(generatedHtml);
      } else {
        // Add at the end
        editorRef.current?.addComponents(generatedHtml);
      }

      setAiLoading(false);
      setAiPrompt('');
      setAiOpen(false);
      toast.success('✨ AI section generated!');
    }, 1500);
  };

  const handleEditAiGenerate = () => {
    if (!editAiPrompt.trim() || !editorRef.current) return;
    setAiLoading(true);

    const selected = editorRef.current.getSelected();
    const prompt = editAiPrompt.trim();

    setTimeout(() => {
      let generatedHtml = `
<div style="padding:20px;border:2px dashed #7c3aed;background:#f8fafc;border-radius:8px;">
  <p style="color:#7c3aed;font-weight:700;margin:0;">✨ AI Edited: ${prompt.slice(0, 30)}...</p>
</div>`;

      if (selected) {
        selected.replaceWith(generatedHtml);
      }

      setAiLoading(false);
      setEditAiPrompt('');
      setEditAiOpen(false);
      toast.success('✨ Component edited with AI!');
    }, 1200);
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'Inter, system-ui, sans-serif', background: '#f5f5f5', overflow: 'hidden' }}>

      {/* ═══════════════ TOP BAR ═══════════════ */}
      <div style={{
        height: 48, flexShrink: 0,
        background: '#1a1a2e', borderBottom: '1px solid #2a2a3e',
        display: 'flex', alignItems: 'center', padding: '0 12px', gap: 6,
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginRight: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: 7, background: 'linear-gradient(135deg,#7c3aed,#6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 800 }}>P</div>
          <span style={{ color: '#e2e8f0', fontWeight: 700, fontSize: 13 }}>PageBuilder</span>
        </div>

        <Sep />

        {/* Code */}
        <TBtn title="Code" onClick={openCode}><CodeIcon /><span style={{ fontSize: 11, marginLeft: 3 }}>Code</span></TBtn>

        <Sep />

        {/* Device */}
        <TBtn title="Desktop" active={activeDevice === 'desktop'} onClick={() => switchDevice('desktop')}><DesktopIcon /></TBtn>
        <TBtn title="Tablet"  active={activeDevice === 'tablet'}  onClick={() => switchDevice('tablet')} ><TabletIcon /></TBtn>
        <TBtn title="Mobile"  active={activeDevice === 'mobile'}  onClick={() => switchDevice('mobile')} ><MobileIcon /></TBtn>

        <Sep />

        {/* FullScreen preview inside GrapesJS */}
        <TBtn title="Preview" onClick={() => editorRef.current?.runCommand('preview')}><EyeIcon /></TBtn>

        <Sep />

        {/* Undo / Redo */}
        <TBtn title="Undo" onClick={() => editorRef.current?.UndoManager.undo()}><UndoIcon /></TBtn>
        <TBtn title="Redo" onClick={() => editorRef.current?.UndoManager.redo()}><RedoIcon /></TBtn>

        <Sep />

        {/* Clear */}
        <TBtn title="Clear Canvas" onClick={() => { editorRef.current?.runCommand('core:canvas-clear'); toast.success('Canvas cleared'); }}><TrashIcon /></TBtn>

        <Sep />

        {/* AI Chat Button */}
        <button onClick={() => setChatOpen(!chatOpen)} style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: chatOpen ? 'rgba(124,58,237,0.2)' : 'transparent',
          color: chatOpen ? '#a78bfa' : '#94a3b8',
          border: 'none', borderRadius: 7, padding: '6px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
        }}>
          <SparklesIcon /> AI Chat
        </button>

        <div style={{ flex: 1 }} />

        {/* AI Button */}
        <button onClick={() => setAiOpen(true)} style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'linear-gradient(135deg,#7c3aed,#6366f1)', color: '#fff',
          border: 'none', borderRadius: 7, padding: '6px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer',
        }}>
          <SparklesIcon /> AI Generate
        </button>

        <Sep />

        {/* Save */}
        <button onClick={handleSave} style={outlineBtn}><SaveIcon /><span style={{ marginLeft: 4 }}>Save</span></button>

        {/* Publish */}
        <button onClick={handlePublish} disabled={isPublishing} style={{
          display: 'flex', alignItems: 'center', gap: 5,
          background: isPublishing ? '#4c1d95' : '#7c3aed', color: '#fff', border: 'none', borderRadius: 7,
          padding: '7px 16px', fontSize: 12, fontWeight: 700, cursor: isPublishing ? 'not-allowed' : 'pointer',
        }}>
          {isPublishing ? 'Verifying Token...' : 'Publish'}
        </button>
      </div>

      {/* ═══════════════ MAIN BODY ═══════════════ */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* ══ LEFT SIDEBAR ══ */}
        <div style={{
          width: 220, flexShrink: 0, background: '#1a1a2e',
          borderRight: '1px solid #2a2a3e', display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}>
          <div style={{ display: 'flex', borderBottom: '1px solid #2a2a3e' }}>
            <SideTab label="Blocks" active={leftTab === 'blocks'} onClick={() => setLeftTab('blocks')} />
            <SideTab label="Layers" active={leftTab === 'layers'} onClick={() => setLeftTab('layers')} />
          </div>
          <div id="blocks-container" style={{ flex: 1, overflowY: 'auto', display: leftTab === 'blocks' ? 'block' : 'none' }} />
          <div id="layers-container" style={{ flex: 1, overflowY: 'auto', display: leftTab === 'layers' ? 'block' : 'none' }} />
          
          {/* Settings Button */}
          <div style={{ padding: '12px', borderTop: '1px solid #2a2a3e', background: '#111122' }}>
            <button onClick={() => setSeoOpen(true)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', background: '#252540', color: '#e2e8f0', border: '1px solid #2a2a3e', cursor: 'pointer', padding: '10px', borderRadius: 8, transition: 'all 0.2s', fontSize: 13, fontWeight: 600 }}>
              <SettingsIcon /> SEO Settings
            </button>
          </div>
        </div>

        {/* ══ CANVAS (white background) ══ */}
        <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div id="gjs" style={{ flex: 1, overflow: 'hidden' }} />
          
          {/* AI Chat Sidebar Overlay */}
          {chatOpen && (
            <div style={{
              position: 'absolute', top: 12, right: 12, bottom: 12, width: 340,
              background: 'rgba(26,26,46,0.95)', backdropFilter: 'blur(10px)',
              border: '1px solid rgba(124,58,237,0.3)', borderRadius: 12,
              boxShadow: '0 10px 40px rgba(0,0,0,0.4)', zIndex: 100,
              display: 'flex', flexDirection: 'column', overflow: 'hidden'
            }}>
              {/* Header */}
              <div style={{ padding: '12px 16px', background: 'rgba(124,58,237,0.1)', borderBottom: '1px solid rgba(124,58,237,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 24, height: 24, borderRadius: 6, background: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}><SparklesIcon /></div>
                  <span style={{ color: '#fff', fontSize: 13, fontWeight: 700 }}>AI Assistant</span>
                </div>
                <button onClick={() => setChatOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: 16 }}>✕</button>
              </div>
              
              {/* Messages */}
              <div style={{ flex: 1, padding: 16, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {chatMessages.map((msg, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                    {msg.role === 'ai' && <div style={{ width: 24, height: 24, borderRadius: 12, background: 'rgba(124,58,237,0.2)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a78bfa', marginTop: 2 }}><SparklesIcon /></div>}
                    <div style={{
                      background: msg.role === 'user' ? '#7c3aed' : 'rgba(255,255,255,0.05)',
                      color: '#fff', padding: '10px 14px', borderRadius: 12, fontSize: 13, lineHeight: 1.5,
                      borderTopRightRadius: msg.role === 'user' ? 2 : 12,
                      borderTopLeftRadius: msg.role === 'ai' ? 2 : 12,
                    }}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#a78bfa', fontSize: 12 }}>
                    <div style={{ width: 14, height: 14, border: '2px solid #7c3aed', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                    Applying changes...
                  </div>
                )}
              </div>
              
              {/* Input */}
              <div style={{ padding: 12, borderTop: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)' }}>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && chatInput.trim() && !chatLoading && editorRef.current) {
                        const val = chatInput.trim();
                        setChatInput('');
                        setChatMessages(m => [...m, { role: 'user', content: val }]);
                        setChatLoading(true);
                        
                        setTimeout(() => {
                          const selected = editorRef.current?.getSelected();
                          const lowerVal = val.toLowerCase();
                          let reply = "I've generated a new section for you at the bottom!";
                          
                          if (selected) {
                            if (lowerVal.includes('color') || lowerVal.includes('red') || lowerVal.includes('blue') || lowerVal.includes('bg') || lowerVal.includes('background')) {
                              // Simulate CSS style change
                              const colorMatch = lowerVal.match(/(red|blue|green|purple|black|white|gray|yellow|orange|#\w+)/);
                              const color = colorMatch ? colorMatch[0] : '#7c3aed';
                              if (lowerVal.includes('text') || lowerVal.includes('font')) {
                                selected.addStyle({ color });
                                reply = `I changed the text color to ${color}.`;
                              } else {
                                selected.addStyle({ 'background-color': color });
                                reply = `I changed the background to ${color}.`;
                              }
                            } else if (lowerVal.includes('text') || lowerVal.includes('change') || lowerVal.includes('say')) {
                               selected.components(val);
                               reply = "I've updated the text content.";
                            } else {
                               // Default replace
                               selected.addStyle({ border: '2px dashed #10b981' });
                               reply = "I've highlighted the element and applied custom styling based on your prompt.";
                            }
                          } else {
                             // Create dummy block
                             let html = `<section style="background:#fff;padding:60px 40px;text-align:center;font-family:'Inter',sans-serif;"><h2 style="font-size:28px;font-weight:800;color:#0f172a;margin:0 0 16px;">AI: ${val.slice(0,30)}</h2><p style="font-size:15px;color:#64748b;">Generated from Chat AI prompt.</p></section>`;
                             editorRef.current?.addComponents(html);
                          }
                          
                          setChatMessages(m => [...m, { role: 'ai', content: reply }]);
                          setChatLoading(false);
                        }, 1200);
                      }
                    }}
                    placeholder="E.g. change text to 'Buy Now'"
                    disabled={chatLoading}
                    style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: 8, padding: '10px 14px', fontSize: 13, outline: 'none' }}
                  />
                  <button 
                    disabled={!chatInput.trim() || chatLoading}
                    onClick={() => {
                        const val = chatInput.trim();
                        setChatInput('');
                        setChatMessages(m => [...m, { role: 'user', content: val }]);
                        setChatLoading(true);
                        setTimeout(() => {
                          const selected = editorRef.current?.getSelected();
                          const lowerVal = val.toLowerCase();
                          let reply = "I've generated a new section for you at the bottom!";
                          if (selected) {
                            if (lowerVal.includes('color') || lowerVal.includes('red') || lowerVal.includes('blue') || lowerVal.includes('bg') || lowerVal.includes('background')) {
                              const colorMatch = lowerVal.match(/(red|blue|green|purple|black|white|gray|yellow|orange|#\w+)/);
                              const color = colorMatch ? colorMatch[0] : '#7c3aed';
                              if (lowerVal.includes('text') || lowerVal.includes('font')) {
                                selected.addStyle({ color });
                                reply = `I changed the text color to ${color}.`;
                              } else {
                                selected.addStyle({ 'background-color': color });
                                reply = `I changed the background to ${color}.`;
                              }
                            } else if (lowerVal.includes('text') || lowerVal.includes('change') || lowerVal.includes('say')) {
                               selected.components(val);
                               reply = "I've updated the text content.";
                            } else {
                               selected.addStyle({ border: '2px dashed #10b981' });
                               reply = "I've highlighted the element and applied custom styling based on your prompt.";
                            }
                          } else {
                             let html = `<section style="background:#fff;padding:60px 40px;text-align:center;font-family:'Inter',sans-serif;"><h2 style="font-size:28px;font-weight:800;color:#0f172a;margin:0 0 16px;">AI: ${val.slice(0,30)}</h2><p style="font-size:15px;color:#64748b;">Generated from Chat AI prompt.</p></section>`;
                             editorRef.current?.addComponents(html);
                          }
                          setChatMessages(m => [...m, { role: 'ai', content: reply }]);
                          setChatLoading(false);
                        }, 1200);
                    }}
                    style={{ background: '#7c3aed', color: '#fff', border: 'none', borderRadius: 8, padding: '0 14px', fontWeight: 600, cursor: chatInput.trim() ? 'pointer' : 'not-allowed', opacity: chatInput.trim() ? 1 : 0.5 }}
                  >
                    ↑
                  </button>
                </div>
              </div>
            </div>
          )}
          <style dangerouslySetInnerHTML={{__html: "@keyframes spin { 100% { transform: rotate(360deg); } }"}} />
        </div>

        {/* ══ RIGHT SIDEBAR ══ */}
        <div style={{
          width: 260, flexShrink: 0, background: '#1a1a2e',
          borderLeft: '1px solid #2a2a3e', display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}>
          <div style={{ display: 'flex', borderBottom: '1px solid #2a2a3e' }}>
            <SideTab label="Styles" active={rightTab === 'styles'} onClick={() => setRightTab('styles')} />
            <SideTab label="Properties" active={rightTab === 'traits'} onClick={() => setRightTab('traits')} />
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
                  const projId = localStorage.getItem('editor_project_id');
                  const pageId = localStorage.getItem('editor_page_id');
                  if (projId && pageId) {
                    const projects = getProjects();
                    const nextProjects = projects.map(proj => {
                      if (proj.id === projId) {
                        return {
                          ...proj,
                          pages: proj.pages.map(page => {
                            if (page.id === pageId) {
                              return { ...page, metaTitle: pageTitle, metaDescription: metaDesc };
                            }
                            return page;
                          })
                        }
                      }
                      return proj;
                    });
                    saveProjects(nextProjects);
                  }
                  setSeoOpen(false); 
                  toast.success('SEO Settings saved!'); 
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

      {/* ═══════════════ CODE VIEW MODAL ═══════════════ */}
      {codeView && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,.9)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ height: 48, background: '#1a1a2e', borderBottom: '1px solid #2a2a3e', display: 'flex', alignItems: 'center', padding: '0 16px', gap: 10 }}>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>Code Editor</span>
            <div style={{ flex: 1 }} />
            <button onClick={applyCode}    style={{ ...modalBtn, background: '#7c3aed' }}>Apply Code</button>
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
    </div>
  );
};

/* ══════ HELPER COMPONENTS ══════ */

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

const SideTab = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
  <button onClick={onClick} style={{
    flex: 1, padding: '10px 0', fontSize: 11, fontWeight: 600, border: 'none',
    background: 'none', cursor: 'pointer', letterSpacing: 0.3,
    color: active ? '#a78bfa' : '#4a4a6a',
    borderBottom: `2px solid ${active ? '#7c3aed' : 'transparent'}`,
    transition: 'all .15s',
  }}>{label}</button>
);

/* ── Styles ── */
const outlineBtn: React.CSSProperties = {
  display: 'flex', alignItems: 'center', background: 'transparent',
  border: '1px solid #2a2a3e', borderRadius: 7, padding: '6px 12px',
  fontSize: 12, fontWeight: 500, color: '#94a3b8', cursor: 'pointer',
};
const modalBtn: React.CSSProperties = {
  color: '#fff', border: 'none', borderRadius: 6, padding: '7px 16px',
  fontSize: 12, fontWeight: 600, cursor: 'pointer',
};

/* ── SVG Icons ── */
const CodeIcon     = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>;
const DesktopIcon  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>;
const TabletIcon   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>;
const MobileIcon   = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>;
const UndoIcon     = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 14 4 9 9 4"/><path d="M20 20v-7a4 4 0 0 0-4-4H4"/></svg>;
const RedoIcon     = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 14 20 9 15 4"/><path d="M4 20v-7a4 4 0 0 1 4-4h12"/></svg>;
const TrashIcon    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>;
const EyeIcon      = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
const SaveIcon     = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>;
const SparklesIcon = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3z"/></svg>;
const SettingsIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>;

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
