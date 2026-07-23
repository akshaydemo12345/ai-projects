import { Target, Layout, RefreshCw } from "lucide-react";

const LeadManagementSection = () => {
  return (
    <section id="lead-management" className="py-24 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid gap-16 lg:grid-cols-2 items-center">
          {/* Left: Content */}
          <div>
            <div className="text-[#7c3bed] text-xs font-black uppercase tracking-[0.2em] mb-6">
              OPTIMIZATION
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-black mb-8 leading-tight">
              Capture, Track & <br /> Manage Every Lead
            </h2>
            <p className="text-black/60 text-lg mb-12 leading-relaxed">
              Buildify doesn't just create landing pages — It helps you manage and understand every lead generated from your campaigns.
            </p>

            <div className="space-y-8">
              {[
                {
                  icon: <Target className="h-5 w-5 text-[#7c3bed]" />,
                  title: "UTM Source Tracking",
                  desc: "Automatically capture UTM parameters including source, medium, campaign, term, and content."
                },
                {
                  icon: <Layout className="h-5 w-5 text-[#7c3bed]" />,
                  title: "Centralized Dashboard",
                  desc: "View all form submissions and campaign leads from a single, beautiful dashboard."
                },
                {
                  icon: <RefreshCw className="h-5 w-5 text-[#7c3bed]" />,
                  title: "CRM Ready",
                  desc: "Export leads easily or sync them with your existing CRM and marketing workflows automatically."
                }
              ].map((item, i) => (
                <div key={i} className="flex gap-6">
                  <div className="flex-shrink-0 h-12 w-12 rounded-2xl bg-white border border-black/5 shadow-sm flex items-center justify-center">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-black mb-2">{item.title}</h3>
                    <p className="text-black/60 text-sm leading-relaxed max-w-sm">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Mock Dashboard */}
          <div className="relative">
            <div className="bg-[#fdf8f6] rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-black/5">
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-black/5 mb-8">
                <div className="flex items-center justify-between mb-8">
                  <span className="text-sm font-bold text-black">Lead Dashboard</span>
                  <div className="flex gap-1">
                    <div className="h-2 w-2 rounded-full bg-orange-400" />
                    <div className="h-2 w-2 rounded-full bg-pink-400" />
                    <div className="h-2 w-2 rounded-full bg-purple-400" />
                  </div>
                </div>
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((_, i) => (
                    <div key={i} className="h-10 w-full bg-[#fcfcfc] rounded-lg border border-black/[0.02]" />
                  ))}
                </div>
              </div>

              <div className="bg-black rounded-2xl p-8 flex flex-col items-start">
                <span className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-2">TOTAL LEADS</span>
                <span className="text-4xl font-bold text-white">2,481</span>
              </div>
            </div>

            {/* Decorative blurs */}
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-pink-100/50 rounded-full blur-[100px] pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default LeadManagementSection;