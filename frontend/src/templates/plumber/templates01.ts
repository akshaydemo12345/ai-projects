// Auto-generated ULTRA-DYNAMIC template
// Generated: 2026-07-16T05:04:28.364Z
// ════════════════════════════════════════════════════════════════════════════
// Converted directly in the browser using Frontend JSZip Extraction
// ════════════════════════════════════════════════════════════════════════════
export const plumber01Styles = `
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

/* GrapesJS Editor Override */
body, .gjs-dashed, [data-gjs-type="wrapper"], main {
    background-color: var(--bg-light) !important;
    color: var(--text-dark) !important;
}
h1, h2, h3, h4, h5, h6, p, span, div, a {
    color: inherit;
}


        *, *::before, *::after {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        html {
            font-family: 'Poppins', sans-serif;
            scroll-behavior: smooth;
            -webkit-text-size-adjust: 100%;
        }

        body {
            background-color: var(--bg-light);
            color: var(--text-dark);
            font-size: 16px;
            line-height: 1.5;
            font-weight: 400;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }

        img { max-width: 100%; display: block; }
        a { text-decoration: none; color: inherit; }
        button, input, select, textarea { font-family: inherit; font-size: inherit; }
        
        .material-symbols-outlined {
            font-family: 'Material Symbols Outlined' !important;
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .icon-fill { font-variation-settings: 'FILL' 1; }

        .font-display { font-size: 48px; line-height: 1.1; letter-spacing: -0.02em; font-weight: 700; }
        .font-headline-lg { font-size: 32px; line-height: 1.2; letter-spacing: -0.01em; font-weight: 700; }
        .font-headline-md { font-size: 24px; line-height: 1.3; font-weight: 600; }
        .font-body-lg { font-size: 18px; line-height: 1.6; font-weight: 400; }
        .font-body-md { font-size: 16px; line-height: 1.5; font-weight: 400; }
        .font-label-bold { font-size: 14px; line-height: 1.2; font-weight: 600; }
        .font-caption { font-size: 12px; line-height: 1.4; font-weight: 400; }

        .container {
            max-width: 1280px;
            margin: 0 auto;
            padding: 0 24px;
            width: 100%;
        }

        /* Header */
        .site-header {
            position: fixed;
            top: 0;
            width: 100%;
            z-index: 50;
            background-color: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border-bottom: 1px solid #e2e8f0;
            box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        }

        .header-inner {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-top: 16px;
            padding-bottom: 16px;
        }

        .brand-logo {
            font-size: 24px;
            font-weight: 900;
            letter-spacing: -0.025em;
            color: #1e3a8a;
        }

        .header-actions {
            display: flex;
            align-items: center;
            gap: 16px;
        }

        .contact-info {
            display: none;
            flex-direction: column;
            align-items: flex-end;
            margin-right: 16px;
        }

        @media (min-width: 1024px) {
            .contact-info { display: flex; }
        }

        .emergency-text { color: var(--text-muted); }
        .phone-link {
            display: flex;
            align-items: center;
            gap: 4px;
            color: var(--primary);
        }

        .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border-radius: 8px;
            border: none;
            cursor: pointer;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .btn:active { transform: scale(0.95); }

        .btn-primary {
            background-color: var(--secondary);
            color: #ffffff;
            padding: 10px 24px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        .btn-primary:hover { background-color: var(--secondary); }

        main { padding-top: 96px; }

        /* Hero Section */
        .hero-section {
            position: relative;
            padding-top: var(--spacing-section-padding);
            padding-bottom: var(--spacing-section-padding);
            background-image: linear-gradient(to right, rgba(249, 249, 255, 0.411) 30%, rgba(249, 249, 255, 1) 100%), url("/assets/templates/plumber/templates01/hero-background.jpg");
            background-size: cover;
            background-position: center;
        }

        .hero-grid {
            display: grid;
            gap: 48px;
            align-items: center;
        }
        @media (min-width: 768px) {
            .hero-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }

        .hero-content {
            display: flex;
            flex-direction: column;
            gap: 32px;
        }

        .hero-badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background-color: rgba(PRIMARY_RGB_PLACEHOLDER, 0.1);
            color: var(--primary);
            padding: 6px 16px;
            border-radius: 9999px;
            width: fit-content;
        }
        .hero-badge span.text { text-transform: uppercase; letter-spacing: 0.05em; }

        .hero-title { color: var(--primary); }
        .hero-title span { color: var(--secondary); }
        .hero-desc { color: var(--text-muted); max-width: 36rem; }

        .hero-buttons {
            display: flex;
            flex-wrap: wrap;
            gap: 16px;
            padding-top: 16px;
        }

        .btn-large {
            padding: 16px 32px;
            border-radius: 12px;
            font-size: 18px;
        }
        .btn-hero-primary {
            background-color: var(--secondary);
            color: #fff;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }
        .btn-hero-primary:hover {
            background-color: var(--secondary);
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        }
        .btn-hero-outline {
            background-color: #ffffff;
            border: 2px solid var(--primary);
            color: var(--primary);
        }
        .btn-hero-outline:hover { background-color: #f8fafc; }

        .hero-stats {
            display: flex;
            align-items: center;
            gap: 24px;
            padding-top: 32px;
        }
        .avatar-group { display: flex; }
        .avatar {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            border: 4px solid #ffffff;
            background-color: #e2e8f0;
            overflow: hidden;
            margin-left: -12px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .avatar:first-child { margin-left: 0; }
        .avatar img { width: 100%; height: 100%; object-fit: cover; }
        .avatar.text {
            background-color: var(--primary);
            color: #ffffff;
            font-size: 12px;
            font-weight: 700;
        }
        .stats-text { color: var(--text-muted); }
        .stats-text strong { color: var(--primary); font-weight: 700; }

        .service-form {
            padding: 32px;
            border-radius: 4px;
            background-color: rgba(255, 255, 255, 0.95);
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
            border: 1px solid #475569;
        }
        .form-title { color: var(--primary); margin-bottom: 24px; }
        .form-fields { display: flex; flex-direction: column; gap: 16px; }
        .form-input {
            width: 100%;
            padding: 12px 16px;
            border-radius: 4px;
            border: 1px solid #cbd5e1;
            outline: none;
            transition: all 0.2s;
            color: var(--text-dark);
            background-color: #ffffff;
        }
        .form-input:focus { box-shadow: 0 0 0 2px var(--primary); border-color: transparent; }
        .form-select-wrapper { position: relative; }
        select.form-input { appearance: none; }
        .form-icon {
            position: absolute;
            right: 12px;
            top: 50%;
            transform: translateY(-50%);
            color: var(--text-dark);
            pointer-events: none;
        }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .form-textarea { min-height: 100px; resize: vertical; }
        .btn-submit {
            width: 100%;
            background-color: PRIMARY_COLOR_PLACEHOLDER;
            color: #ffffff;
            padding: 16px;
            border-radius: 4px;
            text-transform: uppercase;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .btn-submit:hover { filter: brightness(1.1); }

        /* Features */
        .features-section { padding: var(--spacing-section-padding) 0; background-color: #ffffff; }
        .section-header { text-align: center; margin-bottom: 64px; max-width: 672px; margin-left: auto; margin-right: auto; }
        .section-title { color: var(--primary); margin-bottom: 16px; }
        .section-desc { color: var(--text-muted); }
        .features-grid { display: grid; gap: var(--spacing-gutter); }
        @media (min-width: 768px) { .features-grid { grid-template-columns: repeat(3, 1fr); } }
        
        .feature-card {
            padding: 32px;
            border-radius: 16px;
            border: 1px solid #f1f5f9;
            background-color: #ffffff;
            transition: all 0.3s;
        }
        .feature-card:hover {
            border-color: var(--border-light);
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        }
        .feature-icon {
            width: 56px;
            height: 56px;
            background-color: var(--border-light);
            color: var(--primary);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 24px;
            transition: all 0.3s;
        }
        .feature-card:hover .feature-icon { background-color: var(--primary); color: #fff; }
        .feature-icon span { font-size: 30px; }
        .feature-card h4 { margin-bottom: 12px; }
        .feature-card p { color: var(--text-muted); margin-bottom: 24px; }
        .feature-link {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            color: var(--primary);
            transition: all 0.2s;
        }
        .feature-card:hover .feature-link { gap: 12px; }
        .feature-link span { font-size: 14px; }

        /* Experts */
        .experts-section { padding: 80px 0; background-color: #ffffff; overflow: hidden; }
        .experts-grid { display: grid; gap: 64px; align-items: center; }
        @media (min-width: 768px) { .experts-grid { grid-template-columns: repeat(2, 1fr); } }
        
        .experts-img-wrap { position: relative; }
        .experts-img {
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
        .experts-img img { width: 100%; height: 700px; object-fit: cover; }
        .experts-circle {
            position: absolute;
            bottom: -24px;
            right: -24px;
            width: 128px;
            height: 128px;
            background-color: rgba(PRIMARY_RGB_PLACEHOLDER, 0.1);
            border-radius: 50%;
            z-index: -10;
        }
        
        .experts-content { display: flex; flex-direction: column; gap: 32px; }
        .experts-header h2 { color: var(--primary); text-transform: uppercase; margin-bottom: 16px; }
        .experts-header p { color: var(--text-muted); font-size: 18px; line-height: 1.6; }
        .experts-list { display: flex; flex-direction: column; gap: 24px; }
        .expert-item { display: flex; gap: 16px; }
        .expert-icon {
            flex-shrink: 0;
            width: 48px;
            height: 48px;
            background-color: rgba(PRIMARY_RGB_PLACEHOLDER, 0.05);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--primary);
        }
        .expert-text h4 { color: var(--primary); font-size: 20px; font-weight: 700; text-transform: uppercase; margin-bottom: 4px; }
        .expert-text p { color: var(--text-muted); }

        /* Testimonials */
        .testimonials-section { padding: var(--spacing-section-padding) 0; background-color: var(--border-light); }
        .testimonials-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 48px; }
        .testimonials-title h2 { color: var(--primary); margin-bottom: 8px; }
        .testimonials-title p { color: var(--text-muted); }
        
        .testimonials-rating-box { display: none; gap: 16px; }
        @media (min-width: 768px) { .testimonials-rating-box { display: flex; } }
        .rating-badge {
            display: flex;
            align-items: center;
            gap: 4px;
            background-color: #ffffff;
            padding: 8px 16px;
            border-radius: 9999px;
            border: 1px solid #e2e8f0;
        }
        .rating-score { color: var(--primary); font-weight: 700; }
        .rating-stars { display: flex; color: #fbbf24; }
        .rating-stars span { font-size: 14px; }

        .testimonials-grid { display: grid; gap: 32px; }
        @media (min-width: 768px) { .testimonials-grid { grid-template-columns: repeat(3, 1fr); } }
        
        .testimonial-card {
            background-color: #ffffff;
            padding: 32px;
            border-radius: 16px;
            box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
            border: 1px solid #ffffff;
        }
        .testimonial-quote { color: var(--text-dark); margin-bottom: 24px; font-style: italic; line-height: 1.6; }
        .testimonial-author { display: flex; align-items: center; gap: 16px; }
        .author-img { width: 48px; height: 48px; border-radius: 50%; background-color: #f1f5f9; overflow: hidden; }
        .author-img img { width: 100%; height: 100%; object-fit: cover; }
        .author-info h5 { color: var(--primary); }
        .author-info p { color: var(--text-muted); }

        /* CTA */
        .cta-section { padding: var(--spacing-section-padding) 0; background-color: #ffffff; position: relative; overflow: hidden; }
        .bg-hero-pattern {
            position: absolute; inset: 0; opacity: 0.05; pointer-events: none; z-index: 1;
            background-color: #f9f9ff;
            background-image: radial-gradient(circle at 2px 2px, #e7eeff 1px, transparent 0);
            background-size: 40px 40px;
        }
        .cta-wrapper { max-width: 1024px; margin: 0 auto; padding: 0 24px; position: relative; z-index: 10; }
        .cta-box {
            background-color: var(--primary);
            border-radius: 24px;
            padding: 48px;
            text-align: center;
            color: #ffffff;
            overflow: hidden;
            position: relative;
        }
        .cta-circle-1 { position: absolute; top: -80px; right: -80px; width: 256px; height: 256px; background-color: rgba(0, 71, 155, 0.2); border-radius: 50%; }
        .cta-circle-2 { position: absolute; bottom: -40px; left: -40px; width: 192px; height: 192px; background-color: rgba(SECONDARY_RGB_PLACEHOLDER, 0.1); border-radius: 50%; }
        .cta-box h2 { margin-bottom: 24px; }
        .cta-box p { color: var(--bg-light); margin-bottom: 40px; max-width: 672px; margin-left: auto; margin-right: auto; }
        
        .cta-buttons { display: flex; flex-direction: column; justify-content: center; gap: 16px; }
        @media (min-width: 640px) { .cta-buttons { flex-direction: row; } }
        
        .btn-cta {
            padding: 20px 40px;
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            font-size: 20px;
        }
        .btn-cta-primary {
            background-color: var(--secondary);
            color: #ffffff;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        }
        .btn-cta-primary:hover { background-color: var(--secondary); }
        .btn-cta-outline {
            background-color: #ffffff;
            color: var(--primary);
        }
        .btn-cta-outline:hover { background-color: #f8fafc; }
        
        .cta-features { margin-top: 32px; display: flex; justify-content: center; gap: 32px; color: var(--border-light); font-size: 14px; }
        .cta-feature { display: flex; align-items: center; gap: 8px; }

        /* Footer */
        .site-footer { background-color: #0f172a; color: #ffffff; width: 100%; }
        .footer-grid {
            max-width: 1280px; margin: 0 auto; padding: 48px 24px;
            display: grid; gap: 32px; grid-template-columns: 1fr;
        }
        @media (min-width: 768px) { .footer-grid { grid-template-columns: repeat(4, 1fr); } }
        
        .footer-brand { font-size: 20px; font-weight: 700; color: #ffffff; margin-bottom: 16px; display: block; }
        .footer-desc { color: #94a3b8; margin-bottom: 24px; }
        .social-links { display: flex; gap: 16px; }
        .social-link {
            width: 40px; height: 40px; border-radius: 50%; background-color: #1e293b;
            display: flex; align-items: center; justify-content: center; transition: all 0.2s;
        }
        .social-link:hover { background-color: var(--secondary); }
        
        .footer-col h6 { margin-bottom: 24px; text-transform: uppercase; letter-spacing: 0.05em; }
        .footer-links { list-style: none; display: flex; flex-direction: column; gap: 16px; }
        .footer-link { color: #94a3b8; transition: all 0.2s; display: block; }
        .footer-link:hover { color: #ffffff; transform: translateX(4px); }
        
        .footer-contact { display: flex; flex-direction: column; gap: 16px; color: #94a3b8; }
        .contact-item { display: flex; align-items: flex-start; gap: 12px; }
        .contact-item span.icon { color: var(--secondary); }
        
        .footer-bottom { border-top: 1px solid #1e293b; padding: 32px 0; }
        .footer-copy { max-width: 1280px; margin: 0 auto; padding: 0 24px; text-align: center; color: #64748b; }

        /* Modal */
        .modal-overlay {
            position: fixed; inset: 0; z-index: 100; display: none; align-items: center; justify-content: center;
            background-color: rgba(0, 0, 0, 0.5); backdrop-filter: blur(4px); padding: 16px;
        }
        .modal-overlay.flex { display: flex !important; }
        .modal-content {
            background-color: #ffffff; width: 100%; max-width: 576px; border-radius: 16px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); position: relative;
            animation: fadeIn 0.3s ease-out;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
        }
        .modal-close {
            position: absolute; top: 16px; right: 16px; background: none; border: none;
            color: #94a3b8; cursor: pointer; transition: color 0.2s;
        }
        .modal-close:hover { color: var(--primary); }
        .modal-body { padding: 32px; }
        .modal-body form { margin-top: 24px; }
@media (max-width: 768px) {
  .header-inner, .phone-link, .hero-stats, .testimonials-header, .cta-features { flex-direction: column !important; }
}

`;

