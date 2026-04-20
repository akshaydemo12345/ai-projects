export const agencyStyles = `
  .hotel-container {
    margin: 0;
    font-family: 'Poppins', sans-serif;
    background-color: #fff;
    color: #333;
  }
  
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 5%;
    height: 80px;
    background: #fff;
  }
  
  .logo-box {
    background: #fff;
    padding: 10px 20px;
    height: 100%;
    display: flex;
    align-items: center;
    border: 1px solid #eee;
    border-top: none;
  }
  
  .logo-box h2 { font-size: 20px; font-weight: 800; color: #005f6b; }
  
  .call-us { font-weight: 700; color: #666; font-size: 14px; }
  .call-us span { color: var(--primary, #00bcd4); font-size: 18px; }

  .hero {
    background: #004d56;
    padding: 80px 5% 120px;
    text-align: center;
    color: #fff;
    position: relative;
  }
  
  .hero h4 { font-size: 14px; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 10px; opacity: 0.8; }
  .hero h1 { font-size: 48px; font-weight: 800; margin-bottom: 30px; }
  .hero p { max-width: 700px; margin: 0 auto 50px; font-size: 14px; opacity: 0.7; line-height: 1.8; }

  .booking-bar {
    background: #fff;
    padding: 25px;
    display: grid;
    grid-template-columns: repeat(4, 1fr) auto;
    gap: 15px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.1);
    border-radius: 4px;
    max-width: 1100px;
    margin: -60px auto 0;
    position: relative;
    z-index: 10;
  }
  
  @media (max-width: 900px) {
    .booking-bar { grid-template-columns: 1fr; margin-top: 20px; }
  }

  .booking-bar input, .booking-bar select {
    width: 100%;
    border: 1px solid #eee;
    padding: 12px 15px;
    font-size: 13px;
    border-radius: 4px;
    outline: none;
  }
  
  .booking-bar input::placeholder { color: #999; }
  
  .btn-cyan {
    background: var(--primary, #00bcd4);
    color: #fff;
    border: none;
    padding: 0 30px;
    font-weight: 700;
    font-size: 14px;
    border-radius: 4px;
    cursor: pointer;
    transition: 0.3s;
    height: 100%;
    min-height: 45px;
  }
  .btn-cyan:hover { background: #0097a7; }

  .welcome-section {
    padding: 100px 5% 60px;
    text-align: center;
  }
  
  .welcome-section h2 { font-size: 32px; font-weight: 800; margin-bottom: 15px; text-transform: uppercase; }
  .divider { width: 40px; height: 3px; background: #00bcd4; margin: 0 auto 25px; border-radius: 2px; }
  .welcome-section p { max-width: 800px; margin: 0 auto; color: #777; line-height: 1.8; }

  .activities-grid {
    padding: 0 5% 100px;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 20px;
  }
  
  .offer-banner {
    background: #5c59a7;
    color: #fff;
    padding: 40px;
    text-align: center;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    grid-row: span 2;
  }
  
  .offer-banner h3 { font-size: 28px; font-weight: 900; margin-bottom: 20px; border-top: 2px solid #fff; border-bottom: 2px solid #fff; padding: 15px 0; }
  .offer-banner .price { font-size: 48px; font-weight: 900; margin: 20px 0; }
  .offer-banner .price span { font-size: 20px; }
  
  .grid-item { position: relative; border-radius: 4px; overflow: hidden; height: 270px; background: #eee; }
  .grid-item img { width: 100%; height: 100%; object-fit: cover; }
  .grid-label { position: absolute; bottom: 20px; left: 20px; background: rgba(0,0,0,0.7); color: #fff; padding: 8px 15px; font-size: 13px; font-weight: 600; border-radius: 2px; }

  .wellness-section {
    background: url('https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1600&auto=format&fit=crop&q=60') center center;
    background-size: cover;
    padding: 100px 5%;
    text-align: center;
  }
  
  .wellness-box {
    background: #fff;
    max-width: 1000px;
    margin: 0 auto;
    border-radius: 4px;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(0,0,0,0.1);
  }
  
  .tabs { display: flex; background: #00bcd4; color: #fff; }
  .tab { flex: 1; padding: 20px; cursor: pointer; border-right: 1px solid rgba(255,255,255,0.1); font-size: 13px; font-weight: 700; text-transform: uppercase; }
  .tab.active { background: #fff; color: #333; }
  
  .tab-content { display: flex; padding: 40px; text-align: left; gap: 40px; }
  .tab-image { flex: 1; height: 300px; background: #eee; border-radius: 4px; }
  .tab-info { flex: 1; }
  .tab-info h3 { font-size: 24px; margin-bottom: 10px; }
  .tab-info .meta { color: #f57c00; font-weight: 700; font-size: 13px; margin-bottom: 20px; }
  .tab-info p { color: #777; font-size: 14px; line-height: 1.7; margin-bottom: 30px; }

  .accommodations-row {
     padding: 100px 5%;
     display: grid;
     grid-template-columns: 2fr 1fr;
     gap: 50px;
  }
  
  @media (max-width: 1000px) {
    .accommodations-row { grid-template-columns: 1fr; }
  }

  .room-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 25px; }
  .room-card { position: relative; border-radius: 4px; overflow: hidden; background: #fff; }
  .room-img { height: 250px; background: #eee; position: relative; }
  .price-ribbon { position: absolute; bottom: 0; right: 0; background: #00bcd4; color: #fff; padding: 10px 20px; text-align: right; clip-path: polygon(20% 0%, 100% 0, 100% 100%, 0% 100%); }
  .room-card h4 { margin: 15px 0; font-weight: 700; color: #444; }

  .reviews h3 { font-size: 24px; font-weight: 800; margin-bottom: 30px; text-transform: uppercase; }
  .review-item { margin-bottom: 30px; border-bottom: 1px solid #f1f1f1; padding-bottom: 20px; }
  .stars { color: #ffca28; margin-bottom: 10px; font-size: 14px; }
  .review-name { font-weight: 700; font-size: 14px; margin-bottom: 5px; }
  .review-text { font-size: 13px; color: #777; line-height: 1.6; }

  .footer { 
    background: #eee; 
    padding: 30px; 
    text-align: center; 
    color: #888; 
    font-size: 12px; 
    border-top: 1px solid #ddd;
  }
`;

