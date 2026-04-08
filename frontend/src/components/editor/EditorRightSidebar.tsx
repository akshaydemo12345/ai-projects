import { useState } from "react";
import { Input } from "@/components/ui/input";
import type { PageSection } from "@/services/api";

interface EditorRightSidebarProps {
  selected: PageSection | undefined;
  onUpdateContent: (id: string, content: Record<string, unknown>) => void;
}

const EditorRightSidebar = ({ selected, onUpdateContent }: EditorRightSidebarProps) => {
  const [rightTab, setRightTab] = useState<"Styles" | "Properties">("Styles");

  const DisplayButton = ({ label, active }: { label: string; active?: boolean }) => (
    <button className={`rounded px-2.5 py-1.5 text-[10px] font-medium transition-colors ${
      active ? "bg-primary text-primary-foreground" : "bg-[hsl(240,10%,22%)] text-white/40 hover:text-white/60"
    }`}>
      {label}
    </button>
  );

  return (
    <div className="mt-12 w-64 flex-shrink-0 border-l border-[hsl(240,10%,18%)] bg-[hsl(240,10%,12%)] overflow-y-auto">
      <div className="flex border-b border-[hsl(240,10%,18%)]">
        {(["Styles", "Properties"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setRightTab(tab)}
            className={`flex-1 px-3 py-3 text-xs font-medium transition-colors ${
              rightTab === tab
                ? "border-b-2 border-primary text-primary"
                : "text-white/40 hover:text-white/60"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {selected ? (
        <div className="p-4 space-y-5">
          {rightTab === "Styles" ? (
            <>
              {/* Selection tags */}
              <div>
                <p className="text-[11px] text-white/40 mb-2">Selection</p>
                <div className="flex gap-1.5 flex-wrap">
                  <span className="rounded bg-[hsl(240,10%,22%)] px-2 py-1 text-[10px] text-white/50">gs-section</span>
                  <span className="rounded bg-[hsl(240,10%,22%)] px-2 py-1 text-[10px] text-white/50">header-section</span>
                  <span className="rounded bg-primary/20 border border-primary/30 px-2 py-1 text-[10px] text-primary">Section</span>
                </div>
              </div>

              {/* Layout */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-medium text-white">Layout</p>
                  <span className="text-[10px] text-primary">Flex</span>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-[10px] text-white/40 mb-1.5">Display</p>
                    <div className="flex gap-1">
                      {["Flex", "—", "—", "—"].map((v, i) => (
                        <DisplayButton key={i} label={v} active={i === 0} />
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-white/40 mb-1.5">Direction</p>
                    <div className="flex gap-1">
                      {["↓", "→", "↑", "←"].map((v, i) => (
                        <DisplayButton key={i} label={v} active={i === 0} />
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-white/40 mb-1.5">Justify</p>
                    <div className="flex gap-1">
                      {["T", "I", "f", "H", "—", "H"].map((v, i) => (
                        <DisplayButton key={i} label={v} active={i === 0} />
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-white/40 mb-1.5">Align</p>
                    <div className="flex gap-1">
                      {["T", "⊥", "I", "□", "B"].map((v, i) => (
                        <DisplayButton key={i} label={v} active={i === 0} />
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-white/40 mb-1.5">Gap</p>
                    <div className="grid grid-cols-2 gap-2">
                      <input className="h-7 rounded bg-[hsl(240,10%,18%)] border border-[hsl(240,10%,25%)] px-2 text-[11px] text-white w-full" defaultValue="0" />
                      <input className="h-7 rounded bg-[hsl(240,10%,18%)] border border-[hsl(240,10%,25%)] px-2 text-[11px] text-white w-full" defaultValue="0" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Size */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-medium text-white">Size</p>
                  <div className="h-2 w-2 rounded-full bg-warning" />
                </div>
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-[10px] text-white/40 mb-1">Width</p>
                      <input className="h-7 rounded bg-[hsl(240,10%,18%)] border border-[hsl(240,10%,25%)] px-2 text-[11px] text-white w-full" defaultValue="100" />
                    </div>
                    <div>
                      <p className="text-[10px] text-white/40 mb-1">Height</p>
                      <input className="h-7 rounded bg-[hsl(240,10%,18%)] border border-[hsl(240,10%,25%)] px-2 text-[11px] text-white w-full" defaultValue="auto" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-[10px] text-white/40 mb-1">Min Width</p>
                      <input className="h-7 rounded bg-[hsl(240,10%,18%)] border border-[hsl(240,10%,25%)] px-2 text-[11px] text-white w-full" defaultValue="auto" />
                    </div>
                    <div>
                      <p className="text-[10px] text-white/40 mb-1">Min Height</p>
                      <input className="h-7 rounded bg-[hsl(240,10%,18%)] border border-[hsl(240,10%,25%)] px-2 text-[11px] text-white w-full" defaultValue="auto" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-[10px] text-white/40 mb-1">Max Width</p>
                      <input className="h-7 rounded bg-[hsl(240,10%,18%)] border border-[hsl(240,10%,25%)] px-2 text-[11px] text-white w-full" defaultValue="auto" />
                    </div>
                    <div>
                      <p className="text-[10px] text-white/40 mb-1">Max Height</p>
                      <input className="h-7 rounded bg-[hsl(240,10%,18%)] border border-[hsl(240,10%,25%)] px-2 text-[11px] text-white w-full" defaultValue="auto" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Space */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-medium text-white">Space</p>
                  <div className="h-2 w-2 rounded-full bg-warning" />
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-[10px] text-white/40 mb-1">Padding</p>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] text-white/40">Custom</span>
                      <div className="flex gap-1 ml-auto">
                        {["□", "I", "—"].map((v, i) => (
                          <button key={i} className={`rounded px-2 py-1 text-[10px] ${i === 2 ? "bg-primary text-primary-foreground" : "bg-[hsl(240,10%,22%)] text-white/40"}`}>{v}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-[10px] text-white/40 mb-1">Top</p>
                      <input className="h-7 rounded bg-[hsl(240,10%,18%)] border border-[hsl(240,10%,25%)] px-2 text-[11px] text-white w-full" defaultValue="20" />
                    </div>
                    <div>
                      <p className="text-[10px] text-white/40 mb-1">Right</p>
                      <input className="h-7 rounded bg-[hsl(240,10%,18%)] border border-[hsl(240,10%,25%)] px-2 text-[11px] text-white w-full" defaultValue="auto" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-[10px] text-white/40 mb-1">Left</p>
                      <input className="h-7 rounded bg-[hsl(240,10%,18%)] border border-[hsl(240,10%,25%)] px-2 text-[11px] text-white w-full" defaultValue="0" />
                    </div>
                    <div>
                      <p className="text-[10px] text-white/40 mb-1">Right</p>
                      <input className="h-7 rounded bg-[hsl(240,10%,18%)] border border-[hsl(240,10%,25%)] px-2 text-[11px] text-white w-full" defaultValue="0" />
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Properties Tab - Dynamic Content editing */
            <div className="space-y-4 pb-10">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-white/40">
                  {selected.type} Content
                </p>
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              </div>
              
              {Object.entries(selected.content).map(([key, value]) => {
                // Helper to humanize keys (e.g. primaryCta -> Primary Cta)
                const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
                
                // 1. Handle Simple Strings / Numbers
                if (typeof value === "string" || typeof value === "number") {
                  const isLongText = (value as string).length > 60 || key.toLowerCase().includes("description") || key.toLowerCase().includes("content") || key.toLowerCase().includes("about");
                  
                  return (
                    <div key={key} className="space-y-1.5">
                      <label className="text-[10px] text-white/50">{label}</label>
                      {isLongText ? (
                        <textarea
                          className="w-full rounded bg-[hsl(240,10%,18%)] border border-[hsl(240,10%,25%)] px-2 py-2 text-xs text-white min-h-[80px] focus:outline-none focus:border-primary/50 transition-colors"
                          value={value || ""}
                          onChange={(e) => onUpdateContent(selected.id, { ...selected.content, [key]: e.target.value })}
                        />
                      ) : (
                        <input
                          className="h-8 w-full rounded bg-[hsl(240,10%,18%)] border border-[hsl(240,10%,25%)] px-2 text-xs text-white focus:outline-none focus:border-primary/50 transition-colors"
                          value={value || ""}
                          onChange={(e) => onUpdateContent(selected.id, { ...selected.content, [key]: e.target.value })}
                        />
                      )}
                    </div>
                  );
                }

                // 2. Handle Arrays (e.g. features.list, pricing.list)
                if (Array.isArray(value)) {
                  return (
                    <div key={key} className="space-y-4 pt-2 border-t border-[hsl(240,10%,18%)]">
                      <p className="text-[10px] font-bold text-primary/80 uppercase tracking-widest">{label}</p>
                      {value.map((item, index) => (
                        <div key={index} className="space-y-3 bg-[hsl(240,10%,15%)] p-3 rounded-lg border border-[hsl(240,10%,18%)]">
                          <p className="text-[9px] text-white/30 font-mono">Item #${index + 1}</p>
                          {typeof item === "object" && item !== null ? (
                            Object.entries(item).map(([subKey, subValue]) => (
                              <div key={subKey} className="space-y-1">
                                <label className="text-[9px] text-white/40 uppercase font-medium">{subKey}</label>
                                <input
                                  className="h-7 w-full rounded bg-[hsl(240,10%,12%)] border border-[hsl(240,10%,20%)] px-2 text-[11px] text-white"
                                  value={(subValue as string) || ""}
                                  onChange={(e) => {
                                    const newList = [...value];
                                    newList[index] = { ...newList[index], [subKey]: e.target.value };
                                    onUpdateContent(selected.id, { ...selected.content, [key]: newList });
                                  }}
                                />
                              </div>
                            ))
                          ) : (
                            <input
                              className="h-7 w-full rounded bg-[hsl(240,10%,12%)] border border-[hsl(240,10%,20%)] px-2 text-[11px] text-white"
                              value={(item as string) || ""}
                              onChange={(e) => {
                                const newList = [...value];
                                newList[index] = e.target.value;
                                onUpdateContent(selected.id, { ...selected.content, [key]: newList });
                              }}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  );
                }

                // 3. Handle Nested Objects (if any, e.g. a nested settings object)
                if (typeof value === "object" && value !== null) {
                   return (
                     <div key={key} className="space-y-2 pt-2 border-t border-[hsl(240,10%,18%)]">
                        <p className="text-[10px] font-bold text-white/40 uppercase">{label}</p>
                        <div className="pl-2 space-y-2 border-l border-[hsl(240,10%,20%)]">
                          {Object.entries(value).map(([nestedKey, nestedValue]) => (
                            <div key={nestedKey} className="space-y-1">
                               <label className="text-[9px] text-white/40">{nestedKey}</label>
                               <input
                                  className="h-7 w-full rounded bg-[hsl(240,10%,12%)] border border-[hsl(240,10%,20%)] px-2 text-[11px] text-white"
                                  value={(nestedValue as string) || ""}
                                  onChange={(e) => {
                                    onUpdateContent(selected.id, { 
                                      ...selected.content, 
                                      [key]: { ...(selected.content[key] as object), [nestedKey]: e.target.value } 
                                    });
                                  }}
                               />
                            </div>
                          ))}
                        </div>
                     </div>
                   );
                }

                return null;
              })}
            </div>
          )}
        </div>
      ) : (
        <div className="p-4 flex items-center justify-center h-40">
          <p className="text-xs text-white/30 text-center">Select a section to edit its properties</p>
        </div>
      )}
    </div>
  );
};

export default EditorRightSidebar;
