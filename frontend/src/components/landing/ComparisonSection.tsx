const ComparisonSection = () => {
  const comparison = [
    { old: "External hosting", new: "Publish directly on your domain" },
    { old: "Separate platforms", new: "Works with your existing website" },
    { old: "Complex integrations", new: "One-click publishing" },
    { old: "Generic templates", new: "AI-generated custom pages" },
    { old: "Requires developers", new: "No-code visual editing" },
    { old: "Slow deployment", new: "Launch in minutes" }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 max-w-4xl">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-black mb-20">
          Why Marketers Choose Buildify
        </h2>

        <div className="bg-[#f2f2f2] rounded-[2.5rem] overflow-hidden p-1">
          <div className="bg-white rounded-[2.4rem] overflow-hidden">
            <div className="grid grid-cols-2 border-b border-black/5 bg-[#fcfcfc]">
              <div className="p-8 font-bold text-black/40 text-lg">Traditional Builders</div>
              <div className="p-8 font-bold text-black text-lg flex items-center gap-3">
                <div className="h-6 w-6 bg-black text-white rounded flex items-center justify-center text-[10px] font-black">B</div>
                Buildify
              </div>
            </div>

            <div className="divide-y divide-black/5">
              {comparison.map((item, i) => (
                <div key={i} className="grid grid-cols-2">
                  <div className="p-8 text-black/40 font-medium">{item.old}</div>
                  <div className="p-8 text-black font-bold">{item.new}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComparisonSection;
