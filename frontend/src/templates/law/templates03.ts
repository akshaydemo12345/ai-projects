export const law03Styles = `
:root {
  --primary: PRIMARY_COLOR_PLACEHOLDER;
  --secondary: #0B1120;
  --primary-rgb: PRIMARY_RGB_PLACEHOLDER;
  --secondary-rgb: 11, 17, 32;
  --bg-light: #fdfdfd;
  --text-dark: #1f1f1f;
  --text-muted: #64748b;
  --border-light: #f1f5f9;
}

* { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body {
  font-family: 'Inter', system-ui, sans-serif;
  color: var(--text-dark);
  background: var(--bg-light);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}
img { max-width: 100%; display: block; }
a { color: inherit; text-decoration: none; cursor: pointer; }
h1,h2,h3,h4,h5 { font-family: 'Cormorant Garamond', serif; font-weight: 600; color: var(--secondary); letter-spacing: -0.01em; line-height: 1.15; }
.ital { font-style: italic; color: var(--primary); }
.container { max-width: 1240px; margin: 0 auto; padding: 0 24px; }

/* Buttons */
.btn { display: inline-flex; align-items: center; justify-content: center; gap: 12px; padding: 16px 32px; border-radius: 999px; font-weight: 600; font-size: 15px; border: none; cursor: pointer; transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); letter-spacing: 0.02em; }
.btn-primary { background: linear-gradient(135deg, var(--primary) 0%, #1e293b 100%); color: #fff; box-shadow: 0 10px 30px -10px rgba(var(--primary-rgb), 0.6); position: relative; z-index: 1; overflow: hidden; }
.btn-primary::before { content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(135deg, #1e293b 0%, var(--primary) 100%); z-index: -1; opacity: 0; transition: opacity 0.4s; }
.btn-primary:hover { transform: translateY(-3px); box-shadow: 0 15px 40px -10px rgba(var(--primary-rgb), 0.8); }
.btn-primary:hover::before { opacity: 1; }
.btn-ghost { background: rgba(var(--primary-rgb), 0.05); color: var(--secondary); border: 1px solid rgba(var(--primary-rgb), 0.2); }
.btn-ghost:hover { background: var(--primary); color: #fff; border-color: var(--primary); transform: translateY(-3px); box-shadow: 0 15px 30px -10px rgba(var(--primary-rgb), 0.4); }
.btn.block { width: 100%; }

/* Topbar */
.topbar { background: var(--secondary); color: #cbd5e1; font-size: 13px; padding: 10px 0; }
.topbar-inner { display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap; }
.tb-left, .tb-right { display: flex; gap: 22px; align-items: center; flex-wrap: wrap; }
.topbar i { color: var(--primary); margin-right: 6px; }
.tb-right a { transition: .2s; }
.tb-right a:hover { color: var(--primary); }

/* Nav */
.nav { background: #fff; border-bottom: 1px solid var(--border-light); position: sticky; top: 0; z-index: 100; transition: .3s; }
.nav.scrolled { box-shadow: 0 8px 30px rgba(0,0,0,.05); }
.nav-inner { display: flex; align-items: center; justify-content: space-between; padding: 18px 0; gap: 20px; }
.logo { font-family: 'Cormorant Garamond', serif; font-size: 26px; font-weight: 700; color: var(--secondary); display: flex; align-items: center; gap: 10px; }
.logo i { color: var(--primary); }
.logo span { color: var(--primary); font-weight: 500; }
.logo.light { color: #fff; }
.nav-links { display: flex; gap: 28px; }
.nav-links a { font-size: 14px; font-weight: 500; color: var(--text-dark); position: relative; transition: .2s; }
.nav-links a::after { content: ''; position: absolute; left: 0; bottom: -6px; width: 0; height: 2px; background: var(--primary); transition: .3s; }
.nav-links a:hover { color: var(--primary); }
.nav-links a:hover::after { width: 100%; }
.hamburger { display: none; background: none; border: none; font-size: 22px; color: var(--secondary); cursor: pointer; }

/* Reveal (Disabled for preview stability) */
.reveal { transition: opacity .8s ease, transform .8s ease; }
.reveal.in { opacity: 1; transform: none; }

/* Hero */
.hero { padding: 120px 0 80px; background: radial-gradient(130% 130% at 50% -20%, #fff 0%, #f1f5f9 100%); position: relative; overflow: hidden; }
.hero::before { content: ''; position: absolute; top: -150px; right: -150px; width: 600px; height: 600px; background: radial-gradient(circle, rgba(var(--primary-rgb), .12), transparent 70%); border-radius: 50%; filter: blur(30px); }
.hero-grid { display: grid; grid-template-columns: 1.1fr 1fr; gap: 60px; align-items: center; position: relative; }
.chip { display: inline-flex; align-items: center; gap: 12px; padding: 8px 20px; background: rgba(var(--primary-rgb), 0.08); border: 1px solid rgba(var(--primary-rgb), 0.15); border-radius: 999px; font-size: 13px; font-weight: 600; color: var(--primary); text-transform: uppercase; letter-spacing: 0.1em; }
.chip .dot { width: 8px; height: 8px; background: var(--primary); border-radius: 50%; animation: pulse 2s infinite; }
@keyframes pulse { 0%,100%{ box-shadow: 0 0 0 0 rgba(var(--primary-rgb),.6);} 50%{ box-shadow: 0 0 0 8px rgba(var(--primary-rgb),0);} }
.hero h1 { font-size: clamp(42px, 6vw, 76px); margin: 24px 0 24px; font-weight: 700; line-height: 1.1; letter-spacing: -0.02em; color: #020617; }
.hero h1 .ital { color: var(--primary); font-style: normal; position: relative; white-space: nowrap; }
.hero h1 .ital::after { content: ''; position: absolute; bottom: 8px; left: 0; right: 0; height: 14px; background: rgba(var(--primary-rgb), 0.15); z-index: -1; transform: skewX(-15deg); }
.lead { color: #475569; font-size: 19px; max-width: 600px; line-height: 1.7; font-weight: 400; }
.hero-cta { display: flex; gap: 16px; margin: 40px 0; flex-wrap: wrap; }
.hero-bullets { list-style: none; display: flex; flex-wrap: wrap; gap: 20px; margin-top: 10px; }
.hero-bullets li { display: flex; align-items: center; gap: 10px; font-size: 14px; font-weight: 500; color: #334155; }
.hero-bullets i { color: var(--primary); font-size: 16px; }

.hero-photo { position: relative; perspective: 1000px; }
.hero-photo img { border-radius: 24px; box-shadow: 0 40px 100px -20px rgba(0,0,0,0.4); aspect-ratio: 4/5; object-fit: cover; border: 1px solid rgba(255,255,255,0.1); transform: rotateY(-4deg) rotateX(2deg); transition: .5s; }
.hero-photo:hover img { transform: rotateY(0) rotateX(0); }
.hp-badge { position: absolute; background: rgba(255,255,255,0.08); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border: 1px solid rgba(255,255,255,0.15); padding: 16px 20px; border-radius: 16px; box-shadow: 0 20px 50px rgba(0,0,0,.2); display: flex; align-items: center; gap: 14px; font-size: 13px; color: #fff; }
.hp-badge.tl { top: 30px; left: -30px; animation: floaty 6s ease-in-out infinite; }
.hp-badge.br { bottom: 50px; right: -30px; animation: floaty 6s ease-in-out infinite 1.5s; }
.hp-badge i { color: var(--primary); font-size: 24px; }
.hp-badge b { display: block; color: #fff; font-family: 'Cormorant Garamond', serif; font-size: 19px; font-weight: 600; }
.hp-badge span { color: #cbd5e1; font-size: 12px; }
.rating .stars { color: var(--primary); font-size: 12px; letter-spacing: 2px; }
.rating b { display: block; margin-top: 4px; color: #fff; }
@keyframes floaty { 0%,100%{ transform: translateY(0);} 50%{ transform: translateY(-10px);} }
.hp-tag { position: absolute; top: 50%; right: -50px; background: var(--primary); color: #fff; padding: 12px 24px; border-radius: 999px; font-size: 13px; font-weight: 600; display: flex; align-items: center; gap: 10px; transform: rotate(90deg); transform-origin: right; box-shadow: 0 20px 40px rgba(var(--primary-rgb), 0.3); }
.hp-tag .pulse { width: 10px; height: 10px; background: #fff; border-radius: 50%; animation: pulse 2s infinite; }

.hero-strip { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; margin-top: 80px; padding: 40px; background: rgba(255,255,255,0.9); backdrop-filter: blur(20px); border-radius: 24px; border: 1px solid rgba(255,255,255,0.8); box-shadow: 0 40px 80px -20px rgba(0,0,0,0.08); position: relative; z-index: 10; transform: translateY(60px); }
.hero-strip div { text-align: center; border-right: 1px solid rgba(0,0,0,0.06); padding: 0 10px; }
.hero-strip div:last-child { border: none; }
.hero-strip b { display: block; font-family: 'Inter', sans-serif; font-size: 44px; color: var(--secondary); font-weight: 800; letter-spacing: -0.03em; }
.hero-strip span { font-size: 14px; color: #64748b; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-top: 8px; }

/* Trust marquee */
.trust { padding: 100px 0 50px; border-bottom: 1px solid var(--border-light); background: #fff; }
.trust-title { text-align: center; font-size: 12px; letter-spacing: .3em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 32px; font-weight: 600; }
.marquee { overflow: hidden; mask-image: linear-gradient(90deg, transparent, #000 15%, #000 85%, transparent); }
.marquee .track { display: flex; gap: 60px; animation: mv 30s linear infinite; white-space: nowrap; }
.marquee span { font-family: 'Cormorant Garamond', serif; font-size: 28px; color: var(--secondary); font-weight: 600; opacity: .5; }
@keyframes mv { 0%{ transform: translateX(0);} 100%{ transform: translateX(-50%);} }

/* Section */
.section { padding: 100px 0; }
.sec-head { text-align: center; max-width: 780px; margin: 0 auto 60px; }
.sec-head.center { text-align: center; }
.eyebrow { display: inline-flex; align-items: center; gap: 8px; font-size: 12px; letter-spacing: .25em; text-transform: uppercase; color: var(--primary); font-weight: 600; margin-bottom: 16px; }
.eyebrow.light { color: var(--primary); }
.sec-head h2 { font-size: clamp(30px, 4vw, 48px); }
.sec-sub { color: var(--text-muted); margin-top: 16px; font-size: 16px; }

/* Practice */
.practice-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
.pcard { background: #fff; padding: 32px 24px 64px 24px; border-radius: 16px; border: 1px solid var(--border-light); position: relative; transition: .35s; display: block; overflow: hidden; }
.pcard::before { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 3px; background: var(--primary); transform: scaleX(0); transform-origin: left; transition: .4s; }
.pcard:hover { transform: translateY(-6px); box-shadow: 0 25px 50px -20px rgba(0,0,0,.15); border-color: transparent; }
.pcard:hover::before { transform: scaleX(1); }
.pcard > i { font-size: 32px; color: var(--primary); margin-bottom: 18px; display: inline-block; }
.pcard h4 { font-size: 22px; margin-bottom: 10px; }
.pcard p { color: var(--text-muted); font-size: 14px; }
.pcard .arrow { position: absolute; bottom: 20px; right: 20px; width: 36px; height: 36px; background: #f1f5f9; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--secondary); transition: .3s; }
.pcard .arrow i { font-size: 14px; margin: 0; color: inherit; }
.pcard:hover .arrow { background: var(--primary); color: #fff; }

/* About */
.about-sec { background: #fff; }
.about-grid { display: grid; grid-template-columns: 1fr 1.1fr; gap: 60px; align-items: center; }
.justice-frame { position: relative; }
.justice-frame img { border-radius: 20px; aspect-ratio: 1; object-fit: cover; }
.jf-badge { position: absolute; bottom: 30px; left: -25px; background: #fff; padding: 16px 20px; border-radius: 14px; box-shadow: 0 15px 40px rgba(0,0,0,.12); display: flex; align-items: center; gap: 12px; }
.jf-badge i { color: var(--primary); font-size: 24px; }
.jf-badge b { display: block; color: var(--secondary); font-family: 'Cormorant Garamond', serif; font-size: 18px; }
.jf-badge span { color: var(--text-muted); font-size: 12px; }
.jf-tag { position: absolute; top: -20px; right: -20px; background: var(--primary); color: #fff; width: 110px; height: 110px; border-radius: 50%; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; box-shadow: 0 20px 40px rgba(var(--primary-rgb),.4); animation: floaty 6s ease-in-out infinite; }
.jf-tag b { font-family: 'Cormorant Garamond', serif; font-size: 40px; font-weight: 700; line-height: 1; }
.jf-tag span { font-size: 11px; margin-top: 4px; }
.about-right h2 { font-size: clamp(30px, 4vw, 46px); margin-bottom: 18px; }
.about-right > p { color: var(--text-muted); margin-bottom: 30px; }
.values { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
.values > div { display: flex; gap: 14px; }
.values i { color: var(--primary); font-size: 22px; margin-top: 4px; }
.values b { display: block; color: var(--secondary); font-size: 15px; margin-bottom: 4px; }
.values span { color: var(--text-muted); font-size: 13px; }

/* Process */
.process { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; position: relative; }
.process::before { content: ''; position: absolute; top: 40px; left: 8%; right: 8%; height: 2px; background: repeating-linear-gradient(90deg, var(--primary), var(--primary) 4px, transparent 4px, transparent 12px); z-index: 0; }
.p-step { background: #fff; padding: 30px 24px; border-radius: 16px; border: 1px solid var(--border-light); position: relative; z-index: 1; }
.p-step .num { font-family: 'Cormorant Garamond', serif; font-size: 44px; color: var(--primary); font-weight: 700; display: block; margin-bottom: 12px; }
.p-step h4 { font-size: 22px; margin-bottom: 10px; }
.p-step p { color: var(--text-muted); font-size: 14px; margin-bottom: 14px; }
.p-step ul { list-style: none; display: flex; flex-direction: column; gap: 6px; }
.p-step ul li { font-size: 13px; display: flex; align-items: center; gap: 8px; color: var(--text-dark); }
.p-step i { color: var(--primary); font-size: 11px; }

/* Attorneys */
.attorneys-sec { background: #fff; }
.att-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
.att { text-align: center; padding: 30px 20px; border: 1px solid var(--border-light); border-radius: 16px; background: var(--bg-light); transition: .3s; }
.att:hover { transform: translateY(-6px); box-shadow: 0 25px 50px -20px rgba(0,0,0,.15); }
.att-mono { width: 80px; height: 80px; margin: 0 auto 16px; border-radius: 50%; background: var(--secondary); color: var(--primary); font-family: 'Cormorant Garamond', serif; font-size: 30px; font-weight: 700; display: flex; align-items: center; justify-content: center; }
.att-mono.ac2 { background: var(--primary); color: #fff; }
.att-mono.ac3 { background: #1e293b; color: var(--primary); }
.att-mono.ac4 { background: var(--primary); color: var(--secondary); }
.att h4 { font-size: 22px; }
.att > span { display: block; color: var(--primary); font-size: 12px; letter-spacing: .1em; text-transform: uppercase; margin: 6px 0 12px; }
.att p { color: var(--text-muted); font-size: 13px; margin-bottom: 14px; }
.chips { display: flex; gap: 6px; justify-content: center; flex-wrap: wrap; }
.chips span { background: #fff; border: 1px solid var(--border-light); padding: 4px 10px; border-radius: 999px; font-size: 11px; color: var(--text-muted); }

/* Results */
.results { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.result { padding: 32px; background: #fff; border: 1px solid var(--border-light); border-radius: 16px; border-top: 4px solid var(--primary); transition: .3s; }
.result:hover { transform: translateY(-4px); box-shadow: 0 20px 50px -20px rgba(0,0,0,.12); }
.result b { display: block; font-family: 'Cormorant Garamond', serif; font-size: 44px; color: var(--secondary); font-weight: 700; margin-bottom: 6px; }
.result h5 { font-size: 20px; margin-bottom: 10px; }
.result p { color: var(--text-muted); font-size: 14px; margin-bottom: 16px; }
.rtag { font-size: 11px; color: var(--primary); letter-spacing: .15em; text-transform: uppercase; font-weight: 600; }

/* Testi */
.testi-sec { background: var(--secondary); color: #fff; }
.testi-sec .sec-head h2 { color: #fff; }
.testi-sec .eyebrow { color: var(--primary); }
.testi-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; }
.tcard { background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.08); padding: 32px; border-radius: 16px; backdrop-filter: blur(10px); }
.tcard .stars { color: var(--primary); letter-spacing: 3px; font-size: 13px; margin-bottom: 16px; }
.tcard p { font-family: 'Cormorant Garamond', serif; font-size: 22px; font-style: italic; color: #f1f5f9; line-height: 1.4; margin-bottom: 20px; }
.tcard .t-foot b { display: block; color: var(--primary); font-size: 15px; }
.tcard .t-foot span { color: #94a3b8; font-size: 13px; }

/* Insights + FAQ */
.ins-grid { display: grid; grid-template-columns: 1.4fr 1fr; gap: 50px; }
.ins-left h2 { font-size: clamp(28px, 3.5vw, 42px); margin-bottom: 30px; }
.briefs { display: flex; flex-direction: column; gap: 16px; }
.brief { background: #fff; padding: 22px 24px; border: 1px solid var(--border-light); border-radius: 12px; border-left: 3px solid var(--primary); transition: .3s; cursor: pointer; }
.brief:hover { transform: translateX(4px); box-shadow: 0 10px 30px -15px rgba(0,0,0,.15); }
.brief .cat { display: inline-block; background: rgba(var(--primary-rgb),.1); color: var(--primary); padding: 3px 10px; border-radius: 999px; font-size: 11px; font-weight: 600; letter-spacing: .1em; text-transform: uppercase; margin-bottom: 10px; }
.brief h4 { font-size: 20px; margin-bottom: 8px; }
.brief p { color: var(--text-muted); font-size: 14px; margin-bottom: 8px; }
.brief .meta { font-size: 12px; color: var(--primary); }

.ins-right { background: var(--secondary); color: #fff; padding: 36px 30px; border-radius: 20px; align-self: start; position: sticky; top: 100px; }
.ins-right .eyebrow { color: var(--primary); }
.ins-right h3 { color: #fff; font-size: 26px; margin-bottom: 24px; }
.acc details { border-top: 1px solid rgba(255,255,255,.1); padding: 16px 0; }
.acc details[open] summary i { transform: rotate(45deg); }
.acc summary { display: flex; justify-content: space-between; align-items: center; cursor: pointer; font-weight: 500; font-size: 15px; list-style: none; color: #fff; }
.acc summary::-webkit-details-marker { display: none; }
.acc summary i { transition: .3s; color: var(--primary); }
.acc p { margin-top: 10px; color: #cbd5e1; font-size: 14px; }

/* Consult */
.consult { background: linear-gradient(145deg, #020617 0%, #0f172a 100%); color: #fff; position: relative; overflow: hidden; padding: 120px 0; }
.consult::before { content: ''; position: absolute; bottom: -300px; left: -200px; width: 800px; height: 800px; background: radial-gradient(circle, rgba(var(--primary-rgb), .15), transparent 70%); border-radius: 50%; filter: blur(50px); }
.consult-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; position: relative; z-index: 2; }
.c-left h2 { color: #fff; font-size: clamp(34px, 4.5vw, 52px); margin-bottom: 20px; }
.c-left > p { color: #94a3b8; margin-bottom: 30px; font-size: 17px; }
.c-list { list-style: none; display: flex; flex-direction: column; gap: 16px; }
.c-list li { display: flex; align-items: center; gap: 14px; color: #e2e8f0; font-size: 15px; }
.c-list i { color: var(--primary); font-size: 18px; }

.c-form { background: #fff; padding: 40px; border-radius: 24px; color: var(--text-dark); box-shadow: 0 50px 100px -20px rgba(0,0,0,.15); position: relative; border: 1px solid rgba(255,255,255,0.8); }
.c-form::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 5px; background: linear-gradient(90deg, var(--primary), var(--secondary)); border-radius: 24px 24px 0 0; }
.c-form h4 { font-size: 30px; margin-bottom: 24px; font-family: 'Cormorant Garamond', serif; }
.c-form label { display: block; font-size: 12px; font-weight: 600; color: var(--secondary); margin-bottom: 16px; letter-spacing: .05em; text-transform: uppercase; }
.c-form .row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.c-form input, .c-form select, .c-form textarea { width: 100%; margin-top: 8px; padding: 14px 16px; border: 1px solid var(--border-light); border-radius: 12px; font-family: inherit; font-size: 15px; background: #f8fafc; text-transform: none; letter-spacing: normal; color: var(--text-dark); transition: .3s; }
.c-form input:focus, .c-form select:focus, .c-form textarea:focus { outline: none; border-color: var(--primary); background: #fff; box-shadow: 0 0 0 4px rgba(var(--primary-rgb),.15); }
.c-form .check { display: flex; align-items: flex-start; gap: 10px; text-transform: none; letter-spacing: 0; font-weight: 400; font-size: 13px; color: var(--text-muted); }
.c-form .check input { width: auto; margin: 4px 0 0; }
.c-mini { display: block; text-align: center; margin-top: 18px; font-size: 13px; color: var(--text-muted); text-transform: none; letter-spacing: 0; font-weight: 400; }
.c-mini i { color: var(--primary); }

/* Footer */
.footer { background: #060a15; color: #cbd5e1; padding: 70px 0 30px; }
.foot-top { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr 1.3fr; gap: 40px; padding-bottom: 40px; border-bottom: 1px solid rgba(255,255,255,.08); }
.fc-brand p { font-size: 13px; color: #94a3b8; margin: 14px 0 20px; max-width: 320px; }
.socials { display: flex; gap: 10px; }
.foot-top .socials a { width: 36px; height: 36px; border-radius: 50%; border: 1px solid rgba(255,255,255,.15); display: flex; align-items: center; justify-content: center; transition: .3s; margin-bottom: 0; }
.foot-top .socials a i { margin: 0; width: auto; color: inherit; font-size: 15px; }
.foot-top .socials a:hover { background: var(--primary); border-color: var(--primary); color: #fff; }
.foot-top > div b { color: #fff; font-family: 'Cormorant Garamond', serif; font-size: 20px; font-weight: 600; display: block; margin-bottom: 16px; }
.foot-top > div a { display: block; font-size: 13px; margin-bottom: 10px; color: #94a3b8; transition: .2s; }
.foot-top > div a:hover { color: var(--primary); }
.foot-top i { color: var(--primary); margin-right: 8px; width: 14px; text-align: center; }
.foot-bottom { display: flex; justify-content: space-between; padding-top: 24px; font-size: 12px; color: #64748b; flex-wrap: wrap; gap: 12px; }

/* Utilities */
.to-top { position: fixed; bottom: 24px; right: 24px; width: 46px; height: 46px; border-radius: 50%; background: var(--primary); color: #fff; border: none; cursor: pointer; opacity: 0; pointer-events: none; transition: .3s; box-shadow: 0 10px 25px rgba(var(--primary-rgb),.4); z-index: 90; }
.to-top.show { opacity: 1; pointer-events: auto; }
.toast { position: fixed; bottom: 30px; left: 50%; transform: translate(-50%, 150%); background: var(--secondary); color: #fff; padding: 14px 22px; border-radius: 999px; font-size: 14px; box-shadow: 0 20px 40px rgba(0,0,0,.2); transition: .4s; z-index: 200; }
.toast.show { transform: translate(-50%, 0); }

/* Responsive */
@media (max-width: 960px) {
  .hero-grid, .about-grid, .consult-grid, .ins-grid { grid-template-columns: 1fr; }
  .practice-grid, .att-grid, .process { grid-template-columns: repeat(2, 1fr); }
  .process::before { display: none; }
  .results { grid-template-columns: 1fr 1fr; }
  .testi-grid { grid-template-columns: 1fr; }
  .foot-top { grid-template-columns: 1fr 1fr; }
  .hero-strip { grid-template-columns: 1fr 1fr; }
  .nav-links { display: none; position: absolute; top: 100%; left: 0; right: 0; background: #fff; flex-direction: column; padding: 20px; border-bottom: 1px solid var(--border-light); }
  .nav-links.open { display: flex; }
  .hamburger { display: block; }
  .hide-sm { display: none; }
  .ins-right { position: static; }
  .values { grid-template-columns: 1fr; }
  .hp-tag { display: none; }
  .hp-badge.tl { left: 10px; }
  .hp-badge.br { right: 10px; }
}
@media (max-width: 560px) {
  .practice-grid, .att-grid, .process, .results, .foot-top { grid-template-columns: 1fr; }
  .hero-strip { grid-template-columns: 1fr; }
  .c-form .row { grid-template-columns: 1fr; }
  .section { padding: 70px 0; }
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

export const law03Html = `
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

