import {
  ArrowRight,
  Sparkles,
  Play,
  Check,
  ChevronDown,
  Zap,
  Target,
  TrendingUp,
  Lightbulb,
  Palette,
  BarChart3,
  Clock,
  Users,
} from "lucide-react";
import { useState } from "react";

const BuildifyLandingPage = () => {
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);
  const [activePricingTab, setActivePricingTab] = useState("monthly");

  return (
    <div className="overflow-hidden bg-[#f7f4ef] text-black">
      {/* ===== HERO SECTION ===== */}
      <section className="relative overflow-hidden py-24 md:py-32">
        {/* Blur backgrounds */}
        <div className="absolute left-[-120px] top-[-120px] h-[320px] w-[320px] rounded-full bg-pink-300/40 blur-3xl" />
        <div className="absolute right-[-120px] top-[-80px] h-[300px] w-[300px] rounded-full bg-violet-300/40 blur-3xl" />

        <div className="container relative mx-auto px-4">
          {/* Badge */}
          <div className="mx-auto mb-6 flex w-fit items-center gap-2 rounded-full border border-black/5 bg-white px-4 py-2 text-sm shadow-sm">
            <Sparkles className="h-4 w-4 text-pink-500" />
            AI-Powered Landing Page Builder
          </div>

          {/* Title */}
          <h1 className="mx-auto max-w-4xl text-center text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl">
            AI-Generated Landing
            <br />
            Pages.
            <span className="block bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
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
            <button className="flex items-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition hover:scale-105">
              Start Free
              <ArrowRight className="h-4 w-4" />
            </button>
            <button className="flex items-center gap-2 rounded-full border border-black/10 bg-white px-6 py-3 text-sm font-medium text-black hover:bg-black/5">
              <Play className="h-4 w-4" />
              Watch Demo
            </button>
          </div>

          {/* Companies */}
          <div className="mt-20 border-t border-black/10 pt-8">
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

      {/* ===== PROBLEM SECTION ===== */}
      <section className="relative py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-2">
            {/* Left: Problem Statement */}
            <div>
              <h2 className="mb-6 text-4xl font-semibold leading-tight">
                Most Landing Pages Face This Problem
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100">
                      <Target className="h-5 w-5 text-pink-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-black">Time-Consuming Process</h3>
                    <p className="mt-2 text-sm text-black/60">
                      Building optimized landing pages takes weeks of design and development work.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100">
                      <Zap className="h-5 w-5 text-violet-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-black">Expensive to Scale</h3>
                    <p className="mt-2 text-sm text-black/60">
                      Creating multiple variations for A/B testing requires significant investment.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-black">Poor Integration</h3>
                    <p className="mt-2 text-sm text-black/60">
                      Hosting and maintaining pages across multiple platforms is complex.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Solution Highlight */}
            <div className="flex items-center justify-center rounded-2xl bg-gradient-to-br from-pink-100 to-violet-100 p-8">
              <div className="text-center">
                <Lightbulb className="mx-auto mb-4 h-16 w-16 text-pink-600" />
                <h3 className="text-2xl font-semibold">
                  Buildify Changes That
                </h3>
                <p className="mt-4 text-black/70">
                  AI-powered creation, instant publishing, and built-in optimization—all in minutes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section className="relative py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="mb-4 text-4xl font-semibold">
              Landing Pages That Actually Live on Your Website
            </h2>
            <p className="mx-auto max-w-2xl text-black/60">
              Every page is built with your brand, optimized for conversions, and ready to go live
              instantly on your domain.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {/* Feature 1 */}
            <div className="rounded-2xl border border-black/5 bg-white p-8 shadow-sm transition hover:shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-pink-100">
                <Palette className="h-6 w-6 text-pink-600" />
              </div>
              <h3 className="mb-3 text-lg font-semibold">Brand Consistency</h3>
              <p className="text-sm text-black/60">
                Every page matches your brand guidelines and design system automatically.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-2xl border border-black/5 bg-white p-8 shadow-sm transition hover:shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-violet-100">
                <BarChart3 className="h-6 w-6 text-violet-600" />
              </div>
              <h3 className="mb-3 text-lg font-semibold">Conversion Optimized</h3>
              <p className="text-sm text-black/60">
                Pages are built with proven conversion best practices and psychology principles.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-2xl border border-black/5 bg-white p-8 shadow-sm transition hover:shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="mb-3 text-lg font-semibold">Instantly Publishable</h3>
              <p className="text-sm text-black/60">
                Generate, review, and publish live pages directly on your domain in minutes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== STEPS SECTION ===== */}
      <section className="relative py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-4xl font-semibold">
            Launch PPC Landing Pages in 3 Steps
          </h2>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-black text-white text-3xl font-bold">
                1
              </div>
              <h3 className="mb-3 text-xl font-semibold">Connect Your Campaign</h3>
              <p className="text-black/60">
                Link your Google Ads or Meta campaign data to get AI insights tailored to your ads.
              </p>
            </div>

            {/* Arrow */}
            <div className="hidden items-end justify-center md:flex">
              <div className="mb-6 h-1 w-full bg-gradient-to-r from-transparent via-black/20 to-transparent" />
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-black text-white text-3xl font-bold">
                2
              </div>
              <h3 className="mb-3 text-xl font-semibold">AI Generates Pages</h3>
              <p className="text-black/60">
                Our AI creates optimized landing pages based on your campaign and audience insights.
              </p>
            </div>

            {/* Arrow */}
            <div className="hidden items-end justify-center md:flex">
              <div className="mb-6 h-1 w-full bg-gradient-to-r from-transparent via-black/20 to-transparent" />
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-black text-white text-3xl font-bold">
                3
              </div>
              <h3 className="mb-3 text-xl font-semibold">Publish & Track</h3>
              <p className="text-black/60">
                One-click publishing to your domain with built-in analytics and conversion tracking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== BENEFITS SECTION ===== */}
      <section className="relative py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="mb-4 text-center text-4xl font-semibold">
            AI That Builds More Than Just Launches
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-black/60">
            Get intelligent pages that understand your campaigns and continuously improve performance.
          </p>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Zap, title: "Lightning Fast", desc: "Pages load in under 2 seconds globally" },
              { icon: Target, title: "Campaign Aware", desc: "AI understands your PPC strategy" },
              { icon: TrendingUp, title: "Auto-Optimized", desc: "Continuous conversion rate optimization" },
              { icon: BarChart3, title: "Deep Analytics", desc: "Real-time performance insights" },
              { icon: Users, title: "A/B Testing", desc: "Built-in multivariate testing" },
              { icon: Lightbulb, title: "AI Copywriting", desc: "Intelligent headline and CTA generation" },
            ].map((item, idx) => (
              <div key={idx} className="flex gap-4 rounded-lg border border-black/5 bg-white p-6">
                <div className="flex-shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-pink-100">
                    <item.icon className="h-6 w-6 text-pink-600" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-black/60">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PPC SPECIFIC SECTION ===== */}
      <section className="relative py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-4xl font-semibold">
            Designed Specifically for PPC Campaigns
          </h2>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              "Single Keyword Targeting",
              "Ad Copy Integration",
              "UTM Parameter Auto-Setup",
              "Audience Matching",
              "Conversion Pixel Ready",
              "Multi-Channel Compatible",
            ].map((feature, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <Check className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-black">{feature}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TEMPLATES SECTION ===== */}
      <section className="relative py-16 md:py-24">
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
            {["SaaS", "E-commerce", "Services", "Webinar", "Lead Gen", "Product Launch", "Free Trial", "Software"].map(
              (template, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-black/5 bg-white p-6 text-center transition hover:shadow-md"
                >
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-gradient-to-br from-pink-100 to-violet-100 mx-auto">
                    <Sparkles className="h-8 w-8 text-pink-600" />
                  </div>
                  <h3 className="font-semibold text-black">{template}</h3>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* ===== SOCIAL PROOF SECTION ===== */}
      <section className="relative py-16 md:py-24 bg-black/5">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-4xl font-semibold">
            Why Marketers Choose Buildify
          </h2>

          <div className="grid gap-8 md:grid-cols-2">
            {[
              { stat: "47%", desc: "Average conversion rate increase" },
              { stat: "3x", desc: "Faster time to launch" },
              { stat: "10k+", desc: "Pages created monthly" },
              { stat: "$2M+", desc: "Revenue generated for clients" },
            ].map((item, idx) => (
              <div key={idx} className="rounded-xl bg-white p-8 text-center">
                <div className="text-4xl font-bold text-transparent bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text">
                  {item.stat}
                </div>
                <p className="mt-2 text-black/60">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PRICING SECTION ===== */}
      <section className="relative py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="mb-6 text-4xl font-semibold">Simple Pricing for Growing Teams</h2>
            <p className="mx-auto mb-8 max-w-2xl text-black/60">
              Choose the plan that fits your needs. Always free to get started.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {/* Starter */}
            <div className="rounded-2xl border border-black/10 bg-white p-8">
              <h3 className="text-xl font-semibold">Starter</h3>
              <div className="mt-4">
                <span className="text-4xl font-bold">$29</span>
                <span className="text-black/60">/month</span>
              </div>
              <p className="mt-4 text-sm text-black/60">Perfect for getting started</p>
              <ul className="mt-6 space-y-3">
                {["Up to 10 pages/month", "Basic templates", "Email support", "Analytics dashboard"].map(
                  (feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-600" />
                      {feature}
                    </li>
                  )
                )}
              </ul>
              <button className="mt-8 w-full rounded-full bg-black/10 px-6 py-3 font-medium text-black hover:bg-black/20">
                Get Started
              </button>
            </div>

            {/* Professional */}
            <div className="relative rounded-2xl border-2 border-pink-500 bg-gradient-to-br from-pink-50 to-white p-8 ring-1 ring-pink-200">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-pink-500 to-violet-500 px-4 py-1 rounded-full text-white text-xs font-semibold">
                POPULAR
              </div>
              <h3 className="text-xl font-semibold">Professional</h3>
              <div className="mt-4">
                <span className="text-4xl font-bold">$99</span>
                <span className="text-black/60">/month</span>
              </div>
              <p className="mt-4 text-sm text-black/60">For growing agencies</p>
              <ul className="mt-6 space-y-3">
                {["Up to 50 pages/month", "All templates", "Priority support", "Advanced analytics", "API access"].map(
                  (feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-600" />
                      {feature}
                    </li>
                  )
                )}
              </ul>
              <button className="mt-8 w-full rounded-full bg-gradient-to-r from-pink-500 to-violet-500 px-6 py-3 font-medium text-white hover:opacity-90">
                Get Started
              </button>
            </div>

            {/* Enterprise */}
            <div className="rounded-2xl border border-black/10 bg-white p-8">
              <h3 className="text-xl font-semibold">Enterprise</h3>
              <div className="mt-4">
                <span className="text-4xl font-bold">Custom</span>
              </div>
              <p className="mt-4 text-sm text-black/60">For large teams</p>
              <ul className="mt-6 space-y-3">
                {["Unlimited pages", "Custom integration", "Dedicated support", "White label options", "SLA guarantee"].map(
                  (feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-600" />
                      {feature}
                    </li>
                  )
                )}
              </ul>
              <button className="mt-8 w-full rounded-full border border-black px-6 py-3 font-medium text-black hover:bg-black/5">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FAQ SECTION ===== */}
      <section className="relative py-16 md:py-24 bg-black/5">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="mb-12 text-center text-4xl font-semibold">Frequently Asked Questions</h2>

          <div className="space-y-4">
            {[
              {
                q: "How does AI generate landing pages?",
                a: "Our AI analyzes your campaign data, audience insights, and industry best practices to create optimized landing pages tailored to your specific needs.",
              },
              {
                q: "Can I edit pages after they're generated?",
                a: "Yes! All pages come with a drag-and-drop editor. You can customize any element, change copy, adjust colors, or redesign sections completely.",
              },
              {
                q: "How long does it take to publish a page?",
                a: "Pages are ready to publish instantly. Just review the AI-generated version and click publish. They go live on your domain immediately.",
              },
              {
                q: "Do you provide hosting?",
                a: "Buildify pages are published directly on your domain. We don't host them ourselves—they live where you want them to.",
              },
              {
                q: "What about analytics and tracking?",
                a: "Built-in analytics dashboard tracks all conversions, visitor behavior, and campaign performance. Integrates with Google Analytics and other tools.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="rounded-lg border border-black/5 bg-white overflow-hidden"
              >
                <button
                  onClick={() => setActiveFAQ(activeFAQ === idx ? null : idx)}
                  className="w-full flex items-center justify-between px-6 py-4 hover:bg-black/2"
                >
                  <h3 className="font-semibold text-left">{item.q}</h3>
                  <ChevronDown
                    className={`h-5 w-5 flex-shrink-0 transition ${
                      activeFAQ === idx ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {activeFAQ === idx && (
                  <div className="border-t border-black/5 px-6 py-4 text-black/60 text-sm">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="relative overflow-hidden py-20 md:py-32">
        {/* Background blur */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-violet-900 to-purple-900" />
        <div className="absolute right-[-200px] top-[-100px] h-[400px] w-[400px] rounded-full bg-pink-500/20 blur-3xl" />

        <div className="container relative mx-auto px-4 text-center">
          <h2 className="mx-auto max-w-3xl text-5xl font-semibold leading-tight text-white md:text-6xl">
            Launch AI Landing Pages Directly on Your Website
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/80">
            Start creating conversion-focused landing pages in minutes, not weeks.
          </p>
          <button className="mt-8 rounded-full bg-white px-8 py-4 font-semibold text-black transition hover:scale-105">
            Get Started Free
          </button>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-black text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="grid gap-8 md:grid-cols-5">
            <div>
              <h3 className="font-bold text-lg">Buildify</h3>
              <p className="mt-2 text-sm text-white/60">
                AI-powered landing page builder for performance marketers.
              </p>
            </div>
            <div>
              <h4 className="font-semibold">Product</h4>
              <ul className="mt-4 space-y-2 text-sm text-white/60">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Templates</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Company</h4>
              <ul className="mt-4 space-y-2 text-sm text-white/60">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Legal</h4>
              <ul className="mt-4 space-y-2 text-sm text-white/60">
                <li><a href="#" className="hover:text-white">Privacy</a></li>
                <li><a href="#" className="hover:text-white">Terms</a></li>
                <li><a href="#" className="hover:text-white">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Social</h4>
              <ul className="mt-4 space-y-2 text-sm text-white/60">
                <li><a href="#" className="hover:text-white">Twitter</a></li>
                <li><a href="#" className="hover:text-white">LinkedIn</a></li>
                <li><a href="#" className="hover:text-white">Github</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-white/10 pt-8">
            <p className="text-center text-sm text-white/60">
              © 2024 Buildify. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BuildifyLandingPage;
