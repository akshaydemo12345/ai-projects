import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle, Globe, Copy, ExternalLink, Code, Check } from 'lucide-react';
import { projectsApi, pagesApi, type Project, type LandingPage } from '@/services/api';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { copyToClipboard } from '@/lib/utils';

// --- WordPress Steps ---
const WordPressIntegration = ({ project, pageSlug }: { project: Project, pageSlug: string }) => {
  const token = project.apiToken || 'PC-TOKEN-PENDING';
  const [copiedScript, setCopiedScript] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);

  const script = token
    ? `<!-- PageCraft AI Integration -->\n<script>\n  window.__PC_TOKEN__ = "${token}";\n  window.__PC_PAGE__ = "${pageSlug}";\n</script>\n<script src="${import.meta.env.VITE_API_BASE_URL}/sdk/loader.js" async defer></script>`
    : '';

  const copyToken = async () => { 
    const success = await copyToClipboard(token);
    if (success) {
      setCopiedToken(true);
      toast.success("Token copied!");
      setTimeout(() => setCopiedToken(false), 2000);
    }
  };

  const copyScript = async () => { 
    const success = await copyToClipboard(script);
    if (success) {
      setCopiedScript(true);
      toast.success("Script copied!");
      setTimeout(() => setCopiedScript(false), 2000);
    }
  };

  const Step = ({ n, title, done, active }: { n: number; title: string; done?: boolean; active?: boolean }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
      <div style={{ width: 26, height: 26, borderRadius: '50%', background: done ? '#22c55e' : active ? '#4f46e5' : '#e5e7eb', color: done || active ? '#fff' : '#6b7280', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0, transition: 'all .3s' }}>
        {done ? <Check size={14} /> : n}
      </div>
      <span style={{ fontSize: 13, fontWeight: 600, color: active ? '#4f46e5' : done ? '#374151' : '#9ca3af' }}>{title}</span>
    </div>
  );

  const step: number = token ? 3 : 2;

  return (
    <div>
      <div style={{ background: '#f8fafc', borderRadius: 10, padding: '16px 20px', marginBottom: 20, border: '1px solid #e5e7eb' }}>
        <Step n={1} title="Install WordPress Plugin" done={step >= 2} active={step === 1} />
        <div style={{ width: 2, height: 16, background: '#e5e7eb', marginLeft: 12, marginBottom: 4 }} />
        <Step n={2} title="Generate Access Token" done={step >= 3} active={step === 2} />
        <div style={{ width: 2, height: 16, background: '#e5e7eb', marginLeft: 12, marginBottom: 4 }} />
        <Step n={3} title="Add Script to WordPress Head" active={step === 3} />
      </div>

      <div style={{ marginBottom: 16, background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: 18 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontWeight: 600, fontSize: 14, color: '#374151' }}>1. Install WordPress Plugin</span>
          <a href="#" style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#4f46e5', textDecoration: 'none', fontWeight: 600 }}>
            Get Plugin <ExternalLink size={12} />
          </a>
        </div>
        <p style={{ fontSize: 13, color: '#6b7280', margin: 0, lineHeight: 1.6 }}>
          Go to your WordPress dashboard → <strong>Plugins → Add New</strong> → Search for <strong>"PageCraft AI"</strong> → Install &amp; Activate.
        </p>
      </div>

      <div style={{ marginBottom: 16, background: '#fff', border: `1px solid ${token ? '#bbf7d0' : '#e5e7eb'}`, borderRadius: 10, padding: 18 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: token ? 12 : 0 }}>
          <span style={{ fontWeight: 600, fontSize: 14, color: '#374151' }}>2. Your Access Token</span>
        </div>
        {token && (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <code style={{ flex: 1, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 7, padding: '8px 12px', fontSize: 12, fontFamily: 'monospace', color: '#166534', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{token}</code>
            <button onClick={copyToken} style={{ border: '1px solid #e5e7eb', borderRadius: 7, padding: '7px 10px', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', color: copiedToken ? '#22c55e' : '#6b7280' }}>
              {copiedToken ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
        )}
      </div>

      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: 18 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span style={{ fontWeight: 600, fontSize: 14, color: '#374151' }}>3. Add Script to WordPress Head</span>
          {token && (
            <button onClick={copyScript} style={{ display: 'flex', alignItems: 'center', gap: 6, border: '1px solid #e5e7eb', borderRadius: 7, padding: '6px 12px', background: '#fff', cursor: 'pointer', fontSize: 12, color: copiedScript ? '#22c55e' : '#374151', fontWeight: 600 }}>
              {copiedScript ? <Check size={12} /> : <Copy size={12} />}
              {copiedScript ? 'Copied!' : 'Copy Script'}
            </button>
          )}
        </div>
        {token && (
          <>
            <p style={{ fontSize: 12, color: '#6b7280', margin: '0 0 10px', lineHeight: 1.6 }}>
              Paste this before <code style={{ background: '#fee2e2', color: '#991b1b', padding: '1px 5px', borderRadius: 4 }}>&lt;/head&gt;</code>:
            </p>
            <pre style={{ background: '#0f172a', color: '#86efac', borderRadius: 8, padding: 16, fontSize: 11, fontFamily: 'monospace', overflow: 'auto', margin: 0, lineHeight: 1.7 }}>
              {script}
            </pre>
          </>
        )}
      </div>
    </div>
  );
};

// --- Script Integration ---
const ScriptIntegration = ({ project, pageSlug }: { project: Project, pageSlug: string }) => {
  const [copied, setCopied] = useState(false);
  const token = project.apiToken || 'PC-TOKEN-PENDING';
  const snippet = `<script src="${import.meta.env.VITE_API_BASE_URL}/sdk/embed.js?token=${token}&page=${pageSlug}" async></script>`;
  const copy = async () => { 
    const success = await copyToClipboard(snippet);
    if (success) {
      setCopied(true);
      toast.success("Script snippet copied!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div>
      <p style={{ fontSize: 14, color: '#6b7280', margin: '0 0 16px', lineHeight: 1.6 }}>
        Paste this script tag anywhere in your website's HTML — ideally before <code>&lt;/body&gt;</code>.
      </p>
      <div style={{ position: 'relative', background: '#0f172a', borderRadius: 10, padding: 18 }}>
        <pre style={{ color: '#fdba74', fontSize: 12, fontFamily: 'monospace', margin: 0, lineHeight: 1.7, overflow: 'auto' }}>{snippet}</pre>
        <button onClick={copy} style={{ position: 'absolute', top: 12, right: 12, display: 'flex', alignItems: 'center', gap: 5, background: copied ? '#22c55e' : '#fff', color: copied ? '#fff' : '#374151', border: 'none', borderRadius: 6, padding: '5px 12px', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
          {copied ? <Check size={12} /> : <Copy size={12} />} {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
    </div>
  );
};

// --- Main PublishedPage ---
const PublishedPage = () => {
  const [searchParams] = useSearchParams();
  const projId = searchParams.get('project');
  const pageId = searchParams.get('page');
  const [urlCopied, setUrlCopied] = useState(false);

  const { data: project, isLoading: projLoading } = useQuery({
    queryKey: ['projects', projId],
    queryFn: () => projectsApi.getById(projId!),
    enabled: !!projId
  });

  const { data: page, isLoading: pageLoading } = useQuery({
    queryKey: ['pages', pageId],
    queryFn: () => pagesApi.getById(projId!, pageId!),
    enabled: !!pageId && !!projId
  });

  if (projLoading || pageLoading || !project || !page) {
    return (
      <div style={{ padding: 100, textAlign: 'center', fontFamily: 'Inter' }}>
        <div className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4" />
        <h2 style={{ color: '#0f172a' }}>Loading your page status...</h2>
      </div>
    );
  }

  const liveUrl = `${window.location.origin}/${page.slug}`;
  const copyUrl = async () => { 
    const success = await copyToClipboard(liveUrl);
    if (success) {
      setUrlCopied(true);
      toast.success("Page URL copied!");
      setTimeout(() => setUrlCopied(false), 2000);
    }
  };

  return (
    <div style={{ padding: '32px 40px', maxWidth: 960, margin: '0 auto', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <CheckCircle size={32} color="#fff" />
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', margin: '0 0 8px' }}>Your page is live! 🎉</h1>
        <p style={{ fontSize: 15, color: '#6b7280', margin: 0 }}>Your landing page has been published and is ready to collect leads.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 28 }}>
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Globe size={16} color="#6b7280" />
            <span style={{ fontWeight: 700, fontSize: 14, color: '#374151' }}>Live URL</span>
          </div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <div style={{ flex: 1, border: '1px solid #e5e7eb', borderRadius: 8, padding: '9px 12px', fontSize: 13, color: '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', background: '#f8fafc' }}>{liveUrl}</div>
            <button onClick={copyUrl} style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: '9px 12px', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', color: urlCopied ? '#22c55e' : '#6b7280', transition: 'all .2s', activeScale: 0.95 } as any}>
              {urlCopied ? <Check size={15} /> : <Copy size={15} />}
            </button>
          </div>
          <button onClick={() => window.open(liveUrl, '_blank')} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, background: '#0f172a', color: '#fff', border: 'none', borderRadius: 8, padding: 11, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            <ExternalLink size={14} /> Open Page
          </button>
        </div>

        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <Globe size={16} color="#6b7280" />
            <span style={{ fontWeight: 700, fontSize: 14, color: '#374151' }}>Page Stats</span>
          </div>
          {[{ label: 'Status', value: '● Published', color: '#22c55e' }, { label: 'Total Views', value: page.stats?.views?.toString() || '0' }, { label: 'Leads', value: page.stats?.leads?.toString() || '0' }, { label: 'Published', value: 'Just now' }].map((s) => (
            <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid #f1f5f9' }}>
              <span style={{ fontSize: 13, color: '#6b7280' }}>{s.label}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: s.color || '#374151' }}>{s.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 14, padding: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <Code size={18} color="#6b7280" />
          <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: 0 }}>How to use this on your website</h2>
        </div>
        <p style={{ fontSize: 13, color: '#6b7280', margin: '0 0 24px' }}>Follow these simple steps to integrate your landing page securely and seamlessly.</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{ width: 32, height: 32, background: '#21759b', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 800, color: '#fff' }}>W</div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: 0 }}>WordPress Integration (Recommended)</h3>
            </div>
            <div style={{ background: '#f8fafc', borderRadius: 10, padding: 22, border: '1px solid #e5e7eb' }}>
              <WordPressIntegration project={project} pageSlug={page.slug || "page"} />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{ width: 32, height: 32, background: '#4f46e5', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: '#fff' }}>&lt;/&gt;</div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: 0 }}>Script Integration (Any Website)</h3>
            </div>
            <div style={{ background: '#f8fafc', borderRadius: 10, padding: 22, border: '1px solid #e5e7eb' }}>
              <ScriptIntegration project={project} pageSlug={page.slug || "page"} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublishedPage;
