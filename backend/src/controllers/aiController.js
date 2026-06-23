'use strict';

const { z } = require('zod');
const { generateLandingPageContent } = require('../services/aiService');
const { analyzeWebsite: analyzeService, inspectWebsite: inspectService, extractProjectData } = require('../services/analyzeService');
const { fetchFigmaDesign } = require('../services/figmaService');
const { scrapeWebsiteStructure, buildWebsiteProfile, SiteBlockedError } = require('../services/structuredScrapeService');
// const { extractThemeProfile, mapThemeProfileToThemeData } = require('../services/themeStyleExtractorService');
const Page = require('../models/Page');
const Project = require('../models/Project');
const User = require('../models/User');
const logger = require('../utils/logger');

// ─── Zod Validation Schema ─────────────────────────────────────────────────────
const generateSchema = z.object({
  businessName: z.string().min(1, 'businessName is required'),
  industry: z.string().min(1, 'industry is required'),
  pageType: z.enum(['lead generation', 'sales', 'waitlist', 'coming soon', 'event'], {
    errorMap: () => ({
      message: 'pageType must be one of: lead generation, sales, waitlist, coming soon, event',
    }),
  }),
  targetAudience: z.string().optional(),
  businessDescription: z.string().min(10, 'businessDescription must be at least 10 characters'),
  ctaText: z.string().optional(),
  tone: z.string().optional(),
  aiPrompt: z.string().optional(),
  templateHtml: z.string().optional(),
  figmaUrl: z.string().url('Invalid Figma URL').nullable().or(z.literal('')).optional(),
  pageId: z.string().optional(),
  services: z.array(z.string()).optional(),
  websiteContent: z.string().optional(),
});

const analyzeWebsiteSchema = z.object({
  websiteUrl: z.string().url('Invalid website URL required'),
  url: z.string().url().optional(), // Support both for compatibility
  pageId: z.string().optional(),
});

const structuredScrapeSchema = z.object({
  websiteUrl: z.string().url('Invalid website URL required'),
});

