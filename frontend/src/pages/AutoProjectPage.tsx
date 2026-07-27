import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Sparkles, Loader2, AlertCircle, RefreshCw, Globe, ArrowRight } from "lucide-react";
import { aiApi, projectsApi } from "@/services/api";
import { normalizeLogoUrl } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function normalizeWebsiteUrl(rawUrl: string): string {
  let trimmed = rawUrl.trim();
  if (!trimmed) return "";
  if (!/^https?:\/\//i.test(trimmed)) {
    trimmed = "https://" + trimmed;
  }
  return trimmed;
}

function isValidUrl(raw: string): boolean {
  try {
    const url = new URL(raw);
    return (url.protocol === "http:" || url.protocol === "https:") && url.hostname.includes(".");
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// Loader Only Component
// ---------------------------------------------------------------------------
const AutoProjectPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const rawWebsite = (searchParams.get("website") || "").trim();
  const normalizedUrl = normalizeWebsiteUrl(rawWebsite);

  const [websiteInput, setWebsiteInput] = useState(normalizedUrl || rawWebsite);
  const [activeUrl, setActiveUrl] = useState(normalizedUrl);
  const [statusText, setStatusText] = useState("Analyzing website & creating your project...");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const hasRunRef = useRef(false);

  useEffect(() => {
    if (hasRunRef.current) return;
    hasRunRef.current = true;

    (async () => {
      setErrorMsg(null);
      setStatusText("Validating URL...");

      const targetUrl = activeUrl || normalizeWebsiteUrl(rawWebsite);

      if (!targetUrl) {
        setErrorMsg("No website URL was provided in the link.");
        return;
      }

      if (!isValidUrl(targetUrl)) {
        setErrorMsg(`"${targetUrl}" is not a valid URL. Please enter a valid site address like https://example.com`);
        return;
      }

      // 1. Analyze website
      setStatusText("Analyzing website content & branding...");
      let meta: any = {};
      try {
        const res = await aiApi.extractProject(targetUrl);
        meta = res?.data || {};
      } catch (err: any) {
        const code = (err as any)?.code;
        if (code !== "SITE_BLOCKED") {
          setErrorMsg(err?.message || "Website analysis failed. Please try again.");
          return;
        }
      }

      // 2. Prepare Project Metadata
      setStatusText("Building your project workspace...");
      const projectName =
        meta.projectName ||
        (targetUrl.replace(/^https?:\/\/(www\.)?/, "").split("/")[0] || "My Project");
      const logoUrl = normalizeLogoUrl(meta.projectLogo || "") || undefined;
      const primaryColor = meta.primaryColor || meta.themeSystem?.primary || undefined;
      const secondaryColor = meta.secondaryColor || meta.themeSystem?.secondary || undefined;
      const extractedColors: string[] = meta.colors || [];
      const themeSystem = meta.themeSystem || {};
      const websiteProfile = meta.websiteProfile || undefined;
      const services = meta.services || [];
      const keywords = meta.keywords || [];
      const scrapedData = meta.scrapedData || {};
      const description = meta.projectDesc || "";

      const industries = [
        "SaaS", "Agency", "E-commerce", "Healthcare", "Real Estate",
        "Finance", "Technology", "Consulting", "Construction", "Hospitality",
        "Legal", "Beauty & Wellness", "General", "Other",
      ];
      let category = "General";
      let subIndustry = "";
      if (meta.industry) {
        if (industries.includes(meta.industry)) category = meta.industry;
        else { category = "General"; subIndustry = meta.industry; }
      } else if (meta.scrapedData?.industry) {
        const si = meta.scrapedData.industry;
        if (industries.includes(si)) category = si;
        else { category = "General"; subIndustry = si; }
      }
      const fonts = {
        bodyFont: meta.fonts?.bodyFont || meta.websiteProfile?.fonts?.bodyFont || "",
        headingFont: meta.fonts?.headingFont || meta.websiteProfile?.fonts?.headingFont || "",
      };

      // 3. Create Project
      try {
        let finalProfile = websiteProfile;
        if (websiteProfile) {
          finalProfile = {
            ...websiteProfile,
            identity: {
              ...(websiteProfile.identity || {}),
              name: projectName,
              description,
              logoUrl: logoUrl || websiteProfile.identity?.logoUrl || undefined,
            },
            colors: {
              ...(websiteProfile.colors || {}),
              primary: primaryColor || websiteProfile.colors?.primary || undefined,
              secondary: secondaryColor || websiteProfile.colors?.secondary || undefined,
              palette: extractedColors.length > 0 ? extractedColors : (websiteProfile.colors?.palette || []),
            },
            fonts: {
              ...(websiteProfile.fonts || {}),
              bodyFont: fonts.bodyFont || websiteProfile.fonts?.bodyFont || undefined,
              headingFont: fonts.headingFont || websiteProfile.fonts?.headingFont || undefined,
            },
            industry: {
              ...(websiteProfile.industry || {}),
              industry: category,
              subIndustry: subIndustry || undefined,
            },
          };
        }

        const res = await projectsApi.create({
          name: projectName,
          websiteUrl: targetUrl,
          category,
          subIndustry: subIndustry || undefined,
          description,
          logoUrl: logoUrl,
          primaryColor,
          secondaryColor,
          colors: extractedColors.length > 0 ? extractedColors : [primaryColor, secondaryColor].filter(Boolean),
          themeSystem,
          services,
          keywords,
          fonts,
          scrapedData,
          websiteProfile: finalProfile,
        });

        const project = res?.data?.project;
        if (!project?._id) throw new Error("Project creation returned no project ID.");

        setStatusText("Redirecting to page builder...");
        setTimeout(() => {
          navigate(`/dashboard/projects/${project._id}/create-page`, { replace: true });
        }, 500);
      } catch (err: any) {
        setErrorMsg(err?.message || "Project creation failed. Please try again.");
      }
    })();
  }, [retryCount, activeUrl, rawWebsite, navigate]);

  const handleRetry = (newUrl?: string) => {
    const target = normalizeWebsiteUrl(newUrl || websiteInput);
    if (target) {
      setActiveUrl(target);
      setSearchParams({ website: target });
    }
    hasRunRef.current = false;
    setRetryCount((c) => c + 1);
  };

  const domainDisplay = (activeUrl || rawWebsite)
    ? (activeUrl || rawWebsite).replace(/^https?:\/\/(www\.)?/, "").split("/")[0]
    : "";

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white font-sans relative overflow-hidden">
      
      {/* Dynamic Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none animate-pulse" />

      <div className="relative w-full max-w-md bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 text-center shadow-2xl z-10">
        
        {!errorMsg ? (
          /* LOADER ONLY VIEW */
          <div className="flex flex-col items-center py-6 animate-in fade-in duration-300">
            {/* Pulsing Spinner Icon Container */}
            <div className="relative flex items-center justify-center mb-8">
              <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-xl animate-ping" />
              <div className="w-20 h-20 rounded-full border-4 border-purple-500/20 border-t-purple-500 animate-spin flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-purple-400 animate-pulse" />
              </div>
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-white mb-2">
              Setting Up Your Project
            </h2>

            {domainDisplay && (
              <p className="text-sm font-semibold text-purple-300 mb-2">
                {domainDisplay}
              </p>
            )}

            <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
              {statusText}
            </p>

            <div className="mt-8 flex items-center justify-center gap-2 text-slate-400 text-xs">
              <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
              <span>Please wait a moment...</span>
            </div>
          </div>
        ) : (
          /* ERROR VIEW WITH EDITABLE URL & RETRY */
          <div className="flex flex-col items-center py-4 animate-in fade-in duration-300">
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-5 text-red-400">
              <AlertCircle className="w-7 h-7" />
            </div>

            <h2 className="text-xl font-bold text-white mb-2">Unable to Create Project</h2>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              {errorMsg}
            </p>

            <div className="w-full space-y-3 mb-6 text-left">
              <label className="text-xs font-medium text-slate-300">
                Website URL:
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input
                  type="text"
                  value={websiteInput}
                  onChange={(e) => setWebsiteInput(e.target.value)}
                  placeholder="https://example.com"
                  className="pl-9 h-11 bg-slate-950 border-slate-800 text-slate-100 text-xs focus-visible:ring-purple-500"
                />
              </div>
            </div>

            <div className="w-full space-y-2">
              <Button
                onClick={() => handleRetry(websiteInput)}
                className="w-full h-11 bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-purple-900/30 gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </Button>

              <Button
                variant="ghost"
                onClick={() => navigate("/dashboard", { replace: true })}
                className="w-full h-10 text-xs text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-xl"
              >
                Go to Dashboard
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AutoProjectPage;
