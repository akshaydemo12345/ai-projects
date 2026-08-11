import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Globe, FileText, Code2, Shield,
  Palette, CheckCircle2, Save, ExternalLink,
  Loader2, Layout, MousePointer2, AlertTriangle, Link,
  Webhook, Plus, Trash2, Play, RotateCw, XCircle, Clock, Key, Send, Lock
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { pagesApi, projectsApi, formsApi, type LandingPage, type WebhookLogItem } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PickrColorInput } from "@/components/ui/PickrColorInput";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { getImageAverageBrightness, getLogoPreviewContainerClasses } from "@/lib/utils";

const PageSettingsPage = () => {
  const { id: projectId, pageId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch Page Data (using lean getSettings instead of getById)
  const { data: page, isLoading: pageLoading, error: pageError } = useQuery({
    queryKey: ["page-settings", pageId],
    queryFn: () => pagesApi.getSettings(projectId!, pageId!),
    enabled: !!pageId,
  });

  // Fetch Project Data
  const { data: project, isLoading: projectLoading } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => projectsApi.getById(projectId!),
    enabled: !!projectId,
  });

  // Form State
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [noIndex, setNoIndex] = useState(false);
  const [noFollow, setNoFollow] = useState(false);
  const [primaryColor, setPrimaryColor] = useState("#7c3aed");
  const [secondaryColor, setSecondaryColor] = useState("#6366f1");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | undefined>(undefined);
  const [logoPreviewBgClass, setLogoPreviewBgClass] = useState<string>("border border-slate-700 bg-slate-950 dark:border-slate-500 dark:bg-slate-950");

  const handleLogoPreviewImageLoad = (img: HTMLImageElement) => {
    const brightness = getImageAverageBrightness(img);
    setLogoPreviewBgClass(getLogoPreviewContainerClasses(brightness));
  };
  const [mainHeader, setMainHeader] = useState("");
  const [mainFooter, setMainFooter] = useState("");
  const [thankYouHeader, setThankYouHeader] = useState("");
  const [thankYouFooter, setThankYouFooter] = useState("");
  const [thankYouUrl, setThankYouUrl] = useState("");

  // Initialize form
  useEffect(() => {
    if (page) {
      setName(page.name || page.title || "");
      setSlug(page.slug || "");
      setMetaTitle(page.metaTitle ?? "");
      setMetaDescription(page.metaDescription ?? "");
      setNoIndex(page.noIndex ?? false);
      setNoFollow(page.noFollow ?? false);
      setPrimaryColor(page.primaryColor ?? "#7c3aed");
      setSecondaryColor(page.secondaryColor ?? "#6366f1");
      setLogoPreview(page.logoUrl ?? null);
      setLogoUrl(page.logoUrl);
      setMainHeader(page.mainHeader ?? "");
      setMainFooter(page.mainFooter ?? "");
      setThankYouHeader(page.thankYouHeader ?? "");
      setThankYouFooter(page.thankYouFooter ?? "");
      setThankYouUrl(page.thankYouUrl ?? "");
    }
  }, [page]);

  const updatePageMutation = useMutation({
    mutationFn: (data: Partial<LandingPage>) => pagesApi.updateSettings(projectId!, pageId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["page-settings", pageId] });
      queryClient.invalidateQueries({ queryKey: ["page", pageId] });
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      toast.success("Page settings saved successfully.");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to save settings");
    },
  });

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setLogoPreview(preview);
    const reader = new FileReader();
    reader.onloadend = () => setLogoUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  const updateContentColors = (
    content: string | undefined,
    newPrimary: string,
    newSecondary: string,
    oldPrimary?: string,
    oldSecondary?: string
  ) => {
    if (!content) return content;
    let updated = content;

    // 1. Update the :root variable declarations
    updated = updated.replace(/--primary\s*:\s*[^;}]+/g, `--primary: ${newPrimary}`);
    updated = updated.replace(/--secondary\s*:\s*[^;}]+/g, `--secondary: ${newSecondary}`);
    updated = updated.replace(/--accent\s*:\s*[^;}]+/g, `--accent: ${newSecondary}`);
    updated = updated.replace(/--gold\s*:\s*[^;}]+/g, `--gold: ${newPrimary}`);
    updated = updated.replace(/--btn-bg\s*:\s*[^;}]+/g, `--btn-bg: ${newPrimary}`);

    // Update button-gradient variable if present
    updated = updated.replace(/--button-gradient\s*:\s*linear-gradient\([^)]+\)/g, `--button-gradient: linear-gradient(135deg, ${newPrimary}, ${newSecondary})`);

    // 2. Self-healing: if there were hardcoded occurrences of the old primary/secondary colors in styles (e.g. from previously saved pages),
    // we also replace them to var(--primary) / var(--secondary) so they become dynamic!
    if (oldPrimary && oldPrimary !== newPrimary) {
      const escapedOld = oldPrimary.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const regex = new RegExp(`(?<!--primary\\s*:\\s*)(?<!--primary-dark\\s*:\\s*)(?<!--p3-primary\\s*:\\s*)(?<!--p3-primary-mid\\s*:\\s*)(?<!--primary-container\\s*:\\s*)(?<!--primary-temp\\s*:\\s*)${escapedOld}`, 'gi');
      updated = updated.replace(regex, 'var(--primary)');
    }
    if (oldSecondary && oldSecondary !== newSecondary) {
      const escapedOld = oldSecondary.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const regex = new RegExp(`(?<!--secondary\\s*:\\s*)${escapedOld}`, 'gi');
      updated = updated.replace(regex, 'var(--secondary)');
    }

    return updated;
  };

  const handleSave = () => {
    if (!name.trim() || !slug.trim()) {
      toast.error("Name and slug are required.");
      return;
    }

    // Update content and styles with new colors
    const updatedLandingPageContent = updateContentColors(
      page.landingPageContent,
      primaryColor,
      secondaryColor,
      page.primaryColor,
      page.secondaryColor
    );
    const updatedLandingPageStyles = updateContentColors(
      page.landingPageStyles,
      primaryColor,
      secondaryColor,
      page.primaryColor,
      page.secondaryColor
    );
    const updatedThankYouPageContent = updateContentColors(
      page.thankYouPageContent,
      primaryColor,
      secondaryColor,
      page.primaryColor,
      page.secondaryColor
    );
    const updatedThankYouPageStyles = updateContentColors(
      page.thankYouPageStyles,
      primaryColor,
      secondaryColor,
      page.primaryColor,
      page.secondaryColor
    );

    // If page has a content object with html/fullHtml/styles
    let updatedContentObj = page.content;
    if (page.content) {
      updatedContentObj = {
        ...page.content,
        fullHtml: updateContentColors(page.content.fullHtml, primaryColor, secondaryColor, page.primaryColor, page.secondaryColor),
        html: updateContentColors(page.content.html, primaryColor, secondaryColor, page.primaryColor, page.secondaryColor),
        fullCss: updateContentColors(page.content.fullCss, primaryColor, secondaryColor, page.primaryColor, page.secondaryColor)
      };
    }

    updatePageMutation.mutate({
      name: name.trim(),
      slug: slug.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
      metaTitle,
      metaDescription,
      noIndex,
      noFollow,
      primaryColor,
      secondaryColor,
      logoUrl,
      mainHeader,
      mainFooter,
      thankYouHeader,
      thankYouFooter,
      thankYouUrl,
      landingPageContent: updatedLandingPageContent,
      landingPageStyles: updatedLandingPageStyles,
      thankYouPageContent: updatedThankYouPageContent,
      thankYouPageStyles: updatedThankYouPageStyles,
      content: updatedContentObj,
      styles: updatedLandingPageStyles
    } as LandingPage);
  };

  if (!pageLoading && (pageError || !page)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#f8fafc] dark:bg-slate-950 p-6 text-center">
        <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <AlertTriangle className="h-8 w-8 text-red-600" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Page Not Found</h1>
        <Button onClick={() => navigate(`/dashboard/projects/${projectId}`)}>Back to Project</Button>
      </div>
    );
  }

  const liveUrl = `${window.location.origin}/${project?.preSlug ? project.preSlug + '/' : ''}${slug || page?.slug || ''}`;

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-4">
        <div className=" flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(`/dashboard/projects/${projectId}`)}
              className="h-8 px-3 text-xs font-semibold inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back
            </button>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">{name || page?.name || "Page Settings"}</h1>
              <p className="text-xs text-slate-500">Configure page details and tracking scripts.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button onClick={handleSave} disabled={updatePageMutation.isPending} className="rounded-xl px-8 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 gap-2">
              {updatePageMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Update
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full  px-4 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">

          {/* LEFT CARD: Page Details */}
          <div className="space-y-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-8">
            <div className="flex items-center gap-3 pb-6 border-b border-slate-100 dark:border-slate-800">
              <div className="h-10 w-10 rounded-xl bg-violet-100 dark:bg-violet-950/30 flex items-center justify-center text-violet-600">
                <Layout className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Page Configuration</h2>
                <p className="text-xs text-slate-500">General settings, SEO, and Branding.</p>
              </div>
            </div>

            {pageLoading ? (
              <div className="space-y-6 animate-pulse">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded" />
                    <div className="h-11 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 w-20 bg-slate-200 dark:bg-slate-800 rounded" />
                    <div className="h-11 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
                  </div>
                </div>
                <div className="h-14 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />

                <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="h-5 w-36 bg-slate-200 dark:bg-slate-800 rounded" />
                  <div className="space-y-2">
                    <div className="h-3.5 w-16 bg-slate-200 dark:bg-slate-800 rounded" />
                    <div className="h-10 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-3.5 w-24 bg-slate-200 dark:bg-slate-800 rounded" />
                    <div className="h-20 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-11 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse" />
                    <div className="h-11 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse" />
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="h-5 w-24 bg-slate-200 dark:bg-slate-800 rounded" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <div className="h-3.5 w-20 bg-slate-200 dark:bg-slate-800 rounded" />
                      <div className="h-10 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-3.5 w-12 bg-slate-200 dark:bg-slate-800 rounded" />
                      <div className="h-12 w-28 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* General */}
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Page Name</label>
                      <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Roof Repair Page" className="h-11 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300">URL Slug</label>
                      <Input value={slug} onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""))} placeholder="roof-repair" className="h-11 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-xl" />
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <div className="flex items-center gap-3 truncate pr-4">
                      <Globe className="h-4 w-4 text-primary shrink-0" />
                      <span className="text-xs font-mono text-slate-500 truncate">
                        {projectLoading ? (
                          <span className="flex items-center gap-2">
                            <Loader2 className="h-3 w-3 animate-spin text-slate-400" />
                            Loading URL...
                          </span>
                        ) : liveUrl}
                      </span>
                    </div>
                    {!projectLoading && (
                      <a href={liveUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold text-primary hover:underline shrink-0">Preview</a>
                    )}
                  </div>
                </div>

                {/* SEO */}
                <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-4 w-4 text-blue-500" />
                    <h3 className="text-sm font-bold">SEO Optimization</h3>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500">Meta Title</label>
                    <Input value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} placeholder="Page Title..." className="h-10 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-lg" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500">Meta Description</label>
                    <Textarea value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} placeholder="Description..." className="min-h-[80px] bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-lg p-3 resize-none text-xs" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50">
                      <Checkbox checked={noIndex} onCheckedChange={(c) => setNoIndex(!!c)} id="ni" />
                      <label htmlFor="ni" className="text-[11px] font-bold cursor-pointer">No-Index</label>
                    </div>
                    <div className="flex items-center gap-2 p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50">
                      <Checkbox checked={noFollow} onCheckedChange={(c) => setNoFollow(!!c)} id="nf" />
                      <label htmlFor="nf" className="text-[11px] font-bold cursor-pointer">No-Follow</label>
                    </div>
                  </div>
                </div>

                {/* Branding */}
                <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Palette className="h-4 w-4 text-pink-500" />
                    <h3 className="text-sm font-bold">Branding</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-slate-500">Theme Colors</label>
                      <div className="flex gap-3">
                        <div className="flex-1 flex items-center gap-2 p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50">
                          <PickrColorInput value={primaryColor} onChange={(val) => setPrimaryColor(val)} />
                          <span className="text-[10px] font-mono">{primaryColor}</span>
                        </div>
                        <div className="flex-1 flex items-center gap-2 p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50">
                          <PickrColorInput value={secondaryColor} onChange={(val) => setSecondaryColor(val)} />
                          <span className="text-[10px] font-mono">{secondaryColor}</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-slate-500">Logo</label>
                      <div className="flex items-center gap-4">
                        <div className={`h-12 w-12 rounded-lg flex items-center justify-center overflow-hidden shrink-0 shadow-lg ring-1 ring-slate-600 ${logoPreviewBgClass}`}>
                          {logoPreview ? <img src={logoPreview} className="w-full h-full object-contain" onLoad={(e) => handleLogoPreviewImageLoad(e.currentTarget)} /> : <Layout className="h-5 w-5 text-slate-300" />}
                        </div>
                        <label className="text-[10px] font-bold px-3 py-2 bg-primary/10 text-primary rounded-lg cursor-pointer hover:bg-primary/20 transition-colors">
                          Upload
                          <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* RIGHT CARD: Scripts & Tracking */}
          <div className="space-y-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-8 h-full flex flex-col">
            <div className="flex items-center gap-3 pb-6 border-b border-slate-100 dark:border-slate-800">
              <div className="h-10 w-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/30 flex items-center justify-center text-emerald-600">
                <Code2 className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Scripts & Tracking</h2>
                <p className="text-xs text-slate-500">Analytics, pixels, and conversion tracking.</p>
              </div>
            </div>

            {pageLoading ? (
              <div className="space-y-8 flex-1 animate-pulse">
                {/* Main Page Scripts Skeleton */}
                <div className="space-y-4">
                  <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded" />
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="h-3.5 w-24 bg-slate-200 dark:bg-slate-800 rounded" />
                      <div className="h-32 bg-slate-950 rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-3.5 w-24 bg-slate-200 dark:bg-slate-800 rounded" />
                      <div className="h-24 bg-slate-950 rounded-xl" />
                    </div>
                  </div>
                </div>
                {/* Thank You Page Scripts Skeleton */}
                <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between items-center">
                    <div className="h-4 w-28 bg-slate-200 dark:bg-slate-800 rounded" />
                    <div className="h-8 w-44 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse" />
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="h-3.5 w-32 bg-slate-200 dark:bg-slate-800 rounded" />
                      <div className="h-24 bg-slate-950 rounded-xl animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-8 flex-1">
                {/* Main Page Scripts */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Main Landing Page</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-slate-500 uppercase">Header Script</label>
                      <Textarea value={mainHeader} onChange={(e) => setMainHeader(e.target.value)} placeholder="<!-- GTM etc -->" className="min-h-[140px] bg-slate-950 text-emerald-400 font-mono text-[11px] rounded-xl p-4 border-slate-800 focus:ring-primary shadow-inner resize-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-slate-500 uppercase">Footer Script</label>
                      <Textarea value={mainFooter} onChange={(e) => setMainFooter(e.target.value)} placeholder="<script>...</script>" className="min-h-[100px] bg-slate-950 text-emerald-400 font-mono text-[11px] rounded-xl p-4 border-slate-800 focus:ring-primary shadow-inner resize-none" />
                    </div>
                  </div>
                </div>

                {/* Thank You Page Scripts */}
                <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Thank You Page</h3>
                    <div className="flex items-center gap-2 max-w-[200px]">
                      <Link className="h-3 w-3 text-slate-400 shrink-0" />
                      <Input value={thankYouUrl} onChange={(e) => setThankYouUrl(e.target.value)} placeholder="Redirect URL..." className="h-8 text-[10px] bg-slate-50 rounded-lg" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-slate-500 uppercase">Conversion Header</label>
                      <Textarea value={thankYouHeader} onChange={(e) => setThankYouHeader(e.target.value)} placeholder="<!-- Conversion Pixels -->" className="min-h-[100px] bg-slate-950 text-emerald-400 font-mono text-[11px] rounded-xl p-4 border-slate-800 focus:ring-primary shadow-inner resize-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-slate-500 uppercase">Conversion Footer</label>
                      <Textarea value={thankYouFooter} onChange={(e) => setThankYouFooter(e.target.value)} className="min-h-[100px] bg-slate-950 text-emerald-400 font-mono text-[11px] rounded-xl p-4 border-slate-800 focus:ring-primary shadow-inner resize-none" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* WEBHOOK INTEGRATION & LOGS CARD */}
        {projectId && <WebhookSettingsSection projectId={projectId} pageId={pageId} />}
      </div>
    </div>
  );
};

