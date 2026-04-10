import { useEffect, useRef } from 'react';

const PreviewPage = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const html = localStorage.getItem('grapes-preview-html');
    if (html && iframeRef.current) {
      const doc = iframeRef.current.contentDocument;
      if (doc) {
        doc.open();
        doc.write(html);
        doc.close();
      }
    }
  }, []);

  return (
    <iframe
      ref={iframeRef}
      title="Page Preview"
      style={{ width: '100vw', height: '100vh', border: 'none', display: 'block' }}
    />
  );
};

export default PreviewPage;
