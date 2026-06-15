// Master Template — Travel 01 (Original Images Version)
// Optimized for Editor Reliability — No Variables, Direct Placeholders

export const travel01Styles = `
:root {
  --primary: PRIMARY_COLOR_PLACEHOLDER;
  --secondary: SECONDARY_COLOR_PLACEHOLDER;
  --dark: #111827;
  --gray: #6b7280;
  --light: #f3f4f6;
}

* { 
  box-sizing: border-box; 
  margin: 0; 
  padding: 0; 
}

body { 
  font-family: 'Inter', sans-serif; 
  color: var(--dark); 
  line-height: 1.6; 
  overflow-x: hidden; 
  background-color: #ffffff ; 
  font-size: clamp(0.9rem, 1vw + 0.5rem, 1rem); /* Fluid base font size */
}

.container { 
  max-width: 1200px; 
  margin: 0 auto; 
  padding: 0 1.5rem; 
  width: 100%;
}

img { 
  max-width: 100%; 
  height: auto;
  display: block; 
}

a { 
  text-decoration: none; 
  color: inherit; 
}

/* Buttons */
.btn { 
  display: inline-block; 
  padding: 0.8rem 2rem; 
  border-radius: 50px; 
  font-weight: 600; 
  cursor: pointer; 
  transition: all 0.3s ease; 
  border: none; 
  text-align: center;
  white-space: nowrap;
}
.btn-primary { background-color: var(--btn-bg, var(--primary)); color: var(--btn-text, #fff); }
.btn-primary:hover { background-color: var(--secondary) !important; color: var(--btn-text, #fff) !important; opacity: 0.9; transform: translateY(-2px); }

/* Header */
header { 
  position: absolute; 
  top: 0; 
  left: 0; 
  right: 0; 
  z-index: 100; 
  padding: 1.5rem 0; 
}
.header-inner { 
  display: flex; flex-wrap: wrap; 
  justify-content: space-between; 
  align-items: center; 
  flex-wrap: wrap;
  gap: 1rem;
}
.logo { 
  display: flex; flex-wrap: wrap; 
  align-items: center; 
  gap: 0.5rem; 
  font-size: clamp(1.2rem, 2vw + 0.5rem, 1.5rem); 
  font-weight: 800; 
  color: #fff; 
}
.logo-icon { 
  width: 40px; 
  height: 40px; 
  background: var(--primary); 
  color: #fff; 
  border-radius: 10px; 
  display: flex; flex-wrap: wrap; 
  align-items: center; 
  justify-content: center; 
  font-size: 1.2rem; 
  flex-shrink: 0;
}
.nav-links { 
  display: flex; flex-wrap: wrap; 
  gap: 2rem; 
  flex-wrap: wrap;
  align-items: center;
}
.nav-links a { 
  color: #fff; 
  font-weight: 500; 
  transition: color 0.3s;
}
.nav-links a:hover { color: var(--primary); }

/* Hero */
.hero { 
  position: relative; 
  min-height: 100vh; 
  display: flex; flex-wrap: wrap; 
  flex-direction: column;
  justify-content: center;
  padding: 8rem 0 10rem; 
  background-position: center; 
  background-size: cover; 
  background-repeat: no-repeat; 
}
.hero::before { 
  content: ''; 
  position: absolute; 
  inset: 0; 
  background: linear-gradient(135deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.35) 60%, rgba(0,0,0,0.5) 100%); 
  z-index: 1;
}
.hero-inner {
  position: relative;
  z-index: 2;
  width: 100%;
}
.hero-content { 
  display: grid; 
  grid-template-columns: 1fr 1fr; 
  gap: 4rem; 
  align-items: center; 
  width: 100%; 
}
.hero-text h4 { 
  color: rgba(255,255,255,0.85); 
  font-size: clamp(0.8rem, 1.5vw, 1rem); 
  text-transform: uppercase; 
  letter-spacing: 3px; 
  margin-bottom: 1rem;
  font-weight: 600;
}
.hero-text h1 { 
  color: #fff; 
  font-size: clamp(2.4rem, 5vw + 1rem, 5rem); 
  font-weight: 800; 
  line-height: 1.1; 
  margin-bottom: 1.5rem;
}
.hero-text p {
  color: rgba(255,255,255,0.8);
  font-size: clamp(0.95rem, 1.5vw, 1.1rem);
  max-width: 420px;
  line-height: 1.7;
}
.hero-card { 
  background: #fff; 
  padding: 0.6rem; 
  border-radius: 24px; 
  box-shadow: 0 30px 60px rgba(0,0,0,0.35); 
  justify-self: end; 
  width: 100%;
  max-width: 310px; 
  transform: rotate(4deg); 
  transition: transform 0.4s ease;
}
.hero-card:hover { transform: rotate(0deg) scale(1.02); }
.hero-card img { 
  border-radius: 18px; 
  height: clamp(280px, 38vh, 420px); 
  object-fit: cover; 
  width: 100%; 
}

/* Lead Form — floating white card */
.hero-form-section {
  position: relative;
  z-index: 2;
  width: 100%;
  margin-top: 3rem;
}
.lead-form-card {
  background: #ffffff;
  border-radius: 20px;
  padding: 1.5rem 2rem;
  box-shadow: 0 20px 60px rgba(0,0,0,0.18);
  width: 100%;
}
.lead-form-top {
  display: flex; flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.lead-form-top h3 {
  font-size: clamp(1rem, 1.8vw, 1.2rem);
  font-weight: 800;
  color: var(--dark);
  margin: 0;
}
.lead-form-top span {
  font-size: 0.85rem;
  color: var(--gray);
}
.lead-form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr auto;
  gap: 1rem;
  align-items: end;
}
.lead-field {
  display: flex; flex-wrap: wrap;
  flex-direction: column;
  gap: 0.4rem;
}
.lead-field label {
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--dark);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.lead-field-inner {
  display: flex; flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  border: 1.5px solid #e5e7eb ;
  border-radius: 10px;
  padding: 0.55rem 0.85rem;
  background: #f9fafb ;
  transition: border-color 0.25s, background 0.25s, box-shadow 0.25s;
}
.lead-field-inner:focus-within {
  border-color: var(--primary) ;
  background: #fff ;
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--primary) 12%, transparent);
}
.lead-field-inner i {
  color: var(--primary);
  font-size: 0.8rem;
  flex-shrink: 0;
}
.lead-field-inner input {
  border: none ;
  outline: none !important;
  background: transparent ;
  color: var(--dark) ;
  font-size: 0.88rem;
  width: 100%;
  box-shadow: none !important;
  font-family: inherit;
  font-weight: 500;
  padding: 0 !important;
  margin: 0 !important;
  min-height: auto !important;
  height: auto !important;
  line-height: 1.4 !important;
}
.lead-field-inner input::placeholder { color: #9ca3af ; font-weight: 400; }
.lead-form-submit-wrap {
  display: flex; flex-wrap: wrap;
  align-items: flex-end;
}
.lead-form-submit {
  padding: 0.65rem 1.8rem;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 700;
  white-space: nowrap;
  width: 100%;
  cursor: pointer;
  border: none ;
  background: var(--primary) ;
  color: #fff ;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px color-mix(in srgb, var(--primary) 40%, transparent);
}
.lead-form-submit:hover { opacity: 0.88; transform: translateY(-2px); }



/* Tour Places */
.tours { padding: clamp(6rem, 10vw, 8rem) 0 5rem; background: #fff; }
.section-header { 
  display: flex; flex-wrap: wrap; 
  justify-content: space-between; 
  align-items: flex-end; 
  margin-bottom: 3rem; 
  flex-wrap: wrap; 
  gap: 1.5rem; 
}
.section-title { font-size: clamp(1.8rem, 4vw, 2.5rem); font-weight: 800; }
.section-subtitle { 
  color: var(--primary); 
  font-weight: 600; 
  text-transform: uppercase; 
  letter-spacing: 1px; 
  font-size: clamp(0.8rem, 1.5vw, 0.9rem); 
  margin-bottom: 0.5rem; 
  display: block; 
}

.tour-list { display: flex; flex-wrap: wrap; flex-direction: column; gap: 1.5rem; }
.tour-item { 
  border: 1px solid #e3e3e3; 
  display: flex; flex-wrap: wrap; 
  align-items: center; 
  gap: 2rem; 
  padding: 1rem; 
  border-radius: 20px; 
  transition: 0.3s; 
  flex-wrap: wrap;
}
.tour-item:hover { box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
.tour-img { width: 250px; height: 170px; border-radius: 15px; object-fit: cover; flex-shrink: 0; }
.tour-content { flex: 1; min-width: 250px; }
.tour-rating { color: #f59e0b; font-size: 0.9rem; margin-bottom: 0.5rem; }
.tour-content h3 { font-size: clamp(1.2rem, 2vw, 1.5rem); font-weight: 700; margin-bottom: 0.5rem; }
.tour-content p { color: var(--gray); font-size: 0.95rem; }
.tour-meta { display: flex; flex-wrap: wrap; flex-direction: column; gap: 0.8rem; min-width: 180px; flex-wrap: wrap; }
.meta-item { display: flex; flex-wrap: wrap; align-items: center; gap: 0.8rem; color: var(--gray); font-size: 0.9rem; }
.meta-item i { color: var(--primary); }

/* Experience */
.experience { padding: 5rem 0; }
.exp-grid { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(2rem, 5vw, 4rem); align-items: center; }
.features { margin: 2rem 0; display: flex; flex-wrap: wrap; flex-direction: column; gap: 1.5rem; flex-wrap: wrap; }
.feature { display: flex; flex-wrap: wrap; align-items: center; gap: 1.5rem; flex-wrap: wrap; }
.feat-icon { 
  width: 60px; 
  height: 60px; 
  border-radius: 50%; 
  background: #e0f2fe; 
  color: #0ea5e9; 
  display: flex; flex-wrap: wrap; 
  align-items: center; 
  justify-content: center; 
  font-size: 1.5rem; 
  flex-shrink: 0;
}
.feat-text { flex: 1; min-width: 200px; }
.feat-text h4 { font-size: 1.2rem; font-weight: 700; }
.feat-text p { color: var(--gray); font-size: 0.9rem; }
.exp-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 2rem; flex-wrap: wrap; }
.contact-phone { display: flex; flex-wrap: wrap; align-items: center; gap: 1rem; font-weight: 700; white-space: nowrap; }
.contact-phone i { 
  width: 40px; 
  height: 40px; 
  border-radius: 50%; 
  background: #dcfce7; 
  color: #22c55e; 
  display: flex; flex-wrap: wrap; 
  align-items: center; 
  justify-content: center; 
  flex-shrink: 0;
}

.exp-images { position: relative; height: 500px; width: 100%; }
.exp-img-1 { width: 70%; height: 400px; object-fit: cover; border-radius: 20px; position: absolute; right: 0; top: 0; }
.exp-img-2 { width: 60%; height: 300px; object-fit: cover; border-radius: 20px; position: absolute; left: 0; bottom: 0; border: 10px solid #fff; }
.badge { 
  position: absolute; 
  left: 40%; 
  top: 30%; 
  background: var(--primary); 
  color: #fff; 
  padding: 1rem; 
  border-radius: 50%; 
  width: clamp(100px, 12vw, 120px); 
  height: clamp(100px, 12vw, 120px); 
  display: flex; flex-wrap: wrap; 
  flex-direction: column; 
  align-items: center; 
  justify-content: center; 
  text-align: center; 
  font-weight: 700; 
  line-height: 1.2; 
  z-index: 2; 
  border: 6px solid #fff; 
  font-size: 0.8rem;
}
.badge span { font-size: clamp(1.5rem, 3vw, 2rem); }

/* Banner */
.banner { padding: 4rem 0; }
.banner-inner { 
  background-color: #1f2937; 
  background-position: center; 
  background-size: cover; 
  background-repeat: no-repeat; 
  border-radius: 30px; 
  padding: clamp(2rem, 5vw, 4rem); 
  position: relative; 
  overflow: hidden; 
  display: flex; flex-wrap: wrap; 
  align-items: center; 
  min-height: 300px; 
  flex-wrap: wrap;
}
.banner-inner::before { content: ''; position: absolute; inset: 0; background: rgba(0,0,0,0.6); }
.banner-content { position: relative; z-index: 10; max-width: 500px; width: 100%; }
.banner-content h2 { color: #fff; font-size: clamp(1.8rem, 4vw, 2.5rem); font-weight: 800; line-height: 1.2; margin-bottom: 2rem; }
.banner-man { position: absolute; right: 5%; bottom: 0; height: 110%; z-index: 10; object-fit: contain; }

/* Grid Beautiful Places */
.places { padding: 5rem 0; text-align: center; }
.places-grid { 
  display: grid; 
  grid-template-columns: repeat(3, 1fr); 
  gap: 0; 
  margin-top: 3rem; 
  border-radius: 30px; 
  overflow: hidden; 
  height: 500px; 
}
.place-col { position: relative; height: 100%; overflow: hidden; }
.place-col img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
.place-col:hover img { transform: scale(1.05); }
.place-col::before { content: ''; position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.8), transparent); opacity: 0; transition: 0.3s; z-index: 1; }
.place-col:hover::before { opacity: 1; }
.place-info { position: absolute; bottom: -50px; left: 0; right: 0; padding: 2rem; color: #fff; text-align: center; transition: 0.3s ease; opacity: 0; z-index: 2; }
.place-col:hover .place-info { bottom: 60px; opacity: 1; }
.place-info h3 { font-size: clamp(1.2rem, 2vw, 1.5rem); margin-bottom: 0.5rem; }
.place-info .price { color: var(--primary); font-size: clamp(1.4rem, 2.5vw, 1.8rem); font-weight: 800; margin: 1rem 0; }

.place-col.active::before { opacity: 1; }
.place-col.active .place-info { bottom: 60px; opacity: 1; }

/* Testimonial */
.testimonials { background: #111; padding: clamp(5rem, 8vw, 8rem) 0; color: #fff; position: relative; text-align: center; }
.testi-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-top: 4rem; text-align: left; }
.testi-card { 
  background: rgba(255,255,255,0.05); 
  padding: clamp(1.5rem, 4vw, 3rem); 
  border-radius: 20px; 
  border: 1px solid rgba(255,255,255,0.1); 
  display: flex; flex-wrap: wrap; 
  flex-direction: column; 
  gap: 2rem; 
  justify-content: space-between;
}
.quote-icon { color: var(--primary); font-size: clamp(2rem, 4vw, 3rem); line-height: 1; }
.testi-text { font-size: clamp(1rem, 1.5vw, 1.1rem); font-style: italic; opacity: 0.9; }
.testi-author { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 1rem; }
.testi-author h4 { font-size: 1.2rem; }
.testi-author p { color: var(--primary); font-size: 0.9rem; }
.stars { color: #f59e0b; white-space: nowrap; }

/* Blog */
.blog { padding: 5rem 0; text-align: center; }
.blog-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; margin-top: 3rem; text-align: left; }
.blog-card { border-radius: 20px; overflow: hidden; border: 1px solid #eee; display: flex; flex-wrap: wrap; flex-direction: column; }
.blog-img { height: 250px; width: 100%; object-fit: cover; }
.blog-content { padding: 1.5rem; flex: 1; display: flex; flex-wrap: wrap; flex-direction: column; }
.blog-meta { display: flex; flex-wrap: wrap; gap: 1rem; color: var(--primary); font-size: 0.85rem; font-weight: 600; margin-bottom: 1rem; flex-wrap: wrap; }
.blog-content h3 { font-size: clamp(1.1rem, 2vw, 1.3rem); margin-bottom: 1rem; line-height: 1.4; }
.blog-content p { color: var(--gray); font-size: 0.95rem; margin-bottom: 1.5rem; flex: 1; }
.read-more { color: var(--primary); font-weight: 600; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; }
.read-more i { 
  width: 35px; 
  height: 35px; 
  background: var(--primary); 
  color: #fff; 
  border-radius: 50%; 
  display: flex; flex-wrap: wrap; 
  align-items: center; 
  justify-content: center; 
  flex-shrink: 0;
}

/* Footer Prep / Accordion */
.footer-top { padding: 5rem 0; }
.ft-grid { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(2rem, 5vw, 4rem); align-items: center; }
.ft-img { border-radius: 30px; border-bottom-left-radius: 100px; height: 400px; width: 100%; object-fit: cover; }
.ft-content h2 { font-size: clamp(1.8rem, 4vw, 2.5rem); font-weight: 800; margin-bottom: 2rem; }
.ft-list { display: flex; flex-wrap: wrap; flex-direction: column; gap: 1rem; margin-top: 1.5rem; }
.ft-item {
  background: #f8fafc;
  background-image: none ;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
  transition: all 0.3s ease;
}
.ft-item.light-bg {
  color: var(--dark);
}
.ft-item.dark-bg {
  color: #fff;
}
.ft-header { display: flex; flex-wrap: wrap; align-items: center; gap: 1rem; padding: 1.2rem; cursor: pointer; user-select: none; list-style: none; }
.ft-header::-webkit-details-marker { display: none; }
.ft-title { font-size: clamp(1rem, 1.5vw, 1.1rem); font-weight: 700; margin: 0; flex: 1; color: var(--dark); }
.ft-item.dark-bg .ft-title { color: #fff; }
.ft-icon-toggle { font-size: 1.2rem; color: var(--primary); transition: transform 0.3s ease; flex-shrink: 0; }
.ft-item[open] .ft-icon-toggle { transform: rotate(180deg); }
.ft-body { padding: 0 1.2rem 1.2rem 1.2rem; }
.ft-body p { color: var(--gray); font-size: 0.95rem; line-height: 1.5; margin: 0; }
.ft-item.dark-bg .ft-body p { color: #e2e8f0; }

/* Footer */
footer { background: #111; color: #fff; padding: clamp(4rem, 8vw, 6rem) 0 2rem; position: relative; }
.footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 2fr; gap: clamp(1.5rem, 3vw, 3rem); margin-bottom: 4rem; }
.footer-col p { opacity: 0.7; margin: 1.5rem 0; }
.social { display: flex; flex-wrap: wrap; gap: 1rem; flex-wrap: wrap; }
.social a { width: 40px; height: 40px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.2); display: flex; flex-wrap: wrap; align-items: center; justify-content: center; transition: 0.3s; flex-shrink: 0; }
.social a:hover { background: var(--primary); border-color: var(--primary); }
.footer-col h4 { font-size: 1.2rem; margin-bottom: 1.5rem; }
.footer-links { display: flex; flex-wrap: wrap; flex-direction: column; gap: 1rem; }
.footer-links a { opacity: 0.7; transition: 0.3s; }
.footer-links a:hover { color: var(--primary); opacity: 1; }
.newsletter form { display: flex; flex-wrap: wrap; flex-direction: column; gap: 1rem; margin-top: 1.5rem; }
.newsletter input { padding: 1rem; border-radius: 10px; border: none; outline: none; background: rgba(255,255,255,0.1); color: #fff; width: 100%; }
.newsletter button { padding: 1rem; border-radius: 10px; background: var(--primary); color: #fff; border: none; font-weight: 600; cursor: pointer; transition: background 0.3s; }
.newsletter button:hover { opacity: 0.9; }
.copyright { text-align: center; padding-top: 2rem; border-top: 1px solid rgba(255,255,255,0.1); opacity: 0.6; font-size: 0.9rem; }

/* --- RESPONSIVE MEDIA QUERIES --- */

@media (max-width: 1024px) {
  .hero { padding: 8rem 0 6rem; }
  .hero-content { grid-template-columns: 1fr; text-align: center; gap: 2.5rem; }
  .hero-card { justify-self: center; transform: rotate(0); }
  .hero-text p { margin: 0 auto; }
  .lead-form-grid { grid-template-columns: 1fr 1fr; }
  .lead-form-submit-wrap { grid-column: span 2; }
  .lead-form-submit { width: 100%; }
  .exp-grid, .ft-grid { grid-template-columns: 1fr; gap: 3rem; }
  .exp-images { height: 450px; margin-top: 2rem; }
  .blog-grid { grid-template-columns: repeat(2, 1fr); }
  .footer-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 768px) {
  .lead-form-card { padding: 1.2rem; }
  .lead-form-grid { grid-template-columns: 1fr; }
  .lead-form-submit-wrap { grid-column: span 1; }
}

@media (max-width: 768px) {
  .nav-links { display: none; } /* You can add a toggle to handle the Mobile Menu */
  .places-grid { grid-template-columns: 1fr; height: auto; border-radius: 20px; }
  .place-col { height: 350px; }
  .place-col:hover .place-info, .place-col.active .place-info { bottom: 30px; }
  .banner-inner { padding: 2.5rem 1.5rem; text-align: center; justify-content: center; }
  .banner-content { max-width: 100%; }
  .banner-man { display: none; }
  .testi-grid { grid-template-columns: 1fr; }
  .blog-grid { grid-template-columns: 1fr; }
  
  /* Tour responsive fixes */
  .tour-item { flex-direction: column; align-items: stretch; gap: 1.5rem; }
  .tour-img { width: 100%; height: 200px; }
  .tour-meta { flex-direction: row; justify-content: space-between; border-top: 1px solid #eee; padding-top: 1rem; width: 100%; }
  
  .exp-images { height: 380px; }
  .badge { left: 5%; top: 5%; transform: none; }
}

@media (max-width: 480px) {
  .footer-grid { grid-template-columns: 1fr; }
  .tour-meta { flex-direction: column; gap: 0.5rem; }
  .exp-actions { flex-direction: column; align-items: stretch; gap: 1.2rem; }
  .contact-phone { justify-content: center; }
  .btn { width: 100%; }
  .header-inner { justify-content: center; }
}


  /* Extracted Template Inline Styles */
  .tpl-templates01-1 { background-image: url('https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=2000'); }
  .tpl-templates01-2 { color: var(--gray); }
  .tpl-templates01-3 { color: var(--gray); }
  .tpl-templates01-4 { color: #fff; }
  .tpl-templates01-5 { background: #fff; color: var(--primary); }
  .tpl-templates01-6 { border: 2px dashed #22c55e; border-radius: 8px; background: rgba(34,197,94,0.1); color: #166534; }
`;
export const travel01Html = `
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

<header>
  <div class="container header-inner">
    <div class="logo">
      LOGO_PLACEHOLDER
    </div>
    <a href="#contact" class="btn btn-primary">Contact Us</a>
  </div>
</header>

<main>
  <section class="hero tpl-templates01-1"  >
    <div class="container hero-inner">
      <div class="hero-content">
        <div class="hero-text">
          <h4>Let's Travel The World</h4>
          <h1>Adventure &<br>Experience The<br>Travel!</h1>
          <p>Discover breathtaking destinations with our expert-curated travel packages. Your dream vacation starts here.</p>
        </div>
        <div class="hero-card">
          <img src="https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?auto=format&fit=crop&q=80&w=800" alt="Island">
        </div>
      </div>
      <div class="hero-form-section">
        <div class="lead-form-card">
          <div class="lead-form-top">
            <h3>✈️ Plan Your Dream Trip</h3>
            <span>Free quote · No commitment</span>
          </div>
          <form class="lead-form" action="#" method="POST">
            <div class="lead-form-grid">
              <div class="lead-field">
                <label>Full Name</label>
                <div class="lead-field-inner">
                  <i class="fa-solid fa-user"></i>
                  <input type="text" name="name" placeholder="e.g. John Smith" required>
                </div>
              </div>
              <div class="lead-field">
                <label>Email Address</label>
                <div class="lead-field-inner">
                  <i class="fa-solid fa-envelope"></i>
                  <input type="email" name="email" placeholder="EMAIL_PLACEHOLDER" required>
                </div>
              </div>
              <div class="lead-field">
                <label>Phone Number</label>
                <div class="lead-field-inner">
                  <i class="fa-solid fa-phone"></i>
                  <input type="tel" name="phone" placeholder="PHONE_PLACEHOLDER" required>
                </div>
              </div>
              <div class="lead-form-submit-wrap">
                <button type="submit" class="lead-form-submit">Get Free Quote <i class="fa-solid fa-arrow-right" style="margin-left:6px;"></i></button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>

  <section class="tours" id="destinations">
    <div class="container">
      <div class="section-header">
        <div>
          <span class="section-subtitle">What's To Do</span>
          <h2 class="section-title">Most Favorite Tour Place</h2>
        </div>
        <button class="btn btn-primary">See All Place</button>
      </div>

      <div class="tour-list">
        <div class="tour-item">
          <img src="https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&q=80&w=600" alt="Turkey" class="tour-img">
          <div class="tour-content">
            <div class="tour-rating"><i class="fa-solid fa-star"></i> 4.5</div>
            <h3>Great Turkish Marina</h3>
            <p>Experience the ancient history and beautiful coastlines of Turkey.</p>
          </div>
          <div class="tour-meta">
            <div class="meta-item"><i class="fa-regular fa-clock"></i> 3 Days 4 Nights</div>
            <div class="meta-item"><i class="fa-solid fa-user-group"></i> Tour Guide Included</div>
            <div class="meta-item"><i class="fa-solid fa-location-dot"></i> Turkey, Istanbul</div>
          </div>
        </div>

        <div class="tour-item">
          <img src="https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=600" alt="Resort" class="tour-img">
          <div class="tour-content">
            <div class="tour-rating"><i class="fa-solid fa-star"></i> 4.8</div>
            <h3>Resort stay experience</h3>
            <p>Relax in the world's most luxurious overwater bungalows.</p>
          </div>
          <div class="tour-meta">
            <div class="meta-item"><i class="fa-regular fa-clock"></i> 5 Days 6 Nights</div>
            <div class="meta-item"><i class="fa-solid fa-user-group"></i> Tour Guide Included</div>
            <div class="meta-item"><i class="fa-solid fa-location-dot"></i> Maldives</div>
          </div>
        </div>

        <div class="tour-item">
          <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80" alt="US Explorer adventure" class="tour-img">
          <div class="tour-content">
            <div class="tour-rating"><i class="fa-solid fa-star"></i> 4.9</div>
            <h3>US Explorer adventure</h3>
            <p>Take an unforgettable journey through national parks.</p>
          </div>
          <div class="tour-meta">
            <div class="meta-item"><i class="fa-regular fa-clock"></i> 7 Days 8 Nights</div>
            <div class="meta-item"><i class="fa-solid fa-user-group"></i> Tour Guide Included</div>
            <div class="meta-item"><i class="fa-solid fa-location-dot"></i> Grand Canyon, USA</div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="experience">
    <div class="container exp-grid">
      <div>
        <span class="section-subtitle">About Us</span>
        <h2 class="section-title">Experience the World with our Travelon Company</h2>
        <p class="tpl-templates01-2" style="margin-top: 1rem">We provide the best travel experiences around the world. Let us help you create memories that will last a lifetime.</p>
        
        <div class="features">
          <div class="feature">
            <div class="feat-icon"><i class="fa-solid fa-shield-halved"></i></div>
            <div class="feat-text">
              <h4>Safety first always</h4>
              <p>Your safety is our priority in every destination.</p>
            </div>
          </div>
          <div class="feature">
            <div class="feat-icon"><i class="fa-solid fa-tags"></i></div>
            <div class="feat-text">
              <h4>Low price & friendly</h4>
              <p>Get the best deals without compromising quality.</p>
            </div>
          </div>
        </div>

        <div class="exp-actions">
          <button class="btn btn-primary">Know More</button>
          <div class="contact-phone">
            <i class="fa-solid fa-phone"></i>
            <div>
              <div class="tpl-templates01-3" style="font-size: 0.8rem">Call Us Anytime</div>
              PHONE_PLACEHOLDER
            </div>
          </div>
        </div>
      </div>
      <div class="exp-images">
        <img src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=800" alt="Hiker" class="exp-img-1">
        <img src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=800" alt="Map" class="exp-img-2">
        <div class="badge">
          <span>20+</span> Years<br>Experience
        </div>
      </div>
    </div>
  </section>

  <section class="banner">
    <div class="container">
      <div class="banner-inner" style="position: relative; overflow: hidden;">
        <img src="https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?auto=format&fit=crop&q=80&w=2000" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: -1;" alt="Banner Background">
        <div class="banner-content">
          <span class="tpl-templates01-4" style="font-weight: 600; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 1rem">Special Offer For You</span>
          <h2>Grab Up to 50% Off<br>on Your Favorites<br>Destination</h2>
          <button class="btn btn-primary tpl-templates01-5"  >Subscribe</button>
        </div>
      </div>
    </div>
  </section>

  <section class="places">
    <div class="container">
      <span class="section-subtitle">Top Destination</span>
      <h2 class="section-title">Explore the Beautiful Places<br>Around the World!</h2>
      
      <div class="places-grid">
        <div class="place-col">
          <img src="https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=80&w=600" alt="City">
          <div class="place-info">
            <h3>Paris, France</h3>
            <p>City of light and romance</p>
            <div class="price">$199</div>
            <button class="btn btn-primary">Book Now</button>
          </div>
        </div>
        <div class="place-col active">
          <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600" alt="Beach">
          <div class="place-info">
            <h3>Phuket, Thailand</h3>
            <p>Tropical paradise with crystal waters</p>
            <div class="price">$259</div>
            <button class="btn btn-primary">Book Now</button>
          </div>
        </div>
        <div class="place-col">
          <img src="https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&q=80&w=600" alt="Island">
          <div class="place-info">
            <h3>Bali, Indonesia</h3>
            <p>Cultural and scenic beauty</p>
            <div class="price">$220</div>
            <button class="btn btn-primary">Book Now</button>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="testimonials">
    <div class="container">
      <span class="section-subtitle">Our Testimonials</span>
      <h2 class="section-title">Providing The Best Services<br>For Our Customers</h2>
      
      <div class="testi-grid">
        <div class="testi-card">
          <i class="fa-solid fa-quote-left quote-icon"></i>
          <p class="testi-text">"The experience was absolutely incredible. Everything from the flights to the hotel was perfectly arranged. I didn't have to worry about a single thing during my vacation."</p>
          <div class="testi-author">
            <div>
              <div class="stars">
                <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>
              </div>
              <p>Travel Blogger</p>
            </div>
            <h4>Helena John</h4>
          </div>
        </div>
        <div class="testi-card">
          <i class="fa-solid fa-quote-left quote-icon"></i>
          <p class="testi-text">"Truly the best travel agency I have ever used. They found us hidden gems that weren't in any guidebook. Highly recommended for anyone looking for authentic experiences."</p>
          <div class="testi-author">
            <div>
              <div class="stars">
                <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>
              </div>
              <p>Business Owner</p>
            </div>
            <h4>Gustavo Silva</h4>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="blog">
    <div class="container">
      <span class="section-subtitle">News & Articles</span>
      <h2 class="section-title">Latest News & Articles<br>From the Blog Posts</h2>
      
      <div class="blog-grid">
        <div class="blog-card">
          <img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=600" alt="Blog" class="blog-img">
          <div class="blog-content">
            <div class="blog-meta">
              <span><i class="fa-regular fa-calendar"></i> 24 May 2026</span>
              <span><i class="fa-regular fa-user"></i> By Admin</span>
            </div>
            <h3>The Best Places To Visit For Your Next Vacation</h3>
            <p>Discover the top destinations that are trending this year for travelers looking for adventure and relaxation.</p>
            <a href="#" class="read-more">Read More <i class="fa-solid fa-arrow-right"></i></a>
          </div>
        </div>
        <div class="blog-card">
          <img src="https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&q=80&w=600" alt="Blog" class="blog-img">
          <div class="blog-content">
            <div class="blog-meta">
              <span><i class="fa-regular fa-calendar"></i> 18 May 2026</span>
              <span><i class="fa-regular fa-user"></i> By Admin</span>
            </div>
            <h3>Top 5 Best Travel Accommodations</h3>
            <p>A comprehensive guide to finding the perfect place to stay, from luxury resorts to cozy boutique hotels.</p>
            <a href="#" class="read-more">Read More <i class="fa-solid fa-arrow-right"></i></a>
          </div>
        </div>
        <div class="blog-card">
          <img src="https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?auto=format&fit=crop&q=80&w=600" alt="Blog" class="blog-img">
          <div class="blog-content">
            <div class="blog-meta">
              <span><i class="fa-regular fa-calendar"></i> 12 May 2026</span>
              <span><i class="fa-regular fa-user"></i> By Admin</span>
            </div>
            <h3>Places To Go For Your Next Trip</h3>
            <p>Need inspiration? Here are some breathtaking locations that should be on everyone's travel bucket list.</p>
            <a href="#" class="read-more">Read More <i class="fa-solid fa-arrow-right"></i></a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="footer-top">
    <div class="container ft-grid">
      <div>
        <img src="https://images.unsplash.com/photo-1516815231560-8f41ec531527?auto=format&fit=crop&q=80&w=800" alt="Travel" class="ft-img">
      </div>
      <div class="ft-content">
        <span class="section-subtitle">Why Choose Us</span>
        <h2>Experience the World with our Travelon Co</h2>
        <div class="ft-list">
        <details class="ft-item" open>
          <summary class="ft-header">
            <h3 class="ft-title">
              <span>Experience the World with our Travelon Co</span>
            </h3>
            <span class="ft-icon-toggle"><i class="fa-solid fa-chevron-down"></i></span>
          </summary>
          <div class="ft-body">
            <p>We ensure every moment of your trip is perfectly curated.</p>
          </div>
        </details>
        
        <details class="ft-item">
          <summary class="ft-header">
            <h3 class="ft-title">
              <span>Where Do You Want To Go?</span>
            </h3>
            <span class="ft-icon-toggle"><i class="fa-solid fa-chevron-down"></i></span>
          </summary>
          <div class="ft-body">
            <p>Choose from our extensive network of global tour packages tailored to your dreams.</p>
          </div>
        </details>
        
        <details class="ft-item">
          <summary class="ft-header">
            <h3 class="ft-title">
              <span>What Are Your Expectations?</span>
            </h3>
            <span class="ft-icon-toggle"><i class="fa-solid fa-chevron-down"></i></span>
          </summary>
          <div class="ft-body">
            <p>We tailor our itineraries to meet and exceed all your expectations and travel needs.</p>
          </div>
        </details>
      </div>
    </div>
  </section>
</main>

<footer id="contact">
  <div class="container footer-grid">
    <div class="footer-col">
      <div class="logo">
        LOGO_PLACEHOLDER
      </div>
      <p>Discover the world's most amazing destinations with our expert guides and curated travel packages. Your adventure begins here.</p>
      <div class="social">
        <a href="#"><i class="fa-brands fa-facebook-f"></i></a>
        <a href="#"><i class="fa-brands fa-twitter"></i></a>
        <a href="#"><i class="fa-brands fa-instagram"></i></a>
      </div>
    </div>
    
    <div class="footer-col">
      <h4>Quick Links</h4>
      <div class="footer-links">
        <a href="#">About Us</a>
        <a href="#">Destinations</a>
        <a href="#">Tour Packages</a>
        <a href="#">Contact Us</a>
      </div>
    </div>
    
    <div class="footer-col">
      <h4>Resources</h4>
      <div class="footer-links">
        <a href="#">Help Center</a>
        <a href="#">Travel Guide</a>
        <a href="#">Partner Network</a>
        <a href="#">Privacy Policy</a>
      </div>
    </div>
    
    <div class="footer-col newsletter">
      <h4>Newsletter</h4>
      <p>Subscribe to our newsletter to get the latest updates and offers.</p>
      <form>
        <input type="email" placeholder="Enter your email address" required>
        <button type="button">Subscribe Now</button>
      </form>
    </div>
  </div>
  
  <div class="copyright">
    <p>© 2026 PROJECT_NAME_PLACEHOLDER. All rights reserved.</p>
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
            e.target.innerHTML = '<div class="tpl-templates01-6" style="padding: 20px; text-align: center"><h3 style="margin: 0 0 10px 0; font-size: 20px;">Thank You!</h3><p style="margin: 0;">Your request has been submitted successfully.</p></div>';
          }, 1000);
        }
      }
    }, true);
  })();
</script>

`;

