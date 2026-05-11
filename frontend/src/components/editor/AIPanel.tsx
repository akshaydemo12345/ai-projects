import { useState } from 'react';
import { X, Sparkles, ChevronDown, Loader2, Wand2 } from 'lucide-react';
import type { Block } from '@/types/editor';

interface AIPanelProps {
  open: boolean;
  onClose: () => void;
  onAddBlock: (block: Omit<Block, 'id'>) => void;
}

const PROVIDERS = [
  { id: 'demo', label: 'AI Demo (Free, No Key)', free: true },
  { id: 'claude', label: 'Claude (Anthropic)' },
  { id: 'openai', label: 'GPT-4 (OpenAI)' },
];

const SUGGESTIONS = [
  'Modern Hero for a high-performance AI SaaS',
  'Feature grid with elegant glassmorphism cards',
  'Premium pricing table with "Most Popular" highlight',
  'Conversion-optimized Lead Form with 5 fields',
  'Testimonial section with avatars and star ratings',
  'Sleek FAQ accordion for an enterprise agency',
  'Hero with a split-screen image and CTA',
  'Call to Action banner with a vibrant gradient background',
];

const demoGenerate = (prompt: string): Omit<Block, 'id'> => {
  const p = prompt.toLowerCase();
  
  if (p.includes('hero')) return { 
    type: 'hero', 
    content: { 
      badge: '✨ THE FUTURE OF GROWTH', 
      heading: 'Transform Your Digital Presence with Precision Engineering', 
      subtext: 'We help high-growth companies scale their business through data-driven design and elite conversion strategies that deliver measurable ROI.', 
      trust: ['Rated 4.9/5 by Industry Leaders', 'SOC2 Type II Certified', 'Used by 500+ Global Teams'], 
      formTitle: 'Accelerate Your Growth', 
      formFields: ['Full Name', 'Business Email', 'Company Website'], 
      formButton: 'Start Free Analysis →', 
      formDisclaimer: 'No credit card required. Cancel anytime.' 
    } 
  };

  if (p.includes('feature') || p.includes('benefit')) return { 
    type: 'features', 
    content: { 
      heading: 'Engineered for Scale, Built for Performance', 
      subtext: 'Our specialized platform combines advanced analytics with intuitive UI to give you an unfair advantage in your market.', 
      features: [
        { icon: '💎', title: 'Premium Aesthetics', desc: 'Interfaces that don\'t just look good, they command respect and trust.' }, 
        { icon: '⚡️', title: 'Lightning Fast', desc: 'Proprietary technology ensuring sub-second load times across every device.' }, 
        { icon: '📈', title: 'Growth Analytics', desc: 'Real-time insights into every click, scroll, and conversion on your landing page.' }, 
        { icon: '🔐', title: 'Enterprise Security', desc: 'Bank-grade encryption protecting your leads and customer data at all times.' }, 
        { icon: '🔄', title: 'Seamless Sync', desc: 'Sync your data with 2,000+ marketing tools including Zapier and Salesforce.' }, 
        { icon: '📱', title: 'Adaptive Design', desc: 'A multi-viewport system that ensures pixel-perfection on every screen size.' }
      ] 
    } 
  };

  if (p.includes('testimonial')) return { 
    type: 'testimonials', 
    content: { 
      heading: 'Validated by the World\'s Boldest Innovators', 
      subtext: 'See why top-tier organizations trust us with their digital growth.', 
      testimonials: [
        { name: 'Sarah Jenkins', title: 'Head of Growth, NexaFlow', text: "The conversion lift we saw within 30 days was staggering. It completely changed our CAC economics.", stars: 5 }, 
        { name: 'Michael Chen', title: 'Founder, TechSphere', text: "Professional, efficient, and results-oriented. The design quality is leagues ahead of anything else.", stars: 5 }, 
        { name: 'Elena Rodriguez', title: 'CMO, Horizon Labs', text: "Finally, a solution that understands the nuance of enterprise-grade landing pages.", stars: 5 }
      ] 
    } 
  };

  if (p.includes('pricing')) return { 
    type: 'pricing', 
    content: { 
      heading: 'Flexible Investment for Every Growth Stage', 
      subtext: 'Choose the plan that fits your current trajectory. Upgrade as you scale.', 
      plans: [
        { name: 'Startup', price: '$499', period: '/mo', desc: 'Perfect for local heroes.', features: ['3 Active Pages', 'Basic A/B Testing', 'Standard Support', '5,000 Monthly Visitors'], cta: 'Get Started', highlighted: false }, 
        { name: 'Pro', price: '$1,299', period: '/mo', desc: 'Our most popular tier.', features: ['Unlimited Pages', 'Advanced A/B Testing', '24/7 Priority Support', '50,000 Monthly Visitors', 'Custom Domains'], cta: 'Claim Pro Access', highlighted: true }, 
        { name: 'Enterprise', price: 'Custom', period: '', desc: 'For high-volume operations.', features: ['SLA Guarantee', 'Dedicated Growth Manager', 'API Access', 'Custom Integrations', 'White-labeling'], cta: 'Contact Strategy Team', highlighted: false }
      ] 
    } 
  };

  if (p.includes('form') || p.includes('contact')) return { 
    type: 'lead-form', 
    content: { 
      heading: 'Design Your Future Success', 
      subtext: 'Our senior strategy team will review your project and prepare a custom roadmap within 24 hours.', 
      fields: [
        { label: 'Name', type: 'text', required: true }, 
        { label: 'Email', type: 'email', required: true }, 
        { label: 'Current Revenue', type: 'select', options: ['$0-$1M', '$1M-$10M', '$10M+'], required: true },
        { label: 'Describe Your Goal', type: 'textarea', required: false }
      ], 
      button: 'Request Strategic Review →', 
      disclaimer: 'We value your privacy. Your information is never shared.' 
    } 
  };

  // Generic fallback with better text
  return { type: 'text-block', content: { text: prompt, align: 'center' } };
};

