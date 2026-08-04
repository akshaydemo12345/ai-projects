export const law05Styles = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter:wght@400;500;600&display=swap');

:root {
  --primary: PRIMARY_COLOR_PLACEHOLDER;
  --secondary: SECONDARY_COLOR_PLACEHOLDER;
  --primary-rgb: PRIMARY_RGB_PLACEHOLDER;
  --secondary-rgb: SECONDARY_RGB_PLACEHOLDER;
  --bg-light: #fdfdfd;
  --text-dark: #1f1f1f;
  --text-muted: #64748b;
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
  font-family: 'Playfair Display', serif; 
  font-weight: 600; 
  line-height: 1.2; 
  color: var(--text-dark);
}

a { text-decoration: none; color: inherit; transition: color 0.3s ease; }
img { max-width: 100%; height: auto; display: block; }

.container { max-width: 1200px; margin: 0 auto; padding: 0 1.5rem; }

/* Buttons */
.btn {
  display: inline-block;
  padding: 12px 30px;
  font-size: 0.95rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  text-align: center;
}
.btn-primary {
  background-color: var(--primary);
  color: #fff;
}
.btn-primary:hover {
  background-color: var(--text-dark);
  color: #fff;
}
.btn-secondary {
  background-color: var(--text-dark);
  color: #fff;
}
.btn-secondary:hover {
  background-color: var(--primary);
  color: #fff;
}

/* Header */
.top-bar {
  background-color: #fff;
  border-bottom: 1px solid var(--border-light);
  padding: 10px 0;
  font-size: 0.85rem;
  color: var(--text-muted);
}
.top-bar-inner {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 20px;
}
.top-bar-item {
  display: flex;
  align-items: center;
  gap: 8px;
}
.social-links {
  display: flex;
  gap: 12px;
}
.social-links a { color: var(--text-muted); font-size: 1rem; }
.social-links a:hover { color: var(--primary); }

.header {
  background-color: #fff;
  padding: 20px 0;
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
}
.header-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: 'Playfair Display', serif;
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--text-dark);
}
.logo svg { width: 40px; height: 40px; color: var(--primary); }
.nav-links {
  display: flex;
  gap: 30px;
  list-style: none;
}
.nav-links a {
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--text-dark);
  text-transform: uppercase;
}
.nav-links a:hover { color: var(--primary); }

/* Hero Section */
.hero {
  position: relative;
  background-image: url('/assets/templates/LawFirm/templates02/hero.jpg');
  background-size: cover;
  background-position: center;
  padding: 150px 0;
  text-align: center;
  color: #fff;
}
.hero::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.6);
}
.hero-content {
  position: relative;
  z-index: 2;
  max-width: 800px;
  margin: 0 auto;
}
.hero-subtitle {
  font-family: 'Inter', sans-serif;
  text-transform: uppercase;
  letter-spacing: 4px;
  font-size: 1rem;
  margin-bottom: 10px;
  display: block;
}
.hero h1 {
  font-size: 4.5rem;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 20px;
}
.hero p {
  font-size: 1.1rem;
  margin-bottom: 40px;
}

