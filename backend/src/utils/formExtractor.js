const cheerio = require("cheerio");

/**
 * Extracts form fields from HTML content using cheerio.
 * @param {string} html - The HTML content to parse.
 * @returns {Array} List of extracted form fields.
 */
function extractFormFields(content) {
  if (!content) return [];
  
  // Handle case where content is an object (e.g. from GrapesJS or AI service)
  let html = content;
  if (typeof content === 'object') {
    // Priority: fullHtml -> html -> content (if string)
    html = content.fullHtml || content.html || (typeof content.content === 'string' ? content.content : "");
    
    // If we still have an object, maybe it's the whole page object or sections
    if (!html && content.sections && Array.isArray(content.sections)) {
      html = content.sections.map(s => s.html || "").join("");
    }
  }
  
  if (!html || typeof html !== 'string') return [];
  
  const $ = cheerio.load(html);
  const fields = [];

  // Find all form elements
  $("input, select, textarea").each((i, el) => {
    const $el = $(el);
    const tag = el.tagName.toLowerCase();
    const type = $el.attr("type") || tag;
    
    // Skip submit buttons and hidden fields if not needed, but here we follow user request
    if (type === 'submit' || type === 'button') return;

    const name = $el.attr("name") || $el.attr("id") || `field_${i}`;
    const placeholder = $el.attr("placeholder") || "";
    const required = $el.attr("required") !== undefined || $el.find('[required]').length > 0;
    
    // Try to find a label
    let label = placeholder || name;
    const id = $el.attr('id');
    if (id) {
      const labelText = $(`label[for="${id}"]`).text().trim();
      if (labelText) label = labelText;
    }

    let options = [];

    if (tag === "select") {
      $el.find("option").each((_, opt) => {
        const val = $(opt).attr('value') || $(opt).text().trim();
        if (val) options.push(val);
      });
    }

    fields.push({
      field_name: name,
      label,
      type,
      required: !!required,
      placeholder,
      options,
      validation: generateValidation(name, type)
    });
  });

  return fields;
}

/**
 * Generates basic validation rules based on field name and type.
 */
function generateValidation(name, type) {
  const n = name.toLowerCase();
  
  if (n.includes("email") || type === 'email') {
    return {
      pattern: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$",
      message: "Please enter a valid email address"
    };
  }

  if (n.includes("phone") || n.includes("mobile") || type === 'tel') {
    return {
      pattern: "^[0-9+()\\-\\s]{10,20}$",
      message: "Please enter a valid phone number"
    };
  }

  if (n.includes("pincode") || n.includes("zip")) {
    return {
      pattern: "^[0-9]{5,6}$",
      message: "Invalid pincode/zipcode"
    };
  }

  if (type === "number") {
    return { min: 0 };
  }

  return {};
}

module.exports = { extractFormFields };
