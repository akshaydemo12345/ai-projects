import { ArrowRight, Sparkles, Play } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden pt-24">
      {/* Blur backgrounds */}
      <div className="absolute left-[-120px] top-[-120px] h-[320px] w-[320px] rounded-full bg-pink-300/40 blur-3xl" />
      <div className="absolute right-[-120px] top-[-80px] h-[300px] w-[300px] rounded-full bg-violet-300/40 blur-3xl" />

      <div className="container relative mx-auto px-4">
        {/* Badge */}
        <div className="mx-auto mb-6 flex w-fit items-center gap-2 rounded-full border border-black/5 bg-white px-4 py-2 text-sm shadow-sm">
          <Sparkles className="h-4 w-4 text-[#7c3bed]" />
          AI-Powered Landing Page Builder
        </div>

        {/* Title */}
        <h1 className="mx-auto max-w-4xl text-center text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl">
          AI-Generated Landing
          <br />
          Pages.
          <span className="block bg-gradient-to-r from-[#7c3bed] to-[#1a27e4] bg-clip-text text-transparent">
            Instantly Live
          </span>
          on Your Domain.
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mt-6 max-w-xl text-center text-[15px] leading-7 text-black/60">
          Buildify creates high-converting PPC landing pages with AI and
          publishes them directly on your website.
        </p>

        {/* Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link to="/login">
            <button className="flex items-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition hover:scale-105">
              Start Free
              <ArrowRight className="h-4 w-4" />
            </button>
          </Link>
          <button className="flex items-center gap-2 rounded-full border border-black/10 bg-white px-6 py-3 text-sm font-medium text-black hover:bg-black/5">
            <Play className="h-4 w-4" />
            Watch Demo
          </button>
        </div>

        {/* Companies */}
        <div className="mt-20 border-t border-black/10 pt-20 pb-24">
          <p className="mb-4 text-center text-xs font-semibold uppercase tracking-widest text-black/60">
            Built for performance marketers at
          </p>
          <div className="flex flex-wrap items-center justify-center gap-12 grayscale opacity-40">
            <span className="text-2xl font-bold">Google</span>
            <span className="text-2xl font-bold">Meta</span>
            <span className="text-2xl font-bold">Shopify</span>
            <span className="text-2xl font-bold">Stripe</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
