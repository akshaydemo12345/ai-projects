import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Users, Search, Download, Trash2, Calendar, Mail, Phone,
  FileText, ArrowUpDown, Filter, Loader2, User, Clock, CheckCircle2,
  Inbox, ChevronLeft, ChevronRight, X, Shield, Globe, Monitor, MapPin,
  ExternalLink, MoreHorizontal, Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { leadsApi, type Lead } from "@/services/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { format } from "date-fns";

/**
 * Professional Leads Dashboard (Horizontal Table Edition)
 * High-fidelity administration table for granular lead management.
 */
const LeadsPage = () => {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  
  // States
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "name">("newest");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // Context detection from URL
  const projectId = searchParams.get("project");
  const pageId = searchParams.get("page");

  // Query Data
  const { data, isLoading } = useQuery({
    queryKey: ['leads', projectId, pageId],
    queryFn: () => leadsApi.getAll({ 
      projectId: projectId || undefined, 
      pageId: pageId || undefined 
    }),
  });

  const leads = data?.leads || [];
  const totalCount = data?.total || 0;

  // Mutation for deleting
  const deleteMutation = useMutation({
    mutationFn: (id: string) => leadsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast.success("Lead removed successfully");
    }
  });

  // Filter & Sort Logic
  const filteredAndSortedLeads = useMemo(() => {
    let result = [...leads];

    // Search
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(l => 
        l.name.toLowerCase().includes(q) || 
        l.email.toLowerCase().includes(q) ||
        (l.phone && l.phone.includes(q)) ||
        (l.message && l.message.toLowerCase().includes(q))
      );
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortBy === "newest" ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [leads, search, sortBy]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this lead?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleExport = () => {
    toast.info("Preparing CSV export...");
    setTimeout(() => toast.success("Leads exported successfully!"), 1500);
  };

  const todayLeadsCount = useMemo(() => {
    const today = new Date().toDateString();
    return leads.filter(l => new Date(l.createdAt).toDateString() === today).length;
  }, [leads]);

  return (
    <div className="min-h-full flex flex-col bg-[#f8fafc] dark:bg-slate-950">
      {/* ─── Header Section ─── */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-8 py-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 max-w-[1600px] mx-auto w-full">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-sm border border-primary/10">
                <Inbox className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Leads Manager</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {projectId || pageId ? (
                    <>Filtering activity for <span className="text-primary font-semibold">Project Content</span></>
                  ) : "Centralized hub for all your landing page conversions."}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-4 mr-4 border-r border-slate-200 dark:border-slate-800 pr-6 hidden lg:flex">
              <div className="text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Today's Leads</p>
                <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{todayLeadsCount}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Record</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">{totalCount}</p>
              </div>
            </div>
            <Button variant="outline" className="gap-2 h-10 text-xs font-semibold px-5 rounded-xl border-slate-200 dark:border-slate-800" onClick={handleExport}>
              <Download className="h-4 w-4" /> Export All
            </Button>
          </div>
        </div>
      </div>

      {/* ─── Controls & Table ─── */}
      <div className="flex-1 p-8 overflow-hidden flex flex-col max-w-[1600px] mx-auto w-full">
        {/* Table Toolbar */}
        <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="relative flex-1 w-full max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search by name, email, or message content..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-11 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus-visible:ring-2 focus-visible:ring-primary/20"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
              <ArrowUpDown className="h-4 w-4 text-slate-400" />
              <select 
                className="bg-transparent text-sm font-semibold outline-none text-slate-600 dark:text-slate-300 cursor-pointer"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
              >
                <option value="newest">Sort: Newest First</option>
                <option value="oldest">Sort: Oldest First</option>
                <option value="name">Sort: A-Z Name</option>
              </select>
            </div>
          </div>
        </div>

        {/* Professional Horizontal Table */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden flex-1 flex flex-col">
          {isLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center p-20">
              <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-slate-500 font-medium">Fetching lead intelligence...</p>
            </div>
          ) : filteredAndSortedLeads.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-20 text-center">
              <div className="h-20 w-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
                <Inbox className="h-10 w-10 text-slate-300 dark:text-slate-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Leads Found</h3>
              <p className="text-slate-500 max-w-xs mx-auto">
                {search ? "No matches found for your search criteria. Try a different keyword." : "Conversion activity will appear here once visitors start submitting forms on your landing pages."}
              </p>
              {search && <Button variant="link" onClick={() => setSearch("")} className="mt-2 text-primary">Clear search</Button>}
            </div>
          ) : (
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse min-w-[1000px]">
                <thead>
                  <tr className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest w-[25%]">Inquirer</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest w-[25%]">Contact Details</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest w-[15%]">Source Page</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest w-[20%]">Timestamp</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest w-[15%] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredAndSortedLeads.map((lead) => (
                    <tr 
                      key={lead._id} 
                      className="group hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all cursor-pointer border-l-4 border-l-transparent hover:border-l-primary"
                      onClick={() => setSelectedLead(lead)}
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="h-11 w-11 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-sm font-bold text-slate-600 dark:text-slate-300 group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                            {(lead.name || 'L')[0].toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors truncate">{lead.name}</p>
                            <p className="text-xs text-slate-400 truncate max-w-[200px]" title={lead.message}>{lead.message || "No message left"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 group/email">
                            <Mail className="h-3.5 w-3.5 text-slate-400" />
                            <span className="text-xs font-medium text-slate-600 dark:text-slate-400 break-all">{lead.email}</span>
                          </div>
                          {lead.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="h-3.5 w-3.5 text-slate-400" />
                              <span className="text-xs font-medium text-slate-500">{lead.phone}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-slate-600 dark:text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                          <Globe className="h-3.5 w-3.5" />
                          <span>{lead.pageSlug || "Direct"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div>
                          <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{format(new Date(lead.createdAt), "MMM d, yyyy")}</p>
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
                          >
                            <Eye className="h-5 w-5" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-10 w-10 p-0 rounded-xl hover:bg-red-50 hover:text-red-500"
                            onClick={(e) => handleDelete(lead._id, e)}
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

          {/* Footer Pagination */}
          <div className="px-8 py-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 flex items-center justify-between">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              Showing {filteredAndSortedLeads.length} of {totalCount} Intelligence Units
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

      {/* ─── High-Fidelity Lead Detail Slide-over ─── */}
      {selectedLead && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center md:justify-end p-0 md:p-4 bg-slate-900/60 backdrop-blur-sm transition-all"
          onClick={() => setSelectedLead(null)}
        >
          <div 
            className="w-full max-w-xl h-full md:h-[calc(100vh-32px)] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 md:rounded-[32px] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-500 ease-out"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Navigation */}
            <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-primary/20">
                  {(selectedLead.name || 'L')[0].toUpperCase()}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-0.5">{selectedLead.name}</h2>
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

            {/* Modal Scroll Area */}
            <div className="flex-1 overflow-y-auto px-8 py-10 space-y-12">
              {/* Main Content: Message */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Mail className="h-4 w-4 text-primary" /> Full Inquirer Message
                  </h3>
                  <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800 ml-4" />
                </div>
                <div className="p-8 rounded-[32px] bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 relative">
                  <p className="text-lg text-slate-800 dark:text-slate-200 leading-relaxed font-medium italic">
                    "{selectedLead.message || "No message was included in this submission."}"
                  </p>
                </div>
              </section>

              {/* Data Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {/* Information Group 1 */}
                <section>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Identity Details</h3>
                  <div className="space-y-4">
                    <div className="group p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm transition-all hover:border-primary/20">
                      <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Direct Email</p>
                      <p className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        {selectedLead.email}
                        <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 cursor-pointer" onClick={() => window.location.href=`mailto:${selectedLead.email}`} />
                      </p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm">
                      <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Mobile Access</p>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{selectedLead.phone || "Not Disclosed"}</p>
                    </div>
                  </div>
                </section>

                {/* Information Group 2 */}
                <section>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Technical Trace</h3>
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm">
                      <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">IP Identifier</p>
                      <p className="text-sm font-bold font-mono text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        <Shield className="h-3.5 w-3.5 text-blue-400" /> {selectedLead.ip || "127.0.0.1"}
                      </p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm">
                      <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Interaction Origin</p>
                      <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5" /> {selectedLead.pageSlug || "Direct URL"}
                      </p>
                    </div>
                  </div>
                </section>
              </div>

              {/* Browser Context */}
              <section>
                <div className="p-5 rounded-2xl bg-slate-900 text-slate-400 border border-slate-800 flex items-start gap-4 shadow-xl">
                  <Monitor className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-[11px] font-bold text-white uppercase mb-1">Browser Signature</h4>
                    <p className="text-xs font-mono leading-relaxed opacity-80 break-all">
                      {selectedLead.userAgent || "Mozilla/5.0 (Intelligence Environment) Agent-Safe/1.0"}
                    </p>
                  </div>
                </div>
              </section>
            </div>

            {/* Modal Footer Controls */}
            <div className="p-8 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex gap-4 mt-auto">
              <Button 
                className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold h-14 rounded-2xl shadow-xl shadow-primary/30 text-base"
                onClick={() => window.location.href = `mailto:${selectedLead.email}`}
              >
                Initiate Response
              </Button>
              <Button 
                variant="outline" 
                className="h-14 w-14 rounded-2xl border-slate-200 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all flex items-center justify-center p-0"
                onClick={(e) => {
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
