'use strict';

const User = require('../models/User');
const Page = require('../models/Page');
const AppError = require('../utils/AppError');
const { getAuth } = require('firebase-admin').auth;
const {
  sendToken,
  signToken,
  signRefreshToken,
  verifyRefreshToken,
  createPasswordResetToken,
  createEmailVerificationToken,
  hashResetToken,
  hashEmailVerificationToken,
  createOtp,
  hashOtp,
  createAutoLoginToken,
  hashAutoLoginToken,
  safeCompareHex,
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

// ─── POST /auth/auto-login/send-otp ────────────────────────────────────────────
// Step 1: Generate a 6-digit OTP and email it to the user.
// Body: { email }
exports.sendAutoLoginOtp = async (req, res, next) => {
  try {
    const emailService = require('../services/emailService');
    const { email } = req.body;
    if (!email) return next(new AppError('Please provide your email', 400));

    let user = await User.findOne({ email });
    if (!user) {
      // New visitor — create a bare-bones account so the same ?email= link
      // works for first-time users, not just returning ones. No password is
      // set, so this account can only ever be accessed via OTP/magic-link
      // (or a later "set password" flow), never brute-forced at /auth/login.
      const namePlaceholder = email.split('@')[0];
      user = await User.create({ name: namePlaceholder, email });
      logger.info('Auto-created user via auto-login OTP', { userId: user._id, email });
    }

    const { otp, hashedOtp, expiresAt } = createOtp();
    user.otpCode = hashedOtp;
    user.otpExpiresAt = expiresAt;
    user.otpAttempts = 0;
    await user.save({ validateBeforeSave: false });

    logger.info('Auto-login OTP requested', { userId: user._id, email });

    const htmlContent = `
      <h2>Your Login Code</h2>
      <p>Enter this code to log in. It expires in 5 minutes and can only be used once.</p>
      <p style="font-size: 32px; font-weight: bold; letter-spacing: 6px;">${otp}</p>
      <p>If you didn't request this, you can safely ignore this email.</p>
    `;

    try {
      await emailService.sendEmail({
        to: email,
        subject: 'Your Login Code - AI Landing Page Builder',
        htmlContent,
      });
    } catch (emailError) {
      console.error('❌ Failed to send OTP email:', emailError.message);
      return next(new AppError('Unable to send login code. Please try again later.', 502));
    }

    const responsePayload = { status: 'success', message: 'A login code has been sent to your email.' };
    if (process.env.NODE_ENV !== 'production') {
      // Dev convenience only — logged server-side, NEVER returned in the HTTP
      // response, so a misconfigured NODE_ENV can't leak it to an API caller.
      logger.info(`🔑 [DEV ONLY] OTP for ${email}: ${otp}`);
    }

    res.status(200).json(responsePayload);
  } catch (err) {
    next(err);
  }
};

// ─── POST /auth/auto-login/verify-otp ──────────────────────────────────────────
// Step 2: User submits the code they received. Verify it and log them in.
// Body: { email, otp }
exports.verifyAutoLoginOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return next(new AppError('Email and OTP are required', 400));

    const user = await User.findOne({ email }).select('+otpCode');
    if (!user || !user.otpCode || !user.otpExpiresAt) {
      return next(new AppError('Invalid or expired code. Please request a new one.', 401));
    }

    if (user.otpExpiresAt < Date.now()) {
      user.otpCode = undefined;
      user.otpExpiresAt = undefined;
      user.otpAttempts = 0;
      await user.save({ validateBeforeSave: false });
      return next(new AppError('Code has expired. Please request a new one.', 401));
    }

    // Brute-force protection: lock out and force a fresh code after too many wrong guesses
    if (user.otpAttempts >= 5) {
      user.otpCode = undefined;
      user.otpExpiresAt = undefined;
      user.otpAttempts = 0;
      await user.save({ validateBeforeSave: false });
      return next(new AppError('Too many incorrect attempts. Please request a new code.', 429));
    }

    if (!safeCompareHex(hashOtp(otp), user.otpCode)) {
      user.otpAttempts += 1;
      await user.save({ validateBeforeSave: false });
      return next(new AppError('Incorrect code. Please try again.', 401));
    }

    // Correct — single-use, clear immediately so it can't be replayed
    user.otpCode = undefined;
    user.otpExpiresAt = undefined;
    user.otpAttempts = 0;
    if (!user.isEmailVerified) user.isEmailVerified = true;
    await user.save({ validateBeforeSave: false });

    logger.info('User auto-logged in via OTP', { userId: user._id, email: user.email });
    sendToken(user, 200, res);
  } catch (err) {
    next(err);
  }
};

