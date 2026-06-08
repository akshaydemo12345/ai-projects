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

// Accepts an already-rendered HTMLImageElement — avoids all CORS issues entirely.
// The browser has already loaded and displayed the image; drawing it into a
// canvas is always permitted regardless of image origin.
export function getImageAverageBrightness(img: HTMLImageElement): number | null {
  try {
    const w = img.naturalWidth || img.width;
    const h = img.naturalHeight || img.height;
    if (!w || !h) return null;
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    // Composite over white so transparent/light logos read correctly
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(img, 0, 0, w, h);
    const { data } = ctx.getImageData(0, 0, w, h);
    let total = 0, count = 0;
    for (let i = 0; i < data.length; i += 4) {
      total += 0.2126 * (data[i] / 255) + 0.7152 * (data[i + 1] / 255) + 0.0722 * (data[i + 2] / 255);
      count++;
    }
    return count > 0 ? total / count : null;
  } catch {
    return null;
  }
}


export const getLogoPreviewContainerClasses = (brightness: number | null): string => {
  if (brightness === null) {
    return "border border-slate-300 bg-slate-200 dark:border-slate-600 dark:bg-slate-700";
  }

  return brightness >= 0.65
    ? "border border-slate-700 bg-slate-950 dark:border-slate-500 dark:bg-slate-950"
    : "border border-slate-300 bg-slate-200 dark:border-slate-600 dark:bg-slate-700";
};