export function enrichTravel01(html: string, project: any): string {
  if (!project) return html;

  const category = (project.category || "").toLowerCase();

  // Fetch dictionary dynamically based on project data
  const dictionary = getDictionaryForCategory(category);

  // Replace hardcoded text with dynamic values
  Object.keys(dictionary).forEach((key) => {
    const value = dictionary[key];
    html = html.replace(new RegExp(key, "g"), value);
  });

  // Remove unwanted page name or placeholders dynamically
  if (project.pageName) {
    html = html.replace(new RegExp(project.pageName, "g"), ""); // Remove page name
  }

  return html;
}

// Function to get dictionary dynamically
function getDictionaryForCategory(category: string): Record<string, string> {
  if (category.includes("health") || category.includes("wellness") || category.includes("dent")) {
    return {
      "Let's Travel The World": "Professional Medical Care",
      "Adventure &<br>Experience The<br>Travel!": "Your Health &<br>Wellness is Our<br>Priority",
      "Destination": "Select Service",
      "Date From": "Appointment Date",
      "Guests": "Department",
      "Hero Section Title": "Dynamic Hero Title", // Example for hero section
      "Hero Section Subtitle": "Dynamic Hero Subtitle", // Example for hero section
    };
  }

  // Default dictionary
  return {
    "Let's Travel The World": "Explore the World",
    "Adventure &<br>Experience The<br>Travel!": "Adventure Awaits",
    "Destination": "Choose Destination",
    "Date From": "Start Date",
    "Guests": "Number of Guests",
    "Hero Section Title": "Default Hero Title",
    "Hero Section Subtitle": "Default Hero Subtitle",
  };
}
