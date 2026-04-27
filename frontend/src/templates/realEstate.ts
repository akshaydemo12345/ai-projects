export const realEstateStyles = `
  .business-container { margin: 0; font-family: 'Poppins', sans-serif; background: #fff; color: #333; line-height: 1.6; }
  
  .top-strip { background: #28a745; color: #fff; padding: 10px 5%; display: flex; justify-content: space-between; font-size: 13px; }
  .header { padding: 15px 5%; display: flex; justify-content: space-between; align-items: center; background: #fff; position: sticky; top: 0; z-index: 1000; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
  .logo { font-size: 24px; font-weight: 800; color: #333; }
  .logo span { color: #28a745; }
  .nav { display: flex; gap: 25px; align-items: center; }
  .nav a { text-decoration: none; color: #555; font-weight: 600; font-size: 14px; transition: 0.3s; }
  .nav a:hover { color: #28a745; }
  .mobile-toggle { display: none; font-size: 24px; cursor: pointer; color: #28a745; }

  .hero { background: url('https://images.unsplash.com/photo-1517245327045-9774d136a705?w=1600&auto=format&fit=crop&q=60') center center; background-size: cover; padding: 150px 5%; text-align: center; color: #fff; position: relative; }
  .hero::before { content: ''; position: absolute; inset: 0; background: rgba(0,0,0,0.4); }
  .hero-content { position: relative; z-index: 1; max-width: 800px; margin: 0 auto; }
  .hero h1 { font-size: 60px; font-weight: 800; margin-bottom: 20px; }
  .hero p { font-size: 18px; opacity: 0.9; margin-bottom: 40px; }
  .btn-green { background: var(--primary, #28a745); color: #fff; border: none; padding: 15px 40px; border-radius: 4px; font-weight: 700; cursor: pointer; transition: 0.3s; }
  .btn-green:hover { filter: brightness(0.9); transform: translateY(-3px); }

  .solutions { padding: 80px 5%; display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; margin-top: -100px; position: relative; z-index: 5; }
  .solution-card { background: #fff; padding: 40px; text-align: center; border-radius: 4px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); transition: 0.3s; border-bottom: 3px solid transparent; }
  .solution-card:hover { border-bottom-color: #28a745; transform: translateY(-5px); }
  .icon-box { font-size: 40px; color: #28a745; margin-bottom: 20px; }

  .about-agency { padding: 100px 5%; display: flex; align-items: center; gap: 60px; }
  .about-img { flex: 1; position: relative; border-radius: 8px; overflow: hidden; }
  .about-img img { width: 100%; display: block; }
  .play-btn { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 80px; height: 80px; background: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 30px; color: #28a745; cursor: pointer; }
  .about-text { flex: 1; }
  .about-text h2 { font-size: 32px; font-weight: 800; margin-bottom: 20px; color: #222; }

  .counters { background: #f8f9fa; padding: 80px 5%; display: grid; grid-template-columns: repeat(4, 1fr); gap: 30px; text-align: center; }
  .counter-box h3 { font-size: 36px; font-weight: 800; color: var(--primary, #28a745); margin-bottom: 5px; }
  .counter-box p { color: #888; font-size: 14px; font-weight: 600; }

  .finance-grid { padding: 100px 5%; display: flex; gap: 60px; align-items: center; }
  .finance-left { flex: 1; }
  .finance-item { display: flex; gap: 20px; margin-bottom: 30px; }
  .fi-icon { width: 60px; height: 60px; background: var(--primary, #28a745); color: #fff; display: flex; align-items: center; justify-content: center; border-radius: 4px; flex-shrink: 0; font-size: 24px; }
  .fi-text h4 { font-size: 18px; margin-bottom: 5px; }
  .fi-text p { font-size: 14px; color: #666; }
  .finance-right { flex: 1; background: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 5px 20px rgba(0,0,0,0.05); }

  @media (max-width: 992px) {
    .header { padding: 10px 5%; }
    .nav { display: none; position: absolute; top: 100%; left: 0; width: 100%; background: #fff; flex-direction: column; padding: 30px; box-shadow: 0 10px 20px rgba(0,0,0,0.05); text-align: center; }
    .nav.active { display: flex; }
    .mobile-toggle { display: block; }
    .nav .btn-green { display: block; width: 100%; }

    .hero h1 { font-size: 40px; }
    .solutions { grid-template-columns: 1fr; margin-top: 0; padding-top: 40px; }
    .about-agency, .finance-grid, .callback-bar { flex-direction: column; text-align: center; gap: 40px; }
    .callback-form { grid-template-columns: 1fr; width: 100%; }
    .counters, .gallery-grid, .team-grid { grid-template-columns: 1fr 1fr; }
    .blog-grid { grid-template-columns: 1fr 1fr; }
    .footer { grid-template-columns: 1fr; }
  }
  @media (max-width: 576px) {
    .counters, .gallery-grid, .team-grid, .blog-grid { grid-template-columns: 1fr; }
    .hero h1 { font-size: 32px; }
    .top-strip { display: none; }
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
    border-top-color: #28a745;
    border-radius: 50%;
    animation: spin 1.5s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  }
  .loader-ring:nth-child(2) {
    inset: 8px;
    border-top-color: #90d39e;
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

export const realEstateHtml = `
  <div class="business-container">
    <div class="top-strip">
       <div>📧 info@yourbusiness.com | 📞 +1 234 567 890</div>
       <div>Follow us: FB TW LN IG</div>
    </div>
    
    <header class="header">
      <div class="logo">BUSINESS<span>PRO</span></div>
      <div class="mobile-toggle" onclick="document.querySelector('.nav').classList.toggle('active')">☰</div>
      <nav class="nav">
        <a href="#">Home</a>
        <a href="#">About</a>
        <a href="#">Services</a>
        <a href="#">Case Studies</a>
        <a href="#">Contact</a>
        <button class="btn-green" style="padding: 12px 25px;">ENQUIRY</button>
      </nav>
    </header>

    <div class="hero" data-gjs-type="section">
      <div class="hero-content">
        <h1>Leader in Business</h1>
        <p>Success is the sole goal of our business consulting firm specializing in financial investment and growth strategy.</p>
        <button class="btn-green">GET A QUOTE</button>
      </div>
    </div>

    <div class="solutions" data-gjs-type="section">
      <div class="solution-card" data-gjs-type="card">
        <div class="icon-box">🛡️</div>
        <h3>Insurance Consulting</h3>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.</p>
      </div>
      <div class="solution-card" data-gjs-type="card">
        <div class="icon-box">📈</div>
        <h3>Business Plan</h3>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.</p>
      </div>
      <div class="solution-card" data-gjs-type="card">
        <div class="icon-box">⚖️</div>
        <h3>Financial Plan</h3>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.</p>
      </div>
    </div>

    <section class="about-agency" data-gjs-type="section">
      <div class="about-img">
        <img src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1000&auto=format&fit=crop&q=60" alt="About" />
        <div class="play-btn">▶️</div>
      </div>
      <div class="about-text">
        <p style="color:#28a745; font-weight:700; margin-bottom:10px;">WHO WE ARE</p>
        <h2>We are leading financial consulting firm specializing in financial investment.</h2>
        <p>We provide deep industry expertise and localized insights to help you scale operations, optimize revenue, and lead the market with confidence and precision.</p>
        <button class="btn-green" style="background:#fff; color:#28a745; border:1px solid #28a745; margin-top:20px;">READ MORE</button>
      </div>
    </section>

    <div class="counters" data-gjs-type="section">
      <div class="counter-box"><h3>450+</h3><p>Trusted Clients</p></div>
      <div class="counter-box"><h3>600+</h3><p>Finished Projects</p></div>
      <div class="counter-box"><h3>200%</h3><p>Revenue Growth</p></div>
      <div class="counter-box"><h3>200+</h3><p>Expert Members</p></div>
    </div>

    <div class="finance-grid" data-gjs-type="section">
      <div class="finance-left">
        <p style="color:#28a745; font-weight:700; margin-bottom:10px;">OUR SERVICES</p>
        <h2 style="font-size:32px; font-weight:800; margin-bottom:30px;">We provide major companies with a range of finance consulting services</h2>
        <div class="finance-item">
          <div class="fi-icon">🏢</div>
          <div class="fi-text"><h4>Business Strategy Planning</h4><p>We identify missed opportunities and implement high-yield growth hacks.</p></div>
        </div>
        <div class="finance-item">
          <div class="fi-icon">💼</div>
          <div class="fi-text"><h4>Investment Advice</h4><p>Identify missed opportunities and implement high-yield growth hacks.</p></div>
        </div>
        <div class="finance-item">
           <div class="fi-icon">⚙️</div>
           <div class="fi-text"><h4>Risk & Compliance</h4><p>Identify missed opportunities and implement high-yield growth hacks.</p></div>
        </div>
      </div>
      <div class="finance-right">
        <div style="height:300px; display:flex; align-items:flex-end; justify-content:space-around; padding:20px;">
           <div style="width:40px; height:60%; background:#28a745;"></div>
           <div style="width:40px; height:85%; background:#28a745;"></div>
           <div style="width:40px; height:40%; background:#28a745;"></div>
           <div style="width:40px; height:55%; background:#28a745;"></div>
        </div>
        <div style="text-align:center; font-weight:700;">Yearly Growth Analytics</div>
      </div>
    </div>

    <div class="callback-bar">
      <div style="flex:1;">
        <h3>Request a call back</h3>
        <p style="font-size:14px; opacity:0.8;">Leave your details and our expert will reach you.</p>
      </div>
      <div class="callback-form">
        <input type="text" placeholder="Full Name" />
        <input type="text" placeholder="Phone Number" />
        <input type="text" placeholder="Select Service" />
      </div>
      <button class="callback-btn">SEND NOW</button>
    </div>

    <section class="gallery" data-gjs-type="section">
       <h2>Our Finished Projects</h2>
       <div class="gallery-grid">
         <div class="gallery-item"><div style="height:100%; display:flex; align-items:center; justify-content:center; color:#888;">Project 1</div></div>
         <div class="gallery-item"><div style="height:100%; display:flex; align-items:center; justify-content:center; color:#888;">Project 2</div></div>
         <div class="gallery-item"><div style="height:100%; display:flex; align-items:center; justify-content:center; color:#888;">Project 3</div></div>
       </div>
    </section>

    <section class="team" data-gjs-type="section">
      <h2 style="font-size:32px; font-weight:800;">People Behind Our Success</h2>
      <div class="team-grid">
        <div class="team-card" data-gjs-type="card">
          <div class="team-img"><div style="height:100%; display:flex; align-items:center; justify-content:center; color:#888;">Team 1</div></div>
          <div class="team-info"><h4>Tyson Conrad</h4><p>Founder & CEO</p></div>
        </div>
        <div class="team-card" data-gjs-type="card">
          <div class="team-img"><div style="height:100%; display:flex; align-items:center; justify-content:center; color:#888;">Team 2</div></div>
          <div class="team-info"><h4>John Doe</h4><p>Director</p></div>
        </div>
        <div class="team-card" data-gjs-type="card">
          <div class="team-img"><div style="height:100%; display:flex; align-items:center; justify-content:center; color:#888;">Team 3</div></div>
          <div class="team-info"><h4>Dana Miller</h4><p>General Manager</p></div>
        </div>
      </div>
    </section>

    <div class="blogs" data-gjs-type="section">
       <h2 style="color:#28a745; margin-bottom:40px;">Blog & Article</h2>
       <div class="blog-grid">
         <div class="blog-card" data-gjs-type="card">
           <div class="blog-img"><div style="height:100%; display:flex; align-items:center; justify-content:center; color:#888;">Blog 1</div></div>
           <h5>How to Manage your business in easy ways</h5>
           <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
         </div>
         <div class="blog-card" data-gjs-type="card">
           <div class="blog-img"><div style="height:100%; display:flex; align-items:center; justify-content:center; color:#888;">Blog 2</div></div>
           <h5>Top 10 Secrets for business growth</h5>
           <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
         </div>
         <div class="blog-card" data-gjs-type="card">
           <div class="blog-img"><div style="height:100%; display:flex; align-items:center; justify-content:center; color:#888;">Blog 3</div></div>
           <h5>Effective business plans for startups</h5>
           <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
         </div>
         <div class="blog-card" data-gjs-type="card">
           <div class="blog-img"><div style="height:100%; display:flex; align-items:center; justify-content:center; color:#888;">Blog 4</div></div>
           <h5>Market analysis 2026 report</h5>
           <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
         </div>
       </div>
    </div>

    <footer class="footer" data-gjs-type="footer">
      <div>
        <div class="logo" style="color:#fff;">BUSINESS<span>PRO</span></div>
        <p style="margin-top:20px; font-size:14px;">We are leading the way in professional business consulting for over 15 years.</p>
      </div>
      <div>
        <h4>Recent Posts</h4>
        <ul><li>How to grow business</li><li>Top strategies</li></ul>
      </div>
      <div>
        <h4>Useful Links</h4>
        <ul><li>About us</li><li>Our services</li><li>Privacy policy</li></ul>
      </div>
      <div>
        <h4>Subscribe</h4>
        <div style="display:flex;">
          <input type="text" placeholder="Email" style="padding:10px; border-radius:4px 0 0 4px; border:none; width:100%;">
          <button style="background:#28a745; color:#fff; border:none; padding:10px 15px; border-radius:0 4px 4px 0;">🔔</button>
        </div>
      </div>
    </footer>
    <div class="copyright">Copyright © 2026 LeadForest. All rights reserved.</div>

    <div id="loader" class="page-loader">
      <div class="loader-visual">
        <div class="loader-ring"></div>
        <div class="loader-ring"></div>
      </div>
      <div class="loader-text">Sending your inquiry...</div>
    </div>

    <script>
      // Support multiple forms (like the one in hero and footer)
      document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function(e) {
          e.preventDefault();
          document.getElementById('loader').style.display = 'flex';
          setTimeout(function() {
            console.log('Form submitted, loader would stay until thank you page');
          }, 2000);
        });
      });
    </script>
  </div>
`;
