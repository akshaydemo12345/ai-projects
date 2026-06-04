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
  logoUrl: {
    type: String,
  },
  business: {
    companyName: { type: String, trim: true },
    industry: { type: String, trim: true },
    subIndustry: { type: String, trim: true },
    services: { type: [String], default: [] },
    keywords: { type: [String], default: [] },
    tagline: { type: String, trim: true },
    about: { type: String, trim: true },
    contacts: {
      email: { type: String, trim: true },
      phone: { type: String, trim: true },
      address: { type: String, trim: true },
      website: { type: String, trim: true },
    },
    socialLinks: {
      type: [
        {
          provider: String,
          url: String,
        }
      ],
      default: [],
    },
    locations: {
      type: [
        {
          address: String,
          city: String,
          state: String,
          zip: String,
          country: String,
        }
      ],
      default: [],
    },
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
  // scrapedImages: {
  //   type: [
  //     {
  //       url: String,
  //       alt: String,
  //       type: {
  //         type: String,
  //         enum: ['logo', 'banner', 'person', 'product', 'environment', 'screenshot', 'general'],
  //       },
  //       context: String,
  //       relevance: {
  //         type: String,
  //         enum: ['high', 'medium', 'low'],
  //       },
  //       width: Number,
  //       height: Number,
  //     }
  //   ],
  //   default: [],
  // },
  preSlug: {
    type: String,
    trim: true,
    lowercase: true,
  },
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
  scrapedData: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
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
  branding: {
    logo: String,
    logoUrl: String,
    favicon: String,
    companyName: String,
    tagline: String,

    colors: {
      primary: String,
      secondary: String,
      accent: String,
      background: String,
      surface: String,
      text: String,
      textLight: String,
      heading: String,
      mutedText: String,
      border: String,
      success: String,
      warning: String,
      danger: String,
      gradient: [String],
    },

    typography: {
      fontFamily: String,
      headingFontFamily: String,
      baseFontSize: String,
      headingScale: {
        h1: String,
        h2: String,
        h3: String,
        h4: String,
      },
      fontWeight: {
        light: String,
        normal: String,
        medium: String,
        bold: String,
      },
      letterSpacing: String,
      lineHeight: String,
    },

    navigation: {
      backgroundColor: String,
      textColor: String,
      linkColor: String,
      activeLinkColor: String,
      hoverColor: String,
      hoverBackgroundColor: String,
      borderColor: String,
      shadow: String,
      height: String,
      padding: String,
      sticky: Boolean,
      transparent: Boolean,
      logoMaxHeight: String,
      fontFamily: String,
      fontWeight: String,
      fontSize: String,
    },

    footer: {
      backgroundColor: String,
      textColor: String,
      linkColor: String,
      borderTopColor: String,
      padding: String,
      fontSize: String,
      layout: String,
      socialIconStyle: String,
    },

    buttons: {
      primary: {
        backgroundColor: String,
        textColor: String,
        borderRadius: String,
        borderColor: String,
        padding: String,
        fontSize: String,
        fontWeight: String,
        hoverBackgroundColor: String,
        hoverTextColor: String,
        boxShadow: String,
        textTransform: String,
      },
      secondary: {
        backgroundColor: String,
        textColor: String,
        borderRadius: String,
        borderColor: String,
        padding: String,
        fontSize: String,
        fontWeight: String,
        hoverBackgroundColor: String,
        hoverTextColor: String,
        boxShadow: String,
        textTransform: String,
      },
    },

    sections: {
      hero: {
        backgroundColor: String,
        textAlign: String,
        padding: String,
      },
      cards: {
        backgroundColor: String,
        borderRadius: String,
        shadow: String,
        borderColor: String,
      },
      formSection: {
        backgroundColor: String,
      },
    },

    forms: {
      inputBackground: String,
      inputBorderColor: String,
      inputRadius: String,
      labelColor: String,
      placeholderColor: String,
      focusBorderColor: String,
      inputHeight: String,
      fontFamily: String,
    },

    layout: {
      borderRadius: {
        small: String,
        medium: String,
        large: String,
      },
      spacing: {
        xs: String,
        sm: String,
        md: String,
        lg: String,
        xl: String,
      },
      containerWidth: String,
    },

    effects: {
      boxShadow: String,
      hoverShadow: String,
      transition: String,
    },

    assets: {
      heroImages: [String],
      banners: [String],
    },

    computedBranding: mongoose.Schema.Types.Mixed,
    brandingSourceUrl: String,
    lastScrapedAt: Date,
    scrapedBrandingData: {
      sourceUrl: String,
      scrapedAt: Date,
      fonts: [String],
      extractedColors: [String],
      headerSelector: String,
      footerSelector: String,
      buttonSelectors: [String],
    },
  },
});

