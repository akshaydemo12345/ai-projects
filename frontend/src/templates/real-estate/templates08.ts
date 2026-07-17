export const realEstate08Styles = `
:root {
  --primary: PRIMARY_COLOR_PLACEHOLDER;
  --secondary: SECONDARY_COLOR_PLACEHOLDER;
  --primary-rgb: PRIMARY_RGB_PLACEHOLDER;
  --secondary-rgb: SECONDARY_RGB_PLACEHOLDER;
  --re08-light: #f9f9f9;
  --re08-text: #666666;
}

* { box-sizing: border-box; }

.re08-wrap {
  font-family: 'Inter', sans-serif;
  color: var(--re08-text);
  background-color: #ffffff;
  overflow-x: hidden;
  line-height: 1.6;
}

h1, h2, h3, h4, h5 {
  color: var(--primary);
  font-weight: 700;
  margin: 0 0 15px 0;
}

p { margin: 0 0 15px 0; }

.re08-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.re08-btn {
  display: inline-block;
  padding: 12px 30px;
  background: var(--secondary);
  color: #fff;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
  border: none;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s;
  text-align: center;
}
.re08-btn:hover {
  background: var(--primary);
}

/* Topbar */
.re08-topbar {
  background: var(--primary);
  color: #ccc;
  font-size: 0.8rem;
  padding: 10px 0;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}
.re08-topbar-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.re08-topbar-left {
  display: flex; gap: 20px;
}
.re08-topbar-right {
  display: flex; gap: 15px;
}

/* Header */
.re08-header {
  position: absolute;
  top: 40px; left: 0; width: 100%;
  z-index: 100;
}
.re08-header-inner {
  display: flex; justify-content: space-between; align-items: center; padding: 20px 0;
}
.re08-logo {
  font-size: 1.8rem; font-weight: 800; color: #fff; text-decoration: none; display: flex; align-items: center; gap: 10px;
}
.re08-logo-icon {
  width: 35px; height: 35px; background: #fff; border-radius: 5px; display: flex; align-items: center; justify-content: center; color: var(--primary);
}

/* Hero */
.re08-hero {
  position: relative;
  background-image: url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&w=1920&q=80');
  background-size: cover;
  background-position: center;
  min-height: 800px;
  display: flex;
  align-items: center;
}
.re08-hero::before {
  content: ''; position: absolute; top:0; left:0; width:100%; height:100%;
  background: rgba(var(--primary-rgb), 0.7); /* Primary color tint */
}
.re08-hero-content {
  position: relative; z-index: 2; width: 100%; display: flex; justify-content: space-between; align-items: center; padding-top: 50px;
}
.re08-hero-text {
  max-width: 600px; color: #fff; flex: 1;
}
.re08-hero-text h1 {
  color: #fff; font-size: 4rem; line-height: 1.2; margin-bottom: 20px;
}
.re08-hero-text p { font-size: 1.1rem; color: #eee; margin-bottom: 30px; }
.re08-hero-right-space {
  flex: 1;
}

/* About & Form - Floating Form */
.re08-about-form { padding: 0 0 100px 0; background: #fff; }
.re08-af-flex { display: flex; gap: 50px; position: relative; }
.re08-af-left { flex: 1.2; padding-top: 80px; }
.re08-af-left h4 { color: var(--secondary); font-size: 1rem; margin-bottom: 10px; }
.re08-af-left h2 { font-size: 2.5rem; margin-bottom: 20px; }
.re08-af-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-top: 40px; }
.re08-stat-item h3 { font-size: 2.5rem; color: var(--secondary); margin-bottom: 5px; }
.re08-stat-item p { font-weight: 600; color: #333; }

.re08-af-right {
  flex: 1;
  background: #fff;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 20px 50px rgba(0,0,0,0.1);
  border-top: 5px solid var(--secondary);
  margin-top: -200px; /* Floating over hero */
  position: relative;
  z-index: 10;
}
.re08-af-right h3 { font-size: 1.5rem; margin-bottom: 25px; text-align: center; color: var(--primary); }
.re08-input {
  width: 100%; padding: 15px; margin-bottom: 20px;
  border: 1px solid #eee; border-radius: 4px;
  background: #fdfdfd; font-family: inherit; font-size: 0.95rem;
}

/* Section Titles */
.re08-sec-title { text-align: center; margin-bottom: 50px; }
.re08-sec-title h4 { color: var(--secondary); font-size: 0.9rem; margin-bottom: 10px; }
.re08-sec-title h2 { font-size: 2.5rem; }

/* Projects */
.re08-projects { padding: 80px 0; background: #fff; }
.re08-proj-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; }
.re08-proj-card { border-radius: 8px; overflow: hidden; box-shadow: 0 5px 20px rgba(0,0,0,0.05); border: 1px solid #eee; }
.re08-proj-card img { width: 100%; height: 250px; object-fit: cover; }
.re08-proj-info { padding: 25px; background: #fff; }
.re08-proj-info h3 { font-size: 1.2rem; margin-bottom: 10px; }
.re08-proj-info p { font-size: 0.9rem; margin-bottom: 15px; color: #777; }

/* Services */
.re08-services { padding: 80px 0; background: rgba(var(--secondary-rgb), 0.05); }
.re08-srv-flex { display: flex; gap: 50px; align-items: center; }
.re08-srv-left { flex: 1; }
.re08-srv-right { flex: 1.2; display: grid; grid-template-columns: 1fr 1fr; gap: 30px; }
.re08-srv-item { background: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 5px 15px rgba(0,0,0,0.03); }
.re08-srv-icon { width: 50px; height: 50px; background: rgba(var(--secondary-rgb), 0.1); border-radius: 5px; display: flex; align-items: center; justify-content: center; margin-bottom: 15px; color: var(--secondary); }

/* FAQ Section */
.re08-faq { padding: 80px 0; background: #fff; }
.re08-faq-flex { display: flex; gap: 50px; }
.re08-faq-left { flex: 1; }
.re08-faq-left h4 { color: var(--secondary); font-size: 0.9rem; margin-bottom: 10px; }
.re08-faq-left h2 { font-size: 2.5rem; margin-bottom: 20px; }
.re08-faq-left p { color: #666; font-size: 1rem; line-height: 1.8; margin-bottom: 30px; }
.re08-faq-right { flex: 1.2; }
.re08-faq-item { border-bottom: 1px solid #eee; padding: 20px 0; }
.re08-faq-item h3 { font-size: 1.1rem; color: var(--primary); margin-bottom: 10px; }
.re08-faq-item p { color: #666; font-size: 0.95rem; margin: 0; }

/* Banner */
.re08-banner { padding: 80px 0; background: #eee; text-align: center; }
.re08-banner h2 { font-size: 2.2rem; margin-bottom: 30px; text-transform: uppercase; letter-spacing: 1px; color: var(--primary); }

/* Specs */
.re08-specs { padding: 80px 0; background: #fff; }
.re08-spec-icons { display: flex; justify-content: center; gap: 50px; margin-bottom: 50px; border-bottom: 1px solid #eee; padding-bottom: 30px; }
.re08-si-box { text-align: center; }
.re08-si-box svg { stroke: var(--secondary); width: 40px; height: 40px; margin-bottom: 10px; }
.re08-si-box h4 { font-size: 1rem; color: #111; }
.re08-spec-flex { display: flex; gap: 50px; align-items: center; }
.re08-spec-left { flex: 1; }
.re08-spec-list { list-style: none; padding: 0; margin-top: 20px; }
.re08-spec-list li { padding: 12px 0; display: flex; align-items: center; gap: 15px; font-weight: 500; color: #444; }
.re08-spec-list li::before { content: "✓"; color: #fff; background: var(--secondary); border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; }
.re08-spec-right { flex: 1.2; }
.re08-spec-right img { width: 100%; border-radius: 8px; }

/* Why Invest */
.re08-invest { padding: 80px 0; background: rgba(var(--secondary-rgb), 0.05); }
.re08-invest-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
.re08-invest-col h3 { font-size: 1.4rem; color: var(--primary); margin-bottom: 15px; }
.re08-invest-col p { color: #555; line-height: 1.7; margin-bottom: 20px; }

/* Places */
.re08-places { padding: 80px 0; background: #fff; }
.re08-place-icons { display: flex; justify-content: center; gap: 40px; margin-bottom: 40px; }
.re08-place-icons div { text-align: center; }
.re08-place-icons svg { width: 40px; height: 40px; stroke: var(--secondary); margin-bottom: 10px; fill: none; }
.re08-places-map { width: 100%; height: 400px; border-radius: 8px; background: #eee; display: flex; align-items: center; justify-content: center; overflow: hidden; }
.re08-places-map img { width: 100%; height: 100%; object-fit: cover; }

/* Agents */
.re08-agents { padding: 80px 0; background: rgba(var(--secondary-rgb), 0.05); }
.re08-agent-grid { display: flex; justify-content: center; gap: 40px; }
.re08-agent-card { background: #fff; display: flex; align-items: center; gap: 20px; padding: 20px; border-radius: 8px; box-shadow: 0 5px 15px rgba(0,0,0,0.05); width: 450px; }
.re08-agent-card img { width: 100px; height: 100px; border-radius: 5px; object-fit: cover; }

/* Reviews */
.re08-reviews { padding: 80px 0; background: #fff; }
.re08-rev-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; padding-top: 40px; }
.re08-rev-card { background: rgba(var(--secondary-rgb), 0.03); padding: 50px 30px 30px; border-radius: 8px; text-align: center; position: relative; margin-top: 40px; }
.re08-rev-card img { width: 80px; height: 80px; border-radius: 50%; object-fit: cover; position: absolute; top: -40px; left: 50%; transform: translateX(-50%); border: 4px solid #fff; }

/* Blog */
.re08-blog { padding: 80px 0; background: rgba(var(--secondary-rgb), 0.02); }

/* Footer */
.re08-footer { background: var(--primary); color: #ccc; padding: 80px 0 30px; }
.re08-foot-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 40px; margin-bottom: 50px; align-items: center; }
.re08-foot-col h3 { color: #fff; font-size: 1.2rem; margin-bottom: 15px; }
.re08-foot-col p { font-size: 0.9rem; line-height: 1.8; margin-bottom: 0; }
.re08-foot-bottom { text-align: center; padding-top: 30px; border-top: 1px solid rgba(255,255,255,0.1); font-size: 0.85rem; }

/* Modal */
.re08-modal-toggle { display: none; }
.re08-modal-toggle:checked ~ .re08-modal { display: flex; }
.re08-modal { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 9999; align-items: center; justify-content: center; backdrop-filter: blur(5px); }
.re08-modal-content { background: #fff; padding: 40px; border-radius: 8px; text-align: center; max-width: 400px; width: 90%; color: #333; }
.re08-modal-close { display: inline-block; padding: 12px 30px; background: var(--primary); color: #fff; text-decoration: none; border-radius: 4px; font-weight: bold; cursor: pointer; margin-top:20px; }

@media (max-width: 1024px) {
  .re08-topbar { display: none; }
  .re08-hero { min-height: auto; padding-bottom: 100px; }
  .re08-hero-content { flex-direction: column; text-align: center; }
  .re08-hero-right-space { display: none; }
  .re08-af-flex, .re08-srv-flex, .re08-spec-flex { flex-direction: column; }
  .re08-af-right { margin-top: -50px; width: 100%; }
  .re08-af-left { padding-top: 40px; text-align: center; }
  .re08-proj-grid, .re08-plan-grid, .re08-srv-right, .re08-rev-grid, .re08-foot-grid, .re08-gal-grid { grid-template-columns: 1fr; }
  .re08-agent-grid { flex-direction: column; align-items: center; }
  .re08-agent-card { width: 100%; }
}
`;

