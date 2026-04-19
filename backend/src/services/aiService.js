'use strict';

const Anthropic = require('@anthropic-ai/sdk');
const logger = require('../utils/logger');

const CLAUDE_MODEL_CANDIDATES = [
  process.env.ANTHROPIC_MODEL,
  'claude-sonnet-4-6',
  'claude-sonnet-4-5-20250929',
  'claude-sonnet-4-20250514',
  'claude-haiku-4-5-20251001',
].filter(Boolean);

/**
 * Build SYSTEM prompt (Claude-Level Master UI Designer)
 */
const buildSystemPrompt = () => {
  return `
Act as a world-class UI/UX Design Director and Conversion Strategist with 20+ years of experience.
Your goal is to generate a UNIQUE, premium, high-converting landing page.

VARIATION PRIORITY:
- Never repeat a rigid template.
- Pick a fresh visual direction based on user prompt + business context.
- Vary section order, visual hierarchy, spacing rhythm, and composition.
- Avoid producing "same skeleton with replaced text".
- Use at least one distinctive design motif (timeline, bento cards, split hero, editorial layout, diagonal section transitions, or storytelling flow).

CRITICAL DESIGN RULES:
- DO NOT generate a navigation menu or navbar links.
- Place only the brand logo near the top inside the hero/banner area: <img src="{{LOGO_URL}}" alt="Brand Logo" class="h-8 w-auto">
- The top area should look like a clean branded banner, not a traditional website navbar.
- IMAGE USAGE: If scraped images are provided in the user prompt, use those images instead of placeholder images. Use them strategically based on their type (banner for hero, product for services, etc.).
- FALLBACK: Only use 'https://picsum.photos/seed/[ANY_UNIQUE_WORD]/1200/800' if no scraped images are provided or if you need additional images beyond what was scraped.
- BACKGROUND IMAGES: Use inline styles only: style="background-image: url('...'); background-size: cover; background-position: center;"
- SECTION RHYTHM: Alternate backgrounds (e.g., bg-white, then bg-gray-50, then a dark section).
- TYPOGRAPHY: Scale your fonts. H1 should be text-5xl to text-7xl for premium feel.
- GLASSMORPHISM: Use backdrop-blur-md with semi-transparent backgrounds for floating elements.

REQUIRED COVERAGE (MANDATORY SPEED OPTIMIZED):
1. You MUST generate a minimum of 5 visual sections by default. (Reduced for speed).
2. CRITICAL: If the USER provides a specific list of sections (e.g., "1. Hero, 2. Trust Bar...") you MUST include EVERY SINGLE ONE of them. 
3. DO NOT MERGE sections. Every section must be distinct.
4. Each section must have its own unique design (bento, grid, list, split, etc.) and professional copy.

OUTPUT FORMATTING:
- YOU MUST OUTPUT EVERYTHING IN ONE SINGLE \`\`\`html BLOCK.
- BE EXTREMELY CONCISE TO MINIMIZE COST. Every section should be roughly 600-800 characters of high-impact code. 
- Avoid any redundant Tailwind classes or overly wordy descriptions.
- DO NOT split the page into multiple code blocks.

LENGTH + COMPLETENESS:
- Generate a full, high-impact landing page. 
- Aim for a total output around 3,000 to 4,500 characters for ultra-fast and ultra-cheap testing.
- You MUST finish within a 2000 token limit. DO NOT EXCEED.
- NEVER use placeholders. Keep HTML semantic and clean.

PLANNING:
- Budget strictly 350-400 tokens per section. 
- You MUST reach the Footer before hitting the 2000 token limit. 
- If tokens are running low, sacrifice detail to ensure the Footer is generated.

OUTPUT: Full complete HTML enclosed in a SINGLE \`\`\`html block. No explanation.
`;
};

/**
 * Build SYSTEM prompt for Smart Template Enrichment (Content Injector)
 */
const buildTemplateSystemPrompt = () => {
  return `
Act as a Precision Content Engineer.
Your ONLY task is to take the provided HTML template and replace its text content and images based on the user's business context.

CRITICAL RULES:
1. YOU MUST NOT ALTER THE HTML STRUCTURE, CLASSES, OR IDS. 
2. YOU MUST NOT ADD OR REMOVE ANY SECTIONS.
3. You are a content injector, not a designer. Maintain the exact layout provided.
4. Replace placeholder text with high-quality, conversion-focused copy.
5. Update <img> src attributes using 'https://picsum.photos/seed/[KEYWORD]/1200/800'.
6. If the user asks for specific form fields, you MAY modify the <input> tags inside the existing <form>, but DO NOT change the form's layout or container.
7. Return the FULL updated HTML in a single \`\`\`html block. No explanation.
`;
};

