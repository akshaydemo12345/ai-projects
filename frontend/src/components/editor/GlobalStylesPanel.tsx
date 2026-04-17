import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Type, X } from 'lucide-react';
import type { Editor } from 'grapesjs';

interface GlobalStylesPanelProps {
  editor: Editor | null;
  initialPrimary?: string;
  initialSecondary?: string;
  onBrandingColorsChange?: (colors: { primary: string; secondary: string }) => void;
}

interface StyleConfig {
  [category: string]: {
    [key: string]: {
      label: string;
      type: 'color' | 'number' | 'font';
      varName: string;
      value: string;
      unit?: string;
    };
  };
}

const DEFAULT_FONTS = [
  'Inter', 'Geist Mono', 'Righteous', 'Plus Jakarta Sans', 'Outfit', 'Roboto', 'Arial', 'sans-serif'
];

const INIT_STYLES: StyleConfig = {
  Colors: {
    primary: { label: 'Primary', type: 'color', varName: '--primary', value: '#fa0000' },
    secondary: { label: 'Secondary', type: 'color', varName: '--secondary', value: '#d1d1d1' },
    accent: { label: 'Accent', type: 'color', varName: '--accent', value: '#edeeff' },
    success: { label: 'Success', type: 'color', varName: '--success', value: '#00ff3c' },
    warning: { label: 'Warning', type: 'color', varName: '--warning', value: '#e4ab00' },
    error: { label: 'Error', type: 'color', varName: '--error', value: '#1c0003' },
  },
  Body: {
    bg: { label: 'Background', type: 'color', varName: '--body-bg', value: '#090808' },
    text: { label: 'Color', type: 'color', varName: '--body-text', value: '#ffffff' },
    fontSize: { label: 'Font Size', type: 'number', varName: '--body-size', value: '1', unit: 'rem' },
    lineHeight: { label: 'Line Height', type: 'number', varName: '--body-line-height', value: '1.75', unit: '' },
    fontFamily: { label: 'Font Family', type: 'font', varName: '--body-font', value: 'Geist Mono' },
  },
  Heading: {
    color: { label: 'Color', type: 'color', varName: '--heading-color', value: '#ffffff' },
    fontSize: { label: 'Font Size', type: 'number', varName: '--heading-size', value: '3', unit: 'rem' },
    lineHeight: { label: 'Line Height', type: 'number', varName: '--heading-line-height', value: '1.2', unit: '' },
    fontFamily: { label: 'Font Family', type: 'font', varName: '--heading-font', value: 'Righteous' },
  },
  Subheading: {
    color: { label: 'Color', type: 'color', varName: '--subheading-color', value: '#d1d1d1' },
    fontSize: { label: 'Font Size', type: 'number', varName: '--subheading-size', value: '2', unit: 'rem' },
    lineHeight: { label: 'Line Height', type: 'number', varName: '--subheading-line-height', value: '1.5', unit: '' },
    fontFamily: { label: 'Font Family', type: 'font', varName: '--subheading-font', value: 'Inter' },
  },
  Buttons: {
    bg: { label: 'Background', type: 'color', varName: '--btn-bg', value: '#fa0000' },
    text: { label: 'Color', type: 'color', varName: '--btn-text', value: '#ffffff' },
    radius: { label: 'Radius', type: 'number', varName: '--btn-radius', value: '8', unit: 'px' },
  },
  Forms: {
    bg: { label: 'Form Background', type: 'color', varName: '--form-bg', value: '#ffffff' },
    inputBg: { label: 'Input Background', type: 'color', varName: '--input-bg', value: '#ffffff' },
    inputText: { label: 'Input Text Color', type: 'color', varName: '--input-text', value: '#0f172a' },
    inputBorder: { label: 'Input Border', type: 'color', varName: '--input-border', value: '#cbd5e1' },
    labelColor: { label: 'Label Color', type: 'color', varName: '--label-color', value: '#475569' },
  }
};

