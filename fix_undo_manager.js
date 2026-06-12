const fs = require('fs');

let content = fs.readFileSync('frontend/src/components/editor/GrapesEditor.tsx', 'utf8');

content = content.replace(
  `      // Apply changes to the selected component`,
  `      // Apply changes to the selected component
      editorRef.current.UndoManager.stop();
      editorRef.current.UndoManager.start();`
);

content = content.replace(
  `        toast.success('✨ AI changes applied successfully!');`,
  `        editorRef.current.UndoManager.stop();
        toast.success('✨ AI changes applied successfully!');`
);

fs.writeFileSync('frontend/src/components/editor/GrapesEditor.tsx', content);
console.log('Fixed UndoManager');
