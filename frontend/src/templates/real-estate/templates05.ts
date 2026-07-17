export const realEstate05Styles = `
:root {
  --font-primary: 'Inter', sans-serif;
}

body {
  margin: 0;
  font-family: var(--font-primary);
  background-color: #ffffff;
  color: #111111;
}

.re05-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.re05-section {
  padding: 80px 0;
}

.re05-section-dark {
  background-color: var(--secondary);
  color: #ffffff;
}

.re05-section-light {
  background-color: #f9fafb;
}

.re05-text-primary { color: var(--primary); }
.re05-text-secondary { color: var(--secondary); }
.re05-bg-primary { background-color: var(--primary); }
.re05-bg-secondary { background-color: var(--secondary); }

.re05-btn-primary {
  display: inline-block;
  background-color: var(--primary);
  color: #ffffff;
  padding: 14px 28px;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  border: 1px solid #eee;
  cursor: pointer;
}
.re05-btn-primary:hover {
  opacity: 0.9;
  transform: translateY(-2px);
  box-shadow: none;
}

.re05-btn-outline {
  display: inline-block;
  background-color: transparent;
  color: var(--primary);
  border: 2px solid var(--primary);
  padding: 12px 26px;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
}
.re05-btn-outline:hover {
  background-color: var(--primary);
  color: #ffffff;
}

/* Header */
.re05-header {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 50;
  padding: 24px 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 100%);
}
.re05-header .re05-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.re05-logo img {
  height: 40px;
  width: auto;
}
.re05-nav {
  display: flex;
  gap: 32px;
}
.re05-nav a {
  color: #ffffff;
  text-decoration: none;
  font-weight: 500;
  font-size: 15px;
  transition: color 0.3s;
}
.re05-nav a:hover {
  color: var(--primary);
}

/* Hero */
.re05-hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  background-image: url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80');
  background-size: cover;
  background-position: center;
}
.re05-hero-overlay {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 100%);
}
.re05-hero-content {
  position: relative;
  z-index: 10;
  max-width: 650px;
  color: #ffffff;
}
.re05-hero h1 {
  font-size: 3.5rem;
  line-height: 1.1;
  margin-bottom: 24px;
  font-weight: 700;
}
.re05-hero p {
  font-size: 1.2rem;
  line-height: 1.6;
  margin-bottom: 32px;
  opacity: 0.9;
}
.re05-hero-buttons {
  display: flex;
  gap: 16px;
}

/* Stats */
.re05-stats {
  background-color: var(--secondary);
  color: #fff;
  padding: 40px 0;
}
.re05-stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  text-align: center;
}
.re05-stat-item h3 {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--primary);
  margin: 0 0 8px 0;
}
.re05-stat-item p {
  margin: 0;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  opacity: 0.8;
}

/* About */
.re05-about-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
  align-items: center;
}
.re05-section-title {
  font-size: 2.5rem;
  margin-bottom: 24px;
  color: var(--secondary, #111111);
  font-weight: 700;
}
.re05-section-subtitle {
  color: var(--primary, #6366f1);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  font-size: 0.875rem;
  margin-bottom: 12px;
  display: block;
}
.re05-about-text p {
  font-size: 1.1rem;
  line-height: 1.7;
  color: #4b5563;
  margin-bottom: 24px;
}
.re05-about-image img {
  width: 100%;
  border-radius: 8px;
  box-shadow: none;
}

/* Properties */
.re05-properties-header {
  text-align: center;
  margin-bottom: 48px;
}
.re05-properties-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
}
.re05-property-card {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: none;
  transition: transform 0.3s, box-shadow 0.3s;
}
.re05-property-card:hover {
  transform: translateY(-5px);
  box-shadow: none;
}
.re05-property-img {
  width: 100%;
  height: 240px;
  object-fit: cover;
  position: relative;
}
.re05-property-badge {
  position: absolute;
  top: 16px;
  left: 16px;
  background: var(--primary);
  color: #fff;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
}
.re05-property-content {
  padding: 24px;
}
.re05-property-price {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--secondary, #111111);
  margin-bottom: 8px;
}
.re05-property-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #111111;
  margin-bottom: 12px;
}
.re05-property-address {
  color: #6b7280;
  font-size: 0.9rem;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.re05-property-features {
  display: flex;
  justify-content: space-between;
  border-top: 1px solid #e5e7eb;
  padding-top: 16px;
}
.re05-feature {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #4b5563;
  font-size: 0.9rem;
}

/* Services */
.re05-services-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
}
.re05-service-card {
  padding: 40px 32px;
  background: #fff;
  border-radius: 8px;
  text-align: center;
  border: 1px solid #e5e7eb;
  transition: all 0.3s;
}
.re05-service-card:hover {
  border-color: var(--primary);
  box-shadow: none;
}
.re05-service-icon {
  width: 64px;
  height: 64px;
  background: rgba(var(--primary-rgb), 0.1);
  color: var(--primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
}
.re05-service-card h3 {
  font-size: 1.25rem;
  margin-bottom: 16px;
  color: var(--secondary, #111111);
}
.re05-service-card p {
  color: #6b7280;
  line-height: 1.6;
}

/* How It Works */
.re05-steps {
  display: flex;
  justify-content: space-between;
  position: relative;
}
.re05-steps::before {
  content: '';
  position: absolute;
  top: 40px;
  left: 10%;
  right: 10%;
  height: 2px;
  background: #e5e7eb;
  z-index: 1;
}
.re05-step {
  text-align: center;
  position: relative;
  z-index: 2;
  width: 25%;
}
.re05-step-number {
  width: 80px;
  height: 80px;
  background: #fff;
  border: 2px solid var(--primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary);
  margin: 0 auto 24px;
}
.re05-step h3 {
  font-size: 1.1rem;
  margin-bottom: 12px;
  color: var(--secondary, #111111);
}
.re05-step p {
  color: #6b7280;
  font-size: 0.95rem;
}

/* Testimonials */
.re05-testimonials-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
}
.re05-testimonial-card {
  background: #fff;
  padding: 32px;
  border-radius: 8px;
  box-shadow: none;
}
.re05-quote-icon {
  color: var(--primary);
  opacity: 0.2;
  margin-bottom: 16px;
}
.re05-testimonial-card p {
  font-size: 1rem;
  line-height: 1.6;
  color: #4b5563;
  margin-bottom: 24px;
  font-style: italic;
}
.re05-client {
  display: flex;
  align-items: center;
  gap: 16px;
}
.re05-client img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}
.re05-client h4 {
  margin: 0 0 4px 0;
  color: var(--secondary, #111111);
}
.re05-client span {
  font-size: 0.85rem;
  color: #9ca3af;
}

/* Team */
.re05-team-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}
.re05-team-card {
  text-align: center;
}
.re05-team-img {
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 16px;
}
.re05-team-card h3 {
  margin: 0 0 8px 0;
  color: var(--secondary, #111111);
}
.re05-team-card p {
  color: var(--primary, #6366f1);
  font-weight: 500;
  margin: 0 0 16px 0;
}
.re05-social {
  display: flex;
  justify-content: center;
  gap: 12px;
}
.re05-social a {
  color: #9ca3af;
  transition: color 0.3s;
}
.re05-social a:hover {
  color: var(--primary);
}

/* FAQ */
.re05-faq-container {
  max-width: 800px;
  margin: 0 auto;
}
.re05-faq-item {
  background: #ffffff;
  border-radius: 8px;
  box-shadow: none;
  margin-bottom: 16px;
  overflow: hidden;
}
.re05-faq-question {
  padding: 24px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  list-style: none; /* Hide default arrow */
}
.re05-faq-question::-webkit-details-marker {
  display: none; /* Hide default arrow in webkit */
}
.re05-faq-question h4 {
  margin: 0;
  font-size: 1.1rem;
  color: var(--secondary, #111111);
}
.re05-faq-question svg {
  transition: transform 0.3s;
}
.re05-faq-item[open] .re05-faq-question svg {
  transform: rotate(180deg);
}
.re05-faq-answer {
  padding: 0 24px 24px;
  color: #6b7280;
  line-height: 1.7;
}

/* Form Section */
.re05-form-section {
  position: relative;
  padding: 100px 0;
}
.re05-form-bg {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background-image: url('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80');
  background-size: cover;
  background-attachment: fixed;
}
.re05-form-overlay {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(var(--secondary-rgb), 0.9);
}
.re05-form-wrapper {
  position: relative;
  z-index: 10;
  background: #fff;
  border-radius: 12px;
  padding: 48px;
  max-width: 600px;
  margin: 0 auto;
  box-shadow: none;
}
.re05-form-wrapper h2 {
  text-align: center;
  margin-bottom: 8px;
}
.re05-form-wrapper p {
  text-align: center;
  color: #6b7280;
  margin-bottom: 32px;
}
.re05-form-group {
  margin-bottom: 20px;
}
.re05-form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #374151;
}
.re05-form-control {
  width: 100%;
  padding: 14px 16px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-family: inherit;
  font-size: 1rem;
  transition: border-color 0.3s;
}
.re05-form-control:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: none;
}
.re05-form-submit {
  width: 100%;
  padding: 16px;
  background: var(--primary);
  color: #fff;
  border: 1px solid #eee;
  border-radius: 6px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.3s;
}
.re05-form-submit:hover {
  opacity: 0.9;
}

/* Footer */
.re05-footer {
  background: #111827;
  color: #9ca3af;
  padding: 80px 0 24px;
}
.re05-footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1.5fr;
  gap: 48px;
  margin-bottom: 48px;
}
.re05-footer-col h4 {
  color: #fff;
  font-size: 1.1rem;
  margin-bottom: 24px;
}
.re05-footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}
.re05-footer-links li {
  margin-bottom: 12px;
}
.re05-footer-links a {
  color: #9ca3af;
  text-decoration: none;
  transition: color 0.3s;
}
.re05-footer-links a:hover {
  color: var(--primary);
}
.re05-footer-bottom {
  text-align: center;
  padding-top: 24px;
  border-top: 1px solid #374151;
  font-size: 0.9rem;
}

@media (max-width: 1024px) {
  .re05-steps::before { display: none; }
  .re05-steps { flex-direction: column; gap: 32px; }
  .re05-step { width: 100%; }
  
  /* Make 3 and 4 column grids scale down to 2 columns on tablet */
  .re05-properties-grid,
  .re05-services-grid,
  .re05-team-grid,
  .re05-footer-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 768px) {
  .re05-about-grid,
  .re05-properties-grid,
  .re05-services-grid,
  .re05-testimonials-grid,
  .re05-footer-grid {
    grid-template-columns: 1fr;
  }
  .re05-stats-grid { grid-template-columns: 1fr 1fr; }
  .re05-team-grid { grid-template-columns: 1fr 1fr; }
  .re05-hero h1 { font-size: 2.5rem; }
  .re05-nav { display: none; }
}
@media (max-width: 480px) {
  .re05-stats-grid,
  .re05-team-grid { grid-template-columns: 1fr; }
  .re05-hero-buttons { flex-direction: column; }
}
`;

