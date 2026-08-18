export const finance06Styles = `
@import url('https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,300;0,400;0,700;0,900;1,400&family=Open+Sans:wght@400;500;600;700&display=swap');

:root {
  --primary: PRIMARY_COLOR_PLACEHOLDER;
  --primary-light: var(--primary);
  --secondary: SECONDARY_COLOR_PLACEHOLDER;
  --bg-color: #fcfcfc;
  --bg-alt: #f4f5f7;
  --text-dark: var(--primary);
  --text-muted: var(--secondary);
  --border-color: #e2e8f0;
}

* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Open Sans', sans-serif; background-color: var(--bg-color); color: var(--text-dark); line-height: 1.6; overflow-x: hidden; }
h1, h2, h3, h4, h5, h6 { font-family: 'Merriweather', serif; color: var(--primary); }

.container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
a { text-decoration: none; color: inherit; transition: 0.3s; }
img { max-width: 100%; display: block; border-radius: 4px; }

/* 1. Top Bar & Main Header */
.top-bar-06 { background: var(--primary); color: #fff; padding: 8px 0; font-size: 12px; }
.top-bar-inner { display: flex; justify-content: space-between; align-items: center; }
.top-bar-links { display: flex; gap: 20px; }
.top-bar-links a:hover { color: var(--secondary); }
.header-06 { background: #fff; border-bottom: 1px solid var(--border-color); padding: 20px 0; position: sticky; top: 0; z-index: 100; box-shadow: 0 4px 10px rgba(0,0,0,0.03); }
.header-06-inner { display: flex; justify-content: space-between; align-items: center; }
.logo-06 { font-family: 'Merriweather', serif; font-size: 24px; font-weight: 900; color: var(--primary); display: flex; align-items: center; gap: 10px; }
.nav-06 { display: flex; gap: 30px; }
.nav-06 a { font-weight: 600; font-size: 14px; text-transform: uppercase; color: var(--text-dark); }
.nav-06 a:hover { color: var(--secondary); }
.btn-06 { background: var(--secondary); color: #fff; padding: 12px 30px; border-radius: 4px; font-weight: 700; text-transform: uppercase; font-size: 14px; display: inline-block; cursor: pointer; border: none; }
.btn-06:hover { background: var(--primary); }

/* 2. Traditional Hero */
.hero-06 { padding: 80px 0 100px; background: url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=2000') center/cover; position: relative; }
.hero-06::before { content: ""; position: absolute; inset: 0; background: linear-gradient(90deg, color-mix(in srgb, var(--primary) 95%, transparent) 0%, color-mix(in srgb, var(--primary) 70%, transparent) 100%); }
.hero-06-content { position: relative; z-index: 2; max-width: 600px; color: #fff; }
.hero-06 h1 { color: #fff; font-size: 39px; font-weight: 700; line-height: 1.2; margin-bottom: 20px; }
.hero-06 p { font-size: 18px; color: #e2e8f0; margin-bottom: 40px; }
.hero-06-btns { display: flex; gap: 15px; }
.btn-06-outline { border: 2px solid #fff; color: #fff; padding: 10px 30px; border-radius: 4px; font-weight: 700; text-transform: uppercase; font-size: 14px; display: inline-block; }
.btn-06-outline:hover { background: #fff; color: var(--primary); }

/* 3. History Timeline */
.history-06 { padding: 100px 0; background: #fff; text-align: center; }
.history-06 h2 { font-size: 28px; margin-bottom: 60px; }
.timeline-06 { display: flex; justify-content: space-between; position: relative; max-width: 1000px; margin: 0 auto; }
.timeline-06::before { content: ""; position: absolute; top: 20px; left: 0; right: 0; height: 2px; background: var(--border-color); z-index: 1; }
.time-node { position: relative; z-index: 2; width: 25%; padding: 0 15px; }
.time-dot { width: 40px; height: 40px; background: var(--primary); color: var(--secondary); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-family: 'Merriweather', serif; font-weight: 700; margin: 0 auto 20px; box-shadow: 0 0 0 5px #fff; }
.time-node h4 { font-size: 18px; margin-bottom: 10px; }
.time-node p { font-size: 14px; color: var(--text-muted); }

/* 4. Core Values */
.values-06 { padding: 100px 0; background: var(--bg-alt); }
.values-06-header { text-align: center; margin-bottom: 60px; }
.values-06-header h2 { font-size: 28px; }
.values-06-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 30px; text-align: center; }
.value-card { background: #fff; padding: 40px 20px; border-radius: 8px; border-top: 4px solid var(--secondary); box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
.value-card i { font-size: 28px; color: var(--primary); margin-bottom: 20px; }
.value-card h3 { font-size: 16px; margin-bottom: 10px; }
.value-card p { font-size: 14px; color: var(--text-muted); }

/* 5. Branch Locator UI */
.locator-06 { padding: 100px 0; }
.locator-container { display: flex; gap: 40px; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.05); border: 1px solid var(--border-color); }
.locator-sidebar { width: 400px; padding: 40px; background: var(--bg-alt); border-right: 1px solid var(--border-color); }
.locator-sidebar h2 { font-size: 24px; margin-bottom: 20px; }
.locator-input { width: 100%; padding: 12px; border: 1px solid var(--border-color); border-radius: 4px; margin-bottom: 20px; font-family: 'Open Sans', sans-serif; }
.branch-list { list-style: none; max-height: 300px; overflow-y: auto; }
.branch-item { padding: 15px; border: 1px solid var(--border-color); background: #fff; margin-bottom: 10px; border-radius: 4px; cursor: pointer; transition: 0.3s; }
.branch-item:hover { border-color: var(--secondary); }
.branch-item h4 { font-size: 16px; margin-bottom: 5px; }
.branch-item p { font-size: 12px; color: var(--text-muted); }
.locator-map { flex: 1; min-height: 400px; background: url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1200') center/cover; }

/* 6. Financial Products */
.products-06 { padding: 100px 0; background: var(--primary); color: #fff; }
.products-06-header { text-align: center; margin-bottom: 60px; }
.products-06-header h2 { font-size: 28px; color: #fff; }
.products-06-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; }
.product-card { background: var(--primary); padding: 40px; border-radius: 8px; text-align: center; transition: 0.3s; }
.product-card:hover { transform: translateY(-5px); background: var(--secondary); }
.product-card h3 { color: var(--secondary); font-size: 19px; margin-bottom: 15px; }
.product-card p { font-size: 14px; margin-bottom: 25px; color: #e2e8f0; }

/* 7. Success Stories */
.stories-06 { padding: 100px 0; background: var(--bg-alt); }
.stories-06 h2 { text-align: center; font-size: 28px; margin-bottom: 60px; }
.stories-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
.story-card { display: flex; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
.story-img { width: 40%; }
.story-img img { width: 100%; height: 100%; object-fit: cover; border-radius: 0; }
.story-content { width: 60%; padding: 40px; }
.story-content h3 { font-size: 17px; margin-bottom: 15px; }
.story-content p { font-size: 14px; color: var(--text-muted); font-style: italic; margin-bottom: 20px; }

/* 8. Security */
.security-06 { padding: 80px 0; background: #fff; text-align: center; border-bottom: 1px solid var(--border-color); }
.security-06 h2 { font-size: 24px; margin-bottom: 40px; }
.security-logos { display: flex; justify-content: center; gap: 60px; opacity: 0.6; }
.security-logos i { font-size: 42px; color: var(--text-dark); }

/* 9. Appointment Booking */
.booking-06 { padding: 100px 0; background: #fff; }
.booking-container { max-width: 800px; margin: 0 auto; text-align: center; }
.booking-container h2 { font-size: 28px; margin-bottom: 20px; }
.booking-container p { color: var(--text-muted); margin-bottom: 40px; }
.booking-form { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; text-align: left; background: #fff; padding: 40px; border-radius: 12px; box-shadow: 0 20px 40px rgba(0,0,0,0.05); border: 1px solid var(--border-color); }
.form-grp { display: flex; flex-direction: column; }
.form-grp label { font-size: 13px; font-weight: 700; margin-bottom: 8px; color: var(--primary); text-transform: uppercase; letter-spacing: 1px; }
.form-grp input, .form-grp select { padding: 16px; border: 1px solid var(--border-color); border-radius: 6px; font-family: 'Open Sans', sans-serif; font-size: 15px; outline: none; transition: 0.3s; background: #f9fafb; color: var(--text-dark); }
.form-grp input:focus, .form-grp select:focus { border-color: var(--primary); background: #fff; box-shadow: 0 0 0 4px color-mix(in srgb, var(--primary) 10%, transparent); }
.form-grp.full { grid-column: span 2; }
.booking-form button { margin-top: 10px; width: 100%; padding: 18px; font-size: 16px; letter-spacing: 1px; border-radius: 6px; box-shadow: 0 10px 20px color-mix(in srgb, var(--secondary) 20%, transparent); }
.booking-form button:hover { transform: translateY(-2px); box-shadow: 0 15px 25px color-mix(in srgb, var(--secondary) 30%, transparent); }

/* 10. Footer */
.footer-06 { background: var(--text-dark); color: #fff; padding: 80px 0 40px; }
.footer-06-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 40px; margin-bottom: 60px; }
.footer-06 h4 { color: var(--secondary); font-size: 18px; margin-bottom: 20px; }
.footer-06-links a { display: block; color: var(--secondary); margin-bottom: 10px; font-size: 14px; }
.footer-06-links a:hover { color: var(--secondary); }
.footer-06-bottom { border-top: 1px solid rgba(255,255,255,0.1); padding-top: 30px; text-align: center; font-size: 12px; color: var(--secondary); }

@media (max-width: 1024px) {
  .values-06-grid, .products-06-grid { grid-template-columns: repeat(2, 1fr); }
  .locator-container { flex-direction: column; }
  .locator-sidebar, .locator-map { width: 100%; }
  .stories-grid, .footer-06-grid { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 768px) {
  .top-bar-06, .nav-06 { display: none; }
  .timeline-06 { flex-direction: column; gap: 40px; align-items: flex-start; margin-left: 20px; }
  .timeline-06::before { top: 0; bottom: 0; left: 20px; width: 2px; height: auto; }
  .time-node { width: 100%; padding-left: 50px; text-align: left; }
  .time-dot { margin: 0; position: absolute; left: 0; top: 0; }
  .values-06-grid, .products-06-grid, .stories-grid, .booking-form, .footer-06-grid { grid-template-columns: 1fr; }
  .story-card { flex-direction: column; }
  .story-img, .story-content { width: 100%; }
  .form-grp.full { grid-column: span 1; }
  .security-logos { flex-wrap: wrap; gap: 30px; }
}
@media (max-width: 768px) {
  .values-06-grid, .products-06-grid { grid-template-columns: 1fr !important; }
  .top-bar-links, .header-06-inner, .nav-06, .locator-container, .story-card { flex-direction: column !important; }
}

`;

