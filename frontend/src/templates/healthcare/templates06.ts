// Auto-generated ULTRA-DYNAMIC template
// Generated: 2026-07-16T06:48:37.228Z
// ════════════════════════════════════════════════════════════════════════════
// Converted directly in the browser using Frontend JSZip Extraction
// ════════════════════════════════════════════════════════════════════════════

export const healthcare06Styles = `
:root {
  --primary: PRIMARY_COLOR_PLACEHOLDER;
  --secondary: SECONDARY_COLOR_PLACEHOLDER;
  --primary-rgb: PRIMARY_RGB_PLACEHOLDER;
  --secondary-rgb: SECONDARY_RGB_PLACEHOLDER;
  --bg-light: #fdfdfd;
  --text-dark: #1f1f1f;
  --text-muted: #3d3d3dff;
  --border-light: #f1f5f9;
  --spacing-section-padding: 80px;
  --spacing-gutter: 24px;
}

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        .material-symbols-outlined {
          font-family: 'Material Symbols Outlined' !important;
          font-weight: normal;
          font-style: normal;
          font-size: 24px;
          line-height: 1;
          letter-spacing: normal;
          text-transform: none;
          display: inline-block;
          white-space: nowrap;
          word-wrap: normal;
          direction: ltr;
          -webkit-font-feature-settings: 'liga';
          -webkit-font-smoothing: antialiased;
        }

        body {
            background-color: white;
            font-family: 'Inter', sans-serif;
            color: var(--primary);
            line-height: 1.5;
        }

        /* Typography */
        .font-display-lg { font-family: 'Geist', sans-serif; }
        .font-headline-lg { font-family: 'Geist', sans-serif; }
        .font-body-md { font-family: 'Inter', sans-serif; }
        
        .uppercase { text-transform: uppercase; }
        .italic { font-style: italic; }
        .font-bold { font-weight: 700; }
        .font-extrabold { font-weight: 800; }
        .font-black { font-weight: 900; }
        .font-medium { font-weight: 500; }
        
        .text-center { text-align: center; }

        /* Utilities */
        .flex { display: flex; }
        .items-center { align-items: center; }
        .items-start { align-items: flex-start; }
        .justify-between { justify-content: space-between; }
        .justify-center { justify-content: center; }
        .flex-col { flex-direction: column; }
        
        .relative { position: relative; }
        .absolute { position: absolute; }
        .fixed { position: fixed; }
        .sticky { position: sticky; }
        
        .inset-0 { top: 0; right: 0; bottom: 0; left: 0; }
        .top-0 { top: 0; }
        .bottom-6 { bottom: 1.5rem; }
        .left-6 { left: 1.5rem; }
        .right-6 { right: 1.5rem; }
        
        .z-10 { z-index: 10; }
        .z-20 { z-index: 20; }
        .z-30 { z-index: 30; }
        .z-50 { z-index: 50; }
        
        .overflow-hidden { overflow: hidden; }
        .w-full { width: 100%; }
        .h-full { height: 100%; }
        .w-4 { width: 1rem; }
        .h-4 { height: 1rem; }
        .w-6 { width: 1.5rem; }
        .h-6 { height: 1.5rem; }
        .w-8 { width: 2rem; }
        .h-8 { height: 2rem; }
        .w-10 { width: 2.5rem; }
        .h-10 { height: 2.5rem; }
        .w-14 { width: 3.5rem; }
        .h-14 { height: 3.5rem; }
        .w-24 { width: 6rem; }
        
        .max-w-sm { max-width: 24rem; }
        .max-w-lg { max-width: 32rem; }
        .max-w-xl { max-width: 36rem; }
        .max-w-2xl { max-width: 42rem; }
        .max-w-7xl { max-width: 80rem; }
        
        .object-cover { object-fit: cover; }
        
        .container {
            width: 100%;
            margin-right: auto;
            margin-left: auto;
        }

        .transition { transition: all 0.3s ease; }
        .transition-colors { transition: color 0.3s ease; }
        .transition-all { transition: all 0.3s ease; }
        .duration-300 { transition-duration: 300ms; }
        .duration-500 { transition-duration: 500ms; }

        .hidden { display: none !important; }
        .block { display: block; }
        
        .cursor-pointer { cursor: pointer; }
        .appearance-none { appearance: none; }
        
        button { cursor: pointer; border: none; font-family: inherit; }
        input, select, textarea { font-family: inherit; outline: none; }
        ul { list-style: none; }
        a { text-decoration: none; color: inherit; }

        /* Specific Components */
        
        /* Header */
        .main-header {
            background-color: var(--primary);
            color: white;
            padding: 1rem 1.5rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: sticky;
            top: 0;
            z-index: 50;
        }
        @media (min-width: 768px) {
            .main-header { padding: 1rem 3rem; }
        }

        .logo-group {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        .logo-title {
            font-size: 1.5rem;
            font-weight: 900;
            font-style: italic;
            letter-spacing: -0.05em;
        }
        .logo-highlight { color: var(--secondary); }
        .logo-subtitle {
            font-size: 10px;
            text-transform: uppercase;
            line-height: 1;
            opacity: 0.8;
            border-left: 1px solid var(--text-dark);
            padding-left: 0.5rem;
        }

        .contact-group { display: flex; align-items: center; gap: 0.75rem; }
        .contact-icon-bg {
            background-color: var(--secondary);
            padding: 0.5rem;
            border-radius: 9999px;
            color: var(--primary);
        }
        .contact-text-sm { font-size: 0.75rem; }
        .contact-label { color: var(--text-muted); font-weight: 500; }
        .contact-number { font-weight: 700; color: var(--secondary); }

        /* Hero */
        .hero-section {
            position: relative;
            height: 700px;
            overflow: hidden;
            background-color: var(--primary);
        }
        .hero-bg-img {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            opacity: 0.6;
        }
        .hero-gradient {
            position: absolute;
            inset: 0;
            background: linear-gradient(to right, rgba(PRIMARY_RGB_PLACEHOLDER, 0.9), rgba(PRIMARY_RGB_PLACEHOLDER, 0.4), transparent);
        }
        .hero-content {
            position: relative;
            z-index: 10;
            padding: 0 1.5rem;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            color: white;
        }
        @media (min-width: 768px) {
            .hero-content { padding: 0 3rem; }
        }
        .hero-title {
            font-size: 3rem;
            line-height: 1.1;
            margin-bottom: 1.5rem;
        }
        @media (min-width: 768px) {
            .hero-title { font-size: 4.5rem; }
        }
        .hero-desc {
            font-size: 1.125rem;
            color: var(--border-light);
            margin-bottom: 2rem;
            max-width: 32rem;
        }
        
        .hero-actions { display: flex; align-items: center; gap: 1.5rem; margin-bottom: 4rem; }
        .btn-primary {
            background-color: var(--secondary);
            color: var(--primary);
            padding: 1rem 2rem;
            border-radius: 0.25rem;
            font-weight: 700;
            text-transform: uppercase;
            font-size: 0.875rem;
            transition: all 0.3s ease;
        }
        .btn-primary:hover { background-color: white; }
        
        .hero-consult-btn {
            display: flex; align-items: center; gap: 0.75rem;
        }
        .hero-consult-icon {
            width: 2.5rem; height: 2.5rem;
            border: 1px solid var(--secondary);
            border-radius: 9999px;
            display: flex; align-items: center; justify-content: center;
            color: var(--secondary);
        }
        .hero-stats { display: flex; gap: 3rem; }
        .stat-value { font-size: 2.25rem; font-weight: 700; }
        .stat-label { font-size: 0.75rem; color: var(--secondary); text-transform: uppercase; letter-spacing: 0.05em; font-weight: 700; }
        .stat-divider { border-left: 1px solid rgba(255, 255, 255, 0.2); padding-left: 3rem; }
        
        .feature-card-float {
            position: absolute;
            bottom: 3rem;
            right: 1.5rem;
            z-index: 20;
            background-color: rgba(PRIMARY_RGB_PLACEHOLDER, 0.8);
            backdrop-filter: blur(12px);
            padding: 1rem;
            border-radius: 0.75rem;
            border: 1px solid rgba(255, 255, 255, 0.1);
            display: flex;
            align-items: center;
            gap: 1rem;
            max-width: 24rem;
        }
        @media (min-width: 768px) {
            .feature-card-float { right: 3rem; }
        }
        .feature-img-wrapper { position: relative; cursor: pointer; }
        .feature-img { border-radius: 0.25rem; width: 6rem; height: 5rem; object-fit: cover; }
        .feature-play {
            position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
        }
        .feature-play-icon {
            width: 2rem; height: 2rem; background-color: var(--secondary); border-radius: 9999px;
            display: flex; align-items: center; justify-content: center; color: var(--primary);
        }
        .feature-title { color: var(--secondary); font-weight: 700; font-size: 0.875rem; }
        .feature-desc { font-size: 10px; color: var(--border-light); margin-top: 0.25rem; }

        /* Feature Cards Section */
        .features-section {
            padding: 4rem 1.5rem;
            margin-top: -5rem;
            position: relative;
            z-index: 30;
        }
        @media (min-width: 768px) {
            .features-section { padding: 4rem 3rem; }
        }
        .features-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 1.5rem;
            max-width: 80rem;
            margin: 0 auto;
        }
        @media (min-width: 768px) {
            .features-grid { grid-template-columns: repeat(4, 1fr); }
        }
        .feature-box {
            background-color: var(--primary);
            color: white;
            padding: 2rem;
            border-radius: 0.25rem;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            border-bottom: 4px solid var(--secondary);
            text-align: center;
            transition: transform 0.3s ease;
        }
        .feature-box:hover { transform: translateY(-0.5rem); }
        .feature-box-icon {
            color: var(--secondary);
            margin-bottom: 1rem;
            display: flex;
            justify-content: center;
        }
        .feature-box-title { font-weight: 700; margin-bottom: 0.5rem; }
        .feature-box-desc { font-size: 0.75rem; color: var(--text-muted); }

        /* About Section */
        .about-section {
            padding: 5rem 1.5rem;
        }
        @media (min-width: 768px) {
            .about-section { padding: 5rem 3rem; }
        }
        .about-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 4rem;
            align-items: center;
            max-width: 80rem;
            margin: 0 auto;
        }
        @media (min-width: 768px) {
            .about-grid { grid-template-columns: repeat(2, 1fr); }
        }
        .about-img-wrapper { position: relative; }
        .about-img-inner {
            position: relative;
            z-index: 10;
            border-radius: 1rem;
            overflow: hidden;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
        .about-img { width: 100%; height: auto; display: block; }
        .about-badge {
            position: absolute;
            bottom: -1.5rem;
            left: -1.5rem;
            z-index: 20;
            background-color: var(--secondary);
            color: var(--primary);
            padding: 1.5rem;
            border-radius: 0.75rem;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            text-align: center;
            min-width: 140px;
        }
        .about-badge-val { font-size: 2.25rem; font-weight: 900; }
        .about-badge-label { font-size: 10px; font-weight: 700; text-transform: uppercase; line-height: 1.25; margin-top: 0.25rem; }
        
        .about-title { font-size: 2.25rem; font-weight: 800; margin-bottom: 1rem; line-height: 1.2; }
        @media (min-width: 768px) { .about-title { font-size: 3rem; } }
        .about-desc { color: var(--text-muted); margin-bottom: 2rem; line-height: 1.625; }
        
        .about-list { margin-bottom: 2.5rem; display: flex; flex-direction: column; gap: 1.5rem; }
        .about-item { display: flex; align-items: flex-start; gap: 1rem; }
        .about-item-icon {
            background-color: var(--primary);
            padding: 0.75rem;
            border-radius: 0.5rem;
            color: var(--secondary);
            margin-top: 0.25rem;
        }
        .about-item-title { font-weight: 700; color: var(--primary); }
        .about-item-desc { font-size: 0.75rem; color: var(--text-muted); margin-top: 0.25rem; }
        
        .btn-outline {
            background-color: var(--secondary);
            color: var(--primary);
            padding: 0.75rem 2rem;
            border-radius: 0.25rem;
            font-weight: 700;
            text-transform: uppercase;
            font-size: 0.875rem;
            transition: all 0.3s ease;
        }
        .btn-outline:hover { background-color: var(--primary); color: white; }

        /* Projects Section */
        .projects-section {
            padding: 5rem 1.5rem;
            background-color: var(--bg-light);
        }
        @media (min-width: 768px) { .projects-section { padding: 5rem 3rem; } }
        .projects-header {
            display: flex; flex-direction: column; margin-bottom: 3rem; max-width: 80rem; margin-left: auto; margin-right: auto;
        }
        @media (min-width: 768px) {
            .projects-header { flex-direction: row; align-items: flex-end; justify-content: space-between; }
        }
        .projects-title { font-size: 2.25rem; font-weight: 800; margin-bottom: 1rem; line-height: 1.2; }
        .projects-desc { color: var(--text-muted); font-size: 0.875rem; }
        
        .projects-grid {
            display: grid; grid-template-columns: 1fr; gap: 1.5rem; max-width: 80rem; margin: 0 auto;
        }
        @media (min-width: 768px) { .projects-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 1024px) { .projects-grid { grid-template-columns: repeat(4, 1fr); } }
        
        .project-card {
            position: relative; border-radius: 0.75rem; overflow: hidden; height: 400px;
        }
        .project-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
        .project-card:hover .project-img { transform: scale(1.1); }
        .project-overlay {
            position: absolute; inset: 0; background: linear-gradient(to top, var(--primary), transparent, transparent); opacity: 0.9;
        }
        .project-content { position: absolute; bottom: 1.5rem; left: 1.5rem; right: 1.5rem; }
        .project-content-title { color: var(--secondary); font-weight: 700; margin-bottom: 0.5rem; }
        .project-content-desc { font-size: 10px; color: var(--border-light); }

        /* CTA Banner */
        .cta-banner { position: relative; padding: 6rem 0; overflow: hidden; }
        .cta-bg { position: absolute; inset: 0; z-index: 0; }
        .cta-img { width: 100%; height: 100%; object-fit: cover; }
        .cta-overlay { position: absolute; inset: 0; background-color: rgba(PRIMARY_RGB_PLACEHOLDER, 0.8); mix-blend-mode: multiply; }
        .cta-content { position: relative; z-index: 10; text-align: center; padding: 0 1.5rem; max-width: 80rem; margin: 0 auto; }
        .cta-title { font-size: 2.25rem; font-weight: 900; color: white; }
        @media (min-width: 768px) { .cta-title { font-size: 3rem; } }
        .cta-btn {
            margin-top: 2rem; background-color: var(--secondary); color: var(--primary);
            padding: 1rem 2.5rem; border-radius: 0.25rem; font-weight: 700; text-transform: uppercase;
            font-size: 0.875rem; transition: all 0.3s ease; display: inline-block;
        }
        .cta-btn:hover { background-color: white; }

        /* Contact Form Section */
        .contact-section {
            padding: 6rem 1.5rem;
            background-color: rgba(249, 250, 251, 0.5);
        }
        @media (min-width: 768px) { .contact-section { padding: 6rem 3rem; } }
        .contact-container-inner { max-width: 80rem; margin: 0 auto; }
        .contact-grid { display: grid; grid-template-columns: 1fr; gap: 4rem; align-items: flex-start; }
        @media (min-width: 1024px) { .contact-grid { grid-template-columns: repeat(2, 1fr); } }
        
        .contact-header { font-size: 2.25rem; font-weight: 800; color: var(--primary); margin-bottom: 2rem; line-height: 1.2; letter-spacing: -0.025em; }
        @media (min-width: 768px) { .contact-header { font-size: 3rem; } }
        .contact-desc { font-size: 1.125rem; color: var(--text-dark); line-height: 1.625; margin-bottom: 2.5rem; }
        
        .feature-items { display: flex; flex-direction: column; gap: 1rem; }
        .feature-item {
            display: flex; align-items: center; gap: 1.5rem; padding: 1.5rem; background-color: white;
            border-radius: 0.75rem; border: 1px solid var(--gray-100); box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        }
        .feature-item-icon {
            width: 3.5rem; height: 3.5rem; border-radius: 0.5rem; background-color: var(--primary);
            display: flex; align-items: center; justify-content: center; color: var(--secondary); flex-shrink: 0;
        }
        .feature-item-title { font-weight: 700; color: var(--primary); font-size: 1.125rem; }
        .feature-item-desc { font-size: 0.875rem; color: var(--text-muted); }

        .form-card {
            background-color: var(--primary);
            padding: 2rem;
            border-radius: 1.5rem;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            border-top: 4px solid var(--secondary);
        }
        @media (min-width: 768px) { .form-card { padding: 3rem; } }
        .form-title { font-size: 1.5rem; font-weight: 700; color: white; margin-bottom: 0.5rem; }
        .form-desc { color: var(--text-muted); font-size: 0.875rem; margin-bottom: 2rem; }
        
        .form-fields { display: flex; flex-direction: column; gap: 1.25rem; }
        .form-row { display: grid; grid-template-columns: 1fr; gap: 1.25rem; }
        @media (min-width: 768px) { .form-row { grid-template-columns: repeat(2, 1fr); } }
        
        .form-label { display: block; font-size: 10px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.2em; margin-bottom: 0.5rem; }
        .form-input {
            width: 100%; background-color: white; border: 1px solid var(--border-light);
            border-radius: 0.75rem; padding: 1rem; color: var(--text-dark); transition: all 0.3s ease;
        }
        .form-input::placeholder { color: var(--text-muted); }
        .form-input:focus { outline: none; box-shadow: 0 0 0 1px var(--secondary); border-color: var(--secondary); }
        
        .form-submit {
            width: 100%; background-color: var(--secondary); color: var(--primary);
            padding: 1.25rem; border-radius: 0.75rem; font-weight: 900; text-transform: uppercase;
            letter-spacing: 0.15em; margin-top: 0.5rem; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
        }
        .form-submit:hover { background-color: white; box-shadow: 0 10px 15px -3px rgba(SECONDARY_RGB_PLACEHOLDER, 0.2); }

        /* Footer */
        .footer {
            background-color: var(--primary);
            color: white;
            padding: 4rem 1.5rem 2rem;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        @media (min-width: 768px) { .footer { padding: 4rem 3rem 2rem; } }
        .footer-grid {
            display: grid; grid-template-columns: 1fr; gap: 3rem; margin-bottom: 3rem; max-width: 80rem; margin-left: auto; margin-right: auto;
        }
        @media (min-width: 768px) { .footer-grid { grid-template-columns: repeat(4, 1fr); } }
        
        .footer-col-desc { color: var(--text-muted); font-size: 0.875rem; line-height: 1.625; margin-top: 1rem; }
        .footer-col-title { color: var(--secondary); font-weight: 700; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.1em; margin-bottom: 1.5rem; }
        
        .footer-links { display: flex; flex-direction: column; gap: 0.75rem; font-size: 0.875rem; color: var(--text-muted); }
        .footer-links a:hover { color: var(--secondary); transition: color 0.3s ease; }
        
        .footer-contact { display: flex; flex-direction: column; gap: 0.75rem; font-size: 0.875rem; color: var(--text-muted); }
        .footer-contact-item { display: flex; align-items: flex-start; gap: 0.75rem; }
        .footer-contact-icon { color: var(--secondary); font-size: 1.125rem; }
        
        .footer-social { display: flex; gap: 1rem; }
        .footer-social-link {
            width: 2.5rem; height: 2.5rem; border-radius: 9999px; background-color: rgba(255, 255, 255, 0.05);
            display: flex; align-items: center; justify-content: center; transition: all 0.3s ease;
        }
        .footer-social-link:hover { background-color: var(--secondary); color: var(--primary); }
        .footer-social-desc { margin-top: 1.5rem; font-size: 0.75rem; color: var(--text-muted); }
        
        .footer-bottom {
            padding-top: 2rem; border-top: 1px solid rgba(255, 255, 255, 0.05);
            display: flex; flex-direction: column; gap: 1rem; align-items: center; justify-content: space-between;
            font-size: 10px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.1em;
            max-width: 80rem; margin: 0 auto;
        }
        @media (min-width: 768px) { .footer-bottom { flex-direction: row; } }
        .footer-bottom-links { display: flex; gap: 1.5rem; }
        .footer-bottom-links a:hover { color: var(--secondary); transition: color 0.3s ease; }

        /* Modal */
        .modal-overlay {
            position: fixed; inset: 0; z-index: 100;
            background-color: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(4px);
            display: none; align-items: center; justify-content: center; padding: 1rem;
        }
        .modal-overlay.show { display: flex; }
        .modal-content {
            background-color: var(--primary);
            width: 100%; max-width: 32rem; border-radius: 1rem;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            border: 1px solid var(--outline-variant);
            overflow: hidden; position: relative;
        }
        .modal-close {
            position: absolute; top: 1rem; right: 1rem;
            color: rgba(255, 255, 255, 0.5); transition: color 0.3s ease; background: none; border: none; font-size: 1.5rem;
        }
        .modal-close:hover { color: var(--primary); }
        .modal-body { padding: 2rem; }
        @media (min-width: 768px) { .modal-body { padding: 3rem; } }
        .modal-header { text-align: center; margin-bottom: 2rem; }
        .modal-title { font-size: 1.5rem; font-weight: 700; color: white; margin-bottom: 0.5rem; }
        .modal-desc { font-size: 0.875rem; color: rgba(255, 255, 255, 0.7); }
        
        .modal-input {
            width: 100%; background-color: white; border: 1px solid var(--border-light);
            border-radius: 0.5rem; padding: 0.75rem; color: var(--text-dark); transition: all 0.3s ease;
        }
        .modal-input::placeholder { color: var(--text-muted); }
        .modal-input:focus { outline: none; box-shadow: 0 0 0 1px var(--primary); border-color: var(--primary); }
        
        .modal-btn {
            width: 100%; background-color: var(--primary); color: #ffffff;
            padding: 1rem; border-radius: 0.5rem; font-weight: 700; text-transform: uppercase;
            letter-spacing: 0.1em; margin-top: 1rem; box-shadow: 0 10px 15px -3px rgba(78, 222, 163, 0.2);
            transition: all 0.3s ease;
        }
        .modal-btn:hover { background-color: #ffffff; color: white; }
`;

