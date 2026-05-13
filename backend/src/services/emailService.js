const axios = require('axios');
const config = require('../config');

/**
 * Brevo Email Service
 * Handles sending transactional emails using direct API calls
 */
class EmailService {
  constructor() {
    this.baseUrl = 'https://api.brevo.com/v3/smtp/email';
  }

  /**
   * Send a transactional email
   * @param {Object} options
   */
  async sendEmail({ to, subject, htmlContent, fromName, fromEmail, brevoKey }) {
    const finalApiKey = brevoKey || config.email.brevoApiKey;

    if (!finalApiKey) {
      const missingKeyError = 'Brevo API Key missing. Cannot send email.';
      console.error(`❌ ${missingKeyError}`);
      throw new Error(missingKeyError);
    }

    const finalFromName = fromName && fromName.trim() ? fromName : config.email.fromName;
    const finalFromEmail = fromEmail && fromEmail.trim() ? fromEmail : config.email.fromEmail;

    const data = {
      sender: {
        name: finalFromName,
        email: finalFromEmail
      },
      to: [{ email: to }],
      subject: subject,
      htmlContent: htmlContent
    };

    console.log(`✉️ Sending email via Brevo API...`);
    console.log(`   From: "${finalFromName}" <${finalFromEmail}>`);
    console.log(`   To: ${to}`);
    console.log(`   Subject: ${subject}`);

    if (brevoKey) {
      console.log(`   Using project-specific API Key: ${brevoKey.substring(0, 10)}...`);
    } else {
      console.log(`   Using global API Key from .env: ${process.env.BREVO_API_KEY?.substring(0, 10)}...`);
    }

    try {
      const response = await axios.post(this.baseUrl, data, {
        headers: {
          'api-key': finalApiKey,
          'Content-Type': 'application/json'
        }
      });
      console.log('📧 Email sent successfully via Brevo API');
      return response.data;
    } catch (error) {
      const errorMsg = error.response ? JSON.stringify(error.response.data) : error.message;
      console.error('❌ Brevo API Error:', errorMsg);
      throw new Error(`Brevo Email Error: ${errorMsg}`);
    }
  }
}

module.exports = new EmailService();
