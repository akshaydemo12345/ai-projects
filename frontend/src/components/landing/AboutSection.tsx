const team = [
  { name: "Arjun Mehta", role: "CEO & Co-founder", initials: "AM" },
  { name: "Sarah Walker", role: "CTO", initials: "SW" },
  { name: "Maria Santos", role: "Head of Design", initials: "MS" },
  { name: "Neel Gupta", role: "Head of Growth", initials: "NG" },
];

const AboutSection = () => {
  return (
    <section id="about" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <div>
            <h2 className="text-3xl font-bold text-foreground md:text-4xl leading-tight">
              Built by makers,<br />for makers
            </h2>
            <p className="mt-6 text-muted-foreground leading-relaxed">
              We spent years building landing pages by hand — weeks of design, development, and copy iterations. PageCraft AI condenses that into a 60-second, AI-powered creative process. It's the tool we wished we had from day one.
            </p>
            <div className="mt-8 flex gap-8">
              {[
                { value: "12K+", label: "Active Users" },
                { value: "2.4M", label: "Pages Built" },
                { value: "99.9%", label: "Uptime" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="text-2xl font-bold text-foreground">{s.value}</div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {team.map((t, i) => (
              <div key={t.name} className="overflow-hidden rounded-xl border border-border bg-card">
                <div className={`flex h-32 items-center justify-center text-2xl font-bold text-primary-foreground ${i === 0 ? "gradient-hero" : "bg-muted"}`}>
                  {i === 0 ? t.initials : ""}
                </div>
                <div className="p-4">
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
