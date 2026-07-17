export const realEstate07Styles = `
:root {
  --primary: PRIMARY_COLOR_PLACEHOLDER;
  --secondary: SECONDARY_COLOR_PLACEHOLDER;
  --primary-rgb: PRIMARY_RGB_PLACEHOLDER;
  --secondary-rgb: SECONDARY_RGB_PLACEHOLDER;
  --re07-light: #f9f9f9;
  --re07-text: #666666;
}

* { box-sizing: border-box; }

.re07-wrap {
  font-family: 'Inter', sans-serif;
  color: var(--re07-text);
  background-color: #ffffff;
  overflow-x: hidden;
  line-height: 1.6;
}

h1, h2, h3, h4, h5 {
  color: #111;
  font-weight: 700;
  margin: 0 0 20px 0;
}

p { margin: 0 0 20px 0; }

.re07-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.re07-btn {
  display: inline-block;
  padding: 12px 30px;
  background: var(--secondary);
  color: var(--primary);
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
  border: none;
  cursor: pointer;
  border-radius: 30px;
  transition: all 0.3s;
}
.re07-btn:hover {
  background: #111;
  color: var(--secondary);
}

.re07-btn-dark {
  background: var(--primary);
  color: #fff;
}
.re07-btn-dark:hover {
  background: var(--secondary);
  color: #111;
}

/* Floating Pill Header */
.re07-header-wrapper {
  position: absolute;
  top: 30px;
  left: 0;
  width: 100%;
  z-index: 100;
  display: flex;
  justify-content: center;
}
.re07-header {
  background: #ffffff;
  border-radius: 50px;
  width: 90%;
  max-width: 1200px;
  padding: 10px 20px 10px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}
.re07-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.4rem;
  font-weight: 800;
  color: #111;
  text-decoration: none;
}
.re07-logo-icon {
  width: 35px; height: 35px;
  background: var(--secondary);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  color: #111;
  font-size: 0.8rem;
}
.re07-nav {
  display: flex;
  gap: 25px;
}
.re07-nav a {
  color: #111;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 600;
  transition: color 0.3s;
}
.re07-nav a:hover {
  color: var(--secondary);
}
.re07-header-right {
  display: flex;
  align-items: center;
  gap: 15px;
}
.re07-header-icons {
  display: flex;
  gap: 10px;
}
.re07-header-icon {
  width: 35px; height: 35px;
  border-radius: 50%;
  background: #f5f5f5;
  display: flex; align-items: center; justify-content: center;
  color: #333;
}
.re07-header-btn {
  padding: 10px 25px;
  background: var(--primary);
  color: #fff;
  border-radius: 30px;
  font-size: 0.85rem;
  font-weight: 600;
  text-decoration: none;
}

/* Hero Section */
.re07-hero {
  display: flex;
  min-height: 100vh;
  position: relative;
}
.re07-hero-left {
  flex: 1;
  background: var(--primary);
  padding: 160px 5% 100px 10%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: #fff;
  position: relative;
}
.re07-hero-left::before {
  content: '';
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background-image: radial-gradient(circle at 20% 50%, rgba(255,255,255,0.05) 1px, transparent 1px);
  background-size: 20px 20px;
}
.re07-hero-left h1 {
  color: #fff;
  font-size: 4rem;
  line-height: 1.1;
  margin-bottom: 20px;
  position: relative;
  z-index: 2;
}
.re07-hero-left p {
  color: #ccc;
  font-size: 1rem;
  max-width: 450px;
  margin-bottom: 40px;
  position: relative;
  z-index: 2;
}
.re07-hero-buttons {
  display: flex; align-items: center; gap: 20px; position: relative; z-index: 2;
}
.re07-hero-play {
  display: flex; align-items: center; gap: 10px; color: #fff; text-decoration: none; font-size: 0.9rem; font-weight: 600;
}
.re07-hero-play-icon {
  width: 40px; height: 40px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.3); display: flex; align-items: center; justify-content: center;
}
.re07-hero-right {
  flex: 1;
  background-image: url('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&w=1200&q=80');
  background-size: cover;
  background-position: center;
  position: relative;
}
.re07-agent-card {
  position: absolute;
  bottom: 40px;
  right: 40px;
  background: #fff;
  padding: 10px 20px 10px 10px;
  border-radius: 40px;
  display: flex;
  align-items: center;
  gap: 15px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.15);
  z-index: 10;
}
.re07-agent-card img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}
.re07-agent-info h4 { margin: 0; font-size: 0.9rem; color: #111; }
.re07-agent-info p { margin: 0; font-size: 0.75rem; color: #888; }


.re07-hero-form {
  position: absolute;
  top: 50%;
  right: 10%;
  transform: translateY(-50%);
  background: #fff;
  padding: 30px;
  border-radius: 10px;
  width: 350px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.2);
  z-index: 10;
}
@media (max-width: 1024px) {
  .re07-hero-form {
    position: relative;
    top: auto;
    right: auto;
    transform: none;
    margin: -100px auto 40px auto;
  }
}

/* Subheading badge */
.re07-badge {
  display: inline-block;
  padding: 5px 15px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  color: #ccc;
  border-radius: 20px;
  font-size: 0.75rem;
  margin-bottom: 20px;
  position: relative;
  z-index: 2;
  text-transform: uppercase;
  letter-spacing: 1px;
}
.re07-badge-dark {
  background: rgba(var(--primary-rgb), 0.05);
  border-color: rgba(var(--primary-rgb), 0.1);
  color: var(--primary);
}

/* About Split */
.re07-about {
  padding: 120px 0;
  background: #fff;
}
.re07-about-flex {
  display: flex;
  align-items: center;
  gap: 80px;
}
.re07-about-images {
  flex: 1;
  position: relative;
  height: 450px;
}
.re07-about-img1 {
  position: absolute;
  top: 0; left: 0; width: 75%; height: 80%;
  object-fit: cover;
  border-radius: 10px;
}
.re07-about-img2 {
  position: absolute;
  bottom: 0; right: 0; width: 55%; height: 60%;
  object-fit: cover;
  border-radius: 10px;
  border: 10px solid #fff;
  box-shadow: 0 15px 30px rgba(0,0,0,0.1);
}
.re07-about-text {
  flex: 1;
}
.re07-about-text h2 {
  font-size: 2.8rem;
  line-height: 1.2;
  margin-bottom: 20px;
}
.re07-about-text p {
  color: #666;
  margin-bottom: 30px;
  line-height: 1.7;
}

/* Amenities */
.re07-amenities {
  padding: 100px 0;
  background: #fbfbfb;
  text-align: center;
}
.re07-amenities h2 {
  font-size: 2.5rem;
  margin-bottom: 60px;
}
.re07-amenities-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
}
.re07-amenity-item {
  position: relative;
}
.re07-amenity-circle {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  margin: 0 auto 20px;
  position: relative;
  border: 4px solid #fff;
  box-shadow: 0 10px 20px rgba(0,0,0,0.05);
}
.re07-amenity-circle img {
  width: 100%; height: 100%; object-fit: cover; border-radius: 50%;
}
.re07-amenity-badge {
  position: absolute;
  top: 5px; right: 10px;
  width: 35px; height: 35px;
  background: var(--secondary);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  color: #111; font-weight: bold; border: 3px solid #fff;
}
.re07-amenity-item h4 {
  font-size: 1.1rem;
  margin-bottom: 10px;
}
.re07-amenity-item p {
  font-size: 0.85rem;
  color: #888;
}

/* Gallery / Properties */
.re07-gallery {
  padding: 100px 0;
  background: #fff;
  text-align: center;
}
.re07-gallery h2 {
  font-size: 2.5rem;
  margin-bottom: 50px;
  max-width: 600px;
  margin-left: auto; margin-right: auto;
}
.re07-gallery-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: 250px;
  gap: 20px;
}
.re07-gal-item {
  border-radius: 10px; overflow: hidden; position: relative;
}
.re07-gal-item img {
  width: 100%; height: 100%; object-fit: cover;
}
.re07-gal-large {
  grid-row: span 2;
  grid-column: span 2;
}
.re07-gal-box {
  background: var(--secondary);
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: left;
  border-radius: 10px;
}
.re07-gal-box h3 { font-size: 2.5rem; margin: 0 0 5px 0; color: #111; }
.re07-gal-box p { color: #555; margin: 0; font-size: 0.9rem; font-weight: 500;}

/* Video Tour */
.re07-video-tour {
  padding: 120px 0;
  background: var(--primary);
  text-align: center;
  color: #fff;
}
.re07-video-tour h2 {
  color: #fff;
  font-size: 2.5rem;
  margin-bottom: 50px;
}
.re07-video-wrapper {
  max-width: 900px;
  margin: 0 auto;
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(0,0,0,0.3);
}
.re07-video-wrapper img {
  width: 100%;
  display: block;
}
.re07-play-btn {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 80px; height: 80px;
  background: #fff;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
}
.re07-play-btn svg { width: 30px; height: 30px; fill: var(--primary); margin-left: 5px; }

/* Testimonials */
.re07-testimonials {
  padding: 120px 0;
  background: #fbfbfb;
}
.re07-testi-flex {
  display: flex;
  gap: 60px;
}
.re07-testi-left {
  flex: 1;
}
.re07-testi-left h2 {
  font-size: 2.5rem;
  margin-bottom: 20px;
}
.re07-testi-vid {
  position: relative;
  margin-top: 40px;
  border-radius: 10px;
  overflow: hidden;
}
.re07-testi-vid img { width: 100%; display: block; }
.re07-testi-right {
  flex: 1.2;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.re07-testi-card {
  background: #fff;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
  border-left: 4px solid var(--secondary);
}
.re07-testi-author {
  display: flex; align-items: center; gap: 15px; margin-bottom: 15px;
}
.re07-testi-author img {
  width: 50px; height: 50px; border-radius: 50%; object-fit: cover;
}
.re07-testi-card p {
  font-style: italic; color: #555; margin: 0;
}

/* Schedule Tour CTA */
.re07-schedule {
  padding: 100px 0;
  background: var(--primary);
  color: #fff;
}
.re07-schedule-flex {
  display: flex;
  align-items: center;
  gap: 60px;
}
.re07-schedule-img {
  flex: 1;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
}
.re07-schedule-img img { width: 100%; display: block; }
.re07-schedule-text {
  flex: 1;
}
.re07-schedule-text h2 {
  color: #fff; font-size: 2.5rem; margin-bottom: 20px;
}
.re07-schedule-text p { color: #ccc; margin-bottom: 30px; }

/* News */
.re07-news {
  padding: 100px 0;
  background: #fff;
  text-align: center;
}
.re07-news h2 {
  font-size: 2.5rem; margin-bottom: 50px;
}
.re07-news-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  text-align: left;
}
.re07-news-card {
  border-radius: 10px; overflow: hidden;
  border: 1px solid #eee;
  background: #fff;
}
.re07-news-card img {
  width: 100%; height: 200px; object-fit: cover;
}
.re07-news-content {
  padding: 20px;
}
.re07-news-date {
  font-size: 0.8rem; color: #999; display: block; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 1px;
}
.re07-news-content h4 {
  font-size: 1.1rem; margin-bottom: 10px; color: #111;
}

/* Footer & Form */
.re07-footer-section {
  position: relative;
  background-image: url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&w=1920&q=80');
  background-size: cover;
  background-position: center;
  padding: 100px 0 100px 0;
  color: #fff;
}
.re07-footer-section::before {
  content: '';
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(var(--primary-rgb), 0.95);
}
.re07-footer-content {
  position: relative;
  z-index: 2;
}
.re07-form-grid {
  display: flex; gap: 40px; margin-bottom: 60px; align-items: stretch;
}
.re07-form-box {
  flex: 1;
  background: #fff;
  padding: 40px;
  border-radius: 10px;
  color: #333;
}
.re07-form-box h3 {
  font-size: 1.5rem; margin-bottom: 25px;
}
.re07-input {
  width: 100%;
  padding: 15px;
  margin-bottom: 15px;
  border: 1px solid #f0f0f0;
  border-radius: 5px;
  font-family: inherit;
  font-size: 0.9rem;
  background: #f9f9f9;
}
.re07-form-gallery {
  flex: 1.2;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}
.re07-form-gallery img {
  width: 100%; height: 100%; object-fit: cover; border-radius: 10px;
}
.re07-footer-panel {
  background: #fff;
  border-radius: 10px;
  padding: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #333;
}
.re07-footer-logo {
  display: flex; align-items: center; gap: 10px; font-size: 1.5rem; font-weight: bold; color: #111;
}
.re07-footer-links {
  display: flex; gap: 40px;
}
.re07-footer-links-col {
  display: flex; flex-direction: column; gap: 10px; font-size: 0.9rem; font-weight: 500;
}
.re07-footer-links-col a {
  color: #555; text-decoration: none;
}
.re07-footer-contact {
  display: flex; flex-direction: column; gap: 10px; font-size: 0.85rem; color: #555;
}
.re07-footer-social {
  display: flex; gap: 10px;
}
.re07-footer-social-icon {
  width: 35px; height: 35px; background: #e5e5e5; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #111;
}

/* Modal */
.re07-modal-toggle { display: none; }
.re07-modal-toggle:checked ~ .re07-modal { display: flex; }
.re07-modal {
  display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.8); z-index: 9999; align-items: center; justify-content: center; backdrop-filter: blur(5px);
}
.re07-modal-content {
  background: #fff; padding: 40px; border-radius: 10px; text-align: center; max-width: 400px; width: 90%; color: #333;
}
.re07-modal-close {
  display: inline-block; padding: 12px 30px; background: var(--primary); color: #fff; text-decoration: none; border-radius: 4px; font-weight: bold; cursor: pointer; margin-top:20px; font-size: 0.85rem;
}

@media (max-width: 1024px) {
  .re07-header-wrapper { top: 10px; }
  .re07-header { flex-direction: column; gap: 15px; border-radius: 10px; padding: 20px; }
  .re07-nav { display: none; }
  .re07-hero { flex-direction: column; min-height: auto; }
  .re07-hero-left { padding: 180px 20px 80px 20px; text-align: center; }
  .re07-hero-left p { margin: 0 auto 40px auto; }
  .re07-hero-buttons { justify-content: center; }
  .re07-hero-right { height: 400px; }
  .re07-agent-card { left: 50%; transform: translateX(-50%); bottom: 20px; right: auto; }
  .re07-about-flex { flex-direction: column; }
  .re07-about-images { width: 100%; height: 400px; margin-bottom: 40px; }
  .re07-amenities-grid { grid-template-columns: repeat(2, 1fr); }
  .re07-gallery-grid { grid-template-columns: 1fr; grid-auto-rows: auto; }
  .re07-gal-large, .re07-gal-wide { grid-row: auto; grid-column: auto; }
  .re07-gal-item { height: 250px; }
  .re07-testi-flex, .re07-schedule-flex, .re07-form-grid { flex-direction: column; }
  .re07-news-grid { grid-template-columns: 1fr; }
  .re07-footer-panel { flex-direction: column; gap: 30px; text-align: center; }
  .re07-footer-links { flex-direction: column; gap: 20px; }
}
`;

