const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-24 bg-[#eeeeee]">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-black mb-20">
          Launch PPC Landing Pages in 3 Steps
        </h2>

        <div className="relative max-w-5xl mx-auto">
          {/* Connecting Line */}
          <div className="absolute top-10 left-[10%] right-[10%] h-px bg-black/10 hidden md:block" />

          <div className="grid gap-12 md:grid-cols-3 relative z-10">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center group">
              <div className="h-20 w-20 rounded-full bg-[#7c3bed] text-white text-2xl font-bold flex items-center justify-center mb-8 shadow-xl transition-transform group-hover:scale-110">
                1
              </div>
              <h3 className="text-xl font-bold text-black mb-4">Connect Your Website</h3>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center group">
              <div className="h-20 w-20 rounded-full bg-[#7c3bed] text-white text-2xl font-bold flex items-center justify-center mb-8 shadow-xl transition-transform group-hover:scale-110">
                2
              </div>
              <h3 className="text-xl font-bold text-black mb-4">Generate With AI</h3>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center group">
              <div className="h-20 w-20 rounded-full bg-[#7c3bed] text-white text-2xl font-bold flex items-center justify-center mb-8 shadow-xl transition-transform group-hover:scale-110">
                3
              </div>
              <h3 className="text-xl font-bold text-black mb-4">Edit & Publish</h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
