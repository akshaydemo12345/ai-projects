// Master Template — Finance Elite 03 (Complete Version)
// 100% Matching User Content & Premium Dark-Gold Aesthetic

export const finance03Styles = `
:root {
  --primary: PRIMARY_COLOR_PLACEHOLDER;
  --secondary: SECONDARY_COLOR_PLACEHOLDER;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Outfit', sans-serif; background: #050505; color: #ffffff; line-height: 1.6; overflow-x: hidden; }

.container { max-width: 1240px; margin: 0 auto; padding: 0 1.5rem; }
img { max-width: 100%; display: block; }
a { text-decoration: none; color: inherit; transition: 0.3s; }

/* Navigation */
.nav { position: absolute; top: 0; left: 0; right: 0; z-index: 100; padding: 2.5rem 0; }
.nav-inner { display: flex; justify-content: space-between; align-items: center; }
.logo { font-size: 1.5rem; font-weight: 800; color: var(--primary); letter-spacing: 2px; text-transform: uppercase; }
.nav-links { display: flex; gap: 3rem; }
.nav-links a { color: #fff; font-size: 0.8rem; font-weight: 500; text-transform: uppercase; letter-spacing: 1px; opacity: 0.8; }
.nav-links a:hover { color: var(--primary); opacity: 1; }
.btn-primary { border: 1px solid var(--primary); color: var(--primary); padding: 0.8rem 1.8rem; border-radius: 4px; font-weight: 600; text-transform: uppercase; font-size: 0.85rem; background: transparent; cursor: pointer; }

/* Hero Section */
.hero { position: relative; min-height: 100vh; display: flex; align-items: center; padding: 12rem 0 10rem; background: #000; }
.hero-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0.4; }
.hero-content { position: relative; z-index: 10; max-width: 850px; }
.hero h1 { font-size: clamp(3.5rem, 8vw, 6rem); font-weight: 700; line-height: 1.05; margin-bottom: 2rem; color: #fff; }
.hero p { font-size: 1.25rem; color: #aaa; margin-bottom: 4rem; max-width: 700px; }

/* Horizontal Form Bar */
.hero-form-bar { background: rgba(255,255,255,0.05); backdrop-filter: blur(20px); padding: 1rem; border-radius: 8px; display: grid; grid-template-columns: 1fr 1fr 1fr 1fr auto; gap: 1rem; border: 1px solid rgba(255,255,255,0.1); width: 100%; margin-top: 4rem; }
.form-field { padding: 0.5rem 1.5rem; border-right: 1px solid rgba(255,255,255,0.1); }
.form-field:last-of-type { border-right: none; }
.form-field label { display: block; font-size: 0.65rem; text-transform: uppercase; color: var(--primary); font-weight: 800; margin-bottom: 0.5rem; letter-spacing: 1px; }
.form-field input, .form-field select { background: transparent; border: none; outline: none; color: #fff; width: 100%; font-size: 0.95rem; font-weight: 500; }
.btn-submit { background-color: var(--primary); color: #000; border: none; padding: 1rem 2.5rem; font-weight: 800; text-transform: uppercase; border-radius: 4px; cursor: pointer; }

/* Offerings Section */
.offerings { padding: 10rem 0; background: #050505; }
.section-tag { color: var(--primary); text-transform: uppercase; font-size: 0.8rem; font-weight: 800; letter-spacing: 2px; display: block; margin-bottom: 1.5rem; }
.offerings h2 { font-size: 3.5rem; font-weight: 600; margin-bottom: 1.5rem; }
.offerings-lead { color: #777; font-size: 1.2rem; max-width: 600px; margin-bottom: 5rem; }

.off-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2rem; }
.off-card { background: rgba(255,255,255,0.02); padding: 4rem 2.5rem; border: 1px solid rgba(255,255,255,0.05); transition: 0.4s; }
.off-card:hover { border-color: var(--primary); transform: translateY(-10px); background: rgba(255,255,255,0.04); }
.off-icon { font-size: 2rem; color: var(--primary); margin-bottom: 2.5rem; }
.off-card h3 { font-size: 1.4rem; font-weight: 700; margin-bottom: 1.5rem; }
.off-card p { color: #666; font-size: 0.95rem; margin-bottom: 3rem; }
.off-link { color: var(--primary); font-size: 0.75rem; font-weight: 800; text-transform: uppercase; display: flex; align-items: center; gap: 0.75rem; letter-spacing: 1px; }

/* Stats Bar */
.stats-bar { padding: 8rem 0; border-top: 1px solid rgba(255,255,255,0.05); border-bottom: 1px solid rgba(255,255,255,0.05); }
.stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); text-align: center; }
.stat-item h2 { font-size: 4.5rem; font-weight: 700; color: #fff; margin-bottom: 0.5rem; }
.stat-item p { color: #666; text-transform: uppercase; font-size: 0.8rem; letter-spacing: 2px; font-weight: 700; }

/* Aureum Standard Section */
.standard { padding: 10rem 0; background: #000; }
.std-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 3rem; margin-top: 6rem; }
.std-item { text-align: center; }
.std-icon { font-size: 2rem; color: var(--primary); margin-bottom: 2rem; }
.std-item h4 { font-size: 1.25rem; font-weight: 700; margin-bottom: 1rem; }
.std-item p { color: #666; font-size: 0.95rem; }

/* Streamlined Journey */
.journey { padding: 10rem 0; background: #050505; }
.journey-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2rem; margin-top: 5rem; }
.step-card { padding: 4rem 2.5rem; border: 1px solid rgba(255,255,255,0.05); position: relative; background: #000; }
.step-num { position: absolute; top: 2rem; left: 2.5rem; color: var(--primary); font-weight: 800; font-size: 1.2rem; }
.step-card h3 { font-size: 1.4rem; font-weight: 700; margin-top: 2rem; margin-bottom: 1.5rem; }
.step-card p { color: #777; font-size: 0.95rem; }

/* Testimonials */
.voices { padding: 10rem 0; background: #000; }
.voices-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 3rem; margin-top: 6rem; }
.voice-card { background: rgba(255,255,255,0.02); padding: 4rem; border: 1px solid rgba(255,255,255,0.05); }
.stars { color: var(--primary); font-size: 0.75rem; margin-bottom: 2rem; }
.voice-text { font-size: 1.1rem; color: #ccc; font-style: italic; margin-bottom: 3rem; line-height: 1.8; }
.voice-author h4 { font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; color: #fff; margin-bottom: 0.25rem; }
.voice-author span { font-size: 0.75rem; color: #666; }

/* Final CTA Section */
.cta-section { padding: 10rem 0; background: #050505; position: relative; overflow: hidden; }
.cta-trust-bar { display: flex; gap: 4rem; margin-bottom: 4rem; opacity: 0.6; }
.trust-item { display: flex; align-items: center; gap: 1rem; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: var(--primary); }
.cta-section h2 { font-size: 4.5rem; font-weight: 700; line-height: 1.1; margin-bottom: 2rem; }
.cta-section p { font-size: 1.25rem; color: #666; margin-bottom: 4rem; max-width: 600px; }
.btn-final { background-color: var(--primary); color: #000; padding: 1.25rem 3.5rem; border-radius: 4px; font-weight: 800; display: inline-block; text-transform: uppercase; font-size: 1rem; letter-spacing: 1px; border: none; cursor: pointer; }

/* Footer */
footer { padding: 10rem 0 5rem; background: #000; border-top: 1px solid rgba(255,255,255,0.05); }
.foot-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1.2fr; gap: 6rem; }
.foot-brand p { color: #555; font-size: 0.95rem; margin-top: 2rem; line-height: 1.8; max-width: 300px; }
.foot-col h5 { font-size: 0.8rem; text-transform: uppercase; letter-spacing: 2px; color: #fff; margin-bottom: 2.5rem; }
.foot-links a { display: block; color: #555; font-size: 0.9rem; margin-bottom: 1.2rem; transition: 0.3s; }
.foot-links a:hover { color: PRIMARY_COLOR_PLACEHOLDER; }
.foot-social { display: flex; gap: 1.5rem; margin-top: 1rem; color: #555; font-size: 1.2rem; }

@media (max-width: 1024px) {
  .hero-form-bar, .off-grid, .stats-grid, .std-grid, .journey-grid, .voices-grid, .foot-grid { grid-template-columns: 1fr; gap: 3rem; }
  .form-field { border-right: none; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 1.5rem; }
  .hero h1 { font-size: 3.5rem; }
  .cta-section h2 { font-size: 3rem; }
}
`

