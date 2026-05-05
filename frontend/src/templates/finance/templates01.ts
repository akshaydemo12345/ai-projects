// Auto-generated ULTRA-DYNAMIC template — finance templates01
// Generated: 2026-05-05T09:27:59.700Z

export const finance01Styles = `
:root {
    --bg: #ffffff;
    --fg: #334155;
    --muted: #64748b;
    --border: #e6e9f2;
    --card: #ffffff;
    --primary: PRIMARY_COLOR_PLACEHOLDER;
    --primary-glow: PRIMARY_COLOR_PLACEHOLDER;
    --navy: #0f1a3d;
    --navy-fg: #f5f7ff;
    --radius: 14px;
    --shadow-md: 0 8px 24px -8px rgba(15, 26, 61, .18);
    --shadow-elegant: 0 24px 60px -20px PRIMARY_COLOR_PLACEHOLDER;
    --shadow-glow: 0 0 80px rgba(91, 139, 255, .45);
    --gradient-primary: linear-gradient(135deg, PRIMARY_COLOR_PLACEHOLDER, PRIMARY_COLOR_PLACEHOLDER);
    --gradient-hero: linear-gradient(135deg, PRIMARY_COLOR_PLACEHOLDER 0%, SECONDARY_COLOR_PLACEHOLDER 100%);
    --gradient-soft: linear-gradient(180deg, #f6f8ff, #ffffff);
}

* {
    box-sizing: border-box;
    margin: 0;
    padding: 0
}

html {
    scroll-behavior: smooth
}

body {
    font-family: 'Inter', system-ui, sans-serif;
    color: var(--fg);
    background: #ffffff;
    -webkit-font-smoothing: antialiased;
    line-height: 1.5
}

h1,
h2,
h3,
h4 {
    font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;
    letter-spacing: -.02em;
    line-height: 1.1
}

a {
    color: inherit;
    text-decoration: none
}

img {
    max-width: 100%;
    display: block
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px
}

.btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 12px 24px;
    border-radius: 999px;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    border: none;
    transition: all .25s
}

.btn-primary {
    background: var(--primary);
    color: #fff;
    box-shadow: var(--shadow-elegant)
}

.btn-primary:hover {
    transform: translateY(-2px);
    opacity: .95
}

.btn-light {
    background: #ffffff;
    color: var(--navy)
}

.btn-light:hover {
    transform: translateY(-2px)
}

.btn-outline {
    background: transparent;
    border: 1px solid rgba(255, 255, 255, .3);
    color: #fff
}

.btn-outline:hover {
    background: rgba(255, 255, 255, .1);
}

.eyebrow {
    font-size: 13px;
    font-weight: 600;
    letter-spacing: .16em;
    text-transform: uppercase;
    color: var(--primary);
}

.section {
    padding: 112px 0
}

/* HEADER */
.site-header {
    position: absolute;
    inset: 0 0 auto 0;
    z-index: 30;
    padding: 24px 0
}

.site-header .row {
    display: flex;
    align-items: center;
    justify-content: space-between
}

.logo {
    display: flex;
    align-items: center;
    gap: 10px;
    color: #fff;
    font-family: 'Plus Jakarta Sans';
    font-weight: 800;
    font-size: 24px
}

.logo .badge {
    width: 36px;
    height: 36px;
    border-radius: 12px;
    background: var(--primary);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    box-shadow: var(--shadow-glow)
}

.nav {
    display: flex;
    gap: 32px
}

.nav a {
    color: rgba(255, 255, 255, .8);
    font-size: 14px;
    font-weight: 500
}

.nav a:hover {
    color: #fff
}

@media (max-width:900px) {
    .nav {
        display: none
    }
}

/* HERO */
.hero {
    position: relative;
    overflow: hidden;
    background: var(--navy);
    color: #fff;
    padding: 160px 0 200px
}

.hero::before,
.hero::after {
    content: "";
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    pointer-events: none
}

.hero::before {
    width: 380px;
    height: 380px;
    background: rgba(255, 255, 255, 0.1);
    top: -120px;
    right: -120px
}

.hero::after {
    width: 300px;
    height: 300px;
    background: rgba(255, 255, 255, 0.15);
    bottom: 0;
    left: 33%
}

.hero-grid {
    position: relative;
    display: grid;
    gap: 56px;
    align-items: center;
    grid-template-columns: 1fr 1fr
}

@media (max-width:960px) {
    .hero-grid {
        grid-template-columns: 1fr
    }
}

.tag {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 14px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, .2);
    font-size: 12px;
    font-weight: 500;
    backdrop-filter: blur(8px)
}

.tag .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #ffffff;
}

.hero h1 {
    font-size: 64px;
    font-weight: 700;
    margin-top: 24px;
}

.hero h1 .grad {
    background: var(--gradient-primary);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent
}

.hero p {
    margin-top: 24px;
    max-width: 520px;
    color: rgba(255, 255, 255, .78);
    font-size: 18px
}

.hero-cta {
    margin-top: 36px;
    display: flex;
    gap: 16px;
    flex-wrap: wrap
}

.hero-img {
    position: relative
}

.hero-img img {
    width: 100%;
    height: 520px;
    object-fit: cover;
    border-radius: 24px;
    border: 1px solid rgba(255, 255, 255, .2);
    box-shadow: var(--shadow-elegant)
}

.float-card {
    position: absolute;
    left: -32px;
    bottom: -32px;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 18px;
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, .2);
    backdrop-filter: blur(20px);
    box-shadow: var(--shadow-elegant)
}

.float-card .ic {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    background: #f8fafc;
    color: var(--primary);
    display: flex;
    align-items: center;
    justify-content: center
}

.float-card .num {
    font-size: 22px;
    font-weight: 700;
    color: #fff;
}

.float-card .lbl {
    font-size: 12px;
    color: rgba(255, 255, 255, .7)
}

.wave {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 120px
}

/* HERO FORM (overlap) */
.hero-form-wrap {
    position: relative;
    z-index: 20;
    margin-top: -96px;
    padding: 0 24px
}

.hero-form {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr auto;
    gap: 16px;
    align-items: end;
    background: #ffffff;
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 24px;
    box-shadow: var(--shadow-elegant)
}

@media (max-width:960px) {
    .hero-form {
        grid-template-columns: 1fr 1fr
    }

    .hero-form .btn {
        grid-column: 1 / -1
    }
}

@media (max-width:560px) {
    .hero-form {
        grid-template-columns: 1fr
    }
}

.field label {
    display: block;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: .1em;
    color: var(--muted);
    margin-bottom: 6px
}

.field .ctrl {
    display: flex;
    align-items: center;
    gap: 8px;
    height: 48px;
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 0 12px;
    background: #ffffff;
    transition: .2s
}

.field .ctrl:focus-within {
    border-color: var(--primary);
    box-shadow: 0 0 0 4px rgba(91, 139, 255, 0.2)
}

.field .ctrl i {
    color: var(--primary);
    font-size: 16px
}

.field input {
    flex: 1;
    border: 0;
    outline: none;
    font-size: 14px;
    font-family: inherit;
    background: transparent
}

.hero-form .btn {
    height: 48px;
    border-radius: 12px
}

/* ABOUT */
.about-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 64px;
    align-items: center
}

@media (max-width:960px) {
    .about-grid {
        grid-template-columns: 1fr
    }
}

.about-img-wrap {
    position: relative
}

.about-img-wrap img {
    height: 480px;
    width: 100%;
    object-fit: cover;
    border-radius: 32px;
    box-shadow: var(--shadow-elegant)
}

.about-img-wrap .blob1 {
    position: absolute;
    left: -24px;
    top: -24px;
    width: 128px;
    height: 128px;
    border-radius: 50%;
    background: PRIMARY_COLOR_PLACEHOLDER
}

.about-img-wrap .blob2 {
    position: absolute;
    right: -24px;
    bottom: -24px;
    width: 160px;
    height: 160px;
    border-radius: 32px;
    background: #ffffff;
    opacity: .2
}

.about-img-wrap .stat {
    position: absolute;
    right: 32px;
    bottom: -32px;
    background: #ffffff;
    padding: 20px;
    border-radius: 18px;
    box-shadow: var(--shadow-elegant)
}

.about-img-wrap .stat .n {
    font-size: 28px;
    font-weight: 700;
    color: var(--navy)
}

.about-img-wrap .stat .l {
    font-size: 12px;
    color: var(--muted)
}

h2 {
    font-size: 44px;
    font-weight: 700;
    color: var(--navy);
    margin-top: 12px
}

.about p {
    margin-top: 18px;
    color: var(--muted);
    font-size: 16px
}

.bullets {
    margin-top: 28px;
    display: flex;
    flex-direction: column;
    gap: 16px
}

.bullets li {
    display: flex;
    gap: 14px;
    list-style: none
}

.bullets .check {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: var(--primary);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-top: 2px
}

.bullets .t {
    font-weight: 600;
    color: var(--navy)
}

.bullets .x {
    font-size: 14px;
    color: var(--muted)
}

/* SERVICES */
.center {
    max-width: 600px;
    margin: 0 auto;
    text-align: center;
}

.cards {
    margin-top: 56px;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px
}

@media (max-width:960px) {
    .cards {
        grid-template-columns: repeat(2, 1fr)
    }
}

@media (max-width:560px) {
    .cards {
        grid-template-columns: 1fr
    }
}

.card {
    position: relative;
    background: #ffffff;
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 28px;
    transition: .3s;
    overflow: hidden
}

.card:hover {
    transform: translateY(-8px);
    border-color: PRIMARY_COLOR_PLACEHOLDER;
    box-shadow: var(--shadow-elegant)
}

.card .ic {
    width: 56px;
    height: 56px;
    border-radius: 14px;
    background: var(--primary);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    box-shadow: var(--shadow-md)
}

.card h3 {
    margin-top: 24px;
    font-size: 20px;
    color: var(--navy)
}

.card p {
    margin-top: 8px;
    font-size: 14px;
    color: var(--muted)
}

.card .more {
    margin-top: 18px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    font-weight: 600;
    color: var(--primary)
}

/* MISSION */
.mission {
    position: relative;
    overflow: hidden;
    background: var(--navy);
    color: var(--navy-fg)
}

.mission h2 {
    color: #fff
}

.mission .eyebrow {
    color: var(--primary-glow)
}

.mission-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 64px;
    align-items: center
}

@media (max-width:960px) {
    .mission-grid {
        grid-template-columns: 1fr
    }
}

.mission img {
    height: 520px;
    width: 100%;
    object-fit: cover;
    border-radius: 24px
}

.values {
    margin-top: 32px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px
}

.values .v {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, .15);
    backdrop-filter: blur(10px);
    font-size: 14px;
    font-weight: 500
}

.values .v i {
    color: var(--primary-glow)
}

/* STATS */
.stats-row {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
    background: var(--primary);
    padding: 48px;
    border-radius: 24px;
    color: #fff;
    box-shadow: var(--shadow-elegant)
}

@media (max-width:960px) {
    .stats-row {
        grid-template-columns: repeat(1, 1fr)
    }
}

.stats-row .item {
    display: flex;
    align-items: center;
    gap: 16px
}

.stats-row .ic {
    width: 56px;
    height: 56px;
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px
}

.stats-row .n {
    font-family: 'Plus Jakarta Sans';
    font-size: 30px;
    font-weight: 700
}

.stats-row .l {
    font-size: 14px;
    opacity: .85
}

/* CASES */
.cases-head {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 24px;
    flex-wrap: wrap
}

.cases-grid {
    margin-top: 56px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px
}

@media (max-width:960px) {
    .cases-grid {
        grid-template-columns: repeat(2, 1fr)
    }
}

@media (max-width:560px) {
    .cases-grid {
        grid-template-columns: 1fr
    }
}

.case {
    position: relative;
    height: 280px;
    border-radius: 20px;
    overflow: hidden;
    background: var(--navy);
    box-shadow: var(--shadow-md);
    color: #fff
}

.case::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, var(--navy), rgba(15, 26, 61, .3) 50%, transparent)
}

.case .ic-corner {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 80px;
    height: 80px;
    border-radius: 14px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, .2);
    backdrop-filter: blur(10px);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--primary-glow);
    font-size: 60px !important;
    z-index: 2
}

.case .body {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 24px;
    z-index: 2
}

.case .pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 5px 12px;
    border-radius: 999px;
    background: #ffffff;
    color: var(--navy);
    font-size: 12px;
    font-weight: 500;
    backdrop-filter: blur(10px)
}

.case h3 {
    margin-top: 12px;
    font-size: 20px;
    color: #fff
}

/* CTA */
.cta-box {
    position: relative;
    overflow: hidden;
    background: var(--primary);
    color: #fff;
    padding: 48px;
    border-radius: 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 32px;
    flex-wrap: wrap;
    box-shadow: var(--shadow-elegant)
}

.cta-box h2 {
    color: #fff;
    font-size: 32px
}

/* TESTIMONIAL */
.testi {
    max-width: 780px;
    margin: 0 auto;
    background: linear-gradient(135deg, rgba(91, 139, 255, .1), rgba(91, 139, 255, .04));
    padding: 56px;
    border-radius: 24px;
    position: relative
}

.testi p {
    font-family: 'Plus Jakarta Sans';
    font-size: 24px;
    color: var(--navy);
    margin-top: 20px;
    font-weight: 500
}

.testi .who {
    margin-top: 32px;
    display: flex;
    align-items: center;
    gap: 14px
}

.testi .av {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: #ffffff;
    color: var(--navy)
}

.testi .role {
    font-size: 13px;
    color: var(--muted)
}

/* BLOG */
.blog-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 32px;
    margin-top: 56px;
}

@media (max-width:960px) {
    .blog-grid {
        grid-template-columns: 1fr
    }
}

.post {
    background: #ffffff;
    border: 1px solid var(--border);
    border-radius: 20px;
    overflow: hidden;
    transition: .3s
}

.post:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-elegant)
}

.post img {
    height: 220px;
    width: 100%;
    object-fit: cover
}

.post .body {
    padding: 24px
}

.post .pill {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 999px;
    background: #f8fafc;
    color: var(--primary);
    font-size: 12px;
    font-weight: 600
}

.post h3 {
    margin-top: 14px;
    font-size: 20px;
    color: var(--navy)
}

.post .meta {
    margin-top: 10px;
    font-size: 13px;
    color: var(--muted)
}

/* CONTACT */
.contact form {
    max-width: 720px;
    margin: 48px auto 0;
    background: #ffffff;
    border: 1px solid var(--border);
    border-radius: 24px;
    padding: 40px;
    box-shadow: var(--shadow-elegant);
    display: grid;
    gap: 20px
}

.contact .row2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px
}

@media (max-width:560px) {
    .contact .row2 {
        grid-template-columns: 1fr
    }
}

.contact label {
    display: block;
    font-size: 14px;
    font-weight: 600;
    color: var(--navy);
    margin-bottom: 8px
}

.contact input,
.contact textarea {
    width: 100%;
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 14px;
    font-family: inherit;
    font-size: 14px;
    outline: none;
    transition: .2s
}

.contact input:focus,
.contact textarea:focus {
    border-color: var(--primary);
    box-shadow: 0 0 0 4px rgba(91, 139, 255, 0.2)
}

/* FOOTER */
.footer {
    background: var(--navy);
    color: var(--navy-fg);
    padding: 80px 0 32px
}

.footer-grid {
    display: grid;
    grid-template-columns: 1.4fr 1fr 1fr 1.2fr;
    gap: 48px
}

@media (max-width:960px) {
    .footer-grid {
        grid-template-columns: 1fr 1fr
    }
}

@media (max-width:560px) {
    .footer-grid {
        grid-template-columns: 1fr
    }
}

.footer h4 {
    font-size: 18px;
    margin-bottom: 20px
}

.footer p,
.footer li,
.footer a {
    color: rgba(245, 247, 255, .7);
    font-size: 14px
}

.footer ul {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 12px
}

.footer ul a:hover {
    color: var(--primary-glow)
}

.contact-list {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    gap: 12px
}

.contact-list div {
    display: flex;
    align-items: center;
    gap: 10px
}

.contact-list i {
    color: var(--primary-glow)
}

.news {
    margin-top: 20px;
    display: flex;
    border: 1px solid rgba(255, 255, 255, .15);
    background: rgba(255, 255, 255, 0.05);
    border-radius: 999px;
    overflow: hidden;
    backdrop-filter: blur(10px)
}

.news input {
    flex: 1;
    background: transparent;
    border: 0;
    padding: 14px 20px;
    color: #fff;
    outline: none;
    font-size: 14px
}

.news input::placeholder {
    color: rgba(245, 247, 255, .5)
}

.news button {
    width: 48px;
    background: var(--primary);
    border: 0;
    color: #fff;
    cursor: pointer;
    font-size: 18px
}

.socials {
    margin-top: 24px;
    display: flex;
    gap: 12px
}

.socials a {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, .15);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    transition: .2s
}

.socials a:hover {
    border-color: var(--primary-glow);
    background: var(--primary);
    padding-top: 32px;
    border-top: 1px solid rgba(255, 255, 255, .1);
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 16px;
    font-size: 13px;
    color: rgba(245, 247, 255, .6)
}

.copy .links {
    display: flex;
    gap: 24px
}

.material-symbols-outlined, .material-icons {
  font-display: swap;
  white-space: nowrap;
  word-wrap: normal;
  direction: ltr;
  -webkit-font-feature-settings: 'liga';
  -webkit-font-smoothing: antialiased;
}

/* UNIVERSAL RESPONSIVE FIXES */
@media(max-width: 900px) {
  .container { max-width: 100%; padding: 0 1.5rem; }
  [class*="grid"], .grid { grid-template-columns: 1fr 1fr !important; gap: 1rem !important; }
  [class*="flex"]:not(nav), .flex:not(nav) { flex-wrap: wrap; }
  .newsletter, .glass-box, section > div { grid-template-columns: 1fr !important; text-align: center; gap: 2rem !important; }
  form { width: 100%; }
}

@media(max-width: 600px) {
  [class*="grid"], .grid { grid-template-columns: 1fr !important; }
  h1 { font-size: 2.5rem !important; line-height: 1.1 !important; }
  h2 { font-size: 2rem !important; }
  .nav nav, .links { display: none !important; }
  .foot-top, footer > div { flex-direction: column !important; text-align: center; gap: 1.5rem !important; }
  .newsletter form { flex-direction: column; border-radius: 20px !important; padding: 1rem !important; }
  .newsletter input { width: 100%; text-align: center; margin-bottom: 0.5rem; }
  .newsletter button { width: 100%; }
}
`;