export const plumber01Html = `
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet"/>
<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" />
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

<header class="site-header">
    <div class="container header-inner">
        <div class="header-left">
            <a data-editable="true" class="brand-logo font-headline-md" href="javascript:void(0);">LOGO_PLACEHOLDER</a>
        </div>
        <div class="header-actions">
            <div class="contact-info">
                <span data-editable="true" class="font-caption emergency-text">Emergency? Call Now</span>
                <a data-editable="true" class="font-label-bold phone-link" href="tel:PHONE_PLACEHOLDER">
                    <span data-editable="true" class="material-symbols-outlined" data-icon="call">call</span>
                    PHONE_PLACEHOLDER
                </a>
            </div>
            <button data-editable="true" class="btn btn-primary font-label-bold" id="open-modal-header">
                Request Service
            </button>
        </div>
    </div>
</header>

<main>
    <!-- Hero Section -->
    <section class="hero-section">
        <div class="container hero-grid">
            <div class="hero-content">
                <div class="hero-badge">
                    <span data-editable="true" class="material-symbols-outlined icon-fill font-caption" data-icon="verified">verified</span>
                    <span data-editable="true" class="font-label-bold text">Licensed &amp; Insured Professional</span>
                </div>
                <h1 data-editable="true" class="font-display hero-title">
                    Your Reliable <span data-editable="true">Local Plumbers</span>
                </h1>
                <p data-editable="true" class="font-body-lg hero-desc">
                    Expert 24/7 emergency services and routine maintenance. We handle everything from leaky faucets to complex main line repairs with professional precision.
                </p>
                <div class="hero-buttons">
                    <button data-editable="true" class="btn btn-large btn-hero-primary font-label-bold text-lg">Book Now</button>
                    <button data-editable="true" class="btn btn-large btn-hero-outline font-label-bold text-lg">View Services</button>
                </div>
                <div class="hero-stats">
                    <div class="avatar-group">
                        <div class="avatar"><img data-editable-img="true" data-alt="professional plumber portrait smiling in uniform" src="/assets/templates/plumber/templates01/plumber-01.png"/></div>
                        <div class="avatar"><img data-editable-img="true" data-alt="senior plumber with professional tools in background" src="/assets/templates/plumber/templates01/plumber-02.png"/></div>
                        <div class="avatar text">+15</div>
                    </div>
                    <p data-editable="true" class="font-caption stats-text">
                        <strong data-editable="true">500+</strong> satisfied homeowners this month
                    </p>
                </div>
            </div>

            <!-- Lead Gen Form -->
            <div class="service-form">
                <h3 data-editable="true" class="font-headline-md form-title">Schedule Your Visit</h3>
                <form class="form-fields">
                    <input class="form-input font-body-md" placeholder="Full name" type="text" name="name" id="name"/>
                    <input class="form-input font-body-md" placeholder="Email address" type="email" name="email_address" id="email_address"/>
                    <input class="form-input font-body-md" placeholder="Phone number" type="tel" name="phone" id="phone"/>
                    <div class="form-select-wrapper">
                        <select class="form-input font-body-md">
                            <option disabled="" selected="">Work type</option>
                            <option>Drain Cleaning</option>
                            <option>Pipe Repair</option>
                            <option>Water Heater Install</option>
                            <option>Emergency Leak</option>
                            <option>General Inspection</option>
                        </select>
                        <span data-editable="true" class="material-symbols-outlined form-icon">expand_more</span>
                    </div>
                    <div class="form-row">
                        <div class="form-select-wrapper">
                            <input class="form-input font-body-md" placeholder="Date" type="text" name="date" id="date"/>
                            <span data-editable="true" class="material-symbols-outlined form-icon">calendar_month</span>
                        </div>
                        <div class="form-select-wrapper">
                            <input class="form-input font-body-md" placeholder="Time" type="text" name="time" id="time"/>
                            <span data-editable="true" class="material-symbols-outlined form-icon">schedule</span>
                        </div>
                    </div>
                    <textarea class="form-input form-textarea font-body-md" placeholder="Address" name="address" id="address"></textarea>
                    <button data-editable="true" class="btn btn-submit font-label-bold text-lg" type="submit">
                        Get a Free Quote
                    </button>
                </form>
            </div>
        </div>
    </section>

    <!-- Features Grid -->
    <section class="features-section">
        <div class="container section-header">
            <h2 data-editable="true" class="font-headline-lg section-title">Comprehensive Plumbing Solutions</h2>
            <p data-editable="true" class="font-body-md section-desc">From minor fixes to major installations, our expert team uses the latest technology to solve your plumbing problems permanently.</p>
        </div>
        <div class="container features-grid">
            <!-- Card 1 -->
            <div class="feature-card">
                <div class="feature-icon">
                    <span data-editable="true" class="material-symbols-outlined" data-icon="cleaning_services">cleaning_services</span>
                </div>
                <h4 data-editable="true" class="font-headline-md">Drain Cleaning</h4>
                <p data-editable="true" class="font-body-md">Hydro-jetting and advanced snaking to clear the toughest blockages and restore full flow to your pipes.</p>
                <a data-editable="true" class="font-label-bold feature-link" href="javascript:void(0);">
                    Learn More <span data-editable="true" class="material-symbols-outlined">arrow_forward</span>
                </a>
            </div>
            <!-- Card 2 -->
            <div class="feature-card">
                <div class="feature-icon">
                    <span data-editable="true" class="material-symbols-outlined" data-icon="plumbing">plumbing</span>
                </div>
                <h4 data-editable="true" class="font-headline-md">Pipe Repair</h4>
                <p data-editable="true" class="font-body-md">Non-invasive leak detection and durable pipe replacement using modern, corrosion-resistant materials.</p>
                <a data-editable="true" class="font-label-bold feature-link" href="javascript:void(0);">
                    Learn More <span data-editable="true" class="material-symbols-outlined">arrow_forward</span>
                </a>
            </div>
            <!-- Card 3 -->
            <div class="feature-card">
                <div class="feature-icon">
                    <span data-editable="true" class="material-symbols-outlined" data-icon="hot_tub">hot_tub</span>
                </div>
                <h4 data-editable="true" class="font-headline-md">Water Heaters</h4>
                <p data-editable="true" class="font-body-md">Installation and repair of high-efficiency tankless and traditional water heating systems.</p>
                <a data-editable="true" class="font-label-bold feature-link" href="javascript:void(0);">
                    Learn More <span data-editable="true" class="material-symbols-outlined">arrow_forward</span>
                </a>
            </div>
        </div>
    </section>

    <section class="experts-section">
        <div class="container experts-grid">
            <div class="experts-img-wrap">
                <div class="experts-img">
                    <img data-editable-img="true" alt="Plumbing Experts" src="/assets/templates/plumber/templates01/plumber.jpg"/>
                </div>
                <div class="experts-circle"></div>
            </div>
            <div class="experts-content">
                <div class="experts-header">
                    <h2 data-editable="true" class="font-headline-lg">The Plumbing Experts You've Trusted For Over 30 Years</h2>
                    <p data-editable="true">Since 1994, we have been providing top-tier plumbing services to our community. Our commitment to quality craftsmanship and customer satisfaction has made us the go-to choice for homeowners and businesses alike.</p>
                </div>
                <div class="experts-list">
                    <!-- Feature 1 -->
                    <div class="expert-item">
                        <div class="expert-icon"><span data-editable="true" class="material-symbols-outlined">workspace_premium</span></div>
                        <div class="expert-text">
                            <h4 data-editable="true">Certification</h4>
                            <p data-editable="true">Plumbers certified &amp; highly experienced experts dedicated to your satisfaction.</p>
                        </div>
                    </div>
                    <!-- Feature 2 -->
                    <div class="expert-item">
                        <div class="expert-icon"><span data-editable="true" class="material-symbols-outlined">schedule</span></div>
                        <div class="expert-text">
                            <h4 data-editable="true">24/7 Opened</h4>
                            <p data-editable="true">Have a problem with your plumbing at night? Call us! Our team is available round the clock.</p>
                        </div>
                    </div>
                    <!-- Feature 3 -->
                    <div class="expert-item">
                        <div class="expert-icon"><span data-editable="true" class="material-symbols-outlined">payments</span></div>
                        <div class="expert-text">
                            <h4 data-editable="true">Fair Prices</h4>
                            <p data-editable="true">We aren't cheapest, but we won't ruin your wallet either. Transparent pricing, always.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Testimonials -->
    <section class="testimonials-section">
        <div class="container">
            <div class="testimonials-header">
                <div class="testimonials-title">
                    <h2 data-editable="true" class="font-headline-lg">Trusted by Your Neighbors</h2>
                    <p data-editable="true" class="font-body-md">Real stories from local residents who experienced our reliability firsthand.</p>
                </div>
                <div class="testimonials-rating-box">
                    <div class="rating-badge">
                        <span data-editable="true" class="rating-score">4.9/5</span>
                        <div class="rating-stars">
                            <span data-editable="true" class="material-symbols-outlined icon-fill">star</span>
                            <span data-editable="true" class="material-symbols-outlined icon-fill">star</span>
                            <span data-editable="true" class="material-symbols-outlined icon-fill">star</span>
                            <span data-editable="true" class="material-symbols-outlined icon-fill">star</span>
                            <span data-editable="true" class="material-symbols-outlined icon-fill">star</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="testimonials-grid">
                <!-- Quote 1 -->
                <div class="testimonial-card">
                    <div class="rating-stars" style="margin-bottom: 16px;">
                        <span data-editable="true" class="material-symbols-outlined icon-fill">star</span>
                        <span data-editable="true" class="material-symbols-outlined icon-fill">star</span>
                        <span data-editable="true" class="material-symbols-outlined icon-fill">star</span>
                        <span data-editable="true" class="material-symbols-outlined icon-fill">star</span>
                        <span data-editable="true" class="material-symbols-outlined icon-fill">star</span>
                    </div>
                    <p data-editable="true" class="font-body-md testimonial-quote">"ProPlumb saved us when our water heater burst on a Sunday morning. They were here in 30 minutes and the repair was flawless."</p>
                    <div class="testimonial-author">
                        <div class="author-img"><img data-editable-img="true" data-alt="portrait of a middle aged woman smiling warmly" src="/assets/templates/plumber/templates01/client-01.png"/></div>
                        <div class="author-info">
                            <h5 data-editable="true" class="font-label-bold">Sarah Miller</h5>
                            <p data-editable="true" class="font-caption">Homewood Resident</p>
                        </div>
                    </div>
                </div>
                <!-- Quote 2 -->
                <div class="testimonial-card">
                    <div class="rating-stars" style="margin-bottom: 16px;">
                        <span data-editable="true" class="material-symbols-outlined icon-fill">star</span>
                        <span data-editable="true" class="material-symbols-outlined icon-fill">star</span>
                        <span data-editable="true" class="material-symbols-outlined icon-fill">star</span>
                        <span data-editable="true" class="material-symbols-outlined icon-fill">star</span>
                        <span data-editable="true" class="material-symbols-outlined icon-fill">star</span>
                    </div>
                    <p data-editable="true" class="font-body-md testimonial-quote">"The most professional trade service I've used. Clear pricing, high-quality work, and they left the bathroom cleaner than they found it."</p>
                    <div class="testimonial-author">
                        <div class="author-img"><img data-editable-img="true" data-alt="portrait of a young man smiling professionally" src="/assets/templates/plumber/templates01/client-02.png"/></div>
                        <div class="author-info">
                            <h5 data-editable="true" class="font-label-bold">David Chen</h5>
                            <p data-editable="true" class="font-caption">Local Business Owner</p>
                        </div>
                    </div>
                </div>
                <!-- Quote 3 -->
                <div class="testimonial-card">
                    <div class="rating-stars" style="margin-bottom: 16px;">
                        <span data-editable="true" class="material-symbols-outlined icon-fill">star</span>
                        <span data-editable="true" class="material-symbols-outlined icon-fill">star</span>
                        <span data-editable="true" class="material-symbols-outlined icon-fill">star</span>
                        <span data-editable="true" class="material-symbols-outlined icon-fill">star</span>
                        <span data-editable="true" class="material-symbols-outlined icon-fill">star</span>
                    </div>
                    <p data-editable="true" class="font-body-md testimonial-quote">"Honest advice and fair rates. They fixed a major drain issue that other companies quoted double for. Highly recommend!"</p>
                    <div class="testimonial-author">
                        <div class="author-img"><img data-editable-img="true" data-alt="portrait of a man in a business casual outfit" src="/assets/templates/plumber/templates01/client-03.png"/></div>
                        <div class="author-info">
                            <h5 data-editable="true" class="font-label-bold">James Wilson</h5>
                            <p data-editable="true" class="font-caption">Property Manager</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Pricing/Signup Section -->
    <section class="cta-section">
        <div class="bg-hero-pattern"></div>
        <div class="cta-wrapper">
            <div class="cta-box">
                <div class="cta-circle-1"></div>
                <div class="cta-circle-2"></div>
                <h2 data-editable="true" class="font-display">Need Immediate Assistance?</h2>
                <p data-editable="true" class="font-body-lg">Our experts are standing by 24/7. Get a transparent quote and high-quality service today with our "No-Stress" guarantee.</p>
                <div class="cta-buttons">
                    <a data-editable="true" class="btn btn-cta btn-cta-primary font-label-bold" href="tel:PHONE_PLACEHOLDER">
                        <span data-editable="true" class="material-symbols-outlined">call</span>
                        Call PHONE_PLACEHOLDER
                    </a>
                    <button data-editable="true" class="btn btn-cta btn-cta-outline font-label-bold" id="open-modal-section">
                        <span data-editable="true" class="material-symbols-outlined">calendar_month</span>
                        Book Online
                    </button>
                </div>
                <div class="cta-features">
                    <div class="cta-feature">
                        <span data-editable="true" class="material-symbols-outlined font-body-lg">check_circle</span>
                        Upfront Pricing
                    </div>
                    <div class="cta-feature">
                        <span data-editable="true" class="material-symbols-outlined font-body-lg">check_circle</span>
                        Certified Techs
                    </div>
                    <div class="cta-feature">
                        <span data-editable="true" class="material-symbols-outlined font-body-lg">check_circle</span>
                        No Call-out Fee*
                    </div>
                </div>
            </div>
        </div>
    </section>
</main>

<footer class="site-footer">
    <div class="footer-grid">
        <div class="footer-col">
            <a data-editable="true" class="footer-brand" href="javascript:void(0);">PROJECT_NAME_PLACEHOLDER</a>
            <p data-editable="true" class="font-body-md footer-desc">Your professional partner for residential and commercial plumbing. Quality you can trust, service you can depend on.</p>
            <div class="social-links">
                <a data-editable="true" class="social-link" href="javascript:void(0);"><span data-editable="true" class="material-symbols-outlined">public</span></a>
                <a data-editable="true" class="social-link" href="javascript:void(0);"><span data-editable="true" class="material-symbols-outlined">share</span></a>
                <a data-editable="true" class="social-link" href="javascript:void(0);"><span data-editable="true" class="material-symbols-outlined">alternate_email</span></a>
            </div>
        </div>
        <div class="footer-col">
            <h6 data-editable="true" class="font-label-bold">Quick Links</h6>
            <ul class="footer-links font-body-md">
                <li data-editable="true"><a data-editable="true" class="footer-link" href="javascript:void(0);">Privacy Policy</a></li>
                <li data-editable="true"><a data-editable="true" class="footer-link" href="javascript:void(0);">Terms of Service</a></li>
                <li data-editable="true"><a data-editable="true" class="footer-link" href="javascript:void(0);">Emergency Contact</a></li>
                <li data-editable="true"><a data-editable="true" class="footer-link" href="javascript:void(0);">FAQ</a></li>
            </ul>
        </div>
        <div class="footer-col">
            <h6 data-editable="true" class="font-label-bold">Services</h6>
            <ul class="footer-links font-body-md">
                <li data-editable="true"><a data-editable="true" class="footer-link" href="javascript:void(0);">Residential Plumbing</a></li>
                <li data-editable="true"><a data-editable="true" class="footer-link" href="javascript:void(0);">Commercial Systems</a></li>
                <li data-editable="true"><a data-editable="true" class="footer-link" href="javascript:void(0);">Gas Line Repair</a></li>
                <li data-editable="true"><a data-editable="true" class="footer-link" href="javascript:void(0);">Kitchen &amp; Bath</a></li>
            </ul>
        </div>
        <div class="footer-col">
            <h6 data-editable="true" class="font-label-bold">Contact Us</h6>
            <div class="footer-contact font-body-md">
                <div class="contact-item">
                    <span data-editable="true" class="material-symbols-outlined icon">location_on</span>
                    <span data-editable="true">ADDRESS_PLACEHOLDER</span>
                </div>
                <div class="contact-item">
                    <span data-editable="true" class="material-symbols-outlined icon">call</span>
                    <span data-editable="true">PHONE_PLACEHOLDER</span>
                </div>
                <div class="contact-item">
                    <span data-editable="true" class="material-symbols-outlined icon">mail</span>
                    <span data-editable="true">EMAIL_PLACEHOLDER</span>
                </div>
            </div>
        </div>
    </div>
    <div class="footer-bottom">
        <div class="footer-copy font-body-md">
            © 2026 PROJECT_NAME_PLACEHOLDER. All Rights Reserved. Licensed &amp; Insured.
        </div>
    </div>
</footer>

<div class="modal-overlay" id="service-modal">
    <div class="modal-content">
        <button data-editable="true" class="modal-close" id="close-modal">
            <span data-editable="true" class="material-symbols-outlined">close</span>
        </button>
        <div class="modal-body">
            <h3 data-editable="true" class="font-headline-md form-title">Schedule Your Visit</h3>
            <form class="form-fields">
                <input class="form-input font-body-md" placeholder="Full name" required="" type="text" name="name" id="name"/>
                <input class="form-input font-body-md" placeholder="Email address" required="" type="email" name="email_address" id="email_address"/>
                <input class="form-input font-body-md" placeholder="Phone number" required="" type="tel" name="phone" id="phone"/>
                <div class="form-select-wrapper">
                    <select class="form-input font-body-md">
                        <option disabled="" selected="">Work type</option>
                        <option>Drain Cleaning</option>
                        <option>Pipe Repair</option>
                        <option>Water Heater Install</option>
                        <option>Emergency Leak</option>
                        <option>General Inspection</option>
                    </select>
                    <span data-editable="true" class="material-symbols-outlined form-icon">expand_more</span>
                </div>
                <div class="form-row">
                    <div class="form-select-wrapper">
                        <input class="form-input font-body-md" placeholder="Date" type="text" name="date" id="date"/>
                        <span data-editable="true" class="material-symbols-outlined form-icon">calendar_month</span>
                    </div>
                    <div class="form-select-wrapper">
                        <input class="form-input font-body-md" placeholder="Time" type="text" name="time" id="time"/>
                        <span data-editable="true" class="material-symbols-outlined form-icon">schedule</span>
                    </div>
                </div>
                <textarea class="form-input form-textarea font-body-md" placeholder="Address" name="address" id="address"></textarea>
                <button data-editable="true" class="btn btn-submit font-label-bold text-lg" type="submit">
                    Get a Free Quote
                </button>
            </form>
        </div>
    </div>
</div>

<script>
  (function() {
    const openModal = () => {
        const modal = document.getElementById('service-modal');
        if(modal) {
            modal.classList.add('flex');
            document.body.style.overflow = 'hidden';
        }
    };

    const closeModal = () => {
        const modal = document.getElementById('service-modal');
        if(modal) {
            modal.classList.remove('flex');
            document.body.style.overflow = '';
        }
    };

    document.addEventListener('click', (e) => {
        const target = e.target;
        if (target.closest('#open-modal-header') || target.closest('#open-modal-section')) {
            openModal();
        } else if (target.closest('#close-modal')) {
            closeModal();
        } else if (target.id === 'service-modal') {
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
        e.preventDefault();
        if (isInEditor) {
          e.stopImmediatePropagation();
          var existingModal = document.getElementById("preview-mode-modal");
          if (existingModal) existingModal.remove();
          var modalHtml = '<div id="preview-mode-modal" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 999999; display: flex; align-items: center; justify-content: center; background: rgba(15, 23, 42, 0.7); backdrop-filter: blur(8px); opacity: 0; animation: pModalFadeIn 0.3s forwards; font-family: system-ui, -apple-system, sans-serif;"><div style="background: #ffffff; width: 90%; max-width: 400px; border-radius: 20px; padding: 32px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); text-align: center; transform: scale(0.95); animation: pModalScaleUp 0.3s forwards;"><div style="width: 60px; height: 60px; background: #FEF2F2; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;"><svg style="width: 30px; height: 30px; color: #EF4444;" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg></div><h3 style="font-size: 20px; font-weight: 700; color: #0F172A; margin: 0 0 12px; letter-spacing: -0.02em;">Preview Mode Active</h3><p style="font-size: 15px; color: #64748B; margin: 0 0 28px; line-height: 1.5;">Form submissions are disabled in preview mode. Publish your page to accept real submissions.</p><button onclick="document.getElementById(\\'preview-mode-modal\\').remove()" style="width: 100%; background: #0F172A; color: #ffffff; border: none; padding: 14px; border-radius: 12px; font-size: 15px; font-weight: 600; cursor: pointer; transition: background 0.2s;" onmouseover="this.style.background=\\'#1E293B\\'" onmouseout="this.style.background=\\'#0F172A\\'">Got it, close</button></div><style>@keyframes pModalFadeIn { to { opacity: 1; } } @keyframes pModalScaleUp { to { transform: scale(1); } }</style></div>';
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
            e.target.innerHTML = '<div class="tpl-templates01-2" style="padding: 20px; text-align: center; border: 2px dashed #22c55e; border-radius: 8px; background: rgba(34,197,94,0.1); color: #166534;"><h3 style="margin: 0 0 10px 0;">Thank You!</h3><p style="margin: 0;">Your request has been submitted successfully.</p></div>';
          }, 1000);
        }
      }
    }, true);
  })();
</script>
`;

