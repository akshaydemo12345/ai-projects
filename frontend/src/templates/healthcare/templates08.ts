export const healthcare08Styles = `
@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap');

:root {
  --primary: PRIMARY_COLOR_PLACEHOLDER;
  --secondary: SECONDARY_COLOR_PLACEHOLDER;
  --primary-rgb: PRIMARY_RGB_PLACEHOLDER;
  --secondary-rgb: SECONDARY_RGB_PLACEHOLDER;
  --ink: #24322c;
  --paper: #fffdf9;
  --paper-2: rgba(var(--primary-rgb), 0.08);
  --muted: #7c8580;
  --line: #eee6d8;
}

* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Inter', sans-serif; color: var(--ink); background: var(--paper); line-height: 1.65; overflow-x: hidden; }
h1, h2, h3, h4 { font-family: 'Quicksand', sans-serif; font-weight: 700; line-height: 1.2; color: var(--ink); }
.container { max-width: 1180px; margin: 0 auto; padding: 0 1.5rem; position: relative; z-index: 5; }
img { max-width: 100%; display: block; }
a { text-decoration: none; color: inherit; transition: 0.3s; }
.eyebrow { display: inline-flex; align-items: center; gap: 0.5rem; color: var(--primary); font-weight: 700; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 1rem; }
.eyebrow::before { content: '●'; font-size: 0.6rem; }

.btn { display: inline-flex; align-items: center; gap: 0.6rem; padding: 0.95rem 2rem; border-radius: 50px; font-weight: 700; font-size: 0.9rem; cursor: pointer; border: 1px solid transparent; }
.btn-primary { background: var(--primary); color: #fff; box-shadow: 0 12px 24px rgba(var(--primary-rgb),0.25); }
.btn-primary:hover { transform: translateY(-2px); box-shadow: 0 16px 30px rgba(var(--primary-rgb),0.3); }
.btn-outline { border: 2px solid var(--ink); color: var(--ink); }
.btn-outline:hover { background: var(--ink); color: #fff; }
.btn-white { background: #fff; color: var(--primary); }

/* Header */
.hc8-header { padding: 1.5rem 0; background: #ffffff; border-bottom: 1px solid var(--line); }
.hc8-header-inner { display: flex; justify-content: space-between; align-items: center; }
.hc8-logo { display: flex; align-items: center; gap: 0.65rem; font-family: 'Quicksand', sans-serif; font-weight: 700; font-size: 1.4rem; }
.hc8-logo .ic { width: 40px; height: 40px; border-radius: 50%; background: var(--primary); color: #fff; display: flex; align-items: center; justify-content: center; }

/* Hero - asymmetric, rounded blob image, no scheduler widget */
.hc8-hero { padding: 3rem 0 5rem; position: relative; }
.hc8-hero-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: center; }
.hc8-hero-copy h1 { font-size: 3rem; margin-bottom: 1.25rem; }
.hc8-hero-copy p { color: var(--muted); font-size: 1.05rem; max-width: 460px; margin-bottom: 2rem; }
.hc8-hero-actions { display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 2rem; }
.hc8-hero-badges { display: flex; gap: 1.5rem; flex-wrap: wrap; }
.hc8-hero-badge { display: flex; align-items: center; gap: 0.6rem; font-size: 0.85rem; color: var(--muted); }
.hc8-hero-badge .ic { width: 30px; height: 30px; border-radius: 50%; background: var(--paper-2); color: var(--primary); display: flex; align-items: center; justify-content: center; }
.hc8-hero-visual { position: relative; }
.hc8-hero-visual .blob { position: absolute; inset: -6%; background: var(--paper-2); border-radius: 48% 52% 60% 40% / 45% 55% 45% 55%; z-index: 0; }
.hc8-hero-visual img { position: relative; z-index: 1; width: 100%; height: 460px; object-fit: cover; border-radius: 48% 52% 60% 40% / 45% 55% 45% 55%; }
.hc8-hero-floater { position: absolute; z-index: 2; bottom: 0.5rem; left: -1.5rem; background: #fff; border-radius: 18px; padding: 1.1rem 1.4rem; box-shadow: 0 20px 40px rgba(0,0,0,0.1); display: flex; align-items: center; gap: 0.75rem; }
.hc8-hero-floater .ic { width: 40px; height: 40px; border-radius: 50%; background: var(--primary); color: #fff; display: flex; align-items: center; justify-content: center; }
.hc8-hero-floater h4 { font-size: 1.15rem; }
.hc8-hero-floater p { font-size: 0.72rem; color: var(--muted); }

/* Services - Modern Grid Cards */
.hc8-services { padding: 6rem 0; background: var(--paper-2); position: relative; overflow: hidden; }
.hc8-services-head { text-align: center; max-width: 680px; margin: 0 auto 3.5rem; }
.hc8-services-head h2 { font-size: 2.8rem; letter-spacing: -0.5px; }
.hc8-services-head p { color: var(--muted); font-size: 1.05rem; margin-top: 0.75rem; }
.hc8-services-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.75rem; }
.hc8-service-pill { background: #ffffff; border-radius: 24px; padding: 2.25rem 1.75rem; border: 1px solid var(--line); transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.35s ease; position: relative; display: flex; flex-direction: column; justify-content: space-between; }
.hc8-service-pill:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(var(--primary-rgb), 0.12); border-color: rgba(var(--primary-rgb), 0.35); }
.hc8-service-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; }
.hc8-service-pill .ic { width: 58px; height: 58px; border-radius: 18px; background: linear-gradient(135deg, rgba(var(--primary-rgb),0.12), rgba(var(--primary-rgb),0.05)); color: var(--primary); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; transition: 0.3s; }
.hc8-service-pill:hover .ic { background: var(--primary); color: #ffffff; transform: scale(1.05); }
.hc8-service-pill .tag { font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; padding: 0.35rem 0.75rem; border-radius: 50px; background: rgba(var(--primary-rgb),0.08); color: var(--primary); }
.hc8-service-pill h4 { font-size: 1.25rem; margin-bottom: 0.65rem; color: var(--ink); }
.hc8-service-pill p { color: var(--muted); font-size: 0.9rem; line-height: 1.6; margin-bottom: 1.5rem; }
.hc8-service-link { display: inline-flex; align-items: center; gap: 0.4rem; font-size: 0.85rem; font-weight: 700; color: var(--primary); transition: 0.3s; }
.hc8-service-pill:hover .hc8-service-link { gap: 0.75rem; }
.hc8-tip-card img{width: 100%;}

/* How it works - 3 step cards with connecting dashed line */
.hc8-steps { padding: 5.5rem 0; }
.hc8-steps-head { text-align: center; max-width: 600px; margin: 0 auto 3.5rem; }
.hc8-steps-head h2 { font-size: 2.5rem; }
.hc8-steps-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; position: relative; }
.hc8-steps-row::before { content: ''; position: absolute; top: 34px; left: 16%; right: 16%; border-top: 2px dashed var(--line); z-index: 0; }
.hc8-step { text-align: center; position: relative; z-index: 1; }
.hc8-step .num { width: 68px; height: 68px; border-radius: 50%; background: var(--primary); color: #fff; font-family: 'Quicksand', sans-serif; font-weight: 700; font-size: 1.4rem; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.25rem; }
.hc8-step h4 { font-size: 1.2rem; margin-bottom: 0.5rem; }
.hc8-step p { color: var(--muted); font-size: 0.88rem; max-width: 240px; margin: 0 auto; }

/* Doctors - circular avatar row */
.hc8-doctors { padding: 5.5rem 0; background: var(--paper-2); }
.hc8-doctors-head { text-align: center; max-width: 600px; margin: 0 auto 3.5rem; }
.hc8-doctors-head h2 { font-size: 2.5rem; }
.hc8-doctor-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2rem; }
.hc8-doctor { text-align: center; }
.hc8-doctor img { width: 140px; height: 140px; border-radius: 50%; object-fit: cover; border: 6px solid #fff; box-shadow: 0 15px 30px rgba(0,0,0,0.08); margin: 0 auto 1.1rem; }
.hc8-doctor h4 { font-size: 1.1rem; }
.hc8-doctor p { color: var(--primary); font-size: 0.78rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }

/* Testimonials - two side by side */
.hc8-testimonials { padding: 5.5rem 0; }
.hc8-testimonials-head { text-align: center; max-width: 600px; margin: 0 auto 3.5rem; }
.hc8-testimonials-head h2 { font-size: 2.5rem; }
.hc8-t-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.75rem; }
.hc8-t-card { background: #fff; border: 1px solid var(--line); border-radius: 20px; padding: 2.25rem; }
.hc8-t-card .stars { color: #f5a623; margin-bottom: 1rem; }
.hc8-t-card p.quote { color: var(--ink); font-size: 1rem; margin-bottom: 1.5rem; }
.hc8-t-person { display: flex; align-items: center; gap: 0.9rem; }
.hc8-t-person img { width: 44px; height: 44px; border-radius: 50%; object-fit: cover; }
.hc8-t-person span { display: block; font-weight: 700; font-size: 0.9rem; }
.hc8-t-person small { color: var(--muted); font-size: 0.78rem; }

/* Health tips / articles */
.hc8-tips { padding: 5.5rem 0; background: var(--paper-2); }
.hc8-tips-head { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 3rem; gap: 1.5rem; flex-wrap: wrap; }
.hc8-tips-head h2 { font-size: 2.5rem; max-width: 500px; }
.hc8-tips-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.75rem; }
.hc8-tip-card { background: #fff; border-radius: 20px; overflow: hidden; }
.hc8-tip-card img { height: 190px; object-fit: cover; }
.hc8-tip-card-body { padding: 1.75rem; }
.hc8-tip-card-body span.cat { color: var(--primary); font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
.hc8-tip-card-body h4 { font-size: 1.15rem; margin: 0.5rem 0 0.6rem; }
.hc8-tip-card-body p { color: var(--muted); font-size: 0.85rem; }

/* CTA - rounded gradient banner */
.hc8-cta { padding: 4rem 1.5rem; }
.hc8-cta-inner { max-width: 1180px; margin: 0 auto; background: linear-gradient(120deg, var(--primary), var(--secondary)); border-radius: 32px; padding: 4rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 2rem; }
.hc8-cta-inner h2 { color: #fff; font-size: 2.2rem; max-width: 520px; }
.hc8-cta-inner p { color: rgba(255,255,255,0.8); margin-top: 0.75rem; max-width: 460px; }

/* Appointment form - soft card, single column centered */
.hc8-appointment { padding: 6rem 0; }
.hc8-appointment-inner { max-width: 720px; margin: 0 auto; background: #fff; border: 1px solid var(--line); border-radius: 28px; padding: 3rem; }
.hc8-appointment-inner h2 { text-align: center; font-size: 2.2rem; margin-bottom: 0.5rem; }
.hc8-appointment-inner > p { text-align: center; color: var(--muted); margin-bottom: 2rem; }
.hc8-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.1rem; margin-bottom: 1.1rem; }
.hc8-fg label { display: block; font-size: 0.78rem; font-weight: 700; color: var(--muted); margin-bottom: 0.4rem; }
.hc8-fg input, .hc8-fg select, .hc8-fg textarea { width: 100%; padding: 0.85rem 1.1rem; border: 1px solid var(--line); border-radius: 12px; font-family: 'Inter', sans-serif; font-size: 0.9rem; outline: none; background: var(--paper); }
.hc8-fg input:focus, .hc8-fg select:focus, .hc8-fg textarea:focus { border-color: var(--primary); }
.hc8-fg textarea { resize: vertical; min-height: 80px; }
.hc8-form-full { grid-column: 1 / -1; }

/* Footer */
.hc8-footer { background: var(--secondary); color: #fff; padding-top: 4rem; }
.hc8-footer-grid { display: grid; grid-template-columns: 1.2fr 0.8fr 0.8fr 1fr; gap: 3rem; padding-bottom: 3rem; border-bottom: 1px solid rgba(255,255,255,0.1); }
.hc8-footer-logo { display: flex; align-items: center; gap: 0.6rem; font-family: 'Quicksand', sans-serif; font-weight: 700; font-size: 1.3rem; margin-bottom: 1rem; }
.hc8-footer-logo .ic { width: 36px; height: 36px; border-radius: 50%; background: var(--primary); display: flex; align-items: center; justify-content: center; }
.hc8-footer-col p { color: rgba(255,255,255,0.55); font-size: 0.9rem; }
.hc8-footer-col h4 { font-family: 'Inter', sans-serif; font-size: 0.78rem; text-transform: uppercase; letter-spacing: 1.5px; color: rgba(255,255,255,0.4); margin-bottom: 1.25rem; }
.hc8-footer-col ul { list-style: none; display: flex; flex-direction: column; gap: 0.85rem; }
.hc8-footer-col a { color: rgba(255,255,255,0.65); font-size: 0.9rem; }
.hc8-footer-col a:hover { color: var(--primary); }
.hc8-footer-bottom { padding: 1.75rem 0; text-align: center; font-size: 0.82rem; color: rgba(255,255,255,0.4); }

.hc8-reveal {
  opacity: 1 !important;
  transform: none !important;
}

/* --- RESPONSIVE MEDIA QUERIES --- */
@media (max-width: 1024px) {
  .hc8-services-row { grid-template-columns: repeat(2, 1fr); gap: 1.5rem; }
  .hc8-doctor-row { grid-template-columns: repeat(2, 1fr); gap: 1.5rem; }
  .hc8-tips-grid { grid-template-columns: repeat(2, 1fr); gap: 1.5rem; }
}

@media (max-width: 992px) {
  .hc8-hero-grid { grid-template-columns: 1fr; gap: 2.5rem; }
  .hc8-hero-copy { text-align: center; }
  .hc8-hero-copy p { margin: 0 auto 2rem; }
  .hc8-hero-actions { justify-content: center; }
  .hc8-hero-badges { justify-content: center; }
  .hc8-hero-floater { left: 50%; transform: translateX(-50%); bottom: -1rem; width: max-content; max-width: 90%; }
  .hc8-steps-row { grid-template-columns: 1fr; gap: 2rem; }
  .hc8-steps-row::before { display: none; }
  .hc8-t-grid { grid-template-columns: 1fr; }
  .hc8-footer-grid { grid-template-columns: repeat(2, 1fr); gap: 2rem; }
  .hc8-cta-inner { flex-direction: column; text-align: center; padding: 3rem 2rem; }
}

@media (max-width: 768px) {
  .hc8-hero { padding: 2rem 0 4rem; }
  .hc8-hero-copy h1 { font-size: 2.2rem; }
  .hc8-services { padding: 4rem 0; }
  .hc8-steps { padding: 4rem 0; }
  .hc8-doctors { padding: 4rem 0; }
  .hc8-testimonials { padding: 4rem 0; }
  .hc8-tips { padding: 4rem 0; }
  .hc8-appointment { padding: 4rem 0; }
  .hc8-services-head h2, .hc8-steps-head h2, .hc8-doctors-head h2, .hc8-testimonials-head h2, .hc8-tips-head h2, .hc8-appointment-inner h2, .hc8-cta-inner h2 { font-size: 2rem; }
  .hc8-tips-head { flex-direction: column; align-items: flex-start; gap: 1rem; }
  .hc8-hero-visual img { height: 320px; }
  .hc8-appointment-inner { padding: 2rem 1.5rem; border-radius: 20px; }
  .hc8-form-grid { grid-template-columns: 1fr; }
}

@media (max-width: 640px) {
  .container { padding: 0 1rem; }
  .hc8-services-row { grid-template-columns: 1fr; }
  .hc8-doctor-row { grid-template-columns: 1fr; }
  .hc8-tips-grid { grid-template-columns: 1fr; }
  .hc8-footer-grid { grid-template-columns: 1fr; gap: 2rem; }
  .hc8-hero-floater { position: relative; left: 0; transform: none; bottom: 0; margin-top: 1rem; width: 100%; justify-content: center; }
  .hc8-cta-inner { padding: 2.25rem 1.25rem; border-radius: 24px; }
  .hc8-cta-inner h2 { font-size: 1.75rem; }
  .hc8-header-inner { flex-wrap: wrap; gap: 1rem; justify-content: center; text-align: center; }
}
@media (max-width: 768px) {
  .hc8-services-row, .hc8-steps-row, .hc8-doctor-row, .hc8-tips-grid { grid-template-columns: 1fr !important; }
  .hc8-header-inner, .hc8-hero-floater, .hc8-tips-head, .hc8-cta-inner { flex-direction: column !important; }
}

`;

