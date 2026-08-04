// Auto-generated ULTRA-DYNAMIC template
// Generated: 2026-07-16T08:44:37.180Z
// ════════════════════════════════════════════════════════════════════════════
// Converted directly in the browser using Frontend JSZip Extraction
// ════════════════════════════════════════════════════════════════════════════

export const law06Styles = `
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

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  min-height: 100vh;
  font-family: 'Inter', system-ui, sans-serif;
  color: var(--secondary);
  background: #fff;
  -webkit-font-smoothing: antialiased;
}

h1, h2, h3, h4, h5 {
  font-family: 'Playfair Display', Georgia, serif;
  letter-spacing: -0.01em;
}
header{z-index: 99;}
::placeholder {color:#000;}
img {
  max-width: 100%;
  display: block;
}

a {
  color: inherit;
  text-decoration: none;
}

.grid {
  display: grid;
}

.flex {
  display: flex;
}

.inline-flex {
  display: inline-flex;
}

.inline-block {
  display: inline-block;
}

.relative {
  position: relative;
}

.absolute {
  position: absolute;
}

.fixed {
  position: fixed;
}

.hidden {
  display: none;
}

.justify-between {
  justify-content: space-between;
}

.justify-center {
  justify-content: center;
}

.items-center {
  align-items: center;
}

.items-start {
  align-items: flex-start;
}

.items-baseline {
  align-items: baseline;
}

.flex-wrap {
  flex-wrap: wrap;
}

.flex-col {
  flex-direction: column;
}

.place-items-center {
  place-items: center;
}

.gap-1 { gap: 0.25rem; }
.gap-2 { gap: 0.5rem; }
.gap-3 { gap: 0.75rem; }
.gap-4 { gap: 1rem; }
.gap-6 { gap: 1.5rem; }
.gap-8 { gap: 2rem; }
.gap-9 { gap: 2.25rem; }
.gap-10 { gap: 2.5rem; }
.gap-px { gap: 1px; }

.mx-auto {
  margin-left: auto;
  margin-right: auto;
}

.mb-3 { margin-bottom: 0.75rem; }
.mb-4 { margin-bottom: 1rem; }
.mb-5 { margin-bottom: 1.25rem; }
.mb-6 { margin-bottom: 1.5rem; }
.mb-8 { margin-bottom: 2rem; }
.mb-10 { margin-bottom: 2.5rem; }

.mt-6 { margin-top: 1.5rem; }
.mt-12 { margin-top: 3rem; }
.mt-14 { margin-top: 3.5rem; }
.mt-16 { margin-top: 4rem; }
.mt-0.5 { margin-top: 0.125rem; }

.pt-4 { padding-top: 1rem; }
.pt-28 { padding-top: 7rem; }

.pb-6 { padding-bottom: 1.5rem; }
.pb-12 { padding-bottom: 3rem; }

.p-6 { padding: 1.5rem; }
.p-8 { padding: 2rem; }

.px-3 { padding-left: 0.75rem; padding-right: 0.75rem; }
.px-4 { padding-left: 1rem; padding-right: 1rem; }
.px-5 { padding-left: 1.25rem; padding-right: 1.25rem; }
.px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
.px-8 { padding-left: 2rem; padding-right: 2rem; }

.py-1\.5 { padding-top: 0.375rem; padding-bottom: 0.375rem; }
.py-2\.5 { padding-top: 0.625rem; padding-bottom: 0.625rem; }
.py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
.py-3\.5 { padding-top: 0.875rem; padding-bottom: 0.875rem; }
.py-4 { padding-top: 1rem; padding-bottom: 1rem; }
.py-5 { padding-top: 1.25rem; padding-bottom: 1.25rem; }
.py-6 { padding-top: 1.5rem; padding-bottom: 1.5rem; }
.py-16 { padding-top: 4rem; padding-bottom: 4rem; }
.py-20 { padding-top: 5rem; padding-bottom: 5rem; }
.py-24 { padding-top: 6rem; padding-bottom: 6rem; }

.max-w-7xl { max-width: 80rem; }
.max-w-3xl { max-width: 48rem; }
.max-w-2xl { max-width: 42rem; }
.max-w-xl { max-width: 36rem; }

.min-h-screen { min-height: 100vh; }

.h-1\.5 { height: 0.375rem; }
.h-4 { height: 1rem; }
.h-5 { height: 1.25rem; }
.h-6 { height: 1.5rem; }
.h-7 { height: 1.75rem; }
.h-9 { height: 2.25rem; }
.h-10 { height: 2.5rem; }
.h-12 { height: 3rem; }
.h-14 { height: 3.5rem; }
.h-20 { height: 5rem; }
.h-32 { height: 8rem; }
.h-full { height: 100%; }
.h-\[600px\] { height: 600px; }

.w-1\.5 { width: 0.375rem; }
.w-4 { width: 1rem; }
.w-5 { width: 1.25rem; }
.w-6 { width: 1.5rem; }
.w-7 { width: 1.75rem; }
.w-9 { width: 2.25rem; }
.w-10 { width: 2.5rem; }
.w-12 { width: 3rem; }
.w-14 { width: 3.5rem; }
.w-16 { width: 4rem; }
.w-20 { width: 5rem; }
.w-32 { width: 8rem; }
.w-full { width: 100%; }

.max-w-full { max-width: 100%; }

.inset-0 { top: 0; right: 0; bottom: 0; left: 0; }
.inset-x-0 { left: 0; right: 0; }
.top-0 { top: 0; }
.right-4 { right: 1rem; }
.right-6 { right: 1.5rem; }
.-right-4 { right: -1rem; }
.-right-6 { right: -1.5rem; }
.-bottom-6 { bottom: -1.5rem; }

.bottom-6 { bottom: 1.5rem; }

.justify-center { justify-content: center; }

.overflow-hidden { overflow: hidden; }

.rounded-full { border-radius: 9999px; }

.border { border-width: 1px; border-style: solid; border-color: var(--color-gray-200); }
.border-none{border:0px;}
.border-2 { border-width: 2px; }
.border-t { border-top-width: 1px; }
.border-t-2 { border-top-width: 2px; }
.border-t-4 { border-top-width: 4px; }
.border-y { border-top-width: 1px; border-bottom-width: 1px; }

.text-xs { font-size: 0.75rem; line-height: 1rem; }
.text-sm { font-size: 0.875rem; line-height: 1.25rem; }
.text-lg { font-size: 1.125rem; line-height: 1.75rem; }
.text-xl { font-size: 1.25rem; line-height: 1.75rem; }
.text-2xl { font-size: 1.5rem; line-height: 2rem; }
.text-4xl { font-size: 2.25rem; line-height: 2.5rem; }
.text-5xl { font-size: 3rem; line-height: 1; }
.text-7xl { font-size: 4.5rem; line-height: 1; }

.font-serif { font-family: 'Playfair Display', Georgia, serif; }
.font-medium { font-weight: 500; }
.font-semibold { font-weight: 600; }
.font-bold { font-weight: 700; }

.uppercase { text-transform: uppercase; }
.italic { font-style: italic; }
.leading-tight { line-height: 1.1; }
.leading-none { line-height: 1; }
.leading-relaxed { line-height: 1.75; }
.tracking-wide { letter-spacing: 0.04em; }
.tracking-wider { letter-spacing: 0.08em; }

.text-center { text-align: center; }

.hover\:text-gold:hover { color: var(--primary); }
.hover\:text-navy-deep:hover { color: #0c1426; }
.hover\:text-secondary:hover { color: var(--secondary); }
.hover\:bg-gold:hover { background-color: var(--primary); }
.hover\:bg-gradient-gold:hover { background: var(--primary); }
.hover\:bg-navy:hover { background-color: var(--secondary); }
.hover\:border-gold:hover { border-color: var(--primary); }
.hover\:shadow-elegant:hover { box-shadow: 0 30px 60px -20px rgba(12,20,38,.35); }
.hover\:shadow-gold:hover { box-shadow: 0 14px 30px -12px rgba(PRIMARY_RGB_PLACEHOLDER,.45); }

.group:hover [class~="group-hover:bg-gold"] { background-color: var(--primary); }
.group:hover [class~="group-hover:bg-gold/40"] { background-color: rgba(PRIMARY_RGB_PLACEHOLDER,.4); }
.group:hover [class~="group-hover:text-navy-deep"] { color: #0c1426; }
.group:hover [class~="group-hover:text-secondary"] { color: rgba(SECONDARY_RGB_PLACEHOLDER,.75); }
.group:hover [class~="group-hover:opacity-100"] { opacity: 1; }

.focus\:outline-none:focus { outline: none; }
.focus\:border-gold:focus { border-color: var(--primary); }

.transition-smooth {
  transition: all .35s cubic-bezier(.4,0,.2,1);
}

.bg-gradient-hero {
  background: linear-gradient(135deg,#0c1426 0%,SECONDARY_COLOR_PLACEHOLDER 60%,#243353 100%);
}

.bg-gradient-overlay {
  background: linear-gradient(90deg, rgba(12,20,38,.92) 0%, rgba(SECONDARY_RGB_PLACEHOLDER,.75) 60%, rgba(SECONDARY_RGB_PLACEHOLDER,.35) 100%);
}

.bg-gradient-gold {
  background-color: var(--primary);
}
.bg-primary { background-color: var(--primary); }

.animate-fade-up {
  animation: fadeUp .7s ease-out both;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.dot-grid {
  background-image: radial-gradient(circle at 1px 1px, PRIMARY_COLOR_PLACEHOLDER 1px, transparent 0);
  background-size: 32px 32px;
}

.stripe-bg {
  background-image: linear-gradient(45deg, PRIMARY_COLOR_PLACEHOLDER 25%, transparent 25%, transparent 75%, PRIMARY_COLOR_PLACEHOLDER 75%);
  background-size: 60px 60px;
}

.bg-white { background-color: #fff; }
.bg-cream { background-color: #f7f3ea; }
.bg-gold { background-color: var(--primary); }
.bg-gray-200 { background-color: #e5e7eb; }
.bg-navy { background-color: var(--secondary); }
.bg-navy-deep { background-color: #0c1426; }

[class~="bg-white/98"] { background-color: rgba(255,255,255,.98); }
[class~="bg-cream/60"] { background-color: rgba(247,243,234,.6); }
[class~="bg-gold/20"] { background-color: rgba(PRIMARY_RGB_PLACEHOLDER,.2); }
[class~="bg-gold/40"] { background-color: rgba(PRIMARY_RGB_PLACEHOLDER,.4); }
[class~="bg-navy-deep/40"] { background-color: rgba(12,20,38,.4); }
[class~="bg-gradient-gold"] { background-color: var(--primary); }
[class~="bg-gradient-overlay"] { background: linear-gradient(90deg, rgba(12,20,38,.92) 0%, rgba(SECONDARY_RGB_PLACEHOLDER,.75) 60%, rgba(SECONDARY_RGB_PLACEHOLDER,.35) 100%); }

.text-gold { color: var(--primary); }
.text-navy { color: var(--secondary); }
.text-navy-deep { color: #0c1426; }
.text-gray-500 { color: #6b7280; }
.text-gray-600 { color: #4b5563; }
.text-gray-700 { color: #374151; }
.text-white { color: #fff; }
.text-xl { font-size: 1.25rem; line-height: 1.75rem; }

[class~="text-[SECONDARY_COLOR_PLACEHOLDER]"] { color: SECONDARY_COLOR_PLACEHOLDER; }
[class~="text-gold/20"] { color: rgba(PRIMARY_RGB_PLACEHOLDER,.2); }
[class~="text-gold/40"] { color: rgba(PRIMARY_RGB_PLACEHOLDER,.4); }
[class~="text-navy/70"] { color: rgba(SECONDARY_RGB_PLACEHOLDER,.7); }
[class~="text-white/85"] { color: rgba(255,255,255,.85); }
[class~="text-white/90"] { color: rgba(255,255,255,.9); }
[class~="text-white/80"] { color: rgba(255,255,255,.8); }
[class~="text-white/75"] { color: rgba(255,255,255,.75); }
[class~="text-white/70"] { color: rgba(255,255,255,.7); }
[class~="text-white/60"] { color: rgba(255,255,255,.6); }
[class~="text-white/45"] { color: rgba(255,255,255,.45); }

.border-gold {  border-top:solid 5px PRIMARY_COLOR_PLACEHOLDER; }
.border-gray-200 { border-color: #e5e7eb; }
[class~="border-white/10"] { border-color: rgba(255,255,255,.1); }
[class~="border-white/15"] { border-color: rgba(255,255,255,.15); }
[class~="border-gold/30"] { border-color: rgba(PRIMARY_RGB_PLACEHOLDER,.3); }
[class~="border-gold/40"] { border-color: rgba(PRIMARY_RGB_PLACEHOLDER,.4); }
[class~="border-gold/50"] { border-color: rgba(PRIMARY_RGB_PLACEHOLDER,.5); }

.opacity-0 { opacity: 0; }
.opacity-10 { opacity: 0.1; }
[class~="opacity-[0.04]"] { opacity: 0.04; }

.border-y { border-top-width: 1px; border-bottom-width: 1px; border-style: solid; border-color: #e5e7eb; }

.object-cover { object-fit: cover; }

/* Footer links default white */
footer a { color: rgba(255,255,255,.8); }

.backdrop-blur { backdrop-filter: blur(12px); background-color: SECONDARY_COLOR_PLACEHOLDER; }

.text-[SECONDARY_COLOR_PLACEHOLDER] { color: SECONDARY_COLOR_PLACEHOLDER; }

[class~="tracking-[0.25em]"] { letter-spacing: 0.25em; }
[class~="tracking-[0.3em]"] { letter-spacing: 0.3em; }
[class~="leading-[1.05]"] { line-height: 1.05; }

@media (min-width: 768px) {
  [class~="md:block"] { display: block; }
  [class~="md:inline"] { display: inline; }
  [class~="md:flex-row"] { flex-direction: row; }
  [class~="md:grid-cols-2"] { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  [class~="md:grid-cols-3"] { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  [class~="md:grid-cols-5"] { grid-template-columns: repeat(5, minmax(0, 1fr)); }
  [class~="md:p-7"] { padding: 1.75rem; }
  [class~="md:text-5xl"] { font-size: 3rem; line-height: 1; }
  [class~="md:text-6xl"] { font-size: 3.75rem; line-height: 1; }
}

@media (min-width: 1024px) {
  [class~="lg:flex"] { display: flex; }
  [class~="lg:block"] { display: block; }
  [class~="lg:hidden"] { display: none; }
  [class~="lg:grid-cols-2"] { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  [class~="lg:grid-cols-3"] { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  [class~="lg:grid-cols-4"] { grid-template-columns: repeat(4, minmax(0, 1fr)); }
  [class~="lg:grid-cols-6"] { grid-template-columns: repeat(6, minmax(0, 1fr)); }
  [class~="lg:text-7xl"] { font-size: 4.5rem; line-height: 1; }
}
`;