export const healthcare06Html = `
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=Geist:wght@400;600;700;800&display=swap" rel="stylesheet"/>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

<!-- MainHeader -->
    <header class="main-header">
        <div class="logo-group">
            <div class="logo-title">LOGO_PLACEHOLDER</div>
        </div>
        <div class="contact-group">
            <div class="contact-icon-bg">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                </svg>
            </div>
            <div class="contact-text-sm">
                <p data-editable="true" class="contact-label">Inquiries</p>
                <p data-editable="true" class="contact-number">0761-8523-398</p>
            </div>
        </div>
    </header>

    <!-- HeroSection -->
    <section class="hero-section">
        <img data-editable-img="true" alt="Corporate strategy session" class="hero-bg-img" src="/assets/templates/healthcare/templates06/hero-image.png"/>
        <div class="hero-gradient"></div>
        
        <div class="container hero-content">
            <div class="max-w-2xl">
                <h1 data-editable="true" class="hero-title font-display-lg font-extrabold">
                    Your Trusted<br/>
                    <span data-editable="true" class="text-brand-emerald" style="color: var(--secondary)">Strategy Experts</span>
                </h1>
                <p data-editable="true" class="hero-desc font-body-md">
                    We provide high-end consulting services to help businesses navigate complex challenges and achieve sustainable growth in a rapidly evolving market.
                </p>
                
                <div class="hero-actions">
                    <button data-editable="true" class="btn-primary" onclick="document.getElementById('approach-modal').classList.add('show')">
                        Our Approach
                    </button>
                    <div class="hero-consult-btn">
                        <div class="hero-consult-icon">
                            <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                        </div>
                        <div>
                            <p data-editable="true" class="contact-label uppercase" style="font-size: 10px">Consult Today</p>
                            <p data-editable="true" class="font-bold" style="font-size: 0.875rem">0761-8523-398</p>
                        </div>
                    </div>
                </div>
                
                <div class="hero-stats">
                    <div>
                        <p data-editable="true" class="stat-value font-headline-lg">500+</p>
                        <p data-editable="true" class="stat-label">Clients Advised</p>
                    </div>
                    <div class="stat-divider">
                        <p data-editable="true" class="stat-value font-headline-lg">15+</p>
                        <p data-editable="true" class="stat-label">Years Excellence</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="feature-card-float">
            <div class="feature-img-wrapper" onclick="document.getElementById('approach-modal').classList.add('show')">
                <img data-editable-img="true" alt="Strategic analysis" class="feature-img" src="/assets/templates/healthcare/templates06/video.png"/>
                <div class="feature-play">
                    <div class="feature-play-icon">
                        <svg class="h-4 w-4" style="margin-left: 0.125rem" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M8 5v14l11-7z"></path></svg>
                    </div>
                </div>
            </div>
            <div>
                <h4 data-editable="true" class="feature-title">Our Collaborative Methodology</h4>
                <p data-editable="true" class="feature-desc">Discover how we partner with leadership teams to drive transformative results.</p>
            </div>
        </div>
    </section>

    <!-- FeatureCards -->
    <section class="features-section">
        <div class="features-grid">
            <div class="feature-box">
                <div class="feature-box-icon">
                    <svg class="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path>
                    </svg>
                </div>
                <h3 data-editable="true" class="feature-box-title">Strategic Growth</h3>
                <p data-editable="true" class="feature-box-desc">Scale your business with data-driven expansion frameworks.</p>
            </div>
            
            <div class="feature-box">
                <div class="feature-box-icon">
                    <svg class="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path>
                    </svg>
                </div>
                <h3 data-editable="true" class="feature-box-title">Operational Efficiency</h3>
                <p data-editable="true" class="feature-box-desc">Optimize internal processes for maximum resource utilization.</p>
            </div>
            
            <div class="feature-box">
                <div class="feature-box-icon">
                    <svg class="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path>
                    </svg>
                </div>
                <h3 data-editable="true" class="feature-box-title">Market Insights</h3>
                <p data-editable="true" class="feature-box-desc">Leverage advanced analytics to anticipate global industry trends.</p>
            </div>
            
            <div class="feature-box">
                <div class="feature-box-icon">
                    <svg class="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path>
                    </svg>
                </div>
                <h3 data-editable="true" class="feature-box-title">Sustainable Value</h3>
                <p data-editable="true" class="feature-box-desc">Build long-term resilience and profitability for your organization.</p>
            </div>
        </div>
    </section>

    <!-- AboutSection -->
    <section class="about-section">
        <div class="about-grid">
            <div class="about-img-wrapper">
                <div class="about-img-inner">
                    <img data-editable-img="true" alt="Modern boardroom" class="about-img" src="/assets/templates/healthcare/templates06/office.png"/>
                </div>
                <div class="about-badge">
                    <p data-editable="true" class="about-badge-val font-headline-lg">15+</p>
                    <p data-editable="true" class="about-badge-label">Years Of<br/>Excellence</p>
                </div>
            </div>
            
            <div>
                <h2 data-editable="true" class="about-title font-headline-lg">
                    Empowering Businesses With<br/>
                    <span data-editable="true" style="color: var(--secondary)">Trusted Expertise</span>
                </h2>
                <p data-editable="true" class="about-desc font-body-md">
                    DEWATT ADVISORY combines deep industry knowledge with innovative strategic thinking. We partner with CEOs and executive teams to navigate the complexities of digital transformation, market volatility, and operational restructuring.
                </p>
                
                <div class="about-list">
                    <div class="about-item">
                        <div class="about-item-icon">
                            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                                <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                            </svg>
                        </div>
                        <div>
                            <h4 data-editable="true" class="about-item-title">Our Vision</h4>
                            <p data-editable="true" class="about-item-desc">To be the catalyst for corporate innovation and global leadership excellence across every sector we serve.</p>
                        </div>
                    </div>
                    
                    <div class="about-item">
                        <div class="about-item-icon">
                            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                            </svg>
                        </div>
                        <div>
                            <h4 data-editable="true" class="about-item-title">Our Mission</h4>
                            <p data-editable="true" class="about-item-desc">Delivering measurable impact through bespoke strategic frameworks and actionable market intelligence.</p>
                        </div>
                    </div>
                </div>
                
                <button data-editable="true" class="btn-outline">Learn More</button>
            </div>
        </div>
    </section>

    <!-- ProjectsSection -->
    <section class="projects-section">
        <div class="container">
            <div class="projects-header">
                <div class="max-w-2xl">
                    <h2 data-editable="true" class="projects-title font-headline-lg">
                        Strategic Solutions Delivered<br/>
                        <span data-editable="true" style="color: var(--secondary)">With Precision.</span>
                    </h2>
                    <p data-editable="true" class="projects-desc font-body-md">
                        Explore our portfolio of successful transformations and leadership advisory cases across diverse industries.
                    </p>
                </div>
                <button data-editable="true" class="btn-outline" style="margin-top: 1.5rem">View Case Studies</button>
            </div>
            
            <div class="projects-grid">
                <!-- Project 1 -->
                <div class="project-card">
                    <img data-editable-img="true" alt="Global market entry presentation" class="project-img" src="/assets/templates/healthcare/templates06/Solutions-Delivered-01.png"/>
                    <div class="project-overlay"></div>
                    <div class="project-content">
                        <h4 data-editable="true" class="project-content-title">Global Market Entry</h4>
                        <p data-editable="true" class="project-content-desc">Navigating cross-border complexities for a Fortune 500 tech firm.</p>
                    </div>
                </div>
                
                <!-- Project 2 -->
                <div class="project-card">
                    <img data-editable-img="true" alt="Digital transformation dashboard" class="project-img" src="/assets/templates/healthcare/templates06/Solutions-Delivered-02.png"/>
                    <div class="project-overlay"></div>
                    <div class="project-content">
                        <h4 data-editable="true" class="project-content-title">Digital Transformation</h4>
                        <p data-editable="true" class="project-content-desc">Modernizing legacy infrastructure for a leading financial institution.</p>
                    </div>
                </div>
                
                <!-- Project 3 -->
                <div class="project-card">
                    <img data-editable-img="true" alt="Signing partnership agreement" class="project-img" src="/assets/templates/healthcare/templates06/Solutions-Delivered-03.png"/>
                    <div class="project-overlay"></div>
                    <div class="project-content">
                        <h4 data-editable="true" class="project-content-title">Operational Restructuring</h4>
                        <p data-editable="true" class="project-content-desc">Streamlining logistics and operations for global manufacturing efficiency.</p>
                    </div>
                </div>
                
                <!-- Project 4 -->
                <div class="project-card">
                    <img data-editable-img="true" alt="Executive coaching session" class="project-img" src="/assets/templates/healthcare/templates06/Solutions-Delivered-04.png"/>
                    <div class="project-overlay"></div>
                    <div class="project-content">
                        <h4 data-editable="true" class="project-content-title">Executive Leadership Coaching</h4>
                        <p data-editable="true" class="project-content-desc">Developing high-impact leadership for emerging C-suite executives.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- CTABanner -->
    <section class="cta-banner">
        <div class="cta-bg">
            <img data-editable-img="true" alt="Corporate background" class="cta-img" src="/assets/templates/healthcare/templates06/footer-image.png"/>
            <div class="cta-overlay"></div>
        </div>
        <div class="cta-content">
            <h2 data-editable="true" class="cta-title font-headline-lg">
                Expert Advice With<br/>
                <span data-editable="true" style="color: var(--secondary)" class="italic">Lasting Results.</span>
            </h2>
            <button data-editable="true" class="cta-btn">
                Start Your Transformation
            </button>
        </div>
    </section>

    <!-- Contact Section -->
    <section class="contact-section">
        <div class="contact-container-inner">
            <div class="contact-grid">
                <div class="max-w-xl">
                    <h2 data-editable="true" class="contact-header font-headline-lg">
                        Ready to Scale<br/>Your Business?
                    </h2>
                    <p data-editable="true" class="contact-desc font-body-md">
                        Schedule a confidential consultation with our senior advisory team. We specialize in navigating high-stakes challenges and engineering sustainable growth for market leaders.
                    </p>
                    
                    <div class="feature-items">
                        <div class="feature-item">
                            <div class="feature-item-icon">
                                <span data-editable="true" class="material-symbols-outlined text-3xl" style="font-size: 1.875rem">handshake</span>
                            </div>
                            <div>
                                <p data-editable="true" class="feature-item-title">Expert Consultation</p>
                                <p data-editable="true" class="feature-item-desc">Strategic alignment session with a senior partner</p>
                            </div>
                        </div>
                        
                        <div class="feature-item">
                            <div class="feature-item-icon">
                                <span data-editable="true" class="material-symbols-outlined text-3xl" style="font-size: 1.875rem">insights</span>
                            </div>
                            <div>
                                <p data-editable="true" class="feature-item-title">Custom Strategy</p>
                                <p data-editable="true" class="feature-item-desc">Bespoke roadmaps tailored to your industry dynamics</p>
                            </div>
                        </div>
                        
                        <div class="feature-item">
                            <div class="feature-item-icon">
                                <span data-editable="true" class="material-symbols-outlined text-3xl" style="font-size: 1.875rem">engineering</span>
                            </div>
                            <div>
                                <p data-editable="true" class="feature-item-title">Operational Excellence</p>
                                <p data-editable="true" class="feature-item-desc">Maximizing resource utilization and workflow efficiency</p>
                            </div>
                        </div>
                        
                        <div class="feature-item">
                            <div class="feature-item-icon">
                                <span data-editable="true" class="material-symbols-outlined text-3xl" style="font-size: 1.875rem">monitoring</span>
                            </div>
                            <div>
                                <p data-editable="true" class="feature-item-title">Market Intelligence</p>
                                <p data-editable="true" class="feature-item-desc">In-depth analytics to identify emerging industry opportunities</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="form-card">
                    <div style="margin-bottom: 2rem">
                        <h3 data-editable="true" class="form-title">Secure Your Session</h3>
                        <p data-editable="true" class="form-desc">Submit your details for a follow-up within 24 hours.</p>
                    </div>
                    
                    <form class="form-fields">
                        <div class="form-row">
                            <div>
                                <label class="form-label">Full Name</label>
                                <input class="form-input" placeholder="e.g. Alexander Pierce" type="text" name="name" id="name"/>
                            </div>
                            <div>
                                <label class="form-label">Professional Email</label>
                                <input class="form-input" placeholder="name@corporation.com" type="email" name="email_address" id="email_address"/>
                            </div>
                        </div>
                        <div>
                            <label class="form-label">Organization</label>
                            <input class="form-input" placeholder="Enter company name" type="text" name="organization" id="organization"/>
                        </div>
                        <div>
                            <label class="form-label">Primary Objective</label>
                            <select class="form-input appearance-none cursor-pointer" name="primary_objective" id="primary_objective">
                                <option value="">Select Interest Area</option>
                                <option value="growth">Strategic Expansion</option>
                                <option value="efficiency">Operational Excellence</option>
                                <option value="digital">Digital Maturity</option>
                                <option value="market">Market Intelligence</option>
                            </select>
                        </div>
                        <div>
                            <label class="form-label">Project Context</label>
                            <textarea class="form-input" placeholder="Briefly describe your current strategic goals..." rows="3"></textarea>
                        </div>
                        <button data-editable="true" class="form-submit" type="submit">
                            Request Consultation
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
        <div class="footer-grid">
            <div>
                <div class="logo-title">LOGO_PLACEHOLDER</div>
                <p data-editable="true" class="footer-col-desc font-body-md">
                    Leading strategic business consulting firm dedicated to empowering enterprises with data-driven insights and innovative growth frameworks.
                </p>
            </div>
            
            <div>
                <h4 data-editable="true" class="footer-col-title">Quick Links</h4>
                <ul class="footer-links">
                    <li data-editable="true"><a data-editable="true" href="javascript:void(0);">Home</a></li>
                    <li data-editable="true"><a data-editable="true" href="javascript:void(0);">Services</a></li>
                    <li data-editable="true"><a data-editable="true" href="javascript:void(0);">About Us</a></li>
                    <li data-editable="true"><a data-editable="true" href="javascript:void(0);">Insights</a></li>
                    <li data-editable="true"><a data-editable="true" href="javascript:void(0);">Contact</a></li>
                </ul>
            </div>
            
            <div>
                <h4 data-editable="true" class="footer-col-title">Contact Us</h4>
                <ul class="footer-contact">
                    <li data-editable="true" class="footer-contact-item">
                        <span data-editable="true" class="material-symbols-outlined footer-contact-icon">location_on</span>
                        <span data-editable="true">123 Strategy Ave, Suite 500<br/>London, UK EC1V 4PY</span>
                    </li>
                    <li data-editable="true" class="footer-contact-item">
                        <span data-editable="true" class="material-symbols-outlined footer-contact-icon">call</span>
                        <span data-editable="true">0761-8523-398</span>
                    </li>
                    <li data-editable="true" class="footer-contact-item">
                        <span data-editable="true" class="material-symbols-outlined footer-contact-icon">mail</span>
                        <span data-editable="true">contact@dewatt-advisory.com</span>
                    </li>
                </ul>
            </div>
            
            <div>
                <h4 data-editable="true" class="footer-col-title">Follow Us</h4>
                <div class="footer-social">
                    <a data-editable="true" class="footer-social-link" href="javascript:void(0);">
                        <span data-editable="true" class="material-symbols-outlined">share</span>
                    </a>
                    <a data-editable="true" class="footer-social-link" href="javascript:void(0);">
                        <span data-editable="true" class="material-symbols-outlined">public</span>
                    </a>
                    <a data-editable="true" class="footer-social-link" href="javascript:void(0);">
                        <span data-editable="true" class="material-symbols-outlined">chat</span>
                    </a>
                </div>
                <p data-editable="true" class="footer-social-desc">Stay updated with our latest industry insights.</p>
            </div>
        </div>
        
        <div class="footer-bottom">
            <p data-editable="true">© 2026 PROJECT_NAME_PLACEHOLDER. All Rights Reserved.</p>
            <div class="footer-bottom-links">
                <a data-editable="true" href="javascript:void(0);">Privacy Policy</a>
                <a data-editable="true" href="javascript:void(0);">Terms of Service</a>
            </div>
        </div>
    </footer>

    <!-- Modal -->
    <div class="modal-overlay" id="approach-modal">
        <div class="modal-content">
            <button data-editable="true" class="modal-close" onclick="document.getElementById('approach-modal').classList.remove('show')">
                <span data-editable="true" class="material-symbols-outlined">close</span>
            </button>
            <div class="modal-body">
                <div class="modal-header">
                    <h3 data-editable="true" class="modal-title font-display-lg">Unlock Our Methodology</h3>
                    <p data-editable="true" class="modal-desc">Submit your details to receive our full strategic approach framework.</p>
                </div>
                <form class="form-fields" onsubmit="event.preventDefault(); alert('Request received. We will contact you shortly.'); document.getElementById('approach-modal').classList.remove('show');">
                    <div>
                        <label class="form-label">Full Name</label>
                        <input class="modal-input" placeholder="John Doe" required="" type="text" name="name" id="name"/>
                    </div>
                    <div>
                        <label class="form-label">Work Email</label>
                        <input class="modal-input" placeholder="john@company.com" required="" type="email" name="email_address" id="email_address"/>
                    </div>
                    <div>
                        <label class="form-label">Company</label>
                        <input class="modal-input" placeholder="Enter your organization" required="" type="text" name="organization" id="organization"/>
                    </div>
                    <button data-editable="true" class="modal-btn" type="submit">
                        Get Started
                    </button>
                </form>
            </div>
        </div>
    </div>

<script>
window.onclick = function(event) {
            const modal = document.getElementById('approach-modal');
            if (event.target == modal) {
                modal.classList.remove('show');
            }
        }

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