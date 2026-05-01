import React, { useState, useEffect, useRef } from 'react';
import { thankYouApi, ThankYouLayout, ThankYouConfig } from '@/services/api';
import { toast } from 'sonner';

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
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('layout');
  const [customTemplate, setCustomTemplate] = useState('');
  const [customCss, setCustomCss] = useState('');
  const [previewHtml, setPreviewHtml] = useState<string>('');
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    loadData();
  }, [pageId]);

  const isInitialMount = useRef(true);

  // Sync canvas with config changes (debounced)
  useEffect(() => {
    if (loading) return;

    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const timer = setTimeout(async () => {
      try {
        console.log('🔄 Debounced update: Syncing Thank You config to canvas...');
        const html = await thankYouApi.preview(config);
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
      setCustomTemplate(configData.config?.customTemplate || '');
      setCustomCss(configData.config?.customCss || '');
      setLayouts(layoutsData);

      if (industry && (!configData.config?.layout || configData.config.layout === 'default')) {
        const industryLayout = layoutsData.find(l => l.industry === industry);
        if (industryLayout) {
          handleLayoutChange(industryLayout.id);
        } else {
          handleLayoutChange('default');
        }
      } else if (configData.config?.layout) {
        handleLayoutChange(configData.config.layout);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const saveConfig = { ...config };
      if (customTemplate) {
        saveConfig.customTemplate = customTemplate;
      }
      if (customCss) {
        saveConfig.customCss = customCss;
      }
      await thankYouApi.updateConfig(pageId, saveConfig);
      onSave?.();
      toast.success('Thank You settings saved!', {
        description: 'Your changes have been applied successfully.'
      });
    } catch (error) {
      console.error('Error saving config:', error);
      toast.error('Error saving settings', {
        description: 'There was a problem saving your configuration.'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleLayoutChange = (layoutId: string) => {
    const selectedLayout = layouts.find(l => l.id === layoutId);
    if (selectedLayout) {
      const newConfig = {
        ...config,
        layout: layoutId,
        content: {
          heading: selectedLayout.defaultContent.heading,
          subheading: selectedLayout.defaultContent.subheading,
          ctaText: selectedLayout.defaultContent.ctaText,
          ctaUrl: selectedLayout.defaultContent.ctaUrl,
          phoneNumber: selectedLayout.defaultContent.phoneNumber,
          offerText: selectedLayout.defaultContent.offerText,
          customMessage: selectedLayout.defaultContent.customMessage,
        },
        branding: {
          primaryColor: selectedLayout.theme.primaryColor,
          secondaryColor: selectedLayout.theme.secondaryColor,
          logoUrl: config.branding.logoUrl,
        },
      };

      setConfig(newConfig);
    }
  };

  const handlePreview = async () => {
    try {
      const html = await thankYouApi.preview({
        layout: config.layout,
        content: config.content,
        branding: config.branding,
      });
      setPreviewHtml(html);
      setShowPreview(true);
    } catch (error) {
      console.error('Error previewing:', error);
      toast.error('Error loading preview', {
        description: 'Failed to generate the thank you page preview.'
      });
    }
  };

  const getLayoutIcon = (layoutId: string) => {
    const icons: Record<string, JSX.Element> = {
      roofing: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z"></path></svg>,
      real_estate: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>,
      healthcare: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>,
      legal: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>,
      education: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5-10-5"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>,
      home_services: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>,
      finance: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>,
      default: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>,
    };
    return icons[layoutId] || icons.default;
  };

  if (loading) {
    return <div style={{ padding: 20, color: '#94a3b8' }}>Loading...</div>;
  }

  return (
    <>
      <style>{`
        .thank-you-panel::-webkit-scrollbar {
          width: 4px;
        }
        .thank-you-panel::-webkit-scrollbar-track {
          background: transparent;
        }
        .thank-you-panel::-webkit-scrollbar-thumb {
          background: #2a2a3e;
          border-radius: 10px;
        }
        .thank-you-panel::-webkit-scrollbar-thumb:hover {
          background: #7c3aed;
        }
      `}</style>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#12121e' }}>
        <div style={{ padding: '24px 20px', borderBottom: '1px solid #1e1e2d', background: '#0a0a14' }}>
          <h3 style={{ color: '#fff', fontSize: 16, fontWeight: 800, margin: '0 0 6px 0', letterSpacing: '-0.02em' }}>
            Select template
          </h3>

        </div>

        <div className="thank-you-panel" style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 14 }}>
            {layouts.map((layout) => (
              <div
                key={layout.id}
                onClick={() => handleLayoutChange(layout.id)}
                style={{
                  border: `2.5px solid ${config.layout === layout.id ? '#7c3aed' : '#1e1e2d'}`,
                  borderRadius: 16,
                  padding: '18px',
                  cursor: 'pointer',
                  background: config.layout === layout.id ? '#1a1a2e' : '#0f0f1a',
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  boxShadow: config.layout === layout.id ? '0 10px 25px -5px rgba(124, 58, 237, 0.25)' : 'none',
                  transform: config.layout === layout.id ? 'translateY(-2px)' : 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 14,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: config.layout === layout.id
                        ? 'linear-gradient(135deg, #7c3aed, #6366f1)'
                        : '#1e1e2d',
                      color: '#fff',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <div style={{ width: 22, height: 22 }}>
                      {getLayoutIcon(layout.id)}
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      color: config.layout === layout.id ? '#fff' : '#94a3b8',
                      fontSize: 15,
                      fontWeight: 700,
                      marginBottom: 2
                    }}>
                      {layout.name}
                    </div>
                    <div style={{ color: '#475569', fontSize: 12, fontWeight: 500 }}>
                      Professional Layout
                    </div>
                  </div>
                  {config.layout === layout.id && (
                    <div style={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      background: '#7c3aed',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      boxShadow: '0 0 15px rgba(124, 58, 237, 0.4)'
                    }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
