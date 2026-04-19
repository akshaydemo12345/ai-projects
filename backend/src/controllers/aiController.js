'use strict';

const { z } = require('zod');
const { generateLandingPageContent } = require('../services/aiService');
const { analyzeWebsite: analyzeService, inspectWebsite: inspectService, extractProjectData } = require('../services/analyzeService');
const { fetchFigmaDesign } = require('../services/figmaService');
const { scrapeWebsiteStructure } = require('../services/structuredScrapeService');
const Page = require('../models/Page');
const Project = require('../models/Project');
const User = require('../models/User');

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
      const pageUpdate = {
        content: finalContent,
        seo: finalContent.seo,
        status: 'draft',
        updatedAt: Date.now(),
        ...(input.figmaUrl && { designUrl: input.figmaUrl })
      };
      
      await Page.findOneAndUpdate(
        { _id: input.pageId, userId: req.user._id },
        pageUpdate
      );
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

    // Credit check
    const user = await User.findById(req.user._id);
    if (user.credits <= 0) {
      return res.status(402).json({ status: 'fail', message: 'Insufficient credits' });
    }

    // Call service
    const aiContent = await analyzeService(targetUrl);

    // Deduct 1 credit
    user.credits = Math.max(0, user.credits - 1);
    await user.save({ validateBeforeSave: false });

    // Optionally update page
    let updatedPage = null;
    if (pageId) {
      updatedPage = await Page.findOneAndUpdate(
        { _id: pageId, userId: req.user._id },
        { 
          content: aiContent,
          seo: aiContent.seo || {},
          updatedAt: Date.now() 
        },
        { new: true, runValidators: false }
      );
    }

    return res.status(200).json({
      status: 'success',
      data: {
        content: aiContent,
        creditsRemaining: user.credits,
        ...(updatedPage && { page: updatedPage }),
      },
    });
  } catch (err) {
    if (err.message?.includes('OpenAI') || err.message?.includes('HTTP')) {
      return res.status(502).json({
        status: 'fail',
        message: err.message
      });
    }
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
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ status: 'fail', message: 'URL is required' });
    }

    console.log('Starting extraction for URL:', url);
    const data = await extractProjectData(url);
    console.log('Extraction completed successfully:', JSON.stringify(data).substring(0, 200));

    if (!data) {
      return res.status(500).json({ status: 'fail', message: 'No data returned from extraction' });
    }

    res.status(200).json({
      status: 'success',
      data
    });
  } catch (err) {
    console.error('Extraction error:', err.message);
    console.error('Error stack:', err.stack);
    next(err);
  }
};

/**
 * @route   POST /ai/structured-scrape
 * @desc    Scrape website and return structured data for landing page generation
 * @access  Private
 */
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
      data: { improvedContent: improved, creditsRemaining: user.credits }
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
    const { pageName, industry, projectDesc, currentPrompt } = req.body;

    if (!pageName || !industry) {
      return res.status(400).json({ status: 'fail', message: 'pageName and industry are required' });
    }

    const { generateDescriptionSuggestion } = require('../services/aiService');
    const suggestion = await generateDescriptionSuggestion({ pageName, industry, projectDesc, currentPrompt });

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
      data: { plan }
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
      data: optimizedPlan
    });
  } catch (err) {
    next(err);
  }
};
