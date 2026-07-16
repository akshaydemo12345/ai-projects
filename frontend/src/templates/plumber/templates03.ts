// Auto-generated ULTRA-DYNAMIC template
// Generated: 2026-07-16T05:51:18.549Z
// ════════════════════════════════════════════════════════════════════════════
// Converted directly in the browser using Frontend JSZip Extraction
// ════════════════════════════════════════════════════════════════════════════

export const plumber03Styles = `
:root {
  --primary: PRIMARY_COLOR_PLACEHOLDER;
  --secondary: SECONDARY_COLOR_PLACEHOLDER;
  --primary-rgb: PRIMARY_RGB_PLACEHOLDER;
  --secondary-rgb: SECONDARY_RGB_PLACEHOLDER;
  --bg-light: #fdfdfd;
  --text-dark: #1f1f1f;
  --text-muted: #64748b;
  --border-light: #f1f5f9;
  --spacing-section-padding: 80px;
  --spacing-gutter: 24px;
}
* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  margin: 0;
  font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, Noto Sans, sans-serif;
  color: var(--text-dark);
  background: #fff;
}
a { color: inherit; text-decoration: none; }
img { max-width: 100%; display: block; }
button, input, select { font: inherit; }
ul { margin: 0; padding-left: 0; list-style: none; }
p, h1, h2, h3, h4, h5 { margin: 0; }

.hero-gradient { background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%); color: #fff; }
.service-card-shadow { box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); }
.step-line::after {
  content: '';
  position: absolute;
  top: 2rem;
  left: 12.5%;
  right: 12.5%;
  height: 2px;
  background: SECONDARY_COLOR_PLACEHOLDER;
  z-index: 0;
}
.step-circle { z-index: 10; background: #fff; }

.material-symbols-outlined {
  font-family: 'Material Symbols Outlined' !important;
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
  line-height: 1;
}

.max-w-7xl { max-width: 80rem; }
.max-w-6xl { max-width: 72rem; }
.max-w-5xl { max-width: 64rem; }
.max-w-lg { max-width: 32rem; }
.mx-auto { margin-left: auto; margin-right: auto; }
.w-full { width: 100%; }

.grid { display: grid; }
.flex { display: flex; }
.hidden { display: none; }
.inline-flex { display: inline-flex; }
.flex-col { flex-direction: column; }
.flex-wrap { flex-wrap: wrap; }
.flex-shrink-0 { flex-shrink: 0; }
.items-center { align-items: center; }
.items-end { align-items: flex-end; }
.items-start { align-items: flex-start; }
.justify-between { justify-content: space-between; }
.justify-center { justify-content: center; }
.text-center { text-align: center; }
.relative { position: relative; }
.absolute { position: absolute; }
.fixed { position: fixed; }
.overflow-hidden { overflow: hidden; }

.z-10 { z-index: 10; }
.z-50 { z-index: 50; }

.h-1 { height: 0.25rem; }
.h-2 { height: 0.5rem; }
.h-4 { height: 1rem; }
.h-5 { height: 1.25rem; }
.h-6 { height: 1.5rem; }
.h-8 { height: 2rem; }
.h-10 { height: 2.5rem; }
.h-12 { height: 3rem; }
.h-14 { height: 3.5rem; }
.h-16 { height: 4rem; }
.h-20 { height: 5rem; }
.h-24 { height: 6rem; }
.h-64 { height: 16rem; }
.w-2 { width: 0.5rem; }
.w-4 { width: 1rem; }
.w-5 { width: 1.25rem; }
.w-6 { width: 1.5rem; }
.w-8 { width: 2rem; }
.w-10 { width: 2.5rem; }
.w-12 { width: 3rem; }
.w-14 { width: 3.5rem; }
.w-16 { width: 4rem; }
.w-20 { width: 5rem; }
.w-24 { width: 6rem; }
.w-64 { width: 16rem; }

.gap-2 { gap: 0.5rem; }
.gap-4 { gap: 1rem; }
.gap-6 { gap: 1.5rem; }
.gap-8 { gap: 2rem; }
.gap-12 { gap: 3rem; }
.gap-20 { gap: 5rem; }
.space-y-4 > * + * { margin-top: 1rem; }
.space-y-6 > * + * { margin-top: 1.5rem; }
.space-y-8 > * + * { margin-top: 2rem; }
.space-x-8 > * + * { margin-left: 2rem; }

.p-6 { padding: 1.5rem; }
.p-8 { padding: 2rem; }
.p-10 { padding: 2.5rem; }
.p-12 { padding: 3rem; }
.px-3 { padding-left: 0.75rem; padding-right: 0.75rem; }
.px-4 { padding-left: 1rem; padding-right: 1rem; }
.px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
.px-12 { padding-left: 3rem; padding-right: 3rem; }
.py-1 { padding-top: 0.25rem; padding-bottom: 0.25rem; }
.py-2\.5 { padding-top: 0.625rem; padding-bottom: 0.625rem; }
.py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
.py-4 { padding-top: 1rem; padding-bottom: 1rem; }
.py-6 { padding-top: 1.5rem; padding-bottom: 1.5rem; }
.py-12 { padding-top: 3rem; padding-bottom: 3rem; }
.py-20 { padding-top: 5rem; padding-bottom: 5rem; }
.py-24 { padding-top: 6rem; padding-bottom: 6rem; }
.pt-4 { padding-top: 1rem; }
.pt-20 { padding-top: 5rem; }
.pt-32 { padding-top: 8rem; }
.pb-10 { padding-bottom: 2.5rem; }
.pb-16 { padding-bottom: 4rem; }
.pb-20 { padding-bottom: 5rem; }
.mb-2 { margin-bottom: 0.5rem; }
.mb-4 { margin-bottom: 1rem; }
.mb-6 { margin-bottom: 1.5rem; }
.mb-8 { margin-bottom: 2rem; }
.mb-12 { margin-bottom: 3rem; }
.mb-16 { margin-bottom: 4rem; }
.mb-20 { margin-bottom: 5rem; }
.ml-2 { margin-left: 0.5rem; }
.mt-1 { margin-top: 0.25rem; }
.-top-24 { top: -6rem; }
.-left-24 { left: -6rem; }

.rounded-sm { border-radius: 0.125rem; }
.rounded-lg { border-radius: 0.5rem; }
.rounded-2xl { border-radius: 1rem; }
.rounded-3xl { border-radius: 1.5rem; }
.rounded-full { border-radius: 9999px; }
.rounded-\[2\.5rem\] { border-radius: 2.5rem; }

.border { border-width: 1px; border-style: solid; }
.border-2 { border-width: 2px; border-style: solid; }
.border-4 { border-width: 4px; border-style: solid; }
.border-b { border-bottom-width: 1px; border-bottom-style: solid; }

.text-xs { font-size: 0.75rem; line-height: 1rem; }
.text-sm { font-size: 0.875rem; line-height: 1.25rem; }
.text-base { font-size: 1rem; line-height: 1.5rem; }
.text-lg { font-size: 1.125rem; line-height: 1.75rem; }
.text-xl { font-size: 1.25rem; line-height: 1.75rem; }
.text-2xl { font-size: 1.5rem; line-height: 2rem; }
.text-3xl { font-size: 1.875rem; line-height: 2.25rem; }
.text-4xl { font-size: 2.25rem; line-height: 2.5rem; }
.text-5xl { font-size: 3rem; line-height: 1; }
.text-\[10px\] { font-size: 10px; }

.font-medium { font-weight: 500; }
.font-semibold { font-weight: 600; }
.font-bold { font-weight: 700; }
.font-black { font-weight: 900; }
.italic { font-style: italic; }
.uppercase { text-transform: uppercase; }
.leading-tight { line-height: 1.25; }
.leading-relaxed { line-height: 1.625; }
.tracking-tight { letter-spacing: -0.025em; }
.tracking-wider { letter-spacing: 0.05em; }
.tracking-widest { letter-spacing: 0.1em; }

.text-white { color: #fff; }
.text-white\/80 { color: rgba(255,255,255,.8); }
.text-white\/90 { color: rgba(255,255,255,.9); }
.text-slate-300 { color: #cbd5e1; }
.text-slate-400 { color: #94a3b8; }
.text-slate-500 { color: var(--text-muted); }
.text-slate-600 { color: #475569; }
.text-slate-700 { color: #334155; }
.text-slate-800 { color: var(--text-dark); }
.text-slate-900 { color: #0f172a; }
.text-brand-blue { color: var(--primary); }
.text-brand-light\/80 { color: rgba(248,250,252,.8); }

.bg-white { background: #fff; }
.bg-white\/5 { background: rgba(255,255,255,.05); }
.bg-white\/10 { background: rgba(255,255,255,.1); }
.bg-white\/20 { background: rgba(255,255,255,.2); }
.bg-white\/30 { background: rgba(255,255,255,.3); }
.bg-slate-50 { background: #f8fafc; }
.bg-sky-50 { background: #f0f9ff; }
.bg-brand-navy { background: var(--text-dark); }
.bg-brand-navy\/95 { background: rgba(0,0,0,.95); }
.bg-brand-blue { background: var(--primary); }
.bg-brand-blue\/20 { background: rgba(PRIMARY_RGB_PLACEHOLDER,.2); }
.bg-brand-orange { background: var(--secondary); }
.bg-orange-500 { background: SECONDARY_COLOR_PLACEHOLDER; }
.bg-indigo-500 { background: #6366f1; }
.bg-emerald-500 { background: #10b981; }

.border-white { border-color: #fff; }
.border-white\/10 { border-color: rgba(255,255,255,.1); }
.border-white\/20 { border-color: rgba(255,255,255,.2); }
.border-white\/40 { border-color: rgba(255,255,255,.4); }
.border-slate-100 { border-color: PRIMARY_COLOR_PLACEHOLDER; }
.border-slate-200 { border-color: #e2e8f0; }
.border-sky-100 { border-color: #e0f2fe; }
.border-brand-blue { border-color: var(--primary); }
.border-brand-blue\/30 { border-color: rgba(PRIMARY_RGB_PLACEHOLDER,.3); }
.border-none{border: 0px;}
.shadow-sm { box-shadow: 0 1px 2px rgba(0,0,0,.05); }
.shadow-lg { box-shadow: 0 10px 15px rgba(0,0,0,.1), 0 4px 6px rgba(0,0,0,.05); }
.shadow-xl { box-shadow: 0 20px 25px rgba(0,0,0,.1), 0 10px 10px rgba(0,0,0,.04); }
.shadow-2xl { box-shadow: 0 25px 50px rgba(0,0,0,.25); }
.shadow-brand-blue\/20 { box-shadow: 0 25px 35px rgba(SECONDARY_RGB_PLACEHOLDER,.2); }

.transition-colors { transition: color .2s, background-color .2s, border-color .2s; }
.transition-all { transition: all .2s; }
.transition-transform { transition: transform .2s; }
.rotate-45 { transform: rotate(45deg); }
.animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
@keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: .5; } }

.backdrop-blur-sm { backdrop-filter: blur(4px); }
.backdrop-blur-md { backdrop-filter: blur(12px); }
.cursor-pointer { cursor: pointer; }
.object-cover { object-fit: cover; }
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0,0,0,0);
  border: 0;
}

.group:hover .group-hover\:text-brand-blue { color: var(--primary); }
.group:hover .group-hover\:translate-x-1 { transform: translateX(0.25rem); }
.group:hover .group-hover\:scale-110 { transform: scale(1.1); }
.group:hover.group-hover\:bg-brand-blue\/10,
.group:hover .group-hover\:bg-brand-blue\/10 { background: rgba(PRIMARY_RGB_PLACEHOLDER,.1); }
.hover\:text-white:hover { color: #fff; }
.hover\:bg-orange-600:hover { background: #ea580c; }
.hover\:bg-brand-blue:hover { background: var(--primary); }
.hover\:bg-brand-blue\/90:hover { background: rgba(PRIMARY_RGB_PLACEHOLDER,.9); }
.hover\:bg-white:hover { background: #fff; }
.hover\:scale-105:hover { transform: scale(1.05); }
.hover\:shadow-orange-500\/20:hover { box-shadow: 0 10px 30px rgba(PRIMARY_RGB_PLACEHOLDER,.2); }
.hover\:translate-y-\[-4px\]:hover { transform: translateY(-4px); }

input, select {
  width: 100%;
  background: rgba(255,255,255,.1);
  border: 1px solid rgba(255,255,255,.2);
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  color: #fff;
  outline: none;
}
input::placeholder { color: #94a3b8; }
select { color: #94a3b8; }
input:focus, select:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 2px rgba(PRIMARY_RGB_PLACEHOLDER,.25);
}

.grid-cols-1 { grid-template-columns: repeat(1, minmax(0,1fr)); }
.grid-cols-2 { grid-template-columns: repeat(2, minmax(0,1fr)); }
.col-span-1 { grid-column: span 1 / span 1; }

@media (min-width: 640px) {
  .sm\:px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
  .sm\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0,1fr)); }
  .sm\:flex { display: flex; }
}
@media (min-width: 768px) {
  .md\:flex { display: flex; }
  .md\:block { display: block; }
  .md\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0,1fr)); }
  .md\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0,1fr)); }
  .md\:grid-cols-5 { grid-template-columns: repeat(5, minmax(0,1fr)); }
  .md\:col-span-1 { grid-column: span 1 / span 1; }
  .md\:row { flex-direction: row; }
}
@media (min-width: 1024px) {
  .lg\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0,1fr)); }
  .lg\:flex-row { flex-direction: row; }
  .lg\:px-8 { padding-left: 2rem; padding-right: 2rem; }
  .lg\:p-16 { padding: 4rem; }
  .lg\:pt-48 { padding-top: 12rem; }
  .lg\:pb-32 { padding-bottom: 8rem; }
  .lg\:text-5xl { font-size: 3rem; line-height: 1; }
  .lg\:text-6xl { font-size: 3.75rem; line-height: 1; }
  .lg\:text-7xl { font-size: 4.5rem; line-height: 1; }
  .lg\:text-left { text-align: left; }
  .lg\:w-1\/3 { width: 33.333333%; }
  .lg\:w-2\/3 { width: 66.666667%; }
}
`;

