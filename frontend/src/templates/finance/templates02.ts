// Master Template — Finance Elite 02
// Institutional Grade Corporate Design — Focused on Trust, Clarity, and Professionalism
// Inspired by Global Investment Banks and Asset Management Firms

export const finance02Styles = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Public+Sans:wght@300;400;500;600;700&display=swap');

:root {
  --primary: PRIMARY_COLOR_PLACEHOLDER;
  --secondary: SECONDARY_COLOR_PLACEHOLDER;
  --slate: #475569;
  --gold: #c5a059;
  --bg-light: #fdfdfd;
  --border: #e2e8f0;
}

* { box-sizing: border-box; margin: 0; padding: 0; transition: all 0.3s ease; }

html { scroll-behavior: smooth; }

body { 
  font-family: 'Public Sans', sans-serif; 
  background: var(--bg-light); 
  color: SECONDARY_COLOR_PLACEHOLDER; 
  line-height: 1.7; 
  overflow-x: hidden;
}

h1, h2, h3 { 
  font-family: 'Playfair Display', serif; 
  font-weight: 700; 
  color: var(--navy); 
}

.container { 
  max-width: 1200px; 
  margin: 0 auto; 
  padding: 0 2rem; 
}

.section-padding { padding: 8rem 0; }

.text-gold { color: var(--gold); }

