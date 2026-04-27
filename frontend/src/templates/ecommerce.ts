export const ecommerceStyles = `
  .shop-container { margin: 0; font-family: 'Inter', sans-serif; background: #fff; color: #111; scroll-behavior: smooth; }
  .shop-nav { padding: 15px 5%; display: flex; justify-content: space-between; align-items: center; background: #fff; position: sticky; top: 0; z-index: 1000; border-bottom: 1px solid #eee; }
  .shop-logo { font-size: 28px; font-weight: 900; letter-spacing: -1px; }
  .shop-menu { display: flex; gap: 30px; align-items: center; }
  .shop-menu a { text-decoration: none; color: #111; font-weight: 600; font-size: 14px; transition: 0.3s; }
  .shop-menu a:hover { color: #db2777; }
  .shop-icons { display: flex; gap: 20px; align-items: center; }
  .mobile-toggle { display: none; font-size: 24px; cursor: pointer; color: #db2777; }
  
  .shop-hero { display: flex; height: 85vh; background: #fdf2f8; overflow: hidden; position: relative; }
  .shop-hero-text { flex: 1.2; padding: 0 5% 0 8%; display: flex; flex-direction: column; justify-content: center; position: relative; z-index: 10; }
  .shop-tag { font-size: 14px; font-weight: 700; color: #db2777; text-transform: uppercase; margin-bottom: 20px; letter-spacing: 2px; }
  .shop-hero-text h1 { font-size: 84px; line-height: 0.95; font-weight: 900; color: #111; margin-bottom: 30px; letter-spacing: -2px; }
  .shop-hero-text p { font-size: 20px; color: #4b5563; margin-bottom: 40px; max-width: 500px; }
  
  .btn-shop { background: #111; color: #fff; padding: 22px 48px; font-weight: 700; text-decoration: none; display: inline-block; transition: 0.3s; font-size: 16px; border: none; cursor: pointer; }
  .btn-shop:hover { background: #db2777; transform: translateX(10px); }
  
  .shop-hero-img { flex: 1; background: url('https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80') center/cover; }
  
  .info-band { padding: 40px 8%; background: #fff; display: flex; justify-content: space-between; border-bottom: 1px solid #eee; }
  .info-item { display: flex; align-items: center; gap: 15px; }
  .info-item b { font-size: 14px; text-transform: uppercase; letter-spacing: 1px; }

  .products-section { padding: 120px 8%; text-align: center; }
  .shop-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 30px; margin-top: 60px; }
  .product-card { text-align: left; position: relative; }
  .product-img-wrap { width: 100%; aspect-ratio: 3/4; overflow: hidden; margin-bottom: 20px; position: relative; }
  .product-img { width: 100%; h-full: 100%; object-fit: cover; transition: 0.6s; }
  .product-card:hover .product-img { transform: scale(1.1); }
  
  .promo-banner { display: flex; height: 500px; background: #111; color: #fff; }
  .promo-content { flex: 1; padding: 80px; display: flex; flex-direction: column; justify-content: center; }
  .promo-img { flex: 1; background: url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80') center/cover; }

  .shop-form-section { padding: 120px 8%; background: #fdf2f8; text-align: center; }
  .shop-form-box { max-width: 600px; margin: 0 auto; background: white; padding: 60px; border-radius: 0; box-shadow: 20px 20px 0 #db2777; }
  .shop-form-box h2 { font-size: 32px; margin-bottom: 20px; font-weight: 900; }
  .shop-form-box p { color: #4b5563; margin-bottom: 30px; }
  .shop-form-box input { width: 100%; border: 1px solid #eee; padding: 15px; margin-bottom: 20px; outline: none; }
  .shop-form-box input:focus { border-color: #db2777; }

  .shop-footer { padding: 100px 8% 50px; background: #fff; border-top: 1px solid #eee; }
  .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 50px; margin-bottom: 80px; }
  .footer-col h4 { font-size: 14px; font-weight: 900; margin-bottom: 30px; text-transform: uppercase; }
  .footer-col ul { list-style: none; padding: 0; }
  .footer-col ul li { margin-bottom: 15px; }
  .footer-col ul li a { text-decoration: none; color: #4b5563; font-size: 14px; }

  @media (max-width: 1024px) {
    .shop-nav { padding: 10px 5%; }
    .shop-menu { display: none; position: absolute; top: 100%; left: 0; width: 100%; background: #fff; flex-direction: column; padding: 30px; gap: 20px; text-align: center; border-bottom: 1px solid #eee; }
    .shop-menu.active { display: flex; }
    .mobile-toggle { display: block; }

    .shop-hero { height: auto; flex-direction: column; }
    .shop-hero-text { padding: 60px 5%; text-align: center; align-items: center; }
    .shop-hero-text h1 { font-size: 40px; }
    .shop-hero-img { height: 400px; }
    .shop-grid { grid-template-columns: 1fr 1fr; padding: 0 5%; }
    .promo-banner { flex-direction: column; height: auto; }
    .promo-content { padding: 40px 5%; text-align: center; }
    .promo-img { height: 300px; }
    .footer-grid { grid-template-columns: 1fr; gap: 40px; }
    .info-band { flex-direction: column; gap: 20px; text-align: center; }
    .shop-form-box { padding: 40px 20px; width: 90%; margin: 0 auto; }
  }
  @media (max-width: 480px) {
    .shop-grid { grid-template-columns: 1fr; }
    .shop-hero-text h1 { font-size: 32px; }
  }

  /* Premium Page Loader */
  .page-loader {
    position: fixed;
    inset: 0;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(15px);
    display: none;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 10001;
    font-family: 'Inter', sans-serif;
  }
  .loader-visual {
    position: relative;
    width: 80px;
    height: 80px;
    margin-bottom: 24px;
  }
  .loader-ring {
    position: absolute;
    inset: 0;
    border: 3px solid transparent;
    border-top-color: #db2777;
    border-radius: 50%;
    animation: spin 1.5s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  }
  .loader-ring:nth-child(2) {
    inset: 8px;
    border-top-color: #f472b6;
    animation-direction: reverse;
    animation-duration: 1s;
  }
  .loader-text {
    color: #111;
    font-weight: 800;
    font-size: 20px;
    letter-spacing: -0.5px;
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

export const ecommerceHtml = `
  <div class="shop-container">
    <nav class="shop-nav">
      <div class="shop-logo">LUMINA.</div>
      <div class="mobile-toggle" onclick="document.querySelector('.shop-menu').classList.toggle('active')">☰</div>
      <div class="shop-menu">
        <a href="#new">New Arrivals</a>
        <a href="#trending">Trending</a>
        <a href="#promo">Collections</a>
      </div>
      <div class="shop-icons">
        <span style="cursor: pointer;">🔍</span>
        <span style="font-weight: 900; cursor: pointer;">👜 (3)</span>
      </div>
    </nav>

    <div class="shop-hero">
      <div class="shop-hero-text">
        <span class="shop-tag">New Collection 2026</span>
        <h1>Elevate Your Every Day Style.</h1>
        <p>Discover the latest minimalist essentials designed for modern urban life. Premium quality, sustainable materials.</p>
        <a href="#new" class="btn-shop">Shop Selection →</a>
      </div>
      <div class="shop-hero-img"></div>
    </div>

    <div class="info-band">
      <div class="info-item"><span>🚀</span> <b>Free Shipping</b></div>
      <div class="info-item"><span>🔄</span> <b>30-Day Returns</b></div>
      <div class="info-item"><span>💳</span> <b>Secure Payment</b></div>
      <div class="info-item"><span>🌿</span> <b>Eco-Conscious</b></div>
    </div>

    <div class="products-section" id="new">
      <h2 style="font-size: 42px; font-weight: 900; letter-spacing: -1px;">Summer Essentials</h2>
      <div class="shop-grid">
        <div class="product-card">
          <div class="product-img-wrap">
            <img src="https://images.unsplash.com/photo-1539109132314-3477524c8d95?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" class="product-img" />
          </div>
          <h3>Linen Blend Coat</h3>
          <p style="font-weight: 400; color: #4b5563; font-size: 16px;">$249.00</p>
        </div>
        <div class="product-card">
          <div class="product-img-wrap">
            <img src="https://images.unsplash.com/photo-1550639525-c97d455acf70?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" class="product-img" />
          </div>
          <h3>Silk Morning Gown</h3>
          <p style="font-weight: 400; color: #4b5563; font-size: 16px;">$189.00</p>
        </div>
        <div class="product-card">
          <div class="product-img-wrap">
            <img src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" class="product-img" />
          </div>
          <h3>Summer Vibe Dress</h3>
          <p style="font-weight: 400; color: #4b5563; font-size: 16px;">$99.00</p>
        </div>
        <div class="product-card">
          <div class="product-img-wrap">
            <img src="https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" class="product-img" />
          </div>
          <h3>Classic Fedora</h3>
          <p style="font-weight: 400; color: #4b5563; font-size: 16px;">$65.00</p>
        </div>
      </div>
    </div>

    <div class="promo-banner" id="promo">
      <div class="promo-content">
        <h2 style="font-size: 48px; font-weight: 900; margin-bottom: 20px;">The Minimalist Collection</h2>
        <p style="font-size: 18px; margin-bottom: 40px; opacity: 0.8; line-height: 1.6;">A curated selection of timeless pieces that stay relevant season after season.</p>
        <button class="btn-shop" style="background: #fff; color: #111;">Explore Collection →</button>
      </div>
      <div class="promo-img"></div>
    </div>

    <div class="shop-form-section" id="contact">
      <div class="shop-form-box">
        <h2>Join the Lumina Club</h2>
        <p>Subscribe to receive exclusive access to early drops, sales, and members-only events.</p>
        <form>
          <input type="text" placeholder="Full Name" required />
          <input type="email" placeholder="Email Address" required />
          <button type="submit" class="btn-shop" style="width: 100%;">Sign Up Now</button>
        </form>
      </div>
    </div>

    <footer class="shop-footer">
      <div class="footer-grid">
        <div class="footer-col">
          <div class="shop-logo" style="margin-bottom: 20px;">LUMINA.</div>
          <p style="color: #4b5563; line-height: 1.7; font-size: 14px;">Premium essentials for the modern lifestyle. Design with purpose and sustainability in mind.</p>
        </div>
        <div class="footer-col">
          <h4>Shopping</h4>
          <ul>
            <li><a href="#">New Arrivals</a></li>
            <li><a href="#">Best Sellers</a></li>
            <li><a href="#">Accessories</a></li>
            <li><a href="#">Gift Cards</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Customer Care</h4>
          <ul>
            <li><a href="#">Shipping Policy</a></li>
            <li><a href="#">Return Policy</a></li>
            <li><a href="#">Track Order</a></li>
            <li><a href="#">FAQ</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Contact</h4>
          <ul>
            <li><a href="#">Help Center</a></li>
            <li><a href="#">Press</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms</a></li>
          </ul>
        </div>
      </div>
      <p style="text-align: center; color: #999; font-size: 12px; margin-top: 50px;">© 2026 LUMINA Store. Built with Passion.</p>
    </footer>

    <div id="loader" class="page-loader">
      <div class="loader-visual">
        <div class="loader-ring"></div>
        <div class="loader-ring"></div>
      </div>
      <div class="loader-text">Joining the club...</div>
    </div>

    <script>
      document.querySelectorAll('form').forEach(f => {
        f.addEventListener('submit', function(e) {
          e.preventDefault();
          document.getElementById('loader').style.display = 'flex';
          setTimeout(function() {
             console.log('Subscription submitted, loader would stay until thank you page');
          }, 2000);
        });
      });
    </script>
  </div>
`;
