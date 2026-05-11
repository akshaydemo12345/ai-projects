import { Settings, AlignLeft, AlignCenter, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PageSection } from "@/services/api";

interface EditorCanvasProps {
  sections: PageSection[];
  selectedSection: string | null;
  onSelectSection: (id: string) => void;
}

const selectedRing = "ring-2 ring-primary ring-offset-2 ring-offset-muted";

const EditorCanvas = ({ sections, selectedSection, onSelectSection }: EditorCanvasProps) => {
  const isSelected = (id: string) => selectedSection === id;

  const wrapperClass = (id: string, extra = "") =>
    `cursor-pointer rounded-xl overflow-hidden transition-all ${isSelected(id) ? selectedRing : "border border-border"} ${extra}`;

  const renderSection = (section: PageSection) => {
    switch (section.type) {
      // ──────────────────────────────────────────
      // HERO
      // ──────────────────────────────────────────
      case "hero":
        return (
          <div
            key={section.id}
            onClick={() => onSelectSection(section.id)}
            className={`${wrapperClass(section.id)} border-0`}
          >
            <div className="gradient-hero p-12 text-center">
              <h1 className="text-3xl font-bold text-white">
                {(section.content?.heading as string) || "Launch Your Product with Confidence"}
              </h1>
              <p className="mt-3 text-sm text-white/70 max-w-lg mx-auto">
                {(section.content?.subheading as string) || "Build, test, and deploy your product faster"}
              </p>
              <Button className="mt-6 bg-white text-foreground hover:bg-white/90" size="sm">
                {(section.content?.cta as string) || "Get Started Free"}
              </Button>
            </div>
          </div>
        );

      // ──────────────────────────────────────────
      // IMAGE BLOCK
      // ──────────────────────────────────────────
      case "image":
        return (
          <div
            key={section.id}
            onClick={() => onSelectSection(section.id)}
            className={`${wrapperClass(section.id)} bg-card`}
          >
            {section.content?.src ? (
              <div className="overflow-hidden">
                <img
                  src={section.content.src as string}
                  alt={(section.content.alt as string) || "Section image"}
                  className={`w-full object-cover max-h-72 ${section.content.rounded ? "rounded-xl" : ""}`}
                />
                {section.content.caption && (
                  <p className="px-4 py-2 text-xs text-muted-foreground text-center italic">
                    {section.content.caption as string}
                  </p>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-40 gap-2 text-muted-foreground">
                <ImageIcon className="h-8 w-8 opacity-30" />
                <p className="text-xs">Click to configure image</p>
              </div>
            )}
          </div>
        );

      // ──────────────────────────────────────────
      // TEXT BLOCK
      // ──────────────────────────────────────────
      case "text": {
        const align = (section.content?.align as string) || "left";
        const alignClass = align === "center" ? "text-center" : align === "right" ? "text-right" : "text-left";
        return (
          <div
            key={section.id}
            onClick={() => onSelectSection(section.id)}
            className={`${wrapperClass(section.id)} bg-card p-8`}
          >
            <div className={alignClass}>
              {section.content?.heading && (
                <h2 className="text-xl font-bold text-foreground mb-3">
                  {section.content.heading as string}
                </h2>
              )}
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {(section.content?.body as string) || "Your content goes here…"}
              </p>
            </div>
          </div>
        );
      }

      // ──────────────────────────────────────────
      // CONTENT GRID
      // ──────────────────────────────────────────
      case "grid": {
        const cols = (section.content?.columns as number) || 3;
        const items = (section.content?.items as Array<{ icon?: string; title: string; description: string }>) || [];
        const gridClass = cols === 2 ? "grid-cols-2" : cols === 4 ? "grid-cols-4" : "grid-cols-3";
        return (
          <div
            key={section.id}
            onClick={() => onSelectSection(section.id)}
            className={`${wrapperClass(section.id)} bg-card p-8`}
          >
            <div className={`grid ${gridClass} gap-4`}>
              {items.map((item, i) => (
                <div key={i} className="rounded-lg border border-border p-4 space-y-2">
                  {item.icon && <span className="text-2xl">{item.icon}</span>}
                  <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
              ))}
              {items.length === 0 && (
                <div className="col-span-full flex items-center justify-center h-24 text-xs text-muted-foreground">
                  No grid items yet — edit via right panel
                </div>
              )}
            </div>
          </div>
        );
      }

      // ──────────────────────────────────────────
      // FEATURES
      // ──────────────────────────────────────────
      case "features":
        return (
          <div
            key={section.id}
            onClick={() => onSelectSection(section.id)}
            className={`${wrapperClass(section.id)} bg-card p-8`}
          >
            <h2 className="text-xl font-bold text-foreground mb-6">Amazing Features</h2>
            <div className="grid grid-cols-3 gap-4">
              {((section.content?.features as Array<{ title: string; description: string }>) || []).map((f, i) => (
                <div key={i} className="rounded-lg border border-border p-4">
                  <Settings className="h-5 w-5 text-muted-foreground mb-2" />
                  <h3 className="text-sm font-semibold text-foreground">{f.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        );

      // ──────────────────────────────────────────
      // TESTIMONIALS
      // ──────────────────────────────────────────
      case "testimonials":
        return (
          <div
            key={section.id}
            onClick={() => onSelectSection(section.id)}
            className={`${wrapperClass(section.id)} bg-card p-8`}
          >
            <h2 className="text-xl font-bold text-foreground mb-4">What People Say</h2>
            <div className="grid grid-cols-2 gap-4">
              {((section.content?.testimonials as Array<{ name?: string; role?: string; text?: string }>) || []).length > 0
                ? (section.content.testimonials as Array<{ name?: string; role?: string; text?: string }>).map((t, i) => (
                    <div key={i} className="rounded-lg border border-border p-4">
                      <p className="text-xs text-muted-foreground italic">"{t.text}"</p>
                      <p className="mt-2 text-xs font-medium text-foreground">
                        — {t.name}{t.role ? `, ${t.role}` : ""}
                      </p>
                    </div>
                  ))
                : [1, 2].map((i) => (
                    <div key={i} className="rounded-lg border border-border p-4">
                      <p className="text-xs text-muted-foreground italic">"This product changed everything for our team."</p>
                      <p className="mt-2 text-xs font-medium text-foreground">— Customer {i}</p>
                    </div>
                  ))}
            </div>
          </div>
        );

      // ──────────────────────────────────────────
      // PRICING
      // ──────────────────────────────────────────
      case "pricing":
        return (
          <div
            key={section.id}
            onClick={() => onSelectSection(section.id)}
            className={`${wrapperClass(section.id)} bg-card p-8`}
          >
            <h2 className="text-xl font-bold text-foreground mb-4 text-center">Pricing</h2>
            <div className="grid grid-cols-3 gap-4">
              {(section.content?.plans as Array<{ name: string; price: string; features?: string[] }> || [
                { name: "Starter", price: "$0" },
                { name: "Pro", price: "$29" },
                { name: "Enterprise", price: "Custom" },
              ]).map((plan) => (
                <div key={plan.name} className="rounded-lg border border-border p-4 text-center">
                  <h3 className="text-sm font-semibold text-foreground">{plan.name}</h3>
                  <p className="text-2xl font-bold text-primary mt-2">{plan.price}</p>
                  {plan.features && (
                    <ul className="mt-3 space-y-1">
                      {plan.features.map((f, i) => (
                        <li key={i} className="text-xs text-muted-foreground">✓ {f}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      // ──────────────────────────────────────────
      // CONTACT
      // ──────────────────────────────────────────
      case "contact":
        return (
          <div
            key={section.id}
            onClick={() => onSelectSection(section.id)}
            className={`${wrapperClass(section.id)} bg-card p-8`}
          >
            <h2 className="text-xl font-bold text-foreground mb-4">Contact Us</h2>
            <div className="max-w-sm space-y-3">
              <div className="h-8 rounded border border-border bg-muted" />
              <div className="h-8 rounded border border-border bg-muted" />
              <div className="h-20 rounded border border-border bg-muted" />
              <Button size="sm">Send Message</Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="mt-12 flex-1 overflow-y-auto bg-muted p-8">
      <div className="mx-auto max-w-3xl space-y-6">
        {sections.map(renderSection)}
        {sections.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 rounded-xl border-2 border-dashed border-border gap-3">
            <p className="text-sm text-muted-foreground">Add sections from the left panel</p>
            <p className="text-xs text-muted-foreground/60">or use AI ✨ to generate them</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditorCanvas;
