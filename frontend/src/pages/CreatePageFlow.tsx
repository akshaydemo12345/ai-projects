import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Sparkles, Link2, Upload, CheckCircle2, Rocket, ImagePlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { generateLandingPageHtml } from "@/lib/landingPageTemplates";

type Step = "methods" | "create-ai" | "analyze" | "crafting";

const pageTypes = [
  { id: "landing", label: "Landing Page", icon: <Rocket className="h-6 w-6" /> },
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

  // Create with AI form state
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
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoPreview(URL.createObjectURL(file));
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

  const startCrafting = () => {
    setStep("crafting");
    setProgress(0);

    // Generate the landing page HTML + CSS
    const { html, css } = generateLandingPageHtml({
      businessName,
      industry,
      pageType: selectedPageType,
      businessDesc,
      targetAudience,
      ctaText,
      aiPrompt,
      primaryColor,
      secondaryColor,
      accentColor,
      websiteUrl,
    });

    // Store in localStorage for the editor to pick up
    localStorage.setItem('grapes-initial-html', html);
    localStorage.setItem('grapes-initial-css', css);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => navigate("/editor"), 500);
          return 100;
        }
        return prev + 2;
      });
    }, 80);
  };

  const startAnalyze = () => {
    setStep("crafting");
    setProgress(0);

    // Generate page from URL (we use the URL as context)
    const { html: urlHtml, css: urlCss } = generateLandingPageHtml({
      businessName: websiteUrl.replace(/https?:\/\//, '').replace(/\.\w+.*/, ''),
      industry: 'Other',
      pageType: 'landing',
      businessDesc: `Professional services from ${websiteUrl}`,
      targetAudience: 'business owners',
      ctaText: 'Get Free Quote',
      aiPrompt: '',
      primaryColor,
      secondaryColor,
      accentColor,
      websiteUrl,
    });

    localStorage.setItem('grapes-initial-html', urlHtml);
    localStorage.setItem('grapes-initial-css', urlCss);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => navigate("/editor"), 500);
          return 100;
        }
        return prev + 2;
      });
    }, 80);
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
                    className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-center transition-all ${
                      selectedPageType === pt.id
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

            <Button onClick={startCrafting} className="w-full h-12 text-base bg-primary hover:bg-primary/90 gap-2">
              <Sparkles className="h-5 w-5" /> Generate with AI
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
      {step === "crafting" && (
        <div className="flex flex-col items-center justify-center min-h-full py-20">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mb-6">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">AI is crafting your page...</h2>
          <p className="text-muted-foreground mb-8">Analyzing structure, generating copy, designing layout</p>
          <div className="w-80">
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePageFlow;
