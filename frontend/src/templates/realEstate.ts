export const realEstateStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Work+Sans:wght@300;400;600&display=swap');

  .real-estate-container {
    margin: 0;
    font-family: 'Work Sans', sans-serif;
    color: #1a1a1a;
    background: #fff;
  }
  
  .navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 25px 8%;
    background: #fff;
    position: sticky;
    top: 0;
    z-index: 1000;
    border-bottom: 1px solid #f0f0f0;
  }
  
  .logo { 
    font-family: 'Playfair Display', serif;
    font-size: 26px; 
    font-weight: 800; 
    color: #0f172a; 
  }
  
  .nav-menu { display: flex; gap: 35px; list-style: none; }
  .nav-menu a { text-decoration: none; color: #64748b; font-weight: 500; font-size: 14px; transition: 0.3s; }
  .nav-menu a:hover { color: PRIMARY_COLOR_PLACEHOLDER; }

  .hero {
    display: flex;
    align-items: center;
    padding: 100px 8%;
    gap: 60px;
    background: #fbfbfc;
    min-height: 85vh;
  }

  .hero-content { flex: 1.2; text-align: left; }
  .hero-label {
    display: inline-block;
    color: PRIMARY_COLOR_PLACEHOLDER;
    font-weight: 700;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 2px;
    margin-bottom: 20px;
  }
  
  .hero h1 { 
    font-family: 'Playfair Display', serif;
    font-size: 68px; 
    line-height: 1.1; 
    margin-bottom: 30px; 
    color: #0f172a;
  }
  
  .hero p { 
    font-size: 19px; 
    color: #64748b; 
    margin-bottom: 40px; 
    line-height: 1.7; 
    max-width: 500px;
  }

  .hero-form-side {
    flex: 1;
    display: flex;
    justify-content: flex-end;
  }

  .inquiry-form {
    background: #fff;
    padding: 45px;
    border-radius: 12px;
    box-shadow: 0 40px 100px rgba(0,0,0,0.08);
    width: 100%;
    max-width: 460px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    border: 1px solid #f0f0f0;
  }

  .form-h3 { font-family: 'Playfair Display', serif; font-size: 28px; margin-bottom: 10px; color: #020617; }
  
  .field-group { width: 100%; }
  .field-input {
    width: 100%;
    padding: 16px 20px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-family: inherit;
    font-size: 15px;
    outline: none;
    transition: 0.3s;
    background: #fcfcfc;
  }
  .field-input:focus { border-color: PRIMARY_COLOR_PLACEHOLDER; background: #fff; box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1); }

  .btn-submit {
    width: 100%;
    padding: 18px;
    background: #0f172a;
    color: #fff;
    border: none;
    border-radius: 8px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    cursor: pointer;
    transition: 0.3s;
    font-size: 14px;
    margin-top: 10px;
  }
  .btn-submit:hover { background: PRIMARY_COLOR_PLACEHOLDER; border: 1px solid rgba(0,0,0,0.1); transform: translateY(-2px); }

  .property-hero {
    width: 100%;
    padding: 0 8% 100px;
    background: #fbfbfc;
  }
  .mansion-img {
    width: 100%;
    border-radius: 20px;
    box-shadow: 0 50px 100px rgba(0,0,0,0.1);
    display: block;
  }

  .stats-bar {
    display: flex;
    justify-content: space-between;
    padding: 80px 8%;
    background: #fff;
  }
  .stat-card { text-align: center; }
  .stat-card h2 { font-family: 'Playfair Display', serif; font-size: 42px; color: #0f172a; margin-bottom: 10px; }
  .stat-card p { color: #64748b; font-weight: 600; text-transform: uppercase; font-size: 12px; }

  .footer { background: #0f172a; color: #fff; padding: 100px 8% 50px; }
  .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 80px; }
  .footer-col h4 { font-size: 14px; font-weight: 700; margin-bottom: 30px; letter-spacing: 1px; color: PRIMARY_COLOR_PLACEHOLDER; }
  .footer-col a { color: #94a3b8; text-decoration: none; display: block; margin-bottom: 15px; font-size: 14px; }
  .footer-col a:hover { color: #fff; transition: 0.3s; }

  @media (max-width: 1100px) {
    .hero { flex-direction: column; text-align: center; padding-top: 60px; }
    .hero-content { text-align: center; }
    .hero-form-side { justify-content: center; width: 100%; }
    .hero p { margin: 0 auto 40px; }
    .stats-bar, .footer-grid { grid-template-columns: 1fr; gap: 50px; text-align: center; }
  }

  /* Premium Loader */
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
  .loader-circle {
    width: 60px;
    height: 60px;
    border: 2px solid #f0f0f0;
    border-top-color: PRIMARY_COLOR_PLACEHOLDER;
    border-radius: 50%;
    animation: rotate 1s linear infinite;
    margin-bottom: 20px;
  }
  @keyframes rotate { to { transform: rotate(360deg); } }
`;

export const realEstateHtml = `
  <div class="real-estate-container">
    <nav class="navbar">
      <div class="logo">LOGO_PLACEHOLDER</div>
      <ul class="nav-menu">
        <li><a href="#portfolio">Properties</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#agents">Agents</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
      <div style="font-weight: 700; color: PRIMARY_COLOR_PLACEHOLDER;">CONTACT_PLACEHOLDER</div>
    </nav>

    <div class="hero">
      <div class="hero-content">
        <span class="hero-label">Unrivaled Luxury Living</span>
        <h1>Exceptional Homes for Elevated Lifestyles.</h1>
        <p>Curating the world's most prestigious real estate. Experience architectural masterpieces and unmatched exclusivity.</p>
        <div style="display: flex; gap: 20px; align-items: center; margin-top: 40px;">
           <div style="display: flex;">
              <img src="https://i.pravatar.cc/100?u=a1" style="width: 45px; height: 45px; border-radius: 50%; border: 3px solid #fff; margin-right: -15px;" />
              <img src="https://i.pravatar.cc/100?u=a2" style="width: 45px; height: 45px; border-radius: 50%; border: 3px solid #fff; margin-right: -15px;" />
              <img src="https://i.pravatar.cc/100?u=a3" style="width: 45px; height: 45px; border-radius: 50%; border: 3px solid #fff;" />
           </div>
           <p style="font-size: 15px; font-weight: 600; color: #64748b;">Joined by 800+ homeowners this month.</p>
        </div>
      </div>

      <div class="hero-form-side">
        <form class="inquiry-form" id="real-estate-form">
          <div style="margin-bottom: 10px;">
            <h3 class="form-h3">Inquire Privacy</h3>
            <p style="font-size: 14px; color: #64748b;">Schedule a private viewing today.</p>
          </div>
          <div class="field-group">
            <input type="text" class="field-input" placeholder="Full Name" required />
          </div>
          <div class="field-group">
            <input type="email" class="field-input" placeholder="Email Address" required />
          </div>
          <div class="field-group">
            <input type="tel" class="field-input" placeholder="Phone Number" required />
          </div>
          <div class="field-group">
            <select class="field-input" required>
              <option value="">Interested in...</option>
              <option>Waterfront Mansion</option>
              <option>Penthouse Suite</option>
              <option>Modern Villa</option>
            </select>
          </div>
          <button type="submit" class="btn-submit">Request Brochure</button>
        </form>
      </div>
    </div>

    <div class="property-hero">
      <img src="/assets/premium/mansion.png" class="mansion-img" alt="Luxury Mansion" />
    </div>

    <div class="stats-bar">
       <div class="stat-card">
         <h2>$2.4B</h2>
         <p>Total Asset Value</p>
       </div>
       <div class="stat-card">
         <h2>500+</h2>
         <p>Premium Listings</p>
       </div>
       <div class="stat-card">
         <h2>12</h2>
         <p>Global Offices</p>
       </div>
       <div class="stat-card">
         <h2>100%</h2>
         <p>Client Satisfaction</p>
       </div>
    </div>

    <footer class="footer">
      <div class="footer-grid">
        <div class="footer-col">
          <div class="logo" style="color: #fff; margin-bottom: 25px;">LOGO_PLACEHOLDER</div>
          <p style="color: #64748b; line-height: 1.8;">The world's leading authority in ultra-luxury real estate and architectural heritage.</p>
        </div>
        <div class="footer-col">
          <h4>Communities</h4>
          <a href="#">Beverly Hills</a>
          <a href="#">Bel Air</a>
          <a href="#">Malibu</a>
          <a href="#">Palm Beach</a>
        </div>
        <div class="footer-col">
          <h4>Services</h4>
          <a href="#">Sell Your Home</a>
          <a href="#">Investment strategy</a>
          <a href="#">Concierge</a>
          <a href="#">Relocation</a>
        </div>
        <div class="footer-col">
          <h4>Company</h4>
          <a href="#">About Us</a>
          <a href="#">The Team</a>
          <a href="#">Insight Blog</a>
          <a href="#">Contact</a>
        </div>
      </div>
      <div style="margin-top: 80px; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 30px; display: flex; justify-content: space-between; align-items: center; color: #475569; font-size: 13px;">
          <p>© 2026 PROJECT_NAME_PLACEHOLDER. All Rights Reserved.</p>
          <div style="display: flex; gap: 20px;">
            <span>Instagram</span> <span>LinkedIn</span> <span>YouTube</span>
          </div>
      </div>
    </footer>

    <div id="loader" class="page-loader">
      <div class="loader-circle"></div>
      <div style="font-family: 'Playfair Display', serif; font-size: 20px; color: #020617;">Connecting you with an agent...</div>
    </div>

    <script>
      console.log('Real Estate Template Loaded');
    </script>
  </div>
`;
