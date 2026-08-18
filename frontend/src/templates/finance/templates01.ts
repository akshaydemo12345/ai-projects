export const finance01Styles = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

:root {
  --primary: PRIMARY_COLOR_PLACEHOLDER;
  --secondary: SECONDARY_COLOR_PLACEHOLDER;
  --bg-color: #ffffff;
  --bg-alt: #f8f9fc;
  --text-dark: var(--primary);
  --text-muted: var(--secondary);
  --border: #e2e8f0;
}

* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: var(--bg-color); color: var(--text-dark); line-height: 1.6; overflow-x: hidden; }

a { text-decoration: none; color: inherit; transition: 0.3s; }
img { max-width: 100%; display: block; }
.container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }

/* 1. Header (No Menu) */
.header-01 { padding: 20px 0; position: absolute; top: 0; width: 100%; z-index: 100; }
.header-01-inner { display: flex; justify-content: space-between; align-items: center; }
.logo-01 { font-size: 19px; font-weight: 800; color: var(--text-dark); display: flex; align-items: center; gap: 8px; }
.logo-01 i { color: var(--primary); font-size: 24px; }
.btn-01 { background: var(--primary); color: #fff; padding: 12px 28px; border-radius: 99px; font-weight: 700; font-size: 15px; box-shadow: 0 10px 20px rgba(0,0,0,0.1); border: none; cursor: pointer; transition: 0.3s; }
.btn-01:hover { transform: translateY(-2px); box-shadow: 0 15px 30px rgba(0,0,0,0.15); }

/* 2. Modern Hero */
.hero-01 { padding: 160px 0 100px; background: linear-gradient(135deg, #f8f9fc 0%, #eef2ff 100%); position: relative; overflow: hidden; }
.hero-01::before { content: ''; position: absolute; top: -50%; right: -20%; width: 1000px; height: 1000px; background: radial-gradient(circle, var(--primary) 0%, transparent 60%); opacity: 0.1; z-index: 0; filter: blur(60px); }
.hero-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; position: relative; z-index: 1; }
.hero-text h1 { font-size: clamp(2.1rem, 3.5vw, 3.15rem); font-weight: 800; line-height: 1.1; margin-bottom: 24px; letter-spacing: -1px; }
.hero-text p { font-size: 18px; color: var(--text-muted); margin-bottom: 40px; font-weight: 500; }
.hero-form { display: flex; gap: 10px; background: #fff; padding: 8px; border-radius: 99px; box-shadow: 0 20px 40px rgba(0,0,0,0.05); max-width: 450px; }
.hero-form input { flex: 1; border: none; background: transparent; padding: 0 20px; font-family: inherit; font-size: 16px; outline: none; }
.hero-img-wrap { position: relative; }
.hero-phone { border-radius: 40px; box-shadow: 0 30px 60px rgba(0,0,0,0.15); border: 12px solid #fff; background: #fff; transform: rotate(-5deg); transition: 0.5s; }
.hero-phone:hover { transform: rotate(0deg) translateY(-10px); }
.float-card { position: absolute; background: #fff; padding: 16px; border-radius: 16px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); display: flex; align-items: center; gap: 15px; animation: float 4s ease-in-out infinite; }
.fc-1 { top: 10%; left: -30px; animation-delay: 0s; }
.fc-2 { bottom: 20%; right: -40px; animation-delay: 1s; }
.fc-icon { width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 18px; }
.fc-text h5 { font-size: 15px; font-weight: 700; }
.fc-text span { font-size: 12px; color: var(--text-muted); font-weight: 600; }
@keyframes float { 0% { transform: translateY(0); } 50% { transform: translateY(-15px); } 100% { transform: translateY(0); } }

/* 3. Trusted By */
.trust-01 { padding: 60px 0; background: #fff; text-align: center; border-bottom: 1px solid var(--border); }
.trust-01 p { font-size: 14px; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 30px; }
.trust-logos { display: flex; justify-content: center; gap: 60px; flex-wrap: wrap; opacity: 0.5; font-size: 19px; font-weight: 800; }

/* 4. Features Bento Grid */
.features-01 { padding: 120px 0; background: var(--bg-alt); }
.sec-head { text-align: center; margin-bottom: 80px; }
.sec-head h2 { font-size: 28px; font-weight: 800; margin-bottom: 15px; letter-spacing: -1px; }
.sec-head p { font-size: 18px; color: var(--text-muted); }
.bento-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
.bento-card { background: #fff; border-radius: 24px; padding: 40px; border: 1px solid var(--border); transition: 0.3s; position: relative; overflow: hidden; }
.bento-card:hover { transform: translateY(-5px); box-shadow: 0 20px 40px rgba(0,0,0,0.05); }
.b-large { grid-column: span 2; }
.b-icon { width: 50px; height: 50px; border-radius: 16px; background: var(--bg-alt); color: var(--primary); display: flex; align-items: center; justify-content: center; font-size: 16px; margin-bottom: 24px; }
.bento-card h3 { font-size: 19px; font-weight: 800; margin-bottom: 12px; }
.bento-card p { color: var(--text-muted); font-weight: 500; line-height: 1.7; }
.b-img-bot { margin-top: 30px; border-radius: 12px 12px 0 0; box-shadow: 0 -10px 30px rgba(0,0,0,0.05); border: 1px solid var(--border); border-bottom: none; }

/* 5. Dashboard Preview */
.dash-01 { padding: 120px 0; background: var(--text-dark); color: #fff; overflow: hidden; }
.dash-grid { display: grid; grid-template-columns: 1fr 1.2fr; gap: 60px; align-items: center; }
.dash-text h2 { font-size: 33px; font-weight: 800; margin-bottom: 24px; line-height: 1.1; }
.dash-text p { font-size: 18px; color: var(--secondary); margin-bottom: 40px; }
.dash-list { list-style: none; display: flex; flex-direction: column; gap: 20px; }
.dash-list li { display: flex; align-items: center; gap: 15px; font-size: 16px; font-weight: 600; }
.dash-list i { color: var(--secondary); background: rgba(255,255,255,0.1); width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
.dash-img { background: var(--primary); border-radius: 24px; padding: 24px; border: 1px solid rgba(255,255,255,0.1); position: relative; }
.dash-img img { border-radius: 12px; }

/* 6. Pricing */
.pricing-01 { padding: 120px 0; background: #fff; }
.price-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; margin-top: 60px; }
.price-card { border: 1px solid var(--border); border-radius: 24px; padding: 40px; text-align: center; transition: 0.3s; }
.price-card.popular { border-color: var(--primary); box-shadow: 0 30px 60px rgba(0,0,0,0.08); position: relative; transform: scale(1.05); }
.price-badge { position: absolute; top: -15px; left: 50%; transform: translateX(-50%); background: var(--primary); color: #fff; padding: 6px 16px; border-radius: 99px; font-size: 13px; font-weight: 700; }
.price-card h4 { font-size: 16px; font-weight: 700; margin-bottom: 15px; }
.price-amt { font-size: 33px; font-weight: 800; color: var(--text-dark); margin-bottom: 30px; display: flex; justify-content: center; align-items: flex-start; }
.price-amt span { font-size: 18px; margin-top: 10px; color: var(--text-muted); }
.price-features { list-style: none; text-align: left; margin-bottom: 40px; display: flex; flex-direction: column; gap: 15px; }
.price-features li { display: flex; align-items: center; gap: 10px; font-size: 15px; font-weight: 500; }
.price-features i { color: var(--primary); }
.btn-price { width: 100%; padding: 15px; border-radius: 12px; font-weight: 700; border: 1px solid var(--border); background: #fff; cursor: pointer; transition: 0.3s; }
.popular .btn-price { background: var(--primary); color: #fff; border-color: var(--primary); }
.btn-price:hover { background: var(--text-dark); color: #fff; }

/* 7. FAQs */
.faq-01 { padding: 100px 0; background: var(--bg-alt); }
.faq-grid { max-width: 800px; margin: 0 auto; display: flex; flex-direction: column; gap: 20px; }
.faq-item { background: #fff; border: 1px solid var(--border); border-radius: 16px; padding: 24px; cursor: pointer; }
.faq-q { display: flex; justify-content: space-between; align-items: center; font-size: 18px; font-weight: 700; }
.faq-a { margin-top: 15px; color: var(--text-muted); font-weight: 500; display: none; line-height: 1.6; }

/* 8. Download CTA */
.cta-01 { padding: 120px 0; background: #fff; text-align: center; }
.cta-box { background: var(--primary); border-radius: 32px; padding: 80px 40px; color: #fff; max-width: 1000px; margin: 0 auto; position: relative; overflow: hidden; }
.cta-box h2 { font-size: 33px; font-weight: 800; margin-bottom: 20px; color: #fff; }
.cta-box p { font-size: 16px; opacity: 0.9; margin-bottom: 40px; max-width: 600px; margin-inline: auto; }
.store-btns { display: flex; justify-content: center; gap: 20px; }
.store-btn { background: #111; color: #fff; padding: 12px 24px; border-radius: 12px; display: flex; align-items: center; gap: 15px; text-align: left; transition: 0.3s; }
.store-btn:hover { background: #000; transform: translateY(-3px); }
.store-btn i { font-size: 24px; }
.store-btn span { display: block; font-size: 11px; opacity: 0.8; line-height: 1; }
.store-btn strong { font-size: 18px; line-height: 1.2; }

/* 9. Footer */
.footer-01 { background: #fff; padding: 80px 0 30px; border-top: 1px solid var(--border); }
.foot-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 50px; margin-bottom: 60px; }
.foot-grid p { color: var(--text-muted); font-weight: 500; margin-top: 15px; max-width: 300px; }
.foot-grid h4 { font-size: 16px; font-weight: 700; margin-bottom: 20px; }
.foot-links a { display: block; color: var(--text-muted); font-weight: 500; margin-bottom: 12px; }
.foot-links a:hover { color: var(--primary); }
.foot-bottom { border-top: 1px solid var(--border); padding-top: 30px; display: flex; justify-content: space-between; color: var(--text-muted); font-size: 14px; font-weight: 500; }

@media (max-width: 1024px) {
  .hero-grid, .dash-grid { grid-template-columns: 1fr; text-align: center; }
  .hero-form, .store-btns { justify-content: center; margin: 0 auto; }
  .bento-grid, .price-grid { grid-template-columns: repeat(2, 1fr); }
  .b-large { grid-column: span 1; }
  .price-card.popular { transform: none; }
  .foot-grid { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 768px) {
  .hero-text h1 { font-size: 3rem; }
  .bento-grid, .price-grid, .foot-grid { grid-template-columns: 1fr; }
  .store-btns { flex-direction: column; align-items: center; }
  .foot-bottom { flex-direction: column; gap: 15px; text-align: center; }
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
  .bento-grid, .dash-grid, .price-grid { grid-template-columns: 1fr !important; }
  .header-01-inner, .hero-form, .float-card, .foot-bottom { flex-direction: column !important; }
}

`;

export const finance01Html = `
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">

<!-- 1. Header (No Navigation Menu) -->
<header class="header-01">
  <div class="header-01-inner container">
    <div class="logo-01"><i class="fa-solid fa-wallet"></i> LOGO_PLACEHOLDER</div>
    <a href="#download" class="btn-01">Get the App</a>
  </div>
</header>

<main>
  <!-- 2. Modern Hero -->
  <section class="hero-01">
    <div class="hero-grid container">
      <div class="hero-text">
        <h1>Finance, <br>Simplified.</h1>
        <p>The only app you need to manage your spending, track investments, and send money globally with zero hidden fees.</p>
        <form class="hero-form"onsubmit="event.preventDefault();"  class="premium-form">
<input type="text" placeholder="First Name" required >
<input type="text" placeholder="Last Name" required >
<input type="email" placeholder="Email Address" required >
<input type="tel" placeholder="Phone Number" required >
<input type="text" placeholder="Company Name" required >
<button type="submit" class="btn-01">Get Started</button>
</form>
        <div style="margin-top: 30px; display: flex; align-items: center; gap: 15px; font-weight: 600; font-size: 14px;">
          <div style="display: flex;">
            <img src="https://i.pravatar.cc/100?img=1" style="width: 32px; height: 32px; border-radius: 50%; border: 2px solid #fff; margin-left: -10px;">
            <img src="https://i.pravatar.cc/100?img=2" style="width: 32px; height: 32px; border-radius: 50%; border: 2px solid #fff; margin-left: -10px;">
            <img src="https://i.pravatar.cc/100?img=3" style="width: 32px; height: 32px; border-radius: 50%; border: 2px solid #fff; margin-left: -10px;">
          </div>
          <span style="color: var(--text-muted);">Joined by 2M+ users</span>
        </div>
      </div>
      <div class="hero-img-wrap">
        <img src="https://images.unsplash.com/photo-1616803140344-6682afb13cda?auto=format&fit=crop&q=80&w=600" alt="App UI" class="hero-phone">
        
        <div class="float-card fc-1">
          <div class="fc-icon"style="background: var(--secondary); color: var(--secondary);"><i class="fa-solid fa-arrow-down"></i></div>
          <div class="fc-text">
            <h5>+$2,450.00</h5>
            <span>Received from John</span>
          </div>
        </div>
        
        <div class="float-card fc-2">
          <div class="fc-icon"style="background: var(--primary); color: var(--primary);"><i class="fa-solid fa-cart-shopping"></i></div>
          <div class="fc-text">
            <h5>-$12.50</h5>
            <span>Coffee Shop</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- 3. Trusted By -->
  <section class="trust-01">
    <div class="container">
      <p>Featured in leading publications</p>
      <div class="trust-logos">
        <span>TechCrunch</span>
        <span>Bloomberg</span>
        <span>Forbes</span>
        <span>WIRED</span>
        <span>WSJ</span>
      </div>
    </div>
  </section>

  <!-- 4. Features Bento -->
  <section class="features-01"id="features">
    <div class="container">
      <div class="sec-head">
        <h2>Everything you need.</h2>
        <p>Powerful features packed into a beautifully simple interface.</p>
      </div>
      <div class="bento-grid">
        <div class="b-large bento-card">
          <div class="b-icon"><i class="fa-solid fa-globe"></i></div>
          <h3>Global Transfers</h3>
          <p>Send money to 150+ countries instantly at the real exchange rate. No weekend markups, no hidden fees. Just fast, transparent global payments.</p>
          <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800" alt="Map" class="b-img-bot"style="height: 200px; object-fit: cover;">
        </div>
        <div class="bento-card">
          <div class="b-icon"style="background: var(--primary); color: var(--primary);"><i class="fa-solid fa-chart-pie"></i></div>
          <h3>Smart Analytics</h3>
          <p>Auto-categorization of expenses. See exactly where your money goes every month with beautiful, interactive charts.</p>
        </div>
        <div class="bento-card">
          <div class="b-icon"style="background: var(--primary); color: var(--primary);"><i class="fa-solid fa-shield-halved"></i></div>
          <h3>Bank-Grade Security</h3>
          <p>Your money is protected by 256-bit encryption, biometric login, and real-time fraud monitoring systems.</p>
        </div>
        <div class="b-large bento-card">
          <div class="b-icon"style="background: var(--secondary); color: var(--secondary);"><i class="fa-solid fa-seedling"></i></div>
          <h3>Automated Investing</h3>
          <p>Put your idle cash to work. Set up round-ups or recurring deposits into diversified portfolios managed by experts.</p>
          <img src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=800" alt="Invest" class="b-img-bot"style="height: 200px; object-fit: cover;">
        </div>
      </div>
    </div>
  </section>

  <!-- 5. Dashboard Preview -->
  <section class="dash-01">
    <div class="dash-grid container">
      <div class="dash-text">
        <h2>Take control of your finances.</h2>
        <p>A unified dashboard that gives you a crystal clear view of your net worth across all connected accounts.</p>
        <ul class="dash-list">
          <li><i class="fa-solid fa-check"></i> Connect unlimited bank accounts</li>
          <li><i class="fa-solid fa-check"></i> Track crypto & stock portfolios</li>
          <li><i class="fa-solid fa-check"></i> Set and track budget goals</li>
          <li><i class="fa-solid fa-check"></i> Export data for tax season</li>
        </ul>
      </div>
      <div class="dash-img">
        <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800" alt="Dashboard">
      </div>
    </div>
  </section>

  <!-- 6. Pricing -->
  <section class="pricing-01"id="pricing">
    <div class="container">
      <div class="sec-head">
        <h2>Simple, transparent pricing.</h2>
        <p>Start for free, upgrade when you need more power.</p>
      </div>
      <div class="price-grid">
        <div class="price-card">
          <h4>Basic</h4>
          <div class="price-amt">$0<span>/mo</span></div>
          <ul class="price-features">
            <li><i class="fa-solid fa-check"></i> Free virtual card</li>
            <li><i class="fa-solid fa-check"></i> 5 free ATM withdrawals</li>
            <li><i class="fa-solid fa-check"></i> Basic analytics</li>
          </ul>
          <button class="btn-price">Get Started</button>
        </div>
        <div class="popular price-card">
          <div class="price-badge">MOST POPULAR</div>
          <h4>Premium</h4>
          <div class="price-amt">$9<span>/mo</span></div>
          <ul class="price-features">
            <li><i class="fa-solid fa-check"></i> Metal physical card</li>
            <li><i class="fa-solid fa-check"></i> Unlimited ATM withdrawals</li>
            <li><i class="fa-solid fa-check"></i> Advanced analytics</li>
            <li><i class="fa-solid fa-check"></i> Priority support</li>
          </ul>
          <button class="btn-price">Upgrade to Premium</button>
        </div>
        <div class="price-card">
          <h4>Metal</h4>
          <div class="price-amt">$19<span>/mo</span></div>
          <ul class="price-features">
            <li><i class="fa-solid fa-check"></i> 18g Solid Metal card</li>
            <li><i class="fa-solid fa-check"></i> Zero FX markup</li>
            <li><i class="fa-solid fa-check"></i> Travel insurance</li>
            <li><i class="fa-solid fa-check"></i> Concierge service</li>
          </ul>
          <button class="btn-price">Get Metal</button>
        </div>
      </div>
    </div>
  </section>

  <!-- 7. FAQs -->
  <section class="faq-01">
    <div class="container">
      <div class="sec-head">
        <h2>Frequently Asked Questions</h2>
      </div>
      <div class="faq-grid">
        <div class="faq-item"onclick="this.querySelector('.faq-a').style.display = this.querySelector('.faq-a').style.display === 'block' ? 'none' : 'block'">
          <div class="faq-q">Is my money safe? <i class="fa-solid fa-chevron-down"></i></div>
          <div class="faq-a">Yes, your funds are held in safeguarded accounts at our partner banks and are protected up to $250,000 by FDIC insurance.</div>
        </div>
        <div class="faq-item"onclick="this.querySelector('.faq-a').style.display = this.querySelector('.faq-a').style.display === 'block' ? 'none' : 'block'">
          <div class="faq-q">How long does it take to open an account? <i class="fa-solid fa-chevron-down"></i></div>
          <div class="faq-a">It takes less than 3 minutes. Download the app, verify your identity with a photo ID, and your virtual card is ready to use instantly.</div>
        </div>
        <div class="faq-item"onclick="this.querySelector('.faq-a').style.display = this.querySelector('.faq-a').style.display === 'block' ? 'none' : 'block'">
          <div class="faq-q">Are there any hidden fees? <i class="fa-solid fa-chevron-down"></i></div>
          <div class="faq-a">No. We believe in complete transparency. Any fees for premium services or international transfers are clearly shown before you confirm the transaction.</div>
        </div>
      </div>
    </div>
  </section>

  <!-- 8. Download CTA -->
  <section class="cta-01"id="download">
    <div class="container">
      <div class="cta-box">
        <h2>Ready to upgrade your money?</h2>
        <p>Join millions of people who have already taken control of their finances. Download the app today.</p>
        <div class="store-btns">
          <a href="#" class="store-btn">
            <i class="fa-apple fa-brands"></i>
            <div>
              <span>Download on the</span>
              <strong>App Store</strong>
            </div>
          </a>
          <a href="#" class="store-btn">
            <i class="fa-google-play fa-brands"></i>
            <div>
              <span>GET IT ON</span>
              <strong>Google Play</strong>
            </div>
          </a>
        </div>
      </div>
    </div>
  </section>
</main>

<!-- 9. Footer -->
<footer class="footer-01">
  <div class="container">
    <div class="foot-grid">
      <div>
        <div class="logo-01"><i class="fa-solid fa-wallet"></i> LOGO_PLACEHOLDER</div>
        <p>Making financial services fast, fair, and transparent for everyone, everywhere.</p>
      </div>
      
      
      
    </div>
    <div class="foot-bottom">
      <div>&copy; 2026 Fintech App. All rights reserved.</div>
      <div style="display: flex; gap: 20px;">
        <a href="#"><i class="fa-twitter fa-brands"></i></a>
        <a href="#"><i class="fa-instagram fa-brands"></i></a>
        <a href="#"><i class="fa-brands fa-linkedin"></i></a>
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
          var isBtnElement = e.target.querySelector('button[type="submit"]');
          if (btn) {
            if(isBtnElement) btn.innerHTML = 'Sending...';
            else btn.value = 'Sending...';
          }
          setTimeout(function() {
            e.target.innerHTML = '<div style="padding: 10px 20px; background: var(--secondary); color: var(--secondary); border-radius: 99px; font-weight: 700; font-size: 14px;"><i class="fa-solid fa-check"></i> Thanks! App link sent.</div>';
          }, 1000);
        }
      }
    }, true);
  })();
</script>
`;
