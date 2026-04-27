export const technologyStyles = `
  .tech-container { margin: 0; font-family: 'Outfit', sans-serif; background: #020617; color: #fff; scroll-behavior: smooth; }
  .tech-nav { padding: 15px 8%; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.05); position: sticky; top: 0; background: rgba(2, 6, 23, 0.9); backdrop-filter: blur(15px); z-index: 1000; }
  .tech-logo { font-size: 24px; font-weight: 800; background: linear-gradient(135deg, #38bdf8, #818cf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .tech-menu { display: flex; gap: 30px; align-items: center; }
  .tech-menu a { color: #94a3b8; text-decoration: none; font-weight: 600; font-size: 15px; transition: 0.3s; }
  .tech-menu a:hover { color: #38bdf8; }
  .mobile-toggle { display: none; font-size: 24px; cursor: pointer; color: #38bdf8; }
  
  .tech-hero { padding: 100px 8% 80px; display: flex; align-items: center; gap: 50px; position: relative; }
  .tech-hero-glow { position: absolute; top: -100px; left: 50%; transform: translateX(-50%); width: 600px; height: 600px; background: radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%); z-index: 1; }
  .tech-content { flex: 1.2; position: relative; z-index: 10; }
  .tech-badge { padding: 8px 16px; background: rgba(56, 189, 248, 0.1); border: 1px solid rgba(56, 189, 248, 0.2); border-radius: 50px; color: #38bdf8; font-size: 13px; font-weight: 600; margin-bottom: 30px; display: inline-block; }
  .tech-hero h1 { font-size: 72px; font-weight: 800; line-height: 1; margin-bottom: 30px; letter-spacing: -2px; }
  .tech-hero h1 span { color: #38bdf8; }
  .tech-hero p { font-size: 20px; color: #94a3b8; margin-bottom: 40px; line-height: 1.6; }
  
  .form-card { flex: 1; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); backdrop-filter: blur(20px); padding: 40px; border-radius: 24px; position: relative; z-index: 20; }
  .form-card h3 { font-size: 24px; margin-bottom: 25px; text-align: center; }
  .form-card input { width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); padding: 14px; border-radius: 12px; margin-bottom: 15px; color: #fff; outline: none; }
  .form-card input:focus { border-color: #38bdf8; }
  
  .btn-tech-primary { width: 100%; padding: 18px; background: #fff; color: #020617; border-radius: 12px; font-weight: 700; text-decoration: none; transition: 0.3s; border: none; cursor: pointer; font-size: 16px; display: inline-block; text-align: center; }
  .btn-tech-primary:hover { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(255,255,255,0.2); }
  
  .tech-trust { padding: 60px 8%; text-align: center; border-top: 1px solid rgba(255,255,255,0.05); border-bottom: 1px solid rgba(255,255,255,0.05); }
  .tech-trust p { color: #64748b; text-transform: uppercase; font-size: 12px; font-weight: 700; letter-spacing: 2px; margin-bottom: 30px; }
  .trust-logos { display: flex; justify-content: center; gap: 60px; flex-wrap: wrap; opacity: 0.5; }
  .trust-logos img { height: 30px; filter: grayscale(1) invert(1); }

  .tech-features { padding: 120px 8%; }
  .feat-header { text-align: center; max-width: 700px; margin: 0 auto 80px; }
  .feat-header h2 { font-size: 48px; font-weight: 800; margin-bottom: 20px; }
  .feat-header p { color: #94a3b8; font-size: 18px; }
  .tech-feat-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; }
  .tech-feat-card { padding: 40px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 24px; transition: 0.3s; }
  .tech-feat-card:hover { border-color: #38bdf8; background: rgba(56, 189, 248, 0.05); transform: translateY(-5px); }
  .tech-feat-card i { font-size: 32px; margin-bottom: 25px; display: block; }
  .tech-feat-card h3 { font-size: 20px; font-weight: 700; margin-bottom: 15px; }
  .tech-feat-card p { color: #94a3b8; line-height: 1.6; }

  .tech-cta { padding: 100px 8%; text-align: center; position: relative; overflow: hidden; }
  .cta-box { background: linear-gradient(135deg, #38bdf8, #818cf8); padding: 80px; border-radius: 40px; color: #020617; }
  .cta-box h2 { font-size: 48px; font-weight: 800; margin-bottom: 20px; }
  .cta-box p { font-size: 20px; margin-bottom: 40px; opacity: 0.8; }
  .btn-dark { background: #020617; color: #fff; padding: 18px 40px; border-radius: 12px; text-decoration: none; font-weight: 700; transition: 0.3s; display: inline-block; }

  .tech-footer { padding: 100px 8% 50px; border-top: 1px solid rgba(255,255,255,0.05); }
  .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 50px; margin-bottom: 80px; }
  .footer-col h4 { font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 25px; }
  .footer-col ul { list-style: none; padding: 0; }
  .footer-col ul li { margin-bottom: 15px; }
  .footer-col ul li a { color: #94a3b8; text-decoration: none; transition: 0.3s; }
  .footer-col ul li a:hover { color: #38bdf8; }

  @media (max-width: 968px) {
    .tech-nav { padding: 10px 5%; }
    .tech-menu { display: none; position: absolute; top: 100%; left: 0; width: 100%; background: #020617; flex-direction: column; padding: 30px; border-bottom: 1px solid rgba(255,255,255,0.05); }
    .tech-menu.active { display: flex; }
    .mobile-toggle { display: block; }
    .tech-menu .btn-tech-primary { display: block; width: 100%; }

    .tech-hero { flex-direction: column; text-align: center; padding: 40px 5%; }
    .tech-hero h1 { font-size: 44px; }
    .tech-feat-grid, .footer-grid { grid-template-columns: 1fr; }
    .cta-box { padding: 40px 20px; }
    .trust-logos { gap: 30px; }
    .tech-hero-glow { width: 300px; height: 300px; }
  }

  /* Premium Page Loader */
  .page-loader {
    position: fixed;
    inset: 0;
    background: rgba(2, 6, 23, 0.95);
    backdrop-filter: blur(15px);
    display: none;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 10001;
    font-family: 'Outfit', sans-serif;
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
    border-top-color: #38bdf8;
    border-radius: 50%;
    animation: spin 1.5s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  }
  .loader-ring:nth-child(2) {
    inset: 8px;
    border-top-color: #818cf8;
    animation-direction: reverse;
    animation-duration: 1s;
  }
  .loader-text {
    color: #fff;
    font-weight: 800;
    font-size: 20px;
    letter-spacing: 1px;
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

export const technologyHtml = `
  <div class="tech-container">
    <nav class="tech-nav">
      <div class="tech-logo">AETHER.AI</div>
      <div class="mobile-toggle" onclick="document.querySelector('.tech-menu').classList.toggle('active')">☰</div>
      <div class="tech-menu">
        <a href="#features">Features</a>
        <a href="#pricing">Pricing</a>
        <a href="#demo" class="btn-tech-primary" style="width: auto; padding: 10px 20px;">Book Demo</a>
      </div>
    </nav>

    <div class="tech-hero">
      <div class="tech-hero-glow"></div>
      <div class="tech-content">
        <div class="tech-badge">New: AI Agents Version 4.0</div>
        <h1>Scale Your <span>Future</span> with Intelligence.</h1>
        <p>Aether is the first all-in-one platform for developing, testing, and deploying autonomous AI agents at scale globally.</p>
        <div style="display: flex; gap: 15px; align-items: center;">
          <button class="btn-tech-primary" style="width: auto; padding: 18px 40px;">Start Building Now</button>
          <a href="#" style="color: #fff; text-decoration: none; font-weight: 700;">Watch the Film →</a>
        </div>
      </div>

      <div class="form-card" id="demo">
        <h3>Join the Early Access</h3>
        <form>
          <input type="text" placeholder="Full Name" required />
          <input type="email" placeholder="Work Email" required />
          <input type="text" placeholder="Company Name" required />
          <div style="margin-bottom: 20px;">
            <p style="font-size: 12px; color: #94a3b8; margin-bottom: 10px;">Select Project Scale</p>
            <div style="display: flex; gap: 10px;">
              <div style="flex: 1; padding: 10px; background: rgba(255,255,255,0.05); border-radius: 8px; text-align: center; border: 1px solid #38bdf8; font-size: 12px;">SaaS</div>
              <div style="flex: 1; padding: 10px; background: rgba(255,255,255,0.05); border-radius: 8px; text-align: center; border: 1px solid rgba(255,255,255,0.1); font-size: 12px;">Enterprise</div>
            </div>
          </div>
          <button type="submit" class="btn-tech-primary">Get Access Code</button>
        </form>
      </div>
    </div>

    <div class="tech-trust">
      <p>Trusted by Industry Leaders</p>
      <div class="trust-logos">
        <img src="https://upload.wikimedia.org/wikipedia/commons/a/ab/Logo_of_the_Google.svg" alt="Google" />
        <img src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" alt="Microsoft" />
        <img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" alt="Company" />
        <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg" alt="IBM" />
        <img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" alt="Amazon" />
      </div>
    </div>

    <div class="tech-features" id="features">
      <div class="feat-header">
        <h2>Everything you need to build the next big thing.</h2>
        <p>Powerful tools designed to help you ship faster and scale without the infrastructure headaches.</p>
      </div>
      <div class="tech-feat-grid">
        <div class="tech-feat-card">
          <i>⚡</i>
          <h3>Real-time Streaming</h3>
          <p>Process millions of data points per second with zero latency across our global network.</p>
        </div>
        <div class="tech-feat-card">
          <i>🛡️</i>
          <h3>Enterprise Security</h3>
          <p>Bank-grade encryption and SOC2 Type II compliance built into every layer of our stack.</p>
        </div>
        <div class="tech-feat-card">
          <i>🤖</i>
          <h3>Auto-scaling Agents</h3>
          <p>Deploy agents that automatically scale based on workload demands and budget limits.</p>
        </div>
        <div class="tech-feat-card">
          <i>📈</i>
          <h3>Advanced Analytics</h3>
          <p>Deep insights into your agent's performance, cost tracking, and decision making paths.</p>
        </div>
        <div class="tech-feat-card">
          <i>🌐</i>
          <h3>Global Deployment</h3>
          <p>Deploy to over 50+ regions worldwide with just a single command or API call.</p>
        </div>
        <div class="tech-feat-card">
          <i>🔌</i>
          <h3>Custom Integrations</h3>
          <p>Connect with your existing stack using our pre-built plugins for Slack, Discord, and more.</p>
        </div>
      </div>
    </div>

    <div class="tech-cta">
      <div class="cta-box">
        <h2>Ready to start your journey?</h2>
        <p>Join the future of autonomous technology and build something amazing today.</p>
        <div style="display: flex; gap: 20px; justify-content: center;">
          <a href="#" class="btn-dark">Start Free Trial</a>
          <a href="#" class="btn-dark" style="background: rgba(0,0,0,0.1); color: #000; border: 1px solid rgba(0,0,0,0.1);">Contact Sales</a>
        </div>
      </div>
    </div>

    <footer class="tech-footer">
      <div class="footer-grid">
        <div class="footer-col" style="max-width: 300px;">
          <div class="tech-logo" style="margin-bottom: 25px;">AETHER.AI</div>
          <p style="color: #64748b; line-height: 1.6;">Leading the way in autonomous AI infrastructure for the next generation of digital products.</p>
        </div>
        <div class="footer-col">
          <h4>Product</h4>
          <ul>
            <li><a href="#">Features</a></li>
            <li><a href="#">Security</a></li>
            <li><a href="#">Roadmap</a></li>
            <li><a href="#">Pricing</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Resources</h4>
          <ul>
            <li><a href="#">Documentation</a></li>
            <li><a href="#">API Reference</a></li>
            <li><a href="#">Community</a></li>
            <li><a href="#">Guides</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Company</h4>
          <ul>
            <li><a href="#">About</a></li>
            <li><a href="#">Blog</a></li>
            <li><a href="#">Careers</a></li>
            <li><a href="#">Legal</a></li>
          </ul>
        </div>
      </div>
      <div style="display: flex; justify-content: space-between; color: #64748b; font-size: 14px;">
        <p>© 2026 Aether Technologies Inc.</p>
        <div style="display: flex; gap: 30px;">
          <a href="#" style="color: inherit; text-decoration: none;">Twitter</a>
          <a href="#" style="color: inherit; text-decoration: none;">GitHub</a>
          <a href="#" style="color: inherit; text-decoration: none;">LinkedIn</a>
        </div>
      </div>
    </footer>

    <div id="loader" class="page-loader">
      <div class="loader-visual">
        <div class="loader-ring"></div>
        <div class="loader-ring"></div>
      </div>
      <div class="loader-text">Granting early access...</div>
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
