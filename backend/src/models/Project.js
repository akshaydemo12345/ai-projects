const mongoose = require('mongoose');
const { normalizeDomain } = require('../utils/validation');

const projectSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Project must belong to a user'],
  },
  name: {
    type: String,
    required: [true, 'Please provide a project name'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
    select: false,
  },
  apiToken: {
    type: String,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  pageCount: {
    type: Number,
    default: 0,
  },
  leadCount: {
    type: Number,
    default: 0,
  },
  views: {
    type: Number,
    default: 0,
  },
  logoUrl: {
    type: String,
  },
  services: {
    type: [String],
    default: [],
  },
  keywords: {
    type: [String],
    default: [],
  },
  industry: {
    type: String,
  },
  primaryColor: {
    type: String,
  },
  secondaryColor: {
    type: String,
  },
  colors: {
    type: [String],
    default: [],
  },
  themeSystem: {
    type: Object,
    default: {},
  },
  websiteUrl: {
    type: String,
    trim: true,
  },
});

// Middleware to update updatedAt and generate apiToken
projectSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  
  if (!this.apiToken) {
    const crypto = require('crypto');
    this.apiToken = 'PC-' + crypto.randomBytes(8).toString('hex').toUpperCase();
  }

  if (this.websiteUrl) {
    this.websiteUrl = normalizeDomain(this.websiteUrl);
  }
  
  next();
});

// Soft delete query middleware
projectSchema.pre(/^find/, function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

const Project = mongoose.model('Project', projectSchema);
module.exports = Project;
