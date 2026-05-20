// Premium Healthcare Template 03 — Extensive, High-Fidelity & Multi-Section Design
// Optimized for Large Medical Institutions & Dynamic Branding

export const healthcare03Styles = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200');

:root {
  --primary: PRIMARY_COLOR_PLACEHOLDER;
  --secondary: SECONDARY_COLOR_PLACEHOLDER;
  --text-dark: #0f172a;
  --text-light: #64748b;
  --white: #ffffff;
  --bg-soft: #f8fafc;
  --bg-dark: #0b1a2d;
  --border-color: #f1f5f9;
}

* { box-sizing: border-box; margin: 0; padding: 0; transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slowZoom {
  from { transform: scale(1); }
  to { transform: scale(1.1); }
}

@keyframes floating {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
  100% { transform: translateY(0px); }
}

html { scroll-behavior: smooth; }

body { 
  font-family: 'Inter', sans-serif; 
  color: var(--text-dark); 
  line-height: 1.6; 
  background: var(--white); 
  overflow-x: hidden; 
}

h1, h2, h3, h4, h5 { 
  font-family: 'Plus Jakarta Sans', sans-serif; 
  font-weight: 800; 
  color: var(--text-dark); 
  line-height: 1.2;
}

.container { 
  max-width: 1300px; 
  margin: 0 auto; 
  padding: 0 2rem; 
}

.section-padding { padding: 9rem 0; }

.text-primary { color: var(--primary) !important; }

img { max-width: 100%; display: block; border-radius: 12px; object-fit: cover; }

/* Navbar */
.navbar {
  position: absolute;
  top: 0; left: 0; right: 0;
  z-index: 1000;
  padding: 1.5rem 0;
  background: transparent;
}

.nav-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-links { display: flex; gap: 2.5rem; list-style: none; }
.nav-links a { text-decoration: none; color: #fff; font-weight: 600; font-size: 0.9rem; opacity: 0.8; }
.nav-links a:hover { opacity: 1; color: var(--primary); }

.btn-nav {
  background-color: var(--primary) !important;
  color: #fff !important;
  padding: 0.8rem 2rem;
  border-radius: 50px;
  font-weight: 700;
  text-decoration: none;
  font-size: 0.85rem;
}

/* CINEMATIC HERO */
.hero {
  height: 100vh;
  min-height: 800px;
  background: #000;
  display: flex;
  align-items: center;
  position: relative;
  color: #fff;
  overflow: hidden;
}

.hero-bg-image {
  position: absolute;
  inset: 0;
  background: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.4));
  background-size: cover;
  background-position: center;
  animation: slowZoom 20s infinite alternate linear;
  overflow: hidden;
}
.hero-bg-image img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -1;
  border-radius: 0;
  filter: brightness(0.5);
}

.hero-content {
  max-width: 800px;
  margin-top: -5rem;
  position: relative;
  z-index: 10;
  animation: fadeUp 1.2s ease-out forwards;
}

.hero h1 { font-size: clamp(3.5rem, 6vw, 5.5rem); color: #fff; margin-bottom: 2rem; }
.hero p { font-size: 1.2rem; color: rgba(255,255,255,0.8); margin-bottom: 3rem; max-width: 600px; }

.btn-hero-contact {
  display: inline-block;
  padding: 1.2rem 3rem;
  border: 2px solid #fff;
  color: #fff;
  text-decoration: none;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
}
.btn-hero-contact:hover { background: #fff; color: #000; }

/* HORIZONTAL BOOKING BAR */
.booking-bar {
  background-color: var(--primary);
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  height: 120px;
  z-index: 100;
}

.booking-label {
  background: var(--primary) !important;
  width: 30%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4rem;
  clip-path: polygon(0 0, 90% 0, 100% 100%, 0% 100%);
  color: #fff;
  position: relative;
}

.booking-label::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.3); /* Dark overlay for secondary color */
  z-index: 1;
}

.booking-label > div { position: relative; z-index: 5; }