export const realEstate07Html = `
<div class="re07-wrap">
  
  <!-- Floating Pill Header -->
  <div class="re07-header-wrapper">
    <div class="re07-header">
      <a href="#" class="re07-logo">
        
        LOGO_PLACEHOLDER
      </a>
    
      
      <div class="re07-header-right">
        
        <a href="#contact" class="re07-header-btn">Get A Quote</a>
      </div>
    </div>
  </div>

  <!-- Hero Section -->
  <section class="re07-hero">
    <div class="re07-hero-left">
      <div>
        <span class="re07-badge">Morden Real Estate</span>
        <h1>Welcome to Your Luxurious Haven</h1>
        <p>Discover elegance and comfort in our meticulously designed properties. Your dream home awaits in the most exclusive neighborhoods.</p>
        <div class="re07-hero-buttons">
          <a href="#contact" class="re07-btn" style="color:var(--primary);">Discover More</a>
          <a href="#" class="re07-hero-play">
            <div class="re07-hero-play-icon">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="#fff"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            </div>
            Play Video
          </a>
        </div>
      </div>
    </div>
    <div class="re07-hero-right">
      
      <div class="re07-hero-form">
        <h3 style="color:#111; font-size:1.3rem; margin-bottom:15px;">Find Your Dream Home</h3>
        <form onsubmit="event.preventDefault(); document.getElementById('re07-modal-trigger').checked = true;">
          <input type="text" class="re07-form-input" placeholder="Your Name" style="width:100%; padding:12px; margin-bottom:15px; border:1px solid #ddd; border-radius:5px; background:#f9f9f9; font-family:inherit;" required>
          <input type="email" class="re07-form-input" placeholder="Email Address" style="width:100%; padding:12px; margin-bottom:15px; border:1px solid #ddd; border-radius:5px; background:#f9f9f9; font-family:inherit;" required>
          <input type="tel" class="re07-form-input" placeholder="Phone Number" style="width:100%; padding:12px; margin-bottom:15px; border:1px solid #ddd; border-radius:5px; background:#f9f9f9; font-family:inherit;" required>
          <button type="submit" class="re07-btn re07-btn-dark" style="width:100%;">Get Started</button>
        </form>
      </div>
    </div>
  </section>

  <!-- About Section -->
  <section class="re07-about">
    <div class="re07-container re07-about-flex">
      <div class="re07-about-images">
        <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&w=800&q=80" class="re07-about-img1">
        <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&w=800&q=80" class="re07-about-img2">
      </div>
      <div class="re07-about-text">
        <span class="re07-badge re07-badge-dark">About Our Agency</span>
        <h2>Elegance Every Detail Welcome Suite Villa</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.</p>
        <a href="#" class="re07-btn re07-btn-dark" style="margin-top: 10px;">Read More</a>
      </div>
    </div>
  </section>

  <!-- Amenities -->
  <section class="re07-amenities">
    <div class="re07-container">
      <span class="re07-badge re07-badge-dark">Our Offerings</span>
      <h2>Our Property Amenities</h2>
      <div class="re07-amenities-grid">
        <div class="re07-amenity-item">
          <div class="re07-amenity-circle">
            <img src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&w=300&q=80">
            <div class="re07-amenity-badge">1</div>
          </div>
          <h4>New Construction</h4>
          <p>Modern and classic designs tailored for luxury.</p>
        </div>
        <div class="re07-amenity-item">
          <div class="re07-amenity-circle">
            <img src="https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?ixlib=rb-4.0.3&w=300&q=80">
            <div class="re07-amenity-badge">2</div>
          </div>
          <h4>Smart Integrations</h4>
          <p>Fully automated homes for seamless living.</p>
        </div>
        <div class="re07-amenity-item">
          <div class="re07-amenity-circle">
            <img src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&w=300&q=80">
            <div class="re07-amenity-badge">3</div>
          </div>
          <h4>Premium Location</h4>
          <p>Situated in the most desirable neighborhoods.</p>
        </div>
        <div class="re07-amenity-item">
          <div class="re07-amenity-circle">
            <img src="https://images.unsplash.com/photo-1576941089067-2de3c901e126?ixlib=rb-4.0.3&w=300&q=80">
            <div class="re07-amenity-badge">4</div>
          </div>
          <h4>24/7 Security</h4>
          <p>Advanced security systems and personnel.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Gallery Section -->
  <section class="re07-gallery">
    <div class="re07-container">
      <span class="re07-badge re07-badge-dark">Featured Properties</span>
      <h2>Explore Our Premier Single Property Retreat</h2>
      <div class="re07-gallery-grid">
        <div class="re07-gal-item">
          <img src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&w=800&q=80">
        </div>
        <div class="re07-gal-item re07-gal-large">
          <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&w=800&q=80">
          <div style="position:absolute; bottom:20px; left:20px; right:20px; background:#fff; border-radius:10px; padding:20px; display:flex; justify-content:space-between; align-items:center;">
             <div>
               <h4 style="margin:0; font-size:1.2rem;">Luxury Suite Villa</h4>
               <p style="margin:0; font-size:0.85rem; color:#888;">3 Bed | 2 Bath | 2,500 Sqft</p>
             </div>
          </div>
        </div>
        <div class="re07-gal-item re07-gal-box">
          <h3>2k+</h3>
          <p>Years Of Experience</p>
          <div style="display:flex; margin-top:20px; align-items:center;">
             <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&w=100&q=80" style="width:40px; height:40px; border-radius:50%; border:2px solid #fff; z-index:3;">
             <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&w=100&q=80" style="width:40px; height:40px; border-radius:50%; border:2px solid #fff; margin-left:-15px; z-index:2;">
             <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&w=100&q=80" style="width:40px; height:40px; border-radius:50%; border:2px solid #fff; margin-left:-15px; z-index:1;">
             <div style="width:40px; height:40px; border-radius:50%; background:#fff; color:#111; display:flex; align-items:center; justify-content:center; margin-left:-15px; font-weight:bold; font-size:0.8rem; z-index:0;">+</div>
          </div>
          <h3 style="margin-top:10px;">6,725</h3>
          <p>Happy Clients</p>
        </div>
        <div class="re07-gal-item">
          <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&w=800&q=80">
        </div>
      </div>
    </div>
  </section>


  

  <!-- Testimonials -->
  <section class="re07-testimonials">
    <div class="re07-container re07-testi-flex">
      <div class="re07-testi-left">
        <span class="re07-badge re07-badge-dark">Client Feedback</span>
        <h2>Hear What Our Client Say About Property</h2>
        <p>Discover how our premium real estate services have transformed the lives of our clients.</p>
        <div class="re07-testi-vid">
          <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&w=800&q=80" style="height:250px; object-fit:cover;">
          <div class="re07-play-btn" style="width: 50px; height: 50px; position:absolute; top:50%; left:50%; transform:translate(-50%, -50%);">
             <svg viewBox="0 0 24 24" style="width: 20px; height: 20px; fill:var(--primary);"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          </div>
        </div>
      </div>
      <div class="re07-testi-right">
        <div class="re07-testi-card">
          <div class="re07-testi-author">
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&w=100&q=80">
            <div>
              <h4 style="margin:0; font-size:1rem;">Michael Brown</h4>
              <p style="font-size:0.8rem; margin:0;">New York</p>
            </div>
          </div>
          <p>"The team provided exceptional service from start to finish. They found the perfect villa for our family, and the entire process was seamless and professional."</p>
        </div>
        <div class="re07-testi-card">
          <div class="re07-testi-author">
            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&w=100&q=80">
            <div>
              <h4 style="margin:0; font-size:1rem;">Jessica Smith</h4>
              <p style="font-size:0.8rem; margin:0;">Los Angeles</p>
            </div>
          </div>
          <p>"Absolutely thrilled with my new apartment. The amenities are top-notch and the location is exactly what I was looking for. Highly recommend their services."</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Schedule Tour CTA -->
  <section class="re07-schedule">
    <div class="re07-container re07-schedule-flex">
      <div class="re07-schedule-img">
        <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&w=800&q=80">
      </div>
      <div class="re07-schedule-text">
        <h2>Home Waiting For You Here Schedule A Tour</h2>
        <p>Book a private tour with our agents to explore the luxury and comfort of our properties firsthand.</p>
        <div style="display:flex; align-items:center; gap:20px;">
          <a href="#contact" class="re07-btn">Schedule Tour</a>
          <div style="display:flex; align-items:center; gap:10px;">
            <div style="width:40px; height:40px; border-radius:50%; background:rgba(255,255,255,0.1); display:flex; align-items:center; justify-content:center;">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#fff" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            </div>
            <span>+1 (800) 123-4567</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- News -->
  <section class="re07-news">
    <div class="re07-container">
      <span class="re07-badge re07-badge-dark">Latest News</span>
      <h2>Our News & Articles</h2>
      <div class="re07-news-grid">
        <div class="re07-news-card">
          <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&w=600&q=80">
          <div class="re07-news-content">
            <span class="re07-news-date">August 12, 2026</span>
            <h4>Discover The Best Real Estate Opportunities</h4>
            <a href="#" style="color:var(--primary); text-decoration:none; font-weight:bold; font-size:0.85rem;">Read More &rarr;</a>
          </div>
        </div>
        <div class="re07-news-card">
          <img src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&w=600&q=80">
          <div class="re07-news-content">
            <span class="re07-news-date">August 18, 2026</span>
            <h4>Top Design Trends For Luxury Villas</h4>
            <a href="#" style="color:var(--primary); text-decoration:none; font-weight:bold; font-size:0.85rem;">Read More &rarr;</a>
          </div>
        </div>
        <div class="re07-news-card">
          <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&w=600&q=80">
          <div class="re07-news-content">
            <span class="re07-news-date">August 24, 2026</span>
            <h4>How To Choose The Perfect Neighborhood</h4>
            <a href="#" style="color:var(--primary); text-decoration:none; font-weight:bold; font-size:0.85rem;">Read More &rarr;</a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Footer & Contact (Bottom Section) -->
  <section id="contact" class="re07-footer-section">
    <div class="re07-container re07-footer-content">
      
      <!-- Contact Form & Image Grid -->
      <div class="re07-form-grid">
        <div class="re07-form-box">
          <h3>Send Us A Message</h3>
          <form onsubmit="event.preventDefault(); document.getElementById('re07-modal-trigger').checked = true;">
            <div style="display:flex; gap:15px;">
              <input type="text" class="re07-input" placeholder="Your Name*" required>
              <input type="tel" class="re07-input" placeholder="Mobile Number*" required>
            </div>
            <textarea class="re07-input" placeholder="Your Message*" rows="5" required></textarea>
            <div style="text-align:right;">
              <button type="submit" class="re07-btn re07-btn-dark">Send Message</button>
            </div>
          </form>
        </div>
        
        <div class="re07-form-gallery">
          <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&w=400&q=80">
          <img src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&w=400&q=80">
          <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&w=400&q=80">
          <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&w=400&q=80">
        </div>
      </div>
      
      <!-- Footer Bottom Panel -->
      <div class="re07-footer-panel">
        <div class="re07-footer-logo">
           LOGO_PLACEHOLDER
        </div>
        
        <div class="re07-footer-links">
          <div class="re07-footer-links-col">
            <a href="#">Home</a>
            <a href="#">Properties</a>
            <a href="#">Gallery</a>
          </div>
          <div class="re07-footer-links-col">
            <a href="#">Blog</a>
            <a href="#">Pages</a>
            <a href="#">Contact</a>
          </div>
        </div>
        
        <div class="re07-footer-contact">
          <span style="display:flex; align-items:center; gap:8px;">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            65, Brand Tower<br>New York, USA
          </span>
          <span style="display:flex; align-items:center; gap:8px;">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            123-456-7890
          </span>
        </div>
        
        
      </div>
      
      <div style="text-align:center; padding-top: 30px; font-size: 0.8rem; color: #ccc;">
        COPYRIGHT_PLACEHOLDER
      </div>
      
    </div>
  </section>

  <!-- Success Modal -->
  <input type="checkbox" id="re07-modal-trigger" class="re07-modal-toggle">
  <div class="re07-modal">
    <div class="re07-modal-content">
      <h3 style="color:#111; margin-bottom:10px;">Success!</h3>
      <p style="color:#666; font-size:0.95rem;">Your message has been sent successfully. We will get back to you shortly.</p>
      <label for="re07-modal-trigger" class="re07-modal-close">Close</label>
    </div>
  </div>

</div>
`;
