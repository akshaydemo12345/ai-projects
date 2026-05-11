'use strict';

const User = require('../models/User');
const Page = require('../models/Page');
const AppError = require('../utils/AppError');
const { z } = require('zod');

// ─── GET /user/me ─────────────────────────────────────────────────────────────
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-refreshToken -passwordResetToken -passwordResetExpiresAt');

    res.status(200).json({ status: 'success', data: { user } });
  } catch (err) {
    next(err);
  }
};

// ─── PATCH /user/update-profile ───────────────────────────────────────────────
exports.updateProfile = async (req, res, next) => {
  try {
    const schema = z.object({
      name: z.string().min(2).optional(),
      avatar: z.string().url('Invalid avatar URL').optional(),
    });

    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return next(new AppError(Object.values(parsed.error.flatten().fieldErrors).flat().join('. '), 400));
    }

    // Prevent updating sensitive fields via this route
    const { name, avatar } = parsed.data;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, avatar },
      { new: true, runValidators: true }
    ).select('-refreshToken -password');

    res.status(200).json({ status: 'success', data: { user } });
  } catch (err) {
    next(err);
  }
};

// ─── PATCH /user/change-password ──────────────────────────────────────────────
exports.changePassword = async (req, res, next) => {
  try {
    const schema = z.object({
      currentPassword: z.string().min(1, 'Current password is required'),
      newPassword: z.string().min(8, 'New password must be at least 8 characters'),
    });

    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return next(new AppError(Object.values(parsed.error.flatten().fieldErrors).flat().join('. '), 400));
    }

    const { currentPassword, newPassword } = parsed.data;

    const user = await User.findById(req.user._id).select('+password');
    if (!user || !(await user.comparePassword(currentPassword))) {
      return next(new AppError('Current password is incorrect', 401));
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ status: 'success', message: 'Password changed successfully' });
  } catch (err) {
    next(err);
  }
};

// ─── GET /user/credits ────────────────────────────────────────────────────────
exports.getCredits = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('credits plan');

    res.status(200).json({
      status: 'success',
      data: {
        credits: user.credits,
        plan: user.plan,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ─── POST /user/upgrade-plan ──────────────────────────────────────────────────
// In production: integrate with Stripe/Razorpay. For now: direct upgrade for testing.
exports.upgradePlan = async (req, res, next) => {
  try {
    const PLAN_CREDITS = { free: 100, pro: 500, enterprise: 9999 };

    const schema = z.object({
      plan: z.enum(['free', 'pro', 'enterprise'], {
        errorMap: () => ({ message: 'Plan must be one of: free, pro, enterprise' }),
      }),
    });

    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return next(new AppError(Object.values(parsed.error.flatten().fieldErrors).flat().join('. '), 400));
    }

    const { plan } = parsed.data;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        plan,
        credits: PLAN_CREDITS[plan],
      },
      { new: true }
    ).select('plan credits');

    res.status(200).json({
      status: 'success',
      message: `Plan upgraded to ${plan}`,
      data: { plan: user.plan, credits: user.credits },
    });
  } catch (err) {
    next(err);
  }
};

// ─── GET /user/dashboard ──────────────────────────────────────────────────────
exports.getDashboard = async (req, res, next) => {
  try {
    const [pages, leadsAgg] = await Promise.all([
      Page.find({ userId: req.user._id })
        .sort('-createdAt')
        .select('title slug status publishedAt domain createdAt'),
      Page.aggregate([
        { $match: { userId: req.user._id } },
        {
          $project: {
            title: 1,
            views: 1,
            leadCount: { $size: { $ifNull: ['$leads', []] } },
          },
        },
        { 
          $group: { 
            _id: null, 
            totalLeads: { $sum: '$leadCount' },
            totalViews: { $sum: { $ifNull: ['$views', 0] } }
          } 
        },
      ]),
    ]);

    const totalLeads = leadsAgg[0]?.totalLeads || 0;
    const totalViews = leadsAgg[0]?.totalViews || 0;
    const conversionRate = totalViews > 0 ? ((totalLeads / totalViews) * 100).toFixed(2) : 0;
    
    const publishedPages = pages.filter((p) => p.status === 'published');
    const draftPages = pages.filter((p) => p.status === 'draft');

    res.status(200).json({
      status: 'success',
      data: {
        user: {
          name: req.user.name,
          email: req.user.email,
          avatar: req.user.avatar,
          plan: req.user.plan,
          credits: req.user.credits,
        },
        stats: {
          totalPages: pages.length,
          publishedPages: publishedPages.length,
          draftPages: draftPages.length,
          totalLeads,
          totalViews,
          conversionRate,
        },
        recentPages: pages.slice(0, 5),
      },
    });
  } catch (err) {
    next(err);
  }
};

// ─── DELETE /user/account ─────────────────────────────────────────────────────
exports.deleteAccount = async (req, res, next) => {
  try {
    const schema = z.object({
      password: z.string().min(1, 'Password is required to delete account'),
    });

    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return next(new AppError('Password is required to delete account', 400));
    }

    // For Google-only accounts, skip password check
    const user = await User.findById(req.user._id).select('+password');
    if (user.password) {
      const isValid = await user.comparePassword(parsed.data.password);
      if (!isValid) return next(new AppError('Incorrect password', 401));
    }

    // Delete all pages and user
    await Promise.all([
      Page.deleteMany({ userId: req.user._id }),
      User.findByIdAndDelete(req.user._id),
    ]);

    res.cookie('refreshToken', '', { httpOnly: true, expires: new Date(0) });

    res.status(200).json({
      status: 'success',
      message: 'Account and all associated data deleted successfully',
    });
  } catch (err) {
    next(err);
  }
};
