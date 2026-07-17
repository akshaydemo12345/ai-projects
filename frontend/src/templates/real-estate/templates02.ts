export const realEstate02Styles = `
:root {
  --font-base: 'Roboto', sans-serif;
  --font-heading: 'Playfair Display', serif;
}

body {
  margin: 0;
  font-family: var(--font-base);
  background-color: #fcfcfc;
  color: #333333;
}

.re02-wrap {
  max-width: 1440px;
  margin: 0 auto;
  overflow: hidden;
}

.re02-container {
  max-width: 1140px;
  margin: 0 auto;
  padding: 0 30px;
}

.re02-section {
  padding: 100px 0;
}

.re02-bg-white { background-color: #ffffff; }
.re02-bg-gray { background-color: #f5f7fa; }

/* Typography */
h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading);
  color: var(--secondary, #1a1a1a);
  margin-top: 0;
}

.re02-title-main {
  font-size: 3rem;
  line-height: 1.2;
  margin-bottom: 20px;
}

.re02-title-section {
  font-size: 2.5rem;
  margin-bottom: 15px;
  text-align: center;
}

.re02-subtitle-section {
  color: var(--primary, #6366f1);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-size: 0.85rem;
  text-align: center;
  display: block;
  margin-bottom: 10px;
}

.re02-text-lead {
  font-size: 1.15rem;
  color: #666;
  line-height: 1.8;
  margin-bottom: 30px;
}

/* Buttons */
.re02-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 15px 35px;
  font-family: var(--font-base);
  font-weight: 600;
  font-size: 1rem;
  letter-spacing: 0.5px;
  text-decoration: none;
  border-radius: 0;
  transition: all 0.3s ease;
  cursor: pointer;
}

.re02-btn-primary {
  background-color: var(--primary);
  color: #ffffff;
  border: 2px solid var(--primary);
}
.re02-btn-primary:hover {
  background-color: transparent;
  color: var(--primary);
}

.re02-btn-secondary {
  background-color: transparent;
  color: var(--secondary);
  border: 2px solid var(--secondary);
}
.re02-btn-secondary:hover {
  background-color: var(--secondary);
  color: #ffffff;
}

/* 1. Header */
.re02-header {
  padding: 20px 0;
  background-color: #ffffff;
  border-bottom: 1px solid #eaeaea;
  position: sticky;
  top: 0;
  z-index: 100;
}
.re02-header-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.re02-logo {
  font-family: var(--font-heading);
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--secondary, #1a1a1a);
  text-decoration: none;
}
.re02-nav-menu {
  display: flex;
  gap: 40px;
}
.re02-nav-menu a {
  color: #555;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: color 0.3s;
}
.re02-nav-menu a:hover {
  color: var(--primary);
}

/* 2. Hero Split */
.re02-hero {
  display: flex;
  min-height: calc(100vh - 80px);
  background-color: #ffffff;
}
.re02-hero-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 8% 0 10%;
}
.re02-hero-image {
  flex: 1;
  background-image: url('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80');
  background-size: cover;
  background-position: center;
  position: relative;
}
.re02-hero-image::after {
  content: '';
  position: absolute;
  bottom: 0; left: 0;
  width: 100%; height: 30%;
  background: linear-gradient(to top, rgba(0,0,0,0.4), transparent);
}
.re02-hero-btns {
  display: flex;
  gap: 20px;
  margin-top: 10px;
}

/* 3. Trust Logos */
.re02-trust {
  padding: 50px 0;
  border-bottom: 1px solid #eaeaea;
}
.re02-trust-flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
  opacity: 0.6;
  filter: grayscale(100%);
  flex-wrap: wrap;
  gap: 30px;
}
.re02-trust-flex img {
  height: 40px;
  object-fit: contain;
}

/* 4. Why Choose Us (Icon Grid) */
.re02-features-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 40px;
  margin-top: 60px;
}
.re02-feature {
  text-align: center;
}
.re02-feature-icon {
  width: 70px;
  height: 70px;
  margin: 0 auto 20px;
  border: 1px solid var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: var(--primary);
  transition: all 0.3s;
}
.re02-feature:hover .re02-feature-icon {
  background-color: var(--primary);
  color: #fff;
}
.re02-feature h3 {
  font-size: 1.2rem;
  margin-bottom: 15px;
}
.re02-feature p {
  color: #666;
  font-size: 0.95rem;
  line-height: 1.6;
}

/* 5. Featured Properties (Horizontal Cards) */
.re02-cards-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  margin-top: 50px;
}
.re02-prop-card {
  background: #ffffff;
  box-shadow: 0 15px 40px rgba(0,0,0,0.06);
  transition: transform 0.4s;
}
.re02-prop-card:hover {
  transform: translateY(-10px);
}
.re02-prop-img-wrap {
  position: relative;
  height: 280px;
  overflow: hidden;
}
.re02-prop-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s;
}
.re02-prop-card:hover .re02-prop-img {
  transform: scale(1.05);
}
.re02-prop-tag {
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: var(--secondary);
  color: #fff;
  padding: 8px 15px;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 1px;
}
.re02-prop-info {
  padding: 30px;
}
.re02-prop-price {
  color: var(--primary, #6366f1);
  font-size: 1.6rem;
  font-weight: 700;
  margin-bottom: 10px;
}
.re02-prop-title {
  font-size: 1.3rem;
  margin-bottom: 15px;
}
.re02-prop-meta {
  display: flex;
  gap: 20px;
  color: #777;
  font-size: 0.9rem;
  border-top: 1px solid #eee;
  padding-top: 20px;
}
.re02-meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 6. About Overlap */
.re02-about-wrap {
  display: flex;
  align-items: center;
  margin-top: 50px;
}
.re02-about-img-box {
  flex: 1;
  position: relative;
}
.re02-about-img {
  width: 90%;
  box-shadow: 20px 20px 0 var(--primary);
}
.re02-about-content {
  flex: 1;
  padding-left: 50px;
}

/* 7. The Process — Vertical Timeline */
.re02-process-section {
  padding: 120px 0;
  background-color: #f5f7fa;
}
.re02-process-header {
  text-align: center;
  margin-bottom: 70px;
}
.re02-timeline {
  position: relative;
  max-width: 900px;
  margin: 0 auto;
}
.re02-timeline::before {
  content: '';
  position: absolute;
  top: 0; bottom: 0; left: 50%;
  width: 1px;
  background-color: #dcdcdc;
  transform: translateX(-50%);
}
.re02-timeline-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 60px;
  position: relative;
}
.re02-timeline-item:last-child {
  margin-bottom: 0;
}
.re02-timeline-item:nth-child(even) {
  flex-direction: row-reverse;
}
.re02-timeline-content {
  width: 45%;
  background: #ffffff;
  padding: 40px;
  border-left: 4px solid var(--primary, #6366f1);
  box-shadow: 0 10px 40px rgba(0,0,0,0.04);
  position: relative;
}
.re02-timeline-item:nth-child(even) .re02-timeline-content {
  border-left: none;
  border-right: 4px solid var(--primary, #6366f1);
  text-align: right;
}
.re02-timeline-num {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  background: #ffffff;
  border: 1px solid #eaeaea;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-heading);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary, #6366f1);
  box-shadow: 0 5px 15px rgba(0,0,0,0.05);
  z-index: 2;
  transition: all 0.3s;
}
.re02-timeline-item:hover .re02-timeline-num {
  background: var(--primary, #6366f1);
  color: #ffffff;
  transform: translate(-50%, -50%) scale(1.1);
}
.re02-timeline-content h3 {
  font-size: 1.4rem;
  margin-bottom: 15px;
  color: var(--secondary, #1a1a1a);
}
.re02-timeline-content p {
  color: #666;
  line-height: 1.7;
  margin: 0;
}
@media (max-width: 768px) {
  .re02-timeline::before {
    left: 30px;
  }
  .re02-timeline-item, .re02-timeline-item:nth-child(even) {
    flex-direction: column;
    align-items: flex-start;
    padding-left: 80px;
  }
  .re02-timeline-content, .re02-timeline-item:nth-child(even) .re02-timeline-content {
    width: 100%;
    text-align: left;
    border-left: 4px solid var(--primary, #6366f1);
    border-right: none;
  }
  .re02-timeline-num {
    left: 30px;
    top: 50px;
  }
}

/* 8. Testimonials */
.re02-testi-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin-top: 60px;
}
.re02-testi-box {
  background: #fff;
  padding: 40px;
  border-left: 4px solid var(--primary);
  box-shadow: 0 5px 20px rgba(0,0,0,0.03);
}
.re02-testi-text {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #555;
  font-style: italic;
  margin-bottom: 30px;
}
.re02-testi-author {
  display: flex;
  align-items: center;
  gap: 15px;
}
.re02-testi-author img {
  width: 60px; height: 60px;
  border-radius: 50%;
  object-fit: cover;
}
.re02-testi-author h4 {
  margin: 0 0 5px 0;
  font-size: 1.1rem;
}
.re02-testi-author span {
  font-size: 0.9rem;
  color: #888;
}

/* 9. Animated Stats */
.re02-stats-row {
  display: flex;
  justify-content: space-around;
  padding: 60px 0;
  background-color: #ffffff;
  border-top: 1px solid #eaeaea;
  border-bottom: 1px solid #eaeaea;
}
.re02-stat-block {
  text-align: center;
}
.re02-stat-num {
  font-family: var(--font-heading);
  font-size: 3.5rem;
  color: var(--secondary, #1a1a1a);
  font-weight: 700;
  line-height: 1;
  margin-bottom: 10px;
}
.re02-stat-label {
  color: var(--primary, #6366f1);
  text-transform: uppercase;
  letter-spacing: 2px;
  font-size: 0.85rem;
  font-weight: 600;
}

/* 10. Blog / News */
.re02-blog-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  margin-top: 50px;
}
.re02-blog-card img {
  width: 100%;
  height: 220px;
  object-fit: cover;
}
.re02-blog-content {
  padding: 25px 0;
}
.re02-blog-date {
  color: var(--primary);
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 10px;
  display: block;
}
.re02-blog-content h3 {
  font-size: 1.25rem;
  margin-bottom: 15px;
  cursor: pointer;
  transition: color 0.3s;
}
.re02-blog-content h3:hover {
  color: var(--primary);
}

/* 11. Lead Capture Form */
.re02-form-area {
  background-color: #ffffff;
  box-shadow: 0 20px 50px rgba(0,0,0,0.08);
  padding: 60px;
  max-width: 800px;
  margin: 0 auto;
  transform: translateY(50px);
  position: relative;
  z-index: 10;
}
.re02-form-area h2 {
  text-align: center;
  margin-bottom: 40px;
}
.re02-form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
.re02-input {
  width: 100%;
  padding: 15px;
  border: 1px solid #ddd;
  background: #fafafa;
  font-family: var(--font-base);
  font-size: 1rem;
  transition: border-color 0.3s;
}
.re02-input:focus {
  outline: none;
  border-color: var(--primary);
  background: #fff;
}
.re02-textarea {
  grid-column: 1 / -1;
  min-height: 120px;
  resize: vertical;
}
.re02-submit-btn {
  grid-column: 1 / -1;
  width: 100%;
  background: var(--secondary);
  color: #fff;
  border: none;
  padding: 18px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
}
.re02-submit-btn:hover {
  background: var(--primary);
}

/* 12. Footer */
.re02-footer {
  background-color: #1a1a1a;
  color: #888;
  padding: 120px 0 40px;
}
.re02-footer-grid {
  display: grid;
  grid-template-columns: 3fr 2fr 2fr 3fr;
  gap: 40px;
  margin-bottom: 60px;
}
.re02-footer-title {
  color: #fff;
  font-family: var(--font-heading);
  font-size: 1.3rem;
  margin-bottom: 25px;
}
.re02-footer-links {
  list-style: none;
  padding: 0; margin: 0;
}
.re02-footer-links li {
  margin-bottom: 15px;
}
.re02-footer-links a {
  color: #888;
  text-decoration: none;
  transition: color 0.3s;
}
.re02-footer-links a:hover {
  color: var(--primary);
}
.re02-footer-bottom {
  text-align: center;
  border-top: 1px solid #333;
  padding-top: 30px;
  font-size: 0.9rem;
}

/* Responsive */
@media (max-width: 1024px) {
  .re02-hero { flex-direction: column; }
  .re02-hero-content { padding: 80px 30px; }
  .re02-hero-image { min-height: 400px; }
  .re02-features-grid { grid-template-columns: 1fr 1fr; }
  .re02-cards-container { grid-template-columns: 1fr 1fr; }
  .re02-blog-grid { grid-template-columns: 1fr 1fr; }
  .re02-about-wrap { flex-direction: column; gap: 50px; }
  .re02-about-content { padding-left: 0; }
  .re02-footer-grid { grid-template-columns: 1fr 1fr; }
}

@media (max-width: 768px) {
  .re02-nav-menu { display: none; }
  .re02-cards-container, .re02-testi-grid, .re02-blog-grid, .re02-features-grid, .re02-footer-grid { grid-template-columns: 1fr; }
  .re02-trust-flex { flex-wrap: wrap; justify-content: center; gap: 20px; }
  .re02-trust-flex svg { width: 100px; }
  .re02-stats-row { flex-direction: column; gap: 40px; }
  .re02-form-grid { grid-template-columns: 1fr; }
  .re02-title-main { font-size: 2.2rem; }
  .re02-form-area { padding: 30px; transform: translateY(0); margin-top: 40px; }
}
`;