/**
 * Build USER prompt (Business Context + Branding)
 */
const buildUserPrompt = ({
  businessName,
  industry,
  pageType,
  targetAudience,
  businessDescription,
  ctaText,
  tone,
  aiPrompt,
  logoUrl,
  primaryColor,
  secondaryColor,
  services = [],
  keywords = [],
  noIndex = false,
  noFollow = false,
  scrapedData = {},
}) => {
  const robots = [noIndex ? 'noindex' : '', noFollow ? 'nofollow' : ''].filter(Boolean).join(',');

  // Extract potential trust signals (numbers, awards, etc.) from description
  const trustSignals = businessDescription ? (businessDescription.match(/(\d+,?\d*\+?|\d+%\+?)/g) || []) : [];
  const topServices = services.slice(0, 6); // Focus on top 6 services

  // Industry-specific form fields
  const industryFormFields = {
    'real estate': ['Full Name', 'Phone Number', 'Email', 'Property Type', 'Budget', 'Preferred Location'],
    'property': ['Full Name', 'Phone Number', 'Email', 'Property Type', 'Budget', 'Preferred Location'],
    'education': ['Student Name', 'Parent Name', 'Phone Number', 'Email', 'Course Interest', 'City'],
    'healthcare': ['Patient Name', 'Phone Number', 'Email', 'Appointment Date', 'Service Required'],
    'medical': ['Patient Name', 'Phone Number', 'Email', 'Appointment Date', 'Service Required'],
    'travel': ['Full Name', 'Phone Number', 'Email', 'Destination', 'Travel Date', 'Number of People'],
    'home services': ['Full Name', 'Phone Number', 'Email', 'Service Needed', 'Address', 'Preferred Time'],
    'saas': ['Full Name', 'Company Name', 'Email', 'Phone Number', 'Team Size', 'Business Type'],
    'software': ['Full Name', 'Company Name', 'Email', 'Phone Number', 'Team Size', 'Business Type'],
    'default': ['Full Name', 'Email', 'Phone Number', 'Message']
  };

  const normalizedIndustry = industry.toLowerCase();
  const formFields = industryFormFields[normalizedIndustry] || industryFormFields['default'];

  // Extract scrapedImages from scrapedData
  const scrapedImages = scrapedData?.images || [];

  // Prepare scraped images for the prompt
  let imageInstructions = '';
  if (scrapedImages && scrapedImages.length > 0) {
    // Filter for relevant images by type (banners, products, screenshots, environment)
    const relevantImages = scrapedImages.filter(img =>
      img.type === 'banner' || img.type === 'product' || img.type === 'screenshot' || img.type === 'environment' || img.type === 'general'
    ).slice(0, 8); // Use up to 8 relevant images

    if (relevantImages.length > 0) {
      imageInstructions = `
# SCRAPED IMAGES FROM WEBSITE (USE THESE INSTEAD OF PLACEHOLDERS):
You have access to ${relevantImages?.length || 0} relevant images scraped from the website. Use them strategically:

${relevantImages && Array.isArray(relevantImages) ? relevantImages.map((img, idx) => `-${idx + 1}. URL: ${img.url}
   - Type: ${img.type}
   - Section: ${img.section || 'unknown'}
   - Relevance: ${img.relevance || 'medium'}`).join('\n') : 'No relevant images available'}

**IMAGE USAGE RULES:**
- Use banner-type images for Hero sections or major visual areas
- Use product-type images for service/product showcase sections
- Use screenshot-type images for software/tech demonstrations
- Use environment-type images for team/office/about sections
- ONLY use these scraped images - do NOT use picsum.photos when scraped images are available
- If you need more images than provided, you may use picsum.photos as fallback
- Always use the exact URLs provided above
`;
    }
  }

  return `
# BRAND IDENTITY (TRUTH):
- PRIMARY COLOR PREVIEW: ${primaryColor || '#d23f1b'}
- SECONDARY COLOR PREVIEW: ${secondaryColor || '#c7d186'}
- LOGO: ${logoUrl ? 'Provided ({{LOGO_URL}})' : 'Create a text-based agency logo'}
- REAL IMAGES FROM WEBSITE: ${scrapedData?.images?.length > 0 ? JSON.stringify(scrapedData.images.slice(0, 15).map(img => ({ ...img, url: img.url.length > 300 ? img.url.substring(0, 100) + '...' : img.url }))) : 'None provided'}
- REAL VIDEOS FROM WEBSITE: ${scrapedData?.videos?.length > 0 ? JSON.stringify(scrapedData.videos.slice(0, 5)) : 'None provided'}
- REAL CTA TEXTS FROM WEBSITE: ${scrapedData?.ctas?.length > 0 ? JSON.stringify(scrapedData.ctas) : 'None provided'}
- REAL FORM STRUCTURES FROM WEBSITE: ${scrapedData?.forms?.length > 0 ? JSON.stringify(scrapedData.forms) : 'None provided'}

**CRITICAL RULE FOR COLORS**: 
You MUST NEVER use exact HEX codes (like bg-[#d23f1b]) or Tailwind base colors (like bg-blue-500) for brand elements.
You MUST ALWAYS use the dynamic CSS variables: \`[var(--primary)]\` and \`[var(--secondary)]\`.
Examples of ONLY ALLOWED syntax for brand colors:
- \`bg-[var(--primary)]\`
- \`text-[var(--primary)]\`
- \`border-[var(--secondary)]\`
- \`hover:bg-[var(--primary)]\`

${imageInstructions}

# STRATEGIC GOAL:
"${aiPrompt || 'Create a world-class landing page focusing on lead generation and brand authority.'}"

# CONTENT GUIDELINES:
1. Headlines: Use power-words and conversion-focused copywriting.
2. Structure: 
   - Hero: Catchy headline incorporating "${businessName}". Subtitle should expand on the value prop.
   - Services: Detail blocks for ${topServices.slice(0, 4).join(', ')}.
   - Lead Form: ${(scrapedData && Array.isArray(scrapedData.forms) && scrapedData.forms.length > 0) ? `Form includes these fields: ${scrapedData.forms.filter(f => f.fields && Array.isArray(f.fields)).map(f => f.fields.map(field => `${field.label || field.name} (${field.type})`).join(', ')).join('; ')}. Use these exact field names: ${scrapedData.forms.filter(f => f.fields && Array.isArray(f.fields)).map(f => f.fields.map(field => field.name).join(', ')).join(', ')}` : 'Standard lead capture form (name, email, phone, message)'}
   - Features: Explain HOW you help "${targetAudience}".
   - Social Proof: Use the industry context to create realistic testimonial names and high-authority trust badges.
3. Call to Action: Use "${ctaText || 'Get Started'}" as the primary command.

# DIVERSITY + STRUCTURE INSTRUCTIONS:
- Treat this request as a fresh creative direction focused on FAST, high-converting delivery.
- You MUST provide a minimum of 5 visual sections if no specific list is provided.
- **ABSOLUTE MANDATE**: A lead capture form MUST be included in every generated page. This is not optional.
- **ABSOLUTE MANDATE**: If the USER'S VISION (CUSTOM PROMPT) contains a numbered list, bullet points, or a sequence of sections, you MUST treat this as a strict requirement. 
- DO NOT OMIT anything requested.
- **ELABORATION REQUIREMENT**: Each section must have substantial, meaningful content. Do not use placeholder text or generic filler. Write detailed descriptions, benefits, and explanations for each service, feature, and value proposition.

# LEAD FORM INSTRUCTION (MANDATORY):
- You MUST ALWAYS include a lead capture form on EVERY landing page. NO EXCEPTIONS.
- You MUST prioritize using the 'REAL FORM STRUCTURES' detected from the website for your lead capture section.
- If REAL FORM STRUCTURES are provided, use the EXACT field names (name attributes) from those structures in your generated form.
- If no REAL FORM STRUCTURES are provided, use these industry-specific form fields: ${formFields.join(', ')}.
- The form design and placement should vary depending on the page style: hero side form, sticky sidebar form, popup CTA form, bottom section form, or multi-step form.
- Form should feel natural and relevant to the business.
- Display the form either as a prominent Hero-section form OR a dedicated Contact section with a sticky/floating CTA that opens a modal form.
- Apply semantic HTML and premium styling with [var(--primary)] buttons.
- IMPORTANT: Use the same field names as detected (e.g., if the website uses 'first_name', use 'first_name' instead of 'name'). This ensures form submission works correctly with the lead tracking script.
- The form MUST be visible and accessible to users. Do not hide it or make it difficult to find.

${imageInstructions ? '# IMAGE INSTRUCTION: Use the scraped images provided above. Only fallback to picsum.photos if you need additional images beyond what was scraped.' : '# IMMUTABLE OVERRIDE (CRITICAL): You MUST STILL ONLY USE \'https://picsum.photos/seed/[UNIQUE_TEXT]/1200/800\' directly to prevent 404 errors. No exceptions. Do not use Unsplash, Pexels, or any other external API.'}

# IMAGE RULES (INDUSTRY-RELEVANT VISUALS):
- Use industry-relevant visuals in your image choices.
- Real Estate → homes, apartments, happy families, property interiors
- Healthcare → doctors, patients, clinic interiors, medical equipment
- Education → students, classrooms, online learning, graduation
- Travel → destinations, hotels, beaches, landscapes
- Home Services → technicians, tools, before/after results, service scenes
- SaaS/Software → dashboards, charts, software UI, team collaboration
- Always choose images that match the business context and create emotional connection.

# VIDEO RULES:
- Include relevant videos where useful to enhance the landing page.
- Examples: customer testimonial video, product demo video, service explainer video, founder message, before/after transformation video, case study video.
- Use video sections strategically to build trust and demonstrate value.

# CONTENT REQUIREMENTS:
- Always generate meaningful headlines with supporting subheadings
- Include benefit-driven content that speaks to user pain points
- Add service descriptions with clear value propositions
- Include CTA sections with strong, action-oriented copy
- Add testimonials section with realistic customer quotes
- Include FAQs section addressing common objections
- Add trust badges, stats, or achievements to build credibility
- Include before/after content where relevant for the industry
- Use SEO-friendly headings (H1, H2, H3) with proper hierarchy
- Make layout depend on industry for better user experience
- Form position should depend on business type (hero side, sticky, bottom, popup).
- Content should be persuasive and conversion-focused.
- Use modern landing page structure with alternating backgrounds.
- Vary section designs (bento, grid, list, split, etc.) for visual interest.

# FINAL TASK: 
Build a pixel-perfect, premium landing page using the user's custom prompt's structure as a STRICT BLUEPRINT. Ensure EVERY requested section is built with unique, premium design and deep content. LONG-FORM ONLY.
`;
};

