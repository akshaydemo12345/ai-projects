export const finance03Styles = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

:root {
  --primary: PRIMARY_COLOR_PLACEHOLDER;
  --primary-light: color-mix(in srgb, var(--primary) 10%, transparent);
  --secondary: SECONDARY_COLOR_PLACEHOLDER;
  --secondary-light: color-mix(in srgb, var(--secondary) 10%, transparent);
  --bg-color: #f9fbfa;
  --text-dark: #111827;
  --text-gray: #6b7280;
}

* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: var(--bg-color); color: var(--text-dark); line-height: 1.6; overflow-x: hidden; }

.container { max-width: 1240px; margin: 0 auto; padding: 0 20px; }
a { text-decoration: none; color: inherit; transition: 0.3s; }
img { max-width: 100%; display: block; object-fit: cover; }
ul { list-style: none; }

/* Buttons */
.btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 12px 28px; border-radius: 50px; font-weight: 700; font-size: 15px; cursor: pointer; transition: 0.3s; border: none; }
.btn-primary { background: var(--primary); color: #fff; }
.btn-primary:hover { background: color-mix(in srgb, var(--primary) 80%, black); }
.btn-secondary { background: var(--secondary); color: #fff; }
.btn-secondary:hover { background: color-mix(in srgb, var(--secondary) 80%, black); }

/* Section Titles */
.sec-tag { display: inline-flex; align-items: center; gap: 8px; color: var(--secondary); font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; }
.sec-tag i { font-size: 14px; }
.sec-title h2 { font-size: 40px; font-weight: 800; color: var(--text-dark); margin-bottom: 20px; line-height: 1.2; letter-spacing: -1px; }
.sec-desc { color: var(--text-gray); font-size: 16px; margin-bottom: 30px; line-height: 1.7; }
.text-center { text-align: center; }

/* 1. Top Bar */
.topbar { background: var(--primary); padding: 10px 0; color: #fff; font-size: 13px; font-weight: 500; }
.topbar-inner { display: flex; justify-content: space-between; align-items: center; }
.top-info { display: flex; gap: 24px; }
.top-info span { display: flex; align-items: center; gap: 8px; }
.top-info i { color: var(--secondary); }
.top-social { display: flex; gap: 16px; }
.top-social a:hover { color: var(--secondary); }

/* 2. Header */
.header { background: #fff; padding: 15px 0; box-shadow: 0 4px 20px rgba(0,0,0,0.03); position: sticky; top: 0; z-index: 100; }
.header-inner { display: flex; justify-content: space-between; align-items: center; }
.logo { font-size: 26px; font-weight: 800; color: var(--primary); display: flex; align-items: center; gap: 5px; }
.logo span { color: var(--secondary); }

/* 3. Hero Section */
.hero { padding: 80px 0 160px; background: linear-gradient(135deg, color-mix(in srgb, var(--primary) 8%, #fff) 0%, #ffffff 50%, color-mix(in srgb, var(--secondary) 8%, #fff) 100%); position: relative; overflow: hidden; }
.hero-bg-circle { position: absolute; top: 10%; left: 5%; width: 50px; height: 50px; border: 4px solid var(--secondary); border-radius: 50%; opacity: 0.3; }
.hero-grid { display: grid; grid-template-columns: 1fr 400px; gap: 80px; align-items: center; }
.hero-tag { display: inline-flex; align-items: center; gap: 8px; background: var(--bg-color); padding: 8px 16px; border-radius: 50px; font-size: 13px; font-weight: 600; color: var(--text-dark); margin-bottom: 24px; }
.hero-tag i { color: var(--secondary); }
.hero-content h1 { font-size: 56px; font-weight: 800; line-height: 1.1; margin-bottom: 24px; color: var(--text-dark); letter-spacing: -1.5px; }
.hero-content p { font-size: 18px; color: var(--text-gray); margin-bottom: 32px; max-width: 500px; }

.hero-form { background: #fff; padding: 40px; border-radius: 20px; box-shadow: 0 20px 50px rgba(0,0,0,0.1); position: relative; z-index: 2; }
.hero-form h3 { font-size: 22px; font-weight: 800; margin-bottom: 15px; text-align: center; }
.hero-form p { font-size: 14px; color: var(--text-gray); text-align: center; margin-bottom: 20px; }
.alert-box { background: var(--secondary-light); border: 1px dashed var(--secondary); color: #a67215; padding: 12px; border-radius: 8px; font-size: 13px; font-weight: 600; display: flex; align-items: center; gap: 8px; margin-bottom: 20px; }
.form-group { margin-bottom: 16px; }
.form-input { width: 100%; padding: 14px 16px; border: 1px solid #e5e7eb; border-radius: 8px; font-family: inherit; font-size: 14px; outline: none; background: #f9fafb; transition: 0.3s; }
.form-input:focus { border-color: var(--primary); background: #fff; }
.hero-form .btn-secondary { width: 100%; padding: 16px; font-size: 16px; border-radius: 8px; margin-top: 10px; }

/* 4. Features Strip */
.features-strip { margin-top: -80px; position: relative; z-index: 10; margin-bottom: 80px; }
.feat-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
.feat-card { background: #fff; padding: 30px; border-radius: 16px; box-shadow: 0 10px 40px rgba(0,0,0,0.06); display: flex; align-items: flex-start; gap: 16px; }
.feat-icon { width: 48px; height: 48px; background: var(--primary-light); color: var(--primary); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; }
.feat-text h4 { font-size: 18px; font-weight: 700; margin-bottom: 6px; }
.feat-text p { font-size: 14px; color: var(--text-gray); line-height: 1.5; }

/* 5. About Section */
.about { padding: 60px 0; }
.about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }
.about-imgs { position: relative; }
.img-main { width: 85%; border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); }
.img-sub { position: absolute; bottom: -30px; right: 0; width: 50%; border-radius: 20px; border: 10px solid var(--bg-color); box-shadow: 0 20px 40px rgba(0,0,0,0.1); }
.exp-badge { position: absolute; top: 30px; right: 30px; background: var(--secondary); color: #fff; width: 100px; height: 100px; border-radius: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; box-shadow: 0 15px 30px color-mix(in srgb, var(--secondary) 30%, transparent); z-index: 2; }
.exp-badge h3 { font-size: 28px; font-weight: 800; line-height: 1; }
.exp-badge span { font-size: 10px; font-weight: 700; text-transform: uppercase; }
.about-list { margin-bottom: 30px; }
.about-list li { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; font-weight: 600; font-size: 15px; }
.about-list i { width: 24px; height: 24px; background: var(--primary); color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; }

/* 6. Services Grid */
.services { padding: 100px 0; background: #fff; }
.serv-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; margin-top: 40px; }
.serv-card { background: #fff; border: 1px solid #f0f0f0; padding: 40px 30px; border-radius: 16px; transition: 0.3s; position: relative; }
.serv-card:hover { box-shadow: 0 15px 40px rgba(0,0,0,0.06); border-color: transparent; }
.serv-icon { width: 60px; height: 60px; background: var(--primary-light); color: var(--primary); border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 28px; margin-bottom: 24px; }
.serv-card h3 { font-size: 20px; font-weight: 700; margin-bottom: 12px; }
.serv-card p { font-size: 15px; color: var(--text-gray); margin-bottom: 24px; }
.serv-arrow { width: 36px; height: 36px; background: var(--bg-color); color: var(--text-dark); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; transition: 0.3s; }
.serv-card:hover .serv-arrow { background: var(--primary); color: #fff; }

/* 7. CTA Banner */
.cta-banner { background: var(--primary); padding: 80px 0; text-align: center; color: #fff; }
.cta-banner h2 { font-size: 36px; font-weight: 800; margin-bottom: 16px; color: #fff; }
.cta-banner p { font-size: 18px; color: rgba(255,255,255,0.8); max-width: 800px; margin: 0 auto; }

/* 8. Trusted Partner */
.trusted { padding: 100px 0; }
.trusted-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }
.trust-item { display: flex; gap: 16px; margin-bottom: 24px; background: #fff; padding: 20px; border-radius: 16px; box-shadow: 0 5px 20px rgba(0,0,0,0.03); }
.trust-icon { width: 50px; height: 50px; background: var(--primary-light); color: var(--primary); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 22px; flex-shrink: 0; }
.trust-text h4 { font-size: 18px; font-weight: 700; margin-bottom: 6px; }
.trust-text p { font-size: 14px; color: var(--text-gray); }
.trust-collage { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.tc-img { width: 100%; border-radius: 100px 100px 16px 16px; object-fit: cover; box-shadow: 0 15px 30px rgba(0,0,0,0.1); }
.tc-1 { height: 400px; grid-column: 1; grid-row: 1 / span 2; }
.tc-2 { height: 190px; }
.tc-3 { height: 190px; border-radius: 16px 16px 100px 100px; }

/* 9. Marquee */
.marquee-sec { position: relative; height: 100px; overflow: hidden; background: #fff; }
.marquee-band { position: absolute; width: 120%; left: -10%; height: 65px; display: flex; align-items: center; font-size: 16px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; color: #fff; }
.band-yellow { background: var(--secondary); transform: rotate(2deg); top: 15px; z-index: 1; }
.band-green { background: var(--primary); transform: rotate(-2deg); top: 15px; z-index: 2; box-shadow: 0 10px 20px rgba(0,0,0,0.1); }
.marquee-track { display: flex; gap: 50px; white-space: nowrap; animation: scrollLeft 25s linear infinite; }
.marquee-track span { display: flex; align-items: center; gap: 15px; }
.marquee-track i { color: var(--secondary); font-size: 20px; }
@keyframes scrollLeft { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }

/* 10. Experts (Team) */
.team { padding: 100px 0; background: #fff; text-align: center; }
.team-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 30px; margin-top: 40px; }
.team-card { text-align: center; }
.t-img-box { height: 320px; border-radius: 150px 150px 16px 16px; overflow: hidden; margin-bottom: 20px; position: relative; }
.t-bg-orange { background: #f4a261; }
.t-bg-blue { background: #cbdceb; }
.t-bg-black { background: #264653; }
.t-bg-green { background: #e9edc9; }
.team-card h4 { font-size: 20px; font-weight: 800; margin-bottom: 4px; text-transform: uppercase; }
.team-card p { font-size: 13px; color: var(--text-gray); font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }

/* 11. Latest Projects */
.projects { padding: 100px 0; background: var(--primary); color: #fff; }
.projects .sec-title h2 { color: #fff; }
.proj-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; margin-top: 40px; }
.proj-card { position: relative; border-radius: 20px; overflow: hidden; height: 350px; cursor: pointer; }
.proj-card img { width: 100%; height: 100%; object-fit: cover; transition: 0.5s; }
.proj-info { position: absolute; bottom: 0; left: 0; width: 100%; padding: 40px 24px 30px; background: linear-gradient(to top, var(--primary) 10%, color-mix(in srgb, var(--primary) 80%, transparent) 50%, transparent); }
.proj-info h3 { font-size: 22px; font-weight: 700; margin-bottom: 6px; color: #fff; }
.proj-info p { color: var(--secondary); font-size: 13px; font-weight: 700; text-transform: uppercase; }
.proj-card:hover img { transform: scale(1.05); }

/* 12. How We Work */
.process { padding: 100px 0; text-align: center; }
.process-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 30px; margin-top: 50px; position: relative; }
.process-grid::before { content: ''; position: absolute; top: 45px; left: 10%; width: 80%; border-top: 2px dashed #d1d5db; z-index: 0; }
.p-step { position: relative; z-index: 1; }
.p-icon { width: 90px; height: 90px; background: #fff; border: 4px solid var(--primary-light); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; font-size: 32px; color: var(--primary); position: relative; box-shadow: 0 0 0 8px #fff; }
.p-dot { position: absolute; top: 42px; left: -50%; width: 12px; height: 12px; background: var(--primary); border-radius: 50%; display: none; }
.p-step h4 { font-size: 20px; font-weight: 700; margin-bottom: 10px; }
.p-step p { font-size: 14px; color: var(--text-gray); }

/* 13. Testimonials */
.testimonials { padding: 80px 0 150px; background: var(--bg-color); text-align: center; }
.test-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; margin-top: 40px; }
.test-card { background: #fff; padding: 40px; border-radius: 20px; text-align: left; box-shadow: 0 10px 30px rgba(0,0,0,0.04); position: relative; }
.test-stars { color: var(--secondary); font-size: 14px; margin-bottom: 20px; display: flex; gap: 4px; }
.test-card p { font-size: 16px; color: var(--text-gray); margin-bottom: 30px; font-style: italic; line-height: 1.7; }
.t-client { display: flex; align-items: center; gap: 16px; }
.t-client img { width: 56px; height: 56px; border-radius: 50%; }
.t-client h4 { font-size: 18px; font-weight: 700; margin-bottom: 2px; }
.t-client span { font-size: 12px; font-weight: 700; color: var(--primary); text-transform: uppercase; }
.quote-icon { position: absolute; top: 40px; right: 40px; font-size: 40px; color: var(--secondary-light); z-index: 0; }

/* 14. Newsletter */
.newsletter-wrapper { margin-top: -100px; position: relative; z-index: 10; padding: 0 20px; }
.newsletter-box { background: var(--secondary); padding: 50px 60px; border-radius: 100px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 20px 40px color-mix(in srgb, var(--secondary) 30%, transparent); max-width: 1200px; margin: 0 auto; }
.newsletter-box h2 { font-size: 32px; font-weight: 800; color: #fff; line-height: 1.2; }
.news-form { background: #fff; padding: 8px; border-radius: 50px; display: flex; width: 450px; }
.news-form input { flex: 1; border: none; padding: 10px 20px; font-family: inherit; font-size: 15px; outline: none; border-radius: 50px; }
.news-form .btn-primary { padding: 14px 32px; border-radius: 50px; }

/* 15. Footer */
.footer { background: var(--primary); padding: 120px 0 40px; margin-top: -50px; color: #fff; }
.footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1.5fr; gap: 40px; padding-bottom: 60px; border-bottom: 1px solid rgba(255,255,255,0.1); margin-bottom: 30px; }
.f-logo { color: #fff; margin-bottom: 24px; display: inline-flex; }
.f-logo span { color: var(--secondary); }
.f-desc { font-size: 15px; color: rgba(255,255,255,0.8); margin-bottom: 24px; max-width: 350px; }
.f-socials { display: flex; gap: 12px; }
.f-socials a { width: 40px; height: 40px; background: rgba(255,255,255,0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; }
.f-socials a:hover { background: var(--secondary); }
.footer h4 { font-size: 20px; font-weight: 700; margin-bottom: 24px; color: #fff; }
.f-links li { margin-bottom: 12px; }
.f-links a { color: rgba(255,255,255,0.8); font-size: 15px; }
.f-links a:hover { color: var(--secondary); }
.f-contact li { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; font-size: 15px; color: rgba(255,255,255,0.8); }
.f-contact i { color: var(--secondary); font-size: 18px; }
.footer-bottom { display: flex; justify-content: space-between; font-size: 14px; color: rgba(255,255,255,0.6); }

@media (max-width: 1024px) {
  .hero-grid { grid-template-columns: 1fr; }
  .feat-grid, .about-grid, .trusted-grid { grid-template-columns: 1fr; }
  .serv-grid, .team-grid, .proj-grid, .test-grid, .process-grid { grid-template-columns: repeat(2, 1fr); }
  .footer-grid { grid-template-columns: 1fr 1fr; }
  .process-grid::before { display: none; }
  .newsletter-box { flex-direction: column; text-align: center; gap: 30px; border-radius: 30px; }
}
@media (max-width: 768px) {
  .topbar { display: none; }
  .hero-content h1 { font-size: 42px; }
  .serv-grid, .team-grid, .proj-grid, .test-grid, .process-grid, .footer-grid { grid-template-columns: 1fr; }
  .news-form { width: 100%; flex-direction: column; padding: 15px; background: transparent; }
  .news-form input { background: #fff; margin-bottom: 15px; padding: 15px; }
}
`;

export const finance03Html = `
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">

<!-- 1. Top Bar -->
<div class="topbar">
  <div class="container topbar-inner">
    <div class="top-info">
      <span><i class="fa-solid fa-envelope"></i> info@agency03.com</span>
      <span><i class="fa-solid fa-phone"></i> +1 800 123 4567</span>
      <span><i class="fa-solid fa-location-dot"></i> 100 Finance St, NY 10001</span>
    </div>
    <div class="top-social">
      <a href="#"><i class="fa-brands fa-facebook-f"></i></a>
      <a href="#"><i class="fa-brands fa-twitter"></i></a>
      <a href="#"><i class="fa-brands fa-linkedin-in"></i></a>
      <a href="#"><i class="fa-brands fa-instagram"></i></a>
    </div>
  </div>
</div>

<!-- 2. Header -->
<header class="header">
  <div class="container header-inner">
    <div class="logo">LOGO_PLACEHOLDER</div>
    <a href="#contact" class="btn btn-secondary">Get Started <i class="fa-solid fa-arrow-right"></i></a>
  </div>
</header>

<main>
  <!-- 3. Hero Section -->
  <section class="hero">
    <div class="hero-bg-circle"></div>
    <div class="container hero-grid">
      <div class="hero-content">
        <div class="hero-tag"><i class="fa-solid fa-star"></i> Welcome to AgencyPlatform</div>
        <h1>AgencyPlatform - Agency</h1>
        <p>Drive your agency with a solid data and tech foundation. With Agency03 by 100% with EPS, you can design, service, and advance faster your brand with proven results.</p>
        <a href="#services" class="btn btn-primary">Discover More <i class="fa-solid fa-arrow-right"></i></a>
      </div>
      <div class="hero-form">
        <h3>Request Consultation</h3>
        <p>Welcome to AgencyPlatform - Agency. Drive more revenue and operations using analytics, customer experiences, and digital transformation.</p>
        <div class="alert-box">
          <i class="fa-solid fa-circle-exclamation"></i> Your business is your wealth.
        </div>
        <form onsubmit="event.preventDefault();" class="premium-form">
          <div class="form-group">
            <input type="text" class="form-input" placeholder="Full Name" required>
          </div>
          <div class="form-group">
            <input type="email" class="form-input" placeholder="Email Address" required>
          </div>
          <div class="form-group">
            <input type="tel" class="form-input" placeholder="Phone Number" required>
          </div>
          <button type="submit" class="btn btn-secondary">Get Consultation <i class="fa-solid fa-arrow-right"></i></button>
        </form>
      </div>
    </div>
  </section>

  <!-- 4. Features Strip -->
  <div class="container features-strip">
    <div class="feat-grid">
      <div class="feat-card">
        <div class="feat-icon"><i class="fa-solid fa-leaf"></i></div>
        <div class="feat-text">
          <h4>Business Growth</h4>
          <p>We help businesses build and enhance their financial profiles.</p>
        </div>
      </div>
      <div class="feat-card">
        <div class="feat-icon"><i class="fa-solid fa-chart-line"></i></div>
        <div class="feat-text">
          <h4>Financial Advice</h4>
          <p>Expert wealth management and market overview consulting.</p>
        </div>
      </div>
      <div class="feat-card">
        <div class="feat-icon"><i class="fa-solid fa-magnifying-glass-chart"></i></div>
        <div class="feat-text">
          <h4>Market Analysis</h4>
          <p>Deep dive research and market forecasting to outpace competitors.</p>
        </div>
      </div>
    </div>
  </div>

  <!-- 5. About Section -->
  <section class="about" id="about">
    <div class="container about-grid">
      <div class="about-imgs">
        <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=800" alt="Office" class="img-main">
        <img src="https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&q=80&w=600" alt="Meeting" class="img-sub">
        <div class="exp-badge">
          <h3>27+</h3>
          <span>Years<br>Experience</span>
        </div>
      </div>
      <div>
        <div class="sec-tag"><i class="fa-solid fa-building"></i> ABOUT OUR COMPANY</div>
        <div class="sec-title">
          <h2>We Provide the Best Solutions For Your Business</h2>
        </div>
        <p class="sec-desc">Welcome to AgencyPlatform - Agency. We provide the best digital marketing, agency services tailored to your specific needs. Partner with us for unparalleled success in your industry.</p>
        <ul class="about-list">
          <li><i class="fa-solid fa-check"></i> Certified Professionals</li>
          <li><i class="fa-solid fa-check"></i> Award-Winning Agency</li>
          <li><i class="fa-solid fa-check"></i> 100% Satisfaction Rated</li>
          <li><i class="fa-solid fa-check"></i> 24/7 Premium Support</li>
        </ul>
        <a href="#services" class="btn btn-secondary" style="margin-top: 10px;">Discover More <i class="fa-solid fa-arrow-right"></i></a>
      </div>
    </div>
  </section>

  <!-- 6. Services Grid -->
  <section class="services" id="services">
    <div class="container">
      <div class="text-center">
        <div class="sec-tag justify-center" style="justify-content: center;"><i class="fa-solid fa-briefcase"></i> WHAT WE OFFER</div>
        <div class="sec-title"><h2>Professional Services</h2></div>
      </div>
      <div class="serv-grid">
        <div class="serv-card">
          <div class="serv-icon"><i class="fa-solid fa-chart-pie"></i></div>
          <h3>Financial Consulting</h3>
          <p>Comprehensive financial planning and strategic advisory to optimize your corporate resources.</p>
          <a href="#" class="serv-arrow"><i class="fa-solid fa-arrow-right"></i></a>
        </div>
        <div class="serv-card">
          <div class="serv-icon"><i class="fa-solid fa-file-invoice-dollar"></i></div>
          <h3>Tax Strategy</h3>
          <p>Advanced tax advisory to ensure compliance while minimizing corporate tax liabilities globally.</p>
          <a href="#" class="serv-arrow"><i class="fa-solid fa-arrow-right"></i></a>
        </div>
        <div class="serv-card">
          <div class="serv-icon"><i class="fa-solid fa-shield-halved"></i></div>
          <h3>Risk Management</h3>
          <p>Identify and mitigate financial risks to protect your business assets and investments.</p>
          <a href="#" class="serv-arrow"><i class="fa-solid fa-arrow-right"></i></a>
        </div>
        <div class="serv-card">
          <div class="serv-icon"><i class="fa-solid fa-building-columns"></i></div>
          <h3>Investment Banking</h3>
          <p>Expert guidance on mergers, acquisitions, and capital raising for enterprise expansion.</p>
          <a href="#" class="serv-arrow"><i class="fa-solid fa-arrow-right"></i></a>
        </div>
        <div class="serv-card">
          <div class="serv-icon"><i class="fa-solid fa-magnifying-glass-dollar"></i></div>
          <h3>Audit & Assurance</h3>
          <p>Thorough audits and internal controls reviews to build trust with your stakeholders.</p>
          <a href="#" class="serv-arrow"><i class="fa-solid fa-arrow-right"></i></a>
        </div>
        <div class="serv-card">
          <div class="serv-icon"><i class="fa-solid fa-sack-dollar"></i></div>
          <h3>Wealth Management</h3>
          <p>Personalized portfolio management to build, preserve, and transfer intergenerational wealth.</p>
          <a href="#" class="serv-arrow"><i class="fa-solid fa-arrow-right"></i></a>
        </div>
      </div>
    </div>
  </section>

  <!-- 7. CTA Banner -->
  <section class="cta-banner">
    <div class="container">
      <h2>We provide the best solution for your business</h2>
      <p>Welcome to AgencyPlatform - Agency. We provide the best digital marketing, agency services tailored to your specific needs. Partner with us for unparalleled success in your industry.</p>
    </div>
  </section>

  <!-- 8. Trusted Partner -->
  <section class="trusted">
    <div class="container trusted-grid">
      <div>
        <div class="sec-tag"><i class="fa-solid fa-handshake"></i> WHY CHOOSE US</div>
        <div class="sec-title"><h2>Your Trusted Partner in Financial Growth</h2></div>
        <p class="sec-desc">Welcome to AgencyPlatform - Agency. We provide the best digital marketing, agency services tailored to your specific needs. Partner with us for unparalleled success in your industry.</p>
        
        <div class="trust-item">
          <div class="trust-icon"><i class="fa-solid fa-user-tie"></i></div>
          <div class="trust-text">
            <h4>Professional Team</h4>
            <p>Welcome to AgencyPlatform - Agency. We provide the best digital marketing, agency services tailored to your specific needs.</p>
          </div>
        </div>
        <div class="trust-item">
          <div class="trust-icon"><i class="fa-solid fa-lightbulb"></i></div>
          <div class="trust-text">
            <h4>Innovative Strategies</h4>
            <p>Welcome to AgencyPlatform - Agency. We provide the best digital marketing, agency services tailored to your specific needs.</p>
          </div>
        </div>
      </div>
      <div class="trust-collage">
        <img src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=600" alt="Collage 1" class="tc-img tc-1">
        <img src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1000&q=80" alt="Collage 2" class="tc-img tc-2">
        <img src="https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=400" alt="Collage 3" class="tc-img tc-3">
      </div>
    </div>
  </section>

  <!-- 9. Marquee -->
  <section class="marquee-sec">
    <div class="marquee-band band-yellow">
      <div class="marquee-track">
        <span><i class="fa-solid fa-check-circle"></i> PROFESSIONAL SERVICES</span>
        <span><i class="fa-solid fa-check-circle"></i> TRUSTED PARTNERS</span>
        <span><i class="fa-solid fa-check-circle"></i> GLOBAL REACH</span>
        <span><i class="fa-solid fa-check-circle"></i> EXPERT SOLUTIONS</span>
        <span><i class="fa-solid fa-check-circle"></i> MARKET ANALYSIS</span>
        <span><i class="fa-solid fa-check-circle"></i> CONTINUOUS GROWTH</span>
        <span><i class="fa-solid fa-check-circle"></i> 24/7 SUPPORT</span>
        <span><i class="fa-solid fa-check-circle"></i> INNOVATIVE STRATEGY</span>
        <span><i class="fa-solid fa-check-circle"></i> PROFESSIONAL SERVICES</span>
        <span><i class="fa-solid fa-check-circle"></i> TRUSTED PARTNERS</span>
        <span><i class="fa-solid fa-check-circle"></i> GLOBAL REACH</span>
        <span><i class="fa-solid fa-check-circle"></i> EXPERT SOLUTIONS</span>
        <span><i class="fa-solid fa-check-circle"></i> MARKET ANALYSIS</span>
        <span><i class="fa-solid fa-check-circle"></i> CONTINUOUS GROWTH</span>
        <span><i class="fa-solid fa-check-circle"></i> 24/7 SUPPORT</span>
        <span><i class="fa-solid fa-check-circle"></i> INNOVATIVE STRATEGY</span>
      </div>
    </div>
    <div class="marquee-band band-green">
      <div class="marquee-track">
        <span><i class="fa-solid fa-check-circle"></i> PROFESSIONAL SERVICES</span>
        <span><i class="fa-solid fa-check-circle"></i> TRUSTED PARTNERS</span>
        <span><i class="fa-solid fa-check-circle"></i> GLOBAL REACH</span>
        <span><i class="fa-solid fa-check-circle"></i> EXPERT SOLUTIONS</span>
        <span><i class="fa-solid fa-check-circle"></i> MARKET ANALYSIS</span>
        <span><i class="fa-solid fa-check-circle"></i> CONTINUOUS GROWTH</span>
        <span><i class="fa-solid fa-check-circle"></i> 24/7 SUPPORT</span>
        <span><i class="fa-solid fa-check-circle"></i> INNOVATIVE STRATEGY</span>
        <span><i class="fa-solid fa-check-circle"></i> PROFESSIONAL SERVICES</span>
        <span><i class="fa-solid fa-check-circle"></i> TRUSTED PARTNERS</span>
        <span><i class="fa-solid fa-check-circle"></i> GLOBAL REACH</span>
        <span><i class="fa-solid fa-check-circle"></i> EXPERT SOLUTIONS</span>
        <span><i class="fa-solid fa-check-circle"></i> MARKET ANALYSIS</span>
        <span><i class="fa-solid fa-check-circle"></i> CONTINUOUS GROWTH</span>
        <span><i class="fa-solid fa-check-circle"></i> 24/7 SUPPORT</span>
        <span><i class="fa-solid fa-check-circle"></i> INNOVATIVE STRATEGY</span>
      </div>
    </div>
  </section>

  <!-- 10. Experts (Team) -->
  <section class="team" id="team">
    <div class="container">
      <div class="text-center">
        <div class="sec-tag justify-center" style="justify-content: center;"><i class="fa-solid fa-users"></i> TEAM MEMBERS</div>
        <div class="sec-title"><h2>Meet Our Experts</h2></div>
      </div>
      <div class="team-grid">
        <div class="team-card">
          <div class="t-img-box t-bg-orange">
            <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400" alt="Team" style="width:100%; height:100%; object-position: top;">
          </div>
          <h4>Sarah Jenkins</h4>
          <p>CEO & FOUNDER</p>
        </div>
        <div class="team-card">
          <div class="t-img-box t-bg-blue">
            <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400" alt="Team" style="width:100%; height:100%; object-position: top;">
          </div>
          <h4>Michael Ross</h4>
          <p>FINANCIAL ADVISOR</p>
        </div>
        <div class="team-card">
          <div class="t-img-box t-bg-black">
            <img src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400" alt="Team" style="width:100%; height:100%; object-position: top;">
          </div>
          <h4>David Kim</h4>
          <p>TAX SPECIALIST</p>
        </div>
        <div class="team-card">
          <div class="t-img-box t-bg-green">
            <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400" alt="Team" style="width:100%; height:100%; object-position: top;">
          </div>
          <h4>Maria Garcia</h4>
          <p>WEALTH MANAGER</p>
        </div>
      </div>
    </div>
  </section>

  <!-- 11. Latest Projects -->
  <section class="projects">
    <div class="container">
      <div class="text-center">
        <div class="sec-tag justify-center" style="justify-content: center; color: var(--secondary);"><i class="fa-solid fa-folder-open"></i> RECENT PORTFOLIO</div>
        <div class="sec-title"><h2>Latest Projects</h2></div>
      </div>
      <div class="proj-grid">
        <div class="proj-card">
          <img src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1000&q=80" alt="Project">
          <div class="proj-info">
            <h3>Financial Restructuring</h3>
            <p>CORPORATE FINANCE</p>
          </div>
        </div>
        <div class="proj-card">
          <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800" alt="Project">
          <div class="proj-info">
            <h3>Data Analytics Integration</h3>
            <p>TECH ADVISORY</p>
          </div>
        </div>
        <div class="proj-card">
          <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1000&q=80" alt="Project">
          <div class="proj-info">
            <h3>Merger & Acquisition</h3>
            <p>INVESTMENT BANKING</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- 12. How We Work -->
  <section class="process">
    <div class="container">
      <div class="text-center">
        <div class="sec-tag justify-center" style="justify-content: center;"><i class="fa-solid fa-gears"></i> WORKING PROCESS</div>
        <div class="sec-title"><h2>How We Work</h2></div>
      </div>
      <div class="process-grid">
        <div class="p-step">
          <div class="p-icon"><i class="fa-solid fa-comments"></i></div>
          <h4>Consultation</h4>
          <p>We meet to discuss your financial goals and understand your business structure thoroughly.</p>
        </div>
        <div class="p-step">
          <div class="p-icon"><i class="fa-solid fa-magnifying-glass-chart"></i></div>
          <h4>Analysis</h4>
          <p>Our expert team analyzes your data to identify risks and opportunities for growth.</p>
        </div>
        <div class="p-step">
          <div class="p-icon"><i class="fa-solid fa-chess-knight"></i></div>
          <h4>Strategy</h4>
          <p>We develop a customized, robust financial strategy designed specifically for your objectives.</p>
        </div>
        <div class="p-step">
          <div class="p-icon"><i class="fa-solid fa-rocket"></i></div>
          <h4>Execution</h4>
          <p>We help you implement the strategy and monitor the results for continuous improvement.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- 13. Testimonials -->
  <section class="testimonials">
    <div class="container">
      <div class="text-center">
        <div class="sec-tag justify-center" style="justify-content: center;"><i class="fa-solid fa-star"></i> CLIENT FEEDBACK</div>
        <div class="sec-title"><h2>What They Say About Us</h2></div>
      </div>
      <div class="test-grid">
        <div class="test-card">
          <i class="fa-solid fa-quote-right quote-icon"></i>
          <div class="test-stars">
            <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>
          </div>
          <p>"Their financial strategies completely transformed our operational efficiency. We saw a 30% increase in profitability within the first year of partnership."</p>
          <div class="t-client">
            <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200" alt="Client">
            <div>
              <h4>Robert Fox</h4>
              <span>CEO, TECHSTART INC.</span>
            </div>
          </div>
        </div>
        <div class="test-card">
          <i class="fa-solid fa-quote-right quote-icon"></i>
          <div class="test-stars">
            <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>
          </div>
          <p>"The depth of their market analysis gives us the confidence to expand internationally. A truly exceptional team of professionals who deliver results."</p>
          <div class="t-client">
            <img src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=200" alt="Client">
            <div>
              <h4>Emily Wilson</h4>
              <span>DIRECTOR, GLOBALTRADE</span>
            </div>
          </div>
        </div>
        <div class="test-card">
          <i class="fa-solid fa-quote-right quote-icon"></i>
          <div class="test-stars">
            <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>
          </div>
          <p>"Outstanding tax advisory services. They helped us navigate complex regulations across borders and saved us significant amounts in corporate liabilities."</p>
          <div class="t-client">
            <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200" alt="Client">
            <div>
              <h4>Amy Franklin</h4>
              <span>FOUNDER, INNOVENTURE</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- 14. Newsletter -->
  <div class="newsletter-wrapper">
    <div class="newsletter-box">
      <h2>Subscribe To Our Newsletter</h2>
      <form class="news-form" onsubmit="event.preventDefault(); this.innerHTML = '<span style=\\'padding:15px 30px; font-weight:700; color:var(--primary);\\'>Subscribed Successfully!</span>';">
        <input type="email" placeholder="Email Address..." required>
        <button type="submit" class="btn-primary">Subscribe <i class="fa-solid fa-paper-plane"></i></button>
      </form>
    </div>
  </div>

  <!-- 15. Footer -->
  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div>
          <div class="logo f-logo">LOGO_PLACEHOLDER</div>
          <p class="f-desc">Expert consulting and corporate strategy tailored for your success. We build lasting partnerships that drive results.</p>
          <div class="f-socials">
            <a href="#"><i class="fa-brands fa-facebook-f"></i></a>
            <a href="#"><i class="fa-brands fa-twitter"></i></a>
            <a href="#"><i class="fa-brands fa-linkedin-in"></i></a>
            <a href="#"><i class="fa-brands fa-instagram"></i></a>
          </div>
        </div>
        <div>
          <h4>Quick Links</h4>
          <ul class="f-links">
            <li><a href="#about">About Us</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#team">Our Team</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>
        <div>
          <h4>Services</h4>
          <ul class="f-links">
            <li><a href="#">Financial Consulting</a></li>
            <li><a href="#">Tax Strategy</a></li>
            <li><a href="#">Risk Management</a></li>
            <li><a href="#">Wealth Management</a></li>
          </ul>
        </div>
        <div>
          <h4>Contact Info</h4>
          <ul class="f-contact">
            <li><i class="fa-solid fa-location-dot"></i> 100 Business Avenue, New York, NY 10001</li>
            <li><i class="fa-solid fa-phone"></i> +1 800 123 4567</li>
            <li><i class="fa-solid fa-envelope"></i> info@agency03.com</li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <div>&copy; 2026 AgencyPlatform. All rights reserved.</div>
        <div>
          <a href="#" style="margin-right: 20px;">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>
      </div>
    </div>
  </footer>
</main>

<script id="core-interactions">
  (function() {
    var isInEditor = !!document.querySelector('[data-gjs-type]') || document.body.classList.contains('gjs-dashed');
    
    document.addEventListener('submit', function(e) {
      if (e.target.tagName === 'FORM' && e.target.classList.contains('premium-form')) {
        e.preventDefault();
        if (isInEditor) {
          e.stopImmediatePropagation();
          var existingModal = document.getElementById("preview-mode-modal");
          if (existingModal) existingModal.remove();
          var modalHtml = '<div id="preview-mode-modal" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 999999; display: flex; align-items: center; justify-content: center; background: rgba(17, 24, 39, 0.8); backdrop-filter: blur(8px); opacity: 0; animation: pModalFadeIn 0.3s forwards; font-family: \\'Plus Jakarta Sans\\', sans-serif;"><div style="background: #ffffff; width: 90%; max-width: 400px; border-radius: 24px; padding: 32px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); text-align: center; transform: scale(0.95); animation: pModalScaleUp 0.3s forwards;"><div style="width: 60px; height: 60px; background: #FEF2F2; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;"><svg style="width: 30px; height: 30px; color: #ef4444;" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg></div><h3 style="font-size: 18px; font-weight: 800; color: var(--text-dark); margin: 0 0 12px;">Preview Mode Active</h3><p style="font-size: 14px; color: var(--text-gray); margin: 0 0 28px; line-height: 1.5;">Form submissions are disabled in preview mode. Publish your page to accept real submissions.</p><button onclick="document.getElementById(\\'preview-mode-modal\\').remove()" style="width: 100%; background: var(--primary); color: #ffffff; border: none; padding: 14px; border-radius: 30px; font-size: 14px; font-weight: 700; cursor: pointer; transition: 0.3s;">Got it, close</button></div><style>@keyframes pModalFadeIn { to { opacity: 1; } } @keyframes pModalScaleUp { to { transform: scale(1); } }</style></div>';
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
                input.style.borderColor = 'var(--primary)';
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
              err.style.fontWeight = '600';
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
          var btn = e.target.querySelector('button[type="submit"]');
          if (btn) btn.innerHTML = 'Sending...';
          setTimeout(function() {
            e.target.innerHTML = '<div style="padding: 30px; text-align: center; border-radius: 12px; background: var(--primary-light); color: var(--primary);"><h3 style="margin: 0 0 10px 0; font-size: 18px; font-weight: 800;">Success!</h3><p style="margin: 0; font-size: 14px; font-weight: 500;">Your consultation request has been received.</p></div>';
          }, 1000);
        }
      }
    }, true);
  })();
</script>
`
