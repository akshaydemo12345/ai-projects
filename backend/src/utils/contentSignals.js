'use strict';

const cleanText = (text = '') =>
  text
    .replace(/\s+/g, ' ')
    .replace(/\n/g, ' ')
    .trim();

const extractVisibleText = ($) => {
  $('script, style, noscript').remove();

  return cleanText($('body').text()).slice(0, 25000);
};

const extractMetaSignals = ($) => {
  return {
    title: $('title').text()?.trim() || '',
    description:
      $('meta[name="description"]').attr('content') ||
      $('meta[property="og:description"]').attr('content') ||
      '',
    keywords:
      $('meta[name="keywords"]').attr('content') || '',
    ogTitle:
      $('meta[property="og:title"]').attr('content') ||
      '',
  };
};

const extractJsonLd = ($) => {
  const schemas = [];

  $('script[type="application/ld+json"]').each((i, el) => {
    try {
      const raw = $(el).html();

      if (!raw) return;

      const parsed = JSON.parse(raw);

      if (Array.isArray(parsed)) {
        schemas.push(...parsed);
      } else {
        schemas.push(parsed);
      }
    } catch (e) {}
  });

  return schemas;
};

const extractBrandingColors = ($) => {
  const colors = new Map();

  const addColor = (color) => {
    if (!color) return;

    const normalized = color.toLowerCase();

    if (
      /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(
        normalized
      )
    ) {
      colors.set(
        normalized,
        (colors.get(normalized) || 0) + 1
      );
    }
  };

  $('[style]').each((i, el) => {
    const style = $(el).attr('style') || '';

    const matches = style.match(
      /#(?:[0-9a-fA-F]{3}){1,2}/g
    );

    if (matches) {
      matches.forEach(addColor);
    }
  });

  $('meta[name="theme-color"]').each((i, el) => {
    addColor($(el).attr('content'));
  });

  const sorted = [...colors.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([color]) => color);

  return sorted.slice(0, 5);
};

const buildKeywordCorpus = ({
  visibleText,
  meta,
  jsonLd,
}) => {
  const schemaText = JSON.stringify(jsonLd || []);

  return cleanText(`
    ${visibleText}
    ${meta.title}
    ${meta.description}
    ${meta.keywords}
    ${meta.ogTitle}
    ${schemaText}
  `).toLowerCase();
};

module.exports = {
  extractVisibleText,
  extractMetaSignals,
  extractJsonLd,
  extractBrandingColors,
  buildKeywordCorpus,
};
