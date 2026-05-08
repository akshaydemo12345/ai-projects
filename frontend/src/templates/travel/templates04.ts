// Master Template — Travel 04 (City Weekends Edition)
// 100% Matching the provided screenshot layout and urban aesthetics

export const travel04Styles = `
:root {
  --primary: PRIMARY_COLOR_PLACEHOLDER;
  --secondary: SECONDARY_COLOR_PLACEHOLDER;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Plus Jakarta Sans', sans-serif; background: #fff; color: #111; line-height: 1.6; overflow-x: hidden; }

.container { max-width: 1240px; margin: 0 auto; padding: 0 1.5rem; }
img { max-width: 100%; display: block; }
a { text-decoration: none; color: inherit; transition: 0.3s; }

/* Navigation */
.nav { padding: 1.5rem 0; background: #fff; border-bottom: 1px solid #f3f4f6; position: sticky; top: 0; z-index: 1000; }
.nav-inner { display: flex; justify-content: space-between; align-items: center; }
.logo { font-size: 1.2rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #000; }
.nav-links { display: flex; gap: 2rem; }
.nav-links a { font-size: 0.8rem; font-weight: 600; color: #64748b; text-transform: capitalize; }
.nav-links a:hover { color: var(--primary); }
.nav-right { display: flex; align-items: center; gap: 2rem; }
.btn-primary { background: var(--primary); color: #fff; padding: 0.6rem 1.4rem; border-radius: 4px; font-weight: 700; font-size: 0.8rem; border: none; cursor: pointer; }

/* Hero Section */
.hero { padding: 6rem 0 10rem; }
.hero-inner { display: grid; grid-template-columns: 1.2fr 1fr; gap: 6rem; align-items: center; }
.hero-text span { background: #eaff00; color: #000; padding: 0.4rem 0.8rem; border-radius: 4px; font-size: 0.75rem; font-weight: 800; display: inline-block; margin-bottom: 2rem; }
.hero h1 { font-size: 4.5rem; font-weight: 800; line-height: 1.05; margin-bottom: 2rem; letter-spacing: -2px; }
.hero p { font-size: 1.2rem; color: #64748b; margin-bottom: 4rem; max-width: 500px; }

/* Hero Form */
.hero-form { background: #fff; padding: 2.5rem; border-radius: 12px; border: 1px solid #f1f5f9; box-shadow: 0 20px 40px rgba(0,0,0,0.03); }
.hero-form h3 { font-size: 1.1rem; font-weight: 800; margin-bottom: 2rem; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
.form-group label { display: block; font-size: 0.65rem; font-weight: 800; text-transform: uppercase; color: var(--primary); margin-bottom: 0.5rem; letter-spacing: 0.5px; }
.form-group input, .form-group select { width: 100%; padding: 0.8rem; border: 1px solid #e2e8f0; border-radius: 6px; font-family: inherit; font-weight: 600; }
.btn-submit { grid-column: span 2; background: var(--primary); color: #fff; border: none; padding: 1.2rem; border-radius: 6px; font-weight: 800; text-transform: uppercase; margin-top: 1rem; cursor: pointer; }

/* Hero Visual */
.hero-visual { position: relative; }
.hero-img-wrap { border-radius: 24px; overflow: hidden; box-shadow: 0 40px 80px rgba(0,0,0,0.1); }
.hero-img-wrap img { width: 100%; height: 600px; object-fit: cover; }
.weather-badge { position: absolute; top: 30px; right: 30px; background: #fff; padding: 1rem 1.5rem; border-radius: 12px; box-shadow: 0 10px 20px rgba(0,0,0,0.1); text-align: center; }
.weather-badge h4 { font-size: 1.5rem; font-weight: 800; }
.weather-badge span { font-size: 0.7rem; color: #94a3b8; font-weight: 700; }
.location-badge { position: absolute; bottom: 30px; left: 30px; background: rgba(255,255,255,0.9); backdrop-filter: blur(10px); padding: 0.8rem 1.5rem; border-radius: 30px; font-size: 0.8rem; font-weight: 700; display: flex; align-items: center; gap: 10px; }

/* Brands Bar */
.brands { padding: 4rem 0; border-top: 1px solid #f1f5f9; border-bottom: 1px solid #f1f5f9; }
.brand-grid { display: flex; justify-content: space-between; align-items: center; opacity: 0.4; }
.brand-grid span { font-size: 0.8rem; font-weight: 800; text-transform: uppercase; color: #64748b; }

/* Trending Section */
.trending { padding: 10rem 0; }
.section-tag { color: #64748b; font-weight: 700; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 1rem; }
.section-title { font-size: 3.5rem; font-weight: 800; margin-bottom: 5rem; line-height: 1.1; }
.section-title span { background: #eaff00; padding: 0 10px; border-radius: 4px; }

.trend-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
.trend-card { background: #fff; border-radius: 16px; border: 1px solid #f1f5f9; overflow: hidden; display: grid; grid-template-columns: 1fr 1.2fr; transition: 0.3s; }
.trend-card:hover { transform: translateY(-10px); box-shadow: 0 30px 60px rgba(0,0,0,0.05); }
.trend-img { position: relative; height: 100%; }
.trend-img img { width: 100%; height: 100%; object-fit: cover; }
.trend-num { position: absolute; top: 15px; left: 15px; background: #000; color: #fff; width: 28px; height: 28px; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; font-weight: 800; }
.trend-info { padding: 2.5rem; display: flex; flex-direction: column; justify-content: space-between; }
.trend-info h3 { font-size: 1.5rem; margin-bottom: 1rem; }
.trend-info p { color: #64748b; font-size: 0.9rem; margin-bottom: 2rem; }
.trend-footer { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #f1f5f9; pt: 1.5rem; margin-top: 1rem; padding-top: 1.5rem; }
.price { font-weight: 800; font-size: 1.1rem; }
.price span { font-size: 0.7rem; color: #94a3b8; margin-right: 5px; }
.btn-view { color: PRIMARY_COLOR_PLACEHOLDER; font-weight: 800; font-size: 0.75rem; text-transform: uppercase; border-bottom: 2px solid transparent; }
.btn-view:hover { border-color: PRIMARY_COLOR_PLACEHOLDER; }

/* How It Works (Dark) */
.how { padding: 10rem 0; background: #000; color: #fff; border-radius: 40px; margin: 0 2rem; }
.how h2 { font-size: 3.5rem; font-weight: 800; margin-bottom: 5rem; max-width: 600px; line-height: 1.1; }
.step-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 4rem; }
.step-item { background: rgba(255,255,255,0.05); padding: 3rem; border-radius: 20px; position: relative; }
.step-num { color: PRIMARY_COLOR_PLACEHOLDER; font-weight: 800; font-size: 0.8rem; margin-bottom: 1.5rem; display: block; }
.step-item h3 { font-size: 1.5rem; margin-bottom: 1rem; }
.step-item p { color: #94a3b8; font-size: 0.95rem; }

/* Footer */
footer { padding: 6rem 0 3rem; background: #000; color: #fff; margin-top: 10rem; }
.foot-top { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 4rem; margin-bottom: 3rem; }
.foot-links { display: flex; gap: 2rem; }
.foot-links a { font-size: 0.8rem; color: #94a3b8; font-weight: 600; }
.foot-social { display: flex; gap: 1rem; }
.social-icon { width: 32px; height: 32px; background: rgba(255,255,255,0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; }

/* Creative Vibe Panels */
.vibes { padding: 10rem 0; background: #fff; }
.vibe-container { display: flex; gap: 1rem; height: 500px; margin-top: 4rem; }
.vibe-panel { flex: 1; border-radius: 20px; overflow: hidden; position: relative; transition: 0.6s cubic-bezier(0.23, 1, 0.32, 1); cursor: pointer; background: #111; }
.vibe-panel:hover { flex: 2; }
.vibe-panel::before { content: ''; position: absolute; inset: 0; background: rgba(0,0,0,0.4); z-index: 1; transition: 0.3s; }
.vibe-panel:hover::before { background: rgba(0,0,0,0.2); }

.vibe-content { position: absolute; bottom: 40px; left: 40px; right: 40px; z-index: 10; color: #fff; }
.vibe-content h3 { font-size: 1.8rem; margin-bottom: 1rem; }
.vibe-content p { font-size: 0.9rem; opacity: 0; transform: translateY(20px); transition: 0.5s 0.2s; }
.vibe-panel:hover .vibe-content p { opacity: 1; transform: translateY(0); }

.vibe-panel.night { background: url('https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&q=80&w=1000') center/cover; }
.vibe-panel.culture { background: url('https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=1000') center/cover; }
.vibe-panel.foodie { background: url('https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=1000') center/cover; }

/* 24-Hour Timeline */
.timeline-sec { padding: 12rem 0; background: #f9fafb; }
.timeline-grid { display: grid; grid-template-columns: 1fr 1.2fr; gap: 8rem; align-items: start; }
.timeline-visual { position: relative; padding-left: 40px; }
.timeline-line { position: absolute; left: 0; top: 0; bottom: 0; width: 2px; background: #e2e8f0; overflow: hidden; }
.timeline-line::after { 
    content: ''; position: absolute; top: -100px; left: 0; width: 2px; height: 100px; 
    background: linear-gradient(to bottom, transparent, PRIMARY_COLOR_PLACEHOLDER); 
    animation: moveLine 3s infinite linear; 
}

@keyframes moveLine {
    0% { top: -100px; }
    100% { top: 100%; }
}

.timeline-event { position: relative; margin-bottom: 5rem; }
.timeline-event::before { content: ''; position: absolute; left: -46px; top: 10px; width: 12px; height: 12px; background: #fff; border: 3px solid var(--primary); border-radius: 50%; z-index: 10; }
.time { font-weight: 800; font-size: 0.8rem; color: var(--primary); margin-bottom: 1rem; display: block; }
.event-card { background: #fff; padding: 2.5rem; border-radius: 16px; border: 1px solid #f1f5f9; box-shadow: 0 10px 30px rgba(0,0,0,0.03); }
.event-card h4 { font-size: 1.25rem; margin-bottom: 0.75rem; }
.event-card p { font-size: 0.9rem; color: #64748b; }
.event-card.highlight { border-left: 4px solid var(--primary); background: #fff; }

@media (max-width: 1024px) {
  .vibe-container { flex-direction: column; height: auto; }
  .vibe-panel { height: 300px; }
  .vibe-panel:hover { flex: 1; }
  .vibe-content p { opacity: 1; transform: translateY(0); }
  .timeline-grid { grid-template-columns: 1fr !important; }
}
`

