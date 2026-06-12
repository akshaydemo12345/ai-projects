const fs = require('fs');

let content = fs.readFileSync('frontend/src/components/editor/GrapesEditor.tsx', 'utf8');

// Modify chat message interface
content = content.replace(
  `const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'ai', content: string }[]>(() => {`,
  `const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'ai', content: string, undoData?: any }[]>(() => {`
);

// Modify processAiChat to store state
content = content.replace(
  `      const aiHtml = parsed.html || parsed.modified_html || parsed.new_html;
      const action = parsed.action || (aiHtml ? 'html' : aiCss ? 'style' : aiText ? 'text' : 'both');`,
  `      const aiHtml = parsed.html || parsed.modified_html || parsed.new_html;
      const action = parsed.action || (aiHtml ? 'html' : aiCss ? 'style' : aiText ? 'text' : 'both');
      
      const beforeHtml = selected.toHTML();
      const beforeCss = selected.getStyle();
      const beforeText = selected.components().models.map(m => m.get('content')).join('');`
);

content = content.replace(
  `        const historyEntry = {
          id: Date.now().toString(),`,
  `        const historyEntry = {
          id: Date.now().toString(),`
);

content = content.replace(
  `      setChatMessages(prev => [...prev, { role: 'ai', content: aiResponse }]);`,
  `      const undoData = {
        action,
        selectedId: selected.getId(),
        before: { html: beforeHtml, css: beforeCss, text: beforeText },
        after: { html: aiHtml, css: aiCss, text: aiText }
      };
      setChatMessages(prev => [...prev, { role: 'ai', content: aiResponse, undoData }]);`
);

// Add manual undo/redo handler function
content = content.replace(
  `  const processAiChat = async (overrideVal?: string | React.MouseEvent) => {`,
  `  const handleAiActionUndoRedo = (data: any, isUndo: boolean) => {
    if (!editorRef.current || !data || !data.selectedId) return;
    const editor = editorRef.current;
    
    // Find the component by its saved ID
    let targetComp = null;
    editor.getWrapper().onAll((comp) => {
      if (comp.getId() === data.selectedId) targetComp = comp;
    });
    
    if (!targetComp) {
       toast.error("Element not found on canvas anymore.");
       return;
    }
    
    const state = isUndo ? data.before : data.after;
    const action = data.action;

    if ((action === 'style' || action === 'both') && state.css) {
      if (isUndo) {
        targetComp.setStyle(state.css);
      } else {
        const kebabCss: Record<string, string> = {};
        Object.entries(state.css).forEach(([key, value]) => {
          const kebab = key.replace(/([A-Z])/g, '-$1').toLowerCase();
          kebabCss[kebab] = value as string;
        });
        const currentStyle = targetComp.getStyle() || {};
        targetComp.setStyle({ ...currentStyle, ...kebabCss });
      }
    }

    if ((action === 'text' || action === 'both') && state.text) {
      if (targetComp.get('type') !== 'wrapper') {
        targetComp.components(state.text);
      }
    }

    if (action === 'html' && state.html) {
      targetComp.replaceWith(state.html);
    }
    
    toast.success(isUndo ? 'Reverted to previous state' : 'Re-applied AI changes');
  };

  const processAiChat = async (overrideVal?: string | React.MouseEvent) => {`
);

// Update buttons in chat mapping
content = content.replace(
  `<button 
                                onClick={() => editorRef.current?.UndoManager.undo()} 
                                style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 6, padding: '6px 12px', fontSize: 12, color: '#4b5563', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 500, transition: 'all 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}`,
  `<button 
                                onClick={() => msg.undoData ? handleAiActionUndoRedo(msg.undoData, true) : editorRef.current?.UndoManager.undo()} 
                                style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 6, padding: '6px 12px', fontSize: 12, color: '#4b5563', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 500, transition: 'all 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}`
);

content = content.replace(
  `<button 
                                onClick={() => editorRef.current?.UndoManager.redo()} 
                                style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 6, padding: '6px 12px', fontSize: 12, color: '#4b5563', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 500, transition: 'all 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}`,
  `<button 
                                onClick={() => msg.undoData ? handleAiActionUndoRedo(msg.undoData, false) : editorRef.current?.UndoManager.redo()} 
                                style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 6, padding: '6px 12px', fontSize: 12, color: '#4b5563', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 500, transition: 'all 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}`
);

fs.writeFileSync('frontend/src/components/editor/GrapesEditor.tsx', content);
console.log('Fixed manual undo/redo logic');
