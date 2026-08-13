export const healthcare04Styles = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');

:root {
  --primary: PRIMARY_COLOR_PLACEHOLDER;
  --secondary: SECONDARY_COLOR_PLACEHOLDER;
  --p-rgb: PRIMARY_RGB_PLACEHOLDER;
  --s-rgb: SECONDARY_RGB_PLACEHOLDER;
  --text-main: #0c152b;
  --text-muted: #64748b;
  --bg-light: #f4f8fc;
  --bg-dark: #031B4E;
  --white: #ffffff;
  --border: #e2e8f0;
}

*, *::before, *::after {
  box-sizing: border-box;
}

body {
  font-family: 'Outfit', sans-serif;
  color: var(--text-main);
  margin: 0;
  padding: 0;
  overflow-x: hidden;
  background-color: var(--white);
}

img {
  max-width: 100%;
  display: block;
}

a {
  text-decoration: none;
  color: inherit;
}

.hc4-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* TOP BAR */
.hc4-topbar {
  background: var(--bg-dark);
  color: var(--white);
  padding: 10px 0;
  font-size: 13px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
.hc4-topbar .hc4-container {
  display: flex; flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}
.hc4-topbar-left {
  display: flex; flex-wrap: wrap;
  gap: 20px;
  flex-wrap: wrap;
}
.hc4-topbar-left span {
  display: flex; flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  color: rgba(255, 255, 255, 0.85);
}
.hc4-topbar-left i {
  color: var(--secondary);
}
.hc4-topbar-right {
  display: flex; flex-wrap: wrap;
  gap: 15px;
}
.hc4-topbar-right a {
  color: rgba(255, 255, 255, 0.85);
  transition: 0.3s;
  font-size: 14px;
}
.hc4-topbar-right a:hover {
  color: var(--secondary);
}

/* NAVBAR */
.hc4-navbar {
  background: var(--white);
  padding: 18px 0;
  box-shadow: 0 4px 25px rgba(3, 27, 78, 0.05);
  position: sticky;
  top: 0;
  z-index: 100;
}
.hc4-navbar .hc4-container {
  display: flex; flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
}
.hc4-logo {
  display: flex; flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  font-size: 26px;
  font-weight: 800;
  color: var(--primary);
  letter-spacing: -0.5px;
}
.hc4-logo i {
  font-size: 28px;
  color: var(--primary);
}
.hc4-nav-links {
  display: flex; flex-wrap: wrap;
  gap: 30px;
  list-style: none;
  margin: 0;
  padding: 0;
}
.hc4-nav-links a {
  font-weight: 600;
  font-size: 16px;
  color: var(--text-main);
  transition: 0.3s;
  position: relative;
  padding: 5px 0;
}
.hc4-nav-links a::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--primary);
  transition: 0.3s;
}
.hc4-nav-links a:hover {
  color: var(--primary);
}
.hc4-nav-links a:hover::after {
  width: 100%;
}
.hc4-nav-actions {
  display: flex; flex-wrap: wrap;
  align-items: center;
  gap: 20px;
}
.hc4-nav-actions .search-btn {
  color: var(--text-main);
  font-size: 18px;
  cursor: pointer;
  transition: 0.3s;
}
.hc4-nav-actions .search-btn:hover {
  color: var(--primary);
}

.hc4-btn-primary {
  background: var(--btn-bg, var(--primary));
  color: var(--btn-text, var(--white));
  padding: 13px 30px;
  border-radius: 50px;
  font-weight: 600;
  font-size: 15px;
  border: none;
  cursor: pointer;
  transition: 0.3s;
  display: inline-flex; flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}
.hc4-btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(var(--p-rgb), 0.35);
  background: var(--secondary) !important; color: var(--btn-text, var(--white)) !important;
}

.hc4-btn-secondary {
  background: var(--bg-dark);
  color: var(--white);
  padding: 13px 30px;
  border-radius: 50px;
  font-weight: 600;
  font-size: 15px;
  border: none;
  cursor: pointer;
  transition: 0.3s;
  display: inline-flex; flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}
.hc4-btn-secondary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(3, 27, 78, 0.3);
  background: var(--btn-bg, var(--primary)) !important; color: var(--btn-text, var(--white)) !important;
}