/* NAVBAR */
.nav {
  position: absolute;
  top: 0; left: 0; right: 0;
  z-index: 1000;
  padding: 2rem 0;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

.nav-inner { display: flex; justify-content: space-between; align-items: center; }
.logo { font-size: 1.4rem; font-weight: 700; color: #fff; letter-spacing: 1px; text-transform: uppercase; }

.nav-links { display: flex; gap: 3rem; align-items: center; }
.nav-links a { text-decoration: none; color: #fff; font-size: 0.85rem; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; opacity: 0.8; }
.nav-links a:hover { opacity: 1; }

.btn-nav {
  background: PRIMARY_COLOR_PLACEHOLDER !important;
  color: #fff !important;
  padding: 0.9rem 2.5rem;
  font-weight: 700;
  text-decoration: none;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* CORPORATE HERO */
.hero {
  height: 90vh;
  min-height: 800px;
  background: SECONDARY_COLOR_PLACEHOLDER !important;
  display: flex;
  align-items: center;
  position: relative;
  color: #fff;
  overflow: hidden;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(rgba(10, 25, 47, 0.7), rgba(10, 25, 47, 0.9)), url('/assets/templates/finance/templates02/hero.png');
  background-size: cover;
  background-position: center;
}

.hero-content {
  position: relative;
  z-index: 10;
  max-width: 800px;
}

.hero h1 { 
  font-size: clamp(3rem, 5vw, 4.5rem); 
  color: #fff; 
  margin-bottom: 2rem; 
  line-height: 1.1;
}

.hero p { 
  font-size: 1.25rem; 
  color: rgba(255,255,255,0.7); 
  margin-bottom: 3.5rem; 
  max-width: 600px;
  font-weight: 300;
}

.hero-btns { display: flex; gap: 1.5rem; }
.btn-hero-primary { background: PRIMARY_COLOR_PLACEHOLDER !important; color: #fff !important; padding: 1.2rem 3rem; font-weight: 700; text-decoration: none; border-radius: 0; text-transform: uppercase; letter-spacing: 1px; }
.btn-hero-outline { border: 1px solid #fff; color: #fff; padding: 1.2rem 3rem; font-weight: 700; text-decoration: none; text-transform: uppercase; letter-spacing: 1px; }
.btn-hero-outline:hover { background: #fff; color: var(--navy); }

/* INSTITUTIONAL FORM SECTION */
.form-section {
  background: #fff;
  padding: 6rem;
  margin-top: -100px;
  position: relative;
  z-index: 20;
  box-shadow: 0 40px 100px rgba(0,0,0,0.1);
  border-top: 4px solid PRIMARY_COLOR_PLACEHOLDER;
}

.form-grid { display: grid; grid-template-columns: 1fr 2fr; gap: 4rem; align-items: center; }

.form-text h2 { font-size: 2.5rem; margin-bottom: 1.5rem; }
.form-text p { color: var(--slate); margin-bottom: 2rem; }

.contact-form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.form-group { display: flex; flex-direction: column; gap: 0.5rem; }
.form-group.full { grid-column: span 2; }
.form-group label { font-weight: 700; font-size: 0.8rem; text-transform: uppercase; color: var(--slate); letter-spacing: 1px; }
.form-group input, .form-group select {
  padding: 1rem;
  border: 1px solid var(--border);
  outline: none;
  font-family: inherit;
  font-size: 1rem;
  color: var(--navy);
}
.form-group input:focus { border-color: PRIMARY_COLOR_PLACEHOLDER; }

.btn-form {
  grid-column: span 2;
  background: SECONDARY_COLOR_PLACEHOLDER;
  color: #fff;
  padding: 1.2rem;
  border: none;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  cursor: pointer;
}
.btn-form:hover { background: PRIMARY_COLOR_PLACEHOLDER; }

/* TRUST SECTION */
.trust-logos { padding: 4rem 0; border-bottom: 1px solid var(--border); }
.logo-flex { display: flex; justify-content: space-between; align-items: center; opacity: 0.4; filter: grayscale(1); }
.logo-flex img { height: 30px; }

/* SERVICES GRID */
.services-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 4rem; }
.service-item { border-left: 1px solid var(--border); padding-left: 2rem; }
.service-item:hover { border-left-color: PRIMARY_COLOR_PLACEHOLDER; }
.service-item span { color: PRIMARY_COLOR_PLACEHOLDER; font-weight: 700; font-size: 0.9rem; }
.service-item h3 { font-size: 1.5rem; margin: 1rem 0; }
.service-item p { color: var(--slate); font-size: 0.95rem; }

/* EXPERTISE CONTENT */
.expertise-block { display: grid; grid-template-columns: 1fr 1fr; gap: 6rem; align-items: center; }
.expertise-img { height: 600px; background: url('/assets/templates/finance/templates02/heritage.png'); background-size: cover; background-position: center; }

/* FOOTER */
.footer {
  background: SECONDARY_COLOR_PLACEHOLDER !important;
  color: #fff;
  padding: 6rem 0 3rem;
}

.footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 4rem; margin-bottom: 4rem; }
.footer-logo { font-size: 1.4rem; font-weight: 700; margin-bottom: 1.5rem; text-transform: uppercase; }
.footer-p { color: rgba(255,255,255,0.5); font-size: 0.9rem; max-width: 300px; }
.footer h4 { color: #fff; font-family: 'Public Sans', sans-serif; font-size: 0.9rem; text-transform: uppercase; margin-bottom: 1.5rem; letter-spacing: 1px; }
.footer ul { list-style: none; }
.footer ul li { margin-bottom: 0.8rem; }
.footer ul li a { color: rgba(255,255,255,0.5); text-decoration: none; font-size: 0.9rem; }
.footer ul li a:hover { color: #fff; }

.footer-bottom { border-top: 1px solid rgba(255,255,255,0.05); padding-top: 3rem; text-align: center; color: rgba(255,255,255,0.3); font-size: 0.8rem; }

/* GLOBAL PRESENCE */
.global-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 4rem; text-align: center; }
.global-item h3 { font-size: 3rem; color: var(--gold); margin-bottom: 1rem; }
.global-item p { text-transform: uppercase; letter-spacing: 2px; font-weight: 700; font-size: 0.8rem; color: var(--slate); }

/* CORE VALUES */
.values-section { background: SECONDARY_COLOR_PLACEHOLDER !important; color: #fff; text-align: center; }
.values-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 3rem; margin-top: 4rem; }
.value-card { padding: 3rem; border: 1px solid rgba(255,255,255,0.1); }
.value-card:hover { background: rgba(255,255,255,0.05); border-color: PRIMARY_COLOR_PLACEHOLDER; }
.value-card i { font-size: 2rem; color: var(--gold); margin-bottom: 2rem; display: block; }
.value-card h4 { font-family: 'Public Sans', sans-serif; font-size: 1rem; text-transform: uppercase; letter-spacing: 2px; }

.value-card h4 { font-family: 'Public Sans', sans-serif; font-size: 1rem; text-transform: uppercase; letter-spacing: 2px; }

/* MINIMAL CTA */
.cta-minimal { background: #fff; text-align: center; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
.cta-minimal h2 { font-size: 3rem; margin-bottom: 2rem; }
.btn-cta-dark { background: SECONDARY_COLOR_PLACEHOLDER; color: #fff; padding: 1.2rem 4rem; text-decoration: none; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; display: inline-block; }
.btn-cta-dark:hover { background: var(--gold); }

@media (max-width: 1024px) {
  .hero-content { text-align: center; margin: 0 auto; }
  .hero-btns { justify-content: center; }
  .form-grid { grid-template-columns: 1fr; padding: 3rem; }
  .services-grid { grid-template-columns: 1fr 1fr; }
  .expertise-block { grid-template-columns: 1fr; }
  .global-grid { grid-template-columns: 1fr; gap: 3rem; }
  .values-grid { grid-template-columns: 1fr 1fr; }
  .nav-links { display: none; }
}

@media (max-width: 640px) {
  .services-grid { grid-template-columns: 1fr; }
  .contact-form { grid-template-columns: 1fr; }
  .form-group.full { grid-column: span 1; }
  .btn-form { grid-column: span 1; }
}
`;

export const finance02Html = `
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Public+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">

<nav class="nav">
  <div class="container nav-inner">
    <div class="logo" style="display: flex; align-items: center; gap: 1rem;">
      <span style="font-size: 1.2rem; font-weight: 800; letter-spacing: 2px;">LOGO_PLACEHOLDER</span>
    </div>
    <div class="nav-links">
      <a href="#about">Our Firm</a>
      <a href="#services">Expertise</a>
      <a href="#insights">Insights</a>
      <a href="#contact" class="btn-nav">Client Login</a>
    </div>
  </div>
</nav>

<section class="hero">
  <div class="hero-overlay"></div>
  <div class="container">
    <div class="hero-content">
      <h1>Preserving Wealth. <br>Building <span class="text-gold">Legacies.</span></h1>
      <p>Global institutional-grade investment management and strategic advisory for multi-generational success.</p>
      <div class="hero-btns">
        <a href="#contact" class="btn-hero-primary">Our Expertise</a>
        <a href="#about" class="btn-hero-outline">Learn More</a>
      </div>
    </div>
  </div>
</section>

<section class="container" id="contact">
  <div class="form-section">
    <div class="form-grid">
      <div class="form-text">
        <span style="font-weight: 700; font-size: 0.8rem; color: var(--gold); text-transform: uppercase; letter-spacing: 2px;">Inquiry</span>
        <h2>Begin Your Consultation</h2>
        <p>Connect with our senior advisors for a comprehensive analysis of your global financial objectives.</p>
        <div style="margin-top: 2rem;">
          <h4 style="font-size: 1.1rem; margin-bottom: 0.5rem;">Corporate HQ</h4>
          <p style="color: var(--slate); font-size: 0.9rem;">Wall Street, New York, NY 10005</p>
        </div>
      </div>
      <form class="contact-form">
        <div class="form-group">
          <label>First Name</label>
          <input type="text" placeholder="John">
        </div>
        <div class="form-group">
          <label>Last Name</label>
          <input type="text" placeholder="Doe">
        </div>
        <div class="form-group full">
          <label>Inquiry Type</label>
          <select>
            <option>Investment Management</option>
            <option>Wealth Planning</option>
            <option>Corporate Advisory</option>
          </select>
        </div>
        <div class="form-group full">
          <label>Email Address</label>
          <input type="email" placeholder="john@firm.com">
        </div>
        <button type="button" class="btn-form">Request Consultation</button>
      </form>
    </div>
  </div>
</section>

<div class="container">
  <div class="trust-logos">
    <div class="logo-flex">
      <img src="/assets/templates/finance/templates02/logo-1.png" alt="Goldman Sachs">
      <img src="/assets/templates/finance/templates02/logo-2.png" alt="JP Morgan">
      <img src="/assets/templates/finance/templates02/logo-3.png" alt="Morgan Stanley">
      <img src="/assets/templates/finance/templates02/logo-4.png" alt="UBS">
    </div>
  </div>
</div>

<section class="section-padding container" id="services">
  <div style="text-align: center; margin-bottom: 6rem;">
    <span style="font-weight: 700; font-size: 0.8rem; color: var(--gold); text-transform: uppercase; letter-spacing: 3px;">Areas of Expertise</span>
    <h2 style="font-size: 3.5rem; margin-top: 1.5rem;">Unrivaled Financial <br>Intelligence</h2>
  </div>

  <div class="services-grid">
    <div class="service-item">
      <span>01</span>
      <h3>Asset Management</h3>
      <p>Precision-engineered portfolios tailored to your risk profile and long-term capital preservation goals.</p>
    </div>
    <div class="service-item">
      <span>02</span>
      <h3>Wealth Strategy</h3>
      <p>Comprehensive estate and tax optimization strategies designed to protect your global interests across generations.</p>
    </div>
    <div class="service-item">
      <span>03</span>
      <h3>Corporate Advisory</h3>
      <p>Navigating mergers, acquisitions, and complex capital structures with unmatched institutional experience.</p>
    </div>
  </div>
</section>

<section class="section-padding" style="background: #f8fafc;" id="about">
  <div class="container expertise-block">
    <div class="expertise-img"></div>
    <div class="expertise-content">
      <span style="font-weight: 700; font-size: 0.8rem; color: var(--gold); text-transform: uppercase; letter-spacing: 2px;">Our Heritage</span>
      <h2 style="font-size: 3rem; margin: 1.5rem 0;">A Tradition of <br>Excellence.</h2>
      <p style="color: var(--slate); font-size: 1.1rem; margin-bottom: 2rem;">For over three decades, we have been the trusted partner for global families and institutions, providing the clarity needed to navigate complex financial landscapes.</p>
      <ul style="list-style: none; display: flex; flex-direction: column; gap: 1rem; margin-bottom: 3rem;">
        <li style="display: flex; gap: 1rem; align-items: center; font-weight: 700;"><div style="width: 20px; height: 1px; background: var(--gold);"></div> Institutional Risk Management</li>
        <li style="display: flex; gap: 1rem; align-items: center; font-weight: 700;"><div style="width: 20px; height: 1px; background: var(--gold);"></div> Global Market Access</li>
        <li style="display: flex; gap: 1rem; align-items: center; font-weight: 700;"><div style="width: 20px; height: 1px; background: var(--gold);"></div> Discreet Advisory Services</li>
      </ul>
      <a href="#contact" style="color: SECONDARY_COLOR_PLACEHOLDER; font-weight: 800; text-decoration: none; border-bottom: 2px solid var(--gold); padding-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 1px; font-size: 0.8rem;">View Our Report</a>
    </div>
  </div>
</section>

<section class="section-padding container">
  <div class="global-grid">
    <div class="global-item">
      <h3>$4.2B</h3>
      <p>Assets Under Advisory</p>
    </div>
    <div class="global-item">
      <h3>12+</h3>
      <p>International Offices</p>
    </div>
    <div class="global-item">
      <h3>98%</h3>
      <p>Client Retention Rate</p>
    </div>
  </div>
</section>

<section class="section-padding values-section">
  <div class="container">
    <span style="font-weight: 700; font-size: 0.8rem; color: var(--gold); text-transform: uppercase; letter-spacing: 3px;">Philosophy</span>
    <h2 style="font-size: 3rem; color: #fff; margin-top: 1.5rem;">The Pillars of Our Success</h2>
    <div class="values-grid">
      <div class="value-card">
        <i class="fa-solid fa-shield-halved"></i>
        <h4>Integrity</h4>
      </div>
      <div class="value-card">
        <i class="fa-solid fa-gem"></i>
        <h4>Excellence</h4>
      </div>
      <div class="value-card">
        <i class="fa-solid fa-eye-slash"></i>
        <h4>Discretion</h4>
      </div>
      <div class="value-card">
        <i class="fa-solid fa-chart-line"></i>
        <h4>Vision</h4>
      </div>
    </div>
  </div>
</section>

<section class="section-padding cta-minimal">
  <div class="container">
    <span style="font-weight: 700; font-size: 0.8rem; color: var(--gold); text-transform: uppercase; letter-spacing: 3px;">Next Steps</span>
    <h2 style="margin: 1.5rem 0 3rem;">Ready to Secure Your <br>Financial Future?</h2>
    <a href="#contact" class="btn-cta-dark">Request an Introduction</a>
  </div>
</section>

<footer class="footer">
  <div class="container footer-grid">
    <div>
      <div class="footer-logo" style="display: flex; align-items: center; gap: 1rem;">
        <span style="font-size: 1.1rem; font-weight: 800; letter-spacing: 1px;">LOGO_PLACEHOLDER</span>
      </div>
      <p class="footer-p">A global investment and advisory firm dedicated to the preservation and expansion of institutional and private wealth.</p>
    </div>
    <div class="footer-links">
      <h4>Intelligence</h4>
      <ul>
        <li><a href="#">Market Analysis</a></li>
        <li><a href="#">Economic Outlook</a></li>
        <li><a href="#">Strategic Reports</a></li>
      </ul>
    </div>
    <div class="footer-links">
      <h4>The Firm</h4>
      <ul>
        <li><a href="#">Our Heritage</a></li>
        <li><a href="#">Leadership</a></li>
        <li><a href="#">Global Offices</a></li>
      </ul>
    </div>
    <div class="footer-links">
      <h4>Inquiries</h4>
      <ul>
        <li><a href="#">Contact Us</a></li>
        <li><a href="#">Client Portal</a></li>
        <li><a href="#">Media Center</a></li>
      </ul>
    </div>
  </div>
  <div class="container footer-bottom">
    <p>© 2026 PROJECT_NAME_PLACEHOLDER. All Rights Reserved. Member FINRA/SIPC. Disclosures and Privacy Policy.</p>
  </div>
</footer>
`
