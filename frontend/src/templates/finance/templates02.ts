// Master Template — PROJECT_NAME_PLACEHOLDER
// Institutional Grade Corporate Design — Focused on Trust, Clarity, and Professionalism
// Inspired by Global Investment Banks and Asset Management Firms

export const finance02Styles = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Public+Sans:wght@300;400;500;600;700&display=swap');

:root {
  --primary: PRIMARY_COLOR_PLACEHOLDER;
  --secondary: SECONDARY_COLOR_PLACEHOLDER;
  --accent: var(--primary);
  --slate: #475569;
  --bg-light: #fdfdfd;
  --border: #e2e8f0;
  --text-dark: var(--secondary);
}

* { box-sizing: border-box; margin: 0; padding: 0; transition: all 0.3s ease; }

html { scroll-behavior: smooth; }

body { 
  font-family: 'Public Sans', sans-serif; 
  background: var(--bg-light); 
  color: var(--text-dark); 
  line-height: 1.7; 
  overflow-x: hidden;
}

h1, h2, h3 { 
  font-family: 'Playfair Display', serif; 
  font-weight: 700; 
  color: var(--secondary); 
}

.container { 
  max-width: 1200px; 
  margin: 0 auto; 
  padding: 0 2rem; 
}

.section-padding { padding: 8rem 0; }

.text-accent { color: var(--accent); }

