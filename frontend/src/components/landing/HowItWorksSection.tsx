import { Sparkles, Layout, Rocket, Globe } from "lucide-react";

const steps = [
  {
    icon: <Globe className="h-6 w-6" />,
    title: "Connect Your Website",
    description: "Connect your WordPress website or custom domain securely with Buildify.",
    color: "bg-blue-500"
  },
  {
    icon: <Sparkles className="h-6 w-6" />,
    title: "Generate With AI",
    description: "Enter your campaign goal, offer, audience, or website URL and Buildify creates your landing page instantly.",
    color: "bg-violet-500"
  },
  {
    icon: <Layout className="h-6 w-6" />,
    title: "Edit & Publish",
    description: "Customize visually and publish directly to your website with one click.",
    color: "bg-emerald-500"
  }
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-24 bg-muted/30 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-foreground md:text-4xl mb-4">Launch PPC Landing Pages in 3 Steps</h2>
          <p className="text-muted-foreground">Go from an idea to a live, high-converting landing page directly on your domain.</p>
        </div>

        <div className="grid gap-12 md:grid-cols-3 relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-blue-500/20 via-violet-500/20 to-emerald-500/20 -z-0" />
          
          {steps.map((step, i) => (
            <div key={i} className="flex flex-col items-center text-center group relative z-10">
              <div className={`h-20 w-20 rounded-[2rem] ${step.color} text-white flex items-center justify-center mb-8 shadow-xl transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 relative`}>
                <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-background text-foreground text-xs font-black flex items-center justify-center border-2 border-border shadow-md">
                  0{i + 1}
                </div>
                {step.icon}
              </div>
              <h3 className="text-xl font-bold text-foreground mb-4">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed px-4">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
