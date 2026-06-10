import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Type, X } from 'lucide-react';
import type { Editor } from 'grapesjs';
import { PickrColorInput } from '@/components/ui/PickrColorInput';
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

  const [selectedVars, setSelectedVars] = useState<string[]>([]);

  // Track previous valid colors that are actually in the CSS
  const prevColorsRef = React.useRef({
    primary: INIT_STYLES.Colors.primary.value,
    secondary: INIT_STYLES.Colors.secondary.value,
  });

  // 1. Listen for component selection and detect used variables
  useEffect(() => {
    if (!editor) return;

    const updateSelectedVars = () => {
      const selected = editor.getSelected();
      if (!selected) {
        setSelectedVars([]);
        return;
      }

      const componentStyles = selected.getStyle();
      const el = selected.getEl();
      const usedVars: string[] = [];

      // 1. Detect variables from explicit override styles
      Object.values(componentStyles).forEach((val: any) => {
        if (typeof val === 'string' && val.includes('var(')) {
          const matches = val.match(/var\(([^)]+)\)/g);
          if (matches) {
            matches.forEach(m => {
              const varName = m.replace('var(', '').replace(')', '').trim();
              if (!usedVars.includes(varName)) usedVars.push(varName);
            });
          }
        }
      });

      // Removed unused Computed Style Detection to fix severe layout thrashing (click lag)

      // 3. PRIORITY MAPPING (Exclusive logic)
      const tagName = selected.get('tagName')?.toLowerCase();
      const classes = (selected.getAttributes().class || '').toLowerCase();

      let specificVars: string[] = [];

      // Check for specific UI elements first (Highest Priority)
      if (classes.includes('badge')) {
        specificVars = ['--primary']; // Changed from secondary to primary
      } else if (tagName === 'button' || classes.includes('btn')) {
        specificVars = ['--btn-bg', '--btn-text', '--primary'];
      } else if (tagName === 'h1' || tagName === 'h2' || tagName === 'h3' || classes.includes('headline')) {
        // If it's a heading, it usually uses Heading theme or Secondary in saasHero
        if (classes.includes('offer-box') || classes.includes('content-area')) {
          specificVars = ['--secondary', '--heading-font'];
        } else {
          specificVars = ['--heading-color', '--heading-font', '--heading-size'];
        }
      } else if (tagName === 'p' || tagName === 'span') {
        specificVars = ['--body-text', '--body-font'];
      } else if (classes.includes('form') || tagName === 'input') {
        specificVars = ['--form-bg', '--input-bg', '--label-color'];
      }

      // Merge detected vars with specific ones
      const finalVars = Array.from(new Set([...usedVars, ...specificVars]));
      setSelectedVars(finalVars);

      // 4. AUTO-EXPAND (Only most relevant)
      if (finalVars.length > 0) {
        setExpanded(prev => {
          const next = { ...prev };
          let changed = false;

          Object.entries(INIT_STYLES).forEach(([cat, properties]) => {
            // Only expand if the main identity of the section matches
            const hasMatch = Object.values(properties).some(p => finalVars.includes(p.varName));
            if (hasMatch && !next[cat]) {
              // Priority: Don't expand Body if we are looking at a Heading, etc.
              if (cat === 'Body' && finalVars.includes('--heading-color')) return;
              next[cat] = true;
              changed = true;
            }
          });

          return changed ? next : prev;
        });
      }
    };

    let debounceTimer: any;
    const debouncedUpdate = () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        updateSelectedVars();
      }, 50); // Small delay to let GrapesJS UI update first
    };

    editor.on('component:selected', debouncedUpdate);
    editor.on('component:toggled', debouncedUpdate); // For deselection too
    editor.on('component:styleUpdate', debouncedUpdate);

    return () => {
      clearTimeout(debounceTimer);
      editor.off('component:selected', debouncedUpdate);
      editor.off('component:toggled', debouncedUpdate);
      editor.off('component:styleUpdate', debouncedUpdate);
    };
  }, [editor]);

  // Sync initial colors from the project settings
  useEffect(() => {
    setStyles(prev => {
      const newStyles = { ...prev };
      let changed = false;
      if (initialPrimary && newStyles.Colors.primary.value !== initialPrimary) {
        newStyles.Colors.primary = { ...newStyles.Colors.primary, value: initialPrimary };
        newStyles.Buttons.bg = { ...newStyles.Buttons.bg, value: initialPrimary };
        prevColorsRef.current.primary = initialPrimary;
        changed = true;
      }
      if (initialSecondary && newStyles.Colors.secondary.value !== initialSecondary) {
        newStyles.Colors.secondary = { ...newStyles.Colors.secondary, value: initialSecondary };
        newStyles.Subheading.color = { ...newStyles.Subheading.color, value: initialSecondary };
        prevColorsRef.current.secondary = initialSecondary;
        changed = true;
      }
      return changed ? newStyles : prev;
    });
  }, [initialPrimary, initialSecondary]);

  const toggleSection = (cat: string) => {
    setExpanded(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  const handleUpdate = (cat: string, key: string, val: string, isFinal = true) => {
    setStyles(prev => {
      const next = {
        ...prev,
        [cat]: {
          ...prev[cat],
          [key]: { ...prev[cat][key], value: val }
        }
      };

      if (cat === 'Colors' && key === 'primary') {
        next.Buttons = { ...next.Buttons, bg: { ...next.Buttons.bg, value: val } };
      }
      if (cat === 'Colors' && key === 'secondary') {
        next.Subheading = { ...next.Subheading, color: { ...next.Subheading.color, value: val } };
      }

      return next;
    });

    if (editor) {
      if (cat === 'Colors' && (key === 'primary' || key === 'secondary')) {
        const oldVal = prevColorsRef.current[key];

        // Skip heavy replacement if this is just a drag preview (isFinal = false)
        if (!isFinal) {
          return;
        }

        // Only run the heavy CSS replacement if the new value is a valid 7-character hex code.
        // This prevents intermediate typing states (like "#" or "#ff") from corrupting the stylesheet.
        if (!val || val.length !== 7 || !val.startsWith('#')) {
          return;
        }

        const hexToRgbStr = (hex: string) => {
          const c = hex.replace('#', '');
          if (c.length === 3) return `${parseInt(c[0] + c[0], 16)}, ${parseInt(c[1] + c[1], 16)}, ${parseInt(c[2] + c[2], 16)}`;
          return `${parseInt(c.substring(0, 2), 16)}, ${parseInt(c.substring(2, 4), 16)}, ${parseInt(c.substring(4, 6), 16)}`;
        };

        const oldRgb = hexToRgbStr(oldVal);
        const newRgb = hexToRgbStr(val);

        // Find and replace hardcoded colors in all components (Inline styles)
        const wrapper = editor.getWrapper();
        if (wrapper) {
          const updateRecursive = (comp: any) => {
            const compStyle = comp.getStyle() || {};
            const updates: any = {};
            let changed = false;

            Object.keys(compStyle).forEach(prop => {
              if (typeof compStyle[prop] === 'string') {
                if (compStyle[prop].toLowerCase().includes(oldVal.toLowerCase())) {
                  updates[prop] = compStyle[prop].replace(new RegExp(oldVal, 'gi'), val);
                  changed = true;
                }
                
                // Handle rgb() replacements with optional spaces
                const rgbParts = oldRgb.split(',').map(s => s.trim());
                if (rgbParts.length === 3) {
                  const rgbRegex = new RegExp(`rgb\\(\\s*${rgbParts[0]}\\s*,\\s*${rgbParts[1]}\\s*,\\s*${rgbParts[2]}\\s*\\)`, 'gi');
                  const rgbaRegex = new RegExp(`rgba\\(\\s*${rgbParts[0]}\\s*,\\s*${rgbParts[1]}\\s*,\\s*${rgbParts[2]}\\s*,`, 'gi');
                  
                  if (rgbRegex.test(compStyle[prop])) {
                    updates[prop] = compStyle[prop].replace(rgbRegex, `rgb(${newRgb})`);
                    changed = true;
                  }
                  if (rgbaRegex.test(compStyle[prop])) {
                    updates[prop] = compStyle[prop].replace(rgbaRegex, `rgba(${newRgb},`);
                    changed = true;
                  }
                }
              }
            });

            if (changed) {
              comp.addStyle(updates);
            }

            comp.components().forEach(updateRecursive);
          };
          updateRecursive(wrapper);
        }

        // Find and replace in global template-styles
        const canvasDoc = editor.Canvas.getDocument();
        if (canvasDoc) {
          const templateStyles = canvasDoc.getElementById('template-styles');
          if (templateStyles) {
            let html = templateStyles.innerHTML;
            html = html.replace(new RegExp(oldVal, 'gi'), val);
            html = html.replace(new RegExp(oldRgb, 'gi'), newRgb);
            templateStyles.innerHTML = html;
          }
        }

        // Find and replace in GrapesJS CSS rules
        const rules = editor.Css.getRules();
        rules.forEach((rule: any) => {
          const style = rule.getStyle();
          let changedRule = false;
          const newStyle = { ...style };

          Object.keys(newStyle).forEach(prop => {
            if (typeof newStyle[prop] === 'string') {
              if (newStyle[prop].toLowerCase().includes(oldVal.toLowerCase())) {
                newStyle[prop] = newStyle[prop].replace(new RegExp(oldVal, 'gi'), val);
                changedRule = true;
              }
              
              const rgbParts = oldRgb.split(',').map(s => s.trim());
              if (rgbParts.length === 3) {
                const rgbRegex = new RegExp(`rgb\\(\\s*${rgbParts[0]}\\s*,\\s*${rgbParts[1]}\\s*,\\s*${rgbParts[2]}\\s*\\)`, 'gi');
                const rgbaRegex = new RegExp(`rgba\\(\\s*${rgbParts[0]}\\s*,\\s*${rgbParts[1]}\\s*,\\s*${rgbParts[2]}\\s*,`, 'gi');
                
                if (rgbRegex.test(newStyle[prop])) {
                  newStyle[prop] = newStyle[prop].replace(rgbRegex, `rgb(${newRgb})`);
                  changedRule = true;
                }
                if (rgbaRegex.test(newStyle[prop])) {
                  newStyle[prop] = newStyle[prop].replace(rgbaRegex, `rgba(${newRgb},`);
                  changedRule = true;
                }
              }
            }
          });

          if (changedRule) {
            rule.setStyle(newStyle);
          }
        });

        prevColorsRef.current[key] = val;
      } else {
        // Apply directly to selected component if not a sweeping color change
        const selected = editor.getSelected();
        const varName = INIT_STYLES[cat]?.[key]?.varName;
        if (selected && varName) {
          // Direct updates for specific properties
        }
      }
    }
  };

  const generateCSS = (currentStyles: StyleConfig) => {
    let css = ':root, body {\n';
    Object.values(currentStyles).forEach(category => {
      Object.values(category).forEach(prop => {
        css += `  ${prop.varName}: ${prop.value}${prop.unit || ''} !important;\n`;
      });
    });
    css += '}\n\n';

    css += 'input::placeholder, textarea::placeholder { color: #94a3b8 !important; opacity: 0.6; }\n';

    css += `
body {
  background-color: var(--body-bg) !important;
  color: var(--body-text) !important;
  font-family: var(--body-font) !important;
  font-size: var(--body-size) !important;
  line-height: var(--body-line-height) !important;
}

h1, .headline, .heading {
  color: var(--heading-color) !important;
  font-family: var(--heading-font) !important;
  font-size: var(--heading-size) !important;
  line-height: var(--heading-line-height) !important;
}

h2, h3, h4, h5, h6, .subheading, .subtitle {
  color: var(--subheading-color) !important;
  font-family: var(--subheading-font) !important;
  font-size: var(--subheading-size) !important;
  line-height: var(--subheading-line-height) !important;
}

button, .btn, [class*="btn-"] {
  background-color: var(--btn-bg) !important;
  color: var(--btn-text) !important;
  border-radius: var(--btn-radius) !important;
}

form, .form-container, .form {
  background-color: var(--form-bg) !important;
}

input, select, textarea, .input-field {
  background-color: var(--input-bg) !important;
  color: var(--input-text) !important;
}
`;
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
      }
      styleTag.innerHTML = css;
      // Always append to end of head to ensure it overrides GrapesEditor branding-vars
      canvasDoc.head.appendChild(styleTag);
    }

    // (We intentionally DO NOT call editor.setStyle() here because the GrapesJS CSS parser drops modern features like color-mix. The injected styleTag above is sufficient for live editing and is captured during save.)
  }, [styles, editor]);

  useEffect(() => {
    if (!onBrandingColorsChange) return;
    onBrandingColorsChange({
      primary: styles.Colors.primary.value,
      secondary: styles.Colors.secondary.value,
    });
  }, [styles.Colors.primary.value, styles.Colors.secondary.value, onBrandingColorsChange]);

  return (
    <div className="w-full flex-shrink-0 flex flex-col bg-[#fff] text-sm h-full font-sans select-none overflow-y-auto custom-scroll" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {Object.entries(styles).map(([category, properties]) => (
        <div key={category} className="border-b border-[#e5e7eb]">
          <button
            onClick={() => toggleSection(category)}
            className="flex items-center justify-between w-full px-3 py-2 text-left bg-[#f9fafb] hover:bg-[#f3f4f6] transition-colors group"
          >
            <span className="font-medium text-[#111827] text-[13px] capitalize">
              {category}
            </span>
            {expanded[category] ?
              <ChevronDown size={14} className="text-[#6b7280] group-hover:text-[#000000] transition-colors" /> :
              <ChevronRight size={14} className="text-[#6b7280] group-hover:text-[#000000] transition-colors" />
            }
          </button>

          {expanded[category] && (
            <div className="p-4 bg-[#fff] flex flex-col gap-3">
              {Object.entries(properties).map(([key, prop]) => (
                <div key={key} className="flex flex-col gap-1.5">
                  <span className="text-[12px] font-medium text-[#4b5563] flex items-center gap-1">
                    {prop.label}
                  </span>

                    {/* Controls Rendering */}
                    <div className={`flex bg-[#fff] border rounded-[4px] min-w-[140px] items-center p-1 transition-all duration-300 ${selectedVars.includes(prop.varName)
                      ? 'border-[#6366f1] shadow-[0_0_10px_rgba(99,102,241,0.15)] bg-[#6366f1]/5'
                      : 'border-[#d1d5db] hover:border-[#6366f1]'
                      }`}>

                      {prop.type === 'color' && (
                        <>
                          <PickrColorInput
                            value={prop.value.length === 7 || prop.value.length === 9 ? prop.value : '#000000'}
                            onChange={(val, isFinal) => handleUpdate(category, key, val, isFinal)}
                            className="ml-1"
                          />
                          <input
                            type="text"
                            value={prop.value}
                            onChange={(e) => handleUpdate(category, key, e.target.value)}
                            className="bg-transparent border-none text-[#000000] text-[12px] w-full px-2 py-0.5 focus:outline-none"
                          />
                        </>
                      )}

                      {prop.type === 'number' && (
                        <>
                          <div className="px-1.5 text-[#6b7280] flex flex-col justify-center gap-[1px]">
                            <div className="w-0 h-0 border-l-[3px] border-r-[3px] border-b-[4px] border-transparent border-b-[#9ca3af] cursor-pointer hover:border-b-[#6366f1]"></div>
                            <div className="w-0 h-0 border-l-[3px] border-r-[3px] border-t-[4px] border-transparent border-t-[#9ca3af] cursor-pointer hover:border-t-[#6366f1]"></div>
                          </div>
                          <input
                            type="number"
                            step="0.1"
                            value={prop.value}
                            onChange={(e) => handleUpdate(category, key, String(parseFloat(e.target.value) || 0))}
                            className="bg-transparent border-none text-[#000000] text-[12px] w-full px-1 py-0.5 focus:outline-none"
                          />
                          {prop.unit && <span className="text-[10px] text-[#6b7280] pr-2">{prop.unit}</span>}
                        </>
                      )}

                      {prop.type === 'font' && (
                        <div className="flex items-center w-full min-w-[160px]">
                          <Type size={12} className="text-[#6b7280] ml-1.5" />
                          <select
                            value={prop.value}
                            onChange={(e) => handleUpdate(category, key, e.target.value)}
                            className="bg-transparent border-none text-[#000000] text-[12px] w-full px-2 py-0.5 focus:outline-none appearance-none cursor-pointer"
                            style={{ fontFamily: prop.value }}
                          >
                            {DEFAULT_FONTS.map(f => (
                              <option key={f} value={f} className="bg-[#fff] text-[#000000]" style={{ fontFamily: f }}>{f}</option>
                            ))}
                          </select>
                        </div>
                      )}
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
