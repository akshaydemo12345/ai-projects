export const realEstate10Styles = `
:root {
  --primary: PRIMARY_COLOR_PLACEHOLDER;
  --secondary: SECONDARY_COLOR_PLACEHOLDER;
  --primary-rgb: PRIMARY_RGB_PLACEHOLDER;
  --secondary-rgb: SECONDARY_RGB_PLACEHOLDER;
  --re10-light: #f9f9f9;
  --re10-text: #666666;
}

* { box-sizing: border-box; }

body, .re10-wrap {
  margin: 0;
  font-family: 'Inter', sans-serif;
  color: var(--re10-text);
  background-color: #ffffff;
  overflow-x: hidden;
  line-height: 1.6;
}

h1, h2, h3, h4, h5 {
  color: #222;
  font-weight: 700;
  margin: 0 0 15px 0;
}

p { margin: 0 0 15px 0; }
a { text-decoration: none; }

.re10-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.re10-btn {
  display: inline-block;
  padding: 12px 30px;
  background: var(--primary);
  color: #fff;
  font-weight: 600;
  border-radius: 30px;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
  text-transform: uppercase;
  font-size: 0.9rem;
  letter-spacing: 1px;
}
.re10-btn:hover {
  background: var(--secondary);
  color: #fff;
}
.re10-btn-sec {
  background: var(--secondary);
}
.re10-btn-sec:hover {
  background: var(--primary);
}

/* Header */
.re10-header {
  background: #fff;
  padding: 15px 0;
  box-shadow: 0 2px 15px rgba(0,0,0,0.05);
  position: relative;
  z-index: 100;
}
.re10-header-inner {
  display: flex; justify-content: space-between; align-items: center;
}
.re10-logo {
  font-size: 2rem; font-weight: 900; color: var(--primary); display: flex; align-items: center; gap: 10px;
}
.re10-logo span { color: var(--secondary); }
.re10-nav { display: flex; gap: 25px; align-items: center; }
.re10-nav a { color: #333; font-weight: 600; font-size: 0.95rem; transition: 0.3s; }
.re10-nav a:hover { color: var(--primary); }

/* Hero */
.re10-hero {
  position: relative;
  background-image: url('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&w=1920&q=80');
  background-size: cover;
  background-position: center;
  padding: 180px 0 250px;
  text-align: center;
}
.re10-hero::before {
  content: ''; position: absolute; top:0; left:0; width:100%; height:100%;
  background: rgba(0,0,0,0.6);
}
.re10-hero-content {
  position: relative; z-index: 2; max-width: 800px; margin: 0 auto; color: #fff;
}
.re10-hero h4 {
  color: var(--secondary); font-size: 1.2rem; text-transform: uppercase; letter-spacing: 3px; margin-bottom: 20px;
}
.re10-hero h1 {
  color: #fff; font-size: 4.5rem; line-height: 1.1; margin-bottom: 30px; text-transform: uppercase; letter-spacing: 2px;
}
.re10-hero p {
  font-size: 1.2rem; color: #ddd; margin-bottom: 40px;
}

/* Feature Boxes (Overlapping) */
.re10-features-wrap {
  position: relative; z-index: 10; margin-top: -100px;
  display: grid; grid-template-columns: repeat(4, 1fr);
}
.re10-feat-box {
  padding: 50px 30px; text-align: center; color: #fff; transition: 0.3s;
}
.re10-feat-box:hover { transform: translateY(-10px); }
.re10-feat-box:nth-child(1) { background: var(--primary); }
.re10-feat-box:nth-child(2) { background: var(--secondary); }
.re10-feat-box:nth-child(3) { background: #333; }
.re10-feat-box:nth-child(4) { background: var(--primary); filter: brightness(1.1); }
.re10-feat-box svg { width: 50px; height: 50px; stroke: #fff; margin-bottom: 20px; }
.re10-feat-box h3 { color: #fff; font-size: 1.2rem; margin-bottom: 15px; text-transform: uppercase; }
.re10-feat-box p { font-size: 0.9rem; opacity: 0.9; margin: 0; }

/* Help Section */
.re10-help { padding: 120px 0; background: #fff; }
.re10-help-flex { display: flex; gap: 60px; align-items: center; }
.re10-help-img { flex: 1; }
.re10-help-img img { width: 100%; border-radius: 10px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); }
.re10-help-text { flex: 1; }
.re10-sec-subtitle { color: var(--primary); font-size: 1rem; text-transform: uppercase; font-weight: 700; letter-spacing: 2px; margin-bottom: 15px; display: block; }
.re10-sec-title { font-size: 2.8rem; margin-bottom: 25px; line-height: 1.2; text-transform: uppercase; }
.re10-help-text p { color: #666; font-size: 1.05rem; line-height: 1.8; margin-bottom: 30px; }

/* Causes Grid */
.re10-causes { padding: 100px 0; background: var(--re10-light); text-align: center; }
.re10-causes-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; margin-top: 50px; text-align: left; }
.re10-cause-card { background: #fff; border-radius: 10px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
.re10-cause-img { position: relative; height: 250px; }
.re10-cause-img img { width: 100%; height: 100%; object-fit: cover; }
.re10-cause-badge { position: absolute; top: 20px; right: 20px; background: var(--secondary); color: #fff; padding: 5px 15px; border-radius: 20px; font-size: 0.8rem; font-weight: bold; }
.re10-cause-info { padding: 30px; }
.re10-cause-info h3 { font-size: 1.4rem; margin-bottom: 15px; }
.re10-cause-info p { color: #666; font-size: 0.95rem; margin-bottom: 25px; }
.re10-progress-bg { width: 100%; height: 8px; background: #eee; border-radius: 4px; margin-bottom: 15px; overflow: hidden; }
.re10-progress-bar { height: 100%; background: var(--primary); border-radius: 4px; }
.re10-cause-stats { display: flex; justify-content: space-between; font-size: 0.9rem; font-weight: bold; margin-bottom: 25px; color: #333; }
.re10-cause-stats span { color: var(--primary); }

/* Happy Moments */
.re10-moments { padding: 120px 0; background: #fff; }
.re10-moments-flex { display: flex; gap: 60px; align-items: center; flex-direction: row-reverse; }
.re10-moments-img { flex: 1; }
.re10-moments-img img { width: 100%; border-radius: 10px; }
.re10-moments-text { flex: 1; }
.re10-moment-list { margin-top: 30px; }
.re10-moment-item { display: flex; gap: 20px; margin-bottom: 25px; }
.re10-moment-icon { width: 60px; height: 60px; border-radius: 50%; background: rgba(var(--secondary-rgb), 0.1); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.re10-moment-icon svg { width: 30px; height: 30px; stroke: var(--secondary); }
.re10-moment-item h4 { font-size: 1.2rem; margin-bottom: 5px; }
.re10-moment-item p { margin: 0; font-size: 0.95rem; color: #666; }

/* Stats Strip */
.re10-stats { background: #111; padding: 80px 0; color: #fff; text-align: center; }
.re10-stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 30px; }
.re10-stat-box svg { width: 50px; height: 50px; stroke: var(--secondary); margin-bottom: 20px; }
.re10-stat-box h2 { color: #fff; font-size: 3rem; margin: 0 0 10px 0; line-height: 1; }
.re10-stat-box p { margin: 0; font-size: 1.1rem; color: #aaa; text-transform: uppercase; letter-spacing: 1px; }

/* Banner */
.re10-banner { padding: 120px 0; background-image: url('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&w=1920&q=80'); background-size: cover; background-position: center; background-attachment: fixed; position: relative; text-align: center; color: #fff; }
.re10-banner::before { content: ''; position: absolute; top:0; left:0; width:100%; height:100%; background: rgba(0,0,0,0.7); }
.re10-banner-content { position: relative; z-index: 2; max-width: 700px; margin: 0 auto; }
.re10-banner-content h2 { color: #fff; font-size: 3rem; margin-bottom: 25px; text-transform: uppercase; }

/* Team / Volunteers */
.re10-team { padding: 100px 0; background: #fff; text-align: center; }
.re10-team-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; margin-top: 50px; }
.re10-team-card { text-align: center; }
.re10-team-img { width: 250px; height: 250px; border-radius: 50%; object-fit: cover; margin: 0 auto 25px; border: 5px solid var(--re10-light); transition: 0.3s; }
.re10-team-card:hover .re10-team-img { border-color: var(--secondary); transform: scale(1.05); }
.re10-team-card h3 { font-size: 1.3rem; margin-bottom: 5px; }
.re10-team-card p { color: var(--primary); font-weight: bold; margin-bottom: 15px; }
.re10-team-social { display: flex; justify-content: center; gap: 10px; }
.re10-team-social a { width: 40px; height: 40px; border-radius: 50%; background: var(--re10-light); display: flex; align-items: center; justify-content: center; color: #333; transition: 0.3s; }
.re10-team-social a:hover { background: var(--primary); color: #fff; }
.re10-team-social svg { width: 18px; height: 18px; fill: currentColor; }

/* Contact Section (Map + Form) */
.re10-contact { padding: 0; display: flex; flex-wrap: wrap; }
.re10-contact-map { flex: 1; min-width: 300px; background: #e5e5e5; position: relative; min-height: 500px; }
.re10-contact-map img { width: 100%; height: 100%; object-fit: cover; position: absolute; top:0; left:0; }
.re10-contact-form { flex: 1; min-width: 300px; background: #222; padding: 80px 10%; color: #fff; }
.re10-contact-form h2 { color: #fff; font-size: 2.5rem; margin-bottom: 10px; }
.re10-contact-form p { color: #aaa; margin-bottom: 40px; }
.re10-input { width: 100%; padding: 15px 20px; margin-bottom: 20px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: #fff; border-radius: 4px; font-family: inherit; font-size: 1rem; }
.re10-input:focus { outline: none; border-color: var(--secondary); background: rgba(255,255,255,0.1); }
.re10-submit { width: 100%; padding: 18px; background: var(--secondary); color: #fff; border: none; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; border-radius: 4px; cursor: pointer; transition: 0.3s; }
.re10-submit:hover { background: var(--primary); }

/* Footer */
.re10-footer { background: #111; color: #888; padding: 80px 0 30px; }
.re10-foot-grid { display: grid; grid-template-columns: 2fr 1fr 1.5fr; gap: 50px; margin-bottom: 60px; }
.re10-foot-col h3 { color: #fff; font-size: 1.3rem; margin-bottom: 25px; }
.re10-foot-col p { line-height: 1.8; margin-bottom: 20px; }
.re10-foot-links { list-style: none; padding: 0; margin: 0; }
.re10-foot-links li { margin-bottom: 15px; }
.re10-foot-links a { color: #888; text-decoration: none; transition: 0.3s; }
.re10-foot-links a:hover { color: var(--secondary); padding-left: 5px; }
.re10-foot-contact { display: flex; flex-direction: column; gap: 15px; }
.re10-foot-contact div { display: flex; align-items: flex-start; gap: 15px; }
.re10-foot-contact svg { stroke: var(--secondary); width: 24px; height: 24px; flex-shrink: 0; }
.re10-foot-bottom { text-align: center; padding-top: 30px; border-top: 1px solid rgba(255,255,255,0.1); font-size: 0.9rem; }

/* Modal */
.re10-modal-toggle { display: none; }
.re10-modal-toggle:checked ~ .re10-modal { display: flex; }
.re10-modal { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 9999; align-items: center; justify-content: center; backdrop-filter: blur(5px); }
.re10-modal-content { background: #fff; padding: 40px; border-radius: 8px; text-align: center; max-width: 400px; width: 90%; color: #333; }
.re10-modal-close { display: inline-block; padding: 12px 30px; background: var(--secondary); color: #fff; text-decoration: none; border-radius: 30px; font-weight: bold; cursor: pointer; margin-top:20px; text-transform: uppercase; }

@media (max-width: 1024px) {
  .re10-nav { display: none; }
  .re10-features-wrap { grid-template-columns: 1fr 1fr; margin-top: 0; }
  .re10-hero { padding: 120px 0; }
  .re10-help-flex, .re10-moments-flex { flex-direction: column; }
  .re10-causes-grid, .re10-stats-grid, .re10-team-grid, .re10-foot-grid { grid-template-columns: 1fr; }
  .re10-contact-map { min-height: 300px; }
}
@media (max-width: 768px) {
  .re10-features-wrap { grid-template-columns: 1fr; }
  .re10-hero h1 { font-size: 3rem; }
}
@media (max-width: 768px) {
  .re10-features-wrap, .re10-causes-grid, .re10-stats-grid, .re10-team-grid, .re10-foot-grid { grid-template-columns: 1fr !important; }
  .re10-header-inner, .re10-nav, .re10-help-flex, .re10-moments-flex, .re10-moment-item { flex-direction: column !important; }
}

`;

