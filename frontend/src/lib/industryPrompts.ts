export const INDUSTRY_PROMPTS: Record<string, { chips: string[], templates: ((keyword: string) => string)[] }> = {
  "SaaS": {
    chips: ["CRM", "Analytics", "Marketing Tool", "HR Software", "Project Management", "Fintech"],
    templates: [
      (keyword: string) => `Design a modern landing page for a ${keyword} SaaS product. The page MUST have EXACTLY 6 sections in this order:
1. Header: Sticky navbar with Logo and a CTA button.
2. Hero Section: Catchy headline, subheadline, two CTA buttons, and a dashboard mockup image.
3. Features: 3-column grid highlighting key benefits.
4. Social Proof: 3 customer testimonials with star ratings.
5. Lead Capture Form: A clean form for booking a demo (Name, Email, Company, Submit).
6. Footer: Simple footer with Logo and basic links.`,
      (keyword: string) => `Design a dark-theme landing page for a ${keyword} SaaS product. The page MUST have EXACTLY 6 sections in this order:
1. Header: Sleek navbar with Logo and CTA.
2. Hero Section: Bold headline, tech-focused subheadline, and an abstract tech illustration.
3. How It Works: A 3-step visual guide on using the software.
4. Pricing: 2 or 3 pricing tiers (e.g. Basic, Pro).
5. Lead Capture Form: A signup form to start a free trial (Name, Email, Password, Submit).
6. Footer: Minimal footer with Logo and social icons.`,
      (keyword: string) => `Design a corporate landing page for an enterprise ${keyword} software. The page MUST have EXACTLY 6 sections in this order:
1. Header: Professional navbar with Logo and "Contact Sales" button.
2. Hero Section: Enterprise-focused headline, value proposition, and a professional team image.
3. Core Solutions: Detailed descriptions of 3 major software solutions.
4. FAQ: An accordion with 3 to 4 frequently asked questions.
5. Lead Capture Form: An enterprise inquiry form (Name, Work Email, Company Size, Submit).
6. Footer: Corporate footer with Logo, address, and legal links.`
    ]
  },
  "Agency": {
    chips: ["Digital Marketing", "Design Studio", "SEO Agency", "PR Firm", "Dev Shop", "Consulting"],
    templates: [
      (keyword: string) => `Design a creative landing page for a ${keyword} agency. The page MUST have EXACTLY 6 sections in this order:
1. Header: Modern navbar with Logo and "Start Project" button.
2. Hero Section: Impactful headline, bold subheadline, and a creative background image.
3. Our Services: A grid displaying 3 to 4 core agency services.
4. Portfolio Highlights: 3 visual cards showcasing previous successful projects.
5. Lead Capture Form: A project inquiry form (Name, Email, Project Details, Submit).
6. Footer: Minimal footer with Logo and social links.`,
      (keyword: string) => `Design a premium, minimalist landing page for a boutique ${keyword} agency. The page MUST have EXACTLY 6 sections in this order:
1. Header: Minimalist navbar with Logo and contact link.
2. Hero Section: Sophisticated headline, elegant typography, and a sleek abstract background.
3. Our Approach: A timeline or step-by-step methodology of how the agency works.
4. Client Testimonials: 2 in-depth reviews from high-profile clients.
5. Lead Capture Form: A sleek consultation request form (Name, Email, Phone, Submit).
6. Footer: Clean footer with Logo and copyright.`,
      (keyword: string) => `Design an energetic, bold landing page for a fast-growing ${keyword} agency. The page MUST have EXACTLY 6 sections in this order:
1. Header: Vibrant navbar with Logo and CTA.
2. Hero Section: High-energy headline, strong CTA, and a dynamic team photo.
3. Why Choose Us: 4 key reasons/stats highlighting agency growth and results.
4. Our Team: Small section introducing 3 key team members.
5. Lead Capture Form: A "Get a Free Audit" form (Name, Email, Website URL, Submit).
6. Footer: Bold footer with Logo and newsletter signup.`
    ]
  },
  "Healthcare": {
    chips: ["Dental Clinic", "Cardiology", "Pediatrics", "Physiotherapy", "Dermatology", "General Practice"],
    templates: [
      (keyword: string) => `Design a clean, trustworthy landing page for a ${keyword} healthcare provider. The page MUST have EXACTLY 6 sections in this order:
1. Header: Medical-themed navbar with Logo and "Book Appointment" button.
2. Hero Section: Compassionate headline, supportive subheadline, and a high-quality medical image.
3. Medical Services: A clean layout showing 3 main medical treatments offered.
4. Patient Reviews: Positive feedback from 3 happy patients.
5. Lead Capture Form: An appointment booking form (Name, Phone, Preferred Date, Submit).
6. Footer: Professional footer with Logo and clinic address.`,
      (keyword: string) => `Design a modern, reassuring landing page for a ${keyword} clinic. The page MUST have EXACTLY 6 sections in this order:
1. Header: Navbar with Logo, emergency number, and CTA.
2. Hero Section: Calming headline, inviting subheadline, and a photo of a friendly doctor.
3. Clinic Highlights: 3 features (e.g. Modern Equipment, 24/7 Care, Experienced Staff).
4. Our Specialists: A brief introduction to 2 or 3 top doctors.
5. Lead Capture Form: A consultation request form (Name, Email, Phone, Message, Submit).
6. Footer: Clean footer with Logo, opening hours, and contact info.`,
      (keyword: string) => `Design a highly professional landing page for a ${keyword} medical center. The page MUST have EXACTLY 6 sections in this order:
1. Header: Formal navbar with Logo and a patient portal link.
2. Hero Section: Authoritative headline emphasizing expertise, and a picture of the medical facility.
3. Treatment Plans: Detailed cards explaining different care programs.
4. FAQ: An accordion answering 4 common patient questions.
5. Lead Capture Form: A quick registration form (Name, Email, Service Required, Submit).
6. Footer: Comprehensive footer with Logo, emergency contacts, and legal terms.`
    ]
  },
  "Real Estate": {
    chips: ["Luxury Homes", "Commercial", "Property Management", "Realtor", "Apartment Complex", "Brokerage"],
    templates: [
      (keyword: string) => `Design an elegant landing page for a ${keyword} real estate business. The page MUST have EXACTLY 6 sections in this order:
1. Header: Luxury navbar with Logo and "Contact Agent" button.
2. Hero Section: Stunning property background image, bold headline, and a prominent CTA.
3. Featured Listings: A grid showcasing 3 beautiful properties.
4. Why Choose Us: A section explaining the agent's expertise.
5. Lead Capture Form: An inquiry form to schedule a viewing (Name, Email, Phone, Message, Submit).
6. Footer: Elegant footer with Logo and contact details.`,
      (keyword: string) => `Design a modern, results-driven landing page for a ${keyword} real estate team. The page MUST have EXACTLY 6 sections in this order:
1. Header: Clean navbar with Logo and CTA.
2. Hero Section: Engaging headline targeting home buyers/sellers, and an image of a happy family in a home.
3. Market Stats: 3 dynamic statistics (e.g. Homes Sold, Average Days on Market).
4. Client Success Stories: 2 detailed testimonials from recent home buyers.
5. Lead Capture Form: A "Free Home Valuation" form (Name, Email, Property Address, Submit).
6. Footer: Simple footer with Logo and social icons.`,
      (keyword: string) => `Design a premium landing page for ${keyword} commercial properties. The page MUST have EXACTLY 6 sections in this order:
1. Header: Professional navbar with Logo and "Consult Now" button.
2. Hero Section: Corporate headline, strong value proposition, and a commercial building image.
3. Investment Opportunities: 3 cards detailing commercial investment benefits.
4. Our Process: A 3-step guide to acquiring commercial real estate.
5. Lead Capture Form: A detailed investor inquiry form (Name, Phone, Investment Size, Submit).
6. Footer: Corporate footer with Logo, office locations, and legal info.`
    ]
  },
  "Plumber": {
    chips: ["Emergency Plumbing", "Drain Cleaning", "Water Heater", "Pipe Repair", "Commercial Plumbing", "HVAC"],
    templates: [
      (keyword: string) => `Design an urgent, high-converting landing page for a ${keyword} service. The page MUST have EXACTLY 6 sections in this order:
1. Header: Trustworthy navbar with Logo and a prominent Phone Number.
2. Hero Section: Action-oriented headline, fast response promise, "Call Now" button, and an image of a professional at work.
3. Our Services: A grid of 3 to 4 core repair services.
4. Trust & Reviews: Licensed/insured badges and 3 customer reviews.
5. Lead Capture Form: An emergency service request form (Name, Phone, Address, Issue, Submit).
6. Footer: Basic footer with Logo and service areas.`,
      (keyword: string) => `Design a friendly, local landing page for a ${keyword} business. The page MUST have EXACTLY 6 sections in this order:
1. Header: Simple navbar with Logo and "Get a Quote" button.
2. Hero Section: Welcoming headline, community-focused subheadline, and an image of a branded service van.
3. Why Hire Us: 3 reasons (e.g. Upfront Pricing, 24/7 Availability, Satisfaction Guarantee).
4. Service Discounts: A special offer or coupon section for first-time customers.
5. Lead Capture Form: A "Request a Free Estimate" form (Name, Email, Phone, Description, Submit).
6. Footer: Clean footer with Logo, operating hours, and contact info.`,
      (keyword: string) => `Design a rugged, industrial landing page for a commercial ${keyword} company. The page MUST have EXACTLY 6 sections in this order:
1. Header: Bold navbar with Logo and "Contact Dispatch" button.
2. Hero Section: Strong headline emphasizing heavy-duty work, and an image of industrial pipes/equipment.
3. Commercial Solutions: Detailed descriptions of large-scale maintenance services.
4. FAQ: An accordion answering 3 common commercial service questions.
5. Lead Capture Form: A commercial contract inquiry form (Name, Company, Phone, Scope of Work, Submit).
6. Footer: Rugged footer with Logo, certifications, and address.`
    ]
  },
  "Lawyer": {
    chips: ["Personal Injury", "Family Law", "Corporate Law", "Criminal Defense", "Immigration", "Real Estate Law"],
    templates: [
      (keyword: string) => `Design an authoritative landing page for a ${keyword} law firm. The page MUST have EXACTLY 6 sections in this order:
1. Header: Classic navbar with Logo and a "Free Consultation" button.
2. Hero Section: Commanding headline, subheadline emphasizing justice/results, and a professional legal background.
3. Practice Areas: A clean layout detailing 3 main areas of legal expertise.
4. Attorney Profile: A brief "About" section featuring a professional headshot.
5. Lead Capture Form: A confidential case evaluation form (Name, Phone, Email, Case Details, Submit).
6. Footer: Formal footer with Logo and legal disclaimer.`,
      (keyword: string) => `Design a modern, approachable landing page for a ${keyword} attorney. The page MUST have EXACTLY 6 sections in this order:
1. Header: Clean navbar with Logo and contact number.
2. Hero Section: Empathetic headline ("We're here to help"), supportive text, and an image of a lawyer talking to a client.
3. How We Help: A 3-step process of the legal journey.
4. Client Testimonials: 2 anonymous but impactful reviews from past clients.
5. Lead Capture Form: A quick contact form to get legal advice (Name, Phone, Best Time to Call, Submit).
6. Footer: Simple footer with Logo, office address, and privacy policy.`,
      (keyword: string) => `Design a highly aggressive, results-driven landing page for a ${keyword} law group. The page MUST have EXACTLY 6 sections in this order:
1. Header: Bold navbar with Logo and red "Get Help Now" button.
2. Hero Section: Strong headline ("We fight for you"), impressive settlement stats, and an imposing courthouse background.
3. Recent Victories: 3 cards showing multi-million dollar settlements or case wins.
4. Why Choose Us: 4 bullet points emphasizing aggressive representation and no-fee guarantees.
5. Lead Capture Form: An urgent "Do you have a case?" form (Name, Phone, Incident Date, Submit).
6. Footer: Dark footer with Logo, disclaimers, and 24/7 hotline.`
    ]
  },
  "Other": {
    chips: ["Consulting", "Event Booking", "Local Service", "Fitness", "Restaurant", "Education"],
    templates: [
      (keyword: string) => `Design a clean landing page for a ${keyword} business. The page MUST have EXACTLY 6 sections in this order:
1. Header: Standard navbar with Logo and a primary CTA button.
2. Hero Section: A clear headline communicating core value, a subheadline, a CTA, and a relevant background image.
3. Features/Services: A 3-column grid highlighting the main offerings.
4. About/Testimonials: A section building trust through a brief description or customer reviews.
5. Lead Capture Form: A general contact/booking form (Name, Email, Phone, Submit).
6. Footer: Simple footer with Logo and contact info.`,
      (keyword: string) => `Design a vibrant landing page for a modern ${keyword} brand. The page MUST have EXACTLY 6 sections in this order:
1. Header: Colorful navbar with Logo and CTA.
2. Hero Section: Punchy headline, exciting subheadline, and a highly engaging lifestyle image.
3. How It Works: A fun 3-step visual representation of the customer journey.
4. Gallery/Showcase: 3 visual cards highlighting the product or service in action.
5. Lead Capture Form: An engaging signup/newsletter form (Name, Email, Submit).
6. Footer: Playful footer with Logo and social media icons.`,
      (keyword: string) => `Design a minimalist landing page for a premium ${keyword} service. The page MUST have EXACTLY 6 sections in this order:
1. Header: Elegant navbar with Logo and subtle contact link.
2. Hero Section: Sophisticated headline, plenty of whitespace, and a high-end minimalist background.
3. The Experience: Detailed text sections explaining the premium value provided.
4. FAQ: A sleek accordion with 3 essential questions.
5. Lead Capture Form: A refined inquiry form (Name, Email, specific request, Submit).
6. Footer: Minimalist footer with Logo and copyright text.`
    ]
  }
};

export const getIndustryKey = (industry: string) => {
  if (!industry) return "Other";
  const i = industry.toLowerCase();
  
  if (i.includes("saas") || i.includes("software") || i.includes("tech") || i.includes("app")) return "SaaS";
  if (i.includes("agency") || i.includes("marketing") || i.includes("design") || i.includes("seo")) return "Agency";
  if (i.includes("health") || i.includes("medical") || i.includes("dental") || i.includes("doctor")) return "Healthcare";
  if (i.includes("real estate") || i.includes("property") || i.includes("realtor") || i.includes("broker")) return "Real Estate";
  if (i.includes("plumb") || i.includes("hvac") || i.includes("repair") || i.includes("electric")) return "Plumber";
  if (i.includes("law") || i.includes("legal") || i.includes("attorney")) return "Lawyer";
  
  return "Other";
};