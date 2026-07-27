export const law08Styles = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,500&family=Inter:wght@400;500;600;700;800&display=swap');

:root {
  --primary: PRIMARY_COLOR_PLACEHOLDER;
  --secondary: SECONDARY_COLOR_PLACEHOLDER;
  --primary-rgb: PRIMARY_RGB_PLACEHOLDER;
  --secondary-rgb: SECONDARY_RGB_PLACEHOLDER;
  --ink: #131313;
  --paper: #f7f5f1;
  --paper-2: #efece5;
  --muted: #7a766d;
  --line: #e4e0d6;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

body { font-family: 'Inter', sans-serif; color: var(--ink); background: var(--paper); line-height: 1.65; overflow-x: hidden; }
h1, h2, h3, h4, h5, h6 { font-family: 'Fraunces', serif; font-weight: 600; line-height: 1.1; color: var(--ink); }
.container { max-width: 1220px; margin: 0 auto; padding: 0 1.5rem; position: relative; z-index: 5; }
img { max-width: 100%; display: block; }
a { text-decoration: none; color: inherit; transition: 0.3s; }
.eyebrow { font-family: 'Inter', sans-serif; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: var(--primary); display: flex; align-items: center; gap: 0.6rem; margin-bottom: 1.25rem; }
.eyebrow::before { content: ''; width: 24px; height: 1px; background: var(--primary); }
.italic { font-style: italic; font-weight: 500; color: var(--primary); }

.btn { display: inline-flex; align-items: center; gap: 0.6rem; padding: 1rem 2rem; border-radius: 2px; font-weight: 600; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px; cursor: pointer; border: 1px solid transparent; transition: 0.3s; }
.btn-solid { background: var(--ink); color: #fff; }
.btn-solid:hover { background: var(--primary); }
.btn-line { border-color: var(--ink); color: var(--ink); }
.btn-line:hover { background: var(--ink); color: #fff; }
.btn-cream { background: var(--paper); color: var(--ink); }
.btn-cream:hover { background: var(--primary); color: #fff; }

/* Header - wordmark only, no nav menu */
.lf3-header { padding: 1.75rem 0; background: var(--paper); border-bottom: 1px solid var(--line); position: sticky; top: 0; z-index: 60; }
.lf3-header-inner { display: flex; justify-content: space-between; align-items: center; }
.lf3-mark { font-family: 'Fraunces', serif; font-size: 1.5rem; letter-spacing: -0.5px; display: flex; align-items: center; gap: 12px; }
.lf3-mark-index { font-family: 'Inter', sans-serif; font-size: 0.65rem; background: var(--ink); color: #fff; width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
.lf3-header-meta { font-size: 0.75rem; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; display: flex; align-items: center; gap: 2rem; }

/* Hero - oversized editorial type with offset frame */
.lf3-hero { padding: 5rem 0 0; background: var(--paper); position: relative; }
.lf3-hero-top { display: grid; grid-template-columns: 1.4fr 0.6fr; gap: 3rem; align-items: end; padding-bottom: 3rem; border-bottom: 1px solid var(--line); }
.lf3-hero-top h1 { font-size: 4.4rem; letter-spacing: -1px; }
.lf3-hero-top p { color: var(--muted); font-size: 1.05rem; max-width: 340px; margin-bottom: 1.75rem; }
.lf3-hero-frame { position: relative; }
.lf3-hero-frame img { width: 100%; height: 280px; object-fit: cover; filter: grayscale(15%); }
.lf3-hero-index { position: absolute; top: -14px; left: -14px; background: var(--primary); color: #fff; font-family: 'Fraunces', serif; font-size: 1.3rem; font-style: italic; padding: 0.5rem 1rem; }
.lf3-hero-bottom { display: grid; grid-template-columns: repeat(4, 1fr); }
.lf3-hero-stat { padding: 2rem 2rem 2rem 0; border-right: 1px solid var(--line); }
.lf3-hero-stat:last-child { border-right: none; }
.lf3-hero-stat h3 { font-family: 'Inter', sans-serif; font-weight: 800; font-size: 2.2rem; margin-bottom: 0.3rem; }
.lf3-hero-stat p { color: var(--muted); font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px; }

/* Ticker */
.lf3-ticker { background: var(--ink); padding: 1rem 0; overflow: hidden; }
.lf3-ticker-track { display: flex; width: max-content; animation: lf3-scroll 26s linear infinite; }
.lf3-ticker-track span { color: rgba(255,255,255,0.75); font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1.5px; padding: 0 2rem; white-space: nowrap; font-weight: 600; }
.lf3-ticker-track span.dot { color: var(--primary); }
@keyframes lf3-scroll { to { transform: translateX(-50%); } }

/* About - big watermark number */
.lf3-about { padding: 8rem 0; background: var(--paper); position: relative; overflow: hidden; }
.lf3-about-watermark { position: absolute; top: -4rem; right: -2rem; font-family: 'Fraunces', serif; font-size: 16rem; color: rgba(0,0,0,0.03); font-weight: 600; z-index: 0; user-select: none; }
.lf3-about-grid { display: grid; grid-template-columns: 0.9fr 1.1fr; gap: 5rem; position: relative; z-index: 2; }
.lf3-about-grid h2 { font-size: 2.6rem; margin-bottom: 1.5rem; }
.lf3-about-list { display: flex; flex-direction: column; gap: 1.75rem; margin-top: 2.5rem; }
.lf3-about-row { display: flex; gap: 1.25rem; padding-bottom: 1.75rem; border-bottom: 1px solid var(--line); }
.lf3-about-row .num { font-family: 'Fraunces', serif; font-style: italic; color: var(--primary); font-size: 1.4rem; flex-shrink: 0; }
.lf3-about-row h4 { font-family: 'Inter', sans-serif; font-weight: 700; font-size: 1rem; margin-bottom: 0.35rem; }
.lf3-about-row p { color: var(--muted); font-size: 0.9rem; }
.lf3-about-copy p { color: var(--muted); font-size: 1.02rem; margin-bottom: 1.5rem; }

/* Services - alternating numbered rows */
.lf3-services { padding: 8rem 0; background: var(--ink); color: #fff; }
.lf3-services-head { display: flex; justify-content: space-between; align-items: flex-end; gap: 2rem; margin-bottom: 4rem; flex-wrap: wrap; }
.lf3-services-head h2 { color: #fff; font-size: 2.8rem; max-width: 560px; }
.lf3-services-head p { color: rgba(255,255,255,0.5); max-width: 300px; font-size: 0.92rem; }
.lf3-service-row { display: grid; grid-template-columns: 100px 1fr 1fr 40px; gap: 2rem; align-items: center; padding: 2.25rem 0; border-top: 1px solid rgba(255,255,255,0.12); transition: 0.3s; cursor: pointer; }
.lf3-service-row:last-child { border-bottom: 1px solid rgba(255,255,255,0.12); }
.lf3-service-row:hover { background: rgba(255,255,255,0.03); padding-left: 1rem; }
.lf3-service-row .num { font-family: 'Fraunces', serif; font-style: italic; color: rgba(255,255,255,0.35); font-size: 1.1rem; }
.lf3-service-row h3 { color: #fff; font-size: 1.6rem; }
.lf3-service-row p { color: rgba(255,255,255,0.5); font-size: 0.88rem; }
.lf3-service-row .arrow { width: 40px; height: 40px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.25); display: flex; align-items: center; justify-content: center; color: #fff; transition: 0.3s; }
.lf3-service-row:hover .arrow { background: var(--primary); border-color: var(--primary); transform: rotate(45deg); }

/* Bento practice grid */
.lf3-bento { padding: 8rem 0; background: var(--paper); }
.lf3-bento-head { text-align: center; max-width: 640px; margin: 0 auto 4rem; }
.lf3-bento-head h2 { font-size: 2.6rem; }
.lf3-bento-grid { display: grid; grid-template-columns: repeat(4, 1fr); grid-auto-rows: 180px; gap: 1.25rem; }
.lf3-bento-item { position: relative; border-radius: 4px; overflow: hidden; background: var(--paper-2); padding: 1.75rem; display: flex; flex-direction: column; justify-content: flex-end; }
.lf3-bento-item.wide { grid-column: span 2; }
.lf3-bento-item.tall { grid-row: span 2; }
.lf3-bento-item.dark { background: var(--ink); color: #fff; }
.lf3-bento-item img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0.9; }
.lf3-bento-item .overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.65), transparent 60%); }
.lf3-bento-item h4 { position: relative; z-index: 2; font-size: 1.2rem; color: #fff; }
.lf3-bento-item.plain h4 { color: var(--ink); }
.lf3-bento-item p { position: relative; z-index: 2; font-size: 0.8rem; color: rgba(255,255,255,0.7); margin-top: 0.3rem; }
.lf3-bento-item.plain p { color: var(--muted); }

/* Timeline process */
.lf3-timeline { padding: 8rem 0; background: var(--paper-2); }
.lf3-timeline-head { max-width: 640px; margin-bottom: 5rem; }
.lf3-timeline-head h2 { font-size: 2.6rem; }
.lf3-timeline-wrap { position: relative; padding-left: 3rem; }
.lf3-timeline-wrap::before { content: ''; position: absolute; left: 8px; top: 0; bottom: 0; width: 1px; background: var(--line); }
.lf3-timeline-step { position: relative; padding-bottom: 4rem; }
.lf3-timeline-step:last-child { padding-bottom: 0; }
.lf3-timeline-dot { position: absolute; left: -3rem; top: 0.2rem; width: 17px; height: 17px; border-radius: 50%; background: var(--paper-2); border: 2px solid var(--primary); }
.lf3-timeline-step h3 { font-size: 1.7rem; margin-bottom: 0.6rem; }
.lf3-timeline-step p { color: var(--muted); max-width: 560px; font-size: 0.95rem; }
.lf3-timeline-step span.tag { font-family: 'Inter', sans-serif; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px; color: var(--primary); font-weight: 700; }

/* Testimonial - big split slab */
.lf3-testimonial { padding: 0; }
.lf3-testimonial-inner { display: grid; grid-template-columns: 0.9fr 1.1fr; }
.lf3-testimonial-photo { background-size: cover; background-position: center; min-height: 460px; background-image: url('/assets/templates/LawFirm/templates08/image1.jpg'); }
.lf3-testimonial-copy { background: var(--primary); color: #fff; padding: 5rem 4rem; display: flex; flex-direction: column; justify-content: center; }
.lf3-testimonial-copy .qmark { font-family: 'Fraunces', serif; font-style: italic; font-size: 4rem; opacity: 0.5; margin-bottom: 1rem; }
.lf3-testimonial-copy p.quote { font-size: 1.6rem; font-family: 'Fraunces', serif; margin-bottom: 2rem; line-height: 1.35; }
.lf3-testimonial-person { display: flex; align-items: center; gap: 1rem; }
.lf3-testimonial-person img { width: 50px; height: 50px; border-radius: 50%; object-fit: cover; }
.lf3-testimonial-person span { display: block; font-weight: 700; font-size: 0.95rem; }
.lf3-testimonial-person small { opacity: 0.75; font-size: 0.8rem; }

/* Case studies - editorial magazine grid */
.lf3-cases { padding: 8rem 0; background: var(--paper); }
.lf3-cases-head { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 4rem; gap: 2rem; flex-wrap: wrap; }
.lf3-cases-head h2 { font-size: 2.6rem; max-width: 520px; }
.lf3-cases-grid { display: grid; grid-template-columns: 1.3fr 1fr; gap: 2rem; }
.lf3-case-feature { position: relative; border-radius: 4px; overflow: hidden; min-height: 480px; }
.lf3-case-feature img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.lf3-case-feature .overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.75), transparent 55%); }
.lf3-case-feature-info { position: absolute; left: 0; bottom: 0; padding: 2.5rem; color: #fff; z-index: 2; }
.lf3-case-feature-info span.tag { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px; color: var(--primary); font-weight: 700; }
.lf3-case-feature-info h3 { color: #fff; font-size: 1.9rem; margin-top: 0.6rem; }
.lf3-cases-side { display: flex; flex-direction: column; gap: 2rem; }
.lf3-case-mini { display: flex; gap: 1.25rem; align-items: center; padding-bottom: 2rem; border-bottom: 1px solid var(--line); }
.lf3-case-mini:last-child { border-bottom: none; padding-bottom: 0; }
.lf3-case-mini img { width: 90px; height: 90px; object-fit: cover; border-radius: 4px; flex-shrink: 0; }
.lf3-case-mini span.tag { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 1px; color: var(--primary); font-weight: 700; }
.lf3-case-mini h4 { font-size: 1.15rem; margin-top: 0.3rem; }

/* Team - staggered strip */
.lf3-team { padding: 8rem 0; background: var(--paper-2); }
.lf3-team-head { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 4rem; gap: 2rem; flex-wrap: wrap; }
.lf3-team-head h2 { font-size: 2.6rem; max-width: 520px; }
.lf3-team-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; }
.lf3-team-card { background: var(--paper); border: 1px solid var(--line); }
.lf3-team-card:nth-child(2), .lf3-team-card:nth-child(4) { margin-top: 2.5rem; }
.lf3-team-card img { width: 100%; height: 240px; object-fit: cover; filter: grayscale(30%); }
.lf3-team-card:hover img { filter: grayscale(0%); }
.lf3-team-card-info { padding: 1.5rem; }
.lf3-team-card-info h4 { font-size: 1.2rem; }
.lf3-team-card-info p { color: var(--muted); font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 0.3rem; }

/* CTA - diagonal split banner */
.lf3-cta { position: relative; background: var(--ink); padding: 6rem 0; overflow: hidden; }
.lf3-cta::before { content: ''; position: absolute; top: 0; right: -10%; width: 60%; height: 100%; background: var(--primary); transform: skewX(-12deg); opacity: 0.9; }
.lf3-cta-inner { position: relative; z-index: 3; display: grid; grid-template-columns: 1.3fr 0.7fr; gap: 3rem; align-items: center; }
.lf3-cta-inner h2 { color: #fff; font-size: 2.6rem; max-width: 560px; }
.lf3-cta-actions { display: flex; justify-content: flex-end; }

/* FAQ - simple accordion, cream cards */
.lf3-faq { padding: 8rem 0; background: var(--paper); }
.lf3-faq-inner { display: grid; grid-template-columns: 0.7fr 1.3fr; gap: 4rem; }
.lf3-faq-inner h2 { font-size: 2.6rem; }
.lf3-faq-inner > div > p { color: var(--muted); margin-top: 1.25rem; max-width: 320px; }
.lf3-faq-item { background: var(--paper-2); border-radius: 4px; padding: 1.5rem 1.75rem; margin-bottom: 1rem; cursor: pointer; }
.lf3-faq-item-head { display: flex; justify-content: space-between; align-items: center; gap: 1rem; font-weight: 700; font-size: 1rem; font-family: 'Inter', sans-serif; list-style: none; outline: none; margin: 0; }
.lf3-faq-item-head::-webkit-details-marker { display: none; }
.lf3-faq-toggle { width: 30px; height: 30px; border-radius: 50%; background: var(--ink); color: #fff; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: 0.3s; }
.lf3-faq-body { max-height: 0; overflow: hidden; transition: max-height 0.35s ease; color: var(--muted); font-size: 0.92rem; }
details[open] .lf3-faq-body { max-height: 300px; padding-top: 1rem; }
details[open] .lf3-faq-toggle { background: var(--primary); transform: rotate(45deg); }

/* Contact - dark card with map block */
.lf3-contact { padding: 8rem 0; background: var(--paper-2); }
.lf3-contact-card { background: var(--ink); border-radius: 6px; overflow: hidden; display: grid; grid-template-columns: 0.9fr 1.1fr; }
.lf3-contact-info { padding: 4rem; color: #fff; }
.lf3-contact-info h2 { color: #fff; font-size: 2.2rem; margin-bottom: 1.25rem; }
.lf3-contact-info > p { color: rgba(255,255,255,0.55); margin-bottom: 2rem; font-size: 0.95rem; }
.lf3-info-row { display: flex; gap: 1rem; margin-bottom: 1.5rem; }
.lf3-info-row .ic { width: 40px; height: 40px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; flex-shrink: 0; color: var(--primary); }
.lf3-info-row h4 { font-family: 'Inter', sans-serif; font-size: 0.9rem; margin-bottom: 0.2rem; }
.lf3-info-row p { color: rgba(255,255,255,0.55); font-size: 0.85rem; }
.lf3-contact-form { background: var(--paper); padding: 4rem; }
.lf3-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; margin-bottom: 1.25rem; }
.lf3-input-group { display: flex; flex-direction: column; gap: 0.5rem; }
.lf3-input-group label { font-size: 0.78rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: var(--muted); }
.lf3-input-group input, .lf3-input-group textarea { padding: 0.9rem 1rem; border: 1px solid var(--line); background: #fff; border-radius: 2px; font-family: 'Inter', sans-serif; font-size: 0.92rem; outline: none; transition: 0.3s; }
.lf3-input-group input:focus, .lf3-input-group textarea:focus { border-color: var(--primary); }
.lf3-input-group textarea { resize: vertical; min-height: 110px; }
.lf3-form-full { grid-column: 1 / -1; }

/* Footer - big wordmark, overlap CTA */
.lf3-footer { background: var(--ink); color: #fff; padding-top: 6rem; position: relative; overflow: hidden; }
.lf3-footer-wordmark { font-family: 'Fraunces', serif; font-style: italic; font-size: 9rem; text-align: center; color: rgba(255,255,255,0.06); line-height: 1; margin-bottom: -2.5rem; user-select: none; }
.lf3-footer-grid { display: grid; grid-template-columns: 1.3fr 0.7fr 0.7fr 0.9fr; gap: 3rem; padding-bottom: 3.5rem; border-bottom: 1px solid rgba(255,255,255,0.1); position: relative; z-index: 2; }
.lf3-footer-col h4 { font-family: 'Inter', sans-serif; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1.5px; color: rgba(255,255,255,0.4); margin-bottom: 1.5rem; }
.lf3-footer-col ul { list-style: none; display: flex; flex-direction: column; gap: 0.9rem; }
.lf3-footer-col a { color: rgba(255,255,255,0.7); font-size: 0.92rem; }
.lf3-footer-col a:hover { color: var(--primary); }
.lf3-footer-col p { color: rgba(255,255,255,0.6); font-size: 0.9rem; }
.lf3-newsletter { display: flex; margin-top: 1.25rem; border-bottom: 1px solid rgba(255,255,255,0.3); padding-bottom: 0.5rem; }
.lf3-newsletter input { flex: 1; background: transparent; border: none; color: #fff; font-size: 0.9rem; outline: none; }
.lf3-newsletter input::placeholder { color: rgba(255,255,255,0.4); }
.lf3-newsletter button { background: transparent; border: none; color: var(--primary); cursor: pointer; display: flex; align-items: center; }
.lf3-footer-bottom { padding: 1.75rem 0; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; font-size: 0.82rem; color: rgba(255,255,255,0.45); position: relative; z-index: 2; }
.lf3-footer-links { display: flex; gap: 1.5rem; }
.lf3-footer-links a { color: rgba(255,255,255,0.45); }
.lf3-footer-links a:hover { color: var(--primary); }



@media (max-width: 992px) {
  .lf3-hero-top, .lf3-about-grid, .lf3-testimonial-inner, .lf3-cases-grid, .lf3-cta-inner, .lf3-faq-inner, .lf3-contact-card { grid-template-columns: 1fr; }
  .lf3-hero-bottom { grid-template-columns: 1fr 1fr; }
  .lf3-bento-grid { grid-template-columns: 1fr 1fr; grid-auto-rows: 160px; }
  .lf3-bento-item.wide { grid-column: span 2; }
  .lf3-service-row { grid-template-columns: 50px 1fr 30px; }
  .lf3-service-row p { display: none; }
  .lf3-team-grid { grid-template-columns: 1fr 1fr; }
  .lf3-team-card:nth-child(2), .lf3-team-card:nth-child(4) { margin-top: 0; }
  .lf3-footer-grid { grid-template-columns: 1fr 1fr; }
  .lf3-cta::before { width: 100%; right: 0; opacity: 0.94; }
  .lf3-cta-actions { justify-content: flex-start; }
}
@media (max-width: 768px) {
  .lf3-hero-top h1 { font-size: 2.6rem; }
  .lf3-about-watermark { font-size: 8rem; }
  .lf3-about-grid h2, .lf3-services-head h2, .lf3-bento-head h2, .lf3-timeline-head h2, .lf3-cases-head h2, .lf3-cta-inner h2, .lf3-faq-inner h2, .lf3-team-head h2, .lf3-contact-info h2 { font-size: 2rem; }
  .lf3-hero-bottom { grid-template-columns: 1fr 1fr; }
  .lf3-bento-grid { grid-template-columns: 1fr; }
  .lf3-bento-item.wide, .lf3-bento-item.tall { grid-column: span 1; grid-row: span 1; }
  .lf3-team-grid { grid-template-columns: 1fr; }
  .lf3-form-grid { grid-template-columns: 1fr; }
  .lf3-footer-grid { grid-template-columns: 1fr; }
  .lf3-footer-wordmark { font-size: 4rem; }
  .lf3-contact-info, .lf3-contact-form { padding: 2.5rem; }
}
`;

export const law08Html = `
<header class="lf3-header">
  <div class="container lf3-header-inner">
    <a href="#" class="lf3-mark logo">
      <span class="lf3-mark-index">§</span>
      PROJECT_NAME_PLACEHOLDER
    </a>
    <div class="lf3-header-meta">
      <span>PHONE_PLACEHOLDER</span>
      <a href="#contact" class="btn btn-solid">Consult Us</a>
    </div>
  </div>
</header>

<section class="lf3-hero">
  <div class="container">
    <div class="lf3-hero-top lf3-reveal">
      <div>
        <div class="eyebrow">Established Legal Practice</div>
        <h1>Precision counsel for <span class="italic">complex</span> matters.</h1>
        <p>A boutique legal practice built on rigorous strategy, plain-spoken advice, and outcomes that hold up under pressure.</p>
        <a href="#contact" class="btn btn-solid">Book A Consultation</a>
      </div>
      <div class="lf3-hero-frame">
        <div class="lf3-hero-index">01</div>
        <img src="/assets/templates/LawFirm/templates08/hero-lawyer.jpg" alt="Attorney portrait">
      </div>
    </div>
    <div class="lf3-hero-bottom lf3-reveal">
      <div class="lf3-hero-stat"><h3>18+</h3><p>Years Practicing</p></div>
      <div class="lf3-hero-stat"><h3>96%</h3><p>Case Success Rate</p></div>
      <div class="lf3-hero-stat"><h3>310+</h3><p>Matters Closed</p></div>
      <div class="lf3-hero-stat"><h3>$41M</h3><p>Client Recoveries</p></div>
    </div>
  </div>
</section>

<div class="lf3-ticker">
  <div class="lf3-ticker-track">
    <span>Corporate Law <span class="dot">●</span></span><span>Litigation <span class="dot">●</span></span><span>Real Estate <span class="dot">●</span></span><span>Family Law <span class="dot">●</span></span><span>Compliance <span class="dot">●</span></span>
    <span>Corporate Law <span class="dot">●</span></span><span>Litigation <span class="dot">●</span></span><span>Real Estate <span class="dot">●</span></span><span>Family Law <span class="dot">●</span></span><span>Compliance <span class="dot">●</span></span>
  </div>
</div>

<section class="lf3-about" id="about">
  <div class="lf3-about-watermark">25</div>
  <div class="container lf3-about-grid">
    <div class="lf3-reveal">
      <div class="eyebrow">Who We Are</div>
      <h2>Built on judgment, not just credentials.</h2>
      <div class="lf3-about-copy">
        <p>We advise founders, families, and enterprises on the matters that matter most — combining sharp legal reasoning with a genuine understanding of what our clients are trying to achieve.</p>
      </div>
      <a href="#services" class="btn btn-line">Our Approach</a>
    </div>
    <div class="lf3-about-list lf3-reveal" style="transition-delay: 0.15s;">
      <div class="lf3-about-row">
        <span class="num">01</span>
        <div><h4>Direct, honest counsel</h4><p>No jargon, no false promises — just clarity on where you stand and what comes next.</p></div>
      </div>
      <div class="lf3-about-row">
        <span class="num">02</span>
        <div><h4>Senior attorneys on every file</h4><p>Your matter is handled by experienced counsel from day one, not passed down the chain.</p></div>
      </div>
      <div class="lf3-about-row">
        <span class="num">03</span>
        <div><h4>Outcomes-first strategy</h4><p>We build every case around the result you actually need, not billable procedure.</p></div>
      </div>
    </div>
  </div>
</section>

<section class="lf3-contact" id="contact">
  <div class="container">
    <div class="lf3-contact-card lf3-reveal">
      <div class="lf3-contact-info">
        <div class="eyebrow">Get In Touch</div>
        <h2>Let's talk about your matter.</h2>
        <p>Reach out directly or fill out the form — a member of our team will respond within one business day.</p>
        <div class="lf3-info-row">
          <div class="ic"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg></div>
          <div><h4>Office</h4><p>ADDRESS_PLACEHOLDER</p></div>
        </div>
        <div class="lf3-info-row">
          <div class="ic"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg></div>
          <div><h4>Phone</h4><p>PHONE_PLACEHOLDER</p></div>
        </div>
        <div class="lf3-info-row">
          <div class="ic"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg></div>
          <div><h4>Email</h4><p>EMAIL_PLACEHOLDER</p></div>
        </div>
      </div>
      <div class="lf3-contact-form">
        <form class="lead-capture-form">
          <div class="lf3-form-grid">
            <div class="lf3-input-group">
              <label>First Name</label>
              <input type="text" name="firstName" placeholder="John" required>
            </div>
            <div class="lf3-input-group">
              <label>Last Name</label>
              <input type="text" name="lastName" placeholder="Doe" required>
            </div>
            <div class="lf3-input-group">
              <label>Email Address</label>
              <input type="email" name="email" placeholder="john@example.com" required>
            </div>
            <div class="lf3-input-group">
              <label>Phone Number</label>
              <input type="tel" name="phone" placeholder="(555) 123-4567" required>
            </div>
            <div class="lf3-input-group lf3-form-full">
              <label>Case Details</label>
              <textarea name="notes" placeholder="Tell us briefly about your situation..." required></textarea>
            </div>
          </div>
          <button type="submit" class="btn btn-solid" style="width: 100%; justify-content: center;">Send Message</button>
        </form>
      </div>
    </div>
  </div>
</section>

<section class="lf3-services" id="services">
  <div class="container">
    <div class="lf3-services-head lf3-reveal">
      <h2>Practice areas built around <span class="italic" style="color: var(--primary);">real outcomes.</span></h2>
      <p>From boardrooms to courtrooms, our practice spans the matters that shape businesses and lives.</p>
    </div>
    <div class="lf3-reveal">
      <div class="lf3-service-row">
        <span class="num">01</span>
        <h3>SERVICES_PLACEHOLDER</h3>
        <p>Comprehensive counsel across the full lifecycle of a legal matter.</p>
        <span class="arrow">→</span>
      </div>
      <div class="lf3-service-row">
        <span class="num">02</span>
        <h3>Corporate & Commercial</h3>
        <p>Formation, governance, contracts, and transactional support.</p>
        <span class="arrow">→</span>
      </div>
      <div class="lf3-service-row">
        <span class="num">03</span>
        <h3>Litigation & Disputes</h3>
        <p>Assertive representation in negotiation, arbitration, and court.</p>
        <span class="arrow">→</span>
      </div>
      <div class="lf3-service-row">
        <span class="num">04</span>
        <h3>Real Estate Law</h3>
        <p>Acquisitions, leasing, zoning, and property dispute resolution.</p>
        <span class="arrow">→</span>
      </div>
      <div class="lf3-service-row">
        <span class="num">05</span>
        <h3>Family & Estate</h3>
        <p>Sensitive, thorough guidance through life's most personal matters.</p>
        <span class="arrow">→</span>
      </div>
    </div>
  </div>
</section>

<section class="lf3-bento">
  <div class="container">
    <div class="lf3-bento-head lf3-reveal">
      <div class="eyebrow" style="justify-content: center;">What We Handle</div>
      <h2>A practice as varied as the problems <span class="italic">you bring us.</span></h2>
    </div>
    <div class="lf3-bento-grid lf3-reveal">
      <div class="lf3-bento-item wide tall">
        <img src="/assets/templates/LawFirm/templates08/justice.jpg" alt="Corporate law">
        <div class="overlay"></div>
        <h4>Corporate Advisory</h4>
        <p>Governance & structuring</p>
      </div>
      <div class="lf3-bento-item plain">
        <h4>150+</h4>
        <p>Active corporate clients</p>
      </div>
      <div class="lf3-bento-item dark">
        <h4>Mergers & Acquisitions</h4>
        <p>Due diligence, deal structuring</p>
      </div>
      <div class="lf3-bento-item">
        <img src="/assets/templates/LawFirm/templates08/image4.jpg" alt="Real estate">
        <div class="overlay"></div>
        <h4>Real Estate</h4>
        <p>Property & zoning law</p>
      </div>
      <div class="lf3-bento-item wide">
        <img src="/assets/templates/LawFirm/templates08/image5.jpg" alt="Litigation">
        <div class="overlay"></div>
        <h4>Litigation & Arbitration</h4>
        <p>Dispute resolution at every scale</p>
      </div>
    </div>
  </div>
</section>

<section class="lf3-timeline">
  <div class="container">
    <div class="lf3-timeline-head lf3-reveal">
      <div class="eyebrow">How We Work</div>
      <h2>A clear path, from first call to resolution.</h2>
    </div>
    <div class="lf3-timeline-wrap lf3-reveal">
      <div class="lf3-timeline-step">
        <div class="lf3-timeline-dot"></div>
        <span class="tag">Step 01</span>
        <h3>Initial Consultation</h3>
        <p>We listen first. A confidential conversation to understand your situation, goals, and constraints before recommending any path forward.</p>
      </div>
      <div class="lf3-timeline-step">
        <div class="lf3-timeline-dot"></div>
        <span class="tag">Step 02</span>
        <h3>Strategy & Engagement</h3>
        <p>You receive a clear plan, transparent fee structure, and a dedicated attorney assigned to your matter from start to finish.</p>
      </div>
      <div class="lf3-timeline-step">
        <div class="lf3-timeline-dot"></div>
        <span class="tag">Step 03</span>
        <h3>Active Representation</h3>
        <p>We negotiate, file, and litigate on your behalf — keeping you informed at every material step of the process.</p>
      </div>
      <div class="lf3-timeline-step">
        <div class="lf3-timeline-dot"></div>
        <span class="tag">Step 04</span>
        <h3>Resolution & Support</h3>
        <p>Once resolved, we remain available for follow-up questions and future legal needs as your circumstances evolve.</p>
      </div>
    </div>
  </div>
</section>

<section class="lf3-testimonial">
  <div class="lf3-testimonial-inner">
    <div class="lf3-testimonial-photo"></div>
    <div class="lf3-testimonial-copy">
      <div class="qmark">"</div>
      <p class="quote">They treated our case like it was the only one on their desk. Thorough, responsive, and genuinely invested in the outcome.</p>
      <div class="lf3-testimonial-person">
        <img src="/assets/templates/LawFirm/templates08/image6.jpg" alt="Client">
        <div>
          <span>Elena Marsh</span>
          <small>Founder, Marsh & Co.</small>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="lf3-cases" id="cases">
  <div class="container">
    <div class="lf3-cases-head lf3-reveal">
      <div>
        <div class="eyebrow">Case Studies</div>
        <h2>Results our clients have relied on.</h2>
      </div>
      <a href="#contact" class="btn btn-line">View All Cases</a>
    </div>
    <div class="lf3-cases-grid lf3-reveal">
      <div class="lf3-case-feature">
        <img src="/assets/templates/LawFirm/templates08/image7.jpg" alt="Featured case">
        <div class="overlay"></div>
        <div class="lf3-case-feature-info">
          <span class="tag">Corporate · 2026</span>
          <h3>Cross-border merger due diligence</h3>
        </div>
      </div>
      <div class="lf3-cases-side">
        <div class="lf3-case-mini">
          <img src="/assets/templates/LawFirm/templates08/image8.jpg" alt="Case">
          <div><span class="tag">Litigation · 2026</span><h4>Commercial dispute arbitration</h4></div>
        </div>
        <div class="lf3-case-mini">
          <img src="/assets/templates/LawFirm/templates08/image9.jpg" alt="Case">
          <div><span class="tag">Real Estate · 2026</span><h4>Zoning appeal resolution</h4></div>
        </div>
        <div class="lf3-case-mini">
          <img src="/assets/templates/LawFirm/templates08/image10.jpg" alt="Case">
          <div><span class="tag">Family Law · 2026</span><h4>Estate & succession planning</h4></div>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="lf3-team" id="team">
  <div class="container">
    <div class="lf3-team-head lf3-reveal">
      <div>
        <div class="eyebrow">Our People</div>
        <h2>The attorneys behind the practice.</h2>
      </div>
    </div>
    <div class="lf3-team-grid lf3-reveal">
      <div class="lf3-team-card">
        <img src="/assets/templates/LawFirm/templates08/image11.jpg" alt="Attorney">
        <div class="lf3-team-card-info"><h4>Andrew Cole</h4><p>Managing Partner</p></div>
      </div>
      <div class="lf3-team-card">
        <img src="/assets/templates/LawFirm/templates08/image12.jpg" alt="Attorney">
        <div class="lf3-team-card-info"><h4>Priya Nair</h4><p>Corporate Counsel</p></div>
      </div>
      <div class="lf3-team-card">
        <img src="/assets/templates/LawFirm/templates08/image13.jpg" alt="Attorney">
        <div class="lf3-team-card-info"><h4>Marcus Webb</h4><p>Litigation Lead</p></div>
      </div>
      <div class="lf3-team-card">
        <img src="/assets/templates/LawFirm/templates08/image14.jpg" alt="Attorney">
        <div class="lf3-team-card-info"><h4>Sofia Reyes</h4><p>Family Law Advisor</p></div>
      </div>
    </div>
  </div>
</section>

<section class="lf3-cta">
  <div class="container lf3-cta-inner">
    <h2>Have a legal matter that needs clear direction?</h2>
    <div class="lf3-cta-actions">
      <a href="#contact" class="btn btn-cream">Talk To An Attorney</a>
    </div>
  </div>
</section>

<section class="lf3-faq">
  <div class="container lf3-faq-inner">
    <div class="lf3-reveal">
      <div class="eyebrow">FAQ</div>
      <h2>Common questions, answered.</h2>
      <p>Still unsure about something? Reach out and we'll walk you through it directly.</p>
    </div>
    <div class="lf3-reveal" style="transition-delay: 0.15s;">
      <details class="lf3-faq-item" open>
        <summary class="lf3-faq-item-head"><span>What should I bring to my first consultation?</span><span class="lf3-faq-toggle">+</span></summary>
        <div class="lf3-faq-body">Any documents relevant to your matter — contracts, correspondence, or notices — help us give you accurate guidance from the start.</div>
      </details>
      <details class="lf3-faq-item">
        <summary class="lf3-faq-item-head"><span>How is your fee structure determined?</span><span class="lf3-faq-toggle">+</span></summary>
        <div class="lf3-faq-body">Fees depend on the nature and complexity of your matter. We outline all costs clearly before any engagement begins.</div>
      </details>
      <details class="lf3-faq-item">
        <summary class="lf3-faq-item-head"><span>Do you handle matters outside your primary region?</span><span class="lf3-faq-toggle">+</span></summary>
        <div class="lf3-faq-body">Yes, through our network of trusted co-counsel we support clients across multiple jurisdictions.</div>
      </details>
      <details class="lf3-faq-item">
        <summary class="lf3-faq-item-head"><span>How quickly can you begin work on my case?</span><span class="lf3-faq-toggle">+</span></summary>
        <div class="lf3-faq-body">In most cases, we can begin within a few business days of a signed engagement letter.</div>
      </details>
    </div>
  </div>
</section>

<footer class="lf3-footer">
  <div class="lf3-footer-wordmark logo">PROJECT_NAME_PLACEHOLDER</div>
  <div class="container lf3-footer-grid">
    <div class="lf3-footer-col">
      <h4>The Firm</h4>
      <p>Precision counsel for the matters that shape businesses and lives — direct, strategic, and always accountable.</p>
    </div>
    <div class="lf3-footer-col">
      <h4>Navigate</h4>
      <ul>
        <li><a href="#about">About</a></li>
        <li><a href="#services">Practice Areas</a></li>
        <li><a href="#cases">Case Studies</a></li>
        <li><a href="#team">Attorneys</a></li>
      </ul>
    </div>
    <div class="lf3-footer-col">
      <h4>Contact</h4>
      <ul>
        <li><a href="tel:PHONE_PLACEHOLDER">PHONE_PLACEHOLDER</a></li>
        <li><a href="mailto:EMAIL_PLACEHOLDER">EMAIL_PLACEHOLDER</a></li>
        <li><a href="#contact">ADDRESS_PLACEHOLDER</a></li>
      </ul>
    </div>
    <div class="lf3-footer-col">
      <h4>Stay Informed</h4>
      <p>Occasional legal insights, no spam.</p>
      <form class="lf3-newsletter lead-capture-form">
        <input type="email" name="email" placeholder="Your email address" required>
        <button type="submit"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg></button>
      </form>
    </div>
  </div>
  <div class="container lf3-footer-bottom">
    <div>© 2026 PROJECT_NAME_PLACEHOLDER. All Rights Reserved.</div>
    <div class="lf3-footer-links">
      <a href="#">Privacy Policy</a>
      <a href="#">Terms of Service</a>
      <a href="#">Disclaimer</a>
    </div>
  </div>
</footer>

<script id="core-interactions">
  (function() {
    var isPreview = window.location.href.startsWith('blob:');
    var isInEditor = !isPreview && (!!document.querySelector('[data-gjs-type]') || document.body.classList.contains('gjs-dashed'));

    if (!isInEditor) {
      document.body.classList.add('js-enabled');


      var revealEls = document.querySelectorAll('.lf3-reveal');
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
    }

    document.addEventListener('submit', function(e) {
      if (e.target.tagName === 'FORM') {
        e.preventDefault();
        if (isInEditor) {
          e.stopImmediatePropagation();
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
            var originalText = btn.innerHTML || btn.value;
            if (btn.innerHTML) btn.innerHTML = 'Sending...';
            else btn.value = 'Sending...';
            btn.style.opacity = '0.7';
            setTimeout(function() {
              if (btn.innerHTML) btn.innerHTML = 'Sent Successfully!';
              else btn.value = 'Sent Successfully!';
              btn.style.backgroundColor = '#22c55e';
              btn.style.borderColor = '#22c55e';
              btn.style.opacity = '1';
              e.target.reset();
              setTimeout(function() {
                if (btn.innerHTML) btn.innerHTML = originalText;
                else btn.value = originalText;
                btn.style.backgroundColor = '';
                btn.style.borderColor = '';
                inputs.forEach(function(i) { i.style.borderColor = ''; });
              }, 3000);
            }, 1500);
          }
        }
      }
    }, true);
  })();
</script>
`;