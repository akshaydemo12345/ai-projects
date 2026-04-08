'use strict';

const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const JWT_SECRET     = process.env.JWT_SECRET     || 'fallback-secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
const RT_SECRET      = process.env.RT_SECRET      || 'refresh-fallback-secret';
const RT_EXPIRES_IN  = process.env.RT_EXPIRES_IN  || '30d';

// ─── Access Token ─────────────────────────────────────────────────────────────
const signToken = (id) =>
  jwt.sign({ id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

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

// ─── Send Access + Refresh Token Response ────────────────────────────────────
const sendToken = (user, statusCode, res) => {
  const accessToken  = signToken(user._id);
  const refreshToken = signRefreshToken(user._id);

  // Send refresh token as httpOnly cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
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
  sendToken,
};
