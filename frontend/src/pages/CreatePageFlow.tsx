import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Sparkles, Link2, Upload, CheckCircle2, Rocket, ImagePlus, Globe, Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { pagesApi, aiApi, projectsApi, type Project } from "@/services/api";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { generateLandingPageHtml } from "@/lib/landingPageTemplates";
import { ModernLoader } from "@/components/ui/ModernLoader";
import { toast } from "sonner";

type Step = "methods" | "create-ai" | "analyze" | "crafting";

const CreatePageFlow = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const queryClient = useQueryClient();

  const { data: project } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => projectsApi.getById(projectId!),
    enabled: !!projectId,
  });

  const [step, setStep] = useState<Step>("methods");

  // Create with AI form state
  const [pageName, setPageName] = useState("");
  const [slug, setSlug] = useState("");
  const [prefix, setPrefix] = useState("");
  const [noIndex, setNoIndex] = useState(false);
  const [noFollow, setNoFollow] = useState(false);

  const [businessName, setBusinessName] = useState("");
  const [industry, setIndustry] = useState("SaaS");
  const [selectedPageType, setSelectedPageType] = useState("landing");
  const [businessDesc, setBusinessDesc] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [ctaText, setCtaText] = useState("Get Started Free");
  const [aiPrompt, setAiPrompt] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#7c3aed");
  const [secondaryColor, setSecondaryColor] = useState("#a855f7");
  const [accentColor, setAccentColor] = useState("#6366f1");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | undefined>(undefined);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const industries = ["SaaS", "E-commerce", "Agency", "Healthcare", "Education", "Finance", "Real Estate", "Other"];
  const pageTypes = [
    { id: "landing", label: "Landing Page", icon: <Rocket className="h-6 w-6" /> },
  ];
  const extractItems = [
    "Logo & brand colors",
    "Page structure & layout",
    "Content & copy text",
    "SEO metadata",
    "Images & media",
    "Call-to-action buttons",
  ];

  useEffect(() => {
    if (project) {
      setBusinessName(project.name);
      setBusinessDesc(project.description || "");
      setPrimaryColor(project.primaryColor || "#7c3aed");
      setSecondaryColor(project.secondaryColor || "#a855f7");
      setLogoUrl(project.logoUrl);
      setIndustry(project.industry || "SaaS");
    }
  }, [project]);

  const autoSlug = (v: string) => v.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

  const handlePageNameChange = (name: string) => {
    setPageName(name);
    if (!slug || slug === autoSlug(pageName)) {
      setSlug(autoSlug(name));
    }
  };

  const finalSlug = prefix ? `${prefix}-${slug}` : slug;

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoPreview(URL.createObjectURL(file));
      const reader = new FileReader();
      reader.onloadend = () => setLogoUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setScreenshotPreview(URL.createObjectURL(file));
    }
  };

  // Analyze state
  const [websiteUrl, setWebsiteUrl] = useState("");

  // Crafting progress
  const [progress, setProgress] = useState(0);

  const handleAiGenerate = async () => {
    if (!pageName.trim()) { toast.error("Please enter a page name."); return; }
    if (!aiPrompt.trim()) { toast.error("Please describe your page."); return; }

    setIsCreating(true);
    try {
      const payload = {
        projectId,
        title: pageName,
        slug: finalSlug,
        prefix,
        noIndex,
        noFollow,
        businessName,
        industry,
        businessDescription: businessDesc,
        primaryColor,
        secondaryColor,
        logoUrl,
        aiPrompt,
        pageType: selectedPageType,
        targetAudience,
        ctaText,
        services: project?.services || [],
        keywords: project?.keywords || [],
      };

      const res = await pagesApi.create(projectId!, payload);
      toast.success("Page creation started!", {
        description: "AI is now crafting your landing page. This will only take a moment.",
      });
      navigate(`/dashboard/projects/${projectId}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to create page");
    } finally {
      setIsCreating(false);
    }
  };

  const startCrafting = async () => {
        setStep("crafting");
        setProgress(0);
        let done = false;
        let hasError = false;
        let progressValue = 0;
        const interval = setInterval(() => {
          setProgress((prev) => {
            if (done) {
              clearInterval(interval);
              return 100;
            }
            progressValue = Math.min(92, prev + 3);
            return progressValue;
          });
        }, 120);

        try {
          const res = await aiApi.generate({
            businessName,
            industry,
            pageType: selectedPageType === "landing" ? "lead generation" : "lead generation",
            businessDescription: businessDesc,
            targetAudience,
            ctaText,
            aiPrompt,
            primaryColor,
            secondaryColor,
            logoUrl,
          });

          const aiContent = res?.data?.content;
          if (aiContent?.fullHtml) {
            localStorage.setItem("grapes-initial-html", aiContent.fullHtml);
            localStorage.setItem("grapes-initial-css", aiContent.fullCss || "");
          } else {
            throw new Error("AI response missing HTML.");
          }
        } catch {
          hasError = true;
        } finally {
          done = true;
          if (hasError) {
            setProgress(0);
            setStep("create-ai");
            toast.error("Generation failed", {
              description: "AI generation failed. Please check your connection or try again.",
            });
          } else {
            setProgress(100);
            setTimeout(() => navigate("/editor"), 350);
          }
        }
      };

      const startAnalyze = async () => {
        setStep("crafting");
        setProgress(0);
        let done = false;
        let hasError = false;
        const interval = setInterval(() => {
          setProgress((prev) => {
            if (done) {
              clearInterval(interval);
              return 100;
            }
            return Math.min(92, prev + 3);
          });
        }, 120);

        try {
          const res = await aiApi.analyze(websiteUrl);
          const aiContent = res?.data?.content;
          if (aiContent?.fullHtml) {
            localStorage.setItem("grapes-initial-html", aiContent.fullHtml);
            localStorage.setItem("grapes-initial-css", aiContent.fullCss || "");
          } else {
            throw new Error("AI response missing HTML.");
          }
        } catch {
          hasError = true;
        } finally {
          done = true;
          if (hasError) {
            setProgress(0);
            setStep("analyze");
            toast.error("Analysis failed", {
              description: "AI analysis failed. Please check the URL and your connection.",
            });
          } else {
            setProgress(100);
            setTimeout(() => navigate("/editor"), 350);
          }
        }
      };

    return (
      <div className="flex-1 overflow-y-auto">
        {/* Methods Selection */}
        {step === "methods" && (
          <div className="flex flex-col items-center justify-center min-h-full py-20">
            <h1 className="text-3xl font-bold text-foreground mb-2">How would you like to start?</h1>
            <p className="text-muted-foreground mb-12">Choose a method to create your AI-powered landing page</p>

            <div className="flex gap-6">
              <button
                onClick={() => setStep("create-ai")}
                className="w-72 rounded-xl border border-border bg-card p-8 text-left hover:border-primary/40 hover:shadow-lg transition-all group"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-5">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">SEO / PPC Landing Page</h3>
                <p className="text-sm text-muted-foreground">Tell AI what you need and get an optimized SEO/PPC generation.</p>
              </button>

              <button
                onClick={() => setStep("analyze")}
                className="w-72 rounded-xl border border-border bg-card p-8 text-left hover:border-primary/40 hover:shadow-lg transition-all group"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 mb-5">
                  <Link2 className="h-6 w-6 text-blue-500" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Analyze a Website</h3>
                <p className="text-sm text-muted-foreground">Paste a URL and AI creates an optimized version.</p>
              </button>
            </div>
          </div>
        )}

        {/* Create with AI Form */}
        {step === "create-ai" && (
          <div className="max-w-2xl mx-auto py-10 px-6">
            <button onClick={() => setStep("methods")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
              <ArrowLeft className="h-4 w-4" /> Back to methods
            </button>
            <h1 className="text-3xl font-bold text-foreground mb-2">Create SEO / PPC Landing Page</h1>
            <p className="text-muted-foreground mb-8">Fill in your details and let AI generate an optimized landing page for you.</p>

            <div className="rounded-xl border border-border bg-card p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Page Name *</label>
                  <Input
                    value={pageName}
                    onChange={(e) => handlePageNameChange(e.target.value)}
                    placeholder="e.g. Digital Marketing"
                    className="mt-1.5 h-11"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Prefix (Optional)</label>
                  <Input
                    value={prefix}
                    onChange={(e) => setPrefix(e.target.value)}
                    placeholder="e.g. landing"
                    className="mt-1.5 h-11"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Final Slug Preview</label>
                <div className="mt-1.5 p-3 bg-muted rounded-lg font-mono text-sm border border-border">
                  {finalSlug || "your-page-slug"}
                </div>
              </div>

              {/* Service Selection */}
              {project?.services && project.services.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-foreground">Select a Service</label>
                  <div className="grid grid-cols-2 gap-2 mt-1.5">
                    {project.services.map((service: string) => (
                      <button
                        key={service}
                        onClick={() => handlePageNameChange(service)}
                        className={`px-3 py-2 rounded-lg border text-xs font-medium transition-all ${pageName === service
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:border-primary/50"
                          }`}
                      >
                        {service}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* SEO Settings */}
              <div className="space-y-3 pt-2">
                <p className="text-sm font-medium text-foreground">SEO Settings</p>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={noIndex}
                      onChange={(e) => setNoIndex(e.target.checked)}
                      className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-muted-foreground">No Index</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={noFollow}
                      onChange={(e) => setNoFollow(e.target.checked)}
                      className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-muted-foreground">No Follow</span>
                  </label>
                </div>
              </div>

              {/* Business Name & Industry */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Business Name *</label>
                  <Input value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="My Awesome Business" className="mt-1.5 h-11" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Industry *</label>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="mt-1.5 flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    {industries.map((ind) => (
                      <option key={ind} value={ind}>{ind}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Logo Upload */}
              <div>
                <label className="text-sm font-medium text-foreground">Logo Upload</label>
                <div className="mt-1.5 rounded-lg border-2 border-dashed border-border p-8 text-center cursor-pointer hover:border-primary/40 transition-colors relative overflow-hidden">
                  <input type="file" accept="image/*" onChange={handleLogoUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  {logoPreview ? (
                    <div className="flex flex-col items-center">
                      <img src={logoPreview} alt="Logo Preview" className="h-16 object-contain mb-2" />
                      <span className="text-xs text-primary font-medium">Click to change</span>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Drag & drop your logo or <span className="text-primary font-medium">browse files</span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">PNG, JPG, SVG up to 5MB</p>
                    </>
                  )}
                </div>
              </div>

              {/* Brand Colors */}
              <div>
                <label className="text-sm font-medium text-foreground">Brand Colors</label>
                <div className="grid grid-cols-3 gap-4 mt-1.5">
                  {[
                    { label: "Primary", value: primaryColor, setter: setPrimaryColor },
                    { label: "Secondary", value: secondaryColor, setter: setSecondaryColor },
                    { label: "Accent", value: accentColor, setter: setAccentColor },
                  ].map(({ label, value, setter }) => (
                    <div key={label}>
                      <p className="text-xs text-muted-foreground mb-1">{label}</p>
                      <div className="flex items-center gap-2 rounded-lg border border-border px-3 py-2">
                        <input type="color" value={value} onChange={(e) => setter(e.target.value)} className="h-6 w-6 rounded cursor-pointer border-0" />
                        <span className="text-sm text-foreground">{value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Page Type */}
              <div>
                <label className="text-sm font-medium text-foreground">Page Type</label>
                <div className="grid grid-cols-4 gap-3 mt-1.5">
                  {pageTypes.map((pt) => (
                    <button
                      key={pt.id}
                      onClick={() => setSelectedPageType(pt.id)}
                      className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-center transition-all ${selectedPageType === pt.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/30"
                        }`}
                    >
                      {pt.icon}
                      <span className="text-xs font-medium text-foreground">{pt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Business Description */}
              <div>
                <label className="text-sm font-medium text-foreground">Business Description *</label>
                <Textarea
                  value={businessDesc}
                  onChange={(e) => setBusinessDesc(e.target.value)}
                  placeholder="Describe your business and what you offer..."
                  className="mt-1.5 min-h-[80px]"
                />
              </div>

              {/* Target Audience & CTA */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Target Audience</label>
                  <Input value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)} placeholder="e.g., Small business owners" className="mt-1.5 h-11" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">CTA Button Text</label>
                  <Input value={ctaText} onChange={(e) => setCtaText(e.target.value)} className="mt-1.5 h-11" />
                </div>
              </div>

              {/* AI Prompt */}
              <div>
                <label className="text-sm font-medium text-foreground flex items-center gap-1 mb-1.5">
                  <Sparkles className="h-4 w-4 text-primary" /> AI Prompt *
                </label>
                <Textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Tell AI what kind of page you want... e.g., Create a modern landing page for my SaaS product..."
                  className="min-h-[80px]"
                />

                <div className="mt-4">
                  <label className="text-xs font-medium text-foreground mb-1 block">Attach Design Reference Screenshot (Optional)</label>
                  <div className="rounded-lg border-2 border-dashed border-border p-5 text-center cursor-pointer hover:border-primary/40 transition-colors relative bg-muted/20">
                    <input type="file" accept="image/*" onChange={handleScreenshotUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                    {screenshotPreview ? (
                      <div className="flex flex-col items-center">
                        <img src={screenshotPreview} alt="Screenshot Preview" className="h-24 object-contain rounded-md shadow-sm border border-border mb-2" />
                        <span className="text-xs text-primary font-medium">Click to change screenshot</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <ImagePlus className="h-6 w-6 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-foreground font-medium">Upload a design screenshot</p>
                          <p className="text-[10px] text-muted-foreground">Helps AI understand the exact layout you want</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <Button onClick={handleAiGenerate} disabled={isCreating} className="w-full h-12 text-base bg-primary hover:bg-primary/90 gap-2">
                {isCreating ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
                {isCreating ? "Creating..." : "Generate with AI"}
              </Button>
            </div>

            <p className="text-center text-sm text-muted-foreground mt-4">
              or <button onClick={() => navigate("/editor")} className="text-primary font-medium hover:text-primary/80">start from scratch</button>
            </p>
          </div>
        )}

        {/* Analyze a Website */}
        {step === "analyze" && (
          <div className="max-w-2xl mx-auto py-10 px-6">
            <button onClick={() => setStep("methods")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
              <ArrowLeft className="h-4 w-4" /> Back to methods
            </button>
            <h1 className="text-3xl font-bold text-foreground mb-2">Analyze a Website</h1>
            <p className="text-muted-foreground mb-8">Paste any website URL and our AI will analyze its structure, content, and design to create an optimized landing page version.</p>

            <div className="rounded-xl border border-border bg-card p-8 space-y-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
                <Link2 className="h-6 w-6 text-blue-500" />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Website URL *</label>
                <Input
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="https://yourwebsite.com"
                  className="mt-1.5 h-11"
                />
              </div>

              <div className="rounded-lg bg-muted/50 p-4">
                <p className="text-sm font-semibold text-foreground mb-3">What AI will extract:</p>
                <div className="grid grid-cols-2 gap-2">
                  {extractItems.map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-muted-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Button onClick={startAnalyze} className="w-full h-12 text-base bg-primary hover:bg-primary/90 gap-2">
                <Link2 className="h-5 w-5" /> Analyze
              </Button>
            </div>
          </div>
        )}

        {/* AI Crafting Loading */}
        {step === "crafting" && <ModernLoader />}
      </div>
    );
};

export default CreatePageFlow;
