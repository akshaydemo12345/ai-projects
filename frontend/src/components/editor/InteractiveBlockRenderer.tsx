import { useState } from 'react';
import type { Block } from '@/types/editor';
import { getEmailConfig, sendEmailJS } from '@/lib/emailService';

// ─── Colours (same as BlockRenderer) ────────────────────────────────
const P = '#2563eb';
const DARK = '#0f172a';
const MUTED = '#64748b';
const LITE = '#f8fafc';

// ─── Shared form hook ────────────────────────────────────────────────
function useFormSubmit(formName: string) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errMsg, setErrMsg] = useState('');

  const set = (k: string, v: string) => setValues((p) => ({ ...p, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrMsg('');
    try {
      const cfg = getEmailConfig();
      if (cfg?.serviceId && cfg?.templateId && cfg?.publicKey) {
        await sendEmailJS(cfg, {
          form_name: formName,
          ...values,
          submitted_at: new Date().toLocaleString(),
        });
      }
      // Always show success (even in demo mode without EmailJS configured)
      setStatus('success');
    } catch (err: any) {
      setErrMsg('Failed to send — please try again.');
      setStatus('error');
    }
  };

  return { values, set, status, errMsg, submit };
}

// ─── Success Card ────────────────────────────────────────────────────
const SuccessCard = ({ dark = false }: { dark?: boolean }) => (
  <div style={{ textAlign: 'center', padding: '32px 24px', borderRadius: 12, background: dark ? 'rgba(255,255,255,.1)' : '#f0fdf4', border: dark ? '1px solid rgba(255,255,255,.2)' : '1px solid #bbf7d0' }}>
    <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
    <div style={{ fontSize: 18, fontWeight: 700, color: dark ? '#fff' : '#166534', marginBottom: 6 }}>Thank You!</div>
    <div style={{ fontSize: 14, color: dark ? 'rgba(255,255,255,.75)' : '#166534' }}>
      We've received your request and will be in touch shortly.
    </div>
  </div>
);

// ─── Shared input style ──────────────────────────────────────────────
const ins = (light = true): React.CSSProperties => ({
  display: 'block', width: '100%', border: '1px solid',
  borderColor: light ? '#e2e8f0' : 'rgba(255,255,255,.2)',
  borderRadius: 8, padding: '11px 14px', fontSize: 14,
  fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
  background: light ? '#fff' : 'rgba(255,255,255,.08)',
  color: light ? DARK : '#fff',
  marginBottom: 12,
});

const submitBtn = (label: string, loading: boolean): React.ReactNode => (
  <button
    type="submit"
    disabled={loading}
    style={{ width: '100%', background: loading ? '#93c5fd' : P, color: '#fff', border: 'none', borderRadius: 8, padding: '14px 0', fontSize: 15, fontWeight: 700, cursor: loading ? 'wait' : 'pointer', marginTop: 4, transition: 'background .2s' }}
  >
    {loading ? 'Sending…' : label}
  </button>
);

// ─── Interactive Navbar ───────────────────────────────────────────────
const INavbar = ({ c }: { c: any }) => (
  <nav style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 100 }}>
    <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span style={{ fontSize: 22, fontWeight: 800, color: DARK }}>{c.logo}</span>
      <div style={{ display: 'flex', gap: 28 }}>
        {c.links?.map((l: string) => <a key={l} href={`#${l.toLowerCase().replace(/\s+/g,'-')}`} style={{ fontSize: 14, color: MUTED, textDecoration: 'none', fontWeight: 500 }}>{l}</a>)}
      </div>
      <a href="#contact" style={{ background: P, color: '#fff', textDecoration: 'none', borderRadius: 8, padding: '10px 22px', fontSize: 14, fontWeight: 600 }}>{c.cta}</a>
    </div>
  </nav>
);

