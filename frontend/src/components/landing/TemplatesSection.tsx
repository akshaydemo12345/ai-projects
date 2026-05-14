import { Sparkles } from "lucide-react";

const TemplatesSection = () => {
  return (
    <section id="templates" className="relative py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="mb-4 text-4xl font-semibold">
            Conversion Focused Templates Ready to Launch
          </h2>
          <p className="mx-auto max-w-2xl text-black/60">
            Start with pre-built templates designed for specific industries and use cases.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {["SaaS", "Local Business", "Real Estate", "Coaching", "Agencies", "Ecommerce", "Webinar Funnels", "Product Launches"].map(
            (template, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-black/5 bg-white p-6 text-center transition hover:shadow-md"
              >
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-purple-50 mx-auto">
                  <Sparkles className="h-8 w-8 text-[#7c3bed]" />
                </div>
                <h3 className="font-semibold text-black">{template}</h3>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
};

export default TemplatesSection;
