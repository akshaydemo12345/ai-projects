const mongoose = require('mongoose');

const pageSchema = new mongoose.Schema({
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
    unique: true,
    lowercase: true,
  },
  content: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  template: {
    type: String,
    default: 'blank',
  },
  designUrl: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
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

pageSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const Page = mongoose.model('Page', pageSchema);
module.exports = Page;
