import React, { useState, useEffect, useRef } from 'react';
import { thankYouApi, ThankYouLayout, ThankYouConfig } from '@/services/api';

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

      if (!configData.config?.layout && industry) {
        const industryLayout = layoutsData.find(l => l.industry === industry);
        if (industryLayout) {
          setConfig(prev => ({ ...prev, layout: industryLayout.id }));
        }
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
      alert('Thank You settings saved!');
    } catch (error) {
      console.error('Error saving config:', error);
      alert('Error saving settings');
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
      alert('Error loading preview');
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
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#12121e' }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #1e1e2d' }}>
        <h3 style={{ color: '#fff', fontSize: 14, fontWeight: 700, margin: 0 }}>Thank You Page</h3>
        <p style={{ color: '#64748b', fontSize: 11, margin: '4px 0 0 0' }}>
          Configure your Thank You page layout and content
        </p>
      </div>

      <div style={{ display: 'flex', borderBottom: '1px solid #1e1e2d', background: '#0a0a14' }}>
        {['layout', 'content', 'tracking', 'branding', 'custom'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              flex: 1,
              padding: '12px 8px',
              background: activeTab === tab ? '#1a1a2e' : 'transparent',
              border: 'none',
              color: activeTab === tab ? '#fff' : '#64748b',
              fontSize: 11,
              fontWeight: activeTab === tab ? 600 : 500,
              textTransform: 'uppercase',
              cursor: 'pointer',
              borderBottom: activeTab === tab ? '2px solid #7c3aed' : 'none',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
        {activeTab === 'layout' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
            {layouts.map((layout) => (
              <div
                key={layout.id}
                onClick={() => handleLayoutChange(layout.id)}
                style={{
                  border: `2px solid ${config.layout === layout.id ? layout.theme.primaryColor : '#2a2a3e'}`,
                  borderRadius: 12,
                  padding: 16,
                  cursor: 'pointer',
                  background: config.layout === layout.id ? `${layout.theme.primaryColor}15` : '#1a1a2e',
                  transition: 'all 0.2s',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {config.layout === layout.id && (
                  <div style={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    background: layout.theme.primaryColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontSize: 12,
                    fontWeight: 700,
                  }}>
                    ✓
                  </div>
                )}
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 12,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: `linear-gradient(135deg, ${layout.theme.primaryColor}, ${layout.theme.secondaryColor})`,
                    marginBottom: 12,
                    color: '#fff',
                  }}
                >
                  {getLayoutIcon(layout.id)}
                </div>
                <div style={{ color: '#fff', fontSize: 13, fontWeight: 700, marginBottom: 4 }}>{layout.name}</div>
                <div style={{ color: '#64748b', fontSize: 10, lineHeight: 1.4 }}>{layout.description}</div>
                <div style={{
                  marginTop: 12,
                  display: 'flex',
                  gap: 6,
                  flexWrap: 'wrap'
                }}>
                  {layout.features.slice(0, 2).map((feature) => (
                    <span key={feature} style={{
                      background: `${layout.theme.primaryColor}20`,
                      color: layout.theme.primaryColor,
                      padding: '2px 8px',
                      borderRadius: 4,
                      fontSize: 9,
                      fontWeight: 600,
                      textTransform: 'uppercase',
                    }}>
                      {feature.replace('-', ' ')}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'content' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', color: '#cbd5e1', fontSize: 11, fontWeight: 600, marginBottom: 8 }}>
                Heading
              </label>
              <input
                type="text"
                value={config.content.heading || ''}
                onChange={(e) => setConfig({ ...config, content: { ...config.content, heading: e.target.value } })}
                placeholder="Thank You!"
                style={{
                  width: '100%',
                  background: '#0a0a14',
                  border: '1px solid #2a2a3e',
                  color: '#fff',
                  borderRadius: 8,
                  padding: '10px 12px',
                  fontSize: 13,
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', color: '#cbd5e1', fontSize: 11, fontWeight: 600, marginBottom: 8 }}>
                Subheading
              </label>
              <textarea
                value={config.content.subheading || ''}
                onChange={(e) => setConfig({ ...config, content: { ...config.content, subheading: e.target.value } })}
                placeholder="We have received your request..."
                rows={3}
                style={{
                  width: '100%',
                  background: '#0a0a14',
                  border: '1px solid #2a2a3e',
                  color: '#fff',
                  borderRadius: 8,
                  padding: '10px 12px',
                  fontSize: 13,
                  resize: 'vertical',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', color: '#cbd5e1', fontSize: 11, fontWeight: 600, marginBottom: 8 }}>
                CTA Button Text
              </label>
              <input
                type="text"
                value={config.content.ctaText || ''}
                onChange={(e) => setConfig({ ...config, content: { ...config.content, ctaText: e.target.value } })}
                placeholder="Return to Website"
                style={{
                  width: '100%',
                  background: '#0a0a14',
                  border: '1px solid #2a2a3e',
                  color: '#fff',
                  borderRadius: 8,
                  padding: '10px 12px',
                  fontSize: 13,
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', color: '#cbd5e1', fontSize: 11, fontWeight: 600, marginBottom: 8 }}>
                CTA Button URL
              </label>
              <input
                type="text"
                value={config.content.ctaUrl || ''}
                onChange={(e) => setConfig({ ...config, content: { ...config.content, ctaUrl: e.target.value } })}
                placeholder="https://yourwebsite.com"
                style={{
                  width: '100%',
                  background: '#0a0a14',
                  border: '1px solid #2a2a3e',
                  color: '#fff',
                  borderRadius: 8,
                  padding: '10px 12px',
                  fontSize: 13,
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', color: '#cbd5e1', fontSize: 11, fontWeight: 600, marginBottom: 8 }}>
                Phone Number
              </label>
              <input
                type="text"
                value={config.content.phoneNumber || ''}
                onChange={(e) => setConfig({ ...config, content: { ...config.content, phoneNumber: e.target.value } })}
                placeholder="+1 (555) 123-4567"
                style={{
                  width: '100%',
                  background: '#0a0a14',
                  border: '1px solid #2a2a3e',
                  color: '#fff',
                  borderRadius: 8,
                  padding: '10px 12px',
                  fontSize: 13,
                }}
              />
            </div>
          </div>
        )}

        {activeTab === 'tracking' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', color: '#cbd5e1', fontSize: 11, fontWeight: 600, marginBottom: 8 }}>
                GA4 Measurement ID
              </label>
              <input
                type="text"
                value={config.tracking.ga4MeasurementId || ''}
                onChange={(e) => setConfig({ ...config, tracking: { ...config.tracking, ga4MeasurementId: e.target.value } })}
                placeholder="G-XXXXXXXXXX"
                style={{
                  width: '100%',
                  background: '#0a0a14',
                  border: '1px solid #2a2a3e',
                  color: '#fff',
                  borderRadius: 8,
                  padding: '10px 12px',
                  fontSize: 13,
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', color: '#cbd5e1', fontSize: 11, fontWeight: 600, marginBottom: 8 }}>
                Google Ads Conversion ID
              </label>
              <input
                type="text"
                value={config.tracking.googleAdsConversionId || ''}
                onChange={(e) => setConfig({ ...config, tracking: { ...config.tracking, googleAdsConversionId: e.target.value } })}
                placeholder="AW-XXXXXXXXXX"
                style={{
                  width: '100%',
                  background: '#0a0a14',
                  border: '1px solid #2a2a3e',
                  color: '#fff',
                  borderRadius: 8,
                  padding: '10px 12px',
                  fontSize: 13,
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', color: '#cbd5e1', fontSize: 11, fontWeight: 600, marginBottom: 8 }}>
                Meta Pixel ID
              </label>
              <input
                type="text"
                value={config.tracking.metaPixelId || ''}
                onChange={(e) => setConfig({ ...config, tracking: { ...config.tracking, metaPixelId: e.target.value } })}
                placeholder="XXXXXXXXXX"
                style={{
                  width: '100%',
                  background: '#0a0a14',
                  border: '1px solid #2a2a3e',
                  color: '#fff',
                  borderRadius: 8,
                  padding: '10px 12px',
                  fontSize: 13,
                }}
              />
            </div>
          </div>
        )}

        {activeTab === 'branding' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', color: '#cbd5e1', fontSize: 11, fontWeight: 600, marginBottom: 8 }}>
                Logo URL
              </label>
              <input
                type="text"
                value={config.branding.logoUrl || ''}
                onChange={(e) => setConfig({ ...config, branding: { ...config.branding, logoUrl: e.target.value } })}
                placeholder="https://yourwebsite.com/logo.png"
                style={{
                  width: '100%',
                  background: '#0a0a14',
                  border: '1px solid #2a2a3e',
                  color: '#fff',
                  borderRadius: 8,
                  padding: '10px 12px',
                  fontSize: 13,
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', color: '#cbd5e1', fontSize: 11, fontWeight: 600, marginBottom: 8 }}>
                Primary Color
              </label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  type="color"
                  value={config.branding.primaryColor || '#7c3aed'}
                  onChange={(e) => setConfig({ ...config, branding: { ...config.branding, primaryColor: e.target.value } })}
                  style={{ width: 50, height: 40, border: '1px solid #2a2a3e', borderRadius: 8, cursor: 'pointer' }}
                />
                <input
                  type="text"
                  value={config.branding.primaryColor || '#7c3aed'}
                  onChange={(e) => setConfig({ ...config, branding: { ...config.branding, primaryColor: e.target.value } })}
                  placeholder="#7c3aed"
                  style={{
                    flex: 1,
                    background: '#0a0a14',
                    border: '1px solid #2a2a3e',
                    color: '#fff',
                    borderRadius: 8,
                    padding: '10px 12px',
                    fontSize: 13,
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', color: '#cbd5e1', fontSize: 11, fontWeight: 600, marginBottom: 8 }}>
                Secondary Color
              </label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  type="color"
                  value={config.branding.secondaryColor || '#6366f1'}
                  onChange={(e) => setConfig({ ...config, branding: { ...config.branding, secondaryColor: e.target.value } })}
                  style={{ width: 50, height: 40, border: '1px solid #2a2a3e', borderRadius: 8, cursor: 'pointer' }}
                />
                <input
                  type="text"
                  value={config.branding.secondaryColor || '#6366f1'}
                  onChange={(e) => setConfig({ ...config, branding: { ...config.branding, secondaryColor: e.target.value } })}
                  placeholder="#6366f1"
                  style={{
                    flex: 1,
                    background: '#0a0a14',
                    border: '1px solid #2a2a3e',
                    color: '#fff',
                    borderRadius: 8,
                    padding: '10px 12px',
                    fontSize: 13,
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'custom' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', color: '#cbd5e1', fontSize: 11, fontWeight: 600, marginBottom: 8 }}>
                Custom HTML Template
              </label>
              <textarea
                value={customTemplate}
                onChange={(e) => setCustomTemplate(e.target.value)}
                placeholder="Enter custom HTML template (leave empty to use selected layout)"
                rows={15}
                style={{
                  width: '100%',
                  background: '#0a0a14',
                  border: '1px solid #2a2a3e',
                  color: '#fff',
                  borderRadius: 8,
                  padding: '10px 12px',
                  fontSize: 12,
                  fontFamily: 'monospace',
                  resize: 'vertical',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', color: '#cbd5e1', fontSize: 11, fontWeight: 600, marginBottom: 8 }}>
                Custom CSS
              </label>
              <textarea
                value={customCss}
                onChange={(e) => setCustomCss(e.target.value)}
                placeholder="Enter custom CSS (leave empty to use default styles)"
                rows={10}
                style={{
                  width: '100%',
                  background: '#0a0a14',
                  border: '1px solid #2a2a3e',
                  color: '#fff',
                  borderRadius: 8,
                  padding: '10px 12px',
                  fontSize: 12,
                  fontFamily: 'monospace',
                  resize: 'vertical',
                }}
              />
            </div>

            <div style={{ padding: '12px', background: '#1a1a2e', borderRadius: 8, border: '1px solid #2a2a3e' }}>
              <p style={{ color: '#94a3b8', fontSize: 11, margin: 0 }}>
                <strong style={{ color: '#fff' }}>Available Variables:</strong> {'{heading}'}, {'{subheading}'}, {'{ctaText}'}, {'{ctaUrl}'}, {'{phoneNumber}'}, {'{primaryColor}'}, {'{secondaryColor}'}, {'{businessName}'}
              </p>
            </div>
          </div>
        )}

        {activeTab === 'branding' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', color: '#cbd5e1', fontSize: 11, fontWeight: 600, marginBottom: 8 }}>
                Logo URL
              </label>
              <input
                type="text"
                value={config.branding.logoUrl || ''}
                onChange={(e) => setConfig({ ...config, branding: { ...config.branding, logoUrl: e.target.value } })}
                placeholder="https://yourwebsite.com/logo.png"
                style={{
                  width: '100%',
                  background: '#0a0a14',
                  border: '1px solid #2a2a3e',
                  color: '#fff',
                  borderRadius: 8,
                  padding: '10px 12px',
                  fontSize: 13,
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', color: '#cbd5e1', fontSize: 11, fontWeight: 600, marginBottom: 8 }}>
                Primary Color
              </label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  type="color"
                  value={config.branding.primaryColor || '#7c3aed'}
                  onChange={(e) => setConfig({ ...config, branding: { ...config.branding, primaryColor: e.target.value } })}
                  style={{ width: 50, height: 40, border: '1px solid #2a2a3e', borderRadius: 8, cursor: 'pointer' }}
                />
                <input
                  type="text"
                  value={config.branding.primaryColor || '#7c3aed'}
                  onChange={(e) => setConfig({ ...config, branding: { ...config.branding, primaryColor: e.target.value } })}
                  placeholder="#7c3aed"
                  style={{
                    flex: 1,
                    background: '#0a0a14',
                    border: '1px solid #2a2a3e',
                    color: '#fff',
                    borderRadius: 8,
                    padding: '10px 12px',
                    fontSize: 13,
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', color: '#cbd5e1', fontSize: 11, fontWeight: 600, marginBottom: 8 }}>
                Secondary Color
              </label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  type="color"
                  value={config.branding.secondaryColor || '#6366f1'}
                  onChange={(e) => setConfig({ ...config, branding: { ...config.branding, secondaryColor: e.target.value } })}
                  style={{ width: 50, height: 40, border: '1px solid #2a2a3e', borderRadius: 8, cursor: 'pointer' }}
                />
                <input
                  type="text"
                  value={config.branding.secondaryColor || '#6366f1'}
                  onChange={(e) => setConfig({ ...config, branding: { ...config.branding, secondaryColor: e.target.value } })}
                  placeholder="#6366f1"
                  style={{
                    flex: 1,
                    background: '#0a0a14',
                    border: '1px solid #2a2a3e',
                    color: '#fff',
                    borderRadius: 8,
                    padding: '10px 12px',
                    fontSize: 13,
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div style={{ padding: 16, borderTop: '1px solid #1e1e2d', display: 'flex', gap: 8, background: '#0a0a14' }}>
        <button
          onClick={handlePreview}
          style={{
            flex: 1,
            padding: '10px',
            background: '#252540',
            border: '1px solid #2a2a3e',
            color: '#94a3b8',
            borderRadius: 8,
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Preview
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            flex: 2,
            padding: '10px',
            background: saving ? '#4c1d95' : 'linear-gradient(135deg, #7c3aed, #6366f1)',
            border: 'none',
            color: '#fff',
            borderRadius: 8,
            fontSize: 12,
            fontWeight: 700,
            cursor: saving ? 'not-allowed' : 'pointer',
          }}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {showPreview && (
        <div
          onClick={() => setShowPreview(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: 800,
              maxHeight: '90vh',
              background: '#1a1a2e',
              borderRadius: 16,
              border: '1px solid #2a2a3e',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ padding: 16, borderBottom: '1px solid #2a2a3e', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: '#fff', fontWeight: 700 }}>Thank You Page Preview</span>
              <button onClick={() => setShowPreview(false)} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', fontSize: 18 }}>
                ✕
              </button>
            </div>
            <iframe srcDoc={previewHtml} style={{ flex: 1, border: 'none', width: '100%' }} title="Preview" />
          </div>
        </div>
      )}
    </div>
  );
};
