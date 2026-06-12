const fs = require('fs');

let content = fs.readFileSync('frontend/src/components/editor/GrapesEditor.tsx', 'utf8');

// Update processAiChat to capture new component if replaced
content = content.replace(
  `      if (action === 'html' && aiHtml) {
        selected.replaceWith(aiHtml);
        changeApplied = true;
      }`,
  `      let finalSelectedId = selected.getId();
      if (action === 'html' && aiHtml) {
        const newComps = selected.replaceWith(aiHtml);
        if (newComps && newComps.length > 0) {
           finalSelectedId = newComps[0].getId();
        } else if (newComps && !Array.isArray(newComps)) {
           finalSelectedId = newComps.getId();
        }
        changeApplied = true;
      }`
);

// Update undoData to use finalSelectedId
content = content.replace(
  `        selectedId: selected.getId(),`,
  `        selectedId: finalSelectedId,`
);

// Add console.logs to handleAiUndo to debug
content = content.replace(
  `  const handleAiUndo = (data: any, msgIndex: number) => {
    if (!editorRef.current || !data || !data.selectedId) return;
    const editor = editorRef.current;
    
    // Revert the component
    let targetComp = null;
    editor.getWrapper().onAll((comp) => {
      if (comp.getId() === data.selectedId) targetComp = comp;
    });`,
  `  const handleAiUndo = (data: any, msgIndex: number) => {
    if (!editorRef.current || !data || !data.selectedId) return;
    const editor = editorRef.current;
    
    // Revert the component
    let targetComp = null;
    try {
      editor.getWrapper().onAll((comp: any) => {
        if (comp.getId() === data.selectedId) targetComp = comp;
      });
    } catch(e) {
      console.error(e);
    }
    
    if (!targetComp) {
      // Fallback: try to just use currently selected
      targetComp = activeComponent || editor.getSelected();
    }`
);

// Update textarea state
content = content.replace(
  `    // Put prompt back into text box
    if (data.prompt) {
      setChatInput(data.prompt);
      // Focus logic can be handled automatically if the ref is bound, 
      // but setting state is enough.
    }`,
  `    // Put prompt back into text box
    if (data.prompt) {
      setChatInput(data.prompt);
      setTimeout(() => {
        if (aiInputRef.current) {
           aiInputRef.current.focus();
           aiInputRef.current.value = data.prompt;
        }
      }, 50);
    }`
);

fs.writeFileSync('frontend/src/components/editor/GrapesEditor.tsx', content);
console.log('Fixed reference');