<!-- Top Bar -->
<div class="topbar">
  <div class="container topbar-inner">
    <div class="tb-left">
      <span data-editable="true"><i class="fa-solid fa-phone"></i> PHONE_PLACEHOLDER</span>
      <span data-editable="true"><i class="fa-solid fa-envelope"></i> EMAIL_PLACEHOLDER</span>
      <span data-editable="true" class="hide-sm"><i class="fa-solid fa-location-dot"></i> ADDRESS_PLACEHOLDER</span>
    </div>
    <div class="tb-right">
      <span data-editable="true" class="hide-sm"><i class="fa-regular fa-clock"></i> Mon–Sat: 8:00 – 20:00</span>
      <a data-editable="true"><i class="fa-brands fa-linkedin"></i></a>
      <a data-editable="true"><i class="fa-brands fa-twitter"></i></a>
      <a data-editable="true"><i class="fa-brands fa-facebook"></i></a>
    </div>
  </div>
</div>

<!-- Navbar -->
<header class="nav" id="nav">
  <div class="container nav-inner">
    <a data-editable="true" href="#" class="logo">LOGO_PLACEHOLDER</a>
    <a data-editable="true" href="#consult" class="btn btn-primary">Free Consultation <i class="fa-solid fa-arrow-right"></i></a>
    <button data-editable="true" class="hamburger" id="hamburger"><i class="fa-solid fa-bars"></i></button>
  </div>
