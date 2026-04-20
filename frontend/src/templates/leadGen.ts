export const leadGenStyles = `
  .lead-gen-container { 
    margin: 0; 
    font-family: 'Inter', sans-serif; 
    background-color: #fff; 
    color: #333; 
    line-height: 1.6;
  }
  
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 5%;
    background: #fff;
  }
  
  .logo img { height: 45px; }
  
  .contact-info {
    display: flex;
    align-items: center;
    gap: 10px;
    color: var(--primary, #1a73e8);
    font-weight: 700;
  }
  
  .hero {
    background: #2d3e2d;
    padding: 80px 5%;
    display: flex;
    gap: 50px;
    align-items: center;
    color: #fff;
  }
  
  @media (max-width: 900px) {
    .hero { flex-direction: column; text-align: center; }
  }
  
  .hero-form {
    background: #000;
    padding: 30px;
    border-radius: 8px;
    width: 100%;
    max-width: 400px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  }
  
  .form-title {
    color: var(--secondary, #74a12e);
    font-size: 28px;
    font-weight: 800;
    margin-bottom: 15px;
    text-transform: uppercase;
  }
  
  .form-desc { font-size: 14px; margin-bottom: 25px; color: #ccc; }
  
  .hero-form input, .hero-form select, .hero-form textarea {
    width: 100%;
    padding: 12px;
    margin-bottom: 15px;
    border: none;
    border-radius: 4px;
    background: #fff;
    font-size: 14px;
  }
  
  .submit-btn {
    width: 100%;
    padding: 15px;
    background: var(--primary, #74a12e);
    color: #fff;
    border: none;
    border-radius: 4px;
    font-size: 18px;
    font-weight: 800;
    cursor: pointer;
    text-transform: uppercase;
    transition: 0.3s;
  }
  
  .submit-btn:hover { filter: brightness(1.1); }
  
  .hero-content { flex: 1; }
  
  .hero-content h1 {
    font-size: 52px;
    font-weight: 400;
    margin-bottom: 20px;
  }
  
  .hero-content h1 span { color: var(--secondary, #74a12e); font-weight: 800; }
  
  .hero-content p { font-size: 18px; color: #ddd; margin-bottom: 30px; max-width: 500px; }
  
  .hero-btns { display: flex; gap: 15px; }
  
  .btn-outline {
    padding: 12px 25px;
    border: 2px solid #fff;
    background: transparent;
    color: #fff;
    font-weight: 700;
    border-radius: 4px;
    cursor: pointer;
    transition: 0.3s;
  }
  
  .btn-outline:hover { background: #fff; color: #2d3e2d; }
  
  .section-title {
    text-align: center;
    padding: 60px 5% 20px;
  }
  
  .section-title h2 { font-size: 32px; font-weight: 800; }
  .section-title p { color: #888; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; }

  .features {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 30px;
    padding: 20px 5% 80px;
  }
  
  .feature-card { text-align: center; }
  .feature-image {
    width: 100%;
    height: 230px;
    background: #ccc;
    margin-bottom: -30px;
    border-radius: 8px;
    overflow: hidden;
  }
  .feature-image img { width: 100%; height: 100%; object-cover: cover; }
  
  .feature-icon {
    width: 60px;
    height: 60px;
    background: #74a12e;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    position: relative;
    z-index: 2;
    border: 4px solid #fff;
    color: #fff;
    font-size: 24px;
  }
  
  .feature-card h3 { margin: 20px 0 10px; font-size: 20px; font-weight: 800; }
  .feature-card p { color: #666; font-size: 14px; padding: 0 20px; }

  .teaching-section {
    background: #0056b3;
    padding: 80px 5%;
    display: flex;
    gap: 50px;
    align-items: center;
    color: #fff;
  }
  
  .teaching-image { flex: 1; height: 350px; background: #4dabf7; border: 4px solid #74a12e; }
  .teaching-content { flex: 1; }
  .teaching-content h2 { font-size: 32px; font-weight: 800; margin-bottom: 25px; }
  .teaching-content p { margin-bottom: 20px; font-size: 14px; opacity: 0.9; }

  .video-section {
    padding: 80px 5%;
    display: flex;
    gap: 50px;
    align-items: center;
  }
  
  .video-content { flex: 1; }
  .video-content h4 { font-size: 24px; font-weight: 800; margin-bottom: 15px; }
  .video-content p { color: #666; font-size: 14px; margin-bottom: 25px; }
  .video-placeholder { flex: 1; position: relative; background: #000; border-radius: 8px; overflow: hidden; height: 350px; }
  .video-placeholder img { width: 100%; height: 100%; opacity: 0.6; object-fit: cover; }

  .testimonials-row {
    display: flex;
    padding: 80px 5%;
    gap: 50px;
    background: #f8f9fa;
  }
  
  .be-success { flex: 1; }
  .testimonial-block { flex: 1; }
  .testimonial-flex { display: flex; gap: 20px; background: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 5px 15px rgba(0,0,0,0.05); }
  .tm-img { width: 170px; height: 170px; background: #ddd; flex-shrink: 0; }
  .tm-text { font-style: italic; color: #555; }
  .tm-author { margin-top: 15px; color: #1a73e8; font-weight: 700; }

  .footer {
    background: #333;
    color: #888;
    text-align: center;
    padding: 40px;
    font-size: 12px;
  }
`;

