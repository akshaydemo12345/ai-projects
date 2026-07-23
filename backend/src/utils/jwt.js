'use strict';

const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '9999d';
const RT_SECRET = process.env.RT_SECRET || 'refresh-fallback-secret';
const RT_EXPIRES_IN = process.env.RT_EXPIRES_IN || '9999d';

// ─── Access Token ─────────────────────────────────────────────────────────────
// Embed lightweight user fields in the token so authMiddleware can skip the DB lookup.
// Fields: id (for queries), name/email/plan/credits (for req.user in controllers).
const signToken = (id, userMeta = {}) =>
  jwt.sign(
    { id, name: userMeta.name, email: userMeta.email, plan: userMeta.plan, credits: userMeta.credits, role: userMeta.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

// ─── Refresh Token ────────────────────────────────────────────────────────────
const signRefreshToken = (id) =>
  jwt.sign({ id }, RT_SECRET, { expiresIn: RT_EXPIRES_IN });

const verifyRefreshToken = (token) =>
  jwt.verify(token, RT_SECRET);

// ─── Password Reset Token (crypto, not JWT) ───────────────────────────────────
const createPasswordResetToken = () => {
  const resetToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes
  return { resetToken, hashedToken, expiresAt };
};

const hashResetToken = (token) =>
  crypto.createHash('sha256').update(token).digest('hex');

// ─── Email Verification Token (crypto, not JWT) ────────────────────────────────
const createEmailVerificationToken = () => {
  const verificationToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(verificationToken).digest('hex');
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  return { verificationToken, hashedToken, expiresAt };
};

const hashEmailVerificationToken = (token) =>
  crypto.createHash('sha256').update(token).digest('hex');

// ─── Auto-Login OTP (email-based one-time code) ────────────────────────────────
// User enters their email, gets a 6-digit code by email, enters it back —
// proves they actually own that inbox before we log them in. The code is
// stored only as a hash, expires quickly, and is invalidated after one use
// or too many wrong guesses (see verifyAutoLoginOtp in authController.js).
const createOtp = () => {
  const otp = crypto.randomInt(100000, 999999).toString(); // 6-digit, no leading zero
  const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes
  return { otp, hashedOtp, expiresAt };
};

const hashOtp = (otp) =>
  crypto.createHash('sha256').update(String(otp)).digest('hex');

// ─── Auto-Login Link (URL-based, one click, no code to type) ──────────────────
// Same idea as the OTP flow but the proof-of-inbox-ownership step is clicking
// a link instead of typing a code. Only the hash is ever stored; the raw
// token only ever exists in the emailed URL and briefly in the request query.
const createAutoLoginToken = () => {
  const loginToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(loginToken).digest('hex');
  const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes
  return { loginToken, hashedToken, expiresAt };
};

const hashAutoLoginToken = (token) =>
  crypto.createHash('sha256').update(String(token)).digest('hex');

// Constant-time comparison for hex-encoded hashes (OTP, reset tokens, etc.)
// Using `===` leaks timing information proportional to how many leading
// characters match, which — while a very hard attack in practice over a
// network — is trivial to close off with crypto.timingSafeEqual.
const safeCompareHex = (a, b) => {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  try {
    const bufA = Buffer.from(a, 'hex');
    const bufB = Buffer.from(b, 'hex');
    if (bufA.length !== bufB.length || bufA.length === 0) return false;
    return crypto.timingSafeEqual(bufA, bufB);
  } catch (e) {
    return false;
  }
};


// ─── Send Access + Refresh Token Response ────────────────────────────────────
const sendToken = (user, statusCode, res) => {
  const accessToken = signToken(user._id, { name: user.name, email: user.email, plan: user.plan, credits: user.credits, role: user.role });
  const refreshToken = signRefreshToken(user._id);

  // Send refresh token as httpOnly cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 9999 * 24 * 60 * 60 * 1000, // 9999 days
  });

  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    accessToken,
    data: { user },
  });
};

module.exports = {
  signToken,
  signRefreshToken,
  verifyRefreshToken,
  createPasswordResetToken,
  hashResetToken,
  createEmailVerificationToken,
  hashEmailVerificationToken,
  createOtp,
  hashOtp,
  createAutoLoginToken,
  hashAutoLoginToken,
  safeCompareHex,
  sendToken,
};