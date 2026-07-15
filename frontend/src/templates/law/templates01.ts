export const law01Styles = `
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Inter:wght@400;500;600&display=swap');

:root {
  --primary: PRIMARY_COLOR_PLACEHOLDER;
  --secondary: SECONDARY_COLOR_PLACEHOLDER;
  --primary-rgb: PRIMARY_RGB_PLACEHOLDER;
  --secondary-rgb: SECONDARY_RGB_PLACEHOLDER;
  --bg-light: #fdfdfd;
  --text-dark: #1f1f1f;
  --text-muted: #64748b;
  --border-light: #f1f5f9;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

body { 
  font-family: 'Inter', sans-serif; 
  color: var(--text-dark); 
  background-color: var(--bg-light); 
  line-height: 1.6; 
  overflow-x: hidden;
}

h1, h2, h3, h4, h5, h6 { 
  font-family: 'DM Serif Display', serif; 
  font-weight: 400; 
  line-height: 1.2; 
  color: var(--text-dark);
}

.container { max-width: 1200px; margin: 0 auto; padding: 0 1.5rem; position: relative; z-index: 10; }
img { max-width: 100%; display: block; }
a { text-decoration: none; color: inherit; transition: 0.3s; }

/* Buttons */
.btn { 
  display: inline-flex; flex-wrap: wrap; 
  align-items: center; 
  justify-content: center; 
  padding: 0.875rem 1.75rem; 
  border-radius: 4px; 
  font-weight: 500; 
  font-size: 0.95rem; 
  transition: all 0.3s ease; 
  cursor: pointer; 
  border: none; 
}
.btn-primary { 
  background-color: var(--btn-bg, var(--primary)); 
  color: var(--btn-text, #fff); 
  box-shadow: 0 4px 14px rgba(0,0,0,0.1);
}
.btn-primary:hover { background-color: var(--secondary) !important; color: var(--btn-text, #fff) !important; opacity: 0.9; transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.15); }

.btn-outline {
  background-color: transparent;
  color: var(--text-dark);
  border: 1px solid transparent;
  padding: 0.875rem 1rem;
}
.btn-outline:hover { color: var(--primary); }

/* Badge */
.badge {
  display: inline-flex; flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  background-color: rgba(255, 255, 255, 1);
  color: var(--primary);
  padding: 0.4rem 1rem;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 1rem;
}
.badge svg { width: 14px; height: 14px; }

/* Header */
.header { padding: 1.25rem 0; background: #fff; position: relative; z-index: 50; }
.header-inner { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; }
.logo { font-size: 1.5rem; font-family: 'DM Serif Display', serif; display: flex; flex-wrap: wrap; align-items: center; gap: 10px; color: var(--text-dark); }
.logo svg { width: 28px; height: 28px; color: var(--primary); }

/* Hero */
.hero { padding: 5rem 0 6rem; background: #111; position: relative; overflow: hidden; }
.hero::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background-image: url('/assets/templates/LawFirm/templates01/image1.jpg');
  background-size: cover;
  background-position: center;
  animation: heroBgZoom 20s infinite alternate linear;
  z-index: 1;
}
.hero::after {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(10, 15, 30, 0.85); /* low opacity dark color overlay */
  z-index: 2;
}
@keyframes heroBgZoom {
  0% { transform: scale(1); }
  100% { transform: scale(1.15); }
}
.hero-inner { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; position: relative; z-index: 5; }
.hero-content h1 { font-size: 3.8rem; margin-bottom: 1.5rem; color: #fff; }
.hero-content p { font-size: 1.1rem; color: rgba(255, 255, 255, 0.8); margin-bottom: 2.5rem; max-width: 90%; }
.hero-actions { display: flex; flex-wrap: wrap; gap: 1rem; align-items: center; margin-bottom: 3rem; }
.play-icon { width: 40px; height: 40px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 50%; display: flex; flex-wrap: wrap; justify-content: center; align-items: center; color: #fff; margin-right: 8px; backdrop-filter: blur(5px); }

.hero-rating { display: flex; flex-wrap: wrap; align-items: center; gap: 1rem; }
.avatar-group { display: flex; flex-wrap: wrap; }
.avatar-group img { width: 40px; height: 40px; border-radius: 50%; border: 2px solid var(--primary); margin-left: -12px; object-fit: cover; }
.avatar-group img:first-child { margin-left: 0; }
.stars { color: #f59e0b; display: flex; flex-wrap: wrap; gap: 2px; font-size: 1.2rem; }
.rating-text { font-size: 0.85rem; color: rgba(255, 255, 255, 0.7); font-weight: 500; }

.hero-visual { position: relative; z-index: 5; }
.hero-img-wrap { border-radius: 24px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.1); }
.hero-img-wrap img { width: 100%; height: 500px; object-fit: cover; }
.hero-floating-card { position: absolute; top: -30px; left: -40px; background: #fff; padding: 1.25rem; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.08); max-width: 240px; display: flex; flex-wrap: wrap; gap: 12px; align-items: flex-start; z-index: 3; }
.hero-floating-card .icon { background: rgba(0,0,0,0.05); color: var(--primary); padding: 10px; border-radius: 8px; }
.hero-floating-card p { font-size: 0.85rem; font-weight: 500; line-height: 1.4; color: #333; margin: 0; }

/* Stats Bar Redesigned */
.stats-section { padding: 6rem 0; background: #fafafa; position: relative; z-index: 10; border-top: 1px solid var(--border-light); border-bottom: 1px solid var(--border-light);}
.stats-header-wrap { text-align: center; margin-bottom: 4rem; max-width: 700px; margin-left: auto; margin-right: auto; }
.stats-header-wrap h2 { font-size: 3rem; margin-bottom: 1rem; color: var(--text-dark); }
.stats-header-wrap p { color: var(--text-muted); font-size: 1.1rem; }
.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2rem; }
.stat-item { background: #fff; padding: 2.5rem 1.5rem; border-radius: 16px; box-shadow: 0 10px 40px rgba(0,0,0,0.03); border: 1px solid var(--border-light); text-align: center; transition: 0.3s; position: relative; overflow: hidden; }
.stat-item:hover { transform: translateY(-10px); box-shadow: 0 20px 50px rgba(0,0,0,0.08); border-color: var(--primary); }
.stat-icon { width: 60px; height: 60px; background: rgba(0,0,0,0.03); color: var(--primary); border-radius: 50%; display: inline-flex; flex-wrap: wrap; align-items: center; justify-content: center; margin-bottom: 1.5rem; transition: 0.3s; }
.stat-icon svg { width: 28px; height: 28px; }
.stat-item:hover .stat-icon { background: var(--primary); color: #fff; transform: scale(1.1); }
.stat-item h3 { font-size: 2.2rem; color: var(--text-dark); margin-bottom: 0.5rem; font-family: 'Inter', sans-serif; font-weight: 700; letter-spacing: -0.5px; }
.stat-item p { font-size: 0.85rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; font-weight: 600; margin: 0; }

/* Split Section */
.split-section { padding: 6rem 0; background: #fff; position: relative; overflow: hidden; }
.split-inner { display: grid; grid-template-columns: 1fr 1fr; gap: 5rem; align-items: center; }
.split-visual { position: relative; display: flex; align-items: stretch; gap: 1.5rem; height: 500px; z-index: 2;}
.split-visual img { object-fit: cover; border-radius: 12px; }
.split-img-1 { width: 45%; height: 80%; align-self: flex-end; }
.split-img-2 { width: calc(55% - 1.5rem); height: 100%; }

.split-content h2 { font-size: 2.8rem; margin-bottom: 1.5rem; }
.split-content p { color: var(--text-muted); margin-bottom: 1.5rem; font-size: 1.05rem; }
.quote-box { border-left: 4px solid var(--primary); background: #f8fafc; padding: 1.5rem; margin: 2rem 0; border-radius: 0 8px 8px 0; }
.quote-box p { color: #333; font-weight: 500; font-size: 1rem; margin: 0; }

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

/* Steps Section */
.steps-section { padding: 8rem 0; background: #fff; position: relative; overflow: hidden; }
.steps-header { text-align: center; margin-bottom: 5rem; }
.steps-wrapper { max-width: 1000px; margin: 0 auto; display: flex; flex-wrap: wrap; flex-direction: column; gap: 6rem; z-index: 2; position: relative; }

/* Animated Dashed SVG Path */
.steps-path-wrap { position: absolute; top: 0; left: 50%; width: 200px; height: 100%; transform: translateX(-50%); z-index: -1; display: none; }
@media (min-width: 993px) { .steps-path-wrap { display: block; } }
.path-anim { stroke-dasharray: 12 12; animation: dash-flow 25s linear infinite; stroke: var(--primary); stroke-width: 2; fill: none; opacity: 0.4; }
@keyframes dash-flow { to { stroke-dashoffset: 1000; } }

.step-row { display: grid; grid-template-columns: 1fr 1fr; gap: 5rem; align-items: center; }
.step-img { border-radius: 16px; overflow: hidden; height: 380px; box-shadow: 0 20px 50px rgba(0,0,0,0.08); position: relative; }
.step-img img { width: 100%; height: 100%; object-fit: cover; transition: 0.5s; }
.step-img:hover img { transform: scale(1.05); }
.step-number { font-size: 2.2rem; font-family: 'Inter', sans-serif; font-weight: 700; color: var(--primary); line-height: 1; margin-bottom: 1rem; }
.step-content h3 { font-size: 2.2rem; margin-bottom: 1rem; }
.step-content p { color: var(--text-muted); font-size: 1.05rem; }

/* Team / Testimonial */
.team-section { padding: 6rem 0; background: rgba(var(--secondary-rgb), 0.04); overflow: hidden; position: relative; border-top: 1px solid var(--border-light); }
.team-inner { display: grid; grid-template-columns: 1fr 1fr; gap: 5rem; align-items: center; z-index: 2; position: relative; }
.team-visual { position: relative; width: 100%; aspect-ratio: 1; display: flex; flex-wrap: wrap; justify-content: center; align-items: center; }

/* Improved Circle Animations */
.circle-dashed { position: absolute; width: 80%; height: 80%; border: 2px dashed var(--primary); border-radius: 50%; animation: spin-slow 25s linear infinite; opacity: 0.5; }
.circle-dashed-2 { position: absolute; width: 100%; height: 100%; border: 1px dashed var(--secondary); border-radius: 50%; animation: spin-slow 35s linear infinite reverse; opacity: 0.4; }
.circle-dashed-3 { position: absolute; width: 65%; height: 65%; border: 1px solid rgba(0,0,0,0.05); border-radius: 50%; animation: spin-slow 15s linear infinite; }
@keyframes spin-slow { 100% { transform: rotate(360deg); } }

.center-avatar { width: 180px; height: 180px; border-radius: 50%; border: 10px solid #fff; box-shadow: 0 20px 40px rgba(0,0,0,0.1); position: relative; z-index: 10; object-fit: cover; }
.orbit-avatar { position: absolute; width: 60px; height: 60px; border-radius: 50%; border: 3px solid #fff; box-shadow: 0 10px 20px rgba(0,0,0,0.1); object-fit: cover; }
.orbit-1 { top: 10%; left: 50%; transform: translateX(-50%); }
.orbit-2 { bottom: 10%; left: 50%; transform: translateX(-50%); }
.orbit-3 { top: 50%; left: 10%; transform: translateY(-50%); }
.orbit-4 { top: 50%; right: 10%; transform: translateY(-50%); }
.orbit-5 { top: 20%; left: 20%; }
.orbit-6 { bottom: 20%; right: 20%; }

.team-content h2 { font-size: 2.5rem; margin-bottom: 2rem; line-height: 1.3; }
.attorney-card { background: #fff; padding: 2rem; border-radius: 12px; display: flex; flex-wrap: wrap; gap: 1.5rem; align-items: center; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
.attorney-card img { width: 100px; height: 100px; border-radius: 8px; object-fit: cover; }
.attorney-info p { font-style: italic; color: #555; margin-bottom: 1rem; font-size: 0.95rem; }

/* Contact Section */
.contact-section { padding: 6rem 0; background: #fff; position: relative; overflow: hidden; }
.contact-inner { display: grid; grid-template-columns: 1fr 1.5fr; gap: 4rem; z-index: 2; position: relative; }
.contact-info h2 { font-size: 2.5rem; margin-bottom: 2rem; }
.info-item { display: flex; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem; align-items: flex-start; }
.info-icon { width: 40px; height: 40px; border-radius: 50%; background: #f4f6fc; color: var(--primary); display: flex; flex-wrap: wrap; justify-content: center; align-items: center; flex-shrink: 0; }
.info-text h4 { font-family: 'Inter', sans-serif; font-size: 1rem; font-weight: 600; margin-bottom: 0.25rem; }
.info-text p { color: var(--text-muted); font-size: 0.9rem; }

.contact-form { background: var(--form-bg, #fff); padding: 3rem; border-radius: 16px; box-shadow: 0 20px 50px rgba(0,0,0,0.06); border: 1px solid var(--border-light); }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem; }
.input-group { display: flex; flex-wrap: wrap; flex-direction: column; gap: 0.5rem; }
.input-group label { font-size: 0.85rem; font-weight: 500; color: #333; }
.input-group input, .input-group textarea { padding: 0.875rem 1rem; border: 1px solid #e2e8f0; border-radius: 6px; font-family: 'Inter', sans-serif; font-size: 0.95rem; outline: none; transition: 0.3s; }
.input-group input:focus, .input-group textarea:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(0,0,0,0.05); }
.input-group textarea { resize: vertical; min-height: 120px; }
.form-full { grid-column: 1 / -1; }

/* Footer */
.footer-cta { background: var(--primary); padding: 4rem 0; color: #fff; text-align: center; }
.footer-cta h2 { color: #fff; font-size: 2.5rem; margin-bottom: 2rem; max-width: 600px; margin-left: auto; margin-right: auto; }
.btn-white { background: #fff; color: var(--primary); }
.btn-white:hover { background: #f8fafc; }

.footer-bottom { padding: 1.5rem 0; background: #fff; border-top: 1px solid #eaeaea; }
.footer-bottom-inner { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; font-size: 0.85rem; color: var(--text-muted); }
.footer-links { display: flex; flex-wrap: wrap; gap: 1.5rem; }
.footer-links a:hover { color: var(--primary); }

/* ---- Animations & Shapes ---- */
.shape-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  z-index: 0;
  opacity: 0.15;
  animation: float-blob 12s infinite ease-in-out;
}
@keyframes float-blob {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(40px, -60px) scale(1.1); }
  66% { transform: translate(-30px, 30px) scale(0.9); }
}
.blob-1 { width: 400px; height: 400px; background: var(--primary); top: -100px; right: -100px; }
.blob-2 { width: 300px; height: 300px; background: var(--secondary); bottom: -100px; left: -100px; }
.blob-3 { width: 350px; height: 350px; background: var(--primary); top: 30%; right: -150px; animation-delay: -3s;}
.blob-4 { width: 250px; height: 250px; background: var(--secondary); bottom: 10%; left: -50px; animation-delay: -6s;}

/* ---- Decorative Shapes ---- */
.dec-shape { position: absolute; z-index: 1; pointer-events: none; }
.dec-dots { 
  width: 150px; height: 150px; 
  background-image: radial-gradient(var(--primary) 2px, transparent 2px); 
  background-size: 20px 20px; 
  opacity: 0.15;
}
.dec-circle {
  border-radius: 50%;
  border: 1px solid var(--primary);
  opacity: 0.2;
}
.dec-cross {
  position: relative;
  width: 24px; height: 24px;
  opacity: 0.3;
}
.dec-cross::before, .dec-cross::after {
  content: ''; position: absolute; background: var(--primary);
}
.dec-cross::before { top: 50%; left: 0; width: 100%; height: 2px; transform: translateY(-50%); }
.dec-cross::after { top: 0; left: 50%; width: 2px; height: 100%; transform: translateX(-50%); }

.hero-dots { top: 15%; right: 45%; }
.hero-circle-1 { width: 500px; height: 500px; top: -150px; right: -150px; border-width: 1px; border-style: dashed; }
.hero-circle-2 { width: 300px; height: 300px; bottom: 10%; left: -100px; }
.hero-cross-1 { top: 25%; left: 8%; animation: spin-slow 15s linear infinite; }
.hero-cross-2 { bottom: 30%; right: 50%; animation: spin-slow 20s linear infinite reverse; }

.split-dots { bottom: -40px; left: -40px; z-index: 0; }
.split-circle { width: 200px; height: 200px; top: 5%; right: 10%; opacity: 0.1; }

.tabs-dots { top: 20px; right: 20px; }
.contact-circle { width: 400px; height: 400px; bottom: -100px; right: -100px; border-color: rgba(0,0,0,0.05); }

.steps-dec-1 { top: 5%; right: 5%; transform: scale(0.5); opacity: 0.6; }
.steps-dec-2 { bottom: 10%; left: 5%; opacity: 0.5; }

/* Scroll Animations - Only active when JS runs */
body.js-enabled .animate-up {
  opacity: 0;
  transform: translateY(40px);
  transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}
body.js-enabled .animate-up.in-view {
  opacity: 1;
  transform: translateY(0);
}
body.js-enabled .animate-fade {
  opacity: 0;
  transition: opacity 1s ease-out;
}
body.js-enabled .animate-fade.in-view {
  opacity: 1;
}

@media (max-width: 992px) {
  .hero-inner, .split-inner, .tabs-container, .team-inner, .contact-inner { grid-template-columns: 1fr; gap: 3rem; }
  .stats-grid { grid-template-columns: 1fr 1fr; }
  .hero-content h1 { font-size: 3rem; }
  .split-visual { height: 400px; }
  .step-row { grid-template-columns: 1fr; gap: 2rem; }
  .steps-path-wrap { display: none; }
}
@media (max-width: 768px) {
  .hero-content h1 { font-size: 2.2rem; line-height: 1.2; }
  h2 { font-size: 2rem; }
  h3 { font-size: 1.5rem; }
  .hero-actions { flex-direction: column; align-items: stretch; }
  .hero-actions .btn-primary, .hero-actions .btn-outline { width: 100%; justify-content: center; }
  .hero-img-wrap img { height: 350px; }
  .hero-floating-card { left: 50%; transform: translateX(-50%); top: -20px; width: 85%; }
  .form-grid { grid-template-columns: 1fr; }
  .footer-bottom-inner { flex-direction: column; gap: 1rem; text-align: center; }
  .stats-grid { grid-template-columns: 1fr; gap: 1.5rem; }
  .stat-item { padding: 1.5rem; }
}


  /* Extracted Template Inline Styles */
  .tpl-templates01-1 { color: var(--text-muted); }
  .tpl-templates01-2 { border: 2px dashed #22c55e; border-radius: 8px; background: rgba(34,197,94,0.1); color: #166534; }
`;

