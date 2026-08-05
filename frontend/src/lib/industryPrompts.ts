export const INDUSTRY_PROMPTS: Record<string, { chips: string[], templates: ((keyword: string) => string)[] }> = {
  "SaaS": {
    chips: ["B2B SaaS", "AI Tool", "CRM Software", "Analytics Dashboard", "Project Management", "Fintech"],
    templates: [
      (keyword: string) => `Design a modern, high-converting SaaS landing page for a ${keyword} product.
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
About
Short section explaining what the ${keyword} platform does, who it's built for, and the core problem it solves
Supporting stat or credibility line (e.g. teams onboarded, uptime, data processed)
How It Works
3-step numbered process showing onboarding flow for ${keyword}
FAQ
Clean accordion answering common product/security/billing questions
Final CTA
Lead Capture Form section closing the page
Lead Capture Form
Form Title: Start Your Free ${keyword} Trial
Subtitle: No credit card required. Cancel anytime.
Fields: Full Name, Work Email, Company Name, Team Size (dropdown), Submit
Submit Button: Get Started Free
Form Features: rounded inputs, floating labels, inline validation, success confirmation state, mobile responsive, brand-color focus ring
Footer
Multi-column footer: Logo, Social icons, Copyright
Animations
Fade-in on scroll, staggered card reveals, hover lift on cards, smooth CTA button transitions
Design Requirements
Pixel-perfect, fully responsive, accessible, high-conversion layout, consistent 8px spacing system throughout.`,
      (keyword: string) => `Design a modern, high-converting SaaS landing page for a ${keyword} product.
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
About
Short section explaining what the ${keyword} platform does, who it's built for, and the core problem it solves
Supporting stat or credibility line (e.g. teams onboarded, uptime, data processed)
How It Works
3-step numbered process showing onboarding flow for ${keyword}
FAQ
Clean accordion answering common product/security/billing questions
Final CTA
Lead Capture Form section closing the page
Lead Capture Form
Form Title: Start Your Free ${keyword} Trial
Subtitle: No credit card required. Cancel anytime.
Fields: Full Name, Work Email, Company Name, Team Size (dropdown), Submit
Submit Button: Get Started Free
Form Features: rounded inputs, floating labels, inline validation, success confirmation state, mobile responsive, brand-color focus ring
Footer
Multi-column footer: Logo, Social icons, Copyright
Animations
Fade-in on scroll, staggered card reveals, hover lift on cards, smooth CTA button transitions
Design Requirements
Pixel-perfect, fully responsive, accessible, high-conversion layout, consistent 8px spacing system throughout.`,
      (keyword: string) => `Design a modern, high-converting SaaS landing page for a ${keyword} product.
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
About
Short section explaining what the ${keyword} platform does, who it's built for, and the core problem it solves
Supporting stat or credibility line (e.g. teams onboarded, uptime, data processed)
How It Works
3-step numbered process showing onboarding flow for ${keyword}
FAQ
Clean accordion answering common product/security/billing questions
Final CTA
Lead Capture Form section closing the page
Lead Capture Form
Form Title: Start Your Free ${keyword} Trial
Subtitle: No credit card required. Cancel anytime.
Fields: Full Name, Work Email, Company Name, Team Size (dropdown), Submit
Submit Button: Get Started Free
Form Features: rounded inputs, floating labels, inline validation, success confirmation state, mobile responsive, brand-color focus ring
Footer
Multi-column footer: Logo, Social icons, Copyright
Animations
Fade-in on scroll, staggered card reveals, hover lift on cards, smooth CTA button transitions
Design Requirements
Creative, broken-grid, Pixel-perfect, fully responsive, accessible, high-conversion layout, consistent 8px spacing system throughout.`,
      (keyword: string) => `Design a modern, high-converting SaaS landing page for a ${keyword} product.
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
About
Short section explaining what the ${keyword} platform does, who it's built for, and the core problem it solves
Supporting stat or credibility line (e.g. teams onboarded, uptime, data processed)
How It Works
3-step numbered process showing onboarding flow for ${keyword}
FAQ
Clean accordion answering common product/security/billing questions
Final CTA
Lead Capture Form section closing the page
Lead Capture Form
Form Title: Start Your Free ${keyword} Trial
Subtitle: No credit card required. Cancel anytime.
Fields: Full Name, Work Email, Company Name, Team Size (dropdown), Submit
Submit Button: Get Started Free
Form Features: rounded inputs, floating labels, inline validation, success confirmation state, mobile responsive, brand-color focus ring
Footer
Multi-column footer: Logo, Social icons, Copyright
Animations
Fade-in on scroll, staggered card reveals, hover lift on cards, smooth CTA button transitions
Design Requirements
Pixel-perfect, fully responsive, accessible, high-conversion layout, consistent 8px spacing system throughout.`,
    ]
  },
  "Agency": {
    chips: ["Digital Marketing", "Web Development", "SEO Agency", "Creative Studio", "PR Agency", "Social Media"],
    templates: [
      (keyword: string) => `Design a bold, high-converting landing page for a ${keyword} agency.
The design should feel confident, creative, and results-driven, inspired by top award-winning agency portfolios.
Header
Minimal sticky navbar: Logo left
Bold CTA button: "Start a Project"
Hero Section
Full-width, massive headline stating the agency's ${keyword} promise
Short supporting line beneath
CTA button + secondary "See Our Work" link
Optional large hero image/video showing the team or work in action
About
Short section introducing the agency: story, mission, and what makes its ${keyword} approach different
Row of bold numbers: clients served, campaigns launched, average ROI %, years active
How It Works
Horizontal or vertical numbered steps showing how the agency delivers ${keyword} results
FAQ
Accordion answering common questions about process, pricing, and timelines for ${keyword}
Final CTA
Consultation Form section closing the page
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
Pixel-perfect, fully responsive, accessible, high-conversion layout, consistent 8px spacing system throughout.`,
      (keyword: string) => `Design a bold, high-converting landing page for a ${keyword} agency.
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
About
Short section introducing the agency: story, mission, and what makes its ${keyword} approach different
Row of bold numbers: clients served, campaigns launched, average ROI %, years active
How It Works
Horizontal or vertical numbered steps showing how the agency delivers ${keyword} results
FAQ
Accordion answering common questions about process, pricing, and timelines for ${keyword}
Final CTA
Consultation Form section closing the page
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
Pixel-perfect, fully responsive, accessible, high-conversion layout, consistent 8px spacing system throughout.`,
      (keyword: string) => `Design a bold, high-converting landing page for a ${keyword} agency.
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
About
Short section introducing the agency: story, mission, and what makes its ${keyword} approach different
Row of bold numbers: clients served, campaigns launched, average ROI %, years active
How It Works
Horizontal or vertical numbered steps showing how the agency delivers ${keyword} results
FAQ
Accordion answering common questions about process, pricing, and timelines for ${keyword}
Final CTA
Consultation Form section closing the page
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
Creative, broken-grid, Pixel-perfect, fully responsive, accessible, high-conversion layout, consistent 8px spacing system throughout.`,
      (keyword: string) => `Design a bold, high-converting landing page for a ${keyword} agency.
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
About
Short section introducing the agency: story, mission, and what makes its ${keyword} approach different
Row of bold numbers: clients served, campaigns launched, average ROI %, years active
How It Works
Horizontal or vertical numbered steps showing how the agency delivers ${keyword} results
FAQ
Accordion answering common questions about process, pricing, and timelines for ${keyword}
Final CTA
Consultation Form section closing the page
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
Pixel-perfect, fully responsive, accessible, high-conversion layout, consistent 8px spacing system throughout.`,
    ]
  },
  "E-commerce": {
    chips: ["Fashion Apparel", "Tech Gadgets", "Beauty Products", "Home Decor", "Fitness Gear", "Subscription Box"],
    templates: [
      (keyword: string) => `Design a vibrant, high-converting e-commerce landing page for a ${keyword} brand.
The design should feel desirable, trustworthy, and shoppable, inspired by top DTC brand websites.
Header
Sticky navbar: Logo center or left, Cart icon
Announcement bar above navbar: limited-time offer or free shipping message
Hero Section
Full-width lifestyle image or product hero shot for ${keyword}
Bold headline highlighting the standout benefit
Subtext + CTA button: "Shop Now"
Optional discount badge or "New Arrival" tag
About
Short brand story section: what makes this ${keyword} brand different, quality/sourcing highlights
3-4 icon feature blocks: quality, shipping, returns, guarantee
How It Works
Simple numbered steps showing how a customer orders, receives, and enjoys ${keyword}
FAQ
Accordion covering shipping, returns, sizing/usage
Final CTA
Email Capture Form section closing the page
Email Capture Form
Form Title: Get 10% Off Your First ${keyword} Order
Subtitle: Join our list for early access and exclusive drops.
Fields: Email Address, Submit
Submit Button: Claim My Discount
Form Features: rounded input, inline validation, success confirmation, mobile responsive, brand-color focus state
Footer
Multi-column footer: Logo, Help, Newsletter signup, Social icons, Payment icons, Copyright
Animations
Product image hover zoom, scroll reveal on sections, add-to-cart micro-interaction
Design Requirements
Pixel-perfect, fully responsive, accessible, high-conversion layout, consistent 8px spacing system throughout.`,
      (keyword: string) => `Design a vibrant, high-converting e-commerce landing page for a ${keyword} brand.
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
About
Short brand story section: what makes this ${keyword} brand different, quality/sourcing highlights
3-4 icon feature blocks: quality, shipping, returns, guarantee
How It Works
Simple numbered steps showing how a customer orders, receives, and enjoys ${keyword}
FAQ
Accordion covering shipping, returns, sizing/usage
Final CTA
Email Capture Form section closing the page
Email Capture Form
Form Title: Get 10% Off Your First ${keyword} Order
Subtitle: Join our list for early access and exclusive drops.
Fields: Email Address, Submit
Submit Button: Claim My Discount
Form Features: rounded input, inline validation, success confirmation, mobile responsive, brand-color focus state
Footer
Multi-column footer: Logo, Help, Newsletter signup, Social icons, Payment icons, Copyright
Animations
Product image hover zoom, scroll reveal on sections, add-to-cart micro-interaction
Design Requirements
Pixel-perfect, fully responsive, accessible, high-conversion layout, consistent 8px spacing system throughout.`,
      (keyword: string) => `Design a vibrant, high-converting e-commerce landing page for a ${keyword} brand.
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
About
Short brand story section: what makes this ${keyword} brand different, quality/sourcing highlights
3-4 icon feature blocks: quality, shipping, returns, guarantee
How It Works
Simple numbered steps showing how a customer orders, receives, and enjoys ${keyword}
FAQ
Accordion covering shipping, returns, sizing/usage
Final CTA
Email Capture Form section closing the page
Email Capture Form
Form Title: Get 10% Off Your First ${keyword} Order
Subtitle: Join our list for early access and exclusive drops.
Fields: Email Address, Submit
Submit Button: Claim My Discount
Form Features: rounded input, inline validation, success confirmation, mobile responsive, brand-color focus state
Footer
Multi-column footer: Logo, Help, Newsletter signup, Social icons, Payment icons, Copyright
Animations
Product image hover zoom, scroll reveal on sections, add-to-cart micro-interaction
Design Requirements
Creative, broken-grid, Pixel-perfect, fully responsive, accessible, high-conversion layout, consistent 8px spacing system throughout.`,
      (keyword: string) => `Design a vibrant, high-converting e-commerce landing page for a ${keyword} brand.
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
About
Short brand story section: what makes this ${keyword} brand different, quality/sourcing highlights
3-4 icon feature blocks: quality, shipping, returns, guarantee
How It Works
Simple numbered steps showing how a customer orders, receives, and enjoys ${keyword}
FAQ
Accordion covering shipping, returns, sizing/usage
Final CTA
Email Capture Form section closing the page
Email Capture Form
Form Title: Get 10% Off Your First ${keyword} Order
Subtitle: Join our list for early access and exclusive drops.
Fields: Email Address, Submit
Submit Button: Claim My Discount
Form Features: rounded input, inline validation, success confirmation, mobile responsive, brand-color focus state
Footer
Multi-column footer: Logo, Help, Newsletter signup, Social icons, Payment icons, Copyright
Animations
Product image hover zoom, scroll reveal on sections, add-to-cart micro-interaction
Design Requirements
Pixel-perfect, fully responsive, accessible, high-conversion layout, consistent 8px spacing system throughout.`,
    ]
  },
  "Healthcare": {
    chips: ["Dental Care", "Pediatrics", "Mental Health", "Cosmetic Surgery", "Telehealth", "Physical Therapy"],
    templates: [
      (keyword: string) => `Design a clean, reassuring landing page for a ${keyword} practice.
The design should feel calm, trustworthy, and professional, inspired by top modern healthcare websites.
Header
Sticky navbar: Logo left, Contact
Primary CTA button: "Book Appointment"
Hero Section
Warm, welcoming image or split layout with headline + supporting text
Headline focused on patient outcomes for ${keyword}
CTA buttons: "Book an Appointment", "Call Us Now"
Small trust badges: certifications, insurance accepted, years in practice
About
Short section about the practice: mission, provider credentials, patient-first philosophy for ${keyword}
4 feature blocks: experienced staff, modern technology, patient-first care, flexible scheduling
How It Works
Simple numbered steps showing what a patient can expect from first contact to treatment for ${keyword}
FAQ
Accordion answering common questions about ${keyword} treatment, cost, and what to expect
Final CTA
Appointment Form section closing the page
Appointment Form
Form Title: Book Your ${keyword} Appointment
Subtitle: We'll confirm your preferred time within one business day.
Fields: Full Name, Phone Number, Email, Preferred Date, Reason for Visit, Submit
Submit Button: Request Appointment
Form Features: rounded inputs, floating labels, validation, confidential-data note, success confirmation, mobile responsive
Footer
Multi-column footer: Logo, Locations, Hours, Contact, Social icons, Copyright
Animations
Gentle fade-in on scroll, subtle hover lift on cards, smooth transitions — nothing jarring or fast
Design Requirements
Pixel-perfect, fully responsive, accessible, high-conversion layout, consistent 8px spacing system throughout.`,
      (keyword: string) => `Design a clean, reassuring landing page for a ${keyword} practice.
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
About
Short section about the practice: mission, provider credentials, patient-first philosophy for ${keyword}
4 feature blocks: experienced staff, modern technology, patient-first care, flexible scheduling
How It Works
Simple numbered steps showing what a patient can expect from first contact to treatment for ${keyword}
FAQ
Accordion answering common questions about ${keyword} treatment, cost, and what to expect
Final CTA
Appointment Form section closing the page
Appointment Form
Form Title: Book Your ${keyword} Appointment
Subtitle: We'll confirm your preferred time within one business day.
Fields: Full Name, Phone Number, Email, Preferred Date, Reason for Visit, Submit
Submit Button: Request Appointment
Form Features: rounded inputs, floating labels, validation, confidential-data note, success confirmation, mobile responsive
Footer
Multi-column footer: Logo, Locations, Hours, Contact, Social icons, Copyright
Animations
Gentle fade-in on scroll, subtle hover lift on cards, smooth transitions — nothing jarring or fast
Design Requirements
Pixel-perfect, fully responsive, accessible, high-conversion layout, consistent 8px spacing system throughout.`,
      (keyword: string) => `Design a clean, reassuring landing page for a ${keyword} practice.
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
About
Short section about the practice: mission, provider credentials, patient-first philosophy for ${keyword}
4 feature blocks: experienced staff, modern technology, patient-first care, flexible scheduling
How It Works
Simple numbered steps showing what a patient can expect from first contact to treatment for ${keyword}
FAQ
Accordion answering common questions about ${keyword} treatment, cost, and what to expect
Final CTA
Appointment Form section closing the page
Appointment Form
Form Title: Book Your ${keyword} Appointment
Subtitle: We'll confirm your preferred time within one business day.
Fields: Full Name, Phone Number, Email, Preferred Date, Reason for Visit, Submit
Submit Button: Request Appointment
Form Features: rounded inputs, floating labels, validation, confidential-data note, success confirmation, mobile responsive
Footer
Multi-column footer: Logo, Locations, Hours, Contact, Social icons, Copyright
Animations
Gentle fade-in on scroll, subtle hover lift on cards, smooth transitions — nothing jarring or fast
Design Requirements
Creative, broken-grid, Pixel-perfect, fully responsive, accessible, high-conversion layout, consistent 8px spacing system throughout.`,
      (keyword: string) => `Design a clean, reassuring landing page for a ${keyword} practice.
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
About
Short section about the practice: mission, provider credentials, patient-first philosophy for ${keyword}
4 feature blocks: experienced staff, modern technology, patient-first care, flexible scheduling
How It Works
Simple numbered steps showing what a patient can expect from first contact to treatment for ${keyword}
FAQ
Accordion answering common questions about ${keyword} treatment, cost, and what to expect
Final CTA
Appointment Form section closing the page
Appointment Form
Form Title: Book Your ${keyword} Appointment
Subtitle: We'll confirm your preferred time within one business day.
Fields: Full Name, Phone Number, Email, Preferred Date, Reason for Visit, Submit
Submit Button: Request Appointment
Form Features: rounded inputs, floating labels, validation, confidential-data note, success confirmation, mobile responsive
Footer
Multi-column footer: Logo, Locations, Hours, Contact, Social icons, Copyright
Animations
Gentle fade-in on scroll, subtle hover lift on cards, smooth transitions — nothing jarring or fast
Design Requirements
Pixel-perfect, fully responsive, accessible, high-conversion layout, consistent 8px spacing system throughout.`,
    ]
  },
  "Real Estate": {
    chips: ["Luxury Homes", "Commercial Properties", "Property Management", "Home Valuation", "Real Estate Agent", "First-Time Buyers"],
    templates: [
      (keyword: string) => `Design a premium, elegant landing page focused on ${keyword}.
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
About
Agent/team profile section: photo, bio, credentials, and a personal quote building trust for ${keyword}
4 feature blocks: local expertise, negotiation skill, marketing reach, client-first process
How It Works
Simple numbered steps walking through the ${keyword} journey from first contact to close
FAQ
Accordion covering common questions about ${keyword}
Final CTA
Inquiry Form section closing the page
Inquiry Form
Form Title: Get Started With ${keyword}
Subtitle: Share a few details and we'll be in touch within 24 hours.
Fields: Full Name, Email, Phone Number, Property Address (optional), Message, Submit
Submit Button: Request Information
Form Features: rounded inputs, floating labels, validation, success confirmation, mobile responsive, gold-accent focus state
Footer
Multi-column footer: Logo, Contact, Social icons, License/brokerage info, Copyright
Animations
Smooth fade-in, scroll reveal, image zoom on hover, sticky header transition
Design Requirements
Pixel-perfect, fully responsive, accessible, high-conversion layout, consistent 8px spacing system throughout.`,
      (keyword: string) => `Design a premium, elegant landing page focused on ${keyword}.
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
About
Agent/team profile section: photo, bio, credentials, and a personal quote building trust for ${keyword}
4 feature blocks: local expertise, negotiation skill, marketing reach, client-first process
How It Works
Simple numbered steps walking through the ${keyword} journey from first contact to close
FAQ
Accordion covering common questions about ${keyword}
Final CTA
Inquiry Form section closing the page
Inquiry Form
Form Title: Get Started With ${keyword}
Subtitle: Share a few details and we'll be in touch within 24 hours.
Fields: Full Name, Email, Phone Number, Property Address (optional), Message, Submit
Submit Button: Request Information
Form Features: rounded inputs, floating labels, validation, success confirmation, mobile responsive, gold-accent focus state
Footer
Multi-column footer: Logo, Contact, Social icons, License/brokerage info, Copyright
Animations
Smooth fade-in, scroll reveal, image zoom on hover, sticky header transition
Design Requirements
Pixel-perfect, fully responsive, accessible, high-conversion layout, consistent 8px spacing system throughout.`,
      (keyword: string) => `Design a premium, elegant landing page focused on ${keyword}.
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
About
Agent/team profile section: photo, bio, credentials, and a personal quote building trust for ${keyword}
4 feature blocks: local expertise, negotiation skill, marketing reach, client-first process
How It Works
Simple numbered steps walking through the ${keyword} journey from first contact to close
FAQ
Accordion covering common questions about ${keyword}
Final CTA
Inquiry Form section closing the page
Inquiry Form
Form Title: Get Started With ${keyword}
Subtitle: Share a few details and we'll be in touch within 24 hours.
Fields: Full Name, Email, Phone Number, Property Address (optional), Message, Submit
Submit Button: Request Information
Form Features: rounded inputs, floating labels, validation, success confirmation, mobile responsive, gold-accent focus state
Footer
Multi-column footer: Logo, Contact, Social icons, License/brokerage info, Copyright
Animations
Smooth fade-in, scroll reveal, image zoom on hover, sticky header transition
Design Requirements
Creative, broken-grid, Pixel-perfect, fully responsive, accessible, high-conversion layout, consistent 8px spacing system throughout.`,
      (keyword: string) => `Design a premium, elegant landing page focused on ${keyword}.
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
About
Agent/team profile section: photo, bio, credentials, and a personal quote building trust for ${keyword}
4 feature blocks: local expertise, negotiation skill, marketing reach, client-first process
How It Works
Simple numbered steps walking through the ${keyword} journey from first contact to close
FAQ
Accordion covering common questions about ${keyword}
Final CTA
Inquiry Form section closing the page
Inquiry Form
Form Title: Get Started With ${keyword}
Subtitle: Share a few details and we'll be in touch within 24 hours.
Fields: Full Name, Email, Phone Number, Property Address (optional), Message, Submit
Submit Button: Request Information
Form Features: rounded inputs, floating labels, validation, success confirmation, mobile responsive, gold-accent focus state
Footer
Multi-column footer: Logo, Contact, Social icons, License/brokerage info, Copyright
Animations
Smooth fade-in, scroll reveal, image zoom on hover, sticky header transition
Design Requirements
Pixel-perfect, fully responsive, accessible, high-conversion layout, consistent 8px spacing system throughout.`,
    ]
  },
  "Plumber": {
    chips: ["Emergency Plumbing", "Drain Cleaning", "Water Heaters", "Pipe Repair", "Commercial Plumbing", "Leak Detection"],
    templates: [
      (keyword: string) => `Design a bold, high-converting local service landing page for a ${keyword} business.
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
About
Short section about the business: experience, licensing, and service philosophy for ${keyword}
4 feature blocks: fast response time, upfront pricing, licensed technicians, satisfaction guarantee
How It Works
Simple numbered steps showing how a customer books, gets serviced, and pays for ${keyword}
FAQ
Accordion answering common questions about ${keyword}, response time, and cost
Final CTA
Quote Request Form section closing the page
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
Pixel-perfect, fully responsive, accessible, high-conversion layout, consistent 8px spacing system throughout.`,
      (keyword: string) => `Design a bold, high-converting local service landing page for a ${keyword} business.
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
About
Short section about the business: experience, licensing, and service philosophy for ${keyword}
4 feature blocks: fast response time, upfront pricing, licensed technicians, satisfaction guarantee
How It Works
Simple numbered steps showing how a customer books, gets serviced, and pays for ${keyword}
FAQ
Accordion answering common questions about ${keyword}, response time, and cost
Final CTA
Quote Request Form section closing the page
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
Pixel-perfect, fully responsive, accessible, high-conversion layout, consistent 8px spacing system throughout.`,
      (keyword: string) => `Design a bold, high-converting local service landing page for a ${keyword} business.
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
About
Short section about the business: experience, licensing, and service philosophy for ${keyword}
4 feature blocks: fast response time, upfront pricing, licensed technicians, satisfaction guarantee
How It Works
Simple numbered steps showing how a customer books, gets serviced, and pays for ${keyword}
FAQ
Accordion answering common questions about ${keyword}, response time, and cost
Final CTA
Quote Request Form section closing the page
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
Creative, broken-grid, Pixel-perfect, fully responsive, accessible, high-conversion layout, consistent 8px spacing system throughout.`,
      (keyword: string) => `Design a bold, high-converting local service landing page for a ${keyword} business.
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
About
Short section about the business: experience, licensing, and service philosophy for ${keyword}
4 feature blocks: fast response time, upfront pricing, licensed technicians, satisfaction guarantee
How It Works
Simple numbered steps showing how a customer books, gets serviced, and pays for ${keyword}
FAQ
Accordion answering common questions about ${keyword}, response time, and cost
Final CTA
Quote Request Form section closing the page
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
Pixel-perfect, fully responsive, accessible, high-conversion layout, consistent 8px spacing system throughout.`,
    ]
  },
  "Lawyer": {
    chips: ["Criminal Lawyer", "Family Law", "Legal Consultancy", "Corporate Lawyer", "Personal Injury", "Immigration Law"],
    templates: [
      (keyword: string) => `Design a premium, modern, luxury landing page for a law firm specializing in ${keyword}.
The design should feel sophisticated, trustworthy, and high-end, inspired by top international law firm websites.
Header
Transparent navigation that becomes solid on scroll
Logo on left
Gold "Free Consultation" CTA button
Hero Section
Full-screen hero with dramatic courtroom or lawyer office background image
Small badge: "Trusted Legal Advisors Since 1998"
Large headline: "Protecting Your Rights with Excellence and Integrity"
Supporting paragraph describing legal expertise
CTA buttons: Book Consultation, Our Services
Elegant floating statistics card (25+ Years Experience, 12,000+ Clients Served, 98% Success Rate, 120+ Awards)
About
Two-column layout. Left: Professional lawyer image. Right: About the Firm, Mission, Vision, Core Values, Signature of founder, Experience counter
How It Works
Simple numbered steps walking through what happens after a client reaches out, from consultation to resolution
FAQ
Elegant accordion with common legal questions relevant to ${keyword}
Final CTA
Consultation Form section closing the page
Consultation Form
Form Title: Request a Free ${keyword} Consultation
Subtitle: Fill out the form below and one of our legal experts will contact you within 24 hours.
Fields: Full Name, Email Address, Phone Number, Legal Service (Dropdown: Corporate Law, Family Law, Criminal Defense, Real Estate Law, Employment Law, Other), Message (Optional)
Submit Button: Book Free Consultation
Form Features: Modern rounded input fields (10–12px radius), Floating labels, Client-side validation, Success confirmation message, Mobile responsive, Gold accent on focus state, Subtle shadow and hover effects
Privacy note below the button: "Your information is kept confidential and will never be shared."
Footer
Multi-column luxury footer with: Logo, Contact, Newsletter, Social icons, Copyright
Animations
Smooth fade-in, Scroll reveal, Hover lift effects, Gold underline animation, Image zoom on hover, Button ripple, Sticky header
Design Requirements
Pixel-perfect, fully responsive, accessible, high-conversion layout, consistent 8px spacing system throughout.`,
      (keyword: string) => `Design a premium, modern, luxury landing page for a law firm specializing in ${keyword}.
The design should feel sophisticated, trustworthy, and high-end, inspired by top international law firm websites.
Style
Ultra-modern dark mode aesthetic
Deep black (#050505) background with glowing neon accents
Header
Transparent navigation that becomes solid on scroll
Logo on left
Gold "Free Consultation" CTA button
Hero Section
Full-screen hero with dramatic courtroom or lawyer office background image
Small badge: "Trusted Legal Advisors Since 1998"
Large headline: "Protecting Your Rights with Excellence and Integrity"
Supporting paragraph describing legal expertise
CTA buttons: Book Consultation, Our Services
Elegant floating statistics card (25+ Years Experience, 12,000+ Clients Served, 98% Success Rate, 120+ Awards)
About
Two-column layout. Left: Professional lawyer image. Right: About the Firm, Mission, Vision, Core Values, Signature of founder, Experience counter
How It Works
Simple numbered steps walking through what happens after a client reaches out, from consultation to resolution
FAQ
Elegant accordion with common legal questions relevant to ${keyword}
Final CTA
Consultation Form section closing the page
Consultation Form
Form Title: Request a Free ${keyword} Consultation
Subtitle: Fill out the form below and one of our legal experts will contact you within 24 hours.
Fields: Full Name, Email Address, Phone Number, Legal Service (Dropdown: Corporate Law, Family Law, Criminal Defense, Real Estate Law, Employment Law, Other), Message (Optional)
Submit Button: Book Free Consultation
Form Features: Modern rounded input fields (10–12px radius), Floating labels, Client-side validation, Success confirmation message, Mobile responsive, Gold accent on focus state, Subtle shadow and hover effects
Privacy note below the button: "Your information is kept confidential and will never be shared."
Footer
Multi-column luxury footer with: Logo, Contact, Newsletter, Social icons, Copyright
Animations
Smooth fade-in, Scroll reveal, Hover lift effects, Gold underline animation, Image zoom on hover, Button ripple, Sticky header
Design Requirements
Pixel-perfect, fully responsive, accessible, high-conversion layout, consistent 8px spacing system throughout.`,
      (keyword: string) => `Design a premium, modern, luxury landing page for a law firm specializing in ${keyword}.
The design should feel sophisticated, trustworthy, and high-end, inspired by top international law firm websites.
Style
Creative, asymmetrical, brutalist aesthetic
High contrast, bold typography, broken grid layouts
Header
Transparent navigation that becomes solid on scroll
Logo on left
Gold "Free Consultation" CTA button
Hero Section
Full-screen hero with dramatic courtroom or lawyer office background image
Small badge: "Trusted Legal Advisors Since 1998"
Large headline: "Protecting Your Rights with Excellence and Integrity"
Supporting paragraph describing legal expertise
CTA buttons: Book Consultation, Our Services
Elegant floating statistics card (25+ Years Experience, 12,000+ Clients Served, 98% Success Rate, 120+ Awards)
About
Two-column layout. Left: Professional lawyer image. Right: About the Firm, Mission, Vision, Core Values, Signature of founder, Experience counter
How It Works
Simple numbered steps walking through what happens after a client reaches out, from consultation to resolution
FAQ
Elegant accordion with common legal questions relevant to ${keyword}
Final CTA
Consultation Form section closing the page
Consultation Form
Form Title: Request a Free ${keyword} Consultation
Subtitle: Fill out the form below and one of our legal experts will contact you within 24 hours.
Fields: Full Name, Email Address, Phone Number, Legal Service (Dropdown: Corporate Law, Family Law, Criminal Defense, Real Estate Law, Employment Law, Other), Message (Optional)
Submit Button: Book Free Consultation
Form Features: Modern rounded input fields (10–12px radius), Floating labels, Client-side validation, Success confirmation message, Mobile responsive, Gold accent on focus state, Subtle shadow and hover effects
Privacy note below the button: "Your information is kept confidential and will never be shared."
Footer
Multi-column luxury footer with: Logo, Contact, Newsletter, Social icons, Copyright
Animations
Smooth fade-in, Scroll reveal, Hover lift effects, Gold underline animation, Image zoom on hover, Button ripple, Sticky header
Design Requirements
Creative, broken-grid, Pixel-perfect, fully responsive, accessible, high-conversion layout, consistent 8px spacing system throughout.`,
      (keyword: string) => `Design a premium, modern, luxury landing page for a law firm specializing in ${keyword}.
The design should feel sophisticated, trustworthy, and high-end, inspired by top international law firm websites.
Style
Minimalist, elegant, high-end aesthetic
Monochrome palette with lots of whitespace and delicate serif typography
Header
Transparent navigation that becomes solid on scroll
Logo on left
Gold "Free Consultation" CTA button
Hero Section
Full-screen hero with dramatic courtroom or lawyer office background image
Small badge: "Trusted Legal Advisors Since 1998"
Large headline: "Protecting Your Rights with Excellence and Integrity"
Supporting paragraph describing legal expertise
CTA buttons: Book Consultation, Our Services
Elegant floating statistics card (25+ Years Experience, 12,000+ Clients Served, 98% Success Rate, 120+ Awards)
About
Two-column layout. Left: Professional lawyer image. Right: About the Firm, Mission, Vision, Core Values, Signature of founder, Experience counter
How It Works
Simple numbered steps walking through what happens after a client reaches out, from consultation to resolution
FAQ
Elegant accordion with common legal questions relevant to ${keyword}
Final CTA
Consultation Form section closing the page
Consultation Form
Form Title: Request a Free ${keyword} Consultation
Subtitle: Fill out the form below and one of our legal experts will contact you within 24 hours.
Fields: Full Name, Email Address, Phone Number, Legal Service (Dropdown: Corporate Law, Family Law, Criminal Defense, Real Estate Law, Employment Law, Other), Message (Optional)
Submit Button: Book Free Consultation
Form Features: Modern rounded input fields (10–12px radius), Floating labels, Client-side validation, Success confirmation message, Mobile responsive, Gold accent on focus state, Subtle shadow and hover effects
Privacy note below the button: "Your information is kept confidential and will never be shared."
Footer
Multi-column luxury footer with: Logo, Contact, Newsletter, Social icons, Copyright
Animations
Smooth fade-in, Scroll reveal, Hover lift effects, Gold underline animation, Image zoom on hover, Button ripple, Sticky header
Design Requirements
Pixel-perfect, fully responsive, accessible, high-conversion layout, consistent 8px spacing system throughout.`,
    ]
  },
  "Other": {
    chips: ["Consulting", "Event Booking", "Local Service", "Fitness", "Restaurant", "Education"],
    templates: [
      (keyword: string) => `Design a clean, professional, high-converting landing page for a ${keyword} business.
The design should feel trustworthy, modern, and tailored to the specific goals of a ${keyword} audience.
Header
Sticky navbar: Logo left, Contact
Primary CTA button relevant to ${keyword} (e.g. "Book Now", "Get Started", "Reserve a Table")
Hero Section
Headline communicating the core value of ${keyword} in one clear sentence
Supporting paragraph, primary + secondary CTA buttons
Supporting image or short video relevant to ${keyword}
Trust indicators: ratings, years active, clients served, or press mentions
About
Short section introducing the ${keyword} business: story, mission, and what makes it different
4 feature blocks highlighting differentiators relevant to ${keyword}
How It Works
Simple numbered steps showing how a customer engages with this ${keyword} business
FAQ
Accordion answering common questions about ${keyword}
Final CTA
Lead Capture Form section closing the page
Lead Capture Form
Form Title: Get Started With ${keyword}
Subtitle: Fill out the form and we'll get back to you shortly.
Fields: Full Name, Email, Phone Number, Message/Details, Submit
Submit Button: Submit Request
Form Features: rounded inputs, floating labels, validation, success confirmation, mobile responsive, brand-color focus state
Footer
Multi-column footer: Logo, Contact, Social icons, Copyright
Animations
Fade-in on scroll, hover lift on cards, smooth transitions, button hover states
Design Requirements
Pixel-perfect, fully responsive, accessible, high-conversion layout, consistent 8px spacing system throughout.`,
      (keyword: string) => `Design a clean, professional, high-converting landing page for a ${keyword} business.
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
About
Short section introducing the ${keyword} business: story, mission, and what makes it different
4 feature blocks highlighting differentiators relevant to ${keyword}
How It Works
Simple numbered steps showing how a customer engages with this ${keyword} business
FAQ
Accordion answering common questions about ${keyword}
Final CTA
Lead Capture Form section closing the page
Lead Capture Form
Form Title: Get Started With ${keyword}
Subtitle: Fill out the form and we'll get back to you shortly.
Fields: Full Name, Email, Phone Number, Message/Details, Submit
Submit Button: Submit Request
Form Features: rounded inputs, floating labels, validation, success confirmation, mobile responsive, brand-color focus state
Footer
Multi-column footer: Logo, Contact, Social icons, Copyright
Animations
Fade-in on scroll, hover lift on cards, smooth transitions, button hover states
Design Requirements
Pixel-perfect, fully responsive, accessible, high-conversion layout, consistent 8px spacing system throughout.`,
      (keyword: string) => `Design a clean, professional, high-converting landing page for a ${keyword} business.
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
About
Short section introducing the ${keyword} business: story, mission, and what makes it different
4 feature blocks highlighting differentiators relevant to ${keyword}
How It Works
Simple numbered steps showing how a customer engages with this ${keyword} business
FAQ
Accordion answering common questions about ${keyword}
Final CTA
Lead Capture Form section closing the page
Lead Capture Form
Form Title: Get Started With ${keyword}
Subtitle: Fill out the form and we'll get back to you shortly.
Fields: Full Name, Email, Phone Number, Message/Details, Submit
Submit Button: Submit Request
Form Features: rounded inputs, floating labels, validation, success confirmation, mobile responsive, brand-color focus state
Footer
Multi-column footer: Logo, Contact, Social icons, Copyright
Animations
Fade-in on scroll, hover lift on cards, smooth transitions, button hover states
Design Requirements
Creative, broken-grid, Pixel-perfect, fully responsive, accessible, high-conversion layout, consistent 8px spacing system throughout.`,
      (keyword: string) => `Design a clean, professional, high-converting landing page for a ${keyword} business.
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
About
Short section introducing the ${keyword} business: story, mission, and what makes it different
4 feature blocks highlighting differentiators relevant to ${keyword}
How It Works
Simple numbered steps showing how a customer engages with this ${keyword} business
FAQ
Accordion answering common questions about ${keyword}
Final CTA
Lead Capture Form section closing the page
Lead Capture Form
Form Title: Get Started With ${keyword}
Subtitle: Fill out the form and we'll get back to you shortly.
Fields: Full Name, Email, Phone Number, Message/Details, Submit
Submit Button: Submit Request
Form Features: rounded inputs, floating labels, validation, success confirmation, mobile responsive, brand-color focus state
Footer
Multi-column footer: Logo, Contact, Social icons, Copyright
Animations
Fade-in on scroll, hover lift on cards, smooth transitions, button hover states
Design Requirements
Pixel-perfect, fully responsive, accessible, high-conversion layout, consistent 8px spacing system throughout.`,
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