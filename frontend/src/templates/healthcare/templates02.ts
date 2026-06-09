// Auto-generated ULTRA-DYNAMIC template — healthcare templates02
// Generated: 2026-05-25T00:00:00.000Z
// Theme: VitaCare Wellness — Teal / Mint — Clean Premium

export const healthcare02Styles = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Playfair+Display:wght@400;600;700&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap');

:root {
  --primary: PRIMARY_COLOR_PLACEHOLDER;
  --primary-dark: PRIMARY_COLOR_PLACEHOLDER;
  --primary-light: #f8fafc;
  --primary-xlight: #ffffff;
  --secondary: SECONDARY_COLOR_PLACEHOLDER;
  --accent: SECONDARY_COLOR_PLACEHOLDER;
  --on-primary: #ffffff;
  --on-surface: #0f172a;
  --surface: #ffffff;
  --surface-card: #ffffff;
  --surface-muted: #f8fafc;
  --text-muted: #64748b;
  --text-light: #94a3b8;
  --border: #868686ff;
  --border-mid: SECONDARY_COLOR_PLACEHOLDER;
  --error: #ef4444;
  --shadow-sm: 0 2px 8px rgba(0,0,0,0.08);
  --shadow-md: 0 8px 24px rgba(0,0,0,0.12);
  --shadow-lg: 0 20px 60px rgba(0,0,0,0.16);
  --radius-sm: 10px;
  --radius-md: 16px;
  --radius-lg: 24px;
  --radius-xl: 32px;
  --font-display: 'Playfair Display', serif;
  --font-body: 'DM Sans', sans-serif;
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
  font-family: var(--font-body);
  background-color: var(--surface);
  color: var(--on-surface);
  font-size: 16px; line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}
img { max-width: 100%; height: auto; display: block; }
a { text-decoration: none; color: inherit; }
button { cursor: pointer; border: none; background: none; font-family: inherit; }
ul { list-style: none; }
input, select, textarea { font-family: inherit; }

/* ─── ANIMATIONS ─── */
.scroll-fade-up {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}
.scroll-fade-up.is-visible {
  opacity: 1;
  transform: translateY(0);
}

