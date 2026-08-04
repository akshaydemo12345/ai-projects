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
.nav-inner { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; }
.logo { font-size: 1.2rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #000; }
.nav-links { display: flex; flex-wrap: wrap; gap: 2rem; }
.nav-links a { font-size: 0.8rem; font-weight: 600; color: #64748b; text-transform: capitalize; }
.nav-links a:hover { color: var(--primary); }
.nav-right { display: flex; flex-wrap: wrap; align-items: center; gap: 2rem; }
.btn-primary { background-color: var(--btn-bg, var(--primary)); color: var(--btn-text, #000); padding: 0.6rem 1.4rem; border-radius: 4px; font-weight: 700; font-size: 0.8rem; border: none; cursor: pointer; }

/* Hero Section */
.hero { padding: 6rem 0 10rem; background: #fafafa; }
.hero-inner { display: grid; grid-template-columns: 1.2fr 1fr; gap: 6rem; align-items: center; }
.hero-text span { background: var(--primary); color: #000; padding: 0.4rem 0.8rem; border-radius: 4px; font-size: 0.75rem; font-weight: 800; display: inline-block; margin-bottom: 2rem; }
.hero h1 { font-size: 4.5rem; font-weight: 800; line-height: 1.05; margin-bottom: 2rem; letter-spacing: -2px; }
.hero p { font-size: 1.2rem; color: #64748b; margin-bottom: 4rem; max-width: 500px; }

/* Hero Form */
.hero-form { background: #fff; padding: 2.5rem; border-radius: 12px; border: 1px solid #f1f5f9; box-shadow: 0 20px 40px rgba(0,0,0,0.03); }
.hero-form h3 { font-size: 1.1rem; font-weight: 800; margin-bottom: 2rem; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
.form-group label { display: block; font-size: 0.65rem; font-weight: 800; text-transform: uppercase; color: var(--primary); margin-bottom: 0.5rem; letter-spacing: 0.5px; }
.form-group input, .form-group select { width: 100%; padding: 0.8rem; border: 1px solid #e2e8f0; border-radius: 6px; font-family: inherit; font-weight: 600; }
.btn-submit { grid-column: span 2; background: var(--btn-bg, var(--primary)); color: var(--btn-text, #000); border: none; padding: 1.2rem; border-radius: 6px; font-weight: 800; text-transform: uppercase; margin-top: 1rem; cursor: pointer; }

/* Hero Visual */
.hero-visual { position: relative; }
.hero-img-wrap { border-radius: 24px; overflow: hidden; box-shadow: 0 40px 80px rgba(0,0,0,0.1); }
.hero-img-wrap img { width: 100%; height: 600px; object-fit: cover; }
.weather-badge { position: absolute; top: 30px; right: 30px; background: #fff; padding: 1rem 1.5rem; border-radius: 12px; box-shadow: 0 10px 20px rgba(0,0,0,0.1); text-align: center; }
.weather-badge h4 { font-size: 1.5rem; font-weight: 800; }
.weather-badge span { font-size: 0.7rem; color: #94a3b8; font-weight: 700; }
.location-badge { position: absolute; bottom: 30px; left: 30px; background: rgba(255,255,255,0.9); backdrop-filter: blur(10px); padding: 0.8rem 1.5rem; border-radius: 30px; font-size: 0.8rem; font-weight: 700; display: flex; flex-wrap: wrap; align-items: center; gap: 10px; }

/* Brands Bar */
.brands { padding: 4rem 0; border-top: 1px solid #f1f5f9; border-bottom: 1px solid #f1f5f9; }
.brand-grid { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; opacity: 0.4; }
.brand-grid span { font-size: 0.8rem; font-weight: 800; text-transform: uppercase; color: #64748b; }

/* Trending Section */
.trending { padding: 10rem 0; }
.section-tag { color: #64748b; font-weight: 700; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 1rem; }
.section-title { font-size: 3.5rem; font-weight: 800; margin-bottom: 5rem; line-height: 1.1; }
.section-title span { background: var(--primary); padding: 0 10px; border-radius: 4px; }

.trend-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
.trend-card { background: #fff; border-radius: 16px; border: 1px solid #f1f5f9; overflow: hidden; display: grid; grid-template-columns: 1fr 1.2fr; transition: 0.3s; }
.trend-card:hover { transform: translateY(-10px); box-shadow: 0 30px 60px rgba(0,0,0,0.05); }
.trend-img { position: relative; height: 100%; }
.trend-img img { width: 100%; height: 100%; object-fit: cover; }
.trend-num { position: absolute; top: 15px; left: 15px; background: #000; color: #fff; width: 28px; height: 28px; border-radius: 4px; display: flex; flex-wrap: wrap; align-items: center; justify-content: center; font-size: 0.7rem; font-weight: 800; }
.trend-info { padding: 2.5rem; display: flex; flex-wrap: wrap; flex-direction: column; justify-content: space-between; }
.trend-info h3 { font-size: 1.5rem; margin-bottom: 1rem; }
.trend-info p { color: #64748b; font-size: 0.9rem; margin-bottom: 2rem; }
.trend-footer { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; border-top: 1px solid #f1f5f9; pt: 1.5rem; margin-top: 1rem; padding-top: 1.5rem; }
.price { font-weight: 800; font-size: 1.1rem; }
.price span { font-size: 0.7rem; color: #94a3b8; margin-right: 5px; }
.btn-view { color: var(--primary); font-weight: 800; font-size: 0.75rem; text-transform: uppercase; border-bottom: 2px solid transparent; }
.btn-view:hover { border-color: var(--primary); }

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
.foot-top { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 4rem; margin-bottom: 3rem; }
.foot-links { display: flex; flex-wrap: wrap; gap: 2rem; }
.foot-links a { font-size: 0.8rem; color: #94a3b8; font-weight: 600; }
.foot-social { display: flex; flex-wrap: wrap; gap: 1rem; }
.social-icon { width: 32px; height: 32px; background: rgba(255,255,255,0.1); border-radius: 50%; display: flex; flex-wrap: wrap; align-items: center; justify-content: center; font-size: 0.8rem; }

/* Creative Vibe Panels */
.vibes { padding: 10rem 0; background: #fff; }
.vibe-container { display: flex; flex-wrap: wrap; gap: 1rem; height: 500px; margin-top: 4rem; }
.vibe-panel { flex: 1; border-radius: 20px; overflow: hidden; position: relative; transition: 0.6s cubic-bezier(0.23, 1, 0.32, 1); cursor: pointer; background: #111; }
.vibe-panel:hover { flex: 2; }
.vibe-panel::before { content: ''; position: absolute; inset: 0; background: rgba(0,0,0,0.4); z-index: 1; transition: 0.3s; }
.vibe-panel:hover::before { background: rgba(0,0,0,0.2); }

.vibe-content { position: absolute; bottom: 40px; left: 40px; right: 40px; z-index: 10; color: #fff; }
.vibe-content h3 { font-size: 1.8rem; margin-bottom: 1rem; }
.vibe-content p { font-size: 0.9rem; opacity: 0; transform: translateY(20px); transition: 0.5s 0.2s; }
.vibe-panel:hover .vibe-content p { opacity: 1; transform: translateY(0); }

.vibe-panel.night { }
.vibe-panel.culture { }
.vibe-panel.foodie { }

/* 24-Hour Timeline */
.timeline-sec { padding: 12rem 0; background: #f9fafb; }
.timeline-grid { display: grid; grid-template-columns: 1fr 1.2fr; gap: 8rem; align-items: start; }
.timeline-visual { position: relative; padding-left: 40px; }
.timeline-line { position: absolute; left: 0; top: 0; bottom: 0; width: 2px; background: #e2e8f0; overflow: hidden; }
.timeline-line::after { 
    content: ''; position: absolute; top: -100px; left: 0; width: 2px; height: 100px; 
    background: linear-gradient(to bottom, transparent, var(--primary)); 
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
  .hero-inner { grid-template-columns: 1fr !important; text-align: center; gap: 4rem; }
  .hero h1 { font-size: 3.5rem; }
  .hero p { margin: 0 auto 4rem; }
  .hero-form { margin: 0 auto; max-width: 500px; }
  .trend-grid { grid-template-columns: 1fr !important; }
  .step-grid { grid-template-columns: 1fr 1fr !important; }
  .vibe-container { flex-direction: column; height: auto; }
  .vibe-panel { height: 300px; }
  .vibe-panel:hover { flex: 1; }
  .vibe-content p { opacity: 1; transform: translateY(0); }
  .timeline-grid { grid-template-columns: 1fr !important; gap: 4rem; }
}
@media (max-width: 640px) {
  .hero h1 { font-size: 2.8rem; }
  .form-grid { grid-template-columns: 1fr !important; }
  .btn-submit { grid-column: span 1; }
  .step-grid { grid-template-columns: 1fr !important; }
  .brand-grid { flex-wrap: wrap; gap: 2rem; justify-content: center; }
  .how h2, .section-title { font-size: 2.5rem; }
  .foot-top { flex-direction: column; gap: 3rem; text-align: center; }
  .foot-links { flex-direction: column; gap: 1.5rem; }
}


  /* Extracted Template Inline Styles */
  .tpl-templates04-1 { background: var(--primary); color: #000; }
  .tpl-templates04-2 { color: #64748b; }
  .tpl-templates04-3 { color: #00ff00; }
  .tpl-templates04-4 { color: #64748b; }
  .tpl-templates04-5 { color: var(--secondary); border: 1px solid var(--secondary); border-radius: 2px; }
  .tpl-templates04-6 { color: var(--secondary); border: 1px solid var(--secondary); border-radius: 2px; }
  .tpl-templates04-7 { color: var(--secondary); border: 1px solid var(--secondary); border-radius: 2px; }
  .tpl-templates04-8 { color: var(--secondary); border: 1px solid var(--secondary); border-radius: 2px; }
  .tpl-templates04-9 { background: var(--primary); color: #000; }
  .tpl-templates04-10 { background: #fff; color: #000; }
  .tpl-templates04-11 { border-top: 1px solid #e2e8f0; }
  .tpl-templates04-12 { color: #64748b; }
  .tpl-templates04-13 { color: #64748b; }
  .tpl-templates04-14 { color: #64748b; }
  .tpl-templates04-15 { color: var(--primary); }
  .tpl-templates04-16 { color: #fff; }
  .tpl-templates04-17 { color: #64748b; }
  .tpl-templates04-18 { border: 2px dashed #22c55e; border-radius: 8px; background: rgba(34,197,94,0.1); color: #166534; }
`

export const travel04Html = `
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">

<header class="nav">
  <div class="container nav-inner">
    <div class="logo">LOGO_PLACEHOLDER</div>
    <div class="nav-right">
       <a href="javascript:void(0);" class="btn-primary tpl-templates04-1"  >Sign in</a>
       <a href="javascript:void(0);" class="btn-primary">Get Started</a>
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
          <h3>// Book your weekend <span class="tpl-templates04-2" style="font-weight: 400">Plan your city break</span></h3>
          <div class="form-grid">
            <div class="form-group">
              <label>Name</label>
              <input type="text" name="full_name" placeholder="Your name" required>
            </div>
            <div class="form-group">
              <label>Email</label>
              <input type="email" name="email_address" placeholder="EMAIL_PLACEHOLDER" required>
            </div>
            <div class="form-group">
              <label>City</label>
              <select name="city" required><option>Pick a city</option><option>Tokyo</option><option>New York</option><option>London</option></select>
            </div>
            <div class="form-group">
              <label>Travelers</label>
              <select name="travelers" required><option>1 Traveler</option><option>2 Travelers</option></select>
            </div>
            <div class="form-group" style="grid-column: span 2;">
              <label>Weekend Of</label>
              <input type="date" name="travel_date" required>
            </div>
            <button type="submit" class="btn-submit">Plan My Weekend →</button>
          </div>
        </form>
      </div>
      
      <div class="hero-visual">
        <div class="hero-img-wrap">
          <img src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=800" alt="City Night">
        </div>
        <div class="weather-badge">
           <h4>92°F</h4>
           <span>Tokyo — Clear Night</span>
        </div>
        <div class="location-badge">
           <i class="fa-solid fa-circle tpl-templates04-3"  style="font-size: 0.5rem"></i>
           <span>Tokyo Weekend <span class="tpl-templates04-4" style="font-weight: 400">Sat—Sun • From $450</span></span>
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
            <img src="https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&q=80&w=600" alt="New York">
            <div class="trend-num">01</div>
          </div>
          <div class="trend-info">
             <h3>New York <span class="tpl-templates04-5" style="font-size: 0.6rem; font-weight: 800; padding: 2px 4px; vertical-align: middle; margin-left: 10px">USA</span></h3>
             <p>Skyline, slices, and the Brooklyn after-hours scene.</p>
             <div class="trend-footer">
                <div class="price"><span>From</span> $580</div>
                <a href="javascript:void(0);" class="btn-view">View Trip →</a>
             </div>
          </div>
        </div>
        
        <div class="trend-card">
          <div class="trend-img">
            <img src="https://images.unsplash.com/photo-1529655683826-aba9b3e77383?auto=format&fit=crop&q=80&w=600" alt="London">
            <div class="trend-num">02</div>
          </div>
          <div class="trend-info">
             <h3>London <span class="tpl-templates04-6" style="font-size: 0.6rem; font-weight: 800; padding: 2px 4px; vertical-align: middle; margin-left: 10px">UK</span></h3>
             <p>Markets, museums, and pubs that have outlasted empires.</p>
             <div class="trend-footer">
                <div class="price"><span>From</span> $420</div>
                <a href="javascript:void(0);" class="btn-view">View Trip →</a>
             </div>
          </div>
        </div>

        <div class="trend-card">
          <div class="trend-img">
            <img src="https://images.unsplash.com/photo-1508964942454-1a56651d54ac?auto=format&fit=crop&q=80&w=600" alt="Singapore">
            <div class="trend-num">03</div>
          </div>
          <div class="trend-info">
             <h3>Singapore <span class="tpl-templates04-7" style="font-size: 0.6rem; font-weight: 800; padding: 2px 4px; vertical-align: middle; margin-left: 10px">SG</span></h3>
             <p>Hawker stalls by night. Infinity pools by morning.</p>
             <div class="trend-footer">
                <div class="price"><span>From</span> $800</div>
                <a href="javascript:void(0);" class="btn-view">View Trip →</a>
             </div>
          </div>
        </div>

        <div class="trend-card">
          <div class="trend-img">
            <img src="https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=80&w=600" alt="Rome">
            <div class="trend-num">04</div>
          </div>
          <div class="trend-info">
             <h3>Rome <span class="tpl-templates04-8" style="font-size: 0.6rem; font-weight: 800; padding: 2px 4px; vertical-align: middle; margin-left: 10px">IT</span></h3>
             <p>2,000 years of history, one perfect cacio e pepe.</p>
             <div class="trend-footer">
                <div class="price"><span>From</span> $510</div>
                <a href="javascript:void(0);" class="btn-view">View Trip →</a>
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
        <div class="vibe-panel night" style="position: relative; overflow: hidden;">
          <img src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&q=80&w=1000" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; z-index: 1;" alt="Night Vibe">
          <div style="position: relative; z-index: 2;">
           <div class="vibe-content">
              <h3>The Night Owl</h3>
              <p>Underground jazz, neon alleys, and sunrise breakfasts. We know where the lights stay on.</p>
              <a href="javascript:void(0);" class="btn-hero-white tpl-templates04-9"  style="padding: 0.5rem 1rem; font-size: 0.7rem">Explore Nightlife</a>
           </div>
           </div>
          </div>
        </div>
        <div class="vibe-panel culture" style="position: relative; overflow: hidden;">
          <img src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=1000" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; z-index: 1;" alt="Culture Vibe">
          <div style="position: relative; z-index: 2;">
           <div class="vibe-content">
              <h3>The Culture Vulture</h3>
              <p>Hidden galleries, Brutalist landmarks, and centuries of stories told in stone.</p>
              <a href="javascript:void(0);" class="btn-hero-white tpl-templates04-10"  style="padding: 0.5rem 1rem; font-size: 0.7rem">Explore Arts</a>
           </div>
           </div>
          </div>
        </div>
        <div class="vibe-panel foodie" style="position: relative; overflow: hidden;">
          <img src="https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=1000" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; z-index: 1;" alt="Foodie Vibe">
          <div style="position: relative; z-index: 2;">
           <div class="vibe-content">
              <h3>The Global Foodie</h3>
              <p>Michelin stars meet street stalls. Every meal is a destination in itself.</p>
              <a href="javascript:void(0);" class="btn-primary" style="padding: 0.5rem 1rem; font-size: 0.7rem;">Explore Tastes</a>
           </div>
           </div>
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
           
           <div class="tpl-templates04-11" style="padding-top: 3rem">
              <div style="margin-bottom: 2rem;">
                 <h4 style="font-weight: 800; margin-bottom: 0.5rem;">✦ Skip-the-line Access</h4>
                 <p class="tpl-templates04-12">We handle all reservations and priority entries before you even land.</p>
              </div>
              <div style="margin-bottom: 2rem;">
                 <h4 style="font-weight: 800; margin-bottom: 0.5rem;">✦ Curated Secret Maps</h4>
                 <p class="tpl-templates04-13">Get a digital map with offline markers for spots that don't appear on Google.</p>
              </div>
              <div>
                 <h4 style="font-weight: 800; margin-bottom: 0.5rem;">✦ 24/7 City Concierge</h4>
                 <p class="tpl-templates04-14">One WhatsApp text away from a table at the city's most exclusive rooftop.</p>
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
      <span class="section-tag tpl-templates04-15"  >// how it works</span>
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
         <div class="logo tpl-templates04-16"  style="font-size: 1.5rem; letter-spacing: 2px">LOGO_PLACEHOLDER</div>
         <div class="foot-links">
            <a href="javascript:void(0);">Cities</a>
            <a href="javascript:void(0);">Guides</a>
            <a href="javascript:void(0);">Help</a>
            <a href="javascript:void(0);">Press</a>
            <a href="javascript:void(0);">Privacy</a>
         </div>
      </div>
      <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center;">
         <p class="tpl-templates04-17">© 2026 metro.travel - built for the weekend</p>
         <div class="foot-social">
            <div class="social-icon"><i class="fa-brands fa-instagram"></i></div>
            <div class="social-icon"><i class="fa-brands fa-twitter"></i></div>
            <div class="social-icon"><i class="fa-brands fa-tiktok"></i></div>
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
          var modalHtml = '<div id="preview-mode-modal" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 999999; display: flex; align-items: center; justify-content: center; background: rgba(15, 23, 42, 0.7); backdrop-filter: blur(8px); opacity: 0; animation: pModalFadeIn 0.3s forwards; font-family: system-ui, -apple-system, sans-serif;"><div style="background: #ffffff; width: 90%; max-width: 400px; border-radius: 20px; padding: 32px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); text-align: center; transform: scale(0.95); animation: pModalScaleUp 0.3s forwards;"><div style="width: 60px; height: 60px; background: #FEF2F2; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;"><svg style="width: 30px; height: 30px; color: #EF4444;" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg></div><h3 style="font-size: 20px; font-weight: 700; color: #0F172A; margin: 0 0 12px; letter-spacing: -0.02em;">Preview Mode Active</h3><p style="font-size: 15px; color: #64748B; margin: 0 0 28px; line-height: 1.5;">Form submissions are disabled in preview mode. Publish your page to accept real submissions.</p><button onclick="document.getElementById(\'preview-mode-modal\').remove()" style="width: 100%; background: #0F172A; color: #ffffff; border: none; padding: 14px; border-radius: 12px; font-size: 15px; font-weight: 600; cursor: pointer; transition: background 0.2s;" onmouseover="this.style.background=\'#1E293B\'" onmouseout="this.style.background=\'#0F172A\'">Got it, close</button></div><style>@keyframes pModalFadeIn { to { opacity: 1; } } @keyframes pModalScaleUp { to { transform: scale(1); } }</style></div>';
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
            e.target.innerHTML = '<div class="tpl-templates04-18" style="padding: 20px; text-align: center"><h3 style="margin: 0 0 10px 0; ">Thank You!</h3><p style="margin: 0;">Your request has been submitted successfully.</p></div>';
          }, 1000);
        }
      }
    }, true);
  })();
</script>

`
