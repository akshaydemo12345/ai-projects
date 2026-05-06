// Master Template — Finance Elite 02
// Optimized for Editor Reliability — No Variables, Direct Placeholders
// 100% Dynamic Content

export const finance02Styles = `
:root {
  --primary: PRIMARY_COLOR_PLACEHOLDER;
  --secondary: SECONDARY_COLOR_PLACEHOLDER;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Outfit', sans-serif; color: #0f172a; line-height: 1.6; background: #fff; overflow-x: hidden; }

.container { max-width: 1240px; margin: 0 auto; padding: 0 1.5rem; }
img { max-width: 100%; display: block; }
a { text-decoration: none; color: inherit; transition: 0.3s; }
button { cursor: pointer; border: none; font-family: inherit; transition: 0.3s; }

/* Navigation */
.nav { position: absolute; top: 0; left: 0; right: 0; z-index: 100; padding: 1.5rem 0; }
.nav-inner { display: flex; justify-content: space-between; align-items: center; }
.logo { font-size: 1.6rem; font-weight: 800; color: #fff; display: flex; align-items: center; gap: 0.5rem; }
.nav-links { display: flex; gap: 2.5rem; }
.nav-links a { color: #fff; font-weight: 500; }
.nav-links a:hover { color: var(--primary); }
.btn-primary { background-color: var(--primary); color: #fff; padding: 0.7rem 1.6rem; border-radius: 50px; font-weight: 600; box-shadow: 0 4px 15px rgba(0,0,0,0.2); }

/* Hero */
.hero { position: relative; min-height: 100vh; display: flex; align-items: center; background: #020617; overflow: hidden; padding: 8rem 0 10rem; }
.hero-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0.5; }
.hero-overlay { position: absolute; inset: 0; background: radial-gradient(circle at 20% 50%, rgba(15, 23, 42, 0.8), transparent); }
.hero-grid { position: relative; z-index: 10; display: grid; grid-template-columns: 1.2fr 1fr; gap: 4rem; align-items: center; }

.hero-content { color: #fff; }
.hero-tag { background: rgba(255,255,255,0.1); padding: 0.5rem 1.2rem; border-radius: 50px; font-size: 0.8rem; font-weight: 700; display: inline-block; margin-bottom: 2rem; border: 1px solid rgba(255,255,255,0.2); }
.hero h1 { font-size: 4rem; font-weight: 800; line-height: 1.1; margin-bottom: 2rem; }
.hero p { font-size: 1.2rem; opacity: 0.9; margin-bottom: 3rem; max-width: 550px; }

.hero-form-card { background: rgba(255,255,255,0.95); padding: 3rem; border-radius: 32px; box-shadow: 0 40px 100px rgba(0,0,0,0.3); }
.form-title h3 { font-size: 1.5rem; font-weight: 800; color: #0f172a; margin-bottom: 0.5rem; }
.form-title p { font-size: 0.9rem; color: #64748b; margin-bottom: 2rem; }

.form-group { margin-bottom: 1.25rem; }
.form-group label { display: block; font-size: 0.85rem; font-weight: 700; color: #475569; margin-bottom: 0.5rem; }
.form-group input, .form-group select { width: 100%; padding: 1rem; border-radius: 12px; border: 1px solid #e2e8f0; background: #fff; }

.btn-submit { width: 100%; background-color: var(--primary); color: #fff; padding: 1.1rem; border-radius: 12px; font-weight: 800; font-size: 1rem; margin-top: 1rem; }

/* Features */
.features { padding: 10rem 0; background: #f8fafc; }
.section-head { text-align: center; max-width: 700px; margin: 0 auto 6rem; }
.section-head h2 { font-size: 3rem; font-weight: 800; margin-bottom: 1.5rem; }
.feat-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2.5rem; }
.feat-card { background: #fff; padding: 3.5rem 2.5rem; border-radius: 32px; border: 1px solid #e2e8f0; }
.feat-icon { width: 70px; height: 70px; background-color: #f1f5f9; border-radius: 20px; display: flex; align-items: center; justify-content: center; margin-bottom: 2.5rem; color: var(--primary); font-size: 1.8rem; }

/* Accordion (No JS) */
.faq { padding: 10rem 0; background: #fff; }
.faq-grid { max-width: 800px; margin: 0 auto; }
.faq-item { margin-bottom: 1rem; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; }
.faq-input { display: none; }
.faq-label { display: flex; justify-content: space-between; padding: 1.5rem 2rem; font-weight: 700; cursor: pointer; background: #fff; }
.faq-label::after { content: '+'; color: PRIMARY_COLOR_PLACEHOLDER; font-size: 1.5rem; }
.faq-content { max-height: 0; overflow: hidden; padding: 0 2rem; transition: 0.3s; color: #64748b; }
.faq-input:checked ~ .faq-content { max-height: 200px; padding-bottom: 1.5rem; }
.faq-input:checked ~ .faq-label::after { content: '-'; }

/* CTA */
.cta { padding: 10rem 0; background: #fff; }
.cta-card { background-color: var(--primary); border-radius: 60px; padding: 6rem; text-align: center; color: #fff; box-shadow: 0 30px 60px rgba(0,0,0,0.1); }
.cta-card h2 { font-size: 3.5rem; font-weight: 800; margin-bottom: 2rem; }
.btn-white { background-color: #fff; color: var(--primary); padding: 1.25rem 3.5rem; border-radius: 16px; font-weight: 800; font-size: 1.2rem; display: inline-block; }

/* Footer */
footer { padding: 6rem 0; border-top: 1px solid #e2e8f0; }
.foot-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; }

/* Responsive Media Queries */
@media (max-width: 1024px) {
  .hero { padding: 8rem 0; text-align: center; }
  .hero-grid { grid-template-columns: 1fr !important; gap: 4rem; }
  .hero-content { max-width: 100%; }
  .hero h1 { font-size: 3rem; }
  .hero p { margin: 0 auto 3rem; }
  .hero-form-card { max-width: 600px; margin: 0 auto; text-align: left; }
  
  .feat-grid { grid-template-columns: 1fr 1fr !important; }
  .nav-links, .btn-nav { display: none; }
  .cta-card { padding: 4rem 2rem; border-radius: 40px; }
  .cta-card h2 { font-size: 2.5rem; }
}

@media (max-width: 640px) {
  .hero h1 { font-size: 2.5rem; }
  .feat-grid { grid-template-columns: 1fr !important; }
  .foot-grid { grid-template-columns: 1fr !important; text-align: center; }
  .foot-col { text-align: center !important; }
}
`