/* HERO SECTION */
.hc4-hero {
  background: linear-gradient(135deg, #f4f8fc 0%, #e6f2ff 100%);
  padding: 70px 0 140px;
  position: relative;
  overflow: hidden;
}
.hc4-hero .hc4-container {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 40px;
  align-items: center;
}
.hc4-hero-content {
  position: relative;
  z-index: 2;
}
.hc4-hero-subtitle {
  color: var(--primary);
  font-weight: 700;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 12px;
  display: block;
}
.hc4-hero-content h1 {
  font-size: 58px;
  font-weight: 800;
  line-height: 1.15;
  margin: 0 0 22px;
  color: var(--text-main);
  letter-spacing: -1px;
}
.hc4-hero-content h1 span {
  color: var(--primary);
  position: relative;
  display: inline-block;
}
.hc4-hero-content h1 span::after {
  content: '';
  position: absolute;
  bottom: 8px;
  left: 0;
  width: 100%;
  height: 8px;
  background: rgba(var(--s-rgb), 0.25);
  z-index: -1;
  border-radius: 4px;
}
.hc4-hero-content p {
  font-size: 18px;
  color: var(--text-muted);
  line-height: 1.65;
  margin-bottom: 35px;
  max-width: 580px;
}
.hc4-hero-buttons {
  display: flex; flex-wrap: wrap;
  gap: 15px;
  align-items: center;
}
.hc4-hero-stethoscope-decor {
  position: absolute;
  bottom: -40px;
  left: -20px;
  width: 150px;
  opacity: 0.15;
  animation: spinSlow 30s linear infinite;
}
@keyframes spinSlow {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.hc4-hero-image-wrapper {
  position: relative;
  display: flex; flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}
.hc4-hero-bg-glow {
  position: absolute;
  width: 450px;
  height: 450px;
  background: radial-gradient(circle, rgba(var(--p-rgb), 0.15) 0%, rgba(255, 255, 255, 0) 70%);
  z-index: 1;
}
.hc4-hero-image {
  position: relative;
  z-index: 2;
  border-radius: 30px;
  overflow: hidden;
  box-shadow: 0 20px 45px rgba(3, 27, 78, 0.12);
  border: 8px solid var(--white);
  width: 100%;
  max-width: 460px;
}
.hc4-hero-image img {
  width: 100%;
  height: 480px;
  object-fit: cover;
}
.hc4-hero-badge {
  position: absolute;
  bottom: 30px;
  left: -25px;
  background: var(--white);
  padding: 16px 24px;
  border-radius: 20px;
  box-shadow: 0 12px 35px rgba(3, 27, 78, 0.15);
  display: flex; flex-wrap: wrap;
  align-items: center;
  gap: 15px;
  z-index: 3;
  animation: float 4s ease-in-out infinite;
}
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
.hc4-hero-badge-icon {
  width: 45px;
  height: 45px;
  background: var(--primary);
  color: var(--white);
  border-radius: 50%;
  display: flex; flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}
.hc4-hero-badge-text h4 {
  margin: 0;
  font-size: 17px;
  font-weight: 800;
  color: var(--text-main);
}
.hc4-hero-badge-text p {
  margin: 3px 0 0;
  font-size: 13px;
  color: var(--text-muted);
  font-weight: 500;
}

/* OVERLAPPING BANNER */
.hc4-overlap-banner {
  background: var(--bg-dark);
  border-radius: 24px;
  margin: -70px auto 80px;
  max-width: 1100px;
  position: relative;
  z-index: 10;
  box-shadow: 0 20px 45px rgba(3, 27, 78, 0.25);
  display: flex; flex-wrap: wrap;
  align-items: center;
  padding: 25px 45px;
  justify-content: space-between;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  flex-wrap: wrap;
  gap: 20px;
}
.hc4-overlap-banner::before {
  content: '';
  position: absolute;
  right: -5%;
  top: -50%;
  width: 250px;
  height: 250px;
  background: rgba(var(--s-rgb), 0.15);
  border-radius: 50%;
  filter: blur(40px);
}
.hc4-overlap-left {
  display: flex; flex-wrap: wrap;
  align-items: center;
  gap: 20px;
}
.hc4-overlap-left img {
  width: 65px;
  height: 65px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--secondary);
}
.hc4-overlap-text h3 {
  color: var(--white);
  font-size: 22px;
  font-weight: 700;
  margin: 0 0 5px;
}
.hc4-overlap-text p {
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  font-size: 15px;
}
.hc4-overlap-text span {
  color: var(--secondary);
  font-weight: 700;
}
.hc4-overlap-btn {
  background: var(--white);
  color: var(--bg-dark);
  padding: 14px 28px;
  border-radius: 50px;
  font-weight: 700;
  font-size: 14px;
  transition: 0.3s;
  border: none;
  cursor: pointer;
  display: inline-flex; flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}
.hc4-overlap-btn:hover {
  background: var(--secondary);
  color: var(--bg-dark);
  transform: translateX(3px);
}

/* WHO WE ARE SECTION */
.hc4-about {
  padding: 60px 0;
  position: relative;
}
.hc4-about .hc4-container {
  display: grid;
  grid-template-columns: 0.95fr 1.05fr;
  gap: 70px;
  align-items: center;
}
.hc4-about-image-side {
  position: relative;
}
.hc4-about-circle-wrapper {
  position: relative;
  width: 430px;
  height: 430px;
  margin: 0 auto;
}
.hc4-about-circle-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 10px solid #f0f6ff;
  box-shadow: 0 15px 35px rgba(3, 27, 78, 0.1);
}
.hc4-about-overlay-badge {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background: var(--primary);
  width: 70px;
  height: 70px;
  border-radius: 50%;
  display: flex; flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  color: var(--white);
  font-size: 26px;
  box-shadow: 0 8px 25px rgba(var(--p-rgb), 0.4);
  border: 4px solid var(--white);
}
.hc4-section-badge {
  color: var(--primary);
  font-weight: 700;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 12px;
  display: inline-block;
  background: rgba(var(--p-rgb), 0.08);
  padding: 6px 16px;
  border-radius: 50px;
}
.hc4-section-title {
  font-size: 40px;
  font-weight: 800;
  line-height: 1.25;
  margin: 0 0 20px;
  color: var(--text-main);
  letter-spacing: -0.5px;
}
.hc4-about-text p {
  color: var(--text-muted);
  font-size: 16px;
  line-height: 1.7;
  margin-bottom: 25px;
}
.hc4-about-list {
  list-style: none;
  padding: 0;
  margin: 0 0 35px 0;
}
.hc4-about-list li {
  display: flex; flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  margin-bottom: 15px;
  font-weight: 600;
  font-size: 16px;
  color: var(--text-main);
}
.hc4-about-list i {
  color: var(--primary);
  font-size: 20px;
}

/* STATISTICS BANNER */
.hc4-stats {
  background: var(--bg-dark);
  padding: 50px 0;
  position: relative;
  overflow: hidden;
  border-top: 4px solid var(--secondary);
}
.hc4-stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
  text-align: center;
}
.hc4-stat-item {
  color: var(--white);
  position: relative;
}
.hc4-stat-item:not(:last-child)::after {
  content: '';
  position: absolute;
  right: -15px;
  top: 15%;
  height: 70%;
  width: 1px;
  background: rgba(255, 255, 255, 0.15);
}
.hc4-stat-item h3 {
  font-size: 42px;
  font-weight: 800;
  margin: 0 0 5px;
  color: var(--primary);
  line-height: 1.1;
}
.hc4-stat-item p {
  margin: 0;
  font-size: 15px;
  color: rgba(255, 255, 255, 0.85);
  font-weight: 500;
}

