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
import { ConfirmDeleteModal } from "@/components/ConfirmDeleteModal";

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
  const [deleteProjectId, setDeleteProjectId] = useState<string | null>(null);

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
    setDeleteProjectId(id);
  };

  const confirmDelete = () => {
    if (deleteProjectId) {
      deleteMutation.mutate(deleteProjectId);
      setDeleteProjectId(null);
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
    <div className="flex-1 min-h-full flex flex-col" onClick={() => setMenuOpen(null)} style={{ background: "#f2f2f2" }}>
      {/* ── Header Bar (White / slate-900) ── */}
      <div className="px-4 sm:px-4 pt-6 pb-4 border-b border-border flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-slate-900">
        <div>
          <h1 className="text-lg font-bold text-foreground">My Projects</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage your landing page projects
          </p>
        </div>
        <Button
          className="gap-2 bg-primary hover:bg-primary/90 h-10 px-4 rounded-xl"
          onClick={() => navigate("/dashboard/projects/new")}
        >
          <Plus className="h-4 w-4" /> New Project
        </Button>
      </div>

      {/* ── Main Content Area ── */}
      <div className="max-w-[1800px] w-full mx-auto px-4 sm:px-4 py-4 space-y-4 flex-1">
        {/* ── Stats ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {statCards.map((s) => (
            <div key={s.label} className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex items-center gap-4 shadow-sm">
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${s.bg}`}>
                <s.icon className={`h-5 w-5 ${s.tc}`} />
              </div>
              <div>
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">{s.label}</p>
                <p className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Search & View Toggle ── */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects..."
              className="pl-9 h-10 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-slate-300"
            />
          </div>
          <div className="flex bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-1 shadow-sm">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg transition-all ${viewMode === "grid" ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white" : "text-muted-foreground hover:bg-muted"}`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-lg transition-all ${viewMode === "list" ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white" : "text-muted-foreground hover:bg-muted"}`}
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
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((project: any) => (
              <div
                key={project._id}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden hover:shadow-md transition-all group relative flex flex-col"
              >
                <div className="h-1.5 bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500" />
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 flex-shrink-0">
                        <Globe className="h-5 w-5 text-primary" />
                      </div>
                      <div className="min-w-0">

                        <div className="mt-0.5">
                          <h3 className="font-bold text-slate-900 dark:text-white text-base truncate">{project.name}</h3>
                        </div>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${categoryColors[project.category] || "bg-slate-100 text-slate-600"}`}>
                          {project.category || "General"}
                        </span>
                        <div className="flex items-center gap-1 mt-2">
                          <ExternalLink className="h-3 w-3 text-slate-400 flex-shrink-0" />
                          <a className="text-xs text-muted-foreground hover:text-primary transition-colors truncate font-medium"
                            target="_blank"
                            rel="noopener noreferrer"
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

                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 font-semibold mb-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl p-3 border border-slate-100/55 dark:border-slate-800/50">
                    <span>Pages: <strong className="text-slate-800 dark:text-slate-200">{project.pageCount || 0}</strong></span>
                    <span className="text-slate-200 dark:text-slate-700">|</span>
                    <span>Leads: <strong className="text-slate-800 dark:text-slate-200">{project.leadCount || 0}</strong></span>
                  </div>

                  <div className="flex items-center justify-between pt-4 mt-auto border-t border-slate-100 dark:border-slate-800/80">
                    <div className="flex flex-wrap items-center justify-between w-full gap-2">
                      <Button
                        size="sm"
                        className="h-9 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-sm transition-all"
                        onClick={() => navigate(`/dashboard/projects/${project._id}`)}
                      >
                        Go to Dashboard →
                      </Button>
                      <div className="flex flex-wrap items-center gap-1 text-[10px] font-semibold text-slate-400 tracking-wide uppercase">
                        {project.pages?.some((p: any) => p.type === "ppc") && <span className="bg-violet-50 text-violet-600 border border-violet-100 px-1.5 py-0.5 rounded-md">PPC</span>}
                        {project.pages?.some((p: any) => p.type === "seo") && <span className="bg-blue-50 text-blue-600 border border-blue-100 px-1.5 py-0.5 rounded-md">SEO</span>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div
              onClick={() => navigate("/dashboard/projects/new")}
              className="rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-900/30 flex flex-col items-center justify-center min-h-[220px] hover:border-primary/40 hover:bg-white dark:hover:bg-slate-900 transition-all cursor-pointer group"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white mb-3 group-hover:border-primary/40 transition-colors shadow-sm">
                <Plus className="h-5 w-5 text-slate-400 group-hover:text-primary transition-colors" />
              </div>
              <p className="text-sm font-semibold text-slate-500 group-hover:text-slate-800 transition-colors">
                New Project
              </p>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="bg-slate-50/55 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
                    <th className="text-left px-5 py-3.5 text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">PROJECT</th>
                    <th className="text-center px-5 py-3.5 text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">CATEGORY</th>
                    <th className="text-center px-5 py-3.5 text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">PAGES</th>
                    <th className="text-center px-5 py-3.5 text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">LEADS</th>
                    <th className="text-right px-5 py-3.5 text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((project: any) => (
                    <tr key={project._id} className="border-b border-slate-100 dark:border-slate-800/80 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-5 py-4">
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white">{project.name}</p>
                          <a className="text-xs text-slate-400 hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer" href={cleanUrl(project.websiteUrl)}>{project.websiteUrl || "No URL"}</a>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${categoryColors[project.category] || "bg-slate-100 text-slate-600"}`}>
                          {project.category || "General"}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-400 text-center font-bold">{project.pageCount || 0}</td>
                      <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-400 text-center font-bold">{project.leadCount || 0}</td>

                      <td className="px-5 py-4">
                        <div className="flex flex-wrap items-center gap-2 justify-end">
                          <Button
                            size="sm"
                            variant="secondary"
                            className="h-8 px-3 text-[11px] gap-1.5 font-bold bg-slate-50 hover:bg-primary/10 hover:text-primary transition-all rounded-xl border border-slate-100"
                            title="Email Settings"
                            onClick={() => navigate(`/dashboard/mail-management?projectId=${project._id}`)}
                          >
                            <Mail className="h-3.5 w-3.5" />
                            Email
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 px-3 text-[11px] font-bold gap-1.5 hover:bg-primary hover:text-white transition-all rounded-xl"
                            onClick={() => navigate(`/dashboard/projects/${project._id}`)}
                          >
                            <LayoutDashboard className="h-3.5 w-3.5" />
                            Dashboard
                          </Button>
                          <button onClick={() => handleDelete(project._id)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {editingProject && (
        <EditProjectModal
          project={editingProject}
          onClose={() => setEditingProject(null)}
          onSave={(data) => updateMutation.mutate(data)}
        />
      )}

      <ConfirmDeleteModal
        isOpen={!!deleteProjectId}
        onClose={() => setDeleteProjectId(null)}
        onConfirm={confirmDelete}
        title="Delete Project?"
        description="Are you sure you want to delete this project? This will permanently remove all landing pages and leads associated with it."
      />
    </div>
  );
};

export default ProjectsPage;

