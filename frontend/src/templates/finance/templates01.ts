export const finance01Styles = `
:root {
  --primary: PRIMARY_COLOR_PLACEHOLDER;
  --secondary: SECONDARY_COLOR_PLACEHOLDER;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Outfit', sans-serif; background-color: #fff; color: #111; line-height: 1.5; overflow-x: hidden; }

.container { max-width: 1240px; margin: 0 auto; padding: 0 1.5rem; }
img { max-width: 100%; display: block; }
a { text-decoration: none; color: inherit; transition: 0.3s; }

/* Navigation */
.nav { padding: 1.25rem 0; background: #fff; position: relative; z-index: 100; }
.nav-inner { display: flex; justify-content: space-between; align-items: center; }
.logo { font-size: 1.6rem; font-weight: 800; color: var(--primary); display: flex; align-items: center; gap: 8px; }
.nav-links { display: flex; gap: 2.5rem; }
.nav-links a { color: #4b5563; font-size: 0.9rem; font-weight: 600; }
.btn-primary { background-color: var(--primary); color: #fff; padding: 0.75rem 1.8rem; border-radius: 6px; font-weight: 700; font-size: 0.85rem; border: none; cursor: pointer; }

/* Hero Section with Exact Curved Shape */
.hero { position: relative; padding: 6rem 0 15rem; background: #f8fafc; overflow: hidden; }
.hero-bg-shape { 
    position: absolute; top: 0; left: 0; width: 55%; height: 100%; 
    background-color: var(--primary); 
    background-image: linear-gradient(135deg, var(--secondary) 0%, var(--primary) 100%); 
    z-index: 1; 
    border-bottom-right-radius: 50% 20%; 
}
.hero-inner { position: relative; z-index: 10; display: grid; grid-template-columns: 1.1fr 1fr; gap: 5rem; align-items: center; }
.hero-text { color: #fff; }
.hero-text span { font-size: 0.75rem; text-transform: uppercase; font-weight: 800; letter-spacing: 2px; opacity: 0.8; }
.hero-text h1 { font-size: 3.8rem; font-weight: 800; line-height: 1.1; margin: 1.5rem 0; }
.hero-text p { font-size: 1.05rem; opacity: 0.9; margin-bottom: 3.5rem; max-width: 500px; line-height: 1.7; }
.hero-btns { display: flex; gap: 1.5rem; }
.btn-hero-white { background-color: #fff; color: var(--primary); padding: 1.1rem 2.8rem; border-radius: 4px; font-weight: 800; font-size: 0.95rem; box-shadow: 0 10px 20px rgba(0,0,0,0.1); border: none; }
.btn-hero-outline { border: 1.5px solid #fff; color: #fff; padding: 1.1rem 2.8rem; border-radius: 4px; font-weight: 800; font-size: 0.95rem; background: transparent; }

.hero-img-box { position: relative; }
.hero-img { border-radius: 40px; overflow: hidden; box-shadow: 0 40px 80px rgba(0,0,0,0.2); }
.hero-img img { width: 100%; height: 550px; object-fit: cover; }
.hero-badge { 
    position: absolute; bottom: 30px; left: -30px; 
    background: #fff; padding: 1rem 1.5rem; border-radius: 12px; 
    box-shadow: 0 20px 40px rgba(0,0,0,0.1); 
    display: flex; align-items: center; gap: 12px; 
}
.hero-badge .icon { width: 32px; height: 32px; background-color: var(--primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 0.8rem; }
.hero-badge span { font-size: 0.75rem; font-weight: 800; color: #111; }

/* Floating Horizontal Form Bar */
.form-bar-container { position: relative; margin-top: -80px; z-index: 100; }
.form-bar { 
    background: #fff; padding: 1rem; border-radius: 12px; 
    box-shadow: 0 30px 60px rgba(0,0,0,0.08); 
    display: grid; grid-template-columns: 1fr 1fr 1fr auto; 
    gap: 0; align-items: center; 
    border: 1px solid #000; 
}
.form-group { padding: 0.75rem 2rem; border-right: 1px solid #f1f5f9; }
.form-group:nth-child(3) { border-right: none; }
.form-group label { display: block; font-size: 0.6rem; text-transform: uppercase; color: #000; font-weight: 800; margin-bottom: 6px; letter-spacing: 1px; }
.form-group input { width: 100%; border: none; outline: none; font-size: 1rem; font-weight: 600; color: #000; }
.btn-submit { background-color: var(--primary); color: #fff; border: none; padding: 1.25rem 3rem; border-radius: 8px; font-weight: 800; font-size: 0.95rem; cursor: pointer; }

/* About Section */
.about { padding: 12rem 0; }
.about-grid { display: grid; grid-template-columns: 1fr 1.1fr; gap: 8rem; align-items: center; }
.about-visual { position: relative; }
.about-img-wrap { border-radius: 30px; overflow: hidden; box-shadow: 0 40px 80px rgba(0,0,0,0.1); width: 100%; }
.about-img-wrap img { width: 100%; height: 500px; object-fit: cover; }
.about-stats-badge { 
    position: absolute; bottom: 30px; right: -20px; 
    background: #fff; padding: 1.5rem 2.5rem; border-radius: 12px; 
    box-shadow: 0 30px 60px rgba(0,0,0,0.12); 
    text-align: center; 
}
.about-stats-badge h4 { font-size: 1.8rem; font-weight: 800; color: var(--primary); line-height: 1; }
.about-stats-badge p { font-size: 0.7rem; font-weight: 800; text-transform: uppercase; color: #94a3b8; margin-top: 5px; }

.about-text span { color: var(--primary); font-weight: 800; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 2px; }
.about-text h2 { font-size: 3.2rem; font-weight: 800; line-height: 1.2; margin: 1.5rem 0; }
.about-text p { font-size: 1.05rem; color: #4b5563; margin-bottom: 3.5rem; line-height: 1.7; }
.about-features { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; }
.about-item h5 { font-size: 1.1rem; font-weight: 800; margin-bottom: 0.75rem; color: #111; }
.about-item p { font-size: 0.9rem; color: #64748b; }

/* Service Cards */
.services { padding: 10rem 0; background: #f9fafb; text-align: center; }
.services h2 { font-size: 3rem; font-weight: 800; margin-bottom: 6rem; }
.srv-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2rem; }
.srv-card { background: #fff; padding: 4rem 2.5rem; border-radius: 20px; text-align: left; border: 1px solid #f1f5f9; transition: 0.4s; }
.srv-card:hover { transform: translateY(-15px); border-color: var(--primary); box-shadow: 0 40px 80px rgba(0,0,0,0.05); }
.srv-icon-box { width: 50px; height: 50px; background-color: #eff6ff; color: var(--primary); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; margin-bottom: 2rem; }
.srv-card h3 { font-size: 1.3rem; font-weight: 700; margin-bottom: 1.25rem; }
.srv-card p { font-size: 0.95rem; color: #64748b; margin-bottom: 2rem; line-height: 1.6; }
.srv-link { color: var(--primary); font-weight: 800; font-size: 0.8rem; text-transform: uppercase; display: flex; align-items: center; gap: 8px; }

/* Why Choose Us - Large Portrait Image */
.why { background: #0f172a; color: #fff; padding: 12rem 0; }
.why-grid { display: grid; grid-template-columns: 1fr 1.1fr; gap: 8rem; align-items: center; }
.why-img-box { border-radius: 40px; overflow: hidden; box-shadow: 0 40px 100px rgba(0,0,0,0.3); height: 600px; }
.why-img-box img { width: 100%; height: 100%; object-fit: cover; }
.why-text h2 { font-size: 3.2rem; font-weight: 800; margin-bottom: 2rem; }
.why-list { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; margin-top: 4rem; }
.why-list-item h5 { font-size: 1.15rem; font-weight: 700; margin-bottom: 0.75rem; display: flex; align-items: center; gap: 12px; }
.why-list-item h5::before { content: ''; width: 8px; height: 8px; background-color: PRIMARY_COLOR_PLACEHOLDER; border-radius: 50%; }
.why-list-item p { color: #94a3b8; font-size: 0.95rem; }

/* Blue Stats Bar */
.stats-bar { background-color: var(--primary); padding: 6rem 0; color: #fff; }
.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); text-align: center; }
.stat-item h2 { font-size: 3.5rem; font-weight: 800; line-height: 1; }
.stat-item p { font-size: 0.8rem; text-transform: uppercase; font-weight: 800; margin-top: 10px; opacity: 0.8; }

/* Projects / Case Studies */
.cases { padding: 12rem 0; }
.cases-head { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 6rem; }
.case-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }
.case-card { background: var(--primary); padding: 4rem 3rem; border-radius: 20px; color: #fff; position: relative; transition: 0.4s; }
.case-card span { font-size: 0.7rem; opacity: 0.6; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; }
.case-card h3 { font-size: 1.5rem; font-weight: 700; margin-top: 1.25rem; line-height: 1.3; }
.case-icon { position: absolute; top: 4rem; right: 3rem; font-size: 1.5rem; opacity: 0.2; }

/* Consultation Banner */
.cta-banner { background-color: var(--primary); padding: 6rem 0; color: #fff; }
.cta-inner { display: flex; justify-content: space-between; align-items: center; }
.cta-inner h2 { font-size: 2.5rem; font-weight: 800; line-height: 1.2; }

/* Testimonial Section */
.testimonial { padding: 12rem 0; background: #f9fafb; text-align: center; }
.test-box { max-width: 900px; margin: 0 auto; background: #fff; padding: 6rem 4rem; border-radius: 24px; box-shadow: 0 20px 60px rgba(0,0,0,0.03); }
.test-box p { font-size: 1.6rem; color: #334155; font-style: italic; margin-bottom: 3rem; line-height: 1.7; }
.test-meta h4 { font-size: 1.25rem; font-weight: 800; color: #111; }
.test-meta span { color: PRIMARY_COLOR_PLACEHOLDER; font-weight: 800; font-size: 0.9rem; text-transform: uppercase; margin-top: 5px; display: block; }

/* Final Contact Form */
.contact { padding: 12rem 0; text-align: center; }
.contact h2 { font-size: 3.5rem; font-weight: 800; margin-bottom: 5rem; }
.contact-form { max-width: 850px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; text-align: left; }
.form-full { grid-column: span 2; }
.contact-form input, .contact-form textarea { width: 100%; padding: 1.25rem; border: 1px solid #000; border-radius: 8px; font-family: inherit; font-size: 1rem; color: #000; }
.btn-send { background-color: var(--primary); color: #fff; border: none; padding: 1.25rem 4rem; border-radius: 8px; font-weight: 800; text-transform: uppercase; cursor: pointer; margin-top: 2rem; }

/* Footer */
footer { background: #0f172a; color: #fff; padding: 10rem 0 5rem; }
.foot-grid { display: grid; grid-template-columns: 1.8fr 1fr 1fr 1.2fr; gap: 8rem; }
.foot-col h5 { font-size: 0.9rem; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 2.5rem; color: #fff; }
.foot-links a { display: block; color: #94a3b8; margin-bottom: 1.2rem; font-size: 0.95rem; }

/* Responsive Media Queries */
@media (max-width: 1024px) {
    .hero-bg-shape { width: 100%; height: 50%; border-bottom-right-radius: 0; border-bottom-left-radius: 0; }
    .hero-inner { grid-template-columns: 1fr !important; text-align: center; gap: 3rem; }
    .hero-text p { margin-left: auto; margin-right: auto; }
    .hero-btns { justify-content: center; }
    .hero-img img { height: 400px; }
    .hero-badge { left: 0; bottom: -20px; }
    
    .form-bar { grid-template-columns: 1fr !important; gap: 0; }
    .form-group { border-right: none; border-bottom: 1px solid #f1f5f9; padding: 1.5rem; }
    
    .about-grid { grid-template-columns: 1fr !important; gap: 4rem; text-align: center; }
    .about-features { grid-template-columns: 1fr !important; }
    .about-stats-badge { right: 0; bottom: -10px; }
    
    .srv-grid { grid-template-columns: 1fr 1fr !important; }
    .why-grid { grid-template-columns: 1fr !important; text-align: center; }
    .why-img-box { height: 400px; }
    .why-list { grid-template-columns: 1fr !important; text-align: left; }
    
    .stats-grid { grid-template-columns: 1fr 1fr !important; gap: 3rem; }
    .case-grid { grid-template-columns: 1fr 1fr !important; }
    
    .cta-inner { flex-direction: column; text-align: center; gap: 3rem; }
    .contact-form { grid-template-columns: 1fr !important; }
    .foot-grid { grid-template-columns: 1fr 1fr !important; gap: 4rem; }
}

@media (max-width: 640px) {
    .hero-text h1 { font-size: 2.5rem; }
    .srv-grid, .stats-grid, .case-grid, .foot-grid { grid-template-columns: 1fr !important; }
    .nav-links { display: none; } /* Basic mobile menu handling */
    .btn-nav-top { padding: 0.6rem 1.2rem; font-size: 0.75rem; }
    .test-box { padding: 3rem 2rem; }
    .test-box p { font-size: 1.2rem; }
}
`

