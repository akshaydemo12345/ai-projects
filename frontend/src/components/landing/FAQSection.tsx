import { useState } from "react";

const FAQSection = () => {
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);

  const faqs = [
    {
      q: "Can I publish directly on my own website?",
      a: "Yes. Buildify’s core feature is direct publishing to your existing website and domain."
    },
    {
      q: "Does Buildify support WordPress?",
      a: "Yes. You can connect WordPress websites and publish instantly."
    },
    {
      q: "Do I need coding skills?",
      a: "No. Buildify includes a full visual editor with no coding required."
    },
    {
      q: "Is it optimized for PPC campaigns?",
      a: "Yes. Every generated page is designed for conversion-focused advertising campaigns."
    }
  ];

  return (
    <section id="faq" className="py-24 bg-white">
      <div className="container mx-auto px-4 max-w-2xl">
        <h2 className="text-4xl font-bold text-center text-black mb-16">Frequently Asked Questions</h2>

        <div className="space-y-0">
          {faqs.map((faq, i) => (
            <div key={i} className="border-b border-black/5 last:border-0">
              <button
                onClick={() => setActiveFAQ(activeFAQ === i ? null : i)}
                className="w-full py-6 flex items-center justify-between text-left group"
              >
                <span className="text-lg font-semibold text-black/80 group-hover:text-black transition-colors">{faq.q}</span>
                <span className={`text-2xl font-light text-black/40 transition-transform duration-300 ${activeFAQ === i ? "rotate-45" : ""}`}>+</span>
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${activeFAQ === i ? "max-h-40 pb-6" : "max-h-0"}`}>
                <p className="text-black/60 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
