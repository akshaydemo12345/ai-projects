// Auto-generated template — healthcare/templates04
// Generated: 2026-05-19T08:11:44.711Z
//
// Color Detection Result:
//   Primary   → was --gold (#c9a84c) → SECONDARY_COLOR_PLACEHOLDER / var(--primary)
//   Secondary → was --forest (PRIMARY_COLOR_PLACEHOLDER) → PRIMARY_COLOR_PLACEHOLDER / var(--secondary)
//
// In GrapesEditor these are replaced with the page's primaryColor/secondaryColor.

export const healthcare04Styles = `
:root {
            --primary: PRIMARY_COLOR_PLACEHOLDER;
            --secondary: SECONDARY_COLOR_PLACEHOLDER;
            --ink: #0a0a0a;
            --paper: #f7f4ef;
            --gold: SECONDARY_COLOR_PLACEHOLDER;
            --gold-light: #e8d5a3;
            --rust: PRIMARY_COLOR_PLACEHOLDER;
            --forest: PRIMARY_COLOR_PLACEHOLDER;
            --mist: #e8e4dc;
            --white: #ffffff;
            --font-display: 'Fraunces', Georgia, serif;
            --font-body: 'DM Sans', sans-serif;
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }

        body {
            font-family: var(--font-body);
            background: var(--paper);
            color: var(--ink);
            overflow-x: hidden;
        }

        /* ── NAV ── */
        header {
            position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
            background: rgba(247,244,239,0.96);
            backdrop-filter: blur(12px);
            border-bottom: 1px solid rgba(10,10,10,0.08);
        }
        nav {
            max-width: 1240px; margin: 0 auto;
            display: flex; justify-content: space-between; align-items: center;
            padding: 18px 32px;
        }
        .logo {
            font-family: var(--font-display);
            font-size: 22px; font-weight: 700;
            color: var(--ink); text-decoration: none;
            letter-spacing: -0.5px;
        }
        .logo span { color: var(--primary); }
        nav ul { list-style: none; display: flex; gap: 36px; align-items: center; }
        nav a { text-decoration: none; color: var(--ink); font-size: 15px; font-weight: 500; opacity: 0.7; transition: opacity 0.2s; }
        nav a:hover { opacity: 1; }
        .nav-cta {
            background: var(--ink); color: var(--paper) !important;
            padding: 10px 22px; border-radius: 4px; opacity: 1 !important;
            font-size: 14px !important; letter-spacing: 0.3px;
        }
        .nav-cta:hover { background: var(--secondary) !important; }
        .nav-toggle { display: none; background: none; border: none; font-size: 22px; cursor: pointer; }

        @media (max-width: 768px) {
            nav ul { display: none; position: absolute; top: 100%; left: 0; right: 0; flex-direction: column; gap: 0; background: var(--paper); border-bottom: 1px solid var(--mist); padding: 12px 0; }
            nav ul.open { display: flex; }
            nav ul li a { display: block; padding: 12px 32px; }
            .nav-toggle { display: block; }
        }

        /* ── SECTION BASE ── */
        section { width: 100%; }
        .container { max-width: 1240px; margin: 0 auto; padding: 0 32px; }

        /* ──────────────────────────────────────────
           SECTION 1: HERO — Cinematic editorial split
        ────────────────────────────────────────── */
        .hero {
            min-height: 100vh;
            display: grid;
            grid-template-columns: 1fr 1fr;
            padding-top: 72px;
        }
        .hero-left {
            background: var(--secondary);
            display: flex; flex-direction: column;
            justify-content: center;
            padding: 80px 64px 80px 80px;
            position: relative; overflow: hidden;
        }
        .hero-left::before {
            content: '';
            position: absolute; top: -60px; right: -60px;
            width: 300px; height: 300px;
            border: 1px solid rgba(SECONDARY_RGB_PLACEHOLDER,0.2);
            border-radius: 50%;
        }
        .hero-left::after {
            content: '';
            position: absolute; bottom: -80px; left: -80px;
            width: 400px; height: 400px;
            border: 1px solid rgba(SECONDARY_RGB_PLACEHOLDER,0.1);
            border-radius: 50%;
        }
        .hero-badge {
            display: inline-flex; align-items: center; gap: 8px;
            background: rgba(SECONDARY_RGB_PLACEHOLDER,0.15);
            border: 1px solid rgba(SECONDARY_RGB_PLACEHOLDER,0.3);
            color: var(--gold-light);
            padding: 6px 16px; border-radius: 2px;
            font-size: 12px; font-weight: 600; letter-spacing: 1.5px;
            text-transform: uppercase; margin-bottom: 32px;
            width: fit-content;
        }
        .hero-badge::before { content: '✦'; font-size: 10px; }
        .hero-left h1 {
            font-family: var(--font-display);
            font-size: clamp(42px, 4.5vw, 68px);
            font-weight: 900;
            line-height: 1.05;
            color: var(--white);
            margin-bottom: 28px;
            letter-spacing: -1.5px;
        }
        .hero-left h1 em {
            font-style: italic;
            color: var(--primary);
        }
        .hero-sub {
            font-size: 17px; line-height: 1.75;
            color: rgba(247,244,239,0.7);
            margin-bottom: 44px;
            max-width: 460px;
        }
        .hero-btns { display: flex; gap: 14px; flex-wrap: wrap; }
        .btn-gold {
            background: var(--primary); color: var(--ink);
            padding: 14px 32px; border-radius: 3px;
            font-weight: 600; font-size: 15px;
            text-decoration: none; border: none; cursor: pointer;
            transition: all 0.25s;
            font-family: var(--font-body);
        }
        .btn-gold:hover { background: #d4b05a; transform: translateY(-1px); }
        .btn-outline-white {
            background: transparent; color: var(--white);
            padding: 14px 32px; border-radius: 3px;
            font-weight: 500; font-size: 15px;
            text-decoration: none; border: 1px solid rgba(255,255,255,0.25); cursor: pointer;
            transition: all 0.25s;
            font-family: var(--font-body);
        }
        .btn-outline-white:hover { border-color: rgba(255,255,255,0.6); background: rgba(255,255,255,0.05); }

        .hero-right {
            background: var(--paper);
            display: flex; flex-direction: column;
            justify-content: center; align-items: flex-start;
            padding: 80px 80px 80px 64px;
        }
        .hero-years {
            font-family: var(--font-display);
            font-size: clamp(100px, 12vw, 160px);
            font-weight: 900;
            line-height: 0.85;
            color: var(--mist);
            letter-spacing: -6px;
            margin-bottom: -20px;
            position: relative; z-index: 0;
        }
        .hero-years-label {
            font-family: var(--font-display);
            font-size: 28px; font-weight: 700;
            color: var(--ink); letter-spacing: -0.5px;
            position: relative; z-index: 1;
            margin-bottom: 32px;
        }
        .hero-years-label span { color: var(--primary); }
        .hero-metrics {
            display: grid; grid-template-columns: 1fr 1fr;
            gap: 24px; width: 100%; margin-bottom: 40px;
        }
        .metric {
            border-left: 3px solid var(--primary);
            padding-left: 16px;
        }
        .metric-num {
            font-family: var(--font-display);
            font-size: 36px; font-weight: 900;
            color: var(--ink); line-height: 1;
            margin-bottom: 4px;
        }
        .metric-label { font-size: 13px; color: #666; font-weight: 500; }

        .hero-form-wrap {
            background: var(--white);
            border: 1px solid var(--mist);
            border-radius: 6px; padding: 28px;
            width: 100%; max-width: 400px;
        }
        .hero-form-wrap h3 {
            font-family: var(--font-display);
            font-size: 20px; font-weight: 700;
            margin-bottom: 20px; color: var(--ink);
        }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .form-group { margin-bottom: 14px; }
        .form-group label { display: block; font-size: 12px; font-weight: 600; margin-bottom: 5px; color: #555; letter-spacing: 0.3px; }
        .form-group input, .form-group select {
            width: 100%; padding: 10px 14px;
            border: 1.5px solid #e0dcd4; border-radius: 3px;
            font-family: var(--font-body); font-size: 14px;
            background: var(--paper); color: var(--ink);
            transition: border-color 0.2s;
        }
        .form-group input:focus, .form-group select:focus {
            outline: none; border-color: var(--primary);
        }
        .form-group input.error { border-color: var(--rust); }
        .form-error { color: var(--rust); font-size: 12px; margin-top: 4px; display: none; }
        .btn-submit {
            width: 100%; background: var(--ink); color: var(--white);
            padding: 13px; border: none; border-radius: 3px;
            font-family: var(--font-body); font-size: 15px; font-weight: 600;
            cursor: pointer; transition: all 0.25s; margin-top: 4px;
        }
        .btn-submit:hover { background: var(--secondary); }
        .form-note { font-size: 12px; color: #888; margin-top: 10px; text-align: center; }

        @media (max-width: 1024px) {
            .hero { grid-template-columns: 1fr; }
            .hero-left { padding: 80px 32px 60px; }
            .hero-right { padding: 60px 32px 80px; }
            .hero-years { font-size: 100px; }
        }
        @media (max-width: 600px) {
            .hero-left { padding: 60px 20px 48px; }
            .hero-right { padding: 40px 20px 60px; }
            .form-row { grid-template-columns: 1fr; }
        }

        /* ──────────────────────────────────────────
           SECTION 2: TRUST — Horizontal marquee ticker
        ────────────────────────────────────────── */
        .trust-section {
            background: var(--ink);
            padding: 28px 0;
            overflow: hidden;
            position: relative;
        }
        .trust-section::before {
            content: '';
            position: absolute; left: 0; top: 0; bottom: 0;
            width: 80px;
            background: linear-gradient(90deg, var(--ink), transparent);
            z-index: 2;
        }
        .trust-section::after {
            content: '';
            position: absolute; right: 0; top: 0; bottom: 0;
            width: 80px;
            background: linear-gradient(-90deg, var(--ink), transparent);
            z-index: 2;
        }
        .trust-track {
            display: flex; gap: 0;
            animation: marquee 30s linear infinite;
            width: max-content;
        }
        .trust-section:hover .trust-track { animation-play-state: paused; }
        @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
        }
        .trust-item {
            display: flex; align-items: center; gap: 10px;
            padding: 0 48px;
            white-space: nowrap;
            border-right: 1px solid rgba(255,255,255,0.08);
        }
        .trust-item .t-icon { font-size: 18px; }
        .trust-item .t-name {
            font-size: 14px; font-weight: 600; color: rgba(255,255,255,0.5);
            letter-spacing: 0.5px;
        }
        .trust-item .t-rating {
            font-size: 12px; color: var(--primary);
            margin-left: 4px;
        }

        /* ──────────────────────────────────────────
           SECTION 3: STATS — Dramatic editorial numbers
        ────────────────────────────────────────── */
        .stats-section {
            background: var(--secondary);
            position: relative;
            overflow: hidden;
        }
        .stats-bg-text {
            position: absolute;
            font-family: var(--font-display);
            font-size: 280px; font-weight: 900;
            color: rgba(255,255,255,0.03);
            top: 50%; left: 50%;
            transform: translate(-50%, -50%);
            white-space: nowrap; letter-spacing: -10px;
            pointer-events: none; user-select: none;
        }
        .stats-inner {
            position: relative; z-index: 1;
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            divide-x: 1px solid rgba(255,255,255,0.1);
        }
        .stat-block {
            padding: 80px 40px;
            border-right: 1px solid rgba(255,255,255,0.08);
            text-align: center;
            position: relative;
            transition: background 0.4s;
        }
        .stat-block:last-child { border-right: none; }
        .stat-block:hover { background: rgba(255,255,255,0.03); }
        .stat-num {
            font-family: var(--font-display);
            font-size: clamp(52px, 5vw, 80px);
            font-weight: 900;
            color: var(--white);
            line-height: 1;
            margin-bottom: 8px;
            letter-spacing: -2px;
        }
        .stat-num span { color: var(--primary); }
        .stat-divider {
            width: 32px; height: 2px;
            background: var(--primary);
            margin: 12px auto 14px;
        }
        .stat-label {
            font-size: 14px; font-weight: 500;
            color: rgba(247,244,239,0.55);
            letter-spacing: 0.5px;
            line-height: 1.4;
        }

        @media (max-width: 900px) {
            .stats-inner { grid-template-columns: repeat(2,1fr); }
            .stat-block:nth-child(2) { border-right: none; }
            .stat-block:nth-child(3) { border-right: 1px solid rgba(255,255,255,0.08); }
            .stat-block:nth-child(3), .stat-block:nth-child(4) { border-top: 1px solid rgba(255,255,255,0.08); }
        }
        @media (max-width: 500px) {
            .stats-inner { grid-template-columns: 1fr; }
            .stat-block { border-right: none !important; border-top: 1px solid rgba(255,255,255,0.08); }
            .stat-block:first-child { border-top: none; }
            .stat-block { padding: 48px 32px; }
        }

        /* ──────────────────────────────────────────
           SECTION 4: ABOUT — Asymmetric storytelling
        ────────────────────────────────────────── */
        .about-section { padding: 120px 0; background: var(--paper); }
        .about-grid {
            display: grid;
            grid-template-columns: 1.2fr 1fr;
            gap: 80px;
            align-items: center;
        }
        .about-label {
            font-size: 11px; font-weight: 700; letter-spacing: 2.5px;
            text-transform: uppercase; color: var(--primary);
            margin-bottom: 20px;
        }
        .about-heading {
            font-family: var(--font-display);
            font-size: clamp(36px, 4vw, 52px);
            font-weight: 900; line-height: 1.1;
            color: var(--ink); letter-spacing: -1.5px;
            margin-bottom: 28px;
        }
        .about-heading em { font-style: italic; color: var(--primary); }
        .about-body { font-size: 17px; line-height: 1.8; color: #4a4540; margin-bottom: 20px; }
        .about-signature {
            font-family: var(--font-display);
            font-size: 24px; font-style: italic;
            color: var(--ink); margin-top: 32px;
            border-top: 1px solid var(--mist);
            padding-top: 20px;
        }
        .about-signature span { font-size: 13px; font-style: normal; font-family: var(--font-body); color: #888; display: block; margin-top: 4px; }

        .about-visual {
            position: relative;
        }
        .about-card-main {
            background: var(--secondary);
            border-radius: 8px;
            padding: 48px 40px;
            color: var(--white);
            position: relative; overflow: hidden;
        }
        .about-card-main::before {
            content: '"';
            font-family: var(--font-display);
            font-size: 180px; font-weight: 900;
            color: rgba(SECONDARY_RGB_PLACEHOLDER,0.12);
            position: absolute; top: -20px; right: 20px;
            line-height: 1;
        }
        .about-card-main blockquote {
            font-family: var(--font-display);
            font-size: 22px; font-style: italic; font-weight: 300;
            line-height: 1.6; color: rgba(247,244,239,0.9);
            position: relative; z-index: 1;
            margin-bottom: 24px;
        }
        .about-card-footer { display: flex; align-items: center; gap: 16px; }
        .client-avatar {
            width: 48px; height: 48px; border-radius: 50%;
            background: var(--primary); display: flex; align-items: center; justify-content: center;
            font-weight: 700; font-size: 16px; color: var(--ink); flex-shrink: 0;
        }
        .client-info .name { font-weight: 600; font-size: 15px; }
        .client-info .role { font-size: 13px; opacity: 0.6; }

        .about-card-mini {
            background: var(--white); border: 1px solid var(--mist);
            border-radius: 6px; padding: 24px;
            margin-top: 16px;
            display: flex; align-items: center; gap: 20px;
        }
        .mini-icon { font-size: 36px; }
        .mini-text .num { font-family: var(--font-display); font-size: 28px; font-weight: 900; color: var(--ink); }
        .mini-text .desc { font-size: 13px; color: #777; }

        @media (max-width: 900px) {
            .about-grid { grid-template-columns: 1fr; gap: 48px; }
        }

        /* ──────────────────────────────────────────
           SECTION 5: SERVICES — Staggered timeline layout
        ────────────────────────────────────────── */
        .services-section {
            background: var(--mist);
            padding: 120px 0;
        }
        .section-header {
            text-align: center; margin-bottom: 72px;
        }
        .section-label {
            font-size: 11px; font-weight: 700; letter-spacing: 2.5px;
            text-transform: uppercase; color: var(--primary);
            margin-bottom: 14px;
        }
        .section-title {
            font-family: var(--font-display);
            font-size: clamp(36px, 4vw, 52px);
            font-weight: 900; line-height: 1.1;
            color: var(--ink); letter-spacing: -1.5px;
        }
        .section-title em { font-style: italic; color: var(--primary); }

        .services-timeline {
            display: flex; flex-direction: column;
            gap: 0;
            position: relative;
        }
        .services-timeline::before {
            content: '';
            position: absolute; left: 50%; top: 0; bottom: 0;
            width: 1px; background: linear-gradient(to bottom, transparent, var(--gold-light) 10%, var(--gold-light) 90%, transparent);
            transform: translateX(-50%);
        }
        .service-row {
            display: grid;
            grid-template-columns: 1fr 80px 1fr;
            align-items: center;
            gap: 0;
            margin-bottom: 0;
            padding: 48px 0;
        }
        .service-row:not(:last-child) { border-bottom: 1px solid rgba(0,0,0,0.06); }

        /* Odd rows: content left, empty right */
        .service-row:nth-child(odd) .svc-content { order: 1; text-align: right; padding-right: 48px; }
        .service-row:nth-child(odd) .svc-node { order: 2; }
        .service-row:nth-child(odd) .svc-empty { order: 3; padding-left: 48px; }

        /* Even rows: empty left, content right */
        .service-row:nth-child(even) .svc-empty { order: 1; padding-right: 48px; }
        .service-row:nth-child(even) .svc-node { order: 2; }
        .service-row:nth-child(even) .svc-content { order: 3; text-align: left; padding-left: 48px; }

        .svc-node {
            display: flex; align-items: center; justify-content: center;
            flex-direction: column; gap: 8px;
        }
        .svc-dot {
            width: 52px; height: 52px; border-radius: 50%;
            background: var(--white); border: 2px solid var(--primary);
            display: flex; align-items: center; justify-content: center;
            font-size: 22px;
            box-shadow: 0 0 0 8px rgba(SECONDARY_RGB_PLACEHOLDER,0.08);
            transition: all 0.3s; cursor: default;
        }
        .service-row:hover .svc-dot {
            background: var(--primary); border-color: var(--primary);
            transform: scale(1.1);
        }

        .svc-content h3 {
            font-family: var(--font-display);
            font-size: 24px; font-weight: 700;
            color: var(--ink); margin-bottom: 10px;
            letter-spacing: -0.5px;
        }
        .svc-content p { font-size: 15px; line-height: 1.7; color: #5a5450; }
        .svc-tag {
            display: inline-block; margin-top: 12px;
            font-size: 11px; font-weight: 700; letter-spacing: 1.5px;
            text-transform: uppercase;
            color: var(--primary); border: 1px solid rgba(SECONDARY_RGB_PLACEHOLDER,0.4);
            padding: 3px 10px; border-radius: 2px;
        }
        .svc-empty { opacity: 0; }

        @media (max-width: 768px) {
            .services-timeline::before { left: 24px; }
            .service-row {
                grid-template-columns: 48px 1fr; gap: 20px;
                padding: 32px 0;
            }
            .service-row:nth-child(odd) .svc-content,
            .service-row:nth-child(even) .svc-content { order: 2; text-align: left; padding: 0; }
            .service-row:nth-child(odd) .svc-node,
            .service-row:nth-child(even) .svc-node { order: 1; }
            .svc-empty { display: none; }
            .svc-dot { width: 40px; height: 40px; font-size: 18px; }
        }

        /* ──────────────────────────────────────────
           SECTION 6: PROCESS — Horizontal numbered steps
        ────────────────────────────────────────── */
        .process-section { background: var(--white); padding: 100px 0; }
        .process-steps {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            position: relative;
            margin-top: 60px;
        }
        .process-steps::before {
            content: '';
            position: absolute; top: 28px; left: 10%; right: 10%;
            height: 1px; background: var(--mist);
            z-index: 0;
        }
        .process-step {
            text-align: center; padding: 0 20px;
            position: relative; z-index: 1;
        }
        .step-circle {
            width: 56px; height: 56px; border-radius: 50%;
            background: var(--paper); border: 1.5px solid var(--gold-light);
            display: flex; align-items: center; justify-content: center;
            margin: 0 auto 24px;
            font-family: var(--font-display);
            font-size: 18px; font-weight: 900; color: var(--primary);
            transition: all 0.3s;
        }
        .process-step:hover .step-circle {
            background: var(--secondary); border-color: var(--secondary);
            color: var(--white); transform: scale(1.1);
        }
        .step-title { font-family: var(--font-display); font-size: 18px; font-weight: 700; margin-bottom: 10px; }
        .step-desc { font-size: 14px; color: #6a6460; line-height: 1.6; }

        @media (max-width: 768px) {
            .process-steps { grid-template-columns: 1fr 1fr; gap: 40px; }
            .process-steps::before { display: none; }
        }
        @media (max-width: 480px) {
            .process-steps { grid-template-columns: 1fr; }
        }

        /* ──────────────────────────────────────────
           SECTION 7: TESTIMONIALS — Stacked magazine layout
        ────────────────────────────────────────── */
        .testimonials-section { background: var(--secondary); padding: 120px 0; }
        .testimonials-section .section-title { color: var(--white); }
        .testimonials-section .section-label { color: var(--primary); }

        .testimonials-layout {
            display: grid;
            grid-template-columns: 1.4fr 1fr;
            grid-template-rows: auto auto;
            gap: 24px;
            margin-top: 60px;
        }
        .testi-featured {
            grid-row: 1 / 3;
            background: rgba(255,255,255,0.04);
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 8px; padding: 52px 48px;
            display: flex; flex-direction: column;
            justify-content: space-between;
        }
        .testi-card {
            background: rgba(255,255,255,0.04);
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 8px; padding: 36px 32px;
        }
        .testi-stars { color: var(--primary); font-size: 16px; letter-spacing: 3px; margin-bottom: 20px; }
        .testi-quote {
            font-family: var(--font-display);
            font-style: italic; font-weight: 300;
            color: rgba(247,244,239,0.88);
            line-height: 1.65; margin-bottom: 28px;
        }
        .testi-featured .testi-quote { font-size: 22px; }
        .testi-card .testi-quote { font-size: 17px; }
        .testi-author { display: flex; align-items: center; gap: 14px; }
        .testi-av {
            width: 44px; height: 44px; border-radius: 50%;
            background: var(--primary); color: var(--ink);
            display: flex; align-items: center; justify-content: center;
            font-weight: 700; font-size: 15px; flex-shrink: 0;
        }
        .testi-name { font-weight: 600; font-size: 15px; color: var(--white); }
        .testi-role { font-size: 12px; color: rgba(247,244,239,0.45); margin-top: 2px; }
        .testi-outcome {
            display: inline-block; margin-top: 20px;
            background: rgba(SECONDARY_RGB_PLACEHOLDER,0.15); border: 1px solid rgba(SECONDARY_RGB_PLACEHOLDER,0.3);
            color: var(--gold-light); padding: 6px 14px; border-radius: 2px;
            font-size: 13px; font-weight: 600;
        }

        @media (max-width: 900px) {
            .testimonials-layout { grid-template-columns: 1fr; grid-template-rows: auto; }
            .testi-featured { grid-row: auto; }
        }

        /* ──────────────────────────────────────────
           SECTION 8: MID CTA — Bold dark interrupt
        ────────────────────────────────────────── */
        .mid-cta-section {
            background: var(--ink);
            padding: 100px 0;
            position: relative; overflow: hidden;
        }
        .mid-cta-section::before {
            content: 'GROW';
            position: absolute;
            font-family: var(--font-display);
            font-size: 280px; font-weight: 900;
            color: rgba(255,255,255,0.025);
            top: 50%; left: 50%;
            transform: translate(-50%, -50%);
            white-space: nowrap; pointer-events: none;
            letter-spacing: -10px;
        }
        .mid-cta-inner {
            display: grid;
            grid-template-columns: 1fr auto;
            gap: 60px; align-items: center;
            position: relative; z-index: 1;
        }
        .mid-cta-heading {
            font-family: var(--font-display);
            font-size: clamp(36px, 4.5vw, 58px);
            font-weight: 900; line-height: 1.08;
            color: var(--white); letter-spacing: -1.5px;
        }
        .mid-cta-heading em { font-style: italic; color: var(--primary); }
        .mid-cta-sub { font-size: 17px; color: rgba(255,255,255,0.55); margin-top: 16px; line-height: 1.6; }

        .mid-cta-form {
            background: var(--white); border-radius: 6px;
            padding: 32px; min-width: 340px;
        }
        .mid-cta-form h4 {
            font-family: var(--font-display);
            font-size: 20px; font-weight: 700; margin-bottom: 20px;
        }

        @media (max-width: 900px) {
            .mid-cta-inner { grid-template-columns: 1fr; }
            .mid-cta-form { min-width: unset; }
        }

        /* ──────────────────────────────────────────
           SECTION 9: FAQ — Clean accordion
        ────────────────────────────────────────── */
        .faq-section { background: var(--paper); padding: 100px 0; }
        .faq-layout {
            display: grid; grid-template-columns: 1fr 1.4fr;
            gap: 80px; align-items: start; margin-top: 0;
        }
        .faq-aside {
            position: sticky; top: 100px;
        }
        .faq-aside-title {
            font-family: var(--font-display);
            font-size: 42px; font-weight: 900;
            color: var(--ink); line-height: 1.15;
            letter-spacing: -1px; margin-bottom: 20px;
        }
        .faq-aside-title em { font-style: italic; color: var(--primary); }
        .faq-aside p { font-size: 16px; color: #6a6460; line-height: 1.7; }
        .faq-contact-btn {
            display: inline-block; margin-top: 28px;
            background: var(--secondary); color: var(--white);
            padding: 12px 28px; border-radius: 3px;
            font-size: 14px; font-weight: 600;
            text-decoration: none;
            transition: all 0.25s;
        }
        .faq-contact-btn:hover { background: var(--ink); }

        .faq-list { margin-top: 0; }
        .faq-item { border-bottom: 1px solid var(--mist); }
        .faq-trigger {
            display: flex; justify-content: space-between; align-items: center;
            padding: 22px 0; cursor: pointer;
            background: none; border: none; width: 100%; text-align: left;
            font-family: var(--font-body);
        }
        .faq-q { font-size: 16px; font-weight: 600; color: var(--ink); line-height: 1.4; padding-right: 20px; }
        .faq-icon {
            width: 28px; height: 28px; border-radius: 50%;
            background: var(--mist); display: flex; align-items: center; justify-content: center;
            flex-shrink: 0; font-size: 18px; color: var(--ink);
            transition: all 0.3s;
        }
        .faq-item.open .faq-icon { background: var(--primary); transform: rotate(45deg); }
        .faq-body {
            max-height: 0; overflow: hidden;
            transition: max-height 0.4s cubic-bezier(0.4,0,0.2,1), padding 0.3s;
        }
        .faq-item.open .faq-body { max-height: 300px; }
        .faq-ans {
            font-size: 15px; color: #5a5450;
            line-height: 1.75; padding-bottom: 20px;
        }

        @media (max-width: 900px) {
            .faq-layout { grid-template-columns: 1fr; gap: 48px; }
            .faq-aside { position: static; }
        }

        /* ──────────────────────────────────────────
           SECTION 10: FINAL CTA — Full-bleed with form
        ────────────────────────────────────────── */
        .final-cta {
            background: var(--primary);
            padding: 100px 0;
            position: relative; overflow: hidden;
        }
        .final-cta::before {
            content: '';
            position: absolute; bottom: -80px; right: -80px;
            width: 400px; height: 400px;
            border: 1px solid rgba(10,10,10,0.1);
            border-radius: 50%;
        }
        .final-cta::after {
            content: '';
            position: absolute; top: -60px; left: -60px;
            width: 300px; height: 300px;
            border: 1px solid rgba(10,10,10,0.08);
            border-radius: 50%;
        }
        .final-cta-inner {
            display: grid; grid-template-columns: 1fr 1fr;
            gap: 80px; align-items: center;
            position: relative; z-index: 1;
        }
        .final-cta h2 {
            font-family: var(--font-display);
            font-size: clamp(36px, 4vw, 54px);
            font-weight: 900; line-height: 1.1;
            color: var(--ink); letter-spacing: -1.5px;
            margin-bottom: 20px;
        }
        .final-cta-body { font-size: 17px; color: rgba(10,10,10,0.65); line-height: 1.7; }
        .final-cta-perks { list-style: none; margin-top: 28px; }
        .final-cta-perks li {
            display: flex; align-items: center; gap: 10px;
            font-size: 15px; font-weight: 500; color: var(--ink);
            margin-bottom: 12px;
        }
        .final-cta-perks li::before { content: '✓'; font-weight: 700; color: var(--secondary); font-size: 16px; }

        .final-form {
            background: var(--white); border-radius: 8px;
            padding: 40px; box-shadow: 0 24px 64px rgba(0,0,0,0.12);
        }
        .final-form h3 {
            font-family: var(--font-display);
            font-size: 22px; font-weight: 700; margin-bottom: 24px;
        }

        @media (max-width: 900px) {
            .final-cta-inner { grid-template-columns: 1fr; gap: 48px; }
        }

        /* ── FOOTER ── */
        footer {
            background: var(--ink); color: rgba(255,255,255,0.5);
            padding: 48px 0 32px;
        }
        .footer-inner {
            display: flex; justify-content: space-between; align-items: flex-start;
            flex-wrap: wrap; gap: 32px;
        }
        .footer-brand .logo { color: var(--white); }
        .footer-tagline { font-size: 13px; margin-top: 8px; }
        .footer-links { list-style: none; display: flex; gap: 24px; flex-wrap: wrap; margin-top: 4px; }
        .footer-links a { text-decoration: none; color: rgba(255,255,255,0.45); font-size: 14px; transition: color 0.2s; }
        .footer-links a:hover { color: var(--primary); }
        .footer-copy { margin-top: 32px; padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.08); font-size: 13px; text-align: center; }

        /* ── STICKY BOTTOM BAR ── */
        .sticky-bar {
            position: fixed; bottom: 0; left: 0; right: 0; z-index: 999;
            background: var(--secondary);
            padding: 14px 32px;
            display: flex; align-items: center; justify-content: space-between; gap: 16px;
            transform: translateY(100%);
            transition: transform 0.4s cubic-bezier(0.4,0,0.2,1);
            box-shadow: 0 -4px 32px rgba(0,0,0,0.3);
        }
        .sticky-bar.show { transform: translateY(0); }
        .sticky-bar p { font-size: 14px; font-weight: 500; color: rgba(255,255,255,0.8); }
        .sticky-bar p strong { color: var(--gold-light); }
        .sticky-bar-actions { display: flex; gap: 10px; align-items: center; }
        .sticky-close {
            background: none; border: none; color: rgba(255,255,255,0.4);
            font-size: 20px; cursor: pointer; padding: 0 4px; line-height: 1;
        }
        .sticky-close:hover { color: rgba(255,255,255,0.8); }

        /* ── MODAL ── */
        .modal-overlay {
            display: none; position: fixed; inset: 0; z-index: 2000;
            background: rgba(0,0,0,0.6); backdrop-filter: blur(4px);
            align-items: center; justify-content: center;
        }
        .modal-overlay.active { display: flex; }
        .modal-box {
            background: var(--white); border-radius: 10px;
            padding: 48px; max-width: 440px; width: 90%;
            text-align: center;
        }
        .modal-icon { font-size: 56px; margin-bottom: 20px; }
        .modal-box h2 { font-family: var(--font-display); font-size: 28px; font-weight: 900; margin-bottom: 12px; }
        .modal-box p { color: #666; line-height: 1.7; margin-bottom: 24px; }
        .modal-close-btn {
            background: var(--ink); color: var(--white);
            padding: 12px 32px; border-radius: 4px; border: none;
            font-family: var(--font-body); font-size: 15px; font-weight: 600;
            cursor: pointer;
        }

        /* Animations */
        .fade-up { opacity: 0; transform: translateY(30px); transition: opacity 0.7s ease, transform 0.7s ease; }
        .fade-up.visible { opacity: 1; transform: translateY(0); }
        .fade-up-2 { transition-delay: 0.15s; }
        .fade-up-3 { transition-delay: 0.3s; }
        .fade-up-4 { transition-delay: 0.45s; }
    
/* <html class="light"> */
/* ⚠ not converted: light */

/* <body class="bg-background text-on-background font-body-md selection:bg-accent-pink/30"> */
/* ⚠ not converted: bg-background text-on-background font-body-md selection:bg-accent-pink/30 */

/* <nav class="fixed top-0 w-full z-50 bg-surface-glass backdrop-blur-3xl border-b border-outline-variant/10"> */
.nav {
  position: fixed;
  top: 0px;
  width: 100%;
  z-index: 50;
}

/* ⚠ not converted: bg-surface-glass backdrop-blur-3xl border-b border-outline-variant/10 */

/* <div class="flex justify-between items-center w-full px-margin-desktop max-w-container-max mx-auto h-20"> */
.div {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  height: 5rem;
}

/* ⚠ not converted: px-margin-desktop max-w-container-max */

/* <div class="font-display-lg text-[24px] font-bold text-primary flex items-center gap-2"> */
.div-2 {
  color: 24px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* ⚠ not converted: font-display-lg text-primary */

/* <span class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white text-lg"> */
.span {
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 1.125rem;
}

/* ⚠ not converted: bg-primary */

/* <div class="hidden md:flex items-center gap-10"> */
.div-3 {
  display: none;
  align-items: center;
  gap: 2.5rem;
}

@media (min-width: 768px) {
  .div-3 {
    display: flex;
  }
}

/* <a class="text-primary font-semibold border-b-2 border-primary pb-1 font-label-sm uppercase tracking-wider"> */
.a {
  font-weight: 600;
  border-bottom-width: 2px;
  padding-bottom: 0.25rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* ⚠ not converted: text-primary border-primary font-label-sm */

/* <a class="text-secondary font-label-sm uppercase tracking-widest hover:text-primary transition-all duration-200"> */
.a-2 {
  text-transform: uppercase;
  letter-spacing: 0.1em;
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
  transition-duration: 200ms;
}

/* ⚠ not converted: text-secondary font-label-sm hover:text-primary */

/* <a class="text-secondary font-label-sm uppercase tracking-widest hover:text-primary transition-all duration-200"> */
.a-3 {
  text-transform: uppercase;
  letter-spacing: 0.1em;
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
  transition-duration: 200ms;
}

/* ⚠ not converted: text-secondary font-label-sm hover:text-primary */

/* <a class="text-secondary font-label-sm uppercase tracking-widest hover:text-primary transition-all duration-200"> */
.a-4 {
  text-transform: uppercase;
  letter-spacing: 0.1em;
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
  transition-duration: 200ms;
}

/* ⚠ not converted: text-secondary font-label-sm hover:text-primary */

/* <button class="bg-primary text-on-primary px-6 py-2.5 rounded-full font-label-sm font-bold hover:shadow-lg transition-all duration-300"> */
.button {
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  padding-top: 0.625rem;
  padding-bottom: 0.625rem;
  border-radius: 9999px;
  font-weight: 700;
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
  transition-duration: 300ms;
}

.button:hover {
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
}

/* ⚠ not converted: bg-primary text-on-primary font-label-sm */

/* <section class="relative min-h-screen flex flex-col items-center justify-center pt-40 pb-20 overflow-hidden hero-mesh"> */
.section {
  position: relative;
  min-height: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 10rem;
  padding-bottom: 5rem;
  overflow: hidden;
}

/* ⚠ not converted: hero-mesh */

/* <div class="absolute inset-0 z-0"> */
.div-4 {
  position: absolute;
  inset: 0px;
  z-index: 0;
}

/* <div class="absolute top-[10%] left-[-10%] w-[600px] h-[600px] bg-accent-pink rounded-full accent-blur"> */
.div-5 {
  position: absolute;
  top: 10%;
  left: -10%;
  width: 600px;
  height: 600px;
  border-radius: 9999px;
}

/* ⚠ not converted: bg-accent-pink accent-blur */

/* <div class="absolute top-[5%] right-[-5%] w-[500px] h-[500px] bg-accent-purple rounded-full accent-blur"> */
.div-6 {
  position: absolute;
  top: 5%;
  right: -5%;
  width: 500px;
  height: 500px;
  border-radius: 9999px;
}

/* ⚠ not converted: bg-accent-purple accent-blur */

/* <div class="relative z-10 max-w-5xl mx-auto px-margin-desktop text-center"> */
.div-7 {
  position: relative;
  z-index: 10;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
}

/* ⚠ not converted: max-w-5xl px-margin-desktop */

/* <div class="inline-flex items-center gap-2 bg-white/50 border border-white/80 px-4 py-2 rounded-full mb-8 shadow-sm"> */
.div-8 {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border-width: 1px;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  border-radius: 9999px;
  margin-bottom: 2rem;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
}

/* ⚠ not converted: bg-white/50 border-white/80 */

/* <span class="material-symbols-outlined text-accent-purple text-sm"> */
.span-2 {
  font-size: 0.875rem;
}

/* ⚠ not converted: material-symbols-outlined text-accent-purple */

/* <span class="font-label-sm text-primary uppercase tracking-wider"> */
.span-3 {
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* ⚠ not converted: font-label-sm text-primary */

/* <h1 class="font-display-lg text-display-lg mb-8 leading-[1.05]"> */
.h1 {
  margin-bottom: 2rem;
  line-height: 1.05;
}

/* ⚠ not converted: font-display-lg text-display-lg */

/* <span class="bg-clip-text text-transparent bg-gradient-to-r from-accent-purple via-accent-pink to-accent-orange"> */
.span-4 {
  color: transparent;
}

/* ⚠ not converted: bg-clip-text bg-gradient-to-r from-accent-purple via-accent-pink to-accent-orange */

/* <p class="font-body-lg text-body-lg text-secondary max-w-2xl mx-auto mb-12 leading-relaxed"> */
.p {
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 3rem;
  line-height: 1.625;
}

/* ⚠ not converted: font-body-lg text-body-lg text-secondary max-w-2xl */

/* <div class="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16"> */
.div-9 {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 4rem;
}

@media (min-width: 640px) {
  .div-9 {
    flex-direction: row;
  }
}

/* <button class="bg-primary text-on-primary px-10 py-5 rounded-full font-body-md font-bold hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"> */
.button-2 {
  padding-left: 2.5rem;
  padding-right: 2.5rem;
  padding-top: 1.25rem;
  padding-bottom: 1.25rem;
  border-radius: 9999px;
  font-weight: 700;
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
  transition-duration: 300ms;
}

.button-2:hover {
  box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
  transform: translateY(-0.25rem);
}

/* ⚠ not converted: bg-primary text-on-primary font-body-md transform */

/* <button class="flex items-center gap-2 font-bold font-body-md text-primary hover:gap-3 transition-all duration-200"> */
.button-3 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 700;
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
  transition-duration: 200ms;
}

.button-3:hover {
  gap: 0.75rem;
}

/* ⚠ not converted: font-body-md text-primary */

/* <span class="material-symbols-outlined"> */
/* ⚠ not converted: material-symbols-outlined */

/* <div class="pt-8 border-t border-outline-variant/20"> */
.div-10 {
  padding-top: 2rem;
}

/* ⚠ not converted: border-t border-outline-variant/20 */

/* <p class="font-label-sm text-secondary/60 uppercase tracking-[0.2em] mb-4"> */
.p-2 {
  text-transform: uppercase;
  letter-spacing: 0.2em;
  margin-bottom: 1rem;
}

/* ⚠ not converted: font-label-sm text-secondary/60 */

/* <div class="flex flex-wrap justify-center items-center gap-12 opacity-40 grayscale"> */
.div-11 {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 3rem;
  opacity: 0.4;
  filter: grayscale(100%);
}

/* <span class="font-bold text-2xl"> */
.span-6 {
  font-weight: 700;
  font-size: 1.5rem;
}

/* <span class="font-bold text-2xl"> */
.span-7 {
  font-weight: 700;
  font-size: 1.5rem;
}

/* <span class="font-bold text-2xl"> */
.span-8 {
  font-weight: 700;
  font-size: 1.5rem;
}

/* <span class="font-bold text-2xl"> */
.span-9 {
  font-weight: 700;
  font-size: 1.5rem;
}

/* <section class="py-section-gap-lg bg-surface-container-lowest"> */
/* ⚠ not converted: py-section-gap-lg bg-surface-container-lowest */

/* <div class="max-w-container-max mx-auto px-margin-desktop"> */
.div-12 {
  margin-left: auto;
  margin-right: auto;
}

/* ⚠ not converted: max-w-container-max px-margin-desktop */

/* <div class="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center"> */
.div-13 {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 6rem;
  align-items: center;
}

@media (min-width: 1024px) {
  .div-13 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

/* <div class="p-12 bg-surface-container-low rounded-[40px] border border-outline-variant/10"> */
.div-14 {
  padding: 3rem;
  border-radius: 40px;
  border-width: 1px;
}

/* ⚠ not converted: bg-surface-container-low border-outline-variant/10 */

/* <h2 class="font-headline-xl text-headline-xl mb-8"> */
.h2 {
  margin-bottom: 2rem;
}

/* ⚠ not converted: font-headline-xl text-headline-xl */

/* <ul class="space-y-6"> */
.ul {
  /* space-y: use > * + * { margin-top: 1.5rem } */;
}

/* <li class="flex items-start gap-4 text-secondary"> */
.li {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

/* ⚠ not converted: text-secondary */

/* <span class="material-symbols-outlined text-error mt-1"> */
.span-10 {
  margin-top: 0.25rem;
}

/* ⚠ not converted: material-symbols-outlined text-error */

/* <span class="font-body-lg"> */
/* ⚠ not converted: font-body-lg */

/* <li class="flex items-start gap-4 text-secondary"> */
.li-2 {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

/* ⚠ not converted: text-secondary */

/* <span class="material-symbols-outlined text-error mt-1"> */
.span-12 {
  margin-top: 0.25rem;
}

/* ⚠ not converted: material-symbols-outlined text-error */

/* <span class="font-body-lg"> */
/* ⚠ not converted: font-body-lg */

/* <li class="flex items-start gap-4 text-secondary"> */
.li-3 {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

/* ⚠ not converted: text-secondary */

/* <span class="material-symbols-outlined text-error mt-1"> */
.span-14 {
  margin-top: 0.25rem;
}

/* ⚠ not converted: material-symbols-outlined text-error */

/* <span class="font-body-lg"> */
/* ⚠ not converted: font-body-lg */

/* <li class="flex items-start gap-4 text-secondary"> */
.li-4 {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

/* ⚠ not converted: text-secondary */

/* <span class="material-symbols-outlined text-error mt-1"> */
.span-16 {
  margin-top: 0.25rem;
}

/* ⚠ not converted: material-symbols-outlined text-error */

/* <span class="font-body-lg"> */
/* ⚠ not converted: font-body-lg */

/* <div class="w-16 h-16 bg-accent-purple rounded-2xl flex items-center justify-center text-white mb-8"> */
.div-15 {
  width: 4rem;
  height: 4rem;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  margin-bottom: 2rem;
}

/* ⚠ not converted: bg-accent-purple */

/* <span class="material-symbols-outlined text-3xl"> */
.span-18 {
  font-size: 1.875rem;
}

/* ⚠ not converted: material-symbols-outlined */

/* <h2 class="font-headline-xl text-headline-xl mb-6"> */
.h2-2 {
  margin-bottom: 1.5rem;
}

/* ⚠ not converted: font-headline-xl text-headline-xl */

/* <p class="font-serif-accent text-serif-accent italic text-secondary mb-8"> */
.p-3 {
  font-style: italic;
  margin-bottom: 2rem;
}

/* ⚠ not converted: font-serif-accent text-serif-accent text-secondary */

/* <p class="font-body-lg text-body-lg text-secondary leading-relaxed"> */
.p-4 {
  line-height: 1.625;
}

/* ⚠ not converted: font-body-lg text-body-lg text-secondary */

/* <section class="py-section-gap-lg overflow-hidden"> */
.section-3 {
  overflow: hidden;
}

/* ⚠ not converted: py-section-gap-lg */

/* <div class="max-w-container-max mx-auto px-margin-desktop"> */
.div-16 {
  margin-left: auto;
  margin-right: auto;
}

/* ⚠ not converted: max-w-container-max px-margin-desktop */

/* <div class="text-center mb-24 max-w-3xl mx-auto"> */
.div-17 {
  text-align: center;
  margin-bottom: 6rem;
  margin-left: auto;
  margin-right: auto;
}

/* ⚠ not converted: max-w-3xl */

/* <h2 class="font-headline-xl text-headline-xl mb-6"> */
.h2-3 {
  margin-bottom: 1.5rem;
}

/* ⚠ not converted: font-headline-xl text-headline-xl */

/* <p class="font-body-lg text-body-lg text-secondary"> */
/* ⚠ not converted: font-body-lg text-body-lg text-secondary */

/* <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"> */
.div-18 {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 2rem;
}

@media (min-width: 768px) {
  .div-18 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .div-18 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

/* <div class="p-10 rounded-[32px] bg-white border border-outline-variant/10 hover:shadow-2xl transition-all duration-300 group"> */
.div-19 {
  padding: 2.5rem;
  border-radius: 32px;
  background-color: #ffffff;
  border-width: 1px;
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
  transition-duration: 300ms;
}

.div-19:hover {
  box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
}

/* ⚠ not converted: border-outline-variant/10 group */

/* <div class="w-14 h-14 bg-accent-pink/10 text-accent-pink rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform"> */
.div-20 {
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
  transform: scale(1.1);
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* ⚠ not converted: bg-accent-pink/10 text-accent-pink */

/* <span class="material-symbols-outlined text-3xl"> */
.span-19 {
  font-size: 1.875rem;
}

/* ⚠ not converted: material-symbols-outlined */

/* <h3 class="font-headline-lg text-2xl mb-4"> */
.h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

/* ⚠ not converted: font-headline-lg */

/* <p class="text-secondary leading-relaxed"> */
.p-6 {
  line-height: 1.625;
}

/* ⚠ not converted: text-secondary */

/* <div class="p-10 rounded-[32px] bg-white border border-outline-variant/10 hover:shadow-2xl transition-all duration-300 group"> */
.div-21 {
  padding: 2.5rem;
  border-radius: 32px;
  background-color: #ffffff;
  border-width: 1px;
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
  transition-duration: 300ms;
}

.div-21:hover {
  box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
}

/* ⚠ not converted: border-outline-variant/10 group */

/* <div class="w-14 h-14 bg-accent-purple/10 text-accent-purple rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform"> */
.div-22 {
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
  transform: scale(1.1);
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* ⚠ not converted: bg-accent-purple/10 text-accent-purple */

/* <span class="material-symbols-outlined text-3xl"> */
.span-20 {
  font-size: 1.875rem;
}

/* ⚠ not converted: material-symbols-outlined */

/* <h3 class="font-headline-lg text-2xl mb-4"> */
.h3-2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

/* ⚠ not converted: font-headline-lg */

/* <p class="text-secondary leading-relaxed"> */
.p-7 {
  line-height: 1.625;
}

/* ⚠ not converted: text-secondary */

/* <div class="p-10 rounded-[32px] bg-white border border-outline-variant/10 hover:shadow-2xl transition-all duration-300 group"> */
.div-23 {
  padding: 2.5rem;
  border-radius: 32px;
  background-color: #ffffff;
  border-width: 1px;
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
  transition-duration: 300ms;
}

.div-23:hover {
  box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
}

/* ⚠ not converted: border-outline-variant/10 group */

/* <div class="w-14 h-14 bg-accent-orange/10 text-accent-orange rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform"> */
.div-24 {
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
  transform: scale(1.1);
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* ⚠ not converted: bg-accent-orange/10 text-accent-orange */

/* <span class="material-symbols-outlined text-3xl"> */
.span-21 {
  font-size: 1.875rem;
}

/* ⚠ not converted: material-symbols-outlined */

/* <h3 class="font-headline-lg text-2xl mb-4"> */
.h3-3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

/* ⚠ not converted: font-headline-lg */

/* <p class="text-secondary leading-relaxed"> */
.p-8 {
  line-height: 1.625;
}

/* ⚠ not converted: text-secondary */

/* <div class="p-10 rounded-[32px] bg-white border border-outline-variant/10 hover:shadow-2xl transition-all duration-300 group"> */
.div-25 {
  padding: 2.5rem;
  border-radius: 32px;
  background-color: #ffffff;
  border-width: 1px;
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
  transition-duration: 300ms;
}

.div-25:hover {
  box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
}

/* ⚠ not converted: border-outline-variant/10 group */

/* <div class="w-14 h-14 bg-link-blue/10 text-link-blue rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform"> */
.div-26 {
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
  transform: scale(1.1);
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* ⚠ not converted: bg-link-blue/10 text-link-blue */

/* <span class="material-symbols-outlined text-3xl"> */
.span-22 {
  font-size: 1.875rem;
}

/* ⚠ not converted: material-symbols-outlined */

/* <h3 class="font-headline-lg text-2xl mb-4"> */
.h3-4 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

/* ⚠ not converted: font-headline-lg */

/* <p class="text-secondary leading-relaxed"> */
.p-9 {
  line-height: 1.625;
}

/* ⚠ not converted: text-secondary */

/* <div class="p-10 rounded-[32px] bg-white border border-outline-variant/10 hover:shadow-2xl transition-all duration-300 group"> */
.div-27 {
  padding: 2.5rem;
  border-radius: 32px;
  background-color: #ffffff;
  border-width: 1px;
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
  transition-duration: 300ms;
}

.div-27:hover {
  box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
}

/* ⚠ not converted: border-outline-variant/10 group */

/* <div class="w-14 h-14 bg-accent-purple/10 text-accent-purple rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform"> */
.div-28 {
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
  transform: scale(1.1);
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* ⚠ not converted: bg-accent-purple/10 text-accent-purple */

/* <span class="material-symbols-outlined text-3xl"> */
.span-23 {
  font-size: 1.875rem;
}

/* ⚠ not converted: material-symbols-outlined */

/* <h3 class="font-headline-lg text-2xl mb-4"> */
.h3-5 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

/* ⚠ not converted: font-headline-lg */

/* <p class="text-secondary leading-relaxed"> */
.p-10 {
  line-height: 1.625;
}

/* ⚠ not converted: text-secondary */

/* <div class="p-10 rounded-[32px] bg-white border border-outline-variant/10 hover:shadow-2xl transition-all duration-300 group"> */
.div-29 {
  padding: 2.5rem;
  border-radius: 32px;
  background-color: #ffffff;
  border-width: 1px;
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
  transition-duration: 300ms;
}

.div-29:hover {
  box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
}

/* ⚠ not converted: border-outline-variant/10 group */

/* <div class="w-14 h-14 bg-accent-pink/10 text-accent-pink rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform"> */
.div-30 {
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
  transform: scale(1.1);
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* ⚠ not converted: bg-accent-pink/10 text-accent-pink */

/* <span class="material-symbols-outlined text-3xl"> */
.span-24 {
  font-size: 1.875rem;
}

/* ⚠ not converted: material-symbols-outlined */

/* <h3 class="font-headline-lg text-2xl mb-4"> */
.h3-6 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

/* ⚠ not converted: font-headline-lg */

/* <p class="text-secondary leading-relaxed"> */
.p-11 {
  line-height: 1.625;
}

/* ⚠ not converted: text-secondary */

/* <section class="py-section-gap-lg bg-surface-container"> */
/* ⚠ not converted: py-section-gap-lg bg-surface-container */

/* <div class="max-w-container-max mx-auto px-margin-desktop"> */
.div-31 {
  margin-left: auto;
  margin-right: auto;
}

/* ⚠ not converted: max-w-container-max px-margin-desktop */

/* <div class="text-center mb-24"> */
.div-32 {
  text-align: center;
  margin-bottom: 6rem;
}

/* <h2 class="font-headline-xl text-headline-xl"> */
/* ⚠ not converted: font-headline-xl text-headline-xl */

/* <div class="grid grid-cols-1 md:grid-cols-3 gap-12 relative"> */
.div-33 {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 3rem;
  position: relative;
}

@media (min-width: 768px) {
  .div-33 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

/* <div class="hidden md:block absolute top-1/4 left-1/4 right-1/4 h-px bg-outline-variant/30"> */
.div-34 {
  display: none;
  position: absolute;
  top: 25%;
  left: 25%;
  right: 25%;
  height: 1px;
}

@media (min-width: 768px) {
  .div-34 {
    display: block;
  }
}

/* ⚠ not converted: bg-outline-variant/30 */

/* <div class="text-center relative"> */
.div-35 {
  text-align: center;
  position: relative;
}

/* <div class="w-20 h-20 bg-primary text-on-primary rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-8 shadow-xl relative z-10"> */
.div-36 {
  width: 5rem;
  height: 5rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 2rem;
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  position: relative;
  z-index: 10;
}

/* ⚠ not converted: bg-primary text-on-primary */

/* <h4 class="font-headline-lg text-2xl mb-4"> */
.h4 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

/* ⚠ not converted: font-headline-lg */

/* <p class="text-secondary"> */
/* ⚠ not converted: text-secondary */

/* <div class="text-center relative"> */
.div-37 {
  text-align: center;
  position: relative;
}

/* <div class="w-20 h-20 bg-primary text-on-primary rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-8 shadow-xl relative z-10"> */
.div-38 {
  width: 5rem;
  height: 5rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 2rem;
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  position: relative;
  z-index: 10;
}

/* ⚠ not converted: bg-primary text-on-primary */

/* <h4 class="font-headline-lg text-2xl mb-4"> */
.h4-2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

/* ⚠ not converted: font-headline-lg */

/* <p class="text-secondary"> */
/* ⚠ not converted: text-secondary */

/* <div class="text-center relative"> */
.div-39 {
  text-align: center;
  position: relative;
}

/* <div class="w-20 h-20 bg-primary text-on-primary rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-8 shadow-xl relative z-10"> */
.div-40 {
  width: 5rem;
  height: 5rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 2rem;
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  position: relative;
  z-index: 10;
}

/* ⚠ not converted: bg-primary text-on-primary */

/* <h4 class="font-headline-lg text-2xl mb-4"> */
.h4-3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

/* ⚠ not converted: font-headline-lg */

/* <p class="text-secondary"> */
/* ⚠ not converted: text-secondary */

/* <section class="py-section-gap-lg"> */
/* ⚠ not converted: py-section-gap-lg */

/* <div class="max-w-container-max mx-auto px-margin-desktop"> */
.div-41 {
  margin-left: auto;
  margin-right: auto;
}

/* ⚠ not converted: max-w-container-max px-margin-desktop */

/* <div class="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-20"> */
.div-42 {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 5rem;
  margin-bottom: 5rem;
}

@media (min-width: 1024px) {
  .div-42 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

/* <h2 class="font-headline-xl text-headline-xl"> */
/* ⚠ not converted: font-headline-xl text-headline-xl */

/* <p class="font-body-lg text-secondary lg:pt-4"> */
@media (min-width: 1024px) {
  .p-15 {
    padding-top: 1rem;
  }
}

/* ⚠ not converted: font-body-lg text-secondary */

/* <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"> */
.div-43 {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 2rem;
}

@media (min-width: 768px) {
  .div-43 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .div-43 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

/* <div class="p-8 border border-outline-variant/20 rounded-3xl hover:bg-white hover:shadow-lg transition-all"> */
.div-44 {
  padding: 2rem;
  border-width: 1px;
  border-radius: 1.5rem;
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.div-44:hover {
  background-color: #ffffff;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
}

/* ⚠ not converted: border-outline-variant/20 */

/* <h4 class="font-bold text-xl mb-4 flex items-center gap-2"> */
.h4-4 {
  font-weight: 700;
  font-size: 1.25rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* <span class="material-symbols-outlined text-accent-purple"> */
/* ⚠ not converted: material-symbols-outlined text-accent-purple */

/* <p class="text-secondary"> */
/* ⚠ not converted: text-secondary */

/* <div class="p-8 border border-outline-variant/20 rounded-3xl hover:bg-white hover:shadow-lg transition-all"> */
.div-45 {
  padding: 2rem;
  border-width: 1px;
  border-radius: 1.5rem;
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.div-45:hover {
  background-color: #ffffff;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
}

/* ⚠ not converted: border-outline-variant/20 */

/* <h4 class="font-bold text-xl mb-4 flex items-center gap-2"> */
.h4-5 {
  font-weight: 700;
  font-size: 1.25rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* <span class="material-symbols-outlined text-accent-pink"> */
/* ⚠ not converted: material-symbols-outlined text-accent-pink */

/* <p class="text-secondary"> */
/* ⚠ not converted: text-secondary */

/* <div class="p-8 border border-outline-variant/20 rounded-3xl hover:bg-white hover:shadow-lg transition-all"> */
.div-46 {
  padding: 2rem;
  border-width: 1px;
  border-radius: 1.5rem;
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.div-46:hover {
  background-color: #ffffff;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
}

/* ⚠ not converted: border-outline-variant/20 */

/* <h4 class="font-bold text-xl mb-4 flex items-center gap-2"> */
.h4-6 {
  font-weight: 700;
  font-size: 1.25rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* <span class="material-symbols-outlined text-accent-orange"> */
/* ⚠ not converted: material-symbols-outlined text-accent-orange */

/* <p class="text-secondary"> */
/* ⚠ not converted: text-secondary */

/* <div class="p-8 border border-outline-variant/20 rounded-3xl hover:bg-white hover:shadow-lg transition-all"> */
.div-47 {
  padding: 2rem;
  border-width: 1px;
  border-radius: 1.5rem;
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.div-47:hover {
  background-color: #ffffff;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
}

/* ⚠ not converted: border-outline-variant/20 */

/* <h4 class="font-bold text-xl mb-4 flex items-center gap-2"> */
.h4-7 {
  font-weight: 700;
  font-size: 1.25rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* <span class="material-symbols-outlined text-link-blue"> */
/* ⚠ not converted: material-symbols-outlined text-link-blue */

/* <p class="text-secondary"> */
/* ⚠ not converted: text-secondary */

/* <div class="p-8 border border-outline-variant/20 rounded-3xl hover:bg-white hover:shadow-lg transition-all"> */
.div-48 {
  padding: 2rem;
  border-width: 1px;
  border-radius: 1.5rem;
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.div-48:hover {
  background-color: #ffffff;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
}

/* ⚠ not converted: border-outline-variant/20 */

/* <h4 class="font-bold text-xl mb-4 flex items-center gap-2"> */
.h4-8 {
  font-weight: 700;
  font-size: 1.25rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* <span class="material-symbols-outlined text-accent-purple"> */
/* ⚠ not converted: material-symbols-outlined text-accent-purple */

/* <p class="text-secondary"> */
/* ⚠ not converted: text-secondary */

/* <section class="py-section-gap-lg bg-surface-container-highest"> */
/* ⚠ not converted: py-section-gap-lg bg-surface-container-highest */

/* <div class="max-w-container-max mx-auto px-margin-desktop"> */
.div-49 {
  margin-left: auto;
  margin-right: auto;
}

/* ⚠ not converted: max-w-container-max px-margin-desktop */

/* <div class="text-center mb-24"> */
.div-50 {
  text-align: center;
  margin-bottom: 6rem;
}

/* <h2 class="font-headline-xl text-headline-xl"> */
/* ⚠ not converted: font-headline-xl text-headline-xl */

/* <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16"> */
.div-51 {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  column-gap: 3rem;
  row-gap: 4rem;
}

@media (min-width: 768px) {
  .div-51 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .div-51 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

/* <div class="flex gap-6"> */
.div-52 {
  display: flex;
  gap: 1.5rem;
}

/* <span class="material-symbols-outlined text-3xl text-primary shrink-0"> */
.span-30 {
  font-size: 1.875rem;
  flex-shrink: 0;
}

/* ⚠ not converted: material-symbols-outlined text-primary */

/* <h4 class="font-bold text-xl mb-2"> */
.h4-9 {
  font-weight: 700;
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
}

/* <p class="text-secondary"> */
/* ⚠ not converted: text-secondary */

/* <div class="flex gap-6"> */
.div-53 {
  display: flex;
  gap: 1.5rem;
}

/* <span class="material-symbols-outlined text-3xl text-primary shrink-0"> */
.span-31 {
  font-size: 1.875rem;
  flex-shrink: 0;
}

/* ⚠ not converted: material-symbols-outlined text-primary */

/* <h4 class="font-bold text-xl mb-2"> */
.h4-10 {
  font-weight: 700;
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
}

/* <p class="text-secondary"> */
/* ⚠ not converted: text-secondary */

/* <div class="flex gap-6"> */
.div-54 {
  display: flex;
  gap: 1.5rem;
}

/* <span class="material-symbols-outlined text-3xl text-primary shrink-0"> */
.span-32 {
  font-size: 1.875rem;
  flex-shrink: 0;
}

/* ⚠ not converted: material-symbols-outlined text-primary */

/* <h4 class="font-bold text-xl mb-2"> */
.h4-11 {
  font-weight: 700;
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
}

/* <p class="text-secondary"> */
/* ⚠ not converted: text-secondary */

/* <div class="flex gap-6"> */
.div-55 {
  display: flex;
  gap: 1.5rem;
}

/* <span class="material-symbols-outlined text-3xl text-primary shrink-0"> */
.span-33 {
  font-size: 1.875rem;
  flex-shrink: 0;
}

/* ⚠ not converted: material-symbols-outlined text-primary */

/* <h4 class="font-bold text-xl mb-2"> */
.h4-12 {
  font-weight: 700;
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
}

/* <p class="text-secondary"> */
/* ⚠ not converted: text-secondary */

/* <div class="flex gap-6"> */
.div-56 {
  display: flex;
  gap: 1.5rem;
}

/* <span class="material-symbols-outlined text-3xl text-primary shrink-0"> */
.span-34 {
  font-size: 1.875rem;
  flex-shrink: 0;
}

/* ⚠ not converted: material-symbols-outlined text-primary */

/* <h4 class="font-bold text-xl mb-2"> */
.h4-13 {
  font-weight: 700;
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
}

/* <p class="text-secondary"> */
/* ⚠ not converted: text-secondary */

/* <div class="flex gap-6"> */
.div-57 {
  display: flex;
  gap: 1.5rem;
}

/* <span class="material-symbols-outlined text-3xl text-primary shrink-0"> */
.span-35 {
  font-size: 1.875rem;
  flex-shrink: 0;
}

/* ⚠ not converted: material-symbols-outlined text-primary */

/* <h4 class="font-bold text-xl mb-2"> */
.h4-14 {
  font-weight: 700;
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
}

/* <p class="text-secondary"> */
/* ⚠ not converted: text-secondary */

/* <section class="py-section-gap-lg"> */
/* ⚠ not converted: py-section-gap-lg */

/* <div class="max-w-container-max mx-auto px-margin-desktop"> */
.div-58 {
  margin-left: auto;
  margin-right: auto;
}

/* ⚠ not converted: max-w-container-max px-margin-desktop */

/* <div class="flex flex-col md:flex-row justify-between items-end mb-16 gap-8"> */
.div-59 {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 4rem;
  gap: 2rem;
}

@media (min-width: 768px) {
  .div-59 {
    flex-direction: row;
  }
}

/* <div class="max-w-2xl"> */
/* ⚠ not converted: max-w-2xl */

/* <h2 class="font-headline-xl text-headline-xl"> */
/* ⚠ not converted: font-headline-xl text-headline-xl */

/* <button class="border border-primary text-primary px-8 py-3 rounded-full font-bold hover:bg-primary hover:text-on-primary transition-all"> */
.button-4 {
  border-width: 1px;
  padding-left: 2rem;
  padding-right: 2rem;
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
  border-radius: 9999px;
  font-weight: 700;
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* ⚠ not converted: border-primary text-primary hover:bg-primary hover:text-on-primary */

/* <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6"> */
.div-61 {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.5rem;
}

@media (min-width: 640px) {
  .div-61 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .div-61 {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

/* <div class="bg-surface-container-low p-8 rounded-3xl hover:bg-accent-purple/10 transition-colors group cursor-pointer text-center"> */
.div-62 {
  padding: 2rem;
  border-radius: 1.5rem;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
  cursor: pointer;
  text-align: center;
}

/* ⚠ not converted: bg-surface-container-low hover:bg-accent-purple/10 group */

/* <h4 class="font-bold group-hover:text-accent-purple transition-colors"> */
.h4-15 {
  font-weight: 700;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* ⚠ not converted: group-hover:text-accent-purple */

/* <div class="bg-surface-container-low p-8 rounded-3xl hover:bg-accent-purple/10 transition-colors group cursor-pointer text-center"> */
.div-63 {
  padding: 2rem;
  border-radius: 1.5rem;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
  cursor: pointer;
  text-align: center;
}

/* ⚠ not converted: bg-surface-container-low hover:bg-accent-purple/10 group */

/* <h4 class="font-bold group-hover:text-accent-purple transition-colors"> */
.h4-16 {
  font-weight: 700;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* ⚠ not converted: group-hover:text-accent-purple */

/* <div class="bg-surface-container-low p-8 rounded-3xl hover:bg-accent-purple/10 transition-colors group cursor-pointer text-center"> */
.div-64 {
  padding: 2rem;
  border-radius: 1.5rem;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
  cursor: pointer;
  text-align: center;
}

/* ⚠ not converted: bg-surface-container-low hover:bg-accent-purple/10 group */

/* <h4 class="font-bold group-hover:text-accent-purple transition-colors"> */
.h4-17 {
  font-weight: 700;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* ⚠ not converted: group-hover:text-accent-purple */

/* <div class="bg-surface-container-low p-8 rounded-3xl hover:bg-accent-purple/10 transition-colors group cursor-pointer text-center"> */
.div-65 {
  padding: 2rem;
  border-radius: 1.5rem;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
  cursor: pointer;
  text-align: center;
}

/* ⚠ not converted: bg-surface-container-low hover:bg-accent-purple/10 group */

/* <h4 class="font-bold group-hover:text-accent-purple transition-colors"> */
.h4-18 {
  font-weight: 700;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* ⚠ not converted: group-hover:text-accent-purple */

/* <div class="bg-surface-container-low p-8 rounded-3xl hover:bg-accent-purple/10 transition-colors group cursor-pointer text-center"> */
.div-66 {
  padding: 2rem;
  border-radius: 1.5rem;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
  cursor: pointer;
  text-align: center;
}

/* ⚠ not converted: bg-surface-container-low hover:bg-accent-purple/10 group */

/* <h4 class="font-bold group-hover:text-accent-purple transition-colors"> */
.h4-19 {
  font-weight: 700;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* ⚠ not converted: group-hover:text-accent-purple */

/* <div class="bg-surface-container-low p-8 rounded-3xl hover:bg-accent-purple/10 transition-colors group cursor-pointer text-center"> */
.div-67 {
  padding: 2rem;
  border-radius: 1.5rem;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
  cursor: pointer;
  text-align: center;
}

/* ⚠ not converted: bg-surface-container-low hover:bg-accent-purple/10 group */

/* <h4 class="font-bold group-hover:text-accent-purple transition-colors"> */
.h4-20 {
  font-weight: 700;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* ⚠ not converted: group-hover:text-accent-purple */

/* <div class="bg-surface-container-low p-8 rounded-3xl hover:bg-accent-purple/10 transition-colors group cursor-pointer text-center"> */
.div-68 {
  padding: 2rem;
  border-radius: 1.5rem;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
  cursor: pointer;
  text-align: center;
}

/* ⚠ not converted: bg-surface-container-low hover:bg-accent-purple/10 group */

/* <h4 class="font-bold group-hover:text-accent-purple transition-colors"> */
.h4-21 {
  font-weight: 700;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* ⚠ not converted: group-hover:text-accent-purple */

/* <div class="bg-surface-container-low p-8 rounded-3xl hover:bg-accent-purple/10 transition-colors group cursor-pointer text-center"> */
.div-69 {
  padding: 2rem;
  border-radius: 1.5rem;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
  cursor: pointer;
  text-align: center;
}

/* ⚠ not converted: bg-surface-container-low hover:bg-accent-purple/10 group */

/* <h4 class="font-bold group-hover:text-accent-purple transition-colors"> */
.h4-22 {
  font-weight: 700;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* ⚠ not converted: group-hover:text-accent-purple */

/* <section class="py-section-gap-lg bg-surface-container-lowest"> */
/* ⚠ not converted: py-section-gap-lg bg-surface-container-lowest */

/* <div class="max-w-4xl mx-auto px-margin-desktop"> */
.div-70 {
  margin-left: auto;
  margin-right: auto;
}

/* ⚠ not converted: max-w-4xl px-margin-desktop */

/* <div class="text-center mb-16"> */
.div-71 {
  text-align: center;
  margin-bottom: 4rem;
}

/* <h2 class="font-headline-xl text-headline-xl"> */
/* ⚠ not converted: font-headline-xl text-headline-xl */

/* <div class="overflow-hidden border border-outline-variant/20 rounded-[32px] bg-white"> */
.div-72 {
  overflow: hidden;
  border-width: 1px;
  border-radius: 32px;
  background-color: #ffffff;
}

/* ⚠ not converted: border-outline-variant/20 */

/* <table class="w-full text-left"> */
.table {
  width: 100%;
  text-align: left;
}

/* <tr class="bg-surface-container-low"> */
/* ⚠ not converted: bg-surface-container-low */

/* <th class="p-8 font-bold text-xl border-r border-outline-variant/10 text-secondary"> */
.th {
  padding: 2rem;
  font-weight: 700;
  font-size: 1.25rem;
}

/* ⚠ not converted: border-r border-outline-variant/10 text-secondary */

/* <th class="p-8 font-bold text-xl text-primary flex items-center gap-2"> */
.th-2 {
  padding: 2rem;
  font-weight: 700;
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* ⚠ not converted: text-primary */

/* <span class="w-6 h-6 bg-primary rounded flex items-center justify-center text-white text-xs"> */
.span-36 {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 0.75rem;
}

/* ⚠ not converted: bg-primary */

/* <tbody class="divide-y divide-outline-variant/10"> */
/* ⚠ not converted: divide-y divide-outline-variant/10 */

/* <td class="p-8 text-secondary border-r border-outline-variant/10"> */
.td {
  padding: 2rem;
}

/* ⚠ not converted: text-secondary border-r border-outline-variant/10 */

/* <td class="p-8 font-semibold text-primary"> */
.td-2 {
  padding: 2rem;
  font-weight: 600;
}

/* ⚠ not converted: text-primary */

/* <td class="p-8 text-secondary border-r border-outline-variant/10"> */
.td-3 {
  padding: 2rem;
}

/* ⚠ not converted: text-secondary border-r border-outline-variant/10 */

/* <td class="p-8 font-semibold text-primary"> */
.td-4 {
  padding: 2rem;
  font-weight: 600;
}

/* ⚠ not converted: text-primary */

/* <td class="p-8 text-secondary border-r border-outline-variant/10"> */
.td-5 {
  padding: 2rem;
}

/* ⚠ not converted: text-secondary border-r border-outline-variant/10 */

/* <td class="p-8 font-semibold text-primary"> */
.td-6 {
  padding: 2rem;
  font-weight: 600;
}

/* ⚠ not converted: text-primary */

/* <td class="p-8 text-secondary border-r border-outline-variant/10"> */
.td-7 {
  padding: 2rem;
}

/* ⚠ not converted: text-secondary border-r border-outline-variant/10 */

/* <td class="p-8 font-semibold text-primary"> */
.td-8 {
  padding: 2rem;
  font-weight: 600;
}

/* ⚠ not converted: text-primary */

/* <td class="p-8 text-secondary border-r border-outline-variant/10"> */
.td-9 {
  padding: 2rem;
}

/* ⚠ not converted: text-secondary border-r border-outline-variant/10 */

/* <td class="p-8 font-semibold text-primary"> */
.td-10 {
  padding: 2rem;
  font-weight: 600;
}

/* ⚠ not converted: text-primary */

/* <td class="p-8 text-secondary border-r border-outline-variant/10"> */
.td-11 {
  padding: 2rem;
}

/* ⚠ not converted: text-secondary border-r border-outline-variant/10 */

/* <td class="p-8 font-semibold text-primary"> */
.td-12 {
  padding: 2rem;
  font-weight: 600;
}

/* ⚠ not converted: text-primary */

/* <section class="py-section-gap-lg overflow-hidden"> */
.section-9 {
  overflow: hidden;
}

/* ⚠ not converted: py-section-gap-lg */

/* <div class="max-w-container-max mx-auto px-margin-desktop"> */
.div-73 {
  margin-left: auto;
  margin-right: auto;
}

/* ⚠ not converted: max-w-container-max px-margin-desktop */

/* <div class="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center"> */
.div-74 {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 6rem;
  align-items: center;
}

@media (min-width: 1024px) {
  .div-74 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

/* <span class="font-label-sm uppercase tracking-widest text-accent-pink mb-4 block"> */
.span-37 {
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 1rem;
  display: block;
}

/* ⚠ not converted: font-label-sm text-accent-pink */

/* <h2 class="font-headline-xl text-headline-xl mb-6"> */
.h2-9 {
  margin-bottom: 1.5rem;
}

/* ⚠ not converted: font-headline-xl text-headline-xl */

/* <p class="font-body-lg text-secondary mb-10"> */
.p-27 {
  margin-bottom: 2.5rem;
}

/* ⚠ not converted: font-body-lg text-secondary */

/* <div class="space-y-8"> */
.div-75 {
  /* space-y: use > * + * { margin-top: 2rem } */;
}

/* <div class="flex items-start gap-6"> */
.div-76 {
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
}

/* <div class="w-12 h-12 bg-white shadow-md rounded-xl flex items-center justify-center shrink-0"> */
.div-77 {
  width: 3rem;
  height: 3rem;
  background-color: #ffffff;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* <span class="material-symbols-outlined text-accent-pink"> */
/* ⚠ not converted: material-symbols-outlined text-accent-pink */

/* <h4 class="font-bold text-lg mb-2"> */
.h4-23 {
  font-weight: 700;
  font-size: 1.125rem;
  margin-bottom: 0.5rem;
}

/* <p class="text-secondary text-sm"> */
.p-28 {
  font-size: 0.875rem;
}

/* ⚠ not converted: text-secondary */

/* <div class="flex items-start gap-6"> */
.div-78 {
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
}

/* <div class="w-12 h-12 bg-white shadow-md rounded-xl flex items-center justify-center shrink-0"> */
.div-79 {
  width: 3rem;
  height: 3rem;
  background-color: #ffffff;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* <span class="material-symbols-outlined text-accent-purple"> */
/* ⚠ not converted: material-symbols-outlined text-accent-purple */

/* <h4 class="font-bold text-lg mb-2"> */
.h4-24 {
  font-weight: 700;
  font-size: 1.125rem;
  margin-bottom: 0.5rem;
}

/* <p class="text-secondary text-sm"> */
.p-29 {
  font-size: 0.875rem;
}

/* ⚠ not converted: text-secondary */

/* <div class="flex items-start gap-6"> */
.div-80 {
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
}

/* <div class="w-12 h-12 bg-white shadow-md rounded-xl flex items-center justify-center shrink-0"> */
.div-81 {
  width: 3rem;
  height: 3rem;
  background-color: #ffffff;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* <span class="material-symbols-outlined text-link-blue"> */
/* ⚠ not converted: material-symbols-outlined text-link-blue */

/* <h4 class="font-bold text-lg mb-2"> */
.h4-25 {
  font-weight: 700;
  font-size: 1.125rem;
  margin-bottom: 0.5rem;
}

/* <p class="text-secondary text-sm"> */
.p-30 {
  font-size: 0.875rem;
}

/* ⚠ not converted: text-secondary */

/* <div class="relative"> */
.div-82 {
  position: relative;
}

/* <div class="absolute -inset-10 bg-accent-pink/10 rounded-full blur-[100px]"> */
.div-83 {
  position: absolute;
  inset: -2.5rem;
  border-radius: 9999px;
}

/* ⚠ not converted: bg-accent-pink/10 blur-[100px] */

/* <div class="relative glass-card p-8 rounded-[40px] shadow-2xl border border-white/50"> */
.div-84 {
  position: relative;
  padding: 2rem;
  border-radius: 40px;
  box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
  border-width: 1px;
}

/* ⚠ not converted: glass-card border-white/50 */

/* <div class="flex justify-between items-center mb-8"> */
.div-85 {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

/* <h5 class="font-bold"> */
.h5 {
  font-weight: 700;
}

/* <div class="flex gap-2"> */
.div-86 {
  display: flex;
  gap: 0.5rem;
}

/* <span class="w-2 h-2 rounded-full bg-error"> */
.span-41 {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 9999px;
}

/* ⚠ not converted: bg-error */

/* <span class="w-2 h-2 rounded-full bg-accent-orange"> */
.span-42 {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 9999px;
}

/* ⚠ not converted: bg-accent-orange */

/* <span class="w-2 h-2 rounded-full bg-accent-purple"> */
.span-43 {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 9999px;
}

/* ⚠ not converted: bg-accent-purple */

/* <div class="space-y-4"> */
.div-87 {
  /* space-y: use > * + * { margin-top: 1rem } */;
}

/* <div class="h-12 bg-white/60 rounded-xl animate-pulse"> */
.div-88 {
  height: 3rem;
  border-radius: 0.75rem;
}

/* ⚠ not converted: bg-white/60 animate-pulse */

/* <div class="h-12 bg-white/60 rounded-xl animate-pulse"> */
.div-89 {
  height: 3rem;
  border-radius: 0.75rem;
}

/* ⚠ not converted: bg-white/60 animate-pulse */

/* <div class="h-12 bg-white/60 rounded-xl animate-pulse"> */
.div-90 {
  height: 3rem;
  border-radius: 0.75rem;
}

/* ⚠ not converted: bg-white/60 animate-pulse */

/* <div class="h-12 bg-white/60 rounded-xl animate-pulse"> */
.div-91 {
  height: 3rem;
  border-radius: 0.75rem;
}

/* ⚠ not converted: bg-white/60 animate-pulse */

/* <div class="h-12 bg-white/60 rounded-xl animate-pulse"> */
.div-92 {
  height: 3rem;
  border-radius: 0.75rem;
}

/* ⚠ not converted: bg-white/60 animate-pulse */

/* <div class="mt-8 p-6 bg-primary rounded-2xl text-on-primary"> */
.div-93 {
  margin-top: 2rem;
  padding: 1.5rem;
  border-radius: 1rem;
}

/* ⚠ not converted: bg-primary text-on-primary */

/* <h6 class="font-bold text-sm mb-1 uppercase tracking-widest opacity-60"> */
.h6 {
  font-weight: 700;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  opacity: 0.6;
}

/* <p class="text-3xl font-display-lg"> */
.p-31 {
  font-size: 1.875rem;
}

/* ⚠ not converted: font-display-lg */

/* <section class="py-section-gap-lg bg-surface-container-low"> */
/* ⚠ not converted: py-section-gap-lg bg-surface-container-low */

/* <div class="max-w-container-max mx-auto px-margin-desktop"> */
.div-94 {
  margin-left: auto;
  margin-right: auto;
}

/* ⚠ not converted: max-w-container-max px-margin-desktop */

/* <div class="text-center mb-20"> */
.div-95 {
  text-align: center;
  margin-bottom: 5rem;
}

/* <h2 class="font-headline-xl text-headline-xl"> */
/* ⚠ not converted: font-headline-xl text-headline-xl */

/* <div class="grid grid-cols-1 md:grid-cols-3 gap-8"> */
.div-96 {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 2rem;
}

@media (min-width: 768px) {
  .div-96 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

/* <div class="bg-white p-10 rounded-[32px] shadow-sm flex flex-col justify-between"> */
.div-97 {
  background-color: #ffffff;
  padding: 2.5rem;
  border-radius: 32px;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/* <p class="font-serif-accent text-[22px] italic mb-10 text-on-surface"> */
.p-32 {
  color: 22px;
  font-style: italic;
  margin-bottom: 2.5rem;
}

/* ⚠ not converted: font-serif-accent text-on-surface */

/* <div class="flex items-center gap-4 border-t border-outline-variant/10 pt-6"> */
.div-98 {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-top: 1.5rem;
}

/* ⚠ not converted: border-t border-outline-variant/10 */

/* <div class="w-12 h-12 rounded-full bg-accent-purple/10 flex items-center justify-center"> */
.div-99 {
  width: 3rem;
  height: 3rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ⚠ not converted: bg-accent-purple/10 */

/* <span class="material-symbols-outlined text-accent-purple"> */
/* ⚠ not converted: material-symbols-outlined text-accent-purple */

/* <p class="font-bold"> */
.p-33 {
  font-weight: 700;
}

/* <p class="text-secondary text-sm"> */
.p-34 {
  font-size: 0.875rem;
}

/* ⚠ not converted: text-secondary */

/* <div class="bg-white p-10 rounded-[32px] shadow-sm flex flex-col justify-between"> */
.div-100 {
  background-color: #ffffff;
  padding: 2.5rem;
  border-radius: 32px;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/* <p class="font-serif-accent text-[22px] italic mb-10 text-on-surface"> */
.p-35 {
  color: 22px;
  font-style: italic;
  margin-bottom: 2.5rem;
}

/* ⚠ not converted: font-serif-accent text-on-surface */

/* <div class="flex items-center gap-4 border-t border-outline-variant/10 pt-6"> */
.div-101 {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-top: 1.5rem;
}

/* ⚠ not converted: border-t border-outline-variant/10 */

/* <div class="w-12 h-12 rounded-full bg-accent-pink/10 flex items-center justify-center"> */
.div-102 {
  width: 3rem;
  height: 3rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ⚠ not converted: bg-accent-pink/10 */

/* <span class="material-symbols-outlined text-accent-pink"> */
/* ⚠ not converted: material-symbols-outlined text-accent-pink */

/* <p class="font-bold"> */
.p-36 {
  font-weight: 700;
}

/* <p class="text-secondary text-sm"> */
.p-37 {
  font-size: 0.875rem;
}

/* ⚠ not converted: text-secondary */

/* <div class="bg-white p-10 rounded-[32px] shadow-sm flex flex-col justify-between"> */
.div-103 {
  background-color: #ffffff;
  padding: 2.5rem;
  border-radius: 32px;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/* <p class="font-serif-accent text-[22px] italic mb-10 text-on-surface"> */
.p-38 {
  color: 22px;
  font-style: italic;
  margin-bottom: 2.5rem;
}

/* ⚠ not converted: font-serif-accent text-on-surface */

/* <div class="flex items-center gap-4 border-t border-outline-variant/10 pt-6"> */
.div-104 {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-top: 1.5rem;
}

/* ⚠ not converted: border-t border-outline-variant/10 */

/* <div class="w-12 h-12 rounded-full bg-accent-orange/10 flex items-center justify-center"> */
.div-105 {
  width: 3rem;
  height: 3rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ⚠ not converted: bg-accent-orange/10 */

/* <span class="material-symbols-outlined text-accent-orange"> */
/* ⚠ not converted: material-symbols-outlined text-accent-orange */

/* <p class="font-bold"> */
.p-39 {
  font-weight: 700;
}

/* <p class="text-secondary text-sm"> */
.p-40 {
  font-size: 0.875rem;
}

/* ⚠ not converted: text-secondary */

/* <section class="py-section-gap-lg"> */
/* ⚠ not converted: py-section-gap-lg */

/* <div class="max-w-container-max mx-auto px-margin-desktop"> */
.div-106 {
  margin-left: auto;
  margin-right: auto;
}

/* ⚠ not converted: max-w-container-max px-margin-desktop */

/* <div class="text-center mb-20"> */
.div-107 {
  text-align: center;
  margin-bottom: 5rem;
}

/* <h2 class="font-headline-xl text-headline-xl"> */
/* ⚠ not converted: font-headline-xl text-headline-xl */

/* <div class="grid grid-cols-1 md:grid-cols-3 gap-8"> */
.div-108 {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 2rem;
}

@media (min-width: 768px) {
  .div-108 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

/* <div class="p-10 rounded-[40px] border border-outline-variant/10 flex flex-col justify-between h-full hover:border-primary transition-all duration-300"> */
.div-109 {
  padding: 2.5rem;
  border-radius: 40px;
  border-width: 1px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
  transition-duration: 300ms;
}

/* ⚠ not converted: border-outline-variant/10 hover:border-primary */

/* <h3 class="font-headline-lg text-2xl mb-2"> */
.h3-7 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

/* ⚠ not converted: font-headline-lg */

/* <p class="text-secondary mb-8"> */
.p-41 {
  margin-bottom: 2rem;
}

/* ⚠ not converted: text-secondary */

/* <div class="mb-10"> */
.div-110 {
  margin-bottom: 2.5rem;
}

/* <span class="text-5xl font-bold font-display-lg"> */
.span-47 {
  font-size: 3rem;
  font-weight: 700;
}

/* ⚠ not converted: font-display-lg */

/* <span class="text-secondary"> */
/* ⚠ not converted: text-secondary */

/* <ul class="space-y-4 mb-10"> */
.ul-2 {
  /* space-y: use > * + * { margin-top: 1rem } */;
  margin-bottom: 2.5rem;
}

/* <li class="flex items-center gap-3"> */
.li-5 {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

/* <span class="material-symbols-outlined text-accent-purple"> */
/* ⚠ not converted: material-symbols-outlined text-accent-purple */

/* <li class="flex items-center gap-3"> */
.li-6 {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

/* <span class="material-symbols-outlined text-accent-purple"> */
/* ⚠ not converted: material-symbols-outlined text-accent-purple */

/* <li class="flex items-center gap-3"> */
.li-7 {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

/* <span class="material-symbols-outlined text-accent-purple"> */
/* ⚠ not converted: material-symbols-outlined text-accent-purple */

/* <button class="w-full py-4 rounded-full border-2 border-primary text-primary font-bold hover:bg-primary hover:text-on-primary transition-all"> */
.button-5 {
  width: 100%;
  padding-top: 1rem;
  padding-bottom: 1rem;
  border-radius: 9999px;
  border-width: 2px;
  font-weight: 700;
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* ⚠ not converted: border-primary text-primary hover:bg-primary hover:text-on-primary */

/* <div class="p-10 rounded-[40px] bg-primary text-on-primary shadow-2xl flex flex-col justify-between h-full transform scale-105 relative overflow-hidden"> */
.div-111 {
  padding: 2.5rem;
  border-radius: 40px;
  box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  transform: scale(1.05);
  position: relative;
  overflow: hidden;
}

/* ⚠ not converted: bg-primary text-on-primary transform */

/* <div class="absolute top-6 right-6 bg-accent-pink text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest"> */
.div-112 {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  color: #ffffff;
  color: 10px;
  font-weight: 700;
  padding-left: 0.75rem;
  padding-right: 0.75rem;
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
  border-radius: 9999px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

/* ⚠ not converted: bg-accent-pink */

/* <h3 class="font-headline-lg text-2xl mb-2"> */
.h3-8 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

/* ⚠ not converted: font-headline-lg */

/* <p class="text-on-primary/70 mb-8 text-sm"> */
.p-42 {
  margin-bottom: 2rem;
  font-size: 0.875rem;
}

/* ⚠ not converted: text-on-primary/70 */

/* <div class="mb-10"> */
.div-113 {
  margin-bottom: 2.5rem;
}

/* <span class="text-5xl font-bold font-display-lg"> */
.span-52 {
  font-size: 3rem;
  font-weight: 700;
}

/* ⚠ not converted: font-display-lg */

/* <span class="text-on-primary/70"> */
/* ⚠ not converted: text-on-primary/70 */

/* <ul class="space-y-4 mb-10"> */
.ul-3 {
  /* space-y: use > * + * { margin-top: 1rem } */;
  margin-bottom: 2.5rem;
}

/* <li class="flex items-center gap-3"> */
.li-8 {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

/* <span class="material-symbols-outlined"> */
/* ⚠ not converted: material-symbols-outlined */

/* <li class="flex items-center gap-3"> */
.li-9 {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

/* <span class="material-symbols-outlined"> */
/* ⚠ not converted: material-symbols-outlined */

/* <li class="flex items-center gap-3"> */
.li-10 {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

/* <span class="material-symbols-outlined"> */
/* ⚠ not converted: material-symbols-outlined */

/* <li class="flex items-center gap-3"> */
.li-11 {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

/* <span class="material-symbols-outlined"> */
/* ⚠ not converted: material-symbols-outlined */

/* <button class="w-full py-4 rounded-full bg-white text-primary font-bold hover:bg-surface-dim transition-all"> */
.button-6 {
  width: 100%;
  padding-top: 1rem;
  padding-bottom: 1rem;
  border-radius: 9999px;
  background-color: #ffffff;
  font-weight: 700;
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* ⚠ not converted: text-primary hover:bg-surface-dim */

/* <div class="p-10 rounded-[40px] border border-outline-variant/10 flex flex-col justify-between h-full hover:border-primary transition-all duration-300"> */
.div-114 {
  padding: 2.5rem;
  border-radius: 40px;
  border-width: 1px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
  transition-duration: 300ms;
}

/* ⚠ not converted: border-outline-variant/10 hover:border-primary */

/* <h3 class="font-headline-lg text-2xl mb-2"> */
.h3-9 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

/* ⚠ not converted: font-headline-lg */

/* <p class="text-secondary mb-8"> */
.p-43 {
  margin-bottom: 2rem;
}

/* ⚠ not converted: text-secondary */

/* <div class="mb-10"> */
.div-115 {
  margin-bottom: 2.5rem;
}

/* <span class="text-5xl font-bold font-display-lg"> */
.span-58 {
  font-size: 3rem;
  font-weight: 700;
}

/* ⚠ not converted: font-display-lg */

/* <span class="text-secondary"> */
/* ⚠ not converted: text-secondary */

/* <ul class="space-y-4 mb-10"> */
.ul-4 {
  /* space-y: use > * + * { margin-top: 1rem } */;
  margin-bottom: 2.5rem;
}

/* <li class="flex items-center gap-3"> */
.li-12 {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

/* <span class="material-symbols-outlined text-accent-purple"> */
/* ⚠ not converted: material-symbols-outlined text-accent-purple */

/* <li class="flex items-center gap-3"> */
.li-13 {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

/* <span class="material-symbols-outlined text-accent-purple"> */
/* ⚠ not converted: material-symbols-outlined text-accent-purple */

/* <li class="flex items-center gap-3"> */
.li-14 {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

/* <span class="material-symbols-outlined text-accent-purple"> */
/* ⚠ not converted: material-symbols-outlined text-accent-purple */

/* <button class="w-full py-4 rounded-full border-2 border-primary text-primary font-bold hover:bg-primary hover:text-on-primary transition-all"> */
.button-7 {
  width: 100%;
  padding-top: 1rem;
  padding-bottom: 1rem;
  border-radius: 9999px;
  border-width: 2px;
  font-weight: 700;
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* ⚠ not converted: border-primary text-primary hover:bg-primary hover:text-on-primary */

/* <section class="py-section-gap-lg"> */
/* ⚠ not converted: py-section-gap-lg */

/* <div class="max-w-3xl mx-auto px-margin-desktop"> */
.div-116 {
  margin-left: auto;
  margin-right: auto;
}

/* ⚠ not converted: max-w-3xl px-margin-desktop */

/* <div class="text-center mb-16"> */
.div-117 {
  text-align: center;
  margin-bottom: 4rem;
}

/* <h2 class="font-headline-lg text-headline-lg mb-4"> */
.h2-12 {
  margin-bottom: 1rem;
}

/* ⚠ not converted: font-headline-lg text-headline-lg */

/* <div class="space-y-4"> */
.div-118 {
  /* space-y: use > * + * { margin-top: 1rem } */;
}

/* <div class="border-b border-outline-variant/30 py-6"> */
.div-119 {
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
}

/* ⚠ not converted: border-b border-outline-variant/30 */

/* <button class="flex justify-between items-center w-full text-left font-bold font-body-lg group"> */
.button-8 {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  text-align: left;
  font-weight: 700;
}

/* ⚠ not converted: font-body-lg group */

/* <span class="material-symbols-outlined group-hover:rotate-45 transition-transform"> */
.span-63 {
  transform: rotate(45deg);
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* ⚠ not converted: material-symbols-outlined */

/* <div class="border-b border-outline-variant/30 py-6"> */
.div-120 {
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
}

/* ⚠ not converted: border-b border-outline-variant/30 */

/* <button class="flex justify-between items-center w-full text-left font-bold font-body-lg group"> */
.button-9 {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  text-align: left;
  font-weight: 700;
}

/* ⚠ not converted: font-body-lg group */

/* <span class="material-symbols-outlined group-hover:rotate-45 transition-transform"> */
.span-64 {
  transform: rotate(45deg);
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* ⚠ not converted: material-symbols-outlined */

/* <div class="border-b border-outline-variant/30 py-6"> */
.div-121 {
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
}

/* ⚠ not converted: border-b border-outline-variant/30 */

/* <button class="flex justify-between items-center w-full text-left font-bold font-body-lg group"> */
.button-10 {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  text-align: left;
  font-weight: 700;
}

/* ⚠ not converted: font-body-lg group */

/* <span class="material-symbols-outlined group-hover:rotate-45 transition-transform"> */
.span-65 {
  transform: rotate(45deg);
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* ⚠ not converted: material-symbols-outlined */

/* <div class="border-b border-outline-variant/30 py-6"> */
.div-122 {
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
}

/* ⚠ not converted: border-b border-outline-variant/30 */

/* <button class="flex justify-between items-center w-full text-left font-bold font-body-lg group"> */
.button-11 {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  text-align: left;
  font-weight: 700;
}

/* ⚠ not converted: font-body-lg group */

/* <span class="material-symbols-outlined group-hover:rotate-45 transition-transform"> */
.span-66 {
  transform: rotate(45deg);
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* ⚠ not converted: material-symbols-outlined */

/* <section class="relative py-section-gap-lg mx-margin-desktop rounded-[60px] overflow-hidden bg-primary mb-20"> */
.section-13 {
  position: relative;
  border-radius: 60px;
  overflow: hidden;
  margin-bottom: 5rem;
}

/* ⚠ not converted: py-section-gap-lg mx-margin-desktop bg-primary */

/* <div class="absolute inset-0 z-0"> */
.div-123 {
  position: absolute;
  inset: 0px;
  z-index: 0;
}

/* <div class="absolute inset-0 bg-gradient-to-br from-accent-purple/30 via-accent-pink/30 to-accent-orange/30 mix-blend-overlay"> */
.div-124 {
  position: absolute;
  inset: 0px;
}

/* ⚠ not converted: bg-gradient-to-br from-accent-purple/30 via-accent-pink/30 to-accent-orange/30 mix-blend-overlay */

/* <div class="absolute top-0 right-0 w-[800px] h-[800px] bg-accent-purple rounded-full accent-blur opacity-20"> */
.div-125 {
  position: absolute;
  top: 0px;
  right: 0px;
  width: 800px;
  height: 800px;
  border-radius: 9999px;
  opacity: 0.2;
}

/* ⚠ not converted: bg-accent-purple accent-blur */

/* <div class="relative z-10 max-w-4xl mx-auto px-margin-desktop text-center text-white"> */
.div-126 {
  position: relative;
  z-index: 10;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
  color: #ffffff;
}

/* ⚠ not converted: max-w-4xl px-margin-desktop */

/* <h2 class="font-display-lg text-display-lg mb-8 leading-tight"> */
.h2-13 {
  margin-bottom: 2rem;
  line-height: 1.25;
}

/* ⚠ not converted: font-display-lg text-display-lg */

/* <p class="font-body-lg mb-12 opacity-80 max-w-2xl mx-auto"> */
.p-44 {
  margin-bottom: 3rem;
  opacity: 0.8;
  margin-left: auto;
  margin-right: auto;
}

/* ⚠ not converted: font-body-lg max-w-2xl */

/* <div class="flex flex-col sm:flex-row items-center justify-center gap-6"> */
.div-127 {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
}

@media (min-width: 640px) {
  .div-127 {
    flex-direction: row;
  }
}

/* <button class="bg-white text-primary px-10 py-5 rounded-full font-body-md font-bold hover:bg-surface-dim transition-all duration-300 shadow-xl"> */
.button-12 {
  background-color: #ffffff;
  padding-left: 2.5rem;
  padding-right: 2.5rem;
  padding-top: 1.25rem;
  padding-bottom: 1.25rem;
  border-radius: 9999px;
  font-weight: 700;
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
  transition-duration: 300ms;
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
}

/* ⚠ not converted: text-primary font-body-md hover:bg-surface-dim */

/* <button class="bg-transparent border-2 border-white/30 text-white backdrop-blur-md px-10 py-5 rounded-full font-body-md font-bold hover:bg-white/10 transition-all duration-300"> */
.button-13 {
  background-color: transparent;
  border-width: 2px;
  color: #ffffff;
  padding-left: 2.5rem;
  padding-right: 2.5rem;
  padding-top: 1.25rem;
  padding-bottom: 1.25rem;
  border-radius: 9999px;
  font-weight: 700;
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
  transition-duration: 300ms;
}

/* ⚠ not converted: border-white/30 backdrop-blur-md font-body-md hover:bg-white/10 */

/* <footer class="bg-surface-container-lowest border-t border-outline-variant/10"> */
/* ⚠ not converted: bg-surface-container-lowest border-t border-outline-variant/10 */

/* <div class="max-w-container-max mx-auto py-20 px-margin-desktop"> */
.div-128 {
  margin-left: auto;
  margin-right: auto;
  padding-top: 5rem;
  padding-bottom: 5rem;
}

/* ⚠ not converted: max-w-container-max px-margin-desktop */

/* <div class="flex flex-col md:flex-row justify-between items-start gap-12"> */
.div-129 {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  gap: 3rem;
}

@media (min-width: 768px) {
  .div-129 {
    flex-direction: row;
  }
}

/* <div class="max-w-xs"> */
/* ⚠ not converted: max-w-xs */

/* <div class="font-display-lg text-[24px] font-bold text-primary mb-6 flex items-center gap-2"> */
.div-131 {
  color: 24px;
  font-weight: 700;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* ⚠ not converted: font-display-lg text-primary */

/* <span class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white text-lg"> */
.span-67 {
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 1.125rem;
}

/* ⚠ not converted: bg-primary */

/* <p class="text-secondary font-body-md mb-8 leading-relaxed"> */
.p-45 {
  margin-bottom: 2rem;
  line-height: 1.625;
}

/* ⚠ not converted: text-secondary font-body-md */

/* <div class="grid grid-cols-2 sm:grid-cols-3 gap-20"> */
.div-132 {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 5rem;
}

@media (min-width: 640px) {
  .div-132 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

/* <div class="flex flex-col gap-5"> */
.div-133 {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* <span class="text-primary font-bold font-label-sm uppercase tracking-wider"> */
.span-68 {
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* ⚠ not converted: text-primary font-label-sm */

/* <a class="text-secondary hover:text-accent-pink transition-colors font-body-md"> */
.a-5 {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* ⚠ not converted: text-secondary hover:text-accent-pink font-body-md */

/* <a class="text-secondary hover:text-accent-pink transition-colors font-body-md"> */
.a-6 {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* ⚠ not converted: text-secondary hover:text-accent-pink font-body-md */

/* <a class="text-secondary hover:text-accent-pink transition-colors font-body-md"> */
.a-7 {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* ⚠ not converted: text-secondary hover:text-accent-pink font-body-md */

/* <div class="flex flex-col gap-5"> */
.div-134 {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* <span class="text-primary font-bold font-label-sm uppercase tracking-wider"> */
.span-69 {
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* ⚠ not converted: text-primary font-label-sm */

/* <a class="text-secondary hover:text-accent-pink transition-colors font-body-md"> */
.a-8 {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* ⚠ not converted: text-secondary hover:text-accent-pink font-body-md */

/* <a class="text-secondary hover:text-accent-pink transition-colors font-body-md"> */
.a-9 {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* ⚠ not converted: text-secondary hover:text-accent-pink font-body-md */

/* <a class="text-secondary hover:text-accent-pink transition-colors font-body-md"> */
.a-10 {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* ⚠ not converted: text-secondary hover:text-accent-pink font-body-md */

/* <div class="flex flex-col gap-5"> */
.div-135 {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* <span class="text-primary font-bold font-label-sm uppercase tracking-wider"> */
.span-70 {
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* ⚠ not converted: text-primary font-label-sm */

/* <a class="text-secondary hover:text-accent-pink transition-colors font-body-md"> */
.a-11 {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* ⚠ not converted: text-secondary hover:text-accent-pink font-body-md */

/* <a class="text-secondary hover:text-accent-pink transition-colors font-body-md"> */
.a-12 {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* ⚠ not converted: text-secondary hover:text-accent-pink font-body-md */

/* <div class="mt-20 pt-10 border-t border-outline-variant/10 text-secondary text-sm flex flex-col md:flex-row justify-between gap-4"> */
.div-136 {
  margin-top: 5rem;
  padding-top: 2.5rem;
  font-size: 0.875rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1rem;
}

@media (min-width: 768px) {
  .div-136 {
    flex-direction: row;
  }
}

/* ⚠ not converted: border-t border-outline-variant/10 text-secondary */

/* <div class="flex gap-8"> */
.div-137 {
  display: flex;
  gap: 2rem;
}

/* <a class="hover:text-primary"> */
/* ⚠ not converted: hover:text-primary */

/* <a class="hover:text-primary"> */
/* ⚠ not converted: hover:text-primary */

/* <a class="hover:text-primary"> */
/* ⚠ not converted: hover:text-primary */
`;

