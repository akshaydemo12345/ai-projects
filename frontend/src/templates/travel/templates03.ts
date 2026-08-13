// Auto-generated ULTRA-DYNAMIC template
// Generated: 2026-07-02T05:58:29.037Z
// ════════════════════════════════════════════════════════════════════════════
// Converted directly in the browser using Frontend JSZip Extraction
// ════════════════════════════════════════════════════════════════════════════

export const travel03Styles = `
/* ==== Design Tokens (replace *_PLACEHOLDER with your brand hex) ==== */
:root{
  --primary: PRIMARY_COLOR_PLACEHOLDER;
  --secondary: SECONDARY_COLOR_PLACEHOLDER;
  --accent: SECONDARY_COLOR_PLACEHOLDER;
  --dark: #0B1120;
  --light: #f8fafc;
  --gray: #64748b;
  --border: #e2e8f0;

  --radius: 18px;
  --radius-lg: 28px;
  --shadow-sm: 0 4px 14px rgba(11,17,32,.06);
  --shadow: 0 20px 60px -20px rgba(11,17,32,.18);
  --font-display: "Bricolage Grotesque", serif;
  --font-body: "Inter", sans-serif;
}

*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{
  font-family:var(--font-body);
  color:var(--dark);
  background:var(--light);
  line-height:1.55;
  overflow-x:hidden;
}
img{max-width:100%;display:block}
a{text-decoration:none;color:inherit;cursor:pointer}
button{cursor:pointer;font:inherit;border:none;background:none}

.container{max-width:1200px;margin:0 auto;padding:0 20px}
h1,h2,h3,h4{font-family:var(--font-display);font-weight:800;letter-spacing:-.02em;line-height:1.1;color:var(--dark)}
h1{font-size:clamp(3.2rem,6vw,4.8rem);}
h2{font-size:clamp(2.2rem,4vw,3.2rem); font-weight: 700;letter-spacing: -.02em;line-height: 1.1;}
h3{font-size:1.8rem}
h4{font-size:1.4rem}
p{color:#475569}

.btn{display:inline-flex;align-items:center;gap:8px;padding:14px 22px;border-radius:999px;font-weight:600;font-size:.95rem;transition:.25s;white-space:nowrap}
.btn-primary{background:var(--primary);color:#fff;box-shadow:0 10px 25px -8px var(--primary)}
.btn-primary:hover{background:var(--secondary);transform:translateY(-2px)}
.btn.sm{padding:10px 16px;font-size:.85rem}

.eyebrow{display:inline-block;color:var(--gray);letter-spacing:.15em;font-size:.75rem;font-weight:600;text-transform:uppercase;margin-bottom:10px}

/* ==== Announcement bar ==== */
.announce{background:var(--dark);color:#fff;overflow:hidden;padding:10px 0;font-size:.85rem}
.marquee{display:flex;gap:60px;white-space:nowrap;animation:marq 30s linear infinite}
.marquee span{display:inline-flex;align-items:center;gap:8px}
@keyframes marq{to{transform:translateX(-50%)}}

/* ==== Nav ==== */
.nav{position:sticky;top:0;background:rgba(248,250,252,.85);backdrop-filter:blur(14px);z-index:50;border-bottom:1px solid transparent;transition:.3s}
.nav.scrolled{box-shadow:var(--shadow-sm);border-bottom-color:var(--border)}
.nav-inner{display:flex;align-items:center;justify-content:space-between;gap:20px;padding:16px 20px}
.logo{font-family:var(--font-display);font-weight:800;font-size:1.4rem;display:inline-flex;align-items:center;gap:6px}
.logo i{color:var(--primary)}
.logo.light{color:#fff}

.nav-links a::after{content:"";position:absolute;left:0;bottom:0;height:2px;width:0;background:var(--primary);transition:.3s}
.hamburger{display:none;font-size:1.3rem}

/* ==== Hero ==== */
.hero{position:relative;padding:70px 0 90px;overflow:hidden}
.hero-grid{display:grid;grid-template-columns:1.05fr 1fr;gap:60px;align-items:center}
.hero h1{margin-bottom:20px; font-size: clamp(2.2rem, 5vw, 4rem); font-weight: 700;letter-spacing: -.02em;line-height: 1.1; position: relative; z-index: 1; display: inline-block;}
.hero h1::after { content: ""; position: absolute; left: 0; bottom: -8px; width: 100%; height: 12px; background-color: var(--primary); -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 10' preserveAspectRatio='none'%3E%3Cpath d='M0 5 Q 25 0 50 5 T 100 5' stroke='black' stroke-width='2' fill='none'/%3E%3C/svg%3E") center/cover; mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 10' preserveAspectRatio='none'%3E%3Cpath d='M0 5 Q 25 0 50 5 T 100 5' stroke='black' stroke-width='2' fill='none'/%3E%3C/svg%3E") center/cover; }
.lead{max-width:440px;margin-bottom:30px}
.hero-cta{display:flex;align-items:center;gap:26px;margin-bottom:44px;flex-wrap:wrap}
.watch{display:flex;align-items:center;gap:12px;font-size:.9rem}
.watch .play{width:44px;height:44px;border-radius:50%;background:var(--dark);color:#fff;display:grid;place-items:center;transition:.3s}
.watch:hover .play{background:var(--secondary);transform:scale(1.08)}
.hero-stats{display:flex;align-items:center;gap:18px;flex-wrap:wrap}
.avatars{display:flex;align-items:center}
.avatars .a{width:36px;height:36px;border-radius:50%;border:2px solid #fff;margin-left:-10px;object-fit:cover;background:#e2e8f0;position:relative;z-index:2}
.avatars .a:first-child{margin-left:0}
.avatars .a-count{margin-left:-6px;background:#fff;border:2px solid #fff;padding:4px 10px;border-radius:999px;font-size:.8rem;font-weight:700;box-shadow:var(--shadow-sm);position:relative;z-index:3}
.stat-text{font-size:.9rem;color:var(--gray)}
.stat-text b{color:var(--dark)}

.hero-person{position:relative;aspect-ratio:1/1.05;display:grid;place-items:center}
.hero-person::before{content:"";position:absolute;top:50%;left:50%;width:70%;height:70%;background:var(--primary);filter:blur(100px);transform:translate(-50%,-50%);z-index:0;opacity:0.6;pointer-events:none}
.hero-blob{position:absolute;inset:6% 8% 8% 6%;background:var(--secondary);border-radius:32px;transform:rotate(-3deg);z-index:1}
.hero-person img{border-radius: 25px; position:relative;z-index:2;max-width:100%;max-height:70%; object-fit:contain;filter:drop-shadow(0 30px 40px rgba(0,0,0,.25))}
.badge{position:absolute;background:#fff;border-radius:14px;padding:10px 14px;box-shadow:var(--shadow);z-index:3;font-size:.8rem;display:flex;align-items:center;gap:8px;animation:float 4s ease-in-out infinite}
.badge-live{top:12%;left:-4%;color:#ef4444;font-weight:700}
.badge-live .dot{width:8px;height:8px;background:#ef4444;border-radius:50%;box-shadow:0 0 0 6px rgba(239,68,68,.15);animation:pulse 1.5s infinite}
.badge-support{top:18%;right:-6%;flex-direction:column;align-items:flex-start;text-align:left;animation-delay:.6s}
.badge-support b{color:var(--secondary);font-size:1.05rem}
.badge-support span{color:var(--gray);font-size:.72rem}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
@keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(239,68,68,.4)}50%{box-shadow:0 0 0 10px rgba(239,68,68,0)}}

.deco{position:absolute;color:var(--primary);opacity:.85;font-size:1.4rem;z-index:1}
.cloud-1{top:6%;left:2%;color:#cbd5e1;font-size:2rem;animation:float 5s ease-in-out infinite}
.balloon{top:2%;right:38%;color:SECONDARY_COLOR_PLACEHOLDER;font-size:1.6rem;animation:float 6s ease-in-out infinite}
.compass{bottom:8%;right:-2%;font-size:2rem;color:var(--dark);animation:spin 20s linear infinite}
.plane{top:6%;right:8%;color:var(--primary);font-size:1.4rem;transform:rotate(-30deg)}
.dots{width:60px;height:60px;top:35%;right:2%;background:radial-gradient(circle,var(--primary) 1.5px,transparent 2px);background-size:10px 10px}
@keyframes spin{to{transform:rotate(360deg)}}

/* ==== Companion banner ==== */
.companion{padding:20px 0 40px}
.companion-card{position:relative;background:var(--secondary);border-radius:var(--radius-lg);padding:30px 40px;display:grid;grid-template-columns:1fr 2fr 1fr;align-items:center;overflow:hidden;color:#fff;min-height:220px}
.companion-card::before{content:"";position:absolute;inset:0;background:radial-gradient(600px 200px at 50% 120%,rgba(255,255,255,.15),transparent)}
.c-left,.c-right{max-height:280px;margin-top:-40px;position:relative;z-index:2}
.c-center{text-align:center;position:relative;z-index:2}
.c-center h3{color:#fff;font-size:1.4rem;max-width:340px;margin:12px auto 0}
.play-big{width:56px;height:56px;background:var(--primary);border-radius:50%;display:grid;place-items:center;margin:0 auto;color:#fff;box-shadow:0 10px 30px rgba(0,0,0,.3);cursor:pointer;transition:.3s}
.play-big:hover{transform:scale(1.1)}
.plane-2{position:absolute;top:10px;right:20%;color:#fff;opacity:.4;font-size:2rem;animation:float 5s ease-in-out infinite}

/* ==== Sections ==== */
.section{padding:80px 0}
.sec-head{display:flex;justify-content:space-between;align-items:end;margin-bottom:40px;flex-wrap:wrap;gap:20px}
.sec-head.center{flex-direction:column;align-items:center;text-align:center}
.arrows{display:flex;gap:10px}
.rbtn{width:44px;height:44px;border-radius:50%;border:1px solid var(--border);background:#fff;color:var(--dark);transition:.25s}
.rbtn:hover,.rbtn.active{background:var(--secondary);color:#fff;border-color:var(--secondary)}

.dest{position:relative;display:block;width:100%;border-radius:var(--radius);overflow:hidden;aspect-ratio:1/1.15;box-shadow:var(--shadow-sm);transition:.4s}
.dest:hover{transform:translateY(-6px);box-shadow:var(--shadow)}
.dest img{width:100%;height:100%;object-fit:cover;transition:.6s}
.dest:hover img{transform:scale(1.08)}
.pin{position:absolute;top:14px;left:14px;background:#fff;border-radius:999px;padding:6px 12px;font-size:.75rem;font-weight:600;box-shadow:var(--shadow-sm);display:inline-flex;gap:6px;align-items:center}
.pin i{color:var(--primary)}
.pin.sm{font-size:.65rem;padding:4px 8px}

/* ==== Split app section ==== */
.split-grid{display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center}
.split-left{position:relative;height:440px}
.weather-card{position:absolute;top:0;left:10%;background:#fff;border-radius:20px;padding:16px 20px;box-shadow:var(--shadow);display:flex;gap:20px;align-items:center;z-index:3;flex-wrap:wrap}
.weather-card .temp{font-family:var(--font-display);font-size:2rem;font-weight:700}
.weather-card .temp span{font-size:1rem;color:var(--gray)}
.weather-card ul{list-style:none;font-size:.8rem}
.weather-card li{display:flex;justify-content:space-between;gap:16px;color:var(--gray)}
.weather-card li b{color:var(--dark)}
.mini-card{position:absolute;background:#fff;border-radius:16px;overflow:hidden;box-shadow:var(--shadow);width:180px}
.mini-card img{width:100%;height:100px;object-fit:cover}
.mini-card div{padding:10px 12px}
.mini-card b{display:block;font-size:.9rem}
.mini-card small{color:var(--gray);font-size:.7rem}
.mc1{top:120px;left:0;animation:float 6s ease-in-out infinite}
.mc2{top:180px;right:10%;animation:float 6s ease-in-out infinite;animation-delay:1s}
.stat-tiles{position:absolute;bottom:0;left:5%;right:15%;background:#fff;border-radius:20px;padding:16px;display:grid;grid-template-columns:repeat(3,1fr);gap:10px;box-shadow:var(--shadow);text-align:center}
.stat-tiles div{padding:6px}
.stat-tiles i{color:var(--primary);font-size:1.1rem;margin-bottom:4px}
.stat-tiles b{display:block;font-size:.9rem}
.stat-tiles span{font-size:.7rem;color:var(--gray)}
.balloon-2{top:-10px;left:-5%;color:SECONDARY_COLOR_PLACEHOLDER;font-size:1.5rem;animation:float 5s ease-in-out infinite}

.stores{display:flex;gap:12px;margin-top:24px;flex-wrap:wrap}
.store{display:inline-flex;align-items:center;gap:10px;background:#fff;border:1px solid var(--border);padding:10px 16px;border-radius:12px;transition:.25s;font-size:.75rem;color:var(--gray)}
.store b{color:var(--dark);font-size:.9rem}
.store i{font-size:1.5rem;color:var(--dark)}
.store:hover{border-color:var(--secondary);transform:translateY(-2px)}

/* ==== Deal banner ==== */
.deal-banner{position:relative;background:var(--secondary);border-radius:var(--radius-lg);padding:50px 40px;color:#fff;display:grid;grid-template-columns:1fr 1fr 1fr;align-items:center;overflow:hidden;min-height:220px}
.deal-banner::before{content:"";position:absolute;inset:0;background:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 100'><path d='M10 60 Q 50 20 90 60 T 190 60' stroke='rgba(255,255,255,.1)' stroke-width='1' fill='none' stroke-dasharray='4 4'/></svg>") repeat;opacity:.5}
.d-left h2{color:#fff;margin-top:16px}
.ital{font-style:italic;color:#fbbf24}
.pill-btn{display:inline-flex;align-items:center;gap:6px;background:#fff;color:var(--dark);padding:8px 16px;border-radius:999px;font-weight:600;font-size:.85rem;transition:.25s}
.pill-btn:hover{background:var(--secondary);color:#fff}
.plane-3{position:relative;height:120px;display:grid;place-items:center}
.plane-3::before{content:"✈";font-size:4rem;color:var(--primary);transform:rotate(-25deg);position:absolute}
.ribbon{position:absolute;background:var(--primary);color:#fff;padding:8px 40px;font-weight:800;letter-spacing:.1em;transform:rotate(-15deg);box-shadow:0 8px 20px rgba(0,0,0,.3);font-size:1.1rem;top:40px}
.d-right{text-align:right;font-size:.85rem}
.d-right b{display:block;background:#fff;color:var(--dark);padding:6px 14px;border-radius:6px;margin-top:6px;font-weight:800;letter-spacing:.1em}
.deco.ticket{top:20px;left:20px;color:#fff;opacity:.4;font-size:2rem}
.deco.suitcase{bottom:20px;right:20px;color:#fff;opacity:.4;font-size:2rem}

/* ==== Features ==== */
.features-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
.feat{background:#fff;border:1px solid var(--border);border-radius:var(--radius);padding:28px;transition:.3s;position:relative;overflow:hidden}
.feat::before{content:"";position:absolute;inset:auto -30% -60% auto;width:120px;height:120px;background:var(--primary);border-radius:50%;opacity:0;transition:.4s}
.feat:hover{transform:translateY(-6px);box-shadow:var(--shadow);border-color:transparent}
.feat:hover::before{opacity:.08}
.feat i{width:52px;height:52px;background:color-mix(in oklab,var(--primary) 15%,white);color:var(--primary);border-radius:14px;display:grid;place-items:center;font-size:1.3rem;margin-bottom:16px;transition:.3s}
.feat:hover i{background:var(--secondary);color:#fff;transform:rotate(-8deg) scale(1.05)}
.feat h4{margin-bottom:8px;font-size:1.1rem}
.feat p{font-size:.9rem}

/* ==== Testimonial ==== */
.testi{background:#eef2ff;border-radius:var(--radius-lg);padding:50px;display:grid;grid-template-columns:1fr 1.5fr;gap:40px;align-items:center;position:relative;overflow:hidden}
.circle-collage{position:relative;height:260px}
.c{position:absolute;border-radius:50%;background:linear-gradient(135deg,#60a5fa,PRIMARY_COLOR_PLACEHOLDER);overflow:hidden}
.c1{width:160px;height:160px;top:0;left:20%}
.c2{width:110px;height:110px;bottom:10px;right:10%}
.c3{width:90px;height:90px;bottom:40px;left:0}
.c .pin{top:6px;left:6px}
.pp{position:absolute;top:30px;right:10%;font-size:1.6rem;color:var(--primary);transform:rotate(-20deg)}
.qq{font-size:2.5rem;color:var(--primary);opacity:.3;margin-bottom:15px;display:block}
.t-right{min-width:0;width:100%;overflow:hidden}
.t-right p{font-size:1.15rem;color:var(--dark);line-height:1.6;margin-bottom:24px}
.t-authors{display:flex;justify-content:flex-start;align-items:center;flex-wrap:wrap;gap:15px}

/* ==== New-design testimonial slider (editor-native swiper) ==== */
.new-design-slider { padding-bottom: 80px !important; overflow: hidden !important; width: 100%; position: relative; }
.new-design-slider .swiper-slide{ padding: 6px 2px 20px; width: 100%; flex-shrink: 0; }
.testi-nav-row{ position: absolute; bottom: 20px; right: 0; width: calc(50% - 25px); display:flex; gap:15px; z-index: 10; justify-content: flex-start; }
@media (max-width: 768px) { .testi-nav-row { width: 100%; justify-content: center; } }
.testi-nav-btn{ width:70px !important; height:45px !important; border-radius:25px !important; border:1px solid #f1f5f9 !important; display:flex !important; align-items:center !important; justify-content:center !important; cursor:pointer; color:var(--primary) !important; transition:.3s; background:#fff !important; position: static !important; margin: 0 !important; box-shadow: 0 4px 10px rgba(0,0,0,0.03); }
.testi-nav-btn:hover{ background:var(--primary) !important; color:#fff !important; border-color:var(--primary) !important; box-shadow: 0 6px 15px rgba(0,0,0,0.1); }
.testi-nav-btn i { font-size: 1.1rem; }
.testi-nav-btn::after { display: none !important; }
.new-design-slider .swiper-pagination{ position:static; margin-top:20px; display: none; }

/* ==== Brands ==== */
.brands{padding:30px 0;border-top:1px solid var(--border);border-bottom:1px solid var(--border)}
.brands-row{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:20px;color:var(--gray);font-weight:700;font-size:1.1rem;font-family:var(--font-display)}
.brands-row span{opacity:.6;transition:.25s}
.brands-row span:hover{opacity:1;color:var(--dark)}

/* ==== Explore grid ==== */
.explore-grid{display:grid;grid-template-columns:1.5fr 1fr 1fr;gap:20px}
.ex-big{background:#f5f3ee;border-radius:var(--radius);padding:24px;position:relative;overflow:hidden;min-height:340px;display:flex;align-items:flex-end}
.ex-big img{position:absolute;top:0;right:0;height:100%;width:auto;object-fit:contain}
.ex-caption{position:relative;z-index:2;background:#fff;border-radius:12px;padding:16px;display:flex;justify-content:space-between;align-items:center;gap:16px;width:80%;flex-wrap:wrap}
.ex-caption small{color:var(--gray);font-size:.75rem;display:block}
.ex-caption b{font-family:var(--font-display);font-size:1.1rem}
.ex-col{display:flex;flex-direction:column;gap:20px}
.ex-card{border-radius:var(--radius);padding:24px;flex:1;transition:.3s;position:relative}
.ex-card:hover{transform:translateY(-4px);box-shadow:var(--shadow)}
.ex-card.blue{background:#e0f2fe}
.ex-card.green{background:#dcfce7}
.ex-card.beige{background:#fef3c7;min-height:340px}
.ex-card h4{margin-bottom:8px;font-size:1.05rem;display:flex;justify-content:space-between}
.ex-card p{font-size:.85rem}
.live-badge{display:inline-flex;align-items:center;gap:6px;background:#fff;padding:6px 12px;border-radius:999px;font-size:.7rem;font-weight:700;color:#ef4444;margin:12px 0}
.live-badge .dot{width:6px;height:6px;background:#ef4444;border-radius:50%;animation:pulse 1.5s infinite}

/* ==== Creative Booking Form ==== */
.booking-section { padding: 100px 0; background: var(--dark); color: #fff; position: relative; overflow: hidden; }
.booking-section::before { content: ""; position: absolute; top: -50%; left: -20%; width: 600px; height: 600px; background: radial-gradient(circle, var(--primary), transparent 70%); opacity: 0.15; pointer-events: none; }
.booking-grid { display: grid; grid-template-columns: 1fr 1.2fr; gap: 60px; align-items: center; }
.booking-info h2 { color: #fff; font-size: clamp(2rem, 4vw, 3rem); margin-bottom: 20px; }
.booking-info p { color: #cbd5e1; font-size: 1.1rem; margin-bottom: 40px; }
.booking-features { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
.b-feat { display: flex; align-items: flex-start; gap: 16px; }
.b-feat i { background: rgba(255, 255, 255, 0.1); width: 44px; height: 44px; border-radius: 12px; display: grid; place-items: center; color: var(--primary); font-size: 1.2rem; }
.b-feat b { display: block; color: #fff; margin-bottom: 4px; font-family: var(--font-display); }
.b-feat span { color: #94a3b8; font-size: .85rem; }

.creative-form { background: #fff; border-radius: var(--radius-lg); padding: 40px; box-shadow: var(--shadow); position: relative; }
.creative-form::after { content: ""; position: absolute; inset: -4px; background: linear-gradient(135deg, var(--primary), var(--secondary)); border-radius: calc(var(--radius-lg) + 2px); z-index: -1; opacity: 0.5; }
.cf-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px; }
.cf-full { grid-column: 1 / -1; }
.cf-group { display: flex; flex-direction: column; gap: 8px; }
.cf-group label { font-size: .8rem; font-weight: 700; color: var(--gray); text-transform: uppercase; letter-spacing: .05em; }
.cf-group input, .cf-group select, .cf-group textarea { background: var(--light); border: 1px solid var(--border); padding: 14px 18px; border-radius: 12px; font-family: inherit; font-size: .95rem; color: var(--dark); outline: none; transition: .3s; }
.cf-group input:focus, .cf-group select:focus, .cf-group textarea:focus { background: #fff; border-color: var(--primary); box-shadow: 0 0 0 4px color-mix(in oklab, var(--primary) 15%, transparent); }
.cf-group textarea { resize: vertical; min-height: 100px; }
.creative-form .btn-primary { width: 100%; justify-content: center; padding: 18px; font-size: 1.05rem; border-radius: 14px; }

@media(max-width:900px){
  .booking-grid { grid-template-columns: 1fr; }
  .cf-grid { grid-template-columns: 1fr; }
}

/* ==== FAQ + CTA ==== */
.faq-grid{display:grid;grid-template-columns:1fr 1fr;gap:40px;align-items:start}
.acc{margin-top:20px}
.acc details{border-bottom:1px solid var(--border);padding:16px 0}
.acc summary{list-style:none;display:flex;justify-content:space-between;align-items:center;font-weight:600;cursor:pointer;font-size:1rem}
.acc summary::-webkit-details-marker{display:none}
.acc summary i{transition:.3s;color:var(--primary)}
.acc details[open] summary i{transform:rotate(45deg)}
.acc p{padding-top:10px;color:var(--gray);font-size:.9rem}

.cta{position:sticky;top:100px}
.cta-inner{background:var(--dark);color:#fff;border-radius:var(--radius-lg);padding:40px;position:relative;overflow:hidden}
.cta-inner::before{content:"";position:absolute;top:-50%;right:-30%;width:400px;height:400px;background:radial-gradient(circle,var(--primary),transparent 70%);opacity:.3}
.cta-inner h3{color:#fff;font-size:1.6rem;margin-bottom:8px;position:relative}
.cta-inner p{color:#cbd5e1;margin-bottom:24px;position:relative}
.cta-form{display:flex;gap:8px;background:#fff;padding:6px;border-radius:999px;position:relative;margin-bottom:24px}
.cta-form input{flex:1;border:none;outline:none;padding:8px 16px;font-family:inherit;background:transparent;color:var(--dark)}
.cta-mini{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;position:relative;text-align:center}
.cta-mini b{display:block;font-family:var(--font-display);font-size:1.4rem;color:var(--primary)}
.cta-mini span{font-size:.75rem;color:#cbd5e1}

/* ==== Footer ==== */
.footer{background:var(--dark);color:#cbd5e1;padding:60px 0 24px;margin-top:40px}
.foot-top{display:flex;justify-content:space-between;align-items:center;gap:20px;padding-bottom:30px;border-bottom:1px solid rgba(255,255,255,.08);flex-wrap:wrap}
.foot-title{color:#fff;font-family:var(--font-display);font-size:1.3rem;display:block;margin-bottom:14px}
.socials{display:flex;gap:10px}
.socials a{width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,.06);display:grid;place-items:center;color:#fff;transition:.25s}
.socials a:hover{background:var(--secondary);transform:translateY(-3px)}
.news form{display:flex;background:rgba(255,255,255,.06);border-radius:999px;padding:6px;margin-top:10px}
.news input{flex:1;background:transparent;border:none;outline:none;color:#fff;padding:8px 14px;font-family:inherit}
.news button{background:var(--primary);color:#fff;width:36px;height:36px;border-radius:50%}
.foot-cols{display:grid;grid-template-columns:1.2fr repeat(4,1fr);gap:30px;padding:40px 0;border-bottom:1px solid rgba(255,255,255,.08)}
.foot-cols b{color:#fff;display:block;margin-bottom:14px;font-family:var(--font-display)}
.foot-cols a{display:block;margin-bottom:10px;font-size:.85rem;transition:.2s}
.foot-cols a:hover{color:var(--secondary)}
.foot-bottom{display:flex;justify-content:space-between;padding-top:20px;font-size:.8rem;flex-wrap:wrap;gap:10px}

/* ==== To top + toast ==== */
.to-top{position:fixed;bottom:24px;right:24px;width:44px;height:44px;border-radius:50%;background:var(--primary);color:#fff;box-shadow:var(--shadow);opacity:0;transform:translateY(20px);transition:.3s;z-index:60}
.to-top.show{opacity:1;transform:translateY(0)}
.toast{position:fixed;bottom:24px;left:50%;transform:translate(-50%,80px);background:var(--dark);color:#fff;padding:12px 20px;border-radius:12px;box-shadow:var(--shadow);opacity:0;transition:.4s;z-index:70;font-size:.9rem}
.toast.show{opacity:1;transform:translate(-50%,0)}


  .slider-btn{position:absolute!important;top:50%!important;margin-top:-21px!important;background:var(--primary)!important;color:var(--secondary)!important;border:none!important;width:42px!important;height:42px!important;cursor:pointer!important;transition:.3s!important;z-index:10;display:flex;align-items:center;justify-content:center;border-radius:50%;}
  .slider-btn:hover{background:var(--dark)!important;color:var(--primary)!important}
  .slider-btn.prev{left:10px!important;right:auto!important}
  .slider-btn.next{right:10px!important;left:auto!important}
  .slider-btn::after{font-size:18px!important;font-weight:bold!important}
  .swiper-pagination-bullet{width:30px!important;height:3px!important;border-radius:0!important;background:var(--border)!important;opacity:1!important;margin:0 4px!important}
  .swiper-pagination-bullet-active{background:var(--primary)!important}


/* ==== Reveal ==== */
.reveal{opacity:1 !important; transform:none !important; transition:none;}
.reveal.in{opacity:1 !important; transform:none !important;}


.dest-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; }

/* ==== Responsive ==== */
@media(max-width:900px){
  .nav-search,.nav-links{display:none}
  .hamburger{display:inline-flex;margin-left:auto}
  .nav-links.open{display:flex;position:absolute;top:100%;left:0;right:0;background:#fff;flex-direction:column;padding:20px;gap:16px;box-shadow:var(--shadow)}
  .hero-grid,.split-grid,.faq-grid,.explore-grid{grid-template-columns:1fr}
  .companion-card{grid-template-columns:1fr;text-align:center;padding:30px 20px}
  .c-left,.c-right{display:none}
  .dest-grid{ grid-template-columns: repeat(2, 1fr); }
  .features-grid{grid-template-columns:1fr 1fr}
  .deal-banner{grid-template-columns:1fr;text-align:center}
  .testi{grid-template-columns:1fr;padding:30px}
  .foot-cols{grid-template-columns:1fr 1fr}
}
@media(max-width:500px){
  .features-grid,.booking-features{grid-template-columns:1fr}
  .dest-grid{grid-template-columns:1fr}
  .foot-cols{grid-template-columns:1fr}
  .cta-form{flex-direction:column;background:transparent;padding:0;gap:10px}
  .cta-form input{border-radius:999px;width:100%}
  .cta-form .btn{width:100%;justify-content:center}
  .creative-form{padding:20px}
}
`;