export const realEstate05Html = `
<div class="re05-wrap">
<header class="re05-header">
    <div class="re05-container">
      <div class="re05-logo">
        LOGO_PLACEHOLDER
      </div>
     
      <a href="#contact" class="re05-btn-primary" style="padding: 10px 20px;">Get Valuation</a>
    </div>
  </header>
<section class="re05-split-hero" style="display: flex; min-height: 90vh; background-color: #000; color: #fff;">
    <div style="flex: 1; padding: 100px 80px; display: flex; flex-direction: column; justify-content: center;">
      <h1 style="font-size: 4.5rem; font-weight: 900; text-transform: uppercase; letter-spacing: -2px; margin-bottom: 30px; line-height: 1;">The New Standard.</h1>
      <p style="font-size: 1.4rem; color: #888; margin-bottom: 50px; max-width: 500px;">Minimalist aesthetics. Maximum impact. Find your perfect space in the urban jungle.</p>
      <div style="display: flex; gap: 20px;">
        <a href="#properties" style="padding: 20px 40px; background: #fff; color: #000; text-decoration: none; font-weight: bold; font-size: 1.1rem;">Properties</a>
        <a href="#about" style="padding: 20px 40px; border: 2px solid #fff; color: #fff; text-decoration: none; font-weight: bold; font-size: 1.1rem;">Our Story</a>
      </div>
    </div>
    <div style="flex: 1; background-image: url('https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'); background-size: cover; background-position: center;"></div>
  </section>
<section class="re05-stats">
    <div class="re05-container">
      <div class="re05-stats-grid">
        <div class="re05-stat-item">
          <h3>$2B+</h3>
          <p>Sales Volume</p>
        </div>
        <div class="re05-stat-item">
          <h3>5K+</h3>
          <p>Happy Clients</p>
        </div>
        <div class="re05-stat-item">
          <h3>98%</h3>
          <p>Success Rate</p>
        </div>
        <div class="re05-stat-item">
          <h3>20+</h3>
          <p>Years Experience</p>
        </div>
      </div>
    </div>
  </section>

  <section id="about" style="padding: 100px 24px; display: grid; grid-template-columns: 1fr 1fr; gap: 80px; max-width: 1200px; margin: 0 auto; align-items: center;">
    <div>
      <h2 style="font-size: 4rem; font-weight: 900; margin-bottom: 30px; line-height: 1; text-transform: uppercase;">Built on<br>Trust.</h2>
      <p style="font-size: 1.2rem; color: #666; margin-bottom: 30px;">We don't just sell houses. We orchestrate massive life changes with precision, speed, and unyielding dedication.</p>
      <div style="display: flex; gap: 40px; margin-top: 50px;">
        <div>
          <div style="font-size: 3rem; font-weight: 900;">$2B+</div>
          <div style="color: #888; font-weight: bold; text-transform: uppercase;">Sales Volume</div>
        </div>
        <div>
          <div style="font-size: 3rem; font-weight: 900;">15+</div>
          <div style="color: #888; font-weight: bold; text-transform: uppercase;">Years Exp.</div>
        </div>
      </div>
    </div>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
      <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" style="width: 100%; height: 400px; object-fit: cover;">
      <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" style="width: 100%; height: 300px; object-fit: cover; margin-top: 100px;">
    </div>
  </section>
<section id="contact" class="re05-form-section">
    <div class="re05-form-bg"></div>
    <div class="re05-form-overlay"></div>
    <div class="re05-container">
      <div class="re05-form-wrapper">
        <h2>Schedule a Consultation</h2>
        <p>Speak with one of our luxury property experts today.</p>
        <form>
          <div class="re05-form-group">
            <label>Full Name</label>
            <input type="text" class="re05-form-control" placeholder="Jane Doe">
          </div>
          <div class="re05-form-group">
            <label>Email Address</label>
            <input type="email" class="re05-form-control" placeholder="jane@example.com">
          </div>
          <div class="re05-form-group">
            <label>Phone Number</label>
            <input type="tel" class="re05-form-control" placeholder="(555) 123-4567">
          </div>
          <div class="re05-form-group">
            <label>I am interested in:</label>
            <select class="re05-form-control">
              <option>Buying a Property</option>
              <option>Selling a Property</option>
              <option>Property Management</option>
              <option>General Inquiry</option>
            </select>
          </div>
          <button type="submit" class="re05-form-submit">Request Consultation</button>
        </form>
      </div>
    </div>
  </section>
<section id="properties" class="re05-section">
    <div class="re05-container">
      <div class="re05-properties-header">
        <span class="re05-section-subtitle">Exclusive Listings</span>
        <h2 class="re05-section-title">Featured Properties</h2>
      </div>
      <div class="re05-properties-grid">
        <!-- Property 1 -->
        <div class="re05-property-card">
          <div class="re05-property-img">
            <span class="re05-property-badge">For Sale</span>
            <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Villa" style="width:100%; height:100%; object-fit:cover;">
          </div>
          <div class="re05-property-content">
            <div class="re05-property-price">$4,250,000</div>
            <h3 class="re05-property-title">Modern Architectural Masterpiece</h3>
            <div class="re05-property-address">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              Beverly Hills, California
            </div>
            <div class="re05-property-features">
              <div class="re05-feature"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg> 5 Beds</div>
              <div class="re05-feature"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12h20M12 2v20"></path></svg> 6 Baths</div>
              <div class="re05-feature"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"></rect></svg> 6,200 Sq Ft</div>
            </div>
          </div>
        </div>
        <!-- Property 2 -->
        <div class="re05-property-card">
          <div class="re05-property-img">
            <span class="re05-property-badge">Just Listed</span>
            <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Villa" style="width:100%; height:100%; object-fit:cover;">
          </div>
          <div class="re05-property-content">
            <div class="re05-property-price">$2,850,000</div>
            <h3 class="re05-property-title">Contemporary Waterfront Estate</h3>
            <div class="re05-property-address">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              Miami Beach, Florida
            </div>
            <div class="re05-property-features">
              <div class="re05-feature"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg> 4 Beds</div>
              <div class="re05-feature"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12h20M12 2v20"></path></svg> 4.5 Baths</div>
              <div class="re05-feature"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"></rect></svg> 4,500 Sq Ft</div>
            </div>
          </div>
        </div>
        <!-- Property 3 -->
        <div class="re05-property-card">
          <div class="re05-property-img">
            <span class="re05-property-badge" style="background:#111827;">Sold</span>
            <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Villa" style="width:100%; height:100%; object-fit:cover; filter: grayscale(50%);">
          </div>
           <div class="re05-property-content">
            <div class="re05-property-price">$4,250,000</div>
            <h3 class="re05-property-title">Modern Architectural Masterpiece</h3>
            <div class="re05-property-address">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              Beverly Hills, California
            </div>
            <div class="re05-property-features">
              <div class="re05-feature"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg> 5 Beds</div>
              <div class="re05-feature"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12h20M12 2v20"></path></svg> 6 Baths</div>
              <div class="re05-feature"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"></rect></svg> 6,200 Sq Ft</div>
            </div>
          </div>
        </div>
      </div>
      <div style="text-align: center; margin-top: 48px;">
        <a href="#" class="re05-btn-outline">View All Properties</a>
      </div>
    </div>
  </section>
<section id="team" class="re05-section">
    <div class="re05-container">
      <div class="re05-properties-header">
        <span class="re05-section-subtitle">Our Professionals</span>
        <h2 class="re05-section-title">Meet The Agents</h2>
      </div>
      <div class="re05-team-grid">
        <div class="re05-team-card">
          <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="Agent" class="re05-team-img">
          <h3>Michael Sterling</h3>
          <p>Managing Director</p>
          
        </div>
        <div class="re05-team-card">
          <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="Agent" class="re05-team-img">
          <h3>Elena Rodriguez</h3>
          <p>Luxury Sales Specialist</p>
          
        </div>
        <div class="re05-team-card">
          <img src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="Agent" class="re05-team-img">
          <h3>David Chen</h3>
          <p>Commercial Director</p>
          
        </div>
        <div class="re05-team-card">
          <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="Agent" class="re05-team-img">
          <h3>Olivia Bennett</h3>
          <p>Relocation Expert</p>
          
        </div>
      </div>
    </div>
  </section>

  <!-- Text-Heavy Market Report Section -->
  <section class="re05-market-report" style="padding: 100px 10%; background: #ffffff;">
    <div style="max-width: 1000px; margin: 0 auto;">
      <h2 style="font-size: 2.8rem; font-weight: 300; margin-bottom: 30px; color: #111;">Annual Market Insights & Specifications</h2>
      <p style="font-size: 1.2rem; color: #555; line-height: 1.8; margin-bottom: 40px;">Our comprehensive analysis provides deep insights into current market trends, architectural specifications, and long-term investment viability. We prioritize empirical data and qualitative assessment to ensure our clients make informed decisions.</p>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 40px; margin-bottom: 50px;">
        <div>
          <h3 style="font-size: 1.5rem; color: var(--primary); margin-bottom: 15px;">Zoning & Compliance</h3>
          <p style="color: #666; line-height: 1.7;">All properties undergo a rigorous 14-point inspection process, ensuring complete compliance with local zoning ordinances, structural integrity guidelines, and environmental impact assessments.</p>
        </div>
        <div>
          <h3 style="font-size: 1.5rem; color: var(--primary); margin-bottom: 15px;">Investment Yields</h3>
          <p style="color: #666; line-height: 1.7;">Historical data demonstrates a consistent 8.4% annualized appreciation within this sector. Our predictive models anticipate sustained growth driven by infrastructural developments and limited inventory.</p>
        </div>
      </div>
      
      <table style="width: 100%; border-collapse: collapse; text-align: left; background: var(--bg-light); border-radius: 10px; overflow: hidden;">
        <thead style="background: var(--primary); color: #fff;">
          <tr>
            <th style="padding: 20px;">Category</th>
            <th style="padding: 20px;">Specification Details</th>
            <th style="padding: 20px;">Market Standard</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom: 1px solid #ddd;">
            <td style="padding: 20px; font-weight: bold;">Structural</td>
            <td style="padding: 20px; color: #555;">Steel-reinforced concrete, seismic dampening</td>
            <td style="padding: 20px; color: #555;">Standard timber frame</td>
          </tr>
          <tr style="border-bottom: 1px solid #ddd;">
            <td style="padding: 20px; font-weight: bold;">Energy Efficiency</td>
            <td style="padding: 20px; color: #555;">LEED Platinum Certified, Solar-ready</td>
            <td style="padding: 20px; color: #555;">Basic Title 24</td>
          </tr>
          <tr>
            <td style="padding: 20px; font-weight: bold;">Smart Home</td>
            <td style="padding: 20px; color: #555;">Fully integrated biometric and climate control</td>
            <td style="padding: 20px; color: #555;">Standalone thermostats</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>

  <!-- Deep FAQ Section -->
  <section class="re05-deep-faq" style="padding: 100px 10%; background: #f8fafc;">
    <div style="max-width: 800px; margin: 0 auto;">
      <h2 style="font-size: 2.5rem; margin-bottom: 50px; text-align: center; color: #111;">Frequently Asked Questions</h2>
      
      <div style="margin-bottom: 30px; background: #fff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
        <h4 style="font-size: 1.3rem; color: #222; margin-bottom: 15px;">What is the typical timeline for acquisition and closing?</h4>
        <p style="color: #666; line-height: 1.7;">From initial consultation to final closing, the process generally spans 45 to 60 days. This includes a 14-day due diligence period, a comprehensive structural appraisal, and title clearance. Expedited closings can be arranged for cash transactions.</p>
      </div>
      
      <div style="margin-bottom: 30px; background: #fff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
        <h4 style="font-size: 1.3rem; color: #222; margin-bottom: 15px;">Are there restrictions on international buyers?</h4>
        <p style="color: #666; line-height: 1.7;">International buyers are welcome. We partner with specialized legal counsel to navigate FIRPTA regulations and cross-border tax implications, ensuring a seamless acquisition process regardless of your primary residency.</p>
      </div>
      
      <div style="background: #fff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
        <h4 style="font-size: 1.3rem; color: #222; margin-bottom: 15px;">What post-purchase services do you provide?</h4>
        <p style="color: #666; line-height: 1.7;">Our relationship extends far beyond closing. We offer comprehensive estate management, including interior design curation, staffing, and seasonal maintenance coordination, ensuring your property is pristine upon your arrival.</p>
      </div>
    </div>
  </section>
  \n<footer class="re05-footer">
    <div class="re05-container">
      <div class="re05-footer-grid">
        <div class="re05-footer-col">
          <div style="margin-bottom: 24px;">LOGO_PLACEHOLDER</div>
          <p style="line-height: 1.6; margin-bottom: 24px;">Setting the global standard in luxury real estate, providing unparalleled service and exclusive property access.</p>
        </div>
      
        <div class="re05-footer-col">
          <h4>Contact Us</h4>
          <ul class="re05-footer-links">
            <li>1 (800) 555-0199</li>
            <li>contact@luxuryrealestate.com</li>
            <li style="margin-top: 12px; line-height: 1.5;">450 N Beverly Dr<br>Beverly Hills, CA 90210</li>
          </ul>
        </div>
      </div>
      <div class="re05-footer-bottom">
        &copy; 2026 Luxury Real Estate Partners. All rights reserved. Equal Housing Opportunity.
      </div>
    </div>
  </footer>

</div>
`;
