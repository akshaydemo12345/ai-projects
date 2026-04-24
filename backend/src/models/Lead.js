const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
    index: true
  },
  pageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Page',
    required: true,
    index: true
  },
  pageSlug: {
    type: String,
    required: true,
    index: true
  },
  // 🔥 DYNAMIC DATA: Captures exactly what the FormSchema defines
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  // 🔥 TRACKING META: For analytics and security
  meta: {
    ip: String,
    userAgent: String,
    referer: String,
    domain: String,
    url: String
  },
  utm: {
    utm_source: String,
    utm_medium: String,
    utm_campaign: String,
    utm_term: String,
    utm_content: String,
    gclid: String,
    fbclid: String,
    msclkid: String
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, { 
  timestamps: true,
  strict: false // Allows for future expansion without migrations
});

// Compound index for fast lookups
leadSchema.index({ projectId: 1, createdAt: -1 });

module.exports = mongoose.model('Lead', leadSchema);
