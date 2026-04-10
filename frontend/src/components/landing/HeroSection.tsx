import { ArrowRight, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden gradient-hero py-24 md:py-32">
      <div className="container mx-auto px-4 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-2 text-sm text-primary-foreground">
          <span>🚀</span>
          <span>AI-Powered Page Builder</span>
        </div>

        <h1 className="mx-auto max-w-4xl text-4xl font-bold leading-tight text-primary-foreground md:text-6xl">
          Build landing pages{" "}
          <span className="text-primary-foreground/70">that actually convert</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-primary-foreground/70">
          Just describe your product or paste a URL. AI crafts a beautiful, high-converting landing page with copy, design, and lead capture in under 60 seconds.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link to="/login">
            <Button size="lg" variant="outline" className="border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20 gap-2 px-8">
              Get Started Free <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Button size="lg" variant="outline" className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 gap-2 px-8">
            <Eye className="h-4 w-4" /> Watch Demo
          </Button>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 gap-8 md:grid-cols-4">
          {[
            { value: "12K+", label: "Active Users" },
            { value: "2.4M", label: "Pages Created" },
            { value: "99.9%", label: "Uptime" },
            { value: "4.2%", label: "Avg Conversion" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-3xl font-bold text-primary-foreground">{stat.value}</div>
              <div className="mt-1 text-sm text-primary-foreground/60">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Dashboard Preview */}
        <div className="mx-auto mt-16 max-w-4xl overflow-hidden rounded-xl border border-border/20 bg-muted shadow-2xl">
          <div className="flex items-center gap-2 bg-card p-3">
            <div className="h-3 w-3 rounded-full bg-destructive" />
            <div className="h-3 w-3 rounded-full bg-warning" />
            <div className="h-3 w-3 rounded-full bg-success" />
            <div className="mx-auto rounded-md bg-muted px-4 py-1 text-xs text-muted-foreground">
              app.pagecraft.ai/dashboard
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4 p-6">
            <div className="col-span-1 space-y-3 text-left">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded bg-primary" />
                <span className="text-xs font-semibold text-foreground">PageCraft</span>
              </div>
              <p className="text-xs text-muted-foreground">All Sites</p>
              <p className="text-xs text-muted-foreground">Create Page</p>
              <p className="text-xs text-muted-foreground">Leads</p>
            </div>
            <div className="col-span-1 rounded-lg bg-primary/20 p-4" />
            <div className="col-span-2 grid grid-cols-3 gap-3">
              {["Total Sites", "Total Leads", "Conversion"].map((label) => (
                <div key={label} className="rounded-lg border border-border bg-card p-3">
                  <p className="text-[10px] text-muted-foreground">{label}</p>
                  <p className="text-sm font-bold text-foreground">
                    {label === "Total Sites" ? "3" : label === "Total Leads" ? "1,847" : "4.2%"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
