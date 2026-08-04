export const realEstate09Styles = `
:root {
  --primary: PRIMARY_COLOR_PLACEHOLDER;
  --secondary: SECONDARY_COLOR_PLACEHOLDER;
  --primary-rgb: PRIMARY_RGB_PLACEHOLDER;
  --secondary-rgb: SECONDARY_RGB_PLACEHOLDER;
  --re09-light: #f9f9f9;
  --re09-text: #666666;
}

* { box-sizing: border-box; }

.re09-wrap {
  font-family: 'Inter', sans-serif;
  color: var(--re09-text);
  background-color: #ffffff;
  overflow-x: hidden;
  line-height: 1.6;
}

h1, h2, h3, h4, h5 {
  color: var(--primary);
  font-weight: 700;
  margin: 0 0 15px 0;
}

p { margin: 0 0 15px 0; }

.re09-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.re09-btn {
  display: inline-block;
  padding: 14px 35px;
  background: var(--secondary);
  color: #fff;
  text-decoration: none;
  font-weight: 700;
  font-size: 0.95rem;
  border: none;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s;
  text-transform: uppercase;
  letter-spacing: 1px;
}
.re09-btn:hover {
  background: var(--primary);
}

.re09-btn-dark {
  background: var(--primary);
}
.re09-btn-dark:hover {
  background: var(--secondary);
}

/* Topbar */
.re09-topbar {
  background: #111;
  color: #ccc;
  font-size: 0.8rem;
  padding: 10px 0;
}
.re09-topbar-inner {
  display: flex; justify-content: space-between; align-items: center;
}
.re09-topbar-left { display: flex; gap: 20px; }
.re09-topbar-right { display: flex; gap: 15px; }

/* Header */
.re09-header {
  background: #fff;
  padding: 15px 0;
  box-shadow: 0 5px 20px rgba(0,0,0,0.05);
  position: relative;
  z-index: 100;
}
.re09-header-inner {
  display: flex; justify-content: space-between; align-items: center;
}
.re09-logo {
  font-size: 2rem; font-weight: 900; color: var(--primary); text-decoration: none; display: flex; align-items: center; gap: 10px;
}
.re09-logo span { color: var(--secondary); }

/* Hero */
.re09-hero {
  position: relative;
  background-image: url('https://images.unsplash.com/photo-1503387762-592deb58ef4e?ixlib=rb-4.0.3&w=1920&q=80');
  background-size: cover;
  background-position: center;
  padding: 150px 0 200px;
}
.re09-hero::before {
  content: ''; position: absolute; top:0; left:0; width:100%; height:100%;
  background: rgba(var(--primary-rgb), 0.8);
}
.re09-hero-content {
  position: relative; z-index: 2; display: flex; justify-content: space-between; align-items: center; gap: 50px;
}
.re09-hero-text {
  flex: 1.2; color: #fff;
}
.re09-hero-text h4 {
  color: var(--secondary); font-size: 1rem; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 15px; display: flex; align-items: center; gap: 10px;
}
.re09-hero-text h4::before { content: ''; width: 40px; height: 2px; background: var(--secondary); }
.re09-hero-text h1 {
  color: #fff; font-size: 4rem; line-height: 1.1; margin-bottom: 25px; text-transform: capitalize;
}
.re09-hero-text p { font-size: 1.1rem; color: #ddd; margin-bottom: 40px; max-width: 600px; }

/* Hero Form */
.re09-hero-form {
  flex: 0.8;
  background: #fff;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.3);
  position: relative;
  border-top: 5px solid var(--secondary);
}
.re09-hero-form h3 {
  color: var(--primary); font-size: 1.5rem; margin-bottom: 25px; text-align: center;
}
.re09-input {
  width: 100%; padding: 15px; margin-bottom: 20px;
  border: 1px solid #ddd; border-radius: 4px;
  background: #f9f9f9; font-family: inherit; font-size: 0.95rem;
}

/* Overlapping Stats */
.re09-stats-wrap {
  position: relative; z-index: 10; margin-top: -80px;
  display: flex; justify-content: center; gap: 30px;
}
.re09-stat-box-light {
  background: #fff; padding: 40px; border-radius: 8px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  display: flex; gap: 30px; flex: 1; max-width: 500px; align-items: center;
}
.re09-stat-item { display: flex; align-items: center; gap: 15px; }
.re09-stat-item svg { stroke: var(--secondary); width: 40px; height: 40px; }
.re09-stat-item h4 { margin: 0; font-size: 1.1rem; color: var(--primary); }
.re09-stat-item p { margin: 0; font-size: 0.85rem; color: #888; }
.re09-stat-box-dark {
  background: var(--secondary); padding: 40px; border-radius: 8px; color: #fff;
  display: flex; gap: 40px; flex: 0.6; align-items: center; justify-content: center; box-shadow: 0 10px 30px rgba(var(--secondary-rgb), 0.3);
}
.re09-stat-dark-item h2 { color: #fff; font-size: 2.5rem; margin: 0; }
.re09-stat-dark-item p { margin: 0; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; }

/* About Section */
.re09-about { padding: 120px 0; background: #fff; }
.re09-about-flex { display: flex; gap: 60px; align-items: center; }
.re09-about-img { flex: 1; position: relative; }
.re09-img-arch { width: 80%; border-radius: 200px 200px 0 0; object-fit: cover; height: 500px; display: block; }
.re09-img-circle { position: absolute; bottom: 50px; right: 0; width: 250px; height: 250px; border-radius: 50%; border: 10px solid #fff; object-fit: cover; box-shadow: 0 15px 30px rgba(0,0,0,0.1); }
.re09-about-text { flex: 1; }
.re09-sec-subtitle { color: var(--secondary); font-size: 1rem; text-transform: uppercase; font-weight: 700; letter-spacing: 2px; margin-bottom: 15px; display: flex; align-items: center; gap: 10px; }
.re09-sec-subtitle::before { content: ''; width: 30px; height: 2px; background: var(--secondary); }
.re09-sec-title { font-size: 3rem; margin-bottom: 25px; line-height: 1.2; color: var(--primary); }
.re09-about-list { margin: 30px 0; }
.re09-about-list div { display: flex; align-items: center; gap: 15px; margin-bottom: 15px; font-weight: 600; color: var(--primary); }
.re09-about-list svg { fill: var(--secondary); width: 20px; height: 20px; }
.re09-contact-box { display: flex; align-items: center; gap: 20px; margin-top: 40px; padding-top: 40px; border-top: 1px solid #eee; }
.re09-contact-icon { width: 60px; height: 60px; background: rgba(var(--secondary-rgb), 0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; }
.re09-contact-icon svg { fill: var(--secondary); width: 30px; height: 30px; }
.re09-contact-box h4 { margin: 0; color: #888; font-size: 0.9rem; font-weight: 500; }
.re09-contact-box h2 { margin: 0; color: var(--primary); font-size: 1.8rem; }

/* Partners */
.re09-partners { border-top: 1px solid #eee; border-bottom: 1px solid #eee; padding: 40px 0; background: #fff; }
.re09-partner-grid { display: flex; justify-content: space-around; align-items: center; opacity: 0.5; filter: grayscale(100%); }
.re09-partner-grid h3 { margin: 0; color: var(--primary); font-size: 1.5rem; font-weight: 900; }

/* Services Arch Grid */
.re09-arch-services { padding: 120px 0; background: var(--re09-light); text-align: center; }
.re09-arch-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; margin-top: 60px; }
.re09-arch-card { background: #fff; border-radius: 200px 200px 0 0; padding: 40px 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); transition: 0.3s; position: relative; overflow: hidden; }
.re09-arch-card:hover { transform: translateY(-10px); }
.re09-arch-icon { margin-bottom: 20px; }
.re09-arch-icon svg { width: 50px; height: 50px; stroke: var(--secondary); }
.re09-arch-card h3 { font-size: 1.4rem; margin-bottom: 15px; }
.re09-arch-card p { color: #666; font-size: 0.95rem; margin-bottom: 25px; }
.re09-arch-img { width: 100%; height: 200px; object-fit: cover; border-radius: 0 0 10px 10px; }

/* Process */
.re09-process { padding: 100px 0; background: #fff; text-align: center; }
.re09-process-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 30px; margin-top: 60px; position: relative; }
.re09-process-grid::before { content: ''; position: absolute; top: 40px; left: 10%; right: 10%; height: 2px; background: #eee; z-index: 1; border-top: 2px dashed #ccc; }
.re09-process-step { position: relative; z-index: 2; }
.re09-process-icon { width: 80px; height: 80px; background: #fff; border: 2px solid var(--secondary); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; position: relative; }
.re09-process-icon svg { width: 35px; height: 35px; stroke: var(--primary); }
.re09-process-icon .re09-step-num { position: absolute; top: -10px; right: -10px; width: 30px; height: 30px; background: var(--secondary); color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 0.8rem; border: 3px solid #fff; }
.re09-process-step h3 { font-size: 1.2rem; margin-bottom: 10px; }
.re09-process-step p { color: #666; font-size: 0.9rem; }

/* Banner Section */
.re09-banner { background: var(--primary); padding: 50px 0; }
.re09-banner-flex { display: flex; justify-content: space-between; align-items: center; }
.re09-banner-flex h2 { color: #fff; margin: 0; font-size: 2.5rem; }
.re09-banner-flex h2 span { color: var(--secondary); }

/* Feature Split */
.re09-feature { padding: 120px 0; background: var(--re09-light); }
.re09-feat-flex { display: flex; gap: 60px; align-items: center; }
.re09-feat-left { flex: 1; }
.re09-feat-left p { color: #666; font-size: 1.1rem; margin-bottom: 30px; }
.re09-feat-list { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 40px; }
.re09-feat-list div { display: flex; align-items: center; gap: 10px; font-weight: 600; color: var(--primary); }
.re09-feat-list svg { stroke: var(--secondary); width: 24px; height: 24px; }
.re09-feat-right { flex: 1; position: relative; }
.re09-feat-right img { width: 100%; border-radius: 10px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); }
.re09-feat-overlay { position: absolute; bottom: 30px; right: -30px; background: var(--secondary); color: #fff; padding: 30px; border-radius: 10px; display: flex; align-items: center; gap: 20px; }
.re09-feat-overlay h3 { color: #fff; font-size: 2.5rem; margin: 0; }
.re09-feat-overlay p { margin: 0; font-weight: 600; }

/* Portfolio */
.re09-portfolio { padding: 120px 0; background: #fff; text-align: center; }
.re09-port-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 50px; }
.re09-port-item { position: relative; border-radius: 8px; overflow: hidden; height: 300px; }
.re09-port-item img { width: 100%; height: 100%; object-fit: cover; transition: 0.5s; }
.re09-port-item:hover img { transform: scale(1.1); }
.re09-port-overlay { position: absolute; bottom: 0; left: 0; width: 100%; padding: 30px; background: linear-gradient(to top, rgba(var(--primary-rgb),0.9), transparent); color: #fff; text-align: left; }
.re09-port-overlay h3 { color: #fff; margin: 0 0 5px 0; font-size: 1.4rem; }
.re09-port-overlay p { color: var(--secondary); margin: 0; font-weight: 600; font-size: 0.9rem; text-transform: uppercase; }

/* FAQ / Specs */
.re09-faq { padding: 100px 0; background: var(--re09-light); }
.re09-faq-flex { display: flex; gap: 50px; align-items: center; }
.re09-faq-left { flex: 1; }
.re09-faq-item { background: #fff; border: 1px solid #eee; margin-bottom: 15px; border-radius: 5px; padding: 25px; box-shadow: 0 5px 15px rgba(0,0,0,0.02); }
.re09-faq-item h3 { font-size: 1.1rem; margin-bottom: 10px; color: var(--primary); }
.re09-faq-item p { color: #666; margin: 0; font-size: 0.95rem; }
.re09-faq-right { flex: 1; display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.re09-faq-right img { width: 100%; height: 350px; object-fit: cover; border-radius: 8px; }

/* Testimonial CTA */
.re09-testi-cta { position: relative; padding: 150px 0; background-image: url('https://images.unsplash.com/photo-1541888087858-a590c609ec8e?ixlib=rb-4.0.3&w=1920&q=80'); background-size: cover; background-position: center; background-attachment: fixed; }
.re09-testi-cta::before { content: ''; position: absolute; top:0; left:0; width:100%; height:100%; background: rgba(var(--primary-rgb), 0.8); }
.re09-testi-content { position: relative; z-index: 2; max-width: 800px; background: #fff; padding: 60px; border-radius: 8px; border-left: 10px solid var(--secondary); }
.re09-testi-content svg { width: 50px; height: 50px; fill: rgba(var(--secondary-rgb), 0.3); margin-bottom: 20px; }
.re09-testi-content p { font-size: 1.4rem; color: var(--primary); font-style: italic; font-weight: 600; line-height: 1.6; margin-bottom: 30px; }
.re09-testi-author { display: flex; align-items: center; gap: 20px; }
.re09-testi-author img { width: 60px; height: 60px; border-radius: 50%; object-fit: cover; }
.re09-testi-author h4 { margin: 0 0 5px 0; font-size: 1.1rem; }
.re09-testi-author span { color: var(--secondary); font-size: 0.9rem; font-weight: 600; }

/* Blog */
.re09-blog { padding: 120px 0; background: #fff; text-align: center; }
.re09-blog-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; margin-top: 50px; text-align: left; }
.re09-blog-card { border: 1px solid #eee; border-radius: 8px; overflow: hidden; transition: 0.3s; }
.re09-blog-card:hover { box-shadow: 0 10px 30px rgba(0,0,0,0.08); }
.re09-blog-card img { width: 100%; height: 250px; object-fit: cover; }
.re09-blog-info { padding: 30px; }
.re09-blog-meta { display: flex; gap: 15px; font-size: 0.85rem; color: #888; margin-bottom: 15px; }
.re09-blog-info h3 { font-size: 1.3rem; margin-bottom: 15px; transition: 0.3s; }
.re09-blog-info h3:hover { color: var(--secondary); }
.re09-blog-info a { color: var(--secondary); font-weight: 700; text-decoration: none; text-transform: uppercase; font-size: 0.85rem; letter-spacing: 1px; }

/* Footer (No Nav Menu) */
.re09-footer { background: #111; color: #aaa; }
.re09-footer-top { padding: 80px 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
.re09-footer-top h2 { color: #fff; font-size: 5rem; text-align: center; margin: 0; text-transform: uppercase; font-weight: 900; letter-spacing: 2px; }
.re09-footer-top h2 span { color: var(--secondary); font-style: italic; }
.re09-foot-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; padding: 60px 0; align-items: center; }
.re09-foot-col h3 { color: #fff; font-size: 1.5rem; margin-bottom: 20px; }
.re09-foot-col p { margin-bottom: 25px; font-size: 1rem; line-height: 1.8; }
.re09-foot-contact { display: flex; flex-direction: column; gap: 15px; }
.re09-foot-contact div { display: flex; align-items: center; gap: 15px; font-size: 1rem; color: #fff; }
.re09-foot-contact svg { stroke: var(--secondary); width: 24px; height: 24px; }
.re09-foot-bottom { background: #0a0a0a; padding: 25px 0; text-align: center; font-size: 0.9rem; }

/* Modal */
.re09-modal-toggle { display: none; }
.re09-modal-toggle:checked ~ .re09-modal { display: flex; }
.re09-modal { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 9999; align-items: center; justify-content: center; backdrop-filter: blur(5px); }
.re09-modal-content { background: #fff; padding: 40px; border-radius: 8px; text-align: center; max-width: 400px; width: 90%; color: #333; }
.re09-modal-close { display: inline-block; padding: 12px 30px; background: var(--secondary); color: #fff; text-decoration: none; border-radius: 4px; font-weight: bold; cursor: pointer; margin-top:20px; }

@media (max-width: 1024px) {
  .re09-topbar { display: none; }
  .re09-hero-content { flex-direction: column; text-align: center; }
  .re09-hero-text h4 { justify-content: center; }
  .re09-hero-text h4::before { display: none; }
  .re09-hero-text h1 { font-size: 3rem; }
  .re09-hero-form { width: 100%; margin-top: 30px; }
  .re09-stats-wrap { flex-direction: column; margin-top: 40px; padding: 0 20px; }
  .re09-about-flex, .re09-feat-flex, .re09-faq-flex, .re09-foot-grid, .re09-banner-flex { flex-direction: column; }
  .re09-banner-flex { text-align: center; gap: 30px; }
  .re09-sec-subtitle { justify-content: center; }
  .re09-sec-subtitle::before { display: none; }
  .re09-sec-title, .re09-about { text-align: center; }
  .re09-about-list { text-align: left; }
  .re09-arch-grid, .re09-port-grid, .re09-blog-grid, .re09-process-grid { grid-template-columns: 1fr; }
  .re09-process-grid::before { display: none; }
  .re09-feat-right { margin-top: 50px; }
  .re09-feat-overlay { right: 0; bottom: 0; border-radius: 0 0 10px 10px; width: 100%; justify-content: center; }
  .re09-footer-top h2 { font-size: 3rem; }
  .re09-foot-col { text-align: center; }
  .re09-foot-contact div { justify-content: center; }
}
`;

