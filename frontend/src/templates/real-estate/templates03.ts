export const realEstate03Styles = `
:root {
  --primary: PRIMARY_COLOR_PLACEHOLDER;
  --secondary: SECONDARY_COLOR_PLACEHOLDER;
  --primary-rgb: PRIMARY_RGB_PLACEHOLDER;
  --secondary-rgb: SECONDARY_RGB_PLACEHOLDER;
  --re03-dark: #1f1e1c;
  --re03-darker: #151413;
  --re03-light: #f8f8f8;
  --re03-text: #666666;
}

.re03-wrap {
  font-family: 'Inter', sans-serif;
  color: var(--re03-text);
  background-color: #ffffff;
  overflow-x: hidden;
}

/* Header */
.re03-header {
  background-color: var(--re03-darker);
  position: absolute;
  top: 0;
  left: 0;
  padding: 20px 40px;
  z-index: 20;
}
.re03-logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #fff;
  text-decoration: none;
  font-size: 0.8rem;
  letter-spacing: 1px;
}
.re03-logo svg {
  width: 30px;
  height: 30px;
  color: var(--primary);
  margin-bottom: 5px;
}

/* Hero Section */
.re03-hero-section {
  position: relative;
  width: 100%;
  height: 70vh;
  min-height: 600px;
  background-image: url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80');
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: flex-end;
}
.re03-hero-bar {
  width: 100%;
  background: rgba(21, 20, 19, 0.9);
  padding: 25px 10%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
}
.re03-hero-bar h2 {
  font-weight: 300;
  margin: 0;
  font-size: 1.4rem;
  letter-spacing: 0.5px;
}
.re03-hero-bar-arrow {
  width: 40px;
  height: 40px;
  border: 1px solid var(--re03-text);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
}
.re03-hero-bar-arrow:hover {
  border-color: var(--primary);
  color: var(--primary);
}

/* Floating Form */
.re03-floating-form {
  position: absolute;
  top: 15%;
  right: 15%;
  background-color: var(--re03-dark);
  padding: 40px;
  width: 380px;
  z-index: 10;
  box-shadow: 0 30px 60px rgba(0,0,0,0.4);
}
.re03-floating-form h3 {
  color: #ffffff;
  font-size: 1.8rem;
  font-weight: 300;
  line-height: 1.2;
  margin-bottom: 15px;
}
.re03-floating-form p {
  color: #888888;
  font-size: 0.85rem;
  line-height: 1.5;
  margin-bottom: 30px;
}
.re03-form-input {
  width: 100%;
  padding: 15px;
  margin-bottom: 15px;
  border: none;
  background-color: #ffffff;
  color: #333;
  font-size: 0.9rem;
}
.re03-form-input:focus {
  outline: 2px solid var(--primary);
}
.re03-form-submit {
  width: 100%;
  padding: 15px;
  background: var(--primary);
  border: none;
  color: var(--re03-darker);
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 10px;
  transition: all 0.3s;
  display: block;
  text-align: center;
  box-sizing: border-box;
}
.re03-form-submit:hover {
  opacity: 0.9;
}

/* Modal CSS via Checkbox Hack */
.re03-modal-toggle { display: none; }
.re03-modal-toggle:checked ~ .re03-modal {
  display: flex;
}

/* Modal CSS */
.re03-modal {
  display: none;
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.8);
  z-index: 9999;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(5px);
}
.re03-modal-content {
  background: #fff;
  padding: 40px;
  border-radius: 20px;
  text-align: center;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0,0,0,0.2);
  transform: translateY(20px);
  animation: slideUp 0.3s forwards ease-out;
}
@keyframes slideUp { to { transform: translateY(0); } }
.re03-modal-icon {
  width: 60px; height: 60px;
  background: var(--primary);
  color: #fff;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 20px;
}
.re03-modal-content h3 { font-size: 1.8rem; color: #111; margin-bottom: 10px; }
.re03-modal-content p { color: #666; margin-bottom: 25px; line-height: 1.6; }
.re03-modal-close {
  display: inline-block;
  padding: 12px 30px;
  background: #111;
  color: #fff;
  text-decoration: none;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
}

/* Features Section */
.re03-features-section {
  padding: 100px 10%;
  display: flex;
  gap: 60px;
  background: #ffffff;
  align-items: center;
}
.re03-features-left {
  flex: 1;
}
.re03-features-left h2 {
  font-size: 2.2rem;
  font-weight: 300;
  color: #333333;
  margin-bottom: 40px;
}
.re03-features-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.re03-features-list li {
  margin-bottom: 20px;
  color: #777777;
  display: flex;
  align-items: center;
  gap: 15px;
  font-size: 1rem;
}
.re03-features-list li::before {
  content: '✓';
  color: var(--primary);
  border: 1px solid var(--primary);
  border-radius: 50%;
  width: 22px;
  height: 22px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  flex-shrink: 0;
}
.re03-features-right {
  flex: 1;
  position: relative;
}
.re03-features-right img {
  width: 100%;
  height: auto;
  display: block;
}
.re03-img-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(31, 30, 28, 0.95);
  padding: 20px;
  color: #ffffff;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.re03-img-overlay p {
  margin: 0;
  font-size: 0.9rem;
  color: #ccc;
}

/* Better Icons Section */
.re03-icons-section {
  background-color: var(--re03-light);
  padding: 100px 10%;
}
.re03-icons-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
}
.re03-icon-box {
  background: #ffffff;
  padding: 40px 30px;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0,0,0,0.03);
  transition: transform 0.3s, box-shadow 0.3s;
  border: 1px solid transparent;
}
.re03-icon-box:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.08);
  border-color: rgba(var(--primary-rgb), 0.3);
}
.re03-icon-box svg {
  width: 50px;
  height: 50px;
  color: var(--primary);
  margin-bottom: 20px;
  stroke-width: 1.5;
}
.re03-icon-box h4 {
  font-size: 1.2rem;
  margin-bottom: 15px;
  font-weight: 600;
  color: var(--re03-darker);
}
.re03-icon-box p {
  font-size: 0.9rem;
  color: #666;
  line-height: 1.6;
}

/* Text-Heavy Information Sections CSS */
.re03-info-section { padding: 100px 10%; background: #fff; }
.re03-info-header { text-align: center; margin-bottom: 60px; max-width: 800px; margin-left: auto; margin-right: auto; }
.re03-info-header h2 { font-size: 3rem; font-weight: 300; color: #111; margin-bottom: 20px; letter-spacing: -0.5px; }
.re03-info-header p { font-size: 1.1rem; color: #666; line-height: 1.8; }

.re03-grid-features { display: grid; grid-template-columns: repeat(2, 1fr); gap: 60px; }
.re03-feature-block { padding: 40px; background: var(--re03-light); border-left: 4px solid var(--primary); border-radius: 0 20px 20px 0; }
.re03-feature-block h3 { font-size: 1.5rem; color: #222; margin-bottom: 15px; font-weight: 600; }
.re03-feature-block p { font-size: 1.05rem; color: #555; line-height: 1.7; margin-bottom: 20px; }
.re03-feature-block ul { list-style: none; padding: 0; }
.re03-feature-block ul li { padding: 10px 0; border-bottom: 1px solid #ddd; color: #444; font-size: 0.95rem; }

.re03-plans-section { padding: 100px 10%; background: var(--re03-darker); color: #fff; }
.re03-plans-table { width: 100%; border-collapse: collapse; margin-top: 40px; }
.re03-plans-table th { background: rgba(255,255,255,0.05); padding: 25px; text-align: left; font-size: 1.2rem; font-weight: normal; color: var(--primary); }
.re03-plans-table td { padding: 25px; border-bottom: 1px solid rgba(255,255,255,0.1); font-size: 1.1rem; color: #ccc; }
.re03-plans-table tr:hover td { background: rgba(255,255,255,0.02); }
.re03-plan-btn { padding: 10px 20px; background: transparent; border: 1px solid var(--primary); color: var(--primary); cursor: pointer; border-radius: 5px; transition: 0.3s; }
.re03-plan-btn:hover { background: var(--primary); color: #fff; }

.re03-testimonials { padding: 120px 10%; background: var(--re03-light); text-align: center; }
.re03-testi-container { max-width: 900px; margin: 0 auto; }
.re03-testi-quote { font-size: 2rem; font-style: italic; color: #333; line-height: 1.6; font-weight: 300; margin-bottom: 40px; }
.re03-testi-author { font-size: 1.2rem; font-weight: bold; color: var(--primary); letter-spacing: 1px; text-transform: uppercase; }
.re03-testi-role { font-size: 1rem; color: #888; margin-top: 5px; }

.re03-detailed-faq { padding: 100px 10%; background: #fff; }
.re03-faq-item { border-bottom: 1px solid #eee; padding: 25px 0; }
.re03-faq-item details { width: 100%; }
.re03-faq-item summary { font-size: 1.4rem; color: #222; font-weight: 500; cursor: pointer; list-style: none; display: flex; justify-content: space-between; align-items: center; outline: none; transition: color 0.3s; }
.re03-faq-item summary::-webkit-details-marker { display: none; }
.re03-faq-item summary::after { content: '\\25BC'; font-size: 1rem; color: var(--primary); transition: transform 0.3s; }
.re03-faq-item details[open] summary::after { transform: rotate(180deg); }
.re03-faq-item details[open] summary { color: var(--primary); }
.re03-faq-item p { font-size: 1.1rem; color: #666; line-height: 1.8; margin-top: 15px; }

.re03-cta-massive { padding: 100px 10%; background: var(--primary); color: #111; text-align: center; }
.re03-cta-massive h2 { font-size: 3.5rem; font-weight: 700; margin-bottom: 20px; letter-spacing: -1px; }
.re03-cta-massive p { font-size: 1.4rem; max-width: 700px; margin: 0 auto 40px; line-height: 1.6; opacity: 0.9; }
.re03-cta-massive button { padding: 20px 50px; font-size: 1.2rem; font-weight: bold; background: #111; color: #fff; border: none; border-radius: 5px; cursor: pointer; }


@media (max-width: 1024px) {
  .re03-icons-grid { grid-template-columns: repeat(2, 1fr); }
  .re03-gallery-grid { grid-template-columns: repeat(2, 1fr); }
  .re03-plans-grid { grid-template-columns: 1fr; }
  .re03-testi-grid { grid-template-columns: 1fr; }
  .re03-cta { flex-direction: column; text-align: center; gap: 30px; }
}

/* Dark Split Section */
.re03-dark-split {
  padding: 80px 10%;
  background: #ffffff;
}
.re03-split-container {
  display: flex;
  max-width: 1200px;
  margin: 0 auto;
}
.re03-split-img {
  flex: 1;
  background-image: url('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80');
  background-size: cover;
  background-position: center;
  min-height: 350px;
}
.re03-split-content {
  flex: 1;
  background: var(--re03-darker);
  color: #ffffff;
  padding: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.re03-split-content h3 {
  font-size: 1.6rem;
  font-weight: 300;
  margin-bottom: 20px;
}
.re03-split-content p {
  color: #999;
  line-height: 1.8;
  font-size: 0.95rem;
}

/* Footer */
.re03-footer {
  background: var(--re03-light);
  color: #888;
  text-align: center;
  padding: 40px;
  font-size: 0.85rem;
}

/* Responsive */
@media (max-width: 1024px) {
  .re03-features-section { flex-direction: column; }
  .re03-icons-section { grid-template-columns: repeat(2, 1fr); }
  .re03-split-container { flex-direction: column; }
  .re03-floating-form { right: 5%; width: 320px; }
}
@media (max-width: 768px) {
  .re03-floating-form { position: relative; right: auto; top: auto; width: 100%; margin-top: -50px; }
  .re03-hero-section { align-items: flex-start; height: auto; padding-top: 100px; flex-direction: column; }
  .re03-hero-bar { margin-top: auto; }
  .re03-icons-section { grid-template-columns: 1fr; }
}
`;

