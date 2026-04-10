'use strict';

const https = require('https');

/**
 * Builds the structured landing page content prompt.
 * @param {Object} input - Business details from the request body
 * @returns {string} - Full prompt string
 */
const buildPrompt = ({
  businessName,
  template,
  businessDescription,
  targetAudience,
  ctaText,
  aiPrompt,
  pageId,
}) => {
  const industries = {
    medical: 'clean, blue, trust-focused',
    real_estate: 'luxury, dark, premium-focused',
    saas: 'modern, gradients, minimal-focused',
    fitness: 'bold, dark, energetic-focused',
    education: 'friendly, structured, academic-focused',
    default: 'modern, professional, conversion-focused'
  };

  const styleContext = industries[template] || industries.default;

  return `
You are an advanced AI landing page engine designed for SaaS automation platforms.
Generate a HIGH-CONVERTING, VISUALLY RICH, MOBILE-FIRST landing page for:
Business: ${businessName}
Description: ${businessDescription}
Target Audience: ${targetAudience}
Primary CTA: ${ctaText}
Custom Instructions: ${aiPrompt}

---
## 🧱 MANDATORY SECTIONS
1. HERO: Background image, H1 Headline + subheadline, Capture Form (Name, Phone, Email), Trust badge.
2. FEATURES / SERVICES: Grid cards with icons and benefit-driven copy.
3. MID FORM: Full capture form (Name, Email, Phone, Message, Service Dropdown).
4. TESTIMONIALS: 3 realistic user reviews.
5. FAQ: FAQ section.
6. FINAL CTA & FOOTER.

---
## 🎨 DESIGN & ASSET RULES (STRICT)
- Style: ${styleContext}.
- **CSS**: Use ONLY inline <style> tags in the <head>. NEVER use external .css files or relative links.
- **Images**: Use ONLY absolute https://images.unsplash.com URLs. NO relative paths (e.g., "img/hero.jpg").
- **Gradients & Shadows**: Use modern, premium visual styling (glassmorphism if appropriate).
- **Fonts**: Use Google Fonts via @import in the <style> block.

## ⚙️ FUNCTIONALITY (MUST IMPLEMENT)
- Fully responsive (mobile-first).
- Form validation (HTML5 + JS).
- AJAX Submission: Include a global <script> that intercepts ALL form submissions:
  - Endpoint: "${process.env.APP_BASE_URL || 'http://localhost:5000'}/api/leads"
  - Method: POST
  - Payload: { name, email, phone, message, pageSlug: window.location.pathname.split("/").pop(), projectId: "${pageId}" }
  - Handle Loading: Disable button during fetch.
  - Handle Success: Replace form with "Thank you! We will contact you soon." message.
  - Handle Error: Show alert "Submission failed, please try again."

OUTPUT REQUIREMENT:
Return ONLY the raw HTML code. Do NOT wrap in markdown fences. Do NOT add explanation text. Start with <!DOCTYPE html>.
`;
};

/**
 * Makes a raw HTTPS POST request to Anthropic Claude Messages API.
 * @param {string} prompt
 * @returns {Promise<Object>} - Parsed JSON content
 */
const callAnthropic = (prompt) => {
  return new Promise((resolve, reject) => {
    const apiKey = process.env.ANTHROPIC_API_KEY || process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return reject(new Error('ANTHROPIC_API_KEY is not configured in environment'));
    }

    const body = JSON.stringify({
      model: process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-20240620',
      max_tokens: 4096,
      system: 'You are an advanced AI landing page engine. You generate complete, production-ready HTML code without any JSON or conversational text.',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
    });

    const options = {
      hostname: 'api.anthropic.com',
      path: '/v1/messages',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'Content-Length': Buffer.byteLength(body),
      },
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);

          if (parsed.error) {
            console.error('Anthropic API Error details:', parsed.error);
            return reject(new Error(`Anthropic API Error: ${parsed.error.message || 'Unknown error'} (${parsed.error.type})`));
          }

          const raw = parsed.content?.filter(block => block.type === 'text').map(block => block.text).join('\n');
          if (!raw) {
            return reject(new Error('No content returned from Anthropic'));
          }

          const cleaned = raw.replace(/```html\s*/gi, '').replace(/```/g, '').trim();

          // HEURISTIC: If it starts with JSON curly brace, attempt parse. 
          // Otherwise, treat as raw HTML and wrap in a compatible structure.
          if (cleaned.startsWith('{')) {
            try {
              const content = JSON.parse(cleaned);
              return resolve(content);
            } catch (err) {
              // Fallback if it looks like JSON but fails
              return resolve({ fullHtml: cleaned });
            }
          }

          // RAW HTML MODE: Wrap for backward compatibility with controllers
          resolve({
            fullHtml: cleaned,
            fullCss: '', // CSS is expected to be inline in head
            fullJs: '',  // JS is expected to be inline in body
            pageContent: [], // Structured sidebar won't be available in raw mode
            seo: { title: 'Generated Page', description: '', keywords: [] }
          });

        } catch (err) {
          reject(new Error(`Failed to process Anthropic response: ${err.message}`));
        }
      });
    });

    req.on('error', (err) => {
      reject(new Error(`Network error calling Anthropic: ${err.message}`));
    });

    req.setTimeout(180000, () => {
      req.destroy();
      reject(new Error('Anthropic request timed out after 180 seconds.'));
    });

    req.write(body);
    req.end();
  });
};

/**
 * Generates structured landing page content via Anthropic.
 */
const generateLandingPageContent = async (input) => {
  const prompt = buildPrompt(input);
  return await callAnthropic(prompt);
};

/**
 * Improves a specific section's content via Anthropic.
 */
const improveSectionContent = async ({ sectionType, currentContent, aiPrompt }) => {
  const prompt = `
    Analyze and improve the following "${sectionType}" content.
    ${JSON.stringify(currentContent)}
    Instruction: ${aiPrompt || 'Make it better.'}
    Return improved JSON only.
  `;
  return await callAnthropic(prompt);
};

module.exports = { generateLandingPageContent, improveSectionContent };