</header>

<!-- 1. HERO -->
<section class="hero">
  <div class="container hero-grid">
    <div class="hero-left reveal">
      <span data-editable="true" class="chip"><span data-editable="true" class="dot"></span> Now accepting new clients — Est. 1998</span>
      <h1 data-editable="true">When the law feels heavy, <span data-editable="true" class="ital">we carry it with you.</span></h1>
      <p data-editable="true" class="lead">Vaeltra Law is a full-service firm of trial-tested attorneys defending individuals, families and enterprises across 14 practice areas. Over two decades. 5,200 cases won. A record that speaks in courtrooms — not in slogans.</p>
      <div class="hero-cta">
        <a data-editable="true" href="#consult" class="btn btn-primary">Book Free Consultation <i class="fa-solid fa-arrow-right"></i></a>
        <a data-editable="true" href="#practice" class="btn btn-ghost">Explore Practice Areas</a>
      </div>
      <ul class="hero-bullets">
        <li data-editable="true"><i class="fa-solid fa-circle-check"></i> No-fee promise on injury cases</li>
        <li data-editable="true"><i class="fa-solid fa-circle-check"></i> Same-day response, 7 days a week</li>
        <li data-editable="true"><i class="fa-solid fa-circle-check"></i> Confidential, no-obligation review</li>
      </ul>
    </div>
    <div class="hero-right reveal">
      <form class="c-form reveal" id="consultForm">
        <h4 data-editable="true">Request Consultation</h4>
        <div class="row">
          <label>Full Name <input type="text" name="name" required placeholder="Jane Doe"/></label>
          <label>Phone <input type="tel" name="phone" required placeholder="(555) 000-0000"/></label>
        </div>
        <label>Email <input type="email" name="email" required placeholder="jane@company.com"/></label>
        <label>Practice Area
          <select name="area" required>
            <option value="">Select an area…</option>
            <option>Corporate Law</option><option>Family Law</option><option>Criminal Defense</option>
            <option>Personal Injury</option><option>Employment</option><option>Real Estate</option>
            <option>Immigration</option><option>Estate Planning</option><option>Other</option>
          </select>
        </label>
        <label>Briefly describe your matter <textarea name="msg" rows="4" required placeholder="A short summary is enough — we'll follow up for details."></textarea></label>
        <label class="check"><input type="checkbox" required/> <span data-editable="true">I understand this form does not create an attorney–client relationship.</span></label>
        <button data-editable="true" class="btn btn-primary block" type="submit">Send Confidential Request <i class="fa-solid fa-lock"></i></button>
        <span data-editable="true" class="c-mini"><i class="fa-solid fa-shield-halved"></i> 256-bit encrypted · Reviewed within 1 business day</span>
      </form>
    </div>
  </div>
  <div class="hero-strip container">
    <div><b>26+</b><span data-editable="true">Years serving clients</span></div>
    <div><b>5,200+</b><span data-editable="true">Cases successfully closed</span></div>
    <div><b>$480M</b><span data-editable="true">Recovered for clients</span></div>
    <div><b>98%</b><span data-editable="true">Client retention rate</span></div>
  </div>
