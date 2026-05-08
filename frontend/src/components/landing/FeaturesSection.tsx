import { Sparkles, Layout, Globe, Users, BarChart3, Shield } from "lucide-react";

const features = [
  { icon: Sparkles, title: "AI Page Generation", desc: "Describe your campaign or paste your website URL and Buildify generates a complete landing page automatically." },
  { icon: Globe, title: "Direct Website Publishing", desc: "Publish landing pages instantly to your own domain and website — not a third-party hosted URL." },
  { icon: Layout, title: "Visual Editor", desc: "Edit every section visually with an intuitive drag-and-drop interface." },
  { icon: Shield, title: "WordPress & CMS Integration", desc: "Push pages directly into WordPress and other CMS platforms with seamless syncing." },
  { icon: BarChart3, title: "Brand Consistency", desc: "Automatically match your existing website colors, typography, and branding." },
  { icon: Users, title: "Fast Campaign Launches", desc: "Go from ad idea to live landing page in minutes." },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* The Problem Section */}
        <div className="mb-24 grid gap-12 lg:grid-cols-2 items-center">
          <div>
            <h2 className="text-3xl font-bold text-foreground md:text-4xl leading-tight">
              Most Landing Page Builders Force You to Use Their Platform
            </h2>
            <div className="mt-8 space-y-4">
              {[
                "Traditional landing page tools host your pages externally",
                "Require separate domains or subdomains",
                "Create disconnected user experiences",
                "Need developers for website integration",
                "Slow down campaign launches"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-muted-foreground">
                  <div className="h-1.5 w-1.5 rounded-full bg-destructive flex-shrink-0" />
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-8 md:p-12">
            <h3 className="text-2xl font-bold text-foreground">Buildify Changes That</h3>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Generate pages with AI and instantly publish them directly on your own website and domain while keeping full control of your brand, analytics, and SEO.
            </p>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Capabilities</p>
          <h2 className="mt-3 text-3xl font-bold text-foreground md:text-4xl">Landing Pages That Actually Live on Your Website</h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Unlike traditional landing page platforms, Buildify publishes pages directly into your existing website infrastructure.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="group rounded-xl border border-border bg-card p-6 transition-all hover:shadow-lg hover:border-primary/30">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-accent">
                <f.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
