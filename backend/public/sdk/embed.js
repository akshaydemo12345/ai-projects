/**
 * PageCraft AI - Generic Embed SDK
 * Usage: <script src=".../sdk/embed.js?token=TOKEN&page=SLUG"></script>
 */
(function() {
  const currentScript = document.currentScript;
  const url = new URL(currentScript.src);
  const token = url.searchParams.get('token');
  const page = url.searchParams.get('page');
  const apiBase = url.origin;

  if (!token || !page) {
    console.error('PageCraft AI: Missing token or page slug in embed script');
    return;
  }

  async function loadPage() {
    try {
      const response = await fetch(`${apiBase}/p/${page}?token=${token}`);
      if (!response.ok) throw new Error('Failed to load page');
      
      const data = await response.json();
      const content = data.page.content;
      
      const html = content.fullHtml || '';
      const css = content.fullCss || '';
      const js = content.fullJs || '';

      // Create a container if not already there
      let container = document.getElementById('pc-embed-container');
      if (!container) {
        container = document.createElement('div');
        container.id = 'pc-embed-container';
        currentScript.parentNode.insertBefore(container, currentScript);
      }

      // Inject CSS
      const styleTag = document.createElement('style');
      styleTag.innerHTML = css;
      document.head.appendChild(styleTag);

      // Inject HTML
      container.innerHTML = html;

      // Inject JS
      if (js) {
        const scriptTag = document.createElement('script');
        scriptTag.innerHTML = js;
        document.body.appendChild(scriptTag);
      }

      console.log('PageCraft AI: Embedded page loaded successfully');
    } catch (err) {
      console.error('PageCraft AI Error:', err);
    }
  }

  loadPage();
})();