// ─── Interactive Hero ─────────────────────────────────────────────────
const IHero = ({ c }: { c: any }) => {
  const { values, set, status, errMsg, submit } = useFormSubmit('Hero Form');
  return (
    <section id="hero" style={{ background: 'linear-gradient(135deg,#0f172a 0%,#1e3a5f 100%)', padding: '80px 0' }}>
      <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: '1fr 460px', gap: 60, alignItems: 'center' }}>
        <div>
          <span style={{ display: 'inline-block', background: 'rgba(59,130,246,.15)', color: '#93c5fd', padding: '6px 16px', borderRadius: 100, fontSize: 13, fontWeight: 600, marginBottom: 24 }}>{c.badge}</span>
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
          {status === 'success' ? <SuccessCard /> : (
            <>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: DARK, margin: '0 0 24px' }}>{c.formTitle}</h3>
              <form onSubmit={submit}>
                {c.formFields?.map((f: string) => (
                  <input key={f} placeholder={f} required={f.toLowerCase().includes('email') || f.toLowerCase().includes('name')} type={f.toLowerCase().includes('email') ? 'email' : f.toLowerCase().includes('phone') ? 'tel' : 'text'} value={values[f] || ''} onChange={(e) => set(f, e.target.value)} style={ins()} />
                ))}
                {errMsg && <p style={{ color: '#ef4444', fontSize: 12, margin: '-6px 0 10px' }}>{errMsg}</p>}
                {submitBtn(c.formButton || 'Get Free Analysis', status === 'loading')}
                <p style={{ fontSize: 11, color: '#94a3b8', textAlign: 'center', margin: '12px 0 0' }}>{c.formDisclaimer}</p>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

// ─── Interactive Stats ────────────────────────────────────────────────
const IStats = ({ c }: { c: any }) => (
  <section id="stats" style={{ background: P, padding: '52px 0' }}>
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

// ─── Features, How It Works, Testimonials, Pricing (static, same as preview) ──
const IFeatures = ({ c }: { c: any }) => (
  <section id="features" style={{ background: LITE, padding: '80px 0' }}>
    <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: 56 }}>
        <h2 style={{ fontSize: 36, fontWeight: 800, color: DARK, margin: '0 0 14px' }}>{c.heading}</h2>
        <p style={{ fontSize: 17, color: MUTED }}>{c.subtext}</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
        {c.features?.map((f: any) => (
          <div key={f.title} style={{ background: '#fff', borderRadius: 12, padding: 28, border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: 32, marginBottom: 16 }}>{f.icon}</div>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: DARK, margin: '0 0 10px' }}>{f.title}</h3>
            <p style={{ fontSize: 14, color: MUTED, lineHeight: 1.65, margin: 0 }}>{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const IHowItWorks = ({ c }: { c: any }) => (
  <section id="how-it-works" style={{ background: '#fff', padding: '80px 0' }}>
    <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: 56 }}>
        <h2 style={{ fontSize: 36, fontWeight: 800, color: DARK, margin: '0 0 14px' }}>{c.heading}</h2>
        <p style={{ fontSize: 17, color: MUTED }}>{c.subtext}</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 24 }}>
        {c.steps?.map((s: any) => (
          <div key={s.num} style={{ textAlign: 'center', padding: '0 16px' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: P, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 800, margin: '0 auto 20px' }}>{s.num}</div>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: DARK, margin: '0 0 10px' }}>{s.title}</h3>
            <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.65, margin: 0 }}>{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const ITestimonials = ({ c }: { c: any }) => (
  <section id="testimonials" style={{ background: LITE, padding: '80px 0' }}>
    <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: 56 }}>
        <h2 style={{ fontSize: 36, fontWeight: 800, color: DARK, margin: '0 0 14px' }}>{c.heading}</h2>
        <p style={{ fontSize: 17, color: MUTED }}>{c.subtext}</p>
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