.booking-label h2 { color: #fff; font-size: 1.8rem; line-height: 1; }
.booking-label span { color: #fff; opacity: 0.8; display: block; font-size: 0.9rem; margin-top: 0.5rem; letter-spacing: 2px; font-weight: 700; }

.booking-inputs {
  background: var(--primary) !important;
  flex: 1;
  display: flex;
  align-items: center;
  padding: 0 4rem;
  gap: 2rem;
}

.input-item {
  flex: 1;
  position: relative;
}

.input-item label { 
  display: block; 
  color: rgba(255,255,255,0.7); 
  font-size: 0.75rem; 
  font-weight: 700; 
  text-transform: uppercase; 
  margin-bottom: 0.25rem; 
}

.input-item input, .input-item select {
  width: 100%;
  background: transparent;
  border: 1px solid rgba(255,255,255,0.3);
  padding: 0.75rem 0;
  color: #fff;
  border-width: 0 0 1px 0;
  outline: none;
  font-size: 1rem;
  font-weight: 600;
}
.input-item input::placeholder { color: #fff; }

.btn-booking-now {
  background: #fff !important;
  color: var(--primary) !important;
  border: none;
  padding: 1.2rem 2.5rem;
  font-weight: 900;
  font-size: 0.9rem;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: 26px;
}
.btn-booking-now:hover { background: #1e293b !important; color: #fff !important; }

/* FEATURES ROW */
.section-padding-large { padding: 12rem 0 6rem; }
.features-grid-03 {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

.feature-card-03 {
  background: #fff;
  padding: 2.5rem;
  border-radius: 24px;
  box-shadow: 0 15px 40px rgba(0,0,0,0.05);
  text-align: center;
  cursor: pointer;
}

.feature-card-03:hover {
  transform: translateY(-15px);
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.12);
  border: 1px solid var(--primary);
}

.feature-card-03 .material-symbols-outlined {
  font-size: 3rem;
  color: var(--primary);
  margin-bottom: 1.5rem;
  transition: transform 0.4s;
}

.feature-card-03:hover .material-symbols-outlined {
  transform: scale(1.1) rotate(5deg);
}

/* ABOUT SECTION */
.about-03 { display: grid; grid-template-columns: 1fr 1.2fr; gap: 6rem; align-items: center; }

.about-imgs {
  position: relative;
  height: 550px;
}

.img-main { width: 80%; height: 500px; }
.img-sub { 
  position: absolute; 
  bottom: 0; 
  right: 0; 
  width: 50%; 
  height: 300px; 
  border: 10px solid #fff; 
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
}

.about-text-03 h2 { font-size: 3rem; margin-bottom: 2rem; }
.about-text-03 p { color: var(--text-light); margin-bottom: 2.5rem; }

/* INNOVATION SECTION */
.innovation-section { 
  background-color: var(--secondary);
  color: #fff; 
  overflow: hidden; 
  position: relative;
  border-radius: 100px 100px 0 0;
}

.innovation-section::before {
  content: '';
  position: absolute;
  inset: 0;
  background-color: var(--secondary);
  z-index: 1;
}

.innovation-grid { 
  position: relative;
  z-index: 5;
  display: grid; 
  grid-template-columns: 1fr 1fr; 
  gap: 6rem; 
  align-items: center; 
}

.innovation-content h2 { color: #fff; font-size: 3.5rem; margin-bottom: 2rem; }
.innovation-content p { color: rgba(255,255,255,0.6); font-size: 1.1rem; margin-bottom: 3rem; }

.tech-cluster {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  position: relative;
}

.tech-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  padding: 2.5rem;
  border-radius: 30px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
  animation: floating 4s infinite ease-in-out;
}

.tech-card:nth-child(even) { 
  transform: translateY(40px); 
  animation-delay: 1s;
}

.tech-card:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: var(--primary);
  animation-play-state: paused;
}

/* DOCTORS SECTION (NEW) */
.doctors-grid-03 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 3rem; margin-top: 4rem; }

.doctor-card-03 {
  background: #fff;
  border-radius: 40px;
  padding: 3rem;
  text-align: center;
  border: 1px solid var(--border-color);
  position: relative;
  overflow: hidden;
}

.doctor-card-03:hover {
  transform: translateY(-15px);
  border-color: var(--primary);
  box-shadow: 0 30px 60px rgba(0,0,0,0.1);
}

.doctor-img-box {
  width: 180px;
  height: 180px;
  margin: 0 auto 2rem;
  position: relative;
  transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.doctor-card-03:hover .doctor-img-box {
  transform: scale(1.1);
}

.doctor-img-box img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 5px solid var(--bg-soft);
}

.doctor-card-03 h4 { font-size: 1.5rem; margin-bottom: 0.5rem; }
.doctor-card-03 span { color: var(--primary); font-weight: 700; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px; }

.doctor-social {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}
.doctor-social a { 
  width: 40px; height: 40px; 
  background: var(--bg-soft); 
  border-radius: 50%; 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  text-decoration: none;
  color: var(--text-dark);
}
.doctor-social a:hover { background: var(--primary); color: #fff; }

/* TESTIMONIALS SECTION */
.testimonials-03 { background: var(--bg-soft); }

.testimonial-grid-03 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; margin-top: 4rem; }

.test-card-03 {
  background: #fff;
  padding: 3rem;
  border-radius: 30px;
  position: relative;
}

/* FOOTER 03 */
.footer-03 { 
  background: var(--secondary); 
  color: #fff; 
  padding: 8rem 0 3rem; 
  position: relative;
}

.footer-03::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5); /* Slightly darker for footer */
  z-index: 1;
}

