import { Target, BarChart3, Users, Zap, Search, Shield } from "lucide-react";

const features = [
  {
    icon: <Target className="h-6 w-6" />,
    title: "UTM Source Tracking",
    desc: "Automatically capture UTM parameters from your PPC campaigns including source, medium, campaign, term, and content."
  },
  {
    icon: <BarChart3 className="h-6 w-6" />,
    title: "Centralized Lead Dashboard",
    desc: "View all form submissions and campaign leads from a single, intuitive dashboard."
  },
  {
    icon: <Zap className="h-6 w-6" />,
    title: "Campaign Attribution",
    desc: "Identify which ads, keywords, and campaigns generate the highest-quality leads."
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Smart Lead Profiles",
    desc: "Store lead details, contact information, landing page source, and campaign activity automatically."
  },
  {
    icon: <Search className="h-6 w-6" />,
    title: "Real-Time Notifications",
    desc: "Get instant notifications whenever a new lead is generated."
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Export & CRM Ready",
    desc: "Export leads easily or sync them with your existing CRM and marketing workflows."
  }
];

const LeadManagementSection = () => {
  return (
    <section id="lead-management" className="relative py-32 bg-gradient-to-b from-white via-white to-slate-50">
      {/* Decorative purple background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/8 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 -left-40 w-80 h-80 bg-purple-500/8 rounded-full blur-3xl"></div>
      </div>

      <div className="relative container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <div className="inline-block mb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-purple-600 bg-purple-50 px-3 py-1.5 rounded-full border border-purple-200">
              Lead Management
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
            Capture, Track & Manage Every Lead
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            Buildify doesn't just create landing pages — it helps you manage and understand every lead generated from your campaigns.
          </p>
        </div>

        {/* Features Grid - Premium staggered layout */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-16">
          {features.map((f, i) => (
            <div
              key={i}
              className={`group relative p-6 rounded-2xl border border-slate-200 bg-white hover:shadow-2xl hover:border-purple-300 transition-all duration-300 ${i % 3 === 1 ? 'md:mt-6' : i % 3 === 2 ? 'md:mt-12' : ''
                }`}
              style={{
                animation: `slideUp 0.6s ease-out ${i * 0.1}s both`
              }}
            >
              {/* Hover gradient overlay */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-50/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              {/* Content */}
              <div className="relative z-10">
                {/* Icon */}
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center text-purple-600 mb-4 group-hover:shadow-lg group-hover:from-purple-200 transition-all">
                  {f.icon}
                </div>

                {/* Title & Description */}
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-purple-600 transition-colors">{f.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed group-hover:text-slate-700 transition-colors">{f.desc}</p>
              </div>

              {/* Bottom accent */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-400/0 via-purple-500 to-purple-400/0 opacity-0 group-hover:opacity-100 rounded-b-2xl transition-opacity duration-300"></div>
            </div>
          ))}
        </div>

        {/* CTA Section - Elevated design with purple gradient */}
        <div className="relative">
          <div className="rounded-3xl bg-gradient-to-br from-purple-600 via-purple-500 to-purple-700 p-8 md:p-12 text-center overflow-hidden shadow-2xl">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48 blur-3xl"></div>

            {/* Content */}
            <div className="relative z-10">
              <h3 className="text-3xl font-bold text-white mb-3">
                Know Exactly Which Campaigns Generate Leads
              </h3>
              <p className="text-lg text-purple-50 mb-8 max-w-xl mx-auto">
                Track every conversion source and manage your PPC leads from one powerful dashboard.
              </p>
              <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-9 rounded-md px-3">
                View Lead Dashboard
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
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

export default LeadManagementSection;