const IPricing = ({ c }: { c: any }) => (
  <section id="pricing" style={{ background: '#fff', padding: '80px 0' }}>
    <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: 56 }}>
        <h2 style={{ fontSize: 36, fontWeight: 800, color: DARK, margin: '0 0 14px' }}>{c.heading}</h2>
        <p style={{ fontSize: 17, color: MUTED }}>{c.subtext}</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
        {c.plans?.map((plan: any) => (
          <div key={plan.name} style={{ borderRadius: 14, padding: 36, border: plan.highlighted ? `2px solid ${P}` : '1px solid #e2e8f0', background: plan.highlighted ? `linear-gradient(135deg,${P},#1d4ed8)` : '#fff', position: 'relative' }}>
            {plan.highlighted && <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: '#f59e0b', color: '#fff', fontSize: 11, fontWeight: 700, padding: '4px 16px', borderRadius: 100 }}>MOST POPULAR</div>}
            <div style={{ fontSize: 18, fontWeight: 700, color: plan.highlighted ? '#fff' : DARK, marginBottom: 6 }}>{plan.name}</div>
            <div style={{ fontSize: 42, fontWeight: 800, color: plan.highlighted ? '#fff' : P, lineHeight: 1 }}>{plan.price}<span style={{ fontSize: 14, fontWeight: 400, color: plan.highlighted ? 'rgba(255,255,255,.7)' : MUTED }}>{plan.period}</span></div>
            <p style={{ fontSize: 13, color: plan.highlighted ? 'rgba(255,255,255,.75)' : MUTED, margin: '12px 0 24px' }}>{plan.desc}</p>
            <div style={{ marginBottom: 28 }}>
              {plan.features?.map((f: string) => (
                <div key={f} style={{ display: 'flex', gap: 8, fontSize: 13, color: plan.highlighted ? '#fff' : DARK, padding: '5px 0' }}><span style={{ color: plan.highlighted ? '#86efac' : '#22c55e' }}>✓</span>{f}</div>
              ))}
            </div>
            <a href="#contact" style={{ display: 'block', width: '100%', background: plan.highlighted ? '#fff' : P, color: plan.highlighted ? P : '#fff', border: 'none', borderRadius: 8, padding: '13px 0', fontWeight: 700, fontSize: 14, cursor: 'pointer', textAlign: 'center', textDecoration: 'none', boxSizing: 'border-box' }}>{plan.cta}</a>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ─── Interactive FAQ ──────────────────────────────────────────────────
const IFAQ = ({ c }: { c: any }) => {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section id="faq" style={{ background: LITE, padding: '80px 0' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, color: DARK, margin: '0 0 14px' }}>{c.heading}</h2>
          <p style={{ fontSize: 17, color: MUTED }}>{c.subtext}</p>
        </div>
        {c.faqs?.map((faq: any, i: number) => (
          <div key={i} style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden', marginBottom: 10 }}>
            <button onClick={() => setOpen(open === i ? null : i)} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
              <span style={{ fontWeight: 600, fontSize: 15, color: DARK }}>{faq.q}</span>
              <span style={{ fontSize: 20, color: MUTED, transition: 'transform .2s', transform: open === i ? 'rotate(45deg)' : 'none' }}>+</span>
            </button>
            {open === i && <div style={{ padding: '0 24px 20px', fontSize: 14, color: MUTED, lineHeight: 1.7 }}>{faq.a}</div>}
          </div>
        ))}
      </div>
    </section>
  );
};

