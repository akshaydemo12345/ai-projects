import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CtaSection = () => {
  return (
    <section className="px-4 py-12">
      <div className="container mx-auto rounded-2xl gradient-cta p-12 text-center md:p-16">
        <h2 className="text-3xl font-bold text-primary-foreground md:text-4xl">
          Ready to build your next landing page?
        </h2>
        <p className="mt-4 text-primary-foreground/70">
          Join 12,000+ builders creating high-converting pages with AI
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link to="/login">
            <Button size="lg" className="gap-2 px-8">
              Get Builder Pro <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Button size="lg" variant="outline" className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 px-8">
            Watch a Demo
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
