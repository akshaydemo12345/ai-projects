import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Globe, Plus, Users, Link2, TrendingUp, Search, LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sitesApi, statsApi, type Site } from "@/services/api";

const AllSitesPage = () => {
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [stats, setStats] = useState({ totalSites: 0, totalLeads: 0, totalViews: 0, avgConversion: "0%" });

  useEffect(() => {
    Promise.all([sitesApi.getAll(), statsApi.getDashboardStats()]).then(([s, st]) => {
      setSites(s);
      setStats(st);
      setLoading(false);
    });
  }, []);

  const handleDelete = async (id: string) => {
    await sitesApi.delete(id);
    setSites(sites.filter((s) => s.id !== id));
  };

  const filtered = sites.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()));

  const statCards = [
    { icon: Globe, label: "Total Sites", value: stats.totalSites, iconBg: "bg-primary/10", iconColor: "text-primary" },
    { icon: Users, label: "Total Leads", value: stats.totalLeads.toLocaleString(), iconBg: "bg-yellow-50", iconColor: "text-yellow-500" },
    { icon: Link2, label: "Active Domains", value: sites.filter(s => s.status === "published").length, iconBg: "bg-muted", iconColor: "text-muted-foreground" },
    { icon: TrendingUp, label: "Avg Conversion", value: stats.avgConversion, iconBg: "bg-green-50", iconColor: "text-green-500" },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">All Sites</h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search sites..."
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
          <Link to="/dashboard/create">
            <Button className="gap-2 bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4" /> New site
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {statCards.map((s) => (
          <div key={s.label} className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
            <div className={`flex h-10 w-10 items-center justify-center rounded-full ${s.iconBg}`}>
              <s.icon className={`h-5 w-5 ${s.iconColor}`} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="text-xl font-bold text-foreground">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Sites Grid */}
      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl border border-border bg-card animate-pulse">
              <div className="h-40 bg-muted rounded-t-xl" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((site) => (
            <Link key={site.id} to="/editor" className="group">
              <div className="rounded-xl border border-border bg-card overflow-hidden hover:shadow-md transition-all">
                <div className={`h-40 ${site.id === "1" ? "bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(280,70%,70%)]" : "bg-muted"}`} />
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-foreground">{site.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{site.url.replace("https://", "").replace(".pagebuilder.ai", "")}</p>
                  <span className={`inline-block mt-2 text-xs px-2.5 py-0.5 rounded font-medium ${
                    site.status === "published" ? "bg-green-50 text-green-600" : "bg-muted text-muted-foreground"
                  }`}>
                    {site.status === "published" ? "Published" : "Draft"}
                  </span>
                </div>
              </div>
            </Link>
          ))}

          {/* Create new site card */}
          <Link to="/dashboard/create">
            <div className="rounded-xl border-2 border-dashed border-border bg-card/50 flex flex-col items-center justify-center h-full min-h-[240px] hover:border-primary/40 transition-colors cursor-pointer">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-background mb-3">
                <Plus className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">Create new site</p>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
};

export default AllSitesPage;
