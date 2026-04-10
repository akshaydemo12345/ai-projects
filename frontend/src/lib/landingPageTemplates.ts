/**
 * Generates a responsive PPC landing page HTML.
 * Uses CSS classes + media queries for full responsiveness.
 */
export interface LandingPageConfig {
  businessName: string;
  industry: string;
  pageType: string;
  businessDesc: string;
  targetAudience: string;
  ctaText: string;
  aiPrompt: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  websiteUrl?: string;
  logoUrl?: string;
}

export function generateLandingPageHtml(cfg: LandingPageConfig): { html: string; css: string } {
  const p = cfg.primaryColor || '#7c3aed';
  const s = cfg.secondaryColor || '#a855f7';
  const a = cfg.accentColor || '#6366f1';
  const biz = cfg.businessName || 'Your Business';
  const desc = cfg.businessDesc || 'We provide world-class solutions to help your business grow.';
  const audience = cfg.targetAudience || 'business owners';
  const cta = cfg.ctaText || 'Get Started Free';
  const industry = cfg.industry || 'SaaS';
  const logo = cfg.logoUrl;

  const css = `
*,*::before,*::after{box-sizing:border-box}
body{margin:0;font-family:'Inter',system-ui,-apple-system,sans-serif}
img{max-width:100%;height:auto}

.lp-navbar{height:70px;background:#fff;border-bottom:1px solid #f1f5f9;display:flex;align-items:center}
.lp-navbar-inner{max-width:1140px;margin:0 auto;width:100%;padding:0 20px;display:flex;align-items:center;justify-content:space-between}
.lp-logo{height:32px;object-contain:fit}
.lp-logo-text{font-size:20px;font-weight:800;color:#0f172a;text-decoration:none}

.lp-container{max-width:1140px;margin:0 auto;padding:0 20px}
.lp-section{padding:60px 20px;font-family:'Inter',system-ui,sans-serif}
.lp-hero{background:linear-gradient(135deg,#0f172a 0%,#1e293b 100%);padding:60px 20px}
.lp-hero-inner{max-width:1140px;margin:0 auto;display:flex;gap:40px;align-items:center}
.lp-hero-content{flex:1}
.lp-hero-badge{display:inline-block;background:rgba(${hexToRgb(p)},0.15);color:${s};padding:6px 16px;border-radius:100px;font-size:13px;font-weight:600;margin-bottom:24px}
.lp-hero h1{font-size:40px;font-weight:800;color:#fff;line-height:1.15;margin:0 0 20px}
.lp-hero p{font-size:16px;color:rgba(255,255,255,0.72);line-height:1.7;margin:0 0 28px}
.lp-checks{display:flex;flex-direction:column;gap:10px}
.lp-check{display:flex;align-items:center;gap:10px;color:rgba(255,255,255,0.75);font-size:14px}
.lp-check span{color:#22c55e;font-weight:700}
.lp-form-card{width:100%;max-width:420px;flex-shrink:0;background:#fff;border-radius:16px;padding:32px;box-shadow:0 25px 60px rgba(0,0,0,0.3)}
.lp-form-card h3{font-size:20px;font-weight:700;color:#0f172a;margin:0 0 6px}
.lp-form-card>p{font-size:13px;color:#94a3b8;margin:0 0 20px}
.lp-form{display:flex;flex-direction:column;gap:12px}
.lp-input{display:block;width:100%;border:1px solid #e2e8f0;border-radius:8px;padding:12px 14px;font-size:14px;box-sizing:border-box;font-family:inherit;outline:none}
.lp-input:focus{border-color:${p}}
.lp-btn{width:100%;background:${p};color:#fff;border:none;border-radius:8px;padding:14px;font-size:15px;font-weight:700;cursor:pointer}
.lp-btn:hover{opacity:0.92}
.lp-stats{background:${p};padding:48px 20px}
.lp-stats-inner{max-width:1140px;margin:0 auto;display:grid;grid-template-columns:repeat(4,1fr);gap:20px;text-align:center}
.lp-stat-num{font-size:36px;font-weight:800;color:#fff}
.lp-stat-label{font-size:14px;color:rgba(255,255,255,0.75);margin-top:6px}
.lp-grid-3{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
.lp-grid-4{display:grid;grid-template-columns:repeat(4,1fr);gap:24px;text-align:center}
.lp-grid-2{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.lp-card{background:#fff;border-radius:12px;padding:28px;border:1px solid #e2e8f0}
.lp-card-icon{font-size:32px;margin-bottom:16px}
.lp-card h3{font-size:17px;font-weight:700;color:#0f172a;margin:0 0 10px}
.lp-card p{font-size:14px;color:#64748b;margin:0;line-height:1.65}
.lp-step-circle{width:64px;height:64px;border-radius:50%;background:${p};color:#fff;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:800;margin:0 auto 20px}
.lp-testimonial{background:#fff;border-radius:14px;padding:28px;border:1px solid #e2e8f0;box-shadow:0 4px 16px rgba(0,0,0,0.06)}
.lp-stars{color:#f59e0b;font-size:18px;margin-bottom:14px}
.lp-price-card{border-radius:14px;padding:32px;border:1px solid #e2e8f0;background:#fff}
.lp-price-featured{border:2px solid ${p};background:linear-gradient(135deg,${p},${a});position:relative}
.lp-price-badge{position:absolute;top:-14px;left:50%;transform:translateX(-50%);background:#f59e0b;color:#fff;font-size:11px;font-weight:700;padding:4px 16px;border-radius:100px;white-space:nowrap}
.lp-price-amount{font-size:40px;font-weight:800;line-height:1}
.lp-price-amount small{font-size:14px;font-weight:500}
.lp-price-btn{display:block;width:100%;border-radius:8px;padding:13px;font-weight:700;font-size:14px;cursor:pointer;text-decoration:none;text-align:center;box-sizing:border-box}
.lp-cta-section{background:linear-gradient(135deg,${p},${a});padding:60px 20px;text-align:center}
.lp-cta-section h2{font-size:34px;font-weight:800;color:#fff;margin:0 0 16px}
.lp-cta-section p{font-size:17px;color:rgba(255,255,255,0.8);margin:0 0 32px}
.lp-cta-btns{display:flex;gap:16px;justify-content:center;flex-wrap:wrap}
.lp-contact-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.lp-contact-full{grid-column:1/-1}

@media(max-width:992px){
  .lp-hero-inner{flex-direction:column;text-align:center}
  .lp-hero-content{order:1}
  .lp-form-card{order:2;max-width:100%}
  .lp-checks{align-items:center}
  .lp-hero h1{font-size:32px}
  .lp-grid-3{grid-template-columns:repeat(2,1fr)}
  .lp-grid-4{grid-template-columns:repeat(2,1fr)}
  .lp-stats-inner{grid-template-columns:repeat(2,1fr)}
}
@media(max-width:640px){
  .lp-hero h1{font-size:26px}
  .lp-hero p{font-size:15px}
  .lp-section{padding:40px 16px}
  .lp-hero{padding:40px 16px}
  .lp-grid-3{grid-template-columns:1fr}
  .lp-grid-4{grid-template-columns:1fr}
  .lp-grid-2{grid-template-columns:1fr}
  .lp-contact-grid{grid-template-columns:1fr}
  .lp-stats-inner{grid-template-columns:repeat(2,1fr);gap:16px}
  .lp-stat-num{font-size:28px}
  .lp-price-amount{font-size:32px}
  .lp-form-card{padding:24px}
}
`;

  const html = `
<!-- ========== NAVBAR ========== -->
<header class="lp-navbar">
  <div class="lp-navbar-inner">
    <a href="#" class="lp-logo-text">
      ${logo ? `<img src="${logo}" alt="${biz}" class="lp-logo" />` : biz}
    </a>
    <a href="#contact" class="lp-btn" style="width:auto;padding:10px 24px;background:${p}">${cta}</a>
  </div>
</header>

<!-- ========== HERO + LEAD FORM ========== -->
<section class="lp-hero">
  <div class="lp-hero-inner">
    <div class="lp-hero-content">
      <span class="lp-hero-badge">🏆 Trusted by 500+ ${audience}</span>
      <h1>${cfg.aiPrompt ? cfg.aiPrompt.slice(0, 80) : `Grow Your ${industry} Business With Proven Results`}</h1>
      <p>${desc}</p>
      <div class="lp-checks">
        <div class="lp-check"><span>✓</span> No long-term contracts required</div>
        <div class="lp-check"><span>✓</span> Results within 30 days guaranteed</div>
        <div class="lp-check"><span>✓</span> 24/7 dedicated support</div>
      </div>
    </div>
    <div class="lp-form-card">
      <h3>Get Your Free Quote</h3>
      <p>Fill out the form and we'll get back within 60 seconds.</p>
      <form action="#" method="POST" class="lp-form">
        <input type="text" name="full_name" placeholder="Full Name" required class="lp-input" />
        <input type="email" name="email" placeholder="Email Address" required class="lp-input" />
        <input type="tel" name="phone" placeholder="Phone Number" class="lp-input" />
        <select name="service" class="lp-input" style="color:#64748b">
          <option value="">I'm interested in...</option>
          <option value="consultation">Free Consultation</option>
          <option value="audit">Free Audit</option>
          <option value="demo">Product Demo</option>
          <option value="pricing">Pricing Info</option>
        </select>
        <label style="display:flex;align-items:center;gap:8px;font-size:12px;color:#64748b;cursor:pointer">
          <input type="checkbox" name="agree" style="accent-color:${p};width:16px;height:16px" />
          I agree to be contacted via phone, email or SMS.
        </label>
        <button type="submit" class="lp-btn">${cta}</button>
      </form>
      <p style="font-size:11px;color:#94a3b8;text-align:center;margin:12px 0 0">No commitment. We respect your privacy.</p>
    </div>
  </div>
</section>

<!-- ========== STATS ========== -->
<section class="lp-stats">
  <div class="lp-stats-inner">
    <div><div class="lp-stat-num">500+</div><div class="lp-stat-label">Happy Clients</div></div>
    <div><div class="lp-stat-num">95%</div><div class="lp-stat-label">Client Retention</div></div>
    <div><div class="lp-stat-num">10M+</div><div class="lp-stat-label">Leads Generated</div></div>
    <div><div class="lp-stat-num">312%</div><div class="lp-stat-label">Avg ROI Increase</div></div>
  </div>
</section>

<!-- ========== FEATURES ========== -->
<section id="features" class="lp-section" style="background:#f8fafc">
  <div class="lp-container">
    <div style="text-align:center;margin-bottom:48px">
      <h2 style="font-size:34px;font-weight:800;color:#0f172a;margin:0 0 14px">Why Choose ${biz}?</h2>
      <p style="font-size:17px;color:#64748b;margin:0">We deliver real results, not just promises.</p>
    </div>
    <div class="lp-grid-3">
      <div class="lp-card"><div class="lp-card-icon">🎯</div><h3>Data-Driven Strategy</h3><p>Every decision backed by data and analytics for maximum ROI.</p></div>
      <div class="lp-card"><div class="lp-card-icon">⚡</div><h3>Lightning Fast Results</h3><p>See measurable improvements within the first 30 days.</p></div>
      <div class="lp-card"><div class="lp-card-icon">✍️</div><h3>Expert Team</h3><p>Industry-certified professionals dedicated to your success.</p></div>
      <div class="lp-card"><div class="lp-card-icon">🔗</div><h3>Seamless Integration</h3><p>Works with your existing tools and tech stack with zero hassle.</p></div>
      <div class="lp-card"><div class="lp-card-icon">📍</div><h3>Local Focus</h3><p>Dominate your local market and capture nearby customers.</p></div>
      <div class="lp-card"><div class="lp-card-icon">📈</div><h3>Transparent Reporting</h3><p>Monthly reports so you always know exactly what we're doing.</p></div>
    </div>
  </div>
</section>

<!-- ========== HOW IT WORKS ========== -->
<section class="lp-section" style="background:#fff">
  <div class="lp-container">
    <div style="text-align:center;margin-bottom:48px">
      <h2 style="font-size:34px;font-weight:800;color:#0f172a;margin:0 0 14px">How It Works</h2>
      <p style="font-size:17px;color:#64748b;margin:0">A simple 4-step process to get started.</p>
    </div>
    <div class="lp-grid-4">
      <div><div class="lp-step-circle">01</div><h3 style="font-size:17px;font-weight:700;color:#0f172a;margin:0 0 10px">Schedule a Call</h3><p style="font-size:13px;color:#64748b;margin:0;line-height:1.65">Book a free 30-minute strategy session.</p></div>
      <div><div class="lp-step-circle">02</div><h3 style="font-size:17px;font-weight:700;color:#0f172a;margin:0 0 10px">Custom Strategy</h3><p style="font-size:13px;color:#64748b;margin:0;line-height:1.65">We create a tailored plan for your goals.</p></div>
      <div><div class="lp-step-circle">03</div><h3 style="font-size:17px;font-weight:700;color:#0f172a;margin:0 0 10px">Execute &amp; Optimize</h3><p style="font-size:13px;color:#64748b;margin:0;line-height:1.65">We implement and continuously improve.</p></div>
      <div><div class="lp-step-circle">04</div><h3 style="font-size:17px;font-weight:700;color:#0f172a;margin:0 0 10px">Scale Growth</h3><p style="font-size:13px;color:#64748b;margin:0;line-height:1.65">We scale campaigns for maximum ROI.</p></div>
    </div>
  </div>
</section>

<!-- ========== TESTIMONIALS ========== -->
<section id="testimonials" class="lp-section" style="background:#f8fafc">
  <div class="lp-container">
    <div style="text-align:center;margin-bottom:48px">
      <h2 style="font-size:34px;font-weight:800;color:#0f172a;margin:0 0 14px">What Our Clients Say</h2>
      <p style="font-size:17px;color:#64748b;margin:0">Don't take our word for it — hear from ${audience} like you.</p>
    </div>
    <div class="lp-grid-3">
      <div class="lp-testimonial">
        <div class="lp-stars">★★★★★</div>
        <p style="font-size:15px;color:#0f172a;line-height:1.7;margin:0 0 20px;font-style:italic">"Their strategy took us from page 5 to #1 in just 4 months. Traffic increased 380%."</p>
        <div style="font-weight:700;color:#0f172a;font-size:14px">Sarah Johnson</div>
        <div style="font-size:12px;color:#64748b">CEO, TechStartup Inc.</div>
      </div>
      <div class="lp-testimonial">
        <div class="lp-stars">★★★★★</div>
        <p style="font-size:15px;color:#0f172a;line-height:1.7;margin:0 0 20px;font-style:italic">"215% increase in qualified leads within 6 months. Professional team."</p>
        <div style="font-weight:700;color:#0f172a;font-size:14px">Michael Chen</div>
        <div style="font-size:12px;color:#64748b">Marketing Director, E-Commerce Pro</div>
      </div>
      <div class="lp-testimonial">
        <div class="lp-stars">★★★★★</div>
        <p style="font-size:15px;color:#0f172a;line-height:1.7;margin:0 0 20px;font-style:italic">"Revenue doubled in a year. Best investment for our business growth."</p>
        <div style="font-weight:700;color:#0f172a;font-size:14px">Emily Rodriguez</div>
        <div style="font-size:12px;color:#64748b">Founder, Local Services Co.</div>
      </div>
    </div>
  </div>
</section>

<!-- ========== PRICING ========== -->
<section id="pricing" class="lp-section" style="background:#fff">
  <div class="lp-container">
    <div style="text-align:center;margin-bottom:48px">
      <h2 style="font-size:34px;font-weight:800;color:#0f172a;margin:0 0 14px">Simple, Transparent Pricing</h2>
      <p style="font-size:17px;color:#64748b;margin:0">Choose the plan that fits your business.</p>
    </div>
    <div class="lp-grid-3">
      <div class="lp-price-card">
        <div style="font-size:18px;font-weight:700;color:#0f172a;margin-bottom:6px">Starter</div>
        <div class="lp-price-amount" style="color:${p}">$499<small style="color:#64748b">/month</small></div>
        <p style="font-size:13px;color:#64748b;margin:12px 0 24px">Perfect for small businesses.</p>
        <div style="margin-bottom:24px">
          <div style="display:flex;align-items:center;gap:8px;font-size:13px;color:#0f172a;padding:5px 0"><span style="color:#22c55e;font-weight:700">✓</span> Up to 15 Keywords</div>
          <div style="display:flex;align-items:center;gap:8px;font-size:13px;color:#0f172a;padding:5px 0"><span style="color:#22c55e;font-weight:700">✓</span> Monthly Reporting</div>
          <div style="display:flex;align-items:center;gap:8px;font-size:13px;color:#0f172a;padding:5px 0"><span style="color:#22c55e;font-weight:700">✓</span> Email Support</div>
        </div>
        <a href="#contact" class="lp-price-btn" style="background:transparent;color:${p};border:2px solid ${p}">Get Started</a>
      </div>
      <div class="lp-price-card lp-price-featured">
        <div class="lp-price-badge">MOST POPULAR</div>
        <div style="font-size:18px;font-weight:700;color:#fff;margin-bottom:6px">Growth</div>
        <div class="lp-price-amount" style="color:#fff">$999<small style="color:rgba(255,255,255,0.7)">/month</small></div>
        <p style="font-size:13px;color:rgba(255,255,255,0.75);margin:12px 0 24px">For growing businesses.</p>
        <div style="margin-bottom:24px">
          <div style="display:flex;align-items:center;gap:8px;font-size:13px;color:#fff;padding:5px 0"><span style="color:#86efac;font-weight:700">✓</span> Up to 40 Keywords</div>
          <div style="display:flex;align-items:center;gap:8px;font-size:13px;color:#fff;padding:5px 0"><span style="color:#86efac;font-weight:700">✓</span> Weekly Reporting</div>
          <div style="display:flex;align-items:center;gap:8px;font-size:13px;color:#fff;padding:5px 0"><span style="color:#86efac;font-weight:700">✓</span> Priority Support</div>
          <div style="display:flex;align-items:center;gap:8px;font-size:13px;color:#fff;padding:5px 0"><span style="color:#86efac;font-weight:700">✓</span> Competitor Analysis</div>
        </div>
        <a href="#contact" class="lp-price-btn" style="background:#fff;color:${p};border:none">Start Growing</a>
      </div>
      <div class="lp-price-card">
        <div style="font-size:18px;font-weight:700;color:#0f172a;margin-bottom:6px">Enterprise</div>
        <div class="lp-price-amount" style="color:${p}">Custom</div>
        <p style="font-size:13px;color:#64748b;margin:12px 0 24px">For large businesses.</p>
        <div style="margin-bottom:24px">
          <div style="display:flex;align-items:center;gap:8px;font-size:13px;color:#0f172a;padding:5px 0"><span style="color:#22c55e;font-weight:700">✓</span> Unlimited Keywords</div>
          <div style="display:flex;align-items:center;gap:8px;font-size:13px;color:#0f172a;padding:5px 0"><span style="color:#22c55e;font-weight:700">✓</span> Dedicated Team</div>
          <div style="display:flex;align-items:center;gap:8px;font-size:13px;color:#0f172a;padding:5px 0"><span style="color:#22c55e;font-weight:700">✓</span> 24/7 Support</div>
        </div>
        <a href="#contact" class="lp-price-btn" style="background:transparent;color:${p};border:2px solid ${p}">Contact Us</a>
      </div>
    </div>
  </div>
</section>

<!-- ========== CTA BANNER ========== -->
<section class="lp-cta-section">
  <div style="max-width:900px;margin:0 auto">
    <h2>Ready to Grow Your Business?</h2>
    <p>Join 500+ ${audience} already seeing results. Start your free consultation today.</p>
    <div class="lp-cta-btns">
      <a href="#contact" style="background:#fff;color:${p};border:none;border-radius:8px;padding:14px 32px;font-size:15px;font-weight:700;text-decoration:none">${cta}</a>
      <a href="#features" style="background:transparent;color:#fff;border:2px solid rgba(255,255,255,0.5);border-radius:8px;padding:14px 32px;font-size:15px;font-weight:600;text-decoration:none">Learn More</a>
    </div>
  </div>
</section>

<!-- ========== CONTACT FORM ========== -->
<section id="contact" class="lp-section" style="background:#fff">
  <div style="max-width:700px;margin:0 auto">
    <div style="text-align:center;margin-bottom:40px">
      <h2 style="font-size:34px;font-weight:800;color:#0f172a;margin:0 0 12px">Get In Touch</h2>
      <p style="font-size:16px;color:#64748b;margin:0">Schedule your free strategy call today.</p>
    </div>
    <div style="background:#f8fafc;border-radius:16px;padding:32px;border:1px solid #e2e8f0">
      <form action="#" method="POST">
        <div class="lp-contact-grid">
          <div>
            <label style="font-size:12px;font-weight:600;color:#0f172a;display:block;margin-bottom:6px">Full Name *</label>
            <input type="text" name="name" placeholder="John Doe" required class="lp-input" />
          </div>
          <div>
            <label style="font-size:12px;font-weight:600;color:#0f172a;display:block;margin-bottom:6px">Email Address *</label>
            <input type="email" name="email" placeholder="john@example.com" required class="lp-input" />
          </div>
          <div>
            <label style="font-size:12px;font-weight:600;color:#0f172a;display:block;margin-bottom:6px">Phone Number</label>
            <input type="tel" name="phone" placeholder="+1 (555) 000-0000" class="lp-input" />
          </div>
          <div>
            <label style="font-size:12px;font-weight:600;color:#0f172a;display:block;margin-bottom:6px">Budget Range *</label>
            <select name="budget" required class="lp-input" style="background:#fff">
              <option value="">Select...</option>
              <option value="500">Under $500</option>
              <option value="1000">$500 - $1,000</option>
              <option value="2000">$1,000 - $2,000</option>
              <option value="5000">$2,000+</option>
            </select>
          </div>
          <div class="lp-contact-full">
            <label style="font-size:12px;font-weight:600;color:#0f172a;display:block;margin-bottom:6px">Tell us about your goals</label>
            <textarea name="message" rows="4" placeholder="Describe what you're looking for..." class="lp-input" style="resize:vertical"></textarea>
          </div>
        </div>
        <button type="submit" class="lp-btn" style="margin-top:20px">${cta}</button>
        <p style="font-size:11px;color:#94a3b8;text-align:center;margin:12px 0 0">By submitting, you agree to our Privacy Policy.</p>
      </form>
    </div>
  </div>
</section>

<!-- Footer Removed per landing page requirement -->`;

  return { html, css };
}

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}
