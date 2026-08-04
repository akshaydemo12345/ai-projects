export const plumber06Styles = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700;9..144,800&family=Inter:wght@400;500;600;700;800&display=swap');
 
:root {
  --primary: PRIMARY_COLOR_PLACEHOLDER;
  --secondary: SECONDARY_COLOR_PLACEHOLDER;
  --primary-rgb: PRIMARY_RGB_PLACEHOLDER;
  --secondary-rgb: SECONDARY_RGB_PLACEHOLDER;
}

/* GrapesJS Editor Override */
body, .gjs-dashed, [data-gjs-type="wrapper"], main {
    background-color: #ffffff !important;
    color: var(--secondary) !important;
}
h1, h2, h3, h4, h5, h6, p, span, div, a {
    color: inherit;
}

* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Inter', sans-serif; color: var(--secondary); background: #ffffff; line-height: 1.65; overflow-x: hidden; }
h1, h2, h3, h4 { font-family: 'Fraunces', serif; font-weight: 700; line-height: 1.15; color: var(--secondary); letter-spacing: -0.01em; }
.container { max-width: 1180px; margin: 0 auto; padding: 0 1.5rem; position: relative; z-index: 5; }
img { max-width: 100%; display: block; }
a { text-decoration: none; color: inherit; transition: 0.3s; }
.hp30-eyebrow { display: inline-flex; align-items: center; gap: 0.6rem; color: var(--primary); font-weight: 700; font-size: 0.76rem; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 1rem; }
.hp30-eyebrow::before { content: ''; width: 22px; height: 2px; background: var(--primary); }
 
