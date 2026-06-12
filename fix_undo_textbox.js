const fs = require('fs');

let content = fs.readFileSync('frontend/src/components/editor/GrapesEditor.tsx', 'utf8');

// Add prompt to undoData
content = content.replace(
  `        before: { html: beforeHtml, css: beforeCss, text: beforeText },`,
  `        prompt: val,
        before: { html: beforeHtml, css: beforeCss, text: beforeText },`
);

// Replace handleAiActionUndoRedo with handleAiUndo
content = content.replace(
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
  };`,
  `  const handleAiUndo = (data: any, msgIndex: number) => {
    if (!editorRef.current || !data || !data.selectedId) return;
    const editor = editorRef.current;
    
    // Revert the component
    let targetComp = null;
    editor.getWrapper().onAll((comp) => {
      if (comp.getId() === data.selectedId) targetComp = comp;
    });
    
    if (targetComp) {
      const state = data.before;
      const action = data.action;
      if ((action === 'style' || action === 'both') && state.css) {
        targetComp.setStyle(state.css);
      }
      if ((action === 'text' || action === 'both') && state.text) {
        if (targetComp.get('type') !== 'wrapper') targetComp.components(state.text);
      }
      if (action === 'html' && state.html) {
        targetComp.replaceWith(state.html);
      }
    }
    
    // Put prompt back into text box
    if (data.prompt) {
      setChatInput(data.prompt);
      // Focus logic can be handled automatically if the ref is bound, 
      // but setting state is enough.
    }

    // Remove this message and the previous user message from chat
    setChatMessages(prev => {
      const newMsgs = [...prev];
      // remove the AI message
      newMsgs.splice(msgIndex, 1);
      // remove the preceding user message if it matches the prompt
      if (msgIndex - 1 >= 0 && newMsgs[msgIndex - 1].role === 'user') {
        newMsgs.splice(msgIndex - 1, 1);
      }
      return newMsgs;
    });
    
    toast.success('Reverted! Prompt moved to input.');
  };`
);

// Update buttons mapping
const oldButtons = `<button 
                                onClick={() => msg.undoData ? handleAiActionUndoRedo(msg.undoData, true) : editorRef.current?.UndoManager.undo()} 
                                style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 6, padding: '6px 12px', fontSize: 12, color: '#4b5563', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 500, transition: 'all 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
                                onMouseOver={(e) => e.currentTarget.style.borderColor = '#6366f1'}
                                onMouseOut={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 00-9-9 9 9 0 00-6 2.3L3 13"/></svg>
                                Undo
                              </button>
                              <button 
                                onClick={() => msg.undoData ? handleAiActionUndoRedo(msg.undoData, false) : editorRef.current?.UndoManager.redo()} 
                                style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 6, padding: '6px 12px', fontSize: 12, color: '#4b5563', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 500, transition: 'all 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
                                onMouseOver={(e) => e.currentTarget.style.borderColor = '#6366f1'}
                                onMouseOut={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 7v6h-6"/><path d="M3 17a9 9 0 019-9 9 9 0 016 2.3l3 2.7"/></svg>
                                Re-apply
                              </button>`;

const newButtons = `<button 
                                onClick={() => msg.undoData && handleAiUndo(msg.undoData, i)} 
                                style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 6, padding: '6px 12px', fontSize: 12, color: '#4b5563', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 500, transition: 'all 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
                                onMouseOver={(e) => e.currentTarget.style.borderColor = '#6366f1'}
                                onMouseOut={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 00-9-9 9 9 0 00-6 2.3L3 13"/></svg>
                                Undo
                              </button>`;

content = content.replace(oldButtons, newButtons);

fs.writeFileSync('frontend/src/components/editor/GrapesEditor.tsx', content);
console.log('Fixed undo to copy prompt to input');
