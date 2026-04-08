import { Star } from "lucide-react";

const testimonials = [
  { quote: "PageCraft cut our landing page creation from weeks to minutes. The AI-generated pages convert better than our hand-coded ones.", name: "Sarah Chen", role: "Founder, TechFlow", initials: "SC" },
  { quote: "We built and launched 12 landing pages in a single day. The conversion rates speak for themselves — 4.8% average.", name: "Marcus Rodriguez", role: "Marketing Director, ScaleUp", initials: "MR" },
  { quote: "The AI captures features in a single click. We saved over $15,000 in design and development costs this quarter alone.", name: "Priya Patel", role: "CEO, LaunchKit", initials: "PP" },
  { quote: "As a marketer, this is my secret weapon. I can test new positioning in hours instead of weeks. Game changer.", name: "James Wilson", role: "Growth Lead, Metric AI", initials: "JW" },
  { quote: "I tested marketers, test messaging, and A/B iterations without engineering. This tool pays for itself 10x over.", name: "Emily Nakamura", role: "Co-founder, BrightPath", initials: "EN" },
  { quote: "The integration is so clean with Webflow-like quality. Best landing page builder we have ever used, period.", name: "David Okonkwo", role: "VP Marketing, CloudBase", initials: "DO" },
];

const TestimonialsSection = () => {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">Loved by 2,000+ builders</h2>
          <p className="mt-4 text-muted-foreground">See what our users are saying about PageCraft AI</p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <div key={t.name} className="rounded-xl border border-border bg-card p-6">
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-warning text-warning" />
                ))}
              </div>
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed">"{t.quote}"</p>
              <div className="mt-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
