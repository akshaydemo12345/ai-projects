export const finance08Styles = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

:root {
  --primary: PRIMARY_COLOR_PLACEHOLDER;
  --secondary: SECONDARY_COLOR_PLACEHOLDER;
  --bg-color: #0B0E14;
  --surface: #151A23;
  --surface-light: #1E2532;
  --text-main: #FFFFFF;
  --text-muted: #94A3B8;
  --border: rgba(255, 255, 255, 0.08);
  --glow-primary: 0 0 40px color-mix(in srgb, var(--primary) 40%, transparent);
}

* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: var(--bg-color); color: var(--text-main); line-height: 1.6; overflow-x: hidden; }

a { text-decoration: none; color: inherit; transition: 0.3s ease; }
img { max-width: 100%; display: block; }
.container { max-width: 1280px; margin: 0 auto; padding: 0 24px; }

/* 1. Header */
.header-08 { padding: 24px 0; position: fixed; top: 0; width: 100%; z-index: 100; background: color-mix(in srgb, var(--bg-color) 80%, transparent); backdrop-filter: blur(12px); border-bottom: 1px solid var(--border); }
.header-08-inner { display: flex; justify-content: space-between; align-items: center; }
.logo-08 { font-size: 22px; font-weight: 800; letter-spacing: -0.5px; display: flex; align-items: center; gap: 8px; }
.logo-08 i { color: var(--primary); font-size: 24px; }
.nav-08 { display: flex; gap: 32px; }
.nav-08 a { font-size: 14px; font-weight: 500; color: var(--text-muted); }
.nav-08 a:hover { color: var(--text-main); }
.btn-08 { background: var(--primary); color: #fff; padding: 12px 24px; border-radius: 99px; font-weight: 600; font-size: 14px; border: none; cursor: pointer; transition: 0.3s; box-shadow: var(--glow-primary); }
.btn-08:hover { transform: translateY(-2px); filter: brightness(1.1); }

/* 2. Hero */
.hero-08 { min-height: 100vh; display: flex; align-items: center; padding-top: 100px; position: relative; overflow: hidden; }
.hero-bg-blob { position: absolute; top: -10%; right: -5%; width: 600px; height: 600px; background: radial-gradient(circle, color-mix(in srgb, var(--primary) 30%, transparent) 0%, transparent 70%); filter: blur(60px); z-index: -1; animation: pulse 8s infinite alternate; }
.hero-bg-blob-2 { position: absolute; bottom: -10%; left: -5%; width: 500px; height: 500px; background: radial-gradient(circle, color-mix(in srgb, var(--secondary) 25%, transparent) 0%, transparent 70%); filter: blur(60px); z-index: -1; animation: pulse 10s infinite alternate-reverse; }
@keyframes pulse { 0% { transform: scale(1); opacity: 0.8; } 100% { transform: scale(1.1); opacity: 1; } }

.hero-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }
.hero-text h1 { font-size: clamp(3rem, 5vw, 4.5rem); font-weight: 800; line-height: 1.1; margin-bottom: 24px; letter-spacing: -2px; }
.hero-text h1 span { background: linear-gradient(135deg, var(--primary), var(--secondary)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.hero-text p { font-size: 18px; color: var(--text-muted); margin-bottom: 40px; font-weight: 400; max-width: 480px; }
.hero-actions { display: flex; gap: 16px; align-items: center; }
.btn-outline-08 { background: transparent; color: var(--text-main); padding: 12px 24px; border-radius: 99px; font-weight: 600; font-size: 14px; border: 1px solid var(--border); cursor: pointer; transition: 0.3s; }
.btn-outline-08:hover { border-color: var(--primary); background: color-mix(in srgb, var(--primary) 10%, transparent); }

/* Hero Visual */
.hero-visual-08 { position: relative; padding: 20px; }
.fin-card { background: var(--surface); border: 1px solid var(--border); border-radius: 24px; padding: 32px; box-shadow: 0 40px 80px rgba(0,0,0,0.4); position: relative; z-index: 2; transform: perspective(1000px) rotateY(-5deg) rotateX(5deg); transition: 0.5s; }
.fin-card:hover { transform: perspective(1000px) rotateY(0deg) rotateX(0deg); }
.fin-card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
.f-label { font-size: 13px; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; }
.f-value { font-size: 40px; font-weight: 800; letter-spacing: -1px; margin-top: 4px; }
.f-badge { background: color-mix(in srgb, #10B981 15%, transparent); color: #10B981; padding: 6px 12px; border-radius: 99px; font-size: 12px; font-weight: 700; display: flex; align-items: center; gap: 4px; }

/* Floating mini cards */
.mini-card-1, .mini-card-2 { position: absolute; background: color-mix(in srgb, var(--surface) 90%, transparent); backdrop-filter: blur(10px); border: 1px solid var(--border); border-radius: 16px; padding: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.3); z-index: 3; animation: float 6s infinite ease-in-out; }
.mini-card-1 { top: -20px; right: -20px; animation-delay: 0s; }
.mini-card-2 { bottom: -30px; left: -20px; animation-delay: -3s; }
.mc-title { font-size: 12px; color: var(--text-muted); margin-bottom: 4px; }
.mc-val { font-size: 18px; font-weight: 700; }
@keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }

/* 3. Ticker */
.ticker-08 { padding: 30px 0; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); background: var(--surface); overflow: hidden; }
.ticker-track { display: flex; gap: 60px; animation: scrollTicker 30s linear infinite; white-space: nowrap; }
.tick-item { display: flex; align-items: center; gap: 12px; font-size: 15px; font-weight: 600; color: var(--text-muted); }
.tick-item span { color: var(--text-main); font-weight: 700; }
@keyframes scrollTicker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }

