export const realEstate06Styles = `
:root {
  --primary: PRIMARY_COLOR_PLACEHOLDER;
  --secondary: SECONDARY_COLOR_PLACEHOLDER;
  --primary-rgb: PRIMARY_RGB_PLACEHOLDER;
  --secondary-rgb: SECONDARY_RGB_PLACEHOLDER;
  --re06-dark: #2c2c2e;
  --re06-light: #f7f7f7;
  --re06-text: #666666;
}

* { box-sizing: border-box; }

.re06-wrap {
  font-family: 'Inter', sans-serif;
  color: var(--re06-text);
  background-color: #ffffff;
  overflow-x: hidden;
  line-height: 1.6;
}

h1, h2, h3, h4, h5 {
  color: #222;
  font-weight: 300;
  margin: 0 0 20px 0;
}
p { margin: 0 0 20px 0; }

.re06-btn {
  display: inline-block;
  padding: 12px 30px;
  background: var(--primary);
  color: #ffffff;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
  border: none;
  cursor: pointer;
  text-align: center;
  border-radius: 4px;
  transition: opacity 0.3s ease;
}
.re06-btn:hover {
  opacity: 0.9;
}

.re06-container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Header */
.re06-header {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  padding: 20px 0;
  z-index: 10;
  text-align: center;
  background: rgba(0,0,0,0.4);
}
.re06-logo {
  color: #fff;
  font-size: 1.5rem;
  font-weight: bold;
  letter-spacing: 1px;
}
.re06-logo span { font-weight: 300; font-size: 0.9rem; display: block; letter-spacing: 2px; }

/* Hero */
.re06-hero {
  position: relative;
  background-image: url('https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80');
  background-size: cover;
  background-position: center;
  padding: 160px 0 100px 0;
  min-height: 600px;
}
.re06-hero::before {
  content: '';
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.3);
}
.re06-hero-content {
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 80px;
  flex-wrap: wrap;
}
.re06-hero-text {
  text-align: right;
  color: #fff;
  max-width: 400px;
}
.re06-hero-text h1 {
  color: #fff;
  font-size: 2.5rem;
  margin-bottom: 10px;
}
.re06-hero-text p {
  font-size: 1.1rem;
  opacity: 0.9;
}
.re06-hero-form {
  background: rgba(255,255,255,0.95);
  padding: 40px;
  width: 100%;
  max-width: 350px;
  border-radius: 4px;
}
.re06-input {
  width: 100%;
  padding: 12px 15px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  font-family: inherit;
  font-size: 0.85rem;
  border-radius: 4px;
}
.re06-input:focus {
  outline: 1px solid var(--primary);
  border-color: var(--primary);
}

/* Icons Section */
.re06-services {
  padding: 100px 0;
  text-align: center;
  background: #fff;
}
.re06-services h2 {
  font-size: 2rem;
  margin-bottom: 60px;
}
.re06-services-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
}
.re06-service-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.re06-service-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #f9f9f9;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  border: 2px solid #eaeaea;
  transition: border-color 0.3s;
}
.re06-service-item:hover .re06-service-icon {
  border-color: var(--primary);
}
.re06-service-icon svg {
  width: 35px;
  height: 35px;
  fill: #ccc;
}
.re06-service-item h4 {
  color: var(--primary);
  font-size: 1.1rem;
  margin-bottom: 15px;
  font-weight: 400;
}
.re06-service-item p {
  font-size: 0.9rem;
  color: #888;
  line-height: 1.6;
}

/* Split Section */
.re06-split {
  padding: 100px 0;
  background: var(--re06-light);
}
.re06-split-flex {
  display: flex;
  align-items: center;
  gap: 60px;
}
.re06-split-img {
  flex: 1;
}
.re06-split-img img {
  width: 100%;
  height: auto;
  display: block;
}
.re06-split-text {
  flex: 1;
}
.re06-split-text h3 {
  font-size: 1.8rem;
  margin-bottom: 20px;
}
.re06-split-text p {
  color: #777;
  font-size: 0.95rem;
  line-height: 1.8;
}

/* Features */
.re06-features {
  padding: 100px 0;
  background: #fff;
  text-align: center;
}
.re06-features h2 {
  font-size: 2rem;
  margin-bottom: 60px;
}
.re06-features-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 40px;
  text-align: left;
  max-width: 900px;
  margin: 0 auto;
}
.re06-feature {
  display: flex;
  gap: 20px;
}
.re06-feature-icon {
  width: 50px;
  height: 50px;
  background: var(--primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.re06-feature-icon svg {
  width: 24px;
  height: 24px;
  fill: #fff;
}
.re06-feature h4 {
  font-size: 1.1rem;
  margin-bottom: 10px;
  font-weight: 500;
}
.re06-feature p {
  font-size: 0.9rem;
  color: #888;
}

/* Testimonial */
.re06-testimonial {
  position: relative;
  background-image: url('https://images.unsplash.com/photo-1511895426328-dc8714191300?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  padding: 120px 0;
  text-align: center;
}
.re06-testimonial::before {
  content: '';
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(44, 44, 46, 0.85);
}
.re06-testi-content {
  position: relative;
  z-index: 2;
  max-width: 700px;
  margin: 0 auto;
}
.re06-quote-icon {
  color: var(--primary);
  font-size: 4rem;
  line-height: 1;
  font-family: serif;
  margin-bottom: 20px;
}
.re06-testi-content p {
  color: #fff;
  font-size: 1.2rem;
  font-style: italic;
  line-height: 1.8;
  margin-bottom: 40px;
}
.re06-testi-author img {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 10px;
}
.re06-testi-author h5 {
  color: var(--primary);
  margin: 0;
  font-size: 1rem;
}

/* FAQ */
.re06-faq {
  padding: 100px 0;
  background: #fff;
  text-align: center;
}
.re06-faq h2 {
  font-size: 2rem;
  margin-bottom: 60px;
}
.re06-faq-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 40px;
  text-align: left;
}
.re06-faq-item h4 {
  font-size: 1.1rem;
  margin-bottom: 15px;
  font-weight: 500;
}
.re06-faq-item p {
  font-size: 0.9rem;
  color: #888;
}

/* Footer */
.re06-footer {
  background: var(--re06-dark);
  color: #aaa;
  text-align: center;
  padding: 40px 20px;
  font-size: 0.85rem;
}

/* Form Validation Modal (JS Intercept) */
.re06-modal-toggle { display: none; }
.re06-modal-toggle:checked ~ .re06-modal { display: flex; }

.re06-modal {
  display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.8); z-index: 9999; align-items: center; justify-content: center; backdrop-filter: blur(5px);
}
.re06-modal-content {
  background: #fff; padding: 40px; border-radius: 10px; text-align: center; max-width: 400px; width: 90%;
}
.re06-modal-close {
  display: inline-block; padding: 12px 30px; background: #111; color: #fff; text-decoration: none; border-radius: 4px; font-weight: bold; cursor: pointer; margin-top:20px; font-size: 0.85rem; text-transform: uppercase;
}

@media (max-width: 768px) {
  .re06-hero-content { flex-direction: column; text-align: center; gap: 40px; }
  .re06-hero-text { text-align: center; max-width: 100%; }
  .re06-services-grid { grid-template-columns: 1fr; }
  .re06-split-flex { flex-direction: column; }
  .re06-features-grid, .re06-faq-grid { grid-template-columns: 1fr; }
}
`;

