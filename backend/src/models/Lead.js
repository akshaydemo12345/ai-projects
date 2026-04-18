const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: false, // Optional if we only have slug
  },
  pageSlug: {
    type: String,
    required: true,
    index: true,
  },
  pageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Page',
  },
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  message: {
    type: String,
    trim: true,
  },
  ip: {
    type: String,
  },
  userAgent: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

// Compound index for fast duplicate checking
leadSchema.index({ email: 1, pageSlug: 1, createdAt: -1 });

module.exports = mongoose.model('Lead', leadSchema);
