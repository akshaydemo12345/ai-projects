// Auto-generated ULTRA-DYNAMIC template — healthcare templates01
// Generated: 2026-04-30T04:04:40.241Z

export const healthcare01Styles = `
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200');
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');

:root {
  --on-surface: #141d23;
  --surface-container- lowest: #ffffff;
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

  --gray-50: #f9fafb;
  --gray-100: #f3f4f6;
  --gray-200: #e5e7eb;
  --gray-400: #9ca3af;
  --gray-500: #6b7280;
  --gray-600: #4b5563;
  --gray-800: #1f2937;
  --gray-900: #111827;
  --gray-950: #030712;
  
  --red-500: #ef4444;
  --red-600: #dc2626;
  
  --green-100: #dcfce3;
  --green-600: #16a34a;

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
.primary-gradient { background: linear-gradient(to bottom, PRIMARY_COLOR_PLACEHOLDER, #93000d); }

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
  border-bottom: 1px solid var(--gray-100);
  box-shadow: 0 1px 2px 0 rgba(0,0,0,0.05);
}
.header-wrapper {
  display: flex;
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
  color: var(--gray-600);
  font-weight: 500;
  transition: color 200ms;
}
.nav-menu a:hover {
  color: var(--primary);
}
.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.action-call {
  display: none;
  align-items: center;
  gap: 0.5rem;
  color: var(--gray-600);
  transition: color 200ms;
}
.action-call:hover { color: var(--primary); }
.action-call span.font-semibold { font-weight: 600; }
.btn-book {
  background-color: var(--primary);
  color: var(--on-primary);
  padding: 0.625rem 1.5rem;
  border-radius: 0.75rem;
  font-weight: 600;
  transform: scale(0.95);
  transition: transform 200ms, background-color 200ms;
}
.btn-book:hover { background-color: var(--primary-container); }
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
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
.top-rated-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  background-color: var(--primary);
  border-radius: 9999px;
  width: fit-content;
  color: #ffffff;
}
.top-rated-badge span { color: #ffffff !important; }
.hero-desc {
  max-width: 36rem;
}
.features-list { display: flex; flex-direction: column; gap: 1rem; }
.features-list li {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 600;
}
.hero-actions { display: flex; align-items: center; gap: 1.5rem; }
.btn-quote {
  background-color: var(--primary);
  color: var(--on-primary);
  padding: 1rem 2rem;
  border-radius: 0.75rem;
  transition: all 200ms;
}
.btn-quote:hover { background-color: var(--primary-container); }
.hero-rating { display: flex; flex-direction: column; }
.hero-stars { display: flex; color: var(--primary); }
.booking-card {
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 0.75rem;
  border: 1px solid var(--gray-100);
}
.booking-form { display: flex; flex-direction: column; gap: 1rem; }
.form-group { display: block; margin-bottom: 0.5rem;}
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;}
.form-label { display: block; margin-bottom: 0.5rem; }
.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid var(--gray-200);
  transition: all 200ms;
}
.form-input:focus { border-color: var(--primary); outline: none; box-shadow: 0 0 0 1px var(--primary); }
.btn-submit {
  width: 100%;
  color: var(--on-primary);
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
  color: #ffffff !important;
}
.service-icon {
  width: 3.5rem;
  height: 3.5rem;
  background-color: var(--primary);
  border-radius: 0.5rem;
  display: flex;
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
  display: flex;
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
.badge-top { display: flex; align-items: center; gap: 1rem; margin-bottom: 0.5rem;}
.badge-icon { padding: 0.5rem; background-color: var(--green-100); border-radius: 9999px; line-height: 0; }
.about-text { display: flex; flex-direction: column; gap: 2.5rem; }
.about-points { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
@media (max-width: 639px) { .about-points { grid-template-columns: 1fr; } }
.about-point { display: flex; flex-direction: column; gap: 0.75rem; }
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
  background-color: var(--gray-100);
  z-index: 0;
}
.process-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
}
.process-step { text-align: center; display: flex; flex-direction: column; gap: 1.5rem; position: relative; z-index: 10; }
.process-num {
  width: 6rem;
  height: 6rem;
  background-color: #ffffff;
  border: 2px solid var(--primary);
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  color: var(--primary);
}

/* Testimonials Section */
.stars-center { display: flex; justify-content: center; gap: 0.25rem; color: var(--primary); }
.testimonials-grid { display: grid; grid-template-columns: 1fr; gap: 2rem; }
.testimonial-card {
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  color: var(--on-surface);
}
.testimonial-quote { font-style: italic; color: var(--gray-600); }
.testimonial-author { display: flex; align-items: center; gap: 1rem; }
.testimonial-img { width: 3rem; height: 3rem; border-radius: 9999px; object-fit: cover; }
.testimonial-name { font-weight: 700; }

/* CTA Banner */
.cta-banner {
  border-radius: 1.5rem;
  padding: 3rem;
  text-align: center;
  position: relative;
  overflow: hidden;
}
.cta-bg-icon {
  position: absolute;
  top: 0; right: 0;
  padding: 5rem;
  opacity: 0.1;
  line-height: 0;
}
.cta-bg-icon span { font-size: 200px; color: #ffffff; }
.cta-content { position: relative; z-index: 10; display: flex; flex-direction: column; gap: 2rem; }
.cta-content p { max-width: 42rem; margin: 0 auto; color: rgba(255,255,255,0.9); }
.cta-actions { display: flex; flex-direction: column; justify-content: center; gap: 1rem; padding-top: 1rem; }
.btn-cta-1 {
  background-color: #ffffff;
  color: var(--primary);
  padding: 1.25rem 2.5rem;
  border-radius: 0.75rem;
  font-weight: 700;
  transition: background-color 200ms;
}
.btn-cta-1:hover { background-color: var(--gray-100); }
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
.faq-list { display: flex; flex-direction: column; gap: 1rem; }
.faq-item {
  background-color: var(--surface);
  border-radius: 0.75rem;
  padding: 1.5rem;
  border: 1px solid var(--gray-100);
}
.faq-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  cursor: pointer;
  list-style: none; /* remove default arrow */
}
.faq-summary::-webkit-details-marker { display: none; }
.faq-summary .material-symbols-outlined { transition: transform 200ms; }
.faq-item[open] .faq-summary .material-symbols-outlined { transform: rotate(180deg); }
.faq-answer { margin-top: 1rem; }

/* Footer */
.site-footer {
  background-color: var(--gray-50);
  border-top: 1px solid var(--gray-200);
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
.footer-col { display: flex; flex-direction: column; gap: 1.5rem; }
.footer-brand { font-size: 1.25rem; font-weight: 700; color: var(--gray-900); }
.footer-socials { display: flex; gap: 1rem; }
.footer-socials a { color: var(--gray-400); transition: color 200ms; }
.footer-socials a:hover { color: var(--primary); }
.footer-title { font-weight: 700; color: var(--gray-900); text-transform: uppercase; letter-spacing: 0.05em; font-size: 0.75rem; }
.footer-links { display: flex; flex-direction: column; gap: 0.5rem; }
.footer-links a { color: var(--gray-500); transition: color 200ms; }
.footer-links a:hover { color: var(--primary); }
.footer-contact { display: flex; flex-direction: column; gap: 0.75rem; color: var(--gray-500); }
.footer-contact li { display: flex; align-items: center; gap: 0.75rem; }
.footer-bottom {
  max-width: 1280px;
  margin: 0 auto;
  padding: 1.5rem 2rem;
  border-top: 1px solid var(--gray-100);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}
.footer-bottom p { color: var(--gray-500); }
.footer-badges { display: flex; align-items: center; gap: 1.5rem; }
.footer-badge { height: 1.5rem; filter: grayscale(100%); opacity: 0.5; }

/* Media Queries for Responsive Layouts matching Tailwind breakpoints */
@media (min-width: 640px) { /* sm */
  .action-call { display: flex; }
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
<a class="header-logo" href="#">LOGO_PLACEHOLDER</a>
<nav class="nav-menu">
<a href="#services">Services</a>
<a href="#about">About Us</a>
<a href="#process">Our Process</a>
<a href="#testimonials">Testimonials</a>
<a href="#faqs">FAQs</a>
</nav>
<div class="header-actions">
<a class="action-call" href="tel:1234567890">
<span class="material-symbols-outlined">call</span>
<span class="font-semibold">Call Now</span>
</a>
<button class="btn-book">Book Appointment</button>
</div>
</div>
</header>
<main>
<!-- Hero Section -->
<section class="hero-wrapper">
<div class="hero-bg">
<img data-alt="High-quality professional dental clinic interior background" src="/assets/templates/healthcare/templates01/hero-image.png"/>
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
<button class="btn-quote high-elevation font-h3">Get Free Quote</button>
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
<form class="booking-form" onsubmit="event.preventDefault()">
<div class="form-group">
<label class="form-label font-label-bold">Full Name</label>
<input class="form-input" placeholder="John Doe" type="text" name="name" id="name"/>
</div>
<div class="form-row">
<div class="form-group">
<label class="form-label font-label-bold">Phone</label>
<input class="form-input" placeholder="+1 (555) 000" type="tel" name="phone" id="phone"/>
</div>
<div class="form-group">
<label class="form-label font-label-bold">Service</label>
<select class="form-input" name="service" id="service">
<option>Cosmetic Dentistry</option>
<option>General Checkup</option>
<option>Orthodontics</option>
<option>Dental Implants</option>
</select>
</div>
</div>
<div class="form-group">
<label class="form-label font-label-bold">Email</label>
<input class="form-input" placeholder="john@example.com" type="email" name="email_address" id="email_address"/>
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
<a class="service-link" href="#">
<span>Learn More</span>
<span class="material-symbols-outlined" style="font-size: 14px;">arrow_forward</span>
</a>
</div>
<!-- Card 2 -->
<div class="service-card low-elevation">
<div class="service-icon text-primary"><span class="material-symbols-outlined">auto_fix_high</span></div>
<h3 class="font-h3 text-on-surface">Cosmetic Dentistry</h3>
<p class="font-body-md text-secondary">Teeth whitening, veneers, and smile makeovers for a perfect look.</p>
<a class="service-link" href="#">
<span>Learn More</span>
<span class="material-symbols-outlined" style="font-size: 14px;">arrow_forward</span>
</a>
</div>
<!-- Card 3 -->
<div class="service-card low-elevation">
<div class="service-icon text-primary"><span class="material-symbols-outlined">align_horizontal_center</span></div>
<h3 class="font-h3 text-on-surface">Orthodontics</h3>
<p class="font-body-md text-secondary">Invisalign and traditional braces to align your teeth perfectly.</p>
<a class="service-link" href="#">
<span>Learn More</span>
<span class="material-symbols-outlined" style="font-size: 14px;">arrow_forward</span>
</a>
</div>
<!-- Card 4 -->
<div class="service-card low-elevation">
<div class="service-icon text-primary"><span class="material-symbols-outlined">medical_services</span></div>
<h3 class="font-h3 text-on-surface">Dental Implants</h3>
<p class="font-body-md text-secondary">Permanent solutions for missing teeth with natural-looking results.</p>
<a class="service-link" href="#">
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
<img data-alt="portrait of a smiling female dentist in a white lab coat standing in a high-tech dental office" src="/assets/templates/healthcare/templates01/dentist.png"/>
</div>
<div class="about-badge high-elevation">
<div class="badge-top">
<div class="badge-icon"><span class="material-symbols-outlined" style="color: var(--green-600);">verified</span></div>
<span class="font-h3 text-primary">15+ Years</span>
</div>
<p class="font-caption font-label-bold text-secondary text-on-surface">Of combined dental excellence and surgical experience.</p>
</div>
</div>
<div class="about-text">
<div>
<h2 class="font-h2" style="margin-bottom: 1rem;">Why Patients Trust Lumina Dental</h2>
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

<!-- Testimonials -->
<section class="py-xl" id="testimonials">
<div class="container">
<div class="section-intro">
<h2 class="font-h2" style="margin-bottom: 1rem;">What Our Patients Say</h2>
<div class="stars-center">
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">star</span>
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">star</span>
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">star</span>
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">star</span>
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">star</span>
</div>
</div>
<div class="testimonials-grid">
<div class="testimonial-card low-elevation">
<p class="testimonial-quote text-secondary">"The best dental experience I've ever had. The technology they use is mind-blowing, and I didn't feel a thing during my root canal."</p>
<div class="testimonial-author">
<img class="testimonial-img" data-alt="headshot of a smiling young woman with long dark hair in a bright outdoor setting" src="/assets/templates/healthcare/templates01/client-01.png"/>
<div>
<h5 class="testimonial-name">Sarah Jenkins</h5>
<p class="font-caption text-secondary">Patient for 3 Years</p>
</div>
</div>
</div>
<div class="testimonial-card low-elevation">
<p class="testimonial-quote text-secondary">"Invisalign at Lumina was so seamless. My teeth look perfect now and the team was incredibly supportive throughout the process."</p>
<div class="testimonial-author">
<img class="testimonial-img" data-alt="headshot of a professional man in a blue shirt smiling confidently" src="/assets/templates/healthcare/templates01/client-02.png"/>
<div>
<h5 class="testimonial-name">Michael Chen</h5>
<p class="font-caption text-secondary">Invisalign Patient</p>
</div>
</div>
</div>
<div class="testimonial-card low-elevation">
<p class="testimonial-quote text-secondary">"I used to have dental anxiety, but the staff here made me feel so welcome and relaxed. Highly recommend to everyone."</p>
<div class="testimonial-author">
<img class="testimonial-img" data-alt="headshot of a mature woman with a warm and friendly smile" src="/assets/templates/healthcare/templates01/client-03.png"/>
<div>
<h5 class="testimonial-name">Linda Ross</h5>
<p class="font-caption text-secondary">General Patient</p>
</div>
</div>
</div>
</div>
</div>
</section>

<!-- CTA Banner -->
<section class="py-xl">
<div class="container">
<div class="cta-banner primary-gradient">
<div class="cta-bg-icon">
<span class="material-symbols-outlined">dentistry</span>
</div>
<div class="cta-content">
<h2 class="font-h1 text-white">Start Your Smile Journey Today</h2>
<p class="font-body-lg">New patients get a 20% discount on their first full dental examination and cleaning.</p>
<div class="cta-actions">
<button class="btn-cta-1 high-elevation">Book Now</button>
<button class="btn-cta-2">Contact Us</button>
</div>
</div>
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
<a class="footer-brand" href="#">LOGO_PLACEHOLDER</a>
<p class="font-body-md text-secondary">Pioneering dental care with luxury comfort and advanced clinical expertise since 2009.</p>
<div class="footer-socials">
<a href="#"><span class="material-symbols-outlined">public</span></a>
<a href="#"><span class="material-symbols-outlined">chat</span></a>
<a href="#"><span class="material-symbols-outlined">video_camera_front</span></a>
</div>
</div>
<!-- Col 2 -->
<div class="footer-col" style="gap: 1rem;">
<h4 class="footer-title">Quick Links</h4>
<nav class="footer-links font-body-md">
<a href="#">Our Services</a>
<a href="#">About Our Team</a>
<a href="#">Success Stories</a>
<a href="#">Patient Portal</a>
</nav>
</div>
<!-- Col 3 -->
<div class="footer-col" style="gap: 1rem;">
<h4 class="footer-title">Support</h4>
<nav class="footer-links font-body-md">
<a href="#">Privacy Policy</a>
<a href="#">Terms of Service</a>
<a href="#">Accessibility</a>
<a href="#">FAQs</a>
</nav>
</div>
<!-- Col 4 -->
<div class="footer-col" style="gap: 1rem;">
<h4 class="footer-title">Contact</h4>
<ul class="footer-contact font-body-md">
<li>
<span class="material-symbols-outlined text-primary" style="font-size: 14px;">location_on</span>
<span>123 Dental Way, London, UK</span>
</li>
<li>
<span class="material-symbols-outlined text-primary" style="font-size: 14px;">phone</span>
<span>+44 20 7946 0000</span>
</li>
<li>
<span class="material-symbols-outlined text-primary" style="font-size: 14px;">mail</span>
<span>hello@luminadental.com</span>
</li>
</ul>
</div>
</div>
<div class="footer-bottom font-body-md">
<p>© 2024 PROJECT_NAME_PLACEHOLDER. All rights reserved.</p>
<div class="footer-badges">
<img class="footer-badge" data-alt="logo placeholder for a health certification board" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCKRJt8oBcseuSBGNndrrxoYVHunBUy5Dd1k93WnWZoHSHWyHpK8ODwNZhPX_lVIz2Yb2QiJ1B2vtSw7zthGFrsbmqrOoPy3azGCuqgaNmisJUZJa3sI_gK-tFV0AdZDG8vBjKzy2fanPFDokTJSGUX6rNkYcRU9nMXtdBa1eQEvL21OCs_Nx3JqpLMHGD-FgXUS2Kyi9BYou75JnSlnlCwfKh45NcTV4Tsv2CJXnfjn88WxNbVS6wP0Ygq13HiHk80DelkWwNkNyNt"/>
<img class="footer-badge" data-alt="logo placeholder for a dental association badge" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAUZ-bvybxaFEFV24fQb7cSrlMjN5cn0oxj4Kuo8oR8g0FRK5MGl5OeqlrfozU9NoLhZrP87woA4slmOg3urJ7V4tsCLpNc-06Pwmq8aFFWf2oRdIDSLttCtNWnqMeZX5hN_y1BAAX6xyv-eiYiGQcM72SQPmmKvOCwuT6t-y16AjLQu4-QiJ2qWCLlo2tmKZ996nIAovc5nZ6hvcctjhK2WLJV-0p64-KNzbGawRn5Z8JNxXMzhDsoSmzjrgDcepooxbQRoFD8DUyF"/>
</div>
</div>
</footer>
`;
