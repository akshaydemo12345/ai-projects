import { Monitor, Tablet, Smartphone, Undo2, Redo2, Save, Eye, Zap, Sparkles } from 'lucide-react';

interface EditorToolbarProps {
  pageName: string;
  device: 'desktop' | 'tablet' | 'mobile';
  onDevice: (d: 'desktop' | 'tablet' | 'mobile') => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
  onPreview: () => void;
  onPublish: () => void;
  onAI: () => void;
}

const EditorToolbar = ({ pageName, device, onDevice, canUndo, canRedo, onUndo, onRedo, onSave, onPreview, onPublish, onAI }: EditorToolbarProps) => {
  const devBtn = (d: typeof device, Icon: React.FC<any>, title: string) => (
    <button
      title={title}
      onClick={() => onDevice(d)}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        width: 34, height: 34, borderRadius: 6, border: 'none', cursor: 'pointer',
        background: device === d ? '#e0e7ff' : 'transparent',
        color: device === d ? '#4f46e5' : '#6b7280',
        transition: 'all .15s',
      }}
    >
      <Icon size={16} />
    </button>
  );

  const iconBtn = (onClick: () => void, Icon: React.FC<any>, title: string, disabled = false) => (
    <button
      title={title}
      onClick={onClick}
      disabled={disabled}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        width: 34, height: 34, borderRadius: 6, border: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
        background: 'transparent', color: disabled ? '#d1d5db' : '#6b7280',
        transition: 'all .15s',
      }}
    >
      <Icon size={16} />
    </button>
  );

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
      height: 52, background: '#ffffff', borderBottom: '1px solid #e5e7eb',
      display: 'flex', alignItems: 'center', padding: '0 14px', gap: 8,
      boxShadow: '0 1px 6px rgba(0,0,0,.07)',
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 16 }}>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Zap size={14} color="#fff" />
        </div>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{pageName}</span>
      </div>

      {/* Undo / Redo */}
      <div style={{ display: 'flex', gap: 2 }}>
        {iconBtn(onUndo, Undo2, 'Undo', !canUndo)}
        {iconBtn(onRedo, Redo2, 'Redo', !canRedo)}
      </div>

      <div style={{ width: 1, height: 22, background: '#e5e7eb', margin: '0 6px' }} />

      {/* Device selector */}
      <div style={{ display: 'flex', gap: 2 }}>
        {devBtn('desktop', Monitor, 'Desktop')}
        {devBtn('tablet', Tablet, 'Tablet (768px)')}
        {devBtn('mobile', Smartphone, 'Mobile (375px)')}
      </div>

      <div style={{ flex: 1 }} />

      {/* AI Button */}
      <button
        onClick={onAI}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', color: '#fff',
          border: 'none', borderRadius: 8, padding: '7px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer',
        }}
      >
        <Sparkles size={13} /> AI Generate
      </button>

      <div style={{ width: 1, height: 22, background: '#e5e7eb', margin: '0 4px' }} />

      {/* Preview / Save / Publish */}
      <button onClick={onPreview} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'transparent', border: '1px solid #e5e7eb', borderRadius: 8, padding: '7px 14px', fontSize: 13, fontWeight: 500, color: '#6b7280', cursor: 'pointer' }}>
        <Eye size={13} /> Preview
      </button>
      <button onClick={onSave} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'transparent', border: '1px solid #e5e7eb', borderRadius: 8, padding: '7px 14px', fontSize: 13, fontWeight: 500, color: '#374151', cursor: 'pointer' }}>
        <Save size={13} /> Save
      </button>
      <button onClick={onPublish} style={{ background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 8, padding: '7px 18px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
        Publish
      </button>
    </div>
  );
};

export default EditorToolbar;
