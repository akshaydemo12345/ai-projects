import { Search, Facebook, MousePointer2, Zap, Timer, Smartphone } from "lucide-react";

const PerformanceMarketingSection = () => {
  const features = [
    {
      icon: <Search className="h-6 w-6" />,
      title: "Google Ads Pages",
      desc: "Create campaign-specific pages optimized for Quality Score and conversions."
    },
    {
      icon: <Facebook className="h-6 w-6" />,
      title: "Meta Ads Pages",
      desc: "Launch mobile-optimized landing pages for Facebook and Instagram campaigns."
    },
    {
      icon: <MousePointer2 className="h-6 w-6" />,
      title: "Lead Gen Funnels",
      desc: "Generate forms, lead capture sections, and conversion flows instantly."
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "A/B Testing Ready",
      desc: "Test headlines, layouts, and CTAs to improve campaign performance."
    },
    {
      icon: <Timer className="h-6 w-6" />,
      title: "Lightning Fast",
      desc: "Optimized pages for extreme speed and lower bounce rates."
    },
    {
      icon: <Smartphone className="h-6 w-6" />,
      title: "Mobile-First",
      desc: "Every page is fully responsive and optimized for mobile users first."
    }
  ];

  return (
    <section className="py-24 bg-[#eeeeee]">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-black">
            Designed Specifically for PPC Campaigns
          </h2>
        </div>

        <div className="grid gap-12 md:grid-cols-3">
          {features.map((f, i) => (
            <div key={i} className="flex gap-4">
              <div className="flex-shrink-0 text-[#7c3bed] mt-1">
                {f.icon}
              </div>
              <div>
                <h3 className="font-bold text-black text-lg mb-2">{f.title}</h3>
                <p className="text-black/60 text-sm leading-relaxed">
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PerformanceMarketingSection;
