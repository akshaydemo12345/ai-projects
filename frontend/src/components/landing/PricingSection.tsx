const PricingSection = () => {
  return (
    <section id="pricing" className="py-24 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-black mb-20">
          Simple Pricing for Growing Teams
        </h2>

        <div className="grid gap-8 md:grid-cols-3 items-center">
          {/* Starter */}
          <div className="bg-white rounded-[2rem] border border-black/5 p-10 shadow-sm flex flex-col h-full">
            <h3 className="text-xl font-bold text-black mb-2">Starter</h3>
            <p className="text-black/60 text-sm mb-8">Perfect for freelancers launching their first campaigns.</p>
            <div className="mb-8">
              <span className="text-5xl font-bold text-black">$49</span>
              <span className="text-black/60">/mo</span>
            </div>
            <ul className="space-y-4 mb-10 flex-grow">
              {[
                "5 Landing Pages",
                "AI Generation",
                "Basic Analytics"
              ].map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-black/80 text-sm">
                  <div className="h-5 w-5 rounded-full border border-purple-200 flex items-center justify-center">
                    <span className="text-purple-600 text-[10px]">✓</span>
                  </div>
                  {f}
                </li>
              ))}
            </ul>
            <button className="w-full py-4 rounded-full border border-black font-bold text-black hover:bg-black/5 transition-colors">
              Start Free Trial
            </button>
          </div>

          {/* Pro */}
          <div className="bg-black rounded-[2.5rem] p-10 shadow-2xl flex flex-col h-full relative transform md:scale-110 z-10">
            <div className="absolute top-6 right-6 bg-[#ff3b6b] text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
              MOST POPULAR
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Pro</h3>
            <p className="text-white/60 text-sm mb-8">For performance teams that need unlimited scale.</p>
            <div className="mb-8">
              <span className="text-5xl font-bold text-white">$99</span>
              <span className="text-white/60">/mo</span>
            </div>
            <ul className="space-y-4 mb-10 flex-grow">
              {[
                "Unlimited Pages",
                "Advanced AI Modes",
                "Custom CRM Sync",
                "A/B Testing"
              ].map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-white/80 text-sm">
                  <div className="h-5 w-5 rounded-full border border-white/20 flex items-center justify-center">
                    <span className="text-white text-[10px]">✓</span>
                  </div>
                  {f}
                </li>
              ))}
            </ul>
            <button className="w-full py-4 rounded-full bg-white font-bold text-black hover:bg-white/90 transition-colors">
              Start Free Trial
            </button>
          </div>

          {/* Agency */}
          <div className="bg-white rounded-[2rem] border border-black/5 p-10 shadow-sm flex flex-col h-full">
            <h3 className="text-xl font-bold text-black mb-2">Agency</h3>
            <p className="text-black/60 text-sm mb-8">For agencies managing multiple client websites.</p>
            <div className="mb-8">
              <span className="text-5xl font-bold text-black">$249</span>
              <span className="text-black/60">/mo</span>
            </div>
            <ul className="space-y-4 mb-10 flex-grow">
              {[
                "Multi-client Workspaces",
                "White-label Features",
                "Priority Support"
              ].map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-black/80 text-sm">
                  <div className="h-5 w-5 rounded-full border border-purple-200 flex items-center justify-center">
                    <span className="text-purple-600 text-[10px]">✓</span>
                  </div>
                  {f}
                </li>
              ))}
            </ul>
            <button className="w-full py-4 rounded-full border border-black font-bold text-black hover:bg-black/5 transition-colors">
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
