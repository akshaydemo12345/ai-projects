export const realEstate04Styles = `
:root {
  --primary: PRIMARY_COLOR_PLACEHOLDER;
  --secondary: SECONDARY_COLOR_PLACEHOLDER;
  --primary-rgb: PRIMARY_RGB_PLACEHOLDER;
  --secondary-rgb: SECONDARY_RGB_PLACEHOLDER;
  --re04-dark: #222222;
  --re04-light: #f8f9fa;
  --re04-text: #666666;
}

* { box-sizing: border-box; }

.re04-wrap {
  font-family: 'Inter', sans-serif;
  color: var(--re04-text);
  background-color: #ffffff;
  overflow-x: hidden;
  line-height: 1.6;
}

h1, h2, h3, h4, h5 { 
  color: #111;
  font-weight: 300;
  margin: 0 0 20px 0;
}
p { margin: 0 0 20px 0; }

.re04-btn {
  display: inline-block;
  padding: 12px 25px;
  background: var(--primary);
  color: #ffffff;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  border: 1px solid var(--primary);
  transition: all 0.3s ease;
  cursor: pointer;
  text-align: center;
}
.re04-btn:hover {
  background: transparent;
  color: var(--primary);
}
.re04-btn-outline {
  background: transparent;
  color: var(--primary);
}
.re04-btn-outline:hover {
  background: var(--primary);
  color: #ffffff;
}
.re04-btn-dark {
  background: #111;
  border-color: #111;
  color: #fff;
}
.re04-btn-dark:hover {
  background: var(--primary);
  border-color: var(--primary);
}

.re04-container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Heading with vertical line */
.re04-heading {
  font-size: 2rem;
  border-left: 2px solid var(--primary);
  padding-left: 20px;
  margin-bottom: 40px;
}

/* Hero Section */
.re04-hero {
  position: relative;
  width: 100%;
  height: 800px;
  background-image: url('https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80');
  background-size: cover;
  background-position: center;
}
.re04-hero-box {
  position: absolute;
  top: 150px;
  left: 10%;
  background: #ffffff;
  padding: 60px 40px;
  width: 400px;
}
.re04-hero-box h1 {
  font-size: 2.8rem;
  line-height: 1.1;
  border-left: 2px solid var(--primary);
  padding-left: 20px;
  margin-left: -40px;
  margin-bottom: 25px;
}
.re04-hero-box p {
  color: #888;
  font-size: 0.95rem;
  margin-bottom: 40px;
  line-height: 1.8;
}
.re04-hero-buttons {
  display: flex;
  gap: 15px;
}

.re04-hero-menu {
  position: absolute;
  top: 0;
  right: 15%;
  background: rgba(var(--primary-rgb), 0.85);
  width: 250px;
  height: 350px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-end;
  padding: 40px 30px;
  gap: 15px;
}
.re04-hero-menu a {
  color: #ffffff;
  text-decoration: none;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  transition: opacity 0.3s;
}
.re04-hero-menu a:hover { opacity: 0.7; }
.re04-hero-menu .re04-btn {
  background: transparent; border-color: #fff; color: #fff; margin-top: 10px;
}
.re04-hero-menu .re04-btn:hover {
  background: #fff; color: var(--primary);
}

/* Split Info Sections */
.re04-split-section {
  padding: 100px 0;
  background: #ffffff;
}
.re04-split-section.alt {
  background: var(--re04-light);
}
.re04-split-flex {
  display: flex;
  align-items: center;
  gap: 80px;
}
.re04-split-section.alt .re04-split-flex {
  flex-direction: row-reverse;
}
.re04-split-img {
  flex: 1;
}
.re04-split-img img {
  width: 100%;
  height: 400px;
  object-fit: cover;
}
.re04-split-content {
  flex: 1;
  padding-right: 40px;
}
.re04-split-section.alt .re04-split-content {
  padding-right: 0;
  padding-left: 40px;
}
.re04-split-content p {
  color: #777;
  font-size: 0.95rem;
}

/* Checkerboard Value Proposition */
.re04-checkerboard-wrap {
  padding: 100px 0;
  background: #fff;
}
.re04-checkerboard {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  max-width: 900px;
  margin: 0 auto;
}
.re04-check-item {
  aspect-ratio: 1 / 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 30px;
}
.re04-check-white {
  background: #ffffff;
}
.re04-check-white h3 {
  font-size: 1.3rem;
  margin-bottom: 10px;
  color: #222;
}
.re04-check-white p {
  font-size: 0.85rem;
  color: #888;
}
.re04-check-pink {
  background: var(--primary);
  color: #ffffff;
  position: relative;
  align-items: center;
  justify-content: center;
  text-align: center;
}
.re04-check-pink::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background-size: cover;
  background-position: center;
  opacity: 0.35;
  z-index: 1;
  mix-blend-mode: multiply;
}
.re04-check-pink.img1::before { background-image: url('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&w=400&q=80'); }
.re04-check-pink.img2::before { background-image: url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&w=400&q=80'); }
.re04-check-pink.img3::before { background-image: url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&w=400&q=80'); }

.re04-check-pink svg {
  position: relative;
  z-index: 2;
  width: 50px;
  height: 50px;
  stroke: #ffffff;
  fill: none;
}
.re04-check-pink.fill-icon svg { fill: #ffffff; stroke: none; }

/* Statistics */
.re04-stats {
  padding: 0 0 100px 0;
  background: #ffffff;
  text-align: center;
}
.re04-stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  margin-bottom: 50px;
  border-top: 1px solid #eaeaea;
  border-bottom: 1px solid #eaeaea;
  padding: 40px 0;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
}
.re04-stat-item {
  border-right: 1px solid #eaeaea;
  padding: 0 30px;
}
.re04-stat-item:last-child {
  border-right: none;
}
.re04-stat-item p:first-child {
  font-size: 0.8rem;
  color: #999;
  margin-bottom: 5px;
}
.re04-stat-item h3 {
  font-size: 3.5rem;
  color: #111;
  font-weight: 300;
  margin-bottom: 5px;
  line-height: 1;
}
.re04-stat-item p:last-child {
  font-size: 0.85rem;
  color: #888;
}

/* Offers (Dark Section) */
.re04-offers {
  background: var(--re04-dark);
  padding: 100px 0;
}
.re04-offers .re04-heading {
  color: #ffffff;
}
.re04-offer-card {
  display: flex;
  background: #ffffff;
  margin-bottom: 50px;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
}
.re04-offer-gallery {
  flex: 1.1;
  display: flex;
  flex-direction: column;
}
.re04-offer-main-img {
  width: 100%;
  height: 250px;
  object-fit: cover;
}
.re04-offer-thumbs {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  height: 80px;
}
.re04-offer-thumbs img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.7;
}
.re04-offer-details {
  flex: 1;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.re04-offer-details h3 {
  font-size: 1.4rem;
  margin-bottom: 15px;
  color: #222;
}
.re04-offer-details h4 {
  font-size: 0.75rem;
  color: #999;
  text-transform: uppercase;
  margin-bottom: 15px;
  letter-spacing: 1px;
}
.re04-offer-details p {
  font-size: 0.85rem;
  color: #777;
  line-height: 1.7;
}
.re04-offer-price {
  font-size: 1.4rem;
  font-weight: 600;
  color: #111;
  margin-top: 20px;
  display: flex;
  align-items: center;
}
.re04-offer-price span {
  font-size: 0.75rem;
  color: #999;
  font-weight: normal;
  text-transform: uppercase;
  margin-right: 10px;
}
.re04-offer-price .re04-btn {
  margin-left: auto;
}

/* Team */
.re04-team {
  padding: 100px 0;
  background: #ffffff;
}
.re04-team-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 50px;
  max-width: 900px;
  margin: 0 auto;
}
.re04-team-member {
  display: flex;
  gap: 25px;
}
.re04-team-member img {
  width: 140px;
  height: 140px;
  object-fit: cover;
  flex-shrink: 0;
}
.re04-team-info h4 {
  font-size: 1.2rem;
  margin-bottom: 5px;
}
.re04-team-info span {
  color: var(--primary);
  font-size: 0.75rem;
  text-transform: uppercase;
  display: block;
  margin-bottom: 10px;
}
.re04-team-info p {
  font-size: 0.85rem;
  color: #888;
  line-height: 1.6;
}

/* Contact Footer */
.re04-contact {
  position: relative;
  background-image: url('https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80');
  background-size: cover;
  background-position: center;
  padding: 100px 0;
}
.re04-contact::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: var(--primary);
  opacity: 0.9;
}
.re04-contact-container {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: stretch;
  max-width: 900px;
  margin: 0 auto;
  gap: 0;
}
.re04-contact-form {
  background: #ffffff;
  padding: 50px 40px;
  flex: 1;
}
.re04-contact-form h3 {
  color: var(--primary);
  margin-bottom: 25px;
  font-size: 1.2rem;
  font-weight: 400;
}
.re04-input {
  width: 100%;
  padding: 12px 15px;
  margin-bottom: 15px;
  border: 1px solid #eaeaea;
  font-family: inherit;
  font-size: 0.85rem;
}
.re04-input:focus {
  outline: 1px solid var(--primary);
}
.re04-contact-text {
  flex: 1;
  padding: 50px;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.re04-contact-text h2 {
  color: #ffffff;
  font-size: 3rem;
  line-height: 1.1;
  font-weight: 700;
  margin-bottom: 10px;
}
.re04-contact-text p {
  font-size: 1rem;
  opacity: 0.9;
}

/* Form Validation Modal (CSS Only + JS Intercept) */
.re04-modal-toggle { display: none; }
.re04-modal-toggle:checked ~ .re04-modal { display: flex; }

.re04-modal {
  display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.8); z-index: 9999; align-items: center; justify-content: center; backdrop-filter: blur(5px);
}
.re04-modal-content {
  background: #fff; padding: 40px; border-radius: 10px; text-align: center; max-width: 400px; width: 90%;
}
.re04-modal-close {
  display: inline-block; padding: 12px 30px; background: #111; color: #fff; text-decoration: none; border-radius: 4px; font-weight: bold; cursor: pointer; margin-top:20px; font-size: 0.85rem; text-transform: uppercase;
}

@media (max-width: 1024px) {
  .re04-hero-box { left: 5%; width: 350px; }
  .re04-hero-menu { right: 5%; }
  .re04-split-flex { flex-direction: column; gap: 40px; }
  .re04-split-section.alt .re04-split-flex { flex-direction: column; }
  .re04-split-content, .re04-split-section.alt .re04-split-content { padding: 0 20px; }
  .re04-checkerboard { grid-template-columns: repeat(2, 1fr); }
  .re04-stats-grid { grid-template-columns: 1fr; border: none; }
  .re04-stat-item { border-right: none; border-bottom: 1px solid #eaeaea; padding: 30px 0; }
  .re04-offer-card { flex-direction: column; margin: 0 20px 50px 20px; }
  .re04-team-grid { grid-template-columns: 1fr; padding: 0 20px; }
  .re04-contact-container { flex-direction: column; margin: 0 20px; }
}
`;