export const travel03Html = `
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">

<!-- Announcement Bar -->
<div class="announce">
  <div class="marquee">
    <span data-editable="true">✈️ Summer sale — up to 40% off flights</span>
    <span data-editable="true">🏖️ Free cancellation on first booking</span>
    <span data-editable="true">🌍 200+ destinations worldwide</span>
    <span data-editable="true">💳 Pay in 3 with 0% interest</span>
    <span data-editable="true">⭐ 4.9/5 from 12,000+ travelers</span>
    <span data-editable="true">✈️ Summer sale — up to 40% off flights</span>
    <span data-editable="true">🏖️ Free cancellation on first booking</span>
    <span data-editable="true">🌍 200+ destinations worldwide</span>
  </div>
</div>

<!-- Navbar -->
<header class="nav">
  <div class="container nav-inner">
    <a data-editable="true" href="javascript:void(0);" class="logo">LOGO_PLACEHOLDER</a>
    
    <a data-editable="true" href="javascript:void(0);" class="btn btn-primary">Get the App <i class="fa-solid fa-arrow-right"></i></a>
    
  </div>
</header>

<!-- 1. HERO -->
<section class="hero">
  <div class="container hero-grid">
    <div class="hero-left reveal">
      <div class="deco cloud cloud-1"><i class="fa-solid fa-cloud"></i></div>
      <div class="deco balloon"><i class="fa-solid fa-fire"></i></div>
      <div style="position: relative; display: inline-block;">
        <h1 data-editable="true" style="position: relative; z-index: 10;">The #1 Search &amp; AI Visibility <br/>Partner for Enterprise Growth</h1>
      </div>
      <p data-editable="true" class="lead">To get the best of your adventure you just need to leave and go where you like. We are waiting for you — packed, planned and personal.</p>
      <div class="hero-cta">
        <a data-editable="true" href="javascript:void(0);" class="btn btn-primary">Plan a Trip <i class="fa-solid fa-arrow-right"></i></a>
        <a data-editable="true" href="javascript:void(0);" class="watch">
          <span data-editable="true" class="play"><i class="fa-solid fa-play"></i></span>
          <span data-editable="true">Watch Our<br/><b>Story</b></span>
        </a>
      </div>
      <div class="hero-stats">
        <div class="avatars">
          <img data-editable-img="true" src="https://randomuser.me/api/portraits/men/32.jpg" class="a"/>
          <img data-editable-img="true" src="https://randomuser.me/api/portraits/women/44.jpg" class="a"/>
          <img data-editable-img="true" src="https://randomuser.me/api/portraits/men/46.jpg" class="a"/>
          <span data-editable="true" class="a-count">3K+</span>
        </div>
        <div class="stat-text">Travelled more than <br/><b>2000 places</b> 🌈</div>
      </div>
    </div>
    <div class="hero-right reveal">
      <div class="hero-person">
        <div class="hero-blob"></div>
        <img data-editable-img="true" src="/assets/templates/travel/templates03/hero.png" alt="Traveler" />
        <div class="badge badge-live"><span data-editable="true" class="dot"></span> LIVE</div>
        <div class="badge badge-support">
          <b>24/7</b><br/><span data-editable="true">Guide Support</span>
        </div>
        <div class="deco compass"><i class="fa-regular fa-compass"></i></div>
        <div class="deco plane"><i class="fa-solid fa-plane"></i></div>
        <div class="deco dots"></div>
      </div>
    </div>
  </div>
</section>

<!-- 10. CREATIVE BOOKING FORM -->
<section class="booking-section" id="book">
  <div class="container booking-grid">
    <div class="booking-info reveal">
      <span data-editable="true" class="eyebrow" style="color: var(--primary);">Start Your Journey</span>
      <h2 data-editable="true">Let's craft your dream vacation.</h2>
      <p data-editable="true">Tell us where you want to go and what you want to experience. Our travel experts will design a personalized itinerary just for you within 24 hours.</p>
      
      <div class="booking-features">
        <div class="b-feat">
          <i class="fa-solid fa-wand-magic-sparkles"></i>
          <div><b data-editable="true">Tailor-Made</b><span data-editable="true">100% personalized trips</span></div>
        </div>
        <div class="b-feat">
          <i class="fa-solid fa-headset"></i>
          <div><b data-editable="true">Expert Advice</b><span data-editable="true">Local insights & tips</span></div>
        </div>
        <div class="b-feat">
          <i class="fa-solid fa-tag"></i>
          <div><b data-editable="true">Best Value</b><span data-editable="true">Unbeatable price match</span></div>
        </div>
        <div class="b-feat">
          <i class="fa-solid fa-shield-halved"></i>
          <div><b data-editable="true">Fully Secure</b><span data-editable="true">Safe & easy booking</span></div>
        </div>
      </div>
    </div>
    
    <div class="booking-form-wrapper reveal">
      <form class="creative-form" id="mainBookingForm">
        <div class="cf-grid">
          <div class="cf-group cf-full">
            <label data-editable="true">Where to?</label>
            <input type="text" placeholder="E.g. Maldives, Japan, or 'Surprise Me'" required />
          </div>
          <div class="cf-group">
            <label data-editable="true">Check-in</label>
            <input type="date" required />
          </div>
          <div class="cf-group">
            <label data-editable="true">Guests</label>
            <select required>
              <option value="1">1 Traveler</option>
              <option value="2" selected>2 Travelers</option>
              <option value="3">3 Travelers</option>
              <option value="4+">4+ Travelers</option>
            </select>
          </div>
          <div class="cf-group cf-full">
            <label data-editable="true">Your Name</label>
            <input type="text" placeholder="John Doe" required />
          </div>
          <div class="cf-group cf-full">
            <label data-editable="true">Email Address</label>
            <input type="email" placeholder="john@example.com" required />
          </div>
          <div class="cf-group cf-full">
            <label data-editable="true">Special Requests</label>
            <textarea placeholder="Any dietary requirements, celebrations, or specific places you want to visit?"></textarea>
          </div>
        </div>
        <button data-editable="true" type="submit" class="btn btn-primary">Request Free Itinerary <i class="fa-solid fa-paper-plane"></i></button>
      </form>
    </div>
  </div>
</section>

<!-- 2. TRAVEL COMPANION BANNER -->
<section class="companion">
  <div class="container">
    <div class="companion-card reveal" style="cursor: pointer;" onclick="const v = this.querySelector('video'); if(v.paused) { v.play(); v.style.opacity='1'; this.querySelectorAll('.hide-on-play').forEach(e=>e.style.opacity='0'); } else { v.pause(); v.style.opacity='0.4'; this.querySelectorAll('.hide-on-play').forEach(e=>e.style.opacity='1'); }">
      <video src="https://www.w3schools.com/html/mov_bbb.mp4" playsinline style="position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;z-index:0;opacity:0.4;transition:0.3s;pointer-events:none;" loop></video>
      <div class="hide-on-play" style="position:absolute;inset:0;background:rgba(0,0,0,0.5);z-index:1;transition:0.3s;pointer-events:none;"></div>
      <img data-editable-img="true" src="/assets/templates/travel/templates03/traveler-man.png" alt="" class="c-left hide-on-play" style="z-index:2;position:relative;transition:0.3s;" />
      <div class="c-center hide-on-play" style="z-index:2;position:relative;transition:0.3s;">
        <div class="play-big" style="pointer-events:none;"><i class="fa-solid fa-play"></i></div>
        <h3 data-editable="true">Your travel companion that carries all the information</h3>
        <div class="deco plane-2"><i class="fa-solid fa-plane"></i></div>
      </div>
      <img data-editable-img="true" src="/assets/templates/travel/templates03/traveler-woman.png" alt="" class="c-right hide-on-play" style="z-index:2;position:relative;transition:0.3s;" />
    </div>
  </div>
</section>

<!-- 3. DESTINATIONS -->
<section class="section" id="destinations">
  <div class="container">
    <div class="sec-head">
      <h2 data-editable="true">Discover the touch of nature 🌈</h2>
    </div>
    <div style="padding: 10px 0 30px; overflow: hidden;">
      <div class="dest-grid" >
        <a href="javascript:void(0);" class="dest reveal" data-editable="true"><img data-editable-img="true" src="/assets/templates/travel/templates03/dest-venice.jpg" alt="Venice"/><span data-editable="true" class="pin"><i class="fa-solid fa-location-dot"></i> Venice</span></a>
        <a href="javascript:void(0);" class="dest reveal" data-editable="true"><img data-editable-img="true" src="/assets/templates/travel/templates03/dest-iceland.jpg" alt="Iceland"/><span data-editable="true" class="pin"><i class="fa-solid fa-location-dot"></i> Iceland</span></a>
        <a href="javascript:void(0);" class="dest reveal" data-editable="true"><img data-editable-img="true" src="/assets/templates/travel/templates03/dest-moab.jpg" alt="Moab"/><span data-editable="true" class="pin"><i class="fa-solid fa-location-dot"></i> Moab</span></a>
        <a href="javascript:void(0);" class="dest reveal" data-editable="true"><img data-editable-img="true" src="/assets/templates/travel/templates03/dest-arizona.jpg" alt="Arizona"/><span data-editable="true" class="pin"><i class="fa-solid fa-location-dot"></i> Arizona</span></a>
        <a href="javascript:void(0);" class="dest reveal" data-editable="true"><img data-editable-img="true" src="/assets/templates/travel/templates03/patagonia.png" alt="Paris"/><span data-editable="true" class="pin"><i class="fa-solid fa-location-dot"></i> Paris</span></a>
      </div>
    </div>
  </div>
</section>

<!-- 4. TRAVEL WELL / APP DOWNLOAD -->
<section class="section split">
  <div class="container split-grid">
    <div class="split-left reveal">
      <div class="weather-card">
        <div class="temp">-12° <span data-editable="true">C</span></div>
        <ul>
          <li data-editable="true"><span data-editable="true">Wind</span><b>13 km</b></li>
          <li data-editable="true"><span data-editable="true">Snow</span><b>80 cm</b></li>
        </ul>
      </div>
      <div class="mini-card mc1">
        <img data-editable-img="true" src="/assets/templates/travel/templates03/card-morocco.jpg" alt="Morocco"/>
        <div><b>Morocco</b><small>YYB → LAX → DXB</small></div>
      </div>
      <div class="mini-card mc2">
        <img data-editable-img="true" src="/assets/templates/travel/templates03/card-denver.jpg" alt="Denver"/>
        <div><b>Denver</b><small>YYB → LAX</small></div>
      </div>
      <div class="stat-tiles">
        <div><i class="fa-solid fa-temperature-half"></i><b>-12°C</b><span data-editable="true">Temp</span></div>
        <div><i class="fa-solid fa-wind"></i><b>13 km</b><span data-editable="true">Wind</span></div>
        <div><i class="fa-solid fa-snowflake"></i><b>80 cm</b><span data-editable="true">Snow</span></div>
      </div>
      <div class="deco balloon-2"><i class="fa-solid fa-fire"></i></div>
    </div>
    <div class="split-right reveal">
      <span data-editable="true" class="eyebrow">GET CONNECTED</span>
      <h2 data-editable="true">It is better to travel well than to arrive 🪧</h2>
      <p data-editable="true">Your ultimate travel companion. Carries all the information you need while travelling — offline maps, itineraries, docs and real-time alerts.</p>
      <div class="stores">
        <a data-editable="true" class="store"><i class="fa-brands fa-google-play"></i><span data-editable="true">Get it from<br/><b>Google Play</b></span></a>
        <a data-editable="true" class="store"><i class="fa-brands fa-apple"></i><span data-editable="true">Download on the<br/><b>Apple Store</b></span></a>
      </div>
    </div>
  </div>
</section>

<!-- 5. TICKETS DEAL BANNER -->
<section class="section" id="tickets">
  <div class="container">
    <div class="deal-banner reveal">
      <div class="d-left">
        <a data-editable="true" class="pill-btn">Get Tickets <i class="fa-solid fa-arrow-right"></i></a>
        <h2 data-editable="true">Find the <br/>best <span data-editable="true" class="ital">deals</span></h2>
      </div>
      <div class="plane-3">
        <div class="ribbon">HAWKS</div>
      </div>
      <div class="d-right">
        <span data-editable="true">Sponsored by</span>
        <b>HAWKS</b>
      </div>
      <div class="deco ticket"><i class="fa-solid fa-ticket"></i></div>
      <div class="deco suitcase"><i class="fa-solid fa-suitcase-rolling"></i></div>
    </div>
  </div>
</section>

<!-- 6. FEATURES / WHY US -->
<section class="section">
  <div class="container">
    <div class="sec-head center">
      <span data-editable="true" class="eyebrow">WHY KANRA</span>
      <h2 data-editable="true">Everything you need, <br/>nothing you don't ✨</h2>
    </div>
    <div class="features-grid">
      <div class="feat reveal"><i class="fa-solid fa-shield-halved"></i><h4 data-editable="true">Secure Booking</h4><p data-editable="true">256-bit encryption on every payment. Refunds in 24h.</p></div>
      <div class="feat reveal"><i class="fa-solid fa-headset"></i><h4 data-editable="true">24/7 Support</h4><p data-editable="true">Real humans on call, wherever you are on the globe.</p></div>
      <div class="feat reveal"><i class="fa-solid fa-tag"></i><h4 data-editable="true">Best Price</h4><p data-editable="true">We match any lower price you find within 24 hours.</p></div>
      <div class="feat reveal"><i class="fa-solid fa-map-location-dot"></i><h4 data-editable="true">Offline Maps</h4><p data-editable="true">Download once, navigate anywhere without signal.</p></div>
      <div class="feat reveal"><i class="fa-solid fa-plane-departure"></i><h4 data-editable="true">Flexible Flights</h4><p data-editable="true">Change dates free of charge on premium bookings.</p></div>
      <div class="feat reveal"><i class="fa-solid fa-heart"></i><h4 data-editable="true">Curated Trips</h4><p data-editable="true">Hand-picked stays by locals who actually travel.</p></div>
    </div>
  </div>
</section>

<!-- 7. TESTIMONIAL (NEW DESIGN — editor-native swiper) -->
<section class="section" id="reviews" style="padding: 100px 0;">
  <div class="container" style="position:relative;">
    <div class="sec-head center" style="margin-bottom: 50px;">
      <span data-editable="true" class="eyebrow">TESTIMONIALS</span>
      <h2 data-editable="true">What our travelers say ✨</h2>
    </div>

    <div data-gjs-type="swiper-container" class="swiper-container new-design-slider" data-slides-per-view="1" data-navigation="true" data-auto-height="true" data-space-between="30" data-loop="true" data-grab-cursor="true">
      <div data-gjs-type="swiper-wrapper" class="swiper-wrapper">

        <!-- Slide 1 -->
        <div data-gjs-type="swiper-slide" class="swiper-slide">
          <div style="display:flex; flex-wrap:wrap; align-items:center; gap: 50px;">
            <!-- Left -->
            <div style="flex:1; min-width:300px; display:flex; justify-content:center;">
              <div style="width: 350px; height: 350px; background-color: var(--primary); border-radius: 0 50% 50% 50%; overflow: hidden; position: relative;">
                <img data-editable-img="true" src="/assets/templates/travel/templates03/designer.png" style="width:100%; height:100%; object-fit:cover;" alt="User">
              </div>
            </div>
            <!-- Right -->
            <div style="flex:1; min-width:300px; text-align:left; position:relative;">
              <i class="fa-solid fa-quote-left" style="font-size:3rem; color:#e2e8f0; margin-bottom: 20px; opacity:0.6;"></i>
              <p data-editable="true" style="color: #475569; line-height: 1.8; margin-bottom: 20px;">"Kanra made our travel booking so easy. The support team is incredible, and the prices are unbeatable. I recommend this to everyone."</p>
              <div style="display:flex; align-items:center; gap: 10px; margin-bottom: 5px;">
                <i class="fa-brands fa-sketch" style="color:#f5a623; font-size:1.5rem;"></i>
                <strong data-editable="true" style="color: #0f172a;">Sketch</strong>
              </div>
              <div data-editable="true" style="color: #64748B; ">
                Joran Lee (Head of Marketing)
              </div>
            </div>
          </div>
        </div>

        <!-- Slide 2 -->
        <div data-gjs-type="swiper-slide" class="swiper-slide">
          <div style="display:flex; flex-wrap:wrap; align-items:center; gap: 50px;">
            <!-- Left -->
            <div style="flex:1; min-width:300px; display:flex; justify-content:center;">
              <div style="width: 350px; height: 350px; background-color: var(--primary); border-radius: 0 50% 50% 50%; overflow: hidden; position: relative;">
                <img data-editable-img="true" src="/assets/templates/travel/templates03/photographer.png" style="width:100%; height:100%; object-fit:cover;" alt="User">
              </div>
            </div>
            <!-- Right -->
            <div style="flex:1; min-width:300px; text-align:left; position:relative;">
              <i class="fa-solid fa-quote-left" style="font-size:3rem; color:#e2e8f0; margin-bottom: 20px; opacity:0.6;"></i>
              <p data-editable="true" style="color: #475569; line-height: 1.8; margin-bottom: 20px;">"The best vacation ever! The app makes it so easy to keep track of bookings, flights, and weather. The 24/7 support team is a life saver."</p>
              <div style="display:flex; align-items:center; gap: 10px; margin-bottom: 5px;">
                <i class="fa-brands fa-figma" style="color:#f24e1e; font-size:1.5rem;"></i>
                <strong data-editable="true" style="color: #0f172a;">Figma</strong>
              </div>
              <div data-editable="true" style="color: #64748B; ">
                Sarah Jenkins (Product Designer)
              </div>
            </div>
          </div>
        </div>

      </div>

      <div class="testi-nav-row">
        <div class="swiper-button-prev testi-nav-btn" data-gjs-type="swiper-button-prev"><i class="fa-solid fa-arrow-left"></i></div>
        <div class="swiper-button-next testi-nav-btn" data-gjs-type="swiper-button-next"><i class="fa-solid fa-arrow-right"></i></div>
      </div>
    </div>

  </div>
</section>

<!-- 8. BRANDS -->
<section class="brands">
  <div class="container brands-row">
    <span data-editable="true">amazon</span>
    <span data-editable="true">OYO</span>
    <span data-editable="true"><i class="fa-brands fa-airbnb"></i> airbnb</span>
    <span data-editable="true">Tripadvisor</span>
    <span data-editable="true">Expedia</span>
    <span data-editable="true">FedEx</span>
  </div>
</section>

<!-- 9. EXPLORE / BLOG -->
<section class="section" id="blog">
  <div class="container explore-grid">
    <div class="ex-big reveal">
      <img data-editable-img="true" src="/assets/templates/travel/templates03/spa.png" alt="Explore"/>
      <div class="ex-caption">
        <div>
          <small>Explore the world</small>
          <b>with us 🌍</b>
        </div>
        <a data-editable="true" class="btn btn-primary sm">Plan a Trip <i class="fa-solid fa-arrow-right"></i></a>
      </div>
    </div>
    <div class="ex-col">
      <div class="ex-card blue reveal">
        <h4 data-editable="true">Read our blog <i class="fa-solid fa-arrow-up-right-from-square"></i></h4>
        <p data-editable="true">We have shared our journey and some stories worth reading.</p>
      </div>
      <div class="ex-card green reveal">
        <h4 data-editable="true">See our workflow <i class="fa-solid fa-arrow-up-right-from-square"></i></h4>
        <p data-editable="true">It's a must-try — we would love to share our workflow to believe you.</p>
      </div>
    </div>
    <div class="ex-col">
      <div class="ex-card beige reveal">
        <h4 data-editable="true">Chat With Expert <i class="fa-solid fa-arrow-up-right-from-square"></i></h4>
        <div class="live-badge"><span data-editable="true" class="dot"></span> LIVE</div>
        <p data-editable="true"><b>3,000+</b> expert team members around the world who create incredible and amazing projects.</p>
      </div>
    </div>
  </div>
</section>



<!-- 11. FAQ + CTA -->
<section class="section faq-cta">
  <div class="container faq-grid">
    <div class="faq reveal">
      <span data-editable="true" class="eyebrow">FAQ</span>
      <h2 data-editable="true">Things people usually ask 💬</h2>
      <div class="acc">
        <details open><summary>How do I book my first trip?<i class="fa-solid fa-plus"></i></summary><p data-editable="true">Pick a destination, choose dates, and check out in less than 90 seconds.</p></details>
        <details><summary>Can I cancel or change my dates?<i class="fa-solid fa-plus"></i></summary><p data-editable="true">Yes — free changes up to 48h before departure on premium bookings.</p></details>
        <details><summary>Do you offer group discounts?<i class="fa-solid fa-plus"></i></summary><p data-editable="true">Groups of 6+ automatically get 15% off at checkout.</p></details>
        <details><summary>Is my payment protected?<i class="fa-solid fa-plus"></i></summary><p data-editable="true">Every transaction is 256-bit encrypted and backed by our refund guarantee.</p></details>
        <details><summary>What documents do I need to travel?<i class="fa-solid fa-plus"></i></summary><p data-editable="true">You will need a valid passport and, depending on the destination, a visa or digital travel authorization. We provide full guidance post-booking.</p></details>
        <details><summary>Can I customize my itinerary?<i class="fa-solid fa-plus"></i></summary><p data-editable="true">Absolutely! You can use our in-app planner to add local experiences, adjust hotel nights, and book rental cars at any time.</p></details>
      </div>
    </div>
    <div class="cta reveal">
      <div class="cta-inner">
        <h3 data-editable="true">Ready when you are ✈️</h3>
        <p data-editable="true">Join 12,000+ travelers already exploring smarter with Kanra.</p>
        <form class="cta-form" id="ctaForm">
          <input type="email" required placeholder="Your e-mail"/>
          <button data-editable="true" class="btn btn-primary" type="submit">Start Free <i class="fa-solid fa-arrow-right"></i></button>
        </form>
        <div class="cta-mini">
          <div><b>4.9★</b><span data-editable="true">App Store</span></div>
          <div><b>12k+</b><span data-editable="true">Travelers</span></div>
          <div><b>200+</b><span data-editable="true">Cities</span></div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- FOOTER -->
<footer class="footer">
  <div class="container">
    <div class="foot-top">
      <div>
        <b class="foot-title">Leading the way<br/>in adventure</b>
        <div class="socials">
          <a data-editable="true"><i class="fa-brands fa-instagram"></i></a>
          <a data-editable="true"><i class="fa-brands fa-youtube"></i></a>
          <a data-editable="true"><i class="fa-brands fa-facebook"></i></a>
          <a data-editable="true"><i class="fa-brands fa-twitter"></i></a>
        </div>
      </div>

    </div>
    <div class="foot-cols">
      <div class="fc-brand"><a data-editable="true" href="javascript:void(0);" class="logo light">LOGO_PLACEHOLDER</a></div>
      <div><b>Contact</b><a data-editable="true"><i class="fa-solid fa-envelope"></i> getemail@kanra.com</a><a data-editable="true"><i class="fa-solid fa-phone"></i> (270) 555-0117</a></div>
      <div><b>Company</b><a data-editable="true">Career</a><a data-editable="true">Developers</a><a data-editable="true">Our Story</a></div>
      <div><b>Kanra</b><a data-editable="true">Why Kanra</a><a data-editable="true">Customer</a><a data-editable="true">Press Info</a></div>
      <div><b>Resources</b><a data-editable="true">Career</a><a data-editable="true">About Us</a><a data-editable="true">Features</a></div>
    </div>
  </div>
</footer>

<script>
(function() {
  document.addEventListener('submit', function(e) {
    if (e.target.tagName === 'FORM') {
      e.target.setAttribute('novalidate', 'true');
      var isValid = true;
      var inputs = e.target.querySelectorAll('input:not([type="submit"]):not([type="hidden"]):not([type="button"]), textarea, select');
      inputs.forEach(function(input) {
        if (!input.value.trim() && input.hasAttribute('required')) isValid = false;
      });
      var isInEditor = !!document.querySelector('[data-gjs-type]');
      if (!isValid || isInEditor) {
        e.preventDefault();
      }
    }
  }, true);
  
  // Initialize Swiper in preview/live mode
  if (!isInEditor && typeof Swiper !== 'undefined') {
    var swipers = document.querySelectorAll('.swiper-container');
    swipers.forEach(function(s) {
      var slidesPerView = s.getAttribute('data-slides-per-view') || 1;
      new Swiper(s, {
        slidesPerView: slidesPerView,
        loop: true,
        pagination: {
          el: s.querySelector('.swiper-pagination'),
          clickable: true,
        },
        navigation: {
          nextEl: s.querySelector('.swiper-button-next'),
          prevEl: s.querySelector('.swiper-button-prev'),
        },
      });
    });
  }
})();
</script>
`;