export const realEstate08Html = `
<div class="re08-wrap">

  <!-- Topbar -->
  <div class="re08-topbar">
    <div class="re08-container re08-topbar-inner">
      <div class="re08-topbar-left">
        <span><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-2px; margin-right:5px;"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg> +1 234 567 890</span>
        <span><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-2px; margin-right:5px;"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg> info@example.com</span>
      </div>
      <div class="re08-topbar-right">
        <span>Follow Us:</span>
        <a href="#" style="color:#ccc;">Fb</a>
        <a href="#" style="color:#ccc;">Tw</a>
        <a href="#" style="color:#ccc;">In</a>
      </div>
    </div>
  </div>

  <!-- Header (No Nav Menu) -->
  <header class="re08-header">
    <div class="re08-container re08-header-inner">
      <a href="#" class="re08-logo">
        LOGO_PLACEHOLDER
      </a>
      <a href="#contact" class="re08-btn">Get A Quote</a>
    </div>
  </header>

  <!-- Hero -->
  <section class="re08-hero">
    <div class="re08-container re08-hero-content">
      <div class="re08-hero-text">
        <h1>Book Your Dream Home With Invest</h1>
        <p>Find the perfect property tailored to your lifestyle. We offer exclusive listings in the most sought-after locations.</p>
        <a href="#contact" class="re08-btn">Discover More</a>
      </div>
      <div class="re08-hero-right-space"></div>
    </div>
  </section>

  <!-- About & Form (Floating Form) -->
  <section class="re08-about-form">
    <div class="re08-container re08-af-flex">
      <div class="re08-af-left">
        <h4>About Us</h4>
        <h2>Welcome to Invest Real Estate Agency</h2>
        <p>We provide comprehensive real estate services, from buying and selling to property management. Our dedicated team ensures you get the best deals and seamless transactions.</p>
        
        <div class="re08-af-stats">
          <div class="re08-stat-item">
            <h3>250+</h3>
            <p>Properties Sold</p>
          </div>
          <div class="re08-stat-item">
            <h3>150+</h3>
            <p>Happy Clients</p>
          </div>
          <div class="re08-stat-item">
            <h3>50+</h3>
            <p>Expert Agents</p>
          </div>
          <div class="re08-stat-item">
            <h3>15+</h3>
            <p>Years Experience</p>
          </div>
        </div>
      </div>
      
      <div class="re08-af-right" id="contact">
        <h3>Get In Touch With Us</h3>
        <form onsubmit="event.preventDefault(); document.getElementById('re08-modal-trigger').checked = true;">
          <input type="text" class="re08-input" placeholder="Your Name" required>
          <input type="email" class="re08-input" placeholder="Email Address" required>
          <input type="tel" class="re08-input" placeholder="Phone Number" required>
          <textarea class="re08-input" placeholder="Message" rows="5" required></textarea>
          <button type="submit" class="re08-btn" style="width:100%;">Submit Request</button>
        </form>
      </div>
    </div>
  </section>

  <!-- Projects -->
  <section class="re08-projects">
    <div class="re08-container">
      <div class="re08-sec-title">
        <h4>Our Projects</h4>
        <h2>Discover our exclusive property collections</h2>
      </div>
      <div class="re08-proj-grid">
        <div class="re08-proj-card">
          <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&w=600&q=80">
          <div class="re08-proj-info">
            <h3>Modern Glass Villa</h3>
            <p>A stunning architectural masterpiece with panoramic views and state-of-the-art amenities.</p>
            <a href="#" style="color:var(--secondary); font-weight:bold; text-decoration:none;">View Details &rarr;</a>
          </div>
        </div>
        <div class="re08-proj-card">
          <img src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&w=600&q=80">
          <div class="re08-proj-info">
            <h3>Urban Loft Apartment</h3>
            <p>Located in the heart of the city, offering a vibrant lifestyle and contemporary design.</p>
            <a href="#" style="color:var(--secondary); font-weight:bold; text-decoration:none;">View Details &rarr;</a>
          </div>
        </div>
        <div class="re08-proj-card">
          <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&w=600&q=80">
          <div class="re08-proj-info">
            <h3>Suburban Family Home</h3>
            <p>Spacious and serene, perfect for families looking for comfort and a strong community.</p>
            <a href="#" style="color:var(--secondary); font-weight:bold; text-decoration:none;">View Details &rarr;</a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Services -->
  <section class="re08-services">
    <div class="re08-container re08-srv-flex">
      <div class="re08-srv-left">
        <h4 style="color:var(--secondary); text-transform:uppercase; font-size:0.9rem; margin-bottom:10px;">Why Choose Us</h4>
        <h2>Our Agency Features</h2>
        <p>We provide a full spectrum of real estate services to meet all your needs. Whether you are buying, selling, or investing, we have you covered with expert advice and premium care.</p>
        <a href="#contact" class="re08-btn" style="background:var(--primary); margin-top:20px;">Contact Us</a>
      </div>
      <div class="re08-srv-right">
        <div class="re08-srv-item">
          <div class="re08-srv-icon">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
          </div>
          <h4>Property Sales</h4>
          <p style="font-size:0.85rem; color:#666;">Expert guidance in selling your property.</p>
        </div>
        <div class="re08-srv-item">
          <div class="re08-srv-icon">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
          </div>
          <h4>Property Buying</h4>
          <p style="font-size:0.85rem; color:#666;">Find the perfect home that fits your needs.</p>
        </div>
        <div class="re08-srv-item">
          <div class="re08-srv-icon">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
          </div>
          <h4>Commercial Real Estate</h4>
          <p style="font-size:0.85rem; color:#666;">Strategic investments in commercial properties.</p>
        </div>
        <div class="re08-srv-item">
          <div class="re08-srv-icon">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <h4>Property Management</h4>
          <p style="font-size:0.85rem; color:#666;">Comprehensive management for your assets.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- FAQ Section -->
  <section class="re08-faq">
    <div class="re08-container re08-faq-flex">
      <div class="re08-faq-left">
        <h4>Common Questions</h4>
        <h2>Everything You Need To Know</h2>
        <p>Buying or selling a home is a major life decision. We want to make sure you have all the information you need to make the best choice. Here are some of the most common questions we get from our clients.</p>
        <p>If you have any other questions, feel free to reach out to our dedicated support team. We are always here to help you navigate the real estate market.</p>
        <a href="#contact" class="re08-btn">Ask a Question</a>
      </div>
      <div class="re08-faq-right">
        <div class="re08-faq-item">
          <h3>How long does the buying process take?</h3>
          <p>The timeline can vary depending on several factors, including market conditions and financing approval. On average, it takes about 30 to 45 days from the time an offer is accepted to the closing date.</p>
        </div>
        <div class="re08-faq-item">
          <h3>Do I need a real estate agent to buy a home?</h3>
          <p>While it is possible to buy a home without an agent, having a professional by your side can save you time, money, and stress. We handle negotiations, paperwork, and ensure your best interests are protected.</p>
        </div>
        <div class="re08-faq-item">
          <h3>What should I look for during a home inspection?</h3>
          <p>A home inspection is crucial. Pay attention to the condition of the roof, foundation, plumbing, and electrical systems. We can recommend trusted inspectors to give you a comprehensive report.</p>
        </div>
        <div class="re08-faq-item">
          <h3>Are there hidden costs when buying a property?</h3>
          <p>In addition to the down payment, you should budget for closing costs, property taxes, homeowners insurance, and potential maintenance fees. We provide a clear breakdown of all expected costs upfront.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Banner -->
  <section class="re08-banner">
    <div class="re08-container">
      <h4 style="color:var(--secondary); text-transform:uppercase; letter-spacing:2px; margin-bottom:10px;">Don't Miss Out</h4>
      <h2>Make an appointment now</h2>
      <a href="#contact" class="re08-btn">Book Appointment</a>
    </div>
  </section>

  <!-- Specifications -->
  <section class="re08-specs">
    <div class="re08-container">
      <div class="re08-sec-title">
        <h4>Property Details</h4>
        <h2>Property Specifications</h2>
      </div>
      <div class="re08-spec-icons">
        <div class="re08-si-box">
          <svg viewBox="0 0 24 24"><path d="M3 13h18V8H3v5zm0-7h18V4H3v2zm0 14h18v-5H3v5z" fill="none" stroke="currentColor" stroke-width="2"/></svg>
          <h4>4 Beds</h4>
        </div>
        <div class="re08-si-box">
          <svg viewBox="0 0 24 24"><path d="M4 4h16v16H4z" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="2"/></svg>
          <h4>3 Baths</h4>
        </div>
        <div class="re08-si-box">
          <svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" fill="none" stroke="currentColor" stroke-width="2"/></svg>
          <h4>2 Garage</h4>
        </div>
        <div class="re08-si-box">
          <svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" fill="none" stroke="currentColor" stroke-width="2"/></svg>
          <h4>2,500 Sqft</h4>
        </div>
      </div>
      
      <div class="re08-spec-flex">
        <div class="re08-spec-left">
          <h3>Detailed Overview</h3>
          <p>This magnificent property offers unparalleled luxury and comfort. Built with the highest quality materials and attention to detail.</p>
          <ul class="re08-spec-list">
            <li>Open concept living and dining area</li>
            <li>Gourmet kitchen with top-tier appliances</li>
            <li>Spacious master suite with walk-in closet</li>
            <li>Private backyard oasis with pool</li>
            <li>Smart home automation system integrated</li>
          </ul>
        </div>
        <div class="re08-spec-right">
          <img src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?ixlib=rb-4.0.3&w=800&q=80">
        </div>
      </div>
    </div>
  </section>

  <!-- Why Invest Section -->
  <section class="re08-invest">
    <div class="re08-container">
      <div class="re08-sec-title">
        <h4>Investment Guide</h4>
        <h2>Why Invest in Real Estate Now?</h2>
      </div>
      <div class="re08-invest-grid">
        <div class="re08-invest-col">
          <h3>Stable Long-Term Growth</h3>
          <p>Real estate has historically proven to be one of the most stable and reliable long-term investments. Unlike the stock market, which can experience high volatility, property values generally appreciate over time, providing a solid foundation for building generational wealth.</p>
          <p>Additionally, real estate provides tangible value. You own a physical asset that can be leveraged, improved, or rented out for passive income.</p>
        </div>
        <div class="re08-invest-col">
          <h3>Tax Advantages & Passive Income</h3>
          <p>Investing in property offers numerous tax benefits, including deductions for mortgage interest, property taxes, and depreciation. These incentives can significantly lower your overall tax burden while you continue to generate cash flow from rental income.</p>
          <p>With our expert property management services, you can enjoy a truly passive income stream without the day-to-day hassles of being a landlord.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Places -->
  <section class="re08-places">
    <div class="re08-container">
      <div class="re08-sec-title">
        <h4>Location Highlights</h4>
        <h2>Nearby Places</h2>
      </div>
      <div class="re08-place-icons">
        <div><svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg><h4>Hospital</h4></div>
        <div><svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg><h4>School</h4></div>
        <div><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg><h4>Supermarket</h4></div>
        <div><svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg><h4>Gym</h4></div>
      </div>
      <div class="re08-places-map">
        <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&w=1200&q=80" alt="Map Placeholder">
      </div>
    </div>
  </section>

  <!-- Agents -->
  <section class="re08-agents">
    <div class="re08-container">
      <div class="re08-sec-title">
        <h4>Meet Our Team</h4>
        <h2>Our Agents</h2>
      </div>
      <div class="re08-agent-grid">
        <div class="re08-agent-card">
          <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&w=200&q=80">
          <div>
            <h3 style="margin-bottom:5px;">Sarah Connor</h3>
            <p style="color:var(--secondary); font-size:0.85rem; margin-bottom:10px;">Senior Agent</p>
            <div style="display:flex; gap:10px;">
              <a href="#" style="color:#666; text-decoration:none;">Fb</a>
              <a href="#" style="color:#666; text-decoration:none;">Tw</a>
              <a href="#" style="color:#666; text-decoration:none;">In</a>
            </div>
          </div>
        </div>
        <div class="re08-agent-card">
          <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&w=200&q=80">
          <div>
            <h3 style="margin-bottom:5px;">David Miller</h3>
            <p style="color:var(--secondary); font-size:0.85rem; margin-bottom:10px;">Broker</p>
            <div style="display:flex; gap:10px;">
              <a href="#" style="color:#666; text-decoration:none;">Fb</a>
              <a href="#" style="color:#666; text-decoration:none;">Tw</a>
              <a href="#" style="color:#666; text-decoration:none;">In</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Reviews -->
  <section class="re08-reviews">
    <div class="re08-container">
      <div class="re08-sec-title">
        <h4>Testimonials</h4>
        <h2>Client Reviews</h2>
      </div>
      <div class="re08-rev-grid">
        <div class="re08-rev-card">
          <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&w=150&q=80">
          <h4 style="margin-bottom:5px;">Emily White</h4>
          <p style="font-size:0.8rem; color:#888; margin-bottom:15px;">Home Buyer</p>
          <p>"An absolute pleasure to work with. They made buying my first home incredibly easy and stress-free."</p>
        </div>
        <div class="re08-rev-card">
          <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&w=150&q=80">
          <h4 style="margin-bottom:5px;">John Davis</h4>
          <p style="font-size:0.8rem; color:#888; margin-bottom:15px;">Investor</p>
          <p>"Highly professional and knowledgeable. Their insights helped me secure a highly profitable investment property."</p>
        </div>
        <div class="re08-rev-card">
          <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&w=150&q=80">
          <h4 style="margin-bottom:5px;">Lisa Johnson</h4>
          <p style="font-size:0.8rem; color:#888; margin-bottom:15px;">Home Seller</p>
          <p>"They sold my property above asking price within a week. I couldn't be happier with their strategy and execution."</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Blog -->
  <section class="re08-blog">
    <div class="re08-container">
      <div class="re08-sec-title">
        <h4>Our Blog</h4>
        <h2>Our News & Articles</h2>
      </div>
      <div class="re08-proj-grid">
        <div class="re08-proj-card">
          <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&w=600&q=80">
          <div class="re08-proj-info">
            <h4 style="font-size:1.1rem; margin-bottom:10px;">How Luxury Suite Offers the Perfect Blend</h4>
            <a href="#" style="color:var(--primary); font-weight:bold; text-decoration:none; font-size:0.9rem;">Read More &rarr;</a>
          </div>
        </div>
        <div class="re08-proj-card">
          <img src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&w=600&q=80">
          <div class="re08-proj-info">
            <h4 style="font-size:1.1rem; margin-bottom:10px;">Guest Spotlight: Memorable Moments at Villa</h4>
            <a href="#" style="color:var(--primary); font-weight:bold; text-decoration:none; font-size:0.9rem;">Read More &rarr;</a>
          </div>
        </div>
        <div class="re08-proj-card">
          <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&w=600&q=80">
          <div class="re08-proj-info">
            <h4 style="font-size:1.1rem; margin-bottom:10px;">Behind the Scenes: The Art of Creating Luxury</h4>
            <a href="#" style="color:var(--primary); font-weight:bold; text-decoration:none; font-size:0.9rem;">Read More &rarr;</a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Footer (No Nav Menus) -->
  <footer class="re08-footer">
    <div class="re08-container">
      <div class="re08-foot-grid">
        <div class="re08-foot-col">
          <a href="#" style="color:#fff; font-size:1.8rem; font-weight:bold; text-decoration:none; display:flex; align-items:center; gap:10px; margin-bottom:10px;">
             <div style="width:30px; height:30px; background:#fff; border-radius:4px; display:flex; align-items:center; justify-content:center; color:var(--primary); font-size:1rem;">H</div>
             LOGO_PLACEHOLDER
          </a>
          <p>Your trusted partner in finding the perfect property. We deliver excellence in every transaction and ensure absolute client satisfaction.</p>
        </div>
        <div class="re08-foot-col" style="text-align: right;">
          <h3 style="color:#fff; font-size:1.2rem; margin-bottom:15px;">Follow Us</h3>
          <div style="display:flex; gap:15px; justify-content:flex-end;">
            <a href="#" style="width:35px; height:35px; background:rgba(255,255,255,0.1); border-radius:50%; display:flex; align-items:center; justify-content:center; color:#fff; text-decoration:none;">Fb</a>
            <a href="#" style="width:35px; height:35px; background:rgba(255,255,255,0.1); border-radius:50%; display:flex; align-items:center; justify-content:center; color:#fff; text-decoration:none;">Tw</a>
            <a href="#" style="width:35px; height:35px; background:rgba(255,255,255,0.1); border-radius:50%; display:flex; align-items:center; justify-content:center; color:#fff; text-decoration:none;">In</a>
          </div>
        </div>
      </div>
      <div class="re08-foot-bottom">
        COPYRIGHT_PLACEHOLDER
      </div>
    </div>
  </footer>

  <!-- Success Modal -->
  <input type="checkbox" id="re08-modal-trigger" class="re08-modal-toggle">
  <div class="re08-modal">
    <div class="re08-modal-content">
      <h3 style="color:#111; margin-bottom:10px;">Success!</h3>
      <p style="color:#666; font-size:0.95rem;">Your message has been sent successfully. We will get back to you shortly.</p>
      <label for="re08-modal-trigger" class="re08-modal-close">Close</label>
    </div>
  </div>

</div>
`;
