// EmailJS REST API — no npm package needed
export interface EmailConfig {
  serviceId: string;
  templateId: string;
  publicKey: string;
  toEmail: string;
}

export const getEmailConfig = (): EmailConfig | null => {
  try {
    const s = localStorage.getItem('pb_email_config');
    return s ? JSON.parse(s) : null;
  } catch { return null; }
};

export const saveEmailConfig = (c: EmailConfig) =>
  localStorage.setItem('pb_email_config', JSON.stringify(c));

/**
 * Send email via EmailJS REST API.
 * template_params keys should match your EmailJS template variables.
 */
export const sendEmailJS = async (
  config: EmailConfig,
  templateParams: Record<string, string>
): Promise<void> => {
  const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      service_id: config.serviceId,
      template_id: config.templateId,
      user_id: config.publicKey,
      template_params: {
        ...templateParams,
        to_email: config.toEmail,
      },
    }),
  });
  if (!res.ok) throw new Error(`EmailJS error: ${res.status}`);
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
