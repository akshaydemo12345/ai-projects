export const plumber05Styles = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Inter:wght@400;500;600;700&display=swap');

:root {
  --primary: PRIMARY_COLOR_PLACEHOLDER;
  --secondary: SECONDARY_COLOR_PLACEHOLDER;
  --primary-rgb: PRIMARY_RGB_PLACEHOLDER;
  --secondary-rgb: SECONDARY_RGB_PLACEHOLDER;
  --text-dark: #0f172a;
  --text-body: #475569;
  --bg-light: #f8fafc;
  --bg-white: #ffffff;
  --border: #e2e8f0;
  --accent: #ef4444;
}

/* GrapesJS Editor Override */
body, .gjs-dashed, [data-gjs-type="wrapper"], main {
    background-color: var(--bg-white) !important;
    color: var(--text-body) !important;
}
h1, h2, h3, h4, h5, h6, p, span, div, a {
    color: inherit;
}


* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Inter', sans-serif; color: var(--text-body); background: var(--bg-white); line-height: 1.6; overflow-x: hidden; }
h1, h2, h3, h4, h5, h6 { font-family: 'Outfit', sans-serif; color: var(--text-dark); line-height: 1.2; font-weight: 700; }
a { text-decoration: none; color: inherit; transition: 0.3s ease; }
img { max-width: 100%; display: block; }
.container { max-width: 1280px; margin: 0 auto; padding: 0 1.5rem; position: relative; z-index: 2; }
.section { padding: 6rem 0; }
.section-light { background: var(--bg-light); }
.section-dark { background: var(--text-dark); color: #fff; }
.section-dark h2, .section-dark h3, .section-dark p { color: #fff; }

.btn { display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 1rem 2rem; font-weight: 700; font-family: 'Outfit', sans-serif; font-size: 1.1rem; border-radius: 12px; cursor: pointer; transition: all 0.3s ease; border: none; }
.btn-primary { background: var(--primary); color: #fff; box-shadow: 0 10px 25px -5px rgba(var(--primary-rgb), 0.4); }
.btn-primary:hover { transform: translateY(-3px); box-shadow: 0 15px 30px -5px rgba(var(--primary-rgb), 0.6); filter: brightness(1.1); }
.btn-accent { background: var(--accent); color: #fff; box-shadow: 0 10px 25px -5px rgba(239,68,68, 0.4); }
.btn-accent:hover { transform: translateY(-3px); box-shadow: 0 15px 30px -5px rgba(239,68,68, 0.6); }

/* 1. Header */
.header { position: sticky; top: 0; background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px); z-index: 100; border-bottom: 1px solid var(--border); padding: 1rem 0; }
.header-inner { display: flex; justify-content: space-between; align-items: center; }
.logo { display: flex; align-items: center; gap: 0.75rem; font-family: 'Outfit', sans-serif; font-size: 1.75rem; font-weight: 900; color: var(--text-dark); letter-spacing: -0.5px; }
.logo svg { width: 36px; height: 36px; color: var(--primary); }
.header-right { display: flex; align-items: center; gap: 2rem; }
.header-call { display: flex; align-items: center; gap: 1rem; }
.header-call .icon { width: 44px; height: 44px; background: rgba(var(--primary-rgb), 0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--primary); }
.header-call .info span { display: block; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; color: var(--accent); letter-spacing: 1px; }
.header-call .info strong { display: block; font-size: 1.25rem; font-family: 'Outfit', sans-serif; color: var(--text-dark); }

/* 2. Hero Section with Form */
.hero { position: relative; padding: 4rem 0 6rem; background: var(--text-dark); overflow: hidden; }
.hero::before { content: ''; position: absolute; inset: 0; background: url('/assets/templates/plumber/templates01/hero-background.jpg') center/cover; opacity: 0.2; }
.hero::after { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(15,23,42,0.95) 0%, rgba(var(--primary-rgb), 0.8) 100%); }
.hero-inner { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 4rem; align-items: center; }
.hero-content h1 { font-size: 4rem; color: #fff; margin-bottom: 1.5rem; letter-spacing: -1px; }
.hero-content h1 span { color: #38bdf8; display: block; }
.hero-content p { font-size: 1.25rem; color: rgba(255,255,255,0.8); margin-bottom: 2rem; max-width: 500px; }
.hero-features { display: flex; flex-direction: column; gap: 1rem; margin-bottom: 3rem; }
.hero-feat { display: flex; align-items: center; gap: 1rem; color: #fff; font-size: 1.1rem; font-weight: 500; }
.hero-feat svg { color: #10b981; width: 24px; height: 24px; }

.hero-form-box { background: #fff; border-radius: 24px; padding: 3rem 2.5rem; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); position: relative; z-index: 10; }
.hero-form-box h3 { font-size: 1.75rem; margin-bottom: 0.5rem; text-align: center; }
.hero-form-box > p { text-align: center; color: var(--text-body); margin-bottom: 2rem; font-size: 0.95rem; }
.form-group { margin-bottom: 1.25rem; }
.form-group label { display: block; font-size: 0.85rem; font-weight: 600; color: var(--text-dark); margin-bottom: 0.5rem; }
.form-group input, .form-group select { width: 100%; padding: 1rem 1.25rem; border: 1px solid var(--border); border-radius: 12px; font-family: inherit; font-size: 1rem; outline: none; background: #f8fafc; transition: 0.3s; }
.form-group input:focus, .form-group select:focus { border-color: var(--primary); background: #fff; box-shadow: 0 0 0 4px rgba(var(--primary-rgb), 0.1); }
.hero-form-box button { width: 100%; margin-top: 1rem; font-size: 1.2rem; padding: 1.25rem; border-radius: 12px; }

/* 3. Trust Bar */
.trust-bar { padding: 2rem 0; background: #fff; border-bottom: 1px solid var(--border); }
.trust-inner { display: flex; justify-content: space-around; align-items: center; flex-wrap: wrap; gap: 2rem; }
.trust-item { display: flex; align-items: center; gap: 1rem; font-family: 'Outfit', sans-serif; font-weight: 700; font-size: 1.2rem; color: var(--text-dark); }
.trust-item svg { width: 32px; height: 32px; color: var(--primary); }

/* 4. Core Services */
.section-header { text-align: center; max-width: 700px; margin: 0 auto 4rem; }
.section-header .tag { display: inline-block; background: rgba(var(--primary-rgb), 0.1); color: var(--primary); padding: 0.5rem 1.25rem; border-radius: 50px; font-weight: 700; font-size: 0.85rem; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 1rem; }
.section-header h2 { font-size: 3rem; margin-bottom: 1rem; letter-spacing: -0.5px; }
.section-header p { font-size: 1.15rem; color: var(--text-body); }

.services-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }
.srv-card { background: #fff; border-radius: 24px; padding: 3rem 2rem; border: 1px solid var(--border); transition: 0.4s ease; text-align: center; overflow: hidden; position: relative; }
.srv-card:hover { transform: translateY(-10px); box-shadow: 0 25px 50px -12px rgba(0,0,0,0.1); border-color: var(--primary); }
.srv-icon { width: 80px; height: 80px; background: var(--bg-light); border-radius: 20px; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; transition: 0.4s; }
.srv-card:hover .srv-icon { background: var(--primary); color: #fff; transform: scale(1.1); }
.srv-icon svg { width: 40px; height: 40px; color: var(--primary); }
.srv-card:hover .srv-icon svg { color: #fff; }
.srv-card h3 { font-size: 1.5rem; margin-bottom: 1rem; }
.srv-card p { color: var(--text-body); margin-bottom: 1.5rem; }
.srv-link { font-weight: 700; color: var(--primary); display: inline-flex; align-items: center; gap: 0.5rem; }

/* 5. 30 Years Experience */
.exp-section { padding: 8rem 0; overflow: hidden; }
.exp-inner { display: grid; grid-template-columns: 1fr 1fr; gap: 5rem; align-items: center; }
.exp-images { position: relative; }
.exp-img-main { border-radius: 30px; box-shadow: 0 30px 60px rgba(0,0,0,0.15); }
.exp-badge { position: absolute; bottom: -30px; right: -30px; background: var(--primary); color: #fff; width: 180px; height: 180px; border-radius: 50%; display: flex; flex-direction: column; align-items: center; justify-content: center; border: 8px solid #fff; box-shadow: 0 20px 40px rgba(var(--primary-rgb), 0.3); }
.exp-badge span { font-family: 'Outfit', sans-serif; font-size: 4rem; font-weight: 900; line-height: 1; }
.exp-badge p { font-size: 0.85rem; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; }
.exp-content h2 { font-size: 3rem; margin-bottom: 1.5rem; }
.exp-content p { font-size: 1.1rem; margin-bottom: 2rem; }
.exp-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; border-top: 1px solid var(--border); padding-top: 2rem; }
.stat-item h4 { font-size: 2.5rem; color: var(--primary); margin-bottom: 0.25rem; }
.stat-item p { font-weight: 600; color: var(--text-dark); }

/* 6. Emergency Banner */
.emergency-banner { background: var(--accent); padding: 5rem 0; position: relative; overflow: hidden; }
.emergency-banner::after { content: ''; position: absolute; right: -5%; top: -50%; width: 500px; height: 500px; background: radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%); }
.eb-inner { display: flex; justify-content: space-between; align-items: center; position: relative; z-index: 2; }
.eb-text h2 { color: #fff; font-size: 3.5rem; margin-bottom: 0.5rem; }
.eb-text p { color: rgba(255,255,255,0.9); font-size: 1.25rem; }
.eb-btn { background: #fff; color: var(--accent); font-size: 1.25rem; padding: 1.25rem 2.5rem; border-radius: 16px; box-shadow: 0 20px 40px rgba(0,0,0,0.2); }
.eb-btn:hover { background: var(--text-dark); color: #fff; }

/* 7. Process */
.process-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2rem; position: relative; }
.process-step { text-align: center; position: relative; z-index: 2; }
.ps-num { width: 80px; height: 80px; background: #fff; border: 2px solid var(--border); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-family: 'Outfit', sans-serif; font-size: 2rem; font-weight: 800; color: var(--primary); margin: 0 auto 1.5rem; box-shadow: 0 10px 20px rgba(0,0,0,0.05); transition: 0.3s; }
.process-step:hover .ps-num { background: var(--primary); color: #fff; border-color: var(--primary); transform: scale(1.1); }
.process-step h4 { font-size: 1.25rem; margin-bottom: 1rem; }
.process-step p { font-size: 0.95rem; }
.process-grid::before { content: ''; position: absolute; top: 40px; left: 10%; right: 10%; height: 2px; background: dashed 2px var(--border); z-index: 1; }

/* 8. Before After Gallery */
.gallery-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 2rem; }
.gal-card { border-radius: 24px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.1); position: relative; }
.gal-images { display: grid; grid-template-columns: 1fr 1fr; }
.gal-images img { width: 100%; height: 300px; object-fit: cover; }
.gal-label { position: absolute; top: 1.5rem; background: rgba(0,0,0,0.7); color: #fff; padding: 0.5rem 1rem; border-radius: 8px; font-weight: 700; font-size: 0.85rem; letter-spacing: 1px; text-transform: uppercase; backdrop-filter: blur(5px); }
.gal-label.before { left: 1.5rem; }
.gal-label.after { right: 1.5rem; background: var(--primary); }
.gal-info { background: #fff; padding: 1.5rem; text-align: center; }
.gal-info h4 { font-size: 1.25rem; }

/* 9. Why Choose Us (Checkmarks) */
.why-section { padding: 6rem 0; }
.why-inner { display: grid; grid-template-columns: 1fr 1.2fr; gap: 4rem; align-items: center; }
.why-img { border-radius: 30px; box-shadow: 0 30px 60px rgba(0,0,0,0.15); }
.why-list { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-top: 3rem; }
.why-item { display: flex; gap: 1rem; }
.why-item svg { width: 28px; height: 28px; color: #10b981; flex-shrink: 0; }
.why-item h4 { font-size: 1.15rem; margin-bottom: 0.5rem; }

/* 10. Testimonials */
.testi-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }
.testi-card { background: #fff; padding: 3rem 2rem; border-radius: 24px; box-shadow: 0 15px 35px rgba(0,0,0,0.05); position: relative; border: 1px solid var(--border); }
.t-quote-icon { position: absolute; top: 2rem; right: 2rem; color: rgba(var(--primary-rgb), 0.1); width: 60px; height: 60px; }
.t-stars { color: #f59e0b; display: flex; gap: 0.25rem; margin-bottom: 1.5rem; }
.t-stars svg { width: 20px; height: 20px; fill: currentColor; }
.testi-card p { font-size: 1.1rem; color: var(--text-dark); line-height: 1.7; margin-bottom: 2rem; font-style: italic; }
.t-author { display: flex; align-items: center; gap: 1rem; }
.t-author img { width: 56px; height: 56px; border-radius: 50%; object-fit: cover; }
.t-author h5 { font-size: 1.1rem; margin-bottom: 0.25rem; }
.t-author span { font-size: 0.85rem; color: var(--text-body); }

/* 11. FAQ */
.faq-wrap { max-width: 800px; margin: 0 auto; }
.faq-item { background: #fff; border: 1px solid var(--border); border-radius: 16px; margin-bottom: 1rem; overflow: hidden; transition: 0.3s; }
.faq-item:hover { border-color: var(--primary); box-shadow: 0 10px 20px rgba(0,0,0,0.05); }
.faq-item summary { padding: 1.5rem 2rem; display: flex; justify-content: space-between; align-items: center; font-size: 1.25rem; font-weight: 700; color: var(--text-dark); cursor: pointer; list-style: none; }
.faq-item summary::-webkit-details-marker { display: none; }
.faq-item summary svg { color: var(--primary); transition: 0.3s; }
.faq-item[open] summary svg { transform: rotate(180deg); }
.faq-body { padding: 0 2rem 1.5rem 2rem; color: var(--text-body); font-size: 1.05rem; }

/* 12. Footer / Final CTA */
.footer { background: var(--text-dark); color: rgba(255,255,255,0.7); padding: 5rem 0 2rem; }
.footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 4rem; margin-bottom: 4rem; }
.f-about h3 { font-size: 2rem; color: #fff; margin-bottom: 1rem; }
.f-about p { margin-bottom: 2rem; max-width: 400px; }
.f-socials { display: flex; gap: 1rem; }
.f-socials a { width: 44px; height: 44px; background: rgba(255,255,255,0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; }
.f-socials a:hover { background: var(--primary); }
.f-links h4 { color: #fff; font-size: 1.25rem; margin-bottom: 1.5rem; }
.f-links ul { list-style: none; }
.f-links li { margin-bottom: 0.75rem; }
.f-links a:hover { color: var(--primary); }
.footer-bottom { border-top: 1px solid rgba(255,255,255,0.1); padding-top: 2rem; text-align: center; font-size: 0.9rem; }

@media (max-width: 1024px) {
  .hero-inner, .exp-inner, .why-inner { grid-template-columns: 1fr; text-align: center; }
  .hero-content p, .section-header { margin-left: auto; margin-right: auto; }
  .hero-features { align-items: center; }
  .services-grid, .gallery-grid, .testi-grid, .footer-grid { grid-template-columns: 1fr 1fr; }
  .process-grid::before { display: none; }
  .eb-inner { flex-direction: column; text-align: center; gap: 2rem; }
}
@media (max-width: 768px) {
  .header-right { display: none; }
  .hero-content h1 { font-size: 3rem; }
  .services-grid, .gallery-grid, .testi-grid, .footer-grid, .process-grid, .why-list { grid-template-columns: 1fr; }
  .exp-badge { width: 120px; height: 120px; bottom: -15px; right: -15px; }
  .exp-badge span { font-size: 2.5rem; }
}
@media (max-width: 768px) {
  .hero-inner, .services-grid, .process-grid, .gallery-grid, .why-inner, .testi-grid { grid-template-columns: 1fr !important; }
  .header-inner, .header-right, .header-call, .hero-feat, .trust-inner { flex-direction: column !important; }
}

`;

export const plumber05Html = `
<header class="header">
  <div class="container header-inner">
    <a data-editable="true" href="javascript:void(0);" class="logo">
      LOGO_PLACEHOLDER
    </a>
    <div class="header-right">
      <div class="header-call">
        <div class="icon"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg></div>
        <div class="info">
          <span data-editable="true">24/7 Emergency Service</span>
          <strong data-editable="true">PHONE_PLACEHOLDER</strong>
        </div>
      </div>
    </div>
  </div>
</header>

<section class="hero">
  <div class="container hero-inner">
    <div class="hero-content">
      <h1 data-editable="true">Premium Plumbing <span data-editable="true">Done Right.</span></h1>
      <p data-editable="true">Experience the ultimate peace of mind. With 30 years of expertise, we deliver fast, flawless plumbing solutions for your luxury home or business.</p>
      
      <div class="hero-features">
        <div class="hero-feat"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> <span data-editable="true">60-Minute Emergency Response Guarantee</span></div>
        <div class="hero-feat"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> <span data-editable="true">Fully Licensed, Bonded & Insured Professionals</span></div>
        <div class="hero-feat"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> <span data-editable="true">Upfront Transparent Pricing, No Surprises</span></div>
      </div>
    </div>
    
    <div class="hero-form-box">
      <h3 data-editable="true">Request Priority Service</h3>
      <p data-editable="true">Fill out the form below and our dispatch team will contact you within 5 minutes.</p>
      <form class="lead-capture-form">
        <div class="form-group">
          <label data-editable="true">Full Name</label>
          <input type="text" name="name" placeholder="John Doe" required>
        </div>
        <div class="form-group">
          <label data-editable="true">Phone Number</label>
          <input type="tel" name="phone" placeholder="(555) 123-4567" required>
        </div>
        <div class="form-group">
          <label data-editable="true">Service Needed</label>
          <select name="service" required>
            <option value="">Select Service...</option>
            <option value="leak">Emergency Leak</option>
            <option value="drain">Drain Cleaning</option>
            <option value="heater">Water Heater</option>
            <option value="other">Other Plumbing Issue</option>
          </select>
        </div>
        <button type="submit" class="btn btn-primary" data-editable="true">Book My Service Now</button>
      </form>
    </div>
  </div>
</section>

<section class="trust-bar">
  <div class="container trust-inner">
    <div class="trust-item"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg> <span data-editable="true">Top Rated Plumber 2026</span></div>
    <div class="trust-item"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg> <span data-editable="true">Certified Master Plumbers</span></div>
    <div class="trust-item"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg> <span data-editable="true">100% Satisfaction Guarantee</span></div>
  </div>
</section>

<section class="section section-light">
  <div class="container">
    <div class="section-header">
      <span class="tag" data-editable="true">Our Premium Services</span>
      <h2 data-editable="true">Master Craftsmanship for Every Plumbing Need</h2>
      <p data-editable="true">We provide a comprehensive suite of high-end plumbing services designed to protect and enhance your property.</p>
    </div>
    
    <div class="services-grid">
      <div class="srv-card">
        <div class="srv-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c4-4 8-8.5 8-13a8 8 0 0 0-16 0c0 4.5 4 9 8 13z"></path></svg></div>
        <h3 data-editable="true">Advanced Leak Detection</h3>
        <p data-editable="true">Non-invasive thermal and acoustic technology to pinpoint hidden leaks without destroying your walls or floors.</p>
        <a data-editable="true" href="javascript:void(0);" class="srv-link">Learn More <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></a>
      </div>
      <div class="srv-card">
        <div class="srv-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M8 12h8M12 8v8"></path></svg></div>
        <h3 data-editable="true">Hydro-Jet Drain Clearing</h3>
        <p data-editable="true">High-pressure water jetting that doesn't just poke a hole in the clog, but completely scrubs your pipes clean.</p>
        <a data-editable="true" href="javascript:void(0);" class="srv-link">Learn More <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></a>
      </div>
      <div class="srv-card">
        <div class="srv-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="8" width="18" height="12" rx="2"></rect><path d="M7 8V6a5 5 0 0 1 10 0v2"></path></svg></div>
        <h3 data-editable="true">Tankless Water Heaters</h3>
        <p data-editable="true">Premium installation of endless hot water systems that save energy and space in your luxury home.</p>
        <a data-editable="true" href="javascript:void(0);" class="srv-link">Learn More <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></a>
      </div>
    </div>
  </div>
</section>

<section class="exp-section">
  <div class="container exp-inner">
    <div class="exp-images">
      <img src="/assets/templates/plumber/templates01/plumber.jpg" alt="Master Plumber" class="exp-img-main" data-editable-img="true">
      <div class="exp-badge">
        <span data-editable="true">30</span>
        <p data-editable="true">Years Exp</p>
      </div>
    </div>
    <div class="exp-content">
      <span class="tag" data-editable="true" style="display:inline-block; background:rgba(var(--primary-rgb),0.1); color:var(--primary); padding:0.5rem 1rem; border-radius:50px; font-weight:700; margin-bottom:1rem;">About Us</span>
      <h2 data-editable="true">Three Decades of Uncompromising Quality</h2>
      <p data-editable="true">Since 1996, we have set the gold standard for plumbing services. We believe that true luxury is peace of mind, knowing that your home's vital systems are in the hands of seasoned masters who care about the details.</p>
      <p data-editable="true">We don't just fix pipes; we build long-term relationships based on trust, transparency, and flawless execution.</p>
      
      <div class="exp-stats">
        <div class="stat-item">
          <h4 data-editable="true">15k+</h4>
          <p data-editable="true">Homes Serviced</p>
        </div>
        <div class="stat-item">
          <h4 data-editable="true">100%</h4>
          <p data-editable="true">Satisfaction Rate</p>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="emergency-banner">
  <div class="container eb-inner">
    <div class="eb-text">
      <h2 data-editable="true">Plumbing Emergency?</h2>
      <p data-editable="true">Don't let water damage ruin your home. We dispatch immediately, 24/7/365.</p>
    </div>
    <a data-editable="true" href="tel:PHONE_PLACEHOLDER" class="btn eb-btn">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
      Call PHONE_PLACEHOLDER
    </a>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-header">
      <span class="tag" data-editable="true">How It Works</span>
      <h2 data-editable="true">Our Streamlined Premium Process</h2>
      <p data-editable="true">We've engineered our service experience to be completely frictionless from your first call to the final cleanup.</p>
    </div>
    
    <div class="process-grid">
      <div class="process-step">
        <div class="ps-num" data-editable="true">1</div>
        <h4 data-editable="true">Priority Booking</h4>
        <p data-editable="true">Call or book online. You get a dedicated VIP service window immediately.</p>
      </div>
      <div class="process-step">
        <div class="ps-num" data-editable="true">2</div>
        <h4 data-editable="true">Expert Diagnosis</h4>
        <p data-editable="true">Our master plumber arrives on time, fully equipped, and inspects the issue.</p>
      </div>
      <div class="process-step">
        <div class="ps-num" data-editable="true">3</div>
        <h4 data-editable="true">Upfront Options</h4>
        <p data-editable="true">You receive clear, transparent pricing and premium repair options.</p>
      </div>
      <div class="process-step">
        <div class="ps-num" data-editable="true">4</div>
        <h4 data-editable="true">Flawless Execution</h4>
        <p data-editable="true">Work is completed meticulously. We leave your home cleaner than we found it.</p>
      </div>
    </div>
  </div>
</section>

<section class="section section-light">
  <div class="container">
    <div class="section-header">
      <span class="tag" data-editable="true">Our Work</span>
      <h2 data-editable="true">Masterclass Transformations</h2>
      <p data-editable="true">See the difference that 30 years of experience makes. We turn plumbing nightmares into pristine functionality.</p>
    </div>
    
    <div class="gallery-grid">
      <div class="gal-card">
        <div class="gal-images">
          <img data-editable-img="true" src="https://images.openai.com/static-rsc-4/hBldYbXs0Khft-Gs9EwktFjT1k8pqLGh68W2zgM_GJWU147xGgwuIQ14jf91WzIPR3U5dFyygF8SSpeix6iBcjRWNLgD8VEUxK20B53eqB0m8XvqDMfoE6k8qmnj3zNLPxt6FV9u-EDiwd-HWrHZaFoipIq1g1JjJzyYABJlfvMeEVkQAE3NvU0Dmo9_wM13?purpose=inline" alt="Before">
          <img data-editable-img="true" src="https://images.openai.com/static-rsc-4/vZkMUXzBF5DtUUVQFbGnOUE4OFnrj1PbG6nDrRZKtQDTlc-R0K81CD_GfqXm38P8QKfn0nRYgOilMQk6vGI5QemcRyc82AeOZgk05R9kQX9bbP38k3nbqelwm5o2_30p95HKdj1BDF072FCjolK1CNoRU-lfvwRfLVmScqUX6gk?purpose=inline" alt="After">
        </div>
        <span class="gal-label before" data-editable="true">Before</span><span class="gal-label after" data-editable="true">After</span>
        <div class="gal-info"><h4 data-editable="true">Luxury Bathroom Repipe & Modernization</h4></div>
      </div>
      <div class="gal-card">
        <div class="gal-images">
          <img data-editable-img="true" src="https://images.openai.com/static-rsc-4/hBldYbXs0Khft-Gs9EwktFjT1k8pqLGh68W2zgM_GJWU147xGgwuIQ14jf91WzIPR3U5dFyygF8SSpeix6iBcjRWNLgD8VEUxK20B53eqB0m8XvqDMfoE6k8qmnj3zNLPxt6FV9u-EDiwd-HWrHZaFoipIq1g1JjJzyYABJlfvMeEVkQAE3NvU0Dmo9_wM13?purpose=inline" alt="Before">
          <img data-editable-img="true" src="https://images.openai.com/static-rsc-4/vZkMUXzBF5DtUUVQFbGnOUE4OFnrj1PbG6nDrRZKtQDTlc-R0K81CD_GfqXm38P8QKfn0nRYgOilMQk6vGI5QemcRyc82AeOZgk05R9kQX9bbP38k3nbqelwm5o2_30p95HKdj1BDF072FCjolK1CNoRU-lfvwRfLVmScqUX6gk?purpose=inline" alt="After">
        </div>
        <span class="gal-label before" data-editable="true">Before</span><span class="gal-label after" data-editable="true">After</span>
        <div class="gal-info"><h4 data-editable="true">High-Efficiency Tankless System Upgrade</h4></div>
      </div>
    </div>
  </div>
</section>

<section class="why-section">
  <div class="container why-inner">
    <div class="why-content">
      <span class="tag" data-editable="true" style="display:inline-block; background:rgba(var(--primary-rgb),0.1); color:var(--primary); padding:0.5rem 1rem; border-radius:50px; font-weight:700; margin-bottom:1rem;">The Premium Choice</span>
      <h2 data-editable="true" style="font-size:3rem; margin-bottom:1.5rem;">Why We Are The Trusted Name in Plumbing</h2>
      <p data-editable="true" style="font-size:1.15rem; color:var(--text-body);">We don't compromise on quality, parts, or personnel. When you hire us, you are hiring the elite standard of the plumbing industry.</p>
      
      <div class="why-list">
        <div class="why-item">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          <div><h4 data-editable="true">White-Glove Service</h4><p data-editable="true">Shoe covers, drop cloths, and immaculate cleanup.</p></div>
        </div>
        <div class="why-item">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          <div><h4 data-editable="true">Premium Parts Only</h4><p data-editable="true">We use only the highest grade brass, copper, and fixtures.</p></div>
        </div>
        <div class="why-item">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          <div><h4 data-editable="true">Lifetime Warranty</h4><p data-editable="true">Industry-leading warranties on all complete replacements.</p></div>
        </div>
        <div class="why-item">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          <div><h4 data-editable="true">Background Checked</h4><p data-editable="true">Every technician is drug-tested and rigorously vetted.</p></div>
        </div>
      </div>
    </div>
    <div class="why-img-wrap">
      <img data-editable-img="true" src="/assets/templates/plumber/templates01/plumber-02.png" alt="Premium Service" class="why-img">
    </div>
  </div>
</section>

<section class="section section-light">
  <div class="container">
    <div class="section-header">
      <span class="tag" data-editable="true">Testimonials</span>
      <h2 data-editable="true">What Our Clients Say</h2>
      <p data-editable="true">Read why homeowners and businesses have trusted us for three decades.</p>
    </div>
    
    <div class="testi-grid">
      <div class="testi-card">
        <svg class="t-quote-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>
        <div class="t-stars"><svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg><svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg><svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg><svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg><svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg></div>
        <p data-editable="true">"The absolute pinnacle of professionalism. They repiped our entire historic home with zero issues. The crew was immaculate and respectful."</p>
        <div class="t-author">
          <img data-editable-img="true" src="/assets/templates/plumber/templates01/client-01.png" alt="Client">
          <div><h5 data-editable="true">Sarah Jenkins</h5><span data-editable="true">Homeowner</span></div>
        </div>
      </div>
      <div class="testi-card">
        <svg class="t-quote-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>
        <div class="t-stars"><svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg><svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg><svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg><svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg><svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg></div>
        <p data-editable="true">"Called for a severe leak at 2 AM. They arrived in 45 minutes, found the source instantly, and fixed it. Saved our hardwood floors!"</p>
        <div class="t-author">
          <img data-editable-img="true" src="/assets/templates/plumber/templates01/client-02.png" alt="Client">
          <div><h5 data-editable="true">Michael Ross</h5><span data-editable="true">Property Manager</span></div>
        </div>
      </div>
      <div class="testi-card">
        <svg class="t-quote-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>
        <div class="t-stars"><svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg><svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg><svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg><svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg><svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg></div>
        <p data-editable="true">"I've used them for 15 years. They are consistently honest, transparent about costs, and their workmanship is flawless. Highly recommend."</p>
        <div class="t-author">
          <img data-editable-img="true" src="/assets/templates/plumber/templates01/client-03.png" alt="Client">
          <div><h5 data-editable="true">Emily Davis</h5><span data-editable="true">Local Business Owner</span></div>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-header">
      <span class="tag" data-editable="true">FAQ</span>
      <h2 data-editable="true">Frequently Asked Questions</h2>
    </div>
    
    <div class="faq-wrap">
      <details class="faq-item" open>
        <summary><span data-editable="true">Do you offer 24/7 emergency service?</span> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></summary>
        <div class="faq-body" data-editable="true">Yes, we understand that plumbing emergencies can happen at any time. Our team is available 24 hours a day, 7 days a week, 365 days a year to handle your urgent plumbing needs.</div>
      </details>
      <details class="faq-item">
        <summary><span data-editable="true">Are your plumbers licensed and insured?</span> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></summary>
        <div class="faq-body" data-editable="true">Absolutely. Every member of our plumbing team is fully licensed, bonded, and insured. We also conduct thorough background checks and continuous training for your peace of mind.</div>
      </details>
      <details class="faq-item">
        <summary><span data-editable="true">Do you charge for estimates?</span> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></summary>
        <div class="faq-body" data-editable="true">We offer free, no-obligation estimates for most major projects and installations. For specific diagnostic visits, a small dispatch fee may apply, which is often credited toward the final repair cost.</div>
      </details>
      <details class="faq-item">
        <summary><span data-editable="true">What areas do you service?</span> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></summary>
        <div class="faq-body" data-editable="true">We serve the entire metropolitan area and surrounding suburbs. If you are unsure whether your home falls within our service zone, just give us a call!</div>
      </details>
    </div>
  </div>
</section>

<footer class="footer">
  <div class="container">
    <div class="footer-grid">
      <div class="f-about">
        <h3 data-editable="true">PROJECT_NAME_PLACEHOLDER</h3>
        <p data-editable="true">Setting the gold standard in premium plumbing services for over 30 years. Quality craftsmanship, transparent pricing, and 24/7 reliability.</p>
        <div class="f-socials">
          <a href="javascript:void(0);"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg></a>
          <a href="javascript:void(0);"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg></a>
          <a href="javascript:void(0);"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg></a>
        </div>
      </div>
      <div class="f-links">
        <h4 data-editable="true">Quick Links</h4>
        <ul>
          <li><a data-editable="true" href="javascript:void(0);">Home</a></li>
          <li><a data-editable="true" href="javascript:void(0);">About Us</a></li>
          <li><a data-editable="true" href="javascript:void(0);">Our Services</a></li>
          <li><a data-editable="true" href="javascript:void(0);">Contact</a></li>
        </ul>
      </div>
      <div class="f-links">
        <h4 data-editable="true">Contact Us</h4>
        <ul>
          <li><a data-editable="true" href="tel:PHONE_PLACEHOLDER">PHONE_PLACEHOLDER</a></li>
          <li><a data-editable="true" href="mailto:EMAIL_PLACEHOLDER">EMAIL_PLACEHOLDER</a></li>
          <li data-editable="true">ADDRESS_PLACEHOLDER</li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <p data-editable="true">&copy; 2026 PROJECT_NAME_PLACEHOLDER. All Rights Reserved.</p>
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
            e.target.innerHTML = '<div style="padding: 30px; text-align: center;"><svg style="width:60px;height:60px;color:#10b981;margin:0 auto 20px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg><h3 style="margin: 0 0 10px 0; font-size:1.75rem;">Request Sent!</h3><p style="margin: 0; color:#475569; font-size:1.1rem;">We will contact you within 5 minutes.</p></div>';
          }, 1000);
        }
      }
    }, true);
  })();
</script>
`