import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Sparkles, Link2, Upload, CheckCircle2, Rocket, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { pageService } from "@/services/pageService";
import { toast } from "sonner";

type Step = "methods" | "create-ai" | "analyze" | "crafting";
type FormStep = 1 | 2 | 3;

const pageTypes = [
  { id: "landing", label: "Landing Page", icon: <Rocket className="h-6 w-6" /> },
  { id: "portfolio", label: "Portfolio", icon: <span className="text-xl">🖼</span> },
  { id: "service", label: "Service Page", icon: <span className="text-xl">📄</span> },
  { id: "coming-soon", label: "Coming Soon", icon: <span className="text-xl">⏰</span> },
];

const industries = ["SaaS", "E-commerce", "Agency", "Healthcare", "Education", "Finance", "Real Estate", "Other"];

const extractItems = [
  "Logo & brand colors",
  "Page structure & layout",
  "Content & copy text",
  "SEO metadata",
  "Images & media",
  "Call-to-action buttons",
];

const CreatePageFlow = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("methods");
  const [formStep, setFormStep] = useState<FormStep>(1);

  // Create with AI form state
  const [businessName, setBusinessName] = useState("");
  const [industry, setIndustry] = useState("SaaS");
  const [selectedPageType, setSelectedPageType] = useState("landing");
  const [businessDesc, setBusinessDesc] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [ctaText, setCtaText] = useState("Get Started Free");
  const [figmaUrl, setFigmaUrl] = useState("");
  const [aiPrompt, setAiPrompt] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#7c3aed");
  const [secondaryColor, setSecondaryColor] = useState("#a855f7");
  const [accentColor, setAccentColor] = useState("#6366f1");

  // Analyze state
  const [websiteUrl, setWebsiteUrl] = useState("");

  // Crafting progress
  const [progress, setProgress] = useState(0);
  const [loadingMsg, setLoadingMsg] = useState("Crafting initial draft...");
  const [isPolishing, setIsPolishing] = useState(false);

  const handleAiGeneration = async () => {
    if (!businessName || !businessDesc) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setStep("crafting");
    setLoadingMsg("AI is thinking...");
    setProgress(10);

    try {
      // 1. Create Draft
      const draftRes = await pageService.create({ title: businessName });
      if (draftRes.status !== "success" || !draftRes.data?.page?._id) {
        throw new Error("Failed to create page draft.");
      }
      
      const pageId = draftRes.data.page._id;
      setProgress(30);
      setLoadingMsg("Generating landing page content...");

      // 2. Generate AI Content
      const aiRes = await pageService.generateAIContent({
        businessName,
        industry,
        pageType: "lead generation", // Mapped to backend enum
        targetAudience: targetAudience || "General Public",
        businessDescription: businessDesc,
        ctaText: ctaText || "Get Started",
        figmaUrl,
        aiPrompt,
        pageId,
      });

      if (aiRes.status === "success") {
        setProgress(70);
        setLoadingMsg("Designing layout and sections...");
        
        // Final polish (simulated)
        setTimeout(() => {
          setProgress(100);
          toast.success("AI Page Generated Successfully!");
          navigate(`/editor?id=${pageId}`);
        }, 1000);
      } else {
        throw new Error(aiRes.message || "AI generation failed.");
      }
    } catch (error: any) {
      console.error("AI Create Error:", error);
      toast.error(error.message || "An error occurred while creating your page.");
      setStep("create-ai");
    }
  };

  const handleAnalysis = async () => {
    if (!websiteUrl) {
      toast.error("Please provide a website URL.");
      return;
    }

    setStep("crafting");
    setLoadingMsg("Analyzing website assets...");
    setProgress(15);

    try {
      // 1. Create Draft
      const draftRes = await pageService.create({ title: "Analyzed Site" });
      const pageId = draftRes.data?.page?._id;

      // 2. Analyze
      const aiRes = await pageService.analyzeWebsite(websiteUrl, pageId);
      
      if (aiRes.status === "success") {
        setProgress(100);
        toast.success("Website analysis complete!");
        navigate(`/editor?id=${pageId}`);
      } else {
        throw new Error(aiRes.message || "Website analysis failed.");
      }
    } catch (error: any) {
      console.error("Analyze Error:", error);
      toast.error(error.message || "Failed to analyze website.");
      setStep("analyze");
    }
  };

  const handlePolishDescription = async () => {
    if (!businessDesc) {
      toast.error("Please enter a description first.");
      return;
    }

    setIsPolishing(true);
    try {
      const res = await pageService.improveContent({
        sectionType: "business description",
        currentContent: { description: businessDesc },
        aiPrompt: "Make this business description more professional, persuasive, and optimized for a landing page."
      });

      if (res.status === "success" && res.data?.improvedContent) {
        setBusinessDesc(res.data.improvedContent.description || res.data.improvedContent);
        toast.success("Description polished by AI!");
      } else {
        throw new Error("Failed to polish description.");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to polish description.");
    } finally {
      setIsPolishing(false);
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
              <h3 className="text-lg font-semibold text-foreground mb-2">Describe Your Page</h3>
              <p className="text-sm text-muted-foreground">Tell AI what you need and get a complete page.</p>
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
          <h1 className="text-3xl font-bold text-foreground mb-2">Create with AI</h1>
          <p className="text-muted-foreground mb-8">Fill in your details and let AI generate a stunning landing page for you.</p>

          <div className="rounded-2xl border border-white/10 bg-card/50 backdrop-blur-xl p-8 shadow-2xl relative overflow-hidden">
            {/* Step Indicators */}
            <div className="flex items-center justify-between mb-10 px-4">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${
                    formStep === s ? "bg-primary text-primary-foreground scale-110 shadow-[0_0_15px_rgba(124,58,237,0.5)]" : 
                    formStep > s ? "bg-green-500 text-white" : "bg-muted text-muted-foreground"
                  }`}>
                    {formStep > s ? <CheckCircle2 className="h-4 w-4" /> : s}
                  </div>
                  <span className={`text-xs font-medium hidden sm:inline ${formStep === s ? "text-foreground" : "text-muted-foreground"}`}>
                    {s === 1 ? "Product Details" : s === 2 ? "Design & Brand" : "AI Finalizing"}
                  </span>
                  {s < 3 && <div className="h-[1px] w-12 bg-border mx-2 hidden md:block" />}
                </div>
              ))}
            </div>

            {/* Step 1: Business Details */}
            {formStep === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Business Name *</label>
                    <Input value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="e.g. Acme SaaS" className="h-11 bg-background/50 border-white/5" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Industry *</label>
                    <select
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      className="flex h-11 w-full rounded-md border border-white/5 bg-background/50 px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20"
                    >
                      {industries.map((ind) => (
                        <option key={ind} value={ind}>{ind}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5 relative group">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">What does your business do? *</label>
                  <Textarea
                    value={businessDesc}
                    onChange={(e) => setBusinessDesc(e.target.value)}
                    placeholder="We provide AI-powered marketing tools for small businesses..."
                    className="min-h-[100px] bg-background/50 border-white/5 pr-12"
                  />
                  <Button
                    onClick={handlePolishDescription}
                    disabled={isPolishing || !businessDesc}
                    className="absolute right-2 bottom-2 h-8 w-8 p-0 rounded-full bg-primary/20 hover:bg-primary text-primary hover:text-white transition-all shadow-sm"
                    title="Polish with AI"
                  >
                    {isPolishing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  </Button>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Target Audience</label>
                  <Input value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)} placeholder="e.g. Small business owners, Startups" className="h-11 bg-background/50 border-white/5" />
                </div>

                <Button onClick={() => setFormStep(2)} className="w-full h-12 bg-primary hover:bg-primary/90 mt-4 group">
                  Next: Design & Branding <ArrowLeft className="h-4 w-4 rotate-180 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            )}

            {/* Step 2: Design & Branding */}
            {formStep === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Figma Design URL (AI will follow this)</label>
                  <div className="relative">
                    <Input 
                      value={figmaUrl} 
                      onChange={(e) => setFigmaUrl(e.target.value)} 
                      placeholder="https://figma.com/file/..." 
                      className="h-11 bg-background/50 border-primary/20 focus:border-primary pl-10" 
                    />
                    <Link2 className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  </div>
                </div>

                {!figmaUrl ? (
                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Primary Brand Colors</label>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { label: "Primary", value: primaryColor, setter: setPrimaryColor },
                        { label: "Secondary", value: secondaryColor, setter: setSecondaryColor },
                        { label: "Accent", value: accentColor, setter: setAccentColor },
                      ].map(({ label, value, setter }) => (
                        <div key={label} className="bg-white/5 p-3 rounded-xl border border-white/5">
                          <p className="text-[10px] font-bold text-muted-foreground uppercase mb-2">{label}</p>
                          <div className="flex items-center gap-2">
                            <input type="color" value={value} onChange={(e) => setter(e.target.value)} className="h-8 w-8 rounded-lg cursor-pointer border-0 bg-transparent" />
                            <span className="text-xs text-foreground font-mono">{value}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-primary/5 rounded-xl p-6 border border-primary/20 flex flex-col items-center gap-3 animate-in zoom-in-95 duration-500">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                       <CheckCircle2 className="h-6 w-6 text-primary" />
                    </div>
                    <div className="text-center">
                       <p className="text-sm font-bold text-foreground">Figma Design Detected</p>
                       <p className="text-xs text-muted-foreground">Colors and assets will be automatically extracted from your design file.</p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <Button variant="outline" onClick={() => setFormStep(1)} className="h-12">Back</Button>
                  <Button onClick={() => setFormStep(3)} className="h-12">Next: AI Instructions</Button>
                </div>
              </div>
            )}

            {/* Step 3: AI Instructions */}
            {formStep === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">CTA Button Text</label>
                  <Input value={ctaText} onChange={(e) => setCtaText(e.target.value)} className="h-11 bg-background/50 border-white/5" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Custom AI Instructions (Optional)</label>
                  <Textarea
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="e.g. Focus on high conversion, use a premium aesthetic, include a section for luxury portfolios..."
                    className="min-h-[120px] bg-background/50 border-primary/20 focus:border-primary"
                  />
                </div>

                <div className="bg-primary/10 rounded-xl p-4 border border-primary/20">
                  <p className="text-xs text-primary leading-relaxed flex gap-2">
                    <Sparkles className="h-4 w-4 shrink-0" />
                    Your landing page will include: Hero, Features, About, Social Proof, Pricing, FAQ, and Lead Capture.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <Button variant="outline" onClick={() => setFormStep(2)} className="h-12 border-white/5">Back</Button>
                  <Button onClick={handleAiGeneration} className="h-12 bg-primary shadow-lg shadow-primary/20 group">
                    <Sparkles className="h-4 w-4 mr-2 group-hover:animate-spin" /> Generate Landing Page
                  </Button>
                </div>
              </div>
            )}
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

            <Button onClick={handleAnalysis} className="w-full h-12 text-base bg-primary hover:bg-primary/90 gap-2">
              <Link2 className="h-5 w-5" /> Analyze
            </Button>
          </div>
        </div>
      )}

      {/* AI Crafting Loading */}
      {step === "crafting" && (
        <div className="flex flex-col items-center justify-center min-h-full py-20">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mb-6 animate-pulse">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">{loadingMsg}</h2>
          <p className="text-muted-foreground mb-8 text-center px-6">
            Our AI engine is processing your description and building the ideal landing page for you.
          </p>
          <div className="w-80">
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePageFlow;
