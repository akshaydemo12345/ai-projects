/**
 * PageCraft AI - WordPress Loader SDK
 * Fetches and renders AI landing pages within WordPress
 */
(function() {
  const token = window.__PC_TOKEN__;
  const page = window.__PC_PAGE__;
  
  if (!token || !page) {
    console.error('PageCraft AI: Missing token or page slug');
    return;
  }

  // Find the mounting point or default to body
  const mountPoint = document.getElementById('pc-landing-page') || document.body;

  function executeScripts(container) {
    if (!container) return;
    const scripts = container.querySelectorAll('script');
    const registry = window.__PC_SCRIPT_REGISTRY__ || new Set();
    window.__PC_SCRIPT_REGISTRY__ = registry;

    scripts.forEach(oldScript => {
      const newScript = document.createElement('script');
      Array.from(oldScript.attributes).forEach(attr => {
        newScript.setAttribute(attr.name, attr.value);
      });

      const src = oldScript.getAttribute('src');
      if (src) {
        if (registry.has(src)) {
          oldScript.remove();
          return;
        }
        registry.add(src);
      }

      if (oldScript.innerHTML) {
        newScript.innerHTML = oldScript.innerHTML;
      } else if (oldScript.textContent) {
        newScript.textContent = oldScript.textContent;
      }

      if (oldScript.parentNode) {
        oldScript.parentNode.replaceChild(newScript, oldScript);
      }
    });
  }

  async function loadPage() {
    try {
      const response = await fetch(`${window.location.origin}/p/${page}?token=${token}`);
      if (!response.ok) throw new Error('Failed to load page');
      
      const data = await response.json();
      const content = data.page.content;
      
      const html = content.fullHtml || '';
      const css = content.fullCss || '';
      const js = content.fullJs || '';

      // Inject CSS
      const styleTag = document.createElement('style');
      styleTag.innerHTML = css;
      document.head.appendChild(styleTag);

      // Inject HTML
      mountPoint.innerHTML = html;

      // Execute scripts within HTML (important for form embeds)
      executeScripts(mountPoint);

      // Inject JS
      if (js) {
        const scriptTag = document.createElement('script');
        scriptTag.innerHTML = js;
        document.body.appendChild(scriptTag);
      }

      console.log('PageCraft AI: Page loaded successfully');
    } catch (err) {
      console.error('PageCraft AI Error:', err);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadPage);
  } else {
    loadPage();
  }
})();
