export const plumber07Styles = `
@import url('https://fonts.googleapis.com/css2?family=Neue+Montreal:wght@400;500&family=Archivo:wght@400;500;600;700;800;900&display=swap');
 
:root {
  --bg-white: #FFFFFF;
  --bg-off: #F0F0EE;
  --ink: #0D0D0D;
  --primary: PRIMARY_COLOR_PLACEHOLDER;
  --secondary: SECONDARY_COLOR_PLACEHOLDER;
  --text-main: var(--ink);
  --text-muted: #6E6E6E;
  --rule: 1px solid rgba(13,13,13,0.14);
  --glow-primary: none;
}
 
body, .gjs-dashed, [data-gjs-type="wrapper"], main {
    background-color: var(--bg-white) !important;
    color: var(--text-main) !important;
}
h1, h2, h3, h4, h5, h6, p, span, div, a { color: inherit; }
 
* { box-sizing: border-box; margin: 0; padding: 0; border-radius: 0 !important; }
body { font-family: 'Archivo', sans-serif; background: var(--bg-white); color: var(--text-main); line-height: 1.5; overflow-x: hidden; }
h1, h2, h3, h4 { font-family: 'Archivo', sans-serif; font-weight: 800; letter-spacing: -0.03em; text-transform: uppercase; }
a { text-decoration: none; color: inherit; transition: 0.2s; }
img { max-width: 100%; display: block; filter: grayscale(100%) contrast(1.1); }
.container { max-width: 1320px; margin: 0 auto; padding: 0 40px; }
.idx { font-family: 'Archivo', sans-serif; font-weight: 700; font-size: 12px; color: var(--primary); }
 
/* 1. Nav */
.header-07 { border-bottom: var(--rule); padding: 22px 0; position: sticky; top: 0; background: var(--bg-white); z-index: 100; }
.nav-07-inner { display: flex; justify-content: space-between; align-items: center; }
.logo-07 { font-weight: 900; font-size: 18px; letter-spacing: -0.02em; }
.nav-links-07 { display: flex; gap: 0; }
.nav-links-07 a { font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; padding: 0 22px; border-left: var(--rule); }
.nav-links-07 a:first-child { border-left: none; }
.nav-links-07 a:hover { color: var(--primary); }
.btn-07 { background: var(--ink); color: #fff; padding: 13px 28px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; border: none; cursor: pointer; }
.btn-07:hover { background: var(--primary); }
.btn-07-alt { border: 1.5px solid var(--ink); padding: 12px 26px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
 
/* 2. Hero - massive type, no image */
.hero-07 { padding: 90px 0; border-bottom: var(--rule); }
.hero-07-top { display: flex; justify-content: space-between; margin-bottom: 40px; }
.hero-07 h1 { font-size: clamp(2.6rem, 8vw, 6.4rem); line-height: 0.92; }
.hero-07-meta { display: grid; grid-template-columns: repeat(4, 1fr); border-top: var(--rule); margin-top: 60px; }
.hero-07-meta div { padding: 24px 30px 0; border-left: var(--rule); }
.hero-07-meta div:first-child { border-left: none; padding-left: 0; }
.hero-07-meta .label { font-size: 11px; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.5px; margin-bottom: 8px; }
.hero-07-meta .val { font-size: 22px; font-weight: 800; }
 
/* 3. Index/TOC strip */
.toc-07 { border-bottom: var(--rule); }
.toc-07-row { display: flex; justify-content: space-between; align-items: center; padding: 26px 0; border-bottom: var(--rule); }
.toc-07-row:last-child { border-bottom: none; }
.toc-07-inner { }
.toc-07-num { font-size: 13px; font-weight: 700; color: var(--primary); width: 50px; display: inline-block; }
.toc-07-name { font-size: 22px; font-weight: 700; text-transform: uppercase; }
.toc-07-desc { font-size: 13px; color: var(--text-muted); max-width: 320px; text-align: right; text-transform: none; font-weight: 400; }
 
/* 4. Signature: the Tombstone Wall — real deal-announcement tombstones, not icon cells */
.services-07 { padding: 100px 0; border-bottom: var(--rule); }
.tombstone-wall-07 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
.tombstone-07 { border: 1.5px solid var(--ink); padding: 34px 24px; text-align: center; position: relative; }
.tombstone-07::before, .tombstone-07::after { content: ""; position: absolute; left: 8px; right: 8px; height: 1px; background: var(--ink); }
.tombstone-07::before { top: 8px; }
.tombstone-07::after { bottom: 8px; }
.tombstone-role { font-size: 10px; letter-spacing: 1px; color: var(--text-muted); margin-bottom: 18px; text-transform: uppercase; }
.tombstone-co { font-size: 17px; font-weight: 800; margin-bottom: 10px; }
.tombstone-rule-07 { width: 30px; height: 2px; background: var(--primary); margin: 14px auto; }
.tombstone-target { font-size: 14px; font-weight: 600; text-transform: uppercase; margin-bottom: 14px; color: var(--text-muted); }
.tombstone-val { font-family: 'Archivo', sans-serif; font-size: 22px; font-weight: 900; }
.tombstone-yr { font-size: 10px; color: var(--text-muted); margin-top: 12px; letter-spacing: 0.5px; }
 
/* 5. Data table section */
.data-07 { padding: 100px 0; }
.data-07-head { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 50px; }
.data-07-head h2 { font-size: 30px; }
.data-table-07 { width: 100%; border-collapse: collapse; }
.data-table-07 th { text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text-muted); padding: 14px 0; border-bottom: 2px solid var(--ink); font-weight: 700; }
.data-table-07 td { padding: 20px 0; border-bottom: var(--rule); font-size: 16px; font-weight: 500; }
.data-table-07 tr td:first-child { font-weight: 800; }
.trend-up { color: var(--primary); }
.trend-down { color: var(--secondary); }
 
/* 6. Statement / large quote */
.statement-07 { padding: 120px 0; background: var(--bg-off); border-bottom: var(--rule); }
.statement-07 p { font-size: clamp(1.6rem, 3.6vw, 2.8rem); font-weight: 800; text-transform: uppercase; line-height: 1.15; letter-spacing: -0.02em; max-width: 1000px; }
.statement-07 p span { color: var(--primary); }
 
/* 7. Offices grid */
.offices-07 { padding: 100px 0; border-bottom: var(--rule); }
.offices-07 h2 { font-size: 30px; margin-bottom: 60px; }
.offices-grid-07 { display: grid; grid-template-columns: repeat(4, 1fr); border-top: var(--rule); border-left: var(--rule); }
.office-07-cell { border-right: var(--rule); padding: 30px; }
.office-07-cell h4 { font-size: 16px; margin-bottom: 10px; }
.office-07-cell p { font-size: 13px; color: var(--text-muted); text-transform: none; font-weight: 400; }
 
/* 8. Reports/news list */
.news-07 { padding: 100px 0; border-bottom: var(--rule); }
.news-07 h2 { font-size: 30px; margin-bottom: 50px; }
.news-item-07 { display: grid; grid-template-columns: 100px 1fr auto; gap: 30px; align-items: center; padding: 26px 0; border-bottom: var(--rule); }
.news-item-07 .date { font-size: 12px; color: var(--text-muted); font-weight: 600; }
.news-item-07 h4 { font-size: 18px; font-weight: 700; text-transform: none; }
.news-item-07 .arrow { font-size: 18px; }
 
/* 9. Contact CTA */
.contact-07 { padding: 110px 0; }
.contact-07-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; }
.contact-07 h2 { font-size: 32px; margin-bottom: 20px; }
.contact-07 p { color: var(--text-muted); text-transform: none; font-weight: 400; margin-bottom: 30px; max-width: 400px; }
 
/* 10. Footer */
.footer-07 { border-top: 2px solid var(--ink); padding: 50px 0 30px; }
.footer-07-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 40px; margin-bottom: 50px; }
.footer-07 h4 { font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 18px; color: var(--text-muted); }
.footer-links-07 a { display: block; color: var(--ink); margin-bottom: 10px; font-size: 14px; font-weight: 500; text-transform: none; }
.footer-links-07 a:hover { color: var(--primary); }
.footer-07-bottom { display: flex; justify-content: space-between; font-size: 11px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; }
 
@media (max-width: 1024px) {
  .hero-07-meta, .offices-grid-07 { grid-template-columns: repeat(2, 1fr); }
  .services-07-grid { grid-template-columns: 1fr 1fr; }
  .contact-07-grid { grid-template-columns: 1fr; }
  .footer-07-grid { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 768px) {
  .nav-links-07 { display: none; }
  .hero-07-meta, .services-07-grid, .offices-grid-07 { grid-template-columns: 1fr; }
  .toc-07-desc { display: none; }
  .news-item-07 { grid-template-columns: 1fr; gap: 8px; }
}
 
/* Premium Form Styles */
.premium-form { display: flex; flex-direction: column; gap: 0; width: 100%; }
.premium-form input, .premium-form textarea, .premium-form select {
    width: 100%; padding: 18px 0; border: none; border-bottom: var(--rule);
    background: transparent; color: var(--ink); font-family: 'Archivo', sans-serif;
    font-size: 15px; outline: none; transition: 0.2s all;
}
.premium-form input::placeholder { color: var(--text-muted); text-transform: uppercase; font-size: 12px; letter-spacing: 0.5px; }
.premium-form input:focus { border-color: var(--primary); }
.premium-form button {
    margin-top: 24px; padding: 18px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;
    cursor: pointer; transition: 0.2s; background: var(--ink); color: #fff; border: none;
}
.premium-form button:hover { background: var(--primary); }
@media (max-width: 768px) {
  .hero-07-meta, .tombstone-wall-07, .offices-grid-07, .news-item-07 { grid-template-columns: 1fr !important; }
  .nav-07-inner, .nav-links-07, .hero-07-top, .toc-07-row, .data-07-head, .footer-07-bottom { flex-direction: column !important; }
}

`;
export const plumber07Html = `
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
 
<!-- 1. Nav -->
<header class="header-07">
  <div class="container nav-07-inner">
    <div class="logo-07">LOGO_PLACEHOLDER</div>
    <nav class="nav-links-07">
      <a href="#services">Services</a>
      <a href="#performance">Performance</a>
      <a href="#offices">Offices</a>
      <a href="#news">Reports</a>
    </nav>
    <a href="#" class="btn-07">Get In Touch</a>
  </div>
</header>
 
<main>
  <!-- 2. Hero -->
  <section class="hero-07">
    <div class="container">
      <div class="hero-07-top">
        <span class="idx">01 — Overview</span>
        <span class="idx">FY 2026</span>
      </div>
      <h1>Corporate Finance,<br>Engineered.</h1>
      <div class="hero-07-meta">
        <div><div class="label">Advisory Since</div><div class="val">1988</div></div>
        <div><div class="label">Deals Closed</div><div class="val">1,240+</div></div>
        <div><div class="label">Aggregate Value</div><div class="val">$62B</div></div>
        <div><div class="label">Offices</div><div class="val">14</div></div>
      </div>
    </div>
  </section>
 
  <!-- 3. TOC -->
  <section class="toc-07">
    <div class="container">
      <div class="toc-07-row"><div><span class="toc-07-num">01</span><span class="toc-07-name">M&amp;A Advisory</span></div><div class="toc-07-desc">Sell-side and buy-side representation across mid-market and large-cap transactions.</div></div>
      <div class="toc-07-row"><div><span class="toc-07-num">02</span><span class="toc-07-name">Capital Markets</span></div><div class="toc-07-desc">Debt and equity issuance strategy, structuring, and execution.</div></div>
      <div class="toc-07-row"><div><span class="toc-07-num">03</span><span class="toc-07-name">Restructuring</span></div><div class="toc-07-desc">Balance sheet restructuring and distressed situation advisory.</div></div>
      <div class="toc-07-row"><div><span class="toc-07-num">04</span><span class="toc-07-name">Valuation</span></div><div class="toc-07-desc">Independent fairness opinions and valuation for boards and committees.</div></div>
    </div>
  </section>
 
  <!-- 4. Tombstone wall -->
  <section class="services-07" id="services">
    <div class="container">
      <div class="data-07-head" style="margin-bottom: 50px;">
        <h2 style="font-size:30px;">Recent Mandates</h2>
        <span class="idx">Selected Transactions</span>
      </div>
      <div class="tombstone-wall-07">
        <div class="tombstone-07">
          <div class="tombstone-role">Exclusive Sell-Side Advisor</div>
          <div class="tombstone-co">Harrow Industrial Group</div>
          <div class="tombstone-rule-07"></div>
          <div class="tombstone-target">has been acquired by Sterling Partners</div>
          <div class="tombstone-val">$1.8B</div>
          <div class="tombstone-yr">March 2026</div>
        </div>
        <div class="tombstone-07">
          <div class="tombstone-role">Financial Advisor to the Buyer</div>
          <div class="tombstone-co">Meridian Capital</div>
          <div class="tombstone-rule-07"></div>
          <div class="tombstone-target">acquisition of Voss Logistics</div>
          <div class="tombstone-val">$640M</div>
          <div class="tombstone-yr">November 2025</div>
        </div>
        <div class="tombstone-07">
          <div class="tombstone-role">Debt Placement Agent</div>
          <div class="tombstone-co">Aldergate Health Systems</div>
          <div class="tombstone-rule-07"></div>
          <div class="tombstone-target">senior secured credit facility</div>
          <div class="tombstone-val">$425M</div>
          <div class="tombstone-yr">July 2025</div>
        </div>
        <div class="tombstone-07">
          <div class="tombstone-role">Fairness Opinion</div>
          <div class="tombstone-co">Colford Retail Holdings</div>
          <div class="tombstone-rule-07"></div>
          <div class="tombstone-target">merger with Kestrel Brands</div>
          <div class="tombstone-val">$980M</div>
          <div class="tombstone-yr">May 2025</div>
        </div>
        <div class="tombstone-07">
          <div class="tombstone-role">Restructuring Advisor</div>
          <div class="tombstone-co">Northgate Manufacturing</div>
          <div class="tombstone-rule-07"></div>
          <div class="tombstone-target">balance sheet recapitalization</div>
          <div class="tombstone-val">$310M</div>
          <div class="tombstone-yr">February 2025</div>
        </div>
        <div class="tombstone-07">
          <div class="tombstone-role">IPO Advisor</div>
          <div class="tombstone-co">Faircroft Technologies</div>
          <div class="tombstone-rule-07"></div>
          <div class="tombstone-target">initial public offering, NYSE</div>
          <div class="tombstone-val">$2.1B</div>
          <div class="tombstone-yr">October 2024</div>
        </div>
      </div>
    </div>
  </section>
 
  <!-- 5. Data table -->
  <section class="data-07" id="performance">
    <div class="container">
      <div class="data-07-head">
        <h2>Deal Activity</h2>
        <span class="idx">02 — By Sector</span>
      </div>
      <table class="data-table-07">
        <tr><th>Sector</th><th>Deals</th><th>Volume</th><th>YoY</th></tr>
        <tr><td>Industrials</td><td>312</td><td>$18.4B</td><td class="trend-up">+12.4%</td></tr>
        <tr><td>Technology</td><td>284</td><td>$21.1B</td><td class="trend-up">+18.7%</td></tr>
        <tr><td>Healthcare</td><td>198</td><td>$9.8B</td><td class="trend-down">-3.2%</td></tr>
        <tr><td>Consumer</td><td>246</td><td>$12.6B</td><td class="trend-up">+6.1%</td></tr>
        <tr><td>Financial Services</td><td>200</td><td>$8.2B</td><td class="trend-up">+2.9%</td></tr>
      </table>
    </div>
  </section>
 
  <!-- 6. Statement -->
  <section class="statement-07">
    <div class="container">
      <p>We advise on the transactions that <span>redefine</span> industries, not just the ones that close on schedule.</p>
    </div>
  </section>
 
  <!-- 7. Offices -->
  <section class="offices-07" id="offices">
    <div class="container">
      <h2>Global Offices</h2>
      <div class="offices-grid-07">
        <div class="office-07-cell"><h4>New York</h4><p>350 Park Avenue, NY 10022</p></div>
        <div class="office-07-cell"><h4>London</h4><p>1 Fleet Place, EC4M 7RA</p></div>
        <div class="office-07-cell"><h4>Singapore</h4><p>1 Raffles Quay, 048583</p></div>
        <div class="office-07-cell"><h4>Mumbai</h4><p>Bandra Kurla Complex, 400051</p></div>
      </div>
    </div>
  </section>
 
  <!-- 8. Reports -->
  <section class="news-07" id="news">
    <div class="container">
      <h2>Latest Reports</h2>
      <div class="news-item-07">
        <span class="date">Jul 2026</span>
        <h4>Mid-Market M&amp;A Outlook: Second Half 2026</h4>
        <span class="arrow">&rarr;</span>
      </div>
      <div class="news-item-07">
        <span class="date">Jun 2026</span>
        <h4>Rate Environment and Its Effect on Deal Financing</h4>
        <span class="arrow">&rarr;</span>
      </div>
      <div class="news-item-07">
        <span class="date">May 2026</span>
        <h4>Cross-Border Transactions: A Regulatory Primer</h4>
        <span class="arrow">&rarr;</span>
      </div>
    </div>
  </section>
 
  <!-- 9. Contact -->
  <section class="contact-07">
    <div class="container contact-07-grid">
      <div>
        <span class="idx">03 — Contact</span>
        <h2 style="margin-top:16px;">Start a Conversation</h2>
        <p>Every engagement begins with a confidential conversation about your objectives.</p>
      </div>
      <form class="premium-form" onsubmit="event.preventDefault();">
        <input type="text" placeholder="Full Name" required>
        <input type="text" placeholder="Company" required>
        <input type="email" placeholder="Email Address" required>
        <input type="tel" placeholder="Phone Number" required>
        <button type="submit">Submit Inquiry</button>
      </form>
    </div>
  </section>
</main>
 
<!-- 10. Footer -->
<footer class="footer-07">
  <div class="container">
    <div class="footer-07-grid">
      <div>
        <div class="logo-07" style="margin-bottom: 16px;">LOGO_PLACEHOLDER</div>
        <p style="color: var(--text-muted); font-size: 14px; max-width: 280px; text-transform: none; font-weight: 400;">Independent corporate finance advisory since 1988.</p>
      </div>
      <div class="footer-links-07">
        <h4>Services</h4>
        <a href="#">M&amp;A</a>
        <a href="#">Capital Markets</a>
        <a href="#">Restructuring</a>
      </div>
      <div class="footer-links-07">
        <h4>Firm</h4>
        <a href="#">About</a>
        <a href="#">Offices</a>
        <a href="#">Careers</a>
      </div>
      <div class="footer-links-07">
        <h4>Insights</h4>
        <a href="#">Reports</a>
        <a href="#">Press</a>
      </div>
    </div>
    <div class="footer-07-bottom">
      <span>&copy; 2026 LOGO_PLACEHOLDER</span>
      <span>Member FINRA / SIPC</span>
    </div>
  </div>
</footer>
 
<script id="core-interactions">
  (function() {
    var isInEditor = !!document.querySelector('[data-gjs-type]') || document.body.classList.contains('gjs-dashed');
    document.addEventListener('submit', function(e) {
      if (e.target.tagName === 'FORM') {
        e.preventDefault();
        if (isInEditor) {
          e.stopImmediatePropagation();
          var existingModal = document.getElementById("preview-mode-modal");
          if (existingModal) existingModal.remove();
          var modalHtml = '<div id="preview-mode-modal" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 999999; display: flex; align-items: center; justify-content: center; background: rgba(13,13,13,0.6); backdrop-filter: blur(6px); opacity: 0; animation: pModalFadeIn 0.3s forwards; font-family: system-ui, -apple-system, sans-serif;"><div style="background: #ffffff; width: 90%; max-width: 400px; padding: 32px; text-align: center; transform: scale(0.95); animation: pModalScaleUp 0.3s forwards; border: 1px solid #0D0D0D;"><h3 style="font-size: 16px; font-weight: 800; color: var(--ink); margin: 0 0 12px; text-transform: uppercase;">Preview Mode Active</h3><p style="font-size: 14px; color: #6E6E6E; margin: 0 0 28px; line-height: 1.5;">Form submissions are disabled in preview mode. Publish your page to accept real submissions.</p><button onclick="document.getElementById(\\'preview-mode-modal\\').remove()" style="width: 100%; background: var(--ink); color: #ffffff; border: none; padding: 14px; font-size: 12px; font-weight: 700; text-transform: uppercase; cursor: pointer;">Got it, close</button></div><style>@keyframes pModalFadeIn { to { opacity: 1; } } @keyframes pModalScaleUp { to { transform: scale(1); } }</style></div>';
          document.body.insertAdjacentHTML("beforeend", modalHtml);
          return;
        }
 
        e.target.setAttribute('novalidate', 'true');
        var isValid = true;
        var inputs = e.target.querySelectorAll('input:not([type="submit"]):not([type="hidden"]):not([type="button"]), textarea, select');
 
        inputs.forEach(function(input) {
          if (!input.dataset.valSetup) {
            input.dataset.valSetup = 'true';
            input.addEventListener('input', function() {
              if (input.value.trim()) {
                input.style.borderColor = 'var(--primary)';
                if (input.nextElementSibling && input.nextElementSibling.classList.contains('val-error')) {
                  input.nextElementSibling.style.display = 'none';
                }
              } else {
                input.style.borderColor = 'var(--secondary)';
                if (input.nextElementSibling && input.nextElementSibling.classList.contains('val-error')) {
                  input.nextElementSibling.style.display = 'block';
                }
              }
            });
          }
 
          if (!input.value.trim() && input.hasAttribute('required')) {
            isValid = false;
            input.style.borderColor = 'var(--secondary)';
 
            if (!input.parentElement.classList.contains('val-wrapper')) {
                var wrapper = document.createElement('div');
                wrapper.className = 'val-wrapper';
                wrapper.style.display = 'flex';
                wrapper.style.flexDirection = 'column';
                wrapper.style.width = '100%';
                input.parentNode.insertBefore(wrapper, input);
                wrapper.appendChild(input);
            }
 
            if (!input.nextElementSibling || !input.nextElementSibling.classList.contains('val-error')) {
              var fieldName = input.getAttribute('placeholder') || input.getAttribute('name') || 'This field';
              var err = document.createElement('span');
              err.className = 'val-error';
              err.style.color = 'var(--secondary)';
              err.style.fontSize = '11px';
              err.style.display = 'block';
              err.style.marginTop = '6px';
              err.style.textTransform = 'uppercase';
              err.textContent = fieldName.replace(/\\*$/, '').trim() + ' is required';
              input.parentNode.insertBefore(err, input.nextSibling);
            } else {
              input.nextElementSibling.style.display = 'block';
            }
          }
        });
 
        if (!isValid) {
          e.preventDefault();
          e.stopImmediatePropagation();
        } else {
          e.preventDefault();
          var btn = e.target.querySelector('button[type="submit"]');
          if (btn) { btn.innerHTML = 'Sending...'; }
          setTimeout(function() {
            e.target.innerHTML = '<div style="padding: 24px 0; border-top: 2px solid var(--ink);"><h3 style="margin: 0 0 10px 0; font-size: 16px; text-transform: uppercase;">Inquiry Received</h3><p style="margin: 0; font-size: 14px; color: #6E6E6E;">A member of our team will respond within one business day.</p></div>';
          }, 1000);
        }
      }
    }, true);
  })();
</script>
`;