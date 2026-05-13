// Master Template — Travel 01 (Original Images Version)
// Optimized for Editor Reliability — No Variables, Direct Placeholders

export const travel01Styles = `
:root {
  --primary: PRIMARY_COLOR_PLACEHOLDER;
  --secondary: SECONDARY_COLOR_PLACEHOLDER;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Manrope', sans-serif; color: #0c4a6e; line-height: 1.6; background: #fff; overflow-x: hidden; }

.container { max-width: 1320px; margin: 0 auto; padding: 0 1.5rem; }
img { max-width: 100%; display: block; }
a { text-decoration: none; color: inherit; }

/* Navigation */
.nav { position: absolute; top: 0; left: 0; right: 0; z-index: 100; padding: 2rem 0; }
.nav-inner { display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.1); backdrop-filter: blur(10px); padding: 1rem 2rem; border-radius: 50px; border: 1px solid rgba(255,255,255,0.2); }
.logo { font-size: 1.5rem; font-weight: 800; color: #fff; }
.nav nav a { color: #fff; margin-left: 2rem; font-weight: 500; }
.btn-primary { background-color: var(--secondary); color: #fff; padding: 0.7rem 1.5rem; border-radius: 50px; font-weight: 600; border: none; cursor: pointer; }

/* Hero */
.hero { position: relative; min-height: 100vh; display: flex; align-items: center; background: #0c4a6e; color: #fff; padding: 10rem 0; overflow: hidden; }
.hero-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0.7; }
.hero-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(12, 74, 110, 0.4), rgba(12, 74, 110, 0.8)); }
.hero-content { position: relative; z-index: 10; max-width: 800px; }
.pill { background: rgba(255,255,255,0.2); padding: 0.5rem 1rem; border-radius: 50px; font-size: 0.8rem; font-weight: 700; display: inline-block; margin-bottom: 2rem; border: 1px solid rgba(255,255,255,0.3); }
.hero h1 { font-size: clamp(3rem, 7vw, 6rem); font-weight: 800; line-height: 1; margin-bottom: 2rem; }
.hero p { font-size: 1.25rem; opacity: 0.9; margin-bottom: 3rem; max-width: 600px; }

/* Search Bar */
.search-bar { background: #fff; padding: 1rem; border-radius: 24px; display: grid; grid-template-columns: 1fr 1fr 1fr auto; gap: 1rem; box-shadow: 0 30px 60px rgba(0,0,0,0.2); }
.search-field { padding: 0.5rem 1rem; border-right: 1px solid #eee; }
.search-field:last-child { border: none; }
.search-field label { display: block; font-size: 0.7rem; font-weight: 800; color: var(--secondary); text-transform: uppercase; margin-bottom: 0.3rem; }
.search-field input { border: none; outline: none; width: 100%; font-size: 1rem; font-weight: 600; }
.btn-submit { background-color: var(--secondary); color: #fff; border-radius: 16px; padding: 1rem 2rem; font-weight: 700; border: none; cursor: pointer; }

/* Grid Sections */
.islands { padding: 10rem 0; background: #fff; }
.grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; margin-top: 4rem; }
.island-card { position: relative; border-radius: 24px; overflow: hidden; height: 350px; }
.island-card img { width: 100%; height: 100%; object-fit: cover; transition: 0.5s; }
.island-card:hover img { transform: scale(1.1); }
.island-info { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.7), transparent); display: flex; flex-direction: column; justify-content: flex-end; padding: 2rem; color: #fff; }
.island-card.big { grid-column: span 2; grid-row: span 2; height: 724px; }

/* Fleet Section */
.fleet { padding: 10rem 0; background: #f8fafc; overflow: hidden; }
.fleet-grid { display: grid; grid-template-columns: 1fr 1.2fr; gap: 6rem; align-items: center; }
.fleet-text h2 { font-size: 3.5rem; font-weight: 800; margin-bottom: 2rem; color: #0c4a6e; }
.fleet-text p { font-size: 1.15rem; color: #475569; margin-bottom: 3rem; }
.fleet-img { position: relative; }
.fleet-img img { border-radius: 40px; box-shadow: 0 40px 80px rgba(0,0,0,0.1); transform: rotate(3deg); }

/* FAQ */
.faq { padding: 10rem 0; background: #fff; }
.faq-grid { max-width: 800px; margin: 0 auto; }
.faq-item { margin-bottom: 1rem; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; background: #fff; }
.faq-input { display: none; }
.faq-label { display: flex; justify-content: space-between; padding: 1.5rem 2rem; font-weight: 700; cursor: pointer; }
.faq-label::after { content: '+'; color: var(--secondary); font-size: 1.5rem; }
.faq-content { max-height: 0; overflow: hidden; padding: 0 2rem; transition: 0.3s; color: #64748b; }
.faq-input:checked ~ .faq-content { max-height: 200px; padding-bottom: 1.5rem; }
.faq-input:checked ~ .faq-label::after { content: '-'; }

/* Footer */
footer { padding: 8rem 0 4rem; background: #fff; border-top: 1px solid #e2e8f0; }
.foot-grid { display: grid; grid-template-columns: 1.5fr 1fr 1fr 1.2fr; gap: 5rem; }

/* Responsive Media Queries */
@media (max-width: 1024px) {
  .hero { padding: 8rem 0; text-align: center; }
  .hero-content { margin: 0 auto; }
  .search-bar { grid-template-columns: 1fr; gap: 0; border-radius: 32px; padding: 1.5rem; }
  .search-field { border-right: none; border-bottom: 1px solid #f1f5f9; padding: 1.5rem 0; text-align: left; }
  .search-field:last-child { border-bottom: none; }
  .btn-search { margin-top: 1rem; width: 100%; border-radius: 12px; }
  
  .grid { grid-template-columns: 1fr 1fr !important; }
  .island-card.big { grid-column: span 1; grid-row: span 1; height: 350px; }
  
  .fleet-grid { grid-template-columns: 1fr !important; text-align: center; gap: 4rem; }
  .fleet-img img { transform: rotate(0); width: 100%; }
  
  .nav-links, .btn-nav { display: none; }
  .foot-grid { grid-template-columns: 1fr 1fr !important; gap: 4rem; }
}

@media (max-width: 640px) {
  .hero h1 { font-size: 3rem; }
  .grid { grid-template-columns: 1fr !important; }
  .process .container > div:last-child { grid-template-columns: 1fr !important; gap: 3rem; }
  .faq-grid { padding: 0 1rem; }
  .cta-card { padding: 4rem 2rem; border-radius: 30px; }
  .cta-card h2 { font-size: 2.5rem; }
  .foot-grid { grid-template-columns: 1fr !important; text-align: center; }
}
`

