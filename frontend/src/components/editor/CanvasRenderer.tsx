import { useRef, useState } from 'react';
import { Trash2, ArrowUp, ArrowDown, Copy, GripVertical } from 'lucide-react';
import type { Block, BlockType } from '@/types/editor';
import { renderBlock } from './BlockRenderer';

interface CanvasRendererProps {
  blocks: Block[];
  selectedId: string | null;
  device: 'desktop' | 'tablet' | 'mobile';
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
  onReorder: (blocks: Block[]) => void;
  onDropNewBlock: (type: BlockType, afterIndex: number) => void;
  draggedType: BlockType | null;
}

const DEVICE_WIDTH = { desktop: '100%', tablet: '768px', mobile: '375px' };

const CanvasRenderer = ({
  blocks, selectedId, device, onSelect, onDelete, onDuplicate, onMoveUp, onMoveDown, onReorder, onDropNewBlock, draggedType,
}: CanvasRendererProps) => {
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Drag existing block (reorder)
  const handleBlockDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('blockId', id);
    setDraggingId(id);
  };

  const handleBlockDragEnd = () => {
    setDraggingId(null);
    setDragOverIndex(null);
  };

  // Drop zone logic
  const handleDropZoneDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDropZoneDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    const blockId = e.dataTransfer.getData('blockId');

    if (blockId) {
      // Reorder existing block
      const fromIdx = blocks.findIndex((b) => b.id === blockId);
      if (fromIdx === -1 || fromIdx === index) return;
      const updated = [...blocks];
      const [moved] = updated.splice(fromIdx, 1);
      updated.splice(fromIdx < index ? index - 1 : index, 0, moved);
      onReorder(updated);
    } else if (draggedType) {
      // Add new block from panel
      onDropNewBlock(draggedType, index);
    }

    setDragOverIndex(null);
    setDraggingId(null);
  };

  const DropZone = ({ index }: { index: number }) => (
    <div
      onDragOver={(e) => handleDropZoneDragOver(e, index)}
      onDragleave={() => setDragOverIndex(null)}
      onDrop={(e) => handleDropZoneDrop(e, index)}
      style={{
        height: dragOverIndex === index ? 52 : 8,
        background: dragOverIndex === index ? '#e0e7ff' : 'transparent',
        border: dragOverIndex === index ? '2px dashed #6366f1' : '2px dashed transparent',
        borderRadius: 6,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all .15s',
        margin: '0 0',
      }}
    >
      {dragOverIndex === index && <span style={{ fontSize: 11, color: '#6366f1', fontWeight: 600 }}>Drop here</span>}
    </div>
  );

  const isFirst = (id: string) => blocks[0]?.id === id;
  const isLast = (id: string) => blocks[blocks.length - 1]?.id === id;

  return (
    <div
      style={{
        flex: 1, background: '#e8eaed', overflowY: 'auto', display: 'flex',
        flexDirection: 'column', alignItems: 'center', padding: '24px 20px',
      }}
      onClick={(e) => { if (e.currentTarget === e.target) {} }}
    >
      {/* Page canvas */}
      <div
        ref={canvasRef}
        style={{
          width: DEVICE_WIDTH[device],
          maxWidth: '100%',
          background: '#fff',
          minHeight: 'calc(100vh - 100px)',
          boxShadow: '0 4px 32px rgba(0,0,0,.12)',
          borderRadius: 6,
          overflow: 'hidden',
          transition: 'width .3s',
          fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        }}
      >
        {blocks.length === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 400, color: '#9ca3af' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🧱</div>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>Canvas is empty</div>
            <div style={{ fontSize: 13 }}>Drag blocks from the left panel or click to add</div>
          </div>
        )}

        {/* First drop zone */}
        <DropZone index={0} />

        {blocks.map((block, idx) => {
          const sel = selectedId === block.id;
          return (
            <div key={block.id}>
              {/* Block wrapper */}
              <div
                style={{
                  position: 'relative',
                  outline: sel ? '2px solid #6366f1' : '2px solid transparent',
                  outlineOffset: -2,
                  opacity: draggingId === block.id ? 0.4 : 1,
                  transition: 'outline .1s',
                }}
                onClick={(e) => { e.stopPropagation(); onSelect(block.id); }}
              >
                {/* Block floating toolbar */}
                {sel && (
                  <div style={{
                    position: 'absolute', top: 0, right: 0, zIndex: 100,
                    display: 'flex', alignItems: 'center', gap: 2,
                    background: '#6366f1', borderRadius: '0 0 0 8px',
                    padding: '4px 8px',
                  }}>
                    {/* Drag handle */}
                    <div
                      draggable
                      onDragStart={(e) => handleBlockDragStart(e, block.id)}
                      onDragEnd={handleBlockDragEnd}
                      style={{ cursor: 'grab', color: '#fff', padding: '2px 4px', display: 'flex', alignItems: 'center' }}
                      title="Drag to reorder"
                    >
                      <GripVertical size={14} />
                    </div>
                    <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,.3)' }} />
                    {!isFirst(block.id) && (
                      <button onClick={(e) => { e.stopPropagation(); onMoveUp(block.id); }} style={tbtn} title="Move up"><ArrowUp size={13} /></button>
                    )}
                    {!isLast(block.id) && (
                      <button onClick={(e) => { e.stopPropagation(); onMoveDown(block.id); }} style={tbtn} title="Move down"><ArrowDown size={13} /></button>
                    )}
                    <button onClick={(e) => { e.stopPropagation(); onDuplicate(block.id); }} style={tbtn} title="Duplicate"><Copy size={13} /></button>
                    <button onClick={(e) => { e.stopPropagation(); onDelete(block.id); }} style={{ ...tbtn, color: '#fca5a5' }} title="Delete"><Trash2 size={13} /></button>
                  </div>
                )}

                {/* Block label (top-left when selected) */}
                {sel && (
                  <div style={{ position: 'absolute', top: 0, left: 0, background: '#6366f1', color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: '0 0 8px 0', letterSpacing: 0.5, textTransform: 'uppercase', zIndex: 100 }}>
                    {block.type.replace(/-/g, ' ')}
                  </div>
                )}

                {/* Actual block content */}
                <div style={{ pointerEvents: 'none' }}>
                  {renderBlock(block)}
                </div>
              </div>

              {/* Drop zone after each block */}
              <DropZone index={idx + 1} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

const tbtn: React.CSSProperties = {
  background: 'none', border: 'none', color: '#fff', cursor: 'pointer',
  padding: '2px 4px', display: 'flex', alignItems: 'center', borderRadius: 4,
};

export default CanvasRenderer;
