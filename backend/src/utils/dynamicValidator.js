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
 * Returns { value, usedKeys } where usedKeys is an array of raw keys found in the body.
 */
function getFieldValueWithKeys(field, body = {}) {
  const possibleKeys = [
    field.field_name,
    field.name,
    field.label,
    field.placeholder
  ].filter(Boolean);

  const usedRawKeys = [];
  let foundValue = undefined;

  // 1. Direct matches
  for (const key of possibleKeys) {
    if (body[key] !== undefined && body[key] !== null) {
      usedRawKeys.push(key);
      if (foundValue === undefined) foundValue = String(body[key]).trim();
    }
  }

  // 2. Normalized matches (if not found directly)
  if (foundValue === undefined) {
    const normalizedTargetKeys = possibleKeys.map(k => normalizeKey(k));
    for (const [rawKey, val] of Object.entries(body)) {
      if (normalizedTargetKeys.includes(normalizeKey(rawKey))) {
        usedRawKeys.push(rawKey);
        if (foundValue === undefined) foundValue = String(val).trim();
      }
    }
  }

  // 3. Fallback to fuzzy
  if (foundValue === undefined) {
    const fuzzyResult = findValueFuzzy(field.field_name, body, field.label);
    if (fuzzyResult) {
      // In fuzzy, we don't easily know the key, but findValueFuzzy can be updated
      // For now, let's keep it simple.
      foundValue = fuzzyResult;
    }
  }

  return { value: foundValue, usedKeys: usedRawKeys };
}

// Wrapper for existing calls
function getFieldValue(field, body = {}) {
  return getFieldValueWithKeys(field, body).value;
}

/**
 * Normalizes incoming raw data based on the schema fields.
 */
function normalizeData(schemaFields, rawData) {
  if (!schemaFields || !rawData) return rawData || {};
  
  const normalized = {};
  const processedRawKeys = new Set();

  // pass 1: Schema-based mapping
  schemaFields.forEach(field => {
    const { value, usedKeys } = getFieldValueWithKeys(field, rawData);

    if (value !== undefined && value !== null) {
      const storageKey = field.name || field.field_name;
      normalized[storageKey] = value;
      
      usedKeys.forEach(k => processedRawKeys.add(k));
      // Also add normalized versions for safety
      processedRawKeys.add(normalizeKey(field.field_name));
      if (field.name) processedRawKeys.add(normalizeKey(field.name));
    }
  });

  // Pass 2: Discovery pass (Extra fields)
  // Logic: ONLY keep fields that aren't already processed AND aren't obvious aliases 
  // of processed fields (like email_address vs email)
  const systemFields = ['pageid', 'pageslug', 'projectid', 'domain', 'url', 'token', 'timestamp', 'path', 'data'];
  
  Object.keys(rawData).forEach(key => {
    const nKey = normalizeKey(key);
    
    if (processedRawKeys.has(key) || processedRawKeys.has(nKey)) return;
    if (systemFields.includes(nKey) || nKey.startsWith('utm')) return;

    // Last check: is this a semantic alias of an existing key in 'normalized'?
    const isAlias = Object.keys(normalized).some(normKey => {
      const nNorm = normalizeKey(normKey);
      return nKey === nNorm || nKey.includes(nNorm) || nNorm.includes(nKey);
    });

    if (!isAlias) {
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
 * Smart validation logic with Auto-Healing.
 * Returns array of missing field labels.
 */
function validateForm(fields, data) {
  const missingFields = [];
  
  if (!fields || !Array.isArray(fields)) return [];

  // 1. Detect Template Mismatch (Self-Healing)
  // If we have several fields in the schema but almost none of them match the incoming data
  // while the incoming data HAS content, it means the template was changed.
  const submittedKeys = Object.keys(data).filter(k => 
    !['pageslug', 'pageid', 'projectid', 'domain', 'url', 'token', 'timestamp', 'path'].includes(k.toLowerCase())
  );
  
  let matchCount = 0;
  fields.forEach(f => {
    if (getFieldValue(f, data)) matchCount++;
  });

  const matchRate = matchCount / (fields.length || 1);
  const hasDataButNoMatch = (submittedKeys.length > 2 && matchRate < 0.2);

  fields.forEach(field => {
    if (!field.required) return;

    const value = getFieldValue(field, data);

    // If truly required but empty
    if (value === undefined || value === null || String(value).trim() === '') {
      
      // AUTO-HEALING LEVEL 1: If template likely changed, don't block.
      if (hasDataButNoMatch) {
         console.warn(`[VALIDATOR] Auto-Healing: Skipping required check for "${field.label}" (Likely template mismatch)`);
         return;
      }

      // AUTO-HEALING LEVEL 2: Leniency for generic fields if primary info is present
      const normLabel = normalizeKey(field.label || field.name || "");
      const isCoreField = normLabel.includes('email') || normLabel.includes('phone') || normLabel.includes('name');
      const hasEmailOrPhone = !!(getFieldValue({label: 'Email', name: 'email'}, data) || getFieldValue({label: 'Phone', name: 'phone'}, data));

      if (!isCoreField && hasEmailOrPhone) {
        console.info(`[VALIDATOR] Lenient Pass: Skipping optional-looking required field "${field.label}" because email/phone was provided.`);
        return;
      }

      missingFields.push(field.label || field.name || field.field_name);
    }
  });

  return missingFields;
}

module.exports = {
  normalizeData,
  validateForm
};
