import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Globe, FileText, Copy, CheckCircle2, ChevronRight, Rocket, Download, Code2, Puzzle, Monitor, Upload, X, ImageIcon, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { projectsApi, aiApi } from "@/services/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { copyToClipboard, normalizeLogoUrl, getImageAverageBrightness, getLogoPreviewContainerClasses } from "@/lib/utils";
import { PickrColorInput } from "@/components/ui/PickrColorInput";

type Step = "form" | "integration";
type IntegrationMethod = "wordpress" | "script";

const industries = [
  "SaaS",
  "Agency",
  "E-commerce",
  "Healthcare",
  "Real Estate",
  "Finance",
  "Technology",
  "Consulting",
  "Construction",
  "Hospitality",
  "Legal",
  "Beauty & Wellness",
  "General",
  "Other",
];

const subIndustryOptions: Record<string, string[]> = {
  SaaS: ["Marketing SaaS", "HR SaaS", "Fintech", "Analytics", "Security", "E-commerce SaaS", "Productivity", "Customer Support"],
  Agency: ["Digital Marketing", "Creative", "Branding", "SEO", "PPC", "Web Design", "Social Media", "PR", "Content Strategy"],
  "E-commerce": ["Fashion", "Electronics", "Health & Beauty", "Furniture", "Food & Beverage", "Subscription", "Home Goods", "Sports"],
  Healthcare: ["Dentistry", "Medical Clinic", "Wellness Spa", "Fitness Studio", "Telehealth", "Physical Therapy", "Cosmetic Surgery"],
  "Real Estate": ["Residential", "Commercial", "Property Management", "Agent/Brokerage", "Vacation Rentals", "Land Development"],
  Finance: ["Accounting", "Investment", "Insurance", "Lending", "Crypto", "Wealth Management"],
  Technology: ["Consumer Electronics", "AI", "IoT", "Cybersecurity", "Cloud", "Mobility", "Hardware", "Software"],
  Consulting: ["Management", "HR", "IT", "Strategy", "Financial", "Legal"],
  Construction: ["Contractors", "Home Renovation", "Architecture", "Builders", "Remodeling", "Interior Design"],
  Hospitality: ["Hotels", "Restaurants", "Events", "Travel Agency", "Catering", "Resorts"],
  Legal: ["Law Firm", "Immigration", "Corporate Law", "Personal Injury", "Family Law", "Patent Law"],
  "Beauty & Wellness": ["Salon", "Spa", "Nutrition", "Yoga Studio", "Cosmetics", "Personal Care"],
  General: ["Professional Services", "Local Business", "Startup", "Nonprofit"],
};


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

  // Form fields
  const [name, setName] = useState("");
  const [preSlug, setPreSlug] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("https://");
  const [category, setCategory] = useState("");
  const [availableCategories, setAvailableCategories] = useState(industries);
  const [subIndustry, setSubIndustry] = useState("");
  const [customIndustry, setCustomIndustry] = useState("");
  const [customSubIndustry, setCustomSubIndustry] = useState("");
  const [description, setDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [extractedServices, setExtractedServices] = useState<string[]>([]);
  const [extractedKeywords, setExtractedKeywords] = useState<string[]>([]);
  const [themeColor, setThemeColor] = useState("");
  const [primaryColor, setPrimaryColor] = useState("");
  const [secondaryColor, setSecondaryColor] = useState("");
  const [logoColors, setLogoColors] = useState<{ primary: string | null; secondary: string | null; palette: string[]; source: string | null }>({ primary: null, secondary: null, palette: [], source: null });
  const [extractedColors, setExtractedColors] = useState<string[]>([]);
  const [themeSystem, setThemeSystem] = useState<any>({});
  const [scrapedData, setScrapedData] = useState<any>({});
  const [websiteProfile, setWebsiteProfile] = useState<any>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoBase64, setLogoBase64] = useState<string | null>(null);
  const [logoPreviewBgClass, setLogoPreviewBgClass] = useState<string>("border border-slate-700 bg-slate-950 dark:border-slate-500 dark:bg-slate-950");
  const [scrapedImages, setScrapedImages] = useState<any[]>([]);
  const [bodyFont, setBodyFont] = useState<string>("");
  const [headingFont, setHeadingFont] = useState<string>("");
  const [googleFonts, setGoogleFonts] = useState<string[]>([]);

  const handleLogoPreviewImageLoad = (img: HTMLImageElement) => {
    const brightness = getImageAverageBrightness(img);
    setLogoPreviewBgClass(getLogoPreviewContainerClasses(brightness));
  };

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

      // SVG files: skip canvas compression (canvas can't reliably handle SVG)
      // Keep as-is to preserve vector quality
      if (file.type === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg')) {
        setLogoPreview(result);
        setLogoBase64(result);
        // Reset bg — SVG brightness will be detected in the render
        setLogoPreviewBgClass("border border-slate-700 bg-slate-950 dark:border-slate-500 dark:bg-slate-950");
        return;
      }

      // Raster images: compress using canvas
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
      img.onerror = () => {
        // Canvas fallback failed — use original
        setLogoPreview(result);
        setLogoBase64(result);
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
      toast.success("Project created successfully.");
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
    const selectedCategory = category === "Other" ? (customIndustry.trim() || "Other") : category;
    const selectedSubIndustry = subIndustry === "Other" ? customSubIndustry.trim() : subIndustry;

    // Merge user modifications into pre-scraped websiteProfile if available
    let finalProfile = undefined;
    if (websiteProfile) {
      finalProfile = {
        ...websiteProfile,
        identity: {
          ...(websiteProfile.identity || {}),
          name: name.trim(),
          description: description.trim(),
          logoUrl: logoBase64 || websiteProfile.identity?.logoUrl || undefined,
        },
        colors: {
          ...(websiteProfile.colors || {}),
          primary: primaryColor || websiteProfile.colors?.primary || undefined,
          secondary: secondaryColor || websiteProfile.colors?.secondary || undefined,
          palette: extractedColors.length > 0 ? extractedColors : (websiteProfile.colors?.palette || []),
        },
        logoColors: {
          ...(websiteProfile.logoColors || {}),
          primary: primaryColor || websiteProfile.logoColors?.primary || undefined,
          secondary: secondaryColor || websiteProfile.logoColors?.secondary || undefined,
          palette: extractedColors.length > 0 ? extractedColors : (websiteProfile.logoColors?.palette || []),
        },
        fonts: {
          ...(websiteProfile.fonts || {}),
          bodyFont: bodyFont || websiteProfile.fonts?.bodyFont || undefined,
          headingFont: headingFont || websiteProfile.fonts?.headingFont || undefined,
        },
        industry: {
          ...(websiteProfile.industry || {}),
          industry: selectedCategory,
          subIndustry: selectedSubIndustry || undefined,
        }
      };
    }

    createMutation.mutate({
      name: name.trim(),
      preSlug: preSlug.trim(),
      websiteUrl: websiteUrl.trim(),
      category: selectedCategory,
      subIndustry: selectedSubIndustry || undefined,
      description: description.trim(),
      logoUrl: logoBase64 || undefined,
      themeColor: themeColor || undefined,
      primaryColor: primaryColor || undefined,
      secondaryColor: secondaryColor || undefined,
      colors: extractedColors.length > 0 ? extractedColors : [primaryColor, secondaryColor].filter(c => c),
      themeSystem: themeSystem,
      services: extractedServices,
      keywords: extractedKeywords,
      fonts: {
        bodyFont: bodyFont || undefined,
        headingFont: headingFont || undefined,
      },
      scrapedData: {
        ...scrapedData,
        subIndustry: selectedSubIndustry || undefined,
      },
      websiteProfile: finalProfile,
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
      if (meta.projectDesc !== undefined) {
        setDescription(meta.projectDesc || '');
      }
      if (meta.projectLogo) {
        const normalizedLogo = normalizeLogoUrl(meta.projectLogo);
        if (normalizedLogo) {
          setLogoPreview(normalizedLogo);
          setLogoBase64(normalizedLogo);
          // Reset to dark bg — will be updated once brightness is detected
          setLogoPreviewBgClass("border border-slate-700 bg-slate-950 dark:border-slate-500 dark:bg-slate-950");
        }
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
      if (meta.logoColors) {
        setLogoColors(meta.logoColors);
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
      if (meta.websiteProfile) {
        setWebsiteProfile(meta.websiteProfile);
      }

      let detectedCategory = category;
      if (meta.industry) {
        // If detected industry is already in our list, select it.
        if (availableCategories.includes(meta.industry)) {
          detectedCategory = meta.industry;
          setCategory(meta.industry);
        } else {
          // Not in list: select General as industry and expose detected industry as dynamic sub-industry
          detectedCategory = 'General';
          setCategory('General');
          setCustomSubIndustry(meta.industry);
          setSubIndustry('Other');
        }
      } else if (meta.scrapedData?.industry) {
        if (availableCategories.includes(meta.scrapedData.industry)) {
          detectedCategory = meta.scrapedData.industry;
          setCategory(meta.scrapedData.industry);
        } else {
          detectedCategory = 'General';
          setCategory('General');
          setCustomSubIndustry(meta.scrapedData.industry);
          setSubIndustry('Other');
        }
      }

      const candidateSubIndustry = meta.scrapedData?.subIndustry || meta.subIndustry || '';
      if (candidateSubIndustry) {
        const validSubIndustries = subIndustryOptions[detectedCategory] || [];
        if (validSubIndustries.includes(candidateSubIndustry)) {
          setSubIndustry(candidateSubIndustry);
          setCustomSubIndustry('');
        } else {
          // If detectedCategory is General because top-level industry wasn't in list,
          // prefer showing the detected value as custom sub-industry.
          setSubIndustry('Other');
          setCustomSubIndustry(candidateSubIndustry);
        }
      }

      if (meta.scrapedImages) {
        setScrapedImages(meta.scrapedImages);
      }

      // Extract fonts from scraped website, prefer explicit metadata but fall back to websiteProfile values.
      const fontSource = meta.fonts || meta.websiteProfile?.fonts || meta.websiteProfile?.typography || {};
      if (fontSource.bodyFont) setBodyFont(fontSource.bodyFont);
      if (fontSource.headingFont) setHeadingFont(fontSource.headingFont);
      const detectedGoogleFonts = fontSource.googleFonts || (fontSource as any).googleFontFamilies;
      if (detectedGoogleFonts) setGoogleFonts(detectedGoogleFonts);
      if (!fontSource.bodyFont && fontSource.primaryFont) setBodyFont(fontSource.primaryFont);

      // Capture theme system from the response or the nested websiteProfile.
      const themeSource = meta.themeSystem || meta.websiteProfile?.theme || meta.websiteProfile?.themeSystem;
      if (themeSource) {
        setThemeSystem(themeSource);
      }

      // Store full-page screenshot and render-derived colors (if backend returned them)
      if (meta.screenshot) {
        setScrapedData(prev => ({ ...(prev || {}), screenshot: meta.screenshot }));
      }
      if (meta.renderColors) {
        setScrapedData(prev => ({ ...(prev || {}), renderColors: meta.renderColors }));
      }

      toast.success("Website analyzed successfully.");
    } catch (err: any) {
      const code = (err as any).code;
      if (code === 'SITE_BLOCKED') {
        toast.error("Website blocked access", {
          duration: 6000,
        });
      } else {
        toast.error(err.message || "Failed to analyze website");
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const copyToken = async () => {
    if (!createdProject) return;
    const success = await copyToClipboard(createdProject.apiToken);
    if (success) {
      setTokenCopied(true);
      toast.success("Token copied successfully.");
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
  ];

  const wordpressSteps = [
    {
      num: 1,
      title: "Download & Activate WordPress Plugin",
      desc: `Download and install the "PPC Landing Builder" plugin from WordPress plugin directory.`,
      action: (
        <a href={`${import.meta.env.VITE_API_BASE_URL || 'https://receiving-llp-charlie-motor.trycloudflare.com'}/plugin/download`} download className="block mt-2">
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
    ? `<script src="${import.meta.env.VITE_API_BASE_URL || 'https://receiving-llp-charlie-motor.trycloudflare.com'}/embed.js" data-token="${createdProject.apiToken}" async></script>`
    : ""; return (
      <div className="flex-1 min-h-full flex flex-col" style={{ background: "#f2f2f2" }}>
        {/* ─── Header ─── */}
        <div className="px-4 sm:px-4 pt-6 pb-4 border-b border-border bg-white dark:bg-slate-900">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate("/dashboard")}
                  className="h-8 px-3 text-xs font-semibold inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Back
                </button>
                <h1 className="text-lg font-bold text-foreground">Create New Project</h1>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 max-w-lg">
                Set up a client project. Brand colors and logo will apply across all pages.
              </p>
            </div>
          </div>
        </div>

        {/* ─── Step 1: Project Form ─── */}
        {step === "form" && (
          <div className="max-w-[1000px] w-full px-4 sm:px-4 py-4 space-y-4 flex-1">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">

              {/* Left Column - Core Info */}
              <div className="lg:col-span-2 space-y-6">
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-6 shadow-sm">

                  {/* Website URL & Auto-Analyze */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-800 dark:text-slate-200">Website URL</label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                          value={websiteUrl}
                          onChange={(e) => setWebsiteUrl(e.target.value)}
                          placeholder="https://yourclient.com"
                          className="h-11 pl-9 rounded-xl bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                        />
                      </div>
                      <Button
                        variant="outline"
                        className="h-11 px-5 gap-2 border-primary/20 hover:bg-primary/5 text-primary rounded-xl font-bold"
                        onClick={handleAnalyzeWebsite}
                        disabled={isAnalyzing || !websiteUrl || websiteUrl === "https://"}
                      >
                        {isAnalyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                        Analyze Website
                      </Button>
                    </div>
                    <p className="text-[10px] text-muted-foreground/80 italic">
                      Enter the URL and click Analyze to automatically extract logo, colors, services, and description.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Project Name */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                        Project Name <span className="text-red-500">*</span>
                      </label>
                      <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Roofing Company"
                        className="h-11 rounded-xl bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                      />
                    </div>

                    {/* Pre Slug */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                        URL Pre-Slug <span className="text-muted-foreground font-normal text-xs">(optional)</span>
                      </label>
                      <Input
                        value={preSlug}
                        onChange={(e) => setPreSlug(e.target.value)}
                        placeholder="e.g. landing-pages, ppc"
                        className="h-11 rounded-xl bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Industry */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                        Industry <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={category}
                        onChange={(e) => {
                          setCategory(e.target.value);
                          setSubIndustry("");
                          setCustomIndustry("");
                          setCustomSubIndustry("");
                        }}
                        className="flex h-11 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                      >
                        <option value="">Select industry</option>
                        {availableCategories.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>

                    {/* Sub-Industry (Conditional) */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                        Sub-Industry
                      </label>
                      {category && category !== "" && category !== "Other" ? (
                        subIndustryOptions[category]?.length > 0 ? (
                          <select
                            value={subIndustry}
                            onChange={(e) => {
                              setSubIndustry(e.target.value);
                              if (e.target.value !== "Other") {
                                setCustomSubIndustry("");
                              }
                            }}
                            className="flex h-11 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                          >
                            <option value="">Select sub-industry</option>
                            {subIndustryOptions[category].map((sub) => (
                              <option key={sub} value={sub}>{sub}</option>
                            ))}
                            <option value="Other">Other</option>
                          </select>
                        ) : (
                          <Input
                            value={customSubIndustry}
                            onChange={(e) => setCustomSubIndustry(e.target.value)}
                            placeholder="e.g. Renewable Energy SaaS"
                            className="h-11 rounded-xl bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                          />
                        )
                      ) : (
                        <Input
                          disabled
                          value={customSubIndustry}
                          placeholder="Select industry first"
                          className="h-11 rounded-xl bg-slate-100 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 cursor-not-allowed opacity-60"
                        />
                      )}
                    </div>
                  </div>

                  {/* Custom Industry Input (Other selected) */}
                  {category === "Other" && (
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                        Custom Industry Name
                      </label>
                      <Input
                        value={customIndustry}
                        onChange={(e) => setCustomIndustry(e.target.value)}
                        placeholder="e.g. Sustainable Packaging"
                        className="h-11 rounded-xl bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                      />
                    </div>
                  )}

                  {/* Custom Sub-Industry Input (Other sub-industry selected) */}
                  {category && category !== "Other" && subIndustry === "Other" && (
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                        Custom Sub-Industry Name
                      </label>
                      <Input
                        value={customSubIndustry}
                        onChange={(e) => setCustomSubIndustry(e.target.value)}
                        placeholder="e.g. Renewable Energy SaaS"
                        className="h-11 rounded-xl bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                      />
                    </div>
                  )}

                  {/* Description */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-800 dark:text-slate-200">Project Description</label>
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe the client's business, value proposition, and key target keywords..."
                      className="min-h-[120px] resize-none rounded-xl bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  onClick={handleCreate}
                  disabled={isSubmitting}
                  className="w-full h-12 text-base bg-primary hover:bg-primary/90 rounded-xl font-bold gap-2 shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 duration-200"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Creating Project...
                    </>
                  ) : (
                    <>
                      <Rocket className="h-5 w-5" />
                      Create Project &amp; Get Started
                    </>
                  )}
                </Button>
              </div>

              {/* Right Column - Brand & Media Settings */}
              <div className="space-y-6">
                {/* Brand Colors Card */}
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-6 shadow-sm">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-1">Branding Colors</h3>
                    <p className="text-xs text-muted-foreground">Used dynamically to style landing page buttons, accents, and elements.</p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Primary Theme Color</label>
                      <div className="flex items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 bg-slate-50 dark:bg-slate-800">
                        <PickrColorInput
                          value={primaryColor || "#000000"}
                          onChange={(val) => setPrimaryColor(val)}
                          className="border-0 bg-transparent flex-shrink-0"
                        />
                        <span className="text-xs font-mono font-semibold text-slate-800 dark:text-slate-200">{primaryColor || (isAnalyzing ? "Extracting..." : "No color selected")}</span>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Secondary Accent Color</label>
                      <div className="flex items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 bg-slate-50 dark:bg-slate-800">
                        <PickrColorInput
                          value={secondaryColor || "#000000"}
                          onChange={(val) => setSecondaryColor(val)}
                          className="border-0 bg-transparent flex-shrink-0"
                        />
                        <span className="text-xs font-mono font-semibold text-slate-800 dark:text-slate-200">{secondaryColor || (isAnalyzing ? "Extracting..." : "No color selected")}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Logo Card */}
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4 shadow-sm">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-1">Project Logo</h3>
                    <p className="text-xs text-muted-foreground">Will appear in header navigation templates.</p>
                  </div>

                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleLogoChange}
                  />

                  {logoPreview ? (
                    <div className="space-y-3">
                      {/* Logo display — background adapts to logo brightness so it's always visible */}
                      <div className={`w-full rounded-xl flex items-center justify-center py-4 px-6 min-h-[72px] shadow-sm transition-colors ${logoPreviewBgClass}`}>
                        {(() => {
                          // Resolve SVG markup from any variant: base64, percent-encoded URI, or raw markup
                          let svgMarkup: string | null = null;
                          if (logoPreview.startsWith('data:image/svg+xml;base64,')) {
                            try { svgMarkup = atob(logoPreview.replace('data:image/svg+xml;base64,', '')); } catch { }
                          } else if (/^data:image\/svg\+xml(?:;charset=[^,;]*)?,/i.test(logoPreview)) {
                            try {
                              const payload = logoPreview.replace(/^data:image\/svg\+xml(?:;charset=[^,;]*)?,/i, '');
                              svgMarkup = decodeURIComponent(payload);
                            } catch { }
                          } else if (/^<svg[\s\S]*<\/svg>$/i.test(logoPreview.trim())) {
                            svgMarkup = logoPreview.trim();
                          }

                          if (svgMarkup) {
                            // Detect if SVG is light/white so we can pick the right background.
                            // Extract fill/stroke colors from SVG markup and check average luminance.
                            const detectSvgBrightness = (markup: string): number => {
                              const colorRe = /(?:fill|stroke)="([^"]+)"/gi;
                              const styleRe = /(?:fill|stroke)\s*:\s*([^;}"'\s][^;}"']*)/gi;
                              const hexRe = /#([0-9a-fA-F]{3,6})\b/;
                              const rgbRe = /rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i;
                              let total = 0, count = 0;
                              const processColor = (c: string) => {
                                c = c.trim();
                                if (!c || c === 'none' || c === 'transparent' || c === 'currentColor') return;
                                let r = 0, g = 0, b = 0, ok = false;
                                if (c === 'white' || c === '#fff' || c === '#ffffff') { r = g = b = 255; ok = true; }
                                else if (c === 'black' || c === '#000' || c === '#000000') { r = g = b = 0; ok = true; }
                                else {
                                  const hm = hexRe.exec(c);
                                  if (hm) {
                                    const h = hm[1].length === 3 ? hm[1].split('').map(x => x + x).join('') : hm[1];
                                    r = parseInt(h.slice(0, 2), 16); g = parseInt(h.slice(2, 4), 16); b = parseInt(h.slice(4, 6), 16); ok = true;
                                  } else {
                                    const rm = rgbRe.exec(c);
                                    if (rm) { r = +rm[1]; g = +rm[2]; b = +rm[3]; ok = true; }
                                  }
                                }
                                if (ok) { total += 0.2126 * (r / 255) + 0.7152 * (g / 255) + 0.0722 * (b / 255); count++; }
                              };
                              let m: RegExpExecArray | null;
                              while ((m = colorRe.exec(markup)) !== null) processColor(m[1]);
                              while ((m = styleRe.exec(markup)) !== null) processColor(m[1]);
                              return count > 0 ? total / count : 0.5;
                            };
                            const svgBrightness = detectSvgBrightness(svgMarkup);
                            // Update background class based on SVG brightness (do it once via effect-like call)
                            const bgClass = getLogoPreviewContainerClasses(svgBrightness);
                            if (bgClass !== logoPreviewBgClass) {
                              // Schedule state update outside render
                              setTimeout(() => setLogoPreviewBgClass(bgClass), 0);
                            }
                            return (
                              <span
                                className="flex items-center justify-center [&>svg]:max-h-10 [&>svg]:w-auto [&>svg]:max-w-full"
                                dangerouslySetInnerHTML={{ __html: svgMarkup }}
                              />
                            );
                          }
                          // Raster or external URL — render as <img>
                          return (
                            <img
                              src={logoPreview}
                              alt="Logo preview"
                              className="max-h-10 max-w-full object-contain"
                              onLoad={(e) => handleLogoPreviewImageLoad(e.currentTarget)}
                              onError={(e) => {
                                const current = e.currentTarget;
                                const src = logoPreview || '';
                                // Step 1: try the proxy once (handles hotlink-protected / CORS-blocked sources)
                                if (!current.dataset.triedProxy && src.startsWith('http') && !src.startsWith('data:')) {
                                  current.dataset.triedProxy = '1';
                                  current.src = aiApi.proxyImage(src);
                                  return;
                                }
                                // Step 2: try the detected favicon once
                                const faviconFallback = scrapedData?.favicon;
                                if (!current.dataset.triedFavicon && faviconFallback) {
                                  current.dataset.triedFavicon = '1';
                                  current.src = faviconFallback;
                                  return;
                                }
                                // Step 3: give up — clear the logo so the upload prompt shows instead
                                setLogoPreview(null);
                                setLogoBase64(null);
                              }}
                            />
                          );
                        })()}
                      </div>
                      {/* Actions row */}
                      <div className="flex items-center justify-between px-1">
                        <p className="text-[11px] text-muted-foreground">Detected from website</p>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => logoInputRef.current?.click()}
                            className="text-[11px] text-primary hover:text-primary/80 font-bold px-2.5 py-1 rounded-lg border border-primary/20 hover:bg-primary/5 transition-all"
                          >
                            Change
                          </button>
                          <button
                            type="button"
                            onClick={removeLogo}
                            className="text-[11px] text-slate-500 hover:text-destructive font-semibold px-2.5 py-1 rounded-lg border border-slate-200 hover:border-destructive/20 hover:bg-destructive/5 transition-all"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : scrapedData?.favicon ? (
                    /* Auto-detected favicon — show as logo suggestion */
                    <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                      <div className="h-16 w-16 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0 shadow-md ring-1 ring-slate-200 dark:ring-slate-700 p-1.5 bg-white">
                        <img
                          src={scrapedData.favicon}
                          alt="Detected favicon"
                          className="max-h-full max-w-full object-contain"
                          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">Favicon Detected</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">Upload a custom logo to override</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => logoInputRef.current?.click()}
                        className="text-[11px] text-primary hover:text-primary/80 font-bold px-2.5 py-1 rounded-lg border border-primary/20 hover:bg-primary/5 transition-all text-center"
                      >
                        Upload
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => logoInputRef.current?.click()}
                      className="w-full flex flex-col items-center justify-center gap-2.5 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-primary/40 hover:bg-primary/5 bg-slate-50 dark:bg-slate-800/40 py-8 cursor-pointer transition-all group"
                    >
                      <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                        <ImageIcon className="h-5 w-5 text-slate-400 group-hover:text-primary transition-colors" />
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-primary transition-colors">Upload Custom Logo</p>
                        <p className="text-[10px] text-slate-400 mt-1">PNG, JPG, SVG up to 2MB</p>
                      </div>
                    </button>
                  )}
                </div>

                {/* Extracted Images Card */}
                {/* {scrapedImages.length > 0 && (
                  <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4 shadow-sm">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-1">Extracted Images</h3>
                      <p className="text-xs text-muted-foreground">{scrapedImages.length} brand images found on site.</p>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {scrapedImages.slice(0, 8).map((img, idx) => (
                        <div
                          key={idx}
                          className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 group"
                        >
                          <img
                            src={img.url}
                            alt={img.alt || `Extracted ${idx + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const current = e.currentTarget;
                              const src = img.url || '';
                              // Try proxy for cross-origin images (CORS / hotlink blocked)
                              if (src.startsWith('http') && !current.dataset.proxied) {
                                current.dataset.proxied = '1';
                                current.src = aiApi.proxyImage(src);
                                return;
                              }
                              // Final fallback: hide the broken image
                              current.style.display = 'none';
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )} */}
              </div>

            </div>
          </div>
        )}

        {/* ─── Step 2: Integration Setup ─── */}
        {step === "integration" && createdProject && (
          <div className="max-w-[1000px] w-full px-4 sm:px-8 py-6 space-y-6 flex-1">
            <div className="max-w-3xl mx-auto space-y-6">
              {/* Success banner */}
              <div className="rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 p-5 flex items-center gap-4">
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
                          toast.success("Code copied successfully.");
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

              {/* CTA */}
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="h-12 rounded-xl" onClick={() => navigate(`/dashboard/projects/${createdProject._id}`)}>
                  View Project
                </Button>
                <Button
                  className="h-12 gap-2 bg-primary hover:bg-primary/90 rounded-xl"
                  onClick={() => navigate(`/dashboard/projects/${createdProject._id}?createPage=1`)}
                >
                  <FileText className="h-4 w-4" /> Create First Page <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
};

export default CreateProjectFlow;