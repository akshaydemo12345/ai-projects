export const INDUSTRY_PROMPTS: Record<string, { chips: string[], templates: ((keyword: string) => string)[] }> = {
  "SaaS": {
    chips: ["CRM", "Analytics", "Marketing Tool", "HR Software", "Project Management", "Fintech"],
    templates: [
      (keyword: string) => `Design a modern, high-converting landing page for a ${keyword} SaaS product. The page MUST have EXACTLY 6 sections in the following order:
1. Header: Sticky navbar with Logo on the left and a CTA button on the right.
2. Hero Section: Catchy headline for ${keyword}, a short subheadline, two CTA buttons, and a tech dashboard mockup image.
3. Features: 3-column grid highlighting key benefits of the software.
4. Social Proof: A testimonial section with 3 customer reviews and star ratings.
5. Lead Capture Form: A clean form section for booking a demo or signing up (Name, Email, Company, Submit Button).
6. Footer: Simple footer with Logo, copyright, and basic links.
Design Requirements: Pixel-perfect, fully responsive, modern aesthetics, consistent spacing.`
    ]
  },
  "Agency": {
    chips: ["Digital Marketing", "Design Studio", "SEO Agency", "PR Firm", "Dev Shop", "Consulting"],
    templates: [
      (keyword: string) => `Design a creative and bold landing page for a ${keyword} agency. The page MUST have EXACTLY 6 sections in the following order:
1. Header: Modern navbar with Logo on the left and a "Start a Project" button on the right.
2. Hero Section: Impactful headline targeting clients for ${keyword}, a bold subheadline, a CTA button, and a creative agency background image.
3. Our Services: A grid layout displaying 3 to 4 core agency services.
4. Portfolio/About: A brief "About Us" highlighting agency expertise and success metrics.
5. Lead Capture Form: A contact form section for project inquiries (Name, Email, Project Details, Submit Button).
6. Footer: Minimal footer with Logo, social icons, and copyright.
Design Requirements: Pixel-perfect, fully responsive, creative layout, vibrant colors.`
    ]
  },
  "Healthcare": {
    chips: ["Dental Clinic", "Cardiology", "Pediatrics", "Physiotherapy", "Dermatology", "General Practice"],
    templates: [
      (keyword: string) => `Design a clean, trustworthy landing page for a ${keyword} healthcare provider. The page MUST have EXACTLY 6 sections in the following order:
1. Header: Medical-themed navbar with Logo on the left, emergency contact info, and "Book Appointment" button.
2. Hero Section: Compassionate headline for ${keyword}, a supportive subheadline, a "Book Appointment" CTA, and a high-quality medical image.
3. Medical Services: A clean layout showing 3 main medical services or treatments offered.
4. Patient Reviews: A section displaying positive feedback from 2 or 3 happy patients.
5. Lead Capture Form: An appointment booking form (Name, Phone, Preferred Date, Submit Button).
6. Footer: Professional footer with Logo, clinic address, and copyright text.
Design Requirements: Pixel-perfect, fully responsive, calming colors (blues/whites), highly accessible.`
    ]
  },
  "Real Estate": {
    chips: ["Luxury Homes", "Commercial", "Property Management", "Realtor", "Apartment Complex", "Brokerage"],
    templates: [
      (keyword: string) => `Design an elegant, premium landing page for a ${keyword} real estate business. The page MUST have EXACTLY 6 sections in the following order:
1. Header: Luxury navbar with Logo on the left and a "Contact Agent" button.
2. Hero Section: Stunning property background image, a bold headline for ${keyword}, and a prominent CTA button.
3. Featured Listings/Services: A grid showcasing 3 beautiful properties or core real estate services.
4. Why Choose Us: A section explaining the agent/brokerage expertise with a professional headshot.
5. Lead Capture Form: An inquiry form to schedule a viewing or request a callback (Name, Email, Phone, Message, Submit Button).
6. Footer: Elegant footer with Logo, contact details, and copyright.
Design Requirements: Pixel-perfect, fully responsive, premium typography, sophisticated spacing.`
    ]
  },
  "Plumber": {
    chips: ["Emergency Plumbing", "Drain Cleaning", "Water Heater", "Pipe Repair", "Commercial Plumbing", "HVAC"],
    templates: [
      (keyword: string) => `Design a high-converting, urgent landing page for a ${keyword} home service business. The page MUST have EXACTLY 6 sections in the following order:
1. Header: Trustworthy navbar with Logo on the left and a prominent Phone Number/CTA button.
2. Hero Section: Action-oriented headline for ${keyword}, a subheadline highlighting fast response times, a "Call Now" button, and an image of a professional at work.
3. Our Services: A grid of 3 to 4 core maintenance and repair services.
4. Trust & Reviews: A section highlighting licensed/insured status and 3 customer reviews.
5. Lead Capture Form: An emergency service request form (Name, Phone, Address, Issue, Submit Button).
6. Footer: Basic footer with Logo, service areas, and copyright.
Design Requirements: Pixel-perfect, fully responsive, bold and clear typography, trust-building colors.`
    ]
  },
  "Lawyer": {
    chips: ["Personal Injury", "Family Law", "Corporate Law", "Criminal Defense", "Immigration", "Real Estate Law"],
    templates: [
      (keyword: string) => `Design an authoritative, highly professional landing page for a ${keyword} law firm. The page MUST have EXACTLY 6 sections in the following order:
1. Header: Classic navbar with Logo on the left and a "Free Consultation" button.
2. Hero Section: Strong, commanding headline for ${keyword}, a brief subheadline emphasizing justice/results, a CTA button, and a professional legal background.
3. Practice Areas: A clean layout detailing 3 main areas of legal expertise.
4. Attorney Profile: A brief "About" section featuring a professional headshot and experience metrics.
5. Lead Capture Form: A confidential case evaluation form (Name, Phone, Email, Case Details, Submit Button).
6. Footer: Formal footer with Logo, legal disclaimer, and copyright.
Design Requirements: Pixel-perfect, fully responsive, elegant and serious aesthetic, serif fonts for headings.`
    ]
  },
  "Other": {
    chips: ["Consulting", "Event Booking", "Local Service", "Fitness", "Restaurant", "Education"],
    templates: [
      (keyword: string) => `Design a clean, professional, high-converting landing page for a ${keyword} business. The page MUST have EXACTLY 6 sections in the following order:
1. Header: Standard navbar with Logo on the left and a primary CTA button on the right.
2. Hero Section: A clear headline communicating the core value of ${keyword}, a supporting subheadline, a CTA button, and a relevant background image.
3. Features/Services: A 3-column grid highlighting the main offerings.
4. About/Testimonials: A section building trust through a brief about description or customer reviews.
5. Lead Capture Form: A general contact/booking form (Name, Email, Phone, Submit Button).
6. Footer: Simple footer with Logo, contact info, and copyright.
Design Requirements: Pixel-perfect, fully responsive, modern design, consistent spacing.`
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