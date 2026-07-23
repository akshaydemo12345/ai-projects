import { Sparkles, Globe, Layout, Smartphone, Palette, Zap } from "lucide-react";

const FeaturesSection = () => {
  return (
    <section id="features" className="bg-white pt-24 pb-24">
      <div className="container mx-auto px-4">
        {/* ===== PROBLEM VS SOLUTION SECTION ===== */}
        <div className="mb-32 grid gap-12 lg:grid-cols-2 items-center max-w-6xl mx-auto">
          {/* Left: Problem Card */}
          <div className="bg-[#f2f2f2] rounded-[2.5rem] p-12 md:p-16">
            <h2 className="text-4xl md:text-5xl font-bold text-black leading-[1.1] mb-12">
              Most Landing Page Builders Force You to Use Their Platform
            </h2>
            <div className="space-y-6">
              {[
                "Host your pages externally",
                "Require separate domains or subdomains",
                "Create disconnected user experiences",
                "Need developers for website integration"
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full border-2 border-red-500 flex items-center justify-center">
                    <span className="text-red-500 text-xs font-bold">✕</span>
                  </div>
                  <span className="text-black/70 text-lg">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Solution Content */}
          <div className="lg:pl-12">
            <div className="h-12 w-12 rounded-xl bg-[#7c3bed] flex items-center justify-center mb-8 shadow-lg shadow-purple-500/20">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-5xl font-bold text-black mb-6">Buildify Changes That</h3>
            <p className="text-xl italic text-black/60 mb-8">Full control. Zero friction.</p>
            <p className="text-lg text-black/60 leading-relaxed max-w-lg">
              Generate pages with AI and instantly publish them directly on your own website and domain while keeping full control of your brand, analytics, and SEO.
            </p>
          </div>
        </div>

        {/* ===== FEATURES GRID SECTION ===== */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
            Landing Pages That Actually <br /> Live on Your Website
          </h2>
          <p className="mx-auto max-w-2xl text-black/60 text-lg">
            Unlike traditional landing page platforms, Buildify publishes pages directly into your existing website infrastructure.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {[
            {
              icon: Sparkles,
              title: "AI Page Generation",
              desc: "Describe your campaign or paste your website URL and Buildify generates a complete landing page automatically."
            },
            {
              icon: Globe,
              title: "Direct Website Publishing",
              desc: "Publish landing pages instantly to your own domain and website — not a third-party hosted URL."
            },
            {
              icon: Layout,
              title: "Visual Editor",
              desc: "Edit every section visually with an intuitive drag-and-drop interface. No coding required."
            },
            {
              icon: Layout, // Placeholder for CMS icon
              title: "WordPress & CMS Sync",
              desc: "Push pages directly into WordPress and other CMS platforms with seamless syncing and updates."
            },
            {
              icon: Palette,
              title: "Brand Consistency",
              desc: "Automatically match your existing website colors, typography, and branding elements perfectly."
            },
            {
              icon: Zap,
              title: "Fast Launches",
              desc: "Go from ad idea to live landing page in minutes. Keep up with the speed of performance marketing."
            }
          ].map((f, i) => (
            <div key={i} className="bg-white rounded-[2rem] p-10 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
              <div className={`mb-8 h-12 w-12 rounded-xl bg-[#7c3bed]/10 flex items-center justify-center text-[#7c3bed]`}>
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-black mb-4">{f.title}</h3>
              <p className="text-black/60 leading-relaxed text-sm">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
