// Auto-generated ULTRA-DYNAMIC template — travel templates01
// Generated: 2026-04-30T08:31:28.858Z

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
.search-bar div:nth-child(3){border-right:0}
.search-bar label{display:block;font-size:.7rem;letter-spacing:.14em;text-transform:uppercase;color:var(--teal);font-weight:700;margin-bottom:.25rem}
.search-bar input{background:transparent !important; border:0 !important; outline:0 !important; font-family:inherit; font-size:.95rem; color:var(--ink) !important; font-weight:600; width:100%}
.search-bar button{background:PRIMARY_COLOR_PLACEHOLDER !important; color:#fff !important; border:0 !important; padding:0 2.25rem; border-radius:18px; font-family:inherit; font-weight:600; cursor:pointer; transition:all 0.3s}
.search-bar button:hover{opacity:0.9; transform:scale(1.02)}

.islands{padding:7rem 0}
.head{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:3rem;gap:2rem;flex-wrap:wrap}
.head h2{font-family:var(--serif);font-size:clamp(2.5rem,5vw,4rem);font-weight:400;line-height:1;letter-spacing:-.02em;margin-top:.75rem}
.link{color:var(--teal);font-weight:600;font-size:.95rem;border-bottom:1px solid var(--teal);padding-bottom:2px}
.grid{display:grid;grid-template-columns:repeat(4,1fr);grid-auto-rows:240px;gap:1.5rem}
.island-card{position:relative;border-radius:20px;overflow:hidden;cursor:pointer;transition:transform .5s}
.island-card:hover{transform:translateY(-4px)}
.island-card img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:transform 1s}
.island-card:hover img{transform:scale(1.08)}
.island-card.big{grid-column:span 2;grid-row:span 2}
.island-card.wide{grid-column:span 2}
.island-card .info{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:flex-end;padding:1.5rem;color:#fff;background:linear-gradient(180deg,transparent 30%,rgba(6,74,110,.85) 100%)}
.loc{font-size:.78rem;letter-spacing:.06em;opacity:.9;margin-bottom:.4rem}
.island-card h3{font-family:var(--serif);font-size:1.4rem;line-height:1.1;margin-bottom:.5rem}
.island-card.big h3{font-size:2rem}
.island-card .info p{font-size:.88rem;opacity:.85;margin-bottom:.85rem;font-weight:300}
.row{display:flex;justify-content:space-between;align-items:center;font-size:.85rem}
.rating{background:rgba(255,255,255,.18);backdrop-filter:blur(10px);padding:.3rem .65rem;border-radius:30px;font-weight:600}
.cost{font-weight:700;font-size:1rem}
.cost small{font-weight:400;opacity:.8;font-size:.75rem}

.experiences{padding:6rem 0}
.exp-flex{display:grid;grid-template-columns:1fr 1fr;gap:5rem;align-items:center}
.exp-flex h2{font-family:var(--serif);font-size:clamp(2.2rem,4.5vw,3.6rem);font-weight:400;line-height:1.05;margin-top:.5rem;margin-bottom:1.25rem;letter-spacing:-.02em}
.lead{font-size:1.1rem;color:PRIMARY_COLOR_PLACEHOLDER;margin-bottom:2rem;max-width:480px}
.checklist{list-style:none;margin-bottom:2.25rem}
.checklist li{padding:.65rem 0;border-bottom:1px solid rgba(8,145,178,.12);font-weight:500;position:relative;padding-left:1.75rem}
.checklist li::before{content:"✦";color:var(--coral);position:absolute;left:0;top:.65rem}
.btn-fill{display:inline-block;background:var(--ink);color:#fff;padding:1rem 2rem;border-radius:50px;font-weight:600;font-size:.9rem;transition:all .3s}
.btn-fill:hover{background:var(--teal);transform:translateY(-2px);box-shadow:0 15px 35px rgba(8,145,178,.3)}

.exp-stack{display:grid;grid-template-columns:1fr 1fr;gap:1.25rem}
.stat-card{padding:2.5rem 1.75rem;border-radius:24px;text-align:center}
.glass{background:rgba(255,255,255,.55);backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,.6);box-shadow:0 15px 40px rgba(8,145,178,.1)}
.stat-card.wide{grid-column:span 2}
.stat-card strong{display:block;font-family:var(--serif);font-size:3.5rem;color:var(--teal);line-height:1;margin-bottom:.5rem}
.stat-card span{font-size:.85rem;font-weight:500;color:PRIMARY_COLOR_PLACEHOLDER;letter-spacing:.05em}

.newsletter{padding:4rem 0 6rem}
.glass-box{background:#ffffff !important; color:var(--ink) !important; padding:3.5rem; border-radius:32px; display:grid; grid-template-columns:1fr 1fr; gap:3rem; align-items:center; border: 1px solid rgba(8,145,178,0.15); box-shadow:0 20px 50px rgba(0,0,0,0.05)}
.glass-box h2{font-family:var(--serif); font-size:clamp(1.8rem,3.5vw,2.6rem); font-weight:400; margin-bottom:.5rem; line-height:1.05; color:var(--ink)}
.glass-box p{opacity:.7; color:var(--ink)}
.glass-box form{display:flex; background:rgba(8,145,178,0.05) !important; border:1px solid rgba(8,145,178,0.1) !important; border-radius:50px; padding:.4rem}
.glass-box input{flex:1; background:transparent !important; border:0 !important; outline:0 !important; padding:.85rem 1.25rem; color:var(--ink) !important; font-family:inherit; font-size:.95rem}
.glass-box input::placeholder{color:rgba(12,74,110,.4) !important}
.glass-box button{background:PRIMARY_COLOR_PLACEHOLDER !important; color:#fff !important; border:0 !important; padding:.85rem 1.75rem; border-radius:50px; font-family:inherit; font-weight:600; cursor:pointer; transition: transform 0.2s}
.glass-box button:hover{transform: scale(1.05)}

footer{padding:3rem 0}
.foot-top{display:flex;justify-content:space-between;align-items:center;padding-bottom:2rem;border-bottom:1px solid rgba(8,145,178,.15);margin-bottom:1.5rem;flex-wrap:wrap;gap:1.5rem}
.links{display:flex;gap:2rem}
.links a{font-size:.9rem;font-weight:500;opacity:.7;transition:opacity .2s}
.links a:hover{opacity:1;color:var(--teal)}
footer > .foot p{font-size:.85rem;opacity:.6}

/* UNIVERSAL RESPONSIVE FIXES */
@media(max-width: 900px) {
  .container { max-width: 100% !important; padding: 0 1.5rem !important; }
  .search-bar { grid-template-columns: 1fr !important; padding: 1.5rem !important; border-radius: 20px !important; }
  .grid { grid-template-columns: 1fr 1fr !important; grid-auto-rows: 220px !important; }
  .island-card.big, .island-card.wide { grid-column: span 2 !important; }
  .exp-flex, .glass-box { grid-template-columns: 1fr !important; text-align: center !important; gap: 2rem !important; padding: 2.5rem 1.5rem !important; }
}

@media(max-width: 600px) {
  h1 { font-size: 2.5rem !important; line-height: 1.1 !important; }
  .grid { grid-template-columns: 1fr !important; grid-auto-rows: 280px !important; }
  .island-card.big, .island-card.wide { grid-column: span 1 !important; }
  .nav nav, .links { display: none !important; }
  .foot-top { flex-direction: column !important; text-align: center !important; gap: 1.5rem !important; }
  .glass-box form { flex-direction: column !important; border-radius: 20px !important; padding: 1rem !important; }
  .glass-box input { width: 100% !important; text-align: center !important; margin-bottom: 0.5rem !important; }
  .glass-box button { width: 100% !important; display: block !important; }
}

/* GLOBAL EDITOR DEFAULTS FOR NEW ELEMENTS */
button:not(.nav *):not(.search-bar *):not(.glass-box *) {
  background: PRIMARY_COLOR_PLACEHOLDER !important;
  color: #fff !important;
  padding: 12px 24px !important;
  border-radius: 50px !important;
  border: none !important;
  font-family: inherit !important;
  font-weight: 600 !important;
  cursor: pointer !important;
  transition: all 0.3s !important;
}

input:not(.search-bar *):not(.glass-box *) {
  width: 100% !important;
  padding: 12px 18px !important;
  border-radius: 8px !important;
  border: 1px solid rgba(12,74,110,0.15) !important;
  background: #fff !important;
  font-family: inherit !important;
  font-size: 14px !important;
  outline: none !important;
  margin-bottom: 15px !important;
}

input:focus {
  border-color: PRIMARY_COLOR_PLACEHOLDER !important;
  box-shadow: 0 0 0 3px color-mix(in srgb, PRIMARY_COLOR_PLACEHOLDER, transparent 90%) !important;
}

.material-symbols-outlined, .material-icons {
  font-display: swap;
  white-space: nowrap;
  word-wrap: normal;
  direction: ltr;
  -webkit-font-feature-settings: 'liga';
  -webkit-font-smoothing: antialiased;
}
`;

export const travel01Html = `
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Manrope:wght@300;400;500;600;700&display=swap" rel="stylesheet">

<div class="bg-gradient"></div>
<header class="nav">
  <div class="container nav-inner">
    <a href="#" class="logo">LOGO_PLACEHOLDER</a> 
    <a href="#" class="btn-glass">contact</a>
  </div>
</header>

<section class="hero">
  <img src="/assets/templates/travel/templates01/hero.jpg" alt="Maldives" class="hero-img">
  <div class="hero-tint"></div>
  <div class="container hero-content">
    <span class="pill">✦ Voted #1 Island Specialist 2026</span>
    <h1>Paradise,<br>privately yours.</h1>
    <p>Crystal lagoons, overwater villas, and barefoot luxury across the world's most secluded islands.</p>
    <form class="search-bar">
      <div><label>Full Name</label><input placeholder="Your Name"></div>
      <div><label>Email Address</label><input type="email" placeholder="mail@example.com" required></div>
      <div><label>Phone Number</label><input placeholder="+1 234 567 890"></div>
      <button type="submit">Submit →</button>
    </form>
  </div>
</section>

<section class="islands" id="islands">
  <div class="container">
    <div class="head">
      <div>
        <span class="pill light">— Featured Islands</span>
        <h2>Sun-soaked sanctuaries.</h2>
      </div>
      <a href="#" class="link">View all →</a>
    </div>
    <div class="grid">
      <article class="island-card big">
        <img src="/assets/templates/travel/templates01/d1.jpg" alt="Bora Bora">
        <div class="info">
          <span class="loc">📍 French Polynesia</span>
          <h3>Bora Bora Overwater Villa</h3>
          <p>Glass floors, private plunge pools, your own slice of turquoise.</p>
          <div class="row"><span class="rating">★ 4.98 (412)</span><span class="cost">$1,290 <small>/ night</small></span></div>
        </div>
      </article>
      <article class="island-card">
        <img src="/assets/templates/travel/templates01/d2.jpg" alt="Coral reef snorkel">
        <div class="info">
          <span class="loc">📍 Great Barrier Reef</span>
          <h3>Reef Discovery</h3>
          <div class="row"><span class="rating">★ 4.92</span><span class="cost">$390</span></div>
        </div>
      </article>
      <article class="island-card">
        <img src="/assets/templates/travel/templates01/d3.jpg" alt="Beach hammock">
        <div class="info">
          <span class="loc">📍 Tulum, Mexico</span>
          <h3>Hidden Beach Retreat</h3>
          <div class="row"><span class="rating">★ 4.87</span><span class="cost">$520</span></div>
        </div>
      </article>
      <article class="island-card wide">
        <img src="/assets/templates/travel/templates01/d4.jpg" alt="Sunset cocktail">
        <div class="info">
          <span class="loc">📍 Santorini, Greece</span>
          <h3>Cliffside Sunset Suite</h3>
          <p>Infinity pool meets the Aegean.</p>
          <div class="row"><span class="rating">★ 4.95</span><span class="cost">$890 <small>/ night</small></span></div>
        </div>
      </article>
    </div>
  </div>
</section>

<section class="experiences" id="experiences">
  <div class="container exp-flex">
    <div>
      <span class="pill light">— Curated Experiences</span>
      <h2>Beyond the beach.</h2>
      <p class="lead">From sunrise yoga on a private sandbank to candlelit dinners under the stars — every moment, designed.</p>
      <ul class="checklist">
        <li>Private island picnics</li>
        <li>Bioluminescent kayak tours</li>
        <li>Michelin-trained beach chefs</li>
        <li>Personal butler & dive instructor</li>
      </ul>
      <a href="#" class="btn-fill">Build Your Itinerary</a>
    </div>
    <div class="exp-stack">
      <div class="stat-card glass"><strong>40+</strong><span>Private Islands</span></div>
      <div class="stat-card glass"><strong>98%</strong><span>Repeat Guests</span></div>
      <div class="stat-card glass wide"><strong>24/7</strong><span>Concierge in 12 Languages</span></div>
    </div>
  </div>
</section>

<section class="newsletter">
  <div class="container glass-box">
    <div>
      <h2>Be the first to know.</h2>
      <p>Exclusive island openings, secret offers, and stories from the sea.</p>
    </div>
    <form><input placeholder="Email address"><button>Join</button></form>
  </div>
</section>

<footer>
  <div class="container foot">
    <div class="foot-top">
      <a href="#" class="logo">LOGO_PLACEHOLDER</a>
      <div class="links"><a href="#">About</a><a href="#">Resorts</a><a href="#">Press</a><a href="#">Contact</a><a href="#">Privacy</a></div>
    </div>
    <p>© 2026 PROJECT_NAME_PLACEHOLDER.</p>
  </div>
</footer>
`;
