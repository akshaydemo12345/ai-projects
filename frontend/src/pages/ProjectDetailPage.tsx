import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft, Plus, Globe, FileEdit, Rocket, Users as UsersIcon,
  Settings2, Copy, CheckCircle2, X, Sparkles, ExternalLink,
  FileText, Eye, Trash2, Zap, Search, Brain, Loader2, Link
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  getProjects, saveProjects,
  type Project, type LandingPage
} from "./ProjectsPage";
import { generateLandingPageHtml } from "../lib/landingPageTemplates";

// ─── helpers ─────────────────────────────────────────────────────────────────
const autoSlug = (v: string) =>
  v.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

const generateAiPage = (prompt: string, project: Project, branding: { primary: string, secondary: string, logo?: string }): Partial<LandingPage> => ({
  name: prompt.slice(0, 50).trim() || "AI Generated Page",
  slug: autoSlug(prompt.slice(0, 40).trim() || "ai-page") + "-" + Date.now().toString(36),
  metaTitle: `${project.name} — ${prompt.slice(0, 30)}`,
  metaDescription: `${prompt.slice(0, 120)} | ${project.name}`,
  primaryColor: branding.primary,
  secondaryColor: branding.secondary,
  logoUrl: branding.logo,
  accentColor: "#6366f1",
  generationMethod: "ai" as const,
  aiPrompt: prompt,
});

