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

    // 2. Fetch Figma Design (if URL provided)
    let figmaData = null;
    if (input.figmaUrl) {
      figmaData = await fetchFigmaDesign(input.figmaUrl, process.env.FIGMA_ACCESS_TOKEN);
    }

    // 3. Check user credits
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(401).json({ status: 'fail', message: 'User not found' });
    }

    if (user.credits <= 0) {
      return res.status(402).json({
        status: 'fail',
        message: 'Insufficient credits. Please upgrade your plan.',
      });
    }

    // 4. Call AI service with Figma Data
    const aiContent = await generateLandingPageContent({
      ...input,
      figmaData,
    });

    // 5. Deduct 1 credit per generation
    user.credits = Math.max(0, user.credits - 1);
    await user.save({ validateBeforeSave: false });

    // 6. Optionally attach AI content to an existing page
    let updatedPage = null;
    if (input.pageId) {
      updatedPage = await Page.findOneAndUpdate(
        { _id: input.pageId, userId: req.user._id },
        {
          content: aiContent,
          seo: aiContent.seo || {},
          ...(input.figmaUrl && { figmaUrl: input.figmaUrl }),
          updatedAt: Date.now(),
        },
        { new: true, runValidators: false }
      );
    }

    // 7. Respond
    return res.status(200).json({
      status: 'success',
      data: {
        content: aiContent,
        creditsRemaining: user.credits,
        ...(updatedPage && { page: updatedPage }),
        ...(figmaData && { figmaDesignMeta: figmaData }),
      },
    });
  } catch (err) {
    // Surface AI-specific errors cleanly
    if (err.message?.startsWith('OpenAI') || err.message?.startsWith('Failed to parse')) {
      return res.status(502).json({ status: 'fail', message: err.message });
    }
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
