import { Check, X } from "lucide-react";

const ComparisonSection = () => {
  const rows = [
    { label: "Hosting Location", trad: "External hosting", buildify: "Publish directly on your domain" },
    { label: "Website Integration", trad: "Separate platforms", buildify: "Works with your existing website" },
    { label: "Deployment Speed", trad: "Slow deployment", buildify: "Launch in minutes" },
    { label: "Design Process", trad: "Generic templates", buildify: "AI-generated custom pages" },
    { label: "Technical Skills", trad: "Requires developers", buildify: "No-code visual editing" },
    { label: "Sync Process", trad: "Complex integrations", buildify: "One-click publishing" },
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">Why Marketers Choose Buildify</h2>
          <p className="mt-4 text-muted-foreground">The only landing page builder that truly lives on your own website.</p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="p-6 text-sm font-bold text-foreground">Features</th>
                <th className="p-6 text-sm font-bold text-muted-foreground">Traditional Builders</th>
                <th className="p-6 text-sm font-bold text-primary">Buildify</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="p-6 text-sm font-medium text-foreground">{row.label}</td>
                  <td className="p-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <X className="h-4 w-4 text-destructive" /> {row.trad}
                    </div>
                  </td>
                  <td className="p-6 text-sm text-foreground font-semibold">
                    <div className="flex items-center gap-2 text-primary">
                      <Check className="h-4 w-4 text-primary" /> {row.buildify}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default ComparisonSection;
