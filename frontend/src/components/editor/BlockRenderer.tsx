import { useState } from 'react';
import type { Block } from '@/types/editor';

const P = '#2563eb';
const DARK = '#0f172a';
const MUTED = '#64748b';
const LITE = '#f8fafc';

// ─── Navbar ───────────────────────────────────────────────────────────
const NavbarBlock = ({ c }: { c: any }) => (
  <nav style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 50 }}>
    <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span style={{ fontSize: 22, fontWeight: 800, color: DARK }}>{c.logo}</span>
      <div style={{ display: 'flex', gap: 28 }}>
        {c.links?.map((l: string) => <a key={l} href="#" style={{ fontSize: 14, color: MUTED, textDecoration: 'none', fontWeight: 500 }}>{l}</a>)}
      </div>
      <button style={{ background: P, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 22px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>{c.cta}</button>
    </div>
  </nav>
);

// ─── Hero ────────────────────────────────────────────────────────────
const HeroBlock = ({ c }: { c: any }) => (
  <section style={{ background: 'linear-gradient(135deg,#0f172a 0%,#1e3a5f 100%)', padding: '80px 0' }}>
    <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: '1fr 460px', gap: 60, alignItems: 'center' }}>
      <div>
        <span style={{ display: 'inline-block', background: 'rgba(59,130,246,0.15)', color: '#93c5fd', padding: '6px 16px', borderRadius: 100, fontSize: 13, fontWeight: 600, marginBottom: 24 }}>{c.badge}</span>
        <h1 style={{ fontSize: 44, fontWeight: 800, color: '#fff', lineHeight: 1.15, margin: '0 0 20px' }}>{c.heading}</h1>
        <p style={{ fontSize: 17, color: 'rgba(255,255,255,.72)', lineHeight: 1.7, margin: '0 0 32px' }}>{c.subtext}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {c.trust?.map((t: string) => (
            <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'rgba(255,255,255,.75)', fontSize: 14 }}>
              <span style={{ color: '#22c55e', fontWeight: 700 }}>✓</span> {t}
            </div>
          ))}
        </div>
      </div>
      <div style={{ background: '#fff', borderRadius: 16, padding: 40, boxShadow: '0 25px 60px rgba(0,0,0,.3)' }}>
        <h3 style={{ fontSize: 20, fontWeight: 700, color: DARK, margin: '0 0 24px' }}>{c.formTitle}</h3>
        {c.formFields?.map((f: string) => (
          <input key={f} placeholder={f} readOnly style={{ display: 'block', width: '100%', border: '1px solid #e2e8f0', borderRadius: 8, padding: '11px 14px', fontSize: 14, marginBottom: 12, boxSizing: 'border-box', fontFamily: 'inherit', outline: 'none', color: DARK, background: '#fff' }} />
        ))}
        <button style={{ width: '100%', background: P, color: '#fff', border: 'none', borderRadius: 8, padding: 15, fontSize: 15, fontWeight: 700, cursor: 'pointer', marginTop: 6 }}>{c.formButton}</button>
        <p style={{ fontSize: 11, color: '#94a3b8', textAlign: 'center', margin: '12px 0 0' }}>{c.formDisclaimer}</p>
      </div>
    </div>
  </section>
);

// ─── Stats ───────────────────────────────────────────────────────────
const StatsBlock = ({ c }: { c: any }) => (
  <section style={{ background: P, padding: '52px 0' }}>
    <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 24 }}>
      {c.stats?.map((s: any) => (
        <div key={s.label} style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 44, fontWeight: 800, color: '#fff', lineHeight: 1 }}>{s.value}</div>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,.75)', marginTop: 8, fontWeight: 500 }}>{s.label}</div>
        </div>
      ))}
    </div>
  </section>
);

