import('grapesjs').then(grapesjs => {
  const domEl = document.createElement('div');
  const editor = grapesjs.default.init({ container: domEl, headless: true });
  editor.StyleManager.addType('my-color', {
    create(props) {
      console.log('Props keys:', Object.keys(props));
      return document.createElement('div');
    }
  });
  // Force it to render so create is called
  editor.StyleManager.addSector('test', { properties: [{ type: 'my-color', property: 'color' }] });
  editor.StyleManager.render();
});
