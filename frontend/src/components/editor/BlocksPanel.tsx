import React, { useState } from 'react';
import { Search, Plus, ChevronDown, ChevronRight } from 'lucide-react';

interface BlocksPanelProps {
  onAdd: (type: string) => void;
  onDragStart: (type: string, ev: React.DragEvent<HTMLDivElement>) => void;
}

const CATEGORIES: any[] = [
  {
    name: 'Basic',
    isGrid: true,
    blocks: [
      { id: 'column1', label: '1 Column', icon: <div className="w-[28px] h-[18px] border-[1.5px] border-zinc-400" /> },
      { id: 'column2', label: '2 Columns', icon: <div className="w-[32px] h-[18px] flex gap-[2px]"><div className="flex-1 border-[1.5px] border-zinc-400" /><div className="flex-1 border-[1.5px] border-zinc-400" /></div> },
      { id: 'column3', label: '3 Columns', icon: <div className="w-[36px] h-[18px] flex gap-[2px]"><div className="flex-1 border-[1.5px] border-zinc-400" /><div className="flex-1 border-[1.5px] border-zinc-400" /><div className="flex-1 border-[1.5px] border-zinc-400" /></div> },
      { id: 'column3-7', label: '2 Columns 3/7', icon: <div className="w-[32px] h-[18px] flex gap-[2px]"><div className="flex-[3] border-[1.5px] border-zinc-400" /><div className="flex-[7] border-[1.5px] border-zinc-400" /></div> },
      { id: 'custom-section', label: 'Section', icon: <div className="w-[24px] h-[18px] flex flex-col justify-between"><div className="h-[3px] bg-zinc-400 w-full rounded-full" /><div className="h-[8px] border-[1.5px] border-zinc-400 w-full" /><div className="h-[3px] bg-zinc-400 w-full rounded-full" /></div> },

      { id: 'divider', label: 'Divider', icon: <div className="w-[24px] h-[18px] flex flex-col justify-center items-center gap-[4px]"><div className="h-[2px] bg-zinc-400 w-full rounded-full" /><div className="h-[2px] bg-zinc-400 w-3/4 rounded-full" /></div> },
      { id: 'custom-heading', label: 'Heading', icon: <span className="font-serif text-[22px] font-bold text-zinc-400 leading-none">H</span> },
      { id: 'custom-text', label: 'Text', icon: <span className="font-serif text-[20px] font-bold text-zinc-400 leading-none">T</span> },
      { id: 'custom-link', label: 'Link', icon: <div className="w-[20px] h-[10px] border-[2px] border-zinc-400 rounded-full flex items-center justify-center"><div className="w-1/2 h-[2px] bg-zinc-400" /></div> },
      { id: 'custom-linkblock', label: 'Link Box', icon: <div className="w-[24px] h-[24px] border-[1.5px] border-zinc-400 flex items-center justify-center text-[10px] font-bold text-zinc-400">🔗</div> },
      { id: 'custom-image', label: 'Image', icon: <div className="w-[24px] h-[18px] border-[1.5px] border-zinc-400 flex items-end overflow-hidden"><div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[10px] border-zinc-400"></div><div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px] border-zinc-400 -ml-1"></div></div> },
      { id: 'custom-image', label: 'Image Box', icon: <div className="w-[24px] h-[24px] border-[1.5px] border-zinc-400 flex items-center justify-center text-[12px] text-zinc-400">🖼</div> },
      { id: 'custom-video', label: 'Video', icon: <div className="w-[24px] h-[18px] border-[1.5px] border-zinc-400 flex items-center justify-center"><div className="w-0 h-0 border-t-[4px] border-t-transparent border-l-[6px] border-zinc-400 border-b-[4px] border-b-transparent ml-1"></div></div> },
      { id: 'custom-map', label: 'Map', icon: <div className="w-[20px] h-[24px] border-[1.5px] border-zinc-400 rounded-b-full rounded-t-full flex items-center justify-center"><div className="w-[6px] h-[6px] bg-zinc-400 rounded-full mb-1"></div></div> },
      { id: 'icon', label: 'Icon', icon: <div className="text-[20px] text-zinc-400 leading-none">💎</div> },
      { id: 'custom-code', label: 'Custom Code', icon: <div className="text-[20px] text-zinc-400 leading-none">HTML</div> },
    ]
  },
  {
    name: 'Sliders',
    isGrid: true,
    icon: '🎠',
    blocks: [
      {
        id: 'swiper-slider',
        label: 'Basic Slider',
        icon: (
          <div className="w-[36px] h-[26px] border-[1.5px] border-indigo-400 rounded-[3px] flex items-center justify-between px-[4px] bg-indigo-50">
            <div className="w-[5px] h-[5px] border-t-[2px] border-l-[2px] border-indigo-400 -rotate-45" />
            <div className="w-[12px] h-[14px] bg-indigo-300 rounded-[2px]" />
            <div className="w-[5px] h-[5px] border-t-[2px] border-r-[2px] border-indigo-400 rotate-45" />
          </div>
        )
      },
      {
        id: 'swiper-grid',
        label: 'Grid Slider',
        icon: (
          <div className="w-[36px] h-[26px] border-[1.5px] border-violet-400 rounded-[3px] flex items-center justify-center gap-[2px] p-[3px] bg-violet-50">
            <div className="flex-1 h-full bg-violet-300 rounded-[1px]" />
            <div className="flex-1 h-full bg-violet-300 rounded-[1px]" />
            <div className="flex-1 h-full bg-violet-300 rounded-[1px]" />
          </div>
        )
      },
      {
        id: 'swiper-cards',
        label: 'Card Slider',
        icon: (
          <div className="w-[36px] h-[26px] border-[1.5px] border-pink-400 rounded-[3px] flex items-center gap-[3px] px-[4px] bg-pink-50">
            <div className="w-[10px] h-[18px] bg-pink-300 rounded-[2px] flex-shrink-0" />
            <div className="flex flex-col gap-[2px] flex-1">
              <div className="h-[2px] bg-pink-400 rounded-full w-full" />
              <div className="h-[2px] bg-pink-300 rounded-full w-3/4" />
              <div className="h-[2px] bg-pink-200 rounded-full w-1/2" />
            </div>
          </div>
        )
      },
      {
        id: 'swiper-hero',
        label: 'Hero Slider',
        icon: (
          <div className="w-[36px] h-[26px] bg-gradient-to-br from-blue-400 to-indigo-500 border-[1.5px] border-indigo-400 rounded-[3px] flex flex-col items-center justify-center gap-[2px]">
            <div className="h-[2px] bg-white rounded-full w-3/4" />
            <div className="h-[1px] bg-white/70 rounded-full w-1/2" />
          </div>
        )
      },
    ]
  },
  {
    name: 'Forms',
    isGrid: true,
    blocks: [
      { id: 'custom-form', label: 'Form', icon: <div className="w-[24px] h-[18px] flex flex-col justify-between"><div className="h-[4px] border border-zinc-400 w-full" /><div className="h-[4px] border border-zinc-400 w-full" /><div className="h-[5px] bg-zinc-400 w-1/2" /></div> },
      { id: 'custom-input', label: 'Input', icon: <div className="w-[28px] h-[10px] border-[1.5px] border-zinc-400 rounded-sm flex items-center px-1"><div className="w-[2px] h-[6px] bg-zinc-400" /></div> },
      { id: 'custom-textarea', label: 'Textarea', icon: <div className="w-[28px] h-[20px] border-[1.5px] border-zinc-400 rounded-sm flex items-start justify-end p-[2px]"><div className="w-0 h-0 border-b-[4px] border-zinc-400 border-l-[4px] border-l-transparent"></div></div> },
      { id: 'custom-select', label: 'Select', icon: <div className="w-[28px] h-[12px] border-[1.5px] border-zinc-400 rounded-sm flex items-center justify-end px-1"><div className="w-0 h-0 border-t-[3px] border-zinc-400 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent"></div></div> },
      { id: 'custom-button', label: 'Button', icon: <div className="w-[26px] h-[12px] bg-zinc-400 rounded-sm flex items-center justify-center"><div className="w-[10px] h-[2px] bg-zinc-800 rounded-sm"></div></div> },
      { id: 'custom-check', label: 'Checkbox', icon: <div className="w-[12px] h-[12px] border-[1.5px] border-zinc-400 rounded-sm flex items-center justify-center"><div className="w-[6px] h-[6px] bg-zinc-400 rounded-[1px]"></div></div> },
      { id: 'custom-radio', label: 'Radio', icon: <div className="w-[14px] h-[14px] border-[1.5px] border-zinc-400 rounded-full flex items-center justify-center"><div className="w-[6px] h-[6px] bg-zinc-400 rounded-full"></div></div> },
      { id: 'lead-form', label: 'Lead Form', icon: <div className="w-[24px] h-[24px] border-[1.5px] border-zinc-400 rounded-sm flex items-center justify-center text-[10px] font-bold text-zinc-400">📋</div> }
    ]
  },
  {
    name: 'Embeds',
    isGrid: true,
    blocks: [
      { id: 'form-embed', label: 'Form Embed', icon: <div className="w-[24px] h-[24px] border-[1.5px] border-zinc-400 rounded-sm flex items-center justify-center text-[10px] font-bold text-zinc-400">{'</>'}</div> }
    ]
  },
  {
    name: 'Layout',
    isGrid: false,
    blocks: [
      { id: 'column1', label: '1 Column', layoutCols: [1] },
      { id: 'column2', label: '2 Columns 50/50', layoutCols: [1, 1] },
      { id: 'column2', label: '2 Columns 25/75', layoutCols: [1, 3] },
      { id: 'column2', label: '2 Columns 75/25', layoutCols: [3, 1] },
      { id: 'column3', label: '3 Columns', layoutCols: [1, 1, 1] },
      { id: 'column3', label: '3 Columns 50/25/25', layoutCols: [2, 1, 1] },
      { id: 'column3', label: '3 Columns 25/50/25', layoutCols: [1, 2, 1] },
      { id: 'column3', label: '3 Columns 25/25/50', layoutCols: [1, 1, 2] },
    ]
  }

];