/* 4. Features Grid */
.features-08 { padding: 120px 0; position: relative; }
.section-head { text-align: center; margin-bottom: 80px; max-width: 600px; margin-inline: auto; }
.section-head h2 { font-size: 36px; font-weight: 800; letter-spacing: -1px; margin-bottom: 16px; }
.section-head p { color: var(--text-muted); font-size: 16px; }
.feat-grid-08 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
.feat-card-08 { background: var(--surface); border: 1px solid var(--border); border-radius: 20px; padding: 40px 30px; transition: 0.3s; position: relative; overflow: hidden; }
.feat-card-08:hover { border-color: var(--primary); transform: translateY(-5px); }
.feat-card-08::before { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 4px; background: linear-gradient(90deg, var(--primary), var(--secondary)); opacity: 0; transition: 0.3s; }
.feat-card-08:hover::before { opacity: 1; }
.f-icon-08 { width: 48px; height: 48px; border-radius: 12px; background: color-mix(in srgb, var(--primary) 15%, transparent); color: var(--primary); display: flex; align-items: center; justify-content: center; font-size: 20px; margin-bottom: 24px; }
.feat-card-08 h3 { font-size: 20px; font-weight: 700; margin-bottom: 12px; }
.feat-card-08 p { color: var(--text-muted); font-size: 15px; line-height: 1.6; }

/* 5. Metrics */
.metrics-08 { padding: 80px 0; background: var(--surface); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
.metrics-grid { display: flex; justify-content: space-around; flex-wrap: wrap; gap: 40px; text-align: center; }
.m-item h4 { font-size: 48px; font-weight: 800; color: var(--text-main); margin-bottom: 8px; letter-spacing: -2px; }
.m-item h4 span { color: var(--primary); }
.m-item p { color: var(--text-muted); font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; }

/* 6. Process Flow */
.process-08 { padding: 120px 0; }
.process-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }
.process-img { background: var(--surface); border: 1px solid var(--border); border-radius: 24px; padding: 40px; }
.p-step { display: flex; gap: 20px; margin-bottom: 40px; }
.p-step:last-child { margin-bottom: 0; }
.p-num { width: 40px; height: 40px; border-radius: 50%; background: color-mix(in srgb, var(--secondary) 15%, transparent); color: var(--secondary); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 16px; flex-shrink: 0; }
.p-content h4 { font-size: 20px; font-weight: 700; margin-bottom: 8px; }
.p-content p { color: var(--text-muted); font-size: 15px; line-height: 1.6; }

/* 7. Premium Form Section */
.contact-08 { padding: 120px 0; background: var(--surface); position: relative; border-top: 1px solid var(--border); }
.contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
.contact-info h2 { font-size: 40px; font-weight: 800; letter-spacing: -1px; margin-bottom: 20px; }
.contact-info p { color: var(--text-muted); font-size: 18px; margin-bottom: 40px; }
.c-list { list-style: none; display: flex; flex-direction: column; gap: 20px; }
.c-list li { display: flex; align-items: center; gap: 16px; font-size: 16px; font-weight: 500; }
.c-list li i { color: var(--primary); font-size: 20px; }

