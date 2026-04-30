const SibApiV3Sdk = require('@getbrevo/brevo');

/**
 * Brevo Email Service
 * Handles sending transactional emails using Brevo SDK
 */
class EmailService {
  constructor() {
    this.apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    
    // Initialize with API Key from .env
    const apiKey = process.env.BREVO_API_KEY;
    if (apiKey) {
      this.apiInstance.setApiKey(SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey, apiKey);
    }
  }

  /**
   * Send a transactional email
   * @param {Object} options
   * @param {string} options.to - Recipient email
   * @param {string} options.subject - Email subject
   * @param {string} options.htmlContent - Email body (HTML)
   * @param {string} [options.fromName] - Sender name
   * @param {string} [options.fromEmail] - Sender email
   */
  async sendEmail({ to, subject, htmlContent, fromName, fromEmail }) {
    if (!process.env.BREVO_API_KEY) {
      console.warn('⚠️ Brevo API Key missing in .env. Skipping email.');
      return;
    }

    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = htmlContent;
    const finalFromName = fromName && fromName.trim() ? fromName : (process.env.FROM_NAME || 'AI Landing Page Builder');
    const finalFromEmail = fromEmail && fromEmail.trim() ? fromEmail : (process.env.FROM_EMAIL || 'noreply@yourdomain.com');

    sendSmtpEmail.sender = {
      name: finalFromName,
      email: finalFromEmail
    };
    sendSmtpEmail.to = [{ email: to }];

    console.log(`✉️ Sending email via Brevo...`);
    console.log(`   From: "${finalFromName}" <${finalFromEmail}>`);
    console.log(`   To: ${to}`);
    console.log(`   Subject: ${subject}`);

    try {
      const data = await this.apiInstance.sendTransacEmail(sendSmtpEmail);
      console.log('📧 Email sent successfully via Brevo:', data.body.messageId);
      return data;
    } catch (error) {
      console.error('❌ Brevo Email Error:', error.response ? error.response.body : error.message);
      throw error;
    }
  }
}

module.exports = new EmailService();
