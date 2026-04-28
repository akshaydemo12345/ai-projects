import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Search, Download, Trash2, Mail, Phone,
  FileText, ArrowUpDown, Filter, Loader2, Clock, CheckCircle2,
  Inbox, ChevronLeft, ChevronRight, X, Shield, Globe, MapPin,
  ExternalLink, Eye, ChevronDown, Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { leadsApi, projectsApi, pagesApi, type Lead } from "@/services/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { format } from "date-fns";

/**
 * Professional Leads Dashboard
 * - Project pre-selection from URL when redirected from ProjectDetailPage
 * - Pages dropdown loads pages filtered by the selected project
 * - Export split: "Export All" (no filters) vs "Export Filtered" (current filters)
 */
const LeadsPage = () => {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();

  // ── URL param pre-fill ────────────────────────────────────────────────────
  const [filterProjectId, setFilterProjectId] = useState<string>(
    searchParams.get("project") || ""
  );
  const [filterPageId, setFilterPageId] = useState<string>(
    searchParams.get("page") || ""
  );

  // ── Other filters ─────────────────────────────────────────────────────────
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "name">("newest");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // ── Projects list ─────────────────────────────────────────────────────────
  const { data: projects = [] } = useQuery({
    queryKey: ["projects"],
    queryFn: projectsApi.getAll,
  });

  // ── Pages list (filtered by selected project) ─────────────────────────────
  const { data: projectPages = [] } = useQuery({
    queryKey: ["pages-for-filter", filterProjectId],
    queryFn: () =>
      filterProjectId
        ? pagesApi.getPagesByProject(filterProjectId)
        : Promise.resolve([]),
    enabled: !!filterProjectId,
  });

  // ── Leads data ────────────────────────────────────────────────────────────
  const { data, isLoading } = useQuery({
    queryKey: ["leads", filterPageId, filterProjectId, search, startDate, endDate],
    queryFn: () =>
      leadsApi.getAll({
        projectId: filterProjectId || undefined,
        pageId: filterPageId || undefined,
        search: search || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      }),
  });

  const leads = data?.leads || [];
  const totalCount = data?.total || 0;
  const formSchema = data?.formSchema;

  // ── Dynamic column discovery ──────────────────────────────────────────────
  const dynamicTableFields = useMemo(() => {
    const keysSet = new Set<string>();
    const keyToLabel: Record<string, string> = {};

    if (formSchema?.fields) {
      formSchema.fields.forEach((f: any) => {
        if (f.field_name) {
          keysSet.add(f.field_name);
          keyToLabel[f.field_name] = f.label;
        }
      });
    }

    leads.forEach((l: any) => {
      if (l.data) Object.keys(l.data).forEach(k => { if (!keysSet.has(k)) keysSet.add(k); });
    });

    const standardKeys = [
      "name", "email", "phone", "message", "full_name", "first_name", "last_name",
      "tel", "mobile", "domain", "pageurl", "path", "timestamp", "utm_source",
      "utm_medium", "utm_campaign", "gclid", "_id", "projectId", "pageId",
      "pageSlug", "createdAt", "ip", "userAgent", "Full Name", "Email Address", "Phone Number",
    ];

    return Array.from(keysSet)
      .filter(k => !standardKeys.includes(k) && !standardKeys.includes(k.toLowerCase()))
      .map(k => ({
        field_name: k,
        label: keyToLabel[k] || k.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
      }));
  }, [formSchema, leads]);

  // ── Delete mutation ───────────────────────────────────────────────────────
  const deleteMutation = useMutation({
    mutationFn: (id: string) => leadsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      toast.success("Lead removed successfully");
    },
  });

  // ── Field helper ──────────────────────────────────────────────────────────
  const getLField = (l: any, field: string): string => {
    if (field === "name") {
      const val = l["Full Name"] || l.full_name || l.name || l.fullname || l.first_name;
      if (val) return val;
    }
    if (field === "email") {
      const val = l["Email Address"] || l.email || l.email_address || l.user_email;
      if (val) return val;
    }
    if (field === "phone") {
      const val = l["Phone Number"] || l.phone || l.phone_number || l.tel;
      if (val) return val;
    }
    if (l[field] !== undefined) return l[field];
    if (l.data) {
      if (field === "name") return l.data.full_name || l.data.name || l.data.fullname || l.data.first_name || "";
      if (field === "email") return l.data.email || l.data.user_email || l.data.e_mail || l.data.contact_email || "";
      if (field === "phone") return l.data.phone || l.data.tel || l.data.mobile || "";
      if (l.data[field]) return l.data[field];
    }
    return "";
  };

  // ── Sort ──────────────────────────────────────────────────────────────────
  const filteredAndSortedLeads = useMemo(() => {
    const result = [...leads];
    result.sort((a, b) => {
      if (sortBy === "name")
        return getLField(a, "name").toString().localeCompare(getLField(b, "name").toString());
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortBy === "newest" ? dateB - dateA : dateA - dateB;
    });
    return result;
  }, [leads, sortBy]);

  // ── Export helpers ────────────────────────────────────────────────────────
  const triggerDownload = (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  const handleExportFiltered = async () => {
    try {
      setIsExporting(true);
      setExportMenuOpen(false);
      const blob = await leadsApi.export({
        projectId: filterProjectId || undefined,
        pageId: filterPageId || undefined,
        search: search || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      });
      triggerDownload(blob, `leads_filtered_${format(new Date(), "yyyy-MM-dd")}.csv`);
      toast.success("Filtered leads exported successfully");
    } catch (err) {
      console.error("Export error:", err);
      toast.error("Failed to generate CSV export");
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportAll = async () => {
    try {
      setIsExporting(true);
      setExportMenuOpen(false);
      const blob = await leadsApi.export({});   // no filters → all leads
      triggerDownload(blob, `leads_all_${format(new Date(), "yyyy-MM-dd")}.csv`);
      toast.success("All leads exported successfully");
    } catch (err) {
      console.error("Export error:", err);
      toast.error("Failed to generate CSV export");
    } finally {
      setIsExporting(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this lead?")) {
      deleteMutation.mutate(id);
    }
  };

  const todayLeadsCount = useMemo(() => {
    const today = new Date().toDateString();
    return leads.filter(l => new Date(l.createdAt).toDateString() === today).length;
  }, [leads]);

  const selectedProjectName = (projects as any[]).find((p: any) => p._id === filterProjectId)?.name;
  const hasActiveFilters = !!(filterProjectId || filterPageId || search || startDate || endDate);

  const clearFilters = () => {
    setFilterProjectId("");
    setFilterPageId("");
    setSearch("");
    setStartDate("");
    setEndDate("");
  };

  return (
    <div className="min-h-full flex flex-col bg-[#f8fafc] dark:bg-slate-950">
      {/* ─── Header ─── */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-8 py-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 w-full">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-sm border border-primary/10">
                <Inbox className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Leads Manager
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {selectedProjectName ? (
                    <>
                      Filtering for{" "}
                      <span className="text-primary font-semibold">{selectedProjectName}</span>
                    </>
                  ) : (
                    "Centralized hub for all your landing page conversions."
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Stats */}
            <div className="flex items-center gap-4 mr-4 border-r border-slate-200 dark:border-slate-800 pr-6 hidden lg:flex">
              <div className="text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Today's Leads</p>
                <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{todayLeadsCount}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Records</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">{totalCount}</p>
              </div>
            </div>

            {/* ── Export Dropdown ── */}
            <div className="relative">
              <Button
                variant="outline"
                className="gap-2 h-10 text-xs font-semibold px-5 rounded-xl border-slate-200 dark:border-slate-800"
                onClick={() => setExportMenuOpen(v => !v)}
                disabled={isExporting}
              >
                {isExporting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                {isExporting ? "Exporting…" : "Export CSV"}
                <ChevronDown className="h-3.5 w-3.5 ml-0.5 opacity-60" />
              </Button>

              {exportMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setExportMenuOpen(false)} />
                  <div className="absolute right-0 mt-2 z-50 w-60 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl overflow-hidden">
                    <button
                      className="w-full flex items-start gap-3 px-4 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800 text-left transition-colors"
                      onClick={handleExportAll}
                    >
                      <Download className="h-4 w-4 mt-0.5 text-slate-500 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">Export All</p>
                        <p className="text-xs text-slate-400 mt-0.5">Download every lead (no filters)</p>
                      </div>
                    </button>
                    <div className="h-px bg-slate-100 dark:bg-slate-800 mx-3" />
                    <button
                      className={`w-full flex items-start gap-3 px-4 py-3.5 text-left transition-colors ${hasActiveFilters
                        ? "hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                        : "opacity-50 cursor-not-allowed"
                        }`}
                      onClick={hasActiveFilters ? handleExportFiltered : undefined}
                    >
                      <Filter className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                      <div>
                        <p className={`text-sm font-semibold ${hasActiveFilters ? "text-slate-900 dark:text-white" : "text-slate-400"}`}>
                          Export Filtered
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {hasActiveFilters
                            ? "Download leads matching current filters"
                            : "Apply filters to enable this option"}
                        </p>
                      </div>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ─── Controls & Table ─── */}
      <div className="flex-1 p-8 overflow-hidden flex flex-col w-full">

        {/* Toolbar */}
        <div className="mb-6 flex flex-wrap items-center gap-3 bg-white dark:bg-slate-900 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm w-fit max-w-full">
          
          {/* Search */}
          <div className="relative w-full sm:w-[260px] shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search leads..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 h-10 w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus-visible:ring-2 focus-visible:ring-primary/20 text-sm shadow-inner"
            />
          </div>

          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-1 hidden sm:block" />

          {/* Project dropdown */}
          <div className="flex flex-1 sm:flex-none items-center gap-2 bg-slate-50 dark:bg-slate-800 px-3 py-2 rounded-xl border border-slate-100 dark:border-slate-800 transition-colors hover:border-slate-300 min-w-[150px]">
            <Filter className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <select
              className="bg-transparent text-sm font-medium outline-none text-slate-700 dark:text-slate-300 cursor-pointer w-full"
              value={filterProjectId}
              onChange={e => {
                setFilterProjectId(e.target.value);
                setFilterPageId(""); // reset page filter when project changes
              }}
            >
              <option value="">All Projects</option>
              {(projects as any[]).map((p: any) => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>
          </div>

          {/* Page dropdown */}
          <div
            className={`flex flex-1 sm:flex-none items-center gap-2 px-3 py-2 rounded-xl border transition-all min-w-[150px] ${filterProjectId
              ? "bg-slate-50 dark:bg-slate-800 border-slate-100 hover:border-slate-300 dark:border-slate-800"
              : "bg-transparent border-transparent opacity-50 pointer-events-none"
              }`}
          >
            <Globe className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <select
              className="bg-transparent text-sm font-medium outline-none text-slate-700 dark:text-slate-300 cursor-pointer w-full"
              value={filterPageId}
              onChange={e => setFilterPageId(e.target.value)}
              disabled={!filterProjectId}
            >
              <option value="">
                {filterProjectId ? "All Pages" : "Select project first"}
              </option>
              {(projectPages as any[]).map((pg: any) => (
                <option key={pg._id} value={pg._id}>
                  {pg.name || pg.slug}
                </option>
              ))}
            </select>
          </div>

          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-1 hidden lg:block" />

          {/* Sort dropdown */}
          <div className="flex flex-1 sm:flex-none items-center gap-2 bg-slate-50 dark:bg-slate-800 px-3 py-2 rounded-xl border border-slate-100 dark:border-slate-800 transition-colors hover:border-slate-300 min-w-[130px]">
            <ArrowUpDown className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <select
              className="bg-transparent text-sm font-medium outline-none text-slate-700 dark:text-slate-300 cursor-pointer w-full"
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name">A-Z Name</option>
            </select>
          </div>

          {/* Clear */}
          {hasActiveFilters && (
            <button
              className="flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-red-500 transition-colors px-3 py-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/20 border border-transparent hover:border-red-100 shrink-0 sm:ml-1"
              onClick={clearFilters}
            >
              <X className="h-3.5 w-3.5" />
              Clear
            </button>
          )}
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden flex-1 flex flex-col">
          {isLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center p-20">
              <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-slate-500 font-medium">Fetching lead intelligence…</p>
            </div>
          ) : filteredAndSortedLeads.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-20 text-center">
              <div className="h-20 w-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
                <Inbox className="h-10 w-10 text-slate-300 dark:text-slate-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Leads Found</h3>
              <p className="text-slate-500 max-w-xs mx-auto">
                {hasActiveFilters
                  ? "No matches for the applied filters. Try adjusting your selection."
                  : "Conversion activity will appear here once visitors start submitting forms on your landing pages."}
              </p>
              {hasActiveFilters && (
                <Button variant="link" onClick={clearFilters} className="mt-2 text-primary">
                  Clear all filters
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto flex-1 overflow-y-auto max-h-[600px] custom-scrollbar">
              <table className="w-full text-left border-collapse min-w-[1000px]">
                <thead className="sticky top-0 z-10 bg-slate-50 dark:bg-slate-800 shadow-sm">
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest w-[20%]">Inquirer</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest w-[20%]">Contact Details</th>
                    {dynamicTableFields.map((field: any) => (
                      <th key={field.field_name} className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest min-w-[150px]">
                        {field.label || field.field_name.replace(/_/g, " ")}
                      </th>
                    ))}
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest w-[12%]">Source Page</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest w-[15%]">Timestamp</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest w-[10%] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredAndSortedLeads.map(lead => (
                    <tr
                      key={lead._id}
                      className="group hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all cursor-pointer border-l-4 border-l-transparent hover:border-l-primary"
                      onClick={() => setSelectedLead(lead)}
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="h-11 w-11 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-sm font-bold text-slate-600 dark:text-slate-300 group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                            {(getLField(lead, "name").toString() || "L")[0].toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors truncate">
                              {getLField(lead, "name") || "Lead User"}
                            </p>
                            <p className="text-xs text-slate-400 truncate max-w-[200px]" title={String(getLField(lead, "message"))}>
                              {getLField(lead, "message") || "No message left"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Mail className="h-3.5 w-3.5 text-slate-400" />
                            <span className="text-xs font-medium text-slate-600 dark:text-slate-400 break-all">
                              {getLField(lead, "email") || "No Email"}
                            </span>
                          </div>
                          {getLField(lead, "phone") && (
                            <div className="flex items-center gap-2">
                              <Phone className="h-3.5 w-3.5 text-slate-400" />
                              <span className="text-xs font-medium text-slate-500">{getLField(lead, "phone")}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      {dynamicTableFields.map((field: any) => (
                        <td key={field.field_name} className="px-6 py-5">
                          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                            {lead.data?.[field.field_name] || lead.data?.[field.field_name.toLowerCase()] || "—"}
                          </span>
                        </td>
                      ))}
                      <td className="px-6 py-5">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-slate-600 dark:text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                          <Globe className="h-3.5 w-3.5" />
                          <span>{lead.pageSlug || "Direct"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div>
                          <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                            {format(new Date(lead.createdAt), "MMM d, yyyy")}
                          </p>
                          <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                            <Clock className="h-3 w-3" /> {format(new Date(lead.createdAt), "h:mm a")}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-10 w-10 p-0 rounded-xl hover:bg-primary/10 hover:text-primary"
                            onClick={e => { e.stopPropagation(); setSelectedLead(lead); }}
                          >
                            <Eye className="h-5 w-5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-10 w-10 p-0 rounded-xl hover:bg-red-50 hover:text-red-500"
                            onClick={e => handleDelete(lead._id, e)}
                          >
                            <Trash2 className="h-5 w-5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Footer */}
          <div className="px-8 py-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 flex items-center justify-between">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              Showing {filteredAndSortedLeads.length} of {totalCount} records
              {hasActiveFilters && (
                <span className="ml-2 text-primary normal-case font-normal">(filtered)</span>
              )}
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-10 rounded-xl min-w-[100px] border-slate-200 dark:border-slate-800 bg-white" disabled>
                <ChevronLeft className="h-4 w-4 mr-2" /> Previous
              </Button>
              <Button variant="outline" size="sm" className="h-10 rounded-xl min-w-[100px] border-slate-200 dark:border-slate-800 bg-white" disabled={filteredAndSortedLeads.length >= totalCount}>
                Next <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Lead Detail Slide-over ─── */}
      {selectedLead && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center md:justify-end p-0 md:p-4 bg-slate-900/60 backdrop-blur-sm transition-all"
          onClick={() => setSelectedLead(null)}
        >
          <div
            className="w-full max-w-xl h-full md:h-[calc(100vh-32px)] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 md:rounded-[32px] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-500 ease-out"
            onClick={e => e.stopPropagation()}
          >
            <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-primary/20">
                  {(getLField(selectedLead, "name").toString() || "L")[0].toUpperCase()}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-0.5">
                    {getLField(selectedLead, "name") || "Lead Detail"}
                  </h2>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    <span>Verified Inquiry • {format(new Date(selectedLead.createdAt), "MMM d, yyyy")}</span>
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full h-11 w-11 hover:bg-slate-100 transition-colors border-slate-100"
                onClick={() => setSelectedLead(null)}
              >
                <X className="h-5 w-5 text-slate-500" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto px-8 pb-10 space-y-12">
              <section className={getLField(selectedLead, "message") ? "block" : "hidden"}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Mail className="h-4 w-4 text-primary" /> Full Inquirer Message
                  </h3>
                  <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800 ml-4" />
                </div>
                <div className="p-8 rounded-[32px] bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 shadow-inner">
                  <p className="text-lg text-slate-800 dark:text-slate-200 leading-relaxed font-semibold italic">
                    "{getLField(selectedLead, "message")}"
                  </p>
                </div>
              </section>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <section>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Identity Details</h3>
                  <div className="space-y-4">
                    <div className="group p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm hover:border-primary/20 transition-all">
                      <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Email</p>
                      <p className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        {getLField(selectedLead, "email") || "Not Disclosed"}
                        <ExternalLink
                          className="h-3 w-3 opacity-0 group-hover:opacity-100 cursor-pointer"
                          onClick={() => {
                            const email = getLField(selectedLead, "email");
                            if (email) window.location.href = `mailto:${email}`;
                          }}
                        />
                      </p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm">
                      <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Phone</p>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        {getLField(selectedLead, "phone") || "Not Disclosed"}
                      </p>
                    </div>
                  </div>
                </section>
                <section>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Technical Trace</h3>
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm">
                      <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">IP Identifier</p>
                      <p className="text-sm font-bold font-mono text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        <Shield className="h-3.5 w-3.5 text-blue-400" />
                        {selectedLead.meta?.ip || selectedLead.ip || "Unknown"}
                      </p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm">
                      <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Origin Page</p>
                      <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5" /> {selectedLead.pageSlug || "Direct URL"}
                      </p>
                    </div>
                  </div>
                </section>
              </div>

              <section>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <FileText className="h-4 w-4 text-amber-500" /> Captured Insights
                  </h3>
                  <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800 ml-4" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {selectedLead.data && Object.keys(selectedLead.data).length > 0 ? (
                    Object.entries(selectedLead.data)
                      .filter(([key]) => !["name", "email", "phone", "message"].includes(key))
                      .map(([key, value]) => (
                        <div key={key} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700">
                          <p className="text-[10px] text-slate-400 uppercase font-extrabold mb-1">{key.replace(/_/g, " ")}</p>
                          <p className="text-sm font-bold text-slate-900 dark:text-white capitalize">{String(value || "N/A")}</p>
                        </div>
                      ))
                  ) : (
                    <p className="text-xs text-slate-400 italic col-span-2">No additional custom fields were captured.</p>
                  )}
                </div>
              </section>
            </div>

            <div className="p-8 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex gap-4 mt-auto">
              <Button
                className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold h-14 rounded-2xl shadow-xl shadow-primary/30 text-base"
                onClick={() => {
                  const email = getLField(selectedLead, "email");
                  if (email) window.location.href = `mailto:${email}`;
                }}
              >
                Initiate Response
              </Button>
              <Button
                variant="outline"
                className="h-14 w-14 rounded-2xl border-slate-200 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all flex items-center justify-center p-0"
                onClick={e => {
                  handleDelete(selectedLead._id, e);
                  setSelectedLead(null);
                }}
              >
                <Trash2 className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadsPage;