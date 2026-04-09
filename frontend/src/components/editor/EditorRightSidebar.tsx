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
            /* Properties Tab - Content editing */
            <div className="space-y-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-white/40 mb-2">Edit Content</p>
              {selected.type === "hero" && (
                <>
                  <div>
                    <label className="text-[10px] text-white/40">Heading</label>
                    <input
                      className="mt-1 h-8 w-full rounded bg-[hsl(240,10%,18%)] border border-[hsl(240,10%,25%)] px-2 text-xs text-white"
                      value={(selected.content.heading as string) || ""}
                      onChange={(e) => onUpdateContent(selected.id, { ...selected.content, heading: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-white/40">Subheading</label>
                    <textarea
                      className="mt-1 w-full rounded bg-[hsl(240,10%,18%)] border border-[hsl(240,10%,25%)] px-2 py-1.5 text-xs text-white min-h-[60px]"
                      value={(selected.content.subheading as string) || ""}
                      onChange={(e) => onUpdateContent(selected.id, { ...selected.content, subheading: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-white/40">CTA Text</label>
                    <input
                      className="mt-1 h-8 w-full rounded bg-[hsl(240,10%,18%)] border border-[hsl(240,10%,25%)] px-2 text-xs text-white"
                      value={(selected.content.cta as string) || ""}
                      onChange={(e) => onUpdateContent(selected.id, { ...selected.content, cta: e.target.value })}
                    />
                  </div>
                </>
              )}
              {selected.type === "features" && (
                <>
                  {((selected.content.features as Array<{ title: string; description: string }>) || []).map((f, i) => (
                    <div key={i} className="space-y-2 border-b border-[hsl(240,10%,18%)] pb-3">
                      <div>
                        <label className="text-[10px] text-white/40">Feature {i + 1} Title</label>
                        <input
                          className="mt-1 h-8 w-full rounded bg-[hsl(240,10%,18%)] border border-[hsl(240,10%,25%)] px-2 text-xs text-white"
                          value={f.title}
                          onChange={(e) => {
                            const features = [...(selected.content.features as Array<{ title: string; description: string }>)];
                            features[i] = { ...features[i], title: e.target.value };
                            onUpdateContent(selected.id, { ...selected.content, features });
                          }}
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-white/40">Description</label>
                        <textarea
                          className="mt-1 w-full rounded bg-[hsl(240,10%,18%)] border border-[hsl(240,10%,25%)] px-2 py-1.5 text-xs text-white min-h-[50px]"
                          value={f.description}
                          onChange={(e) => {
                            const features = [...(selected.content.features as Array<{ title: string; description: string }>)];
                            features[i] = { ...features[i], description: e.target.value };
                            onUpdateContent(selected.id, { ...selected.content, features });
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </>
              )}
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
