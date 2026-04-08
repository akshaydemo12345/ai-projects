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
Industry/Template: ${template}
Description: ${businessDescription}
Target Audience: ${targetAudience}
Primary CTA: ${ctaText}

---
## 🔒 HARD RULES (NON-NEGOTIABLE)
1. NEVER return JSON.
2. NEVER return empty fields or placeholders like "lorem ipsum".
3. NEVER ask questions.
4. ALWAYS generate COMPLETE, valid HTML5 documents including <!DOCTYPE html>, <html>, <head>, and <body>.
5. ALWAYS include ALL CSS within <style> tags in the head.
6. ALWAYS include ALL functionality within <script> tags before the closing </body>.
7. ALWAYS use REAL images from Unsplash or Pexels based on the ${template} industry.
8. ALWAYS optimize for conversion (CRO best practices).
9. Design Style: ${styleContext}. Use premium fonts and vibrant but professional colors.

---
## 🧱 MANDATORY SECTIONS
1. HERO: Background image, H1 Headline + subheadline, Capture Form (Name, Phone, Email), Trust badge.
2. SOCIAL PROOF: Stats (e.g. 5000+ Happy Clients) and Client logos.
3. FEATURES / SERVICES: Grid cards with icons and benefit-driven copy.
4. MID FORM: Consultation request form with Service dropdown.
5. HOW IT WORKS: 3-step visualization.
6. TESTIMONIALS: 3 realistic user reviews with names and professional roles.
7. FAQ: Schema-ready accordion with 4-5 relevant questions.
8. FINAL CTA & FOOTER: High-impact closure.

---
## ⚙️ FUNCTIONALITY (MUST IMPLEMENT)
- Fully responsive (mobile-first grid/flex).
- Sticky CTA button for mobile users.
- Smooth Scroll Reveal animations.
- Form validation (JavaScript) and AJAX submission (fetch API to '/api/pages/${pageId || 'PAGE_ID'}/leads').
- "Thank You" popup/modal trigger after submit.
- Hidden UTM tracking fields: utm_source, utm_medium, utm_campaign.
- CRM webhook logic (Handled by backend via the '/api/pages/${pageId || 'PAGE_ID'}/leads' endpoint).

OUTPUT REQUIREMENT:
Return ONLY the raw HTML code. Do NOT wrap in markdown fences. Do NOT add explanation text. Start with <!DOCTYPE html>.
`;
};

/**
 * Makes a raw HTTPS POST request to OpenAI Chat Completions.
 * @param {string} prompt
 * @returns {Promise<Object>} - Parsed JSON content
 */
const callOpenAI = (prompt) => {
  return new Promise((resolve, reject) => {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return reject(new Error('OPENAI_API_KEY is not configured in environment'));
    }

    const body = JSON.stringify({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an advanced AI landing page engine. You generate complete, production-ready HTML code without any JSON or conversational text.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 4096,
      // Removed response_format: { type: 'json_object' } to allow raw HTML
    });

    const options = {
      hostname: 'api.openai.com',
      path: '/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
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
            return reject(new Error(`OpenAI API Error: ${parsed.error.message}`));
          }

          const raw = parsed.choices?.[0]?.message?.content;
          if (!raw) {
            return reject(new Error('No content returned from OpenAI'));
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
          reject(new Error(`Failed to process OpenAI response: ${err.message}`));
        }
      });
    });

    req.on('error', (err) => {
      reject(new Error(`Network error calling OpenAI: ${err.message}`));
    });

    req.setTimeout(120000, () => {
      req.destroy();
      reject(new Error('OpenAI request timed out after 120 seconds. Generation of full HTML/CSS takes extra time.'));
    });

    req.write(body);
    req.end();
  });
};

/**
 * Generates structured landing page content via OpenAI.
 */
const generateLandingPageContent = async (input) => {
  const prompt = buildPrompt(input);
  return await callOpenAI(prompt);
};

/**
 * Improves a specific section's content via OpenAI.
 */
const improveSectionContent = async ({ sectionType, currentContent, aiPrompt }) => {
  const prompt = `
    Analyze and improve the following "${sectionType}" content.
    ${JSON.stringify(currentContent)}
    Instruction: ${aiPrompt || 'Make it better.'}
    Return improved JSON only.
  `;
  return await callOpenAI(prompt);
};

module.exports = { generateLandingPageContent, improveSectionContent };
