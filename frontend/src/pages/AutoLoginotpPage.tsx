import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2, Mail, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { aiApi, authApi, projectsApi } from "@/services/api";
import { normalizeLogoUrl } from "@/lib/utils";
import { toast } from "sonner";
import config from "@/config";

function getDomainKey(url: string): string {
  if (!url) return "";
  return url
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//i, "")
    .replace(/^www\./i, "")
    .split("/")[0]
    .split(":")[0]
    .split("?")[0]
    .split("#")[0];
}

/**
 * Background helper to analyze a website URL and create a project, returning the new or reused projectId.
 */
async function createProjectFromWebsite(websiteUrl: string): Promise<string> {
  let targetUrl = websiteUrl.trim();
  if (!targetUrl) throw new Error("No website provided");
  if (!/^https?:\/\//i.test(targetUrl)) {
    targetUrl = "https://" + targetUrl;
  }

  // 1. Check if matching project already exists on the backend before website analysis
  try {
    const checkRes: any = await projectsApi.checkExisting(targetUrl);
    if (checkRes?.exists && checkRes?.project?._id) {
      console.log("[AutoLogin] Reusing existing project:", checkRes.project._id);
      return checkRes.project._id;
    }
  } catch (err) {
    console.warn("[AutoLogin] Failed checkExisting API call:", err);
  }

  // Fallback check on project list
  try {
    const domainKey = getDomainKey(targetUrl);
    if (domainKey) {
      const existingProjects = await projectsApi.getAll();
      const existing = (existingProjects || []).find((p: any) => {
        const urls = [
          p.websiteUrl,
          p.url,
          p.scrapeMeta?.sourceUrl,
          p.websiteProfile?.extraction?.sourceUrl,
          p.websiteProfile?.extraction?.finalUrl,
        ].filter(Boolean);
        return urls.some((u: string) => getDomainKey(u) === domainKey);
      });

      if (existing?._id) {
        console.log("[AutoLogin] Reusing existing project from list:", existing._id);
        return existing._id;
      }
    }
  } catch (err) {
    console.warn("[AutoLogin] Failed project list duplicate check:", err);
  }

  // 2. Project Not Found -> Analyze Website
  let meta: any = {};
  try {
    const res = await aiApi.extractProject(targetUrl);
    meta = res?.data || {};
  } catch (err: any) {
    const code = (err as any)?.code;
    if (code !== "SITE_BLOCKED") {
      console.warn("Extraction failed, proceeding with fallbacks:", err);
    }
  }

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

  const project = res?.data?.project || res?.project;
  if (!project?._id) throw new Error("Project creation failed");
  return project._id;
}

/**
 * URL-triggered auto-login.
 *
 * Single Loading Screen Flow:
 * Auto Login -> Single Loading Screen -> (Background Auth + Project Creation) -> Redirect directly to Create New Page
 */
const AutoLoginOtpPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  const email = (searchParams.get("email") || "").trim();
  const website = (searchParams.get("website") || "").trim();

  const [status, setStatus] = useState<"sending" | "sent" | "verifying" | "authenticating" | "creating_project" | "error">("sending");
  const [loadingMessage, setLoadingMessage] = useState("Authenticating...");
  const [errorMsg, setErrorMsg] = useState("");
  const [otp, setOtp] = useState("");
  const sentRef = useRef(false);

  // Helper to handle post-auth flow (project creation in background of same screen -> redirect)
  const processPostAuth = async (websiteUrl: string) => {
    if (websiteUrl) {
      setLoadingMessage("Setting up your project...");
      try {
        const projectId = await createProjectFromWebsite(websiteUrl);
        navigate(`/dashboard/projects/${projectId}/create-page`, { replace: true });
        return;
      } catch (err: any) {
        console.error("Auto project creation failed:", err);
        toast.error("Could not automatically create project. Opening dashboard.");
        navigate("/dashboard", { replace: true });
        return;
      }
    }
    navigate("/dashboard", { replace: true });
  };

  useEffect(() => {
    if (!email) {
      setStatus("error");
      setErrorMsg("No email address was provided in the link.");
      return;
    }
    if (sentRef.current) return;
    sentRef.current = true;

    if (config.features.stopOtpVerificationEmail) {
      // OTP verification disabled — authenticate directly on this single loading screen
      setStatus("authenticating");
      setLoadingMessage(website ? "Authenticating & creating project..." : "Logging you in...");

      (async () => {
        try {
          const res: any = await authApi.autoLoginDirect(email);
          const token = res?.accessToken;
          const user = res?.data?.user || res?.user;
          if (!token || !user) throw new Error("Login response was incomplete.");

          login(token, user);
          await processPostAuth(website);
        } catch (err: any) {
          setStatus("error");
          setErrorMsg(err?.message || "Something went wrong. Please try again.");
        }
      })();
      return;
    }

    (async () => {
      try {
        await authApi.sendAutoLoginOtp(email);
        setStatus("sent");
      } catch (err: any) {
        setStatus("error");
        setErrorMsg(err?.message || "Something went wrong. Please try again.");
      }
    })();
  }, [email, login, navigate, website]);

  const handleResend = async () => {
    setStatus("sending");
    setErrorMsg("");
    try {
      await authApi.sendAutoLoginOtp(email);
      setStatus("sent");
      toast.success("A new code has been sent.");
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err?.message || "Something went wrong. Please try again.");
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error("Enter the 6-digit code from your email.");
      return;
    }
    setStatus("verifying");
    setLoadingMessage(website ? "Verifying & creating project..." : "Verifying code...");
    setErrorMsg("");
    try {
      const res: any = await authApi.verifyAutoLoginOtp(email, otp);
      const token = res?.accessToken;
      const user = res?.data?.user || res?.user;
      if (!token || !user) throw new Error("Login response was incomplete.");

      login(token, user);
      await processPostAuth(website);
    } catch (err: any) {
      setStatus("sent");
      setErrorMsg(err?.message || "OTP verification failed. Please check the code and try again.");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm text-center">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
          {status === "authenticating" || status === "verifying" || status === "creating_project" ? (
            <Sparkles className="h-7 w-7 text-primary animate-pulse" />
          ) : (
            <Mail className="h-7 w-7 text-primary" />
          )}
        </div>

        {(status === "sending" || status === "authenticating" || status === "creating_project") && (
          <div className="py-4">
            <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-primary" />
            <h2 className="text-lg font-semibold text-foreground mb-1">{loadingMessage}</h2>
            <p className="text-xs text-muted-foreground">Please wait a moment...</p>
          </div>
        )}

        {(status === "sent" || status === "verifying") && (
          <>
            <h1 className="mb-2 text-xl font-semibold">Check your email</h1>
            <p className="mb-6 text-sm text-muted-foreground">
              We've sent a code to <span className="font-medium text-foreground">{email}</span>.
              Enter it below to log in.
            </p>

            <form onSubmit={handleVerify} className="space-y-4">
              <Input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                className="text-center text-2xl tracking-[0.5em]"
                autoFocus
              />

              {errorMsg && <p className="text-sm text-destructive">{errorMsg}</p>}

              <Button type="submit" className="w-full" disabled={status === "verifying" || otp.length !== 6}>
                {status === "verifying" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Verify & Log In"
                )}
              </Button>

              <button
                type="button"
                onClick={handleResend}
                className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
              >
                Didn't get it? Resend code
              </button>
            </form>
          </>
        )}

        {status === "error" && (
          <>
            <h1 className="mb-2 text-xl font-semibold">Authentication Error</h1>
            <p className="mb-6 text-sm text-muted-foreground">{errorMsg}</p>
            <Button variant="outline" onClick={() => navigate("/login", { replace: true })}>
              Back to Login
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default AutoLoginOtpPage;