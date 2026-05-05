
import { type Project } from "../services/api";

export const AI_MOCK_PROMPTS = [
  "Develop a high-conversion landing page for {name} that focuses on {industry} expertise. Include a trust-building hero section, a detailed services grid with unique icons, and a results-driven CTA.",
  "Design a premium, minimalist landing page for {name}'s {industry} services. Emphasize clean white space, professional typography, and a seamless mobile-first lead capture form.",
  "Create a data-backed PPC landing page for {name} in the {industry} sector. Feature customer testimonials prominently, add an interactive FAQ section, and optimize for quick load speeds.",
  "Build a luxury-themed showcase for {name}. Use a sophisticated color palette, high-end imagery placeholders, and a narrative-driven layout that tells the story of your {industry} excellence."
];

export const MOCK_SECTIONS = {
  hero: [
    {
      id: "hero-1",
      html: `
        <section class="relative py-20 overflow-hidden bg-white">
          <div class="container mx-auto px-6 relative z-10">
            <div class="flex flex-wrap items-center -mx-4">
              <div class="w-full lg:w-1/2 px-4 mb-12 lg:mb-0">
                <div class="max-w-xl">
                  <span class="inline-block py-1 px-3 mb-4 text-xs font-semibold tracking-widest uppercase rounded-full bg-indigo-50 text-indigo-600">Premium {industry} Solutions</span>
                  <h1 class="text-5xl lg:text-6xl font-bold font-heading mb-6 leading-tight">Elevate Your Business with <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">{name}</span></h1>
                  <p class="text-xl text-gray-500 mb-10 leading-relaxed">Experience the future of {industry} with our cutting-edge technology and dedicated specialist team. Designed for results, built for scale.</p>
                  <div class="flex flex-wrap items-center">
                    <a class="inline-block w-full md:w-auto px-8 py-4 mb-4 md:mb-0 md:mr-4 text-center text-white font-bold bg-indigo-600 hover:bg-indigo-700 rounded-xl transition duration-200 shadow-lg shadow-indigo-100" href="#">Get Started Now</a>
                    <a class="inline-block w-full md:w-auto px-8 py-4 text-center text-gray-900 font-bold bg-gray-50 hover:bg-gray-100 rounded-xl transition duration-200" href="#">Learn More</a>
                  </div>
                </div>
              </div>
              <div class="w-full lg:w-1/2 px-4">
                <div class="relative max-w-lg mx-auto lg:mr-0">
                  <img class="block w-full h-120 object-cover rounded-3xl shadow-2xl" src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Hero Image">
                  <div class="absolute top-0 right-0 -mt-10 -mr-10 h-32 w-32 bg-indigo-100 rounded-full filter blur-3xl opacity-50"></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      `
    },
    {
      id: "hero-2",
      html: `
        <section class="relative py-24 bg-gray-900 overflow-hidden">
          <div class="container mx-auto px-6 relative z-10">
            <div class="max-w-4xl mx-auto text-center">
              <span class="inline-block py-1 px-3 mb-6 text-xs font-semibold tracking-widest text-indigo-400 uppercase border border-indigo-400 rounded-full">New Era of {industry}</span>
              <h1 class="text-5xl lg:text-7xl font-bold text-white mb-8 leading-tight">Precision. Power. <span class="text-indigo-500">Performance.</span></h1>
              <p class="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">Join thousands of companies using {name} to transform their {industry} workflows and achieve unprecedented growth.</p>
              <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button class="w-full sm:w-auto px-10 py-5 text-lg font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-2xl transition duration-200 shadow-xl shadow-indigo-900/20">Book a Demo</button>
                <button class="w-full sm:w-auto px-10 py-5 text-lg font-bold text-white bg-transparent border-2 border-white/20 hover:border-white rounded-2xl transition duration-200">View Pricing</button>
              </div>
            </div>
          </div>
          <div class="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-gray-900 to-transparent"></div>
        </section>
      `
    }
  ],
  features: [
    {
      id: "features-1",
      html: `
        <section class="py-20 bg-gray-50" id="features">
          <div class="container mx-auto px-6">
            <div class="text-center max-w-3xl mx-auto mb-16">
              <h2 class="text-3xl lg:text-4xl font-bold mb-4">Why Choose {name}?</h2>
              <p class="text-gray-500">We provide the tools and expertise you need to succeed in the modern {industry} landscape.</p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div class="p-8 bg-white rounded-3xl border border-gray-100 hover:shadow-xl transition duration-300">
                <div class="h-14 w-14 mb-6 flex items-center justify-center bg-indigo-50 text-indigo-600 rounded-2xl">
                  <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                </div>
                <h3 class="text-xl font-bold mb-3">Instant Scalability</h3>
                <p class="text-gray-500 leading-relaxed">Grow your operations without the friction. Our systems adapt to your needs in real-time.</p>
              </div>
              <div class="p-8 bg-white rounded-3xl border border-gray-100 hover:shadow-xl transition duration-300">
                <div class="h-14 w-14 mb-6 flex items-center justify-center bg-emerald-50 text-emerald-600 rounded-2xl">
                  <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04kM12 21.355r-.382-.033A11.955 11.955 0 013.382 17.34a11.955 11.955 0 010-10.68kM12 2.944a11.955 11.955 0 018.618 3.04kM20.618 17.34a11.955 11.955 0 01-8.236 4.015"></path></svg>
                </div>
                <h3 class="text-xl font-bold mb-3">Military-Grade Security</h3>
                <p class="text-gray-500 leading-relaxed">Your data is encrypted and protected by the industry's most rigorous security protocols.</p>
              </div>
              <div class="p-8 bg-white rounded-3xl border border-gray-100 hover:shadow-xl transition duration-300">
                <div class="h-14 w-14 mb-6 flex items-center justify-center bg-amber-50 text-amber-600 rounded-2xl">
                  <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                </div>
                <h3 class="text-xl font-bold mb-3">Deep Analytics</h3>
                <p class="text-gray-500 leading-relaxed">Get actionable insights from your data with our advanced reporting dashboard.</p>
              </div>
            </div>
          </div>
        </section>
      `
    }
  ],
  testimonials: [
    {
      id: "testimonials-1",
      html: `
        <section class="py-20 bg-white">
          <div class="container mx-auto px-6">
            <h2 class="text-3xl font-bold text-center mb-16">Trusted by Industry Leaders</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div class="p-8 rounded-3xl bg-gray-50">
                <p class="text-lg text-gray-600 italic mb-6">"{name} has completely transformed how we handle our {industry} projects. The efficiency gains have been massive."</p>
                <div class="flex items-center">
                  <img class="h-12 w-12 rounded-full mr-4" src="https://i.pravatar.cc/150?u=1" alt="Avatar">
                  <div>
                    <h4 class="font-bold">Sarah Jenkins</h4>
                    <p class="text-sm text-gray-500">CEO, TechFlow Systems</p>
                  </div>
                </div>
              </div>
              <div class="p-8 rounded-3xl bg-gray-50">
                <p class="text-lg text-gray-600 italic mb-6">"The best {industry} solution we've ever used. The support team is incredible and the results speak for themselves."</p>
                <div class="flex items-center">
                  <img class="h-12 w-12 rounded-full mr-4" src="https://i.pravatar.cc/150?u=2" alt="Avatar">
                  <div>
                    <h4 class="font-bold">Michael Chen</h4>
                    <p class="text-sm text-gray-500">Director of Operations, Global Logistics</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      `
    }
  ],
  cta: [
    {
      id: "cta-1",
      html: `
        <section class="py-20">
          <div class="container mx-auto px-6">
            <div class="relative py-16 px-8 lg:px-16 bg-indigo-600 rounded-3xl overflow-hidden shadow-2xl">
              <div class="relative z-10 max-w-2xl">
                <h2 class="text-3xl lg:text-5xl font-bold text-white mb-6">Ready to revolutionize your {industry}?</h2>
                <p class="text-xl text-indigo-100 mb-10">Start your 14-day free trial today. No credit card required. Cancel anytime.</p>
                <div class="flex flex-wrap gap-4">
                  <button class="px-8 py-4 bg-white text-indigo-600 font-bold rounded-xl hover:bg-gray-100 transition duration-200">Start Free Trial</button>
                  <button class="px-8 py-4 bg-transparent border-2 border-indigo-400 text-white font-bold rounded-xl hover:border-white transition duration-200">Talk to Sales</button>
                </div>
              </div>
              <div class="absolute top-0 right-0 -mt-12 -mr-12 h-64 w-64 bg-indigo-500 rounded-full opacity-50 filter blur-3xl"></div>
            </div>
          </div>
        </section>
      `
    }
  ]
};

