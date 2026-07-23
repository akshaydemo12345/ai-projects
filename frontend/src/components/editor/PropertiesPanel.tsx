import { useState } from 'react';
import type { Block, PageMeta } from '@/types/editor';

interface PropertiesPanelProps {
  selected: Block | null;
  meta: PageMeta;
  onUpdate: (id: string, content: Record<string, any>) => void;
  onMetaUpdate: (meta: PageMeta) => void;
}

const label = (txt: string) => (
  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#6b7280', marginBottom: 5, textTransform: 'uppercase', letterSpacing: 0.5 }}>{txt}</label>
);

const input = (value: string, onChange: (v: string) => void, placeholder = '') => (
  <input
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    style={{ width: '100%', border: '1px solid #e5e7eb', borderRadius: 7, padding: '8px 10px', fontSize: 13, color: '#111827', outline: 'none', boxSizing: 'border-box', marginBottom: 14, fontFamily: 'inherit' }}
  />
);

const textarea = (value: string, onChange: (v: string) => void, rows = 3) => (
  <textarea
    value={value}
    onChange={(e) => onChange(e.target.value)}
    rows={rows}
    style={{ width: '100%', border: '1px solid #e5e7eb', borderRadius: 7, padding: '8px 10px', fontSize: 13, color: '#111827', outline: 'none', boxSizing: 'border-box', marginBottom: 14, fontFamily: 'inherit', resize: 'vertical' }}
  />
);

// ─── Block-specific property editors ──────────────────────────────────

const NavbarProps = ({ c, set }: { c: any; set: (v: any) => void }) => (
  <>
    {label('Logo Text')}
    {input(c.logo ?? '', (v) => set({ ...c, logo: v }))}
    {label('Nav Links (comma separated)')}
    {input((c.links ?? []).join(', '), (v) => set({ ...c, links: v.split(',').map((s: string) => s.trim()) }))}
    {label('CTA Button Text')}
    {input(c.cta ?? '', (v) => set({ ...c, cta: v }))}
  </>
);

const HeroProps = ({ c, set }: { c: any; set: (v: any) => void }) => (
  <>
    {label('Badge Text')}
    {input(c.badge ?? '', (v) => set({ ...c, badge: v }))}
    {label('Heading')}
    {textarea(c.heading ?? '', (v) => set({ ...c, heading: v }), 2)}
    {label('Subtext')}
    {textarea(c.subtext ?? '', (v) => set({ ...c, subtext: v }), 3)}
    {label('Trust Points (one per line)')}
    {textarea((c.trust ?? []).join('\n'), (v) => set({ ...c, trust: v.split('\n').filter(Boolean) }), 3)}
    {label('Form Title')}
    {input(c.formTitle ?? '', (v) => set({ ...c, formTitle: v }))}
    {label('Form Button Text')}
    {input(c.formButton ?? '', (v) => set({ ...c, formButton: v }))}
  </>
);

const StatsProps = ({ c, set }: { c: any; set: (v: any) => void }) => (
  <>
    {(c.stats ?? []).map((s: any, i: number) => (
      <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
        <div>
          {label(`Stat ${i + 1} Value`)}
          {input(s.value, (v) => { const stats = [...c.stats]; stats[i] = { ...s, value: v }; set({ ...c, stats }); })}
        </div>
        <div>
          {label(`Label`)}
          {input(s.label, (v) => { const stats = [...c.stats]; stats[i] = { ...s, label: v }; set({ ...c, stats }); })}
        </div>
      </div>
    ))}
  </>
);

const HeadingSubtextProps = ({ c, set }: { c: any; set: (v: any) => void }) => (
  <>
    {label('Section Heading')}
    {textarea(c.heading ?? '', (v) => set({ ...c, heading: v }), 2)}
    {label('Subtext')}
    {textarea(c.subtext ?? '', (v) => set({ ...c, subtext: v }), 2)}
  </>
);

const CTAProps = ({ c, set }: { c: any; set: (v: any) => void }) => (
  <>
    {label('Heading')}
    {textarea(c.heading ?? '', (v) => set({ ...c, heading: v }), 2)}
    {label('Subtext')}
    {textarea(c.subtext ?? '', (v) => set({ ...c, subtext: v }), 2)}
    {label('Primary CTA Text')}
    {input(c.cta ?? '', (v) => set({ ...c, cta: v }))}
    {label('Secondary CTA Text')}
    {input(c.secondary ?? '', (v) => set({ ...c, secondary: v }))}
  </>
);

