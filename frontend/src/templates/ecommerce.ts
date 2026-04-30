export const ecommerceStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;900&display=swap');
  
  .shop-container { 
    margin: 0; 
    font-family: 'Outfit', sans-serif; 
    background: #ffffff; 
    color: #0f172a; 
    scroll-behavior: smooth; 
  }
  
  .shop-nav { 
    padding: 20px 8%; 
    display: flex; 
    justify-content: space-between; 
    align-items: center; 
    background: rgba(255, 255, 255, 0.8); 
    backdrop-filter: blur(20px);
    position: sticky; 
    top: 0; 
    z-index: 1000; 
    border-bottom: 1px solid rgba(0,0,0,0.05); 
  }
  
  .shop-logo { 
    font-size: 32px; 
    font-weight: 900; 
    letter-spacing: -1.5px; 
    color: PRIMARY_COLOR_PLACEHOLDER;
  }
  
  .shop-menu { display: flex; gap: 40px; align-items: center; }
  .shop-menu a { 
    text-decoration: none; 
    color: #475569; 
    font-weight: 500; 
    font-size: 15px; 
    transition: 0.4s cubic-bezier(0.4, 0, 0.2, 1); 
    position: relative;
  }
  .shop-menu a::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 0;
    height: 2px;
    background: PRIMARY_COLOR_PLACEHOLDER;
    transition: 0.3s;
  }
  .shop-menu a:hover { color: #0f172a; }
  .shop-menu a:hover::after { width: 100%; }
  
  .shop-icons { display: flex; gap: 25px; align-items: center; }
  .icon-btn { cursor: pointer; font-size: 20px; transition: 0.3s; color: #1e293b; }
  .icon-btn:hover { transform: translateY(-2px); color: #0f172a; }
  
  .mobile-toggle { display: none; font-size: 28px; cursor: pointer; color: #0f172a; }
  
  .shop-hero { 
    position: relative; 
    height: 95vh; 
    display: flex; 
    align-items: center; 
    overflow: hidden;
    background: #000;
  }

  .hero-video-bg {
    position: absolute;
    top: 50%;
    left: 50%;
    min-width: 100%;
    min-height: 100%;
    width: auto;
    height: auto;
    transform: translate(-50%, -50%);
    z-index: 1;
    object-fit: cover;
    opacity: 0.7;
  }

  .hero-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.2) 100%);
    z-index: 2;
  }

  .shop-hero-content { 
    position: relative;
    z-index: 10;
    padding: 0 8%;
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 60px;
  }

  .hero-text-side {
    flex: 1;
    max-width: 600px;
  }

  .hero-form-side {
    flex: 1;
    display: flex;
    justify-content: flex-end;
  }

  .shop-tag { 
    display: inline-block;
    padding: 8px 16px;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 50px;
    font-size: 13px; 
    font-weight: 600; 
    color: #f8fafc; 
    text-transform: uppercase; 
    margin-bottom: 25px; 
    letter-spacing: 2px; 
    animation: fadeInUp 0.8s ease backwards;
  }

  .shop-hero-content h1 { 
    font-size: 96px; 
    line-height: 0.9; 
    font-weight: 900; 
    margin-bottom: 30px; 
    letter-spacing: -4px; 
    animation: tracking-in-expand 0.8s cubic-bezier(0.215, 0.610, 0.355, 1.000) both;
  }

  @keyframes tracking-in-expand {
    0% { letter-spacing: -0.5em; opacity: 0; }
    40% { opacity: 0.6; }
    100% { opacity: 1; }
  }

  .shop-hero-content p { 
    font-size: 22px; 
    color: #e2e8f0; 
    margin-bottom: 45px; 
    max-width: 550px; 
    line-height: 1.5;
    animation: fadeInUp 0.8s ease 0.4s backwards;
  }
  
  .hero-form {
    margin-top: 40px;
    display: flex;
    flex-direction: column;
    gap: 15px;
    max-width: 450px;
    animation: fadeInUp 0.8s ease 0.6s backwards;
    background: rgba(255, 255, 255, 0.05);
    padding: 30px;
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
  }
  .hero-input {
    width: 100%;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    padding: 15px 20px;
    color: white;
    border-radius: 6px;
    outline: none;
    font-size: 14px;
    transition: 0.3s;
  }
  .hero-input::placeholder { color: rgba(255, 255, 255, 0.5); }
  .hero-input:focus { border-color: white; background: rgba(255, 255, 255, 0.15); }

  .btn-hero-submit {
    background: white;
    color: #0f172a;
    border: none;
    padding: 15px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 2px;
    border-radius: 6px;
    cursor: pointer;
    transition: 0.4s;
    font-size: 13px;
    width: 100%;
    margin-top: 10px;
  }
  .btn-hero-submit:hover {
    background: PRIMARY_COLOR_PLACEHOLDER;
    color: white;
    transform: translateY(-2px);
  }
  
  .info-band { 
    padding: 60px 8%; 
    background: #f8fafc; 
    display: flex; 
    justify-content: space-between; 
    gap: 40px;
  }
  .info-item { 
    display: flex; 
    flex-direction: column;
    align-items: center; 
    gap: 15px; 
    text-align: center;
    flex: 1;
  }
  .info-icon {
    width: 60px;
    height: 60px;
    background: #fff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    box-shadow: 0 10px 20px rgba(0,0,0,0.05);
  }
  .info-item b { font-size: 15px; font-weight: 700; letter-spacing: 0.5px; color: #0f172a; }
  .info-item p { font-size: 14px; color: #64748b; margin-top: 5px; }

  .products-section { padding: 140px 8%; text-align: center; background: #fff; }
  .section-header { margin-bottom: 80px; }
  .section-header h2 { font-size: 56px; font-weight: 900; letter-spacing: -2px; color: #0f172a; }
  .section-header p { font-size: 18px; color: #64748b; margin-top: 15px; }

  .shop-grid { 
    display: grid; 
    grid-template-columns: repeat(4, 1fr); 
    gap: 40px; 
  }
  .product-card { 
    text-align: left; 
    position: relative; 
    cursor: pointer;
    group;
  }
  .product-img-wrap { 
    width: 100%; 
    aspect-ratio: 4/5; 
    overflow: hidden; 
    margin-bottom: 25px; 
    position: relative; 
    background: #f1f5f9;
    border-radius: 8px;
  }
  .product-img { 
    width: 100%; 
    height: 100%; 
    object-fit: cover; 
    transition: 1s cubic-bezier(0.19, 1, 0.22, 1); 
  }
  .product-card:hover .product-img { transform: scale(1.1); }
  
  .product-info h3 { font-size: 18px; font-weight: 600; margin-bottom: 8px; color: #1e293b; }
  .product-info .price { font-size: 16px; color: #64748b; font-weight: 400; }
  
  .promo-banner { 
    display: grid;
    grid-template-columns: 1fr 1fr;
    height: 700px; 
    background: PRIMARY_COLOR_PLACEHOLDER; 
    color: #fff; 
    border: 1px solid rgba(0,0,0,0.1);
    overflow: hidden;
  }
  .promo-content { 
    padding: 100px; 
    display: flex; 
    flex-direction: column; 
    justify-content: center; 
    align-items: flex-start;
  }
  .promo-img { 
    background: url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80') center/cover; 
    transition: 1.5s;
  }
  .promo-banner:hover .promo-img { transform: scale(1.05); }

  .shop-form-section { padding: 160px 8%; background: #f8fafc; position: relative; }
  .shop-form-box { 
    max-width: 800px; 
    margin: 0 auto; 
    background: #fff; 
    padding: 100px; 
    border-radius: 20px; 
    box-shadow: 0 40px 100px rgba(0,0,0,0.08); 
    text-align: center;
  }
  .shop-form-box h2 { font-size: 48px; margin-bottom: 25px; font-weight: 900; letter-spacing: -1.5px; }
  .shop-form-box p { font-size: 18px; color: #64748b; margin-bottom: 50px; }
  
  .premium-input-group { 
    display: flex;
    gap: 15px;
    max-width: 500px;
    margin: 0 auto;
  }
  .premium-input { 
    flex: 1;
    background: #f1f5f9; 
    border: 2px solid transparent; 
    padding: 20px 25px; 
    outline: none; 
    border-radius: 8px;
    font-size: 16px;
    transition: 0.3s;
  }
  .premium-input:focus { 
    background: #fff;
    border-color: #0f172a; 
  }

  .shop-footer { padding: 120px 8% 60px; background: #fff; border-top: 1px solid #f1f5f9; }
  .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 80px; margin-bottom: 100px; }
  .footer-col h4 { font-size: 14px; font-weight: 800; margin-bottom: 35px; text-transform: uppercase; letter-spacing: 2px; color: #0f172a; }
  .footer-col ul { list-style: none; padding: 0; }
  .footer-col ul li { margin-bottom: 18px; }
  .footer-col ul li a { text-decoration: none; color: #64748b; font-size: 15px; transition: 0.3s; }
  .footer-col ul li a:hover { color: #0f172a; padding-left: 5px; }

  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 1024px) {
    .shop-hero-content { 
      flex-direction: column; 
      text-align: center; 
      gap: 40px; 
      padding-top: 60px;
      padding-bottom: 60px;
    }
    .hero-text-side { max-width: 100%; }
    .hero-form-side { justify-content: center; width: 100%; }
    .shop-hero { height: auto; min-height: 100vh; }
    .shop-hero-content h1 { font-size: 64px; }
    .shop-grid { grid-template-columns: repeat(2, 1fr); }
    .footer-grid { grid-template-columns: repeat(2, 1fr); gap: 40px; }
  }

  @media (max-width: 768px) {
    .shop-nav { padding: 15px 5%; }
    .shop-menu { display: none; }
    .mobile-toggle { display: block; }
    .shop-hero-content h1 { font-size: 48px; letter-spacing: -2px; }
    .promo-banner { grid-template-columns: 1fr; height: auto; }
    .promo-content { padding: 60px 5%; }
    .promo-img { height: 400px; }
    .info-band { grid-template-columns: 1fr 1fr; display: grid; }
    .shop-form-box { padding: 60px 20px; }
    .premium-input-group { flex-direction: column; }
  }

  /* Page Loader */
  .page-loader {
    position: fixed;
    inset: 0;
    background: #fff;
    display: none;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 10001;
  }
  .loader-circle {
    width: 50px;
    height: 50px;
    border: 3px solid #f1f5f9;
    border-top: 3px solid PRIMARY_COLOR_PLACEHOLDER;
    border-radius: 50%;
    animation: spin 1s infinite linear;
    margin-bottom: 20px;
  }
  @keyframes spin { 100% { transform: rotate(360deg); } }
`;

export const ecommerceHtml = `
  <div class="shop-container">
    <nav class="shop-nav">
      <div class="shop-logo">LOGO_PLACEHOLDER</div>
      <div class="mobile-toggle">☰</div>
      <div class="shop-menu">
        <a href="#collection">Aesthetic</a>
        <a href="#essential">Essentials</a>
        <a href="#about">Philosophy</a>
      </div>
      <div class="shop-icons">
        <span class="icon-btn">🔍</span>
        <span class="icon-btn">👤</span>
        <span class="icon-btn">👜 <small style="font-size: 12px; vertical-align: top;">(0)</small></span>
      </div>
    </nav>

    <div class="shop-hero">
      <video class="hero-video-bg" autoplay muted loop playsinline>
        <source src="/assets/video/mixkit-two-young-girls-having-fun-dancing-and-posing-to-the-42298-hd-ready.mp4" type="video/mp4">
      </video>
      <div class="hero-overlay"></div>
      <div class="shop-hero-content">
        <div class="hero-text-side">
          <span class="shop-tag">Limited Edition 2026</span>
          <h1>Rare Artistry for Every Day.</h1>
          <p>Defined by precision and crafted for the modern visionary. Experience the new standard in premium minimalist luxury.</p>
          <div style="margin-top: 20px; font-size: 14px; opacity: 0.6; animation: fadeInUp 0.8s ease 0.8s backwards;">
            Featured in Vogue, GQ, and Elle.
          </div>
        </div>

        <div class="hero-form-side">
          <form class="hero-form" style="margin-top: 0;">
            <div style="margin-bottom: 20px;">
              <h3 style="font-size: 24px; font-weight: 900; margin-bottom: 8px;">Contact PROJECT_NAME_PLACEHOLDER</h3>
              <p style="font-size: 14px; opacity: 0.7;">Be the first to know about new drops.</p>
            </div>
            <input type="text" class="hero-input" placeholder="Full Name" required />
            <input type="email" class="hero-input" placeholder="Email Address" required />
            <input type="tel" class="hero-input" placeholder="Mobile Number" required />
            <select class="hero-input" style="appearance: none; cursor: pointer;">
              <option value="" disabled selected>Interest: Select Collection</option>
              <option value="watch">Luxury Watches</option>
              <option value="bags">Designer Bags</option>
              <option value="footwear">Premium Footwear</option>
            </select>
            <button type="submit" class="btn-hero-submit">Request Access</button>
          </form>
        </div>
      </div>
    </div>

    <div class="info-band">
      <div class="info-item">
        <div class="info-icon">🌎</div>
        <b>Global Delivery</b>
        <p>Premium shipping to 120+ countries</p>
      </div>
      <div class="info-item">
        <div class="info-icon">💎</div>
        <b>Master Craftsmanship</b>
        <p>Hand-picked materials only</p>
      </div>
      <div class="info-item">
        <div class="info-icon">♻️</div>
        <b>Sustainability</b>
        <p>Recycled luxury packaging</p>
      </div>
      <div class="info-item">
        <div class="info-icon">🥂</div>
        <b>Priority Support</b>
        <p>24/7 Concierge service</p>
      </div>
    </div>

    <div class="products-section" id="collection">
      <div class="section-header">
        <h2>Seasonal Curations</h2>
        <p>The pieces that define our current design language.</p>
      </div>
      <div class="shop-grid">
        <div class="product-card">
          <div class="product-img-wrap">
            <img src="/assets/premium/watch.png" class="product-img" alt="Lumiere Watch" />
          </div>
          <div class="product-info">
            <h3>L'Artiste Watch</h3>
            <p class="price">$1,249.00</p>
          </div>
        </div>
        <div class="product-card">
          <div class="product-img-wrap">
            <img src="/assets/premium/bag.png" class="product-img" alt="Sleek Handbag" />
          </div>
          <div class="product-info">
            <h3>Minimalist Carryall</h3>
            <p class="price">$890.00</p>
          </div>
        </div>
        <div class="product-card">
          <div class="product-img-wrap">
            <img src="/assets/premium/sneakers.png" class="product-img" alt="Luxury Sneakers" />
          </div>
          <div class="product-info">
            <h3>The Urban Runner</h3>
            <p class="price">$450.00</p>
          </div>
        </div>
        <div class="product-card">
          <div class="product-img-wrap">
            <img src="/assets/premium/scarf.png" class="product-img" alt="Silk Scarf" />
          </div>
          <div class="product-info">
            <h3>Ethereal Silk Scarf</h3>
            <p class="price">$225.00</p>
          </div>
        </div>
      </div>
    </div>

    <div class="promo-banner" id="promo">
      <div class="promo-content">
        <span style="letter-spacing: 3px; font-size: 13px; font-weight: 600; margin-bottom: 20px; opacity: 0.7;">PHILOSOPHY</span>
        <h2 style="font-size: 64px; font-weight: 900; margin-bottom: 25px; line-height: 1;">Less, but Better.</h2>
        <p style="font-size: 20px; margin-bottom: 45px; opacity: 0.8; line-height: 1.6; max-width: 500px;">We believe in the power of simplicity. Every stitch and every detail is intentional, creating timeless pieces that transcend seasons.</p>
        <button class="btn-shop-premium">Read Our Story</button>
      </div>
      <div class="promo-img"></div>
    </div>

    <div class="shop-form-section" id="contact">
      <div class="shop-form-box">
        <h2>The Collective</h2>
        <p>Be the first to experience our limited drops and private events.</p>
        <form>
          <div class="premium-input-group">
            <input type="email" class="premium-input" placeholder="Your email address" required />
            <button type="submit" class="btn-shop-premium">Join Now</button>
          </div>
        </form>
      </div>
    </div>

    <footer class="shop-footer">
      <div class="footer-grid">
        <div class="footer-col">
          <div class="shop-logo" style="margin-bottom: 30px;">LOGO_PLACEHOLDER</div>
          <p style="color: #64748b; line-height: 1.8; font-size: 15px;">FOOTER_DESCRIPTION_PLACEHOLDER</p>
          <div style="margin-top: 30px; display: flex; gap: 20px; font-size: 20px; opacity: 0.6;">
            <span></span> <span></span> <span></span> <span></span>
          </div>
        </div>
        <div class="footer-col">
          <h4>Boutique</h4>
          <ul>
            <li><a href="#">New Releases</a></li>
            <li><a href="#">Best Sellers</a></li>
            <li><a href="#">Collections</a></li>
            <li><a href="#">Care Guide</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Maison</h4>
          <ul>
            <li><a href="#">Our Story</a></li>
            <li><a href="#">Sustainability</a></li>
            <li><a href="#">Careers</a></li>
            <li><a href="#">Journal</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Concierge</h4>
          <ul>
            <li><a href="#">Shipping</a></li>
            <li><a href="#">Returns</a></li>
            <li><a href="#">Contact Us</a></li>
            <li><a href="#">FAQ</a></li>
          </ul>
        </div>
      </div>
      <div style="padding-top: 50px; border-top: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center; color: #94a3b8; font-size: 13px;">
        <p>© 2026 PROJECT_NAME_PLACEHOLDER. All Rights Reserved.</p>
        <div style="display: flex; gap: 30px;">
          <span>Privacy</span>
          <span>Terms</span>
          <span>Cookies</span>
        </div>
      </div>
    </footer>

    <div id="loader" class="page-loader">
      <div class="loader-circle"></div>
      <div style="font-weight: 600; color: #0f172a; letter-spacing: 2px; font-size: 10px; margin-top: 10px;">PREPARING PRIVILEGED ACCESS...</div>
    </div>

    <script>
      console.log('Ecommerce Template Loaded');
    </script>
  </div>
`;

