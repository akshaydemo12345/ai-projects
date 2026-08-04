export const plumber08Styles = `
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700;800;900&family=Rajdhani:wght@400;500;600;700&display=swap');

:root {
  --bg-void: #060512;
  --bg-panel: #0D0B1F;
  --primary: PRIMARY_COLOR_PLACEHOLDER;
  --secondary: SECONDARY_COLOR_PLACEHOLDER;
  --text-main: #EDEBFB;
  --text-muted: #8C87B3;
  --glass-border: 1px solid rgba(255,255,255,0.08);
  --glow-primary: 0 0 30px color-mix(in srgb, var(--primary) 55%, transparent);
  --glow-secondary: 0 0 30px color-mix(in srgb, var(--secondary) 55%, transparent);
}

body, .gjs-dashed, [data-gjs-type="wrapper"], main {
    background-color: var(--bg-void) !important;
    color: var(--text-main) !important;
}
h1, h2, h3, h4, h5, h6, p, span, div, a { color: inherit; }

* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Rajdhani', sans-serif; background: var(--bg-void); color: var(--text-main); line-height: 1.6; font-weight: 500; overflow-x: hidden; }
h1, h2, h3, h4 { font-family: 'Orbitron', sans-serif; font-weight: 800; letter-spacing: -0.01em; text-transform: uppercase; }
a { text-decoration: none; color: inherit; transition: 0.3s; }
img { max-width: 100%; display: block; }
.container { max-width: 1280px; margin: 0 auto; padding: 0 26px; }

/* 1. Nav */
.header-08 { position: fixed; top: 0; left: 0; width: 100%; z-index: 100; padding: 18px 0; }
.nav-08-inner { background: color-mix(in srgb, var(--bg-panel) 70%, transparent); backdrop-filter: blur(14px); border: var(--glass-border); border-radius: 14px; padding: 14px 26px; display: flex; justify-content: space-between; align-items: center; }
.logo-08 { font-family: 'Orbitron', sans-serif; font-size: 18px; font-weight: 900; background: linear-gradient(90deg, var(--primary), var(--secondary)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.nav-links-08 { display: flex; gap: 32px; }
.nav-links-08 a { font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text-muted); }
.nav-links-08 a:hover { color: var(--primary); }
.btn-08 { background: linear-gradient(90deg, var(--primary), var(--secondary)); color: #06040F; padding: 11px 26px; border-radius: 10px; font-weight: 700; text-transform: uppercase; font-size: 13px; letter-spacing: 0.5px; border: none; cursor: pointer; box-shadow: var(--glow-primary); }
.btn-08-alt { background: transparent; border: 1px solid var(--secondary); color: var(--secondary); padding: 10px 25px; border-radius: 10px; font-weight: 700; text-transform: uppercase; font-size: 13px; }

/* 2. Node graph hero */
.hero-08 { min-height: 100vh; display: flex; align-items: center; position: relative; overflow: hidden; padding-top: 100px; }
.node-canvas { position: absolute; inset: 0; z-index: 0; opacity: 0.6; }
.hero-08-glow { position: absolute; top: 30%; left: 50%; transform: translate(-50%,-50%); width: 900px; height: 900px; background: radial-gradient(circle, color-mix(in srgb, var(--primary) 22%, transparent) 0%, color-mix(in srgb, var(--secondary) 12%, transparent) 45%, transparent 70%); filter: blur(70px); z-index: 0; }
.hero-08-content { position: relative; z-index: 2; text-align: center; max-width: 900px; margin: 0 auto; }
.hero-08 h1 { font-size: clamp(2.2rem, 5.6vw, 4.4rem); line-height: 1.05; margin-bottom: 26px; }
.hero-08 h1 span { background: linear-gradient(90deg, var(--secondary), var(--primary)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.hero-08 p { font-size: 17px; color: var(--text-muted); margin-bottom: 40px; max-width: 560px; margin-inline: auto; }
.hero-btns-08 { display: flex; gap: 18px; justify-content: center; }

/* 3. Volume ticker */
.ticker-08 { border-top: var(--glass-border); border-bottom: var(--glass-border); background: var(--bg-panel); padding: 18px 0; overflow: hidden; position: relative; z-index: 2; }
.ticker-track-08 { display: flex; gap: 50px; animation: ticker08 22s linear infinite; white-space: nowrap; }
.tick-item-08 { display: flex; align-items: center; gap: 10px; font-weight: 700; font-size: 14px; font-family: 'Orbitron', sans-serif; }
.tick-item-08 .up { color: var(--primary); }
.tick-item-08 .down { color: var(--secondary); }
@keyframes ticker08 { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }

/* 4. Signature: the Relay — a live animated settlement graph, not icon cards */
.features-08 { padding: 120px 0; }
.features-08-grid { display: grid; grid-template-columns: 0.85fr 1.15fr; gap: 60px; align-items: center; }
.features-08-copy h2 { font-size: 32px; margin-bottom: 18px; }
.features-08-copy p { color: var(--text-muted); text-transform: none; margin-bottom: 30px; max-width: 420px; }
.relay-list-08 { display: flex; flex-direction: column; gap: 18px; }
.relay-item-08 { display: flex; gap: 14px; align-items: flex-start; }
.relay-item-08 .dot-lbl { width: 30px; height: 30px; border-radius: 8px; background: color-mix(in srgb, var(--primary) 15%, transparent); color: var(--primary); display: flex; align-items: center; justify-content: center; font-size: 13px; flex-shrink: 0; }
.relay-item-08 h4 { font-size: 14px; font-weight: 700; text-transform: uppercase; margin-bottom: 2px; }
.relay-item-08 p { font-size: 13px; color: var(--text-muted); text-transform: none; margin: 0; }
.relay-viz-08 { position: relative; height: 420px; background: var(--bg-panel); border: var(--glass-border); border-radius: 18px; overflow: hidden; }
.relay-node-lbl { position: absolute; font-family: 'Orbitron', sans-serif; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text-muted); }

/* 5. Exchange rate calculator mock */
.swap-08 { padding: 100px 0; background: var(--bg-panel); border-top: var(--glass-border); border-bottom: var(--glass-border); }
.swap-08-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }
.swap-08 h2 { font-size: 30px; margin-bottom: 20px; }
.swap-08 p { color: var(--text-muted); margin-bottom: 30px; text-transform: none; max-width: 420px; }
.swap-panel { background: var(--bg-void); border: var(--glass-border); border-radius: 18px; padding: 30px; }
.swap-row { display: flex; justify-content: space-between; align-items: center; background: var(--bg-panel); border-radius: 12px; padding: 18px 20px; margin-bottom: 14px; }
.swap-row .amt { font-family: 'Orbitron', sans-serif; font-size: 20px; font-weight: 700; }
.swap-row .cur { font-size: 13px; color: var(--text-muted); font-weight: 600; }
.swap-arrow-08 { text-align: center; color: var(--primary); font-size: 20px; margin: -6px 0; }

/* 6. Network node grid */
.network-08 { padding: 100px 0; text-align: center; }
.network-08 h2 { font-size: 28px; margin-bottom: 60px; }
.net-badges-08 { display: flex; justify-content: center; gap: 30px; flex-wrap: wrap; }
.net-badge-08 { background: var(--bg-panel); border: var(--glass-border); border-radius: 14px; padding: 20px 34px; display: flex; align-items: center; gap: 14px; }
.net-badge-08 i { font-size: 20px; color: var(--secondary); }
.net-badge-08 h4 { font-family: 'Rajdhani', sans-serif; font-size: 15px; font-weight: 700; text-transform: uppercase; }

/* 7. Stats band */
.stats-08 { padding: 90px 0; border-top: var(--glass-border); border-bottom: var(--glass-border); }
.stats-08-grid { display: grid; grid-template-columns: repeat(4, 1fr); text-align: center; }
.stat-08-item { padding: 0 20px; border-left: var(--glass-border); }
.stat-08-item:first-child { border-left: none; }
.stat-08-val { font-family: 'Orbitron', sans-serif; font-size: 36px; font-weight: 800; background: linear-gradient(90deg, var(--primary), var(--secondary)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.stat-08-label { font-size: 13px; color: var(--text-muted); text-transform: uppercase; margin-top: 10px; letter-spacing: 0.5px; }

/* 8. Roadmap phases */
.roadmap-08 { padding: 120px 0; }
.roadmap-08 h2 { text-align: center; font-size: 30px; margin-bottom: 70px; }
.roadmap-grid-08 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
.phase-08 { background: var(--bg-panel); border: var(--glass-border); border-radius: 16px; padding: 30px; }
.phase-08.active { border-color: var(--primary); box-shadow: var(--glow-primary); }
.phase-08 h4 { font-size: 15px; color: var(--primary); margin-bottom: 12px; }
.phase-08 h3 { font-size: 16px; margin-bottom: 12px; }
.phase-08 p { color: var(--text-muted); font-size: 13px; text-transform: none; }

/* 9. Join CTA */
.join-08 { padding: 120px 0; text-align: center; position: relative; }
.join-08-inner { max-width: 600px; margin: 0 auto; position: relative; z-index: 2; }
.join-08 h2 { font-size: 32px; margin-bottom: 20px; }
.join-08 p { color: var(--text-muted); margin-bottom: 40px; text-transform: none; }

/* 10. Footer */
.footer-08 { border-top: var(--glass-border); padding: 70px 0 36px; background: var(--bg-panel); }
.footer-08-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 40px; margin-bottom: 50px; }
.footer-08 h4 { font-size: 13px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 20px; color: var(--text-muted); }
.footer-links-08 a { display: block; color: var(--text-main); margin-bottom: 12px; font-size: 14px; }
.footer-links-08 a:hover { color: var(--primary); }
.social-08 { display: flex; gap: 14px; margin-top: 20px; }
.social-08 a { width: 40px; height: 40px; border-radius: 10px; background: rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: center; font-size: 17px; }
.social-08 a:hover { background: var(--primary); color: #06040F; }
.footer-08-bottom { border-top: var(--glass-border); padding-top: 24px; display: flex; justify-content: space-between; font-size: 12px; color: var(--text-muted); }

@media (max-width: 1024px) {
  .feat-grid-08 { grid-template-columns: repeat(2, 1fr); }
  .swap-08-grid { grid-template-columns: 1fr; }
  .stats-08-grid, .roadmap-grid-08 { grid-template-columns: repeat(2, 1fr); }
  .stat-08-item:nth-child(3) { border-left: none; }
  .footer-08-grid { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 768px) {
  .nav-links-08 { display: none; }
  .feat-grid-08, .stats-08-grid, .roadmap-grid-08, .footer-08-grid { grid-template-columns: 1fr; }
  .stat-08-item { border-left: none; border-top: var(--glass-border); padding-top: 20px; }
}

/* Premium Form Styles */
.premium-form { display: flex; flex-direction: column; gap: 18px; width: 100%; }
.premium-form input, .premium-form textarea, .premium-form select {
    width: 100%; padding: 16px 20px; border-radius: 10px; border: var(--glass-border);
    background: var(--bg-panel); color: var(--text-main); font-family: 'Rajdhani', sans-serif;
    font-size: 15px; outline: none; transition: 0.3s all; font-weight: 600;
}
.premium-form input::placeholder { color: var(--text-muted); }
.premium-form input:focus { border-color: var(--primary); box-shadow: 0 0 0 4px color-mix(in srgb, var(--primary) 15%, transparent); }
.premium-form button {
    padding: 17px; border-radius: 10px; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;
    cursor: pointer; transition: 0.3s; background: linear-gradient(90deg, var(--primary), var(--secondary)); color: #06040F; border: none;
    box-shadow: var(--glow-primary);
}
.premium-form button:hover { transform: translateY(-2px); }
`;

