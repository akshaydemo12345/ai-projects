'use strict';

const https = require('https');
const http = require('http');
const { URL } = require('url');

/**
 * Compute average luminosity of raw RGBA pixel data.
 * Uses the same Rec. 709 formula as the frontend canvas implementation.
 */
function computeBrightnessFromRgba(pixels) {
    let total = 0;
    let count = 0;
    for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i] / 255;
        const g = pixels[i + 1] / 255;
        const b = pixels[i + 2] / 255;
        total += 0.2126 * r + 0.7152 * g + 0.0722 * b;
        count += 1;
    }
    return count > 0 ? total / count : null;
}

/**
 * Fetch raw image bytes from a URL, server-side (no CORS restrictions).
 * Follows up to 5 redirects. Returns a Buffer or throws.
 */
function fetchImageBuffer(rawUrl, redirectsLeft = 5) {
    return new Promise((resolve, reject) => {
        if (redirectsLeft < 0) return reject(new Error('Too many redirects'));

        let parsedUrl;
        try {
            parsedUrl = new URL(rawUrl);
        } catch {
            return reject(new Error('Invalid URL'));
        }

        const driver = parsedUrl.protocol === 'https:' ? https : http;

        const req = driver.get(
            rawUrl,
            {
                headers: {
                    // Mimic a real browser so servers don't block bot UA
                    'User-Agent': 'Mozilla/5.0 (compatible; ImageBrightnessBot/1.0)',
                    'Accept': 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
                },
                timeout: 8000,
            },
            (res) => {
                // Follow redirects (301/302/307/308)
                if ([301, 302, 307, 308].includes(res.statusCode) && res.headers.location) {
                    req.destroy();
                    // Resolve relative redirect URLs against the original
                    const redirectUrl = new URL(res.headers.location, rawUrl).href;
                    return resolve(fetchImageBuffer(redirectUrl, redirectsLeft - 1));
                }

                if (res.statusCode < 200 || res.statusCode >= 300) {
                    req.destroy();
                    return reject(new Error(`HTTP ${res.statusCode}`));
                }

                // Guard: only accept image content types
                const ct = (res.headers['content-type'] || '').toLowerCase();
                if (!ct.startsWith('image/') && !ct.startsWith('application/octet-stream')) {
                    req.destroy();
                    return reject(new Error(`Not an image: ${ct}`));
                }

                const chunks = [];
                res.on('data', (chunk) => chunks.push(chunk));
                res.on('end', () => resolve(Buffer.concat(chunks)));
                res.on('error', reject);
            }
        );

        req.on('error', reject);
        req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
    });
}

/**
 * GET /api/utils/image-brightness?url=<encoded-image-url>
 *
 * Returns JSON:  { brightness: 0.72 }  or  { brightness: null }
 *
 * The brightness value is the average Rec-709 luminosity (0 = black, 1 = white).
 * `null` means the image could not be fetched or analysed (e.g. CORS-only host,
 * non-image response, timeout). The frontend falls back to a neutral UI state.
 *
 * We use Jimp (pure-JS, no native deps) to decode the image pixels server-side.
 * If Jimp is not installed, we return null gracefully rather than crashing.
 */
exports.getImageBrightness = async (req, res) => {
    const { url } = req.query;

    // --- Input validation ---
    if (!url || typeof url !== 'string') {
        return res.status(400).json({ status: 'fail', message: 'url query param required' });
    }

    let parsed;
    try {
        parsed = new URL(url);
    } catch {
        return res.status(400).json({ status: 'fail', message: 'Invalid URL' });
    }

    // Only allow http/https — reject data URIs, file://, etc.
    if (!['http:', 'https:'].includes(parsed.protocol)) {
        return res.status(400).json({ status: 'fail', message: 'Only http/https URLs are allowed' });
    }

    try {
        const imageBuffer = await fetchImageBuffer(url);

        // Attempt to decode with Jimp (installed as a dependency).
        // Jimp is pure-JS, handles PNG/JPEG/GIF/BMP/WebP.
        let brightness = null;
        try {
            // Jimp v1+ uses named export { Jimp } and Jimp.fromBuffer(buffer)
            const { Jimp } = require('jimp');
            const image = await Jimp.fromBuffer(imageBuffer);

            // Sample every Nth pixel for speed on large images
            const { width, height } = image.bitmap;
            const stride = Math.max(1, Math.floor(Math.sqrt((width * height) / 2000)));
            let total = 0;
            let count = 0;

            for (let y = 0; y < height; y += stride) {
                for (let x = 0; x < width; x += stride) {
                    const idx = (y * width + x) * 4;
                    const r = image.bitmap.data[idx] / 255;
                    const g = image.bitmap.data[idx + 1] / 255;
                    const b = image.bitmap.data[idx + 2] / 255;
                    total += 0.2126 * r + 0.7152 * g + 0.0722 * b;
                    count += 1;
                }
            }

            brightness = count > 0 ? total / count : null;
        } catch (decodeErr) {
            // Jimp not installed or couldn't decode — return null (not a hard error)
            console.warn('[utilController] Image decode failed:', decodeErr.message);
            brightness = null;
        }

        return res.json({ brightness });
    } catch (fetchErr) {
        // Image unreachable — not an application error, just return null
        console.warn('[utilController] Image fetch failed:', fetchErr.message, '| URL:', url);
        return res.json({ brightness: null });
    }
};