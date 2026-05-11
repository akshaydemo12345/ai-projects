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

      let name = $el.attr("name") || $el.attr("id") || $el.attr("data-name") || $el.attr("data-field");
      const placeholder = $el.attr("placeholder") || "";
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
      const slugify = (text) => {
        if (!text) return "";
        let s = text.toLowerCase()
          .replace(/[^a-z0-9]/g, '_')
          .replace(/_+/g, '_')
          .replace(/^_|_$/g, '');
        
        // Strip noise words
        const words = s.split('_').filter(w => !stopWords.includes(w) && w.length > 0);
        return words.join('_');
      };

      let semanticName = "";
      const placeholderSlug = slugify(placeholder);
      const labelSlug = slugify(labelText);

      // Prioritize Placeholder for the technical Name/ID (often cleaner in AI templates)
      const commonFieldPatterns = ['name', 'email', 'phone', 'tele', 'cell', 'message', 'comment', 'subject', 'date', 'time', 'location', 'city', 'address', 'zip', 'service', 'company'];
      const isCommonPlaceholder = commonFieldPatterns.some(p => placeholderSlug.includes(p));
      const isCommonLabel = commonFieldPatterns.some(p => labelSlug.includes(p));

      if (placeholderSlug && (isCommonPlaceholder || !labelSlug)) {
        semanticName = placeholderSlug;
      } else if (labelSlug && (isCommonLabel || !placeholderSlug)) {
        semanticName = labelSlug;
      } else if (placeholderSlug) {
        semanticName = placeholderSlug;
      } else {
        semanticName = labelSlug;
      }

      // If the current name is missing or generic, use the semantic name
      if (!name || name.startsWith('field_') || name === 'input' || name === 'text' || name === 'select') {
        if (semanticName && semanticName.length > 1) {
          name = semanticName;
        }
      }
      
      if (!name) name = `field_${i}`;

      let finalName = name;
      let counter = 1;
      while (seenNames.has(finalName)) {
        finalName = `${name}_${counter++}`;
      }
      seenNames.add(finalName);

      // Injected Fix: Assign name/id to HTML if missing
      if (shouldFixHtml) {
        if (!$el.attr('name')) {
          $el.attr('name', finalName);
        }
        if (!$el.attr('id')) {
          $el.attr('id', finalName);
        }
      }

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

      fields.push({
        field_name: finalName,
        name: semanticName || finalName,
        label: (labelText || placeholder || finalName.replace(/_/g, ' ')).charAt(0).toUpperCase() + (labelText || placeholder || finalName.replace(/_/g, ' ')).slice(1),
        type,
        required: semanticName ? ($el.prop('required') || $el.attr('required') !== undefined) : false,
        placeholder,
        options,
        validation: generateValidation(semanticName || finalName, type)
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