/* Banner Section */
.banner {
  display: flex;
  background: #f4f4f4;
}
.banner-left {
  flex: 1;
  background-color: var(--primary);
  color: #fff;
  padding: 60px 40px;
  display: flex;
  align-items: flex-start;
  gap: 20px;
}
.banner-left i {
  font-size: 2.5rem;
}
.banner-left h3 {
  color: #fff;
  font-size: 1.8rem;
  margin-bottom: 15px;
}
.banner-right {
  flex: 1;
  background-image: url('/assets/templates/LawFirm/templates03/hero-lawyer.jpg');
  background-size: cover;
  background-position: center;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
.banner-right::before {
  content: '';
  position: absolute;
  top:0; left:0; right:0; bottom:0;
  background: rgba(255,255,255,0.85);
}
.banner-right-content {
  position: relative;
  z-index: 2;
  text-align: center;
}
.banner-right-content h3 {
  font-size: 2rem;
  margin-bottom: 10px;
}

/* Features Section */
.features-section {
  background-image: url('/assets/templates/LawFirm/templates01/image1.jpg');
  background-size: cover;
  background-attachment: fixed;
  position: relative;
  padding: 80px 0;
  color: #fff;
}
.features-section::before {
  content: '';
  position: absolute;
  top:0; left:0; right:0; bottom:0;
  background: rgba(30,30,30,0.9);
}
.features-inner {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 50px;
}
.features-image {
  flex: 1;
}
.features-grid {
  flex: 1.5;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 40px;
}
.feature-item {
  display: flex;
  gap: 15px;
}
.feature-icon {
  color: var(--primary);
  font-size: 2rem;
}
.feature-item h4 {
  color: #fff;
  font-size: 1.2rem;
  margin-bottom: 10px;
}
.feature-item p {
  color: #aaa;
  font-size: 0.9rem;
}

/* Call to action */
.cta-banner {
  text-align: center;
  padding: 60px 0;
  background: #fff;
}
.cta-banner h2 {
  font-size: 2rem;
  font-style: italic;
  margin-bottom: 15px;
}
.cta-banner p {
  font-size: 1.1rem;
  color: var(--text-muted);
}
.cta-banner .phone {
  display: inline-block;
  margin-top: 20px;
  color: var(--primary);
  font-size: 1.5rem;
  font-weight: 700;
}

/* Practice Areas */
.practice-section {
  padding: 80px 0;
  background: var(--bg-light);
  text-align: center;
}
.section-title {
  font-size: 2.5rem;
  margin-bottom: 40px;
  position: relative;
  display: inline-block;
}
.section-title::after {
  content: '';
  display: block;
  width: 50px;
  height: 2px;
  background: var(--primary);
  margin: 15px auto 0;
}
.practice-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}
.practice-card {
  position: relative;
  overflow: hidden;
  border-radius: 4px;
}
.practice-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  transition: transform 0.5s ease;
}
.practice-card:hover img {
  transform: scale(1.1);
}
.practice-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.5);
  z-index: 1;
}
.practice-card h4 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  color: #fff;
  font-size: 1.2rem;
  text-transform: uppercase;
  text-align: center;
  width: 90%;
}

/* Testimonials & News */
.testi-news {
  padding: 80px 0;
  background: #f9f9f9;
}
.testi-news-layout {
  display: flex;
  gap: 60px;
}
.testi-left {
  flex: 1;
  min-width: 0;
}
.testi-right {
  flex: 1;
}
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}
.section-header h3 {
  font-size: 1.8rem;
}
.testi-author {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}
.testi-author img {
  width: 70px; height: 70px;
  border-radius: 50%;
  object-fit: cover;
}
.testi-author h5 { font-size: 1.1rem; margin: 0; }
.testi-content p { color: var(--text-muted); margin-bottom: 20px; font-style: italic; }
.read-more { color: var(--primary); font-weight: 600; text-transform: uppercase; font-size: 0.9rem; display: inline-block; margin-bottom: 15px;}
.news-list { display: flex; flex-direction: column; gap: 25px; }
.news-item { display: flex; gap: 20px; }
.news-date {
  background: #e4d8c3; /* light gold/brown tint */
  color: var(--text-dark);
  padding: 10px 15px;
  text-align: center;
  min-width: 70px;
}
.news-date .day { display: block; font-size: 1.5rem; font-weight: bold; }
.news-date .month { display: block; font-size: 0.85rem; text-transform: uppercase; }
.news-text h5 { font-size: 1.1rem; margin-bottom: 5px; }
.news-text p { color: var(--text-muted); font-size: 0.9rem; margin: 0; }

