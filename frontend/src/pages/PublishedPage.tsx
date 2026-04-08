import { useState } from "react";
import {
  Globe, CheckCircle, Copy, ExternalLink, Code, Monitor, ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const PublishedPage = () => {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="p-8">
      <div className="mx-auto max-w-3xl">
        {/* Success Banner */}
        <div className="text-center mb-10">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-500">
            <CheckCircle className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Your page is live!</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your landing page has been published and is ready to collect leads.
          </p>
        </div>

        {/* URL + Status Row */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-2 mb-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold text-foreground">Temporary URL</h3>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Your page is available at this temporary URL. Share it immediately or connect your custom domain.
            </p>
            <div className="flex items-center gap-2">
              <Input readOnly value="https://temp-new.pagebuilder.ai" className="text-xs h-9" />
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 flex-shrink-0"
                onClick={() => handleCopy("https://temp-new.pagebuilder.ai", "url")}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <Button className="mt-3 w-full gap-2 bg-foreground text-background hover:bg-foreground/90">
              <ExternalLink className="h-4 w-4" /> Open Page
            </Button>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold text-foreground">Page Status</h3>
            </div>
            <div className="space-y-3">
              {[
                { label: "Status", value: "Published", color: "text-green-500" },
                { label: "Total Views", value: "0" },
                { label: "Leads Collected", value: "0" },
                { label: "Published", value: "Just now" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{item.label}</span>
                  <span className={`text-xs font-medium ${item.color || "text-foreground"}`}>
                    {item.color && "● "}{item.value}
                  </span>
                </div>
              ))}
            </div>
            <a href="#" className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-foreground underline decoration-foreground/30 hover:decoration-foreground">
              View Leads Dashboard →
            </a>
          </div>
        </div>

        {/* Embed & Integrate */}
        <div className="mt-6 rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-2 mb-2">
            <Code className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold text-foreground">Embed & Integrate</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-6">
            Add your landing page to any website using one of these methods.
          </p>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                icon: <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-600 text-sm font-bold text-white">W</div>,
                title: "WordPress Plugin",
                desc: "Install our plugin to embed pages directly in WordPress.",
                cta: "Get Plugin",
              },
              {
                icon: <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">&lt;/&gt;</div>,
                title: "Script Based",
                desc: "Add a JavaScript snippet to load your page on any site.",
                cta: "Copy Script",
              },
              {
                icon: <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500 text-sm font-bold text-white"><Monitor className="h-5 w-5" /></div>,
                title: "Embed <iframe>",
                desc: "Copy an iframe code to embed your page anywhere.",
                cta: "Copy Code",
              },
            ].map((method) => (
              <div key={method.title} className="rounded-lg border border-border p-5 text-center">
                <div className="flex justify-center mb-3">{method.icon}</div>
                <h4 className="text-sm font-semibold text-foreground">{method.title}</h4>
                <p className="mt-1 text-xs text-muted-foreground">{method.desc}</p>
                <Button size="sm" className="mt-3">{method.cta}</Button>
              </div>
            ))}
          </div>
        </div>

        {/* Custom Domain */}
        <div className="mt-6 rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold text-foreground">Connect Custom Domain</h3>
          </div>
          <div className="flex gap-2">
            <Button size="sm">Setup</Button>
            <Button size="sm" variant="outline">DNS Instructions</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublishedPage;
