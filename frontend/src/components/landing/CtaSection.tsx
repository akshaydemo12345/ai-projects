const CtaSection = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="relative rounded-[3rem] overflow-hidden bg-gradient-to-br from-[#7c3bed] via-[#c2cffa] to-[#1a27e4] p-12 md:p-24 text-center">
          {/* Decorative blur */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-purple-500/10 to-transparent pointer-events-none" />

          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight">
              Launch AI Landing Pages <br /> Directly on Your Website
            </h2>
            <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
              Generate, customize, and publish high-converting PPC landing pages with AI — instantly live on your own domain.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="px-10 py-5 bg-white text-black font-bold rounded-full hover:bg-white/90 transition-all uppercase tracking-wide text-sm">
                Start Building Free
              </button>
              <button className="px-10 py-5 border border-white/30 text-white font-bold rounded-full hover:bg-white/10 transition-all uppercase tracking-wide text-sm">
                Schedule Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