.footer-03-grid { 
  position: relative;
  z-index: 5;
  display: grid; 
  grid-template-columns: 1.5fr 1fr 1fr 1.5fr; 
  gap: 4rem; 
  padding-bottom: 5rem; 
  border-bottom: 1px solid rgba(255,255,255,0.1); 
}

.footer-col { position: relative; z-index: 5; }

/* FAQ 03 */
.faq-03-grid { 
  display: grid; 
  grid-template-columns: 1fr 1fr; 
  gap: 6rem; 
  align-items: flex-start; 
  padding: 9rem 0;
}

.faq-high-tech { 
  position: relative; 
  height: 600px;
  display: flex;
  align-items: center;
}

.faq-img-1 {
  width: 80%;
  height: 500px;
  border-radius: 40px;
  overflow: hidden;
  box-shadow: 0 30px 60px rgba(0,0,0,0.1);
  position: relative;
  z-index: 1;
}

.faq-img-2 {
  width: 50%;
  height: 300px;
  border-radius: 30px;
  overflow: hidden;
  position: absolute;
  bottom: 0;
  right: 0;
  z-index: 2;
  border: 10px solid #fff;
  box-shadow: 0 30px 60px rgba(0,0,0,0.2);
  animation: floating 5s infinite ease-in-out;
}

.faq-high-tech img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.faq-list-03 { display: flex; flex-direction: column; gap: 1.5rem; }

.faq-item-03 { 
  background: #fff; 
  border-radius: 20px; 
  border: 1px solid var(--border-color);
  overflow: hidden;
  transition: all 0.4s;
}

.faq-item-03[open] {
  border-color: var(--primary);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.05);
}

.faq-item-03 summary { 
  padding: 2rem; 
  font-weight: 700; 
  cursor: pointer; 
  list-style: none; 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 1.1rem;
}

.faq-item-03 summary::after { 
  content: 'add'; 
  font-family: 'Material Symbols Outlined'; 
  color: var(--primary); 
  font-size: 1.8rem;
  transition: transform 0.4s;
}

.faq-item-03[open] summary::after { 
  content: 'remove';
  transform: rotate(180deg);
}

.faq-answer {
  padding: 0 2rem 2rem;
  color: var(--text-light);
  line-height: 1.8;
  font-size: 0.95rem;
  animation: fadeUp 0.5s ease-out;
}

@media (max-width: 1024px) {
  .hero-grid, .about-03, .faq-03-grid, .innovation-grid { grid-template-columns: 1fr; }
  .features-grid-03, .footer-03-grid, .testimonial-grid-03, .doctors-grid-03 { grid-template-columns: 1fr 1fr; }
  .booking-bar { flex-direction: column; height: auto; position: static; }
  .booking-label, .booking-inputs { width: 100%; clip-path: none; padding: 2rem; }
}

