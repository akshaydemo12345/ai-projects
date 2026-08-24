import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronRight, Type, X } from 'lucide-react';
import type { Editor } from 'grapesjs';
import { PickrColorInput } from '@/components/ui/PickrColorInput';
import { GOOGLE_FONTS_OPTIONS, preloadAllGoogleFontsOptions, ensureGoogleFontLoaded } from './GrapesEditor';
interface GlobalStylesPanelProps {
  editor: Editor | null;
  initialPrimary?: string;
  initialSecondary?: string;
  initialStylesCss?: string;
  onBrandingColorsChange?: (colors: { primary: string; secondary: string }) => void;
  // Full scraped websiteProfile blocks
  initialWebsiteColors?: {
    primary?: string; secondary?: string; accent?: string;
    pagePrimary?: string; pageSecondary?: string;
  };
  initialTheme?: {
    header?: { background?: string; text?: string; };
    navigation?: { background?: string; text?: string; active?: string; };
    buttons?: { primaryBg?: string; primaryText?: string; secondaryBg?: string; secondaryText?: string; };
    footer?: { background?: string; text?: string; };
  };
  initialWebsiteFonts?: {
    primaryFont?: string; headingFont?: string; bodyFont?: string;
    bodyFontSize?: string; googleFonts?: string[];
  };
  onThemeChange?: (snapshot: {
    colors: { primary: string; secondary: string; accent: string; };
    theme: {
      header: { background: string; text: string; };
      navigation: { background: string; text: string; active: string; };
      buttons: { primaryBg: string; primaryText: string; secondaryBg: string; secondaryText: string; };
      footer: { background: string; text: string; };
    };
    fonts: { primaryFont: string; headingFont: string; bodyFont: string; bodyFontSize: string; };
  }) => void;
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

const VisualFontPicker: React.FC<{
  value: string;
  onChange: (val: string) => void;
  editor?: Editor | null;
}> = ({ value, onChange, editor }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    preloadAllGoogleFontsOptions(editor);
  }, [editor]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  const filteredFonts = GOOGLE_FONTS_OPTIONS.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.id.toLowerCase().includes(search.toLowerCase())
  );

  const fontObj = GOOGLE_FONTS_OPTIONS.find(f => f.id === value || f.name === value) || { id: value || 'inherit', name: value || 'Default / Inherit' };
  const currentFontStyle = fontObj.id !== 'inherit' && !['sans-serif', 'serif', 'monospace'].includes(fontObj.id)
    ? `'${fontObj.id}', sans-serif`
    : fontObj.id;

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between bg-white border border-[#cbd5e1] rounded px-2 py-1 text-[12px] text-[#000000] focus:outline-none cursor-pointer truncate"
        style={{ fontFamily: currentFontStyle }}
      >
        <span className="truncate flex-1 text-left font-medium">{fontObj.name}</span>
        <ChevronDown size={12} className="text-[#6b7280] ml-1 shrink-0" />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1 w-64 max-h-72 bg-white border border-[#cbd5e1] rounded-md shadow-2xl z-[99999] flex flex-col overflow-hidden text-left">
          <div className="p-1.5 border-b border-[#f1f5f9] bg-[#f8fafc]">
            <input
              type="text"
              placeholder="Search font..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-2 py-1 text-xs border border-[#cbd5e1] rounded outline-none focus:border-[#2563eb]"
              autoFocus
            />
          </div>
          <div className="overflow-y-auto max-h-56 custom-scroll py-1">
            {filteredFonts.length === 0 ? (
              <div className="px-3 py-2 text-xs text-[#94a3b8] text-center">No fonts found</div>
            ) : (
              filteredFonts.map((font) => {
                const isSelected = font.id === value || font.name === value;
                const fontStyle = font.id !== 'inherit' && !['sans-serif', 'serif', 'monospace'].includes(font.id)
                  ? `'${font.id}', sans-serif`
                  : font.id;
                return (
                  <button
                    key={font.id}
                    type="button"
                    onClick={() => {
                      ensureGoogleFontLoaded(editor, font.id);
                      onChange(font.id);
                      setOpen(false);
                      setSearch('');
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex flex-col gap-0.5 hover:bg-[#f1f5f9] transition-colors border-b border-[#f8fafc] ${
                      isSelected ? 'bg-[#eff6ff] text-[#2563eb]' : 'text-[#1e293b]'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span
                        className="text-sm font-medium truncate"
                        style={{ fontFamily: fontStyle }}
                      >
                        {font.name}
                      </span>
                      {isSelected && <span className="text-[#2563eb] text-xs font-bold ml-1">✓</span>}
                    </div>
                    {font.id !== 'inherit' && (
                      <span
                        className="text-[11px] text-[#64748b] truncate opacity-85"
                        style={{ fontFamily: fontStyle }}
                      >
                        The quick brown fox jumps over the lazy dog
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const INIT_STYLES: StyleConfig = {
  Colors: {
    primary: { label: 'Primary', type: 'color', varName: '--primary', value: '#fa0000' },
    secondary: { label: 'Secondary', type: 'color', varName: '--secondary', value: '#d1d1d1' },
  },
  Body: {
    bg: { label: 'Background', type: 'color', varName: '--body-bg', value: '#ffffff' },
    text: { label: 'Color', type: 'color', varName: '--body-text', value: '#0f172a' },
    fontSize: { label: 'Font Size', type: 'number', varName: '--body-size', value: '1', unit: 'rem' },
    lineHeight: { label: 'Line Height', type: 'number', varName: '--body-line-height', value: '1.75', unit: '' },
    fontFamily: { label: 'Font Family', type: 'font', varName: '--body-font', value: 'Inter' },
  },
  Heading: {
    color: { label: 'Color', type: 'color', varName: '--heading-color', value: '#0f172a' },
    fontSize: { label: 'Font Size', type: 'number', varName: '--heading-size', value: '3', unit: 'rem' },
    lineHeight: { label: 'Line Height', type: 'number', varName: '--heading-line-height', value: '1.2', unit: '' },
    fontFamily: { label: 'Font Family', type: 'font', varName: '--heading-font', value: 'Righteous' },
  },
  Subheading: {
    color: { label: 'Color', type: 'color', varName: '--subheading-color', value: '#475569' },
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
    bg: { label: 'Form Background', type: 'color', varName: '--form-bg', value: '#ffffff00' },
    inputBg: { label: 'Input Background', type: 'color', varName: '--input-bg', value: '#ffffff' },
    inputText: { label: 'Input Text Color', type: 'color', varName: '--input-text', value: '#0f172a' },
    inputBorder: { label: 'Input Border', type: 'color', varName: '--input-border', value: '#cbd5e1' },
    labelColor: { label: 'Label Color', type: 'color', varName: '--label-color', value: '#475569' },
  }
};

const GlobalStylesPanel = ({ editor, initialPrimary, initialSecondary, initialStylesCss, onBrandingColorsChange, initialWebsiteColors, initialTheme, initialWebsiteFonts, onThemeChange }: GlobalStylesPanelProps) => {
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

  const parseCssVariables = (cssStr: string) => {
    const vars: Record<string, string> = {};
    if (!cssStr) return vars;

    const regex = /--([a-zA-Z0-9-]+)\s*:\s*([^;!}\n]+)(?:\s*!important)?\s*;/g;
    let match;
    while ((match = regex.exec(cssStr)) !== null) {
      const name = '--' + match[1].trim();
      const value = match[2].trim();
      vars[name] = value;
    }
    return vars;
  };

  // Sync initial variables from the saved CSS stylesheet
  useEffect(() => {
    if (!initialStylesCss) return;

    const parsedVars = parseCssVariables(initialStylesCss);
    if (Object.keys(parsedVars).length === 0) return;

    setStyles(prev => {
      const next = JSON.parse(JSON.stringify(prev)); // Deep copy
      let changed = false;

      Object.keys(next).forEach(cat => {
        Object.keys(next[cat]).forEach(key => {
          const varName = next[cat][key].varName;
          if (parsedVars[varName] !== undefined) {
            let rawValue = parsedVars[varName].trim();

            // Check if it ends with unit (px, rem, em, %)
            const unitMatch = rawValue.match(/^([\d.-]+)(px|rem|em|%|)$/);
            if (unitMatch && next[cat][key].type === 'number') {
              next[cat][key].value = unitMatch[1];
              next[cat][key].unit = unitMatch[2];
            } else {
              next[cat][key].value = rawValue;
            }
            changed = true;
          }
        });
      });

      // Fallback for --btn-bg if not explicitly set in CSS
      if (!parsedVars['--btn-bg']) {
        const primaryColor = parsedVars['--primary'] || initialPrimary;
        if (primaryColor) {
          next.Buttons.bg.value = primaryColor;
          changed = true;
        }
      }
      // Fallback for --btn-text if not explicitly set in CSS
      if (!parsedVars['--btn-text']) {
        next.Buttons.text.value = '#ffffff';
        changed = true;
      }
      // Fallback for --subheading-color if not explicitly set in CSS
      if (!parsedVars['--subheading-color']) {
        const secondaryColor = parsedVars['--secondary'] || initialSecondary;
        if (secondaryColor) {
          next.Subheading.color.value = secondaryColor;
          changed = true;
        }
      }

      return changed ? next : prev;
    });
  }, [initialStylesCss]);

  // Sync initial colors from the project settings
  useEffect(() => {
    setStyles(prev => {
      const newStyles = { ...prev };
      let changed = false;

      // Prefer scraped websiteProfile.colors over direct primaryColor/secondaryColor
      const resolvedPrimary = initialWebsiteColors?.primary || initialPrimary;
      const resolvedSecondary = initialWebsiteColors?.secondary || initialSecondary;
      const resolvedAccent = initialWebsiteColors?.accent;

      if (resolvedPrimary && newStyles.Colors.primary.value !== resolvedPrimary) {
        newStyles.Colors.primary = { ...newStyles.Colors.primary, value: resolvedPrimary };
        if (!initialStylesCss) {
          newStyles.Buttons.bg = { ...newStyles.Buttons.bg, value: resolvedPrimary };
        }
        prevColorsRef.current.primary = resolvedPrimary;
        changed = true;
      }
      if (resolvedSecondary && newStyles.Colors.secondary.value !== resolvedSecondary) {
        newStyles.Colors.secondary = { ...newStyles.Colors.secondary, value: resolvedSecondary };
        if (!initialStylesCss) {
          newStyles.Subheading.color = { ...newStyles.Subheading.color, value: resolvedSecondary };
        }
        prevColorsRef.current.secondary = resolvedSecondary;
        changed = true;
      }

      // Apply scraped per-component theme values (header/nav/buttons/footer)
      if (initialTheme?.buttons) {
        if (initialTheme.buttons.primaryBg && !initialStylesCss) {
          newStyles.Buttons.bg = { ...newStyles.Buttons.bg, value: initialTheme.buttons.primaryBg };
          changed = true;
        }
        if (initialTheme.buttons.primaryText && !initialStylesCss) {
          newStyles.Buttons.text = { ...newStyles.Buttons.text, value: initialTheme.buttons.primaryText };
          changed = true;
        }
      }

      // Apply scraped font values
      if (initialWebsiteFonts) {
        const bodyFont = initialWebsiteFonts.bodyFont || initialWebsiteFonts.primaryFont;
        const headingFont = initialWebsiteFonts.headingFont;
        if (bodyFont && !initialStylesCss) {
          newStyles.Body.fontFamily = { ...newStyles.Body.fontFamily, value: bodyFont };
          changed = true;
        }
        if (headingFont && !initialStylesCss) {
          newStyles.Heading.fontFamily = { ...newStyles.Heading.fontFamily, value: headingFont };
          newStyles.Subheading.fontFamily = { ...newStyles.Subheading.fontFamily, value: headingFont };
          changed = true;
        }
        if (initialWebsiteFonts.bodyFontSize && !initialStylesCss) {
          const sz = parseFloat(initialWebsiteFonts.bodyFontSize);
          if (!isNaN(sz)) {
            newStyles.Body.fontSize = { ...newStyles.Body.fontSize, value: String(sz) };
            changed = true;
          }
        }
      }

      return changed ? newStyles : prev;
    });
  }, [initialPrimary, initialSecondary, initialWebsiteColors, initialTheme, initialWebsiteFonts, initialStylesCss]);

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

        // Only run the heavy CSS replacement if the new value is a valid 7 or 9 character hex code.
        // This prevents intermediate typing states (like "#" or "#ff") from corrupting the stylesheet.
        if (!val || (val.length !== 7 && val.length !== 9) || !val.startsWith('#')) {
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
        const canvasDoc = editor?.Canvas?.getDocument ? editor.Canvas.getDocument() : null;
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
    const primaryHex = currentStyles.Colors.primary.value || '#fa0000';
    const secondaryHex = currentStyles.Colors.secondary.value || '#d1d1d1';

    const hexToRgbStr = (hex: string): string => {
      const cleaned = hex.replace('#', '');
      const r = parseInt(cleaned.substring(0, 2), 16) || 0;
      const g = parseInt(cleaned.substring(2, 4), 16) || 0;
      const b = parseInt(cleaned.substring(4, 6), 16) || 0;
      return `${r}, ${g}, ${b}`;
    };

    const primaryRgb = hexToRgbStr(primaryHex);
    const secondaryRgb = hexToRgbStr(secondaryHex);

    let css = ':root, body {\n';
    Object.values(currentStyles).forEach(category => {
      Object.values(category).forEach(prop => {
        if (prop.varName === '--body-bg' && (prop.value === '#ffffff00' || prop.value === 'transparent')) {
          return;
        }
        css += `  ${prop.varName}: ${prop.value}${prop.unit || ''} !important;\n`;
      });
    });
    css += `  --primary-rgb: ${primaryRgb} !important;\n`;
    css += `  --secondary-rgb: ${secondaryRgb} !important;\n`;
    css += '}\n\n';

    css += 'input::placeholder, textarea::placeholder { color: #94a3b8 !important; opacity: 0.6; }\n';

    css += `
body {
  background-color: var(--body-bg, inherit);
  color: var(--body-text);
  font-family: var(--body-font);
  font-size: var(--body-size);
  line-height: var(--body-line-height);
}

h1, h2, .headline, .heading {
  color: var(--heading-color);
  font-family: var(--heading-font);
}

h1, .headline, .heading {
  font-size: var(--heading-size);
  line-height: var(--heading-line-height);
}

h3, h4, h5, h6, .subheading, .subtitle {
  color: var(--subheading-color);
  font-family: var(--subheading-font);
}

.subheading, .subtitle {
  font-size: var(--subheading-size);
  line-height: var(--subheading-line-height);
}

.material-symbols-outlined {
  font-family: 'Material Symbols Outlined' !important;
}
.material-icons, .material-icons-outlined {
  font-family: 'Material Icons' !important;
}

a:where(:not(.logo):not(.btn):not([class*="btn-"]):not([class*="-btn-"]):not(.cta-button)) {
  color: var(--primary);
  transition: color 0.3s ease;
}
a:where(:not(.logo):not(.btn):not([class*="btn-"]):not([class*="-btn-"]):not(.cta-button)):hover {
  color: var(--secondary);
}

button, .btn, [class*="btn-"] {
  border-radius: var(--btn-radius);
}

.btn-primary, .btn-yellow, .btn-green, .btn-signup, .btn-search, .btn-view-all, .btn-book, .btn-quote, .btn-submit, .btn-final, .btn-theme, .btn-blue, .btn-cta-1, .p3-btn-primary, .btn-hero, .btn-about, .v2-btn-primary, .v2-btn, .hc4-btn-primary, .hc4-btn-secondary, .hc4-overlap-btn, .hc4-subscribe-btn, button {
  background-color: var(--btn-bg);
  color: var(--btn-text);
  transition: all 0.3s ease;
}

.btn-primary:hover, .btn-yellow:hover, .btn-green:hover, .btn-signup:hover, .btn-search:hover, .btn-view-all:hover, .btn-book:hover, .btn-quote:hover, .btn-submit:hover, .btn-final:hover, .btn-theme:hover, .btn-blue:hover, .btn-cta-1:hover, .p3-btn-primary:hover, .btn-hero:hover, .btn-about:hover, .v2-btn-primary:hover, .v2-btn:hover, .hc4-btn-primary:hover, .hc4-btn-secondary:hover, .hc4-overlap-btn:hover, .hc4-subscribe-btn:hover, button:hover {
  background-color: var(--secondary) !important;
  color: var(--btn-text) !important;
}

form, .form-container, .form {
  background-color: var(--form-bg);
}

input, select, textarea, .input-field {
  background-color: var(--input-bg);
  color: var(--input-text);
}
`;
    return css;
  };

  useEffect(() => {
    if (!editor || !editor.Canvas || typeof editor.Canvas.getDocument !== 'function') return;

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

      // Find the GrapesJS dynamic styles tag (it contains user's style manager manual edits)
      const gjsStyleTag = canvasDoc.querySelector('style[data-gjs="styles"]');
      if (gjsStyleTag && gjsStyleTag.parentNode) {
        // Insert global-theme-styles BEFORE GrapesJS dynamic stylesheet so user's manual class/ID changes override global styles
        gjsStyleTag.parentNode.insertBefore(styleTag, gjsStyleTag);
      } else {
        canvasDoc.head.appendChild(styleTag);
      }
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

  // Emit full theme snapshot whenever any style changes
  useEffect(() => {
    if (!onThemeChange) return;
    onThemeChange({
      colors: {
        primary: styles.Colors.primary.value,
        secondary: styles.Colors.secondary.value,
        accent: styles.Colors.secondary.value, // treat secondary as accent fallback
      },
      theme: {
        header: {
          background: initialTheme?.header?.background || styles.Colors.primary.value,
          text: initialTheme?.header?.text || styles.Heading.color.value,
        },
        navigation: {
          background: initialTheme?.navigation?.background || styles.Colors.primary.value,
          text: initialTheme?.navigation?.text || '#ffffff',
          active: initialTheme?.navigation?.active || styles.Colors.secondary.value,
        },
        buttons: {
          primaryBg: styles.Buttons.bg.value,
          primaryText: styles.Buttons.text.value,
          secondaryBg: initialTheme?.buttons?.secondaryBg || styles.Colors.secondary.value,
          secondaryText: initialTheme?.buttons?.secondaryText || '#ffffff',
        },
        footer: {
          background: initialTheme?.footer?.background || '#1f2937',
          text: initialTheme?.footer?.text || '#ffffff',
        },
      },
      fonts: {
        primaryFont: styles.Body.fontFamily.value,
        headingFont: styles.Heading.fontFamily.value,
        bodyFont: styles.Body.fontFamily.value,
        bodyFontSize: `${styles.Body.fontSize.value}${styles.Body.fontSize.unit || 'rem'}`,
      },
    });
  }, [styles, onThemeChange, initialTheme]);

  return (
    <div className="w-full flex-shrink-0 flex flex-col bg-[#fff] text-sm h-full font-sans select-none overflow-y-auto custom-scroll" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {Object.entries(styles).map(([category, properties]) => {
        if (['Heading', 'Subheading', 'Buttons', 'Forms'].includes(category)) return null;
        return (
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
                {Object.entries(properties)
                  .filter(([key, prop]) => prop.label !== 'Font Size' && prop.label !== 'Line Height')
                  .map(([key, prop]) => (
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
                        <div className="flex items-center w-full min-w-[160px] p-0.5">
                          <VisualFontPicker
                            value={prop.value}
                            onChange={(val) => handleUpdate(category, key, val)}
                            editor={editor}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default GlobalStylesPanel;
