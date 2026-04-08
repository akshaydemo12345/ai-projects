import { useState } from "react";
import { Settings, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PageSection } from "@/services/api";

interface EditorCanvasProps {
  sections: PageSection[];
  selectedSection: string | null;
  onSelectSection: (id: string) => void;
  previewToken: string | null;
}

const EditorCanvas = ({ sections, selectedSection, onSelectSection, previewToken }: EditorCanvasProps) => {
  const [isPreviewMode, setIsPreviewMode] = useState(true);

  const renderSection = (section: PageSection) => {
    const isSelected = selectedSection === section.id;
    const commonClasses = `cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 relative group ${
      isSelected 
        ? "ring-4 ring-primary shadow-[0_0_40px_rgba(124,58,237,0.3)] scale-[1.02] z-10" 
        : "hover:ring-2 hover:ring-primary/40 border border-border bg-card"
    }`;

    switch (section.type) {
      case "hero":
        return (
          <div key={section.id} onClick={() => onSelectSection(section.id)} className={commonClasses}>
            <div className="p-16 text-center relative border-b border-border bg-background">
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <Settings className="h-5 w-5 text-muted-foreground" />
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-foreground">
                {(section.content?.heading as string) || "Elevate Your Digital Presence"}
              </h1>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                {(section.content?.subheading as string) || "Experience the future of landing page creation with our AI-powered engine."}
              </p>
              <Button className="mt-8 shadow-xl px-8 h-12 text-lg">
                {(section.content?.cta as string) || "Start Your Journey"}
              </Button>
            </div>
            {isSelected && (
              <div className="absolute top-0 left-0 bg-primary text-white text-[10px] uppercase font-bold px-3 py-1 rounded-br-lg shadow-lg">
                Selected Section
              </div>
            )}
          </div>
        );

      case "features":
        return (
          <div key={section.id} onClick={() => onSelectSection(section.id)} className={commonClasses}>
            <div className="p-10">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-2xl font-bold text-foreground">{(section.content?.title as string) || "Key Features"}</h2>
                <Settings className="h-5 w-5 text-muted-foreground opacity-20" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {((section.content?.features as Array<{ title: string; description: string }>) || []).map((f, i) => (
                  <div key={i} className="rounded-2xl bg-white/50 dark:bg-black/20 border border-white/40 p-6 backdrop-blur-sm hover:translate-y-[-4px] transition-transform shadow-sm">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <Sparkles className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-base font-bold text-foreground mb-2">{f.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{f.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "testimonials":
        return (
          <div key={section.id} onClick={() => onSelectSection(section.id)} className={commonClasses}>
            <div className="p-10 bg-muted/30">
              <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Loved by Professionals</h2>
              <div className="grid grid-cols-2 gap-6">
                {((section.content?.testimonials as Array<{ name: string; feedback: string }>) || []).map((t, i) => (
                  <div key={i} className="rounded-2xl bg-card border border-border p-6 shadow-sm relative">
                    <span className="absolute -top-4 -left-2 text-6xl text-primary/10 font-serif">“</span>
                    <p className="text-sm text-foreground italic relative z-10 leading-relaxed mb-4">
                      {t.feedback}
                    </p>
                    <p className="text-sm font-bold text-primary">— {t.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "faq":
        return (
          <div key={section.id} onClick={() => onSelectSection(section.id)} className={commonClasses}>
            <div className="p-10">
              <h2 className="text-2xl font-bold text-foreground mb-10">FAQ</h2>
              <div className="space-y-4 max-w-2xl mx-auto text-left">
                {((section.content?.faq as Array<{ question: string; answer: string }>) || []).map((q, i) => (
                  <div key={i} className="rounded-xl border border-border bg-muted/20 p-5">
                    <h3 className="text-sm font-bold text-foreground">Q: {q.question}</h3>
                    <p className="mt-2 text-xs text-muted-foreground leading-relaxed">A: {q.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "benefits":
        return (
          <div key={section.id} onClick={() => onSelectSection(section.id)} className={commonClasses}>
            <div className="p-10 bg-primary/5">
              <h2 className="text-2xl font-bold text-foreground mb-8">Why Choose Us?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {((section.content?.benefits as string[]) || []).map((b, i) => (
                  <div key={i} className="flex items-center gap-4 bg-white/60 p-4 rounded-xl shadow-sm border border-white">
                    <div className="h-6 w-6 rounded-full bg-green-500 text-white flex items-center justify-center font-bold text-xs">✓</div>
                    <span className="text-sm font-medium text-foreground">{b}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "pricing":
        return (
          <div key={section.id} onClick={() => onSelectSection(section.id)} className={commonClasses}>
            <div className="p-10 text-center">
              <h2 className="text-2xl font-bold text-foreground mb-10">Pricing Plans</h2>
              <div className="grid grid-cols-3 gap-6">
                {(section.content?.plans as Array<any> || [
                  { plan: "Starter", price: "$29", features: ["1 Project", "Basic analytics"] },
                  { plan: "Pro", price: "$79", features: ["Unlimited Projects", "Custom domain"] }
                ]).map((p, i) => (
                  <div key={i} className={`rounded-2xl border p-8 flex flex-col items-center ${p.plan === 'Pro' ? 'bg-primary text-white border-primary shadow-xl shadow-primary/20 scale-105' : 'bg-card border-border'}`}>
                    <p className="text-xs font-bold uppercase tracking-widest mb-2">{p.plan}</p>
                    <p className="text-4xl font-extrabold mb-1">{p.price}</p>
                    <p className={`text-[10px] mb-6 ${p.plan === 'Pro' ? 'text-white/70' : 'text-muted-foreground'}`}>per month</p>
                    <ul className="space-y-2 mb-8 text-left w-full text-xs">
                      {(p.features || []).map((f: string, fi: number) => (
                        <li key={fi} className="flex items-center gap-2">
                           <CheckCircle2 className="h-3 w-3" /> {f}
                        </li>
                      ))}
                    </ul>
                    <Button variant={p.plan === 'Pro' ? 'secondary' : 'outline'} className="w-full">
                       Join {p.plan}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "contact":
        return (
          <div key={section.id} onClick={() => onSelectSection(section.id)} className={commonClasses}>
            <div className="p-10">
              <h2 className="text-2xl font-bold text-foreground mb-4 text-center">Contact Form</h2>
              <div className="max-w-md mx-auto space-y-4">
                <div className="grid grid-cols-2 gap-4">
                   <div className="h-10 rounded-lg border border-border bg-muted/30" />
                   <div className="h-10 rounded-lg border border-border bg-muted/30" />
                </div>
                <div className="h-10 rounded-lg border border-border bg-muted/30" />
                <div className="h-24 rounded-lg border border-border bg-muted/30" />
                <Button className="w-full">Send Message</Button>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div key={section.id} onClick={() => onSelectSection(section.id)} className={commonClasses}>
             <div className="p-8 text-center text-muted-foreground italic">
                {section.title} Content Rendering...
             </div>
          </div>
        );
    }
  };

  // Dynamic backend URL discovery for preview iframe
  const getBackendBaseUrl = () => {
    // 1. Try VITE_API_URL (usually http://host:port/api)
    const viteApiUrl = import.meta.env.VITE_API_URL;
    if (viteApiUrl) {
      return viteApiUrl.replace('/api', '');
    }
    // 2. Fallback to common dev addresses OR hardcoded setup from .env
    return "http://my-ai-backend.test:5000"; 
  };

  const backendUrl = getBackendBaseUrl();

  return (
    <div className="mt-12 flex-1 overflow-y-auto bg-muted p-8 relative">
      {isPreviewMode && previewToken ? (
        <div className="mx-auto max-w-5xl h-full min-h-[600px] rounded-xl overflow-hidden shadow-2xl border border-border bg-white animate-in zoom-in-95 duration-300">
           <iframe 
            src={`${backendUrl}/preview/${previewToken}/html`}
            className="w-full h-full border-none"
            title="AI Preview"
          />
        </div>
      ) : (
        <div className="mx-auto max-w-3xl space-y-6">
          {sections.map(renderSection)}
          {sections.length === 0 && (
            <div className="flex items-center justify-center h-64 rounded-xl border-2 border-dashed border-border">
              <p className="text-sm text-muted-foreground">Add sections from the left panel</p>
            </div>
          )}
        </div>
      )}

      {/* Floating Toggle Preview Button */}
      <div className="fixed bottom-6 right-1/4 translate-x-12 z-20">
        <Button 
          variant="secondary" 
          onClick={() => setIsPreviewMode(!isPreviewMode)}
          className="shadow-lg gap-2 bg-background border border-border px-6 py-2 hover:bg-muted"
        >
          {isPreviewMode ? "✏️ Edit Layout" : "🌍 Real-World Preview"}
        </Button>
      </div>
    </div>
  );
};

export default EditorCanvas;
