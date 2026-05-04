import { Search, Eye } from "lucide-react";
import { useState } from "react";

const LANDING_TEMPLATES = [
  {
    id: "healthcare-01",
    name: "Lumina Dental",
    tag: "Healthcare",
    img: "/assets/templates/healthcare/templates01/dental-screenshot-01.png",
    gradient: "linear-gradient(135deg, #bb0014 0%, #141d23 100%)",
  },
  {
    id: "travel-01",
    name: "Azure Luxury Escapes",
    tag: "Travel",
    img: "/assets/templates/travel/templates01/heronew.png",
    gradient: "linear-gradient(135deg, #0e7490 0%, #06b6d4 100%)",
  }
];

const TEMPLATE_CATEGORIES = ["All", "Healthcare", "Travel"];

const TemplatesPage = () => {
  const [templateCategory, setTemplateCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = LANDING_TEMPLATES.filter(t => 
    (templateCategory === "All" || t.tag === templateCategory) && 
    (t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] p-8 md:p-16">
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

      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Search and Category Filter */}
        <div className="space-y-8 max-w-3xl mx-auto text-center">
          <div className="relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300 group-focus-within:text-violet-500 transition-all duration-300" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border-none rounded-[2rem] py-6 pl-16 pr-8 text-lg font-medium outline-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] focus:ring-8 focus:ring-violet-500/5 transition-all placeholder:text-gray-300 text-gray-800"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {TEMPLATE_CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setTemplateCategory(cat)}
                className={`px-8 py-3 rounded-2xl text-[11px] font-black uppercase tracking-[0.15em] transition-all duration-300 border ${templateCategory === cat
                  ? "bg-[#7c3aed] border-[#7c3aed] text-white shadow-2xl shadow-violet-200 -translate-y-1"
                  : "bg-white border-gray-100 text-gray-400 hover:border-violet-200 hover:text-violet-600 shadow-sm"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid Area */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((tpl, idx) => (
            <div
              key={tpl.id}
              className="relative group rounded-[2.5rem] overflow-hidden bg-white border-none shadow-[0_15px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)] hover:-translate-y-1.5 transition-all duration-700 text-left"
            >
              {/* Image / Gradient placeholder */}
              <div
                className="w-full aspect-[4/3] relative overflow-hidden p-4"
              >
                 <div 
                    className="w-full h-full rounded-[1.8rem] overflow-hidden relative shadow-inner border border-black/[0.03]"
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
                      <span className="uppercase tracking-widest">{tpl.tag}</span>
                    </div>
                 </div>
              </div>

              {/* Footer Actions */}
              <div className="bg-white px-8 pb-6 pt-1 flex items-center justify-between">
                <h3 className="text-lg font-black text-[#0f172a] tracking-tight truncate pr-3 group-hover:text-violet-600 transition-colors duration-300">{tpl.name}</h3>
                <button 
                  onClick={() => window.open(tpl.img, '_blank')}
                  className="h-11 w-11 rounded-[1.1rem] bg-[#2563eb] flex items-center justify-center text-white hover:bg-blue-700 hover:scale-110 hover:-rotate-3 transition-all duration-500 shadow-xl shadow-blue-100 flex-shrink-0"
                  title="View Preview"
                >
                  <Eye className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-32">
            <p className="text-muted-foreground font-semibold text-xl opacity-40">No templates found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplatesPage;