// ─── Interactive Lead Form ────────────────────────────────────────────
const ILeadForm = ({ c }: { c: any }) => {
  const { values, set, status, errMsg, submit } = useFormSubmit('Lead Form');
  return (
    <section id="contact" style={{ background: '#fff', padding: '80px 0' }}>
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h2 style={{ fontSize: 34, fontWeight: 800, color: DARK, margin: '0 0 12px' }}>{c.heading}</h2>
          <p style={{ fontSize: 16, color: MUTED }}>{c.subtext}</p>
        </div>
        <div style={{ background: LITE, borderRadius: 16, padding: 40, border: '1px solid #e2e8f0' }}>
          {status === 'success' ? <SuccessCard /> : (
            <form onSubmit={submit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {c.fields?.map((f: any) => {
                  const s = ins();
                  if (f.type === 'textarea') return (
                    <div key={f.label} style={{ gridColumn: '1/-1' }}>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: DARK, marginBottom: 5 }}>{f.label}{f.required ? ' *' : ''}</label>
                      <textarea
                        required={f.required} rows={4} placeholder={f.label}
                        value={values[f.label] || ''}
                        onChange={(e) => set(f.label, e.target.value)}
                        style={{ ...s, resize: 'vertical' }}
                      />
                    </div>
                  );
                  if (f.type === 'select') return (
                    <div key={f.label}>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: DARK, marginBottom: 5 }}>{f.label}{f.required ? ' *' : ''}</label>
                      <select
                        required={f.required}
                        value={values[f.label] || ''}
                        onChange={(e) => set(f.label, e.target.value)}
                        style={s}
                      >
                        <option value="">Select…</option>
                        {f.options?.map((o: string) => <option key={o}>{o}</option>)}
                      </select>
                    </div>
                  );
                  return (
                    <div key={f.label}>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: DARK, marginBottom: 5 }}>{f.label}{f.required ? ' *' : ''}</label>
                      <input
                        type={f.type} required={f.required} placeholder={f.label}
                        value={values[f.label] || ''}
                        onChange={(e) => set(f.label, e.target.value)}
                        style={s}
                      />
                    </div>
                  );
                })}
              </div>
              {errMsg && <p style={{ color: '#ef4444', fontSize: 12, margin: '0 0 10px' }}>{errMsg}</p>}
              {submitBtn(c.button || 'Submit', status === 'loading')}
              <p style={{ fontSize: 11, color: '#94a3b8', textAlign: 'center', margin: '12px 0 0' }}>{c.disclaimer}</p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

// ─── Interactive CTA Banner ───────────────────────────────────────────
const ICTA = ({ c }: { c: any }) => (
  <section style={{ background: `linear-gradient(135deg,${P},#1d4ed8)`, padding: '72px 0' }}>
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
      <h2 style={{ fontSize: 38, fontWeight: 800, color: '#fff', margin: '0 0 16px' }}>{c.heading}</h2>
      <p style={{ fontSize: 18, color: 'rgba(255,255,255,.8)', margin: '0 0 36px' }}>{c.subtext}</p>
      <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
        <a href="#contact" style={{ background: '#fff', color: P, textDecoration: 'none', borderRadius: 8, padding: '14px 32px', fontSize: 15, fontWeight: 700 }}>{c.cta}</a>
        <a href="#features" style={{ background: 'transparent', color: '#fff', border: '2px solid rgba(255,255,255,.5)', textDecoration: 'none', borderRadius: 8, padding: '14px 32px', fontSize: 15, fontWeight: 600 }}>{c.secondary}</a>
      </div>
    </div>
  </section>
);

