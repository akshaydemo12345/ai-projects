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
} = require('../controllers/authController');

const { signupSchema, loginSchema, validate } = require('../utils/validation');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// ─── Public Routes ─────────────────────────────────────────────────────────────

/** POST /auth/signup */
router.post('/signup', validate(signupSchema), signup);

/** POST /auth/login */
router.post('/login', validate(loginSchema), login);

/** POST /auth/refresh-token */
router.post('/refresh-token', refreshToken);

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

// ─── Protected Routes ──────────────────────────────────────────────────────────

/** GET /auth/profile */
router.get('/profile', protect, getProfile);

/** POST /auth/logout */
router.post('/logout', protect, logout);

module.exports = router;