export const travel04Html = `
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">

<header class="nav">
  <div class="container nav-inner">
    <div class="logo">LOGO_PLACEHOLDER</div>
    <nav class="nav-links">
      <a href="#trending">Cities</a>
      <a href="#how">City Breaks</a>
      <a href="#trending">Guides</a>
      <a href="#trending">Deals</a>
    </nav>
    <div class="nav-right">
       <a href="#" style="font-size: 0.8rem; font-weight: 700;">Sign in</a>
       <a href="#contact" class="btn-primary">Get Started</a>
    </div>
  </div>
</header>

<main>
  <!-- HERO SECTION -->
  <section class="hero">
    <div class="container hero-inner">
      <div class="hero-content">
        <span>✦ NEW — 24-hour city breaks from $299</span>
        <h1>Cities that never sleep, weekends that never end.</h1>
        <p>Curated 48-hour itineraries in the world's most electric cities. Hotels, food, hidden bars — all sorted.</p>
        
        <form class="hero-form">
          <h3>// Book your weekend <span style="font-weight: 400; color: #64748b;">Plan your city break</span></h3>
          <div class="form-grid">
            <div class="form-group">
              <label>Name</label>
              <input type="text" placeholder="Your name">
            </div>
            <div class="form-group">
              <label>Email</label>
              <input type="email" placeholder="you@email.com">
            </div>
            <div class="form-group">
              <label>City</label>
              <select><option>Pick a city</option><option>Tokyo</option><option>New York</option><option>London</option></select>
            </div>
            <div class="form-group">
              <label>Travelers</label>
              <select><option>1 Traveler</option><option>2 Travelers</option></select>
            </div>
            <div class="form-group" style="grid-column: span 2;">
              <label>Weekend Of</label>
              <input type="date">
            </div>
            <button type="submit" class="btn-submit">Plan My Weekend →</button>
          </div>
        </form>
      </div>
      
      <div class="hero-visual">
        <div class="hero-img-wrap">
          <img src="/assets/templates/travel/templates04/hero.jpg" alt="City Night">
        </div>
        <div class="weather-badge">
           <h4>92°F</h4>
           <span>Tokyo — Clear Night</span>
        </div>
        <div class="location-badge">
           <i class="fa-solid fa-circle" style="color: #00ff00; font-size: 0.5rem;"></i>
           <span>Tokyo Weekend <span style="color: #64748b; font-weight: 400;">Sat—Sun • From $450</span></span>
           <i class="fa-solid fa-arrow-up-right-from-square" style="font-size: 0.7rem; margin-left: 10px;"></i>
        </div>
      </div>
    </div>
  </section>

  <!-- BRANDS BAR -->
  <section class="brands">
    <div class="container brand-grid">
       <span>FEATURED IN</span>
       <span>CONDÉ NAST</span>
       <span>NYTIMES</span>
       <span>FORBES</span>
       <span>WIRED</span>
       <span>MONOCLE</span>
    </div>
  </section>

  <!-- TRENDING SECTION -->
  <section class="trending" id="trending">
    <div class="container">
      <span class="section-tag">// Trending Now</span>
      <h2 class="section-title">Where everyone's <span>going</span> this weekend.</h2>
      
      <div class="trend-grid">
        <div class="trend-card">
          <div class="trend-img">
            <img src="/assets/templates/travel/templates04/d1.jpg" alt="New York">
            <div class="trend-num">01</div>
          </div>
          <div class="trend-info">
             <h3>New York <span style="font-size: 0.6rem; color: #ff4400; font-weight: 800; border: 1px solid #ff4400; padding: 2px 4px; border-radius: 2px; vertical-align: middle; margin-left: 10px;">USA</span></h3>
             <p>Skyline, slices, and the Brooklyn after-hours scene.</p>
             <div class="trend-footer">
                <div class="price"><span>From</span> $580</div>
                <a href="#" class="btn-view">View Trip →</a>
             </div>
          </div>
        </div>
        
        <div class="trend-card">
          <div class="trend-img">
            <img src="/assets/templates/travel/templates04/d2.jpg" alt="London">
            <div class="trend-num">02</div>
          </div>
          <div class="trend-info">
             <h3>London <span style="font-size: 0.6rem; color: #ff4400; font-weight: 800; border: 1px solid #ff4400; padding: 2px 4px; border-radius: 2px; vertical-align: middle; margin-left: 10px;">UK</span></h3>
             <p>Markets, museums, and pubs that have outlasted empires.</p>
             <div class="trend-footer">
                <div class="price"><span>From</span> $420</div>
                <a href="#" class="btn-view">View Trip →</a>
             </div>
          </div>
        </div>

        <div class="trend-card">
          <div class="trend-img">
            <img src="/assets/templates/travel/templates04/d3.jpg" alt="Singapore">
            <div class="trend-num">03</div>
          </div>
          <div class="trend-info">
             <h3>Singapore <span style="font-size: 0.6rem; color: #ff4400; font-weight: 800; border: 1px solid #ff4400; padding: 2px 4px; border-radius: 2px; vertical-align: middle; margin-left: 10px;">SG</span></h3>
             <p>Hawker stalls by night. Infinity pools by morning.</p>
             <div class="trend-footer">
                <div class="price"><span>From</span> $800</div>
                <a href="#" class="btn-view">View Trip →</a>
             </div>
          </div>
        </div>

        <div class="trend-card">
          <div class="trend-img">
            <img src="/assets/templates/travel/templates04/d4.jpg" alt="Rome">
            <div class="trend-num">04</div>
          </div>
          <div class="trend-info">
             <h3>Rome <span style="font-size: 0.6rem; color: #ff4400; font-weight: 800; border: 1px solid #ff4400; padding: 2px 4px; border-radius: 2px; vertical-align: middle; margin-left: 10px;">IT</span></h3>
             <p>2,000 years of history, one perfect cacio e pepe.</p>
             <div class="trend-footer">
                <div class="price"><span>From</span> $510</div>
                <a href="#" class="btn-view">View Trip →</a>
             </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- CREATIVE SECTION 01: VIBE PANELS -->
  <section class="vibes">
    <div class="container">
      <span class="section-tag" style="text-align: center; display: block;">// choose your persona</span>
      <h2 class="section-title" style="text-align: center; margin-bottom: 5rem;">What's your <span>weekend</span> vibe?</h2>
      <div class="vibe-container">
        <div class="vibe-panel night">
           <div class="vibe-content">
              <h3>The Night Owl</h3>
              <p>Underground jazz, neon alleys, and sunrise breakfasts. We know where the lights stay on.</p>
              <a href="#" class="btn-hero-white" style="background: #eaff00; color: #000; padding: 0.5rem 1rem; font-size: 0.7rem;">Explore Nightlife</a>
           </div>
        </div>
        <div class="vibe-panel culture">
           <div class="vibe-content">
              <h3>The Culture Vulture</h3>
              <p>Hidden galleries, Brutalist landmarks, and centuries of stories told in stone.</p>
              <a href="#" class="btn-hero-white" style="background: #fff; color: #000; padding: 0.5rem 1rem; font-size: 0.7rem;">Explore Arts</a>
           </div>
        </div>
        <div class="vibe-panel foodie">
           <div class="vibe-content">
              <h3>The Global Foodie</h3>
              <p>Michelin stars meet street stalls. Every meal is a destination in itself.</p>
              <a href="#" class="btn-primary" style="padding: 0.5rem 1rem; font-size: 0.7rem;">Explore Tastes</a>
           </div>
        </div>
      </div>
    </div>
  </section>

  <!-- CREATIVE SECTION 02: 24-HOUR TIMELINE -->
  <section class="timeline-sec">
    <div class="container">
      <div class="timeline-grid">
        <div class="timeline-text">
           <span class="section-tag">// the 48-hour blueprint</span>
           <h2>A weekend <br>without <br>a single <span>wasted</span> second.</h2>
           <p style="margin-bottom: 3rem;">Our itineraries are built by architects, chefs, and night-shift poets. Every minute matters.</p>
           
           <div style="border-top: 1px solid #e2e8f0; padding-top: 3rem;">
              <div style="margin-bottom: 2rem;">
                 <h4 style="font-weight: 800; font-size: 1rem; margin-bottom: 0.5rem;">✦ Skip-the-line Access</h4>
                 <p style="font-size: 0.85rem; color: #64748b;">We handle all reservations and priority entries before you even land.</p>
              </div>
              <div style="margin-bottom: 2rem;">
                 <h4 style="font-weight: 800; font-size: 1rem; margin-bottom: 0.5rem;">✦ Curated Secret Maps</h4>
                 <p style="font-size: 0.85rem; color: #64748b;">Get a digital map with offline markers for spots that don't appear on Google.</p>
              </div>
              <div>
                 <h4 style="font-weight: 800; font-size: 1rem; margin-bottom: 0.5rem;">✦ 24/7 City Concierge</h4>
                 <p style="font-size: 0.85rem; color: #64748b;">One WhatsApp text away from a table at the city's most exclusive rooftop.</p>
              </div>
           </div>
        </div>
        <div class="timeline-visual">
           <div class="timeline-line"></div>
           <div class="timeline-event">
              <div class="time">SATURDAY 09:00 AM</div>
              <div class="event-card">
                 <h4>The Wake Up Call</h4>
                 <p>Espresso in a 100-year-old roastery hidden in an alleyway, followed by a private canal tour.</p>
              </div>
           </div>
           <div class="timeline-event">
              <div class="time">SATURDAY 02:00 PM</div>
              <div class="event-card">
                 <h4>The Mid-Day Rush</h4>
                 <p>Quick skip-the-line access to a private art gallery that only opens twice a month.</p>
              </div>
           </div>
           <div class="timeline-event">
              <div class="time">SATURDAY 10:00 PM</div>
              <div class="event-card highlight">
                 <h4>The Neon Descent</h4>
                 <p>Access to a legendary speakeasy hidden behind a laundromat door. Password provided.</p>
              </div>
           </div>
           <div class="timeline-event">
              <div class="time">SUNDAY 11:00 AM</div>
              <div class="event-card">
                 <h4>The Skyline Brunch</h4>
                 <p>Rooftop dining with a 360-degree view of the city's waking architecture.</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  </section>

  <!-- HOW IT WORKS -->
  <section class="how" id="how">
    <div class="container">
      <span class="section-tag" style="color: #eaff00;">// how it works</span>
      <h2>Three steps. One unforgettable weekend.</h2>
      
      <div class="step-grid">
        <div class="step-item">
           <span class="step-num">01</span>
           <h3>Pick a city</h3>
           <p>Browse 60+ cities with curated 48-hour plans built by locals.</p>
        </div>
        <div class="step-item">
           <span class="step-num">02</span>
           <h3>Customize</h3>
           <p>Swap restaurants, add experiences, and book hotels in one tap.</p>
        </div>
        <div class="step-item">
           <span class="step-num">03</span>
           <h3>Just go</h3>
           <p>Show up. We handle every reservation, transfer, and surprise.</p>
        </div>
      </div>
    </div>
  </section>
</main>

  <!-- FOOTER -->
  <footer>
    <div class="container">
      <div class="foot-top">
         <div class="logo" style="color: #fff; font-size: 1.5rem; letter-spacing: 2px;">LOGO_PLACEHOLDER</div>
         <div class="foot-links">
            <a href="#">Cities</a>
            <a href="#">Guides</a>
            <a href="#">Help</a>
            <a href="#">Press</a>
            <a href="#">Privacy</a>
         </div>
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center;">
         <p style="font-size: 0.7rem; color: #64748b;">© 2026 metro.travel - built for the weekend</p>
         <div class="foot-social">
            <div class="social-icon"><i class="fa-brands fa-instagram"></i></div>
            <div class="social-icon"><i class="fa-brands fa-twitter"></i></div>
            <div class="social-icon"><i class="fa-brands fa-tiktok"></i></div>
         </div>
      </div>
    </div>
  </footer>
`
