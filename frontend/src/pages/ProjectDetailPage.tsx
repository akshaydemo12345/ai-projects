import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft, Plus, Globe, FileEdit, Rocket, Users as UsersIcon,
  Settings2, Copy, CheckCircle2, X, Sparkles, ExternalLink,
  FileText, Eye, Trash2, Zap, Search, Brain, Loader2, Link,
  Puzzle, Code2, Monitor, Download, Info, Activity, MoreVertical,
  Filter, ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import PickrColorInput from "@/components/ui/PickrColorInput";
import { ConfirmDeleteModal } from "@/components/ConfirmDeleteModal";
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { projectsApi, pagesApi, aiApi, statsApi, type Project, type LandingPage } from "@/services/api";
import { toast } from "sonner";
import { copyToClipboard, cleanUrl, normalizeLogoUrl, getImageAverageBrightness, getLogoPreviewContainerClasses } from "@/lib/utils";
import { ModernLoader } from "@/components/ui/ModernLoader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

// ─── helpers ─────────────────────────────────────────────────────────────────
const autoSlug = (v: string) =>
  v.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

const generateAiPage = (prompt: string, project: Project, branding: { primary: string, secondary: string, logo?: string }): Partial<LandingPage> => {
  const dummyHtml = `
    <div style="font-family: 'Inter', sans-serif; color: #333;">
      <!-- Section 1: Hero -->
      <section style="background: linear-gradient(135deg, var(--primary), var(--secondary)); padding: 100px 20px; text-align: center; color: white;">
        <h1 style="font-size: 3rem; margin-bottom: 20px; font-weight: 800;">Welcome to ${project.name || "Our Business"}</h1>
        <p style="font-size: 1.25rem; max-width: 600px; margin: 0 auto 30px; opacity: 0.9;"><strong>Prompt:</strong> ${prompt || 'Dynamic AI Generated Section'}</p>
        <button style="background: white; color: var(--primary); padding: 15px 30px; border: none; border-radius: 8px; font-size: 1.1rem; font-weight: bold; cursor: pointer;">Get Started Now</button>
      </section>

      <!-- Section 2: Features -->
      <section style="padding: 80px 20px; background: #f8fafc; text-align: center;">
        <h2 style="font-size: 2.5rem; margin-bottom: 40px; color: #0f172a;">Why Choose Us</h2>
        <div style="display: flex; gap: 20px; justify-content: center; flex-wrap: wrap; max-width: 1000px; margin: 0 auto;">
          <div style="flex: 1; min-width: 250px; background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
            <div style="font-size: 2rem; margin-bottom: 15px;">🚀</div>
            <h3 style="font-size: 1.25rem; margin-bottom: 10px;">Lightning Fast</h3>
            <p style="color: #64748b; font-size: 0.95rem;">Experience unparalleled speed and performance with our optimized solutions.</p>
          </div>
          <div style="flex: 1; min-width: 250px; background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
            <div style="font-size: 2rem; margin-bottom: 15px;">🛡️</div>
            <h3 style="font-size: 1.25rem; margin-bottom: 10px;">Secure & Reliable</h3>
            <p style="color: #64748b; font-size: 0.95rem;">Your data is protected with enterprise-grade security and encryption.</p>
          </div>
          <div style="flex: 1; min-width: 250px; background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
            <div style="font-size: 2rem; margin-bottom: 15px;">💡</div>
            <h3 style="font-size: 1.25rem; margin-bottom: 10px;">Smart AI</h3>
            <p style="color: #64748b; font-size: 0.95rem;">Leverage artificial intelligence to automate and streamline your workflows.</p>
          </div>
        </div>
      </section>

      <!-- Section 3: About Us -->
      <section style="padding: 80px 20px; max-width: 1000px; margin: 0 auto; display: flex; align-items: center; gap: 40px; flex-wrap: wrap;">
        <div style="flex: 1; min-width: 300px;">
          <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80" alt="About Us" style="width: 100%; border-radius: 16px; box-shadow: 0 10px 20px rgba(0,0,0,0.1);" />
        </div>
        <div style="flex: 1; min-width: 300px;">
          <h2 style="font-size: 2.5rem; margin-bottom: 20px; color: #0f172a;">About ${project.name || "Our Business"}</h2>
          <p style="color: #64748b; font-size: 1.1rem; line-height: 1.6; margin-bottom: 20px;">We are a dedicated team of professionals committed to delivering excellence. With years of experience and a passion for innovation, we help businesses achieve their full potential.</p>
          <p style="color: #64748b; font-size: 1.1rem; line-height: 1.6;">Our mission is to empower you with the tools and strategies needed to succeed in today's fast-paced digital landscape.</p>
        </div>
      </section>

      <!-- Section 4: Testimonials -->
      <section style="padding: 80px 20px; background: #0f172a; color: white; text-align: center;">
        <h2 style="font-size: 2.5rem; margin-bottom: 40px;">What Our Clients Say</h2>
        <div style="display: flex; gap: 20px; justify-content: center; flex-wrap: wrap; max-width: 1000px; margin: 0 auto;">
          <div style="flex: 1; min-width: 250px; background: rgba(255,255,255,0.1); padding: 30px; border-radius: 12px;">
            <div style="color: #fbbf24; font-size: 1.5rem; margin-bottom: 15px;">★★★★★</div>
            <p style="font-style: italic; margin-bottom: 20px; font-size: 1.05rem;">"An absolute game-changer. The platform is incredibly intuitive and the results were immediate."</p>
            <h4 style="font-weight: 600;">Sarah Jenkins</h4>
            <span style="font-size: 0.85rem; opacity: 0.7;">Marketing Director</span>
          </div>
          <div style="flex: 1; min-width: 250px; background: rgba(255,255,255,0.1); padding: 30px; border-radius: 12px;">
            <div style="color: #fbbf24; font-size: 1.5rem; margin-bottom: 15px;">★★★★★</div>
            <p style="font-style: italic; margin-bottom: 20px; font-size: 1.05rem;">"The best investment we've made this year. Exceptional support and a flawless product."</p>
            <h4 style="font-weight: 600;">Michael Chen</h4>
            <span style="font-size: 0.85rem; opacity: 0.7;">CEO, TechFlow</span>
          </div>
        </div>
      </section>

      <!-- Section 5: Lead Capture Form -->
      <section style="padding: 80px 20px; max-width: 600px; margin: 0 auto; text-align: center;">
        <h2 style="font-size: 2.5rem; margin-bottom: 15px; color: #0f172a;">Ready to Get Started?</h2>
        <p style="color: #64748b; margin-bottom: 30px; font-size: 1.1rem;">Fill out the form below and our team will contact you shortly.</p>
        <form style="display: flex; flex-direction: column; gap: 15px; background: white; padding: 40px; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; text-align: left;">
          <div>
            <label style="display: block; font-size: 0.9rem; font-weight: 600; margin-bottom: 5px; color: #334155;">Full Name</label>
            <input type="text" placeholder="John Doe" style="width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 1rem; outline: none; box-sizing: border-box;" required />
          </div>
          <div>
            <label style="display: block; font-size: 0.9rem; font-weight: 600; margin-bottom: 5px; color: #334155;">Email Address</label>
            <input type="email" placeholder="john@example.com" style="width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 1rem; outline: none; box-sizing: border-box;" required />
          </div>
          <div>
            <label style="display: block; font-size: 0.9rem; font-weight: 600; margin-bottom: 5px; color: #334155;">How can we help?</label>
            <textarea placeholder="Tell us about your project..." rows="4" style="width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 1rem; outline: none; box-sizing: border-box; resize: vertical;" required></textarea>
          </div>
          <button type="submit" style="background: var(--primary); color: white; padding: 14px; border: none; border-radius: 8px; font-size: 1.05rem; font-weight: bold; cursor: pointer; margin-top: 10px;">Submit Request</button>
        </form>
      </section>

      <!-- Section 6: Footer -->
      <footer style="background: #0f172a; color: #94a3b8; padding: 60px 20px 20px; text-align: center; border-top: 1px solid rgba(255,255,255,0.1);">
        <div style="max-width: 1000px; margin: 0 auto; display: flex; flex-wrap: wrap; justify-content: space-between; text-align: left; gap: 40px; margin-bottom: 40px;">
          <div style="flex: 1; min-width: 250px;">
            <h3 style="color: white; font-size: 1.5rem; margin-bottom: 20px; font-weight: bold;">${project.name || "Our Business"}</h3>
            <p style="line-height: 1.6;">Providing premium services and innovative solutions for businesses worldwide. Your success is our priority.</p>
          </div>
          <div style="flex: 1; min-width: 200px;">
            <h4 style="color: white; font-size: 1.1rem; margin-bottom: 20px;">Quick Links</h4>
            <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px;">
              <li><a href="#" style="color: #94a3b8; text-decoration: none; transition: color 0.2s;">About Us</a></li>
              <li><a href="#" style="color: #94a3b8; text-decoration: none; transition: color 0.2s;">Our Services</a></li>
              <li><a href="#" style="color: #94a3b8; text-decoration: none; transition: color 0.2s;">Testimonials</a></li>
              <li><a href="#" style="color: #94a3b8; text-decoration: none; transition: color 0.2s;">Contact</a></li>
            </ul>
          </div>
          <div style="flex: 1; min-width: 250px;">
            <h4 style="color: white; font-size: 1.1rem; margin-bottom: 20px;">Contact Us</h4>
            <p style="margin-bottom: 10px;">Email: hello@example.com</p>
            <p style="margin-bottom: 10px;">Phone: +1 (555) 123-4567</p>
            <p>Address: 123 Business Avenue, Suite 100<br/>New York, NY 10001</p>
          </div>
        </div>
        <div style="padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1); font-size: 0.9rem;">
          <p>&copy; ${new Date().getFullYear()} ${project.name || "Our Business"}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  `;

  return {
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
    content: dummyHtml,
  };
};

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
        industry: project.category || project.industry || "Service",
        projectDesc: project.description,
        currentPrompt: aiPrompt.trim() || undefined
      });
      setAiPrompt(res.data.suggestion);
      toast.success("AI prompt generated successfully.");
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

  // Per-page branding — websiteProfile.logoColors first, fallback to legacy fields
  const [primaryColor, setPrimaryColor] = useState(
    project.websiteProfile?.logoColors?.primary || project.websiteProfile?.colors?.primary || project.primaryColor || "#7c3aed"
  );
  const [secondaryColor, setSecondaryColor] = useState(
    project.websiteProfile?.logoColors?.secondary || project.websiteProfile?.colors?.secondary || project.secondaryColor || "#6366f1"
  );
  const _initLogo = project.websiteProfile?.identity?.logoUrl || project.logoUrl;
  const [logoPreview, setLogoPreview] = useState<string | null>(_initLogo || null);
  const [logoUrl, setLogoUrl] = useState<string | undefined>(_initLogo);
  const [logoPreviewBgClass, setLogoPreviewBgClass] = useState<string>("border border-slate-700 bg-slate-950 dark:border-slate-500 dark:bg-slate-950");
  const [logoHeaderBgClass, setLogoHeaderBgClass] = useState<string>("rounded-2xl p-2 shadow-lg shadow-slate-900/20");
  const [logoHeaderBgColor, setLogoHeaderBgColor] = useState<string>("rgb(197, 197, 197)");

  const handleLogoPreviewImageLoad = (img: HTMLImageElement) => {
    const brightness = getImageAverageBrightness(img);
    setLogoPreviewBgClass(getLogoPreviewContainerClasses(brightness));
  };

  const handleHeaderLogoImageLoad = (img: HTMLImageElement) => {
    const brightness = getImageAverageBrightness(img);
    const bgClass = getLogoPreviewContainerClasses(brightness);
    setLogoHeaderBgClass(bgClass);
    // Set appropriate background color based on brightness
    setLogoHeaderBgColor(brightness !== null && brightness >= 0.65 ? "rgb(20, 24, 32)" : "rgb(197, 197, 197)");
  };


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

      toast.success("Website analysis completed successfully.");
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
                      <PickrColorInput value={primaryColor} onChange={(val) => setPrimaryColor(val)} className="border-0 bg-transparent flex-shrink-0" />
                      <span className="text-xs font-mono text-muted-foreground">{primaryColor}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-foreground mb-1 block">Secondary Color</label>
                    <div className="flex items-center gap-2 rounded-lg border border-border px-2 py-1.5 bg-background">
                      <PickrColorInput value={secondaryColor} onChange={(val) => setSecondaryColor(val)} className="border-0 bg-transparent flex-shrink-0" />
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
                      <PickrColorInput value={primaryColor} onChange={(val) => setPrimaryColor(val)} className="border-0 bg-transparent flex-shrink-0" />
                      <span className="text-xs font-mono text-muted-foreground">{primaryColor}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-foreground mb-1 block">Secondary Color</label>
                    <div className="flex items-center gap-2 rounded-lg border border-border px-2 py-1.5 bg-background">
                      <PickrColorInput value={secondaryColor} onChange={(val) => setSecondaryColor(val)} className="border-0 bg-transparent flex-shrink-0" />
                      <span className="text-xs font-mono text-muted-foreground">{secondaryColor}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-foreground mb-1.5 block">Logo (optional)</label>
                  <div className="flex items-center gap-3">
                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" id="upload-logo-analyze" />
                    {logoPreview ? (
                      <div className={`h-10 w-10 rounded flex items-center justify-center overflow-hidden flex-shrink-0 shadow-lg ring-1 ring-slate-600 ${logoPreviewBgClass}`}>
                        <img
                          src={logoPreview}
                          alt="Logo"
                          className="w-full h-full object-contain"
                          onLoad={(e) => handleLogoPreviewImageLoad(e.currentTarget)}
                          onError={(e) => {
                            // Try proxy endpoint as fallback if it's an absolute URL
                            if (logoPreview.startsWith('http') && !logoPreview.startsWith('data:')) {
                              const proxyUrl = aiApi.proxyImage(logoPreview);
                              if (e.currentTarget.src !== proxyUrl) {
                                e.currentTarget.src = proxyUrl;
                                return;
                              }
                            }
                            // If proxy also fails, clear the logo
                            setLogoPreview(null);
                          }}
                        />
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


// ─── Usage Detail Modal ──────────────────────────────────────────────────────
interface UsageModalProps {
  page: LandingPage;
  onClose: () => void;
}

const UsageModal = ({ page, onClose }: UsageModalProps) => {
  const usage = page.aiUsage;
  const history = page.aiUsageHistory || [];

  const [realBalance, setRealBalance] = useState<number | null>(null);
  const [globalStats, setGlobalStats] = useState<any>(null);
  const [loadingBalance, setLoadingBalance] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [balanceRes, statsRes] = await Promise.all([
          aiApi.getImgBalance().catch(() => null),
          statsApi.getDashboardStats().catch(() => null)
        ]);

        if (balanceRes?.data?.amount !== undefined) {
          setRealBalance(balanceRes.data.amount);
        } else if (balanceRes?.data?.balance !== undefined) {
          setRealBalance(balanceRes.data.balance);
        }

        if (statsRes) {
          setGlobalStats(statsRes);
        }
      } catch (err) {
        console.error('Failed to fetch usage data:', err);
      } finally {
        setLoadingBalance(false);
      }
    };
    fetchData();
  }, []);

  if (!usage && history.length === 0) return null;

  // The total combined cost is usage.cost. We also have precise fields usage.imageCost and usage.imageCount now.
  let calculatedTotalCost = usage?.cost || 0;

  // Read exact image cost from DB if available, else fallback to 0
  let calculatedImgCost = usage?.imageCost || 0;
  let calculatedImageCount = usage?.imageCount || 0;
  let calculatedTokenCost = Math.max(0, calculatedTotalCost - calculatedImgCost);

  // Fallback for old pages generated before imageCost was tracked
  if (calculatedImgCost === 0 && calculatedTotalCost > 0 && !usage?.imageCount) {
    calculatedImgCost = calculatedTotalCost * 0.40;
    calculatedTokenCost = calculatedTotalCost * 0.60;
    calculatedImageCount = Math.max(1, Math.round(calculatedImgCost / 0.002));
  }

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
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight mb-1">Tokens Consumption</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-mono font-black text-foreground">{(usage.totalTokens || 0).toLocaleString()}</span>
                    <span className="text-[10px] text-muted-foreground font-bold uppercase">Tokens</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight mb-1">Tokens Cost (Est.)</p>
                  <p className="text-3xl font-mono font-black text-blue-600">
                    ${calculatedTokenCost.toFixed(4)}
                  </p>
                </div>
              </div>

              {/* IMAGE USAGE COST UI */}
              <div className="grid grid-cols-2 gap-6 mb-6 pt-6 border-t border-border/50">
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight mb-1 flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    Image Generation
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-mono font-bold text-foreground">
                      {calculatedImageCount}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-bold uppercase">Images generated</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight mb-1">IMG - Cost Deducted</p>
                  <p className="text-2xl font-mono font-black text-purple-600">
                    ${calculatedImgCost.toFixed(4)}
                  </p>
                </div>
              </div>

              {/* TOTAL GRAND COST & BALANCE SIMULATION */}
              <div className="bg-emerald-500/10 rounded-xl p-4 border border-emerald-500/20 mb-6">
                <div className="flex items-center justify-between mb-3 pb-3 border-b border-emerald-500/20">
                  <div>
                    <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400">Grand Total Cost</p>
                    <p className="text-[10px] text-emerald-600/80 dark:text-emerald-500/80">Tokens + Images</p>
                  </div>
                  <p className="text-2xl font-mono font-black text-emerald-600 dark:text-emerald-400">
                    -${calculatedTotalCost.toFixed(4)}
                  </p>
                </div>

                {/* API Global Usage (Real-time Fetch & Estimated) */}
                <div className="space-y-2 pt-2 border-t border-border">
                  <div className="flex justify-between items-center text-[12px] font-bold text-emerald-800 dark:text-emerald-300">
                    <span>Current Balance</span>
                    <span className="font-mono text-sm">
                      {loadingBalance ? 'Loading...' : (realBalance !== null ? `$${realBalance.toFixed(2)}` : 'N/A')}
                    </span>
                  </div>

                  {realBalance !== null && (
                    <>
                      <div className="flex justify-between items-center text-[11px] font-medium text-red-500/80">
                        <span>Total Spent</span>
                        <span className="font-mono">${(globalStats?.totalAiCost || 0).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center text-[11px] font-medium text-blue-600/80 dark:text-blue-400/80">
                        <span>Images Generated</span>
                        <span className="font-mono">
                          {globalStats?.totalImagesGenerated || 0}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-[12px] font-bold text-emerald-800 dark:text-emerald-300 pt-1 border-t border-border/50">
                        <span>Remaining Balance</span>
                        <span className="font-mono text-sm">${realBalance.toFixed(2)}</span>
                      </div>
                    </>
                  )}
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

  const baseUrl = project?.websiteUrl || project?.url || window.location.origin;
  const publishUrl = page.publishedUrl || `${baseUrl.replace(/\/+$/, '')}/${project.preSlug ? project.preSlug + '/' : ''}${page.slug}`;
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://apiserver.ai-landingpages.sharehq.org';
  const scriptCode = `<script src="${apiBaseUrl}/embed.js" data-token="${project.apiToken}" async></script>`;

  const handlePublish = () => {
    onPublished({ ...page, status: "published", publishedUrl: publishUrl });
    setPublished(true);
  };

  const copyUrl = async () => {
    const success = await copyToClipboard(publishUrl);
    if (success) {
      setUrlCopied(true);
      toast.success("URL copied successfully.");
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
                className="w-full h-11 gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white border-0 shadow-md"
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
                            const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';
                            window.open(`${apiBaseUrl}/plugin/download`, '_blank');
                            toast.success("Plugin download started successfully.");
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
                              toast.success("Token copied successfully.");
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
                        toast.success("Code copied successfully.");
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

// ─── Token Help Modal ────────────────────────────────────────────────────────
interface TokenHelpModalProps {
  onClose: () => void;
  apiToken?: string;
}

const STEPS = [
  {
    num: 1,
    title: "Install & activate the plugin",
    desc: "Add our plugin to your WordPress site.",
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="M7 10l5 5 5-5" /><path d="M12 15V3" />
      </svg>
    ),
  },
  {
    num: 2,
    title: "Open plugin settings",
    desc: "Go to Site Accelerator settings in your WP admin.",
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1A2 2 0 1 1 4.4 17l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1A2 2 0 1 1 7 4.4l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1A2 2 0 1 1 19.6 7l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
      </svg>
    ),
  },
  {
    num: 3,
    title: "Copy your Website Token",
    desc: "Copy the token from the box above.",
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="7.5" cy="15.5" r="5.5" /><path d="m21 2-9.6 9.6" /><path d="m15.5 7.5 3 3L22 7l-3-3" />
      </svg>
    ),
  },
  {
    num: 4,
    title: "Paste token & verify",
    desc: "Paste into the API Key field and click Verify.",
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 2H9a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1z" /><path d="M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2" />
      </svg>
    ),
  },
  {
    num: 5,
    title: "Save & you're live",
    desc: "Click Save Settings — pages auto-sync!",
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
];

