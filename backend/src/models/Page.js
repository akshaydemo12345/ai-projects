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
  primaryColor: {
    type: String,
    default: '#7c3aed',
  },
  secondaryColor: {
    type: String,
    default: '#6366f1',
  },
  accentColor: {
    type: String,
    default: '#6366f1',
  },
  logoUrl: {
    type: String,
  },
  template: {
    type: String,
    default: 'blank',
  },
  templateId: {
    type: String,
    trim: true,
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
  metaTitle: {
    type: String,
    trim: true,
  },
  metaDescription: {
    type: String,
    trim: true,
  },
  industry: {
    type: String,
    trim: true,
  },
  services: {
    type: [String],
    default: [],
  },
  noIndex: {
    type: Boolean,
    default: false,
  },
  noFollow: {
    type: Boolean,
    default: false,
  },
  prefix: {
    type: String,
    trim: true,
    default: '',
  },
  generationMethod: {
    type: String,
    enum: ['ai', 'analyze', 'manual', 'template', 'figma'],
    default: 'ai',
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
  thankYouConfig: {
    layout: {
      type: String,
      enum: ['roofing', 'real_estate', 'healthcare', 'legal', 'education', 'home_services', 'finance', 'default'],
      default: 'default'
    },
    content: {
      heading: { type: String, default: 'Thank You!' },
      subheading: { type: String, default: 'We have received your request and will contact you soon.' },
      ctaText: { type: String, default: 'Return to Website' },
      ctaUrl: { type: String, default: '#' },
      phoneNumber: String,
      offerText: String,
      customMessage: String
    },
    tracking: {
      ga4MeasurementId: String,
      ga4EventName: { type: String, default: 'lead_submission' },
      googleAdsConversionId: String,
      googleAdsLabel: String,
      metaPixelId: String,
      metaEventName: { type: String, default: 'Lead' },
      customTracking: [String]
    },
    branding: {
      logoUrl: String,
      primaryColor: String,
      secondaryColor: String
    },
    customTemplate: String,
    customCss: String
  },
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

// Ensure slug is unique WITHIN A PROJECT (only for non-deleted pages)
pageSchema.index(
  { projectId: 1, slug: 1 }, 
  { 
    unique: true, 
    partialFilterExpression: { isDeleted: false } 
  }
);

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
