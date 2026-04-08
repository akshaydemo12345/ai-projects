import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const plans = [
  {
    name: "Starter",
    desc: "Perfect for getting started",
    price: "$0",
    period: "Free forever",
    cta: "Get Started Free",
    ctaVariant: "outline" as const,
    popular: false,
    features: ["1 landing page", "PageCraft subdomain", "Basic analytics", "100 leads/month", "Community support"],
  },
  {
    name: "Pro",
    desc: "Most popular for growing teams",
    price: "$29",
    period: "/month",
    cta: "Start Free Trial",
    ctaVariant: "default" as const,
    popular: true,
    features: ["Unlimited pages", "Custom domain + SSL", "Advanced analytics", "Unlimited leads", "Priority support", "A/B testing", "Remove branding"],
  },
  {
    name: "Business",
    desc: "For agencies and enterprises",
    price: "$70",
    period: "/month",
    cta: "Contact Sales",
    ctaVariant: "outline" as const,
    popular: false,
    features: ["Everything in Pro", "Team collaboration", "API access", "White-label", "Dedicated account manager", "Custom integrations", "SLA guarantee"],
  },
];

const PricingSection = () => {
  const [yearly, setYearly] = useState(false);

  return (
    <section id="pricing" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Pricing</p>
          <h2 className="mt-3 text-3xl font-bold text-foreground md:text-4xl">Simple, transparent pricing</h2>
          <p className="mt-4 text-muted-foreground">Choose the plan that's right for you. All plans include a 14-day free trial.</p>
        </div>

        <div className="mt-8 flex items-center justify-center gap-3">
          <button onClick={() => setYearly(false)} className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${!yearly ? "bg-foreground text-background" : "text-muted-foreground"}`}>
            Monthly
          </button>
          <button onClick={() => setYearly(true)} className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-colors ${yearly ? "bg-foreground text-background" : "text-muted-foreground"}`}>
            Yearly <span className="rounded-full bg-success px-2 py-0.5 text-xs text-success-foreground">Save 20%</span>
          </button>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <div key={plan.name} className={`relative rounded-xl border p-8 ${plan.popular ? "border-primary shadow-lg ring-2 ring-primary" : "border-border"}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground">
                  Most Popular
                </div>
              )}
              <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{plan.desc}</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-foreground">
                  {yearly && plan.price !== "$0" ? `$${Math.round(parseInt(plan.price.slice(1)) * 0.8)}` : plan.price}
                </span>
                <span className="text-sm text-muted-foreground">{plan.period}</span>
              </div>
              <Button variant={plan.ctaVariant} className="mt-6 w-full">{plan.cta}</Button>
              <ul className="mt-6 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-primary" /> {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
