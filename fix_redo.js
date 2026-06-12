const fs = require('fs');
let content = fs.readFileSync('frontend/src/components/editor/GrapesEditor.tsx', 'utf8');

content = content.replace(
  `                            <div style={{ marginTop: 8, display: 'flex', gap: 6 }}>
                              <button onClick={() => editorRef.current?.UndoManager.undo()} style={{ background: '#fff', border: '1px solid #d1d5db', borderRadius: 6, padding: '4px 10px', fontSize: 11, color: '#4b5563', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                                ↩️ Undo
                              </button>
                            </div>`,
  `                            <div style={{ marginTop: 8, display: 'flex', gap: 6 }}>
                              <button onClick={() => editorRef.current?.UndoManager.undo()} style={{ background: '#fff', border: '1px solid #d1d5db', borderRadius: 6, padding: '4px 10px', fontSize: 11, color: '#4b5563', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                                ↩️ Undo
                              </button>
                              <button onClick={() => editorRef.current?.UndoManager.redo()} style={{ background: '#fff', border: '1px solid #d1d5db', borderRadius: 6, padding: '4px 10px', fontSize: 11, color: '#4b5563', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                                ↪️ Re-apply
                              </button>
                            </div>`
);

fs.writeFileSync('frontend/src/components/editor/GrapesEditor.tsx', content);
console.log("Added Re-apply button");
