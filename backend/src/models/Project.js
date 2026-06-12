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
  isVerified: {
    type: Boolean,
    default: false,
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
    logoSvgMarkup: String,     // ← new field
    favicon: String,
    logoFormat: String,
      logoSource: String,
  },

    // 2. Logo-Specific Colors (extracted directly from logo image)
    logoColors: {
      primary: String,      // Primary color from logo
      secondary: String,    // Secondary color from logo
      palette: [String],    // Full color palette from logo
      source: String,       // 'svg-direct' | 'vibrant' | null
    },

    // 3. Industry Classification
    industry: {
      industry: String,
      subIndustry: String,
      confidence: Number,
      detectedFrom: [String],
    },

    // 4. Brand Colors (from entire page, logo takes precedence)
    colors: {
      primary: String,
      secondary: String,
      accent: String,
      palette: [String],
      // Page-wide colors (fallback when logo colors not available)
      pagePrimary: String,
      pageSecondary: String,
    },

    // 5. Theme System (per-component)
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

    // 6. Typography
    fonts: {
      primaryFont: String,
      headingFont: String,
      googleFonts: [String],
      bodyFont: String,
      bodyFontSize: String,
    },

    // 7. Images
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

    // 8. Videos
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

    // 9. Website Content
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
      features: [
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
      sectionHeadings: [String],
    },

    // 10. Forms
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

    // 11. SEO
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

    // 12. Landing Page Sections
    sections: [
      new mongoose.Schema({
        type: String,
        enabled: Boolean,
        order: Number,
        data: mongoose.Schema.Types.Mixed,
      }, { _id: false }),
    ],

    // 13. Extraction Metadata
    extraction: {
      sourceUrl: String,
      finalUrl: String,
      scrapedAt: Date,
      extractionVersion: String,
      durationMs: Number,
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
  // Priority: logoColors.primary > colors.primary > null
  return this.websiteProfile?.logoColors?.primary ||
    this.websiteProfile?.colors?.primary ||
    null;
});

projectSchema.virtual('secondaryColor').get(function () {
  // Priority: logoColors.secondary > colors.secondary > null
  return this.websiteProfile?.logoColors?.secondary ||
    this.websiteProfile?.colors?.secondary ||
    null;
});

projectSchema.virtual('accentColor').get(function () {
  return this.websiteProfile?.colors?.accent || null;
});

projectSchema.virtual('colors').get(function () {
  // Return logo colors palette first, fallback to page colors palette
  const logoPalette = this.websiteProfile?.logoColors?.palette || [];
  const pagePalette = this.websiteProfile?.colors?.palette || [];
  return logoPalette.length > 0 ? logoPalette : pagePalette;
});

projectSchema.virtual('logoColors').get(function () {
  return this.websiteProfile?.logoColors || {};
});

projectSchema.virtual('themeSystem').get(function () {
  return this.websiteProfile?.theme || {};
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

projectSchema.virtual('features').get(function () {
  return (this.websiteProfile?.content?.features || []).map(f => f.title);
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

projectSchema.virtual('logoFormat').get(function () {
  return this.websiteProfile?.identity?.logoFormat || null;
});

projectSchema.virtual('logoSource').get(function () {
  return this.websiteProfile?.identity?.logoSource || null;
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
 * @param {string} projectId - Project ID
 * @param {Object} scrapedData - Data from scrapeWebsiteStructure
 * @param {Object} themeData - Optional theme data
 * @returns {Promise<Object>} Updated project
 */
projectSchema.statics.updateWebsiteProfile = async function (projectId, scrapedData, themeData = null) {
  const { buildWebsiteProfile } = require('../services/structuredScrapeService');
  const ProjectModel = this;

  const websiteProfile = buildWebsiteProfile(scrapedData, themeData);

  const updateData = {
    websiteProfile,
    'scrapeMeta.status': 'success',
    'scrapeMeta.finishedAt': new Date(),
    'scrapeMeta.durationMs': scrapedData.durationMs || 0,
  };

  // Also update top-level name if available and project name is empty/generic
  if (websiteProfile?.identity?.name && websiteProfile.identity.name !== 'Unknown Brand') {
    // Only update if current name is default or empty
    const currentProject = await ProjectModel.findById(projectId).select('name');
    if (currentProject && (currentProject.name === 'My Project' || currentProject.name === '' || currentProject.name === 'Untitled Project')) {
      updateData.name = websiteProfile.identity.name;
    }
  }

  return ProjectModel.findByIdAndUpdate(
    projectId,
    updateData,
    { new: true, runValidators: false }
  );
};

/**
 * Get brand colors with logo priority
 * @returns {Object} Colors with logo priority
 */
projectSchema.methods.getBrandColors = function () {
  const wp = this.websiteProfile || {};
  return {
    primary: wp.logoColors?.primary || wp.colors?.primary || '#7c3aed',
    secondary: wp.logoColors?.secondary || wp.colors?.secondary || '#6366f1',
    accent: wp.colors?.accent || '#f59e0b',
    fromLogo: !!(wp.logoColors?.primary),
    logoPalette: wp.logoColors?.palette || [],
    pagePalette: wp.colors?.palette || [],
  };
};

/**
 * Check if logo colors are available
 * @returns {boolean}
 */
projectSchema.methods.hasLogoColors = function () {
  const wp = this.websiteProfile || {};
  return !!(wp.logoColors?.primary || wp.logoColors?.secondary);
};

/**
 * Get logo extraction info
 * @returns {Object}
 */
projectSchema.methods.getLogoInfo = function () {
  const wp = this.websiteProfile || {};
  return {
    url: wp.identity?.logoUrl || null,
    format: wp.identity?.logoFormat || null,
    source: wp.identity?.logoSource || null,
    hasColors: this.hasLogoColors(),
    colorSource: wp.logoColors?.source || null,
  };
};

// ─── INDEXES ───────────────────────────────────────────────────────────────────

// Indexes for fast user-scoped queries
projectSchema.index({ userId: 1, createdAt: -1 });
projectSchema.index({ userId: 1, _id: 1 });
// Compound index for websiteProfile identity queries (if needed)
projectSchema.index({ 'websiteProfile.identity.name': 1 });
// Index for sourceUrl lookups
projectSchema.index({ 'websiteProfile.extraction.sourceUrl': 1 });
// Index for logo colors queries
projectSchema.index({ 'websiteProfile.logoColors.primary': 1 });
// Index for industry queries
projectSchema.index({ 'websiteProfile.industry.industry': 1 });

const Project = mongoose.model('Project', projectSchema);
module.exports = Project;