export const healthcare08Html = `
<header class="hc8-header">
  <div class="container hc8-header-inner">
    <a href="javascript:void(0);" class="hc8-logo">
      LOGO_PLACEHOLDER
    </a>
    <a href="javascript:void(0);" class="btn btn-primary">Book A Visit</a>
  </div>
</header>

<section class="hc8-hero">
  <div class="container hc8-hero-grid">
    <div class="hc8-hero-copy hc8-reveal">
      <div class="eyebrow">Family Wellness</div>
      <h1>Whole-family care, close to home.</h1>
      <p>From little ones to grandparents, our clinic brings warm, personal healthcare to every stage of life — all under one friendly roof.</p>
      <div class="hc8-hero-actions">
        <a href="javascript:void(0);" class="btn btn-primary">Book Appointment</a>
        <a href="javascript:void(0);" class="btn btn-outline">Our Services</a>
      </div>
      <div class="hc8-hero-badges">
        <div class="hc8-hero-badge"><span class="ic">✓</span>Same-day visits</div>
        <div class="hc8-hero-badge"><span class="ic">✓</span>Family-friendly</div>
        <div class="hc8-hero-badge"><span class="ic">✓</span>Insurance accepted</div>
      </div>
    </div>
    <div class="hc8-hero-visual hc8-reveal" style="transition-delay: 0.15s;">
      <div class="blob"></div>
      <img src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=900&q=80" alt="Family with doctor">
      <div class="hc8-hero-floater">
        <span class="ic"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"></path></svg></span>
        <div><h4>9,200+</h4><p>Families Cared For</p></div>
      </div>
    </div>
  </div>
</section>

<section class="hc8-services" id="services">
  <div class="container">
    <div class="hc8-services-head hc8-reveal">
      <div class="eyebrow" style="justify-content:center;">SERVICES_PLACEHOLDER</div>
      <h2>Everyday care, made simple.</h2>
      <p>Comprehensive healthcare solutions tailored to every member of your family.</p>
    </div>
    <div class="hc8-services-row hc8-reveal">
      <div class="hc8-service-pill">
        <div>
          <div class="hc8-service-top">
            <div class="ic"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path></svg></div>
            <span class="tag">Kids Care</span>
          </div>
          <h4>Pediatrics</h4>
          <p>Gentle, comprehensive healthcare tailored for infants, children, and teens with friendly specialists.</p>
        </div>
        <span class="hc8-service-link">Learn More <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg></span>
      </div>

      <div class="hc8-service-pill">
        <div>
          <div class="hc8-service-top">
            <div class="ic"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg></div>
            <span class="tag">Primary</span>
          </div>
          <h4>Family Medicine</h4>
          <p>Preventive checkups, routine health screenings, and ongoing care for all stages of life.</p>
        </div>
        <span class="hc8-service-link">Learn More <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg></span>
      </div>

      <div class="hc8-service-pill">
        <div>
          <div class="hc8-service-top">
            <div class="ic"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 8v4l3 3"></path></svg></div>
            <span class="tag">24/7 Fast</span>
          </div>
          <h4>Urgent Care</h4>
          <p>Rapid, compassionate medical attention for non-life-threatening illnesses and injuries.</p>
        </div>
        <span class="hc8-service-link">Learn More <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg></span>
      </div>

      <div class="hc8-service-pill">
        <div>
          <div class="hc8-service-top">
            <div class="ic"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 12l2 2 4-4"></path><circle cx="12" cy="12" r="10"></circle></svg></div>
            <span class="tag">Specialized</span>
          </div>
          <h4>Senior Wellness</h4>
          <p>Dedicated geriatric care focusing on mobility, vitality, and proactive health management.</p>
        </div>
        <span class="hc8-service-link">Learn More <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg></span>
      </div>
    </div>
  </div>
</section>

<section class="hc8-steps">
  <div class="container">
    <div class="hc8-steps-head hc8-reveal">
      <div class="eyebrow" style="justify-content:center;">How It Works</div>
      <h2>Getting care is easy.</h2>
    </div>
    <div class="hc8-steps-row hc8-reveal">
      <div class="hc8-step"><div class="num">1</div><h4>Book Online</h4><p>Pick a department and time slot that works for your schedule.</p></div>
      <div class="hc8-step"><div class="num">2</div><h4>Visit Us</h4><p>Meet your provider in a warm, welcoming clinic environment.</p></div>
      <div class="hc8-step"><div class="num">3</div><h4>Feel Better</h4><p>Leave with a clear plan and ongoing support for your health.</p></div>
    </div>
  </div>
</section>

<section class="hc8-doctors" id="doctors">
  <div class="container">
    <div class="hc8-doctors-head hc8-reveal">
      <div class="eyebrow" style="justify-content:center;">Our Team</div>
      <h2>Meet your care providers.</h2>
    </div>
    <div class="hc8-doctor-row hc8-reveal">
      <div class="hc8-doctor"><img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=500&q=80" alt="Doctor"><h4>Dr. Sarah Bennett</h4><p>Pediatrics</p></div>
      <div class="hc8-doctor"><img src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=500&q=80" alt="Doctor"><h4>Dr. James Carter</h4><p>Family Medicine</p></div>
      <div class="hc8-doctor"><img src="https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?auto=format&fit=crop&w=500&q=80" alt="Doctor"><h4>Dr. Mia Wong</h4><p>Urgent Care</p></div>
      <div class="hc8-doctor"><img src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=500&q=80" alt="Doctor"><h4>Dr. Daniel Scott</h4><p>Senior Wellness</p></div>
    </div>
  </div>
</section>

<section class="hc8-testimonials">
  <div class="container">
    <div class="hc8-testimonials-head hc8-reveal">
      <div class="eyebrow" style="justify-content:center;">Patient Stories</div>
      <h2>Loved by families like yours.</h2>
    </div>
    <div class="hc8-t-grid hc8-reveal">
      <div class="hc8-t-card">
        <div class="stars">★★★★★</div>
        <p class="quote">"Our kids actually look forward to their checkups now. The whole team is warm, patient, and never rushes us."</p>
        <div class="hc8-t-person">
          <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80" alt="Patient">
          <div><span>Rachel Kim</span><small>Patient since 2021</small></div>
        </div>
      </div>
      <div class="hc8-t-card">
        <div class="stars">★★★★★</div>
        <p class="quote">"Booking was simple and my dad's follow-up care has been consistent and genuinely caring every visit."</p>
        <div class="hc8-t-person">
          <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" alt="Patient">
          <div><span>Tom Alvarez</span><small>Patient since 2023</small></div>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="hc8-tips">
  <div class="container">
    <div class="hc8-tips-head hc8-reveal">
      <div>
        <div class="eyebrow">Health Tips</div>
        <h2>Simple habits for a healthier family.</h2>
      </div>
    </div>
    <div class="hc8-tips-grid hc8-reveal">
      <div class="hc8-tip-card">
        <img src="https://images.openai.com/static-rsc-4/_CXc_4bGiZvTI2c972rkLz_mo83mY54tsjVF3nqUUXKjXUKlO6m7-bFss8prSeDuloTT22hzEWxTsYVpyiwCU62KbisilBzIQoDn1rm12H4Y4DcflXm9T7AAb_2Bk7682yrd5VCkOcd0csVRaYzu1e3U1iwhSsguV88Ww02TO5c?purpose=inline" alt="Article">
        <div class="hc8-tip-card-body"><span class="cat">Nutrition</span><h4>5 easy ways to add more veggies to meals</h4><p>Small swaps that make a big difference for picky eaters.</p></div>
      </div>
      <div class="hc8-tip-card">
        <img src="https://images.openai.com/static-rsc-4/gFLgq9tlpD2nmpMjr7E0IK9VAVzu-kOD2cAMTA0Fcon1HGQzx_hGDCZFAWFBs8yQV0Emcl696yfA7oct1kU5OhVVX7OLwCZA9OOXWPehI2v6aIaYIeHH7tZh0YOTfjrGugYegIdVrEErUANpbrXBxObDPCPmwQvnhl4THLC95eQ?purpose=inline" alt="Article">
        <div class="hc8-tip-card-body"><span class="cat">Wellness</span><h4>Building a bedtime routine that actually sticks</h4><p>Better sleep starts with small, consistent habits.</p></div>
      </div>
      <div class="hc8-tip-card">
        <img src="https://images.openai.com/static-rsc-4/tdIStpmQ4sSOFI9va6ABexnBgwXJexxeYuyiNjOls_edLrY-ZDFxbcM80hUCE1_uRqYRu1UjbUn8eT-mHRHE_3FMEUXUrE3ZTXgsXFdwuQvx0bIkSa9D6LNXpQYRySR1vRzaY4FW_1oAkah-ei0Igxv_0ybsGW7BUHwLmFr7O24n99N6GsUuXiKrOLe8kPCC?purpose=inline" alt="Article">
        <div class="hc8-tip-card-body"><span class="cat">Prevention</span><h4>When to schedule your annual checkup</h4><p>A simple guide to staying ahead of your family's health.</p></div>
      </div>
    </div>
  </div>
</section>

<section class="hc8-cta">
  <div class="hc8-cta-inner hc8-reveal">
    <div>
      <h2>Ready to feel better?</h2>
      <p>Book your visit today — most appointments confirmed within a few hours.</p>
    </div>
    <a href="javascript:void(0);" class="btn btn-white">Book Appointment</a>
  </div>
</section>

<section class="hc8-appointment" id="appointment">
  <div class="container">
    <div class="hc8-appointment-inner hc8-reveal">
      <h2>Book Your Visit</h2>
      <p>Fill in your details and we'll confirm your appointment shortly.</p>
      <form class="lead-capture-form">
        <div class="hc8-form-grid">
          <div class="hc8-fg"><label>First Name</label><input type="text" name="firstName" placeholder="John" required></div>
          <div class="hc8-fg"><label>Last Name</label><input type="text" name="lastName" placeholder="Doe" required></div>
          <div class="hc8-fg"><label>Email Address</label><input type="email" name="email" placeholder="john@example.com" required></div>
          <div class="hc8-fg"><label>Phone Number</label><input type="tel" name="phone" placeholder="(555) 123-4567" required></div>
          <div class="hc8-fg hc8-form-full"><label>Reason for Visit</label><textarea name="notes" placeholder="Tell us briefly why you're visiting..." required></textarea></div>
        </div>
        <button type="submit" class="btn btn-primary" style="width: 100%; justify-content: center;">Request Appointment</button>
      </form>
    </div>
  </div>
</section>

<footer class="hc8-footer">
  <div class="container hc8-footer-grid">
    <div>
      <div class="hc8-footer-logo">
        LOGO_PLACEHOLDER
      </div>
      <p>Warm, whole-family healthcare — from little ones to grandparents, all under one roof.</p>
    </div>
    <div class="hc8-footer-col">
      <h4>Navigate</h4>
      <ul>
        <li><a href="javascript:void(0);">Services</a></li>
        <li><a href="javascript:void(0);">Our Team</a></li>
        <li><a href="javascript:void(0);">Book A Visit</a></li>
      </ul>
    </div>
    <div class="hc8-footer-col">
      <h4>Services</h4>
      <ul>
        <li><a href="javascript:void(0);">SERVICES_PLACEHOLDER</a></li>
        <li><a href="javascript:void(0);">Family Medicine</a></li>
        <li><a href="javascript:void(0);">Urgent Care</a></li>
      </ul>
    </div>
    <div class="hc8-footer-col">
      <h4>Contact</h4>
      <ul>
        <li><a href="tel:PHONE_PLACEHOLDER">PHONE_PLACEHOLDER</a></li>
        <li><a href="mailto:EMAIL_PLACEHOLDER">EMAIL_PLACEHOLDER</a></li>
        <li>ADDRESS_PLACEHOLDER</li>
      </ul>
    </div>
  </div>
  <div class="hc8-footer-bottom">© 2026 PROJECT_NAME_PLACEHOLDER. All Rights Reserved.</div>
</footer>

<script id="core-interactions">
  (function() {
    var isInEditor = !!document.querySelector('[data-gjs-type]') || document.body.classList.contains('gjs-dashed');
    var revealEls = document.querySelectorAll('.hc8-reveal');
    if (isInEditor) {
      revealEls.forEach(function(el) {
        el.classList.add('in-view');
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      return;
    }

    document.body.classList.add('js-enabled');
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) { entry.target.classList.add('in-view'); io.unobserve(entry.target); }
        });
      }, { threshold: 0.15 });
      revealEls.forEach(function(el) { io.observe(el); });
    } else {
      revealEls.forEach(function(el) { el.classList.add('in-view'); });
    }

    document.addEventListener('submit', function(e) {
      if (e.target.tagName === 'FORM') {
        e.preventDefault();
        if (isInEditor) {
          e.stopImmediatePropagation();
          var existingModal = document.getElementById("preview-mode-modal");
          if (existingModal) existingModal.remove();
          var modalHtml = '<div id="preview-mode-modal" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 999999; display: flex; align-items: center; justify-content: center; background: rgba(15, 23, 42, 0.7); backdrop-filter: blur(8px); opacity: 0; animation: pModalFadeIn 0.3s forwards; font-family: system-ui, -apple-system, sans-serif;"><div style="background: #ffffff; width: 90%; max-width: 400px; border-radius: 20px; padding: 32px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); text-align: center; transform: scale(0.95); animation: pModalScaleUp 0.3s forwards;"><div style="width: 60px; height: 60px; background: #FEF2F2; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;"><svg style="width: 30px; height: 30px; color: #EF4444;" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg></div><h3 style="font-size: 20px; font-weight: 700; color: #0F172A; margin: 0 0 12px; letter-spacing: -0.02em;">Preview Mode Active</h3><p style="font-size: 15px; color: #64748B; margin: 0 0 28px; line-height: 1.5;">Form submissions are disabled in preview mode. Publish your page to accept real submissions.</p><button onclick="document.getElementById(\\'preview-mode-modal\\').remove()" style="width: 100%; background: #0F172A; color: #ffffff; border: none; padding: 14px; border-radius: 12px; font-size: 15px; font-weight: 600; cursor: pointer; transition: background 0.2s;" onmouseover="this.style.background=\\'#1E293B\\'" onmouseout="this.style.background=\\'#0F172A\\'">Got it, close</button></div><style>@keyframes pModalFadeIn { to { opacity: 1; } } @keyframes pModalScaleUp { to { transform: scale(1); } }</style></div>';
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
                input.style.borderColor = '#22c55e';
                if (input.nextElementSibling && input.nextElementSibling.classList.contains('val-error')) input.nextElementSibling.style.display = 'none';
              } else {
                input.style.borderColor = '#ef4444';
                if (input.nextElementSibling && input.nextElementSibling.classList.contains('val-error')) input.nextElementSibling.style.display = 'block';
              }
            });
          }
          if (!input.value.trim() && input.hasAttribute('required')) {
            isValid = false;
            input.style.borderColor = '#ef4444';
            if (!input.nextElementSibling || !input.nextElementSibling.classList.contains('val-error')) {
              var fieldName = input.getAttribute('placeholder') || input.getAttribute('name') || 'This field';
              var err = document.createElement('span');
              err.className = 'val-error';
              err.style.color = '#ef4444'; err.style.fontSize = '12px'; err.style.display = 'block'; err.style.marginTop = '4px'; err.style.fontWeight = '500';
              err.textContent = '*' + fieldName.replace(/\\*$/, '').trim() + ' is required';
              input.parentNode.insertBefore(err, input.nextSibling);
            } else { input.nextElementSibling.style.display = 'block'; }
          }
        });
        if (!isValid) { e.preventDefault(); e.stopImmediatePropagation(); }
        else {
          e.preventDefault();
          var btn = e.target.querySelector('button[type="submit"]') || e.target.querySelector('input[type="submit"]');
          if (btn) { if (btn.innerText) btn.innerText = 'Sending...'; else btn.value = 'Sending...'; }
          setTimeout(function() {
            e.target.innerHTML = '<div style="padding: 20px; text-align: center; border: 1px dashed rgba(0,0,0,0.15); border-radius: 12px;"><h3 style="margin: 0 0 10px 0;">Thank You!</h3><p style="margin: 0; opacity: 0.7;">Your appointment request has been submitted successfully.</p></div>';
          }, 1000);
        }
      }
    }, true);
  })();
</script>
`;