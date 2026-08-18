export const healthcare09Styles = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap');

:root {
  --primary: PRIMARY_COLOR_PLACEHOLDER;
  --secondary: SECONDARY_COLOR_PLACEHOLDER;
  --primary-rgb: PRIMARY_RGB_PLACEHOLDER;
  --secondary-rgb: SECONDARY_RGB_PLACEHOLDER;
  --ink: #0d1b2a;
  --paper: #f4f7fb;
  --paper-2: #e8eef7;
  --muted: #5b6b7f;
  --line: #dbe4f0;
}

* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Inter', sans-serif; color: var(--ink); background: var(--paper); line-height: 1.6; overflow-x: hidden; }
h1, h2, h3, h4 { font-family: 'Space Grotesk', sans-serif; font-weight: 700; line-height: 1.2; color: var(--ink); }
.container { max-width: 1220px; margin: 0 auto; padding: 0 1.5rem; position: relative; z-index: 5; }
img { max-width: 100%; display: block; }
a { text-decoration: none; color: inherit; transition: 0.3s; }
.eyebrow { display: inline-flex; align-items: center; gap: 0.5rem; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: var(--primary); margin-bottom: 1rem; }
.eyebrow::before { content: ''; width: 20px; height: 2px; background: var(--primary); }

.btn { display: inline-flex; align-items: center; gap: 0.55rem; padding: 0.9rem 1.9rem; border-radius: 8px; font-weight: 700; font-size: 0.88rem; cursor: pointer; border: 1px solid transparent; }
.btn-primary { background: var(--primary); color: #fff; }
.btn-primary:hover { background: var(--secondary); }
.btn-outline { border: 1px solid var(--line); color: var(--ink); background: #fff; }
.btn-outline:hover { border-color: var(--primary); color: var(--primary); }
.btn-white { background: #fff; color: var(--primary); }

/* Header */
.hc9-header { padding: 1.5rem 0; background: #fff; border-bottom: 1px solid var(--line); }
.hc9-header-inner { display: flex; justify-content: space-between; align-items: center; }
.hc9-logo { display: flex; align-items: center; gap: 0.6rem; font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 1.3rem; }
.hc9-logo .ic { width: 38px; height: 38px; border-radius: 10px; background: var(--ink); color: #fff; display: flex; align-items: center; justify-content: center; }
.hc9-header-status { display: flex; align-items: center; gap: 0.5rem; font-size: 0.8rem; color: var(--muted); }
.hc9-header-status .dot { width: 8px; height: 8px; border-radius: 50%; background: #22c55e; }

/* Hero - dashboard tiles instead of image */
.hc9-hero { padding: 4rem 0 3rem; background: #fff; }
.hc9-hero-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: center; }
.hc9-hero-copy h1 { font-size: 2.9rem; margin-bottom: 1.25rem; }
.hc9-hero-copy p { color: var(--muted); font-size: 1rem; max-width: 460px; margin-bottom: 2rem; }
.hc9-hero-actions { display: flex; gap: 1rem; flex-wrap: wrap; }
.hc9-tile-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
.hc9-tile { background: var(--paper); border: 1px solid var(--line); border-radius: 14px; padding: 1.5rem; }
.hc9-tile.dark { background: var(--ink); color: #fff; grid-column: span 2; display: flex; justify-content: space-between; align-items: center; }
.hc9-tile h3 { font-size: 1.9rem; }
.hc9-tile.dark h3 { color: #fff; }
.hc9-tile p { color: var(--muted); font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 0.3rem; }
.hc9-tile.dark p { color: rgba(255,255,255,0.5); }
.hc9-tile .trend { color: #22c55e; font-size: 0.75rem; font-weight: 700; }

/* Symptom checker widget - visual only, unique interactive-looking tool */
.hc9-checker { padding: 3rem 0 5rem; }
.hc9-checker-card { background: var(--ink); border-radius: 20px; padding: 3rem; display: grid; grid-template-columns: 0.8fr 1.2fr; gap: 3rem; align-items: center; }
.hc9-checker-copy { color: #fff; }
.hc9-checker-copy h2 { color: #fff; font-size: 2rem; margin-bottom: 1rem; }
.hc9-checker-copy p { color: rgba(255,255,255,0.6); font-size: 0.92rem; }
.hc9-checker-widget { background: #fff; border-radius: 16px; padding: 1.75rem; }
.hc9-checker-widget-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; }
.hc9-checker-widget-head h4 { font-size: 1rem; }
.hc9-checker-widget-head span { font-size: 0.75rem; color: var(--muted); }
.hc9-symptom-tags { display: flex; flex-wrap: wrap; gap: 0.6rem; margin-bottom: 1.25rem; }
.hc9-symptom-tags span { padding: 0.5rem 1rem; border-radius: 8px; background: var(--paper); font-size: 0.8rem; color: var(--muted); border: 1px solid var(--line); cursor: pointer; }
.hc9-symptom-tags span.active { background: var(--primary); color: #fff; border-color: var(--primary); }
.hc9-checker-result { background: var(--paper); border-radius: 10px; padding: 1rem 1.25rem; display: flex; justify-content: space-between; align-items: center; font-size: 0.85rem; }
.hc9-checker-result strong { color: var(--primary); }

/* Departments - numbered text rows with icons */
.hc9-departments { padding: 5.5rem 0; background: #fff; border-top: 1px solid var(--line); }
.hc9-departments-head { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 3rem; gap: 1.5rem; flex-wrap: wrap; }
.hc9-departments-head h2 { font-size: 2.4rem; max-width: 520px; }
.hc9-dept-row { display: grid; grid-template-columns: 60px 50px 1fr 1fr 40px; gap: 1.5rem; align-items: center; padding: 1.5rem 0; border-top: 1px solid var(--line); }
.hc9-dept-row:last-child { border-bottom: 1px solid var(--line); }
.hc9-dept-row .num { font-family: 'Space Grotesk', sans-serif; color: var(--muted); font-size: 0.85rem; }
.hc9-dept-row .ic { width: 40px; height: 40px; border-radius: 10px; background: var(--paper); color: var(--primary); display: flex; align-items: center; justify-content: center; }
.hc9-dept-row h4 { font-size: 1.2rem; }
.hc9-dept-row p { color: var(--muted); font-size: 0.85rem; }
.hc9-dept-row .arrow { width: 36px; height: 36px; border-radius: 50%; background: var(--paper); display: flex; align-items: center; justify-content: center; color: var(--ink); }

/* Doctor directory - table style rows */
.hc9-doctors { padding: 5.5rem 0; }
.hc9-doctors-head { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2.5rem; gap: 1.5rem; flex-wrap: wrap; }
.hc9-doctors-head h2 { font-size: 2.4rem; }
.hc9-doctor-table { background: #fff; border: 1px solid var(--line); border-radius: 14px; overflow: hidden; }
.hc9-doctor-row2 { display: grid; grid-template-columns: 2.2fr 1.3fr 1fr 1fr; gap: 1rem; align-items: center; padding: 1.25rem 1.75rem; border-bottom: 1px solid var(--line); }
.hc9-doctor-row2:last-child { border-bottom: none; }
.hc9-doctor-row2.head { background: var(--paper); font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.5px; color: var(--muted); font-weight: 700; }
.hc9-doc-name { display: flex; align-items: center; gap: 0.9rem; }
.hc9-doc-name img { width: 44px; height: 44px; border-radius: 50%; object-fit: cover; }
.hc9-doc-name h4 { font-size: 1rem; }
.hc9-availability { display: flex; align-items: center; gap: 0.4rem; font-size: 0.82rem; color: var(--muted); }
.hc9-availability .dot { width: 7px; height: 7px; border-radius: 50%; background: #22c55e; }
.hc9-doctor-row2 .btn { padding: 0.5rem 1.1rem; font-size: 0.78rem; }

/* Facilities - bento grid */
.hc9-facilities { padding: 5.5rem 0; background: #fff; border-top: 1px solid var(--line); }
.hc9-facilities-head { text-align: center; max-width: 600px; margin: 0 auto 3rem; }
.hc9-facilities-head h2 { font-size: 2.4rem; }
.hc9-bento { display: grid; grid-template-columns: repeat(4, 1fr); grid-auto-rows: 170px; gap: 1rem; }
.hc9-bento-item { position: relative; border-radius: 14px; overflow: hidden; }
.hc9-bento-item.wide { grid-column: span 2; }
.hc9-bento-item.tall { grid-row: span 2; }
.hc9-bento-item img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.hc9-bento-item .ov { position: absolute; inset: 0; background: linear-gradient(to top, rgba(13,27,42,0.75), transparent 55%); }
.hc9-bento-item span { position: absolute; left: 1.25rem; bottom: 1.1rem; color: #fff; font-weight: 700; z-index: 2; }

/* Testimonial - clinical slab */
.hc9-testimonial { padding: 5.5rem 0; background: var(--ink); }
.hc9-testimonial-inner { max-width: 720px; margin: 0 auto; text-align: center; }
.hc9-testimonial-inner .qmark { font-family: 'Space Grotesk', sans-serif; font-size: 3rem; color: var(--primary); margin-bottom: 0.5rem; }
.hc9-testimonial-inner p.quote { color: #fff; font-size: 1.4rem; margin-bottom: 1.5rem; line-height: 1.4; }
.hc9-testimonial-inner span { color: rgba(255,255,255,0.5); font-size: 0.85rem; }

/* Appointment - two column colored */
.hc9-appointment { padding: 5.5rem 0; }
.hc9-appointment-card { background: var(--paper-2); border-radius: 20px; padding: 3.5rem; display: grid; grid-template-columns: 0.9fr 1.1fr; gap: 3rem; }
.hc9-appointment-info h2 { font-size: 2.2rem; margin-bottom: 1rem; }
.hc9-appointment-info > p { color: var(--muted); margin-bottom: 1.75rem; }
.hc9-info-row { display: flex; gap: 1rem; margin-bottom: 1.25rem; align-items: flex-start; }
.hc9-info-row .ic { width: 38px; height: 38px; border-radius: 10px; background: #fff; color: var(--primary); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.hc9-info-row h4 { font-size: 0.9rem; }
.hc9-info-row p { color: var(--muted); font-size: 0.85rem; }
.hc9-appointment-form { background: #fff; border-radius: 16px; padding: 2rem; }
.hc9-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.1rem; margin-bottom: 1.1rem; }
.hc9-fg label { display: block; font-size: 0.75rem; font-weight: 700; color: var(--muted); margin-bottom: 0.4rem; }
.hc9-fg input, .hc9-fg select, .hc9-fg textarea { width: 100%; padding: 0.8rem 1rem; border: 1px solid var(--line); border-radius: 8px; font-family: 'Inter', sans-serif; font-size: 0.9rem; outline: none; }
.hc9-fg input:focus, .hc9-fg select:focus, .hc9-fg textarea:focus { border-color: var(--primary); }
.hc9-fg textarea { resize: vertical; min-height: 80px; }
.hc9-form-full { grid-column: 1 / -1; }

/* Footer */
.hc9-footer { background: var(--ink); color: #fff; padding-top: 4rem; }
.hc9-footer-grid { display: grid; grid-template-columns: 1.2fr 0.8fr 0.8fr 1fr; gap: 3rem; padding-bottom: 3rem; border-bottom: 1px solid rgba(255,255,255,0.1); }
.hc9-footer-logo { display: flex; align-items: center; gap: 0.6rem; font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 1.2rem; margin-bottom: 1rem; }
.hc9-footer-logo .ic { width: 34px; height: 34px; border-radius: 8px; background: var(--primary); display: flex; align-items: center; justify-content: center; }
.hc9-footer-col p { color: rgba(255,255,255,0.55); font-size: 0.9rem; }
.hc9-footer-col h4 { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1.5px; color: rgba(255,255,255,0.4); margin-bottom: 1.25rem; }
.hc9-footer-col ul { list-style: none; display: flex; flex-direction: column; gap: 0.85rem; }
.hc9-footer-col a { color: rgba(255,255,255,0.65); font-size: 0.9rem; }
.hc9-footer-col a:hover { color: var(--primary); }
.hc9-footer-bottom { padding: 1.75rem 0; text-align: center; font-size: 0.82rem; color: rgba(255,255,255,0.4); }

.hc9-reveal {
  opacity: 1 !important;
  transform: none !important;
}

/* --- RESPONSIVE MEDIA QUERIES --- */
@media (max-width: 1024px) {
  .hc9-bento { grid-template-columns: repeat(2, 1fr); }
  .hc9-bento-item.wide { grid-column: span 2; }
}

@media (max-width: 992px) {
  .hc9-hero-grid { grid-template-columns: 1fr; gap: 2.5rem; }
  .hc9-hero-copy { text-align: center; }
  .hc9-hero-copy p { margin: 0 auto 2rem; }
  .hc9-hero-actions { justify-content: center; }
  .hc9-checker-card { grid-template-columns: 1fr; gap: 2rem; padding: 2.5rem; }
  .hc9-checker-copy { text-align: center; }
  .hc9-appointment-card { grid-template-columns: 1fr; gap: 2.5rem; padding: 2.5rem; }
  .hc9-dept-row { grid-template-columns: 40px 40px 1fr 30px; gap: 1rem; }
  .hc9-dept-row p { display: none; }
  .hc9-doctor-row2 { grid-template-columns: 2fr 1.2fr 1fr; }
  .hc9-footer-grid { grid-template-columns: repeat(2, 1fr); gap: 2.5rem; }
}

@media (max-width: 768px) {
  .hc9-hero { padding: 3rem 0 2rem; }
  .hc9-hero-copy h1 { font-size: 2.2rem; }
  .hc9-checker-copy h2, .hc9-departments-head h2, .hc9-doctors-head h2, .hc9-facilities-head h2, .hc9-appointment-info h2 { font-size: 2rem; }
  .hc9-departments-head, .hc9-doctors-head { flex-direction: column; align-items: flex-start; gap: 1rem; }
  .hc9-doctor-row2 { grid-template-columns: 1.8fr 1fr; }
  .hc9-doctor-row2 > span:nth-child(3) { display: none; }
  .hc9-testimonial-inner p.quote { font-size: 1.2rem; }
  .hc9-bento { grid-template-columns: 1fr; }
  .hc9-bento-item.wide, .hc9-bento-item.tall { grid-column: span 1; grid-row: span 1; height: 190px; }
  .hc9-form-grid { grid-template-columns: 1fr; }
  .hc9-appointment-card { padding: 2rem 1.5rem; border-radius: 16px; }
  .hc9-checker-card { padding: 2rem 1.5rem; border-radius: 16px; }
}

@media (max-width: 640px) {
  .container { padding: 0 1rem; }
  .hc9-header-inner { flex-direction: column; gap: 1rem; text-align: center; }
  .hc9-header-status { flex-wrap: wrap; justify-content: center; }
  .hc9-header-status .btn { margin-left: 0 !important; margin-top: 0.5rem; width: 100%; justify-content: center; }
  .hc9-tile-grid { grid-template-columns: 1fr; }
  .hc9-tile.dark { grid-column: span 1; flex-direction: column; text-align: center; gap: 0.75rem; }
  .hc9-dept-row { grid-template-columns: 30px 36px 1fr 32px; gap: 0.75rem; }
  .hc9-dept-row h4 { font-size: 1rem; }
  .hc9-doctor-row2 { grid-template-columns: 1fr auto; padding: 1rem; }
  .hc9-doctor-row2 > span:nth-child(2) { display: none; }
  .hc9-doc-name h4 { font-size: 0.95rem; }
  .hc9-footer-grid { grid-template-columns: 1fr; gap: 2rem; }
  .hc9-checker-widget { padding: 1.25rem; }
  .hc9-appointment-form { padding: 1.5rem 1.25rem; }
}
@media (max-width: 768px) {
  .hc9-tile-grid, .hc9-checker-card, .hc9-dept-row, .hc9-bento { grid-template-columns: 1fr !important; }
  .hc9-header-inner, .hc9-header-status, .hc9-checker-widget-head, .hc9-departments-head, .arrow, .hc9-doctors-head, .hc9-info-row { flex-direction: column !important; }
}

`;

export const healthcare09Html = `
<header class="hc9-header">
  <div class="container hc9-header-inner">
    <a href="javascript:void(0);" class="hc9-logo">
      LOGO_PLACEHOLDER
    </a>
    <div class="hc9-header-status">
      <span class="dot"></span> Accepting new patients
      <a href="javascript:void(0);" class="btn btn-primary" style="margin-left: 1.25rem;">Book Now</a>
    </div>
  </div>
</header>

<section class="hc9-hero">
  <div class="container hc9-hero-grid">
    <div class="hc9-hero-copy hc9-reveal">
      <div class="eyebrow">Modern Medical Center</div>
      <h1>Healthcare, organized around clarity.</h1>
      <p>Real-time appointment availability, transparent care teams, and a facility built for efficient, modern medicine.</p>
      <div class="hc9-hero-actions">
        <a href="javascript:void(0);" class="btn btn-primary">Book An Appointment</a>
        <a href="javascript:void(0);" class="btn btn-outline">View Departments</a>
      </div>
    </div>
    <div class="hc9-tile-grid hc9-reveal" style="transition-delay: 0.15s;">
      <div class="hc9-tile"><h3>40+</h3><p>Specialist Doctors</p></div>
      <div class="hc9-tile"><h3>98%</h3><p>Satisfaction <span class="trend">↑ 4%</span></p></div>
      <div class="hc9-tile dark"><div><h3>24/7</h3><p>Emergency Line</p></div><span class="ic" style="background: rgba(255,255,255,0.1); width: 44px; height: 44px; border-radius: 10px; display:flex; align-items:center; justify-content:center;"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg></span></div>
    </div>
  </div>
</section>

<section class="hc9-checker">
  <div class="container">
    <div class="hc9-checker-card hc9-reveal">
      <div class="hc9-checker-copy">
        <div class="eyebrow" style="color: #fff;">Not Sure Where To Start?</div>
        <h2>Tell us what you're feeling.</h2>
        <p>Select your symptoms below and we'll point you to the right department — no guesswork, no long hold times.</p>
      </div>
      <div class="hc9-checker-widget">
        <div class="hc9-checker-widget-head"><h4>Symptom Checker</h4><span>Step 1 of 2</span></div>
        <div class="hc9-symptom-tags">
          <span class="active">Fever</span>
          <span>Chest Pain</span>
          <span>Joint Pain</span>
          <span>Headache</span>
          <span>Fatigue</span>
          <span>Cough</span>
        </div>
        <div class="hc9-checker-result">
          <span>Suggested department</span>
          <strong>General Medicine</strong>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="hc9-departments" id="departments">
  <div class="container">
    <div class="hc9-departments-head hc9-reveal">
      <h2>SERVICES_PLACEHOLDER</h2>
      <a href="javascript:void(0);" class="btn btn-outline">Book A Department</a>
    </div>
    <div class="hc9-reveal">
      <div class="hc9-dept-row">
        <span class="num">01</span>
        <span class="ic"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg></span>
        <h4>Cardiology</h4>
        <p>Comprehensive heart care from diagnosis to long-term management.</p>
        <span class="arrow">→</span>
      </div>
      <div class="hc9-dept-row">
        <span class="num">02</span>
        <span class="ic"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 8v4l3 3"></path></svg></span>
        <h4>Emergency Care</h4>
        <p>Round-the-clock rapid response and triage.</p>
        <span class="arrow">→</span>
      </div>
      <div class="hc9-dept-row">
        <span class="num">03</span>
        <span class="ic"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 12l2 2 4-4"></path><circle cx="12" cy="12" r="10"></circle></svg></span>
        <h4>Orthopedics</h4>
        <p>Advanced treatment for bones, joints, and sports injuries.</p>
        <span class="arrow">→</span>
      </div>
      <div class="hc9-dept-row">
        <span class="num">04</span>
        <span class="ic"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path></svg></span>
        <h4>Pediatrics</h4>
        <p>Gentle, thorough care for infants, children, and adolescents.</p>
        <span class="arrow">→</span>
      </div>
    </div>
  </div>
</section>

<section class="hc9-doctors" id="doctors">
  <div class="container">
    <div class="hc9-doctors-head hc9-reveal">
      <h2>Doctor Availability</h2>
    </div>
    <div class="hc9-doctor-table hc9-reveal">
      <div class="hc9-doctor-row2 head"><span>Doctor</span><span>Specialty</span><span>Availability</span><span></span></div>
      <div class="hc9-doctor-row2">
        <div class="hc9-doc-name"><img src="https://images.openai.com/static-rsc-4/Tro9NlWedL2lItuxi3wZmQyF1aHbWi-PoMs04rWooPhNHlhPTQzqEUXqWUi9GblBQed5DafC7ce7nPazhnC0vsvUvPoURC6qebVvKs-kyRplXaNwDvFT09GzdTMdf_kYTjy9LoX9dQYFfhO-bNfr0SCtG-T5So_It9tT6nI8tSp4xETvg2MmtgcSPX8LdW-u?purpose=inline" alt="Doctor"><h4>Dr. Sarah Bennett</h4></div>
        <span>Cardiology</span>
        <span class="hc9-availability"><span class="dot"></span>Today, 3:00 PM</span>
        <a href="javascript:void(0);" class="btn btn-outline">Book</a>
      </div>
      <div class="hc9-doctor-row2">
        <div class="hc9-doc-name"><img src="https://images.openai.com/static-rsc-4/xRN_7E9HZuTnvxsIS7mv7xb4u1OlsdJJ_d5kskhQuqo9fmuYcLc4V6SpkkN5NbsCVInSUDgZ0Zvtup9EglRexLf4AuKgYiyT-lWcZPQrTdr5gVgFI-yOTH4JY5VdV0R6DKQLX7DsPE_bmptC2po7YgKzNq3iM2gdaV1JXLk8W0OA22ffnBMArOMUX5wzyPeY?purpose=inline" alt="Doctor"><h4>Dr. James Carter</h4></div>
        <span>Pediatrics</span>
        <span class="hc9-availability"><span class="dot"></span>Tomorrow, 10:00 AM</span>
        <a href="javascript:void(0);" class="btn btn-outline">Book</a>
      </div>
      <div class="hc9-doctor-row2">
        <div class="hc9-doc-name"><img src="https://images.openai.com/static-rsc-4/XGvAphxu7RqgPAPODUpqxSveXSxCjSplUhOwy2fZZ-87gQtDHi7wN4xWlk9-0fBeOcrmEux5IecTnIv1OUMIGhJHINa4q3V64x2rvJnxWn4qd6NKF7H6g7sQB9F57ci4kTxN2QN5_uxWONV75bKK8tP0awVBB9kmfqTRDHTjGWw?purpose=inline" alt="Doctor"><h4>Dr. Mia Wong</h4></div>
        <span>Orthopedics</span>
        <span class="hc9-availability"><span class="dot"></span>Today, 5:30 PM</span>
        <a href="javascript:void(0);" class="btn btn-outline">Book</a>
      </div>
      <div class="hc9-doctor-row2">
        <div class="hc9-doc-name"><img src="https://images.openai.com/static-rsc-4/Tro9NlWedL2lItuxi3wZmQyF1aHbWi-PoMs04rWooPhNHlhPTQzqEUXqWUi9GblBQed5DafC7ce7nPazhnC0vsvUvPoURC6qebVvKs-kyRplXaNwDvFT09GzdTMdf_kYTjy9LoX9dQYFfhO-bNfr0SCtG-T5So_It9tT6nI8tSp4xETvg2MmtgcSPX8LdW-u?purpose=inline" alt="Doctor"><h4>Dr. Daniel Scott</h4></div>
        <span>Emergency Care</span>
        <span class="hc9-availability"><span class="dot"></span>Available Now</span>
        <a href="javascript:void(0);" class="btn btn-outline">Book</a>
      </div>
    </div>
  </div>
</section>

<section class="hc9-facilities">
  <div class="container">
    <div class="hc9-facilities-head hc9-reveal">
      <h2>A facility built for modern care.</h2>
    </div>
    <div class="hc9-bento hc9-reveal">
      <div class="hc9-bento-item wide tall"><img src="https://images.openai.com/static-rsc-4/Tro9NlWedL2lItuxi3wZmQyF1aHbWi-PoMs04rWooPhNHlhPTQzqEUXqWUi9GblBQed5DafC7ce7nPazhnC0vsvUvPoURC6qebVvKs-kyRplXaNwDvFT09GzdTMdf_kYTjy9LoX9dQYFfhO-bNfr0SCtG-T5So_It9tT6nI8tSp4xETvg2MmtgcSPX8LdW-u?purpose=inline" alt="Facility"><div class="ov"></div><span>Diagnostic Imaging</span></div>
      <div class="hc9-bento-item"><img src="https://images.openai.com/static-rsc-4/xRN_7E9HZuTnvxsIS7mv7xb4u1OlsdJJ_d5kskhQuqo9fmuYcLc4V6SpkkN5NbsCVInSUDgZ0Zvtup9EglRexLf4AuKgYiyT-lWcZPQrTdr5gVgFI-yOTH4JY5VdV0R6DKQLX7DsPE_bmptC2po7YgKzNq3iM2gdaV1JXLk8W0OA22ffnBMArOMUX5wzyPeY?purpose=inline" alt="Facility"><div class="ov"></div><span>ICU Ward</span></div>
      <div class="hc9-bento-item"><img src="https://images.openai.com/static-rsc-4/XGvAphxu7RqgPAPODUpqxSveXSxCjSplUhOwy2fZZ-87gQtDHi7wN4xWlk9-0fBeOcrmEux5IecTnIv1OUMIGhJHINa4q3V64x2rvJnxWn4qd6NKF7H6g7sQB9F57ci4kTxN2QN5_uxWONV75bKK8tP0awVBB9kmfqTRDHTjGWw?purpose=inline" alt="Facility"><div class="ov"></div><span>Recovery Rooms</span></div>
      <div class="hc9-bento-item wide"><img src="https://images.openai.com/static-rsc-4/gFLgq9tlpD2nmpMjr7E0IK9VAVzu-kOD2cAMTA0Fcon1HGQzx_hGDCZFAWFBs8yQV0Emcl696yfA7oct1kU5OhVVX7OLwCZA9OOXWPehI2v6aIaYIeHH7tZh0YOTfjrGugYegIdVrEErUANpbrXBxObDPCPmwQvnhl4THLC95eQ?purpose=inline" alt="Facility"><div class="ov"></div><span>Surgical Suites</span></div>
    </div>
  </div>
</section>

<section class="hc9-testimonial">
  <div class="container">
    <div class="hc9-testimonial-inner hc9-reveal">
      <div class="qmark">"</div>
      <p class="quote">Every step felt organized and transparent — from booking to diagnosis, nothing was left to guesswork.</p>
      <span>Rachel Kim — Patient</span>
    </div>
  </div>
</section>

<section class="hc9-appointment" id="appointment">
  <div class="container">
    <div class="hc9-appointment-card">
      <div class="hc9-appointment-info hc9-reveal">
        <div class="eyebrow">Book A Visit</div>
        <h2>Schedule your appointment.</h2>
        <p>Fill out the form and our care team will confirm within a few hours.</p>
        <div class="hc9-info-row"><div class="ic"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg></div><div><h4>Location</h4><p>ADDRESS_PLACEHOLDER</p></div></div>
        <div class="hc9-info-row"><div class="ic"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg></div><div><h4>Phone</h4><p>PHONE_PLACEHOLDER</p></div></div>
        <div class="hc9-info-row"><div class="ic"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg></div><div><h4>Email</h4><p>EMAIL_PLACEHOLDER</p></div></div>
      </div>
      <div class="hc9-appointment-form hc9-reveal" style="transition-delay: 0.15s;">
        <form class="lead-capture-form">
          <div class="hc9-form-grid">
            <div class="hc9-fg"><label>First Name</label><input type="text" name="firstName" placeholder="John" required></div>
            <div class="hc9-fg"><label>Last Name</label><input type="text" name="lastName" placeholder="Doe" required></div>
            <div class="hc9-fg"><label>Email Address</label><input type="email" name="email" placeholder="john@example.com" required></div>
            <div class="hc9-fg"><label>Phone Number</label><input type="tel" name="phone" placeholder="(555) 123-4567" required></div>
            <div class="hc9-fg hc9-form-full"><label>Department</label>
              <select name="department" required>
                <option value="">Select a department</option>
                <option>Cardiology</option>
                <option>Pediatrics</option>
                <option>Orthopedics</option>
                <option>Emergency Care</option>
              </select>
            </div>
            <div class="hc9-fg hc9-form-full"><label>Reason for Visit</label><textarea name="notes" placeholder="Briefly describe your symptoms..." required></textarea></div>
          </div>
          <button type="submit" class="btn btn-primary" style="width: 100%; justify-content: center;">Request Appointment</button>
        </form>
      </div>
    </div>
  </div>
</section>

<footer class="hc9-footer">
  <div class="container hc9-footer-grid">
    <div>
      <div class="hc9-footer-logo">
        LOGO_PLACEHOLDER
      </div>
      <p>Modern, organized healthcare — transparent scheduling, real-time availability, expert care.</p>
    </div>
    <div class="hc9-footer-col">
      <h4>Navigate</h4>
      <ul>
        <li><a href="javascript:void(0);">Departments</a></li>
        <li><a href="javascript:void(0);">Doctor Availability</a></li>
        <li><a href="javascript:void(0);">Book Appointment</a></li>
      </ul>
    </div>
    <div class="hc9-footer-col">
      <h4>Departments</h4>
      <ul>
        <li><a href="javascript:void(0);">SERVICES_PLACEHOLDER</a></li>
        <li><a href="javascript:void(0);">Pediatrics</a></li>
        <li><a href="javascript:void(0);">Emergency Care</a></li>
      </ul>
    </div>
    <div class="hc9-footer-col">
      <h4>Contact</h4>
      <ul>
        <li><a href="tel:PHONE_PLACEHOLDER">PHONE_PLACEHOLDER</a></li>
        <li><a href="mailto:EMAIL_PLACEHOLDER">EMAIL_PLACEHOLDER</a></li>
        <li>ADDRESS_PLACEHOLDER</li>
      </ul>
    </div>
  </div>
  <div class="hc9-footer-bottom">© 2026 PROJECT_NAME_PLACEHOLDER. All Rights Reserved.</div>
</footer>

<script id="core-interactions">
  (function() {
    var isInEditor = !!document.querySelector('[data-gjs-type]') || document.body.classList.contains('gjs-dashed');
    if (!isInEditor) {
      document.body.classList.add('js-enabled');

      var symptomTags = document.querySelectorAll('.hc9-symptom-tags span');
      symptomTags.forEach(function(tag) {
        tag.addEventListener('click', function() {
          symptomTags.forEach(function(t) { t.classList.remove('active'); });
          tag.classList.add('active');
        });
      });

      var revealEls = document.querySelectorAll('.hc9-reveal');
      if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function(entries) {
          entries.forEach(function(entry) {
            if (entry.isIntersecting) { entry.target.classList.add('in-view'); io.unobserve(entry.target); }
          });
        }, { threshold: 0.15 });
        revealEls.forEach(function(el) { io.observe(el); });
      }
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
            e.target.innerHTML = '<div style="padding: 20px; text-align: center; border: 1px dashed rgba(0,0,0,0.15); border-radius: 8px;"><h3 style="margin: 0 0 10px 0;">Thank You!</h3><p style="margin: 0; opacity: 0.7;">Your appointment request has been submitted successfully.</p></div>';
          }, 1000);
        }
      }
    }, true);
  })();
</script>
`;