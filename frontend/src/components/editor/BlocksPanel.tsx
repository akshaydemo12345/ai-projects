import { useState } from 'react';
import { Search } from 'lucide-react';
import { BLOCK_DEFS } from './blockDefs';
import type { BlockType } from '@/types/editor';

interface BlocksPanelProps {
  onAdd: (type: BlockType) => void;
  onDragStart: (type: BlockType) => void;
}

const CATEGORIES = ['Navigation', 'Layout', 'Content', 'Text', 'Media', 'Conversion'] as const;

const BlocksPanel = ({ onAdd, onDragStart }: BlocksPanelProps) => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const filtered = BLOCK_DEFS.filter((b) => {
    const matchSearch = b.label.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === 'All' || b.category === activeCategory;
    return matchSearch && matchCat;
  });

  const grouped = CATEGORIES.reduce<Record<string, typeof BLOCK_DEFS>>((acc, cat) => {
    const items = filtered.filter((b) => b.category === cat);
    if (items.length) acc[cat] = items;
    return acc;
  }, {});

  return (
    <div style={{
      width: 240, flexShrink: 0, background: '#ffffff', borderRight: '1px solid #e5e7eb',
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{ padding: '12px 14px 10px', borderBottom: '1px solid #f1f5f9' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 8 }}>Blocks</div>
        {/* Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f8fafc', border: '1px solid #e5e7eb', borderRadius: 8, padding: '7px 12px' }}>
          <Search size={13} color="#9ca3af" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search blocks..."
            style={{ flex: 1, border: 'none', background: 'none', fontSize: 13, color: '#374151', outline: 'none' }}
          />
        </div>
        {/* Category pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 8 }}>
          {['All', ...CATEGORIES].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 500, border: 'none', cursor: 'pointer',
                background: activeCategory === cat ? '#4f46e5' : '#f1f5f9',
                color: activeCategory === cat ? '#fff' : '#6b7280',
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Block list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '10px 10px 20px' }}>
        {Object.entries(grouped).map(([cat, blocks]) => (
          <div key={cat} style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', letterSpacing: 0.8, textTransform: 'uppercase', padding: '0 4px 8px' }}>{cat}</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
              {blocks.map((b) => (
                <div
                  key={b.type}
                  draggable
                  onDragStart={() => onDragStart(b.type)}
                  onClick={() => onAdd(b.type)}
                  title={`Add ${b.label}`}
                  style={{
                    border: '1px solid #e5e7eb', borderRadius: 8, padding: '12px 8px',
                    textAlign: 'center', cursor: 'grab', background: '#fafafa',
                    transition: 'all .15s', userSelect: 'none',
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#f0f0ff'; (e.currentTarget as HTMLElement).style.borderColor = '#a5b4fc'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = '#fafafa'; (e.currentTarget as HTMLElement).style.borderColor = '#e5e7eb'; }}
                >
                  <div style={{ fontSize: 24, lineHeight: 1, marginBottom: 6 }}>{b.emoji}</div>
                  <div style={{ fontSize: 10, fontWeight: 600, color: '#374151', lineHeight: 1.3 }}>{b.label}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#9ca3af', fontSize: 13 }}>
            No blocks match "{search}"
          </div>
        )}
      </div>
    </div>
  );
};

export default BlocksPanel;
