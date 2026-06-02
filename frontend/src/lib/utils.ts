import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Copies text to clipboard with modern API and fallback support.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  // Try modern Clipboard API first
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.error("Async: Could not copy text: ", err);
    }
  }

  // Fallback to execCommand('copy')
  try {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    
    // Ensure the textarea is not visible but part of the DOM
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    textArea.style.top = "0";
    document.body.appendChild(textArea);
    
    textArea.focus();
    textArea.select();
    
    const successful = document.execCommand("copy");
    document.body.removeChild(textArea);
    return !!successful;
  } catch (err) {
    console.error("Fallback: Unable to copy", err);
    return false;
  }
}

/**
 * Ensures a URL starts with a protocol (http/https).
 */
export const normalizeLogoUrl = (url?: string | null): string | undefined => {
  if (!url) return undefined;

  let normalized = url.trim();
  if (!normalized) return undefined;

  // Protocol-relative URLs
  if (normalized.startsWith('//')) {
    normalized = `https:${normalized}`;
  }

  // Already a valid data URI
  if (/^data:image\/[a-zA-Z]+;base64,/.test(normalized)) {
    return normalized;
  }

  // Already an absolute URL
  if (/^https?:\/\//i.test(normalized)) {
    return normalized;
  }

  // Raw base64 string without prefix
  if (/^[A-Za-z0-9+/=\s]+$/.test(normalized) && normalized.length > 100) {
    return `data:image/png;base64,${normalized.replace(/\s+/g, '')}`;
  }

  // Relative path or fallback string - leave it as-is for the browser to resolve
  return normalized;
};

export const cleanUrl = (url?: string) => {
  if (!url) return "#";
  // If URL already has protocol, return as-is
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  // If it's a localhost URL without protocol
  if (url.includes("localhost") || url.includes("127.0.0.1")) {
    return `http://${url}`;
  }
  // Otherwise, add https://
  return `https://${url}`;
};

export const getImageAverageBrightness = async (src: string): Promise<number | null> => {
  if (!src) return null;

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(null);
          return;
        }

        // Composite transparent images over white so light/white logos are detected properly.
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        let total = 0;
        let count = 0;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i] / 255;
          const g = data[i + 1] / 255;
          const b = data[i + 2] / 255;
          const luminosity = 0.2126 * r + 0.7152 * g + 0.0722 * b;
          total += luminosity;
          count += 1;
        }

        resolve(count > 0 ? total / count : null);
      } catch (error) {
        resolve(null);
      }
    };

    img.onerror = () => resolve(null);
    img.src = src;
  });
};

export const getLogoPreviewContainerClasses = (brightness: number | null): string => {
  if (brightness === null) {
    return "border border-slate-300 bg-slate-200 dark:border-slate-600 dark:bg-slate-700";
  }

  return brightness >= 0.65
    ? "border border-slate-700 bg-slate-950 dark:border-slate-500 dark:bg-slate-950"
    : "border border-slate-300 bg-slate-200 dark:border-slate-600 dark:bg-slate-700";
};
