'use strict';

const https = require('https');

/**
 * Builds the structured landing page content prompt.
 * @param {Object} input - Business details from the request body
 * @returns {string} - Full prompt string
 */
const buildPrompt = ({
  businessName,
  industry,
  targetAudience,
  businessDescription,
  ctaText,
  figmaUrl,
  aiPrompt,
  figmaData,
}) => {
  const variants = [
    'Minimalist & Clean (Swiss Style)',
    'Cyberpunk & Dark Mode',
    'Playful Neo-Brutalism',
    'Premium & Elegant (High Fashion style)',
    'Corporate & Trust-Focused (Fintech style)',
    'Asymmetrical & Creative',
    'Nature-Inspired & Organic',
    'Bold & Vibrant (Dribbble style)'
  ];
  const chosenVariant = variants[Math.floor(Math.random() * variants.length)];

  const figmaInstruction = figmaData 
    ? `Figma Design Provided: ${figmaUrl}
       Extracted Tokens: ${figmaData.colors?.length > 0 ? `Colors: ${figmaData.colors.join(', ')}` : 'Follow overall file styles'}
       Layout Intent: Adhere to the spacing and hierarchy logic found in the "${figmaData.documentName || 'Figma'}" file.` 
    : figmaUrl 
      ? `Figma URL Provided: ${figmaUrl}. Use this as the primary design reference for structure and UI components.`
      : `Instructions: Generate a unique, ${chosenVariant} design from scratch.`;

  return `
Create a high-converting, modern, and pixel-perfect landing page based on the following details:

Business Name: ${businessName}
Industry: ${industry}
Style Variant: ${chosenVariant}
Business Description: ${businessDescription}
Target Audience: ${targetAudience || 'General Public'}
Primary CTA: ${ctaText || 'Get Started'}

${figmaInstruction}

DESIGN DIRECTIVE:
- DO NOT use a generic "centered hero with 3 cards" layout every time.
- Experiment with: Asymmetrical grids, staggered sections, overlapping elements, or large background typography.
- Use a unique color palette based on ${industry} and the ${chosenVariant} style.
- Incorporate subtle scroll animations or hover states in the 'fullHtml' and 'fullCss'.

${aiPrompt ? `CUSTOM USER INSTRUCTIONS: ${aiPrompt}\nFollow these instructions strictly for the content and layout tone.` : ''}

Generate the landing page with the following COMPREHENSIVE sections:

### THEME & DESIGN REQUIREMENTS:
- Create a 100% unique DESIGN for this industry. 
- Provide a 'fullHtml' string (semantic <body> content with animations).
- Provide a 'fullCss' string (modern, responsive CSS with gradients/glassmorphism).
- Provide a 'fullJs' string (optional interactivity like counters, tab switches, or scroll reveals).

### STRUCTURED CONTENT (FOR SIDEBAR EDITING):
1. hero: { badge, headline, subheadline, primaryCta, secondaryCta }
2. features: { title, subtitle, list: [ { title, description, icon } ] }
3. about: { title, subtitle, content }
4. testimonials: { title, subtitle, list: [ { name, role, feedback, stars } ] }
5. pricing: { title, subtitle, list: [ { plan, price, pricePeriod, features: [], isPopular, cta } ] }
6. faq: { title, list: [ { question, answer } ] }
7. contact: { title, subtitle, buttonText }
8. footer: { copyright, links: [] }

Output Format:
Return ONLY valid JSON including:
- fullHtml (The entire HTML structure for the body)
- fullCss (The entire CSS block)
- fullJs (The entire JS block)
- pageContent (the 8 sections above)
- seo: { title, description, keywords: [] }

Return ONLY the JSON. No markdown. No conversational text.
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
          content:
            'You are an expert conversion-focused landing page copywriter. Always respond with valid JSON only, no markdown.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 1.0,
      max_tokens: 4096,
      response_format: { type: 'json_object' },
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

          // Strip any accidental markdown code fences
          const cleaned = raw.replace(/```json\s*/gi, '').replace(/```/g, '').trim();
          const content = JSON.parse(cleaned);
          resolve(content);
        } catch (err) {
          reject(new Error(`Failed to parse OpenAI response: ${err.message}`));
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