projectSchema.virtual('industry')
  .get(function() {
    return this.business?.industry;
  })
  .set(function(value) {
    this.business = this.business || {};
    this.business.industry = value ? value.trim() : value;
  });

projectSchema.virtual('subIndustry')
  .get(function() {
    return this.business?.subIndustry;
  })
  .set(function(value) {
    this.business = this.business || {};
    this.business.subIndustry = value ? value.trim() : value;
  });

projectSchema.virtual('services')
  .get(function() {
    return this.business?.services || [];
  })
  .set(function(value) {
    this.business = this.business || {};
    this.business.services = Array.isArray(value) ? value : (value ? [value] : []);
  });

projectSchema.virtual('keywords')
  .get(function() {
    return this.business?.keywords || [];
  })
  .set(function(value) {
    this.business = this.business || {};
    this.business.keywords = Array.isArray(value) ? value : (value ? [value] : []);
  });

projectSchema.virtual('websiteUrl')
  .get(function() {
    return this.business?.contacts?.website;
  })
  .set(function(value) {
    this.business = this.business || {};
    this.business.contacts = this.business.contacts || {};
    this.business.contacts.website = value ? value.trim() : value;
  });

// Expose industry as category for frontend compatibility
projectSchema.virtual('category').get(function() {
  return this.industry;
});

projectSchema.set('toObject', { virtuals: true });
projectSchema.set('toJSON', { virtuals: true });

// Migrate legacy fields into nested business metadata when loading old documents
projectSchema.pre('init', function(doc) {
  if (!doc.business) {
    doc.business = {};
  }

  if (doc.industry && !doc.business.industry) {
    doc.business.industry = doc.industry;
  }
  if (doc.subIndustry && !doc.business.subIndustry) {
    doc.business.subIndustry = doc.subIndustry;
  }
  if (Array.isArray(doc.services) && doc.services.length && (!Array.isArray(doc.business.services) || doc.business.services.length === 0)) {
    doc.business.services = doc.services;
  }
  if (Array.isArray(doc.keywords) && doc.keywords.length && (!Array.isArray(doc.business.keywords) || doc.business.keywords.length === 0)) {
    doc.business.keywords = doc.keywords;
  }
  if (doc.websiteUrl) {
    doc.business.contacts = doc.business.contacts || {};
    if (!doc.business.contacts.website) {
      doc.business.contacts.website = doc.websiteUrl;
    }
  }
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

  this.business = this.business || {};
  if (this.websiteUrl) {
    this.business.contacts = this.business.contacts || {};
    if (!this.business.contacts.website) {
      this.business.contacts.website = this.websiteUrl;
    }
  }

  this.scrapeMeta = this.scrapeMeta || { status: 'pending', errors: [] };
  if (this.websiteUrl && !this.scrapeMeta.sourceUrl) {
    this.scrapeMeta.sourceUrl = this.websiteUrl;
  }

  // Ensure there's a baseline branding object so frontend code has something to read
  if (!this.branding || Object.keys(this.branding || {}).length === 0) {
    try {
      this.branding = brandingService.getDefaultBranding();
    } catch (err) {
      this.branding = {};
    }
  }

  next();
});

// Soft delete query middleware
projectSchema.pre(/^find/, function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

/**
 * Static: fetch branding from website and persist to project
 */
projectSchema.statics.updateBrandingFromUrl = async function(projectId) {
  const ProjectModel = this;
  const project = await ProjectModel.findById(projectId);
  if (!project || !project.websiteUrl) return null;

  try {
    const res = await brandingService.fetchAndExtractBranding(project.websiteUrl);
    if (res && res.success && res.data) {
      project.branding = res.data;
      project.branding.brandingSourceUrl = project.websiteUrl;
      project.branding.lastScrapedAt = new Date();
      project.markModified('branding');
      await project.save();
    }
    return project;
  } catch (err) {
    console.error('Error updating branding for project', projectId, err && err.message);
    return project;
  }
};

// After save, trigger background extraction if websiteUrl present and branding empty/default
projectSchema.post('save', function(doc) {
  try {
    const hasBranding = doc.branding && Object.keys(doc.branding || {}).length > 0;
    if (doc.websiteUrl && !hasBranding) {
      setImmediate(() => {
        try { doc.constructor.updateBrandingFromUrl(doc._id).catch(() => {}); } catch(e) {}
      });
    }
  } catch (e) {
    // noop
  }
});

const Project = mongoose.model('Project', projectSchema);
module.exports = Project;