</section>

<!-- 2. TRUST / MARQUEE -->
<section class="trust">
  <div class="container">
    <p data-editable="true" class="trust-title">Recognized & referenced by</p>
    <div class="marquee">
      <div class="track">
        <span data-editable="true">Forbes Legal</span><span data-editable="true">Bloomberg Law</span><span data-editable="true">Reuters</span><span data-editable="true">The American Lawyer</span><span data-editable="true">Law360</span><span data-editable="true">Chambers USA</span><span data-editable="true">Super Lawyers</span><span data-editable="true">Best Lawyers</span>
        <span data-editable="true">Forbes Legal</span><span data-editable="true">Bloomberg Law</span><span data-editable="true">Reuters</span><span data-editable="true">The American Lawyer</span><span data-editable="true">Law360</span><span data-editable="true">Chambers USA</span><span data-editable="true">Super Lawyers</span><span data-editable="true">Best Lawyers</span>
      </div>
    </div>
  </div>
</section>

<!-- 3. PRACTICE AREAS -->
<section class="section" id="practice">
  <div class="container">
    <div class="sec-head">
      <span data-editable="true" class="eyebrow"><i class="fa-solid fa-gavel"></i> Practice Areas</span>
      <h2 data-editable="true">Fourteen disciplines. <span data-editable="true" class="ital">One standard of excellence.</span></h2>
      <p data-editable="true" class="sec-sub">From boardroom disputes to family matters, our specialized teams deliver focused representation with the depth of a firm four times our size.</p>
    </div>
    <div class="practice-grid">
      <a data-editable="true" class="pcard reveal"><i class="fa-solid fa-building-columns"></i><h4 data-editable="true">Corporate Law</h4><p data-editable="true">M&A, governance, contracts, shareholder disputes and cross-border transactions.</p><span data-editable="true" class="arrow"><i class="fa-solid fa-arrow-right"></i></span></a>
      <a data-editable="true" class="pcard reveal"><i class="fa-solid fa-people-roof"></i><h4 data-editable="true">Family Law</h4><p data-editable="true">Divorce, custody, prenuptial agreements handled with discretion and empathy.</p><span data-editable="true" class="arrow"><i class="fa-solid fa-arrow-right"></i></span></a>
      <a data-editable="true" class="pcard reveal"><i class="fa-solid fa-user-shield"></i><h4 data-editable="true">Criminal Defense</h4><p data-editable="true">Aggressive representation at every stage — from investigation to appeal.</p><span data-editable="true" class="arrow"><i class="fa-solid fa-arrow-right"></i></span></a>
      <a data-editable="true" class="pcard reveal"><i class="fa-solid fa-car-burst"></i><h4 data-editable="true">Personal Injury</h4><p data-editable="true">No fee unless we win. Auto, workplace, medical negligence and product liability.</p><span data-editable="true" class="arrow"><i class="fa-solid fa-arrow-right"></i></span></a>
      <a data-editable="true" class="pcard reveal"><i class="fa-solid fa-briefcase"></i><h4 data-editable="true">Employment Law</h4><p data-editable="true">Wrongful termination, discrimination, harassment and executive contracts.</p><span data-editable="true" class="arrow"><i class="fa-solid fa-arrow-right"></i></span></a>
      <a data-editable="true" class="pcard reveal"><i class="fa-solid fa-house-chimney"></i><h4 data-editable="true">Real Estate</h4><p data-editable="true">Commercial leasing, closings, zoning and complex title litigation.</p><span data-editable="true" class="arrow"><i class="fa-solid fa-arrow-right"></i></span></a>
      <a data-editable="true" class="pcard reveal"><i class="fa-solid fa-passport"></i><h4 data-editable="true">Immigration</h4><p data-editable="true">Visas, green cards, asylum and citizenship — federal and state level.</p><span data-editable="true" class="arrow"><i class="fa-solid fa-arrow-right"></i></span></a>
      <a data-editable="true" class="pcard reveal"><i class="fa-solid fa-scroll"></i><h4 data-editable="true">Estate Planning</h4><p data-editable="true">Wills, trusts, probate and multi-generational wealth preservation.</p><span data-editable="true" class="arrow"><i class="fa-solid fa-arrow-right"></i></span></a>
    </div>
  </div>
