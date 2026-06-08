const mongoose = require('mongoose');
const { normalizeDomain } = require('../utils/validation');
const brandingService = require('../services/brandingService');

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
  publishedPageCount: {
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
  preSlug: {
    type: String,
    trim: true,
    lowercase: true,
  },
  fromName: {
    type: String,
    trim: true,
  },
  fromEmail: {
    type: String,
    trim: true,
  },
  adminNotification: {
    enabled: { type: Boolean, default: false },
    email: String,
    subject: String,
    message: String,
  },
  userNotification: {
    enabled: { type: Boolean, default: false },
    subject: String,
    message: String,
  },
  emailProvider: {
    type: String,
    enum: ['brevo', 'smtp'],
    default: 'brevo',
  },
  brevoKey: {
    type: String,
    trim: true,
  },

  // ─── SINGLE SOURCE OF TRUTH ────────────────────────────────────────────────
  // All scraped/analyzed data is stored here. No more duplicates.
  websiteProfile: {
    // 1. Project Identity
    identity: {
      name: String,
      description: String,
      logoUrl: String,
      favicon: String,
    },

    // 2. Industry Classification
    industry: {
      industry: String,
      subIndustry: String,
      confidence: Number,
      detectedFrom: [String],
    },

    // 3. Brand Colors
    colors: {
      primary: String,
      secondary: String,
      accent: String,
      palette: [String],
    },

    // 4. Theme System (per-component)
    theme: {
      header: { background: String, text: String },
      navigation: { background: String, text: String, active: String },
      buttons: {
        primaryBg: String,
        primaryText: String,
        secondaryBg: String,
        secondaryText: String,
      },
      footer: { background: String, text: String },
    },

    // 5. Typography
    fonts: {
      primaryFont: String,
      headingFont: String,
      googleFonts: [String],
    },

    // 6. Images
    images: {
      type: [
        {
          url: String,
          alt: String,
          section: String,
          width: Number,
          height: Number,
        },
      ],
      default: [],
    },

    // 7. Videos
    videos: {
      type: [
        {
          url: String,
          platform: String,
          videoId: String,
          poster: String,
          section: String,
        },
      ],
      default: [],
    },

    // 8. Website Content
    content: {
      hero: {
        title: String,
        subtitle: String,
        ctaText: String,
      },
      taglines: [String],
      services: [
        {
          title: String,
          description: String,
          icon: String,
        },
      ],
      testimonials: [
        {
          name: String,
          company: String,
          text: String,
          rating: Number,
        },
      ],
      ctas: [
        {
          title: String,
          description: String,
          buttonText: String,
        },
      ],
    },

    // 9. Forms
    forms: [
      {
        formName: String,
        fields: [
          new mongoose.Schema({
            name: String,
            label: String,
            type: String,
            placeholder: String,
            required: Boolean,
          }, { _id: false }),
        ],
      },
    ],

    // 10. SEO
    seo: {
      title: String,
      description: String,
      canonicalUrl: String,
      robots: String,
      keywords: [String],
      openGraph: {
        title: String,
        description: String,
        image: String,
        url: String,
      },
      twitter: {
        card: String,
        title: String,
        description: String,
        image: String,
      },
    },

    // 11. Landing Page Sections
    sections: [
      new mongoose.Schema({
        type: String,
        enabled: Boolean,
        order: Number,
        data: mongoose.Schema.Types.Mixed,
      }, { _id: false }),
    ],

    // 12. Extraction Metadata
    extraction: {
      sourceUrl: String,
      finalUrl: String,
      scrapedAt: Date,
      extractionVersion: String,
    },
  },

  // ─── SCRAPE META (kept separate - not duplicated in websiteProfile) ───────
  scrapeMeta: {
    status: {
      type: String,
      enum: ['pending', 'success', 'failed', 'partial'],
      default: 'pending',
    },
    durationMs: Number,
    startedAt: Date,
    finishedAt: Date,
    sourceUrl: String,
    pagesScanned: Number,
    errors: {
      type: [String],
      default: [],
    },
  },
});

// ─── VIRTUAL FIELDS for backward compatibility ───────────────────────────────
// These map to websiteProfile so existing frontend code continues to work.

projectSchema.virtual('logoUrl').get(function () {
  return this.websiteProfile?.identity?.logoUrl || null;
});

projectSchema.virtual('primaryColor').get(function () {
  return this.websiteProfile?.colors?.primary || null;
});

projectSchema.virtual('secondaryColor').get(function () {
  return this.websiteProfile?.colors?.secondary || null;
});

projectSchema.virtual('colors').get(function () {
  return this.websiteProfile?.colors?.palette || [];
});

