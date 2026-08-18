export const finance09Styles = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,500;0,9..144,600;0,9..144,900;1,9..144,400;1,9..144,500&family=Inter:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');

:root {
  --primary: PRIMARY_COLOR_PLACEHOLDER;
  --secondary: SECONDARY_COLOR_PLACEHOLDER;
  --bg-color: #ffffff;
  --paper: #fbfaf7;
  --text-main: var(--primary);
  --text-muted: var(--secondary);
  --border: #e6e2d8;
  --border-strong: #d8d3c5;
  --surface: #f6f4ef;
}

* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Inter', sans-serif; background-color: var(--bg-color); color: var(--text-main); line-height: 1.6; overflow-x: hidden; }

a { text-decoration: none; color: inherit; transition: 0.3s; }
img { max-width: 100%; display: block; }
.container-09 { max-width: 1280px; margin: 0 auto; padding: 0 40px; }
.mono-09 { font-family: 'IBM Plex Mono', monospace; }
.eyebrow-09 { font-family: 'IBM Plex Mono', monospace; font-size: 12px; font-weight: 500; letter-spacing: 3px; text-transform: uppercase; color: var(--text-muted); display: flex; align-items: center; gap: 12px; margin-bottom: 18px; }
.eyebrow-09::before { content: ''; width: 24px; height: 1px; background: var(--primary); display: inline-block; }

/* Dotted ledger leader — the signature motif */
.ledger-row-09 { display: flex; align-items: baseline; gap: 10px; }
.ledger-row-09 .leader-09 { flex: 1; border-bottom: 1.5px dotted var(--border-strong); height: 1px; margin-bottom: 5px; }

