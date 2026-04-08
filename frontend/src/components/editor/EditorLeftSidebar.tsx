import { useState } from "react";
import { Type, LayoutGrid, GripVertical, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { PageSection } from "@/services/api";

interface EditorLeftSidebarProps {
  sections: PageSection[];
  selectedSection: string | null;
  onSelectSection: (id: string) => void;
  onReorderSections: (sections: PageSection[]) => void;
  onAddSection: (type: PageSection["type"]) => void;
  pageTitle: string;
  metaDesc: string;
  onPageTitleChange: (v: string) => void;
  onMetaDescChange: (v: string) => void;
}

const EditorLeftSidebar = ({
  sections,
  selectedSection,
  onSelectSection,
  onReorderSections,
  onAddSection,
  pageTitle,
  metaDesc,
  onPageTitleChange,
  onMetaDescChange,
}: EditorLeftSidebarProps) => {
  const [activeTab, setActiveTab] = useState<"Content" | "Design" | "Settings">("Content");
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [addMenuOpen, setAddMenuOpen] = useState(false);

  const handleDragStart = (idx: number) => setDraggedIdx(idx);

  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === idx) return;
    const reordered = [...sections];
    const [moved] = reordered.splice(draggedIdx, 1);
    reordered.splice(idx, 0, moved);
    onReorderSections(reordered);
    setDraggedIdx(idx);
  };

  const handleDragEnd = () => setDraggedIdx(null);

  const sectionIcon = (type: string) => {
    if (type === "hero") return <Type className="h-3.5 w-3.5" />;
    return <LayoutGrid className="h-3.5 w-3.5" />;
  };

  const sectionTypes: { type: PageSection["type"]; label: string }[] = [
    { type: "hero", label: "Hero Section" },
    { type: "features", label: "Features Grid" },
    { type: "testimonials", label: "Testimonials" },
    { type: "pricing", label: "Pricing" },
    { type: "contact", label: "Contact Form" },
  ];

  return (
    <div className="mt-12 w-56 flex-shrink-0 border-r border-border bg-card overflow-y-auto">
      <div className="flex border-b border-border">
        {(["Content", "Design", "Settings"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 px-3 py-3 text-xs font-medium transition-colors ${
              activeTab === tab
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="p-4 space-y-5">
        {activeTab === "Content" && (
          <>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Page Settings</p>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-muted-foreground">Page Title</label>
                  <Input value={pageTitle} onChange={(e) => onPageTitleChange(e.target.value)} className="mt-1 h-8 text-xs" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Meta Description</label>
                  <Textarea value={metaDesc} onChange={(e) => onMetaDescChange(e.target.value)} className="mt-1 text-xs min-h-[60px]" rows={2} />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Favicon</label>
                  <div className="mt-1 rounded-lg border border-dashed border-border p-3 text-center text-xs text-muted-foreground cursor-pointer hover:bg-muted/50 transition-colors">
                    Upload Favicon
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Sections</p>
                <div className="relative">
                  <button
                    onClick={() => setAddMenuOpen(!addMenuOpen)}
                    className="text-primary hover:text-primary/80 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                  {addMenuOpen && (
                    <div className="absolute right-0 top-6 z-50 w-40 rounded-lg border border-border bg-card shadow-lg py-1">
                      {sectionTypes.map((st) => (
                        <button
                          key={st.type}
                          onClick={() => { onAddSection(st.type); setAddMenuOpen(false); }}
                          className="flex w-full items-center gap-2 px-3 py-2 text-xs text-foreground hover:bg-muted transition-colors"
                        >
                          {sectionIcon(st.type)}
                          {st.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-1">
                {sections.map((s, idx) => (
                  <div
                    key={s.id}
                    draggable
                    onDragStart={() => handleDragStart(idx)}
                    onDragOver={(e) => handleDragOver(e, idx)}
                    onDragEnd={handleDragEnd}
                    onClick={() => onSelectSection(s.id)}
                    className={`flex w-full items-center gap-2 rounded-lg px-2 py-2 text-xs cursor-pointer transition-all ${
                      selectedSection === s.id
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:bg-muted"
                    } ${draggedIdx === idx ? "opacity-50" : ""}`}
                  >
                    <GripVertical className="h-3 w-3 text-muted-foreground/50 cursor-grab flex-shrink-0" />
                    {sectionIcon(s.type)}
                    <span className="truncate">{s.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === "Design" && (
          <div className="space-y-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Theme</p>
              <div className="grid grid-cols-4 gap-2">
                {["#7c3aed", "#3b82f6", "#10b981", "#f59e0b"].map((c) => (
                  <button key={c} className="h-8 rounded-lg border-2 border-transparent hover:border-foreground/20 transition-colors" style={{ background: c }} />
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Font</p>
              <select className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs">
                <option>Inter</option>
                <option>Poppins</option>
                <option>Roboto</option>
              </select>
            </div>
          </div>
        )}

        {activeTab === "Settings" && (
          <div className="space-y-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">SEO</p>
              <div className="space-y-2">
                <div>
                  <label className="text-xs text-muted-foreground">OG Title</label>
                  <Input className="mt-1 h-8 text-xs" placeholder="Open Graph title" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">OG Description</label>
                  <Textarea className="mt-1 text-xs min-h-[60px]" placeholder="Open Graph description" rows={2} />
                </div>
              </div>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Analytics</p>
              <div>
                <label className="text-xs text-muted-foreground">Tracking Code</label>
                <Textarea className="mt-1 text-xs min-h-[60px]" placeholder="Paste your tracking code here" rows={2} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditorLeftSidebar;
