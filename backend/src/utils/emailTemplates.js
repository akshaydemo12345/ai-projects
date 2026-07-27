/**
 * Utility for generating email HTML templates for Admin Lead Notifications and User Auto-Replies
 */

const _fmtLabel = (k) => String(k)
  .replace(/^utm_/i, '')
  .replace(/[_-]+/g, ' ')
  .replace(/\b\w/g, c => c.toUpperCase())
  .trim();

const _fmtValue = (v) => {
  if (v === null || v === undefined || v === '') return '';
  if (typeof v === 'object' && !Array.isArray(v)) {
    return Object.entries(v)
      .filter(([, val]) => val !== null && val !== undefined && val !== '')
      .map(([k, val]) => `<strong>${_fmtLabel(k)}:</strong> ${typeof val === 'object' ? JSON.stringify(val) : String(val)}`)
      .join('<br>') || '';
  }
  if (Array.isArray(v)) return v.filter(Boolean).join(', ');
  return String(v);
};

exports.generateAdminEmailHTML = ({
  project = {},
  leadData = {},
  utm = {},
  referralSource = '',
  landingPageUrl = '',
  referrerUrl = '',
  pageSlug = '',
  ip_address = '',
  submitted_at = new Date()
}) => {
  const _contactKeys = ['name', 'full_name', 'fullname', 'first_name', 'last_name', 'email', 'email_address', 'phone', 'phone_number', 'mobile', 'tel', 'contact', 'contact_number', 'message', 'comment', 'comments', 'note', 'notes', 'inquiry', 'question', 'description'];
  const _skipKeys = ['pageid', 'pageslug', 'projectid', 'domain', 'url', 'token', 'timestamp', 'path', 'formdata', 'formdetails', 'trackingdetails', 'tracking_details', 'referer', 'referrer', 'referral_url', 'referrer_url', 'thankyouurl', 'pageurl', 'utm', 'meta'];

  const contactRows = [];
  const serviceRows = [];
  const seenLabels = new Set();

  const hasFullName = leadData.full_name || leadData.fullname;

  Object.entries(leadData).forEach(([key, value]) => {
    const lk = key.toLowerCase().replace(/[_-]+/g, '');
    if (_skipKeys.some(sk => sk.replace(/[_-]+/g, '') === lk)) return;

    const formatted = _fmtValue(value);
    if (!formatted) return;

    if ((lk === 'name') && hasFullName) return;

    const label = _fmtLabel(key);
    const labelKey = label.toLowerCase();
    if (seenLabels.has(labelKey)) return;
    seenLabels.add(labelKey);

    if (_contactKeys.some(ck => ck.replace(/[_-]+/g, '') === lk)) {
      contactRows.push({ label, value: formatted });
    } else {
      serviceRows.push({ label, value: formatted });
    }
  });

  // UTM / Tracking rows
  const trackingRows = [];
  const utmEntries = utm ? Object.entries(utm).filter(([, v]) => v) : [];
  utmEntries.forEach(([k, v]) => {
    trackingRows.push({ label: _fmtLabel(k.startsWith('utm_') ? k : `utm_${k}`), value: String(v) });
  });
  if (referralSource && referralSource !== 'Direct') {
    trackingRows.push({ label: 'Referral Source', value: String(referralSource) });
  }

  // Page Info rows
  const pageInfoRows = [];
  if (landingPageUrl) {
    pageInfoRows.push({ label: 'Landing Page', value: `<a href="${landingPageUrl}" style="color: #2b5b84; text-decoration: none; word-break: break-all; overflow-wrap: break-word;">${landingPageUrl}</a>` });
  }
  if (referrerUrl && referrerUrl !== landingPageUrl) {
    pageInfoRows.push({ label: 'Referrer', value: `<a href="${referrerUrl}" style="color: #2b5b84; text-decoration: none; word-break: break-all; overflow-wrap: break-word;">${referrerUrl}</a>` });
  }
  if (pageSlug) {
    pageInfoRows.push({ label: 'Page Slug', value: pageSlug });
  }
  if (ip_address) {
    pageInfoRows.push({ label: 'IP Address', value: String(ip_address) });
  }
  pageInfoRows.push({ label: 'Submitted At', value: new Date(submitted_at).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) });

  return exports.generateNotificationEmailHTML({
    headerTitle: 'New Lead Captured',
    headerSubtitle: 'LEAD NOTIFICATION',
    headerIcon: '✉️',
    headerColor: (project && project.primaryColor) || '#a8d09e',
    sections: [
      { title: 'Contact Details', icon: '👤', rows: contactRows },
      { title: 'Inquiry Details', icon: '📋', rows: serviceRows },
      { title: 'Campaign Tracking', icon: '📊', rows: trackingRows },
      { title: 'Page Information', icon: '🔗', rows: pageInfoRows }
    ],
    fromName: (project && project.fromName) || 'All Rights Reserved'
  });
};

