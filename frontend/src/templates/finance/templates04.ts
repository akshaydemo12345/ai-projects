export const finance04Styles = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,800;1,400&family=Inter:wght@300;400;500;600&display=swap');

:root {
  --primary: PRIMARY_COLOR_PLACEHOLDER; /* Dark Blue */
  --secondary: SECONDARY_COLOR_PLACEHOLDER; /* Green */
  --bg-color: #ffffff;
  --bg-light: #f5f7fa;
  --text-main: #333333;
  --text-muted: #666666;
  --border-color: #e5e5e5;
}

* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Inter', sans-serif; background-color: var(--bg-color); color: var(--text-main); line-height: 1.6; overflow-x: hidden; }

h1, h2, h3, h4, h5, h6 { font-family: 'Playfair Display', serif; color: var(--primary); font-weight: 700; line-height: 1.2; }
a { text-decoration: none; color: inherit; transition: 0.3s; }
img { max-width: 100%; display: block; object-fit: cover; }
ul { list-style: none; }

.container { max-width: 1200px; margin: 0 auto; padding: 0 20px; position: relative; z-index: 10; }
.text-center { text-align: center; }

/* Buttons */
.btn-primary { background: var(--secondary); color: #fff; display: inline-block; padding: 14px 35px; font-size: 14px; font-weight: 600; border: none; cursor: pointer; transition: 0.3s; }
.btn-primary:hover { background: color-mix(in srgb, var(--secondary) 80%, black); }
.btn-white { background: #fff; color: var(--secondary); display: inline-block; padding: 14px 35px; font-size: 14px; font-weight: 600; border: none; cursor: pointer; transition: 0.3s; }
.btn-white:hover { background: var(--bg-light); }

/* Section Titles */
.sec-sub { font-size: 13px; font-weight: 600; color: var(--secondary); text-transform: uppercase; letter-spacing: 2px; margin-bottom: 10px; display: block; }
.sec-title { font-size: 42px; margin-bottom: 20px; color: var(--primary); position: relative; z-index: 2; }
.sec-desc { color: var(--text-muted); margin-bottom: 30px; font-size: 15px; position: relative; z-index: 2; }

/* Header & Hero */
.header-hero { position: relative; background: var(--primary); min-height: 800px; overflow: hidden; }
.header-hero::before { content: ''; position: absolute; top: 0; right: 0; width: 55%; height: 100%; background: url('https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&q=80&w=1200') center/cover; clip-path: polygon(20% 0, 100% 0, 100% 100%, 0 100%); opacity: 0.4; }
.header-hero::after { content: ''; position: absolute; bottom: 0; right: 0; width: 300px; height: 300px; background: var(--secondary); clip-path: polygon(100% 0, 100% 100%, 0 100%); z-index: 1; }

.top-nav { display: flex; justify-content: space-between; align-items: stretch; background: #fff; position: relative; z-index: 10; margin-top: 30px; }
.nav-logo { padding: 15px 30px; display: flex; align-items: center; gap: 12px; font-family: 'Inter', sans-serif; color: var(--primary); text-transform: uppercase; }
.logo-icon { width: 36px; height: 36px; background: var(--secondary); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 22px; font-weight: 800; font-family: 'Playfair Display', serif; }
.logo-text { display: flex; flex-direction: column; line-height: 1; }
.logo-text strong { font-size: 18px; font-weight: 800; letter-spacing: 1px; margin-bottom: 2px; }
.logo-text span { font-size: 10px; font-weight: 600; letter-spacing: 3px; color: var(--secondary); }
.nav-contact { background: var(--secondary); color: #fff; padding: 15px 40px; display: flex; flex-direction: column; justify-content: center; font-size: 14px; font-weight: 500; }
.nav-contact i { margin-right: 8px; }

.hero-content { position: relative; z-index: 10; padding: 150px 0; max-width: 600px; }
.hero-content h1 { font-size: 60px; color: #fff; margin-bottom: 25px; line-height: 1.1; }
.hero-content p { color: rgba(255,255,255,0.8); font-size: 16px; margin-bottom: 40px; border-left: 2px solid var(--secondary); padding-left: 20px; }

/* CSS Logo Slider / Marquee */
.client-marquee { padding: 40px 0; background: var(--bg-light); border-bottom: 1px solid var(--border-color); overflow: hidden; position: relative; }
.marquee-track { display: flex; gap: 60px; white-space: nowrap; animation: scrollLogos 20s linear infinite; align-items: center; }
.marquee-track img { height: 40px; opacity: 0.6; filter: grayscale(100%); transition: 0.3s; }
.marquee-track img:hover { opacity: 1; filter: grayscale(0%); }
@keyframes scrollLogos { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }

/* About Section */
.about-section { padding: 100px 0; position: relative; overflow: hidden; }
.about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }
.about-images { position: relative; }
.ab-img-main { width: 80%; height: 500px; box-shadow: 0 20px 40px rgba(0,0,0,0.15); position: relative; z-index: 2; border: 8px solid #fff; }
.ab-img-sub { position: absolute; bottom: -20px; right: 0; width: 50%; height: 300px; box-shadow: 0 10px 30px rgba(0,0,0,0.15); z-index: 3; border: 6px solid #fff; }
.ab-badge-top { position: absolute; top: 0; left: 5%; background: var(--secondary); color: #fff; padding: 20px; text-align: center; z-index: 4; border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; box-shadow: 0 10px 20px color-mix(in srgb, var(--secondary) 40%, transparent); }
.ab-badge-top h3 { color: #fff; font-family: 'Inter', sans-serif; font-size: 24px; margin-bottom: 0; }
.ab-badge-top span { font-size: 12px; font-weight: 600; text-transform: uppercase; }

.about-list { margin: 30px 0; }
.about-list-item { display: flex; gap: 15px; margin-bottom: 25px; }
.al-icon { font-size: 30px; color: var(--secondary); margin-top: 5px; }
.al-text h4 { font-family: 'Inter', sans-serif; font-size: 18px; color: var(--primary); margin-bottom: 5px; font-weight: 600; }
.al-text p { font-size: 14px; color: var(--text-muted); }

/* Services Section */
.services-section { padding: 100px 0; background: var(--bg-light); text-align: center; position: relative; }
.services-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; margin-top: 50px; }
.srv-card { background: #fff; box-shadow: 0 5px 20px rgba(0,0,0,0.05); transition: 0.3s; position: relative; z-index: 2; border-radius: 20px; overflow: hidden; }
.srv-card:hover { transform: translateY(-10px); box-shadow: 0 20px 40px rgba(0,0,0,0.08); }
.srv-img { width: 100%; height: 220px; transition: 0.5s; }
.srv-card:hover .srv-img { transform: scale(1.05); }
.srv-content { padding: 30px; position: relative; }
.srv-icon { width: 60px; height: 60px; background: var(--secondary); color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; margin: 0 auto 20px; margin-top: -60px; position: relative; border: 4px solid #fff; box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
.srv-content h4 { font-size: 22px; margin-bottom: 15px; }
.srv-content p { font-size: 14px; color: var(--text-muted); margin-bottom: 20px; }
.srv-arrow { color: var(--secondary); font-size: 14px; display: inline-flex; width: 35px; height: 35px; background: var(--bg-light); align-items: center; justify-content: center; border-radius: 50%; transition: 0.3s; }
.srv-card:hover .srv-arrow { background: var(--secondary); color: #fff; }

/* Who We Are Split */
.who-section { display: grid; grid-template-columns: 1fr 1fr; background: var(--primary); }
.who-img { width: 100%; height: 100%; object-fit: cover; min-height: 500px; clip-path: polygon(0 0, 90% 0, 100% 100%, 0 100%); }
.who-content { padding: 100px 80px; color: #fff; position: relative; display: flex; flex-direction: column; justify-content: center; }
.who-content::after { content: ''; position: absolute; right: 0; top: 30%; width: 50px; height: 50px; background: var(--secondary); clip-path: polygon(100% 0, 100% 100%, 0 50%); }
.who-content .sec-title { color: #fff; }
.who-content .sec-desc { color: rgba(255,255,255,0.7); }
.who-author { margin-top: 40px; }
.who-author h5 { color: #fff; font-family: 'Inter', sans-serif; font-size: 16px; margin-bottom: 2px; }
.who-author span { font-size: 13px; color: var(--secondary); text-transform: uppercase; letter-spacing: 1px; font-weight: 600; }

/* Stats Bar */
.stats-bar { background: var(--secondary); padding: 60px 0; position: relative; overflow: hidden; }
.stats-bar::before { content: ''; position: absolute; top: -50px; left: -50px; width: 150px; height: 150px; border-radius: 50%; border: 20px solid rgba(255,255,255,0.2); }
.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); text-align: center; color: #fff; position: relative; z-index: 2; }
.stat-item { border-right: 1px solid rgba(255,255,255,0.3); }
.stat-item:last-child { border: none; }
.stat-item h3 { color: #fff; font-family: 'Inter', sans-serif; font-size: 44px; margin-bottom: 5px; font-weight: 800; }
.stat-item p { font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; }

/* Static Case Studies (2x2 Grid) */
.case-studies { padding: 120px 0; text-align: center; position: relative; overflow: hidden; }
.cs-header { text-align: left; margin-bottom: 50px; }
.case-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.case-item { position: relative; height: 400px; overflow: hidden; border-radius: 20px; }
.case-item img { width: 100%; height: 100%; object-fit: cover; transition: 0.8s ease; }
.case-overlay { position: absolute; bottom: 0; left: 0; width: 100%; padding: 40px; background: linear-gradient(to top, var(--primary) 10%, transparent); text-align: left; color: #fff; opacity: 0.9; transition: 0.3s; }
.case-overlay span { font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; color: var(--secondary); margin-bottom: 8px; display: block; }
.case-overlay h3 { color: #fff; font-size: 24px; margin: 0; }
.case-icon { position: absolute; top: 30px; right: 30px; width: 50px; height: 50px; background: rgba(255,255,255,0.2); backdrop-filter: blur(5px); display: flex; align-items: center; justify-content: center; color: #fff; border-radius: 50%; font-size: 18px; transition: 0.3s; opacity: 0; transform: scale(0.5); }
.case-item:hover img { transform: scale(1.1); }
.case-item:hover .case-icon { opacity: 1; transform: scale(1); background: var(--secondary); }

/* CTA Banner */
.cta-banner { background: var(--primary); padding: 80px 0; position: relative; overflow: hidden; }
.cta-banner::before { content: ''; position: absolute; top: 0; right: 0; width: 40%; height: 100%; background: var(--secondary); clip-path: polygon(20% 0, 100% 0, 100% 100%, 0 100%); opacity: 0.1; }
.cta-inner { display: flex; justify-content: space-between; align-items: center; position: relative; z-index: 2; }
.cta-inner h2 { color: #fff; font-size: 36px; max-width: 500px; margin: 0; line-height: 1.3; }

/* Static Testimonial */
.testimonial-section { background: var(--secondary); padding: 100px 0; text-align: center; color: #fff; position: relative; overflow: hidden; }
.test-icon { font-size: 40px; margin-bottom: 30px; opacity: 0.9; }
.test-quote { font-size: 26px; font-family: 'Playfair Display', serif; font-style: italic; max-width: 800px; margin: 0 auto 40px; line-height: 1.6; }
.test-author h4 { color: #fff; font-family: 'Inter', sans-serif; font-size: 18px; margin-bottom: 5px; font-weight: 700; }
.test-author p { font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; opacity: 0.9; margin-bottom: 20px; }
.test-author img { width: 70px; height: 70px; border-radius: 50%; margin: 0 auto; border: 3px solid rgba(255,255,255,0.4); }

/* Blog Section */
.blog-section { padding: 120px 0; text-align: center; background: var(--bg-light); position: relative; }
.blog-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; margin-top: 50px; text-align: left; }
.blog-card { background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 5px 20px rgba(0,0,0,0.03); transition: 0.3s; }
.blog-card:hover { transform: translateY(-10px); box-shadow: 0 15px 30px rgba(0,0,0,0.08); }
.blog-card img { width: 100%; height: 240px; object-fit: cover; }
.blog-content { padding: 30px; }
.blog-meta { display: flex; gap: 15px; font-size: 12px; color: var(--secondary); margin-bottom: 15px; text-transform: uppercase; font-weight: 600; letter-spacing: 1px; }
.blog-meta i { margin-right: 5px; }
.blog-content h4 { font-size: 22px; margin-bottom: 20px; line-height: 1.4; transition: 0.3s; cursor: pointer; }
.blog-content h4:hover { color: var(--secondary); }
.blog-arrow { color: var(--primary); font-size: 14px; font-weight: 600; display: inline-flex; align-items: center; gap: 8px; text-transform: uppercase; }
.blog-arrow i { transition: 0.3s; }
.blog-card:hover .blog-arrow i { transform: translateX(5px); color: var(--secondary); }

/* Contact Section */
.contact-section { padding: 120px 0; background: #fff; text-align: center; position: relative; }
.contact-form { max-width: 800px; margin: 50px auto 0; position: relative; z-index: 2; }
.form-row { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin-bottom: 20px; }
.form-control { width: 100%; padding: 16px 20px; border: 1px solid var(--border-color); background: var(--bg-light); font-family: 'Inter', sans-serif; font-size: 14px; outline: none; border-radius: 8px; transition: 0.3s; }
.form-control:focus { border-color: var(--secondary); background: #fff; box-shadow: 0 0 0 4px color-mix(in srgb, var(--secondary) 20%, transparent); }
textarea.form-control { height: 160px; resize: none; margin-bottom: 30px; }

/* Footer */
.footer { background: var(--primary); padding: 80px 0 30px; color: rgba(255,255,255,0.7); font-size: 14px; position: relative; overflow: hidden; }
.footer::before { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 5px; background: var(--secondary); }
.footer-grid { display: grid; grid-template-columns: 1.5fr 1fr 1fr 1.5fr; gap: 40px; margin-bottom: 60px; position: relative; z-index: 2; }
.footer-logo { display: flex; align-items: center; gap: 12px; font-family: 'Inter', sans-serif; color: #fff; text-transform: uppercase; margin-bottom: 25px; }
.footer-logo .logo-icon { background: var(--secondary); color: #fff; }
.footer-logo .logo-text span { color: #fff; opacity: 0.8; }
.footer-contact li { display: flex; gap: 15px; margin-bottom: 18px; }
.footer-contact i { color: var(--secondary); font-size: 16px; margin-top: 3px; }
.footer h4 { color: #fff; font-family: 'Inter', sans-serif; font-size: 18px; margin-bottom: 25px; font-weight: 700; }
.footer-links li { margin-bottom: 12px; }
.footer-links a { transition: 0.3s; }
.footer-links a:hover { color: var(--secondary); padding-left: 5px; }
.newsletter-form { display: flex; margin-bottom: 25px; border-radius: 50px; overflow: hidden; }
.newsletter-form input { flex: 1; padding: 15px 20px; border: none; outline: none; font-family: 'Inter', sans-serif; background: rgba(255,255,255,0.1); color: #fff; }
.newsletter-form button { background: var(--secondary); color: #fff; border: none; padding: 0 25px; cursor: pointer; transition: 0.3s; }
.newsletter-form button:hover { background: #fff; color: var(--secondary); }
.footer-social { display: flex; gap: 15px; }
.footer-social a { color: #fff; font-size: 14px; width: 40px; height: 40px; background: rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; border-radius: 50%; transition: 0.3s; }
.footer-social a:hover { background: var(--secondary); transform: translateY(-3px); }
.footer-bottom { text-align: center; padding-top: 30px; border-top: 1px solid rgba(255,255,255,0.1); font-size: 13px; position: relative; z-index: 2; }

@media (max-width: 1024px) {
  .about-grid, .who-section, .cta-inner { grid-template-columns: 1fr; text-align: center; gap: 40px; }
  .services-grid, .blog-grid, .case-grid { grid-template-columns: repeat(2, 1fr); }
  .stats-grid, .footer-grid { grid-template-columns: repeat(2, 1fr); gap: 30px; }
  .form-row { grid-template-columns: 1fr; }
  .header-hero::before { width: 100%; clip-path: none; opacity: 0.2; }
  .who-img { clip-path: none; }
  .who-content::after { display: none; }
  .cta-inner h2 { margin: 0 auto 20px; }
  .cs-header { text-align: center; }
  .ab-img-main { margin: 0 auto; }
}
@media (max-width: 768px) {
  .top-nav { flex-direction: column; text-align: center; }
  .nav-contact { display: none; }
  .hero-content h1 { font-size: 40px; }
  .services-grid, .blog-grid, .stats-grid, .footer-grid, .case-grid { grid-template-columns: 1fr; }
  .stat-item { border-right: none; border-bottom: 1px solid rgba(255,255,255,0.2); padding: 20px 0; }
  .ab-badge-top { display: none; }
}
`;

export const finance04Html = `
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,800;1,400&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">

<main>
  <!-- 1. Header & Hero -->
  <section class="header-hero">
    <div class="container">
      <div class="top-nav">
        <div class="nav-logo">
          <div class="logo-text">
            LOGO_PLACEHOLDER
          </div>
        </div>
        <div class="nav-contact">
          <div><i class="fa-solid fa-phone"></i> Call us on</div>
          <div>+62 1234 628</div>
        </div>
      </div>
      
      <div class="hero-content">
        <h1>Our Finance Can Give Possibilities For Business</h1>
        <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
        <a href="#about" class="btn-primary">Discover More</a>
      </div>
    </div>
  </section>

  <!-- CSS Logo Slider -->
  <div class="client-marquee">
    <div class="marquee-track">
      <img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" alt="Google">
      <img src="https://upload.wikimedia.org/wikipedia/commons/b/b9/Slack_Technologies_Logo.svg" alt="Slack">
      <img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" alt="Amazon">
      <img src="https://upload.wikimedia.org/wikipedia/commons/e/e8/Tesla_logo.png" alt="Tesla">
      <img src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" alt="Microsoft">
      <!-- Duplicated for continuous animation -->
      <img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" alt="Google">
      <img src="https://upload.wikimedia.org/wikipedia/commons/b/b9/Slack_Technologies_Logo.svg" alt="Slack">
      <img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" alt="Amazon">
      <img src="https://upload.wikimedia.org/wikipedia/commons/e/e8/Tesla_logo.png" alt="Tesla">
      <img src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" alt="Microsoft">
    </div>
  </div>

  <!-- 2. About Us -->
  <section class="about-section" id="about">
    <div class="container about-grid">
      <div class="about-images">
        <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=800" alt="Team Meeting" class="ab-img-main">
        <img src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1000&q=80" alt="Consultation" class="ab-img-sub">
        <div class="ab-badge-top">
          <h3>850+</h3>
          <span>Awards Won</span>
        </div>
      </div>
      <div>
        <span class="sec-sub">ABOUT US</span>
        <h2 class="sec-title">Get Exceptional Service For Growth</h2>
        <p class="sec-desc">Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat.</p>
        
        <div class="about-list">
          <div class="about-list-item">
            <div class="al-icon"><i class="fa-solid fa-bullseye"></i></div>
            <div class="al-text">
              <h4>Our Mission</h4>
              <p>Facere id est molestiae consequatur vel illum qui dolorem eum fugiat.</p>
            </div>
          </div>
          <div class="about-list-item">
            <div class="al-icon"><i class="fa-solid fa-rocket"></i></div>
            <div class="al-text">
              <h4>Our Goals</h4>
              <p>Reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur.</p>
            </div>
          </div>
        </div>
        <a href="#services" class="btn-primary">Read More</a>
      </div>
    </div>
  </section>

  <!-- 3. Services -->
  <section class="services-section" id="services">
    <div class="container">
      <span class="sec-sub">OUR SERVICES</span>
      <h2 class="sec-title">What We're Offering</h2>
      
      <div class="services-grid">
        <div class="srv-card">
          <img src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=600" alt="Audit Marketing" class="srv-img">
          <div class="srv-content">
            <div class="srv-icon"><i class="fa-solid fa-magnifying-glass-chart"></i></div>
            <h4>Audit Marketing</h4>
            <p>Repudiandae sint et molestiae non recusandae itaque earum rerum hic tenetur.</p>
            <a href="#" class="srv-arrow"><i class="fa-solid fa-arrow-right"></i></a>
          </div>
        </div>
        <div class="srv-card">
          <img src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=600" alt="Finance Consulting" class="srv-img">
          <div class="srv-content">
            <div class="srv-icon"><i class="fa-solid fa-hand-holding-dollar"></i></div>
            <h4>Finance Consulting</h4>
            <p>Eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.</p>
            <a href="#" class="srv-arrow"><i class="fa-solid fa-arrow-right"></i></a>
          </div>
        </div>
        <div class="srv-card">
          <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600" alt="Wealth Management" class="srv-img">
          <div class="srv-content">
            <div class="srv-icon"><i class="fa-solid fa-coins"></i></div>
            <h4>Wealth Management</h4>
            <p>Aut illum qui dolorem eum fugiat quo voluptas nulla pariatur voluptatibus.</p>
            <a href="#" class="srv-arrow"><i class="fa-solid fa-arrow-right"></i></a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- 4. Who We Are -->
  <section class="who-section">
    <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1000" alt="Team Discussion" class="who-img">
    <div class="who-content">
      <span class="sec-sub">WHO WE ARE</span>
      <h2 class="sec-title">Our Mission, Values and Motto</h2>
      <p class="sec-desc">Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.</p>
      
      <div class="who-author">
        <h5>Jonathan Andrew</h5>
        <span>Founder & CEO</span>
      </div>
    </div>
  </section>

  <!-- 5. Stats -->
  <section class="stats-bar">
    <div class="container stats-grid">
      <div class="stat-item">
        <h3>1500+</h3>
        <p>Projects</p>
      </div>
      <div class="stat-item">
        <h3>4800+</h3>
        <p>Active Clients</p>
      </div>
      <div class="stat-item">
        <h3>630+</h3>
        <p>Success Rate</p>
      </div>
      <div class="stat-item">
        <h3>100+</h3>
        <p>Office Branches</p>
      </div>
    </div>
  </section>

  <!-- 6. Static Case Studies -->
  <section class="case-studies">
    <div class="container">
      <div class="cs-header">
        <span class="sec-sub">DISCOVER PORTFOLIO</span>
        <h2 class="sec-title" style="margin-bottom: 0;">Our Latest Case Studies</h2>
      </div>
      
      <div class="case-grid">
        <div class="case-item">
          <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800" alt="Case Study 1">
          <div class="case-overlay">
            <span>BUSINESS, FINANCE</span>
            <h3>Financial Health Audit</h3>
          </div>
          <a href="#" class="case-icon"><i class="fa-solid fa-arrow-right"></i></a>
        </div>
        <div class="case-item">
          <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800" alt="Case Study 2">
          <div class="case-overlay">
            <span>MARKETING, FINANCE</span>
            <h3>Tax Return Process</h3>
          </div>
          <a href="#" class="case-icon"><i class="fa-solid fa-arrow-right"></i></a>
        </div>
        <div class="case-item">
          <img src="https://images.unsplash.com/photo-1556761175-5973dc0f32d7?auto=format&fit=crop&q=80&w=800" alt="Case Study 3">
          <div class="case-overlay">
            <span>ACADEMIC, FINANCE</span>
            <h3>Enterprise Loan Audit</h3>
          </div>
          <a href="#" class="case-icon"><i class="fa-solid fa-arrow-right"></i></a>
        </div>
        <div class="case-item">
          <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=800" alt="Case Study 4">
          <div class="case-overlay">
            <span>WEALTH, FINANCE</span>
            <h3>Asset Management Solutions</h3>
          </div>
          <a href="#" class="case-icon"><i class="fa-solid fa-arrow-right"></i></a>
        </div>
      </div>
    </div>
  </section>

  <!-- 7. CTA Banner -->
  <section class="cta-banner">
    <div class="container cta-inner">
      <div>
        <span class="sec-sub" style="color: var(--secondary);">GET IN TOUCH</span>
        <h2>Get a Free Expert Consultation For Your Business</h2>
      </div>
      <a href="#contact" class="btn-white">Discover More</a>
    </div>
  </section>

  <!-- 8. Static Testimonial -->
  <section class="testimonial-section">
    <div class="container">
      <i class="fa-solid fa-quote-left test-icon"></i>
      <p class="test-quote">"Repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat."</p>
      <div class="test-author">
        <h4>Kevin Parker</h4>
        <p>CEO, VORTEX</p>
        <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150" alt="Client">
      </div>
    </div>
  </section>

  <!-- 9. Blog -->
  <section class="blog-section">
    <div class="container">
      <span class="sec-sub">BLOG POSTS</span>
      <h2 class="sec-title">Latest News and Articles</h2>
      
      <div class="blog-grid">
        <div class="blog-card">
          <img src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=600" alt="Blog 1">
          <div class="blog-content">
            <div class="blog-meta">
              <span><i class="fa-regular fa-calendar"></i> JAN 20</span>
              <span><i class="fa-regular fa-comments"></i> 0 COMMENTS</span>
            </div>
            <h4>Why You Should Inform More Like Finance.</h4>
            <a href="#" class="blog-arrow">Read More <i class="fa-solid fa-arrow-right"></i></a>
          </div>
        </div>
        <div class="blog-card">
          <img src="https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=600" alt="Blog 2">
          <div class="blog-content">
            <div class="blog-meta">
              <span><i class="fa-regular fa-calendar"></i> FEB 12</span>
              <span><i class="fa-regular fa-comments"></i> 3 COMMENTS</span>
            </div>
            <h4>Solution Financial for good strategy's.</h4>
            <a href="#" class="blog-arrow">Read More <i class="fa-solid fa-arrow-right"></i></a>
          </div>
        </div>
        <div class="blog-card">
          <img src="https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=600" alt="Blog 3">
          <div class="blog-content">
            <div class="blog-meta">
              <span><i class="fa-regular fa-calendar"></i> MAR 05</span>
              <span><i class="fa-regular fa-comments"></i> 1 COMMENT</span>
            </div>
            <h4>Plans for better businesses growing.</h4>
            <a href="#" class="blog-arrow">Read More <i class="fa-solid fa-arrow-right"></i></a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- 10. Contact -->
  <section class="contact-section" id="contact">
    <div class="container">
      <span class="sec-sub">CONTACT WITH US</span>
      <h2 class="sec-title">Feel Free to Contact us with<br>Any Questions</h2>
      
      <form class="contact-form premium-form" onsubmit="event.preventDefault();">
        <div class="form-row">
          <input type="text" class="form-control" placeholder="Name" required>
          <input type="email" class="form-control" placeholder="Email" required>
          <input type="tel" class="form-control" placeholder="Phone" required>
        </div>
        <textarea class="form-control" placeholder="Message" required></textarea>
        <button type="submit" class="btn-primary">Send Now <i class="fa-solid fa-paper-plane" style="margin-left: 8px;"></i></button>
      </form>
    </div>
  </section>

  <!-- 11. Footer -->
  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div>
          <div class="footer-logo">
            <div class="logo-text">
             LOGO_PLACEHOLDER
            </div>
          </div>
          <ul class="footer-contact">
            <li><i class="fa-solid fa-phone"></i> +62 1234 628</li>
            <li><i class="fa-solid fa-envelope"></i> info@fiercefinance.com</li>
            <li><i class="fa-solid fa-location-dot"></i> 41 8th Avenue,<br>Melbourne 3000,<br>Australia</li>
          </ul>
        </div>
        <div>
          <h4>Useful Links</h4>
          <ul class="footer-links">
            <li><a href="#">Home</a></li>
            <li><a href="#about">About Us</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#">Team</a></li>
            <li><a href="#">Blog</a></li>
            <li><a href="#contact">Contact Us</a></li>
          </ul>
        </div>
        <div>
          <h4>Resources</h4>
          <ul class="footer-links">
            <li><a href="#">Audit & Assurance</a></li>
            <li><a href="#">Business Consulting</a></li>
            <li><a href="#">Financial Modeling</a></li>
            <li><a href="#">Trades & Stocks</a></li>
            <li><a href="#">Wealth Management</a></li>
            <li><a href="#">Strategic Planning</a></li>
          </ul>
        </div>
        <div>
          <h4>Our Newsletter</h4>
          <form class="newsletter-form premium-form" onsubmit="event.preventDefault(); this.innerHTML = '<span style=\\'color:#fff; padding:10px 0;\\'>Subscribed Successfully!</span>';">
            <input type="email" placeholder="Email Address..." required>
            <button type="submit"><i class="fa-solid fa-arrow-right"></i></button>
          </form>
          <h4 style="font-size: 14px; margin-bottom: 10px;">Follow Us</h4>
          <div class="footer-social">
            <a href="#"><i class="fa-brands fa-facebook-f"></i></a>
            <a href="#"><i class="fa-brands fa-twitter"></i></a>
            <a href="#"><i class="fa-brands fa-linkedin-in"></i></a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        &copy; 2026 Fierce Finance. All Rights Reserved.
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
          var modalHtml = '<div id="preview-mode-modal" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 999999; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.8); backdrop-filter: blur(8px); opacity: 0; animation: pModalFadeIn 0.3s forwards; font-family: \\'Inter\\', sans-serif;"><div style="background: #ffffff; width: 90%; max-width: 400px; border-radius: 20px; padding: 32px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); text-align: center; transform: scale(0.95); animation: pModalScaleUp 0.3s forwards;"><div style="width: 60px; height: 60px; background: #FEF2F2; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;"><svg style="width: 30px; height: 30px; color: #ef4444;" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg></div><h3 style="font-size: 18px; font-weight: 700; color: var(--primary); margin: 0 0 12px;">Preview Mode Active</h3><p style="font-size: 14px; color: #666; margin: 0 0 28px; line-height: 1.5;">Form submissions are disabled in preview mode. Publish your page to accept real submissions.</p><button onclick="document.getElementById(\\'preview-mode-modal\\').remove()" style="width: 100%; background: var(--secondary); color: #ffffff; border: none; padding: 14px; border-radius: 30px; font-size: 14px; font-weight: 600; cursor: pointer; transition: 0.3s;">Got it, close</button></div><style>@keyframes pModalFadeIn { to { opacity: 1; } } @keyframes pModalScaleUp { to { transform: scale(1); } }</style></div>';
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
                input.style.borderColor = 'var(--secondary)';
                if (input.nextElementSibling && input.nextElementSibling.classList.contains('val-error')) {
                  input.nextElementSibling.style.display = 'none';
                }
              } else {
                input.style.borderColor = 'red';
                if (input.nextElementSibling && input.nextElementSibling.classList.contains('val-error')) {
                  input.nextElementSibling.style.display = 'block';
                }
              }
            });
          }

          if (!input.value.trim() && input.hasAttribute('required')) {
            isValid = false;
            input.style.borderColor = 'red';
            
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
              err.style.color = 'red';
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
          var btn = e.target.querySelector('button[type="submit"]');
          if (btn) btn.innerHTML = 'Sending...';
          setTimeout(function() {
            e.target.innerHTML = '<div style="padding: 20px; text-align: center; color: var(--secondary);"><h3 style="margin: 0 0 10px 0; font-size: 18px;">Thank You!</h3><p style="margin: 0; font-size: 14px;">Your message has been sent successfully.</p></div>';
          }, 1000);
        }
      }
    }, true);
  })();
</script>
`