/* SERVICES GRID SECTION */
.hc4-services {
  padding: 90px 0;
  background: var(--bg-light);
  text-align: center;
}
.hc4-services-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 25px;
  margin-top: 45px;
}
.hc4-service-card {
  background: var(--white);
  padding: 35px 25px;
  border-radius: 20px;
  box-shadow: 0 6px 20px rgba(3, 27, 78, 0.03);
  transition: 0.3s;
  position: relative;
  overflow: hidden;
  text-align: left;
  border: 1px solid #f0f6ff;
}
.hc4-service-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(3, 27, 78, 0.08);
}
.hc4-service-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: var(--primary);
  transform: scaleX(0);
  transition: 0.3s;
  transform-origin: left;
}
.hc4-service-card:hover::before {
  transform: scaleX(1);
}
.hc4-service-icon {
  width: 65px;
  height: 65px;
  background: rgba(var(--p-rgb), 0.08);
  color: var(--primary);
  border-radius: 16px;
  display: flex; flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  margin-bottom: 25px;
  transition: 0.3s;
}
.hc4-service-card:hover .hc4-service-icon {
  background: var(--primary);
  color: var(--white);
  transform: rotateY(180deg);
}
.hc4-service-card h4 {
  font-size: 19px;
  font-weight: 700;
  margin: 0 0 12px;
  color: var(--text-main);
}
.hc4-service-card p {
  color: var(--text-muted);
  font-size: 14.5px;
  line-height: 1.6;
  margin: 0 0 20px;
}
.hc4-service-link {
  color: var(--primary);
  font-weight: 700;
  font-size: 14px;
  display: inline-flex; flex-wrap: wrap;
  align-items: center;
  gap: 5px;
}
.hc4-service-link i {
  transition: 0.3s;
}
.hc4-service-card:hover .hc4-service-link i {
  transform: translateX(4px);
}

.hc4-bottom-info {
  margin-top: 40px;
  font-weight: 600;
  color: var(--text-muted);
  font-size: 16px;
}
.hc4-bottom-info a {
  color: var(--primary);
  text-decoration: underline;
}

/* TEAM SECTION */
.hc4-team {
  padding: 90px 0;
}
.hc4-team-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
  margin-top: 45px;
}
.hc4-team-card {
  background: var(--white);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(3, 27, 78, 0.04);
  transition: 0.3s;
  border: 1px solid #f0f6ff;
}
.hc4-team-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(3, 27, 78, 0.1);
}
.hc4-team-img-wrapper {
  overflow: hidden;
  position: relative;
  aspect-ratio: 1/1.15;
}
.hc4-team-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: 0.5s;
}
.hc4-team-card:hover .hc4-team-img {
  transform: scale(1.05);
}
.hc4-team-info {
  padding: 22px;
  text-align: center;
}
.hc4-team-info h4 {
  margin: 0 0 6px;
  font-size: 19px;
  font-weight: 700;
  color: var(--text-main);
}
.hc4-team-info p {
  margin: 0;
  color: var(--primary);
  font-size: 14.5px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* MEDICAL RECOVERY SECTION */
.hc4-recovery {
  padding: 95px 0;
  background: var(--bg-light);
}
.hc4-recovery .hc4-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 70px;
  align-items: center;
}
.hc4-recovery-left {
  position: relative;
}
.hc4-recovery-list {
  list-style: none;
  padding: 0;
  margin: 25px 0 35px 0;
}
.hc4-recovery-list li {
  display: flex; flex-wrap: wrap;
  align-items: center;
  gap: 15px;
  margin-bottom: 18px;
  font-size: 16px;
  font-weight: 600;
  background: var(--white);
  padding: 16px 20px;
  border-radius: 14px;
  box-shadow: 0 6px 15px rgba(3, 27, 78, 0.02);
  border: 1px solid #f0f6ff;
}
.hc4-recovery-list i {
  color: var(--primary);
  font-size: 22px;
}
.hc4-recovery-image {
  border-radius: 28px;
  overflow: hidden;
  box-shadow: 0 15px 35px rgba(3, 27, 78, 0.08);
  border: 6px solid var(--white);
}
.hc4-recovery-image img {
  width: 100%;
  height: 420px;
  object-fit: cover;
}

/* CTA BANNER */
.hc4-cta {
  background: var(--bg-dark);
  padding: 70px 0;
  text-align: center;
  position: relative;
  overflow: hidden;
  border-bottom: 4px solid var(--secondary);
}
.hc4-cta::before {
  content: "";
  position: absolute;
  top: -50%;
  left: -10%;
  width: 450px;
  height: 450px;
  background: rgba(var(--s-rgb), 0.15);
  border-radius: 50%;
  filter: blur(60px);
}
.hc4-cta h2 {
  color: var(--white);
  font-size: 42px;
  font-weight: 800;
  margin: 0 0 30px;
  position: relative;
  z-index: 2;
  letter-spacing: -0.5px;
}

/* TABBED SERVICE EXPLORATION & ANIMATIONS */
.hc4-pulse-anim { animation: hc4Pulse 2s infinite; }
.hc4-float-anim { animation: hc4Float 3s ease-in-out infinite; }
@keyframes hc4Pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.15); }
  100% { transform: scale(1); }
}
@keyframes hc4Float {
  0% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
  100% { transform: translateY(0); }
}
.feather-activity { color: var(--secondary); stroke-width: 2.5; }