/* NAVBAR */
.nav {
  position: absolute;
  top: 0; left: 0; right: 0;
  z-index: 1000;
  padding: 2rem 0;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

.nav-inner { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; }
.logo { font-size: 1.4rem; font-weight: 700; color: #fff; letter-spacing: 1px; text-transform: uppercase; }

.nav-links { display: flex; flex-wrap: wrap; gap: 3rem; align-items: center; }
.nav-links a { text-decoration: none; color: #fff; font-size: 0.85rem; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; opacity: 0.8; }
.nav-links a:hover { opacity: 1; }

.btn-nav {
  background: var(--btn-bg, var(--primary)) ;
  color: var(--btn-text, #fff) ;
  padding: 0.9rem 2.5rem;
  font-weight: 700;
  text-decoration: none;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* CORPORATE HERO */
.hero {
  height: 90vh;
  min-height: 800px;
  background: var(--secondary) ;
  display: flex; flex-wrap: wrap;
  align-items: center;
  position: relative;
  color: #fff;
  overflow: hidden;
}

.hero-overlay {
  position: absolute;
  inset: 0;
}

.hero-content {
  position: relative;
  z-index: 10;
  max-width: 800px;
}

.hero h1 { 
  font-size: clamp(3rem, 5vw, 4.5rem); 
  color: #fff; 
  margin-bottom: 2rem; 
  line-height: 1.1;
}

.hero p { 
  font-size: 1.25rem; 
  color: rgba(255,255,255,0.7); 
  margin-bottom: 3.5rem; 
  max-width: 600px;
  font-weight: 300;
}

.hero-btns { display: flex; flex-wrap: wrap; gap: 1.5rem; }
.btn-hero-primary { background: var(--btn-bg, var(--primary)) ; color: var(--btn-text, #fff) ; padding: 1.2rem 3rem; font-weight: 700; text-decoration: none; border-radius: 0; text-transform: uppercase; letter-spacing: 1px; }
.btn-hero-outline { border: 1px solid #fff; color: #fff; padding: 1.2rem 3rem; font-weight: 700; text-decoration: none; text-transform: uppercase; letter-spacing: 1px; }
.btn-hero-outline:hover { background: #fff; color: var(--secondary); }

/* INSTITUTIONAL FORM SECTION */
.form-section {
  background: #fff;
  padding: 6rem;
  margin-top: -100px;
  position: relative;
  z-index: 20;
  box-shadow: 0 40px 100px rgba(0,0,0,0.1);
  border-top: 5px solid var(--primary);
}

.form-grid { display: grid; grid-template-columns: 1fr 2fr; gap: 4rem; align-items: center; }

.form-text h2 { font-size: 2.5rem; margin-bottom: 1.5rem; }
.form-text p { color: var(--slate); margin-bottom: 2rem; }

.contact-form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.form-group { display: flex; flex-wrap: wrap; flex-direction: column; gap: 0.5rem; }
.form-group.full { grid-column: span 2; }
.form-group label { font-weight: 700; font-size: 0.8rem; text-transform: uppercase; color: var(--slate); letter-spacing: 1px; }
.form-group input, .form-group select {
  padding: 1rem;
  border: 1px solid var(--border);
  outline: none;
  font-family: inherit;
  font-size: 1rem;
  color: var(--secondary);
}
.form-group input:focus { border-color: var(--primary); }

.btn-form {
  grid-column: span 2;
  background: var(--btn-bg, var(--primary));
  color: var(--btn-text, #fff);
  padding: 1.2rem;
  border: none;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  cursor: pointer;
}
.btn-form:hover { background: var(--secondary) !important; color: var(--btn-text, #fff) !important; }

/* TRUST SECTION */
.trust-logos { padding: 4rem 0; border-bottom: 1px solid var(--border); }
.logo-flex { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; opacity: 1; filter: grayscale(0); color: #000; }
.logo-flex img { height: 30px; }

/* SERVICES GRID */
.services-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 4rem; }
.service-item { border-left: 2px solid #000; padding-left: 2rem; }
.service-item:hover { border-left-color: var(--primary); transform: translateX(10px); }
.service-item span { color: var(--primary); font-weight: 700; font-size: 0.9rem; }
.service-item h3 { font-size: 1.5rem; margin: 1rem 0; }
.service-item p { color: var(--slate); font-size: 0.95rem; }

/* EXPERTISE CONTENT */
.expertise-block { display: grid; grid-template-columns: 1fr 1fr; gap: 6rem; align-items: center; }
.expertise-img { height: 600px; }

/* FOOTER */
.footer {
  background: var(--secondary);
  color: #fff;
  padding: 6rem 0 3rem;
}

.footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 4rem; margin-bottom: 4rem; }
.footer-logo { font-size: 1.4rem; font-weight: 700; margin-bottom: 1.5rem; text-transform: uppercase; }
.footer-p { color: rgba(255,255,255,0.5); font-size: 0.9rem; max-width: 300px; }
.footer h4 { color: #fff; font-family: 'Public Sans', sans-serif; font-size: 0.9rem; text-transform: uppercase; margin-bottom: 1.5rem; letter-spacing: 1px; }
.footer ul { list-style: none; }
.footer ul li { margin-bottom: 0.8rem; }
.footer ul li a { color: rgba(255,255,255,0.5); text-decoration: none; font-size: 0.9rem; }
.footer ul li a:hover { color: #fff; }

.footer-bottom { border-top: 1px solid rgba(255,255,255,0.05); padding-top: 3rem; text-align: center; color: rgba(255,255,255,0.3); font-size: 0.8rem; }

/* GLOBAL PRESENCE */
.global-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 4rem; text-align: center; }
.global-item h3 { font-size: 3rem; color: var(--accent); margin-bottom: 1rem; }
.global-item p { text-transform: uppercase; letter-spacing: 2px; font-weight: 700; font-size: 0.8rem; color: var(--slate); }

/* CORE VALUES */
.values-section { background: var(--primary) ; color: #fff; text-align: center; }
.values-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 3rem; margin-top: 4rem; }
.value-card { padding: 3rem; border: 1px solid rgba(255,255,255,0.1); }
.value-card:hover { background: rgba(255,255,255,0.05); border-color: var(--primary); }
.value-card i { font-size: 2rem; color: var(--accent); margin-bottom: 2rem; display: block; }
.value-card h4 { font-family: 'Public Sans', sans-serif; font-size: 1rem; text-transform: uppercase; letter-spacing: 2px; }

/* MINIMAL CTA */
.cta-minimal { background: #fff; text-align: center; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
.cta-minimal h2 { font-size: 3rem; margin-bottom: 2rem; }
.btn-cta-dark { background: var(--secondary); color: #fff; padding: 1.2rem 4rem; text-decoration: none; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; display: inline-block; }
.btn-cta-dark:hover { background: var(--accent); }

@media (max-width: 1024px) {
  .hero-content { text-align: center; margin: 0 auto; }
  .hero-btns { justify-content: center; }
  .form-grid { grid-template-columns: 1fr; padding: 3rem; }
  .services-grid { grid-template-columns: 1fr 1fr; }
  .expertise-block { grid-template-columns: 1fr; }
  .global-grid { grid-template-columns: 1fr; gap: 3rem; }
  .values-grid { grid-template-columns: 1fr 1fr; }
  .nav-links { display: none; }
}

@media (max-width: 640px) {
  .services-grid { grid-template-columns: 1fr; }
  .contact-form { grid-template-columns: 1fr; }
  .form-group.full { grid-column: span 1; }
  .btn-form { grid-column: span 1; }
}


  /* Extracted Template Inline Styles */
  .tpl-templates02-1 { background: linear-gradient(rgba(10, 25, 47, 0.7), rgba(10, 25, 47, 0.9)); }
  .tpl-templates02-2 { color: var(--gold); }
  .tpl-templates02-3 { color: var(--slate); }
  .tpl-templates02-4 { color: #000; }
  .tpl-templates02-5 { color: var(--gold); }
  .tpl-templates02-6 { background: #f8fafc; }
  .tpl-templates02-7 { color: var(--gold); }
  .tpl-templates02-8 { color: var(--slate); }
  .tpl-templates02-9 { background: var(--gold); }
  .tpl-templates02-10 { background: var(--gold); }
  .tpl-templates02-11 { background: var(--gold); }
  .tpl-templates02-12 { color: SECONDARY_COLOR_PLACEHOLDER; border-bottom: 2px solid var(--gold); }
  .tpl-templates02-13 { color: var(--gold); }
  .tpl-templates02-14 { color: #fff; }
  .tpl-templates02-15 { color: var(--gold); }
  .tpl-templates02-16 { border: 2px dashed #22c55e; border-radius: 8px; background: rgba(34,197,94,0.1); color: #166534; }
`;

export const finance02Html = `
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Public+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">

<nav class="nav">
  <div class="container nav-inner">
    <div class="logo" style="display: flex; flex-wrap: wrap; align-items: center; gap: 1rem;">
      <span style="font-size: 1.2rem; font-weight: 800; letter-spacing: 2px;">LOGO_PLACEHOLDER</span>
    </div>
  </div>
</nav>

<section class="hero">
  <div class="hero-overlay" style="overflow: hidden;">
    <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1600" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: 1;" alt="Hero Background">
    <div class="tpl-templates02-1" style="position: absolute; inset: 0; z-index: 2"></div>
  </div>
  <div class="container">
    <div class="hero-content">
      <h1>Preserving Wealth. <br>Building <span class="text-gold">Legacies.</span></h1>
      <p>Global institutional-grade investment management and strategic advisory for multi-generational success.</p>
      <div class="hero-btns">
        <a href="#contact" class="btn-hero-primary">Our Expertise</a>
        <a href="#about" class="btn-hero-outline">Learn More</a>
      </div>
    </div>
  </div>
</section>

<section class="container" id="contact">
  <div class="form-section">
    <div class="form-grid">
      <div class="form-text">
        <span class="tpl-templates02-2" style="font-weight: 700; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 2px">Inquiry</span>
        <h2>Begin Your Consultation</h2>
        <p>Connect with our senior advisors for a comprehensive analysis of your global financial objectives.</p>
        <div style="margin-top: 2rem;">
          <h4 style="font-size: 1.1rem; margin-bottom: 0.5rem;">Corporate HQ</h4>
          <p class="tpl-templates02-3" style="font-size: 0.9rem">ADDRESS_PLACEHOLDER</p>
        </div>
      </div>
      <form class="contact-form">
        <div class="form-group">
          <label>First Name</label>
          <input type="text" name="first_name" placeholder="John" required>
        </div>
        <div class="form-group">
          <label>Last Name</label>
          <input type="text" name="last_name" placeholder="Doe" required>
        </div>
        <div class="form-group full">
          <label>Inquiry Type</label>
          <select name="inquiry_type" required>
            <option>Investment Management</option>
            <option>Wealth Planning</option>
            <option>Corporate Advisory</option>
          </select>
        </div>
        <div class="form-group full">
          <label>Email Address</label>
          <input type="email" name="email_address" placeholder="john@firm.com" required>
        </div>
        <button type="submit" class="btn-form">Request Consultation</button>
      </form>
    </div>
  </div>
</section>

<div class="container">
  <div class="trust-logos">
    <div class="logo-flex tpl-templates02-4"  >
      <span style="font-weight:800;font-size:0.9rem;letter-spacing:2px">GOLDMAN SACHS</span>
      <span style="font-weight:800;font-size:0.9rem;letter-spacing:2px">JP MORGAN</span>
      <span style="font-weight:800;font-size:0.9rem;letter-spacing:2px">MORGAN STANLEY</span>
      <span style="font-weight:800;font-size:0.9rem;letter-spacing:2px">UBS</span>
    </div>
  </div>
</div>

<section class="section-padding container" id="services">
  <div style="text-align: center; margin-bottom: 6rem;">
    <span class="tpl-templates02-5" style="font-weight: 700; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 3px">Areas of Expertise</span>
    <h2 style="font-size: 3.5rem; margin-top: 1.5rem;">Unrivaled Financial <br>Intelligence</h2>
  </div>

  <div class="services-grid">
    <div class="service-item">
      <span>01</span>
      <h3>Asset Management</h3>
      <p>Precision-engineered portfolios tailored to your risk profile and long-term capital preservation goals.</p>
    </div>
    <div class="service-item">
      <span>02</span>
      <h3>Wealth Strategy</h3>
      <p>Comprehensive estate and tax optimization strategies designed to protect your global interests across generations.</p>
    </div>
    <div class="service-item">
      <span>03</span>
      <h3>Corporate Advisory</h3>
      <p>Navigating mergers, acquisitions, and complex capital structures with unmatched institutional experience.</p>
    </div>
  </div>
</section>

<section class="section-padding tpl-templates02-6"   id="about">
  <div class="container expertise-block">
    <div class="expertise-img" style="position: relative; overflow: hidden;">
      <img src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1200" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;" alt="Expertise Background">
    </div>
    <div class="expertise-content">
      <span class="tpl-templates02-7" style="font-weight: 700; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 2px">Our Heritage</span>
      <h2 style="font-size: 3rem; margin: 1.5rem 0;">A Tradition of <br>Excellence.</h2>
      <p class="tpl-templates02-8" style="font-size: 1.1rem; margin-bottom: 2rem">For over three decades, we have been the trusted partner for global families and institutions, providing the clarity needed to navigate complex financial landscapes.</p>
      <ul style="list-style: none; display: flex; flex-wrap: wrap; flex-direction: column; gap: 1rem; margin-bottom: 3rem;">
        <li style="display: flex; flex-wrap: wrap; gap: 1rem; align-items: center; font-weight: 700;"><div class="tpl-templates02-9" style="width: 20px; height: 1px"></div> Institutional Risk Management</li>
        <li style="display: flex; flex-wrap: wrap; gap: 1rem; align-items: center; font-weight: 700;"><div class="tpl-templates02-10" style="width: 20px; height: 1px"></div> Global Market Access</li>
        <li style="display: flex; flex-wrap: wrap; gap: 1rem; align-items: center; font-weight: 700;"><div class="tpl-templates02-11" style="width: 20px; height: 1px"></div> Discreet Advisory Services</li>
      </ul>
      <a href="#contact" class="tpl-templates02-12" style="font-weight: 800; text-decoration: none; padding-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 1px; font-size: 0.8rem">View Our Report</a>
    </div>
  </div>
</section>

<section class="section-padding container">
  <div class="global-grid">
    <div class="global-item">
      <h3>$4.2B</h3>
      <p>Assets Under Advisory</p>
    </div>
    <div class="global-item">
      <h3>12+</h3>
      <p>International Offices</p>
    </div>
    <div class="global-item">
      <h3>98%</h3>
      <p>Client Retention Rate</p>
    </div>
  </div>
</section>

<section class="section-padding values-section">
  <div class="container">
    <span class="tpl-templates02-13" style="font-weight: 700; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 3px">Philosophy</span>
    <h2 class="tpl-templates02-14" style="font-size: 3rem; margin-top: 1.5rem">The Pillars of Our Success</h2>
    <div class="values-grid">
      <div class="value-card">
        <i class="fa-solid fa-shield-halved"></i>
        <h4>Integrity</h4>
      </div>
      <div class="value-card">
        <i class="fa-solid fa-gem"></i>
        <h4>Excellence</h4>
      </div>
      <div class="value-card">
        <i class="fa-solid fa-eye-slash"></i>
        <h4>Discretion</h4>
      </div>
      <div class="value-card">
        <i class="fa-solid fa-chart-line"></i>
        <h4>Vision</h4>
      </div>
    </div>
  </div>
</section>

<section class="section-padding cta-minimal">
  <div class="container">
    <span class="tpl-templates02-15" style="font-weight: 700; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 3px">Next Steps</span>
    <h2 style="margin: 1.5rem 0 3rem;">Ready to Secure Your <br>Financial Future?</h2>
    <a href="#contact" class="btn-cta-dark">Request an Introduction</a>
  </div>
</section>

<footer class="footer">
  <div class="container footer-grid">
    <div>
      <div class="footer-logo" style="display: flex; flex-wrap: wrap; align-items: center; gap: 1rem;">
        <span style="font-size: 1.1rem; font-weight: 800; letter-spacing: 1px;">LOGO_PLACEHOLDER</span>
      </div>
      <p class="footer-p">A global investment and advisory firm dedicated to the preservation and expansion of institutional and private wealth.</p>
    </div>
    <div class="footer-links">
      <h4>Intelligence</h4>
      <ul>
        <li><a href="#">Market Analysis</a></li>
        <li><a href="#">Economic Outlook</a></li>
        <li><a href="#">Strategic Reports</a></li>
      </ul>
    </div>
    <div class="footer-links">
      <h4>The Firm</h4>
      <ul>
        <li><a href="#">Our Heritage</a></li>
        <li><a href="#">Leadership</a></li>
        <li><a href="#">Global Offices</a></li>
      </ul>
    </div>
    <div class="footer-links">
      <h4>Inquiries</h4>
      <ul>
        <li><a href="#">Contact Us</a></li>
        <li><a href="#">Client Portal</a></li>
        <li><a href="#">Media Center</a></li>
      </ul>
    </div>
  </div>
  <div class="container footer-bottom">
    <p>© 2026 PROJECT_NAME_PLACEHOLDER. All Rights Reserved. Member FINRA/SIPC. Disclosures and Privacy Policy.</p>
  </div>
</footer>


<script id="core-interactions">
  (function() {
    // Check if we are inside GrapesJS editor
    var isInEditor = !!document.querySelector('[data-gjs-type]') || document.body.classList.contains('gjs-dashed');
    
    // Form Validation (runs everywhere so you can see red borders in editor)
    document.addEventListener('submit', function(e) {
      if (e.target.tagName === 'FORM') {
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
        
        if (!isValid || isInEditor) {
          e.preventDefault();
          e.stopImmediatePropagation();
          if (isInEditor) {
            var existingModal = document.getElementById("preview-mode-modal");
            if (existingModal) existingModal.remove();
            var modalHtml = '<div id="preview-mode-modal" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 999999; display: flex; align-items: center; justify-content: center; background: rgba(15, 23, 42, 0.7); backdrop-filter: blur(8px); opacity: 0; animation: pModalFadeIn 0.3s forwards; font-family: system-ui, -apple-system, sans-serif;"><div style="background: #ffffff; width: 90%; max-width: 400px; border-radius: 20px; padding: 32px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); text-align: center; transform: scale(0.95); animation: pModalScaleUp 0.3s forwards;"><div style="width: 60px; height: 60px; background: #FEF2F2; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;"><svg style="width: 30px; height: 30px; color: #EF4444;" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg></div><h3 style="font-size: 20px; font-weight: 700; color: #0F172A; margin: 0 0 12px; letter-spacing: -0.02em;">Preview Mode Active</h3><p style="font-size: 15px; color: #64748B; margin: 0 0 28px; line-height: 1.5;">Form submissions are disabled in preview mode. Publish your page to accept real submissions.</p><button onclick="document.getElementById(&apos;preview-mode-modal&apos;).remove()" style="width: 100%; background: #0F172A; color: #ffffff; border: none; padding: 14px; border-radius: 12px; font-size: 15px; font-weight: 600; cursor: pointer; transition: background 0.2s;" onmouseover="this.style.background=&apos;#1E293B&apos;" onmouseout="this.style.background=&apos;#0F172A&apos;">Got it, close</button></div><style>@keyframes pModalFadeIn { to { opacity: 1; } } @keyframes pModalScaleUp { to { transform: scale(1); } }</style></div>';
            document.body.insertAdjacentHTML("beforeend", modalHtml);
          }
          e.preventDefault();
          e.stopImmediatePropagation();
        } else if (!isInEditor) {
          e.preventDefault();
          var btn = e.target.querySelector('button[type="submit"]') || e.target.querySelector('input[type="submit"]');
          if (btn) {
            if(btn.innerText) btn.innerText = 'Sending...';
            else btn.value = 'Sending...';
          }
          setTimeout(function() {
            e.target.innerHTML = '<div class="tpl-templates02-16" style="padding: 20px; text-align: center"><h3 style="margin: 0 0 10px 0; font-size: 20px;">Thank You!</h3><p style="margin: 0;">Your request has been submitted successfully.</p></div>';
          }, 1000);
        }
      }
    }, true);
  })();
</script>

`
