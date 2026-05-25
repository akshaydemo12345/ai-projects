// Healthcare Template 04— Ultra Premium Light
// Modern, creative, high-end design
// NO hardcoded colors — all PRIMARY_COLOR_PLACEHOLDER / SECONDARY_COLOR_PLACEHOLDER

export const healthcare04Styles = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap');

:root {
  --primary:   PRIMARY_COLOR_PLACEHOLDER;
  --secondary: SECONDARY_COLOR_PLACEHOLDER;
  --p-rgb:     PRIMARY_RGB_PLACEHOLDER;
  --s-rgb:     SECONDARY_RGB_PLACEHOLDER;
  --white:     #ffffff;
  --off-white: #f9fafb;
  --surface:   #f3f4f6;
  --ink:       #0a0a0f;
  --ink-2:     #1c1c27;
  --ink-3:     #6b7280;
  --ink-4:     #9ca3af;
  --border:    #e5e7eb;
  --border-2:  #d1d5db;
  --radius-xs: 6px;
  --radius-sm: 12px;
  --radius-md: 20px;
  --radius-lg: 32px;
  --radius-xl: 48px;
  --shadow-xs: 0 1px 3px rgba(0,0,0,0.06);
  --shadow-sm: 0 4px 16px rgba(0,0,0,0.08);
  --shadow-md: 0 12px 40px rgba(0,0,0,0.12);
  --shadow-lg: 0 32px 80px rgba(0,0,0,0.16);
  --font-head: 'Syne', sans-serif;
  --font-serif:'Instrument Serif', serif;
  --font-body: 'Inter', sans-serif;
  --ease-expo: cubic-bezier(0.16,1,0.3,1);
  --ease-back: cubic-bezier(0.34,1.56,0.64,1);
}

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth;-webkit-font-smoothing:antialiased}
body{font-family:var(--font-body);background:var(--white);color:var(--ink);font-size:16px;line-height:1.6;overflow-x:hidden}
img{max-width:100%;height:auto;display:block}
a{text-decoration:none;color:inherit}
button{cursor:pointer;border:none;background:none;font-family:inherit}
ul{list-style:none}
input,select,textarea{font-family:inherit}

/* ── SCROLL ANIMATIONS ── */
[data-reveal]{opacity:0;transform:translateY(40px);transition:opacity 0.9s var(--ease-expo),transform 0.9s var(--ease-expo)}
[data-reveal="left"]{transform:translateX(-40px)}
[data-reveal="right"]{transform:translateX(40px)}
[data-reveal="scale"]{transform:scale(0.92);opacity:0}
[data-reveal="fade"]{transform:none;opacity:0}
[data-reveal].visible{opacity:1;transform:none}
[data-delay="1"]{transition-delay:0.1s}
[data-delay="2"]{transition-delay:0.2s}
[data-delay="3"]{transition-delay:0.3s}
[data-delay="4"]{transition-delay:0.4s}
[data-delay="5"]{transition-delay:0.5s}
[data-delay="6"]{transition-delay:0.6s}

/* ── LAYOUT ── */
.hc4-wrap{width:100%;max-width:1240px;margin:0 auto;padding:0 24px}
.hc4-section{padding:120px 0}
.hc4-section-sm{padding:80px 0}

/* ── PILL TAG ── */
.hc4-pill{
  display:inline-flex;align-items:center;gap:8px;
  padding:7px 18px;border-radius:100px;
  border:1px solid rgba(var(--p-rgb),0.2);
  background:rgba(var(--p-rgb),0.06);
  color:var(--primary);
  font-family:var(--font-body);font-size:12px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;
}
.hc4-pill-dot{width:6px;height:6px;border-radius:50%;background:var(--primary);animation:pulse-dot 2s infinite}
@keyframes pulse-dot{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.5;transform:scale(0.7)}}

/* ── SECTION HEADING ── */
.hc4-head{display:flex;flex-direction:column;gap:16px;margin-bottom:64px}
.hc4-head-center{align-items:center;text-align:center}
.hc4-head-center p{max-width:520px;margin:0 auto}
.hc4-h1{font-family:var(--font-head);font-size:clamp(44px,6vw,76px);font-weight:800;line-height:1.05;letter-spacing:-0.03em;color:var(--ink)}
.hc4-h2{font-family:var(--font-head);font-size:clamp(32px,4vw,52px);font-weight:700;line-height:1.1;letter-spacing:-0.02em;color:var(--ink)}
.hc4-h3{font-family:var(--font-head);font-size:22px;font-weight:700;line-height:1.25;color:var(--ink)}
.hc4-h4{font-family:var(--font-body);font-size:15px;font-weight:600;color:var(--ink)}
.hc4-body{font-family:var(--font-body);font-size:16px;line-height:1.75;color:var(--ink-3);font-weight:400}
.hc4-body-sm{font-family:var(--font-body);font-size:14px;line-height:1.65;color:var(--ink-3)}
.hc4-serif{font-family:var(--font-serif);font-style:italic;color:var(--primary)}

