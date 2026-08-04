export const healthcare10Styles = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,600&display=swap');

:root {
  --primary: PRIMARY_COLOR_PLACEHOLDER;
  --secondary: SECONDARY_COLOR_PLACEHOLDER;
  --primary-rgb: PRIMARY_RGB_PLACEHOLDER;
  --secondary-rgb: SECONDARY_RGB_PLACEHOLDER;
  --ink: #0b1329;
  --paper: #f8fafc;
  --paper-2: rgba(var(--primary-rgb), 0.06);
  --muted: #64748b;
  --line: #e2e8f0;
  --card-shadow: 0 25px 50px -12px rgba(11, 19, 41, 0.08);
}

* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Plus Jakarta Sans', sans-serif; color: var(--ink); background: var(--paper); line-height: 1.65; overflow-x: hidden; }
h1, h2, h3, h4 { font-family: 'Playfair Display', serif; font-weight: 700; line-height: 1.2; color: var(--ink); }
.container { max-width: 1240px; margin: 0 auto; padding: 0 1.5rem; position: relative; z-index: 5; }
img { max-width: 100%; display: block; }
a { text-decoration: none; color: inherit; transition: 0.3s; }

.eyebrow { display: inline-flex; align-items: center; gap: 0.55rem; font-size: 0.78rem; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; color: var(--primary); margin-bottom: 0.85rem; }
.eyebrow::before { content: ''; width: 24px; height: 2.5px; background: var(--primary); border-radius: 4px; }

