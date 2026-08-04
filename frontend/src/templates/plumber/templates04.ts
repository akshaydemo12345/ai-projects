export const plumber04Styles = `
:root {
  --primary: PRIMARY_COLOR_PLACEHOLDER;
  --secondary: SECONDARY_COLOR_PLACEHOLDER;
  --primary-rgb: PRIMARY_RGB_PLACEHOLDER;
  --secondary-rgb: SECONDARY_RGB_PLACEHOLDER;
  --bg-light: #fdfdfd;
  --bg-gray: #f4f7f9;
  --text-dark: #111827;
  --text-body: #4b5563;
  --text-muted: #6b7280;
  --border-light: #e5e7eb;
}

/* Global Reset */
.pl04-wrapper {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  color: var(--text-body);
  background-color: var(--bg-light);
  line-height: 1.6;
  overflow-x: hidden;
  box-sizing: border-box;
}

.pl04-wrapper *, .pl04-wrapper *::before, .pl04-wrapper *::after {
  box-sizing: inherit;
}

.pl04-wrapper img {
  max-width: 100%;
  height: auto;
  display: block;
}

.pl04-wrapper a {
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
}

.pl04-wrapper h1, .pl04-wrapper h2, .pl04-wrapper h3, .pl04-wrapper h4, .pl04-wrapper h5, .pl04-wrapper h6 {
  color: var(--text-dark);
  margin-top: 0;
  font-weight: 800;
  line-height: 1.2;
}

/* Typography Classes */
.pl04-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  letter-spacing: -0.02em;
  margin-bottom: 1.5rem;
}

.pl04-h2 {
  font-size: clamp(2rem, 4vw, 2.75rem);
  letter-spacing: -0.01em;
  margin-bottom: 1.5rem;
}

.pl04-subtitle {
  color: var(--secondary);
  font-size: 0.875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 1rem;
}

.pl04-subtitle::before {
  content: '';
  display: inline-block;
  width: 40px;
  height: 2px;
  background-color: var(--secondary);
}

/* Layout Utilities */
.pl04-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
  width: 100%;
}

.pl04-section {
  padding: 100px 0;
  position: relative;
}

.pl04-bg-dark {
  background-color: var(--primary);
  color: #ffffff;
}

.pl04-bg-dark h1, .pl04-bg-dark h2, .pl04-bg-dark h3, .pl04-bg-dark h4 {
  color: #ffffff;
}

.pl04-bg-gray {
  background-color: var(--bg-gray);
}

/* Buttons */
.pl04-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 1rem 2rem;
  background-color: var(--secondary);
  color: #ffffff !important;
  font-weight: 700;
  font-size: 1rem;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(var(--secondary-rgb), 0.4);
  transition: all 0.3s ease;
}

.pl04-btn:hover {
  transform: translateY(-2px);
  filter: brightness(1.1);
  box-shadow: 0 6px 20px rgba(var(--secondary-rgb), 0.5);
}

.pl04-btn-outline {
  background-color: transparent;
  color: var(--primary) !important;
  border: 2px solid var(--primary);
  box-shadow: none;
}

.pl04-btn-outline:hover {
  background-color: var(--primary);
  color: #ffffff !important;
}

/* Header */
.pl04-header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  padding: 1.5rem 0;
  background: transparent;
}

.pl04-header-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pl04-logo {
  font-size: 1.75rem;
  font-weight: 900;
  color: #ffffff;
  display: flex;
  align-items: center;
  gap: 10px;
}

.pl04-logo i {
  color: var(--secondary);
}

.pl04-contact-info {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.pl04-contact-item {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #ffffff;
}

.pl04-contact-item i {
  font-size: 1.25rem;
  color: var(--secondary);
}

.pl04-contact-text span {
  display: block;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  opacity: 0.8;
}

.pl04-contact-text strong {
  font-size: 1rem;
}

/* Hero Section */
.pl04-hero {
  position: relative;
  padding: 220px 0 150px;
  background-color: var(--primary);
  background-image: linear-gradient(135deg, rgba(var(--primary-rgb), 0.9) 0%, rgba(var(--primary-rgb), 0.95) 100%), url('https://images.unsplash.com/photo-1505798577917-a65157d3320a?auto=format&fit=crop&q=80');
  background-size: cover;
  background-position: center;
}

.pl04-hero-content {
  max-width: 700px;
}

.pl04-hero p {
  font-size: 1.25rem;
  margin-bottom: 2.5rem;
  color: rgba(255, 255, 255, 0.9);
}

.pl04-hero-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

/* Features Bar */
.pl04-features-bar {
  background-color: #ffffff;
  box-shadow: 0 -10px 40px rgba(0,0,0,0.05);
  border-radius: 8px;
  padding: 2rem;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  position: relative;
  margin-top: -60px;
  z-index: 10;
}

.pl04-feature-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.pl04-feature-icon {
  width: 50px;
  height: 50px;
  background-color: rgba(var(--primary-rgb), 0.1);
  color: var(--primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.pl04-feature-item h4 {
  margin: 0 0 0.25rem;
  font-size: 1.1rem;
}

.pl04-feature-item p {
  margin: 0;
  font-size: 0.9rem;
}

/* About Us Section */
.pl04-about-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
}

.pl04-about-img-wrap {
  position: relative;
}

.pl04-about-img-1 {
  width: 80%;
  border-radius: 8px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
}

.pl04-about-img-2 {
  position: absolute;
  right: 0;
  bottom: -40px;
  width: 55%;
  border-radius: 8px;
  border: 10px solid #ffffff;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
}

.pl04-badge {
  position: absolute;
  top: -20px;
  right: 10%;
  background-color: var(--secondary);
  color: #ffffff;
  padding: 1.5rem;
  border-radius: 50%;
  width: 140px;
  height: 140px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  animation: pl04-float 3s ease-in-out infinite;
}

@keyframes pl04-float {
  0% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
  100% { transform: translateY(0); }
}

.pl04-badge h3 {
  color: #ffffff;
  margin: 0;
  font-size: 2.5rem;
  line-height: 1;
}

.pl04-badge span {
  font-size: 0.8rem;
  text-transform: uppercase;
  font-weight: 700;
  letter-spacing: 1px;
}

.pl04-about-list {
  list-style: none;
  padding: 0;
  margin: 2rem 0;
}

.pl04-about-list li {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--text-dark);
}

.pl04-about-list li i {
  color: var(--secondary);
}

/* Services Grid */
.pl04-services-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  margin-top: 4rem;
}

.pl04-service-card {
  background: #ffffff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.03);
  transition: all 0.3s ease;
  border: 1px solid var(--border-light);
}

.pl04-service-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.08);
}

.pl04-service-img {
  width: 100%;
  height: 240px;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.pl04-service-card:hover .pl04-service-img {
  transform: scale(1.05);
}

.pl04-service-img-wrapper {
  overflow: hidden;
  position: relative;
}

.pl04-service-content {
  padding: 2rem;
  position: relative;
}

.pl04-service-icon {
  position: absolute;
  top: -30px;
  right: 2rem;
  width: 60px;
  height: 60px;
  background: var(--secondary);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  border-radius: 50%;
  box-shadow: 0 10px 20px rgba(var(--secondary-rgb), 0.3);
}

.pl04-service-content h3 {
  font-size: 1.25rem;
  margin-bottom: 1rem;
}

.pl04-service-content p {
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
}

.pl04-link {
  color: var(--primary);
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  text-transform: uppercase;
  font-size: 0.85rem;
  letter-spacing: 1px;
}

.pl04-link:hover {
  color: var(--secondary);
  gap: 10px;
}

/* Call to Action */
.pl04-cta {
  padding: 80px 0;
  background: var(--primary);
  background-image: url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');
}

.pl04-cta-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255,255,255,0.1);
  padding: 3rem 4rem;
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.1);
}

.pl04-cta-inner h2 {
  color: #ffffff;
  margin: 0 0 0.5rem;
  font-size: 2.25rem;
}

.pl04-cta-inner p {
  color: rgba(255,255,255,0.8);
  margin: 0;
  font-size: 1.1rem;
}


/* Process Section */
.pl04-process {
  background-color: #ffffff;
  text-align: center;
}
.pl04-process-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
  margin-top: 4rem;
}
.pl04-process-step {
  position: relative;
  padding: 2rem;
  background: var(--bg-gray);
  border-radius: 8px;
  transition: all 0.3s ease;
}
.pl04-process-step:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0,0,0,0.05);
}
.pl04-step-number {
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  width: 50px;
  height: 50px;
  background-color: var(--secondary);
  color: #ffffff;
  font-weight: 800;
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 4px solid #ffffff;
}
.pl04-process-step h4 {
  margin: 1.5rem 0 0.5rem;
  font-size: 1.25rem;
}

/* Testimonials Section */
.pl04-testimonials {
  background-color: var(--bg-gray);
}
.pl04-testi-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  margin-top: 3rem;
}
.pl04-testi-card {
  background: #ffffff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.02);
  position: relative;
}
.pl04-testi-card::before {
  content: '\\201C';
  font-family: serif;
  position: absolute;
  top: -10px;
  right: 20px;
  font-size: 5rem;
  color: rgba(var(--primary-rgb), 0.05);
  line-height: 1;
}
.pl04-testi-stars {
  color: #fbbf24;
  margin-bottom: 1rem;
}
.pl04-testi-text {
  font-size: 0.95rem;
  font-style: italic;
  margin-bottom: 1.5rem;
  color: var(--text-body);
}
.pl04-testi-author {
  display: flex;
  align-items: center;
  gap: 15px;
}
.pl04-testi-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: var(--primary);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.2rem;
}
.pl04-testi-author-info strong {
  display: block;
  color: var(--text-dark);
  font-size: 0.95rem;
}
.pl04-testi-author-info span {
  font-size: 0.8rem;
  color: var(--text-muted);
}

/* FAQ Section */
.pl04-faq {
  background-color: #ffffff;
}
.pl04-faq-container {
  max-width: 800px;
  margin: 3rem auto 0;
}
.pl04-faq-item {
  border: 1px solid var(--border-light);
  border-radius: 6px;
  margin-bottom: 15px;
  overflow: hidden;
}
.pl04-faq-item summary {
  padding: 1.25rem 1.5rem;
  background-color: var(--bg-gray);
  font-weight: 700;
  cursor: pointer;
  list-style: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
}
.pl04-faq-item summary:hover {
  background-color: rgba(var(--primary-rgb), 0.05);
}
.pl04-faq-item summary::-webkit-details-marker {
  display: none;
}
.pl04-faq-item p {
  padding: 1.25rem 1.5rem;
  margin: 0;
  border-top: 1px solid var(--border-light);
  color: var(--text-muted);
}

@media (max-width: 768px) {
  .pl04-process-grid, .pl04-testi-grid {
    grid-template-columns: 1fr;
  }
}

/* Form Section */
.pl04-form-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 25px 50px rgba(0,0,0,0.1);
  background: #ffffff;
}

.pl04-form-image {
  background-image: url('https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80');
  background-size: cover;
  background-position: center;
  position: relative;
}

.pl04-form-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to right, rgba(var(--primary-rgb), 0.6), rgba(var(--primary-rgb), 0.9));
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 4rem;
}

.pl04-form-overlay h3 {
  color: #ffffff;
  font-size: 2rem;
  margin-bottom: 1rem;
}

.pl04-form-overlay p {
  color: rgba(255,255,255,0.9);
  font-size: 1.1rem;
}

.pl04-form-container {
  padding: 5rem 4rem;
}

.pl04-form-container h2 {
  margin-bottom: 2rem;
}

.pl04-form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.pl04-input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.pl04-input-group label {
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--text-dark);
}

.pl04-input {
  padding: 1rem 1.25rem;
  background: var(--bg-gray);
  border: 1px solid var(--border-light);
  border-radius: 4px;
  font-family: inherit;
  font-size: 1rem;
  color: var(--text-dark);
  transition: all 0.3s;
}

.pl04-input:focus {
  outline: none;
  border-color: var(--primary);
  background: #ffffff;
  box-shadow: 0 0 0 4px rgba(var(--primary-rgb), 0.1);
}

/* Footer */
.pl04-footer {
  background-color: var(--primary);
  color: #94a3b8;
  padding: 80px 0 0;
}

.pl04-footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1.5fr;
  gap: 60px;
  margin-bottom: 60px;
}

.pl04-footer-logo {
  font-size: 2rem;
  font-weight: 900;
  color: #ffffff;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 1.5rem;
}

.pl04-footer-logo i { color: var(--secondary); }

.pl04-footer-desc {
  line-height: 1.8;
  margin-bottom: 2rem;
  max-width: 400px;
}

.pl04-footer-title {
  color: #ffffff;
  font-size: 1.25rem;
  margin-bottom: 1.5rem;
  position: relative;
  padding-bottom: 10px;
}

.pl04-footer-title::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 40px;
  height: 2px;
  background-color: var(--secondary);
}

.pl04-footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.pl04-footer-links li {
  margin-bottom: 12px;
}

.pl04-footer-links a {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pl04-footer-links a:hover {
  color: var(--secondary);
  padding-left: 5px;
}

.pl04-footer-contact li {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  margin-bottom: 20px;
}

.pl04-footer-contact i {
  color: var(--secondary);
  font-size: 1.25rem;
  margin-top: 4px;
}

.pl04-footer-contact strong {
  display: block;
  color: #ffffff;
  margin-bottom: 4px;
}

.pl04-footer-bottom {
  padding: 24px 0;
  border-top: 1px solid rgba(255,255,255,0.1);
  text-align: center;
  font-size: 0.9rem;
}

/* Responsive */
@media (max-width: 1024px) {
  .pl04-about-grid, .pl04-form-section, .pl04-cta-inner {
    grid-template-columns: 1fr;
    flex-direction: column;
    text-align: center;
  }
  .pl04-about-list li { justify-content: center; }
  .pl04-cta-inner { gap: 2rem; }
  .pl04-form-image { height: 300px; }
  .pl04-form-overlay { padding: 2rem; }
  .pl04-form-container { padding: 3rem 2rem; text-align: left; }
}

@media (max-width: 768px) {
  .pl04-contact-info { display: none; }
  .pl04-features-bar { grid-template-columns: 1fr; gap: 1.5rem; margin-top: 0; border-radius: 0; }
  .pl04-services-grid { grid-template-columns: 1fr; }
  .pl04-footer-grid { grid-template-columns: 1fr; gap: 40px; }
  .pl04-form-grid { grid-template-columns: 1fr; }
  .pl04-badge { width: 100px; height: 100px; }
  .pl04-badge h3 { font-size: 1.5rem; }
}
`;