</section>

<!-- 4. ABOUT / WHY US -->
<section class="section about-sec">
  <div class="container about-grid">
    <div class="about-left reveal">
      <div class="justice-frame">
        <img data-editable-img="true" src="/assets/templates/LawFirm/templates03/justice.jpg" alt="Lady Justice"/>
        <div class="jf-badge">
          <i class="fa-solid fa-shield-halved"></i>
          <div><b>Attorney–Client</b><span data-editable="true">Privilege Guaranteed</span></div>
        </div>
        <div class="jf-tag"><b>26</b><span data-editable="true">Years<br/>of Practice</span></div>
      </div>
    </div>
    <div class="about-right reveal">
      <span data-editable="true" class="eyebrow"><i class="fa-solid fa-scale-balanced"></i> About the Firm</span>
      <h2 data-editable="true">A quiet firm with <span data-editable="true" class="ital">a very loud record.</span></h2>
      <p data-editable="true">Founded in 1998 by three senior litigators, Vaeltra Law was built on a single conviction: that every client — from Fortune 500 boards to first-time defendants — deserves the same intensity of preparation and the same clarity of counsel. Our 42 attorneys operate as tightly-knit case teams, not billing silos.</p>
      <div class="values">
        <div><i class="fa-solid fa-check-double"></i><div><b>Trial-Ready, Always</b><span data-editable="true">Every case is prepared as if it will reach a jury — because most cases negotiate better when they're already ready to fight.</span></div></div>
        <div><i class="fa-solid fa-user-tie"></i><div><b>Senior-Partner Access</b><span data-editable="true">You work with a named partner, not a rotating cast of associates.</span></div></div>
        <div><i class="fa-solid fa-lock"></i><div><b>Absolute Confidentiality</b><span data-editable="true">Encrypted portals, private meeting rooms, discretion by default.</span></div></div>
        <div><i class="fa-solid fa-hand-holding-dollar"></i><div><b>Transparent Billing</b><span data-editable="true">Fixed-fee, contingency and blended models. No surprise invoices.</span></div></div>
      </div>
    </div>
  </div>
