// Premium Healthcare Template 02 — High-Fidelity, Modern & Global Branding Ready
// Optimized for GrapesJS Editor and Dynamic Branding Registry

export const healthcare02Styles = `
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200');

:root {
  /* Global Branding Placeholders */
  --primary: PRIMARY_COLOR_PLACEHOLDER;
  --secondary: SECONDARY_COLOR_PLACEHOLDER;
  
  /* Neutral Colors */
  --text-dark: #0f172a;
  --text-light: #64748b;
  --white: #ffffff;
  --bg-soft: #f8fafc;
  --border-color: #f1f5f9;
}

* { box-sizing: border-box; margin: 0; padding: 0; transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }

html {
  scroll-behavior: smooth;
}

body { 
  font-family: 'Inter', sans-serif; 
  color: var(--text-dark); 
  line-height: 1.6; 
  background: var(--white); 
  overflow-x: hidden; 
}

h1, h2, h3, h4 { 
  font-family: 'Manrope', sans-serif; 
  font-weight: 800; 
  color: var(--text-dark); 
  line-height: 1.2;
}

.container { 
  max-width: 1200px; 
  margin: 0 auto; 
  padding: 0 1.5rem; 
}

.section-padding { padding: 8rem 0; }

img { max-width: 100%; display: block; border-radius: 8px; object-fit: cover; }

/* Global Color Utility Classes */
.text-primary { color: var(--primary) !important; }
.bg-primary { background-color: var(--primary) !important; }
.text-secondary { color: var(--secondary) !important; }
.bg-secondary { background-color: var(--secondary) !important; }

/* Navbar */
.navbar {
  position: absolute;
  top: 0; left: 0; right: 0;
  z-index: 100;
  padding: 1.5rem 0;
}

.nav-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo { font-size: 1.25rem; font-weight: 800; color: #fff; }

.btn-register {
  background-color: var(--secondary) !important;
  color: #ffffff !important;
  padding: 0.8rem 1.8rem;
  border-radius: 6px;
  font-weight: 700;
  text-decoration: none;
  font-size: 0.8rem;
  display: inline-block;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

/* PREMIUM HERO SECTION */
.hero {
  position: relative;
  height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #fff;
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  inset: 0;
  z-index: -1;
}

.hero-bg img { 
  width: 100%; 
  height: 100%; 
  filter: brightness(0.3); 
  border-radius: 0; 
  animation: slowZoom 20s infinite alternate;
}

@keyframes slowZoom {
  from { transform: scale(1); }
  to { transform: scale(1.15); }
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(11, 26, 45, 0.6), rgba(11, 26, 45, 0.8));
  z-index: 0;
}

.hero-content { 
  position: relative; 
  z-index: 10; 
  max-width: 850px;
  animation: heroFloat 3s ease-in-out infinite;
}

@keyframes heroFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
}

.hero span { 
  color: var(--primary); 
  font-weight: 800; 
  font-size: 0.85rem; 
  text-transform: uppercase; 
  letter-spacing: 3px; 
  display: inline-block;
  margin-bottom: 1.5rem;
}

.hero h1 { font-size: clamp(2.5rem, 6vw, 4.2rem); color: #ffffff; margin-bottom: 2.5rem; line-height: 1.1; }

.hero h1 span { color: var(--primary); text-transform: none; font-size: inherit; }

.btn-join {
  background-color: var(--primary) !important;
  color: #ffffff !important;
  padding: 1.2rem 3rem;
  border-radius: 50px;
  font-weight: 800;
  font-size: 1rem;
  text-decoration: none;
  display: inline-block;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
  border: none;
}
.btn-join:hover { transform: scale(1.05); opacity: 0.9; }

/* Feature Bar */
.features-bar {
  margin-top: -5rem;
  position: relative;
  z-index: 20;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  background: #ffffff;
  box-shadow: 0 20px 50px rgba(0,0,0,0.1);
  border-radius: 12px;
  overflow: hidden;
}

.feature-card {
  padding: 3rem 2rem;
  text-align: center;
  border-right: 1px solid var(--border-color);
  background: #ffffff;
}

.feature-card:last-child { border-right: none; }

.feature-card.active { 
  background-color: var(--primary) !important; 
  color: #ffffff !important; 
  transform: scale(1.05); 
  z-index: 2; 
}

.feature-card .material-symbols-outlined { font-size: 2.5rem; color: var(--primary); margin-bottom: 1.5rem; }

.feature-card.active .material-symbols-outlined { color: #ffffff !important; }

.feature-card h3 { font-size: 1.2rem; margin-bottom: 1rem; }

.feature-card.active h3, .feature-card.active p { color: #ffffff !important; }

.feature-card p { font-size: 0.85rem; color: var(--text-light); }

/* ABOUT US SECTION */
.about { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; }

.about-bento {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 1rem;
  height: 500px;
}

.bento-item-1 { grid-row: span 2; }
.bento-item-2 { grid-column: span 1; }
.bento-item-3 { grid-column: span 1; }

.about-bento img { width: 100%; height: 100%; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }

.about-text span { color: var(--primary); font-weight: 800; font-size: 0.8rem; text-transform: uppercase; }

.about-text h2 { font-size: 2.5rem; margin: 1rem 0 1.5rem; }

.about-text p { color: var(--text-light); font-size: 0.95rem; margin-bottom: 2rem; }

.check-list { list-style: none; margin-bottom: 2.5rem; }

.check-list li {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  font-size: 0.9rem;
  font-weight: 700;
}

.check-list li .material-symbols-outlined { color: var(--primary); font-size: 1.2rem; }

.btn-about {
  background-color: var(--secondary) !important;
  color: #ffffff !important;
  padding: 0.8rem 2.2rem;
  border-radius: 6px;
  font-weight: 700;
  text-decoration: none;
  display: inline-block;
  font-size: 0.85rem;
}

/* SERVICES SECTION */
.services-section { background: var(--bg-soft); }

.services-header { text-align: center; margin-bottom: 5rem; }

.services-header span { color: var(--primary); font-weight: 800; font-size: 0.8rem; }

.services-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }

.service-card {
  text-align: center;
  padding: 3.5rem 2rem;
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid var(--border-color);
}

.service-card:hover { transform: translateY(-10px); border-color: var(--primary); }

.service-icon-box {
  width: 70px;
  height: 70px;
  margin: 0 auto 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-soft);
  border-radius: 12px;
  color: var(--primary);
}
.service-card:hover .service-icon-box { background-color: var(--primary) !important; color: #ffffff !important; }

.service-card h3 { font-size: 1.2rem; margin-bottom: 1rem; }

.service-card p { font-size: 0.85rem; color: var(--text-light); margin-bottom: 1.5rem; }

.btn-service-more {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: var(--text-dark);
  font-weight: 700;
  font-size: 0.8rem;
  text-decoration: none;
}
.btn-service-more:hover { color: var(--primary); gap: 0.7rem; }

/* Statistics (Dark Section) */
.stats-section { background: #0b1a2d; color: #fff; }

.stats-container { display: grid; grid-template-columns: 1fr 1.2fr; gap: 4rem; align-items: center; }

.stats-content span { color: var(--primary); font-weight: 800; font-size: 0.8rem; }

.stats-content h2 { color: #fff; font-size: 2.2rem; margin: 1rem 0 1.5rem; }

.stats-content p { font-size: 0.85rem; opacity: 0.7; margin-bottom: 3rem; }

.stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }

.stat-box {
  background: rgba(255,255,255,0.05);
  padding: 2rem;
  text-align: center;
  border-radius: 4px;
}

.stat-box .material-symbols-outlined { font-size: 2rem; color: var(--primary); margin-bottom: 1rem; }

.stat-box h4 { font-size: 1.8rem; color: #fff; margin-bottom: 0.25rem; }

.stat-box p { font-size: 0.75rem; opacity: 0.6; }

/* DOCTORS SECTION */
.doctors-header { text-align: center; margin-bottom: 5rem; }

.doctors-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2.5rem; }

.doctor-card { 
  text-align: center; 
  background: #ffffff; 
  padding: 1.5rem; 
  border-radius: 24px; 
  border: 1px solid var(--border-color);
  position: relative;
}
.doctor-card:hover { transform: translateY(-10px); box-shadow: 0 20px 40px rgba(0,0,0,0.05); }

.doctor-img-box {
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  margin-bottom: 1.5rem;
}

.doctor-card img { width: 100%; height: 380px; transition: 0.6s; }
.doctor-card:hover img { transform: scale(1.1); }

.doctor-overlay {
  position: absolute;
  inset: 0;
  background: rgba(11, 26, 45, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  opacity: 0;
  transition: 0.4s;
}
.doctor-card:hover .doctor-overlay { opacity: 1; }

.doctor-social {
  width: 45px;
  height: 45px;
  background-color: var(--primary) !important;
  color: #ffffff !important;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
}

.doctor-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background-color: var(--secondary) !important;
  color: #ffffff !important;
  font-size: 0.65rem;
  padding: 0.4rem 1rem;
  border-radius: 50px;
  font-weight: 800;
  z-index: 5;
}

.doctor-card h3 { font-size: 1.2rem; margin-bottom: 0.5rem; }

.doctor-card p { color: var(--primary); font-size: 0.8rem; font-weight: 800; text-transform: uppercase; }

/* FAQ */
.faq-section { display: grid; grid-template-columns: 1fr 1.5fr; gap: 5rem; align-items: center; }

.faq-image img { border-radius: 8px; height: 500px; width: 100%; }

.faq-header span { color: var(--primary); font-weight: 800; font-size: 0.8rem; }

.faq-header h2 { font-size: 2.2rem; margin: 1rem 0 2.5rem; }

.faq-list { list-style: none; display: flex; flex-direction: column; gap: 1rem; }

.faq-item-box {
  background: var(--bg-soft);
  border-radius: 4px;
  overflow: hidden;
}

.faq-item-box summary {
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  list-style: none;
}
.faq-item-box summary::-webkit-details-marker { display: none; }

.faq-item-box summary::after { 
  content: '+'; 
  color: var(--primary); 
  font-size: 1.5rem; 
}

.faq-item-box[open] summary::after { content: '-'; }

.faq-answer {
  padding: 0 2rem 1.5rem;
  color: var(--text-light);
  font-size: 0.85rem;
}

/* Contact Form */
.contact-section { background: var(--bg-soft); text-align: center; }

.contact-card {
  max-width: 750px;
  margin: 3rem auto 0;
  background: #ffffff;
  padding: 4rem;
  box-shadow: 0 10px 40px rgba(0,0,0,0.03);
}

.contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }

.contact-grid input, .contact-grid textarea {
  width: 100%;
  padding: 1rem;
  border: 1px solid var(--border-color);
  background: var(--bg-soft);
  font-family: inherit;
  font-size: 0.85rem;
  outline: none;
}

.contact-grid textarea { grid-column: span 2; }

.btn-submit {
  grid-column: span 2;
  background-color: var(--primary) !important;
  color: #ffffff !important;
  padding: 1rem;
  border: none;
  font-weight: 800;
  cursor: pointer;
  font-size: 0.9rem;
}

/* Footer */
.footer { background: #0b1a2d; color: #fff; padding: 5rem 0 2rem; }

.footer-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 1.2fr;
  gap: 4rem;
  padding-bottom: 4rem;
  border-bottom: 1px solid rgba(255,255,255,0.05);
}

.footer-col h4 { color: #fff; margin-bottom: 1.5rem; font-size: 1rem; }

.footer-col p { font-size: 0.8rem; opacity: 0.6; line-height: 1.8; }

.footer-links { list-style: none; }

.footer-links li { margin-bottom: 0.75rem; }

.footer-links a { color: #fff; opacity: 0.6; text-decoration: none; font-size: 0.8rem; }

.footer-links a:hover { color: var(--primary); }

.footer-bottom { text-align: center; padding-top: 2rem; font-size: 0.75rem; opacity: 0.4; }

@media (max-width: 1024px) {
  .hero h1 { font-size: 2.5rem; }
  .features-grid { grid-template-columns: 1fr; }
  .about, .stats-container, .faq-section, .footer-grid { grid-template-columns: 1fr; }
  .services-grid, .doctors-grid { grid-template-columns: 1fr 1fr; }
  .about-bento { height: 400px; margin-bottom: 2rem; }
}

@media (max-width: 640px) {
  .services-grid, .doctors-grid { grid-template-columns: 1fr; }
  .contact-card { padding: 2rem; }
  .contact-grid { grid-template-columns: 1fr; }
  .contact-grid textarea, .btn-submit { grid-column: span 1; }
}
`;

