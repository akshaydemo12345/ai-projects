import { Link } from "react-router-dom";

const templates = [
  {
    id: "healthcare-01",
    name: "Lumina Dental",
    category: "Healthcare",
    img: "/assets/templates/healthcare/templates01/dental-screenshot-01.png",
    gradient: "linear-gradient(135deg, #bb0014 0%, #141d23 100%)",
  },
  {
    id: "healthcare-02",
    name: "Elite Healthcare",
    category: "Healthcare",
    img: "/assets/templates/healthcare/templates02/screnshort8.png",
    gradient: "linear-gradient(135deg, #0f172a 0%, #38bdf8 100%)",
  },
  {
    id: "travel-01",
    name: "Azure Luxury Escapes",
    category: "Travel",
    img: "/assets/templates/travel/templates01/heronew.png",
    gradient: "linear-gradient(135deg, #0e7490 0%, #06b6d4 100%)",
  },
  {
    id: "finance-01",
    name: "Finova Finance",
    category: "Finance",
    img: "/assets/templates/finance/templates01/screenshot.png",
    gradient: "linear-gradient(135deg, #2b5cff 0%, #1f3aa6 100%)",
  }
];

const TemplatesSection = () => {
  return (
    <section id="templates" className="relative py-32 bg-gradient-to-b from-slate-50 via-white to-white">
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>

      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 left-1/4 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-32 right-1/4 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-block mb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-purple-600 bg-purple-50 px-3 py-1.5 rounded-full border border-purple-200">
              Templates library
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
            High-Converting Templates
          </h2>
          <p className="text-lg text-slate-600">
            Choose from our library of professionally designed templates optimized for speed, performance, and maximum conversion rates.
          </p>
        </div>

        {/* Templates Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 mb-20">
          {templates.map((tpl, idx) => (
            <div
              key={tpl.id}
              className="relative group rounded-[1.5rem] overflow-hidden bg-white border-none shadow-[0_15px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)] hover:-translate-y-1.5 transition-all duration-700 text-left"
              style={{
                animation: `slideUp 0.6s ease-out ${idx * 0.1}s both`
              }}
            >
              {/* Image / Gradient placeholder */}
              <div className="w-full aspect-[4/5] relative overflow-hidden p-5">
                <div
                  className="w-full h-full rounded-[1rem] overflow-hidden relative shadow-inner border border-black/[0.03]"
                  style={{ background: tpl.gradient }}
                >
                  {tpl.img && (
                    <div className="absolute inset-0 w-full h-full overflow-y-hidden group-hover:overflow-y-auto custom-scrollbar transition-all duration-500">
                      <img
                        src={tpl.img}
                        alt={tpl.name}
                        className="w-full h-auto"
                      />
                    </div>
                  )}

                  <div className="absolute top-4 left-4 bg-[#0f172a]/90 backdrop-blur-xl text-white text-[9px] font-black px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-2xl z-20 border border-white/10">
                    <span className="text-violet-400">{String(idx + 1).padStart(2, '0')}</span>
                    <span className="w-px h-2.5 bg-gray-700/50" />
                    <span className="uppercase tracking-widest">{tpl.category}</span>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="bg-white px-8 pb-8 pt-1 flex items-center justify-between">
                <h3 className="text-lg font-black text-[#0f172a] tracking-tight truncate group-hover:text-violet-600 transition-colors duration-300">
                  {tpl.name}
                </h3>

              </div>
            </div>
          ))}
        </div>

        {/* View More Button */}
        <div className="flex justify-center">
          <Link to="/templates">
            <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-9 rounded-md px-3">
              Explore All Templates
            </button>
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
};

export default TemplatesSection;
