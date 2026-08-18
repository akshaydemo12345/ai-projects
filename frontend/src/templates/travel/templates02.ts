export const travel02Styles = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

:root {
  --primary: PRIMARY_COLOR_PLACEHOLDER;
  --secondary: SECONDARY_COLOR_PLACEHOLDER;
  --accent: SECONDARY_COLOR_PLACEHOLDER;
  --dark: #0B1120;
  --light: #f8fafc;
  --gray: #64748b;
  --border: #e2e8f0;
  --font: 'Plus Jakarta Sans', sans-serif;
}

* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: var(--font); color: #334155; line-height: 1.6; background: #fff; }
img { max-width: 100%; display: block; }
a { text-decoration: none; color: inherit; transition: 0.3s; }
ul { list-style: none; }
button { font-family: var(--font); cursor: pointer; border: none; outline: none; }

.container { max-width: 1280px; margin: 0 auto; padding: 0 1.5rem; }

/* NAVBAR */
.navbar { background: #fff; padding: 1.25rem 0; position: fixed; width: 100%; top: 0; z-index: 1000; box-shadow: 0 4px 20px rgba(0,0,0,0.03); }
.nav-inner { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; }
.logo { font-size: 1.5rem; font-weight: 800; color: #0f172a; display: flex; flex-wrap: wrap; align-items: center; gap: 0.5rem; }
.logo i { color: var(--primary); }
.nav-links { display: flex; flex-wrap: wrap; gap: 2rem; }
.nav-links a { font-weight: 600; color: #475569; font-size: 0.95rem; transition: 0.3s; }
.nav-links a:hover { color: var(--primary); }
.nav-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 1.5rem; }

.dropdown { position: relative; display: inline-block; }
.dropdown-toggle { font-weight: 600; color: #475569; background: transparent; padding: 0.5rem 1rem; display: flex; flex-wrap: wrap; align-items: center; gap: 0.5rem; border-radius: 6px; transition: 0.3s; }
.dropdown-toggle:hover { background: #f1f5f9; color: var(--primary); }
.dropdown-toggle i { transition: 0.3s; }
.dropdown-toggle.active i { transform: rotate(180deg); }

.dropdown-menu { position: absolute; top: 100%; right: 0; background: #fff; border: 1px solid var(--border); border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); min-width: 200px; padding: 0.5rem 0; margin-top: 0.5rem; display: none; z-index: 1001; }
.dropdown-menu.active { display: block; }
.dropdown-menu a { display: block; padding: 0.75rem 1.5rem; color: #475569; transition: 0.3s; }
.dropdown-menu a:hover { background: #f1f5f9; color: var(--primary); }

.btn-signup { background: var(--btn-bg, var(--primary)); color: var(--btn-text, #fff); padding: 0.75rem 1.5rem; border-radius: 50px; font-weight: 600; transition: 0.3s; }
.btn-signup:hover { background: var(--secondary) !important; color: var(--btn-text, #fff) !important; box-shadow: 0 10px 20px rgba(0,0,0,0.15); }

/* HERO */
.hero { margin-top: 80px; position: relative; height: 600px; display: flex; flex-wrap: wrap; align-items: center; justify-content: center; overflow: hidden; background-color: #000; }
.hero-bg-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: 0; }
.hero::before { content: ''; position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.2)); z-index: 1; }
.hero-content { position: relative; z-index: 2; text-align: center; color: #fff; width: 100%; max-width: 800px; padding: 0 1.5rem; }
.hero-title { font-size: 3.5rem; font-weight: 800; line-height: 1.2; margin-bottom: 1rem; }
.hero-subtitle { font-size: 1.1rem; opacity: 0.9; margin-bottom: 3rem; font-weight: 500; }

/* BOOKING FORM */
.booking-box { background: #fff; border-radius: 20px; padding: 2.5rem; box-shadow: 0 20px 40px rgba(0,0,0,0.15); text-align: left; margin: -80px auto 4rem; position: relative; width: 90%; max-width: 1000px; z-index: 10; }
.booking-title { font-size: 1.2rem; font-weight: 700; color: #0f172a; margin-bottom: 1.5rem; display: flex; flex-wrap: wrap; align-items: center; gap: 0.5rem; }
.booking-title i { color: var(--primary); font-size: 1.3rem; }

.scroll-fade-up {
  opacity: 0;
  transform: translateY(50px);
  transition: all 0.8s ease;
}

.scroll-fade-up.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.booking-form-wrap { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; margin-bottom: 1.5rem; }
.field { display: flex; flex-wrap: wrap; flex-direction: column; gap: 0.5rem; position: relative; }
.field label { font-size: 0.85rem; font-weight: 700; color: #0f172a; display: flex; flex-wrap: wrap; align-items: center; gap: 0.5rem; }
.field label i { color: var(--primary); }
.field input, .field select { padding: 0.75rem 1rem; border: 1px solid var(--border); border-radius: 8px; font-family: var(--font); font-size: 0.95rem; color: #475569; outline: none; background: #fff; transition: 0.3s; }
.field input:focus, .field select:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(0,0,0,0.05); }
.field input::placeholder { color: #cbd5e1; }

.btn-search { background: var(--btn-bg, var(--primary)); color: var(--btn-text, #fff); padding: 0.75rem 1.25rem; border-radius: 8px; display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 0.5rem; font-size: 1rem; font-weight: 600; transition: 0.3s; height: 48px; min-width: 120px; }
.btn-search:hover { background: var(--secondary) !important; color: var(--btn-text, #fff) !important; transform: translateY(-2px); box-shadow: 0 8px 16px rgba(0,0,0,0.15); }

/* DESTINATIONS */
.section { padding: 6rem 0 4rem; margin-top: 2rem; }
.section:first-of-type { margin-top: 120px; }
.section-header { text-align: center; margin-bottom: 3rem; }
.section-title { font-size: 2.25rem; font-weight: 800; color: #0f172a; margin-bottom: 0.5rem; }
.section-subtitle { color: var(--gray); font-size: 1.1rem; }

/* DESTINATIONS CAROUSEL */
.dest-container { position: relative; }
.dest-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 2rem; }
.dest-item { text-align: center; cursor: pointer; transition: 0.3s; }
.dest-img { width: 140px; height: 140px; border-radius: 50%; object-fit: cover; margin: 0 auto 1rem; border: 4px solid #fff; box-shadow: 0 10px 20px rgba(0,0,0,0.08); transition: 0.3s; }
.dest-item:hover .dest-img { transform: scale(1.1); border-color: var(--primary); box-shadow: 0 15px 30px rgba(0,0,0,0.15); }
.dest-name { font-weight: 700; color: #0f172a; font-size: 1.1rem; margin-bottom: 0.3rem; }
.dest-tours { font-size: 0.85rem; color: var(--gray); font-weight: 500; }

.carousel-nav { position: absolute; top: 50%; transform: translateY(-50%); background: var(--primary); color: #fff; width: 40px; height: 40px; border-radius: 50%; display: flex; flex-wrap: wrap; align-items: center; justify-content: center; cursor: pointer; z-index: 5; transition: 0.3s; box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
.carousel-nav:hover { background: var(--secondary); transform: translateY(-50%) scale(1.1); }
.carousel-nav.prev { left: -60px; }
.carousel-nav.next { right: -60px; }

.dots { display: flex; flex-wrap: wrap; justify-content: center; gap: 0.5rem; margin-top: 2.5rem; }
.dot { width: 10px; height: 10px; border-radius: 50%; background: #cbd5e1; cursor: pointer; transition: 0.3s; }
.dot.active { background: var(--primary); width: 30px; border-radius: 10px; }
.dot:hover { background: #94a3b8; }

/* TOURS (ARCHED) */
input[name="tour-filter"] { display: none; }
#filter-all:checked ~ .tour-filters label[for="filter-all"],
#filter-family:checked ~ .tour-filters label[for="filter-family"],
#filter-honeymoon:checked ~ .tour-filters label[for="filter-honeymoon"],
#filter-luxury:checked ~ .tour-filters label[for="filter-luxury"],
#filter-wildlife:checked ~ .tour-filters label[for="filter-wildlife"] { background: var(--primary); color: #fff; border-color: var(--primary); }

#filter-family:checked ~ .tours-grid .tour-card:not([data-category~="family"]),
#filter-honeymoon:checked ~ .tours-grid .tour-card:not([data-category~="honeymoon"]),
#filter-luxury:checked ~ .tours-grid .tour-card:not([data-category~="luxury"]),
#filter-wildlife:checked ~ .tours-grid .tour-card:not([data-category~="wildlife"]) { display: none; }

.tour-filters { display: flex; flex-wrap: wrap; justify-content: center; gap: 1rem; margin-bottom: 3rem; flex-wrap: wrap; }
.filter-btn { padding: 0.6rem 1.5rem; border-radius: 50px; font-weight: 600; font-size: 0.95rem; color: var(--gray); background: #f1f5f9; transition: 0.3s; cursor: pointer; border: 2px solid transparent; display: inline-block; }
.filter-btn:hover { background: #e2e8f0; }

.tours-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2.5rem; }
.tour-card { background: #fff; border-radius: 120px 120px 20px 20px; padding: 10px 10px 20px 10px; box-shadow: 0 15px 35px rgba(0,0,0,0.05); transition: 0.3s; border: 1px solid var(--border); }
.tour-card:hover { transform: translateY(-12px); box-shadow: 0 25px 50px rgba(0,0,0,0.12); }
.tour-img-wrap { width: 100%; height: 240px; border-radius: 110px 110px 15px 15px; overflow: hidden; position: relative; margin-bottom: 1.5rem; }
.tour-img { width: 100%; height: 100%; object-fit: cover; transition: 0.5s; }
.tour-card:hover .tour-img { transform: scale(1.1); }
.tour-badge { position: absolute; top: 20px; left: 50%; transform: translateX(-50%); background: rgba(255,255,255,0.95); padding: 0.5rem 1.2rem; border-radius: 20px; font-size: 0.8rem; font-weight: 700; color: var(--primary); backdrop-filter: blur(10px); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }

.tour-info { padding: 0 1rem; }
.tour-meta { display: flex; flex-wrap: wrap; justify-content: space-between; font-size: 0.85rem; color: var(--gray); margin-bottom: 0.75rem; font-weight: 600; }
.tour-meta span i { color: #f59e0b; margin-right: 0.4rem; }
.tour-title { font-size: 1.15rem; font-weight: 800; color: #0f172a; margin-bottom: 1rem; line-height: 1.4; }
.tour-footer { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; border-top: 1px dashed var(--border); padding-top: 1rem; }
.tour-price { display: flex; flex-wrap: wrap; flex-direction: column; }
.price-val { font-size: 1.35rem; font-weight: 800; color: var(--primary); }
.price-old { font-size: 0.85rem; color: #94a3b8; text-decoration: line-through; }
.btn-link { font-weight: 700; color: var(--primary); font-size: 0.95rem; display: flex; flex-wrap: wrap; align-items: center; gap: 0.5rem; transition: 0.3s; }
.btn-link:hover { color: var(--secondary); gap: 0.8rem; }

.view-all-box { text-align: center; margin-top: 4rem; }
.btn-view-all { background: var(--btn-bg, var(--primary)); color: var(--btn-text, #fff); padding: 1rem 2.5rem; border-radius: 50px; font-weight: 700; font-size: 1rem; box-shadow: 0 10px 25px rgba(0,0,0,0.15); transition: 0.3s; }
.btn-view-all:hover { background: var(--secondary) !important; color: var(--btn-text, #fff) !important; transform: translateY(-3px); box-shadow: 0 15px 35px rgba(0,0,0,0.25); }

/* WHY CHOOSE US */
.why-section { padding: 6rem 0; position: relative; overflow: hidden; background-color: #0f172a; }
.why-bg-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: 0; }
.why-section::before { content: ''; position: absolute; inset: 0; background: rgba(15, 23, 42, 0.8); backdrop-filter: blur(2px); z-index: 1; }
.why-section .section-title { color: #fff; position: relative; z-index: 2; }
.why-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2rem; position: relative; z-index: 2; margin-top: 3rem; }
.why-card { background: #fff; padding: 2.5rem 1.5rem; border-radius: 20px; text-align: center; box-shadow: 0 20px 40px rgba(0,0,0,0.1); transition: 0.3s; }
.why-card:hover { transform: translateY(-10px); box-shadow: 0 30px 60px rgba(0,0,0,0.15); }
.why-icon { width: 70px; height: 70px; border-radius: 20px; display: flex; flex-wrap: wrap; align-items: center; justify-content: center; font-size: 1.8rem; margin: 0 auto 1.5rem; }
.icon-1 { background: #e0e7ff; color: #4f46e5; }
.icon-2 { background: #dbeafe; color: #2563eb; }
.icon-3 { background: #fce7f3; color: #db2777; }
.icon-4 { background: #fef3c7; color: #d97706; }
.why-title { font-size: 1.15rem; font-weight: 800; color: #0f172a; margin-bottom: 0.75rem; }
.why-desc { font-size: 0.95rem; color: var(--gray); line-height: 1.6; }

/* JOURNEY PLACES (VIDEO GRID) */
.journey-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 20px; margin-top: 3rem; }
.journey-main { height: 500px; border-radius: 24px; overflow: hidden; position: relative; }
.journey-side { display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; gap: 20px; height: 500px; }
.journey-item { position: relative; border-radius: 20px; overflow: hidden; }
.journey-item img, .journey-item video { width: 100%; height: 100%; object-fit: cover; transition: 0.5s; }
.journey-item:hover img, .journey-item:hover video { transform: scale(1.05); }

/* LIMITED OFFER */
.offer-banner { background: linear-gradient(135deg, var(--dark) 0%, #1a2942 100%); border-radius: 24px; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; overflow: hidden; margin-top: 4rem; position: relative; }
.offer-content { padding: 4rem; color: #fff; flex: 1; z-index: 2; }
.offer-content h2 { font-size: 2.5rem; font-weight: 800; margin-bottom: 1rem; line-height: 1.2; }
.offer-content p { color: #cbd5e1; font-size: 1.1rem; margin-bottom: 2rem; max-width: 400px; }
.btn-white { background: #fff; color: var(--dark); padding: 1rem 2.5rem; border-radius: 50px; font-weight: 700; display: inline-block; transition: 0.3s; }
.btn-white:hover { box-shadow: 0 10px 25px rgba(0,0,0,0.2); transform: translateY(-2px); }
.offer-img-box { position: relative; width: 50%; height: 400px; }
.offer-img-box img { width: 100%; height: 100%; object-fit: cover; mask-image: linear-gradient(to right, transparent, black 20%); -webkit-mask-image: linear-gradient(to right, transparent, black 20%); }
.discount-badge { position: absolute; top: 50%; left: 0; transform: translate(-50%, -50%); width: 140px; height: 140px; background: var(--primary); border-radius: 50%; display: flex; flex-wrap: wrap; flex-direction: column; align-items: center; justify-content: center; color: #fff; font-weight: 800; box-shadow: 0 15px 30px rgba(0,0,0,0.3); border: 8px solid var(--dark); z-index: 3; }
.discount-badge .num { font-size: 2.5rem; line-height: 1; }
.discount-badge .text { font-size: 1rem; }

/* TESTIMONIALS */
.testi-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; margin-top: 3rem; }
.testi-card { background: #fff; border: 1px solid var(--border); padding: 2.5rem; border-radius: 20px; transition: 0.3s; text-align: left; }
.testi-card:hover { border-color: var(--primary); box-shadow: 0 20px 40px rgba(0,0,0,0.08); transform: translateY(-8px); }
.testi-title { font-size: 1.25rem; font-weight: 800; color: #0f172a; margin-bottom: 1rem; }
.testi-text { color: var(--gray); font-size: 0.95rem; margin-bottom: 2rem; line-height: 1.6; }
.testi-author { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; border-top: 1px solid var(--border); padding-top: 1.5rem; }
.author-info { display: flex; flex-wrap: wrap; align-items: center; gap: 1rem; }
.author-img { width: 45px; height: 45px; border-radius: 50%; object-fit: cover; }
.author-name { font-weight: 700; color: #0f172a; font-size: 0.95rem; }
.author-loc { font-size: 0.8rem; color: var(--gray); }
.stars { color: #f59e0b; font-size: 0.85rem; }
 /* FAQ */
    .v2-section-head { padding: 3rem 0rem; text-align: center; margin-bottom: 60px; display: flex; flex-wrap: wrap; flex-direction: column; gap: 16px; align-items: center; }
    .t-h2 { font-family: 'Playfair Display', serif; font-size: clamp(28px,3.5vw,44px); line-height: 1.2; font-weight: 600; letter-spacing: -0.01em; }
    .t-body { font-family: var(--font-body); font-size: 15px; line-height: 1.65; font-weight: 400; }
    .col-muted { color: var(--text-muted); }
    .v2-tag {
      display: inline-flex; flex-wrap: wrap;
      align-items: center;
      gap: 6px;
      padding: 5px 14px;
      border-radius: 100px;
      background: #f1f5f9;
      color: var(--primary);
      font-family: var(--font-body);
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }
 
    .v2-faq-wrap { max-width: 720px; margin: 0 auto; }
    .v2-faq-list { display: flex; flex-wrap: wrap; flex-direction: column; gap: 12px; }
    .v2-faq-item {
      background: #fff;
      border-radius: var(--radius-md);
      border: 1px solid var(--border);
      overflow: hidden;
      transition: all 0.3s ease;
    }
    .v2-faq-item:hover {
      box-shadow: 0 8px 20px rgba(0,0,0,0.08);
    }
    .v2-faq-item[open] {
      border-color: var(--primary);
      box-shadow: 0 15px 35px rgba(0,0,0,0.1);
      background: #fafafa;
    }
 
    .v2-faq-summary {
      display: flex; flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px;
      cursor: pointer;
      list-style: none;
      font-size: 16px;
      font-weight: 600;
      color: var(--on-surface);
      transition: color 0.2s ease;
    }
 
    .v2-faq-summary::-webkit-details-marker { 
      display: none; 
    }
 
    .v2-faq-summary .material-symbols-outlined { 
      transition: transform 0.25s ease;
      color: var(--primary);
      font-size: 20px;
    }
 
    .v2-faq-item[open] .v2-faq-summary { 
      color: var(--primary); 
    }
 
    .v2-faq-item[open] .v2-faq-summary .material-symbols-outlined { 
      transform: rotate(180deg); 
    }
 
    .v2-faq-summary:hover {
      color: var(--primary);
    }
 
    .v2-faq-body { 
      padding: 0 24px 20px;
      font-size: 14px;
      color: var(--text-muted);
      line-height: 1.7;
      border-top: 1px solid var(--border);
      padding-top: 16px;
      animation: faqSlideDown 0.3s ease;
    }
 
    @keyframes faqSlideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
/* INSIGHTS */
.insights-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; margin-top: 3rem; }
.blog-card { background: #fff; border: 1px solid var(--border); border-radius: 20px; padding: 1.5rem; transition: 0.3s; }
.blog-card:hover { border-color: var(--primary); transform: translateY(-8px); box-shadow: 0 15px 30px rgba(0,0,0,0.08); }
.blog-img { width: 100%; height: 200px; border-radius: 12px; object-fit: cover; margin-bottom: 1.5rem; }
.blog-meta { display: flex; flex-wrap: wrap; justify-content: space-between; font-size: 0.85rem; color: var(--gray); margin-bottom: 0.75rem; font-weight: 600; }
.blog-title { font-size: 1.15rem; font-weight: 800; color: #0f172a; margin-bottom: 1rem; line-height: 1.5; }
.blog-link { font-weight: 700; color: var(--primary); font-size: 0.9rem; transition: 0.3s; }
.blog-link:hover { color: var(--secondary); }

/* NEWSLETTER */
.newsletter { background: #e0f2fe; border-radius: 24px; padding: 4rem; display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; margin-top: 4rem; }
.nl-img { border-radius: 20px; height: 300px; object-fit: cover; width: 100%; box-shadow: 0 20px 40px rgba(0,0,0,0.1); }
.nl-content h2 { font-size: 2.25rem; font-weight: 800; color: #0f172a; margin-bottom: 1rem; line-height: 1.3; }
.nl-content p { color: #475569; margin-bottom: 2rem; font-size: 1.05rem; }
.nl-form { display: flex; flex-wrap: wrap; gap: 1rem; }
.nl-form input { flex: 1; padding: 1rem 1.5rem; border-radius: 50px; border: none; font-family: var(--font); font-size: 1rem; outline: none; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
.nl-form input::placeholder { color: #cbd5e1; }
.btn-sub { background: var(--btn-bg, var(--primary)); color: var(--btn-text, #fff); padding: 0 2rem; border-radius: 50px; font-weight: 700; font-size: 1rem; box-shadow: 0 10px 20px rgba(0,0,0,0.1); transition: 0.3s; }
.btn-sub:hover { background: var(--secondary) !important; color: var(--btn-text, #fff) !important; transform: translateY(-2px); box-shadow: 0 15px 30px rgba(0,0,0,0.15); }

/* FOOTER */
footer { background: var(--dark); color: #94a3b8; padding: 5rem 0 2rem; margin-top: 4rem; }
.foot-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 4rem; margin-bottom: 4rem; }
.foot-col h4 { color: #fff; font-size: 1.1rem; font-weight: 700; margin-bottom: 1.5rem; }
.foot-links { display: flex; flex-wrap: wrap; flex-direction: column; gap: 1rem; }
.foot-links a { color: #94a3b8; transition: 0.3s; }
.foot-links a:hover { color: #fff; color: var(--primary); }
.foot-col select { background: transparent; color: #fff; border: 1px solid #334155; padding: 0.75rem; width: 100%; border-radius: 8px; font-family: var(--font); cursor: pointer; }
.foot-col select option { background: var(--dark); color: #fff; }
.foot-bottom { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; padding-top: 2rem; border-top: 1px solid rgba(255,255,255,0.1); font-size: 0.9rem; }
.socials { display: flex; flex-wrap: wrap; gap: 1rem; }
.socials a { width: 36px; height: 36px; border-radius: 50%; background: rgba(255,255,255,0.1); display: flex; flex-wrap: wrap; align-items: center; justify-content: center; color: #fff; transition: 0.3s; }
.socials a:hover { background: var(--primary); }

@media (max-width: 1024px) {
  .booking-form-wrap { grid-template-columns: repeat(2, 1fr); }
  .btn-search { width: 100%; }
  .tours-grid { grid-template-columns: repeat(2, 1fr); }
  .why-grid { grid-template-columns: repeat(2, 1fr); }
  .journey-grid { grid-template-columns: 1fr; }
  .journey-side { height: 400px; }
  .offer-banner { flex-direction: column; }
  .offer-img-box { width: 100%; height: 300px; }
  .offer-img-box img { mask-image: none; -webkit-mask-image: none; }
  .discount-badge { top: 0; left: 50%; transform: translate(-50%, -50%); }
  .testi-grid, .insights-grid { grid-template-columns: repeat(2, 1fr); }
  .newsletter { grid-template-columns: 1fr; padding: 2rem; }
  .foot-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 768px) {
  .nav-links { display: none; }
  .hero-title { font-size: 2.5rem; }
  .hero-subtitle { font-size: 0.95rem; }
  .booking-box { margin: -40px auto 2rem; width: 95%; padding: 1.5rem; }
  .booking-form-wrap { grid-template-columns: 1fr; }
  .btn-search { width: 100%; }
  .dest-grid { grid-template-columns: repeat(1, 1fr); }
  .carousel-nav { display: none; }
  .tours-grid { grid-template-columns: 1fr; }
  .why-grid { grid-template-columns: 1fr; }
  .testi-grid, .insights-grid { grid-template-columns: 1fr; }
  .nl-form { flex-direction: column; }
  .btn-sub { width: 100%; }
  .foot-grid { grid-template-columns: 1fr; }
  .foot-bottom { flex-direction: column; gap: 1rem; text-align: center; }
}


  /* Extracted Template Inline Styles */
  .tpl-templates02-1 { background: #f8fafc; }
  .tpl-templates02-2 { color: #cbd5e1; }
  .tpl-templates02-3 { background: #f8fafc; }
  .tpl-templates02-4 { background: #f8fafc; }
  .tpl-templates02-5 { border: 2px dashed #22c55e; border-radius: 8px; background: rgba(34,197,94,0.1); color: #166534; }
`

export const travel02Html = `


<section class="hero">
  <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=2000" class="hero-bg-img" alt="Travel Destination" />
  <div class="hero-content">
    <h1 class="hero-title">Travel Far, Live Fully, and Come Alive in Every Moment.</h1>
    <p class="hero-subtitle">It inspires you to go see the world, enjoy every moment, and feel truly alive.</p>
  </div>
  
</section>
  
<form class="booking-box">
  <div class="booking-title">
    <i class="fas fa-suitcase"></i> Plan Your Trip
  </div>
  <div class="booking-form-wrap">
    <div class="field">
      <label><i class="fas fa-user"></i> Full Name</label>
      <input type="text" placeholder="Enter your name" required>
    </div>
    <div class="field">
      <label><i class="fas fa-envelope"></i> Email Address</label>
      <input type="email" placeholder="Enter your email" required>
    </div>
    <div class="field">
      <label><i class="fas fa-map-marker-alt"></i> Destination</label>
      <input type="text" placeholder="Where to?" required>
    </div>
    <div class="field">
      <label><i class="far fa-calendar-alt"></i> Date</label>
      <input type="date" required>
    </div>
    <div class="field">
      <label><i class="fas fa-user-friends"></i> Guests</label>
      <select required>
        <option>1 Person</option>
        <option>2 People</option>
        <option>3+ People</option>
      </select>
    </div>
    <div class="field">
      <label><i class="fas fa-plane-departure"></i> Type</label>
      <select required>
        <option>Flight + Hotel</option>
        <option>Hotel Only</option>
        <option>Flight Only</option>
      </select>
    </div>
  </div>
  <div style="text-align: center; margin-top: 1rem;">
    <button type="submit" class="btn-search" style="display: inline-flex; flex-wrap: wrap; min-width: 200px; height: 50px; font-size: 1.1rem; margin: 0 auto;">Book Now</button>
  </div>
</form>

<section class="section" id="destinations">
  <div class="container">
    <div class="section-header">
      <h2 class="section-title">Explore Our Popular Destinations</h2>
      <p class="section-subtitle">Favorite destinations based on customer reviews</p>
    </div>
    <div class="dest-container">
      <div class="dest-grid" id="destGrid">
        <div class="dest-item">
          <img src="https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&q=80&w=300" alt="Venice" class="dest-img">
          <h3 class="dest-name">Venice</h3>
          <p class="dest-tours">356 Tours</p>
        </div>
        <div class="dest-item">
          <img src="https://images.unsplash.com/photo-1532236204992-f5e85c024202?auto=format&fit=crop&q=80&w=800" alt="Bali" class="dest-img">
          <h3 class="dest-name">Bali</h3>
          <p class="dest-tours">286 Tours</p>
        </div>
        <div class="dest-item">
          <img src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&q=80&w=300" alt="James Bond Island" class="dest-img">
          <h3 class="dest-name">James Bond Island</h3>
          <p class="dest-tours">256 Tours</p>
        </div>
        <div class="dest-item">
          <img src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=300" alt="Phuket" class="dest-img">
          <h3 class="dest-name">Phuket</h3>
          <p class="dest-tours">258 Tours</p>
        </div>
        <div class="dest-item">
          <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=300" alt="Chiang Mai" class="dest-img">
          <h3 class="dest-name">Chiang Mai</h3>
          <p class="dest-tours">228 Tours</p>
        </div>
        <div class="dest-item">
          <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300" alt="Bana Hills" class="dest-img">
          <h3 class="dest-name">Bana Hills</h3>
          <p class="dest-tours">105 Tours</p>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="section tpl-templates02-1" id="tours"  >
  <div class="container">
    <div class="section-header">
      <h2 class="section-title">Curated Tours Just for You</h2>
      <p class="section-subtitle">Handpicked experiences from our expert guides</p>
    </div>
    
    <input type="radio" name="tour-filter" id="filter-all" checked required>
    <input type="radio" name="tour-filter" id="filter-family" required>
    <input type="radio" name="tour-filter" id="filter-honeymoon" required>
    <input type="radio" name="tour-filter" id="filter-luxury" required>
    <input type="radio" name="tour-filter" id="filter-wildlife" required>

    <div class="tour-filters">
      <label for="filter-all" class="filter-btn">Show All</label>
      <label for="filter-family" class="filter-btn">Family Tour</label>
      <label for="filter-honeymoon" class="filter-btn">Honeymoon Tour</label>
      <label for="filter-luxury" class="filter-btn">Luxury Tour</label>
      <label for="filter-wildlife" class="filter-btn">Wildlife Safari</label>
    </div>

    <div class="tours-grid">
      <div class="tour-card" data-category="all family luxury">
        <div class="tour-img-wrap">
          <div class="tour-badge">Best Seller</div>
          <img src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=600" alt="Tour" class="tour-img">
        </div>
        <div class="tour-info">
          <div class="tour-meta">
            <span><i class="fas fa-star"></i> 4.8 (120)</span>
            <span>2 Days | 1 Night</span>
          </div>
          <h3 class="tour-title">California Sunset Boat Cruise</h3>
          <div class="tour-footer">
            <div class="tour-price">
              <span class="price-old">$450</span>
              <span class="price-val">$340</span>
            </div>
            <a href="javascript:void(0);" class="btn-link">Book <i class="fas fa-arrow-right"></i></a>
          </div>
        </div>
      </div>
      
      <div class="tour-card" data-category="all family">
        <div class="tour-img-wrap">
          <img src="https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&q=80&w=600" alt="Tour" class="tour-img">
        </div>
        <div class="tour-info">
          <div class="tour-meta">
            <span><i class="fas fa-star"></i> 4.9 (85)</span>
            <span>4 Days | 3 Nights</span>
          </div>
          <h3 class="tour-title">Pacific Coastal Sailing Tours</h3>
          <div class="tour-footer">
            <div class="tour-price">
              <span class="price-old">$350</span>
              <span class="price-val">$280</span>
            </div>
            <a href="javascript:void(0);" class="btn-link">Book <i class="fas fa-arrow-right"></i></a>
          </div>
        </div>
      </div>

      <div class="tour-card" data-category="all luxury honeymoon">
        <div class="tour-img-wrap">
          <img src="https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?auto=format&fit=crop&q=80&w=600" alt="Tour" class="tour-img">
        </div>
        <div class="tour-info">
          <div class="tour-meta">
            <span><i class="fas fa-star"></i> 4.7 (94)</span>
            <span>4 Days | 3 Nights</span>
          </div>
          <h3 class="tour-title">Golden Gate Sunset Bay Cruise</h3>
          <div class="tour-footer">
            <div class="tour-price">
              <span class="price-old">$420</span>
              <span class="price-val">$340</span>
            </div>
            <a href="javascript:void(0);" class="btn-link">Book <i class="fas fa-arrow-right"></i></a>
          </div>
        </div>
      </div>
      
      <div class="tour-card" data-category="all wildlife">
        <div class="tour-img-wrap">
          <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600" alt="Tour" class="tour-img">
        </div>
        <div class="tour-info">
          <div class="tour-meta">
            <span><i class="fas fa-star"></i> 4.8 (112)</span>
            <span>3 Days | 2 Nights</span>
          </div>
          <h3 class="tour-title">Laguna Beach Ocean Yacht Ride</h3>
          <div class="tour-footer">
            <div class="tour-price">
              <span class="price-old">$400</span>
              <span class="price-val">$340</span>
            </div>
            <a href="javascript:void(0);" class="btn-link">Book <i class="fas fa-arrow-right"></i></a>
          </div>
        </div>
      </div>

      <div class="tour-card" data-category="all luxury family">
        <div class="tour-img-wrap">
          <div class="tour-badge">Popular</div>
          <img src="https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&q=80&w=600" alt="Tour" class="tour-img">
        </div>
        <div class="tour-info">
          <div class="tour-meta">
            <span><i class="fas fa-star"></i> 5.0 (204)</span>
            <span>5 Days | 4 Nights</span>
          </div>
          <h3 class="tour-title">San Diego Harbor Dinner Sail</h3>
          <div class="tour-footer">
            <div class="tour-price">
              <span class="price-old">$550</span>
              <span class="price-val">$410</span>
            </div>
            <a href="javascript:void(0);" class="btn-link">Book <i class="fas fa-arrow-right"></i></a>
          </div>
        </div>
      </div>

      <div class="tour-card" data-category="all wildlife">
        <div class="tour-img-wrap">
          <img src="https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&q=80&w=600" alt="Tour" class="tour-img">
        </div>
        <div class="tour-info">
          <div class="tour-meta">
            <span><i class="fas fa-star"></i> 4.6 (67)</span>
            <span>6 Days | 5 Nights</span>
          </div>
          <h3 class="tour-title">Monterey Bay Wildlife Trip</h3>
          <div class="tour-footer">
            <div class="tour-price">
              <span class="price-old">$650</span>
              <span class="price-val">$520</span>
            </div>
            <a href="javascript:void(0);" class="btn-link">Book <i class="fas fa-arrow-right"></i></a>
          </div>
        </div>
      </div>
    </div>

    <div class="view-all-box">
      <button class="btn-view-all">View All Packages</button>
    </div>
  </div>
</section>

<section class="why-section">
  <img src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=2000" class="why-bg-img" alt="Why Choose Us Background" />
  <div class="container">
    <div class="section-header">
      <h2 class="section-title">Why We're Your Best Choice</h2>
      <p class="section-subtitle tpl-templates02-2"  >Reasons to choose PROJECT_NAME_PLACEHOLDER for your next adventure</p>
    </div>
    <div class="why-grid">
      <div class="why-card">
        <div class="why-icon icon-1"><i class="fas fa-map-marked-alt"></i></div>
        <h3 class="why-title">Plan Smart, Travel Happy</h3>
        <p class="why-desc">Our experts design the perfect itinerary tailored to you.</p>
      </div>
      <div class="why-card">
        <div class="why-icon icon-2"><i class="fas fa-suitcase-rolling"></i></div>
        <h3 class="why-title">Pack Light, Explore More</h3>
        <p class="why-desc">We handle the logistics so you can focus on the experience.</p>
      </div>
      <div class="why-card">
        <div class="why-icon icon-3"><i class="fas fa-heart"></i></div>
        <h3 class="why-title">Heart-warming Experiences</h3>
        <p class="why-desc">Connect deeply with locals and create lasting memories.</p>
      </div>
      <div class="why-card">
        <div class="why-icon icon-4"><i class="fas fa-shield-alt"></i></div>
        <h3 class="why-title">Relax Well, Journey Better</h3>
        <p class="why-desc">Enjoy peace of mind with 24/7 travel support.</p>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-header">
      <h2 class="section-title">A Journey Through The Planet's Most Captivating Places</h2>
      <p class="section-subtitle">Discover amazing destinations around the world</p>
    </div>
    
    <div class="journey-grid">
      <div class="journey-main journey-item" style="display: block;">
        <video src="https://www.w3schools.com/html/mov_bbb.mp4" poster="https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&q=80&w=800" controls style="width: 100%; height: 100%; object-fit: cover;"></video>
      </div>
      <div class="journey-side">
        <div class="journey-item" style="display: block;">
          <video src="https://www.w3schools.com/html/mov_bbb.mp4" poster="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=400" controls style="width: 100%; height: 100%; object-fit: cover;"></video>
        </div>
        <div class="journey-item" style="display: block;">
          <video src="https://www.w3schools.com/html/mov_bbb.mp4" poster="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=400" controls style="width: 100%; height: 100%; object-fit: cover;"></video>
        </div>
        <div class="journey-item" style="display: block;">
          <video src="https://www.w3schools.com/html/mov_bbb.mp4" poster="https://images.unsplash.com/photo-1500595046891-9fdf982b6158?auto=format&fit=crop&q=80&w=400" controls style="width: 100%; height: 100%; object-fit: cover;"></video>
        </div>
        <div class="journey-item" style="display: block;">
          <video src="https://www.w3schools.com/html/mov_bbb.mp4" poster="https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&q=80&w=400" controls style="width: 100%; height: 100%; object-fit: cover;"></video>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="section" style="padding-top: 0;">
  <div class="container">
    <div class="offer-banner">
      <div class="offer-content">
        <h2>Enjoy Limited-Time Offer</h2>
        <p>Take advantage of our exclusive limited-time offer and enjoy unbeatable deals! Book now to save big on your dream vacation.</p>
        <a href="javascript:void(0);" class="btn-white">Claim Your Deal</a>
      </div>
      <div class="offer-img-box">
        <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800" alt="World Monuments">
        <div class="discount-badge">
          <span class="num">40%</span>
          <span class="text">OFF</span>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="section tpl-templates02-3"  >
  <div class="container">
    <div class="section-header">
      <h2 class="section-title">What Our Clients Say</h2>
      <p class="section-subtitle">Real reviews from our happy travelers</p>
    </div>
    
    <div class="testi-grid">
      <div class="testi-card">
        <h3 class="testi-title">The Best Booking System</h3>
        <p class="testi-text">"PROJECT_NAME_PLACEHOLDER made my vacation unforgettable! The entire experience was seamless from booking to end. Highly recommended!"</p>
        <div class="testi-author">
          <div class="author-info">
            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100" alt="Sarah" class="author-img">
            <div>
              <div class="author-name">Sarah Anderson</div>
              <div class="author-loc">USA</div>
            </div>
          </div>
          <div class="stars"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i></div>
        </div>
      </div>
      
      <div class="testi-card">
        <h3 class="testi-title">Fast, Easy & Reliable</h3>
        <p class="testi-text">"Best travel service I've used. Great prices and amazing customer support throughout! I will definitely use them again."</p>
        <div class="testi-author">
          <div class="author-info">
            <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100" alt="Michael" class="author-img">
            <div>
              <div class="author-name">Michael Johnson</div>
              <div class="author-loc">UK</div>
            </div>
          </div>
          <div class="stars"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star-half-alt"></i></div>
        </div>
      </div>

      <div class="testi-card">
        <h3 class="testi-title">Booking Excellence</h3>
        <p class="testi-text">"PROJECT_NAME_PLACEHOLDER transformed my travel dreams into reality. Can't wait for my next adventure with them!"</p>
        <div class="testi-author">
          <div class="author-info">
            <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100" alt="Emily" class="author-img">
            <div>
              <div class="author-name">Emily Chen</div>
              <div class="author-loc">Australia</div>
            </div>
          </div>
          <div class="stars"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i></div>
        </div>
      </div>
    </div>
  </div>
</section>


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
            Do I need a visa to travel with your tours?
            <span class="material-symbols-outlined">expand_more</span>
          </summary>
          <div class="v2-faq-body">Visa requirements depend on your nationality and the destination you are visiting. We provide comprehensive visa guidance and support documentation once you book a tour with us.</div>
        </details>
        
        <details class="v2-faq-item">
          <summary class="v2-faq-summary">
            Are international flights included in the package?
            <span class="material-symbols-outlined">expand_more</span>
          </summary>
          <div class="v2-faq-body">Our standard tour packages typically cover domestic transfers, accommodation, and guided tours. International flights can be added upon request as a customized travel bundle.</div>
        </details>
        
        <details class="v2-faq-item">
          <summary class="v2-faq-summary">
            What is your cancellation and refund policy?
            <span class="material-symbols-outlined">expand_more</span>
          </summary>
          <div class="v2-faq-body">We offer free cancellation up to 30 days before departure for a full refund. Cancellations made within 30 days may incur fees. Please refer to our full booking terms for details.</div>
        </details>
        
        <details class="v2-faq-item">
          <summary class="v2-faq-summary">
            Is travel insurance mandatory for the trips?
            <span class="material-symbols-outlined">expand_more</span>
          </summary>
          <div class="v2-faq-body">While not strictly mandatory for all destinations, we highly recommend purchasing comprehensive travel insurance. We offer partnered insurance plans during the checkout process.</div>
        </details>
        
        <details class="v2-faq-item">
          <summary class="v2-faq-summary">
            Do you offer group discounts or private tours?
            <span class="material-symbols-outlined">expand_more</span>
          </summary>
          <div class="v2-faq-body">Yes! We offer special rates for groups of 8 or more. We can also fully customize any of our itineraries to create a private VIP experience just for your family or group.</div>
        </details>
      </div>
    </div>
  </div>
</section>

<section class="section tpl-templates02-4" id="blog"  >
  <div class="container">
    <div class="section-header">
      <h2 class="section-title">Latest Travel Insights</h2>
      <p class="section-subtitle">Stay updated with travel tips and destination guides</p>
    </div>
    
    <div class="insights-grid">
      <div class="blog-card">
        <img src="https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&q=80&w=400" alt="Blog" class="blog-img">
        <div class="blog-meta">
          <span><i class="far fa-calendar"></i> Oct 12, 2026</span>
          <span><i class="far fa-comment"></i> 12 Comments</span>
        </div>
        <h3 class="blog-title">Ultimate Travel Planning Guide: 10 Tips</h3>
        <a href="javascript:void(0);" class="blog-link">Read More →</a>
      </div>
      <div class="blog-card">
        <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=400" alt="Blog" class="blog-img">
        <div class="blog-meta">
          <span><i class="far fa-calendar"></i> Nov 05, 2026</span>
          <span><i class="far fa-comment"></i> 8 Comments</span>
        </div>
        <h3 class="blog-title">Top Destinations to Explore for Unforgettable Adventures</h3>
        <a href="javascript:void(0);" class="blog-link">Read More →</a>
      </div>
      <div class="blog-card">
        <img src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=400" alt="Blog" class="blog-img">
        <div class="blog-meta">
          <span><i class="far fa-calendar"></i> Dec 20, 2026</span>
          <span><i class="far fa-comment"></i> 24 Comments</span>
        </div>
        <h3 class="blog-title">Smart Packing Tips to Travel Light Without Missing Essentials</h3>
        <a href="javascript:void(0);" class="blog-link">Read More →</a>
      </div>
    </div>
    
    <div class="newsletter">
      <img src="https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=600" alt="Resort" class="nl-img">
      <div class="nl-content">
        <h2>Unlock exclusive deals – subscribe now!</h2>
        <p>Sign up to unlock our secret deals and weekly travel inspiration directly to your inbox.</p>
        <form class="nl-form">
          <input type="email" placeholder="Your email address" required>
          <button type="submit" class="btn-sub">Subscribe</button>
        </form>
      </div>
    </div>
  </div>
</section>

<footer id="contact">
  <div class="container">
    <div class="foot-grid">
      <div class="foot-col">
        <h4>Language & Currency</h4>
        <select required>
          <option>English (US)</option>
          <option>Spanish</option>
          <option>French</option>
          <option>German</option>
        </select>
        <br><br>
        <select required>
          <option>USD ($)</option>
          <option>EUR (€)</option>
          <option>GBP (£)</option>
          <option>INR (₹)</option>
        </select>
      </div>
      
      <div class="foot-col">
        <h4>Company</h4>
        <div class="foot-links">
          <a href="javascript:void(0);">About Us</a>
          <a href="javascript:void(0);">Community Blog</a>
          <a href="javascript:void(0);">Careers</a>
          <a href="javascript:void(0);">Contact Us</a>
          <a href="javascript:void(0);">Our Partners</a>
        </div>
      </div>
      
      <div class="foot-col">
        <h4>Services</h4>
        <div class="foot-links">
          <a href="javascript:void(0);">Tour Guide</a>
          <a href="javascript:void(0);">Tour Booking</a>
          <a href="javascript:void(0);">Hotel Booking</a>
          <a href="javascript:void(0);">Flight Booking</a>
          <a href="javascript:void(0);">Rental Services</a>
        </div>
      </div>
      
      <div class="foot-col">
        <h4>Follow Us</h4>
        <div class="foot-links">
          <a href="javascript:void(0);"><i class="fab fa-facebook-f"></i> Facebook</a>
          <a href="javascript:void(0);"><i class="fab fa-twitter"></i> Twitter</a>
          <a href="javascript:void(0);"><i class="fab fa-instagram"></i> Instagram</a>
          <a href="javascript:void(0);"><i class="fab fa-linkedin-in"></i> LinkedIn</a>
        </div>
      </div>
    </div>
    
    <div class="foot-bottom">
      <p>&copy; 2026 PROJECT_NAME_PLACEHOLDER. All rights reserved.</p>
      <div class="socials">
        <a href="javascript:void(0);"><i class="fab fa-facebook-f"></i></a>
        <a href="javascript:void(0);"><i class="fab fa-twitter"></i></a>
        <a href="javascript:void(0);"><i class="fab fa-instagram"></i></a>
        <a href="javascript:void(0);"><i class="fab fa-linkedin-in"></i></a>
      </div>
    </div>
  </div>
</footer>

<script id="core-interactions">
  (function() {
    // Check if we are inside GrapesJS editor
    var isInEditor = !!document.querySelector('[data-gjs-type]') || document.body.classList.contains('gjs-dashed');
    
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
            e.target.innerHTML = '<div class="tpl-templates02-5" style="padding: 20px; text-align: center"><h3 style="margin: 0 0 10px 0; ">Thank You!</h3><p style="margin: 0;">Your request has been submitted successfully.</p></div>';
          }, 1000);
        }
      }
    }, true);
  })();
</script>

@media (max-width: 768px) {
  .booking-form-wrap, .dest-grid, .tours-grid, .why-grid, .testi-grid, .insights-grid { grid-template-columns: 1fr !important; }
  .nav-inner, .nav-links, .hero, .carousel-nav, .tour-footer, .foot-bottom { flex-direction: column !important; }
}

`;
