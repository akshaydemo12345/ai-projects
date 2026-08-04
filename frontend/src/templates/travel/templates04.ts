// Master Template — Travel 04 (Consulting Redesign)
// 100% Matching the provided Consulting screenshot layout

export const travel04Styles = `
:root {
  --primary: PRIMARY_COLOR_PLACEHOLDER;
  --secondary: SECONDARY_COLOR_PLACEHOLDER;
  --text-dark: #111827;
  --text-gray: #4b5563;
  --bg-light: #f9fafb;
}

* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Inter', sans-serif; background: #fff; color: var(--text-gray); line-height: 1.6; overflow-x: hidden; }

.container { max-width: 1280px; margin: 0 auto; padding: 0 1.5rem; }
img { max-width: 100%; display: block; }
a { text-decoration: none; color: inherit; transition: 0.3s; }
h1, h2, h3, h4, h5, h6 { color: var(--text-dark); line-height: 1.2; }

/* Top Header */
.top-header { background: #fff; padding: 0.75rem 0; border-bottom: 1px solid #e5e7eb; display: flex; align-items: center; justify-content: space-between; }
.top-header-inner { display: flex; justify-content: space-between; align-items: center; width: 100%; }
.logo-area { display: flex; align-items: center; gap: 10px; font-size: 1.5rem; font-weight: 800; color: var(--text-dark); }
.logo-icon { color: var(--primary); font-size: 1.8rem; }
.header-info { display: flex; align-items: center; gap: 2rem; font-size: 0.85rem; }
.info-item { display: flex; align-items: center; gap: 10px; }
.info-item i { color: var(--primary); font-size: 1.1rem; }
.info-text { display: flex; flex-direction: column; }
.info-text span:first-child { font-weight: 600; color: var(--text-dark); }
.btn-quote { background: var(--primary); color: #fff; padding: 0.75rem 1.5rem; border-radius: 4px; font-weight: 600; font-size: 0.85rem; border: none; cursor: pointer; transition: opacity 0.3s; }
.btn-quote:hover { opacity: 0.9; }

/* Hero Section */
.hero { position: relative; padding: 8rem 0; text-align: center; color: #fff; background-image: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url('https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=1920'); background-size: cover; background-position: center; }
.hero-content { position: relative; z-index: 2; max-width: 800px; margin: 0 auto; }
.hero h1 { font-size: 4rem; font-weight: 800; color: #fff; margin-bottom: 1.5rem; }
.hero p { font-size: 1.25rem; font-weight: 300; margin-bottom: 2.5rem; }
.hero-btns { display: flex; gap: 1rem; justify-content: center; }
.btn-solid { background: var(--primary); color: #fff; padding: 1rem 2rem; border-radius: 4px; font-weight: 600; }
.btn-outline { background: #fff; color: var(--primary); padding: 1rem 2rem; border-radius: 4px; font-weight: 600; }

/* Features Section */
.features { padding: 5rem 0; background: #fff; }
.features-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2rem; text-align: center; }
.feature-icon { width: 60px; height: 60px; background: var(--primary); color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; margin: 0 auto 1.5rem; }
.features h3 { font-size: 1.1rem; font-weight: 700; margin-bottom: 1rem; }
.features p { font-size: 0.9rem; color: var(--text-gray); }

/* Our Services */
.services { padding: 5rem 0; background: var(--primary); color: #fff; }
.services h2 { color: #fff; font-size: 2.5rem; font-weight: 800; margin-bottom: 3rem; text-align: center; }
.services-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }
.service-card { background: transparent; }
.service-card img { width: 100%; height: 200px; object-fit: cover; border-radius: 8px 8px 0 0; }
.service-content { padding: 1.5rem 0; }
.service-content h3 { color: #fff; font-size: 1.25rem; margin-bottom: 1rem; font-weight: 600; }
.service-content p { color: rgba(255,255,255,0.8); font-size: 0.9rem; margin-bottom: 1rem; }
.service-content a { color: #fff; font-size: 0.85rem; font-weight: 600; display: inline-flex; align-items: center; gap: 5px; }
.service-content a i { font-size: 0.7rem; }

/* Why Choose Us */
.why-choose { padding: 5rem 0; background: #fff; }
.why-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; }
.why-img img { border-radius: 8px; }
.why-content h2 { font-size: 2.5rem; font-weight: 800; margin-bottom: 1.5rem; }
.why-content p { margin-bottom: 2.5rem; font-size: 1rem; }
.progress-wrap { margin-bottom: 1.5rem; }
.progress-label { display: flex; justify-content: space-between; font-size: 0.85rem; font-weight: 600; margin-bottom: 0.5rem; color: var(--text-dark); text-transform: uppercase; }
.progress-bar { width: 100%; height: 6px; background: #e5e7eb; border-radius: 3px; overflow: hidden; }
.progress-fill { height: 100%; background: var(--primary); }

/* Testimonials */
.testimonials { padding: 5rem 0; background: var(--bg-light); text-align: center; }
.testimonials h2 { font-size: 2.5rem; font-weight: 800; margin-bottom: 3rem; }
.test-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; text-align: left; }
.test-card { background: #fff; padding: 2rem; border-radius: 8px; border: 1px solid #e5e7eb; }
.test-author { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; }
.test-author img { width: 50px; height: 50px; border-radius: 50%; object-fit: cover; }
.test-info h4 { font-size: 1rem; font-weight: 700; margin-bottom: 0.25rem; }
.test-info span { font-size: 0.8rem; color: var(--text-gray); }
.test-card p { font-size: 0.95rem; font-style: italic; color: var(--text-gray); }

/* Stats */
.stats { background: #1e3a8a; /* Darker blue for stats */ padding: 4rem 0; color: #fff; text-align: center; }
.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2rem; }
.stat-item h3 { color: #fff; font-size: 3.5rem; font-weight: 800; margin-bottom: 0.5rem; }
.stat-item p { font-size: 1rem; font-weight: 500; }

/* CTA Form Strip */
.cta-strip { background: #111827; padding: 3rem 0; color: #fff; text-align: center; }
.cta-strip p { font-size: 1.1rem; margin-bottom: 2rem; }
.inline-form { display: flex; justify-content: center; gap: 1rem; max-width: 900px; margin: 0 auto; }
.inline-form input { flex: 1; padding: 0.85rem; border-radius: 4px; border: none; font-family: inherit; }
.inline-form button { background: var(--primary); color: #fff; border: none; padding: 0.85rem 2rem; border-radius: 4px; font-weight: 600; cursor: pointer; }

/* Our Projects */
.projects { padding: 5rem 0; background: #fff; }
.projects h2 { font-size: 2.5rem; font-weight: 800; margin-bottom: 3rem; text-align: left; }
.project-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; }
.project-card { position: relative; overflow: hidden; border-radius: 8px; }
.project-card img { width: 100%; height: 250px; object-fit: cover; transition: transform 0.5s; }
.project-card:hover img { transform: scale(1.05); }
.project-info { position: absolute; bottom: 0; left: 0; right: 0; background: rgba(255,255,255,0.95); padding: 1rem; display: flex; justify-content: space-between; align-items: center; transform: translateY(100%); transition: transform 0.3s; }
.project-card:hover .project-info { transform: translateY(0); }
.project-info h4 { font-size: 0.9rem; font-weight: 600; }
.project-info i { color: var(--primary); }

/* Parallax Banner */
.banner { background-image: linear-gradient(rgba(11, 86, 164, 0.85), rgba(11, 86, 164, 0.85)), url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1920'); background-size: cover; background-position: center; background-attachment: fixed; padding: 6rem 0; text-align: center; color: #fff; }
.banner h2 { color: #fff; font-size: 2.5rem; font-weight: 800; max-width: 800px; margin: 0 auto; }

/* Latest News */
.news { padding: 5rem 0; background: #fff; }
.news h2 { font-size: 2.5rem; font-weight: 800; margin-bottom: 3rem; }
.news-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }
.news-card img { width: 100%; height: 220px; object-fit: cover; border-radius: 8px; margin-bottom: 1.5rem; }
.news-date { font-size: 0.8rem; color: var(--primary); font-weight: 600; margin-bottom: 0.5rem; display: block; text-transform: uppercase; }
.news-card h3 { font-size: 1.25rem; font-weight: 700; margin-bottom: 1rem; }
.news-card p { font-size: 0.95rem; margin-bottom: 1rem; }
.news-card a { font-size: 0.85rem; font-weight: 600; color: var(--primary); }

/* Partners */
.partners { padding: 3rem 0; background: var(--bg-light); border-top: 1px solid #e5e7eb; border-bottom: 1px solid #e5e7eb; }
.partner-grid { display: flex; justify-content: space-around; align-items: center; flex-wrap: wrap; gap: 2rem; }
.partner-grid img { height: 40px; opacity: 0.6; filter: grayscale(100%); transition: 0.3s; }
.partner-grid img:hover { opacity: 1; filter: grayscale(0%); }

/* Footer */
.footer { background: #111827; color: #9ca3af; padding: 4rem 0 2rem; }
.footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 4rem; margin-bottom: 3rem; }
.footer-logo { display: flex; align-items: center; gap: 10px; font-size: 1.5rem; font-weight: 800; color: #fff; margin-bottom: 1.5rem; }
.footer-logo i { color: var(--primary); }
.footer-contact p { margin-bottom: 0.5rem; font-size: 0.9rem; }
.footer h4 { color: #fff; font-size: 1.1rem; font-weight: 700; margin-bottom: 1.5rem; }
.footer-links { display: flex; flex-direction: column; gap: 0.75rem; }
.footer-links a { font-size: 0.9rem; }
.footer-links a:hover { color: #fff; }
.social-links { display: flex; gap: 1rem; margin-top: 1.5rem; }
.social-links a { width: 36px; height: 36px; background: rgba(255,255,255,0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; transition: 0.3s; }
.social-links a:hover { background: var(--primary); }
.footer-bottom { border-top: 1px solid rgba(255,255,255,0.1); padding-top: 2rem; display: flex; justify-content: space-between; align-items: center; font-size: 0.85rem; }
.footer-bottom-links { display: flex; gap: 1.5rem; }

@media (max-width: 1024px) {
  .hero h1 { font-size: 3rem; }
  .features-grid, .stats-grid, .project-grid { grid-template-columns: repeat(2, 1fr); }
  .services-grid, .test-grid, .news-grid { grid-template-columns: repeat(2, 1fr); }
  .why-grid { grid-template-columns: 1fr; }
}
@media (max-width: 768px) {
  .header-info { display: none; }
  .hero h1 { font-size: 2.5rem; }
  .services-grid, .test-grid, .news-grid, .footer-grid { grid-template-columns: 1fr; }
  .inline-form { flex-direction: column; }
  .footer-bottom { flex-direction: column; gap: 1rem; text-align: center; }
}
@media (max-width: 640px) {
  .features-grid, .stats-grid, .project-grid { grid-template-columns: 1fr; }
  .hero-btns { flex-direction: column; }
}

/* Template inline styling classes */
.tpl-templates04-1 { color: var(--primary); }
.tpl-templates04-2 { background: var(--primary); }
.tpl-templates04-3 { color: var(--text-dark); }
.tpl-templates04-4 { color: #fff; }
`

