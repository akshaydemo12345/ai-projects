export const saasHeroHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <style>
    body { margin: 0; font-family: 'Inter', Arial, sans-serif; background-color: #f9f9f9; }
    * { box-sizing: border-box; }
    
    .header { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; padding: 15px 5vw; background: white; border-bottom: 2px solid #f0f0f0; }
    .logo-container { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
    .logo-img { max-width: 180px; max-height: 50px; object-fit: contain; }
    .contact-info { text-align: right; }
    .contact-info p { color: #666; font-size: 14px; margin: 0 0 5px; }
    .contact-info h2 { color: var(--primary, #229c54); font-size: 28px; margin: 0; font-weight: normal; }

    .hero { position: relative; background: url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80') center/cover no-repeat; padding: 60px 5vw; display: flex; flex-direction: column; justify-content: space-between; color: white; min-height: 500px; gap: 40px; }
    @media (min-width: 768px) { .hero { flex-direction: row; } }
    .hero-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.5); z-index: 1; }
    .hero-content { position: relative; z-index: 10; flex: 1; max-width: 600px; padding-top: 20px; }
    
    .offer-box { background: rgba(255, 255, 255, 0.95); color: #333; padding: 20px 20px 20px 100px; position: relative; margin-bottom: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
    .badge { background: var(--primary, #229c54); color: white; border-radius: 50%; width: 110px; height: 110px; display: flex; flex-direction: column; align-items: center; justify-content: center; font-weight: bold; text-align: center; line-height: 1.1; font-size: 28px; position: absolute; left: -20px; top: 50%; transform: translateY(-50%); box-shadow: 0 5px 15px rgba(34, 156, 84, 0.4); }
    .badge small { font-size: 14px; font-weight: normal; }
    .offer-box h3 { margin: 0 0 5px; font-size: 18px; line-height: 1.2; }
    .offer-box p { font-size: 14px; margin: 0; color: #666; }
    
    .headline { font-size: clamp(32px, 5vw, 48px); text-transform: uppercase; line-height: 1.1; font-weight: 300; text-shadow: 0 2px 4px rgba(0,0,0,0.5); }
    .headline strong { font-weight: 800; font-size: clamp(38px, 6vw, 56px); display: block; margin: 5px 0; }
    
    .form-box { position: relative; z-index: 10; background: white; padding: 30px; width: 100%; max-width: 380px; box-shadow: 0 15px 35px rgba(0,0,0,0.2); border-top: 4px solid var(--secondary, #e31837); color: #333; margin: 0 auto; }
    .form-box h2 { text-align: center; color: #333; margin: 0 0 20px; font-size: 22px; font-weight: 600; line-height: 1.3; }
    .form-box input, .form-box select, .form-box textarea { width: 100%; padding: 12px 15px; margin-bottom: 12px; border: 1px solid #ddd; border-radius: 4px; background: #fdfdfd; font-family: inherit; font-size: 14px; }
    .form-box input:focus, .form-box select:focus, .form-box textarea:focus { outline: none; border-color: var(--primary, #229c54); }
    .form-box button { width: 100%; padding: 15px; background: var(--primary, #229c54); color: white; border: none; border-radius: 4px; font-size: 18px; font-weight: bold; cursor: pointer; transition: background 0.3s; margin-top: 10px; }
    .form-box button:hover { opacity: 0.9; }
    
    .features-band { background: rgba(0,0,0,0.85); color: white; padding: 40px 5vw; display: flex; flex-direction: column; gap: 30px; align-items: center; }
    .feature-check { text-align: center; }
    .feature-check h1 { color: var(--secondary, #e31837); font-size: 70px; margin: 0; line-height: 0.8; }
    .feature-check p { font-weight: bold; font-size: 18px; margin-top: 10px; letter-spacing: 1px; }
    .feature-text { max-width: 800px; text-align: center; }
    .feature-text h2 { margin: 0 0 15px; font-size: 24px; font-weight: 400; line-height: 1.3; }
    .feature-text p { font-size: 15px; margin: 0; line-height: 1.6; color: #d0d0d0; }
    
    .reviews-section { padding: 50px 5vw; text-align: center; background: white; }
    .reviews-box { border: 1px solid #eee; display: inline-block; padding: 30px 4vw; max-width: 600px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
    .reviews-box h3 { color: var(--primary, #229c54); margin: 0 0 10px; font-size: 22px; font-weight: 400; }
    .stars { color: #f59e0b; font-size: 28px; margin: 15px 0; letter-spacing: 2px; }
    .stars span { color: #333; font-size: 16px; font-weight: bold; vertical-align: middle; margin-left: 10px; }
    
    .content-area { padding: 40px 5vw 60px; max-width: 1000px; margin: 0 auto; line-height: 1.7; color: #444; }
    .content-area h2 { color: var(--secondary, #e31837); font-weight: 300; font-size: 28px; margin-bottom: 20px; }
    .content-area p { margin-bottom: 20px; font-size: 16px; }
    .split-content { display: flex; flex-direction: column; gap: 30px; margin-top: 40px; }
    .split-content img { width: 100%; max-width: 400px; height: auto; object-fit: cover; border-left: 4px solid var(--secondary, #e31837); margin: 0 auto; }
    
    .cta-band { background: var(--primary, #229c54); color: white; padding: 30px 5vw; text-align: center; border-top: 10px solid rgba(0,0,0,0.1); display: flex; flex-wrap: wrap; justify-content: center; gap: 20px; align-items: center; }
    .cta-band h2 { margin: 0; font-weight: 400; font-size: 22px; }
    .cta-band p { margin: 0; font-size: 24px; font-weight: bold; }
    
    .footer-action { background: #333; color: white; text-align: center; padding: 60px 5vw; }
    .footer-action p { max-width: 600px; margin: 0 auto 30px; font-size: 16px; line-height: 1.5; color: #ddd; }
    .footer-action button { background: var(--secondary, #e31837); color: white; padding: 15px 40px; border: none; border-radius: 4px; font-size: 18px; font-weight: bold; cursor: pointer; transition: background 0.3s; }
    .footer-action button:hover { opacity: 0.9; }
    
    .footer { background: #222; color: #888; padding: 20px 5vw; display: flex; flex-wrap: wrap; justify-content: space-between; font-size: 12px; gap: 15px; }

    @media (min-width: 768px) {
      .header { padding: 20px 50px; }
      .contact-info { text-align: right; }
      .hero { flex-direction: row; padding: 80px 50px; }
      .hero-content { padding-top: 40px; }
      .features-band { flex-direction: row; justify-content: center; padding: 50px; }
      .feature-check { text-align: left; padding-right: 40px; border-right: 1px solid #444; }
      .feature-text { text-align: left; padding-left: 10px; }
      .split-content { flex-direction: row; align-items: flex-start; }
      .split-content img { flex: 0 0 350px; margin: 0; }
      .cta-band { justify-content: space-between; padding: 30px 50px; text-align: left; }
    }
  </style>
</head>
<body>

  <!-- Header -->
  <div class="header" data-gjs-type="header">
    <div class="logo-container">
      <img src="https://via.placeholder.com/150x50?text=LOGO" alt="Logo" class="logo-img" data-gjs-type="image" id="page-logo" />
    </div>
    <div class="contact-info">
      <p>Call Us Now, For A Free Consultation</p>
      <h2>858-201-6742</h2>
    </div>
  </div>

  <!-- Hero with Form -->
  <div class="hero" data-gjs-type="section">
    <div class="hero-overlay"></div>
    <div class="hero-content">
      <div class="offer-box">
        <div class="badge">30%<br/><small>OFF</small></div>
        <h3>Your Entire Project<br/><span style="color: var(--primary, #229c54); font-style: italic; font-size: 22px;">PLUS</span></h3>
        <p>No Money Down, No Payment<br/>For 12 Months</p>
      </div>
      <div class="headline">
        A LOT CAN<br/><strong>CHANGE <sup style="font-size: clamp(16px, 3vw, 24px); font-weight: 300; vertical-align: middle;">IN 20<br>YEARS</sup></strong>
        YOUR WINDOWS<br/><strong>SHOULDN'T</strong>
      </div>
    </div>
    
    <div class="form-box" data-gjs-type="form">
      <h2>Request a Free Quote<br/>and Consultation</h2>
      <form>
        <input type="text" placeholder="Name *" required>
        <input type="text" placeholder="Address">
        <input type="text" placeholder="City">
        <input type="tel" placeholder="Phone *" required>
        <input type="email" placeholder="Email *" required>
        <textarea placeholder="Comment" rows="3"></textarea>
        <select>
          <option>How did you hear about us?</option>
          <option>Search Engine</option>
          <option>Social Media</option>
          <option>Friend/Family</option>
          <option>TV/Radio</option>
        </select>
        <button type="submit" class="btn-primary">Get a Quote Now!</button>
      </form>
    </div>
  </div>

  <!-- Features Band -->
  <div class="features-band" data-gjs-type="section">
    <div class="feature-check">
      <h1>✓</h1>
      <p>TESTED<br/>&amp; PROVEN</p>
    </div>
    <div class="feature-text">
      <h2>20 Years Later, Durability Analysis Shows Renewal By Andersen Windows Stand The Test Of Time</h2>
      <p>2015 marked Renewal by Andersen's 20th anniversary as the full service replacement window division of Andersen Corporation. To celebrate, we took some of the first Renewal by Andersen windows ever installed in our home state of Minnesota, removed them, and extensively tested them. What did we find? After 20 years of extreme temperatures, our exclusive Fibrex® material stands the test of time. There was no pitting, cracking, peeling or chipping.</p>
    </div>
  </div>

  <!-- Reviews -->
  <div class="reviews-section" data-gjs-type="section">
    <div class="reviews-box">
      <h3>Read the Reviews</h3>
      <p style="font-size: 15px; color: #555; margin: 0;">Don't just take word for it, there are projects that have been done in your area.</p>
      <div class="stars">★★★★★ <span>4.5 out of 5 average rating</span></div>
      <p style="font-size: 13px; margin: 0; color: #666;">Check out more reviews at <a href="#" style="color: var(--secondary, #e31837); text-decoration: none; font-weight: bold;">our website</a></p>
    </div>
  </div>

  <!-- Content Area -->
  <div class="content-area" data-gjs-type="section">
    <h2>Welcome to Renewal by Andersen</h2>
    <p>Your locally owned Renewal by Andersen is your #1 window company in Iowa when it comes to quality replacement windows and doors. You can rest assured we are the community's only local retailer that provides Andersen doors at an affordable price with expert installation. Rely on us to provide you with a wide selection of durable, low-maintenance windows and doors that will give you many years of enjoyment and energy efficiency.</p>
    <p>Renewal by Andersen is proud to say it has put in more than two million windows in more than 300,000 homes. As the only local retailer that can get you an unbeatable deal on quality products, we are able to use our knowledge and experience learned from years of training in Renewal by Andersen factories. As such, we can offer one of the strongest window and door replacement limited warranties you will ever find.*</p>
    
    <div class="split-content">
      <img src="https://images.unsplash.com/photo-1761839258075-585182da7521?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw4fHx8ZW58MHx8fHx8" alt="Window installer" />
      <div>
        <h3 style="color: #333; margin: 0 0 15px; font-size: 22px; font-weight: 600;">Renewal by Andersen Windows Stand the Test of Time &amp; Mother Nature</h3>
        <p>Homeowners in Iowa need windows that can withstand intense weather conditions. Renewal by Andersen windows are tough and durable, using construction certified glass for durability and Renewal by Andersen's exclusive Fibrex® frame material. Made and tested in Cottage Grove, Minnesota, Renewal by Andersen knows what is needed to construct a high-quality replacement window or door for our extreme climate.</p>
        <p>Whether you are looking to replace each window in a particular room or for your entire house, Renewal by Andersen has you covered. Our team of Renewal by Andersen Certified Master Installers has worked closely with thousands of homeowners delivering window replacement projects that lead to more beautiful, energy efficient, valuable homes.</p>
      </div>
    </div>
  </div>

  <!-- Call to action band -->
  <div class="cta-band" data-gjs-type="section">
    <h2>The <strong>Better Way</strong> to a <strong>Better Window</strong></h2>
    <p>Call us today at 319-274-9547</p>
  </div>

  <!-- Footer Action -->
  <div class="footer-action" data-gjs-type="section">
    <p>You can request a free window or door consultation and receive additional information about our products by calling <strong>319-274-9547</strong>. Call today to schedule a free in-home consultation.</p>
    <button type="submit" class="btn-primary">Get Started Now!</button>
  </div>

  <!-- Footer -->
  <div class="footer" data-gjs-type="footer">
    <div>Andersen Corporation. ©2015 Andersen Corporation. All rights reserved.</div>
    <div>
      <a href="#" style="color: #888; text-decoration: none; margin-left: 10px;">Facebook</a>
      <a href="#" style="color: #888; text-decoration: none; margin-left: 10px;">Twitter</a>
      <a href="#" style="color: #888; text-decoration: none; margin-left: 10px;">Instagram</a>
    </div>
  </div>

</body>
</html>
`;
