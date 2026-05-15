import { PencilLine, Palette, PlusSquare, Sparkles, Zap } from "lucide-react";

const AIFeaturesSection = () => {
  const features = [
    {
      icon: <PencilLine className="h-6 w-6 text-[#7c3bed]" />,
      title: "AI Copywriting",
      desc: "Generate headlines, CTAs, benefit sections, and conversion-focused messaging automatically."
    },
    {
      icon: <Palette className="h-6 w-6 text-[#7c3bed]" />,
      title: "AI Design Generation",
      desc: "Create modern layouts optimized specifically for performance marketing campaigns."
    },
    {
      icon: <PlusSquare className="h-6 w-6 text-[#7c3bed]" />,
      title: "AI Section Builder",
      desc: "Instantly add testimonials, pricing blocks, forms, trust badges, and FAQs with a prompt."
    },
    {
      icon: <Sparkles className="h-6 w-6 text-[#7c3bed]" />,
      title: "Smart Brand Detection",
      desc: "Buildify automatically adapts your page design to match your existing website style."
    },
    {
      icon: <Zap className="h-6 w-6 text-[#7c3bed]" />,
      title: "Optimization Suggestions",
      desc: "Receive real-time recommendations to improve conversion rates and user engagement."
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
          <h2 className="text-4xl md:text-5xl font-bold text-black max-w-md leading-tight">
            AI That Builds More Than Just Layouts
          </h2>
          <p className="text-black/60 text-lg max-w-sm">
            Our AI engine handles the complex heavy lifting of conversion optimization so you can focus on strategy.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {features.slice(0, 3).map((f, i) => (
            <div key={i} className="bg-white rounded-2xl p-8 border border-black/5 shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-6">{f.icon}</div>
              <h3 className="text-xl font-bold text-black mb-4">{f.title}</h3>
              <p className="text-black/60 text-sm leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2 mt-6 max-w-4xl mx-auto">
          {features.slice(3).map((f, i) => (
            <div key={i} className="bg-white rounded-2xl p-8 border border-black/5 shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-6">{f.icon}</div>
              <h3 className="text-xl font-bold text-black mb-4">{f.title}</h3>
              <p className="text-black/60 text-sm leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AIFeaturesSection;