@media (max-width: 640px) {
  .features-grid-03, .footer-03-grid, .testimonial-grid-03, .doctors-grid-03 { grid-template-columns: 1fr; }
}
`;

export const healthcare03Html = `
<nav class="navbar">
  <div class="container nav-inner">
    <div class="logo">LOGO_PLACEHOLDER</div>
    <a href="#booking" class="btn-nav">GET STARTED</a>
  </div>
</nav>

<section class="hero" id="home">
  <div class="hero-bg-image"></div>
  <div class="container">
    <div class="hero-content">
      <h1 style="color: #fff;">Modern Care For <br><span class="text-primary">Your Healthy Life</span></h1>
      <p>Providing advanced healthcare solutions with world-class expertise and compassion. Experience the next generation of medical care.</p>
      <a href="#about" class="btn-hero-contact">CONTACT US</a>
    </div>
  </div>
  
  <div class="booking-bar" id="booking">
    <div class="booking-label">
      <div>
        <h2>BOOK YOUR <br>APPOINTMENT</h2>
        <span>✦ CHOOSE SERVICE</span>
      </div>
    </div>
    <div class="booking-inputs">
      <form class="booking-inputs" style="display:contents;">
      <div class="input-item">
        <label>Preferred Date</label>
        <input type="date" name="preferred_date" placeholder="Select Date">
      </div>
      <div class="input-item">
        <label>Choose Service</label>
        <select name="service">
          <option>General Checkup</option>
          <option>Cardiology</option>
          <option>Dental Care</option>
          <option>Neurology</option>
        </select>
      </div>
      <div class="input-item">
        <label>Phone Number</label>
        <input type="tel" name="phone" placeholder="Enter Number">
      </div>
      <div class="input-item">
        <label>Email Address</label>
        <input type="email" name="email_address" placeholder="you@email.com">
      </div>
      <button type="submit" class="btn-booking-now">BOOK NOW</button>
      </form>
    </div>
  </div>
</section>

<section class="section-padding-large container">
  <div class="features-grid-03">
    <div class="feature-card-03">
      <span class="material-symbols-outlined">medical_services</span>
      <h3>Medical Advice</h3>
      <p>Professional guidance for all your health concerns.</p>
    </div>
    <div class="feature-card-03">
      <span class="material-symbols-outlined">emergency</span>
      <h3>Emergency Care</h3>
      <p>24/7 immediate assistance for critical situations.</p>
    </div>
    <div class="feature-card-03">
      <span class="material-symbols-outlined">biotech</span>
      <h3>Modern Lab</h3>
      <p>Advanced diagnostic facilities for precise results.</p>
    </div>
    <div class="feature-card-03">
      <span class="material-symbols-outlined">vaccines</span>
      <h3>Vaccination</h3>
      <p>Protecting you and your family from diseases.</p>
    </div>
  </div>
</section>

<section class="section-padding container about-03" id="about">
  <div class="about-imgs">
    <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=800" alt="Doctor" class="img-main">
    <img src="https://images.unsplash.com/photo-1666214280391-8ff5bd3c0bf0?auto=format&fit=crop&q=80&w=500" alt="Patient" class="img-sub">
  </div>
  <div class="about-text-03">
    <h2>Our Quality System Is Ready To <span class="text-primary">Help You!</span></h2>
    <p>We have built a reputation for excellence by focusing on patient outcomes and compassionate care delivery.</p>
    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:2rem; margin-bottom:3rem;">
      <div style="display:flex; align-items:center; gap:1rem;">
        <span class="material-symbols-outlined text-primary">check_circle</span>
        <span>15+ Years Experience</span>
      </div>
      <div style="display:flex; align-items:center; gap:1rem;">
        <span class="material-symbols-outlined text-primary">check_circle</span>
        <span>Specialized Doctors</span>
      </div>
    </div>
    <a href="#services" class="btn-booking-now bg-primary" style="display:inline-block; text-decoration:none; color:#fff !important; background:var(--primary) !important;">EXPLORE SERVICES</a>
  </div>
</section>

