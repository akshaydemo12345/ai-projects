/**
 * Client-Side Image Compression & Optimization Utility
 * Prevents "Payload Too Large" and DB length limit errors by compressing base64 images and file uploads.
 */

interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'image/webp' | 'image/jpeg' | 'image/png';
}

/**
 * Compresses an image File or Blob using offscreen Canvas.
 * Returns a compressed base64 Data URL.
 */
export async function compressImageFile(
  file: File | Blob,
  options: CompressionOptions = {}
): Promise<string> {
  const { maxWidth = 1200, maxHeight = 1200, quality = 0.75 } = options;

  // Don't compress SVGs or tiny files (< 40KB)
  if (file.type === 'image/svg+xml') {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (!dataUrl) {
        return reject(new Error('Failed to read file as data URL'));
      }
      compressBase64Image(dataUrl, options)
        .then(resolve)
        .catch(reject);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Compresses a base64 image data URL using Canvas.
 * Scales down large resolutions and converts to optimized WebP or JPEG.
 */
export async function compressBase64Image(
  dataUrl: string,
  options: CompressionOptions = {}
): Promise<string> {
  const { maxWidth = 1200, maxHeight = 1200, quality = 0.75 } = options;

  // Skip SVGs, GIFs (to preserve animation), or tiny base64 strings (< 30KB)
  if (
    !dataUrl ||
    dataUrl.startsWith('data:image/svg+xml') ||
    dataUrl.startsWith('data:image/gif') ||
    dataUrl.length < 40000
  ) {
    return dataUrl;
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        if (width === 0 || height === 0) {
          return resolve(dataUrl);
        }

        // Calculate aspect ratio bounded dimensions
        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return resolve(dataUrl);
        }

        // Draw image onto canvas
        ctx.fillStyle = '#ffffff'; // White background fallback for transparent PNGs converted to JPEG
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        // Target format (WebP if supported, fallback to JPEG)
        const format = options.format || (dataUrl.startsWith('data:image/png') ? 'image/webp' : 'image/jpeg');

        const compressedDataUrl = canvas.toDataURL(format, quality);

        // Only return compressed version if it actually reduced the payload size
        if (compressedDataUrl.length < dataUrl.length) {
          resolve(compressedDataUrl);
        } else {
          resolve(dataUrl);
        }
      } catch (err) {
        console.warn('Base64 image compression failed, using original:', err);
        resolve(dataUrl);
      }
    };

    img.onerror = () => {
      console.warn('Failed to load image for compression, using original');
      resolve(dataUrl);
    };

    img.src = dataUrl;
  });
}

/**
 * Scans an HTML or CSS string for base64 image Data URIs (>30KB)
 * and compresses them concurrently. Returns optimized string.
 */
export async function compressHtmlAndCssImages(
  content: string,
  options: CompressionOptions = {}
): Promise<string> {
  if (!content) return content;

  // Regex to find data URIs for png, jpeg, jpg, webp
  const dataUriRegex = /data:image\/(?:png|jpeg|jpg|webp);base64,[A-Za-z0-9+/=]+/g;
  const matches = Array.from(new Set(content.match(dataUriRegex) || []));

  // Filter out small images (< 40KB base64 string)
  const largeMatches = matches.filter((dataUrl) => dataUrl.length >= 40000);

  if (largeMatches.length === 0) {
    return content;
  }

  console.log(`🗜️ Compressing ${largeMatches.length} large image payload(s) in page content...`);

  // Compress large matches in parallel
  const compressionResults = await Promise.all(
    largeMatches.map(async (dataUrl) => {
      const compressed = await compressBase64Image(dataUrl, options);
      return { original: dataUrl, compressed };
    })
  );

  let updatedContent = content;
  for (const { original, compressed } of compressionResults) {
    if (compressed && compressed.length < original.length) {
      // Replace all occurrences of this base64 string
      updatedContent = updatedContent.split(original).join(compressed);
    }
  }

  console.log(`✅ Image compression completed! Reduced content size from ${(content.length / 1024).toFixed(1)}KB to ${(updatedContent.length / 1024).toFixed(1)}KB.`);
  return updatedContent;
}
