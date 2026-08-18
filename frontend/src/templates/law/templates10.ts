export const law10Styles = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,600;1,500&family=Inter:wght@400;500;600;700;800&display=swap');

:root {
  --primary: PRIMARY_COLOR_PLACEHOLDER;
  --secondary: SECONDARY_COLOR_PLACEHOLDER;
  --primary-rgb: PRIMARY_RGB_PLACEHOLDER;
  --secondary-rgb: SECONDARY_RGB_PLACEHOLDER;
  --ink: #14140f;
  --paper: #faf8f3;
  --paper-2: #f1ede3;
  --muted: #86816f;
  --line: #e6e0d1;
}

* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Inter', sans-serif; color: var(--ink); background: var(--paper); line-height: 1.65; overflow-x: hidden; }
h1, h2, h3, h4 { font-family: 'Fraunces', serif; font-weight: 600; line-height: 1.15; color: var(--ink); }
img { max-width: 100%; display: block; }
a { text-decoration: none; color: inherit; transition: 0.3s; }
.eyebrow { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: var(--primary); margin-bottom: 0.75rem; }

.btn { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.9rem 1.9rem; border-radius: 2px; font-weight: 600; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px; cursor: pointer; border: 1px solid transparent; }
.btn-solid { background: var(--ink); color: #fff; }
.btn-solid:hover { background: var(--primary); }
.btn-cream { background: var(--paper); color: var(--ink); }
.btn-cream:hover { background: var(--primary); color: #fff; }

/* Shell: fixed sidebar + scrolling main -- structurally unique */
.lf10-shell { display: flex; min-height: 100vh; }
.lf10-sidebar { width: 320px; flex-shrink: 0; background: var(--ink); color: #fff; position: fixed; top: 0; left: 0; bottom: 0; padding: 2.75rem 2.25rem; display: flex; flex-direction: column; justify-content: space-between; z-index: 40; overflow-y: auto; }
.lf10-main { margin-left: 320px; width: calc(100% - 320px); }

.lf10-mark { font-family: 'Fraunces', serif; font-size: 1.6rem; margin-bottom: 0.5rem; }
.lf10-mark small { display: block; font-family: 'Inter', sans-serif; font-size: 0.65rem; letter-spacing: 2px; text-transform: uppercase; color: rgba(255,255,255,0.4); font-weight: 600; margin-top: 0.4rem; }

.lf10-index { margin: 3rem 0; display: flex; flex-direction: column; gap: 0.1rem; }
.lf10-index a { display: flex; align-items: baseline; gap: 0.75rem; padding: 0.65rem 0; color: rgba(255,255,255,0.55); font-size: 0.88rem; border-bottom: 1px solid rgba(255,255,255,0.08); }
.lf10-index a:hover { color: #fff; }
.lf10-index a span.i { font-family: 'Inter', sans-serif; font-size: 0.7rem; color: var(--primary); font-weight: 700; }

.lf10-sidebar-contact { border-top: 1px solid rgba(255,255,255,0.1); padding-top: 1.75rem; }
.lf10-sidebar-contact p { color: rgba(255,255,255,0.5); font-size: 0.82rem; margin-bottom: 0.6rem; }
.lf10-sidebar-socials { display: flex; gap: 0.6rem; margin-top: 1.25rem; }
.lf10-sidebar-socials a { width: 32px; height: 32px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.2); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; }

/* Folder-tab section label used throughout main content */
.lf10-tab { display: inline-flex; align-items: center; gap: 0.6rem; background: var(--ink); color: #fff; padding: 0.5rem 1.25rem; font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; border-radius: 0 4px 4px 0; margin-bottom: 2rem; }
.lf10-tab span { color: var(--primary); }

/* Hero - diagonal split two-tone, small inset photo, floating stat badges */
.lf10-hero { position: relative; padding: 5rem 3.5rem 6rem; background: var(--paper-2); overflow: hidden; }
.lf10-hero::before { content: ''; position: absolute; top: 0; right: 0; width: 45%; height: 130%; background: var(--primary); transform: skewX(-10deg) translateX(15%); opacity: 0.94; z-index: 0; }
.lf10-hero-grid { position: relative; z-index: 2; display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 3rem; align-items: center; }
.lf10-hero-grid h1 { font-size: 3.2rem; margin-bottom: 1.5rem; max-width: 520px; }
.lf10-hero-grid p { color: var(--muted); max-width: 420px; margin-bottom: 2rem; font-size: 1rem; }
.lf10-hero-photo { position: relative; }
.lf10-hero-photo img { width: 260px; height: 340px; object-fit: cover; border-radius: 4px; box-shadow: 0 25px 50px rgba(0,0,0,0.25); margin-left: auto; }
.lf10-hero-badge { position: absolute; left: -1.5rem; bottom: -1.5rem; background: #fff; padding: 1.25rem 1.5rem; border-radius: 4px; box-shadow: 0 15px 40px rgba(0,0,0,0.15); }
.lf10-hero-badge h3 { font-family: 'Inter', sans-serif; font-weight: 800; font-size: 1.8rem; color: var(--primary); }
.lf10-hero-badge p { color: var(--muted); font-size: 0.72rem; text-transform: uppercase; letter-spacing: 1px; margin: 0; }
.lf10-hero-stats-row { position: relative; z-index: 2; display: flex; gap: 3rem; margin-top: 3.5rem; padding-top: 2rem; border-top: 1px solid rgba(0,0,0,0.08); }
.lf10-hero-stats-row div h4 { font-family: 'Inter', sans-serif; font-weight: 800; font-size: 1.6rem; }
.lf10-hero-stats-row div p { color: var(--muted); font-size: 0.72rem; text-transform: uppercase; letter-spacing: 1px; }

/* About - folder card offset */
.lf10-about { padding: 6rem 3.5rem; }
.lf10-about-card { background: #fff; border: 1px solid var(--line); border-radius: 6px; padding: 3.5rem; display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; }
.lf10-about-card h2 { font-size: 2.4rem; margin-bottom: 1.25rem; }
.lf10-about-card p { color: var(--muted); margin-bottom: 1.1rem; }
.lf10-about-figures { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; align-content: start; }
.lf10-about-figure { background: var(--paper-2); border-radius: 4px; padding: 1.5rem; }
.lf10-about-figure h4 { font-family: 'Inter', sans-serif; font-weight: 800; color: var(--primary); font-size: 1.6rem; }
.lf10-about-figure p { color: var(--muted); font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.5px; margin: 0; }

/* Services - radial/circular layout, unique */
.lf10-services { padding: 6rem 3.5rem; background: var(--paper-2); }
.lf10-services-head { max-width: 560px; margin-bottom: 3.5rem; }
.lf10-services-head h2 { font-size: 2.4rem; }
.lf10-radial { position: relative; width: 100%; max-width: 640px; aspect-ratio: 1; margin: 0 auto; display: flex; align-items: center; justify-content: center; }
.lf10-radial::before { content: ''; position: absolute; top: 14%; left: 14%; right: 14%; bottom: 14%; border: 2px dashed rgba(0,0,0,0.08); border-radius: 50%; z-index: 1; }
.lf10-radial-center { width: 180px; height: 180px; border-radius: 50%; background: var(--ink); color: #fff; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; z-index: 3; padding: 1rem; box-shadow: 0 20px 40px rgba(0,0,0,0.2); border: 8px solid var(--paper-2); position: relative; }
.lf10-radial-center::after { content: ''; position: absolute; top: -12px; left: -12px; right: -12px; bottom: -12px; border: 1px solid var(--line); border-radius: 50%; }
.lf10-radial-center div { font-family: 'Fraunces', serif; font-size: 2.6rem; color: var(--primary); line-height: 1; margin-bottom: 0.2rem; }
.lf10-radial-center p { color: rgba(255,255,255,0.6); font-size: 0.72rem; text-transform: uppercase; letter-spacing: 1.5px; }
.lf10-radial-node { position: absolute; width: 155px; background: #fff; border-radius: 8px; padding: 1.25rem 1rem; box-shadow: 0 10px 25px rgba(0,0,0,0.06); text-align: center; z-index: 4; border: 1px solid transparent; transition: all 0.3s ease; cursor: default; }
.lf10-radial-node:hover { border-color: var(--primary); box-shadow: 0 20px 45px rgba(0,0,0,0.12); margin-top: -6px; }
.lf10-radial-node h4 { font-size: 1.05rem; margin-bottom: 0.3rem; color: var(--ink); font-weight: 700; }
.lf10-radial-node p { color: var(--muted); font-size: 0.75rem; line-height: 1.4; margin: 0; }
.lf10-radial-node.n1 { top: -2%; left: 50%; transform: translateX(-50%); }
.lf10-radial-node.n2 { top: 22%; right: -4%; }
.lf10-radial-node.n3 { bottom: 8%; right: 10%; }
.lf10-radial-node.n4 { bottom: 8%; left: 10%; }
.lf10-radial-node.n5 { top: 22%; left: -4%; }

/* Horizontal drag-scroll strip of case studies -- unique interaction */
.lf10-cases { padding: 6rem 0 6rem 3.5rem; }
.lf10-cases-head { max-width: 560px; margin-bottom: 2.5rem; padding-right: 3.5rem; }
.lf10-cases-head h2 { font-size: 2.4rem; }
.lf10-scroll-strip { display: flex; gap: 1.5rem; overflow-x: auto; padding-bottom: 1.5rem; padding-right: 3.5rem; scroll-snap-type: x proximity; }
.lf10-scroll-strip::-webkit-scrollbar { height: 6px; }
.lf10-scroll-strip::-webkit-scrollbar-thumb { background: var(--primary); border-radius: 3px; }
.lf10-case-card { flex: 0 0 320px; scroll-snap-align: start; background: #fff; border: 1px solid var(--line); border-radius: 6px; overflow: hidden; }
.lf10-case-card img { height: 190px; object-fit: cover; }
.lf10-case-card-body { padding: 1.5rem; }
.lf10-case-card-body span.tag { color: var(--primary); font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
.lf10-case-card-body h4 { font-size: 1.25rem; margin-top: 0.5rem; }

/* Testimonial - large offset overlapping card */
.lf10-testimonial-wrap { padding: 2rem 3.5rem 8rem; position: relative; }
.lf10-testimonial-card { background: var(--ink); color: #fff; border-radius: 8px; padding: 3.5rem; max-width: 780px; margin-left: auto; position: relative; box-shadow: 0 30px 60px rgba(0,0,0,0.2); }
.lf10-testimonial-card .qmark { font-family: 'Fraunces', serif; font-style: italic; font-size: 3.5rem; color: var(--primary); margin-bottom: 0.5rem; }
.lf10-testimonial-card p.quote { font-size: 1.5rem; margin-bottom: 1.5rem; line-height: 1.4; }
.lf10-testimonial-card span { color: rgba(255,255,255,0.55); font-size: 0.82rem; text-transform: uppercase; letter-spacing: 1px; }

/* Team - horizontal scroll row */
.lf10-team { padding: 2rem 0 6rem 3.5rem; }
.lf10-team-head { max-width: 560px; margin-bottom: 2.5rem; padding-right: 3.5rem; }
.lf10-team-head h2 { font-size: 2.4rem; }
.lf10-team-strip { display: flex; gap: 1.5rem; overflow-x: auto; padding-bottom: 1rem; padding-right: 3.5rem; }
.lf10-team-card { flex: 0 0 220px; text-align: center; }
.lf10-team-card img { width: 100%; height: 260px; object-fit: cover; border-radius: 6px; filter: grayscale(25%); margin-bottom: 1rem; }
.lf10-team-card:hover img { filter: grayscale(0%); }
.lf10-team-card h4 { font-size: 1.2rem; }
.lf10-team-card p { color: var(--muted); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.5px; }

/* FAQ - simple accordion inline in main */
.lf10-faq { padding: 6rem 3.5rem; background: var(--paper-2); }
.lf10-faq-grid { display: grid; grid-template-columns: 0.7fr 1.3fr; gap: 3.5rem; }
.lf10-faq-grid h2 { font-size: 2.4rem; }
.lf10-faq-item { background: #fff; border-radius: 4px; margin-bottom: 1rem; }
.lf10-faq-item-head { display: flex; justify-content: space-between; align-items: center; gap: 1rem; font-weight: 700; font-size: 0.98rem; padding: 1.4rem 1.75rem; cursor: pointer; list-style: none; }
.lf10-faq-item-head::-webkit-details-marker { display: none; }
.lf10-faq-toggle { color: var(--primary); font-size: 1.2rem; transition: 0.3s; flex-shrink: 0; }
details.lf10-faq-item[open] .lf10-faq-toggle { transform: rotate(45deg); }
.lf10-faq-body { color: var(--muted); font-size: 0.9rem; padding: 0 1.75rem 1.4rem; }

/* Contact - intake-sheet style form, underline fields */
.lf10-contact { padding: 6rem 3.5rem; }
.lf10-contact-sheet { background: #fff; border: 1px solid var(--line); border-radius: 6px; padding: 3.5rem; max-width: 760px; margin: 0 auto; }
.lf10-contact-sheet h2 { font-size: 2.2rem; margin-bottom: 0.5rem; }
.lf10-contact-sheet > p { color: var(--muted); margin-bottom: 2.25rem; }
.lf10-sheet-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.75rem 2rem; margin-bottom: 1.75rem; }
.lf10-sheet-field label { display: block; font-size: 0.72rem; text-transform: uppercase; letter-spacing: 1px; color: var(--muted); margin-bottom: 0.5rem; }
.lf10-sheet-field input, .lf10-sheet-field textarea { width: 100%; border: none; border-bottom: 1px dashed var(--line); padding: 0.5rem 0; font-family: 'Inter', sans-serif; font-size: 0.98rem; outline: none; background: transparent; }
.lf10-sheet-field input:focus, .lf10-sheet-field textarea:focus { border-bottom-color: var(--primary); }
.lf10-sheet-field textarea { resize: vertical; min-height: 70px; }
.lf10-sheet-full { grid-column: 1 / -1; }

/* Footer inside main, matches sidebar tone */
.lf10-footer { background: var(--ink); color: rgba(255,255,255,0.55); padding: 2.5rem 3.5rem; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 1rem; font-size: 0.82rem; }
.lf10-footer a { color: rgba(255,255,255,0.55); }
.lf10-footer a:hover { color: var(--primary); }
.lf10-footer-links { display: flex; gap: 1.5rem; }



@media (max-width: 1100px) {
  .lf10-shell { flex-direction: column; }
  .lf10-sidebar { position: static; width: 100%; flex-direction: column; align-items: flex-start; padding: 1.5rem 2rem; }
  .lf10-index, .lf10-sidebar-contact { display: none; }
  .lf10-sidebar-design { margin: 1.5rem 0 !important; }
  .lf10-main { margin-left: 0; width: 100%; }
  .lf10-hero, .lf10-about, .lf10-services, .lf10-cases, .lf10-testimonial-wrap, .lf10-team, .lf10-faq, .lf10-contact, .lf10-footer { padding: 4rem 1.5rem; }
  .lf10-hero::before { width: 100%; transform: none; opacity: 1; }
  .lf10-hero-grid { grid-template-columns: 1fr; gap: 2.5rem; }
  .lf10-hero-photo img { max-width: 320px; width: 100%; margin: 0 auto; }
  .lf10-about-card, .lf10-faq-grid { grid-template-columns: 1fr; padding: 2rem; }
  .lf10-radial { display: none; }
  .lf10-radial-fallback { display: flex !important; }
}
@media (max-width: 768px) {
  .lf10-hero-grid h1 { font-size: 2.2rem; }
  .lf10-hero-badge { left: 50%; transform: translateX(-50%); bottom: -1.5rem; }
  .lf10-hero-stats-row { flex-wrap: wrap; gap: 1.5rem; }
  .lf10-about-figures { grid-template-columns: 1fr; }
  .lf10-sheet-grid { grid-template-columns: 1fr; }
  .lf10-about-card h2, .lf10-services-head h2, .lf10-cases-head h2, .lf10-team-head h2, .lf10-faq-grid h2, .lf10-contact-sheet h2 { font-size: 1.9rem; }
  .lf10-contact-sheet { padding: 2rem 1.5rem; }
  .lf10-testimonial-card { padding: 2rem 1.5rem; }
}
.lf10-radial-fallback { display: none; flex-direction: column; gap: 1rem; align-items: center; }
.lf10-radial-fallback .lf10-radial-node { position: static; width: 80%; text-align: left; display: flex; flex-direction: column; align-items: flex-start; gap: 0.25rem; transform: translateX(0%); }
@media (max-width: 768px) {
  .lf10-hero-grid, .lf10-faq-grid { grid-template-columns: 1fr !important; }
  .lf10-hero-stats-row, .lf10-faq-item-head, .lf10-footer, .lf10-footer-links { flex-direction: column !important; }
}

`;

export const law10Html = `
<div class="lf10-shell">
  <aside class="lf10-sidebar">
    <div>
      <div class="lf10-mark logo"><img src="https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=150" alt="Law Firm Logo" style="height: 45px; width: auto; border-radius: 4px; display: block; margin-bottom: 0.5rem;"><small>Rights & Justice</small></div>
      <div class="lf10-sidebar-design" style="margin: 4rem 0;">
        <div style="font-family: 'Fraunces', serif; font-size: 2.5rem; color: var(--primary); margin-bottom: 0.5rem; line-height: 1;">"</div>
        <p style="font-family: 'Fraunces', serif; font-size: 1.35rem; font-style: italic; color: rgba(255,255,255,0.85); line-height: 1.4; margin-bottom: 1.5rem;">Advocacy rooted in clarity and relentless preparation.</p>
        <div style="width: 40px; height: 2px; background: var(--primary);"></div>
      </div>
    </div>
    <div class="lf10-sidebar-contact">
      <p>PHONE_PLACEHOLDER</p>
      <p>EMAIL_PLACEHOLDER</p>
      <p>ADDRESS_PLACEHOLDER</p>
      <div class="lf10-sidebar-socials">
        <a href="javascript:void(0);">f</a>
        <a href="javascript:void(0);">x</a>
        <a href="javascript:void(0);">in</a>
      </div>
    </div>
  </aside>

  <main class="lf10-main">
    <section class="lf10-hero">
      <div class="lf10-hero-grid">
        <div class="lf10-reveal">
          <span class="lf10-tab">Case No. <span>2026-01</span></span>
          <h1>Legal strategy built like a well-argued case.</h1>
          <p>Every matter we take on is treated with the same discipline: understand the facts, plan the argument, and execute without hesitation.</p>
          <a href="javascript:void(0);" class="btn btn-solid">Open A Consultation</a>
        </div>
        <div class="lf10-hero-photo lf10-reveal" style="transition-delay: 0.15s;">
          <img src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=800" alt="Attorney portrait">
          <div class="lf10-hero-badge">
            <h3>96%</h3>
            <p>Success Rate</p>
          </div>
        </div>
      </div>
      <div class="lf10-hero-stats-row lf10-reveal">
        <div><h4>18+</h4><p>Years Practicing</p></div>
        <div><h4>310+</h4><p>Matters Closed</p></div>
        <div><h4>$41M</h4><p>Client Recoveries</p></div>
      </div>
    </section>

    <section class="lf10-about" id="about">
      <span class="lf10-tab">Section <span>01</span></span>
      <div class="lf10-about-card lf10-reveal">
        <div>
          <h2>Who we are.</h2>
          <p>A boutique legal practice built on rigorous strategy and plain-spoken advice. We advise founders, families, and enterprises on the matters that shape their future.</p>
          <p>No jargon, no false promises — just clarity on where you stand and what comes next, backed by senior attorneys on every file.</p>
        </div>
        <div class="lf10-about-figures">
          <div class="lf10-about-figure"><h4>150+</h4><p>Active Clients</p></div>
          <div class="lf10-about-figure"><h4>12</h4><p>Industry Awards</p></div>
          <div class="lf10-about-figure"><h4>4.9★</h4><p>Client Rating</p></div>
          <div class="lf10-about-figure"><h4>6</h4><p>Practice Areas</p></div>
        </div>
      </div>
    </section>

    <section class="lf10-services" id="services">
      <span class="lf10-tab">Section <span>02</span></span>
      <div class="lf10-services-head lf10-reveal">
        <h2>Practice areas, organized around your matter.</h2>
      </div>
      <div class="lf10-radial lf10-reveal">
        <div class="lf10-radial-center"><div>30+</div><p>Core Practice</p></div>
        <div class="lf10-radial-node n1"><h4>Corporate Law</h4><p>Governance & structuring</p></div>
        <div class="lf10-radial-node n2"><h4>Litigation</h4><p>Disputes & arbitration</p></div>
        <div class="lf10-radial-node n3"><h4>Real Estate</h4><p>Property & zoning</p></div>
        <div class="lf10-radial-node n4"><h4>Family Law</h4><p>Divorce & estate</p></div>
        <div class="lf10-radial-node n5"><h4>Compliance</h4><p>Regulatory advisory</p></div>
      </div>
      <div class="lf10-radial-fallback">
        <div class="lf10-radial-node n1"><h4>Corporate Law</h4><p>Governance & structuring</p></div>
        <div class="lf10-radial-node n2"><h4>Litigation</h4><p>Disputes & arbitration</p></div>
        <div class="lf10-radial-node n3"><h4>Real Estate</h4><p>Property & zoning</p></div>
        <div class="lf10-radial-node n4"><h4>Family Law</h4><p>Divorce & estate</p></div>
        <div class="lf10-radial-node n5"><h4>Compliance</h4><p>Regulatory advisory</p></div>
      </div>
    </section>

    <section class="lf10-cases" id="cases">
      <span class="lf10-tab">Section <span>03</span></span>
      <div class="lf10-cases-head lf10-reveal">
        <h2>Recent matters we've resolved.</h2>
      </div>
      <div class="lf10-scroll-strip lf10-reveal">
        <div class="lf10-case-card">
          <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800" alt="Case">
          <div class="lf10-case-card-body"><span class="tag">Corporate · 2026</span><h4>Cross-border merger diligence</h4></div>
        </div>
        <div class="lf10-case-card">
          <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800" alt="Case">
          <div class="lf10-case-card-body"><span class="tag">Litigation · 2026</span><h4>Commercial arbitration win</h4></div>
        </div>
        <div class="lf10-case-card">
          <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800" alt="Case">
          <div class="lf10-case-card-body"><span class="tag">Real Estate · 2026</span><h4>Zoning appeal resolution</h4></div>
        </div>
        <div class="lf10-case-card">
          <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800" alt="Case">
          <div class="lf10-case-card-body"><span class="tag">Family Law · 2026</span><h4>Estate succession planning</h4></div>
        </div>
      </div>
    </section>

    <section class="lf10-testimonial-wrap">
      <div class="lf10-testimonial-card lf10-reveal">
        <div class="qmark">"</div>
        <p class="quote">They treated our case like it was the only one on their desk. Thorough, responsive, and genuinely invested in the outcome.</p>
        <span>Elena Marsh — Founder, Marsh & Co.</span>
      </div>
    </section>

    <section class="lf10-team" id="team">
      <span class="lf10-tab">Section <span>04</span></span>
      <div class="lf10-team-head lf10-reveal">
        <h2>The attorneys behind the practice.</h2>
      </div>
      <div class="lf10-team-strip lf10-reveal">
        <div class="lf10-team-card">
          <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80" alt="Attorney">
          <h4>Andrew Cole</h4>
          <p>Managing Partner</p>
        </div>
        <div class="lf10-team-card">
          <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80" alt="Attorney">
          <h4>Priya Nair</h4>
          <p>Corporate Counsel</p>
        </div>
        <div class="lf10-team-card">
          <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80" alt="Attorney">
          <h4>Marcus Webb</h4>
          <p>Litigation Lead</p>
        </div>
        <div class="lf10-team-card">
          <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=800&q=80" alt="Attorney">
          <h4>Sofia Reyes</h4>
          <p>Family Law Advisor</p>
        </div>
      </div>
    </section>

    <section class="lf10-faq">
      <span class="lf10-tab">Section <span>05</span></span>
      <div class="lf10-faq-grid">
        <div class="lf10-reveal">
          <h2>Common questions.</h2>
          <p style="color: var(--muted); margin-top: 1rem;">Still unsure about something? Reach out and we'll walk you through it directly.</p>
        </div>
        <div class="lf10-reveal" style="transition-delay: 0.15s;">
          <details class="lf10-faq-item" open>
            <summary class="lf10-faq-item-head"><span>What should I bring to my first consultation?</span><span class="lf10-faq-toggle">+</span></summary>
            <div class="lf10-faq-body">Any documents relevant to your matter — contracts, correspondence, or notices — help us give accurate guidance from the start.</div>
          </details>
          <details class="lf10-faq-item">
            <summary class="lf10-faq-item-head"><span>How is your fee structure determined?</span><span class="lf10-faq-toggle">+</span></summary>
            <div class="lf10-faq-body">Fees depend on the nature and complexity of your matter, and are outlined clearly before engagement begins.</div>
          </details>
          <details class="lf10-faq-item">
            <summary class="lf10-faq-item-head"><span>Do you handle matters outside your region?</span><span class="lf10-faq-toggle">+</span></summary>
            <div class="lf10-faq-body">Yes, through our network of trusted co-counsel we support clients across multiple jurisdictions.</div>
          </details>
        </div>
      </div>
    </section>

    <section class="lf10-contact" id="contact">
      <div class="lf10-contact-sheet lf10-reveal">
        <h2>Case Intake Form</h2>
        <p>Fill in the details below and a member of our team will respond within one business day.</p>
        <form class="lead-capture-form">
          <div class="lf10-sheet-grid">
            <div class="lf10-sheet-field"><label>First Name</label><input type="text" name="firstName" placeholder="John" required></div>
            <div class="lf10-sheet-field"><label>Last Name</label><input type="text" name="lastName" placeholder="Doe" required></div>
            <div class="lf10-sheet-field"><label>Email Address</label><input type="email" name="email" placeholder="john@example.com" required></div>
            <div class="lf10-sheet-field"><label>Phone Number</label><input type="tel" name="phone" placeholder="(555) 123-4567" required></div>
            <div class="lf10-sheet-field lf10-sheet-full"><label>Case Details</label><textarea name="notes" placeholder="Tell us briefly about your situation..." required></textarea></div>
          </div>
          <button type="submit" class="btn btn-solid" style="width: 100%; justify-content: center;">Submit Case File</button>
        </form>
      </div>
    </section>

    <footer class="lf10-footer">
      <div>© 2026 PROJECT_NAME_PLACEHOLDER. All Rights Reserved.</div>
      <div class="lf10-footer-links">
        <a href="javascript:void(0);">Privacy Policy</a>
        <a href="javascript:void(0);">Terms of Service</a>
        <a href="javascript:void(0);">Disclaimer</a>
      </div>
    </footer>
  </main>
</div>

<script id="core-interactions">
  (function() {
    var isInEditor = !!document.querySelector('[data-gjs-type]') || document.body.classList.contains('gjs-dashed');

    if (!isInEditor) {
      document.body.classList.add('js-enabled');


      var revealEls = document.querySelectorAll('.lf10-reveal');
      if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function(entries) {
          entries.forEach(function(entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('in-view');
              io.unobserve(entry.target);
            }
          });
        }, { threshold: 0.12 });
        revealEls.forEach(function(el) { io.observe(el); });
      }
    }

    document.addEventListener('submit', function(e) {
      if (e.target.tagName === 'FORM') {
        e.preventDefault();
        if (isInEditor) {
          e.stopImmediatePropagation();
          var existingModal = document.getElementById("preview-mode-modal");
          if (existingModal) existingModal.remove();
          var modalHtml = '<div id="preview-mode-modal" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 999999; display: flex; align-items: center; justify-content: center; background: rgba(15, 23, 42, 0.7); backdrop-filter: blur(8px); opacity: 0; animation: pModalFadeIn 0.3s forwards; font-family: system-ui, -apple-system, sans-serif;"><div style="background: #ffffff; width: 90%; max-width: 400px; border-radius: 20px; padding: 32px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); text-align: center; transform: scale(0.95); animation: pModalScaleUp 0.3s forwards;"><div style="width: 60px; height: 60px; background: #FEF2F2; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;"><svg style="width: 30px; height: 30px; color: #EF4444;" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg></div><h3 style="font-size: 20px; font-weight: 700; color: #0F172A; margin: 0 0 12px; letter-spacing: -0.02em;">Preview Mode Active</h3><p style="font-size: 15px; color: #64748B; margin: 0 0 28px; line-height: 1.5;">Form submissions are disabled in preview mode. Publish your page to accept real submissions.</p><button onclick="document.getElementById(\\'preview-mode-modal\\').remove()" style="width: 100%; background: #0F172A; color: #ffffff; border: none; padding: 14px; border-radius: 12px; font-size: 15px; font-weight: 600; cursor: pointer; transition: background 0.2s;" onmouseover="this.style.background=\\'#1E293B\\'" onmouseout="this.style.background=\\'#0F172A\\'">Got it, close</button></div><style>@keyframes pModalFadeIn { to { opacity: 1; } } @keyframes pModalScaleUp { to { transform: scale(1); } }</style></div>';
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
                input.style.borderBottomColor = '#22c55e';
                if (input.nextElementSibling && input.nextElementSibling.classList.contains('val-error')) {
                  input.nextElementSibling.style.display = 'none';
                }
              } else {
                input.style.borderBottomColor = '#ef4444';
                if (input.nextElementSibling && input.nextElementSibling.classList.contains('val-error')) {
                  input.nextElementSibling.style.display = 'block';
                }
              }
            });
          }

          if (!input.value.trim() && input.hasAttribute('required')) {
            isValid = false;
            input.style.borderBottomColor = '#ef4444';

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
            if (btn.innerText) btn.innerText = 'Sending...';
            else btn.value = 'Sending...';
          }
          setTimeout(function() {
            e.target.innerHTML = '<div style="padding: 20px; text-align: center; border: 1px dashed rgba(0,0,0,0.2); border-radius: 4px;"><h3 style="margin: 0 0 10px 0;">Thank You!</h3><p style="margin: 0; opacity: 0.7;">Your case file has been submitted successfully.</p></div>';
          }, 1000);
        }
      }
    }, true);
  })();
</script>
`;