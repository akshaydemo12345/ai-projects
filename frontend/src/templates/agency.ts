export const agencyStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Montserrat:wght@300;400;600;700&display=swap');

  .hotel-container {
    margin: 0;
    font-family: 'Montserrat', sans-serif;
    background-color: #fff;
    color: #1a1a1a;
  }
  
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 8%;
    height: 100px;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    position: sticky;
    top: 0;
    z-index: 1000;
    border-bottom: 1px solid #f2f2f2;
  }
  
  .logo { 
    font-family: 'Cormorant Garamond', serif;
    font-size: 28px; 
    font-weight: 700; 
    color: #1a1a1a; 
    letter-spacing: 2px;
  }
  
  .nav-links { display: flex; gap: 40px; list-style: none; }
  .nav-links a { text-decoration: none; color: #666; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; transition: 0.3s; }
  .nav-links a:hover { color: PRIMARY_COLOR_PLACEHOLDER; }

  .hero {
    position: relative;
    height: 90vh;
    display: flex;
    align-items: center;
    padding: 0 8%;
    overflow: hidden;
  }
  
  .hero-bg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: -1;
  }
  
  .hero-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to right, rgba(255,255,255,0.9) 30%, rgba(255,255,255,0.2) 100%);
    z-index: 0;
  }

  .hero-content {
    position: relative;
    z-index: 10;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
    gap: 60px;
  }

  .hero-text { flex: 1.2; }
  .hero-text h4 { font-size: 14px; text-transform: uppercase; letter-spacing: 4px; color: PRIMARY_COLOR_PLACEHOLDER; margin-bottom: 20px; font-weight: 700; }
  .hero-text h1 { font-family: 'Cormorant Garamond', serif; font-size: 72px; line-height: 1.1; margin-bottom: 30px; }
  .hero-text p { font-size: 18px; color: #666; line-height: 1.8; max-width: 550px; }

  .hero-form-box {
    flex: 1;
    background: #fff;
    padding: 50px;
    border-radius: 4px;
    box-shadow: 0 30px 60px rgba(0,0,0,0.1);
    max-width: 480px;
  }

  .form-title { font-family: 'Cormorant Garamond', serif; font-size: 32px; margin-bottom: 30px; text-align: center; }
  
  .form-group { margin-bottom: 20px; }
  .form-group label { display: block; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #999; margin-bottom: 8px; }
  .form-group input, .form-group select {
    width: 100%;
    border: none;
    border-bottom: 1px solid #e2e2e2;
    padding: 12px 0;
    font-family: inherit;
    font-size: 15px;
    outline: none;
    transition: 0.3s;
    background: transparent;
  }
  .form-group input:focus { border-color: PRIMARY_COLOR_PLACEHOLDER; }

  .btn-gold {
    width: 100%;
    padding: 20px;
    background: PRIMARY_COLOR_PLACEHOLDER;
    border: 1px solid rgba(0,0,0,0.1);
    color: #fff;
    border: none;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 2px;
    cursor: pointer;
    transition: 0.4s;
    margin-top: 20px;
  }
  .btn-gold:hover { background: #1a1a1a; }

  .amenities { padding: 120px 8%; background: #fdfcf9; text-align: center; }
  .amenities-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; margin-top: 80px; }
  .amenity-card { padding: 40px; background: #fff; border: 1px solid #f2f2f2; transition: 0.4s; }
  .amenity-card:hover { transform: translateY(-10px); box-shadow: 0 20px 40px rgba(0,0,0,0.05); }
  .amenity-icon { font-size: 40px; margin-bottom: 25px; display: block; }
  .amenity-card h3 { font-family: 'Cormorant Garamond', serif; font-size: 24px; margin-bottom: 15px; }
  
  .footer { background: #1a1a1a; color: #fff; padding: 100px 8% 50px; }
  .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 80px; }
  .footer-col h4 { font-size: 14px; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 30px; color: PRIMARY_COLOR_PLACEHOLDER; }
  .footer-col a { color: #999; text-decoration: none; display: block; margin-bottom: 15px; font-size: 14px; transition: 0.3s; }
  .footer-col a:hover { color: #fff; }

  @media (max-width: 1100px) {
    .hero { height: auto; padding: 100px 5%; background: #fff; }
    .hero-bg, .hero-overlay { display: none; }
    .hero-content { flex-direction: column; text-align: center; }
    .hero-text p { margin: 0 auto; }
    .hero-form-box { margin: 50px auto 0; width: 100%; max-width: 100%; }
    .amenities-grid, .footer-grid { grid-template-columns: 1fr; }
  }

  /* Premium Page Loader */
  .page-loader {
    position: fixed;
    inset: 0;
    background: #fff;
    display: none;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 10001;
  }
  .loader-line {
    width: 150px;
    height: 1px;
    background: #e2e2e2;
    position: relative;
    overflow: hidden;
    margin-bottom: 20px;
  }
  .loader-line::after {
    content: '';
    position: absolute;
    height: 100%;
    width: 50%;
    background: PRIMARY_COLOR_PLACEHOLDER;
    animation: luxurious-load 2s ease-in-out infinite;
  }
  @keyframes luxurious-load {
    0% { left: -50%; }
    100% { left: 100%; }
  }
`;

export const agencyHtml = `
  <div class="hotel-container">
    <header class="header">
      <div class="logo">LOGO_PLACEHOLDER</div>
      <ul class="nav-links">
        <li><a href="#rooms">Rooms</a></li>
        <li><a href="#amenities">Wellness</a></li>
        <li><a href="#dining">Dining</a></li>
      </ul>
      <div style="font-weight: 700; font-size: 12px; letter-spacing: 1px;">BOOK@PLAZA.COM</div>
    </header>

    <div class="hero">
      <img src="/assets/premium/hotel-resort.png" class="hero-bg" alt="Luxury Hotel" />
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <div class="hero-text">
          <h4>Established 1924</h4>
          <h1>A Sanctuary of Timeless Elegance.</h1>
          <p>Discover a world where refined luxury meets coastal serenity. Experience impeccable service and sophisticated comfort in the heart of paradise.</p>
        </div>

        <div class="hero-form-box">
          <h3 class="form-title">Reserve Your Stay</h3>
          <form id="booking-form">
            <div class="form-group">
              <label>Guest Name</label>
              <input type="text" placeholder="Your full name" required />
            </div>
            <div class="form-group">
              <label>Email Contact</label>
              <input type="email" placeholder="Your email address" required />
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
              <div class="form-group">
                <label>Check In</label>
                <input type="date" required />
              </div>
              <div class="form-group">
                <label>Check Out</label>
                <input type="date" required />
              </div>
            </div>
            <div class="form-group">
              <label>Room Category</label>
              <select required>
                <option value="">Select a wing</option>
                <option>Ocean Villa</option>
                <option>Emerald Suite</option>
                <option>Penthouse</option>
              </select>
            </div>
            <button type="submit" class="btn-gold">Confirm Booking</button>
          </form>
        </div>
      </div>
    </div>

    <section class="amenities" id="amenities">
      <div style="max-width: 700px; margin: 0 auto;">
          <h4 style="color: PRIMARY_COLOR_PLACEHOLDER; letter-spacing: 3px; font-weight: 700; margin-bottom: 15px;">EXCEPTIONAL SERVICES</h4>
          <h2 style="font-family: 'Cormorant Garamond', serif; font-size: 48px; margin-bottom: 25px;">Curated for Your Comfort</h2>
          <p style="color: #666; font-size: 16px;">From private infinity pools to Michelin-starred dining, every detail of your stay is managed with absolute precision.</p>
      </div>
      <div class="amenities-grid">
        <div class="amenity-card">
          <span class="amenity-icon">🏊‍♂️</span>
          <h3>Infinity Retreat</h3>
          <p>An exquisite rooftop pool offering panoramic views of the horizon.</p>
        </div>
        <div class="amenity-card">
          <span class="amenity-icon">💆‍♀️</span>
          <h3>Azure Spa</h3>
          <p>Renew your senses with world-class therapeutic treatments.</p>
        </div>
        <div class="amenity-card">
          <span class="amenity-icon">🍷</span>
          <h3>Vintage Cellar</h3>
          <p>An exclusive collection of the world's finest vintages and spirits.</p>
        </div>
      </div>
    </section>

    <footer class="footer">
      <div class="footer-grid">
        <div class="footer-col">
          <div class="logo" style="color: #fff; margin-bottom: 20px;">LOGO_PLACEHOLDER</div>
          <p style="color: #999; line-height: 1.8;">Defining luxury hospitality for over a century. A legacy of excellence in every detail.</p>
        </div>
        <div class="footer-col">
          <h4>Explore</h4>
          <a href="#">The Estate</a>
          <a href="#">The Suites</a>
          <a href="#">Reservations</a>
        </div>
        <div class="footer-col">
          <h4>Destinations</h4>
          <a href="#">Monaco</a>
          <a href="#">Maldives</a>
          <a href="#">Santorini</a>
        </div>
        <div class="footer-col">
          <h4>Legal</h4>
          <a href="#">Privacy</a>
          <a href="#">Careers</a>
          <a href="#">Contact</a>
        </div>
      </div>
      <div style="margin-top: 80px; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 30px; text-align: center; font-size: 12px; color: #666; letter-spacing: 1px;">
        © 2026 PROJECT_NAME_PLACEHOLDER. All Rights Reserved.
      </div>
    </footer>

    <div id="loader" class="page-loader">
      <div class="loader-line"></div>
      <div style="font-family: 'Cormorant Garamond', serif; font-size: 20px;">Securing your suite...</div>
    </div>

    <script>
      console.log('Agency Template Loaded');
    </script>
  </div>
`;
