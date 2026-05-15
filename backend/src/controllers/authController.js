'use strict';

const User = require('../models/User');
const Page = require('../models/Page');
const AppError = require('../utils/AppError');
const { getAuth } = require('firebase-admin').auth;
const {
  sendToken,
  signToken,
  verifyRefreshToken,
  createPasswordResetToken,
  createEmailVerificationToken,
  hashResetToken,
  hashEmailVerificationToken,
} = require('../utils/jwt');
const logger = require('../utils/logger');
const firebaseAdmin = require('../services/firebaseAdmin');
const skipEmailVerification = true; // Hardcoded to skip verification as requested

// ─── POST /auth/signup ────────────────────────────────────────────────────────
exports.signup = async (req, res, next) => {
  try {
    const emailService = require('../services/emailService');
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return next(new AppError('Email already in use', 400));

     // Create verification token
    const { verificationToken, hashedToken, expiresAt } = createEmailVerificationToken();

    const user = await User.create({
      name,
      email,
      password,
      isEmailVerified: false,
      emailVerificationToken: hashedToken,
      emailVerificationExpiresAt: expiresAt,
    });
    logger.info('New user registered, awaiting email verification', { userId: user._id, email });

    if (!skipEmailVerification) {
      const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email/${verificationToken}`;
      const htmlContent = `
        <h2>Verify Your Email</h2>
        <p>Welcome ${name}! Please verify your email to complete your registration.</p>
        <p><a href="${verificationUrl}" style="background-color: #6366f1; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">Verify Email</a></p>
        <p>Or copy this link: <a href="${verificationUrl}">${verificationUrl}</a></p>
        <p>This link expires in 24 hours.</p>
      `;

      try {
        await emailService.sendEmail({
          to: email,
          subject: 'Verify Your Email - AI Landing Page Builder',
          htmlContent,
        });
        console.log('✉️ Verification email sent to:', email);
      } catch (emailError) {
        console.error('❌ Failed to send verification email during signup:', emailError.message);
        return next(new AppError('Unable to send verification email. Please try again later.', 502));
      }
      
      return res.status(201).json({
        status: 'success',
        message: 'Account created. Please check your email to verify your address.',
        data: {
          user: { id: user._id, email: user.email, name: user.name },
        },
      });
    } else {
      logger.info('Email verification skipped due to SKIP_EMAIL_VERIFICATION=true. Auto logging in.', { userId: user._id, email });
      // Automatically verify email if skipped
      user.isEmailVerified = true;
      user.emailVerificationToken = undefined;
      user.emailVerificationExpiresAt = undefined;
      await user.save();
      
      // Send token will automatically respond with 200/201 and user data
      return sendToken(user, 201, res);
    }
  } catch (err) {
    next(err);
  }
};

// ─── POST /auth/verify-email/:token ───────────────────────────────────────────
exports.verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;
    if (!token) return next(new AppError('Verification token is required', 400));

    const hashedToken = hashEmailVerificationToken(token);

    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return next(new AppError('Email verification token is invalid or has expired', 400));
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpiresAt = undefined;
    await user.save();

    logger.info('Email verified', { userId: user._id, email: user.email });

     res.status(200).json({
      status: 'success',
      message: 'Email verified successfully! You can now log in.',
      data: { user: { id: user._id, email: user.email, name: user.name } },
    });
  } catch (err) {
    next(err);
  }
};

// ─── POST /auth/resend-verification-email ─────────────────────────────────────
exports.resendVerificationEmail = async (req, res, next) => {
  try {
    const emailService = require('../services/emailService');
    const { email } = req.body;
    if (!email) return next(new AppError('Email is required', 400));

    const user = await User.findOne({ email });
    if (!user) {
      return next(new AppError('User with that email does not exist', 404));
    }

    if (user.isEmailVerified) {
      return res.status(200).json({
        status: 'success',
        message: 'Email is already verified. You can log in.',
      });
    }

    if (skipEmailVerification) {
      return res.status(200).json({
        status: 'success',
        message: 'Email verification is currently disabled in this environment.',
      });
    }

    // Create a new verification token
    const { verificationToken, hashedToken, expiresAt } = createEmailVerificationToken();
    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpiresAt = expiresAt;
    await user.save();

    // Send verification email
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email/${verificationToken}`;
    const htmlContent = `
      <h2>Verify Your Email</h2>
      <p>Please verify your email to complete your registration.</p>
      <p><a href="${verificationUrl}" style="background-color: #6366f1; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">Verify Email</a></p>
      <p>Or copy this link: <a href="${verificationUrl}">${verificationUrl}</a></p>
      <p>This link expires in 24 hours.</p>
    `;

    try {
      await emailService.sendEmail({
        to: email,
        subject: 'Verify Your Email - AI Landing Page Builder',
        htmlContent,
      });
      console.log('✉️ Verification email resent to:', email);
    } catch (emailError) {
      console.error('❌ Failed to resend verification email:', emailError.message);
      return next(new AppError('Unable to send verification email. Please try again later.', 502));
    }

    res.status(200).json({
      status: 'success',
      message: 'Verification email has been sent. Please check your inbox.',
    });
  } catch (err) {
    next(err);
  }
};

// ─── POST /auth/login ─────────────────────────────────────────────────────────
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt for email:', email);

    const user = await User.findOne({ email }).select('+password');
    console.log('User found:', !!user);
    
    if (!user) {
      console.log('User not found');
      return next(new AppError('Invalid email or password', 401));
    }

    // Email verification disabled per user request
    // if (!user.isEmailVerified && !skipEmailVerification) {
    //  console.log('Email not verified for user:', email);
    //  return next(new AppError('Please verify your email before logging in', 403));
    // }
    
    console.log('Comparing password...');
    const passwordMatch = await user.comparePassword(password);
    console.log('Password match:', passwordMatch);
    
    if (!passwordMatch) {
      return next(new AppError('Invalid email or password', 401));
    }

    logger.info('User logged in', { userId: user._id });
    console.log('Sending token...');
    sendToken(user, 200, res);
  } catch (err) {
    console.error('Login error:', err.message);
    console.error('Error stack:', err.stack);
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
    // Email verification disabled per user request
    // if (!user.isEmailVerified) {
    //  return next(new AppError('Email address not verified', 403));
    // }
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

exports.firebaseLogin = async (req, res, next) => {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      return next(new AppError('Firebase ID token is required', 400));
    }

    if (!firebaseAdmin || !firebaseAdmin.auth) {
      return next(new AppError('Firebase Admin is not configured', 500));
    }

    let decodedToken;
    try {
      decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
    } catch (error) {
      return next(new AppError('Invalid Firebase ID token', 401));
    }

    const { email, name, picture, uid } = decodedToken;
    if (!email) {
      return next(new AppError('Firebase user email is required', 400));
    }

    // Email verification disabled per user request
    // if (!decodedToken.email_verified) {
    //   return next(new AppError('Google account email is not verified. Please verify your email in Google Account settings and try again.', 403));
    // }

    let user = await User.findOne({ email });
    if (!user) {
      const userName = name || email.split('@')[0];
      user = await User.create({
        name: userName,
        email,
        googleId: uid,
        avatar: picture || undefined,
        isEmailVerified: true,
      });
      logger.info('Created new user from Firebase auth', { userId: user._id, email });
    } else {
      if (!user.googleId) {
        user.googleId = uid;
      }
      if (!user.avatar && picture) {
        user.avatar = picture;
      }
      if (!user.isEmailVerified) {
        user.isEmailVerified = true;
      }
      await user.save();
    }

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