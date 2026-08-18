// Auto-generated ULTRA-DYNAMIC template — healthcare templates01
// Generated: 2026-04-30T04:04:40.241Z

export const healthcare01Styles = `
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200');
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');

:root {
  --on-surface: #141d23;
  --surface-container-lowest: #ffffff;
  --on-primary: #000000ff;
  --primary: PRIMARY_COLOR_PLACEHOLDER;
  --background: #ffffff;
  --surface-container-low: #ffffff;
  --secondary: #5f5e5e;
  --primary-container: PRIMARY_COLOR_PLACEHOLDER;
  --surface-container: #e6eff8;
  --error: #ba1a1a;
  --outline: #936e6a;
  --surface-container-high: #e0e9f2;

  
  
  
  --gray-400: #9ca3af;
  --gray-500: #6b7280;
  --primary-temp: PRIMARY_COLOR_PLACEHOLDER;
  
  
  --gray-950: #030712;
  
  --red-500: #ef4444;
  --primary-temp: PRIMARY_COLOR_PLACEHOLDER;
  
  
  --primary-temp: PRIMARY_COLOR_PLACEHOLDER;

  --font-h1: 'Manrope', sans-serif;
  --font-h2: 'Manrope', sans-serif;
  --font-h3: 'Manrope', sans-serif;
  --font-body-lg: 'Inter', sans-serif;
  --font-body-md: 'Inter', sans-serif;
  --font-label-bold: 'Inter', sans-serif;
  --font-caption: 'Inter', sans-serif;
}

.material-symbols-outlined {
  font-family: 'Material Symbols Outlined' !important;
  font-weight: normal;
  font-style: normal;
  font-size: 24px;
  line-height: 1;
  letter-spacing: normal;
  text-transform: none;
  display: inline-block;
  white-space: nowrap;
  word-wrap: normal;
  direction: ltr;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  font-feature-settings: 'liga';
}

.material-icons {
  font-family: 'Material Icons' !important;
  font-weight: normal;
  font-style: normal;
  font-size: 24px;
  line-height: 1;
  letter-spacing: normal;
  text-transform: none;
  display: inline-block;
  white-space: nowrap;
  word-wrap: normal;
  direction: ltr;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  font-feature-settings: 'liga';
}

/* Base Reset */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
html {
  font-family: var(--font-body-md);
  scroll-behavior: smooth;
}
body {
  background-color: var(--background);
  color: var(--on-surface);
  font-size: 16px;
  line-height: 1.6;
  font-weight: 400;
  -webkit-font-smoothing: antialiased;
}
img { max-width: 100%; height: auto; }
a { text-decoration: none; color: inherit; }
button { cursor: pointer; border: none; background: none; font-family: inherit;}
ul { list-style: none; }
input, select { font-family: inherit; }

/* Typography */
.font-h1 { font-family: var(--font-h1); font-size: 48px; line-height: 1.2; letter-spacing: -0.02em; font-weight: 700; }
.font-h2 { font-family: var(--font-h2); font-size: 36px; line-height: 1.3; letter-spacing: -0.01em; font-weight: 600; }
.font-h3 { font-family: var(--font-h3); font-size: 24px; line-height: 1.4; letter-spacing: 0; font-weight: 600; }
.font-body-lg { font-family: var(--font-body-lg); font-size: 18px; line-height: 1.6; letter-spacing: 0; font-weight: 400; }
.font-body-md { font-family: var(--font-body-md); font-size: 16px; line-height: 1.6; letter-spacing: 0; font-weight: 400; }
.font-label-bold { font-family: var(--font-label-bold); font-size: 14px; line-height: 1.2; letter-spacing: 0.05em; font-weight: 600; }
.font-caption { font-family: var(--font-caption); font-size: 12px; line-height: 1.4; letter-spacing: 0; font-weight: 400; }

.text-primary { color: var(--primary); }
.text-on-surface { color: var(--on-surface); }
.text-secondary { color: var(--secondary); }
.text-on-primary { color: var(--on-primary); }
.text-white { color: #ffffff; }

h1, h2, h3, h4, h5, h6, p {
  color: var(--on-surface);
}

/* Elevations & Gradients */
.low-elevation { box-shadow: 0 4px 15px 0 rgba(20, 29, 35, 0.1); }
.high-elevation { box-shadow: 0 10px 30px 0 rgba(20, 29, 35, 0.15); }
.primary-gradient { background: linear-gradient(135deg, SECONDARY_COLOR_PLACEHOLDER 0%, SECONDARY_COLOR_PLACEHOLDER 100%); }

/* Layout Utilities */
.container {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1.5rem; /* px-6 */
}
.py-xl {
  padding-top: 80px;
  padding-bottom: 80px;
}
.text-center { text-align: center; }

/* Components */
/* Header */
.site-header {
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  position: sticky;
  top: 0;
  z-index: 50;
  border-bottom: 1px solid color-mix(in srgb, PRIMARY_COLOR_PLACEHOLDER 15%, white);
  box-shadow: 0 1px 2px 0 rgba(0,0,0,0.05);
}
.header-wrapper {
  display: flex; flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  max-width: 1280px;
  margin: 0 auto;
}
.header-logo {
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: -0.05em;
  color: var(--primary);
}
.nav-menu {
  display: none;
  align-items: center;
  gap: 2rem;
}
.nav-menu a {
  color: PRIMARY_COLOR_PLACEHOLDER;
  font-weight: 500;
  transition: color 200ms;
}
.nav-menu a:hover {
  color: var(--primary);
}
.header-actions {
  display: flex; flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
}
.action-call {
  display: none;
  align-items: center;
  gap: 0.5rem;
  color: PRIMARY_COLOR_PLACEHOLDER;
  transition: color 200ms;
}
.action-call:hover { color: var(--primary); }
.action-call span.font-semibold { font-weight: 600; }
.btn-book {
  background-color: var(--btn-bg, var(--primary));
  color: var(--btn-text, var(--on-primary));
  padding: 0.625rem 1.5rem;
  border-radius: 0.75rem;
  font-weight: 600;
  transform: scale(0.95);
  transition: transform 200ms, background-color 200ms;
}
.btn-book:hover { background-color: var(--secondary) !important; color: var(--btn-text, var(--on-primary)) !important; }
.btn-book:active { transform: scale(0.90); }

/* Hero Section */
.hero-wrapper {
  position: relative;
  padding-top: 5rem;
  padding-bottom: 80px;
  overflow: hidden;
}
.hero-bg, .hero-overlay {
  position: absolute;
  top: 0; right: 0; bottom: 0; left: 0;
}
.hero-bg { z-index: 0; }
.hero-bg img { width: 100%; height: 100%; object-fit: cover; }
.hero-overlay { background: linear-gradient(to right, #ffffff, rgba(255,255,255,0.4), transparent); }
.hero-content {
  position: relative;
  z-index: 10;
  display: grid;
  grid-template-columns: 1fr;
  gap: 4rem;
  align-items: center;
}
.hero-text {
  display: flex; flex-wrap: wrap;
  flex-direction: column;
  gap: 2rem;
}
.top-rated-badge {
  display: inline-flex; flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  background-color: var(--primary);
  border-radius: 9999px;
  width: fit-content;
  color: #ffffff;
}
.top-rated-badge span { color: #ffffff ; }
.hero-desc {
  max-width: 36rem;
}
.features-list { display: flex; flex-wrap: wrap; flex-direction: column; gap: 1rem; }
.features-list li {
  display: flex; flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
  font-weight: 600;
}
.hero-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 1.5rem; }
.btn-quote {
  background-color: var(--btn-bg, var(--primary));
  color: var(--btn-text, var(--on-primary));
  padding: 1rem 2rem;
  border-radius: 0.75rem;
  transition: all 200ms;
}
.btn-quote:hover { background-color: var(--secondary) !important; color: var(--btn-text, var(--on-primary)) !important; }
.hero-rating { display: flex; flex-wrap: wrap; flex-direction: column; }
.hero-stars { display: flex; flex-wrap: wrap; color: var(--primary); }
.booking-card {
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 0.75rem;
  border: 1px solid color-mix(in srgb, PRIMARY_COLOR_PLACEHOLDER 15%, white);
}
.booking-form { display: flex; flex-wrap: wrap; flex-direction: column; gap: 1rem; }
.form-group { display: block; margin-bottom: 0.5rem;}
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;}
.form-label { display: block; margin-bottom: 0.5rem; }
.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid color-mix(in srgb, PRIMARY_COLOR_PLACEHOLDER 30%, white);
  transition: all 200ms;
}
.form-input:focus { border-color: var(--primary); outline: none; box-shadow: 0 0 0 1px var(--primary); }
.btn-submit {
  width: 100%;
  background-color: var(--secondary);
  color: #ffffff;
  padding: 1rem;
  border-radius: 0.75rem;
  font-weight: 600;
  margin-top: 1rem;
  transition: transform 200ms;
}
.btn-submit:active { transform: scale(0.95); }

/* Services Section */
.bg-surface-low { background-color: var(--surface-container-low); }
.section-intro { text-align: center; margin-bottom: 4rem; }
.section-intro p { max-width: 42rem; margin: 0 auto; }
.services-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}
.service-card {
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 0.75rem;
  transition: all 300ms;
}
.service-card:hover {
  background-color: var(--primary);
  color: #ffffff ;
}
.service-icon {
  width: 3.5rem;
  height: 3.5rem;
  background-color: var(--primary);
  border-radius: 0.5rem;
  display: flex; flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  transition: all 300ms;
}
.service-card:hover .service-icon { background-color: rgba(255,255,255,0.2); }
.service-icon .material-symbols-outlined { font-size: 1.875rem; color: #ffffff; }
.service-card:hover .material-symbols-outlined,
.service-card:hover .font-h3,
.service-card:hover .text-secondary { color: #ffffff; }
.service-card:hover p { color: rgba(255,255,255,0.8); }
.service-card h3 { margin-bottom: 1rem; }
.service-card p { margin-bottom: 1.5rem; }
.service-link {
  display: flex; flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: var(--primary);
}
.service-card:hover .service-link { color: #ffffff; }

/* About Section */
.about-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 5rem;
  align-items: center;
}
.about-img-wrapper { position: relative; }
.about-img-box {
  aspect-ratio: 1 / 1;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}
.about-img-box img { width: 100%; height: 100%; object-fit: cover; }
.about-badge {
  display: none;
  position: absolute;
  bottom: -2.5rem;
  right: -2.5rem;
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 0.75rem;
  max-width: 20rem;
}
.badge-top { display: flex; flex-wrap: wrap; align-items: center; gap: 1rem; margin-bottom: 0.5rem;}
.badge-icon { padding: 0.5rem; background-color: color-mix(in srgb, PRIMARY_COLOR_PLACEHOLDER 15%, white); border-radius: 9999px; line-height: 0; }
.about-text { display: flex; flex-wrap: wrap; flex-direction: column; gap: 2.5rem; }
.about-points { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
@media (max-width: 639px) { .about-points { grid-template-columns: 1fr; } }
.about-point { display: flex; flex-wrap: wrap; flex-direction: column; gap: 0.75rem; }
.about-point h4 { font-weight: 600; }
.about-point .material-symbols-outlined { font-size: 1.875rem; }

/* Process Section */
.bg-white { background-color: #ffffff; }
.process-wrapper { position: relative; }
.process-line {
  display: none;
  position: absolute;
  top: 3rem;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: color-mix(in srgb, PRIMARY_COLOR_PLACEHOLDER 15%, white);
  z-index: 0;
}
.process-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
}
.process-step { text-align: center; display: flex; flex-wrap: wrap; flex-direction: column; gap: 1.5rem; position: relative; z-index: 10; }
.process-num {
  width: 6rem;
  height: 6rem;
  background-color: #ffffff;
  border: 2px solid var(--primary);
  border-radius: 9999px;
  display: flex; flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  color: var(--primary);
}

/* Testimonials Section */
.stars-center { display: flex; flex-wrap: wrap; justify-content: center; gap: 0.25rem; color: var(--primary); }
.testimonials-grid { display: grid; grid-template-columns: 1fr; gap: 2rem; }
.testimonial-card {
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 0.75rem;
  display: flex; flex-wrap: wrap;
  flex-direction: column;
  gap: 1.5rem;
  color: var(--on-surface);
}
.testimonial-quote { font-style: italic; color: PRIMARY_COLOR_PLACEHOLDER; }
.testimonial-author { display: flex; flex-wrap: wrap; align-items: center; gap: 1rem; }
.testimonial-img { width: 3rem; height: 3rem; border-radius: 9999px; object-fit: cover; }
.testimonial-name { font-weight: 700; }


/* CTA Banner */
.cta-banner {
  border-radius: 1.5rem;
  text-align: center;
  position: relative;
  overflow: hidden;
  background-color: var(--secondary);
}
.cta-slider .swiper-slide {
  padding: 5rem 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.cta-slider .swiper-pagination-bullet { background: rgba(255,255,255,0.5); }
.cta-slider .swiper-pagination-bullet-active { background: #ffffff; }
.cta-slider .swiper-button-next:after, .cta-slider .swiper-button-prev:after { content: '' !important; display: block !important; width: 30px; height: 30px; background-color: white; -webkit-mask-size: contain; -webkit-mask-position: center; -webkit-mask-repeat: no-repeat; mask-size: contain; mask-position: center; mask-repeat: no-repeat; }
.cta-slider .swiper-button-prev, .cta-slider .swiper-button-next { z-index: 100 !important; pointer-events: auto !important; }
.cta-slider .swiper-button-prev:after { -webkit-mask-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M15 18l-6-6 6-6'/%3E%3C/svg%3E"); mask-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M15 18l-6-6 6-6'/%3E%3C/svg%3E"); }
.cta-slider .swiper-button-next:after { -webkit-mask-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M9 18l6-6-6-6'/%3E%3C/svg%3E"); mask-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M9 18l6-6-6-6'/%3E%3C/svg%3E"); }

.cta-bg-icon {
  position: absolute;
  top: 0; right: 0;
  padding: 5rem;
  opacity: 0.1;
  line-height: 0;
}
.cta-bg-icon span { font-size: 200px; color: #ffffff; }
.cta-content { position: relative; z-index: 10; display: flex; flex-wrap: wrap; flex-direction: column; gap: 2rem; }
.cta-content p { max-width: 42rem; margin: 0 auto; color: rgba(255,255,255,0.9); }
.cta-actions { display: flex; flex-wrap: wrap; flex-direction: column; justify-content: center; gap: 1rem; padding-top: 1rem; }
.btn-primary {
  background: var(--secondary);
  color: #fff;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  font-weight: 700;
  font-family: var(--font-h3);
  cursor: pointer;
  transition: all 0.3s;
}
.btn-cta-1 {
  background-color: #ffffff;
  color: var(--primary);
  padding: 1.25rem 2.5rem;
  border-radius: 0.75rem;
  font-weight: 700;
  transition: background-color 200ms;
}
.btn-cta-1:hover { background-color: color-mix(in srgb, PRIMARY_COLOR_PLACEHOLDER 15%, white); }
.btn-cta-2 {
  background-color: transparent;
  border: 2px solid #ffffff;
  color: #ffffff;
  padding: 1.25rem 2.5rem;
  border-radius: 0.75rem;
  font-weight: 700;
  transition: background-color 200ms;
}
.btn-cta-2:hover { background-color: rgba(255,255,255,0.1); }

/* FAQ Section */
.faq-wrap { max-width: 48rem; margin: 0 auto;}
.faq-list { display: flex; flex-wrap: wrap; flex-direction: column; gap: 1rem; }
.faq-item {
  background-color: var(--surface);
  border-radius: 0.75rem;
  padding: 1.5rem;
  border: 1px solid color-mix(in srgb, PRIMARY_COLOR_PLACEHOLDER 15%, white);
}
.faq-summary {
  display: flex; flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  cursor: pointer;
  list-style: none; /* remove default arrow */
}
.faq-summary::after { display: none !important; }
.faq-summary::-webkit-details-marker { display: none; }
.faq-summary::marker { display: none; content: ""; }
.faq-summary .material-symbols-outlined { transition: transform 200ms; }
.faq-item[open] .faq-summary .material-symbols-outlined { transform: rotate(180deg); }
.faq-answer { margin-top: 1rem; }

/* Team Section */
.team-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem; margin-top: 3rem; }
.team-member { background: #fff; border-radius: 1rem; overflow: hidden; text-align: center; border: 1px solid color-mix(in srgb, PRIMARY_COLOR_PLACEHOLDER 10%, white); transition: transform 300ms; }
.team-member:hover { transform: translateY(-5px); box-shadow: 0 20px 40px rgba(0,0,0,0.05); }
.team-img { width: 100%; aspect-ratio: 1/1; object-fit: cover; }
.team-info { padding: 1.5rem; }
.team-name { font-size: 1.25rem; font-weight: 700; color: var(--on-surface); margin-bottom: 0.25rem; }
.team-role { color: var(--primary); font-weight: 600; font-size: 0.9rem; margin-bottom: 1rem; }
.team-social { display: flex; justify-content: center; gap: 1rem; }
.team-social a { color: var(--gray-400); transition: color 200ms; }
.team-social a:hover { color: var(--primary); }

/* Facilities Section */
.facilities-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem; margin-top: 3rem; }
.facility-card { border-radius: 1rem; overflow: hidden; position: relative; }
.facility-card img { width: 100%; aspect-ratio: 4/3; object-fit: cover; transition: transform 300ms; }
.facility-card:hover img { transform: scale(1.05); }
.facility-info { position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(to top, rgba(0,0,0,0.8), transparent); padding: 2rem 1.5rem 1.5rem; color: #fff; }


/* Footer */
.site-footer {
  background-color: color-mix(in srgb, PRIMARY_COLOR_PLACEHOLDER 5%, white);
  border-top: 1px solid color-mix(in srgb, PRIMARY_COLOR_PLACEHOLDER 30%, white);
  font-family: inherit; /* font-manrope set usually, defaulting to body via var */
}
.footer-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  padding: 3rem 2rem;
  max-width: 1280px;
  margin: 0 auto;
}
.footer-col { display: flex; flex-wrap: wrap; flex-direction: column; gap: 1.5rem; }
.footer-brand { font-size: 1.25rem; font-weight: 700; color: color-mix(in srgb, SECONDARY_COLOR_PLACEHOLDER 90%, black); }
.footer-socials { display: flex; flex-wrap: wrap; gap: 1rem; }
.footer-socials a { color: var(--gray-400); transition: color 200ms; }
.footer-socials a:hover { color: var(--primary); }
.footer-title { font-weight: 700; color: color-mix(in srgb, SECONDARY_COLOR_PLACEHOLDER 90%, black); text-transform: uppercase; letter-spacing: 0.05em; font-size: 0.75rem; }
.footer-links { display: flex; flex-wrap: wrap; flex-direction: column; gap: 0.5rem; }
.footer-links a { color: var(--gray-500); transition: color 200ms; }
.footer-links a:hover { color: var(--primary); }
.footer-contact { display: flex; flex-wrap: wrap; flex-direction: column; gap: 0.75rem; color: var(--gray-500); }
.footer-contact li { display: flex; align-items: flex-start; gap: 0.75rem; }
.footer-bottom {
  max-width: 1280px;
  margin: 0 auto;
  padding: 1.5rem 2rem;
  border-top: 1px solid color-mix(in srgb, PRIMARY_COLOR_PLACEHOLDER 15%, white);
  display: flex; flex-wrap: wrap;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}
.footer-bottom p { color: var(--gray-500); }
.footer-badges { display: flex; flex-wrap: wrap; align-items: center; gap: 1.5rem; }
.footer-badge { height: 1.5rem; filter: grayscale(100%); opacity: 0.5; }

/* Media Queries for Responsive Layouts matching Tailwind breakpoints */
@media (min-width: 640px) { /* sm */
  .action-call { display: flex; flex-wrap: wrap; }
  .about-points { grid-template-columns: 1fr 1fr; }
  .cta-actions { flex-direction: row; gap: 1.5rem; }
}
@media (min-width: 768px) { /* md */
  .hero-content { grid-template-columns: 1fr 1fr; }
  .services-grid { grid-template-columns: 1fr 1fr; }
  .about-badge { display: block; }
  .process-grid { grid-template-columns: 1fr 1fr; }
  .testimonials-grid { grid-template-columns: 1fr 1fr 1fr; }
  .footer-grid { grid-template-columns: repeat(4, 1fr); }
  .footer-bottom { flex-direction: row; }
}
@media (min-width: 1024px) { /* lg */
  .services-grid { grid-template-columns: repeat(4, 1fr); }
  .about-grid { grid-template-columns: 1fr 1fr; }
  .process-grid { grid-template-columns: repeat(4, 1fr); }
  .process-line { display: block; }
  .cta-banner { padding: 5rem; }
}


  /* Extracted Template Inline Styles */
  .tpl-templates01-1 { color: PRIMARY_COLOR_PLACEHOLDER; }
  .tpl-templates01-2 { border: 2px dashed #22c55e; border-radius: 8px; background: rgba(34,197,94,0.1); color: #166534; }
@media (max-width: 768px) {
  .team-grid, .facilities-grid { grid-template-columns: 1fr !important; }
  .header-wrapper { flex-direction: column !important; }
}

`;