.btn { display: inline-flex; align-items: center; justify-content: center; gap: 0.65rem; padding: 0.95rem 1.95rem; border-radius: 12px; font-weight: 700; font-size: 0.9rem; cursor: pointer; border: 1px solid transparent; transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1); }
.btn-primary { background: var(--primary); color: #fff; box-shadow: 0 12px 28px -6px rgba(var(--primary-rgb), 0.45); }
.btn-primary:hover { background: var(--secondary); transform: translateY(-3px); box-shadow: 0 16px 32px -6px rgba(var(--secondary-rgb), 0.55); }
.btn-secondary { background: var(--paper-2); color: var(--primary); border-color: rgba(var(--primary-rgb), 0.2); }
.btn-secondary:hover { background: var(--primary); color: #fff; transform: translateY(-3px); }
.btn-outline { border: 1px solid var(--line); background: #ffffff; color: var(--ink); }
.btn-outline:hover { border-color: var(--primary); color: var(--primary); transform: translateY(-2px); }

/* --- Heritage Topbar & Header --- */
.hc10-topbar { background: var(--ink); color: rgba(255,255,255,0.8); font-size: 0.82rem; padding: 0.75rem 0; border-bottom: 1px solid rgba(255,255,255,0.08); }
.hc10-topbar-inner { display: flex; justify-content: space-between; align-items: center; }
.hc10-heritage-badge { display: inline-flex; align-items: center; gap: 0.5rem; background: rgba(var(--primary-rgb), 0.12); border: 1px solid rgba(var(--primary-rgb), 0.3); padding: 0.3rem 0.85rem; border-radius: 50px; color: var(--primary); font-weight: 700; font-size: 0.75rem; letter-spacing: 0.5px; }
.hc10-topbar-right { display: flex; gap: 1.75rem; align-items: center; }
.hc10-topbar-item { display: flex; align-items: center; gap: 0.45rem; }
.hc10-topbar-item svg { color: var(--primary); width: 14px; height: 14px; }
.hc10-emergency-hotline { color: var(--primary); font-weight: 800; display: flex; align-items: center; gap: 0.4rem; background: rgba(var(--primary-rgb), 0.1); padding: 0.25rem 0.75rem; border-radius: 6px; }

.hc10-header { position: sticky; top: 0; z-index: 100; background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(14px); border-bottom: 1px solid var(--line); padding: 1.1rem 0; }
.hc10-header-inner { display: flex; justify-content: space-between; align-items: center; }
.hc10-logo { font-size: 1.35rem; font-weight: 800; color: var(--ink); display: flex; align-items: center; gap: 0.65rem; }
.hc10-nav { display: flex; align-items: center; gap: 2.2rem; list-style: none; }
.hc10-nav a { font-size: 0.92rem; font-weight: 600; color: var(--ink); opacity: 0.85; }
.hc10-nav a:hover { opacity: 1; color: var(--primary); }

/* --- 30-Year Legacy Hero --- */
.hc10-hero { padding: 4.5rem 0 4rem; background: linear-gradient(180deg, #ffffff 0%, #f1f5f9 100%); position: relative; overflow: hidden; }
.hc10-hero-grid { display: grid; grid-template-columns: 1.15fr 0.85fr; gap: 4rem; align-items: center; }
.hc10-hero-copy h1 { font-size: 3.4rem; margin-bottom: 1.25rem; letter-spacing: -0.02em; }
.hc10-hero-copy h1 span { color: var(--primary); font-style: italic; }
.hc10-hero-copy p { font-size: 1.08rem; color: var(--muted); margin-bottom: 2rem; max-width: 560px; line-height: 1.7; }
.hc10-hero-badges-list { display: flex; flex-direction: column; gap: 0.6rem; margin-bottom: 2rem; }
.hc10-hero-badge-pill { display: inline-flex; align-items: center; gap: 0.5rem; font-size: 0.88rem; font-weight: 700; color: var(--ink); }
.hc10-hero-badge-pill svg { color: var(--primary); flex-shrink: 0; }

.hc10-trust-strip { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.25rem; padding-top: 1.75rem; border-top: 1px solid var(--line); }
.hc10-trust-item { display: flex; flex-direction: column; }
.hc10-trust-item h4 { font-size: 1.6rem; font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; color: var(--primary); }
.hc10-trust-item p { font-size: 0.78rem; color: var(--muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }

/* --- Hero Embedded Form Card --- */
.hc10-hero-form-card {
  background: #ffffff;
  border-radius: 26px;
  padding: 2.25rem;
  border: 1px solid var(--line);
  box-shadow: 0 30px 60px -15px rgba(11, 19, 41, 0.12);
  position: relative;
  z-index: 10;
}
.hc10-hero-form-head { margin-bottom: 1.25rem; text-align: left; }
.hc10-form-badge { display: inline-block; background: rgba(var(--primary-rgb), 0.1); color: var(--primary); font-size: 0.72rem; font-weight: 800; padding: 0.25rem 0.75rem; border-radius: 50px; margin-bottom: 0.5rem; letter-spacing: 1px; }
.hc10-hero-form-head h3 { font-size: 1.55rem; font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; color: var(--ink); margin-bottom: 0.2rem; }
.hc10-hero-form-head p { font-size: 0.85rem; color: var(--muted); margin: 0; }

.hc10-hero-form { display: flex; flex-direction: column; gap: 0.95rem; }
.hc10-form-field { display: flex; flex-direction: column; gap: 0.35rem; text-align: left; }
.hc10-form-field label { font-size: 0.78rem; font-weight: 800; color: var(--ink); }
.hc10-form-field input, .hc10-form-field select, .hc10-form-field textarea {
  width: 100%;
  padding: 0.8rem 1rem;
  border-radius: 10px;
  border: 1px solid var(--line);
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.88rem;
  outline: none;
  background: var(--paper);
  transition: all 0.2s ease;
}
.hc10-form-field input:focus, .hc10-form-field select:focus, .hc10-form-field textarea:focus {
  border-color: var(--primary);
  background: #ffffff;
  box-shadow: 0 0 0 4px rgba(var(--primary-rgb), 0.1);
}
.hc10-form-row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 0.85rem; }
.hc10-form-trust-note { display: flex; align-items: center; justify-content: center; gap: 0.4rem; font-size: 0.78rem; color: var(--muted); margin-top: 0.4rem; font-weight: 600; }

/* --- 30-Year Milestones Banner --- */
.hc10-milestones { background: var(--ink); color: #ffffff; padding: 3rem 0; }
.hc10-milestones-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2rem; }
.hc10-milestone-box { text-align: center; border-right: 1px solid rgba(255,255,255,0.1); padding-right: 1.5rem; }
.hc10-milestone-box:last-child { border-right: none; }
.hc10-milestone-box h3 { font-size: 1.7rem; color: var(--primary); margin-bottom: 0.2rem; font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; }
.hc10-milestone-box p { font-size: 0.88rem; color: rgba(255,255,255,0.7); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }

/* --- Legacy & Founder's Story --- */
.hc10-legacy { padding: 6.5rem 0; background: #ffffff; }
.hc10-legacy-grid { display: grid; grid-template-columns: 0.9fr 1.1fr; gap: 4.5rem; align-items: center; }
.hc10-legacy-imgs { position: relative; }
.hc10-legacy-imgs img.main-img { width: 85%; height: 440px; object-fit: cover; border-radius: 24px; box-shadow: var(--card-shadow); }
.hc10-legacy-imgs img.sub-img { position: absolute; bottom: -30px; right: 0; width: 55%; height: 240px; object-fit: cover; border-radius: 20px; border: 4px solid #ffffff; box-shadow: var(--card-shadow); }

.hc10-legacy-copy h2 { font-size: 2.8rem; margin-bottom: 1.25rem; }
.hc10-legacy-copy p { color: var(--muted); font-size: 1.05rem; margin-bottom: 1.5rem; line-height: 1.7; }
.hc10-founder-quote { background: var(--paper); border-left: 4px solid var(--primary); padding: 1.5rem 1.75rem; border-radius: 0 16px 16px 0; margin: 2rem 0; }
.hc10-founder-quote p { font-family: 'Playfair Display', serif; font-style: italic; font-size: 1.15rem; color: var(--ink); margin-bottom: 0.75rem; }
.hc10-founder-name { font-size: 0.85rem; font-weight: 800; color: var(--primary); text-transform: uppercase; letter-spacing: 1px; }

/* --- Timeline Component --- */
.hc10-timeline-sec { padding: 6rem 0; background: var(--paper); border-top: 1px solid var(--line); }
.hc10-timeline-head { text-align: center; max-width: 640px; margin: 0 auto 4rem; }
.hc10-timeline-head h2 { font-size: 2.7rem; }
.hc10-timeline-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; position: relative; }
.hc10-timeline-card { background: #ffffff; border: 1px solid var(--line); border-radius: 20px; padding: 2.25rem 1.5rem; text-align: center; box-shadow: var(--card-shadow); transition: all 0.3s; }
.hc10-timeline-card:hover { transform: translateY(-6px); border-color: var(--primary); }
.hc10-year-badge { display: inline-block; background: rgba(var(--primary-rgb), 0.1); color: var(--primary); font-weight: 800; font-size: 1.1rem; padding: 0.35rem 1rem; border-radius: 50px; margin-bottom: 1rem; font-family: 'Plus Jakarta Sans', sans-serif; }
.hc10-timeline-card h4 { font-size: 1.15rem; font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700; margin-bottom: 0.5rem; }
.hc10-timeline-card p { font-size: 0.88rem; color: var(--muted); }

/* --- Specialty Services --- */
.hc10-services { padding: 6.5rem 0; background: #ffffff; border-top: 1px solid var(--line); }
.hc10-services-head { text-align: center; max-width: 640px; margin: 0 auto 3.5rem; }
.hc10-services-head h2 { font-size: 2.7rem; margin-bottom: 0.75rem; }
.hc10-services-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }
.hc10-service-card { background: var(--paper); border-radius: 22px; padding: 2.5rem; border: 1px solid var(--line); transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1); position: relative; }
.hc10-service-card:hover { transform: translateY(-8px); background: #ffffff; border-color: var(--primary); box-shadow: 0 25px 50px -12px rgba(var(--primary-rgb), 0.18); }
.hc10-service-icon { width: 58px; height: 58px; border-radius: 16px; background: var(--paper-2); color: var(--primary); display: flex; align-items: center; justify-content: center; margin-bottom: 1.5rem; }
.hc10-service-card h3 { font-size: 1.45rem; margin-bottom: 0.75rem; font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700; }
.hc10-service-card p { color: var(--muted); font-size: 0.94rem; margin-bottom: 1.5rem; }
.hc10-service-tag { display: inline-block; font-size: 0.75rem; font-weight: 800; color: var(--primary); background: rgba(var(--primary-rgb), 0.1); padding: 0.25rem 0.75rem; border-radius: 50px; margin-bottom: 1rem; }

/* --- Senior Doctors Roster --- */
.hc10-doctors { padding: 6.5rem 0; background: var(--paper); border-top: 1px solid var(--line); }
.hc10-doctors-head { text-align: center; max-width: 640px; margin: 0 auto 3.5rem; }
.hc10-doctors-head h2 { font-size: 2.7rem; }
.hc10-doctors-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.75rem; }
.hc10-doctor-card { background: #ffffff; border-radius: 22px; overflow: hidden; border: 1px solid var(--line); box-shadow: var(--card-shadow); transition: all 0.3s; }
.hc10-doctor-card:hover { transform: translateY(-6px); border-color: var(--primary); }
.hc10-doctor-img { position: relative; height: 280px; overflow: hidden; }
.hc10-doctor-img img { width: 100%; height: 100%; object-fit: cover; }
.hc10-doctor-info { padding: 1.5rem; text-align: center; }
.hc10-doctor-info h4 { font-size: 1.25rem; font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; margin-bottom: 0.25rem; }
.hc10-doctor-info span.spec { font-size: 0.82rem; color: var(--primary); font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 0.5rem; }
.hc10-doctor-info span.exp { font-size: 0.78rem; color: var(--secondary); font-weight: 700; background: rgba(var(--secondary-rgb), 0.1); padding: 0.2rem 0.6rem; border-radius: 50px; display: inline-block; margin-bottom: 1rem; }

/* --- 30-Year Patient Reviews --- */
.hc10-testimonials { padding: 6.5rem 0; background: var(--ink); color: #ffffff; }
.hc10-testimonials-head { text-align: center; max-width: 640px; margin: 0 auto 3.5rem; }
.hc10-testimonials-head h2 { font-size: 2.7rem; color: #ffffff; }
.hc10-testimonials-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2.25rem; }
.hc10-testi-card { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12); border-radius: 24px; padding: 2.75rem; backdrop-filter: blur(12px); }
.hc10-testi-stars { color: var(--primary); display: flex; gap: 0.3rem; margin-bottom: 1.25rem; font-size: 1.1rem; }
.hc10-testi-quote { font-size: 1.1rem; color: rgba(255,255,255,0.92); line-height: 1.7; margin-bottom: 1.75rem; font-style: italic; font-family: 'Playfair Display', serif; }
.hc10-testi-user { display: flex; align-items: center; gap: 1rem; }
.hc10-testi-user img { width: 52px; height: 52px; border-radius: 50%; object-fit: cover; }
.hc10-testi-user h5 { font-size: 0.98rem; font-weight: 800; color: #ffffff; font-family: 'Plus Jakarta Sans', sans-serif; }
.hc10-testi-user span { font-size: 0.8rem; color: rgba(255,255,255,0.55); }

/* --- Interactive FAQ Accordion --- */
.hc10-faq { padding: 6.5rem 0; background: #ffffff; border-top: 1px solid var(--line); }
.hc10-faq-head { text-align: center; max-width: 640px; margin: 0 auto 3.5rem; }
.hc10-faq-head h2 { font-size: 2.7rem; }
.hc10-faq-list { max-width: 840px; margin: 0 auto; display: flex; flex-direction: column; gap: 1rem; }
.hc10-faq-item { border: 1px solid var(--line); border-radius: 16px; overflow: hidden; background: var(--paper); transition: all 0.3s ease; }
.hc10-faq-item[open], .hc10-faq-item.active { border-color: var(--primary); background: #ffffff; box-shadow: var(--card-shadow); }

.hc10-faq-question {
  padding: 1.35rem 1.75rem;
  font-size: 1.08rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--ink);
  list-style: none;
  user-select: none;
}
.hc10-faq-question::-webkit-details-marker,
.hc10-faq-question::marker { display: none; width: 0; height: 0; }

.faq-icon-arrow {
  font-size: 1.6rem;
  line-height: 1;
  transition: transform 0.3s ease;
  color: var(--primary);
  display: inline-block;
}
.hc10-faq-item[open] .faq-icon-arrow, .hc10-faq-item.active .faq-icon-arrow {
  transform: rotate(90deg);
}

.hc10-faq-answer {
  padding: 0.5rem 1.75rem 1.35rem;
  color: var(--muted);
  font-size: 0.95rem;
  line-height: 1.75;
}
.hc10-faq-item.active .hc10-faq-answer { display: block; }

/* --- Booking & Consultation --- */
.hc10-appointment { padding: 6.5rem 0; background: var(--paper); border-top: 1px solid var(--line); }
.hc10-appointment-card { background: #ffffff; border-radius: 28px; border: 1px solid var(--line); padding: 4rem; display: grid; grid-template-columns: 0.85fr 1.15fr; gap: 4.5rem; box-shadow: var(--card-shadow); }
.hc10-appointment-info h2 { font-size: 2.7rem; margin-bottom: 1rem; }
.hc10-appointment-info p { color: var(--muted); margin-bottom: 2.25rem; font-size: 1.02rem; }
.hc10-info-list { display: flex; flex-direction: column; gap: 1.5rem; }
.hc10-info-row { display: flex; align-items: center; gap: 1.1rem; }
.hc10-info-row .ic { width: 48px; height: 48px; border-radius: 14px; background: var(--paper-2); color: var(--primary); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.hc10-info-row h5 { font-size: 0.95rem; font-weight: 800; font-family: 'Plus Jakarta Sans', sans-serif; }
.hc10-info-row p { font-size: 0.88rem; color: var(--muted); margin: 0; }

.hc10-booking-form { display: grid; grid-template-columns: 1fr 1fr; gap: 1.35rem; }
.hc10-form-group { display: flex; flex-direction: column; gap: 0.45rem; }
.hc10-form-group.full { grid-column: span 2; }
.hc10-form-group label { font-size: 0.82rem; font-weight: 800; color: var(--ink); }
.hc10-form-group input, .hc10-form-group select, .hc10-form-group textarea { padding: 0.9rem 1.1rem; border-radius: 12px; border: 1px solid var(--line); font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.92rem; outline: none; transition: 0.2s; background: var(--paper); }
.hc10-form-group input:focus, .hc10-form-group select:focus, .hc10-form-group textarea:focus { border-color: var(--primary); background: #ffffff; }

/* --- Footer --- */
.hc10-footer { background: var(--ink); color: #ffffff; padding-top: 5.5rem; }
.hc10-footer-grid { display: grid; grid-template-columns: 1.4fr 0.8fr 0.8fr 1fr; gap: 4rem; padding-bottom: 4rem; border-bottom: 1px solid rgba(255,255,255,0.1); }
.hc10-footer-brand p { color: rgba(255,255,255,0.65); font-size: 0.92rem; margin-top: 1.25rem; max-width: 340px; line-height: 1.7; }
.hc10-footer-col h4 { font-size: 0.95rem; font-weight: 800; font-family: 'Plus Jakarta Sans', sans-serif; color: #ffffff; margin-bottom: 1.35rem; text-transform: uppercase; letter-spacing: 1.5px; }
.hc10-footer-col ul { list-style: none; display: flex; flex-direction: column; gap: 0.85rem; }
.hc10-footer-col a { color: rgba(255,255,255,0.65); font-size: 0.92rem; }
.hc10-footer-col a:hover { color: var(--primary); }
.hc10-footer-bottom { padding: 2rem 0; text-align: center; color: rgba(255,255,255,0.45); font-size: 0.88rem; }

.hc10-reveal { opacity: 1 !important; transform: none !important; }

/* --- Mobile Media Queries --- */
@media (max-width: 1024px) {
  .hc10-services-grid { grid-template-columns: repeat(2, 1fr); }
  .hc10-doctors-grid { grid-template-columns: repeat(2, 1fr); }
  .hc10-timeline-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 992px) {
  .hc10-hero-grid, .hc10-legacy-grid, .hc10-appointment-card { grid-template-columns: 1fr; gap: 3rem; }
  .hc10-hero-copy { text-align: center; }
  .hc10-hero-copy p { margin: 0 auto 2rem; }
  .hc10-hero-actions { justify-content: center; }
  .hc10-trust-strip { justify-content: center; }
  .hc10-hero-frame img { height: 400px; }
  .hc10-milestones-grid { grid-template-columns: repeat(2, 1fr); gap: 2rem; }
  .hc10-milestone-box { border-right: none; }
  .hc10-testimonials-grid { grid-template-columns: 1fr; }
  .hc10-footer-grid { grid-template-columns: 1fr 1fr; gap: 2.5rem; }
}

@media (max-width: 768px) {
  .hc10-topbar-right { display: none; }
  .hc10-nav { display: none; }
  .hc10-hero-copy h1 { font-size: 2.4rem; }
  .hc10-legacy-copy h2, .hc10-services-head h2, .hc10-timeline-head h2, .hc10-doctors-head h2, .hc10-testimonials-head h2, .hc10-faq-head h2, .hc10-appointment-info h2 { font-size: 2.1rem; }
  .hc10-floater { position: static; margin-top: 1rem; width: 100%; justify-content: center; }
  .hc10-booking-form { grid-template-columns: 1fr; }
  .hc10-form-group.full { grid-column: span 1; }
  .hc10-appointment-card { padding: 2.25rem 1.5rem; }
}

@media (max-width: 640px) {
  .container { padding: 0 1rem; }
  .hc10-services-grid, .hc10-doctors-grid, .hc10-timeline-grid { grid-template-columns: 1fr; }
  .hc10-milestones-grid { grid-template-columns: 1fr; }
  .hc10-footer-grid { grid-template-columns: 1fr; }
  .hc10-trust-strip { grid-template-columns: 1fr; }
  .hc10-legacy-imgs img.sub-img { display: none; }
  .hc10-legacy-imgs img.main-img { width: 100%; }
}
`;

export const healthcare10Html = `
<!-- Heritage Topbar -->
<div class="hc10-topbar">
  <div class="container hc10-topbar-inner">
    <div class="hc10-heritage-badge">
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
      30 YEARS OF MEDICAL EXCELLENCE (1996 - 2026)
    </div>

    <div class="hc10-topbar-right">
      <div class="hc10-topbar-item">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
        ADDRESS_PLACEHOLDER
      </div>
      <div class="hc10-emergency-hotline">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
        Emergency: PHONE_PLACEHOLDER
      </div>
    </div>
  </div>
</div>

<!-- Header -->
<header class="hc10-header">
  <div class="container hc10-header-inner">
    <a href="javascript:void(0);" class="hc10-logo">
      LOGO_PLACEHOLDER
    </a>
    <ul class="hc10-nav">
      <li><a href="javascript:void(0);">30-Yr Journey</a></li>
      <li><a href="javascript:void(0);">Specialties</a></li>
      <li><a href="javascript:void(0);">Milestones</a></li>
      <li><a href="javascript:void(0);">Senior Doctors</a></li>
      <li><a href="javascript:void(0);">Stories</a></li>
      <li><a href="javascript:void(0);">FAQ</a></li>
    </ul>
    <a href="javascript:void(0);" class="btn btn-primary">Book Priority Visit</a>
  </div>
</header>

<!-- 30-Year Legacy Hero With Integrated Booking Form -->
<section class="hc10-hero">
  <div class="container hc10-hero-grid">
    <div class="hc10-hero-copy hc10-reveal">
      <div class="eyebrow">ESTABLISHED 1996 — 30 YEARS OF TRUST</div>
      <h1>30 Years Of <span>Uncompromised</span> Healthcare Excellence.</h1>
      <p>For three decades, our institute has pioneered life-saving medical care, combining world-renowned specialists with cutting-edge technology for over 100,000+ satisfied families.</p>

      <div class="hc10-hero-badges-list">
        <div class="hc10-hero-badge-pill">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
          Instant Priority Confirmation
        </div>
        <div class="hc10-hero-badge-pill">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
          24/7 Emergency Support Desk
        </div>
        <div class="hc10-hero-badge-pill">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
          60+ Senior Department Chairs
        </div>
      </div>

      <div class="hc10-trust-strip">
        <div class="hc10-trust-item">
          <h4>30+ Yrs</h4>
          <p>Clinical Legacy</p>
        </div>
        <div class="hc10-trust-item">
          <h4>100k+</h4>
          <p>Healed Patients</p>
        </div>
        <div class="hc10-trust-item">
          <h4>99.6%</h4>
          <p>Clinical Success</p>
        </div>
      </div>
    </div>

    <!-- Hero Embedded Booking Form Card -->
    <div class="hc10-hero-form-card hc10-reveal" id="appointment">
      <div class="hc10-hero-form-head">
        <span class="hc10-form-badge">⚡ INSTANT SLOT BOOKING</span>
        <h3>Book Priority Consultation</h3>
        <p>Get a direct 1-on-1 session with senior clinical chairs.</p>
      </div>

      <form class="hc10-hero-form lead-capture-form">
        <div class="hc10-form-field">
          <label>Full Name *</label>
          <input type="text" name="name" placeholder="John Doe" required>
        </div>

        <div class="hc10-form-row2">
          <div class="hc10-form-field">
            <label>Phone Number *</label>
            <input type="tel" name="phone" placeholder="(555) 000-0000" required>
          </div>
          <div class="hc10-form-field">
            <label>Email Address *</label>
            <input type="email" name="email" placeholder="john@example.com" required>
          </div>
        </div>

        <div class="hc10-form-row2">
          <div class="hc10-form-field">
            <label>Specialty Department *</label>
            <select name="department" required>
              <option value="">Choose Department</option>
              <option value="cardiology">Interventional Cardiology</option>
              <option value="neurology">Neurosurgery & Spine</option>
              <option value="orthopedics">Orthopedics & Joint Care</option>
              <option value="oncology">Precision Oncology</option>
              <option value="pediatrics">Pediatric Care</option>
            </select>
          </div>
          <div class="hc10-form-field">
            <label>Preferred Date *</label>
            <input type="date" name="date" required>
          </div>
        </div>

        <div class="hc10-form-field">
          <label>Brief Medical Note / Symptoms</label>
          <textarea name="notes" rows="2" placeholder="Briefly describe symptoms or reason for visit..."></textarea>
        </div>

        <button type="submit" class="btn btn-primary" style="width: 100%; justify-content: center; padding: 1.05rem; font-size: 0.95rem; font-weight: 800;">
          Confirm Priority Appointment Request &rarr;
        </button>

        <div class="hc10-form-trust-note">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
          100% Confidential & Secure • Zero Waiting Time
        </div>
      </form>
    </div>
  </div>
</section>

<!-- Milestones Banner -->
<section class="hc10-milestones">
  <div class="container">
    <div class="hc10-milestones-grid">
      <div class="hc10-milestone-box">
        <h3>30+</h3>
        <p>Years of Medical Excellence</p>
      </div>
      <div class="hc10-milestone-box">
        <h3>100k+</h3>
        <p>Successful Surgeries & Treatments</p>
      </div>
      <div class="hc10-milestone-box">
        <h3>60+</h3>
        <p>Senior Medical Specialists</p>
      </div>
      <div class="hc10-milestone-box">
        <h3>25+</h3>
        <p>National Clinical Awards</p>
      </div>
    </div>
  </div>
</section>

<!-- Founder's Legacy & Story -->
<section class="hc10-legacy" id="heritage">
  <div class="container hc10-legacy-grid">
    <div class="hc10-legacy-imgs hc10-reveal">
      <img src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=900&q=80" class="main-img" alt="30 Years Clinic Hospital">
      <img src="https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=600&q=80" class="sub-img" alt="Founder Doctor Consultation">
    </div>

    <div class="hc10-legacy-copy hc10-reveal">
      <div class="eyebrow">OUR 30-YEAR HERITAGE (1996 - 2026)</div>
      <h2>Pioneering Healing & Patient Trust For Three Decades.</h2>
      <p>Founded in 1996 by Chief Medical Director Dr. Arthur Pendelton, our institute began with a single mission: to treat every patient with the dignity, precision, and time they deserve.</p>

      <div class="hc10-founder-quote">
        <p>"Medicine is not merely a science of curing; it is the sacred art of caring for human lives with relentless dedication."</p>
        <div class="hc10-founder-name">Dr. Arthur Pendelton — Founder & Chief Medical Officer (30+ Yrs Exp)</div>
      </div>

      <a href="javascript:void(0);" class="btn btn-primary">Book Consultation With Senior Specialist</a>
    </div>
  </div>
</section>

<!-- 30-Year Timeline -->
<section class="hc10-timeline-sec" id="timeline">
  <div class="container">
    <div class="hc10-timeline-head hc10-reveal">
      <div class="eyebrow">THE 30-YEAR MILESTONE JOURNEY</div>
      <h2>Three Decades Of Medical Milestones</h2>
    </div>

    <div class="hc10-timeline-grid">
      <div class="hc10-timeline-card hc10-reveal">
        <span class="hc10-year-badge">1996</span>
        <h4>Foundation Era</h4>
        <p>Established as a premier private cardiology and general health practice with 10 senior physicians.</p>
      </div>

      <div class="hc10-timeline-card hc10-reveal">
        <span class="hc10-year-badge">2006</span>
        <h4>Expansion & Trauma Center</h4>
        <p>Expanded into a 150-bed multi-specialty hospital with 24/7 emergency response unit.</p>
      </div>

      <div class="hc10-timeline-card hc10-reveal">
        <span class="hc10-year-badge">2016</span>
        <h4>Robotic Surgery & AI Labs</h4>
        <p>Pioneered AI-assisted diagnostic imaging & minimally invasive robotic surgical suites.</p>
      </div>

      <div class="hc10-timeline-card hc10-reveal">
        <span class="hc10-year-badge">2026</span>
        <h4>30 Years Excellence</h4>
        <p>Celebrating 30 years with 100,000+ healed patients and global JCI accreditation.</p>
      </div>
    </div>
  </div>
</section>

<!-- Specialties -->
<section class="hc10-services" id="services">
  <div class="container">
    <div class="hc10-services-head hc10-reveal">
      <div class="eyebrow">SERVICES_PLACEHOLDER</div>
      <h2>30 Years Of Specialized Excellence</h2>
      <p>World-class clinical divisions led by senior department chairs with over 20+ years of individual expertise.</p>
    </div>

    <div class="hc10-services-grid">
      <div class="hc10-service-card hc10-reveal">
        <span class="hc10-service-tag">30-Year Pioneer Dept</span>
        <div class="hc10-service-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
        </div>
        <h3>Interventional Cardiology</h3>
        <p>Advanced cardiac catheterization, angioplasty, heart failure management, and preventive ECG audits.</p>
      </div>

      <div class="hc10-service-card hc10-reveal">
        <span class="hc10-service-tag">Robotic Surgery</span>
        <div class="hc10-service-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 01-2 2h-0a2 2 0 01-2-2v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
        </div>
        <h3>Neurosurgery & Spine</h3>
        <p>Expert diagnostic care & minimally invasive spinal reconstruction for complex neurological disorders.</p>
      </div>

      <div class="hc10-service-card hc10-reveal">
        <span class="hc10-service-tag">10,000+ Joint Surgeries</span>
        <div class="hc10-service-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
        </div>
        <h3>Orthopedics & Joint Care</h3>
        <p>Total knee & hip replacement, sports medicine rehabilitation, and bone trauma reconstruction.</p>
      </div>

      <div class="hc10-service-card hc10-reveal">
        <span class="hc10-service-tag">Precision Oncology</span>
        <div class="hc10-service-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L5.59 15.11a2 2 0 00-1.022.547l-1.018 1.019a2 2 0 00.586 3.414l3.195 1.065a12.04 12.04 0 006.538 0l3.195-1.065a2 2 0 00.586-3.414l-1.018-1.019z"/></svg>
        </div>
        <h3>Oncology & Targeted Care</h3>
        <p>Comprehensive cancer screenings, targeted immunotherapy, and multidisciplinary tumor board care.</p>
      </div>

      <div class="hc10-service-card hc10-reveal">
        <span class="hc10-service-tag">Gentle Family Care</span>
        <div class="hc10-service-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
        </div>
        <h3>Pediatric Medicine</h3>
        <p>Compassionate healthcare for infants, toddlers, and teens with dedicated pediatric ICU facilities.</p>
      </div>

      <div class="hc10-service-card hc10-reveal">
        <span class="hc10-service-tag">24/7 Emergency</span>
        <div class="hc10-service-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        </div>
        <h3>Critical Trauma Center</h3>
        <p>Immediate 24-hour trauma response with state-of-the-art emergency ICU and rapid ambulance fleet.</p>
      </div>
    </div>
  </div>
</section>

<!-- Senior Doctors -->
<section class="hc10-doctors" id="doctors">
  <div class="container">
    <div class="hc10-doctors-head hc10-reveal">
      <div class="eyebrow">SENIOR CLINICAL CHAIRS</div>
      <h2>Meet Our Senior Medical Directors</h2>
    </div>

    <div class="hc10-doctors-grid">
      <div class="hc10-doctor-card hc10-reveal">
        <div class="hc10-doctor-img">
          <img src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=600&q=80" alt="Dr. Arthur Pendelton">
        </div>
        <div class="hc10-doctor-info">
          <h4>Dr. Arthur Pendelton</h4>
          <span class="spec">Founder & Chief Cardiologist</span>
          <span class="exp">30+ Years Experience</span>
          <a href="javascript:void(0);" class="btn btn-secondary" style="width:100%; font-size:0.82rem; padding:0.6rem 1rem;">Book Consultation</a>
        </div>
      </div>

      <div class="hc10-doctor-card hc10-reveal">
        <div class="hc10-doctor-img">
          <img src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80" alt="Dr. Evelyn Vance">
        </div>
        <div class="hc10-doctor-info">
          <h4>Dr. Evelyn Vance</h4>
          <span class="spec">Head of Neurosurgery</span>
          <span class="exp">24+ Years Experience</span>
          <a href="javascript:void(0);" class="btn btn-secondary" style="width:100%; font-size:0.82rem; padding:0.6rem 1rem;">Book Consultation</a>
        </div>
      </div>

      <div class="hc10-doctor-card hc10-reveal">
        <div class="hc10-doctor-img">
          <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80" alt="Dr. Marcus Sterling">
        </div>
        <div class="hc10-doctor-info">
          <h4>Dr. Marcus Sterling</h4>
          <span class="spec">Chair of Orthopedics</span>
          <span class="exp">22+ Years Experience</span>
          <a href="javascript:void(0);" class="btn btn-secondary" style="width:100%; font-size:0.82rem; padding:0.6rem 1rem;">Book Consultation</a>
        </div>
      </div>

      <div class="hc10-doctor-card hc10-reveal">
        <div class="hc10-doctor-img">
          <img src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=600&q=80" alt="Dr. Sophia Rodriguez">
        </div>
        <div class="hc10-doctor-info">
          <h4>Dr. Sophia Rodriguez</h4>
          <span class="spec">Pediatric Department Chair</span>
          <span class="exp">20+ Years Experience</span>
          <a href="javascript:void(0);" class="btn btn-secondary" style="width:100%; font-size:0.82rem; padding:0.6rem 1rem;">Book Consultation</a>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- 30-Year Testimonials -->
<section class="hc10-testimonials" id="testimonials">
  <div class="container">
    <div class="hc10-testimonials-head hc10-reveal">
      <div class="eyebrow">GENERATIONS OF TRUST</div>
      <h2>Patient Stories Across 30 Years</h2>
    </div>

    <div class="hc10-testimonials-grid">
      <div class="hc10-testi-card hc10-reveal">
        <div class="hc10-testi-stars">★★★★★</div>
        <p class="hc10-testi-quote">"Three generations of our family have trusted Dr. Pendelton's team since 1998. Their unwavering commitment and personal care are unmatched."</p>
        <div class="hc10-testi-user">
          <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80" alt="Patient">
          <div>
            <h5>Eleanor Sterling</h5>
            <span>Patient Family Since 1998</span>
          </div>
        </div>
      </div>

      <div class="hc10-testi-card hc10-reveal">
        <div class="hc10-testi-stars">★★★★★</div>
        <p class="hc10-testi-quote">"After my complex heart surgery in 2012, the recovery support was beyond exceptional. They treat you like family, not just a chart number."</p>
        <div class="hc10-testi-user">
          <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" alt="Patient">
          <div>
            <h5>Richard Miller</h5>
            <span>Cardiology Patient (14 Yrs)</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- FAQ Accordion -->
<section class="hc10-faq" id="faq">
  <div class="container">
    <div class="hc10-faq-head hc10-reveal">
      <div class="eyebrow">FREQUENTLY ASKED QUESTIONS</div>
      <h2>Patient Inquiries & Information</h2>
    </div>

    <div class="hc10-faq-list">
      <details class="hc10-faq-item" open>
        <summary class="hc10-faq-question">
          <span>How do I request a priority consultation with a senior department chair?</span>
          <span class="faq-icon-arrow">&rsaquo;</span>
        </summary>
        <div class="hc10-faq-answer">
          You can book directly using the 30-Year Priority Consultation form in our Hero section, or call our senior concierge desk at PHONE_PLACEHOLDER for immediate 1-on-1 assistance.
        </div>
      </details>

      <details class="hc10-faq-item">
        <summary class="hc10-faq-question">
          <span>What health insurance providers are accepted?</span>
          <span class="faq-icon-arrow">&rsaquo;</span>
        </summary>
        <div class="hc10-faq-answer">
          We accept all major domestic and international health insurance policies. Our dedicated insurance concierge unit coordinates direct cashless billing for your convenience.
        </div>
      </details>

      <details class="hc10-faq-item">
        <summary class="hc10-faq-question">
          <span>Are emergency medical admissions available 24/7?</span>
          <span class="faq-icon-arrow">&rsaquo;</span>
        </summary>
        <div class="hc10-faq-answer">
          Yes! Our 24/7 Emergency Trauma & Critical Care Center operates around the clock with immediate surgical team availability.
        </div>
      </details>

      <details class="hc10-faq-item">
        <summary class="hc10-faq-question">
          <span>What documents should I bring for my first consultation?</span>
          <span class="faq-icon-arrow">&rsaquo;</span>
        </summary>
        <div class="hc10-faq-answer">
          Please bring a valid photo ID, your insurance card, and any recent lab reports or medical history summaries.
        </div>
      </details>
    </div>
  </div>
</section>

<!-- 24/7 Hospital Desk & Location Center -->
<section class="hc10-appointment" id="contact">
  <div class="container">
    <div class="hc10-appointment-card hc10-reveal" style="grid-template-columns: 1fr 1fr; align-items: center;">
      <div class="hc10-appointment-info">
        <div class="eyebrow">24/7 CONCIERGE & HOSPITAL DESK</div>
        <h2>Visit Our World-Class Medical Campus</h2>
        <p>Our dedicated medical concierges are available around the clock for emergency admissions, international patient transfers, and appointment inquiries.</p>

        <div class="hc10-info-list">
          <div class="hc10-info-row">
            <div class="ic">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
            </div>
            <div>
              <h5>24/7 Emergency Response Line</h5>
              <p>PHONE_PLACEHOLDER</p>
            </div>
          </div>

          <div class="hc10-info-row">
            <div class="ic">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
            </div>
            <div>
              <h5>Official Email Desk</h5>
              <p>EMAIL_PLACEHOLDER</p>
            </div>
          </div>

          <div class="hc10-info-row">
            <div class="ic">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            </div>
            <div>
              <h5>Main Campus Address</h5>
              <p>ADDRESS_PLACEHOLDER</p>
            </div>
          </div>
        </div>
      </div>

      <div class="hc10-contact-map-card" style="border-radius: 20px; overflow: hidden; height: 380px; position: relative;">
        <img src="https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=800&q=80" alt="Hospital Campus Exterior" style="width:100%; height:100%; object-fit:cover;">
        <div style="position: absolute; bottom: 20px; left: 20px; right: 20px; background: rgba(11, 19, 41, 0.9); backdrop-filter: blur(12px); border-radius: 14px; padding: 1rem 1.25rem; color: #fff;">
          <h5 style="font-size: 0.95rem; font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; margin-bottom: 0.2rem; color:#fff;">Main Medical Tower & ICU</h5>
          <p style="font-size: 0.8rem; color: rgba(255,255,255,0.7); margin:0;">Valet parking & emergency ambulance entrance available 24/7</p>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Footer -->
<footer class="hc10-footer">
  <div class="container">
    <div class="hc10-footer-grid">
      <div class="hc10-footer-brand">
        <div class="hc10-logo" style="color: #ffffff;">
          LOGO_PLACEHOLDER
        </div>
        <p>Celebrating 30 years of medical excellence, groundbreaking innovation, and compassionate patient care since 1996.</p>
      </div>

      <div class="hc10-footer-col">
        <h4>Quick Navigation</h4>
        <ul>
          <li><a href="javascript:void(0);">Our 30-Yr Journey</a></li>
          <li><a href="javascript:void(0);">Specialties</a></li>
          <li><a href="javascript:void(0);">Milestones</a></li>
          <li><a href="javascript:void(0);">Senior Directors</a></li>
          <li><a href="javascript:void(0);">Book Consultation</a></li>
        </ul>
      </div>

      <div class="hc10-footer-col">
        <h4>Specialties</h4>
        <ul>
          <li><a href="javascript:void(0);">Cardiology</a></li>
          <li><a href="javascript:void(0);">Neurosurgery</a></li>
          <li><a href="javascript:void(0);">Orthopedics</a></li>
          <li><a href="javascript:void(0);">Oncology</a></li>
          <li><a href="javascript:void(0);">Emergency Trauma</a></li>
        </ul>
      </div>

      <div class="hc10-footer-col">
        <h4>Contact Desk</h4>
        <ul>
          <li>Phone: PHONE_PLACEHOLDER</li>
          <li>Email: EMAIL_PLACEHOLDER</li>
          <li>Address: ADDRESS_PLACEHOLDER</li>
          <li>Hours: 24/7 Emergency Care</li>
        </ul>
      </div>
    </div>

    <div class="hc10-footer-bottom">
      &copy; 1996 - 2026 PROJECT_NAME_PLACEHOLDER. Celebrating 30 Years of Medical Excellence & Patient Trust.
    </div>
  </div>
</footer>

<script id="core-interactions">
  (function() {
    var isInEditor = !!document.querySelector('[data-gjs-type]') || document.body.classList.contains('gjs-dashed');
    if (!isInEditor) {
      document.body.classList.add('js-enabled');
      var revealEls = document.querySelectorAll('.hc10-reveal');
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
                input.style.borderBottomColor = '#22c55e';
                if (input.nextElementSibling && input.nextElementSibling.classList.contains('val-error')) input.nextElementSibling.style.display = 'none';
              } else {
                input.style.borderBottomColor = '#ef4444';
                if (input.nextElementSibling && input.nextElementSibling.classList.contains('val-error')) input.nextElementSibling.style.display = 'block';
              }
            });
          }
          if (!input.value.trim() && input.hasAttribute('required')) {
            isValid = false;
            input.style.borderBottomColor = '#ef4444';
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
            e.target.innerHTML = '<div style="padding: 20px; text-align: center; border: 1px dashed rgba(0,0,0,0.15); border-radius: 12px;"><h3 style="margin: 0 0 10px 0;">Thank You!</h3><p style="margin: 0; opacity: 0.7;">Your priority consultation request has been submitted successfully.</p></div>';
          }, 1000);
        }
      }
    }, true);
  })();
</script>
`;