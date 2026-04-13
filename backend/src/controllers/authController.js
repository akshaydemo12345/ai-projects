'use strict';

const User = require('../models/User');
const Page = require('../models/Page');
const AppError = require('../utils/AppError');
const {
  sendToken,
  signToken,
  verifyRefreshToken,
  createPasswordResetToken,
  hashResetToken,
} = require('../utils/jwt');
const logger = require('../utils/logger');

// ─── POST /auth/signup ────────────────────────────────────────────────────────
exports.signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return next(new AppError('Email already in use', 400));

    const user = await User.create({ name, email, password });
    logger.info('New user registered', { userId: user._id, email });

    sendToken(user, 201, res);
  } catch (err) {
    next(err);
  }
};

// ─── POST /auth/login ─────────────────────────────────────────────────────────
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return next(new AppError('Invalid email or password', 401));
    }

    logger.info('User logged in', { userId: user._id });
    sendToken(user, 200, res);
  } catch (err) {
    next(err);
  }
};

// ─── POST /auth/logout ────────────────────────────────────────────────────────
exports.logout = async (req, res, next) => {
  try {
    // Clear refresh token in DB
    await User.findByIdAndUpdate(req.user._id, { refreshToken: '' });

    // Clear cookie
    res.cookie('refreshToken', '', {
      httpOnly: true,
      expires: new Date(0),
    });

    res.status(200).json({ status: 'success', message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
};

// ─── POST /auth/refresh-token ─────────────────────────────────────────────────
exports.refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken || req.body?.refreshToken;

    if (!token) return next(new AppError('No refresh token provided', 401));

    let decoded;
    try {
      decoded = verifyRefreshToken(token);
    } catch {
      return next(new AppError('Invalid or expired refresh token. Please log in again.', 401));
    }

    const user = await User.findById(decoded.id);
    if (!user) return next(new AppError('User no longer exists', 401));

    const newAccessToken = signToken(user._id);

    res.status(200).json({
      status: 'success',
      accessToken: newAccessToken,
    });
  } catch (err) {
    next(err);
  }
};

// ─── POST /auth/forgot-password ───────────────────────────────────────────────
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return next(new AppError('Please provide your email', 400));

    const user = await User.findOne({ email });
    // Always respond with success to prevent email enumeration attacks
    if (!user) {
      return res.status(200).json({
        status: 'success',
        message: 'If that email exists, a reset link has been sent.',
      });
    }

    const { resetToken, hashedToken, expiresAt } = createPasswordResetToken();

    user.passwordResetToken = hashedToken;
    user.passwordResetExpiresAt = expiresAt;
    await user.save({ validateBeforeSave: false });

    // In production: send via email (e.g. SendGrid / Nodemailer)
    // For now: return token in response (dev only)
    const resetURL = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;

    logger.info('Password reset requested', { userId: user._id, resetURL });

    const responsePayload = { status: 'success', message: 'Password reset link sent.' };
    if (process.env.NODE_ENV !== 'production') {
      responsePayload.debug_resetURL = resetURL; // expose in dev only
    }

    res.status(200).json(responsePayload);
  } catch (err) {
    next(err);
  }
};

// ─── POST /auth/reset-password/:token ────────────────────────────────────────
exports.resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password || password.length < 8) {
      return next(new AppError('Password must be at least 8 characters', 400));
    }

    const hashedToken = hashResetToken(token);

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpiresAt: { $gt: Date.now() },
    });

    if (!user) return next(new AppError('Reset token is invalid or has expired', 400));

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpiresAt = undefined;
    await user.save();

    logger.info('Password reset successful', { userId: user._id });
    sendToken(user, 200, res);
  } catch (err) {
    next(err);
  }
};

// ─── GET /auth/profile (or /user/profile) ────────────────────────────────────
exports.getProfile = async (req, res, next) => {
  try {
    const pages = await Page.find({ userId: req.user._id })
      .sort('-createdAt')
      .select('-leads -content -__v');

    const totalLeads = await Page.aggregate([
      { $match: { userId: req.user._id } },
      { $project: { leadCount: { $size: { $ifNull: ['$leads', []] } } } },
      { $group: { _id: null, total: { $sum: '$leadCount' } } },
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        user: req.user,
        stats: {
          totalPages: pages.length,
          publishedPages: pages.filter((p) => p.status === 'published').length,
          draftPages: pages.filter((p) => p.status === 'draft').length,
          creditsRemaining: req.user.credits,
          plan: req.user.plan,
          totalLeads: totalLeads[0]?.total || 0,
        },
        pages,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ─── Google OAuth Callback ────────────────────────────────────────────────────
// Called after passport.authenticate('google') succeeds
exports.googleCallback = (req, res) => {
  if (!req.user) {
    return res.redirect(
      `${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=oauth_failed`
    );
  }

  const accessToken = signToken(req.user._id);
  const frontendURL = process.env.FRONTEND_URL || 'http://localhost:3000';

  logger.info('Google OAuth login', { userId: req.user._id });

  // Redirect with token in query param — frontend stores it
  res.redirect(`${frontendURL}/oauth-callback?token=${accessToken}`);
};