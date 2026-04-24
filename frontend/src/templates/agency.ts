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
    position: sticky;
    top: 0;
    z-index: 1000;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
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
    .header { height: auto; padding: 15px 5%; }
    .logo-box { border: none; padding: 0; }
    .call-us { font-size: 13px; }
    .booking-bar { grid-template-columns: 1fr; margin: 20px auto; width: 90%; }
    .hero h1 { font-size: 32px; }
    .hero { padding: 60px 5%; }
    .activities-grid, .tab-content, .accommodations-row { grid-template-columns: 1fr; padding: 40px 5%; }
    .tab-image { height: 200px; }
    .offer-banner { grid-row: auto; }
  }

  @media (max-width: 480px) {
    .room-grid { grid-template-columns: 1fr; }
    .tabs { flex-direction: column; }
    .tab { border-right: none; border-bottom: 1px solid rgba(255,255,255,0.1); }
  }

  /* Premium Page Loader */
  .page-loader {
    position: fixed;
    inset: 0;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(15px);
    display: none;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 10001;
    font-family: 'Poppins', sans-serif;
  }
  .loader-visual {
    position: relative;
    width: 80px;
    height: 80px;
    margin-bottom: 24px;
  }
  .loader-ring {
    position: absolute;
    inset: 0;
    border: 3px solid transparent;
    border-top-color: #00bcd4;
    border-radius: 50%;
    animation: spin 1.5s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  }
  .loader-ring:nth-child(2) {
    inset: 8px;
    border-top-color: #4dd0e1;
    animation-direction: reverse;
    animation-duration: 1s;
  }
  .loader-text {
    color: #333;
    font-weight: 800;
    font-size: 20px;
    letter-spacing: -0.5px;
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
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

    <div id="loader" class="page-loader">
      <div class="loader-visual">
        <div class="loader-ring"></div>
        <div class="loader-ring"></div>
      </div>
      <div class="loader-text">Securing your booking...</div>
    </div>

    <script>
      // Wrap booking bar button in a form if it's not already
      const bookingBar = document.querySelector('.booking-bar');
      const btn = bookingBar.querySelector('.btn-cyan');
      
      // If the booking bar fields aren't already in a form, we'll handle the click
      btn.addEventListener('click', function(e) {
        // Prevent default if it's not a real form submission
        const form = btn.closest('form');
        if (!form) {
           e.preventDefault();
           document.getElementById('loader').style.display = 'flex';
           setTimeout(function() {
             console.log('Booking submitted, loader would stay until thank you page');
           }, 2000);
        }
      });

      // Handle any standard forms
      document.querySelectorAll('form').forEach(f => {
        f.addEventListener('submit', function(e) {
          e.preventDefault();
          document.getElementById('loader').style.display = 'flex';
        });
      });
    </script>
  </div>
`;
