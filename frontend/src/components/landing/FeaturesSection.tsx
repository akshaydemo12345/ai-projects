import { Sparkles, Layout, Globe, Users, BarChart3, Shield } from "lucide-react";

const features = [
  { icon: Sparkles, title: "AI Page Generation", desc: "Describe your vision and let AI craft a beautiful, conversion-optimized landing page in under 60 seconds." },
  { icon: Layout, title: "Visual Editor", desc: "Drag-and-drop editor with real-time preview. Customize every element without writing a single line of code." },
  { icon: Globe, title: "Custom Domains", desc: "Connect your own domain with free SSL certificates. Professional URLs that build trust with your audience." },
  { icon: Users, title: "Lead Capture & CRM", desc: "Built-in forms that capture leads directly into your dashboard. Export to CSV or connect via webhooks." },
  { icon: BarChart3, title: "Analytics Dashboard", desc: "Track page views, conversions, and lead sources in real-time. Make data-driven decisions to optimize." },
  { icon: Shield, title: "Enterprise Security", desc: "99.9% uptime with enterprise-grade security. Your pages and data are protected around the clock." },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Features</p>
          <h2 className="mt-3 text-3xl font-bold text-foreground md:text-4xl">Everything you need to launch & grow</h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            From AI generation to analytics — one platform replaces your entire landing page stack.
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
