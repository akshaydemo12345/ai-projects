// Auto-generated ULTRA-DYNAMIC template — education templates01
// Generated: 2026-05-14T06:57:40.334Z
// ════════════════════════════════════════════════════════════════════════════
// This template was auto-converted with full preservation of:
// ✓ Animations & Keyframes
// ✓ Transitions & Transforms
// ✓ All original styling
// ✓ Google Fonts & CDN resources
// ✓ Images & Assets
// ════════════════════════════════════════════════════════════════════════════

export const Education01Styles = `
/* ════════════════════════════════════════ */
/* Source: css/style.css */
/* ════════════════════════════════════════ */
/* ============ DESIGN TOKENS ============ */
:root{
  --navy: var(--primary);
  --bg: #fbfaf6;
  --text: var(--primary);
  --muted: #6b7568;
  --line: rgba(var(--primary-rgb),.08);
  --shadow-sm: 0 4px 12px rgba(var(--primary-rgb),.06);
  --shadow-glow: 0 10px 20px -5px rgba(var(--secondary-rgb),.4);
  --radius: 16px;
}
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{
  font-family:'Inter',system-ui,sans-serif;
  background:var(--bg);
  color:var(--text);
  line-height:1.6;
  -webkit-font-smoothing:antialiased;
  overflow-x:hidden;
}
h1,h2,h3,h4,h5{font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;line-height:1.2;color:var(--navy)}
a{color:inherit;text-decoration:none}
img{max-width:100%;display:block}
.container{max-width:1240px;margin:0 auto;padding:0 24px}

/* ============ BUTTONS ============ */
.btn{
  display:inline-flex;align-items:center;gap:8px;
  padding:14px 28px;border-radius:999px;font-weight:600;font-size:15px;
  cursor:pointer;border:none;transition:all .3s cubic-bezier(.4,0,.2,1);
  font-family:inherit;
}
.btn-primary{background:var(--secondary);color:#fff;box-shadow:var(--shadow-glow)}
.btn-primary:hover{background:var(--primary);transform:translateY(-2px);box-shadow:0 15px 30px -5px rgba(PRIMARY_RGB_PLACEHOLDER,.5)}
.btn-secondary{background:rgba(255,255,255,.9);color:var(--navy);border:1.5px solid var(--line)}
.btn-secondary:hover{background:#fff;border-color:var(--primary);transform:translateY(-2px)}
.btn-dark{background:var(--navy);color:#fff}
.btn-dark:hover{opacity:0.9;transform:translateY(-2px)}
.icon-svg{width:1em;height:1em;display:inline-block;vertical-align:-.125em;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}

/* ============ TOP BAR ============ */
.topbar{
  background:var(--grad-dark);color:#cbd5e1;font-size:13px;
  padding:10px 0;
}
.topbar .row{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px}
.topbar a{color:#cbd5e1;transition:color .2s}
.topbar a:hover{color:#fff}
.topbar .info span{margin-right:18px}
.topbar .socials a{margin-left:14px;opacity:.8}
.topbar .socials a:hover{opacity:1}

/* ============ HEADER ============ */
.header{
  position:sticky;top:0;z-index:50;
  background:rgba(251,250,246,.8);
  backdrop-filter:blur(20px) saturate(180%);
  -webkit-backdrop-filter:blur(20px) saturate(180%);
  border-bottom:1px solid var(--line);
  transition:all .3s;
}
.header .inner{display:flex;align-items:center;justify-content:space-between;padding:18px 0}
.logo{display:flex;align-items:center;gap:10px;font-family:'Plus Jakarta Sans';font-weight:800;font-size:22px;color:var(--navy)}
.logo-mark{
  width:36px;height:36px;border-radius:10px;
  background:var(--primary);
  display:grid;place-items:center;color:#fff;font-weight:800;
  box-shadow:0 6px 12px rgba(PRIMARY_RGB_PLACEHOLDER,.3);
}
.nav{display:flex;gap:32px}
.nav a{font-weight:500;color:#334155;font-size:15px;position:relative;transition:color .2s}
.nav a::after{content:'';position:absolute;left:0;bottom:-4px;width:0;height:2px;background:var(--primary);transition:width .3s}
.nav a:hover{color:var(--navy)}
.nav a:hover::after{width:100%}
.menu-toggle{display:none;background:none;border:none;font-size:24px;cursor:pointer}

/* ============ HERO ============ */
.hero{
  position:relative;padding:90px 0 120px;overflow:hidden;
  background:
    radial-gradient(circle at 15% 20%,rgba(139,92,246,.12),transparent 40%),
    radial-gradient(circle at 85% 80%,rgba(20,184,166,.12),transparent 40%),
    var(--bg);
}
.blob{position:absolute;border-radius:50%;filter:blur(80px);opacity:.5;z-index:0;pointer-events:none}
.blob-1{width:400px;height:400px;background:rgba(PRIMARY_RGB_PLACEHOLDER,.1);top:-100px;left:-100px}
.blob-2{width:350px;height:350px;background:rgba(SECONDARY_RGB_PLACEHOLDER,.1);bottom:-80px;right:-80px}
.hero .grid{display:grid;grid-template-columns:1.05fr 1fr;gap:64px;align-items:center;position:relative;z-index:1}
.tagline{
  display:inline-flex;align-items:center;gap:8px;
  padding:8px 16px;border-radius:999px;
  background:rgba(SECONDARY_RGB_PLACEHOLDER,.12);color:var(--orange);
  font-size:13px;font-weight:700;margin-bottom:24px;
  border:1px solid rgba(SECONDARY_RGB_PLACEHOLDER,.25);
}
.tagline .dot{width:6px;height:6px;border-radius:50%;background:var(--orange);box-shadow:0 0 10px var(--orange)}
.hero h1{font-size:64px;letter-spacing:-1.5px;margin-bottom:24px}
.hero h1 .accent{color:var(--secondary)}
.hero p.lead{font-size:18px;color:var(--muted);margin-bottom:36px;max-width:520px}
.hero-cta{display:flex;gap:16px;flex-wrap:wrap}
.hero-visual{position:relative}
.hero-img-wrap{
  position:relative;border-radius:var(--radius-lg);overflow:hidden;
  box-shadow:var(--shadow-lg);
  background:var(--primary);padding:8px;
}
.hero-img-wrap img{border-radius:20px;width:100%;height:520px;object-fit:cover}
.float-card{
  position:absolute;background:rgba(255,255,255,.85);backdrop-filter:blur(16px);
  padding:16px 20px;border-radius:16px;box-shadow:var(--shadow-md);
  display:flex;align-items:center;gap:12px;border:1px solid rgba(255,255,255,.6);
  animation:float 4s ease-in-out infinite;
}
.float-card .ic{width:40px;height:40px;border-radius:12px;background:var(--secondary);display:grid;place-items:center;color:#fff;font-weight:700}
.float-card .lbl{font-size:12px;color:var(--muted)}
.float-card .val{font-weight:700;color:var(--navy)}
.fc-1{top:30px;left:-30px;animation-delay:0s}
.fc-2{bottom:40px;right:-20px;animation-delay:1.5s}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}

/* ============ HIGHLIGHTS ============ */
.highlights{margin-top:-70px;position:relative;z-index:5}
.hl-card{
  background:rgba(255,255,255,.75);backdrop-filter:blur(20px);
  border:1px solid rgba(255,255,255,.8);
  border-radius:var(--radius-lg);
  box-shadow:var(--shadow-lg);
  padding:40px;display:grid;grid-template-columns:1.2fr repeat(4,1fr);gap:32px;align-items:center;
}
.hl-intro h3{font-size:22px;margin-bottom:8px}
.hl-intro p{color:var(--muted);font-size:14px}
.hl-item{text-align:center;padding:16px;border-radius:var(--radius-sm);transition:all .3s}
.hl-item:hover{background:rgba(99,102,241,.06);transform:translateY(-4px)}
.hl-icon{
  width:60px;height:60px;border-radius:18px;margin:0 auto 14px;
  background:linear-gradient(135deg,rgba(SECONDARY_RGB_PLACEHOLDER,.18),rgba(11,51,36,.08));
  color:var(--navy);
  display:grid;place-items:center;font-size:26px;
  transition:all .35s;
}
.hl-item:hover .hl-icon{background:var(--secondary);color:#fff;transform:rotate(-6deg) scale(1.05)}
.hl-item h4{font-size:15px;margin-bottom:4px}
.hl-item p{font-size:12px;color:var(--muted)}

/* ============ SECTIONS ============ */
section{padding:100px 0}
.section-head{text-align:center;max-width:680px;margin:0 auto 56px}
.section-head .eyebrow{
  display:inline-block;padding:6px 14px;border-radius:999px;
  background:var(--secondary);color:#fff;font-size:12px;font-weight:600;
  letter-spacing:1px;text-transform:uppercase;margin-bottom:16px;
}
.section-head h2{font-size:44px;letter-spacing:-1px;margin-bottom:16px}
.section-head p{color:var(--muted);font-size:17px}

/* ============ ABOUT ============ */
.about .grid{display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center}
.about-img{
  position:relative;border-radius:var(--radius-lg);overflow:hidden;
  box-shadow:var(--shadow-lg);
}
.about-img img{width:100%;height:520px;object-fit:cover}
.about-img::after{
  content:'';position:absolute;inset:0;
  background:linear-gradient(180deg,transparent 50%,rgba(15,23,42,.3));
}
.about-badge{
  position:absolute;bottom:24px;left:24px;
  background:rgba(255,255,255,.95);backdrop-filter:blur(10px);
  padding:16px 20px;border-radius:16px;display:flex;gap:12px;align-items:center;
}
.about-badge .num{font-size:32px;font-weight:800;color:var(--secondary);font-family:'Plus Jakarta Sans'}
.about h2{font-size:42px;letter-spacing:-1px;margin-bottom:20px}
.about > .grid > div > p{color:var(--muted);font-size:17px;margin-bottom:28px}
.bullets{list-style:none;display:flex;flex-direction:column;gap:18px}
.bullets li{display:flex;gap:16px;align-items:flex-start}
.bullets .check{
  flex-shrink:0;width:36px;height:36px;border-radius:10px;
  background:var(--primary);color:#fff;display:grid;place-items:center;font-weight:700;
  box-shadow:0 6px 12px rgba(PRIMARY_RGB_PLACEHOLDER,.3);
}
.bullets h5{font-size:16px;margin-bottom:4px}
.bullets p{color:var(--muted);font-size:14px;margin:0}

/* ============ COURSES ============ */
.tabs{display:flex;justify-content:center;gap:10px;margin-bottom:48px;flex-wrap:wrap}
.tab{
  padding:10px 22px;border-radius:999px;background:#fff;border:1.5px solid var(--line);
  cursor:pointer;font-weight:600;font-size:14px;color:var(--navy);transition:all .25s;font-family:inherit;
}
.tab:hover{border-color:var(--orange);color:var(--orange)}
.tab.active{background:var(--secondary);color:#fff;border-color:transparent;box-shadow:0 8px 16px -4px rgba(SECONDARY_RGB_PLACEHOLDER,.3)}
.courses-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:32px}
.course{
  background:#fff;border-radius:var(--radius-lg);overflow:hidden;
  box-shadow:var(--shadow-sm);transition:all .4s, opacity .4s, transform .4s;position:relative;
  border:1px solid transparent;
}
.course.hidden{display:none}
.course::before{
  content:'';position:absolute;inset:0;border-radius:var(--radius-lg);padding:1.5px;
  background:var(--secondary);
  -webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);
  -webkit-mask-composite:xor;mask-composite:exclude;
  opacity:0;transition:opacity .3s;
}
.course:hover{transform:translateY(-10px);box-shadow:var(--shadow-lg)}
.course:hover::before{opacity:1}
.course-img{position:relative;height:220px;overflow:hidden}
.course-img img{width:100%;height:100%;object-fit:cover;transition:transform .6s}
.course:hover .course-img img{transform:scale(1.08)}
.course-cat{
  position:absolute;top:16px;left:16px;
  background:var(--secondary);padding:6px 14px;border-radius:999px;
  font-size:12px;font-weight:700;color:#fff;letter-spacing:.3px;
  box-shadow:0 6px 16px rgba(SECONDARY_RGB_PLACEHOLDER,.35);
}
.course-body{padding:24px}
.course-meta{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;font-size:13px;color:var(--muted)}
.stars{color:var(--orange);font-weight:700}
.course h4{font-size:18px;margin-bottom:8px;line-height:1.4}
.course .by{color:var(--muted);font-size:14px;margin-bottom:16px}
.course-foot{display:flex;justify-content:space-between;align-items:center;padding-top:16px;border-top:1px solid var(--line)}
.price{font-size:22px;font-weight:800;color:var(--orange);font-family:'Plus Jakarta Sans'}
.enroll{font-weight:700;font-size:14px;color:var(--navy);transition:gap .2s;display:inline-flex;align-items:center;gap:6px}
.enroll:hover{color:var(--orange);gap:10px}

/* ============ STATS ============ */
.stats{
  background:var(--navy);color:#fff;position:relative;overflow:hidden;
  border-radius:32px;margin:0 24px;
}
.stats::before{
  content:'';position:absolute;inset:0;
  background:
    radial-gradient(circle at 20% 30%,rgba(139,92,246,.3),transparent 40%),
    radial-gradient(circle at 80% 70%,rgba(20,184,166,.25),transparent 40%);
}
.stats .container{position:relative;z-index:1}
.stats .grid{display:grid;grid-template-columns:1fr 1.2fr;gap:64px;align-items:center}
.stats h2{color:#fff;font-size:42px;letter-spacing:-1px;margin-bottom:20px}
.stats p.lead{color:#cbd5e1;font-size:17px;margin-bottom:28px}
.stats-cards{display:grid;grid-template-columns:1fr 1fr;gap:20px}
.stat-card{
  background:rgba(255,255,255,.06);backdrop-filter:blur(20px);
  border:1px solid rgba(255,255,255,.12);
  border-radius:var(--radius);padding:32px;transition:all .3s;
}
.stat-card:hover{transform:translateY(-6px);background:rgba(255,255,255,.1)}
.stat-num{font-size:48px;font-weight:800;font-family:'Plus Jakarta Sans';
  background:linear-gradient(135deg,SECONDARY_COLOR_PLACEHOLDER,#fff5e1);-webkit-background-clip:text;background-clip:text;color:transparent;
  margin-bottom:8px;line-height:1;
}
.stat-lbl{color:#cbd5e1;font-size:15px}

/* ============ HOW ============ */
.how-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:24px}
.step{
  background:#fff;border-radius:var(--radius-lg);padding:36px 28px;
  box-shadow:var(--shadow-sm);transition:all .35s;position:relative;
  text-align:left;
}
.step:hover{transform:translateY(-8px);box-shadow:var(--shadow-md)}
.step-num{
  position:absolute;top:24px;right:28px;
  font-size:48px;font-weight:800;font-family:'Plus Jakarta Sans';
  color:transparent;-webkit-text-stroke:1.5px rgba(SECONDARY_RGB_PLACEHOLDER,.35);
  line-height:1;
}
.step-icon{
  width:64px;height:64px;border-radius:18px;
  background:var(--secondary);color:#fff;
  display:grid;place-items:center;font-size:26px;margin-bottom:24px;
  box-shadow:0 8px 16px -4px rgba(SECONDARY_RGB_PLACEHOLDER,.3);
  transition:transform .3s;
}
.step:hover .step-icon{transform:rotate(-8deg) scale(1.05)}
.step h4{font-size:19px;margin-bottom:10px}
.step p{color:var(--muted);font-size:14px}

/* ============ TESTIMONIAL ============ */
.testimonial{padding:60px 0}
.testi-card{
  background:var(--navy);
  border-radius:32px;padding:72px 56px;color:#fff;
  position:relative;overflow:hidden;
  box-shadow:0 30px 80px -20px rgba(PRIMARY_RGB_PLACEHOLDER,.4);
}
.testi-card::before{
  content:'';position:absolute;inset:0;
  background:
    radial-gradient(circle at 10% 20%,rgba(236,72,153,.25),transparent 40%),
    radial-gradient(circle at 90% 80%,rgba(20,184,166,.25),transparent 40%);
}
.testi-card::after{
  content:'"';position:absolute;top:20px;left:40px;
  font-size:200px;font-family:Georgia;color:rgba(255,255,255,.06);line-height:1;
}
.testi-inner{position:relative;z-index:1;text-align:center;max-width:780px;margin:0 auto}
.testi-inner blockquote{font-size:26px;font-weight:500;line-height:1.5;margin-bottom:36px;font-family:'Plus Jakarta Sans';color:#fff}
.testi-author{display:flex;align-items:center;justify-content:center;gap:16px}
.testi-author img{width:60px;height:60px;border-radius:50%;border:3px solid rgba(255,255,255,.2);object-fit:cover}
.testi-author .nm{text-align:left}
.testi-author .nm strong{display:block;font-size:16px;color:#fff}
.testi-author .nm span{font-size:13px;color:#cbd5e1}

/* ============ TEAM ============ */
.team-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:28px}
.member{
  position:relative;border-radius:var(--radius-lg);overflow:hidden;
  box-shadow:var(--shadow-sm);transition:all .4s;background:#fff;
}
.member:hover{transform:translateY(-8px);box-shadow:var(--shadow-lg)}
.member-img{height:320px;overflow:hidden;position:relative}
.member-img img{width:100%;height:100%;object-fit:cover;transition:transform .5s}
.member:hover .member-img img{transform:scale(1.08)}
.member-overlay{
  position:absolute;inset:0;
  background:linear-gradient(180deg,transparent 40%,rgba(15,23,42,.85));
  display:flex;align-items:flex-end;justify-content:center;padding:20px;
  opacity:0;transition:opacity .3s;
}
.member:hover .member-overlay{opacity:1}
.socials-row{display:flex;gap:12px}
.socials-row a{
  width:38px;height:38px;border-radius:50%;
  background:rgba(255,255,255,.15);backdrop-filter:blur(10px);
  display:grid;place-items:center;color:#fff;
  transition:all .25s;
}
.socials-row a:hover{background:var(--primary);transform:translateY(-3px)}
.member-body{padding:20px;text-align:center}
.member-body h5{font-size:17px;margin-bottom:4px}
.member-body span{color:var(--muted);font-size:13px}

/* ============ BLOG ============ */
.blog-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:32px}
.blog{
  background:#fff;border-radius:var(--radius-lg);overflow:hidden;
  box-shadow:var(--shadow-sm);transition:all .4s;
}
.blog:hover{transform:translateY(-8px);box-shadow:var(--shadow-md)}
.blog-img{height:240px;position:relative;overflow:hidden}
.blog-img img{width:100%;height:100%;object-fit:cover;transition:transform .5s}
.blog:hover .blog-img img{transform:scale(1.06)}
.date-badge{
  position:absolute;top:16px;left:16px;
  background:var(--primary);color:#fff;padding:10px 14px;border-radius:12px;
  font-weight:700;text-align:center;line-height:1;box-shadow:0 6px 12px rgba(PRIMARY_RGB_PLACEHOLDER,.3);
}
.date-badge .d{font-size:20px;display:block}
.date-badge .m{font-size:11px;text-transform:uppercase;opacity:.9}
.blog-body{padding:28px}
.blog-meta{font-size:12px;color:var(--muted);margin-bottom:10px;display:flex;gap:14px}
.blog h4{font-size:19px;margin-bottom:14px;line-height:1.4}
.read-more{font-weight:700;font-size:14px;color:var(--orange);display:inline-flex;align-items:center;gap:6px;transition:gap .2s}
.read-more:hover{gap:10px}

/* ============ CONTACT ============ */
.contact .grid{display:grid;grid-template-columns:1.2fr 1fr;gap:56px}
.form-card{
  background:#fff;border-radius:var(--radius-lg);padding:40px;
  box-shadow:var(--shadow-md);
}
.form-card h3{font-size:26px;margin-bottom:8px}
.form-card > p{color:var(--muted);margin-bottom:28px}
.form-row{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px}
.field{position:relative;margin-bottom:16px}
.field input,.field textarea{
  width:100%;padding:16px 18px;border:1.5px solid var(--line);
  border-radius:12px;font-size:14px;font-family:inherit;
  background:#f8fafc;transition:all .25s;color:var(--navy);
}
.field input:focus,.field textarea:focus{
  outline:none;border-color:var(--orange);background:#fff;
  box-shadow:0 0 0 4px rgba(SECONDARY_RGB_PLACEHOLDER,.15);
}
.field textarea{min-height:130px;resize:vertical}
.contact-info{display:flex;flex-direction:column;gap:24px}
.info-card{
  background:#fff;border-radius:var(--radius);padding:28px;
  box-shadow:var(--shadow-sm);display:flex;gap:18px;align-items:flex-start;
  transition:all .3s;border:1px solid var(--line);
}
.info-card:hover{transform:translateX(6px);box-shadow:var(--shadow-md);border-color:transparent}
.info-icon{
  flex-shrink:0;width:52px;height:52px;border-radius:14px;
  background:var(--primary);color:#fff;display:grid;place-items:center;font-size:20px;
  box-shadow:0 8px 16px -4px rgba(PRIMARY_RGB_PLACEHOLDER,.3);
}
.info-card h5{font-size:14px;color:var(--muted);font-weight:500;margin-bottom:4px}
.info-card p{font-weight:600;color:var(--navy);font-size:15px;margin:0}

/* ============ NEWSLETTER ============ */
.newsletter{padding:60px 0}
.news-card{
  background:var(--primary);
  border-radius:32px;padding:64px 40px;text-align:center;color:#fff;
  position:relative;overflow:hidden;
  box-shadow:0 30px 70px -20px rgba(PRIMARY_RGB_PLACEHOLDER,.5);
}
.news-card::before,.news-card::after{
  content:'';position:absolute;border-radius:50%;
  background:rgba(255,255,255,.1);
}
.news-card::before{width:300px;height:300px;top:-100px;left:-100px}
.news-card::after{width:240px;height:240px;bottom:-80px;right:-60px}
.news-card > *{position:relative;z-index:1}
.news-card h2{color:#fff;font-size:38px;margin-bottom:12px;letter-spacing:-1px}
.news-card p{color:rgba(255,255,255,.9);margin-bottom:32px;font-size:16px}
.news-form{
  display:flex;max-width:520px;margin:0 auto;
  background:rgba(255,255,255,.95);backdrop-filter:blur(10px);
  padding:6px;border-radius:999px;
  box-shadow:0 10px 30px rgba(0,0,0,.15);
}
.news-form input{
  flex:1;border:none;background:transparent;padding:14px 22px;
  font-family:inherit;font-size:14px;color:var(--navy);outline:none;
}
.news-form button{
  background:var(--navy);color:#fff;border:none;padding:14px 28px;
  border-radius:999px;font-weight:600;cursor:pointer;font-family:inherit;
  transition:all .25s;
}
.news-form button:hover{background:#1e293b;transform:scale(1.03)}

/* ============ FOOTER ============ */
.footer{
  background:var(--navy);color:#cbd5e1;padding:90px 0 0;position:relative;overflow:hidden;
}
.footer::before{
  content:'';position:absolute;top:0;left:0;right:0;height:3px;
  background:var(--primary);
}
.footer-grid{display:grid;grid-template-columns:1.4fr 1fr 1fr 1fr;gap:48px;margin-bottom:60px}
.footer .logo{color:#fff;margin-bottom:18px}
.footer-col p{color:#94a3b8;font-size:14px;margin-bottom:20px;line-height:1.7}
.footer-col h5{color:#fff;font-size:16px;margin-bottom:24px;font-family:'Plus Jakarta Sans'}
.footer-col ul{list-style:none;display:flex;flex-direction:column;gap:12px}
.footer-col a{color:#94a3b8;font-size:14px;transition:color .2s;display:inline-flex;align-items:center;gap:8px}
.footer-col a:hover{color:#fff}
.footer-socials{display:flex;gap:12px;margin-top:8px}
.footer-socials a{
  width:40px;height:40px;border-radius:12px;
  background:rgba(255,255,255,.06);
  display:grid;place-items:center;color:#cbd5e1;
  transition:all .3s;
}
.footer-socials a:hover{background:var(--primary);color:#fff;transform:translateY(-3px)}
.footer-bottom{
  border-top:1px solid rgba(255,255,255,.08);
  padding:24px 0;text-align:center;font-size:13px;color:#94a3b8;
}

/* ============ ANIMATIONS ============ */
@keyframes fadeUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
.reveal{opacity:0;animation:fadeUp .8s ease forwards}
.reveal-2{animation-delay:.15s}
.reveal-3{animation-delay:.3s}

/* ============ RESPONSIVE ============ */
@media (max-width:1024px){
  .hero h1{font-size:48px}
  .hero .grid,.about .grid,.stats .grid,.contact .grid{grid-template-columns:1fr;gap:48px}
  .hl-card{grid-template-columns:1fr 1fr;gap:24px;padding:32px}
  .courses-grid,.blog-grid{grid-template-columns:repeat(2,1fr)}
  .team-grid{grid-template-columns:repeat(2,1fr)}
  .how-grid{grid-template-columns:repeat(2,1fr)}
  .footer-grid{grid-template-columns:1fr 1fr;gap:40px}
}
@media (max-width:640px){
  .nav,.topbar .info{display:none}
  .menu-toggle{display:block}
  .hero{padding:60px 0 90px}
  .hero h1{font-size:36px}
  section{padding:70px 0}
  .section-head h2,.about h2,.stats h2{font-size:32px}
  .courses-grid,.blog-grid,.team-grid,.how-grid,.hl-card,.form-row,.footer-grid,.stats-cards{grid-template-columns:1fr}
  .testi-card{padding:48px 24px}
  .testi-inner blockquote{font-size:20px}
  .news-card{padding:48px 24px}
  .news-card h2{font-size:28px}
  .news-form{flex-direction:column;background:transparent;padding:0;gap:12px;box-shadow:none}
  .news-form input{background:#fff;border-radius:999px;padding:16px 22px}
  .form-card{padding:28px}
  .stats{margin:0 12px;border-radius:24px}
  .float-card{display:none}
  .hero-img-wrap img{height:380px}
}
`;

