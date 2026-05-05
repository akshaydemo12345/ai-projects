// Auto-generated ULTRA-DYNAMIC template — travel templates03
// Generated: 2026-05-05T11:39:59.000Z

export const travel03Styles = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root {
  --midnight:#0a1128; --gold:PRIMARY_COLOR_PLACEHOLDER; --accent:#7d9d9c;
  --ivory:#f8f9fa; --soft-gold:rgba(197,160,89,0.15);
  --serif:'Playfair Display',serif; --sans:'Montserrat',sans-serif;
}
html{scroll-behavior:smooth}
body{font-family:var(--sans);background:var(--ivory);color:var(--midnight);line-height:1.7;-webkit-font-smoothing:antialiased;overflow-x:hidden}
img{max-width:100%;display:block}
a{color:inherit;text-decoration:none}
.container{max-width:1400px;margin:0 auto;padding:0 2rem}

/* 1. HERO */
.hero{position:relative;height:100vh;display:flex;align-items:center;justify-content:center;text-align:center;color:#fff;overflow:hidden}
.hero-img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:0;transform:scale(1.1);animation:slow-pan 20s infinite alternate}
.hero-overlay{position:absolute;inset:0;background:linear-gradient(to bottom, rgba(10,17,40,0.3), rgba(10,17,40,0.8));z-index:1}
.hero-content{position:relative;z-index:2;max-width:1200px;display:grid;grid-template-columns:1fr 400px;gap:6rem;align-items:center;text-align:left}
.hero-text h1{font-family:var(--serif);font-size:clamp(3rem,6vw,6rem);font-weight:400;line-height:1;margin-bottom:2rem;letter-spacing:-0.02em}
.hero-text p.kicker{font-size:1rem;letter-spacing:0.3em;text-transform:uppercase;color:var(--gold);margin-bottom:1.5rem;font-weight:600}

