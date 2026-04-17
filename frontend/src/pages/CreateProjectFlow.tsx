import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Globe, FileText, Copy, CheckCircle2, ChevronRight, Rocket, Download, Code2, Puzzle, Monitor, Upload, X, ImageIcon, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { projectsApi, aiApi } from "@/services/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { copyToClipboard } from "@/lib/utils";

type Step = "form" | "integration";
type IntegrationMethod = "wordpress" | "script" | "iframe";

const categories = [
  "General",
  "Digital Agency",
  "Digital Marketing",
  "SEO & Digital Marketing",
  "Web Design",
  "Design",
  "Software Development",
  "Technology",
  "Consulting",
  "Advertising",
  "Branding",
  "Analytics",
  "Health & Fitness",
  "Education",
  "Real Estate",
  "Insurance",
  "Finance",
  "Legal",
  "Healthcare",
  "Food & Restaurant",
  "E-commerce",
  "SaaS",
  "Agency",
  "Other",
];

const CreateProjectFlow = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<Step>("form");
  const [tokenCopied, setTokenCopied] = useState(false);
  const [createdProject, setCreatedProject] = useState<any>(null);
  const [selectedMethod, setSelectedMethod] = useState<IntegrationMethod>("wordpress");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scriptCopied, setScriptCopied] = useState(false);
  const [iframeCopied, setIframeCopied] = useState(false);

  // Form fields
  const [name, setName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("https://");
  const [category, setCategory] = useState("Agency");
  const [availableCategories, setAvailableCategories] = useState(categories);
  const [description, setDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [extractedServices, setExtractedServices] = useState<string[]>([]);
  const [extractedKeywords, setExtractedKeywords] = useState<string[]>([]);
  const [themeColor, setThemeColor] = useState("");
  const [primaryColor, setPrimaryColor] = useState("");
  const [secondaryColor, setSecondaryColor] = useState("");
  const [extractedColors, setExtractedColors] = useState<string[]>([]);
  const [themeSystem, setThemeSystem] = useState<any>({});
  const [scrapedData, setScrapedData] = useState<any>({});
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoBase64, setLogoBase64] = useState<string | null>(null);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Logo size must be less than 2MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      // Compress image using canvas to reduce base64 payload size
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 256;
        let { width, height } = img;
        if (width > height) {
          if (width > MAX_SIZE) { height = Math.round(height * MAX_SIZE / width); width = MAX_SIZE; }
        } else {
          if (height > MAX_SIZE) { width = Math.round(width * MAX_SIZE / height); height = MAX_SIZE; }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, width, height);
        const compressed = canvas.toDataURL('image/webp', 0.85);
        setLogoPreview(compressed);
        setLogoBase64(compressed);
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    setLogoPreview(null);
    setLogoBase64(null);
    if (logoInputRef.current) logoInputRef.current.value = "";
  };

  const createMutation = useMutation({
    mutationFn: projectsApi.create,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      const project = res.data.project;
      toast.success("Project created successfully!");
      // Skip integration step — go directly to project detail page
      navigate(`/dashboard/projects/${project._id}`);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create project");
    },
    onSettled: () => {
      setIsSubmitting(false);
    }
  });

  const handleCreate = async () => {
    if (!name.trim()) {
      toast.error("Project Name is required.");
      return;
    }

    setIsSubmitting(true);
    createMutation.mutate({
      name: name.trim(),
      websiteUrl: websiteUrl.trim(),
      category,
      description: description.trim(),
      logoUrl: logoBase64 || undefined,
      themeColor: themeColor || undefined,
      primaryColor: primaryColor || undefined,
      secondaryColor: secondaryColor || undefined,
      colors: extractedColors.length > 0 ? extractedColors : [primaryColor, secondaryColor].filter(c => c),
      themeSystem: themeSystem,
      services: extractedServices,
      keywords: extractedKeywords,
      scrapedData: scrapedData,
    });
  };

  const handleAnalyzeWebsite = async () => {
    if (!websiteUrl || websiteUrl === "https://" || websiteUrl.length < 8) {
      toast.error("Please enter a valid website URL to analyze.");
      return;
    }

    setIsAnalyzing(true);
    try {
      const res = await aiApi.extractProject(websiteUrl);
      const meta = res.data;

      if (meta.projectName) {
        setName(meta.projectName);
      }
      if (meta.projectDesc) {
        setDescription(meta.projectDesc);
      }
      if (meta.projectLogo) {
        setLogoPreview(meta.projectLogo);
        setLogoBase64(meta.projectLogo);
      }
      if (meta.theme) {
        setThemeColor(meta.theme);
      }
      if (meta.primaryColor) {
        setPrimaryColor(meta.primaryColor);
      }
      if (meta.secondaryColor) {
        setSecondaryColor(meta.secondaryColor);
      }
      if (meta.colors) {
        setExtractedColors(meta.colors);
      }
      if (meta.themeSystem) {
        setThemeSystem(meta.themeSystem);
      }
      if (meta.services) {
        setExtractedServices(meta.services);
      }
      if (meta.keywords) {
        setExtractedKeywords(meta.keywords);
      }
      if (meta.scrapedData) {
        setScrapedData(meta.scrapedData);
      }
      if (meta.industry) {
        setCategory(meta.industry);
        // Add detected industry to available categories if not already present
        setAvailableCategories(prev => {
          if (!prev.includes(meta.industry)) {
            return [...prev, meta.industry];
          }
          return prev;
        });
      }
      
      toast.success("Website analyzed! Project details populated.");
    } catch (err: any) {
      toast.error(err.message || "Failed to analyze website");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const copyToken = async () => {
    if (!createdProject) return;
    const success = await copyToClipboard(createdProject.apiToken);
    if (success) {
      setTokenCopied(true);
      toast.success("Token copied!");
      setTimeout(() => setTokenCopied(false), 2500);
    } else {
      toast.error("Failed to copy token");
    }
  };

  const integrationMethods = [
    {
      id: "wordpress" as const,
      icon: <Puzzle className="h-5 w-5" />,
      label: "WordPress Plugin",
      desc: "Install our plugin for seamless WordPress integration with one click.",
    },
    {
      id: "script" as const,
      icon: <Code2 className="h-5 w-5" />,
      label: "Script (Any Website)",
      desc: "Add one line of JavaScript to embed your page on any website or CMS.",
    },
    {
      id: "iframe" as const,
      icon: <Monitor className="h-5 w-5" />,
      label: "Embed iFrame",
      desc: "Use an iFrame to embed your page anywhere that accepts HTML.",
    },
  ];

  const wordpressSteps = [
    {
      num: 1,
      title: "Download & Activate WordPress Plugin",
      desc: `Download and install the "PPC Landing Builder" plugin from WordPress plugin directory.`,
      action: (
        <a href={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/plugin/download`} download className="block mt-2">
          <Button variant="outline" size="sm" className="h-8 text-xs gap-2">
            <Download className="h-3 w-3" /> Download Plugin
          </Button>
        </a>
      ),
    },
    {
      num: 2,
      title: "Generate Access Token",
      desc: "Copy the access token below and paste it in the plugin settings panel.",
      action: createdProject ? (
        <div className="flex items-center gap-2 mt-2">
          <div
            className="flex items-center gap-2 bg-muted hover:bg-muted/80 border border-border rounded-lg px-3 py-2 cursor-pointer transition-all active:scale-95"
            onClick={copyToken}
            title="Click to copy token"
          >
            <span className="text-xs font-mono text-foreground font-semibold">{createdProject.apiToken}</span>
            <div className="border-l border-border pl-2 ml-1">
              {tokenCopied
                ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                : <Copy className="h-3.5 w-3.5 text-muted-foreground" />}
            </div>
          </div>
        </div>
      ) : null,
    },
    {
      num: 3,
      title: "Save Your Token",
      desc: "In WordPress, go to Settings → AI Landing Page Publisher and save your Project API Token.",
      action: null,
    },
  ];

  const scriptCode = createdProject
    ? `<script src="${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/embed.js" data-token="${createdProject.apiToken}" async></script>`
    : "";
  const iframeCode = `<iframe src="https://your-subdomain.ppcbuilder.io/lp/your-page-slug" width="100%" height="100%" frameborder="0" allowfullscreen></iframe>`;

  return (
    <div className="flex-1 overflow-y-auto">

      {/* ─── Step 1: Project Form ─── */}
      {step === "form" && (
        <div className="max-w-2xl mx-auto py-10 px-6">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-7 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Projects
          </button>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Create New Project</h1>
            <p className="text-muted-foreground text-sm">
              Set up a client project. Brand colors and logo will apply across all pages.
            </p>
          </div>

          <div className="space-y-6">
            {/* Project Name */}
            <div className="rounded-xl border border-border bg-card p-6 space-y-5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Project Info</p>

              <div>
                <label className="text-sm font-semibold text-foreground mb-1.5 block">Website URL</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      placeholder="https://yourclient.com"
                      className="h-11 pl-9"
                    />
                  </div>
                  <Button
                    variant="outline"
                    className="h-11 px-4 gap-2 border-primary/20 hover:bg-primary/5 text-primary"
                    onClick={handleAnalyzeWebsite}
                    disabled={isAnalyzing || !websiteUrl || websiteUrl === "https://"}
                  >
                    {isAnalyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                    Analyze
                  </Button>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1.5">
                  Enter a URL and click Analyze to automatically fetch project name, logo and description.
                </p>
              </div>

              <div>
                <label className="text-sm font-semibold text-foreground mb-1.5 block">
                  Project Name <span className="text-red-500">*</span>
                </label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Roofing Company"
                  className="h-11"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-foreground mb-1.5 block">
                  Industry <span className="text-red-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {availableCategories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <p className="text-[10px] text-muted-foreground mt-1.5">
                  Auto-detected from services. You can manually select if needed.
                </p>
              </div>

              {/* Branding Colors */}
              <div className="rounded-xl border border-border bg-card p-4 space-y-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Project Branding</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-foreground mb-1 block">Primary Color</label>
                    <div className="flex items-center gap-2 rounded-lg border border-border px-2 py-1.5 bg-background">
                      <input 
                        type="color" 
                        value={primaryColor || "#000000"} 
                        onChange={(e) => setPrimaryColor(e.target.value)} 
                        className="h-6 w-6 rounded cursor-pointer border-0 p-0 bg-transparent flex-shrink-0" 
                      />
                      <span className="text-xs font-mono text-muted-foreground">{primaryColor || (isAnalyzing ? "Analyzing..." : "Select or analyze website")}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-foreground mb-1 block">Secondary Color</label>
                    <div className="flex items-center gap-2 rounded-lg border border-border px-2 py-1.5 bg-background">
                      <input 
                        type="color" 
                        value={secondaryColor || "#000000"} 
                        onChange={(e) => setSecondaryColor(e.target.value)} 
                        className="h-6 w-6 rounded cursor-pointer border-0 p-0 bg-transparent flex-shrink-0" 
                      />
                      <span className="text-xs font-mono text-muted-foreground">{secondaryColor || (isAnalyzing ? "Analyzing..." : "Select or analyze website")}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Extracted Services */}
              {/* {extractedServices.length > 0 && (
                <div className="rounded-xl border border-border bg-card p-4 space-y-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Detected Services</p>
                  <div className="flex flex-wrap gap-2">
                    {extractedServices.map((service, idx) => (
                      <div 
                        key={idx} 
                        className="flex items-center gap-1.5 bg-primary/10 text-primary border border-primary/20 rounded-lg px-2.5 py-1 text-xs font-medium"
                      >
                        {service}
                        <button 
                          onClick={() => setExtractedServices(prev => prev.filter((_, i) => i !== idx))}
                          className="hover:text-primary/70"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-muted-foreground">These services will be used to generate your landing pages.</p>
                </div>
              )} */}

              {/* Logo Upload */}
              <div>
                <label className="text-sm font-semibold text-foreground mb-1.5 block">Project Logo <span className="text-muted-foreground font-normal">(optional)</span></label>
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleLogoChange}
                />
                {logoPreview ? (
                  <div className="flex items-center gap-3 p-3 rounded-xl border border-border bg-muted/30">
                    <div className="h-14 w-14 rounded-xl border border-border bg-white flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm">
                      <img src={logoPreview} alt="Logo preview" className="h-full w-full object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground">Logo uploaded</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Click change to update</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => logoInputRef.current?.click()}
                        className="text-xs text-primary hover:text-primary/80 font-medium px-3 py-1.5 rounded-lg border border-primary/30 hover:bg-primary/5 transition-all"
                      >
                        Change
                      </button>
                      <button
                        type="button"
                        onClick={removeLogo}
                        className="text-xs text-muted-foreground hover:text-destructive font-medium px-2 py-1.5 rounded-lg border border-border hover:border-destructive/30 hover:bg-destructive/5 transition-all"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => logoInputRef.current?.click()}
                    className="w-full flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border hover:border-primary/40 hover:bg-primary/5 bg-muted/20 py-6 cursor-pointer transition-all group"
                  >
                    <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                      <ImageIcon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">Upload Logo</p>
                      <p className="text-xs text-muted-foreground mt-0.5">PNG, JPG, SVG — max 2MB</p>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-primary font-medium mt-1">
                      <Upload className="h-3 w-3" /> Browse files
                    </div>
                  </button>
                )}
              </div>

              <div>
                <label className="text-sm font-semibold text-foreground mb-1.5 block">Project Description</label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What does this client do? What's the product/service?"
                  className="min-h-[80px] resize-none"
                />
              </div>
            </div>

            <Button
              onClick={handleCreate}
              disabled={isSubmitting}
              className="w-full h-12 text-base bg-primary hover:bg-primary/90 gap-2"
            >
              <Rocket className="h-5 w-5" /> {isSubmitting ? "Creating..." : "Create Project"}
            </Button>
          </div>
        </div>
      )}

      {/* ─── Step 2: Integration Setup ─── */}
      {step === "integration" && createdProject && (
        <div className="max-w-2xl mx-auto py-10 px-6">
          {/* Success banner */}
          <div className="rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 p-5 mb-7 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="h-6 w-6 text-emerald-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                {createdProject.logoUrl && (
                  <img src={createdProject.logoUrl} alt="Logo" className="h-6 w-6 rounded object-contain" />
                )}
                <h1 className="text-lg font-bold text-foreground">Project Created! 🎉</h1>
              </div>
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{createdProject.name}</span> is ready.
                Choose how to integrate your landing pages.
              </p>
            </div>
            {/* Brand color swatches */}
            <div className="flex gap-1.5 flex-shrink-0">
              <div className="h-5 w-5 rounded-full border border-white shadow-sm" style={{ background: createdProject.primaryColor || createdProject.themeColor || '#7c3aed' }} title="Primary" />
              <div className="h-5 w-5 rounded-full border border-white shadow-sm" style={{ background: createdProject.secondaryColor }} title="Secondary" />
            </div>
          </div>

          {/* Integration picker */}
          <p className="text-sm font-semibold text-foreground mb-3">
            Choose how you want to integrate landing pages into your website.
          </p>
          <div className="space-y-2 mb-5">
            {integrationMethods.map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedMethod(m.id)}
                className={`w-full flex items-center gap-4 rounded-xl border-2 p-4 text-left transition-all ${selectedMethod === m.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/30 bg-card"
                  }`}
              >
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 ${selectedMethod === m.id ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                  }`}>
                  {m.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold ${selectedMethod === m.id ? "text-primary" : "text-foreground"}`}>
                    {m.label}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{m.desc}</p>
                </div>
                <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${selectedMethod === m.id ? "border-primary bg-primary" : "border-border"
                  }`}>
                  {selectedMethod === m.id && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                </div>
              </button>
            ))}
          </div>

          {/* WordPress Steps */}
          {selectedMethod === "wordpress" && (
            <div className="rounded-xl border border-border bg-card overflow-hidden mb-5">
              <div className="px-5 py-4 border-b border-border bg-muted/30">
                <p className="text-sm font-semibold text-foreground">Setup Instructions</p>
              </div>
              <div className="p-5 space-y-5">
                {wordpressSteps.map((s) => (
                  <div key={s.num} className="flex gap-4">
                    <div className="h-7 w-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {s.num}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{s.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{s.desc}</p>
                      {s.action}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Script Code */}
          {selectedMethod === "script" && (
            <div className="rounded-xl border border-border bg-card overflow-hidden mb-5">
              <div className="px-5 py-4 border-b border-border bg-muted/30 flex items-center justify-between">
                <p className="text-sm font-semibold text-foreground">Add to your website's &lt;head&gt;</p>
                <button
                  onClick={async () => { 
                    const success = await copyToClipboard(scriptCode); 
                    if (success) {
                      setScriptCopied(true);
                      toast.success("Code copied!"); 
                      setTimeout(() => setScriptCopied(false), 2000);
                    } else {
                      toast.error("Failed to copy code");
                    }
                  }}
                  className="text-xs text-primary flex items-center gap-1.5 hover:text-primary/80 transition-all active:scale-95"
                >
                  {scriptCopied ? (
                    <><CheckCircle2 className="h-3.5 w-3.5" /> Copied!</>
                  ) : (
                    <><Copy className="h-3.5 w-3.5" /> Copy</>
                  )}
                </button>
              </div>
              <div className="p-5">
                <pre className="text-xs text-foreground font-mono bg-muted rounded-lg p-4 overflow-x-auto whitespace-pre-wrap break-all">{scriptCode}</pre>
              </div>
            </div>
          )}

          {/* iFrame Code */}
          {selectedMethod === "iframe" && (
            <div className="rounded-xl border border-border bg-card overflow-hidden mb-5">
              <div className="px-5 py-4 border-b border-border bg-muted/30 flex items-center justify-between">
                <p className="text-sm font-semibold text-foreground">Embed iFrame Code</p>
                <button
                  onClick={async () => { 
                    const success = await copyToClipboard(iframeCode); 
                    if (success) {
                      setIframeCopied(true);
                      toast.success("Code copied!"); 
                      setTimeout(() => setIframeCopied(false), 2000);
                    } else {
                      toast.error("Failed to copy code");
                    }
                  }}
                  className="text-xs text-primary flex items-center gap-1.5 hover:text-primary/80 transition-all active:scale-95"
                >
                  {iframeCopied ? (
                    <><CheckCircle2 className="h-3.5 w-3.5" /> Copied!</>
                  ) : (
                    <><Copy className="h-3.5 w-3.5" /> Copy</>
                  )}
                </button>
              </div>
              <div className="p-5">
                <pre className="text-xs text-foreground font-mono bg-muted rounded-lg p-4 overflow-x-auto whitespace-pre-wrap break-all">{iframeCode}</pre>
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="h-12" onClick={() => navigate(`/dashboard/projects/${createdProject._id}`)}>
              View Project
            </Button>
            <Button
              className="h-12 gap-2 bg-primary hover:bg-primary/90"
              onClick={() => navigate(`/dashboard/projects/${createdProject._id}?createPage=1`)}
            >
              <FileText className="h-4 w-4" /> Create First Page <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateProjectFlow;