// ─── Text / Heading / Image / Two-Col / Button / Divider / Spacer / Footer ──
const IText = ({ c }: { c: any }) => (
  <section style={{ background: '#fff', padding: '48px 0' }}>
    <div style={{ maxWidth: 780, margin: '0 auto', padding: '0 24px', textAlign: (c.align || 'left') as any }}>
      <p style={{ fontSize: 16, color: DARK, lineHeight: 1.75, margin: 0 }}>{c.text}</p>
    </div>
  </section>
);
const IHeading = ({ c }: { c: any }) => (
  <section style={{ background: '#fff', padding: '48px 0 24px' }}>
    <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 24px', textAlign: (c.align || 'center') as any }}>
      <h2 style={{ fontSize: 36, fontWeight: 800, color: DARK, margin: '0 0 12px' }}>{c.heading}</h2>
      {c.subtext && <p style={{ fontSize: 17, color: MUTED, margin: 0 }}>{c.subtext}</p>}
    </div>
  </section>
);
const IImage = ({ c }: { c: any }) => (
  <section style={{ background: '#fff', padding: '40px 0' }}>
    <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 24px' }}>
      <img src={c.src} alt={c.alt} style={{ width: '100%', maxHeight: 480, objectFit: 'cover', borderRadius: c.rounded ? 16 : 0, display: 'block' }} />
      {c.caption && <p style={{ textAlign: 'center', fontSize: 13, color: MUTED, marginTop: 10 }}>{c.caption}</p>}
    </div>
  </section>
);
const ITwoCol = ({ c }: { c: any }) => (
  <section style={{ background: '#fff', padding: '60px 0' }}>
    <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>
      <div style={{ fontSize: 15, color: DARK, lineHeight: 1.75 }}>{c.left}</div>
      <div style={{ fontSize: 15, color: DARK, lineHeight: 1.75 }}>{c.right}</div>
    </div>
  </section>
);
const IButton = ({ c }: { c: any }) => (
  <section style={{ background: '#fff', padding: '32px 0' }}>
    <div style={{ textAlign: (c.align || 'center') as any }}>
      <a href={c.href || '#'} style={{ display: 'inline-block', background: c.style === 'outline' ? 'transparent' : P, color: c.style === 'outline' ? P : '#fff', border: c.style === 'outline' ? `2px solid ${P}` : 'none', borderRadius: 8, padding: '14px 36px', fontSize: 15, fontWeight: 700, textDecoration: 'none', cursor: 'pointer' }}>{c.text}</a>
    </div>
  </section>
);
const IDivider = ({ c }: { c: any }) => (
  <div style={{ padding: `${c.margin ?? 40}px 24px` }}>
    <hr style={{ border: 'none', borderTop: `1px solid ${c.color ?? '#e2e8f0'}`, margin: 0 }} />
  </div>
);
const ISpacer = ({ c }: { c: any }) => <div style={{ height: c.height ?? 60 }} />;
const IFooter = ({ c }: { c: any }) => (
  <footer style={{ background: DARK, padding: '60px 0 32px', color: 'rgba(255,255,255,.7)' }}>
    <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 24px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr repeat(3,1fr)', gap: 40, marginBottom: 48 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 12 }}>{c.logo}</div>
          <p style={{ fontSize: 14, lineHeight: 1.65, margin: '0 0 24px' }}>{c.tagline}</p>
          <div style={{ display: 'flex', gap: 10 }}>
            {c.social?.map((s: string) => <a key={s} href="#" style={{ fontSize: 12, color: 'rgba(255,255,255,.5)', textDecoration: 'none', background: 'rgba(255,255,255,.08)', padding: '6px 12px', borderRadius: 6 }}>{s}</a>)}
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

// ─── Main interactive renderer ────────────────────────────────────────
export const renderInteractiveBlock = (block: Block): React.ReactNode => {
  const c = block.content;
  switch (block.type) {
    case 'navbar': return <INavbar key={block.id} c={c} />;
    case 'hero': return <IHero key={block.id} c={c} />;
    case 'stats': return <IStats key={block.id} c={c} />;
    case 'features': return <IFeatures key={block.id} c={c} />;
    case 'how-it-works': return <IHowItWorks key={block.id} c={c} />;
    case 'testimonials': return <ITestimonials key={block.id} c={c} />;
    case 'pricing': return <IPricing key={block.id} c={c} />;
    case 'faq': return <IFAQ key={block.id} c={c} />;
    case 'lead-form': return <ILeadForm key={block.id} c={c} />;
    case 'cta-banner': return <ICTA key={block.id} c={c} />;
    case 'text-block': return <IText key={block.id} c={c} />;
    case 'heading-block': return <IHeading key={block.id} c={c} />;
    case 'image-block': return <IImage key={block.id} c={c} />;
    case 'two-col': return <ITwoCol key={block.id} c={c} />;
    case 'button-block': return <IButton key={block.id} c={c} />;
    case 'divider': return <IDivider key={block.id} c={c} />;
    case 'spacer': return <ISpacer key={block.id} c={c} />;
    case 'footer': return <IFooter key={block.id} c={c} />;
    default: return null;
  }
};