export const law01Html = `
<header class="header">
  <div class="container header-inner">
    <a href="#" class="logo">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
      PROJECT_NAME_PLACEHOLDER
    </a>
    <a href="#contact" class="btn btn-primary">Request A Call</a>
  </div>
</header>

<section class="hero">
  <div class="shape-blob blob-1"></div>
  <div class="shape-blob blob-2"></div>
  
  <!-- Decorative Shapes -->
  <div class="dec-shape dec-circle hero-circle-1"></div>
  <div class="dec-shape dec-circle hero-circle-2"></div>
  <div class="dec-shape dec-dots hero-dots"></div>
  <div class="dec-shape dec-cross hero-cross-1"></div>
  <div class="dec-shape dec-cross hero-cross-2"></div>

  <div class="container hero-inner">
    <div class="hero-content animate-up">
      <div class="badge">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
        Trusted Law Firm
      </div>
      <h1>Expert Legal Representation You Need It Most</h1>
      <p>Providing relentless advocacy and strategic counsel for clients navigating complex legal challenges.</p>
      
      <div class="hero-actions">
        <a href="#contact" class="btn btn-primary">Get Started</a>
        <a href="#about" class="btn btn-outline">
          <span class="play-icon"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg></span>
          Our Story
        </a>
      </div>
      
      <div class="hero-rating">
        <div class="avatar-group">
          <img src="/assets/templates/LawFirm/templates01/image2.jpg" alt="Client">
          <img src="/assets/templates/LawFirm/templates01/image3.jpg" alt="Client">
          <img src="/assets/templates/LawFirm/templates01/image4.jpg" alt="Client">
        </div>
        <div>
          <div class="stars">★★★★★</div>
          <div class="rating-text">4.9/5 from 500+ Reviews</div>
        </div>
      </div>
    </div>
    
    <div class="hero-visual animate-up" style="transition-delay: 0.2s;">
      <div class="hero-img-wrap">
        <img src="/assets/templates/LawFirm/templates01/image5.jpg" alt="Lawyer discussing with clients">
      </div>
      <div class="hero-floating-card">
        <div class="icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
        </div>
        <p>Providing legal guidance through your toughest times</p>
      </div>
    </div>
  </div>
</section>

<section class="stats-section">
  <div class="container animate-up">
    <div class="stats-header-wrap">
      <h2>Why Justice Is The Best</h2>
      <p>We are consistently recognized for our excellence and dedication to securing the best possible outcomes.</p>
    </div>
    <div class="stats-grid">
      <div class="stat-item">
        <div class="stat-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
        </div>
        <h3>150+</h3>
        <p>Cases Won</p>
      </div>
      <div class="stat-item">
        <div class="stat-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
        </div>
        <h3>$27M</h3>
        <p>Recovered</p>
      </div>
      <div class="stat-item">
        <div class="stat-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>
        </div>
        <h3>12</h3>
        <p>Awards</p>
      </div>
      <div class="stat-item">
        <div class="stat-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
        </div>
        <h3>437+</h3>
        <p>Happy Clients</p>
      </div>
    </div>
  </div>
</section>

<section class="split-section" id="about">
  <div class="shape-blob blob-3"></div>
  <div class="dec-shape dec-circle split-circle"></div>
  
  <div class="container split-inner">
    <div class="split-visual animate-up">
      <div class="dec-shape dec-dots split-dots"></div>
      <img src="/assets/templates/LawFirm/templates01/image6.jpg" alt="Lawyer" class="split-img-1">
      <img src="/assets/templates/LawFirm/templates01/image7.jpg" alt="Consultation" class="split-img-2">
    </div>
    <div class="split-content animate-up" style="transition-delay: 0.2s;">
      <div class="badge">About Us</div>
      <h2>Navigating Legal Matters With Compassion And Expertise</h2>
      <p>Our dedicated team of legal professionals is committed to protecting your rights and securing the best possible outcome for your unique situation.</p>
      
      <div class="quote-box">
        <p>"Legal proceedings can be emotionally draining. We shoulder the legal burden so you can focus on moving forward."</p>
      </div>
      
      <a href="#contact" class="btn btn-primary">Contact Us</a>
    </div>
  </div>
</section>

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
          <p>Welcome to purplle.com - E-commerce. We provide the best Beauty & Wellness solutions tailored to your specific needs. Partner with us for unparalleled success in your industry.</p>
          <img src="/assets/templates/LawFirm/templates01/image8.jpg" alt="Legal Solutions">
          <a href="#contact" class="link-primary">Learn More <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></a>
        </div>
        
        <div class="tab-content-box" id="panel-2">
          <h3>Corporate Law Mastery</h3>
          <p>Welcome to purplle.com - E-commerce. We provide the best Beauty & Wellness solutions tailored to your specific needs. Partner with us for unparalleled success in your industry.</p>
          <img src="/assets/templates/LawFirm/templates01/image9.jpg" alt="Corporate Law">
          <a href="#contact" class="link-primary">Learn More <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></a>
        </div>

        <div class="tab-content-box" id="panel-3">
          <h3>Family Law & Divorce</h3>
          <p>Welcome to purplle.com - E-commerce. We provide the best Beauty & Wellness solutions tailored to your specific needs. Partner with us for unparalleled success in your industry.</p>
          <img src="/assets/templates/LawFirm/templates01/image10.jpg" alt="Family Law">
          <a href="#contact" class="link-primary">Learn More <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></a>
        </div>

        <div class="tab-content-box" id="panel-4">
          <h3>Real Estate Legalities</h3>
          <p>Welcome to purplle.com - E-commerce. We provide the best Beauty & Wellness solutions tailored to your specific needs. Partner with us for unparalleled success in your industry.</p>
          <img src="/assets/templates/LawFirm/templates01/image11.jpg" alt="Real Estate">
          <a href="#contact" class="link-primary">Learn More <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></a>
        </div>

        <div class="tab-content-box" id="panel-5">
          <h3>Criminal Defense</h3>
          <p>Welcome to purplle.com - E-commerce. We provide the best Beauty & Wellness solutions tailored to your specific needs. Partner with us for unparalleled success in your industry.</p>
          <img src="/assets/templates/LawFirm/templates01/image12.jpg" alt="Criminal Defense">
          <a href="#contact" class="link-primary">Learn More <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></a>
        </div>
      </div>
    </div>
    
    <div class="tabs-action animate-up">
      <a href="#contact" class="btn btn-primary">View All Services</a>
    </div>
  </div>
</section>

<section class="steps-section">
  <div class="dec-shape dec-cross steps-dec-1"></div>
  <div class="dec-shape dec-dots steps-dec-2"></div>
  <div class="container">
    <div class="steps-header animate-up">
      <div class="badge">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
        Our Process
      </div>
      <h2 style="margin-bottom: 1rem; margin-top: 1rem;">A Clear Path to Legal Resolution</h2>
      <p style="color: var(--text-muted); max-width: 700px; margin: 0 auto;">We guide you through every stage of the legal process with absolute clarity, ensuring you are always informed, prepared, and confident in your case.</p>
    </div>
    
    <div class="steps-wrapper">
      <!-- Animated Dashed Line from Screenshot -->
      <div class="steps-path-wrap">
        <svg viewBox="0 0 200 800" preserveAspectRatio="none" style="width: 100%; height: 100%;">
          <path class="path-anim" d="M100,50 C150,150 180,200 100,280 C20,350 -10,250 50,220 C100,200 180,250 100,400 C0,550 -30,650 100,700 C180,750 150,850 100,900" />
        </svg>
      </div>

      <!-- AI INSTRUCTION: You MUST keep exactly 3 .step-row elements. DO NOT delete the .step-content or .step-img divs inside them. Only rewrite the text! -->

      <div class="step-row animate-up">
        <div class="step-content">
          <div class="step-number">01</div>
          <h3>Initial Consultation</h3>
          <p>Welcome to purplle.com - E-commerce. We provide the best Beauty & Wellness solutions tailored to your specific needs. Partner with us for unparalleled success in your industry.</p>
        </div>
        <div class="step-img">
          <img src="/assets/templates/LawFirm/templates01/image13.jpg" alt="Office">
        </div>
      </div>
      
      <div class="step-row animate-up">
        <div class="step-content">
          <div class="step-number">02</div>
          <h3>Finalizing the Divorce</h3>
          <p>Welcome to purplle.com - E-commerce. We provide the best Beauty & Wellness solutions tailored to your specific needs. Partner with us for unparalleled success in your industry.</p>
        </div>
        <div class="step-img">
          <img src="/assets/templates/LawFirm/templates01/image14.jpg" alt="Strategy Team">
        </div>
      </div>
      
      <div class="step-row animate-up">
        <div class="step-content">
          <div class="step-number">03</div>
          <h3>Post-Divorce Support</h3>
          <p>Welcome to purplle.com - E-commerce. We provide the best Beauty & Wellness solutions tailored to your specific needs. Partner with us for unparalleled success in your industry.</p>
        </div>
        <div class="step-img">
          <img src="/assets/templates/LawFirm/templates01/image15.jpg" alt="Book">
        </div>
      </div>
    </div>
  </div>
</section>

<section class="team-section">
  <div class="shape-blob blob-1"></div>
  <div class="container team-inner">
    <div class="team-visual animate-up">
      <div class="circle-dashed"></div>
      <div class="circle-dashed-2"></div>
      <div class="circle-dashed-3"></div>
      <img src="/assets/templates/LawFirm/templates01/image16.jpg" alt="Lead Attorney" class="center-avatar">
      <img src="/assets/templates/LawFirm/templates01/image17.jpg" class="orbit-avatar orbit-1" alt="Team">
      <img src="/assets/templates/LawFirm/templates01/image18.jpg" class="orbit-avatar orbit-2" alt="Team">
      <img src="/assets/templates/LawFirm/templates01/image19.jpg" class="orbit-avatar orbit-3" alt="Team">
      <img src="/assets/templates/LawFirm/templates01/image20.jpg" class="orbit-avatar orbit-4" alt="Team">
      <img src="/assets/templates/LawFirm/templates01/image21.jpg" class="orbit-avatar orbit-5" alt="Team">
      <img src="/assets/templates/LawFirm/templates01/image22.jpg" class="orbit-avatar orbit-6" alt="Team">
    </div>
    
    <div class="team-content animate-up" style="transition-delay: 0.2s;">
      <div class="badge">Our Attorney</div>
      <h2>Expertise Supported By A Powerful Network</h2>
      
      <div class="attorney-card">
        <img src="/assets/templates/LawFirm/templates01/image23.jpg" alt="Attorney">
        <div class="attorney-info">
          <p>"As a lawyer, I work closely with you. I provide comprehensive legal representation tailored to your needs, backed by a team of specialists."</p>
          <div class="stars">★★★★★</div>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="contact-section" id="contact">
  <div class="shape-blob blob-2"></div>
  <div class="dec-shape dec-circle contact-circle"></div>
  
  <div class="container contact-inner">
    <div class="contact-info animate-up">
      <h2>Come & Be A Part Of Our Firm Family, Take Your Time</h2>
      <p class="tpl-templates01-1" style="margin-bottom: 2rem">We are here to help. Reach out to schedule a consultation with our experts.</p>
      
      <div class="info-item">
        <div class="info-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
        </div>
        <div class="info-text">
          <h4>Our Location</h4>
          <p>ADDRESS_PLACEHOLDER</p>
        </div>
      </div>
      
      <div class="info-item">
        <div class="info-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
        </div>
        <div class="info-text">
          <h4>Phone Number</h4>
          <p>PHONE_PLACEHOLDER</p>
        </div>
      </div>
      
      <div class="info-item">
        <div class="info-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
        </div>
        <div class="info-text">
          <h4>Email Address</h4>
          <p>EMAIL_PLACEHOLDER</p>
        </div>
      </div>
    </div>
    
    <div class="contact-form-wrap animate-up" style="transition-delay: 0.2s;">
      <form class="contact-form lead-capture-form">
        <div class="form-grid">
          <div class="input-group">
            <label>First Name</label>
            <input type="text" name="firstName" placeholder="John" required>
          </div>
          <div class="input-group">
            <label>Last Name</label>
            <input type="text" name="lastName" placeholder="Doe" required>
          </div>
          <div class="input-group">
            <label>Email Address</label>
            <input type="email" name="email" placeholder="john@example.com" required>
          </div>
          <div class="input-group">
            <label>Phone Number</label>
            <input type="tel" name="phone" placeholder="(555) 123-4567" required>
          </div>
          <div class="input-group form-full">
            <label>Case Details</label>
            <textarea name="notes" placeholder="Tell us briefly about your situation..." required></textarea>
          </div>
        </div>
        <button type="submit" class="btn btn-primary">Send Message</button>
      </form>
    </div>
  </div>
</section>

<footer class="footer">
  <div class="footer-cta">
    <div class="container animate-up">
      <h2>Schedule A Free Consultation With Our Experienced Legal Team.</h2>
      <a href="#contact" class="btn btn-white">Request A Call</a>
    </div>
  </div>
  
  <div class="footer-bottom">
    <div class="container footer-bottom-inner">
      <div class="copyright">© 2026 PROJECT_NAME_PLACEHOLDER. All Rights Reserved.</div>
      <div class="footer-links">
        <a href="#">Privacy Policy</a>
        <a href="#">Terms of Service</a>
        <a href="#">Disclaimer</a>
      </div>
    </div>
  </div>
</footer>

<script id="core-interactions">
  (function() {
    // Check if we are inside GrapesJS editor
    var isInEditor = !!document.querySelector('[data-gjs-type]') || document.body.classList.contains('gjs-dashed');
    
    // Tab Switching Logic
    if (!isInEditor) {
      document.body.classList.add('js-enabled');
      var tabItems = document.querySelectorAll('.tab-item');
      var tabContents = document.querySelectorAll('.tab-content-box');
      
      tabItems.forEach(function(item, index) {
        item.addEventListener('click', function() {
          // Remove active from all tabs and contents
          tabItems.forEach(function(t) { t.classList.remove('active'); });
          tabContents.forEach(function(c) { c.classList.remove('active'); });
          
          // Add active to clicked tab and corresponding content
          item.classList.add('active');
          if (tabContents[index]) {
            tabContents[index].classList.add('active');
          }
        });
      });
    }

    // Form Validation
    document.addEventListener('submit', function(e) {
      if (e.target.tagName === 'FORM') {
        e.preventDefault();
        if (isInEditor) {
          e.stopImmediatePropagation();
          var existingModal = document.getElementById("preview-mode-modal");
          if (existingModal) existingModal.remove();
          var modalHtml = '<div id="preview-mode-modal" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 999999; display: flex; align-items: center; justify-content: center; background: rgba(15, 23, 42, 0.7); backdrop-filter: blur(8px); opacity: 0; animation: pModalFadeIn 0.3s forwards; font-family: system-ui, -apple-system, sans-serif;"><div style="background: #ffffff; width: 90%; max-width: 400px; border-radius: 20px; padding: 32px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); text-align: center; transform: scale(0.95); animation: pModalScaleUp 0.3s forwards;"><div style="width: 60px; height: 60px; background: #FEF2F2; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;"><svg style="width: 30px; height: 30px; color: #EF4444;" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg></div><h3 style="font-size: 20px; font-weight: 700; color: #0F172A; margin: 0 0 12px; letter-spacing: -0.02em;">Preview Mode Active</h3><p style="font-size: 15px; color: #64748B; margin: 0 0 28px; line-height: 1.5;">Form submissions are disabled in preview mode. Publish your page to accept real submissions.</p><button onclick="document.getElementById(\'preview-mode-modal\').remove()" style="width: 100%; background: #0F172A; color: #ffffff; border: none; padding: 14px; border-radius: 12px; font-size: 15px; font-weight: 600; cursor: pointer; transition: background 0.2s;" onmouseover="this.style.background=\'#1E293B\'" onmouseout="this.style.background=\'#0F172A\'">Got it, close</button></div><style>@keyframes pModalFadeIn { to { opacity: 1; } } @keyframes pModalScaleUp { to { transform: scale(1); } }</style></div>';
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
        
        if (!isValid) {
          e.preventDefault();
          e.stopImmediatePropagation();
        } else {
          e.preventDefault();
          var btn = e.target.querySelector('button[type="submit"]') || e.target.querySelector('input[type="submit"]');
          if (btn) {
            if(btn.innerText) btn.innerText = 'Sending...';
            else btn.value = 'Sending...';
          }
          setTimeout(function() {
            e.target.innerHTML = '<div class="tpl-templates01-2" style="padding: 20px; text-align: center"><h3 style="margin: 0 0 10px 0; ">Thank You!</h3><p style="margin: 0;">Your request has been submitted successfully.</p></div>';
          }, 1000);
        }
      }
    }, true);
  })();
</script>

`;
