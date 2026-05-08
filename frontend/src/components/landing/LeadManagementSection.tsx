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
    <section id="lead-management" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Lead Management</p>
          <h2 className="mt-3 text-3xl font-bold text-foreground md:text-4xl">Capture, Track & Manage Every Lead</h2>
          <p className="mt-4 text-muted-foreground">
            Buildify doesn’t just create landing pages — it helps you manage and understand every lead generated from your campaigns.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <div key={i} className="p-6 rounded-2xl border border-border bg-card hover:shadow-lg transition-all">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                {f.icon}
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-2xl bg-muted/50 p-8 md:p-12 text-center">
          <h3 className="text-2xl font-bold text-foreground">Know Exactly Which Campaigns Generate Leads</h3>
          <p className="mt-2 text-muted-foreground">Track every conversion source and manage your PPC leads from one powerful dashboard.</p>
          <button className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
            View Lead Dashboard
          </button>
        </div>
      </div>
    </section>
  );
};

export default LeadManagementSection;
