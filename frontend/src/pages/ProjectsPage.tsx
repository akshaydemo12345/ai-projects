import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Plus, Search, Globe, TrendingUp, Users, Zap, LayoutGrid, List,
  ExternalLink, FileText, MoreVertical, Trash2, Edit3, FolderOpen, Copy, CheckCircle2, Mail, Settings2, X, LayoutDashboard, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { projectsApi, aiApi } from "@/services/api";
import { toast } from "sonner";
import { copyToClipboard, cleanUrl, cleanProjectName, getDifferentiatedProjectName } from "@/lib/utils";
import { ConfirmDeleteModal } from "@/components/ConfirmDeleteModal";
import { useAuth } from "@/hooks/useAuth";

// ─── Edit Project Modal ──────────────────────────────────────
interface EditProjectModalProps {
  project: any;
  onClose: () => void;
  onSave: (data: any) => void;
}

const EditProjectModal = ({ project, onClose, onSave }: EditProjectModalProps) => {
  const [name, setName] = useState(cleanProjectName(project.name) || "");
  const [websiteUrl, setWebsiteUrl] = useState(project.websiteUrl || "");
  const [preSlug, setPreSlug] = useState(project.preSlug || "");
  const allowedIndustries = ["SaaS", "Agency", "E-commerce", "Healthcare", "Real Estate", "Plumber", "Lawyer", "Other"];
  const initialIndustryRaw = project.websiteProfile?.industry?.industry || project.scrapedData?.industry || project.industry || project.category || "SaaS";
  const initialIndustry = allowedIndustries.includes(initialIndustryRaw) ? initialIndustryRaw : "General";
  const [industry, setIndustry] = useState(initialIndustry);
  const [subIndustry, setSubIndustry] = useState(
    // Prefer websiteProfile -> scrapedData -> explicit subIndustry
    project.websiteProfile?.industry?.subIndustry || project.scrapedData?.subIndustry || project.subIndustry || (allowedIndustries.includes(initialIndustryRaw) ? "" : initialIndustryRaw) || ""
  );

  const handleSave = () => {
    if (!name.trim()) {
      toast.error("Project name is required");
      return;
    }
    onSave({
      name,
      websiteUrl,
      preSlug,
      industry,
      subIndustry
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-background rounded-2xl border border-border shadow-2xl overflow-hidden text-left">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-border">
          <Settings2 className="h-5 w-5 text-primary" />
          <h2 className="text-base font-semibold text-foreground flex-1">Project Settings</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block text-left">Website Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. samsung.com" />
          </div>
          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block text-left">Website URL (Client's Site)</label>
            <Input value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} placeholder="https://example.com" />
          </div>
          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block text-left">Pre Slug (Optional URL Prefix)</label>
            <Input value={preSlug} onChange={(e) => setPreSlug(e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''))} placeholder="e.g. landing-pages" />
            <p className="text-[10px] text-muted-foreground mt-1.5 italic">
              Example URL: {window.location.origin}/{preSlug ? preSlug + '/' : ''}page-slug
            </p>
          </div>
          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block text-left">Industry</label>
            <select
              value={industry}
              onChange={(e) => {
                const val = e.target.value;
                setIndustry(val);
                // If user selects General, and we have a scraped/raw industry, surface it in subIndustry
                if (val === 'General') {
                  const raw = project.websiteProfile?.industry?.industry || project.scrapedData?.industry || project.industry || project.category || '';
                  if (raw && !allowedIndustries.includes(raw)) setSubIndustry(raw);
                }
                // If user picks a known industry, clear subIndustry placeholder
                if (val !== 'General' && allowedIndustries.includes(val)) {
                  // preserve existing subIndustry if it's meaningful, otherwise clear
                  if (!project.subIndustry && !project.scrapedData?.subIndustry) setSubIndustry('');
                }
              }}
              className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:ring-2 focus:ring-primary/20 outline-none"
            >
              <option value="General">General</option>
              <option value="SaaS">SaaS</option>
              <option value="Agency">Agency</option>
              <option value="E-commerce">E-commerce</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Real Estate">Real Estate</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block text-left">Sub-Industry</label>
            <Input
              value={subIndustry}
              onChange={(e) => setSubIndustry(e.target.value)}
              placeholder="e.g. Fintech, Dental Care, Luxury Homes"
            />
          </div>
        </div>
        <div className="flex gap-3 px-6 py-4 border-t border-border bg-muted/20">
          <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button className="flex-1 bg-primary text-white font-bold" onClick={handleSave}>Save Changes</Button>
        </div>
      </div>
    </div>
  );
};

// ─── ProjectLogoIcon ─────────────────────────────
const ProjectLogoIcon = ({ project }: { project: any }) => {
  const identity = project.websiteProfile?.identity;
  // Favicon-first: favicon -> favicon-proxy -> logo -> logo-proxy -> Globe
  const faviconUrl: string = identity?.favicon || identity?.faviconUrl || '';
  const logoUrl: string = identity?.logoUrl || project.logoUrl || '';

  const [src, setSrc] = useState<string | null>(faviconUrl || logoUrl || null);
  const [stage, setStage] = useState<'favicon' | 'favicon-proxy' | 'logo' | 'logo-proxy' | 'none'>(
    faviconUrl ? 'favicon' : logoUrl ? 'logo' : 'none'
  );

  // Re-sync when project data arrives after async query resolves
  useEffect(() => {
    setSrc(faviconUrl || logoUrl || null);
    setStage(faviconUrl ? 'favicon' : logoUrl ? 'logo' : 'none');
  }, [faviconUrl, logoUrl]);

  const handleError = () => {
    if (stage === 'favicon') {
      if (faviconUrl.startsWith('http') && !faviconUrl.includes('/proxy-image')) {
        setStage('favicon-proxy'); setSrc(aiApi.proxyImage(faviconUrl)); return;
      }
      if (logoUrl) { setStage('logo'); setSrc(logoUrl); return; }
    }
    if (stage === 'favicon-proxy') {
      if (logoUrl) { setStage('logo'); setSrc(logoUrl); return; }
    }
    if (stage === 'logo') {
      if (logoUrl.startsWith('http') && !logoUrl.includes('/proxy-image')) {
        setStage('logo-proxy'); setSrc(aiApi.proxyImage(logoUrl)); return;
      }
    }
    setStage('none'); setSrc(null);
  };

  if (!src || stage === 'none') return <Globe className="h-5 w-5 text-primary" />;
  return <img src={src} alt="favicon" className="h-6 w-6 object-contain" onError={handleError} />;
};

// ─── Main Component ──────────────────────────────────────────
const ProjectsPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const userProjects = await projectsApi.getAll();
        if (userProjects && userProjects.length > 0) {
          const activeId = localStorage.getItem("active_project_id");
          const matched = userProjects.find((p: any) => p._id === activeId);
          const targetProj = matched || userProjects[0];
          if (targetProj?._id) {
            localStorage.setItem("active_project_id", targetProj._id);
            navigate(`/dashboard/projects/${targetProj._id}`, { replace: true });
            return;
          }
        }
        const res = await projectsApi.create({ name: "My Project", category: "General" });
        const newProj = res?.data?.project || res?.project;
        if (newProj?._id) {
          localStorage.setItem("active_project_id", newProj._id);
          navigate(`/dashboard/projects/${newProj._id}`, { replace: true });
          return;
        }
        navigate("/dashboard/projects/new", { replace: true });
      } catch (err) {
        console.error("Failed to redirect from dashboard:", err);
      }
    })();
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm font-medium text-muted-foreground">Opening Project Dashboard...</p>
    </div>
  );
};

export default ProjectsPage;