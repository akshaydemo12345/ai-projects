// Auto-generated ULTRA-DYNAMIC template — healthcare templates03
// Generated: 2026-05-25T00:00:00.000Z
// Theme: NovaMed Advanced Medical — Indigo / Violet — Tech-Forward Premium

export const healthcare03Styles = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,400&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap');

:root {
  --p3-primary: PRIMARY_COLOR_PLACEHOLDER;
  --p3-primary-mid: PRIMARY_COLOR_PLACEHOLDER;
  --p3-primary-light: #f5f5f5ff;
  --p3-primary-xlight: #f0f0f0ef;
  --p3-accent: SECONDARY_COLOR_PLACEHOLDER;
  --p3-accent-light: #eeeeeeff;
  --p3-secondary: SECONDARY_COLOR_PLACEHOLDER;
  --p3-on-surface: #0D0B1E;
  --p3-surface: #FAFAFA;
  --p3-card: #d1d1d1ff;
  --p3-muted: #4B4869;
  --p3-light-text: #e6e6e6ff;
  --p3-border: #E8E4F8;
  --p3-border-mid: #d6d6d6ff;
  --p3-shadow-sm: 0 2px 8px rgba(91,33,182,0.07);
  --p3-shadow-md: 0 8px 28px rgba(91,33,182,0.12);
  --p3-shadow-lg: 0 24px 64px rgba(91,33,182,0.16);
  --p3-r-sm: 8px;
  --p3-r-md: 16px;
  --p3-r-lg: 24px;
  --p3-r-xl: 32px;
  --p3-font-display: 'Fraunces', serif;
  --p3-font-body: 'Plus Jakarta Sans', sans-serif;
}
.material-symbols-outlined {
  font-family: 'Material Symbols Outlined' !important;
  font-weight: normal; font-style: normal; font-size: 24px; line-height: 1;
  letter-spacing: normal; text-transform: none; display: inline-block;
  white-space: nowrap; word-wrap: normal; direction: ltr;
  -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility;
  font-feature-settings: 'liga';
}
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body {
  font-family: var(--p3-font-body);
  background: var(--p3-surface);
  color: var(--p3-on-surface);
  -webkit-font-smoothing: antialiased;
  font-size: 16px; line-height: 1.6;
}
img { max-width: 100%; height: auto; display: block; }
a { text-decoration: none; color: inherit; }
button { cursor: pointer; border: none; background: none; font-family: inherit; }
ul { list-style: none; }
input, select, textarea { font-family: inherit; }

