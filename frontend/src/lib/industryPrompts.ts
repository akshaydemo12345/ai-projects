const DESIGN_STYLES = [
  "an ultra-premium, Apple-inspired minimalist landing page. Use extreme whitespace, elegant typography, and a sleek abstract background",
  "an aggressive, high-converting direct-response landing page. Use high-contrast colors (like yellow and black) to force attention and create urgency",
  "a narrative-driven, trustworthy landing page. Use a warm, empathetic tone with relatable lifestyle background images",
  "a cutting-edge, pure dark-mode tech landing page. Use neon accents, glowing borders, and futuristic typography",
  "a highly corporate, authoritative landing page. Use deep navy blues, serif fonts for headings, and a highly structured professional grid",
  "a vibrant, energetic, and playful landing page. Use bold, colorful gradients, rounded corners, and engaging lifestyle photography"
];

const GENERIC_STRUCTURES = [
  [
        "Header: Clean navbar with Logo and primary CTA.",
        "Hero Section: Catchy headline, clear subheadline, strong CTA, and a high-quality relevant image.",
        "Lead Capture Form: A clean inquiry/booking form (Name, Email, Phone, Submit).",
        "Features/Services: A 3-column grid highlighting key benefits or offerings.",
        "Social Proof: 3 customer testimonials or featured client logos.",
        "Footer: Standard footer with Logo, links, and contact info."
      ],
  [
        "Header: Sticky navbar with an urgent phone number.",
        "Hero Section: High-energy headline, countdown timer or limited offer, and a massive 'Claim Offer' button.",
        "Lead Capture Form: A highly aggressive, multi-step or detailed final CTA form.",
        "Why Us: 3 hard-hitting statistics or undeniable benefits.",
        "Wall of Love: A dense grid of 6 powerful customer reviews.",
        "Footer: Dark footer with legal disclaimers and emergency contacts."
      ],
  [
        "Header: Minimalist navbar with subtle contact link.",
        "Hero Section: Empathetic, story-driven headline and a beautiful, relatable hero image.",
        "Lead Capture Form: A soft lead capture (e.g., 'Download our free guide' or 'Book a friendly chat').",
        "The Problem/Solution: A split layout explaining the customer's pain point and how this solves it.",
        "Our Approach/Story: A narrative section about the founder or the company's unique methodology.",
        "Footer: Warm, clean footer with social links."
      ]
];

const generateTemplates = (industryContext: string, customStructures: string[][]) => {
  const templates: ((keyword: string) => string)[] = [];
  const allStructures = [...customStructures, ...GENERIC_STRUCTURES];
  
  for (const style of DESIGN_STYLES) {
    for (const sections of allStructures) {
      templates.push((keyword: string) => {
        // Extract fixed sections (Header, Hero, Footer)
        const header = sections[0];
        const hero = sections[1];
        const footer = sections[sections.length - 1];
        
        // Get middle sections and shuffle them
        const middleSections = sections.slice(2, sections.length - 1);
        for (let i = middleSections.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [middleSections[i], middleSections[j]] = [middleSections[j], middleSections[i]];
        }

        const finalSections = [header, hero, ...middleSections, footer];

        return `Design ${style} for a ${keyword || industryContext}. The page MUST have EXACTLY 6 sections in this order:\n` + 
          finalSections.map((s, i) => `${i + 1}. ${s}`).join("\n");
      });
    }
  }
  return templates;
};