const TextBlockProps = ({ c, set }: { c: any; set: (v: any) => void }) => (
  <>
    {label('Content')}
    {textarea(c.text ?? '', (v) => set({ ...c, text: v }), 6)}
    {label('Alignment')}
    <select value={c.align ?? 'left'} onChange={(e) => set({ ...c, align: e.target.value })} style={{ width: '100%', border: '1px solid #e5e7eb', borderRadius: 7, padding: '8px 10px', fontSize: 13, marginBottom: 14, outline: 'none' }}>
      <option value="left">Left</option>
      <option value="center">Center</option>
      <option value="right">Right</option>
    </select>
  </>
);

const ImageProps = ({ c, set }: { c: any; set: (v: any) => void }) => (
  <>
    {label('Image URL')}
    {input(c.src ?? '', (v) => set({ ...c, src: v }), 'https://...')}
    {label('Alt Text')}
    {input(c.alt ?? '', (v) => set({ ...c, alt: v }))}
    {label('Caption')}
    {input(c.caption ?? '', (v) => set({ ...c, caption: v }))}
    <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#374151', cursor: 'pointer', marginBottom: 14 }}>
      <input type="checkbox" checked={!!c.rounded} onChange={(e) => set({ ...c, rounded: e.target.checked })} />
      Rounded corners
    </label>
  </>
);

const ButtonProps = ({ c, set }: { c: any; set: (v: any) => void }) => (
  <>
    {label('Button Text')}
    {input(c.text ?? '', (v) => set({ ...c, text: v }))}
    {label('Link URL')}
    {input(c.href ?? '#', (v) => set({ ...c, href: v }))}
    {label('Style')}
    <select value={c.style ?? 'primary'} onChange={(e) => set({ ...c, style: e.target.value })} style={{ width: '100%', border: '1px solid #e5e7eb', borderRadius: 7, padding: '8px 10px', fontSize: 13, marginBottom: 14, outline: 'none' }}>
      <option value="primary">Primary (filled)</option>
      <option value="outline">Outline</option>
      <option value="ghost">Ghost</option>
    </select>
  </>
);

const FooterProps = ({ c, set }: { c: any; set: (v: any) => void }) => (
  <>
    {label('Logo / Brand Name')}
    {input(c.logo ?? '', (v) => set({ ...c, logo: v }))}
    {label('Tagline')}
    {textarea(c.tagline ?? '', (v) => set({ ...c, tagline: v }), 2)}
    {label('Copyright Text')}
    {input(c.copyright ?? '', (v) => set({ ...c, copyright: v }))}
  </>
);

const HeadingBlockProps = ({ c, set }: { c: any; set: (v: any) => void }) => (
  <>
    {label('Heading')}
    {input(c.heading ?? '', (v) => set({ ...c, heading: v }))}
    {label('Subtext')}
    {textarea(c.subtext ?? '', (v) => set({ ...c, subtext: v }), 2)}
  </>
);

const LeadFormProps = ({ c, set }: { c: any; set: (v: any) => void }) => (
  <>
    {label('Section Heading')}
    {textarea(c.heading ?? '', (v) => set({ ...c, heading: v }), 2)}
    {label('Subtext')}
    {textarea(c.subtext ?? '', (v) => set({ ...c, subtext: v }), 2)}
    {label('Submit Button Text')}
    {input(c.button ?? '', (v) => set({ ...c, button: v }))}
    {label('Disclaimer Text')}
    {textarea(c.disclaimer ?? '', (v) => set({ ...c, disclaimer: v }), 2)}
  </>
);

const BLOCK_PROP_EDITORS: Record<string, React.FC<{ c: any; set: (v: any) => void }>> = {
  navbar: NavbarProps,
  hero: HeroProps,
  stats: StatsProps,
  features: HeadingSubtextProps,
  'how-it-works': HeadingSubtextProps,
  testimonials: HeadingSubtextProps,
  pricing: HeadingSubtextProps,
  faq: HeadingSubtextProps,
  'lead-form': LeadFormProps,
  'cta-banner': CTAProps,
  'text-block': TextBlockProps,
  'heading-block': HeadingBlockProps,
  'image-block': ImageProps,
  'button-block': ButtonProps,
  footer: FooterProps,
};