@keyframes formPop {
  0% { opacity: 0; transform: translateY(40px) scale(0.95); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}

.p3-hero-form {
  display: flex; flex-wrap: wrap; gap: 8px; align-items: center; background: #fff; padding: 8px; border-radius: 100px; box-shadow: 0 20px 40px rgba(0,0,0,0.1);
  animation: formPop 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  opacity: 0;
  margin-top: 24px;
  overflow: hidden;
}
.p3-hero-form input, .p3-hero-form select {
  flex: 1; min-width: 0; border: none; padding: 12px 16px; outline: none; font-family: inherit; font-size: 14px; border-right: 1px solid var(--p3-border);
  background: transparent; transition: background 0.3s ease; border-radius: 50px;
}
.p3-hero-form input:hover, .p3-hero-form select:hover, .p3-hero-form input:focus, .p3-hero-form select:focus {
  background: var(--p3-primary-xlight);
}
.p3-hero-form .p3-btn-primary {
  border-radius: 100px; padding: 12px 24px; font-size: 14px; margin-left: 4px; flex-shrink: 0; white-space: nowrap;
}
@media (max-width: 900px) {
  .p3-hero-form { flex-direction: column; border-radius: 20px; padding: 16px; align-items: stretch; }
  .p3-hero-form input, .p3-hero-form select { border-right: none; border-bottom: 1px solid var(--p3-border); border-radius: 8px; }
  .p3-hero-form .p3-btn-primary { margin-left: 0; margin-top: 12px; border-radius: 8px; }
}

/* ─── TYPOGRAPHY ─── */
.p3-display { font-family: var(--p3-font-display); font-size: clamp(36px,5vw,66px); line-height: 1.1; font-weight: 700; letter-spacing: -0.02em; }
.p3-h2 { font-family: var(--p3-font-display); font-size: clamp(26px,3.5vw,44px); line-height: 1.2; font-weight: 600; }
.p3-h3 { font-family: var(--p3-font-body); font-size: 20px; font-weight: 700; }
.p3-h4 { font-family: var(--p3-font-body); font-size: 15px; font-weight: 700; }
.p3-body-lg { font-size: 18px; line-height: 1.75; font-weight: 400; }
.p3-body { font-size: 15px; line-height: 1.7; font-weight: 400; }
.p3-small { font-size: 13px; line-height: 1.6; font-weight: 400; }
.p3-label { font-size: 11px; font-weight: 700; letter-spacing: 0.09em; text-transform: uppercase; }
.p3-col-primary { color: var(--p3-primary-mid); }
.p3-col-accent { color: var(--p3-accent); }
.p3-col-muted { color: var(--p3-muted); }
.p3-col-light { color: var(--p3-light-text); }
.p3-col-white { color: #ffffff; }

/* ─── LAYOUT ─── */
.p3-container { width: 100%; max-width: 1200px; margin: 0 auto; padding: 0 1.5rem; }
.p3-section { padding: 100px 0; }
.p3-section-sm { padding: 64px 0; }
.p3-pill {
  display: inline-flex; flex-wrap: wrap; align-items: center; gap: 7px;
  padding: 5px 14px; border-radius: 100px;
  background: var(--p3-primary-light); color: var(--p3-primary);
  font-size: 11px; font-weight: 700; letter-spacing: 0.07em; text-transform: uppercase;
}
.p3-pill-accent {
  background: var(--p3-accent-light); color: #0E7490;
}
.p3-section-head { text-align: center; margin-bottom: 64px; display: flex; flex-wrap: wrap; flex-direction: column; gap: 16px; align-items: center; }

/* ─── BUTTONS ─── */
.p3-btn {
  display: inline-flex; flex-wrap: wrap; align-items: center; gap: 8px;
  padding: 14px 28px; border-radius: var(--p3-r-sm);
  font-weight: 700; font-size: 15px; cursor: pointer;
  transition: all 0.22s ease; white-space: nowrap;
  font-family: var(--p3-font-body);
}
.p3-btn-primary { background: var(--btn-bg, var(--p3-primary-mid)); color: var(--btn-text, #fff); }
.p3-btn-primary:hover { background: var(--secondary) !important; color: var(--btn-text, #fff) !important; transform: translateY(-2px); box-shadow: 0 8px 20px rgba(91,33,182,0.25); }
.p3-btn-accent { background: var(--p3-accent); color: #fff; }
.p3-btn-accent:hover { background: #0891B2; transform: translateY(-1px); }
.p3-btn-outline { background: transparent; border: 2px solid var(--p3-primary-mid); color: var(--p3-primary-mid); }
.p3-btn-outline:hover { background: var(--p3-primary-xlight); }
.p3-btn-white { background: #fff; color: var(--p3-primary); }
.p3-btn-white:hover { background: var(--p3-primary-light); }
.p3-btn-ghost-w { background: transparent; border: 2px solid rgba(255,255,255,0.4); color: #fff; }
.p3-btn-ghost-w:hover { background: rgba(255,255,255,0.12); }

/* ─── HEADER ─── */
.p3-header {
  position: sticky; top: 0; z-index: 100;
  background: rgba(250,250,250,0.94); backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--p3-border);
}
.p3-header-inner {
  max-width: 1200px; margin: 0 auto; padding: 16px 1.5rem;
  display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 24px;
}
.p3-logo {
  display: flex; flex-wrap: wrap; align-items: center; gap: 10px;
  font-family: var(--p3-font-display); font-size: 21px; font-weight: 700;
  color: var(--p3-secondary);
}
.p3-logo-badge {
  display: flex; flex-wrap: wrap; align-items: center; justify-content: center;
  width: 38px; height: 38px; border-radius: 10px;
  background: linear-gradient(135deg, var(--p3-primary-mid), var(--p3-accent));
}
.p3-logo-badge span { color: #fff; font-size: 20px; }
.p3-nav { display: none; align-items: center; gap: 32px; }
.p3-nav a { font-size: 14px; font-weight: 600; color: var(--p3-muted); transition: color 0.2s; }
.p3-nav a:hover { color: var(--p3-primary-mid); }
.p3-header-right { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; }
.p3-header-phone { display: none; align-items: center; gap: 6px; font-size: 14px; font-weight: 600; color: var(--p3-secondary); }
.p3-header-phone span.material-symbols-outlined { font-size: 18px; color: var(--p3-primary-mid); }

/* ─── HERO ─── */
.p3-hero {
  position: relative; overflow: hidden;
  padding: 120px 0 160px;
  background-color: #000;
}
.p3-hero-bg-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
}
.p3-hero::before {
  content: ''; position: absolute; inset: 0; z-index: 1;
  background: rgba(0,0,0,0.65); z-index: 1;
}
.p3-hero-grid-bg {
  position: absolute; inset: 0; pointer-events: none; z-index: 2;
  background-image:
    linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px);
  background-size: 48px 48px;
}
.p3-hero-inner-centered {
  position: relative; z-index: 3;
  display: flex; flex-wrap: wrap; flex-direction: column; align-items: center; text-align: center;
  max-width: 900px; margin: 0 auto; gap: 32px;
  color: #fff;
}
.p3-hero-inner-centered .p3-display { color: #fff; }
.p3-hero-inner-centered p { color: rgba(255,255,255,0.85) ; }
.p3-hero-features { display: flex; flex-wrap: wrap; justify-content: center; gap: 24px; flex-wrap: wrap; }
.p3-hero-feat { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; font-size: 15px; font-weight: 600; color: #fff; }
.p3-hero-feat span.material-symbols-outlined { font-size: 18px; font-variation-settings:'FILL' 1; color: #22C55E; }
.p3-hero-img-main {
  width: 100%; border-radius: var(--p3-r-xl); overflow: hidden;
  aspect-ratio: 21/9; box-shadow: var(--p3-shadow-lg); position: relative;
  margin-top: 16px;
}
.p3-hero-img-main img { width: 100%; height: 100%; object-fit: cover; }
.p3-hero-img-tag {
  position: absolute; bottom: 20px; right: 20px;
  background: rgba(255,255,255,0.95); backdrop-filter: blur(12px);
  border-radius: 100px; padding: 12px 20px;
  display: flex; flex-wrap: wrap; align-items: center; gap: 10px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}
.p3-hero-img-tag .dot { width: 10px; height: 10px; border-radius: 50%; background: #22C55E; flex-shrink: 0; box-shadow: 0 0 0 4px rgba(34,197,94,0.2); }
.p3-hero-img-tag span { font-size: 14px; font-weight: 700; color: var(--p3-on-surface); }
.p3-hero-mini-cards {
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px;
  width: 100%; margin-top: -40px; position: relative; z-index: 10; padding: 0 32px;
}
.p3-mini-card {
  background: #fff; border-radius: var(--p3-r-md); padding: 20px;
  border: 1px solid var(--p3-border); box-shadow: var(--p3-shadow-md);
  display: flex; flex-wrap: wrap; flex-direction: column; gap: 6px; text-align: left;
}
.p3-mini-card .icon { font-size: 24px; color: var(--p3-primary-mid); }
.p3-mini-card .val { font-family: var(--p3-font-display); font-size: 26px; font-weight: 700; color: var(--p3-secondary); }
.p3-mini-card .lbl { font-size: 13px;  font-weight: 600; color: var(--p3-muted); }
@media (max-width: 768px) {
  .p3-hero-mini-cards { grid-template-columns: repeat(2, 1fr); padding: 0; margin-top: 24px; }
  .p3-hero-img-main { aspect-ratio: 16/9; }
}

/* ─── SERVICES (Diagonal Split Layout) ─── */
.p3-services-outer { background: #fff; }
.p3-services-header-wrap {
  background: var(--p3-secondary); padding: 64px 0 100px;
}
.p3-services-cards-wrap { margin-top: -60px; }
.p3-services-grid {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 20px;
}
.p3-svc-card {
  background: #fff; border-radius: var(--p3-r-lg); padding: 32px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1); border: 1px solid var(--p3-border);
  display: flex; flex-wrap: wrap; flex-direction: column; gap: 14px;
  transition: all 0.3s ease;
}
.p3-svc-card:hover { transform: translateY(-6px); box-shadow: 0 10px 30px rgba(0,0,0,0.1); border-color: var(--p3-primary-mid); }
.p3-svc-icon-row { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; }
.p3-svc-icon {
  width: 52px; height: 52px; border-radius: var(--p3-r-sm);
  background: var(--p3-primary-xlight);
  display: flex; flex-wrap: wrap; align-items: center; justify-content: center;
  transition: background 0.3s;
}
.p3-svc-card:hover .p3-svc-icon { background: var(--p3-primary-mid); }
.p3-svc-icon span { color: var(--p3-primary-mid); font-size: 26px; transition: color 0.3s; }
.p3-svc-card:hover .p3-svc-icon span { color: #fff; }
.p3-svc-num { font-family: var(--p3-font-display); font-size: 36px; font-weight: 700; color: var(--p3-border); }
.p3-svc-card h3 { font-size: 18px; font-weight: 700; }
.p3-svc-card p { font-size: 14px; color: var(--p3-muted); line-height: 1.65; flex: 1; }
.p3-svc-tags { display: flex; flex-wrap: wrap; gap: 8px; flex-wrap: wrap; }
.p3-svc-tag { padding: 3px 10px; border-radius: 100px; background: var(--p3-primary-xlight); color: var(--p3-primary); font-size: 11px; font-weight: 600; }

/* ─── ABOUT ─── */
.p3-about-grid { display: grid; grid-template-columns: 1fr; gap: 60px; align-items: center; }
.p3-about-visual { position: relative; }
.p3-about-img-box {
  border-radius: var(--p3-r-xl); overflow: hidden;
  aspect-ratio: 4/5; box-shadow: var(--p3-shadow-lg);
}
.p3-about-img-box img { width: 100%; height: 100%; object-fit: cover; }
.p3-about-float {
  position: absolute; bottom: -20px; right: -10px;
  background: var(--p3-secondary); border-radius: var(--p3-r-lg); padding: 20px 24px;
  display: flex; flex-wrap: wrap; flex-direction: column; gap: 4px;
  box-shadow: var(--p3-shadow-lg);
}
.p3-about-float .val { font-family: var(--p3-font-display); font-size: 36px; font-weight: 700; color: #fff; }
.p3-about-float .lbl { font-size: 12px; color: rgba(255,255,255,0.6); font-weight: 500; }
.p3-about-float .accent-line { width: 32px; height: 3px; background: var(--p3-accent); border-radius: 2px; margin-bottom: 4px; }
.p3-about-text { display: flex; flex-wrap: wrap; flex-direction: column; gap: 28px; }
.p3-credentials { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.p3-cred-card {
  background: var(--p3-primary-xlight); border-radius: var(--p3-r-md); padding: 20px;
  border: 1px solid var(--p3-primary-light); display: flex; flex-wrap: wrap; flex-direction: column; gap: 6px;
}
.p3-cred-card span.material-symbols-outlined { color: var(--p3-primary-mid); font-size: 22px; }
.p3-cred-card h4 { font-size: 14px; font-weight: 700; }
.p3-cred-card p { font-size: 13px; color: var(--p3-muted); }

/* ─── PROCESS ─── */
.p3-process-bg { background: var(--p3-primary-xlight); }
.p3-process-steps { display: flex; flex-wrap: wrap; flex-direction: column; gap: 0; max-width: 760px; margin: 0 auto; }
.p3-proc-step { display: flex; flex-wrap: wrap; gap: 24px; padding: 32px 0; position: relative; }
.p3-proc-step:not(:last-child)::after {
  content: ''; position: absolute; left: 24px; top: 80px; bottom: 0;
  width: 2px; background: var(--p3-primary-light);
}
.p3-proc-left { flex-shrink: 0; display: flex; flex-wrap: wrap; flex-direction: column; align-items: center; gap: 0; }
.p3-proc-circle {
  width: 50px; height: 50px; border-radius: 50%;
  background: var(--p3-primary-mid); display: flex; flex-wrap: wrap; align-items: center; justify-content: center;
  font-weight: 700; font-size: 17px; color: #fff; z-index: 1;
}
.p3-proc-body { flex: 1; padding-top: 8px; display: flex; flex-wrap: wrap; flex-direction: column; gap: 8px; }
.p3-proc-body h3 { font-size: 18px; font-weight: 700; }
.p3-proc-body p { font-size: 14px; color: var(--p3-muted); }
.p3-proc-chip { display: inline-flex; flex-wrap: wrap; align-items: center; gap: 6px; padding: 4px 12px; border-radius: 100px; background: #fff; border: 1px solid var(--p3-secondary); font-size: 12px; font-weight: 600; color: var(--p3-primary); }

/* ─── DOCTORS ─── */
.p3-doctors-bg { background: #fff; }
.p3-doctors-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 24px; }
.p3-doctor-card {
  border-radius: var(--p3-r-lg); overflow: hidden;
  border: 1px solid var(--p3-border); box-shadow: var(--p3-shadow-sm);
  transition: all 0.3s ease;
}
.p3-doctor-card:hover { transform: translateY(-4px); box-shadow: var(--p3-shadow-md); }
.p3-doctor-img { aspect-ratio: 4/3; overflow: hidden; }
.p3-doctor-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s; }
.p3-doctor-card:hover .p3-doctor-img img { transform: scale(1.04); }
.p3-doctor-info { padding: 20px; display: flex; flex-wrap: wrap; flex-direction: column; gap: 6px; }
.p3-doctor-name { font-size: 17px; font-weight: 700; }
.p3-doctor-spec { font-size: 13px; color: var(--p3-primary-mid); font-weight: 600; }
.p3-doctor-exp { font-size: 12px; color: var(--p3-muted); }
.p3-doctor-book { margin-top: 12px; display: block; text-align: center; padding: 10px; border-radius: var(--p3-r-sm); background: var(--p3-secondary); font-size: 14px; font-weight: 600; transition: background 0.2s; color: #fff; }
.p3-doctor-book:hover { background: var(--p3-primary); color: #fff; }

/* ─── TESTIMONIALS ─── */
.p3-testi-bg { background: var(--p3-secondary); }
.p3-testi-grid { display: grid; grid-template-columns: 1fr; gap: 20px; }
.p3-testi-card {
  background: rgba(255,255,255,0.06); border-radius: var(--p3-r-lg); padding: 28px;
  border: 1px solid rgba(255,255,255,0.1);
  display: flex; flex-wrap: wrap; flex-direction: column; gap: 16px;
}
.p3-testi-quote-icon span { font-size: 40px; color: var(--p3-accent); opacity: 0.5; }
.p3-testi-text { font-size: 15px; line-height: 1.75; color: rgba(255,255,255,0.85); font-style: italic; flex: 1; }
.p3-testi-author { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; }
.p3-testi-author img { width: 44px; height: 44px; border-radius: 50%; object-fit: cover; border: 2px solid rgba(255,255,255,0.2); }
.p3-testi-name { font-size: 14px; font-weight: 700; color: #fff; }
.p3-testi-tag { font-size: 12px; color: var(--p3-accent); font-weight: 500; }
.p3-testi-stars { display: flex; flex-wrap: wrap; gap: 2px; }
.p3-testi-stars span { color: #FCD34D; font-size: 15px; }

/* ─── CTA SECTION ─── */
.p3-cta-bg {
  background: linear-gradient(135deg, var(--p3-primary) 0%, var(--p3-primary-mid) 50%, var(--p3-accent) 100%);
  position: relative; overflow: hidden;
}
.p3-cta-mesh {
  position: absolute; inset: 0;
  background-image: radial-gradient(circle at 20% 50%, rgba(255,255,255,0.08) 0%, transparent 50%),
                    radial-gradient(circle at 80% 50%, rgba(255,255,255,0.06) 0%, transparent 50%);
}
.p3-cta-inner {
  position: relative; z-index: 2; text-align: center;
  display: flex; flex-wrap: wrap; flex-direction: column; align-items: center; gap: 28px;
}
.p3-cta-inner h2 { font-family: var(--p3-font-display); font-size: clamp(28px,4vw,52px); color: #fff; font-weight: 700; }
.p3-cta-inner p { font-size: 17px; color: rgba(255,255,255,0.8); max-width: 500px; }
.p3-cta-actions { display: flex; flex-wrap: wrap; gap: 14px; flex-wrap: wrap; justify-content: center; }
.p3-cta-perks { display: flex; flex-wrap: wrap; gap: 24px; flex-wrap: wrap; justify-content: center; }
.p3-cta-perk { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; font-size: 13px; color: rgba(255,255,255,0.75); }
.p3-cta-perk span.material-symbols-outlined { font-size: 15px; font-variation-settings:'FILL' 1; color: rgba(255,255,255,0.9); }

/* ─── FAQ ─── */
.p3-faq-wrap { max-width: 700px; margin: 0 auto; }
.p3-faq-list { display: flex; flex-wrap: wrap; flex-direction: column; gap: 10px; }
.p3-faq-item {
  border-radius: var(--p3-r-md); overflow: hidden;
  background: #fff; border: 1px solid var(--p3-border);
  transition: border-color 0.25s;
}
.p3-faq-item[open] { border-color: var(--p3-primary-mid); }
.p3-faq-sum {
  padding: 20px 24px; cursor: pointer; list-style: none;
  display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center;
  font-size: 15px; font-weight: 600;
}
.p3-faq-sum::-webkit-details-marker { display: none; }
.p3-faq-sum::marker { display: none; content: ""; }
.p3-faq-sum::after { display: none !important; content: none !important; }
.p3-faq-sum .material-symbols-outlined { color: var(--p3-primary-mid); transition: transform 0.25s; }
.p3-faq-item[open] .p3-faq-sum { color: var(--p3-primary); }
.p3-faq-item[open] .p3-faq-sum .material-symbols-outlined { transform: rotate(180deg); }
.p3-faq-ans { padding: 0 24px 20px; font-size: 14px; color: var(--p3-muted); line-height: 1.7; }

/* ─── FOOTER ─── */
.p3-footer { background: #0D0B1E; }
.p3-footer-top {
  display: grid; grid-template-columns: 1fr; gap: 40px;
  padding: 64px 1.5rem; max-width: 1200px; margin: 0 auto;
}
.p3-footer-brand { display: flex; flex-wrap: wrap; flex-direction: column; gap: 16px; }
.p3-footer-logo { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; }
.p3-footer-logo-badge { width: 36px; height: 36px; border-radius: 9px; background: linear-gradient(135deg, var(--p3-primary-mid), var(--p3-accent)); display: flex; flex-wrap: wrap; align-items: center; justify-content: center; }
.p3-footer-logo-badge span { color: #fff; font-size: 18px; }
.p3-footer-logo-text { font-family: var(--p3-font-display); font-size: 18px; font-weight: 700; color: #fff; }
.p3-footer-desc { font-size: 14px; color: rgba(255,255,255,0.5); line-height: 1.7; max-width: 260px; }
.p3-footer-socials { display: flex; flex-wrap: wrap; gap: 10px; }
.p3-footer-s-btn { width: 36px; height: 36px; border-radius: 9px; background: rgba(255,255,255,0.06); display: flex; flex-wrap: wrap; align-items: center; justify-content: center; transition: background 0.2s; }
.p3-footer-s-btn:hover { background: var(--p3-primary-mid); }
.p3-footer-s-btn span { color: rgba(255,255,255,0.6); font-size: 17px; }
.p3-footer-col h5 { font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(255,255,255,0.35); margin-bottom: 16px; }
.p3-footer-links { display: flex; flex-wrap: wrap; flex-direction: column; gap: 10px; }
.p3-footer-links a { font-size: 14px; color: rgba(255,255,255,0.6); transition: color 0.2s; }
.p3-footer-links a:hover { color: #fff; }
.p3-footer-contact-list { display: flex; flex-wrap: wrap; flex-direction: column; gap: 12px; }
.p3-footer-contact-list li { display: flex; flex-wrap: wrap; align-items: flex-start; gap: 10px; font-size: 14px; color: rgba(255,255,255,0.55); }
.p3-footer-contact-list li span.material-symbols-outlined { font-size: 16px; color: rgba(255,255,255,0.7); flex-shrink: 0; margin-top: 2px; }
.p3-footer-bottom {
  border-top: 1px solid rgba(255,255,255,0.06);
  padding: 20px 1.5rem; max-width: 1200px; margin: 0 auto;
  display: flex; flex-wrap: wrap; flex-direction: column; gap: 8px; align-items: center; text-align: center;
}
.p3-footer-bottom p { font-size: 12px; color: rgba(255,255,255,0.3); }

/* ─── RESPONSIVE ─── */
@media (min-width: 640px) {
  .p3-header-phone { display: flex; flex-wrap: wrap; }
  .p3-services-grid { grid-template-columns: 1fr 1fr; }
  .p3-doctors-grid { grid-template-columns: 1fr 1fr; }
  .p3-testi-grid { grid-template-columns: 1fr 1fr; }
}
@media (min-width: 768px) {
  .p3-nav { display: flex; flex-wrap: wrap; }
  .p3-hero-inner { grid-template-columns: 1.1fr 1fr; }
  .p3-about-grid { grid-template-columns: 1fr 1fr; }
  .p3-footer-top { grid-template-columns: 2fr 1fr 1fr 1fr; }
  .p3-footer-bottom { flex-direction: row; justify-content: space-between; text-align: left; }
}
@media (min-width: 1024px) {
  .p3-services-grid { grid-template-columns: 1fr 1fr 1fr 1fr; }
  .p3-doctors-grid { grid-template-columns: 1fr 1fr 1fr 1fr; }
  .p3-testi-grid { grid-template-columns: 1fr 1fr 1fr; }
}


  /* Extracted Template Inline Styles */
  .tpl-templates03-1 { color: #22C55E; }
  .tpl-templates03-2 { color: var(--p3-primary-mid); }
  .tpl-templates03-3 { background: rgba(255,255,255,0.12); color: rgba(255,255,255,0.85); }
  .tpl-templates03-4 { color: #fff; }
  .tpl-templates03-5 { color: rgba(255,255,255,0.65); }
  .tpl-templates03-6 { background: rgba(255,255,255,0.15); color: #fff; border: 1px solid rgba(255,255,255,0.2); }
  .tpl-templates03-7 { border: 2px dashed #22c55e; border-radius: 8px; background: rgba(34,197,94,0.1); color: #166534; }
`;

export const healthcare03Html = `
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,400&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap" rel="stylesheet"/>

<!-- ═══ HEADER ═══ -->
<header class="p3-header">
  <div class="p3-header-inner">
    <a class="p3-logo" href="#">
      LOGO_PLACEHOLDER
    </a>
   
    <div class="p3-header-right">
      <button class="p3-btn p3-btn-primary">Book Now</button>
    </div>
  </div>
</header>

<main>

<!-- ═══ SECTION 1: HERO ═══ -->
<section class="p3-hero">
  <img src="https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=1920&q=80" class="p3-hero-bg-img" alt="Medical Hero Background" />
  <div class="p3-hero-grid-bg"></div>
  <div class="p3-container" style="position: relative; z-index: 2;">
    <div class="p3-hero-inner-centered">
      
      <span class="p3-pill"><span class="material-symbols-outlined tpl-templates03-1"  style="font-size: 12px">bolt</span>Advanced Medical Technology</span>
      
      <h1 class="p3-display" style="font-size: clamp(40px, 6vw, 76px); line-height: 1.05;">
        Medicine <em class="tpl-templates03-2" >Reimagined</em> For You
      </h1>
      
      <p class="p3-body-lg p3-col-muted" style="max-width: 600px;">
        PROJECT_NAME_PLACEHOLDER combines AI-assisted diagnostics with elite specialist care — delivering precision medicine that was once reserved for research hospitals.
      </p>
      
      <div class="p3-hero-features">
        <div class="p3-hero-feat"><span class="material-symbols-outlined">check_circle</span>AI-powered imaging</div>
        <div class="p3-hero-feat"><span class="material-symbols-outlined">check_circle</span>Tumour boards</div>
        <div class="p3-hero-feat"><span class="material-symbols-outlined">check_circle</span>Remote monitoring</div>
      </div>
      
      <div class="p3-hero-form-wrap" style="width: 100%;">
        <form class="p3-hero-form">
          <input type="text" placeholder="Full Name" required />
          <input type="email" placeholder="Email Address" required />
          <input type="tel" placeholder="Phone" required />
          <button type="submit" class="p3-btn p3-btn-primary">Book Now</button>
        </form>
      </div>

      <div class="p3-hero-img-main">
        <img src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&w=1200&q=80" alt="Advanced Medical Facility" />
        <div class="p3-hero-img-tag">
          <div class="dot"></div>
          <span>Live monitoring active — 247 patients today</span>
        </div>
      </div>
      
      <div class="p3-hero-mini-cards">
        <div class="p3-mini-card">
          <span class="material-symbols-outlined icon">psychology</span>
          <span class="val">99<span style="font-size:16px">%</span></span>
          <span class="lbl">Diagnostic Accuracy</span>
        </div>
        <div class="p3-mini-card">
          <span class="material-symbols-outlined icon">timer</span>
          <span class="val">24h</span>
          <span class="lbl">Result Turnaround</span>
        </div>
        <div class="p3-mini-card">
          <span class="material-symbols-outlined icon">groups</span>
          <span class="val">120<span style="font-size:16px">+</span></span>
          <span class="lbl">Specialists On-Site</span>
        </div>
        <div class="p3-mini-card">
          <span class="material-symbols-outlined icon">workspace_premium</span>
          <span class="val">#1</span>
          <span class="lbl">Ranked in Region</span>
        </div>
      </div>

    </div>
  </div>
</section>

<!-- ═══ SECTION 2: SERVICES ═══ -->
<section class="p3-services-outer" id="services">
  <div class="p3-services-header-wrap">
    <div class="p3-container">
      <div class="p3-section-head" style="margin-bottom:0">
        <span class="p3-pill tpl-templates03-3"  >Our Specialties</span>
        <h2 class="p3-h2 tpl-templates03-4"  >Expert Care Across<br>Every Discipline</h2>
        <p class="tpl-templates03-5" style="font-size: 16px; max-width: 500px; text-align: center">Our centres of excellence bring together top specialists, the latest technology, and evidence-based pathways for optimal outcomes.</p>
      </div>
    </div>
  </div>
  <div class="p3-services-cards-wrap">
    <div class="p3-container p3-section-sm">
      <div class="p3-services-grid">
        <div class="p3-svc-card">
          <div class="p3-svc-icon-row">
            <div class="p3-svc-icon"><span class="material-symbols-outlined">cardiology</span></div>
            <span class="p3-svc-num">01</span>
          </div>
          <h3>Cardiovascular Centre</h3>
          <p>Advanced cardiac imaging, interventional cardiology, electrophysiology, and a dedicated heart failure clinic.</p>
          <div class="p3-svc-tags">
            <span class="p3-svc-tag">Imaging</span>
            <span class="p3-svc-tag">Surgery</span>
            <span class="p3-svc-tag">Rehab</span>
          </div>
        </div>
        <div class="p3-svc-card">
          <div class="p3-svc-icon-row">
            <div class="p3-svc-icon"><span class="material-symbols-outlined">genetics</span></div>
            <span class="p3-svc-num">02</span>
          </div>
          <h3>Oncology & Genomics</h3>
          <p>Personalised cancer care using genomic sequencing, immunotherapy and precision radiotherapy technologies.</p>
          <div class="p3-svc-tags">
            <span class="p3-svc-tag">Genomics</span>
            <span class="p3-svc-tag">Immunotherapy</span>
          </div>
        </div>
        <div class="p3-svc-card">
          <div class="p3-svc-icon-row">
            <div class="p3-svc-icon"><span class="material-symbols-outlined">neurology</span></div>
            <span class="p3-svc-num">03</span>
          </div>
          <h3>Neuroscience Institute</h3>
          <p>Comprehensive diagnostics and treatment for neurological and neurosurgical conditions using 7T MRI technology.</p>
          <div class="p3-svc-tags">
            <span class="p3-svc-tag">7T MRI</span>
            <span class="p3-svc-tag">Surgery</span>
          </div>
        </div>
        <div class="p3-svc-card">
          <div class="p3-svc-icon-row">
            <div class="p3-svc-icon"><span class="material-symbols-outlined">ent</span></div>
            <span class="p3-svc-num">04</span>
          </div>
          <h3>Metabolic & Endocrine</h3>
          <p>Diabetes management, thyroid care, adrenal disorders and weight management with multidisciplinary support.</p>
          <div class="p3-svc-tags">
            <span class="p3-svc-tag">Diabetes</span>
            <span class="p3-svc-tag">Thyroid</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ═══ SECTION 3: ABOUT ═══ -->
<section class="p3-section" id="about">
  <div class="p3-container">
    <div class="p3-about-grid">
      <div class="p3-about-visual">
        <div class="p3-about-img-box">
          <img src="https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&w=800&q=80" alt="Medical Research"/>
        </div>
        <div class="p3-about-float">
          <div class="p3-about-float accent-line"></div>
          <span class="val">2,400+</span>
          <span class="lbl">Clinical trials completed</span>
        </div>
      </div>
      <div class="p3-about-text">
        <div>
          <span class="p3-pill" style="margin-bottom:16px;display:inline-flex">Why NovaMed</span>
          <h2 class="p3-h2" style="margin-top:12px">The Science of Better Outcomes</h2>
        </div>
        <p class="p3-body p3-col-muted">PROJECT_NAME_PLACEHOLDER was built on a single principle: every patient deserves hospital-grade, research-backed care. We invest 12% of revenue back into clinical research — ensuring our protocols remain a decade ahead of standard practice.</p>
        <div class="p3-credentials">
          <div class="p3-cred-card">
            <span class="material-symbols-outlined">biotech</span>
            <h4>Research-Grade Diagnostics</h4>
            <p>Equipped with the same technology used in Oxford and Cambridge research hospitals.</p>
          </div>
          <div class="p3-cred-card">
            <span class="material-symbols-outlined">groups_3</span>
            <h4>Tumour Board Reviews</h4>
            <p>Complex cases are reviewed by a panel of specialists every Tuesday and Thursday.</p>
          </div>
          <div class="p3-cred-card">
            <span class="material-symbols-outlined">robot_2</span>
            <h4>AI-Assisted Pathology</h4>
            <p>Machine learning models validated against 10 million images support every diagnosis.</p>
          </div>
          <div class="p3-cred-card">
            <span class="material-symbols-outlined">security</span>
            <h4>ISO 27001 Certified</h4>
            <p>Your health data is protected by the highest international information security standard.</p>
          </div>
        </div>
        <button class="p3-btn p3-btn-primary" style="align-self:flex-start">Our Research Programme</button>
      </div>
    </div>
  </div>
</section>

<!-- ═══ SECTION 4: PROCESS ═══ -->
<section class="p3-section p3-process-bg" id="process">
  <div class="p3-container">
    <div class="p3-section-head">
      <span class="p3-pill">Patient Journey</span>
      <h2 class="p3-h2">Precision from First Contact</h2>
      <p class="p3-body p3-col-muted" style="max-width:500px">Our structured pathway ensures you receive the right care, at the right time, from the right specialist.</p>
    </div>
    <div class="p3-process-steps">
      <div class="p3-proc-step">
        <div class="p3-proc-left">
          <div class="p3-proc-circle">1</div>
        </div>
        <div class="p3-proc-body">
          <span class="p3-proc-chip"><span class="material-symbols-outlined" style="font-size:14px">schedule</span>Day 1</span>
          <h3>Intake & Pre-Assessment</h3>
          <p>Your coordinator completes a digital health intake, reviews your history and arranges any pre-appointment investigations to maximise your consultation time.</p>
        </div>
      </div>
      <div class="p3-proc-step">
        <div class="p3-proc-left">
          <div class="p3-proc-circle">2</div>
        </div>
        <div class="p3-proc-body">
          <span class="p3-proc-chip"><span class="material-symbols-outlined" style="font-size:14px">person</span>Day 2–3</span>
          <h3>Specialist Consultation</h3>
          <p>A 60-minute consultation with your assigned specialist. No rushed appointments — you will have time to ask every question and understand every option.</p>
        </div>
      </div>
      <div class="p3-proc-step">
        <div class="p3-proc-left">
          <div class="p3-proc-circle">3</div>
        </div>
        <div class="p3-proc-body">
          <span class="p3-proc-chip"><span class="material-symbols-outlined" style="font-size:14px">biotech</span>Day 3–5</span>
          <h3>Advanced Diagnostics</h3>
          <p>Same-site imaging, pathology and genetic testing with results reviewed by our AI-assisted diagnostic platform and your consultant simultaneously.</p>
        </div>
      </div>
      <div class="p3-proc-step">
        <div class="p3-proc-left">
          <div class="p3-proc-circle">4</div>
        </div>
        <div class="p3-proc-body">
          <span class="p3-proc-chip"><span class="material-symbols-outlined" style="font-size:14px">task_alt</span>Week 1+</span>
          <h3>Personalised Care Plan</h3>
          <p>A written, evidence-cited care plan is delivered within 24 hours of your results. Ongoing support from your dedicated care navigator ensures you're never alone.</p>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ═══ SECTION 5: DOCTORS ═══ -->
<section class="p3-section p3-doctors-bg" id="doctors">
  <div class="p3-container">
    <div class="p3-section-head">
      <span class="p3-pill">Meet the Team</span>
      <h2 class="p3-h2">World-Class Specialists</h2>
      <p class="p3-body p3-col-muted" style="max-width:480px">Every physician at PROJECT_NAME_PLACEHOLDER holds a subspecialty qualification and brings international research experience.</p>
    </div>
    <div class="p3-doctors-grid">
      <div class="p3-doctor-card">
        <div class="p3-doctor-img">
          <img src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=600&q=80" alt="Dr Ahmed"/>
        </div>
        <div class="p3-doctor-info">
          <p class="p3-doctor-name">Dr Khalid Ahmed</p>
          <p class="p3-doctor-spec">Interventional Cardiology</p>
          <p class="p3-doctor-exp">22 years · Former NHS Consultant</p>
          <a class="p3-doctor-book" href="#">Book Consultation</a>
        </div>
      </div>
      <div class="p3-doctor-card">
        <div class="p3-doctor-img">
          <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80" alt="Dr Patel"/>
        </div>
        <div class="p3-doctor-info">
          <p class="p3-doctor-name">Dr Sonia Patel</p>
          <p class="p3-doctor-spec">Oncology & Genomics</p>
          <p class="p3-doctor-exp">18 years · Harvard-trained</p>
          <a class="p3-doctor-book" href="#">Book Consultation</a>
        </div>
      </div>
      <div class="p3-doctor-card">
        <div class="p3-doctor-img">
          <img src="https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=600&q=80" alt="Dr Larsson"/>
        </div>
        <div class="p3-doctor-info">
          <p class="p3-doctor-name">Dr Eva Larsson</p>
          <p class="p3-doctor-spec">Neurosurgery</p>
          <p class="p3-doctor-exp">15 years · Oxford DPhil</p>
          <a class="p3-doctor-book" href="#">Book Consultation</a>
        </div>
      </div>
      <div class="p3-doctor-card">
        <div class="p3-doctor-img">
          <img src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80" alt="Dr Okonkwo"/>
        </div>
        <div class="p3-doctor-info">
          <p class="p3-doctor-name">Dr Emmanuel Okonkwo</p>
          <p class="p3-doctor-spec">Endocrinology & Diabetes</p>
          <p class="p3-doctor-exp">12 years · King's College</p>
          <a class="p3-doctor-book" href="#">Book Consultation</a>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ═══ SECTION 6: TESTIMONIALS ═══ -->
<section class="p3-section p3-testi-bg" id="testimonials">
  <div class="p3-container">
    <div class="p3-section-head">
      <span class="p3-pill p3-pill-accent">Patient Outcomes</span>
      <h2 class="p3-h2 p3-col-white">Lives Changed. Stories Told.</h2>
    </div>
    <div class="p3-testi-grid">
      <div class="p3-testi-card">
        <div class="p3-testi-stars">
          <span class="material-symbols-outlined" style="font-variation-settings:'FILL' 1">star</span>
          <span class="material-symbols-outlined" style="font-variation-settings:'FILL' 1">star</span>
          <span class="material-symbols-outlined" style="font-variation-settings:'FILL' 1">star</span>
          <span class="material-symbols-outlined" style="font-variation-settings:'FILL' 1">star</span>
          <span class="material-symbols-outlined" style="font-variation-settings:'FILL' 1">star</span>
        </div>
        <p class="p3-testi-text">"The genomic testing identified a rare variant that changed my entire treatment path. Other hospitals hadn't even considered it. I'm now 3 years in remission."</p>
        <div class="p3-testi-author">
          <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80" alt="Marcus"/>
          <div>
            <p class="p3-testi-name">Marcus Thornton</p>
            <p class="p3-testi-tag">Oncology · 3 Years in Remission</p>
          </div>
        </div>
      </div>
      <div class="p3-testi-card">
        <div class="p3-testi-stars">
          <span class="material-symbols-outlined" style="font-variation-settings:'FILL' 1">star</span>
          <span class="material-symbols-outlined" style="font-variation-settings:'FILL' 1">star</span>
          <span class="material-symbols-outlined" style="font-variation-settings:'FILL' 1">star</span>
          <span class="material-symbols-outlined" style="font-variation-settings:'FILL' 1">star</span>
          <span class="material-symbols-outlined" style="font-variation-settings:'FILL' 1">star</span>
        </div>
        <p class="p3-testi-text">"The 7T MRI found the source of my epilepsy that 3 previous scans missed. The neurosurgery team operated within the month. I haven't had a seizure since."</p>
        <div class="p3-testi-author">
          <img src="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=100&q=80" alt="Natalia"/>
          <div>
            <p class="p3-testi-name">Natalia Kowalski</p>
            <p class="p3-testi-tag">Neuroscience · Seizure-Free 18 Months</p>
          </div>
        </div>
      </div>
      <div class="p3-testi-card">
        <div class="p3-testi-stars">
          <span class="material-symbols-outlined" style="font-variation-settings:'FILL' 1">star</span>
          <span class="material-symbols-outlined" style="font-variation-settings:'FILL' 1">star</span>
          <span class="material-symbols-outlined" style="font-variation-settings:'FILL' 1">star</span>
          <span class="material-symbols-outlined" style="font-variation-settings:'FILL' 1">star</span>
          <span class="material-symbols-outlined" style="font-variation-settings:'FILL' 1">star</span>
        </div>
        <p class="p3-testi-text">"My HbA1c was 11.2 when I arrived. Six months into the personalised metabolic programme it's 6.4. The team's precision approach made everything click."</p>
        <div class="p3-testi-author">
          <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" alt="Raj"/>
          <div>
            <p class="p3-testi-name">Rajesh Menon</p>
            <p class="p3-testi-tag">Endocrinology · HbA1c Normalised</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ═══ SECTION 7: CTA ═══ -->
<section class="p3-section p3-cta-bg" id="booking">
  <div class="p3-cta-mesh"></div>
  <div class="p3-container">
    <div class="p3-cta-inner">
      <span class="p3-pill tpl-templates03-6"  >Start Today</span>
      <h2>Precision Care<br>Starts With One Call</h2>
      <p>New patients receive a complimentary multidisciplinary health review — a £400 value — with no obligation. Appointments typically within 72 hours.</p>
      <div class="p3-cta-actions">
        <button class="p3-btn p3-btn-white" style="padding:16px 36px;font-size:16px">Book Free Review</button>
        <button class="p3-btn p3-btn-ghost-w">Speak to a Coordinator</button>
      </div>
      <div class="p3-cta-perks">
        <div class="p3-cta-perk"><span class="material-symbols-outlined">check_circle</span>No GP referral needed</div>
        <div class="p3-cta-perk"><span class="material-symbols-outlined">check_circle</span>All major insurers accepted</div>
        <div class="p3-cta-perk"><span class="material-symbols-outlined">check_circle</span>Self-pay options available</div>
        <div class="p3-cta-perk"><span class="material-symbols-outlined">check_circle</span>Available 7 days a week</div>
      </div>
    </div>
  </div>
</section>

<!-- ═══ SECTION 8: FAQ ═══ -->
<section class="p3-section" id="faqs">
  <div class="p3-container">
    <div class="p3-section-head">
      <span class="p3-pill">FAQ</span>
      <h2 class="p3-h2">Questions, Answered</h2>
    </div>
    <div class="p3-faq-wrap">
      <div class="p3-faq-list">
        <details class="p3-faq-item" open>
          <summary class="p3-faq-sum">What makes NovaMed different from other private hospitals? <span class="material-symbols-outlined">expand_more</span></summary>
          <div class="p3-faq-ans">We invest 12% of our revenue into ongoing clinical research, meaning our protocols are continually updated as new evidence emerges. Our AI-assisted diagnostic platform, 7T MRI, and multidisciplinary tumour boards are not typically available in private hospitals.</div>
        </details>
        <details class="p3-faq-item">
          <summary class="p3-faq-sum">How quickly can I access specialist care? <span class="material-symbols-outlined">expand_more</span></summary>
          <div class="p3-faq-ans">The majority of patients are seen within 72 hours of initial contact. For urgent or oncological cases, we offer next-day priority slots. Our care coordinators are available 8am–8pm seven days a week.</div>
        </details>
        <details class="p3-faq-item">
          <summary class="p3-faq-sum">Do you accept private health insurance? <span class="material-symbols-outlined">expand_more</span></summary>
          <div class="p3-faq-ans">Yes. We are recognised by all major UK private insurers including Bupa, AXA Health, Aviva, Vitality, and Cigna. We handle all pre-authorisation paperwork on your behalf. Self-pay and medical finance options are also available.</div>
        </details>
        <details class="p3-faq-item">
          <summary class="p3-faq-sum">Is the genomic and AI diagnostic data kept confidential? <span class="material-symbols-outlined">expand_more</span></summary>
          <div class="p3-faq-ans">Absolutely. All patient data, including genomic information, is stored under ISO 27001 certification and is fully GDPR-compliant. Your data is never used for commercial purposes without explicit written consent.</div>
        </details>
        <details class="p3-faq-item">
          <summary class="p3-faq-sum">Can I access care remotely or through telemedicine? <span class="material-symbols-outlined">expand_more</span></summary>
          <div class="p3-faq-ans">Yes. Follow-up consultations, medication reviews, and second opinions can be provided via our secure HD telemedicine platform. Remote patient monitoring devices can be sent to your home for ongoing clinical oversight.</div>
        </details>
      </div>
    </div>
  </div>
</section>

</main>

<!-- ═══ FOOTER ═══ -->
<footer class="p3-footer">
  <div class="p3-footer-top">
    <div class="p3-footer-brand">
      <div class="p3-footer-logo">
        <span class="p3-footer-logo-text">LOGO_PLACEHOLDER</span>
      </div>
      <p class="p3-footer-desc">Precision medicine for the modern era. Research-backed, data-driven, deeply human.</p>
      <div class="p3-footer-socials">
        <a class="p3-footer-s-btn" href="#"><span class="material-symbols-outlined">public</span></a>
        <a class="p3-footer-s-btn" href="#"><span class="material-symbols-outlined">science</span></a>
        <a class="p3-footer-s-btn" href="#"><span class="material-symbols-outlined">video_camera_front</span></a>
      </div>
    </div>
    <div class="p3-footer-col">
      <h5>Specialties</h5>
      <nav class="p3-footer-links">
        <a href="#">Cardiovascular</a>
        <a href="#">Oncology</a>
        <a href="#">Neuroscience</a>
        <a href="#">Endocrinology</a>
        <a href="#">Genomics</a>
      </nav>
    </div>
    <div class="p3-footer-col">
      <h5>Patients</h5>
      <nav class="p3-footer-links">
        <a href="#">Book Appointment</a>
        <a href="#">Patient Portal</a>
        <a href="#">Insurance Info</a>
        <a href="#">Research Trials</a>
        <a href="#">Patient Stories</a>
      </nav>
    </div>
    <div class="p3-footer-col">
      <h5>Contact</h5>
      <ul class="p3-footer-contact-list">
        <li><span class="material-symbols-outlined">location_on</span><span>Nova Tower, 1 Medical Quarter, London EC1A 1BB</span></li>
        <li><span class="material-symbols-outlined">phone</span><span>0800 000 NOVA</span></li>
        <li><span class="material-symbols-outlined">mail</span><span>patients@novamed.co.uk</span></li>
        <li><span class="material-symbols-outlined">schedule</span><span>7 days · 8am – 10pm</span></li>
      </ul>
    </div>
  </div>
  <div class="p3-footer-bottom">
    <p>© 2026 PROJECT_NAME_PLACEHOLDER Ltd. All rights reserved.</p>
    <p>Privacy · Terms · Accessibility · Research Ethics</p>
  </div>
</footer>


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
            e.target.innerHTML = '<div class="tpl-templates03-7" style="padding: 20px; text-align: center"><h3 style="margin: 0 0 10px 0; font-size: 20px;">Thank You!</h3><p style="margin: 0;">Your request has been submitted successfully.</p></div>';
          }, 1000);
        }
      }
    }, true);
  })();
</script>

`;