export const finance01Html = `
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link
    href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap"
    rel="stylesheet">
<link rel="stylesheet" href="https://unpkg.com/lucide-static@latest/font/lucide.css">

<!-- HEADER -->
  <header class="site-header">
    <div class="container row">
      <div class="logo">LOGO_PLACEHOLDER</div>
      <button class="btn btn-light">Get A Quote <i class="icon-arrow-right"></i></button>
    </div>
  </header>

  <!-- HERO -->
  <section class="hero">
    <div class="container hero-grid">
      <div>
        <span class="tag"><span class="dot"></span> Best Finance Company</span>
        <h1>Our Finance Can Give <span class="grad">Possibilities</span> For Business</h1>
        <p>We deliver tailored financial strategies for ambitious companies — turning complex numbers into clear,
          actionable opportunities for sustainable growth.</p>
        <div class="hero-cta">
          <button class="btn btn-light">Discover More <i class="icon-arrow-right"></i></button>
          <button class="btn btn-outline">Contact Us</button>
        </div>
      </div>
      <div class="hero-img">
        <img src="/assets/templates/finance/templates01/hero-image.jpeg">
        <div class="float-card">
          <div class="ic"><i class="icon-award"></i></div>
          <div>
            <div class="num">25+</div>
            <div class="lbl eyebrow">Years Experience</div>
          </div>
        </div>
      </div>
    </div>
    <svg class="wave" viewBox="0 0 1440 120" preserveAspectRatio="none">
      <path d="M0,80 C240,140 480,20 720,60 C960,100 1200,40 1440,70 L1440,120 L0,120 Z" fill="#fff" />
    </svg>
  </section>

  <!-- HERO OVERLAP FORM -->
  <div class="hero-form-wrap">
    <form class="hero-form" onsubmit="event.preventDefault()">
      <div class="field"><label>Full Name</label>
        <div class="ctrl"><i class="icon-user"></i><input placeholder="John Carter" name="name" id="name"></div>
      </div>
      <div class="field"><label>Email</label>
        <div class="ctrl"><i class="icon-mail"></i><input type="email" placeholder="you@company.com" name="email_address" id="email_address"></div>
      </div>
      <div class="field"><label>Phone</label>
        <div class="ctrl"><i class="icon-phone"></i><input placeholder="+1 (555) 000-0000" name="phone" id="phone"></div>
      </div>
      <button class="btn btn-primary">Get Started </button>
    </form>
  </div>

  <!-- ABOUT -->
  <section class="section about">
    <div class="container about-grid">
      <div class="about-img-wrap">
        <div class="blob1"></div>
        <div class="blob2"></div>
        <img src="/assets/templates/finance/templates01/Service-Growth.jpeg">
        <div class="stat">
          <div class="n">6,561+</div>
          <div class="l">Satisfied Clients</div>
        </div>
      </div>
      <div>
        <span class="eyebrow">About Finova</span>
        <h2>Get Exceptional Service For Growth</h2>
        <p>For over two decades, we've partnered with founders and CFOs to architect financial systems that scale. Our
          team blends deep expertise with modern tools to unlock your company's full potential.</p>
        <ul class="bullets">
          <li><span class="check"><i class="icon-check"></i></span>
            <div>
              <div class="t">Our Mission</div>
              <div class="x">Empower businesses with clarity and confidence.</div>
            </div>
          </li>
          <li><span class="check"><i class="icon-check"></i></span>
            <div>
              <div class="t">Our Goals</div>
              <div class="x">Sustainable growth backed by data-driven strategy.</div>
            </div>
          </li>
        </ul>
        <div style="margin-top:32px"><button class="btn btn-primary">Explore More <i
              class="icon-arrow-right"></i></button></div>
      </div>
    </div>
  </section>

  <!-- SERVICES -->
  <section class="section services">
    <div class="container">
      <div class="center">
        <span class="eyebrow">What We're Offering</span>
        <h2>We Solve Finance Problems With Strategy</h2>
      </div>
      <div class="cards">
        <div class="card">
          <div class="ic"><i class="icon-pie-chart"></i></div>
          <h3>Audit Marketing</h3>
          <p>Detailed performance audits that uncover hidden growth levers.</p><a class="more" href="#">Read More <i
              class="icon-arrow-right"></i></a>
        </div>
        <div class="card">
          <div class="ic"><i class="icon-briefcase"></i></div>
          <h3>Finance Consulting</h3>
          <p>Strategic guidance to optimize cash flow, capital and risk.</p><a class="more" href="#">Read More <i
              class="icon-arrow-right"></i></a>
        </div>
        <div class="card">
          <div class="ic"><i class="icon-trending-up"></i></div>
          <h3>Wealth Management</h3>
          <p>Tailored portfolio strategies for long-term prosperity.</p><a class="more" href="#">Read More <i
              class="icon-arrow-right"></i></a>
        </div>
        <div class="card">
          <div class="ic"><i class="icon-shield-check"></i></div>
          <h3>Risk Advisory</h3>
          <p>Identify, quantify and protect against critical business risks.</p><a class="more" href="#">Read More <i
              class="icon-arrow-right"></i></a>
        </div>
      </div>
    </div>
  </section>

  <!-- MISSION -->
  <section class="section mission">
    <div class="container mission-grid">
      <img src="/assets/templates/finance/templates01/our-mission.jpeg" alt="Founder">
      <div>
        <span class="eyebrow">Why Choose Us</span>
        <h2>Our Mission, Values and Motto</h2>
        <p style="margin-top:18px;color:rgba(245,247,255,.78)">We believe great finance is invisible — it removes
          friction, illuminates decisions and quietly compounds.</p>
        <div class="values">
          <div class="v"><i class="icon-check"></i> Trusted Advisory</div>
          <div class="v"><i class="icon-check"></i> Data-Driven Strategy</div>
          <div class="v"><i class="icon-check"></i> Long-Term Partnership</div>
          <div class="v"><i class="icon-check"></i> Transparent Pricing</div>
        </div>
      </div>
    </div>
  </section>

  <!-- STATS -->
  <section class="section" style="padding:96px 0">
    <div class="container">
      <div class="stats-row">
        <div class="item">
          <div class="ic"><i class="icon-briefcase"></i></div>
          <div>
            <div class="n">1,001+</div>
            <div class="l">Projects Completed</div>
          </div>
        </div>
        <div class="item">
          <div class="ic"><i class="icon-users"></i></div>
          <div>
            <div class="n">6,561+</div>
            <div class="l">Active Clients</div>
          </div>
        </div>
        <div class="item">
          <div class="ic"><i class="icon-lightbulb"></i></div>
          <div>
            <div class="n">600+</div>
            <div class="l">Business Ideas</div>
          </div>
        </div>
        <div class="item">
          <div class="ic"><i class="icon-building-2"></i></div>
          <div>
            <div class="n">250+</div>
            <div class="l">Global Offices</div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- CASES -->
  <section class="section cases">
    <div class="container">
      <div class="cases-head">
        <div>
          <span class="eyebrow">Our Latest Projects</span>
          <h2>Incredible Client Stories</h2>
        </div>
        <button class="btn" style="border:1px solid PRIMARY_COLOR_PLACEHOLDER;color:var(--primary);background:transparent">View
          All Cases <i class="icon-arrow-right"></i></button>
      </div>
      <div class="cases-grid">
        <div class="case">
          <div class="ic-corner"><i class="icon-bar-chart-3"></i></div>
          <div class="body"><span class="pill"><i class="icon-bar-chart-3"></i> Finance</span>
            <h3>Financial Report Restructure</h3>
          </div>
        </div>
        <div class="case">
          <div class="ic-corner"><i class="icon-trending-up"></i></div>
          <div class="body"><span class="pill"><i class="icon-trending-up"></i> Strategy</span>
            <h3>Business Growth Solutions</h3>
          </div>
        </div>
        <div class="case">
          <div class="ic-corner"><i class="icon-wallet"></i></div>
          <div class="body"><span class="pill"><i class="icon-wallet"></i> Wealth</span>
            <h3>Portfolio Optimization Plan</h3>
          </div>
        </div>
        <div class="case">
          <div class="ic-corner"><i class="icon-file-search"></i></div>
          <div class="body"><span class="pill"><i class="icon-file-search"></i> Audit</span>
            <h3>Operational Audit Overhaul</h3>
          </div>
        </div>
        <div class="case">
          <div class="ic-corner"><i class="icon-alert-triangle"></i></div>
          <div class="body"><span class="pill"><i class="icon-alert-triangle"></i> Risk</span>
            <h3>Enterprise Risk Framework</h3>
          </div>
        </div>
        <div class="case">
          <div class="ic-corner"><i class="icon-receipt"></i></div>
          <div class="body"><span class="pill"><i class="icon-receipt"></i> Tax</span>
            <h3>Cross-Border Tax Strategy</h3>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- CTA -->
  <section style="padding:64px 0">
    <div class="container">
      <div class="cta-box">
        <div>
          <span style="font-size:13px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;opacity:.85">Let's
            Talk</span>
          <h2 style="margin-top:8px">Get a Free Expert Consultation For Your Business</h2>
        </div>
        <button class="btn btn-light">Book A Call <i class="icon-arrow-right"></i></button>
      </div>
    </div>
  </section>

  <!-- TESTIMONIAL -->
  <section class="section">
    <div class="container">
      <div class="testi">
        <span class="eyebrow">Testimonial</span>
        <p>"Finova transformed how we think about capital. Their team is sharp, kind, and relentlessly focused on the
          numbers that move our business forward."</p>
        <div class="who">
          <div class="av" style="background-image: url('https://i.pravatar.cc/150?img=11')"></div>
          <div>
            <div class="name">Marcus Chen</div>
            <div class="role">CFO, Helix Ventures</div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- BLOG -->
  <section class="section blog">
    <div class="container">
      <div class="center">
        <span class="eyebrow">Our Blog</span>
        <h2>Latest News and Articles</h2>
      </div>
      <div class="blog-grid">
        <article class="post"><img src="/assets/templates/finance/templates01/blog-01.jpeg" alt="">
          <div class="body"><span class="pill">Strategy</span>
            <h3>Five Levers Every CFO Should Pull in 2026</h3>
            <div class="meta">May 02, 2026 · 6 min read</div>
          </div>
        </article>
        <article class="post"><img src="/assets/templates/finance/templates01/blog-02.jpeg" alt="">
          <div class="body"><span class="pill">Wealth</span>
            <h3>Building Resilient Portfolios in Uncertain Markets</h3>
            <div class="meta">Apr 21, 2026 · 8 min read</div>
          </div>
        </article>
        <article class="post"><img src="/assets/templates/finance/templates01/blog-03.jpeg" alt="">
          <div class="body"><span class="pill">Audit</span>
            <h3>Why Your Annual Audit Is Costing You Money</h3>
            <div class="meta">Apr 12, 2026 · 5 min read</div>
          </div>
        </article>
      </div>
    </div>
  </section>

  <!-- CONTACT -->
  <section class="section contact">
    <div class="container">
      <div class="center">
        <span class="eyebrow">Get In Touch</span>
        <h2>Ready to Talk Numbers?</h2>
      </div>
      <form onsubmit="event.preventDefault()">
        <div class="row2">
          <div><label>Your Name</label><input placeholder="Jane Doe" name="name" id="name"></div>
          <div><label>Email</label><input type="email" placeholder="jane@company.com" name="email_address" id="email_address"></div>
        </div>
        <div><label>Phone</label><input placeholder="+1 (555) 000-0000" name="phone" id="phone"></div>
        <div><label>Message</label><textarea rows="5" placeholder="Tell us about your business..." name="message" id="message"></textarea></div>
        <button class="btn btn-primary" style="justify-content:center">Send Now <i
            class="icon-arrow-right"></i></button>
      </form>
    </div>
  </section>

  <!-- FOOTER -->
  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div>
          <div class="logo">LOGO_PLACEHOLDER</div>
          <p style="margin-top:20px">Premium finance consulting for ambitious businesses. Trusted by founders, CFOs and
            boards across 40+ countries.</p>
          <div class="contact-list">
            <div><i class="icon-phone"></i> +1 (208) 555-0112</div>
            <div><i class="icon-mail"></i> hello@finova.com</div>
            <div><i class="icon-map-pin"></i> 250 Market St, San Francisco</div>
          </div>
        </div>
        <div>
          <h4>Useful Links</h4>
          <ul>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Case Studies</a></li>
            <li><a href="#">Careers</a></li>
            <li><a href="#">Pricing</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </div>
        <div>
          <h4>Services</h4>
          <ul>
            <li><a href="#">Finance Consulting</a></li>
            <li><a href="#">Wealth Management</a></li>
            <li><a href="#">Audit Marketing</a></li>
            <li><a href="#">Risk Advisory</a></li>
            <li><a href="#">Tax Strategy</a></li>
          </ul>
        </div>
        <div>
          <h4>Newsletter</h4>
          <p>Get monthly insights from our senior advisors.</p>
          <form class="news" onsubmit="event.preventDefault()">
            <input type="email" placeholder="Your email" name="email_address" id="email_address">
            <button type="submit"><i class="icon-arrow-right"></i></button>
          </form>
        </div>
      </div>
      <div class="copy">
        <div>© 2026 PROJECT_NAME_PLACEHOLDER. All rights reserved.</div>
        <div class="links"><a href="#">Privacy</a><a href="#">Terms</a><a href="#">Cookies</a></div>
      </div>
    </div>
  </footer>
`;
