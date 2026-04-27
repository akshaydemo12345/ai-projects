import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft, Sparkles, Brain, Loader2, X, Upload,
  Figma, LayoutTemplate, CheckCircle2, ChevronRight, Zap, Eye, MapPin
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { projectsApi, pagesApi, aiApi, type Project, type LandingPage } from "@/services/api";
import { toast } from "sonner";
import { ModernLoader } from "@/components/ui/ModernLoader";
import { saasHeroHtml, saasHeroStyles } from "../templates/saasHero";
import { agencyHtml, agencyStyles } from "../templates/agency";
import { leadGenHtml, leadGenStyles } from "../templates/leadGen";
import { realEstateHtml, realEstateStyles } from "../templates/realEstate";
import { healthcareHtml, healthcareStyles } from "../templates/healthcare";
import { educationHtml, educationStyles } from "../templates/education";
import { ecommerceHtml, ecommerceStyles } from "../templates/ecommerce";
import { legalHtml, legalStyles } from "../templates/legal";
import { technologyHtml, technologyStyles } from "../templates/technology";

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
const LANDING_TEMPLATES = [
  {
    id: "tech-saas",
    name: "Modern SaaS",
    tag: "SaaS",
    img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    gradient: "linear-gradient(135deg, #020617 0%, #1e293b 100%)",
    prompt: "Create a futuristic, dark-themed SaaS landing page for an AI technology product. Include a hero with glassmorphism effects, interactive feature cards, and a sleek code preview section.",
  },
  {
    id: "healthcare-tpl",
    name: "Premium Health",
    tag: "Healthcare",
    img: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    gradient: "linear-gradient(135deg, #ebf8ff 0%, #bee3f8 100%)",
    prompt: "Create a clean, trustworthy medical landing page. Include a specialist doctor section, appointment booking form, trust badges for certifications, and a service highlight grid.",
  },
  {
    id: "edu-tpl",
    name: "LMS Academy",
    tag: "Education",
    img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    gradient: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
    prompt: "Create a modern e-learning academy landing page. Include a featured courses section with price tags, student success stories, and a floating newsletter signup card.",
  },
  {
    id: "ecom-tpl",
    name: "Lumina Fashion",
    tag: "E-commerce",
    img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    gradient: "linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)",
    prompt: "Create a high-end minimalist fashion store landing page. Include a full-screen hero image, trending products grid with hover effects, and a simple elegant navigation bar.",
  },
  {
    id: "legal-tpl",
    name: "Everett Legal",
    tag: "Legal",
    img: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    gradient: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
    prompt: "Create a sophisticated, professional legal landing page. Use serif typography, a dark noble color palette, consultation form, and expertise area cards with subtle transitions.",
  },
  {
    id: "saas-hero",
    name: "SaaS Business",
    tag: "Business",
    img: "/templates/Desktop_Thumbnail.png",
    gradient: "linear-gradient(135deg, #7c3aed 0%, #6366f1 100%)",
    prompt:
      "Create a high-converting, fully mobile-responsive SaaS landing page with a bold hero section, animated feature highlights, testimonials, pricing table, and a strong CTA for free trial sign-up.",
  },
  {
    id: "agency",
    name: "Agency (Hotel)",
    tag: "Luxury Hotel",
    img: "/templates/Desktop_Thumbnail3.png",
    gradient: "linear-gradient(135deg, #004d56 0%, #00bcd4 100%)",
    prompt:
      "Create a luxurious hotel and travel agency landing page with a booking bar, room showcases, wellness services tabs, special offers, and guest reviews. Use teal and white aesthetics.",
  },
  {
    id: "real-estate",
    name: "Real Estate",
    tag: "Real Estate",
    img: "/templates/Desktop_Thumbnail4.png",
    gradient: "linear-gradient(135deg, #28a745 0%, #1e7e34 100%)",
    prompt:
      "Create a professional real estate landing page with property galleries, agent profiles, interactive maps, and lead capture forms for inquiries.",
  },
];

