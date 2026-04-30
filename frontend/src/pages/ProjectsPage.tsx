import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Plus, Search, Globe, TrendingUp, Users, Zap, LayoutGrid, List,
  ExternalLink, FileText, MoreVertical, Trash2, Edit3, FolderOpen, Copy, CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { projectsApi } from "@/services/api";
import { toast } from "sonner";
import { copyToClipboard, cleanUrl } from "@/lib/utils";

// ─── Component ────────────────────────────────────────────
const ProjectsPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: projectsApi.getAll,
  });

  const deleteMutation = useMutation({
    mutationFn: projectsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project deleted successfully");
      setMenuOpen(null);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete project");
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
    { icon: TrendingUp, label: "Published Pages", value: publishedPages, color: "from-emerald-500 to-teal-500", bg: "bg-emerald-50", tc: "text-emerald-600" },
  ];

  const categoryColors: Record<string, string> = {
    General: "bg-slate-100 text-slate-600",
    Other: "bg-slate-100 text-slate-600",
  };

  return (
    <div className="p-8 min-h-full" onClick={() => setMenuOpen(null)}>
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Projects</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage your SEO landing page projects
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects..."
              className="pl-9 w-56 h-9"
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
          <Button
            className="gap-2 bg-primary hover:bg-primary/90"
            onClick={() => navigate("/dashboard/projects/new")}
          >
            <Plus className="h-4 w-4" /> New Project
          </Button>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-4 gap-4 mb-8">
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
                          <Edit3 className="h-3.5 w-3.5" /> Open Project
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

                <a className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full mb-3 ${categoryColors[project.category] || categoryColors.Other}`}>
                  {project.category || "General"}
                </a>

                <p className="text-xs text-muted-foreground line-clamp-2 mb-4 h-8">
                  {project.description || "No description added yet."}
                </p>

                <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-medium mb-4 bg-muted/30 rounded-md p-2">
                  <span>Pages: {project.pageCount || 0} ({project.publishedPageCount || 0} Published)</span>
                  <span className="text-muted-foreground/30">|</span>
                  <span>Leads: {project.leadCount || 0}</span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="flex items-center gap-2 text-[10px] font-semibold text-muted-foreground tracking-wide uppercase">
                    {project.pages?.some((p: any) => p.type === "ppc") && <span className="bg-violet-100 text-violet-700 px-1.5 py-0.5 rounded">PPC</span>}
                    {project.pages?.some((p: any) => p.type === "seo") && <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">SEO</span>}
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 text-xs text-primary hover:text-primary font-bold group-hover:bg-primary/5 transition-colors"
                    onClick={() => navigate(`/dashboard/projects/${project._id}`)}
                  >
                    View Details →
                  </Button>
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
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">TOKEN</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">CATEGORY</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">PAGES</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">CREATED</th>
                <th className="px-5 py-3" />
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
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded truncate max-w-[120px]">{project.apiToken || "No Token"}</span>
                      <button
                        onClick={async () => {
                          if (project.apiToken) {
                            const success = await copyToClipboard(project.apiToken);
                            if (success) {
                              setCopiedId(project._id);
                              toast.success("Token copied!");
                              setTimeout(() => setCopiedId(null), 2000);
                            } else {
                              toast.error("Failed to copy token");
                            }
                          }
                        }}
                        className="text-muted-foreground hover:text-foreground transition-all active:scale-90"
                        title="Copy API Token"
                      >
                        {copiedId === project._id ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${categoryColors[project.category] || categoryColors.Other}`}>
                      {project.category || "General"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-muted-foreground">{project.pageCount || 0}</td>

                  <td className="px-5 py-3.5 text-sm text-muted-foreground">{new Date(project.createdAt).toLocaleDateString()}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2 justify-end">
                      <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => navigate(`/dashboard/projects/${project._id}`)}>
                        Open
                      </Button>
                      <button onClick={() => handleDelete(project._id)} className="p-1.5 rounded-md hover:bg-red-50 text-muted-foreground hover:text-red-500">
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
    </div>
  );
};

export default ProjectsPage;
