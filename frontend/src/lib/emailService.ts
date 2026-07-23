// EmailJS REST API — no npm package needed

// ─── Base EmailJS Config ─────────────────────────────────────────────────────
export interface EmailConfig {
  serviceId: string;
  templateId: string;
  publicKey: string;
  toEmail: string;
}

// ─── Admin Notification Config ───────────────────────────────────────────────
export interface AdminNotifConfig {
  enabled: boolean;
  serviceId: string;
  templateId: string;   // EmailJS template for admin notification
  publicKey: string;
  adminEmail: string;   // where admin alerts go
}

// ─── User Auto-Reply Config ──────────────────────────────────────────────────
export interface UserAutoReplyConfig {
  enabled: boolean;
  serviceId: string;
  templateId: string;   // EmailJS template for user auto-reply
  publicKey: string;
  fromName: string;     // "Reply-To" display name e.g. "Agency Team"
  subject: string;      // e.g. "Thanks for reaching out!"
  bodyHtml: string;     // custom thank-you message body
}

// ─── Persist & Load ──────────────────────────────────────────────────────────
export const getEmailConfig = (): EmailConfig | null => {
  try {
    const s = localStorage.getItem('pb_email_config');
    return s ? JSON.parse(s) : null;
  } catch { return null; }
};
export const saveEmailConfig = (c: EmailConfig) =>
  localStorage.setItem('pb_email_config', JSON.stringify(c));

export const getAdminNotifConfig = (projectId: string = 'global'): AdminNotifConfig => {
  try {
    const s = localStorage.getItem(`pb_admin_notif_config_${projectId}`);
    if (s) return JSON.parse(s);
    // Fallback to legacy key to not break existing
    const legacy = localStorage.getItem('pb_admin_notif_config');
    return legacy ? JSON.parse(legacy) : { enabled: false, serviceId: '', templateId: '', publicKey: '', adminEmail: '' };
  } catch {
    return { enabled: false, serviceId: '', templateId: '', publicKey: '', adminEmail: '' };
  }
};
export const saveAdminNotifConfig = (c: AdminNotifConfig, projectId: string = 'global') =>
  localStorage.setItem(`pb_admin_notif_config_${projectId}`, JSON.stringify(c));

export const getUserAutoReplyConfig = (projectId: string = 'global'): UserAutoReplyConfig => {
  try {
    const s = localStorage.getItem(`pb_user_autoreply_config_${projectId}`);
    if (s) return JSON.parse(s);
    const legacy = localStorage.getItem('pb_user_autoreply_config');
    return legacy ? JSON.parse(legacy) : {
      enabled: false, serviceId: '', templateId: '', publicKey: '',
      fromName: '', subject: 'Thank you for reaching out!',
      bodyHtml: 'Hi {{name}},\n\nThank you for contacting us! We have received your inquiry and will get back to you shortly.\n\nBest regards,\nThe Team',
    };
  } catch {
    return {
      enabled: false, serviceId: '', templateId: '', publicKey: '',
      fromName: '', subject: 'Thank you for reaching out!',
      bodyHtml: 'Hi {{name}},\n\nThank you for contacting us! We have received your inquiry and will get back to you shortly.\n\nBest regards,\nThe Team',
    };
  }
};
export const saveUserAutoReplyConfig = (c: UserAutoReplyConfig, projectId: string = 'global') =>
  localStorage.setItem(`pb_user_autoreply_config_${projectId}`, JSON.stringify(c));

// ─── Core EmailJS Sender ─────────────────────────────────────────────────────
export const sendEmailJS = async (
  config: { serviceId: string; templateId: string; publicKey: string },
  templateParams: Record<string, string>
): Promise<void> => {
  const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      service_id: config.serviceId,
      template_id: config.templateId,
      user_id: config.publicKey,
      template_params: templateParams,
    }),
  });
  if (!res.ok) throw new Error(`EmailJS error: ${res.status}`);
};

// ─── Admin Notification ──────────────────────────────────────────────────────
/**
 * Send admin notification email when a new lead is captured.
 * Template variables available: {{admin_email}}, {{lead_name}}, {{lead_email}},
 * {{lead_phone}}, {{lead_message}}, {{page_slug}}, {{timestamp}}
 */
export const sendAdminNotification = async (leadData: {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  pageSlug?: string;
  [key: string]: any;
}): Promise<void> => {
  const cfg = getAdminNotifConfig();
  if (!cfg.enabled || !cfg.serviceId || !cfg.templateId || !cfg.publicKey || !cfg.adminEmail) return;

  await sendEmailJS(
    { serviceId: cfg.serviceId, templateId: cfg.templateId, publicKey: cfg.publicKey },
    {
      to_email: cfg.adminEmail,
      admin_email: cfg.adminEmail,
      lead_name: leadData.name || 'Unknown',
      lead_email: leadData.email || 'Not provided',
      lead_phone: leadData.phone || 'Not provided',
      lead_message: leadData.message || 'No message',
      page_slug: leadData.pageSlug || '',
      timestamp: new Date().toLocaleString(),
    }
  );
};

// ─── User Auto-Reply ─────────────────────────────────────────────────────────
/**
 * Send an auto-reply to the user who just submitted the form.
 * Template variables available: {{to_email}}, {{user_name}}, {{from_name}},
 * {{subject}}, {{body_html}}, {{timestamp}}
 */
export const sendUserAutoReply = async (leadData: {
  name?: string;
  email?: string;
  [key: string]: any;
}): Promise<void> => {
  const cfg = getUserAutoReplyConfig();
  if (!cfg.enabled || !cfg.serviceId || !cfg.templateId || !cfg.publicKey) return;
  if (!leadData.email) return; // can't reply without user email

  const body = cfg.bodyHtml.replace(/\{\{name\}\}/g, leadData.name || 'there');

  await sendEmailJS(
    { serviceId: cfg.serviceId, templateId: cfg.templateId, publicKey: cfg.publicKey },
    {
      to_email: leadData.email,
      user_name: leadData.name || 'there',
      from_name: cfg.fromName || 'Our Team',
      subject: cfg.subject,
      body_html: body,
      timestamp: new Date().toLocaleString(),
    }
  );
};

/** Save page state to localStorage for the preview page */
export const savePageForPreview = (page: unknown) =>
  localStorage.setItem('pb_preview_page', JSON.stringify(page));

export const loadPageForPreview = () => {
  try {
    const s = localStorage.getItem('pb_preview_page');
    return s ? JSON.parse(s) : null;
  } catch { return null; }
};
