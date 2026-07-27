export const healthcare07Styles = `
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Lora:ital,wght@0,500;0,600;1,500&display=swap');

:root {
  --primary: PRIMARY_COLOR_PLACEHOLDER;
  --secondary: SECONDARY_COLOR_PLACEHOLDER;
  --primary-rgb: PRIMARY_RGB_PLACEHOLDER;
  --secondary-rgb: SECONDARY_RGB_PLACEHOLDER;
  --ink: #10241f;
  --paper: #f6faf9;
  --paper-2: #eaf3f1;
  --muted: #607772;
  --line: #dde9e6;
}

* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Manrope', sans-serif; color: var(--ink); background: var(--paper); line-height: 1.65; overflow-x: hidden; }
h1, h2, h3, h4 { font-family: 'Lora', serif; font-weight: 600; line-height: 1.2; color: var(--ink); }
.container { max-width: 1200px; margin: 0 auto; padding: 0 1.5rem; position: relative; z-index: 5; }
img { max-width: 100%; display: block; }
a { text-decoration: none; color: inherit; transition: 0.3s; }
.eyebrow { display: inline-flex; align-items: center; gap: 0.5rem; background: rgba(var(--primary-rgb), 0.1); color: var(--primary); padding: 0.4rem 0.9rem; border-radius: 50px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 1.25rem; }
.italic { font-family: 'Lora', serif; font-style: italic; color: var(--primary); }

.btn { display: inline-flex; align-items: center; gap: 0.6rem; padding: 0.9rem 1.9rem; border-radius: 50px; font-weight: 700; font-size: 0.9rem; cursor: pointer; border: 1px solid transparent; }
.btn-primary { background: var(--primary); color: #fff; box-shadow: 0 10px 25px rgba(var(--primary-rgb), 0.25); }
.btn-primary:hover { background: var(--secondary); transform: translateY(-2px); }
.btn-outline { border-color: var(--ink); color: var(--ink); }
.btn-outline:hover { background: var(--ink); color: #fff; }
.btn-white { background: #fff; color: var(--primary); }
.btn-white:hover { background: var(--ink); color: #fff; }

/* Header - logo + appointment CTA, no nav menu */
.hc7-header { padding: 1.5rem 0; background: var(--paper); }
.hc7-header-inner { display: flex; justify-content: space-between; align-items: center; }
.hc7-logo { display: flex; align-items: center; gap: 0.75rem; font-family: 'Lora', serif; font-size: 1.4rem; font-weight: 600; }
.hc7-logo .ic { width: 42px; height: 42px; border-radius: 12px; background: var(--primary); color: #fff; display: flex; align-items: center; justify-content: center; }
.hc7-header-emergency { display: flex; align-items: center; gap: 0.75rem; font-size: 0.85rem; color: var(--muted); }
.hc7-header-emergency strong { color: var(--ink); }
.hc7-dept-icon svg { width: 32px; height: 32px; }
/* Hero - split, appointment scheduler card on the right */
.hc7-hero { padding: 3rem 0 6rem; position: relative; overflow: hidden; }
.hc7-hero-blob { position: absolute; top: -10%; right: -8%; width: 480px; height: 480px; border-radius: 50%; background: rgba(var(--primary-rgb), 0.08); z-index: 0; }
.hc7-hero-grid { display: grid; grid-template-columns: 1.05fr 0.95fr; gap: 3.5rem; align-items: center; position: relative; z-index: 2; }
.hc7-hero-copy h1 { font-size: 3.2rem; margin-bottom: 1.5rem; }
.hc7-hero-copy p { color: var(--muted); font-size: 1.05rem; max-width: 480px; margin-bottom: 2rem; }
.hc7-hero-actions { display: flex; gap: 1rem; margin-bottom: 2.5rem; flex-wrap: wrap; }
.hc7-hero-trust { display: flex; align-items: center; gap: 1rem; }
.hc7-avatar-group { display: flex; }
.hc7-avatar-group img { width: 40px; height: 40px; border-radius: 50%; border: 3px solid var(--paper); margin-left: -12px; object-fit: cover; }
.hc7-avatar-group img:first-child { margin-left: 0; }
.hc7-hero-trust p { font-size: 0.85rem; color: var(--muted); }
.hc7-hero-trust strong { color: var(--ink); display: block; font-size: 0.95rem; }

.hc7-scheduler { background: #fff; border-radius: 20px; padding: 2rem; box-shadow: 0 25px 60px rgba(16,36,31,0.1); }
.hc7-scheduler-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
.hc7-scheduler-head h3 { font-size: 1.25rem; }
.hc7-scheduler-head span { font-size: 0.8rem; color: var(--muted); }
.hc7-day-row { display: grid; grid-template-columns: repeat(5, 1fr); gap: 0.5rem; margin-bottom: 1.5rem; }
.hc7-day { text-align: center; padding: 0.7rem 0.3rem; border-radius: 10px; background: var(--paper-2); font-size: 0.8rem; color: var(--muted); cursor: pointer; }
.hc7-day span { display: block; font-weight: 700; font-size: 1.05rem; color: var(--ink); margin-top: 0.2rem; }
.hc7-day.active { background: var(--primary); color: #fff; }
.hc7-day.active span { color: #fff; }
.hc7-time-row { display: flex; flex-wrap: wrap; gap: 0.6rem; margin-bottom: 1.5rem; }
.hc7-time { padding: 0.5rem 1rem; border-radius: 50px; border: 1px solid var(--line); font-size: 0.8rem; color: var(--muted); cursor: pointer; }
.hc7-time.active { background: rgba(var(--primary-rgb), 0.1); border-color: var(--primary); color: var(--primary); font-weight: 700; }
.hc7-scheduler-fg { margin-bottom: 1rem; }
.hc7-scheduler-fg input { width: 100%; padding: 0.85rem 1rem; border: 1px solid var(--line); border-radius: 10px; font-family: 'Manrope', sans-serif; font-size: 0.9rem; outline: none; }
.hc7-scheduler-fg input:focus { border-color: var(--primary); }

/* Stats strip */
.hc7-stats { padding: 0 0 5rem; }
.hc7-stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); background: var(--ink); border-radius: 20px; overflow: hidden; }
.hc7-stat { padding: 2.25rem 1.5rem; text-align: center; border-right: 1px solid rgba(255,255,255,0.1); }
.hc7-stat:last-child { border-right: none; }
.hc7-stat h3 { color: #fff; font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 2.1rem; }
.hc7-stat p { color: rgba(255,255,255,0.55); font-size: 0.78rem; text-transform: uppercase; letter-spacing: 1px; margin-top: 0.3rem; }

/* Departments - icon cards */
.hc7-departments { padding: 6rem 0; }
.hc7-departments-head { text-align: center; max-width: 600px; margin: 0 auto 3.5rem; }
.hc7-departments-head h2 { font-size: 2.6rem; }
.hc7-dept-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; }
.hc7-dept-card { background: #fff; border: 1px solid var(--line); border-radius: 16px; padding: 2rem; transition: 0.3s; }
.hc7-dept-card:hover { transform: translateY(-6px); box-shadow: 0 20px 40px rgba(16,36,31,0.08); border-color: transparent; }
.hc7-dept-icon { width: 54px; height: 54px; border-radius: 14px; background: rgba(var(--primary-rgb),0.1); color: var(--primary); display: flex; align-items: center; justify-content: center; margin-bottom: 1.25rem; }
.hc7-dept-card h4 { font-size: 1.15rem; margin-bottom: 0.5rem; }
.hc7-dept-card p { color: var(--muted); font-size: 0.85rem; }

/* Why choose us - split with checklist and image collage */
.hc7-why { padding: 6rem 0; background: var(--paper-2); }
.hc7-why-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; }
.hc7-why-collage { position: relative; height: 460px; }
.hc7-why-collage img.main { width: 78%; height: 100%; object-fit: cover; border-radius: 20px; }
.hc7-why-collage img.floating { position: absolute; width: 45%; height: 55%; object-fit: cover; border-radius: 16px; right: 0; bottom: -1.5rem; border: 6px solid var(--paper-2); box-shadow: 0 20px 40px rgba(16,36,31,0.15); }
.hc7-why-badge { position: absolute; top: 1.5rem; left: -1.5rem; background: #fff; border-radius: 14px; padding: 1.1rem 1.4rem; box-shadow: 0 15px 30px rgba(16,36,31,0.1); display: flex; align-items: center; gap: 0.75rem; }
.hc7-why-badge .ic { width: 40px; height: 40px; border-radius: 50%; background: rgba(var(--primary-rgb),0.12); color: var(--primary); display: flex; align-items: center; justify-content: center; }
.hc7-why-badge h4 { font-size: 1.1rem; }
.hc7-why-badge p { font-size: 0.75rem; color: var(--muted); }
.hc7-why-content h2 { font-size: 2.4rem; margin-bottom: 1.25rem; }
.hc7-why-content > p { color: var(--muted); margin-bottom: 1.75rem; }
.hc7-why-list { display: flex; flex-direction: column; gap: 1rem; }
.hc7-why-item { display: flex; gap: 1rem; align-items: flex-start; }
.hc7-why-item .ic { width: 30px; height: 30px; border-radius: 50%; background: var(--primary); color: #fff; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 0.8rem; }
.hc7-why-item h4 { font-size: 1rem; margin-bottom: 0.2rem; }
.hc7-why-item p { color: var(--muted); font-size: 0.85rem; }

/* Doctors - carousel slider */
.hc7-doctors { padding: 6rem 0; overflow: hidden; }
.hc7-doctors-head { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 3rem; gap: 1.5rem; flex-wrap: wrap; }
.hc7-doctors-head h2 { font-size: 2.6rem; max-width: 520px; }
.hc7-doctors-nav { display: flex; gap: 0.5rem; align-items: center; }
.hc7-doc-prev, .hc7-doc-next { background: #fff !important; border: 1px solid var(--line) !important; color: var(--ink) !important; width: 40px !important; height: 40px !important; border-radius: 50% !important; cursor: pointer; display: flex !important; align-items: center; justify-content: center; font-size: 1.2rem; transition: 0.3s; outline: none; position: static !important; margin: 0 !important; z-index: 10; }
.hc7-doc-prev:hover, .hc7-doc-next:hover { background: var(--primary) !important; border-color: var(--primary) !important; color: #fff !important; }
.hc7-doc-prev:after, .hc7-doc-next:after { font-size: 1rem !important; font-weight: bold; }
.hc7-doctors-wrapper { overflow: hidden; position: relative; margin: 0 -0.5rem; padding: 0.5rem 0.5rem 1.5rem; width: 100%; }
.hc7-doctor-grid { display: flex; width: 100%; gap: 1.5rem; }
.hc7-doctor-card { height: auto !important; flex: 0 0 calc(25% - 1.125rem) !important; width: calc(25% - 1.125rem) !important; flex-shrink: 0; background: #fff; border-radius: 18px; overflow: hidden; border: 1px solid var(--line); transition: transform 0.3s ease, box-shadow 0.3s ease; }
.hc7-doctor-card:hover { transform: translateY(-6px); box-shadow: 0 15px 30px rgba(16,36,31,0.08); }
.hc7-doctor-card img { width: 100%; height: 240px; object-fit: cover; }
.hc7-doctor-info { padding: 1.5rem; }
.hc7-doctor-info span.spec { color: var(--primary); font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
.hc7-doctor-info h4 { font-size: 1.2rem; margin: 0.4rem 0 0.6rem; }
.hc7-doctor-meta { display: flex; justify-content: space-between; align-items: center; font-size: 0.8rem; color: var(--muted); }
.hc7-doctor-meta .stars { color: #f5a623; }

/* Testimonial - centered card carousel look */
.hc7-testimonial { padding: 6rem 0; background: var(--ink); position: relative; }
.hc7-testimonial-inner { max-width: 720px; margin: 0 auto; text-align: center; position: relative; }
.hc7-testimonial-inner .qmark { font-family: 'Lora', serif; font-style: italic; font-size: 3.5rem; color: var(--primary); margin-bottom: 0.5rem; }
.hc7-testimonial-slider { position: relative; width: 100%; overflow: hidden; padding-bottom: 3.5rem; min-height: 220px; }
.hc7-testimonial-slide { width: 100% !important; height: auto !important; opacity: 1 !important; display: block !important; flex-shrink: 0; }

@keyframes hc7FadeIn {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

.hc7-testimonial-inner p.quote { color: #fff; font-family: 'Lora', serif; font-size: 1.5rem; margin-bottom: 2rem; line-height: 1.4; }
.hc7-testimonial-person { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; }
.hc7-testimonial-person img { width: 54px; height: 54px; border-radius: 50%; object-fit: cover; border: 2px solid var(--primary); }
.hc7-testimonial-person span { color: #fff; font-weight: 700; font-size: 0.9rem; }
.hc7-testimonial-person small { color: rgba(255,255,255,0.5); font-size: 0.8rem; }
.hc7-testimonial-prev, .hc7-testimonial-next { background: rgba(255,255,255,0.1) !important; border: 1px solid rgba(255,255,255,0.2) !important; color: #fff !important; width: 36px !important; height: 36px !important; border-radius: 50% !important; cursor: pointer; display: flex !important; align-items: center; justify-content: center; font-size: 1.2rem; transition: 0.3s; outline: none; position: absolute !important; top: 50% !important; margin-top: -30px !important; z-index: 10; }
.hc7-testimonial-prev { left: 0 !important; right: auto !important; }
.hc7-testimonial-next { right: 0 !important; left: auto !important; }
.hc7-testimonial-prev:hover, .hc7-testimonial-next:hover { background: var(--primary) !important; border-color: var(--primary) !important; }
.hc7-testimonial-prev:after, .hc7-testimonial-next:after { font-size: 1rem !important; font-weight: bold; color: #fff; }
.hc7-testimonial-dots { display: flex !important; justify-content: center !important; gap: 0.5rem; position: absolute !important; bottom: 0 !important; left: 0 !important; right: 0 !important; width: 100% !important; z-index: 10; margin: 0 !important; }
.hc7-testimonial-dots .swiper-pagination-bullet { width: 8px !important; height: 8px !important; border-radius: 50% !important; background: rgba(255,255,255,0.25) !important; opacity: 1 !important; cursor: pointer; transition: 0.3s; margin: 0 3px !important; }
.hc7-testimonial-dots .swiper-pagination-bullet-active { background: var(--primary) !important; width: 24px !important; border-radius: 4px !important; }

/* Insurance/partners strip */
.hc7-insurance { padding: 3.5rem 0; border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
.hc7-insurance-inner { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 2rem; }
.hc7-insurance-label { font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px; color: var(--muted); font-weight: 700; }
.hc7-insurance-logos { display: flex; gap: 2.5rem; flex-wrap: wrap; }
.hc7-insurance-logos span { font-family: 'Lora', serif; font-size: 1.1rem; color: var(--muted); border: 1px solid var(--line); padding: 0.5rem 1.25rem; border-radius: 50px; }

/* FAQ */
.hc7-faq { padding: 6rem 0; }
.hc7-faq-grid { display: grid; grid-template-columns: 0.7fr 1.3fr; gap: 3.5rem; }
.hc7-faq-grid h2 { font-size: 2.6rem; }
details.hc7-faq-item { background: #fff; border: 1px solid var(--line); border-radius: 14px; padding: 1.4rem 1.75rem; margin-bottom: 1rem; cursor: pointer; }
summary.hc7-faq-item-head { display: flex; justify-content: space-between; align-items: center; gap: 1rem; font-weight: 700; font-size: 0.98rem; list-style: none; outline: none; }
summary.hc7-faq-item-head::-webkit-details-marker { display: none; }
.hc7-faq-toggle { width: 30px; height: 30px; border-radius: 50%; background: var(--paper-2); color: var(--primary); display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: 0.3s; }
details.hc7-faq-item[open] .hc7-faq-toggle { background: var(--primary); color: #fff; transform: rotate(45deg); }
.hc7-faq-body { color: var(--muted); font-size: 0.9rem; margin-top: 0.9rem; }

/* Appointment / Contact - full form */
.hc7-appointment { padding: 6rem 0; }
.hc7-appointment-card { background: linear-gradient(135deg, var(--primary), var(--ink)); border-radius: 24px; padding: 4rem; overflow: hidden; position: relative; text-align: center; }
.hc7-appointment-card::before { content: ''; position: absolute; top: -20%; left: -10%; width: 320px; height: 320px; border-radius: 50%; background: rgba(255,255,255,0.08); }
.hc7-appointment-info { position: relative; z-index: 2; color: #fff; }
.hc7-appointment-info h2 { color: #fff; font-size: 2.6rem; margin-bottom: 1.25rem; line-height: 1.1; }
.hc7-appointment-info > p { color: rgba(255,255,255,0.7); margin-bottom: 2.5rem; font-size: 1.05rem; }
.hc7-info-row { display: flex; gap: 1rem; align-items: flex-start; background: rgba(255,255,255,0.05); padding: 1rem; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); margin-bottom: 0; }
.hc7-info-row .ic { width: 42px; height: 42px; border-radius: 10px; background: rgba(255,255,255,1); color: var(--primary); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.hc7-info-row h4 { font-size: 0.95rem; margin-bottom: 0.1rem; color: #fff; }
.hc7-info-row p { color: rgba(255,255,255,0.7); font-size: 0.85rem; }
.hc7-appointment-form { position: relative; z-index: 2; background: #fff; border-radius: 18px; padding: 2.5rem; }
.hc7-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.1rem; margin-bottom: 1.1rem; }
.hc7-fg label { display: block; font-size: 0.78rem; font-weight: 700; color: var(--muted); margin-bottom: 0.4rem; }
.hc7-fg input, .hc7-fg select, .hc7-fg textarea { width: 100%; padding: 0.8rem 1rem; border: 1px solid var(--line); border-radius: 10px; font-family: 'Manrope', sans-serif; font-size: 0.9rem; outline: none; }
.hc7-fg input:focus, .hc7-fg select:focus, .hc7-fg textarea:focus { border-color: var(--primary); }
.hc7-fg textarea { resize: vertical; min-height: 80px; }
.hc7-form-full { grid-column: 1 / -1; }

/* Footer */
.hc7-footer { background: var(--ink); color: #fff; padding-top: 4.5rem; }
.hc7-footer-grid { display: grid; grid-template-columns: 1.2fr 0.8fr 0.8fr 1fr; gap: 3rem; padding-bottom: 3rem; border-bottom: 1px solid rgba(255,255,255,0.1); }
.hc7-footer-logo { display: flex; align-items: center; gap: 0.6rem; font-family: 'Lora', serif; font-size: 1.3rem; margin-bottom: 1rem; }
.hc7-footer-logo .ic { width: 36px; height: 36px; border-radius: 10px; background: var(--primary); display: flex; align-items: center; justify-content: center; }
.hc7-footer-col p { color: rgba(255,255,255,0.55); font-size: 0.9rem; }
.hc7-footer-col h4 { font-family: 'Manrope', sans-serif; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1.5px; color: rgba(255,255,255,0.4); margin-bottom: 1.25rem; }
.hc7-footer-col ul { list-style: none; display: flex; flex-direction: column; gap: 0.85rem; }
.hc7-footer-col a { color: rgba(255,255,255,0.65); font-size: 0.9rem; }
.hc7-footer-col a:hover { color: var(--primary); }
.hc7-footer-bottom { padding: 1.75rem 0; text-align: center; font-size: 0.82rem; color: rgba(255,255,255,0.4); }



@media (max-width: 992px) {
  .hc7-hero-grid, .hc7-why-grid, .hc7-faq-grid, .hc7-appointment-card { grid-template-columns: 1fr; }
  .hc7-stats-grid { grid-template-columns: 1fr 1fr; }
  .hc7-dept-grid { grid-template-columns: 1fr 1fr; }
  .hc7-doctor-card { flex: 0 0 calc(50% - 0.75rem) !important; width: calc(50% - 0.75rem) !important; }
  .hc7-footer-grid { grid-template-columns: 1fr 1fr; }
  .hc7-why-collage { height: 360px; }
}
@media (max-width: 768px) {
  .hc7-hero-copy h1 { font-size: 2.2rem; }
  .hc7-departments-head h2, .hc7-why-content h2, .hc7-doctors-head h2, .hc7-faq-grid h2, .hc7-appointment-info h2 { font-size: 1.9rem; }
  .hc7-stats-grid { grid-template-columns: 1fr 1fr; }
  .hc7-dept-grid { grid-template-columns: 1fr; }
  .hc7-doctor-card { flex: 0 0 100% !important; width: 100% !important; }
  .hc7-form-grid { grid-template-columns: 1fr; }
  .hc7-footer-grid { grid-template-columns: 1fr; }
  .hc7-appointment-card { padding: 2rem; }
  .hc7-day-row { grid-template-columns: repeat(5, 1fr); font-size: 0.7rem; }
}
`;