<section class="section-padding innovation-section" id="innovation">
  <div class="container innovation-grid">
    <div class="innovation-content">
      <span>✦ NEXT-GEN MEDICINE</span>
      <h2>Precision Medical <br><span class="text-primary">Innovation</span></h2>
      <p>We are redefining healthcare through artificial intelligence and robotic precision, ensuring that every patient receives the most advanced treatment available in modern science.</p>
      <a href="#home" class="btn-hero-contact">DISCOVER MORE</a>
    </div>
    <div class="tech-cluster">
      <div class="tech-card">
        <span class="material-symbols-outlined">smart_toy</span>
        <h4>Robotic Surgery</h4>
        <p>Unmatched precision in complex procedures.</p>
      </div>
      <div class="tech-card">
        <span class="material-symbols-outlined">psychology</span>
        <h4>AI Diagnosis</h4>
        <p>Predictive analytics for early detection.</p>
      </div>
      <div class="tech-card">
        <span class="material-symbols-outlined">cloud_sync</span>
        <h4>Digital Cloud</h4>
        <p>Your records accessible anywhere, instantly.</p>
      </div>
      <div class="tech-card">
        <span class="material-symbols-outlined">genetics</span>
        <h4>Genomic Care</h4>
        <p>Treatments tailored to your unique DNA.</p>
      </div>
    </div>
  </div>
</section>

<section class="section-padding container" id="testimonials">
  <div style="text-align:center;">
    <span>PATIENT REVIEWS</span>
    <h2 style="font-size:3rem; margin-top:1rem;">What Our Patients <br><span class="text-primary">Say About Us</span></h2>
  </div>
  <div class="testimonial-grid-03">
    <div class="test-card-03">
      <span class="material-symbols-outlined" style="font-size:3rem; color:var(--primary); opacity:0.1; position:absolute; top:2rem; right:2rem;">format_quote</span>
      <div style="display:flex; align-items:center; gap:1rem; margin-bottom:1.5rem;">
        <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120" style="width:60px; height:60px; border-radius:50%;" alt="Patient">
        <div>
          <h4>Sarah Johnson</h4>
          <span style="font-size:0.8rem; color:var(--text-light);">Cardiac Patient</span>
        </div>
      </div>
      <p>"The level of care I received was exceptional. The doctors and staff were attentive, professional, and truly cared about my recovery."</p>
    </div>
    <div class="test-card-03">
      <span class="material-symbols-outlined" style="font-size:3rem; color:var(--primary); opacity:0.1; position:absolute; top:2rem; right:2rem;">format_quote</span>
      <div style="display:flex; align-items:center; gap:1rem; margin-bottom:1.5rem;">
        <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120" style="width:60px; height:60px; border-radius:50%;" alt="Patient">
        <div>
          <h4>Mark Wilson</h4>
          <span style="font-size:0.8rem; color:var(--text-light);">General Wellness</span>
        </div>
      </div>
      <p>"A very modern facility with friendly people. The AI-driven diagnosis gave me peace of mind about my health results."</p>
    </div>
    <div class="test-card-03">
      <span class="material-symbols-outlined" style="font-size:3rem; color:var(--primary); opacity:0.1; position:absolute; top:2rem; right:2rem;">format_quote</span>
      <div style="display:flex; align-items:center; gap:1rem; margin-bottom:1.5rem;">
        <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=120" style="width:60px; height:60px; border-radius:50%;" alt="Patient">
        <div>
          <h4>Emily Davis</h4>
          <span style="font-size:0.8rem; color:var(--text-light);">Dental Care</span>
        </div>
      </div>
      <p>"Best dental experience ever! Painless procedure and the clinic is beautiful. Highly recommend to everyone."</p>
    </div>
  </div>
</section>

<section class="section-padding container" id="doctors" style="background:var(--bg-soft); border-radius:100px 100px 0 0;">
  <div style="text-align:center;">
    <span>EXPERIENCED DOCTORS</span>
    <h2 style="font-size:3rem; margin-top:1rem;">Our Medical <span class="text-primary">Specialists</span></h2>
  </div>
  <div class="doctors-grid-03">
    <div class="doctor-card-03">
      <div class="doctor-img-box">
        <img src="https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400" alt="Doctor">
      </div>
      <h4>Dr. James Wilson</h4>
      <span>Cardiology Specialist</span>
      <div class="doctor-social">
        <a href="#"><span class="material-symbols-outlined">chat</span></a>
        <a href="#"><span class="material-symbols-outlined">alternate_email</span></a>
      </div>
    </div>
    <div class="doctor-card-03">
      <div class="doctor-img-box">
        <img src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400" alt="Doctor">
      </div>
      <h4>Dr. Emily Brown</h4>
      <span>Neurology Expert</span>
      <div class="doctor-social">
        <a href="#"><span class="material-symbols-outlined">chat</span></a>
        <a href="#"><span class="material-symbols-outlined">alternate_email</span></a>
      </div>
    </div>
    <div class="doctor-card-03">
      <div class="doctor-img-box">
        <img src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400" alt="Doctor">
      </div>
      <h4>Dr. Michael Chen</h4>
      <span>Dental Surgeon</span>
      <div class="doctor-social">
        <a href="#"><span class="material-symbols-outlined">chat</span></a>
        <a href="#"><span class="material-symbols-outlined">alternate_email</span></a>
      </div>
    </div>
  </div>
