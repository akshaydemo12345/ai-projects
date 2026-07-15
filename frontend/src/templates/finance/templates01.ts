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
.nav-inner { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; }
.logo { font-size: 1.6rem; font-weight: 800; color: var(--primary); display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
.nav-links { display: flex; flex-wrap: wrap; gap: 2.5rem; }
.nav-links a { color: #4b5563; font-size: 0.9rem; font-weight: 600; }
.btn-primary { background-color: var(--btn-bg, var(--primary)); color: var(--btn-text, #fff); padding: 0.75rem 1.8rem; border-radius: 6px; font-weight: 700; font-size: 0.85rem; border: none; cursor: pointer; }

/* Hero Section Redesign */
.hero { position: relative; padding: 10rem 0 14rem; background: #0f172a; overflow: hidden; display: flex; align-items: center; }
.hero::before { content: ""; position: absolute; inset: 0; background: url('https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1920') center/cover; opacity: 0.1; z-index: 0; mix-blend-mode: overlay; }
.hero-glow { position: absolute; width: 600px; height: 600px; background: var(--primary); border-radius: 50%; filter: blur(150px); opacity: 0.3; top: -100px; right: -100px; z-index: 1; pointer-events: none; }
.hero-inner { position: relative; z-index: 10; display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 4rem; align-items: center; }
.hero-text { color: #fff; }
.hero-text span { font-size: 0.8rem; text-transform: uppercase; font-weight: 800; letter-spacing: 3px; color: var(--primary); display: inline-block; margin-bottom: 1.5rem; padding: 8px 20px; border-radius: 999px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); backdrop-filter: blur(8px); }
.hero-text h1 { color: #fff; font-size: clamp(3rem, 4vw, 4.2rem); font-weight: 800; line-height: 1.15; margin-bottom: 1.5rem; letter-spacing: -1px; }
.hero-text p { font-size: 1.15rem; color: #cbd5e1; margin-bottom: 3rem; line-height: 1.6; max-width: 550px; }
.hero-btns { display: flex; flex-wrap: wrap; gap: 1.5rem; }
.btn-hero-white { background-color: #fff; color: var(--primary); padding: 1.1rem 2.8rem; border-radius: 8px; font-weight: 800; font-size: 0.95rem; box-shadow: 0 10px 20px rgba(0,0,0,0.1); border: none; transition: 0.3s; }
.btn-hero-white:hover { transform: translateY(-3px); box-shadow: 0 15px 30px rgba(0,0,0,0.15); }
.btn-hero-outline { border: 2px solid rgba(255,255,255,0.2); color: #fff; padding: 1.1rem 2.8rem; border-radius: 8px; font-weight: 800; font-size: 0.95rem; background: transparent; transition: 0.3s; }
.btn-hero-outline:hover { border-color: #fff; background: rgba(255,255,255,0.05); }

/* Hero Image & Animations */
.hero-visual { position: relative; }
.hero-img { border-radius: 30px; overflow: hidden; box-shadow: 0 30px 60px rgba(0,0,0,0.3); border: 2px solid rgba(255,255,255,0.1); }
.hero-img img { width: 100%; height: 500px; object-fit: cover; }
.hero-float-1 { position: absolute; bottom: -30px; left: -40px; background: #fff; padding: 1.25rem; border-radius: 16px; box-shadow: 0 20px 40px rgba(0,0,0,0.2); display: flex; align-items: center; gap: 15px; animation: floatY 4s ease-in-out infinite; z-index: 20; }
.hero-float-2 { position: absolute; top: -30px; right: -20px; background: #fff; padding: 1rem 1.25rem; border-radius: 16px; box-shadow: 0 20px 40px rgba(0,0,0,0.2); display: flex; align-items: center; gap: 15px; animation: floatY 5s ease-in-out infinite alternate-reverse; z-index: 20; }
.float-icon { width: 45px; height: 45px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; color: #fff; }
.float-text h5 { font-size: 1rem; font-weight: 800; color: #0f172a; margin-bottom: 2px; }
.float-text p { font-size: 0.75rem; color: #64748b; font-weight: 600; text-transform: uppercase; }
@keyframes floatY { 0% { transform: translateY(0); } 50% { transform: translateY(-15px); } 100% { transform: translateY(0); } }

/* Floating Horizontal Form Bar */

.form-bar-container { position: relative; margin-top: -65px; z-index: 100; max-width: 1050px; margin-left: auto; margin-right: auto; padding: 0 20px; }
.form-bar { 
    background: #ffffff; padding: 0.75rem; border-radius: 16px; 
    box-shadow: 0 30px 60px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.05); 
    display: grid; grid-template-columns: 1fr 1fr 1fr auto; 
    gap: 0; align-items: center; 
}
.form-group { padding: 0.75rem 1.5rem; border-right: 1px solid #e2e8f0; }
.form-group:nth-child(3) { border-right: none; }
.form-group label { display: block; font-size: 0.7rem; text-transform: uppercase; color: var(--primary); font-weight: 800; margin-bottom: 6px; letter-spacing: 1px; }
.form-group input { width: 100%; border: none; outline: none; font-size: 1rem; font-weight: 600; color: #0f172a; background: transparent; }
.form-group input::placeholder { color: #94a3b8; font-weight: 400; }
.btn-submit { background: linear-gradient(135deg, var(--primary), var(--secondary)); color: #fff; border: none; padding: 1.25rem 3rem; border-radius: 12px; font-weight: 800; font-size: 0.95rem; cursor: pointer; transition: 0.3s; box-shadow: 0 10px 20px rgba(0,0,0,0.1); text-transform: uppercase; letter-spacing: 1px; }
.btn-submit:hover { transform: translateY(-2px); box-shadow: 0 15px 25px rgba(0,0,0,0.2); }

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
.srv-icon-box { width: 50px; height: 50px; background-color: #eff6ff; color: var(--primary); border-radius: 12px; display: flex; flex-wrap: wrap; align-items: center; justify-content: center; font-size: 1.25rem; margin-bottom: 2rem; }
.srv-card h3 { font-size: 1.3rem; font-weight: 700; margin-bottom: 1.25rem; }
.srv-card p { font-size: 0.95rem; color: #64748b; margin-bottom: 2rem; line-height: 1.6; }
.srv-link { color: var(--primary); font-weight: 800; font-size: 0.8rem; text-transform: uppercase; display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }

/* Why Choose Us - Large Portrait Image */
.why { background: #0f172a; color: #fff; padding: 12rem 0; }
.why-grid { display: grid; grid-template-columns: 1fr 1.1fr; gap: 8rem; align-items: center; }
.why-img-box { border-radius: 40px; overflow: hidden; box-shadow: 0 40px 100px rgba(0,0,0,0.3); height: 600px; }
.why-img-box img { width: 100%; height: 100%; object-fit: cover; }
.why-text h2 { font-size: 3.2rem; font-weight: 800; margin-bottom: 2rem; }
.why-list { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; margin-top: 4rem; }
.why-list-item h5 { font-size: 1.15rem; font-weight: 700; margin-bottom: 0.75rem; display: flex; flex-wrap: wrap; align-items: center; gap: 12px; }
.why-list-item h5::before { content: ''; width: 8px; height: 8px; background-color: PRIMARY_COLOR_PLACEHOLDER; border-radius: 50%; }
.why-list-item p { color: #94a3b8; font-size: 0.95rem; }

/* Blue Stats Bar */
.stats-bar { background-color: var(--primary); padding: 6rem 0; color: #fff; }
.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); text-align: center; }
.stat-item h2 { font-size: 3.5rem; font-weight: 800; line-height: 1; }
.stat-item p { font-size: 0.8rem; text-transform: uppercase; font-weight: 800; margin-top: 10px; opacity: 0.8; }

/* Projects / Case Studies */
.cases { padding: 12rem 0; }
.cases-head { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: flex-end; margin-bottom: 6rem; }
.case-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }
.case-card { background: var(--primary); padding: 4rem 3rem; border-radius: 20px; color: #fff; position: relative; transition: 0.4s; }
.case-card-alt { background: var(--secondary); }
.case-card span { font-size: 0.7rem; opacity: 0.6; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; }
.case-card h3 { font-size: 1.5rem; font-weight: 700; margin-top: 1.25rem; line-height: 1.3; }
.case-icon { position: absolute; top: 4rem; right: 3rem; font-size: 1.5rem; opacity: 0.2; }

/* Consultation Banner */
.cta-banner { background-color: var(--primary); padding: 6rem 0; color: #fff; }
.cta-inner { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; }
.cta-inner h2 { font-size: 2.5rem; font-weight: 800; line-height: 1.2; }

/* Testimonial Section */
.testimonial { padding: 10rem 0; background: #f9fafb; text-align: center; overflow: hidden; }
.testimonial h2 { font-size: 3.2rem; font-weight: 800; margin-bottom: 4rem; }
.test-slider-container { width: 100%; padding-bottom: 40px; overflow: hidden; position: relative; }
.test-slider-container .swiper-slide { height: auto; }
.test-box { background: #fff; padding: 4rem; border-radius: 24px; box-shadow: 0 20px 60px rgba(0,0,0,0.03); text-align: left; height: 100%; display: flex; flex-direction: column; justify-content: center; }
.test-box p { font-size: 1.4rem; color: #334155; font-style: italic; margin-bottom: 2rem; line-height: 1.6; }
.test-meta h4 { font-size: 1.25rem; font-weight: 800; color: #111; }
.test-meta span { color: var(--primary); font-weight: 800; font-size: 0.8rem; text-transform: uppercase; margin-top: 5px; display: block; }
.swiper-pagination-bullet { width: 12px !important; height: 12px !important; background: #cbd5e1 !important; opacity: 1 !important; margin: 0 6px !important; transition: 0.3s !important; }
.swiper-pagination-bullet-active { width: 30px !important; border-radius: 6px !important; background: var(--primary) !important; }
.swiper-pagination { position: absolute !important; bottom: 0 !important; left: 0; right: 0; display: flex; justify-content: center; align-items: center; gap: 8px; z-index: 50; }


/* Final Contact Form */
.contact { padding: 12rem 0; text-align: center; }
.contact h2 { font-size: 3.5rem; font-weight: 800; margin-bottom: 5rem; }
.contact-form { max-width: 850px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; text-align: left; }
.form-full { grid-column: span 2; }
.contact-form input, .contact-form textarea { width: 100%; padding: 1.25rem; border: 1px solid #000; border-radius: 8px; font-family: inherit; font-size: 1rem; color: #000; }
.btn-send { background-color: var(--btn-bg, var(--primary)); color: var(--btn-text, #fff); border: none; padding: 1.25rem 4rem; border-radius: 8px; font-weight: 800; text-transform: uppercase; cursor: pointer; margin-top: 2rem; }

/* Footer */
footer { background: #0f172a; color: #fff; padding: 10rem 0 5rem; }
.foot-grid { display: grid; grid-template-columns: 1.8fr 1fr 1fr 1.2fr; gap: 8rem; }
.foot-col h5 { font-size: 0.9rem; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 2.5rem; color: #fff; }
.foot-links a { display: block; color: #94a3b8; margin-bottom: 1.2rem; font-size: 0.95rem; }

/* Responsive Media Queries */
@media (max-width: 1024px) {
    .hero-inner { grid-template-columns: 1fr !important; text-align: center; gap: 5rem; }
    .hero-float-1, .hero-float-2 { transform: scale(0.8); }
    .hero-btns { justify-content: center; }
    .test-box { padding: 3rem 2rem; }

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


  /* Extracted Template Inline Styles */
  .tpl-templates01-1 { color: var(--primary); }
  .tpl-templates01-2 { color: var(--primary); }
  .tpl-templates01-3 { color: var(--primary); }
  .tpl-templates01-4 { color: #2a58e8; border-bottom: 2px solid #2a58e8; }
  .tpl-templates01-5 { border-radius: 4px; }
  .tpl-templates01-6 { color: #fff; }
  .tpl-templates01-7 { color: #94a3b8; }
  .tpl-templates01-8 { color: #fff; }
  .tpl-templates01-9 { color: #94a3b8; }
  .tpl-templates01-10 { background: #1e293b; border: none; border-radius: 4px; color: #fff; }
  .tpl-templates01-11 { background-color: PRIMARY_COLOR_PLACEHOLDER; color: #fff; border: none; border-radius: 4px; }
  .tpl-templates01-12 { border-top: 1px solid rgba(255,255,255,0.05); color: #4b5563; }
  .tpl-templates01-13 { border: 2px dashed #22c55e; border-radius: 8px; background: rgba(34,197,94,0.1); color: #166534; }
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
  <!-- REDESIGNED HERO SECTION -->
  <section class="hero">
    <div class="hero-glow"></div>
    <div class="container hero-inner">
      <div class="hero-text">
        <span>Premium Finance Consulting</span>
        <h1>Architecting Growth <br>For Ambitious Brands</h1>
        <p>We deliver tailored financial strategies for ambitious companies — turning complex numbers into clear, actionable opportunities for sustainable growth.</p>
        <div class="hero-btns">
          <a href="#services" class="btn-hero-white">Discover More</a>
          <a href="#about" class="btn-hero-outline">Contact Us</a>
        </div>
      </div>
      <div class="hero-visual">
        <div class="hero-img">
          <img src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=800" alt="Finance Business">
        </div>
        <div class="hero-float-1">
          <div class="float-icon" style="background: var(--primary);"><i class="fa-solid fa-arrow-trend-up"></i></div>
          <div class="float-text">
            <h5>+45.8%</h5>
            <p>Annual Growth</p>
          </div>
        </div>
        <div class="hero-float-2">
          <div class="float-icon" style="background: var(--secondary);"><i class="fa-solid fa-shield-halved"></i></div>
          <div class="float-text">
            <h5>100%</h5>
            <p>Secure Assets</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- FLOATING HORIZONTAL FORM BAR -->

  <div class="form-bar-container">
    <form class="form-bar" onsubmit="event.preventDefault();">
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
      <span class="tpl-templates01-1" style="font-weight: 800; font-size: 0.8rem; letter-spacing: 2px">WHAT WE'RE OFFERING</span>
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
        <span class="tpl-templates01-2" style="font-weight: 800">WHY CHOOSE US</span>
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
          <span class="tpl-templates01-3" style="font-weight: 800">OUR LATEST PROJECTS</span>
          <h2 style="font-size: 3rem; font-weight: 800; margin-top: 1.5rem;">Incredible Client Stories</h2>
        </div>
        </div>
      <div class="case-grid">
        <div class="case-card">
          <div class="case-icon"><i class="fa-solid fa-chart-line"></i></div>
          <span>FINANCE</span>
          <h3>Financial Report Restructure</h3>
        </div>
        <div class="case-card case-card-alt">
          <div class="case-icon"><i class="fa-solid fa-chess"></i></div>
          <span>STRATEGY</span>
          <h3>Business Growth Solutions</h3>
        </div>
        <div class="case-card">
          <div class="case-icon"><i class="fa-solid fa-vault"></i></div>
          <span>WEALTH</span>
          <h3>Portfolio Optimization Plan</h3>
        </div>
        <div class="case-card case-card-alt">
          <div class="case-icon"><i class="fa-solid fa-clipboard-check"></i></div>
          <span>AUDIT</span>
          <h3>Operational Audit Overhaul</h3>
        </div>
        <div class="case-card">
          <div class="case-icon"><i class="fa-solid fa-shield-virus"></i></div>
          <span>RISK</span>
          <h3>Enterprise Risk Framework</h3>
        </div>
        <div class="case-card case-card-alt">
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
       <a href="#" class="btn-hero-white tpl-templates01-5"  style="padding: 1.25rem 4rem">Book A Call</a>
    </div>
  </section>

  <!-- TESTIMONIAL -->
  <section class="testimonial">
    <div class="container">
      <h2>What Our Clients Say</h2>
      <div data-gjs-type="swiper-container" class="swiper-container test-slider-container" data-slides-per-view="2" data-space-between="30" data-loop="true" data-grab-cursor="true" data-pagination="bullets">
        <div data-gjs-type="swiper-wrapper" class="swiper-wrapper">
          <div data-gjs-type="swiper-slide" class="swiper-slide">
            <div class="test-box">
              <p>"PROJECT_NAME_PLACEHOLDER transformed how we think about capital. Their team is sharp, kind, and relentlessly focused on the numbers that move our business forward."</p>
              <div class="test-meta">
                <h4>Marcus Chen</h4>
                <span>CFO, Helix Ventures</span>
              </div>
            </div>
          </div>
          <div data-gjs-type="swiper-slide" class="swiper-slide">
            <div class="test-box">
              <p>"An absolute game changer for our fiscal year planning. We uncovered growth levers we didn't even know existed thanks to their detailed audit."</p>
              <div class="test-meta">
                <h4>Sarah Jenkins</h4>
                <span>CEO, TechFlow</span>
              </div>
            </div>
          </div>
          <div data-gjs-type="swiper-slide" class="swiper-slide">
            <div class="test-box">
              <p>"Professional, responsive, and incredibly strategic. They are more than just consultants; they are partners in our success journey."</p>
              <div class="test-meta">
                <h4>David Ross</h4>
                <span>Director, Global Trade</span>
              </div>
            </div>
          </div>
          <div data-gjs-type="swiper-slide" class="swiper-slide">
            <div class="test-box">
              <p>"The best investment we've made this year. Their financial remodeling helped us save countless hours and significantly boosted our margins."</p>
              <div class="test-meta">
                <h4>Emily Stanton</h4>
                <span>Founder, Elevate Inc.</span>
              </div>
            </div>
          </div>
        </div>
        <div data-gjs-type="swiper-pagination" class="swiper-pagination"></div>
      </div>
    </div>
  </section>

  <!-- FINAL CALL TO ACTION -->
  <section class="contact" style="padding: 10rem 0; background: url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1920') center/cover; position: relative;">
    <div style="position: absolute; inset: 0; background: rgba(15, 23, 42, 0.85); z-index: 0;"></div>
    <div class="container" style="position: relative; z-index: 10; text-align: center; color: #fff; max-width: 800px;">
      <span style="color: var(--primary); font-weight: 800; font-size: 0.9rem; letter-spacing: 2px;">TAKE THE NEXT STEP</span>
      <h2 style="font-size: 3.5rem; font-weight: 800; margin: 1.5rem 0 2rem; line-height: 1.1;">Ready to Redefine Your Financial Future?</h2>
      <p style="font-size: 1.1rem; color: #cbd5e1; margin-bottom: 3rem; line-height: 1.6;">Join hundreds of leading companies that trust us to manage their growth, mitigate risks, and secure their financial legacy.</p>
      <a href="#" class="btn-primary" style="padding: 1.25rem 3.5rem; font-size: 1.1rem; box-shadow: 0 20px 40px rgba(0,0,0,0.3);">Schedule Your Free Strategy Session</a>
    </div>
  </section>
</main>

<footer>
  <div class="container foot-grid">
    <div class="foot-col">
       <div class="logo tpl-templates01-6"  style="font-size: 1.5rem; letter-spacing: 2px">LOGO_PLACEHOLDER</div>
       <p class="tpl-templates01-7" style="line-height: 1.8">Premium finance consulting for ambitious businesses. Trusted by founders, CFOs and boards across 40+ countries.</p>
       <div class="tpl-templates01-8" style="margin-top: 2rem">
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
       <p class="tpl-templates01-9" style="font-size: 0.85rem; margin-bottom: 1.5rem">Get monthly insights from our senior advisors.</p>
       <form style="display: flex; flex-wrap: wrap; gap: 10px;" onsubmit="event.preventDefault();">
          <input type="email" placeholder="Your email" class="tpl-templates01-10" style="padding: 0.8rem; width: 100%" required>
          <button type="submit" class="tpl-templates01-11" style="padding: 0.8rem 1.2rem"><i class="fa-solid fa-paper-plane"></i></button>
       </form>
    </div>
  </div>
  <div class="container tpl-templates01-12"  style="margin-top: 5rem; padding-top: 3rem; text-align: center; font-size: 0.85rem">
     <p>© 2026 PROJECT_NAME_PLACEHOLDER. All rights reserved.</p>
  </div>
</footer>


<script id="core-interactions">
  (function() {
    // Check if we are inside GrapesJS editor
    var isInEditor = !!document.querySelector('[data-gjs-type]') || document.body.classList.contains('gjs-dashed');
    
    // Form Validation
    document.addEventListener('submit', function(e) {
      if (e.target.tagName === 'FORM') {
        e.preventDefault();
        if (isInEditor) {
          e.stopImmediatePropagation();
          var existingModal = document.getElementById("preview-mode-modal");
          if (existingModal) existingModal.remove();
          var modalHtml = '<div id="preview-mode-modal" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 999999; display: flex; align-items: center; justify-content: center; background: rgba(15, 23, 42, 0.7); backdrop-filter: blur(8px); opacity: 0; animation: pModalFadeIn 0.3s forwards; font-family: system-ui, -apple-system, sans-serif;"><div style="background: #ffffff; width: 90%; max-width: 400px; border-radius: 20px; padding: 32px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); text-align: center; transform: scale(0.95); animation: pModalScaleUp 0.3s forwards;"><div style="width: 60px; height: 60px; background: #FEF2F2; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;"><svg style="width: 30px; height: 30px; color: #EF4444;" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg></div><h3 style="font-size: 20px; font-weight: 700; color: #0F172A; margin: 0 0 12px; letter-spacing: -0.02em;">Preview Mode Active</h3><p style="font-size: 15px; color: #64748B; margin: 0 0 28px; line-height: 1.5;">Form submissions are disabled in preview mode. Publish your page to accept real submissions.</p><button onclick="document.getElementById(\'preview-mode-modal\').remove()" style="width: 100%; background: #0F172A; color: #ffffff; border: none; padding: 14px; border-radius: 12px; font-size: 15px; font-weight: 600; cursor: pointer; transition: background 0.2s;" onmouseover="this.style.background=\'#1E293B\'" onmouseout="this.style.background=\'#0F172A\'">Got it, close</button></div><style>@keyframes pModalFadeIn { to { opacity: 1; } } @keyframes pModalScaleUp { to { transform: scale(1); } }</style></div>';
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
        
        if (!isValid) {
          e.preventDefault();
          e.stopImmediatePropagation();
        } else {
          e.preventDefault();
          var btn = e.target.querySelector('button[type="submit"]') || e.target.querySelector('input[type="submit"]');
          if (btn) {
            if(btn.innerText) btn.innerText = 'Sending...';
            else btn.value = 'Sending...';
          }
          setTimeout(function() {
            e.target.innerHTML = '<div class="tpl-templates01-13" style="padding: 20px; text-align: center"><h3 style="margin: 0 0 10px 0; font-size: 20px;">Thank You!</h3><p style="margin: 0;">Your request has been submitted successfully.</p></div>';
          }, 1000);
        }
      }
    }, true);
  })();
</script>

`
