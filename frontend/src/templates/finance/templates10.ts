export const finance10Styles = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=Jost:wght@300;400;500&display=swap');

:root {
  --primary: PRIMARY_COLOR_PLACEHOLDER;
  --secondary: SECONDARY_COLOR_PLACEHOLDER;
  --bg-dark: #050505;
  --gold: var(--primary);
  --gold-dark: var(--secondary);
  --text-main: #f0f0f0;
  --text-muted: #888888;
  --border-gold: color-mix(in srgb, var(--primary) 30%, transparent);
}

/* GrapesJS Dark Mode Override */
body, .gjs-dashed, [data-gjs-type="wrapper"], main {
    background-color: var(--bg-dark) !important;
    color: var(--text-main) !important;
}
h1, h2, h3, h4, h5, h6, p, span, div, a {
    color: inherit;
}


* { box-sizing: border-box; margin: 0; padding: 0; transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
body { font-family: 'Jost', sans-serif; background-color: var(--bg-dark); color: var(--text-main); line-height: 1.6; overflow-x: hidden; font-weight: 300; }
h1, h2, h3, h4, h5, h6 { font-family: 'Cormorant Garamond', serif; font-weight: 400; }

.container { max-width: 1400px; margin: 0 auto; padding: 0 40px; }
img { max-width: 100%; display: block; filter: grayscale(20%) contrast(1.1); }
a { text-decoration: none; color: inherit; }

/* 1. Header (Minimalist & Hidden Nav) */
.header-10 { position: fixed; top: 0; left: 0; width: 100%; z-index: 100; padding: 30px 0; mix-blend-mode: difference; background-color: transparent !important; }
.header-10-inner { display: flex; justify-content: space-between; align-items: center; }
.logo-10 { font-family: 'Cormorant Garamond', serif; font-size: 24px; color: #fff; letter-spacing: 6px; text-transform: uppercase; }
.menu-btn { background: none; border: none; color: #fff; cursor: pointer; font-size: 19px; }
.menu-btn i { font-weight: 300; }

/* 2. Hero (Dark & Gold) */
.hero-10 { height: 100vh; position: relative; display: flex; align-items: center; justify-content: center; text-align: center; overflow: hidden; }
.hero-10-bg { position: absolute; inset: 0; background: url('https://images.unsplash.com/photo-1542314831-c6a420325160?auto=format&fit=crop&q=80&w=2000') center/cover; z-index: -2; filter: brightness(0.4) contrast(1.2); }
.hero-10-overlay { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(5,5,5,0) 0%, rgba(5,5,5,0.8) 100%); z-index: -1; }
.hero-10 h1 { font-size: clamp(2.8rem, 5.6vw, 4.9rem); color: var(--primary); margin-bottom: 20px; line-height: 1; text-transform: uppercase; letter-spacing: 10px; text-shadow: 0 4px 20px rgba(0,0,0,0.5); }
.hero-10 p { font-size: 14px; letter-spacing: 4px; text-transform: uppercase; color: var(--text-main); margin-bottom: 40px; }
.btn-gold { display: inline-block; padding: 16px 48px; border: 1px solid var(--primary); color: var(--primary); font-size: 11px; letter-spacing: 3px; text-transform: uppercase; background: transparent; cursor: pointer; position: relative; overflow: hidden; }
.btn-gold::before { content: ""; position: absolute; top: 0; left: -100%; width: 100%; height: 100%; background: var(--primary); z-index: -1; transition: 0.5s; }
.btn-gold:hover { color: var(--bg-dark); }
.btn-gold:hover::before { left: 0; }

/* 3. The Art of Wealth (Intro) */
.intro-10 { padding: 80px 0; text-align: center; }
.intro-10 h2 { font-size: 33px; color: var(--primary); margin-bottom: 40px; font-style: italic; }
.intro-10 p { font-size: 16px; max-width: 800px; margin: 0 auto; color: var(--text-muted); line-height: 2; }
.intro-10-line { width: 1px; height: 100px; background: var(--secondary); margin: 60px auto 0; }

/* 4. Exclusive Services */
.services-10 { padding: 100px 0; border-top: 1px solid var(--secondary); border-bottom: 1px solid var(--secondary); background: #080808; }
.services-10-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 60px; }
.srv-10-card { text-align: center; padding: 40px; border: 1px solid transparent; }
.srv-10-card:hover { border-color: var(--secondary); background: color-mix(in srgb, var(--primary) 2%, transparent); }
.srv-10-card h3 { font-size: 24px; color: var(--primary); margin-bottom: 20px; }
.srv-10-card p { font-size: 14px; color: var(--text-muted); line-height: 1.8; }
.srv-10-num { font-family: 'Cormorant Garamond', serif; font-size: 33px; color: color-mix(in srgb, var(--primary) 20%, transparent); margin-bottom: -20px; text-align: right; }

/* 5. Concierge Access */
.concierge-10 { padding: 150px 0; display: flex; align-items: center; gap: 80px; }
.concierge-10-img { flex: 1; position: relative; }
.concierge-10-img img { width: 100%; height: 700px; object-fit: cover; border-radius: 4px; }
.concierge-10-img::after { content: ""; position: absolute; inset: -20px; border: 1px solid var(--secondary); z-index: -1; }
.concierge-10-text { flex: 1; }
.concierge-10-text h2 { font-size: 39px; color: var(--primary); margin-bottom: 30px; line-height: 1.1; }
.concierge-10-text p { font-size: 16px; color: var(--text-muted); margin-bottom: 40px; line-height: 1.8; }

/* 6. Advisory Grid (Art/Real Estate) */
.advisory-10 { padding: 100px 0; background: #030303; }
.adv-10-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4px; background: var(--secondary); }
.adv-10-item { background: #030303; position: relative; overflow: hidden; group; }
.adv-10-item img { width: 100%; height: 500px; object-fit: cover; opacity: 0.6; transition: 0.8s; }
.adv-10-item:hover img { opacity: 0.3; transform: scale(1.05); }
.adv-10-content { position: absolute; inset: 0; padding: 60px; display: flex; flex-direction: column; justify-content: flex-end; }
.adv-10-content h3 { font-size: 25px; color: var(--primary); margin-bottom: 10px; transform: translateY(20px); opacity: 0; transition: 0.5s; }
.adv-10-item:hover .adv-10-content h3 { transform: translateY(0); opacity: 1; }
.adv-10-content p { font-size: 13px; text-transform: uppercase; letter-spacing: 2px; color: var(--text-main); }

/* 7. Interactive Portfolio Stats */
.stats-10 { padding: 150px 0; border-top: 1px solid var(--secondary); text-align: center; }
.stats-10-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 40px; margin-top: 80px; }
.stat-10-box h4 { font-size: 44px; color: var(--primary); line-height: 1; margin-bottom: 15px; }
.stat-10-box p { font-size: 12px; letter-spacing: 3px; text-transform: uppercase; color: var(--text-muted); }

/* 8. Security & Discretion */
.security-10 { padding: 120px 0; background: url('https://images.unsplash.com/photo-1633158829875-e5316a358c6f?auto=format&fit=crop&q=80&w=2000') fixed center/cover; position: relative; text-align: center; }
.security-10-overlay { position: absolute; inset: 0; background: rgba(5,5,5,0.9); }
.security-10-content { position: relative; z-index: 2; max-width: 800px; margin: 0 auto; }
.security-10-content i { font-size: 33px; color: var(--primary); margin-bottom: 30px; }
.security-10-content h2 { font-size: 33px; margin-bottom: 30px; }
.security-10-content p { font-size: 18px; color: #ccc; }

/* 9. Private Events */
.events-10 { padding: 150px 0; }
.events-10 h2 { font-size: 33px; color: var(--primary); text-align: center; margin-bottom: 80px; }
.event-10-list { display: flex; flex-direction: column; }
.event-10-item { display: flex; justify-content: space-between; align-items: center; padding: 40px 0; border-bottom: 1px solid rgba(255,255,255,0.1); transition: 0.3s; }
.event-10-item:hover { padding-left: 20px; padding-right: 20px; background: color-mix(in srgb, var(--primary) 5%, transparent); }
.event-10-date { font-family: 'Cormorant Garamond', serif; font-size: 24px; color: var(--primary); width: 20%; }
.event-10-title { font-size: 19px; width: 50%; }
.event-10-loc { font-size: 14px; color: var(--text-muted); letter-spacing: 2px; text-transform: uppercase; width: 20%; }
.event-10-btn { font-size: 12px; color: var(--primary); text-transform: uppercase; letter-spacing: 2px; }

/* 10. Request Invitation Form */
.invite-10 { padding: 150px 0; background: #080808; border-top: 1px solid var(--secondary); text-align: center; }
.invite-10 h2 { font-size: 39px; color: var(--primary); margin-bottom: 20px; }
.invite-10 p { font-size: 14px; color: var(--text-muted); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 60px; }
.invite-10-form { max-width: 600px; margin: 0 auto; display: flex; flex-direction: column; gap: 40px; }
.input-10-group { position: relative; }
.input-10-group input { width: 100%; background: transparent; border: none; border-bottom: 1px solid rgba(255,255,255,0.2); padding: 15px 0; color: #fff; font-family: 'Jost', sans-serif; font-size: 16px; outline: none; transition: 0.3s; }
.input-10-group input:focus { border-bottom-color: var(--primary); }
.input-10-group label { position: absolute; left: 0; top: 15px; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; color: var(--text-muted); pointer-events: none; transition: 0.3s; }
.input-10-group input:focus ~ label, .input-10-group input:valid ~ label { top: -10px; font-size: 10px; color: var(--primary); }

/* 11. Footer */
.footer-10 { padding: 60px 0; text-align: center; border-top: 1px solid rgba(255,255,255,0.05); }
.footer-10-inner { display: flex; justify-content: space-between; align-items: center; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; color: var(--text-muted); }
.footer-10-links { display: flex; gap: 40px; }
.footer-10-links a:hover { color: var(--primary); }

@media (max-width: 1024px) {
  .services-10-grid, .stats-10-grid { grid-template-columns: repeat(2, 1fr); }
  .concierge-10 { flex-direction: column; }
  .adv-10-grid { grid-template-columns: 1fr; }
}
@media (max-width: 768px) {
  .services-10-grid, .stats-10-grid { grid-template-columns: 1fr; }
  .hero-10 h1 { font-size: 3rem; }
  .event-10-item { flex-direction: column; gap: 20px; text-align: center; }
  .event-10-date, .event-10-title, .event-10-loc { width: 100%; }
  .footer-10-inner { flex-direction: column; gap: 30px; }
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
  .services-10-grid, .stats-10-grid { grid-template-columns: 1fr !important; }
  .header-10-inner, .hero-10, .footer-10-inner, .footer-10-links { flex-direction: column !important; }
}

`;

export const finance10Html = `
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=Jost:wght@300;400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">

<!-- 1. Header -->
<header class="header-10">
  <div class="header-10-inner container">
    <div class="logo-10">LOGO_PLACEHOLDER</div>
    <button class="menu-btn"><i class="fa-solid fa-bars-staggered"></i></button>
  </div>
</header>

<main>
  <!-- 2. Hero -->
  <section class="hero-10">
    <div class="hero-10-bg"></div>
    <div class="hero-10-overlay"></div>
    <div class="container">
      <p>Exclusive Private Advisory</p>
      <h1>The Art of<br>Wealth</h1>
      <button class="btn-gold">Request Access</button>
    </div>
  </section>

  <!-- 3. Intro -->
  <section class="intro-10">
    <div class="container">
      <h2>"True wealth is quiet. It is built on patience, strategy, and an unwavering commitment to excellence."</h2>
      <p style="margin-bottom: 50px;">We provide a discreet and highly personalized approach to managing substantial wealth, ensuring your legacy is preserved and expanded for generations to come. At Aurelius, we do not follow the market; we command it.</p>
      <img src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800" alt="Wealth Management" style="width: 100%; max-height: 400px; object-fit: cover; border-radius: 4px;">
      <div class="intro-10-line"></div>
    </div>
  </section>

  <!-- 4. Exclusive Services -->
  <section class="services-10">
    <div class="container services-10-grid">
      <div class="srv-10-card">
        <div class="srv-10-num">I</div>
        <h3>Asset Curation</h3>
        <p>Bespoke portfolio construction tailored to your exact risk profile, focusing on asymmetrical returns and absolute capital preservation.</p>
      </div>
      <div class="srv-10-card">
        <div class="srv-10-num">II</div>
        <h3>Dynasty Planning</h3>
        <p>Generational wealth transfer strategies, sophisticated trust structuring, and comprehensive tax optimization on a global scale.</p>
      </div>
      <div class="srv-10-card">
        <div class="srv-10-num">III</div>
        <h3>Private Capital</h3>
        <p>Exclusive access to top-tier venture capital, private equity deals, and pre-IPO allocations normally reserved for institutions.</p>
      </div>
    </div>
  </section>

  <!-- 5. Concierge Access -->
  <section class="concierge-10 container">
    <div class="concierge-10-img">
      <img src=https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800" alt="Luxury Travel">
    </div>
    <div class="concierge-10-text">
      <h2>Beyond<br>Banking.</h2>
      <p>Our commitment extends beyond financial metrics. Aurelius provides our families with a dedicated lifestyle concierge, facilitating access to the inaccessible.</p>
      <p>From securing allocations in rare art auctions and private aviation charters to navigating elite real estate markets in Monaco, Geneva, and New York, your dedicated partner handles every detail with ultimate discretion.</p>
      <a href="#" class="btn-gold"style="margin-top: 20px;">Explore Concierge</a>
    </div>
  </section>

  <!-- 6. Advisory Grid (Alternative Assets) -->
  <section class="advisory-10">
    <div class="container">
      <div class="adv-10-grid">
        <div class="adv-10-item">
          <img src="https://images.unsplash.com/photo-1598257006626-48b0c252070d?auto=format&fit=crop&q=80&w=800" alt="Fine Art">
          <div class="adv-10-content">
            <p>Alternative Assets</p>
            <h3>Fine Art Advisory</h3>
          </div>
        </div>
        <div class="adv-10-item">
          <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800" alt="Real Estate">
          <div class="adv-10-content">
            <p>Global Property</p>
            <h3>Prime Real Estate</h3>
          </div>
        </div>
        <div class="adv-10-item">
          <img src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800" alt="Wellness">
          <div class="adv-10-content">
            <p>Generational Health</p>
            <h3>Longevity & Wellness</h3>
          </div>
        </div>
        <div class="adv-10-item">
          <img src="https://images.unsplash.com/photo-1598257006626-48b0c252070d?auto=format&fit=crop&q=80&w=800" alt="Aviation">
          <div class="adv-10-content">
            <p>Logistics</p>
            <h3>Private Aviation</h3>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- 7. Interactive Stats -->
  <section class="stats-10 container">
    <h2 style="font-size: 25px; color: var(--primary);">By the Numbers</h2>
    <div class="stats-10-grid">
      <div class="stat-10-box">
        <h4>$12B</h4>
        <p>Assets Advised</p>
      </div>
      <div class="stat-10-box">
        <h4>45</h4>
        <p>Core Families</p>
      </div>
      <div class="stat-10-box">
        <h4>18</h4>
        <p>Global Jurisdictions</p>
      </div>
      <div class="stat-10-box">
        <h4>0</h4>
        <p>Public Disclosures</p>
      </div>
    </div>
  </section>

  <!-- 8. Security & Discretion -->
  <section class="security-10">
    <div class="security-10-overlay"></div>
    <div class="security-10-content container">
      <i class="fa-solid fa-shield-halved"></i>
      <h2>Absolute Discretion</h2>
      <p>In an increasingly transparent world, privacy is the ultimate luxury. We employ military-grade operational security and strict compartmentalization to ensure your financial footprint remains entirely confidential.</p>
    </div>
  </section>

  <!-- 9. Private Events -->
  <section class="container events-10">
    <h2>The Aurelius Calendar</h2>
    <div class="event-10-list">
      <div class="event-10-item">
        <div class="event-10-date">12 Nov</div>
        <div class="event-10-title">Alternative Assets Summit</div>
        <div class="event-10-loc">Geneva, CH</div>
        <a href="#" class="event-10-btn">Inquire <i class="fa-solid fa-arrow-right"></i></a>
      </div>
      <div class="event-10-item">
        <div class="event-10-date">05 Dec</div>
        <div class="event-10-title">Art Basel Preview</div>
        <div class="event-10-loc">Miami, USA</div>
        <a href="#" class="event-10-btn">Inquire <i class="fa-solid fa-arrow-right"></i></a>
      </div>
      <div class="event-10-item">
        <div class="event-10-date">22 Jan</div>
        <div class="event-10-title">Global Macro Briefing</div>
        <div class="event-10-loc">London, UK</div>
        <a href="#" class="event-10-btn">Inquire <i class="fa-solid fa-arrow-right"></i></a>
      </div>
    </div>
  </section>

  <!-- 10. Request Invitation -->
  <section class="invite-10">
    <div class="container">
      <h2>Request Access</h2>
      <p>Aurelius is currently accepting new relationships by referral or strict review only.</p>
      <form class="invite-10-form" onsubmit="event.preventDefault();">
        <div class="input-10-group">
          <input type="text" required>
          <label>First Name</label>
        </div>
        <div class="input-10-group">
          <input type="text" required>
          <label>Last Name</label>
        </div>
        <div class="input-10-group">
          <input type="email" required>
          <label>Email Address</label>
        </div>
        <div class="input-10-group">
          <input type="tel" required>
          <label>Phone Number</label>
        </div>
        <div class="input-10-group">
          <input type="text" required>
          <label>Company Name</label>
        </div>
        <button type="submit" class="btn-gold" style="align-self: center; margin-top: 20px;">Submit Dossier</button>
      </form>
    </div>
  </section>
</main>

<!-- 11. Footer -->
<footer class="footer-10">
  <div class="footer-10-inner container">
    <div>&copy; 2026 Aurelius Private Wealth</div>
    <div class="footer-10-links">
      <a href="#">Privacy Protocol</a>
      <a href="#">Legal Notice</a>
      <a href="#">Contact Desk</a>
    </div>
  </div>
</footer>
`;