export const leadGenHtml = `
  <div class="lead-gen-container">
    <header class="header" data-gjs-type="header">
      <div class="logo">
         <img src="https://via.placeholder.com/150x50?text=LOGO" alt="Logo" />
      </div>
      <div class="contact-info">
        <span style="font-size: 24px;">📞</span>
        <div>
          <div style="font-size: 12px; color: #666;">If you have a question, call us:</div>
          <div style="font-size: 18px;">+1 800 603 6035</div>
        </div>
      </div>
    </header>

    <div class="hero" data-gjs-type="section">
      <div class="hero-form">
        <h2 class="form-title">Get Started</h2>
        <p class="form-desc">Take your first step towards success by dropping in a few of your details here</p>
        <form>
          <input type="text" placeholder="Full name" />
          <input type="email" placeholder="Email address" />
          <input type="tel" placeholder="Phone number" />
          <input type="text" placeholder="Address" />
          <select>
            <option disabled selected>Courses</option>
            <option>Web Development</option>
            <option>Data Science</option>
            <option>Digital Marketing</option>
          </select>
          <textarea placeholder="Comments" rows="4"></textarea>
          <button type="submit" class="submit-btn" data-gjs-type="button">Register Now!</button>
        </form>
      </div>
      
      <div class="hero-content">
        <div style="color: #666; font-size: 24px; margin-bottom: 40px;">1920 X 1200</div>
        <h1>Create your <span>future.</span></h1>
        <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.</p>
        <div class="hero-btns">
          <button class="btn-outline">VIEW COURSES</button>
          <button class="btn-outline">PURCHASE NOW</button>
        </div>
      </div>
    </div>

    <div class="section-title">
      <h2>Creating For Education Business</h2>
      <p>Follow us for get our parts</p>
    </div>

    <div class="features" data-gjs-type="section">
      <div class="feature-card">
        <div class="feature-image">
           <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: #888; font-size: 24px;">370 X 230</div>
        </div>
        <div class="feature-icon">🎓</div>
        <h3>About Us</h3>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore.</p>
      </div>
      
      <div class="feature-card">
        <div class="feature-image">
           <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: #888; font-size: 24px;">370 X 230</div>
        </div>
        <div class="feature-icon">🚀</div>
        <h3>Our Services</h3>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore.</p>
      </div>
      
      <div class="feature-card">
        <div class="feature-image">
           <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: #888; font-size: 24px;">370 X 230</div>
        </div>
        <div class="feature-icon">💰</div>
        <h3>Successful Carrier</h3>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore.</p>
      </div>
    </div>

    <div class="teaching-section" data-gjs-type="section">
      <div class="teaching-image">
         <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 32px;">470 X 315</div>
      </div>
      <div class="teaching-content">
        <h2>We'll Teach You To Be Professional</h2>
        <p>Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
        <p>It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.</p>
      </div>
    </div>

    <div class="section-title">
      <h2>Creating Education Video</h2>
      <p>Watch Our Best Video</p>
    </div>

    <div class="video-section" data-gjs-type="section">
      <div class="video-content">
        <h4>Watch The Video Now</h4>
        <p>Completely target superior technology whereas pandemic niche markets. Continually enable and-to-end results with intermandated.</p>
        <p>Dramatically maintain quality de variable and expanded array of param. Assertively youth with maintain critical human capital after granular vectors.</p>
        <div class="hero-btns">
          <button class="submit-btn" style="width: auto; padding: 10px 20px;">VIEW COURSES</button>
          <button class="btn-outline" style="color: #333; border-color: #ddd;">PURCHASE NOW</button>
        </div>
      </div>
      <div class="video-placeholder">
        <img src="https://i.ibb.co/XY329wL/video-placeholder.jpg" alt="Video" />
        <div style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 60px; color: #fff; cursor: pointer;">▶️</div>
      </div>
    </div>

    <div class="testimonials-row" data-gjs-type="section">
      <div class="be-success">
        <h2 style="font-size: 32px; font-weight: 800; margin-bottom: 25px;">Be successful</h2>
        <p style="color: #666; margin-bottom: 20px;">Completely target superior technology whereas pandemic niche markets. Continually enable and-to-end results with intermandated.</p>
        <p style="color: #666;">Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum has been the industry's standard dummy text ever since the 1500s.</p>
      </div>
      <div class="testimonial-block">
        <h2 style="font-size: 32px; font-weight: 800; margin-bottom: 25px;">Testimonials</h2>
        <div class="testimonial-flex">
          <div class="tm-img">
             <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: #888;">170 X 170</div>
          </div>
          <div class="tm-text">
            "I have been working with Joe for about a year now and he has helped me leap many investment properties. I have experience working with other realtors in the past as well, but I have found Joe to be extremely good at what he does. I look forward to continue working with Joe in the future."
            <div class="tm-author">JOHNATHAN DOE <br><span style="color: #888; font-weight: 400;">Pleg Top Team LLC</span></div>
          </div>
        </div>
      </div>
    </div>

    <footer class="footer">
      Copyright © 2026. All rights reserved. Design by yourbusiness.com
    </footer>
  </div>
`;
