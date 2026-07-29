const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
  },
  password: {
    type: String,
    minlength: 8,
    select: false, // Don't return password by default
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'client'],
    default: 'user',
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true,
  },
  avatar: {
    type: String,
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isSuspended: {
    type: Boolean,
    default: false,
  },
  emailVerificationToken: String,
  emailVerificationExpiresAt: Date,
  plan: {
    type: String,
    enum: ['free', 'pro', 'enterprise'],
    default: 'free'
  },
  credits: {
    type: Number,
    default: 100
  },
  refreshToken: String,
  passwordResetToken: String,
  passwordResetExpiresAt: Date,
  // Auto-login (OTP) — was missing before, causing OTP save to silently no-op
  otpCode: { type: String, select: false },
  otpExpiresAt: Date,
  otpAttempts: { type: Number, default: 0 },
  // Auto-login (URL / magic link)
  autoLoginToken: { type: String, select: false },
  autoLoginTokenExpiresAt: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

// PASSWORDS HASHING
userSchema.pre('save', async function (next) {
  this.updatedAt = Date.now();
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// PASSWORD COMPARISON
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password || !candidatePassword) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;