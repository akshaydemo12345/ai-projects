export const realEstate01Styles = `
:root {
  --font-primary: 'Inter', sans-serif;
}

body {
  margin: 0;
  font-family: var(--font-primary);
  background-color: #ffffff;
  color: #1f2937;
}

.re01-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.re01-section {
  padding: 80px 0;
}

.re01-section-dark {
  background-color: var(--secondary);
  color: #ffffff;
}

.re01-section-light {
  background-color: #f9fafb;
}

.re01-text-primary { color: var(--primary); }
.re01-text-secondary { color: var(--secondary); }
.re01-bg-primary { background-color: var(--primary); }
.re01-bg-secondary { background-color: var(--secondary); }

.re01-btn-primary {
  display: inline-block;
  background-color: var(--primary);
  color: #ffffff;
  padding: 14px 28px;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
}
.re01-btn-primary:hover {
  opacity: 0.9;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(var(--primary-rgb), 0.3);
}

.re01-btn-outline {
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
.re01-btn-outline:hover {
  background-color: var(--primary);
  color: #ffffff;
}

/* Header */
.re01-header {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 50;
  padding: 24px 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 100%);
}
.re01-header .re01-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.re01-logo img {
  height: 40px;
  width: auto;
}
.re01-nav {
  display: flex;
  gap: 32px;
}
.re01-nav a {
  color: #ffffff;
  text-decoration: none;
  font-weight: 500;
  font-size: 15px;
  transition: color 0.3s;
}
.re01-nav a:hover {
  color: var(--primary);
}

/* Hero */
.re01-hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  background-image: url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80');
  background-size: cover;
  background-position: center;
}
.re01-hero-overlay {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 100%);
}
.re01-hero-content {
  position: relative;
  z-index: 10;
  max-width: 650px;
  color: #ffffff;
}
.re01-hero h1 {
  font-size: 3.5rem;
  line-height: 1.1;
  margin-bottom: 24px;
  font-weight: 700;
}
.re01-hero p {
  font-size: 1.2rem;
  line-height: 1.6;
  margin-bottom: 32px;
  opacity: 0.9;
}
.re01-hero-buttons {
  display: flex;
  gap: 16px;
}

/* Stats */
.re01-stats {
  background-color: var(--secondary);
  color: #fff;
  padding: 40px 0;
}
.re01-stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  text-align: center;
}
.re01-stat-item h3 {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--primary);
  margin: 0 0 8px 0;
}
.re01-stat-item p {
  margin: 0;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  opacity: 0.8;
}

/* About */
.re01-about-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
  align-items: center;
}
.re01-section-title {
  font-size: 2.5rem;
  margin-bottom: 24px;
  color: var(--secondary, #1f2937);
  font-weight: 700;
}
.re01-section-subtitle {
  color: var(--primary, #6366f1);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  font-size: 0.875rem;
  margin-bottom: 12px;
  display: block;
}
.re01-about-text p {
  font-size: 1.1rem;
  line-height: 1.7;
  color: #4b5563;
  margin-bottom: 24px;
}
.re01-about-image img {
  width: 100%;
  border-radius: 8px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
}

/* Properties */
.re01-properties-header {
  text-align: center;
  margin-bottom: 48px;
}
.re01-properties-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
}
.re01-property-card {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  transition: transform 0.3s, box-shadow 0.3s;
}
.re01-property-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 24px rgba(0,0,0,0.1);
}
.re01-property-img {
  width: 100%;
  height: 240px;
  object-fit: cover;
  position: relative;
}
.re01-property-badge {
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
.re01-property-content {
  padding: 24px;
}
.re01-property-price {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--secondary, #1f2937);
  margin-bottom: 8px;
}
.re01-property-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 12px;
}
.re01-property-address {
  color: #6b7280;
  font-size: 0.9rem;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.re01-property-features {
  display: flex;
  justify-content: space-between;
  border-top: 1px solid #e5e7eb;
  padding-top: 16px;
}
.re01-feature {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #4b5563;
  font-size: 0.9rem;
}

/* Services */
.re01-services-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
}
.re01-service-card {
  padding: 40px 32px;
  background: #fff;
  border-radius: 8px;
  text-align: center;
  border: 1px solid #e5e7eb;
  transition: all 0.3s;
}
.re01-service-card:hover {
  border-color: var(--primary);
  box-shadow: 0 10px 30px rgba(var(--primary-rgb), 0.1);
}
.re01-service-icon {
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
.re01-service-card h3 {
  font-size: 1.25rem;
  margin-bottom: 16px;
  color: var(--secondary, #1f2937);
}
.re01-service-card p {
  color: #6b7280;
  line-height: 1.6;
}

/* How It Works */
.re01-steps {
  display: flex;
  justify-content: space-between;
  position: relative;
}
.re01-steps::before {
  content: '';
  position: absolute;
  top: 40px;
  left: 10%;
  right: 10%;
  height: 2px;
  background: #e5e7eb;
  z-index: 1;
}
.re01-step {
  text-align: center;
  position: relative;
  z-index: 2;
  width: 25%;
}
.re01-step-number {
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
.re01-step h3 {
  font-size: 1.1rem;
  margin-bottom: 12px;
  color: var(--secondary, #1f2937);
}
.re01-step p {
  color: #6b7280;
  font-size: 0.95rem;
}

/* Testimonials */
.re01-testimonials-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
}
.re01-testimonial-card {
  background: #fff;
  padding: 32px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
}
.re01-quote-icon {
  color: var(--primary);
  opacity: 0.2;
  margin-bottom: 16px;
}
.re01-testimonial-card p {
  font-size: 1rem;
  line-height: 1.6;
  color: #4b5563;
  margin-bottom: 24px;
  font-style: italic;
}
.re01-client {
  display: flex;
  align-items: center;
  gap: 16px;
}
.re01-client img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}
.re01-client h4 {
  margin: 0 0 4px 0;
  color: var(--secondary, #1f2937);
}
.re01-client span {
  font-size: 0.85rem;
  color: #9ca3af;
}

/* Team */
.re01-team-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}
.re01-team-card {
  text-align: center;
}
.re01-team-img {
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 16px;
}
.re01-team-card h3 {
  margin: 0 0 8px 0;
  color: var(--secondary, #1f2937);
}
.re01-team-card p {
  color: var(--primary, #6366f1);
  font-weight: 500;
  margin: 0 0 16px 0;
}
.re01-social {
  display: flex;
  justify-content: center;
  gap: 12px;
}
.re01-social a {
  color: #9ca3af;
  transition: color 0.3s;
}
.re01-social a:hover {
  color: var(--primary);
}

/* FAQ */
.re01-faq-container {
  max-width: 800px;
  margin: 0 auto;
}
.re01-faq-item {
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.03);
  margin-bottom: 16px;
  overflow: hidden;
}
.re01-faq-question {
  padding: 24px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  list-style: none; /* Hide default arrow */
}
.re01-faq-question::-webkit-details-marker {
  display: none; /* Hide default arrow in webkit */
}
.re01-faq-question h4 {
  margin: 0;
  font-size: 1.1rem;
  color: var(--secondary, #1f2937);
}
.re01-faq-question svg {
  transition: transform 0.3s;
}
.re01-faq-item[open] .re01-faq-question svg {
  transform: rotate(180deg);
}
.re01-faq-answer {
  padding: 0 24px 24px;
  color: #6b7280;
  line-height: 1.7;
}

/* Form Section */
.re01-form-section {
  position: relative;
  padding: 100px 0;
}
.re01-form-bg {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background-image: url('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80');
  background-size: cover;
  background-attachment: fixed;
}
.re01-form-overlay {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(var(--secondary-rgb), 0.9);
}
.re01-form-wrapper {
  position: relative;
  z-index: 10;
  background: #fff;
  border-radius: 12px;
  padding: 48px;
  max-width: 600px;
  margin: 0 auto;
  box-shadow: 0 20px 40px rgba(0,0,0,0.2);
}
.re01-form-wrapper h2 {
  text-align: center;
  margin-bottom: 8px;
}
.re01-form-wrapper p {
  text-align: center;
  color: #6b7280;
  margin-bottom: 32px;
}
.re01-form-group {
  margin-bottom: 20px;
}
.re01-form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #374151;
}
.re01-form-control {
  width: 100%;
  padding: 14px 16px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-family: inherit;
  font-size: 1rem;
  transition: border-color 0.3s;
}
.re01-form-control:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(var(--primary-rgb), 0.1);
}
.re01-form-submit {
  width: 100%;
  padding: 16px;
  background: var(--primary);
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.3s;
}
.re01-form-submit:hover {
  opacity: 0.9;
}

/* Footer */
.re01-footer {
  background: #111827;
  color: #9ca3af;
  padding: 80px 0 24px;
}
.re01-footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1.5fr;
  gap: 48px;
  margin-bottom: 48px;
}
.re01-footer-col h4 {
  color: #fff;
  font-size: 1.1rem;
  margin-bottom: 24px;
}
.re01-footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}
.re01-footer-links li {
  margin-bottom: 12px;
}
.re01-footer-links a {
  color: #9ca3af;
  text-decoration: none;
  transition: color 0.3s;
}
.re01-footer-links a:hover {
  color: var(--primary);
}
.re01-footer-bottom {
  text-align: center;
  padding-top: 24px;
  border-top: 1px solid #374151;
  font-size: 0.9rem;
}

@media (max-width: 1024px) {
  .re01-steps::before { display: none; }
  .re01-steps { flex-direction: column; gap: 32px; }
  .re01-step { width: 100%; }
  
  /* Make 3 and 4 column grids scale down to 2 columns on tablet */
  .re01-properties-grid,
  .re01-services-grid,
  .re01-team-grid,
  .re01-footer-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 768px) {
  .re01-about-grid,
  .re01-properties-grid,
  .re01-services-grid,
  .re01-testimonials-grid,
  .re01-footer-grid {
    grid-template-columns: 1fr;
  }
  .re01-stats-grid { grid-template-columns: 1fr 1fr; }
  .re01-team-grid { grid-template-columns: 1fr 1fr; }
  .re01-hero h1 { font-size: 2.5rem; }
  .re01-nav { display: none; }
}
@media (max-width: 480px) {
  .re01-stats-grid,
  .re01-team-grid { grid-template-columns: 1fr; }
  .re01-hero-buttons { flex-direction: column; }
}
`;