export const realEstate03Html = `
<div class="re03-wrap">
  <!-- Header -->
  <header class="re03-header">
    <a href="#" class="re03-logo" style="display: block; font-size: 1.5rem; font-weight: bold; color: var(--primary);">
      LOGO_PLACEHOLDER
    </a>
  </header>
  
  <!-- Hero Section -->
  <section class="re03-hero-section">
    <div class="re03-floating-form">
      <h3>Start to live in Your<br>New Apartment</h3>
      <p>Leave your details here so we can contact you regarding your new apartment, schedule a viewing, and discuss premium options.</p>
      <form onsubmit="event.preventDefault(); document.getElementById('re03-modal-trigger').checked = true;">
        <input type="text" class="re03-form-input" placeholder="Your name" required>
        <input type="email" class="re03-form-input" placeholder="Email address" required>
        <input type="tel" class="re03-form-input" placeholder="Phone number" required>
        <button type="submit" class="re03-form-submit">Submit</button>
      </form>
    </div>
    
    <div class="re03-hero-bar">
      <h2>Neque porro quisquam est dolorem ipsum</h2>
      <div class="re03-hero-bar-arrow">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      </div>
    </div>
  </section>

  <!-- Features Section -->
  <section id="properties" class="re03-features-section">
    <div class="re03-features-left">
      <h2>What is so great in our apartments?</h2>
      <ul class="re03-features-list">
        <li>Meno enim ipsam voluptatem voluptas</li>
        <li>Quisquam dolorem psum quia dolor sit</li>
        <li>Consectetur adipisci velit sed quia</li>
        <li>Numquam eius modi tempore incidunt</li>
        <li>Dolore magnam aliquam quaerat voluptatem</li>
        <li>Ut enim ad minima veniam quis</li>
      </ul>
    </div>
    <div class="re03-features-right">
      <img src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Apartment Interior">
      <div class="re03-img-overlay">
        <p>Quisque aliquam dolorem<br><span style="color:#777; font-size: 0.8rem;">Lorem ipsum dolor sit amet</span></p>
        <div style="display:flex; gap: 10px;">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#fff" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#fff" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
        </div>
      </div>
    </div>
  </section>

  <!-- Icons Section -->
  <section id="about" class="re03-icons-section">
    <div class="re03-icons-grid">
      <div class="re03-icon-box">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
        <h4>Perfect location</h4>
        <p>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.</p>
      </div>
      <div class="re03-icon-box">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
        </svg>
        <h4>Golf course</h4>
        <p>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.</p>
      </div>
      <div class="re03-icon-box">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
        </svg>
        <h4>Private valet</h4>
        <p>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.</p>
      </div>
      <div class="re03-icon-box">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
        </svg>
        <h4>24/7 infoline</h4>
        <p>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.</p>
      </div>
    </div>
  </section>

  <!-- 1. Detailed Amenities (Text-Heavy) -->
  <section class="re03-info-section">
    <div class="re03-info-header">
      <h2>Uncompromising Quality & Amenities</h2>
      <p>We believe that true luxury lies in the details. Every material, every finish, and every service has been meticulously selected to provide an unparalleled living experience that caters to your every need.</p>
    </div>
    <div class="re03-grid-features">
      <div class="re03-feature-block">
        <h3>Concierge Services</h3>
        <p>Our dedicated 24/7 concierge team is trained to anticipate your needs, offering white-glove service that makes daily living effortless and extraordinary.</p>
        <ul>
          <li>Priority reservations at top-tier restaurants</li>
          <li>In-residence spa and wellness bookings</li>
          <li>Global travel planning and chartered transport</li>
        </ul>
      </div>
      <div class="re03-feature-block">
        <h3>Smart Home Integration</h3>
        <p>Experience the future of living with fully integrated smart home technology, allowing you to control your environment seamlessly from anywhere in the world.</p>
        <ul>
          <li>Automated climate and lighting control systems</li>
          <li>Biometric security and private elevator access</li>
          <li>Integrated surround sound and media centers</li>
        </ul>
      </div>
    </div>
  </section>

  <!-- 2. Floor Plans Table (Text Data) -->
  <section class="re03-plans-section">
    <div class="re03-info-header">
      <h2 style="color: #fff;">Available Configurations</h2>
      <p style="color: #aaa;">Review our detailed specifications and layout options. Pricing is subject to availability and floor level.</p>
    </div>
    <table class="re03-plans-table">
      <thead>
        <tr>
          <th>Residence Type</th>
          <th>Square Footage</th>
          <th>Bed / Bath</th>
          <th>Monthly Rate</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Executive Studio</td>
          <td>850 sq ft</td>
          <td>1 Bed / 1.5 Bath</td>
          <td>Starting at $3,200</td>
          <td><button class="re03-plan-btn">Inquire</button></td>
        </tr>
        <tr>
          <td>Luxury Suite</td>
          <td>1,400 sq ft</td>
          <td>2 Bed / 2.5 Bath</td>
          <td>Starting at $5,500</td>
          <td><button class="re03-plan-btn">Inquire</button></td>
        </tr>
        <tr>
          <td>Grand Penthouse</td>
          <td>3,200 sq ft</td>
          <td>4 Bed / 4.5 Bath</td>
          <td>Starting at $12,000</td>
          <td><button class="re03-plan-btn">Inquire</button></td>
        </tr>
      </tbody>
    </table>
  </section>

  <!-- 3. In-Depth Testimonial -->
  <section class="re03-testimonials">
    <div class="re03-testi-container">
      <div class="re03-testi-quote">
        "Transitioning to this property was the most seamless experience of my life. The attention to detail in the architecture is astonishing, but it is the impeccable daily service and discretion of the staff that truly sets it apart from any other luxury residence in the city."
      </div>
      <div class="re03-testi-author">Eleanor Vanderbilt</div>
      <div class="re03-testi-role">Global Investor & Resident</div>
    </div>
  </section>

  <!-- 4. Frequently Asked Questions -->
  <section class="re03-detailed-faq">
    <div class="re03-info-header">
      <h2>Frequently Asked Questions</h2>
      <p>Everything you need to know about purchasing or leasing a residence with us.</p>
    </div>
    <div class="re03-testi-container" style="text-align: left;">
      <div class="re03-faq-item">
        <details>
          <summary>What is the application and approval process?</summary>
          <p>Our approval process is designed to ensure the utmost security and community standards. Applicants must undergo a comprehensive financial background check, provide references, and complete a board interview. The entire process typically takes 14 to 21 business days from initial submission.</p>
        </details>
      </div>
      <div class="re03-faq-item">
        <details>
          <summary>Are modifications to the residence permitted?</summary>
          <p>Yes, residents who purchase their units may employ their own architects and interior designers. However, all structural changes must be approved by the building's architectural review board to ensure they meet our rigorous safety and acoustic standards.</p>
        </details>
      </div>
      <div class="re03-faq-item">
        <details>
          <summary>What are the policies regarding privacy and security?</summary>
          <p>Privacy is our highest priority. The building features biometric access controls, dedicated private elevators for penthouse suites, and a fully vetted, round-the-clock security team. Photography in common areas is strictly prohibited to protect the anonymity of our high-profile residents.</p>
        </details>
      </div>
    </div>
  </section>

  <!-- 5. Massive Text CTA -->
  <section class="re03-cta-massive">
    <h2>Elevate Your Standard of Living</h2>
    <p>Join an exclusive community of visionary individuals. Contact our private advisory team today to request a comprehensive brochure and schedule a confidential consultation.</p>
    <button>Request Private Consultation</button>
  </section>


  <!-- Dark Split Section -->
  <section class="re03-dark-split">
    <div class="re03-split-container">
      <div class="re03-split-img"></div>
      <div class="re03-split-content">
        <h3>Lorem porro quisquam dolorem</h3>
        <p>Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.</p>
      </div>
    </div>
  </section>
  
  <!-- Footer -->
  <footer class="re03-footer">
    &copy; 2026 Premium Apartments. All rights reserved.
  </footer>
  
  <!-- Success Modal -->
  <input type="checkbox" id="re03-modal-trigger" class="re03-modal-toggle">
  <div class="re03-modal">
    <div class="re03-modal-content">
      <div class="re03-modal-icon">
        <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6L9 17l-5-5"/></svg>
      </div>
      <h3>Success!</h3>
      <p>Thank you for reaching out. Our advisory team will contact you shortly to schedule your viewing.</p>
      <label for="re03-modal-trigger" class="re03-modal-close">Close</label>
    </div>
  </div>
</div>
`;