const TEMPLATE_CATEGORIES = ["All", "SaaS", "Education", "Healthcare", "E-commerce", "Legal", "Business", "Real Estate"];
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

  const { data: suggestionsData } = useQuery({
    queryKey: ["project-suggestions", id],
    queryFn: () => aiApi.projectSuggestions(id!),
    enabled: !!id,
  });

  const dynamicSuggestions = suggestionsData?.data?.suggestions || [];

  const [activeMethod, setActiveMethod] = useState<CreationMethod>("ai");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [templateCategory, setTemplateCategory] = useState("All");

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
  const [previewTemplate, setPreviewTemplate] = useState<any | null>(null);
  const [visibleCount, setVisibleCount] = useState(4);

  const [showLoader, setShowLoader] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [createdPage, setCreatedPage] = useState<any>(null);

  useEffect(() => {
    if (project) {
      setPrimaryColor(project.primaryColor || "#7c3aed");
      setSecondaryColor(project.secondaryColor || "#6366f1");
      if (project.logoUrl) {
        setLogoPreview(project.logoUrl);
        setLogoUrl(project.logoUrl);
      }
    }
  }, [project]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoPreview(URL.createObjectURL(file));
    const r = new FileReader();
    r.onloadend = () => setLogoUrl(r.result as string);
    r.readAsDataURL(file);
  };

  const handleFigmaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
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
    setActiveMethod("template");
    toast.info(`Selected Template: ${tpl.name}`);
  };

  const handleViewTemplate = (tpl: any) => {
    let tpHtml = "";
    let tpStyles = "";
    switch (tpl.id) {
      case "tech-saas": tpHtml = technologyHtml; tpStyles = technologyStyles; break;
      case "healthcare-tpl": tpHtml = healthcareHtml; tpStyles = healthcareStyles; break;
      case "edu-tpl": tpHtml = educationHtml; tpStyles = educationStyles; break;
      case "ecom-tpl": tpHtml = ecommerceHtml; tpStyles = ecommerceStyles; break;
      case "legal-tpl": tpHtml = legalHtml; tpStyles = legalStyles; break;
      case "saas-hero": tpHtml = saasHeroHtml; tpStyles = saasHeroStyles; break;
      case "agency": tpHtml = agencyHtml; tpStyles = agencyStyles; break;
      case "lead-gen": tpHtml = leadGenHtml; tpStyles = leadGenStyles; break;
      case "real-estate": tpHtml = realEstateHtml; tpStyles = realEstateStyles; break;
    }

    const fullHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${tpl.name} Preview</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet">
          <style>
            ${tpStyles}
            body { margin: 0; padding: 0; overflow-x: hidden; }
          </style>
        </head>
        <body>${tpHtml}</body>
      </html>
    `;
    localStorage.setItem('grapes-preview-html', fullHtml);
    window.open('/preview', '_blank');
  };


  const createPageMutation = useMutation({
    mutationFn: async (page: Partial<LandingPage>) => {
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
      const suggestionText = typeof res.data.suggestion === 'object'
        ? res.data.suggestion.suggestion
        : res.data.suggestion;
      setAiPrompt(suggestionText);
      toast.success(aiPrompt.trim() ? "Prompt expanded!" : "Magic prompt generated!");
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

    if (activeMethod === "template" && selectedTemplate) {
      let enrichedContent = "";
      let enrichedStyles = "";
      const tName = LANDING_TEMPLATES.find(t => t.id === selectedTemplate)?.name || "Template";

      switch (selectedTemplate) {
        case "tech-saas":
          enrichedContent = technologyHtml;
          enrichedStyles = technologyStyles;
          break;
        case "healthcare-tpl":
          enrichedContent = healthcareHtml;
          enrichedStyles = healthcareStyles;
          break;
        case "edu-tpl":
          enrichedContent = educationHtml;
          enrichedStyles = educationStyles;
          break;
        case "ecom-tpl":
          enrichedContent = ecommerceHtml;
          enrichedStyles = ecommerceStyles;
          break;
        case "legal-tpl":
          enrichedContent = legalHtml;
          enrichedStyles = legalStyles;
          break;
        case "saas-hero":
          enrichedContent = saasHeroHtml;
          enrichedStyles = saasHeroStyles;
          break;
        case "agency":
          enrichedContent = agencyHtml;
          enrichedStyles = agencyStyles;
          break;
        case "lead-gen":
          enrichedContent = leadGenHtml;
          enrichedStyles = leadGenStyles;
          break;
        case "real-estate":
          enrichedContent = realEstateHtml;
          enrichedStyles = realEstateStyles;
          break;
        default:
          enrichedContent = saasHeroHtml;
          enrichedStyles = saasHeroStyles;
      }

      // Smart replacements
      enrichedContent = enrichedContent.replace(/Renewal by Andersen/g, project.name);
      enrichedContent = enrichedContent.replace(/YOUR_BUSINESS_NAME/g, project.name);
      enrichedContent = enrichedContent.replace(/WINDOW REPLACEMENT an Andersen Company/g, (project.category || "Service") + " solutions for your business");
      enrichedContent = enrichedContent.replace(/Your locally owned Renewal by Andersen/g, `Your locally owned ${project.name}`);
      enrichedContent = enrichedContent.replace(/Fibrex®/g, "Premium materials");

      const finalLogo = logoUrl || project.logoUrl;
      if (finalLogo) {
        enrichedContent = enrichedContent.replace(/https:\/\/via\.placeholder\.com\/150x50\?text=LOGO/g, finalLogo);
        enrichedContent = enrichedContent.replace(/https:\/\/i\.ibb\.co\/vzB7pLq\/Logo\.png/g, finalLogo);
      }

      if (project.scrapedData?.images?.length > 0) {
        const bannerImages = project.scrapedData.images.filter((img: any) => img.type === 'banner');
        const generalImages = project.scrapedData.images.filter((img: any) => img.type !== 'banner' && img.type !== 'logo');
        if (bannerImages.length > 0) enrichedContent = enrichedContent.replace(/https:\/\/images\.unsplash\.com\/photo-1600585154340-be6161a56a0c[^'"]*/g, bannerImages[0].url);
        else if (generalImages.length > 0) enrichedContent = enrichedContent.replace(/https:\/\/images\.unsplash\.com\/photo-1600585154340-be6161a56a0c[^'"]*/g, generalImages[0].url);
        if (generalImages.length > 1) enrichedContent = enrichedContent.replace(/https:\/\/images\.unsplash\.com\/photo-1761839258075[^'"]*/g, generalImages[1].url);
      }

      basePayload = {
        name: pageName.trim(),
        slug: pageSlug.trim() || autoSlug(pageName),
        generationMethod: "template" as const,
        content: enrichedContent,
        styles: enrichedStyles,
        landingPageContent: enrichedContent,
        landingPageStyles: enrichedStyles,
        templateId: selectedTemplate,
        template: tName
      };
    } else {
      basePayload = generateAiPage(aiPrompt, project, { primary: primaryColor, secondary: secondaryColor, logo: logoUrl });
    }

    createPageMutation.mutate({
      ...basePayload,
      name: pageName.trim(),
      slug: pageSlug.trim() || basePayload.slug,
      primaryColor,
      secondaryColor,
      logoUrl,
      aiPrompt: activeMethod === "figma" ? (aiPrompt || "Create a landing page based on this design.") : aiPrompt,
      figmaImage: activeMethod === "figma" ? figmaBase64 : undefined,
      accentColor: "#6366f1",
      type: "ppc",
      status: "draft",
    });
  };

  const handleLoaderFinished = () => {
    if (createdPage) {
      toast.success("Page generated successfully!");
      navigate(`/editor/${id}/${createdPage._id}`);
    }
  };

  if (isLoading) return <div className="flex items-center justify-center min-h-screen bg-white"><Loader2 className="h-8 w-8 animate-spin text-violet-600" /></div>;
  if (showLoader || createPageMutation.isPending) return <ModernLoader isComplete={isComplete} onFinished={handleLoaderFinished} />;

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

      <div className="flex-1 flex min-h-0">
        {/* LEFT PANEL */}
        <div className="flex flex-col overflow-y-auto border-r border-gray-100 transition-all duration-300 w-full md:w-[52%] lg:w-[55%]">
          <div className="px-8 pt-10 pb-6 border-b border-gray-50">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-xl flex items-center justify-center shadow-md"
                style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}>
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-xl font-black text-gray-900">Create New Page</h1>
                <p className="text-sm text-gray-500 mt-0.5">Fill in the details, pick a method, generate.</p>
              </div>
            </div>
          </div>

          <div className="flex-1 px-8 py-7 space-y-7">
            <section>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Page Identity</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Page Name *</label>
                  <input
                    value={pageName}
                    onChange={(e) => { setPageName(e.target.value); setPageSlug(autoSlug(e.target.value)); }}
                    placeholder="e.g. Roofing Delhi"
                    className="w-full h-11 border border-gray-200 bg-gray-50 rounded-xl px-4 text-sm outline-none focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100 transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 mb-1.5 block">URL Slug</label>
                  <div className="flex items-center h-11 border border-gray-200 bg-gray-50 rounded-xl overflow-hidden focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-100 transition-all">
                    <span className="px-3 h-full flex items-center bg-gray-100 text-xs font-bold text-gray-500 border-r border-gray-200 whitespace-nowrap">/</span>
                    <input
                      value={pageSlug}
                      onChange={(e) => setPageSlug(autoSlug(e.target.value))}
                      placeholder="roofing-delhi"
                      className="flex-1 px-3 py-2.5 text-sm bg-transparent outline-none"
                    />
                  </div>
                </div>
              </div>
            </section>

            <section>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Branding</p>
              <div className="flex items-center gap-4 flex-wrap">
                <div>
                  <p className="text-[11px] text-gray-600 mb-1 font-semibold">Primary</p>
                  <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-2.5 py-1.5 bg-gray-50 relative">
                    <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                    <div className="h-5 w-5 rounded-full border border-gray-200 shadow-sm" style={{ background: primaryColor }} />
                    <span className="text-xs font-mono text-gray-500 uppercase">{primaryColor}</span>
                  </div>
                </div>
                <div>
                  <p className="text-[11px] text-gray-600 mb-1 font-semibold">Secondary</p>
                  <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-2.5 py-1.5 bg-gray-50 relative">
                    <input type="color" value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                    <div className="h-5 w-5 rounded-full border border-gray-200 shadow-sm" style={{ background: secondaryColor }} />
                    <span className="text-xs font-mono text-gray-500 uppercase">{secondaryColor}</span>
                  </div>
                </div>
                <div>
                  <p className="text-[11px] text-gray-600 mb-1 font-semibold">Logo</p>
                  <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" id="logo-upload" />
                  <label htmlFor="logo-upload" className="flex items-center gap-2 border border-gray-200 rounded-lg px-2.5 py-1.5 bg-gray-50 cursor-pointer hover:border-violet-400 hover:bg-violet-50 transition-all">
                    {logoPreview ? <img src={logoPreview} alt="Logo" className="h-5 w-5 object-contain rounded" /> : <Upload className="h-4 w-4 text-gray-400" />}
                    <span className="text-xs text-gray-500">{logoPreview ? "Change" : "Upload"}</span>
                  </label>
                </div>
              </div>
            </section>

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
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg transition-all ${activeMethod === m.key ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                  >
                    {m.icon} {m.label}
                  </button>
                ))}
              </div>
            </section>

            {activeMethod === "ai" && (
              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-gray-600">Describe your page *</label>
                  <button
                    onClick={handleGenerateMagicPrompt}
                    disabled={!pageName.trim() || isGeneratingPrompt}
                    className="flex items-center gap-1.5 text-[11px] font-semibold text-violet-600 hover:text-violet-800 bg-violet-50 hover:bg-violet-100 border border-violet-200 rounded-lg px-2.5 py-1 transition-all disabled:opacity-40"
                  >
                    {isGeneratingPrompt ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />} ✨ Magic Write
                  </button>
                </div>
                <textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="e.g. PPC landing page for a roofing company in Delhi targeting homeowners..."
                  className="w-full min-h-[130px] border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 text-sm outline-none focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100 transition-all resize-none"
                />
                <div className="flex flex-wrap gap-2">
                  {dynamicSuggestions.slice(0, 6).map((item: any, idx: number) => {
                    const suggestion = typeof item === 'string' ? item : item.suggestion;
                    return (
                      <button key={idx} onClick={() => { setAiPrompt(suggestion); setTimeout(handleGenerateMagicPrompt, 100); }}
                        className="text-[11px] text-gray-500 hover:text-violet-700 bg-gray-100 hover:bg-violet-50 border border-gray-200 hover:border-violet-300 rounded-lg px-2.5 py-1.5 transition-all text-left max-w-[250px] truncate"
                      >
                        {suggestion}
                      </button>
                    );
                  })}
                </div>
              </section>
            )}

            {activeMethod === "figma" && (
              <section className="space-y-3">
                <input type="file" accept=".fig,.png,.jpg,.jpeg,.pdf,image/*" onChange={handleFigmaUpload} className="hidden" id="figma-upload" />
                <label htmlFor="figma-upload" className={`flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-10 cursor-pointer transition-all ${figmaFile ? "border-violet-400 bg-violet-50" : "border-gray-200 hover:border-violet-300"}`}>
                  {figmaPreview ? (
                    <img src={figmaPreview} alt="Preview" className="max-h-40 object-contain rounded-xl shadow-sm" />
                  ) : (
                    <div className={`h-14 w-14 rounded-2xl flex items-center justify-center ${figmaFile ? "bg-violet-100" : "bg-gray-100"}`}>
                      {figmaFile ? <Figma className="h-7 w-7 text-violet-600" /> : <Upload className="h-7 w-7 text-gray-400" />}
                    </div>
                  )}
                  <div className="text-center">
                    <p className="text-sm font-semibold text-gray-600">{figmaFile ? figmaFile.name : "Drop your Figma file here"}</p>
                    <p className="text-xs text-gray-400 mt-1">Supports .fig, PNG, JPG, PDF exports</p>
                  </div>
                </label>
              </section>
            )}

            {activeMethod === "template" && (
              <section className="space-y-3">
                {selectedTemplate ? (
                  <>
                    <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      <p className="text-sm font-semibold text-emerald-700">
                        Template: {LANDING_TEMPLATES.find(t => t.id === selectedTemplate)?.name}
                      </p>
                      <button onClick={() => { setSelectedTemplate(null); setAiPrompt(""); }} className="ml-auto text-emerald-500 hover:text-emerald-700">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <label className="text-xs font-semibold text-gray-600 block mt-2">Customize prompt</label>
                    <textarea value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} className="w-full min-h-[100px] border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 text-sm outline-none focus:border-violet-400 transition-all resize-none" />
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <LayoutTemplate className="h-10 w-10 text-gray-300 mb-3" />
                    <p className="text-sm font-semibold text-gray-500">Select a template from the right panel →</p>
                  </div>
                )}
              </section>
            )}

            <div className="flex gap-3 pt-2 pb-6">
              <button onClick={() => navigate(`/dashboard/projects/${id}`)} className="flex-1 h-12 rounded-xl border border-gray-200 text-gray-500 hover:text-gray-800 font-semibold transition-all">
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={createPageMutation.isPending || !pageName.trim()}
                className="flex-[2] h-12 rounded-xl text-sm font-bold text-white transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50"
                style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
              >
                {createPageMutation.isPending ? <><Loader2 className="h-4 w-4 animate-spin" /> Generating...</> : <><Sparkles className="h-4 w-4" /> Generate with AI</>}
              </button>
            </div>
          </div>
        </div>

        {/* ─────────────────────── RIGHT PANEL ─────────────────────────────── */}
        <div className="hidden md:flex flex-col w-[48%] lg:w-[45%] bg-gray-50 overflow-y-auto border-l border-gray-100">
          {activeMethod === 'ai' && (
            <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-5 duration-300">
              <div className="px-7 pt-10 pb-5 border-b border-gray-100">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">AI Prompt Inspiration</p>
                <p className="text-sm text-gray-500 mt-0.5">Click a preset to instantly build your landing page</p>
              </div>
              <div className="flex-1 px-7 py-8 flex flex-col gap-4">
                {[
                  { title: "High-Converting SaaS", desc: "Perfect for software products with pricing and features.", color: "bg-blue-50 text-blue-600", icon: <Zap className="h-4 w-4" />, prompt: "A modern SaaS landing page for a cloud storage product. Include a hero section with a signup form, tiered pricing table, trust badges, and a features grid with icons." },
                  { title: "Local Business Lead Gen", desc: "Optimized for roofing, plumbing, or dental services.", color: "bg-emerald-50 text-emerald-600", icon: <MapPin className="h-4 w-4" />, prompt: "PPC landing page for a local roofing company. High-visibility phone number, service area map, 'Get a Quote' form above the fold, and client testimonials." },
                  { title: "Digital Agency Portfolio", desc: "Showcase creative work and service packages.", color: "bg-violet-50 text-violet-600", icon: <Eye className="h-4 w-4" />, prompt: "Luxury digital agency landing page. Dark theme with neon accents, project gallery slider, service list with hover effects, and a team introduction section." },
                  { title: "Real Estate Showcase", desc: "Display properties with high-quality imagery.", color: "bg-amber-50 text-amber-600", icon: <LayoutTemplate className="h-4 w-4" />, prompt: "Premium real estate landing page. Hero image of a luxury apartment, property feature list (sqft, beds, baths), interactive map, and an inquiry form for agents." }
                ].map((preset, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setAiPrompt(preset.prompt);
                      toast.success(`Loaded ${preset.title} preset`);
                    }}
                    className="p-5 rounded-2xl bg-white border border-gray-200 hover:border-violet-400 hover:shadow-lg transition-all text-left flex gap-4 group"
                  >
                    <div className={`h-12 w-12 rounded-xl flex-shrink-0 flex items-center justify-center ${preset.color}`}>
                      {preset.icon || <Sparkles className="h-5 w-5" />}
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-gray-900 group-hover:text-violet-600 transition-colors">{preset.title}</h3>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">{preset.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeMethod === 'figma' && (
            <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-5 duration-300">
              <div className="px-7 pt-10 pb-5 border-b border-gray-100">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Design to Code Tips</p>
                <p className="text-sm text-gray-500 mt-0.5">Best practices for Figma and Image uploads</p>
              </div>
              <div className="flex-1 px-10 py-12 flex flex-col items-center justify-center text-center space-y-8">
                <div className="relative">
                  <div className="h-24 w-24 rounded-[32px] bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-xl shadow-indigo-200">
                    <Figma className="h-10 w-10 text-white" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 h-10 w-10 rounded-2xl bg-white shadow-lg flex items-center justify-center">
                    <Zap className="h-5 w-5 text-amber-500" />
                  </div>
                </div>
                
                <div className="max-w-xs space-y-4">
                  <h3 className="text-lg font-black text-gray-900">How it works</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Our AI analyzes your design image or Figma export and converts it into a clean, responsive Tailwind CSS landing page.
                  </p>
                </div>

                <div className="w-full space-y-3">
                  {[
                    "Use high-resolution screenshots",
                    "Ensure text is clearly legible",
                    "Avoid overlapping complex elements",
                    "Keep layout hierarchy standard"
                  ].map((tip, i) => (
                    <div key={i} className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-100 text-left">
                      <div className="h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                      </div>
                      <span className="text-xs font-semibold text-gray-700">{tip}</span>
                    </div>
                  ))}
                </div>
                
                <div className="pt-4">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-100 px-4 py-2 rounded-full">
                    Average processing time: 45s
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeMethod === 'template' && (
            <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-5 duration-300">
              {/* Category Filter */}
              <div className="px-6 pt-6 flex flex-wrap gap-2">
                {TEMPLATE_CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setTemplateCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border ${
                      templateCategory === cat
                        ? "bg-violet-600 border-violet-600 text-white shadow-md shadow-violet-100"
                        : "bg-white border-gray-200 text-gray-500 hover:border-violet-300 hover:text-violet-600"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Template Grid */}
              <div className="flex-1 px-6 py-6 scrollbar-hide">
                  <div className="grid grid-cols-2 gap-4">
                    {LANDING_TEMPLATES
                      .filter(t => templateCategory === "All" || t.tag === templateCategory)
                      .slice(0, visibleCount)
                      .map((tpl) => (
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

                          <div className="absolute top-2.5 left-2.5 bg-black/40 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                            {tpl.tag}
                          </div>

                          {/* View Button Overlay */}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewTemplate(tpl);
                              }}
                              className="bg-white/20 backdrop-blur-md border border-white/30 text-white px-3 py-1.5 rounded-full text-[10px] font-bold hover:bg-white hover:text-black transition-all flex items-center gap-1.5"
                            >
                              <Eye className="h-3 w-3" />
                              View Template
                            </button>
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

                    {/* View More Logic */}
                    {visibleCount < LANDING_TEMPLATES.filter(t => templateCategory === "All" || t.tag === templateCategory).length && (
                      <button
                        onClick={() => setVisibleCount(prev => prev + 4)}
                        className="rounded-2xl border-2 border-dashed border-violet-200 aspect-[4/3] flex flex-col items-center justify-center gap-2 text-center p-4 hover:bg-violet-50 hover:border-violet-400 transition-all group"
                      >
                        <div className="h-10 w-10 rounded-xl bg-violet-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Zap className="h-5 w-5 text-violet-500" />
                        </div>
                        <p className="text-xs font-bold text-violet-600 uppercase tracking-wider">View More</p>
                        <p className="text-[10px] text-violet-400">Load 4 more templates</p>
                      </button>
                    )}
                  </div>

              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Template Preview Modal ── */}
      {previewTemplate && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex flex-col animate-in fade-in duration-300">
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/50 backdrop-blur-md">
            <div>
              <h3 className="text-white font-bold text-lg">{previewTemplate.name}</h3>
              <p className="text-white/50 text-xs uppercase tracking-widest font-black">{previewTemplate.tag} Template</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => { handleTemplateSelect(previewTemplate); setPreviewTemplate(null); }}
                className="bg-white text-black px-5 py-2 rounded-full text-xs font-bold hover:bg-violet-100 transition-all flex items-center gap-2"
              >
                <Sparkles className="h-3.5 w-3.5" /> Use Template
              </button>
              <button onClick={() => setPreviewTemplate(null)} className="p-2 h-10 w-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-all">
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div className="flex-1 w-full bg-white relative">
            {(() => {
              let tpHtml = "";
              let tpStyles = "";
              switch (previewTemplate.id) {
                case "tech-saas": tpHtml = technologyHtml; tpStyles = technologyStyles; break;
                case "healthcare-tpl": tpHtml = healthcareHtml; tpStyles = healthcareStyles; break;
                case "edu-tpl": tpHtml = educationHtml; tpStyles = educationStyles; break;
                case "ecom-tpl": tpHtml = ecommerceHtml; tpStyles = ecommerceStyles; break;
                case "legal-tpl": tpHtml = legalHtml; tpStyles = legalStyles; break;
                case "saas-hero": tpHtml = saasHeroHtml; tpStyles = saasHeroStyles; break;
                case "agency": tpHtml = agencyHtml; tpStyles = agencyStyles; break;
                case "lead-gen": tpHtml = leadGenHtml; tpStyles = leadGenStyles; break;
                case "real-estate": tpHtml = realEstateHtml; tpStyles = realEstateStyles; break;
              }

              return (
                <iframe
                  srcDoc={`
                    <!DOCTYPE html>
                    <html>
                      <head>
                        <meta charset="utf-8">
                        <title>Preview</title>
                        <script src="https://cdn.tailwindcss.com"></script>
                        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet">
                        <style>
                          ${tpStyles}
                          /* Helper styles for preview */
                          body { margin: 0; padding: 0; overflow-x: hidden; }
                        </style>
                      </head>
                      <body>
                        ${tpHtml}
                      </body>
                    </html>
                  `}
                  className="absolute inset-0 w-full h-full border-none"
                />
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePagePage;