const STEP_PANELS = [
  // Step 1 — install plugin
  <div className="space-y-3">
    <div className="rounded-xl border border-border bg-muted/60 overflow-hidden">
      <div className="flex items-center gap-1.5 px-3 py-2 bg-muted border-b border-border">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400 inline-block" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-400 inline-block" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-400 inline-block" />
        <span className="ml-2 text-[11px] text-muted-foreground">WordPress · Plugins</span>
      </div>
      <div className="p-4 space-y-2">
        {[
          { name: "Buildify AI", ver: "v1.0.4", active: true },
          { name: "WP Rocket", ver: "v3.15", active: false },
          { name: "UpdraftPlus", ver: "v2.22", active: false },
        ].map((pl) => (
          <div key={pl.name} className="flex items-center justify-between px-3 py-2 rounded-lg border border-border bg-background">
            <div>
              <p className="text-xs font-semibold">{pl.name}</p>
              <p className="text-[10px] text-muted-foreground">{pl.ver}</p>
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${pl.active ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-muted text-muted-foreground"}`}>
              {pl.active && <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}><path d="M20 6 9 17l-5-5" /></svg>}
              {pl.active ? "Active" : "Installed"}
            </span>
          </div>
        ))}
        <p className="text-[10px] text-muted-foreground pt-1">Go to <b>Plugins → Add New</b>, upload <code className="bg-muted px-1 rounded">buildify-ai.zip</code>, then click <b>Activate</b>.</p>
      </div>
    </div>
  </div>,

  // Step 2 — open settings
  <div className="space-y-3">
    <div className="rounded-xl border border-border bg-muted/60 overflow-hidden">
      <div className="flex items-center gap-1.5 px-3 py-2 bg-muted border-b border-border">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400 inline-block" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-400 inline-block" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-400 inline-block" />
        <span className="ml-2 text-[11px] text-muted-foreground">WordPress · Site Accelerator Settings</span>
      </div>
      <div className="p-4 grid grid-cols-[130px_1fr] gap-3">
        <div className="rounded-lg border border-border bg-background p-3">
          <p className="text-[10px] font-bold mb-2 text-foreground">Site Accelerator</p>
          <ul className="space-y-1 text-[10px] text-muted-foreground">
            <li className="px-2 py-1 rounded bg-primary/10 text-primary font-semibold">Licence &amp; API</li>
            <li className="px-2 py-1">General</li>
            <li className="px-2 py-1">Cache</li>
          </ul>
        </div>
        <div className="rounded-lg border border-border bg-background p-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="h-2 w-2 rounded-full bg-primary inline-block" />
            <p className="text-[10px] font-bold">Performance</p>
          </div>
          <p className="text-[10px] text-muted-foreground">Automatically applies speed improvements based on your dashboard settings.</p>
        </div>
      </div>
    </div>
  </div>,

  // Step 3 — copy token (placeholder — handled by parent)
  <div className="space-y-3">
    <p className="text-xs text-muted-foreground">Your Website Token is shown in the Integration panel. Click the token box to copy it to clipboard automatically.</p>
    <div className="flex items-center gap-2 border rounded-lg px-3 py-2 bg-muted/60 border-border">
      <span className="text-[10px] font-mono text-foreground flex-1 truncate opacity-60">xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx</span>
      <Copy className="h-3.5 w-3.5 text-muted-foreground" />
    </div>
    <p className="text-[10px] text-muted-foreground italic">The token above is blurred for privacy — use the copy button in the Integration panel on the left.</p>
  </div>,

  // Step 4 — paste & verify
  <div className="space-y-3">
    <div className="rounded-xl border border-border bg-muted/60 overflow-hidden">
      <div className="flex items-center gap-1.5 px-3 py-2 bg-muted border-b border-border">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400 inline-block" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-400 inline-block" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-400 inline-block" />
        <span className="ml-2 text-[11px] text-muted-foreground">WordPress · Licence &amp; API</span>
      </div>
      <div className="p-4 space-y-3">
        <div>
          <p className="text-[10px] font-bold mb-1">API Key</p>
          <div className="flex gap-2">
            <div className="flex-1 rounded border border-border bg-background px-2 py-1.5 text-[10px] font-mono text-muted-foreground truncate">Paste your token here…</div>
            <button className="text-[10px] bg-primary text-white px-2 py-1 rounded font-semibold">Verify</button>
          </div>
        </div>
        <div>
          <p className="text-[10px] font-bold mb-1">Licence Status</p>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">ACTIVE</span>
        </div>
      </div>
    </div>
  </div>,

  // Step 5 — save & live
  <div className="flex flex-col items-center justify-center py-6 gap-4">
    <div className="h-14 w-14 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg">
      <svg className="h-7 w-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M20 6 9 17l-5-5" /></svg>
    </div>
    <p className="text-base font-bold text-foreground">You're all set!</p>
    <p className="text-sm text-muted-foreground text-center max-w-xs">Click <b>Save Settings</b> in your WordPress plugin. Your landing pages will auto-sync within seconds.</p>
  </div>,
];

