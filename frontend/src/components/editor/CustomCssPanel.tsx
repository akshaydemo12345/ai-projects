import React, { useState, useEffect } from 'react';
import type { Editor } from 'grapesjs';
import {
  Code,
  Target,
  Copy,
  Check,
  Trash2,
  FileCode,
  Info,
  MousePointerClick,
  Wand2
} from 'lucide-react';

interface CustomCssPanelProps {
  editor: Editor | null;
  initialGlobalCss?: string;
  onGlobalCssChange?: (css: string) => void;
  defaultTab?: 'global' | 'element';
  mode?: 'all' | 'global' | 'element';
}

export const CustomCssPanel: React.FC<CustomCssPanelProps> = ({
  editor,
  initialGlobalCss = '',
  onGlobalCssChange,
  defaultTab = 'global',
  mode = 'all'
}) => {
  const initialActive = mode === 'global' ? 'global' : mode === 'element' ? 'element' : defaultTab;
  const [activeTab, setActiveTab] = useState<'global' | 'element'>(initialActive);

  useEffect(() => {
    if (mode === 'global') {
      setActiveTab('global');
    } else if (mode === 'element') {
      setActiveTab('element');
    } else if (defaultTab) {
      setActiveTab(defaultTab);
    }
  }, [mode, defaultTab]);

  // Global CSS State
  const [globalCss, setGlobalCss] = useState<string>(initialGlobalCss);
  const [globalCopied, setGlobalCopied] = useState<boolean>(false);

  // Element CSS State
  const [selectedComponent, setSelectedComponent] = useState<any>(null);
  const [elementCss, setElementCss] = useState<string>('');
  const [elementCopied, setElementCopied] = useState<boolean>(false);
  const [elementInfo, setElementInfo] = useState<{
    id: string;
    tagName: string;
    classes: string;
  }>({ id: '', tagName: '', classes: '' });

  // Sync initial global CSS prop
  useEffect(() => {
    if (initialGlobalCss && initialGlobalCss !== globalCss) {
      setGlobalCss(initialGlobalCss);
    }
  }, [initialGlobalCss]);

  // Read existing custom global CSS from canvas head on load if empty
  useEffect(() => {
    if (!editor || !editor.Canvas || typeof editor.Canvas.getDocument !== 'function') return;
    const canvasDoc = editor.Canvas.getDocument();
    if (canvasDoc) {
      const styleTag = canvasDoc.getElementById('custom-global-css');
      if (styleTag && styleTag.innerHTML && !globalCss) {
        setGlobalCss(styleTag.innerHTML);
      }
    }
  }, [editor]);

  // Helper to build scoped CSS for a component ID
  const buildScopedCss = (id: string, rawCss: string): string => {
    const trimmed = rawCss.trim();
    if (!trimmed) return '';

    const selectorId = `#${id}`;

    // If the user already wrote selector blocks containing { }
    if (trimmed.includes('{')) {
      let processed = trimmed
        .replace(/\bthis\b/g, selectorId)
        .replace(/&/g, selectorId);

      // If pseudo classes like :hover are typed at start of line
      processed = processed.replace(/(^|\n)\s*(:(hover|focus|active|before|after|nth-child|first-child|last-child)[^{]*)\{/g, `$1${selectorId}$2{`);

      if (!processed.includes(selectorId)) {
        return `${selectorId} {\n${processed}\n}`;
      }
      return processed;
    }

    // Simple property declarations (e.g. "color: red; background-color: blue;")
    return `${selectorId} {\n  ${trimmed.split('\n').join('\n  ')}\n}`;
  };

  // ── Sync All Custom Styles (Global & Element) into Canvas Head ──
  const syncCanvasStyles = () => {
    if (!editor || !editor.Canvas || typeof editor.Canvas.getDocument !== 'function') return;

    const canvasDoc = editor.Canvas.getDocument();
    if (!canvasDoc || !canvasDoc.head) return;

    // 1. Global CSS Injection
    let globalStyleTag = canvasDoc.getElementById('custom-global-css') as HTMLStyleElement | null;
    if (globalCss.trim()) {
      if (!globalStyleTag) {
        globalStyleTag = canvasDoc.createElement('style');
        globalStyleTag.id = 'custom-global-css';
        const themeStyle = canvasDoc.getElementById('global-theme-styles');
        if (themeStyle && themeStyle.parentNode) {
          themeStyle.parentNode.insertBefore(globalStyleTag, themeStyle.nextSibling);
        } else {
          canvasDoc.head.appendChild(globalStyleTag);
        }
      }
      globalStyleTag.innerHTML = globalCss;
    } else if (globalStyleTag) {
      globalStyleTag.remove();
    }

    // 2. Element CSS Injection for Selected Component
    if (selectedComponent) {
      const id = selectedComponent.getId();
      if (id) {
        // Guarantee HTML attribute `id` exists on DOM element inside canvas iframe
        const attrs = selectedComponent.getAttributes() || {};
        if (!attrs.id || attrs.id !== id) {
          selectedComponent.addAttributes({ id });
        }

        const styleTagId = `element-css-${id}`;
        let styleTag = canvasDoc.getElementById(styleTagId) as HTMLStyleElement | null;

        if (elementCss.trim()) {
          if (!styleTag) {
            styleTag = canvasDoc.createElement('style');
            styleTag.id = styleTagId;
            canvasDoc.head.appendChild(styleTag);
          }
          styleTag.innerHTML = buildScopedCss(id, elementCss);
        } else if (styleTag) {
          styleTag.remove();
        }
      }
    }
  };

  // Trigger sync whenever CSS state or selected component changes
  useEffect(() => {
    syncCanvasStyles();
    if (onGlobalCssChange) {
      onGlobalCssChange(globalCss);
    }
  }, [globalCss, elementCss, selectedComponent, editor]);

  // Re-inject styles whenever canvas iframe reloads or preview stops
  useEffect(() => {
    if (!editor) return;

    const handleCanvasReload = () => {
      setTimeout(syncCanvasStyles, 50);
    };

    editor.on('canvas:frame:load', handleCanvasReload);
    editor.on('load', handleCanvasReload);
    editor.on('run:preview:stop', handleCanvasReload);

    return () => {
      editor.off('canvas:frame:load', handleCanvasReload);
      editor.off('load', handleCanvasReload);
      editor.off('run:preview:stop', handleCanvasReload);
    };
  }, [editor, globalCss, elementCss, selectedComponent]);

  // ── Track Selected Component in GrapesJS Canvas ──
  useEffect(() => {
    if (!editor) return;

    const updateSelected = () => {
      const selected = editor.getSelected();
      if (!selected) {
        setSelectedComponent(null);
        setElementCss('');
        setElementInfo({ id: '', tagName: '', classes: '' });
        return;
      }

      setSelectedComponent(selected);
      const id = selected.getId();

      // Ensure component HTML attributes include id attribute
      const attrs = selected.getAttributes() || {};
      if (!attrs.id || attrs.id !== id) {
        selected.addAttributes({ id });
      }

      const tagName = selected.get('tagName')?.toUpperCase() || 'DIV';
      const classes = selected.getClasses ? selected.getClasses().join(' ') : (attrs.class || '');

      setElementInfo({
        id: `#${id}`,
        tagName,
        classes: classes ? `.${classes.split(' ').join(' .')}` : ''
      });

      const existingCss = selected.get('custom-css') || attrs['data-custom-css'] || '';
      setElementCss(existingCss);
    };

    updateSelected();

    editor.on('component:selected', updateSelected);
    editor.on('component:deselected', updateSelected);
    editor.on('component:toggled', updateSelected);

    return () => {
      editor.off('component:selected', updateSelected);
      editor.off('component:deselected', updateSelected);
      editor.off('component:toggled', updateSelected);
    };
  }, [editor]);

  // ── Apply Element CSS Updates ──
  const applyElementCss = (cssText: string) => {
    setElementCss(cssText);

    if (!selectedComponent) return;

    const id = selectedComponent.getId();
    if (!id) return;

    // Save custom-css onto GrapesJS component attributes for persistence
    selectedComponent.set('custom-css', cssText);
    selectedComponent.addAttributes({
      id,
      'data-custom-css': cssText
    });
  };

  const copyToClipboard = (text: string, isGlobal: boolean) => {
    navigator.clipboard.writeText(text);
    if (isGlobal) {
      setGlobalCopied(true);
      setTimeout(() => setGlobalCopied(false), 2000);
    } else {
      setElementCopied(true);
      setTimeout(() => setElementCopied(false), 2000);
    }
  };

  const formatCssCode = (css: string): string => {
    if (!css.trim()) return css;
    return css
      .replace(/\s*\{\s*/g, ' {\n  ')
      .replace(/;\s*/g, ';\n  ')
      .replace(/\s*\}\s*/g, '\n}\n\n')
      .replace(/\n\s*\n\s*\n/g, '\n\n')
      .trim();
  };

  const handleFormat = (isGlobal: boolean) => {
    if (isGlobal) {
      setGlobalCss(formatCssCode(globalCss));
    } else {
      applyElementCss(formatCssCode(elementCss));
    }
  };

  const getLineNumbers = (text: string) => {
    const count = (text.match(/\n/g) || []).length + 1;
    return Array.from({ length: Math.max(count, 16) }, (_, i) => i + 1);
  };

  return (
    <div
      className="w-full flex-1 flex flex-col bg-[#ffffff] text-sm h-full font-sans overflow-hidden select-none"
      style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
    >
      {/* ── Sub-Navigation Tabs matching Editor Design ── */}
      {mode === 'all' && (
        <div className="p-3 border-b border-[#e5e7eb] bg-[#ffffff] shrink-0">
          <div className="flex bg-[#f3f4f6] p-1 rounded-md gap-1 border border-[#e5e7eb]">
            <button
              type="button"
              onClick={() => setActiveTab('global')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded text-[12px] font-semibold transition-all cursor-pointer ${
                activeTab === 'global'
                  ? 'bg-[#ffffff] text-[#111827] shadow-xs border border-[#cbd5e1]'
                  : 'text-[#6b7280] hover:text-[#111827] hover:bg-[#e5e7eb]'
              }`}
            >
              <Code size={13} className={activeTab === 'global' ? 'text-[#6366f1]' : 'text-[#9ca3af]'} />
              <span>Global CSS</span>
              {globalCss.trim() && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] ml-0.5" title="Active global CSS" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('element')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded text-[12px] font-semibold transition-all cursor-pointer ${
                activeTab === 'element'
                  ? 'bg-[#ffffff] text-[#111827] shadow-xs border border-[#cbd5e1]'
                  : 'text-[#6b7280] hover:text-[#111827] hover:bg-[#e5e7eb]'
              }`}
            >
              <Target size={13} className={activeTab === 'element' ? 'text-[#6366f1]' : 'text-[#9ca3af]'} />
              <span>CSS</span>
              {selectedComponent && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#6366f1] ml-0.5" title="Element selected" />
              )}
            </button>
          </div>
        </div>
      )}

      {/* ════════════════ TAB 1: GLOBAL CUSTOM CSS ════════════════ */}
      {activeTab === 'global' && (
        <div className="flex-1 flex flex-col p-3 gap-3 bg-[#ffffff] overflow-hidden">
          {/* Header Bar matching Editor Style */}
          <div className="flex items-center justify-between bg-[#f8fafc] border border-[#e2e8f0] rounded px-3 py-2 shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#10b981]" />
              <span className="text-[12px] font-semibold text-[#0f172a]">Global Canvas Stylesheet</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleFormat(true)}
                disabled={!globalCss.trim()}
                title="Format CSS"
                className="px-2 py-1 text-[11px] font-medium text-[#475569] hover:text-[#0f172a] bg-[#ffffff] hover:bg-[#f1f5f9] border border-[#cbd5e1] rounded transition-colors disabled:opacity-40 cursor-pointer flex items-center gap-1"
              >
                <Wand2 size={11} />
                <span>Format</span>
              </button>
              <button
                type="button"
                onClick={() => copyToClipboard(globalCss, true)}
                disabled={!globalCss.trim()}
                title="Copy Global CSS"
                className="p-1.5 text-[#475569] hover:text-[#6366f1] bg-[#ffffff] hover:bg-[#f1f5f9] border border-[#cbd5e1] rounded transition-colors disabled:opacity-40 cursor-pointer"
              >
                {globalCopied ? <Check size={13} className="text-[#10b981]" /> : <Copy size={13} />}
              </button>
              <button
                type="button"
                onClick={() => setGlobalCss('')}
                disabled={!globalCss.trim()}
                title="Clear Global CSS"
                className="p-1.5 text-[#475569] hover:text-[#ef4444] bg-[#ffffff] hover:bg-[#fee2e2] border border-[#cbd5e1] rounded transition-colors disabled:opacity-40 cursor-pointer"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>

          {/* Clean Code Editor Container matching GrapesJS Panel Design */}
          <div className="flex-1 flex flex-col border border-[#cbd5e1] rounded-md overflow-hidden bg-[#ffffff] shadow-xs focus-within:border-[#6366f1] focus-within:ring-1 focus-within:ring-[#6366f1] transition-all">
            {/* Editor Control Bar */}
            <div className="flex items-center justify-between bg-[#f8fafc] px-3 py-1.5 border-b border-[#e2e8f0] shrink-0">
              <div className="flex items-center gap-1.5">
                <FileCode size={13} className="text-[#6366f1]" />
                <span className="text-[11px] font-mono font-medium text-[#334155]">global.css</span>
              </div>
              <span className="text-[10px] text-[#64748b] font-mono">
                {globalCss.length} chars | {getLineNumbers(globalCss).length} lines
              </span>
            </div>

            {/* Editor Input Area */}
            <div className="flex-1 flex overflow-hidden relative bg-[#ffffff]">
              {/* Line Numbers Gutter */}
              <div className="w-9 bg-[#f8fafc] text-[#94a3b8] font-mono text-[11px] py-2.5 pr-2 text-right select-none border-r border-[#e2e8f0] leading-[20px] shrink-0">
                {getLineNumbers(globalCss).map(num => (
                  <div key={num}>{num}</div>
                ))}
              </div>

              {/* Textarea */}
              <textarea
                value={globalCss}
                onChange={e => setGlobalCss(e.target.value)}
                placeholder={`/* Enter custom CSS rules here */\n\n.my-custom-class {\n  background-color: #6366f1;\n  color: #ffffff;\n  border-radius: 8px;\n}`}
                spellCheck={false}
                className="flex-1 bg-[#ffffff] text-[#0f172a] font-mono text-[12px] p-2.5 outline-none resize-none leading-[20px] custom-scroll"
                style={{
                  tabSize: 2,
                  whiteSpace: 'pre',
                  wordBreak: 'normal'
                }}
              />
            </div>
          </div>

          {/* Footer Note */}
          <div className="flex items-start gap-2 p-2.5 bg-[#f8fafc] border border-[#e2e8f0] rounded text-xs text-[#475569] shrink-0">
            <Info size={14} className="shrink-0 mt-0.5 text-[#6366f1]" />
            <p className="leading-snug text-[11px]">
              Global CSS styles are injected into the page canvas head in real-time and saved directly into the project stylesheet.
            </p>
          </div>
        </div>
      )}

      {/* ════════════════ TAB 2: ELEMENT CUSTOM CSS ════════════════ */}
      {activeTab === 'element' && (
        <div className="flex-1 flex flex-col p-3 gap-3 bg-[#ffffff] overflow-hidden">
          {selectedComponent ? (
            <>
              {/* Selected Component Header Badge */}
              <div className="flex flex-col bg-[#f8fafc] border border-[#e2e8f0] rounded p-2.5 gap-1.5 shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="bg-[#6366f1] text-[#ffffff] text-[10px] font-bold px-1.5 py-0.5 rounded font-mono shrink-0">
                      &lt;{elementInfo.tagName}&gt;
                    </span>
                    <span className="text-[12px] font-bold text-[#0f172a] font-mono truncate" title={elementInfo.id}>
                      {elementInfo.id}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleFormat(false)}
                      disabled={!elementCss.trim()}
                      title="Format CSS"
                      className="px-2 py-1 text-[11px] font-medium text-[#475569] hover:text-[#0f172a] bg-[#ffffff] hover:bg-[#f1f5f9] border border-[#cbd5e1] rounded transition-colors disabled:opacity-40 cursor-pointer flex items-center gap-1"
                    >
                      <Wand2 size={11} />
                      <span>Format</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(elementCss, false)}
                      disabled={!elementCss.trim()}
                      title="Copy Element CSS"
                      className="p-1.5 text-[#475569] hover:text-[#6366f1] bg-[#ffffff] hover:bg-[#f1f5f9] border border-[#cbd5e1] rounded transition-colors disabled:opacity-40 cursor-pointer"
                    >
                      {elementCopied ? <Check size={13} className="text-[#10b981]" /> : <Copy size={13} />}
                    </button>
                    <button
                      type="button"
                      onClick={() => applyElementCss('')}
                      disabled={!elementCss.trim()}
                      title="Clear Element CSS"
                      className="p-1.5 text-[#475569] hover:text-[#ef4444] bg-[#ffffff] hover:bg-[#fee2e2] border border-[#cbd5e1] rounded transition-colors disabled:opacity-40 cursor-pointer"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                {elementInfo.classes && (
                  <div className="text-[11px] text-[#64748b] font-mono truncate" title={elementInfo.classes}>
                    {elementInfo.classes}
                  </div>
                )}
              </div>

              {/* Code Editor Box matching Editor Theme */}
              <div className="flex-1 flex flex-col border border-[#cbd5e1] rounded-md overflow-hidden bg-[#ffffff] shadow-xs focus-within:border-[#6366f1] focus-within:ring-1 focus-within:ring-[#6366f1] transition-all">
                <div className="flex items-center justify-between bg-[#f8fafc] px-3 py-1.5 border-b border-[#e2e8f0] shrink-0">
                  <div className="flex items-center gap-1.5">
                    <Target size={13} className="text-[#6366f1]" />
                    <span className="text-[11px] font-mono font-medium text-[#334155]">
                      {elementInfo.id}.css
                    </span>
                  </div>
                  <span className="text-[10px] text-[#64748b] font-mono">
                    {elementCss.length} chars
                  </span>
                </div>

                <div className="flex-1 flex overflow-hidden relative bg-[#ffffff]">
                  <div className="w-9 bg-[#f8fafc] text-[#94a3b8] font-mono text-[11px] py-2.5 pr-2 text-right select-none border-r border-[#e2e8f0] leading-[20px] shrink-0">
                    {getLineNumbers(elementCss).map(num => (
                      <div key={num}>{num}</div>
                    ))}
                  </div>

                  <textarea
                    value={elementCss}
                    onChange={e => applyElementCss(e.target.value)}
                    placeholder={`/* CSS rules for selected element */\n:hover {\n  transform: scale(1.02);\n}\n\ncolor: #6366f1;\nborder-radius: 8px;`}
                    spellCheck={false}
                    className="flex-1 bg-[#ffffff] text-[#0f172a] font-mono text-[12px] p-2.5 outline-none resize-none leading-[20px] custom-scroll"
                    style={{
                      tabSize: 2,
                      whiteSpace: 'pre',
                      wordBreak: 'normal'
                    }}
                  />
                </div>
              </div>

              {/* Guidance Tip */}
              <div className="flex items-start gap-2 p-2.5 bg-[#f8fafc] border border-[#e2e8f0] rounded text-xs text-[#475569] shrink-0">
                <Info size={14} className="shrink-0 mt-0.5 text-[#6366f1]" />
                <p className="leading-snug text-[11px]">
                  Element styles are scoped to <span className="font-mono font-bold text-[#0f172a]">{elementInfo.id}</span>. You can use property declarations or pseudo classes like <code className="bg-[#e2e8f0] px-1 rounded font-mono">:hover</code>.
                </p>
              </div>
            </>
          ) : (
            /* Empty State matching Editor Design System */
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center gap-3 my-auto">
              <div className="w-12 h-12 rounded-full bg-[#f3f4f6] border border-[#e5e7eb] flex items-center justify-center text-[#6366f1]">
                <MousePointerClick size={22} />
              </div>
              <div className="flex flex-col gap-1">
                <h4 className="text-[13px] font-bold text-[#111827]">No Element Selected</h4>
                <p className="text-[12px] text-[#6b7280] leading-relaxed max-w-[220px]">
                  Click any element on the canvas to inspect and edit its scoped custom CSS.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomCssPanel;