</section>

<!-- 5. PROCESS -->
<section class="section" id="process">
  <div class="container">
    <div class="sec-head">
      <span data-editable="true" class="eyebrow"><i class="fa-solid fa-diagram-project"></i> Our Process</span>
      <h2 data-editable="true">Clarity from <span data-editable="true" class="ital">day one to verdict.</span></h2>
      <p data-editable="true" class="sec-sub">A transparent four-stage engagement, so you always know what happens next — and what it costs.</p>
    </div>
    <div class="process">
      <div class="p-step reveal"><span data-editable="true" class="num">01</span><h4 data-editable="true">Free Consultation</h4><p data-editable="true">A confidential 30-minute call to understand your matter, review documents, and identify legal risk.</p><ul><li data-editable="true"><i class="fa-solid fa-check"></i> No obligation</li><li data-editable="true"><i class="fa-solid fa-check"></i> Signed NDA on request</li></ul></div>
      <div class="p-step reveal"><span data-editable="true" class="num">02</span><h4 data-editable="true">Case Strategy</h4><p data-editable="true">Within 72 hours you receive a written strategy memo, timeline and fee proposal from your lead partner.</p><ul><li data-editable="true"><i class="fa-solid fa-check"></i> Fixed-fee options</li><li data-editable="true"><i class="fa-solid fa-check"></i> Milestone-based plan</li></ul></div>
      <div class="p-step reveal"><span data-editable="true" class="num">03</span><h4 data-editable="true">Active Representation</h4><p data-editable="true">We negotiate, file, defend and litigate. You get weekly briefings and a live client portal 24/7.</p><ul><li data-editable="true"><i class="fa-solid fa-check"></i> Weekly status reports</li><li data-editable="true"><i class="fa-solid fa-check"></i> Direct partner line</li></ul></div>
      <div class="p-step reveal"><span data-editable="true" class="num">04</span><h4 data-editable="true">Resolution & Beyond</h4><p data-editable="true">Settlement, verdict or closing — we don't leave. Post-matter compliance and prevention are included.</p><ul><li data-editable="true"><i class="fa-solid fa-check"></i> 6-month post-support</li><li data-editable="true"><i class="fa-solid fa-check"></i> Free annual review</li></ul></div>
    </div>
  </div>
</section>

<!-- 6. ATTORNEYS -->
<section class="section attorneys-sec" id="attorneys">
  <div class="container">
    <div class="sec-head">
      <span data-editable="true" class="eyebrow"><i class="fa-solid fa-user-tie"></i> Meet the Team</span>
      <h2 data-editable="true">The attorneys behind <span data-editable="true" class="ital">your peace of mind.</span></h2>
    </div>
    <div class="att-grid">
      <div class="att reveal">
        <div class="att-mono">JR</div>
        <h4 data-editable="true">Jonathan Reeves</h4><span data-editable="true">Managing Partner · Corporate & M&A</span>
        <p data-editable="true">28 years litigating Fortune 500 transactions. Former SDNY prosecutor.</p>
        <div class="chips"><span data-editable="true">Harvard JD</span><span data-editable="true">NY Bar</span></div>
      </div>
      <div class="att reveal">
        <div class="att-mono ac2">EM</div>
        <h4 data-editable="true">Elena Marchetti</h4><span data-editable="true">Partner · Family & Estate</span>
        <p data-editable="true">Trusted counsel to high-net-worth families in complex divorce and succession matters.</p>
        <div class="chips"><span data-editable="true">Columbia LLM</span><span data-editable="true">Certified Mediator</span></div>
      </div>
      <div class="att reveal">
        <div class="att-mono ac3">DK</div>
        <h4 data-editable="true">Daniel Kaur</h4><span data-editable="true">Partner · Criminal Defense</span>
        <p data-editable="true">Board-certified trial specialist. 190+ jury trials, 92% favorable outcomes.</p>
        <div class="chips"><span data-editable="true">Yale JD</span><span data-editable="true">NACDL</span></div>
      </div>
      <div class="att reveal">
        <div class="att-mono ac4">SW</div>
        <h4 data-editable="true">Sarah Whitmore</h4><span data-editable="true">Partner · Personal Injury</span>
        <p data-editable="true">$180M+ recovered for injury victims. Renowned for aggressive settlements.</p>
        <div class="chips"><span data-editable="true">NYU JD</span><span data-editable="true">Top 40 U-40</span></div>
      </div>
    </div>
  </div>
