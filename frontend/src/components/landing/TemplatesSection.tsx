import { Eye, ExternalLink } from "lucide-react";

const templates = [
  {
    name: "SaaS Modern",
    category: "Software",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    color: "from-blue-500 to-indigo-600"
  },
  {
    name: "Digital Agency",
    category: "Service",
    image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80",
    color: "from-violet-500 to-purple-600"
  },
  {
    name: "E-commerce Pro",
    category: "Shop",
    image: "https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=800&q=80",
    color: "from-emerald-500 to-teal-600"
  },
  {
    name: "Portfolio Dark",
    category: "Personal",
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80",
    color: "from-slate-700 to-slate-900"
  }
];

const TemplatesSection = () => {
  return (
    <section id="templates" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-foreground md:text-4xl mb-4">High-Converting Templates</h2>
          <p className="text-muted-foreground">Choose from our library of professionally designed templates optimized for speed and conversion.</p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {templates.map((template, i) => (
            <div key={i} className="group relative overflow-hidden rounded-2xl border border-border bg-card transition-all hover:shadow-2xl">
              <div className="aspect-[4/3] overflow-hidden relative">
                <img 
                  src={template.image} 
                  alt={template.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                   <button className="h-10 w-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 transition-transform">
                      <Eye className="h-5 w-5" />
                   </button>
                   <button className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center hover:scale-110 transition-transform">
                      <ExternalLink className="h-5 w-5" />
                   </button>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary px-2 py-0.5 bg-primary/10 rounded-full">
                    {template.category}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-foreground">{template.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TemplatesSection;
