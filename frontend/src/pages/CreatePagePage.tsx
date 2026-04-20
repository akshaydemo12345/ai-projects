import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft, Sparkles, Brain, Loader2, X, Upload,
  Figma, LayoutTemplate, CheckCircle2, ChevronRight, Zap
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { projectsApi, pagesApi, aiApi, type Project, type LandingPage } from "@/services/api";
import { toast } from "sonner";
import { ModernLoader } from "@/components/ui/ModernLoader";
import { saasHeroHtml } from "../templates/saasHero";

// ─── helpers ─────────────────────────────────────────────────────────────────
const autoSlug = (v: string) =>
  v.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

const generateAiPage = (
  prompt: string,
  project: Project,
  branding: { primary: string; secondary: string; logo?: string }
): Partial<LandingPage> => ({
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

// ─── Template definitions ─────────────────────────────────────────────────────
// Replace these image URLs with your own once ready
const LANDING_TEMPLATES = [
  {
    id: "saas-hero",
    name: "SaaS Hero",
    tag: "SaaS",
    img: "/templates/Desktop_Thumbnail.png",
    gradient: "linear-gradient(135deg, #7c3aed 0%, #6366f1 100%)",
    prompt:
      "Create a high-converting, fully mobile-responsive SaaS landing page with a bold hero section, animated feature highlights, testimonials, pricing table, and a strong CTA for free trial sign-up.",
  },
  {
    id: "lead-gen",
    name: "Lead Gen",
    tag: "PPC",
    img: "/templates/Desktop_Thumbnail2.png",
    gradient: "linear-gradient(135deg, #ea580c 0%, #f43f5e 100%)",
    prompt:
      "Create a professional, mobile-first lead generation landing page with a headline, trust badges, a short lead capture form above the fold, social proof, and FAQ section.",
  },
  {
    id: "agency",
    name: "Agency",
    tag: "Agency",
    img: "/templates/Desktop_Thumbnail3.png",
    gradient: "linear-gradient(135deg, #0891b2 0%, #2563eb 100%)",
    prompt:
      "Create a premium, responsive agency landing page with a cinematic hero, portfolio grid, client logos, team section, services offered, and contact form.",
  },
  {
    id: "real-estate",
    name: "Real Estate",
    tag: "Property",
    img: "/templates/Desktop_Thumbnail4.png",
    gradient: "linear-gradient(135deg, #059669 0%, #0d9488 100%)",
    prompt:
      "Create a modern, responsive real estate landing page with a property hero image, key stats, features list, photo gallery placeholder, agent contact form, and location section.",
  },
];


type CreationMethod = "ai" | "figma" | "template";

// ─── CreatePagePage ───────────────────────────────────────────────────────────
const CreatePagePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: project, isLoading } = useQuery({
    queryKey: ["project", id],
    queryFn: () => projectsApi.getById(id!),
    enabled: !!id,
  });

  // Fetch dynamic suggestions based on project data
  const { data: suggestionsData } = useQuery({
    queryKey: ["project-suggestions", id],
    queryFn: () => aiApi.projectSuggestions(id!),
    enabled: !!id,
  });

  const dynamicSuggestions = suggestionsData?.data?.suggestions || [];

  const [activeMethod, setActiveMethod] = useState<CreationMethod>("ai");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const [pageName, setPageName] = useState("");
  const [pageSlug, setPageSlug] = useState("");
  const [aiPrompt, setAiPrompt] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#7c3aed");
  const [secondaryColor, setSecondaryColor] = useState("#6366f1");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | undefined>(undefined);
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false);
  const [figmaFile, setFigmaFile] = useState<File | null>(null);
  const [figmaPreview, setFigmaPreview] = useState<string | null>(null);
  const [figmaBase64, setFigmaBase64] = useState<string | null>(null);

  useEffect(() => {
    if (project) {
      setPrimaryColor(project.primaryColor || "#7c3aed");
      setSecondaryColor(project.secondaryColor || "#6366f1");
      if (project.logoUrl) { setLogoPreview(project.logoUrl); setLogoUrl(project.logoUrl); }
    }
  }, [project]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setLogoPreview(URL.createObjectURL(file));
    const r = new FileReader(); r.onloadend = () => setLogoUrl(r.result as string); r.readAsDataURL(file);
  };

  const handleFigmaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setFigmaFile(file);
    if (file.type.startsWith("image/")) {
      setFigmaPreview(URL.createObjectURL(file));
      const reader = new FileReader();
      reader.onloadend = () => setFigmaBase64(reader.result as string);
      reader.readAsDataURL(file);
    }
    toast.success(`"${file.name}" selected`);
  };

  const handleTemplateSelect = (tpl: typeof LANDING_TEMPLATES[0]) => {
    setSelectedTemplate(tpl.id);
    setAiPrompt(tpl.prompt);
  };

  const [showLoader, setShowLoader] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [createdPage, setCreatedPage] = useState<any>(null);

  const createPageMutation = useMutation({
    mutationFn: async (page: Partial<LandingPage>) => {
      // Add a 60 second timeout for safety
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Generation timed out. Please try again.")), 60000)
      );
      return Promise.race([pagesApi.create(id!, page), timeoutPromise]) as Promise<LandingPage>;
    },
    onSuccess: (newPage) => {
      queryClient.invalidateQueries({ queryKey: ["project", id] });
      setCreatedPage(newPage);
      setIsComplete(true);
    },
    onError: (err: any) => {
      console.error("Mutation Error:", err);
      toast.error(err.message || "Failed to create page");
      setShowLoader(false);
      setIsComplete(false);
    },
  });

  const handleGenerateMagicPrompt = async () => {
    if (!pageName.trim()) { toast.error("Enter a page name first."); return; }
    setIsGeneratingPrompt(true);
    try {
      const res = await aiApi.generateDescription({ 
        pageName, 
        industry: project?.category || "Service", 
        projectDesc: project?.description,
        currentPrompt: aiPrompt.trim() || undefined
      });
      
      if (aiPrompt.trim()) {
        toast.success("Prompt expanded and improved!");
      } else {
        toast.success("Magic prompt generated!");
      }
      
      const suggestionText = typeof res.data.suggestion === 'object' 
        ? res.data.suggestion.suggestion 
        : res.data.suggestion;

      setAiPrompt(suggestionText);
    } catch (err: any) { 
      toast.error(err.message || "Failed"); 
    } finally { 
      setIsGeneratingPrompt(false); 
    }
  };

  const handleCreate = () => {
    if (!pageName.trim()) { toast.error("Please enter a page name."); return; }
    if (activeMethod === "figma" && !figmaFile) { toast.error("Please upload a Figma file."); return; }
    if (activeMethod !== "figma" && !aiPrompt.trim()) { toast.error("Please describe your page or select a template."); return; }
    if (!project) return;

    setShowLoader(true);
    setIsComplete(false);

    let basePayload: Partial<LandingPage> = {};
    if (activeMethod === "template" && selectedTemplate === "saas-hero") {
      let enrichedContent = saasHeroHtml;
      if (project) {
        enrichedContent = enrichedContent.replace(/Renewal by Andersen/g, project.name);
        enrichedContent = enrichedContent.replace(/WINDOW REPLACEMENT an Andersen Company/g, project.category + " solutions for your business");
        enrichedContent = enrichedContent.replace(/Your locally owned Renewal by Andersen/g, `Your locally owned ${project.name}`);
        enrichedContent = enrichedContent.replace(/Fibrex®/g, "Premium materials");
        const finalLogo = logoUrl || project.logoUrl;
        if (finalLogo) enrichedContent = enrichedContent.replace(/https:\/\/via\.placeholder\.com\/150x50\?text=LOGO/g, finalLogo);
        if (project.scrapedData?.images?.length > 0) {
          const bannerImages = project.scrapedData.images.filter((img: any) => img.type === 'banner');
          const generalImages = project.scrapedData.images.filter((img: any) => img.type !== 'banner' && img.type !== 'logo');
          if (bannerImages.length > 0) enrichedContent = enrichedContent.replace(/https:\/\/images\.unsplash\.com\/photo-1600585154340-be6161a56a0c[^'"]*/g, bannerImages[0].url);
          else if (generalImages.length > 0) enrichedContent = enrichedContent.replace(/https:\/\/images\.unsplash\.com\/photo-1600585154340-be6161a56a0c[^'"]*/g, generalImages[0].url);
          if (generalImages.length > 1) enrichedContent = enrichedContent.replace(/https:\/\/images\.unsplash\.com\/photo-1761839258075[^'"]*/g, generalImages[1].url);
        }
      }
      basePayload = {
        name: pageName.trim(),
        slug: pageSlug.trim() || autoSlug(pageName),
        generationMethod: "template" as const,
        content: enrichedContent,
        templateId: selectedTemplate,
        template: "SaaS Hero"
      };
    } else {
      basePayload = generateAiPage(aiPrompt, project, { primary: primaryColor, secondary: secondaryColor, logo: logoUrl });
    }

    createPageMutation.mutate({
      ...basePayload,
      name: pageName.trim(),
      slug: pageSlug.trim() || basePayload.slug,
      primaryColor, secondaryColor, logoUrl,
      aiPrompt: activeMethod === "figma" ? (aiPrompt || "Create a landing page based on this design.") : aiPrompt,
      figmaImage: activeMethod === "figma" ? figmaBase64 : undefined,
      accentColor: "#6366f1", type: "ppc", status: "draft",
    });
  };

  const handleLoaderFinished = () => {
    if (createdPage) {
      toast.success("Page generated successfully!");
      navigate(`/editor/${id}/${createdPage._id}`);
    }
  };

  if (isLoading) return <div className="flex items-center justify-center min-h-screen bg-white"><Loader2 className="h-8 w-8 animate-spin text-violet-600" /></div>;
  if (showLoader) return <ModernLoader isComplete={isComplete} onFinished={handleLoaderFinished} />;

  return (
    <div className="min-h-screen flex flex-col bg-white">

      {/* ══ TOP NAV ══ */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-100 px-6 py-3 flex items-center gap-3 shadow-sm">
        <button
          onClick={() => navigate(`/dashboard/projects/${id}`)}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <span className="text-gray-300">/</span>
        {project && <span className="text-sm text-gray-400 truncate max-w-[160px]">{project.name}</span>}
        <span className="text-gray-300">/</span>
        <span className="text-sm font-semibold text-gray-800">Create New Page</span>
      </div>

      {/* ══ SPLIT LAYOUT ══ */}
      <div className="flex-1 flex min-h-0">

        {/* ─────────────────────── LEFT PANEL ─────────────────────────────── */}
        <div className={`flex flex-col overflow-y-auto border-r border-gray-100 transition-all duration-300 ${activeMethod === 'template' ? 'w-full md:w-[52%] lg:w-[55%]' : 'w-full'
          }`}>

          {/* Left Header */}
          <div className="px-8 pt-10 pb-6 border-b border-gray-50">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-xl flex items-center justify-center shadow-md"
                style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}>
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-black text-gray-900">Create New Page</h1>
                <p className="text-sm text-gray-500 mt-0.5">Fill in the details, pick a method, generate.</p>
              </div>
            </div>
          </div>

          <div className="flex-1 px-8 py-7 space-y-7">

            {/* ── Page Identity ── */}
            <section>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Page Identity</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Page Name — 50% */}
                <div>
                  <label className="text-xs font-semibold text-gray-700 mb-1.5 block">
                    Page Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={pageName}
                    onChange={(e) => { setPageName(e.target.value); setPageSlug(autoSlug(e.target.value)); }}
                    placeholder="e.g. Roofing Delhi"
                    autoFocus
                    className="w-full h-11 border border-gray-200 bg-gray-50 rounded-xl px-4 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100 transition-all"
                  />
                </div>

                {/* URL Slug — 50% */}
                <div>
                  <label className="text-xs font-semibold text-gray-700 mb-1.5 block">URL Slug</label>
                  <div className="flex items-center h-11 border border-gray-200 bg-gray-50 rounded-xl overflow-hidden focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-100 transition-all">
                    <span className="px-3 h-full flex items-center bg-gray-100 text-xs font-bold text-gray-500 border-r border-gray-200 whitespace-nowrap">/</span>
                    <input
                      value={pageSlug}
                      onChange={(e) => setPageSlug(autoSlug(e.target.value))}
                      placeholder="roofing-delhi"
                      className="flex-1 px-3 py-2.5 text-sm bg-transparent text-gray-900 placeholder:text-gray-400 outline-none"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* ── Branding ── */}
            <section>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Branding</p>
              <div className="flex items-center gap-4 flex-wrap">
                {/* Primary color */}
                <div>
                  <p className="text-[11px] text-gray-600 mb-1 font-semibold">Primary</p>
                  <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-2.5 py-1.5 bg-gray-50 relative">
                    <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                    <div className="h-5 w-5 rounded-full border border-gray-200 shadow-sm flex-shrink-0" style={{ background: primaryColor }} />
                    <span className="text-xs font-mono text-gray-500">{primaryColor}</span>
                  </div>
                </div>
                {/* Secondary color */}
                <div>
                  <p className="text-[11px] text-gray-600 mb-1 font-semibold">Secondary</p>
                  <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-2.5 py-1.5 bg-gray-50 relative">
                    <input type="color" value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                    <div className="h-5 w-5 rounded-full border border-gray-200 shadow-sm flex-shrink-0" style={{ background: secondaryColor }} />
                    <span className="text-xs font-mono text-gray-500">{secondaryColor}</span>
                  </div>
                </div>
                {/* Logo */}
                <div>
                  <p className="text-[11px] text-gray-600 mb-1 font-semibold">Logo</p>
                  <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" id="logo-upload" />
                  <label htmlFor="logo-upload"
                    className="flex items-center gap-2 border border-gray-200 rounded-lg px-2.5 py-1.5 bg-gray-50 cursor-pointer hover:border-violet-400 hover:bg-violet-50 transition-all">
                    {logoPreview
                      ? <img src={logoPreview} alt="Logo" className="h-5 w-5 object-contain rounded" />
                      : <Upload className="h-4 w-4 text-gray-400" />}
                    <span className="text-xs text-gray-500">{logoPreview ? "Change" : "Upload"}</span>
                  </label>
                </div>
              </div>
            </section>

            {/* ── Creation Method Tabs ── */}
            <section>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Creation Method</p>
              <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
                {[
                  { key: "ai" as const, label: "✨ Describe with AI", icon: <Brain className="h-3.5 w-3.5" /> },
                  { key: "figma" as const, label: "🎨 Figma Upload", icon: <Figma className="h-3.5 w-3.5" /> },
                  { key: "template" as const, label: "🗂️ Template", icon: <LayoutTemplate className="h-3.5 w-3.5" /> },
                ].map((m) => (
                  <button
                    key={m.key}
                    onClick={() => setActiveMethod(m.key)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg transition-all ${activeMethod === m.key
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                      }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </section>

            {/* ── AI panel ── */}
            {activeMethod === "ai" && (
              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-gray-600">
                    Describe your page <span className="text-red-500">*</span>
                  </label>
                  <button
                    onClick={handleGenerateMagicPrompt}
                    disabled={!pageName.trim() || isGeneratingPrompt}
                    className="flex items-center gap-1.5 text-[11px] font-semibold text-violet-600 hover:text-violet-800 bg-violet-50 hover:bg-violet-100 border border-violet-200 rounded-lg px-2.5 py-1 transition-all disabled:opacity-40"
                  >
                    {isGeneratingPrompt ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                    ✨ Magic Write
                  </button>
                </div>
                <textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="e.g. PPC landing page for a roofing company in Delhi targeting homeowners who need emergency roof repair. Include a hero section, trust badges, and a lead form."
                  className="w-full min-h-[130px] border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-300 outline-none focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100 transition-all resize-none"
                />
                <div className="flex flex-wrap gap-2">
                  {dynamicSuggestions.length > 0 ? (
                    dynamicSuggestions.slice(0, 6).map((item: any) => {
                      const suggestion = typeof item === 'string' ? item : item.suggestion;
                      return (
                        <button
                          key={suggestion}
                          onClick={() => {
                            setAiPrompt(suggestion);
                            // Auto-run Magic Write after selecting suggestion
                            setTimeout(() => handleGenerateMagicPrompt(), 100);
                          }}
                          className="text-[11px] text-gray-500 hover:text-violet-700 bg-gray-100 hover:bg-violet-50 border border-gray-200 hover:border-violet-300 rounded-lg px-2.5 py-1.5 transition-all text-left max-w-[250px] truncate"
                          title={suggestion}
                        >
                          {suggestion}
                        </button>
                      );
                    })
                  ) : (
                    // Fallback while loading or if no suggestions
                    <div className="flex gap-2">
                      <div className="h-6 w-32 bg-gray-100 animate-pulse rounded-lg" />
                      <div className="h-6 w-24 bg-gray-100 animate-pulse rounded-lg" />
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* ── Figma panel ── */}
            {activeMethod === "figma" && (
              <section className="space-y-3">
                <input type="file" accept=".fig,.png,.jpg,.jpeg,.pdf,image/*" onChange={handleFigmaUpload} className="hidden" id="figma-upload" />
                <label htmlFor="figma-upload"
                  className={`flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-10 cursor-pointer transition-all ${figmaFile ? "border-violet-400 bg-violet-50" : "border-gray-200 hover:border-violet-300 hover:bg-violet-50/50"
                    }`}
                >
                  {figmaPreview ? (
                    <img src={figmaPreview} alt="Preview" className="max-h-40 object-contain rounded-xl shadow-sm border border-gray-200" />
                  ) : (
                    <div className={`h-14 w-14 rounded-2xl flex items-center justify-center ${figmaFile ? "bg-violet-100" : "bg-gray-100"}`}>
                      {figmaFile ? <Figma className="h-7 w-7 text-violet-600" /> : <Upload className="h-7 w-7 text-gray-400" />}
                    </div>
                  )}
                  <div className="text-center">
                    {figmaFile
                      ? <p className="text-sm font-semibold text-violet-700">{figmaFile.name}</p>
                      : <p className="text-sm font-semibold text-gray-600">Drop your Figma file here</p>}
                    <p className="text-xs text-gray-400 mt-1">Supports .fig, PNG, JPG, PDF exports</p>
                  </div>
                </label>
              </section>
            )}

            {/* ── Template panel (show selected template info) ── */}
            {activeMethod === "template" && (
              <section className="space-y-3">
                {selectedTemplate ? (
                  <>
                    <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                      <p className="text-sm font-semibold text-emerald-700">
                        Template selected: {LANDING_TEMPLATES.find(t => t.id === selectedTemplate)?.name}
                      </p>
                      <button onClick={() => { setSelectedTemplate(null); setAiPrompt(""); }}
                        className="ml-auto text-emerald-500 hover:text-emerald-700">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <label className="text-xs font-semibold text-gray-600 block mt-2">Customize prompt</label>
                    <textarea
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      className="w-full min-h-[100px] border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-900 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all resize-none"
                    />
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <LayoutTemplate className="h-10 w-10 text-gray-300 mb-3" />
                    <p className="text-sm font-semibold text-gray-500 mb-1">Select a template from the right panel</p>
                    <p className="text-xs text-gray-400">Click any template card →</p>
                  </div>
                )}
              </section>
            )}

            {/* ── Generate CTA ── */}
            <div className="flex gap-3 pt-2 pb-6">
              <button
                onClick={() => navigate(`/dashboard/projects/${id}`)}
                className="flex-1 h-12 rounded-xl border border-gray-200 text-gray-500 hover:text-gray-800 hover:border-gray-300 text-sm font-semibold transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={createPageMutation.isPending || !pageName.trim()}
                className="flex-[2] h-12 rounded-xl text-sm font-bold text-white transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99]"
                style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
              >
                {createPageMutation.isPending
                  ? <><Loader2 className="h-4 w-4 animate-spin" /> Generating...</>
                  : <><Sparkles className="h-4 w-4" /> Generate with AI</>}
              </button>
            </div>
          </div>
        </div>

        {/* ─────────────────────── RIGHT PANEL ─────────────────────────────── */}
        {activeMethod === 'template' && (
          <div className="hidden md:flex flex-col w-[48%] lg:w-[45%] bg-gray-50 overflow-y-auto border-l border-gray-100 animate-in fade-in slide-in-from-right-5 duration-300">

          {/* Right Header */}
          <div className="px-7 pt-10 pb-5 border-b border-gray-100">
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Landing Page Templates</p>
            <p className="text-sm text-gray-500 mt-0.5">Click a template to use it as your starting point</p>
          </div>

          {/* Template Grid */}
          <div className="flex-1 px-6 py-6">
            <div className="grid grid-cols-2 gap-4">
              {LANDING_TEMPLATES.map((tpl) => (
                <button
                  key={tpl.id}
                  onClick={() => {
                    handleTemplateSelect(tpl);
                    if (activeMethod === "template") return;
                    setActiveMethod("template");
                  }}
                  className={`relative group rounded-2xl overflow-hidden border-2 transition-all duration-200 text-left ${selectedTemplate === tpl.id
                    ? "border-violet-500 shadow-lg shadow-violet-100 scale-[1.02]"
                    : "border-transparent hover:border-gray-300 hover:shadow-md hover:scale-[1.01]"
                    }`}
                >
                  {/* Image / Gradient placeholder */}
                  <div
                    className="w-full aspect-[4/3] relative overflow-hidden"
                    style={{ background: tpl.gradient }}
                  >
                    {tpl.img ? (
                      <img
                        src={tpl.img}
                        alt={tpl.name}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    ) : (
                      /* Placeholder mockup shapes */
                      <div className="absolute inset-0 p-4 flex flex-col gap-2 opacity-30">
                        <div className="w-full h-4 bg-white rounded-md" />
                        <div className="w-3/4 h-3 bg-white rounded-md" />
                        <div className="w-1/2 h-3 bg-white rounded-md" />
                        <div className="flex gap-2 mt-2">
                          <div className="w-16 h-7 bg-white rounded-lg" />
                          <div className="w-14 h-7 bg-white/50 rounded-lg" />
                        </div>
                        <div className="flex-1 grid grid-cols-3 gap-2 mt-2">
                          <div className="bg-white/40 rounded-xl" />
                          <div className="bg-white/40 rounded-xl" />
                          <div className="bg-white/40 rounded-xl" />
                        </div>
                        <div className="w-full h-8 bg-white/30 rounded-lg mt-1" />
                      </div>
                    )}

                    {/* Selected overlay */}
                    {selectedTemplate === tpl.id && (
                      <div className="absolute inset-0 bg-violet-900/20 flex items-center justify-center">
                        <div className="bg-white rounded-full p-1.5 shadow-xl">
                          <CheckCircle2 className="h-5 w-5 text-violet-600" />
                        </div>
                      </div>
                    )}

                    {/* Tag badge */}
                    <div className="absolute top-2.5 left-2.5 bg-black/40 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                      {tpl.tag}
                    </div>
                  </div>

                  {/* Name only — minimal */}
                  <div className="bg-white border-t border-gray-100 px-3 py-2.5 flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-700">{tpl.name}</span>
                    {selectedTemplate === tpl.id
                      ? <span className="text-[9px] font-bold text-violet-600 bg-violet-50 border border-violet-200 rounded-full px-2 py-0.5">Selected</span>
                      : <ChevronRight className="h-3.5 w-3.5 text-gray-300 group-hover:text-gray-500 transition-colors" />}
                  </div>
                </button>
              ))}

              {/* "More Coming Soon" card */}
              <div className="rounded-2xl border-2 border-dashed border-gray-200 aspect-[4/3] flex flex-col items-center justify-center gap-2 text-center p-4">
                <div className="h-10 w-10 rounded-xl bg-gray-100 flex items-center justify-center">
                  <Zap className="h-5 w-5 text-gray-400" />
                </div>
                <p className="text-xs font-semibold text-gray-400">More templates</p>
                <p className="text-[10px] text-gray-300">Coming soon</p>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default CreatePagePage;
