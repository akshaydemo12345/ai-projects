export const saasHeroStyles = `
  .saas-container { margin: 0; font-family: 'Inter', sans-serif; color: #1e293b; background: #fff; scroll-behavior: smooth; }
  .navbar { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; padding: 15px 8%; background: #fff; position: sticky; top: 0; z-index: 1000; border-bottom: 1px solid #f1f5f9; }
  .logo { font-size: 24px; font-weight: 800; color: #6366f1; }
  .nav-links { display: flex; flex-wrap: wrap; gap: 30px; list-style: none; align-items: center; }
  .nav-links a { text-decoration: none; color: #64748b; font-weight: 600; font-size: 15px; transition: 0.3s; }
  .nav-links a:hover { color: #6366f1; }
  .mobile-toggle { display: none; font-size: 24px; cursor: pointer; color: #6366f1; }
  
  .hero { padding: 100px 8%; display: flex; flex-wrap: wrap; align-items: center; gap: 50px; background: #f8fafc; }
  .hero-content { flex: 1; }
  .hero h1 { font-size: 56px; font-weight: 800; line-height: 1.2; margin-bottom: 25px; }
  .hero p { font-size: 18px; color: #64748b; margin-bottom: 40px; line-height: 1.7; }
  
  .hero-form { flex: 1; max-width: 450px; background: #fff; padding: 40px; border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; }
  .hero-form h3 { font-size: 24px; font-weight: 800; margin-bottom: 20px; text-align: center; }
  .hero-form input { width: 100%; padding: 15px; border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 15px; outline: none; }
  .btn-primary { width: 100%; padding: 16px; background: var(--btn-bg, #6366f1); color: var(--btn-text, #fff); border-radius: 12px; border: none; font-weight: 700; cursor: pointer; transition: 0.3s; }
  .btn-primary:hover { background: var(--secondary, PRIMARY_COLOR_PLACEHOLDER) !important; color: var(--btn-text, #fff) !important; }

  .features { padding: 100px 8%; text-align: center; }
  .feat-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; margin-top: 60px; }
  .feat-card { padding: 40px; background: #fff; border-radius: 20px; border: 1px solid #f1f5f9; transition: 0.3s; }
  .feat-card:hover { border-color: #6366f1; transform: translateY(-5px); }
  .feat-card i { font-size: 28px; margin-bottom: 20px; display: block; }
  
  .content-section { padding: 100px 8%; display: flex; flex-wrap: wrap; align-items: center; gap: 80px; }
  .content-img { flex: 1; border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); }
  .content-text { flex: 1; }
  
  .testimonials { padding: 100px 8%; background: #f8fafc; text-align: center; }
  .test-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; margin-top: 60px; }
  .test-card { padding: 30px; background: #fff; border-radius: 20px; text-align: left; }

  .cta-section { padding: 100px 8%; text-align: center; }
  .cta-box { background: #6366f1; padding: 80px; border-radius: 30px; color: #fff; }

  .footer { padding: 80px 8% 40px; border-top: 1px solid #f1f5f9; }
  .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 50px; margin-bottom: 60px; }

  @media (max-width: 968px) {
    .navbar { padding: 10px 5%; }
    .nav-links { display: none; position: absolute; top: 100%; left: 0; width: 100%; background: #fff; flex-direction: column; padding: 30px; box-shadow: 0 10px 20px rgba(0,0,0,0.05); gap: 20px; }
    .nav-links.active { display: flex; flex-wrap: wrap; }
    .mobile-toggle { display: block; }
    .nav-links .btn-primary { display: block; width: 100%; }

    .hero { flex-direction: column; text-align: center; padding: 40px 5%; }
    .hero-content { margin-bottom: 40px; }
    .hero h1 { font-size: 40px; }
    .feat-grid, .test-grid, .footer-grid { grid-template-columns: 1fr; }
    .content-section { flex-direction: column; gap: 40px; }
    .cta-box { padding: 40px 20px; }
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
    color: #1e293b;
    font-weight: 800;
    font-size: 20px;
    letter-spacing: -0.5px;
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }


  /* Extracted Template Inline Styles */
  .tpl-saasHero-1 { background: #fff; color: #6366f1; }
  .tpl-saasHero-2 { color: #64748b; }
  .tpl-saasHero-3 { color: #94a3b8; }
  .tpl-saasHero-4 { border: 2px dashed #22c55e; border-radius: 8px; background: rgba(34,197,94,0.1); color: #166534; }
`;