export const travel01Html = `
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">

<header class="nav">
  <div class="container nav-inner">
    <div class="logo">LOGO_PLACEHOLDER</div>
    <a href="#contact" class="btn-primary">Book Now</a>
  </div>
</header>

<main>
  <section class="hero">
    <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1600" alt="Hero" class="hero-img">
    <div class="hero-overlay"></div>
    <div class="container hero-content">
      <span class="pill">✦ PRIVATE ISLAND SPECIALISTS</span>
      <h1>Paradise, <br>Privately Yours.</h1>
      <p>Crystal lagoons, overwater villas, and barefoot luxury across the world's most secluded islands.</p>
      <div class="search-bar">
        <form style="display: contents;">
        <div class="search-field">
          <label>Destination</label>
          <input type="text" name="destination" placeholder="Where to?">
        </div>
        <div class="search-field">
          <label>Email</label>
          <input type="email" name="email_address" placeholder="you@email.com">
        </div>
        <div class="search-field">
          <label>Guests</label>
          <input type="text" name="guests" placeholder="2 Adults">
        </div>
        <button type="submit" class="btn-submit">Search</button>
      </form>
      </div>
    </div>
  </section>

  <section class="brands" style="padding: 4rem 0; background: #fff; border-bottom: 1px solid #f1f5f9;">
    <div class="container" style="display: flex; justify-content: space-between; align-items: center; opacity: 0.4; filter: grayscale(1); flex-wrap: wrap; gap: 2rem;">
      <i class="fa-brands fa-airbnb" style="font-size: 2rem;"></i>
      <i class="fa-brands fa-expedia" style="font-size: 2rem;"></i>
      <i class="fa-brands fa-tripadvisor" style="font-size: 2rem;"></i>
      <i class="fa-brands fa-booking" style="font-size: 2rem;"></i>
      <i class="fa-brands fa-hilton" style="font-size: 2rem;"></i>
    </div>
  </section>

  <section class="islands" id="destinations">
    <div class="container">
      <div style="text-align: center; margin-bottom: 4rem;">
        <span style="color: var(--secondary); font-weight: 800; text-transform: uppercase; font-size: 0.8rem; letter-spacing: 0.1em;">Featured Havens</span>
        <h2 style="font-size: 3.5rem; font-weight: 800; color: #0c4a6e; margin-top: 1rem;">Sun-soaked sanctuaries.</h2>
      </div>
      <div class="grid">
        <div class="island-card big">
          <img src="https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&q=80&w=800" alt="Island">
          <div class="island-info">
            <h3>Bora Bora Overwater Villa</h3>
            <p>📍 French Polynesia</p>
          </div>
        </div>
        <div class="island-card">
          <img src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=400" alt="Island">
          <div class="island-info">
            <h3>Reef Discovery</h3>
          </div>
        </div>
        <div class="island-card">
          <img src="https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&q=80&w=400" alt="Island">
          <div class="island-info">
            <h3>Cliffside Suite</h3>
          </div>
        </div>
        <div class="island-card" style="grid-column: span 2;">
          <img src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=800" alt="Island">
          <div class="island-info">
            <h3>Hidden Retreat</h3>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="process" style="padding: 10rem 0; background: #f8fafc; position: relative; overflow: hidden;">
    <svg style="position: absolute; top: 0; left: 0; width: 100%; height: 100px; fill: #fff; transform: rotate(180deg);" viewBox="0 0 1440 320"><path d="M0,160L48,176C96,192,192,224,288,229.3C384,235,480,213,576,186.7C672,160,768,128,864,133.3C960,139,1056,181,1152,192C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>
    <div class="container">
      <div style="text-align: center; margin-bottom: 6rem;">
        <h2 style="font-size: 3rem; font-weight: 800; color: #0c4a6e;">Your Journey, Refined</h2>
        <p style="color: #64748b; margin-top: 1rem;">From the first inquiry to your barefoot arrival, we handle every detail.</p>
      </div>
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 4rem;">
        <div style="text-align: center;">
          <div style="width: 80px; height: 80px; background: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 2rem; color: SECONDARY_COLOR_PLACEHOLDER; font-size: 1.5rem; box-shadow: 0 10px 30px rgba(0,0,0,0.05);">01</div>
          <h3 style="font-size: 1.5rem; color: #0c4a6e; margin-bottom: 1rem;">Curation</h3>
          <p style="color: #64748b;">We hand-pick destinations that align perfectly with your travel philosophy.</p>
        </div>
        <div style="text-align: center;">
          <div style="width: 80px; height: 80px; background: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 2rem; color: SECONDARY_COLOR_PLACEHOLDER; font-size: 1.5rem; box-shadow: 0 10px 30px rgba(0,0,0,0.05);">02</div>
          <h3 style="font-size: 1.5rem; color: #0c4a6e; margin-bottom: 1rem;">Logistics</h3>
          <p style="color: #64748b;">Private jets, yacht transfers, and villa preparation managed with surgical precision.</p>
        </div>
        <div style="text-align: center;">
          <div style="width: 80px; height: 80px; background: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 2rem; color: SECONDARY_COLOR_PLACEHOLDER; font-size: 1.5rem; box-shadow: 0 10px 30px rgba(0,0,0,0.05);">03</div>
          <h3 style="font-size: 1.5rem; color: #0c4a6e; margin-bottom: 1rem;">Escape</h3>
          <p style="color: #64748b;">Arrive to a world where your every wish has already been anticipated.</p>
        </div>
      </div>
    </div>
    <svg style="position: absolute; bottom: 0; left: 0; width: 100%; height: 100px; fill: #fff;" viewBox="0 0 1440 320"><path d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,85.3C672,75,768,85,864,112C960,139,1056,181,1152,181.3C1248,181,1344,139,1392,117.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>
  </section>

  <section class="faq" style="padding: 10rem 0; background: #fff;">
    <div class="container" style="display: grid; grid-template-columns: 1fr 1.2fr; gap: 6rem; align-items: center;">
      <div class="faq-visual">
        <img src="https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?auto=format&fit=crop&q=80&w=800" alt="Insights" style="border-radius: 40px; box-shadow: 0 40px 80px rgba(0,0,0,0.15);">
      </div>
      <div class="faq-content-wrap">
        <div style="margin-bottom: 3rem;">
          <span style="color: SECONDARY_COLOR_PLACEHOLDER; font-weight: 800; text-transform: uppercase; font-size: 0.8rem; letter-spacing: 0.1em;">Expert Wisdom</span>
          <h2 style="font-size: 3rem; font-weight: 800; color: #0c4a6e; margin-top: 1rem;">Travel Insights</h2>
          <p style="color: #64748b; margin-top: 1rem;">Everything you need to know about your upcoming escape to paradise.</p>
        </div>
        <div class="faq-grid">
          <div class="faq-item">
            <input type="checkbox" id="faq1" class="faq-input">
            <label for="faq1" class="faq-label">How do we reach the private islands?</label>
            <div class="faq-content">
              <p>We arrange seamless transfers via private sea-plane or luxury yacht charter from the main international hub.</p>
            </div>
          </div>
          <div class="faq-item">
            <input type="checkbox" id="faq2" class="faq-input">
            <label for="faq2" class="faq-label">Is there a minimum stay requirement?</label>
            <div class="faq-content">
              <p>Typically our villas have a 3-night minimum, but we can customize durations for special events.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="cta" style="padding: 10rem 0; background: #fff;">
    <div class="container">
      <div style="background: SECONDARY_COLOR_PLACEHOLDER; border-radius: 60px; padding: 6rem; text-align: center; color: #fff; position: relative; overflow: hidden; box-shadow: 0 40px 100px rgba(0,0,0,0.15);">
        <h2 style="font-size: 3.5rem; font-weight: 800; margin-bottom: 2rem;">Ready for Paradise?</h2>
        <p style="font-size: 1.3rem; opacity: 0.9; margin-bottom: 4rem; max-width: 700px; margin-left: auto; margin-right: auto;">Start your journey with a private consultation with our island specialists.</p>
        <a href="#contact" style="background: #fff; color: SECONDARY_COLOR_PLACEHOLDER; padding: 1.25rem 3.5rem; border-radius: 16px; font-weight: 800; font-size: 1.2rem; display: inline-block;">Secure Your Booking</a>
      </div>
    </div>
  </section>
</main>

<footer id="contact">
  <div class="container foot-grid">
    <div class="foot-col">
      <div style="font-weight: 800; font-size: 1.5rem; margin-bottom: 1.5rem;">LOGO_PLACEHOLDER</div>
      <p style="color: #64748b;">The world's leading specialists in private island curation since 2008.</p>
    </div>
    <div class="foot-col">
      <h4 style="margin-bottom: 2rem;">Contact</h4>
      <p style="color: #64748b;">hello@azure.com<br>+44 20 7946 0958</p>
    </div>
  </div>
  <div class="container" style="margin-top: 5rem; padding-top: 3rem; border-top: 1px solid #e2e8f0; text-align: center; font-size: 0.9rem; color: #94a3b8;">
    <p>© 2026 PROJECT_NAME_PLACEHOLDER. All rights reserved.</p>
  </div>
</footer>
`
