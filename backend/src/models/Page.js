const mongoose = require('mongoose');

const pageSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: [true, 'Page must belong to a project'],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  content: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  styles: {
    type: String,
    default: '',
  },
  template: {
    type: String,
    default: 'blank',
  },
  designUrl: {
    type: String,
    trim: true,
  },
  previewUrl: {
    type: String,
    trim: true,
  },
  aiPrompt: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'generating'],
    default: 'draft',
  },
  domain: {
    type: String,
    sparse: true,
  },
  apiToken: {
    type: String,
    unique: true,
    sparse: true,
  },
  previewToken: {
    type: String,
    unique: true,
    sparse: true,
  },
  seo: {
    title: String,
    description: String,
    keywords: [String],
  },
  views: {
    type: Number,
    default: 0,
  },
  settings: {
    webhookUrl: {
      type: String,
      trim: true,
      match: [/^https?:\/\/.+/, 'Invalid Webhook URL'],
    },
  },
  leads: [
    {
      name: String,
      email: String,
      message: String,
      createdAt: { type: Date, default: Date.now },
    },
  ],
  isDeleted: {
    type: Boolean,
    default: false,
    select: false,
  },
  publishedAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Ensure slug is unique WITHIN A PROJECT
pageSchema.index({ projectId: 1, slug: 1 }, { unique: true });

// Soft delete query middleware
pageSchema.pre(/^find/, function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

pageSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = Date.now();
  }
  
  next();
});

const Page = mongoose.model('Page', pageSchema);
module.exports = Page;