.btn { display: inline-flex; align-items: center; justify-content: center; gap: 0.6rem; padding: 1.05rem 2.2rem; border-radius: 8px; font-weight: 700; font-size: 0.95rem; cursor: pointer; border: 2px solid transparent; font-family: 'Inter', sans-serif; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
.btn-primary { background: var(--primary); border-color: var(--primary); color: #fff; box-shadow: 0 10px 20px -5px rgba(var(--primary-rgb),0.3); }
.btn-primary:hover { transform: translateY(-3px); background: transparent; color: var(--primary); border-color: var(--primary); box-shadow: 0 15px 25px -5px rgba(var(--primary-rgb),0.4); }
.btn-outline { border: 1px solid rgba(255,255,255,0.25); color: var(--secondary); border-color: #e2e8f0; }
.btn-outline:hover { border-color: var(--primary); color: var(--primary); }
.btn-ghost-light { border: 1px solid rgba(255,255,255,0.3); color: #fff; }
.btn-ghost-light:hover { border-color: var(--secondary); color: var(--secondary); }
 
/* Trade seal badge - signature element */
.hp30-seal { width: 140px; height: 140px; border-radius: 50%; border: 2px solid var(--primary); display: flex; align-items: center; justify-content: center; flex-shrink: 0; position: relative; background: var(--secondary); color: #ffffff; text-align: center; transition: transform 0.5s ease; box-shadow: 0 15px 30px rgba(0,0,0,0.2); }\n.hp30-seal:hover { transform: rotate(10deg) scale(1.05); }
.hp30-seal::before { content: ''; position: absolute; inset: 8px; border: 1px dashed rgba(var(--primary-rgb),0.55); border-radius: 50%; }
.hp30-seal-inner { display: flex; flex-direction: column; align-items: center; gap: 2px; padding: 0 10px; }
.hp30-seal-year { font-family: 'Fraunces', serif; font-size: 1.8rem; font-weight: 800; color: var(--primary); line-height: 1; }
.hp30-seal-label { font-size: 0.56rem; text-transform: uppercase; letter-spacing: 1.2px; color: rgba(251,248,243,0.75); }
 
/* Header */
.hp30-header { padding: 1.4rem 0; background: var(--secondary); }
.hp30-header-inner { display: flex; justify-content: space-between; align-items: center; gap: 1rem; flex-wrap: wrap; }
.hp30-logo { display: flex; align-items: center; gap: 0.7rem; font-weight: 800; font-size: 1.25rem; color: #fff; font-family: 'Fraunces', serif; }
.hp30-logo .ic { width: 42px; height: 42px; border-radius: 8px; background: var(--primary); color: #fff; display: flex; align-items: center; justify-content: center; }
.hp30-logo small { display: block; font-family: 'Inter', sans-serif; font-size: 0.65rem; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; color: var(--secondary); margin-top: 2px; }
.hp30-header-actions { display: flex; align-items: center; gap: 1.25rem; }
.hp30-header-phone { color: #fff; font-weight: 700; font-size: 0.95rem; display: flex; align-items: center; gap: 0.5rem; }
.hp30-header-phone .ic { color: var(--secondary); }
 
/* Hero */
.hp30-hero { padding: 4rem 0 5.5rem; background: var(--secondary); position: relative; overflow: hidden; }
.hp30-hero::after { content: ''; position: absolute; right: -120px; top: -120px; width: 420px; height: 420px; border-radius: 50%; border: 60px solid rgba(var(--primary-rgb),0.08); z-index: 1; }
.hp30-hero-grid { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 3.5rem; align-items: center; position: relative; z-index: 2; }
.hp30-hero-top { display: flex; align-items: center; gap: 1.5rem; margin-bottom: 1.75rem; }
.hp30-hero-copy h1 { font-size: 3.1rem; margin-bottom: 1.25rem; color: #fff; }
.hp30-hero-copy h1 em { font-style: normal; color: var(--secondary); }
.hp30-hero-copy p { color: rgba(251,248,243,0.72); font-size: 1.03rem; max-width: 480px; margin-bottom: 2rem; }
.hp30-hero-actions { display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 2.25rem; }
.hp30-hero-badges { display: flex; gap: 1.75rem; flex-wrap: wrap; }
.hp30-hero-badge { display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; color: rgba(251,248,243,0.75); }
.hp30-hero-badge .ic { color: var(--secondary); }

.hp30-hero-form-wrapper { position: relative; }
.hp30-hero-form-wrapper::before { content: ''; position: absolute; inset: -15px; background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.25), rgba(var(--primary-rgb), 0)); border-radius: 28px; z-index: 1; transform: rotate(-3deg); transition: transform 0.4s; }
.hp30-hero-form-wrapper:hover::before { transform: rotate(0deg); }
.hp30-hero-form { background: #ffffff; border-radius: 24px; padding: 2.5rem; position: relative; z-index: 2; box-shadow: 0 30px 60px rgba(0,0,0,0.25); }
.hp30-hero-form h3 { font-size: 1.6rem; margin-bottom: 0.4rem; color: #0f172a; }
.hp30-hero-form p { color: #64748b; font-size: 0.9rem; margin-bottom: 1.75rem; font-weight: 500; }
.hp30-fg { margin-bottom: 1.1rem; }
.hp30-fg label { display: block; font-size: 0.76rem; font-weight: 700; color: #64748b; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.5px; }
.hp30-fg input, .hp30-fg select, .hp30-fg textarea { width: 100%; padding: 0.95rem 1.1rem; border: 2px solid #e2e8f0; border-radius: 10px; font-family: 'Inter', sans-serif; font-size: 0.95rem; outline: none; background: #f8fafc; transition: all 0.2s; color: #0f172a; }
.hp30-fg input:focus, .hp30-fg select:focus, .hp30-fg textarea:focus { border-color: var(--primary); background: #ffffff; box-shadow: 0 0 0 4px rgba(var(--primary-rgb), 0.1); }

/* Stats strip */
.hp30-stats { padding: 3rem 0; background: #f8fafc; border-bottom: 1px solid #e2e8f0; }
.hp30-stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; text-align: center; }
.hp30-stat .num { font-family: 'Fraunces', serif; font-size: 2.6rem; font-weight: 800; color: var(--secondary); line-height: 1; }
.hp30-stat .num span { color: var(--primary); }
.hp30-stat .label { color: #64748b; font-size: 0.82rem; margin-top: 0.5rem; text-transform: uppercase; letter-spacing: 0.6px; font-weight: 600; }
 
/* Timeline - three decades (real chronological sequence) */
.hp30-timeline { padding: 5.5rem 0; }
.hp30-timeline-head { max-width: 640px; margin: 0 auto 3.5rem; text-align: center; }
.hp30-timeline-head h2 { font-size: 2.4rem; }
.hp30-timeline-track { position: relative; display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; }
.hp30-timeline-track::before { content: ''; position: absolute; top: 22px; left: 6%; right: 6%; height: 2px; background: #e2e8f0; }
.hp30-t-item { position: relative; text-align: center; padding-top: 3.2rem; }
.hp30-t-dot { position: absolute; top: 0; left: 50%; transform: translateX(-50%); width: 46px; height: 46px; border-radius: 50%; background: var(--primary); color: #ffffff; display: flex; align-items: center; justify-content: center; font-family: 'Fraunces', serif; font-weight: 700; font-size: 0.85rem; border: 3px solid #ffffff; box-shadow: 0 0 0 2px #e2e8f0; }
.hp30-t-item h4 { font-size: 1.02rem; margin-bottom: 0.4rem; }
.hp30-t-item p { color: #64748b; font-size: 0.85rem; }
 
/* Services - numbered rows */
.hp30-services { padding: 5.5rem 0; background: #f8fafc; }
.hp30-services-head { max-width: 600px; margin-bottom: 3rem; }
.hp30-services-head h2 { font-size: 2.4rem; }
.hp30-service-row { display: grid; grid-template-columns: 60px 1fr 1fr; gap: 1.5rem; align-items: center; padding: 1.75rem 1.5rem; border-bottom: 1px solid #e2e8f0; border-radius: 12px; transition: all 0.3s ease; }\n.hp30-service-row:hover { background: #fff; transform: translateY(-2px); box-shadow: 0 10px 30px -10px rgba(0,0,0,0.08); }\n.hp30-service-row:first-child {  }
.hp30-service-row:last-child { border-bottom: 1px solid #e2e8f0; }
.hp30-service-row .num { font-family: 'Fraunces', serif; font-weight: 700; color: var(--primary); font-size: 1.1rem; }
.hp30-service-row h3 { font-size: 1.15rem; }
.hp30-service-row p { color: #64748b; font-size: 0.9rem; }
 
/* Process - how we work (real ordered steps) */
.hp30-process { padding: 5.5rem 0; }
.hp30-process-head { max-width: 620px; margin: 0 auto 3.5rem; text-align: center; }
.hp30-process-head h2 { font-size: 2.4rem; }
.hp30-process-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.75rem; }
.hp30-p-step { background: #fff; border-radius: 16px; padding: 2.5rem 2rem; position: relative; transition: all 0.3s ease; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px rgba(0,0,0,0.02); }\n.hp30-p-step:hover { transform: translateY(-5px); box-shadow: 0 20px 40px -10px rgba(0,0,0,0.08); border-color: rgba(var(--primary-rgb), 0.3); }
.hp30-p-step .step-num { font-family: 'Fraunces', serif; font-size: 2.4rem; font-weight: 800; color: rgba(var(--primary-rgb),0.35); line-height: 1; margin-bottom: 0.75rem; }
.hp30-p-step h4 { font-size: 1.05rem; margin-bottom: 0.5rem; }
.hp30-p-step p { color: #64748b; font-size: 0.85rem; }
 
/* Why choose us */
.hp30-why { padding: 5.5rem 0; background: var(--secondary); color: #fff; }
.hp30-why-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 3.5rem; align-items: center; }
.hp30-why-grid img { border-radius: 14px; height: 420px; object-fit: cover; }
.hp30-why-content h2 { font-size: 2.3rem; margin-bottom: 1.5rem; color: #fff; }
.hp30-why-list { display: flex; flex-direction: column; gap: 1.1rem; }
.hp30-why-item { display: flex; gap: 1rem; align-items: flex-start; }
.hp30-why-item .ic { width: 32px; height: 32px; border-radius: 50%; background: var(--primary); color: #fff; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 0.8rem; }
.hp30-why-item h4 { font-size: 1rem; margin-bottom: 0.2rem; color: #fff; }
.hp30-why-item p { color: rgba(251,248,243,0.65); font-size: 0.85rem; }
 
/* Pricing */
.hp30-pricing { padding: 5.5rem 0; }
.hp30-pricing-head { text-align: center; max-width: 620px; margin: 0 auto 3rem; }
.hp30-pricing-head h2 { font-size: 2.4rem; }
.hp30-pricing-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
.hp30-price-card { border: 1px solid #e2e8f0; border-radius: 14px; padding: 2.25rem; }
.hp30-price-card.featured { border-color: var(--primary); background: var(--secondary); position: relative; }
.hp30-price-card.featured::before { content: 'Most Popular'; position: absolute; top: -14px; left: 50%; transform: translateX(-50%); background: var(--primary); color: #fff; font-size: 0.7rem; font-weight: 700; padding: 0.35rem 1rem; border-radius: 50px; }
.hp30-price-card.featured h4, .hp30-price-card.featured .price { color: #fff; }
.hp30-price-card.featured .price span { color: rgba(251,248,243,0.6); }
.hp30-price-card.featured li { color: rgba(251,248,243,0.7); }
.hp30-price-card h4 { font-size: 1.15rem; margin-bottom: 0.5rem; }
.hp30-price-card .price { font-size: 2rem; font-weight: 800; margin-bottom: 1.25rem; font-family: 'Fraunces', serif; }
.hp30-price-card .price span { font-size: 0.85rem; font-weight: 500; color: #64748b; font-family: 'Inter', sans-serif; }
.hp30-price-card ul { list-style: none; display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 1.5rem; }
.hp30-price-card li { display: flex; gap: 0.6rem; font-size: 0.87rem; color: #64748b; }
.hp30-price-card li::before { content: '✓'; color: var(--primary); font-weight: 700; }
 
/* Reviews */
.hp30-reviews { padding: 5.5rem 0; background: #f8fafc; }
.hp30-reviews-head { text-align: center; max-width: 620px; margin: 0 auto 3rem; }
.hp30-reviews-head h2 { font-size: 2.4rem; }
.hp30-review-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
.hp30-review-card { background: #fff; border-radius: 16px; padding: 2.5rem 2rem; border: 1px solid #e2e8f0; transition: all 0.3s ease; }\n.hp30-review-card:hover { transform: translateY(-5px); box-shadow: 0 20px 40px -10px rgba(0,0,0,0.08); }
.hp30-review-card .stars { color: var(--primary); margin-bottom: 1rem; letter-spacing: 2px; }
.hp30-review-card p { font-size: 0.9rem; margin-bottom: 1.25rem; }
.hp30-review-person { display: flex; align-items: center; gap: 0.75rem; }
.hp30-review-person img { width: 42px; height: 42px; border-radius: 50%; object-fit: cover; }
.hp30-review-person span { font-weight: 700; font-size: 0.85rem; }
 
/* Certifications strip */
.hp30-certs { padding: 3rem 0; border-top: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0; }
.hp30-certs-inner { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1.5rem; }
.hp30-certs-label { font-size: 0.76rem; text-transform: uppercase; letter-spacing: 1.2px; color: #64748b; font-weight: 700; max-width: 220px; }
.hp30-certs-logos { display: flex; gap: 2.25rem; flex-wrap: wrap; align-items: center; }
.hp30-cert-badge { display: flex; align-items: center; gap: 0.5rem; color: var(--secondary); font-weight: 700; font-size: 0.88rem; }
.hp30-cert-badge .ic { color: var(--primary); }
 
/* FAQ */
.hp30-faq { padding: 5.5rem 0; }
.hp30-faq-inner { max-width: 780px; margin: 0 auto; }
.hp30-faq-head { text-align: center; margin-bottom: 3rem; }
.hp30-faq-head h2 { font-size: 2.4rem; }
.hp30-faq-item { border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.4rem 1.75rem; margin-bottom: 1rem; cursor: pointer; }
.hp30-faq-item-head { display: flex; justify-content: space-between; align-items: center; gap: 1rem; font-weight: 700; font-size: 0.95rem; font-family: 'Fraunces', serif; }
.hp30-faq-toggle { color: var(--primary); font-size: 1.2rem; transition: 0.3s; }
.hp30-faq-item.active .hp30-faq-toggle { transform: rotate(45deg); }
.hp30-faq-body { max-height: 0; overflow: hidden; transition: max-height 0.35s ease; color: #64748b; font-size: 0.9rem; }
.hp30-faq-item.active .hp30-faq-body { max-height: 220px; padding-top: 0.85rem; }
 

/* FAQ */
.hp30-faq { padding: 5.5rem 0; background: #ffffff; }
.hp30-faq-inner { max-width: 780px; margin: 0 auto; }
.hp30-faq-head { text-align: center; margin-bottom: 3.5rem; }
.hp30-faq-head h2 { font-size: 2.5rem; }
.hp30-faq-list { display: flex; flex-direction: column; gap: 1rem; }
.hp30-faq-item { border: 1px solid #e2e8f0; border-radius: 12px; background: #f8fafc; overflow: hidden; transition: all 0.3s; }
.hp30-faq-item[open] { background: #ffffff; border-color: var(--primary); box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05); }
.hp30-faq-item summary { padding: 1.5rem; font-weight: 700; font-size: 1.05rem; cursor: pointer; display: flex; justify-content: space-between; align-items: center; font-family: 'Fraunces', serif; list-style: none; }
.hp30-faq-item summary::-webkit-details-marker { display: none; }
.hp30-faq-item summary::after { content: '+'; font-family: 'Inter', sans-serif; font-size: 1.5rem; font-weight: 400; color: var(--primary); transition: transform 0.3s; display: inline-flex; align-items: center; justify-content: center; width: 30px; height: 30px; }
.hp30-faq-item[open] summary::after { content: '−'; transform: rotate(180deg); }
.hp30-faq-body { padding: 0 1.5rem 1.5rem; color: #64748b; font-size: 0.95rem; line-height: 1.6; }

/* Contact/CTA */
.hp30-cta { padding: 5.5rem 0; }
.hp30-cta-card { background: #0f172a; border-radius: 24px; padding: 4.5rem; text-align: center; position: relative; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); }
.hp30-cta-card::after { content: ''; position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); width: 600px; height: 600px; border-radius: 50%; background: radial-gradient(circle, rgba(var(--primary-rgb), 0.15) 0%, rgba(var(--primary-rgb), 0) 70%); }
.hp30-cta-content { position: relative; z-index: 2; max-width: 680px; margin: 0 auto; }
.hp30-cta-content h2 { color: #ffffff; font-size: 2.8rem; margin-bottom: 1.25rem; }
.hp30-cta-content p { color: rgba(255,255,255,0.7); font-size: 1.1rem; margin-bottom: 2.5rem; }
.hp30-cta-actions { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
@media (max-width: 768px) {
  .hp30-cta-card { padding: 3rem 1.5rem; }
  .hp30-cta-content h2 { font-size: 2.2rem; }
}

/* Footer */
.hp30-footer { padding: 2.5rem 0; background: var(--secondary); }
.hp30-footer-inner { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; color: rgba(251,248,243,0.6); font-size: 0.85rem; }
.hp30-footer-links { display: flex; gap: 1.5rem; }
.hp30-footer-links a { color: rgba(251,248,243,0.6); }
.hp30-footer-links a:hover { color: var(--secondary); }
 
@media (max-width: 992px) {
  .hp30-hero-grid, .hp30-why-grid, .hp30-contact-card { grid-template-columns: 1fr; }
  .hp30-pricing-grid, .hp30-review-grid, .hp30-process-grid { grid-template-columns: 1fr 1fr; }
  .hp30-stats-grid { grid-template-columns: 1fr 1fr; }
  .hp30-timeline-track { grid-template-columns: 1fr 1fr; }
  .hp30-timeline-track::before { display: none; }
}
@media (max-width: 768px) {
  .hp30-hero-copy h1 { font-size: 2.05rem; }
  .hp30-hero-top { flex-direction: column; align-items: flex-start; gap: 1rem; }
  .hp30-services-head h2, .hp30-why-content h2, .hp30-pricing-head h2, .hp30-reviews-head h2, .hp30-faq-head h2, .hp30-contact-copy h2, .hp30-timeline-head h2, .hp30-process-head h2 { font-size: 1.8rem; }
  .hp30-service-row { grid-template-columns: 40px 1fr; }
  .hp30-service-row p { display: none; }
  .hp30-form-grid { grid-template-columns: 1fr; }
  .hp30-contact-card { padding: 2rem; }
  .hp30-pricing-grid, .hp30-review-grid, .hp30-process-grid, .hp30-stats-grid, .hp30-timeline-track { grid-template-columns: 1fr; }
  .hp30-certs-inner { flex-direction: column; align-items: flex-start; }
  .hp30-header-phone span.ph-text { display: none; }
}
`;


export const plumber06Html = `
<header class="hp30-header">
  <div class="container hp30-header-inner">
    <a href="javascript:void(0);" class="hp30-logo" style="display: flex; align-items: center; gap: 0.5rem; text-decoration: none;">LOGO_PLACEHOLDER</a>
    <div class="hp30-header-actions">
      <a href="tel:PHONE_PLACEHOLDER" class="hp30-header-phone"><span class="ic"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"></path></svg></span><span class="ph-text">PHONE_PLACEHOLDER</span></a>
      <a href="javascript:void(0);" class="btn btn-primary">Get A Free Quote</a>
    </div>
  </div>
</header>
 
<section class="hp30-hero">
  <div class="container hp30-hero-grid">
    <div class="hp30-hero-copy">
      <div class="hp30-hero-top">
        <div class="hp30-seal">
          <div class="hp30-seal-inner">
            <span class="hp30-seal-year">30</span>
            <span class="hp30-seal-label">Years Trusted</span>
          </div>
        </div>
        <div>
          <div class="hp30-eyebrow" style="margin-bottom:0.5rem;">Licensed &amp; Insured Since 1996</div>
          <div style="color:rgba(251,248,243,0.6); font-size:0.85rem; max-width:280px;">Three decades of honest plumbing, passed down and still showing up on time.</div>
        </div>
      </div>
      <h1>Thirty years of pipes, promises, <em>kept</em>.</h1>
      <p>From a single truck in 1996 to the team homeowners across the region call first — we still show up, quote it straight, and fix it right the first time.</p>
      <div class="hp30-hero-actions">
        <a href="javascript:void(0);" class="btn btn-primary">Request A Quote</a>
        <a href="javascript:void(0);" class="btn btn-ghost-light">Our Services</a>
      </div>
      <div class="hp30-hero-badges">
        <div class="hp30-hero-badge"><span class="ic">✓</span>Same-day service</div>
        <div class="hp30-hero-badge"><span class="ic">✓</span>Upfront, flat-rate pricing</div>
        <div class="hp30-hero-badge"><span class="ic">✓</span>30-year workmanship legacy</div>
      </div>
    </div>
    <div class="hp30-quote-card" style="transition-delay: 0.15s;">
      <h3>Get A Free Quote</h3>
      <div class="sub">A real person calls you back within 15 minutes.</div>
      <form class="lead-capture-form">
        <div class="hp30-fg"><label>Full Name</label><input type="text" name="name" placeholder="John Doe" required></div>
        <div class="hp30-fg"><label>Phone Number</label><input type="tel" name="phone" placeholder="(555) 123-4567" required></div>
        <div class="hp30-fg"><label>Service Needed</label>
          <select name="service" required>
            <option value="">Select a service</option>
            <option>Leak Repair</option>
            <option>Drain Clearing</option>
            <option>Water Heater</option>
            <option>Repiping</option>
          </select>
        </div>
        <button type="submit" class="btn btn-primary" style="width: 100%; justify-content: center;">Get My Free Quote</button>
      </form>
    </div>
  </div>
</section>
 
<section class="hp30-stats">
  <div class="container hp30-stats-grid">
    <div class="hp30-stat"><div class="num"><span>30</span>+</div><div class="label">Years In Business</div></div>
    <div class="hp30-stat"><div class="num">18K+</div><div class="label">Jobs Completed</div></div>
    <div class="hp30-stat"><div class="num">4.9<span>★</span></div><div class="label">Average Rating</div></div>
    <div class="hp30-stat"><div class="num">2<span>nd</span></div><div class="label">Generation Owned</div></div>
  </div>
</section>
 
<section class="hp30-timeline">
  <div class="container">
    <div class="hp30-timeline-head">
      <div class="hp30-eyebrow" style="justify-content:center;">Our Story</div>
      <h2>Three decades, one trusted name.</h2>
    </div>
    <div class="hp30-timeline-track">
      <div class="hp30-t-item"><span class="hp30-t-dot">1996</span><h4>The First Truck</h4><p>Opened our doors as a two-person outfit fixing leaks around town.</p></div>
      <div class="hp30-t-item"><span class="hp30-t-dot">2006</span><h4>Growing The Team</h4><p>Expanded to a full crew of licensed, background-checked plumbers.</p></div>
      <div class="hp30-t-item"><span class="hp30-t-dot">2016</span><h4>Second Generation</h4><p>Passed the wrench to the next generation without changing the standards.</p></div>
      <div class="hp30-t-item"><span class="hp30-t-dot">2026</span><h4>30 Years Strong</h4><p>Still family-run, still flat-rate pricing, still showing up on time.</p></div>
    </div>
  </div>
</section>
 
<section class="hp30-services" id="services">
  <div class="container">
    <div class="hp30-services-head">
      <div class="hp30-eyebrow">SERVICES_PLACEHOLDER</div>
      <h2>Full-Service Plumbing</h2>
    </div>
    <div class="hp30-reveal">
      <div class="hp30-service-row"><span class="num">01</span><h3>Leak Detection & Repair</h3><p>Fast, precise repairs before small leaks become big problems.</p></div>
      <div class="hp30-service-row"><span class="num">02</span><h3>Drain Cleaning</h3><p>Clear stubborn clogs and keep water flowing smoothly.</p></div>
      <div class="hp30-service-row"><span class="num">03</span><h3>Water Heater Services</h3><p>Installation, repair, and maintenance for all major brands.</p></div>
      <div class="hp30-service-row"><span class="num">04</span><h3>Repiping & Installation</h3><p>Full pipe replacement for aging or damaged systems.</p></div>
      <div class="hp30-service-row"><span class="num">05</span><h3>Emergency Plumbing</h3><p>Burst pipe or flooding? We answer the phone, day or night.</p></div>
    </div>
  </div>
</section>
 
<section class="hp30-process">
  <div class="container">
    <div class="hp30-process-head">
      <div class="hp30-eyebrow" style="justify-content:center;">How It Works</div>
      <h2>The same four steps, thirty years running.</h2>
    </div>
    <div class="hp30-process-grid">
      <div class="hp30-p-step"><div class="step-num">01</div><h4>Call or Book Online</h4><p>Tell us what's wrong — we'll ask a few quick questions.</p></div>
      <div class="hp30-p-step"><div class="step-num">02</div><h4>Free On-Site Diagnosis</h4><p>A licensed plumber inspects the issue and explains what's going on.</p></div>
      <div class="hp30-p-step"><div class="step-num">03</div><h4>Upfront Flat-Rate Quote</h4><p>You approve the price before any work begins. No surprises.</p></div>
      <div class="hp30-p-step"><div class="step-num">04</div><h4>Repair & Guarantee</h4><p>We fix it right and back it with our workmanship guarantee.</p></div>
    </div>
  </div>
</section>
 
<section class="hp30-why">
  <div class="container hp30-why-grid">
    <img src="https://images.openai.com/static-rsc-4/m-ArTzBM5NllZfQ7VeYhAdPzUYonLJmrNqInDYVZG_HyEydD1njlBiqDb5b2rIUrbmo9uQ8W28p8vEr1ksFOb4vVwcda05QqTmibBZUikfKNI1J610xAiQyCiuDPnSd13R2qqxrHMOlFqn8t8HmlqIl7Ql_CWe7BsLt_QJYMvOb6xseLhotpSShUc-Asb72e?purpose=fullsize" alt="Plumber at work" class="hp30-reveal">
    <div class="hp30-why-content" style="transition-delay: 0.15s;">
      <div class="hp30-eyebrow">Why Choose Us</div>
      <h2>Thirty years of showing up.</h2>
      <div class="hp30-why-list">
        <div class="hp30-why-item"><span class="ic">✓</span><div><h4>Licensed & background-checked technicians</h4><p>Every plumber on our team is fully vetted and certified.</p></div></div>
        <div class="hp30-why-item"><span class="ic">✓</span><div><h4>Transparent, flat-rate pricing</h4><p>You approve the price before we start any work — no surprises.</p></div></div>
        <div class="hp30-why-item"><span class="ic">✓</span><div><h4>Family-owned for two generations</h4><p>The same standards our founder set in 1996, still followed today.</p></div></div>
        <div class="hp30-why-item"><span class="ic">✓</span><div><h4>Workmanship guarantee</h4><p>All repairs backed by a written satisfaction guarantee.</p></div></div>
      </div>
    </div>
  </div>
</section>
 
<section class="hp30-pricing" id="pricing">
  <div class="container">
    <div class="hp30-pricing-head">
      <div class="hp30-eyebrow" style="justify-content:center;">Simple Pricing</div>
      <h2>Service Packages</h2>
    </div>
    <div class="hp30-pricing-grid">
      <div class="hp30-price-card">
        <h4>Basic Visit</h4>
        <div class="price">$89<span>/visit</span></div>
        <ul><li>Diagnostic inspection</li><li>Minor repair included</li><li>30-day guarantee</li></ul>
        <a href="javascript:void(0);" class="btn btn-outline" style="width:100%; justify-content:center;">Book Now</a>
      </div>
      <div class="hp30-price-card featured">
        <h4>Standard Repair</h4>
        <div class="price">$189<span>/job</span></div>
        <ul><li>Full diagnostic & repair</li><li>Parts included</li><li>90-day guarantee</li><li>Priority scheduling</li></ul>
        <a href="javascript:void(0);" class="btn btn-primary" style="width:100%; justify-content:center;">Book Now</a>
      </div>
      <div class="hp30-price-card">
        <h4>Full Repipe</h4>
        <div class="price">Custom<span> quote</span></div>
        <ul><li>Whole-home assessment</li><li>Complete repiping</li><li>1-year guarantee</li></ul>
        <a href="javascript:void(0);" class="btn btn-outline" style="width:100%; justify-content:center;">Get Quote</a>
      </div>
    </div>
  </div>
</section>
 
<section class="hp30-reviews">
  <div class="container">
    <div class="hp30-reviews-head">
      <div class="hp30-eyebrow" style="justify-content:center;">Customer Reviews</div>
      <h2>What Our Customers Say</h2>
    </div>
    <div class="hp30-review-grid">
      <div class="hp30-review-card review-card"><div class="stars">★★★★★</div><p>"Thirty years in business shows — fast, professional, and the price matched the quote exactly."</p><div class="hp30-review-person"><img src="https://images.openai.com/static-rsc-4/m-ArTzBM5NllZfQ7VeYhAdPzUYonLJmrNqInDYVZG_HyEydD1njlBiqDb5b2rIUrbmo9uQ8W28p8vEr1ksFOb4vVwcda05QqTmibBZUikfKNI1J610xAiQyCiuDPnSd13R2qqxrHMOlFqn8t8HmlqIl7Ql_CWe7BsLt_QJYMvOb6xseLhotpSShUc-Asb72e?purpose=fullsize" alt="Client"><span class="name">Mark Turner</span></div></div>
      <div class="hp30-review-card review-card"><div class="stars">★★★★★</div><p>"Same-day appointment and the plumber explained everything clearly. Old-school service."</p><div class="hp30-review-person"><img src="https://images.openai.com/static-rsc-4/W-f3msdtnjfVSKvPSOM1kKLRrFLuTZv-A6oXha1rIq5Yr09a7VeRS9PZCgpcPA0hC-BIX7bu0DiFhPOOsKQ66Sl5-vuopVk_HMwGV0NG0vdWlGox3k7EX8R-A8pJ8iLk2PNmZWeWU_GgTLG7HfrMHkPvqGOUlzBmqPh_8opfWj2G-zgVc9VVjA7nhiWZ_FCm?purpose=fullsize" alt="Client"><span class="name">Sarah Lee</span></div></div>
      <div class="hp30-review-card review-card"><div class="stars">★★★★★</div><p>"Great communication from booking to completion. This is why they've lasted 30 years."</p><div class="hp30-review-person"><img src="https://images.openai.com/static-rsc-4/8Qt0e__eTGWQqX4mb9rCxL5b5NKE7Tlx65jzX5BfHCsgIO4Ymngz5ekL8mEAhilABdxkPp5WkFc87nFZ8VE9f_yt_sOIk2wBzGx-DA3NrD43kFBpMPd5e6I2lphB03GrZ7DZZGrD3lNLsmF_d8uIE8pnQMm_ccQs48EZgwvue8roGPpeblQXdCkFfbZvQ2XG?purpose=fullsize" alt="Client"><span class="name">Dave Reed</span></div></div>
    </div>
  </div>
</section>
 
<section class="hp30-certs">
  <div class="container hp30-certs-inner">
    <span class="hp30-certs-label">Licensed, Bonded & Recognized Since 1996</span>
    <div class="hp30-certs-logos">
      <div class="hp30-cert-badge"><span class="ic">✓</span>BBB A+ Rated</div>
      <div class="hp30-cert-badge"><span class="ic">✓</span>Master Plumber Licensed</div>
      <div class="hp30-cert-badge"><span class="ic">✓</span>State Bonded & Insured</div>
      <div class="hp30-cert-badge"><span class="ic">✓</span>4.9★ Google Rated</div>
    </div>
  </div>
</section>
 
<section class="hp30-faq" id="faq">
  <div class="container hp30-faq-inner">
    <div class="hp30-faq-head">
      <div class="hp30-eyebrow" style="justify-content:center;">FAQ</div>
      <h2>Common Questions</h2>
    </div>
    <div class="hp30-faq-list">
      <details class="hp30-faq-item" open>
        <summary>How long have you been in business?</summary>
        <div class="hp30-faq-body faq-body">We opened in 1996 and have been family-owned and operated for 30 years and two generations.</div>
      </details>
      <details class="hp30-faq-item">
        <summary>Do you offer free estimates?</summary>
        <div class="hp30-faq-body faq-body">Yes, we provide free, no-obligation estimates for most jobs before any work begins.</div>
      </details>
      <details class="hp30-faq-item">
        <summary>Are you licensed and insured?</summary>
        <div class="hp30-faq-body faq-body">Yes, all our plumbers are fully licensed, bonded, and insured for your protection.</div>
      </details>
      <details class="hp30-faq-item">
        <summary>Do you offer emergency service?</summary>
        <div class="hp30-faq-body faq-body">Yes, we offer same-day and emergency appointments for urgent plumbing issues.</div>
      </details>
    </div>
  </div>
</section>
 
<section class="hp30-cta" id="contact">
  <div class="container">
    <div class="hp30-cta-card">
      <div class="hp30-cta-content">
        <div class="hp30-eyebrow" style="color: var(--secondary);">Ready To Fix It?</div>
        <h2>Stop waiting. Get your plumbing fixed today.</h2>
        <p>Whether it's an emergency or a planned upgrade, our licensed plumbers are ready to help. Call us directly or request service online.</p>
        <div class="hp30-cta-actions">
          <a href="tel:PHONE_PLACEHOLDER" class="btn btn-primary" style="font-size: 1.1rem; padding: 1.2rem 2.5rem;"><span class="ic">📞</span> PHONE_PLACEHOLDER</a>
          <a href="javascript:void(0);" class="btn btn-ghost-light" style="font-size: 1.1rem; padding: 1.2rem 2.5rem;">Book Service Online</a>
        </div>
      </div>
    </div>
  </div>
</section>
 
<footer class="hp30-footer">
  <div class="container hp30-footer-inner">
    <div>© 2026 PROJECT_NAME_PLACEHOLDER. All Rights Reserved. Proudly serving since 1996.</div>
    <div class="hp30-footer-links">
      <a href="tel:PHONE_PLACEHOLDER">PHONE_PLACEHOLDER</a>
      <a href="mailto:EMAIL_PLACEHOLDER">EMAIL_PLACEHOLDER</a>
    </div>
  </div>
</footer>
 
<script id="core-interactions">
  (function() {
    var isInEditor = !!document.querySelector('[data-gjs-type]') || document.body.classList.contains('gjs-dashed');
    
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
              if (input.value.trim()) { input.style.borderColor = '#22c55e'; if (input.nextElementSibling && input.nextElementSibling.classList.contains('val-error')) input.nextElementSibling.style.display = 'none'; }
              else { input.style.borderColor = '#ef4444'; if (input.nextElementSibling && input.nextElementSibling.classList.contains('val-error')) input.nextElementSibling.style.display = 'block'; }
            });
          }
          if (!input.value.trim() && input.hasAttribute('required')) {
            isValid = false;
            input.style.borderColor = '#ef4444';
            if (!input.nextElementSibling || !input.nextElementSibling.classList.contains('val-error')) {
              var fieldName = input.getAttribute('placeholder') || input.getAttribute('name') || 'This field';
              var err = document.createElement('span');
              err.className = 'val-error'; err.style.color = '#ef4444'; err.style.fontSize = '12px'; err.style.display = 'block'; err.style.marginTop = '4px'; err.style.fontWeight = '500';
              err.textContent = '*' + fieldName.replace(/\*$/, '').trim() + ' is required';
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
            e.target.innerHTML = '<div style="padding: 20px; text-align: center; border: 1px dashed rgba(0,0,0,0.15); border-radius: 10px;"><h3 style="margin: 0 0 10px 0;">Thank You!</h3><p style="margin: 0; opacity: 0.7;">Your request has been submitted successfully.</p></div>';
          }, 1000);
        }
      }
    }, true);
  })();
</script>
`;