export const agencyHtml = `
  <div class="hotel-container">
    <header class="header" data-gjs-type="header">
      <div class="logo-box">
        <h2>LUXURY HOTEL</h2>
      </div>
      <div class="call-us">
        CALL US: <span>123 456-7890</span>
      </div>
    </header>

    <div class="hero" data-gjs-type="section">
      <h4>Welcome To Our Luxury Hotel</h4>
      <h1>Book Your Holidays at Dream Location</h1>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
    </div>

    <div class="booking-bar">
      <div class="field">
        <label style="display:block; font-size:10px; font-weight:700; margin-bottom:5px; color:#999;">FULL NAME</label>
        <input type="text" placeholder="Full name" />
      </div>
      <div class="field">
        <label style="display:block; font-size:10px; font-weight:700; margin-bottom:5px; color:#999;">EMAIL ADDRESS</label>
        <input type="email" placeholder="Email address" />
      </div>
      <div class="field">
        <label style="display:block; font-size:10px; font-weight:700; margin-bottom:5px; color:#999;">PHONE NUMBER</label>
        <input type="text" placeholder="Phone number" />
      </div>
      <div class="field" style="display:grid; grid-template-columns: 1fr 1fr; gap:5px;">
         <div>
            <label style="display:block; font-size:10px; font-weight:700; margin-bottom:5px; color:#999;">CHECK IN</label>
            <input type="text" placeholder="10/05/2026" />
         </div>
         <div>
            <label style="display:block; font-size:10px; font-weight:700; margin-bottom:5px; color:#999;">CHECK OUT</label>
            <input type="text" placeholder="15/05/2026" />
         </div>
      </div>
      <button class="btn-cyan">REGISTER NOW →</button>
    </div>

    <section class="welcome-section" data-gjs-type="section">
      <h2>Welcome to our hotel</h2>
      <div class="divider"></div>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis. </p>
    </section>

    <div class="activities-grid" data-gjs-type="section">
      <div class="offer-banner">
        <h3>FREE KIDS <br> SPECIAL OFFER</h3>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi a ante id lorem.</p>
        <div class="price"><span>FROM</span> 99$</div>
        <button style="background:#ffeb3b; color:#333; border:none; padding:10px 20px; font-weight:700; cursor:pointer;">Register Now</button>
        <div style="margin-top:20px; font-size:24px; opacity:0.5;">370 X 272</div>
      </div>
      
      <div class="grid-item">
        <div style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; color:#888; font-size:24px;">370 X 272</div>
        <div class="grid-label">Groups & Entertainment</div>
      </div>
      
      <div class="grid-item">
        <div style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; color:#888; font-size:24px;">370 X 272</div>
        <div class="grid-label">Outdoor Swimming Pool</div>
      </div>
      
      <div class="grid-item">
        <div style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; color:#888; font-size:24px;">370 X 272</div>
        <div class="grid-label">Gym & Sports</div>
      </div>
      
      <div class="grid-item">
        <div style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; color:#888; font-size:24px;">370 X 272</div>
        <div class="grid-label">Buffet & Restaurant</div>
      </div>
    </div>

    <section class="wellness-section" data-gjs-type="section">
      <h2 style="color:#333; margin-bottom:40px; text-transform:uppercase; font-weight:800;">Wellness Services of our hotel</h2>
      <div class="wellness-box">
        <div class="tabs">
          <div class="tab active">🍽️ Restaurant</div>
          <div class="tab">💪 Gym</div>
          <div class="tab">🚐 Pick Up</div>
          <div class="tab">🍹 Bar</div>
        </div>
        <div class="tab-content">
          <div class="tab-image">
            <div style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; color:#888; font-size:24px;">600 X 400</div>
          </div>
          <div class="tab-info">
            <h3>Restaurant & Cafe</h3>
            <div class="meta">Service Hours: 19:00 - 22:00 | Service Charges: $0.0</div>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusc eu dictum erat, euismod porta nisl. Quisque sit amet lectus in nisl euismod pellentesque. Suspendisse nisi ante, rhoncus ut elementum sit amet, accumsan.</p>
            <button class="btn-cyan">SEE MORE SERVICES</button>
          </div>
        </div>
      </div>
    </section>

    <div class="accommodations-row" data-gjs-type="section">
      <div>
        <h3 style="font-size:24px; font-weight:800; margin-bottom:30px; text-transform:uppercase;">Accommodations</h3>
        <div class="room-grid">
          <div class="room-card" data-gjs-type="card">
            <div class="room-img">
              <div style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; color:#888; font-size:20px;">370 X 320</div>
              <div class="price-ribbon">$77 <br> <span style="font-size:10px;">Night</span></div>
            </div>
            <h4>Deluxe Room</h4>
          </div>
          <div class="room-card" data-gjs-type="card">
            <div class="room-img">
              <div style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; color:#888; font-size:20px;">370 X 320</div>
              <div class="price-ribbon">$77 <br> <span style="font-size:10px;">Night</span></div>
            </div>
            <h4>Luxury Room</h4>
          </div>
          <div class="room-card" data-gjs-type="card">
            <div class="room-img">
              <div style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; color:#888; font-size:20px;">370 X 320</div>
              <div class="price-ribbon">$77 <br> <span style="font-size:10px;">Night</span></div>
            </div>
            <h4>Double Room</h4>
          </div>
          <div class="room-card" data-gjs-type="card">
            <div class="room-img">
              <div style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; color:#888; font-size:20px;">370 X 320</div>
              <div class="price-ribbon">$77 <br> <span style="font-size:10px;">Night</span></div>
            </div>
            <h4>Family Room</h4>
          </div>
        </div>
      </div>
      
      <div class="reviews">
        <h3>Reviews</h3>
        <div class="review-item">
          <div class="stars">★★★★★</div>
          <div class="review-name">Anthony Martin</div>
          <div class="review-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</div>
        </div>
        <div class="review-item">
          <div class="stars">★★★★☆</div>
          <div class="review-name">Anthony Martin</div>
          <div class="review-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.</div>
        </div>
        <div class="review-item">
          <div class="stars">★★★★★</div>
          <div class="review-name">Anthony Martin</div>
          <div class="review-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</div>
        </div>
        <button class="btn-cyan" style="width:100%;">ALL REVIEWS</button>
      </div>
    </div>

    <footer class="footer">
      Copyright © 2026. All Rights Reserved. Designed by LeadForest.com
    </footer>
  </div>
`;