export const finance02Html = `
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">

<header class="nav">
  <div class="container nav-inner">
    <div class="logo">LOGO_PLACEHOLDER</div>
    <nav class="nav-links">
      <a href="#services">Services</a>
      <a href="#about">About</a>
      <a href="#contact">Contact</a>
    </nav>
    <a href="#contact" class="btn-primary">Get Started</a>
  </div>
</header>

<main>
  <section class="hero">
    <img src="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=2000" alt="Hero" class="hero-img">
    <div class="hero-overlay"></div>
    <div class="container hero-grid">
      <div class="hero-content">
        <span class="hero-tag">✦ ELITE SOLUTIONS</span>
        <h1>Secure Your Legacy Today.</h1>
        <p>Premium advisory and management solutions designed for scaling firms and individuals aiming for prosperity.</p>
      </div>
      <div class="hero-form-card" id="contact">
        <div class="form-title">
          <h3>Apply for Access</h3>
          <p>Complete the form for a bespoke strategic analysis.</p>
        </div>
        <form>
          <div class="form-group">
            <label>Full Name</label>
            <input type="text" placeholder="Enter your name" required>
          </div>
          <div class="form-group">
            <label>Email Address</label>
            <input type="email" placeholder="john@company.com" required>
          </div>
          <div class="form-group">
            <label>Inquiry Type</label>
            <select required>
              <option value="">Select an option</option>
              <option value="wealth">Wealth Curation</option>
              <option value="strategy">Strategic Advisory</option>
            </select>
          </div>
          <button type="submit" class="btn-submit">Submit Request</button>
        </form>
      </div>
    </div>
  </section>

  <section class="features" id="services">
    <div class="container">
      <div class="section-head">
        <h2>Expertise Redefined</h2>
        <p>We combine institutional-grade intelligence with a commitment to multi-generational legacy preservation.</p>
      </div>
      <div class="feat-grid">
        <div class="feat-card">
          <div class="feat-icon"><i class="fa-solid fa-gem"></i></div>
          <h3>Wealth Curation</h3>
          <p>Bespoke portfolio strategies focusing on alternative assets and capital growth.</p>
        </div>
        <div class="feat-card">
          <div class="feat-icon"><i class="fa-solid fa-chess-knight"></i></div>
          <h3>Strategic Advisory</h3>
          <p>Navigating mergers and complex capital structures with surgical precision.</p>
        </div>
        <div class="feat-card">
          <div class="feat-icon"><i class="fa-solid fa-vault"></i></div>
          <h3>Asset Protection</h3>
          <p>Legal safeguards designed to preserve and protect your global interests.</p>
        </div>
      </div>
    </div>
  </section>

  <section class="faq">
    <div class="container">
      <div class="section-head">
        <h2>Strategic Insights</h2>
        <p>Common questions about our elite advisory and management methodology.</p>
      </div>
      <div class="faq-grid">
        <div class="faq-item">
          <input type="checkbox" id="faq1" class="faq-input">
          <label for="faq1" class="faq-label">How do you manage market risk?</label>
          <div class="faq-content">
            <p>We use multi-layer diversification and real-time monitoring to protect capital from volatility.</p>
          </div>
        </div>
        <div class="faq-item">
          <input type="checkbox" id="faq2" class="faq-input">
          <label for="faq2" class="faq-label">Who is your typical client?</label>
          <div class="faq-content">
            <p>High-net-worth individuals and firms seeking strategic capital expansion and legacy protection.</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="cta">
    <div class="container">
      <div class="cta-card">
        <h2>Ready to Scale Your Future?</h2>
        <p>Join the elite circle of businesses mastering their prosperity with our dedicated solutions.</p>
        <a href="#contact" class="btn-white">Apply for Consultation</a>
      </div>
    </div>
  </section>
</main>

<footer>
  <div class="container foot-grid">
    <div class="foot-col">
      <div style="font-weight: 800; font-size: 1.5rem; margin-bottom: 1rem;">LOGO_PLACEHOLDER</div>
      <p>© 2026 PROJECT_NAME_PLACEHOLDER. All rights reserved.</p>
    </div>
    <div class="foot-col" style="text-align: right;">
      <p>Premium Advisory • Corporate Strategy • Wealth Management</p>
    </div>
  </div>
</footer>
`
