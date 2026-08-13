export const law09Styles = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500&family=Inter:wght@400;500;600;700&display=swap');

:root {
  --primary: PRIMARY_COLOR_PLACEHOLDER;
  --secondary: SECONDARY_COLOR_PLACEHOLDER;
  --primary-rgb: PRIMARY_RGB_PLACEHOLDER;
  --secondary-rgb: SECONDARY_RGB_PLACEHOLDER;
  --ink: #16161a;
  --paper: #fbfaf8;
  --muted: #7d7a73;
  --line: #e7e3db;
}

* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Inter', sans-serif; color: var(--ink); background: var(--paper); line-height: 1.7; overflow-x: hidden; }
h1, h2, h3, h4 { font-family: 'Cormorant Garamond', serif; font-weight: 600; line-height: 1.15; color: var(--ink); }
.container { max-width: 1180px; margin: 0 auto; padding: 0 1.5rem; position: relative; z-index: 5; }
img { max-width: 100%; display: block; }
a { text-decoration: none; color: inherit; transition: 0.3s; }
.eyebrow { font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: var(--primary); margin-bottom: 0.9rem; display: flex; align-items: center; gap: 0.6rem; }
.eyebrow::before { content: ''; width: 22px; height: 1px; background: var(--primary); }

.btn { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.95rem 2rem; border-radius: 2px; font-weight: 600; font-size: 0.82rem; text-transform: uppercase; letter-spacing: 1px; cursor: pointer; border: 1px solid transparent; }
.btn-solid { background: var(--ink); color: #fff; }
.btn-solid:hover { background: var(--primary); }
.btn-white { background: #fff; color: var(--ink); }
.btn-white:hover { background: var(--primary); color: #fff; }
.btn-line { border-color: var(--ink); color: var(--ink); }
.btn-line:hover { background: var(--ink); color: #fff; }

/* Header - minimal, no menu */
.lf9-header { padding: 1.75rem 0; background: var(--paper); border-bottom: 1px solid var(--line); }
.lf9-header-inner { display: flex; justify-content: space-between; align-items: center; }
.lf9-mark { font-family: 'Cormorant Garamond', serif; font-size: 1.6rem; }
.lf9-header-phone { font-size: 0.85rem; color: var(--muted); }

/* Hero - split, form lives INSIDE hero (not at page bottom) */
.lf9-hero { padding: 5rem 0 6rem; background: var(--ink); position: relative; overflow: hidden; }
.lf9-hero::before { content: ''; position: absolute; top: 0; left: 0; width: 42%; height: 100%; background-color: var(--primary); opacity: 0.9; }
.lf9-hero::after { content: ''; position: absolute; top: 0; left: 0; width: 42%; height: 100%; background: linear-gradient(90deg, rgba(22,22,26,0.1), var(--ink) 100%); }
.lf9-hero-grid { display: grid; grid-template-columns: 0.9fr 1.1fr; gap: 3rem; align-items: center; position: relative; z-index: 3; }
.lf9-hero-copy { grid-column: 2; color: #fff; }
.lf9-hero-copy h1 { font-size: 3.1rem; color: #fff; margin-bottom: 1.25rem; }
.lf9-hero-copy p { color: rgba(255,255,255,0.65); font-size: 1rem; max-width: 460px; margin-bottom: 1.5rem; }
.lf9-hero-stats { display: flex; gap: 2.5rem; margin-top: 2rem; }
.lf9-hero-stats div h3 { color: var(--primary); font-family: 'Inter', sans-serif; font-weight: 700; font-size: 1.9rem; }
.lf9-hero-stats div p { color: rgba(255,255,255,0.5); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px; }
.lf9-hero-formcard { position: relative; z-index: 3; grid-column: 1; grid-row: 1; background: #fff; padding: 2.5rem; border-radius: 4px; box-shadow: 0 25px 60px rgba(0,0,0,0.35); }
.lf9-hero-formcard h3 { font-size: 1.5rem; margin-bottom: 1.5rem; }
.lf9-fg { margin-bottom: 1rem; }
.lf9-fg input, .lf9-fg textarea { width: 100%; padding: 0.8rem 0.9rem; border: 1px solid var(--line); border-radius: 2px; font-family: 'Inter', sans-serif; font-size: 0.9rem; outline: none; }
.lf9-fg input:focus, .lf9-fg textarea:focus { border-color: var(--primary); }
.lf9-fg textarea { resize: vertical; min-height: 70px; }

/* Marquee text strip - no images */
.lf9-ticker { background: var(--paper); border-bottom: 1px solid var(--line); padding: 1rem 0; overflow: hidden; }
.lf9-ticker-track { display: flex; width: max-content; animation: lf9scroll 28s linear infinite; }
.lf9-ticker-track span { font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1.5px; color: var(--muted); padding: 0 1.75rem; white-space: nowrap; font-weight: 600; }
.lf9-ticker-track span.dot { color: var(--primary); }
@keyframes lf9scroll { to { transform: translateX(-50%); } }

/* About - text heavy, two column, one modest image */
.lf9-about { padding: 7rem 0; }
.lf9-about-grid { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 4rem; align-items: start; }
.lf9-about-grid h2 { font-size: 2.6rem; margin-bottom: 1.5rem; }
.lf9-about-grid > div:first-child p { color: var(--muted); margin-bottom: 1.25rem; font-size: 1rem; }
.lf9-pullquote { border-left: 3px solid var(--primary); padding-left: 1.5rem; margin: 2rem 0; font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: 1.35rem; color: var(--ink); }
.lf9-about-side { position: sticky; top: 2rem; }
.lf9-about-side img { border-radius: 4px; height: 340px; object-fit: cover; margin-bottom: 1.5rem; }
.lf9-about-side ul { list-style: none; display: flex; flex-direction: column; gap: 0.9rem; }
.lf9-about-side li { display: flex; gap: 0.75rem; font-size: 0.92rem; color: var(--muted); }
.lf9-about-side li::before { content: '—'; color: var(--primary); font-weight: 700; flex-shrink: 0; }

/* Services - full text list, accordion-style descriptions, no imagery */
.lf9-services { padding: 7rem 0; background: #fff; border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
.lf9-services-head { max-width: 640px; margin-bottom: 3.5rem; }
.lf9-services-head h2 { font-size: 2.6rem; }
.lf9-service-row { border-bottom: 1px solid var(--line); padding: 1.75rem 0; cursor: pointer; }
.lf9-service-row:first-child { border-top: 1px solid var(--line); }
.lf9-service-row-head { display: flex; justify-content: space-between; align-items: center; gap: 1rem; list-style: none; }
.lf9-service-row-head::-webkit-details-marker { display: none; }
.lf9-service-row-head h3 { font-size: 1.5rem; }
.lf9-service-row-head span.num { font-family: 'Inter', sans-serif; color: var(--muted); font-size: 0.85rem; }
.lf9-service-body { color: var(--muted); font-size: 0.95rem; padding-top: 1rem; }

/* Timeline - text based process, small number markers, no photos */
.lf9-timeline { padding: 7rem 0; }
.lf9-timeline-head { text-align: center; max-width: 620px; margin: 0 auto 4rem; }
.lf9-timeline-head h2 { font-size: 2.6rem; }
.lf9-timeline-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2rem; }
.lf9-timeline-step { text-align: center; padding: 0 0.5rem; }
.lf9-timeline-step .marker { width: 46px; height: 46px; border-radius: 50%; border: 1px solid var(--primary); color: var(--primary); font-family: 'Inter', sans-serif; font-weight: 700; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.25rem; }
.lf9-timeline-step h4 { font-size: 1.25rem; margin-bottom: 0.5rem; }
.lf9-timeline-step p { color: var(--muted); font-size: 0.88rem; }

/* Testimonial - text only, solid color, no photo */
.lf9-testimonial { padding: 6rem 0; background: var(--ink); }
.lf9-testimonial-inner { max-width: 780px; margin: 0 auto; text-align: center; }
.lf9-testimonial-inner .qmark { font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: 3.5rem; color: var(--primary); margin-bottom: 0.5rem; }
.lf9-testimonial-inner p.quote { color: #fff; font-family: 'Cormorant Garamond', serif; font-size: 1.7rem; line-height: 1.4; margin-bottom: 1.5rem; }
.lf9-testimonial-inner span { color: rgba(255,255,255,0.55); font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px; }

/* Team - directory-style rows, small circular thumbnail + full bio text */
.lf9-team { padding: 7rem 0; }
.lf9-team-head { max-width: 620px; margin-bottom: 3.5rem; }
.lf9-team-head h2 { font-size: 2.6rem; }
.lf9-team-row { display: grid; grid-template-columns: 90px 1fr; gap: 1.75rem; padding: 2rem 0; border-top: 1px solid var(--line); align-items: start; }
.lf9-team-row:last-child { border-bottom: 1px solid var(--line); }
.lf9-team-row img { width: 90px; height: 90px; border-radius: 50%; object-fit: cover; }
.lf9-team-row h4 { font-size: 1.4rem; }
.lf9-team-row span.role { color: var(--primary); font-size: 0.78rem; text-transform: uppercase; letter-spacing: 1px; font-weight: 700; display: block; margin: 0.3rem 0 0.6rem; }
.lf9-team-row p { color: var(--muted); font-size: 0.92rem; max-width: 620px; }

/* FAQ - text accordion */
.lf9-faq { padding: 7rem 0; background: #fff; border-top: 1px solid var(--line); }
.lf9-faq-grid { display: grid; grid-template-columns: 0.7fr 1.3fr; gap: 4rem; }
.lf9-faq-grid h2 { font-size: 2.6rem; }
.lf9-faq-grid > div:first-child p { color: var(--muted); margin-top: 1.25rem; max-width: 320px; }
.lf9-faq-item { border-bottom: 1px solid var(--line); padding: 1.5rem 0; cursor: pointer; }
.lf9-faq-item:first-child { border-top: 1px solid var(--line); }
.lf9-faq-item-head { display: flex; justify-content: space-between; align-items: center; gap: 1rem; font-weight: 600; font-size: 1rem; list-style: none; }
.lf9-faq-item-head::-webkit-details-marker { display: none; }
.lf9-faq-toggle { flex-shrink: 0; color: var(--primary); font-size: 1.2rem; transition: 0.3s transform; }
details[open] .lf9-faq-toggle { transform: rotate(45deg); }
.lf9-faq-body { color: var(--muted); font-size: 0.92rem; padding-top: 0.9rem; }

/* CTA - solid color, no image, text focused */
.lf9-cta { padding: 6rem 0; background: var(--primary); text-align: center; }
.lf9-cta h2 { color: #fff; font-size: 2.6rem; max-width: 620px; margin: 0 auto 1.75rem; }
.lf9-cta p { color: rgba(255,255,255,0.8); max-width: 520px; margin: 0 auto 2.25rem; }

/* Footer - text focused, minimal image, newsletter placed here (second form location) */
.lf9-footer { background: var(--ink); color: #fff; padding: 5rem 0 0; }
.lf9-footer-grid { display: grid; grid-template-columns: 1.2fr 0.8fr 0.8fr 1.2fr; gap: 3rem; padding-bottom: 3rem; border-bottom: 1px solid rgba(255,255,255,0.1); }
.lf9-footer-col h4 { font-family: 'Inter', sans-serif; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1.5px; color: rgba(255,255,255,0.4); margin-bottom: 1.25rem; }
.lf9-footer-col p { color: rgba(255,255,255,0.6); font-size: 0.9rem; }
.lf9-footer-col ul { list-style: none; display: flex; flex-direction: column; gap: 0.8rem; }
.lf9-footer-col a { color: rgba(255,255,255,0.65); font-size: 0.9rem; }
.lf9-footer-col a:hover { color: var(--primary); }
.lf9-footer-newsletter { display: flex; margin-top: 1.1rem; border-bottom: 1px solid rgba(255,255,255,0.3); padding-bottom: 0.5rem; }
.lf9-footer-newsletter input { flex: 1; background: transparent; border: none; color: #fff; font-size: 0.88rem; outline: none; }
.lf9-footer-newsletter input::placeholder { color: rgba(255,255,255,0.4); }
.lf9-footer-newsletter button { background: transparent; border: none; color: var(--primary); cursor: pointer; }
.lf9-footer-bottom { padding: 1.75rem 0; text-align: center; font-size: 0.82rem; color: rgba(255,255,255,0.4); }



@media (max-width: 992px) {
  .lf9-hero::before, .lf9-hero::after { width: 100%; opacity: 0.25; }
  .lf9-hero-grid { grid-template-columns: 1fr; }
  .lf9-hero-copy, .lf9-hero-formcard { grid-column: 1; }
  .lf9-hero-formcard { grid-row: auto; }
  .lf9-about-grid, .lf9-faq-grid { grid-template-columns: 1fr; }
  .lf9-about-side { position: static; }
  .lf9-timeline-grid { grid-template-columns: 1fr 1fr; }
  .lf9-team-row { grid-template-columns: 70px 1fr; }
  .lf9-footer-grid { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 768px) {
  .lf9-hero-copy h1 { font-size: 2.2rem; }
  .lf9-about-grid h2, .lf9-services-head h2, .lf9-timeline-head h2, .lf9-team-head h2, .lf9-faq-grid h2, .lf9-cta h2 { font-size: 2rem; }
  .lf9-timeline-grid { grid-template-columns: 1fr 1fr; }
  .lf9-footer-grid { grid-template-columns: 1fr; }
  .lf9-hero-stats { flex-wrap: wrap; gap: 1.5rem; }
}
`;

export const law09Html = `
<header class="lf9-header">
  <div class="container lf9-header-inner">
    <a href="javascript:void(0);" class="lf9-mark logo">LOGO_PLACEHOLDER</a>
    <span class="lf9-header-phone">PHONE_PLACEHOLDER</span>
  </div>
</header>

<section class="lf9-hero">
  <div class="container lf9-hero-grid">
    <div class="lf9-hero-formcard lf9-reveal">
      <h3>Request A Consultation</h3>
      <form class="lead-capture-form">
        <div class="lf9-fg"><input type="text" name="name" placeholder="Full Name" required></div>
        <div class="lf9-fg"><input type="email" name="email" placeholder="Email Address" required></div>
        <div class="lf9-fg"><input type="tel" name="phone" placeholder="Phone Number" required></div>
        <div class="lf9-fg"><textarea name="notes" placeholder="Briefly describe your case..." required></textarea></div>
        <button type="submit" class="btn btn-solid" style="width: 100%; justify-content: center;">Send Message</button>
      </form>
    </div>
    <div class="lf9-hero-copy lf9-reveal" style="transition-delay: 0.15s;">
      <div class="eyebrow">Trusted Legal Practice</div>
      <h1>Legal counsel that reads every detail before it becomes a problem.</h1>
      <p>We work closely with founders, families, and enterprises to resolve legal matters before they escalate — and to defend them firmly when they do.</p>
      <a href="javascript:void(0);" class="btn btn-line" style="border-color: rgba(255,255,255,0.4); color: #fff;">Explore Our Practice</a>
      <div class="lf9-hero-stats">
        <div><h3>18+</h3><p>Years Practicing</p></div>
        <div><h3>96%</h3><p>Success Rate</p></div>
        <div><h3>310+</h3><p>Matters Closed</p></div>
      </div>
    </div>
  </div>
</section>

<div class="lf9-ticker">
  <div class="lf9-ticker-track">
    <span>Corporate Law <span class="dot">●</span></span><span>Litigation <span class="dot">●</span></span><span>Real Estate <span class="dot">●</span></span><span>Family Law <span class="dot">●</span></span><span>Compliance <span class="dot">●</span></span>
    <span>Corporate Law <span class="dot">●</span></span><span>Litigation <span class="dot">●</span></span><span>Real Estate <span class="dot">●</span></span><span>Family Law <span class="dot">●</span></span><span>Compliance <span class="dot">●</span></span>
  </div>
</div>

<section class="lf9-about" id="about">
  <div class="container lf9-about-grid">
    <div class="lf9-reveal">
      <div class="eyebrow">Who We Are</div>
      <h2>Built on judgment, not just credentials.</h2>
      <p>Every legal matter carries its own weight, timeline, and risk. We take the time to understand the full context before recommending a path forward — because generic advice rarely holds up when it matters most.</p>
      <div class="lf9-pullquote">"We shoulder the legal burden so our clients can focus on what they do best."</div>
      <p>Our attorneys stay directly involved from the first consultation through resolution, so you're never re-explaining your situation to someone new halfway through the process.</p>
    </div>
    <div class="lf9-about-side lf9-reveal" style="transition-delay: 0.15s;">
      <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800" alt="Attorney at work">
      <ul>
        <li>Senior counsel on every file, from day one</li>
        <li>Transparent fees, agreed before engagement</li>
        <li>Direct access to your attorney, not a call center</li>
        <li>Multi-jurisdiction support through trusted partners</li>
      </ul>
    </div>
  </div>
</section>

<section class="lf9-services" id="services">
  <div class="container">
    <div class="lf9-services-head lf9-reveal">
      <div class="eyebrow">SERVICES_PLACEHOLDER</div>
      <h2>Practice areas we handle end to end.</h2>
    </div>
    <div class="lf9-reveal">
      <details class="lf9-service-row" open>
        <summary class="lf9-service-row-head"><h3>Corporate & Commercial Law</h3><span class="num">01</span></summary>
        <div class="lf9-service-body">Formation, governance, contracts, and transactional support for businesses at every stage of growth.</div>
      </details>
      <details class="lf9-service-row">
        <summary class="lf9-service-row-head"><h3>Litigation & Dispute Resolution</h3><span class="num">02</span></summary>
        <div class="lf9-service-body">Assertive representation in negotiation, arbitration, and court — built around the outcome you actually need.</div>
      </details>
      <details class="lf9-service-row">
        <summary class="lf9-service-row-head"><h3>Real Estate Law</h3><span class="num">03</span></summary>
        <div class="lf9-service-body">Acquisitions, leasing, zoning appeals, and property dispute resolution handled with full diligence.</div>
      </details>
      <details class="lf9-service-row">
        <summary class="lf9-service-row-head"><h3>Family & Estate Planning</h3><span class="num">04</span></summary>
        <div class="lf9-service-body">Sensitive, thorough guidance through divorce, custody, wills, and succession matters.</div>
      </details>
      <details class="lf9-service-row">
        <summary class="lf9-service-row-head"><h3>Regulatory Compliance</h3><span class="num">05</span></summary>
        <div class="lf9-service-body">Ensuring your business stays ahead of evolving regulations, before they become liabilities.</div>
      </details>
    </div>
  </div>
</section>

<section class="lf9-timeline">
  <div class="container">
    <div class="lf9-timeline-head lf9-reveal">
      <div class="eyebrow" style="justify-content:center;">How We Work</div>
      <h2>A clear path, from first call to resolution.</h2>
    </div>
    <div class="lf9-timeline-grid lf9-reveal">
      <div class="lf9-timeline-step">
        <div class="marker">01</div>
        <h4>Consultation</h4>
        <p>A confidential conversation to understand your goals and constraints.</p>
      </div>
      <div class="lf9-timeline-step">
        <div class="marker">02</div>
        <h4>Strategy</h4>
        <p>A clear plan, transparent fees, and a dedicated attorney assigned to your matter.</p>
      </div>
      <div class="lf9-timeline-step">
        <div class="marker">03</div>
        <h4>Representation</h4>
        <p>We negotiate, file, and litigate on your behalf, keeping you informed throughout.</p>
      </div>
      <div class="lf9-timeline-step">
        <div class="marker">04</div>
        <h4>Resolution</h4>
        <p>Once resolved, we remain available for any follow-up legal needs.</p>
      </div>
    </div>
  </div>
</section>

<section class="lf9-testimonial">
  <div class="container">
    <div class="lf9-testimonial-inner lf9-reveal">
      <div class="qmark">"</div>
      <p class="quote">They treated our case like it was the only one on their desk — thorough, responsive, and genuinely invested in the outcome.</p>
      <span>Elena Marsh — Founder, Marsh & Co.</span>
    </div>
  </div>
</section>

<section class="lf9-team" id="team">
  <div class="container">
    <div class="lf9-team-head lf9-reveal">
      <div class="eyebrow">Our People</div>
      <h2>The attorneys behind the practice.</h2>
    </div>
    <div class="lf9-reveal">
      <div class="lf9-team-row">
        <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800" alt="Andrew Cole">
        <div>
          <h4>Andrew Cole</h4>
          <span class="role">Managing Partner</span>
          <p>Andrew leads the firm's corporate practice, advising clients on governance, M&A, and complex commercial disputes for over 18 years.</p>
        </div>
      </div>
      <div class="lf9-team-row">
        <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800" alt="Priya Nair">
        <div>
          <h4>Priya Nair</h4>
          <span class="role">Corporate Counsel</span>
          <p>Priya focuses on startup formation, fundraising, and contract structuring, helping founders build on solid legal ground.</p>
        </div>
      </div>
      <div class="lf9-team-row">
        <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800" alt="Marcus Webb">
        <div>
          <h4>Marcus Webb</h4>
          <span class="role">Litigation Lead</span>
          <p>Marcus represents clients in high-stakes commercial disputes, with a strong record in arbitration and civil litigation.</p>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="lf9-faq">
  <div class="container lf9-faq-grid">
    <div class="lf9-reveal">
      <div class="eyebrow">FAQ</div>
      <h2>Common questions, answered.</h2>
      <p>Still unsure about something? Reach out and we'll walk you through it directly.</p>
    </div>
    <div class="lf9-reveal" style="transition-delay: 0.15s;">
      <details class="lf9-faq-item" open>
        <summary class="lf9-faq-item-head"><span>What should I bring to my first consultation?</span><span class="lf9-faq-toggle">+</span></summary>
        <div class="lf9-faq-body">Any documents relevant to your matter — contracts, correspondence, or notices — help us give accurate guidance from the start.</div>
      </details>
      <details class="lf9-faq-item">
        <summary class="lf9-faq-item-head"><span>How is your fee structure determined?</span><span class="lf9-faq-toggle">+</span></summary>
        <div class="lf9-faq-body">Fees depend on the nature and complexity of your matter, and are always outlined clearly before engagement begins.</div>
      </details>
      <details class="lf9-faq-item">
        <summary class="lf9-faq-item-head"><span>Do you handle matters outside your region?</span><span class="lf9-faq-toggle">+</span></summary>
        <div class="lf9-faq-body">Yes, through our network of trusted co-counsel we support clients across multiple jurisdictions.</div>
      </details>
      <details class="lf9-faq-item">
        <summary class="lf9-faq-item-head"><span>How quickly can you begin work on my case?</span><span class="lf9-faq-toggle">+</span></summary>
        <div class="lf9-faq-body">In most cases, we can begin within a few business days of a signed engagement letter.</div>
      </details>
    </div>
  </div>
</section>

<section class="lf9-cta" id="contact">
  <div class="container lf9-reveal">
    <h2>Have a legal matter that needs clear direction?</h2>
    <p>Reach out today — ADDRESS_PLACEHOLDER — and a member of our team will respond within one business day.</p>
    <a href="tel:PHONE_PLACEHOLDER" class="btn btn-white">Call PHONE_PLACEHOLDER</a>
  </div>
</section>

<footer class="lf9-footer">
  <div class="container lf9-footer-grid">
    <div class="lf9-footer-col">
      <h4>The Firm</h4>
      <p>Precision counsel for the matters that shape businesses and lives — direct, strategic, and always accountable.</p>
    </div>
    <div class="lf9-footer-col">
      <h4>Navigate</h4>
      <ul>
        <li><a href="javascript:void(0);">About</a></li>
        <li><a href="javascript:void(0);">Practice</a></li>
        <li><a href="javascript:void(0);">Attorneys</a></li>
        <li><a href="javascript:void(0);">Contact</a></li>
      </ul>
    </div>
    <div class="lf9-footer-col">
      <h4>Contact</h4>
      <ul>
        <li><a href="tel:PHONE_PLACEHOLDER">PHONE_PLACEHOLDER</a></li>
        <li><a href="mailto:EMAIL_PLACEHOLDER">EMAIL_PLACEHOLDER</a></li>
        <li>ADDRESS_PLACEHOLDER</li>
      </ul>
    </div>
    <div class="lf9-footer-col">
      <h4>Stay Informed</h4>
      <p>Occasional legal insights, no spam.</p>
      <form class="lf9-footer-newsletter lead-capture-form">
        <input type="email" name="email" placeholder="Your email address" required>
        <button type="submit">→</button>
      </form>
    </div>
  </div>
  <div class="lf9-footer-bottom">© 2026 LOGO_PLACEHOLDER. All Rights Reserved.</div>
</footer>

<script id="core-interactions">
  (function() {
    var isInEditor = !!document.querySelector('[data-gjs-type]') || document.body.classList.contains('gjs-dashed');

    if (!isInEditor) {
      document.body.classList.add('js-enabled');



      var revealEls = document.querySelectorAll('.lf9-reveal');
      if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function(entries) {
          entries.forEach(function(entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('in-view');
              io.unobserve(entry.target);
            }
          });
        }, { threshold: 0.15 });
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
          var modalHtml = '<div id="preview-mode-modal" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 999999; display: flex; align-items: center; justify-content: center; background: rgba(15, 23, 42, 0.7); backdrop-filter: blur(8px); opacity: 0; animation: pModalFadeIn 0.3s forwards; font-family: system-ui, -apple-system, sans-serif;"><div style="background: #ffffff; width: 90%; max-width: 400px; border-radius: 20px; padding: 32px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); text-align: center; transform: scale(0.95); animation: pModalScaleUp 0.3s forwards;"><div style="width: 60px; height: 60px; background: #FEF2F2; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;">LOGO_PLACEHOLDER</div><h3 style="font-size: 20px; font-weight: 700; color: #0F172A; margin: 0 0 12px; letter-spacing: -0.02em;">Preview Mode Active</h3><p style="font-size: 15px; color: #64748B; margin: 0 0 28px; line-height: 1.5;">Form submissions are disabled in preview mode. Publish your page to accept real submissions.</p><button onclick="document.getElementById(\\'preview-mode-modal\\').remove()" style="width: 100%; background: #0F172A; color: #ffffff; border: none; padding: 14px; border-radius: 12px; font-size: 15px; font-weight: 600; cursor: pointer; transition: background 0.2s;" onmouseover="this.style.background=\\'#1E293B\\'" onmouseout="this.style.background=\\'#0F172A\\'">Got it, close</button></div><style>@keyframes pModalFadeIn { to { opacity: 1; } } @keyframes pModalScaleUp { to { transform: scale(1); } }</style></div>';
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
                input.style.borderColor = '#22c55e';
                if (input.nextElementSibling && input.nextElementSibling.classList.contains('val-error')) {
                  input.nextElementSibling.style.display = 'none';
                }
              } else {
                input.style.borderColor = '#ef4444';
                if (input.nextElementSibling && input.nextElementSibling.classList.contains('val-error')) {
                  input.nextElementSibling.style.display = 'block';
                }
              }
            });
          }

          if (!input.value.trim() && input.hasAttribute('required')) {
            isValid = false;
            input.style.borderColor = '#ef4444';

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
            e.target.innerHTML = '<div style="padding: 20px; text-align: center; border: 1px dashed rgba(0,0,0,0.2); border-radius: 4px;"><h3 style="margin: 0 0 10px 0;">Thank You!</h3><p style="margin: 0; opacity: 0.7;">Your request has been submitted successfully.</p></div>';
          }, 1000);
        }
      }
    }, true);
  })();
</script>
`;