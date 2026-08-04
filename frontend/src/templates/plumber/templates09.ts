export const plumber09Styles = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Outfit:wght@300;400;500;700&display=swap');

:root {
  --primary: PRIMARY_COLOR_PLACEHOLDER;
  --secondary: SECONDARY_COLOR_PLACEHOLDER;
  --primary-rgb: PRIMARY_RGB_PLACEHOLDER;
  --secondary-rgb: SECONDARY_RGB_PLACEHOLDER;
  --bg-cream: #f4f5f0;
  --bg-white: #ffffff;
  --bg-dark: #1a201c;
  --text-dark: #1a201c;
  --text-muted: #5e6b63;
  --border: rgba(26,32,28,0.1);
  --border-light: rgba(255,255,255,0.1);
}

/* GrapesJS Editor Override */
body, .gjs-dashed, [data-gjs-type="wrapper"], main {
    background-color: var(--bg-cream) !important;
    color: var(--text-muted) !important;
}
h1, h2, h3, h4, h5, h6, p, span, div, a {
    color: inherit;
}


* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Outfit', sans-serif; color: var(--text-muted); background: var(--bg-cream); line-height: 1.6; overflow-x: hidden; }
h1, h2, h3, h4, h5, h6 { font-family: 'Space Grotesk', sans-serif; color: var(--text-dark); line-height: 1.1; font-weight: 700; letter-spacing: -0.02em; }
a { text-decoration: none; color: inherit; transition: 0.3s ease; }
img { max-width: 100%; display: block; border-radius: 20px; }
ul, ol { list-style: none; }