export const healthcare07Html = `
<header class="hc7-header">
  <div class="container hc7-header-inner">
    <a href="#" class="hc7-logo" style="display: flex; align-items: center; gap: 0.5rem;">
      LOGO_PLACEHOLDER
    </a>
    <div class="hc7-header-emergency" style="gap: 1.5rem; align-items: center;">
      <div style="display: flex; flex-direction: column; text-align: right; gap: 0.15rem;">
        <span style="font-size: 0.9rem;">Call Us: <strong>PHONE_PLACEHOLDER</strong></span>
        <span style="font-size: 0.75rem;">Email: <strong>EMAIL_PLACEHOLDER</strong></span>
      </div>
      <a href="#appointment" class="btn btn-primary">Book Appointment</a>
    </div>
  </div>
</header>

<section class="hc7-hero">
  <div class="hc7-hero-blob"></div>
  <div class="container hc7-hero-grid">
    <div class="hc7-hero-copy hc7-reveal">
      <div class="eyebrow">Compassionate Care</div>
      <h1>Your health, guided by <span class="italic">experts</span> who care.</h1>
      <p>From routine checkups to specialized treatment, our team combines modern medicine with genuine, patient-first care at every visit.</p>
      <div class="hc7-hero-actions">
        <a href="#appointment" class="btn btn-primary">Book An Appointment</a>
        <a href="#departments" class="btn btn-outline">Our Departments</a>
      </div>
      <div class="hc7-hero-trust">
       <div class="hc7-avatar-group">
        <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80" alt="Patient">
        <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80" alt="Patient">
        <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80" alt="Patient">
      </div>
        <p><strong>12,400+ Patients</strong>Trust our care every year</p>
      </div>
    </div>

    <div class="hc7-scheduler hc7-reveal" style="transition-delay: 0.15s;">
      <div class="hc7-scheduler-head">
        <h3>Quick Booking</h3>
        <span>Step 1 of 2</span>
      </div>
      <div class="hc7-day-row">
        <div class="hc7-day">Mon<span>21</span></div>
        <div class="hc7-day active">Tue<span>22</span></div>
        <div class="hc7-day">Wed<span>23</span></div>
        <div class="hc7-day">Thu<span>24</span></div>
        <div class="hc7-day">Fri<span>25</span></div>
      </div>
      <div class="hc7-time-row">
        <span class="hc7-time">9:00 AM</span>
        <span class="hc7-time active">11:30 AM</span>
        <span class="hc7-time">2:00 PM</span>
        <span class="hc7-time">4:30 PM</span>
      </div>
      <form class="lead-capture-form">
        <div class="hc7-scheduler-fg"><input type="text" name="name" placeholder="Full Name" required></div>
        <div class="hc7-scheduler-fg"><input type="tel" name="phone" placeholder="Phone Number" required></div>
        <button type="submit" class="btn btn-primary" style="width: 100%; justify-content: center;">Confirm Slot</button>
      </form>
    </div>
  </div>
</section>

<section class="hc7-stats">
  <div class="container">
    <div class="hc7-stats-grid hc7-reveal">
      <div class="hc7-stat"><h3>25+</h3><p>Years of Care</p></div>
      <div class="hc7-stat"><h3>40+</h3><p>Specialist Doctors</p></div>
      <div class="hc7-stat"><h3>98%</h3><p>Patient Satisfaction</p></div>
      <div class="hc7-stat"><h3>24/7</h3><p>Emergency Support</p></div>
    </div>
  </div>
</section>

<section class="hc7-departments" id="departments">
  <div class="container">
    <div class="hc7-departments-head hc7-reveal">
      <div class="eyebrow" style="justify-content:center;">SERVICES_PLACEHOLDER</div>
      <h2>Departments built around you.</h2>
    </div>
    <div class="hc7-dept-grid hc7-reveal">
      <div class="hc7-dept-card">
        <div class="hc7-dept-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg></div>
        <h4>Cardiology</h4>
        <p>Comprehensive heart care from diagnosis to long-term management.</p>
      </div>
      <div class="hc7-dept-card">
        <div class="hc7-dept-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 8v4l3 3"></path></svg></div>
        <h4>Emergency Care</h4>
        <p>Round-the-clock emergency response with rapid triage and treatment.</p>
      </div>
      <div class="hc7-dept-card">
        <div class="hc7-dept-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path></svg></div>
        <h4>Pediatrics</h4>
        <p>Gentle, thorough care for infants, children, and adolescents.</p>
      </div>
      <div class="hc7-dept-card">
        <div class="hc7-dept-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 12l2 2 4-4"></path><circle cx="12" cy="12" r="10"></circle></svg></div>
        <h4>Orthopedics</h4>
        <p>Advanced treatment for bones, joints, and sports injuries.</p>
      </div>
    </div>
  </div>
</section>

<section class="hc7-why">
  <div class="container hc7-why-grid">
    <div class="hc7-why-collage hc7-reveal">
        <img class="main"src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=900&q=80"  alt="Doctor with patient">     
        <img class="floating" src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=500&q=80"  alt="Modern clinic interior">
      <div class="hc7-why-badge">
        <span class="ic"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"></path></svg></span>
        <div><h4>15K+</h4><p>Lives Improved</p></div>
      </div>
    </div>
    <div class="hc7-why-content hc7-reveal" style="transition-delay: 0.15s;">
      <div class="eyebrow">Why Choose Us</div>
      <h2>Care that puts you at the center.</h2>
      <p>We combine advanced medical technology with a warm, patient-first approach — because good healthcare is about more than treatment, it's about trust.</p>
      <div class="hc7-why-list">
        <div class="hc7-why-item"><span class="ic">✓</span><div><h4>Board-certified specialists</h4><p>Every department led by experienced, credentialed physicians.</p></div></div>
        <div class="hc7-why-item"><span class="ic">✓</span><div><h4>Same-day appointments</h4><p>Urgent needs handled quickly, without long wait times.</p></div></div>
        <div class="hc7-why-item"><span class="ic">✓</span><div><h4>Transparent, upfront pricing</h4><p>No surprise bills — costs are shared before treatment begins.</p></div></div>
      </div>
    </div>
  </div>
</section>

<section class="hc7-doctors" id="doctors">
  <div class="container">
    <div class="hc7-doctors-head hc7-reveal">
      <div>
        <div class="eyebrow">Our Team</div>
        <h2>Meet our specialist physicians.</h2>
      </div>
      <div style="display: flex; gap: 1rem; align-items: center;">
        <div class="hc7-doctors-nav">
          <div data-gjs-type="swiper-button-prev" class="swiper-button-prev hc7-doc-prev"></div>
          <div data-gjs-type="swiper-button-next" class="swiper-button-next hc7-doc-next"></div>
        </div>
      </div>
    </div>
    <div data-gjs-type="swiper-container" class="swiper-container hc7-doctors-wrapper hc7-reveal" data-slides-per-view="4" data-space-between="24" data-navigation="true">
      <div data-gjs-type="swiper-wrapper" class="swiper-wrapper hc7-doctor-grid">
        <div data-gjs-type="swiper-slide" class="swiper-slide hc7-doctor-card">
          <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=500&q=80" alt="Dr. Sarah Bennett">
          <div class="hc7-doctor-info">
            <span class="spec">Cardiology</span>
            <h4>Dr. Sarah Bennett</h4>
            <div class="hc7-doctor-meta"><span class="stars">★★★★★</span><span>12 yrs exp.</span></div>
          </div>
        </div>
        <div data-gjs-type="swiper-slide" class="swiper-slide hc7-doctor-card">
          <img src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=500&q=80" alt="Dr. James Carter">
          <div class="hc7-doctor-info">
            <span class="spec">Pediatrics</span>
            <h4>Dr. James Carter</h4>
            <div class="hc7-doctor-meta"><span class="stars">★★★★★</span><span>9 yrs exp.</span></div>
          </div>
        </div>
        <div data-gjs-type="swiper-slide" class="swiper-slide hc7-doctor-card">
          <img src="https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?auto=format&fit=crop&w=600&q=80" alt="Dr. Mia Wong">
          <div class="hc7-doctor-info">
            <span class="spec">Orthopedics</span>
            <h4>Dr. Mia Wong</h4>
            <div class="hc7-doctor-meta"><span class="stars">★★★★★</span><span>14 yrs exp.</span></div>
          </div>
        </div>
        <div data-gjs-type="swiper-slide" class="swiper-slide hc7-doctor-card">
          <img src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=500&q=80" alt="Dr. Daniel Scott">
          <div class="hc7-doctor-info">
            <span class="spec">Emergency Care</span>
            <h4>Dr. Daniel Scott</h4>
            <div class="hc7-doctor-meta"><span class="stars">★★★★★</span><span>11 yrs exp.</span></div>
          </div>
        </div>
        <div data-gjs-type="swiper-slide" class="swiper-slide hc7-doctor-card">
          <img src="https://images.unsplash.com/photo-1594824813566-88855ce78905?auto=format&fit=crop&w=500&q=80" alt="Dr. Elena Rostova">
          <div class="hc7-doctor-info">
            <span class="spec">Neurology</span>
            <h4>Dr. Elena Rostova</h4>
            <div class="hc7-doctor-meta"><span class="stars">★★★★★</span><span>16 yrs exp.</span></div>
          </div>
        </div>
        <div data-gjs-type="swiper-slide" class="swiper-slide hc7-doctor-card">
          <img src="https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=500&q=80" alt="Dr. Marcus Vance">
          <div class="hc7-doctor-info">
            <span class="spec">Dermatology</span>
            <h4>Dr. Marcus Vance</h4>
            <div class="hc7-doctor-meta"><span class="stars">★★★★★</span><span>10 yrs exp.</span></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="hc7-testimonial">
  <div class="container">
    <div class="hc7-testimonial-inner hc7-reveal">
      <div class="qmark">"</div>
      <div data-gjs-type="swiper-container" class="swiper-container hc7-testimonial-slider" data-slides-per-view="1" data-navigation="true" data-pagination="bullets">
        <div data-gjs-type="swiper-wrapper" class="swiper-wrapper">
          <div data-gjs-type="swiper-slide" class="swiper-slide hc7-testimonial-slide">
            <p class="quote">From the front desk to the doctor's office, every step felt genuinely caring. I've never felt more listened to at a clinic.</p>
            <div class="hc7-testimonial-person">
              <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80" alt="Rachel Kim">
              <span>Rachel Kim</span>
              <small>Patient since 2022</small>
            </div>
          </div>
          <div data-gjs-type="swiper-slide" class="swiper-slide hc7-testimonial-slide">
            <p class="quote">The specialists took the time to explain every detail of my treatment plan. Exceptional care and modern facilities!</p>
            <div class="hc7-testimonial-person">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" alt="Michael Chen">
              <span>Michael Chen</span>
              <small>Cardiology Patient</small>
            </div>
          </div>
          <div data-gjs-type="swiper-slide" class="swiper-slide hc7-testimonial-slide">
            <p class="quote">Booking an urgent appointment was effortless. Dr. Bennett and the entire staff were warm, professional, and attentive.</p>
            <div class="hc7-testimonial-person">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80" alt="Sophia Rodriguez">
              <span>Sophia Rodriguez</span>
              <small>Pediatric Parent</small>
            </div>
          </div>
          <div data-gjs-type="swiper-slide" class="swiper-slide hc7-testimonial-slide">
            <p class="quote">Outstanding orthopedic treatment! The physical therapy team had me back on my feet much faster than I expected.</p>
            <div class="hc7-testimonial-person">
              <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80" alt="David Miller">
              <span>David Miller</span>
              <small>Orthopedics Patient</small>
            </div>
          </div>
        </div>
        <div data-gjs-type="swiper-pagination" class="swiper-pagination hc7-testimonial-dots"></div>
        <div data-gjs-type="swiper-button-prev" class="swiper-button-prev hc7-testimonial-prev"></div>
        <div data-gjs-type="swiper-button-next" class="swiper-button-next hc7-testimonial-next"></div>
      </div>
    </div>
  </div>
</section>

<section class="hc7-insurance">
  <div class="container hc7-insurance-inner">
    <span class="hc7-insurance-label">Accepted Insurance Partners</span>
    <div class="hc7-insurance-logos">
      <span>WellCare</span>
      <span>MediTrust</span>
      <span>BlueShield Plus</span>
      <span>CareFirst</span>
    </div>
  </div>
</section>

<section class="hc7-faq">
  <div class="container hc7-faq-grid">
    <div class="hc7-reveal">
      <div class="eyebrow">FAQ</div>
      <h2>Common questions.</h2>
      <p style="color: var(--muted); margin-top: 1rem;">Can't find what you're looking for? Give us a call directly.</p>
    </div>
    <div class="hc7-reveal" style="transition-delay: 0.15s;">
      <details class="hc7-faq-item" open>
        <summary class="hc7-faq-item-head"><span>Do I need a referral to see a specialist?</span><span class="hc7-faq-toggle">+</span></summary>
        <div class="hc7-faq-body">In most cases no — you can book directly with our specialists. Some insurance plans may require a referral, which our team can help confirm.</div>
      </details>
      <details class="hc7-faq-item">
        <summary class="hc7-faq-item-head"><span>What should I bring to my first visit?</span><span class="hc7-faq-toggle">+</span></summary>
        <div class="hc7-faq-body">A valid ID, your insurance card, and any prior medical records or current medications you're taking.</div>
      </details>
      <details class="hc7-faq-item">
        <summary class="hc7-faq-item-head"><span>Do you offer telehealth consultations?</span><span class="hc7-faq-toggle">+</span></summary>
        <div class="hc7-faq-body">Yes, most of our departments offer virtual consultations for follow-ups and non-urgent concerns.</div>
      </details>
      <details class="hc7-faq-item">
        <summary class="hc7-faq-item-head"><span>How do I handle a medical emergency?</span><span class="hc7-faq-toggle">+</span></summary>
        <div class="hc7-faq-body">Call our 24/7 emergency line immediately at PHONE_PLACEHOLDER, or visit our emergency department directly.</div>
      </details>
    </div>
  </div>
</section>

<section class="hc7-appointment" id="appointment">
  <div class="container">
    <div class="hc7-appointment-card">
      <div class="hc7-appointment-info hc7-reveal">
        <div class="eyebrow" style="background: rgba(255,255,255,0.1); color: #fff;">Book A Visit</div>
        <div class="logo" style="margin-bottom: 1.5rem; display: flex; justify-content: center; filter: brightness(0) invert(1);">LOGO_PLACEHOLDER</div>
        <h2>Schedule your appointment today.</h2>
        <p>Contact our care team to confirm your appointment within a few hours.</p>
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; text-align: left; margin-top: 2rem;">
          <div class="hc7-info-row">
            <div class="ic"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg></div>
            <div><h4>Location</h4><p>ADDRESS_PLACEHOLDER</p></div>
          </div>
          <div class="hc7-info-row">
            <div class="ic"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg></div>
            <div><h4>Phone</h4><p>PHONE_PLACEHOLDER</p></div>
          </div>
          <div class="hc7-info-row">
            <div class="ic"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg></div>
            <div><h4>Email</h4><p>EMAIL_PLACEHOLDER</p></div>
          </div>
          <div class="hc7-info-row">
            <div class="ic"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg></div>
            <div><h4>Hours</h4><p>8:00 AM - 7:00 PM</p></div>
          </div>
        </div>
      </div>

    </div>
  </div>
</section>

<footer class="hc7-footer">
  <div class="container hc7-footer-grid">
    <div>
      <div class="logo" style="margin-bottom: 1.5rem; display: flex; justify-content: center; filter: brightness(0) invert(1);">LOGO_PLACEHOLDER</div>
      <p>Compassionate, modern healthcare — from routine checkups to specialized treatment, all under one roof.</p>
    </div>
    <div class="hc7-footer-col">
      <h4>Navigate</h4>
      <ul>
        <li><a href="#departments">Departments</a></li>
        <li><a href="#doctors">Our Doctors</a></li>
        <li><a href="#appointment">Book Appointment</a></li>
      </ul>
    </div>
    <div class="hc7-footer-col">
      <h4>Departments</h4>
      <ul>
        <li><a href="#departments">SERVICES_PLACEHOLDER</a></li>
        <li><a href="#departments">Pediatrics</a></li>
        <li><a href="#departments">Orthopedics</a></li>
        <li><a href="#departments">Emergency Care</a></li>
      </ul>
    </div>
    <div class="hc7-footer-col">
      <h4>Contact</h4>
      <ul>
        <li><a href="tel:PHONE_PLACEHOLDER">PHONE_PLACEHOLDER</a></li>
        <li><a href="mailto:EMAIL_PLACEHOLDER">EMAIL_PLACEHOLDER</a></li>
        <li>ADDRESS_PLACEHOLDER</li>
      </ul>
    </div>
  </div>
  <div class="hc7-footer-bottom">© 2026 PROJECT_NAME_PLACEHOLDER. All Rights Reserved.</div>
</footer>

<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" />
<script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
<script id="core-interactions">
  (function() {
    var isInEditor = !!document.querySelector('[data-gjs-type]') || document.body.classList.contains('gjs-dashed');

    // Run interactions in editor as well
    document.body.classList.add('js-enabled');

    // Event Delegation for Days, Times & FAQ
    document.addEventListener('click', function(e) {
      var dayEl = e.target.closest('.hc7-day');
      if (dayEl) {
        var days = document.querySelectorAll('.hc7-day');
        days.forEach(function(x) { x.classList.remove('active'); });
        dayEl.classList.add('active');
      }

      var timeEl = e.target.closest('.hc7-time');
      if (timeEl) {
        var times = document.querySelectorAll('.hc7-time');
        times.forEach(function(x) { x.classList.remove('active'); });
        timeEl.classList.add('active');
      }

      // FAQ Accordion Toggle for Native Details
      var summary = e.target.closest('summary.hc7-faq-item-head');
      if (summary) {
        var details = summary.closest('details.hc7-faq-item');
        if (details && details.parentElement) {
          details.parentElement.querySelectorAll('details.hc7-faq-item').forEach(function(d) {
            if (d !== details) d.removeAttribute('open');
          });
        }
      }
    });

    var revealEls = document.querySelectorAll('.hc7-reveal');
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });
      revealEls.forEach(function(el) { io.observe(el); });
    }

    // Initialize Swiper in preview & live mode
    if (typeof Swiper !== 'undefined') {
      var swipers = document.querySelectorAll('.swiper-container');
      swipers.forEach(function(s) {
        var isDoc = s.classList.contains('hc7-doctors-wrapper');
        if (isDoc) {
          new Swiper(s, {
            slidesPerView: 4,
            spaceBetween: 24,
            loop: true,
            autoplay: {
              delay: 4000,
              disableOnInteraction: false,
            },
            navigation: {
              nextEl: s.parentElement ? s.parentElement.querySelector('.hc7-doc-next') || document.querySelector('.hc7-doc-next') : document.querySelector('.hc7-doc-next'),
              prevEl: s.parentElement ? s.parentElement.querySelector('.hc7-doc-prev') || document.querySelector('.hc7-doc-prev') : document.querySelector('.hc7-doc-prev'),
            },
            breakpoints: {
              0: { slidesPerView: 1 },
              640: { slidesPerView: 2 },
              992: { slidesPerView: 4 }
            }
          });
        } else {
          new Swiper(s, {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            autoplay: {
              delay: 5000,
              disableOnInteraction: false,
            },
            pagination: {
              el: s.querySelector('.swiper-pagination'),
              clickable: true,
            },
            navigation: {
              nextEl: s.querySelector('.swiper-button-next'),
              prevEl: s.querySelector('.swiper-button-prev'),
            },
          });
        }
      });
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
                if (input.nextElementSibling && input.nextElementSibling.classList.contains('val-error')) {
                  input.nextElementSibling.style.display = 'none';
                }
              } else {
                input.style.borderColor = '#ef4444';
                if (input.nextElementSibling && input.nextElementSibling.classList.contains('val-error')) {
                  input.nextElementSibling.style.display = 'block';
                }
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
        }
      }
    }, true);
  })();
</script>
`;