'use strict';

const https = require('https');

/**
 * Extracts design tokens (colors, font-families) from a Figma URL if a token is provided.
 * @param {string} figmaUrl - The public Figma URL
 * @param {string} token - Figma Personal Access Token
 * @returns {Promise<Object>} - Extra design metadata
 */
const fetchFigmaDesign = (figmaUrl, token) => {
  return new Promise((resolve, reject) => {
    if (!token || !figmaUrl) {
      return resolve({ colors: [], typography: {} });
    }

    try {
      // 1. Extract File Key from URL (e.g. figma.com/file/FILE_KEY/...)
      const fileKey = figmaUrl.split('/file/')[1]?.split('/')[0];
      if (!fileKey) {
        console.log('Invalid Figma URL for API fetching, skipping...');
        return resolve({ colors: [], typography: {} });
      }

      const options = {
        hostname: 'api.figma.com',
        path: `/v1/files/${fileKey}`,
        method: 'GET',
        headers: {
          'X-Figma-Token': token,
        },
      };

      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            const parsed = JSON.parse(data);
            if (parsed.status === 403 || parsed.status === 404) {
              return resolve({ colors: [], typography: {}, error: 'Design inaccessible' });
            }

            // Simple extraction logic: find all unique colors in the document
            const colors = new Set();
            const processNode = (node) => {
              if (node.fills) {
                node.fills.forEach((fill) => {
                  if (fill.type === 'SOLID' && fill.color) {
                    const { r, g, b } = fill.color;
                    const hex = `#${[r, g, b].map((c) => Math.round(c * 255).toString(16).padStart(2, '0')).join('')}`;
                    colors.add(hex.toUpperCase());
                  }
                });
              }
              if (node.children) {
                node.children.forEach(processNode);
              }
            };

            if (parsed.document) {
              processNode(parsed.document);
            }

            resolve({
              colors: Array.from(colors).slice(0, 5), // Limit to top 5
              documentName: parsed.name,
              lastModified: parsed.lastModified,
            });
          } catch (err) {
            resolve({ colors: [], typography: {}, error: 'Parsing error' });
          }
        });
      });

      req.on('error', (err) => {
        resolve({ colors: [], typography: {}, error: 'Network error' });
      });

      req.setTimeout(5000, () => {
        req.destroy();
        resolve({ colors: [], typography: {}, error: 'Timeout' });
      });

      req.end();
    } catch (err) {
      resolve({ colors: [], typography: {}, error: 'Critical error' });
    }
  });
};

module.exports = { fetchFigmaDesign };
