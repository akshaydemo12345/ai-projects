import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { CheckCircle2, Settings2, HelpCircle } from "lucide-react";
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
    className={`relative inline-flex h-5 w-10 items-center rounded-full transition-all duration-300 ${
      checked ? "bg-emerald-500 shadow-[0_0_10px_-2px_rgba(16,185,129,0.5)]" : "bg-muted-foreground/20"
    }`}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-300 ${
        checked ? "translate-x-5" : "translate-x-1"
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
  <div className="rounded-2xl border border-border/60 bg-card/40 backdrop-blur-md overflow-hidden flex flex-col h-full shadow-lg group">
    {/* Panel Header */}
    <div className="flex items-center justify-between px-6 py-5 border-b border-border/40 bg-muted/30">
      <div className="flex flex-col">
        <p className="text-lg font-bold text-foreground tracking-tight">{title}</p>
      </div>
      <div className="flex items-center gap-3 bg-background/50 px-3 py-1.5 rounded-full border border-border/40">
        <span className={`text-[11px] font-bold uppercase tracking-wider ${enabled ? "text-emerald-500" : "text-muted-foreground/60"}`}>
          {enabled ? "Active" : "Paused"}
        </span>
        <Toggle checked={enabled} onChange={onToggle} />
      </div>
    </div>
    <div className={`px-6 py-6 space-y-5 flex-1 transition-all duration-300 ${!enabled ? "opacity-30 grayscale-[0.5] pointer-events-none scale-[0.995]" : ""}`}>
      {children}
    </div>
    <div className="px-6 py-6 border-t border-border/40 bg-muted/10 mt-auto flex">
      <Button
        className={`w-full h-11 font-bold text-sm tracking-wide transition-all duration-300 shadow-sm ${
          saved 
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

// ─── Plain Message Textarea ───────────────────────────────
const MessageBox = ({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) => (
  <textarea
    rows={8}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    className="w-full rounded-xl border border-border/60 bg-background/50 px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none shadow-inner"
  />
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
    replyTo: "",
    bcc: "",
    subject: "New Lead Captured",
    templateId: "",
  });
  const [user, setUser] = useState({
    name: "User Notification",
    sendToMode: "field",
    fromName: "",
    fromEmail: "",
    replyTo: "",
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
          message: admin.message,
        },
        fromName: admin.fromName,
        fromEmail: admin.fromEmail,
      });

      saveAdminNotifConfig({ ...adminCfg, adminEmail: admin.sendToEmail }, selectedProject);
      localStorage.setItem(`pb_admin_ui_${selectedProject}`, JSON.stringify(admin));
      
      setSavedAdmin(true);
      toast.success(`Admin settings saved for project!`);
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
          message: user.message,
          replyTo: user.replyTo,
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
      toast.success(`User auto-reply settings saved!`);
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
      
      toast.success(`${provider.toUpperCase()} configuration updated!`);
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
          message: proj.adminNotification.message || "",
          fromName: proj.fromName || "",
          fromEmail: proj.fromEmail || "",
        }));
        setAdminCfg(prev => ({ ...prev, enabled: proj.adminNotification.enabled }));
      }
      if (proj.userNotification) {
        setUser(prev => ({
          ...prev,
          subject: proj.userNotification.subject || prev.subject,
          templateId: proj.userNotification.templateId || "",
          message: proj.userNotification.message || "",
          replyTo: proj.userNotification.replyTo || "",
          bcc: proj.userNotification.bcc || "",
          fromName: proj.fromName || "",
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
    <div className="p-8 min-h-full bg-background/50">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-1">
            <div className="bg-primary/10 p-2 rounded-lg text-primary">
              <Settings2 className="h-5 w-5" />
            </div>
            <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Lead Notifications</h1>
          </div>
          <p className="text-sm text-muted-foreground/80 max-w-lg">
            Configure automated emails for your team and your leads using <b>Brevo</b>. 
            Manage project-specific SMTP settings and delivery templates.
          </p>
        </div>
        
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Current Project</label>
          <select 
            value={selectedProject} 
            onChange={(e) => handleProjectSelect(e.target.value)}
            className="h-11 rounded-xl border border-border/60 bg-background/80 backdrop-blur-sm px-4 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 min-w-[240px] shadow-sm transition-all hover:border-primary/30"
          >
            {projects.map(p => (
              <option key={p._id} value={p._id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Brevo Configuration Section */}
      <div className="rounded-2xl border border-border/40 bg-card/60 backdrop-blur-xl overflow-hidden mb-10 shadow-xl shadow-primary/5">
        <div className="flex flex-col md:flex-row md:items-center gap-6 px-8 py-5 border-b border-border/30 bg-muted/20">
          <div className="flex items-center gap-3">
            <img src="https://upload.wikimedia.org/wikipedia/commons/e/e0/Brevo_Logo.svg" alt="Brevo" className="h-5 opacity-80" />
            <div className="h-4 w-[1px] bg-border/40 hidden md:block" />
            <p className="text-sm font-bold text-foreground">Email Service Provider</p>
          </div>
          <div className="flex items-center gap-6">
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
        
        <div className="p-8 flex flex-col xl:flex-row items-start justify-between gap-10">
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
                    className="h-11 rounded-xl bg-background/50 border-border/40 font-mono text-xs focus:ring-primary/20 transition-all" 
                  />
                  <p className="text-[10px] text-muted-foreground/70 italic px-1">
                    Enter your <b>API v3 Key</b> for high-performance delivery. 
                    <a href="https://app.brevo.com/settings/keys/api" target="_blank" className="text-primary hover:underline font-medium ml-1">Generate API Key here →</a>
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Global From Name</label>
                  <Input 
                    placeholder="AI Projects Team" 
                    value={admin.fromName} 
                    onChange={(e) => setAdmin(prev => ({ ...prev, fromName: e.target.value }))} 
                    className="h-11 rounded-xl bg-background/50 border-border/40 text-sm font-medium" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Global From Email</label>
                  <Input 
                    placeholder="notifications@yourdomain.com" 
                    value={admin.fromEmail} 
                    onChange={(e) => setAdmin(prev => ({ ...prev, fromEmail: e.target.value }))} 
                    className="h-11 rounded-xl bg-background/50 border-border/40 text-sm font-medium" 
                  />
                </div>
              </div>
            )}
            
            {provider === "smtp" && (
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2"><label className="text-[10px] font-bold text-muted-foreground uppercase">Host</label><Input placeholder="smtp.example.com" className="h-11 rounded-xl bg-background/50 border-border/40 font-mono text-xs"/></div>
                <div className="space-y-2"><label className="text-[10px] font-bold text-muted-foreground uppercase">Port</label><Input placeholder="587" className="h-11 rounded-xl bg-background/50 border-border/40 font-mono text-xs"/></div>
                <div className="space-y-2"><label className="text-[10px] font-bold text-muted-foreground uppercase">Username</label><Input placeholder="user@example.com" className="h-11 rounded-xl bg-background/50 border-border/40 font-mono text-xs"/></div>
                <div className="space-y-2"><label className="text-[10px] font-bold text-muted-foreground uppercase">Password</label><Input type="password" placeholder="••••••••" className="h-11 rounded-xl bg-background/50 border-border/40 font-mono text-xs"/></div>
              </div>
            )}
          </div>
          
          <div className="xl:w-64 w-full flex flex-col gap-3">
            <Button 
              className="h-12 rounded-xl font-bold bg-foreground text-background hover:bg-foreground/90 shadow-lg shadow-foreground/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
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
                className="h-10 rounded-lg bg-background/50 border-border/40 text-sm"
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Sender Name">
                <Input
                  placeholder="Lead Notification"
                  value={admin.fromName}
                  onChange={(e) => setAdmin((a) => ({ ...a, fromName: e.target.value }))}
                  className="h-10 rounded-lg bg-background/50 border-border/40 text-sm"
                />
              </Field>
              <Field label="Reply-To">
                <Input
                  placeholder="contact@yourcompany.com"
                  value={admin.replyTo}
                  onChange={(e) => setAdmin((a) => ({ ...a, replyTo: e.target.value }))}
                  className="h-10 rounded-lg bg-background/50 border-border/40 text-sm"
                />
              </Field>
            </div>

            <Field label="Subject Line" required>
              <Input
                placeholder="New Lead Captured"
                value={admin.subject}
                onChange={(e) => setAdmin((a) => ({ ...a, subject: e.target.value }))}
                className="h-10 rounded-lg bg-background/50 border-border/40 text-sm font-semibold"
              />
            </Field>

            <Field label="Personalized Message" hint="This text will appear at the top of the notification email.">
              <Textarea 
                placeholder="e.g. Great news! A new lead has just expressed interest..." 
                value={admin.message}
                onChange={(e) => setAdmin((a) => ({ ...a, message: e.target.value }))}
                className="min-h-[100px] rounded-lg bg-background/50 border-border/40 text-sm resize-none"
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
            <div className="grid grid-cols-2 gap-4">
              <Field label="From Name" hint="Sender name shown to the user">
                <Input
                  placeholder="Support Team"
                  value={user.fromName}
                  onChange={(e) => setUser((u) => ({ ...u, fromName: e.target.value }))}
                  className="h-10 rounded-lg bg-background/50 border-border/40 text-sm"
                />
              </Field>

              <Field label="Reply To" hint="Where the user's replies go">
                <Input
                  type="email"
                  placeholder="contact@yourcompany.com"
                  value={user.replyTo}
                  onChange={(e) => setUser((u) => ({ ...u, replyTo: e.target.value }))}
                  className="h-10 rounded-lg bg-background/50 border-border/40 text-sm"
                />
              </Field>
            </div>

            <Field label="BCC Recipients" hint="Comma separated list">
              <Input
                placeholder="archive@yourcompany.com"
                value={user.bcc}
                onChange={(e) => setUser((u) => ({ ...u, bcc: e.target.value }))}
                className="h-10 rounded-lg bg-background/50 border-border/40 text-sm"
              />
            </Field>

            <Field label="Email Subject" required>
              <Input
                placeholder="Thank you for contacting us!"
                value={user.subject}
                onChange={(e) => setUser((u) => ({ ...u, subject: e.target.value }))}
                className="h-10 rounded-lg bg-background/50 border-border/40 text-sm font-semibold"
              />
            </Field>

            <Field label="Personalized Message" hint="The content of your auto-reply email.">
              <Textarea 
                placeholder="e.g. Thank you for reaching out! We have received your inquiry..." 
                value={user.message}
                onChange={(e) => setUser((u) => ({ ...u, message: e.target.value }))}
                className="min-h-[100px] rounded-lg bg-background/50 border-border/40 text-sm resize-none"
              />
            </Field>


          </NotificationPanel>


        </div>

      </div>
    </div>
  );
};

export default MailManagementPage;