export function generateSimulatedPage(prompt: string, project: Project, branding: any) {
  const industry = project.category || "Service";
  const name = project.name || "My Business";
  
  // Randomly select sections
  const hero = MOCK_SECTIONS.hero[Math.floor(Math.random() * MOCK_SECTIONS.hero.length)];
  const features = MOCK_SECTIONS.features[Math.floor(Math.random() * MOCK_SECTIONS.features.length)];
  const testimonials = MOCK_SECTIONS.testimonials[Math.floor(Math.random() * MOCK_SECTIONS.testimonials.length)];
  const cta = MOCK_SECTIONS.cta[Math.floor(Math.random() * MOCK_SECTIONS.cta.length)];

  const sections = [hero, features, testimonials, cta];
  
  let fullHtml = sections.map(s => s.html).join("\n");
  
  // Replacements
  fullHtml = fullHtml
    .replace(/{name}/g, name)
    .replace(/{industry}/g, industry);

  // Add a simple header and footer
  const header = `
    <nav class="py-6 bg-white border-b border-gray-100">
      <div class="container mx-auto px-6 flex justify-between items-center">
        <div class="text-2xl font-black text-gray-900">${name}</div>
        <div class="hidden md:flex space-x-8">
          <a href="#features" class="text-gray-600 hover:text-indigo-600 font-semibold">Features</a>
          <a href="#" class="text-gray-600 hover:text-indigo-600 font-semibold">Pricing</a>
          <a href="#" class="text-gray-600 hover:text-indigo-600 font-semibold">Support</a>
        </div>
        <button class="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition">Get Started</button>
      </div>
    </nav>
  `;

  const footer = `
    <footer class="py-12 bg-gray-50 border-t border-gray-100">
      <div class="container mx-auto px-6 text-center">
        <div class="text-xl font-bold mb-4">${name}</div>
        <p class="text-gray-500 mb-8">&copy; 2026 ${name}. All rights reserved.</p>
        <div class="flex justify-center space-x-6">
          <a href="#" class="text-gray-400 hover:text-indigo-600">Twitter</a>
          <a href="#" class="text-gray-400 hover:text-indigo-600">LinkedIn</a>
          <a href="#" class="text-gray-400 hover:text-indigo-600">Facebook</a>
        </div>
      </div>
    </footer>
  `;

  return {
    content: header + fullHtml + footer,
    styles: `
      @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
      
      :root {
        --primary: ${branding.primary};
        --secondary: ${branding.secondary};
        --font-heading: 'Outfit', sans-serif;
        --font-body: 'Plus Jakarta Sans', sans-serif;
      }

      body {
        font-family: var(--font-body);
      }

      h1, h2, h3, h4, h5, h6 {
        font-family: var(--font-heading);
      }

      .bg-indigo-600 { background-color: var(--primary) !important; }
      .text-indigo-600 { color: var(--primary) !important; }
      .from-indigo-600 { --tw-gradient-from: var(--primary) !important; }
      .to-violet-600 { --tw-gradient-to: var(--secondary) !important; }
      
      .premium-glass {
        background: rgba(255, 255, 255, 0.7);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border: 1px solid rgba(255, 255, 255, 0.3);
      }

      .premium-shadow {
        box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.1);
      }

      .animate-float {
        animation: float 6s ease-in-out infinite;
      }

      @keyframes float {
        0% { transform: translateY(0px); }
        50% { transform: translateY(-20px); }
        100% { transform: translateY(0px); }
      }
    `
  };
}
