const fs = require('fs');

let content = fs.readFileSync('frontend/src/components/editor/GrapesEditor.tsx', 'utf8');

// Update processAiChat
content = content.replace(
  'const processAiChat = async () => {',
  `const processAiChat = async (overrideVal?: string | React.MouseEvent) => {`
);

content = content.replace(
  `    if (!chatInput.trim() || chatLoading || !editorRef.current) return;

    const val = chatInput.trim();
    setChatInput('');`,
  `    const isString = typeof overrideVal === 'string';
    const val = (isString ? overrideVal : chatInput).trim();
    if (!val || chatLoading || !editorRef.current) return;

    if (!isString) setChatInput('');`
);

// Update Undo/Redo buttons in Chat Header
content = content.replace(
  `                    <button
                      onClick={() => setChatMessages([WELCOME_MSG])}
                      title="Clear Chat"
                      style={{ fontSize: 11, color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer', padding: '1px 4px' }}
                    >🗑️</button>`,
  `                    <div style={{ display: 'flex', gap: 4 }}>
                      <button onClick={() => editorRef.current?.UndoManager.undo()} title="Undo Change" style={{ fontSize: 12, color: '#6b7280', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 4, cursor: 'pointer', padding: '2px 6px' }}>↩️ Undo</button>
                      <button onClick={() => editorRef.current?.UndoManager.redo()} title="Redo Change" style={{ fontSize: 12, color: '#6b7280', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 4, cursor: 'pointer', padding: '2px 6px' }}>↪️ Redo</button>
                      <button
                        onClick={() => setChatMessages([WELCOME_MSG])}
                        title="Clear Chat"
                        style={{ fontSize: 11, color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer', padding: '1px 4px', marginLeft: 4 }}
                      >🗑️</button>
                    </div>`
);

// Add Suggestions above chat input
content = content.replace(
  `                  {/* Input Area */}
                  <div style={{ padding: '12px 14px', borderTop: '1px solid #e5e7eb', background: '#f9fafb' }}>`,
  `                  {/* Quick Ideas */}
                  <div style={{ padding: '8px 14px 0', background: '#f9fafb' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {['Make it Dark Mode', 'Change to blue theme', 'Make text larger', 'Fix spelling'].map(s => (
                        <button key={s} onClick={() => processAiChat(s)} disabled={chatLoading} style={{ fontSize: 10, border: '1px solid #e5e7eb', borderRadius: 100, padding: '4px 10px', background: '#fff', cursor: chatLoading ? 'not-allowed' : 'pointer', color: '#4b5563', transition: 'all 0.2s' }}>{s}</button>
                      ))}
                    </div>
                  </div>

                  {/* Input Area */}
                  <div style={{ padding: '8px 14px 12px', borderTop: 'none', background: '#f9fafb' }}>`
);

fs.writeFileSync('frontend/src/components/editor/GrapesEditor.tsx', content);
console.log('Updated GrapesEditor.tsx');
