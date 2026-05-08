import { Search, Facebook, MousePointer2, Zap, Timer, Smartphone } from "lucide-react";

const features = [
  {
    icon: <Search className="h-6 w-6" />,
    title: "Google Ads Landing Pages",
    desc: "Create campaign-specific pages optimized for Quality Score and conversions."
  },
  {
    icon: <Facebook className="h-6 w-6" />,
    title: "Meta Ads Landing Pages",
    desc: "Launch mobile-optimized landing pages for Facebook and Instagram campaigns."
  },
  {
    icon: <MousePointer2 className="h-6 w-6" />,
    title: "Lead Generation Funnels",
    desc: "Generate forms, lead capture sections, and conversion flows instantly."
  },
  {
    icon: <Zap className="h-6 w-6" />,
    title: "A/B Testing Ready",
    desc: "Test headlines, layouts, and CTAs to improve campaign performance."
  },
  {
    icon: <Timer className="h-6 w-6" />,
    title: "Lightning Fast Loading",
    desc: "Optimized pages for speed and lower bounce rates."
  },
  {
    icon: <Smartphone className="h-6 w-6" />,
    title: "Mobile-First Design",
    desc: "Every page is fully responsive and optimized for mobile users."
  }
];

const PerformanceMarketingSection = () => {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Performance</p>
          <h2 className="mt-3 text-3xl font-bold text-foreground md:text-4xl">Designed Specifically for PPC Campaigns</h2>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <div key={i} className="flex gap-4 p-6 rounded-xl border border-border bg-background hover:border-primary/30 transition-colors">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                {f.icon}
              </div>
              <div>
                <h3 className="font-bold text-foreground mb-1">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PerformanceMarketingSection;
