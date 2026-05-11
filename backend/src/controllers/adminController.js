'use strict';

const User = require('../models/User');
const Page = require('../models/Page');
const AppError = require('../utils/AppError');
const { z } = require('zod');
const logger = require('../utils/logger');

// ─── GET /admin/stats ─────────────────────────────────────────────────────────
exports.getStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalPages,
      publishedPages,
      planBreakdown,
      recentUsers,
      topPages,
      leadsAgg,
    ] = await Promise.all([
      User.countDocuments(),
      Page.countDocuments(),
      Page.countDocuments({ status: 'published' }),
      User.aggregate([
        { $group: { _id: '$plan', count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
      User.find()
        .sort('-createdAt')
        .limit(5)
        .select('name email plan credits createdAt'),
      Page.find({ status: 'published' })
        .sort('-createdAt')
        .limit(5)
        .select('title slug domain leads publishedAt'),
      Page.aggregate([
        { $project: { leadCount: { $size: { $ifNull: ['$leads', []] } } } },
        { $group: { _id: null, total: { $sum: '$leadCount' } } },
      ]),
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        overview: {
          totalUsers,
          totalPages,
          publishedPages,
          draftPages: totalPages - publishedPages,
          totalLeads: leadsAgg[0]?.total || 0,
        },
        planBreakdown: planBreakdown.reduce((acc, p) => {
          acc[p._id] = p.count;
          return acc;
        }, {}),
        recentUsers,
        topPublishedPages: topPages.map((p) => ({
          ...p.toObject(),
          leadCount: p.leads?.length || 0,
          leads: undefined,
        })),
      },
    });
  } catch (err) {
    next(err);
  }
};

// ─── GET /admin/users ─────────────────────────────────────────────────────────
exports.getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, plan, search } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filter = {};
    if (plan) filter.plan = plan;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const [users, total] = await Promise.all([
      User.find(filter)
        .sort('-createdAt')
        .skip(skip)
        .limit(parseInt(limit))
        .select('-refreshToken -password -passwordResetToken'),
      User.countDocuments(filter),
    ]);

    res.status(200).json({
      status: 'success',
      results: users.length,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      data: { users },
    });
  } catch (err) {
    next(err);
  }
};

// ─── GET /admin/users/:id ─────────────────────────────────────────────────────
exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-refreshToken -password -passwordResetToken');

    if (!user) return next(new AppError('User not found', 404));

    const pages = await Page.find({ userId: user._id })
      .select('title slug status publishedAt createdAt')
      .sort('-createdAt');

    res.status(200).json({ status: 'success', data: { user, pages } });
  } catch (err) {
    next(err);
  }
};

// ─── PATCH /admin/users/:id ───────────────────────────────────────────────────
exports.updateUser = async (req, res, next) => {
  try {
    const schema = z.object({
      role:    z.enum(['user', 'admin']).optional(),
      plan:    z.enum(['free', 'pro', 'enterprise']).optional(),
      credits: z.number().int().min(0).optional(),
    });

    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return next(new AppError(Object.values(parsed.error.flatten().fieldErrors).flat().join('. '), 400));
    }

    const user = await User.findByIdAndUpdate(req.params.id, parsed.data, {
      new: true,
      runValidators: true,
    }).select('-refreshToken -password');

    if (!user) return next(new AppError('User not found', 404));

    logger.info('Admin updated user', { adminId: req.user._id, targetUserId: user._id, updates: parsed.data });

    res.status(200).json({ status: 'success', data: { user } });
  } catch (err) {
    next(err);
  }
};

// ─── DELETE /admin/users/:id ──────────────────────────────────────────────────
exports.deleteUser = async (req, res, next) => {
  try {
    if (req.params.id === String(req.user._id)) {
      return next(new AppError('You cannot delete your own account from admin panel', 400));
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return next(new AppError('User not found', 404));

    // Cascade delete user's pages
    await Page.deleteMany({ userId: req.params.id });

    logger.warn('Admin deleted user', { adminId: req.user._id, deletedUserId: req.params.id });

    res.status(200).json({ status: 'success', message: 'User and all their pages deleted' });
  } catch (err) {
    next(err);
  }
};

// ─── GET /admin/pages ─────────────────────────────────────────────────────────
exports.getAllPages = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filter = {};
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { domain: { $regex: search, $options: 'i' } },
        { slug: { $regex: search, $options: 'i' } },
      ];
    }

    const [pages, total] = await Promise.all([
      Page.find(filter)
        .sort('-createdAt')
        .skip(skip)
        .limit(parseInt(limit))
        .select('-leads -content -__v')
        .populate('userId', 'name email plan'),
      Page.countDocuments(filter),
    ]);

    res.status(200).json({
      status: 'success',
      results: pages.length,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      data: { pages },
    });
  } catch (err) {
    next(err);
  }
};

// ─── DELETE /admin/pages/:id ──────────────────────────────────────────────────
exports.deletePage = async (req, res, next) => {
  try {
    const page = await Page.findByIdAndDelete(req.params.id);
    if (!page) return next(new AppError('Page not found', 404));

    logger.warn('Admin deleted page', { adminId: req.user._id, pageId: req.params.id });

    res.status(200).json({ status: 'success', message: 'Page deleted successfully' });
  } catch (err) {
    next(err);
  }
};