export const realEstate04Html = `
<div class="re04-wrap">
  <!-- Hero Section -->
  <section class="re04-hero">
    <div class="re04-hero-menu">
      <div style="font-size: 2rem; font-weight: bold; color: #fff; margin-bottom: 20px;">LOGO_PLACEHOLDER</div>
      <a href="#" class="re04-btn">Download CTA</a>
    </div>
    
    <div class="re04-hero-box">
      <h1>Clear value for your target customer</h1>
      <p>A supporting statement for your Value Proposition to encourage customers to complete your CTA.</p>
      <form onsubmit="event.preventDefault(); document.getElementById('re04-modal-trigger').checked = true;">
        <input type="text" class="re04-input" placeholder="Full name" required>
        <input type="email" class="re04-input" placeholder="Email address" required>
        <input type="tel" class="re04-input" placeholder="Phone number" required>
        <button type="submit" class="re04-btn" style="width: 100%; margin-top: 5px;">Get Started</button>
      </form>
    </div>
  </section>

  <!-- Who We Are -->
  <section class="re04-split-section">
    <div class="re04-container re04-split-flex">
      <div class="re04-split-img">
        <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Corporate Building">
      </div>
      <div class="re04-split-content">
        <h2 class="re04-heading">Who We Are</h2>
        <p>Write here more about your company, including its background, mission, and values. Introduce your team members and highlight any notable achievements or milestones. Share your vision for the future and how you plan to achieve it.</p>
        <p>Don't forget to include your contact information for further inquiries or collaborations.</p>
      </div>
    </div>
  </section>

  <!-- Who is it for? -->
  <section class="re04-split-section alt">
    <div class="re04-container re04-split-flex">
      <div class="re04-split-img">
        <img src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Professional at work">
      </div>
      <div class="re04-split-content">
        <h2 class="re04-heading">Who is it for?</h2>
        <p>Write here more about your company, including its background, mission, and values. Introduce your team members and highlight any notable achievements or milestones. Share your vision for the future and how you plan to achieve it.</p>
        <p>Don't forget to include your contact information for further inquiries or collaborations.</p>
        <a href="#" class="re04-btn re04-btn-outline" style="margin-top:20px;">Download CTA</a>
      </div>
    </div>
  </section>

  <!-- Checkerboard -->
  <section class="re04-checkerboard-wrap">
    <div class="re04-container">
      <h2 class="re04-heading">Your Value Proposition</h2>
    </div>
    <div class="re04-checkerboard">
      <div class="re04-check-item re04-check-white">
        <h3>Benefit name</h3>
        <p>Describe the features of your product or service and the key benefits they offer to your customers.</p>
      </div>
      <div class="re04-check-item re04-check-pink img1 fill-icon">
        <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
      </div>
      <div class="re04-check-item re04-check-white">
        <h3>Benefit name</h3>
        <p>Describe the features of your product or service and the key benefits they offer to your customers.</p>
      </div>
      
      <div class="re04-check-item re04-check-pink img2 fill-icon">
        <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22" stroke="#var(--primary)" stroke-width="2"></polyline></svg>
      </div>
      <div class="re04-check-item re04-check-white">
        <h3>Benefit name</h3>
        <p>Describe the features of your product or service and the key benefits they offer to your customers.</p>
      </div>
      <div class="re04-check-item re04-check-pink img3">
        <svg viewBox="0 0 24 24" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
      </div>
    </div>
  </section>

  <!-- Statistics -->
  <section class="re04-stats">
    <div class="re04-stats-grid">
      <div class="re04-stat-item">
        <p>We have been on the market for</p>
        <h3>20</h3>
        <p>years</p>
      </div>
      <div class="re04-stat-item">
        <p>over</p>
        <h3>1620</h3>
        <p>rental properties</p>
      </div>
      <div class="re04-stat-item">
        <p>over</p>
        <h3>6200</h3>
        <p>offers for the sale of apartments, houses, plots, and commercial premises.</p>
      </div>
    </div>
    <a href="#" class="re04-btn re04-btn-dark">Download CTA</a>
  </section>

  <!-- Offers -->
  <section class="re04-offers">
    <div class="re04-container">
      <h2 class="re04-heading">Offers</h2>
    </div>
    
    <div class="re04-offer-card">
      <div class="re04-offer-gallery">
        <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" class="re04-offer-main-img">
        <div class="re04-offer-thumbs">
          <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&w=300&q=80">
          <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&w=300&q=80">
          <img src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&w=300&q=80">
          <img src="https://images.unsplash.com/photo-1628611225249-6c117d33d596?ixlib=rb-4.0.3&w=300&q=80">
        </div>
      </div>
      <div class="re04-offer-details">
        <h3>An exclusive apartment on the 7th floor.</h3>
        <h4>Apartment for sale, New York</h4>
        <p>Describe the features of your product and the key benefits they offer to your customers. Describe the features of your product and the key benefits they offer to your customers.</p>
        <div class="re04-offer-price">
          <span>Price:</span> $ 180000
          <a href="#" class="re04-btn">Download CTA</a>
        </div>
      </div>
    </div>

    <div class="re04-offer-card">
      <div class="re04-offer-gallery">
        <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" class="re04-offer-main-img">
        <div class="re04-offer-thumbs">
          <img src="https://images.unsplash.com/photo-1628611225249-6c117d33d596?ixlib=rb-4.0.3&w=300&q=80">
          <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&w=300&q=80">
          <img src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&w=300&q=80">
          <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&w=300&q=80">
        </div>
      </div>
      <div class="re04-offer-details">
        <h3>New apartment on the 16th floor.</h3>
        <h4>Apartment for sale, London</h4>
        <p>Describe the features of your product and the key benefits they offer to your customers. Describe the features of your product and the key benefits they offer to your customers.</p>
        <div class="re04-offer-price">
          <span>Price:</span> $ 80000
          <a href="#" class="re04-btn">Download CTA</a>
        </div>
      </div>
    </div>
  </section>

  <!-- Team -->
  <section class="re04-team">
    <div class="re04-container">
      <h2 class="re04-heading">Our Team</h2>
    </div>
    <div class="re04-team-grid">
      <div class="re04-team-member">
        <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="Team Member">
        <div class="re04-team-info">
          <h4>Name Surname</h4>
          <span>Job Title</span>
          <p>Write here more about the individual's background, expertise, and contribution to the team. Highlight their key skills, experience, and interests.</p>
        </div>
      </div>
      <div class="re04-team-member">
        <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="Team Member">
        <div class="re04-team-info">
          <h4>Name Surname</h4>
          <span>Job Title</span>
          <p>Write here more about the individual's background, expertise, and contribution to the team. Highlight their key skills, experience, and interests.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Contact Section -->
  <section class="re04-contact">
    <div class="re04-contact-container">
      <div class="re04-contact-form">
        <h3>Change Apartment</h3>
        <form onsubmit="event.preventDefault(); document.getElementById('re04-modal-trigger').checked = true;">
          <input type="text" class="re04-input" placeholder="Full name" required>
          <input type="email" class="re04-input" placeholder="E-mail" required>
          <input type="tel" class="re04-input" placeholder="Phone" required>
          <div style="display:flex; gap:10px; margin-bottom:15px; font-size:0.75rem; color:#888;">
            <input type="checkbox" required>
            <span>I agree to the processing of personal data.</span>
          </div>
          <button type="submit" class="re04-btn" style="width: 100%;">Download CTA</button>
        </form>
      </div>
      <div class="re04-contact-text">
        <h2>Fill out the form</h2>
        <p>to get more information</p>
      </div>
    </div>
  </section>

  <!-- Copyright Footer -->
  <footer style="padding: 30px; text-align: center; background: #111; color: #888; font-size: 0.9rem;">
    &copy; 2026 Your Company. All rights reserved.
  </footer>

  <!-- Success Modal -->
  <input type="checkbox" id="re04-modal-trigger" class="re04-modal-toggle">
  <div class="re04-modal">
    <div class="re04-modal-content">
      <h3 style="color:#111;">Success!</h3>
      <p style="color:#666; font-size:0.9rem; margin-bottom: 20px;">We have received your information.</p>
      <label for="re04-modal-trigger" class="re04-modal-close">Close</label>
    </div>
  </div>

</div>
`;