</section>

<section class="section-padding container">
  <div class="faq-03-grid">
    <div class="faq-high-tech">
      <div class="faq-img-1">
        <img src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800" alt="Technology">
      </div>
      <div class="faq-img-2">
        <img src="https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&q=80&w=500" alt="Specialist">
      </div>
    </div>
    <div class="faq-content-03">
      <span class="text-primary" style="font-weight: 800; letter-spacing: 2px; text-transform: uppercase; font-size: 0.8rem;">Common Questions</span>
      <h2 style="font-size: clamp(2.5rem, 4vw, 3.5rem); margin: 1.5rem 0 3.5rem;">Everything You Need <br><span class="text-primary">To Know</span></h2>
      <div class="faq-list-03">
        <details class="faq-item-03" open>
          <summary>How do I book an appointment?</summary>
          <div class="faq-answer">You can book an appointment directly through our website using the quick booking bar or by calling our helpdesk. Our team will confirm your slot within minutes.</div>
        </details>
        <details class="faq-item-03">
          <summary>Do you accept health insurance?</summary>
          <div class="faq-answer">Yes, we partner with major insurance providers globally. Please bring your insurance card during your visit for a seamless cashless experience.</div>
        </details>
        <details class="faq-item-03">
          <summary>Is emergency care available 24/7?</summary>
          <div class="faq-answer">Absolutely. Our emergency department and trauma center are fully operational 24 hours a day, 365 days a year, with a dedicated team of specialists.</div>
        </details>
        <details class="faq-item-03">
          <summary>What should I bring for my first visit?</summary>
          <div class="faq-answer">Please bring a valid ID, any previous medical records, and your current medications list to help our doctors understand your health history better.</div>
        </details>
      </div>
    </div>
  </div>
</section>

<footer class="footer-03">
  <div class="container footer-03-grid">
    <div class="footer-col">
      <div class="footer-logo">LOGO_PLACEHOLDER</div>
      <p class="footer-desc">Leading the way in medical excellence and patient-centered care. Your health is our priority.</p>
    </div>
    <div class="footer-col">
      <h4>Company</h4>
      <ul style="list-style:none; opacity:0.6; display:flex; flex-direction:column; gap:0.5rem;">
        <li>About Us</li>
        <li>Our Team</li>
        <li>Services</li>
      </ul>
    </div>
    <div class="footer-col">
      <h4>Support</h4>
      <ul style="list-style:none; opacity:0.6; display:flex; flex-direction:column; gap:0.5rem;">
        <li>Help Center</li>
        <li>Privacy Policy</li>
        <li>Contact Us</li>
      </ul>
    </div>
    <div class="footer-col">
      <h4>Newsletter</h4>
      <p class="footer-desc">Subscribe to get health tips.</p>
      <div style="display:flex; gap:0.5rem;">
        <input type="email" placeholder="Email" style="padding:0.8rem; border-radius:8px; border:none; background:rgba(255,255,255,0.05); color:#fff; flex:1;">
        <button style="background:var(--primary); color:#fff; border:none; padding:0 1rem; border-radius:8px;">GO</button>
      </div>
    </div>
  </div>
  <div class="container" style="text-align:center; padding-top:3rem; opacity:0.4; font-size:0.8rem;">
    <p>© 2026 PROJECT_NAME_PLACEHOLDER. All Rights Reserved.</p>
  </div>
</footer>
`;
