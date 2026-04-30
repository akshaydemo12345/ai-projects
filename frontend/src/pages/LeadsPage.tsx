import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Search, Download, Trash2, Mail, Phone,
  FileText, ArrowUpDown, Filter, Loader2, Clock, CheckCircle2,
  Inbox, ChevronLeft, ChevronRight, X, Shield, Globe, MapPin,
  ExternalLink, Eye, ChevronDown, Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { leadsApi, projectsApi, pagesApi, type Lead } from "@/services/api";
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
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

  // ── Sync URL params to state ──────────────────────────────────────────────
  useEffect(() => {
    const project = searchParams.get("project") || "";
    const pageParam = searchParams.get("page") || "";
    
    // Only update if they differ from current state to avoid infinite loops
    if (project !== filterProjectId) {
      setFilterProjectId(project);
    }
    if (pageParam !== filterPageId) {
      setFilterPageId(pageParam);
    }
  }, [searchParams]);

  // ── Other filters ─────────────────────────────────────────────────────────
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filterUtmSource, setFilterUtmSource] = useState("");
  const [filterUtmMedium, setFilterUtmMedium] = useState("");
  const [filterUtmCampaign, setFilterUtmCampaign] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "name">("newest");
  const [page, setPage] = useState(1);
  const pageSize = 5;
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

  // ── Unique UTM filters list ──────────────────────────────────────────────
  const { data: leadFilters } = useQuery({
    queryKey: ["lead-filters", filterProjectId],
    queryFn: () => leadsApi.getFilters(filterProjectId || undefined),
  });

  // ── Leads data ────────────────────────────────────────────────────────────
  const { data, isLoading } = useQuery({
    queryKey: ["leads", filterPageId, filterProjectId, search, startDate, endDate, filterUtmSource, filterUtmMedium, filterUtmCampaign, page, sortBy],
    queryFn: () =>
      leadsApi.getAll({
        projectId: filterProjectId || undefined,
        pageId: filterPageId || undefined,
        search: search || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        utmSource: filterUtmSource || undefined,
        utmMedium: filterUtmMedium || undefined,
        utmCampaign: filterUtmCampaign || undefined,
        page,
        limit: pageSize,
        sortBy
      }),
    placeholderData: keepPreviousData,
  });

  // Reset to first page when any filter changes
  useEffect(() => {
    setPage(1);
  }, [filterProjectId, filterPageId, search, startDate, endDate, filterUtmSource, filterUtmMedium, filterUtmCampaign, sortBy]);

  const leads = data?.leads || [];
  const totalCount = data?.total || 0;
  const formSchema = data?.formSchema;


  // ── Delete mutation ───────────────────────────────────────────────────────
  const deleteMutation = useMutation({
    mutationFn: (id: string) => leadsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      toast.success("Lead removed successfully");
    },
  });

  // ── Field helper ──────────────────────────────────────────────────────────
  const getLField = (l: any, field: string) => {
    const lowerField = field.toLowerCase();

    // Check root first (flattened)
    if (field === "name") {
      const val = l["Full Name"] || l.full_name || l.name || l.fullname || l.first_name || (l.data?.full_name || l.data?.name || l.data?.fullname || l.data?.first_name || "");
      if (val) return val;
    }
    if (field === "email") {
      const val = l["Email Address"] || l.email || l.email_address || l.user_email || (l.data?.email || l.data?.user_email || l.data?.e_mail || l.data?.contact_email || "");
      if (val) return val;
    }
    if (field === "phone") {
      const val = l["Phone Number"] || l.phone || l.phone_number || l.tel || l.mobile || l.mobile_number || (l.data?.phone || l.data?.tel || l.data?.mobile || "");
      if (val) return val;
    }
    if (field === "message") {
      const val = l.message || l.Message || l.comments || l.comment || (l.data?.message || l.data?.comments || "");
      if (val) return val;
    }
    return "";
  };

  /**
   * Discovers all contact related fields to stack them in the table
   */
  const getStackedContacts = (l: any) => {
    const emails = new Set<string>();
    const phones = new Set<string>();

    const extract = (obj: any) => {
      if (!obj) return;
      Object.entries(obj).forEach(([key, value]) => {
        if (!value || typeof value !== 'string') return;
        const k = key.toLowerCase().replace(/_/g, "");
        if (k.includes("email")) emails.add(value);
        else if (k.includes("phone") || k.includes("mobile") || k.includes("tel") || k.includes("contact")) {
          // Avoid adding names that might have "contact" in them
          if (value.match(/[0-9]/)) phones.add(value);
        }
      });
    };

    // Extract from top level and data level
    extract(l);
    extract(l.data);

    return {
      emails: Array.from(emails),
      phones: Array.from(phones)
    };
  };

  // ── Sort ──────────────────────────────────────────────────────────────────
  // Now handled by backend pagination. We just use the leads directly.
  const filteredAndSortedLeads = leads;

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
        utmSource: filterUtmSource || undefined,
        utmMedium: filterUtmMedium || undefined,
        utmCampaign: filterUtmCampaign || undefined,
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

  const todayLeadsCount = data?.todayCount || 0;

  const selectedProjectName = (projects as any[]).find((p: any) => p._id === filterProjectId)?.name;
  const hasActiveFilters = !!(filterProjectId || filterPageId || search || startDate || endDate || filterUtmSource || filterUtmMedium || filterUtmCampaign);

  const clearFilters = () => {
    setFilterProjectId("");
    setFilterPageId("");
    setSearch("");
    setStartDate("");
    setEndDate("");
    setFilterUtmSource("");
    setFilterUtmMedium("");
    setFilterUtmCampaign("");
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
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Leads Management</h1>
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
            <div className="flex items-center gap-4 mr-4 border-r border-slate-200 dark:border-slate-800 pr-6 hidden sm:flex">
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
                className="gap-2 h-10 text-xs font-semibold px-4 sm:px-5 rounded-xl border-slate-200 dark:border-slate-800 w-full sm:w-auto"
                onClick={() => setExportMenuOpen(v => !v)}
                disabled={isExporting}
              >
                {isExporting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                <span className="hidden xs:inline">{isExporting ? "Exporting…" : "Export CSV"}</span>
                <span className="xs:hidden">{isExporting ? "…" : "Export"}</span>
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
      <div className="flex-1 p-4 md:p-8 overflow-hidden flex flex-col w-full">

        {/* Toolbar */}
        <div className="mb-6 flex flex-wrap items-center gap-2.5 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm w-full lg:w-fit max-w-full">

          {/* Search */}
          <div className="relative w-full sm:w-[220px] shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search leads..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 h-10 w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus-visible:ring-2 focus-visible:ring-primary/20 text-sm shadow-inner"
            />
          </div>

          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-0.5 hidden md:block" />

          {/* Project dropdown */}
          <Select value={filterProjectId || "all"} onValueChange={(val) => {
            setFilterProjectId(val === "all" ? "" : val);
            setFilterPageId("");
          }}>
            <SelectTrigger className="flex-1 sm:flex-none h-10 bg-slate-50 dark:bg-slate-800 px-3 rounded-xl border border-slate-100 dark:border-slate-800 transition-colors hover:border-slate-300 min-w-[140px] w-auto text-sm font-medium focus:ring-0 focus:ring-offset-0">
              <div className="flex items-center gap-2">
                <Filter className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <SelectValue placeholder="All Projects" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              {(projects as any[]).map((p: any) => (
                <SelectItem key={p._id} value={p._id}>{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Page dropdown */}
          <Select
            value={filterPageId || "all"}
            onValueChange={(val) => setFilterPageId(val === "all" ? "" : val)}
            disabled={!filterProjectId}
          >
            <SelectTrigger
              className={`flex-1 sm:flex-none h-10 px-3 rounded-xl border transition-all min-w-[140px] w-auto text-sm font-medium focus:ring-0 focus:ring-offset-0 ${filterProjectId
                ? "bg-slate-50 dark:bg-slate-800 border-slate-100 hover:border-slate-300 dark:border-slate-800"
                : "bg-slate-50/50 dark:bg-slate-800/50 border-dashed border-slate-200 dark:border-slate-700 opacity-60 pointer-events-none text-slate-400"
                }`}
            >
              <div className="flex items-center gap-2">
                <Globe className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <SelectValue placeholder={filterProjectId ? "All Pages" : "Select project"} />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Pages</SelectItem>
              {(projectPages as any[]).map((pg: any) => (
                <SelectItem key={pg._id} value={pg._id}>
                  {pg.name || pg.slug}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* UTM Source dropdown */}
          <Select value={filterUtmSource || "all"} onValueChange={(val) => setFilterUtmSource(val === "all" ? "" : val)}>
            <SelectTrigger className="flex-1 sm:flex-none h-10 bg-slate-50 dark:bg-slate-800 px-3 rounded-xl border border-slate-100 dark:border-slate-800 transition-colors hover:border-slate-300 min-w-[130px] w-auto text-sm font-medium focus:ring-0 focus:ring-offset-0">
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <SelectValue placeholder="Any Source" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Source</SelectItem>
              {leadFilters?.utmSources.map((s: string) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* UTM Medium dropdown */}
          <Select value={filterUtmMedium || "all"} onValueChange={(val) => setFilterUtmMedium(val === "all" ? "" : val)}>
            <SelectTrigger className="flex-1 sm:flex-none h-10 bg-slate-50 dark:bg-slate-800 px-3 rounded-xl border border-slate-100 dark:border-slate-800 transition-colors hover:border-slate-300 min-w-[130px] w-auto text-sm font-medium focus:ring-0 focus:ring-offset-0">
              <div className="flex items-center gap-2">
                <Globe className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <SelectValue placeholder="Any Medium" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Medium</SelectItem>
              {leadFilters?.utmMediums.map((s: string) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort dropdown */}
          <Select value={sortBy} onValueChange={(val) => setSortBy(val as any)}>
            <SelectTrigger className="flex-1 sm:flex-none h-10 bg-slate-50 dark:bg-slate-800 px-3 rounded-xl border border-slate-100 dark:border-slate-800 transition-colors hover:border-slate-300 min-w-[130px] w-auto text-sm font-medium focus:ring-0 focus:ring-offset-0">
              <div className="flex items-center gap-2">
                <ArrowUpDown className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="name">A-Z Name</SelectItem>
            </SelectContent>
          </Select>

          {/* Clear */}
          {hasActiveFilters && (
            <button
              className="flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-red-500 transition-colors px-4 py-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/20 border border-transparent hover:border-red-100 shrink-0"
              onClick={clearFilters}
            >
              <X className="h-3.5 w-3.5" />
              <span className="hidden xs:inline">Clear Filters</span>
              <span className="xs:hidden">Clear</span>
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
            <div className="flex-1 overflow-y-auto max-h-[600px] custom-scrollbar">
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="sticky top-0 z-10 bg-slate-50 dark:bg-slate-800 shadow-sm">
                    <tr className="border-b border-slate-200 dark:border-slate-800">
                      <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Full Name</th>
                      <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Email</th>
                      <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Phone</th>
                      <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Date</th>
                      <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest w-[100px] text-right sticky right-0 bg-slate-50 dark:bg-slate-800 z-20 shadow-[-10px_0_15px_-3px_rgba(0,0,0,0.05)]">Action</th>
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
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="space-y-1">
                            {getStackedContacts(lead).emails.map((email, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <Mail className="h-3 w-3 text-slate-400 shrink-0" />
                                <span className="text-xs font-medium text-slate-600 dark:text-slate-400 break-all">
                                  {email}
                                </span>
                              </div>
                            ))}
                            {getStackedContacts(lead).emails.length === 0 && (
                              <span className="text-xs text-slate-400 italic">No email</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="space-y-1">
                            {getStackedContacts(lead).phones.map((phone, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <Phone className="h-3 w-3 text-slate-400 shrink-0" />
                                <span className="text-xs font-medium text-slate-500">{phone}</span>
                              </div>
                            ))}
                            {getStackedContacts(lead).phones.length === 0 && (
                              <span className="text-xs text-slate-400 italic">No phone</span>
                            )}
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
                        <td className="px-6 py-5 text-right sticky right-0 bg-white dark:bg-slate-900 z-10 group-hover:bg-slate-50 dark:group-hover:bg-slate-800 transition-colors shadow-[-10px_0_15px_-3px_rgba(0,0,0,0.05)]">
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

              {/* Mobile Card View */}
              <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800">
                {filteredAndSortedLeads.map(lead => (
                  <div
                    key={lead._id}
                    className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all cursor-pointer"
                    onClick={() => setSelectedLead(lead)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
                          {(getLField(lead, "name").toString() || "L")[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white">
                            {getLField(lead, "name") || "Lead User"}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            {format(new Date(lead.createdAt), "MMM d, h:mm a")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 rounded-lg"
                          onClick={e => { e.stopPropagation(); setSelectedLead(lead); }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 rounded-lg hover:text-red-500"
                          onClick={e => handleDelete(lead._id, e)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Contact</p>
                        <div className="space-y-1.5">
                          {getStackedContacts(lead).emails.slice(0, 2).map((email, idx) => (
                            <div key={idx} className="flex items-center gap-1.5">
                              <Mail className="h-3 w-3 text-slate-400 shrink-0" />
                              <p className="text-xs text-slate-600 dark:text-slate-400 truncate font-medium">{email}</p>
                            </div>
                          ))}
                          {getStackedContacts(lead).phones.slice(0, 1).map((phone, idx) => (
                            <div key={idx} className="flex items-center gap-1.5">
                              <Phone className="h-3 w-3 text-slate-400 shrink-0" />
                              <p className="text-xs text-slate-500 font-medium">{phone}</p>
                            </div>
                          ))}
                          {getStackedContacts(lead).emails.length === 0 && getStackedContacts(lead).phones.length === 0 && (
                            <p className="text-[11px] text-slate-400 italic">No contact details</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="px-4 sm:px-8 py-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center sm:text-left">
              Showing {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, totalCount)} of {totalCount} records
              {hasActiveFilters && (
                <span className="ml-2 text-primary normal-case font-normal">(filtered)</span>
              )}
            </p>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                className="h-10 rounded-xl flex-1 sm:flex-none sm:min-w-[100px] border-slate-200 dark:border-slate-800 bg-white"
                disabled={page === 1 || isLoading}
                onClick={() => setPage(p => Math.max(1, p - 1))}
              >
                <ChevronLeft className="h-4 w-4 mr-1 sm:mr-2" /> Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-10 rounded-xl flex-1 sm:flex-none sm:min-w-[100px] border-slate-200 dark:border-slate-800 bg-white"
                disabled={page * pageSize >= totalCount || isLoading}
                onClick={() => setPage(p => p + 1)}
              >
                Next <ChevronRight className="h-4 w-4 ml-1 sm:ml-2" />
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
                    <Mail className="h-4 w-4 text-primary" /> Full Message
                  </h3>
                  <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800 ml-4" />
                </div>
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border-l-4 border-primary/30 shadow-sm">
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {getLField(selectedLead, "message")}
                  </p>
                </div>
              </section>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <section>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Identity Details</h3>
                  <div className="space-y-4">
                    <div className="group p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm hover:border-primary/20 transition-all">
                      <p className="text-[10px] text-slate-400 uppercase font-bold mb-2">Contact Emails</p>
                      <div className="space-y-2">
                        {getStackedContacts(selectedLead).emails.length > 0 ? (
                          getStackedContacts(selectedLead).emails.map((email, idx) => (
                            <p key={idx} className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 group/item">
                              <Mail className="h-3.5 w-3.5 text-primary/60" />
                              {email}
                              <ExternalLink
                                className="h-3 w-3 opacity-0 group-hover/item:opacity-100 cursor-pointer ml-auto"
                                onClick={() => window.location.href = `mailto:${email}`}
                              />
                            </p>
                          ))
                        ) : (
                          <p className="text-sm font-bold text-slate-400 italic">Not Disclosed</p>
                        )}
                      </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm">
                      <p className="text-[10px] text-slate-400 uppercase font-bold mb-2">Phone Numbers</p>
                      <div className="space-y-2">
                        {getStackedContacts(selectedLead).phones.length > 0 ? (
                          getStackedContacts(selectedLead).phones.map((phone, idx) => (
                            <p key={idx} className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                              <Phone className="h-3.5 w-3.5 text-primary/60" />
                              {phone}
                            </p>
                          ))
                        ) : (
                          <p className="text-sm font-bold text-slate-400 italic">Not Disclosed</p>
                        )}
                      </div>
                    </div>
                  </div>
                </section>
                <section>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Technical Trace</h3>
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm">
                      <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">User IP</p>
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

              {/* UTM / Marketing section */}
              <section className={selectedLead.utm_source ? "block" : "hidden"}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Globe className="h-4 w-4 text-emerald-500" /> Marketing Attribution
                  </h3>
                  <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800 ml-4" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm">
                    <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Source</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white capitalize">{(selectedLead as any).utm_source || "—"}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm">
                    <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Medium</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white capitalize">{(selectedLead as any).utm_medium || "—"}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm">
                    <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Campaign</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white capitalize">{(selectedLead as any).utm_campaign || "—"}</p>
                  </div>
                  {(selectedLead as any).utm_term && (
                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm">
                      <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Term</p>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{(selectedLead as any).utm_term}</p>
                    </div>
                  )}
                  {(selectedLead as any).utm_content && (
                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm">
                      <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Content</p>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{(selectedLead as any).utm_content}</p>
                    </div>
                  )}
                  {((selectedLead as any).gclid || (selectedLead as any).fbclid) && (
                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm">
                      <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Click Identifier</p>
                      <p className="text-xs font-mono text-slate-500 truncate">
                        {(selectedLead as any).gclid ? `GCLID: ${(selectedLead as any).gclid}` : `FBCLID: ${(selectedLead as any).fbclid}`}
                      </p>
                    </div>
                  )}
                </div>
              </section>

              <section>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <FileText className="h-4 w-4 text-amber-500" /> Captured Insights
                  </h3>
                  <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800 ml-4" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(() => {
                    const standardKeys = [
                      "name", "email", "phone", "message", "full_name", "first_name", "last_name",
                      "tel", "mobile", "domain", "pageurl", "path", "timestamp", "utm_source",
                      "utm_medium", "utm_campaign", "gclid", "fbclid", "msclkid", "_id", "projectId", "pageId",
                      "pageSlug", "createdAt", "ip", "userAgent", "Full Name", "Email Address", "Phone Number", "data", "utm"
                    ];

                    const shownLabels = new Set<string>();
                    const insights: Array<{ label: string, value: any }> = [];

                    Object.entries(selectedLead).forEach(([key, value]) => {
                      if (!value || key === "data" || key === "utm") return;
                      const lowerK = key.toLowerCase().replace(/_/g, "");

                      // Skip standard keys and contact info (already shown in Identity Details)
                      if (standardKeys.some(sk => sk.toLowerCase().replace(/_/g, "") === lowerK)) return;
                      if (lowerK.includes("email") || lowerK.includes("phone") || lowerK.includes("mobile") || lowerK.includes("tel") || lowerK.includes("contact")) return;

                      const label = key.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
                      if (!shownLabels.has(label)) {
                        shownLabels.add(label);
                        insights.push({ label, value });
                      }
                    });

                    return insights.length > 0 ? (
                      insights.map((item, idx) => (
                        <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700">
                          <p className="text-[10px] text-slate-400 uppercase font-extrabold mb-1">{item.label}</p>
                          <p className="text-sm font-bold text-slate-900 dark:text-white capitalize">{String(item.value || "—")}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400 italic col-span-2">No additional custom fields were captured.</p>
                    );
                  })()}
                </div>
              </section>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default LeadsPage;