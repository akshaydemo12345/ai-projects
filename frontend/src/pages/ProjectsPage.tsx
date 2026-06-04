import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Plus, Search, Globe, TrendingUp, Users, Zap, LayoutGrid, List,
  ExternalLink, FileText, MoreVertical, Trash2, Edit3, FolderOpen, Copy, CheckCircle2, Mail, Settings2, X, LayoutDashboard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { projectsApi } from "@/services/api";
import { toast } from "sonner";
import { copyToClipboard, cleanUrl } from "@/lib/utils";

// ─── Edit Project Modal ──────────────────────────────────────
interface EditProjectModalProps {
  project: any;
  onClose: () => void;
  onSave: (data: any) => void;
}

const EditProjectModal = ({ project, onClose, onSave }: EditProjectModalProps) => {
  const [name, setName] = useState(project.name);
  const [websiteUrl, setWebsiteUrl] = useState(project.websiteUrl || "");
  const [preSlug, setPreSlug] = useState(project.preSlug || "");
  const [industry, setIndustry] = useState(project.industry || project.category || "SaaS");
  const [subIndustry, setSubIndustry] = useState(project.subIndustry || project.scrapedData?.subIndustry || "");

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
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block text-left">Project Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="My Awesome Project" />
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
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:ring-2 focus:ring-primary/20 outline-none"
            >
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

// ─── Main Component ──────────────────────────────────────────
const ProjectsPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [editingProject, setEditingProject] = useState<any | null>(null);

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: projectsApi.getAll,
  });

  const deleteMutation = useMutation({
    mutationFn: projectsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project deleted successfully.");
      setMenuOpen(null);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete project");
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => projectsApi.update(editingProject?._id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project updated successfully.");
      setEditingProject(null);
      setMenuOpen(null);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update project");
    }
  });

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      deleteMutation.mutate(id);
    }
  };

  const filtered = projects.filter(
    (p: any) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.websiteUrl && p.websiteUrl.toLowerCase().includes(search.toLowerCase()))
  );

  const totalLeads = projects.reduce(
    (sum: number, p: any) => sum + (p.leadCount || 0), 0
  );
  const totalPages = projects.reduce((sum: number, p: any) => sum + (p.pageCount || 0), 0);
  const publishedPages = projects.reduce(
    (sum: number, p: any) => sum + (p.publishedPageCount || 0), 0
  );


  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const statCards = [
    { icon: FolderOpen, label: "Total Projects", value: projects.length, color: "from-violet-500 to-indigo-500", bg: "bg-violet-50", tc: "text-violet-600" },
    { icon: FileText, label: "Landing Pages", value: totalPages, color: "from-blue-500 to-cyan-500", bg: "bg-blue-50", tc: "text-blue-600" },
    { icon: Users, label: "Total Leads", value: totalLeads.toLocaleString(), color: "from-amber-500 to-orange-500", bg: "bg-amber-50", tc: "text-amber-600" },
    { icon: TrendingUp, label: "Published Landing Pages", value: publishedPages, color: "from-emerald-500 to-teal-500", bg: "bg-emerald-50", tc: "text-emerald-600" },
  ];

  const categoryColors: Record<string, string> = {
    General: "bg-slate-100 text-slate-600",
    Other: "bg-slate-100 text-slate-600",
  };

  return (
    <div className="p-8 min-h-full" onClick={() => setMenuOpen(null)}>
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Projects</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage your landing page projects
          </p>
        </div>
        <Button
          className="gap-2 bg-primary hover:bg-primary/90"
          onClick={() => navigate("/dashboard/projects/new")}
        >
          <Plus className="h-4 w-4" /> New Project
        </Button>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {statCards.map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-5 flex items-center gap-4">
            <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${s.bg}`}>
              <s.icon className={`h-5 w-5 ${s.tc}`} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="text-2xl font-bold text-foreground">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Search & View Toggle ── */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects..."
            className="pl-9 h-9"
          />
        </div>
        <div className="flex border border-border rounded-lg overflow-hidden">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 ${viewMode === "grid" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"}`}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 ${viewMode === "list" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"}`}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* ── Content ── */}
      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mb-5">
            <Zap className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">
            Create your first project
          </h2>
          <p className="text-sm text-muted-foreground mb-6 max-w-sm">
            Start by creating a project for your client. Each project can have
            multiple SEO and PPC landing pages.
          </p>
          <Button
            className="gap-2 bg-primary hover:bg-primary/90"
            onClick={() => navigate("/dashboard/projects/new")}
          >
            <Plus className="h-4 w-4" /> New Project
          </Button>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project: any) => (
            <div
              key={project._id}
              className="rounded-xl border border-border bg-card overflow-hidden hover:shadow-md transition-all group relative"
            >
              <div className="h-2 bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500" />
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 flex-shrink-0">
                      <Globe className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <a className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full ${categoryColors[project.category] || categoryColors.Other}`}>
                        {project.category || "General"}
                      </a>
                      <h3 className="font-semibold text-foreground truncate">{project.name}</h3>
                      <div className="flex items-center gap-1 mt-0.5">
                        <ExternalLink className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                        <a className="text-xs text-muted-foreground truncate"
                          target="_blank"
                          href={cleanUrl(project.websiteUrl)}
                        >
                          {cleanUrl(project.websiteUrl)}
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="relative flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => setMenuOpen(menuOpen === project._id ? null : project._id)}
                      className="p-1.5 rounded-md hover:bg-muted text-muted-foreground"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                    {menuOpen === project._id && (
                      <div className="absolute right-0 top-8 z-50 w-40 rounded-lg border border-border bg-card shadow-lg overflow-hidden">
                        <button
                          onClick={() => navigate(`/dashboard/projects/${project._id}`)}
                          className="flex w-full items-center gap-2 px-3 py-2.5 text-xs text-foreground hover:bg-muted"
                        >
                          <LayoutDashboard className="h-3.5 w-3.5" /> Project Dashboard
                        </button>
                        <button
                          onClick={() => navigate(`/dashboard/mail-management?projectId=${project._id}`)}
                          className="flex w-full items-center gap-2 px-3 py-2.5 text-xs text-foreground hover:bg-muted"
                        >
                          <Mail className="h-3.5 w-3.5" /> Email Settings
                        </button>
                        <button
                          onClick={() => setEditingProject(project)}
                          className="flex w-full items-center gap-2 px-3 py-2.5 text-xs text-foreground hover:bg-muted"
                        >
                          <Settings2 className="h-3.5 w-3.5" /> Project Settings
                        </button>
                        <button
                          onClick={() => handleDelete(project._id)}
                          className="flex w-full items-center gap-2 px-3 py-2.5 text-xs text-red-500 hover:bg-red-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-medium mb-4 bg-muted/30 rounded-md p-2">
                  <span>Pages: {project.pageCount || 0}</span>
                  <span className="text-muted-foreground/30">|</span>
                  <span>Leads: {project.leadCount || 0}</span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      className="h-8 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold shadow-sm transition-all"
                      onClick={() => navigate(`/dashboard/projects/${project._id}`)}
                    >
                      Go to Dashboard →
                    </Button>
                    <div className="flex items-center gap-1 text-[10px] font-semibold text-muted-foreground tracking-wide uppercase">
                      {project.pages?.some((p: any) => p.type === "ppc") && <span className="bg-violet-100 text-violet-700 px-1.5 py-0.5 rounded">PPC</span>}
                      {project.pages?.some((p: any) => p.type === "seo") && <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">SEO</span>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div
            onClick={() => navigate("/dashboard/projects/new")}
            className="rounded-xl border-2 border-dashed border-border bg-card/50 flex flex-col items-center justify-center min-h-[200px] hover:border-primary/40 transition-colors cursor-pointer group"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-background mb-3 group-hover:border-primary/40 transition-colors">
              <Plus className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
              New Project
            </p>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">PROJECT</th>
                <th className="text-center px-5 py-3 text-xs font-semibold text-muted-foreground">CATEGORY</th>
                <th className="text-center px-5 py-3 text-xs font-semibold text-muted-foreground">PAGES</th>
                <th className="text-center px-5 py-3 text-xs font-semibold text-muted-foreground">LEADS</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-muted-foreground whitespace-nowrap">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((project: any) => (
                <tr key={project._id} className="border-b border-border hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3.5">
                    <div>
                      <p className="text-sm font-medium text-foreground">{project.name}</p>
                      <a className="text-xs text-muted-foreground" target="_blank" rel="noopener noreferrer" href={cleanUrl(project.websiteUrl)}>{project.websiteUrl || "No URL"}</a>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${categoryColors[project.category] || categoryColors.Other}`}>
                      {project.category || "General"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-muted-foreground text-center font-bold">{project.pageCount || 0}</td>
                  <td className="px-5 py-3.5 text-sm text-muted-foreground text-center font-bold">{project.leadCount || 0}</td>

                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2 justify-end">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="h-7 px-2 text-[10px] gap-1 font-bold bg-muted hover:bg-primary/10 hover:text-primary transition-all"
                        title="Email Settings"
                        onClick={() => navigate(`/dashboard/mail-management?projectId=${project._id}`)}
                      >
                        <Mail className="h-3 w-3" />
                        Email
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-7 text-[10px] font-bold gap-1.5 hover:bg-primary hover:text-white transition-all" 
                        onClick={() => navigate(`/dashboard/projects/${project._id}`)}
                      >
                        <LayoutDashboard className="h-3 w-3" />
                        Project Dashboard
                      </Button>
                      <button onClick={() => handleDelete(project._id)} className="p-1.5 rounded-md hover:bg-red-50 text-muted-foreground hover:text-red-500 transition-colors">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editingProject && (
        <EditProjectModal
          project={editingProject}
          onClose={() => setEditingProject(null)}
          onSave={(data) => updateMutation.mutate(data)}
        />
      )}
    </div>
  );
};

export default ProjectsPage;
