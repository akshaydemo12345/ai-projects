// Master Template — Travel 01 (Original Images Version)
// Optimized for Editor Reliability — No Variables, Direct Placeholders

export const travel01Styles = `
:root {
  --primary: PRIMARY_COLOR_PLACEHOLDER;
  --secondary: SECONDARY_COLOR_PLACEHOLDER;
  --dark: #111827;
  --gray: #6b7280;
  --light: #f3f4f6;
}

* { 
  box-sizing: border-box; 
  margin: 0; 
  padding: 0; 
}

body { 
  font-family: 'Inter', sans-serif; 
  color: var(--dark); 
  line-height: 1.6; 
  overflow-x: hidden; 
  background-color: #ffffff !important; 
  font-size: clamp(0.9rem, 1vw + 0.5rem, 1rem); /* Fluid base font size */
}

.container { 
  max-width: 1200px; 
  margin: 0 auto; 
  padding: 0 1.5rem; 
  width: 100%;
}

img { 
  max-width: 100%; 
  height: auto;
  display: block; 
}

a { 
  text-decoration: none; 
  color: inherit; 
}

/* Buttons */
.btn { 
  display: inline-block; 
  padding: 0.8rem 2rem; 
  border-radius: 50px; 
  font-weight: 600; 
  cursor: pointer; 
  transition: all 0.3s ease; 
  border: none; 
  text-align: center;
  white-space: nowrap;
}
.btn-primary { background: var(--primary); color: #fff; }
.btn-primary:hover { opacity: 0.9; transform: translateY(-2px); }

/* Header */
header { 
  position: absolute; 
  top: 0; 
  left: 0; 
  right: 0; 
  z-index: 100; 
  padding: 1.5rem 0; 
}
.header-inner { 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  flex-wrap: wrap;
  gap: 1rem;
}
.logo { 
  display: flex; 
  align-items: center; 
  gap: 0.5rem; 
  font-size: clamp(1.2rem, 2vw + 0.5rem, 1.5rem); 
  font-weight: 800; 
  color: #fff; 
}
.logo-icon { 
  width: 40px; 
  height: 40px; 
  background: var(--primary); 
  color: #fff; 
  border-radius: 10px; 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  font-size: 1.2rem; 
  flex-shrink: 0;
}
.nav-links { 
  display: flex; 
  gap: 2rem; 
  flex-wrap: wrap;
  align-items: center;
}
.nav-links a { 
  color: #fff; 
  font-weight: 500; 
  transition: color 0.3s;
}
.nav-links a:hover { color: var(--primary); }

/* Hero */
.hero { 
  position: relative; 
  min-height: 100vh; 
  display: flex; 
  align-items: center; 
  padding: 7rem 0 5rem 0; 
  background-position: center; 
  background-size: cover; 
  background-repeat: no-repeat; 
  flex-wrap: wrap;
}
.hero::before { 
  content: ''; 
  position: absolute; 
  inset: 0; 
  background: linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 100%); 
}
.hero-content { 
  position: relative; 
  z-index: 10; 
  display: grid; 
  grid-template-columns: 1fr 1fr; 
  gap: 4rem; 
  align-items: center; 
  width: 100%; 
}
.hero-text h4 { 
  color: #fff; 
  font-size: clamp(0.8rem, 1.5vw, 1rem); 
  text-transform: uppercase; 
  letter-spacing: 2px; 
  margin-bottom: 1rem; 
}
.hero-text h1 { 
  color: #fff; 
  font-size: clamp(2.2rem, 5vw + 1rem, 5rem); 
  font-weight: 800; 
  line-height: 1.1; 
  margin-bottom: 2rem;
}
.hero-card { 
  background: #fff; 
  padding: 0.5rem; 
  border-radius: 20px; 
  box-shadow: 0 20px 40px rgba(0,0,0,0.2); 
  justify-self: end; 
  width: 100%;
  max-width: 320px; 
  transform: rotate(5deg); 
  transition: transform 0.3s ease;
}
.hero-card:hover { transform: rotate(0deg); }
.hero-card img { 
  border-radius: 15px; 
  height: clamp(300px, 40vh, 430px); 
  object-fit: cover; 
  width: 100%; 
}

/* Search Bar / Lead Form */
.search-wrapper { 
  position: absolute; 
  bottom: -40px; 
  left: 0; 
  right: 0; 
  z-index: 20; 
  padding: 0 1.5rem;
}
.search-bar, .search-bar form { 
  background: #fff; 
  border-radius: 20px; 
  display: flex; 
  align-items: center; 
  max-width: 900px; 
  margin: 0 auto; 
  width: 100%; 
  flex-wrap: wrap;
}
.search-bar form { 
  box-shadow: 0 20px 40px rgba(0,0,0,0.1); 
  padding: 0.5rem; 
}
.search-item { 
  flex: 1; 
  min-width: 200px;
  display: flex; 
  align-items: center; 
  gap: 1rem; 
  padding: 1rem 1.5rem; 
  border-right: 1px solid #eee; 
}
.search-item i { color: var(--primary); font-size: 1.2rem; }
.search-item input { 
  border: none !important; 
  outline: none !important; 
  font-size: 1rem; 
  width: 100%; 
  padding: 0.5rem 0px !important; 
  background: transparent !important; 
  color: var(--dark); 
  box-shadow: none !important; 
}
.search-item input:focus { border: none !important; box-shadow: none !important; outline: none !important; }
.search-btn { padding: 1rem 2.5rem; flex-shrink: 0; white-space: nowrap; }

/* Tour Places */
.tours { padding: clamp(6rem, 10vw, 8rem) 0 5rem; background: #fff; }
.section-header { 
  display: flex; 
  justify-content: space-between; 
  align-items: flex-end; 
  margin-bottom: 3rem; 
  flex-wrap: wrap; 
  gap: 1.5rem; 
}
.section-title { font-size: clamp(1.8rem, 4vw, 2.5rem); font-weight: 800; }
.section-subtitle { 
  color: var(--primary); 
  font-weight: 600; 
  text-transform: uppercase; 
  letter-spacing: 1px; 
  font-size: clamp(0.8rem, 1.5vw, 0.9rem); 
  margin-bottom: 0.5rem; 
  display: block; 
}

.tour-list { display: flex; flex-direction: column; gap: 1.5rem; }
.tour-item { 
  border: 1px solid #e3e3e3; 
  display: flex; 
  align-items: center; 
  gap: 2rem; 
  padding: 1rem; 
  border-radius: 20px; 
  transition: 0.3s; 
  flex-wrap: wrap;
}
.tour-item:hover { box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
.tour-img { width: 250px; height: 170px; border-radius: 15px; object-fit: cover; flex-shrink: 0; }
.tour-content { flex: 1; min-width: 250px; }
.tour-rating { color: #f59e0b; font-size: 0.9rem; margin-bottom: 0.5rem; }
.tour-content h3 { font-size: clamp(1.2rem, 2vw, 1.5rem); font-weight: 700; margin-bottom: 0.5rem; }
.tour-content p { color: var(--gray); font-size: 0.95rem; }
.tour-meta { display: flex; flex-direction: column; gap: 0.8rem; min-width: 180px; flex-wrap: wrap; }
.meta-item { display: flex; align-items: center; gap: 0.8rem; color: var(--gray); font-size: 0.9rem; }
.meta-item i { color: var(--primary); }

/* Experience */
.experience { padding: 5rem 0; }
.exp-grid { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(2rem, 5vw, 4rem); align-items: center; }
.features { margin: 2rem 0; display: flex; flex-direction: column; gap: 1.5rem; flex-wrap: wrap; }
.feature { display: flex; align-items: center; gap: 1.5rem; flex-wrap: wrap; }
.feat-icon { 
  width: 60px; 
  height: 60px; 
  border-radius: 50%; 
  background: #e0f2fe; 
  color: #0ea5e9; 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  font-size: 1.5rem; 
  flex-shrink: 0;
}
.feat-text { flex: 1; min-width: 200px; }
.feat-text h4 { font-size: 1.2rem; font-weight: 700; }
.feat-text p { color: var(--gray); font-size: 0.9rem; }
.exp-actions { display: flex; align-items: center; gap: 2rem; flex-wrap: wrap; }
.contact-phone { display: flex; align-items: center; gap: 1rem; font-weight: 700; white-space: nowrap; }
.contact-phone i { 
  width: 40px; 
  height: 40px; 
  border-radius: 50%; 
  background: #dcfce7; 
  color: #22c55e; 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  flex-shrink: 0;
}

.exp-images { position: relative; height: 500px; width: 100%; }
.exp-img-1 { width: 70%; height: 400px; object-fit: cover; border-radius: 20px; position: absolute; right: 0; top: 0; }
.exp-img-2 { width: 60%; height: 300px; object-fit: cover; border-radius: 20px; position: absolute; left: 0; bottom: 0; border: 10px solid #fff; }
.badge { 
  position: absolute; 
  left: 40%; 
  top: 30%; 
  background: var(--primary); 
  color: #fff; 
  padding: 1rem; 
  border-radius: 50%; 
  width: clamp(100px, 12vw, 120px); 
  height: clamp(100px, 12vw, 120px); 
  display: flex; 
  flex-direction: column; 
  align-items: center; 
  justify-content: center; 
  text-align: center; 
  font-weight: 700; 
  line-height: 1.2; 
  z-index: 2; 
  border: 6px solid #fff; 
  font-size: 0.8rem;
}
.badge span { font-size: clamp(1.5rem, 3vw, 2rem); }

/* Banner */
.banner { padding: 4rem 0; }
.banner-inner { 
  background-color: #1f2937; 
  background-position: center; 
  background-size: cover; 
  background-repeat: no-repeat; 
  border-radius: 30px; 
  padding: clamp(2rem, 5vw, 4rem); 
  position: relative; 
  overflow: hidden; 
  display: flex; 
  align-items: center; 
  min-height: 300px; 
  flex-wrap: wrap;
}
.banner-inner::before { content: ''; position: absolute; inset: 0; background: rgba(0,0,0,0.6); }
.banner-content { position: relative; z-index: 10; max-width: 500px; width: 100%; }
.banner-content h2 { color: #fff; font-size: clamp(1.8rem, 4vw, 2.5rem); font-weight: 800; line-height: 1.2; margin-bottom: 2rem; }
.banner-man { position: absolute; right: 5%; bottom: 0; height: 110%; z-index: 10; object-fit: contain; }

/* Grid Beautiful Places */
.places { padding: 5rem 0; text-align: center; }
.places-grid { 
  display: grid; 
  grid-template-columns: repeat(3, 1fr); 
  gap: 0; 
  margin-top: 3rem; 
  border-radius: 30px; 
  overflow: hidden; 
  height: 500px; 
}
.place-col { position: relative; height: 100%; overflow: hidden; }
.place-col img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
.place-col:hover img { transform: scale(1.05); }
.place-col::before { content: ''; position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.8), transparent); opacity: 0; transition: 0.3s; z-index: 1; }
.place-col:hover::before { opacity: 1; }
.place-info { position: absolute; bottom: -50px; left: 0; right: 0; padding: 2rem; color: #fff; text-align: center; transition: 0.3s ease; opacity: 0; z-index: 2; }
.place-col:hover .place-info { bottom: 60px; opacity: 1; }
.place-info h3 { font-size: clamp(1.2rem, 2vw, 1.5rem); margin-bottom: 0.5rem; }
.place-info .price { color: var(--primary); font-size: clamp(1.4rem, 2.5vw, 1.8rem); font-weight: 800; margin: 1rem 0; }

.place-col.active::before { opacity: 1; }
.place-col.active .place-info { bottom: 60px; opacity: 1; }

/* Testimonial */
.testimonials { background: #111; padding: clamp(5rem, 8vw, 8rem) 0; color: #fff; position: relative; text-align: center; }
.testi-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-top: 4rem; text-align: left; }
.testi-card { 
  background: rgba(255,255,255,0.05); 
  padding: clamp(1.5rem, 4vw, 3rem); 
  border-radius: 20px; 
  border: 1px solid rgba(255,255,255,0.1); 
  display: flex; 
  flex-direction: column; 
  gap: 2rem; 
  justify-content: space-between;
}
.quote-icon { color: var(--primary); font-size: clamp(2rem, 4vw, 3rem); line-height: 1; }
.testi-text { font-size: clamp(1rem, 1.5vw, 1.1rem); font-style: italic; opacity: 0.9; }
.testi-author { display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 1rem; }
.testi-author h4 { font-size: 1.2rem; }
.testi-author p { color: var(--primary); font-size: 0.9rem; }
.stars { color: #f59e0b; white-space: nowrap; }

/* Blog */
.blog { padding: 5rem 0; text-align: center; }
.blog-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; margin-top: 3rem; text-align: left; }
.blog-card { border-radius: 20px; overflow: hidden; border: 1px solid #eee; display: flex; flex-direction: column; }
.blog-img { height: 250px; width: 100%; object-fit: cover; }
.blog-content { padding: 1.5rem; flex: 1; display: flex; flex-direction: column; }
.blog-meta { display: flex; gap: 1rem; color: var(--primary); font-size: 0.85rem; font-weight: 600; margin-bottom: 1rem; flex-wrap: wrap; }
.blog-content h3 { font-size: clamp(1.1rem, 2vw, 1.3rem); margin-bottom: 1rem; line-height: 1.4; }
.blog-content p { color: var(--gray); font-size: 0.95rem; margin-bottom: 1.5rem; flex: 1; }
.read-more { color: var(--primary); font-weight: 600; display: flex; align-items: center; justify-content: space-between; }
.read-more i { 
  width: 35px; 
  height: 35px; 
  background: var(--primary); 
  color: #fff; 
  border-radius: 50%; 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  flex-shrink: 0;
}

/* Footer Prep / Accordion */
.footer-top { padding: 5rem 0; }
.ft-grid { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(2rem, 5vw, 4rem); align-items: center; }
.ft-img { border-radius: 30px; border-bottom-left-radius: 100px; height: 400px; width: 100%; object-fit: cover; }
.ft-content h2 { font-size: clamp(1.8rem, 4vw, 2.5rem); font-weight: 800; margin-bottom: 2rem; }
.ft-list { display: flex; flex-direction: column; gap: 1rem; margin-top: 1.5rem; }
.ft-item {
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
  transition: all 0.3s ease;
}
.ft-item.light-bg {
  color: var(--dark);
}
.ft-item.dark-bg {
  color: #fff;
}
.ft-header { display: flex; align-items: center; gap: 1rem; padding: 1.2rem; cursor: pointer; user-select: none; }
.ft-title { font-size: clamp(1rem, 1.5vw, 1.1rem); font-weight: 700; margin: 0; flex: 1; color: var(--dark); }
.ft-item.dark-bg .ft-title { color: #fff; }
.ft-icon-toggle { font-size: 1.2rem; color: var(--primary); transition: transform 0.3s ease; flex-shrink: 0; }
.ft-body { max-height: 0; overflow: hidden; transition: max-height 0.3s cubic-bezier(0, 1, 0, 1), padding 0.3s ease; padding: 0 1.2rem; }
.ft-item.active .ft-body { padding: 0 1.2rem 1.2rem 1.2rem; max-height: 1000px; }
.ft-body p { color: var(--gray); font-size: 0.95rem; line-height: 1.5; margin: 0; }
.ft-item.dark-bg .ft-body p { color: #e2e8f0; }

/* Footer */
footer { background: #111; color: #fff; padding: clamp(4rem, 8vw, 6rem) 0 2rem; position: relative; }
.footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 2fr; gap: clamp(1.5rem, 3vw, 3rem); margin-bottom: 4rem; }
.footer-col p { opacity: 0.7; margin: 1.5rem 0; }
.social { display: flex; gap: 1rem; flex-wrap: wrap; }
.social a { width: 40px; height: 40px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; transition: 0.3s; flex-shrink: 0; }
.social a:hover { background: var(--primary); border-color: var(--primary); }
.footer-col h4 { font-size: 1.2rem; margin-bottom: 1.5rem; }
.footer-links { display: flex; flex-direction: column; gap: 1rem; }
.footer-links a { opacity: 0.7; transition: 0.3s; }
.footer-links a:hover { color: var(--primary); opacity: 1; }
.newsletter form { display: flex; flex-direction: column; gap: 1rem; margin-top: 1.5rem; }
.newsletter input { padding: 1rem; border-radius: 10px; border: none; outline: none; background: rgba(255,255,255,0.1); color: #fff; width: 100%; }
.newsletter button { padding: 1rem; border-radius: 10px; background: var(--primary); color: #fff; border: none; font-weight: 600; cursor: pointer; transition: background 0.3s; }
.newsletter button:hover { opacity: 0.9; }
.copyright { text-align: center; padding-top: 2rem; border-top: 1px solid rgba(255,255,255,0.1); opacity: 0.6; font-size: 0.9rem; }

/* --- RESPONSIVE MEDIA QUERIES --- */

@media (max-width: 1024px) {
  .hero-content { grid-template-columns: 1fr; text-align: center; gap: 3rem; }
  .hero-card { justify-self: center; transform: rotate(0); }
  .search-wrapper { position: static; margin-top: -30px; padding: 0 1.5rem; }
  .search-bar, .search-bar form { flex-direction: column; border-radius: 20px; padding: 1rem; gap: 0.5rem; }
  .search-item { border-right: none; border-bottom: 1px solid #eee; width: 100%; justify-content: flex-start; }
  .search-btn { width: 100%; margin-top: 1rem; }
  .exp-grid, .ft-grid { grid-template-columns: 1fr; gap: 3rem; }
  .exp-images { height: 450px; margin-top: 2rem; }
  .blog-grid { grid-template-columns: repeat(2, 1fr); }
  .footer-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 768px) {
  .nav-links { display: none; } /* Mobile Menu handle karne ke liye toggle add kar sakte hain */
  .places-grid { grid-template-columns: 1fr; height: auto; border-radius: 20px; }
  .place-col { height: 350px; }
  .place-col:hover .place-info, .place-col.active .place-info { bottom: 30px; }
  .banner-inner { padding: 2.5rem 1.5rem; text-align: center; justify-content: center; }
  .banner-content { max-width: 100%; }
  .banner-man { display: none; }
  .testi-grid { grid-template-columns: 1fr; }
  .blog-grid { grid-template-columns: 1fr; }
  
  /* Tour responsive fixes */
  .tour-item { flex-direction: column; align-items: stretch; gap: 1.5rem; }
  .tour-img { width: 100%; height: 200px; }
  .tour-meta { flex-direction: row; justify-content: space-between; border-top: 1px solid #eee; padding-top: 1rem; width: 100%; }
  
  .exp-images { height: 380px; }
  .badge { left: 5%; top: 5%; transform: none; }
}

@media (max-width: 480px) {
  .footer-grid { grid-template-columns: 1fr; }
  .tour-meta { flex-direction: column; gap: 0.5rem; }
  .exp-actions { flex-direction: column; align-items: stretch; gap: 1.2rem; }
  .contact-phone { justify-content: center; }
  .btn { width: 100%; }
  .header-inner { justify-content: center; }
}
`;
export const travel01Html = `
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

<header>
  <div class="container header-inner">
    <div class="logo">
      LOGO_PLACEHOLDER
    </div>
    <a href="#contact" class="btn btn-primary">Contact Us</a>
  </div>
</header>

<main>
  <section class="hero" style="background-image: url('https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=2000');">
    <div class="container hero-content">
      <div class="hero-text">
        <h4>Let's Travel The World</h4>
        <h1>Adventure &<br>Experience The<br>Travel!</h1>
      </div>
      <div class="hero-card">
        <img src="https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?auto=format&fit=crop&q=80&w=800" alt="Island">
      </div>
    </div>
    <div class="search-wrapper">
      <div class="search-bar">
        <form class="lead-form" action="#" method="POST" onsubmit="event.preventDefault(); alert('Thank you! Your submission has been received.'); this.reset();">
          <div class="search-item">
            <i class="fa-solid fa-envelope"></i>
            <div>
              <div style="font-size: 0.8rem; color: var(--gray);">Email</div>
              <input type="email" name="email" placeholder="Enter your email" required>
            </div>
          </div>
          <div class="search-item">
            <i class="fa-solid fa-phone"></i>
            <div>
              <div style="font-size: 0.8rem; color: var(--gray);">Phone</div>
              <input type="tel" name="phone" placeholder="Enter phone number" required>
            </div>
          </div>
          <button type="submit" class="btn btn-primary search-btn">Get Started</button>
        </form>
      </div>
    </div>
  </section>

  <section class="tours" id="destinations">
    <div class="container">
      <div class="section-header">
        <div>
          <span class="section-subtitle">What's To Do</span>
          <h2 class="section-title">Most Favorite Tour Place</h2>
        </div>
        <button class="btn btn-primary">See All Place</button>
      </div>

      <div class="tour-list">
        <div class="tour-item">
          <img src="https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&q=80&w=600" alt="Turkey" class="tour-img">
          <div class="tour-content">
            <div class="tour-rating"><i class="fa-solid fa-star"></i> 4.5</div>
            <h3>Great Turkish Marina</h3>
            <p>Experience the ancient history and beautiful coastlines of Turkey.</p>
          </div>
          <div class="tour-meta">
            <div class="meta-item"><i class="fa-regular fa-clock"></i> 3 Days 4 Nights</div>
            <div class="meta-item"><i class="fa-solid fa-user-group"></i> Tour Guide Included</div>
            <div class="meta-item"><i class="fa-solid fa-location-dot"></i> Turkey, Istanbul</div>
          </div>
        </div>

        <div class="tour-item">
          <img src="https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=600" alt="Resort" class="tour-img">
          <div class="tour-content">
            <div class="tour-rating"><i class="fa-solid fa-star"></i> 4.8</div>
            <h3>Resort stay experience</h3>
            <p>Relax in the world's most luxurious overwater bungalows.</p>
          </div>
          <div class="tour-meta">
            <div class="meta-item"><i class="fa-regular fa-clock"></i> 5 Days 6 Nights</div>
            <div class="meta-item"><i class="fa-solid fa-user-group"></i> Tour Guide Included</div>
            <div class="meta-item"><i class="fa-solid fa-location-dot"></i> Maldives</div>
          </div>
        </div>

        <div class="tour-item">
          <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80" alt="US Explorer adventure" class="tour-img">
          <div class="tour-content">
            <div class="tour-rating"><i class="fa-solid fa-star"></i> 4.9</div>
            <h3>US Explorer adventure</h3>
            <p>Take an unforgettable journey through national parks.</p>
          </div>
          <div class="tour-meta">
            <div class="meta-item"><i class="fa-regular fa-clock"></i> 7 Days 8 Nights</div>
            <div class="meta-item"><i class="fa-solid fa-user-group"></i> Tour Guide Included</div>
            <div class="meta-item"><i class="fa-solid fa-location-dot"></i> Grand Canyon, USA</div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="experience">
    <div class="container exp-grid">
      <div>
        <span class="section-subtitle">About Us</span>
        <h2 class="section-title">Experience the World with our Travelon Company</h2>
        <p style="color: var(--gray); margin-top: 1rem;">We provide the best travel experiences around the world. Let us help you create memories that will last a lifetime.</p>
        
        <div class="features">
          <div class="feature">
            <div class="feat-icon"><i class="fa-solid fa-shield-halved"></i></div>
            <div class="feat-text">
              <h4>Safety first always</h4>
              <p>Your safety is our priority in every destination.</p>
            </div>
          </div>
          <div class="feature">
            <div class="feat-icon"><i class="fa-solid fa-tags"></i></div>
            <div class="feat-text">
              <h4>Low price & friendly</h4>
              <p>Get the best deals without compromising quality.</p>
            </div>
          </div>
        </div>

        <div class="exp-actions">
          <button class="btn btn-primary">Know More</button>
          <div class="contact-phone">
            <i class="fa-solid fa-phone"></i>
            <div>
              <div style="font-size: 0.8rem; color: var(--gray);">Call Us Anytime</div>
              +1 234 567 890
            </div>
          </div>
        </div>
      </div>
      <div class="exp-images">
        <img src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=800" alt="Hiker" class="exp-img-1">
        <img src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=800" alt="Map" class="exp-img-2">
        <div class="badge">
          <span>20+</span> Years<br>Experience
        </div>
      </div>
    </div>
  </section>

  <section class="banner">
    <div class="container">
      <div class="banner-inner" style="background-image: url('https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?auto=format&fit=crop&q=80&w=2000');">
        <div class="banner-content">
          <span style="color: #fff; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 1rem;">Special Offer For You</span>
          <h2>Grab Up to 50% Off<br>on Your Favorites<br>Destination</h2>
          <button class="btn btn-primary" style="background: #fff; color: var(--primary);">Subscribe</button>
        </div>
      </div>
    </div>
  </section>

  <section class="places">
    <div class="container">
      <span class="section-subtitle">Top Destination</span>
      <h2 class="section-title">Explore the Beautiful Places<br>Around the World!</h2>
      
      <div class="places-grid">
        <div class="place-col">
          <img src="https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=80&w=600" alt="City">
          <div class="place-info">
            <h3>Paris, France</h3>
            <p>City of light and romance</p>
            <div class="price">$199</div>
            <button class="btn btn-primary">Book Now</button>
          </div>
        </div>
        <div class="place-col active">
          <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600" alt="Beach">
          <div class="place-info">
            <h3>Phuket, Thailand</h3>
            <p>Tropical paradise with crystal waters</p>
            <div class="price">$259</div>
            <button class="btn btn-primary">Book Now</button>
          </div>
        </div>
        <div class="place-col">
          <img src="https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&q=80&w=600" alt="Island">
          <div class="place-info">
            <h3>Bali, Indonesia</h3>
            <p>Cultural and scenic beauty</p>
            <div class="price">$220</div>
            <button class="btn btn-primary">Book Now</button>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="testimonials">
    <div class="container">
      <span class="section-subtitle">Our Testimonials</span>
      <h2 class="section-title">Providing The Best Services<br>For Our Customers</h2>
      
      <div class="testi-grid">
        <div class="testi-card">
          <i class="fa-solid fa-quote-left quote-icon"></i>
          <p class="testi-text">"The experience was absolutely incredible. Everything from the flights to the hotel was perfectly arranged. I didn't have to worry about a single thing during my vacation."</p>
          <div class="testi-author">
            <div>
              <div class="stars">
                <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>
              </div>
              <p>Travel Blogger</p>
            </div>
            <h4>Helena John</h4>
          </div>
        </div>
        <div class="testi-card">
          <i class="fa-solid fa-quote-left quote-icon"></i>
          <p class="testi-text">"Truly the best travel agency I have ever used. They found us hidden gems that weren't in any guidebook. Highly recommended for anyone looking for authentic experiences."</p>
          <div class="testi-author">
            <div>
              <div class="stars">
                <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>
              </div>
              <p>Business Owner</p>
            </div>
            <h4>Gustavo Silva</h4>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="blog">
    <div class="container">
      <span class="section-subtitle">News & Articles</span>
      <h2 class="section-title">Latest News & Articles<br>From the Blog Posts</h2>
      
      <div class="blog-grid">
        <div class="blog-card">
          <img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=600" alt="Blog" class="blog-img">
          <div class="blog-content">
            <div class="blog-meta">
              <span><i class="fa-regular fa-calendar"></i> 24 May 2026</span>
              <span><i class="fa-regular fa-user"></i> By Admin</span>
            </div>
            <h3>The Best Places To Visit For Your Next Vacation</h3>
            <p>Discover the top destinations that are trending this year for travelers looking for adventure and relaxation.</p>
            <a href="#" class="read-more">Read More <i class="fa-solid fa-arrow-right"></i></a>
          </div>
        </div>
        <div class="blog-card">
          <img src="https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&q=80&w=600" alt="Blog" class="blog-img">
          <div class="blog-content">
            <div class="blog-meta">
              <span><i class="fa-regular fa-calendar"></i> 18 May 2026</span>
              <span><i class="fa-regular fa-user"></i> By Admin</span>
            </div>
            <h3>Top 5 Best Travel Accommodations</h3>
            <p>A comprehensive guide to finding the perfect place to stay, from luxury resorts to cozy boutique hotels.</p>
            <a href="#" class="read-more">Read More <i class="fa-solid fa-arrow-right"></i></a>
          </div>
        </div>
        <div class="blog-card">
          <img src="https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?auto=format&fit=crop&q=80&w=600" alt="Blog" class="blog-img">
          <div class="blog-content">
            <div class="blog-meta">
              <span><i class="fa-regular fa-calendar"></i> 12 May 2026</span>
              <span><i class="fa-regular fa-user"></i> By Admin</span>
            </div>
            <h3>Places To Go For Your Next Trip</h3>
            <p>Need inspiration? Here are some breathtaking locations that should be on everyone's travel bucket list.</p>
            <a href="#" class="read-more">Read More <i class="fa-solid fa-arrow-right"></i></a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="footer-top">
    <div class="container ft-grid">
      <div>
        <img src="https://images.unsplash.com/photo-1516815231560-8f41ec531527?auto=format&fit=crop&q=80&w=800" alt="Travel" class="ft-img">
      </div>
      <div class="ft-content">
        <span class="section-subtitle">Why Choose Us</span>
        <h2>Experience the World with our Travelon Co</h2>
        <div class="ft-list">
        <div class="ft-item" style="background-image: url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80'); background-size: cover;">
          <div class="ft-header">
            <h3 class="ft-title">Experience the World with our Travelon Co</h3>
            <span class="ft-icon-toggle"><i class="fa-solid fa-chevron-down"></i></span>
          </div>
          <div class="ft-body">
            <p>We ensure every moment of your trip is perfectly curated.</p>
          </div>
        </div>
        
        <div class="ft-item" style="background-image: url('https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1600&q=80'); background-size: cover;">
          <div class="ft-header">
            <h3 class="ft-title">Where Do You Want To Go?</h3>
            <span class="ft-icon-toggle"><i class="fa-solid fa-chevron-down"></i></span>
          </div>
          <div class="ft-body">
            <p>Choose from our extensive network of global tour packages tailored to your dreams.</p>
          </div>
        </div>
        
        <div class="ft-item" style="background-image: url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80'); background-size: cover;">
          <div class="ft-header">
            <h3 class="ft-title">What Are Your Expectations?</h3>
            <span class="ft-icon-toggle"><i class="fa-solid fa-chevron-down"></i></span>
          </div>
          <div class="ft-body">
            <p>We tailor our itineraries to meet and exceed all your expectations and travel needs.</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</main>

<footer id="contact">
  <div class="container footer-grid">
    <div class="footer-col">
      <div class="logo">
        LOGO_PLACEHOLDER
      </div>
      <p>Discover the world's most amazing destinations with our expert guides and curated travel packages. Your adventure begins here.</p>
      <div class="social">
        <a href="#"><i class="fa-brands fa-facebook-f"></i></a>
        <a href="#"><i class="fa-brands fa-twitter"></i></a>
        <a href="#"><i class="fa-brands fa-instagram"></i></a>
      </div>
    </div>
    
    <div class="footer-col">
      <h4>Quick Links</h4>
      <div class="footer-links">
        <a href="#">About Us</a>
        <a href="#">Destinations</a>
        <a href="#">Tour Packages</a>
        <a href="#">Contact Us</a>
      </div>
    </div>
    
    <div class="footer-col">
      <h4>Resources</h4>
      <div class="footer-links">
        <a href="#">Help Center</a>
        <a href="#">Travel Guide</a>
        <a href="#">Partner Network</a>
        <a href="#">Privacy Policy</a>
      </div>
    </div>
    
    <div class="footer-col newsletter">
      <h4>Newsletter</h4>
      <p>Subscribe to our newsletter to get the latest updates and offers.</p>
      <form>
        <input type="email" placeholder="Enter your email address">
        <button type="button">Subscribe Now</button>
      </form>
    </div>
  </div>
  
  <div class="copyright">
    <p>© 2026 PROJECT_NAME_PLACEHOLDER. All rights reserved.</p>
  </div>
	<script>
	(function() {
	  function initAccordion() {
	    const items = document.querySelectorAll('.ft-item');
	    items.forEach(item => {
	      const header = item.querySelector('.ft-header');
	      const title = item.querySelector('.ft-title');
	      const icon = item.querySelector('.ft-icon-toggle');
	      if (!header) return;
	      
	      // Prevent duplicate listener bindings in GrapesJS editor
	      if (header.dataset.accordionBound === 'true') return;
	      header.dataset.accordionBound = 'true';
	      
	      header.addEventListener('click', () => {
	        // Close other items
	        items.forEach(i => {
	          if (i !== item) {
	            i.classList.remove('active');
	            const ic = i.querySelector('.ft-icon-toggle');
	            if (ic) ic.style.transform = 'rotate(0deg)';
	          }
	        });
	        // Toggle this item
	        item.classList.toggle('active');
	        if (icon) {
	          icon.style.transform = item.classList.contains('active') ? 'rotate(180deg)' : 'rotate(0deg)';
	        }
	      });
	
	      // Determine background based on title color brightness
	      const setBackground = () => {
	        if (!title) return;
	        const style = getComputedStyle(title);
	        const color = style.color;
	        const rgb = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
	        if (rgb) {
	          const r = +rgb[1], g = +rgb[2], b = +rgb[3];
	          const luminance = (0.299 * r + 0.587 * g + 0.114 * b);
	          if (luminance > 186) {
	            item.classList.remove('dark-bg');
	            item.classList.add('light-bg');
	          } else {
	            item.classList.remove('light-bg');
	            item.classList.add('dark-bg');
	          }
	        }
	      };
	      setBackground();
	    });
	  }
	
	  if (document.readyState === 'loading') {
	    document.addEventListener('DOMContentLoaded', initAccordion);
	  } else {
	    initAccordion();
	  }
	  
	  // Also bind to load to ensure it runs inside the iframe
	  window.addEventListener('load', initAccordion);
	})();
	</script>
</footer>
`;