</section>

<!-- 7. RESULTS / CASES -->
<section class="section" id="results">
  <div class="container">
    <div class="sec-head">
      <span data-editable="true" class="eyebrow"><i class="fa-solid fa-trophy"></i> Notable Results</span>
      <h2 data-editable="true">Verdicts that <span data-editable="true" class="ital">changed lives.</span></h2>
      <p data-editable="true" class="sec-sub">Past results do not guarantee future outcomes, but they do reveal the standard we hold ourselves to. A selection of recent public matters:</p>
    </div>
    <div class="results">
      <div class="result reveal"><b>$42.6M</b><h5 data-editable="true">Class-Action Settlement</h5><p data-editable="true">Consumer protection matter against national retailer — represented lead plaintiffs from filing to court-approved distribution.</p><span data-editable="true" class="rtag">Consumer Litigation · 2024</span></div>
      <div class="result reveal"><b>$18.3M</b><h5 data-editable="true">Medical Negligence Verdict</h5><p data-editable="true">Full jury verdict for family of surgical malpractice victim after three-week trial.</p><span data-editable="true" class="rtag">Personal Injury · 2023</span></div>
      <div class="result reveal"><b>$9.1M</b><h5 data-editable="true">Wrongful Termination</h5><p data-editable="true">Recovered severance, equity and reputation-damage award for former C-suite executive.</p><span data-editable="true" class="rtag">Employment · 2024</span></div>
      <div class="result reveal"><b>Dismissed</b><h5 data-editable="true">Federal Criminal Charges</h5><p data-editable="true">18-count indictment fully dismissed pretrial through motion practice and internal cooperation review.</p><span data-editable="true" class="rtag">Criminal Defense · 2025</span></div>
      <div class="result reveal"><b>$27M</b><h5 data-editable="true">Cross-Border M&A</h5><p data-editable="true">Advised acquiring party in EU-to-US technology acquisition, including regulatory clearance.</p><span data-editable="true" class="rtag">Corporate · 2024</span></div>
      <div class="result reveal"><b>Full Custody</b><h5 data-editable="true">Contested Family Matter</h5><p data-editable="true">Secured full custody and asset protection for client in a multi-jurisdictional divorce.</p><span data-editable="true" class="rtag">Family · 2025</span></div>
    </div>
  </div>
</section>

<!-- 8. TESTIMONIALS -->
<section class="section testi-sec">
  <div class="container">
    <div class="sec-head">
      <span data-editable="true" class="eyebrow"><i class="fa-solid fa-quote-right"></i> Client Voices</span>
      <h2 data-editable="true">The measure of a firm <span data-editable="true" class="ital">is who calls it back.</span></h2>
    </div>
    <div class="testi-grid">
      <div class="tcard reveal">
        <div class="stars"><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i></div>
        <p data-editable="true">"Vaeltra didn't just win our case — they made a stressful year feel completely under control. Partner-level attention from week one."</p>
        <div class="t-foot"><b>M. Alvarez</b><span data-editable="true">CEO, Ridgeline Industries</span></div>
      </div>
      <div class="tcard reveal">
        <div class="stars"><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i></div>
        <p data-editable="true">"Elena walked us through the hardest chapter of our lives with dignity. She fought where it mattered and settled where it didn't."</p>
        <div class="t-foot"><b>Anonymous Family Client</b><span data-editable="true">Family Law · Manhattan</span></div>
      </div>
      <div class="tcard reveal">
        <div class="stars"><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i></div>
        <p data-editable="true">"After two years of dismissals from other firms, Daniel's team took our case and dismantled the charges piece by piece. Life-changing."</p>
        <div class="t-foot"><b>R. Chen</b><span data-editable="true">Criminal Defense Client</span></div>
      </div>
      <div class="tcard reveal">
        <div class="stars"><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i></div>
        <p data-editable="true">"They picked up the phone at 9pm on a Sunday. That single moment told me I'd hired the right firm."</p>
        <div class="t-foot"><b>J. Patel</b><span data-editable="true">General Counsel, TerraOne</span></div>
      </div>
    </div>
  </div>
</section>

<!-- 9. INSIGHTS / BLOG + FAQ -->
<section class="section" id="insights">
  <div class="container ins-grid">
    <div class="ins-left reveal">
      <span data-editable="true" class="eyebrow"><i class="fa-solid fa-newspaper"></i> Insights & Legal Briefs</span>
      <h2 data-editable="true">Read what our partners <span data-editable="true" class="ital">are watching.</span></h2>
      <div class="briefs">
        <article class="brief"><span data-editable="true" class="cat">Corporate</span><h4 data-editable="true">What the 2026 SEC amendments mean for closely-held companies</h4><p data-editable="true">A partner-level walkthrough of the disclosure changes and how to prepare governance documents this quarter.</p><span data-editable="true" class="meta">Jonathan Reeves · 8 min read</span></article>
        <article class="brief"><span data-editable="true" class="cat">Family</span><h4 data-editable="true">Prenuptial agreements: 7 clauses courts increasingly refuse to enforce</h4><p data-editable="true">Recent appellate decisions are narrowing enforceability. Here's how to draft agreements that hold up.</p><span data-editable="true" class="meta">Elena Marchetti · 6 min read</span></article>
        <article class="brief"><span data-editable="true" class="cat">Injury</span><h4 data-editable="true">Why "no-fault" doesn't mean no recovery — a practical guide</h4><p data-editable="true">Understanding thresholds, serious-injury definitions, and when to escalate a claim to litigation.</p><span data-editable="true" class="meta">Sarah Whitmore · 5 min read</span></article>
        <article class="brief"><span data-editable="true" class="cat">Criminal</span><h4 data-editable="true">Digital evidence: what prosecutors get from your phone, and what they can't</h4><p data-editable="true">The rules changed. If your matter involves messaging apps or cloud storage, this brief is essential.</p><span data-editable="true" class="meta">Daniel Kaur · 7 min read</span></article>
      </div>
    </div>
    <aside class="ins-right reveal" id="faq">
      <span data-editable="true" class="eyebrow"><i class="fa-solid fa-circle-question"></i> FAQ</span>
      <h3 data-editable="true">Questions clients ask most</h3>
      <div class="acc">
        <details open><summary>Is the first consultation really free?<i class="fa-solid fa-plus"></i></summary><p data-editable="true">Yes. Every new matter starts with a 30-minute confidential consultation at no cost and no obligation.</p></details>
        <details><summary>How do you charge for cases?<i class="fa-solid fa-plus"></i></summary><p data-editable="true">Depending on the matter: fixed-fee, hourly with a cap, milestone-based, or contingency (injury cases). You approve the model before we start.</p></details>
        <details><summary>Will I work directly with a partner?<i class="fa-solid fa-plus"></i></summary><p data-editable="true">Yes. A named partner leads every engagement and is personally reachable throughout your case.</p></details>
        <details><summary>What if my case is outside New York?<i class="fa-solid fa-plus"></i></summary><p data-editable="true">We are admitted in 12 states and coordinate a nationwide network of co-counsel for federal and multi-state matters.</p></details>
        <details><summary>How confidential is my information?<i class="fa-solid fa-plus"></i></summary><p data-editable="true">Attorney–client privilege applies from the first conversation. We use encrypted intake and private client portals.</p></details>
      </div>
    </aside>
  </div>
