import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Starter",
    price: "$0",
    period: "/month",
    description: "Perfect for getting started",
    features: ["1 Landing Page", "500 Visits/month", "Basic Analytics", "Email Support"],
    current: true,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    description: "For growing businesses",
    features: ["10 Landing Pages", "50K Visits/month", "Advanced Analytics", "Custom Domain", "Priority Support", "A/B Testing"],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$99",
    period: "/month",
    description: "For large teams",
    features: ["Unlimited Pages", "Unlimited Visits", "Full Analytics Suite", "Multiple Domains", "Dedicated Support", "API Access", "White Label"],
  },
];

const PlansPage = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-foreground mb-1">Plans</h1>
      <p className="text-sm text-muted-foreground mb-8">Choose the plan that fits your needs.</p>

      <div className="grid gap-6 md:grid-cols-3 max-w-4xl">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-xl border bg-card p-6 relative ${
              plan.popular ? "border-primary shadow-lg shadow-primary/10" : "border-border"
            }`}
          >
            {plan.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px] font-medium px-3 py-1 rounded-full">
                Most Popular
              </span>
            )}
            <h3 className="text-lg font-semibold text-foreground">{plan.name}</h3>
            <p className="text-xs text-muted-foreground mt-1">{plan.description}</p>
            <div className="mt-4">
              <span className="text-3xl font-bold text-foreground">{plan.price}</span>
              <span className="text-sm text-muted-foreground">{plan.period}</span>
            </div>
            <ul className="mt-6 space-y-2">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Check className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Button
              className="w-full mt-6"
              variant={plan.current ? "outline" : "default"}
              size="sm"
            >
              {plan.current ? "Current Plan" : "Upgrade"}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlansPage;
