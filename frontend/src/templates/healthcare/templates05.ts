// Auto-generated ULTRA-DYNAMIC template
// Generated: 2026-07-16T06:26:42.889Z
// ════════════════════════════════════════════════════════════════════════════
// Converted directly in the browser using Frontend JSZip Extraction
// ════════════════════════════════════════════════════════════════════════════

export const healthcare05Styles = `
:root {
  --primary: PRIMARY_COLOR_PLACEHOLDER;
  --secondary: SECONDARY_COLOR_PLACEHOLDER;
  --primary-rgb: PRIMARY_RGB_PLACEHOLDER;
  --secondary-rgb: SECONDARY_RGB_PLACEHOLDER;
  --bg-light: #fdfdfd;
  --text-dark: #1f1f1f;
  --text-muted: #64748b;
  --border-light: #f1f5f9;
  --spacing-section-padding: 80px;
  --spacing-gutter: 24px;
}

    body {
      font-family: 'Inter', sans-serif;
      color: #191c1d;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      margin: 0;
      padding: 0;
    }

    .material-symbols-outlined {
      font-family: 'Material Symbols Outlined' !important;
      font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
      line-height: 1;
    }

    /* Container Utility */
    .container {
      width: 100%;
      margin-left: auto;
      margin-right: auto;
    }
    @media (min-width: 640px) { .container { max-width: 640px; } }
    @media (min-width: 768px) { .container { max-width: 768px; } }
    @media (min-width: 1024px) { .container { max-width: 1024px; } }
    @media (min-width: 1280px) { .container { max-width: 1280px; } }
    @media (min-width: 1536px) { .container { max-width: 1536px; } }

    /* Top Info Bar */
    .top-info-bar {
      background-color: var(--primary);
      color: white;
      font-size: 0.75rem;
      padding: 0.5rem 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    @media (min-width: 768px) {
      .top-info-bar {
        padding-left: 2.5rem;
        padding-right: 2.5rem;
      }
    }
    .info-group {
      display: flex;
      gap: 1rem;
    }
    .social-group {
      display: flex;
      gap: 0.75rem;
    }
    .social-group a {
      color: white;
      text-decoration: none;
    }

    /* Main Header */
    .main-header {
      background-color: white;
      position: sticky;
      top: 0;
      z-index: 50;
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    }
    .header-content {
      padding: 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;box-sizing: border-box;
    }
    @media (min-width: 768px) {
      .header-content {
        padding-left: 2.5rem;
        padding-right: 2.5rem;
      }
    }
    .logo-wrapper {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .logo-box {
      background-color: var(--secondary);
      padding: 0.5rem;
    }
    .logo-text {
      font-weight: 700;
      color: var(--primary);
      font-size: 1.25rem;
      text-transform: uppercase;
    }
    .main-nav {
      display: none;
      gap: 2rem;
      font-weight: 600;
      color: var(--primary);
      text-transform: uppercase;
      font-size: 0.875rem;
    }
    @media (min-width: 768px) {
      .main-nav { display: flex; }
    }
    .main-nav a {
      text-decoration: none;
      color: inherit;
    }
    .main-nav a.active {
      color: var(--secondary);
    }
    .btn-get-started {
      background-color: var(--secondary);
      color: var(--primary);
      padding: 0.5rem 1.5rem;
      border-radius: 0.125rem;
      font-weight: 700;
      font-size: 0.875rem;
      border: none;
      cursor: pointer;
      transition: background-color 0.15s;
    }
    .btn-get-started:hover {
      background-color: var(--secondary);
    }

    /* Hero Section */
    .hero-section {
      background: linear-gradient(rgba(PRIMARY_RGB_PLACEHOLDER, 0.8), rgba(PRIMARY_RGB_PLACEHOLDER, 0.8));
      background-color: var(--primary);
      background-size: cover;
      color: white;
      padding: 5rem 1rem;
      overflow: hidden;
      position: relative;
    }
    @media (min-width: 768px) {
      .hero-section { padding-left: 2.5rem; padding-right: 2.5rem; }
    }
    .hero-grid {
      display: grid;
      gap: 2.5rem;
      align-items: center;
    }
    @media (min-width: 768px) {
      .hero-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    }
    .hero-content-box { z-index: 10; }
    .hero-tagline {
      color: var(--secondary);
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      font-size: 0.875rem;
    }
    .hero-title {
      font-size: 2.25rem;
      line-height: 1.25;
      font-family: 'Montserrat', sans-serif;
      font-weight: 800;
      margin-top: 1rem;
      margin-bottom: 1.5rem;
    }
    @media (min-width: 768px) {
      .hero-title { font-size: 3.75rem; }
    }
    .hero-desc {
      color: #d1d5db;
      margin-bottom: 2.5rem;
      max-width: 32rem;
      line-height: 1.5;
    }
    .hero-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
    }
    .btn-book {
      background-color: var(--secondary);
      color: var(--primary);
      padding: 1rem 2rem;
      font-weight: 700;
      border-radius: 0.125rem;
      border: none;
      cursor: pointer;
      transition: background-color 0.15s;
    }
    .btn-book:hover {
      background-color: var(--secondary);
    }
    .btn-watch {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      border: 2px solid white;
      background: transparent;
      color: white;
      padding: 1rem 2rem;
      font-weight: 700;
      border-radius: 0.125rem;
      cursor: pointer;
      transition: all 0.15s;
    }
    .btn-watch:hover {
      background-color: white;
      color: var(--primary);
    }
    .play-icon-wrapper {
      width: 2rem;
      height: 2rem;
      border: 2px solid var(--secondary);
      border-radius: 9999px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      color: var(--secondary);
      transition: all 0.15s;
    }
    .btn-watch:hover .play-icon-wrapper {
      background-color: var(--secondary);
      color: var(--primary);
    }
    .play-icon-wrapper svg { width: 1rem; height: 1rem; }
    .hero-image-box { position: relative; }
    .hero-img {
      display: block;
      margin-left: auto;
      margin-right: auto;
      border-radius: 0.5rem;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      max-width: 100%;
      height: auto;
    }

    /* Feature Cards */
    .features-wrapper {
      padding-left: 1rem;
      padding-right: 1rem;
      margin-top: -4rem;
      position: relative;
      z-index: 20;box-sizing: border-box;
    }
    @media (min-width: 768px) {
      .features-wrapper { padding-left: 2.5rem; padding-right: 2.5rem; }
    }
    .features-grid {
      display: grid;
      gap: 1.5rem;
    }
    @media (min-width: 768px) {
      .features-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
    }
    .feature-card {
      background-color: white;
      padding: 2rem;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      border-bottom: 4px solid var(--secondary);
      display: flex;
      gap: 1.25rem;
    }
    .feature-icon-box {
      color: var(--secondary);
      flex-shrink: 0;
    }
    .feature-icon-box svg { width: 2.5rem; height: 2.5rem; }
    .feature-content h3 {
      font-weight: 700;
      font-size: 1.125rem;
      margin-top: 0;
      margin-bottom: 0.5rem;
    }
    .feature-content p {
      color: #6b7280;
      font-size: 0.875rem;
      margin: 0;
    }

    /* About Us Section */
    .about-section {
      padding-top: 6rem;
      padding-bottom: 6rem;
      padding-left: 1rem;
      padding-right: 1rem;box-sizing: border-box;
    }
    @media (min-width: 768px) {
      .about-section { padding-left: 2.5rem; padding-right: 2.5rem; }
    }
    .about-grid {
      display: grid;
      gap: 4rem;
      align-items: center;
    }
    @media (min-width: 768px) {
      .about-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    }
    .about-image-wrapper { position: relative; }
    .about-img {
      border-radius: 0.5rem;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      max-width: 100%;
      height: auto;
      display: block;
    }
    .about-floating-box {
      position: absolute;
      bottom: 1.5rem;
      left: 1.5rem;
      background-color: var(--primary);
      color: white;
      padding: 1.5rem;
      border-radius: 0.125rem;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    }
    .about-floating-title {
      color: var(--secondary);
      font-weight: 700;
      font-size: 1.5rem;
      margin: 0;
    }
    .about-floating-subtitle {
      font-size: 0.875rem;
      margin: 0;
    }
    .about-floating-desc {
      font-size: 0.75rem;
      color: #9ca3af;
      margin-top: 0.25rem;
      margin-bottom: 0;
      font-style: italic;
    }
    .section-tagline {
      color: var(--secondary);
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      font-size: 0.875rem;
    }
    .section-title {
      font-size: 2.25rem;
      font-family: 'Montserrat', sans-serif;
      font-weight: 800;
      color: var(--primary);
      margin-top: 1rem;
      margin-bottom: 1.5rem;
      line-height: 1.25;
    }
    .about-desc {
      color: #4b5563;
      margin-bottom: 2.5rem;
      line-height: 1.625;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 2rem;
      margin-bottom: 2.5rem;
    }
    .stat-value {
      font-size: 1.875rem;
      font-weight: 800;
      color: var(--secondary);
      margin: 0;
    }
    .stat-label {
      color: #6b7280;
      font-size: 0.875rem;
      margin: 0;
    }
    .btn-more {
      background-color: var(--secondary);
      color: white;
      padding: 0.75rem 2rem;
      border-radius: 0.125rem;
      font-weight: 700;
      font-size: 0.875rem;
      border: none;
      cursor: pointer;
      transition: opacity 0.15s;
    }
    .btn-more:hover { opacity: 0.9; }

    /* Services Section */
    .services-section {
      background-color: var(--bg-light);
      padding-top: 5rem;
      padding-bottom: 5rem;
      padding-left: 1rem;
      padding-right: 1rem;
    }
    @media (min-width: 768px) {
      .services-section { padding-left: 2.5rem; padding-right: 2.5rem; }
    }
    .services-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 3rem;
    }
    .services-header-title .section-title { margin-top: 0.5rem; margin-bottom: 0; }
    .btn-see-all {
      background-color: var(--secondary);
      color: white;
      padding: 0.5rem 1.5rem;
      border-radius: 0.125rem;
      font-size: 0.875rem;
      border: none;
      cursor: pointer;
    }
    .services-grid {
      display: grid;
      gap: 2rem;
    }
    @media (min-width: 768px) {
      .services-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    }
    @media (min-width: 1024px) {
      .services-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
    }
    .service-item {
      background-color: white;
      position: relative;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    .service-img {
      width: 100%;
      height: 12rem;
      object-fit: cover;
      display: block;
    }
    .service-info {
      padding: 1.5rem;
      text-align: center;
    }
    .service-icon {
      background-color: var(--secondary);
      color: white;
      width: 3rem;
      height: 3rem;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: auto;
      margin-right: auto;
      margin-top: -3rem;
      margin-bottom: 1rem;
      position: relative;
      z-index: 10;
    }
    .service-icon svg { width: 1.5rem; height: 1.5rem; }
    .service-info h3 {
      font-weight: 700;
      font-size: 1.125rem;
      margin-top: 0;
      margin-bottom: 0.5rem;
    }
    .service-info p {
      color: #6b7280;
      font-size: 0.875rem;
      margin-top: 0;
      margin-bottom: 1rem;
    }
    .service-link {
      color: var(--secondary);
      font-weight: 700;
      font-size: 0.875rem;
      text-decoration: none;
    }

    /* Booking Section */
    .booking-section {
      background: linear-gradient(rgba(SECONDARY_RGB_PLACEHOLDER, 0.9), rgba(0, 44, 87, 0.9));
      background-size: cover;
      padding-top: 6rem;
      padding-bottom: 6rem;
      color: white;
      padding-left: 1rem;
      padding-right: 1rem;
    }
    @media (min-width: 768px) {
      .booking-section { padding-left: 2.5rem; padding-right: 2.5rem; }
    }
    .booking-grid {
      display: grid;
      gap: 4rem;
    }
    @media (min-width: 768px) {
      .booking-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .booking-form-box { order: 2; }
    }
    .booking-form-box {
      background-color: white;
      padding: 2.5rem;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      border-radius: 0.125rem;
    }
    .booking-form-title {
      color: var(--primary);
      font-size: 1.5rem;
      font-family: 'Montserrat', sans-serif;
      font-weight: 700;
      margin-top: 0;
      margin-bottom: 0.5rem;
    }
    .booking-form-subtitle {
      color: #6b7280;
      font-size: 0.875rem;
      margin-top: 0;
      margin-bottom: 2rem;
    }
    .booking-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .form-row {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 1rem;
    }
    .form-input {
      width: 100%;
      border: 1px solid #e5e7eb;
      color: #1f2937;
      font-size: 0.875rem;
      padding: 0.5rem 0.75rem;
      box-sizing: border-box;
      font-family: inherit;
    }
    .form-input:focus {
      outline: none;
      border-color: var(--secondary);
      box-shadow: 0 0 0 1px var(--secondary);
    }
    .btn-submit-booking {
      width: 100%;
      background-color: var(--secondary);
      color: var(--primary);
      font-weight: 800;
      padding: 1rem;
      text-transform: uppercase;
      border: none;
      cursor: pointer;
      transition: background-color 0.15s;
    }
    .btn-submit-booking:hover { background-color: var(--secondary); }
    .booking-info-tagline {
      color: var(--secondary);
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      font-size: 0.875rem;
    }
    .booking-info-title {
      font-size: 2.25rem;
      font-family: 'Montserrat', sans-serif;
      font-weight: 800;
      margin-top: 1rem;
      margin-bottom: 2rem;
      line-height: 1.25;
    }
    .booking-info-desc {
      color: #d1d5db;
      margin-bottom: 3rem;
      line-height: 1.5;
    }
    .booking-help-title {
      font-size: 1.125rem;
      font-weight: 700;
      margin-bottom: 1.5rem;
      margin-top: 0;
    }
    .contact-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .contact-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      background-color: rgba(255, 255, 255, 0.1);
      padding: 1rem;
      border-left: 4px solid var(--secondary);
    }
    .contact-card-icon {
      background-color: var(--secondary);
      padding: 0.75rem;
      color: var(--primary);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .contact-card-icon svg { width: 1.25rem; height: 1.25rem; }
    .contact-card-label {
      font-size: 0.75rem;
      color: #9ca3af;
      margin: 0 0 0.25rem 0;
    }
    .contact-card-value {
      font-weight: 700;
      margin: 0;
    }

    /* Testimonials Section */
    .testimonials-section {
      padding-top: 6rem;
      padding-bottom: 6rem;
      background-color: var(--bg-light);
      padding-left: 1rem;
      padding-right: 1rem;
    }
    @media (min-width: 768px) {
      .testimonials-section { padding-left: 2.5rem; padding-right: 2.5rem; }
    }
    .testimonials-header { text-align: center; }
    .testimonials-header .section-title { margin-bottom: 4rem; }
    .testimonials-grid {
      display: grid;
      gap: 2rem;
    }
    @media (min-width: 768px) {
      .testimonials-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
    }
    .testimonial-card {
      background-color: white;
      padding: 2.5rem;
      position: relative;
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
      border-bottom: 4px solid var(--secondary);
    }
    .quote-mark {
      color: var(--secondary);
      font-size: 1.875rem;
      margin-bottom: 1rem;
      text-align: left;
      line-height: 1;
    }
    .testimonial-text {
      color: #4b5563;
      font-size: 0.875rem;
      text-align: left;
      line-height: 1.625;
      margin-top: 0;
      margin-bottom: 2rem;
    }
    .client-profile {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .client-img {
      width: 4rem;
      height: 4rem;
      border-radius: 9999px;
      object-fit: cover;
    }
    .client-info { text-align: left; }
    .client-name {
      font-weight: 700;
      color: var(--primary);
      margin: 0 0 0.25rem 0;
    }
    .client-role {
      font-size: 0.75rem;
      color: var(--secondary);
      text-transform: uppercase;
      margin: 0;
    }
    .testimonial-stars {
      position: absolute;
      top: 2.5rem;
      right: 2.5rem;
      color: var(--primary);
      font-weight: 700;
      font-size: 0.75rem;
      opacity: 0.2;
    }

    /* CTA Section */
    .cta-section {
      padding-top: 4rem;
      padding-bottom: 4rem;
      background-color: var(--primary);
      position: relative;
      overflow: hidden;
    }
    .cta-container {
      text-align: center;
      position: relative;
      z-index: 10;
      padding-left: 1rem;
      padding-right: 1rem;
    }
    .cta-tagline {
      color: var(--secondary);
      font-weight: 700;
      text-transform: uppercase;
      font-size: 0.75rem;
      letter-spacing: 0.1em;
    }
    .cta-title {
      font-size: 1.875rem;
      font-family: 'Montserrat', sans-serif;
      font-weight: 800;
      color: white;
      margin-top: 1rem;
      margin-bottom: 2rem;
      line-height: 1.25;
    }
    .btn-cta {
      background-color: var(--secondary);
      color: var(--primary);
      font-weight: 700;
      padding: 0.75rem 2.5rem;
      text-transform: uppercase;
      font-size: 0.875rem;
      border: none;
      cursor: pointer;
      transition: background-color 0.15s;
    }
    .btn-cta:hover { background-color: var(--secondary); }

    /* Footer */
    .site-footer {
      background-color: var(--secondary);
      color: #9ca3af;
      padding-top: 5rem;
      padding-bottom: 5rem;
      padding-left: 1rem;
      padding-right: 1rem;
    }
    @media (min-width: 768px) {
      .site-footer { padding-left: 2.5rem; padding-right: 2.5rem; }
    }
    .footer-grid {
      display: grid;
      gap: 3rem;
    }
    @media (min-width: 768px) {
      .footer-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
    }
    .footer-col-1 .logo-box {
      margin-bottom: 2rem;
      display: inline-block;
    }
    .footer-desc {
      font-size: 0.875rem;
      line-height: 1.625;
      margin-top: 0;
      margin-bottom: 2rem;
    }
    .footer-contact-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      font-size: 0.75rem;
    }
    .footer-contact-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin: 0;
    }
    .footer-contact-icon { color: var(--secondary); display: flex; align-items: center; }
    .footer-contact-icon svg { width: 0.875rem; height: 0.875rem; }
    .footer-heading {
      color: white;
      font-weight: 700;
      margin-bottom: 2rem;
      margin-top: 0;
      text-transform: uppercase;
      font-size: 0.875rem;
      letter-spacing: 0.1em;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      padding-bottom: 0.5rem;
    }
    .footer-links {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      font-size: 0.875rem;
    }
    .footer-links a {
      color: inherit;
      text-decoration: none;
      transition: color 0.15s;
    }
    .footer-links a:hover { color: white; }
    .footer-hours {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      font-size: 0.875rem;
    }
    .footer-hours li {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      padding-bottom: 0.5rem;
    }
    .footer-hours .highlight { color: var(--secondary); }
    .footer-bottom {
      margin-top: 5rem;
      padding-top: 2rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.75rem;
    }
    .footer-bottom p { margin: 0; }

    /* Modal Popup */
    .modal-overlay-container {
      position: fixed;
      inset: 0;
      z-index: 100;
      display: none;
      align-items: center;
      justify-content: center;
      padding: 1rem;
    }
    .modal-overlay-container.flex { display: flex; }
    .modal-backdrop {
      position: absolute;
      inset: 0;
      background-color: rgba(0, 10, 30, 0.7);
      backdrop-filter: blur(4px);
      cursor: pointer;
    }
    .modal-content-box {
      background-color: white;
      position: relative;
      width: 100%;
      max-width: 32rem;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      border-radius: 0.125rem;
      overflow: hidden;
      z-index: 101;
      transform: scale(1);
      transition: transform 0.2s;
    }
    .modal-header-box {
      background-color: var(--text-dark);
      padding: 1.5rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .modal-title-box h3 {
      color: white;
      font-family: 'Montserrat', sans-serif;
      font-weight: 700;
      font-size: 1.25rem;
      text-transform: uppercase;
      letter-spacing: 0.025em;
      margin: 0;
    }
    .modal-title-box p {
      color: var(--text-muted);
      font-size: 0.75rem;
      margin-top: 0.25rem;
      margin-bottom: 0;
    }
    .btn-close-modal {
      color: rgba(255, 255, 255, 0.7);
      background: transparent;
      border: none;
      cursor: pointer;
      transition: color 0.15s;
      padding: 0;
    }
    .btn-close-modal:hover { color: white; }
    .modal-form-box {
      padding: 2rem;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .modal-input-group {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .modal-label {
      display: block;
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--pipefix-dark);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 0.5rem;
    }
    .modal-input-field {
      width: 100%;
      background-color: var(--border-light);
      border: none;
      border-radius: 0.125rem;
      padding: 0.75rem 1rem;
      font-size: 0.875rem;
      box-sizing: border-box;
      font-family: inherit;
    }
    .modal-input-field::placeholder { color: #74777f; }
    .modal-input-field:focus {
      outline: none;
      box-shadow: 0 0 0 2px var(--secondary);
    }
    .modal-grid-row {
      display: grid;
      gap: 1rem;
    }
    @media (min-width: 768px) {
      .modal-grid-row { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    }
    .modal-submit-container { padding-top: 1rem; }
    .btn-submit-modal {
      width: 100%;
      background-color: var(--secondary);
      color: var(--text-dark);
      font-weight: 700;
      padding: 1rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      font-size: 0.875rem;
      border: none;
      cursor: pointer;
      transition: all 0.15s;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
    .btn-submit-modal:hover { background-color: var(--secondary-fixed-dim); }
    .modal-terms-text {
      font-size: 10px;
      color: #9ca3af;
      text-align: center;
      margin-top: 1rem;
      margin-bottom: 0;
    }
    body.modal-open { overflow: hidden; }

    /* Utilities */
    .hidden { display: none !important; }
`;