</section>

<!-- 10. CONSULTATION CTA + FOOTER -->
<section class="section consult" id="consult">
  <div class="container consult-grid">
    <div class="c-left reveal">
      <span data-editable="true" class="eyebrow light"><i class="fa-solid fa-scale-balanced"></i> Free Case Review</span>
      <h2 data-editable="true">Tell us what happened. <span data-editable="true" class="ital">We'll tell you where you stand.</span></h2>
      <p data-editable="true">Submit a short summary of your matter. A senior attorney reviews every request personally and responds within one business day — usually the same day.</p>
      <ul class="c-list">
        <li data-editable="true"><i class="fa-solid fa-shield-halved"></i> Fully confidential — protected by attorney–client privilege</li>
        <li data-editable="true"><i class="fa-solid fa-clock"></i> Same-day response, 7 days a week</li>
        <li data-editable="true"><i class="fa-solid fa-hand-holding-dollar"></i> No fees, no obligation, no pressure</li>
        <li data-editable="true"><i class="fa-solid fa-user-tie"></i> Reviewed by a named partner, not an intake bot</li>
      </ul>
    </div>
    <div class="hero-photo reveal">
      <img data-editable-img="true" src="/assets/templates/LawFirm/templates03/hero-lawyer.jpg" alt="Senior attorney at Vaeltra Law"/>
      <div class="hp-badge tl">
        <i class="fa-solid fa-award"></i>
        <div><b>Super Lawyers</b><span data-editable="true">2019 – 2025</span></div>
      </div>
      <div class="hp-badge br">
        <div class="rating">
          <div class="stars"><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i></div>
          <b>4.9 / 5</b>
          <span data-editable="true">from 1,840 clients</span>
        </div>
      </div>
      <div class="hp-tag">
        <span data-editable="true" class="pulse"></span> Free 30-min case review
      </div>
    </div>
  </div>
</section>

<!-- FOOTER -->
<footer class="footer">
  <div class="container">
    <div class="foot-top">
      <div class="fc-brand">
        <a data-editable="true" href="#" class="logo light">LOGO_PLACEHOLDER</a>
        <p data-editable="true">A boutique full-service law firm serving individuals and enterprises across 12 states. Trial-tested. Client-obsessed.</p>
        <div class="socials">
          <a data-editable="true"><i class="fa-brands fa-linkedin"></i></a>
          <a data-editable="true"><i class="fa-brands fa-twitter"></i></a>
          <a data-editable="true"><i class="fa-brands fa-facebook"></i></a>
          <a data-editable="true"><i class="fa-brands fa-instagram"></i></a>
        </div>
      </div>
      <div><b>Practice</b><a data-editable="true">Corporate</a><a data-editable="true">Family</a><a data-editable="true">Criminal</a><a data-editable="true">Personal Injury</a><a data-editable="true">Employment</a></div>
      <div><b>Firm</b><a data-editable="true">About</a><a data-editable="true">Attorneys</a><a data-editable="true">Careers</a><a data-editable="true">Diversity</a><a data-editable="true">Pro Bono</a></div>
      <div><b>Resources</b><a data-editable="true">Legal Insights</a><a data-editable="true">Case Results</a><a data-editable="true">Press</a><a data-editable="true">FAQ</a><a data-editable="true">Client Portal</a></div>
      <div><b>Contact</b><a data-editable="true"><i class="fa-solid fa-location-dot"></i> ADDRESS_PLACEHOLDER</a><a data-editable="true"><i class="fa-solid fa-phone"></i> PHONE_PLACEHOLDER</a><a data-editable="true"><i class="fa-solid fa-envelope"></i> EMAIL_PLACEHOLDER</a></div>
    </div>
    <div class="foot-bottom">
      <span data-editable="true">© 2026 PROJECT_NAME_PLACEHOLDER. Attorney Advertising. Prior results do not guarantee similar outcomes.</span>
      <span data-editable="true" class="pays">Privacy · Terms · Disclaimer</span>
    </div>
  </div>
</footer>

<button data-editable="true" id="toTop" class="to-top"><i class="fa-solid fa-arrow-up"></i></button>

<script>

// Nav shadow on scroll
const nav = document.getElementById('nav');
const toTop = document.getElementById('toTop');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
  toTop.classList.toggle('show', window.scrollY > 500);
});

// Hamburger
document.getElementById('hamburger')?.addEventListener('click', () => {
  document.getElementById('navLinks').classList.toggle('open');
});

// Reveal on scroll
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => e.isIntersecting && e.target.classList.add('in'));
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Back to top
toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// Toast
const toast = document.getElementById('toast');
const showToast = (msg) => {
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2800);
};

// Consultation form
document.getElementById('consultForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  showToast('⚖️ Request received — a partner will contact you shortly.');
  e.target.reset();
});

// Smooth anchor scroll + close mobile menu
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    if (id.length > 1) {
      const t = document.querySelector(id);
      if (t) {
        e.preventDefault();
        t.scrollIntoView({ behavior: 'smooth' });
        document.getElementById('navLinks')?.classList.remove('open');
      }
    }
  });
});

// FAQ single-open behavior
const faqs = document.querySelectorAll('.acc details');
faqs.forEach(d => d.addEventListener('toggle', () => {
  if (d.open) faqs.forEach(o => { if (o !== d) o.open = false; });
}));

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
      }
    }, true);
  })();
</script>
`;