const generateAnalyzedPage = (url: string, project: Project, branding: { primary: string, secondary: string, logo?: string }): Partial<LandingPage> => {
  const domain = url.replace(/https?:\/\//, "").split("/")[0];
  return {
    name: `${domain} Style Page`,
    slug: autoSlug(domain) + "-" + Date.now().toString(36),
    metaTitle: `Inspired by ${domain} | ${project.name}`,
    metaDescription: `A page inspired by ${domain}'s layout and structure.`,
    primaryColor: branding.primary,
    secondaryColor: branding.secondary,
    logoUrl: branding.logo,
    accentColor: "#6366f1",
    generationMethod: "analyze" as const,
  };
};

// ─── Create Page Modal ────────────────────────────────────────────────────────
type CreateMethod = "choose" | "ai" | "analyze";

interface CreatePageModalProps {
  project: Project;
  onClose: () => void;
  onCreate: (page: LandingPage) => void;
}

const CreatePageModal = ({ project, onClose, onCreate }: CreatePageModalProps) => {
  const [method, setMethod] = useState<CreateMethod>("choose");
  const [aiPrompt, setAiPrompt] = useState("");
  const [analyzeUrl, setAnalyzeUrl] = useState("https://");
  const [loading, setLoading] = useState(false);

  // Per-page branding
  const [primaryColor, setPrimaryColor] = useState("#7c3aed");
  const [secondaryColor, setSecondaryColor] = useState("#6366f1");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | undefined>(undefined);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setLogoPreview(url);
    setLogoUrl(url);
  };

  const buildPage = (partial: Partial<LandingPage>): LandingPage => ({
    id: Date.now().toString(),
    name: "",
    slug: "",
    metaTitle: "",
    metaDescription: "",
    description: "",
    primaryColor,
    secondaryColor,
    logoUrl,
    accentColor: "#6366f1",
    type: "ppc",
    status: "draft",
    leads: 0,
    views: 0,
    createdAt: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
    ...partial,
  });

  const handleAiGenerate = () => {
    if (!aiPrompt.trim()) { toast.error("Please describe your page."); return; }
    setLoading(true);
    setTimeout(() => {
      const partial = generateAiPage(aiPrompt, project, { primary: primaryColor, secondary: secondaryColor, logo: logoUrl });
      const page = buildPage(partial);
      setLoading(false);
      onCreate(page);
    }, 1500);
  };

  const handleAnalyze = () => {
    if (!analyzeUrl.trim() || analyzeUrl === "https://") { toast.error("Please enter a URL."); return; }
    setLoading(true);
    setTimeout(() => {
      const partial = generateAnalyzedPage(analyzeUrl, project, { primary: primaryColor, secondary: secondaryColor, logo: logoUrl });
      const page = buildPage(partial);
      setLoading(false);
      onCreate(page);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-background rounded-2xl border border-border shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-border">
          {method !== "choose" && (
            <button
              onClick={() => setMethod("choose")}
              className="text-muted-foreground hover:text-foreground mr-1"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
          )}
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
            {method === "ai" ? <Brain className="h-4 w-4 text-primary" /> :
             method === "analyze" ? <Search className="h-4 w-4 text-primary" /> :
             <Zap className="h-4 w-4 text-primary" />}
          </div>
          <h2 className="text-base font-semibold text-foreground flex-1">
            {method === "choose" && "Create New Page"}
            {method === "ai" && "Describe Your Page"}
            {method === "analyze" && "Analyze a Website"}
          </h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* ── Method Selection ── */}
        {method === "choose" && (
          <div className="p-6 space-y-3">
            <p className="text-sm text-muted-foreground mb-4">
              How would you like to create this landing page?
            </p>

            {/* AI Option */}
            <button
              onClick={() => setMethod("ai")}
              className="w-full rounded-xl border-2 border-border hover:border-primary/50 bg-card hover:bg-primary/5 p-5 text-left transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  <Brain className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground mb-1">✨ Describe Your Page (AI)</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Tell AI what you want — it will generate the full page layout, copy and structure automatically.
                  </p>
                  <p className="text-xs text-primary font-medium mt-2">Fastest → Recommended</p>
                </div>
              </div>
            </button>

            {/* Analyze Option */}
            <button
              onClick={() => setMethod("analyze")}
              className="w-full rounded-xl border-2 border-border hover:border-blue-400/50 bg-card hover:bg-blue-50/50 p-5 text-left transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  <Search className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground mb-1">🔍 Analyze a Website</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Enter a competitor or reference URL — we'll extract the layout, colors and structure to create a similar page.
                  </p>
                  <p className="text-xs text-blue-600 font-medium mt-2">Great for cloning or inspiration</p>
                </div>
              </div>
            </button>
          </div>
        )}

        {/* ── AI Describe Flow ── */}
        {method === "ai" && (
          <div className="p-6 space-y-4">
            {/* Project brand context override */}
            <div className="rounded-xl border border-border bg-card p-4 space-y-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Page Branding</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-foreground mb-1 block">Primary Color</label>
                  <div className="flex items-center gap-2 rounded-lg border border-border px-2 py-1.5 bg-background">
                    <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="h-6 w-6 rounded cursor-pointer border-0 p-0 bg-transparent flex-shrink-0" />
                    <span className="text-xs font-mono text-muted-foreground">{primaryColor}</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-foreground mb-1 block">Secondary Color</label>
                  <div className="flex items-center gap-2 rounded-lg border border-border px-2 py-1.5 bg-background">
                    <input type="color" value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} className="h-6 w-6 rounded cursor-pointer border-0 p-0 bg-transparent flex-shrink-0" />
                    <span className="text-xs font-mono text-muted-foreground">{secondaryColor}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-foreground mb-1.5 block">Logo (optional)</label>
                <div className="flex items-center gap-3">
                  <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" id="upload-logo-ai" />
                  {logoPreview ? (
                    <div className="h-10 w-10 rounded border border-border bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
                      <img src={logoPreview} alt="Logo" className="w-full h-full object-contain" />
                    </div>
                  ) : null}
                  <label htmlFor="upload-logo-ai" className="text-xs font-medium text-primary hover:text-primary/80 cursor-pointer">
                    {logoPreview ? "Change Logo" : "Upload Logo"}
                  </label>
                  {logoPreview && <button onClick={() => { setLogoPreview(null); setLogoUrl(undefined); }} className="text-xs text-muted-foreground hover:text-red-500">Remove</button>}
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-foreground mb-2 block">
                Describe your page <span className="text-red-500">*</span>
              </label>
              <Textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="e.g. PPC landing page for a roofing company in Delhi targeting homeowners who need emergency roof repair. Include a hero section, trust badges, and a lead form."
                className="min-h-[110px] resize-none text-sm"
                autoFocus
              />
              <p className="text-xs text-muted-foreground mt-1">Be specific — the more detail, the better the output.</p>
            </div>

            {/* Quick prompts */}
            <div>
              <p className="text-xs text-muted-foreground mb-2">Quick templates:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  "PPC landing page for a local service business",
                  "Lead generation page for a SaaS product",
                  "Real estate listing page",
                  "Healthcare clinic inquiry page",
                ].map((q) => (
                  <button
                    key={q}
                    onClick={() => setAiPrompt(q)}
                    className="text-xs bg-muted hover:bg-primary/10 text-muted-foreground hover:text-primary border border-border hover:border-primary/30 rounded-lg px-2.5 py-1.5 transition-all"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            <Button
              onClick={handleAiGenerate}
              disabled={loading || !aiPrompt.trim()}
              className="w-full h-11 gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white border-0"
            >
              {loading ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Generating Page...</>
              ) : (
                <><Sparkles className="h-4 w-4" /> Generate with AI</>
              )}
            </Button>
          </div>
        )}

        {/* ── Analyze Website Flow ── */}
        {method === "analyze" && (
          <div className="p-6 space-y-4">
            <div className="rounded-xl border border-border bg-card p-4 space-y-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Page Branding</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-foreground mb-1 block">Primary Color</label>
                  <div className="flex items-center gap-2 rounded-lg border border-border px-2 py-1.5 bg-background">
                    <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="h-6 w-6 rounded cursor-pointer border-0 p-0 bg-transparent flex-shrink-0" />
                    <span className="text-xs font-mono text-muted-foreground">{primaryColor}</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-foreground mb-1 block">Secondary Color</label>
                  <div className="flex items-center gap-2 rounded-lg border border-border px-2 py-1.5 bg-background">
                    <input type="color" value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} className="h-6 w-6 rounded cursor-pointer border-0 p-0 bg-transparent flex-shrink-0" />
                    <span className="text-xs font-mono text-muted-foreground">{secondaryColor}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-foreground mb-1.5 block">Logo (optional)</label>
                <div className="flex items-center gap-3">
                  <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" id="upload-logo-analyze" />
                  {logoPreview ? (
                    <div className="h-10 w-10 rounded border border-border bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
                      <img src={logoPreview} alt="Logo" className="w-full h-full object-contain" />
                    </div>
                  ) : null}
                  <label htmlFor="upload-logo-analyze" className="text-xs font-medium text-primary hover:text-primary/80 cursor-pointer">
                    {logoPreview ? "Change Logo" : "Upload Logo"}
                  </label>
                  {logoPreview && <button onClick={() => { setLogoPreview(null); setLogoUrl(undefined); }} className="text-xs text-muted-foreground hover:text-red-500">Remove</button>}
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-foreground mb-2 block">
                Website URL to analyze <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={analyzeUrl}
                  onChange={(e) => setAnalyzeUrl(e.target.value)}
                  placeholder="https://competitor.com/landing-page"
                  className="pl-9 h-11"
                  autoFocus
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Enter a full URL including https://
              </p>
            </div>

            {/* Examples */}
            <div>
              <p className="text-xs text-muted-foreground mb-2">Examples:</p>
              <div className="space-y-1.5">
                {["https://example.com/lp/roofing", "https://competitor.co/landing", "https://brand.com/offer"].map((ex) => (
                  <button
                    key={ex}
                    onClick={() => setAnalyzeUrl(ex)}
                    className="w-full text-left text-xs font-mono text-muted-foreground hover:text-primary bg-muted hover:bg-primary/5 rounded-lg px-3 py-2 transition-colors"
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </div>

            <Button
              onClick={handleAnalyze}
              disabled={loading}
              className="w-full h-11 gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white border-0"
            >
              {loading ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Analyzing Website...</>
              ) : (
                <><Search className="h-4 w-4" /> Analyze & Generate</>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Edit Page Settings Modal ─────────────────────────────────────────────────
interface EditPageModalProps {
  page: LandingPage;
  projectUrl: string;
  onClose: () => void;
  onSave: (page: LandingPage) => void;
}

const EditPageModal = ({ page, projectUrl, onClose, onSave }: EditPageModalProps) => {
  const [name, setName] = useState(page.name);
  const [slug, setSlug] = useState(page.slug);
  const [metaTitle, setMetaTitle] = useState(page.metaTitle ?? "");
  const [metaDescription, setMetaDescription] = useState(page.metaDescription ?? "");
  
  const [primaryColor, setPrimaryColor] = useState(page.primaryColor ?? "#7c3aed");
  const [secondaryColor, setSecondaryColor] = useState(page.secondaryColor ?? "#6366f1");
  const [logoPreview, setLogoPreview] = useState<string | null>(page.logoUrl ?? null);
  const [logoUrl, setLogoUrl] = useState<string | undefined>(page.logoUrl);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setLogoPreview(url);
    setLogoUrl(url);
  };

  const liveUrl = `${projectUrl.replace(/\/$/, "")}/lp/${slug || "page-slug"}`;

  const handleSave = () => {
    if (!name.trim() || !slug.trim()) { toast.error("Name and slug are required."); return; }
    onSave({ ...page, name: name.trim(), slug: slug.trim(), metaTitle, metaDescription, primaryColor, secondaryColor, logoUrl });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-background rounded-2xl border border-border shadow-2xl overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-border">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Settings2 className="h-4 w-4 text-primary" />
          </div>
          <h2 className="text-base font-semibold text-foreground flex-1">Page Settings</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Page Name *</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Roofing Delhi Landing" className="h-10" />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">URL Slug *</label>
            <div className="flex items-center gap-0 rounded-md border border-input overflow-hidden">
              <span className="px-3 py-2 bg-muted text-xs text-muted-foreground border-r border-input whitespace-nowrap">/lp/</span>
              <input
                value={slug}
                onChange={(e) => setSlug(autoSlug(e.target.value))}
                placeholder="roofing-delhi"
                className="flex-1 px-3 py-2 text-sm bg-background outline-none"
              />
            </div>
            {/* Live URL preview */}
            <div className="mt-2 flex items-center gap-1.5 px-3 py-2 bg-muted/50 rounded-lg">
              <ExternalLink className="h-3 w-3 text-muted-foreground flex-shrink-0" />
              <p className="text-xs font-mono text-muted-foreground truncate">{liveUrl}</p>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Meta Title</label>
            <Input value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} placeholder="SEO title for search engines" className="h-10 text-sm" />
            <p className="text-xs text-muted-foreground mt-1">Ideal: 50–60 characters</p>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Meta Description</label>
            <Textarea
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              placeholder="Page description for search results..."
              className="min-h-[65px] resize-none text-sm"
            />
            <p className="text-xs text-muted-foreground mt-1 mb-4">Ideal: 150–160 characters</p>
          </div>

          <div className="rounded border border-border p-3 space-y-3 bg-muted/30">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Page Branding</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-medium text-foreground mb-1 block">Primary</label>
                <div className="flex items-center gap-2 rounded border border-border px-2 py-1 bg-background h-8">
                  <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="h-5 w-5 rounded cursor-pointer border-0 p-0 bg-transparent flex-shrink-0" />
                  <span className="text-[10px] font-mono">{primaryColor}</span>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-medium text-foreground mb-1 block">Secondary</label>
                <div className="flex items-center gap-2 rounded border border-border px-2 py-1 bg-background h-8">
                  <input type="color" value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} className="h-5 w-5 rounded cursor-pointer border-0 p-0 bg-transparent flex-shrink-0" />
                  <span className="text-[10px] font-mono">{secondaryColor}</span>
                </div>
              </div>
            </div>
            <div>
              <label className="text-[10px] font-medium text-foreground mb-1 block">Logo (optional)</label>
              <div className="flex items-center gap-2">
                <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" id="upload-logo-edit" />
                {logoPreview ? (
                  <div className="h-8 w-8 rounded border border-border bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
                    <img src={logoPreview} alt="Logo" className="w-full h-full object-contain" />
                  </div>
                ) : null}
                <label htmlFor="upload-logo-edit" className="text-[10px] text-primary hover:text-primary/80 cursor-pointer font-medium px-2 py-1 bg-primary/10 rounded">
                  {logoPreview ? "Change Logo" : "Upload Logo"}
                </label>
                {logoPreview && <button onClick={() => { setLogoPreview(null); setLogoUrl(undefined); }} className="text-[10px] text-red-500 hover:bg-red-50 px-2 py-1 rounded">Remove</button>}
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 px-6 py-4 border-t border-border bg-muted/20">
          <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button className="flex-1 bg-primary hover:bg-primary/90" onClick={handleSave}>Save Settings</Button>
        </div>
      </div>
    </div>
  );
};

// ─── Publish Modal ────────────────────────────────────────────────────────────
interface PublishModalProps {
  page: LandingPage;
  project: Project;
  onClose: () => void;
  onPublished: (page: LandingPage) => void;
}

type IntegrationTab = "wordpress" | "script" | "iframe";

const PublishModal = ({ page, project, onClose, onPublished }: PublishModalProps) => {
  const [tab, setTab] = useState<IntegrationTab>("wordpress");
  const [urlCopied, setUrlCopied] = useState(false);
  const publishUrl = page.publishUrl || `https://pub.ppcbuilder.io/p/${project.id.slice(-6)}/${page.slug}`;
  const scriptCode = `<script src="https://cdn.ppcbuilder.io/embed.js" data-token="${project.token}" data-page="${page.slug}" async></script>`;
  const iframeCode = `<iframe src="${publishUrl}" width="100%" height="100%" frameborder="0" allowfullscreen></iframe>`;

  const handlePublish = () => {
    onPublished({ ...page, status: "published", publishUrl });
    toast.success("🚀 Page published!");
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(publishUrl);
    setUrlCopied(true);
    setTimeout(() => setUrlCopied(false), 2000);
  };

  const tabs = [
    { id: "wordpress" as const, label: "WordPress Plugin" },
    { id: "script" as const, label: "Script Embed" },
    { id: "iframe" as const, label: "iFrame Embed" },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-background rounded-2xl border border-border shadow-2xl overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-border">
          <div className="h-8 w-8 rounded-lg bg-emerald-100 flex items-center justify-center">
            <Rocket className="h-4 w-4 text-emerald-600" />
          </div>
          <h2 className="text-base font-semibold text-foreground flex-1">Publish Page</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Generated URL */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Live URL</p>
            <div className="flex items-center gap-2 bg-muted rounded-xl px-4 py-3">
              <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="flex-1 text-sm font-mono text-foreground truncate">{publishUrl}</span>
              <button onClick={copyUrl} className="text-muted-foreground hover:text-foreground flex-shrink-0">
                {urlCopied ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Integration Tabs */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Integration Method</p>
            <div className="flex gap-1 bg-muted p-1 rounded-xl mb-4">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
                    tab === t.id
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* WordPress */}
            {tab === "wordpress" && (
              <div className="space-y-3">
                {[
                  { num: 1, text: "Install 'PPC Landing Builder' plugin from WordPress directory" },
                  { num: 2, text: "In plugin settings, paste your token:" },
                  { num: 3, text: "Save settings — pages will auto-sync" },
                ].map((s) => (
                  <div key={s.num} className="flex gap-3 items-start">
                    <span className="h-5 w-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{s.num}</span>
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">{s.text}</p>
                      {s.num === 2 && (
                        <div className="flex items-center gap-2 bg-muted rounded-lg px-3 py-1.5 mt-1.5 cursor-pointer hover:bg-muted/80"
                          onClick={() => { navigator.clipboard.writeText(project.token); toast.success("Token copied!"); }}>
                          <span className="text-xs font-mono text-foreground">{project.token}</span>
                          <Copy className="h-3 w-3 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Script */}
            {tab === "script" && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-xs text-muted-foreground">Add to your &lt;head&gt; tag:</p>
                  <button onClick={() => { navigator.clipboard.writeText(scriptCode); toast.success("Copied!"); }} className="text-xs text-primary flex items-center gap-1">
                    <Copy className="h-3 w-3" /> Copy
                  </button>
                </div>
                <pre className="text-[11px] font-mono bg-muted rounded-lg p-3 overflow-x-auto whitespace-pre-wrap break-all text-foreground">{scriptCode}</pre>
              </div>
            )}

            {/* iFrame */}
            {tab === "iframe" && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-xs text-muted-foreground">Embed anywhere that accepts HTML:</p>
                  <button onClick={() => { navigator.clipboard.writeText(iframeCode); toast.success("Copied!"); }} className="text-xs text-primary flex items-center gap-1">
                    <Copy className="h-3 w-3" /> Copy
                  </button>
                </div>
                <pre className="text-[11px] font-mono bg-muted rounded-lg p-3 overflow-x-auto whitespace-pre-wrap break-all text-foreground">{iframeCode}</pre>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3 px-6 py-4 border-t border-border bg-muted/20">
          <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button
            className="flex-1 gap-2 bg-emerald-600 hover:bg-emerald-700 text-white border-0"
            onClick={handlePublish}
          >
            <Rocket className="h-4 w-4" />
            {page.status === "published" ? "Re-Publish" : "Publish Now"}
          </Button>
        </div>
      </div>
    </div>
  );
};

// ─── Project Detail Page ────────────────────────────────────────────────────────
const ProjectDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [projects, setProjects] = useState<Project[]>(getProjects());
  const [createOpen, setCreateOpen] = useState(searchParams.get("createPage") === "1");
  const [editingPage, setEditingPage] = useState<LandingPage | null>(null);
  const [publishingPage, setPublishingPage] = useState<LandingPage | null>(null);
  const [deletePageId, setDeletePageId] = useState<string | null>(null);
  const [tokenCopied, setTokenCopied] = useState(false);

  const project = projects.find((p) => p.id === id);

  useEffect(() => {
    if (!project) {
      navigate("/dashboard");
      return;
    }
    const pubId = searchParams.get("publish");
    if (pubId) {
      const page = project.pages.find(p => p.id === pubId);
      if (page) {
        setPublishingPage(page);
      }
      navigate(`/dashboard/projects/${project.id}`, { replace: true });
    }
  }, [project, searchParams, navigate]);

  if (!project) return null;

  const updateProject = (updated: Project) => {
    const all = projects.map((p) => (p.id === id ? updated : p));
    saveProjects(all);
    setProjects(all);
  };

  const handlePageCreated = (page: LandingPage) => {
    const updated = { ...project, pages: [...project.pages, page] };
    updateProject(updated);
    setCreateOpen(false);
    // Store page data for the editor
    localStorage.setItem("editor_project_id", project.id);
    localStorage.setItem("editor_page_id", page.id);
    // Generate AI/analyzed HTML for editor
    const html = buildPageHtml(page, project);
    localStorage.setItem("grapes-initial-html", html.body);
    localStorage.setItem("grapes-initial-css", html.css);
    toast.success("Page created! Opening editor…");
    setTimeout(() => navigate("/editor"), 600);
  };

  const handleEditSave = (page: LandingPage) => {
    const newPages = project.pages.map((p) => (p.id === page.id ? page : p));
    updateProject({ ...project, pages: newPages });
    setEditingPage(null);
    toast.success("Page settings saved!");
  };

  const handlePublished = (page: LandingPage) => {
    const newPages = project.pages.map((p) => (p.id === page.id ? page : p));
    updateProject({ ...project, pages: newPages });
    setPublishingPage(null);
  };

  const confirmDelete = () => {
    if (!deletePageId) return;
    updateProject({ ...project, pages: project.pages.filter((p) => p.id !== deletePageId) });
    toast.success("Page deleted.");
    setDeletePageId(null);
  };

  const copyToken = () => {
    navigator.clipboard.writeText(project.token);
    setTokenCopied(true);
    toast.success("Token copied!");
    setTimeout(() => setTokenCopied(false), 2000);
  };

  // ── Page card ──
  const PageCard = ({ page }: { page: LandingPage }) => (
    <div className="rounded-xl border border-border bg-card overflow-hidden hover:shadow-sm transition-all group">
      {/* Color bar */}
      <div className="h-1.5 flex">
        <div className="flex-1" style={{ background: page.primaryColor || project.primaryColor }} />
        <div className="flex-1" style={{ background: `linear-gradient(to right, ${page.primaryColor || project.primaryColor}, ${page.secondaryColor || project.secondaryColor})` }} />
        <div className="flex-1" style={{ background: page.secondaryColor || project.secondaryColor }} />
      </div>

      <div className="p-5">
        {/* Title + actions */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-foreground truncate text-sm">{page.name}</h3>
              <span className={`flex-shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide ${
                page.status === "published" ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"
              }`}>
                {page.status}
              </span>
              {page.generationMethod && (
                <span className="flex-shrink-0 text-[9px] font-medium px-1.5 py-0.5 rounded bg-violet-100 text-violet-700">
                  {page.generationMethod === "ai" ? "✨ AI" : page.generationMethod === "analyze" ? "🔍 Analyzed" : "Manual"}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <ExternalLink className="h-3 w-3" />
              /lp/{page.slug}
            </div>
          </div>
          {/* Hover actions */}
          <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setEditingPage(page)}
              title="Page settings"
              className="p-1.5 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
            >
              <Settings2 className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setDeletePageId(page.id)}
              title="Delete"
              className="p-1.5 rounded-lg hover:bg-red-50 text-muted-foreground hover:text-red-500 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
          <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {page.views} views</span>
          <span className="flex items-center gap-1"><UsersIcon className="h-3 w-3" /> {page.leads} leads</span>
        </div>

        {/* Leads panel */}
        <div className="flex items-center gap-3 bg-amber-50 rounded-lg px-3 py-2 mb-3">
          <UsersIcon className="h-4 w-4 text-amber-600 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-amber-700 font-semibold">{page.leads} Leads captured</p>
            <p className="text-[10px] text-amber-600">
              {page.views} views • {page.views > 0 ? ((page.leads / page.views) * 100).toFixed(1) : 0}% conv.
            </p>
          </div>
          <button
            onClick={() => navigate(`/dashboard/leads?page=${page.id}&project=${project.id}`)}
            className="text-[10px] font-semibold text-amber-700 hover:text-amber-900 underline"
          >
            View All
          </button>
        </div>

        {/* 4 Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => {
              localStorage.setItem("editor_project_id", project.id);
              localStorage.setItem("editor_page_id", page.id);
              if (!localStorage.getItem(`grapes-lp-${page.id}-html`)) {
                const html = buildPageHtml(page, project);
                localStorage.setItem("grapes-initial-html", html.body);
                localStorage.setItem("grapes-initial-css", html.css);
              }
              navigate("/editor");
            }}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
          >
            <FileEdit className="h-3.5 w-3.5" /> Editor
          </button>
          <button
            onClick={() => setPublishingPage(page)}
            className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
              page.status === "published"
                ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
            }`}
          >
            <Rocket className="h-3.5 w-3.5" />
            {page.status === "published" ? "Published ✓" : "Publish"}
          </button>
          <button
            onClick={() => navigate(`/dashboard/leads?page=${page.id}&project=${project.id}`)}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors"
          >
            <UsersIcon className="h-3.5 w-3.5" /> Leads
          </button>
          <button
            onClick={() => setEditingPage(page)}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <Settings2 className="h-3.5 w-3.5" /> Settings
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-8 flex-1 overflow-y-auto">

      {/* Modals */}
      {createOpen && (
        <CreatePageModal
          project={project}
          onClose={() => setCreateOpen(false)}
          onCreate={handlePageCreated}
        />
      )}
      {editingPage && (
        <EditPageModal
          page={editingPage}
          projectUrl={project.url || "https://yoursite.com"}
          onClose={() => setEditingPage(null)}
          onSave={handleEditSave}
        />
      )}
      {publishingPage && (
        <PublishModal
          page={publishingPage}
          project={project}
          onClose={() => setPublishingPage(null)}
          onPublished={handlePublished}
        />
      )}
      {deletePageId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-background border border-border rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6">
              <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <Trash2 className="h-5 w-5 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">Delete Landing Page?</h3>
              <p className="text-sm text-muted-foreground">
                Are you absolutely sure? This action cannot be undone and will permanently remove this landing page and all associated configurations.
              </p>
            </div>
            <div className="p-4 bg-muted/30 border-t border-border flex justify-end gap-3">
              <Button variant="outline" onClick={() => setDeletePageId(null)}>Cancel</Button>
              <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={confirmDelete}>Delete Page</Button>
            </div>
          </div>
        </div>
      )}

      {/* Back */}
      <button
        onClick={() => navigate("/dashboard")}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> All Projects
      </button>

      {/* Header */}
      <div className="flex items-start justify-between mb-8 gap-4">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl overflow-hidden border border-border flex items-center justify-center bg-primary"
            style={{ backgroundImage: `linear-gradient(135deg, ${project.pages[0]?.primaryColor || '#7c3aed'}, ${project.pages[0]?.secondaryColor || '#6366f1'})` }}>
            <Globe className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{project.name}</h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
              <a href={project.url} target="_blank" rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-primary transition-colors">
                {project.url}
              </a>
              <span className="text-muted-foreground/40">•</span>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{project.category}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button className="gap-2 bg-primary hover:bg-primary/90" onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4" /> Create New Page
          </Button>
        </div>
      </div>

      {/* Smart Quick Access & Summary Panel */}
      <div className="mb-10 rounded-xl border border-border bg-card shadow-sm overflow-hidden filter-panel">
        {/* Top: Status & Stats */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 lg:gap-10 px-6 py-4 border-b border-border bg-gradient-to-r from-muted/30 to-background overflow-x-auto">
          {/* Status Counts */}
          <div className="flex items-center gap-5 border-b md:border-b-0 md:border-r border-border pb-3 md:pb-0 md:pr-6 flex-shrink-0 w-full md:w-auto justify-between md:justify-start">
             <div className="flex items-center gap-2">
               <span className="relative flex h-2.5 w-2.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span></span>
               <span className="text-sm font-semibold text-foreground">
                 {project.pages.filter(p => p.status === 'published').length} <span className="text-muted-foreground font-medium">Active</span>
               </span>
             </div>
             <div className="flex items-center gap-2">
               <span className="h-2.5 w-2.5 rounded-full bg-red-500"/>
               <span className="text-sm font-semibold text-foreground">
                 0 <span className="text-muted-foreground font-medium">Inactive</span>
               </span>
             </div>
             <div className="flex items-center gap-2">
               <span className="h-2.5 w-2.5 rounded-full bg-amber-500"/>
               <span className="text-sm font-semibold text-foreground">
                 {project.pages.filter(p => p.status !== 'published').length} <span className="text-muted-foreground font-medium">Draft</span>
               </span>
             </div>
          </div>

          {/* Stats Summary */}
          <div className="flex items-center gap-6 flex-shrink-0 text-sm">
             <span className="text-muted-foreground">Total Pages: <strong className="text-foreground text-lg ml-1">{project.pages.length}</strong></span>
             <span className="text-muted-foreground">Leads: <strong className="text-foreground text-lg ml-1">{project.pages.reduce((s, p) => s+p.leads, 0)}</strong></span>
             <span className="text-muted-foreground">Views: <strong className="text-foreground text-lg ml-1">{project.pages.reduce((s, p) => s+p.views, 0)}</strong></span>
          </div>
        </div>
        
        {/* Bottom: Quick Access Actions */}
        <div className="px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 bg-background">
           <div className="flex items-center gap-2 text-sm font-bold text-foreground">
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
             Quick Access Panel
           </div>
           
           <div className="flex flex-wrap items-center justify-center gap-3">
              <Button variant="outline" size="sm" onClick={copyToken} className="gap-2 h-9 text-violet-700 font-semibold border-violet-200 bg-violet-50 hover:bg-violet-100 hover:border-violet-300 transition-colors">
                 {tokenCopied ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                 Copy Token
              </Button>
              <Button variant="outline" size="sm" onClick={() => {
                navigator.clipboard.writeText(project.url || "http://localhost:8080");
                toast.success("Project URL copied!");
              }} className="gap-2 h-9 font-semibold hover:bg-muted transition-colors">
                 <Link className="h-4 w-4" /> Copy Project URL
              </Button>
              <Button size="sm" onClick={() => window.open(project.url || "#", "_blank")} className="gap-2 h-9 font-semibold">
                 <ExternalLink className="h-4 w-4" /> Open Live Project
              </Button>
           </div>
        </div>
      </div>

      {/* Pages grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-violet-100 flex items-center justify-center">
              <Sparkles className="h-3.5 w-3.5 text-violet-600" />
            </div>
            <h2 className="text-base font-semibold text-foreground">Landing Pages</h2>
            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{project.pages.length}</span>
          </div>
          <button
            onClick={() => setCreateOpen(true)}
            className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 bg-primary/5 hover:bg-primary/10 px-3 py-1.5 rounded-lg transition-colors"
          >
            <Plus className="h-3.5 w-3.5" /> Create New Page
          </button>
        </div>

        {project.pages.length === 0 ? (
          <div
            onClick={() => setCreateOpen(true)}
            className="rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center py-20 text-center cursor-pointer hover:border-primary/40 transition-colors"
          >
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center mb-4">
              <Zap className="h-8 w-8 text-white" />
            </div>
            <p className="text-base font-bold text-foreground mb-1">Create your first landing page</p>
            <p className="text-sm text-muted-foreground">Use AI or analyze a website to get started instantly</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {project.pages.map((page) => (
              <PageCard key={page.id} page={page} />
            ))}
            {/* Add card */}
            <div
              onClick={() => setCreateOpen(true)}
              className="rounded-xl border-2 border-dashed border-border bg-card/50 flex flex-col items-center justify-center min-h-[200px] hover:border-primary/40 transition-colors cursor-pointer group"
            >
              <div className="h-10 w-10 rounded-full border border-border bg-background mb-3 flex items-center justify-center group-hover:border-primary/40 transition-colors">
                <Plus className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <p className="text-sm text-muted-foreground group-hover:text-foreground font-medium">Create New Page</p>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

// ─── HTML Generator helper ────────────────────────────────────────────────────
function buildPageHtml(page: LandingPage, project: Project): { body: string; css: string } {
  const result = generateLandingPageHtml({
    businessName: project.name,
    industry: project.category,
    pageType: page.type || "landing",
    businessDesc: project.description,
    targetAudience: "Customers",
    ctaText: "Get Started Now",
    aiPrompt: page.aiPrompt || page.name,
    primaryColor: page.primaryColor || "#7c3aed",
    secondaryColor: page.secondaryColor || "#6366f1",
    accentColor: page.accentColor || "#6366f1",
    websiteUrl: project.url,
  });
  return { body: result.html, css: result.css };
}

export default ProjectDetailPage;