.container { max-width: 1440px; margin: 0 auto; padding: 0 4vw; position: relative; z-index: 10; }
.section { padding: 8vw 0; }
.bg-cream { background: var(--bg-cream); }
.bg-white { background: var(--bg-white); }
.bg-dark { background: var(--bg-dark); color: #fff; }
.bg-dark h1, .bg-dark h2, .bg-dark h3, .bg-dark h4 { color: #fff; }

.btn { display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 1.1rem 2.5rem; border-radius: 100px; font-weight: 600; font-size: 1rem; cursor: pointer; transition: 0.4s cubic-bezier(0.16,1,0.3,1); font-family: 'Space Grotesk', sans-serif; }
.btn-primary { background: var(--text-dark); color: #fff; border: 1px solid var(--text-dark); }
.btn-primary:hover { background: var(--primary); border-color: var(--primary); color: #fff; transform: translateY(-3px); }
.btn-outline { background: transparent; border: 1px solid var(--border); color: var(--text-dark); }
.btn-outline:hover { border-color: var(--text-dark); }
.bg-dark .btn-outline { border-color: var(--border-light); color: #fff; }
.bg-dark .btn-outline:hover { background: #fff; color: var(--text-dark); }

.pill { display: inline-block; padding: 0.5rem 1.25rem; background: rgba(var(--primary-rgb),0.1); color: var(--primary); border-radius: 100px; font-family: 'Space Grotesk', sans-serif; font-size: 0.85rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 2rem; border: 1px solid rgba(var(--primary-rgb),0.2); }

/* 1. Header */
.pl09-header { position: sticky; top: 0; left: 0; width: 100%; z-index: 100; background: rgba(244, 245, 240, 0.8); backdrop-filter: blur(20px); padding: 1.5rem 0; border-bottom: 1px solid var(--border); }
.pl09-header-inner { display: flex; justify-content: space-between; align-items: center; }
.pl09-logo { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 1.75rem; color: var(--text-dark); display: flex; align-items: center; gap: 0.5rem; letter-spacing: -1px; }
.pl09-logo img { max-height: 45px; width: auto; object-fit: contain; }
.pl09-logo svg { color: var(--primary); width: 32px; height: 32px; }

/* 2. Hero - Asymmetrical split */
.pl09-hero { padding: 4vw 0 8vw; position: relative; }
.pl09-hero-grid { display: grid; grid-template-columns: 1fr 1.2fr; gap: 4vw; align-items: center; }
.pl09-hero-content { position: relative; z-index: 2; padding-right: 2vw; }
.pl09-hero-content h1 { font-size: clamp(2.5rem, 3vw, 4rem); line-height: 0.95; margin-bottom: 2rem; color: var(--text-dark); }
.pl09-hero-content p { font-size: clamp(1.1rem, 1.5vw, 1.35rem); margin-bottom: 3rem; max-width: 90%; color: var(--text-muted); line-height: 1.6; font-weight: 400; }
.pl09-hero-img-wrap { position: relative; height: 80vh; min-height: 600px; border-radius: 40px; overflow: hidden; }
.pl09-hero-img { width: 100%; height: 100%; object-fit: cover; border-radius: 40px; }
.pl09-badge-float { position: absolute; bottom: 3vw; left: -4vw; background: #fff; padding: 2rem; border-radius: 24px; box-shadow: 0 30px 60px rgba(0,0,0,0.08); display: flex; align-items: center; gap: 1.5rem; max-width: 350px; }
.pl09-badge-float svg { width: 48px; height: 48px; color: var(--primary); flex-shrink: 0; }
.pl09-badge-float p { margin: 0; font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 1.1rem; color: var(--text-dark); line-height: 1.3; }

/* 3. Marquee */
.pl09-marquee { background: var(--bg-dark); padding: 2rem 0; overflow: hidden; display: flex; white-space: nowrap; }
.pl09-marquee-inner { display: flex; animation: marquee 20s linear infinite; gap: 4rem; align-items: center; }
.pl09-marquee-item { color: rgba(255,255,255,0.7); font-family: 'Space Grotesk', sans-serif; font-size: 1.25rem; font-weight: 500; display: flex; align-items: center; gap: 1rem; text-transform: uppercase; letter-spacing: 2px; }
.pl09-marquee-item svg { width: 24px; height: 24px; color: var(--primary); }
@keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }

/* 4. Split Services (Sticky Scroll) */
.pl09-services-wrap { padding: 10vw 0; }
.pl09-services-layout { display: grid; grid-template-columns: 1fr 1.5fr; gap: 6vw; align-items: start; }
.pl09-services-title { position: sticky; top: 150px; }
.pl09-services-title h2 { font-size: clamp(3rem, 4.5vw, 4.5rem); margin-bottom: 2rem; }
.pl09-services-title p { font-size: 1.2rem; margin-bottom: 3rem; max-width: 400px; }
.pl09-services-list { display: flex; flex-direction: column; gap: 4vw; }
.pl09-service-card { background: #fff; border-radius: 30px; padding: 4vw; border: 1px solid var(--border); transition: 0.4s; }
.pl09-service-card:hover { transform: translateX(-10px); box-shadow: 20px 20px 60px rgba(0,0,0,0.05); border-color: var(--primary); }
.pl09-service-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; }
.pl09-service-icon { width: 80px; height: 80px; background: var(--bg-cream); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--primary); }
.pl09-service-icon svg { width: 36px; height: 36px; }
.pl09-service-card h3 { font-size: 2.2rem; margin-bottom: 1rem; }
.pl09-service-card p { font-size: 1.1rem; margin-bottom: 2rem; max-width: 90%; }
.pl09-service-card a { font-family: 'Space Grotesk', sans-serif; font-weight: 600; color: var(--text-dark); display: inline-flex; align-items: center; gap: 0.5rem; text-transform: uppercase; font-size: 0.9rem; letter-spacing: 1px; }
.pl09-service-card a svg { width: 18px; height: 18px; transition: 0.3s; }
.pl09-service-card a:hover { color: var(--primary); }
.pl09-service-card a:hover svg { transform: translateX(5px); }

/* 5. Process (Zig-Zag) */
.pl09-process { background: var(--bg-dark); color: #fff; padding: 10vw 0; border-radius: 40px; margin: 0 2vw; }
.pl09-process-header { text-align: center; margin-bottom: 6vw; }
.pl09-process-header h2 { font-size: clamp(2.5rem, 4vw, 4rem); }
.pl09-process-row { display: grid; grid-template-columns: 1fr 1fr; gap: 4vw; align-items: center; margin-bottom: 6vw; }
.pl09-process-row:nth-child(even) { grid-template-columns: 1fr 1fr; direction: rtl; }
.pl09-process-row:nth-child(even) > * { direction: ltr; }
.pl09-process-img { width: 100%; aspect-ratio: 4/3; object-fit: cover; border-radius: 30px; }
.pl09-process-content { padding: 0 3vw; }
.pl09-process-num { font-family: 'Space Grotesk', sans-serif; font-size: 4rem; color: var(--primary); font-weight: 300; line-height: 1; margin-bottom: 1rem; }
.pl09-process-content h3 { font-size: 2.2rem; margin-bottom: 1.5rem; }
.pl09-process-content p { font-size: 1.1rem; color: rgba(255,255,255,0.7); }

/* 6. Interactive Eco-Tips (Masonry look) */
.pl09-tips { padding: 10vw 0; }
.pl09-tips-title { text-align: center; margin-bottom: 6vw; }
.pl09-tips-title h2 { font-size: clamp(2.5rem, 4vw, 4rem); }
.pl09-tips-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2vw; align-items: start; }
.pl09-tip-card { background: #fff; border-radius: 30px; padding: 3vw; border: 1px solid var(--border); }
.pl09-tips-grid .pl09-tip-card:nth-child(2) { transform: translateY(4vw); }
.pl09-tips-grid .pl09-tip-card:nth-child(3) { transform: translateY(8vw); }
.pl09-tip-card svg { width: 48px; height: 48px; color: var(--primary); margin-bottom: 2rem; }
.pl09-tip-card h4 { font-size: 1.5rem; margin-bottom: 1rem; }
.pl09-tip-card p { font-size: 1rem; }

/* 7. Massive Quote */
.pl09-quote { padding: 8vw 0; text-align: center; max-width: 1000px; margin: 0 auto; }
.pl09-quote-icon { font-family: 'Space Grotesk', sans-serif; font-size: 6rem; color: var(--primary); line-height: 0.5; margin-bottom: 2rem; opacity: 0.3; }
.pl09-quote h3 { font-size: clamp(1.8rem, 3vw, 3rem); font-weight: 400; line-height: 1.4; margin-bottom: 3rem; }
.pl09-quote-author { display: flex; align-items: center; justify-content: center; gap: 1rem; }
.pl09-quote-author img { width: 60px; height: 60px; border-radius: 50%; object-fit: cover; }
.pl09-quote-author div { text-align: left; }
.pl09-quote-author h4 { font-size: 1.1rem; margin: 0; }
.pl09-quote-author span { font-size: 0.9rem; color: var(--text-muted); }

/* 8. FAQ Accordion (Clean) */
.pl09-faq { max-width: 800px; margin: 0 auto; padding: 8vw 0; }
.pl09-faq-header { margin-bottom: 4rem; text-align: center; }
.pl09-faq-header h2 { font-size: clamp(2.5rem, 4vw, 4rem); }
.pl09-faq-item { border-bottom: 1px solid var(--border); margin-bottom: 1rem; }
.pl09-faq-item summary { font-family: 'Space Grotesk', sans-serif; font-size: 1.35rem; font-weight: 500; color: var(--text-dark); cursor: pointer; padding: 1.5rem 0; display: flex; justify-content: space-between; align-items: center; list-style: none; }
.pl09-faq-item summary::-webkit-details-marker { display: none; }
.pl09-faq-item summary::after { content: '+'; font-size: 1.5rem; color: var(--text-muted); transition: 0.3s; }
.pl09-faq-item[open] summary::after { transform: rotate(45deg); color: var(--text-dark); }
.pl09-faq-body { padding-bottom: 2rem; font-size: 1.05rem; line-height: 1.7; color: var(--text-muted); }

/* 9. Contact Section */
.pl09-contact { background: #fff; margin: 0 2vw 2vw; border-radius: 40px; padding: 8vw 4vw; border: 1px solid var(--border); }
.pl09-contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6vw; }
.pl09-c-info h2 { font-size: clamp(3rem, 4.5vw, 4.5rem); margin-bottom: 2rem; }
.pl09-c-info p { font-size: 1.25rem; margin-bottom: 4rem; max-width: 500px; }
.pl09-c-meta { display: flex; flex-direction: column; gap: 2.5rem; }
.pl09-c-meta-item h4 { font-size: 1rem; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 0.5rem; color: var(--text-muted); }
.pl09-c-meta-item p { font-family: 'Space Grotesk', sans-serif; font-size: 1.5rem; font-weight: 600; color: var(--text-dark); margin: 0; }
.pl09-form-wrap { background: var(--bg-cream); padding: 4vw; border-radius: 30px; }
.pl09-form { display: flex; flex-direction: column; gap: 1.5rem; }
.pl09-fg input, .pl09-fg select, .pl09-fg textarea { width: 100%; padding: 1.25rem 1.5rem; border-radius: 16px; border: 1px solid var(--border); background: #fff; font-family: 'Outfit', sans-serif; font-size: 1.05rem; transition: 0.3s; }
.pl09-fg input:focus, .pl09-fg select:focus, .pl09-fg textarea:focus { border-color: var(--text-dark); outline: none; }
.pl09-form button { margin-top: 1rem; width: 100%; }

/* 10. Footer */
.pl09-footer { padding: 4vw 4vw 2vw; }
.pl09-footer-top { display: flex; justify-content: space-between; align-items: flex-end; padding-bottom: 4rem; border-bottom: 1px solid var(--border); margin-bottom: 2rem; }
.pl09-footer-top h2 { font-size: clamp(2rem, 3vw, 3rem); margin-bottom: 1rem; max-width: 500px; }
.pl09-footer-social { display: flex; gap: 1rem; }
.pl09-footer-social a { width: 50px; height: 50px; border-radius: 50%; background: #fff; border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; color: var(--text-dark); transition: 0.3s; }
.pl09-footer-social a:hover { background: var(--text-dark); color: #fff; }
.pl09-footer-bottom { display: flex; justify-content: space-between; font-size: 0.95rem; font-weight: 500; }
.pl09-footer-links { display: flex; gap: 2rem; }
.pl09-footer-links a:hover { color: var(--text-dark); }

@media (max-width: 1024px) {
  .pl09-hero-grid, .pl09-services-layout, .pl09-contact-grid { grid-template-columns: 1fr; gap: 4rem; }
  .pl09-hero-img-wrap { height: 60vh; min-height: auto; }
  .pl09-badge-float { left: 4vw; bottom: 4vw; }
  .pl09-services-title { position: static; }
  .pl09-process-row, .pl09-process-row:nth-child(even) { grid-template-columns: 1fr; direction: ltr; }
  .pl09-process-content { padding: 0; }
  .pl09-tips-grid { grid-template-columns: 1fr; gap: 2rem; }
  .pl09-tips-grid .pl09-tip-card:nth-child(n) { transform: none; }
  .pl09-footer-top { flex-direction: column; align-items: flex-start; gap: 2rem; }
  .pl09-footer-bottom { flex-direction: column-reverse; gap: 1.5rem; text-align: left; }
}
@media (max-width: 768px) {
  .pl09-hero-content h1 { font-size: 3.5rem; }
  .pl09-badge-float { display: none; }
  .pl09-c-meta-item p { font-size: 1.25rem; }
  .pl09-form-wrap { padding: 6vw 4vw; }
}
`;

export const plumber09Html = `
<!-- 1. Header -->
<header class="pl09-header">
  <div class="container pl09-header-inner">
    <a href="javascript:void(0);" class="pl09-logo">LOGO_PLACEHOLDER</a>
    <a href="javascript:void(0);" class="btn btn-primary" style="padding: 0.75rem 2rem; font-size: 0.9rem;">Book Audit</a>
  </div>
</header>

<!-- 2. Hero Split -->
<section class="pl09-hero">
  <div class="container pl09-hero-grid">
    <div class="pl09-hero-content">
      <div class="pill">Next-Gen Plumbing</div>
      <h1>Intelligent water systems for modern living.</h1>
      <p>We completely rethink residential plumbing—designing, installing, and maintaining eco-friendly water systems that look beautiful and perform flawlessly.</p>
      <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
        <a href="javascript:void(0);" class="btn btn-primary">Schedule Assessment</a>
        <a href="tel:PHONE_PLACEHOLDER" class="btn btn-outline">Call PHONE_PLACEHOLDER</a>
      </div>
    </div>
    <div class="pl09-hero-img-wrap">
      <img src="https://images.unsplash.com/photo-1585704032915-c3400ca199e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Eco Plumbing" class="pl09-hero-img">
      <div class="pl09-badge-float">
        <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><path d="M12 8v4l3 3"></path></svg>
        <p>Over 10 Million Gallons Saved Annually.</p>
      </div>
    </div>
  </div>
</section>

<!-- 3. Marquee -->
<div class="pl09-marquee">
  <div class="pl09-marquee-inner">
    <div class="pl09-marquee-item"><svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M5 12l5 5L20 7"></path></svg> Licensed & Insured</div>
    <div class="pl09-marquee-item"><svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M5 12l5 5L20 7"></path></svg> Zero Landfill Waste</div>
    <div class="pl09-marquee-item"><svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M5 12l5 5L20 7"></path></svg> Upfront Pricing</div>
    <div class="pl09-marquee-item"><svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M5 12l5 5L20 7"></path></svg> Smart Water Certified</div>
    
    <!-- Duplicate for infinite scroll -->
    <div class="pl09-marquee-item"><svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M5 12l5 5L20 7"></path></svg> Licensed & Insured</div>
    <div class="pl09-marquee-item"><svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M5 12l5 5L20 7"></path></svg> Zero Landfill Waste</div>
    <div class="pl09-marquee-item"><svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M5 12l5 5L20 7"></path></svg> Upfront Pricing</div>
    <div class="pl09-marquee-item"><svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M5 12l5 5L20 7"></path></svg> Smart Water Certified</div>
  </div>
</div>

<!-- 4. Split Services -->
<section class="pl09-services-wrap" id="services">
  <div class="container pl09-services-layout">
    <div class="pl09-services-title">
      <div class="pill">Capabilities</div>
      <h2>Engineered Solutions</h2>
      <p>We handle everything from rapid leak mitigation to full-scale intelligent repiping. Every service is optimized for minimal environmental impact.</p>
    </div>
    
    <div class="pl09-services-list">
      <div class="pl09-service-card hp30-service-row">
        <div class="pl09-service-header">
          <div class="pl09-service-icon">
            <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
          </div>
          <h2>01</h2>
        </div>
        <h3>Tankless Water Systems</h3>
        <p>Unlimited hot water, precisely when you need it. Our high-efficiency tankless installations reduce energy consumption by up to 40% compared to traditional tanks.</p>
        <a href="javascript:void(0);">Schedule Installation <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M5 12h14"></path><path d="M12 5l7 7-7 7"></path></svg></a>
      </div>
      
      <div class="pl09-service-card hp30-service-row">
        <div class="pl09-service-header">
          <div class="pl09-service-icon">
            <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 2.69l5.66 4.25a8 8 0 1 1-11.31 0z"></path></svg>
          </div>
          <h2>02</h2>
        </div>
        <h3>Smart Leak Detection</h3>
        <p>We integrate whole-home acoustic sensors and auto-shutoff valves that instantly detect micro-leaks and prevent catastrophic water damage before it occurs.</p>
        <a href="javascript:void(0);">Get Protected <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M5 12h14"></path><path d="M12 5l7 7-7 7"></path></svg></a>
      </div>
      
      <div class="pl09-service-card hp30-service-row">
        <div class="pl09-service-header">
          <div class="pl09-service-icon">
            <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
          </div>
          <h2>03</h2>
        </div>
        <h3>Bio-Drain Restoration</h3>
        <p>No harsh chemicals. We clear main line blockages using high-pressure hydro-jetting and natural enzymatic treatments that preserve pipe integrity.</p>
        <a href="javascript:void(0);">Clear Drains <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M5 12h14"></path><path d="M12 5l7 7-7 7"></path></svg></a>
      </div>
    </div>
  </div>
</section>

<!-- 5. Process Zig-Zag -->
<section class="pl09-process">
  <div class="container">
    <div class="pl09-process-header">
      <div class="pill" style="border-color: rgba(255,255,255,0.2); color: #fff;">Workflow</div>
      <h2>Our Modern Process</h2>
    </div>
    
    <div class="pl09-process-row">
      <img src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Process 1" class="pl09-process-img">
      <div class="pl09-process-content">
        <div class="pl09-process-num">01.</div>
        <h3>Comprehensive Audit</h3>
        <p>Before any wrench is turned, we conduct a full pressure test and visual inspection of your home's water lines to identify hidden inefficiencies.</p>
      </div>
    </div>
    
    <div class="pl09-process-row">
      <img src="https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Process 2" class="pl09-process-img">
      <div class="pl09-process-content">
        <div class="pl09-process-num">02.</div>
        <h3>Transparent Strategy</h3>
        <p>We present a digital, flat-rate proposal detailing the required repairs and highlighting optional green upgrades that will lower your monthly utility costs.</p>
      </div>
    </div>
    
    <div class="pl09-process-row">
      <img src="https://images.unsplash.com/photo-1621905252507-b35492cc74b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Process 3" class="pl09-process-img">
      <div class="pl09-process-content">
        <div class="pl09-process-num">03.</div>
        <h3>Precision Execution</h3>
        <p>Our technicians execute the plan cleanly and quietly. All replaced brass, copper, and porcelain parts are transported to specialized recycling facilities.</p>
      </div>
    </div>
  </div>
</section>

<!-- 6. Eco-Tips Masonry -->
<section class="pl09-tips">
  <div class="container">
    <div class="pl09-tips-title">
      <div class="pill">Education</div>
      <h2>Conservation Insights</h2>
    </div>
    
    <div class="pl09-tips-grid">
      <div class="pl09-tip-card">
        <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
        <h4>Pressure Regulators</h4>
        <p>Excessive home water pressure not only wastes water but destroys appliance seals. We install regulators to extend the life of your dishwasher and washing machine.</p>
      </div>
      
      <div class="pl09-tip-card">
        <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 12h18"></path><path d="M3 6h18"></path><path d="M3 18h18"></path></svg>
        <h4>Pipe Insulation</h4>
        <p>Exposed hot water lines in basements and crawlspaces lose massive amounts of heat. Simple high-R-value foam insulation delivers hot water faster and saves gas.</p>
      </div>
      
      <div class="pl09-tip-card">
        <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path></svg>
        <h4>Aerator Upgrades</h4>
        <p>Replacing standard bathroom faucet aerators with 1.0 GPM models saves the average family of four over 3,000 gallons of water per year with zero pressure loss.</p>
      </div>
    </div>
  </div>
</section>

<!-- 7. Massive Quote -->
<section class="pl09-quote">
  <div class="container">
    <div class="pl09-quote-icon">"</div>
    <h3>EcoPlumb completely transformed our home's water system. The smart leak detector they installed caught a hidden pipe burst while we were on vacation, literally saving our house from ruin.</h3>
    <div class="pl09-quote-author">
      <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" alt="Author">
      <div>
        <h4>Sarah Jenkins</h4>
        <span>Smart Homeowner</span>
      </div>
    </div>
  </div>
</section>

<!-- 8. FAQ -->
<section class="pl09-faq">
  <div class="container">
    <div class="pl09-faq-header">
      <h2>Common Inquiries</h2>
    </div>
    
    <details class="pl09-faq-item" open>
      <summary>Do smart leak detectors require Wi-Fi to function?</summary>
      <div class="pl09-faq-body faq-body">While Wi-Fi is required to send alerts to your smartphone, the physical auto-shutoff mechanism operates locally via an internal battery backup. If water is detected, it shuts off instantly, even during a power or internet outage.</div>
    </details>
    <details class="pl09-faq-item">
      <summary>How much space does a tankless water heater save?</summary>
      <div class="pl09-faq-body faq-body">Traditional tanks hold 40-50 gallons and take up significant floor space. Tankless systems are about the size of a carry-on suitcase and mount directly to the wall, freeing up your entire utility closet.</div>
    </details>
    <details class="pl09-faq-item">
      <summary>Can you retro-fit old plumbing with new low-flow fixtures?</summary>
      <div class="pl09-faq-body faq-body">Yes. We can retro-fit almost any home, regardless of age, with high-efficiency toilets and showerheads without needing to alter the underlying pipe infrastructure.</div>
    </details>
  </div>
</section>

<!-- 9. Contact -->
<section class="pl09-contact" id="contact">
  <div class="container pl09-contact-grid">
    <div class="pl09-c-info">
      <h2>Start your system upgrade.</h2>
      <p>Schedule an assessment with our engineering team to discuss repairs, smart monitoring, or full system overhauls.</p>
      
      <div class="pl09-c-meta">
        <div class="pl09-c-meta-item">
          <h4>Dispatch Line</h4>
          <p>PHONE_PLACEHOLDER</p>
        </div>
        <div class="pl09-c-meta-item">
          <h4>Electronic Mail</h4>
          <p>EMAIL_PLACEHOLDER</p>
        </div>
      </div>
    </div>
    
    <div class="pl09-form-wrap">
      <form class="pl09-form lead-capture-form">
        <div class="pl09-fg">
          <input type="text" name="name" placeholder="Primary Contact Name" required>
        </div>
        <div class="pl09-fg">
          <input type="tel" name="phone" placeholder="Mobile Number" required>
        </div>
        <div class="pl09-fg">
          <select name="service" required>
            <option value="">Select Project Scope...</option>
            <option>Smart Leak Protection</option>
            <option>Tankless Heater Installation</option>
            <option>General Repair / Audit</option>
            <option>Whole-Home Filtration</option>
          </select>
        </div>
        <button type="submit" class="btn btn-primary">Initialize Request</button>
      </form>
    </div>
  </div>
</section>

<!-- 10. Footer -->
<footer class="pl09-footer">
  <div class="container">
    <div class="pl09-footer-top">
      <div>
        <div class="pl09-logo">LOGO_PLACEHOLDER</div>
        <p style="color: var(--text-muted); font-size: 1.1rem;">Engineering sustainable water systems for the modern home.</p>
      </div>
      <div class="pl09-footer-social">
        <a href="javascript:void(0);"><svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.56v.03a10 10 0 0 1-2.83.77 4.9 4.9 0 0 0 2.16-2.72 9.8 9.8 0 0 1-3.1 1.18 4.9 4.9 0 0 0-8.34 4.48A13.9 13.9 0 0 1 1.67 3.15 4.9 4.9 0 0 0 3.2 9.68a4.9 4.9 0 0 1-2.22-.61v.06a4.9 4.9 0 0 0 3.93 4.8 4.9 4.9 0 0 1-2.21.08 4.9 4.9 0 0 0 4.58 3.4 9.86 9.86 0 0 1-6.1 2.1c-.39 0-.79-.02-1.17-.07a13.9 13.9 0 0 0 7.55 2.21c9.06 0 14-7.5 14-14v-.64a10 10 0 0 0 2.46-2.55z"></path></svg></a>
        <a href="javascript:void(0);"><svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"></path></svg></a>
      </div>
    </div>
    <div class="pl09-footer-bottom">
      <div>&copy; 2026 PROJECT_NAME_PLACEHOLDER. All Rights Reserved.</div>
      <div class="pl09-footer-links">
        <a href="javascript:void(0);">Privacy Policy</a>
        <a href="javascript:void(0);">Terms of Service</a>
      </div>
    </div>
  </div>
</footer>
`;
