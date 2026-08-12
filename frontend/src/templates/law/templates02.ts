// Auto-generated ULTRA-DYNAMIC template
// Generated: 2026-06-12T12:12:36.594Z
// ════════════════════════════════════════════════════════════════════════════
// Converted directly in the browser using Frontend JSZip Extraction
// ════════════════════════════════════════════════════════════════════════════

export const law02Styles = `
:root{
  --primary:PRIMARY_COLOR_PLACEHOLDER;
  --secondary:SECONDARY_COLOR_PLACEHOLDER;
  --s-rgb:SECONDARY_RGB_PLACEHOLDER;
  --text-main:#2a2424;
  --text-muted:#6c6363;
  --bg-light:#faf7f2;
  --bg-dark:#1a0e10;
  --white:#ffffff;
  --border:#ebe3d4;
}
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
html body{font-family:'Manrope',sans-serif;color:var(--text-main);background:var(--white);line-height:1.65;overflow-x:hidden}
img{max-width:100%;display:block}
a{color:inherit;text-decoration:none}
.container{max-width:1240px;margin:0 auto;padding:0 24px}
html h1, html h2, html h3{font-family:'Cormorant Garamond',serif;font-weight:600;color:var(--primary);line-height:1.1}
html h1{font-size:clamp(2.4rem,5vw,4rem);font-weight:700}
html h2{font-size:clamp(1.9rem,3.4vw,2.8rem)}
h1 em{font-style:italic;color:var(--secondary);font-weight:500}
.kicker{display:inline-block;font-family:'Manrope',sans-serif;font-size:.75rem;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:var(--secondary);margin-bottom:14px;position:relative;padding-left:30px}
.kicker::before{content:"";position:absolute;left:0;top:50%;width:20px;height:1px;background:var(--secondary)}
.kicker.dark{color:var(--primary)}
.kicker.dark::before{background:var(--primary)}
.grad-text{background:linear-gradient(120deg,var(--secondary),#f0d28a);-webkit-background-clip:text;background-clip:text;color:transparent;font-style:italic}
.btn{display:inline-flex;align-items:center;gap:10px;padding:15px 30px;font-weight:600;font-size:.95rem;border:none;cursor:pointer;font-family:inherit;transition:.3s;border-radius:0}
.btn-primary{background:var(--primary);color:var(--white)}
.btn-primary:hover{background:var(--bg-dark)}
.btn-dark{background:var(--bg-dark);color:var(--primary)}
.btn-dark:hover{background:var(--primary);color:var(--white)}

/* TOP HERO with FORM TOP-SIDE */
.top-hero{position:relative;color:var(--white);padding:30px 0 100px;overflow:hidden;min-height:680px}
.bg-image{position:absolute;inset:0;filter:saturate(.9)}
.bg-overlay{position:absolute;inset:0;background:linear-gradient(135deg,rgba(26,14,16,.92) 0%,rgba(PRIMARY_RGB_PLACEHOLDER,.85) 55%,rgba(26,14,16,.7) 100%);pointer-events:none}
.top-inner{position:relative;z-index:2}
.brand-line{display:flex;justify-content:space-between;align-items:center;padding-bottom:30px;border-bottom:1px solid rgba(var(--s-rgb),.25);flex-wrap:wrap;gap:14px}
.brand{display:flex;align-items:center;gap:12px}
.brand i{font-size:1.9rem;color:var(--secondary)}
.brand-name{font-family:'Cormorant Garamond',serif;font-size:1.4rem;font-weight:700;color:var(--white);display:block}
.brand small{font-size:.75rem;color:rgba(255,255,255,.65);letter-spacing:.08em}
.top-contact{display:flex;align-items:center;gap:22px;flex-wrap:wrap;font-size:.92rem}
.top-contact a{color:var(--white);display:inline-flex;gap:8px;align-items:center}
.top-contact i{color:var(--secondary)}
.award{background:rgba(var(--s-rgb),.18);border:1px solid rgba(var(--s-rgb),.4);color:var(--secondary);padding:7px 14px;font-size:.8rem;letter-spacing:.06em}

.hero-row{display:grid;grid-template-columns:1.2fr 420px;gap:60px;margin-top:60px;align-items:start}
.hero-copy h1{color:var(--white);margin:14px 0 22px;animation:fadeUp .9s ease both}
.hero-copy .lead{color:rgba(255,255,255,.82);font-size:1.1rem;max-width:560px;animation:fadeUp 1s ease both}
.trust-row{display:flex;gap:30px;margin-top:36px;flex-wrap:wrap;animation:fadeUp 1.1s ease both}
.trust-row>div{border-left:2px solid var(--secondary);padding-left:16px}
.trust-row strong{display:block;font-family:'Cormorant Garamond',serif;font-size:1.8rem;color:var(--secondary);font-weight:700}
.trust-row span{font-size:.78rem;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.65)}
@keyframes fadeUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}

/* FORM CARD */
.hero-form-card{background:var(--white);color:var(--text-main);padding:34px;box-shadow:0 30px 70px rgba(0,0,0,.35);position:relative;border-top:5px solid var(--secondary);animation:fadeUp 1.2s ease both}
.ribbon{position:absolute;top:-15px;left:30px;background:var(--primary);color:var(--white);padding:6px 16px;font-size:.72rem;letter-spacing:.2em;font-weight:700}
.form-head h3{font-size:1.6rem;color:var(--primary);margin:6px 0 4px}
.form-head p{color:var(--text-muted);font-size:.92rem;margin-bottom:20px}
.hero-form-card form{display:grid;gap:14px}
.hero-form-card label{display:grid;gap:6px;font-size:.78rem;font-weight:600;color:var(--text-muted);letter-spacing:.06em;text-transform:uppercase}
.hero-form-card input{padding:13px 16px;border:1.5px solid var(--border);background:var(--bg-light);font-family:inherit;font-size:1rem;color:var(--text-main);transition:.25s}
.hero-form-card input:focus{outline:none;border-color:var(--secondary);background:var(--white);box-shadow:0 0 0 4px rgba(var(--s-rgb),.18)}
.hero-form-card .btn{width:100%;justify-content:center;margin-top:4px}
.form-trust{text-align:center;font-size:.78rem;color:var(--text-muted);margin-top:8px}
.form-trust i{color:var(--secondary);margin-right:5px}

/* BADGE / KICKERS */
.badge{display:inline-flex;align-items:center;gap:8px;font-family:'Manrope',sans-serif;font-size:.75rem;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:var(--secondary);margin-bottom:14px}
.badge svg{width:20px;height:20px}

/* MARQUEE */
.marquee-section{padding:40px 0 50px;background:var(--bg-light);border-bottom:1px solid var(--border)}
.muted-center{text-align:center;color:var(--text-muted);font-size:.85rem;margin-bottom:20px;letter-spacing:.1em;text-transform:uppercase}
.marquee{overflow:hidden;mask-image:linear-gradient(90deg,transparent,#000 10%,#000 90%,transparent)}
.track{display:flex;gap:60px;animation:scroll 30s linear infinite;white-space:nowrap}
.track span{font-family:'Cormorant Garamond',serif;font-size:1.6rem;color:var(--primary);opacity:.55;letter-spacing:.1em;font-weight:600}
@keyframes scroll{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}

/* SECTION */
.section{padding:100px 0}
.head-row{display:grid;grid-template-columns:1fr 1fr;gap:50px;margin-bottom:60px;align-items:end}
.head-row h2{margin-top:6px}
.head-desc{color:var(--text-muted);font-size:1.02rem}

/* PRACTICE */
.practice-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:0;border-top:1px solid var(--border);border-left:1px solid var(--border)}
.practice-card{padding:40px 32px;border-right:1px solid var(--border);border-bottom:1px solid var(--border);transition:.4s;position:relative;background:var(--white)}
.practice-card:hover{background:var(--primary);color:var(--white)}
.practice-card:hover h3,.practice-card:hover .pc-num{color:var(--secondary)}
.practice-card:hover p{color:rgba(255,255,255,.8)}
.pc-num{font-family:'Cormorant Garamond',serif;font-size:1.1rem;color:var(--secondary);font-weight:700;letter-spacing:.1em;margin-bottom:14px}
.practice-card h3{font-size:1.65rem;margin-bottom:10px;color:var(--primary)}
.practice-card p{color:var(--text-muted);font-size:.95rem;margin-bottom:16px}
.practice-card a{font-weight:600;color:var(--primary);font-size:.85rem;letter-spacing:.08em;text-transform:uppercase;display:inline-flex;gap:8px;align-items:center}
.practice-card:hover a{color:var(--secondary)}

/* SPLIT */
.split-section{display:grid;grid-template-columns:1fr 1fr;align-items:stretch;background:var(--bg-light)}
.split-image{position:relative;min-height:520px;overflow:hidden}
.split-image img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.split-text{padding:90px 70px;display:flex;flex-direction:column;justify-content:center}
.split-text h2{font-style:italic;margin:8px 0 18px;color:var(--primary)}
.split-text p{color:var(--text-muted);margin-bottom:14px;font-size:1.02rem;max-width:520px}
.signature{display:flex;align-items:center;gap:14px;margin-top:24px;padding-top:24px;border-top:1px solid var(--border)}
.signature img{width:56px;height:56px;border-radius:50%;object-fit:cover}
.signature strong{display:block;color:var(--primary);font-family:'Cormorant Garamond',serif;font-size:1.2rem;font-weight:700}
.signature span{color:var(--text-muted);font-size:.85rem}

/* BAND */
.band{background:var(--bg-dark);color:var(--white);padding:60px 0}
.band-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:30px;text-align:center}
.band h3{color:var(--primary);font-size:3rem}
.band p{color:rgba(255,255,255,.65);font-size:.85rem;letter-spacing:.1em;text-transform:uppercase;margin-top:4px}

/* REVIEWS */
.reviews{background:var(--bg-light)}
.slider{position:relative;overflow:hidden;background:var(--white);padding:20px 60px 50px;border:1px solid var(--border)}
.rev-slide{padding:30px 20px}
.rev-meta{display:flex;justify-content:space-between;align-items:center;margin-bottom:18px;border-bottom:1px solid var(--border);padding-bottom:14px}
.stars{color:var(--secondary);font-size:1.15rem;letter-spacing:3px}
.rev-meta span{color:var(--text-muted);font-size:.82rem;letter-spacing:.08em;text-transform:uppercase}
.rev-slide p{font-family:'Cormorant Garamond',serif;font-style:italic;font-size:1.45rem;color:var(--text-main);line-height:1.5;margin-bottom:24px}
.rev-author{display:flex;align-items:center;gap:14px}
.rev-author img{width:54px;height:54px;border-radius:50%;object-fit:cover;border:2px solid var(--secondary)}
.rev-author strong{display:block;color:var(--primary)}
.rev-author span{color:var(--text-muted);font-size:.85rem}
.slider-btn{position:absolute!important;top:50%!important;margin-top:-21px!important;background:var(--primary)!important;color:var(--secondary)!important;border:none!important;width:42px!important;height:42px!important;cursor:pointer!important;transition:.3s!important;z-index:10;display:flex;align-items:center;justify-content:center}
.slider-btn:hover{background:var(--bg-dark)!important;color:var(--primary)!important}
.slider-btn.prev{left:10px!important;right:auto!important}
.slider-btn.next{right:10px!important;left:auto!important}
.swiper-pagination-bullet{width:30px!important;height:3px!important;border-radius:0!important;background:var(--border)!important;opacity:1!important;margin:0 4px!important}
.swiper-pagination-bullet-active{background:var(--primary)!important}

/* TEAM */
.team-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:30px}
.team-card{text-align:center}
.t-img{aspect-ratio:4/4.5;overflow:hidden;margin-bottom:18px;filter:grayscale(.4);transition:.4s;background:var(--bg-light)}
.t-img img{width:100%;height:100%;object-fit:cover;transition:.5s}
.team-card:hover .t-img{filter:none}
.team-card:hover .t-img img{transform:scale(1.05)}
.team-card h3{font-size:1.6rem;margin-bottom:4px}
.team-card span{color:var(--secondary);font-size:.78rem;letter-spacing:.15em;text-transform:uppercase;font-weight:700;font-family:'Manrope',sans-serif}
.team-card p{color:var(--text-muted);font-size:.92rem;margin-top:8px}

/* PROCESS / FAQ */
.pf-section{background:var(--bg-light)}
.pf-grid{display:grid;grid-template-columns:1fr 1fr;gap:70px}
.timeline{list-style:none;margin-top:24px;display:grid;gap:22px;position:relative}
.timeline li{display:flex;gap:18px;align-items:flex-start}
.timeline span{flex-shrink:0;width:42px;height:42px;background:var(--primary);color:var(--secondary);font-weight:700;display:grid;place-items:center;font-family:'Cormorant Garamond',serif;font-size:1.2rem}
.timeline strong{display:block;color:var(--primary);font-family:'Cormorant Garamond',serif;font-size:1.3rem;font-weight:700;margin-bottom:2px}
.timeline p{color:var(--text-muted);font-size:.95rem}
.faq-list{margin-top:24px;display:grid;gap:0;border-top:1px solid var(--border)}
.faq-list details{padding:18px 6px;border-bottom:1px solid var(--border);cursor:pointer}
.faq-list summary{font-weight:600;color:var(--primary);list-style:none;display:flex;justify-content:space-between;align-items:center;font-size:1.05rem;font-family:'Cormorant Garamond',serif;font-size:1.25rem}
.faq-list summary::after{content:"+";color:var(--secondary);font-size:1.5rem;transition:.3s}
.faq-list details[open] summary::after{transform:rotate(45deg)}
.faq-list details p{color:var(--text-muted);margin-top:10px;font-size:.95rem}

/* CTA */
.cta{background-color:var(--primary);background-image:linear-gradient(135deg,transparent,rgba(0,0,0,0.4));color:var(--white);padding:90px 0}
.cta-inner{display:grid;grid-template-columns:1.4fr auto;gap:40px;align-items:center}
.cta-inner .kicker{color:var(--secondary)}
.cta-inner .kicker::before{background:var(--secondary)}
.cta-inner h2{color:var(--white);font-style:italic;margin:6px 0 8px}
.cta-inner p{color:rgba(255,255,255,.8)}

/* FOOTER */
footer{background:var(--bg-dark);color:rgba(255,255,255,.7);padding:60px 0 0}
.footer-grid{display:grid;grid-template-columns:2fr 1fr 1fr;gap:40px;padding-bottom:40px}
footer h4{color:var(--white);margin-bottom:14px;font-family:'Cormorant Garamond',serif;font-size:1.3rem}
footer .brand-name{color:var(--white)}
footer p{margin-bottom:8px;font-size:.92rem}
footer i{color:var(--primary);margin-right:8px}

.socials{display:flex;gap:10px}
.socials a{width:40px;height:40px;background:rgba(255,255,255,.08);display:grid;place-items:center;color:var(--white);transition:.3s}
.socials a:hover{background:var(--secondary);color:var(--primary)}
.socials i{margin:0;color:inherit}
.copyright{border-top:1px solid rgba(255,255,255,.1);padding:20px 24px;text-align:center;font-size:.82rem;color:rgba(255,255,255,.45)}

/* FLOAT */
.float-cta{position:fixed;bottom:24px;right:24px;width:58px;height:58px;background:var(--primary);color:var(--secondary);border-radius:50%;display:grid;place-items:center;font-size:1.3rem;box-shadow:0 15px 40px rgba(PRIMARY_RGB_PLACEHOLDER,.5);z-index:99;animation:pulse 2s infinite}
@keyframes pulse{0%,100%{box-shadow:0 15px 40px rgba(PRIMARY_RGB_PLACEHOLDER,.5)}50%{box-shadow:0 15px 60px rgba(PRIMARY_RGB_PLACEHOLDER,.8)}}

/* REVEAL */
.reveal{opacity:0;transform:translateY(30px);transition:.8s ease}
.reveal.in{opacity:1;transform:none}

/* RESPONSIVE */
@media(max-width:960px){
  .hero-row,.head-row,.practice-grid,.split-section,.band-grid,.team-grid,.pf-grid,.cta-inner,.footer-grid{grid-template-columns:1fr}
  .practice-grid{grid-template-columns:1fr 1fr}
  .band-grid,.team-grid{grid-template-columns:1fr 1fr}
  .split-text{padding:60px 30px}
  .split-image{min-height:340px}
  .brand-line{justify-content:center;text-align:center}
}
@media(max-width:600px){
  .practice-grid,.band-grid,.team-grid{grid-template-columns:1fr}
  .section{padding:60px 0}
  .top-hero{padding:24px 0 60px}
  .slider{padding:10px 12px}
  .slider-btn{display:none}
}
/* Tabs Section */
.tabs-section { padding: 6rem 0; background: linear-gradient(135deg, rgba(var(--secondary-rgb), 0.05) 0%, rgba(var(--primary-rgb), 0.02) 100%); position: relative; overflow: hidden; }
.tabs-header { text-align: center; max-width: 750px; margin: 0 auto 4rem; }
.tabs-header h2 { font-size: 2.8rem; margin-bottom: 1rem; }
.tabs-header p { color: var(--text-muted); font-size: 1.1rem; margin-top: 1rem; }

.tabs-container { display: grid; grid-template-columns: 1fr 1.5fr; gap: 3rem; align-items: start; max-width: 1000px; margin: 0 auto; z-index: 2; position: relative; }
.tab-list { display: flex; flex-wrap: wrap; flex-direction: column; gap: 1rem; }
.tab-item { background: #fff; padding: 1.25rem 1.5rem; border-radius: 8px; display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; font-weight: 600; cursor: pointer; transition: 0.3s; box-shadow: 0 4px 10px rgba(0,0,0,0.02); }
.tab-item:hover { background: rgba(0,0,0,0.02); }
.tab-icon { width: 28px; height: 28px; border-radius: 50%; border: 1px solid rgba(0,0,0,0.1); display: inline-flex; flex-wrap: wrap; justify-content: center; align-items: center; transition: 0.3s; color: inherit; }
.tab-content-box { display: none; background: #fff; padding: 2.5rem; border-radius: 16px; box-shadow: 0 10px 40px rgba(0,0,0,0.05); }

/* Published Mode (JS Tabs) */
body.js-enabled .tab-content-box.active { display: block; animation: tabFadeIn 0.4s ease-out; }
body.js-enabled .tab-item.active, .tab-item.active { background: var(--primary) !important; color: #ffffff !important; }
body.js-enabled .tab-item.active .tab-icon, .tab-item.active .tab-icon { border-color: transparent; background: rgba(255,255,255,0.2); transform: rotate(90deg); color: #ffffff !important; }

/* Fallback if active class is missing */
body.js-enabled .tab-content-wrapper:not(:has(.tab-content-box.active)) .tab-content-box:first-child { display: block; animation: tabFadeIn 0.4s ease-out; }
body.js-enabled .tab-list:not(:has(.tab-item.active)) .tab-item:first-child { background: var(--primary); color: #fff; }
body.js-enabled .tab-list:not(:has(.tab-item.active)) .tab-item:first-child .tab-icon { border-color: transparent; background: rgba(255,255,255,0.2); transform: rotate(90deg); }

/* Editor Mode Horizontal Scroll (When JS is disabled in GrapesJS) */
body:not(.js-enabled) .tab-content-wrapper {
  display: flex!important; flex-wrap: wrap;
  overflow-x: auto !important;
  gap: 2rem;
  padding-bottom: 1rem;
  scroll-snap-type: x mandatory;
}
body:not(.js-enabled) .tab-content-box {
  display: block !important;
  flex: 0 0 100% !important;
  min-width: 100%;
  scroll-snap-align: center;
}
body:not(.js-enabled) .tab-content-wrapper::-webkit-scrollbar { height: 8px; }
body:not(.js-enabled) .tab-content-wrapper::-webkit-scrollbar-thumb { background: var(--primary); border-radius: 4px; }

@keyframes tabFadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

.tab-content-box h3 { font-size: 1.8rem; margin-bottom: 1rem; }
.tab-content-box p { color: var(--text-muted); margin-bottom: 1.5rem; }
.tab-content-box img { width: 100%; height: 240px; object-fit: cover; border-radius: 8px; margin-bottom: 1.5rem; }
.link-primary { color: var(--primary); font-weight: 600; display: inline-flex; flex-wrap: wrap; align-items: center; gap: 5px; }
.link-primary:hover { gap: 8px; }

.tabs-action { text-align: center; margin-top: 3rem; position: relative; z-index: 2; }

`;