/**
 * Generic reusable "card" style admin notification email.
 * Shared by generateAdminEmailHTML (lead notifications) and any other
 * admin-facing notification (e.g. page claim requests) so every admin
 * email in the app has the same look & feel.
 *
 * @param {Object} opts
 * @param {string} opts.headerTitle - Main heading shown in the header band
 * @param {string} opts.headerSubtitle - Small uppercase label under the heading
 * @param {string} [opts.headerIcon] - Emoji shown inside the header avatar circle
 * @param {string} [opts.headerColor] - Header band background color (defaults to the existing sage green)
 * @param {Array<{title:string, icon:string, rows:Array<{label:string,value:string}>}>} opts.sections
 * @param {string} [opts.fromName] - Name shown in the footer copyright line
 * @param {string} [opts.poweredBy] - Small text shown above the copyright line
 */
exports.generateNotificationEmailHTML = ({
  headerTitle = 'Notification',
  headerSubtitle = '',
  headerIcon = '🔔',
  headerColor = '#a8d09e',
  sections = [],
  fromName = 'All Rights Reserved',
  poweredBy = 'Powered by AI Landing Page Builder'
}) => {
  const _renderRows = (rows) => rows.map((r, i) => `
    <tr>
      <td style="padding: 14px 20px;${i < rows.length - 1 ? ' border-bottom: 1px solid #f1f5f9;' : ''}">
        <div style="font-size: 10px; font-weight: 700; color: #8c9ba5; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 4px;">${r.label}</div>
        <div style="font-size: 15px; font-weight: 700; color: #1e293b; line-height: 1.4; word-break: break-word; overflow-wrap: break-word;">${r.value}</div>
      </td>
    </tr>`).join('');

  const _renderSection = (title, icon, rows) => {
    if (!rows || !rows.length) return '';
    return `
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px; border-collapse: collapse;">
      <tr>
        <td style="padding: 12px 20px; background-color: #f0f4f8; border-bottom: 1px solid #e2e8f0;">
          <span style="font-size: 13px; font-weight: 800; color: #2b5b84; text-transform: uppercase; letter-spacing: 0.06em;">${icon} ${title.toUpperCase()}</span>
        </td>
      </tr>
      ${_renderRows(rows)}
    </table>`;
  };

  const sectionsHtml = sections.map(s => _renderSection(s.title, s.icon, s.rows)).join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-text-size-adjust: 100%;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f1f5f9;">
    <tr>
      <td align="center" style="padding: 40px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 580px; background: #ffffff; border-radius: 4px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.04); border: 1px solid #e2e8f0;">

          <!-- Header -->
          <tr>
            <td style="background-color: ${headerColor}; padding: 36px 24px; text-align: center;">
              <div style="width: 52px; height: 52px; line-height: 52px; border-radius: 50%; background-color: rgba(255,255,255,0.25); margin: 0 auto 14px; font-size: 22px;">${headerIcon}</div>
              <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #ffffff; letter-spacing: -0.01em;">${headerTitle}</h1>
              ${headerSubtitle ? `<p style="margin: 6px 0 0; font-size: 11px; color: rgba(255,255,255,0.9); text-transform: uppercase; letter-spacing: 0.1em; font-weight: 700;">${headerSubtitle}</p>` : ''}
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 24px 16px 8px;">
              ${sectionsHtml}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 24px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center;">
              <p style="margin: 0 0 4px; font-size: 11px; color: #94a3b8;">${poweredBy}</p>
              <p style="margin: 0; font-size: 11px; color: #94a3b8;">&copy; ${new Date().getFullYear()} ${fromName}</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
};