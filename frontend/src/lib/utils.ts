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
