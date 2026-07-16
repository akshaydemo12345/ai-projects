// Auto-generated ULTRA-DYNAMIC template
// Generated: 2026-07-16T05:21:21.383Z
// ════════════════════════════════════════════════════════════════════════════
// Converted directly in the browser using Frontend JSZip Extraction
// ════════════════════════════════════════════════════════════════════════════

export const plumber02Styles = `
/* CSS Variables based on original palette */
    :root {
      --primary: PRIMARY_COLOR_PLACEHOLDER;
      --secondary: SECONDARY_COLOR_PLACEHOLDER;
      --primary-rgb: PRIMARY_RGB_PLACEHOLDER;
      --secondary-rgb: SECONDARY_RGB_PLACEHOLDER;
      --bg-light: #fdfdfd;
      --text-dark: #1f1f1f;
      --text-muted: #64748b;
      --border-light: #f1f5f9;
      /* Typography */
      --font-display: 'Manrope', sans-serif;
      --font-body: 'Inter', sans-serif;
      /* Spacing */
      --section-padding: 96px;
    }

    /* Reset */
    *,
    *::before,
    *::after {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }

    html {
        scroll-behavior: smooth;
    }

    body {
        background-color: var(--bg-light);
        color: var(--text-dark);
        font-family: var(--font-body);
        font-size: 16px;
        line-height: 1.6;
        -webkit-font-smoothing: antialiased;
        overflow-x: hidden;
    }

    /* Common Typography */
    .font-display {
        font-family: var(--font-display);
    }

    .text-h1 {
        font-family: var(--font-display);
        font-size: 40px;
        line-height: 1.2;
        font-weight: 700;
        letter-spacing: -0.01em;
        color: var(--text-dark);
    }

    .text-h2 {
        font-family: var(--font-display);
        font-size: 32px;
        line-height: 1.3;
        font-weight: 700;
        color: var(--text-dark);
    }

    .text-h3 {
        font-family: var(--font-display);
        font-size: 24px;
        line-height: 1.4;
        font-weight: 600;
        color: var(--text-dark);
    }

    .text-display {
        font-family: var(--font-display);
        font-size: 56px;
        line-height: 1.1;
        font-weight: 800;
        letter-spacing: -0.02em;
    }

    .text-body-lg {
        font-size: 18px;
    }

    .text-white {
        color: #ffffff !important;
    }

    .text-secondary {
        color: var(--secondary) !important;
    }

    .text-primary-container {
        color: var(--primary) !important;
    }

    .mb-2 {
        margin-bottom: 8px;
    }

    .mb-4 {
        margin-bottom: 16px;
    }

    .mb-6 {
        margin-bottom: 24px;
    }

    .mb-8 {
        margin-bottom: 32px;
    }

    .material-symbols-outlined {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        font-family: 'Material Symbols Outlined' !important;
    }

    .material-symbols-outlined.filled {
        font-variation-settings: 'FILL' 1;
    }

    /* Layout & Utilities */
    .container {
        max-width: 1280px;
        margin-left: auto;
        margin-right: auto;
        padding-left: 24px;
        padding-right: 24px;
        width: 100%;
    }

    img {
        max-width: 100%;
        height: auto;
        display: block;
    }

    button,
    input,
    select {
        font-family: inherit;
    }

    button {
        cursor: pointer;
        border: none;
        background: none;
    }

    a {
        text-decoration: none;
        color: inherit;
    }

    /* Buttons */
    .btn-primary {
        background-color: var(--primary);
        color: #fff;
        padding: 10px 24px;
        border-radius: 8px;
        font-family: var(--font-display);
        font-size: 14px;
        font-weight: 700;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        transition: filter 0.2s, transform 0.1s;
    }

    .btn-primary:hover {
        filter: brightness(1.1);
    }

    .btn-primary:active {
        transform: scale(0.95);
    }

    .btn-primary-large {
        padding: 16px 32px;
        font-size: 24px;
        border-radius: 8px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
    }

    .btn-outline {
        border: 2px solid rgba(255, 255, 255, 0.3);
        color: #fff;
        padding: 16px 32px;
        border-radius: 8px;
        font-family: var(--font-display);
        font-size: 24px;
        font-weight: 600;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        transition: background-color 0.2s;
    }

    .btn-outline:hover {
        background-color: rgba(255, 255, 255, 0.1);
    }

    /* Top AppBar */
    .header {
        background-color: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(12px);
        position: sticky;
        top: 0;
        z-index: 50;
        border-bottom: 1px solid #f1f5f9;
        box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    }

    .header-inner {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 16px;
        padding-bottom: 16px;
    }

    .logo {
        font-family: var(--font-body);
        font-size: 24px;
        font-weight: 800;
        letter-spacing: -0.05em;
        color: #0f172a;
    }

    .header-actions {
        display: flex;
        align-items: center;
        gap: 16px;
    }

    .btn-emergency {
        display: none;
        font-family: var(--font-display);
        font-size: 14px;
        font-weight: 600;
        color: #475569;
        transition: color 0.2s;
    }

    @media (min-width: 1024px) {
        .btn-emergency {
            display: block;
        }
    }

    .btn-emergency:hover {
        color: #0f172a;
    }

    /* Hero Section */
    .hero {
        position: relative;
        min-height: 819px;
        display: flex;
        align-items: center;
        overflow: hidden;
    }

    .hero-bg,
    .hero-overlay {
        position: absolute;
        inset: 0;
        z-index: 0;
    }

    .hero-bg img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .hero-overlay {
        background: linear-gradient(135deg, rgba(9, 29, 45, 0.9) 0%, rgba(9, 29, 45, 0.4) 100%);
    }

    .hero-content {
        position: relative;
        z-index: 10;
        padding-top: var(--section-padding);
        padding-bottom: var(--section-padding);
    }

    .hero-inner {
        max-width: 672px;
        /* 2xl area */
        margin: 0 auto;
        text-align: center;
    }

    .tagline {
        display: inline-block;
        background-color: rgba(SECONDARY_RGB_PLACEHOLDER, 0.2);
        color: var(--primary);
        padding: 4px 16px;
        border-radius: 9999px;
        font-size: 14px;
        font-weight: 600;
        letter-spacing: 0.05em;
        line-height: 1;
        margin-bottom: 24px;
    }

    .hero-title {
        color: #fff;
    }

    .hero-desc {
        color: rgba(255, 255, 255, 0.8);
        max-width: 576px;
        margin-left: auto;
        margin-right: auto;
        margin-bottom: 32px;
    }

    .hero-buttons {
        display: flex;
        flex-direction: column;
        gap: 16px;
        justify-content: center;
    }

    @media (min-width: 640px) {
        .hero-buttons {
            flex-direction: row;
        }
    }

    /* Forms */
    .form-input {
        width: 100%;
        padding: 12px 16px;
        border-radius: 8px;
        border: 1px solid #e2e8f0;
        background-color: #fff;
        outline: none;
        transition: all 0.2s;
        font-size: 16px;
    }

    .form-input:focus {
        border-color: transparent;
        box-shadow: 0 0 0 2px var(--primary);
    }

    select.form-input {
        appearance: none;
        background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
        background-position: right 1rem center;
        background-repeat: no-repeat;
        background-size: 1.5em 1.5em;
        padding-right: 2.5rem;
    }

    /* Quick Booking Form */
    .quick-booking-wrapper {
        position: relative;
        z-index: 20;
        margin-top: -64px;
    }

    .quick-booking-card {
        background-color: #fff;
        border-radius: 12px;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        padding: 32px;
        border: 1px solid #f1f5f9;
    }

    @media (min-width: 768px) {
        .quick-booking-card {
            padding: 48px;
        }
    }

    .quick-booking-form {
        display: grid;
        grid-template-columns: 1fr;
        gap: 16px;
        align-items: flex-end;
    }

    @media (min-width: 768px) {
        .quick-booking-form {
            grid-template-columns: repeat(2, 1fr);
        }
    }

    @media (min-width: 1024px) {
        .quick-booking-form {
            grid-template-columns: repeat(6, 1fr);
        }
    }

    .form-submit-btn {
        width: 100%;
        background-color: var(--primary);
        color: #fff;
        padding: 12px;
        border-radius: 8px;
        font-family: var(--font-display);
        font-size: 18px;
        font-weight: 600;
        transition: filter 0.2s;
    }

    .form-submit-btn:hover {
        filter: brightness(1.1);
    }

    /* Sections */
    .section {
        padding-top: var(--section-padding);
        padding-bottom: var(--section-padding);
    }

    .section-header {
        text-align: center;
        margin-bottom: 64px;
    }

    .section-header p {
        color: var(--secondary);
        max-width: 672px;
        margin: 0 auto;
    }

    .divider {
        width: 96px;
        height: 4px;
        background-color: var(--primary);
        margin: 16px auto 0;
    }

    /* About Section */
    .about-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 64px;
        align-items: center;
    }

    @media (min-width: 1024px) {
        .about-grid {
            grid-template-columns: repeat(2, 1fr);
        }
    }

    .about-image {
        position: relative;
    }

    .about-image img {
        border-radius: 12px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        width: 100%;
        aspect-ratio: 1/1;
        object-fit: cover;
    }

    .about-badge {
        position: absolute;
        bottom: -24px;
        right: -24px;
        background-color: var(--secondary);
        color: #fff;
        padding: 32px;
        border-radius: 8px;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        display: none;
    }

    @media (min-width: 768px) {
        .about-badge {
            display: block;
        }
    }

    .about-badge-val {
        font-size: 36px;
        line-height: 40px;
        font-weight: 800;
        margin-bottom: 4px;
    }

    .about-badge-label {
        font-size: 14px;
        opacity: 0.8;
        font-weight: 600;
        letter-spacing: 0.05em;
    }

    .list-item {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 16px;
        list-style: none !important;
        list-style-type: none !important;
    }

    /* Stats Section */
    .stats-section {
        background-color: var(--secondary);
        padding-top: 64px;
        padding-bottom: 64px;
    }

    .stats-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 32px;
        text-align: center;
    }

    @media (min-width: 768px) {
        .stats-grid {
            grid-template-columns: repeat(4, 1fr);
        }
    }

    .stat-val {
        color: var(--primary);
        font-size: 36px;
        font-weight: 800;
        margin-bottom: 8px;
    }

    .stat-label {
        color: #fff;
        font-size: 14px;
        font-weight: 600;
        letter-spacing: 0.05em;
    }

    /* Services Section */
    .bg-light {
        background-color: var(--border-light);
    }

    .services-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 32px;
    }

    @media (min-width: 1024px) {
        .services-grid {
            grid-template-columns: repeat(3, 1fr);
        }
    }

    .card {
        background-color: #fff;
        padding: 32px;
        border-radius: 12px;
        box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        border: 1px solid #f1f5f9;
        transition: box-shadow 0.2s;
    }

    .card:hover {
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    .card-icon {
        width: 56px;
        height: 56px;
        background-color: var(--border-light);
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--primary);
        margin-bottom: 24px;
        transition: background-color 0.2s, color 0.2s;
    }

    .card:hover .card-icon {
        background-color: var(--primary);
        color: #fff;
    }

    .card-icon .material-symbols-outlined {
        font-size: 30px;
    }

    .card p {
        color: var(--secondary);
        margin-bottom: 24px;
    }

    .link {
        color: var(--primary);
        font-family: var(--font-display);
        font-size: 24px;
        font-weight: 600;
        display: inline-flex;
        align-items: center;
        gap: 8px;
    }

    .service-featured {
        position: relative;
        overflow: hidden;
        border-radius: 12px;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    }

    @media (min-width: 1024px) {
        .service-featured {
            grid-column: span 1;
            grid-row: span 2;
        }
    }

    .service-featured img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        position: absolute;
        inset: 0;
    }

    .featured-overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(to top, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.4), transparent);
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        padding: 32px;
        color: #fff;
    }

    .featured-overlay p {
        margin-bottom: 24px;
        opacity: 0.8;
    }

    /* Process Section */
    .process-container {
        position: relative;
    }

    .process-line {
        position: absolute;
        top: 20%;
        left: 0;
        width: 100%;
        height: 2px;
        background-color: #e2e8f0;
        transform: translateY(-50%);
        display: none;
    }

    @media (min-width: 1024px) {
        .process-line {
            display: block;
        }
    }

    .process-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 48px;
    }

    @media (min-width: 768px) {
        .process-grid {
            grid-template-columns: repeat(3, 1fr);
        }
    }

    @media (min-width: 1024px) {
        .process-grid {
            grid-template-columns: repeat(5, 1fr);
        }
    }

    .process-step {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        position: relative;
    }

    .step-num {
        width: 64px;
        height: 64px;
        border-radius: 50%;
        background-color: #fff;
        border: 4px solid var(--primary);
        color: var(--primary);
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: var(--font-display);
        font-size: 24px;
        font-weight: 800;
        z-index: 10;
        margin-bottom: 24px;
        transition: all 0.2s;
    }

    .process-step:hover .step-num {
        background-color: var(--primary);
        color: #fff;
    }

    .process-step p {
        font-size: 14px;
        color: var(--secondary);
    }

    /* Why Choose Us */
    .features-section {
        background-color: var(--secondary);
        color: #fff;
    }

    .features-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 48px;
    }

    @media (min-width: 1024px) {
        .features-grid {
            grid-template-columns: repeat(3, 1fr);
        }
    }

    .feature {
        display: flex;
        gap: 24px;
    }

    .feature-icon {
        font-size: 36px;
        color: var(--primary);
    }

    .feature-icon .material-symbols-outlined {
        font-size: 36px;
    }

    .feature p {
        opacity: 0.7;
    }

    /* Testimonials */
    .stars {
        display: flex;
        justify-content: center;
        gap: 4px;
        margin-bottom: 64px;
    }

    .stars .material-symbols-outlined {
        color: var(--primary);
    }

    .testimonials-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 32px;
    }

    @media (min-width: 768px) {
        .testimonials-grid {
            grid-template-columns: repeat(3, 1fr);
        }
    }

    .testimonial-card {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100%;
    }

    .testimonial-text {
        font-style: italic;
        color: var(--secondary);
        margin-bottom: 32px;
    }

    .client-info {
        display: flex;
        align-items: center;
        gap: 16px;
    }

    .client-avatar {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        object-fit: cover;
    }

    .client-role {
        font-size: 12px;
        color: var(--secondary);
    }

    /* Contact Section */
    .contact-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 64px;
    }

    @media (min-width: 768px) {
        .contact-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 32px;
        }
    }

    @media (min-width: 1024px) {
        .contact-grid {
            gap: 64px;
        }
    }

    .contact-item {
        display: flex;
        align-items: flex-start;
        gap: 16px;
        margin-bottom: 24px;
    }

    .contact-icon {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background-color: var(--border-light);
        color: var(--primary);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
    }

    .map-container {
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        border: 1px solid #e2e8f0;
        height: 256px;
    }

    .map-container img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .contact-form-card {
        background-color: #fff;
        padding: 32px;
        border-radius: 12px;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        border: 1px solid #f1f5f9;
    }

    @media (min-width: 768px) {
        .contact-form-card {
            padding: 48px;
        }
    }

    .form-group {
        margin-bottom: 24px;
    }

    .form-label {
        display: block;
        font-size: 14px;
        font-weight: 600;
        letter-spacing: 0.05em;
        color: var(--secondary);
        margin-bottom: 8px;
    }

    .form-input {
        width: 100%;
        padding: 12px 16px;
        border: 1px solid #cbd5e1;
        border-radius: 8px;
        background-color: #fff;
        color: var(--text-dark);
        font-size: 15px;
        font-family: inherit;
        outline: none;
        transition: all 0.2s ease;
    }

    .form-input:focus {
        border-color: var(--secondary);
        box-shadow: 0 0 0 3px rgba(SECONDARY_RGB_PLACEHOLDER, 0.15);
    }
    
    select.form-input {
        appearance: none;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: right 12px center;
        background-size: 16px;
        padding-right: 40px;
    }

    .btn-submit-full {
        width: 100%;
        background-color: var(--secondary);
        color: #fff;
        padding: 16px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        font-family: var(--font-display);
        font-size: 24px;
        font-weight: 600;
        transition: filter 0.2s;
    }

    .btn-submit-full:hover {
        filter: brightness(1.1);
    }

    /* Footer */
    .footer {
        background-color: #020617;
        border-top: 1px solid #1e293b;
        padding-top: 64px;
        padding-bottom: 32px;
    }

    .footer-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 48px;
    }

    @media (min-width: 768px) {
        .footer-grid {
            grid-template-columns: repeat(4, 1fr);
        }
    }

    .footer-logo {
        font-family: var(--font-body);
        font-size: 20px;
        font-weight: 700;
        color: #fff;
        margin-bottom: 16px;
        display: block;
    }

    .footer-desc {
        color: #94a3b8;
        font-size: 14px;
        margin-bottom: 24px;
        font-family: var(--font-display);
    }

    .social-links {
        display: flex;
        gap: 16px;
    }

    .social-links a {
        color: #94a3b8;
        transition: color 0.2s;
    }

    .social-links a:hover {
        color: PRIMARY_COLOR_PLACEHOLDER;
    }

    .footer h4 {
        color: #fff;
        font-weight: 700;
        margin-bottom: 24px;
    }

    .footer-links {
        list-style: none;
        font-family: var(--font-display);
    }

    .footer-links li {
        margin-bottom: 16px;
    }

    .footer-links a {
        color: #94a3b8;
        font-size: 14px;
        transition: color 0.2s;
    }

    .footer-links a:hover {
        color: PRIMARY_COLOR_PLACEHOLDER;
    }

    .footer-bottom {
        border-top: 1px solid #0f172a;
        margin-top: 64px;
        padding-top: 32px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 16px;
    }

    @media (min-width: 768px) {
        .footer-bottom {
            flex-direction: row;
            justify-content: space-between;
        }
    }

    .footer-bottom p {
        color: #94a3b8;
        font-size: 14px;
        font-family: var(--font-display);
        align-self: center;
    }

    /* Modal */
    .modal-backdrop {
        position: fixed;
        inset: 0;
        z-index: 100;
        display: none;
        align-items: center;
        justify-content: center;
        padding: 16px;
    }

    .modal-backdrop.flex {
        display: flex !important;
    }

    .modal-overlay {
        position: absolute;
        inset: 0;
        background-color: rgba(15, 23, 42, 0.6);
        backdrop-filter: blur(4px);
    }

    .modal-content {
        position: relative;
        background-color: #fff;
        width: 100%;
        max-width: 512px;
        border-radius: 12px;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        animation: zoomIn 0.3s ease-out;
    }

    @keyframes zoomIn {
        from {
            opacity: 0;
            transform: scale(0.95);
        }

        to {
            opacity: 1;
            transform: scale(1);
        }
    }

    .modal-body {
        padding: 24px;
    }

    @media (min-width: 640px) {
        .modal-body {
            padding: 32px;
        }
    }

    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 24px;
    }

    .modal-header p {
        color: var(--secondary);
        font-size: 14px;
        margin-top: 4px;
    }

    .close-btn {
        padding: 8px;
        border-radius: 50%;
        transition: background-color 0.2s;
    }

    .close-btn:hover {
        background-color: #f1f5f9;
    }

    .close-btn .material-symbols-outlined {
        color: var(--secondary);
    }

    .grid-2 {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
    }
`;