/* Standardized Premium Form */
.premium-form-08 { background: var(--bg-color); padding: 40px; border-radius: 24px; border: 1px solid var(--border); box-shadow: 0 20px 40px rgba(0,0,0,0.2); }
.premium-form-08 form { display: flex; flex-direction: column; gap: 20px; }
.premium-form-08 input, .premium-form-08 select, .premium-form-08 textarea { width: 100%; padding: 16px 20px; border-radius: 12px; border: 1px solid var(--border); background: var(--surface-light); color: var(--text-main); font-family: 'Plus Jakarta Sans', sans-serif; font-size: 15px; outline: none; transition: 0.3s; }
.premium-form-08 input::placeholder, .premium-form-08 textarea::placeholder { color: var(--text-muted); }
.premium-form-08 input:focus, .premium-form-08 textarea:focus { border-color: var(--primary); box-shadow: 0 0 0 4px color-mix(in srgb, var(--primary) 15%, transparent); }
.premium-form-08 button { width: 100%; padding: 16px; border-radius: 12px; font-size: 15px; font-weight: 700; cursor: pointer; transition: 0.3s; background: var(--primary); color: #fff; border: none; box-shadow: var(--glow-primary); }
.premium-form-08 button:hover { transform: translateY(-2px); filter: brightness(1.1); }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }

/* 8. Footer */
.footer-08 { padding: 60px 0 30px; border-top: 1px solid var(--border); background: var(--bg-color); }
.footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 40px; margin-bottom: 60px; }
.footer-logo { font-size: 20px; font-weight: 800; display: flex; align-items: center; gap: 8px; margin-bottom: 20px; }
.footer-logo i { color: var(--primary); }
.footer-desc { color: var(--text-muted); font-size: 14px; max-width: 300px; margin-bottom: 24px; }
.social-links { display: flex; gap: 12px; }
.social-links a { width: 36px; height: 36px; border-radius: 50%; background: var(--surface); display: flex; align-items: center; justify-content: center; color: var(--text-muted); border: 1px solid var(--border); transition: 0.3s; }
.social-links a:hover { color: var(--text-main); border-color: var(--primary); background: var(--primary); }
.footer-links h4 { font-size: 15px; font-weight: 700; margin-bottom: 20px; }
.footer-links ul { list-style: none; }
.footer-links li { margin-bottom: 12px; }
.footer-links a { color: var(--text-muted); font-size: 14px; }
.footer-links a:hover { color: var(--primary); }
.footer-bottom { padding-top: 24px; border-top: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; color: var(--text-muted); font-size: 13px; }

@media (max-width: 1024px) {
  .hero-grid, .process-grid, .contact-grid { grid-template-columns: 1fr; }
  .feat-grid-08 { grid-template-columns: repeat(2, 1fr); }
  .footer-grid { grid-template-columns: 1fr 1fr; }
  .hero-visual-08 { max-width: 500px; margin: 40px auto 0; }
  .hero-text { text-align: center; }
  .hero-text p { margin-inline: auto; }
  .hero-actions { justify-content: center; }
}
@media (max-width: 768px) {
  .feat-grid-08, .footer-grid, .form-row { grid-template-columns: 1fr; }
  .nav-08 { display: none; }
  .hero-text h1 { font-size: 2.5rem; }
  .metrics-grid { flex-direction: column; gap: 30px; }
}
@media (max-width: 768px) {
  .feat-grid-08 { grid-template-columns: 1fr !important; }
  .header-08-inner, .nav-08, .hero-08, .fin-card-header, .ticker-track, .metrics-grid, .p-step, .footer-bottom { flex-direction: column !important; }
}

`;

export const finance08Html = `
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">

<!-- 1. Header -->
<header class="header-08">
  <div class="container header-08-inner">
    <div class="logo-08">LOGO_PLACEHOLDER</div>
    <a href="#contact" class="btn-08">Open Account</a>
  </div>
</header>

