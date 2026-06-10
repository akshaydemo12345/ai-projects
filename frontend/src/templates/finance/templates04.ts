export const finance04Styles = `
:root {
  --primary: PRIMARY_COLOR_PLACEHOLDER;
  --secondary: SECONDARY_COLOR_PLACEHOLDER;
  --text-dark: #0f172a;
  --text-muted: #64748b;
  --bg-light: #f3f6f5;
  --white: #ffffff;
  --transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Outfit', sans-serif;
  color: var(--text-dark);
  background-color: var(--white);
  line-height: 1.6;
  overflow-x: hidden;
}

img {
  max-width: 100%;
  display: block;
  height: auto;
}

a {
  text-decoration: none;
  color: inherit;
  transition: var(--transition);
}

ul { list-style: none; }

.container {
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Floating Animations for Shapes */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes float {
  0% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(10deg); }
  100% { transform: translateY(0) rotate(0deg); }
}
@keyframes floatReverse {
  0% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(20px) rotate(-10deg); }
  100% { transform: translateY(0) rotate(0deg); }
}
@keyframes pulseGlow {
  0% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.1); opacity: 0.8; }
  100% { transform: scale(1); opacity: 0.5; }
}

/* Base animations that play immediately */
.animate-up { opacity: 0; animation: fadeInUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
.delay-1 { animation-delay: 0.1s; }
.delay-2 { animation-delay: 0.2s; }
.delay-3 { animation-delay: 0.3s; }
.delay-4 { animation-delay: 0.4s; }

/* Decorative Tiny Shapes (Creative elements) */
.deco-shape {
  position: absolute;
  z-index: 0;
  pointer-events: none;
}
.deco-circle {
  width: 40px; height: 40px;
  border-radius: 50%;
  border: 8px solid var(--secondary);
  opacity: 0.4;
  animation: float 6s infinite ease-in-out;
}
.deco-dot {
  width: 20px; height: 20px;
  border-radius: 50%;
  background: var(--primary);
  opacity: 0.3;
  animation: floatReverse 5s infinite ease-in-out;
}
.deco-cross {
  width: 30px; height: 30px;
  opacity: 0.4;
  animation: float 7s infinite ease-in-out;
}
.deco-cross::before, .deco-cross::after {
  content: ''; position: absolute; background: var(--secondary); border-radius: 10px;
}
.deco-cross::before { width: 100%; height: 6px; top: 12px; left: 0; }
.deco-cross::after { height: 100%; width: 6px; top: 0; left: 12px; }

/* Buttons */
.btn-yellow, .btn-green, .btn-white {
  display: inline-flex; align-items: center; gap: 10px;
  padding: 14px 32px; border-radius: 50px; font-weight: 700; font-size: 0.95rem;
  text-transform: capitalize; position: relative; overflow: hidden; z-index: 1;
  cursor: pointer; border: none; box-shadow: 0 10px 20px rgba(0,0,0,0.05);
}
.btn-yellow::before, .btn-green::before, .btn-white::before {
  content: ''; position: absolute; top: 0; left: -100%;
  width: 100%; height: 100%; transition: all 0.5s ease; z-index: -1; border-radius: 50px;
}
.btn-yellow:hover::before, .btn-green:hover::before, .btn-white:hover::before { left: 0; }

.btn-yellow { background: var(--secondary); color: var(--white); }
.btn-yellow::before { background: var(--primary); }
.btn-yellow:hover { color: var(--white); box-shadow: 0 10px 25px rgba(var(--primary-rgb), 0.3); transform: translateY(-3px); }

.btn-green { background: var(--primary); color: var(--white); }
.btn-green::before { background: var(--secondary); }
.btn-green:hover { color: var(--white); box-shadow: 0 10px 25px rgba(var(--secondary-rgb), 0.3); transform: translateY(-3px); }

.btn-white { background: var(--white); color: var(--primary); }
.btn-white::before { background: var(--primary); }
.btn-white:hover { color: var(--white); transform: translateY(-3px); }

/* Topbar */
.topbar { background-color: var(--primary); color: rgba(255, 255, 255, 0.8); font-size: 0.85rem; padding: 12px 0; }
.topbar-inner { display: flex; justify-content: space-between; align-items: center; }
.topbar-left, .topbar-right { display: flex; align-items: center; gap: 25px; }
.topbar-left i { color: var(--secondary); margin-right: 8px; font-size: 1rem; }
.topbar-right a {
  width: 30px; height: 30px; background: rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center;
  border-radius: 50%; transition: var(--transition); color: var(--white);
}
.topbar-right a:hover { background: var(--secondary); color: var(--white); transform: translateY(-2px); }

/* Header */
.header {
  background: var(--white); padding: 15px 0; position: sticky; top: 0; z-index: 1000;
  box-shadow: 0 2px 20px rgba(0,0,0,0.05);
}
.header-inner { display: flex; justify-content: space-between; align-items: center; }
.logo { font-size: 2rem; font-weight: 800; color: var(--primary); display: flex; align-items: center; gap: 12px; }
.header-actions { display: flex; align-items: center; gap: 20px; }

/* Hero Section */
.hero {
  background-color: var(--bg-light);
  background-image: url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1920');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  padding: 90px 0 160px; 
  position: relative; 
  z-index: 1;
}
.hero::after {
  content: ''; position: absolute; inset: 0;
  background: rgba(243, 246, 245, 0.92); /* Light overlay so text is readable */
  z-index: -1;
}
.hero-shape-1 {
  position: absolute; top: 15%; left: 8%; width: 60px; height: 60px;
  border: 12px solid var(--secondary); border-radius: 50%; opacity: 0.4;
  animation: float 6s infinite ease-in-out;
}
.hero-inner { display: grid; grid-template-columns: 1fr 450px; align-items: center; gap: 80px; }
.hero-tag {
  background: rgba(var(--primary-rgb), 0.1); color: var(--primary); padding: 8px 20px; border-radius: 30px;
  font-size: 0.9rem; font-weight: 700; display: inline-flex; align-items: center; gap: 10px; margin-bottom: 25px;
  border: 1px solid rgba(var(--primary-rgb), 0.2);
}
.hero-tag i { color: var(--secondary); }
.hero-content h1 { font-size: 4rem; line-height: 1.15; font-weight: 800; margin-bottom: 25px; color: var(--text-dark); letter-spacing: -1px; }
.hero-content h1 span { position: relative; display: inline-block; }
.hero-content h1 span::after {
  content: ''; position: absolute; bottom: 8px; left: 0; width: 100%; height: 12px;
  background: var(--secondary); opacity: 0.4; z-index: -1; transform: rotate(-2deg);
}
.hero-content p { font-size: 1.15rem; color: var(--text-muted); margin-bottom: 40px; max-width: 90%; line-height: 1.7; }

/* Hero Form Section (Right Side) */
.hero-form-wrapper {
  background: var(--white); padding: 40px; border-radius: 20px;
  box-shadow: 0 30px 60px rgba(0,0,0,0.1); position: relative; z-index: 10;
  border-top: 5px solid var(--secondary);
}
.hero-form-header { text-align: center; margin-bottom: 25px; }
.hero-form-header h3 { font-size: 1.6rem; font-weight: 800; color: var(--primary); margin-bottom: 10px; }
.hero-form-header p { color: var(--text-muted); font-size: 0.95rem; }
.hero-form-contact {
  display: flex; align-items: center; justify-content: center; gap: 15px;
  background: var(--bg-light); padding: 15px; border-radius: 12px;
  margin-bottom: 25px; font-weight: 700; color: var(--primary); text-align: left;
}
.hero-form-contact i {
  font-size: 1.8rem; color: var(--secondary);
  background: var(--white); width: 50px; height: 50px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center; box-shadow: 0 5px 15px rgba(0,0,0,0.05);
}
.hf-input-group { margin-bottom: 15px; }
.hf-input-group input, .hf-input-group select {
  width: 100%; padding: 14px 20px; border: 1px solid rgba(0,0,0,0.1);
  border-radius: 8px; font-family: inherit; font-size: 1rem;
  transition: var(--transition); background: #f9f9f9;
}
.hf-input-group input:focus, .hf-input-group select:focus {
  border-color: var(--primary); outline: none; background: var(--white); box-shadow: 0 5px 15px rgba(var(--primary-rgb), 0.1);
}

/* Overlapping Features Cards */
.hero-features {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px;
  margin-top: -80px; position: relative; z-index: 20;
}
.hero-feature-card {
  background: var(--white); color: var(--text-dark); padding: 35px 30px;
  border-radius: 16px; display: flex; align-items: flex-start; gap: 20px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.08); transition: var(--transition);
  position: relative; overflow: hidden; border: 1px solid rgba(0,0,0,0.02);
}
.hero-feature-card::before {
  content: ''; position: absolute; top: 0; right: 0; width: 150px; height: 150px;
  background: rgba(var(--primary-rgb), 0.05); border-radius: 50%; transform: translate(50%, -50%);
  transition: var(--transition); z-index: 0;
}
.hf-content { position: relative; z-index: 1; }
.hero-feature-card:hover { transform: translateY(-15px); background: var(--primary); color: var(--white); box-shadow: 0 25px 50px rgba(var(--primary-rgb), 0.2); }
.hero-feature-card:hover::before { background: rgba(255,255,255,0.1); transform: translate(20%, -20%) scale(2); }
.hero-feature-card:hover .hf-text h4, .hero-feature-card:hover .hf-text p { color: var(--white); }
.hf-icon { font-size: 2.5rem; color: var(--primary); transition: var(--transition); position: relative; z-index: 1; margin-top: 5px; }
.hero-feature-card:hover .hf-icon { color: var(--secondary); transform: scale(1.1) rotate(5deg); }
.hf-text h4 { font-size: 1.3rem; margin-bottom: 8px; font-weight: 800; transition: var(--transition); }
.hf-text p { font-size: 0.95rem; color: var(--text-muted); line-height: 1.5; transition: var(--transition); }

/* Section Headers */
.section-title {
  color: var(--primary); font-weight: 700; font-size: 1rem; text-transform: uppercase;
  letter-spacing: 2px; display: flex; align-items: center; gap: 12px; margin-bottom: 15px;
}
.section-title i { color: var(--secondary); font-size: 1.2rem; }
.section-heading { font-size: 3.2rem; font-weight: 800; color: var(--text-dark); margin-bottom: 25px; line-height: 1.2; letter-spacing: -0.5px; position: relative; z-index: 2; }

/* About Section */
.about { padding: 120px 0; position: relative; }
.about .deco-circle { top: 10%; right: 5%; }
.about .deco-dot { bottom: 20%; left: 3%; }
.about-inner { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; position: relative; z-index: 2; }
.about-images { position: relative; }
.about-img-main { width: 85%; border-radius: 20px; box-shadow: 0 20px 50px rgba(0,0,0,0.15); position: relative; z-index: 2; }
.about-img-sub {
  position: absolute; bottom: -50px; right: 0; width: 55%;
  border-radius: 20px; border: 12px solid var(--white);
  box-shadow: 0 20px 50px rgba(0,0,0,0.15); z-index: 3;
  animation: float 7s infinite ease-in-out;
}
.about-experience {
  position: absolute; top: 40px; right: 20px; background: var(--secondary); color: var(--white);
  padding: 25px; border-radius: 16px; text-align: center; font-weight: 800;
  box-shadow: 0 15px 30px rgba(var(--secondary-rgb), 0.4); z-index: 4;
}
.about-experience h3 { font-size: 3rem; line-height: 1; margin-bottom: 5px; }
.about-experience span { font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; }

.about-text p { color: var(--text-muted); margin-bottom: 25px; font-size: 1.1rem; }
.about-list { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 40px; }
.about-list li { display: flex; align-items: center; gap: 12px; font-weight: 700; font-size: 1.05rem; }
.about-list li i { color: var(--white); background: var(--primary); width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; }

/* Services Grid */
.services { background-color: var(--bg-light); padding: 120px 0; position: relative; }
.services .deco-cross { top: 15%; left: 10%; }
.services .deco-circle { bottom: 10%; right: 10%; }
.services .section-heading { text-align: center; margin-bottom: 60px; }
.services-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 35px; position: relative; z-index: 2; }
.service-card {
  background: var(--white); padding: 50px 40px; border-radius: 20px;
  position: relative; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.03);
  transition: var(--transition); border: 1px solid rgba(0,0,0,0.03);
}
.service-card::before {
  content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 0;
  background: var(--primary); transition: var(--transition); z-index: 1;
}
.service-card:hover { transform: translateY(-15px); box-shadow: 0 20px 50px rgba(0,0,0,0.1); border-color: transparent; }
.service-card:hover::before { height: 100%; }
.service-card > * { position: relative; z-index: 2; transition: var(--transition); }

.srv-icon {
  width: 70px; height: 70px; background: rgba(var(--primary-rgb), 0.05); border-radius: 16px;
  display: flex; align-items: center; justify-content: center; font-size: 2.5rem;
  color: var(--primary); margin-bottom: 25px; transition: var(--transition);
}
.service-card:hover .srv-icon { background: rgba(255,255,255,0.1); color: var(--secondary); transform: scale(1.1); }
.service-card h3 { font-size: 1.4rem; margin-bottom: 15px; font-weight: 800; color: var(--text-dark); }
.service-card:hover h3 { color: var(--white); }
.service-card p { color: var(--text-muted); font-size: 1rem; margin-bottom: 25px; line-height: 1.6; }
.service-card:hover p { color: rgba(255,255,255,0.8); }
.srv-link {
  display: inline-flex; align-items: center; gap: 10px; font-weight: 700; font-size: 1rem; color: var(--primary);
  width: 50px; height: 50px; border-radius: 50%; background: var(--bg-light); justify-content: center; overflow: hidden;
  transition: var(--transition);
}
.srv-link span { display: none; }
.service-card:hover .srv-link { width: auto; padding: 0 20px; border-radius: 30px; background: var(--secondary); color: var(--white); }
.service-card:hover .srv-link span { display: block; color: var(--white); }

/* CTA Banner */
.cta-banner { background-color: var(--primary); padding: 90px 0; position: relative; overflow: hidden; }
.cta-banner::before {
  content: ''; position: absolute; left: -10%; top: -30%; width: 400px; height: 400px;
  background: var(--secondary); border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; opacity: 0.15;
  animation: float 10s infinite;
}
.cta-banner::after {
  content: ''; position: absolute; right: -5%; bottom: -30%; width: 300px; height: 300px;
  background: var(--white); border-radius: 50%; opacity: 0.05;
}
.cta-inner { display: flex; justify-content: space-between; align-items: center; position: relative; z-index: 10; }
.cta-text h2 { color: var(--white); font-size: 3rem; font-weight: 800; margin-bottom: 15px; }
.cta-text p { color: rgba(255,255,255,0.8); font-size: 1.2rem; }
.cta-btns { display: flex; gap: 20px; }

/* Why Choose Us */
.why-choose { padding: 120px 0; position: relative; }
.why-choose .deco-cross { bottom: 10%; left: 5%; }
.why-inner { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; position: relative; z-index: 2; }
.why-images { display: grid; grid-template-columns: 1fr 1fr; gap: 25px; position: relative; }
.why-images::before {
  content: ''; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
  width: 150px; height: 150px; background: var(--secondary); border-radius: 50%; z-index: -1;
  animation: pulseGlow 4s infinite;
}
.why-img { border-radius: 120px 20px 120px 20px; overflow: hidden; height: 350px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); }
.why-img:nth-child(2) { border-radius: 20px 120px 20px 120px; margin-top: 50px; }
.why-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; }
.why-img:hover img { transform: scale(1.1); }
.why-features { margin-top: 40px; display: flex; flex-direction: column; gap: 25px; }
.w-feature { display: flex; align-items: flex-start; gap: 20px; background: var(--white); padding: 25px; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.04); transition: var(--transition); border-left: 4px solid transparent; }
.w-feature:hover { transform: translateX(10px); border-left-color: var(--secondary); box-shadow: 0 15px 40px rgba(0,0,0,0.08); background: var(--primary); }
.w-icon {
  width: 55px; height: 55px; background: rgba(var(--primary-rgb), 0.1); color: var(--primary);
  border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; flex-shrink: 0; transition: var(--transition);
}
.w-feature:hover .w-icon { background: var(--secondary); color: var(--white); }
.w-text h4 { font-size: 1.3rem; margin-bottom: 8px; font-weight: 800; transition: var(--transition); }
.w-text p { color: var(--text-muted); font-size: 1rem; transition: var(--transition); }
.w-feature:hover .w-text h4, .w-feature:hover .w-text p { color: var(--white); }

/* Diagonal Marquee */
.diagonal-marquee { position: relative; padding: 60px 0; background: var(--bg-light); overflow: hidden; }
.marquee-strip-wrapper { 
  transform: rotate(-3deg); width: 150%; margin-left: -25%; display: flex; flex-direction: column; background: var(--bg-light);
}
.marquee-strip { 
  display: flex; white-space: nowrap; padding: 20px 0; font-size: 1.8rem; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; width: fit-content;
}
.strip-green { background: var(--primary); color: var(--white); animation: marqueeLeft 30s linear infinite; }
.strip-yellow { background: var(--secondary); color: var(--white); animation: marqueeRight 30s linear infinite; }
.marquee-item { display: inline-flex; align-items: center; gap: 30px; padding: 0 40px; }
.marquee-item i { font-size: 1.2rem; }
@keyframes marqueeLeft { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
@keyframes marqueeRight { 0% { transform: translateX(-50%); } 100% { transform: translateX(0); } }

/* Team Section */
.team { padding: 120px 0; text-align: center; position: relative; }
.team .deco-dot { top: 15%; right: 10%; }
.team-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 35px; margin-top: 60px; position: relative; z-index: 2; }
.team-card { position: relative; }
.team-img { 
  background: var(--bg-light); border-radius: 150px 150px 20px 20px; padding-top: 20px; overflow: hidden; position: relative; 
}
.team-img img { width: 100%; height: 320px; object-fit: cover; object-position: center top; transition: var(--transition); }
.team-card:hover .team-img img { transform: scale(1.1); }
.team-overlay {
  position: absolute; inset: 0; background: rgba(var(--primary-rgb), 0.7);
  display: flex; align-items: center; justify-content: center; opacity: 0; transition: var(--transition);
}
.team-card:hover .team-overlay { opacity: 1; }
.team-socials { display: flex; gap: 10px; transform: translateY(20px); transition: var(--transition); }
.team-card:hover .team-socials { transform: translateY(0); }
.team-socials a { width: 40px; height: 40px; background: var(--secondary); color: var(--white); border-radius: 50%; display: flex; align-items: center; justify-content: center; }
.team-socials a:hover { background: var(--white); color: var(--primary); }
.team-info {
  background: var(--white); padding: 25px; border-radius: 16px;
  box-shadow: 0 15px 30px rgba(0,0,0,0.08); position: relative;
  margin-top: -40px; width: 85%; margin-left: auto; margin-right: auto; z-index: 10;
  transition: var(--transition); border: 1px solid rgba(0,0,0,0.03);
}
.team-card:hover .team-info { transform: translateY(-10px); border-color: var(--secondary); background: var(--primary); }
.team-card:hover .team-info h4, .team-card:hover .team-info p { color: var(--white); }
.team-info h4 { font-size: 1.2rem; font-weight: 800; color: var(--text-dark); transition: var(--transition); }
.team-info p { color: var(--primary); font-size: 0.9rem; font-weight: 700; margin-top: 5px; text-transform: uppercase; transition: var(--transition); }

/* Portfolio / Projects */
.portfolio { background: var(--primary); padding: 120px 0; }
.portfolio .section-heading, .portfolio .section-title { color: var(--white); }
.portfolio .section-title i { color: var(--secondary); }
.port-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 25px; margin-top: 60px; }
.port-card { position: relative; border-radius: 16px; overflow: hidden; height: 400px; box-shadow: 0 20px 40px rgba(0,0,0,0.2); }
.port-card img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1); }
.port-card:hover img { transform: scale(1.15); }
.port-card::before {
  content: ''; position: absolute; inset: 0; background: linear-gradient(to top, rgba(var(--primary-rgb), 0.9), transparent);
  opacity: 0.5; transition: var(--transition); z-index: 1;
}
.port-card:hover::before { opacity: 0.9; }
.port-overlay {
  position: absolute; bottom: 0; left: 0; right: 0; padding: 30px;
  background: rgba(var(--white-rgb), 0); z-index: 2; transform: translateY(20px); transition: var(--transition);
}
.port-card:hover .port-overlay { transform: translateY(0); }
.port-link {
  position: absolute; top: 30px; right: 30px; width: 50px; height: 50px;
  background: var(--secondary); color: var(--white); border-radius: 50%;
  display: flex; align-items: center; justify-content: center; font-size: 1.2rem;
  z-index: 2; opacity: 0; transform: scale(0.5); transition: var(--transition);
}
.port-card:hover .port-link { opacity: 1; transform: scale(1); background: var(--white); color: var(--primary); }
.port-overlay h4 { font-size: 1.4rem; color: var(--white); margin-bottom: 8px; font-weight: 800; }
.port-overlay p { color: var(--secondary); font-size: 0.95rem; font-weight: 600; text-transform: uppercase; }

/* Process Section */
.process { padding: 120px 0; background: var(--white); position: relative; }
.process .deco-dot { top: 10%; left: 5%; }
.process-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 30px; margin-top: 60px; position: relative; z-index: 2; }
.process-card { text-align: center; position: relative; z-index: 1; }
.process-icon {
  width: 90px; height: 90px; background: var(--bg-light); border-radius: 50%;
  display: flex; align-items: center; justify-content: center; font-size: 2.5rem;
  color: var(--primary); margin: 0 auto 25px; position: relative;
  box-shadow: 0 10px 20px rgba(0,0,0,0.05); transition: var(--transition);
}
.process-card:hover .process-icon { background: var(--primary); color: var(--white); transform: scale(1.1); }
.process-number {
  position: absolute; top: -10px; right: 0; width: 35px; height: 35px;
  background: var(--secondary); color: var(--white); border-radius: 50%;
  display: flex; align-items: center; justify-content: center; font-weight: 800;
  font-size: 1rem; border: 3px solid var(--white);
}
.process-card h4 { font-size: 1.3rem; font-weight: 800; margin-bottom: 15px; color: var(--text-dark); transition: var(--transition); }
.process-card:hover h4 { color: var(--primary); }
.process-card p { color: var(--text-muted); font-size: 1rem; line-height: 1.6; }

@media (min-width: 1025px) {
  .process-card:not(:last-child)::after {
    content: ''; position: absolute; top: 45px; right: -50%; width: 100%; height: 2px;
    border-top: 2px dashed rgba(0,0,0,0.1); z-index: -1;
  }
}

/* Testimonials */
.testimonials { padding: 120px 0; background: var(--bg-light); text-align: center; }
.testi-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 35px; margin-top: 60px; }
.testi-card {
  background: var(--white); padding: 50px 40px; border-radius: 20px;
  text-align: left; box-shadow: 0 10px 30px rgba(0,0,0,0.03); transition: var(--transition);
  position: relative; border: 1px solid rgba(0,0,0,0.03);
}
.testi-card:hover { transform: translateY(-10px); box-shadow: 0 20px 50px rgba(0,0,0,0.08); background: var(--primary); border-color: var(--primary); }
.testi-card::after {
  content: '\\f10e'; font-family: 'Font Awesome 6 Free'; font-weight: 900;
  position: absolute; top: 30px; right: 30px; font-size: 4rem; color: rgba(var(--primary-rgb), 0.05); transition: var(--transition);
}
.testi-card:hover::after { color: rgba(255,255,255,0.1); }
.testi-stars { color: var(--secondary); font-size: 1.1rem; margin-bottom: 20px; transition: var(--transition); }
.testi-text { font-size: 1.1rem; font-style: italic; color: var(--text-muted); margin-bottom: 30px; line-height: 1.7; transition: var(--transition); }
.testi-card:hover .testi-text { color: rgba(255,255,255,0.9); }
.testi-author { display: flex; align-items: center; gap: 15px; }
.testi-author img { width: 60px; height: 60px; border-radius: 50%; object-fit: cover; }
.testi-author h4 { font-size: 1.2rem; font-weight: 800; color: var(--text-dark); transition: var(--transition); }
.testi-author p { font-size: 0.9rem; color: var(--primary); font-weight: 700; text-transform: uppercase; transition: var(--transition); }
.testi-card:hover .testi-author h4, .testi-card:hover .testi-author p { color: var(--white); }

/* Newsletter */
.newsletter { padding: 60px 0; margin-bottom: -100px; position: relative; z-index: 20; }
.news-inner {
  background: var(--secondary); border-radius: 80px; padding: 60px 80px;
  display: flex; justify-content: space-between; align-items: center;
  box-shadow: 0 30px 60px rgba(var(--secondary-rgb), 0.2);
}
.news-inner h2 { font-size: 2.8rem; font-weight: 800; color: var(--white); max-width: 500px; line-height: 1.2; }
.news-form { display: flex; background: var(--white); padding: 10px; border-radius: 50px; width: 500px; box-shadow: 0 10px 20px rgba(0,0,0,0.05); }
.news-form input { flex: 1; border: none; padding: 10px 25px; outline: none; background: transparent; font-family: inherit; font-size: 1.1rem; }
.news-form button { background: var(--primary); color: var(--white); border: none; padding: 15px 35px; border-radius: 40px; font-weight: 700; font-size: 1.05rem; cursor: pointer; transition: var(--transition); }
.news-form button:hover { background: #111; color: var(--white); transform: scale(1.05); }

/* Footer */
.footer { background: var(--primary); color: rgba(255,255,255,0.7); padding: 180px 0 50px; }
.foot-grid { display: grid; grid-template-columns: 1.5fr 1fr; gap: 50px; }
.foot-logo { font-size: 2.2rem; color: var(--white); font-weight: 800; margin-bottom: 25px; display: flex; align-items: center; gap: 12px; }
.foot-logo .logo-icon { background: var(--secondary); color: var(--white); }
.footer-desc { font-size: 1.1rem; line-height: 1.7; margin-bottom: 30px; max-width: 400px; }
.foot-social { display: flex; gap: 12px; }
.foot-social a {
  width: 45px; height: 45px; background: rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: center;
  border-radius: 50%; color: var(--white); font-size: 1.1rem; transition: var(--transition);
}
.foot-social a:hover { background: var(--secondary); color: var(--white); transform: translateY(-5px); }
.footer h4 { color: var(--white); font-size: 1.3rem; margin-bottom: 30px; font-weight: 800; position: relative; padding-bottom: 10px; }
.footer h4::after { content: ''; position: absolute; bottom: 0; left: 0; width: 40px; height: 3px; background: var(--secondary); }
.foot-links li { margin-bottom: 15px; }
.foot-links a { display: inline-flex; align-items: center; gap: 8px; font-size: 1.05rem; }
.foot-links a i { color: var(--secondary); font-size: 0.8rem; transition: var(--transition); }
.foot-links a:hover { color: var(--white); }
.foot-links a:hover i { transform: translateX(5px); }
.foot-post { display: flex; gap: 20px; margin-bottom: 20px; align-items: center; }
.foot-post img { width: 70px; height: 70px; border-radius: 10px; object-fit: cover; }
.foot-post h5 { color: var(--white); font-size: 1rem; line-height: 1.4; margin-bottom: 5px; transition: var(--transition); cursor: pointer; }
.foot-post h5:hover { color: var(--secondary); }
.foot-post span { font-size: 0.85rem; color: rgba(255,255,255,0.5); }
.foot-post span i { color: var(--secondary); margin-right: 5px; }
.foot-bottom {
  border-top: 1px solid rgba(255,255,255,0.1); margin-top: 70px; padding-top: 30px;
  display: flex; justify-content: space-between; align-items: center; font-size: 1rem;
}

/* Responsive */
@media (max-width: 1024px) {
  .hero-inner, .about-inner, .why-inner, .cta-inner, .news-inner { grid-template-columns: 1fr; gap: 50px; text-align: center; }
  .hero-features { grid-template-columns: 1fr; margin-top: 40px; }
  .services-grid, .team-grid, .port-grid, .testi-grid, .process-grid { grid-template-columns: 1fr 1fr; }
  .foot-grid { grid-template-columns: 1fr 1fr; }
  .news-form { width: 100%; }
  .about-images { margin-bottom: 50px; }
  .about-img-sub { right: auto; left: 50%; transform: translateX(-50%); }
  .w-feature { text-align: left; }
  .hero-content h1 { font-size: 3rem; }
  .section-title { justify-content: center; }
}
@media (max-width: 768px) {
  .topbar { display: none; }
  .services-grid, .team-grid, .port-grid, .testi-grid, .foot-grid, .why-images, .process-grid { grid-template-columns: 1fr; }
  .hero-content h1 { font-size: 2.5rem; }
  .section-heading { font-size: 2.2rem; }
  .news-inner { padding: 40px 20px; border-radius: 30px; flex-direction: column; text-align: center; gap: 30px; }
  .news-inner h2 { font-size: 2rem; }
  .foot-bottom { flex-direction: column; gap: 20px; text-align: center; }
}
`;