/* ─── TYPOGRAPHY ─── */
.t-display { font-family: var(--font-display); font-size: clamp(38px,5vw,64px); line-height: 1.1; font-weight: 700; letter-spacing: -0.02em; }
.t-h2 { font-family: var(--font-display); font-size: clamp(28px,3.5vw,44px); line-height: 1.2; font-weight: 600; letter-spacing: -0.01em; }
.t-h3 { font-family: var(--font-body); font-size: 22px; line-height: 1.3; font-weight: 600; }
.t-h4 { font-family: var(--font-body); font-size: 16px; font-weight: 600; }
.t-body-lg { font-family: var(--font-body); font-size: 18px; line-height: 1.7; font-weight: 400; }
.t-body { font-family: var(--font-body); font-size: 15px; line-height: 1.65; font-weight: 400; }
.t-label { font-family: var(--font-body); font-size: 12px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; }
.t-caption { font-family: var(--font-body); font-size: 13px; line-height: 1.5; font-weight: 400; }
.col-primary { color: var(--primary); }
.col-secondary { color: var(--secondary); }
.col-muted { color: var(--text-muted); }
.col-light { color: var(--text-light); }
.col-white { color: #ffffff; }

/* ─── LAYOUT ─── */
.v2-container { width: 100%; max-width: 1200px; margin: 0 auto; padding: 0 1.5rem; }
.v2-section { padding: 96px 0; }
.v2-section-sm { padding: 64px 0; }
.v2-tag {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 5px 14px; border-radius: 100px;
  background: var(--primary-light); color: var(--primary-dark);
  font-family: var(--font-body); font-size: 12px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase;
}
.v2-section-head { text-align: center; margin-bottom: 60px; display: flex; flex-direction: column; gap: 16px; align-items: center; }
.v2-section-head p { max-width: 520px; }

/* ─── BUTTONS ─── */
.v2-btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  padding: 14px 28px; border-radius: var(--radius-sm);
  font-family: var(--font-body); font-size: 15px; font-weight: 600;
  cursor: pointer; transition: all 0.22s ease; white-space: nowrap;
}
.v2-btn-primary { background: var(--primary); color: #fff; }
.v2-btn-primary:hover { background: var(--primary-dark); transform: translateY(-1px); box-shadow: var(--shadow-md); }
.v2-btn-outline { background: transparent; border: 2px solid var(--primary); color: var(--primary); }
.v2-btn-outline:hover { background: var(--primary-xlight); }
.v2-btn-ghost { background: rgba(255,255,255,0.18); border: 2px solid rgba(255,255,255,0.5); color: #fff; }
.v2-btn-ghost:hover { background: rgba(255,255,255,0.28); }
.v2-btn-accent { background: var(--accent); color: #fff; }
.v2-btn-accent:hover { opacity: 0.9; transform: translateY(-1px); }

/* ─── HEADER ─── */
.v2-header {
  position: sticky; top: 0; z-index: 100;
  background: rgba(248,255,254,0.92);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--border);
  box-shadow: var(--shadow-sm);
}
.v2-header-inner {
  display: flex; align-items: center; justify-content: space-between;
  padding: 18px 1.5rem; max-width: 1200px; margin: 0 auto;
}
.v2-logo {
  display: flex; align-items: center; gap: 10px;
  font-family: var(--font-display); font-size: 22px; font-weight: 700; color: var(--primary-dark);
}
.v2-logo-mark {
  width: 38px; height: 38px; background: var(--primary);
  border-radius: 10px; display: flex; align-items: center; justify-content: center;
}
.v2-logo-mark span { color: #fff; font-size: 20px; }
.v2-nav { display: none; align-items: center; gap: 36px; }
.v2-nav a { font-size: 14px; font-weight: 500; color: var(--text-muted); transition: color 0.2s; }
.v2-nav a:hover { color: var(--primary); }
.v2-header-cta { display: flex; align-items: center; gap: 14px; }
.v2-header-phone {
  display: none; align-items: center; gap: 6px;
  font-size: 14px; font-weight: 600; color: var(--secondary);
}
.v2-header-phone span.material-symbols-outlined { font-size: 18px; color: var(--primary); }

/* ─── HERO ─── */
.v2-hero {
  position: relative; overflow: hidden;
  background: var(--surface);
  padding: 80px 0 80px;
  min-height: 92vh; display: flex; align-items: flex-start;
}
.v2-hero-bg-circles {
  position: absolute; inset: 0; pointer-events: none; overflow: hidden;
}
.v2-circle-1 {
  position: absolute; top: -100px; right: -100px;
  width: 600px; height: 600px; border-radius: 50%;
  background: radial-gradient(circle, var(--primary-light) 0%, transparent 70%);
  opacity: 0.6;
}
.v2-circle-2 {
  position: absolute; bottom: -200px; left: -100px;
  width: 500px; height: 500px; border-radius: 50%;
  background: radial-gradient(circle, var(--primary-light) 0%, transparent 70%);
  opacity: 0.4;
}
.v2-hero-inner {
  position: relative; z-index: 2;
  display: grid; grid-template-columns: 1fr; gap: 48px; align-items: center;
}
.v2-hero-text { display: flex; flex-direction: column; gap: 28px; }
.v2-hero-stat-chips { display: flex; gap: 12px; flex-wrap: wrap; }
.v2-stat-chip {
  display: flex; align-items: center; gap: 8px;
  padding: 8px 16px; border-radius: 100px;
  background: #fff; border: 1px solid var(--border-mid);
  box-shadow: var(--shadow-sm);
}
.v2-stat-chip span.num { font-weight: 700; color: var(--primary); }
.v2-stat-chip span.lbl { font-size: 13px; color: var(--text-muted); }
.v2-hero-actions { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
.v2-hero-trust { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.v2-trust-avatars { display: flex; flex-wrap: wrap; max-width: 200px; }
.v2-trust-avatars img {
  width: 34px; height: 34px; border-radius: 50%;
  border: 2px solid #fff; object-fit: cover; margin-left: -8px;
  flex-shrink: 0;
}
.v2-trust-avatars img:first-child { margin-left: 0; }
.v2-trust-text { font-size: 13px; font-weight: 500; color: var(--text-muted); }
.v2-trust-text strong { color: var(--primary); }
.v2-hero-visual { position: relative; }
.v2-hero-img-wrap {
  position: relative; border-radius: var(--radius-xl);
  overflow: hidden; aspect-ratio: 16/9;
  box-shadow: var(--shadow-lg);
}
.v2-hero-img-wrap img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
.v2-hero-img-wrap:hover img { transform: scale(1.05); }
.v2-hero-card-1 {
  display: none;
  position: absolute; bottom: 32px; left: -20px;
  background: #fff; border-radius: var(--radius-md);
  padding: 16px 20px; box-shadow: var(--shadow-md);
  align-items: center; gap: 12px;
  border: 1px solid var(--border);
}
.v2-hero-card-1 .icon-bg { width: 44px; height: 44px; border-radius: 12px; background: var(--primary-light); display: flex; align-items: center; justify-content: center; }
.v2-hero-card-1 .icon-bg span { color: var(--primary); font-size: 22px; }
.v2-hero-card-2 {
  display: none;
  position: absolute; top: 24px; right: -20px;
  background: var(--primary); border-radius: var(--radius-md);
  padding: 14px 18px; box-shadow: var(--shadow-md);
  flex-direction: column; align-items: center; gap: 4px;
}
.v2-hero-card-2 span.big { font-size: 28px; font-weight: 700; color: #fff; font-family: var(--font-display); }
.v2-hero-card-2 span.sm { font-size: 11px; font-weight: 600; color: rgba(255,255,255,0.8); letter-spacing: 0.05em; }

/* ─── SERVICES ─── */
.v2-services-grid {
  display: grid; grid-template-columns: 1fr; gap: 20px;
}
.v2-service-card {
  background: #fff; border-radius: var(--radius-md);
  padding: 32px 28px; display: flex; flex-direction: column; gap: 16px;
  border: 1px solid var(--border); box-shadow: var(--shadow-sm);
  transition: all 0.3s ease; cursor: default;
}
.v2-service-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-md); border-color: var(--primary); }
.v2-service-icon {
  width: 56px; height: 56px; border-radius: var(--radius-sm);
  background: var(--primary-xlight); display: flex; align-items: center; justify-content: center;
  transition: background 0.3s;
}
.v2-service-card:hover .v2-service-icon { background: var(--primary); }
.v2-service-icon span { color: var(--primary); font-size: 28px; transition: color 0.3s; }
.v2-service-card:hover .v2-service-icon span { color: #fff; }
.v2-service-card h3 { font-size: 18px; font-weight: 600; color: var(--on-surface); }
.v2-service-card p { font-size: 14px; color: var(--text-muted); line-height: 1.65; flex: 1; }
.v2-service-link { display: flex; align-items: center; gap: 6px; font-size: 14px; font-weight: 600; color: var(--primary); }
.v2-service-link span.material-symbols-outlined { font-size: 16px; }

/* ─── STATS STRIP ─── */
.v2-stats-section {
  background: var(--secondary); padding: 64px 0;
}
.v2-stats-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 40px;
}
.v2-stat-item { text-align: center; transition: transform 0.3s ease; }
.v2-stat-item:hover { transform: translateY(-5px); }
.v2-stat-num { font-family: var(--font-display); font-size: clamp(36px,5vw,56px); font-weight: 700; color: var(--primary-dark); line-height: 1; }
.v2-stat-suffix { color: var(--primary); }
.v2-stat-label { font-size: 14px; color: var(--text-muted); margin-top: 6px; font-weight: 600; }

/* ─── ABOUT / TEAM ─── */
.v2-about-grid { display: grid; grid-template-columns: 1fr; gap: 60px; align-items: center; }
.v2-about-imgs { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.v2-about-img-main { grid-column: 1 / -1; border-radius: var(--radius-lg); overflow: hidden; aspect-ratio: 16/9; }
.v2-about-img-main img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
.v2-about-img-main:hover img { transform: scale(1.05); }
.v2-about-img-sm { border-radius: var(--radius-md); overflow: hidden; aspect-ratio: 1; }
.v2-about-img-sm img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
.v2-about-img-sm:hover img { transform: scale(1.05); }
.v2-about-text { display: flex; flex-direction: column; gap: 28px; }
.v2-about-points { display: flex; flex-direction: column; gap: 20px; }
.v2-about-point { display: flex; gap: 16px; align-items: flex-start; }
.v2-about-point-icon { flex-shrink: 0; width: 40px; height: 40px; border-radius: 10px; background: var(--secondary); display: flex; align-items: center; justify-content: center; }
.v2-about-point-icon span { color: var(--primary); font-size: 20px; }
.v2-about-point-text h4 { font-size: 15px; font-weight: 600; margin-bottom: 4px; }
.v2-about-point-text p { font-size: 14px; color: var(--text-muted); }

/* ─── PROCESS ─── */
.v2-process-bg { background: var(--primary-xlight); }
.v2-process-grid { display: grid; grid-template-columns: 1fr; gap: 32px; }
.v2-process-step {
  background: #fff; border-radius: var(--radius-md);
  padding: 32px; display: flex; gap: 20px; align-items: flex-start;
  border: 1px solid var(--border); box-shadow: var(--shadow-sm);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.v2-process-step:hover { transform: translateY(-4px); box-shadow: var(--shadow-md); }
.v2-step-num {
  flex-shrink: 0; width: 52px; height: 52px; border-radius: 14px;
  background: var(--primary); display: flex; align-items: center; justify-content: center;
  font-family: var(--font-display); font-size: 20px; font-weight: 700; color: #fff;
}
.v2-step-body h3 { font-size: 17px; font-weight: 600; margin-bottom: 8px; }
.v2-step-body p { font-size: 14px; color: var(--text-muted); }

/* ─── TESTIMONIALS ─── */
.v2-testi-grid { display: grid; grid-template-columns: 1fr; gap: 20px; }
.v2-testi-card {
  background: #fff; border-radius: var(--radius-md);
  padding: 28px; display: flex; flex-direction: column; gap: 16px;
  border: 1px solid var(--border); box-shadow: var(--shadow-sm);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.v2-testi-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-md); }
.v2-testi-stars { display: flex; gap: 3px; }
.v2-testi-stars span { color: var(--accent); font-size: 18px; }
.v2-testi-quote { font-size: 15px; color: var(--text-muted); line-height: 1.7; font-style: italic; flex: 1; }
.v2-testi-author { display: flex; align-items: center; gap: 12px; border-top: 1px solid var(--border); padding-top: 16px; }
.v2-testi-author img { width: 44px; height: 44px; border-radius: 50%; object-fit: cover; }
.v2-testi-name { font-size: 14px; font-weight: 600; }
.v2-testi-role { font-size: 12px; color: var(--text-light); }

/* ─── CTA SECTION ─── */
.v2-cta-section {
  background: linear-gradient(135deg, var(--secondary) 0%, var(--primary) 100%);
  position: relative; overflow: hidden;
}
.v2-cta-decor {
  position: absolute; inset: 0; pointer-events: none;
  background-image: radial-gradient(circle at 80% 20%, rgba(255,255,255,0.08) 0%, transparent 50%),
                    radial-gradient(circle at 20% 80%, rgba(255,255,255,0.06) 0%, transparent 50%);
}
.v2-cta-inner {
  position: relative; z-index: 2;
  display: grid; grid-template-columns: 1fr; gap: 40px; align-items: center;
}
.v2-cta-text { display: flex; flex-direction: column; gap: 20px; }
.v2-cta-text h2 { font-family: var(--font-display); font-size: clamp(28px,4vw,48px); color: #fff; font-weight: 700; }
.v2-cta-text p { font-size: 17px; color: rgba(255,255,255,0.8); max-width: 440px; }
.v2-cta-actions { display: flex; gap: 14px; flex-wrap: wrap; }
.v2-cta-form-card {
  background: rgba(255,255,255,0.12);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: var(--radius-lg);
  padding: 36px;
}
.v2-cta-form-title { font-size: 20px; font-weight: 600; color: #fff; margin-bottom: 24px; }
.v2-form-field { margin-bottom: 16px; }
.v2-form-label { display: block; font-size: 12px; font-weight: 600; color: rgba(255,255,255,0.75); margin-bottom: 6px; letter-spacing: 0.05em; }
.v2-form-input {
  width: 100%; padding: 12px 14px;
  background: rgba(255,255,255,0.15);
  border: 1px solid rgba(255,255,255,0.25);
  border-radius: var(--radius-sm); color: #fff; font-size: 14px;
}
.v2-form-input::placeholder { color: rgba(255,255,255,0.5); }
.v2-form-input:focus { outline: none; border-color: rgba(255,255,255,0.6); background: rgba(255,255,255,0.2); }
.v2-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.v2-form-submit { width: 100%; background: #fff; color: var(--primary-dark); padding: 13px; border-radius: var(--radius-sm); font-size: 15px; font-weight: 700; cursor: pointer; margin-top: 8px; transition: all 0.2s; }
.v2-form-submit:hover { background: var(--primary-light); }

/* ─── FAQ ─── */
.v2-faq-wrap { max-width: 720px; margin: 0 auto; }
.v2-faq-list { display: flex; flex-direction: column; gap: 12px; }
.v2-faq-item {
  background: #fff; border-radius: var(--radius-md);
  border: 1px solid var(--border); overflow: hidden;
}
.v2-faq-summary {
  display: flex; justify-content: space-between; align-items: center;
  padding: 20px 24px; cursor: pointer; list-style: none;
  font-size: 16px; font-weight: 600; color: var(--on-surface);
}
.v2-faq-summary::-webkit-details-marker { display: none; }
.v2-faq-summary .material-symbols-outlined { transition: transform 0.25s; color: var(--primary); }
.v2-faq-item[open] .v2-faq-summary { color: var(--primary); }
.v2-faq-item[open] .v2-faq-summary .material-symbols-outlined { transform: rotate(180deg); }
.v2-faq-body { padding: 0 24px 20px; font-size: 14px; color: var(--text-muted); line-height: 1.7; }

/* ─── FOOTER ─── */
.v2-footer {
  background: var(--secondary); color: rgba(255,255,255,0.8);
}
.v2-footer-top {
  display: grid; grid-template-columns: 1fr; gap: 40px;
  padding: 60px 1.5rem; max-width: 1200px; margin: 0 auto;
}
.v2-footer-brand { display: flex; flex-direction: column; gap: 16px; }
.v2-footer-logo { display: flex; align-items: center; gap: 10px; }
.v2-footer-logo-mark { width: 36px; height: 36px; background: var(--primary); border-radius: 8px; display: flex; align-items: center; justify-content: center; }
.v2-footer-logo-mark span { color: #fff; font-size: 18px; }
.v2-footer-logo-text { font-family: var(--font-display); font-size: 18px; font-weight: 700; color: #fff; }
.v2-footer-desc { font-size: 14px; line-height: 1.7; max-width: 280px; }
.v2-footer-socials { display: flex; gap: 12px; }
.v2-footer-social-link { width: 38px; height: 38px; border-radius: 10px; background: rgba(255,255,255,0.08); display: flex; align-items: center; justify-content: center; transition: background 0.2s; }
.v2-footer-social-link:hover { background: var(--primary); }
.v2-footer-social-link span { color: rgba(255,255,255,0.7); font-size: 18px; }
.v2-footer-col h4 { font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(255,255,255,0.5); margin-bottom: 16px; }
.v2-footer-links { display: flex; flex-direction: column; gap: 10px; }
.v2-footer-links a { font-size: 14px; color: rgba(255,255,255,0.7); transition: color 0.2s; }
.v2-footer-links a:hover { color: #fff; }
.v2-footer-contact { display: flex; flex-direction: column; gap: 12px; }
.v2-footer-contact li { display: flex; align-items: center; gap: 10px; font-size: 14px; }
.v2-footer-contact li span.material-symbols-outlined { font-size: 16px; color: var(--primary); }
.v2-footer-bottom {
  border-top: 1px solid rgba(255,255,255,0.08);
  padding: 20px 1.5rem; max-width: 1200px; margin: 0 auto;
  display: flex; flex-direction: column; gap: 10px; align-items: center; text-align: center;
}
.v2-footer-bottom p { font-size: 13px; color: rgba(255,255,255,0.4); }

/* ─── MEDIA QUERIES ─── */
@media (min-width: 640px) {
  .v2-header-phone { display: flex; }
  .v2-stats-grid { grid-template-columns: repeat(4,1fr); }
}
@media (min-width: 768px) {
  .v2-nav { display: flex; }
  .v2-hero-inner { grid-template-columns: 1fr 1fr; }
  .v2-hero-img-wrap { aspect-ratio: 4/5; }
  .v2-hero-card-1 { display: flex; }
  .v2-hero-card-2 { display: flex; }
  .v2-services-grid { grid-template-columns: 1fr 1fr; }
  .v2-process-grid { grid-template-columns: 1fr 1fr; }
  .v2-testi-grid { grid-template-columns: 1fr 1fr 1fr; }
  .v2-cta-inner { grid-template-columns: 1fr 1fr; }
  .v2-footer-top { grid-template-columns: 2fr 1fr 1fr 1fr; }
  .v2-footer-bottom { flex-direction: row; justify-content: space-between; text-align: left; }
  .v2-about-img-main { grid-column: span 1; aspect-ratio: 4/5; }
}
@media (min-width: 1024px) {
  .v2-services-grid { grid-template-columns: repeat(4,1fr); }
  .v2-about-grid { grid-template-columns: 1fr 1fr; }
}
`;

export const healthcare02Html = `
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Playfair+Display:wght@400;600;700&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap" rel="stylesheet"/>

<!-- ═══ HEADER ═══ -->
<header class="v2-header">
  <div class="v2-header-inner">
    <a class="v2-logo" href="#">
      LOGO_PLACEHOLDER
    </a>
    <div class="v2-header-cta">
      <button class="v2-btn v2-btn-primary">Book Appointment</button>
    </div>
  </div>
</header>

<main>

<!-- ═══ SECTION 1: HERO ═══ -->
<section class="v2-hero">
  <div class="v2-hero-bg-circles">
    <div class="v2-circle-1"></div>
    <div class="v2-circle-2"></div>
  </div>
  <div class="v2-container">
    <div class="v2-hero-inner">
      <div class="v2-hero-text">
        <div>
          <span class="v2-tag"><span class="material-symbols-outlined" style="font-size:13px;font-variation-settings:'FILL' 1">verified</span> ISO 9001 Certified Clinic</span>
        </div>
        <h1 class="t-display">Modern Healthcare,<br><span class="col-primary">Timeless Care</span></h1>
        <p class="t-body-lg col-muted" style="max-width:480px">Comprehensive wellness solutions delivered by specialists who combine cutting-edge medicine with genuine compassion for every patient.</p>
        <div class="v2-hero-stat-chips">
          <div class="v2-stat-chip"><span class="num">15K+</span><span class="lbl">Patients Treated</span></div>
          <div class="v2-stat-chip"><span class="num">98%</span><span class="lbl">Satisfaction Rate</span></div>
          <div class="v2-stat-chip"><span class="num">50+</span><span class="lbl">Specialists</span></div>
        </div>
        <div class="v2-hero-actions">
          <button class="v2-btn v2-btn-primary" style="padding:16px 32px;font-size:16px">Get Free Consultation</button>
          <button class="v2-btn v2-btn-outline">View Services</button>
        </div>
        <div class="v2-hero-trust">
          <div class="v2-trust-avatars">
            <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=100&q=80" alt="Dr 1"/>
            <img src="https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=100&q=80" alt="Dr 2"/>
            <img src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=100&q=80" alt="Dr 3"/>
          </div>
          <p class="v2-trust-text"><strong>50+ doctors</strong> ready to help you today</p>
        </div>
      </div>
      <div class="v2-hero-visual">
        <div class="v2-hero-img-wrap">
          <img src="https://images.unsplash.com/photo-1638202993928-7267aad84c31?auto=format&fit=crop&w=800&q=80" alt="Modern Healthcare Facility"/>
        </div>
        <div class="v2-hero-card-1">
          <div class="icon-bg"><span class="material-symbols-outlined">favorite</span></div>
          <div>
            <p style="font-size:13px;font-weight:700;color:var(--on-surface)">Avg. Wait Time</p>
            <p style="font-size:11px;color:var(--text-light)">Under 10 minutes</p>
          </div>
        </div>
        <div class="v2-hero-card-2">
          <span class="big">4.9</span>
          <span class="sm">★ RATED</span>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ═══ SECTION 2: SERVICES ═══ -->
<section class="v2-section" id="services">
  <div class="v2-container">
    <div class="v2-section-head">
      <span class="v2-tag">What We Offer</span>
      <h2 class="t-h2">Specialized Care for Every Need</h2>
      <p class="t-body col-muted">From routine check-ups to advanced procedures, our multidisciplinary team provides expert care across all medical disciplines.</p>
    </div>
    <div class="v2-services-grid">
      <div class="v2-service-card">
        <div class="v2-service-icon"><span class="material-symbols-outlined">cardiology</span></div>
        <h3>Cardiology</h3>
        <p>Advanced cardiac diagnostics, ECG, echocardiography and intervention by board-certified cardiologists.</p>
        <a class="v2-service-link" href="#">Learn More <span class="material-symbols-outlined">arrow_forward</span></a>
      </div>
      <div class="v2-service-card">
        <div class="v2-service-icon"><span class="material-symbols-outlined">neurology</span></div>
        <h3>Neurology</h3>
        <p>Comprehensive neurological assessments, brain MRI analysis and headache management clinics.</p>
        <a class="v2-service-link" href="#">Learn More <span class="material-symbols-outlined">arrow_forward</span></a>
      </div>
      <div class="v2-service-card">
        <div class="v2-service-icon"><span class="material-symbols-outlined">orthopedics</span></div>
        <h3>Orthopaedics</h3>
        <p>Joint replacement, sports injury rehabilitation and minimally invasive spinal procedures.</p>
        <a class="v2-service-link" href="#">Learn More <span class="material-symbols-outlined">arrow_forward</span></a>
      </div>
      <div class="v2-service-card">
        <div class="v2-service-icon"><span class="material-symbols-outlined">child_care</span></div>
        <h3>Paediatrics</h3>
        <p>Gentle, age-appropriate care for children from newborns through to adolescence, with specialist support.</p>
        <a class="v2-service-link" href="#">Learn More <span class="material-symbols-outlined">arrow_forward</span></a>
      </div>
    </div>
  </div>
</section>

<!-- ═══ SECTION 3: STATS STRIP ═══ -->
<section class="v2-stats-section">
  <div class="v2-container">
    <div class="v2-stats-grid">
      <div class="v2-stat-item">
        <div class="v2-stat-num">15<span class="v2-stat-suffix">K+</span></div>
        <div class="v2-stat-label">Patients Annually</div>
      </div>
      <div class="v2-stat-item">
        <div class="v2-stat-num">98<span class="v2-stat-suffix">%</span></div>
        <div class="v2-stat-label">Satisfaction Score</div>
      </div>
      <div class="v2-stat-item">
        <div class="v2-stat-num">50<span class="v2-stat-suffix">+</span></div>
        <div class="v2-stat-label">Senior Specialists</div>
      </div>
      <div class="v2-stat-item">
        <div class="v2-stat-num">20<span class="v2-stat-suffix">yrs</span></div>
        <div class="v2-stat-label">Clinical Excellence</div>
      </div>
    </div>
  </div>
</section>

<!-- ═══ SECTION 4: ABOUT / WHY US ═══ -->
<section class="v2-section" id="about">
  <div class="v2-container">
    <div class="v2-about-grid">
      <div class="v2-about-imgs">
        <div class="v2-about-img-main">
          <img src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=900&q=80" alt="Modern Clinic"/>
        </div>
        <div class="v2-about-img-sm">
          <img src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=400&q=80" alt="Consultation"/>
        </div>
        <div class="v2-about-img-sm">
          <img src="https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&w=400&q=80" alt="Lab"/>
        </div>
      </div>
      <div class="v2-about-text">
        <div>
          <span class="v2-tag" style="margin-bottom:16px;display:inline-flex">Why VitaCare</span>
          <h2 class="t-h2" style="margin-top:12px">Where Evidence Meets Empathy</h2>
        </div>
        <p class="t-body col-muted">Founded by leading physicians, PROJECT_NAME_PLACEHOLDER integrates the latest evidence-based protocols with a patient-first philosophy — because great medicine is also great care.</p>
        <div class="v2-about-points">
          <div class="v2-about-point">
            <div class="v2-about-point-icon"><span class="material-symbols-outlined">science</span></div>
            <div class="v2-about-point-text">
              <h4>Evidence-Based Protocols</h4>
              <p>Every treatment plan follows the latest NICE and WHO clinical guidelines, reviewed quarterly by our medical board.</p>
            </div>
          </div>
          <div class="v2-about-point">
            <div class="v2-about-point-icon"><span class="material-symbols-outlined">schedule</span></div>
            <div class="v2-about-point-text">
              <h4>Same-Day Appointments</h4>
              <p>We reserve 30% of daily slots for urgent cases so you're never left waiting when it matters most.</p>
            </div>
          </div>
          <div class="v2-about-point">
            <div class="v2-about-point-icon"><span class="material-symbols-outlined">encrypted</span></div>
            <div class="v2-about-point-text">
              <h4>Private & Confidential</h4>
              <p>Your data is fully GDPR-compliant. All records are stored on ISO 27001-certified secure servers.</p>
            </div>
          </div>
        </div>
        <button class="v2-btn v2-btn-primary" style="align-self:flex-start">Meet Our Doctors</button>
      </div>
    </div>
  </div>
</section>

<!-- ═══ SECTION 5: PROCESS ═══ -->
<section class="v2-section v2-process-bg" id="process">
  <div class="v2-container">
    <div class="v2-section-head">
      <span class="v2-tag">How It Works</span>
      <h2 class="t-h2">Your Care Journey in 4 Steps</h2>
      <p class="t-body col-muted">Seamless from first contact to long-term wellness, our structured approach ensures nothing is missed.</p>
    </div>
    <div class="v2-process-grid">
      <div class="v2-process-step">
        <div class="v2-step-num">01</div>
        <div class="v2-step-body">
          <h3>Book Online or Call</h3>
          <p>Choose your specialist, preferred date and time through our instant booking portal or call our coordinators directly.</p>
        </div>
      </div>
      <div class="v2-process-step">
        <div class="v2-step-num">02</div>
        <div class="v2-step-body">
          <h3>Comprehensive Assessment</h3>
          <p>A full clinical workup including digital vitals, advanced imaging, and a detailed history review by your assigned physician.</p>
        </div>
      </div>
      <div class="v2-process-step">
        <div class="v2-step-num">03</div>
        <div class="v2-step-body">
          <h3>Personalised Treatment Plan</h3>
          <p>You receive a clear, evidence-based plan with treatment options, costs, and timelines explained in plain language.</p>
        </div>
      </div>
      <div class="v2-process-step">
        <div class="v2-step-num">04</div>
        <div class="v2-step-body">
          <h3>Ongoing Monitoring</h3>
          <p>Scheduled follow-ups, teleconsultations, and a dedicated care coordinator keep your health on track long-term.</p>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ═══ SECTION 6: TESTIMONIALS ═══ -->
<section class="v2-section" id="testimonials">
  <div class="v2-container">
    <div class="v2-section-head">
      <span class="v2-tag">Patient Stories</span>
      <h2 class="t-h2">Trusted by Thousands</h2>
    </div>
    <div class="v2-testi-grid">
      <div class="v2-testi-card">
        <div class="v2-testi-stars">
          <span class="material-symbols-outlined" style="font-variation-settings:'FILL' 1">star</span>
          <span class="material-symbols-outlined" style="font-variation-settings:'FILL' 1">star</span>
          <span class="material-symbols-outlined" style="font-variation-settings:'FILL' 1">star</span>
          <span class="material-symbols-outlined" style="font-variation-settings:'FILL' 1">star</span>
          <span class="material-symbols-outlined" style="font-variation-settings:'FILL' 1">star</span>
        </div>
        <p class="v2-testi-quote">"The cardiology team detected an issue my previous GP had missed for two years. Their thoroughness genuinely changed my life. I cannot recommend them highly enough."</p>
        <div class="v2-testi-author">
          <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80" alt="James"/>
          <div><p class="v2-testi-name">James Whitfield</p><p class="v2-testi-role">Cardiology Patient</p></div>
        </div>
      </div>
      <div class="v2-testi-card">
        <div class="v2-testi-stars">
          <span class="material-symbols-outlined" style="font-variation-settings:'FILL' 1">star</span>
          <span class="material-symbols-outlined" style="font-variation-settings:'FILL' 1">star</span>
          <span class="material-symbols-outlined" style="font-variation-settings:'FILL' 1">star</span>
          <span class="material-symbols-outlined" style="font-variation-settings:'FILL' 1">star</span>
          <span class="material-symbols-outlined" style="font-variation-settings:'FILL' 1">star</span>
        </div>
        <p class="v2-testi-quote">"My knee replacement surgery went flawlessly. The aftercare physiotherapy programme had me walking without pain in under six weeks — remarkable outcomes."</p>
        <div class="v2-testi-author">
          <img src="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=100&q=80" alt="Priya"/>
          <div><p class="v2-testi-name">Priya Sharma</p><p class="v2-testi-role">Orthopaedic Patient</p></div>
        </div>
      </div>
      <div class="v2-testi-card">
        <div class="v2-testi-stars">
          <span class="material-symbols-outlined" style="font-variation-settings:'FILL' 1">star</span>
          <span class="material-symbols-outlined" style="font-variation-settings:'FILL' 1">star</span>
          <span class="material-symbols-outlined" style="font-variation-settings:'FILL' 1">star</span>
          <span class="material-symbols-outlined" style="font-variation-settings:'FILL' 1">star</span>
          <span class="material-symbols-outlined" style="font-variation-settings:'FILL' 1">star</span>
        </div>
        <p class="v2-testi-quote">"As a mother, finding paediatric doctors who are both clinically brilliant and wonderful with children has been a relief. My daughter actually looks forward to appointments."</p>
        <div class="v2-testi-author">
          <img src="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=100&q=80" alt="Amara"/>
          <div><p class="v2-testi-name">Amara Osei</p><p class="v2-testi-role">Paediatrics Parent</p></div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ═══ SECTION 7: CTA BOOKING ═══ -->
<section class="v2-section v2-cta-section" id="booking">
  <div class="v2-cta-decor"></div>
  <div class="v2-container">
    <div class="v2-cta-inner">
      <div class="v2-cta-text">
        <span class="v2-tag" style="background:rgba(255,255,255,0.15);color:#fff;border:1px solid rgba(255,255,255,0.2)">Start Today</span>
        <h2>Your Health Deserves World-Class Attention</h2>
        <p>New patients receive a complimentary 30-minute health screening worth £150. Limited availability — book your slot today.</p>
        <div class="v2-cta-actions">
          <button class="v2-btn" style="background:#fff;color:var(--primary-dark);padding:16px 32px;font-size:16px">Book Free Screening</button>
          <button class="v2-btn v2-btn-ghost">Call Us Now</button>
        </div>
        <div style="display:flex;gap:24px;flex-wrap:wrap;margin-top:8px">
          <div style="display:flex;align-items:center;gap:8px;color:rgba(255,255,255,0.8);font-size:13px">
            <span class="material-symbols-outlined" style="font-size:16px;font-variation-settings:'FILL' 1">check_circle</span>
            No referral needed
          </div>
          <div style="display:flex;align-items:center;gap:8px;color:rgba(255,255,255,0.8);font-size:13px">
            <span class="material-symbols-outlined" style="font-size:16px;font-variation-settings:'FILL' 1">check_circle</span>
            Same week availability
          </div>
          <div style="display:flex;align-items:center;gap:8px;color:rgba(255,255,255,0.8);font-size:13px">
            <span class="material-symbols-outlined" style="font-size:16px;font-variation-settings:'FILL' 1">check_circle</span>
            All insurers accepted
          </div>
        </div>
      </div>
      <div class="v2-cta-form-card">
        <p class="v2-cta-form-title">Request an Appointment</p>
        <form onsubmit="event.preventDefault(); alert('Form submitted successfully!'); this.reset();">
          <div class="v2-form-field">
            <label class="v2-form-label">Full Name</label>
            <input class="v2-form-input" type="text" placeholder="Your full name"/>
          </div>
          <div class="v2-form-grid">
            <div class="v2-form-field">
              <label class="v2-form-label">Phone</label>
              <input class="v2-form-input" type="tel" placeholder="+44 7000 000"/>
            </div>
            <div class="v2-form-field">
              <label class="v2-form-label">Specialty</label>
              <select class="v2-form-input" style="appearance:none">
                <option>Cardiology</option>
                <option>Neurology</option>
                <option>Orthopaedics</option>
                <option>Paediatrics</option>
                <option>General Medicine</option>
              </select>
            </div>
          </div>
          <div class="v2-form-field">
            <label class="v2-form-label">Preferred Date</label>
            <input class="v2-form-input" type="date"/>
          </div>
          <button class="v2-form-submit" type="submit">Confirm Request →</button>
        </form>
      </div>
    </div>
  </div>
</section>

<!-- ═══ SECTION 8: FAQ ═══ -->
<section class="v2-section" id="faqs">
  <div class="v2-container">
    <div class="v2-section-head">
      <span class="v2-tag">FAQ</span>
      <h2 class="t-h2">Common Questions Answered</h2>
    </div>
    <div class="v2-faq-wrap">
      <div class="v2-faq-list">
        <details class="v2-faq-item" open>
          <summary class="v2-faq-summary">
            Do I need a referral to see a specialist?
            <span class="material-symbols-outlined">expand_more</span>
          </summary>
          <div class="v2-faq-body">No. As a private clinic we accept self-referrals for all specialties. Simply book online or call us and we'll arrange an initial consultation, often within 48 hours.</div>
        </details>
        <details class="v2-faq-item">
          <summary class="v2-faq-summary">
            Which insurance providers do you work with?
            <span class="material-symbols-outlined">expand_more</span>
          </summary>
          <div class="v2-faq-body">We are recognised by all major UK insurers including Bupa, AXA, Aviva, Vitality and Cigna. Our billing team handles all pre-authorisation to make the process seamless for you.</div>
        </details>
        <details class="v2-faq-item">
          <summary class="v2-faq-summary">
            How quickly can I get an appointment?
            <span class="material-symbols-outlined">expand_more</span>
          </summary>
          <div class="v2-faq-body">Most patients are seen within 2-3 working days. For urgent matters we offer same-day emergency slots; please call our priority line directly.</div>
        </details>
        <details class="v2-faq-item">
          <summary class="v2-faq-summary">
            Are virtual / teleconsultation appointments available?
            <span class="material-symbols-outlined">expand_more</span>
          </summary>
          <div class="v2-faq-body">Yes. We offer secure HD video consultations for follow-ups, medication reviews, and initial assessments where a physical exam is not required. Available 7 days a week.</div>
        </details>
        <details class="v2-faq-item">
          <summary class="v2-faq-summary">
            What is your cancellation policy?
            <span class="material-symbols-outlined">expand_more</span>
          </summary>
          <div class="v2-faq-body">We ask for 24 hours' notice to cancel or reschedule at no charge. Cancellations within 24 hours may incur a small fee which goes towards supporting our emergency slot programme.</div>
        </details>
      </div>
    </div>
  </div>
</section>

</main>

<!-- ═══ FOOTER ═══ -->
<footer class="v2-footer">
  <div class="v2-footer-top">
    <div class="v2-footer-brand">
      <div class="v2-footer-logo">
        <span class="v2-footer-logo-text">LOGO_PLACEHOLDER</span>
      </div>
      <p class="v2-footer-desc">Premium private healthcare delivered with clinical excellence and genuine compassion since 2004.</p>
      <div class="v2-footer-socials">
        <a class="v2-footer-social-link" href="#"><span class="material-symbols-outlined">public</span></a>
        <a class="v2-footer-social-link" href="#"><span class="material-symbols-outlined">chat_bubble</span></a>
        <a class="v2-footer-social-link" href="#"><span class="material-symbols-outlined">video_camera_front</span></a>
      </div>
    </div>
    <div class="v2-footer-col">
      <h4>Services</h4>
      <nav class="v2-footer-links">
        <a href="#">Cardiology</a>
        <a href="#">Neurology</a>
        <a href="#">Orthopaedics</a>
        <a href="#">Paediatrics</a>
        <a href="#">General Medicine</a>
      </nav>
    </div>
    <div class="v2-footer-col">
      <h4>Company</h4>
      <nav class="v2-footer-links">
        <a href="#">About Us</a>
        <a href="#">Our Doctors</a>
        <a href="#">Patient Stories</a>
        <a href="#">Careers</a>
        <a href="#">Press</a>
      </nav>
    </div>
    <div class="v2-footer-col">
      <h4>Contact</h4>
      <ul class="v2-footer-contact">
        <li><span class="material-symbols-outlined">location_on</span><span>14 Harley Street, London W1G 9PH</span></li>
        <li><span class="material-symbols-outlined">phone</span><span>PHONE_PLACEHOLDER</span></li>
        <li><span class="material-symbols-outlined">mail</span><span>care@vitacare.co.uk</span></li>
        <li><span class="material-symbols-outlined">schedule</span><span>Mon–Sat: 8am – 8pm</span></li>
      </ul>
    </div>
  </div>
  <div class="v2-footer-bottom">
    <p>© 2026 PROJECT_NAME_PLACEHOLDER. All rights reserved.</p>
    <p style="font-size:13px;color:rgba(255,255,255,0.35)">Privacy Policy · Terms of Service · Accessibility</p>
  </div>
</footer>
`;