<main>
  <!-- 2. Hero -->
  <section class="hero-08" id="platform">
    <div class="hero-bg-blob"></div>
    <div class="hero-bg-blob-2"></div>
    <div class="container hero-grid">
      <div class="hero-text">
        <h1>Global finance, <span>unified.</span></h1>
        <p>The enterprise-grade platform for managing cross-border payments, treasury, and automated accounting in one dashboard.</p>
        <div class="hero-actions">
          <a href="#contact" class="btn-08">Start Building</a>
          <a href="#features" class="btn-outline-08">View Documentation</a>
        </div>
      </div>
      
      <div class="hero-visual-08">
        <div class="fin-card">
          <div class="fin-card-header">
            <div>
              <div class="f-label">Total Treasury</div>
              <div class="f-value">$24,590.80</div>
            </div>
            <div class="f-badge"><i class="fa-solid fa-arrow-trend-up"></i> 14.2%</div>
          </div>
          <div style="height: 120px; display: flex; align-items: flex-end; gap: 10px; margin-top: 20px;">
            <div style="flex:1; background: var(--surface-light); height: 40%; border-radius: 6px 6px 0 0;"></div>
            <div style="flex:1; background: var(--surface-light); height: 60%; border-radius: 6px 6px 0 0;"></div>
            <div style="flex:1; background: color-mix(in srgb, var(--primary) 40%, transparent); height: 50%; border-radius: 6px 6px 0 0;"></div>
            <div style="flex:1; background: var(--surface-light); height: 75%; border-radius: 6px 6px 0 0;"></div>
            <div style="flex:1; background: var(--primary); height: 100%; border-radius: 6px 6px 0 0; box-shadow: var(--glow-primary);"></div>
          </div>
        </div>
        
        <div class="mini-card-1">
          <div class="mc-title">Daily Volume</div>
          <div class="mc-val">+$8,450</div>
        </div>
        <div class="mini-card-2">
          <div class="mc-title">API Status</div>
          <div class="mc-val" style="color: #10B981; font-size: 14px;"><i class="fa-solid fa-circle-check"></i> Operational</div>
        </div>
      </div>
    </div>
  </section>

  <!-- 3. Ticker -->
  <section class="ticker-08">
    <div class="ticker-track">
      <div class="tick-item">Processed <span>$14M+</span> this week</div>
      <div class="tick-item"><i class="fa-solid fa-star" style="color:#F59E0B"></i> 4.9/5 on G2</div>
      <div class="tick-item">SOC2 <span>Type II</span> Certified</div>
      <div class="tick-item">ISO <span>27001</span> Compliant</div>
      <div class="tick-item">Processed <span>$14M+</span> this week</div>
      <div class="tick-item"><i class="fa-solid fa-star" style="color:#F59E0B"></i> 4.9/5 on G2</div>
      <div class="tick-item">SOC2 <span>Type II</span> Certified</div>
      <div class="tick-item">ISO <span>27001</span> Compliant</div>
    </div>
  </section>

  <!-- 4. Features -->
  <section class="features-08" id="features">
    <div class="container">
      <div class="section-head">
        <h2>Engineered for scale.</h2>
        <p>Replace disjointed financial stacks with a unified architecture designed for modern global businesses.</p>
      </div>
      <div class="feat-grid-08">
        <div class="feat-card-08">
          <div class="f-icon-08"><i class="fa-solid fa-money-bill-transfer"></i></div>
          <h3>Global Payouts</h3>
          <p>Send funds to 130+ countries in local currencies via local bank transfers, wallets, or cards instantly.</p>
        </div>
        <div class="feat-card-08">
          <div class="f-icon-08"><i class="fa-solid fa-scale-balanced"></i></div>
          <h3>Ledger & Reconciliation</h3>
          <p>Automate your accounting with a double-entry ledger system that syncs perfectly with your ERP.</p>
        </div>
        <div class="feat-card-08">
          <div class="f-icon-08"><i class="fa-solid fa-shield-halved"></i></div>
          <h3>Fraud Prevention</h3>
          <p>Machine-learning powered risk engine that blocks suspicious transactions before they settle.</p>
        </div>
        <div class="feat-card-08">
          <div class="f-icon-08"><i class="fa-solid fa-code"></i></div>
          <h3>Developer First</h3>
          <p>Idempotent REST APIs, robust webhooks, and client libraries in Node, Python, and Go.</p>
        </div>
        <div class="feat-card-08">
          <div class="f-icon-08"><i class="fa-solid fa-wallet"></i></div>
          <h3>Treasury Management</h3>
          <p>Optimize yield on idle cash with automated sweeps into money market funds and treasuries.</p>
        </div>
        <div class="feat-card-08">
          <div class="f-icon-08"><i class="fa-solid fa-file-invoice"></i></div>
          <h3>Smart Invoicing</h3>
          <p>Generate, send, and track invoices with automated reconciliation when funds arrive.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- 5. Metrics -->
  <section class="metrics-08">
    <div class="container metrics-grid">
      <div class="m-item">
        <h4><span>$</span>50B+</h4>
        <p>Annual Volume</p>
      </div>
      <div class="m-item">
        <h4>130<span>+</span></h4>
        <p>Currencies</p>
      </div>
      <div class="m-item">
        <h4>99.99<span>%</span></h4>
        <p>API Uptime</p>
      </div>
      <div class="m-item">
        <h4><50<span>ms</span></h4>
        <p>Latency</p>
      </div>
    </div>
  </section>

  <!-- 6. Process -->
  <section class="process-08" id="solutions">
    <div class="container process-grid">
      <div class="process-img">
        <div style="background: var(--bg-color); border: 1px solid var(--border); border-radius: 12px; padding: 20px; margin-bottom: 20px;">
          <div style="font-size: 12px; color: var(--text-muted); margin-bottom: 10px;">API Request (POST /v1/payouts)</div>
          <div style="font-family: monospace; color: #10B981; font-size: 13px;">{ "amount": 5000, "currency": "EUR", "destination": "bank_123" }</div>
        </div>
        <div style="background: var(--bg-color); border: 1px solid var(--border); border-radius: 12px; padding: 20px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <div style="font-size: 14px; font-weight: 600;"><i class="fa-solid fa-spinner fa-spin" style="color: var(--primary);"></i> Routing...</div>
            <div style="font-size: 12px; color: var(--text-muted);">0.04s</div>
          </div>
          <div style="height: 4px; background: var(--surface-light); border-radius: 2px; overflow: hidden;">
            <div style="width: 75%; height: 100%; background: var(--primary);"></div>
          </div>
        </div>
      </div>
      
      <div>
        <h2 style="font-size: 32px; font-weight: 800; margin-bottom: 40px; letter-spacing:-1px;">Seamless integration.</h2>
        <div class="p-step">
          <div class="p-num">1</div>
          <div class="p-content">
            <h4>Initialize via API</h4>
            <p>Generate API keys and integrate our endpoints into your application in under an hour.</p>
          </div>
        </div>
        <div class="p-step">
          <div class="p-num">2</div>
          <div class="p-content">
            <h4>Smart Routing</h4>
            <p>Our engine automatically selects the fastest, cheapest rail for every cross-border transaction.</p>
          </div>
        </div>
        <div class="p-step">
          <div class="p-num">3</div>
          <div class="p-content">
            <h4>Instant Reconciliation</h4>
            <p>Webhooks fire immediately upon settlement, updating your ledger and ERP simultaneously.</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- 7. Contact -->
  <section class="contact-08" id="contact">
    <div class="container contact-grid">
      <div class="contact-info">
        <h2>Ready to modernize your finance stack?</h2>
        <p>Talk to our experts about custom pricing, enterprise architecture, and migration plans.</p>
        <ul class="c-list">
          <li><i class="fa-solid fa-check-circle"></i> Dedicated account manager</li>
          <li><i class="fa-solid fa-check-circle"></i> Custom SLA guarantees</li>
          <li><i class="fa-solid fa-check-circle"></i> Free sandbox access</li>
        </ul>
      </div>
      
      <div class="premium-form-08">
        <form onsubmit="event.preventDefault();">
          <div class="form-row">
            <input type="text" placeholder="First Name" required>
            <input type="text" placeholder="Last Name" required>
          </div>
          <input type="email" placeholder="Work Email" required>
          <input type="text" placeholder="Company Name" required>
          <select required style="appearance: none;">
            <option value="" disabled selected>Monthly Processing Volume</option>
            <option value="1">Under $100k</option>
            <option value="2">$100k - $1M</option>
            <option value="3">$1M - $10M</option>
            <option value="4">$10M+</option>
          </select>
          <button type="submit">Contact Sales</button>
        </form>
      </div>
    </div>
  </section>

  <!-- 8. Footer -->
  <footer class="footer-08">
    <div class="container">
      <div class="footer-grid">
        <div>
          <div class="footer-logo">LOGO_PLACEHOLDER</div>
          <p class="footer-desc">The financial infrastructure platform for the modern internet economy.</p>
          <div class="social-links">
            <a href="#"><i class="fa-brands fa-twitter"></i></a>
            <a href="#"><i class="fa-brands fa-linkedin"></i></a>
            <a href="#"><i class="fa-brands fa-github"></i></a>
          </div>
        </div>
        <div class="footer-links">
          <h4>Products</h4>
          <ul>
            <li><a href="#">Payments</a></li>
            <li><a href="#">Ledger</a></li>
            <li><a href="#">Treasury</a></li>
            <li><a href="#">Connect</a></li>
          </ul>
        </div>
        <div class="footer-links">
          <h4>Developers</h4>
          <ul>
            <li><a href="#">Documentation</a></li>
            <li><a href="#">API Reference</a></li>
            <li><a href="#">Status</a></li>
            <li><a href="#">GitHub</a></li>
          </ul>
        </div>
        <div class="footer-links">
          <h4>Company</h4>
          <ul>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Careers</a></li>
            <li><a href="#">Blog</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <div>&copy; 2026 FinCore Technologies. All rights reserved.</div>
        <div style="display:flex; gap: 20px;">
          <a href="#" style="color: var(--text-muted);">Privacy</a>
          <a href="#" style="color: var(--text-muted);">Terms</a>
        </div>
      </div>
    </div>
  </footer>