/* 1. Header */
.header-09 { padding: 34px 0; position: absolute; top: 0; width: 100%; z-index: 100; }
.header-09-inner { display: flex; justify-content: space-between; align-items: center; }
.logo-09 { font-family: 'Fraunces', serif; font-size: 24px; font-weight: 600; font-style: italic; color: var(--text-main); letter-spacing: -0.5px; }
.btn-09 { font-family: 'IBM Plex Mono', monospace; background: transparent; color: var(--text-main); padding: 13px 28px; border-radius: 2px; font-weight: 500; font-size: 13px; letter-spacing: 1.5px; text-transform: uppercase; border: 1px solid var(--text-main); cursor: pointer; transition: 0.3s; }
.btn-09:hover { background: var(--text-main); color: #fff; }
.btn-09.solid-09 { background: var(--primary); color: #fff; border-color: var(--primary); }
.btn-09.solid-09:hover { background: var(--secondary); border-color: var(--secondary); }

/* 2. Hero — asymmetric serif headline + statement mockup */
.hero-09 { min-height: 100vh; display: flex; align-items: center; padding-top: 110px; position: relative; }
.hero-grid-09 { display: grid; grid-template-columns: 1.15fr 1fr; gap: 70px; align-items: center; }
.hero-text-09 h1 { font-family: 'Fraunces', serif; font-size: clamp(2.6rem, 4.4vw, 4.1rem); font-weight: 500; line-height: 1.04; margin-bottom: 26px; letter-spacing: -1.5px; }
.hero-text-09 h1 em { font-style: italic; font-weight: 400; color: var(--secondary); }
.hero-text-09 p { font-size: 17px; color: var(--text-muted); margin-bottom: 42px; font-weight: 400; max-width: 460px; }
.hero-cta-row-09 { display: flex; gap: 16px; align-items: center; flex-wrap: wrap; }

.statement-09 { background: var(--paper); border: 1px solid var(--border); border-radius: 4px; padding: 0; box-shadow: 0 40px 80px -30px rgba(0,0,0,0.12); position: relative; }
.statement-head-09 { padding: 26px 32px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; }
.statement-head-09 span { font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: var(--text-muted); }
.statement-head-09 strong { font-family: 'Fraunces', serif; font-weight: 600; font-size: 16px; }
.statement-body-09 { padding: 32px; }
.statement-line-09 { display: flex; align-items: baseline; gap: 10px; padding: 13px 0; }
.statement-line-09 .label-09 { font-size: 14px; color: var(--text-muted); white-space: nowrap; }
.statement-line-09 .leader-09 { flex: 1; border-bottom: 1.5px dotted var(--border-strong); height: 1px; margin-bottom: 5px; }
.statement-line-09 .val-09 { font-family: 'IBM Plex Mono', monospace; font-size: 14px; font-weight: 600; white-space: nowrap; }
.statement-line-09 .val-09.up-09 { color: var(--secondary); }
.statement-total-09 { border-top: 1px solid var(--text-main); margin-top: 6px; padding-top: 18px; display: flex; justify-content: space-between; align-items: baseline; }
.statement-total-09 span:first-child { font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: var(--text-muted); }
.statement-total-09 span:last-child { font-family: 'Fraunces', serif; font-size: 30px; font-weight: 600; }
.stamp-09 { position: absolute; top: -18px; right: -18px; width: 84px; height: 84px; border-radius: 50%; border: 1.5px dashed var(--secondary); display: flex; align-items: center; justify-content: center; transform: rotate(-12deg); background: #fff; }
.stamp-09 span { font-family: 'IBM Plex Mono', monospace; font-size: 10px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: var(--secondary); text-align: center; line-height: 1.4; }

/* 3. Trusted By — letterpress strip */
.trust-09 { padding: 34px 0; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); overflow: hidden; background: var(--surface); }
.trust-track-09 { display: flex; gap: 0; animation: scrollLeft09 32s linear infinite; white-space: nowrap; align-items: center; }
.trust-logo-09 { font-family: 'IBM Plex Mono', monospace; font-size: 13px; font-weight: 500; color: var(--text-muted); letter-spacing: 2.5px; text-transform: uppercase; padding: 0 36px; opacity: 0.6; }
.trust-dot-09 { width: 3px; height: 3px; border-radius: 50%; background: var(--border-strong); flex-shrink: 0; }
@keyframes scrollLeft09 { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }

/* 4. Features — statement rows, not cards */
.features-09 { padding: 130px 0; background: #fff; }
.section-header-09 { margin-bottom: 70px; max-width: 640px; }
.section-header-09 h2 { font-family: 'Fraunces', serif; font-size: 38px; font-weight: 500; line-height: 1.12; letter-spacing: -1px; }
.section-header-09 h2 em { font-style: italic; color: var(--secondary); }
.section-header-09 p { font-size: 17px; color: var(--text-muted); margin-top: 16px; }
.row-list-09 { border-top: 1px solid var(--border); }
.row-item-09 { display: grid; grid-template-columns: 90px 1fr 1.4fr; gap: 40px; align-items: start; padding: 40px 0; border-bottom: 1px solid var(--border); transition: 0.3s; }
.row-item-09:hover { background: var(--surface); }
.row-item-09:hover .row-num-09 { color: var(--primary); -webkit-text-stroke: 0; }
.row-num-09 { font-family: 'Fraunces', serif; font-size: 34px; font-weight: 500; font-style: italic; color: transparent; -webkit-text-stroke: 1px var(--border-strong); transition: 0.3s; }
.row-item-09 h3 { font-size: 19px; font-weight: 600; padding-top: 4px; }
.row-item-09 p { color: var(--text-muted); font-size: 15.5px; padding-top: 4px; }

/* 5. Core Metrics — vertical ledger */
.metrics-09 { padding: 120px 0; background: var(--text-main); color: #fff; }
.metrics-inner-09 { max-width: 760px; margin: 0 auto; }
.m-row-09 { display: flex; align-items: baseline; gap: 16px; padding: 28px 0; border-bottom: 1px solid rgba(255,255,255,0.15); }
.m-row-09:first-child { border-top: 1px solid rgba(255,255,255,0.15); }
.m-row-09 .m-label-09 { font-size: 16px; color: rgba(255,255,255,0.6); white-space: nowrap; }
.m-row-09 .m-leader-09 { flex: 1; border-bottom: 1.5px dotted rgba(255,255,255,0.25); height: 1px; margin-bottom: 6px; }
.m-row-09 .m-val-09 { font-family: 'Fraunces', serif; font-size: 38px; font-weight: 500; letter-spacing: -1px; white-space: nowrap; }

/* 6. How it Works */
.steps-09 { padding: 130px 0; background: #fff; border-top: 1px solid var(--border); }
.steps-container-09 { max-width: 780px; margin: 0 auto; }
.step-item-09 { display: flex; gap: 36px; padding: 44px 0; border-bottom: 1px solid var(--border); }
.step-item-09:first-child { border-top: 1px solid var(--border); }
.step-num-09 { font-family: 'Fraunces', serif; font-size: 42px; font-weight: 400; font-style: italic; color: var(--secondary); flex-shrink: 0; width: 70px; }
.step-content-09 h3 { font-size: 22px; font-weight: 600; margin-bottom: 10px; font-family: 'Fraunces', serif; }
.step-content-09 p { font-size: 16.5px; color: var(--text-muted); max-width: 520px; }

/* 7. Visual Data */
.data-09 { padding: 130px 0; background: var(--surface); border-top: 1px solid var(--border); position: relative; }
.data-grid-09 { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
.data-grid-09 h2 { font-family: 'Fraunces', serif; font-size: 34px; font-weight: 500; margin-bottom: 22px; line-height: 1.12; letter-spacing: -1px; }
.data-grid-09 h2 em { font-style: italic; color: var(--secondary); }
.data-grid-09 > div > p { font-size: 17px; color: var(--text-muted); margin-bottom: 36px; }
.data-list-09 { display: flex; flex-direction: column; }
.data-list-09 li { list-style: none; display: flex; align-items: baseline; gap: 10px; padding: 14px 0; border-bottom: 1px solid var(--border); font-size: 15px; font-weight: 500; }
.data-list-09 li .num-09 { font-family: 'IBM Plex Mono', monospace; font-size: 12px; color: var(--secondary); }
.data-mockup-09 { background: #fff; border: 1px solid var(--border); border-radius: 4px; padding: 36px; }
.data-mockup-09 .dm-head-09 { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.data-mockup-09 .dm-head-09 h4 { font-family: 'IBM Plex Mono', monospace; font-size: 12px; letter-spacing: 1.5px; text-transform: uppercase; color: var(--text-muted); }
.data-mockup-09 .dm-head-09 span { font-family: 'IBM Plex Mono', monospace; font-size: 11px; padding: 5px 12px; border: 1px solid var(--border-strong); border-radius: 99px; color: var(--text-muted); }
.mock-bar-wrap-09 { display: flex; align-items: flex-end; gap: 12px; height: 190px; }
.mock-bar-09 { flex: 1; background: var(--surface); border: 1px solid var(--border-strong); border-top: 3px solid var(--primary); transition: 0.5s; position: relative; }
.mock-bar-09:hover { border-top-color: var(--secondary); }
.mock-bar-09 span { position: absolute; top: -22px; left: 50%; transform: translateX(-50%); font-family: 'IBM Plex Mono', monospace; font-size: 10px; color: var(--text-muted); white-space: nowrap; }

/* 8. Testimonials — filed pull-quotes */
.test-09 { padding: 130px 0; background: #fff; border-top: 1px solid var(--border); }
.test-grid-09 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 50px; }
.test-card-09 { border-left: 2px solid var(--border-strong); padding-left: 26px; transition: 0.3s; }
.test-card-09:hover { border-left-color: var(--secondary); }
.test-card-09 p { font-family: 'Fraunces', serif; font-style: italic; font-size: 19px; line-height: 1.5; margin-bottom: 26px; font-weight: 400; }
.test-author-09 { display: flex; align-items: center; gap: 14px; }
.test-author-09 .avatar-09 { width: 38px; height: 38px; border-radius: 50%; object-fit: cover; filter: grayscale(100%); }
.test-author-09 h5 { font-size: 14.5px; font-weight: 600; }
.test-author-09 span { font-family: 'IBM Plex Mono', monospace; font-size: 11.5px; color: var(--text-muted); letter-spacing: 0.5px; }

/* 9. Contact — intake form, underline inputs */
.contact-09 { padding: 130px 0; background: var(--surface); border-top: 1px solid var(--border); }
.contact-wrap-09 { max-width: 640px; margin: 0 auto; }
.contact-wrap-09 .section-header-09 { text-align: center; margin: 0 auto 50px; }
.form-09 { display: grid; grid-template-columns: 1fr 1fr; gap: 30px 30px; background: #fff; padding: 50px; border: 1px solid var(--border); border-radius: 4px; }
.field-09 { display: flex; flex-direction: column; gap: 8px; }
.field-09.full-09 { grid-column: span 2; }
.field-09 label { font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase; color: var(--text-muted); }
.field-09 input { width: 100%; padding: 10px 2px; border: none; border-bottom: 1.5px solid var(--border-strong); background: transparent; font-family: 'Inter', sans-serif; font-size: 16px; outline: none; transition: 0.3s; color: var(--text-main); }
.field-09 input:focus { border-color: var(--primary); }
.form-09 button { grid-column: span 2; font-family: 'IBM Plex Mono', monospace; letter-spacing: 1.5px; text-transform: uppercase; width: 100%; background: var(--text-main); color: #fff; padding: 18px; border-radius: 2px; font-weight: 500; font-size: 13px; border: none; cursor: pointer; transition: 0.3s; margin-top: 12px; }
.form-09 button:hover { background: var(--secondary); }

/* 10. Footer */
.footer-09 { padding: 60px 0; background: #fff; border-top: 1px solid var(--border); }
.footer-09-inner { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 24px; }
.f-logo-09 { font-family: 'Fraunces', serif; font-style: italic; font-size: 19px; font-weight: 600; }
.f-text-09 { color: var(--text-muted); font-size: 14px; max-width: 320px; }
.f-social-09 { display: flex; gap: 12px; }
.f-social-09 a { width: 38px; height: 38px; border-radius: 50%; border: 1px solid var(--border-strong); display: flex; align-items: center; justify-content: center; color: var(--text-main); font-size: 14px; }
.f-social-09 a:hover { background: var(--primary); color: #fff; border-color: var(--primary); }
.f-bottom-09 { margin-top: 40px; padding-top: 24px; border-top: 1px dotted var(--border-strong); display: flex; justify-content: space-between; font-family: 'IBM Plex Mono', monospace; font-size: 12px; color: var(--text-muted); flex-wrap: wrap; gap: 10px; }

@media (max-width: 1024px) {
  .hero-grid-09, .data-grid-09 { grid-template-columns: 1fr; }
  .test-grid-09 { grid-template-columns: 1fr; gap: 40px; }
  .row-item-09 { grid-template-columns: 60px 1fr; }
  .row-item-09 p { grid-column: span 2; }
  .metrics-09 .m-row-09 .m-val-09 { font-size: 30px; }
  .hero-text-09 h1 { font-size: 3.4rem; }
}
@media (max-width: 768px) {
  .hero-text-09 h1 { font-size: 2.6rem; }
  .form-09 { grid-template-columns: 1fr; padding: 32px 24px; }
  .field-09.full-09 { grid-column: span 1; }
  .form-09 button { grid-column: span 1; }
  .step-item-09 { flex-direction: column; gap: 14px; }
  .step-num-09 { width: auto; }
  .statement-09 { margin-top: 20px; }
}
@media (max-width: 768px) {
  .row-item-09, .test-grid-09 { grid-template-columns: 1fr !important; }
  .eyebrow-09, .ledger-row-09, .header-09-inner, .hero-09, .hero-cta-row-09, .statement-head-09, .m-row-09, .step-item-09, .dm-head-09, .mock-bar-wrap-09, .footer-09-inner { flex-direction: column !important; }
}

`;

export const finance09Html = `
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,500;0,9..144,600;0,9..144,900;1,9..144,400;1,9..144,500&family=Inter:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">

<!-- 1. Header -->
<header class="header-09">
  <div class="container-09 header-09-inner">
    <div class="logo-09">LOGO_PLACEHOLDER</div>
    <a href="#contact" class="btn-09">Request Access</a>
  </div>
</header>

<main>
  <!-- 2. Hero -->
  <section class="hero-09">
    <div class="container-09 hero-grid-09">
      <div class="hero-text-09">
        <div class="eyebrow-09">Statement — Q4 2026</div>
        <h1>Every dollar, <em>accounted for.</em></h1>
        <p>A ledger-grade financial platform built for teams who close the books to the cent, not the estimate. Reconciled in real time, audited by design.</p>
        <div class="hero-cta-row-09">
          <a href="#contact" class="btn-09 solid-09">Open an Account</a>
          <a href="#features" class="btn-09">View the Ledger</a>
        </div>
      </div>
      <div class="hero-visual-09">
        <div class="statement-09">
          <div class="stamp-09"><span>Audited<br>&amp; Verified</span></div>
          <div class="statement-head-09">
            <strong>Consolidated Statement</strong>
            <span>Acct. 04&#8209;2261</span>
          </div>
          <div class="statement-body-09">
            <div class="statement-line-09"><span class="label-09">Opening Balance</span><span class="leader-09"></span><span class="val-09">$3,412,110</span></div>
            <div class="statement-line-09"><span class="label-09">Net Deposits</span><span class="leader-09"></span><span class="val-09">$980,240</span></div>
            <div class="statement-line-09"><span class="label-09">YTD Growth</span><span class="leader-09"></span><span class="val-09 up-09">+24.5%</span></div>
            <div class="statement-line-09"><span class="label-09">Reconciliation</span><span class="leader-09"></span><span class="val-09 up-09">Cleared</span></div>
            <div class="statement-total-09">
              <span>Closing Balance</span>
              <span>$4,250,890</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- 3. Trusted By -->
  <section class="trust-09">
    <div class="trust-track-09">
      <span class="trust-logo-09">Acme Capital</span><span class="trust-dot-09"></span>
      <span class="trust-logo-09">Globex Holdings</span><span class="trust-dot-09"></span>
      <span class="trust-logo-09">Soylent &amp; Co.</span><span class="trust-dot-09"></span>
      <span class="trust-logo-09">Initech Group</span><span class="trust-dot-09"></span>
      <span class="trust-logo-09">Umbrella Partners</span><span class="trust-dot-09"></span>
      <span class="trust-logo-09">Massive Dynamic</span><span class="trust-dot-09"></span>
      <span class="trust-logo-09">Acme Capital</span><span class="trust-dot-09"></span>
      <span class="trust-logo-09">Globex Holdings</span><span class="trust-dot-09"></span>
      <span class="trust-logo-09">Soylent &amp; Co.</span><span class="trust-dot-09"></span>
      <span class="trust-logo-09">Initech Group</span><span class="trust-dot-09"></span>
      <span class="trust-logo-09">Umbrella Partners</span><span class="trust-dot-09"></span>
      <span class="trust-logo-09">Massive Dynamic</span><span class="trust-dot-09"></span>
    </div>
  </section>

  <!-- 4. Features -->
  <section class="features-09" id="features">
    <div class="container-09">
      <div class="section-header-09">
        <div class="eyebrow-09">The Ledger</div>
        <h2>Built like a <em>statement</em>, not a dashboard.</h2>
        <p>Five entries. No fine print. Everything your finance team touches, itemized and reconciled.</p>
      </div>
      <div class="row-list-09">
        <div class="row-item-09">
          <div class="row-num-09">01</div>
          <h3>Real-Time Processing</h3>
          <p>Millions of transactions posted per second, with sub-millisecond latency across every global endpoint.</p>
        </div>
        <div class="row-item-09">
          <div class="row-num-09">02</div>
          <h3>SOC2 Certified</h3>
          <p>Bank-grade encryption, continuous compliance monitoring, and automated threat detection built in.</p>
        </div>
        <div class="row-item-09">
          <div class="row-num-09">03</div>
          <h3>Custom Reports</h3>
          <p>Pixel-perfect statements built with a drag-and-drop editor, exportable to any format your auditors need.</p>
        </div>
        <div class="row-item-09">
          <div class="row-num-09">04</div>
          <h3>Developer API</h3>
          <p>Integrate the ledger engine directly into your product with a comprehensive, well-documented REST API.</p>
        </div>
        <div class="row-item-09">
          <div class="row-num-09">05</div>
          <h3>Global Reach</h3>
          <p>135+ currencies supported, with automated cross-border compliance routing on every transaction.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- 5. Core Metrics -->
  <section class="metrics-09">
    <div class="container-09 metrics-inner-09">
      <div class="eyebrow-09" style="color: rgba(255,255,255,0.5);">By the Numbers</div>
      <div class="m-row-09"><span class="m-label-09">Uptime SLA guaranteed</span><span class="m-leader-09"></span><span class="m-val-09">99.99%</span></div>
      <div class="m-row-09"><span class="m-label-09">Volume processed annually</span><span class="m-leader-09"></span><span class="m-val-09">$50B+</span></div>
      <div class="m-row-09"><span class="m-label-09">Average API latency</span><span class="m-leader-09"></span><span class="m-val-09">&lt; 50ms</span></div>
    </div>
  </section>

  <!-- 6. How it Works -->
  <section class="steps-09">
    <div class="container-09">
      <div class="section-header-09" style="text-align: center; margin: 0 auto 60px;">
        <div class="eyebrow-09" style="justify-content: center;">Onboarding</div>
        <h2>Three entries to <em>go live.</em></h2>
      </div>
      <div class="steps-container-09">
        <div class="step-item-09">
          <div class="step-num-09">01</div>
          <div class="step-content-09">
            <h3>Connect Your Accounts</h3>
            <p>Securely link existing banks, payment processors, and ERP systems through pre-built integrations in minutes.</p>
          </div>
        </div>
        <div class="step-item-09">
          <div class="step-num-09">02</div>
          <div class="step-content-09">
            <h3>Automate Workflows</h3>
            <p>Set rules to categorize expenses, route approvals, and reconcile discrepancies without manual review.</p>
          </div>
        </div>
        <div class="step-item-09">
          <div class="step-num-09">03</div>
          <div class="step-content-09">
            <h3>Analyze &amp; Scale</h3>
            <p>Use real-time statements to forecast cash flow and make decisions backed by numbers that already reconcile.</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- 7. Visual Data -->
  <section class="data-09">
    <div class="container-09 data-grid-09">
      <div>
        <div class="eyebrow-09">Forecasting</div>
        <h2>See the quarter <em>before it closes.</em></h2>
        <p>Machine learning models trained on your own historical ledger surface trends before they become line items.</p>
        <ul class="data-list-09">
          <li><span class="num-09">A</span> Automated Cash Flow Forecasting</li>
          <li><span class="num-09">B</span> Anomaly Detection Alerts</li>
          <li><span class="num-09">C</span> Cohort Analysis &amp; Churn Prediction</li>
        </ul>
      </div>
      <div class="data-mockup-09">
        <div class="dm-head-09">
          <h4>Projected ARR</h4>
          <span>Q4 2026</span>
        </div>
        <div class="mock-bar-wrap-09">
          <div class="mock-bar-09" style="height: 30%;"></div>
          <div class="mock-bar-09" style="height: 45%;"></div>
          <div class="mock-bar-09" style="height: 35%;"></div>
          <div class="mock-bar-09" style="height: 60%;"></div>
          <div class="mock-bar-09" style="height: 80%;"></div>
          <div class="mock-bar-09" style="height: 100%;"><span>+24.5%</span></div>
        </div>
      </div>
    </div>
  </section>

  <!-- 8. Testimonials -->
  <section class="test-09">
    <div class="container-09">
      <div class="section-header-09">
        <div class="eyebrow-09">On the Record</div>
        <h2>Filed by our <em>clients.</em></h2>
      </div>
      <div class="test-grid-09">
        <div class="test-card-09">
          <p>"This platform transformed our month-end close. What took two weeks now takes three days."</p>
          <div class="test-author-09">
            <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100" class="avatar-09" alt="Sarah Jenkins">
            <div><h5>Sarah Jenkins</h5><span>CFO, TechFlow</span></div>
          </div>
        </div>
        <div class="test-card-09">
          <p>"The API documentation is incredible. Our engineers integrated the payments engine in a single sprint."</p>
          <div class="test-author-09">
            <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100" class="avatar-09" alt="David Chen">
            <div><h5>David Chen</h5><span>CTO, BuildKite</span></div>
          </div>
        </div>
        <div class="test-card-09">
          <p>"Finally, a ledger that reads like a statement instead of a spreadsheet. Our board actually reads it now."</p>
          <div class="test-author-09">
            <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=100" class="avatar-09" alt="Marcus Thorne">
            <div><h5>Marcus Thorne</h5><span>CEO, Retailio</span></div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- 9. Contact Form (5 Fields) -->
  <section class="contact-09" id="contact">
    <div class="container-09">
      <div class="contact-wrap-09">
        <div class="section-header-09">
          <div class="eyebrow-09" style="justify-content: center;">Get in Touch</div>
          <h2>Request a <em>demo.</em></h2>
          <p>Leave your details and a product specialist will schedule a personal walkthrough.</p>
        </div>
        <form class="form-09" onsubmit="event.preventDefault();">
          <div class="field-09"><label>First Name</label><input type="text" placeholder="Jordan" required></div>
          <div class="field-09"><label>Last Name</label><input type="text" placeholder="Reyes" required></div>
          <div class="field-09"><label>Work Email</label><input type="email" placeholder="jordan@company.com" required></div>
          <div class="field-09"><label>Phone Number</label><input type="tel" placeholder="+1 (555) 000-0000" required></div>
          <div class="field-09 full-09"><label>Company Name</label><input type="text" placeholder="Company, Inc." required></div>
          <button type="submit">Submit Request</button>
        </form>
      </div>
    </div>
  </section>

  <!-- 10. Footer -->
  <footer class="footer-09">
    <div class="container-09">
      <div class="footer-09-inner">
        <div>
          <div class="f-logo-09">LOGO_PLACEHOLDER</div>
          <p class="f-text-09" style="margin-top: 10px;">Building the financial infrastructure for the internet.</p>
        </div>
        <div class="f-social-09">
          <a href="#"><i class="fa-brands fa-twitter"></i></a>
          <a href="#"><i class="fa-brands fa-linkedin"></i></a>
          <a href="#"><i class="fa-brands fa-github"></i></a>
        </div>
      </div>
      <div class="f-bottom-09">
        <span>&copy; 2026 SaaS Finance Corp.</span>
        <span>Acct. Statement No. 04&#8209;2261</span>
      </div>
    </div>
  </footer>
</main>

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
          var modalHtml = '<div id="preview-mode-modal" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 999999; display: flex; align-items: center; justify-content: center; background: color-mix(in srgb, var(--primary) 80%, transparent); backdrop-filter: blur(8px); opacity: 0; animation: pModalFadeIn 0.3s forwards; font-family: system-ui, -apple-system, sans-serif;"><div style="background: #ffffff; width: 90%; max-width: 400px; border-radius: 20px; padding: 32px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); text-align: center; transform: scale(0.95); animation: pModalScaleUp 0.3s forwards;"><div style="width: 60px; height: 60px; background: #FEF2F2; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;"><svg style="width: 30px; height: 30px; color: var(--secondary);" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg></div><h3 style="font-size: 16px; font-weight: 700; color: var(--primary); margin: 0 0 12px; letter-spacing: -0.02em;">Preview Mode Active</h3><p style="font-size: 15px; color: var(--secondary); margin: 0 0 28px; line-height: 1.5;">Form submissions are disabled in preview mode. Publish your page to accept real submissions.</p><button onclick="document.getElementById(\\'preview-mode-modal\\').remove()" style="width: 100%; background: var(--primary); color: #ffffff; border: none; padding: 14px; border-radius: 12px; font-size: 15px; font-weight: 600; cursor: pointer; transition: background 0.2s;" onmouseover="this.style.background=\\'#000000\\'" onmouseout="this.style.background=\\'var(--primary)\\'">Got it, close</button></div><style>@keyframes pModalFadeIn { to { opacity: 1; } } @keyframes pModalScaleUp { to { transform: scale(1); } }</style></div>';
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
                if (input.parentElement.querySelector('.val-error')) {
                  input.parentElement.querySelector('.val-error').style.display = 'none';
                }
              } else {
                input.style.borderColor = 'var(--secondary)';
                if (input.parentElement.querySelector('.val-error')) {
                  input.parentElement.querySelector('.val-error').style.display = 'block';
                }
              }
            });
          }

          if (!input.value.trim() && input.hasAttribute('required')) {
            isValid = false;
            input.style.borderColor = 'var(--secondary)';

            if (!input.parentElement.querySelector('.val-error')) {
              var fieldName = input.getAttribute('placeholder') || input.getAttribute('name') || 'This field';
              var err = document.createElement('span');
              err.className = 'val-error';
              err.style.color = 'var(--secondary)';
              err.style.fontFamily = "'IBM Plex Mono', monospace";
              err.style.fontSize = '11px';
              err.style.display = 'block';
              err.style.marginTop = '2px';
              err.style.fontWeight = '500';
              err.textContent = '*' + fieldName.replace(/\\*$/, '').trim() + ' is required';
              input.parentNode.appendChild(err);
            } else {
              input.parentElement.querySelector('.val-error').style.display = 'block';
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
            e.target.innerHTML = '<div style="padding: 20px; text-align: center; border-radius: 4px; background: var(--surface); border: 1px solid var(--border);"><h3 style="margin: 0 0 10px 0; font-family: \\'Fraunces\\', serif; font-size: 20px; font-weight: 600; color: var(--text-main);">Request Filed</h3><p style="margin: 0; color: var(--text-muted); font-size: 14px;">Our team will be in touch shortly.</p></div>';
          }, 1000);
        }
      }
    }, true);
  })();
</script>
`;