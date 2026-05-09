import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Can I publish directly on my own website?",
    answer: "Yes. Buildify’s core feature is direct publishing to your existing website and domain."
  },
  {
    question: "Does Buildify support WordPress?",
    answer: "Yes. You can connect WordPress websites and publish instantly."
  },
  {
    question: "Do I need coding skills?",
    answer: "No. Buildify includes a full visual editor with no coding required."
  },
  {
    question: "Is it optimized for PPC campaigns?",
    answer: "Yes. Every generated page is designed for conversion-focused advertising campaigns."
  },
  {
    question: "Can I customize the generated pages?",
    answer: "Absolutely. Every page is fully editable visually."
  },
  {
    question: "Does Buildify host the pages?",
    answer: "No. Your pages are published directly on your own website infrastructure."
  }
];

const FAQSection = () => {
  return (
    <section id="faq" className="py-24 bg-background">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">Frequently Asked Questions</h2>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-left font-semibold">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;