/**
 * Call Claude only
 */
const callAI = async (userPrompt, logoUrl = '', systemPrompt = '') => {
  const anthropicKey = process.env.ANTHROPIC_API_KEY;

  if (!anthropicKey) {
    logger.error('Anthropic API key is missing');
    throw new Error('ANTHROPIC_API_KEY is not configured in .env');
  }

  // Inject colors into system prompt
  const primaryHex = userPrompt.match(/- PRIMARY COLOR: (#[0-9a-fA-F]{3,6})/)?.[1] || '#7c3aed';
  const secondaryHex = userPrompt.match(/- SECONDARY COLOR: (#[0-9a-fA-F]{3,6})/)?.[1] || '#6366f1';

  const finalSystemPrompt = systemPrompt
    .replace(/\[PRIMARY_HEX\]/g, primaryHex)
    .replace(/\[SECONDARY_HEX\]/g, secondaryHex);

  const anthropic = new Anthropic({ apiKey: anthropicKey });
  let lastError = null;

  for (const model of CLAUDE_MODEL_CANDIDATES) {
    try {
      logger.info(`[AI] Attempting Claude model: ${model}`);

      // Handle both string prompt and structured messages (for Vision)
      const messageContent = typeof userPrompt === 'string'
        ? userPrompt
        : userPrompt;

      const response = await anthropic.messages.create({
        model,
        max_tokens: 4096, // Increased to support full long-form landing pages
        temperature: 0.7,
        system: finalSystemPrompt,
        messages: Array.isArray(messageContent) ? messageContent : [{ role: 'user', content: messageContent }],
      });

      const rawText = response.content[0].text;
      logger.info(`[AI] Raw response received. Length: ${rawText.length} characters.`);

      return processResult(rawText, logoUrl);
    } catch (err) {
      lastError = err;
      logger.error(`[AI] Claude model failed (${model}): ${err.message}`);
      const msg = String(err.message || '');
      const isModelNotFound = msg.includes('not_found_error') || msg.includes('model:');
      if (!isModelNotFound) break;
    }
  }

  throw new Error(`Claude generation failed: ${lastError?.message || 'Unknown Claude error'}`);
};

/**
 * Post-Processing
 */
const processResult = (raw, logoUrl) => {
  let clean = cleanHTML(raw);
  // Case-insensitive replacement for logo tag
  const logoPlaceholder = 'https://placehold.co/200x60/f8fafc/6366f1?text=BRAND';
  const finalLogo = logoUrl && logoUrl.trim() !== '' ? logoUrl : logoPlaceholder;

  clean = clean.replace(/\{\{LOGO_URL\}\}/gi, finalLogo);
  clean = clean.replace(/\{\{logoUrl\}\}/gi, finalLogo);


  const titleMatch = clean.match(/<title>([\s\S]*?)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : 'Landing Page';

  let css = '';
  const styleMatches = clean.match(/<style[^>]*>([\s\S]*?)<\/style>/gi);
  if (styleMatches && Array.isArray(styleMatches)) {
    css = styleMatches.map(s => s.replace(/<\/?style[^>]*>/gi, '')).join('\n');
  }

  return { fullHtml: clean, fullCss: css, fullJs: '', seo: { title } };
};

const cleanHTML = (raw) => {
  if (typeof raw !== 'string') return '';
  // Enhanced regex to find all ```html ... ``` blocks.
  // The closing ``` is now optional (?) to handle truncated responses.
  const regex = /```(?:html)?\s*([\s\S]*?)(?:```|$)/gi;
  let matches = [];
  let match;
  while ((match = regex.exec(raw)) !== null) {
    if (match[1]) {
      let content = match[1].trim();
      // If content ends with backticks that weren't captured by the non-greedy match, clean them
      content = content.replace(/```$/g, '').trim();
      matches.push(content);
    }
  }

  // If we found any blocks, join them.
  if (matches.length > 0) return matches.join('\n');

  // fallback logic if no code blocks are found at all
  const htmlMatch = raw.match(/(<!DOCTYPE[\s\S]*?<\/html>)/i) || raw.match(/(<html[\s\S]*?<\/html>)/i);
  if (htmlMatch) return htmlMatch[1].trim();

  return raw.replace(/```html/gi, '').replace(/```/g, '').trim();
};

const generateLandingPageContent = async (input) => {
  // 1. SKIP separate strategy call for speed!
  // 2. Build the Persona-based System Prompt
  const systemPrompt = input.templateHtml ? buildTemplateSystemPrompt() : buildSystemPrompt();

  // Extract scrapedImages from scrapedData if available
  const scrapedImages = input.scrapedData?.images || [];

  // 3. Build a detailed user prompt that combines identity and goal
  let userPrompt = `
${buildUserPrompt(input)}

# SPEED OPTIMIZATION:
Generate this page FAST. Do not over-elaborate.

# MANDATORY LAYOUT SECTIONS (HIGH-CONVERTING LANDING PAGE):
1. Hero Section with dynamic branding, strong headline, and clear Call to Action.
2. Lead Generation Form with industry-specific fields - MUST BE VISIBLE AND FUNCTIONAL. This is NON-NEGOTIABLE.
3. Industry Context (Benefits, Features, and Value Propositions).
4. Social Proof / Reviews / Testimonials.
5. Trust Building Section (stats, achievements, certifications, trust badges).
6. FAQs Section addressing common objections.
7. Simple Footer with contact information.

# CORE REQUIREMENTS:
- Generate a complete, high-converting landing page.
- Include strong hero section with compelling headline.
- Include CTA in strategic positions.
- Include industry-specific form with relevant fields.
- Include meaningful, benefit-driven content throughout.
- Include industry-relevant images (real estate: homes, healthcare: doctors, etc.).
- Include relevant video suggestions where useful (testimonials, demos, explainers).
- Include testimonials section with realistic customer quotes.
- Include FAQs section addressing common objections.
- Include trust-building sections (badges, stats, achievements).
- Include SEO-friendly headings with proper hierarchy (H1, H2, H3).
- Make layout depend on industry for optimal user experience.
- Form position should depend on business type (hero side, sticky, bottom, popup).
- Content should be persuasive and conversion-focused.
- Use modern landing page structure with alternating backgrounds.
- Vary section designs (bento, grid, list, split, etc.) for visual interest.
`;

  // 4. Handle Template Enrichment if applicable
  if (input.templateHtml) {
    userPrompt = `
    # CRITICAL TASK: SMART TEMPLATE CONTENT REPLACEMENT
    ${input.templateHtml}
    
    USER'S VISION: "${input.aiPrompt}"
    `;
  }

  // 5. Handle Vision / Image-to-Design
  if (input.figmaImage) {
    logger.info(`[AI] Image-to-Design detected. Incorporating vision analysis.`);
    // (Existing vision logic remains same but within one call)
    const imageMatch = input.figmaImage.match(/^data:(image\/[a-z]+);base64,(.+)$/);
    if (imageMatch) {
      const messages = [
        {
          role: 'user',
          content: [
            { type: 'image', source: { type: 'base64', media_type: imageMatch[1], data: imageMatch[2] } },
            { type: 'text', text: `Design this EXACT layout immediately. ${userPrompt}` }
          ]
        }
      ];
      return await callAI(messages, input.logoUrl, systemPrompt);
    }
  }

  return await callAI(userPrompt, input.logoUrl, systemPrompt);
};

const improveSectionContent = async ({ sectionType, currentContent, aiPrompt }) => {
  const prompt = `Improve this ${sectionType}: ${JSON.stringify(currentContent)}. Instruction: ${aiPrompt}`;
  return await callAI(prompt);
};

const generateProjectSuggestions = async ({ projectName, industry, projectDescription, services, pageTitles }) => {
  const servicesText = services && services.length > 0 ? services.join(', ') : 'various services';
  const pageTitlesText = pageTitles && pageTitles.length > 0 ? pageTitles.join(', ') : 'none';

  const prompt = `
    Generate 6 short landing page description suggestions for this business.

    Project Name: ${projectName}
    Industry: ${industry}
    Business Description: ${projectDescription || 'Not provided'}
    Services: ${servicesText}
    Existing Pages: ${pageTitlesText}

    Each suggestion should:
    - be 1 sentence
    - be concise (10-20 words)
    - be related to lead generation
    - be useful for a landing page
    - help the user quickly generate a page
    - be different from existing pages

    OUTPUT FORMAT:
    Return ONLY a JSON array of strings, like this:
    ["suggestion 1", "suggestion 2", "suggestion 3", "suggestion 4", "suggestion 5", "suggestion 6"]
    No other text, no markdown, no code blocks.
  `;

  const response = await callAI(prompt);
  
  try {
    // Try to parse as JSON array
    const parsed = JSON.parse(response);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    // If not an array, try to extract array from response
    const arrayMatch = response.match(/\[.*\]/s);
    if (arrayMatch) {
      return JSON.parse(arrayMatch[0]);
    }
    // Fallback: split by newlines and clean up
    return response.split('\n')
      .map(line => line.replace(/^["'\d\.\s-]+/, '').replace(/["'\s]+$/, '').trim())
      .filter(line => line.length > 5)
      .slice(0, 6);
  } catch (e) {
    // Fallback: split by newlines and clean up
    return response.split('\n')
      .map(line => line.replace(/^["'\d\.\s-]+/, '').replace(/["'\s]+$/, '').trim())
      .filter(line => line.length > 5)
      .slice(0, 6);
  }
};

const generateDescriptionSuggestion = async ({ pageName, industry, projectDesc, currentPrompt }) => {
  let prompt;

  if (!currentPrompt || currentPrompt.trim() === '') {
    // Case 1: Empty input - generate full landing page brief from scratch
    prompt = `
      You are an expert prompt engineer for an AI Landing Page Builder.
      Your task is to generate a detailed landing page description for a business in the "${industry}" industry.
      Page Name: "${pageName}"
      Project Context: ${projectDesc}

      The response should include:
      - business overview
      - target audience
      - key services
      - unique selling points
      - CTA goal
      - preferred tone
      - required sections (hero, services, testimonials, form, FAQ, contact)
      - suggested form fields (industry-specific)
      - image ideas
      - video ideas
      - trust building content
      - FAQ ideas

      Make the content suitable for generating a high-converting landing page.

      OUTPUT FORMAT:
      Generate a comprehensive landing page prompt that includes:
      - A clear opening statement starting with "Create a..." or "Design a..."
      - Target audience description
      - Required sections (hero section with CTA, services/features, testimonials, lead form, FAQ, contact section)
      - Specific form fields (name, phone, email, budget, etc. based on industry)
      - Trust badges and social proof elements
      - Design style recommendations
      - Call-to-action placement

      Make it 100-150 words, highly specific and conversion-focused.
      Return ONLY the raw string. No quotes.
    `;
  } else {
    // Case 2: User already typed something - expand and improve
    prompt = `
      Expand and improve this landing page idea into a complete landing page prompt.

      Include:
      - hero section
      - CTA
      - industry-specific form
      - testimonials
      - FAQs
      - trust badges
      - image ideas
      - video ideas
      - service sections
      - strong conversion-focused content

      User Input:
      ${currentPrompt}
      
      Additional Context:
      Page Name: "${pageName}"
      Industry: "${industry}"
      Project Description: ${projectDesc}

      OUTPUT FORMAT:
      Generate a comprehensive landing page prompt (150-250 words) that is ready to be used by an AI design engine.
      Return ONLY the raw string. No quotes.
    `;
  }

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const response = await anthropic.messages.create({
    model: CLAUDE_MODEL_CANDIDATES[0],
    max_tokens: 500,
    messages: [{ role: 'user', content: prompt }],
  });

  return response.content[0].text.trim().replace(/^"|"$/g, '');
};

/**
 * Generate a strategic landing page structure (Expert CRO Strategist)
 */
const generateStrategicStructure = async (input) => {
  const { businessName, industry, businessDescription, services = [], websiteContent = '' } = input;

  const systemPrompt = `
You are a World-Class Creative UX Strategist, Conversion Scientist, and Senior Art Director.
Your task is NOT just to structure a page, but to INNOVATE and DIFFERENTIATE.

### CORE BEHAVIOR:
1. DESIGN THINKING: Analyze the audience's emotional state and intent.
2. CREATIVE DIFFERENTIATION: Avoid generic blocks. Suggest modern, high-end UI patterns used by Apple, Stripe, and high-end design agencies.
3. FORM INNOVATION: Move beyond basic forms. Suggest multi-step flows, conversational UI, or interactive cost calculators to reduce friction.
4. EMOTIONAL HERO: Design a hero section that isn't just a headline—it's a "hook" with a strong visual and emotional narrative.

### OUTPUT FORMAT (STRICT JSON):
{
  "industry_context": {
    "category": "Specific Industry",
    "target_audience_profile": "Psychographic analysis of the user",
    "color_mood": "Color palette suggestion based on industry psychology",
    "typography_style": "Font pairing style (e.g., Bold Serif + Clean Sans)",
    "overall_feel": "Minimal / Premium / Urgent / Friendly"
  },
  "page_strategy": {
    "primary_conversion_goal": "e.g., Immediate Phone Call / High-Value Lead Form",
    "strategic_hook": "The 'Big Idea' that makes this page different"
  },
  "sections": [
    {
      "name": "Section Name",
      "purpose": "Conversion reasoning",
      "content": {
        "headline": "High-impact headline",
        "subheadline": "Benefit-driven microcopy",
        "points": ["Unique USPs"]
      },
      "innovation_idea": "🔥 MANDATORY: One creative idea (e.g., interactive element, sticky reveal, unique scroll effect)",
      "ui_ux_suggestion": "🎨 Design guidance (split layouts, card depth, micro-interactions)",
      "cta": "Text for the call to action"
    }
  ],
  "form_innovation": {
    "type": "Multi-step / Conversational / Simple / Calculator",
    "placement": "Hero / Sticky Side / Bottom",
    "fields": ["Necessary fields"],
    "interaction_ux": "How the user interacts (e.g. progress bar, inline validation)"
  },
  "conversion_notes": ["Why this layout will beat a generic template"],
  "design_directives": ["Specific visual rules to follow for premium quality"]
}
`;

  const userPrompt = `
INPUT DATA:
- Industry: ${industry}
- Business Name: ${businessName}
- Services: ${services.join(', ')}
- Description: ${businessDescription}
- Website/Context: ${websiteContent.substring(0, 5000)}

Think before generating. Adapt based on the industry automatically. Focus on conversions.
Generate ONLY the JSON object.
`;

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  let messages = [
    { role: 'user', content: systemPrompt + '\n\n' + userPrompt }
  ];

  if (input.figmaImage) {
    const imageMatch = input.figmaImage.match(/^data:(image\/[a-z]+);base64,(.+)$/);
    if (imageMatch) {
      messages = [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: imageMatch[1],
                data: imageMatch[2]
              }
            },
            {
              type: 'text',
              text: `${systemPrompt}\n\n${userPrompt}\n\nIMPORTANT: Use the provided design image as the master reference for the sections and layout in the JSON response.`
            }
          ]
        }
      ];
    }
  }

  const response = await anthropic.messages.create({
    model: CLAUDE_MODEL_CANDIDATES[0],
    max_tokens: 8192,
    messages: messages,
  });

  try {
    let text = response.content[0].text;
    // Remove markdown code blocks if present
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    // Try to parse as JSON
    try {
      return JSON.parse(text);
    } catch (parseErr) {
      // Fallback: try to extract JSON from the text
      logger.warn('Initial JSON parse failed, attempting extraction:', parseErr.message);
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          return JSON.parse(jsonMatch[0]);
        } catch (extractErr) {
          logger.error('JSON extraction also failed:', extractErr.message);
          throw new Error('Strategic Plan Generation Failed');
        }
      }
      throw new Error('Strategic Plan Generation Failed');
    }
  } catch (err) {
    logger.error('Failed to parse CRO strategy JSON:', err.message);
    throw new Error('Strategic Plan Generation Failed');
  }
};

/**
 * AI Landing Page Optimization Engine
 * Fixes, improves, and upgrades existing landing pages using real data.
 */
const optimizeStrategicStructure = async ({ projectData, scrapedData, existingPage }) => {
  const systemPrompt = `
You are a World-Class Landing Page Optimization Engine and Senior CRO Architect.
Your job is NOT to generate a basic page, but to FIX, IMPROVE, and UPGRADE an existing one using real-world data.

### CORE OBJECTIVES:
1. SMART IMAGE MAPPING: Analyze scrapedData images (banners, listings, products) and map them intelligently to hero, services, or gallery sections.
2. INDUSTRY-SPECIFIC LOGIC: 
   - Real Estate: Property search UI, buy/rent/sell flags, city-based cards.
   - SaaS: Demo CTAs, feature grids, integration trust-badges.
   - Service: Focus on high-visibility trust scores and lead-capture forms.
3. FORM OPTIMIZATION: Decide the best position and type of form based on friction reduction.
4. INNOVATION LAYER: Every section must have one creative improvement (interactive UI, sticky triggers, etc.)

### OUTPUT FORMAT (STRICT JSON):
{
  "improvements": {
    "structure_changes": ["Briefly describe what was moved/changed"],
    "removed_sections": ["What was redundant"],
    "added_sections": ["What new CRO elements were added"]
  },
  "images": {
    "hero": "Scraped URL for hero",
    "mapped": {
      "section_name": "Mapped image URL"
    }
  },
  "sections": [
    {
      "name": "Section Name",
      "content": "Updated high-converting content object",
      "innovation": "🔥 Mandatory innovation details",
      "ui_suggestion": "🎨 Premium UX/UI layout guidance"
    }
  ],
  "forms": [
    {
      "position": "hero | mid | bottom | sticky",
      "type": "search | lead | detailed",
      "fields": ["Required fields"],
      "cta": "Conversion-focused text"
    }
  ],
  "conversion_score_estimate": "Predicted improvement percentage",
  "notes": ["Expert rationale on the changes"]
}
`;

  const userPrompt = `
# INPUT DATA:
- Project Context: ${JSON.stringify(projectData)}
- Scraped Content: ${JSON.stringify(scrapedData)}
- Existing Page Blueprint: ${JSON.stringify(existingPage)}

# TASK:
Transform this existing structure into a high-converting masterpiece. Use the real scraped images intentionally. If an image looks like a banner, use it for the Hero. If they are product/property photos, use them in cards.
`;

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const response = await anthropic.messages.create({
    model: CLAUDE_MODEL_CANDIDATES[0],
    max_tokens: 4000,
    temperature: 0.1,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
  });

  try {
    const text = response.content[0].text;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    return JSON.parse(jsonMatch ? jsonMatch[0] : text);
  } catch (err) {
    logger.error('Optimization Engine JSON Error:', err.message);
    throw new Error('Optimization Engine Failed');
  }
};

module.exports = {
  generateLandingPageContent,
  improveSectionContent,
  generateDescriptionSuggestion,
  generateProjectSuggestions,
  generateStrategicStructure,
  optimizeStrategicStructure
};