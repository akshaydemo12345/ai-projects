export const law07Styles = `
.swiper-button-next:after, .swiper-button-prev:after { font-size: 16px !important; font-weight: bold; }
.swiper-button-next:hover, .swiper-button-prev:hover { background: #fff !important; color: var(--dark) !important; transition: 0.3s; }

@import url('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');

@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@400;500;600;700;800&display=swap');

:root {
  --primary: PRIMARY_COLOR_PLACEHOLDER;
  --secondary: SECONDARY_COLOR_PLACEHOLDER;
  --primary-rgb: PRIMARY_RGB_PLACEHOLDER;
  --secondary-rgb: SECONDARY_RGB_PLACEHOLDER;
  --dark: #14141a;
  --dark-2: #1c1c24;
  --bg-light: #fdfdfd;
  --text-dark: #1a1a1a;
  --text-muted: #6b7280;
  --border-light: #f1f5f9;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: 'Inter', sans-serif;
  color: var(--text-dark);
  background-color: var(--bg-light);
  line-height: 1.6;
  overflow-x: hidden;
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'DM Serif Display', serif;
  font-weight: 400;
  line-height: 1.2;
  color: var(--text-dark);
}

.container { max-width: 1200px; margin: 0 auto; padding: 0 1.5rem; position: relative; z-index: 10; }
img { max-width: 100%; display: block; }
a { text-decoration: none; color: inherit; transition: 0.3s; }
.italic-accent { font-style: italic; color: var(--primary); }

/* Buttons */
.btn { display: inline-flex; flex-wrap: wrap; align-items: center; justify-content: center; padding: 0.9rem 1.9rem; border-radius: 4px; font-weight: 600; font-size: 0.9rem; letter-spacing: 0.3px; transition: all 0.3s ease; cursor: pointer; border: none; }
.btn-primary { background-color: var(--primary); color: #fff; box-shadow: 0 4px 14px rgba(0,0,0,0.15); }
.btn-primary:hover { background-color: var(--secondary); opacity: 0.95; transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.2); }
.btn-outline { background: transparent; color: #fff; border: 1px solid rgba(255,255,255,0.3); }
.btn-outline:hover { background: rgba(255,255,255,0.1); border-color: #fff; }
.btn-white { background: #fff; color: var(--dark); }
.btn-white:hover { background: #f1f1f1; }

.badge { display: inline-flex; flex-wrap: wrap; align-items: center; gap: 0.5rem; color: var(--primary); padding: 0.3rem 0; font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 1rem; }
.badge::before { content: ''; width: 18px; height: 2px; background: var(--primary); display: inline-block; }

/* Header - logo only, no nav, same dark language as footer */
.header { padding: 1.25rem 0; background: var(--dark); position: relative; z-index: 50; }
.header-inner { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; }
.logo { font-size: 1.6rem; font-family: 'DM Serif Display', serif; display: flex; flex-wrap: wrap; align-items: center; gap: 10px; color: #fff; }
.logo svg { width: 30px; height: 30px; color: var(--primary); }
.logo-sub { display: block; font-family: 'Inter', sans-serif; font-size: 0.6rem; letter-spacing: 2px; text-transform: uppercase; color: rgba(255,255,255,0.5); font-weight: 600; }

/* Hero */
.hero { padding: 6rem 0 7rem; background: var(--dark); position: relative; overflow: hidden; }
.hero-bg { position: absolute; top: 0; right: 0; width: 55%; height: 100%; background-size: cover; background-position: center; z-index: 1; }
.hero::after { content: ''; position: absolute; top: 0; right: 0; width: 55%; height: 100%; background: linear-gradient(90deg, var(--dark) 0%, rgba(20,20,26,0.35) 40%, rgba(20,20,26,0.15) 100%); z-index: 2; }
@keyframes heroBgZoom { 0% { transform: scale(1); } 100% { transform: scale(1.12); } }
.hero-inner { position: relative; z-index: 5; }
.hero-content { max-width: 640px; }
.hero-content h1 { font-size: 3.6rem; margin-bottom: 1.5rem; color: #fff; }
.hero-content p { font-size: 1.05rem; color: rgba(255,255,255,0.7); margin-bottom: 2.5rem; max-width: 80%; }
.hero-actions { margin-bottom: 3.5rem; }
.hero-stats { display: flex; flex-wrap: wrap; gap: 3rem; align-items: center; }
.hero-stat h3 { color: #fff; font-family: 'Inter', sans-serif; font-weight: 800; font-size: 2rem; margin-bottom: 0.2rem; }
.hero-stat p { color: rgba(255,255,255,0.55); font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px; }
.hero-brand-mark { position: absolute; right: 4%; bottom: 6%; z-index: 6; font-family: 'DM Serif Display', serif; font-style: italic; font-size: 6.5rem; color: rgba(255,255,255,0.92); text-shadow: 0 10px 40px rgba(0,0,0,0.4); }

/* About / Split */
.split-section { padding: 6.5rem 0; background: #fff; }
.split-inner { display: grid; grid-template-columns: 0.85fr 1.15fr; gap: 4rem; align-items: center; }
.split-visual { position: relative; }
.split-visual img { border-radius: 12px; width: 100%; height: 420px; object-fit: cover; box-shadow: 0 20px 50px rgba(0,0,0,0.12); }
.split-seal { position: absolute; bottom: -30px; left: -30px; width: 90px; height: 90px; background: #fff; border-radius: 50%; box-shadow: 0 10px 30px rgba(0,0,0,0.1); display: flex; align-items: center; justify-content: center; color: var(--primary); border: 2px dashed rgba(var(--primary-rgb),0.3); font-size: 0.6rem; text-align: center; font-weight: 700; text-transform: uppercase; padding: 8px; }
.split-content h2 { font-size: 2.6rem; margin-bottom: 1.5rem; }
.split-content > p { color: var(--text-muted); margin-bottom: 2rem; font-size: 1rem; }
.split-foot { display: flex; flex-wrap: wrap; gap: 2rem; align-items: center; margin-top: 2rem; }
.rating-block { display: flex; flex-wrap: wrap; align-items: center; gap: 1rem; }
.rating-block h3 { font-family: 'Inter', sans-serif; font-weight: 800; font-size: 2rem; }
.stars { color: #f59e0b; font-size: 1rem; letter-spacing: 2px; }
.rating-sub { font-size: 0.8rem; color: var(--text-muted); }

/* Services (dark) */
.services-section { padding: 7rem 0; background: var(--dark); position: relative; overflow: hidden; }
.services-header { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: flex-end; gap: 2rem; margin-bottom: 3.5rem; }
.services-header h2 { color: #fff; font-size: 2.6rem; max-width: 560px; }
.services-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.75rem; margin-bottom: 4rem; }
.service-card { background: var(--dark-2); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 2.25rem; transition: 0.3s; }
.service-card:hover { border-color: var(--primary); transform: translateY(-6px); }
.service-icon { width: 50px; height: 50px; background: rgba(var(--primary-rgb), 0.15); color: var(--primary); border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-bottom: 1.5rem; }
.service-icon svg { width: 24px; height: 24px; }
.service-card h3 { color: #fff; font-size: 1.3rem; margin-bottom: 0.75rem; }
.service-card p { color: rgba(255,255,255,0.55); font-size: 0.9rem; margin-bottom: 1.25rem; }
.service-card .link-primary { color: var(--primary); font-weight: 600; font-size: 0.9rem; }

.trusted-row { display: flex; flex-wrap: wrap; align-items: center; gap: 2.5rem; padding-top: 2.5rem; border-top: 1px solid rgba(255,255,255,0.08); }
.trusted-label { color: rgba(255,255,255,0.4); font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px; }
.trusted-logos { display: flex; flex-wrap: wrap; gap: 2.5rem; align-items: center; opacity: 0.7; }
.trusted-logos span { color: rgba(255,255,255,0.6); font-family: 'DM Serif Display', serif; font-size: 1.1rem; border: 1px solid rgba(255,255,255,0.15); padding: 0.5rem 1rem; border-radius: 6px; }

/* FAQ */
.faq-section { padding: 7rem 0; background: #fdfdfd; }
.faq-inner { display: grid; grid-template-columns: 0.8fr 1.2fr; gap: 4rem; align-items: center; }
.faq-visual { position: relative; border-radius: 16px; overflow: hidden; height: 480px; }
.faq-visual img { width: 100%; height: 100%; object-fit: cover; }
.faq-call-card { position: absolute; left: 1.5rem; bottom: 1.5rem; right: 1.5rem; background: var(--primary); color: #fff; padding: 1.25rem 1.5rem; border-radius: 10px; display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 0.75rem; }
.faq-call-card p { font-size: 0.8rem; opacity: 0.85; }
.faq-call-card h4 { font-family: 'Inter', sans-serif; font-weight: 700; font-size: 1.1rem; }
.faq-content h2 { font-size: 2.6rem; margin-bottom: 2.5rem; }
.faq-item { border-bottom: 1px solid var(--border-light); padding: 1.5rem 0; cursor: pointer; }
.faq-item-head { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 1rem; font-weight: 600; font-size: 1.05rem; list-style: none; }
.faq-item-head::-webkit-details-marker { display: none; }
.faq-toggle { width: 28px; height: 28px; border-radius: 50%; border: 1px solid var(--border-light); display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: 0.3s; color: var(--primary); font-size: 1.1rem; }
.faq-body { color: var(--text-muted); font-size: 0.92rem; margin-top: 1rem; display: none; }
details[open] .faq-body { display: block; animation: fadeDown 0.3s ease forwards; }
details[open] .faq-toggle { background: var(--primary); color: #fff; transform: rotate(45deg); }
@keyframes fadeDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }

/* Metrics / Achievements */
.metrics-section { padding: 7rem 0; background: linear-gradient(120deg, var(--dark) 0%, rgba(var(--primary-rgb),0.55) 140%); position: relative; overflow: hidden; }
.metrics-header { text-align: center; margin-bottom: 4rem; }
.metrics-header h2 { font-size: 2.8rem; color: #fff; font-family: 'DM Serif Display', serif; margin-bottom: 1rem; }
.metrics-header p { color: rgba(255,255,255,0.7); font-size: 1.1rem; max-width: 600px; margin: 0 auto; }
.metrics-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2rem; }
.metric-card { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); padding: 2.5rem 2rem; border-radius: 16px; text-align: center; transition: 0.3s; }
.metric-card:hover { transform: translateY(-5px); background: rgba(255,255,255,0.08); }
.metric-icon { width: 60px; height: 60px; border-radius: 50%; background: rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 1.5rem; margin: 0 auto 1.5rem; }
.metric-number { font-size: 3rem; font-family: 'DM Serif Display', serif; color: var(--primary); font-weight: 700; line-height: 1; margin-bottom: 0.5rem; }
.metric-title { font-size: 1.1rem; font-weight: 600; color: #fff; margin-bottom: 0.5rem; }
.metric-desc { font-size: 0.9rem; color: rgba(255,255,255,0.6); line-height: 1.5; }

/* Case studies */
.cases-section { padding: 7rem 0; background: #fff; }
.cases-header { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: flex-end; gap: 2rem; margin-bottom: 3rem; }
.cases-header h2 { font-size: 2.6rem; max-width: 520px; }
.case-list { display: flex; flex-wrap: wrap; flex-direction: column; }
.case-row { display: flex; flex-wrap: wrap; align-items: center; gap: 1.75rem; padding: 1.75rem 0; border-top: 1px solid var(--border-light); transition: 0.3s; }
.case-row:last-child { border-bottom: 1px solid var(--border-light); }
.case-row:hover { background: #fafafa; padding-left: 0.75rem; }
.case-thumb { width: 80px; height: 80px; border-radius: 10px; overflow: hidden; flex-shrink: 0; }
.case-thumb img { width: 100%; height: 100%; object-fit: cover; }
.case-title { flex: 1; min-width: 220px; font-size: 1.3rem; }
.case-tags { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.case-tag { border: 1px solid var(--border-light); border-radius: 50px; padding: 0.35rem 0.9rem; font-size: 0.75rem; color: var(--text-muted); font-weight: 600; }
.case-arrow { width: 44px; height: 44px; border-radius: 50%; background: var(--dark); color: #fff; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.case-arrow svg { width: 20px; height: 20px; display: block; margin: auto; }

/* CTA / Consultancy */
.cta-section { padding: 7rem 0; background: linear-gradient(135deg, var(--dark) 0%, rgba(var(--primary-rgb),0.5) 150%); position: relative; overflow: hidden; }
.cta-inner { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 4rem; align-items: center; }
.cta-content h2 { color: #fff; font-size: 2.8rem; margin-bottom: 1.5rem; }
.cta-content > p { color: rgba(255,255,255,0.65); margin-bottom: 2.5rem; max-width: 480px; }
.cta-need { border-top: 1px solid rgba(255,255,255,0.15); padding-top: 1.75rem; }
.cta-need h4 { color: #fff; font-family: 'Inter', sans-serif; font-size: 1rem; margin-bottom: 0.75rem; }
.cta-need p { color: rgba(255,255,255,0.6); font-size: 0.9rem; margin-bottom: 1.25rem; }
.cta-need-link { display: flex; flex-wrap: wrap; align-items: center; gap: 1rem; }
.cta-need-link a { color: #fff; font-weight: 600; font-size: 0.9rem; border-bottom: 1px solid rgba(255,255,255,0.3); }
.cta-visual img { border-radius: 16px; height: 420px; width: 100%; object-fit: cover; }
.avatar-group { display: flex; flex-wrap: wrap; }
.avatar-group img, .avatar-group .avatar-more { width: 38px; height: 38px; border-radius: 50%; border: 2px solid var(--dark); margin-left: -12px; object-fit: cover; }
.avatar-group img:first-child { margin-left: 0; }
.avatar-more { background: var(--primary); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; font-weight: 700; }

/* Team */
.team-section { padding: 7rem 0; background: #fdfdfd; }
.team-header { text-align: center; max-width: 650px; margin: 0 auto 3.5rem; }
.team-header h2 { font-size: 2.6rem; }
.team-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.75rem; }
.team-card { position: relative; border-radius: 12px; overflow: hidden; height: 460px; background: var(--dark); transition: transform 0.4s, box-shadow 0.4s; }
.team-card:nth-child(2) { transform: scale(1.03); z-index: 2; box-shadow: 0 20px 40px rgba(0,0,0,0.15); }
.team-card:hover { transform: scale(1.05) !important; z-index: 3; box-shadow: 0 20px 40px rgba(0,0,0,0.25); }
.team-card img { width: 100%; height: 100%; object-fit: cover; opacity: 0.85; transition: 0.4s; }
.team-card:hover img { transform: scale(1.05); opacity: 1; }
.team-badge { position: absolute; top: 1.25rem; left: 1.25rem; background: rgba(0,0,0,0.5); backdrop-filter: blur(6px); color: #fff; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 1px; font-weight: 700; padding: 0.5rem 0.9rem; border-radius: 50px; }
.team-info { position: absolute; left: 0; right: 0; bottom: 0; padding: 1.5rem; background: linear-gradient(to top, rgba(0,0,0,0.85), transparent); }
.team-info h4 { font-family: 'DM Serif Display', serif; color: #fff; font-size: 1.3rem; margin-bottom: 0.25rem; }
.team-info p { color: rgba(255,255,255,0.65); font-size: 0.8rem; margin-bottom: 0.75rem; }
.team-socials { display: flex; flex-wrap: wrap; gap: 0.6rem; }
.team-socials a { width: 30px; height: 30px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.3); color: #fff; display: flex; align-items: center; justify-content: center; }

/* Marquee */
.marquee-section { background: var(--dark); padding: 2.5rem 0; overflow: hidden; border-top: 1px solid rgba(255,255,255,0.06); border-bottom: 1px solid rgba(255,255,255,0.06); }
.marquee-track { display: flex; flex-wrap: nowrap; width: max-content; animation: marquee-scroll 30s linear infinite; }
.marquee-track span { font-family: 'DM Serif Display', serif; font-size: 2.6rem; color: rgba(255,255,255,0.85); white-space: nowrap; padding: 0 1.5rem; }
.marquee-track span.accent { color: var(--primary); font-style: italic; }
@keyframes marquee-scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }

/* Contact form section */
.contact-section { padding: 7rem 0; background: #fff; position: relative; }
.contact-inner { display: grid; grid-template-columns: 0.85fr 1.15fr; gap: 4rem; }
.contact-info h2 { font-size: 2.4rem; margin-bottom: 1.5rem; }
.contact-info > p { color: var(--text-muted); margin-bottom: 2rem; }
.info-item { display: flex; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem; align-items: flex-start; }
.info-icon { width: 42px; height: 42px; border-radius: 50%; background: rgba(var(--primary-rgb),0.1); color: var(--primary); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.info-text h4 { font-family: 'Inter', sans-serif; font-size: 0.95rem; font-weight: 700; margin-bottom: 0.2rem; }
.info-text p { color: var(--text-muted); font-size: 0.88rem; }
.contact-form { background: var(--dark); padding: 3rem; border-radius: 16px; }
.contact-form h3 { color: #fff; font-size: 1.6rem; margin-bottom: 1.75rem; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; margin-bottom: 1.25rem; }
.input-group { display: flex; flex-wrap: wrap; flex-direction: column; gap: 0.5rem; }
.input-group label { font-size: 0.8rem; font-weight: 600; color: rgba(255,255,255,0.7); }
.input-group input, .input-group textarea { padding: 0.875rem 1rem; border: 1px solid rgba(255,255,255,0.15); background: rgba(255,255,255,0.05); border-radius: 6px; font-family: 'Inter', sans-serif; font-size: 0.92rem; outline: none; color: #fff; transition: 0.3s; }
.input-group input::placeholder, .input-group textarea::placeholder { color: rgba(255,255,255,0.35); }
.input-group input:focus, .input-group textarea:focus { border-color: var(--primary); background: rgba(255,255,255,0.08); }
.input-group textarea { resize: vertical; min-height: 110px; }
.form-full { grid-column: 1 / -1; }

/* Footer - same dark language / gradient echoing header */
.footer { background: linear-gradient(135deg, var(--dark) 0%, rgba(var(--primary-rgb),0.45) 160%); padding-top: 5rem; }
.footer-top { display: grid; grid-template-columns: 1.2fr 0.8fr 1fr 1fr; gap: 3rem; padding-bottom: 3.5rem; }
.footer-brand .logo { margin-bottom: 1.25rem; }
.footer-brand p { color: rgba(255,255,255,0.55); font-size: 0.9rem; max-width: 260px; margin-bottom: 1.5rem; }
.footer-socials { display: flex; flex-wrap: wrap; gap: 0.75rem; }
.footer-socials a { width: 36px; height: 36px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.2); color: #fff; display: flex; align-items: center; justify-content: center; }
.footer-col h4 { color: #fff; font-family: 'Inter', sans-serif; font-size: 0.95rem; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 1.5rem; }
.footer-col ul { list-style: none; display: flex; flex-wrap: wrap; flex-direction: column; gap: 0.9rem; }
.footer-col a { color: rgba(255,255,255,0.6); font-size: 0.9rem; }
.footer-col a:hover { color: var(--primary); }
.footer-col p { color: rgba(255,255,255,0.6); font-size: 0.9rem; }
.newsletter-box { display: flex; flex-wrap: wrap; margin-top: 1.25rem; }
.newsletter-box input { flex: 1; min-width: 150px; padding: 0.85rem 1rem; border: 1px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.06); border-radius: 6px 0 0 6px; color: #fff; font-size: 0.85rem; outline: none; }
.newsletter-box input::placeholder { color: rgba(255,255,255,0.4); }
.newsletter-box button { background: var(--primary); border: none; color: #fff; padding: 0 1.25rem; border-radius: 0 6px 6px 0; cursor: pointer; display: flex; align-items: center; justify-content: center; }
.footer-bottom { border-top: 1px solid rgba(255,255,255,0.1); padding: 1.5rem 0; }
.footer-bottom-inner { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 1rem; font-size: 0.85rem; color: rgba(255,255,255,0.5); }
.footer-links { display: flex; flex-wrap: wrap; gap: 1.5rem; }
.footer-links a { color: rgba(255,255,255,0.5); }
.footer-links a:hover { color: var(--primary); }

/* Scroll animations */
body.js-enabled .animate-up { opacity: 0; transform: translateY(40px); transition: opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1); }
body.js-enabled .animate-up.in-view { opacity: 1; transform: translateY(0); }

@media (max-width: 992px) {
  .hero::before, .hero::after { width: 100%; opacity: 0.5; }
  .hero-content { max-width: 100%; }
  .hero-content p { max-width: 100%; }
  .hero-brand-mark { display: none; }
  .split-inner, .faq-inner, .cta-inner, .contact-inner { grid-template-columns: 1fr; gap: 3rem; }
  .services-grid { grid-template-columns: 1fr 1fr; }
  .team-grid { grid-template-columns: 1fr 1fr; }
  .footer-top { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 768px) {
  .testimonial-arrows { position: relative !important; right: auto !important; bottom: auto !important; margin-top: 1rem; margin-bottom: 2rem; justify-content: flex-start; }

  .hero-content h1 { font-size: 2.3rem; }
  .split-content h2, .services-header h2, .faq-content h2, .cases-header h2, .cta-content h2, .team-header h2 { font-size: 2rem; }
  .services-grid, .team-grid, .metrics-grid { grid-template-columns: 1fr; }
  .form-grid { grid-template-columns: 1fr; }
  .footer-top { grid-template-columns: 1fr; }
  .case-row { flex-direction: column; align-items: flex-start; }
  .marquee-track span { font-size: 1.8rem; }
}
`;