export const healthcare01Html = `
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" />
<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" rel="stylesheet" />
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&family=Inter:wght@400;600&display=swap" rel="stylesheet"/>

<!-- TopNavBar -->
<header class="site-header">
<div class="header-wrapper">
<a class="header-logo" href="javascript:void(0);">LOGO_PLACEHOLDER</a>

<div class="header-actions">
<a class="action-call" href="tel:1234567890">
<span class="material-symbols-outlined">call</span>
<span class="font-semibold">Call Now</span>
</a>
<button class="btn-primary">Book Appointment</button>
</div>
</div>
</header>
<main>
<!-- Hero Section -->
<section class="hero-wrapper">
<div class="hero-bg">
<img data-alt="High-quality professional dental clinic interior background" src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=1600" alt="Dental Clinic Interior"/>
<div class="hero-overlay"></div>
</div>
<div class="container hero-content">
<div class="hero-text">
<div class="top-rated-badge">
<span class="material-symbols-outlined text-primary" style="font-size: 14px; font-variation-settings: 'FILL' 1;">star</span>
<span class="font-label-bold text-primary">TOP RATED CLINIC IN LONDON</span>
</div>
<h1 class="font-h1 text-on-surface">Expert Dental Care for a <span class="text-primary">Radiant Smile</span></h1>
<p class="font-body-lg text-secondary hero-desc">Experience the pinnacle of dental excellence where advanced technology meets compassionate care for your perfect smile.</p>
<ul class="features-list">
<li>
<span class="material-symbols-outlined text-primary" style="font-variation-settings: 'FILL' 1;">check_circle</span>
<span>Painless laser treatments</span>
</li>
<li>
<span class="material-symbols-outlined text-primary" style="font-variation-settings: 'FILL' 1;">check_circle</span>
<span>Experienced specialist team</span>
</li>
<li>
<span class="material-symbols-outlined text-primary" style="font-variation-settings: 'FILL' 1;">check_circle</span>
<span>Direct insurance billing</span>
</li>
</ul>
<div class="hero-actions">
<button class="btn-primary high-elevation font-h3">Get Free Quote</button>
<div class="hero-rating">
<div class="hero-stars">
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">star</span>
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">star</span>
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">star</span>
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">star</span>
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">star</span>
</div>
<span class="font-caption font-label-bold">4.9/5 TRUSTED REVIEWS</span>
</div>
</div>
</div>
<div class="booking-card high-elevation">
<h3 class="font-h3" style="margin-bottom: 1.5rem;">Schedule Your Visit</h3>
<form class="booking-form">
<div class="form-group">
<label class="form-label font-label-bold">Full Name</label>
<input class="form-input" placeholder="John Doe" type="text" name="name" id="name"/ required>
</div>
<div class="form-row">
<div class="form-group">
<label class="form-label font-label-bold">Phone</label>
<input class="form-input" placeholder="+1 (555) 000" type="tel" name="phone" id="phone"/ required>
</div>
<div class="form-group">
<label class="form-label font-label-bold">Service</label>
<select class="form-input" name="service" id="service" required>
<option>Cosmetic Dentistry</option>
<option>General Checkup</option>
<option>Orthodontics</option>
<option>Dental Implants</option>
</select>
</div>
</div>
<div class="form-group">
<label class="form-label font-label-bold">Email</label>
<input class="form-input" placeholder="john@example.com" type="email" name="email_address" id="email_address"/ required>
</div>
<button class="btn-submit primary-gradient high-elevation" type="submit">Submit Request</button>
</form>
</div>
</div>
</section>

<!-- Services Section -->
<section class="py-xl" id="services">
<div class="container">
<div class="section-intro">
<h2 class="font-h2 text-on-surface" style="margin-bottom: 1rem;">Comprehensive Dental Services</h2>
<p class="font-body-lg text-secondary">We offer a full range of dental treatments using the latest technology to ensure your comfort and long-term oral health.</p>
</div>
<div class="services-grid">
<!-- Card 1 -->
<div class="service-card low-elevation">
<div class="service-icon text-primary"><span class="material-symbols-outlined">dentistry</span></div>
<h3 class="font-h3 text-on-surface">General Dentistry</h3>
<p class="font-body-md text-secondary">Routine checkups, cleanings, and preventative care for all ages.</p>
<a class="service-link" href="javascript:void(0);">
<span>Learn More</span>
<span class="material-symbols-outlined" style="font-size: 14px;">arrow_forward</span>
</a>
</div>
<!-- Card 2 -->
<div class="service-card low-elevation">
<div class="service-icon text-primary"><span class="material-symbols-outlined">auto_fix_high</span></div>
<h3 class="font-h3 text-on-surface">Cosmetic Dentistry</h3>
<p class="font-body-md text-secondary">Teeth whitening, veneers, and smile makeovers for a perfect look.</p>
<a class="service-link" href="javascript:void(0);">
<span>Learn More</span>
<span class="material-symbols-outlined" style="font-size: 14px;">arrow_forward</span>
</a>
</div>
<!-- Card 3 -->
<div class="service-card low-elevation">
<div class="service-icon text-primary"><span class="material-symbols-outlined">align_horizontal_center</span></div>
<h3 class="font-h3 text-on-surface">Orthodontics</h3>
<p class="font-body-md text-secondary">Invisalign and traditional braces to align your teeth perfectly.</p>
<a class="service-link" href="javascript:void(0);">
<span>Learn More</span>
<span class="material-symbols-outlined" style="font-size: 14px;">arrow_forward</span>
</a>
</div>
<!-- Card 4 -->
<div class="service-card low-elevation">
<div class="service-icon text-primary"><span class="material-symbols-outlined">medical_services</span></div>
<h3 class="font-h3 text-on-surface">Dental Implants</h3>
<p class="font-body-md text-secondary">Permanent solutions for missing teeth with natural-looking results.</p>
<a class="service-link" href="javascript:void(0);">
<span>Learn More</span>
<span class="material-symbols-outlined" style="font-size: 14px;">arrow_forward</span>
</a>
</div>
</div>
</div>
</section>

<!-- Why Choose Us -->
<section class="py-xl" id="about">
<div class="container about-grid">
<div class="about-img-wrapper">
<div class="about-img-box">
<img data-alt="portrait of a smiling female dentist in a white lab coat standing in a high-tech dental office" src="https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?auto=format&fit=crop&q=80&w=800" alt="Female Dentist"/>
</div>
<div class="about-badge high-elevation">
<div class="badge-top">
<div class="badge-icon"><span class="material-symbols-outlined tpl-templates01-1"  >verified</span></div>
<span class="font-h3 text-primary">15+ Years</span>
</div>
<p class="font-caption font-label-bold text-secondary text-on-surface">Of combined dental excellence and surgical experience.</p>
</div>
</div>
<div class="about-text">
<div>
<h2 class="font-h2" style="margin-bottom: 1rem;">Why Patients Trust PROJECT_NAME_PLACEHOLDER</h2>
<p class="font-body-lg text-secondary">We believe dental care should be an experience, not just a procedure.</p>
</div>
<div class="about-points">
<div class="about-point">
<span class="material-symbols-outlined text-primary">workspace_premium</span>
<h4 class="font-body-lg" style="font-weight: 600;">Expert Experience</h4>
<p class="font-body-md text-secondary">Board-certified specialists with over 15 years of surgical practice.</p>
</div>
<div class="about-point">
<span class="material-symbols-outlined text-primary">biotech</span>
<h4 class="font-body-lg" style="font-weight: 600;">Advanced Tech</h4>
<p class="font-body-md text-secondary">3D scanning and laser dentistry for precise, painless results.</p>
</div>
<div class="about-point">
<span class="material-symbols-outlined text-primary">mood</span>
<h4 class="font-body-lg" style="font-weight: 600;">Patient Comfort</h4>
<p class="font-body-md text-secondary">Heated massage chairs and noise-canceling headphones.</p>
</div>
<div class="about-point">
<span class="material-symbols-outlined text-primary">payments</span>
<h4 class="font-body-lg" style="font-weight: 600;">Affordable Pricing</h4>
<p class="font-body-md text-secondary">Flexible 0% interest payment plans for all major treatments.</p>
</div>
</div>
</div>
</div>
</section>

<!-- Process -->
<section class="py-xl bg-white" id="process">
<div class="container">
<div class="section-intro">
<h2 class="font-h2" style="margin-bottom: 1rem;">Your Smile Journey</h2>
<p class="font-body-lg text-secondary">A simple 4-step process to achieving your dream smile.</p>
</div>
<div class="process-wrapper">
<div class="process-line"></div>
<div class="process-grid">
<div class="process-step">
<div class="process-num font-h2 low-elevation">01</div>
<h4 class="font-h3">Consultation</h4>
<p class="font-body-md text-secondary">Discuss your goals and dental history with our lead specialists.</p>
</div>
<div class="process-step">
<div class="process-num font-h2 low-elevation">02</div>
<h4 class="font-h3">Diagnosis</h4>
<p class="font-body-md text-secondary">Comprehensive digital scans and exam for precise treatment planning.</p>
</div>
<div class="process-step">
<div class="process-num font-h2 low-elevation">03</div>
<h4 class="font-h3">Treatment</h4>
<p class="font-body-md text-secondary">Modern care in a relaxed environment focused on your comfort.</p>
</div>
<div class="process-step">
<div class="process-num font-h2 low-elevation">04</div>
<h4 class="font-h3">Aftercare</h4>
<p class="font-body-md text-secondary">Personalized follow-up plans to maintain your results forever.</p>
</div>
</div>
</div>
</div>
</section>

<!-- Facilities -->
<section class="py-xl" id="facilities">
<div class="container">
<div class="section-intro">
<h2 class="font-h2" style="margin-bottom: 1rem;">State-of-the-Art Facilities</h2>
<p class="font-body-lg text-secondary">Experience dental care in a relaxing, modern environment designed for your comfort.</p>
</div>
<div class="facilities-grid">
  <div class="facility-card high-elevation">
    <img src="https://images.unsplash.com/photo-1629909615184-74f495363b67?auto=format&fit=crop&q=80&w=600" alt="Modern Treatment Room" />
    <div class="facility-info">
      <h4 class="font-h3 text-white">Advanced Treatment Rooms</h4>
    </div>
  </div>
  <div class="facility-card high-elevation">
    <img src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=600" alt="Relaxing Waiting Area" />
    <div class="facility-info">
      <h4 class="font-h3 text-white">Relaxing Lounge</h4>
    </div>
  </div>
  <div class="facility-card high-elevation">
    <img src="https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=600" alt="High Tech Equipment" />
    <div class="facility-info">
      <h4 class="font-h3 text-white">3D Scanning Tech</h4>
    </div>
  </div>
</div>
</div>
</section>


<!-- Meet Our Team -->
<section class="py-xl bg-surface-low" id="team">
<div class="container">
<div class="section-intro">
<h2 class="font-h2" style="margin-bottom: 1rem;">Meet Our Specialists</h2>
<p class="font-body-lg text-secondary">A dedicated team of board-certified professionals committed to your oral health.</p>
</div>
<div class="team-grid">
  <div class="team-member high-elevation">
    <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=800" alt="Dr. Emily Chen" class="team-img" />
    <div class="team-info">
      <h4 class="team-name">Dr. Emily Chen</h4>
      <p class="team-role">Lead Orthodontist</p>
    </div>
  </div>
  <div class="team-member high-elevation">
    <img src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=800" alt="Dr. James Wilson" class="team-img" />
    <div class="team-info">
      <h4 class="team-name">Dr. James Wilson</h4>
      <p class="team-role">Cosmetic Dentist</p>
    </div>
  </div>
  <div class="team-member high-elevation">
    <img src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=800" alt="Dr. Sarah Jenkins" class="team-img" />
    <div class="team-info">
      <h4 class="team-name">Dr. Sarah Jenkins</h4>
      <p class="team-role">Oral Surgeon</p>
    </div>
  </div>
</div>
</div>
</section>

<!-- CTA Banner -->
<section class="py-xl">
<div class="container">
<div class="section-intro">
<h2 class="font-h2" style="margin-bottom: 1rem;">Start Your Smile Journey Today</h2>
<p class="font-body-lg text-secondary">Join thousands of happy patients who have transformed their smiles with us.</p>
</div>
<div data-gjs-type="swiper-container" class="cta-banner swiper-container cta-slider" data-slides-per-view="1" data-navigation="true" data-pagination="bullets" style="padding: 0;">
<div class="cta-bg-icon">
<span class="material-symbols-outlined">dentistry</span>
</div>
<div data-gjs-type="swiper-wrapper" class="swiper-wrapper">
  <!-- Slide 1 -->
  <div data-gjs-type="swiper-slide" class="swiper-slide cta-content">
    <h2 class="font-h1 text-white">Start Your Smile Journey Today</h2>
    <p class="font-body-lg text-white" style="opacity: 0.9; max-width: 42rem; margin: 0 auto;">New patients get a 20% discount on their first full dental examination and cleaning.</p>
    <div class="cta-actions" style="margin-top: 2rem;">
      <button class="btn-cta-1 high-elevation">Book Now</button>
      <button class="btn-cta-2">Contact Us</button>
    </div>
  </div>
  <!-- Slide 2 -->
  <div data-gjs-type="swiper-slide" class="swiper-slide cta-content">
    <h2 class="font-h1 text-white">Advanced Painless Dentistry</h2>
    <p class="font-body-lg text-white" style="opacity: 0.9; max-width: 42rem; margin: 0 auto;">Experience the future of dental care with our state-of-the-art laser and 3D imaging technology.</p>
    <div class="cta-actions" style="margin-top: 2rem;">
      <button class="btn-cta-1 high-elevation">Learn More</button>
    </div>
  </div>
  <!-- Slide 3 -->
  <div data-gjs-type="swiper-slide" class="swiper-slide cta-content">
    <h2 class="font-h1 text-white">Flexible Payment Plans</h2>
    <p class="font-body-lg text-white" style="opacity: 0.9; max-width: 42rem; margin: 0 auto;">Don't let budget stand in the way of your perfect smile. We offer 0% interest financing.</p>
    <div class="cta-actions" style="margin-top: 2rem;">
      <button class="btn-cta-1 high-elevation">View Plans</button>
      <button class="btn-cta-2">Talk to Us</button>
    </div>
  </div>
</div>
<div data-gjs-type="swiper-pagination" class="swiper-pagination"></div>
<div data-gjs-type="swiper-button-prev" class="swiper-button-prev" style="color: white; z-index: 100 !important; pointer-events: auto !important;"></div>
<div data-gjs-type="swiper-button-next" class="swiper-button-next" style="color: white; z-index: 100 !important; pointer-events: auto !important;"></div>
</div>
</div>
</section>

<!-- FAQ Section -->
<section class="py-xl bg-white" id="faqs">
<div class="container faq-wrap">
<div class="section-intro">
<h2 class="font-h2" style="margin-bottom: 1rem;">Frequently Asked Questions</h2>
</div>
<div class="faq-list">
<details class="faq-item" open>
<summary class="faq-summary font-h3">
<span>Do you accept insurance?</span>
<span class="material-symbols-outlined">expand_more</span>
</summary>
<div class="faq-answer font-body-md text-secondary">
Yes, we accept most major PPO insurance plans. We also offer direct billing for your convenience and can help you maximize your annual benefits.
</div>
</details>
<details class="faq-item">
<summary class="faq-summary font-h3">
<span>How long does a consultation take?</span>
<span class="material-symbols-outlined">expand_more</span>
</summary>
<div class="faq-answer font-body-md text-secondary">
A standard consultation typically takes about 45-60 minutes. This includes a full digital scan, review of your history, and a detailed discussion about your treatment options.
</div>
</details>
<details class="faq-item">
<summary class="faq-summary font-h3">
<span>Do you offer emergency dental services?</span>
<span class="material-symbols-outlined">expand_more</span>
</summary>
<div class="faq-answer font-body-md text-secondary">
Absolutely. We reserve specific slots daily for emergency cases. If you're experiencing pain or have a dental emergency, please call us immediately for a same-day appointment.
</div>
</details>
</div>
</div>
</section>
</main>

<!-- Footer -->
<footer class="site-footer">
<div class="footer-grid">
<!-- Col 1 -->
<div class="footer-col" style="gap: 1.5rem;">
<a class="footer-brand" href="javascript:void(0);">LOGO_PLACEHOLDER</a>
<p class="font-body-md text-secondary">Pioneering dental care with luxury comfort and advanced clinical expertise since 2009.</p>
<div class="footer-socials">
<a href="javascript:void(0);"><span class="material-symbols-outlined">public</span></a>
<a href="javascript:void(0);"><span class="material-symbols-outlined">chat</span></a>
<a href="javascript:void(0);"><span class="material-symbols-outlined">video_camera_front</span></a>
</div>
</div>
<!-- Col 2 -->
<div class="footer-col" style="gap: 1rem;">
<h4 class="footer-title">Quick Links</h4>

</div>
<!-- Col 3 -->
<div class="footer-col" style="gap: 1rem;">
<h4 class="footer-title">Support</h4>

</div>
<!-- Col 4 -->
<div class="footer-col" style="gap: 1rem;">
<h4 class="footer-title">Contact</h4>
<ul class="footer-contact font-body-md">
<li>
<span class="material-symbols-outlined text-primary" style="font-size: 14px;">location_on</span>
<span>ADDRESS_PLACEHOLDER</span>
</li>
<li>
<span class="material-symbols-outlined text-primary" style="font-size: 14px;">phone</span>
<span>PHONE_PLACEHOLDER</span>
</li>
<li>
<span class="material-symbols-outlined text-primary" style="font-size: 14px;">mail</span>
<span>EMAIL_PLACEHOLDER</span>
</li>
</ul>
</div>
</div>
<div class="footer-bottom font-body-md">
<p>© 2024 PROJECT_NAME_PLACEHOLDER. All rights reserved.</p>
<div class="footer-badges">
<img class="footer-badge" data-alt="logo placeholder for a health certification board" src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=200&q=80"/>
<img class="footer-badge" data-alt="logo placeholder for a dental association badge" src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=200&q=80"/>
</div>
</div>
</footer>


<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" />
<script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
<script id="core-interactions">
  (function() {
    // Check if we are inside GrapesJS editor
    var isInEditor = !!document.querySelector('[data-gjs-type]') || document.body.classList.contains('gjs-dashed');
    
    // Form Validation
    document.addEventListener('submit', function(e) {
      if (e.target.tagName === 'FORM') {
        e.preventDefault();
        if (isInEditor) {
          e.stopImmediatePropagation();
          var existingModal = document.getElementById("preview-mode-modal");
          if (existingModal) existingModal.remove();
          var modalHtml = '<div id="preview-mode-modal" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 999999; display: flex; align-items: center; justify-content: center; background: rgba(15, 23, 42, 0.7); backdrop-filter: blur(8px); opacity: 0; animation: pModalFadeIn 0.3s forwards; font-family: system-ui, -apple-system, sans-serif;"><div style="background: #ffffff; width: 90%; max-width: 400px; border-radius: 20px; padding: 32px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); text-align: center; transform: scale(0.95); animation: pModalScaleUp 0.3s forwards;"><div style="width: 60px; height: 60px; background: #FEF2F2; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;"><svg style="width: 30px; height: 30px; color: #EF4444;" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg></div><h3 style="font-size: 20px; font-weight: 700; color: #0F172A; margin: 0 0 12px; letter-spacing: -0.02em;">Preview Mode Active</h3><p style="font-size: 15px; color: #64748B; margin: 0 0 28px; line-height: 1.5;">Form submissions are disabled in preview mode. Publish your page to accept real submissions.</p><button onclick="document.getElementById(\'preview-mode-modal\').remove()" style="width: 100%; background: #0F172A; color: #ffffff; border: none; padding: 14px; border-radius: 12px; font-size: 15px; font-weight: 600; cursor: pointer; transition: background 0.2s;" onmouseover="this.style.background=\'#1E293B\'" onmouseout="this.style.background=\'#0F172A\'">Got it, close</button></div><style>@keyframes pModalFadeIn { to { opacity: 1; } } @keyframes pModalScaleUp { to { transform: scale(1); } }</style></div>';
          document.body.insertAdjacentHTML("beforeend", modalHtml);
          return;
        }

        e.target.setAttribute('novalidate', 'true');
        var isValid = true;
        var inputs = e.target.querySelectorAll('input:not([type="submit"]):not([type="hidden"]):not([type="button"]), textarea, select');
        
        inputs.forEach(function(input) {
          if (!input.dataset.valSetup) {
            input.dataset.valSetup = 'true';
            input.addEventListener('input', function() {
              if (input.value.trim()) {
                input.style.outline = '2px solid #22c55e';
                input.style.outlineOffset = '1px';
                input.style.borderColor = '#22c55e';
                if (input.nextElementSibling && input.nextElementSibling.classList.contains('val-error')) {
                  input.nextElementSibling.style.display = 'none';
                }
              } else {
                input.style.outline = '2px solid #ef4444';
                input.style.outlineOffset = '1px';
                input.style.borderColor = '#ef4444';
                if (input.nextElementSibling && input.nextElementSibling.classList.contains('val-error')) {
                  input.nextElementSibling.style.display = 'block';
                }
              }
            });
          }

          if (!input.value.trim() && input.hasAttribute('required')) {
            isValid = false;
            input.style.outline = '2px solid #ef4444';
            input.style.outlineOffset = '1px';
            input.style.borderColor = '#ef4444';
            
            if (!input.parentElement.classList.contains('val-wrapper')) {
                var wrapper = document.createElement('div');
                wrapper.className = 'val-wrapper';
                wrapper.style.display = 'flex';
                wrapper.style.flexDirection = 'column';
                wrapper.style.width = '100%';
                
                var computed = window.getComputedStyle(input);
                if (window.getComputedStyle(input.parentElement).display === 'grid') {
                    wrapper.style.gridColumn = input.style.gridColumn || computed.gridColumn;
                    wrapper.style.gridRow = input.style.gridRow || computed.gridRow;
                }
                
                input.parentNode.insertBefore(wrapper, input);
                wrapper.appendChild(input);
            }

            if (!input.nextElementSibling || !input.nextElementSibling.classList.contains('val-error')) {
              var fieldName = input.getAttribute('placeholder') || input.getAttribute('name') || 'This field';
              var err = document.createElement('span');
              err.className = 'val-error';
              err.style.color = '#ef4444';
              err.style.fontSize = '12px';
              err.style.display = 'block';
              err.style.marginTop = '4px';
              err.style.fontWeight = '500';
              err.textContent = '*' + fieldName.replace(/\\*$/, '').trim() + ' is required';
              input.parentNode.insertBefore(err, input.nextSibling);
            } else {
              input.nextElementSibling.style.display = 'block';
            }
          }
        });
        
        if (!isValid) {
          e.preventDefault();
          e.stopImmediatePropagation();
        } else {
          e.preventDefault();
          var btn = e.target.querySelector('button[type="submit"]') || e.target.querySelector('input[type="submit"]');
          if (btn) {
            if(btn.innerText) btn.innerText = 'Sending...';
            else btn.value = 'Sending...';
          }
          setTimeout(function() {
            e.target.innerHTML = '<div class="tpl-templates01-2" style="padding: 20px; text-align: center"><h3 style="margin: 0 0 10px 0; ">Thank You!</h3><p style="margin: 0;">Your request has been submitted successfully.</p></div>';
          }, 1000);
        }
      }
    }, true);
    
    // Initialize Swiper in preview/live mode
    if (!isInEditor && typeof Swiper !== 'undefined') {
      var swipers = document.querySelectorAll('.swiper-container');
      swipers.forEach(function(s) {
        var slidesPerView = s.getAttribute('data-slides-per-view') || 1;
        new Swiper(s, {
          slidesPerView: slidesPerView,
          loop: true,
          pagination: {
            el: s.querySelector('.swiper-pagination'),
            clickable: true,
          },
          navigation: {
            nextEl: s.querySelector('.swiper-button-next'),
            prevEl: s.querySelector('.swiper-button-prev'),
          },
        });
      });
    }
  })();
</script>

`;