export const travel04Html = `
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">

<!-- Top Header -->
<header class="top-header">
  <div class="container top-header-inner">
    <div class="logo-area">
      LOGO_PLACEHOLDER
    </div>
    <div class="header-info">
      <div class="info-item">
        <i class="fa-solid fa-phone"></i>
        <div class="info-text">
          <span>1-800-123-4567</span>
          <span style="color: var(--text-gray);">info@consulting.com</span>
        </div>
      </div>
      <div class="info-item">
        <i class="fa-solid fa-location-dot"></i>
        <div class="info-text">
          <span>8th floor, 379 Hudson St</span>
          <span style="color: var(--text-gray);">New York, NY 10018</span>
        </div>
      </div>
      <div class="info-item">
        <i class="fa-regular fa-clock"></i>
        <div class="info-text">
          <span>09:00 am - 06:00 pm</span>
          <span style="color: var(--text-gray);">Mon-Friday</span>
        </div>
      </div>
      <button class="btn-quote">Get A Quote</button>
    </div>
  </div>
</header>

<main>
  <!-- HERO SECTION -->
  <section class="hero">
    <div class="container hero-content">
      <h1>Experience. Expertise</h1>
      <p>Comprehensive financial advice and financial services that are tailored to meet your individual needs.</p>
      <div class="hero-btns">
        <a href="javascript:void(0);" class="btn-solid">Our Services</a>
        <a href="javascript:void(0);" class="btn-outline">Request Consultation</a>
      </div>
    </div>
  </section>

  <!-- FEATURES SECTION -->
  <section class="features">
    <div class="container features-grid">
      <div class="feature-card">
        <div class="feature-icon"><i class="fa-solid fa-chart-line"></i></div>
        <h3>Advanced Analytics</h3>
        <p>Quisque pulvinar libero dolor, quis bibendum eros euismod sit amet. Proin dapibus dictum ex.</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon"><i class="fa-solid fa-lightbulb"></i></div>
        <h3>Thought Leadership</h3>
        <p>Pellentesque non diam euismod metus vehicula metus. Donec sed velit placerat eros vehicula.</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon"><i class="fa-solid fa-chess-knight"></i></div>
        <h3>Growth Strategy</h3>
        <p>Ut id elit ut eros finibus, tempor sed magna. Pellentesque non diam euismod metus velimus.</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon"><i class="fa-solid fa-piggy-bank"></i></div>
        <h3>Savings Time & Money</h3>
        <p>Pellentesque non diam euismod metus vehicula metus. Donec sed velit placerat eros fermentum.</p>
      </div>
    </div>
  </section>

  <!-- OUR SERVICES -->
  <section class="services">
    <div class="container">
      <h2>Our Services</h2>
      <div class="services-grid">
        <div class="service-card">
          <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800" alt="Corporate Finance">
          <div class="service-content">
            <h3>Corporate Finance</h3>
            <p>Phasellus lorem enim, luctus ut velit eget, convallis egestas eros. Sed ornare ligula eget tortor tempus, quis porta tellus dictum.</p>
            <a href="javascript:void(0);"><i class="fa-solid fa-chevron-right"></i> Learn More</a>
          </div>
        </div>
        <div class="service-card">
          <img src="https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?auto=format&fit=crop&q=80&w=800" alt="Information Technology">
          <div class="service-content">
            <h3>Information Technology</h3>
            <p>Phasellus lorem enim, luctus ut velit eget, convallis egestas eros. Sed ornare ligula eget tortor tempus, quis porta tellus dictum.</p>
            <a href="javascript:void(0);"><i class="fa-solid fa-chevron-right"></i> Learn More</a>
          </div>
        </div>
        <div class="service-card">
          <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=800" alt="Insurance Consulting">
          <div class="service-content">
            <h3>Insurance Consulting</h3>
            <p>Phasellus lorem enim, luctus ut velit eget, convallis egestas eros. Sed ornare ligula eget tortor tempus, quis porta tellus dictum.</p>
            <a href="javascript:void(0);"><i class="fa-solid fa-chevron-right"></i> Learn More</a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- WHY CHOOSE US -->
  <section class="why-choose">
    <div class="container why-grid">
      <div class="why-img">
        <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800" alt="Why Choose Us">
      </div>
      <div class="why-content">
        <h2>Why Choose Us</h2>
        <p>Who we are, how we work, our timeline and our values. Phasellus mauris urna, facilisis vel odio id, ac interdum scelerisque mauris. Phasellus pulvinar elementum ornare. Cras scelerisque eu metus tincidunt euismod.</p>
        
        <div class="progress-wrap">
          <div class="progress-label">
            <span>Income</span>
            <span>80%</span>
          </div>
          <div class="progress-bar"><div class="progress-fill" style="width: 80%;"></div></div>
        </div>
        
        <div class="progress-wrap">
          <div class="progress-label">
            <span>Opportunity</span>
            <span>90%</span>
          </div>
          <div class="progress-bar"><div class="progress-fill" style="width: 90%;"></div></div>
        </div>
        
        <div class="progress-wrap">
          <div class="progress-label">
            <span>Transformation</span>
            <span>75%</span>
          </div>
          <div class="progress-bar"><div class="progress-fill" style="width: 75%;"></div></div>
        </div>
      </div>
    </div>
  </section>

  <!-- TESTIMONIALS -->
  <section class="testimonials">
    <div class="container">
      <h2>Testimonials</h2>
      <div class="test-grid">
        <div class="test-card">
          <div class="test-author">
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150" alt="Ava Gilbert">
            <div class="test-info">
              <h4>Ava Gilbert</h4>
              <span>Chief Executive Officer, Envato</span>
            </div>
          </div>
          <p>"Ma aci dolores ipsum dolor sit amet, consectetur adipiscing elit. Proin sapien augue, dictum et gravida et, viverra et est."</p>
        </div>
        <div class="test-card">
          <div class="test-author">
            <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150" alt="Kevin Pater">
            <div class="test-info">
              <h4>Kevin Pater</h4>
              <span>Chief Marketing Officer, Envato</span>
            </div>
          </div>
          <p>"Ma aci dolores ipsum dolor sit amet, consectetur adipiscing elit. Proin sapien augue, dictum et gravida et, viverra et est."</p>
        </div>
        <div class="test-card">
          <div class="test-author">
            <img src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=150" alt="Averi Nelson">
            <div class="test-info">
              <h4>Averi Nelson</h4>
              <span>Chief Executive Officer, Envato</span>
            </div>
          </div>
          <p>"Ma aci dolores ipsum dolor sit amet, consectetur adipiscing elit. Proin sapien augue, dictum et gravida et, viverra et est."</p>
        </div>
      </div>
    </div>
  </section>

  <!-- STATS -->
  <section class="stats">
    <div class="container stats-grid">
      <div class="stat-item">
        <h3>325</h3>
        <p>Cases completed</p>
      </div>
      <div class="stat-item">
        <h3>25</h3>
        <p>Consultants</p>
      </div>
      <div class="stat-item">
        <h3>12</h3>
        <p>Awards Winning</p>
      </div>
      <div class="stat-item">
        <h3>100%</h3>
        <p>Satisfied customers</p>
      </div>
    </div>
  </section>

  <!-- CTA STRIP -->
  <section class="cta-strip">
    <div class="container">
      <p>If you need to speak to us about a general query fill in the form below and we will call you back within the same working day.</p>
      <form class="inline-form">
        <input type="text" name="name" placeholder="Name (e.g. John Doe) *" required>
        <input type="email" name="email" placeholder="Email Address *" required>
        <input type="tel" name="phone" placeholder="Phone Number *" required>
        <button type="submit">Submit</button>
      </form>
    </div>
  </section>

  <!-- OUR PROJECTS -->
  <section class="projects">
    <div class="container">
      <h2>Our Projects</h2>
      <div class="project-grid">
        <div class="project-card">
          <img src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=600" alt="Business growth solutions">
          <div class="project-info">
            <h4>Business growth solutions</h4>
            <i class="fa-solid fa-chevron-right"></i>
          </div>
        </div>
        <div class="project-card">
          <img src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=600" alt="Complex company network">
          <div class="project-info">
            <h4>Complex company network</h4>
            <i class="fa-solid fa-chevron-right"></i>
          </div>
        </div>
        <div class="project-card">
          <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=600" alt="Experience in finance">
          <div class="project-info">
            <h4>Experience in finance</h4>
            <i class="fa-solid fa-chevron-right"></i>
          </div>
        </div>
        <div class="project-card">
          <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=600" alt="Global consumer insights">
          <div class="project-info">
            <h4>Global consumer insights</h4>
            <i class="fa-solid fa-chevron-right"></i>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- PARALLAX BANNER -->
  <section class="banner">
    <div class="container">
      <h2>We are experts in consulting services and solutions</h2>
    </div>
  </section>

  <!-- LATEST NEWS -->
  <section class="news">
    <div class="container">
      <h2>Latest News</h2>
      <div class="news-grid">
        <div class="news-card">
          <img src="https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=600" alt="Improve margins and topochen quickly">
          <span class="news-date">July 18, 2026</span>
          <h3>Improve margins and topochen quickly</h3>
          <p>Phasellus lorem enim, luctus ut velit eget, convallis egestas eros. Sed ornare ligula eget tortor tempus, quis porta tellus dictum.</p>
          <a href="javascript:void(0);">Continue reading</a>
        </div>
        <div class="news-card">
          <img src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=600" alt="Delight customers and operate faster">
          <span class="news-date">July 18, 2026</span>
          <h3>Delight customers and operate faster</h3>
          <p>Phasellus lorem enim, luctus ut velit eget, convallis egestas eros. Sed ornare ligula eget tortor tempus, quis porta tellus dictum.</p>
          <a href="javascript:void(0);">Continue reading</a>
        </div>
        <div class="news-card">
          <img src="https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&q=80&w=600" alt="Strategy experience and analytical">
          <span class="news-date">July 17, 2026</span>
          <h3>Strategy experience and analytical</h3>
          <p>Phasellus lorem enim, luctus ut velit eget, convallis egestas eros. Sed ornare ligula eget tortor tempus, quis porta tellus dictum.</p>
          <a href="javascript:void(0);">Continue reading</a>
        </div>
      </div>
    </div>
  </section>

  <!-- PARTNERS -->
  <section class="partners">
    <div class="container partner-grid">
      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/2560px-Google_2015_logo.svg.png" alt="Partner 1">
      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/IBM_logo.svg/1200px-IBM_logo.svg.png" alt="Partner 2">
      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Microsoft_logo_%282012%29.svg/1920px-Microsoft_logo_%282012%29.svg.png" alt="Partner 3">
      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Cisco_logo_blue_2016.svg/1200px-Cisco_logo_blue_2016.svg.png" alt="Partner 4">
    </div>
  </section>
</main>

<!-- FOOTER -->
<footer class="footer">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-col">
        <div class="footer-logo">
          LOGO_PLACEHOLDER
        </div>
        <div class="footer-contact">
          <h4>Contact us</h4>
          <p>Address: 8th floor, 379 Hudson St, New York, NY 10018</p>
          <p>Phone: 1-800-123-4567</p>
          <p>Email: info@consulting.com</p>
        </div>
      </div>
      <div class="footer-col">
        <h4>Company</h4>
        <div class="footer-links">
          <a href="javascript:void(0);">About</a>
          <a href="javascript:void(0);">Contact Us</a>
          <a href="javascript:void(0);">Terms & Conditions</a>
          <a href="javascript:void(0);">Privacy Policy</a>
          <a href="javascript:void(0);">Site Map</a>
        </div>
      </div>
      <div class="footer-col">
        <h4>Follow us</h4>
        <div class="social-links">
          <a href="javascript:void(0);"><i class="fa-brands fa-facebook-f"></i></a>
          <a href="javascript:void(0);"><i class="fa-brands fa-twitter"></i></a>
          <a href="javascript:void(0);"><i class="fa-brands fa-linkedin-in"></i></a>
          <a href="javascript:void(0);"><i class="fa-brands fa-instagram"></i></a>
        </div>
      </div>
    </div>
    
    <div class="footer-bottom">
      <p>© 2026 Consulting. All rights reserved.</p>
      <div class="footer-bottom-links">
        <a href="javascript:void(0);">About</a>
        <a href="javascript:void(0);">Contact Us</a>
        <a href="javascript:void(0);">Terms & Conditions</a>
        <a href="javascript:void(0);">Privacy Policy</a>
        <a href="javascript:void(0);">Site Map</a>
      </div>
    </div>
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
                if (window.getComputedStyle(input.parentElement).display === 'grid' || window.getComputedStyle(input.parentElement).display === 'flex') {
                    // Do nothing for flex in this specific inline form, wrapper handles it
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
              err.style.textAlign = 'left';
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
            e.target.innerHTML = '<div style="padding: 20px; text-align: center; color: #fff; width: 100%;"><h3 style="margin: 0 0 10px 0;">Thank You!</h3><p style="margin: 0;">Your request has been submitted successfully.</p></div>';
          }, 1000);
        }
      }
    }, true);
  })();
</script>
`
