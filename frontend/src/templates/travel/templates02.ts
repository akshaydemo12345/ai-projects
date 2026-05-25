// Master Template — Travel 02 (Safari/Wilderness Edition)
// Using user-provided assets from /assets/templates/travel/templates02/

export const travel02Styles = `
:root {
  --primary: PRIMARY_COLOR_PLACEHOLDER;
  --secondary: SECONDARY_COLOR_PLACEHOLDER;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Outfit', sans-serif; background: #f5f5f4; color: #1c1917; line-height: 1.6; overflow-x: hidden; }

.container { max-width: 1240px; margin: 0 auto; padding: 0 1.5rem; }
img { max-width: 100%; display: block; }
a { text-decoration: none; color: inherit; transition: 0.3s; }

/* Navigation */
.nav { position: absolute; top: 0; left: 0; right: 0; z-index: 100; padding: 2rem 0; }
.nav-inner { display: flex; justify-content: space-between; align-items: center; }
.logo { font-size: 1.5rem; font-weight: 800; color: #fff; letter-spacing: 1px; text-transform: uppercase; }
.nav-links a { color: #fff; margin-left: 2.5rem; font-size: 0.85rem; font-weight: 600; text-transform: uppercase; opacity: 0.8; }
.nav-links a:hover { opacity: 1; color: var(--secondary); }
.btn-primary { background-color: #fff; color: #1c1917; padding: 0.7rem 1.5rem; border-radius: 4px; font-weight: 700; font-size: 0.8rem; text-transform: uppercase; border: none; cursor: pointer; }

/* Hero Section */
.hero { position: relative; min-height: 100vh; display: flex; align-items: center; background: #1c1917; color: #fff; padding: 10rem 0; }
.hero-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0.6; }
.hero-content { position: relative; z-index: 10; display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; }

/* Floating Booking Form */
.booking-card { background: #fff; padding: 2.5rem; border-radius: 4px; color: #1c1917; box-shadow: 0 30px 60px rgba(0,0,0,0.3); }
.booking-card h3 { font-size: 1.2rem; margin-bottom: 2rem; text-transform: uppercase; letter-spacing: 1px; }
.booking-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
.input-group label { display: block; font-size: 0.7rem; font-weight: 800; text-transform: uppercase; color: #78716c; margin-bottom: 0.5rem; }
.input-group input, .input-group select { width: 100%; padding: 0.8rem; border: 1px solid #e7e5e4; border-radius: 4px; font-family: inherit; }
.btn-submit { grid-column: span 2; background-color: var(--secondary); color: #fff; border: none; padding: 1.2rem; border-radius: 4px; font-weight: 800; text-transform: uppercase; margin-top: 1rem; cursor: pointer; }

.hero-text h1 { font-size: clamp(3rem, 7vw, 5.5rem); line-height: 1; font-weight: 800; margin-bottom: 2rem; }
.hero-text p { font-size: 1.25rem; opacity: 0.9; margin-bottom: 3rem; max-width: 500px; }

/* Stats Bar */
.stats-bar { background: #1c1917; padding: 6rem 0; color: #fff; }
.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 3rem; }
.stat-item span { color: var(--secondary); font-size: 1.5rem; font-weight: 800; display: block; margin-bottom: 1rem; }
.stat-item h4 { font-size: 1.1rem; margin-bottom: 0.5rem; }
.stat-item p { color: #78716c; font-size: 0.9rem; }

/* Journeys Grid */
.journeys { padding: 10rem 0; background: #f5f5f4; }
.section-tag { color: var(--secondary); text-transform: uppercase; font-size: 0.8rem; font-weight: 800; letter-spacing: 2px; display: block; margin-bottom: 1rem; text-align: center; }
.section-title { font-size: 3.5rem; font-weight: 800; text-align: center; margin-bottom: 5rem; }

.journey-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; }
.journey-card { background: #fff; border-radius: 4px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.05); transition: 0.3s; }
.journey-card:hover { transform: translateY(-10px); }
.journey-card img { height: 240px; width: 100%; object-fit: cover; }
.journey-info { padding: 2rem; }
.journey-info .tag { background-color: var(--secondary); color: #fff; font-size: 0.6rem; font-weight: 800; padding: 0.3rem 0.6rem; text-transform: uppercase; display: inline-block; margin-bottom: 1rem; }
.journey-info h3 { font-size: 1.2rem; margin-bottom: 1rem; }
.journey-info p { color: #78716c; font-size: 0.9rem; margin-bottom: 1.5rem; }
.journey-link { font-size: 0.75rem; font-weight: 800; text-transform: uppercase; color: #1c1917; display: flex; align-items: center; gap: 0.5rem; }

/* Encounters (Overlapping) */
.encounters { padding: 10rem 0; background: #fff; }
.encounter-content { display: grid; grid-template-columns: 1fr 1.2fr; gap: 6rem; align-items: center; }
.encounter-text h2 { font-size: 3rem; font-weight: 800; margin-bottom: 2rem; }
.encounter-text p { font-size: 1.15rem; color: #444; margin-bottom: 3rem; }
.encounter-visual { position: relative; height: 500px; }
.img-big { width: 80%; height: 400px; object-fit: cover; border-radius: 4px; box-shadow: 0 30px 60px rgba(0,0,0,0.1); }
.img-small { position: absolute; bottom: 0; right: 0; width: 60%; height: 300px; object-fit: cover; border-radius: 4px; border: 15px solid #fff; box-shadow: 0 30px 60px rgba(0,0,0,0.2); }

/* Sleep Section */
.sleep { padding: 10rem 0; background: #f5f5f4; }
.sleep-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
.sleep-card { background: #fff; border-radius: 4px; overflow: hidden; }
.sleep-card img { height: 400px; width: 100%; object-fit: cover; }
.sleep-content { padding: 3rem; }
.sleep-content h3 { font-size: 2rem; margin-bottom: 1.5rem; }
.sleep-content p { color: #78716c; }

/* Quote */
.quote-sec { padding: 10rem 0; background: #1c1917; color: #fff; text-align: center; }
.quote-sec blockquote { font-size: 2.5rem; font-weight: 600; font-style: italic; max-width: 900px; margin: 0 auto; line-height: 1.4; opacity: 0.9; }

/* Lens Gallery */
.lens { padding: 10rem 0; background: #fff; }
.lens-grid { display: grid; grid-template-columns: 1.5fr 1fr; grid-template-rows: repeat(2, 300px); gap: 1.5rem; margin-top: 5rem; }
.lens-item img { width: 100%; height: 100%; object-fit: cover; border-radius: 4px; }
.lens-item.tall { grid-row: span 2; }

/* Conservation */
.conservation { padding: 10rem 0; background: #1c1917; color: #fff; }
.con-grid { display: grid; grid-template-columns: 1fr 1.2fr; gap: 6rem; align-items: center; }
.con-stats { display: flex; gap: 4rem; margin-top: 4rem; }
.con-stat h5 { font-size: 2.5rem; color: var(--secondary); margin-bottom: 0.5rem; }
.con-stat p { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px; color: #78716c; }

/* Final CTA Bar */
.final-cta { padding: 6rem 0; background-color: var(--secondary); text-align: center; color: #fff; }
.final-cta h2 { font-size: 2rem; margin-bottom: 2rem; font-weight: 700; }
.btn-final { background: #1c1917; color: #fff; padding: 1rem 3rem; border-radius: 4px; font-weight: 800; text-transform: uppercase; display: inline-block; }

/* Footer */
footer { padding: 8rem 0 4rem; background: #1c1917; color: #fff; border-top: 1px solid rgba(255,255,255,0.05); }
.foot-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 6rem; }
.foot-links a { display: block; color: #78716c; margin-bottom: 1rem; font-size: 0.9rem; }
.foot-links a:hover { color: #fff; }

@media (max-width: 1024px) {
  .hero-content { grid-template-columns: 1fr !important; text-align: center; gap: 4rem; }
  .hero-text { text-align: center; }
  .hero-text p { margin: 0 auto 3rem; }
  .hero-btns { justify-content: center; }
  .booking-card { margin: 0 auto; max-width: 500px; }
  .stats-grid, .journey-grid, .sleep-grid, .lens-grid, .con-grid, .foot-grid { grid-template-columns: 1fr 1fr !important; }
  .encounter-content { grid-template-columns: 1fr !important; }
  .img-small { position: static; width: 100%; height: 300px; margin-top: 1rem; }
  .img-big { width: 100%; }
}
@media (max-width: 640px) {
  .hero h1 { font-size: 3rem; }
  .stats-grid, .journey-grid, .sleep-grid, .lens-grid, .con-grid, .foot-grid { grid-template-columns: 1fr !important; }
  .hero-btns { flex-direction: column; }
  .booking-grid { grid-template-columns: 1fr; }
  .btn-submit { grid-column: span 1; }
  .con-stats { flex-direction: column; gap: 2rem; }
}
`