</main>

<script id="core-interactions">
  (function() {
    var isInEditor = !!document.querySelector('[data-gjs-type]') || document.body.classList.contains('gjs-dashed');
    
    document.addEventListener('submit', function(e) {
      if (e.target.tagName === 'FORM') {
        e.preventDefault();
        if (isInEditor) {
          e.stopImmediatePropagation();
          var existingModal = document.getElementById("preview-mode-modal");
          if (existingModal) existingModal.remove();
          var modalHtml = '<div id="preview-mode-modal" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 999999; display: flex; align-items: center; justify-content: center; background: rgba(11, 14, 20, 0.8); backdrop-filter: blur(8px); opacity: 0; animation: pModalFadeIn 0.3s forwards; font-family: system-ui, -apple-system, sans-serif;"><div style="background: #151A23; border: 1px solid rgba(255,255,255,0.1); width: 90%; max-width: 400px; border-radius: 24px; padding: 32px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); text-align: center; transform: scale(0.95); animation: pModalScaleUp 0.3s forwards;"><div style="width: 60px; height: 60px; background: rgba(239, 68, 68, 0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;"><svg style="width: 30px; height: 30px; color: #EF4444;" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg></div><h3 style="font-size: 18px; font-weight: 700; color: #FFFFFF; margin: 0 0 12px;">Preview Mode Active</h3><p style="font-size: 15px; color: #94A3B8; margin: 0 0 28px; line-height: 1.5;">Form submissions are disabled in preview mode. Publish your page to accept real submissions.</p><button onclick="document.getElementById(\\'preview-mode-modal\\').remove()" style="width: 100%; background: var(--primary); color: #ffffff; border: none; padding: 14px; border-radius: 12px; font-size: 15px; font-weight: 600; cursor: pointer;">Got it, close</button></div><style>@keyframes pModalFadeIn { to { opacity: 1; } } @keyframes pModalScaleUp { to { transform: scale(1); } }</style></div>';
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
                input.style.borderColor = 'var(--primary)';
                if (input.nextElementSibling && input.nextElementSibling.classList.contains('val-error')) {
                  input.nextElementSibling.style.display = 'none';
                }
              } else {
                input.style.borderColor = '#EF4444';
                if (input.nextElementSibling && input.nextElementSibling.classList.contains('val-error')) {
                  input.nextElementSibling.style.display = 'block';
                }
              }
            });
          }

          if (!input.value.trim() && input.hasAttribute('required')) {
            isValid = false;
            input.style.borderColor = '#EF4444';
            
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
              err.style.color = '#EF4444';
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
            if(btn.tagName === 'BUTTON') btn.innerHTML = 'Sending...';
            else btn.value = 'Sending...';
          }
          setTimeout(function() {
            e.target.innerHTML = '<div style="padding: 30px; text-align: center; border-radius: 12px; background: color-mix(in srgb, var(--primary) 10%, transparent); border: 1px solid var(--primary);"><h3 style="margin: 0 0 10px 0; font-size: 20px; font-weight: 700; color: #fff;">Request Received!</h3><p style="margin: 0; color: #94A3B8;">Our team will be in touch shortly.</p></div>';
          }, 1000);
        }
      }
    }, true);
  })();
</script>
`