export const plumber02Html = `
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" />
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

<!-- TopAppBar -->
  <header class="header">
    <div class="container header-inner">
      <a data-editable="true" class="brand-logo" style="font-size: 24px; font-weight: 800; color: #0f172a;" href="#">LOGO_PLACEHOLDER</a>
      <div class="header-actions">
        <button data-editable="true" class="btn-emergency">Emergency Call</button>
        <button data-editable="true" class="btn-primary" id="open-modal-header">Book Online</button>
      </div>
    </div>
  </header>

  <!-- Hero Section -->
  <section class="hero">
    <div class="hero-bg">
      <img data-editable-img="true" src="/assets/templates/plumber/templates02/plumber.png" data-alt="A professional plumber in a crisp navy uniform carefully inspecting a complex kitchen sink piping system with modern stainless steel tools. The kitchen is bright and high-end with marble countertops and minimalist decor. Warm, natural sunlight streams through a nearby window, creating a clean, trustworthy atmosphere. The overall aesthetic is professional, technical, and premium." />
      <div class="hero-overlay"></div>
    </div>
    <div class="hero-content container">
      <div class="hero-inner">
        <span data-editable="true" class="tagline">24/7 EMERGENCY SUPPORT</span>
        <h1 data-editable="true" class="text-display hero-title mb-6">Fast Solutions for Plumbing Problems</h1>
        <p data-editable="true" class="text-body-lg hero-desc">From minor leaks to major installations, our master plumbers deliver precision service with a satisfaction guarantee. Professional expertise you can trust, right when you need it.</p>
        <div class="hero-buttons">
          <button data-editable="true" class="btn-primary btn-primary-large">
            Get Free Quote
            <span data-editable="true" class="material-symbols-outlined">arrow_forward</span>
          </button>
          <button data-editable="true" class="btn-outline">
            <span data-editable="true" class="material-symbols-outlined">phone_in_talk</span>
            Contact Us
          </button>
        </div>
      </div>
    </div>
  </section>

  <!-- Quick Booking Form -->
  <section class="quick-booking-wrapper container">
    <div class="quick-booking-card">
      <h2 data-editable="true" class="text-h1 mb-6">Request an Appointment</h2>
      <form class="quick-booking-form">
        <div><input class="form-input" placeholder="John Doe" type="text" name="name" id="qb_name" /></div>
        <div><input class="form-input" placeholder="EMAIL_PLACEHOLDER" type="email" name="email_address" id="qb_email_address" /></div>
        <div><input class="form-input" placeholder="PHONE_PLACEHOLDER" type="tel" name="phone" id="qb_phone" /></div>
        <div>
          <select class="form-input" name="services" id="qb_services">
            <option>Work Type</option>
            <option>General Repair</option>
            <option>Drain Cleaning</option>
            <option>Emergency Service</option>
            <option>Installation</option>
          </select>
        </div>
        <div><input class="form-input" type="datetime-local" name="appointment_time" id="qb_appointment_time" /></div>
        <button data-editable="true" class="form-submit-btn" type="submit">Submit Request</button>
      </form>
    </div>
  </section>

  <!-- About Section -->
  <section class="section container" id="about">
    <div class="about-grid">
      <div class="about-image">
        <img data-editable-img="true" src="/assets/templates/plumber/templates02/plumber-team.png" data-alt="A focused senior master plumber in professional workwear explaining a technical diagram to a younger apprentice. They are standing in a clean, modern workshop with organized tools on the wall behind them. The lighting is crisp and detailed, showcasing the high-quality textures of the tools and the professional demeanor of the staff. The image communicates heritage and expertise." />
        <div class="about-badge">
          <p data-editable="true" class="about-badge-val font-display">25+</p>
          <p data-editable="true" class="about-badge-label">Years Excellence</p>
        </div>
      </div>
      <div>
        <h2 data-editable="true" class="text-h1 mb-6">Expert Plumbing with a Premium Touch</h2>
        <p data-editable="true" class="text-body-lg text-secondary mb-8">For over two decades, Elite Plumbing Professionals has redefined local service standards through rigorous training and a commitment to engineering excellence. We don't just fix leaks; we provide sustainable infrastructure solutions.</p>
        <div>
          <div class="list-item">
            <span data-editable="true" class="material-symbols-outlined filled text-primary-container text-h3">check_circle</span>
            <span data-editable="true" class="text-h3 text-secondary">Licensed &amp; Insured Master Plumbers</span>
          </div>
          <div class="list-item">
            <span data-editable="true" class="material-symbols-outlined filled text-primary-container text-h3">check_circle</span>
            <span data-editable="true" class="text-h3 text-secondary">Upfront, Flat-Rate Pricing</span>
          </div>
          <div class="list-item">
            <span data-editable="true" class="material-symbols-outlined filled text-primary-container text-h3">check_circle</span>
            <span data-editable="true" class="text-h3 text-secondary">Guaranteed On-Time Arrival</span>
          </div>
          <div class="list-item">
            <span data-editable="true" class="material-symbols-outlined filled text-primary-container text-h3">check_circle</span>
            <span data-editable="true" class="text-h3 text-secondary">Advanced Diagnostic Technology</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Stats Section -->
  <section class="stats-section">
    <div class="container">
      <div class="stats-grid">
        <div>
          <p data-editable="true" class="stat-val font-display">15k+</p>
          <p data-editable="true" class="stat-label">Jobs Completed</p>
        </div>
        <div>
          <p data-editable="true" class="stat-val font-display">4.9/5</p>
          <p data-editable="true" class="stat-label">Google Rating</p>
        </div>
        <div>
          <p data-editable="true" class="stat-val font-display">100%</p>
          <p data-editable="true" class="stat-label">Satisfaction Rate</p>
        </div>
        <div>
          <p data-editable="true" class="stat-val font-display">30min</p>
          <p data-editable="true" class="stat-label">Emergency Response</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Services Section -->
  <section class="section bg-light" id="services">
    <div class="container">
      <div class="section-header">
        <h2 data-editable="true" class="text-h1 mb-4">Our Premium Services</h2>
        <div class="divider"></div>
      </div>
      <div class="services-grid">
        <!-- Service Card 1 -->
        <div class="card">
          <div class="card-icon"><span data-editable="true" class="material-symbols-outlined">plumbing</span></div>
          <h3 data-editable="true" class="text-h2 mb-4">Emergency Repair</h3>
          <p data-editable="true">Burst pipes, major leaks, or sewage backups. Our rapid response team is available 24/7/365.</p>
          <a data-editable="true" class="link" href="#">Learn More <span data-editable="true" class="material-symbols-outlined">arrow_forward</span></a>
        </div>
        <!-- Featured Card -->
        <div class="service-featured">
          <img data-editable-img="true" src="/assets/templates/plumber/templates02/commercial-service.png" data-alt="An expansive, high-angle view of a masterfully installed commercial boiler system in a clean mechanical room. The pipes are perfectly aligned and color-coded, showcasing industrial-grade precision. The lighting is bright and industrial, emphasizing the metallic sheen of the hardware. The mood is one of extreme reliability and professional engineering excellence." />
          <div class="featured-overlay">
            <h3 data-editable="true" class="text-h2 mb-4 text-white">Commercial Solutions</h3>
            <p data-editable="true">Full-scale plumbing infrastructure for high-rise buildings and commercial facilities.</p>
            <button data-editable="true" class="btn-primary" style="width: fit-content;">View Portfolio</button>
          </div>
        </div>
        <!-- Service Card 2 -->
        <div class="card">
          <div class="card-icon"><span data-editable="true" class="material-symbols-outlined">water_damage</span></div>
          <h3 data-editable="true" class="text-h2 mb-4">Drain Cleaning</h3>
          <p data-editable="true">Using hydro-jetting technology to clear even the most stubborn blockages without pipe damage.</p>
          <a data-editable="true" class="link" href="#">Learn More <span data-editable="true" class="material-symbols-outlined">arrow_forward</span></a>
        </div>
        <!-- Service Card 3 -->
        <div class="card">
          <div class="card-icon"><span data-editable="true" class="material-symbols-outlined">hot_tub</span></div>
          <h3 data-editable="true" class="text-h2 mb-4">Water Heaters</h3>
          <p data-editable="true">Expert installation and maintenance of traditional and high-efficiency tankless systems.</p>
          <a data-editable="true" class="link" href="#">Learn More <span data-editable="true" class="material-symbols-outlined">arrow_forward</span></a>
        </div>
        <!-- Service Card 4 -->
        <div class="card">
          <div class="card-icon"><span data-editable="true" class="material-symbols-outlined">foundation</span></div>
          <h3 data-editable="true" class="text-h2 mb-4">Sewer Lines</h3>
          <p data-editable="true">Trenchless repair methods that save your landscaping while restoring main line function.</p>
          <a data-editable="true" class="link" href="#">Learn More <span data-editable="true" class="material-symbols-outlined">arrow_forward</span></a>
        </div>
      </div>
    </div>
  </section>

  <!-- Process Section -->
  <section class="section container" id="process">
    <div class="section-header">
      <h2 data-editable="true" class="text-h1 mb-4">How It Works</h2>
      <p data-editable="true">Our streamlined process ensures your plumbing issues are resolved quickly with zero stress.</p>
    </div>
    <div class="process-container">
      <div class="process-line"></div>
      <div class="process-grid">
        <!-- Step 1 -->
        <div class="process-step">
          <div class="step-num">01</div>
          <h4 data-editable="true" class="text-h3 mb-2">Initial Contact</h4>
          <p data-editable="true">Call or book online for a same-day evaluation.</p>
        </div>
        <!-- Step 2 -->
        <div class="process-step">
          <div class="step-num">02</div>
          <h4 data-editable="true" class="text-h3 mb-2">Expert Diagnosis</h4>
          <p data-editable="true">On-site assessment using advanced imaging tech.</p>
        </div>
        <!-- Step 3 -->
        <div class="process-step">
          <div class="step-num">03</div>
          <h4 data-editable="true" class="text-h3 mb-2">Upfront Quote</h4>
          <p data-editable="true">Fixed-rate pricing with no hidden surprises.</p>
        </div>
        <!-- Step 4 -->
        <div class="process-step">
          <div class="step-num">04</div>
          <h4 data-editable="true" class="text-h3 mb-2">Service Execution</h4>
          <p data-editable="true">Clean, professional repairs done right.</p>
        </div>
        <!-- Step 5 -->
        <div class="process-step">
          <div class="step-num">05</div>
          <h4 data-editable="true" class="text-h3 mb-2">Final Inspection</h4>
          <p data-editable="true">We test everything and leave your home spotless.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Why Choose Us -->
  <section class="section features-section">
    <div class="container features-grid">
      <div class="feature">
        <div class="feature-icon"><span data-editable="true" class="material-symbols-outlined">verified_user</span></div>
        <div>
          <h3 data-editable="true" class="text-h2 mb-2">Fully Certified</h3>
          <p data-editable="true">Master licenses held in all service areas with ongoing safety training.</p>
        </div>
      </div>
      <div class="feature">
        <div class="feature-icon"><span data-editable="true" class="material-symbols-outlined">sell</span></div>
        <div>
          <h3 data-editable="true" class="text-h2 mb-2">Flat-Rate Pricing</h3>
          <p data-editable="true">No hourly surprises. You know the exact cost before we start any work.</p>
        </div>
      </div>
      <div class="feature">
        <div class="feature-icon"><span data-editable="true" class="material-symbols-outlined">support_agent</span></div>
        <div>
          <h3 data-editable="true" class="text-h2 mb-2">24/7 Availability</h3>
          <p data-editable="true">Plumbing disasters don't wait for business hours, and neither do we.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Testimonials -->
  <section class="section container" id="testimonials">
    <div class="section-header" style="margin-bottom: 24px;">
      <h2 data-editable="true" class="text-h1 mb-4">Client Success Stories</h2>
    </div>
    <div class="stars">
      <span data-editable="true" class="material-symbols-outlined filled">star</span>
      <span data-editable="true" class="material-symbols-outlined filled">star</span>
      <span data-editable="true" class="material-symbols-outlined filled">star</span>
      <span data-editable="true" class="material-symbols-outlined filled">star</span>
      <span data-editable="true" class="material-symbols-outlined filled">star</span>
    </div>
    <div class="testimonials-grid">
      <!-- Testimonial 1 -->
      <div class="card testimonial-card">
        <p data-editable="true" class="testimonial-text">"Elite Plumbing saved our basement from flooding on a Sunday night. They arrived in 20 minutes and fixed the sump pump with zero drama. Highly professional!"</p>
        <div class="client-info">
          <img data-editable-img="true" class="client-avatar" src="/assets/templates/plumber/templates02/client-01.png" data-alt="..." />
          <div>
            <p data-editable="true" class="text-h3" style="font-size: 20px;">Sarah Jenkins</p>
            <p data-editable="true" class="client-role">Homeowner</p>
          </div>
        </div>
      </div>
      <!-- Testimonial 2 -->
      <div class="card testimonial-card">
        <p data-editable="true" class="testimonial-text">"We've used them for our restaurant infrastructure for 5 years. They are the only crew I trust for grease trap maintenance and line inspections."</p>
        <div class="client-info">
          <img data-editable-img="true" class="client-avatar" src="/assets/templates/plumber/templates02/client-02.png" data-alt="..." />
          <div>
            <p data-editable="true" class="text-h3" style="font-size: 20px;">Michael Chen</p>
            <p data-editable="true" class="client-role">Restaurant Group Owner</p>
          </div>
        </div>
      </div>
      <!-- Testimonial 3 -->
      <div class="card testimonial-card">
        <p data-editable="true" class="testimonial-text">"The tech was so respectful of our home, wearing boot covers and cleaning up every speck of dust. The new tankless heater is amazing!"</p>
        <div class="client-info">
          <img data-editable-img="true" class="client-avatar" src="/assets/templates/plumber/templates02/client-03.png" data-alt="..." />
          <div>
            <p data-editable="true" class="text-h3" style="font-size: 20px;">Emily Rodriguez</p>
            <p data-editable="true" class="client-role">Property Manager</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Contact & Form Section -->
  <section class="section container" id="contact">
    <div class="contact-grid">
      <div>
        <h2 data-editable="true" class="text-h1 mb-6">Need Immediate Assistance?</h2>
        <p data-editable="true" class="text-body-lg text-secondary mb-8">Our dispatchers are standing by to connect you with a technician in your neighborhood. We offer full coverage across the metropolitan area with guaranteed response times.</p>
        
        <div class="contact-info-list">
          <div class="contact-item">
            <div class="contact-icon"><span data-editable="true" class="material-symbols-outlined">support_agent</span></div>
            <div>
              <p data-editable="true" class="text-h3 text-on-background">Emergency Dispatch</p>
              <p data-editable="true" class="text-secondary">PHONE_PLACEHOLDER - Available 24/7</p>
            </div>
          </div>
          <div class="contact-item">
            <div class="contact-icon"><span data-editable="true" class="material-symbols-outlined">location_on</span></div>
            <div>
              <p data-editable="true" class="text-h3 text-on-background">Main Office</p>
              <p data-editable="true" class="text-secondary">123 Industrial Way, Suite 400<br />Metro City, ST 12345</p>
            </div>
          </div>
        </div>

        <div class="map-container">
          <img data-editable-img="true" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA5hmmyU99GnWv92rGvIuSBEg1--GwsVc2wau8kL8AjR6zhlxT_DkwhI7RdFw2zcVQTgAWVcB3peJroIHrDBaYmrchpaXKn7lCx_LQcnP38VPhIe1_sw-sm7PEg1PNgQTD75k-ODiLylwcAKn-EnBxKSKO2MwrFr0Qvl3JE_u81xyCahuT3T9bhtpPXSPpV9eMJ9VnDjbs1GkABNAW89lomYsK205Z1tRmYQHq7kmdg9rayyh_VwsXfVDKv02v9zTCNkHRfU3LIM755" data-alt="..." />
        </div>
      </div>
      
      <div class="contact-form-card">
        <h3 data-editable="true" class="text-h2 mb-8">Send Us a Message</h3>
        <form>
          <div class="form-group">
            <label class="form-label" for="cf_name">Full Name</label>
            <input class="form-input" placeholder="John Doe" type="text" name="name" id="cf_name" />
          </div>
          <div class="form-group">
            <label class="form-label" for="cf_email">Email Address</label>
            <input class="form-input" placeholder="EMAIL_PLACEHOLDER" type="email" name="email_address" id="cf_email" />
          </div>
          <div class="form-group">
            <label class="form-label" for="cf_phone">Phone Number</label>
            <input class="form-input" placeholder="PHONE_PLACEHOLDER" type="tel" name="phone" id="cf_phone" />
          </div>
          <div class="form-group">
            <label class="form-label" for="cf_services">Work Type</label>
            <select class="form-input" name="services" id="cf_services">
              <option>General Repair</option>
              <option>Drain Cleaning</option>
              <option>Emergency Service</option>
              <option>Installation</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label" for="cf_appointment_time">Date/Time</label>
            <input class="form-input" type="datetime-local" name="appointment_time" id="cf_appointment_time" />
          </div>
          <button data-editable="true" class="btn-submit-full mt-6" type="submit">
            Send Request
            <span data-editable="true" class="material-symbols-outlined">send</span>
          </button>
        </form>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="footer">
    <div class="container footer-grid">
      <div>
        <a data-editable="true" class="footer-logo" href="#">LOGO_PLACEHOLDER</a>
        <p data-editable="true" class="footer-desc">Redefining professional trade services with precision, integrity, and elite craftsmanship.</p>
    
      </div>
    </div>
    <div class="container footer-bottom">
      <p data-editable="true">© 2026 PROJECT_NAME_PLACEHOLDER. Licensed &amp; Insured.</p>
    </div>
  </footer>

  <!-- Booking Modal -->
  <div class="modal-backdrop" id="booking-modal">
    <div class="modal-overlay" id="close-modal-overlay"></div>
    <div class="modal-content">
      <div class="modal-body">
        <div class="modal-header">
          <div>
            <h2 data-editable="true" class="text-h2">Book Online</h2>
            <p data-editable="true">Schedule your premium service today.</p>
          </div>
          <button data-editable="true" class="close-btn" id="close-modal">
            <span data-editable="true" class="material-symbols-outlined">close</span>
          </button>
        </div>
        <form>
          <div class="form-group mb-4">
            <label class="form-label" for="md_name">Name</label>
            <input class="form-input" placeholder="John Doe" required type="text" name="name" id="md_name" />
          </div>
          <div class="form-group mb-4">
            <label class="form-label" for="md_email">Email Address</label>
            <input class="form-input" placeholder="EMAIL_PLACEHOLDER" required type="email" name="email_address" id="md_email" />
          </div>
          <div class="form-group mb-4">
            <label class="form-label" for="md_phone">Phone Number</label>
            <input class="form-input" placeholder="PHONE_PLACEHOLDER" required type="tel" name="phone" id="md_phone" />
          </div>
          <div class="grid-2 form-group mb-4">
            <div>
              <label class="form-label" for="md_services">Work Type</label>
              <select class="form-input" name="services" id="md_services">
                <option>General Repair</option>
                <option>Drain Cleaning</option>
                <option>Emergency Service</option>
                <option>Installation</option>
              </select>
            </div>
            <div>
              <label class="form-label" for="md_appointment_time">Date/Time</label>
              <input class="form-input" required type="datetime-local" name="appointment_time" id="md_appointment_time" />
            </div>
          </div>
          <button data-editable="true" class="form-submit-btn mt-6" type="submit">Confirm Booking Request</button>
        </form>
      </div>
    </div>
  </div>

<script>
  (function() {
    const openModal = () => {
        const modal = document.getElementById('booking-modal');
        if(modal) {
            modal.classList.add('flex');
            document.body.style.overflow = 'hidden';
        }
    };

    const closeModal = () => {
        const modal = document.getElementById('booking-modal');
        if(modal) {
            modal.classList.remove('flex');
            document.body.style.overflow = '';
        }
    };

    document.addEventListener('click', (e) => {
        const target = e.target;
        if (target.closest('#open-modal-header')) {
            openModal();
        } else if (target.closest('#close-modal') || target.closest('#close-modal-overlay')) {
            closeModal();
        } else if (target.id === 'booking-modal') {
            closeModal();
        }
    });
  })();
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