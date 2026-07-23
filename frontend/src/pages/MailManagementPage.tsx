import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { CheckCircle2, Settings2, HelpCircle, Globe } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  getAdminNotifConfig, saveAdminNotifConfig, AdminNotifConfig,
  getUserAutoReplyConfig, saveUserAutoReplyConfig, UserAutoReplyConfig,
} from "@/lib/emailService";

// ─── Field Row ────────────────────────────────────────────
const Field = ({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) => (
  <div className="pb-4 last:border-0 last:pb-0">
    <div className="flex items-center gap-1.5 mb-1.5">
      <label className="text-sm font-semibold text-foreground/90">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {hint && (
        <span title={hint} className="cursor-help">
          <HelpCircle className="h-3.5 w-3.5 text-muted-foreground/60" />
        </span>
      )}
    </div>
    {children}
  </div>
);


// ─── Toggle Switch ────────────────────────────────────────
const Toggle = ({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className={`relative inline-flex h-5 w-10 items-center rounded-full transition-all duration-300 ${checked ? "bg-emerald-500 shadow-[0_0_10px_-2px_rgba(16,185,129,0.5)]" : "bg-muted-foreground/20"
      }`}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-300 ${checked ? "translate-x-5" : "translate-x-1"
        }`}
    />
  </button>
);



// ─── Notification Panel ───────────────────────────────────
const NotificationPanel = ({
  title,
  enabled,
  onToggle,
  onSave,
  saved,
  children,
}: {
  title: string;
  enabled: boolean;
  onToggle: (v: boolean) => void;
  onSave: () => void;
  saved: boolean;
  children: React.ReactNode;
}) => (
  <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden flex flex-col h-full shadow-sm group">
    {/* Panel Header */}
    <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-5 border-b border-slate-100 dark:border-slate-800/40 bg-slate-50/50 dark:bg-slate-800/10">
      <div className="flex flex-col">
        <p className="text-base font-bold text-slate-900 dark:text-white tracking-tight">{title}</p>
      </div>
      <div className="flex items-center gap-3 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-800">
        <span className={`text-[11px] font-bold uppercase tracking-wider ${enabled ? "text-emerald-500" : "text-muted-foreground/60"}`}>
          {enabled ? "Active" : "Paused"}
        </span>
        <Toggle checked={enabled} onChange={onToggle} />
      </div>
    </div>
    <div className={`px-6 py-6 space-y-5 flex-1 transition-all duration-300 ${!enabled ? "opacity-30 grayscale-[0.5] pointer-events-none scale-[0.995]" : ""}`}>
      {children}
    </div>
    <div className="px-6 py-6 border-t border-slate-100 dark:border-slate-800/40 bg-slate-50/10 mt-auto flex">
      <Button
        className={`w-full h-11 rounded-xl font-bold text-sm tracking-wide transition-all duration-300 shadow-sm ${saved
          ? "bg-emerald-500 hover:bg-emerald-600 text-white translate-y-[-2px] shadow-emerald-500/20"
          : "bg-primary hover:bg-primary/90 text-primary-foreground shadow-primary/10"
          }`}
        onClick={onSave}
      >
        {saved ? (
          <span className="flex items-center justify-center gap-2">
            <CheckCircle2 className="h-4 w-4" /> Changes Applied
          </span>
        ) : (
          "Update Settings"
        )}
      </Button>
    </div>
  </div>
);

// ─── Page ─────────────────────────────────────────────────
const MailManagementPage = () => {
  const [searchParams] = useSearchParams();
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [provider, setProvider] = useState<"brevo" | "smtp">("brevo");
  const [brevoKey, setBrevoKey] = useState("");

  const [adminCfg, setAdminCfg] = useState<AdminNotifConfig>({
    enabled: false, adminEmail: "",
  } as any);
  const [userCfg, setUserCfg] = useState<UserAutoReplyConfig>({
    enabled: false,
    fromName: "", subject: "Thank you for reaching out!",
    bodyHtml: "",
  } as any);

  // Extended fields (stored separately, UI only)
  const [admin, setAdmin] = useState({
    name: "Admin Notification",
    sendToMode: "email",
    sendToEmail: "",
    fromName: "",
    fromEmail: "",
    bcc: "",
    subject: "New Lead Captured",
    templateId: "",
  });
  const [user, setUser] = useState({
    name: "User Notification",
    sendToMode: "field",
    fromName: "",
    fromEmail: "",
    bcc: "",
    subject: "Thank you for reaching out!",
    templateId: "",
  });

  const [savedAdmin, setSavedAdmin] = useState(false);
  const [savedUser, setSavedUser] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setAdminCfg(getAdminNotifConfig());
    setUserCfg(getUserAutoReplyConfig());
    const a = localStorage.getItem("pb_admin_ui");
    if (a) setAdmin(JSON.parse(a));
    const u = localStorage.getItem("pb_user_ui");
    if (u) setUser(JSON.parse(u));

    // Fetch dummy projects
    import("@/services/api").then(({ projectsApi }) => {
      projectsApi.getAll().then((data) => {
        const projs = data || [];
        setProjects(projs);
        const pid = searchParams.get("projectId") || (projs.length > 0 ? projs[0]._id : "");
        if (pid) handleProjectSelect(pid, projs);
        setLoading(false);
      }).catch(() => setLoading(false));
    });
  }, []);

  const handleSaveAdmin = async () => {
    try {
      const { projectsApi } = await import("@/services/api");
      await projectsApi.update(selectedProject, {
        adminNotification: {
          enabled: adminCfg.enabled,
          email: admin.sendToEmail,
          subject: admin.subject,
        },
        fromName: admin.fromName,
        fromEmail: admin.fromEmail,
      });

      saveAdminNotifConfig({ ...adminCfg, adminEmail: admin.sendToEmail }, selectedProject);
      localStorage.setItem(`pb_admin_ui_${selectedProject}`, JSON.stringify(admin));

      setSavedAdmin(true);
      toast.success("Admin email settings saved successfully.");
      setTimeout(() => setSavedAdmin(false), 3000);
    } catch (err) {
      toast.error("Failed to save admin settings.");
    }
  };

  const handleSaveUser = async () => {
    try {
      const { projectsApi } = await import("@/services/api");
      await projectsApi.update(selectedProject, {
        userNotification: {
          enabled: userCfg.enabled,
          subject: user.subject,
          bcc: user.bcc,
        }
      });

      saveUserAutoReplyConfig({
        ...userCfg,
        fromName: user.fromName,
        subject: user.subject,
        bodyHtml: "", // No longer used
      }, selectedProject);

      localStorage.setItem(`pb_user_ui_${selectedProject}`, JSON.stringify(user));

      setSavedUser(true);
      toast.success("User auto-reply settings saved successfully.");
      setTimeout(() => setSavedUser(false), 3000);
    } catch (err) {
      toast.error("Failed to save user settings.");
    }
  };

  const handleSaveProvider = async () => {
    try {
      const { projectsApi } = await import("@/services/api");
      await projectsApi.update(selectedProject, {
        emailProvider: provider,
        brevoKey: brevoKey,
        fromName: admin.fromName,
        fromEmail: admin.fromEmail,
      });

      localStorage.setItem(`pb_provider_${selectedProject}`, provider);
      localStorage.setItem(`pb_brevo_${selectedProject}`, brevoKey);
      localStorage.setItem(`pb_fromName_${selectedProject}`, admin.fromName);
      localStorage.setItem(`pb_fromEmail_${selectedProject}`, admin.fromEmail);

      toast.success(`${provider.toUpperCase()} email configuration updated successfully.`);
    } catch (err) {
      toast.error("Failed to update provider.");
    }
  };

  const handleProjectSelect = (pid: string, currentProjects?: any[]) => {
    setSelectedProject(pid);
    const projs = currentProjects || projects;
    const proj = projs.find(p => p._id === pid);
    if (proj) {
      if (proj.adminNotification) {
        setAdmin(prev => ({
          ...prev,
          sendToEmail: proj.adminNotification.email || "",
          subject: proj.adminNotification.subject || prev.subject,
          templateId: proj.adminNotification.templateId || "",
          fromName: proj.fromName || proj.name || "",
          fromEmail: proj.fromEmail || "",
        }));
        setAdminCfg(prev => ({ ...prev, enabled: proj.adminNotification.enabled }));
      }
      if (proj.userNotification) {
        setUser(prev => ({
          ...prev,
          subject: proj.userNotification.subject || prev.subject,
          templateId: proj.userNotification.templateId || "",
          bcc: proj.userNotification.bcc || "",
          fromName: proj.fromName || proj.name || "",
          fromEmail: proj.fromEmail || "",
        }));
        setUserCfg(prev => ({ ...prev, enabled: proj.userNotification.enabled }));
      }
      if (proj.emailProvider) setProvider(proj.emailProvider as any);
      if (proj.brevoKey) setBrevoKey(proj.brevoKey);
    }

    setAdminCfg(getAdminNotifConfig(pid));
    setUserCfg(getUserAutoReplyConfig(pid));

    const a = localStorage.getItem(`pb_admin_ui_${pid}`);
    if (a) setAdmin(JSON.parse(a));
    const u = localStorage.getItem(`pb_user_ui_${pid}`);
    if (u) setUser(JSON.parse(u));
    const p = localStorage.getItem(`pb_provider_${pid}`);
    if (p) setProvider(p as any);
    const bk = localStorage.getItem(`pb_brevo_${pid}`);
    if (bk) setBrevoKey(bk);
  };

  const patchAdmin = (k: keyof AdminNotifConfig, v: any) => setAdminCfg((c) => ({ ...c, [k]: v }));
  const patchUser = (k: keyof UserAutoReplyConfig, v: any) => setUserCfg((c) => ({ ...c, [k]: v }));

  if (loading) return <div className="p-8 animate-pulse">Loading settings...</div>;

  return (
    <div className="flex-1 min-h-full flex flex-col" style={{ background: "#f2f2f2" }}>
      {/* Header */}
      <div className="px-4 sm:px-4 pt-6 pb-4 border-b border-border bg-white dark:bg-slate-900">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 w-full">
          <div className="space-y-1">
            <h1 className="text-lg font-bold text-foreground">Lead Notifications</h1>
            <p className="text-xs text-muted-foreground mt-0.5 max-w-lg">
              Configure automated emails for your team and your leads using <b>Brevo</b>.
              Manage project-specific SMTP settings and delivery templates.
            </p>
          </div>

          <div className="flex flex-col gap-1.5 w-full md:w-auto">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Current Project</label>
            <Select
              value={selectedProject}
              onValueChange={(val) => val && handleProjectSelect(val)}
              {...({ modal: false } as any)}
            >
              <SelectTrigger className="h-10 w-full md:min-w-[240px] rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 text-xs font-semibold text-foreground shadow-sm hover:border-primary/30 focus:ring-2 focus:ring-primary/20 transition-all gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="h-5 w-5 rounded flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg, #7c3aed, #6366f1)" }}>
                    <Globe className="h-3 w-3 text-white" />
                  </div>
                  <span className="truncate">
                    {projects.find((p: any) => p._id === selectedProject)?.name || "Select project"}
                  </span>
                </div>
              </SelectTrigger>
              <SelectContent>
                {projects.map((p: any) => (
                  <SelectItem key={p._id} value={p._id}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-[1800px] w-full mx-auto px-4 sm:px-4 py-4 space-y-4 flex-1">
        {/* Brevo Configuration Section */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center gap-6 px-8 py-5 border-b border-slate-100 dark:border-slate-800/40 bg-slate-50/50 dark:bg-slate-800/10">
            <div className="flex flex-wrap items-center gap-3">
              <svg viewBox="0 0 81.177 24" className="h-5 w-auto opacity-80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="m66.587 14.86c0-3.633 2.3-6.188 5.57-6.188s5.607 2.554 5.607 6.188c0 3.635-2.336 6.045-5.607 6.045-3.27 0-5.57-2.52-5.57-6.045zm-3.414 0c0 5.362 3.738 9.14 8.984 9.14s9.02-3.778 9.02-9.14c0-5.36-3.738-9.282-9.02-9.282s-8.984 3.85-8.984 9.282zm-17.428-9.067 7.043 17.99h3.307l7.043-17.99h-3.557l-5.103 13.89h-.072l-5.103-13.89zm-13.692 8.42c.215-3.312 2.408-5.541 5.39-5.541 2.587 0 4.528 1.655 4.816 4.138h-5.966c-2.12 0-3.27.252-4.132 1.404h-.108zm-3.413.539c0 5.361 3.773 9.246 8.983 9.246 3.522 0 6.611-1.798 7.94-4.642l-2.873-1.44c-1.006 1.872-2.947 2.987-5.067 2.987-2.552 0-4.852-1.943-4.852-3.814 0-.971.647-1.404 1.581-1.404h11.391v-.97c0-5.398-3.45-9.14-8.408-9.14s-8.696 3.85-8.696 9.176m-9.774 9.03h3.235v-11.044c0-2.374 1.472-4.066 3.522-4.066.862 0 1.76.288 2.192.683.324-.864.827-1.726 1.58-2.59-.862-.72-2.334-1.188-3.772-1.188-3.953 0-6.757 2.95-6.757 7.16v11.046zm-15.63-11.907v-8.78h5.318c1.796 0 2.982 1.043 2.982 2.626 0 1.799-1.544 3.166-4.707 4.21-2.156.682-3.125 1.258-3.485 1.943zm0 8.816v-3.67c0-1.62 1.365-3.202 3.27-3.814 1.69-.576 3.09-1.152 4.276-1.763 1.581.936 2.55 2.554 2.55 4.246 0 2.878-2.73 5-6.432 5zm-3.235 3.093h7.187c5.463 0 9.558-3.417 9.558-7.951 0-2.483-1.257-4.713-3.485-6.153 1.15-1.152 1.689-2.483 1.689-4.102 0-3.347-2.409-5.577-6.037-5.577h-8.912z" fill="#0b996e" />
              </svg>
              <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-800 hidden md:block" />
              <p className="text-sm font-bold text-slate-800 dark:text-slate-100">Email Service Provider</p>
            </div>
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              {["brevo", "smtp"].map((p) => (
                <label key={p} className="flex items-center gap-2.5 cursor-pointer text-sm font-medium text-foreground capitalize group">
                  <div className="relative flex items-center justify-center">
                    <input
                      type="radio"
                      name="provider"
                      checked={provider === p}
                      onChange={() => setProvider(p as any)}
                      className="peer sr-only"
                    />
                    <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/30 peer-checked:border-primary peer-checked:bg-primary transition-all duration-200" />
                    <div className="absolute h-1.5 w-1.5 rounded-full bg-white scale-0 peer-checked:scale-100 transition-transform duration-200" />
                  </div>
                  <span className="group-hover:text-primary transition-colors">{p === "brevo" ? "Brevo (Recommended)" : "Custom SMTP"}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="p-4 sm:p-8 flex flex-col xl:flex-row items-start justify-between gap-6 xl:gap-10">
            <div className="flex-1 w-full max-w-3xl">
              {provider === "brevo" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                      Brevo API Key (v3) <span className="h-1 w-1 rounded-full bg-emerald-500" />
                    </label>
                    <Input
                      type="password"
                      placeholder="xkeysib-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                      value={brevoKey}
                      onChange={(e) => setBrevoKey(e.target.value)}
                      className="h-11 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 font-mono text-xs focus:ring-primary/20 transition-all"
                    />
                    <p className="text-[10px] text-muted-foreground/70 italic px-1">
                      Enter your <b>API v3 Key</b> for high-performance delivery.
                      <a href="https://app.brevo.com/settings/keys/api" target="_blank" className="text-primary hover:underline font-medium ml-1">Generate API Key here →</a>
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Project Name:</label>
                    <Input
                      placeholder="AI Projects Team"
                      value={admin.fromName}
                      onChange={(e) => setAdmin(prev => ({ ...prev, fromName: e.target.value }))}
                      className="h-11 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 text-sm font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">From Email</label>
                    <Input
                      placeholder="notifications@yourdomain.com"
                      value={admin.fromEmail}
                      onChange={(e) => setAdmin(prev => ({ ...prev, fromEmail: e.target.value }))}
                      className="h-11 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 text-sm font-medium"
                    />
                  </div>
                </div>
              )}

              {provider === "smtp" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2"><label className="text-[10px] font-bold text-muted-foreground uppercase">Host</label><Input placeholder="smtp.example.com" className="h-11 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 font-mono text-xs" /></div>
                  <div className="space-y-2"><label className="text-[10px] font-bold text-muted-foreground uppercase">Port</label><Input placeholder="587" className="h-11 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 font-mono text-xs" /></div>
                  <div className="space-y-2"><label className="text-[10px] font-bold text-muted-foreground uppercase">Username</label><Input placeholder="user@example.com" className="h-11 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 font-mono text-xs" /></div>
                  <div className="space-y-2"><label className="text-[10px] font-bold text-muted-foreground uppercase">Password</label><Input type="password" placeholder="••••••••" className="h-11 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 font-mono text-xs" /></div>
                </div>
              )}
            </div>

            <div className="xl:w-64 w-full flex flex-col gap-3">
              <Button
                className="rounded-xl px-8 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 gap-2 h-11 font-bold transition-all"
                onClick={handleSaveProvider}
              >
                Save {provider === 'brevo' ? 'Brevo' : 'SMTP'} Settings
              </Button>
              <p className="text-[10px] text-center text-muted-foreground/60 leading-relaxed font-medium">
                Changes applied instantly to all landing pages within this project.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* ══ ADMIN NOTIFICATION (NOTIFICATIONS) ══════════════════ */}
          <div className="space-y-6">
            <NotificationPanel
              title="Admin Lead Alerts"
              enabled={adminCfg.enabled}
              onToggle={(v) => patchAdmin("enabled", v)}
              onSave={handleSaveAdmin}
              saved={savedAdmin}
            >
              <Field label="Recipient Email" required hint="Where to send lead alerts">
                <Input
                  type="email"
                  placeholder="sales@yourcompany.com"
                  value={admin.sendToEmail}
                  onChange={(e) => setAdmin((a) => ({ ...a, sendToEmail: e.target.value }))}
                  className="h-10 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 text-sm"
                />
              </Field>

              <div className="grid grid-cols-1 gap-4">
                <Field label="Sender Name">
                  <Input
                    placeholder="Lead Notification"
                    value={admin.fromName}
                    onChange={(e) => setAdmin((a) => ({ ...a, fromName: e.target.value }))}
                    className="h-10 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 text-sm"
                  />
                </Field>
              </div>

              <Field label="Subject Line" required>
                <Input
                  placeholder="New Lead Captured"
                  value={admin.subject}
                  onChange={(e) => setAdmin((a) => ({ ...a, subject: e.target.value }))}
                  className="h-10 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 text-sm font-semibold"
                />
              </Field>
            </NotificationPanel>
          </div>

          {/* ══ USER NOTIFICATION (CONFIRMATIONS) ═══════════════════ */}
          <div className="space-y-6">
            <NotificationPanel
              title="Lead Confirmation"
              enabled={userCfg.enabled}
              onToggle={(v) => patchUser("enabled", v)}
              onSave={handleSaveUser}
              saved={savedUser}
            >
              <div className="grid grid-cols-1 gap-4">
                <Field label="From Name" hint="Sender name shown to the user">
                  <Input
                    placeholder="Support Team"
                    value={user.fromName}
                    onChange={(e) => setUser((u) => ({ ...u, fromName: e.target.value }))}
                    className="h-10 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 text-sm"
                  />
                </Field>
              </div>

              <Field label="BCC Recipients" hint="Comma separated list">
                <Input
                  placeholder="archive@yourcompany.com"
                  value={user.bcc}
                  onChange={(e) => setUser((u) => ({ ...u, bcc: e.target.value }))}
                  className="h-10 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 text-sm"
                />
              </Field>

              <Field label="Email Subject" required>
                <Input
                  placeholder="Thank you for contacting us!"
                  value={user.subject}
                  onChange={(e) => setUser((u) => ({ ...u, subject: e.target.value }))}
                  className="h-10 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 text-sm font-semibold"
                />
              </Field>
            </NotificationPanel>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MailManagementPage;