const GlobalStylesPanel = ({ editor, initialPrimary, initialSecondary, onBrandingColorsChange }: GlobalStylesPanelProps) => {
  const [styles, setStyles] = useState<StyleConfig>(INIT_STYLES);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    Colors: true, Body: true, Heading: false, Subheading: false, Buttons: false, Forms: false
  });

  // Sync initial colors from the project settings
  useEffect(() => {
    setStyles(prev => {
      const newStyles = { ...prev };
      let changed = false;
      if (initialPrimary && newStyles.Colors.primary.value !== initialPrimary) {
        newStyles.Colors.primary = { ...newStyles.Colors.primary, value: initialPrimary };
        newStyles.Buttons.bg = { ...newStyles.Buttons.bg, value: initialPrimary };
        changed = true;
      }
      if (initialSecondary && newStyles.Colors.secondary.value !== initialSecondary) {
        newStyles.Colors.secondary = { ...newStyles.Colors.secondary, value: initialSecondary };
        changed = true;
      }
      return changed ? newStyles : prev;
    });
  }, [initialPrimary, initialSecondary]);

  const toggleSection = (cat: string) => {
    setExpanded(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  const handleUpdate = (cat: string, key: string, val: string) => {
    setStyles(prev => ({
      ...prev,
      [cat]: {
        ...prev[cat],
        [key]: { ...prev[cat][key], value: val }
      }
    }));
  };

  const generateCSS = (currentStyles: StyleConfig) => {
    let css = ':root {\n';
    Object.values(currentStyles).forEach(cat => {
      Object.values(cat).forEach(prop => {
        css += `  ${prop.varName}: ${prop.value}${prop.unit || ''};\n`;
      });
    });
    css += '}\n\n';

    css += 'body { background-color: var(--body-bg); color: var(--body-text); font-family: var(--body-font); font-size: var(--body-size); line-height: var(--body-line-height); transition: all 0.3s ease; }\n';
    css += 'h1, h2, h3, h4, h5, h6 { font-family: var(--heading-font); color: var(--heading-color); line-height: var(--heading-line-height); }\n';
    css += 'h1 { font-size: var(--heading-size); }\n';
    css += 'h2, h3 { font-size: var(--subheading-size); color: var(--subheading-color); line-height: var(--subheading-line-height); font-family: var(--subheading-font); }\n';
    css += '.primary-button, button[type="submit"], .btn { background-color: var(--btn-bg) !important; color: var(--btn-text) !important; border-radius: var(--btn-radius) !important; }\n';
    css += 'form, .lead-form-container { background-color: var(--form-bg) !important; }\n';
    css += 'input, textarea, select { color: var(--input-text) !important; background-color: var(--input-bg) !important; border: 1px solid var(--input-border) !important; }\n';
    css += 'label { color: var(--label-color) !important; }\n';
    css += 'input::placeholder, textarea::placeholder { color: #94a3b8 !important; opacity: 0.6; }\n';

    return css;
  };

  useEffect(() => {
    if (!editor) return;

    const css = generateCSS(styles);

    // 1. Inject into canvas <head> style tag (for live visual update)
    const canvasDoc = editor.Canvas.getDocument();
    if (canvasDoc) {
      let styleTag = canvasDoc.getElementById('global-theme-styles') as HTMLStyleElement | null;
      if (!styleTag) {
        styleTag = canvasDoc.createElement('style');
        styleTag.id = 'global-theme-styles';
        canvasDoc.head.appendChild(styleTag);
      }
      styleTag.innerHTML = css;
    }

    // 2. Also patch GrapesJS internal CSS so it doesn't override our variables
    //    Replace any existing :root block in GrapesJS CSS with our updated vars
    try {
      const existingCss = editor.getCss() || '';
      // Build just the :root vars block from current styles
      let rootBlock = ':root {\n';
      Object.values(styles).forEach(cat => {
        Object.values(cat).forEach(prop => {
          rootBlock += `  ${prop.varName}: ${prop.value}${prop.unit || ''};\n`;
        });
      });
      rootBlock += '}';

      // Remove any old :root { ... } block from GrapesJS CSS
      const stripped = existingCss.replace(/:root\s*\{[^}]*\}/g, '').trim();
      // Prepend fresh :root block
      editor.setStyle(rootBlock + '\n' + stripped);
    } catch (e) {
      // Silently ignore if CSS parsing fails
    }
  }, [styles, editor]);

  useEffect(() => {
    if (!onBrandingColorsChange) return;
    onBrandingColorsChange({
      primary: styles.Colors.primary.value,
      secondary: styles.Colors.secondary.value,
    });
  }, [styles.Colors.primary.value, styles.Colors.secondary.value, onBrandingColorsChange]);

  return (
    <div className="w-full flex-shrink-0 flex flex-col bg-[#12121e] text-sm h-full font-sans select-none overflow-y-auto custom-scroll" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {Object.entries(styles).map(([category, properties]) => (
        <div key={category} className="border-b border-[#2a2a3e]">
          <button
            onClick={() => toggleSection(category)}
            className="flex items-center justify-between w-full px-4 py-3 text-left bg-[#161622] hover:bg-[#1a1a2e] transition-colors group"
          >
            <span className="font-semibold text-[#cbd5e1] text-[12px] uppercase tracking-wide">
              {category}
            </span>
            {expanded[category] ?
              <ChevronDown size={14} className="text-[#64748b] group-hover:text-[#94a3b8] transition-colors" /> :
              <ChevronRight size={14} className="text-[#64748b] group-hover:text-[#94a3b8] transition-colors" />
            }
          </button>

          {expanded[category] && (
            <div className="p-4 bg-[#12121e] flex flex-col gap-3">
              {Object.entries(properties).map(([key, prop]) => (
                <div key={key} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-medium text-[#818cf8] flex items-center gap-1">
                      {prop.label}
                    </span>
                    
                    {/* Controls Rendering */}
                    <div className="flex bg-[#0a0a14] border border-[#2a2a3e] rounded-[4px] min-w-[140px] items-center p-1 transition-colors hover:border-[#4f46e5]">
                      
                      {prop.type === 'color' && (
                        <>
                          <div className="relative w-[18px] h-[18px] rounded-[2px] border border-[#2a2a3e] overflow-hidden ml-1 flex-shrink-0 cursor-pointer">
                            <input 
                              type="color" 
                              value={prop.value.length === 7 ? prop.value : '#000000'}
                              onChange={(e) => handleUpdate(category, key, e.target.value)}
                              className="absolute -top-2 -left-2 w-[40px] h-[40px] cursor-pointer"
                            />
                          </div>
                          <input 
                            type="text" 
                            value={prop.value} 
                            onChange={(e) => handleUpdate(category, key, e.target.value)}
                            className="bg-transparent border-none text-[#e2e8f0] text-[12px] w-full px-2 py-0.5 focus:outline-none"
                          />
                        </>
                      )}

                      {prop.type === 'number' && (
                        <>
                          <div className="px-1.5 text-[#64748b] flex flex-col justify-center gap-[1px]">
                            <div className="w-0 h-0 border-l-[3px] border-r-[3px] border-b-[4px] border-transparent border-b-[#94a3b8] cursor-pointer hover:border-b-[#c0caf5]"></div>
                            <div className="w-0 h-0 border-l-[3px] border-r-[3px] border-t-[4px] border-transparent border-t-[#94a3b8] cursor-pointer hover:border-t-[#c0caf5]"></div>
                          </div>
                          <input 
                            type="number" 
                            step="0.1"
                            value={prop.value} 
                            onChange={(e) => handleUpdate(category, key, String(parseFloat(e.target.value) || 0))}
                            className="bg-transparent border-none text-[#e2e8f0] text-[12px] w-full px-1 py-0.5 focus:outline-none"
                          />
                          {prop.unit && <span className="text-[10px] text-[#64748b] pr-2">{prop.unit}</span>}
                        </>
                      )}

                      {prop.type === 'font' && (
                        <div className="flex items-center w-full min-w-[160px]">
                          <Type size={12} className="text-[#64748b] ml-1.5" />
                          <select 
                            value={prop.value}
                            onChange={(e) => handleUpdate(category, key, e.target.value)}
                            className="bg-transparent border-none text-[#e2e8f0] text-[12px] w-full px-2 py-0.5 focus:outline-none appearance-none cursor-pointer"
                            style={{ fontFamily: prop.value }}
                          >
                            {DEFAULT_FONTS.map(f => (
                              <option key={f} value={f} className="bg-[#1a1a2e] text-white" style={{ fontFamily: f }}>{f}</option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default GlobalStylesPanel;