export const plumber03Html = `
<link
    href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap"
    rel="stylesheet" />
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

<!-- BEGIN: Header -->
  <header class="fixed w-full z-50 bg-brand-navy/95 backdrop-blur-sm border-b border-white/10"
    data-purpose="MainHeader">
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
      <a class="logo flex items-center gap-2 text-white text-2xl font-bold tracking-tight" href="#">
        LOGO_PLACEHOLDER
      </a>

      <a data-editable="true" class="bg-brand-orange hover:bg-orange-600 text-white px-6 py-2.5 rounded-full font-semibold transition-all shadow-lg hover:shadow-orange-500/20"
        href="tel:5551234567">
        Emergency Service
      </a>
    </nav>
  </header>
  <!-- END: Header -->
  <!-- BEGIN: Hero Section -->
  <section class="hero-gradient pt-32 pb-20 lg:pt-48 lg:pb-32 px-4" data-purpose="HeroSection">
    <div class="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
      <div class="text-white space-y-8">
        <div class="inline-flex items-center gap-2 px-3 py-1 bg-brand-blue/20 rounded-full border border-brand-blue/30">
          <span data-editable="true" class="w-2 h-2 bg-brand-blue rounded-full animate-pulse"></span>
          <span data-editable="true" class="text-xs font-bold uppercase tracking-wider text-brand-blue">24/7 Available</span>
        </div>
        <h1 data-editable="true" class="text-5xl lg:text-7xl font-bold leading-tight">
          Fast &amp; Reliable <br />
          <span data-editable="true" class="text-brand-blue italic">Plumbing</span> <br />
          Services, Anytime.
        </h1>
        <p data-editable="true" class="text-lg text-slate-300 max-w-lg">
          24/7 emergency support, certified plumbers, and a rapid response team ready to solve your problems.
        </p>
        <div class="flex flex-wrap gap-8 pt-4">
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
              <span data-editable="true" class="text-brand-blue font-bold text-xl">4.9</span>
            </div>
            <div>
              <p data-editable="true" class="font-bold text-lg">4.9/5</p>
              <p data-editable="true" class="text-xs text-slate-400 uppercase tracking-wider">Google Reviews</p>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
              <span data-editable="true" class="text-brand-blue font-bold text-xl">10k</span>
            </div>
            <div>
              <p data-editable="true" class="font-bold text-lg">10k+</p>
              <p data-editable="true" class="text-xs text-slate-400 uppercase tracking-wider">Jobs Completed</p>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
              <span data-editable="true" class="text-brand-blue font-bold text-xl">&lt;30</span>
            </div>
            <div>
              <p data-editable="true" class="font-bold text-lg">&lt; 30 Min</p>
              <p data-editable="true" class="text-xs text-slate-400 uppercase tracking-wider">Response Time</p>
            </div>
          </div>
        </div>
      </div>
      <!-- Lead Form -->
      <div class="bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/10" data-purpose="LeadForm">
        <h3 data-editable="true" class="text-2xl font-bold text-white mb-2">Request Service Now</h3>
        <p data-editable="true" class="text-slate-400 mb-8">Fill out the form and we will be there shortly.</p>
        <form class="space-y-4" id="hero-form">
          <input
            class="w-full bg-white/10 border-white/20 rounded-lg py-3 px-4 text-white placeholder-slate-400 focus:ring-brand-blue focus:border-brand-blue"
            placeholder="Full Name" required="" type="text" name="name" id="name" />
          <input
            class="w-full bg-white/10 border-white/20 rounded-lg py-3 px-4 text-white placeholder-slate-400 focus:ring-brand-blue focus:border-brand-blue"
            placeholder="Phone Number" required="" type="tel" name="phone" id="phone" />
          <select
            class="w-full bg-white/10 border-white/20 rounded-lg py-3 px-4 text-slate-400 focus:ring-brand-blue focus:border-brand-blue" name="service" id="service">
            <option value="">Service Type</option>
            <option value="leak">Leak Detection</option>
            <option value="drain">Drain Cleaning</option>
            <option value="heater">Water Heater</option>
          </select>
          <input
            class="w-full bg-white/10 border-white/20 rounded-lg py-3 px-4 text-white placeholder-slate-400 focus:ring-brand-blue focus:border-brand-blue"
            placeholder="Your Address / Zip" required="" type="text" name="address" id="address" />
          <button data-editable="true"
            class="w-full bg-brand-blue hover:bg-brand-blue/90 text-white font-bold py-4 rounded-lg transition-all shadow-xl shadow-brand-blue/20 border-none"
            type="submit">
            Fix My Issue
          </button>
        </form>
      </div>
    </div>
  </section>
  <!-- END: Hero Section -->
  <!-- BEGIN: Horizontal Service Row -->
  <section class="py-12 border-b border-slate-100" data-purpose="QuickFeatures">
    <div class="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-5 gap-8"><!-- Feature Item -->
      <div class="text-center group cursor-pointer">
        <div
          class="w-24 h-24 mx-auto bg-slate-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-brand-blue/10 transition-colors">
          <span data-editable="true"
            class="material-symbols-outlined text-5xl text-slate-400 group-hover:text-brand-blue transition-colors">leak_add</span>
        </div>
        <h4 data-editable="true" class="font-bold text-base">Leak Detection</h4>
        <p data-editable="true" class="text-xs text-slate-500">Fast &amp; accurate</p>
      </div>
      <div class="text-center group cursor-pointer">
        <div
          class="w-24 h-24 mx-auto bg-slate-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-brand-blue/10 transition-colors">
          <span data-editable="true"
            class="material-symbols-outlined text-5xl text-slate-400 group-hover:text-brand-blue transition-colors">cleaning_services</span>
        </div>
        <h4 data-editable="true" class="font-bold text-base">Drain Cleaning</h4>
        <p data-editable="true" class="text-xs text-slate-500">Clear clogs fast</p>
      </div>
      <div class="text-center group cursor-pointer">
        <div
          class="w-24 h-24 mx-auto bg-slate-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-brand-blue/10 transition-colors">
          <span data-editable="true"
            class="material-symbols-outlined text-5xl text-slate-400 group-hover:text-brand-blue transition-colors">water_heater</span>
        </div>
        <h4 data-editable="true" class="font-bold text-base">Water Heaters</h4>
        <p data-editable="true" class="text-xs text-slate-500">Repair &amp; Install</p>
      </div>
      <div class="text-center group cursor-pointer">
        <div
          class="w-24 h-24 mx-auto bg-slate-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-brand-blue/10 transition-colors">
          <span data-editable="true"
            class="material-symbols-outlined text-5xl text-slate-400 group-hover:text-brand-blue transition-colors">plumbing</span>
        </div>
        <h4 data-editable="true" class="font-bold text-base">Pipe Repair</h4>
        <p data-editable="true" class="text-xs text-slate-500">Durable fixes</p>
      </div>
      <div class="text-center group cursor-pointer">
        <div
          class="w-24 h-24 mx-auto bg-slate-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-brand-blue/10 transition-colors">
          <span data-editable="true"
            class="material-symbols-outlined text-5xl text-slate-400 group-hover:text-brand-blue transition-colors">home_repair_service</span>
        </div>
        <h4 data-editable="true" class="font-bold text-base">Installations</h4>
        <p data-editable="true" class="text-xs text-slate-500">Fixtures &amp; Appliances</p>
      </div>
    </div>
  </section>
  <!-- END: Horizontal Service Row -->
  <!-- BEGIN: Disrupt Section -->
  <section class="py-24 px-4 overflow-hidden" data-purpose="ProblemStatement">
    <div class="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
      <div class="space-y-8">
        <h2 data-editable="true" class="text-4xl lg:text-5xl font-bold leading-tight">
          Don't Let Plumbing Problems Disrupt Your Day
        </h2>
        <p data-editable="true" class="text-slate-600">
          Water damage spreads fast. Whether it's a tiny drip or a major burst, acting quickly saves you thousands in
          repairs.
        </p>
        <ul class="space-y-6">
          <li data-editable="true" class="flex gap-4">
            <div class="mt-1 w-6 h-6 rounded-full border-4 border-slate-100 bg-white flex-shrink-0"></div>
            <div>
              <h5 data-editable="true" class="font-bold">Hidden Leaks</h5>
              <p data-editable="true" class="text-sm text-slate-500">Silent leaks behind walls can cause structural damage and mold growth
                before you even notice them.</p>
            </div>
          </li>
          <li data-editable="true" class="flex gap-4">
            <div class="mt-1 w-6 h-6 rounded-full border-4 border-slate-100 bg-white flex-shrink-0"></div>
            <div>
              <h5 data-editable="true" class="font-bold">Clogged Drains</h5>
              <p data-editable="true" class="text-sm text-slate-500">Stubborn blockages lead to backflows, terrible odors, and unsanitary
                conditions in your home.</p>
            </div>
          </li>
          <li data-editable="true" class="flex gap-4">
            <div class="mt-1 w-6 h-6 rounded-full border-4 border-slate-100 bg-white flex-shrink-0"></div>
            <div>
              <h5 data-editable="true" class="font-bold">No Hot Water</h5>
              <p data-editable="true" class="text-sm text-slate-500">Failing water heaters disrupt your routine and can be dangerous if
                pressure builds up.</p>
            </div>
          </li>
        </ul>
      </div>
      <div class="relative">
        <!-- Image Mockups based on visual -->
        <div class="rounded-3xl overflow-hidden shadow-2xl">
          <img data-editable-img="true" alt="Plumber at work" class="w-full"
            src="/assets/templates/plumber/templates02/plumber.png" />
        </div>
      </div>
    </div>
  </section>
  <!-- END: Disrupt Section -->
  <!-- BEGIN: Services Grid -->
  <section class="py-24 bg-slate-50 px-4" data-purpose="ServicesGrid" id="services">
    <div class="max-w-7xl mx-auto text-center mb-16">
      <p data-editable="true" class="text-brand-blue font-bold uppercase tracking-widest text-xs mb-4">Our Expertise</p>
      <h2 data-editable="true" class="text-4xl font-bold">Comprehensive Plumbing <br /> Solutions for Every Need</h2>
    </div>
    <div class="max-w-6xl mx-auto grid md:grid-cols-2 gap-8"><!-- Card 1 -->
      <div class="bg-white p-8 rounded-3xl service-card-shadow hover:translate-y-[-4px] transition-all group">
        <div class="w-16 h-16 bg-orange-500 rounded-full mb-6 flex items-center justify-center"><span data-editable="true"
            class="material-symbols-outlined text-white text-4xl">emergency</span></div>
        <h3 data-editable="true" class="text-xl font-bold mb-4">Emergency Repair</h3>
        <p data-editable="true" class="text-slate-600 mb-8 text-sm">Available 24/7 for burst pipes, severe leaks, and major blockages that
          need immediate attention.</p>
        <a data-editable="true" class="inline-flex items-center text-sm font-bold group-hover:text-brand-blue" href="#">
          Learn More
          <svg class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor"
            viewbox="0 0 24 24">
            <path d="M17 8l4 4m0 0l-4 4m4-4H3" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
          </svg>
        </a>
      </div>
      <!-- Card 2 -->
      <div class="bg-white p-8 rounded-3xl service-card-shadow hover:translate-y-[-4px] transition-all group">
        <div class="w-16 h-16 bg-brand-blue rounded-full mb-6 flex items-center justify-center"><span data-editable="true"
            class="material-symbols-outlined text-white text-4xl">waves</span></div>
        <h3 data-editable="true" class="text-xl font-bold mb-4">Drain Cleaning</h3>
        <p data-editable="true" class="text-slate-600 mb-8 text-sm">Professional hydro-jetting and snaking to remove stubborn clogs and
          restore perfect flow.</p>
        <a data-editable="true" class="inline-flex items-center text-sm font-bold group-hover:text-brand-blue" href="#">
          Learn More
          <svg class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor"
            viewbox="0 0 24 24">
            <path d="M17 8l4 4m0 0l-4 4m4-4H3" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
          </svg>
        </a>
      </div>
      <!-- Card 3 -->
      <div class="bg-white p-8 rounded-3xl service-card-shadow hover:translate-y-[-4px] transition-all group">
        <div class="w-16 h-16 bg-indigo-500 rounded-full mb-6 flex items-center justify-center"><span data-editable="true"
            class="material-symbols-outlined text-white text-4xl">thermostat</span></div>
        <h3 data-editable="true" class="text-xl font-bold mb-4">Water Heaters</h3>
        <p data-editable="true" class="text-slate-600 mb-8 text-sm">Installation, repair, and maintenance for both tank and tankless water
          heating systems.</p>
        <a data-editable="true" class="inline-flex items-center text-sm font-bold group-hover:text-brand-blue" href="#">
          Learn More
          <svg class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor"
            viewbox="0 0 24 24">
            <path d="M17 8l4 4m0 0l-4 4m4-4H3" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
          </svg>
        </a>
      </div>
      <!-- Card 4 -->
      <div class="bg-white p-8 rounded-3xl service-card-shadow hover:translate-y-[-4px] transition-all group">
        <div class="w-16 h-16 bg-emerald-500 rounded-full mb-6 flex items-center justify-center"><span data-editable="true"
            class="material-symbols-outlined text-white text-4xl">plumbing</span></div>
        <h3 data-editable="true" class="text-xl font-bold mb-4">Pipe Replacement</h3>
        <p data-editable="true" class="text-slate-600 mb-8 text-sm">Comprehensive repiping services for aging, corroded, or damaged plumbing
          systems.</p>
        <a data-editable="true" class="inline-flex items-center text-sm font-bold group-hover:text-brand-blue" href="#">
          Learn More
          <svg class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor"
            viewbox="0 0 24 24">
            <path d="M17 8l4 4m0 0l-4 4m4-4H3" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
          </svg>
        </a>
      </div>
    </div>
  </section>
  <!-- END: Services Grid -->
  <!-- BEGIN: Trust Section -->
  <section class="py-24 px-4" data-purpose="TrustIndicators">
    <div class="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
      <div class="lg:w-1/3 bg-brand-blue p-12 rounded-3xl text-white">
        <h2 data-editable="true" class="text-4xl font-bold mb-6">Why Trust FlowTech?</h2>
        <p data-editable="true" class="text-brand-light/80 mb-8">We don't just fix pipes; we restore peace of mind. Our commitment to
          quality, transparency, and speed sets us apart.</p>
        <div class="h-1 w-12 bg-white/30"></div>
      </div>
      <div class="lg:w-2/3 grid sm:grid-cols-2 gap-6 bg-sky-50 border border-sky-100 rounded-3xl p-6 shadow-sm">
        <div class="p-8 bg-white border border-slate-100 rounded-2xl flex flex-col items-start gap-4">
          <div class="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center"><span data-editable="true"
              class="material-symbols-outlined text-brand-blue text-3xl">verified_user</span></div>
          <div>
            <h4 data-editable="true" class="font-bold mb-2">Licensed &amp; Insured</h4>
            <p data-editable="true" class="text-sm text-slate-500">Fully credentialed professionals protecting you and your property.</p>
          </div>
        </div>
        <div class="p-8 bg-white border border-slate-100 rounded-2xl flex flex-col items-start gap-4">
          <div class="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center"><span data-editable="true"
              class="material-symbols-outlined text-brand-blue text-3xl">schedule</span></div>
          <div>
            <h4 data-editable="true" class="font-bold mb-2">On-Time Guarantee</h4>
            <p data-editable="true" class="text-sm text-slate-500">We respect your time. If we're late, your service call is discounted.</p>
          </div>
        </div>
        <div class="p-8 bg-white border border-slate-100 rounded-2xl flex flex-col items-start gap-4">
          <div class="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center"><span data-editable="true"
              class="material-symbols-outlined text-brand-blue text-3xl">payments</span></div>
          <div>
            <h4 data-editable="true" class="font-bold mb-2">Upfront Pricing</h4>
            <p data-editable="true" class="text-sm text-slate-500">No hidden fees or surprises. You approve the price before we start.</p>
          </div>
        </div>
        <div class="p-8 bg-white border border-slate-100 rounded-2xl flex flex-col items-start gap-4">
          <div class="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center"><span data-editable="true"
              class="material-symbols-outlined text-brand-blue text-3xl">thumb_up</span></div>
          <div>
            <h4 data-editable="true" class="font-bold mb-2">Satisfaction Guaranteed</h4>
            <p data-editable="true" class="text-sm text-slate-500">We stand behind our work with a 100% satisfaction guarantee on all
              repairs.</p>
          </div>
        </div>
      </div>
    </div>
  </section>
  <!-- END: Trust Section -->
  <!-- BEGIN: How It Works -->
  <section class="py-24 bg-white px-4" data-purpose="ProcessTimeline">
    <div class="max-w-7xl mx-auto text-center mb-20">
      <h2 data-editable="true" class="text-4xl font-bold mb-4">How It Works</h2>
      <p data-editable="true" class="text-slate-500">A seamless, stress-free process from your first call to the final fix.</p>
    </div>
    <div class="max-w-5xl mx-auto relative px-4">
      <div class="hidden md:block step-line"></div>
      <div class="grid md:grid-cols-4 gap-8 relative z-10"><!-- Step 1 -->
        <div class="text-center group">
          <div
            class="w-20 h-20 rounded-full border-2 border-brand-blue step-circle mx-auto flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <span data-editable="true" class="text-brand-blue font-bold text-3xl">01</span>
          </div>
          <h4 data-editable="true" class="font-bold mb-2">Contact Us</h4>
          <p data-editable="true" class="text-xs text-slate-500 leading-relaxed">Call or fill out our online form to request immediate
            service.</p>
        </div>
        <!-- Step 2 -->
        <div class="text-center group">
          <div
            class="w-20 h-20 rounded-full border-2 step-circle mx-auto flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border-brand-blue">
            <span data-editable="true" class="font-bold text-brand-blue text-3xl">02</span>
          </div>
          <h4 data-editable="true" class="font-bold mb-2">Diagnosis</h4>
          <p data-editable="true" class="text-xs text-slate-500 leading-relaxed">Our expert arrives on time, inspects the issue, and provides
            a quote.</p>
        </div>
        <!-- Step 3 -->
        <div class="text-center group">
          <div
            class="w-20 h-20 rounded-full border-2 step-circle mx-auto flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border-brand-blue">
            <span data-editable="true" class="font-bold text-brand-blue text-3xl">03</span>
          </div>
          <h4 data-editable="true" class="font-bold mb-2">Expert Repair</h4>
          <p data-editable="true" class="text-xs text-slate-500 leading-relaxed">We fix the problem using premium materials and proven
            techniques.</p>
        </div>
        <!-- Step 4 -->
        <div class="text-center group">
          <div
            class="w-20 h-20 rounded-full border-2 step-circle mx-auto flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border-brand-blue">
            <span data-editable="true" class="font-bold text-brand-blue text-3xl">04</span>
          </div>
          <h4 data-editable="true" class="font-bold mb-2">Clean Up</h4>
          <p data-editable="true" class="text-xs text-slate-500 leading-relaxed">We leave your home cleaner than we found it, guaranteed.</p>
        </div>
      </div>
    </div>
  </section>
  <!-- END: How It Works -->
  <!-- BEGIN: Testimonials -->
  <section class="py-24 bg-slate-50 px-4" data-purpose="Testimonials">
    <div class="max-w-7xl mx-auto">
      <div class="flex justify-between items-end mb-12">
        <div>
          <h2 data-editable="true" class="text-4xl font-bold mb-4">Don't Just Take Our Word For It</h2>
          <p data-editable="true" class="text-slate-500">See what your neighbors are saying about our fast, reliable service.</p>
        </div>

      </div>
      <div class="grid md:grid-cols-2 gap-8">
        <div class="bg-white p-10 rounded-3xl shadow-sm border border-slate-100">
          <p data-editable="true" class="text-lg italic text-slate-700 mb-8">"FlowTech saved our home! A pipe burst at 2 AM on a Sunday. They
            were here in 20 minutes, stopped the leak instantly, and had everything fixed before sunrise. Incredibly
            professional."</p>
          <div class="flex items-center gap-4">
            <img data-editable-img="true" alt="Sarah Jenkins" class="w-12 h-12 rounded-full object-cover"
              src="/assets/templates/plumber/templates02/client-01.png" />
            <div>
              <p data-editable="true" class="font-bold">Sarah Jenkins</p>
              <p data-editable="true" class="text-xs text-slate-400">Homeowner, Westside</p>
            </div>
          </div>
        </div>
        <div class="bg-white p-10 rounded-3xl shadow-sm border border-slate-100">
          <p data-editable="true" class="text-lg italic text-slate-700 mb-8">"I've used three different plumbers in the past year, but
            FlowTech is the only one I'll call from now on. Transparent pricing, no mess left behind, and the tech
            explained everything clearly."</p>
          <div class="flex items-center gap-4">
            <img data-editable-img="true" alt="Michael Robertson" class="w-12 h-12 rounded-full object-cover"
              src="/assets/templates/plumber/templates02/client-02.png" />
            <div>
              <p data-editable="true" class="font-bold">Michael Robertson</p>
              <p data-editable="true" class="text-xs text-slate-400">Property Manager</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <!-- END: Testimonials -->
  <!-- BEGIN: Final CTA -->
  <section class="py-20 px-4" data-purpose="FinalCTA">
    <div class="max-w-7xl mx-auto">
      <div
        class="bg-brand-orange rounded-[2.5rem] p-8 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden">
        <!-- Decorative Circle -->
        <div class="absolute -top-24 -left-24 w-64 h-64 bg-white/10 rounded-full"></div>
        <div class="text-white space-y-6 relative z-10 text-center lg:text-left">
          <div class="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full">
            <span data-editable="true" class="w-2 h-2 bg-white rounded-full"></span>
            <span data-editable="true" class="text-[10px] font-bold uppercase tracking-wider">24/7 Emergency Dispatch</span>
          </div>
          <h2 data-editable="true" class="text-4xl lg:text-6xl font-bold leading-tight">Need a Plumber Right <br /> Now?</h2>
          <p data-editable="true" class="text-lg text-white/90">Don't wait for water damage to get worse. Our rapid response team is standing
            by to help.</p>
        </div>
        <div class="flex flex-col items-center gap-4 relative z-10">
          <a data-editable="true" class="bg-white text-slate-900 px-12 py-6 rounded-2xl text-2xl font-black shadow-xl hover:scale-105 transition-transform"
            href="tel:5551234567">
            (555) 123-4567
          </a>
          <p data-editable="true" class="text-white/80 font-medium text-sm">Response time under 30 minutes</p>
        </div>
      </div>
    </div>
  </section>
  <!-- END: Final CTA -->
  <!-- BEGIN: Footer -->
  <footer class="bg-brand-navy text-white pt-20 pb-10" data-purpose="MainFooter">
    <div class="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-white/10 pb-16 mb-8">
      <div class="col-span-1 md:col-span-1 space-y-6">
        <a class="logo flex items-center gap-2 text-white text-2xl font-bold tracking-tight" href="#">
          LOGO_PLACEHOLDER
        </a>
        <p data-editable="true" class="text-slate-400 text-sm leading-relaxed">
          Premium plumbing solutions for residential and commercial properties. Fast, reliable, and built to last.
        </p>

      </div>
      <div class="space-y-6">
        <h5 data-editable="true" class="font-bold text-lg">Services</h5>
        <ul class="space-y-4 text-slate-400 text-sm">
          <li data-editable="true"><a data-editable="true" class="hover:text-white transition-colors" href="#">Emergency Repair</a></li>
          <li data-editable="true"><a data-editable="true" class="hover:text-white transition-colors" href="#">Drain Cleaning</a></li>
          <li data-editable="true"><a data-editable="true" class="hover:text-white transition-colors" href="#">Water Heater Services</a></li>
          <li data-editable="true"><a data-editable="true" class="hover:text-white transition-colors" href="#">Pipe Replacement</a></li>
          <li data-editable="true"><a data-editable="true" class="hover:text-white transition-colors" href="#">Leak Detection</a></li>
        </ul>
      </div>
      <div class="space-y-6">
        <h5 data-editable="true" class="font-bold text-lg">Company</h5>
        <ul class="space-y-4 text-slate-400 text-sm">
          <li data-editable="true"><a data-editable="true" class="hover:text-white transition-colors" href="#">About Us</a></li>
          <li data-editable="true"><a data-editable="true" class="hover:text-white transition-colors" href="#">Our Team</a></li>
          <li data-editable="true"><a data-editable="true" class="hover:text-white transition-colors" href="#">Reviews</a></li>
          <li data-editable="true"><a data-editable="true" class="hover:text-white transition-colors" href="#">Service Areas</a></li>
          <li data-editable="true"><a data-editable="true" class="hover:text-white transition-colors" href="#">Contact</a></li>
        </ul>
      </div>
      <div class="space-y-6" id="contact">
        <h5 data-editable="true" class="font-bold text-lg">Contact Info</h5>
        <ul class="space-y-4 text-slate-400 text-sm">
          <li data-editable="true" class="flex gap-4">
            <svg class="w-6 h-6 text-brand-blue flex-shrink-0" fill="none" stroke="currentColor" viewbox="0 0 24 24">
              <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
              <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" stroke-linecap="round" stroke-linejoin="round"
                stroke-width="2"></path>
            </svg>
            <span data-editable="true" class="text-sm">123 Plumber Way, Suite 100, Service City, ST 12345</span>
          </li>
          <li data-editable="true" class="flex gap-4">
            <svg class="w-6 h-6 text-brand-blue flex-shrink-0" fill="none" stroke="currentColor" viewbox="0 0 24 24">
              <path
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
            </svg>
            <span data-editable="true" class="font-bold text-white text-base">(555) 123-4567</span>
          </li>
          <li data-editable="true" class="flex gap-4">
            <svg class="w-6 h-6 text-brand-blue flex-shrink-0" fill="none" stroke="currentColor" viewbox="0 0 24 24">
              <path
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
            </svg>
            <span data-editable="true" class="text-sm">support@flowtechplumbing.com</span>
          </li>
        </ul>
      </div>
    </div>
    <div
      class="max-w-7xl mx-auto px-4 flex flex-col md:row items-center justify-between gap-4 text-[10px] text-slate-500 uppercase tracking-widest">
      <p data-editable="true">© 2024 PROJECT_NAME_PLACEHOLDER. All rights reserved.</p>
      <p data-editable="true">Designed with care by FlowTech Digital</p>
    </div>
  </footer>
  <!-- END: Footer -->

<script>
document.getElementById('hero-form').addEventListener('submit', function (e) {
      e.preventDefault();
      alert('Thank you! Our team will contact you shortly.');
      this.reset();
    });

</script>

<script id="core-interactions">
  (function() {
    var isInEditor = !!document.querySelector('[data-gjs-type]') || document.body.classList.contains('gjs-dashed');
    document.addEventListener('submit', function(e) {
      if (e.target.tagName === 'FORM') {
        e.target.setAttribute('novalidate', 'true');
        var isValid = true;
        var inputs = e.target.querySelectorAll('input:not([type="submit"]):not([type="hidden"]):not([type="button"]), textarea, select');
        inputs.forEach(function(input) {
          if (!input.value.trim() && input.hasAttribute('required')) isValid = false;
        });
        if (!isValid || isInEditor) {
          e.preventDefault();
          e.stopImmediatePropagation();
        }
      }
    }, true);
  })();
</script>
`;
