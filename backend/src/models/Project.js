const mongoose = require('mongoose');

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
  websiteUrl: {
    type: String,
    trim: true,
  },
  category: {
    type: String,
    trim: true,
    default: 'Other'
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
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

projectSchema.virtual('url').get(function() {
  return this.websiteUrl;
});

// Middleware to update updatedAt and generate apiToken
projectSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  
  if (!this.apiToken) {
    const crypto = require('crypto');
    this.apiToken = 'PC-' + crypto.randomBytes(8).toString('hex').toUpperCase();
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
