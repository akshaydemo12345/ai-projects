const fs = require('fs');
let content = fs.readFileSync('frontend/src/components/editor/GrapesEditor.tsx', 'utf8');

// Remove top buttons
content = content.replace(
  `<div style={{ display: 'flex', gap: 4 }}>
                      <button onClick={() => editorRef.current?.UndoManager.undo()} title="Undo Change" style={{ fontSize: 12, color: '#6b7280', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 4, cursor: 'pointer', padding: '2px 6px' }}>↩️ Undo</button>
                      <button onClick={() => editorRef.current?.UndoManager.redo()} title="Redo Change" style={{ fontSize: 12, color: '#6b7280', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 4, cursor: 'pointer', padding: '2px 6px' }}>↪️ Redo</button>
                      <button
                        onClick={() => setChatMessages([WELCOME_MSG])}
                        title="Clear Chat"
                        style={{ fontSize: 11, color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer', padding: '1px 4px', marginLeft: 4 }}
                      >🗑️</button>
                    </div>`,
  `<button
                      onClick={() => setChatMessages([WELCOME_MSG])}
                      title="Clear Chat"
                      style={{ fontSize: 11, color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer', padding: '1px 4px' }}
                    >🗑️</button>`
);

// Inject inline undo button inside message mapping
content = content.replace(
  `{msg.content}
                        </div>`,
  `{msg.content}
                          {msg.role === 'ai' && msg.content.includes('✅ Done!') && (
                            <div style={{ marginTop: 8, display: 'flex', gap: 6 }}>
                              <button onClick={() => editorRef.current?.UndoManager.undo()} style={{ background: '#fff', border: '1px solid #d1d5db', borderRadius: 6, padding: '4px 10px', fontSize: 11, color: '#4b5563', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                                ↩️ Undo
                              </button>
                            </div>
                          )}
                        </div>`
);

fs.writeFileSync('frontend/src/components/editor/GrapesEditor.tsx', content);
console.log("Fixed inline undo");
