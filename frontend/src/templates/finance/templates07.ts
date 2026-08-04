export const finance07Styles = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&family=Rubik:wght@400;500;600;700&display=swap');

:root {
  --primary: PRIMARY_COLOR_PLACEHOLDER;
  --secondary: SECONDARY_COLOR_PLACEHOLDER;
  
  --bg-light: #ffffff;
  --bg-gray: #f4f7fb;
  --text-dark: #1a1a2e;
  --text-gray: #6b7280;
  
  --shadow-card: 0 15px 35px rgba(0, 0, 0, 0.05);
  --shadow-hover: 0 20px 40px rgba(0, 0, 0, 0.1);
}

* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Rubik', sans-serif; background-color: var(--bg-light); color: var(--text-dark); line-height: 1.6; overflow-x: hidden; }
h1, h2, h3, h4, h5, h6 { font-family: 'Poppins', sans-serif; font-weight: 700; color: var(--text-dark); }

.container { max-width: 1200px; margin: 0 auto; padding: 0 24px; position: relative; z-index: 2; }
a { text-decoration: none; color: inherit; transition: 0.3s ease; }
img { max-width: 100%; display: block; object-fit: cover; }
.btn { display: inline-flex; align-items: center; justify-content: center; padding: 14px 30px; border-radius: 50px; font-weight: 600; font-family: 'Poppins', sans-serif; cursor: pointer; transition: 0.3s; border: none; }
.btn-primary { background: var(--primary); color: #fff; box-shadow: 0 8px 20px color-mix(in srgb, var(--primary) 40%, transparent); }
.btn-primary:hover { transform: translateY(-3px); box-shadow: 0 12px 25px color-mix(in srgb, var(--primary) 60%, transparent); }
.btn-outline { background: transparent; color: var(--primary); border: 2px solid var(--primary); }
.btn-outline:hover { background: var(--primary); color: #fff; }

/* CHHOTE CHHOTE SHAPES (Small Decorative Elements) */
.deco-shape { position: absolute; z-index: 1; pointer-events: none; animation: floatShape 6s infinite ease-in-out alternate; }
.deco-circle { width: 30px; height: 30px; border-radius: 50%; border: 4px solid var(--secondary); opacity: 0.6; }
.deco-dot { width: 15px; height: 15px; border-radius: 50%; background: var(--primary); opacity: 0.5; animation-delay: 1s; }
.deco-plus { width: 30px; height: 30px; position: relative; opacity: 0.5; animation-delay: 2s; }
.deco-plus::before, .deco-plus::after { content: ''; position: absolute; background: var(--text-dark); border-radius: 4px; }
.deco-plus::before { top: 13px; left: 0; width: 100%; height: 4px; }
.deco-plus::after { left: 13px; top: 0; height: 100%; width: 4px; }
.deco-triangle { width: 0; height: 0; border-left: 15px solid transparent; border-right: 15px solid transparent; border-bottom: 25px solid var(--primary); opacity: 0.4; animation: spinShape 10s infinite linear; }
.deco-square { width: 25px; height: 25px; border: 4px solid var(--secondary); transform: rotate(45deg); opacity: 0.6; animation: spinShape 8s infinite linear reverse; }

@keyframes floatShape { 0% { transform: translateY(0) rotate(0); } 100% { transform: translateY(-20px) rotate(15deg); } }
@keyframes spinShape { 0% { transform: rotate(0); } 100% { transform: rotate(360deg); } }

/* Section Padding */
.section-pad { padding: 100px 0; position: relative; overflow: hidden; }

/* 1. Header */
.header-07 { position: fixed; top: 0; left: 0; width: 100%; z-index: 100; background: rgba(255, 255, 255, 0.95); box-shadow: 0 4px 20px rgba(0,0,0,0.03); padding: 15px 0; }
.header-inner { display: flex; justify-content: space-between; align-items: center; }
.logo { font-size: 26px; font-weight: 800; font-family: 'Poppins', sans-serif; display: flex; align-items: center; gap: 8px; color: var(--text-dark); }
.logo span { color: var(--primary); }
.nav-links { display: flex; gap: 35px; }
.nav-links a { font-weight: 500; font-size: 15px; color: var(--text-dark); }
.nav-links a:hover { color: var(--primary); }

/* 2. Hero Section */
.hero-07 { padding: 160px 0 100px; background: var(--bg-gray); position: relative; overflow: hidden; }
/* Decorative elements for Hero */
.hero-07 .dc-1 { top: 20%; left: 10%; }
.hero-07 .dc-2 { bottom: 20%; left: 45%; }
.hero-07 .dt-1 { top: 30%; right: 40%; }
.hero-07 .ds-1 { bottom: 30%; right: 10%; }

.hero-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }
.hero-content h1 { font-size: 55px; line-height: 1.2; margin-bottom: 25px; }
.hero-content h1 span { color: var(--primary); }
.hero-content p { font-size: 18px; color: var(--text-gray); margin-bottom: 35px; max-width: 500px; }
.hero-btns { display: flex; gap: 20px; }

/* Photo me shape (Hero Image) */
.hero-img-wrap { position: relative; display: flex; justify-content: center; }
.hero-img-shape { width: 450px; height: 500px; border-radius: 30% 70% 53% 47% / 46% 36% 64% 54%; background: var(--primary); padding: 10px; box-shadow: var(--shadow-card); animation: morphHero 8s ease-in-out infinite alternate; position: relative; z-index: 2; }
.hero-img-shape img { width: 100%; height: 100%; object-fit: cover; border-radius: 30% 70% 53% 47% / 46% 36% 64% 54%; animation: morphHero 8s ease-in-out infinite alternate; }
.hero-img-bg { position: absolute; width: 450px; height: 500px; border-radius: 50% 50% 30% 70% / 60% 40% 60% 40%; background: var(--secondary); top: 20px; right: -20px; opacity: 0.3; z-index: 1; }
@keyframes morphHero { 0% { border-radius: 30% 70% 53% 47% / 46% 36% 64% 54%; } 100% { border-radius: 54% 46% 36% 64% / 36% 53% 47% 64%; } }

/* 3. Logos Section */
.logos-07 { padding: 50px 0; border-bottom: 1px solid #eaeaea; background: #fff; }
.logos-wrap { display: flex; justify-content: space-between; align-items: center; opacity: 0.5; font-family: 'Poppins', sans-serif; font-weight: 700; font-size: 22px; flex-wrap: wrap; gap: 30px; }

/* 4. About (Split Section with Polygon Photo Shape) */
.about-07 { background: #fff; }
/* Decorators for About */
.about-07 .dd-1 { top: 10%; right: 5%; }
.about-07 .dp-1 { bottom: 10%; left: 5%; }

.about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 70px; align-items: center; }
/* Photo me shape (Polygon) */
.about-img-wrap { position: relative; }
.about-img { width: 100%; height: 500px; clip-path: polygon(10% 0, 100% 0, 90% 100%, 0 100%); object-fit: cover; z-index: 2; position: relative; }
.about-img-bg { position: absolute; top: -15px; left: -15px; width: 100%; height: 100%; background: var(--primary); clip-path: polygon(10% 0, 100% 0, 90% 100%, 0 100%); z-index: 1; opacity: 0.2; }
.section-tag { display: inline-block; padding: 6px 15px; background: color-mix(in srgb, var(--primary) 15%, transparent); color: var(--primary); font-weight: 600; border-radius: 30px; margin-bottom: 15px; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; }
.about-content h2 { font-size: 42px; margin-bottom: 20px; line-height: 1.2; }
.about-content p { color: var(--text-gray); font-size: 17px; margin-bottom: 30px; }
.check-list { list-style: none; display: flex; flex-direction: column; gap: 15px; margin-bottom: 30px; }
.check-list li { display: flex; align-items: center; gap: 12px; font-weight: 500; }
.check-list i { color: #fff; background: var(--secondary); width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; }

/* 5. Services Section */
.services-07 { background: var(--bg-gray); text-align: center; }
/* Decorators */
.services-07 .dc-1 { top: 50px; left: 10%; }
.services-07 .dt-1 { top: 150px; right: 15%; }

.services-07 h2 { font-size: 42px; margin-bottom: 15px; }
.services-07 .sec-desc { color: var(--text-gray); max-width: 600px; margin: 0 auto 60px; font-size: 17px; }
.serv-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; }
.serv-card { background: #fff; padding: 40px 30px; border-radius: 20px; box-shadow: var(--shadow-card); transition: 0.3s; position: relative; overflow: hidden; z-index: 2; text-align: left; }
.serv-card:hover { transform: translateY(-10px); box-shadow: var(--shadow-hover); }
/* Small shape inside card */
.serv-card::before { content: ''; position: absolute; top: -30px; right: -30px; width: 100px; height: 100px; background: color-mix(in srgb, var(--primary) 10%, transparent); border-radius: 50%; z-index: -1; transition: 0.4s; }
.serv-card:hover::before { transform: scale(3); opacity: 0.5; }
.serv-icon { width: 60px; height: 60px; background: color-mix(in srgb, var(--primary) 15%, transparent); color: var(--primary); border-radius: 15px; display: flex; align-items: center; justify-content: center; font-size: 28px; margin-bottom: 25px; }
.serv-card h3 { font-size: 22px; margin-bottom: 15px; }
.serv-card p { color: var(--text-gray); font-size: 15px; margin-bottom: 20px; }
.serv-card a { color: var(--primary); font-weight: 600; font-size: 14px; display: inline-flex; align-items: center; gap: 5px; }

/* 6. Statistics */
.stats-07 { padding: 80px 0; background: var(--text-dark); color: #fff; position: relative; }
.stats-07 .dp-1 { filter: invert(1); top: 30%; left: 5%; }
.stats-grid { display: flex; justify-content: space-around; flex-wrap: wrap; gap: 40px; }
.stat-item { text-align: center; position: relative; }
/* Shape behind number */
.stat-item::before { content: ''; position: absolute; top: -10px; left: 50%; transform: translateX(-50%); width: 60px; height: 60px; background: var(--primary); opacity: 0.2; border-radius: 50%; z-index: 0; }
.stat-item h3 { font-size: 50px; color: #fff; margin-bottom: 5px; position: relative; z-index: 1; }
.stat-item p { color: #a0a0b0; font-weight: 500; font-size: 16px; text-transform: uppercase; letter-spacing: 1px; position: relative; z-index: 1; }

/* 7. How it Works (Process with connection) */
.process-07 { background: #fff; text-align: center; }
.process-07 h2 { font-size: 42px; margin-bottom: 60px; }
.process-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; position: relative; }
/* Connecting line shape */
.process-grid::before { content: ''; position: absolute; top: 45px; left: 15%; width: 70%; height: 2px; border-top: 2px dashed var(--border-subtle); z-index: 0; }
.step { position: relative; z-index: 1; }
.step-icon { width: 90px; height: 90px; background: #fff; border: 3px solid var(--primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 32px; color: var(--primary); margin: 0 auto 25px; box-shadow: 0 10px 20px rgba(0,0,0,0.05); }
.step h3 { font-size: 22px; margin-bottom: 15px; }
.step p { color: var(--text-gray); font-size: 15px; padding: 0 20px; }

/* 8. Testimonial (Photo in Hexagon Shape) */
.test-07 { background: var(--bg-gray); }
.test-07 .ds-1 { top: 20%; right: 10%; }
.test-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }
/* Photo me shape (Hexagon) */
.test-img-wrap { position: relative; }
.test-img { width: 400px; height: 450px; clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%); object-fit: cover; margin: 0 auto; display: block; z-index: 2; position: relative; }
.test-img-bg { position: absolute; top: 15px; left: 15px; width: 400px; height: 450px; background: var(--primary); opacity: 0.2; clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%); margin: 0 auto; left: 0; right: 0; transform: translateX(15px); }
.test-content i { font-size: 40px; color: var(--secondary); margin-bottom: 25px; }
.test-content p { font-size: 22px; font-weight: 500; font-style: italic; line-height: 1.6; margin-bottom: 30px; color: var(--text-dark); }
.author h4 { font-size: 20px; margin-bottom: 5px; }
.author span { color: var(--text-gray); font-size: 14px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; }

/* 9. Pricing */
.pricing-07 { background: #fff; text-align: center; }
.pricing-07 h2 { font-size: 42px; margin-bottom: 15px; }
.pricing-07 .sec-desc { color: var(--text-gray); font-size: 17px; margin-bottom: 60px; }
.price-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; }
.price-card { background: #fff; border: 1px solid #eaeaea; border-radius: 20px; padding: 50px 30px; box-shadow: var(--shadow-card); position: relative; transition: 0.3s; z-index: 1; overflow: hidden; }
/* Small shape inside pricing card */
.price-card::after { content: ''; position: absolute; bottom: -50px; left: -50px; width: 150px; height: 150px; background: var(--bg-gray); border-radius: 50%; z-index: -1; }
.price-card:hover { transform: translateY(-10px); box-shadow: var(--shadow-hover); border-color: var(--primary); }
.price-card.popular { background: var(--primary); color: #fff; transform: scale(1.05); border: none; }
.price-card.popular::after { background: rgba(255,255,255,0.1); }
.price-card.popular:hover { transform: scale(1.05) translateY(-10px); }
.p-name { font-size: 20px; font-weight: 600; text-transform: uppercase; margin-bottom: 20px; letter-spacing: 1px; }
.p-price { font-size: 50px; font-family: 'Poppins', sans-serif; font-weight: 700; margin-bottom: 30px; }
.p-price span { font-size: 16px; font-weight: 500; color: var(--text-gray); font-family: 'Rubik', sans-serif; }
.price-card.popular .p-price span { color: rgba(255,255,255,0.8); }
.p-features { list-style: none; margin-bottom: 40px; text-align: left; }
.p-features li { padding: 10px 0; border-bottom: 1px solid #eaeaea; font-size: 15px; display: flex; align-items: center; gap: 10px; }
.price-card.popular .p-features li { border-color: rgba(255,255,255,0.2); }
.p-features i { color: var(--primary); }
.price-card.popular .p-features i { color: #fff; }
.price-card .btn { width: 100%; }
.price-card.popular .btn { background: #fff; color: var(--primary); box-shadow: none; }
.price-card.popular .btn:hover { background: var(--secondary); color: #fff; }

/* 10. Contact / Footer + Premium Form */
.footer-07 { background: var(--text-dark); color: #fff; padding: 100px 0 30px; position: relative; }
/* Decorative shape in footer */
.footer-07 .dd-1 { background: #fff; opacity: 0.1; top: 10%; right: 10%; }

.footer-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; margin-bottom: 80px; align-items: center; }
.footer-info h2 { font-size: 42px; color: #fff; margin-bottom: 20px; line-height: 1.2; }
.footer-info p { color: #a0a0b0; font-size: 17px; margin-bottom: 40px; }
.c-details { display: flex; flex-direction: column; gap: 20px; margin-bottom: 40px; }
.c-row { display: flex; align-items: center; gap: 15px; }
.c-icon { width: 45px; height: 45px; background: rgba(255,255,255,0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--primary); font-size: 18px; }
.c-text h4 { font-size: 16px; color: #fff; margin-bottom: 3px; }
.c-text p { font-size: 14px; color: #a0a0b0; }

/* Premium Form Styles - Light Theme Embedded inside Footer */
.premium-form-07 { background: #fff; padding: 40px; border-radius: 20px; box-shadow: var(--shadow-card); color: var(--text-dark); position: relative; }
/* Small shape on form */
.premium-form-07::before { content: ''; position: absolute; top: -15px; right: -15px; width: 60px; height: 60px; background: var(--secondary); border-radius: 15px; z-index: -1; }
.premium-form-07 h3 { font-size: 26px; margin-bottom: 25px; }
.premium-form-07 form { display: flex; flex-direction: column; gap: 20px; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.premium-form-07 input, .premium-form-07 textarea { width: 100%; padding: 16px 20px; background: var(--bg-gray); border: 1px solid #eaeaea; border-radius: 10px; font-family: 'Rubik', sans-serif; font-size: 15px; outline: none; transition: 0.3s; color: var(--text-dark); }
.premium-form-07 input::placeholder, .premium-form-07 textarea::placeholder { color: #9ca3af; }
.premium-form-07 input:focus, .premium-form-07 textarea:focus { border-color: var(--primary); background: #fff; box-shadow: 0 0 0 4px color-mix(in srgb, var(--primary) 10%, transparent); }
.premium-form-07 button { width: 100%; font-size: 16px; padding: 18px; border-radius: 10px; margin-top: 10px; }

.footer-bottom { padding-top: 30px; border-top: 1px solid rgba(255,255,255,0.1); display: flex; justify-content: space-between; align-items: center; color: #a0a0b0; font-size: 14px; }
.socials { display: flex; gap: 15px; }
.socials a { color: #fff; background: rgba(255,255,255,0.1); width: 35px; height: 35px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: 0.3s; }
.socials a:hover { background: var(--primary); transform: translateY(-3px); }

@media (max-width: 1024px) {
  .hero-grid, .about-grid, .test-grid, .footer-grid { grid-template-columns: 1fr; }
  .serv-grid, .price-grid { grid-template-columns: repeat(2, 1fr); }
  .price-card.popular { transform: scale(1); }
  .process-grid::before { display: none; }
  .process-grid { grid-template-columns: 1fr; gap: 30px; }
}
@media (max-width: 768px) {
  .nav-links { display: none; }
  .hero-content h1 { font-size: 42px; }
  .serv-grid, .price-grid, .form-row { grid-template-columns: 1fr; }
  .hero-img-shape, .hero-img-bg { width: 100%; max-width: 400px; height: auto; aspect-ratio: 4/5; }
}
`;

export const finance07Html = `
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&family=Rubik:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">

<!-- 1. Header -->
<header class="header-07">
  <div class="container header-inner">
    <div class="logo"><i class="fa-solid fa-chart-pie"></i> LOGO_PLACEHOLDER</div>
    <nav class="nav-links">
      <a href="#about">About</a>
      <a href="#services">Services</a>
      <a href="#pricing">Pricing</a>
      <a href="#contact">Contact</a>
    </nav>
    <a href="#contact" class="btn btn-primary">Free Consultation</a>
  </div>
</header>

<main>
  <!-- 2. Hero Section (With Shapes) -->
  <section class="hero-07">
    <div class="deco-shape deco-circle dc-1"></div>
    <div class="deco-shape deco-circle dc-2"></div>
    <div class="deco-shape deco-triangle dt-1"></div>
    <div class="deco-shape deco-square ds-1"></div>
    
    <div class="container hero-grid">
      <div class="hero-content">
        <span class="section-tag" style="background: rgba(0,0,0,0.05); color: var(--text-dark); margin-bottom: 15px;">Smart Financial Solutions</span>
        <h1>Grow your wealth with <span>confidence.</span></h1>
        <p>We provide expert financial advice, investment strategies, and corporate planning to help you secure a profitable future.</p>
        <div class="hero-btns">
          <a href="#contact" class="btn btn-primary">Get Started Now</a>
          <a href="#about" class="btn btn-outline">Learn More</a>
        </div>
      </div>
      <div class="hero-img-wrap">
        <div class="hero-img-bg"></div>
        <div class="hero-img-shape">
          <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800" alt="Financial Advisor">
        </div>
      </div>
    </div>
  </section>

  <!-- 3. Logos Section -->
  <section class="logos-07">
    <div class="container logos-wrap">
      <div>FORBES</div>
      <div>BLOOMBERG</div>
      <div>CNBC</div>
      <div>YAHOO FINANCE</div>
      <div>WSJ</div>
    </div>
  </section>

  <!-- 4. About (Polygon Shape) -->
  <section class="about-07 section-pad" id="about">
    <div class="deco-shape deco-dot dd-1"></div>
    <div class="deco-shape deco-plus dp-1"></div>
    
    <div class="container about-grid">
      <div class="about-img-wrap">
        <div class="about-img-bg"></div>
        <img src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1000&q=80" alt="Corporate Meeting" class="about-img">
      </div>
      <div class="about-content">
        <span class="section-tag">About Our Firm</span>
        <h2>Over 30 years of excellence in finance.</h2>
        <p>Our team of seasoned experts has been navigating the complexities of global markets, delivering unmatched results and stability for our clients.</p>
        <ul class="check-list">
          <li><i class="fa-solid fa-check"></i> Certified Financial Planners (CFP)</li>
          <li><i class="fa-solid fa-check"></i> Transparent fee structures</li>
          <li><i class="fa-solid fa-check"></i> Tailored investment strategies</li>
        </ul>
        <a href="#services" class="btn btn-primary" style="margin-top: 15px;">Explore Services</a>
      </div>
    </div>
  </section>

  <!-- 5. Services Section -->
  <section class="services-07 section-pad" id="services">
    <div class="deco-shape deco-circle dc-1"></div>
    <div class="deco-shape deco-triangle dt-1"></div>
    
    <div class="container">
      <span class="section-tag">What We Do</span>
      <h2>Our Premium Services</h2>
      <p class="sec-desc">We offer a comprehensive suite of financial services designed to protect and grow your assets across generations.</p>
      
      <div class="serv-grid">
        <div class="serv-card">
          <div class="serv-icon"><i class="fa-solid fa-briefcase"></i></div>
          <h3>Wealth Management</h3>
          <p>Holistic portfolio management that balances risk with long-term growth objectives.</p>
          <a href="#">Read Details <i class="fa-solid fa-arrow-right"></i></a>
        </div>
        <div class="serv-card">
          <div class="serv-icon"><i class="fa-solid fa-chart-line"></i></div>
          <h3>Corporate Finance</h3>
          <p>Strategic advisory for mergers, acquisitions, and capital restructuring.</p>
          <a href="#">Read Details <i class="fa-solid fa-arrow-right"></i></a>
        </div>
        <div class="serv-card">
          <div class="serv-icon"><i class="fa-solid fa-file-invoice-dollar"></i></div>
          <h3>Tax Optimization</h3>
          <p>Advanced tax-loss harvesting and estate planning to maximize your returns.</p>
          <a href="#">Read Details <i class="fa-solid fa-arrow-right"></i></a>
        </div>
      </div>
    </div>
  </section>

  <!-- 6. Statistics -->
  <section class="stats-07">
    <div class="deco-shape deco-plus dp-1"></div>
    <div class="container stats-grid">
      <div class="stat-item">
        <h3>$12B+</h3>
        <p>Assets Under Management</p>
      </div>
      <div class="stat-item">
        <h3>15K+</h3>
        <p>Satisfied Clients</p>
      </div>
      <div class="stat-item">
        <h3>120+</h3>
        <p>Expert Advisors</p>
      </div>
      <div class="stat-item">
        <h3>35</h3>
        <p>Years of Experience</p>
      </div>
    </div>
  </section>

  <!-- 7. How it Works (Process) -->
  <section class="process-07 section-pad">
    <div class="container">
      <span class="section-tag">Our Process</span>
      <h2>How We Work With You</h2>
      
      <div class="process-grid">
        <div class="step">
          <div class="step-icon"><i class="fa-solid fa-comments"></i></div>
          <h3>1. Initial Discovery</h3>
          <p>We sit down to deeply understand your current financial standing and future goals.</p>
        </div>
        <div class="step">
          <div class="step-icon"><i class="fa-solid fa-chess-knight"></i></div>
          <h3>2. Strategy Blueprint</h3>
          <p>Our analysts create a customized, resilient financial plan tailored just for you.</p>
        </div>
        <div class="step">
          <div class="step-icon"><i class="fa-solid fa-rocket"></i></div>
          <h3>3. Execution & Growth</h3>
          <p>We implement the strategy and continuously monitor the markets to optimize results.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- 8. Testimonials (Hexagon Photo) -->
  <section class="test-07 section-pad">
    <div class="deco-shape deco-square ds-1"></div>
    <div class="container test-grid">
      <div class="test-img-wrap">
        <div class="test-img-bg"></div>
        <img src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=600" alt="Client" class="test-img">
      </div>
      <div class="test-content">
        <i class="fa-solid fa-quote-left"></i>
        <p>"Partnering with this firm was the turning point for our company. Their 30 years of experience truly shows in the way they handle market volatility. We've seen consistent, stress-free growth."</p>
        <div class="author">
          <h4>Amanda Richardson</h4>
          <span>Director at Apex Global</span>
        </div>
      </div>
    </div>
  </section>

  <!-- 9. Pricing -->
  <section class="pricing-07 section-pad" id="pricing">
    <div class="container">
      <span class="section-tag">Plans & Fees</span>
      <h2>Transparent Pricing</h2>
      <p class="sec-desc">Choose the advisory level that fits your personal or corporate needs.</p>
      
      <div class="price-grid">
        <div class="price-card">
          <h3 class="p-name">Basic Advisory</h3>
          <div class="p-price">$99<span>/mo</span></div>
          <ul class="p-features">
            <li><i class="fa-solid fa-check"></i> Automated Portfolio</li>
            <li><i class="fa-solid fa-check"></i> Standard Support</li>
            <li><i class="fa-solid fa-check"></i> Monthly Reports</li>
            <li style="color: #999;"><i class="fa-solid fa-xmark"></i> Dedicated Advisor</li>
          </ul>
          <a href="#contact" class="btn btn-outline">Select Plan</a>
        </div>
        <div class="price-card popular">
          <h3 class="p-name">Premium Wealth</h3>
          <div class="p-price">$299<span>/mo</span></div>
          <ul class="p-features">
            <li><i class="fa-solid fa-check"></i> Custom Portfolio Design</li>
            <li><i class="fa-solid fa-check"></i> Priority 24/7 Support</li>
            <li><i class="fa-solid fa-check"></i> Real-time Analytics</li>
            <li><i class="fa-solid fa-check"></i> Dedicated Advisor</li>
          </ul>
          <a href="#contact" class="btn btn-primary">Select Plan</a>
        </div>
        <div class="price-card">
          <h3 class="p-name">Corporate</h3>
          <div class="p-price">Custom</div>
          <ul class="p-features">
            <li><i class="fa-solid fa-check"></i> Enterprise Tax Planning</li>
            <li><i class="fa-solid fa-check"></i> M&A Advisory</li>
            <li><i class="fa-solid fa-check"></i> Daily Board Reports</li>
            <li><i class="fa-solid fa-check"></i> Dedicated Team</li>
          </ul>
          <a href="#contact" class="btn btn-outline">Contact Us</a>
        </div>
      </div>
    </div>
  </section>

  <!-- 10. Contact/Footer + Form -->
  <footer class="footer-07" id="contact">
    <div class="deco-shape deco-dot dd-1"></div>
    <div class="container">
      <div class="footer-grid">
        <div class="footer-info">
          <h2>Ready to secure your financial future?</h2>
          <p>Drop us a message and our senior advisors will get back to you within 24 hours.</p>
          
          <div class="c-details">
            <div class="c-row">
              <div class="c-icon"><i class="fa-solid fa-phone"></i></div>
              <div class="c-text">
                <h4>Phone</h4>
                <p>+1 (800) 123-4567</p>
              </div>
            </div>
            <div class="c-row">
              <div class="c-icon"><i class="fa-solid fa-envelope"></i></div>
              <div class="c-text">
                <h4>Email</h4>
                <p>advisors@finance07.com</p>
              </div>
            </div>
            <div class="c-row">
              <div class="c-icon"><i class="fa-solid fa-location-dot"></i></div>
              <div class="c-text">
                <h4>Office</h4>
                <p>450 Wall Street, New York, NY</p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="premium-form-07">
          <h3>Request a Consultation</h3>
          <form onsubmit="event.preventDefault();">
            <div class="form-row">
              <input type="text" placeholder="First Name" required>
              <input type="text" placeholder="Last Name" required>
            </div>
            <input type="email" placeholder="Email Address" required>
            <input type="tel" placeholder="Phone Number" required>
            <textarea placeholder="Tell us about your financial goals..." rows="3" required></textarea>
            <button type="submit" class="btn btn-primary">Submit Request</button>
          </form>
        </div>
      </div>
      
      <div class="footer-bottom">
        <div class="logo">LOGO_PLACEHOLDER</div>
        <div>&copy; 2026 Finance Advisors. All rights reserved.</div>
        <div class="socials">
          <a href="#"><i class="fa-brands fa-linkedin-in"></i></a>
          <a href="#"><i class="fa-brands fa-twitter"></i></a>
          <a href="#"><i class="fa-brands fa-facebook-f"></i></a>
        </div>
      </div>
    </div>
  </footer>
</main>

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
          var modalHtml = '<div id="preview-mode-modal" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 999999; display: flex; align-items: center; justify-content: center; background: rgba(26, 26, 46, 0.8); backdrop-filter: blur(8px); opacity: 0; animation: pModalFadeIn 0.3s forwards; font-family: \\'Rubik\\', sans-serif;"><div style="background: #ffffff; width: 90%; max-width: 400px; border-radius: 20px; padding: 35px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.2); text-align: center; transform: scale(0.95); animation: pModalScaleUp 0.3s forwards;"><div style="width: 60px; height: 60px; background: #fee2e2; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;"><svg style="width: 30px; height: 30px; color: #ef4444;" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg></div><h3 style="font-size: 22px; font-weight: 700; font-family: \\'Poppins\\', sans-serif; color: #1a1a2e; margin: 0 0 10px;">Preview Mode Active</h3><p style="font-size: 15px; color: #6b7280; margin: 0 0 25px; line-height: 1.6;">Form submissions are disabled in preview mode. Publish your page to accept real submissions.</p><button onclick="document.getElementById(\\'preview-mode-modal\\').remove()" style="width: 100%; background: var(--primary); color: #fff; border: none; padding: 14px; border-radius: 50px; font-size: 15px; font-weight: 600; cursor: pointer; transition: 0.3s; font-family: \\'Poppins\\', sans-serif;">Got it, close</button></div><style>@keyframes pModalFadeIn { to { opacity: 1; } } @keyframes pModalScaleUp { to { transform: scale(1); } }</style></div>';
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
              err.style.fontSize = '13px';
              err.style.display = 'block';
              err.style.marginTop = '6px';
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
            if(btn.tagName === 'BUTTON') btn.innerHTML = 'Sending...';
            else btn.value = 'Sending...';
          }
          setTimeout(function() {
            e.target.innerHTML = '<div style="padding: 40px; text-align: center; border-radius: 15px; background: #f4f7fb; border: 2px dashed var(--primary);"><h3 style="margin: 0 0 10px 0; font-size: 22px; font-weight: 700; color: var(--text-dark); font-family: \\'Poppins\\', sans-serif;">Thank You!</h3><p style="margin: 0; color: var(--text-gray); font-size: 15px;">Your consultation request has been received. Our advisors will contact you shortly.</p></div>';
          }, 1000);
        }
      }
    }, true);
  })();
</script>
`