/* ─── WEBHOOK SETTINGS SECTION COMPONENT ────────────────────────────────── */
const WebhookSettingsSection = ({ projectId, pageId }: { projectId: string; pageId?: string }) => {
  const [enabled, setEnabled] = useState(false);
  const [url, setUrl] = useState("");
  const [method, setMethod] = useState<"POST" | "PUT">("POST");
  const [headers, setHeaders] = useState<{ key: string; value: string }[]>([]);
  const [secret, setSecret] = useState("");
  const [applyToAllPages, setApplyToAllPages] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [resendingLogId, setResendingLogId] = useState<string | null>(null);
  const [selectedLogPayload, setSelectedLogPayload] = useState<any | null>(null);

  // 1. Fetch Form Schema for page / project
  const { data: schemaData, isLoading: schemaLoading } = useQuery({
    queryKey: ["form-schema-page-project", pageId, projectId],
    queryFn: async () => {
      if (pageId) {
        try {
          const res = await formsApi.getSchemaByPageId(pageId);
          if (res) return res;
        } catch (e) { }
      }
      return formsApi.getSchemaByProject(projectId);
    },
    enabled: !!projectId || !!pageId,
  });

  const formSchemaId = schemaData?._id;

  // 2. Fetch Webhook Config & Logs
  const { data: webhookData, isLoading: webhookLoading, refetch } = useQuery({
    queryKey: ["webhook-config-logs", formSchemaId],
    queryFn: () => formsApi.getWebhookConfigAndLogs(formSchemaId!),
    enabled: !!formSchemaId,
    refetchInterval: 10000 // Refresh logs every 10 seconds automatically
  });

  useEffect(() => {
    if (webhookData?.webhook) {
      setEnabled(webhookData.webhook.enabled ?? false);
      setUrl(webhookData.webhook.url ?? "");
      setMethod(webhookData.webhook.method ?? "POST");
      setHeaders(webhookData.webhook.headers || []);
      setSecret(webhookData.webhook.secret ?? "");
    }
  }, [webhookData]);

  const saveMutation = useMutation({
    mutationFn: () =>
      formsApi.updateWebhookConfig(formSchemaId!, { enabled, url, method, headers, secret, applyToAllPages } as any),
    onSuccess: (res: any) => {
      toast.success(res?.message || "Webhook integration settings saved.");
      refetch();
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to save webhook settings");
    }
  });

  const handleAddHeader = () => {
    setHeaders([...headers, { key: "", value: "" }]);
  };

  const handleRemoveHeader = (index: number) => {
    setHeaders(headers.filter((_, i) => i !== index));
  };

  const handleHeaderChange = (index: number, field: "key" | "value", val: string) => {
    const updated = [...headers];
    updated[index][field] = val;
    setHeaders(updated);
  };

  const handleGenerateSecret = () => {
    const randomHex = Array.from(crypto.getRandomValues(new Uint8Array(16)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    setSecret(`whsec_${randomHex}`);
    toast.info("Generated new HMAC signing secret. Click Save to apply.");
  };

  const handleTestWebhook = async () => {
    if (!url.trim()) {
      toast.error("Please specify a target Webhook URL before testing.");
      return;
    }
    setIsTesting(true);
    try {
      const res = await formsApi.testWebhook(formSchemaId!, { url, method, headers, secret });
      if (res.success) {
        toast.success(res.message || "Test payload dispatched successfully!");
      } else {
        toast.error(res.message || "Test dispatch failed.");
      }
      refetch();
    } catch (err: any) {
      toast.error(err.message || "Error running webhook test.");
    } finally {
      setIsTesting(false);
    }
  };

  const handleResendLog = async (logId: string) => {
    setResendingLogId(logId);
    try {
      const res = await formsApi.resendWebhook(logId);
      if (res.success) {
        toast.success("Webhook re-delivery succeeded!");
      } else {
        toast.error(res.message || "Re-delivery failed.");
      }
      refetch();
    } catch (err: any) {
      toast.error(err.message || "Failed to trigger re-delivery.");
    } finally {
      setResendingLogId(null);
    }
  };

  if (schemaLoading) {
    return (
      <div className="mt-4 p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm animate-pulse space-y-4">
        <div className="h-6 w-48 bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="h-10 bg-slate-100 dark:bg-slate-800 rounded-xl" />
      </div>
    );
  }

  if (!formSchemaId) {
    return null;
  }

  const logs: WebhookLogItem[] = webhookData?.logs || [];

  return (
    <div className="mt-4 space-y-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-8">
      {/* SECTION HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-blue-100 dark:bg-blue-950/40 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Webhook className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Lead Submission Webhooks</h2>
              <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-full ${enabled ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800" : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"}`}>
                {enabled ? "Active" : "Disabled"}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Instantly forward captured form submissions to external endpoints, CRMs, or automation workflows (Zapier, Make, custom APIs).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleTestWebhook}
            disabled={isTesting || !url.trim()}
            className="rounded-xl border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 gap-1.5 text-xs font-semibold"
          >
            {isTesting ? <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-500" /> : <Play className="h-3.5 w-3.5 text-blue-500" />}
            Test Webhook
          </Button>

          <Button
            type="button"
            onClick={() => saveMutation.mutate()}
            disabled={saveMutation.isPending}
            className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 gap-1.5 text-xs font-semibold"
          >
            {saveMutation.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            Save Webhook Settings
          </Button>
        </div>
      </div>

      {/* CONFIGURATION FORM */}
      <div className="space-y-6">
        {/* Toggle Switch */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
          <div className="space-y-0.5">
            <label htmlFor="wh-enable" className="text-sm font-bold text-slate-800 dark:text-slate-200 cursor-pointer">
              Enable Real-time Webhook Submissions
            </label>
            <p className="text-xs text-slate-500">
              When active, every valid lead captured on this page will trigger an async background HTTP request with payload signatures.
            </p>
          </div>
          <Checkbox
            id="wh-enable"
            checked={enabled}
            onCheckedChange={(val) => setEnabled(!!val)}
            className="h-5 w-5 rounded-md"
          />
        </div>

        {/* Method & URL Input */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2 md:col-span-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">HTTP Method</label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value as "POST" | "PUT")}
              className="w-full h-11 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="POST">POST (Standard)</option>
              <option value="PUT">PUT (Update)</option>
            </select>
          </div>

          <div className="space-y-2 md:col-span-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Target Webhook Endpoint URL</label>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <Shield className="h-3 w-3" /> SSRF Protection Active
              </span>
            </div>
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://api.yourcompany.com/webhooks/lead-receiver"
              className="h-11 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono"
            />
            <label className="flex items-center gap-2 mt-2 text-xs font-medium text-slate-600 dark:text-slate-400 cursor-pointer">
              <Checkbox
                checked={applyToAllPages}
                onCheckedChange={(val) => setApplyToAllPages(!!val)}
                className="h-4 w-4 rounded"
              />
              Apply this Webhook URL to all pages in this project
            </label>
          </div>
        </div>

        {/* Security & Secret Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Key className="h-3.5 w-3.5 text-amber-500" /> HMAC SHA-256 Signing Secret
            </label>
            <button
              type="button"
              onClick={handleGenerateSecret}
              className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Generate Random Secret
            </button>
          </div>
          <div className="relative">
            <Input
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              placeholder="whsec_..."
              type="text"
              className="h-11 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono pr-24"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-400">
              X-Signature-256
            </div>
          </div>
          <p className="text-[11px] text-slate-500">
            If set, requests will contain an <code className="text-amber-600 dark:text-amber-400">X-Signature-256</code> header computed as <code className="font-mono">HMAC-SHA256(payload, secret)</code> for request authenticity verification.
          </p>
        </div>

        {/* Custom Headers */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-violet-500" /> Custom HTTP Headers
            </label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleAddHeader}
              className="h-7 text-xs font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 gap-1"
            >
              <Plus className="h-3.5 w-3.5" /> Add Header
            </Button>
          </div>

          {headers.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No custom headers defined. Optional authorization or API key headers can be configured above.</p>
          ) : (
            <div className="space-y-2">
              {headers.map((hdr, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Input
                    value={hdr.key}
                    onChange={(e) => handleHeaderChange(idx, "key", e.target.value)}
                    placeholder="Header Key (e.g. Authorization)"
                    className="h-9 text-xs bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-lg flex-1 font-mono"
                  />
                  <Input
                    value={hdr.value}
                    onChange={(e) => handleHeaderChange(idx, "value", e.target.value)}
                    placeholder="Header Value (e.g. Bearer token_xyz)"
                    className="h-9 text-xs bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-lg flex-1 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveHeader(idx)}
                    className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* DELIVERY AUDIT LOGS */}
      <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-slate-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Recent Delivery Logs</h3>
            <span className="text-xs text-slate-400 font-normal">(Last 50 dispatches)</span>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => refetch()}
            className="h-7 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 gap-1"
          >
            <RotateCw className="h-3 w-3" /> Refresh Logs
          </Button>
        </div>

        {webhookLoading ? (
          <div className="space-y-2 animate-pulse">
            <div className="h-10 bg-slate-100 dark:bg-slate-800 rounded-lg" />
            <div className="h-10 bg-slate-100 dark:bg-slate-800 rounded-lg" />
          </div>
        ) : logs.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <Send className="h-8 w-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-500">No webhook dispatches recorded yet.</p>
            <p className="text-[11px] text-slate-400">Trigger a test webhook or submit a lead on your published page to see delivery logs.</p>
          </div>
        ) : (
          <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-2xl">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold">
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">URL</th>
                  <th className="py-3 px-4">HTTP</th>
                  <th className="py-3 px-4">Attempts</th>
                  <th className="py-3 px-4">Dispatched At</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {logs.map((log) => {
                  const isSuccess = log.deliveryStatus === "success";
                  const isPending = log.deliveryStatus === "pending";
                  return (
                    <tr key={log._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4">
                        {isSuccess ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-400">
                            <CheckCircle2 className="h-3 w-3" /> Delivered
                          </span>
                        ) : isPending ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-400">
                            <Loader2 className="h-3 w-3 animate-spin" /> Retrying
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700 dark:bg-red-950/80 dark:text-red-400">
                            <XCircle className="h-3 w-3" /> Failed
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <span className={`text-[10px] font-mono uppercase font-bold px-1.5 py-0.5 rounded ${log.isTest ? "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400" : "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400"}`}>
                          {log.isTest ? "Test Payload" : "Lead Event"}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-mono text-[11px] max-w-[200px] truncate text-slate-700 dark:text-slate-300" title={log.url}>
                        {log.url}
                      </td>

                      <td className="py-3 px-4 font-mono font-bold">
                        <span className={log.responseStatus >= 200 && log.responseStatus < 300 ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"}>
                          {log.responseStatus || 0}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-semibold text-slate-600 dark:text-slate-400">
                        {log.attempts || 1} / 3
                      </td>

                      <td className="py-3 px-4 text-slate-500 text-[11px]">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>

                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => setSelectedLogPayload(selectedLogPayload?._id === log._id ? null : log)}
                          className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          {selectedLogPayload?._id === log._id ? "Hide Details" : "View Payload"}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleResendLog(log._id)}
                          disabled={resendingLogId === log._id}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                          {resendingLogId === log._id ? <Loader2 className="h-3 w-3 animate-spin" /> : <RotateCw className="h-3 w-3" />}
                          Resend
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* LOG PAYLOAD INSPECTOR MODAL/DRAWER */}
        {selectedLogPayload && (
          <div className="p-4 rounded-2xl bg-slate-950 text-slate-200 border border-slate-800 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-bold text-blue-400">Log Inspector ID: {selectedLogPayload._id}</span>
              <button
                onClick={() => setSelectedLogPayload(null)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                Close ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase text-slate-400 mb-1">Request Payload</p>
                <pre className="p-3 bg-slate-900 rounded-xl overflow-x-auto text-[11px] text-emerald-400">
                  {JSON.stringify(selectedLogPayload.requestPayload, null, 2)}
                </pre>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase text-slate-400 mb-1">Response Body / Error</p>
                <pre className="p-3 bg-slate-900 rounded-xl overflow-x-auto text-[11px] text-amber-300">
                  {selectedLogPayload.error ? selectedLogPayload.error : selectedLogPayload.responseBody || "No content returned"}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PageSettingsPage;