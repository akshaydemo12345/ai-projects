export const saasHeroStyles = `
  .saas-container { margin: 0; font-family: 'Inter', sans-serif; color: #1e293b; background: #fff; scroll-behavior: smooth; }
  .navbar { display: flex; justify-content: space-between; align-items: center; padding: 15px 8%; background: #fff; position: sticky; top: 0; z-index: 1000; border-bottom: 1px solid #f1f5f9; }
  .logo { font-size: 24px; font-weight: 800; color: #6366f1; }
  .nav-links { display: flex; gap: 30px; list-style: none; align-items: center; }
  .nav-links a { text-decoration: none; color: #64748b; font-weight: 600; font-size: 15px; transition: 0.3s; }
  .nav-links a:hover { color: #6366f1; }
  .mobile-toggle { display: none; font-size: 24px; cursor: pointer; color: #6366f1; }
  
  .hero { padding: 100px 8%; display: flex; align-items: center; gap: 50px; background: #f8fafc; }
  .hero-content { flex: 1; }
  .hero h1 { font-size: 56px; font-weight: 800; line-height: 1.2; margin-bottom: 25px; }
  .hero p { font-size: 18px; color: #64748b; margin-bottom: 40px; line-height: 1.7; }
  
  .hero-form { flex: 1; max-width: 450px; background: #fff; padding: 40px; border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; }
  .hero-form h3 { font-size: 24px; font-weight: 800; margin-bottom: 20px; text-align: center; }
  .hero-form input { width: 100%; padding: 15px; border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 15px; outline: none; }
  .btn-primary { width: 100%; padding: 16px; background: #6366f1; color: #fff; border-radius: 12px; border: none; font-weight: 700; cursor: pointer; transition: 0.3s; }
  .btn-primary:hover { background: #4f46e5; }

  .features { padding: 100px 8%; text-align: center; }
  .feat-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; margin-top: 60px; }
  .feat-card { padding: 40px; background: #fff; border-radius: 20px; border: 1px solid #f1f5f9; transition: 0.3s; }
  .feat-card:hover { border-color: #6366f1; transform: translateY(-5px); }
  .feat-card i { font-size: 28px; margin-bottom: 20px; display: block; }
  
  .content-section { padding: 100px 8%; display: flex; align-items: center; gap: 80px; }
  .content-img { flex: 1; border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); }
  .content-text { flex: 1; }
  
  .testimonials { padding: 100px 8%; background: #f8fafc; text-align: center; }
  .test-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; margin-top: 60px; }
  .test-card { padding: 30px; background: #fff; border-radius: 20px; text-align: left; }

  .cta-section { padding: 100px 8%; text-align: center; }
  .cta-box { background: #6366f1; padding: 80px; border-radius: 30px; color: #fff; }

  .footer { padding: 80px 8% 40px; border-top: 1px solid #f1f5f9; }
  .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 50px; margin-bottom: 60px; }

  @media (max-width: 968px) {
    .navbar { padding: 10px 5%; }
    .nav-links { display: none; position: absolute; top: 100%; left: 0; width: 100%; background: #fff; flex-direction: column; padding: 30px; box-shadow: 0 10px 20px rgba(0,0,0,0.05); gap: 20px; }
    .nav-links.active { display: flex; }
    .mobile-toggle { display: block; }
    .nav-links .btn-primary { display: block; width: 100%; }

    .hero { flex-direction: column; text-align: center; padding: 40px 5%; }
    .hero-content { margin-bottom: 40px; }
    .hero h1 { font-size: 40px; }
    .feat-grid, .test-grid, .footer-grid { grid-template-columns: 1fr; }
    .content-section { flex-direction: column; gap: 40px; }
    .cta-box { padding: 40px 20px; }
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
    font-family: 'Inter', sans-serif;
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
    border-top-color: #6366f1;
    border-radius: 50%;
    animation: spin 1.5s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  }
  .loader-ring:nth-child(2) {
    inset: 8px;
    border-top-color: #a5b4fc;
    animation-direction: reverse;
    animation-duration: 1s;
  }
  .loader-text {
    color: #1e293b;
    font-weight: 800;
    font-size: 20px;
    letter-spacing: -0.5px;
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

export const saasHeroHtml = `
  <div class="saas-container">
    <nav class="navbar">
      <div class="logo">BizFlow</div>
      <div class="mobile-toggle" onclick="document.querySelector('.nav-links').classList.toggle('active')">☰</div>
      <ul class="nav-links">
        <li><a href="#features">Features</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#reviews">Reviews</a></li>
        <li><button class="btn-primary" style="width: auto; padding: 10px 20px;">Get Started</button></li>
      </ul>
    </nav>

    <div class="hero">
      <div class="hero-content">
        <h1>Transform Your Business Operations.</h1>
        <p>The all-in-one platform to manage your team, projects, and clients with insane efficiency. Join 2,000+ growing businesses.</p>
        <div style="display: flex; gap: 20px;">
           <img src="https://upload.wikimedia.org/wikipedia/commons/a/ab/Logo_of_the_Google.svg" style="height: 20px; opacity: 0.5;" />
           <img src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" style="height: 20px; opacity: 0.5;" />
        </div>
      </div>
      <div class="hero-form">
        <h3>Request a Demo</h3>
        <form>
          <input type="text" placeholder="Full Name" required />
          <input type="email" placeholder="Work Email" required />
          <input type="text" placeholder="Company Name" required />
          <button type="submit" class="btn-primary">Send Request</button>
        </form>
      </div>
    </div>

    <div class="features" id="features">
      <h2>Built for Speed and Scale</h2>
      <div class="feat-grid">
        <div class="feat-card">
          <i>🚀</i>
          <h4>Fast Setup</h4>
          <p>Get up and running in less than 10 minutes with our easy onboarding.</p>
        </div>
        <div class="feat-card">
          <i>🔒</i>
          <h4>Secure Data</h4>
          <p>Your business data is encrypted and backed up every hour on the cloud.</p>
        </div>
        <div class="feat-card">
          <i>📊</i>
          <h4>Live Reports</h4>
          <p>Real-time analytics to help you make data-driven decisions instantly.</p>
        </div>
      </div>
    </div>

    <div class="content-section" id="about">
      <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" class="content-img" />
      <div class="content-text">
        <h2>Collaboration Made Simple.</h2>
        <p>Break down silos and bring your team together in one unified workspace. Chat, share files, and track progress without switching apps.</p>
        <ul style="list-style: none; padding: 0; margin-top: 25px;">
           <li style="margin-bottom: 10px;">✅ Shared Team Calendars</li>
           <li style="margin-bottom: 10px;">✅ Real-time Project Tracking</li>
           <li style="margin-bottom: 10px;">✅ Seamless File Integrations</li>
        </ul>
      </div>
    </div>

    <div class="testimonials" id="reviews">
      <h2>Success Stories</h2>
      <div class="test-grid">
        <div class="test-card">
          <p>"BizFlow completely changed how our agency works. We're 40% more productive."</p>
          <p><b>— Mark Stevens</b>, CEO at Arc</p>
        </div>
        <div class="test-card">
          <p>"The best investment we've made this year. The support team is also amazing."</p>
          <p><b>— Sarah Lee</b>, Founder of Zen</p>
        </div>
        <div class="test-card">
          <p>"Simple, fast, and powerful. Exactly what we needed for our growing startup."</p>
          <p><b>— David Chen</b>, CTO at Spark</p>
        </div>
      </div>
    </div>

    <div class="cta-section">
      <div class="cta-box">
        <h2>Ready to grow your business?</h2>
        <p>Join thousands of businesses already scaling with BizFlow.</p>
        <button class="btn-primary" style="background: #fff; color: #6366f1; width: auto; padding: 18px 40px; margin-top: 20px;">Get Started for Free</button>
      </div>
    </div>

    <footer class="footer">
      <div class="footer-grid">
        <div class="footer-col">
          <div class="logo">BizFlow</div>
          <p style="color: #64748b; margin-top: 20px;">The modern business operating system.</p>
        </div>
        <div class="footer-col">
          <h4>Solution</h4>
          <p>Enterprise</p>
          <p>Small Business</p>
        </div>
        <div class="footer-col">
          <h4>Support</h4>
          <p>Help Center</p>
          <p>Contact</p>
        </div>
        <div class="footer-col">
          <h4>Legal</h4>
          <p>Privacy</p>
          <p>Terms</p>
        </div>
      </div>
      <p style="text-align: center; color: #94a3b8; font-size: 14px;">© 2026 BizFlow Inc.</p>
    </footer>

    <div id="loader" class="page-loader">
      <div class="loader-visual">
        <div class="loader-ring"></div>
        <div class="loader-ring"></div>
      </div>
      <div class="loader-text">Setting up your demo...</div>
    </div>

    <script>
      document.querySelector('form').addEventListener('submit', function(e) {
        e.preventDefault();
        document.getElementById('loader').style.display = 'flex';
        setTimeout(function() {
          console.log('Form submitted, loader would stay until thank you page');
        }, 2000);
      });
    </script>
  </div>
`;