export const travel02Html = `
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">

<header class="nav">
  <div class="container nav-inner">
    <div class="logo">LOGO_PLACEHOLDER</div>
    <a href="#contact" class="btn-primary">Book Now</a>
  </div>
</header>

<main>
  <!-- HERO SECTION -->
  <section class="hero">
    <img src="https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&q=80&w=1600" alt="African Savanna" class="hero-img">
    <div class="container hero-content">
      <form class="booking-card">
        <h3>Plan Your Escape</h3>
        <div class="booking-grid">
          <div class="input-group">
            <label>Destination</label>
            <select name="destination"><option>Serengeti, TZ</option><option>Maasai Mara, KE</option><option>Okavango, BW</option></select>
          </div>
          <div class="input-group">
            <label>Travelers</label>
            <input type="number" name="travelers" placeholder="2 Adults">
          </div>
          <div class="input-group" style="grid-column: span 2;">
            <label>Duration</label>
            <select name="duration"><option>7-10 Days</option><option>14+ Days</option></select>
          </div>
          <div class="input-group" style="grid-column: span 2;">
            <label>Full Name</label>
            <input type="text" name="full_name" placeholder="John Doe">
          </div>
          <div class="input-group" style="grid-column: span 2;">
            <label>Email Address</label>
            <input type="email" name="email_address" placeholder="you@email.com">
          </div>
          <button type="submit" class="btn-submit">Plan My Journey →</button>
        </div>
      </form>
      
      <div class="hero-text">
        <span class="section-tag" style="text-align: left; color: #fff;">✦ AUTHENTIC EXPEDITIONS</span>
        <h1>The wild is calling.</h1>
        <p>Unforgettable luxury safaris across Africa's most iconic landscapes, led by award-winning naturalist guides.</p>
        <div style="display: flex; gap: 2rem; align-items: center;">
           <a href="#destinations" class="btn-book" style="padding: 1rem 2rem;">Start Journey</a>
           <a href="#" style="color: #fff; font-weight: 700; border-bottom: 1px solid #fff;">View Film</a>
        </div>
      </div>
    </div>
  </section>

  <!-- STATS BAR -->
  <section class="stats-bar">
    <div class="container stats-grid">
      <div class="stat-item">
        <span>01</span>
        <h4>Expert Guides</h4>
        <p>Led by certified trackers with 15+ years of experience.</p>
      </div>
      <div class="stat-item">
        <span>02</span>
        <h4>Luxury Camps</h4>
        <p>Sustainable 5-star retreats in the heart of the wild.</p>
      </div>
      <div class="stat-item">
        <span>03</span>
        <h4>Conservation First</h4>
        <p>15% of profits go directly to anti-poaching units.</p>
      </div>
      <div class="stat-item">
        <span>04</span>
        <h4>Small Groups</h4>
        <p>Maximum of 6 guests for absolute privacy.</p>
      </div>
    </div>
  </section>

  <!-- JOURNEYS SECTION -->
  <section class="journeys" id="destinations">
    <div class="container">
      <span class="section-tag">✦ GUIDED EXPEDITIONS</span>
      <h2 class="section-title">Journeys crafted in the wild.</h2>
      
      <div class="journey-grid">
        <div class="journey-card">
          <img src="https://images.unsplash.com/photo-1547970810-dc1eac37d174?auto=format&fit=crop&q=80&w=400" alt="Lion">
          <div class="journey-info">
            <span class="tag">BIG FIVE</span>
            <h3>The King's Trail</h3>
            <p>7 Days of deep immersion into the heart of the Serengeti.</p>
            <a href="#" class="journey-link">Details <i class="fa-solid fa-arrow-right"></i></a>
          </div>
        </div>
        <div class="journey-card">
          <img src="https://images.unsplash.com/photo-1637090620932-7efea467edde?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Sunset">
          <div class="journey-info">
            <span class="tag">AERIAL</span>
            <h3>Infinite Skies Safari</h3>
            <p>Hot air balloon expeditions across the Maasai Mara.</p>
            <a href="#" class="journey-link">Details <i class="fa-solid fa-arrow-right"></i></a>
          </div>
        </div>
        <div class="journey-card">
          <img src="https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&q=80&w=400" alt="Camp">
          <div class="journey-info">
            <span class="tag">LUXURY</span>
            <h3>Bush Suite Retreat</h3>
            <p>Exclusive access to private reserves and luxury tents.</p>
            <a href="#" class="journey-link">Details <i class="fa-solid fa-arrow-right"></i></a>
          </div>
        </div>
        <div class="journey-card">
          <img src="https://plus.unsplash.com/premium_photo-1664302719391-9653797f0898?q=80&w=873&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Zebra">
          <div class="journey-info">
            <span class="tag">WATER</span>
            <h3>Delta Dream</h3>
            <p>Explore the Okavango Delta by traditional mokoro.</p>
            <a href="#" class="journey-link">Details <i class="fa-solid fa-arrow-right"></i></a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ENCOUNTERS SECTION -->
  <section class="encounters" id="about">
    <div class="container encounter-content">
      <div class="encounter-text">
        <h2>Encounters that stay with you.</h2>
        <p>Every journey is more than a trip; it's a profound reconnection with the natural world and yourself.</p>
        <div style="margin-top: 2rem;">
          <div style="display: flex; gap: 1rem; margin-bottom: 1rem;">
             <i class="fa-solid fa-check" style="color: SECONDARY_COLOR_PLACEHOLDER;"></i>
             <span>Ethical Wildlife Viewing</span>
          </div>
          <div style="display: flex; gap: 1rem; margin-bottom: 1rem;">
             <i class="fa-solid fa-check" style="color: SECONDARY_COLOR_PLACEHOLDER;"></i>
             <span>Private Photography Lessons</span>
          </div>
          <div style="display: flex; gap: 1rem; margin-bottom: 3rem;">
             <i class="fa-solid fa-check" style="color: SECONDARY_COLOR_PLACEHOLDER;"></i>
             <span>Starlit Bush Dining</span>
          </div>
        </div>
        <a href="#" class="btn-book" style="display: inline-block;">Explore Philosophy</a>
      </div>
      <div class="encounter-visual">
        <img src="https://images.unsplash.com/photo-1474511320723-9a56873867b5?auto=format&fit=crop&q=80&w=800" alt="Safari" class="img-big">
        <img src="https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&q=80&w=400" alt="Safari Detail" class="img-small">
      </div>
    </div>
  </section>

  <!-- SLEEP SECTION -->
  <section class="sleep">
    <div class="container">
      <h2 class="section-title">Sleep where the wild things are.</h2>
      <div class="sleep-grid">
        <div class="sleep-card">
          <img src="https://images.unsplash.com/photo-1523805009345-7448845a9e53?auto=format&fit=crop&q=80&w=600" alt="Tent">
          <div class="sleep-content">
             <h3>Bush Suite Retreat</h3>
             <p>Our canvas-walled suites offer absolute luxury with uninterrupted views of the plains.</p>
          </div>
        </div>
        <div class="sleep-card">
          <img src="https://images.unsplash.com/photo-1533240332313-0db49b459ad6?auto=format&fit=crop&q=80&w=600" alt="Lodge">
          <div class="sleep-content">
             <h3>Starlit Sanctuary</h3>
             <p>Open-air dining and fire-pit gatherings under the infinite African sky.</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- QUOTE -->
  <section class="quote-sec">
    <div class="container">
       <blockquote>"Watching elephants walk past our tent at dawn was something that stay forever. Savanna Go don't sell trips — they hand you a different way of seeing the world."</blockquote>
       <p style="margin-top: 3rem; color: SECONDARY_COLOR_PLACEHOLDER; font-weight: 800; text-transform: uppercase; letter-spacing: 2px;">— Amelia Burton, Award-Winning Naturalist</p>
    </div>
  </section>

  <!-- LENS GALLERY -->
  <section class="lens" id="gallery">
    <div class="container">
      <h2 class="section-title">The wild through your lens.</h2>
      <div class="lens-grid">
        <div class="lens-item tall"><img src="https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&q=80&w=600" alt="Landscape"></div>
        <div class="lens-item"><img src="https://images.unsplash.com/photo-1547970810-dc1eac37d174?auto=format&fit=crop&q=80&w=400" alt="Lion"></div>
        <div class="lens-item"><img src="https://plus.unsplash.com/premium_photo-1664302719391-9653797f0898?q=80&w=873&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Zebra"></div>
      </div>
    </div>
  </section>

  <!-- CONSERVATION SECTION -->
  <section class="conservation">
    <div class="container con-grid">
      <div class="con-text">
        <span class="section-tag" style="text-align: left;">✦ RESPONSIBLE TRAVEL</span>
        <h2>Conservation is at the heart of everything we do.</h2>
        <p>We believe in leaving the wild wilder than we found it. Every booking supports local communities and protects endangered habitats.</p>
        <div class="con-stats">
          <div class="con-stat"><h5>15%</h5><p>Direct Funding</p></div>
          <div class="con-stat"><h5>200+</h5><p>Rangers Supported</p></div>
          <div class="con-stat"><h5>50k+</h5><p>Acres Protected</p></div>
        </div>
      </div>
      <div class="con-visual">
         <img src="https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&q=80&w=800" alt="Conservation" style="border-radius: 4px; box-shadow: 0 40px 80px rgba(0,0,0,0.3);">
      </div>
    </div>
  </section>

  <!-- FINAL CTA -->
  <section class="final-cta">
    <div class="container">
      <h2>Make your wild dreams a reality.</h2>
      <a href="#contact" class="btn-final">Inquire Now</a>
    </div>
  </section>
</main>

<footer>
  <div class="container foot-grid">
    <div class="foot-brand">
       <div class="logo" style="margin-bottom: 2rem;">LOGO_PLACEHOLDER</div>
       <p>Award-winning luxury safari specialists providing ethical wildlife encounters across Africa.</p>
    </div>
    <div class="foot-col">
      <h5>Navigation</h5>
      <div class="foot-links">
        <a href="#">Expeditions</a>
        <a href="#">Philosophy</a>
        <a href="#">Journal</a>
      </div>
    </div>
    <div class="foot-col">
      <h5>Contact</h5>
      <div class="foot-links">
        <a href="#">Nairobi Office</a>
        <a href="#">London Office</a>
        <a href="#">hello@savannago.com</a>
      </div>
    </div>
    <div class="foot-col">
      <h5>Follow Us</h5>
      <div style="display: flex; gap: 1.5rem; font-size: 1.2rem; color: #78716c;">
         <i class="fa-brands fa-instagram"></i>
         <i class="fa-brands fa-facebook"></i>
         <i class="fa-brands fa-x-twitter"></i>
      </div>
    </div>
  </div>
  <div class="container" style="margin-top: 5rem; padding-top: 3rem; border-top: 1px solid rgba(255,255,255,0.05); text-align: center; color: #444; font-size: 0.8rem;">
    <p>© 2026 PROJECT_NAME_PLACEHOLDER. All rights reserved.</p>
  </div>
</footer>
`
