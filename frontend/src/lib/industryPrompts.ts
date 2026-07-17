export const INDUSTRY_PROMPTS: Record<string, { chips: string[], templates: ((keyword: string) => string)[] }> = {
      "SaaS": {
            chips: ["B2B SaaS", "AI Tool", "CRM Software", "Analytics Dashboard"],
            templates: [
                  (keyword: string) => `IMPORTANT LAYOUT RULE: Arrange sections in this EXACT order:
1. Hero (full-width — MUST include an embedded inline lead capture form on the right or below the headline)
2. Trust/Stats Bar
3. Services / Features
4. About / Our Story
5. How It Works / Process
6. Testimonials
7. Team / Experts
8. FAQ (accordion)
9. Final CTA + Lead Capture Form
10. Footer
Design a modern, high-converting SaaS landing page for a ${keyword} product.
The design should feel innovative, trustworthy, and product-led, inspired by top-tier SaaS marketing sites.
Header
Sticky navbar, transparent turning solid on scroll
Logo left
Primary CTA button: "Start Free Trial"
Hero Section
Split layout: left headline + subtext + CTA, right animated product/dashboard mockup
Small eyebrow badge: "Now with ${keyword} AI-assist"
Headline communicating the core value of ${keyword} in one confident sentence
Supporting paragraph, two CTAs: "Start Free Trial", "Book a Demo"
Trust bar with recognizable logo placeholders below hero
Features
Bento-grid of 6 feature cards, each with icon, title, 1-2 line description, subtle hover lift
How It Works
3-step numbered process showing onboarding flow for ${keyword}
Product Showcase
Large product screenshot/mockup section with floating UI detail callouts
Integrations
Row of integration logos with short supporting copy
Testimonials
Masonry or carousel of customer quotes with photo, name, role, company
Stats
Animated counters: users, uptime %, data processed, customer rating
FAQ
Clean accordion answering common product/security/billing questions
Final CTA
Bold closing section with gradient background, headline, and lead capture form
Lead Capture Form
Form Title: Start Your Free ${keyword} Trial
Subtitle: No credit card required. Cancel anytime.
Fields: Full Name, Work Email, Company Name, Team Size (dropdown), Submit
Submit Button: Get Started Free
Form Features: rounded inputs, floating labels, inline validation, success confirmation state, mobile responsive, brand-color focus ring
Footer
Multi-column footer: Logo, Social icons, Copyright
Animations
Fade-in on scroll, staggered card reveals, counter animation, hover lift on cards, smooth CTA button transitions
Design Requirements
Pixel-perfect, fully responsive, accessible, high-conversion layout, consistent 8px spacing system, soft shadows, rounded corners throughout.`,
                  (keyword: string) => `IMPORTANT LAYOUT RULE: Arrange sections in this EXACT order:
1. Hero (full-width, bold headline + CTA)
2. Services / Features (prominent cards)
3. How It Works / Process (numbered steps)
4. Stats / Social Proof numbers
5. Team / Experts
6. Lead Capture Form (mid-page, inline, compelling)
7. Testimonials
8. About / Our Story
9. FAQ (accordion)
10. Footer
Design a modern, high-converting SaaS landing page for a ${keyword} product.
The design should feel innovative, trustworthy, and product-led, inspired by top-tier SaaS marketing sites.

Style
Ultra-modern dark mode aesthetic
Deep black (#050505) background with glowing neon accents
Header
Sticky navbar, transparent turning solid on scroll
Logo left
Primary CTA button: "Start Free Trial"
Hero Section
Split layout: left headline + subtext + CTA, right animated product/dashboard mockup
Small eyebrow badge: "Now with ${keyword} AI-assist"
Headline communicating the core value of ${keyword} in one confident sentence
Supporting paragraph, two CTAs: "Start Free Trial", "Book a Demo"
Trust bar with recognizable logo placeholders below hero
Features
Bento-grid of 6 feature cards, each with icon, title, 1-2 line description, subtle hover lift
How It Works
3-step numbered process showing onboarding flow for ${keyword}
Product Showcase
Large product screenshot/mockup section with floating UI detail callouts
Integrations
Row of integration logos with short supporting copy
Testimonials
Masonry or carousel of customer quotes with photo, name, role, company
Stats
Animated counters: users, uptime %, data processed, customer rating
FAQ
Clean accordion answering common product/security/billing questions
Final CTA
Bold closing section with gradient background, headline, and lead capture form
Lead Capture Form
Form Title: Start Your Free ${keyword} Trial
Subtitle: No credit card required. Cancel anytime.
Fields: Full Name, Work Email, Company Name, Team Size (dropdown), Submit
Submit Button: Get Started Free
Form Features: rounded inputs, floating labels, inline validation, success confirmation state, mobile responsive, brand-color focus ring
Footer
Multi-column footer: Logo, Social icons, Copyright
Animations
Fade-in on scroll, staggered card reveals, counter animation, hover lift on cards, smooth CTA button transitions
Design Requirements
Pixel-perfect, fully responsive, accessible, high-conversion layout, consistent 8px spacing system, soft shadows, rounded corners throughout.`,
                  (keyword: string) => `IMPORTANT LAYOUT RULE: Arrange sections in this EXACT order:
1. Hero (MUST have a compact inline form OR prominent single-field email/phone capture built into the hero section)
2. Stats / Social Proof numbers
3. About / Our Story
4. Services / Features
5. Testimonials (prominent, large quotes)
6. Team / Experts
7. How It Works / Process
8. Lead Capture Form
9. FAQ (accordion)
10. Footer
Design a modern, high-converting SaaS landing page for a ${keyword} product.
The design should feel innovative, trustworthy, and product-led, inspired by top-tier SaaS marketing sites.

Style
Creative, asymmetrical, brutalist aesthetic
High contrast, bold typography, broken grid layouts
Header
Sticky navbar, transparent turning solid on scroll
Logo left
Primary CTA button: "Start Free Trial"
Hero Section
Split layout: left headline + subtext + CTA, right animated product/dashboard mockup
Small eyebrow badge: "Now with ${keyword} AI-assist"
Headline communicating the core value of ${keyword} in one confident sentence
Supporting paragraph, two CTAs: "Start Free Trial", "Book a Demo"
Trust bar with recognizable logo placeholders below hero
Features
Bento-grid of 6 feature cards, each with icon, title, 1-2 line description, subtle hover lift
How It Works
3-step numbered process showing onboarding flow for ${keyword}
Product Showcase
Large product screenshot/mockup section with floating UI detail callouts
Integrations
Row of integration logos with short supporting copy
Testimonials
Masonry or carousel of customer quotes with photo, name, role, company
Stats
Animated counters: users, uptime %, data processed, customer rating
FAQ
Clean accordion answering common product/security/billing questions
Final CTA
Bold closing section with gradient background, headline, and lead capture form
Lead Capture Form
Form Title: Start Your Free ${keyword} Trial
Subtitle: No credit card required. Cancel anytime.
Fields: Full Name, Work Email, Company Name, Team Size (dropdown), Submit
Submit Button: Get Started Free
Form Features: rounded inputs, floating labels, inline validation, success confirmation state, mobile responsive, brand-color focus ring
Footer
Multi-column footer: Logo, Social icons, Copyright
Animations
Fade-in on scroll, staggered card reveals, counter animation, hover lift on cards, smooth CTA button transitions
Design Requirements
Creative, broken-grid, pixel-perfect, fully responsive, accessible, high-conversion layout, consistent 8px spacing system, soft shadows, rounded corners throughout.`,
                  (keyword: string) => `IMPORTANT LAYOUT RULE: Arrange sections in this EXACT order:
1. Hero (minimal, bold)
2. About / Our Story (right after hero)
3. Testimonials
4. Services / Features
5. Stats / Social Proof numbers
6. Lead Capture Form (prominent, centered)
7. How It Works / Process
8. Team / Experts
9. FAQ (accordion)
10. Footer
Design a modern, high-converting SaaS landing page for a ${keyword} product.
The design should feel innovative, trustworthy, and product-led, inspired by top-tier SaaS marketing sites.

Style
Minimalist, elegant, high-end aesthetic
Monochrome palette with lots of whitespace and delicate serif typography
Header
Sticky navbar, transparent turning solid on scroll
Logo left
Primary CTA button: "Start Free Trial"
Hero Section
Split layout: left headline + subtext + CTA, right animated product/dashboard mockup
Small eyebrow badge: "Now with ${keyword} AI-assist"
Headline communicating the core value of ${keyword} in one confident sentence
Supporting paragraph, two CTAs: "Start Free Trial", "Book a Demo"
Trust bar with recognizable logo placeholders below hero
Features
Bento-grid of 6 feature cards, each with icon, title, 1-2 line description, subtle hover lift
How It Works
3-step numbered process showing onboarding flow for ${keyword}
Product Showcase
Large product screenshot/mockup section with floating UI detail callouts
Integrations
Row of integration logos with short supporting copy
Testimonials
Masonry or carousel of customer quotes with photo, name, role, company
Stats
Animated counters: users, uptime %, data processed, customer rating
FAQ
Clean accordion answering common product/security/billing questions
Final CTA
Bold closing section with gradient background, headline, and lead capture form
Lead Capture Form
Form Title: Start Your Free ${keyword} Trial
Subtitle: No credit card required. Cancel anytime.
Fields: Full Name, Work Email, Company Name, Team Size (dropdown), Submit
Submit Button: Get Started Free
Form Features: rounded inputs, floating labels, inline validation, success confirmation state, mobile responsive, brand-color focus ring
Footer
Multi-column footer: Logo, Social icons, Copyright
Animations
Fade-in on scroll, staggered card reveals, counter animation, hover lift on cards, smooth CTA button transitions
Design Requirements
Pixel-perfect, fully responsive, accessible, high-conversion layout, consistent 8px spacing system, soft shadows, rounded corners throughout.`
            ]
      },
      "Agency": {
            chips: ["Digital Marketing", "Web Development", "SEO Agency", "Creative Studio"],
            templates: [
                  (keyword: string) => `IMPORTANT LAYOUT RULE: Arrange sections in this EXACT order:
1. Hero (full-width — MUST include an embedded inline lead capture form on the right or below the headline)
2. Trust/Stats Bar
3. Services / Features
4. About / Our Story
5. How It Works / Process
6. Testimonials
7. Team / Experts
8. FAQ (accordion)
9. Final CTA + Lead Capture Form
10. Footer
Design a bold, high-converting landing page for a ${keyword} agency.
The design should feel confident, creative, and results-driven, inspired by top award-winning agency portfolios.
Header
Minimal sticky navbar: Logo left
Bold CTA button: "Start a Project"
Hero Section
Full-width, massive headline stating the agency's ${keyword} promise
Short supporting line beneath
CTA button + secondary "See Our Work" link
Optional large hero image/video showing the team or work in action
Results/Stats Bar
Row of bold numbers: clients served, campaigns launched, average ROI %, years active
Services
3-4 service cards specific to ${keyword}, each with icon, title, short description, hover reveal
Case Studies / Work
Featured project grid with large imagery, client name, result achieved, "View Case Study" link
Process
Horizontal or vertical numbered steps showing how the agency delivers ${keyword} results
Team
Grid of team member cards: photo, name, role, short bio, social links
Testimonials
Large featured client quote plus supporting smaller quotes with photos
Final CTA
Full-width bold section: "Ready to grow with ${keyword}?" with a consultation request form
Consultation Form
Form Title: Let's Talk About Your ${keyword} Goals
Subtitle: Tell us about your project and we'll get back within 24 hours.
Fields: Full Name, Email, Company, Budget Range (dropdown), Project Details, Submit
Submit Button: Request a Proposal
Form Features: rounded inputs, floating labels, validation, success state, mobile responsive
Footer
Multi-column footer: Logo, Contact, Social icons, Copyright
Animations
Scroll reveal on headlines and cards, image hover zoom, button hover fill/underline animation, smooth section transitions
Design Requirements
Pixel-perfect, fully responsive, accessible, high-conversion layout, consistent 8px spacing system, confident bold typography throughout.`,
                  (keyword: string) => `IMPORTANT LAYOUT RULE: Arrange sections in this EXACT order:
1. Hero (full-width, bold headline + CTA)
2. Services / Features (prominent cards)
3. How It Works / Process (numbered steps)
4. Stats / Social Proof numbers
5. Team / Experts
6. Lead Capture Form (mid-page, inline, compelling)
7. Testimonials
8. About / Our Story
9. FAQ (accordion)
10. Footer
Design a bold, high-converting landing page for a ${keyword} agency.
The design should feel confident, creative, and results-driven, inspired by top award-winning agency portfolios.

Style
Ultra-modern dark mode aesthetic
Deep black (#050505) background with glowing neon accents
Header
Minimal sticky navbar: Logo left
Bold CTA button: "Start a Project"
Hero Section
Full-width, massive headline stating the agency's ${keyword} promise
Short supporting line beneath
CTA button + secondary "See Our Work" link
Optional large hero image/video showing the team or work in action
Results/Stats Bar
Row of bold numbers: clients served, campaigns launched, average ROI %, years active
Services
3-4 service cards specific to ${keyword}, each with icon, title, short description, hover reveal
Case Studies / Work
Featured project grid with large imagery, client name, result achieved, "View Case Study" link
Process
Horizontal or vertical numbered steps showing how the agency delivers ${keyword} results
Team
Grid of team member cards: photo, name, role, short bio, social links
Testimonials
Large featured client quote plus supporting smaller quotes with photos
Final CTA
Full-width bold section: "Ready to grow with ${keyword}?" with a consultation request form
Consultation Form
Form Title: Let's Talk About Your ${keyword} Goals
Subtitle: Tell us about your project and we'll get back within 24 hours.
Fields: Full Name, Email, Company, Budget Range (dropdown), Project Details, Submit
Submit Button: Request a Proposal
Form Features: rounded inputs, floating labels, validation, success state, mobile responsive
Footer
Multi-column footer: Logo, Contact, Social icons, Copyright
Animations
Scroll reveal on headlines and cards, image hover zoom, button hover fill/underline animation, smooth section transitions
Design Requirements
Pixel-perfect, fully responsive, accessible, high-conversion layout, consistent 8px spacing system, confident bold typography throughout.`,
                  (keyword: string) => `IMPORTANT LAYOUT RULE: Arrange sections in this EXACT order:
1. Hero (MUST have a compact inline form OR prominent single-field email/phone capture built into the hero section)
2. Stats / Social Proof numbers
3. About / Our Story
4. Services / Features
5. Testimonials (prominent, large quotes)
6. Team / Experts
7. How It Works / Process
8. Lead Capture Form
9. FAQ (accordion)
10. Footer
Design a bold, high-converting landing page for a ${keyword} agency.
The design should feel confident, creative, and results-driven, inspired by top award-winning agency portfolios.

Style
Creative, asymmetrical, brutalist aesthetic
High contrast, bold typography, broken grid layouts
Header
Minimal sticky navbar: Logo left
Bold CTA button: "Start a Project"
Hero Section
Full-width, massive headline stating the agency's ${keyword} promise
Short supporting line beneath
CTA button + secondary "See Our Work" link
Optional large hero image/video showing the team or work in action
Results/Stats Bar
Row of bold numbers: clients served, campaigns launched, average ROI %, years active
Services
3-4 service cards specific to ${keyword}, each with icon, title, short description, hover reveal
Case Studies / Work
Featured project grid with large imagery, client name, result achieved, "View Case Study" link
Process
Horizontal or vertical numbered steps showing how the agency delivers ${keyword} results
Team
Grid of team member cards: photo, name, role, short bio, social links
Testimonials
Large featured client quote plus supporting smaller quotes with photos
Final CTA
Full-width bold section: "Ready to grow with ${keyword}?" with a consultation request form
Consultation Form
Form Title: Let's Talk About Your ${keyword} Goals
Subtitle: Tell us about your project and we'll get back within 24 hours.
Fields: Full Name, Email, Company, Budget Range (dropdown), Project Details, Submit
Submit Button: Request a Proposal
Form Features: rounded inputs, floating labels, validation, success state, mobile responsive
Footer
Multi-column footer: Logo, Contact, Social icons, Copyright
Animations
Scroll reveal on headlines and cards, image hover zoom, button hover fill/underline animation, smooth section transitions
Design Requirements
Creative, broken-grid, pixel-perfect, fully responsive, accessible, high-conversion layout, consistent 8px spacing system, confident bold typography throughout.`,
                  (keyword: string) => `IMPORTANT LAYOUT RULE: Arrange sections in this EXACT order:
1. Hero (minimal, bold)
2. About / Our Story (right after hero)
3. Testimonials
4. Services / Features
5. Stats / Social Proof numbers
6. Lead Capture Form (prominent, centered)
7. How It Works / Process
8. Team / Experts
9. FAQ (accordion)
10. Footer
Design a bold, high-converting landing page for a ${keyword} agency.
The design should feel confident, creative, and results-driven, inspired by top award-winning agency portfolios.

Style
Minimalist, elegant, high-end aesthetic
Monochrome palette with lots of whitespace and delicate serif typography
Header
Minimal sticky navbar: Logo left
Bold CTA button: "Start a Project"
Hero Section
Full-width, massive headline stating the agency's ${keyword} promise
Short supporting line beneath
CTA button + secondary "See Our Work" link
Optional large hero image/video showing the team or work in action
Results/Stats Bar
Row of bold numbers: clients served, campaigns launched, average ROI %, years active
Services
3-4 service cards specific to ${keyword}, each with icon, title, short description, hover reveal
Case Studies / Work
Featured project grid with large imagery, client name, result achieved, "View Case Study" link
Process
Horizontal or vertical numbered steps showing how the agency delivers ${keyword} results
Team
Grid of team member cards: photo, name, role, short bio, social links
Testimonials
Large featured client quote plus supporting smaller quotes with photos
Final CTA
Full-width bold section: "Ready to grow with ${keyword}?" with a consultation request form
Consultation Form
Form Title: Let's Talk About Your ${keyword} Goals
Subtitle: Tell us about your project and we'll get back within 24 hours.
Fields: Full Name, Email, Company, Budget Range (dropdown), Project Details, Submit
Submit Button: Request a Proposal
Form Features: rounded inputs, floating labels, validation, success state, mobile responsive
Footer
Multi-column footer: Logo, Contact, Social icons, Copyright
Animations
Scroll reveal on headlines and cards, image hover zoom, button hover fill/underline animation, smooth section transitions
Design Requirements
Pixel-perfect, fully responsive, accessible, high-conversion layout, consistent 8px spacing system, confident bold typography throughout.`
            ]
      },
      "E-commerce": {
            chips: ["Fashion Apparel", "Tech Gadgets", "Beauty Products", "Home Decor"],
            templates: [
                  (keyword: string) => `IMPORTANT LAYOUT RULE: Arrange sections in this EXACT order:
1. Hero (full-width — MUST include an embedded inline lead capture form on the right or below the headline)
2. Trust/Stats Bar
3. Services / Features
4. About / Our Story
5. How It Works / Process
6. Testimonials
7. Team / Experts
8. FAQ (accordion)
9. Final CTA + Lead Capture Form
10. Footer
Design a vibrant, high-converting e-commerce landing page for a ${keyword} brand.
The design should feel desirable, trustworthy, and shoppable, inspired by top DTC brand websites.
Header
Sticky navbar: Logo center or left, Cart icon
Announcement bar above navbar: limited-time offer or free shipping message
Hero Section
Full-width lifestyle image or product hero shot for ${keyword}
Bold headline highlighting the standout benefit
Subtext + CTA button: "Shop Now"
Optional discount badge or "New Arrival" tag
Trust/Featured In Bar
Row of press logos or "As Seen In" badges
Best Sellers / Product Grid
Grid of 4-6 product cards: image, name, price, quick "Add to Cart" button, star rating
Category Highlights
2-3 large lifestyle banners linking to collections within ${keyword}
Why Choose Us
3-4 icon feature blocks: quality, shipping, returns, guarantee
Social Proof
Customer review carousel with photos, star ratings, and quotes; optional UGC image grid
Bundle / Subscription Offer
Highlighted section for bundles or subscribe-and-save option relevant to ${keyword}
FAQ
Accordion covering shipping, returns, sizing/usage
Final CTA
Bold banner section with discount hook and email capture form
Email Capture Form
Form Title: Get 10% Off Your First ${keyword} Order
Subtitle: Join our list for early access and exclusive drops.
Fields: Email Address, Submit
Submit Button: Claim My Discount
Form Features: rounded input, inline validation, success confirmation, mobile responsive, brand-color focus state
Footer
Multi-column footer: Logo, Help, Newsletter signup, Social icons, Payment icons, Copyright
Animations
Product image hover zoom, scroll reveal on sections, add-to-cart micro-interaction, smooth carousel transitions
Design Requirements
Pixel-perfect, fully responsive, accessible, high-conversion layout, consistent 8px spacing system, premium product photography treatment throughout.`,
                  (keyword: string) => `IMPORTANT LAYOUT RULE: Arrange sections in this EXACT order:
1. Hero (full-width, bold headline + CTA)
2. Services / Features (prominent cards)
3. How It Works / Process (numbered steps)
4. Stats / Social Proof numbers
5. Team / Experts
6. Lead Capture Form (mid-page, inline, compelling)
7. Testimonials
8. About / Our Story
9. FAQ (accordion)
10. Footer
Design a vibrant, high-converting e-commerce landing page for a ${keyword} brand.
The design should feel desirable, trustworthy, and shoppable, inspired by top DTC brand websites.

Style
Ultra-modern dark mode aesthetic
Deep black (#050505) background with glowing neon accents
Header
Sticky navbar: Logo center or left, Cart icon
Announcement bar above navbar: limited-time offer or free shipping message
Hero Section
Full-width lifestyle image or product hero shot for ${keyword}
Bold headline highlighting the standout benefit
Subtext + CTA button: "Shop Now"
Optional discount badge or "New Arrival" tag
Trust/Featured In Bar
Row of press logos or "As Seen In" badges
Best Sellers / Product Grid
Grid of 4-6 product cards: image, name, price, quick "Add to Cart" button, star rating
Category Highlights
2-3 large lifestyle banners linking to collections within ${keyword}
Why Choose Us
3-4 icon feature blocks: quality, shipping, returns, guarantee
Social Proof
Customer review carousel with photos, star ratings, and quotes; optional UGC image grid
Bundle / Subscription Offer
Highlighted section for bundles or subscribe-and-save option relevant to ${keyword}
FAQ
Accordion covering shipping, returns, sizing/usage
Final CTA
Bold banner section with discount hook and email capture form
Email Capture Form
Form Title: Get 10% Off Your First ${keyword} Order
Subtitle: Join our list for early access and exclusive drops.
Fields: Email Address, Submit
Submit Button: Claim My Discount
Form Features: rounded input, inline validation, success confirmation, mobile responsive, brand-color focus state
Footer
Multi-column footer: Logo, Help, Newsletter signup, Social icons, Payment icons, Copyright
Animations
Product image hover zoom, scroll reveal on sections, add-to-cart micro-interaction, smooth carousel transitions
Design Requirements
Pixel-perfect, fully responsive, accessible, high-conversion layout, consistent 8px spacing system, premium product photography treatment throughout.`,
                  (keyword: string) => `IMPORTANT LAYOUT RULE: Arrange sections in this EXACT order:
1. Hero (MUST have a compact inline form OR prominent single-field email/phone capture built into the hero section)
2. Stats / Social Proof numbers
3. About / Our Story
4. Services / Features
5. Testimonials (prominent, large quotes)
6. Team / Experts
7. How It Works / Process
8. Lead Capture Form
9. FAQ (accordion)
10. Footer
Design a vibrant, high-converting e-commerce landing page for a ${keyword} brand.
The design should feel desirable, trustworthy, and shoppable, inspired by top DTC brand websites.

Style
Creative, asymmetrical, brutalist aesthetic
High contrast, bold typography, broken grid layouts
Header
Sticky navbar: Logo center or left, Cart icon
Announcement bar above navbar: limited-time offer or free shipping message
Hero Section
Full-width lifestyle image or product hero shot for ${keyword}
Bold headline highlighting the standout benefit
Subtext + CTA button: "Shop Now"
Optional discount badge or "New Arrival" tag
Trust/Featured In Bar
Row of press logos or "As Seen In" badges
Best Sellers / Product Grid
Grid of 4-6 product cards: image, name, price, quick "Add to Cart" button, star rating
Category Highlights
2-3 large lifestyle banners linking to collections within ${keyword}
Why Choose Us
3-4 icon feature blocks: quality, shipping, returns, guarantee
Social Proof
Customer review carousel with photos, star ratings, and quotes; optional UGC image grid
Bundle / Subscription Offer
Highlighted section for bundles or subscribe-and-save option relevant to ${keyword}
FAQ
Accordion covering shipping, returns, sizing/usage
Final CTA
Bold banner section with discount hook and email capture form
Email Capture Form
Form Title: Get 10% Off Your First ${keyword} Order
Subtitle: Join our list for early access and exclusive drops.
Fields: Email Address, Submit
Submit Button: Claim My Discount
Form Features: rounded input, inline validation, success confirmation, mobile responsive, brand-color focus state
Footer
Multi-column footer: Logo, Help, Newsletter signup, Social icons, Payment icons, Copyright
Animations
Product image hover zoom, scroll reveal on sections, add-to-cart micro-interaction, smooth carousel transitions
Design Requirements
Creative, broken-grid, pixel-perfect, fully responsive, accessible, high-conversion layout, consistent 8px spacing system, premium product photography treatment throughout.`,
                  (keyword: string) => `IMPORTANT LAYOUT RULE: Arrange sections in this EXACT order:
1. Hero (minimal, bold)
2. About / Our Story (right after hero)
3. Testimonials
4. Services / Features
5. Stats / Social Proof numbers
6. Lead Capture Form (prominent, centered)
7. How It Works / Process
8. Team / Experts
9. FAQ (accordion)
10. Footer
Design a vibrant, high-converting e-commerce landing page for a ${keyword} brand.
The design should feel desirable, trustworthy, and shoppable, inspired by top DTC brand websites.

Style
Minimalist, elegant, high-end aesthetic
Monochrome palette with lots of whitespace and delicate serif typography
Header
Sticky navbar: Logo center or left, Cart icon
Announcement bar above navbar: limited-time offer or free shipping message
Hero Section
Full-width lifestyle image or product hero shot for ${keyword}
Bold headline highlighting the standout benefit
Subtext + CTA button: "Shop Now"
Optional discount badge or "New Arrival" tag
Trust/Featured In Bar
Row of press logos or "As Seen In" badges
Best Sellers / Product Grid
Grid of 4-6 product cards: image, name, price, quick "Add to Cart" button, star rating
Category Highlights
2-3 large lifestyle banners linking to collections within ${keyword}
Why Choose Us
3-4 icon feature blocks: quality, shipping, returns, guarantee
Social Proof
Customer review carousel with photos, star ratings, and quotes; optional UGC image grid
Bundle / Subscription Offer
Highlighted section for bundles or subscribe-and-save option relevant to ${keyword}
FAQ
Accordion covering shipping, returns, sizing/usage
Final CTA
Bold banner section with discount hook and email capture form
Email Capture Form
Form Title: Get 10% Off Your First ${keyword} Order
Subtitle: Join our list for early access and exclusive drops.
Fields: Email Address, Submit
Submit Button: Claim My Discount
Form Features: rounded input, inline validation, success confirmation, mobile responsive, brand-color focus state
Footer
Multi-column footer: Logo, Help, Newsletter signup, Social icons, Payment icons, Copyright
Animations
Product image hover zoom, scroll reveal on sections, add-to-cart micro-interaction, smooth carousel transitions
Design Requirements
Pixel-perfect, fully responsive, accessible, high-conversion layout, consistent 8px spacing system, premium product photography treatment throughout.`
            ]
      },
      "Healthcare": {
            chips: ["Dental Care", "Pediatrics", "Mental Health", "Cosmetic Surgery"],
            templates: [
                  (keyword: string) => `IMPORTANT LAYOUT RULE: Arrange sections in this EXACT order:
1. Hero (full-width — MUST include an embedded inline lead capture form on the right or below the headline)
2. Trust/Stats Bar
3. Services / Features
4. About / Our Story
5. How It Works / Process
6. Testimonials
7. Team / Experts
8. FAQ (accordion)
9. Final CTA + Lead Capture Form
10. Footer
Design a clean, reassuring landing page for a ${keyword} practice.
The design should feel calm, trustworthy, and professional, inspired by top modern healthcare websites.
Header
Sticky navbar: Logo left, Contact
Primary CTA button: "Book Appointment"
Hero Section
Warm, welcoming image or split layout with headline + supporting text
Headline focused on patient outcomes for ${keyword}
CTA buttons: "Book an Appointment", "Call Us Now"
Small trust badges: certifications, insurance accepted, years in practice
Services
Grid of service cards specific to ${keyword}, each with icon, title, short description
Meet the Providers
Grid of doctor/provider cards: photo, name, credentials, specialty, "View Profile" link
Why Choose Us
4 feature blocks: experienced staff, modern technology, patient-first care, flexible scheduling
Patient Testimonials
Carousel of patient reviews with star ratings and short quotes
Insurance & Accessibility
Section listing accepted insurance providers and accessibility accommodations
FAQ
Accordion answering common questions about ${keyword} treatment, cost, and what to expect
Final CTA
Calm, reassuring closing section with appointment booking form
Appointment Form
Form Title: Book Your ${keyword} Appointment
Subtitle: We'll confirm your preferred time within one business day.
Fields: Full Name, Phone Number, Email, Preferred Date, Reason for Visit, Submit
Submit Button: Request Appointment
Form Features: rounded inputs, floating labels, validation, confidential-data note, success confirmation, mobile responsive
Footer
Multi-column footer: Logo, Locations, Hours, Contact, Social icons, Copyright
Animations
Gentle fade-in on scroll, subtle hover lift on cards, smooth carousel transitions — nothing jarring or fast
Design Requirements
Pixel-perfect, fully responsive, accessible (WCAG-friendly contrast), calm high-conversion layout, consistent 8px spacing system throughout.`,
                  (keyword: string) => `IMPORTANT LAYOUT RULE: Arrange sections in this EXACT order:
1. Hero (full-width, bold headline + CTA)
2. Services / Features (prominent cards)
3. How It Works / Process (numbered steps)
4. Stats / Social Proof numbers
5. Team / Experts
6. Lead Capture Form (mid-page, inline, compelling)
7. Testimonials
8. About / Our Story
9. FAQ (accordion)
10. Footer
Design a clean, reassuring landing page for a ${keyword} practice.
The design should feel calm, trustworthy, and professional, inspired by top modern healthcare websites.

Style
Ultra-modern dark mode aesthetic
Deep black (#050505) background with glowing neon accents
Header
Sticky navbar: Logo left, Contact
Primary CTA button: "Book Appointment"
Hero Section
Warm, welcoming image or split layout with headline + supporting text
Headline focused on patient outcomes for ${keyword}
CTA buttons: "Book an Appointment", "Call Us Now"
Small trust badges: certifications, insurance accepted, years in practice
Services
Grid of service cards specific to ${keyword}, each with icon, title, short description
Meet the Providers
Grid of doctor/provider cards: photo, name, credentials, specialty, "View Profile" link
Why Choose Us
4 feature blocks: experienced staff, modern technology, patient-first care, flexible scheduling
Patient Testimonials
Carousel of patient reviews with star ratings and short quotes
Insurance & Accessibility
Section listing accepted insurance providers and accessibility accommodations
FAQ
Accordion answering common questions about ${keyword} treatment, cost, and what to expect
Final CTA
Calm, reassuring closing section with appointment booking form
Appointment Form
Form Title: Book Your ${keyword} Appointment
Subtitle: We'll confirm your preferred time within one business day.
Fields: Full Name, Phone Number, Email, Preferred Date, Reason for Visit, Submit
Submit Button: Request Appointment
Form Features: rounded inputs, floating labels, validation, confidential-data note, success confirmation, mobile responsive
Footer
Multi-column footer: Logo, Locations, Hours, Contact, Social icons, Copyright
Animations
Gentle fade-in on scroll, subtle hover lift on cards, smooth carousel transitions — nothing jarring or fast
Design Requirements
Pixel-perfect, fully responsive, accessible (WCAG-friendly contrast), calm high-conversion layout, consistent 8px spacing system throughout.`,
                  (keyword: string) => `IMPORTANT LAYOUT RULE: Arrange sections in this EXACT order:
1. Hero (MUST have a compact inline form OR prominent single-field email/phone capture built into the hero section)
2. Stats / Social Proof numbers
3. About / Our Story
4. Services / Features
5. Testimonials (prominent, large quotes)
6. Team / Experts
7. How It Works / Process
8. Lead Capture Form
9. FAQ (accordion)
10. Footer
Design a clean, reassuring landing page for a ${keyword} practice.
The design should feel calm, trustworthy, and professional, inspired by top modern healthcare websites.

Style
Creative, asymmetrical, brutalist aesthetic
High contrast, bold typography, broken grid layouts
Header
Sticky navbar: Logo left, Contact
Primary CTA button: "Book Appointment"
Hero Section
Warm, welcoming image or split layout with headline + supporting text
Headline focused on patient outcomes for ${keyword}
CTA buttons: "Book an Appointment", "Call Us Now"
Small trust badges: certifications, insurance accepted, years in practice
Services
Grid of service cards specific to ${keyword}, each with icon, title, short description
Meet the Providers
Grid of doctor/provider cards: photo, name, credentials, specialty, "View Profile" link
Why Choose Us
4 feature blocks: experienced staff, modern technology, patient-first care, flexible scheduling
Patient Testimonials
Carousel of patient reviews with star ratings and short quotes
Insurance & Accessibility
Section listing accepted insurance providers and accessibility accommodations
FAQ
Accordion answering common questions about ${keyword} treatment, cost, and what to expect
Final CTA
Calm, reassuring closing section with appointment booking form
Appointment Form
Form Title: Book Your ${keyword} Appointment
Subtitle: We'll confirm your preferred time within one business day.
Fields: Full Name, Phone Number, Email, Preferred Date, Reason for Visit, Submit
Submit Button: Request Appointment
Form Features: rounded inputs, floating labels, validation, confidential-data note, success confirmation, mobile responsive
Footer
Multi-column footer: Logo, Locations, Hours, Contact, Social icons, Copyright
Animations
Gentle fade-in on scroll, subtle hover lift on cards, smooth carousel transitions — nothing jarring or fast
Design Requirements
Creative, broken-grid, pixel-perfect, fully responsive, accessible (WCAG-friendly contrast), calm high-conversion layout, consistent 8px spacing system throughout.`,
                  (keyword: string) => `IMPORTANT LAYOUT RULE: Arrange sections in this EXACT order:
1. Hero (minimal, bold)
2. About / Our Story (right after hero)
3. Testimonials
4. Services / Features
5. Stats / Social Proof numbers
6. Lead Capture Form (prominent, centered)
7. How It Works / Process
8. Team / Experts
9. FAQ (accordion)
10. Footer
Design a clean, reassuring landing page for a ${keyword} practice.
The design should feel calm, trustworthy, and professional, inspired by top modern healthcare websites.

Style
Minimalist, elegant, high-end aesthetic
Monochrome palette with lots of whitespace and delicate serif typography
Header
Sticky navbar: Logo left, Contact
Primary CTA button: "Book Appointment"
Hero Section
Warm, welcoming image or split layout with headline + supporting text
Headline focused on patient outcomes for ${keyword}
CTA buttons: "Book an Appointment", "Call Us Now"
Small trust badges: certifications, insurance accepted, years in practice
Services
Grid of service cards specific to ${keyword}, each with icon, title, short description
Meet the Providers
Grid of doctor/provider cards: photo, name, credentials, specialty, "View Profile" link
Why Choose Us
4 feature blocks: experienced staff, modern technology, patient-first care, flexible scheduling
Patient Testimonials
Carousel of patient reviews with star ratings and short quotes
Insurance & Accessibility
Section listing accepted insurance providers and accessibility accommodations
FAQ
Accordion answering common questions about ${keyword} treatment, cost, and what to expect
Final CTA
Calm, reassuring closing section with appointment booking form
Appointment Form
Form Title: Book Your ${keyword} Appointment
Subtitle: We'll confirm your preferred time within one business day.
Fields: Full Name, Phone Number, Email, Preferred Date, Reason for Visit, Submit
Submit Button: Request Appointment
Form Features: rounded inputs, floating labels, validation, confidential-data note, success confirmation, mobile responsive
Footer
Multi-column footer: Logo, Locations, Hours, Contact, Social icons, Copyright
Animations
Gentle fade-in on scroll, subtle hover lift on cards, smooth carousel transitions — nothing jarring or fast
Design Requirements
Pixel-perfect, fully responsive, accessible (WCAG-friendly contrast), calm high-conversion layout, consistent 8px spacing system throughout.`
            ]
      },
      "Real Estate": {
            chips: ["Luxury Homes", "Commercial Properties", "Property Management", "Home Valuation"],
            templates: [
                  (keyword: string) => `IMPORTANT LAYOUT RULE: Arrange sections in this EXACT order:
1. Hero (full-width — MUST include an embedded inline lead capture form on the right or below the headline)
2. Trust/Stats Bar
3. Services / Features
4. About / Our Story
5. Featured Listings
6. How It Works / Process
7. Testimonials
8. FAQ (accordion)
9. Final CTA
10. Footer
Design a premium, elegant landing page focused on ${keyword}.
The design should feel aspirational, trustworthy, and high-end, inspired by top real estate and property brand websites.
Header
Transparent navbar becoming solid on scroll
Logo left
CTA button: "Schedule a Viewing" or "Get Free Valuation"
Hero Section
Full-bleed property/lifestyle photograph with gradient overlay
Headline centered on the promise of ${keyword}
Supporting paragraph + CTA button
Floating stats card: properties sold, years of experience, average days on market, client satisfaction %
Featured Listings / Highlights
Grid of 3-6 property cards relevant to ${keyword}: image, key details, location, "View Details" button
Why Work With Us
4 feature blocks: local expertise, negotiation skill, marketing reach, client-first process
Agent / Team Profile
Photo, bio, credentials, and a personal quote building trust
Client Testimonials
Elegant carousel of client reviews with photo, quote, and result achieved
Process
Simple numbered steps walking through the ${keyword} journey from first contact to close
FAQ
Accordion covering common questions about ${keyword}
Final CTA
Large closing section with a warm headline and inquiry form
Inquiry Form
Form Title: Get Started With ${keyword}
Subtitle: Share a few details and we'll be in touch within 24 hours.
Fields: Full Name, Email, Phone Number, Property Address (optional), Message, Submit
Submit Button: Request Information
Form Features: rounded inputs, floating labels, validation, success confirmation, mobile responsive, gold-accent focus state
Footer
Multi-column footer: Logo, Contact, Social icons, License/brokerage info, Copyright
Animations
Smooth fade-in, scroll reveal, image zoom on hover, counter animation, sticky header transition
Design Requirements
Pixel-perfect, fully responsive, accessible, high-conversion layout, consistent 8px spacing system, premium real estate photography treatment throughout.`,
                  (keyword: string) => `IMPORTANT LAYOUT RULE: Arrange sections in this EXACT order:
1. Hero (full-width, bold headline + CTA)
2. Featured Listings
3. Stats / Social Proof numbers
4. Services / Features
5. How It Works / Process
6. Lead Capture Form (mid-page, inline, compelling)
7. About / Our Story
8. Team / Experts
9. Testimonials
10. Footer
Design a premium, elegant landing page focused on ${keyword}.
The design should feel aspirational, trustworthy, and high-end, inspired by top real estate and property brand websites.

Style
Ultra-modern dark mode aesthetic
Deep black (#050505) background with glowing neon accents
Header
Transparent navbar becoming solid on scroll
Logo left
CTA button: "Schedule a Viewing" or "Get Free Valuation"
Hero Section
Full-bleed property/lifestyle photograph with gradient overlay
Headline centered on the promise of ${keyword}
Supporting paragraph + CTA button
Floating stats card: properties sold, years of experience, average days on market, client satisfaction %
Featured Listings / Highlights
Grid of 3-6 property cards relevant to ${keyword}: image, key details, location, "View Details" button
Why Work With Us
4 feature blocks: local expertise, negotiation skill, marketing reach, client-first process
Agent / Team Profile
Photo, bio, credentials, and a personal quote building trust
Client Testimonials
Elegant carousel of client reviews with photo, quote, and result achieved
Process
Simple numbered steps walking through the ${keyword} journey from first contact to close
FAQ
Accordion covering common questions about ${keyword}
Final CTA
Large closing section with a warm headline and inquiry form
Inquiry Form
Form Title: Get Started With ${keyword}
Subtitle: Share a few details and we'll be in touch within 24 hours.
Fields: Full Name, Email, Phone Number, Property Address (optional), Message, Submit
Submit Button: Request Information
Form Features: rounded inputs, floating labels, validation, success confirmation, mobile responsive, gold-accent focus state
Footer
Multi-column footer: Logo, Contact, Social icons, License/brokerage info, Copyright
Animations
Smooth fade-in, scroll reveal, image zoom on hover, counter animation, sticky header transition
Design Requirements
Pixel-perfect, fully responsive, accessible, high-conversion layout, consistent 8px spacing system, premium real estate photography treatment throughout.`,
                  (keyword: string) => `IMPORTANT LAYOUT RULE: Arrange sections in this EXACT order:
1. Hero (minimal, bold)
2. Lead Capture Form (prominent, centered right below hero)
3. About / Our Story
4. Services / Features
5. Testimonials (prominent, large quotes)
6. Featured Listings
7. Stats / Social Proof
8. FAQ (accordion)
9. Final CTA
10. Footer
Design a premium, elegant landing page focused on ${keyword}.
The design should feel aspirational, trustworthy, and high-end, inspired by top real estate and property brand websites.

Style
Creative, asymmetrical, brutalist aesthetic
High contrast, bold typography, broken grid layouts
Header
Transparent navbar becoming solid on scroll
Logo left
CTA button: "Schedule a Viewing" or "Get Free Valuation"
Hero Section
Full-bleed property/lifestyle photograph with gradient overlay
Headline centered on the promise of ${keyword}
Supporting paragraph + CTA button
Floating stats card: properties sold, years of experience, average days on market, client satisfaction %
Featured Listings / Highlights
Grid of 3-6 property cards relevant to ${keyword}: image, key details, location, "View Details" button
Why Work With Us
4 feature blocks: local expertise, negotiation skill, marketing reach, client-first process
Agent / Team Profile
Photo, bio, credentials, and a personal quote building trust
Client Testimonials
Elegant carousel of client reviews with photo, quote, and result achieved
Process
Simple numbered steps walking through the ${keyword} journey from first contact to close
FAQ
Accordion covering common questions about ${keyword}
Final CTA
Large closing section with a warm headline and inquiry form
Inquiry Form
Form Title: Get Started With ${keyword}
Subtitle: Share a few details and we'll be in touch within 24 hours.
Fields: Full Name, Email, Phone Number, Property Address (optional), Message, Submit
Submit Button: Request Information
Form Features: rounded inputs, floating labels, validation, success confirmation, mobile responsive, gold-accent focus state
Footer
Multi-column footer: Logo, Contact, Social icons, License/brokerage info, Copyright
Animations
Smooth fade-in, scroll reveal, image zoom on hover, counter animation, sticky header transition
Design Requirements
Creative, broken-grid, pixel-perfect, fully responsive, accessible, high-conversion layout, consistent 8px spacing system, premium real estate photography treatment throughout.`,
                  (keyword: string) => `IMPORTANT LAYOUT RULE: Arrange sections in this EXACT order:
1. Hero (split layout)
2. About / Our Story (right after hero)
3. How It Works / Process
4. Lead Capture Form (inline, elegant)
5. Featured Listings
6. Services / Features
7. Team / Experts
8. Testimonials
9. FAQ (accordion)
10. Footer
Design a premium, elegant landing page focused on ${keyword}.
The design should feel aspirational, trustworthy, and high-end, inspired by top real estate and property brand websites.

Style
Minimalist, elegant, high-end aesthetic
Monochrome palette with lots of whitespace and delicate serif typography
Header
Transparent navbar becoming solid on scroll
Logo left
CTA button: "Schedule a Viewing" or "Get Free Valuation"
Hero Section
Full-bleed property/lifestyle photograph with gradient overlay
Headline centered on the promise of ${keyword}
Supporting paragraph + CTA button
Floating stats card: properties sold, years of experience, average days on market, client satisfaction %
Featured Listings / Highlights
Grid of 3-6 property cards relevant to ${keyword}: image, key details, location, "View Details" button
Why Work With Us
4 feature blocks: local expertise, negotiation skill, marketing reach, client-first process
Agent / Team Profile
Photo, bio, credentials, and a personal quote building trust
Client Testimonials
Elegant carousel of client reviews with photo, quote, and result achieved
Process
Simple numbered steps walking through the ${keyword} journey from first contact to close
FAQ
Accordion covering common questions about ${keyword}
Final CTA
Large closing section with a warm headline and inquiry form
Inquiry Form
Form Title: Get Started With ${keyword}
Subtitle: Share a few details and we'll be in touch within 24 hours.
Fields: Full Name, Email, Phone Number, Property Address (optional), Message, Submit
Submit Button: Request Information
Form Features: rounded inputs, floating labels, validation, success confirmation, mobile responsive, gold-accent focus state
Footer
Multi-column footer: Logo, Contact, Social icons, License/brokerage info, Copyright
Animations
Smooth fade-in, scroll reveal, image zoom on hover, counter animation, sticky header transition
Design Requirements
Pixel-perfect, fully responsive, accessible, high-conversion layout, consistent 8px spacing system, premium real estate photography treatment throughout.`
            ]
      },
      "Plumber": {
            chips: ["Emergency Plumbing", "Drain Cleaning", "Water Heaters", "Pipe Repair"],
            templates: [
                  (keyword: string) => `IMPORTANT LAYOUT RULE: Arrange sections in this EXACT order:
1. Hero (full-width — MUST include an embedded inline lead capture form on the right or below the headline)
2. Trust/Stats Bar
3. Services / Features
4. About / Our Story
5. How It Works / Process
6. Testimonials
7. Team / Experts
8. FAQ (accordion)
9. Final CTA + Lead Capture Form
10. Footer
Design a bold, high-converting local service landing page for a ${keyword} business.
The design should feel reliable, fast, and trustworthy, inspired by top local trade service websites.
Header
Sticky navbar: Logo left, Contact
Phone number prominently displayed, click-to-call on mobile
Bold CTA button: "Get a Free Quote"
Hero Section
Strong headline promising fast, reliable ${keyword} service
Subtext mentioning 24/7 availability or same-day service
Two CTAs: "Call Now", "Request a Quote"
Trust badges: licensed & insured, years in business, 5-star rating
Services
Grid of service cards specific to ${keyword}, each with icon, title, short description
Why Choose Us
4 feature blocks: fast response time, upfront pricing, licensed technicians, satisfaction guarantee
Service Area
Simple map or list section showing coverage area
Before/After or Work Gallery
Photo grid showcasing completed ${keyword} jobs
Customer Reviews
Carousel or grid of star-rated reviews with customer name and short quote
FAQ
Accordion answering common questions about ${keyword}, response time, and cost
Final CTA
Bold banner: "Need Help Now?" with phone number and a quick quote form
Quote Request Form
Form Title: Get a Free ${keyword} Quote
Subtitle: Fill out the form and we'll call you back within 15 minutes.
Fields: Full Name, Phone Number, Address, Describe the Issue, Submit
Submit Button: Request Free Quote
Form Features: large rounded inputs, floating labels, validation, success confirmation, mobile responsive, high-contrast focus state
Footer
Multi-column footer: Logo, Service Area, Contact, Licensing info, Social icons, Copyright
Animations
Subtle fade-in on scroll, button hover states, gentle pulse on the "Call Now" button
Design Requirements
Pixel-perfect, fully responsive, accessible, high-conversion layout optimized for mobile "click-to-call", consistent 8px spacing system throughout.`,
                  (keyword: string) => `IMPORTANT LAYOUT RULE: Arrange sections in this EXACT order:
1. Hero (full-width, bold headline + CTA)
2. Services / Features (prominent cards)
3. How It Works / Process (numbered steps)
4. Stats / Social Proof numbers
5. Team / Experts
6. Lead Capture Form (mid-page, inline, compelling)
7. Testimonials
8. About / Our Story
9. FAQ (accordion)
10. Footer
Design a bold, high-converting local service landing page for a ${keyword} business.
The design should feel reliable, fast, and trustworthy, inspired by top local trade service websites.

Style
Ultra-modern dark mode aesthetic
Deep black (#050505) background with glowing neon accents
Header
Sticky navbar: Logo left, Contact
Phone number prominently displayed, click-to-call on mobile
Bold CTA button: "Get a Free Quote"
Hero Section
Strong headline promising fast, reliable ${keyword} service
Subtext mentioning 24/7 availability or same-day service
Two CTAs: "Call Now", "Request a Quote"
Trust badges: licensed & insured, years in business, 5-star rating
Services
Grid of service cards specific to ${keyword}, each with icon, title, short description
Why Choose Us
4 feature blocks: fast response time, upfront pricing, licensed technicians, satisfaction guarantee
Service Area
Simple map or list section showing coverage area
Before/After or Work Gallery
Photo grid showcasing completed ${keyword} jobs
Customer Reviews
Carousel or grid of star-rated reviews with customer name and short quote
FAQ
Accordion answering common questions about ${keyword}, response time, and cost
Final CTA
Bold banner: "Need Help Now?" with phone number and a quick quote form
Quote Request Form
Form Title: Get a Free ${keyword} Quote
Subtitle: Fill out the form and we'll call you back within 15 minutes.
Fields: Full Name, Phone Number, Address, Describe the Issue, Submit
Submit Button: Request Free Quote
Form Features: large rounded inputs, floating labels, validation, success confirmation, mobile responsive, high-contrast focus state
Footer
Multi-column footer: Logo, Service Area, Contact, Licensing info, Social icons, Copyright
Animations
Subtle fade-in on scroll, button hover states, gentle pulse on the "Call Now" button
Design Requirements
Pixel-perfect, fully responsive, accessible, high-conversion layout optimized for mobile "click-to-call", consistent 8px spacing system throughout.`,
                  (keyword: string) => `IMPORTANT LAYOUT RULE: Arrange sections in this EXACT order:
1. Hero (MUST have a compact inline form OR prominent single-field email/phone capture built into the hero section)
2. Stats / Social Proof numbers
3. About / Our Story
4. Services / Features
5. Testimonials (prominent, large quotes)
6. Team / Experts
7. How It Works / Process
8. Lead Capture Form
9. FAQ (accordion)
10. Footer
Design a bold, high-converting local service landing page for a ${keyword} business.
The design should feel reliable, fast, and trustworthy, inspired by top local trade service websites.

Style
Creative, asymmetrical, brutalist aesthetic
High contrast, bold typography, broken grid layouts
Header
Sticky navbar: Logo left, Contact
Phone number prominently displayed, click-to-call on mobile
Bold CTA button: "Get a Free Quote"
Hero Section
Strong headline promising fast, reliable ${keyword} service
Subtext mentioning 24/7 availability or same-day service
Two CTAs: "Call Now", "Request a Quote"
Trust badges: licensed & insured, years in business, 5-star rating
Services
Grid of service cards specific to ${keyword}, each with icon, title, short description
Why Choose Us
4 feature blocks: fast response time, upfront pricing, licensed technicians, satisfaction guarantee
Service Area
Simple map or list section showing coverage area
Before/After or Work Gallery
Photo grid showcasing completed ${keyword} jobs
Customer Reviews
Carousel or grid of star-rated reviews with customer name and short quote
FAQ
Accordion answering common questions about ${keyword}, response time, and cost
Final CTA
Bold banner: "Need Help Now?" with phone number and a quick quote form
Quote Request Form
Form Title: Get a Free ${keyword} Quote
Subtitle: Fill out the form and we'll call you back within 15 minutes.
Fields: Full Name, Phone Number, Address, Describe the Issue, Submit
Submit Button: Request Free Quote
Form Features: large rounded inputs, floating labels, validation, success confirmation, mobile responsive, high-contrast focus state
Footer
Multi-column footer: Logo, Service Area, Contact, Licensing info, Social icons, Copyright
Animations
Subtle fade-in on scroll, button hover states, gentle pulse on the "Call Now" button
Design Requirements
Creative, broken-grid, pixel-perfect, fully responsive, accessible, high-conversion layout optimized for mobile "click-to-call", consistent 8px spacing system throughout.`,
                  (keyword: string) => `IMPORTANT LAYOUT RULE: Arrange sections in this EXACT order:
1. Hero (minimal, bold)
2. About / Our Story (right after hero)
3. Testimonials
4. Services / Features
5. Stats / Social Proof numbers
6. Lead Capture Form (prominent, centered)
7. How It Works / Process
8. Team / Experts
9. FAQ (accordion)
10. Footer
Design a bold, high-converting local service landing page for a ${keyword} business.
The design should feel reliable, fast, and trustworthy, inspired by top local trade service websites.

Style
Minimalist, elegant, high-end aesthetic
Monochrome palette with lots of whitespace and delicate serif typography
Header
Sticky navbar: Logo left, Contact
Phone number prominently displayed, click-to-call on mobile
Bold CTA button: "Get a Free Quote"
Hero Section
Strong headline promising fast, reliable ${keyword} service
Subtext mentioning 24/7 availability or same-day service
Two CTAs: "Call Now", "Request a Quote"
Trust badges: licensed & insured, years in business, 5-star rating
Services
Grid of service cards specific to ${keyword}, each with icon, title, short description
Why Choose Us
4 feature blocks: fast response time, upfront pricing, licensed technicians, satisfaction guarantee
Service Area
Simple map or list section showing coverage area
Before/After or Work Gallery
Photo grid showcasing completed ${keyword} jobs
Customer Reviews
Carousel or grid of star-rated reviews with customer name and short quote
FAQ
Accordion answering common questions about ${keyword}, response time, and cost
Final CTA
Bold banner: "Need Help Now?" with phone number and a quick quote form
Quote Request Form
Form Title: Get a Free ${keyword} Quote
Subtitle: Fill out the form and we'll call you back within 15 minutes.
Fields: Full Name, Phone Number, Address, Describe the Issue, Submit
Submit Button: Request Free Quote
Form Features: large rounded inputs, floating labels, validation, success confirmation, mobile responsive, high-contrast focus state
Footer
Multi-column footer: Logo, Service Area, Contact, Licensing info, Social icons, Copyright
Animations
Subtle fade-in on scroll, button hover states, gentle pulse on the "Call Now" button
Design Requirements
Pixel-perfect, fully responsive, accessible, high-conversion layout optimized for mobile "click-to-call", consistent 8px spacing system throughout.`
            ]
      },
      "Lawyer": {
            chips: ["Criminal Lawyer", "Family Law", "Legal Consultancy", "Corporate Lawyer"],
            templates: [
                  (keyword: string) => `IMPORTANT LAYOUT RULE: Arrange sections in this EXACT order:
1. Hero (full-width — MUST include an embedded inline lead capture form on the right or below the headline)
2. Trust/Stats Bar
3. Services / Features
4. About / Our Story
5. How It Works / Process
6. Testimonials
7. Team / Experts
8. FAQ (accordion)
9. Final CTA + Lead Capture Form
10. Footer
Design a premium, modern, luxury landing page for a law firm specializing in ${keyword}.
The design should feel sophisticated, trustworthy, and high-end, inspired by top international law firm websites.
Header
Transparent navigation that becomes solid on scroll
Logo on left

Gold "Free Consultation" CTA button
Hero Section
Full-screen hero with dramatic courtroom or lawyer office background image.
Left aligned content:
Small badge: "Trusted Legal Advisors Since 1998"
Large headline: "Protecting Your Rights with Excellence and Integrity"
Supporting paragraph describing legal expertise.
CTA buttons: Book Consultation, Our Services
Right side:
Elegant floating statistics card (25+ Years Experience, 12,000+ Clients Served, 98% Success Rate, 120+ Awards)
Trust Bar: Display logos of recognized legal associations and awards.
About Section
Two-column layout. Left: Professional lawyer image. Right: About the Firm, Mission, Vision, Core Values, Signature of founder, Experience counter.
Practice Areas
Six premium cards: Corporate Law, Family Law, Criminal Defense, Real Estate, Employment Law, Intellectual Property.
Each card: Minimal icon, Title, Short description, Learn More button, Hover animation.
Why Choose Us
Four feature cards: Experienced Attorneys, Personalized Strategy, Transparent Communication, Proven Results. Include premium icons.
Attorney Team
Display 4 attorneys in elegant cards: Large portrait, Name, Position, Practice area, Social icons, View Profile.
Case Results
Showcase recent successful cases using premium timeline cards. Include: Case Type, Result, Settlement Amount, Short description.
Testimonials
Elegant carousel with client reviews. Include: Client photo, Rating, Quote, Name, Company.
Statistics Section
Animated counters: 25+ Years, 3500+ Cases Won, 98% Client Satisfaction, 50+ Attorneys.
Consultation CTA
Large dark section. Headline: "Need Legal Assistance?". Short paragraph. Gold CTA button: "Schedule Free Consultation".
Latest Insights
Display three premium blog cards with featured image, category, title, excerpt, and Read More.
FAQ
Elegant accordion with common legal questions relevant to ${keyword}.
Contact
Two-column layout. Left: Contact information. Right: Premium consultation form (Name, Email, Phone, Practice Area, Message, Submit button). Include Google Map.
Footer
Multi-column luxury footer with: Logo, Contact, Newsletter, Social icons, Copyright.
Animations
Smooth fade-in, Scroll reveal, Counter animation, Hover lift effects, Gold underline animation, Image zoom on hover, Button ripple, Sticky header.
Design Requirements
Pixel-perfect, Premium spacing, Fully responsive, Accessibility compliant, Modern UI, High conversion rate, Figma-ready editable layout, Professional photography, Consistent 8px spacing system, Rounded corners (12–20px), Soft shadows, Luxury legal branding.

Consultation Form
Create a clean, minimal consultation form designed for maximum conversions.
Form Title: Request a Free ${keyword} Consultation
Subtitle: Fill out the form below and one of our legal experts will contact you within 24 hours.
Fields: Full Name, Email Address, Phone Number, Legal Service (Dropdown: Corporate Law, Family Law, Criminal Defense, Real Estate Law, Employment Law, Other), Message (Optional).
Submit Button: Book Free Consultation.
Form Features: Modern rounded input fields (10–12px radius), Floating labels, Client-side validation, Success confirmation message, Mobile responsive, Gold accent on focus state, Subtle shadow and hover effects.
Privacy note below the button: "Your information is kept confidential and will never be shared."`,
                  (keyword: string) => `IMPORTANT LAYOUT RULE: Arrange sections in this EXACT order:
1. Hero (full-width, bold headline + CTA)
2. Services / Features (prominent cards)
3. How It Works / Process (numbered steps)
4. Stats / Social Proof numbers
5. Team / Experts
6. Lead Capture Form (mid-page, inline, compelling)
7. Testimonials
8. About / Our Story
9. FAQ (accordion)
10. Footer
Design a premium, modern, luxury landing page for a law firm specializing in ${keyword}.
The design should feel sophisticated, trustworthy, and high-end, inspired by top international law firm websites.

Style
Ultra-modern dark mode aesthetic
Deep black (#050505) background with glowing neon accents
Header
Transparent navigation that becomes solid on scroll
Logo on left

Gold "Free Consultation" CTA button
Hero Section
Full-screen hero with dramatic courtroom or lawyer office background image.
Left aligned content:
Small badge: "Trusted Legal Advisors Since 1998"
Large headline: "Protecting Your Rights with Excellence and Integrity"
Supporting paragraph describing legal expertise.
CTA buttons: Book Consultation, Our Services
Right side:
Elegant floating statistics card (25+ Years Experience, 12,000+ Clients Served, 98% Success Rate, 120+ Awards)
Trust Bar: Display logos of recognized legal associations and awards.
About Section
Two-column layout. Left: Professional lawyer image. Right: About the Firm, Mission, Vision, Core Values, Signature of founder, Experience counter.
Practice Areas
Six premium cards: Corporate Law, Family Law, Criminal Defense, Real Estate, Employment Law, Intellectual Property.
Each card: Minimal icon, Title, Short description, Learn More button, Hover animation.
Why Choose Us
Four feature cards: Experienced Attorneys, Personalized Strategy, Transparent Communication, Proven Results. Include premium icons.
Attorney Team
Display 4 attorneys in elegant cards: Large portrait, Name, Position, Practice area, Social icons, View Profile.
Case Results
Showcase recent successful cases using premium timeline cards. Include: Case Type, Result, Settlement Amount, Short description.
Testimonials
Elegant carousel with client reviews. Include: Client photo, Rating, Quote, Name, Company.
Statistics Section
Animated counters: 25+ Years, 3500+ Cases Won, 98% Client Satisfaction, 50+ Attorneys.
Consultation CTA
Large dark section. Headline: "Need Legal Assistance?". Short paragraph. Gold CTA button: "Schedule Free Consultation".
Latest Insights
Display three premium blog cards with featured image, category, title, excerpt, and Read More.
FAQ
Elegant accordion with common legal questions relevant to ${keyword}.
Contact
Two-column layout. Left: Contact information. Right: Premium consultation form (Name, Email, Phone, Practice Area, Message, Submit button). Include Google Map.
Footer
Multi-column luxury footer with: Logo, Contact, Newsletter, Social icons, Copyright.
Animations
Smooth fade-in, Scroll reveal, Counter animation, Hover lift effects, Gold underline animation, Image zoom on hover, Button ripple, Sticky header.
Design Requirements
Pixel-perfect, Premium spacing, Fully responsive, Accessibility compliant, Modern UI, High conversion rate, Figma-ready editable layout, Professional photography, Consistent 8px spacing system, Rounded corners (12–20px), Soft shadows, Luxury legal branding.

Consultation Form
Create a clean, minimal consultation form designed for maximum conversions.
Form Title: Request a Free ${keyword} Consultation
Subtitle: Fill out the form below and one of our legal experts will contact you within 24 hours.
Fields: Full Name, Email Address, Phone Number, Legal Service (Dropdown: Corporate Law, Family Law, Criminal Defense, Real Estate Law, Employment Law, Other), Message (Optional).
Submit Button: Book Free Consultation.
Form Features: Modern rounded input fields (10–12px radius), Floating labels, Client-side validation, Success confirmation message, Mobile responsive, Gold accent on focus state, Subtle shadow and hover effects.
Privacy note below the button: "Your information is kept confidential and will never be shared."`,
                  (keyword: string) => `IMPORTANT LAYOUT RULE: Arrange sections in this EXACT order:
1. Hero (MUST have a compact inline form OR prominent single-field email/phone capture built into the hero section)
2. Stats / Social Proof numbers
3. About / Our Story
4. Services / Features
5. Testimonials (prominent, large quotes)
6. Team / Experts
7. How It Works / Process
8. Lead Capture Form
9. FAQ (accordion)
10. Footer
Design a premium, modern, luxury landing page for a law firm specializing in ${keyword}.
The design should feel sophisticated, trustworthy, and high-end, inspired by top international law firm websites.

Style
Creative, asymmetrical, brutalist aesthetic
High contrast, bold typography, broken grid layouts
Header
Transparent navigation that becomes solid on scroll
Logo on left

Gold "Free Consultation" CTA button
Hero Section
Full-screen hero with dramatic courtroom or lawyer office background image.
Left aligned content:
Small badge: "Trusted Legal Advisors Since 1998"
Large headline: "Protecting Your Rights with Excellence and Integrity"
Supporting paragraph describing legal expertise.
CTA buttons: Book Consultation, Our Services
Right side:
Elegant floating statistics card (25+ Years Experience, 12,000+ Clients Served, 98% Success Rate, 120+ Awards)
Trust Bar: Display logos of recognized legal associations and awards.
About Section
Two-column layout. Left: Professional lawyer image. Right: About the Firm, Mission, Vision, Core Values, Signature of founder, Experience counter.
Practice Areas
Six premium cards: Corporate Law, Family Law, Criminal Defense, Real Estate, Employment Law, Intellectual Property.
Each card: Minimal icon, Title, Short description, Learn More button, Hover animation.
Why Choose Us
Four feature cards: Experienced Attorneys, Personalized Strategy, Transparent Communication, Proven Results. Include premium icons.
Attorney Team
Display 4 attorneys in elegant cards: Large portrait, Name, Position, Practice area, Social icons, View Profile.
Case Results
Showcase recent successful cases using premium timeline cards. Include: Case Type, Result, Settlement Amount, Short description.
Testimonials
Elegant carousel with client reviews. Include: Client photo, Rating, Quote, Name, Company.
Statistics Section
Animated counters: 25+ Years, 3500+ Cases Won, 98% Client Satisfaction, 50+ Attorneys.
Consultation CTA
Large dark section. Headline: "Need Legal Assistance?". Short paragraph. Gold CTA button: "Schedule Free Consultation".
Latest Insights
Display three premium blog cards with featured image, category, title, excerpt, and Read More.
FAQ
Elegant accordion with common legal questions relevant to ${keyword}.
Contact
Two-column layout. Left: Contact information. Right: Premium consultation form (Name, Email, Phone, Practice Area, Message, Submit button). Include Google Map.
Footer
Multi-column luxury footer with: Logo, Contact, Newsletter, Social icons, Copyright.
Animations
Smooth fade-in, Scroll reveal, Counter animation, Hover lift effects, Gold underline animation, Image zoom on hover, Button ripple, Sticky header.
Design Requirements
Creative, broken-grid, pixel-perfect, Premium spacing, Fully responsive, Accessibility compliant, Modern UI, High conversion rate, Figma-ready editable layout, Professional photography, Consistent 8px spacing system, Rounded corners (12–20px), Soft shadows, Luxury legal branding.

Consultation Form
Create a clean, minimal consultation form designed for maximum conversions.
Form Title: Request a Free ${keyword} Consultation
Subtitle: Fill out the form below and one of our legal experts will contact you within 24 hours.
Fields: Full Name, Email Address, Phone Number, Legal Service (Dropdown: Corporate Law, Family Law, Criminal Defense, Real Estate Law, Employment Law, Other), Message (Optional).
Submit Button: Book Free Consultation.
Form Features: Modern rounded input fields (10–12px radius), Floating labels, Client-side validation, Success confirmation message, Mobile responsive, Gold accent on focus state, Subtle shadow and hover effects.
Privacy note below the button: "Your information is kept confidential and will never be shared."`,
                  (keyword: string) => `IMPORTANT LAYOUT RULE: Arrange sections in this EXACT order:
1. Hero (minimal, bold)
2. About / Our Story (right after hero)
3. Testimonials
4. Services / Features
5. Stats / Social Proof numbers
6. Lead Capture Form (prominent, centered)
7. How It Works / Process
8. Team / Experts
9. FAQ (accordion)
10. Footer
Design a premium, modern, luxury landing page for a law firm specializing in ${keyword}.
The design should feel sophisticated, trustworthy, and high-end, inspired by top international law firm websites.

Style
Minimalist, elegant, high-end aesthetic
Monochrome palette with lots of whitespace and delicate serif typography
Header
Transparent navigation that becomes solid on scroll
Logo on left

Gold "Free Consultation" CTA button
Hero Section
Full-screen hero with dramatic courtroom or lawyer office background image.
Left aligned content:
Small badge: "Trusted Legal Advisors Since 1998"
Large headline: "Protecting Your Rights with Excellence and Integrity"
Supporting paragraph describing legal expertise.
CTA buttons: Book Consultation, Our Services
Right side:
Elegant floating statistics card (25+ Years Experience, 12,000+ Clients Served, 98% Success Rate, 120+ Awards)
Trust Bar: Display logos of recognized legal associations and awards.
About Section
Two-column layout. Left: Professional lawyer image. Right: About the Firm, Mission, Vision, Core Values, Signature of founder, Experience counter.
Practice Areas
Six premium cards: Corporate Law, Family Law, Criminal Defense, Real Estate, Employment Law, Intellectual Property.
Each card: Minimal icon, Title, Short description, Learn More button, Hover animation.
Why Choose Us
Four feature cards: Experienced Attorneys, Personalized Strategy, Transparent Communication, Proven Results. Include premium icons.
Attorney Team
Display 4 attorneys in elegant cards: Large portrait, Name, Position, Practice area, Social icons, View Profile.
Case Results
Showcase recent successful cases using premium timeline cards. Include: Case Type, Result, Settlement Amount, Short description.
Testimonials
Elegant carousel with client reviews. Include: Client photo, Rating, Quote, Name, Company.
Statistics Section
Animated counters: 25+ Years, 3500+ Cases Won, 98% Client Satisfaction, 50+ Attorneys.
Consultation CTA
Large dark section. Headline: "Need Legal Assistance?". Short paragraph. Gold CTA button: "Schedule Free Consultation".
Latest Insights
Display three premium blog cards with featured image, category, title, excerpt, and Read More.
FAQ
Elegant accordion with common legal questions relevant to ${keyword}.
Contact
Two-column layout. Left: Contact information. Right: Premium consultation form (Name, Email, Phone, Practice Area, Message, Submit button). Include Google Map.
Footer
Multi-column luxury footer with: Logo, Contact, Newsletter, Social icons, Copyright.
Animations
Smooth fade-in, Scroll reveal, Counter animation, Hover lift effects, Gold underline animation, Image zoom on hover, Button ripple, Sticky header.
Design Requirements
Pixel-perfect, Premium spacing, Fully responsive, Accessibility compliant, Modern UI, High conversion rate, Figma-ready editable layout, Professional photography, Consistent 8px spacing system, Rounded corners (12–20px), Soft shadows, Luxury legal branding.

Consultation Form
Create a clean, minimal consultation form designed for maximum conversions.
Form Title: Request a Free ${keyword} Consultation
Subtitle: Fill out the form below and one of our legal experts will contact you within 24 hours.
Fields: Full Name, Email Address, Phone Number, Legal Service (Dropdown: Corporate Law, Family Law, Criminal Defense, Real Estate Law, Employment Law, Other), Message (Optional).
Submit Button: Book Free Consultation.
Form Features: Modern rounded input fields (10–12px radius), Floating labels, Client-side validation, Success confirmation message, Mobile responsive, Gold accent on focus state, Subtle shadow and hover effects.
Privacy note below the button: "Your information is kept confidential and will never be shared."`
            ]
      },
      "Other": {
            chips: ["Consulting", "Event Booking", "Local Service", "Fitness"],
            templates: [
                  (keyword: string) => `IMPORTANT LAYOUT RULE: Arrange sections in this EXACT order:
1. Hero (full-width — MUST include an embedded inline lead capture form on the right or below the headline)
2. Trust/Stats Bar
3. Services / Features
4. About / Our Story
5. How It Works / Process
6. Testimonials
7. Team / Experts
8. FAQ (accordion)
9. Final CTA + Lead Capture Form
10. Footer
Design a clean, professional, high-converting landing page for a ${keyword} business.
The design should feel trustworthy, modern, and tailored to the specific goals of a ${keyword} audience.
Header
Sticky navbar: Logo left, Contact
Primary CTA button relevant to ${keyword} (e.g. "Book Now", "Get Started", "Reserve a Table")
Hero Section
Headline communicating the core value of ${keyword} in one clear sentence
Supporting paragraph, primary + secondary CTA buttons
Supporting image or short video relevant to ${keyword}
Trust indicators: ratings, years active, clients served, or press mentions
Services / Offerings
Grid of 3-6 cards describing what the ${keyword} business offers, each with icon/image, title, short description
Why Choose Us
4 feature blocks highlighting differentiators relevant to ${keyword}
Social Proof
Testimonial carousel or grid with photo, quote, name, and rating
Process / How It Works
Simple numbered steps showing how a customer engages with this ${keyword} business
Gallery / Showcase
Image grid or carousel showcasing work, space, or results relevant to ${keyword}
FAQ
Accordion answering common questions about ${keyword}
Final CTA
Bold closing section with headline and a lead capture / booking form
Lead Capture Form
Form Title: Get Started With ${keyword}
Subtitle: Fill out the form and we'll get back to you shortly.
Fields: Full Name, Email, Phone Number, Message/Details, Submit
Submit Button: Submit Request
Form Features: rounded inputs, floating labels, validation, success confirmation, mobile responsive, brand-color focus state
Footer
Multi-column footer: Logo, Contact, Social icons, Copyright
Animations
Fade-in on scroll, hover lift on cards, smooth carousel transitions, button hover states
Design Requirements
Pixel-perfect, fully responsive, accessible, high-conversion layout, consistent 8px spacing system throughout.`,
                  (keyword: string) => `IMPORTANT LAYOUT RULE: Arrange sections in this EXACT order:
1. Hero (full-width, bold headline + CTA)
2. Services / Features (prominent cards)
3. How It Works / Process (numbered steps)
4. Stats / Social Proof numbers
5. Team / Experts
6. Lead Capture Form (mid-page, inline, compelling)
7. Testimonials
8. About / Our Story
9. FAQ (accordion)
10. Footer
Design a clean, professional, high-converting landing page for a ${keyword} business.
The design should feel trustworthy, modern, and tailored to the specific goals of a ${keyword} audience.

Style
Ultra-modern dark mode aesthetic
Deep black (#050505) background with glowing neon accents
Header
Sticky navbar: Logo left, Contact
Primary CTA button relevant to ${keyword} (e.g. "Book Now", "Get Started", "Reserve a Table")
Hero Section
Headline communicating the core value of ${keyword} in one clear sentence
Supporting paragraph, primary + secondary CTA buttons
Supporting image or short video relevant to ${keyword}
Trust indicators: ratings, years active, clients served, or press mentions
Services / Offerings
Grid of 3-6 cards describing what the ${keyword} business offers, each with icon/image, title, short description
Why Choose Us
4 feature blocks highlighting differentiators relevant to ${keyword}
Social Proof
Testimonial carousel or grid with photo, quote, name, and rating
Process / How It Works
Simple numbered steps showing how a customer engages with this ${keyword} business
Gallery / Showcase
Image grid or carousel showcasing work, space, or results relevant to ${keyword}
FAQ
Accordion answering common questions about ${keyword}
Final CTA
Bold closing section with headline and a lead capture / booking form
Lead Capture Form
Form Title: Get Started With ${keyword}
Subtitle: Fill out the form and we'll get back to you shortly.
Fields: Full Name, Email, Phone Number, Message/Details, Submit
Submit Button: Submit Request
Form Features: rounded inputs, floating labels, validation, success confirmation, mobile responsive, brand-color focus state
Footer
Multi-column footer: Logo, Contact, Social icons, Copyright
Animations
Fade-in on scroll, hover lift on cards, smooth carousel transitions, button hover states
Design Requirements
Pixel-perfect, fully responsive, accessible, high-conversion layout, consistent 8px spacing system throughout.`,
                  (keyword: string) => `IMPORTANT LAYOUT RULE: Arrange sections in this EXACT order:
1. Hero (MUST have a compact inline form OR prominent single-field email/phone capture built into the hero section)
2. Stats / Social Proof numbers
3. About / Our Story
4. Services / Features
5. Testimonials (prominent, large quotes)
6. Team / Experts
7. How It Works / Process
8. Lead Capture Form
9. FAQ (accordion)
10. Footer
Design a clean, professional, high-converting landing page for a ${keyword} business.
The design should feel trustworthy, modern, and tailored to the specific goals of a ${keyword} audience.

Style
Creative, asymmetrical, brutalist aesthetic
High contrast, bold typography, broken grid layouts
Header
Sticky navbar: Logo left, Contact
Primary CTA button relevant to ${keyword} (e.g. "Book Now", "Get Started", "Reserve a Table")
Hero Section
Headline communicating the core value of ${keyword} in one clear sentence
Supporting paragraph, primary + secondary CTA buttons
Supporting image or short video relevant to ${keyword}
Trust indicators: ratings, years active, clients served, or press mentions
Services / Offerings
Grid of 3-6 cards describing what the ${keyword} business offers, each with icon/image, title, short description
Why Choose Us
4 feature blocks highlighting differentiators relevant to ${keyword}
Social Proof
Testimonial carousel or grid with photo, quote, name, and rating
Process / How It Works
Simple numbered steps showing how a customer engages with this ${keyword} business
Gallery / Showcase
Image grid or carousel showcasing work, space, or results relevant to ${keyword}
FAQ
Accordion answering common questions about ${keyword}
Final CTA
Bold closing section with headline and a lead capture / booking form
Lead Capture Form
Form Title: Get Started With ${keyword}
Subtitle: Fill out the form and we'll get back to you shortly.
Fields: Full Name, Email, Phone Number, Message/Details, Submit
Submit Button: Submit Request
Form Features: rounded inputs, floating labels, validation, success confirmation, mobile responsive, brand-color focus state
Footer
Multi-column footer: Logo, Contact, Social icons, Copyright
Animations
Fade-in on scroll, hover lift on cards, smooth carousel transitions, button hover states
Design Requirements
Creative, broken-grid, pixel-perfect, fully responsive, accessible, high-conversion layout, consistent 8px spacing system throughout.`,
                  (keyword: string) => `IMPORTANT LAYOUT RULE: Arrange sections in this EXACT order:
1. Hero (minimal, bold)
2. About / Our Story (right after hero)
3. Testimonials
4. Services / Features
5. Stats / Social Proof numbers
6. Lead Capture Form (prominent, centered)
7. How It Works / Process
8. Team / Experts
9. FAQ (accordion)
10. Footer
Design a clean, professional, high-converting landing page for a ${keyword} business.
The design should feel trustworthy, modern, and tailored to the specific goals of a ${keyword} audience.

Style
Minimalist, elegant, high-end aesthetic
Monochrome palette with lots of whitespace and delicate serif typography
Header
Sticky navbar: Logo left, Contact
Primary CTA button relevant to ${keyword} (e.g. "Book Now", "Get Started", "Reserve a Table")
Hero Section
Headline communicating the core value of ${keyword} in one clear sentence
Supporting paragraph, primary + secondary CTA buttons
Supporting image or short video relevant to ${keyword}
Trust indicators: ratings, years active, clients served, or press mentions
Services / Offerings
Grid of 3-6 cards describing what the ${keyword} business offers, each with icon/image, title, short description
Why Choose Us
4 feature blocks highlighting differentiators relevant to ${keyword}
Social Proof
Testimonial carousel or grid with photo, quote, name, and rating
Process / How It Works
Simple numbered steps showing how a customer engages with this ${keyword} business
Gallery / Showcase
Image grid or carousel showcasing work, space, or results relevant to ${keyword}
FAQ
Accordion answering common questions about ${keyword}
Final CTA
Bold closing section with headline and a lead capture / booking form
Lead Capture Form
Form Title: Get Started With ${keyword}
Subtitle: Fill out the form and we'll get back to you shortly.
Fields: Full Name, Email, Phone Number, Message/Details, Submit
Submit Button: Submit Request
Form Features: rounded inputs, floating labels, validation, success confirmation, mobile responsive, brand-color focus state
Footer
Multi-column footer: Logo, Contact, Social icons, Copyright
Animations
Fade-in on scroll, hover lift on cards, smooth carousel transitions, button hover states
Design Requirements
Pixel-perfect, fully responsive, accessible, high-conversion layout, consistent 8px spacing system throughout.`
            ]
      }
};

export const getIndustryKey = (industry: string) => {
      if (!industry) return 'Other';

      const exactMatch = Object.keys(INDUSTRY_PROMPTS).find(
            k => k.toLowerCase() === industry.toLowerCase()
      );
      if (exactMatch) return exactMatch;

      const norm = industry.toLowerCase();
      if (norm.includes('lawyer') || norm.includes('legal')) return 'Lawyer';
      if (norm.includes('plumb')) return 'Plumber';
      if (norm.includes('real estate') || norm.includes('property')) return 'Real Estate';
      if (norm.includes('health') || norm.includes('medical') || norm.includes('dental') || norm.includes('clinic')) return 'Healthcare';
      if (norm.includes('saas') || norm.includes('software') || norm.includes('tech')) return 'SaaS';
      if (norm.includes('agency') || norm.includes('marketing')) return 'Agency';
      if (norm.includes('e-commerce') || norm.includes('ecommerce') || norm.includes('shop') || norm.includes('store')) return 'E-commerce';

      return 'Other';
};