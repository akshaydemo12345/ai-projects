'use strict';

const { z } = require('zod');
const { generateLandingPageContent } = require('../services/aiService');
const { analyzeWebsite: analyzeService } = require('../services/analyzeService');
const { fetchFigmaDesign } = require('../services/figmaService');
const Page = require('../models/Page');
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
});

const analyzeWebsiteSchema = z.object({
  websiteUrl: z.string().url('Invalid website URL required'),
  pageId: z.string().optional(), // Optional: if provided, update existing page with the analysis
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

    // 4. Update page status to 'generating' early if pageId provided
    if (input.pageId) {
      await Page.findOneAndUpdate(
        { _id: input.pageId, userId: req.user._id },
        { status: 'generating' }
      );
    }

    // 5. Respond immediately (Background process begins)
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

        // B. Call AI service
        const aiContent = await generateLandingPageContent({
          ...input,
          figmaData,
        });

        // C. Update Page with AI content and set status back to 'draft'
        if (input.pageId) {
          await Page.findOneAndUpdate(
            { _id: input.pageId, userId: req.user._id },
            {
              content: aiContent,
              seo: aiContent.seo || { 
                title: `${input.businessName} - High Converting Landing Page`,
                description: input.businessDescription.substring(0, 160)
              },
              status: 'draft',
              updatedAt: Date.now(),
              ...(input.figmaUrl && { designUrl: input.figmaUrl })
            }
          );
        }

        // D. Deduct 1 credit on success
        await User.findByIdAndUpdate(req.user._id, { $inc: { credits: -1 } });
        
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

    const { websiteUrl, pageId } = parsed.data;

    // Credit check
    const user = await User.findById(req.user._id);
    if (user.credits <= 0) {
      return res.status(402).json({ status: 'fail', message: 'Insufficient credits' });
    }

    // Call service
    const aiContent = await analyzeService(websiteUrl);

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