const BlocksPanel = ({ onAdd, onDragStart }: BlocksPanelProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCats, setExpandedCats] = useState<Record<string, boolean>>({
    Basic: true, Sliders: true, Forms: true, Embeds: true, 'Data Sources': true, Layout: true
  });

  const toggleCat = (cat: string) => {
    setExpandedCats(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  return (
    <div className="w-full flex-shrink-0 flex flex-col bg-[#fff] text-sm h-full font-sans select-none" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>

      {/* Search Bar */}
      <div className="px-3 py-3 border-b border-[#e5e7eb] bg-[#fff]">
        <div className="relative">
          <Search className="absolute left-2.5 top-[8px] text-[#71717a]" size={14} />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#f9fafb] border border-[#d1d5db] hover:border-[#9ca3af] focus:border-[#6366f1] rounded-[4px] py-1.5 pl-8 pr-3 text-[13px] focus:outline-none text-[#000000] placeholder:text-[#9ca3af] transition-colors"
          />
        </div>
      </div>

      {/* Accordion Categories */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden bg-[#fff] custom-scroll">
        {CATEGORIES.map(category => {
          const blocks = category.blocks.filter(b => b.label.toLowerCase().includes(searchQuery.toLowerCase()));
          if (blocks.length === 0) return null;

          const isExpanded = expandedCats[category.name];

          return (
            <div key={category.name} className="border-b border-[#e5e7eb]">
              <button
                onClick={() => toggleCat(category.name)}
                className="flex items-center justify-between w-full px-3 py-2.5 text-left bg-[#fff] hover:bg-[#f9fafb] transition-colors group"
              >
                <span className="font-medium text-[#000000] text-[13px]">
                  {category.name}
                </span>
                {isExpanded ?
                  <ChevronDown size={14} className="text-[#6b7280] group-hover:text-[#000000] transition-colors" /> :
                  <ChevronRight size={14} className="text-[#6b7280] group-hover:text-[#000000] transition-colors" />
                }
              </button>

              {isExpanded && (
                <div className="p-3 bg-[#fff]">
                  {category.isGrid ? (
                    <div className="grid grid-cols-2 gap-[6px]">
                      {blocks.map(block => (
                        <div
                          key={block.label}
                          draggable
                          onDragStart={(e) => onDragStart(block.id, e)}
                          onClick={() => onAdd(block.id)}
                          className="flex flex-col items-center justify-center py-4 px-2 aspect-[1.3] bg-transparent border border-[#e5e7eb] rounded-[4px] cursor-grab active:cursor-grabbing hover:bg-[#f9fafb] hover:border-[#d1d5db] transition-all group"
                        >
                          <div className="h-[28px] flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                            {block.icon}
                          </div>
                          <span className="text-[11px] mt-1 text-[#4b5563] group-hover:text-[#111827] text-center leading-tight">
                            {block.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {blocks.map(block => (
                        <div
                          key={block.label}
                          draggable
                          onDragStart={(e) => onDragStart(block.id, e)}
                          onClick={() => onAdd(block.id)}
                          className="flex flex-col gap-1 cursor-grab active:cursor-grabbing group"
                        >
                          {/* Layout wireframe rendering */}
                          <div className="w-full h-[22px] flex gap-[4px]">
                            {block.layoutCols?.map((col: number, idx: number) => (
                              <div key={idx} style={{ flex: col }} className="border border-[#d1d5db] group-hover:border-[#9ca3af] bg-transparent rounded-[1px] transition-colors" />
                            ))}
                          </div>
                          <span className="text-[11px] text-[#6b7280] group-hover:text-[#111827] text-center transition-colors">
                            {block.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Fixed Button */}
      <div className="px-3 py-3 border-t border-[#e5e7eb] bg-[#fff]">
        <button className="flex items-center justify-center w-full gap-2 bg-[#6366f1] hover:bg-[#4f46e5] text-white font-medium py-2 rounded-[4px] transition-colors text-[13px]">
          <Plus size={16} />
          <span>Add more blocks</span>
        </button>
      </div>

    </div>
  );
};

export default BlocksPanel;