export const finance03Html = `
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">

<header class="nav">
  <div class="container nav-inner">
    <div class="logo">LOGO_PLACEHOLDER</div>
    <a href="#contact" class="btn-primary">Get Analysis</a>
  </div>
</header>

<main>
  <!-- HERO SECTION -->
  <section class="hero">
    <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1400" alt="Luxury Executive Office" class="hero-img">
    <div class="container" style="position: relative; z-index: 10;">
      <div class="hero-content">
        <h1>Smart Financial <br>Solutions for <br>Your Future</h1>
        <p>Bespoke loans, strategic investments, and elite financial planning tailored for high-net-worth individuals and growing enterprises.</p>
        <div style="margin-top: 3rem;">
           <a href="#services" style="color: #fff; border-bottom: 1px solid PRIMARY_COLOR_PLACEHOLDER; padding-bottom: 8px; font-weight: 700; text-transform: uppercase; font-size: 0.9rem; letter-spacing: 2px;">Explore Solutions</a>
        </div>
      </div>
      
      <form class="hero-form-bar">
        <div class="form-field">
          <label>Full Name</label>
          <input type="text" name="full_name" placeholder="John Doe" required>
        </div>
        <div class="form-field">
          <label>Phone Number</label>
          <input type="tel" name="phone" placeholder="+1 (555) 000-0000" required>
        </div>
        <div class="form-field">
          <label>Email Address</label>
          <input type="email" name="email_address" placeholder="john@aureum.com" required>
        </div>
        <div class="form-field">
          <label>Strategy</label>
          <select name="strategy"><option>Wealth Management</option><option>Corporate Tax</option></select>
        </div>
        <button type="submit" class="btn-submit">Analyze</button>
      </form>
    </div>
  </section>

  <!-- OFFERINGS SECTION -->
  <section class="offerings" id="services">
    <div class="container">
      <span class="section-tag">✦ Elite Offerings</span>
      <h2>Bespoke Financial <br>Architecture</h2>
      <p class="offerings-lead">Tailored strategies designed for wealth preservation and aggressive growth.</p>
      
      <div class="off-grid">
        <div class="off-card">
          <div class="off-icon"><i class="fa-solid fa-wallet"></i></div>
          <h3>Personal Loans</h3>
          <p>Unsecured high-limit credit lines for sophisticated lifestyle acquisitions.</p>
          <a href="#" class="off-link">Discover More <i class="fa-solid fa-arrow-right-long"></i></a>
        </div>
        <div class="off-card">
          <div class="off-icon"><i class="fa-solid fa-hotel"></i></div>
          <h3>Home Loans</h3>
          <p>Premium mortgage solutions for luxury estates and international property.</p>
          <a href="#" class="off-link">Discover More <i class="fa-solid fa-arrow-right-long"></i></a>
        </div>
        <div class="off-card">
          <div class="off-icon"><i class="fa-solid fa-briefcase"></i></div>
          <h3>Business Finance</h3>
          <p>Strategic capital injections for enterprise expansion and acquisitions.</p>
          <a href="#" class="off-link">Discover More <i class="fa-solid fa-arrow-right-long"></i></a>
        </div>
        <div class="off-card">
          <div class="off-icon"><i class="fa-solid fa-chart-line"></i></div>
          <h3>Investment Planning</h3>
          <p>Diversified portfolios managed by top-tier institutional analysts.</p>
          <a href="#" class="off-link">Discover More <i class="fa-solid fa-arrow-right-long"></i></a>
        </div>
      </div>
    </div>
  </section>

  <!-- STATS BAR -->
  <section class="stats-bar">
    <div class="container stats-grid">
      <div class="stat-item">
        <h2>10,000+</h2>
        <p>Global Clients</p>
      </div>
      <div class="stat-item">
        <h2>99%</h2>
        <p>Approval Rate</p>
      </div>
      <div class="stat-item">
        <h2>$2B+</h2>
        <p>Managed Assets</p>
      </div>
    </div>
  </section>

  <!-- AUREUM STANDARD SECTION -->
  <section class="standard">
    <div class="container">
      <div style="text-align: center;">
        <span class="section-tag">✦ The Aureum Standard</span>
        <h2 style="font-size: 3rem; font-weight: 700;">Defined by precision, protected by expertise.</h2>
        <p style="color: #666; margin-top: 1rem;">Delivered with absolute discretion.</p>
      </div>
      
      <div class="std-grid">
        <div class="std-item">
          <div class="std-icon"><i class="fa-solid fa-bolt"></i></div>
          <h4>Fast Approval</h4>
          <p>Rapid processing timelines for time-sensitive opportunities.</p>
        </div>
        <div class="std-item">
          <div class="std-icon"><i class="fa-solid fa-percent"></i></div>
          <h4>Low Interest</h4>
          <p>Market-leading rates optimized for institutional liquidity.</p>
        </div>
        <div class="std-item">
          <div class="std-icon"><i class="fa-solid fa-person-pin-circle"></i></div>
          <h4>Expert Advisors</h4>
          <p>Personalized guidance from seasoned finance professionals.</p>
        </div>
        <div class="std-item">
          <div class="std-icon"><i class="fa-solid fa-shield-halved"></i></div>
          <h4>Secure Process</h4>
          <p>Banking-grade encryption and absolute data privacy.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- STREAMLINED JOURNEY -->
  <section class="journey" id="process">
    <div class="container">
      <div style="text-align: center;">
         <h2 style="font-size: 3rem; font-weight: 700;">Streamlined Journey</h2>
         <p style="color: #666; margin-top: 1rem;">From application to disbursement, excellence at every step.</p>
      </div>
      <div class="journey-grid">
        <div class="step-card">
          <div class="step-num">1</div>
          <h3>Apply</h3>
          <p>Submit your initial credentials through our secure portal.</p>
        </div>
        <div class="step-card">
          <div class="step-num">2</div>
          <h3>Review</h3>
          <p>Our analysts evaluate your profile and financial goals.</p>
        </div>
        <div class="step-card">
          <div class="step-num">3</div>
          <h3>Approval</h3>
          <p>Receive a formal offer tailored to your requirements.</p>
        </div>
        <div class="step-card">
          <div class="step-num">4</div>
          <h3>Disbursement</h3>
          <p>Funds are transferred to your accounts with speed.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- VOICES OF EXCELLENCE -->
  <section class="voices">
    <div class="container">
       <div style="text-align: center;">
         <span class="section-tag">✦ Client Testimonials</span>
         <h2 style="font-size: 3rem; font-weight: 700;">Voices of Excellence</h2>
      </div>
      <div class="voices-grid">
        <div class="voice-card">
          <div class="stars"><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i></div>
          <p class="voice-text">"The level of personal attention and financial acumen provided by Aureum is simply unmatched in the traditional banking sector."</p>
          <div class="voice-author">
            <h4>Alexander Vance</h4>
            <span>CEO, Vance Global</span>
          </div>
        </div>
        <div class="voice-card">
          <div class="stars"><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i></div>
          <p class="voice-text">"Securing capital for our new headquarters was seamless. Their team handled the complexity with absolute professional grace."</p>
          <div class="voice-author">
            <h4>Sarah Chen</h4>
            <span>Managing Director, Helix Arch</span>
          </div>
        </div>
        <div class="voice-card">
          <div class="stars"><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i></div>
          <p class="voice-text">"Their investment planning has consistently outperformed market benchmarks while maintaining a conservative risk profile."</p>
          <div class="voice-author">
            <h4>Marcus Thorne</h4>
            <span>Private Investor</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- FINAL CTA SECTION -->
  <section class="cta-section">
    <div class="container">
      <div class="cta-trust-bar">
        <div class="trust-item"><i class="fa-solid fa-shield-halved"></i> SECURE ASSETS</div>
        <div class="trust-item"><i class="fa-solid fa-award"></i> TOP RATED</div>
      </div>
      <h2>Ready to Scale <br>Your Wealth?</h2>
      <p>Join over 5,000 elite partners who have optimized their financial future with Aureum's proprietary strategies.</p>
      <a href="#contact" class="btn-final">Open Your Account</a>
    </div>
    <!-- Decorative Graphic -->
    <div style="position: absolute; bottom: -20px; right: 50px; opacity: 0.05; font-size: 20rem; pointer-events: none;">
      <i class="fa-solid fa-building-columns"></i>
    </div>
  </section>
</main>

<!-- FOOTER -->
<footer>
  <div class="container foot-grid">
    <div class="foot-col foot-brand">
       <div class="logo">LOGO_PLACEHOLDER</div>
       <p>Pioneering excellence in institutional finance and private wealth management.</p>
    </div>
    <div class="foot-col">
      <h5>Navigation</h5>
      <div class="foot-links">
        <a href="#">Home</a>
        <a href="#">Services</a>
        <a href="#">Loans</a>
      </div>
    </div>
    <div class="foot-col">
      <h5>Legal</h5>
      <div class="foot-links">
        <a href="#">Privacy Policy</a>
        <a href="#">Terms of Service</a>
        <a href="#">Regulatory Disclosure</a>
        <a href="#">Investor Relations</a>
      </div>
    </div>
    <div class="foot-col">
      <h5>Follow Us</h5>
      <div class="foot-social">
         <i class="fa-solid fa-earth-americas"></i>
         <i class="fa-solid fa-chart-line"></i>
         <i class="fa-solid fa-envelope"></i>
      </div>
    </div>
  </div>
  <div class="container" style="margin-top: 5rem; padding-top: 3rem; border-top: 1px solid rgba(255,255,255,0.05); text-align: center; color: #444; font-size: 0.8rem;">
    <p>© 2026 PROJECT_NAME_PLACEHOLDER. All rights reserved.</p>
  </div>
</footer>
`