// ─── POST /auth/auto-login/send-link ───────────────────────────────────────────
// Step 1: Generate a one-time URL token and email a clickable login link.
// Body: { email }
exports.sendAutoLoginLink = async (req, res, next) => {
  try {
    const emailService = require('../services/emailService');
    const { email } = req.body;
    if (!email) return next(new AppError('Please provide your email', 400));

    const user = await User.findOne({ email });
    // Always respond with success to prevent email enumeration attacks
    if (!user) {
      return res.status(200).json({
        status: 'success',
        message: 'If that email exists, a login link has been sent.',
      });
    }

    const { loginToken, hashedToken, expiresAt } = createAutoLoginToken();
    user.autoLoginToken = hashedToken;
    user.autoLoginTokenExpiresAt = expiresAt;
    await user.save({ validateBeforeSave: false });

    logger.info('Auto-login link requested', { userId: user._id, email });

    const apiBaseUrl = (process.env.API_BASE_URL || 'http://localhost:5000').replace(/\/+$/, '');
    const loginUrl = `${apiBaseUrl}/api/v1/auth/auto-login/verify?token=${loginToken}&email=${encodeURIComponent(email)}`;

    const htmlContent = `
      <h2>Your Login Link</h2>
      <p>Click the button below to log in. This link expires in 15 minutes and can only be used once.</p>
      <p><a href="${loginUrl}" style="display:inline-block;padding:12px 24px;background:#7c3aed;color:#fff;text-decoration:none;border-radius:6px;">Log In</a></p>
      <p>If the button doesn't work, copy and paste this URL into your browser:<br>${loginUrl}</p>
      <p>If you didn't request this, you can safely ignore this email.</p>
    `;

    try {
      await emailService.sendEmail({
        to: email,
        subject: 'Your Login Link - AI Landing Page Builder',
        htmlContent,
      });
    } catch (emailError) {
      console.error('❌ Failed to send auto-login link email:', emailError.message);
      return next(new AppError('Unable to send login link. Please try again later.', 502));
    }

    const responsePayload = { status: 'success', message: 'A login link has been sent to your email.' };
    if (process.env.NODE_ENV !== 'production') {
      logger.info(`🔗 [DEV ONLY] Auto-login link for ${email}: ${loginUrl}`);
    }

    res.status(200).json(responsePayload);
  } catch (err) {
    next(err);
  }
};

