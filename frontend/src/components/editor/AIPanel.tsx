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
  'Create a hero section for an SEO agency',
  'Add a features grid with 6 benefits',
  'Generate 3 customer testimonials with 5 stars',
  'Create a pricing section with 3 plans',
  'Add a FAQ with 5 common SEO questions',
  'Create a contact form with name, email, phone',
  'Add a stats bar with 4 impressive numbers',
  'Create a CTA banner with a free audit offer',
];

const demoGenerate = (prompt: string): Omit<Block, 'id'> => {
  const p = prompt.toLowerCase();
  if (p.includes('hero')) return { type: 'hero', content: { badge: '🚀 Best in Class', heading: 'Grow Your Business with AI-Powered Marketing', subtext: 'We combine AI with human expertise to deliver 10x better results for your business.', trust: ['ROI Guaranteed', 'No Long Contracts', '24/7 Support'], formTitle: 'Book a Free Demo', formFields: ['Your Name', 'Work Email', 'Phone', 'Company'], formButton: 'Book My Free Demo →', formDisclaimer: 'No spam. Cancel anytime.' } };
  if (p.includes('feature')) return { type: 'features', content: { heading: 'Everything You Need to Rank on Page 1', subtext: 'Our comprehensive SEO platform covers every aspect of search.', features: [{ icon: '🔍', title: 'Keyword Research', desc: 'Find high-value keywords your customers are searching for.' }, { icon: '📊', title: 'Rank Tracking', desc: 'Monitor your positions daily across all your target keywords.' }, { icon: '🔗', title: 'Backlink Analysis', desc: 'See who links to you and find new link opportunities.' }, { icon: '🛠', title: 'Technical Audit', desc: 'Find and fix the issues holding your site back.' }, { icon: '✍️', title: 'Content Optimizer', desc: 'Create content that outranks your competitors.' }, { icon: '📈', title: 'ROI Reporting', desc: 'See exactly how SEO is driving revenue for your business.' }] } };
  if (p.includes('testimonial')) return { type: 'testimonials', content: { heading: 'Trusted by 500+ Growing Businesses', subtext: 'Real results from real customers.', testimonials: [{ name: 'Alex Thompson', title: 'CEO, GrowthBox', text: 'We went from 0 to 50,000 monthly visitors in 8 months. Unbelievable ROI.', stars: 5 }, { name: 'Priya Patel', title: 'CMO, SaaSify', text: 'Our leads went up 3x within the first quarter. Best marketing investment we made.', stars: 5 }, { name: 'David Kim', title: 'Founder, LocalPro', text: "We dominate every local keyword in our city now. Our phone hasn't stopped ringing.", stars: 5 }] } };
  if (p.includes('pricing')) return { type: 'pricing', content: { heading: 'Simple, Transparent Pricing', subtext: 'No hidden fees. Cancel anytime.', plans: [{ name: 'Basic', price: '$299', period: '/mo', desc: 'For solopreneurs.', features: ['10 Keywords', 'Weekly Reports', 'Basic SEO', 'Email Support'], cta: 'Start Free Trial', highlighted: false }, { name: 'Pro', price: '$699', period: '/mo', desc: 'For growing teams.', features: ['50 Keywords', 'Daily Reports', 'Full Link Building', 'Phone Support', 'Content Calendar'], cta: 'Get Started', highlighted: true }, { name: 'Agency', price: '$1,499', period: '/mo', desc: 'For agencies managing multiple clients.', features: ['Unlimited Keywords', 'White-Label Reports', 'Dedicated Manager', 'API Access', 'Priority Support'], cta: 'Contact Sales', highlighted: false }] } };
  if (p.includes('faq')) return { type: 'faq', content: { heading: 'Common Questions', subtext: 'Everything you need to know.', faqs: [{ q: 'How quickly will I see results?', a: 'Most clients see measurable improvements in rankings and traffic within 60–90 days.' }, { q: 'Is my industry too competitive for SEO?', a: 'No niche is too competitive. We use smarter targeting to find the right opportunities for your business.' }, { q: 'What does the onboarding process look like?', a: 'After signing up, we schedule a discovery call, audit your site, and deliver a custom strategy within 7 days.' }, { q: 'Do I need to sign a long-term contract?', a: 'No. We work month-to-month. Most clients stay because of results, not contracts.' }, { q: 'Can I track my results myself?', a: 'Yes. You get access to a live dashboard showing rankings, traffic, and conversions 24/7.' }] } };
  if (p.includes('stats') || p.includes('number')) return { type: 'stats', content: { stats: [{ value: '10,000+', label: 'Pages Ranked' }, { value: '98%', label: 'Client Satisfaction' }, { value: '5x', label: 'Average ROI' }, { value: '$50M+', label: 'Revenue Generated' }] } };
  if (p.includes('cta')) return { type: 'cta-banner', content: { heading: 'Start Getting More Leads Today', subtext: 'Join thousands of businesses growing with our platform. No contracts, cancel anytime.', cta: 'Start Your Free Trial', secondary: 'See Case Studies' } };
  if (p.includes('form') || p.includes('contact')) return { type: 'lead-form', content: { heading: 'Let\'s Talk About Your Growth Goals', subtext: 'Our team will review your info and reach out within 24 hours.', fields: [{ label: 'Full Name', type: 'text', required: true }, { label: 'Business Email', type: 'email', required: true }, { label: 'Phone Number', type: 'tel', required: false }, { label: 'Website URL', type: 'url', required: true }, { label: 'Current Monthly Revenue', type: 'select', options: ['< $10K', '$10K–$50K', '$50K–$200K', '$200K+'], required: false }, { label: 'What\'s your biggest challenge?', type: 'textarea', required: false }], button: 'Let\'s Talk Growth →', disclaimer: 'Your data is 100% secure. We\'ll never share it.' } };
  // Default text block
  return { type: 'text-block', content: { text: prompt, align: 'left' } };
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
          headers: { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
          body: JSON.stringify({ model: 'claude-3-haiku-20240307', max_tokens: 2048, messages: [{ role: 'user', content: `You are a landing page builder. Return ONLY valid JSON (no markdown) matching: {"type":"hero"|"features"|"stats"|"testimonials"|"pricing"|"faq"|"lead-form"|"cta-banner"|"text-block"|"heading-block"|"image-block","content":{...}}. Request: "${prompt}"` }] }),
        });
        const d = await res.json();
        const raw = d.content?.[0]?.text ?? '{}';
        const parsed = JSON.parse(raw.match(/\{[\s\S]+\}/)?.[0] ?? '{}');
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
