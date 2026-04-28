export const healthcareStyles = `
  .healthcare-container { margin: 0; font-family: 'Inter', sans-serif; color: #2d3748; background: #fff; }
  .navbar { display: flex; justify-content: space-between; align-items: center; padding: 20px 8%; background: #fff; box-shadow: 0 2px 10px rgba(0,0,0,0.05); position: sticky; top: 0; z-index: 1000; }
  .logo { font-size: 24px; font-weight: 800; color: PRIMARY_COLOR_PLACEHOLDER; }
  .nav-links { display: flex; gap: 30px; list-style: none; align-items: center; }
  .nav-links a { text-decoration: none; color: #4a5568; font-weight: 600; font-size: 15px; transition: 0.3s; }
  .nav-links a:hover { color: PRIMARY_COLOR_PLACEHOLDER; }
  .mobile-toggle { display: none; font-size: 24px; cursor: pointer; color: PRIMARY_COLOR_PLACEHOLDER; }
  
  .hero { display: flex; align-items: center; padding: 80px 8%; background: linear-gradient(135deg, #ebf8ff 0%, #fff 100%); min-height: 600px; gap: 50px; }
  .hero-content { flex: 1.2; }
  .hero-tag { display: inline-block; padding: 6px 16px; background: #bee3f8; color: #2b6cb0; border-radius: 50px; font-size: 12px; font-weight: 700; text-transform: uppercase; margin-bottom: 20px; }
  .hero h1 { font-size: 56px; font-weight: 800; line-height: 1.1; color: #2c5282; margin-bottom: 24px; }
  .hero p { font-size: 18px; color: #4a5568; margin-bottom: 32px; line-height: 1.6; }
  
  .form-box { flex: 1; background: white; padding: 40px; border-radius: 24px; box-shadow: 0 20px 50px rgba(0,0,0,0.1); border: 1px solid #edf2f7; }
  .form-box h3 { font-size: 24px; font-weight: 800; color: #2c5282; margin-bottom: 20px; text-align: center; }
  .form-box input, .form-box select { width: 100%; border: 1px solid #e2e8f0; padding: 14px; border-radius: 12px; margin-bottom: 15px; outline: none; transition: 0.3s; }
  .form-box input:focus { border-color: PRIMARY_COLOR_PLACEHOLDER; box-shadow: 0 0 0 4px rgba(49, 130, 206, 0.1); }
  .btn-primary { width: 100%; padding: 16px 32px; background: PRIMARY_COLOR_PLACEHOLDER; color: #fff; border-radius: 12px; font-weight: 600; transition: 0.3s; border: none; cursor: pointer; font-size: 16px; }
  .btn-primary:hover { opacity: 0.9; transform: translateY(-2px); box-shadow: 0 10px 20px rgba(49, 130, 206, 0.2); }
  
  .stats { display: flex; justify-content: space-between; padding: 60px 8%; background: #fff; margin-top: -60px; position: relative; z-index: 10; width: 84%; margin-left: auto; margin-right: auto; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
  .stat-item { text-align: center; }
  .stat-item h3 { font-size: 36px; font-weight: 800; color: PRIMARY_COLOR_PLACEHOLDER; margin-bottom: 5px; }
  .stat-item p { color: #718096; font-size: 14px; font-weight: 500; }
  
  .services { padding: 100px 8%; text-align: center; background: #f8fafc; }
  .section-title { font-size: 36px; font-weight: 800; color: #2c5282; margin-bottom: 16px; }
  .section-desc { font-size: 16px; color: #718096; max-width: 600px; margin: 0 auto 60px; }
  .services-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; }
  .service-card { padding: 40px; background: #fff; border-radius: 24px; border: 1px solid #edf2f7; transition: 0.3s; text-align: left; }
  .service-card:hover { border-color: PRIMARY_COLOR_PLACEHOLDER; transform: translateY(-10px); box-shadow: 0 20px 40px rgba(0,0,0,0.05); }
  .service-icon { width: 60px; height: 60px; background: PRIMARY_COLOR_PLACEHOLDER; opacity: 0.1; border-radius: 16px; display: flex; items-center; justify-content: center; margin-bottom: 24px; font-size: 24px; color: PRIMARY_COLOR_PLACEHOLDER; }
  .service-icon { background: rgba(99, 102, 241, 0.1); color: PRIMARY_COLOR_PLACEHOLDER; }
  
  .team-section { padding: 100px 8%; text-align: center; }
  .team-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 30px; margin-top: 50px; }
  .team-card { border-radius: 24px; overflow: hidden; background: #fff; border: 1px solid #eee; transition: 0.3s; }
  .team-card:hover { transform: translateY(-5px); box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
  .team-img { width: 100%; height: 250px; object-fit: cover; }
  .team-info { padding: 20px; }
  .team-info h5 { font-size: 18px; font-weight: 700; margin-bottom: 5px; }
  .team-info p { font-size: 14px; color: PRIMARY_COLOR_PLACEHOLDER; font-weight: 600; }
  
  .footer { background: #1a202c; color: #e2e8f0; padding: 80px 8% 40px; }
  .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 50px; margin-bottom: 60px; }
  .footer-logo { font-size: 24px; font-weight: 800; color: #fff; margin-bottom: 20px; }
  .footer-col h4 { color: #fff; margin-bottom: 25px; font-size: 18px; font-weight: 700; }
  .footer-col ul { list-style: none; padding: 0; }
  .footer-col ul li { margin-bottom: 12px; }
  .footer-col ul li a { color: #a0aec0; text-decoration: none; transition: 0.3s; }
  .footer-col ul li a:hover { color: #fff; }
  .footer-bottom { border-top: 1px solid #2d3748; padding-top: 30px; display: flex; justify-content: space-between; font-size: 14px; color: #718096; }
  
  @media (max-width: 968px) {
    .navbar { padding: 15px 5%; }
    .nav-links { display: none; position: absolute; top: 100%; left: 0; width: 100%; background: #fff; flex-direction: column; padding: 20px; box-shadow: 0 10px 20px rgba(0,0,0,0.05); gap: 15px; text-align: center; }
    .nav-links.active { display: flex; }
    .mobile-toggle { display: block; }
    .nav-links .btn-primary { display: block; width: 100%; }

    .hero { flex-direction: column; text-align: center; padding: 40px 5%; height: auto; }
    .hero h1 { font-size: 40px; }
    .stats { flex-direction: column; gap: 30px; width: 90%; margin-top: 20px; }
    .services-grid { grid-template-columns: 1fr; }
    .team-grid { grid-template-columns: 1fr 1fr; }
    .footer-grid { grid-template-columns: 1fr; }
  }
  @media (max-width: 480px) {
    .hero h1 { font-size: 32px; }
    .team-grid { grid-template-columns: 1fr; }
  }

  /* Premium Page Loader */
  .page-loader {
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.9);
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
    border-top-color: PRIMARY_COLOR_PLACEHOLDER;
    border-radius: 50%;
    animation: spin 1.5s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  }
  .loader-ring:nth-child(2) {
    inset: 8px;
    border-top-color: PRIMARY_COLOR_PLACEHOLDER;
    opacity: 0.5;
    animation-direction: reverse;
    animation-duration: 1s;
  }
  .loader-text {
    color: #1a202c;
    font-weight: 800;
    font-size: 20px;
    letter-spacing: -0.5px;
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

export const healthcareHtml = `
  <div class="healthcare-container">
    <nav class="navbar">
      <div class="logo">LOGO_PLACEHOLDER</div>
      <div class="mobile-toggle" onclick="document.querySelector('.nav-links').classList.toggle('active')">☰</div>
      <ul class="nav-links">
        <li><a href="#services">Our Services</a></li>
        <li><a href="#team">Experts</a></li>
        <li><a href="#appointment">Contact</a></li>
        <li><a href="#appointment" class="btn-primary" style="width: auto; padding: 12px 24px;">Book Now</a></li>
      </ul>
    </nav>

    <div class="hero">
      <div class="hero-content">
        <span class="hero-tag">Trusted Medical Care</span>
        <h1>Your Health is Our Top Priority.</h1>
        <p>Get access to world-class medical experts and advanced treatments from the comfort of your home or in person. Experience the future of healthcare today.</p>
        <div style="display: flex; gap: 20px; align-items: center;">
           <div style="display: flex; -webkit-mask-image: linear-gradient(to right, black 80%, transparent);">
             <img src="https://i.pravatar.cc/100?u=1" style="width: 40px; height: 40px; border-radius: 50%; border: 2px solid white; margin-right: -15px;" />
             <img src="https://i.pravatar.cc/100?u=2" style="width: 40px; height: 40px; border-radius: 50%; border: 2px solid white; margin-right: -15px;" />
             <img src="https://i.pravatar.cc/100?u=3" style="width: 40px; height: 40px; border-radius: 50%; border: 2px solid white;" />
           </div>
           <p style="font-size: 14px; font-weight: 600; color: #4a5568; margin: 0;">15,000+ Happy Patients</p>
        </div>
      </div>
      <div class="form-box" id="appointment">
        <h3>Book Appointment</h3>
        <form>
          <input type="text" placeholder="Full Name" required />
          <input type="email" placeholder="Email Address" required />
          <select required>
            <option value="">Select Service</option>
            <option>General Checkup</option>
            <option>Cardiology</option>
            <option>Dental Care</option>
            <option>Neurology</option>
          </select>
          <input type="date" required />
          <button type="submit" class="btn-primary">Confirm Appointment</button>
        </form>
        <p style="font-size: 12px; color: #718096; text-align: center; margin-top: 15px;">Your data is secure with us.</p>
      </div>
    </div>

    <div class="stats">
      <div class="stat-item">
        <h3>250+</h3>
        <p>Specialist Doctors</p>
      </div>
      <div class="stat-item">
        <h3>15k+</h3>
        <p>Happy Patients</p>
      </div>
      <div class="stat-item">
        <h3>12+</h3>
        <p>Years of Excellence</p>
      </div>
      <div class="stat-item">
        <h3>24/7</h3>
        <p>Emergency Services</p>
      </div>
    </div>

    <div class="services" id="services">
      <h2 class="section-title">Our Medical Services</h2>
      <p class="section-desc">We provide a wide range of healthcare services to meet your needs, ensuring you receive the best possible care from our certified experts.</p>
      <div class="services-grid">
        <div class="service-card">
          <div class="service-icon">🏥</div>
          <h4>General Checkup</h4>
          <p>Comprehensive health assessments to monitor your overall well-being and detect issues early.</p>
        </div>
        <div class="service-card">
          <div class="service-icon">🦷</div>
          <h4>Dental Care</h4>
          <p>Expert dental services from routine cleanings to advanced restorative procedures.</p>
        </div>
        <div class="service-card">
          <div class="service-icon">❤️</div>
          <h4>Cardiology</h4>
          <p>Advanced heart care programs focusing on prevention, diagnosis, and treatment.</p>
        </div>
        <div class="service-card">
          <div class="service-icon">🧠</div>
          <h4>Neurology</h4>
          <p>Specialized care for neurological disorders with advanced diagnostic tools.</p>
        </div>
        <div class="service-card">
          <div class="service-icon">🦴</div>
          <h4>Orthopedics</h4>
          <p>Modern treatments for bone and joint health from expert orthopedists.</p>
        </div>
        <div class="service-card">
          <div class="service-icon">🧪</div>
          <h4>Lab Tests</h4>
          <p>Quick and accurate laboratory testing services with digital report delivery.</p>
        </div>
      </div>
    </div>

    <div class="team-section" id="team">
      <h2 class="section-title">Meet Our Specialists</h2>
      <p class="section-desc">Our team of high-qualified doctors are dedicated to providing the best medical care with compassion.</p>
      <div class="team-grid">
        <div class="team-card">
          <img src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" class="team-img" />
          <div class="team-info">
            <h5>Dr. Sarah Johnson</h5>
            <p>Cardiologist</p>
          </div>
        </div>
        <div class="team-card">
          <img src="https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" class="team-img" />
          <div class="team-info">
            <h5>Dr. Michael Chen</h5>
            <p>Neurologist</p>
          </div>
        </div>
        <div class="team-card">
          <img src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" class="team-img" />
          <div class="team-info">
            <h5>Dr. Emily White</h5>
            <p>Orthopedic Surgeon</p>
          </div>
        </div>
        <div class="team-card">
          <img src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" class="team-img" />
          <div class="team-info">
            <h5>Dr. David Wilson</h5>
            <p>Dentist</p>
          </div>
        </div>
      </div>
    </div>

    <footer class="footer">
      <div class="footer-grid">
        <div class="footer-col">
          <div class="footer-logo">LOGO_PLACEHOLDER</div>
          <p style="color: #718096; line-height: 1.6; max-width: 300px;">Providing quality medical care since 2012. Our mission is to make healthcare accessible and affordable for everyone.</p>
        </div>
        <div class="footer-col">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Our Services</a></li>
            <li><a href="#">Doctors</a></li>
            <li><a href="#">Blog</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Medical Services</h4>
          <ul>
            <li><a href="#">Cardiology</a></li>
            <li><a href="#">Neurology</a></li>
            <li><a href="#">Orthopedics</a></li>
            <li><a href="#">Dentistry</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Contact Us</h4>
          <ul>
            <li style="color: #a0aec0;">123 Medical Dr, New York, NY</li>
            <li><a href="tel:1-800-Health">+1-800-432-5847</a></li>
            <li><a href="mailto:info@healthcare.com">info@healthcare.com</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <div>© 2026 PROJECT_NAME_PLACEHOLDER. All rights reserved.</div>
        <div style="display: flex; gap: 20px;">
          <a href="#" style="color: inherit;">Privacy Policy</a>
          <a href="#" style="color: inherit;">Terms of Service</a>
        </div>
      </div>
    </footer>

    <div id="loader" class="page-loader">
      <div class="loader-visual">
        <div class="loader-ring"></div>
        <div class="loader-ring"></div>
      </div>
      <div class="loader-text">Confirming your appointment...</div>
    </div>

    <script>
      // Navigation toggle
      const toggle = document.querySelector('.mobile-toggle');
      const menu = document.querySelector('.nav-links');
      if (toggle && menu) {
        toggle.addEventListener('click', () => menu.classList.toggle('active'));
      }
    </script>
  </div>
`;