export const law07Html = `
<header class="header">
  <div class="container header-inner">
    <a href="javascript:void(0);" class="logo">
      LOGO_PLACEHOLDER
      <span>LOGO_PLACEHOLDER</span>
    </a>
    <a href="javascript:void(0);" class="btn btn-primary">Free Quote</a>
  </div>
</header>

<section class="hero">
  <div class="hero-bg" style="background-image: url('/assets/templates/LawFirm/templates07/hero-image.png');"></div>
  <div class="container hero-inner">
    <div class="hero-content animate-up">
      <h1>Strong legal <span class="italic-accent">solutions for</span> your business.</h1>
      <p>Trusted corporate legal solutions that protect businesses, ensure compliance, and support sustainable growth.</p>
      <div class="hero-actions">
        <a href="javascript:void(0);" class="btn btn-primary">Learn More</a>
      </div>
      <div class="hero-stats">
        <div class="hero-stat">
          <h3>98%</h3>
          <p>Proven Success</p>
        </div>
        <div class="hero-stat">
          <h3>274+</h3>
          <p>Legal Matters</p>
        </div>
      </div>
    </div>
  </div>
  <div class="hero-brand-mark">LOGO_PLACEHOLDER</div>
</section>

<section class="split-section" id="about">
  <div class="container split-inner">
    <div class="split-visual animate-up">
      <img src="/assets/templates/LawFirm/templates07/anatomy-01.png" alt="Gavel">
      <div class="split-seal">Legal Partners Certified</div>
    </div>
    <div class="split-content animate-up" style="transition-delay: 0.15s;">
      <div class="badge">About Firm</div>
      <h2>Strength in law, <span class="italic-accent">strength</span> in results.</h2>
      <p>Your trusted partner in corporate law and business protection. We deliver reliable corporate legal services with a focus on integrity, precision, and long-term success.</p>
      <a href="javascript:void(0);" class="btn btn-primary">Read More</a>
      <div class="split-foot">
        <div class="rating-block">
          <h3>4.92</h3>
          <div>
            <div class="stars">★★★★★</div>
            <div class="rating-sub">Rated on Google</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="services-section" id="services">
  <div class="container">
    <div class="services-header animate-up">
      <h2>Innovative legal <span class="italic-accent">and corporate</span> service solutions.</h2>
      <a href="javascript:void(0);" class="btn btn-primary">All Services</a>
    </div>
    <div class="services-grid animate-up">
      <div class="service-card">
        <div class="service-icon">LOGO_PLACEHOLDER</div>
        <h3>Regulatory Compliance</h3>
        <p>Ensuring full compliance with corporate laws, regulatory bodies, and government regulations.</p>
        <a href="javascript:void(0);" class="link-primary">Learn More →</a>
      </div>
      <div class="service-card">
        <div class="service-icon">LOGO_PLACEHOLDER</div>
        <h3>Corporate Advisory</h3>
        <p>Strategic legal advisory for corporate governance, compliance, and business structuring.</p>
        <a href="javascript:void(0);" class="link-primary">Learn More →</a>
      </div>
      <div class="service-card">
        <div class="service-icon">LOGO_PLACEHOLDER</div>
        <h3>Mergers & Acquisitions</h3>
        <p>Expert handling of mergers, acquisitions, restructuring, and due diligence processes.</p>
        <a href="javascript:void(0);" class="link-primary">Learn More →</a>
      </div>
    </div>
    <div class="trusted-row animate-up">
      <span class="trusted-label">Trusted by top enterprises</span>
      <div class="trusted-logos">
        <span>Law & Order</span>
        <span>Law & Justice</span>
        <span>Law & Firm</span>
        <span>Law & Order</span>
      </div>
    </div>
  </div>
</section>

<section class="faq-section">
  <div class="container faq-inner">
    <div class="faq-visual animate-up">
      <img src="/assets/templates/LawFirm/templates07/anatomy-02.png" alt="Consultation room">
      <div class="faq-call-card">
        <div>
          <p>Call Today!</p>
          <h4>PHONE_PLACEHOLDER</h4>
        </div>
        <div class="info-icon" style="background: rgba(255,255,255,0.2); color: #fff;">
          LOGO_PLACEHOLDER
        </div>
      </div>
    </div>
    <div class="faq-content animate-up" style="transition-delay: 0.15s;">
      <div class="badge">FAQ</div>
      <h2>Answers to <span class="italic-accent">your</span> legal concerns.</h2>

      <details class="faq-item" open>
        <summary class="faq-item-head"><span>How can your law firm assist with corporate legal matters?</span><span class="faq-toggle">+</span></summary>
        <div class="faq-body">We provide comprehensive corporate legal services covering every stage of your business lifecycle, including company formation, contracts, and regulatory compliance.</div>
      </details>
      <details class="faq-item">
        <summary class="faq-item-head"><span>Which industries do you provide legal services for?</span><span class="faq-toggle">+</span></summary>
        <div class="faq-body">We support clients across finance, real estate, healthcare, technology, and manufacturing sectors, among others.</div>
      </details>
      <details class="faq-item">
        <summary class="faq-item-head"><span>Why is legal compliance important for businesses?</span><span class="faq-toggle">+</span></summary>
        <div class="faq-body">Compliance protects your business from regulatory penalties, disputes, and reputational risk while enabling sustainable growth.</div>
      </details>
      <details class="faq-item">
        <summary class="faq-item-head"><span>Do you help startups with legal setup and registration?</span><span class="faq-toggle">+</span></summary>
        <div class="faq-body">Yes, we guide startups through entity formation, founder agreements, IP protection, and early-stage compliance.</div>
      </details>
      <details class="faq-item">
        <summary class="faq-item-head"><span>How can I schedule a consultation with your legal team?</span><span class="faq-toggle">+</span></summary>
        <div class="faq-body">Simply reach out via our contact form or call our office directly to book a consultation at a time that works for you.</div>
      </details>
    </div>
  </div>
</section>

<section class="metrics-section">
  <div class="container animate-up">
    <div class="metrics-header">
      <h2>A Legacy of Excellence</h2>
      <p>Decades of committed legal service yielding unparalleled results and steadfast trust.</p>
    </div>
    
    <div class="metrics-grid">
      <div class="metric-card">
        <div class="metric-icon"><i class="fa-solid fa-scale-balanced"></i></div>
        <div class="metric-number">35+</div>
        <div class="metric-title">Years of Experience</div>
        <div class="metric-desc">Providing expert legal counsel for over three decades.</div>
      </div>
      
      <div class="metric-card">
        <div class="metric-icon"><i class="fa-solid fa-trophy"></i></div>
        <div class="metric-number">98%</div>
        <div class="metric-title">Success Rate</div>
        <div class="metric-desc">Consistent track record of winning complex cases.</div>
      </div>

      <div class="metric-card">
        <div class="metric-icon"><i class="fa-solid fa-users"></i></div>
        <div class="metric-number">15k+</div>
        <div class="metric-title">Happy Clients</div>
        <div class="metric-desc">Protecting the rights and businesses of thousands.</div>
      </div>

      <div class="metric-card">
        <div class="metric-icon"><i class="fa-solid fa-award"></i></div>
        <div class="metric-number">24/7</div>
        <div class="metric-title">Award-Winning Firm</div>
        <div class="metric-desc">Recognized nationally for legal excellence and ethics.</div>
      </div>
    </div>
  </div>
</section>

<section class="cases-section" id="cases">
  <div class="container">
    <div class="cases-header animate-up">
      <h2>Legal solutions for <span class="italic-accent">business</span> growth.</h2>
      <a href="javascript:void(0);" class="btn btn-primary">All Cases</a>
    </div>
    <div class="case-list animate-up">
      <div class="case-row">
        <div class="case-thumb"><img src="/assets/templates/LawFirm/templates07/legal-01.png" alt="Case"></div>
        <div class="case-title">Regulatory Compliance Advisory</div>
        <div class="case-tags"><span class="case-tag">Corporate</span><span class="case-tag">2026</span></div>
        <div class="case-arrow">LOGO_PLACEHOLDER</div>
      </div>
      <div class="case-row">
        <div class="case-thumb"><img src="/assets/templates/LawFirm/templates07/legal-02.png" alt="Case"></div>
        <div class="case-title">White Collar Criminal Defense Strategy</div>
        <div class="case-tags"><span class="case-tag">Criminal</span><span class="case-tag">2026</span></div>
        <div class="case-arrow">LOGO_PLACEHOLDER</div>
      </div>
      <div class="case-row">
        <div class="case-thumb"><img src="/assets/templates/LawFirm/templates07/legal-03.png" alt="Case"></div>
        <div class="case-title">Commercial Dispute Arbitration Resolution</div>
        <div class="case-tags"><span class="case-tag">Litigation</span><span class="case-tag">2026</span></div>
        <div class="case-arrow">LOGO_PLACEHOLDER</div>
      </div>
      <div class="case-row">
        <div class="case-thumb"><img src="/assets/templates/LawFirm/templates07/legal-04.png" alt="Case"></div>
        <div class="case-title">Commercial Contract Structuring Review</div>
        <div class="case-tags"><span class="case-tag">Commercial</span><span class="case-tag">2026</span></div>
        <div class="case-arrow">LOGO_PLACEHOLDER</div>
      </div>
    </div>
  </div>
</section>

<section class="cta-section">
  <div class="container cta-inner">
    <div class="cta-content animate-up">
      <div class="badge">What We Are Expert</div>
      <h2>We are here for <span class="italic-accent">expert</span> legal consultancy.</h2>
      <p>Our experienced legal professionals provide strategic guidance to help businesses manage risk, ensure compliance, and make confident decisions.</p>
      <div class="cta-need">
        <h4>Do you need legal assistance?</h4>
        <p>Connect with our legal team via phone or live consultation to get clear answers to your queries.</p>
        <div class="cta-need-link">
          <div class="avatar-group">
            <img src="/assets/templates/LawFirm/templates07/review-03.png" alt="Expert">
            <img src="/assets/templates/LawFirm/templates07/review-01.png" alt="Expert">
          </div>
          <a href="javascript:void(0);">Trusted legal insights from experts →</a>
        </div>
      </div>
    </div>
    <div class="cta-visual animate-up" style="transition-delay: 0.15s;">
      <img src="/assets/templates/LawFirm/templates07/anatomy-03.png" alt="Statue of justice">
    </div>
  </div>
</section>

<section class="team-section" id="team">
  <div class="container">
    <div class="team-header animate-up">
      <div class="badge" style="justify-content: center;">Meet The Attorneys</div>
      <h2>Trusted <span class="italic-accent">legal experts</span> worldwide.</h2>
    </div>
    <div class="team-grid animate-up">
      <div class="team-card">
        <span class="team-badge">Global Law</span>
        <img src="/assets/templates/LawFirm/templates07/anatomy-01.png" alt="Attorney">
        <div class="team-info">
          <h4>Sarah Bennett</h4>
          <p>Senior Corporate Attorney</p>
        </div>
      </div>
      <div class="team-card">
        <span class="team-badge">Legal Partners</span>
        <img src="/assets/templates/LawFirm/templates07/anatomy-02.png" alt="Attorney">
        <div class="team-info">
          <h4>James Carter</h4>
          <p>Litigation Specialist</p>
        </div>
      </div>
      <div class="team-card">
        <span class="team-badge">International Law</span>
        <img src="/assets/templates/LawFirm/templates07/anatomy-04.png" alt="Attorney">
        <div class="team-info">
          <h4>Mia Wong</h4>
          <p>Senior Legal Advisor</p>
          <div class="team-socials">
            <a href="javascript:void(0);">f</a>
            <a href="javascript:void(0);">x</a>
            <a href="javascript:void(0);">in</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="marquee-section">
  <div class="marquee-track">
    <span>Corporate Law</span><span class="accent">*</span><span>Family Law</span><span class="accent">*</span><span>Probate Law</span><span class="accent">*</span><span>Criminal Defense</span><span class="accent">*</span>
    <span>Corporate Law</span><span class="accent">*</span><span>Family Law</span><span class="accent">*</span><span>Probate Law</span><span class="accent">*</span><span>Criminal Defense</span><span class="accent">*</span>
  </div>
</section>

<section class="contact-section" id="contact">
  <div class="container contact-inner">
    <div class="contact-info animate-up">
      <div class="badge">Get In Touch</div>
      <h2>Come & be a part of our firm family, take your time.</h2>
      <p>We are here to help. Reach out to schedule a consultation with our experts.</p>

      <div class="info-item">
        <div class="info-icon">LOGO_PLACEHOLDER</div>
        <div class="info-text"><h4>Our Location</h4><p>ADDRESS_PLACEHOLDER</p></div>
      </div>
      <div class="info-item">
        <div class="info-icon">LOGO_PLACEHOLDER</div>
        <div class="info-text"><h4>Phone Number</h4><p>PHONE_PLACEHOLDER</p></div>
      </div>
      <div class="info-item">
        <div class="info-icon">LOGO_PLACEHOLDER</div>
        <div class="info-text"><h4>Email Address</h4><p>EMAIL_PLACEHOLDER</p></div>
      </div>
    </div>

    <div class="contact-form-wrap animate-up" style="transition-delay: 0.15s;">
      <form class="contact-form lead-capture-form">
        <h3>Request A Free Consultation</h3>
        <div class="form-grid">
          <div class="input-group">
            <label>First Name</label>
            <input type="text" name="firstName" placeholder="John" required>
          </div>
          <div class="input-group">
            <label>Last Name</label>
            <input type="text" name="lastName" placeholder="Doe" required>
          </div>
          <div class="input-group">
            <label>Email Address</label>
            <input type="email" name="email" placeholder="john@example.com" required>
          </div>
          <div class="input-group">
            <label>Phone Number</label>
            <input type="tel" name="phone" placeholder="(555) 123-4567" required>
          </div>
          <div class="input-group form-full">
            <label>Case Details</label>
            <textarea name="notes" placeholder="Tell us briefly about your situation..." required></textarea>
          </div>
        </div>
        <button type="submit" class="btn btn-primary" style="width: 100%;">Send Message</button>
      </form>
    </div>
  </div>
</section>

<footer class="footer">
  <div class="container footer-top">
    <div class="footer-brand">
      <a href="javascript:void(0);" class="logo">
        LOGO_PLACEHOLDER
        LOGO_PLACEHOLDER
      </a>
      <p>Trusted corporate legal solutions that protect businesses, ensure compliance, and support sustainable growth.</p>
      <div class="footer-socials">
        <a href="javascript:void(0);">f</a>
        <a href="javascript:void(0);">x</a>
        <a href="javascript:void(0);">in</a>
      </div>
    </div>
    <div class="footer-col">
      <h4>Quick Links</h4>
      <ul>
        <li><a href="javascript:void(0);">About Us</a></li>
        <li><a href="javascript:void(0);">Services</a></li>
        <li><a href="javascript:void(0);">Case Studies</a></li>
        <li><a href="javascript:void(0);">Attorneys</a></li>
        <li><a href="javascript:void(0);">Contact</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h4>Services</h4>
      <ul>
        <li><a href="javascript:void(0);">SERVICES_PLACEHOLDER</a></li>
        <li><a href="javascript:void(0);">Corporate Advisory</a></li>
        <li><a href="javascript:void(0);">Mergers & Acquisitions</a></li>
        <li><a href="javascript:void(0);">Regulatory Compliance</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h4>Get Legal Updates</h4>
      <p>Corporate compliance & legal advisory insights, straight to your inbox.</p>
      <form class="newsletter-box lead-capture-form">
        <input type="email" name="email" placeholder="Your email address" required>
        <button type="submit">LOGO_PLACEHOLDER</button>
      </form>
    </div>
  </div>

  <div class="footer-bottom">
    <div class="container footer-bottom-inner">
      <div class="copyright">© 2026 LOGO_PLACEHOLDER. All Rights Reserved.</div>
      <div class="footer-links">
        <a href="javascript:void(0);">Privacy Policy</a>
        <a href="javascript:void(0);">Terms of Service</a>
        <a href="javascript:void(0);">Disclaimer</a>
      </div>
    </div>
  </div>
</footer>

<script id="core-interactions">
  (function() {
    var isInEditor = !!document.querySelector('[data-gjs-type]') || document.body.classList.contains('gjs-dashed');

    // Only init intersection observer in preview/live to avoid breaking GrapesJS drag-and-drop
    if (!isInEditor) {
      document.body.classList.add('js-enabled');

      // Scroll reveal
      var revealEls = document.querySelectorAll('.animate-up');
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

    // Form Validation
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
              } else {
                input.style.borderColor = '#ef4444';
              }
            });
          }
          if (!input.value.trim()) {
            isValid = false;
            input.style.borderColor = '#ef4444';
          }
        });

        if (isValid) {
          var btn = e.target.querySelector('button[type="submit"]');
          if (btn) {
            var originalText = btn.innerHTML;
            btn.innerHTML = 'Sending...';
            btn.style.opacity = '0.7';
            setTimeout(function() {
              btn.innerHTML = 'Sent Successfully!';
              btn.style.backgroundColor = '#22c55e';
              btn.style.borderColor = '#22c55e';
              btn.style.opacity = '1';
              e.target.reset();
              setTimeout(function() {
                btn.innerHTML = originalText;
                btn.style.backgroundColor = '';
                btn.style.borderColor = '';
                inputs.forEach(function(i) { i.style.borderColor = ''; });
              }, 3000);
            }, 1500);
          }
        }
      }
    });
  })();
</script>
`;