/* ── BUTTONS ── */
.hc4-btn{
  display:inline-flex;align-items:center;justify-content:center;gap:10px;
  padding:14px 28px;border-radius:var(--radius-sm);
  font-family:var(--font-body);font-size:15px;font-weight:600;
  cursor:pointer;transition:all 0.25s var(--ease-expo);white-space:nowrap;
}
.hc4-btn-primary{
  background:var(--primary);color:#fff;
  box-shadow:0 4px 20px rgba(var(--p-rgb),0.35);
}
.hc4-btn-primary:hover{transform:translateY(-2px);box-shadow:0 8px 32px rgba(var(--p-rgb),0.45)}
.hc4-btn-primary:active{transform:translateY(0)}
.hc4-btn-outline{
  background:transparent;color:var(--primary);
  border:2px solid rgba(var(--p-rgb),0.25);
}
.hc4-btn-outline:hover{background:rgba(var(--p-rgb),0.06);border-color:var(--primary)}
.hc4-btn-dark{background:var(--ink);color:#fff}
.hc4-btn-dark:hover{background:var(--ink-2);transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,0.25)}
.hc4-btn-white{background:#fff;color:var(--ink);box-shadow:var(--shadow-sm)}
.hc4-btn-white:hover{box-shadow:var(--shadow-md);transform:translateY(-2px)}
.hc4-btn-icon{width:48px;height:48px;padding:0;border-radius:50%}

/* ── NAV ── */
.hc4-nav{
  position:sticky;top:0;z-index:100;
  background:rgba(255,255,255,0.88);
  backdrop-filter:blur(24px);
  border-bottom:1px solid var(--border);
}
.hc4-nav-inner{
  display:flex;align-items:center;justify-content:space-between;
  padding:16px 24px;max-width:1240px;margin:0 auto;
}
.hc4-nav-logo{
  display:flex;align-items:center;gap:10px;
  font-family:var(--font-head);font-size:20px;font-weight:800;color:var(--ink);
}
.hc4-nav-logo-icon{
  width:36px;height:36px;border-radius:10px;
  background:var(--primary);
  display:flex;align-items:center;justify-content:center;
  font-size:18px;color:#fff;font-weight:800;font-family:var(--font-head);
}
.hc4-nav-links{display:none;align-items:center;gap:32px}
.hc4-nav-links a{font-size:14px;font-weight:500;color:var(--ink-3);transition:color 0.2s}
.hc4-nav-links a:hover{color:var(--primary)}
.hc4-nav-actions{display:flex;align-items:center;gap:12px}

/* ── SECTION 1: HERO ── */
.hc4-hero{
  min-height:calc(100vh - 70px);
  padding:80px 0 0;
  background:var(--white);
  position:relative;overflow:hidden;
  display:flex;align-items:center;
}
.hc4-hero-grid{
  display:grid;grid-template-columns:1fr;
  gap:60px;align-items:center;
  position:relative;z-index:2;
  width:100%;
}
/* Soft gradient blob */
.hc4-hero-blob{
  position:absolute;top:-200px;right:-200px;
  width:700px;height:700px;border-radius:50%;
  background:radial-gradient(circle,rgba(var(--p-rgb),0.12) 0%,transparent 70%);
  pointer-events:none;animation:blob-float 8s ease-in-out infinite;
}
.hc4-hero-blob-2{
  position:absolute;bottom:-300px;left:-150px;
  width:600px;height:600px;border-radius:50%;
  background:radial-gradient(circle,rgba(var(--s-rgb),0.08) 0%,transparent 70%);
  pointer-events:none;animation:blob-float 10s ease-in-out infinite reverse;
}
@keyframes blob-float{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(20px,-30px) scale(1.05)}}
.hc4-hero-eyebrow{display:flex;align-items:center;gap:12px;margin-bottom:24px}
.hc4-hero-eyebrow-line{height:1px;width:40px;background:var(--primary);opacity:0.5}
.hc4-hero-eyebrow-txt{font-size:12px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:var(--primary)}
.hc4-hero-badges{display:flex;flex-wrap:wrap;gap:10px;margin-top:32px}
.hc4-hero-badge{
  display:flex;align-items:center;gap:8px;
  padding:8px 16px;border-radius:100px;
  background:var(--off-white);border:1px solid var(--border);
  font-size:13px;font-weight:500;color:var(--ink-2);
}
.hc4-hero-badge svg{width:14px;height:14px;stroke:var(--primary);fill:none;stroke-width:2.5}
.hc4-hero-actions{display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin-top:36px}
/* Image side */
.hc4-hero-visual{position:relative}
.hc4-hero-img-main{
  border-radius:var(--radius-lg);overflow:hidden;
  aspect-ratio:4/5;position:relative;
  box-shadow:var(--shadow-lg);
}
.hc4-hero-img-main img{width:100%;height:100%;object-fit:cover;transition:transform 0.8s var(--ease-expo)}
.hc4-hero-img-main:hover img{transform:scale(1.04)}
/* Floating cards */
.hc4-float-card{
  position:absolute;background:#fff;
  border-radius:var(--radius-sm);
  box-shadow:var(--shadow-md);
  border:1px solid var(--border);
  padding:14px 18px;
  animation:float-up 6s ease-in-out infinite;
}
@keyframes float-up{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
.hc4-float-card-1{bottom:36px;left:-24px;display:flex;align-items:center;gap:12px;animation-delay:-2s}
.hc4-float-card-2{top:32px;right:-20px;text-align:center;animation-delay:-4s}
.hc4-float-card-3{bottom:120px;right:-16px;display:flex;align-items:center;gap:10px;animation-delay:-1s}
.hc4-fc-icon{
  width:40px;height:40px;border-radius:10px;
  background:rgba(var(--p-rgb),0.1);
  display:flex;align-items:center;justify-content:center;font-size:20px;
}
.hc4-fc-txt-big{font-family:var(--font-head);font-size:26px;font-weight:800;color:var(--primary)}
.hc4-fc-txt-sm{font-size:11px;font-weight:600;color:var(--ink-4);letter-spacing:0.05em;text-transform:uppercase}
.hc4-fc-label{font-size:13px;font-weight:600;color:var(--ink-2)}
.hc4-fc-sub{font-size:11px;color:var(--ink-4)}
/* Scroll hint */
.hc4-hero-scroll{
  display:flex;align-items:center;gap:12px;margin-top:48px;
  font-size:12px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:var(--ink-4);
}
.hc4-scroll-line{width:40px;height:1px;background:var(--border-2);position:relative;overflow:hidden}
.hc4-scroll-line::after{content:'';position:absolute;top:0;left:-100%;width:100%;height:100%;background:var(--primary);animation:scroll-slide 2s ease-in-out infinite}
@keyframes scroll-slide{0%{left:-100%}100%{left:100%}}

/* ── SECTION 2: MARQUEE TRUST BAR ── */
.hc4-trust-bar{
  padding:20px 0;
  background:var(--off-white);
  border-top:1px solid var(--border);border-bottom:1px solid var(--border);
  overflow:hidden;
}
.hc4-marquee-track{
  display:flex;gap:48px;align-items:center;
  animation:marquee-scroll 22s linear infinite;
  width:max-content;
}
.hc4-marquee-track:hover{animation-play-state:paused}
@keyframes marquee-scroll{from{transform:translateX(0)}to{transform:translateX(-50%)}}
.hc4-marquee-item{
  display:flex;align-items:center;gap:10px;
  font-size:13px;font-weight:600;color:var(--ink-3);white-space:nowrap;
}
.hc4-marquee-icon{font-size:16px}
.hc4-marquee-divider{width:4px;height:4px;border-radius:50%;background:var(--border-2)}

/* ── SECTION 3: SERVICES ── */
.hc4-services-grid{
  display:grid;grid-template-columns:1fr;gap:20px;
}
.hc4-svc-card{
  position:relative;background:#fff;
  border-radius:var(--radius-md);padding:36px;
  border:1px solid var(--border);
  overflow:hidden;transition:all 0.4s var(--ease-expo);
  cursor:default;
}
.hc4-svc-card::before{
  content:'';position:absolute;inset:0;
  background:linear-gradient(135deg,rgba(var(--p-rgb),0.04),transparent);
  opacity:0;transition:opacity 0.4s;
}
.hc4-svc-card:hover{transform:translateY(-6px);box-shadow:var(--shadow-md);border-color:rgba(var(--p-rgb),0.2)}
.hc4-svc-card:hover::before{opacity:1}
.hc4-svc-num{
  font-family:var(--font-head);font-size:48px;font-weight:800;
  color:rgba(var(--p-rgb),0.08);line-height:1;
  margin-bottom:16px;
}
.hc4-svc-icon-wrap{
  width:52px;height:52px;border-radius:var(--radius-sm);
  background:rgba(var(--p-rgb),0.08);
  display:flex;align-items:center;justify-content:center;
  margin-bottom:20px;transition:background 0.3s;
}
.hc4-svc-card:hover .hc4-svc-icon-wrap{background:var(--primary)}
.hc4-svc-icon-wrap svg{width:24px;height:24px;stroke:var(--primary);fill:none;stroke-width:1.8;transition:stroke 0.3s}
.hc4-svc-card:hover .hc4-svc-icon-wrap svg{stroke:#fff}
.hc4-svc-card h3{margin-bottom:10px}
.hc4-svc-card p{margin-bottom:20px}
.hc4-svc-link{
  display:inline-flex;align-items:center;gap:6px;
  font-size:13px;font-weight:600;color:var(--primary);
  transition:gap 0.2s;
}
.hc4-svc-card:hover .hc4-svc-link{gap:10px}
.hc4-svc-arrow{width:14px;height:14px;stroke:var(--primary);fill:none;stroke-width:2.5}
/* Numbers grid accent */
.hc4-svc-count-strip{
  display:grid;grid-template-columns:repeat(4,1fr);
  gap:1px;background:var(--border);
  border-radius:var(--radius-sm);overflow:hidden;
  margin-top:56px;
}
.hc4-svc-count-item{
  background:#fff;padding:28px 24px;text-align:center;
  transition:background 0.3s;
}
.hc4-svc-count-item:hover{background:rgba(var(--p-rgb),0.04)}
.hc4-svc-count-num{
  font-family:var(--font-head);font-size:36px;font-weight:800;
  color:var(--primary);line-height:1;margin-bottom:6px;
}
.hc4-svc-count-lbl{font-size:12px;font-weight:600;color:var(--ink-3);letter-spacing:0.04em}

/* ── SECTION 4: ABOUT SPLIT ── */
.hc4-about-grid{display:grid;grid-template-columns:1fr;gap:72px;align-items:center}
.hc4-about-visual{position:relative}
.hc4-about-img-main{
  border-radius:var(--radius-lg);overflow:hidden;aspect-ratio:3/4;
  box-shadow:var(--shadow-lg);position:relative;z-index:1;
}
.hc4-about-img-main img{width:100%;height:100%;object-fit:cover;transition:transform 0.8s var(--ease-expo)}
.hc4-about-img-main:hover img{transform:scale(1.04)}
.hc4-about-img-accent{
  position:absolute;bottom:-24px;right:-24px;
  width:55%;border-radius:var(--radius-md);overflow:hidden;
  aspect-ratio:4/3;box-shadow:var(--shadow-md);
  border:4px solid #fff;z-index:2;
}
.hc4-about-img-accent img{width:100%;height:100%;object-fit:cover}
.hc4-about-exp-badge{
  position:absolute;top:24px;left:-20px;z-index:3;
  background:var(--primary);border-radius:var(--radius-sm);
  padding:16px 20px;color:#fff;text-align:center;
  box-shadow:0 8px 32px rgba(var(--p-rgb),0.4);
}
.hc4-about-exp-badge .big{font-family:var(--font-head);font-size:36px;font-weight:800;line-height:1}
.hc4-about-exp-badge .sm{font-size:11px;font-weight:600;opacity:0.8;letter-spacing:0.06em}
.hc4-about-text{display:flex;flex-direction:column;gap:28px}
.hc4-about-points{display:flex;flex-direction:column;gap:24px}
.hc4-about-pt{
  display:flex;gap:18px;align-items:flex-start;
  padding:20px;border-radius:var(--radius-sm);
  border:1px solid var(--border);
  transition:all 0.3s var(--ease-expo);
}
.hc4-about-pt:hover{border-color:rgba(var(--p-rgb),0.25);background:rgba(var(--p-rgb),0.02);transform:translateX(6px)}
.hc4-about-pt-icon{
  flex-shrink:0;width:44px;height:44px;border-radius:var(--radius-xs);
  background:rgba(var(--p-rgb),0.08);
  display:flex;align-items:center;justify-content:center;
}
.hc4-about-pt-icon svg{width:20px;height:20px;stroke:var(--primary);fill:none;stroke-width:2}
.hc4-about-pt h4{margin-bottom:4px}

/* ── SECTION 5: DOCTORS ── */
.hc4-doctors-bg{background:var(--off-white)}
.hc4-doctors-grid{display:grid;grid-template-columns:1fr;gap:24px}
.hc4-doc-card{
  background:#fff;border-radius:var(--radius-md);
  overflow:hidden;border:1px solid var(--border);
  transition:all 0.4s var(--ease-expo);
  display:flex;flex-direction:column;
}
.hc4-doc-card:hover{transform:translateY(-6px);box-shadow:var(--shadow-md);border-color:rgba(var(--p-rgb),0.15)}
.hc4-doc-img{aspect-ratio:1;overflow:hidden;background:var(--surface)}
.hc4-doc-img img{width:100%;height:100%;object-fit:cover;transition:transform 0.6s var(--ease-expo)}
.hc4-doc-card:hover .hc4-doc-img img{transform:scale(1.06)}
.hc4-doc-body{padding:24px;display:flex;flex-direction:column;gap:8px;flex:1}
.hc4-doc-specialty{
  display:inline-flex;padding:4px 10px;
  border-radius:100px;background:rgba(var(--p-rgb),0.08);
  font-size:11px;font-weight:600;color:var(--primary);
  letter-spacing:0.05em;text-transform:uppercase;
  align-self:flex-start;
}
.hc4-doc-name{font-family:var(--font-head);font-size:18px;font-weight:700;color:var(--ink)}
.hc4-doc-exp{font-size:13px;color:var(--ink-3)}
.hc4-doc-rating{display:flex;align-items:center;gap:4px;margin-top:4px}
.hc4-doc-rating-stars{display:flex;gap:2px}
.hc4-doc-rating-star{font-size:13px;color:var(--primary)}
.hc4-doc-rating-txt{font-size:12px;font-weight:600;color:var(--ink-3);margin-left:4px}

/* ── SECTION 6: TESTIMONIALS ── */
.hc4-testi-layout{display:grid;grid-template-columns:1fr;gap:32px;align-items:start}
.hc4-testi-featured{
  background:var(--ink);border-radius:var(--radius-lg);
  padding:48px;position:relative;overflow:hidden;
  display:flex;flex-direction:column;gap:28px;
}
.hc4-testi-featured::before{
  content:open-quote;
  position:absolute;top:20px;right:36px;
  font-size:160px;font-family:var(--font-serif);
  color:rgba(255,255,255,0.05);line-height:1;pointer-events:none;
}
.hc4-testi-stars-row{display:flex;gap:4px}
.hc4-testi-star{font-size:16px;color:var(--primary)}
.hc4-testi-text{
  font-family:var(--font-serif);font-style:italic;
  font-size:clamp(18px,2.5vw,24px);line-height:1.5;color:#fff;
}
.hc4-testi-author{display:flex;align-items:center;gap:14px}
.hc4-testi-avatar{
  width:48px;height:48px;border-radius:50%;overflow:hidden;
  border:2px solid rgba(var(--p-rgb),0.5);
}
.hc4-testi-avatar img{width:100%;height:100%;object-fit:cover}
.hc4-testi-name{font-size:14px;font-weight:600;color:#fff}
.hc4-testi-role{font-size:12px;color:rgba(255,255,255,0.45)}
.hc4-testi-list{display:flex;flex-direction:column;gap:16px}
.hc4-testi-mini{
  background:#fff;border-radius:var(--radius-sm);
  padding:24px;border:1px solid var(--border);
  display:flex;flex-direction:column;gap:12px;
  transition:all 0.3s var(--ease-expo);
}
.hc4-testi-mini:hover{border-color:rgba(var(--p-rgb),0.2);box-shadow:var(--shadow-sm);transform:translateX(4px)}
.hc4-testi-mini-text{font-size:14px;line-height:1.65;color:var(--ink-3);font-style:italic}
.hc4-testi-mini-author{display:flex;align-items:center;gap:10px}
.hc4-testi-mini-avatar{width:36px;height:36px;border-radius:50%;overflow:hidden;background:var(--surface)}
.hc4-testi-mini-avatar img{width:100%;height:100%;object-fit:cover}
.hc4-testi-mini-name{font-size:13px;font-weight:600;color:var(--ink-2)}
.hc4-testi-mini-role{font-size:11px;color:var(--ink-4)}

/* ── SECTION 7: CTA ── */
.hc4-cta-section{
  background:linear-gradient(135deg,var(--primary) 0%,var(--secondary) 100%);
  position:relative;overflow:hidden;
}
.hc4-cta-noise{
  position:absolute;inset:0;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
  opacity:0.3;pointer-events:none;
}
.hc4-cta-grid{
  position:relative;z-index:1;
  display:grid;grid-template-columns:1fr;gap:48px;align-items:center;
}
.hc4-cta-text{display:flex;flex-direction:column;gap:20px}
.hc4-cta-text h2{font-family:var(--font-head);font-size:clamp(30px,4vw,52px);font-weight:800;color:#fff;line-height:1.1}
.hc4-cta-text p{font-size:17px;color:rgba(255,255,255,0.8);max-width:420px;line-height:1.7}
.hc4-cta-checks{display:flex;flex-direction:column;gap:12px}
.hc4-cta-check{display:flex;align-items:center;gap:10px;font-size:14px;font-weight:500;color:rgba(255,255,255,0.9)}
.hc4-cta-check-icon{
  width:22px;height:22px;border-radius:50%;
  background:rgba(255,255,255,0.15);
  display:flex;align-items:center;justify-content:center;flex-shrink:0;
}
.hc4-cta-check-icon svg{width:12px;height:12px;stroke:#fff;fill:none;stroke-width:3}
.hc4-cta-form{
  background:rgba(255,255,255,0.12);
  backdrop-filter:blur(24px);
  border:1px solid rgba(255,255,255,0.2);
  border-radius:var(--radius-lg);padding:40px;
}
.hc4-cta-form-title{font-family:var(--font-head);font-size:20px;font-weight:700;color:#fff;margin-bottom:24px}
.hc4-form-row{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.hc4-form-group{margin-bottom:14px}
.hc4-form-label{display:block;font-size:11px;font-weight:600;color:rgba(255,255,255,0.7);margin-bottom:7px;letter-spacing:0.06em;text-transform:uppercase}
.hc4-form-input{
  width:100%;padding:13px 16px;
  background:rgba(255,255,255,0.12);
  border:1px solid rgba(255,255,255,0.2);
  border-radius:var(--radius-xs);
  color:#fff;font-size:14px;font-weight:400;
  transition:all 0.2s;
}
.hc4-form-input::placeholder{color:rgba(255,255,255,0.4)}
.hc4-form-input:focus{outline:none;border-color:rgba(255,255,255,0.6);background:rgba(255,255,255,0.18)}
.hc4-form-submit{
  width:100%;margin-top:6px;
  padding:15px;border-radius:var(--radius-xs);
  background:#fff;color:var(--primary);
  font-size:15px;font-weight:700;
  cursor:pointer;transition:all 0.25s var(--ease-expo);
}
.hc4-form-submit:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,0.2)}

/* ── SECTION 8: FAQ ── */
.hc4-faq-layout{display:grid;grid-template-columns:1fr;gap:56px;align-items:start}
.hc4-faq-left{display:flex;flex-direction:column;gap:24px}
.hc4-faq-left p{max-width:360px}
.hc4-faq-contact-card{
  background:rgba(var(--p-rgb),0.06);
  border:1px solid rgba(var(--p-rgb),0.15);
  border-radius:var(--radius-md);padding:28px;
  display:flex;flex-direction:column;gap:16px;
}
.hc4-faq-contact-card h4{font-family:var(--font-head);font-size:18px;font-weight:700}
.hc4-faq-contact-card p{font-size:14px;color:var(--ink-3)}
.hc4-faq-list{display:flex;flex-direction:column;gap:8px}
.hc4-faq-item{
  border-radius:var(--radius-sm);
  border:1px solid var(--border);
  background:#fff;overflow:hidden;
  transition:border-color 0.3s;
}
.hc4-faq-item[open]{border-color:rgba(var(--p-rgb),0.25)}
.hc4-faq-summary{
  display:flex;justify-content:space-between;align-items:center;
  padding:20px 24px;cursor:pointer;
  font-size:15px;font-weight:600;color:var(--ink);
  list-style:none;user-select:none;gap:16px;
}
.hc4-faq-summary::-webkit-details-marker{display:none}
.hc4-faq-item[open] .hc4-faq-summary{color:var(--primary)}
.hc4-faq-icon{
  flex-shrink:0;width:32px;height:32px;border-radius:50%;
  border:1.5px solid var(--border-2);
  display:flex;align-items:center;justify-content:center;
  transition:all 0.3s;
}
.hc4-faq-item[open] .hc4-faq-icon{background:var(--primary);border-color:var(--primary)}
.hc4-faq-icon svg{width:14px;height:14px;stroke:var(--ink-3);fill:none;stroke-width:2.5;transition:all 0.3s}
.hc4-faq-item[open] .hc4-faq-icon svg{stroke:#fff;transform:rotate(45deg)}
.hc4-faq-body{padding:0 24px 20px;font-size:14px;line-height:1.75;color:var(--ink-3)}

/* ── FOOTER ── */
.hc4-footer{background:var(--ink);color:rgba(255,255,255,0.6)}
.hc4-footer-main{
  display:grid;grid-template-columns:1fr;gap:48px;
  padding:72px 24px;max-width:1240px;margin:0 auto;
}
.hc4-footer-brand{display:flex;flex-direction:column;gap:18px}
.hc4-footer-logo-row{display:flex;align-items:center;gap:10px}
.hc4-footer-logo-icon{
  width:34px;height:34px;border-radius:8px;
  background:var(--primary);
  display:flex;align-items:center;justify-content:center;
  font-size:16px;font-weight:800;color:#fff;font-family:var(--font-head);
}
.hc4-footer-logo-name{font-family:var(--font-head);font-size:18px;font-weight:800;color:#fff}
.hc4-footer-brand p{font-size:14px;line-height:1.7;max-width:260px}
.hc4-footer-socials{display:flex;gap:10px}
.hc4-footer-social{
  width:36px;height:36px;border-radius:8px;
  border:1px solid rgba(255,255,255,0.1);
  display:flex;align-items:center;justify-content:center;
  transition:all 0.2s;
}
.hc4-footer-social:hover{background:var(--primary);border-color:var(--primary)}
.hc4-footer-social svg{width:16px;height:16px;stroke:rgba(255,255,255,0.6);fill:none;stroke-width:2;transition:stroke 0.2s}
.hc4-footer-social:hover svg{stroke:#fff}
.hc4-footer-col h5{font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:rgba(255,255,255,0.35);margin-bottom:18px}
.hc4-footer-links{display:flex;flex-direction:column;gap:10px}
.hc4-footer-links a{font-size:14px;color:rgba(255,255,255,0.55);transition:color 0.2s}
.hc4-footer-links a:hover{color:#fff}
.hc4-footer-contact-list{display:flex;flex-direction:column;gap:12px}
.hc4-footer-contact-item{display:flex;align-items:flex-start;gap:10px;font-size:14px}
.hc4-footer-contact-icon{
  width:28px;height:28px;border-radius:6px;
  background:rgba(var(--p-rgb),0.15);flex-shrink:0;
  display:flex;align-items:center;justify-content:center;
}
.hc4-footer-contact-icon svg{width:14px;height:14px;stroke:var(--primary);fill:none;stroke-width:2}
.hc4-footer-bottom{
  border-top:1px solid rgba(255,255,255,0.06);
  padding:20px 24px;max-width:1240px;margin:0 auto;
  display:flex;flex-direction:column;gap:8px;align-items:center;text-align:center;
}
.hc4-footer-bottom p{font-size:12px;color:rgba(255,255,255,0.25)}

/* ── RESPONSIVE ── */
@media(min-width:640px){
  .hc4-services-grid{grid-template-columns:1fr 1fr}
  .hc4-doctors-grid{grid-template-columns:1fr 1fr}
}
@media(min-width:768px){
  .hc4-nav-links{display:flex}
  .hc4-hero-grid{grid-template-columns:1fr 1fr}
  .hc4-testi-layout{grid-template-columns:1fr 1fr}
  .hc4-cta-grid{grid-template-columns:1fr 1fr}
  .hc4-faq-layout{grid-template-columns:1fr 2fr}
  .hc4-footer-main{grid-template-columns:2fr 1fr 1fr 1fr}
  .hc4-footer-bottom{flex-direction:row;justify-content:space-between;text-align:left}
}
@media(min-width:1024px){
  .hc4-services-grid{grid-template-columns:repeat(4,1fr)}
  .hc4-about-grid{grid-template-columns:1fr 1fr}
  .hc4-doctors-grid{grid-template-columns:repeat(4,1fr)}
}
`;

export const healthcare04Html = `

<!-- ═══ SECTION 0: NAV ═══ -->
<nav class="hc4-nav">
  <div class="hc4-nav-inner">
    <div class="hc4-nav-logo">
      LOGO_PLACEHOLDER
    </div>
    
    <div class="hc4-nav-actions">
      <button class="hc4-btn hc4-btn-primary" style="padding:10px 20px;font-size:14px">Book Now</button>
    </div>
  </div>
</nav>

<!-- ═══ SECTION 1: HERO ═══ -->
<section class="hc4-hero">
  <div class="hc4-hero-blob"></div>
  <div class="hc4-hero-blob-2"></div>
  <div class="hc4-wrap">
    <div class="hc4-hero-grid">

      <div data-reveal data-delay="1">
        <div class="hc4-hero-eyebrow">
          <span class="hc4-hero-eyebrow-line"></span>
          <span class="hc4-hero-eyebrow-txt">Advanced Healthcare</span>
        </div>
        <h1 class="hc4-h1">
          World-Class Medicine,<br>Right Where You Need It.<br>
          <span class="hc4-serif">we truly care.</span>
        </h1>
        <p class="hc4-body" style="margin-top:20px;max-width:460px">Experience unparalleled care from industry-leading specialists in a state-of-the-art facility designed for your comfort and recovery.</p>
        <div class="hc4-hero-badges">
          <div class="hc4-hero-badge">
            <svg viewBox="0 0 24 24"><path d="M9 12l2 2 4-4"/><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            ISO 9001 Certified
          </div>
          <div class="hc4-hero-badge">
            <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            Open 7 Days a Week
          </div>
          <div class="hc4-hero-badge">
            <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            50+ Specialists
          </div>
        </div>
        <div class="hc4-hero-actions">
          <button class="hc4-btn hc4-btn-primary" style="padding:16px 32px;font-size:16px">
            Book Free Consultation
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
          <button class="hc4-btn hc4-btn-outline">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            Watch Our Story
          </button>
        </div>
        <div class="hc4-hero-scroll">
          <span class="hc4-scroll-line"></span>
          Scroll to explore
        </div>
      </div>

      <div class="hc4-hero-visual" data-reveal="right" data-delay="2">
        <div class="hc4-hero-img-main">
          <img src="https://images.unsplash.com/photo-1638202993928-7267aad84c31?auto=format&fit=crop&w=800&q=80" alt="Healthcare Professional"/>
        </div>
        <div class="hc4-float-card hc4-float-card-1">
          <div class="hc4-fc-icon">🏥</div>
          <div>
            <div class="hc4-fc-label">Today's Appointments</div>
            <div class="hc4-fc-sub">128 scheduled · 4 urgent</div>
          </div>
        </div>
        <div class="hc4-float-card hc4-float-card-2">
          <div class="hc4-fc-txt-big">4.9</div>
          <div class="hc4-fc-txt-sm">★ Patient<br>Rating</div>
        </div>
        <div class="hc4-float-card hc4-float-card-3">
          <div class="hc4-fc-icon">❤️</div>
          <div>
            <div class="hc4-fc-label">Recovery Rate</div>
            <div class="hc4-fc-sub">98% success</div>
          </div>
        </div>
      </div>

    </div>
  </div>
</section>

<!-- ═══ SECTION 2: TRUST MARQUEE ═══ -->
<div class="hc4-trust-bar">
  <div class="hc4-marquee-track">
    <div class="hc4-marquee-item"><span class="hc4-marquee-icon">🏆</span> Award-Winning Care</div>
    <div class="hc4-marquee-divider"></div>
    <div class="hc4-marquee-item"><span class="hc4-marquee-icon">✅</span> ISO 9001 Certified</div>
    <div class="hc4-marquee-divider"></div>
    <div class="hc4-marquee-item"><span class="hc4-marquee-icon">👨‍⚕️</span> 50+ Senior Specialists</div>
    <div class="hc4-marquee-divider"></div>
    <div class="hc4-marquee-item"><span class="hc4-marquee-icon">📍</span> 5 Clinic Locations</div>
    <div class="hc4-marquee-divider"></div>
    <div class="hc4-marquee-item"><span class="hc4-marquee-icon">💳</span> All Insurers Accepted</div>
    <div class="hc4-marquee-divider"></div>
    <div class="hc4-marquee-item"><span class="hc4-marquee-icon">📞</span> 24/7 Support Line</div>
    <div class="hc4-marquee-divider"></div>
    <div class="hc4-marquee-item"><span class="hc4-marquee-icon">🔒</span> GDPR Compliant</div>
    <div class="hc4-marquee-divider"></div>
    <div class="hc4-marquee-item"><span class="hc4-marquee-icon">⚡</span> Same-Day Appointments</div>
    <div class="hc4-marquee-divider"></div>
    <!-- duplicate for seamless loop -->
    <div class="hc4-marquee-item"><span class="hc4-marquee-icon">🏆</span> Award-Winning Care</div>
    <div class="hc4-marquee-divider"></div>
    <div class="hc4-marquee-item"><span class="hc4-marquee-icon">✅</span> ISO 9001 Certified</div>
    <div class="hc4-marquee-divider"></div>
    <div class="hc4-marquee-item"><span class="hc4-marquee-icon">👨‍⚕️</span> 50+ Senior Specialists</div>
    <div class="hc4-marquee-divider"></div>
    <div class="hc4-marquee-item"><span class="hc4-marquee-icon">📍</span> 5 Clinic Locations</div>
    <div class="hc4-marquee-divider"></div>
    <div class="hc4-marquee-item"><span class="hc4-marquee-icon">💳</span> All Insurers Accepted</div>
    <div class="hc4-marquee-divider"></div>
    <div class="hc4-marquee-item"><span class="hc4-marquee-icon">📞</span> 24/7 Support Line</div>
    <div class="hc4-marquee-divider"></div>
    <div class="hc4-marquee-item"><span class="hc4-marquee-icon">🔒</span> GDPR Compliant</div>
    <div class="hc4-marquee-divider"></div>
    <div class="hc4-marquee-item"><span class="hc4-marquee-icon">⚡</span> Same-Day Appointments</div>
  </div>
</div>

<!-- ═══ SECTION 3: SERVICES ═══ -->
<section class="hc4-section" id="services">
  <div class="hc4-wrap">
    <div class="hc4-head hc4-head-center" data-reveal="fade">
      <span class="hc4-pill"><span class="hc4-pill-dot"></span>What We Offer</span>
      <h2 class="hc4-h2">Comprehensive Medical Services</h2>
      <p class="hc4-body">Expert care across every medical specialty, delivered by consultants who lead in their field.</p>
    </div>
    <div class="hc4-services-grid">
      <div class="hc4-svc-card" data-reveal data-delay="1">
        <div class="hc4-svc-num">01</div>
        <div class="hc4-svc-icon-wrap">
          <svg viewBox="0 0 24 24"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
        </div>
        <h3 class="hc4-h3">Advanced Cardiology</h3>
        <p class="hc4-body-sm">State-of-the-art heart care, from diagnostics and prevention to complex interventional procedures.</p>
        <a class="hc4-svc-link" href="#">Learn more
          <svg class="hc4-svc-arrow" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </a>
      </div>
      <div class="hc4-svc-card" data-reveal data-delay="2">
        <div class="hc4-svc-num">02</div>
        <div class="hc4-svc-icon-wrap">
          <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
        </div>
        <h3 class="hc4-h3">Neurology Institute</h3>
        <p class="hc4-body-sm">Expert diagnosis and treatment for neurological conditions, backed by cutting-edge imaging technology.</p>
        <a class="hc4-svc-link" href="#">Learn more
          <svg class="hc4-svc-arrow" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </a>
      </div>
      <div class="hc4-svc-card" data-reveal data-delay="3">
        <div class="hc4-svc-num">03</div>
        <div class="hc4-svc-icon-wrap">
          <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        </div>
        <h3 class="hc4-h3">Orthopaedics & Sports</h3>
        <p class="hc4-body-sm">Comprehensive joint, bone, and muscle care to get you back to your active lifestyle safely.</p>
        <a class="hc4-svc-link" href="#">Learn more
          <svg class="hc4-svc-arrow" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </a>
      </div>
      <div class="hc4-svc-card" data-reveal data-delay="4">
        <div class="hc4-svc-num">04</div>
        <div class="hc4-svc-icon-wrap">
          <svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        </div>
        <h3 class="hc4-h3">Precision Oncology</h3>
        <p class="hc4-body-sm">Personalised cancer care plans incorporating the latest targeted therapies and clinical trials.</p>
        <a class="hc4-svc-link" href="#">Learn more
          <svg class="hc4-svc-arrow" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </a>
      </div>
    </div>
    <!-- Stats strip -->
    <div class="hc4-svc-count-strip" data-reveal="fade" style="margin-top:56px">
      <div class="hc4-svc-count-item"><div class="hc4-svc-count-num">15K+</div><div class="hc4-svc-count-lbl">Patients Annually</div></div>
      <div class="hc4-svc-count-item"><div class="hc4-svc-count-num">98%</div><div class="hc4-svc-count-lbl">Satisfaction Rate</div></div>
      <div class="hc4-svc-count-item"><div class="hc4-svc-count-num">50+</div><div class="hc4-svc-count-lbl">Consultants</div></div>
      <div class="hc4-svc-count-item"><div class="hc4-svc-count-num">20yr</div><div class="hc4-svc-count-lbl">Experience</div></div>
    </div>
  </div>
</section>

<!-- ═══ SECTION 4: ABOUT ═══ -->
<section class="hc4-section" id="about" style="background:var(--off-white)">
  <div class="hc4-wrap">
    <div class="hc4-about-grid">
      <div class="hc4-about-visual" data-reveal="left">
        <div class="hc4-about-img-main">
          <img src="https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&w=800&q=80" alt="About our clinic"/>
        </div>
        <div class="hc4-about-img-accent">
          <img src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=400&q=80" alt="Consultation"/>
        </div>
        <div class="hc4-about-exp-badge">
          <div class="big">20+</div>
          <div class="sm">Years of<br>Excellence</div>
        </div>
      </div>
      <div class="hc4-about-text" data-reveal="right">
        <div>
          <span class="hc4-pill" style="margin-bottom:16px;display:inline-flex"><span class="hc4-pill-dot"></span>About Us</span>
          <h2 class="hc4-h2" style="margin-top:14px">A Legacy of Excellence in Patient Care</h2>
        </div>
        <p class="hc4-body">We believe that exceptional healthcare goes beyond clinical outcomes. It is about treating the whole person with dignity, compassion, and respect. Our integrated approach ensures you receive seamless care across all specialties.</p>
        <div class="hc4-about-points">
          <div class="hc4-about-pt">
            <div class="hc4-about-pt-icon">
              <svg viewBox="0 0 24 24"><path d="M9 12l2 2 4-4"/><path d="M21 12c0 1.2-.504 2.4-1.35 3.4L12 22l-7.65-6.6C3.504 14.4 3 13.2 3 12 3 8.7 5.7 6 9 6c1.2 0 2.4.4 3 1.2C12.6 6.4 13.8 6 15 6c3.3 0 6 2.7 6 6z"/></svg>
            </div>
            <div>
              <h4 class="hc4-h4">Multidisciplinary Teams</h4>
              <p class="hc4-body-sm">Your case is reviewed by a panel of experts across multiple disciplines to ensure the most effective treatment plan.</p>
            </div>
          </div>
          <div class="hc4-about-pt">
            <div class="hc4-about-pt-icon">
              <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            </div>
            <div>
              <h4 class="hc4-h4">Same-Day Appointments</h4>
              <p class="hc4-body-sm">We reserve urgent slots daily so you are seen when it matters most — never left waiting.</p>
            </div>
          </div>
          <div class="hc4-about-pt">
            <div class="hc4-about-pt-icon">
              <svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </div>
            <div>
              <h4 class="hc4-h4">Private &amp; Confidential</h4>
              <p class="hc4-body-sm">Fully GDPR-compliant records stored on ISO 27001-certified secure infrastructure.</p>
            </div>
          </div>
        </div>
        <button class="hc4-btn hc4-btn-primary" style="align-self:flex-start">Meet Our Doctors
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
      </div>
    </div>
  </div>
</section>

<!-- ═══ SECTION 5: DOCTORS ═══ -->
<section class="hc4-section hc4-doctors-bg" id="doctors">
  <div class="hc4-wrap">
    <div class="hc4-head hc4-head-center" data-reveal="fade">
      <span class="hc4-pill"><span class="hc4-pill-dot"></span>Our Team</span>
      <h2 class="hc4-h2">Meet Our Consultants</h2>
      <p class="hc4-body">Board-certified specialists with decades of combined experience, committed to your wellbeing.</p>
    </div>
    <div class="hc4-doctors-grid">
      <div class="hc4-doc-card" data-reveal data-delay="1">
        <div class="hc4-doc-img"><img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80" alt="Doctor 1"/></div>
        <div class="hc4-doc-body">
          <span class="hc4-doc-specialty">Cardiology</span>
          <div class="hc4-doc-name">Dr. Sarah Mitchell</div>
          <div class="hc4-doc-exp">18 years experience</div>
          <div class="hc4-doc-rating">
            <div class="hc4-doc-rating-stars">
              <span class="hc4-doc-rating-star">★</span><span class="hc4-doc-rating-star">★</span>
              <span class="hc4-doc-rating-star">★</span><span class="hc4-doc-rating-star">★</span>
              <span class="hc4-doc-rating-star">★</span>
            </div>
            <span class="hc4-doc-rating-txt">4.9 (320 reviews)</span>
          </div>
        </div>
      </div>
      <div class="hc4-doc-card" data-reveal data-delay="2">
        <div class="hc4-doc-img"><img src="https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=400&q=80" alt="Doctor 2"/></div>
        <div class="hc4-doc-body">
          <span class="hc4-doc-specialty">Neurology</span>
          <div class="hc4-doc-name">Dr. James Okafor</div>
          <div class="hc4-doc-exp">14 years experience</div>
          <div class="hc4-doc-rating">
            <div class="hc4-doc-rating-stars">
              <span class="hc4-doc-rating-star">★</span><span class="hc4-doc-rating-star">★</span>
              <span class="hc4-doc-rating-star">★</span><span class="hc4-doc-rating-star">★</span>
              <span class="hc4-doc-rating-star">★</span>
            </div>
            <span class="hc4-doc-rating-txt">4.8 (210 reviews)</span>
          </div>
        </div>
      </div>
      <div class="hc4-doc-card" data-reveal data-delay="3">
        <div class="hc4-doc-img"><img src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80" alt="Doctor 3"/></div>
        <div class="hc4-doc-body">
          <span class="hc4-doc-specialty">Orthopaedics</span>
          <div class="hc4-doc-name">Dr. Priya Nair</div>
          <div class="hc4-doc-exp">12 years experience</div>
          <div class="hc4-doc-rating">
            <div class="hc4-doc-rating-stars">
              <span class="hc4-doc-rating-star">★</span><span class="hc4-doc-rating-star">★</span>
              <span class="hc4-doc-rating-star">★</span><span class="hc4-doc-rating-star">★</span>
              <span class="hc4-doc-rating-star">★</span>
            </div>
            <span class="hc4-doc-rating-txt">4.9 (275 reviews)</span>
          </div>
        </div>
      </div>
      <div class="hc4-doc-card" data-reveal data-delay="4">
        <div class="hc4-doc-img"><img src="https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80" alt="Doctor 4"/></div>
        <div class="hc4-doc-body">
          <span class="hc4-doc-specialty">Paediatrics</span>
          <div class="hc4-doc-name">Dr. Liam Chen</div>
          <div class="hc4-doc-exp">16 years experience</div>
          <div class="hc4-doc-rating">
            <div class="hc4-doc-rating-stars">
              <span class="hc4-doc-rating-star">★</span><span class="hc4-doc-rating-star">★</span>
              <span class="hc4-doc-rating-star">★</span><span class="hc4-doc-rating-star">★</span>
              <span class="hc4-doc-rating-star">★</span>
            </div>
            <span class="hc4-doc-rating-txt">5.0 (189 reviews)</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ═══ SECTION 6: TESTIMONIALS ═══ -->
<section class="hc4-section" id="testimonials">
  <div class="hc4-wrap">
    <div class="hc4-head hc4-head-center" data-reveal="fade">
      <span class="hc4-pill"><span class="hc4-pill-dot"></span>Patient Stories</span>
      <h2 class="hc4-h2">Trusted by Thousands</h2>
    </div>
    <div class="hc4-testi-layout">
      <div class="hc4-testi-featured" data-reveal="left">
        <div class="hc4-testi-stars-row">
          <span class="hc4-testi-star">★</span><span class="hc4-testi-star">★</span>
          <span class="hc4-testi-star">★</span><span class="hc4-testi-star">★</span>
          <span class="hc4-testi-star">★</span>
        </div>
        <p class="hc4-testi-text">"The level of care and attention I received was truly exceptional. The specialists took the time to explain every detail, making me feel completely at ease."</p>
        <div class="hc4-testi-author">
          <div class="hc4-testi-avatar">
            <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80" alt="Patient"/>
          </div>
          <div>
            <p class="hc4-testi-name">Eleanor Davies</p>
            <p class="hc4-testi-role">Cardiology Patient</p>
          </div>
        </div>
      </div>
      <div class="hc4-testi-list" data-reveal="right">
        <div class="hc4-testi-mini">
          <div class="hc4-testi-stars-row">
            <span class="hc4-testi-star">★</span><span class="hc4-testi-star">★</span>
            <span class="hc4-testi-star">★</span><span class="hc4-testi-star">★</span>
            <span class="hc4-testi-star">★</span>
          </div>
          <p class="hc4-testi-mini-text">"From the moment I walked in, I felt supported. The facilities are modern, but it’s the warmth of the staff that makes this place truly special."</p>
          <div class="hc4-testi-mini-author">
            <div class="hc4-testi-mini-avatar"><img src="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=80&q=80" alt="Patient"/></div>
            <div><p class="hc4-testi-mini-name">James Henderson</p><p class="hc4-testi-mini-role">Orthopaedics Patient</p></div>
          </div>
        </div>
        <div class="hc4-testi-mini">
          <div class="hc4-testi-stars-row">
            <span class="hc4-testi-star">★</span><span class="hc4-testi-star">★</span>
            <span class="hc4-testi-star">★</span><span class="hc4-testi-star">★</span>
            <span class="hc4-testi-star">★</span>
          </div>
          <p class="hc4-testi-mini-text">"Finding specialists who combine clinical brilliance with genuine warmth has been transformative. My daughter actually looks forward to every visit."</p>
          <div class="hc4-testi-mini-author">
            <div class="hc4-testi-mini-avatar"><img src="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=80&q=80" alt="Patient"/></div>
            <div><p class="hc4-testi-mini-name">Amara Osei</p><p class="hc4-testi-mini-role">Paediatrics Parent</p></div>
          </div>
        </div>
        <div class="hc4-testi-mini">
          <div class="hc4-testi-stars-row">
            <span class="hc4-testi-star">★</span><span class="hc4-testi-star">★</span>
            <span class="hc4-testi-star">★</span><span class="hc4-testi-star">★</span>
            <span class="hc4-testi-star">★</span>
          </div>
          <p class="hc4-testi-mini-text">"The digital booking system is seamless and I was seen within 48 hours. Results were explained clearly and a treatment plan was in place the same day."</p>
          <div class="hc4-testi-mini-author">
            <div class="hc4-testi-mini-avatar"><img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=80&q=80" alt="Patient"/></div>
            <div><p class="hc4-testi-mini-name">Thomas Blake</p><p class="hc4-testi-mini-role">Neurology Patient</p></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ═══ SECTION 7: CTA BOOKING ═══ -->
<section class="hc4-section hc4-cta-section" id="booking">
  <div class="hc4-cta-noise"></div>
  <div class="hc4-wrap">
    <div class="hc4-cta-grid">
      <div class="hc4-cta-text" data-reveal="left">
        <span class="hc4-pill" style="background:rgba(255,255,255,0.15);color:#fff;border-color:rgba(255,255,255,0.2)">
          <span style="width:6px;height:6px;border-radius:50%;background:#fff;display:inline-block"></span>
          Start Today
        </span>
        <h2>Take the First Step Towards Better Health</h2>
        <p>New patients receive a complimentary 30-minute health screening. Limited slots — book yours today.</p>
        <div class="hc4-cta-checks">
          <div class="hc4-cta-check">
            <div class="hc4-cta-check-icon"><svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg></div>
            No referral needed — self-refer directly
          </div>
          <div class="hc4-cta-check">
            <div class="hc4-cta-check-icon"><svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg></div>
            Same-week availability guaranteed
          </div>
          <div class="hc4-cta-check">
            <div class="hc4-cta-check-icon"><svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg></div>
            All major insurance providers accepted
          </div>
        </div>
      </div>
      <div data-reveal="right">
        <div class="hc4-cta-form">
          <p class="hc4-cta-form-title">Request an Appointment</p>
          <div class="hc4-form-row">
            <div class="hc4-form-group">
              <label class="hc4-form-label">First Name</label>
              <input class="hc4-form-input" type="text" placeholder="Jane"/>
            </div>
            <div class="hc4-form-group">
              <label class="hc4-form-label">Last Name</label>
              <input class="hc4-form-input" type="text" placeholder="Smith"/>
            </div>
          </div>
          <div class="hc4-form-group">
            <label class="hc4-form-label">Phone</label>
            <input class="hc4-form-input" type="tel" placeholder="+1 (800) 123-4567"/>
          </div>
          <div class="hc4-form-row">
            <div class="hc4-form-group">
              <label class="hc4-form-label">Specialty</label>
              <select class="hc4-form-input" style="appearance:none">
                <option>Cardiology</option>
                <option>Neurology</option>
                <option>Orthopaedics</option>
                <option>Paediatrics</option>
                <option>General Medicine</option>
              </select>
            </div>
            <div class="hc4-form-group">
              <label class="hc4-form-label">Preferred Date</label>
              <input class="hc4-form-input" type="date"/>
            </div>
          </div>
          <button class="hc4-form-submit">Confirm Appointment →</button>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ═══ SECTION 8: FAQ ═══ -->
<section class="hc4-section" id="faqs">
  <div class="hc4-wrap">
    <div class="hc4-head" data-reveal="fade" style="margin-bottom:0">
      <span class="hc4-pill"><span class="hc4-pill-dot"></span>FAQ</span>
    </div>
    <div class="hc4-faq-layout" style="margin-top:48px">
      <div class="hc4-faq-left" data-reveal="left">
        <h2 class="hc4-h2">Frequently Asked Questions</h2>
        <p class="hc4-body">Find answers to common questions about our services, booking process, and insurance policies.</p>
        <div class="hc4-faq-contact-card">
          <h4 class="hc4-h3">Still have questions?</h4>
          <p class="hc4-body-sm">Our team is available Monday–Saturday, 8am–8pm. We aim to respond to all enquiries within 2 hours.</p>
          <button class="hc4-btn hc4-btn-primary" style="align-self:flex-start;padding:12px 22px;font-size:14px">
            Call +1 (800) 123-4567
          </button>
        </div>
      </div>
      <div class="hc4-faq-list" data-reveal="right">
        <details class="hc4-faq-item" open>
          <summary class="hc4-faq-summary">
            How quickly can I get an appointment?
            <div class="hc4-faq-icon"><svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg></div>
          </summary>
          <div class="hc4-faq-body">We offer same-week appointments for non-urgent consultations. Urgent cases are typically seen within 24 to 48 hours. Our triage team ensures priority for those who need immediate attention.</div>
        </details>
        <details class="hc4-faq-item">
          <summary class="hc4-faq-summary">
            Do I need a referral to see a specialist?
            <div class="hc4-faq-icon"><svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg></div>
          </summary>
          <div class="hc4-faq-body">No referral is needed. As a private clinic we welcome self-referrals for all specialties. Book online or call us and we'll arrange an initial consultation, often within 48 hours.</div>
        </details>
        <details class="hc4-faq-item">
          <summary class="hc4-faq-summary">
            Which insurance providers do you accept?
            <div class="hc4-faq-icon"><svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg></div>
          </summary>
          <div class="hc4-faq-body">We work with all major insurers. Our billing team handles all pre-authorisation to make the process completely seamless for you.</div>
        </details>
        <details class="hc4-faq-item">
          <summary class="hc4-faq-summary">
            Do you offer second opinions?
            <div class="hc4-faq-icon"><svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg></div>
          </summary>
          <div class="hc4-faq-body">Absolutely. Many patients seek our expertise for a second opinion on complex conditions. Our specialists will review your existing records and provide a comprehensive, unbiased assessment.</div>
        </details>
        <details class="hc4-faq-item">
          <summary class="hc4-faq-summary">
            Are virtual appointments available?
            <div class="hc4-faq-icon"><svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg></div>
          </summary>
          <div class="hc4-faq-body">Yes. Secure HD video consultations are available for follow-ups, medication reviews and initial assessments where no physical exam is required. Available 7 days a week.</div>
        </details>
      </div>
    </div>
  </div>
</section>

<!-- ═══ FOOTER ═══ -->
<footer class="hc4-footer">
  <div class="hc4-footer-main">
    <div class="hc4-footer-brand">
      <div class="hc4-footer-logo-row">
        <span class="hc4-footer-logo-name">LOGO_PLACEHOLDER</span>
      </div>
      <p>Delivering world-class healthcare with compassion and excellence. Your wellbeing is our priority.</p>
      <div class="hc4-footer-socials">
        <a class="hc4-footer-social" href="#"><svg viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg></a>
        <a class="hc4-footer-social" href="#"><svg viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg></a>
        <a class="hc4-footer-social" href="#"><svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg></a>
      </div>
    </div>
    <div class="hc4-footer-col">
      <h5>Services</h5>
      <nav class="hc4-footer-links">
        <a href="#">Advanced Cardiology</a>
        <a href="#">Neurology Institute</a>
        <a href="#">Orthopaedics & Sports</a>
        <a href="#">Precision Oncology</a>
        <a href="#">General Medicine</a>
      </nav>
    </div>
    <div class="hc4-footer-col">
      <h5>Company</h5>
      <nav class="hc4-footer-links">
        <a href="#">About Us</a>
        <a href="#">Our Doctors</a>
        <a href="#">Patient Stories</a>
        <a href="#">Careers</a>
        <a href="#">Contact</a>
      </nav>
    </div>
    <div class="hc4-footer-col">
      <h5>Contact</h5>
      <ul class="hc4-footer-contact-list">
        <li class="hc4-footer-contact-item">
          <div class="hc4-footer-contact-icon"><svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg></div>
          <span>14 Harley Street, London W1G 9PH</span>
        </li>
        <li class="hc4-footer-contact-item">
          <div class="hc4-footer-contact-icon"><svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6.29 6.29l1.8-1.79a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg></div>
          <span>+1 (800) 123-4567</span>
        </li>
        <li class="hc4-footer-contact-item">
          <div class="hc4-footer-contact-icon"><svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></div>
          <span>contact@healthcare.com</span>
        </li>
        <li class="hc4-footer-contact-item">
          <div class="hc4-footer-contact-icon"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>
          <span>Mon–Sat: 8am – 8pm</span>
        </li>
      </ul>
    </div>
  </div>
  <div class="hc4-footer-bottom">
    <p>© 2026 PROJECT_NAME_PLACEHOLDER. All rights reserved.</p>
    <p>Privacy Policy · Terms of Service · Accessibility</p>
  </div>
</footer>

<script>
(function(){
  // ── Scroll reveal ──
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  function initReveal(){
    document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));
  }

  // ── FAQ icon toggle ──
  function initFaq(){
    document.querySelectorAll('.hc4-faq-item').forEach(item => {
      item.addEventListener('toggle', function(){
        const icon = this.querySelector('.hc4-faq-icon svg');
        if(icon){
          icon.innerHTML = this.open
            ? '<path d="M5 12h14"/>'
            : '<path d="M12 5v14M5 12h14"/>';
        }
      });
    });
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', () => { initReveal(); initFaq(); });
  } else {
    initReveal(); initFaq();
  }
})();
</script>
`;