export const finance01Html = `
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800;900&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">

<header class="nav">
  <div class="container nav-inner">
    <div class="logo">LOGO_PLACEHOLDER</div>
    <a href="#contact" class="btn-primary">Get A Quote</a>
  </div>
</header>

<main>
  <!-- HERO SECTION WITH CURVED BLUE SHAPE -->
  <section class="hero">
    <div class="hero-bg-shape"></div>
    <div class="container hero-inner">
      <div class="hero-text">
        <span>BEST FINANCE COMPANY</span>
        <h1>Our Finance Can <br>Give Possibilities <br>For Business</h1>
        <p>We deliver tailored financial strategies for ambitious companies — turning complex numbers into clear, actionable opportunities for sustainable growth.</p>
        <div class="hero-btns">
          <a href="#services" class="btn-hero-white">Discover More</a>
          <a href="#contact" class="btn-hero-outline">Contact Us</a>
        </div>
      </div>
      <div class="hero-img-box">
        <div class="hero-img">
          <img src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800" alt="Global Business">
        </div>
        <div class="hero-badge">
           <div class="icon"><i class="fa-solid fa-headset"></i></div>
           <span>24/7 Expert Support</span>
        </div>
      </div>
    </div>
  </section>

  <!-- FLOATING HORIZONTAL FORM BAR -->
  <div class="container form-bar-container">
    <form class="form-bar">
      <div class="form-group">
        <label>Full Name</label>
        <input type="text" name="full_name" placeholder="John Carter" required>
      </div>
      <div class="form-group">
        <label>Email Address</label>
        <input type="email" name="email_address" placeholder="you@company.com" required>
      </div>
      <div class="form-group">
        <label>Phone Number</label>
        <input type="tel" name="phone" placeholder="+1 (555) 000-0000" required>
      </div>
      <button type="submit" class="btn-submit">Get Started</button>
    </form>
  </div>

  <!-- ABOUT SECTION WITH ROUNDED SQUARE IMAGE -->
  <section class="about" id="about">
    <div class="container about-grid">
      <div class="about-visual">
        <div class="about-img-wrap">
          <img src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=600" alt="Finance Expert">
        </div>
        <div class="about-stats-badge">
          <h4>6,561+</h4>
          <p>Satisfied Clients</p>
        </div>
      </div>
      <div class="about-text">
        <span>ABOUT FINOVA</span>
        <h2>Get Exceptional Service <br>For Growth</h2>
        <p>For over two decades, we've partnered with founders and CFOs to architect financial systems that scale. Our team blends deep expertise with modern tools to unlock your company's full potential.</p>
        <div class="about-features">
          <div class="about-item">
            <h5>Our Mission</h5>
            <p>Empower businesses with clarity and confidence.</p>
          </div>
          <div class="about-item">
            <h5>Our Goals</h5>
            <p>Sustainable growth backed by data-driven strategy.</p>
          </div>
        </div>
        <a href="#" class="btn-primary" style="padding: 1.25rem 3.5rem; margin-top: 4rem; display: inline-block;">Explore More</a>
      </div>
    </div>
  </section>

  <!-- SERVICES GRID -->
  <section class="services" id="services">
    <div class="container">
      <span style="color: #2a58e8; font-weight: 800; font-size: 0.8rem; letter-spacing: 2px;">WHAT WE'RE OFFERING</span>
      <h2 style="margin-top: 1.5rem;">We Solve Finance Problems <br>With Strategy</h2>
      <div class="srv-grid">
        <div class="srv-card">
          <div class="srv-icon-box"><i class="fa-solid fa-magnifying-glass-chart"></i></div>
          <h3>Audit Marketing</h3>
          <p>Detailed performance audits that uncover hidden growth levers.</p>
          <a href="#" class="srv-link">Read More <i class="fa-solid fa-arrow-right-long"></i></a>
        </div>
        <div class="srv-card">
          <div class="srv-icon-box"><i class="fa-solid fa-comments-dollar"></i></div>
          <h3>Finance Consulting</h3>
          <p>Strategic guidance to optimize cash flow, capital and risk.</p>
          <a href="#" class="srv-link">Read More <i class="fa-solid fa-arrow-right-long"></i></a>
        </div>
        <div class="srv-card">
          <div class="srv-icon-box"><i class="fa-solid fa-chart-pie"></i></div>
          <h3>Wealth Management</h3>
          <p>Tailored portfolio strategies for long-term prosperity.</p>
          <a href="#" class="srv-link">Read More <i class="fa-solid fa-arrow-right-long"></i></a>
        </div>
        <div class="srv-card">
          <div class="srv-icon-box"><i class="fa-solid fa-shield-halved"></i></div>
          <h3>Risk Advisory</h3>
          <p>Identify, quantify and protect against critical business risks.</p>
          <a href="#" class="srv-link">Read More <i class="fa-solid fa-arrow-right-long"></i></a>
        </div>
      </div>
    </div>
  </section>

  <!-- WHY CHOOSE US (DARK) -->
  <section class="why">
    <div class="container why-grid">
      <div class="why-img-box">
        <img src="https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=600" alt="Strategic Partnership">
      </div>
      <div class="why-text">
        <span style="color: #2a58e8; font-weight: 800;">WHY CHOOSE US</span>
        <h2 style="margin-top: 1.5rem;">Our Mission, Values <br>and Motto</h2>
        <p>We believe great finance is invisible — it removes friction, illuminates decisions and quietly compounds.</p>
        <div class="why-list">
          <div class="why-list-item">
            <h5>Trusted Advisory</h5>
            <p>Data-Driven Strategy</p>
          </div>
          <div class="why-list-item">
            <h5>Long-Term Partnership</h5>
            <p>Transparent Pricing</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- STATS BAR -->
  <section class="stats-bar">
    <div class="container stats-grid">
      <div class="stat-item"><h2>1,001+</h2><p>Projects Completed</p></div>
      <div class="stat-item"><h2>6,561+</h2><p>Active Clients</p></div>
      <div class="stat-item"><h2>600+</h2><p>Business Ideas</p></div>
      <div class="stat-item"><h2>250+</h2><p>Global Offices</p></div>
    </div>
  </section>

  <!-- PROJECTS / CASE STUDIES -->
  <section class="cases" id="projects">
    <div class="container">
      <div class="cases-head">
        <div>
          <span style="color: #2a58e8; font-weight: 800;">OUR LATEST PROJECTS</span>
          <h2 style="font-size: 3rem; font-weight: 800; margin-top: 1.5rem;">Incredible Client Stories</h2>
        </div>
        <a href="#" style="color: #2a58e8; font-weight: 800; border-bottom: 2px solid #2a58e8;">View All Cases</a>
      </div>
      <div class="case-grid">
        <div class="case-card">
          <div class="case-icon"><i class="fa-solid fa-chart-line"></i></div>
          <span>FINANCE</span>
          <h3>Financial Report Restructure</h3>
        </div>
        <div class="case-card">
          <div class="case-icon"><i class="fa-solid fa-chess"></i></div>
          <span>STRATEGY</span>
          <h3>Business Growth Solutions</h3>
        </div>
        <div class="case-card">
          <div class="case-icon"><i class="fa-solid fa-vault"></i></div>
          <span>WEALTH</span>
          <h3>Portfolio Optimization Plan</h3>
        </div>
        <div class="case-card">
          <div class="case-icon"><i class="fa-solid fa-clipboard-check"></i></div>
          <span>AUDIT</span>
          <h3>Operational Audit Overhaul</h3>
        </div>
        <div class="case-card">
          <div class="case-icon"><i class="fa-solid fa-shield-virus"></i></div>
          <span>RISK</span>
          <h3>Enterprise Risk Framework</h3>
        </div>
        <div class="case-card">
          <div class="case-icon"><i class="fa-solid fa-globe"></i></div>
          <span>TAX</span>
          <h3>Cross-Border Tax Strategy</h3>
        </div>
      </div>
    </div>
  </section>

  <!-- CONSULTATION BANNER -->
  <section class="cta-banner">
    <div class="container cta-inner">
       <h2>Get a Free Expert Consultation <br>For Your Business</h2>
       <a href="#" class="btn-hero-white" style="border-radius: 4px; padding: 1.25rem 4rem;">Book A Call</a>
    </div>
  </section>

  <!-- TESTIMONIAL -->
  <section class="testimonial">
    <div class="container">
      <div class="test-box">
        <p>"PROJECT_NAME_PLACEHOLDER transformed how we think about capital. Their team is sharp, kind, and relentlessly focused on the numbers that move our business forward."</p>
        <div class="test-meta">
          <h4>Marcus Chen</h4>
          <span>CFO, Helix Ventures</span>
        </div>
      </div>
    </div>
  </section>

  <!-- FINAL CONTACT FORM -->
  <section class="contact" id="contact">
    <div class="container">
      <span>GET IN TOUCH</span>
      <h2 style="margin-top: 1.5rem;">Ready to Talk Numbers?</h2>
      <form class="contact-form">
        <input type="text" name="full_name" placeholder="Jane Doe" required>
        <input type="email" name="email_address" placeholder="jane@company.com" required>
        <input type="tel" name="phone" placeholder="+1 (555) 000-0000" class="form-full" required>
        <textarea name="message" placeholder="Tell us about your business..." rows="5" class="form-full" required></textarea>
        <div class="form-full" style="text-align: center;">
           <button type="submit" class="btn-send">Send Now</button>
        </div>
      </form>
    </div>
  </section>
</main>

<footer>
  <div class="container foot-grid">
    <div class="foot-col">
       <div class="logo" style="color: #fff; font-size: 1.5rem; letter-spacing: 2px;">LOGO_PLACEHOLDER</div>
       <p style="color: #94a3b8; line-height: 1.8;">Premium finance consulting for ambitious businesses. Trusted by founders, CFOs and boards across 40+ countries.</p>
       <div style="margin-top: 2rem; color: #fff;">
          <p>PHONE_PLACEHOLDER</p>
          <p>EMAIL_PLACEHOLDER</p>
       </div>
    </div>
    <div class="foot-col">
       <h5>Useful Links</h5>
       <div class="foot-links">
          <a href="#">About Us</a>
          <a href="#">Case Studies</a>
          <a href="#">Careers</a>
          <a href="#">Pricing</a>
       </div>
    </div>
    <div class="foot-col">
       <h5>Services</h5>
       <div class="foot-links">
          <a href="#">Finance Consulting</a>
          <a href="#">Wealth Management</a>
          <a href="#">Audit Marketing</a>
          <a href="#">Risk Advisory</a>
       </div>
    </div>
    <div class="foot-col">
       <h5>Newsletter</h5>
       <p style="color: #94a3b8; font-size: 0.85rem; margin-bottom: 1.5rem;">Get monthly insights from our senior advisors.</p>
       <form style="display: flex; gap: 10px;">
          <input type="email" placeholder="Your email" style="background: #1e293b; border: none; padding: 0.8rem; border-radius: 4px; color: #fff; width: 100%;" required>
          <button type="submit" style="background-color: PRIMARY_COLOR_PLACEHOLDER; color: #fff; border: none; padding: 0.8rem 1.2rem; border-radius: 4px;"><i class="fa-solid fa-paper-plane"></i></button>
       </form>
    </div>
  </div>
  <div class="container" style="margin-top: 5rem; padding-top: 3rem; border-top: 1px solid rgba(255,255,255,0.05); text-align: center; color: #4b5563; font-size: 0.85rem;">
     <p>© 2026 PROJECT_NAME_PLACEHOLDER. All rights reserved.</p>
  </div>
</footer>


<script id="core-interactions">
  (function() {
    // Check if we are inside GrapesJS editor
    var isInEditor = !!document.querySelector('[data-gjs-type]') || document.body.classList.contains('gjs-dashed');
    
    // Form Validation (runs everywhere so you can see red borders in editor)
    document.addEventListener('submit', function(e) {
      if (e.target.tagName === 'FORM') {
        e.target.setAttribute('novalidate', 'true');
        var isValid = true;
        var inputs = e.target.querySelectorAll('input:not([type="submit"]):not([type="hidden"]):not([type="button"]), textarea, select');
        
        inputs.forEach(function(input) {
          if (!input.dataset.valSetup) {
            input.dataset.valSetup = 'true';
            input.addEventListener('input', function() {
              if (input.value.trim()) {
                input.style.outline = '2px solid #22c55e';
                input.style.outlineOffset = '1px';
                input.style.borderColor = '#22c55e';
                if (input.nextElementSibling && input.nextElementSibling.classList.contains('val-error')) {
                  input.nextElementSibling.style.display = 'none';
                }
              } else {
                input.style.outline = '2px solid #ef4444';
                input.style.outlineOffset = '1px';
                input.style.borderColor = '#ef4444';
                if (input.nextElementSibling && input.nextElementSibling.classList.contains('val-error')) {
                  input.nextElementSibling.style.display = 'block';
                }
              }
            });
          }

          if (!input.value.trim() && input.hasAttribute('required')) {
            isValid = false;
            input.style.outline = '2px solid #ef4444';
            input.style.outlineOffset = '1px';
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
        
        if (!isValid || isInEditor) {
          e.preventDefault();
          e.stopImmediatePropagation();
        } else if (!isInEditor) {
          e.preventDefault();
          var btn = e.target.querySelector('button[type="submit"]') || e.target.querySelector('input[type="submit"]');
          if (btn) {
            if(btn.innerText) btn.innerText = 'Sending...';
            else btn.value = 'Sending...';
          }
          setTimeout(function() {
            e.target.innerHTML = '<div style="padding: 20px; text-align: center; border: 2px dashed #22c55e; border-radius: 8px; background: rgba(34,197,94,0.1); color: #166534;"><h3 style="margin: 0 0 10px 0; font-size: 20px;">Thank You!</h3><p style="margin: 0;">Your request has been submitted successfully.</p></div>';
          }, 1000);
        }
      }
    }, true);
  })();
</script>

`