export const realEstate10Html = `
<div class="re10-wrap">

  <!-- Header -->
  <header class="re10-header">
    <div class="re10-container re10-header-inner">
      <a href="javascript:void(0);" class="re10-logo">
        LOGO_PLACEHOLDER
      </a>
   
    </div>
  </header>

  <!-- Hero -->
  <section class="re10-hero">
    <div class="re10-container re10-hero-content">
      <h4>Care & Child</h4>
      <h1>We Help Kids To Get Good Education</h1>
      <p>We are a non-profit organization dedicated to bringing education, food, and medical support to underprivileged children around the world.</p>
      <a href="javascript:void(0);" class="re10-btn re10-btn-sec" style="font-size: 1.1rem; padding: 15px 40px;">Donate Now</a>
    </div>
  </section>

  <!-- 4 Feature Boxes -->
  <div class="re10-features-wrap">
    <div class="re10-feat-box">
      <svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
      <h3>Become a Volunteer</h3>
      <p>Join our team and help us make a real difference in communities worldwide.</p>
    </div>
    <div class="re10-feat-box">
      <svg viewBox="0 0 24 24" fill="none" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>
      <h3>Quick Fundraise</h3>
      <p>Start a fundraising campaign quickly and easily to support our core causes.</p>
    </div>
    <div class="re10-feat-box">
      <svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
      <h3>Start Donating</h3>
      <p>Your contribution helps us provide food, shelter, and education to those in need.</p>
    </div>
    <div class="re10-feat-box">
      <svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
      <h3>Help a Child</h3>
      <p>Sponsor a child's education and completely transform their future.</p>
    </div>
  </div>

  <!-- Help Section -->
  <section class="re10-help" id="about">
    <div class="re10-container re10-help-flex">
      <div class="re10-help-img">
        <img src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&w=800&q=80" alt="Child">
      </div>
      <div class="re10-help-text">
        <span class="re10-sec-subtitle">Who We Are</span>
        <h2 class="re10-sec-title">Help A Child Today & Build A Better Future</h2>
        <p>Our foundation works tirelessly to provide essential resources to children living in poverty. We believe that every child deserves access to quality education, nutritious food, and basic healthcare.</p>
        <p>By partnering with local communities and global organizations, we create sustainable programs that empower children and their families to break the cycle of poverty.</p>
        <a href="javascript:void(0);" class="re10-btn">Read More</a>
      </div>
    </div>
  </section>

  <!-- Causes -->
  <section class="re10-causes" id="causes">
    <div class="re10-container">
      <span class="re10-sec-subtitle">Latest Causes</span>
      <h2 class="re10-sec-title">Find The Popular Cause</h2>
      <div class="re10-causes-grid">
        <div class="re10-cause-card">
          <div class="re10-cause-img">
            <span class="re10-cause-badge">Education</span>
            <img src="https://images.unsplash.com/photo-1509062522246-3755977927d7?ixlib=rb-4.0.3&w=600&q=80">
          </div>
          <div class="re10-cause-info">
            <h3>Education for African Children</h3>
            <p>Help us build schools and provide learning materials for children in rural Africa.</p>
            <div class="re10-progress-bg"><div class="re10-progress-bar" style="width: 75%;"></div></div>
            <div class="re10-cause-stats">
              <div>Raised: <span>$45,000</span></div>
              <div>Goal: <span>$60,000</span></div>
            </div>
            <a href="javascript:void(0);" class="re10-btn" style="width:100%; text-align:center;">Donate Now</a>
          </div>
        </div>
        <div class="re10-cause-card">
          <div class="re10-cause-img">
            <span class="re10-cause-badge" style="background:var(--primary);">Medical</span>
            <img src="https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?ixlib=rb-4.0.3&w=600&q=80">
          </div>
          <div class="re10-cause-info">
            <h3>Medical Camp for Poor Kids</h3>
            <p>Providing free medical checkups and essential medicines to underserved communities.</p>
            <div class="re10-progress-bg"><div class="re10-progress-bar" style="width: 50%; background:var(--secondary);"></div></div>
            <div class="re10-cause-stats">
              <div>Raised: <span>$25,000</span></div>
              <div>Goal: <span>$50,000</span></div>
            </div>
            <a href="javascript:void(0);" class="re10-btn" style="width:100%; text-align:center;">Donate Now</a>
          </div>
        </div>
        <div class="re10-cause-card">
          <div class="re10-cause-img">
            <span class="re10-cause-badge" style="background:#333;">Food</span>
            <img src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&w=600&q=80">
          </div>
          <div class="re10-cause-info">
            <h3>Provide Clean Water & Food</h3>
            <p>Ensuring that children have access to clean drinking water and nutritious meals.</p>
            <div class="re10-progress-bg"><div class="re10-progress-bar" style="width: 90%; background:#333;"></div></div>
            <div class="re10-cause-stats">
              <div>Raised: <span>$90,000</span></div>
              <div>Goal: <span>$100,000</span></div>
            </div>
            <a href="javascript:void(0);" class="re10-btn" style="width:100%; text-align:center;">Donate Now</a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Happy Moments -->
  <section class="re10-moments">
    <div class="re10-container re10-moments-flex">
      <div class="re10-moments-img">
        <img src="https://images.unsplash.com/photo-1509062522246-3755977927d7?ixlib=rb-4.0.3&w=800&q=80">
      </div>
      <div class="re10-moments-text">
        <span class="re10-sec-subtitle">Why Choose Us</span>
        <h2 class="re10-sec-title">Happy Little Moments</h2>
        <p style="color:#666; font-size:1.05rem;">We strive to create moments of joy and hope for children who have faced immense hardship. Our programs are designed not just to meet basic needs, but to foster happiness and growth.</p>
        <div class="re10-moment-list">
          <div class="re10-moment-item">
            <div class="re10-moment-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
            <div>
              <h4>Quality Education</h4>
              <p>Providing access to schools, books, and dedicated teachers.</p>
            </div>
          </div>
          <div class="re10-moment-item">
            <div class="re10-moment-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            </div>
            <div>
              <h4>Healthcare Support</h4>
              <p>Regular medical checkups and vaccinations for disease prevention.</p>
            </div>
          </div>
          <div class="re10-moment-item">
            <div class="re10-moment-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <div>
              <h4>Community Building</h4>
              <p>Creating safe spaces for children to play, learn, and thrive.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Stats -->
  <section class="re10-stats">
    <div class="re10-container re10-stats-grid">
      <div class="re10-stat-box">
        <svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        <h2>25K</h2>
        <p>Happy Children</p>
      </div>
      <div class="re10-stat-box">
        <svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
        <h2>120</h2>
        <p>Schools Built</p>
      </div>
      <div class="re10-stat-box">
        <svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
        <h2>$5M</h2>
        <p>Funds Raised</p>
      </div>
      <div class="re10-stat-box">
        <svg viewBox="0 0 24 24" fill="none" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>
        <h2>350</h2>
        <p>Active Volunteers</p>
      </div>
    </div>
  </section>

  <!-- Banner -->
  <section class="re10-banner">
    <div class="re10-container re10-banner-content">
      <h2>Education is a child's right, not a privilege.</h2>
      <a href="javascript:void(0);" class="re10-btn">Sponsor A Child</a>
    </div>
  </section>

  <!-- Team -->
  <section class="re10-team" id="team">
    <div class="re10-container">
      <span class="re10-sec-subtitle">Our Heroes</span>
      <h2 class="re10-sec-title">Meet Our Volunteers</h2>
      <div class="re10-team-grid">
        <div class="re10-team-card">
          <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&w=400&q=80" class="re10-team-img">
          <h3>John Anderson</h3>
          <p>Field Director</p>
          <div class="re10-team-social">
            <a href="javascript:void(0);"><svg viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg></a>
            <a href="javascript:void(0);"><svg viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg></a>
          </div>
        </div>
        <div class="re10-team-card">
          <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&w=400&q=80" class="re10-team-img">
          <h3>Sarah Mitchell</h3>
          <p>Medical Coordinator</p>
          <div class="re10-team-social">
            <a href="javascript:void(0);"><svg viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg></a>
            <a href="javascript:void(0);"><svg viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg></a>
          </div>
        </div>
        <div class="re10-team-card">
          <img src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&w=400&q=80" class="re10-team-img">
          <h3>David Chen</h3>
          <p>Education Lead</p>
          <div class="re10-team-social">
            <a href="javascript:void(0);"><svg viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg></a>
            <a href="javascript:void(0);"><svg viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg></a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Contact Form Section -->
  <section class="re10-contact" id="contact">
    <div class="re10-contact-map">
      <!-- Embedded Google Map Placeholder -->
      <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&w=1200&q=80" alt="Map Location">
    </div>
    <div class="re10-contact-form">
      <h2>Get In Touch</h2>
      <p>Want to volunteer, donate, or partner with us? Fill out the form below and our team will get back to you shortly.</p>
      <form onsubmit="event.preventDefault(); document.getElementById('re10-modal-trigger').checked = true;">
        <input type="text" class="re10-input" placeholder="Your Name" required>
        <input type="email" class="re10-input" placeholder="Your Email" required>
        <input type="text" class="re10-input" placeholder="Subject" required>
        <textarea class="re10-input" placeholder="Your Message" rows="5" required></textarea>
        <button type="submit" class="re10-submit">Send Message</button>
      </form>
    </div>
  </section>

  <!-- Footer -->
  <footer class="re10-footer">
    <div class="re10-container">
      <div class="re10-foot-grid">
        <div class="re10-foot-col">
          <a href="javascript:void(0);" class="re10-logo" style="margin-bottom:20px;">
            LOGO_PLACEHOLDER
          </a>
          <p>We are a dedicated non-profit organization striving to bring education, healthcare, and joy to children living in poverty around the world. Join our mission today.</p>
        </div>
       
        <div class="re10-foot-col">
          <h3>Contact Details</h3>
          <div class="re10-foot-contact">
            <div>
              <svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              123 Charity Lane, New York, NY 10001
            </div>
            <div>
              <svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              +1 (800) 123-4567
            </div>
            <div>
              <svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              info@charityfoundation.org
            </div>
          </div>
        </div>
      </div>
      <div class="re10-foot-bottom">
        COPYRIGHT_PLACEHOLDER
      </div>
    </div>
  </footer>

  <!-- Success Modal -->
  <input type="checkbox" id="re10-modal-trigger" class="re10-modal-toggle">
  <div class="re10-modal">
    <div class="re10-modal-content">
      <h3 style="color:#111; margin-bottom:10px;">Message Sent!</h3>
      <p style="color:#666; font-size:0.95rem;">Thank you for reaching out. We appreciate your support and will reply shortly.</p>
      <label for="re10-modal-trigger" class="re10-modal-close">Close</label>
    </div>
  </div>

</div>
`;