const TokenHelpModal = ({ onClose, apiToken }: TokenHelpModalProps) => {
  const [step, setStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!apiToken) return;
    const ok = await copyToClipboard(apiToken);
    if (ok) { setCopied(true); setTimeout(() => setCopied(false), 2000); }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="w-full max-w-2xl bg-background rounded-3xl border border-border shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-7 pt-7 pb-3">
          <div>
            <h3 className="text-xl font-bold text-foreground">How to use your Website Token</h3>
            <p className="text-sm text-muted-foreground mt-0.5">Connect your WordPress site in five simple steps.</p>
          </div>
          <button
            onClick={onClose}
            className="h-9 w-9 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Step Stepper */}
        <div className="px-7 pb-2">
          <div className="grid grid-cols-5 gap-2">
            {STEPS.map((s, i) => (
              <button
                key={s.num}
                onClick={() => setStep(i)}
                className={`flex flex-col gap-1.5 p-2.5 rounded-xl border text-left transition-all ${i === step ? "border-primary bg-primary/5 shadow-sm" : i < step ? "border-emerald-200 bg-emerald-50" : "border-border bg-background hover:border-primary/30"}`}
              >
                <div className="flex items-center gap-1.5">
                  <span className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${i === step ? "bg-gradient-to-br from-primary to-violet-500 text-white" : i < step ? "bg-emerald-500 text-white" : "bg-muted text-muted-foreground"}`}>
                    {i < step ? "✓" : s.num}
                  </span>
                  <span className={`${i === step ? "text-primary" : "text-muted-foreground"}`}>{s.icon}</span>
                </div>
                <p className={`text-[10px] font-semibold leading-tight ${i === step ? "text-foreground" : "text-muted-foreground"}`}>{s.title}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="px-7 pt-4 pb-2 grid grid-cols-[1fr_1.2fr] gap-6 items-start min-h-[220px]">
          {/* Left: description + nav */}
          <div className="flex flex-col justify-between h-full">
            <div>
              <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Step {step + 1} of {STEPS.length}</p>
              <h4 className="text-base font-bold text-foreground mb-1">{STEPS[step].title}</h4>
              <p className="text-sm text-muted-foreground mb-4">{STEPS[step].desc}</p>
              {/* Token copy box on step 3 */}
              {step === 2 && apiToken && (
                <div
                  onClick={handleCopy}
                  className={`flex items-center gap-2 border rounded-lg px-3 py-2 cursor-pointer transition-all ${copied ? "bg-emerald-50 border-emerald-200" : "bg-muted border-border hover:border-primary/30"}`}
                >
                  <span className={`text-[10px] font-mono flex-1 truncate ${copied ? "text-emerald-700" : "text-foreground"}`}>{apiToken}</span>
                  {copied ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" /> : <Copy className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />}
                </div>
              )}
            </div>
            <div className="flex gap-2 pt-4">
              <button
                disabled={step === 0}
                onClick={() => setStep(s => Math.max(0, s - 1))}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-semibold text-muted-foreground hover:bg-muted transition-all disabled:opacity-30"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back
              </button>
              <button
                onClick={() => step < STEPS.length - 1 ? setStep(s => s + 1) : onClose()}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-primary to-violet-600 text-white text-xs font-semibold shadow hover:brightness-105 transition-all"
              >
                {step < STEPS.length - 1 ? "Next step" : "Done!"}
                {step < STEPS.length - 1 && <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M5 12h14M12 5l7 7-7 7" /></svg>}
              </button>
            </div>
          </div>

          {/* Right: visual panel */}
          <div className="text-sm">{STEP_PANELS[step]}</div>
        </div>

        {/* Footer */}
        <div className="px-7 py-4 border-t border-border bg-muted/20 flex items-center justify-between">
          <p className="text-[10px] text-muted-foreground">Need help? Contact support from your dashboard.</p>
          <Button onClick={onClose} className="bg-primary text-white px-5 h-8 text-xs">Got it!</Button>
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
  // "Website Name" = the scraped/display name (stored in project.name)
  // Pre-fill from websiteUrl if name looks like a raw URL title
  const [name, setName] = useState(
    project.websiteUrl
      ? project.websiteUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')
      : project.name
  );
  const [websiteUrl, setWebsiteUrl] = useState(project.websiteUrl || project.url || "");
  const [preSlug, setPreSlug] = useState(project.preSlug || "");
  const [industry, setIndustry] = useState(project.industry || project.category || "SaaS");
  const [subIndustry, setSubIndustry] = useState(project.subIndustry || project.scrapedData?.subIndustry || "");

  const handleSave = () => {
    if (!name.trim()) { toast.error("Project name is required."); return; }
    onSave({ name, websiteUrl, preSlug, industry, subIndustry });
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
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Website Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. samsung.com" />
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
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Industry</label>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
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
          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Sub-Industry</label>
            <Input
              value={subIndustry}
              onChange={(e) => setSubIndustry(e.target.value)}
              placeholder="e.g. Fintech, Dental Care, Luxury Homes"
            />
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

  // ── Query 1: Project meta (header, stats, integration panel) ─────────────────
  // Seeds instantly from the projects list cache so the header renders with zero delay.
  const cachedProjects: any[] = queryClient.getQueryData(["projects"]) ?? [];
  const cachedProject = useMemo(
    () => cachedProjects.find((p: any) => p._id === id),
    [cachedProjects, id]
  );

  const { data: project, isLoading, error } = useQuery({
    queryKey: ["project", id],
    queryFn: () => projectsApi.getById(id!),
    enabled: !!id,
    initialData: cachedProject,   // render header instantly while detail loads
    staleTime: 30_000,            // mutations call invalidateQueries manually — no polling needed
  });

  // ── Query 2: Pages list (independent — only this section re-renders on change) ──
  // Fetches lightweight page summaries (no HTML content) separately from project meta.
  // Mutations call invalidateQueries(["project-pages", id]) to refresh only this block.
  const { data: pages = [], isLoading: pagesLoading } = useQuery({
    queryKey: ["project-pages", id],
    queryFn: () => projectsApi.getPagesSummary(id!),
    enabled: !!id,
    staleTime: 30_000,
  });

  const displayCategory = project ? (project.websiteProfile?.industry?.industry || project.industry || project.category || "General") : "General";
  const isSwitching = !!(project && project._id !== id);

  const [createOpen, setCreateOpen] = useState(false); // kept for compatibility but unused
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
  const [menuOpenPageId, setMenuOpenPageId] = useState<string | null>(null);
  const [showTokenHelp, setShowTokenHelp] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [logoHeaderBgClass, setLogoHeaderBgClass] = useState<string>("rounded-2xl p-2 shadow-lg shadow-slate-900/20");
  const [logoHeaderBgColor, setLogoHeaderBgColor] = useState<string>("rgb(197, 197, 197)");


  // Mutations
  const createPageMutation = useMutation({
    mutationFn: (page: Partial<LandingPage>) => pagesApi.create(id!, page),
    onSuccess: (newPage) => {
      // Invalidate pages list (the heavy part) + project meta (for count badges)
      queryClient.invalidateQueries({ queryKey: ["project-pages", id] });
      queryClient.invalidateQueries({ queryKey: ["project", id] });
      setCreateOpen(false);
      toast.success("Page created successfully.");
      navigate(`/editor/${id}/${newPage._id}`);
    },
    onError: (err: any) => toast.error(err.message || "Failed to create page"),
  });

  const deletePageMutation = useMutation({
    mutationFn: (pageId: string) => pagesApi.delete(id!, pageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-pages", id] });
      queryClient.invalidateQueries({ queryKey: ["project", id] });
      setDeletePageId(null);
      toast.success("Page deleted successfully.");
    },
    onError: () => toast.error("Failed to delete page"),
  });

  const updatePageMutation = useMutation({
    mutationFn: (page: LandingPage) => pagesApi.update(id!, page._id, page),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-pages", id] });
      setPublishingPage(null);
      toast.success("Page updated successfully.");
    },
    onError: () => toast.error("Failed to update page"),
  });

  const updateProjectMutation = useMutation({
    mutationFn: (data: Partial<Project>) => projectsApi.update(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project", id] });
      queryClient.invalidateQueries({ queryKey: ["projects"] }); // refresh list too
      setEditProjectOpen(false);
      toast.success("Project updated successfully.");
    },
    onError: () => toast.error("Failed to update project"),
  });


  useEffect(() => {
    if (project) {
      const pubId = searchParams.get("publish");
      if (pubId) {
        const page = pages.find(p => p._id === pubId);
        if (page) {
          setPublishingPage(page);
        }
        navigate(`/dashboard/projects/${project._id}`, { replace: true });
      }
    }
  }, [project, searchParams, navigate]);

  const filteredPages = pages.filter(p => {
    // 1. Status Filter
    if (statusFilter !== "all" && p.status?.toLowerCase() !== statusFilter.toLowerCase()) {
      return false;
    }
    // 2. Search Text Filter
    if (search.trim()) {
      const query = search.toLowerCase();
      const matchesName = p.name?.toLowerCase().includes(query);
      const matchesSlug = p.slug?.toLowerCase().includes(query);
      const matchesType = p.type?.toLowerCase().includes(query);
      return matchesName || matchesSlug || matchesType;
    }
    return true;
  }) || [];

  if (isLoading && !project) return (
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
        setIntegTokenCopied(true);
        toast.success("Token copied successfully.");
        setTimeout(() => setIntegTokenCopied(false), 2000);
      }
    }
  };

  const handleCopyScript = async () => {
    if (scriptCode) {
      const success = await copyToClipboard(scriptCode);
      if (success) {
        setIntegScriptCopied(true);
        toast.success("Script copied successfully.");
        setTimeout(() => setIntegScriptCopied(false), 2000);
      }
    }
  };

  // Computed stats
  // pages come from the separate pages query above
  const publishedCount = pages.filter((p: any) => p.status?.toLowerCase() === "published").length;
  const draftCount = pages.filter((p: any) => p.status?.toLowerCase() !== "published").length;
  const totalLeads = project.leadCount || pages.reduce((sum, p) => sum + ((p as any).leads?.length || 0), 0);
  const totalViews = (project as any).views || pages.reduce((sum, p) => sum + (p.views || 0), 0);

  const scriptCode = `<script src="${import.meta.env.VITE_API_BASE_URL || 'https://apiserver.ai-landingpages.sharehq.org'}/embed.js" data-token="${project?.apiToken}" async></script>`;

  const handleHeaderLogoImageLoad = (img: HTMLImageElement) => {
    const brightness = getImageAverageBrightness(img);
    const bgClass = getLogoPreviewContainerClasses(brightness);
    setLogoHeaderBgClass(bgClass);
    // Set appropriate background color based on brightness
    setLogoHeaderBgColor(brightness !== null && brightness >= 0.65 ? "rgb(20, 24, 32)" : "rgb(197, 197, 197)");
  };

  return (
    <div className="flex-1 min-h-full flex flex-col"
      onClick={() => setMenuOpenPageId(null)}
      style={{ background: "#f2f2f2" }}
    >

      {/* Modals */}
      {editProjectOpen && (
        <EditProjectModal
          project={project}
          onClose={() => setEditProjectOpen(false)}
          onSave={(data) => updateProjectMutation.mutate(data)}
        />
      )}
      {/* CreatePageModal removed – now a full page at /dashboard/projects/:id/create-page */}
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
      <ConfirmDeleteModal
        isOpen={!!deletePageId}
        onClose={() => setDeletePageId(null)}
        onConfirm={confirmDelete}
        title="Delete Landing Page?"
        description="Are you absolutely sure? This action cannot be undone and will permanently remove this landing page."
      />

      {showTokenHelp && (
        <TokenHelpModal onClose={() => setShowTokenHelp(false)} apiToken={project.apiToken} />
      )}

      {/* ─── Page Top Bar / Breadcrumb ─── */}
      <div className="px-4 sm:px-4 pt-6 pb-4 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900">

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto min-w-0">
          <button
            onClick={() => navigate("/dashboard")}
            className="h-8 px-3 text-xs font-semibold inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm mr-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back
          </button>

          <div className="h-7 w-7 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden bg-white border border-slate-200 shadow-sm">
            {(project.websiteProfile?.identity?.favicon || project.logoUrl) ? (
              <img
                src={project.websiteProfile?.identity?.favicon || project.logoUrl!}
                alt="favicon"
                className="h-5 w-5 object-contain"
                onError={(e) => {
                  const cur = e.currentTarget;
                  const currentSrc = cur.src || '';
                  if (currentSrc.startsWith('http') && !currentSrc.includes('/proxy-image')) {
                    cur.src = aiApi.proxyImage(project.websiteProfile?.identity?.favicon || project.logoUrl!);
                    return;
                  }
                  cur.style.display = 'none';
                  (cur.nextSibling as HTMLElement)?.removeAttribute('style');
                }}
              />
            ) : null}
            <Globe
              className="h-3.5 w-3.5 text-primary"
              style={(project.websiteProfile?.identity?.favicon || project.logoUrl) ? { display: 'none' } : undefined}
            />
          </div>

          <Select
            value={id}
            onValueChange={(val) => {
              if (val && val !== id) {
                navigate(`/dashboard/projects/${val}`);
              }
            }}
            {...({ modal: false } as any)}
          >
            <SelectTrigger className="border-0 p-0 h-auto w-auto bg-transparent hover:bg-transparent shadow-none focus:ring-0 focus:ring-offset-0 flex items-center justify-start gap-1 cursor-pointer max-w-[200px] sm:max-w-[300px] focus:outline-none">
              <span className="text-lg font-bold text-foreground truncate hover:text-primary transition-colors">
                {(project.name || project.websiteProfile?.extraction?.sourceUrl || project.websiteProfile?.extraction?.finalUrl)
                  ? (project.name || project.websiteProfile?.extraction?.sourceUrl || project.websiteProfile?.extraction?.finalUrl)!
                    .replace(/^https?:\/\//, '').replace(/\/$/, '')
                  : project.name}
              </span>
            </SelectTrigger>
            <SelectContent>
              {(cachedProjects as any[]).map((p: any) => (
                <SelectItem key={p._id} value={p._id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full flex-shrink-0">
            {displayCategory}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto md:justify-end">
          {project.logoUrl && (
            <div className={`inline-flex items-center justify-center py-2 px-4 rounded-md`}>
              <img
                src={normalizeLogoUrl(project.logoUrl)}
                alt="brand-logo"
                className="max-h-12 max-w-[80px] object-contain transition-transform hover:scale-105"
                onLoad={(e) => handleHeaderLogoImageLoad(e.currentTarget)}
                onError={(e) => {
                  // Try proxy endpoint as fallback if it's an absolute URL
                  const currentSrc = (e.currentTarget.src || '');
                  if (currentSrc.startsWith('http') && !currentSrc.startsWith('data:') && !currentSrc.includes('/proxy-image')) {
                    const proxyUrl = aiApi.proxyImage(project.logoUrl);
                    if (currentSrc !== proxyUrl) {
                      e.currentTarget.src = proxyUrl;
                      return;
                    }
                  }
                  // If all else fails, hide the image
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}
          <a
            href={cleanUrl(project.websiteUrl || project.websiteProfile?.extraction?.sourceUrl || project.websiteProfile?.extraction?.finalUrl)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-all bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-2 rounded-xl hover:shadow-md hover:border-primary/30 group"
          >
            <div className="h-5 w-5 flex items-center justify-center flex-shrink-0 overflow-hidden rounded">
              {(project.websiteProfile?.identity?.favicon || project.logoUrl) ? (
                <img
                  src={project.websiteProfile?.identity?.favicon || project.logoUrl!}
                  alt="favicon"
                  className="h-4 w-4 object-contain"
                  onError={(e) => {
                    const cur = e.currentTarget;
                    const currentSrc = cur.src || '';
                    if (currentSrc.startsWith('http') && !currentSrc.includes('/proxy-image')) {
                      cur.src = aiApi.proxyImage(project.websiteProfile?.identity?.favicon || project.logoUrl!);
                      return;
                    }
                    cur.style.display = 'none';
                    (cur.nextSibling as HTMLElement)?.removeAttribute('style');
                  }}
                />
              ) : null}
              <Globe
                className="h-4 w-4 text-slate-400 group-hover:text-primary transition-colors"
                style={(project.websiteProfile?.identity?.favicon || project.logoUrl) ? { display: 'none' } : undefined}
              />
            </div>
            <span className="font-bold tracking-tight">
              {(project.websiteUrl || project.websiteProfile?.extraction?.sourceUrl || project.websiteProfile?.extraction?.finalUrl)
                ? (project.websiteUrl || project.websiteProfile?.extraction?.sourceUrl || project.websiteProfile?.extraction?.finalUrl)!
                  .replace(/^https?:\/\//, '').replace(/\/$/, '')
                : '—'}
            </span>
          </a>
        </div>
      </div>

      {/* ─── MAIN CONTENT (full-width, single column) ─── */}
      <div className="w-full px-4 py-4 space-y-4 flex-1 relative" style={{ background: "#f2f2f2" }}>

        {isSwitching && (
          <div className="absolute inset-0 z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md flex items-center justify-center">
            <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* ─── Stats Summary Bar ─── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Total Pages", value: pages.length, icon: <FileText className="h-4 w-4" />, color: "from-violet-500 to-indigo-500", textColor: "text-violet-600" },
            { label: "Published", value: publishedCount, icon: <Globe className="h-4 w-4" />, color: "from-emerald-500 to-teal-500", textColor: "text-emerald-600" },
            { label: "Draft", value: draftCount, icon: <FileEdit className="h-4 w-4" />, color: "from-slate-500 to-slate-700", textColor: "text-slate-600" },
            { label: "Total Leads", value: totalLeads, icon: <UsersIcon className="h-4 w-4" />, color: "from-amber-500 to-orange-500", textColor: "text-amber-600" },

          ].map((stat) => (
            <div key={stat.label} className="rounded-xl border border-border bg-card p-4 flex items-center gap-3 transition-all hover:shadow-md">
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
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_250px] gap-3 items-start">

          {/* ─── Left Side: Landing Pages List ─── */}
          <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden flex flex-col h-[calc(100vh-280px)] min-h-[400px]">
            {/* Section Header */}
            <div className="px-6 py-4 border-b border-border flex flex-wrap items-center justify-between bg-card gap-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center shadow-sm">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-foreground">Landing Pages</h2>
                  <p className="text-xs text-muted-foreground">{pages.length} page{pages.length !== 1 ? "s" : ""} in this project</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {/* Search Bar Input */}
                <div className="relative w-40 md:w-52">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <Input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search pages..."
                    className="pl-9 pr-8 h-9 bg-background border-border text-xs rounded-xl focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-slate-300"
                  />
                  {search.trim() && (
                    <button
                      onClick={() => setSearch("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-foreground focus:outline-none"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-9 w-[120px] bg-background border-border text-xs font-semibold rounded-xl">
                    <div className="flex items-center gap-2">
                      <Filter className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <SelectValue placeholder="Filter" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border">
                    <SelectItem value="all" className="text-xs">All Pages</SelectItem>
                    <SelectItem value="published" className="text-xs">Published</SelectItem>
                    <SelectItem value="draft" className="text-xs">Drafts</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  onClick={() => navigate(`/dashboard/projects/${id}/create-page`)}
                  className="h-9 gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white border-0 shadow-sm text-sm rounded-xl"
                >
                  <Plus className="h-4 w-4" /> New Page
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto flex-1 overflow-y-auto custom-scrollbar">
              <div className="min-w-[700px]">
                {/* Table Header */}
                {pages.length > 0 && (
                  <div className="sticky top-0 z-10 grid grid-cols-[1fr_90px_60px_80px_100px_100px] gap-4 px-6 py-2.5 border-b border-border bg-muted/95 backdrop-blur-sm text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    <span>Page Name</span>
                    <span className="text-center">Status</span>
                    <span className="text-center">Preview</span>
                    <span className="text-center">Leads</span>
                    <span className="text-center">Usage</span>
                    <span className="text-right">Actions</span>
                  </div>
                )}

                <div className="divide-y divide-border">
                  {pagesLoading ? (
                    <div className="divide-y divide-border">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="flex items-center gap-4 px-6 py-4">
                          <div className="h-10 w-10 rounded-xl bg-muted animate-pulse flex-shrink-0" />
                          <div className="flex-1 space-y-2">
                            <div className="h-3 w-1/3 bg-muted animate-pulse rounded" />
                            <div className="h-2 w-1/4 bg-muted animate-pulse rounded" />
                          </div>
                          <div className="h-6 w-20 bg-muted animate-pulse rounded-full" />
                          <div className="h-8 w-16 bg-muted animate-pulse rounded-lg" />
                        </div>
                      ))}
                    </div>
                  ) : filteredPages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                      <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center mb-4 shadow-lg">
                        <Zap className="h-7 w-7 text-white" />
                      </div>
                      <p className="text-base font-bold text-foreground mb-1">No {statusFilter !== 'all' ? statusFilter : ''} pages found</p>
                      <p className="text-sm text-muted-foreground mb-5">
                        {statusFilter === 'all'
                          ? "Create your first landing page to get started"
                          : `You don't have any ${statusFilter} pages in this project.`}
                      </p>
                      {statusFilter === 'all' && (
                        <Button
                          onClick={() => navigate(`/dashboard/projects/${id}/create-page`)}
                          className="gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white border-0"
                        >
                          <Plus className="h-4 w-4" /> Create Landing Page
                        </Button>
                      )}
                    </div>
                  ) : (
                    filteredPages.map((page) => (
                      <div
                        key={page._id}
                        className="grid grid-cols-[1fr_90px_60px_80px_100px_100px] gap-4 items-center px-6 py-4 hover:bg-muted/30 transition-all group"
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
                            </div>
                            <p className="text-[10px] text-muted-foreground font-mono truncate mt-0.5 opacity-70">
                              /{project.preSlug ? project.preSlug + '/' : ''}{page.slug}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-start md:justify-center">
                          <span className={`text-[9px] font-black px-2 py-0.5 rounded-full  tracking-tighter ${page.status?.toLowerCase() === 'published' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
                            {page.status?.toLowerCase() === 'published' ? 'Published' : (page.status || 'Draft')}
                          </span>
                        </div>

                        <div className="flex items-center justify-start md:justify-center">
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              const preSlugPrefix = project.preSlug ? project.preSlug + '/' : '';
                              const url = page.status === "published"
                                ? `/${preSlugPrefix}${page.slug}`
                                : `/preview/${preSlugPrefix}${page.slug}?token=${page.previewToken || ''}`;
                              window.open(url, '_blank');
                            }}
                            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors cursor-pointer p-1 rounded hover:bg-primary/5"
                            title={page.status === "published" ? "View Live Page" : "Preview Draft"}
                          >
                            <Eye className="h-4 w-4" />
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

                        <div className="flex items-center gap-2 justify-end">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/editor/${project._id}/${page._id}`);
                            }}
                            className="h-7 px-3 text-[10px] font-bold gap-1.5 border-primary/20 text-primary hover:bg-primary hover:text-white transition-all rounded-lg"
                          >
                            <FileEdit className="h-3 w-3" />
                            Editor
                          </Button>

                          <div className="relative">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setMenuOpenPageId(menuOpenPageId === page._id ? null : page._id);
                              }}
                              className={`h-8 w-8 p-0 transition-all rounded-lg ${menuOpenPageId === page._id ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}
                              title="More Actions"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>

                            {menuOpenPageId === page._id && (
                              <div className="absolute right-0 top-9 z-50 w-40 rounded-xl border border-border bg-card shadow-xl overflow-hidden py-1 animate-in fade-in zoom-in duration-200">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setMenuOpenPageId(null);
                                    navigate(`/dashboard/projects/${project._id}/pages/${page._id}/settings`);
                                  }}
                                  className="flex w-full items-center gap-2 px-3 py-2.5 text-xs text-foreground hover:bg-muted transition-colors"
                                >
                                  <Settings2 className="h-3.5 w-3.5 text-slate-400" /> Page Settings
                                </button>
                                <div className="h-px bg-border my-1" />
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setMenuOpenPageId(null);
                                    setDeletePageId(page._id);
                                  }}
                                  className="flex w-full items-center gap-2 px-3 py-2.5 text-xs text-red-500 hover:bg-red-50 transition-colors"
                                >
                                  <Trash2 className="h-3.5 w-3.5" /> Delete Page
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ─── Right Side: Integration & Embedding ─── */}
          <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-border bg-card flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-sm">
                  <Link className="h-3.5 w-3.5 text-white" />
                </div>
                <h2 className="text-base font-bold text-foreground">Integration </h2>
              </div>
              <p className="text-[11px] text-muted-foreground ml-10">WordPress or Script</p>
            </div>

            <div className="p-4 space-y-4">
              <div className="flex gap-1 bg-muted p-1 rounded-xl">
                {([
                  {
                    id: "wordpress" as const, icon: (
                      <img src="/assets/wordpress-logo.webp" alt="WP" className="h-4 w-4 object-contain" />
                    ), label: "WP"
                  },
                  // { id: "script" as const, icon: <Code2 className="h-3.5 w-3.5" />, label: "Script" },
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
                        num: 1, title: "Download Plugin", desc: "Install a plugin in your WordPress website", extra: (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-[10px] mt-1.5 gap-1.5"
                            onClick={() => {
                              const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';
                              window.open(`${apiBaseUrl}/plugin/download`, '_blank');
                              toast.success("Plugin download started successfully.");
                            }}
                          >
                            <Download className="h-3 w-3" /> Download
                          </Button>
                        )
                      },
                      {
                        num: 2, title: "Website  Token", desc: "Copy & paste the API token in the plugin settings", extra: (
                          <div className="mt-1.5 w-full">
                            <div
                              onClick={copyToken}
                              className={`flex items-center gap-2 border rounded-lg px-2 py-1 cursor-pointer w-full justify-between transition-all ${integTokenCopied ? "bg-emerald-50 border-emerald-200" : "bg-muted border-border hover:border-primary/30"}`}
                            >
                              <span className={`text-[10px] font-mono truncate max-w-[110px] ${integTokenCopied ? "text-emerald-700" : ""}`}>{project.apiToken}</span>
                              {integTokenCopied ? <CheckCircle2 className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3 text-muted-foreground" />}
                            </div>
                            <div className="mt-2 flex items-center gap-1.5">
                              <span className={`h-2 w-2 rounded-full ${project?.isVerified ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                              <span className="text-[10px] font-medium text-muted-foreground">
                                Status: <span className={project?.isVerified ? "text-emerald-600 font-bold" : "text-slate-500"}>{project?.isVerified ? 'Verified' : 'Pending Verification'}</span>
                              </span>
                            </div>
                          </div>
                        )
                      },
                    ].map((s) => (
                      <div key={s.num} className="flex gap-2.5">
                        <div className="h-5 w-5 rounded-full bg-primary/10 text-primary text-[9px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{s.num}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-start gap-2 pr-1">
                            <p className="text-xs font-semibold text-foreground">{s.title}</p>
                            {s.num === 2 && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowTokenHelp(true);
                                }}
                                className="h-5 w-5 rounded-lg bg-primary/5 hover:bg-primary/15 flex items-center justify-center text-primary transition-all hover:scale-110 active:scale-95 border border-primary/10"
                                title="Show Guide"
                              >
                                <Info className="h-3 w-3" />
                              </button>
                            )}
                          </div>
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
                      <p className="text-xs font-medium">Add this script to your website’s &lt;head&gt; section</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`h-7 text-[10px] gap-1.5 transition-all ${integScriptCopied ? "text-emerald-600 bg-emerald-50" : ""}`}
                        onClick={handleCopyScript}
                      >
                        {integScriptCopied ? <><CheckCircle2 className="h-3 w-3" /> Copied!</> : <><Copy className="h-3 w-3" /> Copy</>}
                      </Button>
                    </div>
                    <pre className="text-[9px] font-mono bg-muted rounded-lg p-2.5 overflow-x-auto whitespace-pre-wrap break-all border border-border">{scriptCode}</pre>
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