// ─── POST /ai/generate ────────────────────────────────────────────────────────
exports.generateContent = async (req, res, next) => {
  try {
    // 1. Validate input
    const parsed = generateSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        status: 'fail',
        message: 'Validation failed',
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const input = parsed.data;
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ status: 'fail', message: 'User not found' });
    }
    if (user.credits <= 0) {
      return res.status(402).json({ status: 'fail', message: 'Insufficient credits' });
    }

    // ─── Plan-based feature restrictions ─────────────────────────────────────────
    // Figma import = Pro/Enterprise only
    if (input.figmaUrl && user.plan === 'free') {
      return res.status(403).json({
        status: 'fail',
        message: 'Figma import is a Pro feature. Please upgrade your plan.',
        upgradeRequired: true,
        requiredPlan: 'pro',
      });
    }

    // Fetch project scraped images if pageId is provided
    let scrapedImages = input.scrapedImages || [];
    if (input.pageId) {
      try {
        const page = await Page.findById(input.pageId);
        if (page && page.projectId) {
          const project = await Project.findById(page.projectId);
          if (project && project.scrapedData && project.scrapedData.images && project.scrapedData.images.length > 0) {
            scrapedImages = project.scrapedData.images;
          }
        }
      } catch (err) {
        console.error('Error fetching project scraped images:', err.message);
      }
    }

    // No pageId: generate synchronously so frontend can consume real AI HTML/CSS immediately.
    if (!input.pageId) {
      const aiContent = await generateLandingPageContent({
        ...input
      });
      user.credits = Math.max(0, user.credits - 1);
      await user.save({ validateBeforeSave: false });

      return res.status(200).json({
        status: 'success',
        data: {
          content: aiContent,
          creditsRemaining: user.credits,
        },
      });
    }

    // 4. Update page status to 'generating' early if pageId provided
    if (input.pageId) {
      await Page.findOneAndUpdate(
        { _id: input.pageId, userId: req.user._id },
        { status: 'generating' }
      );
    }

    // 5. Respond immediately for page-linked generation (background process begins)
    res.status(202).json({
      status: 'success',
      message: 'AI generation started in the background.',
      data: {
        pageId: input.pageId,
        creditsRemaining: user.credits,
      },
    });

    // ─── Background Job ───────────────────────────────────────────────────────
    setImmediate(async () => {
      try {
        // A. Fetch Figma Design (if URL provided)
        let figmaData = null;
        if (input.figmaUrl) {
          try {
            figmaData = await fetchFigmaDesign(input.figmaUrl, process.env.FIGMA_ACCESS_TOKEN);
          } catch (figmaErr) {
            console.error('Background Figma error:', figmaErr.message);
          }
        }

        // B. Call AI service with scraped data
        const aiContent = await generateLandingPageContent({
          ...input,
          figmaData
        });

        // D. Deduct 1 credit on success
        await User.findByIdAndUpdate(req.user._id, { $inc: { credits: -1 } });

        // E. Add default SEO metadata if not present
        const finalContent = { ...aiContent };
        if (!finalContent.seo) {
          finalContent.seo = {
            title: `${input.businessName} - Professional ${input.industry} Services`,
            description: input.businessDescription.substring(0, 160),
            keywords: input.keywords || []
          };
        }

        // F. Update Page with AI content and set status back to 'draft'
        if (input.pageId) {
          const page = await Page.findOne({ _id: input.pageId, userId: req.user._id });
          if (page) {
            page.content = finalContent;
            page.seo = finalContent.seo;

            const currentUsage = page.aiUsage || { promptTokens: 0, completionTokens: 0, totalTokens: 0, cost: 0 };

            page.aiUsage = {
              promptTokens: (currentUsage.promptTokens || 0) + aiContent.aiUsage.promptTokens,
              completionTokens: (currentUsage.completionTokens || 0) + aiContent.aiUsage.completionTokens,
              totalTokens: (currentUsage.totalTokens || 0) + aiContent.aiUsage.totalTokens,
              cost: (currentUsage.cost || 0) + aiContent.aiUsage.cost,
              model: aiContent.aiUsage.model,
              currency: 'USD',
              lastUsageAt: Date.now()
            };

            page.aiUsageHistory.push({
              action: input.figmaUrl ? 'Figma to Page' : 'Regeneration',
              ...aiContent.aiUsage,
              createdAt: Date.now()
            });
            page.status = 'draft';
            page.updatedAt = Date.now();
            if (input.figmaUrl) page.designUrl = input.figmaUrl;

            await page.save();
          }
        }

        console.log(`AI Page Generation successful for user ${req.user._id}`);

      } catch (err) {
        console.error('Background AI generation failed:', err.message);

        // E. Revert status on failure so user can retry
        if (input.pageId) {
          await Page.findByIdAndUpdate(input.pageId, { status: 'draft' });
        }
      }
    });

  } catch (err) {
    next(err);
  }
};

/**
 * @route   POST /ai/inspect-website
 * @desc    Quickly fetch metadata (logo, colors, title) from a URL without generating a full page
 * @access  Private
 */
