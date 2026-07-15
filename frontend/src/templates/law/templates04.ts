export const law04Styles = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter:wght@400;500;600&display=swap');

:root {
  --primary: PRIMARY_COLOR_PLACEHOLDER;
  --secondary: SECONDARY_COLOR_PLACEHOLDER;
  --primary-rgb: PRIMARY_RGB_PLACEHOLDER;
  --secondary-rgb: SECONDARY_RGB_PLACEHOLDER;
  --bg-light: #fdfdfd;
  --text-dark: #1f1f1f;
  --text-muted: #64748b;
  --border-light: #f1f5f9;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

body { 
  font-family: 'Inter', sans-serif; 
  color: var(--text-dark); 
  background-color: var(--bg-light); 
  line-height: 1.6; 
  overflow-x: hidden;
}

h1, h2, h3, h4, h5, h6 { 
  font-family: 'Playfair Display', serif; 
  font-weight: 600; 
  line-height: 1.2; 
  color: var(--primary);
}

.container { max-width: 1200px; margin: 0 auto; padding: 0 1.5rem; position: relative; z-index: 10; }
img { max-width: 100%; display: block; }
a { text-decoration: none; color: inherit; transition: 0.3s; }

/* Buttons */
.btn { 
  display: inline-flex; flex-wrap: wrap; 
  align-items: center; 
  justify-content: center; 
  padding: 0.875rem 2rem; 
  border-radius: 4px; 
  font-weight: 500; 
  font-size: 0.95rem; 
  transition: all 0.3s ease; 
  cursor: pointer; 
  border: none; 
}
.btn-primary { 
  background-color: var(--secondary); 
  color: #fff; 
}
.btn-primary:hover { background-color: #c48b47; transform: translateY(-2px); }

/* Header */
.header { padding: 1.5rem 0; background: var(--primary); position: relative; z-index: 50; }
.header-inner { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; }
.logo { font-size: 1.5rem; font-family: 'Playfair Display', serif; display: flex; flex-wrap: wrap; align-items: center; gap: 10px; color: #fff; }
.logo svg { width: 28px; height: 28px; color: var(--secondary); }
.header-nav { display: flex; gap: 2rem; }
.header-nav a { color: #fff; font-size: 0.9rem; }
.header-nav a:hover { color: var(--secondary); }

/* Hero */
.hero { background: var(--primary); padding: 4rem 0 6rem; position: relative; }
.hero-inner { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; }
.hero-content h1 { font-size: 4rem; margin-bottom: 1.5rem; color: #fff; }
.hero-content p { font-size: 1.1rem; color: rgba(255, 255, 255, 0.8); margin-bottom: 2.5rem; max-width: 90%; }
.hero-badge { color: var(--secondary); text-transform: uppercase; font-size: 0.8rem; font-weight: 600; letter-spacing: 1px; margin-bottom: 1rem; display: block; }

.hero-visual { position: relative; display: flex; gap: 1rem; }
.hero-img-col { display: flex; flex-direction: column; gap: 1rem; }
.hero-img-main { width: 60%; object-fit: cover; border-radius: 4px; }
.hero-img-sub { width: 100%; object-fit: cover; border-radius: 4px; height: 180px; }
.hero-stats-card { position: absolute; top: -30px; right: -30px; background: #fff; padding: 1.5rem; border-radius: 4px; display: flex; gap: 2rem; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
.stat-box { text-align: center; }
.stat-box h4 { color: var(--primary); font-size: 1.5rem; margin-bottom: 0.2rem; }
.stat-box p { font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase; }

/* Section 2: Split */
.split-section { padding: 6rem 0; background: var(--bg-light); }
.split-inner { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; }
.split-visual { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
.split-visual img { width: 100%; border-radius: 4px; object-fit: cover; }
.split-visual-card { background: var(--primary); padding: 2rem; border-radius: 4px; color: #fff; text-align: center; display: flex; flex-direction: column; justify-content: center; }
.split-visual-card h3 { color: #fff; font-size: 2rem; margin-bottom: 0.5rem; }
.split-visual-card p { color: var(--secondary); text-transform: uppercase; font-size: 0.8rem; }
.split-content h2 { font-size: 3rem; margin-bottom: 1.5rem; }
.split-content p { color: var(--text-muted); margin-bottom: 2rem; }

/* Section 3: Lawyers Grid */
.lawyers-section { padding: 6rem 0; background: #fff; }
.section-header { text-align: center; margin-bottom: 4rem; }
.section-header h2 { font-size: 3rem; margin-bottom: 1rem; }
.section-header .badge { color: var(--secondary); text-transform: uppercase; font-size: 0.8rem; font-weight: 600; letter-spacing: 1px; display: block; margin-bottom: 1rem; }
.lawyers-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }
.lawyer-card { position: relative; border-radius: 4px; overflow: hidden; border: 1px solid var(--border-light); transition: 0.3s; }
.lawyer-card img { width: 100%; height: 350px; object-fit: cover; transition: 0.5s; }
.lawyer-card-info { position: absolute; bottom: 0; left: 0; right: 0; background: var(--primary); padding: 1.5rem; text-align: center; transition: 0.3s; }
.lawyer-card-info h4 { color: #fff; margin-bottom: 0.2rem; font-size: 1.2rem; }
.lawyer-card-info p { color: var(--secondary); font-size: 0.9rem; }
.lawyer-card:hover { border-color: var(--primary); box-shadow: 0 10px 25px rgba(0,0,0,0.1); }
.lawyer-card:hover img { transform: scale(1.05); }
.lawyer-card:hover .lawyer-card-info { padding-bottom: 2rem; }

/* Section 4: Victory / Testimonial Split */
.victory-section { padding: 6rem 0; background: var(--bg-light); }
.victory-inner { display: grid; grid-template-columns: 1fr 1.5fr; gap: 4rem; align-items: center; }
.victory-img img { width: 100%; border-radius: 4px; }
.victory-quote { background: var(--secondary); padding: 3rem; border-radius: 4px; color: #fff; position: relative; }
.victory-quote::before { content: "\\201C"; font-family: 'Playfair Display', serif; font-size: 8rem; position: absolute; top: -20px; left: 20px; opacity: 0.2; line-height: 1; }
.victory-quote p.quote-text { font-size: 1.2rem; font-style: italic; margin-bottom: 2rem; position: relative; z-index: 2; line-height: 1.8; }
.quote-author { display: flex; align-items: center; gap: 1rem; }
.quote-author img { width: 50px; height: 50px; border-radius: 50%; object-fit: cover; }
.quote-author h5 { color: #fff; margin: 0; font-size: 1.1rem; }
.quote-author span { font-size: 0.8rem; opacity: 0.8; }

/* Section 5: Support Cards */
.support-section { padding: 6rem 0; background: #fff; }
.support-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }
.support-card { background: var(--bg-light); padding: 2.5rem 2rem; border-radius: 4px; border-top: 4px solid var(--primary); border-left: 1px solid var(--border-light); border-right: 1px solid var(--border-light); border-bottom: 1px solid var(--border-light); text-align: center; transition: 0.3s; }
.support-card:hover { transform: translateY(-5px); box-shadow: 0 10px 30px rgba(0,0,0,0.05); border-color: var(--primary); }
.support-card h3 { font-size: 1.5rem; margin-bottom: 1rem; }
.support-card p { color: var(--text-muted); font-size: 0.95rem; }

/* Section 6: Testimonials */
.testimonials-section { padding: 6rem 0; background: var(--bg-light); }
.testimonial-card { background: #fff; padding: 3rem; border-radius: 4px; box-shadow: 0 5px 20px rgba(0,0,0,0.05); border: 1px solid var(--border-light); transition: 0.3s; height: auto; }
.testimonial-card:hover { border-color: var(--primary); transform: translateY(-5px); box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
.stars { color: var(--secondary); margin-bottom: 1.5rem; letter-spacing: 2px; }
.testimonial-card p { font-style: italic; color: var(--text-muted); margin-bottom: 2rem; line-height: 1.8; }
.testimonial-author { display: flex; align-items: center; gap: 1rem; }
.testimonial-author img { width: 50px; height: 50px; border-radius: 50%; object-fit: cover; border: 2px solid var(--border-light); }
.testimonial-author h5 { color: var(--primary); margin: 0; font-size: 1.1rem; }
.testimonial-author span { color: var(--text-muted); font-size: 0.85rem; }

/* Swiper Pagination Styles */
.swiper-pagination { position: relative !important; margin-top: 2rem; display: flex; justify-content: center; align-items: center; gap: 8px; }
.swiper-pagination-bullet { width: 12px !important; height: 12px !important; background: var(--border-light) !important; opacity: 1 !important; border-radius: 50% !important; transition: 0.3s; margin: 0 !important; cursor: pointer; }
.swiper-pagination-bullet:hover { background: var(--secondary) !important; }
.swiper-pagination-bullet-active { background: var(--primary) !important; width: 30px !important; border-radius: 6px !important; }

/* Section 7: Blog */
.blog-section { padding: 6rem 0; background: #fff; }
.blog-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }
.blog-card { border: 1px solid var(--border-light); border-radius: 4px; overflow: hidden; transition: 0.3s; }
.blog-card:hover { border-color: var(--primary); transform: translateY(-3px); box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
.blog-card img { width: 100%; height: 220px; object-fit: cover; transition: 0.5s; }
.blog-card:hover img { transform: scale(1.05); }
.blog-card-content { padding: 2rem; background: #fff; position: relative; }
.blog-meta { color: var(--secondary); font-size: 0.8rem; text-transform: uppercase; font-weight: 600; margin-bottom: 0.5rem; display: block; }
.blog-card h3 { font-size: 1.3rem; margin-bottom: 1rem; line-height: 1.4; }
.blog-card p { color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1.5rem; }
.read-more { color: var(--primary); font-weight: 600; font-size: 0.9rem; border-bottom: 1px solid var(--primary); padding-bottom: 2px; }

/* Section 8: Contact */
.contact-section { padding: 6rem 0; background: var(--bg-light); }
.contact-inner { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; }
.contact-form { background: #fff; padding: 3rem; border-radius: 4px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
.form-group { margin-bottom: 1.5rem; }
.form-group input, .form-group textarea { width: 100%; padding: 1rem; border: 1px solid var(--border-light); border-radius: 4px; font-family: inherit; outline: none; }
.form-group input:focus, .form-group textarea:focus { border-color: var(--secondary); }
.form-group textarea { height: 120px; resize: none; }
.contact-img img { width: 100%; border-radius: 4px; object-fit: cover; height: 500px; }

/* Footer */
.footer { background: var(--primary); padding: 4rem 0 2rem; color: #fff; }
.footer-inner { display: grid; grid-template-columns: 2fr 1fr 1fr 1.5fr; gap: 4rem; margin-bottom: 3rem; }
.footer-logo { font-size: 1.8rem; font-family: 'Playfair Display', serif; display: flex; align-items: center; gap: 10px; margin-bottom: 1.5rem; }
.footer-logo svg { color: var(--secondary); width: 32px; height: 32px; }
.footer-col h4 { font-size: 1.2rem; margin-bottom: 1.5rem; color: #fff; }
.footer-links { list-style: none; }
.footer-links li { margin-bottom: 0.8rem; }
.footer-links a { color: rgba(255,255,255,0.7); font-size: 0.9rem; }
.footer-links a:hover { color: var(--secondary); }
.footer-bottom { border-top: 1px solid rgba(255,255,255,0.1); padding-top: 2rem; text-align: center; color: rgba(255,255,255,0.6); font-size: 0.9rem; }

@media (max-width: 992px) {
  .hero-inner, .split-inner, .victory-inner, .contact-inner { grid-template-columns: 1fr; }
  .lawyers-grid, .support-grid, .blog-grid { grid-template-columns: repeat(2, 1fr); }
  .footer-inner { grid-template-columns: 1fr 1fr; }
}

@media (max-width: 768px) {
  .hero-content h1 { font-size: 2.2rem; }
  .section-header h2 { font-size: 2rem; }
  .lawyers-grid, .support-grid, .blog-grid, .testimonials-grid { grid-template-columns: 1fr; }
  .hero-stats-card { position: relative; top: 0; right: 0; margin-top: 2rem; flex-direction: column; text-align: center; align-items: center; width: 100%; }
  .split-visual-card { position: relative; right: auto; bottom: auto; margin-top: 2rem; width: 100%; }
  .footer-inner { grid-template-columns: 1fr; gap: 2rem; }
  .contact-form { padding: 1.5rem; }
  .deco-circle-bg { transform: scale(0.5); opacity: 0.02; transform-origin: center; }
  .deco-swoosh { transform: scale(0.7); }
  .hero-visual { flex-wrap: wrap; }
  .hero-visual > img, .hero-visual > div { width: 100%; }
}

/* Decorative Elements */
.pos-rel { position: relative; }
.deco-sparkle { position: absolute; pointer-events: none; z-index: 10; opacity: 0.8; stroke: var(--secondary); stroke-width: 2.5; stroke-linecap: round; fill: none; }
.deco-sparkle-1 { top: -25px; left: -15px; width: 36px; height: 36px; animation: floaty 4s ease-in-out infinite; }
.deco-sparkle-2 { bottom: 10px; right: -25px; width: 30px; height: 30px; transform: rotate(45deg); animation: floaty 5s ease-in-out infinite; }
.deco-swoosh { position: absolute; pointer-events: none; z-index: 0; stroke: var(--secondary); stroke-width: 2; stroke-linecap: round; fill: none; opacity: 0.6; }
.deco-swoosh-1 { bottom: -10px; left: 0; width: 140px; height: 20px; stroke-dasharray: 6 4; }
.icon-wrap { position: relative; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 1rem; }
.icon-sparks { position: absolute; top: -15px; left: 50%; transform: translateX(-50%); width: 28px; height: 28px; stroke: var(--secondary); stroke-width: 2.5; stroke-linecap: round; fill: none; }
@keyframes floaty { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
@keyframes spin-slow { 100% { transform: rotate(360deg); } }
.deco-bg-dots { position: absolute; pointer-events: none; z-index: 0; }
.deco-wave { position: absolute; pointer-events: none; z-index: 0; stroke: var(--primary); stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; fill: none; opacity: 0.4; }
.deco-circle-bg { position: absolute; pointer-events: none; z-index: 0; fill: var(--primary); opacity: 0.03; border-radius: 50%; }
.deco-asterisk { position: absolute; pointer-events: none; z-index: 10; stroke: var(--secondary); stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; fill: none; animation: spin-slow 15s linear infinite; }
/* Tabs Section */
.tabs-section { padding: 6rem 0; background: linear-gradient(135deg, rgba(var(--secondary-rgb), 0.05) 0%, rgba(var(--primary-rgb), 0.02) 100%); position: relative; overflow: hidden; }
.tabs-header { text-align: center; max-width: 750px; margin: 0 auto 4rem; }
.tabs-header h2 { font-size: 2.8rem; margin-bottom: 1rem; }
.tabs-header p { color: var(--text-muted); font-size: 1.1rem; margin-top: 1rem; }

.tabs-container { display: grid; grid-template-columns: 1fr 1.5fr; gap: 3rem; align-items: start; max-width: 1000px; margin: 0 auto; z-index: 2; position: relative; }
.tab-list { display: flex; flex-wrap: wrap; flex-direction: column; gap: 1rem; }
.tab-item { background: #fff; padding: 1.25rem 1.5rem; border-radius: 8px; display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; font-weight: 600; cursor: pointer; transition: 0.3s; box-shadow: 0 4px 10px rgba(0,0,0,0.02); }
.tab-item:hover { background: rgba(0,0,0,0.02); }
.tab-icon { width: 28px; height: 28px; border-radius: 50%; border: 1px solid rgba(0,0,0,0.1); display: inline-flex; flex-wrap: wrap; justify-content: center; align-items: center; transition: 0.3s; color: inherit; }
.tab-content-box { display: none; background: #fff; padding: 2.5rem; border-radius: 16px; box-shadow: 0 10px 40px rgba(0,0,0,0.05); }

/* Published Mode (JS Tabs) */
body.js-enabled .tab-content-box.active { display: block; animation: tabFadeIn 0.4s ease-out; }
body.js-enabled .tab-item.active, .tab-item.active { background: var(--primary) !important; color: #ffffff !important; }
body.js-enabled .tab-item.active .tab-icon, .tab-item.active .tab-icon { border-color: transparent; background: rgba(255,255,255,0.2); transform: rotate(90deg); color: #ffffff !important; }

/* Fallback if active class is missing */
body.js-enabled .tab-content-wrapper:not(:has(.tab-content-box.active)) .tab-content-box:first-child { display: block; animation: tabFadeIn 0.4s ease-out; }
body.js-enabled .tab-list:not(:has(.tab-item.active)) .tab-item:first-child { background: var(--primary); color: #fff; }
body.js-enabled .tab-list:not(:has(.tab-item.active)) .tab-item:first-child .tab-icon { border-color: transparent; background: rgba(255,255,255,0.2); transform: rotate(90deg); }

/* Editor Mode Horizontal Scroll (When JS is disabled in GrapesJS) */
body:not(.js-enabled) .tab-content-wrapper {
  display: flex!important; flex-wrap: wrap;
  overflow-x: auto !important;
  gap: 2rem;
  padding-bottom: 1rem;
  scroll-snap-type: x mandatory;
}
body:not(.js-enabled) .tab-content-box {
  display: block !important;
  flex: 0 0 100% !important;
  min-width: 100%;
  scroll-snap-align: center;
}
body:not(.js-enabled) .tab-content-wrapper::-webkit-scrollbar { height: 8px; }
body:not(.js-enabled) .tab-content-wrapper::-webkit-scrollbar-thumb { background: var(--primary); border-radius: 4px; }

@keyframes tabFadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

.tab-content-box h3 { font-size: 1.8rem; margin-bottom: 1rem; }
.tab-content-box p { color: var(--text-muted); margin-bottom: 1.5rem; }
.tab-content-box img { width: 100%; height: 240px; object-fit: cover; border-radius: 8px; margin-bottom: 1.5rem; }
.link-primary { color: var(--primary); font-weight: 600; display: inline-flex; flex-wrap: wrap; align-items: center; gap: 5px; }
.link-primary:hover { gap: 8px; }

.tabs-action { text-align: center; margin-top: 3rem; position: relative; z-index: 2; }

`;

export const law04Html = `
<!-- Swiper Assets for Published Page -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" />
<script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
<header class="header">
  <div class="container header-inner">
    <a href="#" class="logo">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
      PROJECT_NAME_PLACEHOLDER
    </a>
   
  </div>
</header>

<section class="hero">
  <div class="container hero-inner">
    <div class="hero-content">
      <span class="hero-badge">Law Professionals</span>
      <div class="pos-rel" style="display:inline-block;">
        <h1>Restoring Lives, Divorce And Law Professionals</h1>
        <svg class="deco-sparkle deco-sparkle-1" viewBox="0 0 24 24"><path d="M12 2v6M5 7l4 4M19 7l-4 4"/></svg>
        <svg class="deco-sparkle deco-sparkle-2" viewBox="0 0 24 24"><path d="M12 2v6M5 7l4 4M19 7l-4 4"/></svg>
        <svg class="deco-swoosh deco-swoosh-1" viewBox="0 0 100 20"><path d="M0 15 Q 50 -5 100 15"/></svg>
      </div>
      <p>Providing expert legal guidance and compassionate support during your most challenging times. We stand by you.</p>
      <a href="#contact" class="btn btn-primary">Book Consultation</a>
    </div>
    
    <div class="hero-visual">
      <img src="/assets/templates/LawFirm/templates03/hero-lawyer.jpg" class="hero-img-main" alt="Lawyer Consulting">
      <div class="hero-img-col">
        <img src="/assets/templates/LawFirm/templates02/hero.jpg" class="hero-img-sub" alt="Client Discussion">
        <img src="/assets/templates/LawFirm/templates03/justice.jpg" class="hero-img-sub" alt="Legal Documents">
      </div>
      
      <div class="hero-stats-card">
        <div class="stat-box pos-rel">
          <svg class="deco-sparkle" style="top:-15px; left:-10px; width:20px; height:20px;" viewBox="0 0 24 24"><path d="M12 2v6M5 7l4 4M19 7l-4 4"/></svg>
          <h4>$25B+</h4>
          <p>Recovered</p>
        </div>
        <div class="stat-box pos-rel">
          <svg class="deco-sparkle" style="top:-10px; right:-15px; width:24px; height:24px;" viewBox="0 0 24 24"><path d="M12 2v6M5 7l4 4M19 7l-4 4"/></svg>
          <h4>250+</h4>
          <p>Successful Cases</p>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="split-section" id="about" style="position:relative; overflow:hidden;">
  <svg class="deco-circle-bg" style="top:-100px; left:-100px; width:300px; height:300px;" viewBox="0 0 200 200"><circle cx="100" cy="100" r="100"/></svg>
  <div class="container split-inner pos-rel">
    <svg class="deco-bg-dots" style="top:-20px; right:10px; width:80px; height:80px;" viewBox="0 0 100 100">
      <pattern id="dots1" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><circle fill="var(--secondary)" cx="2" cy="2" r="2" opacity="0.4"></circle></pattern>
      <rect x="0" y="0" width="100" height="100" fill="url(#dots1)"></rect>
    </svg>
    <div class="split-visual">
      <img src="/assets/templates/LawFirm/templates03/hero-lawyer.jpg" alt="Attorney at desk">
      <img src="/assets/templates/LawFirm/templates03/justice.jpg" alt="Consultation">
      <div class="split-visual-card pos-rel">
        <svg class="deco-sparkle" style="top:10px; left:10px; width:30px; height:30px;" viewBox="0 0 24 24"><path d="M12 2v6M5 7l4 4M19 7l-4 4"/></svg>
        <svg class="deco-sparkle" style="bottom:10px; right:10px; width:30px; height:30px; transform:rotate(180deg);" viewBox="0 0 24 24"><path d="M12 2v6M5 7l4 4M19 7l-4 4"/></svg>
        <h3>15+</h3>
        <p>Years of Excellence</p>
      </div>
      <img src="/assets/templates/LawFirm/templates03/hero-lawyer.jpg" alt="Law Book">
    </div>
    <div class="split-content">
      <span class="hero-badge" style="color:var(--primary);">About Us</span>
      <h2>Experienced Divorce Lawyers By Your Side</h2>
      <p>Navigating family law matters requires a delicate balance of compassion and assertive legal strategy. Our experienced attorneys are dedicated to protecting your interests and achieving the best possible outcome for you and your family.</p>
      <p>We understand that every case is unique. That's why we take the time to listen, understand your goals, and develop a customized legal approach tailored to your specific needs.</p>
      <a href="#services" class="btn btn-primary" style="margin-top:1rem;">Learn More</a>
    </div>
  </div>
</section>

<section class="lawyers-section" id="attorneys" style="position:relative; overflow:hidden;">
  <svg class="deco-circle-bg" style="bottom:-50px; right:-100px; width:400px; height:400px;" viewBox="0 0 200 200"><circle cx="100" cy="100" r="100"/></svg>
  <div class="container">
    <div class="section-header pos-rel">
      <svg class="deco-asterisk" style="top:-10px; left:-30px; width:32px; height:32px;" viewBox="0 0 24 24"><path d="M12 2v20M2 12h20M4.9 4.9l14.2 14.2M4.9 19.1l14.2-14.2"/></svg>
      <span class="badge" style="color:var(--primary);">Our Team</span>
      <h2>Experienced Divorce Lawyers By Your Side</h2>
    </div>
    <div class="lawyers-grid">
      <div class="lawyer-card">
        <img src="/assets/templates/LawFirm/templates02/lawyer1.jpg" alt="Lawyer">
        <div class="lawyer-card-info">
          <h4>Robert Mitchell</h4>
          <p>Senior Partner</p>
        </div>
      </div>
      <div class="lawyer-card">
        <img src="/assets/templates/LawFirm/templates02/lawyer2.jpg" alt="Lawyer">
        <div class="lawyer-card-info">
          <h4>Sarah Jenkins</h4>
          <p>Family Law Specialist</p>
        </div>
      </div>
      <div class="lawyer-card">
        <img src="/assets/templates/LawFirm/templates02/lawyer3.jpg" alt="Lawyer">
        <div class="lawyer-card-info">
          <h4>David Chen</h4>
          <p>Trial Attorney</p>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="victory-section">
  <div class="container victory-inner">
    <div class="victory-img">
      <img src="/assets/templates/LawFirm/templates03/justice.jpg" alt="Legal Team">
    </div>
    <div class="victory-content">
      <span class="hero-badge" style="color:var(--primary);">Success Stories</span>
      <h2 style="font-size:3rem; margin-bottom:2rem;">Legal Victory Starts Here</h2>
      <div class="victory-quote">
        <p class="quote-text">"They guided me through the most difficult time of my life with profound empathy and unmatched legal expertise. I couldn't have asked for better representation during my divorce proceedings."</p>
        <div class="quote-author">
          <img src="/assets/templates/LawFirm/templates01/image1.jpg" alt="Client">
          <div>
            <h5>Emily Parker</h5>
            <span>Former Client</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="support-section" id="services">
  <div class="container">
    <div class="section-header">
      <span class="badge" style="color:var(--primary);">Services</span>
      <h2>Support in Every Case</h2>
    </div>
    <div class="support-grid">
      <div class="support-card">
        <div class="icon-wrap">
          <svg class="icon-sparks" viewBox="0 0 24 24"><path d="M12 2v6M5 7l4 4M19 7l-4 4"/></svg>
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
        </div>
        <h3>Child Support</h3>
        <p>Ensuring fair and adequate support arrangements that prioritize the well-being and future of your children.</p>
      </div>
      <div class="support-card">
        <div class="icon-wrap">
          <svg class="icon-sparks" viewBox="0 0 24 24"><path d="M12 2v6M5 7l4 4M19 7l-4 4"/></svg>
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        </div>
        <h3>Legal Representation</h3>
        <p>Fierce advocacy in the courtroom and strategic negotiation at the settlement table to protect your rights.</p>
      </div>
      <div class="support-card">
        <div class="icon-wrap">
          <svg class="icon-sparks" viewBox="0 0 24 24"><path d="M12 2v6M5 7l4 4M19 7l-4 4"/></svg>
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        </div>
        <h3>Complicated Divorces</h3>
        <p>Expert handling of high-net-worth divorces, complex asset division, and contentious separation agreements.</p>
      </div>
    </div>
  </div>
</section>

<section class="testimonials-section" style="position:relative;">
  <div class="container">
    <div class="section-header pos-rel">
      <svg class="deco-wave" style="top:-30px; left:50%; transform:translateX(-50%); width:80px; height:20px;" viewBox="0 0 100 20"><path d="M0 10 Q 12.5 0, 25 10 T 50 10 T 75 10 T 100 10"/></svg>
      <span class="badge" style="color:var(--primary);">Testimonials</span>
      <h2>Real Stories, Real Results</h2>
    </div>
    <div data-gjs-type="swiper-container" class="swiper-container slider" data-slides-per-view="1" data-pagination="bullets" style="padding:20px; overflow:hidden;">
      <div data-gjs-type="swiper-wrapper" class="swiper-wrapper">
        <div data-gjs-type="swiper-slide" class="swiper-slide testimonial-card">
          <div class="stars">★★★★★</div>
          <p>"I was overwhelmed by the legal process, but this firm broke everything down step-by-step. They fought tirelessly for my fair share of the business assets."</p>
          <div class="testimonial-author">
            <img src="/assets/templates/LawFirm/templates01/image2.jpg" alt="Client">
            <div>
              <h5>Michael Torres</h5>
              <span>Business Owner</span>
            </div>
          </div>
        </div>
        <div data-gjs-type="swiper-slide" class="swiper-slide testimonial-card">
          <div class="stars">★★★★★</div>
          <p>"The compassion shown by the entire team was incredible. They didn't just see me as a case number; they genuinely cared about my family's future."</p>
          <div class="testimonial-author">
            <img src="/assets/templates/LawFirm/templates01/image3.jpg" alt="Client">
            <div>
              <h5>Amanda Lewis</h5>
              <span>Teacher</span>
            </div>
          </div>
        </div>
        <div data-gjs-type="swiper-slide" class="swiper-slide testimonial-card">
          <div class="stars">★★★★★</div>
          <p>"Absolute professionals. Their strategic approach to our corporate dispute saved us millions. I cannot recommend them enough for complex cases."</p>
          <div class="testimonial-author">
            <img src="/assets/templates/LawFirm/templates01/image4.jpg" alt="Client">
            <div>
              <h5>Robert Vance</h5>
              <span>CEO, Vanguard Tech</span>
            </div>
          </div>
        </div>
      </div>
      <div data-gjs-type="swiper-pagination" class="swiper-pagination"></div>
    </div>
  </div>
</section>

<section class="blog-section">
  <div class="container">
    <div class="section-header">
      <span class="badge" style="color:var(--primary);">Insights</span>
      <h2>Our Latest Blog Post</h2>
    </div>
    <div class="blog-grid">
      <div class="blog-card">
        <img src="/assets/templates/LawFirm/templates01/image5.jpg" alt="Blog Post">
        <div class="blog-card-content">
          <span class="blog-meta">Divorce Law</span>
          <h3>Everything You Need to Know About Child Custody</h3>
          <p>Understanding the factors courts consider when determining custody arrangements...</p>
          <a href="#" class="read-more">Read More</a>
        </div>
      </div>
      <div class="blog-card">
        <img src="/assets/templates/LawFirm/templates01/image6.jpg" alt="Blog Post">
        <div class="blog-card-content">
          <span class="blog-meta">Asset Division</span>
          <h3>How Business Assets Are Divided in a Divorce</h3>
          <p>A comprehensive guide to protecting your business interests during separation...</p>
          <a href="#" class="read-more">Read More</a>
        </div>
      </div>
      <div class="blog-card">
        <img src="/assets/templates/LawFirm/templates01/image7.jpg" alt="Blog Post">
        <div class="blog-card-content">
          <span class="blog-meta">Legal Advice</span>
          <h3>5 Common Mistakes to Avoid During Proceedings</h3>
          <p>Protect yourself by avoiding these frequent pitfalls in family law cases...</p>
          <a href="#" class="read-more">Read More</a>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="contact-section" id="contact" style="position:relative; overflow:hidden;">
  <svg class="deco-bg-dots" style="bottom:40px; right:40px; width:120px; height:120px;" viewBox="0 0 100 100">
    <pattern id="dots2" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><circle fill="var(--secondary)" cx="2" cy="2" r="2" opacity="0.3"></circle></pattern>
    <rect x="0" y="0" width="100" height="100" fill="url(#dots2)"></rect>
  </svg>
  <div class="container contact-inner pos-rel">
    <svg class="deco-asterisk" style="top:20px; right:20px; width:40px; height:40px;" viewBox="0 0 24 24"><path d="M12 2v20M2 12h20M4.9 4.9l14.2 14.2M4.9 19.1l14.2-14.2"/></svg>
    <div>
      <span class="badge" style="color:var(--primary); text-transform:uppercase; font-size:0.8rem; font-weight:600; margin-bottom:1rem; display:block;">Contact Us</span>
      <h2 style="font-size:3rem; margin-bottom:1rem;">Get In Touch With Us</h2>
      <p style="color:var(--text-muted); margin-bottom:2rem;">Fill out the form below and one of our legal professionals will get back to you shortly to schedule your consultation.</p>
      
      <form class="contact-form lead-capture-form">
        <div class="form-group">
          <input type="text" placeholder="Full Name" required>
        </div>
        <div class="form-group">
          <input type="email" placeholder="Email Address" required>
        </div>
        <div class="form-group">
          <textarea placeholder="Tell us about your case" required></textarea>
        </div>
        <button type="submit" class="btn btn-primary" style="width:100%;">Submit Request</button>
      </form>
    </div>
    <div class="contact-img">
      <img src="/assets/templates/LawFirm/templates02/hero.jpg" alt="Lawyer on phone">
    </div>
  </div>
</section>

<footer class="footer">
  <div class="container">
    <div class="footer-inner">
      <div class="footer-col">
        <div class="footer-logo">
         <a href="#" class="logo">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            PROJECT_NAME_PLACEHOLDER
          </a>
        
        </div>
        <p style="color:rgba(255,255,255,0.7); font-size:0.9rem;">Dedicated legal professionals providing exceptional representation and compassionate counsel.</p>
      </div>
      <div class="footer-col">
        <h4>Quick Links</h4>
        <ul class="footer-links">
          <li><a href="#about">About Us</a></li>
          <li><a href="#services">Practice Areas</a></li>
          <li><a href="#attorneys">Our Attorneys</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Legal</h4>
        <ul class="footer-links">
          <li><a href="#">Privacy Policy</a></li>
          <li><a href="#">Terms of Service</a></li>
          <li><a href="#">Disclaimer</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Contact</h4>
        <ul class="footer-links">
          <li>ADDRESS_PLACEHOLDER</li>
          <li>PHONE_PLACEHOLDER</li>
          <li>EMAIL_PLACEHOLDER</li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; 2026 PROJECT_NAME_PLACEHOLDER. All Rights Reserved.</p>
    </div>
  </div>
</footer>
<script id="core-interactions">
  (function() {
    var isInEditor = !!document.querySelector('[data-gjs-type]') || document.body.classList.contains('gjs-dashed');
    
    // Initialize Swiper in preview/live mode
    if (!isInEditor && typeof Swiper !== 'undefined') {
      var swipers = document.querySelectorAll('.swiper-container');
      swipers.forEach(function(s) {
        new Swiper(s, {
          slidesPerView: 1,
          spaceBetween: 20,
          loop: true,
          pagination: {
            el: s.querySelector('.swiper-pagination'),
            clickable: true,
          },
          breakpoints: {
            768: {
              slidesPerView: 2,
              spaceBetween: 30,
            }
          }
        });
      });
    }
  })();
</script>
`