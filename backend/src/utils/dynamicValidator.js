/**
 * Normalizes a string key to be alphanumeric and lowercase for robust comparison.
 * Example: "Full Name" -> "fullname", "full_name" -> "fullname"
 */
function normalizeKey(str = "") {
  return String(str || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, "");
}

/**
 * Intelligent value extraction from raw body using multiple potential matching fields.
 * This removes the need for hardcoded aliases.
 */
function getFieldValue(field, body = {}) {
  const possibleKeys = [
    field.field_name,
    field.name,
    field.label,
    field.placeholder
  ].filter(Boolean);

  // Normalize all keys in the body once for efficiency
  const normalizedBody = {};
  Object.keys(body).forEach(key => {
    normalizedBody[normalizeKey(key)] = body[key];
  });

  for (const key of possibleKeys) {
    const normalized = normalizeKey(key);
    if (normalizedBody[normalized] !== undefined && normalizedBody[normalized] !== null) {
      return String(normalizedBody[normalized]).trim();
    }
  }

  // Fallback to fuzzy search if still nothing found
  return findValueFuzzy(field.field_name, body, field.label);
}

/**
 * Normalizes incoming raw data based on the schema fields.
 */
function normalizeData(schemaFields, rawData) {
  if (!schemaFields || !rawData) return rawData || {};
  
  const normalized = {};
  const processedKeys = new Set();

  schemaFields.forEach(field => {
    const value = getFieldValue(field, rawData);

    if (value !== undefined && value !== null) {
      // Logic: Use field.name (semantic) if available, else field_name
      const storageKey = field.name || field.field_name;
      normalized[storageKey] = value;
      
      // Track which raw keys we've used to avoid duplicating data in 'extra' pass
      processedKeys.add(normalizeKey(field.field_name));
      if (field.name) processedKeys.add(normalizeKey(field.name));
      if (field.label) processedKeys.add(normalizeKey(field.label));
    }
  });

  // Discovery pass: Keep extra fields that weren't captured by the schema
  Object.keys(rawData).forEach(key => {
    const nKey = normalizeKey(key);
    const systemFields = ['pageid', 'pageslug', 'projectid', 'domain', 'url', 'token', 'timestamp', 'path', 'data'];
    
    if (!processedKeys.has(nKey) && !systemFields.includes(nKey) && !nKey.startsWith('utm')) {
      normalized[key] = rawData[key];
    }
  });

  return normalized;
}

function findValueFuzzy(targetName, data, label) {
  const t = normalizeKey(targetName);
  const l = normalizeKey(label);
  
  const isGeneric = t.startsWith('field');

  for (const [key, value] of Object.entries(data)) {
    const k = normalizeKey(key);
    
    if (k === t || (l && k === l)) return value;
    
    if (!isGeneric) {
      if (k.includes(t) || t.includes(k)) return value;
      if (l && (k.includes(l) || l.includes(k))) return value;
    }
  }
  return undefined;
}

/**
 * Smart validation logic.
 * Returns array of missing field labels.
 */
function validateForm(fields, data) {
  const missingFields = [];
  
  if (!fields || !Array.isArray(fields)) return [];

  fields.forEach(field => {
    if (!field.required) return;

    const value = getFieldValue(field, data);

    // If truly required but empty
    if (value === undefined || value === null || String(value).trim() === '') {
      // Optional: Leniency for common fields can be added here if needed, 
      // but following strict 'required' from schema is safer.
      missingFields.push(field.label || field.name || field.field_name);
    }
  });

  return missingFields;
}

module.exports = {
  normalizeData,
  validateForm
};
