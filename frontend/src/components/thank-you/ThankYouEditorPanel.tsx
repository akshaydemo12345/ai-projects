import React, { useState, useEffect, useRef } from 'react';
import { thankYouApi, ThankYouLayout, ThankYouConfig } from '@/services/api';
import { toast } from 'sonner';
import { Search, CheckCircle2, Loader2 } from 'lucide-react';

interface ThankYouEditorPanelProps {
  pageId: string;
  industry?: string;
  onSave?: () => void;
  onSelect?: (html: string, css?: string) => void;
}

export const ThankYouEditorPanel = ({ pageId, industry, onSave, onSelect }: ThankYouEditorPanelProps) => {
  const [config, setConfig] = useState<ThankYouConfig>({
    layout: 'default',
    content: {},
    tracking: {},
    branding: {},
  });
  const [layouts, setLayouts] = useState<ThankYouLayout[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const isInitialMount = useRef(true);

  useEffect(() => {
    loadData();
  }, [pageId]);

  // Sync canvas with config changes (debounced)
  useEffect(() => {
    if (loading) return;
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const html = await thankYouApi.preview({ ...config, pageId });
        onSelect?.(html);
      } catch (error) {
        console.error('Error syncing preview:', error);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [config, loading]);

  const loadData = async () => {
    try {
      const [configData, layoutsData] = await Promise.all([
        thankYouApi.getConfig(pageId),
        thankYouApi.getLayouts()
      ]);
      setConfig(configData.config || {
        layout: 'default',
        content: {},
        tracking: {},
        branding: {},
      });
      setLayouts(layoutsData);

      if (industry && (!configData.config?.layout || configData.config.layout === 'default')) {
        const industryLayout = layoutsData.find(l => l.industry === industry);
        if (industryLayout) {
          handleLayoutChange(industryLayout.id, layoutsData);
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLayoutChange = async (layoutId: string, layoutsList = layouts) => {
    const selectedLayout = layoutsList.find(l => l.id === layoutId);
    if (selectedLayout) {
      const newConfig = {
        ...config,
        layout: layoutId,
        content: { ...selectedLayout.defaultContent },
        branding: {
          primaryColor: selectedLayout.theme.primaryColor,
          secondaryColor: selectedLayout.theme.secondaryColor,
          logoUrl: config.branding.logoUrl,
        },
      };

      setConfig(newConfig);

      const previewPromise = (async () => {
        await thankYouApi.updateConfig(pageId, newConfig);
        const html = await thankYouApi.preview({ ...newConfig, pageId });
        onSelect?.(html);
        return html;
      })();

      toast.promise(previewPromise, {
        loading: `Applying ${selectedLayout.name}...`,
        success: `${selectedLayout.name} ready!`,
        error: 'Failed to load preview',
      });
    }
  };

  const filteredLayouts = layouts.filter(l => 
    l.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    l.industry.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-[#12121e] text-slate-500">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <span className="text-sm font-medium">Loading templates...</span>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-[#0a0a14] overflow-hidden">
      {/* Search Header */}
      <div className="p-4 border-b border-white/5 bg-[#0f0f1a]">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-violet-500 transition-colors" />
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-[#12121e] border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder:text-slate-600 outline-none focus:border-violet-500/50 transition-all"
          />
        </div>
      </div>

      {/* Template List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {filteredLayouts.map((layout) => (
          <div
            key={layout.id}
            onClick={() => handleLayoutChange(layout.id)}
            className={`group relative p-4 rounded-2xl border-2 transition-all cursor-pointer ${
              config.layout === layout.id 
                ? 'border-violet-500 bg-violet-500/5' 
                : 'border-white/5 bg-[#12121e] hover:border-white/10'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                config.layout === layout.id ? 'bg-violet-500 text-white' : 'bg-[#1a1a2e] text-slate-500'
              }`}>
                {config.layout === layout.id ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <div className="h-5 w-5 opacity-50 uppercase font-black text-[10px]">TY</div>
                )}
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-white mb-0.5">{layout.name}</h4>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{layout.industry}</p>
              </div>
            </div>
            
            {/* Hover Indicator */}
            {config.layout !== layout.id && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="text-[10px] font-black text-violet-500 uppercase tracking-widest">Select</div>
              </div>
            )}
          </div>
        ))}

        {filteredLayouts.length === 0 && (
          <div className="text-center py-10">
            <p className="text-sm text-slate-600">No templates found</p>
          </div>
        )}
      </div>
    </div>
  );
};