export const Education01Html = `
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<meta name="description" content="Premium online learning platform offering postgraduate, engineering, business and design courses from world-class instructors."/>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<!-- ICON SPRITE -->
<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <defs>
    <symbol id="i-phone" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.33 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></symbol>
    <symbol id="i-mail" viewBox="0 0 24 24"><path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/><polyline points="22,6 12,13 2,6"/></symbol>
    <symbol id="i-pin" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></symbol>
    <symbol id="i-clock" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></symbol>
    <symbol id="i-cap" viewBox="0 0 24 24"><path d="M22 10L12 4 2 10l10 6 10-6z"/><path d="M6 12v5c3 2 9 2 12 0v-5"/></symbol>
    <symbol id="i-gear" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></symbol>
    <symbol id="i-brief" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></symbol>
    <symbol id="i-palette" viewBox="0 0 24 24"><circle cx="13.5" cy="6.5" r="1.5"/><circle cx="17.5" cy="10.5" r="1.5"/><circle cx="8.5" cy="7.5" r="1.5"/><circle cx="6.5" cy="12.5" r="1.5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c1.1 0 2-.9 2-2 0-.5-.2-1-.5-1.4-.4-.4-.6-.9-.6-1.5 0-1.1.9-2 2-2H17c2.8 0 5-2.2 5-5 0-4.4-4.5-8-10-8z"/></symbol>
    <symbol id="i-search" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></symbol>
    <symbol id="i-pen" viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></symbol>
    <symbol id="i-book" viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></symbol>
    <symbol id="i-trophy" viewBox="0 0 24 24"><path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4z"/><path d="M17 4h3v3a3 3 0 0 1-3 3M7 4H4v3a3 3 0 0 0 3 3"/></symbol>
    <symbol id="i-star" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></symbol>
    <symbol id="i-users" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></symbol>
    <symbol id="i-clock-fill" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></symbol>
    <symbol id="i-folder" viewBox="0 0 24 24"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></symbol>
    <symbol id="i-chat" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></symbol>
    <symbol id="i-check" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></symbol>
    <symbol id="i-arrow" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></symbol>
    <symbol id="i-play" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></symbol>
    <symbol id="i-fb" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></symbol>
    <symbol id="i-tw" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></symbol>
    <symbol id="i-ig" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></symbol>
    <symbol id="i-in" viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></symbol>
  </defs>
</svg>

<!-- TOP BAR -->
<div class="topbar">
  <div class="container row">
    <div class="info">
      <span data-editable="true"><svg class="icon-svg" style="width:1em;height:1em"><use href="#i-phone"/></svg> +1 (800) 123-4567</span>
      <span data-editable="true"><svg class="icon-svg" style="width:1em;height:1em"><use href="#i-mail"/></svg> hello@eduverse.com</span>
      <span data-editable="true"><svg class="icon-svg" style="width:1em;height:1em"><use href="#i-pin"/></svg> 1200 Learning Ave, NY</span>
    </div>
    <div class="socials">
      <a data-editable="true" href="#" aria-label="Facebook"><svg class="icon-svg" style="width:1em;height:1em"><use href="#i-fb"/></svg></a>
      <a data-editable="true" href="#" aria-label="Twitter"><svg class="icon-svg" style="width:1em;height:1em"><use href="#i-tw"/></svg></a>
      <a data-editable="true" href="#" aria-label="Instagram"><svg class="icon-svg" style="width:1em;height:1em"><use href="#i-ig"/></svg></a>
      <a data-editable="true" href="#" aria-label="LinkedIn"><svg class="icon-svg" style="width:1em;height:1em"><use href="#i-in"/></svg></a>
    </div>
  </div>
</div>

<!-- HEADER -->
<header class="header">
  <div class="container inner">
    <a data-editable="true" href="#" class="logo"><span data-editable="true" class="logo-mark">E</span>LOGO_PLACEHOLDER</a>
    <a data-editable="true" href="#" class="btn btn-primary">Sign Up <svg class="icon-svg" style="width:16px;height:16px"><use href="#i-arrow"/></svg></a>
    <button data-editable="true" class="menu-toggle">☰</button>
  </div>
</header>

<!-- HERO -->
<section class="hero">
  <div class="blob blob-1"></div>
  <div class="blob blob-2"></div>
  <div class="container grid">
    <div class="reveal">
      <div class="tagline"><span data-editable="true" class="dot"></span> #1 Online Learning Platform 2026</div>
      <h1 data-editable="true">A better learning <span data-editable="true" class="accent">future starts</span> here.</h1>
      <p data-editable="true" class="lead">Unlock world-class education with expert mentors, hands-on projects, and a supportive community designed to help you master the skills of tomorrow.</p>
      <div class="hero-cta">
        <a data-editable="true" href="#courses" class="btn btn-primary">Explore Courses <svg class="icon-svg" style="width:16px;height:16px"><use href="#i-arrow"/></svg></a>
        <a data-editable="true" href="#about" class="btn btn-secondary"><svg class="icon-svg" style="width:1em;height:1em"><use href="#i-play"/></svg> Watch Demo</a>
      </div>
    </div>
    <div class="hero-visual reveal reveal-2">
      <div class="hero-img-wrap">
        <img data-editable-img="true" src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800" alt="Students collaborating on a learning project"/>
      </div>
      <div class="float-card fc-1">
        <div class="ic"><svg class="icon-svg" style="width:1em;height:1em"><use href="#i-star"/></svg></div>
        <div><div class="lbl">Avg. Rating</div><div class="val">4.9 / 5.0</div></div>
      </div>
      <div class="float-card fc-2">
        <div class="ic"><svg class="icon-svg" style="width:1em;height:1em"><use href="#i-users"/></svg></div>
        <div><div class="lbl">Active Students</div><div class="val">25,000+</div></div>
      </div>
    </div>
  </div>
</section>

<!-- HIGHLIGHTS -->
<div class="container highlights">
  <div class="hl-card">
    <div class="hl-intro">
      <h3 data-editable="true">Top Categories</h3>
      <p data-editable="true">Explore the most popular learning paths picked by thousands of students worldwide.</p>
    </div>
    <div class="hl-item">
      <div class="hl-icon"><svg class="icon-svg" style="width:28px;height:28px"><use href="#i-cap"/></svg></div>
      <h4 data-editable="true">Postgraduate</h4>
      <p data-editable="true">320+ Programs</p>
    </div>
    <div class="hl-item">
      <div class="hl-icon"><svg class="icon-svg" style="width:28px;height:28px"><use href="#i-gear"/></svg></div>
      <h4 data-editable="true">Engineering</h4>
      <p data-editable="true">540+ Courses</p>
    </div>
    <div class="hl-item">
      <div class="hl-icon"><svg class="icon-svg" style="width:28px;height:28px"><use href="#i-brief"/></svg></div>
      <h4 data-editable="true">Business</h4>
      <p data-editable="true">410+ Courses</p>
    </div>
    <div class="hl-item">
      <div class="hl-icon"><svg class="icon-svg" style="width:28px;height:28px"><use href="#i-palette"/></svg></div>
      <h4 data-editable="true">Design</h4>
      <p data-editable="true">280+ Courses</p>
    </div>
  </div>
</div>

<!-- ABOUT -->
<section class="about" id="about">
  <div class="container grid">
    <div class="about-img">
      <img data-editable-img="true" src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800" alt="Diverse group of students learning together"/>
      <div class="about-badge">
        <div class="num">15+</div>
        <div><strong data-editable="true">Years</strong><br><span data-editable="true" style="color:var(--muted);font-size:13px">of Excellence</span></div>
      </div>
    </div>
    <div>
      <span data-editable="true" class="eyebrow" style="display:inline-block;padding:6px 14px;border-radius:999px;background:var(--secondary);color:#fff;font-size:12px;font-weight:600;letter-spacing:1px;text-transform:uppercase;margin-bottom:16px">About Us</span>
      <h2 data-editable="true">Strength in Numbers, Power in Knowledge.</h2>
      <p data-editable="true">We empower learners around the globe with curated programs, expert instructors, and a learning experience built for the modern world. Join thousands transforming their careers with us.</p>
      <ul class="bullets">
        <li data-editable="true"><div class="check"><svg class="icon-svg" style="width:18px;height:18px"><use href="#i-check"/></svg></div><div><h5 data-editable="true">Industry-Expert Instructors</h5><p data-editable="true">Learn from professionals working at top companies worldwide.</p></div></li>
        <li data-editable="true"><div class="check"><svg class="icon-svg" style="width:18px;height:18px"><use href="#i-check"/></svg></div><div><h5 data-editable="true">Hands-On Projects</h5><p data-editable="true">Build a real portfolio with practical, project-based learning.</p></div></li>
        <li data-editable="true"><div class="check"><svg class="icon-svg" style="width:18px;height:18px"><use href="#i-check"/></svg></div><div><h5 data-editable="true">Lifetime Access & Support</h5><p data-editable="true">Unlimited access to course materials and a global community.</p></div></li>
      </ul>
    </div>
  </div>
</section>

<!-- COURSES -->
<section id="courses" style="background:linear-gradient(180deg,var(--bg) 0%,#fff5e1 100%)">
  <div class="container">
    <div class="section-head">
      <span data-editable="true" class="eyebrow">Featured</span>
      <h2 data-editable="true">Top Featured Courses</h2>
      <p data-editable="true">Hand-picked programs designed to get you job-ready in months, not years.</p>
    </div>
    <div class="tabs">
      <button data-editable="true" class="tab active" data-filter="all">All</button>
      <button data-editable="true" class="tab" data-filter="Engineering">Engineering</button>
      <button data-editable="true" class="tab" data-filter="Business">Business</button>
      <button data-editable="true" class="tab" data-filter="Design">Design</button>
      <button data-editable="true" class="tab" data-filter="Marketing">Marketing</button>
      <button data-editable="true" class="tab" data-filter="Postgraduate">Postgraduate</button>
    </div>
    <div class="courses-grid">
      <article class="course" data-cat="Engineering">
        <div class="course-img"><span data-editable="true" class="course-cat">Engineering</span><img data-editable-img="true" src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=400" alt="Web development course"/></div>
        <div class="course-body">
          <div class="course-meta"><span data-editable="true"><svg class="icon-svg" style="width:14px;height:14px"><use href="#i-clock-fill"/></svg> 12 Weeks</span><span data-editable="true" class="stars"><svg class="icon-svg" style="width:14px;height:14px"><use href="#i-star"/></svg> 4.9 (2.1k)</span></div>
          <h4 data-editable="true">Full-Stack Web Development Bootcamp</h4>
          <p data-editable="true" class="by">by Sarah Mitchell</p>
          <div class="course-foot"><span data-editable="true" class="price">$129</span><a data-editable="true" href="#" class="enroll">Enroll <svg class="icon-svg" style="width:14px;height:14px"><use href="#i-arrow"/></svg></a></div>
        </div>
      </article>
      <article class="course" data-cat="Design">
        <div class="course-img"><span data-editable="true" class="course-cat">Design</span><img data-editable-img="true" src="https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?auto=format&fit=crop&q=80&w=400" alt="UX design course"/></div>
        <div class="course-body">
          <div class="course-meta"><span data-editable="true"><svg class="icon-svg" style="width:14px;height:14px"><use href="#i-clock-fill"/></svg> 8 Weeks</span><span data-editable="true" class="stars"><svg class="icon-svg" style="width:14px;height:14px"><use href="#i-star"/></svg> 4.8 (1.8k)</span></div>
          <h4 data-editable="true">Modern UX/UI Design Masterclass</h4>
          <p data-editable="true" class="by">by James Carter</p>
          <div class="course-foot"><span data-editable="true" class="price">$99</span><a data-editable="true" href="#" class="enroll">Enroll <svg class="icon-svg" style="width:14px;height:14px"><use href="#i-arrow"/></svg></a></div>
        </div>
      </article>
      <article class="course" data-cat="Business">
        <div class="course-img"><span data-editable="true" class="course-cat">Business</span><img data-editable-img="true" src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=400" alt="Business strategy course"/></div>
        <div class="course-body">
          <div class="course-meta"><span data-editable="true"><svg class="icon-svg" style="width:14px;height:14px"><use href="#i-clock-fill"/></svg> 10 Weeks</span><span data-editable="true" class="stars"><svg class="icon-svg" style="width:14px;height:14px"><use href="#i-star"/></svg> 4.9 (3.2k)</span></div>
          <h4 data-editable="true">Business Strategy & Leadership</h4>
          <p data-editable="true" class="by">by Olivia Bennett</p>
          <div class="course-foot"><span data-editable="true" class="price">$149</span><a data-editable="true" href="#" class="enroll">Enroll <svg class="icon-svg" style="width:14px;height:14px"><use href="#i-arrow"/></svg></a></div>
        </div>
      </article>
      <article class="course" data-cat="Marketing">
        <div class="course-img"><span data-editable="true" class="course-cat">Marketing</span><img data-editable-img="true" src="https://images.unsplash.com/photo-1432888622747-4eb9a8f2c207?auto=format&fit=crop&q=80&w=400" alt="Digital marketing course"/></div>
        <div class="course-body">
          <div class="course-meta"><span data-editable="true"><svg class="icon-svg" style="width:14px;height:14px"><use href="#i-clock-fill"/></svg> 6 Weeks</span><span data-editable="true" class="stars"><svg class="icon-svg" style="width:14px;height:14px"><use href="#i-star"/></svg> 4.7 (980)</span></div>
          <h4 data-editable="true">Digital Marketing Pro</h4>
          <p data-editable="true" class="by">by Daniel Kim</p>
          <div class="course-foot"><span data-editable="true" class="price">$79</span><a data-editable="true" href="#" class="enroll">Enroll <svg class="icon-svg" style="width:14px;height:14px"><use href="#i-arrow"/></svg></a></div>
        </div>
      </article>
      <article class="course" data-cat="Engineering">
        <div class="course-img"><span data-editable="true" class="course-cat">Engineering</span><img data-editable-img="true" src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=400" alt="Data science course"/></div>
        <div class="course-body">
          <div class="course-meta"><span data-editable="true"><svg class="icon-svg" style="width:14px;height:14px"><use href="#i-clock-fill"/></svg> 14 Weeks</span><span data-editable="true" class="stars"><svg class="icon-svg" style="width:14px;height:14px"><use href="#i-star"/></svg> 4.9 (2.7k)</span></div>
          <h4 data-editable="true">Data Science & Machine Learning</h4>
          <p data-editable="true" class="by">by Priya Sharma</p>
          <div class="course-foot"><span data-editable="true" class="price">$179</span><a data-editable="true" href="#" class="enroll">Enroll <svg class="icon-svg" style="width:14px;height:14px"><use href="#i-arrow"/></svg></a></div>
        </div>
      </article>
      <article class="course" data-cat="Postgraduate">
        <div class="course-img"><span data-editable="true" class="course-cat">Postgraduate</span><img data-editable-img="true" src="https://images.unsplash.com/photo-1523050335392-9ae5641aa08e?auto=format&fit=crop&q=80&w=400" alt="Postgraduate program"/></div>
        <div class="course-body">
          <div class="course-meta"><span data-editable="true"><svg class="icon-svg" style="width:14px;height:14px"><use href="#i-clock-fill"/></svg> 16 Weeks</span><span data-editable="true" class="stars"><svg class="icon-svg" style="width:14px;height:14px"><use href="#i-star"/></svg> 5.0 (1.1k)</span></div>
          <h4 data-editable="true">Executive MBA Foundations</h4>
          <p data-editable="true" class="by">by Robert Hayes</p>
          <div class="course-foot"><span data-editable="true" class="price">$249</span><a data-editable="true" href="#" class="enroll">Enroll <svg class="icon-svg" style="width:14px;height:14px"><use href="#i-arrow"/></svg></a></div>
        </div>
      </article>
    </div>
  </div>
</section>

<!-- STATS -->
<section class="stats">
  <div class="container grid">
    <div>
      <h2 data-editable="true">Empowering learners across the globe.</h2>
      <p data-editable="true" class="lead">Join a thriving community of students, mentors, and industry partners who believe in lifelong learning.</p>
      <a data-editable="true" href="#" class="btn btn-primary">Get Started Today <svg class="icon-svg" style="width:16px;height:16px"><use href="#i-arrow"/></svg></a>
    </div>
    <div class="stats-cards">
      <div class="stat-card"><div class="stat-num">1200+</div><div class="stat-lbl">Expert Instructors</div></div>
      <div class="stat-card"><div class="stat-num">25K+</div><div class="stat-lbl">Active Students</div></div>
      <div class="stat-card"><div class="stat-num">350+</div><div class="stat-lbl">Online Courses</div></div>
      <div class="stat-card"><div class="stat-num">98%</div><div class="stat-lbl">Success Rate</div></div>
    </div>
  </div>
</section>

<!-- HOW IT WORKS -->
<section>
  <div class="container">
    <div class="section-head">
      <span data-editable="true" class="eyebrow">Process</span>
      <h2 data-editable="true">How It Works</h2>
      <p data-editable="true">Get started in four simple steps and transform your future today.</p>
    </div>
    <div class="how-grid">
      <div class="step"><span data-editable="true" class="step-num">01</span><div class="step-icon"><svg class="icon-svg" style="width:28px;height:28px"><use href="#i-search"/></svg></div><h4 data-editable="true">Browse Courses</h4><p data-editable="true">Explore hundreds of expertly-curated programs across industries.</p></div>
      <div class="step"><span data-editable="true" class="step-num">02</span><div class="step-icon"><svg class="icon-svg" style="width:28px;height:28px"><use href="#i-pen"/></svg></div><h4 data-editable="true">Sign Up Free</h4><p data-editable="true">Create your account in seconds — no credit card required.</p></div>
      <div class="step"><span data-editable="true" class="step-num">03</span><div class="step-icon"><svg class="icon-svg" style="width:28px;height:28px"><use href="#i-book"/></svg></div><h4 data-editable="true">Start Learning</h4><p data-editable="true">Dive into interactive lessons, projects, and live mentoring.</p></div>
      <div class="step"><span data-editable="true" class="step-num">04</span><div class="step-icon"><svg class="icon-svg" style="width:28px;height:28px"><use href="#i-trophy"/></svg></div><h4 data-editable="true">Get Certified</h4><p data-editable="true">Earn industry-recognized certificates and launch your career.</p></div>
    </div>
  </div>
</section>

<!-- TESTIMONIAL -->
<section class="testimonial">
  <div class="container">
    <div class="testi-card">
      <div class="testi-inner">
        <blockquote>"Eduverse completely changed my career trajectory. The mentors were world-class and the project-based learning gave me real skills employers actually want. Within 4 months I landed my dream role."</blockquote>
        <div class="testi-author">
          <img data-editable-img="true" src="https://images.unsplash.com/photo-1494790108377-be9ce8421931?auto=format&fit=crop&q=80&w=200" alt="Emma Wilson"/>
          <div class="nm"><strong data-editable="true">Emma Wilson</strong><span data-editable="true">Senior Product Designer at Nova</span></div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- TEAM -->
<section id="team">
  <div class="container">
    <div class="section-head">
      <span data-editable="true" class="eyebrow">Our Team</span>
      <h2 data-editable="true">Meet Our Expert Instructors</h2>
      <p data-editable="true">Learn from industry veterans who shape the future of technology and design.</p>
    </div>
    <div class="team-grid">
      <div class="member">
        <div class="member-img"><img data-editable-img="true" src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400" alt="Sarah Mitchell"/>
          <div class="member-overlay"><div class="socials-row"><a data-editable="true" href="#" aria-label="Facebook"><svg class="icon-svg" style="width:16px;height:16px"><use href="#i-fb"/></svg></a><a data-editable="true" href="#" aria-label="Twitter"><svg class="icon-svg" style="width:16px;height:16px"><use href="#i-tw"/></svg></a><a data-editable="true" href="#" aria-label="LinkedIn"><svg class="icon-svg" style="width:16px;height:16px"><use href="#i-in"/></svg></a></div></div>
        </div>
        <div class="member-body"><h5 data-editable="true">Sarah Mitchell</h5><span data-editable="true">Lead Engineer</span></div>
      </div>
      <div class="member">
        <div class="member-img"><img data-editable-img="true" src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400" alt="James Carter"/>
          <div class="member-overlay"><div class="socials-row"><a data-editable="true" href="#" aria-label="Facebook"><svg class="icon-svg" style="width:16px;height:16px"><use href="#i-fb"/></svg></a><a data-editable="true" href="#" aria-label="Twitter"><svg class="icon-svg" style="width:16px;height:16px"><use href="#i-tw"/></svg></a><a data-editable="true" href="#" aria-label="LinkedIn"><svg class="icon-svg" style="width:16px;height:16px"><use href="#i-in"/></svg></a></div></div>
        </div>
        <div class="member-body"><h5 data-editable="true">James Carter</h5><span data-editable="true">Design Director</span></div>
      </div>
      <div class="member">
        <div class="member-img"><img data-editable-img="true" src="https://images.unsplash.com/photo-1567532939604-b6c5b0ad2e01?auto=format&fit=crop&q=80&w=400" alt="Olivia Bennett"/>
          <div class="member-overlay"><div class="socials-row"><a data-editable="true" href="#" aria-label="Facebook"><svg class="icon-svg" style="width:16px;height:16px"><use href="#i-fb"/></svg></a><a data-editable="true" href="#" aria-label="Twitter"><svg class="icon-svg" style="width:16px;height:16px"><use href="#i-tw"/></svg></a><a data-editable="true" href="#" aria-label="LinkedIn"><svg class="icon-svg" style="width:16px;height:16px"><use href="#i-in"/></svg></a></div></div>
        </div>
        <div class="member-body"><h5 data-editable="true">Olivia Bennett</h5><span data-editable="true">Business Mentor</span></div>
      </div>
      <div class="member">
        <div class="member-img"><img data-editable-img="true" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400" alt="Daniel Kim"/>
          <div class="member-overlay"><div class="socials-row"><a data-editable="true" href="#" aria-label="Facebook"><svg class="icon-svg" style="width:16px;height:16px"><use href="#i-fb"/></svg></a><a data-editable="true" href="#" aria-label="Twitter"><svg class="icon-svg" style="width:16px;height:16px"><use href="#i-tw"/></svg></a><a data-editable="true" href="#" aria-label="LinkedIn"><svg class="icon-svg" style="width:16px;height:16px"><use href="#i-in"/></svg></a></div></div>
        </div>
        <div class="member-body"><h5 data-editable="true">Daniel Kim</h5><span data-editable="true">Marketing Lead</span></div>
      </div>
    </div>
  </div>
</section>

<!-- BLOG -->
<section id="blog" style="background:#fff5e1">
  <div class="container">
    <div class="section-head">
      <span data-editable="true" class="eyebrow">Latest News</span>
      <h2 data-editable="true">From Our Blog</h2>
      <p data-editable="true">Insights, tutorials, and stories from the world of modern education.</p>
    </div>
    <div class="blog-grid">
      <article class="blog">
        <div class="blog-img"><img data-editable-img="true" src="https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80&w=600" alt="Online learning trends"/>
          <div class="date-badge"><span data-editable="true" class="d">12</span><span data-editable="true" class="m">May</span></div>
        </div>
        <div class="blog-body">
          <div class="blog-meta"><span data-editable="true"><svg class="icon-svg" style="width:14px;height:14px"><use href="#i-folder"/></svg> Education</span><span data-editable="true"><svg class="icon-svg" style="width:14px;height:14px"><use href="#i-chat"/></svg> 24 Comments</span></div>
          <h4 data-editable="true">The Future of Online Learning in 2026</h4>
          <a data-editable="true" href="#" class="read-more">Read More <svg class="icon-svg" style="width:14px;height:14px"><use href="#i-arrow"/></svg></a>
        </div>
      </article>
      <article class="blog">
        <div class="blog-img"><img data-editable-img="true" src="https://images.unsplash.com/photo-1454165833767-027ffea9e77b?auto=format&fit=crop&q=80&w=600" alt="Career development tips"/>
          <div class="date-badge"><span data-editable="true" class="d">08</span><span data-editable="true" class="m">May</span></div>
        </div>
        <div class="blog-body">
          <div class="blog-meta"><span data-editable="true"><svg class="icon-svg" style="width:14px;height:14px"><use href="#i-folder"/></svg> Career</span><span data-editable="true"><svg class="icon-svg" style="width:14px;height:14px"><use href="#i-chat"/></svg> 18 Comments</span></div>
          <h4 data-editable="true">10 Skills Employers Want in 2026</h4>
          <a data-editable="true" href="#" class="read-more">Read More <svg class="icon-svg" style="width:14px;height:14px"><use href="#i-arrow"/></svg></a>
        </div>
      </article>
      <article class="blog">
        <div class="blog-img"><img data-editable-img="true" src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=600" alt="Study tips article"/>
          <div class="date-badge"><span data-editable="true" class="d">02</span><span data-editable="true" class="m">May</span></div>
        </div>
        <div class="blog-body">
          <div class="blog-meta"><span data-editable="true"><svg class="icon-svg" style="width:14px;height:14px"><use href="#i-folder"/></svg> Tips</span><span data-editable="true"><svg class="icon-svg" style="width:14px;height:14px"><use href="#i-chat"/></svg> 32 Comments</span></div>
          <h4 data-editable="true">How to Stay Motivated While Studying Online</h4>
          <a data-editable="true" href="#" class="read-more">Read More <svg class="icon-svg" style="width:14px;height:14px"><use href="#i-arrow"/></svg></a>
        </div>
      </article>
    </div>
  </div>
</section>

<!-- CONTACT -->
<section class="contact" id="contact">
  <div class="container">
    <div class="section-head">
      <span data-editable="true" class="eyebrow">Get in Touch</span>
      <h2 data-editable="true">Request a Free Quote</h2>
      <p data-editable="true">Have questions? We're here to help — drop us a message anytime.</p>
    </div>
    <div class="grid">
      <div class="form-card">
        <h3 data-editable="true">Send us a message</h3>
        <p data-editable="true">We'll respond within 24 hours.</p>
        <form>
          <div class="form-row">
            <div class="field"><input type="text" placeholder="Your Name" name="name" id="name"/></div>
            <div class="field"><input type="email" placeholder="Email Address" name="email_address" id="email_address"/></div>
          </div>
          <div class="form-row">
            <div class="field"><input type="tel" placeholder="Phone Number" name="phone" id="phone"/></div>
            <div class="field"><input type="text" placeholder="Subject" name="subject" id="subject"/></div>
          </div>
          <div class="field"><textarea placeholder="Your Message" name="message" id="message"></textarea></div>
          <button data-editable="true" type="submit" class="btn btn-primary" style="width:100%;justify-content:center">Send Message <svg class="icon-svg" style="width:16px;height:16px"><use href="#i-arrow"/></svg></button>
        </form>
      </div>
      <div class="contact-info">
        <div class="info-card"><div class="info-icon"><svg class="icon-svg" style="width:22px;height:22px"><use href="#i-pin"/></svg></div><div><h5 data-editable="true">Our Address</h5><p data-editable="true">1200 Learning Avenue, Suite 500, New York, NY 10001</p></div></div>
        <div class="info-card"><div class="info-icon"><svg class="icon-svg" style="width:22px;height:22px"><use href="#i-phone"/></svg></div><div><h5 data-editable="true">Call Us</h5><p data-editable="true">+1 (800) 123-4567<br>+1 (800) 765-4321</p></div></div>
        <div class="info-card"><div class="info-icon"><svg class="icon-svg" style="width:22px;height:22px"><use href="#i-mail"/></svg></div><div><h5 data-editable="true">Email Us</h5><p data-editable="true">hello@eduverse.com<br>support@eduverse.com</p></div></div>
        <div class="info-card"><div class="info-icon"><svg class="icon-svg" style="width:22px;height:22px"><use href="#i-clock"/></svg></div><div><h5 data-editable="true">Office Hours</h5><p data-editable="true">Mon – Fri: 9:00 AM – 7:00 PM<br>Sat: 10:00 AM – 4:00 PM</p></div></div>
      </div>
    </div>
  </div>
</section>

<!-- NEWSLETTER -->
<section class="newsletter">
  <div class="container">
    <div class="news-card">
      <h2 data-editable="true">Subscribe to Our Newsletter</h2>
      <p data-editable="true">Get the latest courses, learning tips, and exclusive offers delivered to your inbox.</p>
      <form class="news-form" onsubmit="event.preventDefault()">
        <input type="email" placeholder="Enter your email address" required name="email_address" id="email_address"/>
        <button data-editable="true" type="submit">Subscribe</button>
      </form>
    </div>
  </div>
</section>

<!-- FOOTER -->
<footer class="footer">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-col">
        <a data-editable="true" href="#" class="logo"><span data-editable="true" class="logo-mark">E</span>LOGO_PLACEHOLDER</a>
        <p data-editable="true">Empowering the next generation of learners with premium online education and world-class mentors.</p>
        <div class="footer-socials">
          <a data-editable="true" href="#" aria-label="Facebook"><svg class="icon-svg" style="width:18px;height:18px"><use href="#i-fb"/></svg></a>
          <a data-editable="true" href="#" aria-label="Twitter"><svg class="icon-svg" style="width:18px;height:18px"><use href="#i-tw"/></svg></a>
          <a data-editable="true" href="#" aria-label="Instagram"><svg class="icon-svg" style="width:18px;height:18px"><use href="#i-ig"/></svg></a>
          <a data-editable="true" href="#" aria-label="LinkedIn"><svg class="icon-svg" style="width:18px;height:18px"><use href="#i-in"/></svg></a>
        </div>
      </div>
      <div class="footer-col">
        <h5 data-editable="true">Courses</h5>
        <ul>
          <li data-editable="true"><a data-editable="true" href="#"><svg class="icon-svg" style="width:12px;height:12px"><use href="#i-arrow"/></svg> Engineering</a></li>
          <li data-editable="true"><a data-editable="true" href="#"><svg class="icon-svg" style="width:12px;height:12px"><use href="#i-arrow"/></svg> Business</a></li>
          <li data-editable="true"><a data-editable="true" href="#"><svg class="icon-svg" style="width:12px;height:12px"><use href="#i-arrow"/></svg> Design</a></li>
          <li data-editable="true"><a data-editable="true" href="#"><svg class="icon-svg" style="width:12px;height:12px"><use href="#i-arrow"/></svg> Marketing</a></li>
          <li data-editable="true"><a data-editable="true" href="#"><svg class="icon-svg" style="width:12px;height:12px"><use href="#i-arrow"/></svg> Postgraduate</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h5 data-editable="true">Latest News</h5>
        <ul>
          <li data-editable="true"><a data-editable="true" href="#"><svg class="icon-svg" style="width:12px;height:12px"><use href="#i-arrow"/></svg> Future of Learning</a></li>
          <li data-editable="true"><a data-editable="true" href="#"><svg class="icon-svg" style="width:12px;height:12px"><use href="#i-arrow"/></svg> Top 10 Skills 2026</a></li>
          <li data-editable="true"><a data-editable="true" href="#"><svg class="icon-svg" style="width:12px;height:12px"><use href="#i-arrow"/></svg> Study Smarter</a></li>
          <li data-editable="true"><a data-editable="true" href="#"><svg class="icon-svg" style="width:12px;height:12px"><use href="#i-arrow"/></svg> Career Roadmap</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h5 data-editable="true">Contact</h5>
        <ul>
          <li data-editable="true"><svg class="icon-svg" style="width:14px;height:14px"><use href="#i-pin"/></svg> 1200 Learning Ave, NY</li>
          <li data-editable="true"><svg class="icon-svg" style="width:14px;height:14px"><use href="#i-phone"/></svg> +1 (800) 123-4567</li>
          <li data-editable="true"><svg class="icon-svg" style="width:14px;height:14px"><use href="#i-mail"/></svg> hello@eduverse.com</li>
          <li data-editable="true"><svg class="icon-svg" style="width:14px;height:14px"><use href="#i-clock"/></svg> Mon–Fri: 9AM–7PM</li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      © 2026 PROJECT_NAME_PLACEHOLDER. All rights reserved. · Crafted with care for learners worldwide.
    </div>
  </div>
</footer>

<div data-gjs-type="custom-code">
  <script>
    // Course tabs filter
    (function() {
      const tabs = document.querySelectorAll('.tab');
      const courses = document.querySelectorAll('.course');
      if (!tabs.length) return;

      tabs.forEach(t => {
        t.addEventListener('click', () => {
          tabs.forEach(x => x.classList.remove('active'));
          t.classList.add('active');
          const f = t.dataset.filter;
          courses.forEach(c => {
            const match = (f === 'all' || c.dataset.cat === f);
            if (match) {
              c.classList.remove('hidden');
              c.style.display = '';
              c.style.opacity = '0';
              requestAnimationFrame(() => {
                c.style.transition = 'opacity .4s ease';
                c.style.opacity = '1';
              });
            } else {
              c.classList.add('hidden');
              c.style.display = 'none';
            }
          });
        });
      });
    })();

    // Scroll reveal
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.style.opacity = '1';
          e.target.style.transform = 'translateY(0)';
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('section > .container > *, .course, .step, .member, .blog-card, .stat-card').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity .8s ease, transform .8s ease';
      io.observe(el);
    });
  </script>
</div>
`;
