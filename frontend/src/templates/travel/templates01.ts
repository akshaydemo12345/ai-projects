// Auto-generated ULTRA-DYNAMIC template — travel templates01
// Generated: 2026-05-05T11:21:07.412Z

export const travel01Styles = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root {
  --aqua:PRIMARY_COLOR_PLACEHOLDER; --teal:PRIMARY_COLOR_PLACEHOLDER; --sand:#fef3c7; --coral:#fb7185;
  --ink:#0c4a6e; --soft:#ffffff;
  --serif:'DM Serif Display',serif; --sans:'Manrope',sans-serif;
}
html{scroll-behavior:smooth}
body{font-family:var(--sans);background:#ffffff;color:var(--ink);line-height:1.6;-webkit-font-smoothing:antialiased;overflow-x:hidden}
img{max-width:100%;display:block}
a{color:inherit;text-decoration:none}
.container{max-width:1320px;margin:0 auto;padding:0 1.75rem}

.bg-gradient{position:fixed;inset:0;z-index:-2;background:#ffffff}

.nav{position:fixed;top:1.25rem;left:0;right:0;z-index:50}
.nav-inner{background:rgba(255,255,255,.55);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);border:1px solid rgba(255,255,255,.6);border-radius:60px;padding:.85rem 1.5rem .85rem 2rem;display:flex;align-items:center;justify-content:space-between;box-shadow:0 8px 30px rgba(8,145,178,.08)}
.logo{font-family:var(--serif);font-size:1.5rem;color:var(--ink);letter-spacing:-.01em}
.nav nav{display:flex;gap:2.25rem}
.nav nav a{font-size:.88rem;font-weight:500;color:var(--ink);opacity:.8;transition:opacity .2s}
.nav nav a:hover{opacity:1;color:var(--teal)}
.btn-glass{background:PRIMARY_COLOR_PLACEHOLDER !important; color:#fff !important; padding:.65rem 1.4rem; border-radius:50px; font-size:.85rem; font-weight:600; transition:all 0.3s; border:none !important;}
.btn-glass:hover{background:PRIMARY_COLOR_PLACEHOLDER !important; opacity:0.9; transform:translateY(-1px)}

.hero{position:relative;min-height:100vh;display:flex;align-items:center;padding:9rem 0 5rem;overflow:hidden}
.hero-img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:0}
.hero-tint{position:absolute;inset:0;background:linear-gradient(180deg,rgba(6,74,110,.15) 0%,rgba(6,74,110,.4) 100%);z-index:1}
.hero-content{position:relative;z-index:2;color:#fff;max-width:880px}
.pill{display:inline-block;background:rgba(255,255,255,.18);backdrop-filter:blur(14px);border:1px solid rgba(255,255,255,.35);padding:.5rem 1.1rem;border-radius:50px;font-size:.78rem;font-weight:600;letter-spacing:.05em;margin-bottom:1.75rem;color:#fff}
.pill.light{background:rgba(8,145,178,.08);border:1px solid rgba(8,145,178,.2);color:var(--teal)}
.hero h1{font-family:var(--serif);font-size:clamp(3.2rem,8vw,7rem);font-weight:400;line-height:.95;letter-spacing:-.02em;margin-bottom:1.5rem;text-shadow:0 4px 30px rgba(0,0,0,.2)}
.hero p{font-size:1.15rem;max-width:540px;color:rgba(255,255,255,.92);margin-bottom:2.5rem;font-weight:300}

.search-bar{display:grid;grid-template-columns:1.2fr 1fr 1fr auto;gap:.75rem;background:rgba(255,255,255,.92);backdrop-filter:blur(20px);padding:.75rem;border-radius:24px;box-shadow:0 30px 70px rgba(0,0,0,.18);max-width:780px}
.search-bar div{padding:.5rem 1.1rem;border-right:1px solid rgba(8,145,178,.1)}
.search-bar label{display:block;font-size:.7rem;letter-spacing:.14em;text-transform:uppercase;color:var(--teal);font-weight:700;margin-bottom:.25rem}
.search-bar input{background:transparent !important; border:0 !important; outline:0 !important; font-family:inherit; font-size:.95rem; color:var(--ink) !important; font-weight:600; width:100%}
.search-bar button{background:PRIMARY_COLOR_PLACEHOLDER !important; color:#fff !important; border:0 !important; padding:0 2.25rem; border-radius:18px; font-family:inherit; font-weight:600; cursor:pointer; transition:all 0.3s}
.search-bar button:hover{opacity:0.9; transform:scale(1.02)}

.islands{padding:7rem 0}
.head{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:3rem;gap:2rem;flex-wrap:wrap}
.head h2{font-family:var(--serif);font-size:clamp(2.5rem,5vw,4rem);font-weight:400;line-height:1;letter-spacing:-.02em;margin-top:.75rem}
.grid{display:grid;grid-template-columns:repeat(4,1fr);grid-auto-rows:240px;gap:1.5rem}
.island-card{position:relative;border-radius:20px;overflow:hidden;cursor:pointer;transition:transform .5s}
.island-card img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:transform 1s}
.island-card.big{grid-column:span 2;grid-row:span 2}
.island-card.wide{grid-column:span 2}
.island-card .info{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:flex-end;padding:1.5rem;color:#fff;background:linear-gradient(180deg,transparent 30%,rgba(6,74,110,.85) 100%)}

.fleet{padding:8rem 0;background:var(--ink);color:#fff;overflow:hidden}
.fleet-grid{display:grid;grid-template-columns:1fr 1fr;gap:4rem;align-items:center}
.fleet-text h2{font-family:var(--serif);font-size:clamp(2.5rem,5vw,4.5rem);line-height:1.1;margin-bottom:2rem}

/* IMPROVED: A Day In Paradise */
.day-paradise{padding:10rem 0;background:var(--soft);position:relative}
.sticky-split{display:grid;grid-template-columns:1fr 1.2fr;gap:8rem}
.sticky-side{position:sticky;top:10rem;height:fit-content}
.time-tracker{margin-top:3rem;position:relative;padding-left:1.5rem;border-left:1px solid rgba(8,145,178,0.1)}
.time-point{margin-bottom:2.5rem;position:relative}
.time-point::before{content:'';position:absolute;left:-1.55rem;top:0.4rem;width:9px;height:9px;border-radius:50%;background:rgba(8,145,178,0.2);transition:background 0.3s}
.time-point.active::before{background:var(--teal);box-shadow:0 0 10px var(--teal)}
.time-point span{display:block;font-size:0.7rem;letter-spacing:0.2em;color:var(--teal);font-weight:700;margin-bottom:0.25rem}
.time-point h5{font-size:1.1rem;font-weight:600;opacity:0.6;transition:opacity 0.3s}
.time-point.active h5{opacity:1}

.scroll-side .moment{margin-bottom:12rem;transition:transform 0.8s ease}
.moment img{width:100%;height:600px;object-fit:cover;border-radius:40px;box-shadow:0 30px 80px rgba(0,0,0,0.1);margin-bottom:3rem}
.moment-content h3{font-family:var(--serif);font-size:clamp(2rem,4vw,3rem);margin-bottom:1.5rem;line-height:1.1}
.moment-content p{font-size:1.15rem;opacity:0.8;max-width:500px}

/* IMPROVED: Concierge */
.concierge{padding:10rem 0;background:linear-gradient(180deg, #fff 0%, #f0f9ff 100%)}
.concierge-card{background:#ffffff;border:1px solid rgba(8,145,178,0.15);border-radius:40px;padding:5rem;display:grid;grid-template-columns:1fr 1.5fr;gap:5rem;align-items:center;box-shadow:0 60px 120px rgba(8,145,178,0.1)}
.con-visual{position:relative}
.con-img{width:280px;height:380px;border-radius:30px;overflow:hidden;transform:rotate(-3deg);box-shadow:0 30px 60px rgba(0,0,0,0.1)}
.con-img img{width:100%;height:100%;object-fit:cover}
.con-badge{position:absolute;bottom:-20px;right:-20px;background:var(--ink);color:var(--teal);padding:1.5rem;border-radius:20px;transform:rotate(6deg);text-align:center;box-shadow:0 20px 40px rgba(0,0,0,0.2)}
.con-badge strong{display:block;font-size:1.5rem;font-family:var(--serif)}
.con-badge span{font-size:0.65rem;letter-spacing:0.15em;text-transform:uppercase}

.con-text h2{font-family:var(--serif);font-size:clamp(2.5rem,4vw,4rem);margin-bottom:1.5rem;line-height:1.05}
.con-details{display:grid;grid-template-columns:1fr 1fr;gap:2rem;margin:2.5rem 0}
.con-item label{display:block;font-size:0.7rem;text-transform:uppercase;color:var(--teal);font-weight:700;letter-spacing:0.1em;margin-bottom:0.5rem}
.con-item p{font-weight:600;font-size:1.1rem}

.testimonials-creative{padding:10rem 0;text-align:center;background:var(--ink);color:#fff}
.test-quote{font-family:var(--serif);font-size:clamp(1.8rem,4vw,3.5rem);font-style:italic;line-height:1.3;max-width:1000px;margin:0 auto}

.newsletter{padding:6rem 0;background:var(--ink);color:#fff}
.glass-box{background:rgba(255,255,255,0.05) !important; border:1px solid rgba(255,255,255,0.1) !important; padding:4rem; border-radius:40px; display:grid; grid-template-columns:1fr 1fr; gap:4rem; align-items:center}
.glass-box h2{color:#fff !important}
.glass-box p{color:rgba(255,255,255,0.6) !important}
.glass-box form{background:rgba(255,255,255,0.1) !important}
.glass-box input{color:#fff !important}

/* IMPROVED: Footer */
footer{background:var(--soft);padding:8rem 0 4rem;border-top:1px solid rgba(8,145,178,0.1)}
.foot-main{display:grid;grid-template-columns:1.5fr 1fr 1fr 1.2fr;gap:4rem;margin-bottom:6rem}
.foot-brand p{margin:1.5rem 0;font-size:0.95rem;opacity:0.7;max-width:280px}
.foot-social{display:flex;gap:1rem}
.social-ico{width:40px;height:40px;border-radius:50%;border:1px solid rgba(8,145,178,0.2);display:flex;align-items:center;justify-content:center;transition:all 0.3s}
.social-ico:hover{background:var(--teal);border-color:var(--teal);color:#fff;transform:translateY(-3px)}

.foot-col h5{font-size:0.75rem;text-transform:uppercase;letter-spacing:0.15em;margin-bottom:2rem;color:var(--teal)}
.foot-col a{display:block;margin-bottom:0.85rem;font-size:0.95rem;opacity:0.7;transition:all 0.3s}
.foot-col a:hover{opacity:1;padding-left:5px;color:var(--teal)}

.foot-bottom{display:flex;justify-content:space-between;align-items:center;padding-top:2rem;border-top:1px solid rgba(8,145,178,0.1);font-size:0.85rem;opacity:0.6}

@media(max-width: 1100px) {
  .foot-main { grid-template-columns: 1fr 1fr; }
}
@media(max-width: 900px) {
  .sticky-split, .concierge-card, .glass-box, .foot-main { grid-template-columns: 1fr !important; text-align: center !important; }
  .sticky-side { position: static; margin-bottom: 4rem; }
  .con-visual, .con-img { margin: 0 auto; }
  .con-details { grid-template-columns: 1fr; }
  .con-badge { right: 20px; }
  .foot-bottom { flex-direction: column; gap: 1rem; }
}
`;

export const travel01Html = `
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Manrope:wght@300;400;500;600;700&display=swap" rel="stylesheet">

<div class="bg-gradient"></div>
<header class="nav">
  <div class="container nav-inner">
    <a href="#" class="logo">LOGO_PLACEHOLDER</a> 
    <nav>
      <a href="#islands">Destinations</a>
      <a href="#experiences">Moments</a>
      <a href="#fleet">The Fleet</a>
    </nav>
    <a href="#" class="btn-glass">Inquire Now</a>
  </div>
</header>

<section class="hero">
  <img src="/assets/templates/travel/templates01/hero.jpg" alt="Maldives" class="hero-img">
  <div class="hero-tint"></div>
  <div class="container hero-content">
    <span class="pill">✦ PRIVATE ISLAND SPECIALISTS</span>
    <h1>Paradise,<br>privately yours.</h1>
    <p>Crystal lagoons, overwater villas, and barefoot luxury across the world's most secluded islands.</p>
    <form class="search-bar">
      <div><label>Destination</label><input placeholder="Where to?"></div>
      <div><label>Travelers</label><input placeholder="2 Guests"></div>
      <div><label>Duration</label><input placeholder="7 Days"></div>
      <button type="submit">Search →</button>
    </form>
  </div>
</section>

<section class="islands" id="islands">
  <div class="container">
    <div class="head">
      <div>
        <span class="pill light">— Featured Havens</span>
        <h2>Sun-soaked sanctuaries.</h2>
      </div>
      <a href="#" class="link">View Catalog →</a>
    </div>
    <div class="grid">
      <article class="island-card big">
        <img src="/assets/templates/travel/templates01/d1.jpg" alt="Bora Bora">
        <div class="info"><h3>Bora Bora Overwater Villa</h3><p>📍 French Polynesia</p></div>
      </article>
      <article class="island-card"><img src="/assets/templates/travel/templates01/d2.jpg" alt="Reef"><div class="info"><h3>Reef Discovery</h3></div></article>
      <article class="island-card"><img src="/assets/templates/travel/templates01/d3.jpg" alt="Beach"><div class="info"><h3>Hidden Retreat</h3></div></article>
      <article class="island-card wide"><img src="/assets/templates/travel/templates01/d4.jpg" alt="Sunset"><div class="info"><h3>Cliffside Suite</h3></div></article>
    </div>
  </div>
</section>

<section class="fleet" id="fleet">
  <div class="container fleet-grid">
    <div class="fleet-text">
      <span class="pill">✦ PRIVATE TRANSFERS</span>
      <h2>The luxury of a seamless arrival.</h2>
      <p>Whether by private jet or bespoke yacht charter, we ensure your transition from the world to the water is absolute perfection.</p>
      <div style="margin-top: 2rem">
        <a href="#" class="btn-glass">Explore the Fleet</a>
      </div>
    </div>
    <div class="fleet-img-wrap">
      <img src="/assets/templates/travel/templates01/yacht.png" alt="Luxury Yacht">
    </div>
  </div>
</section>

<!-- IMPROVED: A DAY IN PARADISE -->
<section class="day-paradise" id="experiences">
  <div class="container sticky-split">
    <div class="sticky-side">
      <span class="pill light">— THE RHYTHM OF THE ISLAND</span>
      <h2>A Day in<br>Paradise.</h2>
      <div class="time-tracker">
        <div class="time-point active"><span>08:00 AM</span><h5>First Light</h5></div>
        <div class="time-point"><span>01:00 PM</span><h5>Noon Drift</h5></div>
        <div class="time-point"><span>08:00 PM</span><h5>Starlit Dining</h5></div>
      </div>
    </div>
    <div class="scroll-side">
      <div class="moment">
        <img src="/assets/templates/travel/templates01/d3.jpg" alt="Morning">
        <div class="moment-content">
          <h3>Yoga & Fresh Tropics</h3>
          <p>Begin your day with sunrise yoga on your private deck, followed by a chef-prepared breakfast featuring fruit from our island garden.</p>
        </div>
      </div>
      <div class="moment">
        <img src="/assets/templates/travel/templates01/d2.jpg" alt="Afternoon">
        <div class="moment-content">
          <h3>The Deep Blue</h3>
          <p>Explore the vibrant house reef with your personal dive instructor or drift silently across the lagoon in a glass-bottom kayak.</p>
        </div>
      </div>
      <div class="moment">
        <img src="/assets/templates/travel/templates01/dinner.png" alt="Evening">
        <div class="moment-content">
          <h3>Dinner on the Sands</h3>
          <p>A candlelit table set at the water's edge, featuring catch of the day and fine wines from our underwater cellar.</p>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- IMPROVED: CONCIERGE -->
<section class="concierge">
  <div class="container">
    <div class="concierge-card">
      <div class="con-visual">
        <div class="con-img">
          <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600" alt="Concierge">
        </div>
        <div class="con-badge">
          <strong>12+</strong>
          <span>Yrs Exp.</span>
        </div>
      </div>
      <div class="con-text">
        <span class="pill light">— YOUR PRIVATE CONCIERGE</span>
        <h2>Elena Rossi.</h2>
        <p>From arranging private jet connections to curating surprise beach proposals, Elena ensures your stay is exactly as you imagined, before you even arrive.</p>
        <div class="con-details">
          <div class="con-item"><label>Direct Line</label><p>Priority Concierge</p></div>
          <div class="con-item"><label>Languages</label><p>EN · IT · FR · ES</p></div>
        </div>
        <a href="#" class="btn-glass">Schedule a Call</a>
      </div>
    </div>
  </div>
</section>

<section class="testimonials-creative">
  <div class="container">
    <div class="test-quote">
      "Azure transformed our honeymoon into a dream. We didn't just stay at a resort; we lived in a different world where every wish was anticipated."
    </div>
    <span class="pill" style="margin-top: 2rem">✦ MARCOS & LENA, LONDON</span>
  </div>
</section>


<!-- IMPROVED: FOOTER -->
<footer>
  <div class="container">
    <div class="foot-main">
      <div class="foot-brand">
        <div class="logo">LOGO_PLACEHOLDER</div>
        <p>The world's leading specialists in private island and luxury retreat curation since 2008.</p>
        <div class="foot-social">
          <a href="#" class="social-ico">IG</a>
          <a href="#" class="social-ico">FB</a>
          <a href="#" class="social-ico">LI</a>
        </div>
      </div>
      <div class="foot-col">
        <h5>Destinations</h5>
        <a href="#">Maldives</a><a href="#">Seychelles</a><a href="#">Bora Bora</a><a href="#">Santorini</a>
      </div>
      <div class="foot-col">
        <h5>Experience</h5>
        <a href="#">Private Villas</a><a href="#">The Fleet</a><a href="#">Concierge</a><a href="#">Wellness</a>
      </div>
      <div class="foot-col">
        <h5>Contact</h5>
        <a href="#">London Office</a><a href="#">Dubai Office</a><a href="#">+44 20 7946 0958</a><a href="#">hello@azure.com</a>
      </div>
    </div>
    <div class="foot-bottom">
      <p>© 2026 PROJECT_NAME_PLACEHOLDER. All rights reserved.</p>
      <div style="display:flex; gap: 2rem">
        <a href="#">Privacy Policy</a>
        <a href="#">Terms of Service</a>
      </div>
    </div>
  </div>
</footer>
`;
