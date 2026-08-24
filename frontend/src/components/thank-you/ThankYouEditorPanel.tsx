import React, { useState, useEffect, useRef, useCallback } from 'react';
import { thankYouApi, ThankYouLayout, ThankYouConfig } from '@/services/api';
import { toast } from 'sonner';
import { Search, CheckCircle2, Loader2 } from 'lucide-react';

interface ThankYouEditorPanelProps {
  pageId: string;
  industry?: string;
  onSave?: () => void;
  onSelect?: (html: string, css?: string) => void;
  isCanvasEmpty?: boolean;
}

export const ThankYouEditorPanel = ({
  pageId,
  industry,
  onSave,
  onSelect,
  isCanvasEmpty
}: ThankYouEditorPanelProps) => {
  const [config, setConfig] = useState<ThankYouConfig>({
    layout: 'default',
    content: {},
    tracking: {},
    branding: {},
  });
  const [layouts, setLayouts] = useState<ThankYouLayout[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [applyingId, setApplyingId] = useState<string | null>(null);

  const isInitialMount = useRef(true);
  // Track selected layout id separately so UI updates instantly on click
  const [selectedId, setSelectedId] = useState<string>('default');

  useEffect(() => {
    // Immediate async fetch — no 600ms artificial delay
    loadData();
  }, [pageId]);

  // NOTE: Auto-sync on config change removed — handleLayoutChange directly calls onSelect
  // to avoid double canvas updates and race conditions.

  const loadData = async () => {
    try {
      const [configData, layoutsData] = await Promise.all([
        thankYouApi.getConfig(pageId),
        thankYouApi.getLayouts()
      ]);
      const savedConfig = configData.config || {
        layout: 'default',
        content: {},
        tracking: {},
        branding: {},
      };
      setConfig(savedConfig);
      const activeLayout = savedConfig.layout || 'default';
      setSelectedId(activeLayout);
      setLayouts(layoutsData);

      if (isCanvasEmpty) {
        handleLayoutChange(activeLayout, layoutsData);
      }

      // Pre-warm previews in background non-blocking queue for instant zero-lag switching
      setTimeout(() => {
        layoutsData.forEach((l: ThankYouLayout) => {
          thankYouApi.preview({
            layout: l.id,
            content: { ...l.defaultContent },
            branding: {
              primaryColor: l.theme.primaryColor,
              secondaryColor: l.theme.secondaryColor,
              logoUrl: savedConfig.branding?.logoUrl || '',
            },
            pageId
          }).catch(() => {});
        });
      }, 50);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLayoutChange = async (layoutId: string, layoutsList = layouts) => {
    const selectedLayout = layoutsList.find((l: ThankYouLayout) => l.id === layoutId);
    if (selectedLayout) {
      // ✅ Update UI selection instantly (0ms) — don't wait for API
      setSelectedId(layoutId);
      setApplyingId(layoutId);

      const newConfig = {
        ...config,
        layout: layoutId,
        content: { ...selectedLayout.defaultContent },
        branding: {
          primaryColor: selectedLayout.theme.primaryColor,
          secondaryColor: selectedLayout.theme.secondaryColor,
          logoUrl: config.branding.logoUrl || '',
        },
      };

      setConfig(newConfig);

      // Save config in background non-blocking task
      thankYouApi.updateConfig(pageId, newConfig).catch(err => console.error('Background config update error:', err));

      try {
        const html = await thankYouApi.preview({ ...newConfig, pageId });
        onSelect?.(html);
        onSave?.(); // Automatically trigger save so the HTML/CSS persists
        toast.success(`${selectedLayout.name} applied!`);
      } catch (error) {
        console.error('Error applying layout:', error);
        toast.error('Failed to load template');
      } finally {
        setApplyingId(null);
      }
    }
  };

  const filteredLayouts = layouts.filter((l: ThankYouLayout) =>
    l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.industry.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-[#fff] text-slate-500">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <span className="text-sm font-medium">Loading templates...</span>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-[#fff] overflow-hidden">
      {/* Search Header */}
      <div className="p-4 border-b border-slate-200 bg-[#fff]">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-violet-500 transition-colors" />
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-[#f9fafb] border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-violet-500/50 transition-all"
          />
        </div>
      </div>

      {/* Template List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {filteredLayouts.map((layout: ThankYouLayout) => {
          const isSelected = selectedId === layout.id;
          const isApplying = applyingId === layout.id;
          return (
            <div
              key={layout.id}
              onClick={() => !isApplying && handleLayoutChange(layout.id)}
              className={`group relative p-4 rounded-2xl border-2 transition-all cursor-pointer ${isSelected
                  ? 'border-violet-500 bg-violet-50'
                  : 'border-slate-200 bg-[#f9fafb] hover:border-slate-300'
                }`}
            >
              <div className="flex items-center gap-4">
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${isSelected ? 'bg-violet-500 text-white' : 'bg-[#e5e7eb] text-slate-500'
                  }`}>
                  {isApplying ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : isSelected ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <div className="h-5 w-5 opacity-50 uppercase font-black text-[10px]">TY</div>
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-slate-900 mb-0.5">{layout.name}</h4>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{layout.industry}</p>
                </div>
              </div>

              {/* Hover Indicator */}
              {!isSelected && !isApplying && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="text-[10px] font-black text-violet-500 uppercase tracking-widest">Select</div>
                </div>
              )}
            </div>
          );
        })}

        {filteredLayouts.length === 0 && (
          <div className="text-center py-10">
            <p className="text-sm text-slate-500">No templates found</p>
          </div>
        )}
      </div>
    </div>
  );
};