export const law06Html = `
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link
    href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap"
    rel="stylesheet">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

<!-- Header -->
  <header id="hdr" class="fixed top-0 inset-x-0 z-50 transition-smooth">
    <div class="max-w-7xl mx-auto px-6 flex items-center justify-between py-4">
      <a data-editable="true" href="javascript:void(0);" class="flex items-center gap-2 text-white">
        LOGO_PLACEHOLDER
      </a>
   
      <div class="hidden lg:flex items-center gap-4">
        <a data-editable="true" href="tel:+18005550199" class="flex items-center gap-2 text-white/90 hover:text-gold transition-smooth">
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path
              d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0 1 22 16.92z" />
          </svg>
          <span data-editable="true" class="text-sm font-medium">(800) 555-0199</span>
        </a>
        <a data-editable="true" href="javascript:void(0);"
          class="bg-primary text-white px-5 py-2.5 text-sm font-semibold uppercase tracking-wider hover:shadow-gold transition-smooth">Free
          Consultation</a>
      </div>
      <button data-editable="true" id="menuBtn" class="lg:hidden text-white border-none" aria-label="Menu">
        <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>
    </div>
    <div id="mobileMenu" class="lg:hidden hidden bg-navy-deep border-t border-white/10">
      <div class="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-4">
        <a data-editable="true" href="javascript:void(0);" class="text-white/90 hover:text-gold">Home</a>
        <a data-editable="true" href="javascript:void(0);" class="text-white/90 hover:text-gold">Practice Areas</a>
        <a data-editable="true" href="javascript:void(0);" class="text-white/90 hover:text-gold">About</a>
        <a data-editable="true" href="javascript:void(0);" class="text-white/90 hover:text-gold">Attorneys</a>
        <a data-editable="true" href="javascript:void(0);" class="text-white/90 hover:text-gold">Contact</a>
        <a data-editable="true" href="javascript:void(0);"
          class="bg-primary text-white px-5 py-3 text-sm font-semibold uppercase tracking-wider text-center">Free
          Consultation</a>
      </div>
    </div>
  </header>

  <!-- Hero -->
  <section id="home" class="relative min-h-screen flex items-center pt-28 pb-12 overflow-hidden">
    <img data-editable-img="true" src="/assets/templates/LawFirm/templates06/hero-image.png"
      alt="Law office" class="absolute inset-0 h-full w-full object-cover" />
    <div class="absolute inset-0 bg-gradient-overlay"></div>
    <div class="max-w-7xl mx-auto px-6 relative z-10 w-full">
      <div class="max-w-3xl text-white animate-fade-up">
        <div class="inline-flex items-center gap-2 border border-gold/40 bg-navy-deep/40 px-4 py-1.5 mb-6">
          <span data-editable="true" class="h-1.5 w-1.5 bg-gold rounded-full"></span>
          <span data-editable="true" class="text-xs uppercase tracking-[0.25em] text-gold">Trusted Since 1992</span>
        </div>
        <h1 data-editable="true" class="font-serif text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] mb-6">
          Trusted Legal <br />Representation <span data-editable="true" class="text-gold italic">You Can Rely On</span>
        </h1>
        <p data-editable="true" class="text-lg text-white/80 max-w-xl mb-8 leading-relaxed">
          Three decades of unwavering advocacy. Our award-winning attorneys deliver decisive results with the discretion
          and dedication every client deserves.
        </p>
        <div class="flex flex-wrap gap-8 mb-10">
          <div class="flex items-center gap-3">
            <span data-editable="true" class="grid h-10 w-10 place-items-center border border-gold/50 text-gold">
              <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="8" r="6" />
                <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
              </svg>
            </span>
            <div>
              <div class="font-serif text-2xl font-bold">32+</div>
              <div class="text-xs uppercase tracking-wider text-white/70">Years of Practice</div>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <span data-editable="true" class="grid h-10 w-10 place-items-center border border-gold/50 text-gold">
              <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </span>
            <div>
              <div class="font-serif text-2xl font-bold">98%</div>
              <div class="text-xs uppercase tracking-wider text-white/70">Success Rate</div>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <span data-editable="true" class="grid h-10 w-10 place-items-center border border-gold/50 text-gold">
              <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="12 2 15 8.5 22 9.3 17 14 18.2 21 12 17.8 5.8 21 7 14 2 9.3 9 8.5 12 2" />
              </svg>
            </span>
            <div>
              <div class="font-serif text-2xl font-bold">2,400+</div>
              <div class="text-xs uppercase tracking-wider text-white/70">Cases Won</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Horizontal Consultation Form -->
      <form id="consult" onsubmit="event.preventDefault();alert('Thank you. We will contact you within 24 hours.');"
        class="relative mt-12 backdrop-blur shadow-elegant border-t-4 border-gold p-6 md:p-7 animate-fade-up border-gold">
        <div class="flex items-baseline justify-between mb-5">
          <h3 data-editable="true" class="font-serif text-xl font-semibold text-gold">Request a Free Consultation</h3>
          <span data-editable="true" class="hidden md:inline text-xs uppercase tracking-wider text-gray-500">100% Confidential</span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-5 gap-3">
          <input required placeholder="Full Name"
            class="h-12 bg-white border border-gray-200 px-4 text-sm focus:outline-none focus:border-gold transition-smooth border-none" name="name" id="name"/>
          <input required type="tel" placeholder="Phone Number"
            class="h-12 bg-white border border-gray-200 px-4 text-sm focus:outline-none focus:border-gold transition-smooth border-none" name="phone" id="phone"/>
          <input required type="email" placeholder="Email Address"
            class="h-12 bg-white border border-gray-200 px-4 text-sm focus:outline-none focus:border-gold transition-smooth border-none" name="email_address" id="email_address" />
          <select required
            class="h-12 bg-white border border-gray-200 px-4 text-sm focus:outline-none focus:border-gold transition-smooth border-none" name="services" id="services">
            <option value="">Case Type</option>
            <option>Criminal Law</option>
            <option>Civil Litigation</option>
            <option>Family Law</option>
            <option>Corporate Law</option>
            <option>Real Estate Law</option>
          </select>
          <button data-editable="true" type="submit"
            class="h-12 bg-primary text-white font-semibold text-sm uppercase tracking-wider hover:shadow-gold transition-smooth border-none">Get
            Consultation</button>
        </div>
      </form>
    </div>
  </section>

  <!-- Practice Areas -->
  <section id="practice" class="py-24 bg-cream">
    <div class="max-w-7xl mx-auto px-6">
      <div class="max-w-2xl mx-auto text-center">
        <div class="text-xs uppercase tracking-[0.3em] text-gold mb-4">Our Expertise</div>
        <h2 data-editable="true" class="font-serif text-4xl md:text-5xl font-bold mb-5">Practice Areas</h2>
        <div class="h-px w-16 bg-gold mx-auto mb-5"></div>
        <p data-editable="true" class="text-gray-600 leading-relaxed">Comprehensive legal services delivered with precision, integrity, and
          an uncompromising commitment to our clients.</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-200 mt-14">
        <!-- card -->
        <div class="group bg-white p-8 transition-smooth hover:bg-navy hover:text-secondary cursor-pointer">
          <div
            class="grid h-14 w-14 place-items-center bg-cream text-navy group-hover:bg-gold group-hover:text-navy-deep transition-smooth mb-6">
            <svg class="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="m14 13-7.5 7.5c-.83.83-2.17.83-3 0 0 0 0 0 0 0a2.12 2.12 0 0 1 0-3L11 10" />
              <path d="m16 16 6-6" />
              <path d="m8 8 6-6" />
              <path d="m9 7 8 8" />
              <path d="m21 11-8-8" />
            </svg></div>
          <h3 data-editable="true" class="font-serif text-2xl font-semibold mb-3">Criminal Defense</h3>
          <p data-editable="true" class="text-sm leading-relaxed text-gray-600 group-hover:text-secondary">Aggressive defense for felony,
            misdemeanor, and federal charges.</p>
          <div
            class="mt-6 text-xs uppercase tracking-[0.25em] text-gold opacity-0 group-hover:opacity-100 transition-smooth">
            Learn More →</div>
        </div>
        <div class="group bg-white p-8 transition-smooth hover:bg-navy hover:text-secondary cursor-pointer">
          <div
            class="grid h-14 w-14 place-items-center bg-cream text-navy group-hover:bg-gold group-hover:text-navy-deep transition-smooth mb-6">
            <svg class="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg></div>
          <h3 data-editable="true" class="font-serif text-2xl font-semibold mb-3">Family Law</h3>
          <p data-editable="true" class="text-sm leading-relaxed text-gray-600 group-hover:text-secondary">Compassionate counsel for divorce,
            custody, and estate matters.</p>
          <div
            class="mt-6 text-xs uppercase tracking-[0.25em] text-gold opacity-0 group-hover:opacity-100 transition-smooth">
            Learn More →</div>
        </div>
        <div class="group bg-white p-8 transition-smooth hover:bg-navy hover:text-secondary cursor-pointer">
          <div
            class="grid h-14 w-14 place-items-center bg-cream text-navy group-hover:bg-gold group-hover:text-navy-deep transition-smooth mb-6">
            <svg class="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
              <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
              <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
            </svg></div>
          <h3 data-editable="true" class="font-serif text-2xl font-semibold mb-3">Corporate Law</h3>
          <p data-editable="true" class="text-sm leading-relaxed text-gray-600 group-hover:text-secondary">Strategic guidance for businesses,
            mergers, and compliance.</p>
          <div
            class="mt-6 text-xs uppercase tracking-[0.25em] text-gold opacity-0 group-hover:opacity-100 transition-smooth">
            Learn More →</div>
        </div>
        <div class="group bg-white p-8 transition-smooth hover:bg-navy hover:text-secondary cursor-pointer">
          <div
            class="grid h-14 w-14 place-items-center bg-cream text-navy group-hover:bg-gold group-hover:text-navy-deep transition-smooth mb-6">
            <svg class="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg></div>
          <h3 data-editable="true" class="font-serif text-2xl font-semibold mb-3">Real Estate Law</h3>
          <p data-editable="true" class="text-sm leading-relaxed text-gray-600 group-hover:text-secondary">Trusted representation for
            transactions, disputes, and zoning.</p>
          <div
            class="mt-6 text-xs uppercase tracking-[0.25em] text-gold opacity-0 group-hover:opacity-100 transition-smooth">
            Learn More →</div>
        </div>
        <div class="group bg-white p-8 transition-smooth hover:bg-navy hover:text-secondary cursor-pointer">
          <div
            class="grid h-14 w-14 place-items-center bg-cream text-navy group-hover:bg-gold group-hover:text-navy-deep transition-smooth mb-6">
            <svg class="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect width="20" height="14" x="2" y="7" rx="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg></div>
          <h3 data-editable="true" class="font-serif text-2xl font-semibold mb-3">Civil Litigation</h3>
          <p data-editable="true" class="text-sm leading-relaxed text-gray-600 group-hover:text-secondary">Decisive advocacy in complex
            commercial and civil disputes.</p>
          <div
            class="mt-6 text-xs uppercase tracking-[0.25em] text-gold opacity-0 group-hover:opacity-100 transition-smooth">
            Learn More →</div>
        </div>
        <div class="group bg-white p-8 transition-smooth hover:bg-navy hover:text-secondary cursor-pointer">
          <div
            class="grid h-14 w-14 place-items-center bg-cream text-navy group-hover:bg-gold group-hover:text-navy-deep transition-smooth mb-6">
            <svg class="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="9" y1="13" x2="15" y2="13" />
              <line x1="9" y1="17" x2="15" y2="17" />
            </svg></div>
          <h3 data-editable="true" class="font-serif text-2xl font-semibold mb-3">Estate Planning</h3>
          <p data-editable="true" class="text-sm leading-relaxed text-gray-600 group-hover:text-secondary">Protect your legacy with wills,
            trusts, and probate guidance.</p>
          <div
            class="mt-6 text-xs uppercase tracking-[0.25em] text-gold opacity-0 group-hover:opacity-100 transition-smooth">
            Learn More →</div>
        </div>
      </div>
    </div>
  </section>

  <!-- Why Choose Us -->
  <section id="about" class="py-24 bg-white">
    <div class="max-w-7xl mx-auto px-6">
      <div class="max-w-2xl mx-auto text-center">
        <div class="text-xs uppercase tracking-[0.3em] text-gold mb-4">Why Choose Us</div>
        <h2 data-editable="true" class="font-serif text-4xl md:text-5xl font-bold mb-5">The Standard of Excellence</h2>
        <div class="h-px w-16 bg-gold mx-auto mb-5"></div>
        <p data-editable="true" class="text-gray-600 leading-relaxed">What sets our firm apart is not just what we do — but how we do it.</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-14">
        <div class="text-center group">
          <div class="relative inline-block mb-6">
            <div class="absolute inset-0 bg-gold/20 blur-xl group-hover:bg-gold/40 transition-smooth"></div>
            <div
              class="relative grid h-20 w-20 place-items-center bg-navy text-gold border border-gold/30 group-hover:bg-gold group-hover:text-navy-deep transition-smooth">
              <svg class="h-9 w-9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="8" r="6" />
                <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
              </svg></div>
          </div>
          <h3 data-editable="true" class="font-serif text-xl font-semibold mb-3">Experienced Attorneys</h3>
          <p data-editable="true" class="text-sm text-gray-600 leading-relaxed">Three decades of courtroom expertise across complex legal
            matters.</p>
        </div>
        <div class="text-center group">
          <div class="relative inline-block mb-6">
            <div class="absolute inset-0 bg-gold/20 blur-xl group-hover:bg-gold/40 transition-smooth"></div>
            <div
              class="relative grid h-20 w-20 place-items-center bg-navy text-gold border border-gold/30 group-hover:bg-gold group-hover:text-navy-deep transition-smooth">
              <svg class="h-9 w-9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="6" />
                <circle cx="12" cy="12" r="2" />
              </svg></div>
          </div>
          <h3 data-editable="true" class="font-serif text-xl font-semibold mb-3">Proven Results</h3>
          <p data-editable="true" class="text-sm text-gray-600 leading-relaxed">A 98% success rate built on meticulous strategy and tireless
            advocacy.</p>
        </div>
        <div class="text-center group">
          <div class="relative inline-block mb-6">
            <div class="absolute inset-0 bg-gold/20 blur-xl group-hover:bg-gold/40 transition-smooth"></div>
            <div
              class="relative grid h-20 w-20 place-items-center bg-navy text-gold border border-gold/30 group-hover:bg-gold group-hover:text-navy-deep transition-smooth">
              <svg class="h-9 w-9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect width="18" height="11" x="3" y="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg></div>
          </div>
          <h3 data-editable="true" class="font-serif text-xl font-semibold mb-3">Absolute Confidentiality</h3>
          <p data-editable="true" class="text-sm text-gray-600 leading-relaxed">Your privacy is protected with the strictest professional
            discretion.</p>
        </div>
        <div class="text-center group">
          <div class="relative inline-block mb-6">
            <div class="absolute inset-0 bg-gold/20 blur-xl group-hover:bg-gold/40 transition-smooth"></div>
            <div
              class="relative grid h-20 w-20 place-items-center bg-navy text-gold border border-gold/30 group-hover:bg-gold group-hover:text-navy-deep transition-smooth">
              <svg class="h-9 w-9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 12h2l3-3-2-2-3 3v2z" />
                <path d="M16 8l3-3" />
                <path d="M2 22l4-4" />
                <path d="M9 15l-7 7" />
                <path d="M14 9l7 7-3 3-7-7" />
              </svg></div>
          </div>
          <h3 data-editable="true" class="font-serif text-xl font-semibold mb-3">Personalized Service</h3>
          <p data-editable="true" class="text-sm text-gray-600 leading-relaxed">Every client receives direct attention from a dedicated
            senior attorney.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Process -->
  <section class="py-24 bg-navy-deep relative overflow-hidden">
    <div class="absolute inset-0 dot-grid opacity-[0.04]"></div>
    <div class="max-w-7xl mx-auto px-6 relative">
      <div class="max-w-2xl mx-auto text-center">
        <div class="text-xs uppercase tracking-[0.3em] text-gold mb-4">Our Process</div>
        <h2 data-editable="true" class="font-serif text-4xl md:text-5xl font-bold mb-5 text-white">A Clear Path Forward</h2>
        <div class="h-px w-16 bg-gold mx-auto mb-5"></div>
        <p data-editable="true" class="text-white/75 leading-relaxed">A proven, four-step approach that brings clarity and confidence to
          every case.</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16 relative">
        <div class="relative">
          <div class="font-serif text-7xl font-bold text-gold/20 leading-none mb-4">01</div>
          <div class="h-px w-12 bg-gold mb-4"></div>
          <h3 data-editable="true" class="font-serif text-2xl font-semibold text-white mb-3">Consultation</h3>
          <p data-editable="true" class="text-sm text-white/70 leading-relaxed">A confidential conversation to understand your situation and
            objectives.</p>
          <div class="hidden lg:block absolute top-8 -right-4 text-gold/40 text-2xl">→</div>
        </div>
        <div class="relative">
          <div class="font-serif text-7xl font-bold text-gold/20 leading-none mb-4">02</div>
          <div class="h-px w-12 bg-gold mb-4"></div>
          <h3 data-editable="true" class="font-serif text-2xl font-semibold text-white mb-3">Case Evaluation</h3>
          <p data-editable="true" class="text-sm text-white/70 leading-relaxed">Thorough analysis of facts, evidence, and applicable legal
            precedent.</p>
          <div class="hidden lg:block absolute top-8 -right-4 text-gold/40 text-2xl">→</div>
        </div>
        <div class="relative">
          <div class="font-serif text-7xl font-bold text-gold/20 leading-none mb-4">03</div>
          <div class="h-px w-12 bg-gold mb-4"></div>
          <h3 data-editable="true" class="font-serif text-2xl font-semibold text-white mb-3">Legal Strategy</h3>
          <p data-editable="true" class="text-sm text-white/70 leading-relaxed">A tailored approach designed for the strongest possible
            outcome.</p>
          <div class="hidden lg:block absolute top-8 -right-4 text-gold/40 text-2xl">→</div>
        </div>
        <div class="relative">
          <div class="font-serif text-7xl font-bold text-gold/20 leading-none mb-4">04</div>
          <div class="h-px w-12 bg-gold mb-4"></div>
          <h3 data-editable="true" class="font-serif text-2xl font-semibold text-white mb-3">Representation</h3>
          <p data-editable="true" class="text-sm text-white/70 leading-relaxed">Decisive advocacy from negotiation through trial and beyond.
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- Testimonials -->
  <section class="py-24 bg-cream">
    <div class="max-w-7xl mx-auto px-6">
      <div class="max-w-2xl mx-auto text-center">
        <div class="text-xs uppercase tracking-[0.3em] text-gold mb-4">Client Stories</div>
        <h2 data-editable="true" class="font-serif text-4xl md:text-5xl font-bold mb-5">What Our Clients Say</h2>
        <div class="h-px w-16 bg-gold mx-auto mb-5"></div>
        <p data-editable="true" class="text-gray-600 leading-relaxed">Trust earned through results — and the people whose lives we've helped
          restore.</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-14">
        <div class="bg-white p-8 shadow-card border-t-2 border-gold relative hover:shadow-elegant transition-smooth">
          <div class="flex gap-1 text-gold mb-4">
            <span data-editable="true">★</span><span data-editable="true">★</span><span data-editable="true">★</span><span data-editable="true">★</span><span data-editable="true">★</span>
          </div>
          <p data-editable="true" class="text-gray-700 leading-relaxed mb-6 italic">"Their team navigated our merger with surgical precision.
            Outcome exceeded every expectation we had set."</p>
          <div class="pt-4 border-t border-gray-200">
            <div class="font-serif text-lg font-semibold">Sarah M.</div>
            <div class="text-xs uppercase tracking-wider text-gray-500">Corporate Client</div>
          </div>
        </div>
        <div class="bg-white p-8 shadow-card border-t-2 border-gold relative hover:shadow-elegant transition-smooth">
          <div class="flex gap-1 text-gold mb-4"><span data-editable="true">★</span><span data-editable="true">★</span><span data-editable="true">★</span><span data-editable="true">★</span><span data-editable="true">★</span>
          </div>
          <p data-editable="true" class="text-gray-700 leading-relaxed mb-6 italic">"When everything was on the line, they fought
            relentlessly. I owe my future to their dedication and skill."</p>
          <div class="pt-4 border-t border-gray-200">
            <div class="font-serif text-lg font-semibold">James R.</div>
            <div class="text-xs uppercase tracking-wider text-gray-500">Criminal Defense</div>
          </div>
        </div>
        <div class="bg-white p-8 shadow-card border-t-2 border-gold relative hover:shadow-elegant transition-smooth">
          <div class="flex gap-1 text-gold mb-4"><span data-editable="true">★</span><span data-editable="true">★</span><span data-editable="true">★</span><span data-editable="true">★</span><span data-editable="true">★</span>
          </div>
          <p data-editable="true" class="text-gray-700 leading-relaxed mb-6 italic">"Compassionate, strategic, and deeply human. They guided
            me through the most difficult chapter of my life."</p>
          <div class="pt-4 border-t border-gray-200">
            <div class="font-serif text-lg font-semibold">Patricia L.</div>
            <div class="text-xs uppercase tracking-wider text-gray-500">Family Law</div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Credentials -->
  <section class="py-16 bg-cream border-y border-gray-200">
    <div class="max-w-7xl mx-auto px-6">
      <div class="text-center text-xs uppercase tracking-[0.3em] text-gray-500 mb-8">Recognized &amp; Affiliated With
      </div>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 items-center">
        <div
          class="text-center font-serif text-lg text-navy/70 hover:text-gold transition-smooth border border-gray-200 bg-white py-5 px-3">
          American Bar Association</div>
        <div
          class="text-center font-serif text-lg text-navy/70 hover:text-gold transition-smooth border border-gray-200 bg-white py-5 px-3">
          Super Lawyers</div>
        <div
          class="text-center font-serif text-lg text-navy/70 hover:text-gold transition-smooth border border-gray-200 bg-white py-5 px-3">
          Martindale-Hubbell AV</div>
        <div
          class="text-center font-serif text-lg text-navy/70 hover:text-gold transition-smooth border border-gray-200 bg-white py-5 px-3">
          Best Lawyers®</div>
        <div
          class="text-center font-serif text-lg text-navy/70 hover:text-gold transition-smooth border border-gray-200 bg-white py-5 px-3">
          Chambers USA</div>
        <div
          class="text-center font-serif text-lg text-navy/70 hover:text-gold transition-smooth border border-gray-200 bg-white py-5 px-3">
          Avvo 10.0</div>
      </div>
    </div>
  </section>

  <!-- CTA Banner -->
  <section class="py-20 bg-gradient-hero relative overflow-hidden">
    <div class="absolute inset-0 stripe-bg opacity-10"></div>
    <div class="max-w-7xl mx-auto px-6 relative text-center text-white">
      <div class="text-xs uppercase tracking-[0.3em] text-gold mb-4">Don't Wait — Time Matters</div>
      <h2 data-editable="true" class="font-serif text-4xl md:text-5xl font-bold mb-5 max-w-3xl mx-auto leading-tight">Speak to an Attorney
        Today</h2>
      <p data-editable="true" class="text-white/80 max-w-xl mx-auto mb-8">Every case has a critical window. Get expert legal counsel within
        24 hours — completely confidential, no obligation.</p>
      <div class="flex flex-wrap items-center justify-center gap-4">
        <a data-editable="true" href="tel:+18005550199"
          class="inline-flex items-center gap-3 bg-primary text-white px-8 py-4 font-semibold uppercase tracking-wider text-sm hover:shadow-gold transition-smooth">
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path
              d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0 1 22 16.92z" />
          </svg>
          (800) 555-0199
        </a>
        <a data-editable="true" href="javascript:void(0);"
          class="inline-block border-2 border-gold text-gold px-8 py-3.5 font-semibold uppercase tracking-wider text-sm hover:bg-gold hover:text-navy-deep transition-smooth">Request
          Callback</a>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer id="contact" class="bg-navy-deep text-white/80">
    <div class="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
      <div>
        <div class="flex items-center gap-2 mb-5">
          LOGO_PLACEHOLDER
        </div>
        <p data-editable="true" class="text-sm leading-relaxed mb-6">A premier legal practice dedicated to delivering exceptional outcomes
          with integrity and discretion.</p>
        <div class="flex gap-3">
          <a data-editable="true" href="javascript:void(0);"
            class="grid h-9 w-9 place-items-center border border-white/15 hover:bg-gold hover:text-navy-deep hover:border-gold transition-smooth">f</a>
          <a data-editable="true" href="javascript:void(0);"
            class="grid h-9 w-9 place-items-center border border-white/15 hover:bg-gold hover:text-navy-deep hover:border-gold transition-smooth">in</a>
          <a data-editable="true" href="javascript:void(0);"
            class="grid h-9 w-9 place-items-center border border-white/15 hover:bg-gold hover:text-navy-deep hover:border-gold transition-smooth">𝕏</a>
          <a data-editable="true" href="javascript:void(0);"
            class="grid h-9 w-9 place-items-center border border-white/15 hover:bg-gold hover:text-navy-deep hover:border-gold transition-smooth">ig</a>
        </div>
      </div>
      <div>
        <h4 data-editable="true" class="font-serif text-lg text-white mb-5">Quick Links</h4>
        <ul class="space-y-3 text-sm">
          <li data-editable="true"><a data-editable="true" href="javascript:void(0);" class="hover:text-gold transition-smooth">Home</a></li>
          <li data-editable="true"><a data-editable="true" href="javascript:void(0);" class="hover:text-gold transition-smooth">Practice Areas</a></li>
          <li data-editable="true"><a data-editable="true" href="javascript:void(0);" class="hover:text-gold transition-smooth">About Us</a></li>
          <li data-editable="true"><a data-editable="true" href="javascript:void(0);" class="hover:text-gold transition-smooth">Attorneys</a></li>
          <li data-editable="true"><a data-editable="true" href="javascript:void(0);" class="hover:text-gold transition-smooth">Case Results</a></li>
          <li data-editable="true"><a data-editable="true" href="javascript:void(0);" class="hover:text-gold transition-smooth">Contact</a></li>
        </ul>
      </div>
      <div>
        <h4 data-editable="true" class="font-serif text-lg text-white mb-5">Practice Areas</h4>
        <ul class="space-y-3 text-sm">
          <li data-editable="true"><a data-editable="true" href="javascript:void(0);" class="hover:text-gold transition-smooth">Criminal Defense</a></li>
          <li data-editable="true"><a data-editable="true" href="javascript:void(0);" class="hover:text-gold transition-smooth">Family Law</a></li>
          <li data-editable="true"><a data-editable="true" href="javascript:void(0);" class="hover:text-gold transition-smooth">Corporate Law</a></li>
          <li data-editable="true"><a data-editable="true" href="javascript:void(0);" class="hover:text-gold transition-smooth">Real Estate</a></li>
          <li data-editable="true"><a data-editable="true" href="javascript:void(0);" class="hover:text-gold transition-smooth">Civil Litigation</a></li>
          <li data-editable="true"><a data-editable="true" href="javascript:void(0);" class="hover:text-gold transition-smooth">Estate Planning</a></li>
        </ul>
      </div>
      <div>
        <h4 data-editable="true" class="font-serif text-lg text-white mb-5">Get In Touch</h4>
        <ul class="space-y-4 text-sm">
          <li data-editable="true" class="flex gap-3"><span data-editable="true" class="text-gold">📍</span><span data-editable="true">1200 Madison Avenue, Suite 4500<br />New York,
              NY 10016</span></li>
          <li data-editable="true" class="flex gap-3"><span data-editable="true" class="text-gold">📞</span><a data-editable="true" href="tel:+18005550199"
              class="hover:text-gold">(800) 555-0199</a></li>
          <li data-editable="true" class="flex gap-3"><span data-editable="true" class="text-gold">✉</span><a data-editable="true" href="mailto:counsel@ashcroftvale.com"
              class="hover:text-gold">counsel@ashcroftvale.com</a></li>
        </ul>
      </div>
    </div>
    <div class="border-t border-white/10">
      <div class="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between gap-4 text-xs text-white/60">
        <div>© <span data-editable="true" id="yr"></span> Ashcroft &amp; Vale LLP. All rights reserved.</div>
        <div class="flex gap-6">
          <a data-editable="true" href="javascript:void(0);" class="hover:text-gold">Privacy Policy</a>
          <a data-editable="true" href="javascript:void(0);" class="hover:text-gold">Terms of Service</a>
          <a data-editable="true" href="javascript:void(0);" class="hover:text-gold">Legal Disclaimer</a>
        </div>
      </div>
      <div class="max-w-7xl mx-auto px-6 pb-6 text-[11px] text-white/45 leading-relaxed">
        Attorney Advertising. Prior results do not guarantee a similar outcome. The information on this website is for
        general informational purposes only and does not constitute legal advice. No attorney-client relationship is
        formed until a written engagement agreement is signed.
      </div>
    </div>
  </footer>

<script>
const hdr = document.getElementById('hdr');
    const onScroll = () => {
      if (window.scrollY > 20) hdr.classList.add('bg-navy-deep/95', 'backdrop-blur', 'shadow-card');
      else hdr.classList.remove('bg-navy-deep/95', 'backdrop-blur', 'shadow-card');
    };
    window.addEventListener('scroll', onScroll); onScroll();
    document.getElementById('menuBtn').addEventListener('click', () => {
      document.getElementById('mobileMenu').classList.toggle('hidden');
    });
    document.getElementById('yr').textContent = new Date().getFullYear();

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
