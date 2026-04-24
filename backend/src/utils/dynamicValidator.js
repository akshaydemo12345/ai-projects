/**
 * Finds a value in the data object using fuzzy matching for the given field name.
 */
function findValue(targetName, data, label = "") {
  // 1. Absolute direct match (on field_name)
  if (data[targetName] !== undefined && data[targetName] !== null) {
    return data[targetName];
  }

  const cleanTarget = targetName.toLowerCase().replace(/[^a-z0-9]/g, '');
  const cleanLabel = (label || "").toLowerCase().replace(/[^a-z0-9]/g, '');
  const keys = Object.keys(data);

  // 2. Case-insensitive / Cleaned direct match
  for (const key of keys) {
    const cleanKey = key.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (cleanKey === cleanTarget || (cleanLabel && cleanKey === cleanLabel)) return data[key];
  }

  // 3. Concept matching (Fuzzy)
  for (const key of keys) {
    const cleanKey = key.toLowerCase().replace(/[^a-z0-9]/g, '');

    // Concept: Name
    if ((cleanTarget.includes('name') || cleanLabel.includes('name')) && 
        (cleanKey === 'name' || cleanKey.includes('name') || cleanKey === 'firstname' || cleanKey === 'contact')) {
      return data[key];
    }

    // Concept: Phone
    if ((cleanTarget.includes('phone') || cleanTarget.includes('tel') || cleanLabel.includes('phone') || cleanLabel.includes('tel') || cleanLabel.includes('mobile')) && 
        (cleanKey.includes('phone') || cleanKey.includes('tel') || cleanKey.includes('mobile') || cleanKey === 'contactnumber')) {
      return data[key];
    }

    // Concept: Email
    if ((cleanTarget.includes('email') || cleanTarget.includes('mail') || cleanLabel.includes('email') || cleanLabel.includes('mail')) && 
        (cleanKey.includes('email') || cleanKey.includes('mail'))) {
      return data[key];
    }

    // Concept: Message
    if ((cleanTarget.includes('message') || cleanTarget.includes('msg') || cleanLabel.includes('message') || cleanLabel.includes('msg') || cleanLabel.includes('comment')) && 
        (cleanKey.includes('message') || cleanKey.includes('msg') || cleanKey.includes('comment') || cleanKey.includes('query'))) {
      return data[key];
    }
  }

  return undefined;
}

/**
 * Validates form data against a schema.
 */
function validateForm(fields, data) {
  const errors = [];
  if (!fields || !Array.isArray(fields)) return errors;

  fields.forEach(field => {
    const value = findValue(field.field_name, data, field.label);

    if (field.required && (value === undefined || value === null || value === '')) {
      errors.push(`${field.label || field.field_name} is required`);
      return;
    }

    if (!value) return;

    if (field.validation?.pattern) {
      try {
        const regex = new RegExp(field.validation.pattern);
        if (!regex.test(String(value))) {
          errors.push(field.validation.message || `${field.label || field.field_name} format is invalid`);
        }
      } catch (e) {}
    }
  });

  return errors;
}

/**
 * Normalizes incoming raw data into the schema's field_name keys.
 */
function normalizeData(schemaFields, rawData) {
  // Start with all raw data to ensure nothing is lost
  const normalized = { ...rawData };
  
  if (!schemaFields || !Array.isArray(schemaFields)) return normalized;

  schemaFields.forEach(field => {
    const val = findValue(field.field_name, rawData, field.label);
    // If we found a value (even if fuzzy), we normalize it to the schema's field_name
    if (val !== undefined && val !== null) {
      normalized[field.field_name] = val;
    } else if (normalized[field.field_name] === undefined) {
      // If not present at all, initialize with empty string
      normalized[field.field_name] = "";
    }
  });

  return normalized;
}

module.exports = { validateForm, normalizeData, findValue };