exports.inspectWebsite = async (req, res, next) => {
  try {
    const { url, websiteUrl } = req.body;
    const targetUrl = url || websiteUrl;

    if (!targetUrl) {
      return res.status(400).json({ status: 'fail', message: 'URL is required' });
    }

    const metadata = await inspectService(targetUrl);

    res.status(200).json({
      status: 'success',
      data: { metadata }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @route   POST /ai/analyze-website
 * @desc    Analyze an existing website and generate an optimized landing page
 * @access  Private
 */
exports.analyzeWebsite = async (req, res, next) => {
  try {
    const parsed = analyzeWebsiteSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        status: 'fail',
        message: 'Validation failed',
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const { websiteUrl, url, pageId } = parsed.data;
    const targetUrl = websiteUrl || url;

    const scraped = await scrapeWebsiteStructure(targetUrl);
    const websiteProfile = buildWebsiteProfile(scraped, null);

    // Persist to project if pageId provided
    if (pageId) {
      setImmediate(async () => {
        try {
          const page = await Page.findById(pageId);
          if (page?.projectId) {
            await Project.findByIdAndUpdate(
              page.projectId,
              {
                websiteProfile,
                'scrapeMeta.status': 'success',
                'scrapeMeta.finishedAt': new Date(),
              },
              { runValidators: false }
            );
          }
        } catch (bgErr) {
          console.error('[aiController] analyzeWebsite bg persist failed:', bgErr.message);
        }
      });
    }

    return res.status(200).json({
      status: 'success',
      data: { websiteProfile, scrapedAt: scraped.scrapedAt },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @route   POST /ai/extract-project
 * @desc    Extract SEO data, services, and branding from a URL for project prefill
 * @access  Private
 */
exports.extractProject = async (req, res, next) => {
  try {
    const { url, projectId, skipVisualTheme } = req.body;
    if (!url) {
      return res.status(400).json({ status: 'fail', message: 'URL is required' });
    }

    const scraped = await scrapeWebsiteStructure(url);

    // Best-effort Playwright visual-theme pass. Runs alongside the existing
    // heuristic scrape and, when it succeeds, takes priority inside
    // websiteProfile.theme (header/navigation/buttons/footer) plus adds the
    // additive `typography` and `shape` sub-blocks. Any failure here (site
    // blocks automation, Playwright not installed, timeout, etc.) is logged
    // and swallowed — it must never break project creation.
    let themeData = null;
    if (!skipVisualTheme) {
      try {
        const visualProfile = await extractThemeProfile(url, { screenshot: false, timeout: 25_000 });
        themeData = mapThemeProfileToThemeData(visualProfile);
      } catch (themeErr) {
        logger.warn(`[aiController] visual theme extraction skipped: ${themeErr.message}`);
      }
    }

    const websiteProfile = buildWebsiteProfile(scraped, themeData);

    if (projectId && require('mongoose').Types.ObjectId.isValid(projectId)) {
      try {
        await Project.findOneAndUpdate(
          { _id: projectId, userId: req.user._id },
          {
            websiteProfile,
            'scrapeMeta.status': 'success',
            'scrapeMeta.finishedAt': new Date(),
          },
          { runValidators: false }
        );
      } catch (persistErr) {
        console.error('[aiController] extractProject persist failed:', persistErr.message);
      }
    }

    // Return data in format frontend expects
    return res.status(200).json({
      status: 'success',
      data: {
        websiteProfile,
        // Logo-specific colors (extracted directly from logo image via Vibrant / SVG)
        logoColors: websiteProfile?.logoColors || { primary: null, secondary: null, palette: [], source: null },
        // Legacy fields for compatibility
        projectName: websiteProfile?.identity?.name || '',
        projectDesc: websiteProfile?.identity?.description || '',
        projectLogo: websiteProfile?.identity?.logoUrl || '',
        favicon: websiteProfile?.identity?.favicon || '',
        // primaryColor / secondaryColor: prefer logo-extracted colors, fall back to page-wide colors
        primaryColor: websiteProfile?.logoColors?.primary || websiteProfile?.colors?.primary || '',
        secondaryColor: websiteProfile?.logoColors?.secondary || websiteProfile?.colors?.secondary || '',
        accentColor: websiteProfile?.colors?.accent || '',
        colors: websiteProfile?.colors?.palette || [],
        services: (websiteProfile?.content?.services || []).map(s => s.title),
        keywords: websiteProfile?.seo?.keywords || [],
        industry: websiteProfile?.industry?.industry || '',
        subIndustry: websiteProfile?.industry?.subIndustry || '',
        // Images extracted from website (filter out inline-svg and data URIs for display)
        scrapedImages: (websiteProfile?.images || []).filter(img =>
          img.url && !img.url.startsWith('inline-svg:') && !img.url.startsWith('data:')
        ),
        // Full scraped data for downstream consumption
        scrapedData: {
          images: websiteProfile?.images || [],
          favicon: websiteProfile?.identity?.favicon || '',
          screenshot: scraped?.screenshot || null,
          industry: websiteProfile?.industry?.industry || '',
          subIndustry: websiteProfile?.industry?.subIndustry || '',
        },
      },
    });
  } catch (err) {
    console.error('[aiController] extractProject failed:', err.message);
    if (err.code === 'SITE_BLOCKED') {
      return res.status(422).json({
        status: 'fail',
        code: 'SITE_BLOCKED',
        message: `This website is blocking automated access. Please fill in your project details manually.`,
      });
    }
    next(err);
  }
};

/**
 * @route   POST /ai/extract-theme-profile
 * @desc    Use Playwright to load a live URL and extract a *visual theme
 *          profile* (brand colors, typography, button styles, shape/shadow
 *          language, logo/favicon) so a new project's landing page can be
 *          styled to match the customer's existing website.
 * @access  Private
 */
exports.extractThemeStyle = async (req, res, next) => {
  try {
    const { url, projectId, includeScreenshot } = req.body;
    if (!url) {
      return res.status(400).json({ status: 'fail', message: 'URL is required' });
    }

    const themeProfile = await extractThemeProfile(url, {
      screenshot: includeScreenshot !== false,
    });

    if (projectId && require('mongoose').Types.ObjectId.isValid(projectId)) {
      try {
        await Project.findOneAndUpdate(
          { _id: projectId, userId: req.user._id },
          { 'scrapeMeta.visualThemeProfile': themeProfile },
          { runValidators: false }
        );
      } catch (persistErr) {
        logger.error(`[aiController] extractThemeStyle persist failed: ${persistErr.message}`);
      }
    }

    return res.status(200).json({ status: 'success', data: { themeProfile } });
  } catch (err) {
    logger.error(`[aiController] extractThemeStyle failed: ${err.message}`);
    if (err.code === 'SITE_BLOCKED') {
      return res.status(422).json({
        status: 'fail',
        code: 'SITE_BLOCKED',
        message: 'This website is blocking automated access. Please try a different URL.',
      });
    }
    if (err.code === 'PLAYWRIGHT_NOT_INSTALLED') {
      return res.status(500).json({
        status: 'error',
        code: 'PLAYWRIGHT_NOT_INSTALLED',
        message: err.message,
      });
    }
    next(err);
  }
};


exports.structuredScrape = async (req, res, next) => {
  try {
    const parsed = structuredScrapeSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        status: 'fail',
        message: 'Validation failed',
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const { websiteUrl } = parsed.data;

    console.log('Starting structured scrape for URL:', websiteUrl);
    const result = await scrapeWebsiteStructure(websiteUrl);
    console.log('Structured scrape completed successfully');

    res.status(200).json({
      status: 'success',
      data: result
    });
  } catch (err) {
    console.error('Structured scrape error:', err.message);
    if (err.code === 'SITE_BLOCKED') {
      return res.status(422).json({
        status: 'fail',
        code: 'SITE_BLOCKED',
        message: `This website is blocking automated access. Please fill in your project details manually.`,
      });
    }
    next(err);
  }
};

/**
 * @route   POST /ai/improve
 * @desc    Improve a specific section using AI
 * @access  Private
 */
exports.improveSection = async (req, res, next) => {
  try {
    const { sectionType, currentContent, aiPrompt, pageId } = req.body;

    if (!sectionType || !currentContent) {
      return res.status(400).json({ status: 'fail', message: 'sectionType and currentContent are required' });
    }

    // Credit check
    const user = await User.findById(req.user._id);
    if (user.credits <= 0) {
      return res.status(402).json({ status: 'fail', message: 'Insufficient credits' });
    }

    // Call service
    const { improveSectionContent } = require('../services/aiService');
    const improved = await improveSectionContent({ sectionType, currentContent, aiPrompt });

    // Deduct 1 credit
    user.credits = Math.max(0, user.credits - 1);
    await user.save({ validateBeforeSave: false });

    return res.status(200).json({
      status: 'success',
      data: {
        improvedContent: improved.suggestion || improved,
        creditsRemaining: user.credits,
        aiUsage: improved.aiUsage
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @route   POST /ai/editor-chat
 * @desc    GrapesJS editor AI assistant — returns structured JSON for element modification
 * @access  Private
 */
exports.editorChat = async (req, res, next) => {
  try {
    const { elementTag, elementHtml, elementCss, instruction } = req.body;

    if (!elementHtml || !instruction) {
      return res.status(400).json({ status: 'fail', message: 'elementHtml and instruction are required' });
    }

    const { editorChatModify } = require('../services/aiService');
    const result = await editorChatModify({ elementTag: elementTag || 'div', elementHtml, elementCss: elementCss || '{}', instruction });

    return res.status(200).json({
      status: 'success',
      data: result  // { action, css, text, html, summary }
    });
  } catch (err) {
    next(err);
  }
};
/**
 * @route   POST /ai/generate-description
 * @desc    Generate a suggested AI prompt for a landing page
 * @access  Private
 */
exports.generateDescription = async (req, res, next) => {
  try {
    // ui-state colors/fonts override scraped data — always sent from frontend live form
    const {
      pageName, industry, projectDesc, currentPrompt, projectId,
      // live UI overrides (user may have changed these after scraping)
      uiPrimaryColor, uiSecondaryColor, uiAccentColor,
      uiBodyFont, uiHeadingFont,
    } = req.body;

    if (!pageName || !industry) {
      return res.status(400).json({ status: 'fail', message: 'pageName and industry are required' });
    }

    // Always fetch fresh scraped data from DB — never trust client-cached copies
    let websiteProfile = null;
    let scrapedData = null;
    if (projectId) {
      try {
        const proj = await Project.findById(projectId)
          .select('websiteProfile scrapedData')
          .lean();
        if (proj) {
          websiteProfile = proj.websiteProfile || null;
          scrapedData = proj.scrapedData || null;
        }
      } catch (_) { /* non-fatal — proceed without scraped context */ }
    }

    // Merge live UI color/font overrides on top of scraped values
    // so the prompt reflects exactly what the user currently has set
    const uiOverrides = {
      primaryColor: uiPrimaryColor || null,
      secondaryColor: uiSecondaryColor || null,
      accentColor: uiAccentColor || null,
      bodyFont: uiBodyFont || null,
      headingFont: uiHeadingFont || null,
    };

    const { generateDescriptionSuggestion } = require('../services/aiService');
    const suggestion = await generateDescriptionSuggestion({
      pageName, industry, projectDesc, currentPrompt,
      websiteProfile,
      scrapedData,
      uiOverrides,
    });

    return res.status(200).json({
      status: 'success',
      data: { suggestion }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @route   POST /ai/project-suggestions
 * @desc    Generate landing page description suggestions based on project data
 * @access  Private
 */
exports.getProjectSuggestions = async (req, res, next) => {
  try {
    const { projectId } = req.body;

    if (!projectId) {
      return res.status(400).json({ status: 'fail', message: 'projectId is required' });
    }

    const Project = require('../models/Project');
    const Page = require('../models/Page');

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ status: 'fail', message: 'Project not found' });
    }

    // Get existing pages for context
    const existingPages = await Page.find({ projectId, isDeleted: { $ne: true } })
      .select('title')
      .limit(10);

    const pageTitles = existingPages.map(p => p.title).filter(Boolean);

    const { generateProjectSuggestions } = require('../services/aiService');
    const suggestions = await generateProjectSuggestions({
      projectName: project.name,
      industry: project.industry,
      projectDescription: project.description,
      services: project.services || [],
      pageTitles
    });

    return res.status(200).json({
      status: 'success',
      data: { suggestions }
    });
  } catch (err) {
    next(err);
  }
};
/**
 * @route   POST /ai/strategic-plan
 * @desc    Generate a conversion-optimized landing page structure and form strategy
 * @access  Private
 */
exports.getStrategicPlan = async (req, res, next) => {
  try {
    const { businessName, industry, businessDescription, services, websiteContent } = req.body;

    if (!businessName || !industry || !businessDescription) {
      return res.status(400).json({
        status: 'fail',
        message: 'businessName, industry, and businessDescription are required'
      });
    }

    const { generateStrategicStructure } = require('../services/aiService');
    const plan = await generateStrategicStructure({
      businessName,
      industry,
      businessDescription,
      services: services || [],
      websiteContent: websiteContent || ''
    });

    res.status(200).json({
      status: 'success',
      data: {
        plan: plan.plan,
        aiUsage: plan.aiUsage
      }
    });
  } catch (err) {
    next(err);
  }
};
/**
 * @route   POST /ai/optimize-page
 * @desc    Upgrade an existing landing page using scraped data and CRO logic
 * @access  Private
 */
exports.optimizePage = async (req, res, next) => {
  try {
    const { projectData, scrapedData, existingPage } = req.body;

    const { optimizeStrategicStructure } = require('../services/aiService');
    const optimizedPlan = await optimizeStrategicStructure({ projectData, scrapedData, existingPage });

    return res.status(200).json({
      status: 'success',
      data: {
        ...optimizedPlan.plan,
        aiUsage: optimizedPlan.aiUsage
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @route   GET /ai/proxy-image
 * @desc    Fetch and proxy external images to avoid CORS issues
 * @query   url - The image URL to fetch
 * @access  Public (rate-limited)
 */
exports.proxyImage = async (req, res, next) => {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({ status: 'fail', message: 'Image URL required' });
    }

    // Validate URL is HTTP(S)
    if (!/^https?:\/\/.{5,}/.test(url)) {
      return res.status(400).json({ status: 'fail', message: 'Invalid image URL' });
    }

    const axios = require('axios');

    // Derive a same-origin Referer/Origin from the target URL itself.
    // Many WordPress hosts / CDNs (hotlink protection) will 403 or return a
    // placeholder image when a request arrives with no Referer at all, which
    // is exactly what was happening here for *.wp-content/uploads/* assets.
    let originHeader = '';
    try {
      const parsedTarget = new URL(url);
      originHeader = `${parsedTarget.protocol}//${parsedTarget.host}`;
    } catch (e) {
      // url already validated above, but guard anyway
    }

    // Fetch the image with timeout
    const response = await axios.get(url, {
      timeout: 8000,
      responseType: 'arraybuffer',
      maxRedirects: 5,
      // Treat any non-2xx as an error so it lands in the catch block below
      // instead of being piped back as if it were a valid image.
      validateStatus: (status) => status >= 200 && status < 300,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
        ...(originHeader ? { Referer: `${originHeader}/`, Origin: originHeader } : {})
      }
    });

    const contentType = response.headers['content-type'] || 'image/png';

    // Guard against hosts that return a 200 HTML error/placeholder page
    // instead of the actual image (common with hotlink-protection plugins).
    if (!contentType.startsWith('image/')) {
      throw new Error(`Upstream did not return an image (content-type: ${contentType})`);
    }

    // Set cache headers for 30 days
    res.set('Content-Type', contentType);
    res.set('Cache-Control', 'public, max-age=2592000');
    res.set('Access-Control-Allow-Origin', '*');

    return res.send(response.data);
  } catch (err) {
    // Log the real reason so failures like hotlink-protection 403s, DNS
    // errors, or timeouts are actually visible instead of silently turning
    // into an indistinguishable blank image every time.
    logger.warn(`[proxyImage] Failed to fetch "${req.query.url}": ${err.response?.status || ''} ${err.message}`);

    // Let the frontend know this one failed (it already retries via the
    // same proxy URL once on <img onError>, then falls back to favicon /
    // hides the element — see CreateProjectFlow.tsx). A 200 + transparent
    // pixel made that fallback chain impossible to trigger.
    return res.status(502).json({
      status: 'fail',
      message: 'Unable to fetch the requested image from its source.'
    });
  }
};

/**
 * @route   GET /ai/getimg-balance
 * @desc    Fetch real-time GetImg.ai API balance
 * @access  Private
 */
exports.getImgBalance = async (req, res, next) => {
  try {
    const fetch = require('node-fetch') || global.fetch; // fallback if needed
    const API_KEY = process.env.GETIMG_API_KEY || '3eN1TZwy915cfl344JDr5FKOQGtrRTV8MsKS519K9nqhWakXqh5bU9BU6iwebRIorqNuMYF7hxK3V85jZ1F3ZKAxBbqZq3wQ';
    const actualKey = API_KEY.startsWith('key-') ? API_KEY : `key-${API_KEY}`;

    const response = await fetch('https://api.getimg.ai/v1/account/balance', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${actualKey}`,
        Accept: 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ status: 'fail', message: `GetImg API Error: ${errorText}` });
    }

    const data = await response.json();
    return res.status(200).json({ status: 'success', data });
  } catch (err) {
    next(err);
  }
};