export const INDUSTRY_PROMPTS: Record<string, { chips: string[], templates: ((keyword: string) => string)[] }> = {
  "SaaS": {
    chips: ["CRM", "Analytics", "Marketing Tool", "HR Software", "Project Management", "Fintech"],
    templates: generateTemplates("SaaS product", [
      [
        "Header: Sleek navbar with Logo and CTA.",
        "Hero Section: Bold headline, tech-focused subheadline, and an abstract tech illustration.",
        "Lead Capture Form: A signup form to start a free trial (Name, Email, Password, Submit).",
        "How It Works: A 3-step visual guide on using the software.",
        "Pricing: 2 or 3 pricing tiers (e.g. Basic, Pro).",
        "Footer: Minimal footer with Logo and social icons."
      ]
    ])
  },
  "Agency": {
    chips: ["Digital Marketing", "Design Studio", "SEO Agency", "PR Firm", "Dev Shop", "Consulting"],
    templates: generateTemplates("agency", [
      [
        "Header: Minimalist navbar with Logo and contact link.",
        "Hero Section: Sophisticated headline, elegant typography, and a sleek abstract background.",
        "Lead Capture Form: A sleek consultation request form (Name, Email, Phone, Submit).",
        "Our Approach: A timeline or step-by-step methodology of how the agency works.",
        "Client Testimonials: 2 in-depth reviews from high-profile clients.",
        "Footer: Clean footer with Logo and copyright."
      ]
    ])
  },
  "Healthcare": {
    chips: ["Dental Clinic", "Cardiology", "Pediatrics", "Physiotherapy", "Dermatology", "General Practice"],
    templates: generateTemplates("healthcare provider", [
      [
        "Header: Medical-themed navbar with Logo and 'Book Appointment' button.",
        "Hero Section: Compassionate headline, supportive subheadline, and a high-quality medical image.",
        "Lead Capture Form: An appointment booking form (Name, Phone, Preferred Date, Submit).",
        "Medical Services: A clean layout showing 3 main medical treatments offered.",
        "Patient Reviews: Positive feedback from 3 happy patients.",
        "Footer: Professional footer with Logo and clinic address."
      ]
    ])
  },
  "Real Estate": {
    chips: ["Luxury Homes", "Commercial", "Property Management", "Realtor", "Apartment Complex", "Brokerage"],
    templates: generateTemplates("real estate business", [
      [
        "Header: Luxury navbar with Logo and 'Contact Agent' button.",
        "Hero Section: Stunning property background image, bold headline, and a prominent CTA.",
        "Lead Capture Form: An inquiry form to schedule a viewing (Name, Email, Phone, Message, Submit).",
        "Featured Listings: A grid showcasing 3 beautiful properties.",
        "Why Choose Us: A section explaining the agent's expertise.",
        "Footer: Elegant footer with Logo and contact details."
      ]
    ])
  },
  "Plumber": {
    chips: ["Emergency Plumbing", "Drain Cleaning", "Water Heater", "Pipe Repair", "Commercial Plumbing", "HVAC"],
    templates: generateTemplates("plumbing or local service", [
      [
        "Header: Trustworthy navbar with Logo and a prominent Phone Number.",
        "Hero Section: Action-oriented headline, fast response promise, 'Call Now' button, and an image of a professional at work.",
        "Lead Capture Form: An emergency service request form (Name, Phone, Address, Issue, Submit).",
        "Our Services: A grid of 3 to 4 core repair services.",
        "Trust & Reviews: Licensed/insured badges and 3 customer reviews.",
        "Footer: Basic footer with Logo and service areas."
      ]
    ])
  },
  "Legal": {
    chips: ["Personal Injury", "Family Law", "Corporate Law", "Criminal Defense", "Immigration", "Real Estate Law"],
    templates: generateTemplates("law firm or attorney", [
      [
        "Header: Classic navbar with Logo and a 'Free Consultation' button.",
        "Hero Section: Commanding headline, subheadline emphasizing justice/results, and a professional legal background.",
        "Lead Capture Form: A confidential case evaluation form (Name, Phone, Email, Case Details, Submit).",
        "Practice Areas: A clean layout detailing 3 main areas of legal expertise.",
        "Attorney Profile: A brief 'About' section featuring a professional headshot.",
        "Footer: Formal footer with Logo and legal disclaimer."
      ]
    ])
  },
  "E-commerce": {
    chips: ["Fashion", "Electronics", "Health & Beauty", "Home Goods", "Sports"],
    templates: generateTemplates("e-commerce brand", [
      [
        "Header: Clean navbar with Logo, Search, and Cart icons.",
        "Hero Section: Catchy promotional headline, subheadline, 'Shop Now' button, and a stunning product image.",
        "Lead Capture Form: A newsletter signup form for a discount (Name, Email, Subscribe).",
        "Featured Products: A grid showcasing 3 to 4 top-selling items with prices.",
        "Benefits: 3 reasons to shop (e.g., Free Shipping, 24/7 Support, Secure Checkout).",
        "Footer: Standard footer with Logo, links, and payment methods."
      ]
    ])
  },
  "Finance": {
    chips: ["Accounting", "Investment", "Book Keeping", "Wealth Management", "Insurance"],
    templates: generateTemplates("financial firm", [
      [
        "Header: Professional navbar with Logo and 'Client Login' button.",
        "Hero Section: Authoritative headline, clear value proposition, and an image of corporate professionals.",
        "Lead Capture Form: A consultation request form (Name, Email, Phone, Financial Goal, Submit).",
        "Services: A clean layout detailing 3 core financial services.",
        "Social Proof: Logos of featured publications or 3 client testimonials.",
        "Footer: Formal footer with Logo, legal disclaimers, and contact info."
      ]
    ])
  },
  "Technology": {
    chips: ["Consumer Electronics", "AI", "Cybersecurity", "Cloud", "Software"],
    templates: generateTemplates("tech company", [
      [
        "Header: Minimal navbar with Logo and a 'Get Demo' button.",
        "Hero Section: Bold headline, tech-focused subheadline, and an abstract 3D or tech illustration.",
        "Lead Capture Form: A demo request form (Name, Work Email, Company, Submit).",
        "Key Features: 3 to 4 feature cards highlighting technological advantages.",
        "How It Works: A timeline or 3-step visualization.",
        "Footer: Minimal footer with Logo and social links."
      ]
    ])
  },
  "Consulting": {
    chips: ["Management", "HR", "Strategy", "Business", "IT"],
    templates: generateTemplates("consulting firm", [
      [
        "Header: Clean navbar with Logo and 'Book Strategy Call'.",
        "Hero Section: Impactful headline targeting business growth, and a professional background image.",
        "Lead Capture Form: A strategy call booking form (Name, Email, Company Size, Submit).",
        "Our Approach: A section explaining the consulting methodology.",
        "Success Stories: 2 detailed case studies or testimonials.",
        "Footer: Professional footer with Logo and copyright."
      ]
    ])
  },
  "Construction": {
    chips: ["Contractors", "Home Renovation", "Builders", "Remodeling", "Architecture"],
    templates: generateTemplates("construction or building company", [
      [
        "Header: Bold navbar with Logo and a 'Get a Quote' button.",
        "Hero Section: Strong headline emphasizing quality and reliability, with a background image of a construction site or finished project.",
        "Lead Capture Form: A project estimate request form (Name, Phone, Project Details, Submit).",
        "Core Services: A grid displaying 3 main construction services.",
        "Our Portfolio: A showcase of 3 successful projects with images.",
        "Footer: Heavy-duty footer with Logo, certifications, and address."
      ]
    ])
  },
  "Hospitality": {
    chips: ["Hotels", "Restaurants", "Events", "Travel Agency", "Resorts"],
    templates: generateTemplates("hospitality business", [
      [
        "Header: Elegant navbar with Logo and 'Book Now' button.",
        "Hero Section: Welcoming headline, experiential subheadline, and a breathtaking full-screen image.",
        "Lead Capture Form: A booking or reservation form (Name, Email, Dates/Time, Submit).",
        "The Experience: 3 sections highlighting amenities, food, or experiences.",
        "Guest Reviews: 3 glowing reviews from recent guests.",
        "Footer: Clean footer with Logo, location map link, and social icons."
      ]
    ])
  },
  "Beauty & Wellness": {
    chips: ["Salon", "Spa", "Yoga Studio", "Cosmetics", "Personal Care"],
    templates: generateTemplates("beauty or wellness brand", [
      [
        "Header: Minimalist navbar with Logo and 'Book Appointment'.",
        "Hero Section: Soothing headline, elegant typography, and a soft, beautiful background image.",
        "Lead Capture Form: An appointment booking form (Name, Phone, Service, Submit).",
        "Our Services: A beautifully styled grid showing 3 to 4 wellness or beauty treatments.",
        "Why Choose Us: A section on premium products or expert staff used.",
        "Footer: Elegant footer with Logo, opening hours, and Instagram feed."
      ]
    ])
  },
  "Sports": {
    chips: ["Cricket", "Football", "Basketball", "Tennis", "Sports Academy", "Club", "Sporting Goods"],
    templates: generateTemplates("sports club, team, or academy", [
      [
        "Header: Clean sports-themed navbar with Logo and 'View Schedule'.",
        "Hero Section: Energetic headline about teamwork and passion, with a stadium or team background image.",
        "Lead Capture Form: A fan club or academy registration form (Name, Phone, Email, Join, Submit).",
        "Upcoming Matches/Events: A section displaying the next 3 scheduled events or fixtures.",
        "Meet the Team/Coaches: A grid showcasing 3 key players or head coaches.",
        "Footer: Classic footer with Logo, sponsors, and social links."
      ]
    ])
  },
  "Fitness": {
    chips: ["Gym", "Personal Trainer", "Yoga Studio", "CrossFit", "Zumba", "Pilates"],
    templates: generateTemplates("fitness center, gym, or trainer", [
      [
        "Header: Dynamic navbar with Logo and 'Join Now' CTA.",
        "Hero Section: Bold, aggressive headline, strong CTA, and an action-packed fitness image.",
        "Lead Capture Form: A free trial signup form (Name, Email, Phone, Submit).",
        "Programs: 3 cards showing different training programs or fitness classes.",
        "Member Transformations: 2 inspiring before/after testimonials.",
        "Footer: Bold footer with Logo and location details."
      ]
    ])
  },
  "Education": {
    chips: ["Online Course", "Tutor", "School", "University", "Coaching"],
    templates: generateTemplates("educational institution or course", [
      [
        "Header: Clean navbar with Logo and 'Enroll Now'.",
        "Hero Section: Inspiring headline about learning, and an image of students or an online learning interface.",
        "Lead Capture Form: A course registration or inquiry form (Name, Email, Program of Interest, Submit).",
        "Curriculum/Benefits: 3 key takeaways or modules from the program.",
        "Student Success: 3 testimonials from successful alumni.",
        "Footer: Academic footer with Logo, accreditation info, and links."
      ]
    ])
  },
  "Home Services": {
    chips: ["Cleaning", "Landscaping", "Roofing", "Electrician"],
    templates: generateTemplates("local home service business", [
      [
        "Header: Trustworthy navbar with Logo and Phone Number.",
        "Hero Section: Clear headline, community-focused subheadline, and an image of a professional at work.",
        "Lead Capture Form: A 'Request a Free Quote' form (Name, Phone, Address, Service Needed, Submit).",
        "Services Offered: A clean layout showing 3 main services.",
        "Trust Elements: Badges (Licensed, Insured) and 3 customer reviews.",
        "Footer: Simple footer with Logo and service areas."
      ]
    ])
  },
  "Automotive": {
    chips: ["Automotive Services", "Dealership", "Mechanic", "Car Wash", "Auto Repair"],
    templates: generateTemplates("automotive business, dealership or mechanic", [
      [
        "Header: Rugged navbar with Logo and 'Book Service' button.",
        "Hero Section: Action-oriented headline, fast response promise, and an image of a professional mechanic or a sleek car.",
        "Lead Capture Form: A service appointment request form (Name, Phone, Car Model, Issue, Submit).",
        "Our Services: A grid of 3 to 4 core automotive services (e.g., Oil Change, Engine Repair, Tire Service).",
        "Trust & Reviews: Certified mechanic badges and 3 customer reviews.",
        "Footer: Basic footer with Logo, service areas, and emergency towing number."
      ]
    ])
  },
  "Other": {
    chips: ["Arts Gallery and Entertainment", "Community", "Lifestyle and People", "News", "Pawn Shop and Gunsmith", "Pets and Pet Care", "Waste Management", "Transportation Services", "Custom", "Non-profit"],
    templates: generateTemplates("business", [])
  }
};