export const healthcare02Html = `
<header class="navbar">
  <div class="container nav-inner">
    <div class="logo">LOGO_PLACEHOLDER</div>
    <a href="#contact" class="btn-register">REGISTER</a>
  </div>
</header>

<section class="hero">
  <div class="hero-bg">
    <img src="/assets/templates/healthcare/templates02/bg-02.png" alt="Hero">
  </div>
  <div class="hero-overlay"></div>
  <div class="container hero-content">
    <span>✦ QUALITY HEALTHCARE SERVICES</span>
    <h1>Trust Our Experts for Your <br><span>Healthy Future</span></h1>
    <a href="#contact" class="btn-join">BOOK AN APPOINTMENT</a>
  </div>
</section>

<div class="container features-bar">
  <div class="features-grid">
    <div class="feature-card">
      <span class="material-symbols-outlined">health_and_safety</span>
      <h3 class="text-on-surface">Health Care</h3>
      <p>Professional care services for your well-being and health maintenance.</p>
    </div>
    <div class="feature-card active">
      <span class="material-symbols-outlined">medical_information</span>
      <h3 class="text-white">Best Doctors</h3>
      <p class="text-white" style="opacity:0.9;">Highly qualified and experienced medical professionals at your service.</p>
    </div>
    <div class="feature-card">
      <span class="material-symbols-outlined">support_agent</span>
      <h3 class="text-on-surface">24/7 Support</h3>
      <p>Round-the-clock medical assistance and patient support services.</p>
    </div>
  </div>
</div>

<section class="section-padding container">
  <div class="about">
    <div class="about-bento">
      <div class="bento-item-1"><img src="/assets/templates/healthcare/templates02/about-02.png" alt="Doctor Large"></div>
      <div class="bento-item-2"><img src="/assets/templates/healthcare/templates02/about-03.png" alt="Care Small"></div>
      <div class="bento-item-3"><img src="/assets/templates/healthcare/templates02/image-02.png" alt="Team Small"></div>
    </div>
    <div class="about-text">
      <span>ABOUT US</span>
      <h2>Our Quality System Is Ready To Help You!</h2>
      <p>We combine cutting-edge technology with the human touch of world-class physicians to provide a healthcare experience that is faster, safer, and more personal.</p>
      <ul class="check-list">
        <li><span class="material-symbols-outlined">check_circle</span> Professional Medical Staff</li>
        <li><span class="material-symbols-outlined">check_circle</span> Advanced Health Technology</li>
        <li><span class="material-symbols-outlined">check_circle</span> 24/7 Emergency Services</li>
        <li><span class="material-symbols-outlined">check_circle</span> Personalized Patient Care</li>
      </ul>
      <a href="#" class="btn-about">LEARN MORE</a>
    </div>
  </div>
</section>

<section class="section-padding services-section">
  <div class="container">
    <div class="services-header">
      <span>SERVICES</span>
      <h2 style="font-size:2.5rem; margin-top:1.5rem;">World-Class Healthcare Services</h2>
    </div>
    <div class="services-grid">
      <div class="service-card">
        <div class="service-icon-box">
          <span class="material-symbols-outlined">cardiology</span>
        </div>
        <h3>Cardiology</h3>
        <p>Expert heart care and diagnostics for a healthier cardiovascular system.</p>
        <a href="#" class="btn-service-more">LEARN MORE <span class="material-symbols-outlined" style="font-size:1.2rem;">arrow_forward</span></a>
      </div>
      <div class="service-card">
        <div class="service-icon-box">
          <span class="material-symbols-outlined">child_care</span>
        </div>
        <h3>Pediatrics</h3>
        <p>Specialized medical care for children from infancy through adolescence.</p>
        <a href="#" class="btn-service-more">LEARN MORE <span class="material-symbols-outlined" style="font-size:1.2rem;">arrow_forward</span></a>
      </div>
      <div class="service-card">
        <div class="service-icon-box">
          <span class="material-symbols-outlined">neurology</span>
        </div>
        <h3>Neurology</h3>
        <p>Comprehensive neurological examinations and treatments for brain health.</p>
        <a href="#" class="btn-service-more">LEARN MORE <span class="material-symbols-outlined" style="font-size:1.2rem;">arrow_forward</span></a>
      </div>
    </div>
  </div>
</section>

<section class="section-padding stats-section">
  <div class="container stats-container">
    <div class="stats-content">
      <span>STATISTICS</span>
      <h2>What Makes Us Different From Others</h2>
      <p>Our commitment to excellence is reflected in our success rates and patient satisfaction levels.</p>
      <div class="stats-grid">
        <div class="stat-box">
          <span class="material-symbols-outlined">sentiment_satisfied</span>
          <h4>250+</h4>
          <p>Happy Patients</p>
        </div>
        <div class="stat-box">
          <span class="material-symbols-outlined">task_alt</span>
          <h4>800+</h4>
          <p>Project Done</p>
        </div>
      </div>
    </div>
    <div class="stats-image">
      <img src="/assets/templates/healthcare/templates02/blog-1.png" alt="Stats">
    </div>
  </div>
</section>

<section class="section-padding container">
  <div class="doctors-header">
    <span>DOCTORS</span>
    <h2 style="font-size:2.5rem; margin-top:1.5rem;">Meet Our Specialist Team</h2>
  </div>
  <div class="doctors-grid">
    <div class="doctor-card">
      <div class="doctor-badge">TOP RATED</div>
      <div class="doctor-img-box">
        <img src="/assets/templates/healthcare/templates02/doctors-01.png" alt="Doctor 1">
        <div class="doctor-overlay">
          <a href="#" class="doctor-social">T</a>
          <a href="#" class="doctor-social">L</a>
        </div>
      </div>
      <h3>Dr. Alexander Rivera</h3>
      <p>Chief Cardiologist</p>
    </div>
    <div class="doctor-card">
      <div class="doctor-badge">EXPERT</div>
      <div class="doctor-img-box">
        <img src="/assets/templates/healthcare/templates02/doctors-02.png" alt="Doctor 2">
        <div class="doctor-overlay">
          <a href="#" class="doctor-social">T</a>
          <a href="#" class="doctor-social">L</a>
        </div>
      </div>
      <h3>Dr. Sarah Chen</h3>
      <p>Senior Neurologist</p>
    </div>
    <div class="doctor-card">
      <div class="doctor-badge">SPECIALIST</div>
      <div class="doctor-img-box">
        <img src="/assets/templates/healthcare/templates02/doctors-03.png" alt="Doctor 3">
        <div class="doctor-overlay">
          <a href="#" class="doctor-social">T</a>
          <a href="#" class="doctor-social">L</a>
        </div>
      </div>
      <h3>Dr. James Wilson</h3>
      <p>Lead Pediatrician</p>
    </div>
  </div>
</section>

<section class="section-padding container faq-section">
  <div class="faq-image">
    <img src="/assets/templates/healthcare/templates02/about-02.png" alt="FAQ">
  </div>
  <div class="faq-content">
    <div class="faq-header">
      <span>FAQ</span>
      <h2>Here Are The Most Asked Questions</h2>
    </div>
    <div class="faq-list">
      <details class="faq-item-box">
        <summary>Can i dental implant?</summary>
        <div class="faq-answer">
          Yes, we provide advanced dental implant services with high success rates using modern technology.
        </div>
      </details>
      <details class="faq-item-box">
        <summary>How can I book an appointment?</summary>
        <div class="faq-answer">
          You can book an appointment through our website form or by calling our support line directly.
        </div>
      </details>
      <details class="faq-item-box">
        <summary>Is 24/7 support available?</summary>
        <div class="faq-answer">
          Yes, we have a dedicated medical support team available round the clock for any assistance.
        </div>
      </details>
    </div>
  </div>
</section>

<section class="section-padding contact-section" id="contact">
  <div class="container">
    <h2>Contact For Urgent Service</h2>
    <div class="contact-card">
      <div class="contact-grid">
        <input type="text" placeholder="First Name">
        <input type="text" placeholder="Last Name">
        <input type="email" placeholder="Email Address">
        <input type="tel" placeholder="Phone Number">
        <textarea rows="4" placeholder="Your Message"></textarea>
        <button class="btn-submit">SUBMIT NOW</button>
      </div>
    </div>
  </div>
</section>

<footer class="footer">
  <div class="container footer-grid">
    <div class="footer-col">
      <div class="logo">LOGO_PLACEHOLDER</div>
      <p>Providing high-quality healthcare services with a focus on patient well-being and advanced medical treatments.</p>
    </div>
    <div class="footer-col">
      <h4>Service</h4>
      <ul class="footer-links">
        <li><a href="#">Cardiology</a></li>
        <li><a href="#">Pediatrics</a></li>
        <li><a href="#">Neurology</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h4>Company</h4>
      <ul class="footer-links">
        <li><a href="#">About Us</a></li>
        <li><a href="#">Services</a></li>
        <li><a href="#">Contact</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h4>Contact</h4>
      <p>Email: hello@healthcare.com<br>Phone: +1 234 567 890</p>
    </div>
  </div>
  <div class="footer-bottom">
    <p>© 2026 PROJECT_NAME_PLACEHOLDER. All rights reserved.</p>
  </div>
</footer>
`;