export function enrichTravel01(html: string, project: any): string {
  if (!project) return html;

  const category = (project.category || "").toLowerCase();

  // Fetch dictionary dynamically based on project data
  const dictionary = getDictionaryForCategory(category);

  // Replace hardcoded text with dynamic values
  Object.keys(dictionary).forEach((key) => {
    const value = dictionary[key];
    html = html.replace(new RegExp(key, "g"), value);
  });

  // Remove unwanted page name or placeholders dynamically
  if (project.pageName) {
    html = html.replace(new RegExp(project.pageName, "g"), ""); // Remove page name
  }

  return html;
}

// Function to get dictionary dynamically
function getDictionaryForCategory(category: string): Record<string, string> {
  if (category.includes("health") || category.includes("wellness") || category.includes("dent")) {
    return {
      "Let's Travel The World": "Professional Medical Care",
      "Adventure &<br>Experience The<br>Travel!": "Your Health &<br>Wellness is Our<br>Priority",
      "Destination": "Select Service",
      "Date From": "Appointment Date",
      "Guests": "Department",
      "Hero Section Title": "Dynamic Hero Title", // Example for hero section
      "Hero Section Subtitle": "Dynamic Hero Subtitle", // Example for hero section
    };
  }

  // Default dictionary
  return {
    "Let's Travel The World": "Explore the World",
    "Adventure &<br>Experience The<br>Travel!": "Adventure Awaits",
    "Destination": "Choose Destination",
    "Date From": "Start Date",
    "Guests": "Number of Guests",
    "Hero Section Title": "Default Hero Title",
    "Hero Section Subtitle": "Default Hero Subtitle",
  };
}
