export const educationStyles = `
  .edu-container { margin: 0; font-family: 'Outfit', sans-serif; color: #1a202c; background: #fff; scroll-behavior: smooth; }
  .edu-nav { padding: 15px 8%; display: flex; justify-content: space-between; align-items: center; background: #fff; position: sticky; top: 0; z-index: 1000; border-bottom: 1px solid #f1f5f9; }
  .edu-logo { font-size: 26px; font-weight: 800; color: #020617; }
  .edu-logo span { color: #6366f1; }
  .edu-menu { display: flex; gap: 30px; align-items: center; }
  .edu-menu a { text-decoration: none; color: #64748b; font-weight: 600; font-size: 15px; transition: 0.3s; }
  .edu-menu a:hover { color: #6366f1; }
  .mobile-toggle { display: none; font-size: 24px; cursor: pointer; color: #6366f1; }
  
  .edu-hero { display: flex; align-items: center; padding: 100px 8% 120px; gap: 80px; background: linear-gradient(to bottom, #f8fafc, #fff); }
  .edu-hero-text { flex: 1; }
  .edu-hero-text h2 { font-size: 64px; line-height: 1.1; margin-bottom: 30px; font-weight: 800; color: #0f172a; }
  .edu-hero-text p { font-size: 20px; color: #64748b; margin-bottom: 40px; line-height: 1.6; }
  
  .cta-group { display: flex; gap: 20px; }
  .btn-edu-primary { background: #6366f1; color: white; padding: 20px 40px; border-radius: 16px; font-weight: 700; text-decoration: none; border: none; cursor: pointer; transition: 0.3s; font-size: 16px; }
  .btn-edu-primary:hover { background: #4f46e5; transform: translateY(-3px); box-shadow: 0 10px 20px rgba(99, 102, 241, 0.2); }
  .btn-edu-secondary { background: #fff; color: #6366f1; padding: 20px 40px; border-radius: 16px; font-weight: 700; text-decoration: none; border: 1px solid #e2e8f0; cursor: pointer; transition: 0.3s; font-size: 16px; }
  .btn-edu-secondary:hover { background: #f8fafc; }

  .edu-hero-img { flex: 1.2; position: relative; }
  .edu-hero-img img { width: 100%; border-radius: 40px; box-shadow: 0 40px 80px rgba(99, 102, 241, 0.15); }
  
  .features-grid { padding: 100px 8%; display: grid; grid-template-columns: repeat(4, 1fr); gap: 30px; margin-top: -80px; position: relative; z-index: 10; }
  .feat-card { background: #fff; padding: 35px; border-radius: 24px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); text-align: center; border: 1px solid #f1f5f9; }
  .feat-card i { font-size: 32px; display: block; margin-bottom: 20px; }
  .feat-card h4 { font-size: 18px; font-weight: 700; margin-bottom: 10px; }
  .feat-card p { font-size: 14px; color: #64748b; }

  .course-section { padding: 120px 8%; background: #f8fafc; }
  .course-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; margin-top: 60px; }
  .course-card { background: white; border-radius: 30px; overflow: hidden; border: 1px solid #e2e8f0; transition: 0.4s; }
  .course-card:hover { transform: translateY(-15px); }
  .course-img { height: 240px; width: 100%; object-fit: cover; }
  .course-info { padding: 30px; }
  .category-tag { padding: 6px 12px; background: #f0fdf4; color: #166534; border-radius: 8px; font-size: 12px; font-weight: 700; }
  .course-info h3 { margin-top: 15px; font-size: 22px; font-weight: 800; color: #0f172a; }

  .testimonial-section { padding: 120px 8%; text-align: center; }
  .test-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; margin-top: 60px; }
  .test-card { padding: 40px; background: #fff; border-radius: 30px; border: 1px solid #f1f5f9; text-align: left; }
  .stars { color: #f59e0b; margin-bottom: 20px; font-size: 18px; }

  .edu-newsletter { padding: 120px 8%; }
  .news-box { background: #6366f1; border-radius: 40px; padding: 80px; text-align: center; color: #fff; }
  .news-box h2 { font-size: 42px; font-weight: 800; margin-bottom: 20px; }
  .news-box p { font-size: 18px; margin-bottom: 40px; opacity: 0.9; }
  .news-form { display: flex; gap: 15px; max-width: 600px; margin: 0 auto; }
  .news-form input { flex: 1; padding: 20px; border-radius: 16px; border: none; outline: none; }
  .btn-dark-edu { background: #0f172a; color: #fff; padding: 20px 40px; border-radius: 16px; font-weight: 700; cursor: pointer; border: none; }

  .edu-footer { padding: 100px 8% 50px; background: #fff; border-top: 1px solid #f1f5f9; }
  .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 50px; margin-bottom: 80px; }
  .footer-col h4 { font-size: 18px; font-weight: 700; margin-bottom: 25px; }
  .footer-col ul { list-style: none; padding: 0; }
  .footer-col ul li { margin-bottom: 12px; }
  .footer-col ul li a { color: #64748b; text-decoration: none; transition: 0.3s; }

  /* Popup Styles */
  .modal-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(5px); z-index: 10000; align-items: center; justify-content: center; }
  .modal-content { background: #fff; padding: 50px; border-radius: 30px; width: 100%; max-width: 500px; position: relative; }
  .close-modal { position: absolute; top: 20px; right: 20px; font-size: 24px; cursor: pointer; color: #64748b; }

  @media (max-width: 1024px) {
    .edu-nav { padding: 10px 5%; }
    .edu-menu { display: none; position: absolute; top: 100%; left: 0; width: 100%; background: #fff; flex-direction: column; padding: 30px; gap: 20px; box-shadow: 0 10px 20px rgba(0,0,0,0.05); }
    .edu-menu.active { display: flex; }
    .mobile-toggle { display: block; }
    .edu-menu .btn-edu-primary { display: block; width: 100%; }

    .edu-hero { flex-direction: column; text-align: center; padding: 40px 5%; }
    .edu-hero-text h2 { font-size: 42px; }
    .cta-group { justify-content: center; }
    .features-grid { grid-template-columns: 1fr 1fr; margin-top: 0; padding: 40px 5%; }
    .course-grid, .test-grid, .footer-grid { grid-template-columns: 1fr; }
    .news-form { flex-direction: column; }
    .news-box { padding: 40px 20px; }
  }
  @media (max-width: 480px) {
    .edu-hero-text h2 { font-size: 32px; }
    .features-grid { grid-template-columns: 1fr; }
    .cta-group { flex-direction: column; }
    .modal-content { padding: 30px 20px; }
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
    font-family: 'Outfit', sans-serif;
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
    border-top-color: #6366f1;
    border-radius: 50%;
    animation: spin 1.5s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  }
  .loader-ring:nth-child(2) {
    inset: 8px;
    border-top-color: #a5b4fc;
    animation-direction: reverse;
    animation-duration: 1s;
  }
  .loader-text {
    color: #0f172a;
    font-weight: 800;
    font-size: 20px;
    letter-spacing: -0.5px;
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

export const educationHtml = `
  <div class="edu-container">
    <nav class="edu-nav">
      <div class="edu-logo">Edu<span>Flow.</span></div>
      <div class="mobile-toggle" onclick="document.querySelector('.edu-menu').classList.toggle('active')">☰</div>
      <div class="edu-menu">
        <a href="#courses">Courses</a>
        <a href="#reviews">Reviews</a>
        <button class="btn-edu-primary" style="padding: 12px 24px;" onclick="document.getElementById('edu-modal').style.display='flex'">Join Now</button>
      </div>
    </nav>

    <div class="edu-hero">
      <div class="edu-hero-text">
        <h2>Unlock Your Potential with Expert-Led Courses.</h2>
        <p>Join over 15,000+ students worldwide and start learning modern skills today from industry experts who have built world-class products.</p>
        <div class="cta-group">
          <button class="btn-edu-primary" onclick="document.getElementById('edu-modal').style.display='flex'">Start Learning Now</button>
          <a href="#courses" class="btn-edu-secondary">View Courses</a>
        </div>
      </div>
      <div class="edu-hero-img">
        <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" alt="Students" />
      </div>
    </div>

    <div class="features-grid">
      <div class="feat-card">
        <i>🎓</i>
        <h4>Expert Mentors</h4>
        <p>Learn from professionals with years of industry experience.</p>
      </div>
      <div class="feat-card">
        <i>📱</i>
        <h4>Mobile Learning</h4>
        <p>Access your courses anytime, anywhere on any device.</p>
      </div>
      <div class="feat-card">
        <i>🏆</i>
        <h4>Certification</h4>
        <p>Get recognized for your hard work with verified certificates.</p>
      </div>
      <div class="feat-card">
        <i>💬</i>
        <h4>Community</h4>
        <p>Join our private Discord to connect with fellow learners.</p>
      </div>
    </div>

    <div class="course-section" id="courses">
      <div style="text-align: center;">
        <span class="category-tag">Featured Courses</span>
        <h2 style="font-size: 42px; font-weight: 900; margin-top: 20px;">Master New Skills Today</h2>
      </div>

      <div class="course-grid">
        <div class="course-card">
          <img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" class="course-img" />
          <div class="course-info">
            <span class="category-tag">Design</span>
            <h3>Modern UI/UX Design Mastery 2026</h3>
            <p style="color: #64748b; font-size: 14px; margin-top: 10px;">Build stunning interfaces with Figma and Framer.</p>
          </div>
        </div>
        <div class="course-card">
          <img src="https://images.unsplash.com/photo-1587620962725-abab7fe55159?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" class="course-img" />
          <div class="course-info">
            <span class="category-tag">Development</span>
            <h3>Full-Stack React & Node.js Guide</h3>
            <p style="color: #64748b; font-size: 14px; margin-top: 10px;">Master the MERN stack and build real apps.</p>
          </div>
        </div>
        <div class="course-card">
          <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" class="course-img" />
          <div class="course-info">
            <span class="category-tag">Business</span>
            <h3>Digital Marketing Strategy Bootcamp</h3>
            <p style="color: #64748b; font-size: 14px; margin-top: 10px;">Grow your business with data-driven marketing.</p>
          </div>
        </div>
      </div>
    </div>

    <div class="testimonial-section" id="reviews">
      <h2 style="font-size: 42px; font-weight: 900;">Loved by Students</h2>
      <div class="test-grid">
        <div class="test-card">
          <div class="stars">★★★★★</div>
          <p style="color: #4b5563; line-height: 1.7; font-style: italic;">"The best platform I've ever used. The mentors are top-notch and the community is super helpful."</p>
          <div style="display: flex; align-items: center; gap: 15px; margin-top: 25px;">
            <img src="https://i.pravatar.cc/100?u=10" style="width: 45px; height: 45px; border-radius: 50%;" />
            <div>
              <p style="font-weight: 800; margin: 0; font-size: 14px;">Jane Doe</p>
              <p style="color: #64748b; margin: 0; font-size: 12px;">Product Designer</p>
            </div>
          </div>
        </div>
        <div class="test-card">
          <div class="stars">★★★★★</div>
          <p style="color: #4b5563; line-height: 1.7; font-style: italic;">"Learned more in 3 months here than I did in 4 years of college. Highly recommended for everyone."</p>
          <div style="display: flex; align-items: center; gap: 15px; margin-top: 25px;">
            <img src="https://i.pravatar.cc/100?u=11" style="width: 45px; height: 45px; border-radius: 50%;" />
            <div>
              <p style="font-weight: 800; margin: 0; font-size: 14px;">John Smith</p>
              <p style="color: #64748b; margin: 0; font-size: 12px;">Backend Developer</p>
            </div>
          </div>
        </div>
        <div class="test-card">
          <div class="stars">★★★★★</div>
          <p style="color: #4b5563; line-height: 1.7; font-style: italic;">"The certification helped me land a job at a top tech company. Truly life-changing experience."</p>
          <div style="display: flex; align-items: center; gap: 15px; margin-top: 25px;">
            <img src="https://i.pravatar.cc/100?u=12" style="width: 45px; height: 45px; border-radius: 50%;" />
            <div>
              <p style="font-weight: 800; margin: 0; font-size: 14px;">Alex Rivera</p>
              <p style="color: #64748b; margin: 0; font-size: 12px;">Marketing Lead</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="edu-newsletter">
      <div class="news-box">
        <h2>Join our Newsletter</h2>
        <p>Get the latest updates on new courses and industry insights delivered to your inbox weekly.</p>
        <form class="news-form">
          <input type="email" placeholder="Enter your email" required />
          <button type="submit" class="btn-dark-edu">Subscribe Now</button>
        </form>
      </div>
    </div>

    <footer class="edu-footer">
      <div class="footer-grid">
        <div class="footer-col">
          <div class="edu-logo">Edu<span>Flow.</span></div>
          <p style="color: #64748b; line-height: 1.7; margin-top: 20px;">Empowering learners globally with high-quality education from the best in the industry.</p>
        </div>
        <div class="footer-col">
          <h4>Platform</h4>
          <ul>
            <li><a href="#">Courses</a></li>
            <li><a href="#">Pricing</a></li>
            <li><a href="#">Resources</a></li>
            <li><a href="#">Careers</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Support</h4>
          <ul>
            <li><a href="#">Help Center</a></li>
            <li><a href="#">Contact Us</a></li>
            <li><a href="#">Privacy</a></li>
            <li><a href="#">Terms</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Follow Us</h4>
          <div style="display: flex; gap: 20px; font-size: 20px;">
            <a href="#" style="color: #6366f1;">𝕏</a>
            <a href="#" style="color: #6366f1;">📸</a>
            <a href="#" style="color: #6366f1;">📺</a>
          </div>
        </div>
      </div>
      <p style="text-align: center; color: #94a3b8; font-size: 14px;">© 2026 EduFlow Inc. All rights reserved.</p>
    </footer>

    <!-- Popup Modal -->
    <div class="modal-overlay" id="edu-modal" onclick="if(event.target == this) this.style.display='none'">
      <div class="modal-content">
        <div class="close-modal" onclick="document.getElementById('edu-modal').style.display='none'">✕</div>
        <h3 style="text-align: center; font-size: 28px; font-weight: 800; margin-bottom: 30px;">Get Started Today</h3>
        <form style="display: flex; flex-direction: column; gap: 15px;">
          <input type="text" placeholder="Full Name" style="padding: 15px; border-radius: 12px; border: 1px solid #e2e8f0;" required />
          <input type="email" placeholder="Email Address" style="padding: 15px; border-radius: 12px; border: 1px solid #e2e8f0;" required />
          <select style="padding: 15px; border-radius: 12px; border: 1px solid #e2e8f0;" required>
            <option value="">Interested in...</option>
            <option>Design</option>
            <option>Development</option>
            <option>Business</option>
          </select>
          <button type="submit" class="btn-edu-primary">Apply Now</button>
        </form>
      </div>
    </div>

    <div id="loader" class="page-loader">
      <div class="loader-visual">
        <div class="loader-ring"></div>
        <div class="loader-ring"></div>
      </div>
      <div class="loader-text">Enrolling you now...</div>
    </div>

    <script>
      document.querySelectorAll('form').forEach(f => {
        f.addEventListener('submit', function(e) {
          e.preventDefault();
          document.getElementById('loader').style.display = 'flex';
          setTimeout(function() {
             console.log('Enrollment submitted, loader would stay until thank you page');
          }, 2000);
        });
      });
    </script>
  </div>
`;