export const healthcare04Html = `
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,700;0,9..144,900;1,9..144,300&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet">
<!-- ── NAVIGATION ── -->
<header>
    <nav>
        <a href="#" class="logo">LOGO_PLACEHOLDER</a>
        <button class="nav-toggle" onclick="this.nextElementSibling.classList.toggle('open')">☰</button>
    </nav>
</header>

<!-- ── SECTION 1: HERO ── -->
<section class="hero">
    <div class="hero-left">
        <div class="hero-badge">Established 1993 · 32 Years</div>
        <h1>We Don't Just<br>Consult. We<br><em>Transform.</em></h1>
        <p class="hero-sub">Three decades of turning ambitious businesses into industry leaders. Not theory — real strategies that have generated $250M+ in client revenue.</p>
        <div class="hero-btns">
            <button class="btn-gold" onclick="scrollToSection('contact')">Get Free Consultation</button>
            <button class="btn-outline-white" onclick="scrollToSection('about')">Our Story →</button>
        </div>
    </div>
    <div class="hero-right">
        <div class="hero-years">32</div>
        <div class="hero-years-label">Years of <span>Excellence</span></div>
        <div class="hero-metrics">
            <div class="metric">
                <div class="metric-num">500<span style="font-size:24px">+</span></div>
                <div class="metric-label">Businesses Transformed</div>
            </div>
            <div class="metric">
                <div class="metric-num">$250<span style="font-size:24px">M</span></div>
                <div class="metric-label">Revenue Generated</div>
            </div>
            <div class="metric">
                <div class="metric-num">350<span style="font-size:24px">%</span></div>
                <div class="metric-label">Average ROI Increase</div>
            </div>
            <div class="metric">
                <div class="metric-num">98<span style="font-size:24px">%</span></div>
                <div class="metric-label">Client Retention Rate</div>
            </div>
        </div>
        <div class="hero-form-wrap">
            <h3>Start Free — No Commitment</h3>
            <form id="formHero" class="ajax-form">
                <div class="form-row">
                    <div class="form-group">
                        <label>First Name</label>
                        <input type="text" name="fname" required placeholder="Jane">
                        <div class="form-error"></div>
                    </div>
                    <div class="form-group">
                        <label>Last Name</label>
                        <input type="text" name="lname" required placeholder="Smith">
                        <div class="form-error"></div>
                    </div>
                </div>
                <div class="form-group">
                    <label>Work Email</label>
                    <input type="email" name="email" required placeholder="jane@company.com">
                    <div class="form-error"></div>
                </div>
                <div class="form-group">
                    <label>Phone Number</label>
                    <input type="tel" name="phone" required placeholder="+1 (555) 000-0000">
                    <div class="form-error"></div>
                </div>
                <input type="hidden" name="form_source" value="hero">
                <button type="submit" class="btn-submit">Request Free Strategy Call →</button>
                <p class="form-note">✓ No credit card &nbsp;·&nbsp; Response within 2 hours</p>
            </form>
        </div>
    </div>
</section>

<!-- ── SECTION 2: TRUST TICKER ── -->
<div class="trust-section" aria-label="Trusted by leading companies">
    <div class="trust-track" id="trustTrack"></div>
</div>

<!-- ── SECTION 3: STATS ── -->
<section class="stats-section">
    <div class="stats-bg-text">RESULTS</div>
    <div class="stats-inner">
        <div class="stat-block fade-up">
            <div class="stat-num"><span class="counter" data-target="500">0</span><span>+</span></div>
            <div class="stat-divider"></div>
            <div class="stat-label">Businesses<br>Transformed</div>
        </div>
        <div class="stat-block fade-up fade-up-2">
            <div class="stat-num">$<span class="counter" data-target="250">0</span><span>M</span></div>
            <div class="stat-divider"></div>
            <div class="stat-label">Client Revenue<br>Generated</div>
        </div>
        <div class="stat-block fade-up fade-up-3">
            <div class="stat-num"><span class="counter" data-target="350">0</span><span>%</span></div>
            <div class="stat-divider"></div>
            <div class="stat-label">Average ROI<br>Increase</div>
        </div>
        <div class="stat-block fade-up fade-up-4">
            <div class="stat-num"><span class="counter" data-target="32">0</span></div>
            <div class="stat-divider"></div>
            <div class="stat-label">Years of Proven<br>Excellence</div>
        </div>
    </div>
</section>

<!-- ── SECTION 4: ABOUT ── -->
<section class="about-section" id="about">
    <div class="container">
        <div class="about-grid">
            <div>
                <div class="about-label">Our Story</div>
                <h2 class="about-heading">Founded on Grit.<br>Built on <em>Results.</em></h2>
                <p class="about-body">In 1993, we started with a single client and a bold promise: no fluff, no buzzwords, just measurable growth. Three decades later, that promise has never changed.</p>
                <p class="about-body">We've survived recessions, market crashes, and digital revolutions — and so have our clients. Because we don't give advice from the sideline. We roll up our sleeves, embed with your team, and fight for outcomes that actually move the needle.</p>
                <div class="about-signature">
                    David Harrington
                    <span>Founder & CEO, Apex Consulting</span>
                </div>
            </div>
            <div class="about-visual">
                <div class="about-card-main">
                    <blockquote>"They became our strategic backbone. In 18 months, we went from stagnant to market leader."</blockquote>
                    <div class="about-card-footer">
                        <div class="client-avatar">LC</div>
                        <div class="client-info">
                            <div class="name" style="color:white">Lisa Chen</div>
                            <div class="role">CEO, NovaTech Industries</div>
                        </div>
                    </div>
                </div>
                <div class="about-card-mini">
                    <div class="mini-icon">🏆</div>
                    <div class="mini-text">
                        <div class="num">Forbes</div>
                        <div class="desc">Top 10 Business Consulting Firms, 5 consecutive years</div>
                    </div>
                </div>
                <div class="about-card-mini">
                    <div class="mini-icon">⭐</div>
                    <div class="mini-text">
                        <div class="num">4.9 / 5</div>
                        <div class="desc">Average client satisfaction across 500+ engagements</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- ── SECTION 5: SERVICES ── -->
<section class="services-section" id="services">
    <div class="container">
        <div class="section-header">
            <div class="section-label">What We Do</div>
            <h2 class="section-title">Six Ways We <em>Accelerate</em><br>Your Growth</h2>
        </div>
        <div class="services-timeline">
            <div class="service-row">
                <div class="svc-content">
                    <h3>Strategic Consulting</h3>
                    <p>Custom growth strategies rooted in your market reality — not generic frameworks. We analyze, diagnose, and prescribe with surgical precision.</p>
                    <span class="svc-tag">Foundation</span>
                </div>
                <div class="svc-node"><div class="svc-dot">📊</div></div>
                <div class="svc-empty"></div>
            </div>
            <div class="service-row">
                <div class="svc-empty"></div>
                <div class="svc-node"><div class="svc-dot">🎯</div></div>
                <div class="svc-content">
                    <h3>Growth Marketing</h3>
                    <p>Data-driven campaigns that slash your customer acquisition cost while compounding lifetime value. Every dollar accountable.</p>
                    <span class="svc-tag">Revenue</span>
                </div>
            </div>
            <div class="service-row">
                <div class="svc-content">
                    <h3>Digital Transformation</h3>
                    <p>From legacy operations to agile digital ecosystems — we guide the full transformation without disrupting your current business.</p>
                    <span class="svc-tag">Technology</span>
                </div>
                <div class="svc-node"><div class="svc-dot">💻</div></div>
                <div class="svc-empty"></div>
            </div>
            <div class="service-row">
                <div class="svc-empty"></div>
                <div class="svc-node"><div class="svc-dot">👥</div></div>
                <div class="svc-content">
                    <h3>Team Development</h3>
                    <p>High-performance culture doesn't happen by accident. We build the leadership frameworks and team structures that outlast our engagement.</p>
                    <span class="svc-tag">People</span>
                </div>
            </div>
            <div class="service-row">
                <div class="svc-content">
                    <h3>Performance Analytics</h3>
                    <p>Real-time dashboards that make decisions obvious. We instrument your business so nothing moves without you knowing why.</p>
                    <span class="svc-tag">Intelligence</span>
                </div>
                <div class="svc-node"><div class="svc-dot">📈</div></div>
                <div class="svc-empty"></div>
            </div>
            <div class="service-row">
                <div class="svc-empty"></div>
                <div class="svc-node"><div class="svc-dot">🌟</div></div>
                <div class="svc-content">
                    <h3>Customer Success</h3>
                    <p>We don't disappear after strategy delivery. Dedicated success managers embed with your team to ensure momentum never stalls.</p>
                    <span class="svc-tag">Retention</span>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- ── SECTION 6: PROCESS ── -->
<section class="process-section" id="process">
    <div class="container">
        <div class="section-header">
            <div class="section-label">How We Work</div>
            <h2 class="section-title">From Day One to <em>Results</em></h2>
        </div>
        <div class="process-steps">
            <div class="process-step fade-up">
                <div class="step-circle">01</div>
                <h3 class="step-title">Discovery Call</h3>
                <p class="step-desc">30-minute deep-dive with a senior strategist. We map your current state and identify the highest-leverage opportunities.</p>
            </div>
            <div class="process-step fade-up fade-up-2">
                <div class="step-circle">02</div>
                <h3 class="step-title">Custom Roadmap</h3>
                <p class="step-desc">A tailored 90-day sprint plan with clear KPIs, milestones, and resource requirements — built for your context.</p>
            </div>
            <div class="process-step fade-up fade-up-3">
                <div class="step-circle">03</div>
                <h3 class="step-title">Execute Together</h3>
                <p class="step-desc">We embed with your team. Weekly check-ins, real-time slack access to your strategist, and weekly reporting.</p>
            </div>
            <div class="process-step fade-up fade-up-4">
                <div class="step-circle">04</div>
                <h3 class="step-title">Measure & Scale</h3>
                <p class="step-desc">Every outcome measured against agreed KPIs. What works gets doubled down. What doesn't gets cut. No ego, just results.</p>
            </div>
        </div>
    </div>
</section>

<!-- ── SECTION 7: TESTIMONIALS ── -->
<section class="testimonials-section" id="testimonials">
    <div class="container">
        <div class="section-header">
            <div class="section-label">Client Results</div>
            <h2 class="section-title">The Only Metric<br>That <em>Matters</em></h2>
        </div>
        <div class="testimonials-layout">
            <div class="testi-featured">
                <div>
                    <div class="testi-stars">★★★★★</div>
                    <blockquote class="testi-quote">"Working with Apex didn't just transform our business — it transformed how I think about business. In 18 months we went from $4M to $14M in ARR. They became our most valuable strategic partner, full stop."</blockquote>
                </div>
                <div>
                    <div class="testi-author">
                        <div class="testi-av">AK</div>
                        <div>
                            <div class="testi-name">Alexandra Kim</div>
                            <div class="testi-role">CEO, TechVenture Inc</div>
                        </div>
                    </div>
                    <div class="testi-outcome">↑ 250% ARR in 18 months</div>
                </div>
            </div>
            <div class="testi-card">
                <div class="testi-stars">★★★★★</div>
                <p class="testi-quote">"Data-driven, disciplined, and relentless. We increased revenue by 280% in 8 months. Their execution excellence is unlike anything I've seen."</p>
                <div class="testi-author">
                    <div class="testi-av" style="background:PRIMARY_COLOR_PLACEHOLDER;color:white">MJ</div>
                    <div>
                        <div class="testi-name">Marcus Johnson</div>
                        <div class="testi-role">Founder, GrowthCo</div>
                    </div>
                </div>
                <div class="testi-outcome">↑ 280% revenue in 8 months</div>
            </div>
            <div class="testi-card">
                <div class="testi-stars">★★★★★</div>
                <p class="testi-quote">"Exceptional team. They understood our market before we finished explaining it. ROI was 400% in the first year. I refer every serious founder to Apex."</p>
                <div class="testi-author">
                    <div class="testi-av" style="background:PRIMARY_COLOR_PLACEHOLDER;color:white">SP</div>
                    <div>
                        <div class="testi-name">Sarah Patel</div>
                        <div class="testi-role">COO, Digital Innovations</div>
                    </div>
                </div>
                <div class="testi-outcome">↑ 400% ROI Year 1</div>
            </div>
        </div>
    </div>
</section>

<!-- ── SECTION 8: MID CTA ── -->
<section class="mid-cta-section">
    <div class="container">
        <div class="mid-cta-inner">
            <div>
                <h2 class="mid-cta-heading">Ready to Stop<br>Leaving Money<br>on the <em>Table?</em></h2>
                <p class="mid-cta-sub">Schedule a callback with our growth experts. 30 minutes. Completely free. No sales pressure — just honest strategic advice you can act on today.</p>
            </div>
            <div class="mid-cta-form">
                <h4>Schedule Your Callback</h4>
                <form id="formCallback" class="ajax-form">
                    <div class="form-group">
                        <label>Full Name</label>
                        <input type="text" name="name" required placeholder="Jane Smith">
                        <div class="form-error"></div>
                    </div>
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" name="email" required placeholder="jane@example.com">
                        <div class="form-error"></div>
                    </div>
                    <div class="form-group">
                        <label>Phone</label>
                        <input type="tel" name="phone" required placeholder="+1 (555) 000-0000">
                        <div class="form-error"></div>
                    </div>
                    <div class="form-group">
                        <label>Best Time to Call</label>
                        <select name="preferred_time" required>
                            <option value="">Select time</option>
                            <option value="morning">Morning (8AM–12PM)</option>
                            <option value="afternoon">Afternoon (12PM–5PM)</option>
                            <option value="evening">Evening (5PM–8PM)</option>
                        </select>
                    </div>
                    <input type="hidden" name="form_source" value="callback">
                    <button type="submit" class="btn-submit">Schedule Now →</button>
                </form>
            </div>
        </div>
    </div>
</section>

<!-- ── SECTION 9: FAQ ── -->
<section class="faq-section" id="faq">
    <div class="container">
        <div class="faq-layout">
            <div class="faq-aside">
                <div class="about-label">FAQ</div>
                <h2 class="faq-aside-title">Questions<br>Worth <em>Asking</em></h2>
                <p>Everything you should know before working with us. If you have more questions, we're always a call away.</p>
                <a href="#contact" class="faq-contact-btn">Talk to a Strategist</a>
            </div>
            <div class="faq-list">
                <div class="faq-item">
                    <button class="faq-trigger">
                        <span class="faq-q">How long before we see results?</span>
                        <span class="faq-icon">+</span>
                    </button>
                    <div class="faq-body">
                        <p class="faq-ans">Most clients see measurable early indicators within 30–60 days. Substantial revenue impact typically shows at the 90–120 day mark. We'll give you a realistic timeline based on your specific situation — not a generic promise.</p>
                    </div>
                </div>
                <div class="faq-item">
                    <button class="faq-trigger">
                        <span class="faq-q">What if we're not satisfied with the results?</span>
                        <span class="faq-icon">+</span>
                    </button>
                    <div class="faq-body">
                        <p class="faq-ans">We back every engagement with a results guarantee. If you're not seeing progress against agreed KPIs within the committed timeline, we continue working at no additional cost until we get there.</p>
                    </div>
                </div>
                <div class="faq-item">
                    <button class="faq-trigger">
                        <span class="faq-q">Do you work with businesses of all sizes?</span>
                        <span class="faq-icon">+</span>
                    </button>
                    <div class="faq-body">
                        <p class="faq-ans">Yes — from Series A startups to Fortune 500 enterprises. Our engagements are scoped and priced based on the complexity and objectives of your business, not a one-size-fits-all package.</p>
                    </div>
                </div>
                <div class="faq-item">
                    <button class="faq-trigger">
                        <span class="faq-q">What does the free consultation include?</span>
                        <span class="faq-icon">+</span>
                    </button>
                    <div class="faq-body">
                        <p class="faq-ans">A 30-minute session with a senior strategist (not a sales rep). You'll get: a business health assessment, identification of your top 3 growth levers, and a rough roadmap. No pitch, no obligation.</p>
                    </div>
                </div>
                <div class="faq-item">
                    <button class="faq-trigger">
                        <span class="faq-q">How do you measure and report success?</span>
                        <span class="faq-icon">+</span>
                    </button>
                    <div class="faq-body">
                        <p class="faq-ans">We define KPIs together at the start of every engagement and track them in a live dashboard you have 24/7 access to. Monthly executive reports and weekly check-in calls keep you fully informed at all times.</p>
                    </div>
                </div>
                <div class="faq-item">
                    <button class="faq-trigger">
                        <span class="faq-q">What industries do you specialize in?</span>
                        <span class="faq-icon">+</span>
                    </button>
                    <div class="faq-body">
                        <p class="faq-ans">In 32 years, we've worked across technology, healthcare, retail, financial services, manufacturing, and professional services. Our frameworks are industry-agnostic; our strategies are always industry-specific.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- ── SECTION 10: FINAL CTA ── -->
<section class="final-cta" id="contact">
    <div class="container">
        <div class="final-cta-inner">
            <div>
                <h2>Don't Wait to Start Growing</h2>
                <p class="final-cta-body">Get your free strategy session and a custom action plan — built specifically for your business. No credit card. No commitment. Just expert guidance from people who've done it 500 times.</p>
                <ul class="final-cta-perks">
                    <li>Personalized 30-minute strategy session</li>
                    <li>Identify your top 3 growth opportunities</li>
                    <li>Custom 90-day action plan — yours to keep</li>
                    <li>No sales pressure, ever</li>
                </ul>
            </div>
            <div class="final-form">
                <h3>Book Your Free Session</h3>
                <form id="formFinal" class="ajax-form">
                    <div class="form-group">
                        <label>Full Name</label>
                        <input type="text" name="name" required placeholder="Jane Smith">
                        <div class="form-error"></div>
                    </div>
                    <div class="form-group">
                        <label>Email Address</label>
                        <input type="email" name="email" required placeholder="jane@company.com">
                        <div class="form-error"></div>
                    </div>
                    <div class="form-group">
                        <label>Phone Number</label>
                        <input type="tel" name="phone" required placeholder="+1 (555) 000-0000">
                        <div class="form-error"></div>
                    </div>
                    <div class="form-group">
                        <label>Company Name</label>
                        <input type="text" name="company" placeholder="Your Company">
                    </div>
                    <input type="hidden" name="form_source" value="final">
                    <button type="submit" class="btn-submit" style="background:var(--secondary)">Claim Your Free Session →</button>
                    <p class="form-note">✓ No credit card &nbsp;·&nbsp; 100% Free &nbsp;·&nbsp; Response in 2 hrs</p>
                </form>
            </div>
        </div>
    </div>
</section>

<!-- ── FOOTER ── -->
<footer>
    <div class="container">
        <div class="footer-inner">
            <div class="footer-brand">
            <a href="#" class="logo">LOGO_PLACEHOLDER</a>
            </div>
          
        </div>
        <p class="footer-copy">© 2026 Apex Consulting. All rights reserved. · <a href="#" style="color:var(--primary);text-decoration:none">Privacy Policy</a> · <a href="#" style="color:var(--primary);text-decoration:none">Terms</a></p>
    </div>
</footer>


`;
