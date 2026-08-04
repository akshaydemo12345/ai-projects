export const finance02Styles = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800&family=Work+Sans:wght@300;400;500;600&display=swap');

:root {
  --primary: PRIMARY_COLOR_PLACEHOLDER;
  --secondary: SECONDARY_COLOR_PLACEHOLDER;
  --bg-color: #f8f9fa;
  --bg-dark: var(--secondary);
  --text-main: #333333;
  --text-muted: #6c757d;
  --border-light: #e9ecef;
}

* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Work Sans', sans-serif; background-color: var(--bg-color); color: var(--text-main); line-height: 1.6; overflow-x: hidden; }
h1, h2, h3, h4, h5, h6 { font-family: 'Playfair Display', serif; color: var(--bg-dark); }

a { text-decoration: none; color: inherit; transition: 0.3s; }
img { max-width: 100%; display: block; }
.container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }

/* 1. Header */
.header-02 { background: #fff; border-bottom: 1px solid var(--border-light); position: sticky; top: 0; z-index: 100; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
.header-top { background: var(--bg-dark); color: #fff; padding: 5px 0; font-size: 12px; }
.header-top-inner { display: flex; justify-content: flex-end; gap: 20px; }
.header-top-inner a:hover { color: var(--secondary); }
.header-main { display: flex; justify-content: space-between; align-items: center; padding: 20px 0; }
.logo-02 { font-family: 'Playfair Display', serif; font-size: 24px; font-weight: 800; color: var(--primary); letter-spacing: -1px; }
.nav-02 { display: flex; gap: 30px; }
.nav-02 a { font-weight: 500; font-size: 15px; color: var(--text-main); position: relative; }
.nav-02 a::after { content: ''; position: absolute; bottom: -5px; left: 0; width: 0; height: 2px; background: var(--primary); transition: 0.3s; }
.nav-02 a:hover::after { width: 100%; }
.btn-02 { background: var(--primary); color: #fff; padding: 10px 25px; border-radius: 4px; font-weight: 500; font-size: 14px; border: 1px solid var(--primary); }
.btn-02:hover { background: #fff; color: var(--primary); }

/* 2. Hero Slider */
.hero-slider-sec { position: relative; overflow: hidden; background: var(--bg-dark); }
.hero-slider-container { width: 100%; height: 650px; }
.hero-slide { position: relative; height: 100%; width: 100%; background-size: cover; background-position: center; display: flex; align-items: center; }
.hero-slide::before { content: ''; position: absolute; inset: 0; background: linear-gradient(90deg, color-mix(in srgb, var(--secondary) 95%, transparent) 0%, color-mix(in srgb, var(--secondary) 40%, transparent) 100%); z-index: 1; }
.hero-content { position: relative; z-index: 2; max-width: 600px; color: #fff; }
.hero-content span { font-size: 14px; text-transform: uppercase; letter-spacing: 2px; color: var(--secondary); font-weight: 600; display: block; margin-bottom: 15px; }
.hero-content h1 { color: #fff; font-size: 37px; font-weight: 700; line-height: 1.1; margin-bottom: 20px; }
.hero-content p { font-size: 18px; color: #e9ecef; margin-bottom: 30px; font-weight: 300; }
.swiper-pagination-bullet { background: #fff !important; opacity: 0.5; width: 10px; height: 10px; }
.swiper-pagination-bullet-active { background: var(--secondary) !important; opacity: 1; width: 25px; border-radius: 5px; }

/* 3. At a Glance Stats */
.stats-02 { background: #fff; padding: 60px 0; border-bottom: 1px solid var(--border-light); }
.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 30px; text-align: center; }
.stat-box h3 { font-size: 28px; color: var(--primary); font-weight: 700; margin-bottom: 10px; }
.stat-box p { font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: var(--text-muted); font-weight: 500; }

/* 4. Expertise Section */
.expertise-02 { padding: 100px 0; background: var(--bg-color); }
.expertise-02 h2 { text-align: center; font-size: 29px; margin-bottom: 60px; }
.exp-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; }
.exp-card { background: #fff; border: 1px solid var(--border-light); padding: 40px; transition: 0.3s; position: relative; overflow: hidden; }
.exp-card::before { content: ''; position: absolute; top: 0; left: 0; width: 4px; height: 0; background: var(--secondary); transition: 0.3s; }
.exp-card:hover { box-shadow: 0 15px 30px rgba(0,0,0,0.05); }
.exp-card:hover::before { height: 100%; }
.exp-card i { font-size: 24px; color: var(--primary); margin-bottom: 20px; }
.exp-card h4 { font-size: 17px; margin-bottom: 15px; }
.exp-card p { color: var(--text-muted); font-size: 15px; line-height: 1.7; }

/* 5. Institutional Insights */
.insights-02 { padding: 100px 0; background: #fff; }
.insights-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 50px; }
.insights-header h2 { font-size: 29px; }
.insights-header a { color: var(--primary); font-weight: 600; border-bottom: 1px solid var(--primary); padding-bottom: 2px; }
.ins-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
.ins-main-card { position: relative; height: 500px; display: flex; align-items: flex-end; padding: 40px; }
.ins-main-card img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: 1; filter: brightness(0.7); }
.ins-main-content { position: relative; z-index: 2; color: #fff; }
.ins-main-content span { background: var(--secondary); color: var(--bg-dark); padding: 4px 10px; font-size: 12px; font-weight: 600; text-transform: uppercase; margin-bottom: 15px; display: inline-block; }
.ins-main-content h3 { color: #fff; font-size: 24px; margin-bottom: 15px; line-height: 1.2; }
.ins-side-list { display: flex; flex-direction: column; gap: 30px; }
.ins-side-item { display: flex; gap: 20px; border-bottom: 1px solid var(--border-light); padding-bottom: 30px; }
.ins-side-item img { width: 150px; height: 100px; object-fit: cover; }
.ins-side-text span { color: var(--secondary); font-size: 12px; font-weight: 600; text-transform: uppercase; margin-bottom: 5px; display: block; }
.ins-side-text h4 { font-size: 16px; margin-bottom: 10px; line-height: 1.3; }

/* 6. Corporate Responsibility */
.responsibility-02 { background: var(--bg-dark); color: #fff; padding: 100px 0; }
.resp-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }
.resp-text h2 { color: #fff; font-size: 29px; margin-bottom: 30px; }
.resp-text p { color: #adb5bd; margin-bottom: 40px; font-size: 16px; }
.resp-list { list-style: none; display: flex; flex-direction: column; gap: 20px; }
.resp-list li { display: flex; align-items: flex-start; gap: 15px; }
.resp-list i { color: var(--secondary); font-size: 16px; margin-top: 5px; }
.resp-list h5 { color: #fff; font-size: 18px; margin-bottom: 5px; }
.resp-list p { color: #adb5bd; font-size: 14px; margin: 0; }
.resp-img { position: relative; }
.resp-img img { width: 100%; border-radius: 4px; }
.resp-badge { position: absolute; bottom: -30px; left: -30px; background: var(--primary); padding: 30px; color: #fff; text-align: center; }
.resp-badge h3 { color: #fff; font-size: 33px; margin: 0; line-height: 1; }
.resp-badge span { font-size: 14px; text-transform: uppercase; letter-spacing: 1px; }

/* 7. Leadership */
.leadership-02 { padding: 100px 0; background: #fff; text-align: center; }
.leadership-02 h2 { font-size: 29px; margin-bottom: 60px; }
.lead-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 30px; }
.lead-card img { width: 100%; aspect-ratio: 3/4; object-fit: cover; margin-bottom: 20px; filter: grayscale(100%); transition: 0.3s; }
.lead-card:hover img { filter: grayscale(0%); }
.lead-card h4 { font-size: 16px; margin-bottom: 5px; }
.lead-card p { color: var(--primary); font-size: 14px; font-weight: 500; }

/* 8. Global Offices */
.offices-02 { padding: 80px 0; background: var(--bg-color); border-top: 1px solid var(--border-light); }
.offices-02 h2 { text-align: center; font-size: 24px; margin-bottom: 50px; }
.office-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 30px; }
.office-card h5 { font-size: 18px; margin-bottom: 10px; border-bottom: 2px solid var(--secondary); padding-bottom: 10px; display: inline-block; }
.office-card p { font-size: 14px; color: var(--text-muted); line-height: 1.8; }

/* 9. Contact / Form */
.contact-02 { padding: 100px 0; background: #fff; }
.contact-container { max-width: 800px; margin: 0 auto; text-align: center; }
.contact-container h2 { font-size: 29px; margin-bottom: 20px; }
.contact-form { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; text-align: left; margin-top: 40px; }
.contact-form input, .contact-form select, .contact-form textarea { width: 100%; padding: 15px; border: 1px solid var(--border-light); font-family: 'Work Sans', sans-serif; font-size: 15px; outline: none; background: var(--bg-color); transition: 0.3s; }
.contact-form input:focus, .contact-form textarea:focus { border-color: var(--primary); }
.form-full-02 { grid-column: span 2; }
.btn-submit-02 { background: var(--bg-dark); color: #fff; padding: 15px 30px; border: none; font-size: 16px; font-weight: 500; cursor: pointer; transition: 0.3s; width: 100%; }
.btn-submit-02:hover { background: var(--primary); }

/* 10. Footer */
.footer-02 { background: var(--bg-dark); color: #fff; padding: 80px 0 30px; }
.footer-grid-02 { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 50px; margin-bottom: 60px; }
.logo-footer-02 { font-family: 'Playfair Display', serif; font-size: 19px; font-weight: 800; color: #fff; margin-bottom: 20px; display: block; }
.footer-02 p { color: #adb5bd; font-size: 14px; margin-bottom: 20px; line-height: 1.8; }
.footer-02 h4 { color: #fff; font-size: 18px; margin-bottom: 20px; font-family: 'Work Sans', sans-serif; }
.footer-links-02 a { display: block; color: #adb5bd; margin-bottom: 10px; font-size: 14px; }
.footer-links-02 a:hover { color: var(--secondary); }
.footer-bottom-02 { border-top: 1px solid rgba(255,255,255,0.1); padding-top: 30px; display: flex; justify-content: space-between; font-size: 13px; color: #6c757d; }

@media (max-width: 1024px) {
  .hero-slider-container { height: 500px; }
  .stats-grid, .lead-grid, .office-grid { grid-template-columns: repeat(2, 1fr); }
  .exp-grid, .ins-grid, .resp-grid { grid-template-columns: 1fr; }
  .ins-main-card { height: 400px; }
  .resp-img { margin-top: 60px; }
  .footer-grid-02 { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 768px) {
  .header-top, .nav-02 { display: none; }
  .hero-content h1 { font-size: 28px; }
  .stats-grid, .lead-grid, .office-grid { grid-template-columns: 1fr; }
  .contact-form { grid-template-columns: 1fr; }
  .form-full-02 { grid-column: span 1; }
  .footer-grid-02 { grid-template-columns: 1fr; }
  .footer-bottom-02 { flex-direction: column; gap: 15px; text-align: center; }
  .resp-badge { left: 0; right: 0; bottom: -20px; text-align: center; }
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

`;

export const finance02Html = `
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800&family=Work+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
<!-- Swiper CSS (GrapesJS Built-in) -->

<!-- 1. Header -->
<header class="header-02">
  
  <div class="header-main container">
    <div class="logo-02">LOGO_PLACEHOLDER</div>
    
    <a href="#contact" class="btn-02">Contact Us</a>
  </div>
</header>

<main>
  <!-- 2. Hero Slider (Swiper) -->
  <section class="hero-slider-sec">
    <div data-gjs-type="swiper-container" class="swiper-container hero-slider-container"data-slides-per-view="1" data-autoplay="true" data-speed="800" data-loop="true" data-pagination="bullets">
      <div data-gjs-type="swiper-wrapper" class="swiper-wrapper">
        <div data-gjs-type="swiper-slide" class="swiper-slide">
          <div class="hero-slide"style="background-image: url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2000');">
            <div class="container">
              <div class="hero-content">
                <span>Global Asset Management</span>
                <h1>Navigating Markets with Precision.</h1>
                <p>Delivering institutional-grade investment strategies and rigorous risk management to safeguard and grow capital across market cycles.</p>
                <a href="#" class="btn-02">Explore Strategies</a>
              </div>
            </div>
          </div>
        </div>
        <div data-gjs-type="swiper-slide" class="swiper-slide">
          <div class="hero-slide"style="background-image: url('https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?auto=format&fit=crop&q=80&w=2000');">
            <div class="container">
              <div class="hero-content">
                <span>Investment Banking</span>
                <h1>Strategic Advisory. Flawless Execution.</h1>
                <p>Providing premier M&A, restructuring, and capital raising advisory services to corporations and governments worldwide.</p>
                <a href="#" class="btn-02">Our Services</a>
              </div>
            </div>
          </div>
        </div>
        <div data-gjs-type="swiper-slide" class="swiper-slide">
          <div class="hero-slide"style="background-image: url('https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=2000');">
            <div class="container">
              <div class="hero-content">
                <span>Quantitative Research</span>
                <h1>Data-Driven Alpha Generation.</h1>
                <p>Leveraging advanced analytics and proprietary algorithms to identify inefficiencies and structure optimal portfolios.</p>
                <a href="#" class="btn-02">Read Research</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div data-gjs-type="swiper-pagination" class="swiper-pagination"></div>
    </div>
  </section>

  <!-- 3. At a Glance Stats -->
  <section class="stats-02">
    <div class="stats-grid container">
      <div class="stat-box">
        <h3>$1.2T</h3>
        <p>Assets Under Management</p>
      </div>
      <div class="stat-box">
        <h3>85+</h3>
        <p>Countries Served</p>
      </div>
      <div class="stat-box">
        <h3>4,500</h3>
        <p>Global Professionals</p>
      </div>
      <div class="stat-box">
        <h3>1992</h3>
        <p>Year Established</p>
      </div>
    </div>
  </section>

  <!-- 4. Expertise Section -->
  <section class="expertise-02"id="expertise">
    <div class="container">
      <h2>Institutional Expertise</h2>
      <div class="exp-grid">
        <div class="exp-card">
          <i class="fa-solid fa-chart-pie"></i>
          <h4>Equities</h4>
          <p>Active and systematic equity strategies designed to capture alpha across global developed and emerging markets.</p>
        </div>
        <div class="exp-card">
          <i class="fa-solid fa-money-bill-trend-up"></i>
          <h4>Fixed Income</h4>
          <p>Navigating interest rate cycles with deep credit analysis and macro-driven sovereign debt strategies.</p>
        </div>
        <div class="exp-card">
          <i class="fa-solid fa-gem"></i>
          <h4>Alternative Investments</h4>
          <p>Access to private equity, real estate, hedge funds, and private credit for enhanced portfolio diversification.</p>
        </div>
        <div class="exp-card">
          <i class="fa-solid fa-scale-balanced"></i>
          <h4>Advisory & M&A</h4>
          <p>Unbiased, strategic advice for complex mergers, acquisitions, and corporate restructuring.</p>
        </div>
        <div class="exp-card">
          <i class="fa-solid fa-shield-halved"></i>
          <h4>Risk Solutions</h4>
          <p>Custom hedging strategies using derivatives to manage currency, rate, and commodity exposures.</p>
        </div>
        <div class="exp-card">
          <i class="fa-solid fa-leaf"></i>
          <h4>Sustainable Investing</h4>
          <p>Integrating ESG factors into the investment process to drive sustainable long-term performance.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- 5. Insights -->
  <section class="insights-02"id="insights">
    <div class="container">
      <div class="insights-header">
        <h2>Latest Research & Insights</h2>
        <a href="#">View All Insights <i class="fa-solid fa-arrow-right"></i></a>
      </div>
      <div class="ins-grid">
        <div class="ins-main-card">
          <img src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=800" alt="Market">
          <div class="ins-main-content">
            <span>Macro Outlook</span>
            <h3>Navigating the Global Monetary Transition in 2026</h3>
            <p>Our Chief Investment Office outlines the structural shifts in inflation and interest rates.</p>
          </div>
        </div>
        <div class="ins-side-list">
          <div class="ins-side-item">
            <img src="https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?auto=format&fit=crop&q=80&w=400" alt="Data">
            <div class="ins-side-text">
              <span>Equities</span>
              <h4>The AI Premium: Separating Fundamentals from Hype</h4>
              <p style="font-size: 14px; color: var(--text-muted);">An analysis of tech valuations.</p>
            </div>
          </div>
          <div class="ins-side-item">
            <img src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=400" alt="Office">
            <div class="ins-side-text">
              <span>Alternatives</span>
              <h4>Private Credit's Growing Role in Institutional Portfolios</h4>
              <p style="font-size: 14px; color: var(--text-muted);">Yield opportunities in direct lending.</p>
            </div>
          </div>
          <div class="ins-side-item"style="border: none;">
            <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=400" alt="Green">
            <div class="ins-side-text">
              <span>ESG</span>
              <h4>Energy Transition Infrastructure Investments</h4>
              <p style="font-size: 14px; color: var(--text-muted);">Capitalizing on the green shift.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- 6. Corporate Responsibility -->
  <section class="responsibility-02"id="responsibility">
    <div class="resp-grid container">
      <div class="resp-text">
        <h2>Corporate Responsibility</h2>
        <p>We recognize that our fiduciary duty extends beyond financial returns. We are committed to fostering sustainable economic growth, championing diversity, and adhering to the highest standards of corporate governance.</p>
        <ul class="resp-list">
          <li>
            <i class="fa-solid fa-check-circle"></i>
            <div>
              <h5>Net Zero Commitment</h5>
              <p>Targeting net zero greenhouse gas emissions across our operations by 2030.</p>
            </div>
          </li>
          <li>
            <i class="fa-solid fa-check-circle"></i>
            <div>
              <h5>Diversity & Inclusion</h5>
              <p>Fostering an inclusive workplace where diverse perspectives drive better investment outcomes.</p>
            </div>
          </li>
          <li>
            <i class="fa-solid fa-check-circle"></i>
            <div>
              <h5>Community Engagement</h5>
              <p>Dedicating capital and employee expertise to empower underserved communities globally.</p>
            </div>
          </li>
        </ul>
      </div>
      <div class="resp-img">
        <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=800" alt="Corporate">
        <div class="resp-badge">
          <h3>$500M+</h3>
          <span>Committed to Impact</span>
        </div>
      </div>
    </div>
  </section>

  <!-- 7. Leadership -->
  <section class="leadership-02"id="leadership">
    <div class="container">
      <h2>Executive Leadership</h2>
      <div class="lead-grid">
        <div class="lead-card">
          <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400" alt="CEO">
          <h4>William Sterling</h4>
          <p>Chief Executive Officer</p>
        </div>
        <div class="lead-card">
          <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400" alt="CIO">
          <h4>Eleanor Vance</h4>
          <p>Chief Investment Officer</p>
        </div>
        <div class="lead-card">
          <img src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400" alt="CFO">
          <h4>Marcus Chen</h4>
          <p>Chief Financial Officer</p>
        </div>
        <div class="lead-card">
          <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400" alt="COO">
          <h4>Sarah Jenkins</h4>
          <p>Chief Operating Officer</p>
        </div>
      </div>
    </div>
  </section>

  <!-- 8. Global Offices -->
  <section class="offices-02">
    <div class="container">
      <h2>Global Presence</h2>
      <div class="office-grid">
        <div class="office-card">
          <h5>New York</h5>
          <p>Global Headquarters<br>200 Financial St<br>New York, NY 10005<br>+1 212 555 0100</p>
        </div>
        <div class="office-card">
          <h5>London</h5>
          <p>EMEA Headquarters<br>25 Canary Wharf<br>London E14 5AB<br>+44 20 7946 0958</p>
        </div>
        <div class="office-card">
          <h5>Hong Kong</h5>
          <p>APAC Headquarters<br>88 Queensway<br>Admiralty, Hong Kong<br>+852 5808 9988</p>
        </div>
        <div class="office-card">
          <h5>Frankfurt</h5>
          <p>Eurozone Hub<br>Taunusanlage 12<br>60325 Frankfurt<br>+49 69 1234 5678</p>
        </div>
      </div>
    </div>
  </section>

  <!-- 9. Contact Form -->
  <section class="contact-02"id="contact">
    <div class="contact-container container">
      <h2>Institutional Inquiries</h2>
      <p style="color: var(--text-muted);">Please direct all institutional, media, and investor relations inquiries through the secure channel below.</p>
      <form class="contact-form"onsubmit="event.preventDefault();">
        <div><input type="text" placeholder="First Name" required></div>
        <div><input type="text" placeholder="Last Name" required></div>
        <div><input type="email" placeholder="Corporate Email" required></div>
        <div><input type="text" placeholder="Institution / Company" required></div>
        <div class="form-full-02">
          <select required>
            <option value="">Select Inquiry Type...</option>
            <option>Asset Management</option>
            <option>Investment Banking</option>
            <option>Media & Press</option>
            <option>Investor Relations</option>
          </select>
        </div>
        <div class="form-full-02"><textarea placeholder="Message Details" rows="5" required></textarea></div>
        <div class="form-full-02"><button type="submit" class="btn-submit-02">Submit Inquiry</button></div>
      </form>
    </div>
  </section>
</main>

<!-- 10. Footer -->
<footer class="footer-02">
  <div class="container">
    <div class="footer-grid-02">
      <div>
        <a href="#" class="logo-footer-02">LOGO_PLACEHOLDER</a>
        <p>A leading global financial institution providing asset management, investment banking, and advisory services to corporations, governments, and institutions worldwide.</p>
        <div style="display: flex; gap: 15px; font-size: 16px;">
          <a href="#" style="color: #adb5bd;"><i class="fa-brands fa-linkedin"></i></a>
          <a href="#" style="color: #adb5bd;"><i class="fa-twitter fa-brands"></i></a>
          <a href="#" style="color: #adb5bd;"><i class="fa-youtube fa-brands"></i></a>
        </div>
      </div>
      
      
      
    </div>
    <div class="footer-bottom-02">
      <div>&copy; 2026 Institutional Corporate Group. All rights reserved.</div>
      <div style="display: flex; gap: 20px;">
        <a href="#">Site Map</a>
        <a href="#">Security</a>
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
            e.target.innerHTML = '<div class="tpl-templates01-13"style="padding: 30px; text-align: center; border: 1px solid var(--border-light); background: var(--bg-color);"><h3 style="margin: 0 0 10px 0; font-size: 19px; font-family: \\'Playfair Display\\', serif; color: var(--primary);">Inquiry Received</h3><p style="margin: 0;">A representative will contact you shortly.</p></div>';
          }, 1000);
        }
      }
    }, true);
  })();
</script>
`;