// ─── Features ─────────────────────────────────────────────────────────
const FeaturesBlock = ({ c }: { c: any }) => (
  <section style={{ background: LITE, padding: '80px 0' }}>
    <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: 56 }}>
        <h2 style={{ fontSize: 36, fontWeight: 800, color: DARK, margin: '0 0 14px' }}>{c.heading}</h2>
        <p style={{ fontSize: 17, color: MUTED, margin: 0 }}>{c.subtext}</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
        {c.features?.map((f: any) => (
          <div key={f.title} style={{ background: '#fff', borderRadius: 12, padding: 28, border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: 32, marginBottom: 16 }}>{f.icon}</div>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: DARK, margin: '0 0 10px' }}>{f.title}</h3>
            <p style={{ fontSize: 14, color: MUTED, margin: 0, lineHeight: 1.65 }}>{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ─── How It Works ─────────────────────────────────────────────────────
const HowItWorksBlock = ({ c }: { c: any }) => (
  <section style={{ background: '#fff', padding: '80px 0' }}>
    <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: 56 }}>
        <h2 style={{ fontSize: 36, fontWeight: 800, color: DARK, margin: '0 0 14px' }}>{c.heading}</h2>
        <p style={{ fontSize: 17, color: MUTED, margin: 0 }}>{c.subtext}</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 24 }}>
        {c.steps?.map((s: any) => (
          <div key={s.num} style={{ textAlign: 'center', padding: '0 16px' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: P, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 800, margin: '0 auto 20px' }}>{s.num}</div>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: DARK, margin: '0 0 10px' }}>{s.title}</h3>
            <p style={{ fontSize: 13, color: MUTED, margin: 0, lineHeight: 1.65 }}>{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ─── Testimonials ─────────────────────────────────────────────────────
const TestimonialsBlock = ({ c }: { c: any }) => (
  <section style={{ background: LITE, padding: '80px 0' }}>
    <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: 56 }}>
        <h2 style={{ fontSize: 36, fontWeight: 800, color: DARK, margin: '0 0 14px' }}>{c.heading}</h2>
        <p style={{ fontSize: 17, color: MUTED, margin: 0 }}>{c.subtext}</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
        {c.testimonials?.map((t: any) => (
          <div key={t.name} style={{ background: '#fff', borderRadius: 14, padding: 32, border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,.06)' }}>
            <div style={{ color: '#f59e0b', fontSize: 18, marginBottom: 16 }}>{'★'.repeat(t.stars)}</div>
            <p style={{ fontSize: 15, color: DARK, lineHeight: 1.7, margin: '0 0 24px', fontStyle: 'italic' }}>"{t.text}"</p>
            <div style={{ fontWeight: 700, color: DARK, fontSize: 14 }}>{t.name}</div>
            <div style={{ fontSize: 12, color: MUTED }}>{t.title}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ─── Pricing ──────────────────────────────────────────────────────────
const PricingBlock = ({ c }: { c: any }) => (
  <section style={{ background: '#fff', padding: '80px 0' }}>
    <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: 56 }}>
        <h2 style={{ fontSize: 36, fontWeight: 800, color: DARK, margin: '0 0 14px' }}>{c.heading}</h2>
        <p style={{ fontSize: 17, color: MUTED, margin: 0 }}>{c.subtext}</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
        {c.plans?.map((plan: any) => (
          <div key={plan.name} style={{ borderRadius: 14, padding: 36, border: plan.highlighted ? `2px solid ${P}` : '1px solid #e2e8f0', background: plan.highlighted ? `linear-gradient(135deg,${P},#1d4ed8)` : '#fff', position: 'relative' }}>
            {plan.highlighted && <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: '#f59e0b', color: '#fff', fontSize: 11, fontWeight: 700, padding: '4px 16px', borderRadius: 100 }}>MOST POPULAR</div>}
            <div style={{ fontSize: 18, fontWeight: 700, color: plan.highlighted ? '#fff' : DARK, marginBottom: 6 }}>{plan.name}</div>
            <div style={{ fontSize: 42, fontWeight: 800, color: plan.highlighted ? '#fff' : P, lineHeight: 1 }}>{plan.price}<span style={{ fontSize: 14, fontWeight: 500, color: plan.highlighted ? 'rgba(255,255,255,.7)' : MUTED }}>{plan.period}</span></div>
            <p style={{ fontSize: 13, color: plan.highlighted ? 'rgba(255,255,255,.75)' : MUTED, margin: '12px 0 24px' }}>{plan.desc}</p>
            <div style={{ marginBottom: 28 }}>
              {plan.features?.map((f: string) => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: plan.highlighted ? '#fff' : DARK, padding: '5px 0' }}>
                  <span style={{ color: plan.highlighted ? '#86efac' : '#22c55e', fontWeight: 700 }}>✓</span> {f}
                </div>
              ))}
            </div>
            <button style={{ width: '100%', background: plan.highlighted ? '#fff' : P, color: plan.highlighted ? P : '#fff', border: 'none', borderRadius: 8, padding: '13px 0', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>{plan.cta}</button>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ─── FAQ ──────────────────────────────────────────────────────────────
const FAQBlock = ({ c }: { c: any }) => {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section style={{ background: LITE, padding: '80px 0' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, color: DARK, margin: '0 0 14px' }}>{c.heading}</h2>
          <p style={{ fontSize: 17, color: MUTED, margin: 0 }}>{c.subtext}</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {c.faqs?.map((faq: any, i: number) => (
            <div key={i} style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
              <button onClick={() => setOpen(open === i ? null : i)} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                <span style={{ fontWeight: 600, fontSize: 15, color: DARK }}>{faq.q}</span>
                <span style={{ fontSize: 20, color: MUTED, transition: 'transform .2s', transform: open === i ? 'rotate(45deg)' : 'none' }}>+</span>
              </button>
              {open === i && <div style={{ padding: '0 24px 20px', fontSize: 14, color: MUTED, lineHeight: 1.7 }}>{faq.a}</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── Lead Form ────────────────────────────────────────────────────────
const LeadFormBlock = ({ c }: { c: any }) => (
  <section style={{ background: '#fff', padding: '80px 0' }}>
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '0 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <h2 style={{ fontSize: 34, fontWeight: 800, color: DARK, margin: '0 0 12px' }}>{c.heading}</h2>
        <p style={{ fontSize: 16, color: MUTED, margin: 0 }}>{c.subtext}</p>
      </div>
      <div style={{ background: LITE, borderRadius: 16, padding: 40, border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {c.fields?.map((f: any) => {
            const shared = { width: '100%', border: '1px solid #e2e8f0', borderRadius: 8, padding: '11px 14px', fontSize: 14, fontFamily: 'inherit', outline: 'none', background: '#fff', color: DARK, boxSizing: 'border-box' as const };
            if (f.type === 'textarea') return (
              <div key={f.label} style={{ gridColumn: '1/-1' }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: DARK, display: 'block', marginBottom: 6 }}>{f.label}{f.required ? ' *' : ''}</label>
                <textarea readOnly rows={4} placeholder={f.label} style={{ ...shared, resize: 'vertical' }} />
              </div>
            );
            if (f.type === 'select') return (
              <div key={f.label}>
                <label style={{ fontSize: 12, fontWeight: 600, color: DARK, display: 'block', marginBottom: 6 }}>{f.label}{f.required ? ' *' : ''}</label>
                <select style={shared}>
                  <option value="">Select...</option>
                  {f.options?.map((o: string) => <option key={o}>{o}</option>)}
                </select>
              </div>
            );
            return (
              <div key={f.label}>
                <label style={{ fontSize: 12, fontWeight: 600, color: DARK, display: 'block', marginBottom: 6 }}>{f.label}{f.required ? ' *' : ''}</label>
                <input readOnly placeholder={f.label} style={shared} />
              </div>
            );
          })}
        </div>
        <button style={{ width: '100%', background: P, color: '#fff', border: 'none', borderRadius: 8, padding: 16, fontSize: 15, fontWeight: 700, cursor: 'pointer', marginTop: 20 }}>{c.button}</button>
        <p style={{ fontSize: 11, color: '#94a3b8', textAlign: 'center', margin: '12px 0 0' }}>{c.disclaimer}</p>
      </div>
    </div>
  </section>
);

// ─── CTA Banner ───────────────────────────────────────────────────────
const CTABannerBlock = ({ c }: { c: any }) => (
  <section style={{ background: `linear-gradient(135deg,${P},#1d4ed8)`, padding: '72px 0' }}>
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
      <h2 style={{ fontSize: 38, fontWeight: 800, color: '#fff', margin: '0 0 16px' }}>{c.heading}</h2>
      <p style={{ fontSize: 18, color: 'rgba(255,255,255,.8)', margin: '0 0 36px' }}>{c.subtext}</p>
      <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
        <button style={{ background: '#fff', color: P, border: 'none', borderRadius: 8, padding: '14px 32px', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>{c.cta}</button>
        <button style={{ background: 'transparent', color: '#fff', border: '2px solid rgba(255,255,255,.5)', borderRadius: 8, padding: '14px 32px', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>{c.secondary}</button>
      </div>
    </div>
  </section>
);

// ─── Text Block ───────────────────────────────────────────────────────
const TextBlockComp = ({ c }: { c: any }) => (
  <section style={{ background: '#fff', padding: '48px 0' }}>
    <div style={{ maxWidth: 780, margin: '0 auto', padding: '0 24px', textAlign: (c.align || 'left') as any }}>
      <p style={{ fontSize: 16, color: DARK, lineHeight: 1.75, margin: 0 }}>{c.text}</p>
    </div>
  </section>
);

// ─── Heading Block ────────────────────────────────────────────────────
const HeadingBlock = ({ c }: { c: any }) => (
  <section style={{ background: '#fff', padding: '48px 0 24px' }}>
    <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 24px', textAlign: (c.align || 'center') as any }}>
      <h2 style={{ fontSize: 36, fontWeight: 800, color: DARK, margin: '0 0 12px' }}>{c.heading}</h2>
      {c.subtext && <p style={{ fontSize: 17, color: MUTED, margin: 0 }}>{c.subtext}</p>}
    </div>
  </section>
);

// ─── Image Block ──────────────────────────────────────────────────────
const ImageBlockComp = ({ c }: { c: any }) => (
  <section style={{ background: '#fff', padding: '40px 0' }}>
    <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 24px' }}>
      <img src={c.src} alt={c.alt} style={{ width: '100%', maxHeight: 480, objectFit: 'cover', borderRadius: c.rounded ? 16 : 0, display: 'block' }} />
      {c.caption && <p style={{ textAlign: 'center', fontSize: 13, color: MUTED, marginTop: 10 }}>{c.caption}</p>}
    </div>
  </section>
);

// ─── Two Column ───────────────────────────────────────────────────────
const TwoColBlock = ({ c }: { c: any }) => (
  <section style={{ background: '#fff', padding: '60px 0' }}>
    <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>
      <div style={{ fontSize: 15, color: DARK, lineHeight: 1.75 }}>{c.left}</div>
      <div style={{ fontSize: 15, color: DARK, lineHeight: 1.75 }}>{c.right}</div>
    </div>
  </section>
);

// ─── Button Block ─────────────────────────────────────────────────────
const ButtonBlockComp = ({ c }: { c: any }) => (
  <section style={{ background: '#fff', padding: '32px 0' }}>
    <div style={{ textAlign: (c.align || 'center') as any }}>
      <button style={{ background: c.style === 'outline' ? 'transparent' : P, color: c.style === 'outline' ? P : '#fff', border: c.style === 'outline' ? `2px solid ${P}` : 'none', borderRadius: 8, padding: '14px 36px', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>{c.text}</button>
    </div>
  </section>
);

// ─── Divider ──────────────────────────────────────────────────────────
const DividerComp = ({ c }: { c: any }) => (
  <div style={{ padding: `${c.margin ?? 40}px 24px` }}>
    <hr style={{ border: 'none', borderTop: `1px solid ${c.color ?? '#e2e8f0'}`, margin: 0 }} />
  </div>
);

// ─── Spacer ───────────────────────────────────────────────────────────
const SpacerComp = ({ c }: { c: any }) => <div style={{ height: c.height ?? 60 }} />;

// ─── Footer ───────────────────────────────────────────────────────────
const FooterBlock = ({ c }: { c: any }) => (
  <footer style={{ background: DARK, padding: '60px 0 32px', color: 'rgba(255,255,255,.7)' }}>
    <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 24px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr repeat(3,1fr)', gap: 40, marginBottom: 48 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 12 }}>{c.logo}</div>
          <p style={{ fontSize: 14, lineHeight: 1.65, margin: '0 0 24px' }}>{c.tagline}</p>
          <div style={{ display: 'flex', gap: 12 }}>
            {c.social?.map((s: string) => (
              <a key={s} href="#" style={{ fontSize: 12, color: 'rgba(255,255,255,.5)', textDecoration: 'none', background: 'rgba(255,255,255,.08)', padding: '6px 12px', borderRadius: 6 }}>{s}</a>
            ))}
          </div>
        </div>
        {c.columns?.map((col: any) => (
          <div key={col.title}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#fff', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 16 }}>{col.title}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {col.links?.map((l: string) => <a key={l} href="#" style={{ fontSize: 13, color: 'rgba(255,255,255,.55)', textDecoration: 'none' }}>{l}</a>)}
            </div>
          </div>
        ))}
      </div>
      <div style={{ borderTop: '1px solid rgba(255,255,255,.1)', paddingTop: 28, fontSize: 13, textAlign: 'center' }}>{c.copyright}</div>
    </div>
  </footer>
);

// ─── Main Renderer ────────────────────────────────────────────────────
export const renderBlock = (block: Block): React.ReactNode => {
  const c = block.content;
  switch (block.type) {
    case 'navbar': return <NavbarBlock c={c} />;
    case 'hero': return <HeroBlock c={c} />;
    case 'stats': return <StatsBlock c={c} />;
    case 'features': return <FeaturesBlock c={c} />;
    case 'how-it-works': return <HowItWorksBlock c={c} />;
    case 'testimonials': return <TestimonialsBlock c={c} />;
    case 'pricing': return <PricingBlock c={c} />;
    case 'faq': return <FAQBlock c={c} />;
    case 'lead-form': return <LeadFormBlock c={c} />;
    case 'cta-banner': return <CTABannerBlock c={c} />;
    case 'text-block': return <TextBlockComp c={c} />;
    case 'heading-block': return <HeadingBlock c={c} />;
    case 'image-block': return <ImageBlockComp c={c} />;
    case 'two-col': return <TwoColBlock c={c} />;
    case 'button-block': return <ButtonBlockComp c={c} />;
    case 'divider': return <DividerComp c={c} />;
    case 'spacer': return <SpacerComp c={c} />;
    case 'footer': return <FooterBlock c={c} />;
    default: return null;
  }
};