export const getIndustryKey = (industry: string) => {
  if (!industry) return "Other";
  const i = industry.toLowerCase();
  
  if (i.includes("saas") || i.includes("software") || i.includes("app")) return "SaaS";
  if (i.includes("agency") || i.includes("marketing") || i.includes("design") || i.includes("seo") || i.includes("ppc")) return "Agency";
  if (i.includes("health") || i.includes("medical") || i.includes("dental") || i.includes("doctor") || i.includes("medicine")) return "Healthcare";
  if (i.includes("real estate") || i.includes("property") || i.includes("realtor") || i.includes("broker")) return "Real Estate";
  if (i.includes("plumb")) return "Plumber";
  if (i.includes("law") || i.includes("legal") || i.includes("attorney")) return "Legal";
  if (i.includes("e-commerce") || i.includes("ecommerce") || i.includes("retail") || i.includes("shop") || i.includes("clothing") || i.includes("gift") || i.includes("appliance")) return "E-commerce";
  if (i.includes("financ") || i.includes("account") || i.includes("invest") || i.includes("book keeping") || i.includes("insurance") || i.includes("money")) return "Finance";
  if (i.includes("tech") || i.includes("software") || i.includes("hardware") || i.includes("computer") || i.includes("science") || i.includes("communication")) return "Technology";
  if (i.includes("consult") || i.includes("recruit") || i.includes("employment") || i.includes("career")) return "Consulting";
  if (i.includes("construct") || i.includes("build") || i.includes("contractor") || i.includes("industrial") || i.includes("remodel")) return "Construction";
  if (i.includes("hospitality") || i.includes("hotel") || i.includes("restaurant") || i.includes("food") || i.includes("travel") || i.includes("event") || i.includes("wedding")) return "Hospitality";
  if (i.includes("beauty") || i.includes("wellness") || i.includes("spa") || i.includes("salon")) return "Beauty & Wellness";
  if (i.includes("sport") || i.includes("cricket") || i.includes("football") || i.includes("academy") || i.includes("recreation")) return "Sports";
  if (i.includes("fitness") || i.includes("gym") || i.includes("yoga") || i.includes("trainer")) return "Fitness";
  if (i.includes("education") || i.includes("school") || i.includes("tutor") || i.includes("course") || i.includes("coach") || i.includes("college")) return "Education";
  if (i.includes("home service") || i.includes("cleaning") || i.includes("roofing") || i.includes("electric") || i.includes("air condition") || i.includes("heating") || i.includes("security")) return "Home Services";
  if (i.includes("auto") || i.includes("car") || i.includes("mechanic")) return "Automotive";
  
  return "Other";
};