projectSchema.virtual('themeSystem').get(function () {
  return this.websiteProfile?.theme || {};
});

projectSchema.virtual('brandingData').get(function () {
  // Map websiteProfile to old brandingData shape for backward compatibility
  const wp = this.websiteProfile || {};
  return {
    identity: wp.identity,
    colors: wp.colors,
    themeSystem: wp.theme,
    typography: wp.fonts,
    images: wp.images,
    videos: wp.videos,
    content: wp.content,
    forms: wp.forms,
    seo: wp.seo,
    sections: wp.sections?.map(s => s.type).filter(Boolean) || [],
    industry: wp.industry?.industry,
    subIndustry: wp.industry?.subIndustry,
    sourceUrl: wp.extraction?.sourceUrl,
    scrapedAt: wp.extraction?.scrapedAt,
    durationMs: wp.extraction?.durationMs || 0,
  };
});

// Business virtuals (keep for backward compatibility)
projectSchema.virtual('business').get(function () {
  const wp = this.websiteProfile || {};
  return {
    companyName: wp.identity?.name,
    industry: wp.industry?.industry,
    subIndustry: wp.industry?.subIndustry,
    services: (wp.content?.services || []).map(s => s.title),
    keywords: wp.seo?.keywords || [],
    contacts: {
      website: wp.extraction?.sourceUrl || wp.extraction?.finalUrl,
    },
  };
});

projectSchema.virtual('industry').get(function () {
  return this.websiteProfile?.industry?.industry;
});

projectSchema.virtual('subIndustry').get(function () {
  return this.websiteProfile?.industry?.subIndustry;
});

projectSchema.virtual('services').get(function () {
  return (this.websiteProfile?.content?.services || []).map(s => s.title);
});

projectSchema.virtual('keywords').get(function () {
  return this.websiteProfile?.seo?.keywords || [];
});

projectSchema.virtual('websiteUrl').get(function () {
  return this.websiteProfile?.extraction?.sourceUrl || this.websiteProfile?.extraction?.finalUrl;
});

projectSchema.virtual('category').get(function () {
  return this.industry;
});

projectSchema.set('toObject', { virtuals: true });
projectSchema.set('toJSON', { virtuals: true });

// ─── MIDDLEWARE ───────────────────────────────────────────────────────────────

// Generate API token if missing
projectSchema.pre('save', function (next) {
  this.updatedAt = Date.now();

  if (!this.apiToken) {
    const crypto = require('crypto');
    this.apiToken = 'PC-' + crypto.randomBytes(8).toString('hex').toUpperCase();
  }

  // Ensure scrapeMeta exists
  this.scrapeMeta = this.scrapeMeta || { status: 'pending', errors: [] };

  // Update scrapeMeta sourceUrl from websiteProfile if available
  const wpSource = this.websiteProfile?.extraction?.sourceUrl;
  if (wpSource && !this.scrapeMeta.sourceUrl) {
    this.scrapeMeta.sourceUrl = wpSource;
  }

  // Apply domain normalization to sourceUrl if it exists
  if (this.scrapeMeta.sourceUrl) {
    this.scrapeMeta.sourceUrl = normalizeDomain(this.scrapeMeta.sourceUrl);
  }

  next();
});

// Soft delete query middleware
projectSchema.pre(/^find/, function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

// ─── STATIC METHODS ───────────────────────────────────────────────────────────

/**
 * Update websiteProfile from scraped data
 */
projectSchema.statics.updateWebsiteProfile = async function (projectId, scrapedData, themeData = null) {
  const { buildWebsiteProfile } = require('../services/structuredScrapeService');
  const ProjectModel = this;

  const websiteProfile = buildWebsiteProfile(scrapedData, themeData);

  const updateData = {
    websiteProfile,
    'scrapeMeta.status': 'success',
    'scrapeMeta.finishedAt': new Date(),
  };

  // Copy colors to top-level for easier querying (indexed fields)
  if (websiteProfile?.colors?.primary) {
    // Note: These are not stored as separate fields, but can be used in queries
    // via websiteProfile.colors.primary - no duplication needed.
  }

  return ProjectModel.findByIdAndUpdate(
    projectId,
    updateData,
    { new: true, runValidators: false }
  );
};

// Indexes for fast user-scoped queries
projectSchema.index({ userId: 1, createdAt: -1 });
projectSchema.index({ userId: 1, _id: 1 });
// Compound index for websiteProfile identity queries (if needed)
projectSchema.index({ 'websiteProfile.identity.name': 1 });
// Index for sourceUrl lookups
projectSchema.index({ 'websiteProfile.extraction.sourceUrl': 1 });

const Project = mongoose.model('Project', projectSchema);
module.exports = Project;