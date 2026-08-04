const FormSchema = require('../models/FormSchema');
const { extractFormFields } = require('./formExtractor');
const logger = require('./logger');

/**
 * Synchronizes the FormSchema for a page by extracting fields from its HTML content.
 * This ensures that the Leads dashboard knows which columns to display.
 * 
 * @param {Object} page - The Mongoose Page document.
 * @returns {Promise<Object|null>} The updated FormSchema document.
 */
const syncFormSchema = async (page) => {
  try {
    if (!page) return null;

    // Support both raw HTML string and object-based content
    let content = page.landingPageContent || page.content;
    
    if (!content) {
      logger.warn(`⚠️ [SCHEMA] No content found for page ${page._id}, skipping sync.`);
      return null;
    }

    const result = extractFormFields(content, true);
    const fields = result.fields;
    const modifiedHtml = result.modifiedHtml;
    
    if (modifiedHtml && modifiedHtml !== content) {
      if (page.landingPageContent) {
        page.landingPageContent = modifiedHtml;
      } else {
        page.content = modifiedHtml;
      }
      await page.save({ validateBeforeSave: false });
      logger.info(`✨ [SCHEMA] Updated HTML with injected names/ids for page ${page._id}`);
    }

    if (!fields || fields.length === 0) {
      logger.info(`ℹ️ [SCHEMA] No form fields detected on page ${page._id}.`);
      return null;
    }

    logger.info(`📝 [SCHEMA] Syncing ${fields.length} fields for page ${page._id} (${page.title})`);

    let existingSchema = await FormSchema.findOne({ page_id: page._id });
    let updateFields = {
      project_id: page.projectId,
      fields,
      updatedAt: Date.now()
    };

    if (!existingSchema && page.projectId) {
      const projWebhookSchema = await FormSchema.findOne({
        project_id: page.projectId,
        'webhook.url': { $ne: '' }
      });
      if (projWebhookSchema && projWebhookSchema.webhook) {
        updateFields.webhook = projWebhookSchema.webhook;
      }
    }

    const schema = await FormSchema.findOneAndUpdate(
      { page_id: page._id },
      updateFields,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return schema;
  } catch (err) {
    logger.error('❌ [SCHEMA] Sync failed:', err);
    return null;
  }
};

module.exports = { syncFormSchema };