.hc4-explore {
  padding: 95px 0;
}
.hc4-accordion-wrapper {
  max-width: 900px;
  margin: 40px auto 0;
  display: flex; flex-wrap: wrap;
  flex-direction: column;
  gap: 15px;
}
.hc4-accordion-item {
  background: var(--bg-light);
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
}
.hc4-accordion-item[open] {
  border-color: var(--primary);
  box-shadow: 0 10px 30px rgba(var(--p-rgb), 0.1);
  background: var(--white);
}
.hc4-accordion-header {
  padding: 20px 25px;
  cursor: pointer;
  display: flex; flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  font-weight: 700;
  color: var(--text-main);
  list-style: none;
  user-select: none;
  transition: 0.3s;
}
.hc4-accordion-header::-webkit-details-marker {
  display: none;
}
.hc4-accordion-header::marker { display: none; content: ""; }
.hc4-accordion-header::after { display: none !important; content: none !important; }
.hc4-accordion-header:hover {
  color: var(--primary);
}
.hc4-accordion-icon {
  font-size: 18px;
  color: var(--primary);
  transition: transform 0.3s ease;
}
.hc4-accordion-item[open] .hc4-accordion-icon {
  transform: rotate(180deg);
}
.hc4-accordion-body {
  padding: 0 25px 30px;
}
.hc4-tab-content-panel {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 40px;
  align-items: center;
  margin-top: 10px;
  animation: fadeIn 0.4s ease;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.hc4-tab-image {
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 15px 35px rgba(3, 27, 78, 0.08);
}
.hc4-tab-image img {
  width: 100%;
  height: 380px;
  object-fit: cover;
}
.hc4-tab-info h3 {
  font-size: 32px;
  font-weight: 800;
  margin: 0 0 15px;
  color: var(--text-main);
}
.hc4-tab-info p {
  color: var(--text-muted);
  font-size: 16px;
  line-height: 1.7;
  margin-bottom: 25px;
}
.hc4-tab-points {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-bottom: 30px;
}
.hc4-tab-point {
  display: flex; flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  color: var(--text-main);
}
.hc4-tab-point i {
  color: var(--secondary);
}

/* APPOINTMENT FORM SECTION */
.hc4-appointment {
  padding: 95px 0;
  background: var(--bg-light);
}
.hc4-appointment .hc4-container {
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  gap: 60px;
  background: var(--white);
  border-radius: 30px;
  overflow: hidden;
  box-shadow: 0 20px 45px rgba(3, 27, 78, 0.05);
  border: 1px solid #f0f6ff;
}
.hc4-appointment-form {
  padding: 55px;
}
.hc4-form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}
.hc4-input {
  width: 100%;
  padding: 15px 22px;
  border: 1px solid var(--border);
  border-radius: 12px;
  font-family: inherit;
  font-size: 15px;
  outline: none;
  transition: 0.3s;
  background: #f8fafc;
}
.hc4-input:focus {
  border-color: var(--primary);
  background: var(--white);
  box-shadow: 0 4px 12px rgba(var(--p-rgb), 0.08);
}
select.hc4-input {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 15px center;
  background-size: 18px;
}
.hc4-appointment-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* BLOG SECTION */
.hc4-blog {
  padding: 95px 0;
}
.hc4-blog-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  margin-top: 45px;
}
.hc4-blog-card {
  background: var(--white);
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid #f0f6ff;
  box-shadow: 0 6px 20px rgba(3, 27, 78, 0.02);
  transition: 0.3s;
}
.hc4-blog-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(3, 27, 78, 0.07);
}
.hc4-blog-img-wrapper {
  overflow: hidden;
  aspect-ratio: 16/10.5;
}
.hc4-blog-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: 0.5s;
}
.hc4-blog-card:hover .hc4-blog-img {
  transform: scale(1.05);
}
.hc4-blog-content {
  padding: 28px;
}
.hc4-blog-date {
  background: rgba(var(--p-rgb), 0.08);
  color: var(--primary);
  display: inline-block;
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 700;
  margin-bottom: 18px;
}
.hc4-blog-content h4 {
  font-size: 20px;
  margin: 0 0 12px;
  line-height: 1.4;
  color: var(--text-main);
  font-weight: 700;
}
.hc4-blog-content p {
  color: var(--text-muted);
  font-size: 14.5px;
  line-height: 1.6;
  margin-bottom: 20px;
}

/* SUBSCRIBE SECTION */
.hc4-subscribe {
  padding: 85px 0;
  position: relative;
  z-index: 10;
}
.hc4-subscribe-card {
  background: var(--primary);
  border-radius: 24px;
  padding: 65px 50px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  align-items: center;
  box-shadow: 0 15px 40px rgba(var(--p-rgb), 0.2);
  position: relative;
  overflow: hidden;
}
.hc4-subscribe-card::before {
  content: "";
  position: absolute;
  top: -20%;
  right: -10%;
  width: 400px;
  height: 400px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  filter: blur(40px);
}
.hc4-subscribe-text h2 {
  color: var(--white);
  font-size: 36px;
  font-weight: 800;
  margin: 0 0 15px;
}
.hc4-subscribe-text p {
  color: rgba(255, 255, 255, 0.9);
  font-size: 16px;
  margin: 0;
  line-height: 1.6;
}
.hc4-subscribe-form {
  display: flex; flex-wrap: wrap;
  background: var(--white);
  padding: 8px;
  border-radius: 50px;
  position: relative;
  z-index: 2;
}
.hc4-subscribe-input {
  flex: 1;
  border: none;
  background: transparent;
  padding: 15px 25px;
  font-family: inherit;
  font-size: 16px;
  outline: none;
  color: var(--text-main);
}
.hc4-subscribe-input::placeholder {
  color: var(--text-muted);
}
.hc4-subscribe-btn {
  background: var(--btn-bg, var(--bg-dark));
  color: var(--btn-text, var(--white));
  border: none;
  padding: 15px 35px;
  border-radius: 50px;
  font-weight: 700;
  font-size: 15px;
  cursor: pointer;
  transition: 0.3s;
}
.hc4-subscribe-btn:hover {
  background: var(--secondary) !important;
  color: var(--btn-text, var(--white)) !important;
}
@media (max-width: 991px) {
  .hc4-subscribe-card {
    grid-template-columns: 1fr;
    text-align: center;
    padding: 50px 30px;
  }
}
@media (max-width: 576px) {
  .hc4-subscribe-form {
    flex-direction: column;
    background: transparent;
    padding: 0;
    gap: 15px;
  }
  .hc4-subscribe-input {
    background: var(--white);
    border-radius: 50px;
  }
  .hc4-subscribe-btn {
    width: 100%;
  }
}

/* FOOTER */
.hc4-footer {
  background: var(--bg-dark);
  color: var(--white);
  padding: 85px 0 30px;
  position: relative;
}
.hc4-footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1.5fr;
  gap: 50px;
  margin-bottom: 50px;
}
.hc4-footer-logo {
  font-size: 28px;
  font-weight: 800;
  color: var(--white);
  display: flex; flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}
.hc4-footer-logo i {
  color: var(--secondary);
}
.hc4-footer p {
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.75;
  font-size: 15px;
}
.hc4-footer h5 {
  font-size: 19px;
  font-weight: 800;
  margin: 0 0 25px;
  color: var(--white);
}
.hc4-footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}
.hc4-footer-links li {
  margin-bottom: 15px;
}
.hc4-footer-links a {
  color: rgba(255, 255, 255, 0.75);
  transition: 0.3s;
  font-size: 15px;
}
.hc4-footer-links a:hover {
  color: var(--secondary);
  padding-left: 6px;
}
.hc4-footer-socials {
  display: flex; flex-wrap: wrap;
  gap: 12px;
  margin-top: 25px;
}
.hc4-footer-social {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.08);
  color: var(--white);
  border-radius: 50%;
  display: flex; flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  transition: 0.3s;
  font-size: 15px;
}
.hc4-footer-social:hover {
  background: var(--secondary);
  color: var(--bg-dark);
  transform: translateY(-3px);
}
.hc4-footer-contact-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.hc4-footer-contact-list li {
  display: flex; flex-wrap: wrap;
  gap: 12px;
  align-items: flex-start;
  margin-bottom: 18px;
  color: rgba(255, 255, 255, 0.75);
  font-size: 15px;
}
.hc4-footer-contact-list i {
  color: var(--secondary);
  margin-top: 4px;
}