// ─── SEO Panel ────────────────────────────────────────────────────────
const SEOPanel = ({ meta, onUpdate }: { meta: PageMeta; onUpdate: (m: PageMeta) => void }) => (
  <div>
    {label('Page Title')}
    {input(meta.title, (v) => onUpdate({ ...meta, title: v }), 'Page Title | Brand')}
    <div style={{ fontSize: 11, color: '#9ca3af', marginTop: -10, marginBottom: 14 }}>{meta.title.length}/60 chars recommended</div>
    {label('Meta Description')}
    {textarea(meta.description, (v) => onUpdate({ ...meta, description: v }), 3)}
    <div style={{ fontSize: 11, color: '#9ca3af', marginTop: -10, marginBottom: 14 }}>{meta.description.length}/160 chars recommended</div>
    {label('Keywords')}
    {input(meta.keywords, (v) => onUpdate({ ...meta, keywords: v }), 'keyword1, keyword2, ...')}
    {label('OG Title')}
    {input(meta.ogTitle, (v) => onUpdate({ ...meta, ogTitle: v }))}
    {label('OG Description')}
    {textarea(meta.ogDesc, (v) => onUpdate({ ...meta, ogDesc: v }), 2)}
    {label('Canonical URL')}
    {input(meta.canonical, (v) => onUpdate({ ...meta, canonical: v }), 'https://yourdomain.com/page')}
    {label('Robots')}
    <select value={meta.robots} onChange={(e) => onUpdate({ ...meta, robots: e.target.value })} style={{ width: '100%', border: '1px solid #e5e7eb', borderRadius: 7, padding: '8px 10px', fontSize: 13, marginBottom: 14, outline: 'none' }}>
      <option value="index, follow">index, follow (default)</option>
      <option value="noindex, follow">noindex, follow</option>
      <option value="index, nofollow">index, nofollow</option>
      <option value="noindex, nofollow">noindex, nofollow</option>
    </select>
  </div>
);

// ─── Main PropertiesPanel ─────────────────────────────────────────────
const PropertiesPanel = ({ selected, meta, onUpdate, onMetaUpdate }: PropertiesPanelProps) => {
  const [tab, setTab] = useState<'properties' | 'seo'>('properties');

  const tabStyle = (active: boolean): React.CSSProperties => ({
    flex: 1, padding: '10px 0', fontSize: 12, fontWeight: 600, border: 'none',
    borderBottom: active ? '2px solid #6366f1' : '2px solid transparent',
    background: 'none', color: active ? '#6366f1' : '#6b7280', cursor: 'pointer',
    transition: 'all .15s',
  });

  const PropEditor = selected ? BLOCK_PROP_EDITORS[selected.type] : null;

  return (
    <div style={{
      width: 270, flexShrink: 0, background: '#ffffff', borderLeft: '1px solid #e5e7eb',
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>
      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb' }}>
        <button style={tabStyle(tab === 'properties')} onClick={() => setTab('properties')}>Properties</button>
        <button style={tabStyle(tab === 'seo')} onClick={() => setTab('seo')}>SEO</button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
        {tab === 'properties' && (
          <>
            {!selected && (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: '#9ca3af' }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>👈</div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>Select a block</div>
                <div style={{ fontSize: 12, marginTop: 6 }}>Click any block on the canvas to edit its properties</div>
              </div>
            )}
            {selected && (
              <>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#6366f1', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 16, padding: '6px 10px', background: '#f0f0ff', borderRadius: 6 }}>
                  {selected.type.replace(/-/g, ' ')}
                </div>
                {PropEditor ? (
                  <PropEditor c={selected.content} set={(v) => onUpdate(selected.id, v)} />
                ) : (
                  <div style={{ fontSize: 12, color: '#9ca3af', textAlign: 'center', padding: '20px 0' }}>
                    No editable properties for this block type.
                  </div>
                )}
              </>
            )}
          </>
        )}
        {tab === 'seo' && <SEOPanel meta={meta} onUpdate={onMetaUpdate} />}
      </div>
    </div>
  );
};

export default PropertiesPanel;
