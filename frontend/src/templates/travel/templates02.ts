// Auto-generated ULTRA-DYNAMIC template — travel templates02
// Generated: 2026-05-05T10:32:36.463Z

export const travel02Styles = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#1a0f08; --cream:#f4ead5; --primary:PRIMARY_COLOR_PLACEHOLDER; --secondary:SECONDARY_COLOR_PLACEHOLDER;
  --ink:#1a0f08; --muted:#a89580;
  --serif:'Playfair Display',serif; --sans:'Outfit',sans-serif;
}
html{scroll-behavior:smooth}
body{font-family:var(--sans);background:var(--cream);color:var(--ink);line-height:1.6;-webkit-font-smoothing:antialiased}
img{max-width:100%;display:block}
a{color:inherit;text-decoration:none}
.container{max-width:1300px;margin:0 auto;padding:0 2rem}

.nav{position:fixed;top:0;left:0;right:0;z-index:50;background:rgba(26,15,8,.4);backdrop-filter:blur(16px)}
.nav-inner{display:flex;align-items:center;justify-content:space-between;padding:1.25rem 2rem;color:#fff}
.logo{font-family:var(--serif);font-weight:900;letter-spacing:.05em;font-size:1.3rem;color:#fff}
.logo small{color:var(--secondary);margin-left:.25rem;font-size:.85rem}
.nav nav{display:flex;gap:2.5rem}
.nav nav a{font-size:.9rem;font-weight:500;color:#fff;opacity:.85;transition:opacity .2s}
.nav nav a:hover{opacity:1;color:var(--secondary)}
.btn{display:inline-block;padding:.85rem 1.75rem;background:#fff;color:var(--ink);border-radius:4px;font-weight:600;font-size:.85rem;letter-spacing:.05em;text-transform:uppercase;transition:all .3s;border:0;cursor:pointer;font-family:inherit}
.btn-primary{background:var(--btn-bg, var(--primary)); color:var(--btn-text, #fff); border:none;}
.btn-primary:hover{background:var(--secondary) !important; transform:translateY(-2px); box-shadow:0 10px 30px rgba(0,0,0,0.2)}
.btn.large{padding:1.15rem 2.5rem;font-size:.95rem}
.w-full{width:100%}

.hero{position:relative;min-height:100vh;display:flex;align-items:center;padding:9rem 0 4rem;overflow:hidden}
.hero-bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:0}
.hero-grad{position:absolute;inset:0;background:linear-gradient(180deg,rgba(26,15,8,.7) 0%,rgba(26,15,8,.3) 40%,rgba(26,15,8,.85) 100%);z-index:1}
.hero-grid{position:relative;z-index:2;display:grid;grid-template-columns:1fr 1.5fr;gap:4rem;align-items:center;color:#fff}
.hero-text{padding-left:2rem}
.kicker{font-size:.75rem;letter-spacing:.3em;color:var(--secondary);font-weight:600;display:block;margin-bottom:1.5rem}
.hero h1{font-family:var(--serif);font-size:clamp(3rem,7vw,6.5rem);font-weight:900;line-height:.95;letter-spacing:-.02em;margin-bottom:1.75rem}
.hero-text p{font-size:1.1rem;max-width:520px;color:rgba(255,255,255,.85);margin-bottom:2.5rem;font-weight:300}
.cta-row{display:flex;align-items:center;gap:1.5rem;flex-wrap:wrap}
.play{display:inline-flex;align-items:center;gap:.75rem;color:#fff;font-weight:500;font-size:.9rem}
.play-ico{width:42px;height:42px;border-radius:50%;background:rgba(255,255,255,.15);border:1px solid rgba(255,255,255,.3);display:inline-flex;align-items:center;justify-content:center;font-size:.7rem;backdrop-filter:blur(10px)}

.hero-card{background:rgba(244,234,213,.97);color:var(--ink);padding:2rem;border-radius:8px;box-shadow:0 30px 80px rgba(0,0,0,.4);border-top:4px solid var(--primary)}
.hero-card h4{font-family:var(--serif);font-size:1.5rem;margin-bottom:1.5rem;font-weight:700}
.hero-card label{display:block;font-size:.7rem;letter-spacing:.18em;text-transform:uppercase;color:var(--muted);font-weight:600;margin-bottom:1rem}
.hero-card select{display:block;width:100%;margin-top:.4rem;padding:.85rem 1rem;border:1px solid rgba(26,15,8,.15);border-radius:4px;font-family:inherit;font-size:.95rem;background:#fff;color:var(--ink);outline:0;cursor:pointer}
.hero-card .btn{margin-top:.5rem}

.features{background:var(--bg);color:var(--cream);padding:4rem 0}
.feat-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:2.5rem}
.feat span{font-family:var(--serif);font-size:2rem;color:var(--secondary);font-weight:700;display:block;margin-bottom:.75rem}
.feat h4{font-family:var(--serif);font-size:1.4rem;margin-bottom:.5rem;font-weight:700}
.feat p{color:rgba(244,234,213,.65);font-size:.95rem}

.experiences{padding:7rem 0;background:var(--cream)}
.sec-head{text-align:center;margin-bottom:4rem}
.sec-head .kicker{color:var(--primary)}
.sec-head h2{font-family:var(--serif);font-size:clamp(2.2rem,5vw,4rem);font-weight:700;letter-spacing:-.02em;line-height:1.05}
.exp-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:2rem}
.exp{background:#fff;border-radius:8px;overflow:hidden;transition:all .4s cubic-bezier(.2,.8,.2,1);position:relative}
.exp:hover{transform:translateY(-6px);box-shadow:0 25px 60px rgba(26,15,8,.18)}
.exp img{aspect-ratio:4/3;object-fit:cover;transition:transform .8s}
.exp:hover img{transform:scale(1.06)}
.exp-info{padding:1.75rem}
.badge{display:inline-block;background:var(--ink);color:var(--secondary);font-size:.65rem;letter-spacing:.2em;font-weight:700;padding:.4rem .75rem;border-radius:3px;margin-bottom:.85rem}
.exp h3{font-family:var(--serif);font-size:1.6rem;font-weight:700;margin-bottom:.25rem}
.meta{font-size:.85rem;color:var(--primary);font-weight:600;margin-bottom:.75rem;letter-spacing:.05em}
.exp-info p{opacity:0.8;font-size:.92rem;margin-bottom:1rem}
.price{font-size:.85rem;color:var(--muted);border-top:1px dashed rgba(26,15,8,.15);padding-top:1rem}
.price strong{color:var(--ink);font-size:1.4rem;font-family:var(--serif);font-weight:700}

.testimonial{background:var(--ink);color:var(--cream);padding:7rem 0;text-align:center}
.testimonial .kicker{color:var(--secondary)}
.testimonial blockquote{font-family:var(--serif);font-size:clamp(1.4rem,3vw,2.4rem);font-style:italic;font-weight:500;line-height:1.4;max-width:900px;margin:1.5rem auto;color:#fff}
.testimonial cite{font-style:normal;font-size:.85rem;letter-spacing:.15em;color:var(--secondary);font-weight:500}

.cta-final{background:linear-gradient(135deg,var(--primary),#b45309);color:#fff;padding:6rem 0;text-align:center}
.cta-final h2{font-family:var(--serif);font-size:clamp(2.2rem,5vw,4rem);font-weight:700;margin-bottom:1rem}
.cta-final p{font-size:1.15rem;opacity:.9;margin-bottom:2rem}
.cta-final .btn{background:var(--ink);color:var(--cream)}
.cta-final .btn:hover{background:#fff;color:var(--ink)}

footer{background:var(--bg);color:var(--cream);padding:4rem 0 2rem}
.foot-grid{display:grid;grid-template-columns:2fr 1fr 1fr 1.5fr;gap:3rem;margin-bottom:3rem}
.foot-grid p{color:rgba(244,234,213,.6);font-size:.9rem;margin-top:.75rem}
.foot-grid h5{font-family:var(--serif);font-size:1rem;margin-bottom:1rem;color:var(--secondary);font-weight:700}
.foot-grid a{display:block;font-size:.9rem;color:rgba(244,234,213,.7);margin-bottom:.5rem;transition:color .2s}
.foot-grid a:hover{color:var(--secondary)}
.foot-bottom{padding-top:2rem;border-top:1px solid rgba(244,234,213,.1)}
.foot-bottom p{font-size:.8rem;color:rgba(244,234,213,.5)}

@media(max-width:900px){
  .nav nav{display:none}
  .hero-grid{grid-template-columns:1fr}
  .hero-text{order:1;padding-left:0}
  .booking-form{order:2}
  .foot-grid{grid-template-columns:1fr 1fr}
}
@media(max-width:560px){.foot-grid{grid-template-columns:1fr}}

/* Wildlife Section */
.wildlife{padding:8rem 0;background:#fff}
.wildlife-grid{display:grid;grid-template-columns:1fr 1fr;gap:5rem;align-items:center}
.wildlife-text h2{font-family:var(--serif);font-size:clamp(2.2rem,5vw,3.5rem);font-weight:700;margin-bottom:1.5rem;line-height:1.1}
.wildlife-text p{font-size:1.1rem;opacity:0.8;margin-bottom:2rem}
.wildlife-list{list-style:none;margin-bottom:2.5rem}
.wildlife-list li{margin-bottom:1rem;position:relative;padding-left:1.5rem;font-size:1rem;color:#3d3329}
.wildlife-list li::before{content:"→";position:absolute;left:0;color:var(--primary);font-weight:700}
.wildlife-list strong{color:var(--ink)}

.wildlife-images{position:relative;padding:2rem}
.wildlife-img-main img{width:90%;border-radius:12px;box-shadow:0 30px 60px rgba(0,0,0,.15)}
.wildlife-img-sub img{border-radius:12px;border:8px solid #fff;box-shadow:0 20px 40px rgba(0,0,0,.2)}

/* Lodges Section */
.lodges{padding:8rem 0;background:var(--cream)}
.lodges-grid{display:grid;grid-template-columns:1fr 1fr;gap:2.5rem}
.lodge-card{background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 15px 40px rgba(26,15,8,.08);transition:transform .3s}
.lodge-card:hover{transform:translateY(-8px)}
.lodge-card img{width:100%;aspect-ratio:16/10;object-fit:cover}
.lodge-content{padding:2.5rem}
.lodge-content h3{font-family:var(--serif);font-size:1.8rem;margin-bottom:1rem;font-weight:700}
.lodge-content p{opacity:0.8;line-height:1.7}

@media(max-width:900px){
  .wildlife-grid{grid-template-columns:1fr;gap:3rem}
  .wildlife-images{max-width:600px;margin:0 auto}
  .lodges-grid{grid-template-columns:1fr}
}

/* Gallery Section */
.gallery{padding:8rem 0;background:var(--cream)}
.gallery-grid{display:grid;grid-template-columns:1.5fr 1fr;gap:1.5rem;grid-template-rows:repeat(2,300px)}
.gallery-item{position:relative;overflow:hidden;border-radius:12px;cursor:pointer}
.gallery-item.large{grid-row:span 2}
.gallery-item img{width:100%;height:100%;object-fit:cover;transition:transform .6s cubic-bezier(.2,.8,.2,1)}
.gallery-overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(26,15,8,.8),transparent);display:flex;align-items:flex-end;padding:2rem;opacity:0;transition:opacity .3s}
.gallery-overlay span{color:var(--secondary);font-size:.75rem;letter-spacing:.2em;font-weight:700;transform:translateY(10px);transition:transform .4s}
.gallery-item:hover img{transform:scale(1.05)}
.gallery-item:hover .gallery-overlay{opacity:1}
.gallery-item:hover .gallery-overlay span{transform:translateY(0)}

/* Impact Section */
.impact{padding:8rem 0;background:var(--bg);color:var(--cream)}
.impact-inner{display:grid;grid-template-columns:1fr 1fr;gap:5rem;align-items:center}
.impact-text h2{font-family:var(--serif);font-size:clamp(2.1rem,4vw,3.2rem);margin:1rem 0 2rem;line-height:1.1;color:#fff}
.impact-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:2rem;margin-top:3rem}
.stat strong{display:block;font-size:2.5rem;font-family:var(--serif);color:var(--secondary);margin-bottom:.25rem}
.stat span{font-size:.8rem;color:rgba(244,234,213,.6);text-transform:uppercase;letter-spacing:.1em}
.impact-image img{border-radius:12px;filter:sepia(20%) contrast(1.1)}

/* Newsletter Upgrade */
.newsletter{padding:10rem 0;background:linear-gradient(rgba(26,15,8,.85),rgba(26,15,8,.85)), url("/assets/templates/travel/templates02/hero.jpg");background-size:cover;background-position:center;background-attachment:fixed;color:var(--cream);border-top:0}
.newsletter .booking-intro h2{font-size:3.5rem}
.newsletter .booking-form{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.1);backdrop-filter:blur(20px);padding:3.5rem}

@media(max-width:900px){
  .gallery-grid{grid-template-columns:1fr;grid-template-rows:auto}
  .gallery-item.large{grid-row:auto}
  .impact-inner{grid-template-columns:1fr;gap:3rem}
  .stat strong{font-size:2rem}
}

.press{padding:4rem 0;background:#fff;border-top:1px solid rgba(0,0,0,.05)}
.press-logos{display:flex;align-items:center;justify-content:space-between;gap:3rem}
.press-logos span{font-size:.7rem;letter-spacing:.25em;color:var(--muted);font-weight:700;white-space:nowrap}
.logo-row{display:flex;gap:4rem;align-items:center;opacity:.4;filter:grayscale(1)}
.p-logo{font-family:var(--serif);font-size:1.4rem;font-weight:700;letter-spacing:-.02em}

@media(max-width:900px){
  .press-logos{flex-direction:column;gap:2rem}
  .logo-row{gap:2rem;flex-wrap:wrap;justify-content:center}
}

/* UNIVERSAL RESPONSIVE CSS - Added by converter */
.material-symbols-outlined, .material-icons {
  font-display: swap;
  white-space: nowrap;
  word-wrap: normal;
  direction: ltr;
  -webkit-font-feature-settings: 'liga';
  -webkit-font-smoothing: antialiased;
}

@media (max-width: 900px) {
  .container { max-width: 100%; padding: 0 1.5rem; }
  [class*="grid"], .grid { grid-template-columns: 1fr !important; gap: 1rem !important; }
  [class*="flex"]:not(nav), .flex:not(nav) { flex-wrap: wrap; }
  form { width: 100%; }
}

@media (max-width: 600px) {
  [class*="grid"], .grid { grid-template-columns: 1fr !important; }
  h1 { font-size: 2.5rem !important; line-height: 1.1 !important; }
  h2 { font-size: 2rem !important; }
  .nav nav, .links { display: none !important; }
}
`;

export const travel02Html = `
<link
    href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;700;900&family=Outfit:wght@300;400;500;600&display=swap"
    rel="stylesheet">
<header class="nav">
    <div class="container nav-inner">
      <a href="#" class="logo">LOGO_PLACEHOLDER</a>
      <nav>
        <a href="#tours">Tours</a>
        <a href="#wildlife">Wildlife</a>
        <a href="#lodges">Lodges</a>
        <a href="#about">About</a>
      </nav>
      <a href="#" class="btn btn-primary">Book Safari</a>
    </div>
  </header>

  <section class="hero">
    <img src="/assets/templates/travel/templates02/hero.jpg" alt="Safari sunset" class="hero-bg">
    <div class="hero-grad"></div>
    <div class="container hero-grid">
      <form class="hero-card"
        onsubmit="event.preventDefault();alert('Thank you! We will contact you within 24 hours.');this.reset();">
        <h4>Begin Your Safari</h4>
        <div class="row">
          <label>Full Name<input type="text" name="name" required placeholder="Jane Doe" style="width:100%;background:#fff;border:1px solid #ddd;padding:10px;margin-top:5px;border-radius:4px"></label>
          <label style="margin-top:15px;display:block">Email<input type="email" name="email" required placeholder="you@email.com" style="width:100%;background:#fff;border:1px solid #ddd;padding:10px;margin-top:5px;border-radius:4px"></label>
        </div>
        <div style="margin-top:15px">
          <label>Destination
            <select name="destination" required style="width:100%;background:#fff;border:1px solid #ddd;padding:10px;margin-top:5px;border-radius:4px">
              <option value="">Select a country</option>
              <option>Tanzania</option>
              <option>Kenya</option>
              <option>Botswana</option>
              <option>Rwanda</option>
            </select>
          </label>
        </div>

        <button type="submit" class="btn btn-primary large w-full" style="margin-top:20px">Send Inquiry →</button>
      </form>
      <div class="hero-text">
        <span class="kicker">EST. 1998 · TANZANIA · KENYA · BOTSWANA</span>
        <h1>The wild is calling.</h1>
        <p>Step into the heart of Africa with handcrafted safari journeys that blend raw wilderness, luxury camps, and
          unforgettable encounters with the Big Five.</p>
        <div class="cta-row">
          <a href="#" class="btn btn-primary">View Expeditions</a>
          <a href="#" class="play"><span class="play-ico">▶</span> Watch Trailer</a>
        </div>
      </div>
    </div>
  </section>

  <section class="features" id="about">
    <div class="container feat-grid">
      <div class="feat"><span>01</span>
        <h4>Expert Guides</h4>
        <p>Local rangers with 20+ years of bush experience.</p>
      </div>
      <div class="feat"><span>02</span>
        <h4>Luxury Camps</h4>
        <p>Sleep under the stars in handpicked tented suites.</p>
      </div>
      <div class="feat"><span>03</span>
        <h4>Conservation First</h4>
        <p>Every booking supports anti-poaching efforts.</p>
      </div>
      <div class="feat"><span>04</span>
        <h4>Small Groups</h4>
        <p>Maximum 6 guests per vehicle. Always.</p>
      </div>
    </div>
  </section>

  <section class="experiences" id="tours">
    <div class="container">
      <div class="sec-head">
        <span class="kicker">— OUR EXPEDITIONS</span>
        <h2>Journeys crafted in the wild.</h2>
      </div>
      <div class="exp-grid">
        <article class="exp">
          <img src="/assets/templates/travel/templates02/d1.jpg" alt="Lion">
          <div class="exp-info">
            <span class="badge">BIG FIVE</span>
            <h3>The King's Trail</h3>
            <p class="meta">7 Days · Serengeti</p>
            <p>Track lion prides at sunrise across the great Serengeti plains.</p>
            <div class="price">From <strong>$3,890</strong> / person</div>
          </div>
        </article>
        <article class="exp">
          <img src="/assets/templates/travel/templates02/d2.jpg" alt="Giraffes sunset">
          <div class="exp-info">
            <span class="badge">PHOTOGRAPHY</span>
            <h3>Golden Hour Safari</h3>
            <p class="meta">5 Days · Maasai Mara</p>
            <p>A photographer-led journey through Kenya's iconic landscapes.</p>
            <div class="price">From <strong>$2,990</strong> / person</div>
          </div>
        </article>
        <article class="exp">
          <img src="/assets/templates/travel/templates02/d3.jpg" alt="Luxury safari camp">
          <div class="exp-info">
            <span class="badge">LUXURY</span>
            <h3>Bush Suite Retreat</h3>
            <p class="meta">6 Days · Private Camp</p>
            <p>Private chef, butler, and your own watering hole at sunrise.</p>
            <div class="price">From <strong>$5,490</strong> / person</div>
          </div>
        </article>
        <article class="exp">
          <img src="/assets/templates/travel/templates02/d4.jpg" alt="Hot air balloon">
          <div class="exp-info">
            <span class="badge">SIGNATURE</span>
            <h3>Sky Above Serengeti</h3>
            <p class="meta">3 Days · Hot Air Balloon</p>
            <p>Float silently above migrating herds at first light.</p>
            <div class="price">From <strong>$1,990</strong> / person</div>
          </div>
        </article>
      </div>
    </div>
  </section>

  <section class="wildlife" id="wildlife">
    <div class="container">
      <div class="wildlife-grid">
        <div class="wildlife-text">
          <span class="kicker">— THE BIG FIVE</span>
          <h2>Encounters that stay with you.</h2>
          <p>The African bush is home to some of the most majestic creatures on Earth. Our expert guides track the
            migration paths to ensure you witness nature in its rawest form.</p>
          <ul class="wildlife-list">
            <li><strong>The Great Migration</strong> — Millions of wildebeest and zebras crossing the Mara River.</li>
            <li><strong>Big Five Tracking</strong> — Dedicated sunrise drives to find lions, leopards, and rhinos.</li>
            <li><strong>Nocturnal Safaris</strong> — Discover the bush after dark with specialized night tracking.</li>
          </ul>
          <a href="#booking" class="btn btn-primary">Learn More</a>
        </div>
        <div class="wildlife-images">
          <div class="wildlife-img-main">
            <img src="/assets/templates/travel/templates02/wildlife_elephant.png" alt="Majestic Elephant">
          </div>
          <div class="wildlife-img-sub">
            <img src="/assets/templates/travel/templates02/wildlife_leopard.png" alt="Leopard on Tree">
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="lodges" id="lodges">
    <div class="container">
      <div class="sec-head">
        <span class="kicker">— LUXURY CAMPS</span>
        <h2>Sleep where the wild things are.</h2>
      </div>
      <div class="lodges-grid">
        <div class="lodge-card">
          <img src="/assets/templates/travel/templates02/lodge_luxury_tent.png" alt="Luxury Safari Tent">
          <div class="lodge-content">
            <h3>Bush Suite Retreat</h3>
            <p>Wake up to the sounds of the savanna in our premium tented suites, featuring private decks and panoramic
              views.</p>
          </div>
        </div>
        <div class="lodge-card">
          <img src="/assets/templates/travel/templates02/lodge_campfire.png" alt="Safari Campfire">
          <div class="lodge-content">
            <h3>Starlit Sanctuary</h3>
            <p>Evenings are spent around the crackling fire, sharing stories under a blanket of a thousand stars.</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="testimonial">
    <div class="container">
      <span class="kicker">— GUEST STORIES</span>
      <blockquote>"Watching elephants walk past our tent at dawn changed something in me forever. Savanna Co. don't sell
        trips — they hand you a different way of seeing the world."</blockquote>
      <cite>— Amelia R., London · Serengeti Expedition 2025</cite>
    </div>
  </section>

  <section class="gallery" id="gallery">
    <div class="container">
      <div class="sec-head">
        <span class="kicker">— VISUAL JOURNAL</span>
        <h2>The wild through your lens.</h2>
      </div>
      <div class="gallery-grid">
        <div class="gallery-item large">
          <img src="/assets/templates/travel/templates02/gallery_delta.png" alt="Okavango Delta">
          <div class="gallery-overlay">
            <span>OKAVANGO DELTA</span>
          </div>
        </div>
        <div class="gallery-item">
          <img src="/assets/templates/travel/templates02/gallery_lion.png" alt="Lion Roar">
          <div class="gallery-overlay">
            <span>SERENGETI PRIDE</span>
          </div>
        </div>
        <div class="gallery-item">
          <img src="/assets/templates/travel/templates02/gallery_zebra.png" alt="Zebra Pattern">
          <div class="gallery-overlay">
            <span>MAASAI MARA</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="impact">
    <div class="container impact-inner">
      <div class="impact-text">
        <span class="kicker">— OUR COMMITMENT</span>
        <h2>Conservation is at the heart of everything we do.</h2>
        <p>Every journey you book with us directly contributes to the protection of endangered species and the empowerment of local communities.</p>
        <div class="impact-stats">
          <div class="stat">
            <strong>15%</strong>
            <span>Profits to Anti-Poaching</span>
          </div>
          <div class="stat">
            <strong>200+</strong>
            <span>Local Guides Employed</span>
          </div>
          <div class="stat">
            <strong>50k+</strong>
            <span>Acres Protected</span>
          </div>
        </div>
      </div>
      <div class="impact-image">
        <img src="/assets/templates/travel/templates02/d3.jpg" alt="Conservation">
      </div>
    </div>
  </section>

  <section class="newsletter">
    <div class="container">
       <div style="max-width:600px;margin:0 auto;text-align:center">
          <span class="kicker">— STAY CONNECTED</span>
          <h2 style="font-family:var(--serif);font-size:3rem;margin-bottom:1rem">The Wild Letter</h2>
          <p style="margin-bottom:2.5rem;opacity:0.8">Get exclusive safari tips, conservation news, and first access to our seasonal expeditions.</p>
          <form onsubmit="event.preventDefault();alert('Subscribed!');this.reset();" style="display:flex;gap:10px">
            <input type="email" placeholder="Your Email" required style="flex:1;padding:15px;border-radius:4px;border:none;background:rgba(255,255,255,0.1);color:#fff">
            <button type="submit" class="btn btn-primary">Join the Pride</button>
          </form>
       </div>
    </div>
  </section>

  <section class="press">
    <div class="container">
      <div class="press-logos">
        <span>AS SEEN IN</span>
        <div class="logo-row">
          <div class="p-logo">Condé Nast</div>
          <div class="p-logo">National Geographic</div>
          <div class="p-logo">Vogue Travel</div>
          <div class="p-logo">The Times</div>
        </div>
      </div>
    </div>
  </section>

  <footer>
    <div class="container foot-grid">
      <div><a href="#" class="logo">LOGO_PLACEHOLDER</a>
        <p>Authentic African safaris since 1998.</p>
      </div>
      <div>
        <h5>Explore</h5><a href="#">Tanzania</a><a href="#">Kenya</a><a href="#">Botswana</a><a href="#">Rwanda</a>
      </div>
      <div>
        <h5>Company</h5><a href="#">About</a><a href="#">Conservation</a><a href="#">Press</a><a href="#">Careers</a>
      </div>
      <div>
        <h5>Contact</h5><a href="#">hello@savanna.co</a><a href="#">+254 700 000 000</a>
      </div>
    </div>
    <div class="container foot-bottom">
      <p>© 2026 PROJECT_NAME_PLACEHOLDER. All rights reserved.</p>
    </div>
  </footer>
`;
