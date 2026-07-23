/**
 * Utility to execute scripts within a container that were inserted via innerHTML.
 * Browsers do not execute <script> tags inserted via innerHTML for security reasons.
 * This function finds all script tags, creates new ones, and executes them.
 */
export function executeScripts(container: HTMLElement) {
  if (!container) return;

  const scripts = container.querySelectorAll('script');
  const scriptRegistry = (window as any).__PC_SCRIPT_REGISTRY__ || new Set();
  (window as any).__PC_SCRIPT_REGISTRY__ = scriptRegistry;

  scripts.forEach((oldScript) => {
    const newScript = document.createElement('script');
    
    // Copy all attributes
    Array.from(oldScript.attributes).forEach((attr) => {
      newScript.setAttribute(attr.name, attr.value);
    });

    // Check for duplicate external scripts
    const src = oldScript.getAttribute('src');
    if (src) {
      if (scriptRegistry.has(src)) {
        console.log(`[Embed] Skipping duplicate script: ${src}`);
        oldScript.remove();
        return;
      }
      scriptRegistry.add(src);
    }

    // Copy content for inline scripts
    if (oldScript.innerHTML) {
      newScript.innerHTML = oldScript.innerHTML;
    } else if (oldScript.textContent) {
      newScript.textContent = oldScript.textContent;
    }

    // Replace the script tag
    if (oldScript.parentNode) {
      oldScript.parentNode.replaceChild(newScript, oldScript);
    }
  });
}
