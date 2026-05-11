import { useState } from "react";
import { Sparkles, X, Loader2, Wand2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { PageSection } from "@/services/api";

interface AIPromptModalProps {
  open: boolean;
  onClose: () => void;
  onApply: (type: PageSection["type"], content: Record<string, unknown>) => void;
}

const SECTION_SUGGESTIONS = [
  "Create a hero section for a SaaS product with a bold headline",
  "Generate a features grid with 3 benefits for an e-commerce store",
  "Write testimonials from 2 happy customers",
  "Add a pricing section with Free, Pro, and Enterprise plans",
  "Create a contact form section for a consulting firm",
  "Add a text block explaining our company mission",
  "Insert an image banner with a caption",
  "Build a 3-column grid layout with icons",
];

const AI_PROVIDERS = [
  { id: "claude", label: "Claude (Anthropic)" },
  { id: "openai", label: "GPT-4 (OpenAI)" },
  { id: "simulate", label: "AI Simulate (Demo)" },
];

// Demo-mode AI: generates believable content without a real API key
const simulateAIResponse = (prompt: string): { type: PageSection["type"]; content: Record<string, unknown> } => {
  const lower = prompt.toLowerCase();

  if (lower.includes("hero") || lower.includes("headline") || lower.includes("banner")) {
    const words = prompt.split(" ");
    const topic = words.slice(2, 5).join(" ") || "Your Product";
    return {
      type: "hero",
      content: {
        heading: `Transform Your ${topic} Experience`,
        subheading: `Powerful tools designed for modern teams. Start building faster, smarter, and better today.`,
        cta: "Get Started Free",
      },
    };
  }
  if (lower.includes("feature") || lower.includes("benefit") || lower.includes("grid")) {
    return {
      type: "features",
      content: {
        features: [
          { title: "Lightning Fast", description: "Deploy in seconds with our optimized infrastructure built for speed." },
          { title: "Fully Secure", description: "Enterprise-grade security with end-to-end encryption by default." },
          { title: "Easy to Scale", description: "Grows with your business from 10 to 10 million users effortlessly." },
        ],
      },
    };
  }
  if (lower.includes("testimonial") || lower.includes("review") || lower.includes("customer")) {
    return {
      type: "testimonials",
      content: {
        testimonials: [
          { name: "Sarah Johnson", role: "CEO, TechCorp", text: "This platform saved us 20 hours a week. An absolute game-changer." },
          { name: "Marcus Lee", role: "Product Manager", text: "The best tool we've adopted in 3 years. Our team loves it." },
        ],
      },
    };
  }
  if (lower.includes("pricing") || lower.includes("plan") || lower.includes("price")) {
    return {
      type: "pricing",
      content: {
        plans: [
          { name: "Free", price: "$0", features: ["5 pages", "Basic analytics", "Community support"] },
          { name: "Pro", price: "$29", features: ["Unlimited pages", "Advanced analytics", "Priority support"] },
          { name: "Enterprise", price: "Custom", features: ["White label", "SSO", "Dedicated support"] },
        ],
      },
    };
  }
  if (lower.includes("text") || lower.includes("paragraph") || lower.includes("mission") || lower.includes("about")) {
    return {
      type: "text",
      content: {
        heading: "About Our Mission",
        body: "We believe every business deserves a powerful online presence — without the complexity. Our platform was built by designers, engineers, and marketers who understand the struggle of building landing pages that actually convert. We are on a mission to democratize high-quality web design for everyone.",
        align: "left",
      },
    };
  }
  if (lower.includes("image") || lower.includes("photo") || lower.includes("banner")) {
    return {
      type: "image",
      content: {
        src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=900&q=80",
        alt: "Team collaborating on design",
        caption: "Our team working on the next big feature",
        rounded: true,
      },
    };
  }
  if (lower.includes("contact") || lower.includes("form") || lower.includes("reach")) {
    return {
      type: "contact",
      content: { email: "hello@company.com", phone: "+1 800 123 4567" },
    };
  }
  // Default — smart text block
  return {
    type: "text",
    content: {
      heading: "AI Generated Content",
      body: prompt,
      align: "left",
    },
  };
};

const AIPromptModal = ({ open, onClose, onApply }: AIPromptModalProps) => {
  const [prompt, setPrompt] = useState("");
  const [provider, setProvider] = useState("simulate");
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [showProviderDrop, setShowProviderDrop] = useState(false);

  if (!open) return null;

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      // Real API call (Claude)
      if (provider === "claude" && apiKey) {
        const res = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "x-api-key": apiKey,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
          },
          body: JSON.stringify({
            model: "claude-3-haiku-20240307",
            max_tokens: 1024,
            messages: [
              {
                role: "user",
                content: `You are a landing page builder AI. Based on this request: "${prompt}", respond ONLY with a valid JSON object in this shape (no extra text):
{
  "type": "hero" | "features" | "testimonials" | "pricing" | "contact" | "text" | "image" | "grid",
  "content": { ...fields depending on type }
}`,
              },
            ],
          }),
        });
        const data = await res.json();
        const raw = data.content?.[0]?.text || "{}";
        const parsed = JSON.parse(raw.match(/\{[\s\S]+\}/)?.[0] || "{}");
        if (parsed.type && parsed.content) {
          onApply(parsed.type, parsed.content);
          setPrompt("");
          onClose();
          return;
        }
      }

      // Real API call (OpenAI)
      if (provider === "openai" && apiKey) {
        const res = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content: `You are a landing page builder AI. Respond ONLY with a valid JSON object: {"type": "...", "content": {...}}. Type must be one of: hero, features, testimonials, pricing, contact, text, image, grid.`,
              },
              { role: "user", content: prompt },
            ],
          }),
        });
        const data = await res.json();
        const raw = data.choices?.[0]?.message?.content || "{}";
        const parsed = JSON.parse(raw.match(/\{[\s\S]+\}/)?.[0] || "{}");
        if (parsed.type && parsed.content) {
          onApply(parsed.type, parsed.content);
          setPrompt("");
          onClose();
          return;
        }
      }

      // Simulate / fallback
      await new Promise((r) => setTimeout(r, 900));
      const result = simulateAIResponse(prompt);
      onApply(result.type, result.content);
      setPrompt("");
      onClose();
    } catch (err) {
      console.error("AI error", err);
      // Fallback to simulate on error
      await new Promise((r) => setTimeout(r, 400));
      const result = simulateAIResponse(prompt);
      onApply(result.type, result.content);
      setPrompt("");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const selectedProvider = AI_PROVIDERS.find((p) => p.id === provider)!;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-2xl border border-border bg-[hsl(240,20%,10%)] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">AI Page Builder</h2>
              <p className="text-[10px] text-white/40">Describe what you want to create</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-white/40 hover:text-white hover:bg-white/10 transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Provider selector */}
          <div className="relative">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-white/40 mb-1.5">AI Provider</p>
            <button
              onClick={() => setShowProviderDrop(!showProviderDrop)}
              className="flex w-full items-center justify-between rounded-lg border border-border bg-white/5 px-3 py-2.5 text-xs text-white hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Wand2 className="h-3.5 w-3.5 text-violet-400" />
                {selectedProvider.label}
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-white/40" />
            </button>
            {showProviderDrop && (
              <div className="absolute top-full left-0 right-0 mt-1 z-10 rounded-lg border border-border bg-[hsl(240,20%,12%)] shadow-xl py-1">
                {AI_PROVIDERS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => { setProvider(p.id); setShowProviderDrop(false); }}
                    className={`flex w-full items-center gap-2 px-3 py-2.5 text-xs transition-colors ${provider === p.id ? "text-violet-400 bg-violet-500/10" : "text-white/70 hover:bg-white/5 hover:text-white"
                      }`}
                  >
                    {p.label}
                    {p.id === "simulate" && (
                      <span className="ml-auto rounded-full bg-emerald-500/20 text-emerald-400 text-[9px] px-1.5 py-0.5 font-medium">FREE</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* API Key (if real provider) */}
          {(provider === "claude" || provider === "openai") && (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-white/40 mb-1.5">API Key</p>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={provider === "claude" ? "sk-ant-..." : "sk-..."}
                className="w-full rounded-lg border border-border bg-white/5 px-3 py-2.5 text-xs text-white placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
              />
              <p className="mt-1 text-[10px] text-white/30">Your key stays local and is never stored on our servers.</p>
            </div>
          )}

          {/* Prompt textarea */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-white/40 mb-1.5">Your Prompt</p>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Create a hero section for a fitness app with an energetic headline and a free trial button"
              rows={4}
              className="resize-none bg-white/5 border-border text-xs text-white placeholder:text-white/25 focus-visible:ring-violet-500/50"
              onKeyDown={(e) => { if (e.key === "Enter" && e.metaKey) handleGenerate(); }}
            />
          </div>

          {/* Suggestions */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-white/40 mb-2">Quick Suggestions</p>
            <div className="flex flex-wrap gap-1.5">
              {SECTION_SUGGESTIONS.slice(0, 4).map((s) => (
                <button
                  key={s}
                  onClick={() => setPrompt(s)}
                  className="rounded-full border border-border bg-white/5 px-2.5 py-1 text-[10px] text-white/60 hover:text-white hover:bg-white/10 hover:border-violet-500/40 transition-all truncate max-w-[200px]"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-border">
          <p className="text-[10px] text-white/30">⌘ + Enter to generate</p>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={onClose} className="text-white/50 hover:text-white hover:bg-white/10 text-xs">
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleGenerate}
              disabled={!prompt.trim() || loading}
              className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs px-5 gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
              {loading ? "Generating…" : "Generate"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIPromptModal;
