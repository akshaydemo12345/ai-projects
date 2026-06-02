const cheerio = require("cheerio");
const logger = require("./logger");

/**
 * Extracts form fields from HTML content using cheerio.
 * @param {string} content - The HTML content to parse.
 * @returns {Array} List of extracted form fields.
 */
function extractFormFields(content, shouldFixHtml = false) {
  if (!content) return shouldFixHtml ? { fields: [], modifiedHtml: content } : [];
  
  let html = content;
  if (typeof content === 'object') {
    html = content.fullHtml || content.html || (typeof content.content === 'string' ? content.content : "");
    if (!html && content.sections && Array.isArray(content.sections)) {
      html = content.sections.map(s => s.html || "").join("");
    }
  }
  
  if (!html || typeof html !== 'string') return shouldFixHtml ? { fields: [], modifiedHtml: html } : [];
  
  const $ = cheerio.load(html, { decodeEntities: false });
  const fields = [];
  const seenNames = new Set();

  try {
    $("input, select, textarea, [data-form-field]").each((i, el) => {
      const $el = $(el);
      const tag = el.tagName.toLowerCase();
      let type = ($el.attr("type") || tag).toLowerCase();
      
      if (tag === 'select') type = 'select';
      if (tag === 'textarea') type = 'textarea';
      if (type === 'tel') type = 'phone';
      if (type === 'date' || type === 'datetime-local') type = 'date';

      if (['submit', 'button', 'reset', 'password'].includes(type)) return;
      if (type === 'hidden' && !$el.attr('name')) return;

      const rawNameOrId = $el.attr('name') || $el.attr('id') || $el.attr('data-name') || $el.attr('data-field');
      const placeholder = $el.attr('placeholder') || "";
      const id = $el.attr('id');
      let labelText = "";

      if (id) {
        labelText = $(`label[for="${id}"]`).text().trim();
      }

      if (!labelText) {
        labelText = $el.closest('label').text().trim() ||
                    $el.prev('label').text().trim() ||
                    $el.parent().find('label').text().trim();
      }

      if (!labelText) {
        labelText = $el.attr('aria-label') || $el.attr('title');
      }

      if (labelText) {
        labelText = labelText.replace(/[:*]/g, '').trim();
      }

      const stopWords = ['enter', 'your', 'please', 'select', 'type', 'here', 'input', 'field'];
      const normalizeFieldKey = (text) => {
        if (!text) return "";
        return String(text).toLowerCase()
          .replace(/[^a-z0-9]/g, '_')
          .replace(/_+/g, '_')
          .replace(/^_|_$/g, '')
          .split('_')
          .filter(w => w && !stopWords.includes(w))
          .join('_');
      };

      const placeholderSlug = normalizeFieldKey(placeholder);
      const labelSlug = normalizeFieldKey(labelText);
      const rawSlug = normalizeFieldKey(rawNameOrId);
      const fallbackSlug = placeholderSlug || labelSlug || `field_${i}`;
      let stableName = rawSlug || fallbackSlug;

      if (['input', 'text', 'select', 'textarea', 'field'].includes(stableName)) {
        stableName = fallbackSlug;
      }
      if (!stableName) {
        stableName = `field_${i}`;
      }

      let uniqueName = stableName;
      let counter = 1;
      while (seenNames.has(uniqueName)) {
        uniqueName = `${stableName}_${counter++}`;
      }
      seenNames.add(uniqueName);

      // Inject missing identifiers into the HTML for stable form submission
      if (shouldFixHtml) {
        if (!$el.attr('name')) {
          $el.attr('name', uniqueName);
        }
        if (!$el.attr('id')) {
          $el.attr('id', uniqueName);
        }
      }

      const actualName = $el.attr('name') || rawNameOrId || uniqueName;
      let options = [];
      if (tag === "select") {
        $el.find("option").each((_, opt) => {
          const $opt = $(opt);
          const val = $opt.attr('value') || $opt.text().trim();
          if (val && !$opt.is(':disabled') && val.toLowerCase() !== 'select') {
            options.push(val);
          }
        });
      }

      const generatedLabel = (labelText || placeholder || uniqueName.replace(/_/g, ' ')).trim();

      fields.push({
        field_name: uniqueName,
        name: actualName,
        label: generatedLabel.charAt(0).toUpperCase() + generatedLabel.slice(1),
        type,
        required: $el.prop('required') || $el.attr('required') !== undefined,
        placeholder,
        options,
        validation: generateValidation(uniqueName, type)
      });
    });
  } catch (e) {
    console.error('❌ [EXTRACTOR] Failed to parse HTML:', e.message);
  }

  if (shouldFixHtml) {
    // Safety: If the original HTML didn't have <html>/<body>, don't return the wrapper
    const hasFullStructure = (typeof html === 'string') && (html.toLowerCase().includes('<body') || html.toLowerCase().includes('<html'));
    const finalHtml = hasFullStructure ? $.html() : ($('body').html() || $.html());
    return { fields, modifiedHtml: finalHtml };
  }
  
  return fields;
}

function generateValidation(name, type) {
  const n = name.toLowerCase();
  if (n.includes("email") || type === 'email') {
    return { pattern: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$", message: "Invalid email" };
  }
  if (n.includes("phone") || type === 'phone') {
    return { pattern: "^[0-9+()\\-\\s]{10,20}$", message: "Invalid phone" };
  }
  return {};
}

module.exports = { extractFormFields };
