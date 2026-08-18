export const finance05Styles = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,800&family=Public+Sans:wght@400;600;800&display=swap');

:root {
  --primary: PRIMARY_COLOR_PLACEHOLDER;
  --secondary: SECONDARY_COLOR_PLACEHOLDER;
  --accent-yellow: var(--secondary);
  --accent-blue: var(--primary);
  --accent-green: var(--primary);
  --bg-color: #ffffff;
  --text-dark: #111111;
  --border-thick: 4px solid #111;
  --shadow-hard: 6px 6px 0px #111;
  --shadow-hover: 2px 2px 0px #111;
}

* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Public Sans', sans-serif; background-color: var(--bg-color); color: var(--text-dark); line-height: 1.6; overflow-x: hidden; }
h1, h2, h3, h4, h5, h6 { font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; text-transform: uppercase; }

.container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
a { text-decoration: none; color: inherit; transition: 0.2s; }
img { max-width: 100%; border: var(--border-thick); box-shadow: var(--shadow-hard); display: block; }

/* 1. Bold Header */
.header-05 { border-bottom: var(--border-thick); background: var(--bg-color); position: sticky; top: 0; z-index: 100; }
.header-05-inner { display: flex; justify-content: space-between; align-items: center; padding: 15px 0; }
.logo-05 { font-family: 'Bricolage Grotesque', sans-serif; font-size: 24px; font-weight: 800; text-transform: uppercase; letter-spacing: -1px; background: var(--accent-yellow); padding: 5px 15px; border: var(--border-thick); box-shadow: 4px 4px 0px #111; }
.nav-05 { display: flex; gap: 30px; }
.nav-05 a { font-weight: 800; text-transform: uppercase; font-size: 16px; border-bottom: 2px solid transparent; }
.nav-05 a:hover { border-bottom: 2px solid var(--text-dark); }
.btn-05 { background: var(--secondary); color: #fff; border: var(--border-thick); padding: 10px 24px; font-weight: 800; text-transform: uppercase; box-shadow: var(--shadow-hard); cursor: pointer; display: inline-block; }
.btn-05:hover { transform: translate(4px, 4px); box-shadow: var(--shadow-hover); }

/* 2. Marquee Hero */
.hero-05 { padding: 80px 0; border-bottom: var(--border-thick); background: #f4f4f4; text-align: center; overflow: hidden; position: relative; }
.hero-05 h1 { font-size: clamp(2.8rem, 7vw, 5.6rem); line-height: 1; letter-spacing: -3px; text-shadow: 4px 4px 0px var(--accent-yellow); margin-bottom: 30px; position: relative; z-index: 2; }
.hero-05 p { font-size: 19px; font-weight: 600; max-width: 600px; margin: 0 auto 40px; position: relative; z-index: 2; }
.marquee-container { border-top: var(--border-thick); border-bottom: var(--border-thick); background: var(--accent-yellow); padding: 15px 0; display: flex; overflow: hidden; white-space: nowrap; margin-top: 60px; }
.marquee-text { font-family: 'Bricolage Grotesque', sans-serif; font-size: 24px; font-weight: 800; display: inline-block; padding-right: 50px; animation: scroll-left 10s linear infinite; text-transform: uppercase; }
@keyframes scroll-left { 0% { transform: translateX(0); } 100% { transform: translateX(-100%); } }

/* 3. Colorful Service Cards */
.services-05 { padding: 100px 0; border-bottom: var(--border-thick); background: var(--bg-color); }
.services-05 h2 { font-size: 44px; margin-bottom: 60px; text-align: center; }
.srv-05-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; }
.srv-card-05 { border: var(--border-thick); padding: 40px; box-shadow: var(--shadow-hard); transition: 0.2s; }
.srv-card-05:nth-child(1) { background: var(--accent-blue); color: #fff; }
.srv-card-05:nth-child(2) { background: var(--accent-green); color: #fff; }
.srv-card-05:nth-child(3) { background: var(--secondary); color: #fff; }
.srv-card-05:hover { transform: translate(-4px, -4px); box-shadow: 10px 10px 0px #111; }
.srv-card-05 i { font-size: 33px; margin-bottom: 20px; color: #111; }
.srv-card-05 h3 { font-size: 24px; margin-bottom: 15px; color: inherit; }
.srv-card-05 p { font-size: 16px; font-weight: 600; }

/* 4. Comparison Table */
.compare-05 { padding: 100px 0; border-bottom: var(--border-thick); background: #eee; }
.compare-05 h2 { font-size: 44px; margin-bottom: 40px; text-align: center; }
.compare-table { width: 100%; border-collapse: collapse; border: var(--border-thick); background: #fff; box-shadow: var(--shadow-hard); }
.compare-table th, .compare-table td { border: var(--border-thick); padding: 20px; text-align: center; font-weight: 600; font-size: 18px; }
.compare-table th { font-family: 'Bricolage Grotesque', sans-serif; font-size: 19px; text-transform: uppercase; background: var(--accent-yellow); }
.compare-table td:first-child { text-align: left; background: #f9f9f9; }

/* 5. Step-by-Step Process */
.process-05 { padding: 100px 0; border-bottom: var(--border-thick); overflow: hidden; }
.process-05 h2 { font-size: 44px; margin-bottom: 60px; padding-left: 20px; }
.process-wrapper { display: flex; gap: 40px; overflow-x: auto; padding: 20px; scroll-snap-type: x mandatory; }
.process-step { min-width: 400px; border: var(--border-thick); background: #fff; padding: 40px; box-shadow: var(--shadow-hard); scroll-snap-align: start; }
.process-num { font-size: 56px; font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; color: var(--accent-blue); line-height: 1; margin-bottom: 20px; text-shadow: 4px 4px 0px #111; }
.process-step h3 { font-size: 24px; margin-bottom: 15px; }

/* 6. Big Stats Blocks */
.stats-05 { display: flex; border-bottom: var(--border-thick); }
.stat-block { flex: 1; border-right: var(--border-thick); padding: 80px 40px; text-align: center; background: #fff; }
.stat-block:last-child { border-right: none; }
.stat-block:nth-child(even) { background: var(--accent-yellow); }
.stat-block h4 { font-size: 56px; margin-bottom: 10px; line-height: 1; letter-spacing: -2px; }
.stat-block p { font-size: 16px; font-weight: 800; text-transform: uppercase; }

/* 7. Animated Trust Logos */
.trust-05 { padding: 60px 0; border-bottom: var(--border-thick); background: #111; color: #fff; overflow: hidden; }
.trust-05 h2 { font-size: 24px; text-align: center; margin-bottom: 40px; color: #fff; }
.trust-logos { display: flex; gap: 60px; font-size: 28px; font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; white-space: nowrap; animation: scroll-left 15s linear infinite alternate; }
.trust-logos span { -webkit-text-stroke: 2px #fff; color: transparent; }
.trust-logos span:nth-child(odd) { color: var(--accent-yellow); -webkit-text-stroke: 0; }

/* 8. Bold CTA Banner */
.cta-05 { padding: 120px 0; background: var(--secondary); border-bottom: var(--border-thick); text-align: center; }
.cta-05 h2 { font-size: 56px; color: #fff; text-shadow: 6px 6px 0px #111; margin-bottom: 40px; letter-spacing: -2px; }
.cta-form { max-width: 600px; margin: 0 auto; display: flex; gap: 10px; }
.cta-form input { flex: 1; border: var(--border-thick); padding: 20px; font-family: 'Public Sans', sans-serif; font-weight: 800; font-size: 18px; outline: none; box-shadow: var(--shadow-hard); }
.cta-form button { background: var(--accent-yellow); color: #111; }

/* 9. News / Blog */
.news-05 { padding: 100px 0; border-bottom: var(--border-thick); background: var(--bg-color); }
.news-05 h2 { font-size: 44px; margin-bottom: 60px; text-align: center; }
.news-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 40px; }
.news-card { border: var(--border-thick); background: #fff; box-shadow: var(--shadow-hard); display: flex; flex-direction: column; }
.news-img { border-bottom: var(--border-thick); height: 250px; }
.news-img img { width: 100%; height: 100%; object-fit: cover; border: none; box-shadow: none; }
.news-content { padding: 30px; }
.news-tag { display: inline-block; background: var(--accent-green); color: #fff; border: var(--border-thick); padding: 5px 10px; font-weight: 800; text-transform: uppercase; font-size: 12px; margin-bottom: 15px; box-shadow: 2px 2px 0px #111; }
.news-card h3 { font-size: 24px; margin-bottom: 15px; }
.news-card a { font-weight: 800; text-transform: uppercase; text-decoration: underline; border-bottom: none; }

/* 10. Footer */
.footer-05 { padding: 80px 0; background: var(--accent-blue); color: #fff; border-bottom: var(--border-thick); }
.footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 60px; }
.footer-05 h4 { font-size: 19px; margin-bottom: 20px; color: #fff; }
.footer-05 p { font-weight: 600; font-size: 18px; }
.footer-links a { display: block; font-weight: 800; font-size: 16px; margin-bottom: 10px; text-transform: uppercase; }
.footer-links a:hover { color: var(--accent-yellow); }

@media (max-width: 1024px) {
  .srv-05-grid { grid-template-columns: repeat(2, 1fr); }
  .stats-05 { flex-wrap: wrap; }
  .stat-block { min-width: 50%; border-bottom: var(--border-thick); }
  .footer-grid { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 768px) {
  .nav-05 { display: none; }
  .hero-05 h1 { font-size: 3.5rem; }
  .srv-05-grid, .news-grid, .footer-grid, .stats-05 { grid-template-columns: 1fr; flex-direction: column; }
  .stat-block { min-width: 100%; border-right: none; }
  .compare-table { display: block; overflow-x: auto; }
  .cta-form { flex-direction: column; }
}


/* Premium Form Styles */
.premium-form { display: flex; flex-direction: column; gap: 20px; width: 100%; }
.premium-form input, .premium-form textarea, .premium-form select { 
    width: 100%; 
    padding: 16px 20px; 
    border-radius: 8px; 
    border: 1px solid var(--primary); 
    background: color-mix(in srgb, var(--primary) 5%, transparent); 
    color: inherit; 
    font-family: inherit; 
    font-size: 15px; 
    outline: none; 
    transition: 0.3s all;
}

.premium-form input::placeholder, .premium-form textarea::placeholder {
    color: currentColor;
    opacity: 0.5;
}

.premium-form input:focus, .premium-form textarea:focus {
    border-color: var(--secondary);
    background: color-mix(in srgb, var(--secondary) 10%, transparent);
    box-shadow: 0 0 0 4px color-mix(in srgb, var(--secondary) 15%, transparent);
}
.premium-form button {
    padding: 18px;
    border-radius: 8px;
    font-size: 16px;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 1px;
    cursor: pointer;
    transition: 0.3s;
    background: var(--primary);
    color: #fff;
    border: none;
}
.premium-form button:hover {
    background: var(--secondary);
    transform: translateY(-2px);
    box-shadow: 0 10px 20px color-mix(in srgb, var(--secondary) 30%, transparent);
}

@media (max-width: 768px) {
  .srv-05-grid, .news-grid { grid-template-columns: 1fr !important; }
  .header-05-inner, .nav-05, .process-wrapper { flex-direction: column !important; }
}

`;

export const finance05Html = `
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,800&family=Public+Sans:wght@400;600;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">

<!-- 1. Header -->
<header class="header-05">
  <div class="header-05-inner container">
    <div class="logo-05">LOGO_PLACEHOLDER</div>
    
    <a href="#" class="btn-05">Sign In</a>
  </div>
</header>

<main>
  <!-- 2. Marquee Hero -->
  <section class="hero-05">
    <div class="container">
      <h1>Finance.<br>Unfiltered.</h1>
      <p>No jargon. No hidden fees. Just brutal honesty and aggressive financial growth tools for modern disruptors.</p>
      <a href="#" class="btn-05"style="font-size: 19px; padding: 20px 40px; background: var(--accent-blue);">Open Account</a>
    </div>
    <div class="marquee-container">
      <div class="marquee-text">ZERO FEES — REAL-TIME SETTLEMENTS — INSTANT TRANSFERS — NO BS CREDIT LIMITS — </div>
      <div class="marquee-text">ZERO FEES — REAL-TIME SETTLEMENTS — INSTANT TRANSFERS — NO BS CREDIT LIMITS — </div>
    </div>
  </section>

  <!-- 3. Colorful Service Cards -->
  <section class="services-05"id="services">
    <div class="container">
      <h2>What We Build</h2>
      <div class="srv-05-grid">
        <div class="srv-card-05">
          <i class="fa-solid fa-credit-card"></i>
          <h3>Corporate Cards</h3>
          <p>Virtual and physical cards with dynamic spend limits and zero foreign transaction fees.</p>
        </div>
        <div class="srv-card-05">
          <i class="fa-solid fa-money-bill-transfer"></i>
          <h3>Global Payments</h3>
          <p>Send and receive money in 50+ currencies instantly without the ridiculous bank markups.</p>
        </div>
        <div class="srv-card-05">
          <i class="fa-solid fa-chart-line"></i>
          <h3>Treasury Yield</h3>
          <p>Put your idle cash to work. Access high-yield corporate accounts insured up to $5M.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- 4. Comparison Table -->
  <section class="compare-05"id="compare">
    <div class="container">
      <h2>The Brutal Truth</h2>
      <div style="overflow-x: auto;">
        <table class="compare-table">
          <thead>
            <tr>
              <th>Feature</th>
              <th>Old Banks</th>
              <th>Us (Radical)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Monthly Fees</td>
              <td>$25 - $100+</td>
              <td>$0</td>
            </tr>
            <tr>
              <td>Wire Transfer Fee</td>
              <td>$35 Out / $15 In</td>
              <td>$0 (Both Ways)</td>
            </tr>
            <tr>
              <td>Account Opening</td>
              <td>2 Weeks + Branch Visit</td>
              <td>5 Minutes Online</td>
            </tr>
            <tr>
              <td>Interest Yield</td>
              <td>0.01% APY</td>
              <td>4.50% APY</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>

  <!-- 5. Step-by-Step Process -->
  <section class="process-05"id="process">
    <h2>How It Works</h2>
    <div class="process-wrapper">
      <div class="process-step">
        <div class="process-num">01</div>
        <h3>Sign Up Online</h3>
        <p>No paperwork. Just your EIN and basic business details. Approved instantly using our proprietary risk models.</p>
      </div>
      <div class="process-step"style="background: var(--accent-yellow);">
        <div class="process-num">02</div>
        <h3>Fund Account</h3>
        <p>Connect your existing accounts or wire funds immediately. Your capital is available to deploy within minutes.</p>
      </div>
      <div class="process-step"style="background: var(--accent-green); color: #fff;">
        <div class="process-num"style="color: #fff;">03</div>
        <h3 style="color: #fff;">Issue Cards</h3>
        <p>Generate virtual cards instantly for your team. Set hard spend limits per vendor or employee.</p>
      </div>
      <div class="process-step"style="background: var(--accent-blue); color: #fff;">
        <div class="process-num"style="color: #fff; text-shadow: 4px 4px 0px #111;">04</div>
        <h3 style="color: #fff;">Scale Up</h3>
        <p>As your revenue grows, so do your limits. Automatically access capital based on your real-time cash flow.</p>
      </div>
    </div>
  </section>

  <!-- 6. Big Stats Blocks -->
  <section class="stats-05">
    <div class="stat-block">
      <h4>$10B+</h4>
      <p>Processed Annually</p>
    </div>
    <div class="stat-block">
      <h4>50K+</h4>
      <p>Disruptive Startups</p>
    </div>
    <div class="stat-block">
      <h4>130+</h4>
      <p>Countries Supported</p>
    </div>
    <div class="stat-block">
      <h4>0%</h4>
      <p>Hidden Fees</p>
    </div>
  </section>

  <!-- 7. Animated Trust Logos -->
  <section class="trust-05">
    <h2>Trusted By Rulebreakers</h2>
    <div class="trust-logos">
      <span>STRIPE</span> — <span>AIRBNB</span> — <span>SHOPIFY</span> — <span>DISCORD</span> — <span>FIGMA</span> — <span>NOTION</span> — <span>OPENSEA</span>
    </div>
  </section>

  <!-- 8. Bold CTA Banner -->
  <section class="cta-05">
    <div class="container">
      <h2>Ditch the Dinosaurs.</h2>
      <form class="cta-form"onsubmit="event.preventDefault();"  class="premium-form">
<input type="text" placeholder="First Name" required >
<input type="text" placeholder="Last Name" required >
<input type="email" placeholder="Email Address" required >
<input type="tel" placeholder="Phone Number" required >
<input type="text" placeholder="Company Name" required >
<button type="submit" class="btn-05">Get Access</button>
</form>
    </div>
  </section>

  <!-- 9. News / Blog -->
  <section class="news-05"id="news">
    <div class="container">
      <h2>System Updates</h2>
      <div class="news-grid">
        <div class="news-card">
          <div class="news-img"><img src="https://images.unsplash.com/photo-1618044733300-9472054094ee?auto=format&fit=crop&q=80&w=800" alt="Tech"></div>
          <div class="news-content">
            <span class="news-tag">Product Release</span>
            <h3>Introducing Treasury API V2</h3>
            <p style="margin-bottom: 20px;">Automate your entire yield generation strategy with our new developer endpoints...</p>
            <a href="#">Read Docs -></a>
          </div>
        </div>
        <div class="news-card">
          <div class="news-img"><img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800" alt="Data"></div>
          <div class="news-content">
            <span class="news-tag"style="background: var(--accent-yellow); color: var(--text-dark);">Company News</span>
            <h3>We Raised Series C</h3>
            <p style="margin-bottom: 20px;">Secured $150M to aggressively expand our global payment infrastructure...</p>
            <a href="#">Read Press Release -></a>
          </div>
        </div>
      </div>
    </div>
  </section>
</main>

<!-- 10. Footer -->
<footer class="footer-05">
  <div class="footer-grid container">
    <div>
      <div class="logo-05"style="display: inline-block; margin-bottom: 20px; color: #111;">LOGO_PLACEHOLDER</div>
      <p>Radical financial tools for companies that move fast and break things.</p>
    </div>
    <div class="footer-links">
      <h4>Platform</h4>
      <a href="#">Corporate Cards</a>
      <a href="#">Bill Pay</a>
      <a href="#">Treasury</a>
      <a href="#">Capital</a>
    </div>
    <div class="footer-links">
      <h4>Legal & Docs</h4>
      <a href="#">API Documentation</a>
      <a href="#">Terms of Service</a>
      <a href="#">Privacy Policy</a>
      <a href="#">Security Audits</a>
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
            e.target.innerHTML = '<div class="tpl-templates01-13"style="padding: 20px; text-align: center; color: var(--text-dark); background: var(--accent-yellow); border: var(--border-thick);"><h3 style="margin: 0 0 10px 0; font-size: 16px;">Thank You!</h3><p style="margin: 0;">Your request has been submitted successfully.</p></div>';
          }, 1000);
        }
      }
    }, true);
  })();
</script>
`;