export const plumber08Html = `
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700;800;900&family=Rajdhani:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">

<!-- 1. Nav -->
<header class="header-08">
  <div class="container nav-08-inner">
    <div class="logo-08">LOGO_PLACEHOLDER</div>
    <nav class="nav-links-08">
      <a href="#features">Trade</a>
      <a href="#swap">Swap</a>
      <a href="#network">Network</a>
      <a href="#roadmap">Roadmap</a>
    </nav>
    <a href="#" class="btn-08">Launch Exchange</a>
  </div>
</header>

<main>
  <!-- 2. Hero -->
  <section class="hero-08">
    <div class="hero-08-glow"></div>
    <svg class="node-canvas" viewBox="0 0 1280 800" xmlns="http://www.w3.org/2000/svg">
      <g stroke="rgba(140,135,179,0.25)" stroke-width="1">
        <line x1="180" y1="140" x2="420" y2="260"/>
        <line x1="420" y1="260" x2="700" y2="180"/>
        <line x1="700" y1="180" x2="980" y2="300"/>
        <line x1="420" y1="260" x2="380" y2="480"/>
        <line x1="700" y1="180" x2="820" y2="480"/>
        <line x1="980" y1="300" x2="1100" y2="560"/>
        <line x1="380" y1="480" x2="600" y2="620"/>
        <line x1="820" y1="480" x2="600" y2="620"/>
      </g>
      <g fill="var(--primary)" opacity="0.7">
        <circle cx="180" cy="140" r="4"/><circle cx="420" cy="260" r="5"/><circle cx="700" cy="180" r="4"/>
        <circle cx="980" cy="300" r="5"/><circle cx="380" cy="480" r="4"/><circle cx="820" cy="480" r="4"/>
        <circle cx="1100" cy="560" r="4"/><circle cx="600" cy="620" r="5"/>
      </g>
    </svg>
    <div class="hero-08-content container">
      <h1>Trade Every Asset, <span>On One Network.</span></h1>
      <p>A unified exchange connecting spot, futures, and cross-chain liquidity into a single execution layer built for speed.</p>
      <div class="hero-btns-08">
        <a href="#" class="btn-08">Launch Exchange</a>
        <a href="#" class="btn-08-alt">Read Documentation</a>
      </div>
    </div>
  </section>

  <!-- 3. Ticker -->
  <div class="ticker-08">
    <div class="ticker-track-08">
      <div class="tick-item-08">BTC $64,230.12 <span class="up"><i class="fa-solid fa-caret-up"></i> 2.4%</span></div>
      <div class="tick-item-08">ETH $3,450.88 <span class="down"><i class="fa-solid fa-caret-down"></i> 1.2%</span></div>
      <div class="tick-item-08">SOL $145.60 <span class="up"><i class="fa-solid fa-caret-up"></i> 5.6%</span></div>
      <div class="tick-item-08">XNET $2.14 <span class="up"><i class="fa-solid fa-caret-up"></i> 14.2%</span></div>
      <div class="tick-item-08">BTC $64,230.12 <span class="up"><i class="fa-solid fa-caret-up"></i> 2.4%</span></div>
      <div class="tick-item-08">ETH $3,450.88 <span class="down"><i class="fa-solid fa-caret-down"></i> 1.2%</span></div>
      <div class="tick-item-08">SOL $145.60 <span class="up"><i class="fa-solid fa-caret-up"></i> 5.6%</span></div>
      <div class="tick-item-08">XNET $2.14 <span class="up"><i class="fa-solid fa-caret-up"></i> 14.2%</span></div>
    </div>
  </div>

  <!-- 4. Features -->
  <section class="features-08" id="features">
    <div class="container">
      <h2>One Network, Every Rail</h2>
      <div class="feat-grid-08">
        <div class="feat-card-08">
          <div class="feat-icon-08"><i class="fa-solid fa-network-wired"></i></div>
          <h3>Unified Liquidity</h3>
          <p>Spot, futures, and cross-chain liquidity pooled into a single order book.</p>
        </div>
        <div class="feat-card-08">
          <div class="feat-icon-08"><i class="fa-solid fa-bridge"></i></div>
          <h3>Native Bridging</h3>
          <p>Move assets across 12 chains without leaving the exchange interface.</p>
        </div>
        <div class="feat-card-08">
          <div class="feat-icon-08"><i class="fa-solid fa-gauge-high"></i></div>
          <h3>Sub-Second Settlement</h3>
          <p>Optimistic settlement layer confirms trades before the block finalizes.</p>
        </div>
        <div class="feat-card-08">
          <div class="feat-icon-08"><i class="fa-solid fa-code-branch"></i></div>
          <h3>Open API</h3>
          <p>Full REST and WebSocket access for bots, dashboards, and integrations.</p>
        </div>
        <div class="feat-card-08">
          <div class="feat-icon-08"><i class="fa-solid fa-vault"></i></div>
          <h3>Insured Custody</h3>
          <p>Assets held in multi-sig cold storage, insured against custodial loss.</p>
        </div>
        <div class="feat-card-08">
          <div class="feat-icon-08"><i class="fa-solid fa-landmark"></i></div>
          <h3>DAO Governed</h3>
          <p>Fee structures and listings decided by $XNET token holders.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- 5. Swap mock -->
  <section class="swap-08" id="swap">
    <div class="container swap-08-grid">
      <div>
        <h2>Swap Instantly</h2>
        <p>Best-price routing across every connected liquidity pool, executed in one click.</p>
        <div class="hero-btns-08" style="justify-content:flex-start;">
          <a href="#" class="btn-08">Open Swap</a>
        </div>
      </div>
      <div class="swap-panel">
        <div class="swap-row"><span class="amt">1.245</span><span class="cur">ETH</span></div>
        <div class="swap-arrow-08"><i class="fa-solid fa-arrow-down"></i></div>
        <div class="swap-row"><span class="amt">4,294.62</span><span class="cur">USDC</span></div>
      </div>
    </div>
  </section>

  <!-- 6. Network -->
  <section class="network-08" id="network">
    <div class="container">
      <h2>Connected Networks</h2>
      <div class="net-badges-08">
        <div class="net-badge-08"><i class="fa-brands fa-ethereum"></i> <h4>Ethereum</h4></div>
        <div class="net-badge-08"><i class="fa-solid fa-sun"></i> <h4>Solana</h4></div>
        <div class="net-badge-08"><i class="fa-solid fa-cube"></i> <h4>Arbitrum</h4></div>
        <div class="net-badge-08"><i class="fa-solid fa-atom"></i> <h4>Cosmos</h4></div>
        <div class="net-badge-08"><i class="fa-solid fa-hexagon-nodes"></i> <h4>Polygon</h4></div>
      </div>
    </div>
  </section>

  <!-- 7. Stats -->
  <section class="stats-08">
    <div class="container stats-08-grid">
      <div class="stat-08-item"><div class="stat-08-val">$12.4B</div><div class="stat-08-label">24h Volume</div></div>
      <div class="stat-08-item"><div class="stat-08-val">2.1M</div><div class="stat-08-label">Active Traders</div></div>
      <div class="stat-08-item"><div class="stat-08-val">12</div><div class="stat-08-label">Networks Connected</div></div>
      <div class="stat-08-item"><div class="stat-08-val">0.03s</div><div class="stat-08-label">Avg. Settlement</div></div>
    </div>
  </section>

  <!-- 8. Roadmap -->
  <section class="roadmap-08" id="roadmap">
    <div class="container">
      <h2>Network Roadmap</h2>
      <div class="roadmap-grid-08">
        <div class="phase-08 active">
          <h4>Phase 01</h4>
          <h3>Unified Order Book</h3>
          <p>Merge spot and futures liquidity into a single matching engine.</p>
        </div>
        <div class="phase-08 active">
          <h4>Phase 02</h4>
          <h3>Cross-Chain Swap</h3>
          <p>Native bridging live across 12 supported networks.</p>
        </div>
        <div class="phase-08">
          <h4>Phase 03</h4>
          <h3>Derivatives Suite</h3>
          <p>Perpetuals and options trading with cross-margin support.</p>
        </div>
        <div class="phase-08">
          <h4>Phase 04</h4>
          <h3>Full DAO Handover</h3>
          <p>Protocol parameters transitioned entirely to token holder governance.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- 9. Join -->
  <section class="join-08">
    <div class="container join-08-inner">
      <h2>Get Early Access</h2>
      <p>Join the waitlist for derivatives trading and get priority onboarding.</p>
      <form class="premium-form" onsubmit="event.preventDefault();">
        <input type="text" placeholder="Full Name" required>
        <input type="email" placeholder="Email Address" required>
        <input type="text" placeholder="Wallet Address (optional)">
        <button type="submit">Join Waitlist</button>
      </form>
    </div>
  </section>
</main>

<!-- 10. Footer -->
<footer class="footer-08">
  <div class="container">
    <div class="footer-08-grid">
      <div>
        <div class="logo-08" style="margin-bottom: 20px;">LOGO_PLACEHOLDER</div>
        <p style="color: var(--text-muted); font-size: 14px;">The unified execution layer for on-chain and off-chain markets.</p>
        <div class="social-08">
          <a href="#"><i class="fa-brands fa-twitter"></i></a>
          <a href="#"><i class="fa-brands fa-discord"></i></a>
          <a href="#"><i class="fa-brands fa-telegram"></i></a>
          <a href="#"><i class="fa-brands fa-github"></i></a>
        </div>
      </div>
      <div class="footer-links-08">
        <h4>Product</h4>
        <a href="#">Exchange</a>
        <a href="#">Swap</a>
        <a href="#">API</a>
      </div>
      <div class="footer-links-08">
        <h4>Company</h4>
        <a href="#">About</a>
        <a href="#">Careers</a>
      </div>
      <div class="footer-links-08">
        <h4>Resources</h4>
        <a href="#">Docs</a>
        <a href="#">Status</a>
      </div>
    </div>
    <div class="footer-08-bottom">
      <span>&copy; 2026 XNET Network. All rights reserved.</span>
      <span>Digital asset trading involves risk.</span>
    </div>
  </div>
</footer>

<script id="core-interactions">
  (function() {
    var isInEditor = !!document.querySelector('[data-gjs-type]') || document.body.classList.contains('gjs-dashed');
    document.addEventListener('submit', function(e) {
      if (e.target.tagName === 'FORM') {
        e.preventDefault();
        if (isInEditor) {
          e.stopImmediatePropagation();
          var existingModal = document.getElementById("preview-mode-modal");
          if (existingModal) existingModal.remove();
          var modalHtml = '<div id="preview-mode-modal" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 999999; display: flex; align-items: center; justify-content: center; background: rgba(6,5,18,0.75); backdrop-filter: blur(10px); opacity: 0; animation: pModalFadeIn 0.3s forwards; font-family: system-ui, -apple-system, sans-serif;"><div style="background: #0D0B1F; border: 1px solid rgba(255,255,255,0.1); width: 90%; max-width: 400px; border-radius: 18px; padding: 32px; text-align: center; transform: scale(0.95); animation: pModalScaleUp 0.3s forwards;"><div style="width: 60px; height: 60px; background: rgba(255,64,129,0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;"><svg style="width: 30px; height: 30px; color: var(--secondary);" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg></div><h3 style="font-size: 16px; font-weight: 800; color: var(--text-main); margin: 0 0 12px; font-family: Orbitron, sans-serif; text-transform: uppercase;">Preview Mode Active</h3><p style="font-size: 14px; color: #8C87B3; margin: 0 0 28px; line-height: 1.5;">Form submissions are disabled in preview mode. Publish your page to accept real submissions.</p><button onclick="document.getElementById(\\'preview-mode-modal\\').remove()" style="width: 100%; background: linear-gradient(90deg, var(--primary), var(--secondary)); color: #06040F; border: none; padding: 14px; border-radius: 10px; font-size: 14px; font-weight: 700; text-transform: uppercase; cursor: pointer;">Got it, close</button></div><style>@keyframes pModalFadeIn { to { opacity: 1; } } @keyframes pModalScaleUp { to { transform: scale(1); } }</style></div>';
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
                input.style.borderColor = 'var(--primary)';
                if (input.nextElementSibling && input.nextElementSibling.classList.contains('val-error')) {
                  input.nextElementSibling.style.display = 'none';
                }
              } else {
                input.style.borderColor = 'var(--secondary)';
                if (input.nextElementSibling && input.nextElementSibling.classList.contains('val-error')) {
                  input.nextElementSibling.style.display = 'block';
                }
              }
            });
          }

          if (!input.value.trim() && input.hasAttribute('required')) {
            isValid = false;
            input.style.borderColor = 'var(--secondary)';

            if (!input.parentElement.classList.contains('val-wrapper')) {
                var wrapper = document.createElement('div');
                wrapper.className = 'val-wrapper';
                wrapper.style.display = 'flex';
                wrapper.style.flexDirection = 'column';
                wrapper.style.width = '100%';
                input.parentNode.insertBefore(wrapper, input);
                wrapper.appendChild(input);
            }

            if (!input.nextElementSibling || !input.nextElementSibling.classList.contains('val-error')) {
              var fieldName = input.getAttribute('placeholder') || input.getAttribute('name') || 'This field';
              var err = document.createElement('span');
              err.className = 'val-error';
              err.style.color = 'var(--secondary)';
              err.style.fontSize = '12px';
              err.style.display = 'block';
              err.style.marginTop = '4px';
              err.style.fontWeight = '600';
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
          var btn = e.target.querySelector('button[type="submit"]');
          if (btn) { btn.innerHTML = 'Sending...'; }
          setTimeout(function() {
            e.target.innerHTML = '<div style="padding: 20px; text-align: center; color: var(--primary); border: 1px solid var(--primary); border-radius: 12px;"><h3 style="margin: 0 0 10px 0; font-size: 16px; font-family: Orbitron, sans-serif; text-transform: uppercase;">You\\'re On The List</h3><p style="margin: 0; text-transform: none;">We\\'ll email you when access opens.</p></div>';
          }, 1000);
        }
      }
    }, true);
  })();
</script>
`;