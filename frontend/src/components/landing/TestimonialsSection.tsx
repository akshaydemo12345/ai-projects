import { Star } from "lucide-react";

const testimonials = [
  {
    text: "Buildify helped us launch PPC pages directly on client websites without involving developers.",
    author: "Growth Marketer",
    role: "Agency Owner"
  },
  {
    text: "The AI-generated layouts are surprisingly conversion-focused and save our team hours.",
    author: "PPC Specialist",
    role: "Digital Agency"
  },
  {
    text: "We replaced multiple landing page tools because Buildify lets us publish directly on our domains.",
    author: "Business Owner",
    role: "E-commerce Brand"
  }
];

const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">Trusted by Agencies & Growth Teams</h2>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-background p-8 rounded-2xl border border-border shadow-sm">
              <div className="flex gap-1 mb-4 text-amber-500">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
              </div>
              <p className="text-lg italic text-foreground mb-6">“{t.text}”</p>
              <div>
                <p className="font-bold text-foreground">{t.author}</p>
                <p className="text-sm text-muted-foreground">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
