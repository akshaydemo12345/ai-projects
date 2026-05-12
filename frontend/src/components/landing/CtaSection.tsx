import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CtaSection = () => {
  return (
    <section className="px-4 py-12">
      <div className="container mx-auto rounded-2xl gradient-cta p-12 text-center md:p-16">
        <h2 className="text-3xl font-bold text-primary-foreground md:text-4xl">
          Launch AI Landing Pages Directly on Your Website
        </h2>
        <p className="mt-4 text-primary-foreground/70">
          Generate, customize, and publish high-converting PPC landing pages with AI — instantly live on your own domain.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link to="/login">
            <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-9 rounded-md px-3">
              Start Building Free <ArrowRight className="h-4 w-4" />
            </button>
          </Link>
          <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-9 rounded-md px-3">
            Schedule Demo
          </button>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