export const law02Html = `
<!-- Swiper Assets for Published Page -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" />
<script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Manrope:wght@300;400;500;600;700;800&display=swap">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

<!-- TOP STRIP WITH FORM (FORM ON TOP / SIDE) -->
<section class="top-hero">
  <div class="bg-image" style="background-image: url('/assets/templates/LawFirm/templates02/hero.jpg'); background-position: center; background-size: cover; background-repeat: no-repeat;"></div>
  <div class="bg-overlay"></div>

  <div class="container top-inner">
    <div class="brand-line">
      <div class="brand">
        <i class="fa-solid fa-scale-balanced"></i>
        <div><span data-editable="true" class="brand-name">Verma Law Chambers</span><small>Est. 2003 · Advocates &amp; Solicitors</small></div>
      </div>
      <div class="top-contact">
        <a data-editable="true" href="tel:+918888888888"><i class="fa-solid fa-phone-volume"></i> +91 88888 88888</a>
        <span data-editable="true" class="award"><i class="fa-solid fa-award"></i> Top Rated Law Firm 2024</span>
      </div>
    </div>

    <div class="hero-row">
      <div class="hero-copy">
        <span data-editable="true" class="kicker">Award-Winning Legal Excellence</span>
        <h1 data-editable="true">When the law gets <em>complicated</em>,<br/>we make it <span data-editable="true" class="grad-text">simple</span>.</h1>
        <p data-editable="true" class="lead">A boutique Indian law firm built on integrity, intellect &amp; impact. 4,200+ cases. 96% success. Trusted by founders, families &amp; Fortune 500s alike.</p>
        <div class="trust-row">
          <div><strong data-editable="true">20+</strong><span data-editable="true">Years</span></div>
          <div><strong data-editable="true">4.9★</strong><span data-editable="true">Google Rating</span></div>
          <div><strong data-editable="true">4,200+</strong><span data-editable="true">Cases</span></div>
          <div><strong data-editable="true">96%</strong><span data-editable="true">Win Rate</span></div>
        </div>
      </div>

      <!-- FORM ON THE SIDE (TOP) -->
      <aside class="hero-form-card" id="contact">
        <div class="form-head">
          <span data-editable="true" class="ribbon">FREE</span>
          <h3 data-editable="true">Talk to a Senior Advocate</h3>
          <p data-editable="true">Get expert legal advice in 30 minutes. 100% confidential.</p>
        </div>
        <form onsubmit="event.preventDefault(); alert('Thank you! Our team will call you within 30 minutes.'); this.reset();">
          <label>Full Name<input type="text" required placeholder="e.g. Ananya Sharma"/></label>
          <label>Email<input type="email" required placeholder="you@email.com"/></label>
          <label>Phone<input type="tel" required placeholder="+91 9XXXXXXXXX"/></label>
          <button data-editable="true" class="btn btn-primary" type="submit">Request Free Callback <i class="fa-solid fa-arrow-right"></i></button>
          <div class="form-trust"><i class="fa-solid fa-shield-halved"></i> Protected by attorney-client privilege</div>
        </form>
      </aside>
    </div>
  </div>
</section>

<!-- MARQUEE LOGOS -->
<section class="marquee-section">
  <div class="container"><p data-editable="true" class="muted-center">Trusted by leading enterprises &amp; thousands of individuals</p></div>
  <div class="marquee"><div class="track">
    <span data-editable="true">FORTUNE 500</span><span data-editable="true">STARTUP INDIA</span><span data-editable="true">NCLT</span><span data-editable="true">SUPREME COURT</span><span data-editable="true">HIGH COURT</span><span data-editable="true">RERA</span><span data-editable="true">BAR COUNCIL</span><span data-editable="true">FICCI</span>
    <span data-editable="true">FORTUNE 500</span><span data-editable="true">STARTUP INDIA</span><span data-editable="true">NCLT</span><span data-editable="true">SUPREME COURT</span><span data-editable="true">HIGH COURT</span><span data-editable="true">RERA</span><span data-editable="true">BAR COUNCIL</span><span data-editable="true">FICCI</span>
  </div></div>
</section>

<!-- PRACTICE AREAS (TABS) -->
<section class="tabs-section" id="services">
  <div class="shape-blob blob-4"></div>
  <div class="dec-shape dec-dots tabs-dots"></div>
  
  <div class="container">
    <div class="tabs-header animate-up">
      <span class="badge"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg> Legal Practice Areas</span>
      <h2>Expertise You Can Trust. Your Dedicated Legal Partner.</h2>
      <p>We provide specialized legal representation across multiple practice areas, combining deep industry knowledge with a commitment to securing the best outcomes for our clients.</p>
    </div>
    
    <div class="tabs-container animate-up">
      <div class="tab-list">
        <div class="tab-item active">
          <span>SERVICES_PLACEHOLDER</span>
          <span class="tab-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg></span>
        </div>
        <div class="tab-item">
          <span>Corporate Law</span>
          <span class="tab-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg></span>
        </div>
        <div class="tab-item">
          <span>Family Law</span>
          <span class="tab-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg></span>
        </div>
        <div class="tab-item">
          <span>Real Estate</span>
          <span class="tab-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg></span>
        </div>
        <div class="tab-item">
          <span>Criminal Defense</span>
          <span class="tab-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg></span>
        </div>
      </div>
      
      <div class="tab-content-wrapper">
        <div class="tab-content-box active" id="panel-1">
          <h3>Discover Solutions</h3>
          <p>We provide comprehensive legal strategies tailored to the complexities of your specific case, ensuring your interests are vigorously protected at every stage.</p>
          <img src="/assets/templates/LawFirm/templates01/image8.jpg" alt="Legal Solutions">
          <a href="javascript:void(0);" class="link-primary">Learn More <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></a>
        </div>
        
        <div class="tab-content-box" id="panel-2">
          <h3>Corporate Law Mastery</h3>
          <p>From mergers and acquisitions to corporate governance, our business law attorneys ensure your enterprise operates smoothly and safely.</p>
          <img src="/assets/templates/LawFirm/templates01/image9.jpg" alt="Corporate Law">
          <a href="javascript:void(0);" class="link-primary">Learn More <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></a>
        </div>

        <div class="tab-content-box" id="panel-3">
          <h3>Family Law & Divorce</h3>
          <p>Navigate difficult family transitions with our compassionate and experienced attorneys focusing on child custody and asset division.</p>
          <img src="/assets/templates/LawFirm/templates01/image10.jpg" alt="Family Law">
          <a href="javascript:void(0);" class="link-primary">Learn More <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></a>
        </div>

        <div class="tab-content-box" id="panel-4">
          <h3>Real Estate Legalities</h3>
          <p>We handle complex real estate transactions, zoning laws, and property disputes, providing a solid foundation for your investments.</p>
          <img src="/assets/templates/LawFirm/templates01/image11.jpg" alt="Real Estate">
          <a href="javascript:void(0);" class="link-primary">Learn More <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></a>
        </div>

        <div class="tab-content-box" id="panel-5">
          <h3>Criminal Defense</h3>
          <p>Aggressive and strategic defense to protect your rights, freedom, and future against criminal charges at state and federal levels.</p>
          <img src="/assets/templates/LawFirm/templates01/image12.jpg" alt="Criminal Defense">
          <a href="javascript:void(0);" class="link-primary">Learn More <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></a>
        </div>
      </div>
    </div>
    
    <div class="tabs-action animate-up">
      <a href="javascript:void(0);" class="btn btn-primary">View All Services</a>
    </div>
  </div>
</section>


<!-- SPLIT QUOTE / IMAGE -->
<section class="split-section">
  <div class="split-image"><img data-editable-img="true" src="/assets/templates/LawFirm/templates02/lawyer3.jpg" alt=""/></div>
  <div class="split-text">
    <span data-editable="true" class="kicker dark">Our Philosophy</span>
    <h2 data-editable="true">"We don't sell hours. We sell outcomes."</h2>
    <p data-editable="true">Every retainer begins with one promise — clarity. We don't bury our clients in jargon or inflate billables. From day one you'll know your strategy, your timeline, and exactly what we will deliver.</p>
    <p data-editable="true">That obsession with outcomes is why we've maintained a 96% favourable resolution rate across 4,200+ matters in two decades of practice.</p>
    <div class="signature">
      <img data-editable-img="true" src="/assets/templates/LawFirm/templates02/lawyer3.jpg" alt=""/>
      <div><strong data-editable="true">Adv. Anil Verma</strong><span data-editable="true">Founding Partner · Senior Advocate, Supreme Court</span></div>
    </div>
  </div>
</section>

<!-- STATS BAND -->
<section class="band">
  <div class="container band-grid">
    <div><h3 data-editable="true" data-count="20">0</h3><p data-editable="true">Years of Practice</p></div>
    <div><h3 data-editable="true" data-count="4200">0</h3><p data-editable="true">Matters Handled</p></div>
    <div><h3 data-editable="true" data-count="96">0</h3><p data-editable="true">Success Rate %</p></div>
    <div><h3 data-editable="true" data-count="38">0</h3><p data-editable="true">Senior Advocates</p></div>
  </div>
</section>

<!-- SLIDER: CLIENT STORIES -->
<section class="section reviews">
  <div class="container">
    <div class="head-row">
      <div><span data-editable="true" class="kicker">Client Stories</span><h2 data-editable="true">Quiet wins. Loud results.</h2></div>
    </div>
    <div data-gjs-type="swiper-container" class="swiper-container slider" data-slides-per-view="1" data-navigation="true" data-pagination="bullets">
      <div data-gjs-type="swiper-wrapper" class="swiper-wrapper">
        <article data-gjs-type="swiper-slide" class="swiper-slide rev-slide">
          <div class="rev-meta"><div class="stars">★★★★★</div><span data-editable="true">Corporate · Mumbai</span></div>
          <p data-editable="true">"Verma Law Chambers structured our $40M Series C round in 11 days flat. Their term sheet negotiation alone saved us 3 board seats. Exceptional."</p>
          <div class="rev-author"><img data-editable-img="true" src="/assets/templates/LawFirm/templates02/lawyer1.jpg" alt=""/><div><strong data-editable="true">Karan Patel</strong><span data-editable="true">CEO, NovaScale</span></div></div>
        </article>
        <article data-gjs-type="swiper-slide" class="swiper-slide rev-slide">
          <div class="rev-meta"><div class="stars">★★★★★</div><span data-editable="true">Matrimonial · Bengaluru</span></div>
          <p data-editable="true">"Going through a contested divorce was the hardest year of my life. Adv. Verma handled it with empathy AND ferocity. I got custody &amp; fair settlement."</p>
          <div class="rev-author"><img data-editable-img="true" src="/assets/templates/LawFirm/templates02/lawyer2.jpg" alt=""/><div><strong data-editable="true">Meera Krishnan</strong><span data-editable="true">Architect</span></div></div>
        </article>
        <article data-gjs-type="swiper-slide" class="swiper-slide rev-slide">
          <div class="rev-meta"><div class="stars">★★★★★</div><span data-editable="true">RERA · Delhi NCR</span></div>
          <p data-editable="true">"7 years stuck with a defaulting builder. They got me full refund + interest in 9 months through RERA. Worth every rupee."</p>
          <div class="rev-author"><img data-editable-img="true" src="/assets/templates/LawFirm/templates02/lawyer3.jpg" alt=""/><div><strong data-editable="true">Sandeep Rana</strong><span data-editable="true">NRI Buyer</span></div></div>
        </article>
        <article data-gjs-type="swiper-slide" class="swiper-slide rev-slide">
          <div class="rev-meta"><div class="stars">★★★★★</div><span data-editable="true">Criminal · Pune</span></div>
          <p data-editable="true">"Anticipatory bail granted within 36 hours of engaging them. Their courtroom presence is unmatched. I will recommend them to anyone, anywhere."</p>
          <div class="rev-author"><img data-editable-img="true" src="/assets/templates/LawFirm/templates02/lawyer1.jpg" alt=""/><div><strong data-editable="true">Rahul Deshmukh</strong><span data-editable="true">Business Owner</span></div></div>
        </article>
      </div>
      <div data-gjs-type="swiper-button-prev" class="swiper-button-prev slider-btn prev"></div>
      <div data-gjs-type="swiper-button-next" class="swiper-button-next slider-btn next"></div>
      <div data-gjs-type="swiper-pagination" class="swiper-pagination" style="position:absolute;bottom:20px;left:0;width:100%;"></div>
    </div>
  </div>
</section>

<!-- TEAM -->
<section class="section team">
  <div class="container">
    <div class="head-row"><div><span data-editable="true" class="kicker">The Chamber</span><h2 data-editable="true">Counsel you can trust. Advocates who fight.</h2></div></div>
    <div class="team-grid">
      <div class="team-card"><div class="t-img"><img data-editable-img="true" src="/assets/templates/LawFirm/templates02/lawyer3.jpg" alt=""/></div><h3 data-editable="true">Anil Verma</h3><span data-editable="true">Founding Partner</span><p data-editable="true">32 yrs · Supreme Court · Corporate &amp; Constitutional</p></div>
      <div class="team-card"><div class="t-img"><img data-editable-img="true" src="/assets/templates/LawFirm/templates02/lawyer2.jpg" alt=""/></div><h3 data-editable="true">Ritika Bhansali</h3><span data-editable="true">Senior Partner</span><p data-editable="true">16 yrs · Family Law &amp; Mediation</p></div>
      <div class="team-card"><div class="t-img"><img data-editable-img="true" src="/assets/templates/LawFirm/templates02/lawyer1.jpg" alt=""/></div><h3 data-editable="true">Aakash Nair</h3><span data-editable="true">Partner — Litigation</span><p data-editable="true">14 yrs · Criminal &amp; Commercial Disputes</p></div>
    </div>
  </div>
</section>

<!-- PROCESS / FAQ COMBINED -->
<section class="section pf-section">
  <div class="container pf-grid">
    <div>
      <span data-editable="true" class="kicker">How It Works</span>
      <h2 data-editable="true">From query to courtroom — seamlessly.</h2>
      <ol class="timeline">
        <li data-editable="true"><span data-editable="true">1</span><div><strong data-editable="true">Submit Enquiry</strong><p data-editable="true">Fill the form or call. Takes 60 seconds.</p></div></li>
        <li data-editable="true"><span data-editable="true">2</span><div><strong data-editable="true">Discovery Call</strong><p data-editable="true">Senior advocate calls within 30 minutes to understand your case.</p></div></li>
        <li data-editable="true"><span data-editable="true">3</span><div><strong data-editable="true">Engagement &amp; Strategy</strong><p data-editable="true">Clear roadmap, transparent fees, signed engagement letter.</p></div></li>
        <li data-editable="true"><span data-editable="true">4</span><div><strong data-editable="true">Representation &amp; Updates</strong><p data-editable="true">We handle all hearings. You get weekly progress updates.</p></div></li>
      </ol>
    </div>
    <div>
      <span data-editable="true" class="kicker">Frequently Asked</span>
      <h2 data-editable="true">Good questions deserve clear answers.</h2>
      <div class="faq-list">
        <details open><summary>Is the first consultation truly free?</summary><p data-editable="true">Yes — a complimentary 30-minute call with a senior advocate, with zero obligation.</p></details>
        <details><summary>Do you take cases outside major metros?</summary><p data-editable="true">We have associates across 22 states and represent clients before the Supreme Court, all High Courts, NCLT, NCLAT &amp; tribunals.</p></details>
        <details><summary>How do you structure your fees?</summary><p data-editable="true">We offer fixed-fee, milestone billing, hourly retainers, and in select matters a success-fee model.</p></details>
        <details><summary>Will my information stay private?</summary><p data-editable="true">Always. All communication is protected under attorney-client privilege &amp; our systems are end-to-end encrypted.</p></details>
        <details><summary>Can you handle urgent bail matters?</summary><p data-editable="true">Yes. Our criminal team is on call 24/7 for emergencies and typically files within hours of engagement.</p></details>
      </div>
    </div>
  </div>
</section>

<!-- CTA -->
<section class="cta">
  <div class="container cta-inner">
    <div>
      <span data-editable="true" class="kicker dark">Don't Wait</span>
      <h2 data-editable="true">The strongest legal position is the one taken early.</h2>
      <p data-editable="true">Speak to a senior advocate today — free, confidential, no obligation.</p>
    </div>
    <a data-editable="true" href="javascript:void(0);" class="btn btn-dark">Book Free Consultation <i class="fa-solid fa-arrow-right"></i></a>
  </div>
</section>

<!-- FOOTER -->
<footer>
  <div class="container footer-grid">
    <div>
      <div class="brand"><i class="fa-solid fa-scale-balanced"></i><div><span data-editable="true" class="brand-name">Verma Law Chambers</span><small>Advocates &amp; Solicitors</small></div></div>

    </div>
    <div><h4 data-editable="true">Contact</h4><p><i class="fa-solid fa-phone" style="color: var(--primary);"></i> <a data-editable="true" href="tel:+918888888888" style="color: var(--primary); text-decoration: none;">+91 88888 88888</a></p><p><i class="fa-solid fa-envelope" style="color: var(--primary);"></i> <a data-editable="true" href="mailto:hello@vermachambers.in" style="color: var(--primary); text-decoration: none;">hello@vermachambers.in</a></p><p><i class="fa-solid fa-location-dot" style="color: var(--primary);"></i> <span data-editable="true" style="color: var(--primary);">Nariman Point, Mumbai 400021</span></p></div>
    <div><h4 data-editable="true">Follow</h4><div class="socials"><a data-editable="true" href="javascript:void(0);"><i class="fa-brands fa-linkedin-in"></i></a><a data-editable="true" href="javascript:void(0);"><i class="fa-brands fa-instagram"></i></a><a data-editable="true" href="javascript:void(0);"><i class="fa-brands fa-x-twitter"></i></a></div></div>
  </div>
  <div class="copyright">© 2025 Verma Law Chambers · As per Bar Council of India rules, this is not advertisement or solicitation.</div>
</footer>

<a data-editable="true" href="javascript:void(0);" class="float-cta"><i class="fa-solid fa-phone-volume"></i></a>

<script>
(function() {
  // Do not run animations inside GrapesJS editor as it causes infinite MutationObserver loops
  var isInEditor = !!document.querySelector('[data-gjs-type]') || document.body.classList.contains('gjs-dashed');
  
  const counters=document.querySelectorAll('[data-count]');
  if (isInEditor) {
    counters.forEach(c => { c.textContent = c.dataset.count + (parseInt(c.dataset.count, 10) >= 100 ? '+' : ''); });
    document.querySelectorAll('.section, .practice-card, .team-card, .timeline li').forEach(el=>el.classList.add('reveal', 'in'));
    return;
  }

  const cObs=new IntersectionObserver((es)=>{es.forEach(e=>{if(e.isIntersecting){const el=e.target,t=+el.dataset.count;let c=0;const s=Math.max(1,Math.ceil(t/60));const tick=()=>{c+=s;if(c>=t){el.textContent=t+(t>=100?'+':'');return}el.textContent=c;requestAnimationFrame(tick)};tick();cObs.unobserve(el)}})},{threshold:.5});
  counters.forEach(c=>cObs.observe(c));

  document.querySelectorAll('.section, .practice-card, .team-card, .timeline li').forEach(el=>el.classList.add('reveal'));
  const rObs=new IntersectionObserver((es)=>{es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');rObs.unobserve(e.target)}})},{threshold:.12});
  document.querySelectorAll('.reveal').forEach(el=>rObs.observe(el));
})();
</script>

<script id="core-interactions">
  (function() {
    var isInEditor = !!document.querySelector('[data-gjs-type]') || document.body.classList.contains('gjs-dashed');
    document.addEventListener('submit', function(e) {
      if (e.target.tagName === 'FORM') {
        e.target.setAttribute('novalidate', 'true');
        var isValid = true;
        var inputs = e.target.querySelectorAll('input:not([type="submit"]):not([type="hidden"]):not([type="button"]), textarea, select');
        inputs.forEach(function(input) {
          if (!input.value.trim() && input.hasAttribute('required')) isValid = false;
        });
        if (!isValid || isInEditor) {
          e.preventDefault();
          e.stopImmediatePropagation();
      }
    }, true);
    
    // Initialize Swiper in preview/live mode
    if (!isInEditor && typeof Swiper !== 'undefined') {
      var swipers = document.querySelectorAll('.swiper-container');
      swipers.forEach(function(s) {
        var slidesPerView = s.getAttribute('data-slides-per-view') || 1;
        new Swiper(s, {
          slidesPerView: slidesPerView,
          loop: true,
          pagination: {
            el: s.querySelector('.swiper-pagination'),
            clickable: true,
          },
          navigation: {
            nextEl: s.querySelector('.swiper-button-next'),
            prevEl: s.querySelector('.swiper-button-prev'),
          },
        });
      });
    }
  })();
</script>
`;