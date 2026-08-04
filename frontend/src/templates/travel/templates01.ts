// Auto-generated ULTRA-DYNAMIC template
// Generated: 2026-07-01T12:55:46.218Z
// ════════════════════════════════════════════════════════════════════════════
// Converted directly in the browser using Frontend JSZip Extraction
// ════════════════════════════════════════════════════════════════════════════

export const travel01Styles = `
/* ============ Wanderly — Premium Travel (v2) ============ */
:root{
  --primary: PRIMARY_COLOR_PLACEHOLDER;
  --secondary: SECONDARY_COLOR_PLACEHOLDER;
  --accent: SECONDARY_COLOR_PLACEHOLDER;
  --dark: #0B1120;
  --light: #f8fafc;
  --gray: #64748b;
  --border: #e2e8f0;
  --font: 'Plus Jakarta Sans', sans-serif;

  --bg: var(--light);
  --surface: #ffffff;
  --alt: #f1f5f9;
  --ink: var(--dark);
  --ink-2: #1e293b;
  --muted: var(--gray);
  --brand: var(--primary);
  --brand-2: var(--secondary);
  --brand-dark: var(--accent);
  --dark-2: #0f172a;
  --radius: 14px;
  --radius-lg: 24px;
  --shadow-sm: 0 4px 14px rgba(11,17,32,.06);
  --shadow: 0 20px 50px rgba(11,17,32,.10);
  --shadow-lg: 0 30px 80px rgba(11,17,32,.20);
  --ease: cubic-bezier(.4,0,.2,1);
  --serif: 'Fraunces', Georgia, serif;
  --sans: var(--font);
}

*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth;overflow-x:hidden}
body{font-family:var(--sans);color:var(--ink);background:var(--bg);line-height:1.65;-webkit-font-smoothing:antialiased;overflow-x:hidden}
img{max-width:100%;display:block}
a{color:inherit;text-decoration:none}
h1,h2,h3,h4{font-family:var(--serif);line-height:1.1;color:var(--ink);font-weight:700;letter-spacing:-.02em}
em{font-style:italic;font-family:var(--serif);font-weight:600;color:var(--brand-2)}
.container{width:min(1200px,92%);margin:0 auto}
.eyebrow{display:inline-flex;align-items:center;gap:8px;font-size:.72rem;letter-spacing:.22em;text-transform:uppercase;color:var(--brand-dark);font-weight:600;margin-bottom:16px;font-family:var(--sans)}
.eyebrow--light{color:var(--brand)}
.eyebrow--gold{color:var(--brand)}
.h-lg{font-size:clamp(2.2rem,4.2vw,3.8rem)}
.h-md{font-size:clamp(1.7rem,3vw,2.6rem)}
.lead{font-size:1.1rem;color:var(--muted);margin:0 0 24px}
small{font-size:.82rem}

/* ===== Buttons ===== */
.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:14px 28px;border-radius:999px;font-weight:600;font-size:.92rem;cursor:pointer;border:none;transition:.3s var(--ease);font-family:inherit;letter-spacing:.01em;position:relative;overflow:hidden}
.btn::before{content:"";position:absolute;inset:0;background:rgba(255,255,255,.15);transform:translateX(-100%);transition:.4s var(--ease)}
.btn:hover::before{transform:translateX(0)}
.btn--primary{background-color:var(--ink);color:#fff;box-shadow:0 10px 25px rgba(26,22,19,.25)}
.btn--primary:hover{transform:translateY(-2px);box-shadow:0 15px 35px rgba(26,22,19,.35)}
.btn--gold{background-color:PRIMARY_COLOR_PLACEHOLDER;color:#fff;box-shadow:0 10px 25px rgba(SECONDARY_RGB_PLACEHOLDER,.35)}
.btn--gold:hover{transform:translateY(-2px);box-shadow:0 15px 35px rgba(SECONDARY_RGB_PLACEHOLDER,.5)}
.btn--outline{background-color:transparent;color:var(--ink);border:1.5px solid var(--ink)}
.btn--outline:hover{background-color:var(--ink);color:#fff}
.btn--ghost{background-color:transparent;color:#fff;border:1.5px solid rgba(255,255,255,.35)}
.btn--ghost:hover{background-color:rgba(255,255,255,.1);border-color:#fff}
.btn--sm{padding:10px 20px;font-size:.82rem}
.btn--lg{padding:18px 40px;font-size:1rem}
.btn--block{width:100%}

/* ===== Announcement ===== */
.announce{background:var(--ink);color:#f4e9d0;padding:10px 0;overflow:hidden;font-size:.82rem;letter-spacing:.05em}
.announce__track{display:flex;gap:60px;white-space:nowrap;animation:scroll-x 40s linear infinite;width:max-content}
.announce__track span{display:inline-flex;align-items:center;gap:8px}
@keyframes scroll-x{to{transform:translateX(-50%)}}

/* ===== NAV ===== */
.nav{position:fixed;top:38px;left:0;right:0;z-index:50;padding:16px 0;transition:.4s var(--ease)}
.nav.scrolled{top:0;background:rgba(250,247,242,.92);backdrop-filter:blur(16px);box-shadow:var(--shadow-sm);padding:12px 0}
.nav__inner{display:flex;align-items:center;justify-content:space-between;gap:24px}
.brand{display:flex;align-items:center;gap:10px;color:#fff;font-weight:700;font-size:1.4rem;font-family:var(--serif);letter-spacing:-.02em}
.nav.scrolled .brand{color:var(--ink)}
.brand__mark{width:38px;height:38px;display:grid;place-items:center;border-radius:50%;background-color:var(--brand);color:#fff;font-size:1.1rem;transition:transform .5s var(--ease)}
.brand:hover .brand__mark{transform:rotate(180deg)}
.nav__links{display:flex;gap:34px}
.nav__links a{color:#fff;font-size:.9rem;font-weight:500;position:relative;transition:.2s}
.nav.scrolled .nav__links a{color:var(--ink-2)}
.nav__links a::after{content:"";position:absolute;left:0;right:0;bottom:-6px;height:1.5px;background:var(--brand);transform:scaleX(0);transition:.3s var(--ease);transform-origin:right}
.nav__links a:hover::after{transform:scaleX(1);transform-origin:left}

/* ===== HERO ===== */
.hero{position:relative;min-height:100vh;display:flex;align-items:center;padding:170px 0 100px;overflow:hidden;color:#fff}
.hero__bg{position:absolute;inset:0;background-size:cover;background-position:center;transform:scale(1.05);animation:kenburns 22s ease-in-out infinite alternate}
@keyframes kenburns{to{transform:scale(1.15)}}
.hero__overlay{position:absolute;inset:0;background:linear-gradient(180deg,rgba(20,18,16,.55) 0%,rgba(20,18,16,.30) 40%,rgba(20,18,16,.88) 100%)}
.hero__content{position:relative;z-index:2}
.hero__title{font-size:clamp(2.6rem,6vw,5rem);color:#fff;margin-bottom:22px;animation:fadeUp .9s var(--ease) .1s both}
.hero__title em{color:var(--brand);font-weight:600}
.hero__sub{max-width:640px;font-size:1.12rem;opacity:.9;margin-bottom:38px;animation:fadeUp .9s var(--ease) .2s both}
.eyebrow{animation:fadeUp .8s var(--ease) both}
@keyframes fadeUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}

/* Floating badges */
.float-badge{position:absolute;background:rgba(255,255,255,.95);color:var(--ink);padding:10px 18px;border-radius:999px;font-size:.82rem;font-weight:600;box-shadow:var(--shadow);z-index:1;backdrop-filter:blur(10px);display:inline-flex;align-items:center;gap:8px}
.float-badge--1{top:22%;right:6%;animation:floaty 5s ease-in-out infinite}
.float-badge--2{top:44%;right:3%;animation:floaty 6s ease-in-out .5s infinite}
.float-badge--3{top:68%;right:8%;animation:floaty 7s ease-in-out 1s infinite}
.float-badge .dot{width:8px;height:8px;background:#22c55e;border-radius:50%;animation:pulse 1.6s infinite}
@keyframes floaty{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
@keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(34,197,94,.7)}70%{box-shadow:0 0 0 8px rgba(34,197,94,0)}}
@media(max-width:900px){.float-badge{display:none}}

/* Book form */
.book-form{background:rgba(255,255,255,.98);border-radius:var(--radius-lg);padding:18px;display:grid;grid-template-columns:1.3fr 1fr 1fr auto;gap:10px;box-shadow:var(--shadow-lg);animation:fadeUp 1s var(--ease) .3s both;color:var(--ink)}
.book-form__field{display:flex;flex-direction:column;gap:4px;padding:6px 16px;border-right:1px solid var(--border);transition:.2s}
.book-form__field:hover{background:rgba(SECONDARY_RGB_PLACEHOLDER,.05);border-radius:12px}
.book-form__field:nth-child(3){border-right:none}
.book-form__field label{font-size:.7rem;text-transform:uppercase;letter-spacing:.12em;color:var(--muted);font-weight:600}
.book-form__field select,.book-form__field input{border:none;outline:none;font-size:.95rem;font-family:inherit;color:var(--ink);background-color:transparent;font-weight:500;padding:0;margin:0;border-radius:0}

.hero__stats{display:flex;gap:56px;margin-top:52px;animation:fadeUp 1s var(--ease) .5s both;flex-wrap:wrap}
.hero__stats div{display:flex;flex-direction:column}
.hero__stats strong{font-family:var(--serif);font-size:2.2rem;color:var(--brand);font-weight:600}
.hero__stats span{font-size:.82rem;opacity:.85;letter-spacing:.05em}

.scroll-hint{position:absolute;bottom:30px;left:50%;transform:translateX(-50%);color:#fff;font-size:.72rem;letter-spacing:.28em;text-transform:uppercase;opacity:.7;display:flex;flex-direction:column;align-items:center;gap:10px;z-index:3}
.scroll-hint span{width:1px;height:36px;background:#fff;animation:scrollDown 2s ease-in-out infinite;transform-origin:top}
@keyframes scrollDown{0%{transform:scaleY(0)}50%{transform:scaleY(1)}100%{transform:scaleY(0);transform-origin:bottom}}

/* ===== TRUST ===== */
.trust{padding:36px 0;background:var(--alt);border-bottom:1px solid var(--border)}
.trust p{text-align:center;color:var(--muted);font-size:.76rem;text-transform:uppercase;letter-spacing:.22em;margin-bottom:18px}
.trust__logos{display:flex;flex-wrap:wrap;justify-content:center;gap:48px;color:var(--ink-2);font-weight:700;letter-spacing:.16em;font-size:.82rem;opacity:.55}

/* ===== Sections ===== */
.section{padding:110px 0}
.section--alt{background:var(--alt)}
.section--dark{background:var(--dark);color:#e8dfd0}
.section--dark h2,.section--dark h3,.section--dark h4{color:#fff}
.section--dark em{color:var(--brand)}
.section__head{text-align:center;max-width:680px;margin:0 auto 60px}
.section__head--light p{color:rgba(255,255,255,.7)}
.section__head h2{font-size:clamp(2rem,3.8vw,3rem);margin-bottom:16px}
.section__head p{color:var(--muted)}

/* Two-col intro */
.two-col{display:grid;grid-template-columns:1.1fr 1fr;gap:80px;align-items:center}
.pill-row{display:flex;flex-wrap:wrap;gap:10px;margin-top:24px}
.pill{background:#fff;border:1px solid var(--border);padding:8px 16px;border-radius:999px;font-size:.85rem;font-weight:500;transition:.25s var(--ease);cursor:default}
.pill:hover{background:var(--ink);color:#fff;border-color:var(--ink);transform:translateY(-2px)}
.stat-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.stat-tile{background:#fff;padding:36px 26px;border-radius:var(--radius-lg);border:1px solid var(--border);transition:.3s var(--ease)}
.stat-tile:hover{transform:translateY(-4px);box-shadow:var(--shadow)}
.stat-tile:nth-child(2),.stat-tile:nth-child(3){transform:translateY(24px)}
.stat-tile:nth-child(2):hover,.stat-tile:nth-child(3):hover{transform:translateY(20px)}
.stat-tile strong{display:block;font-family:var(--serif);font-size:2.4rem;color:var(--brand-2);margin-bottom:6px}
.stat-tile--dark{background:var(--ink);color:#e8dfd0}
.stat-tile--dark strong{color:var(--brand)}
.stat-tile span{font-size:.9rem;color:var(--muted)}
.stat-tile--dark span{color:rgba(255,255,255,.7)}

/* ===== Destinations ===== */
.dest-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:26px}
.dest-card{background:#fff;border-radius:var(--radius-lg);overflow:hidden;box-shadow:var(--shadow-sm);transition:.5s var(--ease);cursor:pointer;border:1px solid var(--border)}
.dest-card:hover{transform:translateY(-8px);box-shadow:var(--shadow)}
.dest-card__img{position:relative;overflow:hidden;aspect-ratio:4/5}
.dest-card__img img{width:100%;height:100%;object-fit:cover;transition:.7s var(--ease)}
.dest-card:hover .dest-card__img img{transform:scale(1.08)}
.dest-card__save{position:absolute;top:14px;right:14px;width:38px;height:38px;background:rgba(255,255,255,.95);border-radius:50%;display:grid;place-items:center;font-size:1.1rem;color:var(--ink);cursor:pointer;transition:.25s var(--ease);z-index:2}
.dest-card__save:hover{background:var(--brand);color:#fff;transform:scale(1.1)}
.dest-card__body{padding:22px}
.dest-card__meta{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px}
.tag{font-size:.68rem;letter-spacing:.16em;text-transform:uppercase;color:var(--brand-2);font-weight:700}
.rating{font-size:.82rem;color:var(--brand-dark);font-weight:600}
.dest-card h3{font-size:1.4rem;margin-bottom:6px}
.dest-card__body>p{color:var(--muted);font-size:.88rem;margin-bottom:18px;min-height:44px}
.dest-card__foot{display:flex;justify-content:space-between;align-items:center;padding-top:16px;border-top:1px solid var(--border)}
.dest-card__foot small{display:block;color:var(--muted);font-size:.68rem;text-transform:uppercase;letter-spacing:.12em;margin-bottom:2px}
.dest-card__foot strong{font-size:1.3rem;font-family:var(--serif);color:var(--ink)}
.link-arrow{color:var(--brand-2);font-weight:600;font-size:.9rem;transition:.25s}
.link-arrow:hover{gap:6px;color:var(--brand)}
.center-btn{text-align:center;margin-top:50px}

/* ===== Why grid ===== */
.why-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:20px}
.why-card{background:#fff;padding:34px 28px;border-radius:var(--radius-lg);box-shadow:var(--shadow-sm);border:1px solid var(--border);transition:.35s var(--ease);position:relative;overflow:hidden}
.why-card::before{content:"";position:absolute;top:0;left:0;width:100%;height:3px;background:linear-gradient(90deg,var(--brand),var(--brand-2));transform:scaleX(0);transform-origin:left;transition:.4s var(--ease)}
.why-card:hover{transform:translateY(-6px);box-shadow:var(--shadow)}
.why-card:hover::before{transform:scaleX(1)}
.why-card__icon{font-size:2.2rem;margin-bottom:16px;display:inline-block;transition:.4s var(--ease)}
.why-card:hover .why-card__icon{transform:scale(1.15) rotate(-8deg)}
.why-card h3{font-size:1.22rem;margin-bottom:8px}
.why-card p{color:var(--muted);font-size:.92rem;line-height:1.6}

/* ===== Process (dark) ===== */
.steps{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:24px;counter-reset:step}
.step{padding:36px 28px;border:1px solid rgba(255,255,255,.1);border-radius:var(--radius-lg);transition:.35s var(--ease);position:relative;background:linear-gradient(180deg,rgba(255,255,255,.02),transparent)}
.step:hover{border-color:var(--brand);transform:translateY(-6px);background:linear-gradient(180deg,rgba(SECONDARY_RGB_PLACEHOLDER,.08),transparent)}
.step__num{font-family:var(--serif);font-size:2.6rem;color:var(--brand);display:block;margin-bottom:14px;font-weight:600;font-style:italic}
.step h3{font-size:1.2rem;margin-bottom:10px}
.step p{color:rgba(255,255,255,.7);font-size:.92rem}

/* ===== Offers ===== */
.offers{display:grid;grid-template-columns:repeat(auto-fit,minmax(290px,1fr));gap:24px;align-items:stretch}
.offer{position:relative;background:#fff;border:1px solid var(--border);border-radius:var(--radius-lg);padding:36px 30px;display:flex;flex-direction:column;transition:.35s var(--ease)}
.offer:hover{transform:translateY(-6px);box-shadow:var(--shadow)}
.offer--featured{background-color:#1a1613;color:#e8dfd0;border:none;transform:translateY(-12px);box-shadow:var(--shadow-lg)}
.offer--featured h3,.offer--featured .offer__price strong{color:#fff}
.offer--featured>p,.offer--featured ul li{color:rgba(255,255,255,.85)}
.offer__badge{position:absolute;top:-14px;left:30px;background-color:PRIMARY_COLOR_PLACEHOLDER;color:#fff;padding:6px 16px;border-radius:999px;font-size:.7rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase}
.offer h3{font-size:1.5rem;margin-bottom:8px}
.offer>p{color:var(--muted);margin-bottom:20px;font-size:.94rem}
.offer ul{list-style:none;margin-bottom:24px;flex:1}
.offer ul li{padding:9px 0;font-size:.92rem;border-bottom:1px solid rgba(0,0,0,.06)}
.offer--featured ul li{border-color:rgba(255,255,255,.1)}
.offer__price{display:flex;align-items:baseline;gap:8px;margin-bottom:20px}
.offer__price del{color:var(--muted);font-size:1rem}
.offer--featured .offer__price del{color:rgba(255,255,255,.5)}
.offer__price strong{font-family:var(--serif);font-size:2.4rem;color:var(--brand-2);font-weight:700}
.offer--featured .offer__price strong{color:var(--brand)}
.offer__price span{color:var(--muted);font-size:.85rem}
.offer__urgency{display:block;text-align:center;margin-top:12px;color:var(--brand);font-weight:600;font-size:.82rem;animation:pulse-txt 2s infinite}
@keyframes pulse-txt{0%,100%{opacity:1}50%{opacity:.6}}

/* ===== Inclusions ===== */
.incl-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(310px,1fr));gap:18px}
.incl{background:#fff;padding:28px 22px;border-radius:var(--radius-lg);border:1px solid var(--border);text-align:center;transition:.3s var(--ease)}
.incl:hover{transform:translateY(-4px);box-shadow:var(--shadow-sm);border-color:var(--brand)}
.incl span{font-size:2rem;display:inline-block;margin-bottom:10px;transition:.4s}
.incl:hover span{transform:scale(1.2) rotate(6deg)}
.incl h4{font-size:1.05rem;margin-bottom:6px}
.incl p{color:var(--muted);font-size:.85rem}

/* ===== Reviews ===== */
.rating-row{display:flex;justify-content:center;margin-top:20px}
.big-rating{display:flex;flex-direction:column;align-items:center;background:#fff;padding:20px 34px;border-radius:var(--radius-lg);border:1px solid var(--border)}
.big-rating strong{font-family:var(--serif);font-size:2.4rem;color:var(--brand-2);line-height:1}
.big-rating span{color:var(--brand);letter-spacing:2px;font-size:1rem;margin:4px 0}
.big-rating small{color:var(--muted)}
.reviews{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:22px}
.reviews blockquote{background:#fff;padding:30px 28px;border-radius:var(--radius-lg);border:1px solid var(--border);transition:.3s var(--ease)}
.reviews blockquote:hover{transform:translateY(-4px);box-shadow:var(--shadow)}
.stars{color:var(--brand);font-size:1rem;letter-spacing:2px;margin-bottom:14px}
.reviews p{font-size:.98rem;color:var(--ink-2);margin-bottom:22px;font-family:var(--serif);font-style:italic;font-weight:400;line-height:1.55}
.reviews footer{display:flex;align-items:center;gap:12px}
.avatar{width:42px;height:42px;border-radius:50%;background-color:var(--brand);color:#fff;display:grid;place-items:center;font-weight:700;font-size:.85rem;letter-spacing:.05em}
.reviews footer strong{display:block;font-family:var(--serif);font-size:1.02rem}
.reviews footer span{color:var(--muted);font-size:.8rem}

/* ===== Compare ===== */
.compare{background:#fff;border-radius:var(--radius-lg);border:1px solid var(--border);overflow:hidden}
.compare__row{display:grid;grid-template-columns:2fr 1fr 1fr;padding:18px 26px;border-bottom:1px solid var(--border);font-size:.94rem;align-items:center}
.compare__row:last-child{border:none}
.compare__row--head{background:var(--ink);color:#fff;font-weight:600;font-size:.88rem;letter-spacing:.05em;text-transform:uppercase;padding:22px 26px}
.compare__row--head .cell-us{color:var(--brand)}
.cell-us{font-weight:600;color:var(--brand-2)}
.compare__row:hover:not(.compare__row--head){background:rgba(SECONDARY_RGB_PLACEHOLDER,.05)}

/* ===== FAQ ===== */
.faq{max-width:820px;margin:0 auto;display:flex;flex-direction:column;gap:12px}
.faq__item{background:#fff;border:1px solid var(--border);border-radius:16px;padding:0 24px;transition:.3s var(--ease)}
.faq__item[open]{border-color:var(--brand);box-shadow:var(--shadow-sm)}
.faq__item summary{list-style:none !important;cursor:pointer;padding:22px 0;display:flex;justify-content:space-between;align-items:center;font-weight:600;font-size:1.02rem;font-family:var(--serif)}
.faq__item summary::-webkit-details-marker{display:none !important}
.faq__item summary::marker{display:none !important;content:"" !important;font-size:0 !important;color:transparent !important}
.faq__item summary::after{display:none !important;content:none !important}
.faq__i{font-size:1.4rem;color:var(--brand);transition:.35s var(--ease);font-family:var(--sans);font-weight:300}
.faq__item[open] .faq__i{transform:rotate(45deg)}
.faq__item p{padding:0 0 22px;color:var(--muted);line-height:1.65;font-size:.95rem}

/* ===== Newsletter ===== */
.newsletter{background:var(--ink);color:#fff;border-radius:var(--radius-lg);padding:60px;display:grid;grid-template-columns:1.1fr 1fr;gap:60px;align-items:center;position:relative;overflow:hidden}
.newsletter::before{content:"";position:absolute;top:-50%;right:-10%;width:400px;height:400px;background:radial-gradient(circle,rgba(SECONDARY_RGB_PLACEHOLDER,.25),transparent 70%);border-radius:50%}
.newsletter h2{color:#fff;margin-bottom:14px;position:relative}
.newsletter p{color:rgba(255,255,255,.75);position:relative}
.news-form{display:flex;flex-direction:column;gap:12px;position:relative}
.news-form input{padding:16px 20px;border-radius:999px;border:1px solid rgba(255,255,255,.2);background:rgba(255,255,255,.08);color:#fff;font-family:inherit;font-size:.95rem;outline:none;transition:.25s}
.news-form input::placeholder{color:rgba(255,255,255,.4)}
.news-form input:focus{border-color:var(--brand);background:rgba(255,255,255,.12)}
.news-form small{color:rgba(255,255,255,.5);text-align:center}

/* ===== CTA ===== */
.cta{background-color:#1a1613;color:#fff;padding:110px 0;text-align:center;position:relative;overflow:hidden}
.cta::before,.cta::after{content:"";position:absolute;border-radius:50%;background:radial-gradient(circle,rgba(SECONDARY_RGB_PLACEHOLDER,.2),transparent 70%)}
.cta::before{width:500px;height:500px;top:-30%;left:-10%}
.cta::after{width:400px;height:400px;bottom:-30%;right:-10%}
.cta__inner{position:relative;z-index:2}
.cta h2{color:#fff;margin-bottom:14px}
.cta p{margin-bottom:32px;opacity:.85;font-size:1.05rem}
.cta__actions{display:flex;gap:14px;justify-content:center;flex-wrap:wrap}

/* ===== Footer ===== */
.footer{background:var(--dark);color:#a8a099;padding:70px 0 0}
.footer__inner{display:grid;grid-template-columns:2fr 1fr 1fr 1.2fr;gap:50px;padding-bottom:50px}
.footer .brand{color:#fff;margin-bottom:16px}
.footer__desc{color:#8a827b;max-width:340px;font-size:.92rem;margin-bottom:20px}
.footer h4{color:#fff;font-family:var(--sans);font-size:.78rem;text-transform:uppercase;letter-spacing:.18em;margin-bottom:16px;font-weight:600}
.footer p,.footer a{font-size:.92rem;color:#8a827b;line-height:2;display:block;transition:.2s}
.footer a:hover{color:var(--brand)}
.socials{display:flex;gap:10px}
.socials a{width:38px;height:38px;border-radius:50%;border:1px solid rgba(255,255,255,.15);display:grid;place-items:center;font-size:.78rem;font-weight:600;color:#fff;transition:.3s}
.socials a:hover{background:var(--brand);border-color:var(--brand);color:var(--ink);transform:translateY(-2px)}
.footer__bottom{border-top:1px solid rgba(255,255,255,.08);padding:22px 0;font-size:.85rem;color:#6a625b;text-align:center}

/* ===== Reveal ===== */
/* Animation disabled to ensure visibility in all environments */
[data-reveal]{opacity:1;transform:none;transition:opacity .9s var(--ease),transform .9s var(--ease)}
[data-reveal].in{opacity:1;transform:none}
.gjs-dashed [data-reveal], [data-gjs-type] [data-reveal] { opacity:1 !important; transform:none !important; }


/* ===== To-top & Toast ===== */
.to-top{position:fixed;bottom:26px;right:26px;width:48px;height:48px;border-radius:50%;background:var(--ink);color:#fff;border:none;cursor:pointer;font-size:1.2rem;z-index:60;opacity:0;transform:translateY(20px);transition:.3s var(--ease);box-shadow:var(--shadow)}
.to-top.show{opacity:1;transform:translateY(0)}
.to-top:hover{background:var(--brand);color:var(--ink);transform:translateY(-3px)}
.toast{position:fixed;bottom:30px;left:50%;transform:translate(-50%,140%);background:var(--ink);color:#fff;padding:14px 26px;border-radius:999px;box-shadow:var(--shadow-lg);font-size:.9rem;font-weight:500;transition:.45s var(--ease);z-index:100;max-width:90%;border:1px solid var(--brand)}
.toast.show{transform:translate(-50%,0)}
.gjs-dashed .to-top, [data-gjs-type] .to-top { opacity: 1 !important; transform: translateY(0) !important; }
.gjs-dashed .toast, [data-gjs-type] .toast { transform: translate(-50%,0) !important; }

/* ===== Responsive ===== */
@media(max-width:900px){
  .nav__links{display:none}
  .book-form{grid-template-columns:1fr 1fr;gap:0}
  .book-form__field{border-right:none;border-bottom:1px solid var(--border);padding:12px 16px}
  .book-form .btn{grid-column:1/-1;margin-top:10px;border-radius:12px}
  .hero__stats{gap:28px}
  .hero__stats strong{font-size:1.7rem}
  .two-col{grid-template-columns:1fr;gap:50px}
  .newsletter{grid-template-columns:1fr;padding:40px 30px;gap:32px}
  .offer--featured{transform:none}
  .footer__inner{grid-template-columns:1fr 1fr;gap:32px}
  .section{padding:80px 0}
  .compare__row{grid-template-columns:1.5fr 1fr 1fr;padding:14px 18px;font-size:.85rem}
}
@media(max-width:520px){
  .book-form{grid-template-columns:1fr}
  .hero{padding:150px 0 70px}
  .footer__inner{grid-template-columns:1fr}
  .stat-tile:nth-child(2),.stat-tile:nth-child(3){transform:none}
  .stat-tile:nth-child(2):hover,.stat-tile:nth-child(3):hover{transform:translateY(-4px)}
  .cta__actions{flex-direction:column}
  .cta__actions .btn{width:100%}
}
`;

