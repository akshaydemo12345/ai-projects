const mongoose = require('mongoose');
const Lead = require('./src/models/Lead');
require('dotenv').config();

const projectId = "69f20f2a0cc947534057e2f6";
const pageId = "69f20f870cc947534057e33f";
const pageSlug = "test-1";

const mockLeads = [
  {
    projectId, pageId, pageSlug,
    data: {
      name: "Sarah Johnson",
      email: "sarah.j@techcorp.com",
      phone: "+1 555-0102",
      company: "TechCorp Solutions",
      industry: "Software",
      team_size: "50-100",
      budget: "$5,000 - $10,000",
      message: "Looking for a custom automation solution for our marketing team."
    },
    utm: { utm_source: "google", utm_medium: "cpc", utm_campaign: "enterprise_search", utm_content: "text_ad_v2" },
    meta: { ip: "192.168.1.45", userAgent: "Mozilla/5.0 Chrome/120.0.0.0" }
  },
  {
    projectId, pageId, pageSlug,
    data: {
      name: "Michael Chen",
      email: "m.chen@fintech.io",
      mobile_number: "+65 9123 4567",
      company: "FinStream",
      industry: "Finance",
      interested_in: "API Integration",
      message: "Can we schedule a demo for the bulk processing feature?"
    },
    utm: { utm_source: "linkedin", utm_medium: "social", utm_campaign: "fintech_leaders" },
    meta: { ip: "103.252.1.10", userAgent: "Mozilla/5.0 Safari/605.1.15" }
  },
  {
    projectId, pageId, pageSlug,
    data: {
      full_name: "Elena Rodriguez",
      personal_email: "elena.rod@gmail.com",
      phone: "+34 912 345 678",
      company: "Creative Madrid",
      project_scale: "Global",
      timeline: "3 Months"
    },
    utm: { utm_source: "newsletter", utm_medium: "email", utm_campaign: "spring_update", utm_term: "creative_agencies" },
    meta: { ip: "80.32.1.20", userAgent: "Mozilla/5.0 Firefox/121.0" }
  },
  {
    projectId, pageId, pageSlug,
    data: {
      name: "David Smith",
      email: "d.smith@retailgroup.com",
      contact: "+44 20 7946 0123",
      company: "Global Retail",
      industry: "Retail",
      message: "Need help with scaling our current landing pages."
    },
    utm: { utm_source: "facebook", utm_medium: "social", utm_campaign: "retargeting_q2", gclid: "gcl_882374928374" },
    meta: { ip: "31.13.127.1", userAgent: "Mozilla/5.0 iPhone; CPU iPhone OS 17_2" }
  },
  {
    projectId, pageId, pageSlug,
    data: {
      name: "Yuki Tanaka",
      email: "y.tanaka@startup.jp",
      phone: "+81 3 1234 5678",
      company: "NextGen AI",
      role: "CTO",
      use_case: "Customer Support Automation"
    },
    utm: { utm_source: "google", utm_medium: "organic", utm_term: "best ai landing pages" },
    meta: { ip: "118.238.1.1", userAgent: "Mozilla/5.0 Chrome/120.0.0.0" }
  },
  {
    projectId, pageId, pageSlug,
    data: {
      name: "Rajesh Kumar",
      email: "rajesh.k@gmail.com",
      mobile_number: "+91 98765 43210",
      industry: "Real Estate",
      property_type: "Luxury Apartment",
      location_preference: "Mumbai West",
      budget_range: "5Cr - 10Cr",
      message: "Looking for a sea-facing 4BHK. Please share brochure."
    },
    utm: { utm_source: "instagram", utm_medium: "social", utm_campaign: "luxury_living_2026" },
    meta: { ip: "49.36.1.10", userAgent: "Mozilla/5.0 Android; Pixel 8" }
  },
  {
    projectId, pageId, pageSlug,
    data: {
      name: "Sarah Miller",
      email: "smiller@realtygroup.com",
      phone: "+1 212-555-0199",
      mobile: "+1 212-555-0888",
      industry: "Real Estate",
      interest: "Commercial Leasing",
      company: "Miller & Associates",
      message: "Need information on available office spaces in Downtown."
    },
    utm: { utm_source: "google", utm_medium: "cpc", utm_campaign: "commercial_nyc", utm_term: "office space leasing" },
    meta: { ip: "66.249.66.1", userAgent: "Mozilla/5.0 Chrome/120.0.0.0" }
  },
  {
    projectId, pageId, pageSlug,
    data: {
      name: "Vikram Singh",
      email: "vikram.realestate@yahoo.com",
      contact_no: "+91 99887 76655",
      industry: "Real Estate",
      service_needed: "Property Valuation",
      property_address: "Plot 45, Sector 12, Gurgaon",
      message: "I want to sell my plot. Need current market valuation."
    },
    utm: { utm_source: "facebook", utm_medium: "social", utm_campaign: "seller_leads_q2" },
    meta: { ip: "157.34.1.20", userAgent: "Mozilla/5.0 Android; Samsung S24" }
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB...');

    // Add createdAt to make them look recent
    const leadsWithDates = mockLeads.map((l, i) => ({
      ...l,
      createdAt: new Date(Date.now() - (i * 1000 * 60 * 60 * 4)) // Spaced out by 4 hours
    }));

    await Lead.insertMany(leadsWithDates);
    console.log(`Successfully seeded ${leadsWithDates.length} high-quality leads!`);
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seed();