.hero-form{background:rgba(255,255,255,0.08);backdrop-filter:blur(40px);border:1px solid rgba(255,255,255,0.15);padding:3rem;border-radius:40px;box-shadow:0 50px 120px rgba(0,0,0,0.4);display:grid;grid-template-columns:1fr 1fr;gap:1.5rem}
.hero-form h3{font-family:var(--serif);font-size:1.8rem;margin-bottom:1rem;grid-column:span 2;text-align:left}
.form-field{margin-bottom:0}
.form-field.full{grid-column:span 2}
.form-field label{display:block;font-size:0.6rem;letter-spacing:0.12em;text-transform:uppercase;color:var(--gold);margin-bottom:0.5rem;font-weight:700}
.form-field input, .form-field select{width:100%;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);padding:1.1rem;color:#fff;border-radius:15px;font-family:inherit;outline:none;transition:all 0.3s;font-size:0.9rem}
.form-field input:focus, .form-field select:focus{background:#fff;border-color:var(--gold);color:var(--midnight)}
.form-field select:focus{color:var(--gold);font-weight:600}
.hero-form button{grid-column:span 2;background:var(--gold);color:var(--midnight);border:none;padding:1.3rem;border-radius:15px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;cursor:pointer;transition:all 0.3s;margin-top:1rem;font-size:0.9rem}
.hero-form button:hover{transform:scale(1.02);box-shadow:0 20px 40px rgba(197,160,89,0.4)}
.scroll-hint{position:absolute;bottom:3rem;left:50%;transform:translateX(-50%);z-index:2;animation:bounce 2s infinite}

/* 2. PHILOSOPHY */
.philosophy{padding:10rem 0;background:var(--midnight);color:#fff;position:relative}
.philo-grid{display:grid;grid-template-columns:1fr 1fr;gap:6rem;align-items:center}
.philo-text h2{font-family:var(--serif);font-size:clamp(2.5rem,5vw,4rem);margin-bottom:2rem;line-height:1.1}
.philo-text p{font-size:1.1rem;opacity:0.8;margin-bottom:2.5rem;max-width:540px}
.philo-img{position:relative;height:600px;border-radius:400px 400px 0 0;overflow:hidden}
.philo-img img{width:100%;height:100%;object-fit:cover}

/* 3. DESTINATIONS */
.destinations{padding:10rem 0}
.dest-head{text-align:center;margin-bottom:5rem}
.dest-head h2{font-family:var(--serif);font-size:clamp(2.5rem,4vw,3.5rem);margin-bottom:1rem}
.dest-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:2rem}
.dest-card{position:relative;height:550px;border-radius:20px;overflow:hidden;cursor:pointer}
.dest-card img{width:100%;height:100%;object-fit:cover;transition:transform 1s cubic-bezier(0.2,0.8,0.2,1)}
.dest-card:hover img{transform:scale(1.1)}
.dest-card-overlay{position:absolute;inset:0;background:linear-gradient(to bottom, transparent 40%, rgba(10,17,40,0.9));display:flex;flex-direction:column;justify-content:flex-end;padding:3rem;color:#fff}
.dest-card h3{font-family:var(--serif);font-size:2rem;margin-bottom:0.5rem}
.dest-card span{font-size:0.8rem;letter-spacing:0.2em;text-transform:uppercase;color:var(--gold)}

/* 4. AMENITIES */
.amenities{padding:10rem 0;background:var(--ivory)}
.amen-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:2rem}
.amen-card{background:#fff;padding:4rem 2rem;text-align:center;border-radius:20px;box-shadow:0 20px 50px rgba(0,0,0,0.03);transition:transform 0.3s}
.amen-card:hover{transform:translateY(-10px)}
.amen-icon{font-size:3rem;color:var(--gold);margin-bottom:2rem}
.amen-card h4{font-family:var(--serif);font-size:1.5rem;margin-bottom:1rem}
.amen-card p{font-size:0.9rem;opacity:0.7}

/* 5. DESIGNER */
.designer{padding:15rem 0;background:#fff;overflow:hidden}
.designer-card{display:grid;grid-template-columns:1.2fr 1fr;gap:8rem;align-items:center;position:relative}
.des-img-wrap{position:relative}
.des-img{height:750px;width:100%;border-radius:20px;overflow:hidden;box-shadow:30px 30px 0 var(--soft-gold)}
.des-img img{width:100%;height:100%;object-fit:cover}
.des-badge{position:absolute;bottom:4rem;right:-3rem;background:var(--midnight);color:var(--gold);padding:2.5rem;border-radius:50%;width:180px;height:180px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;box-shadow:var(--shadow-lg);z-index:2;animation:float 6s ease-in-out infinite}
.des-badge strong{font-family:var(--serif);font-size:2.5rem;line-height:1}
.des-badge span{font-size:0.6rem;letter-spacing:0.1em;text-transform:uppercase}

.des-text{position:relative;z-index:1}
.des-text .tag{font-size:0.8rem;letter-spacing:0.3em;text-transform:uppercase;color:var(--gold);margin-bottom:1.5rem;display:block;font-weight:600}
.des-text h2{font-family:var(--serif);font-size:clamp(3rem,5vw,4.5rem);line-height:1;margin-bottom:2rem}
.des-text p{font-size:1.1rem;opacity:0.8;margin-bottom:3rem;line-height:1.8}
.signature{font-family:'Dancing Script',cursive;font-size:3.5rem;color:var(--midnight);margin-top:2rem;opacity:0.9}

@keyframes float { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-20px) rotate(5deg); } }

/* 6. RETREATS */
.retreats{padding:10rem 0;background:var(--midnight);color:#fff}
.ret-list{display:flex;gap:4rem;overflow-x:auto;padding:2rem 0;scrollbar-width:none}
.ret-card{min-width:450px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);padding:3rem;border-radius:30px}
.ret-card h3{font-family:var(--serif);font-size:2.2rem;margin-bottom:1.5rem;color:var(--gold)}
.ret-card ul{list-style:none;margin-bottom:2rem}
.ret-card li{margin-bottom:1rem;opacity:0.8;display:flex;align-items:center;gap:1rem}
.ret-card li::before{content:"✧";color:var(--gold)}

/* 7. ECHOES */
.echoes{padding:10rem 0;text-align:center}
.echo-quote{font-family:var(--serif);font-size:3rem;max-width:1000px;margin:0 auto 3rem;font-style:italic}
.echo-author{font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:var(--gold)}

/* 8. FOOTER */
footer{background:var(--midnight);color:#fff;padding:8rem 0 4rem}
.footer-grid{display:grid;grid-template-columns:2fr 1fr 1fr 1.5fr;gap:4rem;margin-bottom:6rem}
.footer-logo{font-family:var(--serif);font-size:2rem;margin-bottom:2rem}
.footer-col h5{font-size:0.8rem;letter-spacing:0.2em;text-transform:uppercase;color:var(--gold);margin-bottom:2.5rem}
.footer-col a{display:block;margin-bottom:1rem;opacity:0.6;transition:opacity 0.3s}
.footer-col a:hover{opacity:1;color:var(--gold)}
.footer-bottom{display:flex;justify-content:space-between;padding-top:3rem;border-top:1px solid rgba(255,255,255,0.1);font-size:0.8rem;opacity:0.5}

@keyframes slow-pan { from { transform: scale(1.1) translateX(-2%); } to { transform: scale(1.1) translateX(2%); } }
@keyframes bounce { 0%, 20%, 50%, 80%, 100% {transform: translateY(0) translateX(-50%);} 40% {transform: translateY(-10px) translateX(-50%);} 60% {transform: translateY(-5px) translateX(-50%);} }

@media (max-width: 1024px) {
  .dest-grid { grid-template-columns: 1fr 1fr; }
  .amen-grid { grid-template-columns: 1fr 1fr; }
  .footer-grid { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 768px) {
  .philo-grid, .designer-card, .dest-grid, .amen-grid, .footer-grid { grid-template-columns: 1fr !important; text-align: center; }
  .hero h1 { font-size: 3.5rem; }
  .ret-card { min-width: 300px; }
  .footer-bottom { flex-direction: column; gap: 2rem; }
}
`;

export const travel03Html = `
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Dancing+Script:wght@600&display=swap" rel="stylesheet">

<header style="position:fixed;top:0;left:0;right:0;z-index:100;padding:2rem 0;color:#fff">
  <div class="container" style="display:flex;justify-content:space-between;align-items:center">
    <a href="#" class="logo" style="font-family:var(--serif);font-size:1.8rem;letter-spacing:2px">LOGO_PLACEHOLDER</a>
    <nav style="display:flex;gap:3rem;font-size:0.8rem;letter-spacing:2px;text-transform:uppercase">
      <a href="#destinations">Journeys</a>
      <a href="#retreats">Retreats</a>
      <a href="#contact">Contact</a>
    </nav>
  </div>
</header>

<section class="hero">
  <img src="/assets/templates/travel/templates03/hero.png" class="hero-img" alt="Luxury Bali Retreat">
  <div class="hero-overlay"></div>
  <div class="container hero-content">
    <div class="hero-text">
      <p class="kicker">Handcrafted Journeys for the Soul</p>
      <h1>The Art of<br/>Slowing Down.</h1>
    </div>
    <form class="hero-form" onsubmit="event.preventDefault();alert('Thank you! Our journey designer will contact you shortly.');">
      <h3>Begin Your Pause</h3>
      <div class="form-field full">
        <label>Full Name</label>
        <input type="text" placeholder="Jane Doe" required>
      </div>
      <div class="form-field">
        <label>Destination</label>
        <select>
          <option>Bali Serenity</option>
          <option>Patagonian Silence</option>
          <option>Nordic Stillness</option>
        </select>
      </div>
      <div class="form-field">
        <label>Travel Date</label>
        <input type="date" required>
      </div>
      <button type="submit">Request Private Inquiry</button>
    </form>
  </div>
  <div class="scroll-hint">↓</div>
</section>

<section class="philosophy">
  <div class="container philo-grid">
    <div class="philo-text">
      <p style="color:var(--gold);letter-spacing:3px;margin-bottom:1rem">OUR PHILOSOPHY</p>
      <h2>Travel that transforms.</h2>
      <p>We believe travel should be more than just visiting a place. It should be a pause, a breath, and a return to oneself. Our retreats are designed to silence the noise and amplify the soul.</p>
      <a href="#" style="border-bottom:1px solid var(--gold);padding-bottom:5px;color:var(--gold);font-size:0.9rem">Learn More</a>
    </div>
    <div class="philo-img">
      <img src="/assets/templates/travel/templates03/spa.png" alt="Zen Spa Interior">
    </div>
  </div>
</section>

<section class="destinations" id="destinations">
  <div class="container">
    <div class="dest-head">
      <p style="color:var(--gold);letter-spacing:3px;margin-bottom:1rem">SACRED LANDS</p>
      <h2>Signature Destinations</h2>
    </div>
    <div class="dest-grid">
      <div class="dest-card">
        <img src="/assets/templates/travel/templates03/hero.png" alt="Bali">
        <div class="dest-card-overlay">
          <span>INDONESIA</span>
          <h3>Ubud Serenity</h3>
        </div>
      </div>
      <div class="dest-card">
        <img src="/assets/templates/travel/templates03/patagonia.png" alt="Patagonia">
        <div class="dest-card-overlay">
          <span>CHILE</span>
          <h3>Patagonian Silence</h3>
        </div>
      </div>
      <div class="dest-card">
        <img src="https://images.unsplash.com/photo-1532236204992-f5e85c024202?auto=format&fit=crop&q=80&w=800" alt="Iceland">
        <div class="dest-card-overlay">
          <span>ICELAND</span>
          <h3>Nordic Stillness</h3>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="amenities">
  <div class="container">
    <div class="amen-grid">
      <div class="amen-card">
        <div class="amen-icon">✧</div>
        <h4>Private Sanctuary</h4>
        <p>Bespoke villas designed with natural materials and open spaces.</p>
      </div>
      <div class="amen-card">
        <div class="amen-icon">✧</div>
        <h4>Holistic Healing</h4>
        <p>Michelin-star organic dining and personalized wellness rituals.</p>
      </div>
      <div class="amen-card">
        <div class="amen-icon">✧</div>
        <h4>Sacred Service</h4>
        <p>24/7 dedicated butler service trained in mindful hospitality.</p>
      </div>
      <div class="amen-card">
        <div class="amen-icon">✧</div>
        <h4>Expert Guides</h4>
        <p>Spiritual mentors and nature experts leading every journey.</p>
      </div>
    </div>
  </div>
</section>

<section class="designer">
  <div class="container designer-card">
    <div class="des-img-wrap">
      <div class="des-img">
        <img src="/assets/templates/travel/templates03/designer.png" alt="Journey Designer">
      </div>
      <div class="des-badge">
        <strong>15+</strong>
        <span>YEARS OF<br/>EXPERTISE</span>
      </div>
    </div>
    <div class="des-text">
      <span class="tag">CURATED BY HUMAN SOUL</span>
      <h2>Anya Varma.</h2>
      <p>I don't just book trips; I design chapters of your life story. With a deep connection to the lands I serve, every journey is a bespoke masterpiece of discovery, luxury, and silence.</p>
      <div style="display:flex;gap:3rem;margin-bottom:3rem">
        <div><strong style="display:block;font-size:1.5rem;font-family:var(--serif)">50+</strong><span style="font-size:0.7rem;letter-spacing:1px;opacity:0.6">COUNTRIES EXPLORED</span></div>
        <div><strong style="display:block;font-size:1.5rem;font-family:var(--serif)">2k+</strong><span style="font-size:0.7rem;letter-spacing:1px;opacity:0.6">SOULS TRANSFORMED</span></div>
      </div>
      <a href="#" style="display:inline-block;padding:1.3rem 3.5rem;background:var(--midnight);color:var(--gold);font-weight:700;letter-spacing:2px;border-radius:0;transition:0.3s">SCHEDULE A PRIVATE CONSULTATION</a>
      <div class="signature">Anya Varma</div>
    </div>
  </div>
</section>

<section class="retreats" id="retreats">
  <div class="container">
    <div class="dest-head">
      <p style="color:var(--gold);letter-spacing:3px;margin-bottom:1rem">CURRENT CURATIONS</p>
      <h2>Featured Retreats</h2>
    </div>
    <div class="ret-list">
      <div class="ret-card">
        <h3>The Silent Ascent</h3>
        <p style="margin-bottom:1.5rem;opacity:0.7">Bhutan | 10 Days</p>
        <ul>
          <li>Monastery Meditation</li>
          <li>Sacred Valley Hiking</li>
          <li>Himalayan Spa Rituals</li>
        </ul>
        <a href="#" style="color:var(--gold);font-weight:600">View Journey →</a>
      </div>
      <div class="ret-card">
        <h3>Liquid Mind</h3>
        <p style="margin-bottom:1.5rem;opacity:0.7">Maldives | 7 Days</p>
        <ul>
          <li>Underwater Meditation</li>
          <li>Floating Sound Baths</li>
          <li>Coral Restoration</li>
        </ul>
        <a href="#" style="color:var(--gold);font-weight:600">View Journey →</a>
      </div>
      <div class="ret-card">
        <h3>Desert Stillness</h3>
        <p style="margin-bottom:1.5rem;opacity:0.7">Jordan | 8 Days</p>
        <ul>
          <li>Star-view Glamping</li>
          <li>Dead Sea Floating</li>
          <li>Wadi Rum Trekking</li>
        </ul>
        <a href="#" style="color:var(--gold);font-weight:600">View Journey →</a>
      </div>
    </div>
  </div>
</section>

<section class="echoes">
  <div class="container">
    <div class="echo-quote">
      "Etheria didn't just give us a holiday; they gave us back our peace. It was the first time in years we felt truly connected to the world."
    </div>
    <p class="echo-author">— JAMES & SARAH, NEW YORK</p>
  </div>
</section>

<footer id="contact">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <div class="footer-logo">LOGO_PLACEHOLDER</div>
        <p style="opacity:0.6;font-size:0.9rem">Etheria Journeys is a collective of travel designers, spiritual mentors, and nature lovers dedicated to the art of the retreat.</p>
      </div>
      <div class="footer-col">
        <h5>Explore</h5>
        <a href="#">Destinations</a><a href="#">Our Philosophy</a><a href="#">Journal</a><a href="#">Press</a>
      </div>
      <div class="footer-col">
        <h5>Legal</h5>
        <a href="#">Privacy Policy</a><a href="#">Terms of Service</a><a href="#">Booking Conditions</a>
      </div>
      <div class="footer-col">
        <h5>Connect</h5>
        <p style="opacity:0.6;font-size:0.9rem;margin-bottom:1.5rem">Receive our seasonal curations on mindful travel.</p>
        <form style="display:flex;gap:1rem">
          <input type="email" placeholder="Email Address" style="flex:1;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);padding:1rem;color:#fff;border-radius:5px">
          <button style="background:var(--gold);color:var(--midnight);border:none;padding:1rem 2rem;font-weight:700;border-radius:5px">Join</button>
        </form>
      </div>
    </div>
    <div class="footer-bottom">
      <p>© 2026 PROJECT_NAME_PLACEHOLDER. All rights reserved.</p>
      <div style="display:flex;gap:2rem">
        <a href="#">Instagram</a><a href="#">LinkedIn</a><a href="#">Pinterest</a>
      </div>
    </div>
  </div>
</footer>
`;
