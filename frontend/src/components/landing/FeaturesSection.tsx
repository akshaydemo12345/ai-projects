import { Sparkles, Layout, Globe, Users, BarChart3, Shield, AlertCircle, CheckCircle2 } from "lucide-react";

const features = [
  { icon: Sparkles, title: "AI Page Generation", desc: "Describe your campaign or paste your website URL and Buildify generates a complete landing page automatically." },
  { icon: Globe, title: "Direct Website Publishing", desc: "Publish landing pages instantly to your own domain and website — not a third-party hosted URL." },
  { icon: Layout, title: "Visual Editor", desc: "Edit every section visually with an intuitive drag-and-drop interface." },
  { icon: Shield, title: "WordPress & CMS Integration", desc: "Push pages directly into WordPress and other CMS platforms with seamless syncing." },
  { icon: BarChart3, title: "Brand Consistency", desc: "Automatically match your existing website colors, typography, and branding." },
  { icon: Users, title: "Fast Campaign Launches", desc: "Go from ad idea to live landing page in minutes." },
];

const problemPoints = [
  "Traditional landing page tools host your pages externally",
  "Require separate domains or subdomains",
  "Create disconnected user experiences",
  "Need developers for website integration",
  "Slow down campaign launches"
];

const FeaturesSection = () => {
  return (
    <section id="features" className="relative py-32 bg-gradient-to-b from-white via-white to-slate-50">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 right-1/4 w-80 h-80 bg-purple-500/8 rounded-full blur-3xl"></div>
        <div className="absolute bottom-32 -left-40 w-80 h-80 bg-purple-500/8 rounded-full blur-3xl"></div>
      </div>

      <div className="relative container mx-auto px-4">
        {/* The Problem vs Solution Section */}
        <div className="mb-32 grid gap-12 lg:grid-cols-2 items-stretch">
          {/* Problem Column */}
          <div className="relative">
            <div className="flex items-center gap-2 mb-6">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-xs font-bold uppercase tracking-widest text-red-600">The Problem</span>
            </div>
            <h2 className="text-3xl font-bold text-slate-900 md:text-4xl leading-tight mb-8">
              Most Landing Page Builders Force You to Use Their Platform
            </h2>
            <div className="space-y-4">
              {problemPoints.map((item, i) => (
                <div key={i} className="flex items-start gap-3 group">
                  <div className="h-2 w-2 rounded-full bg-red-400 flex-shrink-0 mt-2 group-hover:scale-150 transition-transform" />
                  <span className="text-slate-700 leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Solution Column */}
          <div className="relative">
            <div className="h-full rounded-3xl bg-gradient-to-br from-purple-600 to-purple-700 p-8 md:p-10 text-white shadow-2xl overflow-hidden">
              {/* Decorative background */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-2xl"></div>

              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-6">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-widest text-purple-100">The Solution</span>
                </div>
                <h3 className="text-3xl font-bold mb-6 leading-tight">Buildify Changes That</h3>
                <p className="text-purple-50 leading-relaxed text-lg mb-8">
                  Generate pages with AI and instantly publish them directly on your own website and domain while keeping full control of your brand, analytics, and SEO.
                </p>

                {/* Key benefits */}
                <div className="space-y-3 pt-6 border-t border-white/20">
                  {[
                    "Pages live on YOUR domain",
                    "Full ownership & control",
                    "Better SEO performance",
                    "Seamless brand experience"
                  ].map((benefit, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-purple-200"></div>
                      <span className="text-sm text-purple-100">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Capabilities Header */}
        <div className="text-center mb-20">
          <div className="inline-block mb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-purple-600 bg-purple-50 px-3 py-1.5 rounded-full border border-purple-200">
              Capabilities
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
            Landing Pages That Actually Live on Your Website
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-slate-600">
            Unlike traditional landing page platforms, Buildify publishes pages directly into your existing website infrastructure.
          </p>
        </div>

        {/* Features Grid - Premium staggered layout */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <div
              key={f.title}
              className={`group relative rounded-2xl border border-slate-200 bg-white p-6 hover:shadow-2xl hover:border-purple-300 transition-all duration-300 ${i % 3 === 1 ? 'md:mt-6' : i % 3 === 2 ? 'md:mt-12' : ''
                }`}
              style={{
                animation: `slideUp 0.6s ease-out ${i * 0.1}s both`
              }}
            >
              {/* Hover overlay */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-50/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <div className="relative z-10">
                {/* Icon */}
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-100 to-purple-50 text-purple-600 group-hover:shadow-lg group-hover:from-purple-200 transition-all">
                  <f.icon className="h-6 w-6" />
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-purple-600 transition-colors">{f.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed group-hover:text-slate-700 transition-colors">{f.desc}</p>
              </div>

              {/* Bottom accent bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-400/0 via-purple-500 to-purple-400/0 opacity-0 group-hover:opacity-100 rounded-b-2xl transition-opacity duration-300"></div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
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

export default FeaturesSection;