export const realEstate06Html = `
<div class="re06-wrap">
  <!-- Header -->
  <header class="re06-header">
    <div class="re06-logo">
      LOGO_PLACEHOLDER
      <span>SERVICE & COMMUNITY</span>
    </div>
  </header>

  <!-- Hero Section -->
  <section class="re06-hero">
    <div class="re06-container re06-hero-content">
      <div class="re06-hero-text">
        <h1>Register for Free to Meet</h1>
        <p>New People and Start Dating Today!</p>
      </div>
      
      <div class="re06-hero-form">
        <form onsubmit="event.preventDefault(); document.getElementById('re06-modal-trigger').checked = true;">
          <input type="text" class="re06-input" placeholder="Full name" required>
          <input type="text" class="re06-input" placeholder="Gender" required>
          <input type="email" class="re06-input" placeholder="E-mail" required>
          <input type="tel" class="re06-input" placeholder="Phone" required>
          <button type="submit" class="re06-btn" style="width: 100%; margin-top: 10px;">Get Started Here</button>
        </form>
      </div>
    </div>
  </section>

  <!-- Services -->
  <section class="re06-services">
    <div class="re06-container">
      <h2>Premium Service</h2>
      <p style="max-width: 800px; margin: 0 auto 50px; color: #888;">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.</p>
      
      <div class="re06-services-grid">
        <div class="re06-service-item">
          <div class="re06-service-icon">
            <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </div>
          <h4>Create a Profile</h4>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        </div>
        <div class="re06-service-item">
          <div class="re06-service-icon">
            <svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
          </div>
          <h4>Browse Photos</h4>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        </div>
        <div class="re06-service-item">
          <div class="re06-service-icon">
            <svg viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
          </div>
          <h4>Start communicating</h4>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Split Section -->
  <section class="re06-split">
    <div class="re06-container re06-split-flex">
      <div class="re06-split-img">
        <img src="https://images.unsplash.com/photo-1511895426328-dc8714191300?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="People">
      </div>
      <div class="re06-split-text">
        <h3>Uniting people<br>with common interests</h3>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
        <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.</p>
      </div>
    </div>
  </section>

  <!-- Features -->
  <section class="re06-features">
    <div class="re06-container">
      <h2>Site Features</h2>
      <div class="re06-features-grid">
        <div class="re06-feature">
          <div class="re06-feature-icon">
            <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </div>
          <div>
            <h4>Lorem ipsum dolor sit</h4>
            <p>Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          </div>
        </div>
        <div class="re06-feature">
          <div class="re06-feature-icon">
            <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
          </div>
          <div>
            <h4>Eiusmod tempor incididunt</h4>
            <p>Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          </div>
        </div>
        <div class="re06-feature">
          <div class="re06-feature-icon">
            <svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </div>
          <div>
            <h4>Sed ut perspiciatis</h4>
            <p>Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          </div>
        </div>
        <div class="re06-feature">
          <div class="re06-feature-icon">
            <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </div>
          <div>
            <h4>Adipiscing elit sed do</h4>
            <p>Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Testimonial -->
  <section class="re06-testimonial">
    <div class="re06-container re06-testi-content">
      <div class="re06-quote-icon">“</div>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
      <div class="re06-testi-author">
        <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" alt="Author">
        <h5>Jane Doe</h5>
      </div>
    </div>
  </section>

  <!-- FAQ -->
  <section class="re06-faq">
    <div class="re06-container">
      <h2>Asked Questions</h2>
      <div class="re06-faq-grid">
        <div class="re06-faq-item">
          <h4>Adipiscing elit sed do</h4>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        </div>
        <div class="re06-faq-item">
          <h4>Eiusmod tempor incididunt</h4>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        </div>
        <div class="re06-faq-item">
          <h4>Esse cillum dolore</h4>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        </div>
        <div class="re06-faq-item">
          <h4>Fugiat nulla pariatur</h4>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="re06-footer">
    &copy; 2026 Premium Services. All rights reserved.
  </footer>

  <!-- Success Modal -->
  <input type="checkbox" id="re06-modal-trigger" class="re06-modal-toggle">
  <div class="re06-modal">
    <div class="re06-modal-content">
      <h3 style="color:#111;">Success!</h3>
      <p style="color:#666; font-size:0.9rem; margin-bottom: 20px;">We have received your details.</p>
      <label for="re06-modal-trigger" class="re06-modal-close">Close</label>
    </div>
  </div>

</div>
`;