.hc4-footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 30px;
  text-align: center;
  color: rgba(255, 255, 255, 0.5);
  font-size: 14.5px;
  font-weight: 500;
}

/* RESPONSIVE */
@media (max-width: 1024px) {
  .hc4-services-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .hc4-team-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 991px) {
  .hc4-hero .hc4-container, 
  .hc4-about .hc4-container, 
  .hc4-recovery .hc4-container, 
  .hc4-tab-content-panel,
  .hc4-appointment .hc4-container {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  .hc4-hero-image-wrapper {
    margin-top: 40px;
  }
  .hc4-about-circle-wrapper {
    width: 320px;
    height: 320px;
  }
  .hc4-stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .hc4-stat-item:nth-child(2)::after {
    display: none;
  }
  .hc4-footer-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .hc4-nav-links {
    display: none;
  }
}
@media (max-width: 767px) {
  .hc4-hero-content h1 {
    font-size: 42px;
  }
  .hc4-overlap-banner {
    padding: 30px;
    margin-top: -40px;
  }
  .hc4-overlap-left {
    flex-direction: column;
    text-align: center;
  }
  .hc4-overlap-banner {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  .hc4-stats-grid {
    grid-template-columns: 1fr;
  }
  .hc4-stat-item::after {
    display: none !important;
  }
  .hc4-services-grid, .hc4-team-grid, .hc4-blog-grid, .hc4-footer-grid {
    grid-template-columns: 1fr;
  }
  .hc4-form-grid {
    grid-template-columns: 1fr;
  }
  .hc4-appointment-form {
    padding: 30px;
  }
}


  /* Extracted Template Inline Styles */
  .tpl-templates04-1 { color: var(--white); }
  .tpl-templates04-2 { background: var(--white); color: var(--bg-dark); }
  .tpl-templates04-3 { border: 2px dashed #22c55e; border-radius: 8px; background: rgba(34,197,94,0.1); color: #166534; }
`;

export const healthcare04Html = `
  <!-- Top Bar -->
  <div class="hc4-topbar">
    <div class="hc4-container">
      <div class="hc4-topbar-left">
        <span><i class="fas fa-envelope"></i> CONTACT_PLACEHOLDER</span>
        <span><i class="fas fa-phone-alt"></i> PHONE_PLACEHOLDER</span>
        <span><i class="far fa-clock"></i> Mon - Sat: 8:00 AM - 9:00 PM</span>
      </div>
      <div class="hc4-topbar-right">
        <a href="javascript:void(0);"><i class="fab fa-facebook-f"></i></a>
        <a href="javascript:void(0);"><i class="fab fa-twitter"></i></a>
        <a href="javascript:void(0);"><i class="fab fa-instagram"></i></a>
        <a href="javascript:void(0);"><i class="fab fa-linkedin-in"></i></a>
      </div>
    </div>
  </div>

  <!-- Navbar -->
  

  <!-- Hero Section -->
  <header class="hc4-hero">
    <div class="hc4-hero-stethoscope-decor">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="feather feather-activity"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
    </div>
    <div class="hc4-container">
      <div class="hc4-hero-content">
        <span class="hc4-hero-subtitle">WELCOME TO MEDLIO HEALTHCARE</span>
        <h1>We Hospital Doctors Patients <span>Service.</span></h1>
        <p>Elite Medical Group is a leading healthcare provider, delivering world-class medical services with a team of professional doctors.</p>
        <div class="hc4-hero-buttons">
          <button class="hc4-btn-primary">LEARN MORE</button>
          <button class="hc4-btn-secondary">CONTACT US</button>
        </div>
      </div>
      <div class="hc4-hero-image-wrapper">
        <div class="hc4-hero-bg-glow"></div>
        <div class="hc4-hero-image">
          <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=800&q=80" alt="Doctors">
        </div>
        <div class="hc4-hero-badge hc4-float-anim">
          <div class="hc4-hero-badge-icon hc4-pulse-anim">
            <i data-feather="activity" class="feather-activity tpl-templates04-1"  ></i>
          </div>
          <div class="hc4-hero-badge-text">
            <h4>24/7 Service</h4>
            <p>Emergency Care</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Overlapping Banner -->
  <div class="hc4-overlap-banner">
    <div class="hc4-overlap-left">
      <img src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=150&q=80" alt="Doctor Contact">
      <div class="hc4-overlap-text">
        <h3>For Your Family Care Service.</h3>
        <p>Call Us Directly: <span>PHONE_PLACEHOLDER</span></p>
      </div>
    </div>
    <button class="hc4-overlap-btn">BOOK APPOINTMENT <i class="fas fa-arrow-right"></i></button>
  </div>

  <!-- Who We Are (About) Section -->
  <section class="hc4-about">
    <div class="hc4-container">
      <div class="hc4-about-image-side">
        <div class="hc4-about-circle-wrapper">
          <img src="https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=600&q=80" alt="Medical Team" class="hc4-about-circle-img">
          <div class="hc4-about-overlay-badge">
            <i class="fas fa-hand-holding-heart"></i>
          </div>
        </div>
      </div>
      <div class="hc4-about-text">
        <span class="hc4-section-badge">WHO WE ARE</span>
        <h2 class="hc4-section-title">Welcome to PROJECT_NAME_PLACEHOLDER</h2>
        <p>Providing the best medical services for your family. We combine advanced medical technology with compassionate care to ensure swift and effective recovery for all our patients.</p>
        <ul class="hc4-about-list">
          <li><i class="fas fa-check-circle"></i> Experienced Staff & Professional Doctors</li>
          <li><i class="fas fa-check-circle"></i> Modern Hospital Facilities & Equipment</li>
          <li><i class="fas fa-check-circle"></i> 24/7 Emergency Support Services</li>
        </ul>
        <button class="hc4-btn-primary">DISCOVER MORE</button>
      </div>
    </div>
  </section>

  <!-- Statistics Banner -->
  <section class="hc4-stats">
    <div class="hc4-container">
      <div class="hc4-stats-grid">
        <div class="hc4-stat-item">
          <h3>15K+</h3>
          <p>Happy Patients</p>
        </div>
        <div class="hc4-stat-item">
          <h3>250+</h3>
          <p>Professional Doctors</p>
        </div>
        <div class="hc4-stat-item">
          <h3>100+</h3>
          <p>Modern Equipment</p>
        </div>
        <div class="hc4-stat-item">
          <h3>50+</h3>
          <p>Medical Services</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Services Grid -->
  <section class="hc4-services">
    <div class="hc4-container">
      <span class="hc4-section-badge">OUR SERVICES</span>
      <h2 class="hc4-section-title">High-Quality Services We Offer</h2>
      
      <div class="hc4-services-grid">
        <div class="hc4-service-card">
          <div class="hc4-service-icon"><i class="fas fa-heartbeat"></i></div>
          <h4>Cardiology</h4>
          <p>Advanced cardiac care, diagnostics, and treatment plans tailored for your heart health.</p>
          <a href="javascript:void(0);" class="hc4-service-link">Read More <i class="fas fa-arrow-right"></i></a>
        </div>
        <div class="hc4-service-card">
          <div class="hc4-service-icon"><i class="fas fa-brain"></i></div>
          <h4>Neurology</h4>
          <p>Comprehensive neurological evaluations and innovative treatments for nerve disorders.</p>
          <a href="javascript:void(0);" class="hc4-service-link">Read More <i class="fas fa-arrow-right"></i></a>
        </div>
        <div class="hc4-service-card">
          <div class="hc4-service-icon"><i class="fas fa-tooth"></i></div>
          <h4>Dental Care</h4>
          <p>Professional dental services ensuring a healthy, bright smile for you and your family.</p>
          <a href="javascript:void(0);" class="hc4-service-link">Read More <i class="fas fa-arrow-right"></i></a>
        </div>
        <div class="hc4-service-card">
          <div class="hc4-service-icon"><i class="fas fa-bone"></i></div>
          <h4>Orthopedics</h4>
          <p>Specialized bone and joint care to help you maintain an active and pain-free lifestyle.</p>
          <a href="javascript:void(0);" class="hc4-service-link">Read More <i class="fas fa-arrow-right"></i></a>
        </div>
        <div class="hc4-service-card">
          <div class="hc4-service-icon"><i class="fas fa-eye"></i></div>
          <h4>Eye Care</h4>
          <p>Complete vision tests, eye treatments, and surgical solutions for optimal vision.</p>
          <a href="javascript:void(0);" class="hc4-service-link">Read More <i class="fas fa-arrow-right"></i></a>
        </div>
        <div class="hc4-service-card">
          <div class="hc4-service-icon"><i class="fas fa-lungs"></i></div>
          <h4>Pulmonary</h4>
          <p>Expert respiratory care and therapies for asthma, COPD, and other lung conditions.</p>
          <a href="javascript:void(0);" class="hc4-service-link">Read More <i class="fas fa-arrow-right"></i></a>
        </div>
        <div class="hc4-service-card">
          <div class="hc4-service-icon"><i class="fas fa-baby"></i></div>
          <h4>Pediatrics</h4>
          <p>Specialized physical, mental, and behavioral care for infants, children, and teens.</p>
          <a href="javascript:void(0);" class="hc4-service-link">Read More <i class="fas fa-arrow-right"></i></a>
        </div>
        <div class="hc4-service-card">
          <div class="hc4-service-icon"><i class="fas fa-dna"></i></div>
          <h4>Oncology</h4>
          <p>Compassionate care combined with advanced oncology research and therapies.</p>
          <a href="javascript:void(0);" class="hc4-service-link">Read More <i class="fas fa-arrow-right"></i></a>
        </div>
      </div>

      <div class="hc4-bottom-info">
        Need custom medical consultations? <a href="javascript:void(0);">Learn more about our health solutions.</a>
      </div>
    </div>
  </section>

  <!-- Team Section -->
  <section class="hc4-team">
    <div class="hc4-container">
      <div style="text-align: center;">
        <span class="hc4-section-badge">OUR EXPERTS</span>
        <h2 class="hc4-section-title">Meet Our Specialists</h2>
      </div>
      <div class="hc4-team-grid">
        <div class="hc4-team-card">
          <div class="hc4-team-img-wrapper">
            <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80" alt="Doctor" class="hc4-team-img">
          </div>
          <div class="hc4-team-info">
            <h4>Dr. Sarah Mitchell</h4>
            <p>Cardiologist</p>
          </div>
        </div>
        <div class="hc4-team-card">
          <div class="hc4-team-img-wrapper">
            <img src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80" alt="Doctor" class="hc4-team-img">
          </div>
          <div class="hc4-team-info">
            <h4>Dr. James Anderson</h4>
            <p>Neurologist</p>
          </div>
        </div>
        <div class="hc4-team-card">
          <div class="hc4-team-img-wrapper">
            <img src="https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=400&q=80" alt="Doctor" class="hc4-team-img">
          </div>
          <div class="hc4-team-info">
            <h4>Dr. Emily Chen</h4>
            <p>Pediatrician</p>
          </div>
        </div>
        <div class="hc4-team-card">
          <div class="hc4-team-img-wrapper">
            <img src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80" alt="Doctor" class="hc4-team-img">
          </div>
          <div class="hc4-team-info">
            <h4>Dr. Michael Roberts</h4>
            <p>Orthopedic Surgeon</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Medical Recovery Section -->
  <section class="hc4-recovery">
    <div class="hc4-container">
      <div class="hc4-recovery-left">
        <span class="hc4-section-badge">WHY CHOOSE US</span>
        <h2 class="hc4-section-title">Medical Recovery Service & Health Solutions.</h2>
        <p>We combine advanced medical technology with compassionate care to ensure swift and effective recovery for all our patients.</p>
        
        <ul class="hc4-recovery-list">
          <li><i class="fas fa-check-circle"></i> 100% Expert Doctors & Nurses</li>
          <li><i class="fas fa-check-circle"></i> Modern Hospital Facilities</li>
          <li><i class="fas fa-check-circle"></i> Affordable Medical Treatments</li>
        </ul>
        
        <button class="hc4-btn-primary">DISCOVER MORE</button>
      </div>
      <div class="hc4-recovery-image">
        <img src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80" alt="Medical Recovery">
      </div>
    </div>
  </section>

  <!-- Call to Action -->
  <section class="hc4-cta">
    <div class="hc4-container">
      <h2>Professional Medical Care Services<br>For Your Family</h2>
      <button class="hc4-btn-primary tpl-templates04-2"  >MAKE AN APPOINTMENT</button>
    </div>
  </section>

  <!-- Explore Offerings Section (Tabs) -->
  <section class="hc4-explore">
    <div class="hc4-container">
      <div style="text-align: center;">
        <span class="hc4-section-badge">OUR SERVICES</span>
        <h2 class="hc4-section-title">Explore Our Service Offerings</h2>
      </div>

      <div class="hc4-accordion-wrapper">
        <!-- Cardiology Accordion -->
        <details class="hc4-accordion-item" open>
          <summary class="hc4-accordion-header">
            Cardiology Department
            <i class="fas fa-chevron-down hc4-accordion-icon"></i>
          </summary>
          <div class="hc4-accordion-body">
            <div class="hc4-tab-content-panel">
              <div class="hc4-tab-image">
                <img src="https://images.unsplash.com/photo-1581056771107-24ca5f033842?auto=format&fit=crop&w=600&q=80" alt="Cardiology Image">
              </div>
              <div class="hc4-tab-info">
                <h3>Advanced Cardiology Solutions</h3>
                <p>Our cardiology center features next-generation equipment to diagnose and treat all cardiovascular conditions. We provide complete outpatient and inpatient care for your heart health.</p>
                <div class="hc4-tab-points">
                  <div class="hc4-tab-point"><i class="fas fa-heart"></i> Comprehensive Testing</div>
                  <div class="hc4-tab-point"><i class="fas fa-user-md"></i> Expert Cardiologists</div>
                  <div class="hc4-tab-point"><i class="fas fa-hospital-alt"></i> High-tech Cardiac Labs</div>
                  <div class="hc4-tab-point"><i class="fas fa-clock"></i> 24/7 ICU Care</div>
                </div>
                <button class="hc4-btn-primary">LEARN MORE</button>
              </div>
            </div>
          </div>
        </details>

        <!-- Neurology Accordion -->
        <details class="hc4-accordion-item">
          <summary class="hc4-accordion-header">
            Neurology Clinic
            <i class="fas fa-chevron-down hc4-accordion-icon"></i>
          </summary>
          <div class="hc4-accordion-body">
            <div class="hc4-tab-content-panel">
              <div class="hc4-tab-image">
                <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80" alt="Neurology Image">
              </div>
              <div class="hc4-tab-info">
                <h3>Neurology & Brain Clinic</h3>
                <p>Treating complex neurological issues with state of the art technology. Our specialists diagnose nerve disorders, brain trauma, and spinal concerns with highly tailored recovery routes.</p>
                <div class="hc4-tab-points">
                  <div class="hc4-tab-point"><i class="fas fa-check"></i> MRI & CT Scanning</div>
                  <div class="hc4-tab-point"><i class="fas fa-check"></i> Brain Mapping</div>
                  <div class="hc4-tab-point"><i class="fas fa-check"></i> Nerve Therapy</div>
                  <div class="hc4-tab-point"><i class="fas fa-check"></i> Stroke Management</div>
                </div>
                <button class="hc4-btn-primary">LEARN MORE</button>
              </div>
            </div>
          </div>
        </details>

        <!-- Dental Accordion -->
        <details class="hc4-accordion-item">
          <summary class="hc4-accordion-header">
            Dental Care Center
            <i class="fas fa-chevron-down hc4-accordion-icon"></i>
          </summary>
          <div class="hc4-accordion-body">
            <div class="hc4-tab-content-panel">
              <div class="hc4-tab-image">
                <img src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=600&q=80" alt="Dental Image">
              </div>
              <div class="hc4-tab-info">
                <h3>Comprehensive Dental Care</h3>
                <p>Specialized dental cosmetic and restorative care for adults and children. We ensure healthy smiles through regular dental checkups, implants, and orthodontics.</p>
                <div class="hc4-tab-points">
                  <div class="hc4-tab-point"><i class="fas fa-tooth"></i> Cosmetic Fillings</div>
                  <div class="hc4-tab-point"><i class="fas fa-smile"></i> Dental Implants</div>
                  <div class="hc4-tab-point"><i class="fas fa-teeth-open"></i> Root Canals</div>
                  <div class="hc4-tab-point"><i class="fas fa-plus"></i> Orthodontic Braces</div>
                </div>
                <button class="hc4-btn-primary">LEARN MORE</button>
              </div>
            </div>
          </div>
        </details>

        <!-- Pediatrics Accordion -->
        <details class="hc4-accordion-item">
          <summary class="hc4-accordion-header">
            Pediatric Department
            <i class="fas fa-chevron-down hc4-accordion-icon"></i>
          </summary>
          <div class="hc4-accordion-body">
            <div class="hc4-tab-content-panel">
              <div class="hc4-tab-image">
                <img src="https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=600&q=80" alt="Pediatrics Image">
              </div>
              <div class="hc4-tab-info">
                <h3>Pediatric Care Center</h3>
                <p>A friendly, warm environment for child care from infants to teens. We prioritize early health education, child vaccination grids, and pediatric emergencies.</p>
                <div class="hc4-tab-points">
                  <div class="hc4-tab-point"><i class="fas fa-baby"></i> Child Vaccinations</div>
                  <div class="hc4-tab-point"><i class="fas fa-child"></i> Growth Checkups</div>
                  <div class="hc4-tab-point"><i class="fas fa-stethoscope"></i> Emergency Support</div>
                  <div class="hc4-tab-point"><i class="fas fa-band-aid"></i> General Care</div>
                </div>
                <button class="hc4-btn-primary">LEARN MORE</button>
              </div>
            </div>
          </div>
        </details>
      </div>
    </div>
  </section>

  <!-- Appointment Form -->
  <section class="hc4-appointment">
    <div class="hc4-container">
      <div class="hc4-appointment-form">
        <span class="hc4-section-badge">BOOK NOW</span>
        <h2 class="hc4-section-title" style="margin-bottom: 25px;">Make An Appointment</h2>
        <form>
          <div class="hc4-form-grid">
            <input type="text" class="hc4-input" placeholder="Your Name" required>
            <input type="email" class="hc4-input" placeholder="Email Address" required>
          </div>
          <div class="hc4-form-grid">
            <input type="tel" class="hc4-input" placeholder="Phone Number" required>
            <select class="hc4-input" required>
              <option value="" disabled selected>Select Department</option>
              <option value="cardiology">Cardiology</option>
              <option value="neurology">Neurology</option>
              <option value="dental">Dental Care</option>
              <option value="pediatrics">Pediatrics</option>
            </select>
          </div>
          <div class="hc4-form-grid">
            <input type="date" class="hc4-input" required>
            <input type="time" class="hc4-input" required>
          </div>
          <textarea class="hc4-input" placeholder="Additional Message" rows="4" style="margin-bottom: 20px; resize: none;" required></textarea>
          <button type="submit" class="hc4-btn-primary" style="width: 100%; justify-content: center; padding: 16px; font-weight: 700;">Confirm Appointment</button>
        </form>
      </div>
      <div>
        <img src="https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=700&q=80" alt="Appointment" class="hc4-appointment-img">
      </div>
    </div>
  </section>

  <!-- Blog -->
  <section class="hc4-blog">
    <div class="hc4-container">
      <div style="text-align: center;">
        <span class="hc4-section-badge">NEWS & UPDATES</span>
        <h2 class="hc4-section-title">Latest Posts & Articles</h2>
      </div>
      <div class="hc4-blog-grid">
        <div class="hc4-blog-card">
          <div class="hc4-blog-img-wrapper">
            <img src="https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=600&q=80" alt="Blog 1" class="hc4-blog-img">
          </div>
          <div class="hc4-blog-content">
            <span class="hc4-blog-date">Oct 12, 2026</span>
            <h4>Advanced Technology in Modern Healthcare</h4>
            <p>Discover how new AI tools are transforming patient diagnostics and treatment plans globally.</p>
            <a href="javascript:void(0);" class="hc4-service-link">Read More <i class="fas fa-arrow-right"></i></a>
          </div>
        </div>
        <div class="hc4-blog-card">
          <div class="hc4-blog-img-wrapper">
            <img src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80" alt="Blog 2" class="hc4-blog-img">
          </div>
          <div class="hc4-blog-content">
            <span class="hc4-blog-date">Oct 05, 2026</span>
            <h4>Top 10 Tips for Heart Health and Wellness</h4>
            <p>Learn simple everyday habits that can significantly reduce your risk of cardiovascular diseases.</p>
            <a href="javascript:void(0);" class="hc4-service-link">Read More <i class="fas fa-arrow-right"></i></a>
          </div>
        </div>
        <div class="hc4-blog-card">
          <div class="hc4-blog-img-wrapper">
            <img src="https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=600&q=80" alt="Blog 3" class="hc4-blog-img">
          </div>
          <div class="hc4-blog-content">
            <span class="hc4-blog-date">Sep 28, 2026</span>
            <h4>Understanding Pediatric Nutrition Guidelines</h4>
            <p>A comprehensive guide for parents to ensure their children get the right balance of vitamins.</p>
            <a href="javascript:void(0);" class="hc4-service-link">Read More <i class="fas fa-arrow-right"></i></a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Subscribe Section -->
  <section class="hc4-subscribe">
    <div class="hc4-container">
      <div class="hc4-subscribe-card">
        <div class="hc4-subscribe-text">
          <h2>Subscribe To Our Newsletter</h2>
          <p>Stay updated with our latest health tips, medical news, and special wellness offers delivered directly to your inbox.</p>
        </div>
        <form class="hc4-subscribe-form">
          <input type="email" class="hc4-subscribe-input" placeholder="Enter your email address" required>
          <button type="submit" class="hc4-subscribe-btn">Subscribe Now</button>
        </form>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="hc4-footer">
    <div class="hc4-container">
      <div class="hc4-footer-grid">
        <div>
          <div class="hc4-footer-logo">
            <span>LOGO_PLACEHOLDER</span>
          </div>
          <p>Providing reliable, world-class medical services for you and your family. We are committed to your long-term health and wellbeing.</p>
          <div class="hc4-footer-socials">
            <a href="javascript:void(0);" class="hc4-footer-social"><i class="fab fa-facebook-f"></i></a>
            <a href="javascript:void(0);" class="hc4-footer-social"><i class="fab fa-twitter"></i></a>
            <a href="javascript:void(0);" class="hc4-footer-social"><i class="fab fa-instagram"></i></a>
            <a href="javascript:void(0);" class="hc4-footer-social"><i class="fab fa-linkedin-in"></i></a>
          </div>
        </div>
        
        <div>
          <h5>Quick Links</h5>
          <ul class="hc4-footer-links">
            <li><a href="javascript:void(0);">About Us</a></li>
            <li><a href="javascript:void(0);">Our Services</a></li>
            <li><a href="javascript:void(0);">Meet The Doctors</a></li>
            <li><a href="javascript:void(0);">Latest News</a></li>
            <li><a href="javascript:void(0);">Contact Us</a></li>
          </ul>
        </div>
        
        <div>
          <h5>Departments</h5>
          <ul class="hc4-footer-links">
            <li><a href="javascript:void(0);">Cardiology</a></li>
            <li><a href="javascript:void(0);">Neurology</a></li>
            <li><a href="javascript:void(0);">Dental Care</a></li>
            <li><a href="javascript:void(0);">Orthopedics</a></li>
            <li><a href="javascript:void(0);">Eye Care</a></li>
          </ul>
        </div>
        
        <div>
          <h5>Contact Info</h5>
          <ul class="hc4-footer-contact-list">
            <li>
              <i class="fas fa-map-marker-alt"></i>
              <span>123 Medical Drive, Health City, HC 10020</span>
            </li>
            <li>
              <i class="fas fa-phone-alt"></i>
              <span>PHONE_PLACEHOLDER</span>
            </li>
            <li>
              <i class="fas fa-envelope"></i>
              <span>CONTACT_PLACEHOLDER</span>
            </li>
          </ul>
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
            e.target.innerHTML = '<div class="tpl-templates04-3" style="padding: 20px; text-align: center"><h3 style="margin: 0 0 10px 0; ">Thank You!</h3><p style="margin: 0;">Your request has been submitted successfully.</p></div>';
          }, 1000);
        }
      }
    }, true);
  })();
</script>

`;