export const finance04Html = `
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

<!-- 1. Topbar -->
<div class="topbar">
  <div class="container topbar-inner">
    <div class="topbar-left">
      <span><i class="fa-solid fa-envelope"></i> EMAIL_PLACEHOLDER</span>
      <span><i class="fa-solid fa-phone"></i> PHONE_PLACEHOLDER</span>
      <span><i class="fa-solid fa-clock"></i> Mon - Fri: 9:00 - 18:00</span>
    </div>
    <div class="topbar-right">
      <a href="#"><i class="fa-brands fa-facebook-f"></i></a>
      <a href="#"><i class="fa-brands fa-twitter"></i></a>
      <a href="#"><i class="fa-brands fa-linkedin-in"></i></a>
      <a href="#"><i class="fa-brands fa-instagram"></i></a>
    </div>
  </div>
</div>

<!-- 2. Header -->
<header class="header">
  <div class="container header-inner">
    <div class="logo">
      LOGO_PLACEHOLDER
    </div>
    <div class="header-actions">
      <a href="#contact" class="btn-yellow">Get A Quote <i class="fa-solid fa-arrow-right"></i></a>
    </div>
  </div>
</header>

<!-- 3. Hero Section -->
<section id="home" class="hero">
  <div class="hero-shape-1"></div>
  <div class="container hero-inner">
    <div class="hero-content animate-up">
      <div class="hero-tag"><i class="fa-solid fa-bolt"></i> Welcome to PROJECT_NAME_PLACEHOLDER</div>
      <h1>Expert Solutions for Corporate <span>Financial</span> Success.</h1>
      <p>We provide tailored financial strategies and corporate consulting to help your business achieve sustainable growth and maximize profitability in a competitive market.</p>
      <a href="#about" class="btn-green">Discover More <i class="fa-solid fa-arrow-right"></i></a>
    </div>
    
    <!-- Hero Form Box -->
    <div class="hero-form-wrapper animate-up delay-2">
      <div class="hero-form-header">
        <h3>Request Consultation</h3>
        <p>Get expert advice tailored to your business.</p>
      </div>
      <div class="hero-form-contact">
        <i class="fa-solid fa-headset"></i>
        <div>
          <span style="display:block; font-size: 0.85rem; color: var(--text-muted); font-weight: 500;">Call Us Now</span>
          <span style="font-size: 1.2rem;">PHONE_PLACEHOLDER</span>
        </div>
      </div>
      <form>
        <div class="hf-input-group">
          <input type="text" name="name" placeholder="Full Name" required>
        </div>
        <div class="hf-input-group">
          <input type="email" name="email" placeholder="Email Address" required>
        </div>
        <div class="hf-input-group">
          <input type="tel" name="phone" placeholder="Phone Number" required>
        </div>
        <button type="submit" class="btn-yellow" style="width: 100%; justify-content: center; margin-top: 10px;">Get Started Now <i class="fa-solid fa-arrow-right"></i></button>
      </form>
    </div>
  </div>
</section>

<!-- Overlapping Features Cards -->
<div class="container">
  <div class="hero-features">
    <div class="hero-feature-card animate-up delay-1">
      <div class="hf-icon"><i class="fa-solid fa-chart-line"></i></div>
      <div class="hf-content">
        <div class="hf-text">
          <h4>Business Growth</h4>
          <p>Strategic planning to scale your enterprise operations effectively.</p>
        </div>
      </div>
    </div>
    <div class="hero-feature-card animate-up delay-2">
      <div class="hf-icon"><i class="fa-solid fa-coins"></i></div>
      <div class="hf-content">
        <div class="hf-text">
          <h4>Financial Advice</h4>
          <p>Expert wealth management and trusted investment consulting.</p>
        </div>
      </div>
    </div>
    <div class="hero-feature-card animate-up delay-3">
      <div class="hf-icon"><i class="fa-solid fa-chart-pie"></i></div>
      <div class="hf-content">
        <div class="hf-text">
          <h4>Market Analysis</h4>
          <p>In-depth market research and precise competitor analysis.</p>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- 4. About Section -->
<section id="about" class="about">
  <div class="deco-shape deco-circle"></div>
  <div class="deco-shape deco-dot"></div>
  <div class="container about-inner">
    <div class="about-images animate-up">
      <img src="https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=600" alt="Team Meeting" class="about-img-main">
      <img src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=400" alt="Analysis" class="about-img-sub">
      <div class="about-experience">
        <h3>27+</h3>
        <span>Years<br>Experience</span>
      </div>
    </div>
    <div class="about-text animate-up delay-2">
      <div class="section-title"><i class="fa-solid fa-circle-play"></i> About Our Company</div>
      <h2 class="section-heading">We Provide the Best Solutions for Your Business</h2>
      <p>Our dedicated team of financial experts brings decades of experience to help you navigate complex market challenges. We believe in data-driven strategies and transparent partnerships.</p>
      <ul class="about-list">
        <li><i class="fa-solid fa-check"></i> Certified Professionals</li>
        <li><i class="fa-solid fa-check"></i> Award Winning Agency</li>
        <li><i class="fa-solid fa-check"></i> 100% Satisfaction Rate</li>
        <li><i class="fa-solid fa-check"></i> 24/7 Premium Support</li>
      </ul>
      <a href="#services" class="btn-yellow" style="margin-top: 15px;">Discover More <i class="fa-solid fa-arrow-right"></i></a>
    </div>
  </div>
</section>

<!-- 5. Services Section -->
<section id="services" class="services">
  <div class="deco-shape deco-cross"></div>
  <div class="deco-shape deco-circle"></div>
  <div class="container">
    <div class="section-title" style="justify-content: center;"><i class="fa-solid fa-circle-play"></i> What We Offer</div>
    <h2 class="section-heading">Professional Services</h2>
    <div class="services-grid">
      <div class="service-card animate-up delay-1">
        <div class="srv-icon"><i class="fa-solid fa-chart-simple"></i></div>
        <h3>Financial Consulting</h3>
        <p>Comprehensive financial planning and strategic advisory to optimize your corporate resources.</p>
        <a href="#" class="srv-link"><span>Read More</span> <i class="fa-solid fa-arrow-right"></i></a>
      </div>
      <div class="service-card animate-up delay-2">
        <div class="srv-icon"><i class="fa-solid fa-bullseye"></i></div>
        <h3>Tax Strategy</h3>
        <p>Advanced tax planning to ensure compliance while minimizing corporate tax liabilities globally.</p>
        <a href="#" class="srv-link"><span>Read More</span> <i class="fa-solid fa-arrow-right"></i></a>
      </div>
      <div class="service-card animate-up delay-3">
        <div class="srv-icon"><i class="fa-solid fa-shield-halved"></i></div>
        <h3>Risk Management</h3>
        <p>Identifying and mitigating financial risks to protect your business assets and investments.</p>
        <a href="#" class="srv-link"><span>Read More</span> <i class="fa-solid fa-arrow-right"></i></a>
      </div>
      <div class="service-card animate-up delay-1">
        <div class="srv-icon"><i class="fa-solid fa-briefcase"></i></div>
        <h3>Investment Banking</h3>
        <p>Expert guidance on mergers, acquisitions, and capital raising for enterprise expansion.</p>
        <a href="#" class="srv-link"><span>Read More</span> <i class="fa-solid fa-arrow-right"></i></a>
      </div>
      <div class="service-card animate-up delay-2">
        <div class="srv-icon"><i class="fa-solid fa-magnifying-glass-dollar"></i></div>
        <h3>Audit & Assurance</h3>
        <p>Thorough auditing services providing transparency and trust for your stakeholders.</p>
        <a href="#" class="srv-link"><span>Read More</span> <i class="fa-solid fa-arrow-right"></i></a>
      </div>
      <div class="service-card animate-up delay-3">
        <div class="srv-icon"><i class="fa-solid fa-money-bill-trend-up"></i></div>
        <h3>Wealth Management</h3>
        <p>Personalized portfolio management strategies to grow and preserve corporate wealth.</p>
        <a href="#" class="srv-link"><span>Read More</span> <i class="fa-solid fa-arrow-right"></i></a>
      </div>
    </div>
  </div>
</section>

<!-- 6. CTA Banner -->
<section class="cta-banner">
  <div class="container cta-inner">
    <div class="cta-text animate-up">
      <h2>We provide the best solution for your business</h2>
      <p>Get in touch with our experts today to discuss your financial goals.</p>
    </div>
    
  </div>
</section>

<!-- 7. Why Choose Us -->
<section class="why-choose">
  <div class="deco-shape deco-cross"></div>
  <div class="container why-inner">
    <div class="why-text animate-up">
      <div class="section-title"><i class="fa-solid fa-circle-play"></i> Why Choose Us</div>
      <h2 class="section-heading">Your Trusted Partner in Financial Growth</h2>
      <p style="color: var(--text-muted); font-size: 1.1rem; margin-bottom: 30px;">We combine industry expertise with innovative technologies to deliver results that matter. Our commitment to excellence sets us apart from the competition.</p>
      <div class="why-features">
        <div class="w-feature">
          <div class="w-icon"><i class="fa-solid fa-user-tie"></i></div>
          <div class="w-text">
            <h4>Professional Team</h4>
            <p>Our analysts and advisors are top-tier industry veterans with proven track records.</p>
          </div>
        </div>
        <div class="w-feature">
          <div class="w-icon"><i class="fa-solid fa-lightbulb"></i></div>
          <div class="w-text">
            <h4>Innovative Strategies</h4>
            <p>We leverage AI and modern data analytics for sharper insights and faster execution.</p>
          </div>
        </div>
      </div>
    </div>
    <div class="why-images animate-up delay-2">
      <div class="why-img"><img src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=600" alt="Office"></div>
      <div class="why-img"><img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=600" alt="Meeting"></div>
    </div>
  </div>
</section>

<!-- 8. Diagonal Marquee -->
<section class="diagonal-marquee">
  <div class="marquee-strip-wrapper">
    <div class="marquee-strip strip-green">
      <div class="marquee-item"><i class="fa-solid fa-star"></i> EXPERT SOLUTIONS</div>
      <div class="marquee-item"><i class="fa-solid fa-star"></i> PROFESSIONAL SERVICES</div>
      <div class="marquee-item"><i class="fa-solid fa-star"></i> TRUSTED PARTNERS</div>
      <div class="marquee-item"><i class="fa-solid fa-star"></i> GLOBAL REACH</div>
      <div class="marquee-item"><i class="fa-solid fa-star"></i> EXPERT SOLUTIONS</div>
      <div class="marquee-item"><i class="fa-solid fa-star"></i> PROFESSIONAL SERVICES</div>
      <div class="marquee-item"><i class="fa-solid fa-star"></i> TRUSTED PARTNERS</div>
      <div class="marquee-item"><i class="fa-solid fa-star"></i> GLOBAL REACH</div>
      <div class="marquee-item"><i class="fa-solid fa-star"></i> EXPERT SOLUTIONS</div>
      <div class="marquee-item"><i class="fa-solid fa-star"></i> PROFESSIONAL SERVICES</div>
      <div class="marquee-item"><i class="fa-solid fa-star"></i> TRUSTED PARTNERS</div>
      <div class="marquee-item"><i class="fa-solid fa-star"></i> GLOBAL REACH</div>
    </div>
    <div class="marquee-strip strip-yellow">
      <div class="marquee-item"><i class="fa-solid fa-check-double"></i> INNOVATIVE STRATEGY</div>
      <div class="marquee-item"><i class="fa-solid fa-check-double"></i> MARKET ANALYSIS</div>
      <div class="marquee-item"><i class="fa-solid fa-check-double"></i> CONTINUOUS GROWTH</div>
      <div class="marquee-item"><i class="fa-solid fa-check-double"></i> 24/7 SUPPORT</div>
      <div class="marquee-item"><i class="fa-solid fa-check-double"></i> INNOVATIVE STRATEGY</div>
      <div class="marquee-item"><i class="fa-solid fa-check-double"></i> MARKET ANALYSIS</div>
      <div class="marquee-item"><i class="fa-solid fa-check-double"></i> CONTINUOUS GROWTH</div>
      <div class="marquee-item"><i class="fa-solid fa-check-double"></i> 24/7 SUPPORT</div>
      <div class="marquee-item"><i class="fa-solid fa-check-double"></i> INNOVATIVE STRATEGY</div>
      <div class="marquee-item"><i class="fa-solid fa-check-double"></i> MARKET ANALYSIS</div>
      <div class="marquee-item"><i class="fa-solid fa-check-double"></i> CONTINUOUS GROWTH</div>
      <div class="marquee-item"><i class="fa-solid fa-check-double"></i> 24/7 SUPPORT</div>
    </div>
  </div>
</section>

<!-- 9. Team Section -->
<section class="team">
  <div class="deco-shape deco-dot"></div>
  <div class="container">
    <div class="section-title" style="justify-content: center;"><i class="fa-solid fa-circle-play"></i> Team Members</div>
    <h2 class="section-heading">Meet Our Experts</h2>
    <div class="team-grid">
      <div class="team-card animate-up delay-1">
        <div class="team-img">
          <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400" alt="Team">
          <div class="team-overlay">
            <div class="team-socials">
              <a href="#"><i class="fa-brands fa-linkedin-in"></i></a>
              <a href="#"><i class="fa-brands fa-twitter"></i></a>
            </div>
          </div>
        </div>
        <div class="team-info">
          <h4>Sarah Jenkins</h4>
          <p>CEO & Founder</p>
        </div>
      </div>
      <div class="team-card animate-up delay-2">
        <div class="team-img">
          <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400" alt="Team">
          <div class="team-overlay">
            <div class="team-socials">
              <a href="#"><i class="fa-brands fa-linkedin-in"></i></a>
              <a href="#"><i class="fa-brands fa-twitter"></i></a>
            </div>
          </div>
        </div>
        <div class="team-info">
          <h4>Michael Chen</h4>
          <p>Senior Analyst</p>
        </div>
      </div>
      <div class="team-card animate-up delay-3">
        <div class="team-img">
          <img src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400" alt="Team">
          <div class="team-overlay">
            <div class="team-socials">
              <a href="#"><i class="fa-brands fa-linkedin-in"></i></a>
              <a href="#"><i class="fa-brands fa-twitter"></i></a>
            </div>
          </div>
        </div>
        <div class="team-info">
          <h4>David Miller</h4>
          <p>Tax Advisor</p>
        </div>
      </div>
      <div class="team-card animate-up delay-4">
        <div class="team-img">
          <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400" alt="Team">
          <div class="team-overlay">
            <div class="team-socials">
              <a href="#"><i class="fa-brands fa-linkedin-in"></i></a>
              <a href="#"><i class="fa-brands fa-twitter"></i></a>
            </div>
          </div>
        </div>
        <div class="team-info">
          <h4>Emma Stone</h4>
          <p>Wealth Manager</p>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- 10. Portfolio -->
<section id="projects" class="portfolio">
  <div class="container">
    <div class="section-title" style="justify-content: center; color: var(--secondary);"><i class="fa-solid fa-circle-play" style="color: #fff;"></i> Our Case Studies</div>
    <h2 class="section-heading" style="text-align: center;">Latest Projects</h2>
    <div class="port-grid">
      <div class="port-card animate-up delay-1">
        <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600" alt="Project">
        <a href="#" class="port-link"><i class="fa-solid fa-arrow-right"></i></a>
        <div class="port-overlay">
          <h4>Financial Restructuring</h4>
          <p>Corporate Finance</p>
        </div>
      </div>
      <div class="port-card animate-up delay-2">
        <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600" alt="Project">
        <a href="#" class="port-link"><i class="fa-solid fa-arrow-right"></i></a>
        <div class="port-overlay">
          <h4>Data Analytics Integration</h4>
          <p>Technology</p>
        </div>
      </div>
      <div class="port-card animate-up delay-3">
        <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=600" alt="Project">
        <a href="#" class="port-link"><i class="fa-solid fa-arrow-right"></i></a>
        <div class="port-overlay">
          <h4>Merger & Acquisition</h4>
          <p>Strategy</p>
        </div>
      </div>
      <div class="port-card animate-up delay-4">
        <img src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=600" alt="Project">
        <a href="#" class="port-link"><i class="fa-solid fa-arrow-right"></i></a>
        <div class="port-overlay">
          <h4>Tax Optimization</h4>
          <p>Accounting</p>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- 11. Our Process -->
<section id="process" class="process">
  <div class="deco-shape deco-dot"></div>
  <div class="container">
    <div class="section-title" style="justify-content: center;"><i class="fa-solid fa-circle-play"></i> Working Process</div>
    <h2 class="section-heading" style="text-align: center;">How We Work</h2>
    <div class="process-grid">
      <div class="process-card animate-up delay-1">
        <div class="process-icon">
          <i class="fa-solid fa-comments"></i>
          <span class="process-number">1</span>
        </div>
        <h4>Consultation</h4>
        <p>We meet to discuss your financial goals and understand your business needs thoroughly.</p>
      </div>
      <div class="process-card animate-up delay-2">
        <div class="process-icon">
          <i class="fa-solid fa-magnifying-glass-chart"></i>
          <span class="process-number">2</span>
        </div>
        <h4>Analysis</h4>
        <p>Our experts analyze your data to identify risks and opportunities for growth.</p>
      </div>
      <div class="process-card animate-up delay-3">
        <div class="process-icon">
          <i class="fa-solid fa-lightbulb"></i>
          <span class="process-number">3</span>
        </div>
        <h4>Strategy</h4>
        <p>We develop a customized, actionable plan designed specifically for your objectives.</p>
      </div>
      <div class="process-card animate-up delay-4">
        <div class="process-icon">
          <i class="fa-solid fa-rocket"></i>
          <span class="process-number">4</span>
        </div>
        <h4>Execution</h4>
        <p>We help you implement the strategy and monitor results for continuous improvement.</p>
      </div>
    </div>
  </div>
</section>

<!-- 12. Testimonials -->
<section class="testimonials">
  <div class="container">
    <div class="section-title" style="justify-content: center;"><i class="fa-solid fa-circle-play"></i> Client Feedbacks</div>
    <h2 class="section-heading">What They Say About Us</h2>
    <div class="testi-grid">
      <div class="testi-card animate-up delay-1">
        <div class="testi-stars"><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i></div>
        <p class="testi-text">"Their financial strategies completely transformed our operational efficiency. We saw a 40% increase in profitability within the first year of partnership."</p>
        <div class="testi-author">
          <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100" alt="Client">
          <div>
            <h4>Robert Fox</h4>
            <p>CEO, TechFlow</p>
          </div>
        </div>
      </div>
      <div class="testi-card animate-up delay-2">
        <div class="testi-stars"><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i></div>
        <p class="testi-text">"The depth of their market analysis gave us the confidence to expand internationally. A truly exceptional team of professionals who deliver results."</p>
        <div class="testi-author">
          <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100" alt="Client">
          <div>
            <h4>Jenny Wilson</h4>
            <p>Director, GlobalTrade</p>
          </div>
        </div>
      </div>
      <div class="testi-card animate-up delay-3">
        <div class="testi-stars"><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i></div>
        <p class="testi-text">"Outstanding tax advisory services. They helped us navigate complex regulations across borders and saved us significant amounts in corporate liabilities."</p>
        <div class="testi-author">
          <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100" alt="Client">
          <div>
            <h4>Guy Hawkins</h4>
            <p>Founder, InnovateInc</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- 13. Newsletter -->
<section class="newsletter">
  <div class="container">
    <div class="news-inner animate-up">
      <h2>Subscribe To Our Newsletter</h2>
      <form class="news-form">
        <input type="email" placeholder="Email Address..." required>
        <button type="submit">Subscribe <i class="fa-solid fa-arrow-right"></i></button>
      </form>
    </div>
  </div>
</section>

<!-- 14. Footer -->
<footer class="footer">
  <div class="container">
    <div class="foot-grid animate-up delay-2">
      <div class="foot-col">
        <div class="foot-logo">
          LOGO_PLACEHOLDER
        </div>
        <p class="footer-desc">Expert consulting and corporate strategy tailored for your success. We build lasting partnerships that drive results.</p>
        <div class="foot-social">
          <a href="#"><i class="fa-brands fa-facebook-f"></i></a>
          <a href="#"><i class="fa-brands fa-twitter"></i></a>
          <a href="#"><i class="fa-brands fa-linkedin-in"></i></a>
          <a href="#"><i class="fa-brands fa-instagram"></i></a>
        </div>
      </div>
      <div class="foot-col">
        <h4>Contact Info</h4>
        <ul class="foot-links">
          <li style="display: flex; gap: 10px; margin-bottom: 15px;"><i class="fa-solid fa-location-dot" style="color: var(--secondary); margin-top: 5px;"></i> <span>ADDRESS_PLACEHOLDER</span></li>
          <li style="display: flex; gap: 10px; margin-bottom: 15px;"><i class="fa-solid fa-phone" style="color: var(--secondary); margin-top: 5px;"></i> <span>PHONE_PLACEHOLDER</span></li>
          <li style="display: flex; gap: 10px;"><i class="fa-solid fa-envelope" style="color: var(--secondary); margin-top: 5px;"></i> <span>EMAIL_PLACEHOLDER</span></li>
        </ul>
      </div>
    </div>
    <div class="foot-bottom animate-up delay-3">
      <p>&copy; 2026 PROJECT_NAME_PLACEHOLDER. All rights reserved.</p>
      <div class="foot-legal">
        <a href="#" style="color: rgba(255,255,255,0.5); margin-left: 20px;">Privacy Policy</a>
        <a href="#" style="color: rgba(255,255,255,0.5); margin-left: 20px;">Terms of Service</a>
      </div>
    </div>
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
        } else if (!isInEditor) {
          e.preventDefault();
          var btn = e.target.querySelector('button[type="submit"]') || e.target.querySelector('input[type="submit"]');
          if (btn) {
            if(btn.innerText) btn.innerText = 'Sending...';
            else btn.value = 'Sending...';
          }
          setTimeout(function() {
            e.target.innerHTML = '<div style="padding: 20px; text-align: center; border: 2px dashed #22c55e; border-radius: 8px; background: rgba(34,197,94,0.1); color: #166534;"><h3 style="margin: 0 0 10px 0; font-size: 20px;">Thank You!</h3><p style="margin: 0;">Your request has been submitted successfully.</p></div>';
          }, 1000);
        }
      }
    }, true);
  })();
</script>

`