export const saasHeroHtml = `
  <div class="saas-container">
    <nav class="navbar">
      <div class="logo">BizFlow</div>
      <div class="mobile-toggle" onclick="document.querySelector('.nav-links').classList.toggle('active')">☰</div>
      <ul class="nav-links">
        <li><a href="#features">Features</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#reviews">Reviews</a></li>
        <li><button class="btn-primary" style="width: auto; padding: 10px 20px;">Get Started</button></li>
      </ul>
    </nav>

    <div class="hero">
      <div class="hero-content">
        <h1>Transform Your Business Operations.</h1>
        <p>The all-in-one platform to manage your team, projects, and clients with insane efficiency. Join 2,000+ growing businesses.</p>
        <div style="display: flex; flex-wrap: wrap; gap: 20px;">
           <img src="https://upload.wikimedia.org/wikipedia/commons/a/ab/Logo_of_the_Google.svg" style="height: 20px; opacity: 0.5;" />
           <img src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" style="height: 20px; opacity: 0.5;" />
        </div>
      </div>
      <div class="hero-form">
        <h3>Request a Demo</h3>
        <form>
          <input type="text" placeholder="Full Name" required />
          <input type="email" placeholder="Work Email" required />
          <input type="text" placeholder="Company Name" required />
          <button type="submit" class="btn-primary">Send Request</button>
        </form>
      </div>
    </div>

    <div class="features" id="features">
      <h2>Built for Speed and Scale</h2>
      <div class="feat-grid">
        <div class="feat-card">
          <i>🚀</i>
          <h4>Fast Setup</h4>
          <p>Get up and running in less than 10 minutes with our easy onboarding.</p>
        </div>
        <div class="feat-card">
          <i>🔒</i>
          <h4>Secure Data</h4>
          <p>Your business data is encrypted and backed up every hour on the cloud.</p>
        </div>
        <div class="feat-card">
          <i>📊</i>
          <h4>Live Reports</h4>
          <p>Real-time analytics to help you make data-driven decisions instantly.</p>
        </div>
      </div>
    </div>

    <div class="content-section" id="about">
      <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" class="content-img" />
      <div class="content-text">
        <h2>Collaboration Made Simple.</h2>
        <p>Break down silos and bring your team together in one unified workspace. Chat, share files, and track progress without switching apps.</p>
        <ul style="list-style: none; padding: 0; margin-top: 25px;">
           <li style="margin-bottom: 10px;">✅ Shared Team Calendars</li>
           <li style="margin-bottom: 10px;">✅ Real-time Project Tracking</li>
           <li style="margin-bottom: 10px;">✅ Seamless File Integrations</li>
        </ul>
      </div>
    </div>

    <div class="testimonials" id="reviews">
      <h2>Success Stories</h2>
      <div class="test-grid">
        <div class="test-card">
          <p>"BizFlow completely changed how our agency works. We're 40% more productive."</p>
          <p><b>— Mark Stevens</b>, CEO at Arc</p>
        </div>
        <div class="test-card">
          <p>"The best investment we've made this year. The support team is also amazing."</p>
          <p><b>— Sarah Lee</b>, Founder of Zen</p>
        </div>
        <div class="test-card">
          <p>"Simple, fast, and powerful. Exactly what we needed for our growing startup."</p>
          <p><b>— David Chen</b>, CTO at Spark</p>
        </div>
      </div>
    </div>

    <div class="cta-section">
      <div class="cta-box">
        <h2>Ready to grow your business?</h2>
        <p>Join thousands of businesses already scaling with BizFlow.</p>
        <button class="btn-primary tpl-saasHero-1"  style="width: auto; padding: 18px 40px; margin-top: 20px">Get Started for Free</button>
      </div>
    </div>

    <footer class="footer">
      <div class="footer-grid">
        <div class="footer-col">
          <div class="logo">BizFlow</div>
          <p class="tpl-saasHero-2" style="margin-top: 20px">The modern business operating system.</p>
        </div>
        <div class="footer-col">
          <h4>Solution</h4>
          <p>Enterprise</p>
          <p>Small Business</p>
        </div>
        <div class="footer-col">
          <h4>Support</h4>
          <p>Help Center</p>
          <p>Contact</p>
        </div>
        <div class="footer-col">
          <h4>Legal</h4>
          <p>Privacy</p>
          <p>Terms</p>
        </div>
      </div>
      <p class="tpl-saasHero-3" style="text-align: center; font-size: 14px">© 2026 BizFlow Inc.</p>
    </footer>

    <div id="loader" class="page-loader">
      <div class="loader-visual">
        <div class="loader-ring"></div>
        <div class="loader-ring"></div>
      </div>
      <div class="loader-text">Setting up your demo...</div>
    </div>

</div>


<script id="core-interactions">
  (function() {
    // Check if we are inside GrapesJS editor
    var isInEditor = !!document.querySelector('[data-gjs-type]') || document.body.classList.contains('gjs-dashed');
    
    // Form Validation (runs everywhere so you can see red borders in editor)
    document.addEventListener('submit', function(e) {
      if (e.target.tagName === 'FORM') {
        e.target.setAttribute('novalidate', 'true');
        var isValid = true;
        var inputs = e.target.querySelectorAll('input:not([type="submit"]):not([type="hidden"]):not([type="button"]), textarea, select');
        
        inputs.forEach(function(input) {
          if (!input.dataset.valSetup) {
            input.dataset.valSetup = 'true';
            input.addEventListener('input', function() {
              if (input.value.trim()) {
                input.style.outline = '2px solid #22c55e';
                input.style.outlineOffset = '1px';
                input.style.borderColor = '#22c55e';
                if (input.nextElementSibling && input.nextElementSibling.classList.contains('val-error')) {
                  input.nextElementSibling.style.display = 'none';
                }
              } else {
                input.style.outline = '2px solid #ef4444';
                input.style.outlineOffset = '1px';
                input.style.borderColor = '#ef4444';
                if (input.nextElementSibling && input.nextElementSibling.classList.contains('val-error')) {
                  input.nextElementSibling.style.display = 'block';
                }
              }
            });
          }

          if (!input.value.trim() && input.hasAttribute('required')) {
            isValid = false;
            input.style.outline = '2px solid #ef4444';
            input.style.outlineOffset = '1px';
            input.style.borderColor = '#ef4444';
            
            if (!input.parentElement.classList.contains('val-wrapper')) {
                var wrapper = document.createElement('div');
                wrapper.className = 'val-wrapper';
                wrapper.style.display = 'flex';
                wrapper.style.flexDirection = 'column';
                wrapper.style.width = '100%';
                
                var computed = window.getComputedStyle(input);
                if (window.getComputedStyle(input.parentElement).display === 'grid') {
                    wrapper.style.gridColumn = input.style.gridColumn || computed.gridColumn;
                    wrapper.style.gridRow = input.style.gridRow || computed.gridRow;
                }
                
                input.parentNode.insertBefore(wrapper, input);
                wrapper.appendChild(input);
            }

            if (!input.nextElementSibling || !input.nextElementSibling.classList.contains('val-error')) {
              var fieldName = input.getAttribute('placeholder') || input.getAttribute('name') || 'This field';
              var err = document.createElement('span');
              err.className = 'val-error';
              err.style.color = '#ef4444';
              err.style.fontSize = '12px';
              err.style.display = 'block';
              err.style.marginTop = '4px';
              err.style.fontWeight = '500';
              err.textContent = '*' + fieldName.replace(/\\*$/, '').trim() + ' is required';
              input.parentNode.insertBefore(err, input.nextSibling);
            } else {
              input.nextElementSibling.style.display = 'block';
            }
          }
        });
        
        if (!isValid || isInEditor) {
          e.preventDefault();
          e.stopImmediatePropagation();
          if (isInEditor) {
            var existingModal = document.getElementById("preview-mode-modal");
            if (existingModal) existingModal.remove();
            var modalHtml = '<div id="preview-mode-modal" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 999999; display: flex; align-items: center; justify-content: center; background: rgba(15, 23, 42, 0.7); backdrop-filter: blur(8px); opacity: 0; animation: pModalFadeIn 0.3s forwards; font-family: system-ui, -apple-system, sans-serif;"><div style="background: #ffffff; width: 90%; max-width: 400px; border-radius: 20px; padding: 32px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); text-align: center; transform: scale(0.95); animation: pModalScaleUp 0.3s forwards;"><div style="width: 60px; height: 60px; background: #FEF2F2; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;"><svg style="width: 30px; height: 30px; color: #EF4444;" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg></div><h3 style="font-size: 20px; font-weight: 700; color: #0F172A; margin: 0 0 12px; letter-spacing: -0.02em;">Preview Mode Active</h3><p style="font-size: 15px; color: #64748B; margin: 0 0 28px; line-height: 1.5;">Form submissions are disabled in preview mode. Publish your page to accept real submissions.</p><button onclick="document.getElementById(&apos;preview-mode-modal&apos;).remove()" style="width: 100%; background: #0F172A; color: #ffffff; border: none; padding: 14px; border-radius: 12px; font-size: 15px; font-weight: 600; cursor: pointer; transition: background 0.2s;" onmouseover="this.style.background=&apos;#1E293B&apos;" onmouseout="this.style.background=&apos;#0F172A&apos;">Got it, close</button></div><style>@keyframes pModalFadeIn { to { opacity: 1; } } @keyframes pModalScaleUp { to { transform: scale(1); } }</style></div>';
            document.body.insertAdjacentHTML("beforeend", modalHtml);
          }
          e.preventDefault();
          e.stopImmediatePropagation();
        } else if (!isInEditor) {
          e.preventDefault();
          var btn = e.target.querySelector('button[type="submit"]') || e.target.querySelector('input[type="submit"]');
          if (btn) {
            if(btn.innerText) btn.innerText = 'Sending...';
            else btn.value = 'Sending...';
          }
          setTimeout(function() {
            e.target.innerHTML = '<div class="tpl-saasHero-4" style="padding: 20px; text-align: center"><h3 style="margin: 0 0 10px 0; font-size: 20px;">Thank You!</h3><p style="margin: 0;">Your request has been submitted successfully.</p></div>';
          }, 1000);
        }
      }
    }, true);
  })();
</script>

`;
