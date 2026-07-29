'use strict';

const express = require('express');
const passport = require('passport');
const { z } = require('zod');

const {
  signup,
  login,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
  getProfile,
  googleCallback,
    firebaseLogin,
  verifyEmail,
  resendVerificationEmail,
  sendAutoLoginOtp,
  verifyAutoLoginOtp,
  autoLoginDirect,
  sendAutoLoginLink,
  verifyAutoLoginLink,
  checkSession,
} = require('../controllers/authController');

const { signupSchema, loginSchema, validate } = require('../utils/validation');
const { protect } = require('../middleware/authMiddleware');
const { rateLimiter } = require('../middleware/rateLimiter');
const { dbRateLimiter } = require('../middleware/dbRateLimiter');

const router = express.Router();

// ─── Public Routes ─────────────────────────────────────────────────────────────

/** POST /auth/signup */
router.post('/signup', validate(signupSchema), signup);

/** POST /auth/login */
router.post('/login', validate(loginSchema), login);

/** POST /auth/refresh-token */
router.post('/refresh-token', refreshToken);

/** GET /auth/session — silent resume via httpOnly refresh cookie only (see controller for why this is safe) */
router.get(
  '/session',
  rateLimiter({ windowMs: 60 * 1000, max: 30, message: 'Too many requests, please slow down.' }),
  checkSession
);

/** POST /auth/forgot-password */
router.post(
  '/forgot-password',
  validate(z.object({ email: z.string().email('Invalid email') })),
  forgotPassword
);

/** POST /auth/reset-password/:token */
router.post(
  '/reset-password/:token',
  validate(z.object({ password: z.string().min(8, 'Password must be at least 8 characters') })),
  resetPassword
);

/** POST /auth/verify-email/:token */
router.post('/verify-email/:token', verifyEmail);

/** POST /auth/resend-verification-email */
router.post(
  '/resend-verification-email',
  validate(z.object({ email: z.string().email('Invalid email') })),
  resendVerificationEmail
);

// ─── Auto-Login (Email OTP) ────────────────────────────────────────────────────
// Secure alternative to putting a raw email in the URL: a 6-digit code is
// emailed to the user; submitting it back proves they own the inbox and logs
// them in.

/** POST /auth/auto-login/send-otp  — body: { email } */
router.post(
  '/auto-login/send-otp',
  validate(z.object({ email: z.string().email('Invalid email') })),
  dbRateLimiter({ windowMs: 15 * 60 * 1000, max: 5, message: 'Too many code requests for this email. Please try again later.', keyFn: (req) => (req.body?.email || '').toLowerCase() }),
  sendAutoLoginOtp
);

/** POST /auth/auto-login/verify-otp  — body: { email, otp } */
router.post(
  '/auto-login/verify-otp',
  validate(z.object({
    email: z.string().email('Invalid email'),
    otp: z.string().length(6, 'OTP must be 6 digits'),
  })),
  dbRateLimiter({ windowMs: 15 * 60 * 1000, max: 10, message: 'Too many attempts from this device. Please try again later.' }),
  dbRateLimiter({ windowMs: 15 * 60 * 1000, max: 10, message: 'Too many attempts for this account. Please try again later.', keyFn: (req) => (req.body?.email || '').toLowerCase() }),
  verifyAutoLoginOtp
);

/**
 * Secure Direct Auto-Login (GET & POST)
 * Handles auto-login with email, ts, sig (HMAC), or API key verification.
 */
router.route('/auto-login/authenticate')
  .get(
    dbRateLimiter({ windowMs: 15 * 60 * 1000, max: 20, message: 'Too many requests for this email. Please try again later.', keyFn: (req) => (req.query?.email || '').toLowerCase() }),
    autoLoginDirect
  )
  .post(
    validate(z.object({ email: z.string().email('Invalid email') })),
    dbRateLimiter({ windowMs: 15 * 60 * 1000, max: 20, message: 'Too many requests for this email. Please try again later.', keyFn: (req) => (req.body?.email || '').toLowerCase() }),
    autoLoginDirect
  );

router.get(
  '/auto-login',
  dbRateLimiter({ windowMs: 15 * 60 * 1000, max: 20, message: 'Too many requests for this email. Please try again later.', keyFn: (req) => (req.query?.email || '').toLowerCase() }),
  autoLoginDirect
);

// ─── Auto-Login (Magic Link) ───────────────────────────────────────────────────
// URL version of the above: click a link instead of typing a code.

/** POST /auth/auto-login/send-link  — body: { email } */
router.post(
  '/auto-login/send-link',
  validate(z.object({ email: z.string().email('Invalid email') })),
  dbRateLimiter({ windowMs: 15 * 60 * 1000, max: 5, message: 'Too many link requests from this device. Please try again later.' }),
  dbRateLimiter({ windowMs: 15 * 60 * 1000, max: 5, message: 'Too many link requests for this email. Please try again later.', keyFn: (req) => (req.body?.email || '').toLowerCase() }),
  sendAutoLoginLink
);

/**
 * GET /auth/auto-login/verify?token=...&email=...
 * MUST be GET — this is what fires when the user clicks the link in their
 * email (a plain <a href>, i.e. a browser navigation). Registering this as
 * POST is the single most common reason this kind of flow "doesn't work":
 * the link 404s / 405s the instant it's clicked.
 */
router.get(
  '/auto-login/verify',
  rateLimiter({ windowMs: 15 * 60 * 1000, max: 10, message: 'Too many attempts, please try again later.' }),
  verifyAutoLoginLink
);


// ─── Google OAuth ──────────────────────────────────────────────────────────────

/** GET /auth/google */
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

/** GET /auth/google/callback */
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/google/failed', session: false }),
  googleCallback
);

/** GET /auth/google/failed */
router.get('/google/failed', (req, res) => {
  res.status(401).json({ status: 'fail', message: 'Google authentication failed' });
});

/** POST /auth/firebase */
router.post(
  '/firebase',
  validate(z.object({ idToken: z.string().min(10, 'Firebase ID token is required') })),
  firebaseLogin
);


// ─── Protected Routes ──────────────────────────────────────────────────────────

/** GET /auth/profile */
router.get('/profile', protect, getProfile);

/** POST /auth/logout */
router.post('/logout', protect, logout);

module.exports = router;