const AIPanel = ({ open, onClose, onAddBlock }: AIPanelProps) => {
  const [provider, setProvider] = useState('demo');
  const [apiKey, setApiKey] = useState('');
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDrop, setShowDrop] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      if (provider === 'claude' && apiKey) {
        const res = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: { 
            'x-api-key': apiKey, 
            'anthropic-version': '2023-06-01', 
            'content-type': 'application/json',
            'anthropic-beta': 'structured-outputs-2025-11-13',
            'dangerously-allow-browser': 'true'
          },
          body: JSON.stringify({ 
            model: 'claude-3-5-sonnet-20240620', 
            max_tokens: 4096, 
            temperature: 0,
            system: `You are a Supreme UI/UX Architect. 
Your goal is to generate UNIQUE, world-class landing page blocks. 

CREATIVITY MODES:
1. STANDARD: Use 'hero', 'features', etc. for standard structured data.
2. CUSTOM: If the user request is highly specific, creative, or needs a complex layout NOT possible in standard blocks, use 'custom-html'.

FOR 'custom-html':
- Return {"type": "custom-html", "content": {"html": "..."}}.
- Generate full, premium HTML using Tailwind CSS classes.
- Use 'https://picsum.photos/seed/[id]/1200/800' for images.
- Make it look like a high-end agency site (Stripe, Apple, or Linear style).

Return ONLY perfect JSON matching the schema.`,
            messages: [{ role: 'user', content: `Generate a high-converting, extremely creative landing page block for: "${prompt}"` }],
            output_format: {
              type: 'json_schema',
              json_schema: {
                name: "landing_page_block",
                strict: true,
                schema: {
                  type: "object",
                  properties: {
                    type: { 
                      type: "string", 
                      enum: ["hero", "features", "stats", "testimonials", "pricing", "faq", "lead-form", "cta-banner", "text-block", "custom-html"] 
                    },
                    content: { 
                      type: "object",
                      oneOf: [
                        {
                          properties: { html: { type: "string", description: "Raw Tailwind HTML for high-end creative layouts" } },
                          required: ["html"]
                        },
                        {
                          properties: {
                            badge: { type: "string" },
                            heading: { type: "string" },
                            subtext: { type: "string" },
                            trust: { type: "array", items: { type: "string" } },
                            formTitle: { type: "string" },
                            formFields: { type: "array", items: { type: "string" } },
                            formButton: { type: "string" },
                            formDisclaimer: { type: "string" }
                          },
                          required: ["badge", "heading", "subtext", "trust", "formTitle", "formFields", "formButton", "formDisclaimer"]
                        },
                        {
                          properties: {
                            heading: { type: "string" },
                            subtext: { type: "string" },
                            features: { 
                              type: "array", 
                              items: { 
                                type: "object", 
                                properties: { icon: { type: "string" }, title: { type: "string" }, desc: { type: "string" } },
                                required: ["icon", "title", "desc"]
                              } 
                            }
                          },
                          required: ["heading", "subtext", "features"]
                        }
                      ]
                    }
                  },
                  required: ["type", "content"],
                  additionalProperties: false
                }
              }
            }
          }),
        });
        const d = await res.json();
        const raw = d.content?.[0]?.text ?? '{}';
        const parsed = JSON.parse(raw);
        if (parsed.type && parsed.content) { onAddBlock(parsed); setPrompt(''); onClose(); return; }
      }
      if (provider === 'openai' && apiKey) {
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ model: 'gpt-4o-mini', response_format: { type: 'json_object' }, messages: [{ role: 'system', content: 'Return JSON only: {"type":"hero"|"features"|"stats"|"testimonials"|"pricing"|"faq"|"lead-form"|"cta-banner"|"text-block","content":{...}}' }, { role: 'user', content: prompt }] }),
        });
        const d = await res.json();
        const parsed = JSON.parse(d.choices?.[0]?.message?.content ?? '{}');
        if (parsed.type && parsed.content) { onAddBlock(parsed); setPrompt(''); onClose(); return; }
      }
      // Demo fallback
      await new Promise((r) => setTimeout(r, 900));
      onAddBlock(demoGenerate(prompt));
      setPrompt('');
      onClose();
    } catch {
      await new Promise((r) => setTimeout(r, 500));
      onAddBlock(demoGenerate(prompt));
      setPrompt('');
      onClose();
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 500, background: 'rgba(0,0,0,.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 560, background: '#fff', borderRadius: 18, boxShadow: '0 32px 80px rgba(0,0,0,.25)', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', padding: '22px 26px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(255,255,255,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={18} color="#fff" />
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>AI Block Generator</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,.7)' }}>Describe what you want to add to your page</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,.15)', border: 'none', borderRadius: 8, width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}>
            <X size={16} />
          </button>
        </div>

        <div style={{ padding: 26 }}>
          {/* Provider selector */}
          <div style={{ marginBottom: 18, position: 'relative' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 6 }}>AI Provider</div>
            <button onClick={() => setShowDrop(!showDrop)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid #e5e7eb', borderRadius: 9, padding: '10px 14px', background: '#fafafa', cursor: 'pointer', fontSize: 13, fontWeight: 500, color: '#374151' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Wand2 size={14} color="#6366f1" />{PROVIDERS.find((p) => p.id === provider)?.label}</div>
              <ChevronDown size={15} color="#9ca3af" />
            </button>
            {showDrop && (
              <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, boxShadow: '0 10px 30px rgba(0,0,0,.12)', zIndex: 10, overflow: 'hidden', marginTop: 4 }}>
                {PROVIDERS.map((p) => (
                  <button key={p.id} onClick={() => { setProvider(p.id); setShowDrop(false); }} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: provider === p.id ? '#f0f0ff' : '#fff', border: 'none', cursor: 'pointer', fontSize: 13, color: provider === p.id ? '#4f46e5' : '#374151', fontWeight: provider === p.id ? 600 : 400 }}>
                    {p.label}
                    {p.free && <span style={{ fontSize: 10, background: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: 100, fontWeight: 700 }}>FREE</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* API Key (non-demo) */}
          {provider !== 'demo' && (
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 6 }}>API Key</div>
              <input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder={provider === 'claude' ? 'sk-ant-...' : 'sk-...'} style={{ width: '100%', border: '1px solid #e5e7eb', borderRadius: 9, padding: '10px 14px', fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
              <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 5 }}>Your key stays local and is never stored.</div>
            </div>
          )}

          {/* Prompt area */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 6 }}>Describe what to generate</div>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && e.metaKey) handleGenerate(); }}
              rows={4}
              placeholder="e.g. Create a hero section for a SaaS product with a demo booking form"
              style={{ width: '100%', border: '1px solid #e5e7eb', borderRadius: 9, padding: '12px 14px', fontSize: 13, outline: 'none', resize: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
            />
          </div>

          {/* Quick suggestions */}
          <div style={{ marginBottom: 22 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 8 }}>Quick Ideas</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {SUGGESTIONS.slice(0, 6).map((s) => (
                <button key={s} onClick={() => setPrompt(s)} style={{ fontSize: 11, border: '1px solid #e5e7eb', borderRadius: 100, padding: '4px 12px', background: '#fafafa', cursor: 'pointer', color: '#374151', transition: 'all .15s' }}>{s}</button>
              ))}
            </div>
          </div>

          {/* Footer actions */}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', alignItems: 'center' }}>
            <span style={{ fontSize: 11, color: '#9ca3af' }}>⌘ Enter to generate</span>
            <button onClick={onClose} style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: '9px 18px', fontSize: 13, background: '#fff', cursor: 'pointer', color: '#6b7280' }}>Cancel</button>
            <button
              onClick={handleGenerate}
              disabled={!prompt.trim() || loading}
              style={{ display: 'flex', alignItems: 'center', gap: 7, background: loading || !prompt.trim() ? '#e0e0e0' : 'linear-gradient(135deg,#4f46e5,#7c3aed)', color: '#fff', border: 'none', borderRadius: 8, padding: '9px 22px', fontSize: 13, fontWeight: 700, cursor: loading || !prompt.trim() ? 'not-allowed' : 'pointer' }}
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
              {loading ? 'Generating…' : 'Generate Block'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIPanel;