export const healthcare05Html = `
<link
    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Montserrat:wght@600;700;800&display=swap"
    rel="stylesheet" />
<link
    href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
    rel="stylesheet" />
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

<!-- BEGIN: Top Info Bar -->
  <div class="top-info-bar">
    <div class="info-group">
      <span data-editable="true">Location: Thornridge Cir. Syracuse, Connecticut 35624</span>
      <span data-editable="true">Email: info.stratedge@gmail.com</span>
    </div>
  </div>
  <!-- END: Top Info Bar -->

  <!-- BEGIN: MainHeader -->
  <header class="main-header">
    <div class="container header-content">
      <a class="logo logo-wrapper" href="javascript:void(0);">
        LOGO_PLACEHOLDER
      </a>
      <button data-editable="true" class="btn-get-started" id="open-modal-nav">GET STARTED</button>
    </div>
  </header>
  <!-- END: MainHeader -->

  <!-- BEGIN: Hero Section -->
  <section class="hero-section">
    <div class="container hero-grid">
      <div class="hero-content-box">
        <span data-editable="true" class="hero-tagline">Expert Business Consulting</span>
        <h1 data-editable="true" class="hero-title">
          Strategic Solutions for Your Business Growth, Anytime &amp; Anywhere
        </h1>
        <p data-editable="true" class="hero-desc">
          We provide expert consulting services to help your business scale, innovate, and lead in today's competitive market.
        </p>
        <div class="hero-actions">
          <button data-editable="true" class="btn-book" id="open-modal-hero">BOOK CONSULTATION</button>
          <button data-editable="true" class="btn-watch">
            <span data-editable="true" class="play-icon-wrapper">
              <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 3l14 9-14 9V3z" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
            </span>
            WATCH OVERVIEW
          </button>
        </div>
      </div>
      <div class="hero-image-box">
        <img data-editable-img="true" alt="Strategic Consultant" class="hero-img" src="/assets/templates/healthcare/templates05/hero-image.png" />
      </div>
    </div>
  </section>
  <!-- END: Hero Section -->

  <!-- BEGIN: Feature Cards -->
  <section class="container features-wrapper">
    <div class="features-grid">
      <div class="feature-card">
        <div class="feature-icon-box">
          <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 17h2v4H3v-4zm5-6h2v10H8V11zm5-5h2v15h-2V6zm5-4h2v19h-2V2z" stroke-linecap="round" stroke-linejoin="round"></path>
          </svg>
        </div>
        <div class="feature-content">
          <h3 data-editable="true">Top-Tier Consultants Since 2004</h3>
          <p data-editable="true">Curabitur pretium phasellus varius. Mauris donec ultrices elementum feugiat enim phasellus.</p>
        </div>
      </div>
      <div class="feature-card">
        <div class="feature-icon-box">
          <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 14l9-5-9-5-9 5 9 5zm0 0v6m-5-3.1L12 20l5-3.1M6 10.7V17a5 5 0 005 5h2a5 5 0 005-5v-6.3" stroke-linecap="round" stroke-linejoin="round"></path>
          </svg>
        </div>
        <div class="feature-content">
          <h3 data-editable="true">Certified Business Professionals</h3>
          <p data-editable="true">Curabitur pretium phasellus varius. Mauris donec ultrices elementum feugiat enim phasellus.</p>
        </div>
      </div>
      <div class="feature-card">
        <div class="feature-icon-box">
          <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 12l5-5 5 5M7 17l5-5 5 5" stroke-linecap="round" stroke-linejoin="round"></path>
            <path d="M3 3v18h18" stroke-linecap="round" stroke-linejoin="round"></path>
          </svg>
        </div>
        <div class="feature-content">
          <h3 data-editable="true">Proven Results &amp; ROI</h3>
          <p data-editable="true">Curabitur pretium phasellus varius. Mauris donec ultrices elementum feugiat enim phasellus.</p>
        </div>
      </div>
    </div>
  </section>
  <!-- END: Feature Cards -->

  <!-- BEGIN: About Us -->
  <section class="about-section container">
    <div class="about-grid">
      <div class="about-image-wrapper">
        <img data-editable-img="true" alt="Strategy Meeting" class="about-img" src="/assets/templates/healthcare/templates05/office.png" />
        <div class="about-floating-box">
          <p data-editable="true" class="about-floating-title">24/7</p>
          <p data-editable="true" class="about-floating-subtitle">Strategic Support</p>
          <p data-editable="true" class="about-floating-desc">Mauris nec est rhoncus felis.</p>
        </div>
      </div>
      <div>
        <span data-editable="true" class="section-tagline">ABOUT STRATEDGE</span>
        <h2 data-editable="true" class="section-title">Years Of Experience, Thousands Of Happy Clients</h2>
        <p data-editable="true" class="about-desc">
          Nullam dictum convallis metus eros id eget pellentesque. Semper rhoncus varius vitae ultrices elementum feugiat enim libero pellentesque. Lorem ipsum dolor sit amet consectetur.
        </p>
        <div class="stats-grid">
          <div>
            <p data-editable="true" class="stat-value">4.9K</p>
            <p data-editable="true" class="stat-label">Client Ratings</p>
          </div>
          <div>
            <p data-editable="true" class="stat-value">30K</p>
            <p data-editable="true" class="stat-label">Projects Done</p>
          </div>
          <div>
            <p data-editable="true" class="stat-value">98%</p>
            <p data-editable="true" class="stat-label">Problem Solved</p>
          </div>
          <div>
            <p data-editable="true" class="stat-value">80%</p>
            <p data-editable="true" class="stat-label">Customer Returns</p>
          </div>
        </div>
        <button data-editable="true" class="btn-more">MORE ABOUT US</button>
      </div>
    </div>
  </section>
  <!-- END: About Us -->

  <!-- BEGIN: Services Grid -->
  <section class="services-section">
    <div class="container">
      <div class="services-header">
        <div class="services-header-title">
          <span data-editable="true" class="section-tagline">SERVICES WE OFFER</span>
          <h2 data-editable="true" class="section-title">Complete Consulting Services<br />for Every Need</h2>
        </div>
      </div>
      <div class="services-grid">
        <!-- Service Card 1 -->
        <div class="service-item">
          <img data-editable-img="true" alt="Strategy &amp; Operations" class="service-img" src="/assets/templates/healthcare/templates05/service-01.png" />
          <div class="service-info">
            <div class="service-icon">
              <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m-1 4h1m5-11h1m-1 4h1m-1 4h1" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
            </div>
            <h3 data-editable="true">Strategy &amp; Operations</h3>
            <p data-editable="true">Dui id volutpat feugiat sit nam et morbi nullam.</p>
            <a data-editable="true" class="service-link" href="javascript:void(0);">Read More →</a>
          </div>
        </div>
        <!-- Service Card 2 -->
        <div class="service-item">
          <img data-editable-img="true" alt="Digital Transformation" class="service-img" src="/assets/templates/healthcare/templates05/service-02.png" />
          <div class="service-info">
            <div class="service-icon">
              <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
            </div>
            <h3 data-editable="true">Digital Transformation</h3>
            <p data-editable="true">Dui id volutpat feugiat sit nam et morbi nullam.</p>
            <a data-editable="true" class="service-link" href="javascript:void(0);">Read More →</a>
          </div>
        </div>
        <!-- Service Card 3 -->
        <div class="service-item">
          <img data-editable-img="true" alt="Financial Advisory" class="service-img" src="/assets/templates/healthcare/templates05/service-03.png" />
          <div class="service-info">
            <div class="service-icon">
              <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.407 2.67 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.407-2.67-1M12 16V5" stroke-linecap="round" stroke-linejoin="round"></path>
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
            </div>
            <h3 data-editable="true">Financial Advisory</h3>
            <p data-editable="true">Dui id volutpat feugiat sit nam et morbi nullam.</p>
            <a data-editable="true" class="service-link" href="javascript:void(0);">Read More →</a>
          </div>
        </div>
        <!-- Service Card 4 -->
        <div class="service-item">
          <img data-editable-img="true" alt="Risk Management" class="service-img" src="/assets/templates/healthcare/templates05/service-04.png" />
          <div class="service-info">
            <div class="service-icon">
              <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
            </div>
            <h3 data-editable="true">Risk Management</h3>
            <p data-editable="true">Dui id volutpat feugiat sit nam et morbi nullam.</p>
            <a data-editable="true" class="service-link" href="javascript:void(0);">Read More →</a>
          </div>
        </div>
        <!-- Service Card 5 -->
        <div class="service-item">
          <img data-editable-img="true" alt="Human Capital" class="service-img" src="/assets/templates/healthcare/templates05/service-05.png" />
          <div class="service-info">
            <div class="service-icon">
              <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
            </div>
            <h3 data-editable="true">Human Capital</h3>
            <p data-editable="true">Dui id volutpat feugiat sit nam et morbi nullam.</p>
            <a data-editable="true" class="service-link" href="javascript:void(0);">Read More →</a>
          </div>
        </div>
        <!-- Service Card 6 -->
        <div class="service-item">
          <img data-editable-img="true" alt="Market Research" class="service-img" src="/assets/templates/healthcare/templates05/service-06.png" />
          <div class="service-info">
            <div class="service-icon">
              <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
            </div>
            <h3 data-editable="true">Market Research</h3>
            <p data-editable="true">Dui id volutpat feugiat sit nam et morbi nullam.</p>
            <a data-editable="true" class="service-link" href="javascript:void(0);">Read More →</a>
          </div>
        </div>
        <!-- Service Card 7 -->
        <div class="service-item">
          <img data-editable-img="true" alt="IT Consulting" class="service-img" src="/assets/templates/healthcare/templates05/service-01.png" />
          <div class="service-info">
            <div class="service-icon">
              <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
            </div>
            <h3 data-editable="true">IT Consulting</h3>
            <p data-editable="true">Dui id volutpat feugiat sit nam et morbi nullam.</p>
            <a data-editable="true" class="service-link" href="javascript:void(0);">Read More →</a>
          </div>
        </div>
        <!-- Service Card 8 -->
        <div class="service-item">
          <img data-editable-img="true" alt="Brand Strategy" class="service-img" src="/assets/templates/healthcare/templates05/service-02.png" />
          <div class="service-info">
            <div class="service-icon">
              <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.407 2.67 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.407-2.67-1M12 16V5" stroke-linecap="round" stroke-linejoin="round"></path>
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
            </div>
            <h3 data-editable="true">Brand Strategy</h3>
            <p data-editable="true">Dui id volutpat feugiat sit nam et morbi nullam.</p>
            <a data-editable="true" class="service-link" href="javascript:void(0);">Read More →</a>
          </div>
        </div>
      </div>
    </div>
  </section>
  <!-- END: Services Grid -->

  <!-- BEGIN: Booking Section -->
  <section class="booking-section">
    <div class="container booking-grid">
      <div class="booking-form-box">
        <h3 data-editable="true" class="booking-form-title">Book Consultation</h3>
        <p data-editable="true" class="booking-form-subtitle">Schedule a session with our strategic experts today.</p>
        <form class="booking-form">
          <div class="form-row">
            <input class="form-input" placeholder="Full Name" type="text" name="name" id="name" />
            <input class="form-input" placeholder="Email Address" type="email" name="email" id="email" />
          </div>
          <input class="form-input" placeholder="Phone Number" type="text" name="phone" id="phone" style="margin-bottom: 1rem;" />
          <textarea class="form-input" placeholder="Message" rows="4" name="message" id="message"></textarea>
          <button data-editable="true" class="btn-submit-booking">SEND REQUEST</button>
        </form>
      </div>
      <div>
        <span data-editable="true" class="booking-info-tagline">STRATEGY SESSIONS</span>
        <h2 data-editable="true" class="booking-info-title">Book a Strategic Audit. Determine The Plan That Works Best For You</h2>
        <p data-editable="true" class="booking-info-desc">
          Phase tellus nec eros in ornare. Velit et id dignissim phasellus vel nec rhoncus felis. Id sit amet vulputate.
        </p>
        <h4 data-editable="true" class="booking-help-title">Need Immediate Help?</h4>
        <div class="contact-list">
          <div class="contact-card">
            <div class="contact-card-icon">
              <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
            </div>
            <div>
              <p data-editable="true" class="contact-card-label">Client Support</p>
              <p data-editable="true" class="contact-card-value">+088 6758 8454 05</p>
            </div>
          </div>
          <div class="contact-card">
            <div class="contact-card-icon">
              <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
            </div>
            <div>
              <p data-editable="true" class="contact-card-label">Email Us</p>
              <p data-editable="true" class="contact-card-value">info.stratedge@gmail.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <!-- END: Booking Section -->

  <!-- BEGIN: Testimonials -->
  <section class="testimonials-section">
    <div class="container testimonials-header">
      <span data-editable="true" class="section-tagline">TESTIMONIALS</span>
      <h2 data-editable="true" class="section-title">What Our Clients Say</h2>
      <div class="testimonials-grid">
        <!-- Testimonial 1 -->
        <div class="testimonial-card">
          <div class="quote-mark">“</div>
          <p data-editable="true" class="testimonial-text">
            The strategic insights provided by STRATEDGE transformed our operations. Their experts truly understand market dynamics.
          </p>
          <div class="client-profile">
            <img data-editable-img="true" alt="Sarah Jenkins" class="client-img" src="/assets/templates/healthcare/templates05/client-01.png" />
            <div class="client-info">
              <p data-editable="true" class="client-name">Sarah Jenkins</p>
              <p data-editable="true" class="client-role">CEO</p>
            </div>
          </div>
          <div class="testimonial-stars">⭐⭐⭐⭐⭐</div>
        </div>
        <!-- Testimonial 2 -->
        <div class="testimonial-card">
          <div class="quote-mark">“</div>
          <p data-editable="true" class="testimonial-text">
            Professionalism and results are at the core of their service. We saw a significant ROI within the first six months.
          </p>
          <div class="client-profile">
            <img data-editable-img="true" alt="Robert Chen" class="client-img" src="/assets/templates/healthcare/templates05/client-02.png" />
            <div class="client-info">
              <p data-editable="true" class="client-name">Robert Chen</p>
              <p data-editable="true" class="client-role">Director</p>
            </div>
          </div>
          <div class="testimonial-stars">⭐⭐⭐⭐⭐</div>
        </div>
        <!-- Testimonial 3 -->
        <div class="testimonial-card">
          <div class="quote-mark">“</div>
          <p data-editable="true" class="testimonial-text">
            Navigating digital transformation was seamless with STRATEDGE. They are hands down the best in the industry.
          </p>
          <div class="client-profile">
            <img data-editable-img="true" alt="Elena Rodriguez" class="client-img" src="/assets/templates/healthcare/templates05/client-03.png" />
            <div class="client-info">
              <p data-editable="true" class="client-name">Elena Rodriguez</p>
              <p data-editable="true" class="client-role">Founder</p>
            </div>
          </div>
          <div class="testimonial-stars">⭐⭐⭐⭐⭐</div>
        </div>
      </div>
    </div>
  </section>
  <!-- END: Testimonials -->

  <!-- BEGIN: CTA Section -->
  <section class="cta-section">
    <div class="container cta-container">
      <span data-editable="true" class="cta-tagline">GET STARTED</span>
      <h2 data-editable="true" class="cta-title">Facing Business Challenges?<br />Consult Now For FREE!</h2>
      <button data-editable="true" class="btn-cta" id="open-modal-cta">FREE CONSULTATION</button>
    </div>
  </section>
  <!-- END: CTA Section -->

  <!-- BEGIN: Footer -->
  <footer class="site-footer">
    <div class="container footer-grid">
      <div class="footer-col-1">
        <a class="logo logo-wrapper" href="javascript:void(0);" style="margin-bottom: 2rem; display: inline-block;">
          LOGO_PLACEHOLDER
        </a>
        <p data-editable="true" class="footer-desc">
          Leading the way in strategic business consulting. We help enterprises thrive in an ever-changing global market.
        </p>
        <div class="footer-contact-list">
          <div class="footer-contact-item">
            <span data-editable="true" class="footer-contact-icon">
              <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
            </span> +088 1234 567 89
          </div>
          <div class="footer-contact-item">
            <span data-editable="true" class="footer-contact-icon">
              <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
            </span> info@stratedge.com
          </div>
          <div class="footer-contact-item">
            <span data-editable="true" class="footer-contact-icon">
              <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" stroke-linecap="round" stroke-linejoin="round"></path>
                <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
            </span> Thornridge Cir. Syracuse, Connecticut
          </div>
        </div>
      </div>
    </div>
    <div class="container footer-bottom">
      <p data-editable="true">Copyright © 2026 PROJECT_NAME_PLACEHOLDER. All Rights Reserved.</p>
    </div>
  </footer>
  <!-- END: Footer -->

  <!-- BEGIN: Modal Popup -->
  <div class="modal-overlay-container" id="contact-modal">
    <!-- Overlay -->
    <div class="modal-backdrop" id="modal-overlay"></div>
    <!-- Modal Content -->
    <div class="modal-content-box">
      <!-- Header -->
      <div class="modal-header-box">
        <div class="modal-title-box">
          <h3 data-editable="true">Get Started</h3>
          <p data-editable="true">Fill out the form below and we'll be in touch.</p>
        </div>
        <button data-editable="true" class="btn-close-modal" id="close-modal">
          <span data-editable="true" class="material-symbols-outlined text-2xl" style="font-size: 1.5rem;">close</span>
        </button>
      </div>
      <!-- Form -->
      <form class="modal-form-box">
        <div class="modal-input-group">
          <div>
            <label class="modal-label" for="fullname">Full Name</label>
            <input class="modal-input-field" id="fullname" placeholder="Enter your full name" type="text" name="name" id="name" />
          </div>
          <div class="modal-grid-row">
            <div>
              <label class="modal-label" for="email">Work Email</label>
              <input class="modal-input-field" id="email" placeholder="email@company.com" type="email" name="email_address" id="email_address" />
            </div>
            <div>
              <label class="modal-label" for="company">Company Name</label>
              <input class="modal-input-field" id="company" placeholder="Your Organization" type="text" name="company_name" id="company_name" />
            </div>
          </div>
          <div>
            <label class="modal-label" for="message">How can we help?</label>
            <textarea class="modal-input-field" id="message" placeholder="Tell us about your project or inquiry..." rows="4" name="message" id="message"></textarea>
          </div>
        </div>
        <div class="modal-submit-container">
          <button data-editable="true" class="btn-submit-modal" type="submit">
            Submit Request
          </button>
          <p data-editable="true" class="modal-terms-text">By submitting, you agree to our privacy policy and terms of service.</p>
        </div>
      </form>
    </div>
  </div>
  <!-- END: Modal Popup -->

<script>
// Modal Logic
    const modal = document.getElementById('contact-modal');
    const overlay = document.getElementById('modal-overlay');
    const closeBtn = document.getElementById('close-modal');

    const triggers = [
      document.getElementById('open-modal-nav'),
      document.getElementById('open-modal-hero'),
      document.getElementById('open-modal-cta')
    ];

    function openModal() {
      modal.classList.add('flex');
      document.body.classList.add('modal-open');
    }

    function closeModal() {
      modal.classList.remove('flex');
      document.body.classList.remove('modal-open');
    }

    triggers.forEach(trigger => {
      if (trigger) {
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          openModal();
        });
      }
    });

    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);

    // Close on ESC key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('flex')) {
        closeModal();
      }
    });

    // Handle Form Submission (Prevent Default)
    const modalForm = modal.querySelector('form');
    modalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Thank you! Your request has been submitted.');
      closeModal();
    });

</script>

<script id="core-interactions">
  (function() {
    var isInEditor = !!document.querySelector('[data-gjs-type]') || document.body.classList.contains('gjs-dashed');
    document.addEventListener('submit', function(e) {
      if (e.target.tagName === 'FORM') {
        e.target.setAttribute('novalidate', 'true');
        var isValid = true;
        var inputs = e.target.querySelectorAll('input:not([type="submit"]):not([type="hidden"]):not([type="button"]), textarea, select');
        inputs.forEach(function(input) {
          if (!input.value.trim() && input.hasAttribute('required')) isValid = false;
        });
        if (!isValid || isInEditor) {
          e.preventDefault();
          e.stopImmediatePropagation();
        }
      }
    }, true);
  })();
</script>
`;