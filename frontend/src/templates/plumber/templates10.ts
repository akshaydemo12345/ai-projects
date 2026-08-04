export const plumber10Styles = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Montserrat:wght@300;400;500;600;700&display=swap');

:root {
  --primary: PRIMARY_COLOR_PLACEHOLDER;
  --secondary: SECONDARY_COLOR_PLACEHOLDER;
  --primary-rgb: PRIMARY_RGB_PLACEHOLDER;
  --secondary-rgb: SECONDARY_RGB_PLACEHOLDER;
  --bg-black: #0a0a0a;
  --bg-white: #ffffff;
  --bg-gray: #f5f5f5;
  --text-dark: #111111;
  --text-muted: #555555;
  --border: #e0e0e0;
}

/* GrapesJS Editor Override */
body, .gjs-dashed, [data-gjs-type="wrapper"], main {
    background-color: var(--bg-white) !important;
    color: var(--text-muted) !important;
}
h1, h2, h3, h4, h5, h6, p, span, div, a {
    color: inherit;
}


* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Montserrat', sans-serif; color: var(--text-muted); background: var(--bg-white); line-height: 1.6; overflow-x: hidden; }
h1, h2, h3, h4, h5, h6 { font-family: 'Cormorant Garamond', serif; color: var(--text-dark); line-height: 1.1; font-weight: 600; }
a { text-decoration: none; color: inherit; transition: 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
img { max-width: 100%; display: block; }
ul, ol { list-style: none; }

.container { max-width: 1400px; margin: 0 auto; padding: 0 2rem; position: relative; z-index: 10; }
.section { padding: 8rem 0; }
.bg-gray { background: var(--bg-gray); }
.bg-black { background: var(--bg-black); color: #fff; }
.bg-black h1, .bg-black h2, .bg-black h3, .bg-black h4, .bg-black h5, .bg-black h6 { color: #fff; }
.bg-black .text-muted { color: #a0a0a0; }

.btn { display: inline-flex; align-items: center; justify-content: center; gap: 1rem; padding: 1.25rem 3rem; font-weight: 500; font-size: 0.85rem; cursor: pointer; transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); font-family: 'Montserrat', sans-serif; text-transform: uppercase; letter-spacing: 2px; }
.btn-primary { background: var(--text-dark); color: #fff; border: 1px solid var(--text-dark); }
.btn-primary:hover { background: #fff; color: var(--text-dark); }
.btn-outline { background: transparent; border: 1px solid var(--text-dark); color: var(--text-dark); }
.btn-outline:hover { background: var(--text-dark); color: #fff; }
.bg-black .btn-primary { background: #fff; color: #000; border-color: #fff; }
.bg-black .btn-primary:hover { background: transparent; color: #fff; }
.bg-black .btn-outline { border-color: rgba(255,255,255,0.2); color: #fff; }
.bg-black .btn-outline:hover { background: #fff; color: #000; }

.sec-title { margin-bottom: 4rem; display: flex; flex-direction: column; align-items: flex-start; }
.sec-title h2 { font-size: 3.5rem; margin-bottom: 1.5rem; }
.sec-title p { font-size: 1.1rem; max-width: 600px; line-height: 1.8; }
.sec-title.center { align-items: center; text-align: center; }
.eyebrow { display: inline-block; font-family: 'Montserrat', sans-serif; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 3px; color: var(--primary); margin-bottom: 1rem; }

/* 1. Header */
.pl10-header { position: absolute; top: 0; left: 0; width: 100%; z-index: 100; padding: 2rem 0; background: linear-gradient(to bottom, rgba(0,0,0,0.5), transparent); }
.pl10-header-inner { display: flex; justify-content: space-between; align-items: center; }
.pl10-logo { font-family: 'Cormorant Garamond', serif; font-weight: 700; font-size: 2rem; color: #fff; letter-spacing: 1px; }
.pl10-logo img { max-height: 45px; width: auto; object-fit: contain; filter: brightness(0) invert(1); }
.pl10-nav { display: flex; gap: 3rem; }
.pl10-nav a { font-size: 0.8rem; font-weight: 500; text-transform: uppercase; letter-spacing: 2px; color: #fff; opacity: 0.8; }
.pl10-nav a:hover { opacity: 1; }
.pl10-header-btn { padding: 0.8rem 2rem; border: 1px solid rgba(255,255,255,0.3); color: #fff; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 2px; }
.pl10-header-btn:hover { background: #fff; color: #000; }

/* 2. Hero */
.pl10-hero { height: 100vh; min-height: 800px; display: flex; align-items: center; position: relative; }
.pl10-hero-bg { position: absolute; inset: 0; background-image: url('https://images.unsplash.com/photo-1600566752355-35792bedcfea?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80'); background-size: cover; background-position: center; }
.pl10-hero-bg::after { content: ''; position: absolute; inset: 0; background: rgba(0,0,0,0.4); }
.pl10-hero-content { position: relative; z-index: 2; max-width: 800px; color: #fff; margin-top: 5rem; }
.pl10-hero-content h1 { font-size: 5.5rem; margin-bottom: 2rem; font-weight: 400; font-style: italic; color: #fff; }
.pl10-hero-content p { font-size: 1.1rem; margin-bottom: 3rem; font-weight: 300; letter-spacing: 1px; max-width: 600px; line-height: 1.8; opacity: 0.9; }
.pl10-hero-actions { display: flex; gap: 1.5rem; }

/* 3. Partners */
.pl10-partners { padding: 4rem 0; border-bottom: 1px solid var(--border); }
.pl10-partners p { text-align: center; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 3px; margin-bottom: 2rem; }
.pl10-partner-logos { display: flex; justify-content: center; gap: 5rem; align-items: center; flex-wrap: wrap; opacity: 0.4; filter: grayscale(100%); transition: 0.4s; }
.pl10-partner-logos:hover { opacity: 0.7; }
.pl10-partner-logos svg { height: 30px; width: auto; color: var(--text-dark); }

/* 4. Elite Services */
.pl10-services-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1px; background: var(--border); border: 1px solid var(--border); }
.pl10-service-item { background: var(--bg-white); display: flex; flex-direction: column; position: relative; group; }
.pl10-service-img { width: 100%; aspect-ratio: 16/10; overflow: hidden; position: relative; }
.pl10-service-img img { width: 100%; height: 100%; object-fit: cover; transition: 1s cubic-bezier(0.16, 1, 0.3, 1); }
.pl10-service-item:hover .pl10-service-img img { transform: scale(1.05); }
.pl10-service-content { padding: 4rem; }
.pl10-service-content h3 { font-size: 2.2rem; margin-bottom: 1rem; }
.pl10-service-content p { font-size: 0.95rem; margin-bottom: 2rem; line-height: 1.8; }
.pl10-service-link { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; color: var(--text-dark); display: inline-flex; align-items: center; gap: 1rem; }
.pl10-service-link::after { content: ''; width: 30px; height: 1px; background: var(--text-dark); transition: 0.3s; }
.pl10-service-item:hover .pl10-service-link::after { width: 50px; background: var(--primary); }

/* 5. The Difference */
.pl10-diff-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6rem; align-items: center; }
.pl10-diff-img { position: relative; padding-left: 2rem; padding-bottom: 2rem; }
.pl10-diff-img::before { content: ''; position: absolute; bottom: 0; left: 0; width: 80%; height: 80%; background: var(--bg-gray); z-index: -1; }
.pl10-diff-img img { width: 100%; aspect-ratio: 4/5; object-fit: cover; box-shadow: -20px 20px 40px rgba(0,0,0,0.05); }
.pl10-diff-list { margin-top: 3rem; display: flex; flex-direction: column; gap: 2rem; }
.pl10-diff-item { display: flex; gap: 1.5rem; }
.pl10-diff-num { font-family: 'Cormorant Garamond', serif; font-size: 1.5rem; color: var(--primary); font-style: italic; }
.pl10-diff-item h4 { font-family: 'Montserrat', sans-serif; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 0.5rem; }
.pl10-diff-item p { font-size: 0.9rem; }

/* 6. Gallery */
.pl10-gallery-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
.pl10-gallery-item { position: relative; overflow: hidden; aspect-ratio: 1; cursor: pointer; }
.pl10-gallery-item.tall { grid-row: span 2; aspect-ratio: 1/2.05; }
.pl10-gallery-item img { width: 100%; height: 100%; object-fit: cover; transition: 1s cubic-bezier(0.16, 1, 0.3, 1); }
.pl10-gallery-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.5); opacity: 0; display: flex; align-items: center; justify-content: center; transition: 0.4s; }
.pl10-gallery-overlay span { color: #fff; font-family: 'Montserrat', sans-serif; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 2px; font-weight: 500; transform: translateY(20px); transition: 0.4s; }
.pl10-gallery-item:hover img { transform: scale(1.05); }
.pl10-gallery-item:hover .pl10-gallery-overlay { opacity: 1; }
.pl10-gallery-item:hover .pl10-gallery-overlay span { transform: translateY(0); }

/* 7. Packages */
.pl10-packages { display: grid; grid-template-columns: repeat(2, 1fr); gap: 3rem; }
.pl10-pkg-card { border: 1px solid var(--border); padding: 4rem; display: flex; flex-direction: column; transition: 0.4s; }
.pl10-pkg-card:hover { border-color: var(--text-dark); box-shadow: 0 30px 60px rgba(0,0,0,0.05); }
.pl10-pkg-card h3 { font-size: 2.5rem; margin-bottom: 1rem; }
.pl10-pkg-card p { font-size: 0.95rem; margin-bottom: 3rem; }
.pl10-pkg-price { font-family: 'Cormorant Garamond', serif; font-size: 3rem; margin-bottom: 3rem; display: flex; align-items: baseline; gap: 0.5rem; color: var(--text-dark); }
.pl10-pkg-price span { font-family: 'Montserrat', sans-serif; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px; color: var(--text-muted); }
.pl10-pkg-list { margin-bottom: 3rem; flex-grow: 1; }
.pl10-pkg-list li { padding: 1rem 0; border-bottom: 1px solid var(--border); font-size: 0.9rem; }
.pl10-pkg-list li:last-child { border-bottom: none; }

/* 8. Testimonials */
.pl10-testi-wrap { max-width: 900px; margin: 0 auto; text-align: center; }
.pl10-testi-quote { font-family: 'Cormorant Garamond', serif; font-size: 2.5rem; font-style: italic; line-height: 1.4; margin-bottom: 3rem; color: #fff; }
.pl10-testi-author { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; }
.pl10-testi-author h4 { font-family: 'Montserrat', sans-serif; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 2px; }
.pl10-testi-author span { font-size: 0.85rem; font-style: italic; color: #a0a0a0; }

/* 9. Contact */
.pl10-contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0; background: var(--bg-gray); }
.pl10-c-info { padding: 6rem; display: flex; flex-direction: column; justify-content: center; }
.pl10-c-info h2 { font-size: 3rem; margin-bottom: 1.5rem; }
.pl10-c-info p { margin-bottom: 3rem; }
.pl10-c-details { display: flex; flex-direction: column; gap: 2rem; }
.pl10-c-detail-item h4 { font-family: 'Montserrat', sans-serif; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 0.5rem; }
.pl10-c-detail-item p { font-size: 1.1rem; color: var(--text-dark); margin: 0; }
.pl10-form-wrap { padding: 6rem; background: #fff; }
.pl10-form { display: flex; flex-direction: column; gap: 2rem; }
.pl10-fg input, .pl10-fg textarea { width: 100%; background: transparent; border: none; border-bottom: 1px solid var(--border); padding: 1rem 0; font-family: 'Montserrat', sans-serif; font-size: 0.95rem; transition: 0.3s; }
.pl10-fg input:focus, .pl10-fg textarea:focus { outline: none; border-bottom-color: var(--text-dark); }
.pl10-fg input::placeholder, .pl10-fg textarea::placeholder { text-transform: uppercase; letter-spacing: 1px; font-size: 0.75rem; color: #a0a0a0; }

/* 10. FAQ */
.pl10-faq { max-width: 800px; margin: 0 auto; }
.pl10-faq-item { border-bottom: 1px solid var(--border); }
.pl10-faq-item summary { padding: 2rem 0; font-family: 'Cormorant Garamond', serif; font-size: 1.5rem; cursor: pointer; list-style: none; display: flex; justify-content: space-between; align-items: center; }
.pl10-faq-item summary::-webkit-details-marker { display: none; }
.pl10-faq-item summary::after { content: '+'; font-family: 'Montserrat', sans-serif; font-size: 1.25rem; font-weight: 300; transition: 0.3s; }
.pl10-faq-item[open] summary::after { transform: rotate(45deg); }
.pl10-faq-body { padding-bottom: 2rem; font-size: 0.95rem; line-height: 1.8; color: var(--text-muted); }

/* 11. Footer */
.pl10-footer { padding: 6rem 0 3rem; text-align: center; border-top: 1px solid var(--border); }
.pl10-footer-logo { font-family: 'Cormorant Garamond', serif; font-size: 2.5rem; color: var(--text-dark); margin-bottom: 3rem; display: block; }
.pl10-footer-logo img { max-height: 50px; width: auto; object-fit: contain; margin: 0 auto; }
.pl10-footer-links { display: flex; justify-content: center; gap: 3rem; margin-bottom: 4rem; }
.pl10-footer-links a { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 2px; font-weight: 500; }
.pl10-footer-links a:hover { color: var(--text-dark); }
.pl10-footer-bottom { font-size: 0.8rem; color: #a0a0a0; letter-spacing: 1px; }

@media (max-width: 991px) {
  .pl10-hero-content h1 { font-size: 4rem; }
  .pl10-services-grid, .pl10-diff-grid, .pl10-packages, .pl10-contact-grid { grid-template-columns: 1fr; }
  .pl10-nav { display: none; }
  .pl10-c-info, .pl10-form-wrap { padding: 4rem 2rem; }
  .pl10-gallery-grid { grid-template-columns: repeat(2, 1fr); }
  .pl10-gallery-item.tall { grid-row: span 1; aspect-ratio: 1; }
}
@media (max-width: 768px) {
  .pl10-hero-content h1 { font-size: 3rem; }
  .pl10-hero-content p { font-size: 1rem; }
  .pl10-gallery-grid, .pl10-footer-links { flex-direction: column; grid-template-columns: 1fr; gap: 1rem; }
  .sec-title h2 { font-size: 2.5rem; }
  .pl10-testi-quote { font-size: 1.75rem; }
}
`;

export const plumber10Html = `
<!-- 1. Header -->
<header class="pl10-header">
  <div class="container pl10-header-inner">
    <a href="javascript:void(0);" class="pl10-logo">LOGO_PLACEHOLDER</a>

    <a href="javascript:void(0);" class="pl10-header-btn">Consultation</a>
  </div>
</header>

<!-- 2. Hero -->
<section class="pl10-hero">
  <div class="pl10-hero-bg"></div>
  <div class="container pl10-hero-content">
    <span class="eyebrow" style="color: #fff; opacity: 0.7; border-bottom: 1px solid rgba(255,255,255,0.3); padding-bottom: 5px;">Elite Plumbing Architecture</span>
    <h1>Master Craftsmanship for Luxury Homes.</h1>
    <p>We provide discreet, unparalleled plumbing design, installation, and maintenance for exclusive residential estates and high-end commercial properties.</p>
    <div class="pl10-hero-actions">
      <a href="javascript:void(0);" class="btn btn-primary">Request Consultation</a>
      <a href="javascript:void(0);" class="btn btn-outline">View Portfolio</a>
    </div>
  </div>
</section>

<!-- 3. Partners -->
<section class="pl10-partners">
  <div class="container">
    <p>Certified Installers For Premium Brands</p>
    <div class="pl10-partner-logos">
      <svg viewBox="0 0 100 30" fill="currentColor"><path d="M10,15 L20,15 M15,10 L15,20" stroke="currentColor" stroke-width="2"/></svg>
      <svg viewBox="0 0 100 30" fill="currentColor"><circle cx="15" cy="15" r="10" stroke="currentColor" stroke-width="2" fill="none"/></svg>
      <svg viewBox="0 0 100 30" fill="currentColor"><rect x="5" y="5" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"/></svg>
      <svg viewBox="0 0 100 30" fill="currentColor"><polygon points="15,5 25,25 5,25" stroke="currentColor" stroke-width="2" fill="none"/></svg>
    </div>
  </div>
</section>

<!-- 4. Elite Services -->
<section class="section" id="services">
  <div class="container">
    <div class="sec-title">
      <span class="eyebrow">Areas of Expertise</span>
      <h2>Bespoke Plumbing Solutions</h2>
      <p>From architectural blueprints to the final polished fixture, we execute complex plumbing systems with absolute precision.</p>
    </div>
    
    <div class="pl10-services-grid">
      <div class="pl10-service-item hp30-service-row">
        <div class="pl10-service-img">
          <img src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Custom Showers">
        </div>
        <div class="pl10-service-content">
          <h3>Custom Spa & Shower Systems</h3>
          <p>Design and installation of multi-valve body sprays, steam showers, and digital temperature control systems for a true spa experience at home.</p>

        </div>
      </div>
      
      <div class="pl10-service-item hp30-service-row">
        <div class="pl10-service-content">
          <h3>Estate Repiping & Restoration</h3>
          <p>Meticulous restoration of historic estate plumbing systems, ensuring modern functionality without compromising architectural integrity.</p>

        </div>
        <div class="pl10-service-img">
          <img src="https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Estate Repiping">
        </div>
      </div>
      
      <div class="pl10-service-item hp30-service-row">
        <div class="pl10-service-img">
          <img src="https://images.unsplash.com/photo-1620626011761-996317b8d101?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Kitchen Plumbing">
        </div>
        <div class="pl10-service-content">
          <h3>Gourmet Kitchen Plumbing</h3>
          <p>Professional-grade kitchen fixture installations including pot fillers, dual-sink prep stations, and integrated water purification.</p>

        </div>
      </div>
      
      <div class="pl10-service-item hp30-service-row">
        <div class="pl10-service-content">
          <h3>High-Capacity Water Systems</h3>
          <p>Engineering complex water heating arrays and filtration systems designed to supply multi-level homes with endless, pure water.</p>

        </div>
        <div class="pl10-service-img">
          <img src="https://images.unsplash.com/photo-1585704032915-c3400ca199e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Water Systems">
        </div>
      </div>
    </div>
  </div>
</section>

<!-- 5. The Difference -->
<section class="section bg-gray">
  <div class="container pl10-diff-grid">
    <div class="pl10-diff-content">
      <span class="eyebrow">Our Philosophy</span>
      <h2 style="font-size: 3rem; margin-bottom: 1.5rem;">Why Luxury Builders Trust Us.</h2>
      <p style="font-size: 1.1rem; margin-bottom: 2rem;">We understand that working in a luxury environment requires more than just mechanical skill; it requires absolute discretion, impeccable cleanliness, and an eye for design.</p>
      
      <div class="pl10-diff-list">
        <div class="pl10-diff-item">
          <div class="pl10-diff-num">01.</div>
          <div>
            <h4>Architectural Synergy</h4>
            <p>We work directly with your architects and interior designers to ensure plumbing mechanicals never interfere with the visual aesthetic.</p>
          </div>
        </div>
        <div class="pl10-diff-item">
          <div class="pl10-diff-num">02.</div>
          <div>
            <h4>White-Glove Service</h4>
            <p>Our technicians utilize floor protection systems and sterile practices to ensure your property remains immaculate during our presence.</p>
          </div>
        </div>
        <div class="pl10-diff-item">
          <div class="pl10-diff-num">03.</div>
          <div>
            <h4>Discreet Operations</h4>
            <p>We honor NDAs and operate quietly, respecting the privacy and security protocols of high-net-worth households.</p>
          </div>
        </div>
      </div>
    </div>
    <div class="pl10-diff-img">
      <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Luxury Bathroom">
    </div>
  </div>
</section>

<!-- 6. Gallery -->
<section class="section" id="gallery">
  <div class="container">
    <div class="sec-title center">
      <span class="eyebrow">Portfolio</span>
      <h2>Curated Installations</h2>
    </div>
    <div class="pl10-gallery-grid">
      <div class="pl10-gallery-item tall">
        <img src="https://images.unsplash.com/photo-1620626011761-996317b8d101?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Gallery">
        <div class="pl10-gallery-overlay"><span>Brass Kitchen Fixtures</span></div>
      </div>
      <div class="pl10-gallery-item">
        <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Gallery">
        <div class="pl10-gallery-overlay"><span>Marble Master Bath</span></div>
      </div>
      <div class="pl10-gallery-item tall">
        <img src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Gallery">
        <div class="pl10-gallery-overlay"><span>Rain Shower System</span></div>
      </div>
      <div class="pl10-gallery-item">
        <img src="https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Gallery">
        <div class="pl10-gallery-overlay"><span>Estate Repiping</span></div>
      </div>
    </div>
  </div>
</section>

<!-- 7. Packages -->
<section class="section bg-black" id="packages">
  <div class="container">
    <div class="sec-title">
      <span class="eyebrow" style="border-color: rgba(255,255,255,0.3);">Retainer Programs</span>
      <h2>Estate Maintenance</h2>
      <p class="text-muted">Proactive, white-glove plumbing maintenance designed for large properties and multiple residences.</p>
    </div>
    <div class="pl10-packages">
      <div class="pl10-pkg-card">
        <h3>Estate Primary</h3>
        <p class="text-muted">Comprehensive annual maintenance for single large residences.</p>
        <div class="pl10-pkg-price">$2,500<span>/year</span></div>
        <ul class="pl10-pkg-list">
          <li>Bi-annual whole-home fixture inspection</li>
          <li>Water heater array flushing and calibration</li>
          <li>Priority 4-hour emergency response</li>
          <li>Dedicated account manager</li>
        </ul>

      </div>
      <div class="pl10-pkg-card" style="background: rgba(255,255,255,0.05);">
        <h3>Portfolio Elite</h3>
        <p class="text-muted">Designed for clients with multiple luxury properties or vast estates.</p>
        <div class="pl10-pkg-price">$6,000<span>/year</span></div>
        <ul class="pl10-pkg-list">
          <li>Quarterly detailed system audits</li>
          <li>Complete water quality testing and filtration management</li>
          <li>Guaranteed 2-hour emergency response 24/7</li>
          <li>Direct access to Master Plumber via private line</li>
        </ul>

      </div>
    </div>
  </div>
</section>

<!-- 8. Testimonials -->
<section class="section" style="background: url('https://images.unsplash.com/photo-1600566752355-35792bedcfea?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80') center/cover fixed; position: relative;">
  <div style="position: absolute; inset: 0; background: rgba(0,0,0,0.8);"></div>
  <div class="container pl10-testi-wrap position-relative" style="z-index: 2;">
    <div class="pl10-testi-quote">"They completely retrofitted the plumbing in our historic 1920s estate without damaging a single piece of original plaster. Their attention to detail is simply unmatched in the industry."</div>
    <div class="pl10-testi-author">
      <h4>Jonathan C.</h4>
      <span>Architectural Digest Featured Homeowner</span>
    </div>
  </div>
</section>

<!-- 9. Contact -->
<section class="section" id="contact" style="padding: 0;">
  <div class="pl10-contact-grid">
    <div class="pl10-c-info">
      <span class="eyebrow">Connect</span>
      <h2>Request a Private Consultation.</h2>
      <p>We accept new clients on a limited basis to ensure the highest quality of service. Please provide your project details below.</p>
      
      <div class="pl10-c-details">
        <div class="pl10-c-detail-item">
          <h4>Direct Line</h4>
          <p>PHONE_PLACEHOLDER</p>
        </div>
        <div class="pl10-c-detail-item">
          <h4>Private Email</h4>
          <p>EMAIL_PLACEHOLDER</p>
        </div>
        <div class="pl10-c-detail-item">
          <h4>Studio</h4>
          <p>ADDRESS_PLACEHOLDER</p>
        </div>
      </div>
    </div>
    
    <div class="pl10-form-wrap">
      <form class="pl10-form lead-capture-form">
        <div class="pl10-fg">
          <input type="text" name="name" placeholder="Full Name or Representative" required>
        </div>
        <div class="pl10-fg">
          <input type="tel" name="phone" placeholder="Contact Number" required>
        </div>
        <div class="pl10-fg">
          <input type="text" name="address" placeholder="Property Location / Zip Code">
        </div>
        <div class="pl10-fg">
          <textarea name="details" rows="4" placeholder="Briefly Describe Your Project Requirements" required></textarea>
        </div>
        <button type="submit" class="btn btn-primary" style="margin-top: 1rem; width: 100%;">Submit Inquiry</button>
      </form>
    </div>
  </div>
</section>

<!-- 10. FAQ -->
<section class="section">
  <div class="container pl10-faq">
    <div class="sec-title center">
      <span class="eyebrow">Information</span>
      <h2>Client Inquiries</h2>
    </div>
    
    <details class="pl10-faq-item" open>
      <summary>Do you collaborate with external design teams?</summary>
      <div class="pl10-faq-body faq-body">Absolutely. A significant portion of our work involves collaborating with interior designers, architects, and custom home builders to execute their vision flawlessly.</div>
    </details>
    <details class="pl10-faq-item">
      <summary>Do you source custom or imported fixtures?</summary>
      <div class="pl10-faq-body faq-body">Yes. We have established relationships with European manufacturers and boutique fixture artisans, allowing us to source and properly install rare and custom pieces.</div>
    </details>
    <details class="pl10-faq-item">
      <summary>What is your typical project timeline?</summary>
      <div class="pl10-faq-body faq-body">Timelines vary greatly depending on the scope of the estate. Following a consultation, we provide a detailed critical path schedule aligned with your general contractor's timeline.</div>
    </details>
  </div>
</section>

<!-- 11. Footer -->
<footer class="pl10-footer">
  <div class="container">
    <a href="javascript:void(0);" class="pl10-footer-logo">LOGO_PLACEHOLDER</a>
    <div class="pl10-footer-links">
      <a href="javascript:void(0);">Expertise</a>
      <a href="javascript:void(0);">Portfolio</a>
      <a href="javascript:void(0);">Retainers</a>
      <a href="javascript:void(0);">Contact</a>
      <a href="javascript:void(0);">Privacy Policy</a>
    </div>
    <div class="pl10-footer-bottom">
      &copy; 2026 PROJECT_NAME_PLACEHOLDER. EXCLUSIVE PLUMBING ARCHITECTURE.
    </div>
  </div>
</footer>
`;