export const realEstate09Html = `
<div class="re09-wrap">

  <!-- Topbar -->
  <div class="re09-topbar">
    <div class="re09-container re09-topbar-inner">
      <div class="re09-topbar-left">
        <span><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-2px; margin-right:5px;"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg> +1 234 567 890</span>
        <span><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-2px; margin-right:5px;"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg> info@construction.com</span>
      </div>
      <div class="re09-topbar-right">
        <span>Opening Hours: Mon - Sat 8:00 - 18:00</span>
      </div>
    </div>
  </div>

  <!-- Header (No Menu) -->
  <header class="re09-header">
    <div class="re09-container re09-header-inner">
      <a href="javascript:void(0);" class="re09-logo">
        LOGO_PLACEHOLDER
      </a>
      <a href="javascript:void(0);" class="re09-btn">Get A Quote</a>
    </div>
  </header>

  <!-- Hero with Form -->
  <section class="re09-hero">
    <div class="re09-container re09-hero-content">
      <div class="re09-hero-text">
        <h4>Construction Services</h4>
        <h1>Building Dreams Creating That Endures Reality</h1>
        <p>We are a leading construction company committed to providing high-quality building services, delivering projects on time and exceeding client expectations.</p>
        <a href="javascript:void(0);" class="re09-btn">Discover More</a>
      </div>
      
      <!-- Floating Hero Form -->
      <div class="re09-hero-form" id="contact">
        <h3>Request A Free Estimate</h3>
        <form onsubmit="event.preventDefault(); document.getElementById('re09-modal-trigger').checked = true;">
          <input type="text" class="re09-input" placeholder="Full Name" required>
          <input type="email" class="re09-input" placeholder="Email Address" required>
          <select class="re09-input" required>
            <option value="">Select Service</option>
            <option value="building">Building Construction</option>
            <option value="renovation">Home Renovation</option>
            <option value="architecture">Architecture Design</option>
          </select>
          <textarea class="re09-input" placeholder="Project Details" rows="4" required></textarea>
          <button type="submit" class="re09-btn" style="width:100%;">Submit Request</button>
        </form>
      </div>
    </div>
  </section>

  <!-- Overlapping Stats -->
  <div class="re09-stats-wrap">
    <div class="re09-stat-box-light">
      <div class="re09-stat-item">
        <svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        <div>
          <h4>Professional Staffs</h4>
          <p>Expert Team</p>
        </div>
      </div>
      <div style="width:1px; height:50px; background:#eee;"></div>
      <div class="re09-stat-item">
        <svg viewBox="0 0 24 24" fill="none" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        <div>
          <h4>24/7 Support</h4>
          <p>Always Available</p>
        </div>
      </div>
    </div>
    <div class="re09-stat-box-dark">
      <div class="re09-stat-dark-item">
        <h2>6k+</h2>
        <p>Happy Clients</p>
      </div>
      <div class="re09-stat-dark-item">
        <h2>123k</h2>
        <p>Projects Done</p>
      </div>
    </div>
  </div>

  <!-- About Section -->
  <section class="re09-about">
    <div class="re09-container re09-about-flex">
      <div class="re09-about-img">
        <img src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&w=400&q=80" class="re09-img-arch">
        <img src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&w=400&q=80" class="re09-img-circle">
      </div>
      <div class="re09-about-text">
        <span class="re09-sec-subtitle">About Our Company</span>
        <h2 class="re09-sec-title">Committed To High Quality Construction Service</h2>
        <p style="color:#666; font-size:1.1rem; line-height:1.8; margin-bottom:25px;">With over 20 years of experience in the construction industry, we have built a reputation for excellence, reliability, and unparalleled craftsmanship. We turn your visions into concrete reality.</p>
        
        <div class="re09-about-list">
          <div><svg viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> Experienced & Professional Team</div>
          <div><svg viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> High Quality Building Materials</div>
          <div><svg viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> 100% Satisfaction Guarantee</div>
        </div>
        
        <div class="re09-contact-box">
          <div class="re09-contact-icon">
            <svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          </div>
          <div>
            <h4>Call Us For Details</h4>
            <h2>+1 (800) 123-4567</h2>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Partners -->
  <div class="re09-partners">
    <div class="re09-container re09-partner-grid">
      <h3>BUILDER.CO</h3>
      <h3>STRUCTURA</h3>
      <h3>HOMEMAKERS</h3>
      <h3>ARCHITECTS</h3>
      <h3>ENGINEER PRO</h3>
    </div>
  </div>

  <!-- Arch Services -->
  <section class="re09-arch-services">
    <div class="re09-container">
      <span class="re09-sec-subtitle" style="justify-content:center;">Our Services</span>
      <h2 class="re09-sec-title">Preparing The Path For<br>Future Generations</h2>
      <div class="re09-arch-grid">
        <div class="re09-arch-card">
          <div class="re09-arch-icon"><svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg></div>
          <h3>Building Construction</h3>
          <p>Complete construction solutions from foundation to finishing.</p>
          <img src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?ixlib=rb-4.0.3&w=400&q=80" class="re09-arch-img">
        </div>
        <div class="re09-arch-card">
          <div class="re09-arch-icon"><svg viewBox="0 0 24 24" fill="none" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg></div>
          <h3>Architecture Design</h3>
          <p>Innovative and sustainable architectural blueprints.</p>
          <img src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?ixlib=rb-4.0.3&w=400&q=80" class="re09-arch-img">
        </div>
        <div class="re09-arch-card">
          <div class="re09-arch-icon"><svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg></div>
          <h3>Renovation Services</h3>
          <p>Transforming old spaces into modern masterpieces.</p>
          <img src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&w=400&q=80" class="re09-arch-img">
        </div>
      </div>
      <div style="margin-top: 50px;">
        <a href="javascript:void(0);" class="re09-btn re09-btn-dark">View All Services</a>
      </div>
    </div>
  </section>

  <!-- Process -->
  <section class="re09-process">
    <div class="re09-container">
      <span class="re09-sec-subtitle" style="justify-content:center;">How We Work</span>
      <h2 class="re09-sec-title">Our Working Process<br>How We Manage</h2>
      <div class="re09-process-grid">
        <div class="re09-process-step">
          <div class="re09-process-icon">
            <div class="re09-step-num">01</div>
            <svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
          </div>
          <h3>Plan & Design</h3>
          <p>We start with a detailed blueprint.</p>
        </div>
        <div class="re09-process-step">
          <div class="re09-process-icon">
            <div class="re09-step-num">02</div>
            <svg viewBox="0 0 24 24" fill="none" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
          </div>
          <h3>Material Selection</h3>
          <p>Procuring highest quality materials.</p>
        </div>
        <div class="re09-process-step">
          <div class="re09-process-icon">
            <div class="re09-step-num">03</div>
            <svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <h3>Construction</h3>
          <p>Building with precision and safety.</p>
        </div>
        <div class="re09-process-step">
          <div class="re09-process-icon">
            <div class="re09-step-num">04</div>
            <svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
          <h3>Final Delivery</h3>
          <p>Handing over the completed project.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Banner -->
  <section class="re09-banner">
    <div class="re09-container re09-banner-flex">
      <h2>Do You Have Any Questions? <span>Let's Talk</span></h2>
      <a href="javascript:void(0);" class="re09-btn" style="background:#fff; color:var(--primary);">Contact Us Now</a>
    </div>
  </section>

  <!-- Feature Split -->
  <section class="re09-feature">
    <div class="re09-container re09-feat-flex">
      <div class="re09-feat-left">
        <span class="re09-sec-subtitle">Why Choose Us</span>
        <h2 class="re09-sec-title">We Will Build With Quality Construction Materials</h2>
        <p>Our commitment to excellence ensures that every structure we build is durable, safe, and visually stunning. We never compromise on material quality.</p>
        <div class="re09-feat-list">
          <div><svg viewBox="0 0 24 24" fill="none" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Eco-Friendly Materials</div>
          <div><svg viewBox="0 0 24 24" fill="none" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Cost-Effective Solutions</div>
          <div><svg viewBox="0 0 24 24" fill="none" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Modern Technology</div>
          <div><svg viewBox="0 0 24 24" fill="none" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Expert Engineering</div>
        </div>
        <a href="javascript:void(0);" class="re09-btn">Discover More</a>
      </div>
      <div class="re09-feat-right">
        <img src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&w=800&q=80">
        <div class="re09-feat-overlay">
          <h3>24k+</h3>
          <p>Completed<br>Projects</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Portfolio -->
  <section class="re09-portfolio">
    <div class="re09-container">
      <span class="re09-sec-subtitle" style="justify-content:center;">Our Work</span>
      <h2 class="re09-sec-title">Discovering Our Portfolio</h2>
      <div class="re09-port-grid">
        <div class="re09-port-item">
          <img src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&w=400&q=80">
          <div class="re09-port-overlay">
            <p>Architecture</p>
            <h3>Modern Skyscraper</h3>
          </div>
        </div>
        <div class="re09-port-item">
          <img src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?ixlib=rb-4.0.3&w=600&q=80">
          <div class="re09-port-overlay">
            <p>Building</p>
            <h3>Commercial Complex</h3>
          </div>
        </div>
        <div class="re09-port-item">
          <img src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&w=600&q=80">
          <div class="re09-port-overlay">
            <p>Interior</p>
            <h3>Luxury Apartment</h3>
          </div>
        </div>
        <div class="re09-port-item">
          <img src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&w=600&q=80">
          <div class="re09-port-overlay">
            <p>Renovation</p>
            <h3>Bridge Construction</h3>
          </div>
        </div>
        <div class="re09-port-item">
          <img src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?ixlib=rb-4.0.3&w=600&q=80">          <div class="re09-port-overlay">
            <p>Architecture</p>
            <h3>City Mall</h3>
          </div>
        </div>
        <div class="re09-port-item">
          <img src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?ixlib=rb-4.0.3&w=600&q=80">
          <div class="re09-port-overlay">
            <p>Building</p>
            <h3>Industrial Plant</h3>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- FAQ Section -->
  <section class="re09-faq">
    <div class="re09-container re09-faq-flex">
      <div class="re09-faq-left">
        <span class="re09-sec-subtitle">Got Questions?</span>
        <h2 class="re09-sec-title">Frequently Asked Questions</h2>
        <div class="re09-faq-item">
          <h3>How long does a commercial project take?</h3>
          <p>Timelines vary based on scale, but we provide detailed schedules upfront.</p>
        </div>
        <div class="re09-faq-item">
          <h3>Do you handle all permits and regulations?</h3>
          <p>Yes, our team manages all necessary legal documentation and permits.</p>
        </div>
        <div class="re09-faq-item">
          <h3>What safety measures do you follow?</h3>
          <p>We adhere to strict international safety standards on all construction sites.</p>
        </div>
      </div>
      <div class="re09-faq-right">
        <img src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&w=600&q=80">
        <img src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&w=600&q=80">
      </div>
    </div>
  </section>

  <!-- Testimonial CTA -->
  <section class="re09-testi-cta">
    <div class="re09-container">
      <div class="re09-testi-content">
        <svg viewBox="0 0 24 24"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1zM17 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/></svg>
        <p>"The professionalism and expertise demonstrated by the team were exceptional. They delivered our corporate headquarters ahead of schedule and under budget. Highly recommended!"</p>
        <div class="re09-testi-author">
          <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&w=100&q=80">
          <div>
            <h4>Michael Harrison</h4>
            <span>CEO, TechBuild</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Blog -->
  <section class="re09-blog">
    <div class="re09-container">
      <span class="re09-sec-subtitle" style="justify-content:center;">News & Updates</span>
      <h2 class="re09-sec-title">Latest News & Articles</h2>
      <div class="re09-blog-grid">
        <div class="re09-blog-card">
          <img src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?ixlib=rb-4.0.3&w=600&q=80">          <div class="re09-blog-info">
            <div class="re09-blog-meta"><span>By Admin</span> <span>Oct 12, 2026</span></div>
            <h3>Future Trends in Modern Architecture</h3>
            <a href="javascript:void(0);">Read More &rarr;</a>
          </div>
        </div>
        <div class="re09-blog-card">
          <img src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?ixlib=rb-4.0.3&w=600&q=80">
          <div class="re09-blog-info">
            <div class="re09-blog-meta"><span>By Admin</span> <span>Oct 15, 2026</span></div>
            <h3>Sustainable Building Materials</h3>
            <a href="javascript:void(0);">Read More &rarr;</a>
          </div>
        </div>
        <div class="re09-blog-card">
          <img src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&w=600&q=80">
          <div class="re09-blog-info">
            <div class="re09-blog-meta"><span>By Admin</span> <span>Oct 18, 2026</span></div>
            <h3>Safety Protocols on Construction Sites</h3>
            <a href="javascript:void(0);">Read More &rarr;</a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Footer (No Menu, With Contact Block) -->
  <footer class="re09-footer">
    <div class="re09-footer-top">
      <div class="re09-container">
        <h2>Let's <span>Talk!</span></h2>
      </div>
    </div>
    <div class="re09-container">
      <div class="re09-foot-grid">
        <div class="re09-foot-col">
          <a href="javascript:void(0);" style="color:#fff; font-size:2rem; font-weight:900; text-decoration:none; display:flex; align-items:center; gap:10px; margin-bottom:20px;">
             LOGO_PLACEHOLDER
          </a>
          <p>We are dedicated to shaping the future through innovative construction solutions. Partner with us to build structures that stand the test of time.</p>
        </div>
        <div class="re09-foot-col">
          <h3>Contact Details</h3>
          <div class="re09-foot-contact">
            <div>
              <svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              65 Brand Tower, New York, USA
            </div>
            <div>
              <svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              +1 (800) 123-4567
            </div>
            <div>
              <svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              info@construction.com
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="re09-foot-bottom">
      COPYRIGHT_PLACEHOLDER
    </div>
  </footer>

  <!-- Success Modal -->
  <input type="checkbox" id="re09-modal-trigger" class="re09-modal-toggle">
  <div class="re09-modal">
    <div class="re09-modal-content">
      <h3 style="color:#111; margin-bottom:10px;">Success!</h3>
      <p style="color:#666; font-size:0.95rem;">Your message has been sent successfully. We will get back to you shortly.</p>
      <label for="re09-modal-trigger" class="re09-modal-close">Close</label>
    </div>
  </div>

</div>
`;