/* Swiper Pagination Styles - Testimonials */
.testi-news .swiper-pagination { position: relative !important; margin-top: 1rem; display: flex; justify-content: flex-start; align-items: center; gap: 8px; }
.testi-news .swiper-pagination-bullet { width: 12px !important; height: 12px !important; background: #ddd !important; opacity: 1 !important; border-radius: 50% !important; transition: 0.3s; margin: 0 !important; cursor: pointer; }
.testi-news .swiper-pagination-bullet:hover { background: var(--secondary) !important; }
.testi-news .swiper-pagination-bullet-active { background: var(--primary) !important; width: 30px !important; border-radius: 6px !important; }

/* Swiper Pagination Styles - Clients */
.clients-section .swiper-pagination { position: relative !important; margin-top: 2rem; display: flex; justify-content: center; align-items: center; gap: 8px; }
.clients-section .swiper-pagination-bullet { width: 25px !important; height: 4px !important; background: #ddd !important; opacity: 1 !important; border-radius: 2px !important; transition: 0.3s; margin: 0 !important; cursor: pointer; }
.clients-section .swiper-pagination-bullet:hover { background: #bbb !important; }
.clients-section .swiper-pagination-bullet-active { background: var(--text-dark) !important; width: 40px !important; }

/* Clients */
.clients-section {
  padding: 80px 0;
  background: #fff;
}
.section-header.center { justify-content: center; position: relative; }
.clients-grid {
  margin-top: 40px;
}
.client-logo {
  border: 1px solid var(--border-light);
  padding: 30px;
  min-width: 150px;
  text-align: center;
  color: #ccc;
  font-weight: bold;
  font-size: 1.2rem;
  letter-spacing: 2px;
}

/* Attorneys */
.attorneys {
  padding: 80px 0;
  background: #fff;
  text-align: center;
}
.attorney-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
}
.attorney-card img {
  width: 100%;
  height: 300px;
  object-fit: cover;
  margin-bottom: 20px;
}
.attorney-card h4 {
  font-size: 1.3rem;
  margin-bottom: 5px;
}
.attorney-card span {
  color: var(--primary);
  font-size: 0.9rem;
  display: block;
  margin-bottom: 15px;
}
.attorney-card p {
  color: var(--text-muted);
  font-size: 0.9rem;
}

/* Contact Form Section */
.contact-section {
  background: var(--text-dark);
  color: #fff;
  display: flex;
  align-items: stretch;
}
.contact-left {
  flex: 1;
  padding: 80px 5%;
}
.contact-left h2 {
  color: #fff;
  font-size: 2.5rem;
  margin-bottom: 10px;
}
.contact-left p {
  margin-bottom: 30px;
  color: #ccc;
}
.contact-left input, .contact-left textarea {
  width: 100%;
  padding: 15px;
  margin-bottom: 15px;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  color: #fff;
  font-family: inherit;
}
.contact-left input::placeholder, .contact-left textarea::placeholder {
  color: #aaa;
}
.contact-right {
  flex: 1;
  background-image: url('/assets/templates/LawFirm/templates01/image2.jpg');
  background-size: cover;
  background-position: center;
}

/* Footer */
.footer {
  background: #111;
  color: #aaa;
  padding: 80px 0 20px;
}
.footer-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 40px;
  margin-bottom: 40px;
}
.footer-col h4 {
  color: #fff;
  font-size: 1.2rem;
  margin-bottom: 20px;
  position: relative;
  padding-bottom: 10px;
}
.footer-col h4::after {
  content: '';
  position: absolute;
  left: 0; bottom: 0;
  width: 30px; height: 2px;
  background: var(--primary);
}
.footer-col ul {
  list-style: none;
}
.footer-col ul li {
  margin-bottom: 10px;
}
.footer-bottom {
  text-align: center;
  border-top: 1px solid #333;
  padding-top: 20px;
  font-size: 0.9rem;
}

@media (max-width: 991px) {
  .features-inner, .banner, .testi-news-layout, .contact-section { flex-direction: column; }
  .practice-grid, .attorney-grid, .footer-grid { grid-template-columns: repeat(2, 1fr); }
  .features-grid { grid-template-columns: 1fr; }
  .hero h1 { font-size: 3rem; }
  .contact-right { min-height: 400px; }
}
@media (max-width: 768px) {
  .practice-grid, .attorney-grid, .footer-grid { grid-template-columns: 1fr; }
  .nav-links { display: none; }
  .top-bar { display: none; }
}
/* Tabs Section */
.tabs-section { padding: 6rem 0; background: linear-gradient(135deg, rgba(var(--secondary-rgb), 0.05) 0%, rgba(var(--primary-rgb), 0.02) 100%); position: relative; overflow: hidden; }
.tabs-header { text-align: center; max-width: 750px; margin: 0 auto 4rem; }
.tabs-header h2 { font-size: 2.8rem; margin-bottom: 1rem; }
.tabs-header p { color: var(--text-muted); font-size: 1.1rem; margin-top: 1rem; }

.tabs-container { display: grid; grid-template-columns: 1fr 1.5fr; gap: 3rem; align-items: start; max-width: 1000px; margin: 0 auto; z-index: 2; position: relative; }
.tab-list { display: flex; flex-wrap: wrap; flex-direction: column; gap: 1rem; }
.tab-item { background: #fff; padding: 1.25rem 1.5rem; border-radius: 8px; display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; font-weight: 600; cursor: pointer; transition: 0.3s; box-shadow: 0 4px 10px rgba(0,0,0,0.02); }
.tab-item:hover { background: rgba(0,0,0,0.02); }
.tab-icon { width: 28px; height: 28px; border-radius: 50%; border: 1px solid rgba(0,0,0,0.1); display: inline-flex; flex-wrap: wrap; justify-content: center; align-items: center; transition: 0.3s; color: inherit; }
.tab-content-box { display: none; background: #fff; padding: 2.5rem; border-radius: 16px; box-shadow: 0 10px 40px rgba(0,0,0,0.05); }

/* Published Mode (JS Tabs) */
body.js-enabled .tab-content-box.active { display: block; animation: tabFadeIn 0.4s ease-out; }
body.js-enabled .tab-item.active, .tab-item.active { background: var(--primary) !important; color: #ffffff !important; }
body.js-enabled .tab-item.active .tab-icon, .tab-item.active .tab-icon { border-color: transparent; background: rgba(255,255,255,0.2); transform: rotate(90deg); color: #ffffff !important; }

/* Fallback if active class is missing */
body.js-enabled .tab-content-wrapper:not(:has(.tab-content-box.active)) .tab-content-box:first-child { display: block; animation: tabFadeIn 0.4s ease-out; }
body.js-enabled .tab-list:not(:has(.tab-item.active)) .tab-item:first-child { background: var(--primary); color: #fff; }
body.js-enabled .tab-list:not(:has(.tab-item.active)) .tab-item:first-child .tab-icon { border-color: transparent; background: rgba(255,255,255,0.2); transform: rotate(90deg); }

/* Editor Mode Horizontal Scroll (When JS is disabled in GrapesJS) */
body:not(.js-enabled) .tab-content-wrapper {
  display: flex!important; flex-wrap: wrap;
  overflow-x: auto !important;
  gap: 2rem;
  padding-bottom: 1rem;
  scroll-snap-type: x mandatory;
}
body:not(.js-enabled) .tab-content-box {
  display: block !important;
  flex: 0 0 100% !important;
  min-width: 100%;
  scroll-snap-align: center;
}
body:not(.js-enabled) .tab-content-wrapper::-webkit-scrollbar { height: 8px; }
body:not(.js-enabled) .tab-content-wrapper::-webkit-scrollbar-thumb { background: var(--primary); border-radius: 4px; }

@keyframes tabFadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

.tab-content-box h3 { font-size: 1.8rem; margin-bottom: 1rem; }
.tab-content-box p { color: var(--text-muted); margin-bottom: 1.5rem; }
.tab-content-box img { width: 100%; height: 240px; object-fit: cover; border-radius: 8px; margin-bottom: 1.5rem; }
.link-primary { color: var(--primary); font-weight: 600; display: inline-flex; flex-wrap: wrap; align-items: center; gap: 5px; }
.link-primary:hover { gap: 8px; }

.tabs-action { text-align: center; margin-top: 3rem; position: relative; z-index: 2; }

`;

export const law05Html = `
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" />
  <script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>

  <div class="top-bar">
    <div class="container top-bar-inner">
      <div class="top-bar-item"><i class="fas fa-envelope"></i> example@lawfirm.com</div>
      <div class="top-bar-item"><i class="fas fa-phone"></i> +1 (123) 456-7890</div>
      <div class="social-links">
        <a href="javascript:void(0);"><i class="fab fa-facebook-f"></i></a>
        <a href="javascript:void(0);"><i class="fab fa-twitter"></i></a>
        <a href="javascript:void(0);"><i class="fab fa-linkedin-in"></i></a>
      </div>
    </div>
  </div>

  <header class="header">
    <div class="container header-inner">
      <div class="logo">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
        <span>LAWYER BASE</span>
      </div>
    </div>
  </header>

  <section class="hero">
    <div class="container hero-content">
      <span class="hero-subtitle">Professional</span>
      <h1>LAW FIRM</h1>
      <p>We are a leading law firm in the financial and business industry with more than 20 years of experience.</p>
      <a href="javascript:void(0);" class="btn btn-primary">Contact Now</a>
    </div>
  </section>

  <section class="banner">
    <div class="banner-left">
      <i class="fas fa-balance-scale"></i>
      <div>
        <h3>We are the best full-service firm based in New York</h3>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
      </div>
    </div>
    <div class="banner-right">
      <div class="banner-right-content">
        <h3>Something About Us</h3>
        <p style="color:var(--text-muted);">William Alexander, Founder</p>
      </div>
    </div>
  </section>

  <section class="features-section">
    <div class="container features-inner">
      <div class="features-image">
        <img src="/assets/templates/LawFirm/templates02/lawyer1.jpg" alt="Lawyer" style="border-radius: 4px; box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
      </div>
      <div class="features-grid">
        <div class="feature-item">
          <i class="fas fa-gavel feature-icon"></i>
          <div>
            <h4>Expert Legal Advice</h4>
            <p>Our team of highly qualified attorneys provides top-tier legal guidance.</p>
          </div>
        </div>
        <div class="feature-item">
          <i class="fas fa-users feature-icon"></i>
          <div>
            <h4>Client-Centric Approach</h4>
            <p>We prioritize your needs and work tirelessly to achieve the best outcome.</p>
          </div>
        </div>
        <div class="feature-item">
          <i class="fas fa-handshake feature-icon"></i>
          <div>
            <h4>Trusted Representation</h4>
            <p>Years of experience in the courtroom ensuring your voice is heard.</p>
          </div>
        </div>
        <div class="feature-item">
          <i class="fas fa-chart-line feature-icon"></i>
          <div>
            <h4>Proven Track Record</h4>
            <p>Consistently delivering favorable results in complex litigation cases.</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="cta-banner">
    <div class="container">
      <h2>Are you having any problems but can't consult to anyone?</h2>
      <p>To find out more about how we can help you, call us now at</p>
      <div class="phone"><i class="fas fa-phone-alt"></i> +1 (123) 456-7890</div>
    </div>
  </section>

  <section class="practice-section">
    <div class="container">
      <h2 class="section-title">Legal Practice Areas</h2>
      <div class="practice-grid">
        <div class="practice-card">
          <img src="/assets/templates/LawFirm/templates01/image3.jpg" alt="Real Estate Law">
          <h4>Real Estate Law</h4>
        </div>
        <div class="practice-card">
          <img src="/assets/templates/LawFirm/templates01/image4.jpg" alt="Car Accident">
          <h4>Car Accident</h4>
        </div>
        <div class="practice-card">
          <img src="/assets/templates/LawFirm/templates01/image5.jpg" alt="Personal Injury">
          <h4>Personal Injury</h4>
        </div>
        <div class="practice-card">
          <img src="/assets/templates/LawFirm/templates01/image6.jpg" alt="Family Law">
          <h4>Family Law</h4>
        </div>
        <div class="practice-card">
          <img src="/assets/templates/LawFirm/templates01/image7.jpg" alt="Capital Market">
          <h4>Capital Market</h4>
        </div>
        <div class="practice-card">
          <img src="/assets/templates/LawFirm/templates01/image8.jpg" alt="Employment Law">
          <h4>Employment Law</h4>
        </div>
        <div class="practice-card">
          <img src="/assets/templates/LawFirm/templates01/image9.jpg" alt="Corporate Law">
          <h4>Corporate Law</h4>
        </div>
        <div class="practice-card">
          <img src="/assets/templates/LawFirm/templates01/image10.jpg" alt="Dispute Resolution">
          <h4>Dispute Resolution</h4>
        </div>
      </div>
    </div>
  </section>

  <section class="testi-news">
    <div class="container testi-news-layout">
      <div class="testi-left">
        <div class="section-header">
          <h3>Testimonials</h3>
        </div>
        <div data-gjs-type="swiper-container" class="swiper-container slider" data-slides-per-view="1" data-pagination="bullets" style="overflow:hidden; padding-bottom: 20px;">
          <div data-gjs-type="swiper-wrapper" class="swiper-wrapper">
            <div data-gjs-type="swiper-slide" class="swiper-slide testi-content">
              <div class="testi-author">
                <img src="/assets/templates/LawFirm/templates01/image2.jpg" alt="Author">
                <div>
                  <h5>Lynda M. Ashley, Smith</h5>
                </div>
              </div>
              <p>"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris."</p>
              <a href="javascript:void(0);" class="read-more">Contact Attorney</a>
            </div>
            <div data-gjs-type="swiper-slide" class="swiper-slide testi-content">
              <div class="testi-author">
                <img src="/assets/templates/LawFirm/templates01/image3.jpg" alt="Author">
                <div>
                  <h5>Robert J. Stevens</h5>
                </div>
              </div>
              <p>"Absolutely fantastic representation. The team handled my corporate dispute with incredible precision. They guided us every step of the way."</p>
              <a href="javascript:void(0);" class="read-more">Contact Attorney</a>
            </div>
            <div data-gjs-type="swiper-slide" class="swiper-slide testi-content">
              <div class="testi-author">
                <img src="/assets/templates/LawFirm/templates01/image4.jpg" alt="Author">
                <div>
                  <h5>Amanda C. Lewis</h5>
                </div>
              </div>
              <p>"I felt completely supported during a very stressful time. Their empathetic approach and sharp legal strategy secured the best possible outcome."</p>
              <a href="javascript:void(0);" class="read-more">Contact Attorney</a>
            </div>
          </div>
          <div data-gjs-type="swiper-pagination" class="swiper-pagination"></div>
        </div>
      </div>
      <div class="testi-right">
        <div class="section-header">
          <h3>Recent News</h3>
        </div>
        <div class="news-list">
          <div class="news-item">
            <div class="news-date">
              <span class="day">12</span>
              <span class="month">Oct</span>
            </div>
            <div class="news-text">
              <h5>The best lawyers for your cases</h5>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
            </div>
          </div>
          <div class="news-item">
            <div class="news-date">
              <span class="day">15</span>
              <span class="month">Oct</span>
            </div>
            <div class="news-text">
              <h5>Top 10 legal advice from experts</h5>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
            </div>
          </div>
          <div class="news-item">
            <div class="news-date">
              <span class="day">20</span>
              <span class="month">Oct</span>
            </div>
            <div class="news-text">
              <h5>How to win your first case</h5>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="attorneys">
    <div class="container">
      <h2 class="section-title">Meet Our Attorneys</h2>
      <div class="attorney-grid">
        <div class="attorney-card">
          <img src="/assets/templates/LawFirm/templates02/lawyer3.jpg" alt="Jack Smith">
          <h4>Jack Smith</h4>
          <span>Senior Partner</span>
          <p>Expert in corporate law with over 20 years of experience in high-stakes litigation.</p>
        </div>
        <div class="attorney-card">
          <img src="/assets/templates/LawFirm/templates02/lawyer2.jpg" alt="Helen Monroe">
          <h4>Helen Monroe</h4>
          <span>Managing Partner</span>
          <p>Specializes in family law, offering compassionate and fiercely dedicated representation.</p>
        </div>
        <div class="attorney-card">
          <img src="/assets/templates/LawFirm/templates01/image15.jpg" alt="James Jones">
          <h4>James Jones</h4>
          <span>Associate Attorney</span>
          <p>A rising star in real estate law, known for meticulous attention to contract details.</p>
        </div>
        <div class="attorney-card">
          <img src="/assets/templates/LawFirm/templates01/image17.jpg" alt="John Doe">
          <h4>John Doe</h4>
          <span>Criminal Defense</span>
          <p>Relentless advocate defending the rights of individuals in complex criminal cases.</p>
        </div>
      </div>
    </div>
  </section>

  <section class="contact-section" id="contact">
    <div class="contact-left">
      <h2>Don't hesitate to ask</h2>
      <p>Fill out the form below and one of our experts will get back to you shortly.</p>
      <form onsubmit="event.preventDefault(); alert('Message sent!');">
        <input type="text" placeholder="Your Name" required>
        <input type="email" placeholder="Your Email" required>
        <input type="tel" placeholder="Your Phone" required>
        <textarea placeholder="Message" rows="5" required></textarea>
        <button type="submit" class="btn btn-primary" style="width: 100%;">Submit Request</button>
      </form>
    </div>
    <div class="contact-right"></div>
  </section>

  <section class="clients-section">
    <div class="container">
      <div class="section-header center">
        <h3>Some Of Our Clients</h3>
      </div>
      <div data-gjs-type="swiper-container" class="swiper-container clients-slider" data-slides-per-view="4" data-pagination="bullets" style="overflow:hidden; padding-bottom: 20px;">
        <div data-gjs-type="swiper-wrapper" class="swiper-wrapper clients-grid">
          <div data-gjs-type="swiper-slide" class="swiper-slide client-logo">GLOBAL CITY</div>
          <div data-gjs-type="swiper-slide" class="swiper-slide client-logo">Dreaming Case</div>
          <div data-gjs-type="swiper-slide" class="swiper-slide client-logo">YOUR LOGO</div>
          <div data-gjs-type="swiper-slide" class="swiper-slide client-logo">House Solar</div>
          <div data-gjs-type="swiper-slide" class="swiper-slide client-logo">AVOCADO</div>
        </div>
        <div data-gjs-type="swiper-pagination" class="swiper-pagination"></div>
      </div>
    </div>
  </section>

  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-col">
          <h4>About Us</h4>
          <p>LAWYER BASE is a premier law firm dedicated to providing exceptional legal services with integrity and professionalism.</p>
        </div>
        <div class="footer-col">
          <h4>Practice Areas</h4>
          <ul>
            <li><a href="javascript:void(0);">Family Law</a></li>
            <li><a href="javascript:void(0);">Corporate Law</a></li>
            <li><a href="javascript:void(0);">Real Estate</a></li>
            <li><a href="javascript:void(0);">Criminal Defense</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Contact Info</h4>
          <p><i class="fas fa-map-marker-alt"></i> 123 Legal Avenue, New York, NY</p>
          <p><i class="fas fa-phone"></i> +1 (123) 456-7890</p>
          <p><i class="fas fa-envelope"></i> contact@lawyerbase.com</p>
        </div>
        <div class="footer-col">
          <h4>Business Hours</h4>
          <ul>
            <li>Mon - Fri: 9:00 AM - 6:00 PM</li>
            <li>Saturday: 10:00 AM - 2:00 PM</li>
            <li>Sunday: Closed</li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        &copy; 2026 LAWYER BASE. All rights reserved.
      </div>
    </div>
  </footer>

  <script id="core-interactions">
    (function() {
      var isInEditor = !!document.querySelector('[data-gjs-type]') || document.body.classList.contains('gjs-dashed');
      
      if (!isInEditor && typeof Swiper !== 'undefined') {
        var sliders = document.querySelectorAll('.swiper-container');
        sliders.forEach(function(s) {
          var isClients = s.classList.contains('clients-slider');
          new Swiper(s, {
            slidesPerView: isClients ? 2 : 1,
            spaceBetween: 20,
            loop: true,
            pagination: {
              el: s.querySelector('.swiper-pagination'),
              clickable: true,
            },
            breakpoints: isClients ? {
              768: { slidesPerView: 3, spaceBetween: 20 },
              992: { slidesPerView: 4, spaceBetween: 30 }
            } : {}
          });
        });
      }
    })();
  </script>
`;