export const realEstate02Html = `
<div class="re02-wrap">
  <!-- 1. Header -->
  <header class="re02-header">
    <div class="re02-container re02-header-inner">
      <div class="re02-logo">LOGO_PLACEHOLDER</div>
    
      <a href="#contact" class="re02-btn re02-btn-primary">Contact Us</a>
    </div>
  </header>

  <!-- 2. Hero Split -->
  <section class="re02-hero">
    <div class="re02-hero-content">
      <span class="re02-subtitle-section" style="text-align: left;">Exceptional Living</span>
      <h1 class="re02-title-main">Find Your Perfect Place to Call Home.</h1>
      <p class="re02-text-lead">We specialize in curating remarkable properties for discerning individuals. Experience real estate with a fresh, modern perspective.</p>
      <div class="re02-hero-btns">
        <a href="#properties" class="re02-btn re02-btn-secondary">Explore Homes</a>
        <a href="#about" class="re02-btn re02-btn-primary">Learn More</a>
      </div>
    </div>
    <div class="re02-hero-image"></div>
  </section>

  <!-- 3. Trust Logos -->
  <section class="re02-trust re02-bg-white">
    <div class="re02-container">
      <div class="re02-trust-flex">
        <svg width="120" height="40" viewBox="0 0 120 40"><text x="0" y="30" font-family="'Playfair Display', serif" font-size="22" font-weight="700" fill="#333">Zillow</text></svg>
        <svg width="120" height="40" viewBox="0 0 120 40"><text x="0" y="30" font-family="'Playfair Display', serif" font-size="22" font-weight="700" fill="#333">Realtor</text></svg>
        <svg width="120" height="40" viewBox="0 0 120 40"><text x="0" y="30" font-family="'Playfair Display', serif" font-size="22" font-weight="700" fill="#333">Redfin</text></svg>
        <svg width="130" height="40" viewBox="0 0 130 40"><text x="0" y="30" font-family="'Playfair Display', serif" font-size="22" font-weight="700" fill="#333">Compass</text></svg>
      </div>
    </div>
  </section>

  <!-- 4. Why Choose Us -->
  <section class="re02-section re02-bg-gray">
    <div class="re02-container">
      <span class="re02-subtitle-section">Our Expertise</span>
      <h2 class="re02-title-section">Comprehensive Real Estate Services</h2>
      
      <div class="re02-features-grid">
        <div class="re02-feature">
          <div class="re02-feature-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          </div>
          <h3>Verified Properties</h3>
          <p>Every home in our portfolio undergoes a rigorous quality and legal inspection process.</p>
        </div>
        <div class="re02-feature">
          <div class="re02-feature-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          </div>
          <h3>Time Efficiency</h3>
          <p>We streamline the search process, presenting only properties that perfectly match your criteria.</p>
        </div>
        <div class="re02-feature">
          <div class="re02-feature-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          </div>
          <h3>Expert Agents</h3>
          <p>Our team consists of top-tier professionals with deep roots and knowledge of the local market.</p>
        </div>
        <div class="re02-feature">
          <div class="re02-feature-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
          </div>
          <h3>Secure Transactions</h3>
          <p>Complete transparency and legal support ensuring your investment is completely protected.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- 5. Featured Properties -->
  <section id="properties" class="re02-section re02-bg-white">
    <div class="re02-container">
      <span class="re02-subtitle-section">Discover</span>
      <h2 class="re02-title-section">Curated Residences</h2>
      
      <div class="re02-cards-container">
        <!-- Card 1 -->
        <div class="re02-prop-card">
          <div class="re02-prop-img-wrap">
            <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="House" class="re02-prop-img">
            <span class="re02-prop-tag">FOR SALE</span>
          </div>
          <div class="re02-prop-info">
            <div class="re02-prop-price">$2,450,000</div>
            <h3 class="re02-prop-title">The Glass Pavilion</h3>
            <p style="color: #666; font-size: 0.95rem; margin-bottom: 20px;">124 Hillside Ave, Modern District</p>
            <div class="re02-prop-meta">
              <div class="re02-meta-item"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg> 4 Beds</div>
              <div class="re02-meta-item"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12h20M12 2v20"></path></svg> 3 Baths</div>
              <div class="re02-meta-item"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"></rect></svg> 3,200 sqft</div>
            </div>
          </div>
        </div>
        <!-- Card 2 -->
        <div class="re02-prop-card">
          <div class="re02-prop-img-wrap">
            <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="House" class="re02-prop-img">
            <span class="re02-prop-tag">FOR RENT</span>
          </div>
          <div class="re02-prop-info">
            <div class="re02-prop-price">$8,500 <span style="font-size:1rem; font-weight:normal; color:#777;">/ mo</span></div>
            <h3 class="re02-prop-title">Oakwood Minimalist</h3>
            <p style="color: #666; font-size: 0.95rem; margin-bottom: 20px;">88 Forest Drive, Pine Valley</p>
            <div class="re02-prop-meta">
              <div class="re02-meta-item"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg> 3 Beds</div>
              <div class="re02-meta-item"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12h20M12 2v20"></path></svg> 2.5 Baths</div>
              <div class="re02-meta-item"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"></rect></svg> 2,400 sqft</div>
            </div>
          </div>
        </div>
        <!-- Card 3 -->
        <div class="re02-prop-card">
          <div class="re02-prop-img-wrap">
            <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="House" class="re02-prop-img">
            <span class="re02-prop-tag">NEW LISTING</span>
          </div>
          <div class="re02-prop-info">
            <div class="re02-prop-price">$1,850,000</div>
            <h3 class="re02-prop-title">Urban Penthouse</h3>
            <p style="color: #666; font-size: 0.95rem; margin-bottom: 20px;">Tower 42, Downtown Center</p>
            <div class="re02-prop-meta">
              <div class="re02-meta-item"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg> 2 Beds</div>
              <div class="re02-meta-item"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12h20M12 2v20"></path></svg> 2 Baths</div>
              <div class="re02-meta-item"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"></rect></svg> 1,800 sqft</div>
            </div>
          </div>
        </div>
      </div>
      
      <div style="text-align:center; margin-top: 50px;">
        <a href="#" class="re02-btn re02-btn-secondary">Browse All Listings</a>
      </div>
    </div>
  </section>

  <!-- 6. About Overlap -->
  <section id="about" class="re02-section re02-bg-gray">
    <div class="re02-container">
      <div class="re02-about-wrap">
        <div class="re02-about-img-box">
          <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Agency Team" class="re02-about-img">
        </div>
        <div class="re02-about-content">
          <span class="re02-subtitle-section" style="text-align:left;">The Agency</span>
          <h2 class="re02-title-main">Redefining Real Estate Excellence.</h2>
          <p class="re02-text-lead">Founded on the principles of integrity, innovation, and uncompromising service. We believe that finding a home is more than a transaction—it's a life-changing experience.</p>
          <p style="color: #666; margin-bottom: 30px; line-height: 1.7;">Our dedicated team leverages cutting-edge technology and profound market analytics to provide you with insights that truly matter, ensuring you make informed decisions every step of the way.</p>
          <a href="#" class="re02-btn re02-btn-primary">Meet The Team</a>
        </div>
      </div>
    </div>
  </section>

  <!-- 7. The Process -->
  <section id="services" class="re02-process-section">
    <div class="re02-container">
      <div class="re02-process-header">
        <span class="re02-subtitle-section">The Process</span>
        <h2 class="re02-title-section">How We Work With You</h2>
      </div>
      
      <div class="re02-timeline">
        <div class="re02-timeline-item">
          <div class="re02-timeline-num">01</div>
          <div class="re02-timeline-content">
            <h3>Discovery & Strategy</h3>
            <p>We begin with a comprehensive consultation to understand your goals, lifestyle preferences, and long-term vision. This foundational step ensures our search is perfectly aligned with your unique needs.</p>
          </div>
        </div>
        <div class="re02-timeline-item">
          <div class="re02-timeline-num">02</div>
          <div class="re02-timeline-content">
            <h3>Curated Selection</h3>
            <p>Leveraging our expansive network and market intelligence, we handpick properties that match your criteria, including exclusive off-market opportunities not available to the public.</p>
          </div>
        </div>
        <div class="re02-timeline-item">
          <div class="re02-timeline-num">03</div>
          <div class="re02-timeline-content">
            <h3>Expert Negotiation</h3>
            <p>Backed by decades of experience, our agents negotiate fiercely on your behalf to secure the best possible terms, protecting your financial interests at every turn.</p>
          </div>
        </div>
        <div class="re02-timeline-item">
          <div class="re02-timeline-num">04</div>
          <div class="re02-timeline-content">
            <h3>Seamless Closing</h3>
            <p>We manage all the complex details—from inspections to final paperwork—ensuring a smooth, stress-free transition into your new property.</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- 8. Testimonials -->
  <section class="re02-section re02-bg-white">
    <div class="re02-container">
      <span class="re02-subtitle-section">Client Stories</span>
      <h2 class="re02-title-section">What Our Clients Say</h2>
      
      <div class="re02-testi-grid">
        <div class="re02-testi-box">
          <p class="re02-testi-text">"The level of professionalism and attention to detail was extraordinary. They understood exactly what we were looking for and didn't waste our time. We found our dream home in just two weeks."</p>
          <div class="re02-testi-author">
            <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" alt="Client">
            <div>
              <h4>Emma Thompson</h4>
              <span>Home Buyer</span>
            </div>
          </div>
        </div>
        <div class="re02-testi-box">
          <p class="re02-testi-text">"Selling a home can be stressful, but Lumina made it seamless. Their marketing strategy was brilliant, resulting in multiple offers above our asking price within the first weekend."</p>
          <div class="re02-testi-author">
            <img src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" alt="Client">
            <div>
              <h4>David & Sarah Jenkins</h4>
              <span>Home Sellers</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- 9. Animated Stats -->
  <section class="re02-stats-row">
    <div class="re02-stat-block">
      <div class="re02-stat-num">$1.5B</div>
      <div class="re02-stat-label">Sales Volume</div>
    </div>
    <div class="re02-stat-block">
      <div class="re02-stat-num">850+</div>
      <div class="re02-stat-label">Properties Sold</div>
    </div>
    <div class="re02-stat-block">
      <div class="re02-stat-num">98%</div>
      <div class="re02-stat-label">Client Retention</div>
    </div>
    <div class="re02-stat-block">
      <div class="re02-stat-num">15</div>
      <div class="re02-stat-label">Years of Excellence</div>
    </div>
  </section>

  <!-- 10. Blog / News -->
  <section id="journal" class="re02-section re02-bg-gray">
    <div class="re02-container">
      <span class="re02-subtitle-section">Insights</span>
      <h2 class="re02-title-section">Market Updates</h2>
      
      <div class="re02-blog-grid">
        <div class="re02-blog-card">
          <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Blog">
          <div class="re02-blog-content">
            <span class="re02-blog-date">Oct 12, 2026</span>
            <h3>Top Interior Design Trends for Luxury Homes this Fall</h3>
            <a href="#" style="color:var(--primary); font-weight:600; text-decoration:none; font-size:0.9rem;">Read Article &rarr;</a>
          </div>
        </div>
        <div class="re02-blog-card">
          <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Blog">
          <div class="re02-blog-content">
            <span class="re02-blog-date">Sep 28, 2026</span>
            <h3>Understanding the Shift in Suburban Real Estate Markets</h3>
            <a href="#" style="color:var(--primary); font-weight:600; text-decoration:none; font-size:0.9rem;">Read Article &rarr;</a>
          </div>
        </div>
        <div class="re02-blog-card">
          <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Blog">
          <div class="re02-blog-content">
            <span class="re02-blog-date">Sep 15, 2026</span>
            <h3>How to Prepare Your Home for a High-End Valuation</h3>
            <a href="#" style="color:var(--primary); font-weight:600; text-decoration:none; font-size:0.9rem;">Read Article &rarr;</a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- 11. Lead Capture Form -->
  <section id="contact" class="re02-bg-white">
    <div class="re02-container">
      <div class="re02-form-area">
        <span class="re02-subtitle-section">Get in Touch</span>
        <h2>Let's Talk About Your Next Move</h2>
        
        <form class="re02-form-grid">
          <input type="text" placeholder="First Name" class="re02-input" required>
          <input type="text" placeholder="Last Name" class="re02-input" required>
          <input type="email" placeholder="Email Address" class="re02-input" required>
          <input type="tel" placeholder="Phone Number" class="re02-input">
          <textarea placeholder="How can we assist you today?" class="re02-input re02-textarea" required></textarea>
          <button type="submit" class="re02-submit-btn">Send Message</button>
        </form>
      </div>
    </div>
  </section>

  <!-- 12. Footer -->
  <footer class="re02-footer">
    <div class="re02-container">
      <div class="re02-footer-grid">
        <div>
          <h3 class="re02-footer-title" style="font-size: 1.8rem;">LOGO_PLACEHOLDER</h3>
          <p style="line-height: 1.6; margin-bottom: 20px;">Elevating the standard of modern real estate through transparency, innovation, and uncompromising dedication to our clients.</p>
        </div>
        
       
      </div>
      <div class="re02-footer-bottom">
        &copy; 2026 Lumina Real Estate. All rights reserved. Designed for Excellence.
      </div>
    </div>
  </footer>
</div>
`;
