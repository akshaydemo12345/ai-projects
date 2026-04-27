export const legalStyles = `
  .legal-container { margin: 0; font-family: 'Playfair Display', serif; color: #1a1a1a; background: #fff; scroll-behavior: smooth; }
  .legal-nav { display: flex; justify-content: space-between; align-items: center; padding: 20px 10%; border-bottom: 1px solid #eee; background: #fff; position: sticky; top: 0; z-index: 1000; }
  .legal-logo { font-size: 24px; font-weight: 700; color: #1a1a1a; letter-spacing: 2px; text-transform: uppercase; }
  .legal-menu { display: flex; align-items: center; }
  .legal-menu a { font-family: 'Inter', sans-serif; text-decoration: none; color: #1a1a1a; margin-left: 40px; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; transition: 0.3s; }
  .legal-menu a:hover { color: PRIMARY_COLOR_PLACEHOLDER; }
  .mobile-toggle { display: none; font-size: 24px; cursor: pointer; color: #1a1a1a; }
  
  .legal-hero { padding: 150px 10%; text-align: center; background: #0f172a; color: #fff; position: relative; overflow: hidden; }
  .legal-hero::before { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: url('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80') center/cover; opacity: 0.2; }
  .legal-hero-content { position: relative; z-index: 10; max-width: 900px; margin: 0 auto; }
  .legal-hero h1 { font-size: 64px; font-weight: 700; margin-bottom: 30px; line-height: 1.2; }
  .legal-hero p { font-family: 'Inter', sans-serif; font-size: 18px; color: #cbd5e1; margin-bottom: 40px; font-style: italic; }
  
  .btn-legal { display: inline-block; padding: 20px 45px; background: PRIMARY_COLOR_PLACEHOLDER; color: #fff; text-decoration: none; font-family: 'Inter', sans-serif; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; transition: 0.3s; border: none; cursor: pointer; }
  .btn-legal:hover { opacity: 0.9; transform: translateY(-3px); }
  
  .about-band { padding: 100px 10%; background: #fdfdfd; display: flex; align-items: center; gap: 80px; }
  .about-text { flex: 1; }
  .about-text h2 { font-size: 42px; margin-bottom: 25px; }
  .about-text p { font-family: 'Inter', sans-serif; font-size: 16px; line-height: 1.8; color: #4b5563; }
  .about-img { flex: 1; border-radius: 4px; box-shadow: 20px 20px 0 PRIMARY_COLOR_PLACEHOLDER; }

  .legal-services { padding: 120px 10%; }
  .legal-services-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0; border: 1px solid #e2e8f0; }
  .legal-service-card { padding: 80px 50px; background: white; border: 1px solid #e2e8f0; transition: 0.3s; text-align: center; }
  .legal-service-card:hover { background: #0f172a; color: #fff; }
  .legal-service-card h3 { font-size: 26px; margin-bottom: 20px; }
  .legal-service-card p { font-family: 'Inter', sans-serif; font-size: 15px; line-height: 1.7; color: inherit; opacity: 0.8; }
  
  .testimonial-band { padding: 120px 10%; background: #f8fafc; text-align: center; }
  .test-quote { font-size: 32px; font-style: italic; max-width: 800px; margin: 0 auto 30px; }

  .legal-form-section { padding: 120px 10%; text-align: center; background: #fff; }
  .legal-form-box { max-width: 800px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .legal-form-box input, .legal-form-box textarea { grid-column: span 1; padding: 20px; border: 1px solid #eee; font-family: 'Inter', sans-serif; }
  .legal-form-box textarea { grid-column: span 2; }

  .legal-footer { padding: 100px 10% 50px; background: #0f172a; color: #fff; }
  .footer-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 50px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 80px; margin-bottom: 40px; }
  .footer-col h4 { font-family: 'Inter', sans-serif; font-size: 16px; margin-bottom: 25px; text-transform: uppercase; color: PRIMARY_COLOR_PLACEHOLDER; }
  .footer-col p, .footer-col a { font-family: 'Inter', sans-serif; font-size: 14px; color: #94a3b8; text-decoration: none; margin-bottom: 10px; display: block; }

  /* Popup Styles */
  .modal-overlay { display: none; position: fixed; inset: 0; background: rgba(15, 23, 42,0.8); backdrop-filter: blur(8px); z-index: 10000; align-items: center; justify-content: center; }
  .modal-content { background: #fff; padding: 60px; border-radius: 0; width: 100%; max-width: 600px; position: relative; border-top: 10px solid PRIMARY_COLOR_PLACEHOLDER; }
  .close-modal { position: absolute; top: 20px; right: 20px; font-size: 24px; cursor: pointer; color: #1a1a1a; font-family: 'Inter', sans-serif; }

  @media (max-width: 968px) {
    .legal-nav { padding: 15px 5%; }
    .legal-menu { display: none; position: absolute; top: 100%; left: 0; width: 100%; background: #fff; flex-direction: column; padding: 30px; gap: 20px; box-shadow: 0 10px 20px rgba(0,0,0,0.05); text-align: center; }
    .legal-menu.active { display: flex; }
    .legal-menu a { margin-left: 0; }
    .mobile-toggle { display: block; }

    .legal-hero { padding: 80px 5%; }
    .legal-hero h1 { font-size: 32px; }
    .about-band { flex-direction: column; padding: 60px 5%; gap: 40px; }
    .legal-services-grid { grid-template-columns: 1fr; }
    .footer-grid { grid-template-columns: 1fr; }
    .legal-form-box { grid-template-columns: 1fr; padding: 0 5%; }
    .legal-form-box textarea { grid-column: span 1; }
  }

  /* Premium Page Loader */
  .page-loader {
    position: fixed;
    inset: 0;
    background: rgba(15, 23, 42, 0.95);
    backdrop-filter: blur(15px);
    display: none;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 10001;
    font-family: 'Playfair Display', serif;
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
    border-top-color: PRIMARY_COLOR_PLACEHOLDER;
    border-radius: 50%;
    animation: spin 1.5s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  }
  .loader-ring:nth-child(2) {
    inset: 10px;
    border-top-color: PRIMARY_COLOR_PLACEHOLDER;
    opacity: 0.7;
    animation-direction: reverse;
    animation-duration: 1s;
  }
  .loader-text {
    color: #fff;
    font-weight: 700;
    font-size: 20px;
    letter-spacing: 2px;
    text-transform: uppercase;
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

export const legalHtml = `
  <div class="legal-container">
    <nav class="legal-nav">
      <div class="legal-logo">LOGO_PLACEHOLDER</div>
      <div class="mobile-toggle" onclick="document.querySelector('.legal-menu').classList.toggle('active')">☰</div>
      <div class="legal-menu">
        <a href="#about">The Firm</a>
        <a href="#services">Practices</a>
        <a href="#contact">Contact</a>
      </div>
    </nav>

    <div class="legal-hero">
      <div class="legal-hero-content">
        <h1>Justice Guided by Experience, Driven by Integrity.</h1>
        <p>A global law firm providing strategic legal advice and dedicated representation for corporations and private clients across the globe.</p>
        <button class="btn-legal" onclick="document.getElementById('legal-modal').style.display='flex'">Free Consultation</button>
      </div>
    </div>

    <div class="about-band" id="about">
      <div class="about-text">
        <h2>Four Decades of Excellence</h2>
        <p>Everett & Co. has been at the forefront of legal innovation since 1984. We represent the world's most influential companies and individuals in their most complex challenges and transformative opportunities. Our commitment is to excellence, ethics, and our clients' success.</p>
        <p style="margin-top: 20px;">We understand that the legal landscape is constantly evolving, and we strive to stay ahead of the curve to provide the best advice possible.</p>
      </div>
      <img src="https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Office" class="about-img" />
    </div>

    <div class="legal-services" id="services">
      <div style="text-align: center; margin-bottom: 80px;">
        <h2 style="font-size: 48px;">Our Practice Areas</h2>
      </div>
      <div class="legal-services-grid">
        <div class="legal-service-card">
          <h3>Corporate Law</h3>
          <p>Navigating complex business regulations and transactional needs for global enterprises in a changing world.</p>
        </div>
        <div class="legal-service-card">
          <h3>Family Law</h3>
          <p>Compassionate and discreet representation for sensitive personal and family matters that require expert care.</p>
        </div>
        <div class="legal-service-card">
          <h3>Litigation</h3>
          <p>Aggressive and strategic advocacy in state and federal courts across all jurisdictions for any scale of dispute.</p>
        </div>
        <div class="legal-service-card">
          <h3>Real Estate</h3>
          <p>Strategic counsel for commercial and residential real estate transactions, development, and disputes.</p>
        </div>
        <div class="legal-service-card">
          <h3>Intellectual Property</h3>
          <p>Protecting your most valuable assets with comprehensive IP strategy, registration, and enforcement.</p>
        </div>
        <div class="legal-service-card">
          <h3>Tax Law</h3>
          <p>Providing specialized tax planning and dispute resolution services for corporations and individuals.</p>
        </div>
      </div>
    </div>

    <div class="testimonial-band">
      <div class="test-quote">"Their strategic approach and attention to detail saved our corporation from a multi-million dollar liability. Simply the best in the field."</div>
      <p style="font-family: 'Inter', sans-serif; font-weight: 700; text-transform: uppercase; letter-spacing: 2px;">— CEO, Fortune 500 Company</p>
    </div>

    <div class="legal-form-section" id="contact">
      <h2 style="font-size: 48px; margin-bottom: 20px;">Tell us about your case</h2>
      <p style="font-family: 'Inter', sans-serif; color: #64748b; margin-bottom: 60px;">Confidential evaluation by our senior legal experts.</p>
      <form class="legal-form-box">
        <input type="text" placeholder="Full Name" required />
        <input type="email" placeholder="Email Address" required />
        <input type="tel" placeholder="Phone Number" />
        <input type="text" placeholder="Subject" />
        <textarea rows="6" placeholder="Briefly describe your case..."></textarea>
        <button type="submit" class="btn-legal" style="grid-column: span 2; margin-top: 20px;">Send Message</button>
      </form>
    </div>

    <footer class="legal-footer">
      <div class="footer-grid">
        <div class="footer-col">
          <div class="legal-logo" style="margin-bottom: 20px; color: #fff;">LOGO_PLACEHOLDER</div>
          <p>London | New York | Tokyo</p>
          <p>Leading global law firm since 1984.</p>
        </div>
        <div class="footer-col">
          <h4>Expertise</h4>
          <a href="#">Corporate</a>
          <a href="#">Litigation</a>
          <a href="#">Intellectual Property</a>
          <a href="#">Tax Law</a>
        </div>
        <div class="footer-col">
          <h4>Contact</h4>
          <p>+1-212-555-0198</p>
          <p>contact@everettlaw.com</p>
          <p>Wall Street District, NYC</p>
        </div>
      </div>
      <p style="text-align: center; color: #4b5563; font-size: 13px; font-family: 'Inter', sans-serif;">© 2026 PROJECT_NAME_PLACEHOLDER. Attorney Advertising. Prior results do not guarantee similar outcomes.</p>
    </footer>

    <!-- Popup Modal -->
    <div class="modal-overlay" id="legal-modal" onclick="if(event.target == this) this.style.display='none'">
      <div class="modal-content">
        <div class="close-modal" onclick="document.getElementById('legal-modal').style.display='none'">✕</div>
        <h3 style="text-align: center; font-size: 32px; font-weight: 700; margin-bottom: 30px;">Request Consultation</h3>
        <form style="display: flex; flex-direction: column; gap: 15px;">
          <input type="text" placeholder="Full Name" style="padding: 15px; border: 1px solid #eee;" required />
          <input type="email" placeholder="Email Address" style="padding: 15px; border: 1px solid #eee;" required />
          <textarea rows="4" placeholder="How can we help you?" style="padding: 15px; border: 1px solid #eee;" required></textarea>
          <button type="submit" class="btn-legal">Submit Request</button>
        </form>
      </div>
    </div>

    <div id="loader" class="page-loader">
      <div class="loader-visual">
        <div class="loader-ring"></div>
        <div class="loader-ring"></div>
      </div>
      <div class="loader-text">Evaluating your case...</div>
    </div>

    <script>
      console.log('Legal Template Loaded');
    </script>
  </div>
`;
