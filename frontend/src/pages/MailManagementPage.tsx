import { useState, useEffect } from "react";
import { CheckCircle2, Settings2, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  <div className="border-b border-border pb-4 last:border-0 last:pb-0">
    <div className="flex items-center gap-1.5 mb-1.5">
      <label className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-red-500 ml-1">(Required)</span>}
      </label>
      {hint && (
        <span title={hint} className="cursor-help">
          <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
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
    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
      checked ? "bg-primary" : "bg-muted-foreground/30"
    }`}
  >
    <span
      className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
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
  children,
}: {
  title: string;
  enabled: boolean;
  onToggle: (v: boolean) => void;
  children: React.ReactNode;
}) => (
  <div className="rounded-xl border border-border bg-card overflow-hidden">
    {/* Panel Header */}
    <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-muted/20">
      <p className="text-base font-semibold text-foreground">{title}</p>
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span>{enabled ? "Active" : "Inactive"}</span>
        <Toggle checked={enabled} onChange={onToggle} />
      </div>
    </div>
    <div className={`px-5 py-5 space-y-4 ${!enabled ? "opacity-50 pointer-events-none" : ""}`}>
      {children}
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
    rows={6}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
  />
);

// ─── Page ─────────────────────────────────────────────────
const MailManagementPage = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>("global");
  const [provider, setProvider] = useState<"brevo" | "smtp" | "emailjs">("brevo");
  const [brevoKey, setBrevoKey] = useState("");

  const [adminCfg, setAdminCfg] = useState<AdminNotifConfig>({
    enabled: false, serviceId: "", templateId: "", publicKey: "", adminEmail: "",
  });
  const [userCfg, setUserCfg] = useState<UserAutoReplyConfig>({
    enabled: false, serviceId: "", templateId: "", publicKey: "",
    fromName: "", subject: "Thank you for reaching out!",
    bodyHtml: "Hi {{name}},\n\nThank you for contacting us! We received your inquiry and will get back to you shortly.\n\nBest regards,\nThe Team",
  });

  // Extended fields (stored separately, UI only)
  const [admin, setAdmin] = useState({
    name: "Admin Notification",
    sendToMode: "email", // "email" | "field"
    sendToEmail: "",
    fromName: "",
    fromEmail: "",
    replyTo: "",
    bcc: "",
    subject: "You have a new lead - {{page_slug}}",
    message: "{{lead_name}} just submitted a form.\n\nEmail: {{lead_email}}\nPhone: {{lead_phone}}\nMessage: {{lead_message}}\n\nPage: {{page_slug}}\nTime: {{timestamp}}",
  });
  const [user, setUser] = useState({
    name: "User Notification",
    sendToMode: "field",
    fromName: "",
    fromEmail: "",
    replyTo: "",
    bcc: "",
    subject: "Thank you for contacting us!",
    message: "Hi {{name}},\n\nThank you for reaching out to us. We have received your inquiry and will get back to you shortly.\n\nBest regards,\nThe Team",
  });

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setAdminCfg(getAdminNotifConfig());
    setUserCfg(getUserAutoReplyConfig());
    const a = localStorage.getItem("pb_admin_ui");
    if (a) setAdmin(JSON.parse(a));
    const u = localStorage.getItem("pb_user_ui");
    if (u) setUser(JSON.parse(u));

    // Fetch dummy projects to simulate project-wise settings
    import("@/services/api").then(({ projectsApi }) => {
      projectsApi.getAll().then((data) => setProjects(data || [])).catch(() => {});
    });
  }, []);

  const handleSave = () => {
    saveAdminNotifConfig({ ...adminCfg, adminEmail: admin.sendToEmail }, selectedProject);
    saveUserAutoReplyConfig({
      ...userCfg,
      fromName: user.fromName,
      subject: user.subject,
      bodyHtml: user.message,
    }, selectedProject);
    
    // Save UI state uniquely per project so fields don't bleed across tests
    localStorage.setItem(`pb_admin_ui_${selectedProject}`, JSON.stringify(admin));
    localStorage.setItem(`pb_user_ui_${selectedProject}`, JSON.stringify(user));
    localStorage.setItem(`pb_provider_${selectedProject}`, provider);
    localStorage.setItem(`pb_brevo_${selectedProject}`, brevoKey);

    setSaved(true);
    toast.success(`Settings saved for ${selectedProject === "global" ? "Global Setup" : "the selected project"}!`);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleProjectSelect = (pid: string) => {
    setSelectedProject(pid);
    setAdminCfg(getAdminNotifConfig(pid));
    setUserCfg(getUserAutoReplyConfig(pid));
    
    const a = localStorage.getItem(`pb_admin_ui_${pid}`);
    if (a) setAdmin(JSON.parse(a));
    else setAdmin({ ...admin, sendToEmail: "", fromName: "", fromEmail: "", replyTo: "", bcc: "", subject: "You have a new lead - {{page_slug}}", message: "{{lead_name}} submitted the form..." });

    const u = localStorage.getItem(`pb_user_ui_${pid}`);
    if (u) setUser(JSON.parse(u));
    
    const p = localStorage.getItem(`pb_provider_${pid}`);
    if (p) setProvider(p as any); else setProvider("brevo");

    const bk = localStorage.getItem(`pb_brevo_${pid}`);
    if (bk) setBrevoKey(bk); else setBrevoKey("");
  };

  const patchAdmin = (k: keyof AdminNotifConfig, v: any) => setAdminCfg((c) => ({ ...c, [k]: v }));
  const patchUser = (k: keyof UserAutoReplyConfig, v: any) => setUserCfg((c) => ({ ...c, [k]: v }));

  return (
    <div className="p-8 min-h-full">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Configure who gets notified when a lead submits a form
          </p>
        </div>
        
        {/* Project Selector embedded in Header */}
        <div className="flex items-center gap-4">
          <select 
            value={selectedProject} 
            onChange={(e) => handleProjectSelect(e.target.value)}
            className="h-9 rounded-md border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 min-w-[200px]"
          >
            <option value="global">Global (All Projects)</option>
            {projects.map(p => (
              <option key={p._id} value={p._id}>{p.name}</option>
            ))}
          </select>

          <Button
            size="sm"
            className={`gap-2 h-9 ${saved ? "bg-emerald-600 hover:bg-emerald-700" : "bg-primary hover:bg-primary/90"}`}
            onClick={handleSave}
          >
            {saved
              ? <><CheckCircle2 className="h-3.5 w-3.5" /> Saved!</>
              : <><Settings2 className="h-3.5 w-3.5" /> Save Settings</>}
          </Button>
        </div>
      </div>

      {/* Provider Selector */}
      <div className="rounded-xl border border-border bg-card overflow-hidden mb-6">
        <div className="flex items-center gap-6 px-5 py-4 border-b border-border bg-muted/20">
          <p className="text-sm font-semibold text-foreground">Email Service Provider</p>
          <div className="flex items-center gap-4">
            {["brevo", "smtp", "emailjs"].map((p) => (
              <label key={p} className="flex items-center gap-1.5 cursor-pointer text-sm text-foreground capitalize">
                <input
                  type="radio"
                  name="provider"
                  checked={provider === p}
                  onChange={() => setProvider(p as any)}
                  className="accent-primary"
                />
                {p === "brevo" ? "Brevo" : p === "emailjs" ? "EmailJS" : "Custom SMTP"}
              </label>
            ))}
          </div>
        </div>
        <div className="p-5 bg-background">
          {provider === "brevo" && (
             <div className="max-w-md space-y-1.5">
               <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Brevo API Key</label>
               <Input type="password" placeholder="xkeysib-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" value={brevoKey} onChange={(e) => setBrevoKey(e.target.value)} className="h-9 text-sm font-mono" />
               <p className="text-[11px] text-muted-foreground mt-1">Found in your Brevo account under SMTP & API {'->'} API Keys.</p>
             </div>
          )}
          {provider === "smtp" && (
             <div className="max-w-xl grid grid-cols-2 gap-4">
               <div className="space-y-1.5"><label className="text-xs font-semibold text-muted-foreground uppercase">Host</label><Input placeholder="smtp.example.com" className="h-9 text-sm font-mono"/></div>
               <div className="space-y-1.5"><label className="text-xs font-semibold text-muted-foreground uppercase">Port</label><Input placeholder="587" className="h-9 text-sm font-mono"/></div>
               <div className="space-y-1.5"><label className="text-xs font-semibold text-muted-foreground uppercase">Username</label><Input placeholder="user@example.com" className="h-9 text-sm font-mono"/></div>
               <div className="space-y-1.5"><label className="text-xs font-semibold text-muted-foreground uppercase">Password</label><Input type="password" placeholder="••••••••" className="h-9 text-sm font-mono"/></div>
             </div>
          )}
          {provider === "emailjs" && (
             <div className="text-sm text-muted-foreground">EmailJS credentials can be managed in their dashboard. Legacy system fallback enabled.</div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 items-start">

        {/* ══ ADMIN NOTIFICATION ══════════════════════════════════ */}
        <NotificationPanel
          title="Admin Notification"
          enabled={adminCfg.enabled}
          onToggle={(v) => patchAdmin("enabled", v)}
        >
          <Field label="Send To Email" required hint="Admin email address to receive lead alerts">
            <Input
              type="email"
              placeholder="admin@yourdomain.com"
              value={admin.sendToEmail}
              onChange={(e) => setAdmin((a) => ({ ...a, sendToEmail: e.target.value }))}
              className="h-9 text-sm"
            />
          </Field>

          <Field label="From Name" hint="The sender name shown in the email client">
            <Input
              placeholder="{business_name}"
              value={admin.fromName}
              onChange={(e) => setAdmin((a) => ({ ...a, fromName: e.target.value }))}
              className="h-9 text-sm"
            />
          </Field>

          <Field label="From Email" hint="The email address emails are sent from">
            <Input
              type="email"
              placeholder="noreply@yourdomain.com"
              value={admin.fromEmail}
              onChange={(e) => setAdmin((a) => ({ ...a, fromEmail: e.target.value }))}
              className="h-9 text-sm"
            />
          </Field>

          <Field label="Reply To" hint="If set, replies go to this address instead of From Email">
            <Input
              type="email"
              placeholder="{lead_email}"
              value={admin.replyTo}
              onChange={(e) => setAdmin((a) => ({ ...a, replyTo: e.target.value }))}
              className="h-9 text-sm"
            />
          </Field>

          <Field label="BCC" hint="Optional blind copy recipients (comma separated)">
            <Input
              placeholder="bcc@yourdomain.com"
              value={admin.bcc}
              onChange={(e) => setAdmin((a) => ({ ...a, bcc: e.target.value }))}
              className="h-9 text-sm"
            />
          </Field>

          <Field label="Subject" required>
            <Input
              placeholder="New lead from {{page_slug}}"
              value={admin.subject}
              onChange={(e) => setAdmin((a) => ({ ...a, subject: e.target.value }))}
              className="h-9 text-sm"
            />
          </Field>

          <Field label="Message" required>
            <MessageBox
              value={admin.message}
              onChange={(v) => setAdmin((a) => ({ ...a, message: v }))}
              placeholder="{{lead_name}} submitted the form..."
            />
          </Field>

        </NotificationPanel>

        {/* ══ USER NOTIFICATION ═══════════════════════════════════ */}
        <NotificationPanel
          title="User Notification"
          enabled={userCfg.enabled}
          onToggle={(v) => patchUser("enabled", v)}
        >

          <Field label="From Name" hint="Sender name shown to the user">
            <Input
              placeholder="{business_name}"
              value={user.fromName}
              onChange={(e) => setUser((u) => ({ ...u, fromName: e.target.value }))}
              className="h-9 text-sm"
            />
          </Field>

          <Field label="From Email" hint="Email address the message is sent from">
            <Input
              type="email"
              placeholder="noreply@yourdomain.com"
              value={user.fromEmail}
              onChange={(e) => setUser((u) => ({ ...u, fromEmail: e.target.value }))}
              className="h-9 text-sm"
            />
          </Field>

          <Field label="Reply To" hint="Where the user's replies go">
            <Input
              type="email"
              placeholder="{business_email}"
              value={user.replyTo}
              onChange={(e) => setUser((u) => ({ ...u, replyTo: e.target.value }))}
              className="h-9 text-sm"
            />
          </Field>

          <Field label="BCC">
            <Input
              placeholder="bcc@yourdomain.com"
              value={user.bcc}
              onChange={(e) => setUser((u) => ({ ...u, bcc: e.target.value }))}
              className="h-9 text-sm"
            />
          </Field>

          <Field label="Subject" required>
            <Input
              placeholder="Thank you for contacting us!"
              value={user.subject}
              onChange={(e) => setUser((u) => ({ ...u, subject: e.target.value }))}
              className="h-9 text-sm"
            />
          </Field>

          <Field label="Message" required>
            <MessageBox
              value={user.message}
              onChange={(v) => setUser((u) => ({ ...u, message: v }))}
              placeholder="Hi {{name}}, thank you for reaching out..."
            />
          </Field>

        </NotificationPanel>

      </div>

      {/* Save Button — spans full width below both panels */}
      <Button
        className={`w-full h-10 font-semibold mt-6 ${saved ? "bg-emerald-600 hover:bg-emerald-700" : "bg-primary hover:bg-primary/90"}`}
        onClick={handleSave}
      >
        {saved ? "✓ Settings Saved" : "Update Notification"}
      </Button>
    </div>
  );
};

export default MailManagementPage;
