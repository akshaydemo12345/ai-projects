import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft, Plus, Globe, FileEdit, Rocket, Users as UsersIcon,
  Settings2, Copy, CheckCircle2, X, Sparkles, ExternalLink,
  FileText, Eye, Trash2, Zap, Search, Brain, Loader2, Link,
  Puzzle, Code2, Monitor, Download, Info, Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { projectsApi, pagesApi, aiApi, type Project, type LandingPage } from "@/services/api";
import { toast } from "sonner";
import { copyToClipboard, cleanUrl } from "@/lib/utils";
import { ModernLoader } from "@/components/ui/ModernLoader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

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
  isCreating: boolean;
}

const CreatePageModal = ({ project, onClose, onCreate, isCreating }: CreatePageModalProps) => {
  const [method, setMethod] = useState<CreateMethod>("choose");
  const [aiPrompt, setAiPrompt] = useState("");
  const [analyzeUrl, setAnalyzeUrl] = useState("");
  const [isInspecting, setIsInspecting] = useState(false);
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  // Load project suggestions when modal opens
  useEffect(() => {
    if (method === "ai") {
      loadSuggestions();
    }
  }, [method, project._id]);

  const loadSuggestions = async () => {
    console.log('🔄 Loading suggestions for project:', project._id);
    setIsLoadingSuggestions(true);
    try {
      const res = await aiApi.projectSuggestions(project._id);
      console.log('✅ Suggestions response:', res);
      setSuggestions(res.data.suggestions || []);
    } catch (err: any) {
      console.error("❌ Failed to load suggestions:", err);
      toast.error("Failed to load suggestions. Please try again.");
      setSuggestions([]);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const handleGenerateMagicPrompt = async () => {
    if (!pageName.trim()) {
      toast.error("Please enter a page name first.");
      return;
    }

    setIsGeneratingPrompt(true);
    try {
      const res = await aiApi.generateDescription({
        pageName,
        industry: project.category || "Service",
        projectDesc: project.description,
        currentPrompt: aiPrompt.trim() || undefined
      });
      setAiPrompt(res.data.suggestion);
      toast.success("Magic prompt generated!");
    } catch (err: any) {
      toast.error(err.message || "Failed to generate prompt");
    } finally {
      setIsGeneratingPrompt(false);
    }
  };

  // Page identity fields
  const [pageName, setPageName] = useState("");
  const [pageSlug, setPageSlug] = useState("");
  const [pageWebUrl, setPageWebUrl] = useState("");

  // Per-page branding
  const [primaryColor, setPrimaryColor] = useState(project.primaryColor || "#7c3aed");
  const [secondaryColor, setSecondaryColor] = useState(project.secondaryColor || "#6366f1");
  const [logoPreview, setLogoPreview] = useState<string | null>(project.logoUrl || null);
  const [logoUrl, setLogoUrl] = useState<string | undefined>(project.logoUrl);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setLogoPreview(preview);
    const reader = new FileReader();
    reader.onloadend = () => setLogoUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  const buildPage = (partial: Partial<LandingPage>): Partial<LandingPage> => ({
    name: pageName.trim() || partial.name || "",
    slug: pageSlug.trim() || partial.slug || "",
    metaTitle: "",
    metaDescription: "",
    primaryColor,
    secondaryColor,
    logoUrl,
    accentColor: "#6366f1",
    type: "ppc",
    status: "draft",
    ...partial,
    // User-entered values take priority over AI-generated ones
    ...(pageName.trim() ? { name: pageName.trim() } : {}),
    ...(pageSlug.trim() ? { slug: pageSlug.trim() } : {}),
  });

  const handleAiGenerate = () => {
    if (!pageName.trim()) { toast.error("Please enter a page name."); return; }
    if (!aiPrompt.trim()) { toast.error("Please describe your page."); return; }
    const partial = generateAiPage(aiPrompt, project, { primary: primaryColor, secondary: secondaryColor, logo: logoUrl });
    const page = buildPage({ ...partial, name: pageName.trim(), slug: pageSlug.trim() || partial.slug });
    onCreate(page as LandingPage);
  };

  const handleAnalyze = () => {
    if (!analyzeUrl.trim()) { toast.error("Please enter a URL."); return; }
    const partial = generateAnalyzedPage(analyzeUrl, project, { primary: primaryColor, secondary: secondaryColor, logo: logoUrl });
    const page = buildPage(partial);
    onCreate(page as LandingPage);
  };

  const handleInspect = async () => {
    if (!analyzeUrl.trim()) { toast.error("Please enter a URL first."); return; }

    let targetUrl = analyzeUrl.trim();
    if (!targetUrl.startsWith('http')) targetUrl = 'https://' + targetUrl;
    setAnalyzeUrl(targetUrl);

    setIsInspecting(true);
    try {
      const res = await aiApi.inspect(targetUrl);
      const meta = res.data.metadata;

      if (meta.logo) setLogoPreview(meta.logo);
      if (meta.logo) setLogoUrl(meta.logo);

      if (meta.suggestedColors && meta.suggestedColors.length > 0) {
        setPrimaryColor(meta.suggestedColors[0]);
        if (meta.suggestedColors.length > 1) {
          setSecondaryColor(meta.suggestedColors[1]);
        }
      }

      if (meta.title && !pageName) {
        const cleanName = meta.title.split('|')[0].trim();
        setPageName(cleanName);
        setPageSlug(autoSlug(cleanName));
      }

      toast.success("Website analysis complete!");
    } catch (err: any) {
      toast.error(err.message || "Failed to analyze website");
    } finally {
      setIsInspecting(false);
    }
  };


  return (
    <>
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
            </h2>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* ── Method Selection ── */}
          {method === "choose" && (
            <div className="p-6 space-y-3">
              {/* <p className="text-sm text-muted-foreground mb-4">
                How would you like to create this landing page?
              </p> */}

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
              {/* <button
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
              </button> */}
            </div>
          )}

          {/* ── AI Describe Flow ── */}
          {method === "ai" && (
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">

              {/* Page Identity Fields */}
              <div className="rounded-xl border border-border bg-card p-4 space-y-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Page Info</p>

                <div>
                  <label className="text-sm font-semibold text-foreground mb-1.5 block">
                    Page Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={pageName}
                    onChange={(e) => {
                      setPageName(e.target.value);
                      setPageSlug(autoSlug(e.target.value));
                    }}
                    placeholder="e.g. Roofing Delhi Landing"
                    className="h-10"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-foreground mb-1.5 block">URL Slug</label>
                  <div className="flex items-center gap-0 rounded-md border border-input overflow-hidden">
                    <span className="px-3 py-2 bg-muted text-[10px] font-bold text-muted-foreground border-r border-input whitespace-nowrap uppercase tracking-wider">SLUG</span>
                    <input
                      value={pageSlug}
                      onChange={(e) => setPageSlug(autoSlug(e.target.value))}
                      placeholder="roofing-delhi"
                      className="flex-1 px-3 py-2 text-sm bg-background outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Branding Colors + Logo */}
              <div className="rounded-xl border border-border bg-card p-4 space-y-3">
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
              </div>

              {/* AI Prompt */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold text-foreground block">
                    Describe your page <span className="text-red-500">*</span>
                  </label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-[11px] text-primary hover:bg-primary/5 gap-1.5"
                    disabled={!pageName.trim() || isGeneratingPrompt}
                    onClick={handleGenerateMagicPrompt}
                  >
                    {isGeneratingPrompt ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Sparkles className="h-3.5 w-3.5" />
                    )}
                    Magic Write
                  </Button>
                </div>
                <Textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="e.g. PPC landing page for a roofing company in Delhi targeting homeowners who need emergency roof repair. Include a hero section, trust badges, and a lead form."
                  className="min-h-[100px] resize-none text-sm"
                />
                <p className="text-xs text-muted-foreground mt-1">Be specific — the more detail, the better the output.</p>

                {/* Project-based suggestions */}
                {isLoadingSuggestions ? (
                  <div className="flex items-center gap-2 mt-3">
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Loading suggestions...</span>
                  </div>
                ) : suggestions.length > 0 ? (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {suggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        className="text-xs bg-muted hover:bg-primary/10 text-muted-foreground hover:text-primary border border-border hover:border-primary/30 rounded-full px-3 py-1.5 transition-all"
                        onClick={() => setAiPrompt(suggestion)}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>

              <Button
                onClick={handleAiGenerate}
                disabled={isCreating || !aiPrompt.trim() || !pageName.trim()}
                className="w-full h-11 gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white border-0"
              >
                {isCreating ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> AI is thinking & planning...</>
                ) : (
                  <><Sparkles className="h-4 w-4" /> Generate with AI</>
                )}
              </Button>

            </div>
          )}

          {/* ── Analyze Website Flow ── */}
          {method === "analyze" && (
            <div className="p-6 space-y-4">

              {/* Page Identity Fields (Appears/Updated after scan) */}
              <div className="rounded-xl border border-border bg-card p-4 space-y-4">
                <div>
                  <label className="text-sm font-semibold text-foreground mb-1.5 block">
                    Page Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={pageName}
                    onChange={(e) => {
                      setPageName(e.target.value);
                      setPageSlug(autoSlug(e.target.value));
                    }}
                    placeholder="e.g. My Analyzed Page"
                    className="h-10"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-foreground mb-1.5 block">URL Slug</label>
                  <div className="flex items-center gap-0 rounded-md border border-input overflow-hidden">
                    <span className="px-3 py-2 bg-muted text-[10px] font-bold text-muted-foreground border-r border-input whitespace-nowrap uppercase tracking-wider">SLUG</span>
                    <input
                      value={pageSlug}
                      onChange={(e) => setPageSlug(autoSlug(e.target.value))}
                      placeholder="analyzed-page"
                      className="flex-1 px-3 py-2 text-sm bg-background outline-none"
                    />
                  </div>
                </div>
              </div>

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

              <Button
                onClick={handleAnalyze}
                disabled={isCreating}
                className="w-full h-11 gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white border-0"
              >
                {isCreating ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Analyzing Website...</>
                ) : (
                  <><Search className="h-4 w-4" /> Analyze & Generate</>
                )}
              </Button>

            </div>
          )}
        </div>
      </div>

      {/* Full Page Generating Loader */}
      {isCreating && <ModernLoader />}
    </>
  );
};

// ─── Edit Page Settings Modal ─────────────────────────────────────────────────
interface EditPageModalProps {
  page: LandingPage;
  projectUrl: string;
  preSlug?: string;
  onClose: () => void;
  onSave: (page: LandingPage) => void;
}

const EditPageModal = ({ page, projectUrl, preSlug, onClose, onSave }: EditPageModalProps) => {
  const [name, setName] = useState(page.name);
  const [slug, setSlug] = useState(page.slug);
  const [metaTitle, setMetaTitle] = useState(page.metaTitle ?? "");
  const [metaDescription, setMetaDescription] = useState(page.metaDescription ?? "");
  const [noIndex, setNoIndex] = useState(page.noIndex ?? false);
  const [noFollow, setNoFollow] = useState(page.noFollow ?? false);

  const [primaryColor, setPrimaryColor] = useState(page.primaryColor ?? "#7c3aed");
  const [secondaryColor, setSecondaryColor] = useState(page.secondaryColor ?? "#6366f1");
  const [logoPreview, setLogoPreview] = useState<string | null>(page.logoUrl ?? null);
  const [logoUrl, setLogoUrl] = useState<string | undefined>(page.logoUrl);

  const [mainHeader, setMainHeader] = useState(page.mainHeader ?? "");
  const [mainFooter, setMainFooter] = useState(page.mainFooter ?? "");
  const [thankYouHeader, setThankYouHeader] = useState(page.thankYouHeader ?? "");
  const [thankYouFooter, setThankYouFooter] = useState(page.thankYouFooter ?? "");
  const [thankYouConversionScript, setThankYouConversionScript] = useState(page.thankYouConversionScript ?? "");
  const [thankYouUrl, setThankYouUrl] = useState(page.thankYouUrl ?? "");

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setLogoPreview(preview);
    const reader = new FileReader();
    reader.onloadend = () => setLogoUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  const liveUrl = `${window.location.origin}/${preSlug ? preSlug + '/' : ''}${slug || "page-slug"}`;

  const handleSave = () => {
    if (!name.trim() || !slug.trim()) { toast.error("Name and slug are required."); return; }
    onSave({
      ...page,
      name: name.trim(),
      slug: slug.trim(),
      metaTitle,
      metaDescription,
      noIndex,
      noFollow,
      primaryColor,
      secondaryColor,
      logoUrl,
      mainHeader,
      mainFooter,
      thankYouHeader,
      thankYouFooter,
      thankYouConversionScript,
      thankYouUrl
    });
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

        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Page Name *</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Roofing Delhi Landing" className="h-10" />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">URL Slug *</label>
            <div className="flex items-center gap-0 rounded-md border border-input overflow-hidden">
              <span className="px-3 py-2 bg-muted text-[10px] font-bold text-muted-foreground border-r border-input whitespace-nowrap uppercase tracking-wider">URL</span>
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

          <Tabs defaultValue="main" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 shadow-sm border border-border">
              <TabsTrigger value="main" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-bold">Main Page</TabsTrigger>
              <TabsTrigger value="thankyou" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-bold">Thank You Page</TabsTrigger>
            </TabsList>

            <TabsContent value="main" className="space-y-4 pt-2">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-bold text-foreground mb-1.5 block">Header Script</label>
                  <Textarea
                    value={mainHeader}
                    onChange={(e) => setMainHeader(e.target.value)}
                    placeholder="<!-- Paste custom header scripts, CSS, or pixel scripts here -->"
                    className="min-h-[70px] font-mono text-xs bg-muted/30"
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-foreground mb-1.5 block">Footer Script</label>
                  <Textarea
                    value={mainFooter}
                    onChange={(e) => setMainFooter(e.target.value)}
                    placeholder="<!-- Paste custom footer scripts or tracking code here -->"
                    className="min-h-[70px] font-mono text-xs bg-muted/30"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-border/50">
                <label className="text-sm font-bold text-foreground mb-1.5 block">Meta Title</label>
                <Input value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} placeholder="SEO title for search engines" className="h-10 text-sm" />
                <p className="text-[10px] text-muted-foreground mt-1">Ideal: 50–60 characters</p>
              </div>

              <div>
                <label className="text-sm font-bold text-foreground mb-1.5 block">Meta Description</label>
                <Textarea
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder="Page description for search results..."
                  className="min-h-[85px] resize-none text-sm"
                />
                <p className="text-[10px] text-muted-foreground mt-1 mb-2">Ideal: 150–160 characters</p>
              </div>

              <div className="pt-2 border-t border-border/50 space-y-3">
                <p className="text-sm font-bold text-foreground">Search Engine Visibility</p>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="noIndex"
                    checked={noIndex}
                    onCheckedChange={(checked) => setNoIndex(!!checked)}
                  />
                  <label htmlFor="noIndex" className="text-sm text-foreground cursor-pointer select-none">
                    Hide from search engines (noindex)
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="noFollow"
                    checked={noFollow}
                    onCheckedChange={(checked) => setNoFollow(!!checked)}
                  />
                  <label htmlFor="noFollow" className="text-sm text-foreground cursor-pointer select-none">
                    Do not follow links (nofollow)
                  </label>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="thankyou" className="space-y-4 pt-2">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-bold text-foreground mb-1.5 block">Header Script (Thank You)</label>
                  <Textarea
                    value={thankYouHeader}
                    onChange={(e) => setThankYouHeader(e.target.value)}
                    placeholder="<!-- Add custom code to the Thank You page header -->"
                    className="min-h-[70px] font-mono text-xs bg-muted/30"
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-foreground mb-1.5 block">Footer Script (Thank You)</label>
                  <Textarea
                    value={thankYouFooter}
                    onChange={(e) => setThankYouFooter(e.target.value)}
                    placeholder="<!-- Add custom code to the Thank You page footer -->"
                    className="min-h-[70px] font-mono text-xs bg-muted/30"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-border/50">
                <label className="text-sm font-bold text-foreground mb-1.5 block">Thank You URL (Redirect)</label>
                <Input
                  value={thankYouUrl}
                  onChange={(e) => setThankYouUrl(e.target.value)}
                  placeholder="https://example.com/thank-you"
                  className="h-10 text-sm"
                />
                <p className="text-[10px] text-muted-foreground mt-1">The external URL where visitors land after form submission.</p>
              </div>
            </TabsContent>
          </Tabs>

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

// ─── Usage Detail Modal ──────────────────────────────────────────────────────
interface UsageModalProps {
  page: LandingPage;
  onClose: () => void;
}

const UsageModal = ({ page, onClose }: UsageModalProps) => {
  const usage = page.aiUsage;
  const history = page.aiUsageHistory || [];

  if (!usage && history.length === 0) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-background rounded-2xl border border-border shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-border bg-muted/30">
          <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
            <Zap className="h-4 w-4 text-amber-500" />
          </div>
          <div className="flex-1">
            <h2 className="text-sm font-bold text-foreground">AI Generation Timeline</h2>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Usage History & Tracking</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {/* Summary Card */}
          {usage && (
            <div className="p-6 border-b border-border bg-muted/10">
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight mb-1">Total Consumption</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-mono font-black text-foreground">{(usage.totalTokens || 0).toLocaleString()}</span>
                    <span className="text-[10px] text-muted-foreground font-bold uppercase">Tokens</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight mb-1">Total Estimated Cost</p>
                  <p className="text-3xl font-mono font-black text-emerald-600">
                    ${(usage.cost || 0).toFixed(4)}
                  </p>
                </div>
              </div>

              <div className="bg-background rounded-xl p-3 border border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[11px] font-bold text-foreground">Last Generation</span>
                </div>
                <span className="text-[11px] font-medium text-muted-foreground">
                  {usage.lastUsageAt ? new Date(usage.lastUsageAt).toLocaleString() : 'N/A'}
                </span>
              </div>
            </div>
          )}

          {/* History List */}
          <div className="p-6 space-y-4">
            <p className="text-xs font-bold text-foreground flex items-center gap-2">
              <Activity className="h-3.5 w-3.5 text-primary" />
              Generation History
            </p>

            <div className="space-y-3">
              {history.length > 0 ? (
                history.slice().reverse().map((item, index) => (
                  <div key={index} className="relative pl-6 pb-2 last:pb-0">
                    {/* Timeline Connector */}
                    {index !== history.length - 1 && (
                      <div className="absolute left-1.5 top-5 bottom-0 w-px bg-border" />
                    )}
                    {/* Timeline Dot */}
                    <div className="absolute left-0 top-1.5 h-3 w-3 rounded-full border-2 border-primary bg-background shadow-sm" />

                    <div className="bg-muted/40 rounded-xl p-3 border border-border/50 hover:border-primary/30 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-[11px] font-bold text-foreground">{item.action || 'AI Call'}</p>
                          <p className="text-[9px] text-muted-foreground flex items-center gap-1">
                            <Monitor className="h-2.5 w-2.5" /> {item.model?.replace('claude-3-', '') || 'Claude'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[11px] font-bold text-foreground">${(item.cost || 0).toFixed(4)}</p>
                          <p className="text-[9px] text-muted-foreground uppercase font-bold">{new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[9px] font-medium text-muted-foreground border-t border-border/30 pt-2">
                        <div className="flex gap-3">
                          <span>In: <span className="text-foreground font-bold">{item.promptTokens?.toLocaleString()}</span></span>
                          <span>Out: <span className="text-foreground font-bold">{item.completionTokens?.toLocaleString()}</span></span>
                        </div>
                        <span className="bg-background px-1.5 py-0.5 rounded border border-border/50">
                          Total: <span className="text-foreground font-bold">{item.totalTokens?.toLocaleString()}</span>
                        </span>
                      </div>
                      <p className="text-[9px] text-muted-foreground mt-2 opacity-60">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : usage ? (
                <div className="text-center py-4 bg-muted/20 rounded-xl border border-dashed border-border">
                  <p className="text-[10px] text-muted-foreground">Legacy record (No detailed history)</p>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-xs text-muted-foreground">No history available</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-muted/20 border-t border-border">
          <Button variant="outline" className="w-full h-10 border-border bg-background shadow-sm hover:bg-muted" onClick={onClose}>
            Close Details
          </Button>
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

type IntegrationTab = "wordpress" | "script";

const PublishModal = ({ page, project, onClose, onPublished }: PublishModalProps) => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<IntegrationTab>("wordpress");
  const [urlCopied, setUrlCopied] = useState(false);
  const [tokenCopiedLocal, setTokenCopiedLocal] = useState(false);
  const [scriptCopied, setScriptCopied] = useState(false);
  const [published, setPublished] = useState(false);

  const publishUrl = page.publishedUrl || `${window.location.origin}/${project.preSlug ? project.preSlug + '/' : ''}${page.slug}`;
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://would-insulation-professional-understood.trycloudflare.com';
  const scriptCode = `<script src="${apiBaseUrl}/embed.js" data-token="${project.apiToken}" data-page="${project.preSlug ? project.preSlug + '/' : ''}${page.slug}" async></script>`;

  const handlePublish = () => {
    onPublished({ ...page, status: "published", publishedUrl: publishUrl });
    setPublished(true);
  };

  const copyUrl = async () => {
    const success = await copyToClipboard(publishUrl);
    if (success) {
      setUrlCopied(true);
      toast.success("URL copied!");
      setTimeout(() => setUrlCopied(false), 2000);
    }
  };

  const tabs = [
    { id: "wordpress" as const, label: "WordPress Plugin" },
    { id: "script" as const, label: "Script Embed" },
  ];

  // ── Success Screen ──────────────────────────────────────────────────────────
  if (published) {
    return (
      <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-background rounded-2xl border border-border shadow-2xl overflow-hidden">
          {/* Animated header band */}
          <div className="h-2 w-full bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400" />

          <div className="p-8 flex flex-col items-center text-center">
            {/* Rocket animation */}
            <div
              className="h-20 w-20 rounded-full flex items-center justify-center mb-5"
              style={{
                background: "linear-gradient(135deg, #10b981, #059669)",
                boxShadow: "0 0 0 8px rgba(16,185,129,.15), 0 0 0 16px rgba(16,185,129,.07)",
                animation: "pulse 2s infinite",
              }}
            >
              <Rocket className="h-9 w-9 text-white" style={{ transform: "rotate(-45deg)" }} />
            </div>

            <h2 className="text-2xl font-bold text-foreground mb-1">Your Site is Published!</h2>
            <p className="text-sm text-muted-foreground mb-5">
              🎉 Congratulations! <span className="font-semibold text-foreground">{page.name}</span> is now live.
            </p>

            {/* Live URL chip */}
            <div className="w-full flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl px-4 py-3 mb-6">
              <ExternalLink className="h-4 w-4 text-emerald-600 flex-shrink-0" />
              <a
                href={publishUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-sm font-mono text-emerald-700 dark:text-emerald-400 truncate hover:underline text-left"
              >
                {publishUrl}
              </a>
              <button onClick={copyUrl} className="text-emerald-600 hover:text-emerald-800 flex-shrink-0 transition-colors">
                {urlCopied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>

            {/* Action buttons */}
            <div className="w-full flex flex-col gap-3">
              <Button
                className="w-full h-11 gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white border-0 shadow-md"
                onClick={() => { onClose(); navigate("/dashboard"); }}
              >
                <ArrowLeft className="h-4 w-4" />
                Go to Dashboard
              </Button>

              <a
                href={publishUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full"
              >
                <Button variant="outline" className="w-full h-11 gap-2">
                  <ExternalLink className="h-4 w-4" />
                  View Live Page
                </Button>
              </a>

              <button
                onClick={onClose}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors mt-1"
              >
                Stay on this project
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Publish Setup Screen ────────────────────────────────────────────────────
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

        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
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
                  className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${tab === t.id
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
                  { num: 1, text: "Download and install our WordPress plugin:" },
                  { num: 2, text: "In plugin settings, paste your token:" },
                  { num: 3, text: "Save settings — pages will auto-sync" },
                ].map((s) => (
                  <div key={s.num} className="flex gap-3 items-start">
                    <span className="h-5 w-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{s.num}</span>
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">{s.text}</p>
                      {s.num === 1 && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-[10px] mt-2 gap-1.5"
                          onClick={() => {
                            const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://would-insulation-professional-understood.trycloudflare.com';
                            window.open(`${apiBaseUrl}/plugin/download`, '_blank');
                            toast.success("Downloading plugin...");
                          }}
                        >
                          <Download className="h-3 w-3" /> Download Plugin
                        </Button>
                      )}
                      {s.num === 2 && (
                        <div className="flex items-center gap-2 bg-muted rounded-lg px-3 py-1.5 mt-1.5 cursor-pointer hover:bg-muted/80 transition-all active:scale-95"
                          onClick={async () => {
                            const success = await copyToClipboard(project.apiToken);
                            if (success) {
                              setTokenCopiedLocal(true);
                              toast.success("Token copied!");
                              setTimeout(() => setTokenCopiedLocal(false), 2000);
                            }
                          }}>
                          <span className="text-xs font-mono text-foreground">{project.apiToken}</span>
                          {tokenCopiedLocal ? <CheckCircle2 className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3 text-muted-foreground" />}
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
                  <button
                    onClick={async () => {
                      const success = await copyToClipboard(scriptCode);
                      if (success) {
                        setScriptCopied(true);
                        toast.success("Code copied!");
                        setTimeout(() => setScriptCopied(false), 2000);
                      }
                    }}
                    className="text-xs text-primary flex items-center gap-1 hover:text-primary/80 transition-all active:scale-95"
                  >
                    {scriptCopied ? <><CheckCircle2 className="h-3 w-3" /> Copied!</> : <><Copy className="h-3 w-3" /> Copy</>}
                  </button>
                </div>
                <pre className="text-[11px] font-mono bg-muted rounded-lg p-3 overflow-x-auto whitespace-pre-wrap break-all text-foreground">{scriptCode}</pre>
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

// ─── Edit Project Modal ──────────────────────────────────────────────────────
interface EditProjectModalProps {
  project: Project;
  onClose: () => void;
  onSave: (data: Partial<Project>) => void;
}

const EditProjectModal = ({ project, onClose, onSave }: EditProjectModalProps) => {
  const [name, setName] = useState(project.name);
  const [websiteUrl, setWebsiteUrl] = useState(project.url || "");
  const [preSlug, setPreSlug] = useState(project.preSlug || "");
  const [category, setCategory] = useState(project.category || "SaaS");

  const handleSave = () => {
    if (!name.trim()) { toast.error("Project name is required."); return; }
    onSave({ name, url: websiteUrl, preSlug, category });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-background rounded-2xl border border-border shadow-2xl overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-border">
          <Settings2 className="h-5 w-5 text-primary" />
          <h2 className="text-base font-semibold text-foreground flex-1">Project Settings</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Project Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="My Awesome Project" />
          </div>
          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Website URL (Client's Site)</label>
            <Input value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} placeholder="https://example.com" />
          </div>
          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Pre Slug (Optional URL Prefix)</label>
            <Input value={preSlug} onChange={(e) => setPreSlug(e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''))} placeholder="e.g. landing-pages" />
            <p className="text-[10px] text-muted-foreground mt-1.5 italic">
              Example URL: {window.location.origin}/{preSlug ? preSlug + '/' : ''}page-slug
            </p>
          </div>
          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:ring-2 focus:ring-primary/20 outline-none"
            >
              <option value="SaaS">SaaS</option>
              <option value="Agency">Agency</option>
              <option value="E-commerce">E-commerce</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Real Estate">Real Estate</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
        <div className="flex gap-3 px-6 py-4 border-t border-border bg-muted/20">
          <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button className="flex-1 bg-primary text-white" onClick={handleSave}>Save Changes</Button>
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
  const queryClient = useQueryClient();

  // Queries
  const { data: project, isLoading, error } = useQuery({
    queryKey: ["project", id],
    queryFn: () => projectsApi.getById(id!),
    enabled: !!id,
    refetchInterval: 5000, // Live-updating dynamic data polling
  });

  const [createOpen, setCreateOpen] = useState(false); // kept for compatibility but unused
  const [editingPage, setEditingPage] = useState<LandingPage | null>(null);
  const [publishingPage, setPublishingPage] = useState<LandingPage | null>(null);
  const [deletePageId, setDeletePageId] = useState<string | null>(null);
  const [viewingUsagePage, setViewingUsagePage] = useState<LandingPage | null>(null);
  const [tokenCopied, setTokenCopied] = useState(false);
  // Integration panel state
  const [integTab, setIntegTab] = useState<"wordpress" | "script">("wordpress");
  const [integTokenCopied, setIntegTokenCopied] = useState(false);
  const [integScriptCopied, setIntegScriptCopied] = useState(false);
  const [integrationOpen, setIntegrationOpen] = useState(false);
  const [editProjectOpen, setEditProjectOpen] = useState(false);

  // Mutations
  const createPageMutation = useMutation({
    mutationFn: (page: Partial<LandingPage>) => pagesApi.create(id!, page),
    onSuccess: (newPage) => {
      queryClient.invalidateQueries({ queryKey: ["project", id] });
      setCreateOpen(false);
      toast.success("Page created!");
      // Handle navigation to editor or similar
      navigate(`/editor/${id}/${newPage._id}`);
    },
    onError: (err: any) => toast.error(err.message || "Failed to create page"),
  });

  const deletePageMutation = useMutation({
    mutationFn: (pageId: string) => pagesApi.delete(id!, pageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project", id] });
      setDeletePageId(null);
      toast.success("Page deleted");
    },
    onError: () => toast.error("Failed to delete page"),
  });

  const updatePageMutation = useMutation({
    mutationFn: (page: LandingPage) => pagesApi.update(id!, page._id, page),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project", id] });
      setEditingPage(null);
      setPublishingPage(null);
      toast.success("Page updated");
    },
    onError: () => toast.error("Failed to update page"),
  });

  const updateProjectMutation = useMutation({
    mutationFn: (data: Partial<Project>) => projectsApi.update(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project", id] });
      setEditProjectOpen(false);
      toast.success("Project updated");
    },
    onError: () => toast.error("Failed to update project"),
  });

  useEffect(() => {
    if (project) {
      const pubId = searchParams.get("publish");
      if (pubId) {
        const page = project.pages?.find(p => p._id === pubId);
        if (page) {
          setPublishingPage(page);
        }
        navigate(`/dashboard/projects/${project._id}`, { replace: true });
      }
    }
  }, [project, searchParams, navigate]);

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );

  if (error || !project) return (
    <div className="text-center py-20">
      <h2 className="text-xl font-bold mb-2">Project not found</h2>
      <Button onClick={() => navigate("/dashboard")}>Back to Projects</Button>
    </div>
  );

  const handlePageCreated = (page: LandingPage) => {
    createPageMutation.mutate(page);
  };

  const handleEditSave = (page: LandingPage) => {
    updatePageMutation.mutate(page);
  };

  const handlePublished = (page: LandingPage) => {
    updatePageMutation.mutate({ ...page, status: "published" });
  };

  const confirmDelete = () => {
    if (deletePageId) {
      deletePageMutation.mutate(deletePageId);
    }
  };

  const copyToken = async () => {
    if (project.apiToken) {
      const success = await copyToClipboard(project.apiToken);
      if (success) {
        setTokenCopied(true);
        toast.success("Token copied!");
        setTimeout(() => setTokenCopied(false), 2000);
      }
    }
  };

  // Computed stats
  const pages = project.pages || [];
  const publishedCount = pages.filter(p => p.status === "published").length;
  const draftCount = pages.filter(p => p.status !== "published").length;
  const totalLeads = project.leadCount || pages.reduce((sum, p) => sum + ((p as any).leads?.length || 0), 0);
  const totalViews = (project as any).views || pages.reduce((sum, p) => sum + (p.views || 0), 0);

  const scriptCode = `<script src="${import.meta.env.VITE_API_BASE_URL || 'https://would-insulation-professional-understood.trycloudflare.com'}/embed.js" data-token="${project?.apiToken}" async></script>`;



  return (
    <div className="flex-1 overflow-y-auto" style={{ background: "linear-gradient(180deg, hsl(var(--background)) 0%, hsl(var(--muted)/0.3) 100%)" }}>

      {/* Modals */}
      {editProjectOpen && (
        <EditProjectModal
          project={project}
          onClose={() => setEditProjectOpen(false)}
          onSave={(data) => updateProjectMutation.mutate(data)}
        />
      )}
      {/* CreatePageModal removed – now a full page at /dashboard/projects/:id/create-page */}
      {editingPage && (
        <EditPageModal
          page={editingPage}
          projectUrl={project.url || "https://yoursite.com"}
          preSlug={project.preSlug}
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
      {viewingUsagePage && (
        <UsageModal
          page={viewingUsagePage}
          onClose={() => setViewingUsagePage(null)}
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
                Are you absolutely sure? This action cannot be undone and will permanently remove this landing page.
              </p>
            </div>
            <div className="p-4 bg-muted/30 border-t border-border flex justify-end gap-3">
              <Button variant="outline" onClick={() => setDeletePageId(null)}>Cancel</Button>
              <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={confirmDelete}>Delete Page</Button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Page Top Bar / Breadcrumb ─── */}
      <div className="px-8 pt-6 pb-4 border-b border-border flex items-center gap-4">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> All Projects
        </button>
        <span className="text-muted-foreground/40">/</span>
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {project.logoUrl ? (
            <img src={project.logoUrl} alt="logo" className="h-7 w-7 rounded object-contain border border-border bg-white" />
          ) : (
            <div className="h-7 w-7 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: `linear-gradient(135deg, #7c3aed, #6366f1)` }}>
              <Globe className="h-3.5 w-3.5 text-white" />
            </div>
          )}
          <h1 className="text-lg font-bold text-foreground truncate">{project.name}</h1>
          <button
            onClick={() => setEditProjectOpen(true)}
            className="p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            title="Project Settings"
          >
            <Settings2 className="h-3.5 w-3.5" />
          </button>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full flex-shrink-0">{project.category}</span>
        </div>
        <a href={cleanUrl(project.websiteUrl)} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors flex-shrink-0">
          <ExternalLink className="h-3.5 w-3.5" /> {project.websiteUrl}
        </a>
      </div>

      {/* ─── MAIN CONTENT (full-width, single column) ─── */}
      <div className="max-w-[1800px] mx-auto px-8 py-6 space-y-8">

        {/* ─── Stats Summary Bar ─── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total Pages", value: pages.length, icon: <FileText className="h-4 w-4" />, color: "from-violet-500 to-indigo-500", bg: "bg-violet-50 dark:bg-violet-950/30", textColor: "text-violet-700 dark:text-violet-400" },
            { label: "Published", value: publishedCount, icon: <Globe className="h-4 w-4" />, color: "from-emerald-500 to-teal-500", bg: "bg-emerald-50 dark:bg-emerald-950/30", textColor: "text-emerald-700 dark:text-emerald-400" },
            { label: "Total Leads", value: totalLeads, icon: <UsersIcon className="h-4 w-4" />, color: "from-amber-500 to-orange-500", bg: "bg-amber-50 dark:bg-amber-950/30", textColor: "text-amber-700 dark:text-amber-400" },

          ].map((stat) => (
            <div key={stat.label} className={`rounded-xl border border-border ${stat.bg} p-4 flex items-center gap-3 transition-all hover:shadow-md`}>
              <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                <span className="text-white">{stat.icon}</span>
              </div>
              <div>
                <p className={`text-2xl font-bold ${stat.textColor}`}>{stat.value}</p>
                <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ─── Main Grid Layout: Landing Pages (Left) & Integration (Right) ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 items-start">

          {/* ─── Left Side: Landing Pages List ─── */}
          <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden min-h-[500px]">
            {/* Section Header */}
            <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-card">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center shadow-sm">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-foreground">Landing Pages</h2>
                  <p className="text-xs text-muted-foreground">{pages.length} page{pages.length !== 1 ? "s" : ""} in this project</p>
                </div>
              </div>
              <Button
                onClick={() => navigate(`/dashboard/projects/${id}/create-page`)}
                className="h-9 gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white border-0 shadow-sm text-sm"
              >
                <Plus className="h-4 w-4" /> New Page
              </Button>
            </div>

            {/* Table Header */}
            {pages.length > 0 && (
              <div className="hidden md:grid grid-cols-[1fr_60px_80px_100px_140px] gap-4 px-6 py-2.5 border-b border-border bg-muted/40 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                <span>Page Name</span>
                <span className="text-center">View</span>
                <span className="text-center">Leads</span>
                <span className="text-center">Usage</span>
                <span className="text-right">Actions</span>
              </div>
            )}

            {/* Page Rows */}
            <div className="divide-y divide-border">
              {pages.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center mb-4 shadow-lg">
                    <Zap className="h-7 w-7 text-white" />
                  </div>
                  <p className="text-base font-bold text-foreground mb-1">No pages yet</p>
                  <p className="text-sm text-muted-foreground mb-5">Create your first landing page to get started</p>
                  <Button
                    onClick={() => navigate(`/dashboard/projects/${id}/create-page`)}
                    className="gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white border-0"
                  >
                    <Plus className="h-4 w-4" /> Create Landing Page
                  </Button>
                </div>
              ) : (
                pages.map((page) => (
                  <div
                    key={page._id}
                    className="grid grid-cols-1 md:grid-cols-[1fr_60px_80px_100px_140px] gap-3 md:gap-4 items-center px-6 py-4 hover:bg-muted/30 transition-all group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="h-10 w-10 rounded-xl flex-shrink-0 flex items-center justify-center shadow-sm"
                        style={{ background: `linear-gradient(135deg, ${page.primaryColor || '#7c3aed'}, ${page.secondaryColor || '#6366f1'})` }}
                      >
                        <FileText className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 overflow-hidden">
                          <span className="text-sm font-bold text-foreground truncate">{page.name || "Untitled Page"}</span>
                          {page.generationMethod && (
                            <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-md bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-400 flex-shrink-0">
                              {page.generationMethod === "ai" ? "✨ AI" : "🔍 Analyzed"}
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-muted-foreground font-mono truncate mt-0.5 opacity-70">
                          /{project.preSlug ? project.preSlug + '/' : ''}{page.slug}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-start md:justify-center">
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          const preSlugPrefix = project.preSlug ? project.preSlug + '/' : '';
                          const url = page.status === "published"
                            ? `/${preSlugPrefix}${page.slug}`
                            : `/preview/${preSlugPrefix}${page.slug}`;
                          window.open(url, '_blank');
                        }}
                        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors cursor-pointer p-1 rounded hover:bg-primary/5"
                        title={page.status === "published" ? "View Live Page" : "Preview Draft"}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </div>
                    </div>

                    <div className="flex items-center justify-start md:justify-center">
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/dashboard/leads?project=${project._id}&page=${page._id}`);
                        }}
                        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors cursor-pointer p-1 rounded hover:bg-primary/5"
                        title="View Leads"
                      >
                        <UsersIcon className="h-3 w-3" />
                        <span>{(page as any).leads?.length || 0}</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-center justify-start md:justify-center">
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          if (page.aiUsage) setViewingUsagePage(page);
                        }}
                        className={`flex flex-col items-center gap-0.5 text-[9px] text-muted-foreground p-1 px-2 rounded-lg transition-all ${page.aiUsage ? 'hover:bg-amber-500/10 cursor-pointer group/usage' : 'opacity-40'}`}
                        title={page.aiUsage ? "Click to view detailed breakdown" : "No usage data available"}
                      >
                        {page.aiUsage ? (
                          <>
                            <div className="flex items-center gap-1 font-mono group-hover/usage:text-amber-600">
                              <Eye className="h-3 w-3 text-amber-500" />
                              <span className="font-bold">{page.aiUsage.totalTokens?.toLocaleString() || 0}</span>
                            </div>
                            <span className="text-emerald-600 font-bold">
                              ${(page.aiUsage.cost || 0).toFixed(4)}
                            </span>
                          </>
                        ) : (
                          <span>-</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 justify-end">
                      <Button variant="ghost" size="sm" onClick={() => navigate(`/editor/${project._id}/${page._id}`)} className="h-8 w-8 p-0 text-muted-foreground hover:text-primary hover:bg-primary/10" title="Edit Content"><FileEdit className="h-3.5 w-3.5" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => setPublishingPage(page)} className="h-8 w-8 p-0 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50" title="Publish"><Rocket className="h-3.5 w-3.5" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => setEditingPage(page)} className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted" title="Settings"><Settings2 className="h-3.5 w-3.5" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => setDeletePageId(page._id)} className="h-8 w-8 p-0 text-muted-foreground hover:text-red-500 hover:bg-red-50" title="Delete"><Trash2 className="h-3.5 w-3.5" /></Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* ─── Right Side: Integration & Embedding ─── */}
          <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-card flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-sm">
                  <Link className="h-4 w-4 text-white" />
                </div>
                <h2 className="text-base font-bold text-foreground">Integration & Embedding</h2>
              </div>
              <p className="text-[11px] text-muted-foreground ml-11">WordPress or Script</p>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex gap-1 bg-muted p-1 rounded-xl">
                {([
                  { id: "wordpress" as const, icon: <Puzzle className="h-3.5 w-3.5" />, label: "WP" },
                  { id: "script" as const, icon: <Code2 className="h-3.5 w-3.5" />, label: "Script" },
                ]).map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setIntegTab(m.id)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all ${integTab === m.id ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"}`}
                  >
                    {m.icon} {m.label}
                  </button>
                ))}
              </div>

              <div className="space-y-5">
                {integTab === "wordpress" && (
                  <div className="space-y-4">
                    {[
                      {
                        num: 1, title: "Download Plugin", desc: "Install our WP plugin from the dashboard.", extra: (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-[10px] mt-1.5 gap-1.5"
                            onClick={() => {
                              const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://would-insulation-professional-understood.trycloudflare.com';
                              window.open(`${apiBaseUrl}/plugin/download`, '_blank');
                              toast.success("Downloading plugin...");
                            }}
                          >
                            <Download className="h-3 w-3" /> Download
                          </Button>
                        )
                      },
                      { num: 2, title: "Enter Token", desc: "Paste your API token in settings.", extra: <div onClick={copyToken} className="flex items-center gap-2 bg-muted border border-border rounded-lg px-2.5 py-1.5 mt-1.5 cursor-pointer w-full justify-between"><span className="text-[10px] font-mono truncate max-w-[150px]">{project.apiToken}</span><Copy className="h-3 w-3 text-muted-foreground" /></div> },
                      { num: 3, title: "Sync Pages", desc: "Pages will auto-sync to your WP site." },
                    ].map((s) => (
                      <div key={s.num} className="flex gap-3">
                        <div className="h-6 w-6 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{s.num}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-foreground">{s.title}</p>
                          <p className="text-[11px] text-muted-foreground leading-relaxed">{s.desc}</p>
                          {s.extra}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {integTab === "script" && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <p className="text-xs font-medium">Add to &lt;head&gt;</p>
                      <Button variant="ghost" size="sm" className="h-7 text-[10px] gap-1.5" onClick={() => copyToClipboard(scriptCode)}><Copy className="h-3 w-3" /> Copy</Button>
                    </div>
                    <pre className="text-[10px] font-mono bg-muted rounded-lg p-3 overflow-x-auto whitespace-pre-wrap break-all border border-border">{scriptCode}</pre>
                  </div>
                )}


              </div>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
};

export default ProjectDetailPage;