export const realEstate01Html = `
<div class="re01-wrapper">
  <!-- 1. Header -->
  <header class="re01-header">
    <div class="re01-container">
      <div class="re01-logo">
        LOGO_PLACEHOLDER
      </div>
     
      <a href="javascript:void(0);" class="re01-btn-primary" style="padding: 10px 20px;">Get Valuation</a>
    </div>
  </header>

  <!-- 2. Hero -->
  <section class="re01-hero">
    <div class="re01-hero-overlay"></div>
    <div class="re01-container">
      <div class="re01-hero-content">
        <h1>Discover Your Perfect Luxury Home</h1>
        <p>Expert real estate services tailored to your lifestyle. We connect discerning buyers with exceptional properties worldwide.</p>
        <div class="re01-hero-buttons">
          <a href="javascript:void(0);" class="re01-btn-primary">View Listings</a>
          <a href="javascript:void(0);" class="re01-btn-outline" style="color: #fff; border-color: #fff;">Contact an Agent</a>
        </div>
      </div>
    </div>
  </section>

  <!-- 3. Stats -->
  <section class="re01-stats">
    <div class="re01-container">
      <div class="re01-stats-grid">
        <div class="re01-stat-item">
          <h3>$2B+</h3>
          <p>Sales Volume</p>
        </div>
        <div class="re01-stat-item">
          <h3>5K+</h3>
          <p>Happy Clients</p>
        </div>
        <div class="re01-stat-item">
          <h3>98%</h3>
          <p>Success Rate</p>
        </div>
        <div class="re01-stat-item">
          <h3>20+</h3>
          <p>Years Experience</p>
        </div>
      </div>
    </div>
  </section>

  <!-- 4. About -->
  <section id="about" class="re01-section re01-section-light">
    <div class="re01-container">
      <div class="re01-about-grid">
        <div class="re01-about-text">
          <span class="re01-section-subtitle">Our Heritage</span>
          <h2 class="re01-section-title">Elevating the Standard of Real Estate</h2>
          <p>Since 2005, we have been setting the benchmark for luxury real estate services. Our approach combines deep local market knowledge with a global reach, ensuring your property journey is seamless and successful.</p>
          <p>Whether you're acquiring a legacy estate or selling a modern masterpiece, our dedicated team of experts provides unparalleled discretion and results.</p>
          <a href="javascript:void(0);" class="re01-btn-primary" style="margin-top: 16px;">Meet Our Experts</a>
        </div>
        <div class="re01-about-image">
          <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Luxury Real Estate Interior">
        </div>
      </div>
    </div>
  </section>

  <!-- 5. Featured Properties -->
  <section id="properties" class="re01-section">
    <div class="re01-container">
      <div class="re01-properties-header">
        <span class="re01-section-subtitle">Exclusive Listings</span>
        <h2 class="re01-section-title">Featured Properties</h2>
      </div>
      <div class="re01-properties-grid">
        <!-- Property 1 -->
        <div class="re01-property-card">
          <div class="re01-property-img">
            <span class="re01-property-badge">For Sale</span>
            <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Villa" style="width:100%; height:100%; object-fit:cover;">
          </div>
          <div class="re01-property-content">
            <div class="re01-property-price">$4,250,000</div>
            <h3 class="re01-property-title">Modern Architectural Masterpiece</h3>
            <div class="re01-property-address">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              Beverly Hills, California
            </div>
            <div class="re01-property-features">
              <div class="re01-feature"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg> 5 Beds</div>
              <div class="re01-feature"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12h20M12 2v20"></path></svg> 6 Baths</div>
              <div class="re01-feature"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"></rect></svg> 6,200 Sq Ft</div>
            </div>
          </div>
        </div>
        <!-- Property 2 -->
        <div class="re01-property-card">
          <div class="re01-property-img">
            <span class="re01-property-badge">Just Listed</span>
            <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Villa" style="width:100%; height:100%; object-fit:cover;">
          </div>
          <div class="re01-property-content">
            <div class="re01-property-price">$2,850,000</div>
            <h3 class="re01-property-title">Contemporary Waterfront Estate</h3>
            <div class="re01-property-address">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              Miami Beach, Florida
            </div>
            <div class="re01-property-features">
              <div class="re01-feature"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg> 4 Beds</div>
              <div class="re01-feature"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12h20M12 2v20"></path></svg> 4.5 Baths</div>
              <div class="re01-feature"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"></rect></svg> 4,500 Sq Ft</div>
            </div>
          </div>
        </div>
        <!-- Property 3 -->
        <div class="re01-property-card">
          <div class="re01-property-img">
            <span class="re01-property-badge" style="background:#111827;">Sold</span>
            <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Villa" style="width:100%; height:100%; object-fit:cover; filter: grayscale(50%);">
          </div>
           <div class="re01-property-content">
            <div class="re01-property-price">$4,250,000</div>
            <h3 class="re01-property-title">Modern Architectural Masterpiece</h3>
            <div class="re01-property-address">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              Beverly Hills, California
            </div>
            <div class="re01-property-features">
              <div class="re01-feature"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg> 5 Beds</div>
              <div class="re01-feature"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12h20M12 2v20"></path></svg> 6 Baths</div>
              <div class="re01-feature"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"></rect></svg> 6,200 Sq Ft</div>
            </div>
          </div>
        </div>
      </div>
      <div style="text-align: center; margin-top: 48px;">
        <a href="javascript:void(0);" class="re01-btn-outline">View All Properties</a>
      </div>
    </div>
  </section>

  <!-- 6. Services -->
  <section id="services" class="re01-section re01-section-light">
    <div class="re01-container">
      <div class="re01-properties-header">
        <span class="re01-section-subtitle">Our Expertise</span>
        <h2 class="re01-section-title">Comprehensive Real Estate Services</h2>
      </div>
      <div class="re01-services-grid">
        <div class="re01-service-card">
          <div class="re01-service-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
          </div>
          <h3>Property Sales</h3>
          <p>Strategic marketing and expert negotiation to ensure your property sells for its maximum value in the shortest time.</p>
        </div>
        <div class="re01-service-card">
          <div class="re01-service-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </div>
          <h3>Buyer Representation</h3>
          <p>Exclusive access to off-market listings and personalized property tours tailored to your exact specifications.</p>
        </div>
        <div class="re01-service-card">
          <div class="re01-service-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
          </div>
          <h3>Property Management</h3>
          <p>Comprehensive white-glove management services for luxury estates and investment portfolios.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- 7. How it Works -->
  <section class="re01-section">
    <div class="re01-container">
      <div class="re01-properties-header">
        <span class="re01-section-subtitle">The Process</span>
        <h2 class="re01-section-title">How We Work With You</h2>
      </div>
      <div class="re01-steps">
        <div class="re01-step">
          <div class="re01-step-number">1</div>
          <h3>Consultation</h3>
          <p>We discuss your goals, preferences, and timeline in a confidential meeting.</p>
        </div>
        <div class="re01-step">
          <div class="re01-step-number">2</div>
          <h3>Strategy</h3>
          <p>Developing a tailored marketing or acquisition plan based on market data.</p>
        </div>
        <div class="re01-step">
          <div class="re01-step-number">3</div>
          <h3>Execution</h3>
          <p>Implementing the strategy with our network of professionals and buyers.</p>
        </div>
        <div class="re01-step">
          <div class="re01-step-number">4</div>
          <h3>Closing</h3>
          <p>Seamless negotiation and paperwork handling through to a successful close.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- 8. Testimonials -->
  <section class="re01-section re01-section-light">
    <div class="re01-container">
      <div class="re01-properties-header">
        <span class="re01-section-subtitle">Client Stories</span>
        <h2 class="re01-section-title">What Our Clients Say</h2>
      </div>
      <div class="re01-testimonials-grid">
        <div class="re01-testimonial-card">
          <div class="re01-quote-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>
          </div>
          <p>"The team's market knowledge and negotiation skills helped us secure our dream home well under asking price. Truly exceptional service from start to finish."</p>
          <div class="re01-client">
            <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" alt="Client">
            <div>
              <h4>James Harrison</h4>
              <span>Property Buyer</span>
            </div>
          </div>
        </div>
        <div class="re01-testimonial-card">
          <div class="re01-quote-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>
          </div>
          <p>"Selling a luxury estate requires a specific network. Their marketing reach was incredible, bringing in international buyers and closing in record time."</p>
          <div class="re01-client">
            <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" alt="Client">
            <div>
              <h4>Sarah Jenkins</h4>
              <span>Property Seller</span>
            </div>
          </div>
        </div>
        <div class="re01-testimonial-card">
          <div class="re01-quote-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>
          </div>
          <p>"Their property management division gives me complete peace of mind. My investment portfolio has never performed better. Highly recommended."</p>
          <div class="re01-client">
            <img src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" alt="Client">
            <div>
              <h4>Robert Chen</h4>
              <span>Real Estate Investor</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- 9. Team -->
  <section id="team" class="re01-section">
    <div class="re01-container">
      <div class="re01-properties-header">
        <span class="re01-section-subtitle">Our Professionals</span>
        <h2 class="re01-section-title">Meet The Agents</h2>
      </div>
      <div class="re01-team-grid">
        <div class="re01-team-card">
          <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="Agent" class="re01-team-img">
          <h3>Michael Sterling</h3>
          <p>Managing Director</p>
          <div class="re01-social">
            <a href="javascript:void(0);"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg></a>
            <a href="javascript:void(0);"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg></a>
          </div>
        </div>
        <div class="re01-team-card">
          <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="Agent" class="re01-team-img">
          <h3>Elena Rodriguez</h3>
          <p>Luxury Sales Specialist</p>
          <div class="re01-social">
            <a href="javascript:void(0);"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg></a>
          </div>
        </div>
        <div class="re01-team-card">
          <img src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="Agent" class="re01-team-img">
          <h3>David Chen</h3>
          <p>Commercial Director</p>
          <div class="re01-social">
            <a href="javascript:void(0);"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg></a>
          </div>
        </div>
        <div class="re01-team-card">
          <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="Agent" class="re01-team-img">
          <h3>Olivia Bennett</h3>
          <p>Relocation Expert</p>
          <div class="re01-social">
            <a href="javascript:void(0);"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg></a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- 10. FAQ -->
  <section class="re01-section re01-section-light">
    <div class="re01-container">
      <div class="re01-properties-header">
        <span class="re01-section-subtitle">Common Questions</span>
        <h2 class="re01-section-title">Frequently Asked Questions</h2>
      </div>
      <div class="re01-faq-container">
        <details class="re01-faq-item">
          <summary class="re01-faq-question">
            <h4>What is your commission rate for selling a property?</h4>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"></path></svg>
          </summary>
          <div class="re01-faq-answer">
            Our rates are competitive and scale based on the property value and the marketing package selected. We discuss this transparently during our initial consultation.
          </div>
        </details>
        <details class="re01-faq-item">
          <summary class="re01-faq-question">
            <h4>Do you handle international relocations?</h4>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"></path></svg>
          </summary>
          <div class="re01-faq-answer">
            Yes, we have a dedicated international desk that handles cross-border transactions, providing legal, tax, and logistical support for overseas buyers and investors.
          </div>
        </details>
        <details class="re01-faq-item">
          <summary class="re01-faq-question">
            <h4>How do you market luxury properties?</h4>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"></path></svg>
          </summary>
          <div class="re01-faq-answer">
            We deploy high-end photography, virtual tours, and targeted digital campaigns to present your property to the right global audience.
          </div>
        </details>
        <details class="re01-faq-item">
          <summary class="re01-faq-question">
            <h4>Can you assist with financing options?</h4>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"></path></svg>
          </summary>
          <div class="re01-faq-answer">
            Absolutely. We have established relationships with premier financial institutions to secure the best mortgage rates for our clients.
          </div>
        </details>
      </div>
    </div>
  </section>

  <!-- 11. Form / CTA -->
  <section id="contact" class="re01-form-section">
    <div class="re01-form-bg"></div>
    <div class="re01-form-overlay"></div>
    <div class="re01-container">
      <div class="re01-form-wrapper">
        <h2>Schedule a Consultation</h2>
        <p>Speak with one of our luxury property experts today.</p>
        <form>
          <div class="re01-form-group">
            <label>Full Name</label>
            <input type="text" class="re01-form-control" placeholder="Jane Doe">
          </div>
          <div class="re01-form-group">
            <label>Email Address</label>
            <input type="email" class="re01-form-control" placeholder="jane@example.com">
          </div>
          <div class="re01-form-group">
            <label>Phone Number</label>
            <input type="tel" class="re01-form-control" placeholder="(555) 123-4567">
          </div>
          <div class="re01-form-group">
            <label>I am interested in:</label>
            <select class="re01-form-control">
              <option>Buying a Property</option>
              <option>Selling a Property</option>
              <option>Property Management</option>
              <option>General Inquiry</option>
            </select>
          </div>
          <button type="submit" class="re01-form-submit">Request Consultation</button>
        </form>
      </div>
    </div>
  </section>

  <!-- 12. Footer -->
  <footer class="re01-footer">
    <div class="re01-container">
      <div class="re01-footer-grid">
        <div class="re01-footer-col">
          <div style="margin-bottom: 24px;">LOGO_PLACEHOLDER</div>
          <p style="line-height: 1.6; margin-bottom: 24px;">Setting the global standard in luxury real estate, providing unparalleled service and exclusive property access.</p>
        </div>
      
        <div class="re01-footer-col">
          <h4>Contact Us</h4>
          <ul class="re01-footer-links">
            <li>1 (800) 555-0199</li>
            <li>contact@luxuryrealestate.com</li>
            <li style="margin-top: 12px; line-height: 1.5;">450 N Beverly Dr<br>Beverly Hills, CA 90210</li>
          </ul>
        </div>
      </div>
      <div class="re01-footer-bottom">
        &copy; 2026 Luxury Real Estate Partners. All rights reserved. Equal Housing Opportunity.
      </div>
    </div>
  </footer>
</div>
`
