import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Globe, FileText, Code2, Shield, 
  Palette, CheckCircle2, Save, ExternalLink,
  Loader2, Layout, MousePointer2, AlertTriangle, Link
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { pagesApi, projectsApi, type LandingPage } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { getImageAverageBrightness, getLogoPreviewContainerClasses } from "@/lib/utils";

const PageSettingsPage = () => {
  const { id: projectId, pageId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch Page Data
  const { data: page, isLoading: pageLoading, error: pageError } = useQuery({
    queryKey: ["page", pageId],
    queryFn: () => pagesApi.getById(projectId!, pageId!),
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

  const handleLogoPreviewImageLoad = async (img: HTMLImageElement) => {
    const brightness = await getImageAverageBrightness(img.src);
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
      setName(page.name);
      setSlug(page.slug);
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
    mutationFn: (data: LandingPage) => pagesApi.update(projectId!, pageId!, data),
    onSuccess: () => {
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

  const handleSave = () => {
    if (!name.trim() || !slug.trim()) {
      toast.error("Name and slug are required.");
      return;
    }
    
    updatePageMutation.mutate({
      ...page,
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
      thankYouUrl
    } as LandingPage);
  };

  if (pageLoading || projectLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#f8fafc] dark:bg-slate-950">
        <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Loading settings...</p>
      </div>
    );
  }

  if (pageError || !page) {
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

  const liveUrl = `${window.location.origin}/${project?.preSlug ? project.preSlug + '/' : ''}${slug || page.slug}`;

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-8 py-4">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(`/dashboard/projects/${projectId}`)}
              className="h-10 w-10 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 hover:text-primary transition-all hover:border-primary/30"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">{name || "Page Settings"}</h1>
              <p className="text-xs text-slate-500">Configure page details and tracking scripts.</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => navigate(`/dashboard/projects/${projectId}`)} className="rounded-xl px-6">Cancel</Button>
            <Button onClick={handleSave} disabled={updatePageMutation.isPending} className="rounded-xl px-8 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 gap-2">
              {updatePageMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save All
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-[1600px] w-full mx-auto px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
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
                  <span className="text-xs font-mono text-slate-500 truncate">{liveUrl}</span>
                </div>
                <a href={liveUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold text-primary hover:underline shrink-0">Preview</a>
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
                      <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="h-6 w-6 rounded cursor-pointer" />
                      <span className="text-[10px] font-mono">{primaryColor}</span>
                    </div>
                    <div className="flex-1 flex items-center gap-2 p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50">
                      <input type="color" value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} className="h-6 w-6 rounded cursor-pointer" />
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
          </div>
        </div>

        <div className="flex justify-center pt-8">
          <Button onClick={handleSave} disabled={updatePageMutation.isPending} className="rounded-xl px-8 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 gap-2">
            {updatePageMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save All Page Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PageSettingsPage;
