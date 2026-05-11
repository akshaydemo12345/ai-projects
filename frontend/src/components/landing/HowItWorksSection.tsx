import { Sparkles, Layout, Rocket } from "lucide-react";

const steps = [
  {
    icon: <Sparkles className="h-6 w-6" />,
    title: "AI Generation",
    description: "Simply describe your business or paste a URL. Our AI will analyze the best converting patterns and generate a high-end design in 60 seconds.",
    color: "bg-violet-500"
  },
  {
    icon: <Layout className="h-6 w-6" />,
    title: "Customize & Refine",
    description: "Use our intuitive editor to tweak colors, images, and copy. Our drag-and-drop builder gives you full control without needing to write a single line of code.",
    color: "bg-indigo-500"
  },
  {
    icon: <Rocket className="h-6 w-6" />,
    title: "Launch Everywhere",
    description: "Publish your page instantly to our cloud, sync it to your WordPress site with our plugin, or embed it into any existing website using our script.",
    color: "bg-emerald-500"
  }
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-24 bg-muted/30 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-foreground md:text-4xl mb-4">How it Works</h2>
          <p className="text-muted-foreground">Go from an idea to a live, high-converting landing page in three simple steps.</p>
        </div>

        <div className="grid gap-12 md:grid-cols-3 relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-violet-500/20 via-indigo-500/20 to-emerald-500/20 -z-0" />
          
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