export const travel01Html = `
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;0,9..144,800;1,9..144,600&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

<!-- Announcement Bar -->
<div class="announce">
  <div class="announce__track">
    <span data-editable="true">✈ Summer Sale — Up to 45% Off Luxury Tours</span>
    <span data-editable="true">◆ Free Cancellation up to 48 hrs</span>
    <span data-editable="true">★ Rated 4.9/5 by 50,000+ travelers</span>
    <span data-editable="true">🎁 Book 2 trips, get airport transfer FREE</span>
    <span data-editable="true">✈ Summer Sale — Up to 45% Off Luxury Tours</span>
    <span data-editable="true">◆ Free Cancellation up to 48 hrs</span>
    <span data-editable="true">★ Rated 4.9/5 by 50,000+ travelers</span>
    <span data-editable="true">🎁 Book 2 trips, get airport transfer FREE</span>
  </div>
</div>

<!-- NAV -->
<header class="nav" id="nav">
  <div class="container nav__inner">
    <a data-editable="true" href="javascript:void(0);" class="brand">
      <span data-editable="true" class="brand__mark">✦</span>
      <span data-editable="true" class="brand__text">Wanderly</span>
    </a>
   
    <a data-editable="true" href="javascript:void(0);" class="btn btn--primary btn--sm">Book Now →</a>
  </div>
</header>

<!-- HERO -->
<section class="hero">
  <div data-editable-bg="true" class="hero__bg" style="background-image:url('/assets/templates/travel/templates01/hero.jpg')"></div>
  <div class="hero__overlay"></div>

  <!-- Floating decorative badges -->
  <div class="float-badge float-badge--1"><span data-editable="true" class="dot"></span> 12 booked in last hour</div>
  <div class="float-badge float-badge--2">⭐ 4.9 / 5 — 12,480 reviews</div>
  <div class="float-badge float-badge--3">🔒 100% Secure Booking</div>

  <div class="container hero__content">
    <span data-editable="true" class="eyebrow eyebrow--light">✦ Est. 2014 · Luxury Travel Curators</span>
    <h1 data-editable="true" class="hero__title">The world is <em>waiting.</em><br/>Let's go beautifully.</h1>
    <p data-editable="true" class="hero__sub">Handcrafted luxury tours to 120+ destinations. Private guides, five-star stays, and moments that stay with you forever — all wrapped in one seamless booking.</p>

    <form class="book-form" id="book" onsubmit="return handleBooking(event)">
      <div class="book-form__field">
        <label>📍 Destination</label>
        <select required>
          <option value="">Choose a place</option>
          <option>Maldives</option><option>Bali, Indonesia</option>
          <option>Santorini, Greece</option><option>Dubai, UAE</option>
          <option>Switzerland</option><option>Japan</option>
          <option>Iceland</option><option>Kenya Safari</option>
        </select>
      </div>
      <div class="book-form__field">
        <label>📅 Check In</label>
        <input type="date" required />
      </div>
      <div class="book-form__field">
        <label>👥 Travelers</label>
        <select required>
          <option>1 Person</option><option>2 People</option>
          <option>3 People</option><option>4+ People</option>
        </select>
      </div>
      <button data-editable="true" type="submit" class="btn btn--primary">Search Tours</button>
    </form>

    <div class="hero__stats">
      <div><strong data-editable="true" data-count="50000">50k+</strong><span data-editable="true">Happy Travelers</span></div>
      <div><strong data-editable="true" data-count="120">120+</strong><span data-editable="true">Destinations</span></div>
      <div><strong data-editable="true" data-count="15">15+</strong><span data-editable="true">Years Experience</span></div>
      <div><strong data-editable="true" data-count="98">98%</strong><span data-editable="true">% Rebook Rate</span></div>
    </div>
  </div>

  <a data-editable="true" href="javascript:void(0);" class="scroll-hint">Scroll<span data-editable="true"></span></a>
</section>

<!-- TRUST -->
<section class="trust" id="trust">
  <div class="container">
    <p data-editable="true">As featured in</p>
    <div class="trust__logos">
      <span data-editable="true">CONDÉ NAST</span><span data-editable="true">LONELY PLANET</span><span data-editable="true">NAT GEO</span>
      <span data-editable="true">FORBES</span><span data-editable="true">TRAVEL+LEISURE</span><span data-editable="true">BBC TRAVEL</span>
    </div>
  </div>
</section>

<!-- 1. INTRO / VALUE -->
<section class="section" id="intro">
  <div class="container two-col">
    <div data-reveal>
      <span data-editable="true" class="eyebrow">Our Philosophy</span>
      <h2 data-editable="true" class="h-lg">Travel, but make it <em>unforgettable.</em></h2>
      <p data-editable="true" class="lead">We don't sell trips. We craft slow, meaningful, once-in-a-lifetime journeys — the kind you'll still be talking about ten years later. From the moment you inquire to the day you return home, every detail is thought of.</p>
      <div class="pill-row">
        <span data-editable="true" class="pill">✓ No cookie-cutter tours</span>
        <span data-editable="true" class="pill">✓ Real local experts</span>
        <span data-editable="true" class="pill">✓ Bespoke itineraries</span>
        <span data-editable="true" class="pill">✓ 24/7 concierge</span>
      </div>
    </div>
    <div class="stat-grid" data-reveal>
      <div class="stat-tile"><strong data-editable="true">50k+</strong><span data-editable="true">Travelers served since 2014</span></div>
      <div class="stat-tile stat-tile--dark"><strong data-editable="true">4.9★</strong><span data-editable="true">Average client rating</span></div>
      <div class="stat-tile stat-tile--dark"><strong data-editable="true">120+</strong><span data-editable="true">Countries & regions</span></div>
      <div class="stat-tile"><strong data-editable="true">72h</strong><span data-editable="true">Avg. custom itinerary turnaround</span></div>
    </div>
  </div>
</section>

<!-- 2. DESTINATIONS -->
<section class="section section--alt" id="destinations">
  <div class="container">
    <div class="section__head">
      <span data-editable="true" class="eyebrow">Popular Destinations</span>
      <h2 data-editable="true" class="h-lg">Escape to <em>paradise.</em></h2>
      <p data-editable="true">Curated experiences at the world's most breathtaking locations — from turquoise atolls to alpine peaks.</p>
    </div>
    <div class="dest-grid">
      <article class="dest-card" data-reveal>
        <div class="dest-card__img"><img data-editable-img="true" src="/assets/templates/travel/templates01/santorini.jpg" alt="Santorini" loading="lazy"/><span data-editable="true" class="dest-card__save">♡</span></div>
        <div class="dest-card__body">
          <div class="dest-card__meta"><span data-editable="true" class="tag">Greece</span><span data-editable="true" class="rating">★ 4.9</span></div>
          <h3 data-editable="true">Santorini Escape</h3>
          <p data-editable="true">Cliff-side villas, sunset caldera cruise, wine tasting in ancient vineyards.</p>
          <div class="dest-card__foot"><div><small>From</small><strong data-editable="true">$1,299</strong></div><a data-editable="true" href="javascript:void(0);" class="link-arrow">Book →</a></div>
        </div>
      </article>
      <article class="dest-card" data-reveal>
        <div class="dest-card__img"><img data-editable-img="true" src="/assets/templates/travel/templates01/d1.jpg" alt="Bali" loading="lazy"/><span data-editable="true" class="dest-card__save">♡</span></div>
        <div class="dest-card__body">
          <div class="dest-card__meta"><span data-editable="true" class="tag">Indonesia</span><span data-editable="true" class="rating">★ 4.8</span></div>
          <h3 data-editable="true">Bali Serenity</h3>
          <p data-editable="true">Ubud rice terraces, temple hopping, private beach club days & spa rituals.</p>
          <div class="dest-card__foot"><div><small>From</small><strong data-editable="true">$899</strong></div><a data-editable="true" href="javascript:void(0);" class="link-arrow">Book →</a></div>
        </div>
      </article>
      <article class="dest-card" data-reveal>
        <div class="dest-card__img"><img data-editable-img="true" src="/assets/templates/travel/templates01/d2.jpg" alt="Dubai" loading="lazy"/><span data-editable="true" class="dest-card__save">♡</span></div>
        <div class="dest-card__body">
          <div class="dest-card__meta"><span data-editable="true" class="tag">UAE</span><span data-editable="true" class="rating">★ 4.9</span></div>
          <h3 data-editable="true">Dubai Luxury</h3>
          <p data-editable="true">Burj Al Arab stays, desert dune safaris, yacht marina evenings.</p>
          <div class="dest-card__foot"><div><small>From</small><strong data-editable="true">$1,099</strong></div><a data-editable="true" href="javascript:void(0);" class="link-arrow">Book →</a></div>
        </div>
      </article>
      <article class="dest-card" data-reveal>
        <div class="dest-card__img"><img data-editable-img="true" src="/assets/templates/travel/templates01/d3.jpg" alt="Swiss Alps" loading="lazy"/><span data-editable="true" class="dest-card__save">♡</span></div>
        <div class="dest-card__body">
          <div class="dest-card__meta"><span data-editable="true" class="tag">Switzerland</span><span data-editable="true" class="rating">★ 5.0</span></div>
          <h3 data-editable="true">Swiss Alps Retreat</h3>
          <p data-editable="true">Glacier trains, chalet stays, Lucerne lake mornings, chocolate ateliers.</p>
          <div class="dest-card__foot"><div><small>From</small><strong data-editable="true">$1,899</strong></div><a data-editable="true" href="javascript:void(0);" class="link-arrow">Book →</a></div>
        </div>
      </article>
    </div>
    <div class="center-btn"><a data-editable="true" href="javascript:void(0);" class="btn btn--outline">Explore all 120+ destinations →</a></div>
  </div>
</section>

<!-- 3. WHY US -->
<section class="section" id="why">
  <div class="container">
    <div class="section__head">
      <span data-editable="true" class="eyebrow">Why Wanderly</span>
      <h2 data-editable="true" class="h-lg">Travel <em>without limits.</em></h2>
      <p data-editable="true">Six promises we've kept for a decade — and won't stop keeping.</p>
    </div>
    <div class="why-grid">
      <div class="why-card" data-reveal><div class="why-card__icon">🏆</div><h3 data-editable="true">Best Price Guarantee</h3><p data-editable="true">Find it cheaper anywhere else? We match it and refund 110% of the difference. No fine print.</p></div>
      <div class="why-card" data-reveal><div class="why-card__icon">🛡️</div><h3 data-editable="true">Flexible Cancellation</h3><p data-editable="true">Plans change. Cancel free up to 48 hours before departure, no questions asked.</p></div>
      <div class="why-card" data-reveal><div class="why-card__icon">🌍</div><h3 data-editable="true">Real Local Guides</h3><p data-editable="true">Vetted native experts who turn tourist trips into real, textured experiences.</p></div>
      <div class="why-card" data-reveal><div class="why-card__icon">💬</div><h3 data-editable="true">24/7 Human Support</h3><p data-editable="true">Real people, real quick, wherever you are on the map. Never a chatbot maze.</p></div>
      <div class="why-card" data-reveal><div class="why-card__icon">✨</div><h3 data-editable="true">Bespoke Itineraries</h3><p data-editable="true">No copy-paste tours. Every itinerary is designed around your pace, taste and budget.</p></div>
      <div class="why-card" data-reveal><div class="why-card__icon">💳</div><h3 data-editable="true">Book in 3 Instalments</h3><p data-editable="true">Split your trip cost into three interest-free payments. Travel now, breathe easy.</p></div>
    </div>
  </div>
</section>

<!-- 4. PROCESS -->
<section class="section section--dark" id="process">
  <div class="container">
    <div class="section__head section__head--light">
      <span data-editable="true" class="eyebrow eyebrow--gold">How it works</span>
      <h2 data-editable="true" class="h-lg">From dream to <em>departure</em> in 4 steps.</h2>
    </div>
    <div class="steps">
      <div class="step" data-reveal>
        <span data-editable="true" class="step__num">01</span>
        <h3 data-editable="true">Tell us your dream</h3>
        <p data-editable="true">A 2-minute quiz about your style, budget and vibe. That's all we need.</p>
      </div>
      <div class="step" data-reveal>
        <span data-editable="true" class="step__num">02</span>
        <h3 data-editable="true">Get a bespoke plan</h3>
        <p data-editable="true">Within 72 hours, a personal itinerary lands in your inbox — refined, priced, ready.</p>
      </div>
      <div class="step" data-reveal>
        <span data-editable="true" class="step__num">03</span>
        <h3 data-editable="true">Refine & confirm</h3>
        <p data-editable="true">Tweak anything. Add a hot-air balloon. Swap a hotel. We iterate until it's perfect.</p>
      </div>
      <div class="step" data-reveal>
        <span data-editable="true" class="step__num">04</span>
        <h3 data-editable="true">Travel worry-free</h3>
        <p data-editable="true">Concierge on call, everything pre-booked. You just show up and be amazed.</p>
      </div>
    </div>
  </div>
</section>

<!-- 5. PACKAGES -->
<section class="section" id="packages">
  <div class="container">
    <div class="section__head">
      <span data-editable="true" class="eyebrow">Exclusive Packages</span>
      <h2 data-editable="true" class="h-lg">Limited-time <em>offers.</em></h2>
      <p data-editable="true">Curated bundles at prices you'll rarely see again.</p>
    </div>
    <div class="offers">
      <div class="offer" data-reveal>
        <h3 data-editable="true">Asian Adventure</h3>
        <p data-editable="true">Thailand, Vietnam & Cambodia — culture, cuisine, temples & beaches.</p>
        <ul><li data-editable="true">✓ 10 Days across 3 countries</li><li data-editable="true">✓ Domestic flights included</li><li data-editable="true">✓ Food tours & cooking class</li><li data-editable="true">✓ Bespoke itinerary</li></ul>
        <div class="offer__price"><del>$2,599</del><strong data-editable="true">$1,499</strong><span data-editable="true">/person</span></div>
        <a data-editable="true" href="javascript:void(0);" class="btn btn--outline btn--block">Book Now</a>
      </div>
      <div class="offer offer--featured" data-reveal>
        <span data-editable="true" class="offer__badge">★ Most Popular</span>
        <h3 data-editable="true">Maldives Honeymoon</h3>
        <p data-editable="true">Overwater villa, private beach dinner, sunset cruise & couples spa.</p>
        <ul><li data-editable="true">✓ 7 Nights luxury villa</li><li data-editable="true">✓ All meals included</li><li data-editable="true">✓ Seaplane transfers</li><li data-editable="true">✓ Water sports & excursions</li></ul>
        <div class="offer__price"><del>$3,499</del><strong data-editable="true">$1,999</strong><span data-editable="true">/couple</span></div>
        <a data-editable="true" href="javascript:void(0);" class="btn btn--gold btn--block">Reserve This Deal</a>
        <small class="offer__urgency">⚡ 4 slots left this month</small>
      </div>
      <div class="offer" data-reveal>
        <h3 data-editable="true">European Grand Tour</h3>
        <p data-editable="true">Paris, Rome, Barcelona, Amsterdam in 12 unforgettable days.</p>
        <ul><li data-editable="true">✓ First-class train travel</li><li data-editable="true">✓ 4★ boutique hotels</li><li data-editable="true">✓ Skip-the-line access</li><li data-editable="true">✓ Private city guides</li></ul>
        <div class="offer__price"><del>$4,299</del><strong data-editable="true">$2,799</strong><span data-editable="true">/person</span></div>
        <a data-editable="true" href="javascript:void(0);" class="btn btn--outline btn--block">Book Now</a>
      </div>
    </div>
  </div>
</section>

<!-- 6. INCLUSIONS -->
<section class="section section--alt">
  <div class="container">
    <div class="section__head">
      <span data-editable="true" class="eyebrow">Everything Included</span>
      <h2 data-editable="true" class="h-lg">What's <em>in the box.</em></h2>
      <p data-editable="true">Zero hidden fees. Zero surprises. Just travel.</p>
    </div>
    <div class="incl-grid">
      <div class="incl" data-reveal><span data-editable="true">✈</span><h4 data-editable="true">Flights</h4><p data-editable="true">Round-trip business or economy — you choose.</p></div>
      <div class="incl" data-reveal><span data-editable="true">🏨</span><h4 data-editable="true">5★ Hotels</h4><p data-editable="true">Handpicked, personally inspected properties.</p></div>
      <div class="incl" data-reveal><span data-editable="true">🚙</span><h4 data-editable="true">Transfers</h4><p data-editable="true">Private airport & city transfers, always.</p></div>
      <div class="incl" data-reveal><span data-editable="true">🍽️</span><h4 data-editable="true">Meals</h4><p data-editable="true">Breakfast daily, plus curated dining nights.</p></div>
      <div class="incl" data-reveal><span data-editable="true">🎫</span><h4 data-editable="true">Activities</h4><p data-editable="true">Skip-the-line tickets to must-see wonders.</p></div>
      <div class="incl" data-reveal><span data-editable="true">🧭</span><h4 data-editable="true">Local Guides</h4><p data-editable="true">Multilingual, licensed, absolutely charming.</p></div>
      <div class="incl" data-reveal><span data-editable="true">📱</span><h4 data-editable="true">eSIM Data</h4><p data-editable="true">Stay connected in 190+ countries.</p></div>
      <div class="incl" data-reveal><span data-editable="true">🛡️</span><h4 data-editable="true">Insurance</h4><p data-editable="true">Comprehensive travel coverage included.</p></div>
    </div>
  </div>
</section>

<!-- 7. REVIEWS -->
<section class="section" id="reviews">
  <div class="container">
    <div class="section__head">
      <span data-editable="true" class="eyebrow">What Travelers Say</span>
      <h2 data-editable="true" class="h-lg">Loved by <em>50,000+ explorers.</em></h2>
      <div class="rating-row">
        <div class="big-rating"><strong data-editable="true">4.9</strong><span data-editable="true">★★★★★</span><small>Based on 12,480 verified reviews</small></div>
      </div>
    </div>
    <div class="reviews">
      <blockquote data-reveal>
        <div class="stars">★★★★★</div>
        <p data-editable="true">"The Maldives trip was flawless. Every detail was thought of. Wanderly turned our anniversary into the memory of a lifetime — genuinely couldn't recommend more."</p>
        <footer><div class="avatar">SD</div><div><strong data-editable="true">Sarah &amp; David</strong><span data-editable="true">Maldives Honeymoon · UK</span></div></footer>
      </blockquote>
      <blockquote data-reveal>
        <div class="stars">★★★★★</div>
        <p data-editable="true">"Best travel agency I've ever booked with, hands down. Our local guide in Bali was pure gold — took us places no tour would ever go. Booking trip #2 already."</p>
        <footer><div class="avatar">PM</div><div><strong data-editable="true">Priya M.</strong><span data-editable="true">Bali Explorer · India</span></div></footer>
      </blockquote>
      <blockquote data-reveal>
        <div class="stars">★★★★★</div>
        <p data-editable="true">"Effortless from booking to boarding. The Swiss Alps package was priced perfectly and every promise on the itinerary was delivered five-star. This is how travel should feel."</p>
        <footer><div class="avatar">JO</div><div><strong data-editable="true">James O.</strong><span data-editable="true">Swiss Escape · Australia</span></div></footer>
      </blockquote>
      <blockquote data-reveal>
        <div class="stars">★★★★★</div>
        <p data-editable="true">"I was skeptical about paying more for a 'curated' experience. One trip in, I get it. The difference is everything — from the driver who remembered our names to the surprise anniversary cake."</p>
        <footer><div class="avatar">AN</div><div><strong data-editable="true">Aisha N.</strong><span data-editable="true">Dubai Getaway · Nigeria</span></div></footer>
      </blockquote>
    </div>
  </div>
</section>

<!-- 8. COMPARISON -->
<section class="section section--alt">
  <div class="container">
    <div class="section__head">
      <span data-editable="true" class="eyebrow">Wanderly vs. Everyone Else</span>
      <h2 data-editable="true" class="h-lg">The <em>obvious</em> choice.</h2>
    </div>
    <div class="compare" data-reveal>
      <div class="compare__row compare__row--head">
        <div>Feature</div><div class="cell-us">Wanderly</div><div>Others</div>
      </div>
      <div class="compare__row"><div>Best Price Guarantee</div><div class="cell-us">✓ 110% refund</div><div>✗</div></div>
      <div class="compare__row"><div>Truly Bespoke Itineraries</div><div class="cell-us">✓ 100% custom</div><div>Template-based</div></div>
      <div class="compare__row"><div>Human 24/7 Support</div><div class="cell-us">✓ Always</div><div>Chatbots + hours</div></div>
      <div class="compare__row"><div>Free Cancellation (48h)</div><div class="cell-us">✓</div><div>Sometimes</div></div>
      <div class="compare__row"><div>Local Expert Guides</div><div class="cell-us">✓ Vetted natives</div><div>Freelancer roulette</div></div>
      <div class="compare__row"><div>Interest-free Instalments</div><div class="cell-us">✓ 3 payments</div><div>✗</div></div>
      <div class="compare__row"><div>Hidden Fees</div><div class="cell-us">✗ Zero</div><div>Frequent</div></div>
    </div>
  </div>
</section>

<!-- 9. FAQ -->
<section class="section" id="faq">
  <div class="container">
    <div class="section__head">
      <span data-editable="true" class="eyebrow">FAQ</span>
      <h2 data-editable="true" class="h-lg">Everything you're <em>wondering.</em></h2>
    </div>
    <div class="faq" data-reveal>
      <details class="faq__item" open>
        <summary>How far in advance should I book?<span data-editable="true" class="faq__i">+</span></summary>
        <p data-editable="true">For peak-season trips (Dec–Jan, Jul–Aug), 3–4 months is ideal. For off-peak or shoulder seasons, 4–6 weeks gives us plenty of room to craft something special.</p>
      </details>
      <details class="faq__item">
        <summary>Can I customize an existing package?<span data-editable="true" class="faq__i">+</span></summary>
        <p data-editable="true">Yes — every package is a starting point. Extend nights, swap hotels, add experiences. Your travel designer refines it until it's exactly right.</p>
      </details>
      <details class="faq__item">
        <summary>What's your cancellation policy?<span data-editable="true" class="faq__i">+</span></summary>
        <p data-editable="true">Free cancellation up to 48 hours before departure on most bookings. Some third-party inclusions (flights, event tickets) have their own terms — we're upfront about them at booking.</p>
      </details>
      <details class="faq__item">
        <summary>Do you handle visas & documentation?<span data-editable="true" class="faq__i">+</span></summary>
        <p data-editable="true">We provide detailed visa guidance for every destination. For premium packages, our concierge team can process visa applications on your behalf.</p>
      </details>
      <details class="faq__item">
        <summary>Can I pay in instalments?<span data-editable="true" class="faq__i">+</span></summary>
        <p data-editable="true">Absolutely — split any booking over $999 into 3 interest-free payments. No credit checks, no gotchas.</p>
      </details>
      <details class="faq__item">
        <summary>What if something goes wrong during my trip?<span data-editable="true" class="faq__i">+</span></summary>
        <p data-editable="true">Our 24/7 concierge is one WhatsApp message away, wherever you are. Average response time: under 4 minutes.</p>
      </details>
    </div>
  </div>
</section>

<!-- 10. NEWSLETTER -->
<section class="section section--alt">
  <div class="container">
    <div class="newsletter" data-reveal>
      <div>
        <span data-editable="true" class="eyebrow">Weekly Wanderlust</span>
        <h2 data-editable="true" class="h-md">Get <em>secret deals</em> before anyone else.</h2>
        <p data-editable="true">Join 32,000+ travelers who get our best packages, hidden-gem destinations and travel wisdom — every Sunday. No spam, unsubscribe anytime.</p>
      </div>
      <form class="news-form" onsubmit="return handleNews(event)">
        <input type="email" placeholder="you@wonderful.com" required />
        <button data-editable="true" class="btn btn--primary" type="submit">Subscribe →</button>
        <small>🔒 We'll never share your email. Ever.</small>
      </form>
    </div>
  </div>
</section>

<!-- CTA -->
<section class="cta">
  <div class="container cta__inner">
    <span data-editable="true" class="eyebrow eyebrow--gold">Your Next Adventure Awaits</span>
    <h2 data-editable="true" class="h-lg">Let's <em>go beautifully.</em></h2>
    <p data-editable="true">Book today and save up to 45%. Limited seats available for summer 2026.</p>
    <div class="cta__actions">
      <a data-editable="true" href="javascript:void(0);" class="btn btn--gold btn--lg">Get My Free Quote</a>
      <a data-editable="true" href="tel:+15550102026" class="btn btn--ghost btn--lg">📞 Call +1 (555) 010-2026</a>
    </div>
  </div>
</section>

<!-- FOOTER -->
<footer class="footer">
  <div class="container footer__inner">
    <div class="footer__brand">
      <a data-editable="true" href="javascript:void(0);" class="brand"><span data-editable="true" class="brand__mark">✦</span><span data-editable="true" class="brand__text">Wanderly</span></a>
      <p data-editable="true" class="footer__desc">Premium travel, thoughtfully designed. Explore more, worry less. Since 2014.</p>
      <div class="socials">
        <a data-editable="true" href="javascript:void(0);" aria-label="Instagram">Ig</a>
        <a data-editable="true" href="javascript:void(0);" aria-label="Facebook">Fb</a>
        <a data-editable="true" href="javascript:void(0);" aria-label="YouTube">Yt</a>
        <a data-editable="true" href="javascript:void(0);" aria-label="TikTok">Tk</a>
      </div>
    </div>
    <div>
      <h4 data-editable="true">Company</h4>
      <a data-editable="true" href="javascript:void(0);">About Us</a><a data-editable="true" href="javascript:void(0);">Careers</a><a data-editable="true" href="javascript:void(0);">Press</a><a data-editable="true" href="javascript:void(0);">Blog</a>
    </div>
    <div>
      <h4 data-editable="true">Support</h4>
      <a data-editable="true" href="javascript:void(0);">Contact</a><a data-editable="true" href="javascript:void(0);">Help Center</a><a data-editable="true" href="javascript:void(0);">Cancellation</a><a data-editable="true" href="javascript:void(0);">Terms</a>
    </div>
    <div>
      <h4 data-editable="true">Contact</h4>
      <p data-editable="true">hello@wanderly.com</p>
      <p data-editable="true">+1 (555) 010-2026</p>
      <p data-editable="true">Mon–Sun · 24/7</p>
    </div>
  </div>
  <div class="footer__bottom"><div class="container">© 2026 PROJECT_NAME_PLACEHOLDER. · Crafted with ❤ for wanderers everywhere.</div></div>
</footer>

<!-- Back to top -->
<button data-editable="true" class="to-top" id="toTop" aria-label="Back to top">↑</button>

<!-- Toast -->



<svg style="display:none" onload="(function(){
  const nav = document.getElementById('nav');
  const toTop = document.getElementById('toTop');
  if (!nav || !toTop) return;

  const onScroll = () => {
    const s = window.scrollY;
    nav.classList.toggle('scrolled', s > 40);
    toTop.classList.toggle('show', s > 200);
  };
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }});
  }, {threshold:0.12});
  document.querySelectorAll('[data-reveal]').forEach(el => io.observe(el));

  const counters = document.querySelectorAll('[data-count]');
  const cio = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if(!e.isIntersecting) return;
      const el = e.target;
      const target = +el.dataset.count;
      const dur = 1600;
      const start = performance.now();
      const step = (now) => {
        const p = Math.min((now - start)/dur, 1);
        const val = Math.floor(target * (1 - Math.pow(1-p, 3)));
        el.textContent = val >= 1000 ? (val/1000).toFixed(val>=10000?0:1)+'k+' : (target < 100 ? val : val+'+');
        if(p < 1) requestAnimationFrame(step); else {
          el.textContent = target >= 1000 ? Math.floor(target/1000)+'k+' : target+(target<100?'':'+');
        }
      };
      requestAnimationFrame(step);
      cio.unobserve(el);
    });
  }, {threshold:0.5});
  counters.forEach(c => cio.observe(c));

  document.querySelectorAll('a[href^=\\'#\\']').forEach(a => {
    a.addEventListener('click', function(e){
      const id = this.getAttribute('href');
      if(id.length > 1){
        const t = document.querySelector(id);
        if(t){ e.preventDefault(); window.scrollTo({top: t.offsetTop - 80, behavior:'smooth'}); }
      }
    });
  });

  toTop.addEventListener('click', () => window.scrollTo({top:0,behavior:'smooth'}));

  const dateInput = document.querySelector('input[type=date]');
  if(dateInput){
    const d = new Date(); d.setDate(d.getDate()+7);
    dateInput.value = d.toISOString().split('T')[0];
    dateInput.min = new Date().toISOString().split('T')[0];
  }

  window.showToast = function(msg){
    const t = document.getElementById('toast');
    if(!t) return;
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(window.__tt);
    window.__tt = setTimeout(()=>t.classList.remove('show'), 3600);
  };

  document.querySelectorAll('.dest-card__save').forEach(h => {
    h.addEventListener('click', function(e){
      e.stopPropagation();
      this.textContent = this.textContent === '♡' ? '♥' : '♡';
      window.showToast(this.textContent === '♥' ? '❤ Saved to your wishlist' : 'Removed from wishlist');
    });
  });

  document.querySelectorAll('.faq__item').forEach(item => {
    item.addEventListener('toggle', () => {
      if(item.open){
        document.querySelectorAll('.faq__item').forEach(o => { if(o !== item) o.open = false; });
      }
    });
  });

  document.querySelectorAll('.faq__item summary').forEach(summary => {
    summary.addEventListener('click', function(e) {
      if (document.querySelector('[data-gjs-type]') || document.body.classList.contains('gjs-dashed')) {
        e.preventDefault();
        const details = this.parentElement;
        const isOpen = details.hasAttribute('open');
        
        document.querySelectorAll('.faq__item').forEach(item => {
          if (item !== details) item.removeAttribute('open');
        });
        
        if (isOpen) details.removeAttribute('open');
        else details.setAttribute('open', '');
      }
    });
  });

  window.handleBooking = function(e){
    e.preventDefault();
    const form = e.target;
    const select = form.querySelector('select');
    const dest = select ? select.value : '';
    const destText = dest ? ' ' + dest : '';
    window.showToast('✓ Great choice! We will email your' + destText + ' deals within 15 minutes.');
    form.reset();
    const d = new Date(); d.setDate(d.getDate()+7);
    const dateInput = form.querySelector('input[type=date]');
    if(dateInput) dateInput.value = d.toISOString().split('T')[0];
    return false;
  };

  window.handleNews = function(e){
    e.preventDefault();
    window.showToast('✓ Subscribed! Check your inbox for a welcome gift 🎁');
    e.target.reset();
    return false;
  };

})()"></svg>

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
      }
    }, true);
  })();
</script>
`;