export const finance06Html = `
<link href="https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,300;0,400;0,700;0,900;1,400&family=Open+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">

<!-- 1. Top Bar & Header -->
<div class="top-bar-06">
  <div class="container top-bar-inner">
    <div class="top-bar-contact">
      <i class="fa-solid fa-phone"></i> 1-800-BANK-1899 | <i class="fa-solid fa-envelope"></i> client.relations@heritage.com
    </div>
    <div class="top-bar-links">
      <a href="#">Locations</a>
      <a href="#">Careers</a>
      <a href="#">Investor Relations</a>
    </div>
  </div>
</div>
<header class="header-06">
  <div class="container header-06-inner">
    <div class="logo-06">LOGO_PLACEHOLDER</div>
    
    <a href="#login" class="btn-06">Secure Login</a>
  </div>
</header>

<main>
  <!-- 2. Hero Section -->
  <section class="hero-06">
    <div class="container hero-06-content">
      <h1>Tradition. Trust. <br>Stability.</h1>
      <p>Since 1899, Heritage Bank has provided unwavering financial support to families and businesses across generations. Built on a foundation of integrity and conservative risk management.</p>
      <div class="hero-06-btns">
        <a href="#apply" class="btn-06">Open an Account</a>
        <a href="#advisor" class="btn-06-outline">Find an Advisor</a>
      </div>
    </div>
  </section>

  <!-- 3. History Timeline -->
  <section class="history-06" id="about">
    <div class="container">
      <h2>A Legacy of Resilience</h2>
      <div class="timeline-06">
        <div class="time-node">
          <div class="time-dot">1899</div>
          <h4>Foundation</h4>
          <p>Established in the heart of the financial district with $50,000 in capital.</p>
        </div>
        <div class="time-node">
          <div class="time-dot">1933</div>
          <h4>The Great Depression</h4>
          <p>Remained solvent and never missed a withdrawal request during the banking crisis.</p>
        </div>
        <div class="time-node">
          <div class="time-dot">1985</div>
          <h4>National Expansion</h4>
          <p>Expanded operations to 40 states, offering commercial and personal credit.</p>
        </div>
        <div class="time-node">
          <div class="time-dot">Today</div>
          <h4>Modern Banking</h4>
          <p>Managing over $50B in assets with state-of-the-art digital infrastructure.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- 4. Core Values -->
  <section class="values-06">
    <div class="container">
      <div class="values-06-header">
        <h2>Our Core Principles</h2>
      </div>
      <div class="values-06-grid">
        <div class="value-card">
          <i class="fa-solid fa-scale-balanced"></i>
          <h3>Integrity First</h3>
          <p>We prioritize ethical conduct and transparency over short-term gains.</p>
        </div>
        <div class="value-card">
          <i class="fa-solid fa-shield-halved"></i>
          <h3>Prudent Risk</h3>
          <p>Conservative capital allocation ensures your deposits are strictly protected.</p>
        </div>
        <div class="value-card">
          <i class="fa-solid fa-handshake-angle"></i>
          <h3>Service Excellence</h3>
          <p>Dedicated relationship managers providing bespoke financial guidance.</p>
        </div>
        <div class="value-card">
          <i class="fa-solid fa-people-roof"></i>
          <h3>Community Focus</h3>
          <p>Reinvesting in the local neighborhoods and businesses we serve.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- 5. Branch Locator -->
  <section class="locator-06">
    <div class="container">
      <div class="locator-container">
        <div class="locator-sidebar">
          <h2>Find a Branch</h2>
          <input type="text" class="locator-input" placeholder="Enter ZIP Code or City">
          <ul class="branch-list">
            <li class="branch-item">
              <h4>Main Office (Headquarters)</h4>
              <p>120 Financial District Ave, NY</p>
              <p>Open Today: 9:00 AM - 5:00 PM</p>
            </li>
            <li class="branch-item">
              <h4>Uptown Branch</h4>
              <p>450 Park Avenue, NY</p>
              <p>Open Today: 9:00 AM - 4:30 PM</p>
            </li>
            <li class="branch-item">
              <h4>Westside Wealth Center</h4>
              <p>88 Riverside Blvd, NY</p>
              <p>By Appointment Only</p>
            </li>
          </ul>
        </div>
        <div class="locator-map"></div>
      </div>
    </div>
  </section>

  <!-- 6. Products -->
  <section class="products-06" id="banking">
    <div class="container">
      <div class="products-06-header">
        <h2>Financial Solutions</h2>
      </div>
      <div class="products-06-grid">
        <div class="product-card">
          <h3>Heritage Checking</h3>
          <p>Fee-free banking for high-balance accounts with unlimited global ATM fee reimbursements and premium checks.</p>
          <a href="#" class="btn-06-outline">Learn More</a>
        </div>
        <div class="product-card">
          <h3>Estate Planning</h3>
          <p>Comprehensive wealth transfer strategies, trust administration, and philanthropic advisory services.</p>
          <a href="#" class="btn-06-outline">Learn More</a>
        </div>
        <div class="product-card">
          <h3>Commercial Lending</h3>
          <p>Tailored credit facilities, equipment financing, and commercial real estate loans for growing enterprises.</p>
          <a href="#" class="btn-06-outline">Learn More</a>
        </div>
      </div>
    </div>
  </section>

  <!-- 7. Success Stories -->
  <section class="stories-06">
    <div class="container">
      <h2>Generations of Success</h2>
      <div class="stories-grid">
        <div class="story-card">
          <div class="story-img"><img src="https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=400" alt="Client"></div>
          <div class="story-content">
            <h3>The Miller Family Trust</h3>
            <p>"Heritage Bank has managed our family's estate for three generations. Their steady hand during volatile markets gives us absolute peace of mind."</p>
            <strong>- James Miller, CEO</strong>
          </div>
        </div>
        <div class="story-card">
          <div class="story-img"><img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400" alt="Business"></div>
          <div class="story-content">
            <h3>Apex Manufacturing</h3>
            <p>"When we needed capital to expand our facility, the big banks relied on algorithms. Heritage relied on relationships. They funded our growth."</p>
            <strong>- Robert Vance, Founder</strong>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- 8. Security Certifications -->
  <section class="security-06">
    <div class="container">
      <h2>Uncompromising Security</h2>
      <div class="security-logos">
        <i class="fa-solid fa-lock" title="256-bit Encryption"></i>
        <i class="fa-solid fa-fingerprint" title="Biometric Authentication"></i>
        <i class="fa-solid fa-building-columns" title="FDIC Insured"></i>
        <i class="fa-solid fa-shield-virus" title="Fraud Protection"></i>
      </div>
    </div>
  </section>

  <!-- 9. Appointment Booking -->
  <section class="booking-06" id="advisor">
    <div class="container booking-container">
      <h2>Schedule a Consultation</h2>
      <p>Speak with a dedicated relationship manager to discuss your financial goals.</p>
      <form class="booking-form" onsubmit="event.preventDefault();">
        <div class="form-grp">
          <label>First Name</label>
          <input type="text" required>
        </div>
        <div class="form-grp">
          <label>Last Name</label>
          <input type="text" required>
        </div>
        <div class="form-grp">
          <label>Email Address</label>
          <input type="email" required>
        </div>
        <div class="form-grp">
          <label>Phone Number</label>
          <input type="tel" required>
        </div>
        <div class="form-grp full">
          <label>Topic of Discussion</label>
          <select required>
            <option value="">Select a topic...</option>
            <option>Wealth Management</option>
            <option>Commercial Loan</option>
            <option>Estate Planning</option>
            <option>General Banking</option>
          </select>
        </div>
        <div class="form-grp full">
          <button type="submit" class="btn-06">Request Appointment</button>
        </div>
      </form>
    </div>
  </section>
</main>

<!-- 10. Footer -->
<footer class="footer-06">
  <div class="container">
    <div class="footer-06-grid">
      <div>
        <div class="logo-06" style="color: var(--secondary); margin-bottom: 20px;">LOGO_PLACEHOLDER</div>
        <p style="font-size: 14px; color: var(--secondary); line-height: 1.8;">Heritage Bank is a Member FDIC and an Equal Housing Lender. Providing stable, conservative financial services since 1899.</p>
      </div>
      
      
      
    </div>
    <div class="footer-06-bottom">
      &copy; 2026 Heritage Bank N.A. All rights reserved. Deposits are insured by the FDIC up to the maximum permitted by law.
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
          var modalHtml = '<div id="preview-mode-modal" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 999999; display: flex; align-items: center; justify-content: center; background: color-mix(in srgb, var(--primary) 70%, transparent); backdrop-filter: blur(8px); opacity: 0; animation: pModalFadeIn 0.3s forwards; font-family: system-ui, -apple-system, sans-serif;"><div style="background: #ffffff; width: 90%; max-width: 400px; border-radius: 20px; padding: 32px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); text-align: center; transform: scale(0.95); animation: pModalScaleUp 0.3s forwards;"><div style="width: 60px; height: 60px; background: #FEF2F2; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;"><svg style="width: 30px; height: 30px; color: var(--secondary);" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg></div><h3 style="font-size: 16px; font-weight: 700; color: var(--primary); margin: 0 0 12px; letter-spacing: -0.02em;">Preview Mode Active</h3><p style="font-size: 15px; color: var(--secondary); margin: 0 0 28px; line-height: 1.5;">Form submissions are disabled in preview mode. Publish your page to accept real submissions.</p><button onclick="document.getElementById(\\'preview-mode-modal\\').remove()" style="width: 100%; background: var(--primary); color: #ffffff; border: none; padding: 14px; border-radius: 12px; font-size: 15px; font-weight: 600; cursor: pointer; transition: background 0.2s;" onmouseover="this.style.background=\\'var(--primary)\\'" onmouseout="this.style.background=\\'var(--primary)\\'">Got it, close</button></div><style>@keyframes pModalFadeIn { to { opacity: 1; } } @keyframes pModalScaleUp { to { transform: scale(1); } }</style></div>';
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
                input.style.outline = '2px solid var(--primary)';
                input.style.outlineOffset = '1px';
                input.style.borderColor = 'var(--primary)';
                if (input.nextElementSibling && input.nextElementSibling.classList.contains('val-error')) {
                  input.nextElementSibling.style.display = 'none';
                }
              } else {
                input.style.outline = '2px solid var(--secondary)';
                input.style.outlineOffset = '1px';
                input.style.borderColor = 'var(--secondary)';
                if (input.nextElementSibling && input.nextElementSibling.classList.contains('val-error')) {
                  input.nextElementSibling.style.display = 'block';
                }
              }
            });
          }

          if (!input.value.trim() && input.hasAttribute('required')) {
            isValid = false;
            input.style.outline = '2px solid var(--secondary)';
            input.style.outlineOffset = '1px';
            input.style.borderColor = 'var(--secondary)';
            
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
              err.style.color = 'var(--secondary)';
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
            e.target.innerHTML = '<div class="tpl-templates01-13" style="padding: 20px; text-align: center; color: var(--primary);"><h3 style="margin: 0 0 10px 0; font-size: 16px;">Thank You!</h3><p style="margin: 0;">Your request has been submitted successfully.</p></div>';
          }, 1000);
        }
      }
    }, true);
  })();
</script>
`;
