const fs = require('fs');

let content = fs.readFileSync('frontend/src/components/editor/GrapesEditor.tsx', 'utf8');

// The string to replace
const target = `                            <div style={{ marginTop: 8, display: 'flex', gap: 6 }}>
                              <button onClick={() => editorRef.current?.UndoManager.undo()} style={{ background: '#fff', border: '1px solid #d1d5db', borderRadius: 6, padding: '4px 10px', fontSize: 11, color: '#4b5563', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                                ↩️ Undo
                              </button>
                              <button onClick={() => editorRef.current?.UndoManager.redo()} style={{ background: '#fff', border: '1px solid #d1d5db', borderRadius: 6, padding: '4px 10px', fontSize: 11, color: '#4b5563', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                                ↪️ Re-apply
                              </button>
                            </div>`;

const replacement = `                            <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
                              <button 
                                onClick={() => editorRef.current?.UndoManager.undo()} 
                                style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 6, padding: '6px 12px', fontSize: 12, color: '#4b5563', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 500, transition: 'all 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
                                onMouseOver={(e) => e.currentTarget.style.borderColor = '#6366f1'}
                                onMouseOut={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 00-9-9 9 9 0 00-6 2.3L3 13"/></svg>
                                Undo
                              </button>
                              <button 
                                onClick={() => editorRef.current?.UndoManager.redo()} 
                                style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 6, padding: '6px 12px', fontSize: 12, color: '#4b5563', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 500, transition: 'all 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
                                onMouseOver={(e) => e.currentTarget.style.borderColor = '#6366f1'}
                                onMouseOut={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 7v6h-6"/><path d="M3 17a9 9 0 019-9 9 9 0 016 2.3l3 2.7"/></svg>
                                Re-apply
                              </button>
                            </div>`;

content = content.replace(target, replacement);

fs.writeFileSync('frontend/src/components/editor/GrapesEditor.tsx', content);
console.log('Fixed styling');