// ─── GET /auth/auto-login/verify ───────────────────────────────────────────────
// Step 2: User clicks the emailed link. This is a GET because it's a browser
// navigation, not an API call — so it can't return JSON like the OTP flow
// does. Instead: verify the token, set the SAME httpOnly refreshToken cookie
// a normal login sets, then redirect into the app. The frontend picks the
// session up from there via /auth/refresh-token (or /auth/session), same as
// any returning user with a valid cookie.
exports.verifyAutoLoginLink = async (req, res, next) => {
  const frontendURL = (process.env.FRONTEND_URL || 'http://localhost:8080').replace(/\/+$/, '');
  try {
    const { token, email } = req.query;
    if (!token || !email) {
      return res.redirect(`${frontendURL}/login?error=invalid_link`);
    }

    const user = await User.findOne({ email }).select('+autoLoginToken');
    if (!user || !user.autoLoginToken || !user.autoLoginTokenExpiresAt) {
      return res.redirect(`${frontendURL}/login?error=invalid_link`);
    }

    if (user.autoLoginTokenExpiresAt < Date.now()) {
      user.autoLoginToken = undefined;
      user.autoLoginTokenExpiresAt = undefined;
      await user.save({ validateBeforeSave: false });
      return res.redirect(`${frontendURL}/login?error=link_expired`);
    }

    if (!safeCompareHex(hashAutoLoginToken(token), user.autoLoginToken)) {
      return res.redirect(`${frontendURL}/login?error=invalid_link`);
    }

    // Correct — single-use, clear immediately so it can't be replayed
    user.autoLoginToken = undefined;
    user.autoLoginTokenExpiresAt = undefined;
    if (!user.isEmailVerified) user.isEmailVerified = true;
    await user.save({ validateBeforeSave: false });

    // Set the same refreshToken cookie a normal login sets (see sendToken in utils/jwt.js)
    const refreshToken = signRefreshToken(user._id);
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 9999 * 24 * 60 * 60 * 1000,
    });

    logger.info('User auto-logged in via link', { userId: user._id, email: user.email });
    // Land on a lightweight frontend route that calls /auth/refresh-token
    // (using the cookie we just set) to populate localStorage, then
    // forwards to the dashboard. Redirecting straight to /dashboard here
    // would NOT work — the frontend only reads its access token from
    // localStorage, and this response can only set a cookie, not run JS.
    return res.redirect(`${frontendURL}/auto-login-callback`);
  } catch (err) {
    logger.error('Auto-login link verification failed', { error: err.message });
    return res.redirect(`${frontendURL}/login?error=invalid_link`);
  }
};

// ─── GET /auth/session ─────────────────────────────────────────────────────────
// "Silent resume" for a returning, already-logged-in user — e.g. hitting
// /dashboard directly without re-entering credentials. Safe by construction:
// it reads ONLY the httpOnly refreshToken cookie set during a real login
// (password / Google / OTP) — never a URL or body param — so it can't be
// triggered by simply knowing/guessing a URL. No cookie = no session = 401,
// and the frontend falls back to showing the login screen, not the dashboard.
exports.checkSession = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) {
      return res.status(401).json({ status: 'fail', message: 'No active session' });
    }

    let decoded;
    try {
      decoded = verifyRefreshToken(token);
    } catch {
      return res.status(401).json({ status: 'fail', message: 'Session expired. Please log in again.' });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ status: 'fail', message: 'Session expired. Please log in again.' });
    }

    const accessToken = signToken(user._id, { name: user.name, email: user.email, plan: user.plan, credits: user.credits });
    user.password = undefined;

    res.status(200).json({
      status: 'success',
      accessToken,
      data: { user },
    });
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
    // Email verification disabled per user request
    // if (!user.isEmailVerified) {
    //  return next(new AppError('Email address not verified', 403));
    // }
    const newAccessToken = signToken(user._id, { name: user.name, email: user.email, plan: user.plan, credits: user.credits });

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

    logger.info('Password reset requested', { userId: user._id });
    if (process.env.NODE_ENV !== 'production') {
      // Dev convenience only — logged server-side, NEVER returned in the HTTP
      // response, so a misconfigured NODE_ENV can't leak a working reset link.
      logger.info(`🔑 [DEV ONLY] Password reset URL: ${resetURL}`);
    }

    res.status(200).json({ status: 'success', message: 'Password reset link sent.' });
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

    let totalAiCost = 0;
    let totalImagesGenerated = 0;

    pages.forEach(p => {
      if (p.aiUsage) {
        totalAiCost += p.aiUsage.cost || 0;
        totalImagesGenerated += p.aiUsage.imageCount || 0;
      }
    });

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
          totalAiCost,
          totalImagesGenerated
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

  const accessToken = signToken(req.user._id, { name: req.user.name, email: req.user.email, plan: req.user.plan, credits: req.user.credits });
  const frontendURL = process.env.FRONTEND_URL || 'http://localhost:3000';

  logger.info('Google OAuth login', { userId: req.user._id });

  // Redirect with token in query param — frontend stores it
  res.redirect(`${frontendURL}/oauth-callback?token=${accessToken}`);
};