export const plumber04Html = `
<div class="pl04-wrapper">

  <!-- Header -->
  <header class="pl04-header">
    <div class="pl04-container pl04-header-inner">
      <div class="pl04-logo">
        LOGO_PLACEHOLDER
      </div>
      <div class="pl04-contact-info">
        <div class="pl04-contact-item">
          <i class="fas fa-phone-alt"></i>
          <div class="pl04-contact-text">
            <span>Call Available 24/7</span>
            <strong>PHONE_PLACEHOLDER</strong>
          </div>
        </div>
        <a href="javascript:void(0);" class="pl04-btn">Book Online</a>
      </div>
    </div>
  </header>

  <!-- Hero Section -->
  <section class="pl04-hero">
    <div class="pl04-container">
      <div class="pl04-hero-content">
        <div class="pl04-subtitle">Fast & Reliable Plumbing Services</div>
        <h1 class="pl04-title">Expert Plumbing Solutions for Your Home & Business.</h1>
        <p>Don't let plumbing problems disrupt your life. Our certified professionals are ready to fix, install, and maintain your systems with a 100% satisfaction guarantee.</p>
        <div class="pl04-hero-actions">
          <a href="javascript:void(0);" class="pl04-btn pl04-btn-outline">Explore Services</a>
          <a href="javascript:void(0);" class="pl04-btn">Get a Free Estimate</a>
        </div>
      </div>
    </div>
  </section>

  <!-- Features Bar -->
  <div class="pl04-container">
    <div class="pl04-features-bar">
      <div class="pl04-feature-item">
        <div class="pl04-feature-icon"><i class="fas fa-clock"></i></div>
        <div>
          <h4>24/7 Emergency</h4>
          <p>We are available around the clock to handle your urgent plumbing needs.</p>
        </div>
      </div>
      <div class="pl04-feature-item">
        <div class="pl04-feature-icon"><i class="fas fa-user-shield"></i></div>
        <div>
          <h4>Licensed Experts</h4>
          <p>Our team consists of fully certified and insured plumbing professionals.</p>
        </div>
      </div>
      <div class="pl04-feature-item">
        <div class="pl04-feature-icon"><i class="fas fa-tags"></i></div>
        <div>
          <h4>Upfront Pricing</h4>
          <p>No hidden fees. You know the exact cost before we start any work.</p>
        </div>
      </div>
    </div>
  </div>

  <!-- About Section -->
  <section class="pl04-section" id="about">
    <div class="pl04-container pl04-about-grid">
      <div class="pl04-about-img-wrap">
        <img src="https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&q=80" alt="Plumber working" class="pl04-about-img-1">
        <img src="https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&q=80" alt="Pipes" class="pl04-about-img-2">
        <div class="pl04-badge">
          <div>15+</div>
          <span>Years Exp</span>
        </div>
      </div>
      <div>
        <div class="pl04-subtitle">Who We Are</div>
        <h2 class="pl04-h2">Your Trusted Local Plumbing Authority.</h2>
        <p>With over a decade of experience, we have built our reputation on honesty, integrity, and unparalleled craftsmanship. Whether it's a minor leak or a major installation, we treat every home with the utmost respect.</p>
        
        <ul class="pl04-about-list">
          <li><i class="fas fa-check-circle"></i> Rapid Response Times</li>
          <li><i class="fas fa-check-circle"></i> State-of-the-art Equipment</li>
          <li><i class="fas fa-check-circle"></i> Clean & Tidy Workmanship</li>
          <li><i class="fas fa-check-circle"></i> Long-lasting Guaranteed Results</li>
        </ul>
        
        <a href="javascript:void(0);" class="pl04-btn">Discover More</a>
      </div>
    </div>
  </section>

  <!-- Services Section -->
  <section class="pl04-section pl04-bg-gray" id="services">
    <div class="pl04-container">
      <div style="text-align: center; max-width: 600px; margin: 0 auto 3rem;">
        <div class="pl04-subtitle" style="justify-content: center;">What We Do</div>
        <h2 class="pl04-h2">Comprehensive Plumbing Services</h2>
      </div>
      
      <div class="pl04-services-grid">
        <div class="pl04-service-card">
          <div class="pl04-service-img-wrapper">
            <img src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80" alt="Drain Cleaning" class="pl04-service-img">
          </div>
          <div class="pl04-service-content">
            <div class="pl04-service-icon"><i class="fas fa-tint"></i></div>
            <h3>Drain Cleaning</h3>
            <p>Stubborn clogs are no match for our advanced hydro-jetting and snaking technologies. We restore full flow fast.</p>
            <a href="javascript:void(0);" class="pl04-link">Book Service <i class="fas fa-arrow-right"></i></a>
          </div>
        </div>
        
        <div class="pl04-service-card">
          <div class="pl04-service-img-wrapper">
            <img src="https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&q=80" alt="Water Heaters" class="pl04-service-img">
          </div>
          <div class="pl04-service-content">
            <div class="pl04-service-icon"><i class="fas fa-thermometer-half"></i></div>
            <h3>Water Heaters</h3>
            <p>From traditional tanks to modern tankless systems, we handle repairs, maintenance, and energy-efficient installations.</p>
            <a href="javascript:void(0);" class="pl04-link">Book Service <i class="fas fa-arrow-right"></i></a>
          </div>
        </div>
        
        <div class="pl04-service-card">
          <div class="pl04-service-img-wrapper">
            <img src="https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&q=80" alt="Pipe Repair" class="pl04-service-img">
          </div>
          <div class="pl04-service-content">
            <div class="pl04-service-icon"><i class="fas fa-wrench"></i></div>
            <h3>Pipe Repair</h3>
            <p>Expert leak detection and pipe repair services to protect your property from devastating water damage.</p>
            <a href="javascript:void(0);" class="pl04-link">Book Service <i class="fas fa-arrow-right"></i></a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- CTA Bar -->
  <section class="pl04-cta">
    <div class="pl04-container">
      <div class="pl04-cta-inner">
        <div>
          <h2>Need Emergency Plumbing Help?</h2>
          <p>Our fleet is fully stocked and ready to dispatch to your location 24/7.</p>
        </div>
        <a href="javascript:void(0);" class="pl04-btn" style="background-color: #ffffff; color: var(--primary) !important;">Call Us Immediately</a>
      </div>
    </div>
  </section>

  
  <!-- Process Section -->
  <section class="pl04-section pl04-process">
    <div class="pl04-container">
      <div class="pl04-subtitle" style="justify-content: center;">How It Works</div>
      <h2 class="pl04-h2">Our Simple 3-Step Process</h2>
      
      <div class="pl04-process-grid">
        <div class="pl04-process-step">
          <div class="pl04-step-number">1</div>
          <h4>Book an Appointment</h4>
          <p>Call us or fill out our online form to schedule a visit at a time that works best for you.</p>
        </div>
        <div class="pl04-process-step">
          <div class="pl04-step-number">2</div>
          <h4>Get a Free Estimate</h4>
          <p>Our expert plumber will inspect the issue and provide a transparent, upfront quote with no hidden fees.</p>
        </div>
        <div class="pl04-process-step">
          <div class="pl04-step-number">3</div>
          <h4>Job Done Right</h4>
          <p>We fix the problem efficiently and clean up the area, leaving your home better than we found it.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Testimonials Section -->
  <section class="pl04-section pl04-testimonials">
    <div class="pl04-container">
      <div style="text-align: center; margin-bottom: 2rem;">
        <div class="pl04-subtitle" style="justify-content: center;">Client Stories</div>
        <h2 class="pl04-h2">What Our Customers Say</h2>
      </div>
      
      <div class="pl04-testi-grid">
        <div class="pl04-testi-card">
          <div class="pl04-testi-stars"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i></div>
          <p class="pl04-testi-text">"Absolutely fantastic service. They arrived within 30 minutes of my emergency call and fixed my bursting pipe immediately. Highly recommended!"</p>
          <div class="pl04-testi-author">
            <div class="pl04-testi-avatar">M</div>
            <div class="pl04-testi-author-info">
              <strong>Michael T.</strong>
              <span>Homeowner</span>
            </div>
          </div>
        </div>
        <div class="pl04-testi-card">
          <div class="pl04-testi-stars"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i></div>
          <p class="pl04-testi-text">"Professional, clean, and upfront about pricing. I knew exactly what I was paying before they even started the water heater installation."</p>
          <div class="pl04-testi-author">
            <div class="pl04-testi-avatar">S</div>
            <div class="pl04-testi-author-info">
              <strong>Sarah L.</strong>
              <span>Local Business Owner</span>
            </div>
          </div>
        </div>
        <div class="pl04-testi-card">
          <div class="pl04-testi-stars"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i></div>
          <p class="pl04-testi-text">"I've used them for three different properties now. They are consistently reliable, knowledgeable, and always leave the workspace spotless."</p>
          <div class="pl04-testi-author">
            <div class="pl04-testi-avatar">D</div>
            <div class="pl04-testi-author-info">
              <strong>David R.</strong>
              <span>Property Manager</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- FAQ Section -->
  <section class="pl04-section pl04-faq">
    <div class="pl04-container">
      <div style="text-align: center;">
        <div class="pl04-subtitle" style="justify-content: center;">Got Questions?</div>
        <h2 class="pl04-h2">Frequently Asked Questions</h2>
      </div>
      
      <div class="pl04-faq-container">
        <details class="pl04-faq-item" open>
          <summary>Do you offer 24/7 emergency service? <i class="fas fa-chevron-down"></i></summary>
          <p>Yes, we understand that plumbing emergencies can happen at any time. Our team is available 24 hours a day, 7 days a week, 365 days a year to handle your urgent plumbing needs.</p>
        </details>
        <details class="pl04-faq-item">
          <summary>Are your plumbers licensed and insured? <i class="fas fa-chevron-down"></i></summary>
          <p>Absolutely. Every member of our plumbing team is fully licensed, bonded, and insured. We also conduct thorough background checks and continuous training for your peace of mind.</p>
        </details>
        <details class="pl04-faq-item">
          <summary>Do you charge for estimates? <i class="fas fa-chevron-down"></i></summary>
          <p>We offer free, no-obligation estimates for most major projects and installations. For specific diagnostic visits, a small dispatch fee may apply, which is often credited toward the final repair cost.</p>
        </details>
        <details class="pl04-faq-item">
          <summary>What areas do you service? <i class="fas fa-chevron-down"></i></summary>
          <p>We serve the entire metropolitan area and surrounding suburbs. If you are unsure whether your home falls within our service zone, just give us a call!</p>
        </details>
      </div>
    </div>
  </section>


  <!-- Form Section -->
  <section class="pl04-section" id="quote">
    <div class="pl04-container">
      <div class="pl04-form-section">
        <div class="pl04-form-image">
          <div class="pl04-form-overlay">
            <h3>Get a Free Estimate</h3>
            <p>Fill out the form with your details, and one of our experts will get back to you shortly to discuss your needs.</p>
          </div>
        </div>
        <div class="pl04-form-container">
          <div class="pl04-subtitle">Book an Appointment</div>
          <h2>Request a Quote</h2>
          <form>
            <div class="pl04-form-grid">
              <div class="pl04-input-group">
                <label>First Name</label>
                <input type="text" class="pl04-input" placeholder="John">
              </div>
              <div class="pl04-input-group">
                <label>Last Name</label>
                <input type="text" class="pl04-input" placeholder="Doe">
              </div>
            </div>
            <div class="pl04-form-grid">
              <div class="pl04-input-group">
                <label>Email Address</label>
                <input type="email" class="pl04-input" placeholder="john@example.com">
              </div>
              <div class="pl04-input-group">
                <label>Phone Number</label>
                <input type="tel" class="pl04-input" placeholder="(555) 123-4567">
              </div>
            </div>
            <div class="pl04-input-group" style="margin-bottom: 1.5rem;">
              <label>Service Needed</label>
              <select class="pl04-input">
                <option>General Plumbing</option>
                <option>Drain Cleaning</option>
                <option>Water Heater Repair</option>
                <option>Emergency Service</option>
              </select>
            </div>
            <button type="submit" class="pl04-btn" style="width: 100%; padding: 1.25rem;">Submit Request</button>
          </form>
        </div>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="pl04-footer">
    <div class="pl04-container">
      <div class="pl04-footer-grid">
        <div>
          <div class="pl04-footer-logo">
            LOGO_PLACEHOLDER
          </div>
          <p class="pl04-footer-desc">We are committed to providing top-tier plumbing services with a focus on reliability, quality, and complete customer satisfaction. Your comfort is our business.</p>
        </div>
        
        <div>
          <h4 class="pl04-footer-title">Quick Links</h4>
          <ul class="pl04-footer-links">
            <li><a href="javascript:void(0);"><i class="fas fa-angle-right"></i> About Us</a></li>
            <li><a href="javascript:void(0);"><i class="fas fa-angle-right"></i> Our Services</a></li>
            <li><a href="javascript:void(0);"><i class="fas fa-angle-right"></i> Request a Quote</a></li>
            <li><a href="javascript:void(0);"><i class="fas fa-angle-right"></i> Privacy Policy</a></li>
          </ul>
        </div>
        
        <div>
          <h4 class="pl04-footer-title">Contact Us</h4>
          <ul class="pl04-footer-links pl04-footer-contact">
            <li>
              <i class="fas fa-map-marker-alt"></i>
              <div>
                <strong>Office Address</strong>
                ADDRESS_PLACEHOLDER
              </div>
            </li>
            <li>
              <i class="fas fa-phone-alt"></i>
              <div>
                <strong>Phone Number</strong>
                PHONE_PLACEHOLDER
              </div>
            </li>
            <li>
              <i class="fas fa-envelope"></i>
              <div>
                <strong>Email Address</strong>
                EMAIL_PLACEHOLDER
              </div>
            </li>
          </ul>
        </div>
      </div>
      
      <div class="pl04-footer-bottom">
        &copy; 2024 PROJECT_NAME_PLACEHOLDER. All Rights Reserved. Designed for Excellence.
      </div>
    </div>
  </footer>

</div> <!-- End wrapper -->
`;
