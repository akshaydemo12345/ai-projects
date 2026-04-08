// PageCraft API Service — Single file for all CRUD operations
// Uses static data as mock, ready to connect to real API

export interface Site {
  id: string;
  name: string;
  url: string;
  status: "published" | "draft";
  views: number;
  leads: number;
  conversion: string;
  publishedAt: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  siteId: string;
  createdAt: string;
}

export interface PageSection {
  id: string;
  type: "hero" | "features" | "testimonials" | "pricing" | "contact" | "faq" | "benefits";
  title: string;
  content: Record<string, unknown>;
}

// --- Static Data ---
let sites: Site[] = [
  {
    id: "1",
    name: "SaaS Marketing Pro",
    url: "https://saas-marketing-pro-7x2k.pagebuilder.ai",
    status: "published",
    views: 1245,
    leads: 847,
    conversion: "4.2%",
    publishedAt: "2 days ago",
  },
  {
    id: "2",
    name: "Startup Launch Page",
    url: "https://startup-launch-a9b3.pagebuilder.ai",
    status: "published",
    views: 890,
    leads: 432,
    conversion: "3.8%",
    publishedAt: "5 days ago",
  },
  {
    id: "3",
    name: "Product Hunt Launch",
    url: "https://product-hunt-c2d1.pagebuilder.ai",
    status: "draft",
    views: 0,
    leads: 0,
    conversion: "0%",
    publishedAt: "",
  },
];

let leads: Lead[] = [
  { id: "1", name: "John Doe", email: "john@example.com", phone: "+1234567890", siteId: "2", createdAt: "2024-01-15" },
  { id: "2", name: "Jane Smith", email: "jane@example.com", phone: "+1234567891", siteId: "2", createdAt: "2024-01-16" },
];

let pageSections: PageSection[] = [
  {
    id: "1",
    type: "hero",
    title: "Hero Section",
    content: {
      heading: "Launch Your Product with Confidence",
      subheading: "Build, test, and deploy your product faster with our comprehensive platform",
      cta: "Get Started Free",
    },
  },
  {
    id: "2",
    type: "features",
    title: "Features Grid",
    content: {
      features: [
        { title: "Amazing Feature 1", description: "Description of this amazing feature that will help your business grow." },
        { title: "Amazing Feature 2", description: "Description of this amazing feature that will help your business grow." },
        { title: "Amazing Feature 3", description: "Description of this amazing feature that will help your business grow." },
      ],
    },
  },
];

// --- Simulated async delay ---
const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

// --- Sites API ---
export const sitesApi = {
  getAll: async (): Promise<Site[]> => {
    await delay();
    return [...sites];
  },
  getById: async (id: string): Promise<Site | undefined> => {
    await delay();
    return sites.find((s) => s.id === id);
  },
  create: async (data: Omit<Site, "id">): Promise<Site> => {
    await delay();
    const newSite: Site = { ...data, id: String(Date.now()) };
    sites = [...sites, newSite];
    return newSite;
  },
  update: async (id: string, data: Partial<Site>): Promise<Site | undefined> => {
    await delay();
    const idx = sites.findIndex((s) => s.id === id);
    if (idx === -1) return undefined;
    sites[idx] = { ...sites[idx], ...data };
    sites = [...sites];
    return sites[idx];
  },
  delete: async (id: string): Promise<boolean> => {
    await delay();
    const len = sites.length;
    sites = sites.filter((s) => s.id !== id);
    return sites.length < len;
  },
};

// --- Leads API ---
export const leadsApi = {
  getAll: async (): Promise<Lead[]> => {
    await delay();
    return [...leads];
  },
  getBySiteId: async (siteId: string): Promise<Lead[]> => {
    await delay();
    return leads.filter((l) => l.siteId === siteId);
  },
  create: async (data: Omit<Lead, "id">): Promise<Lead> => {
    await delay();
    const newLead: Lead = { ...data, id: String(Date.now()) };
    leads = [...leads, newLead];
    return newLead;
  },
  delete: async (id: string): Promise<boolean> => {
    await delay();
    const len = leads.length;
    leads = leads.filter((l) => l.id !== id);
    return leads.length < len;
  },
};

// --- Page Sections API ---
export const sectionsApi = {
  getAll: async (): Promise<PageSection[]> => {
    await delay();
    return [...pageSections];
  },
  getById: async (id: string): Promise<PageSection | undefined> => {
    await delay();
    return pageSections.find((s) => s.id === id);
  },
  create: async (data: Omit<PageSection, "id">): Promise<PageSection> => {
    await delay();
    const newSection: PageSection = { ...data, id: String(Date.now()) };
    pageSections = [...pageSections, newSection];
    return newSection;
  },
  update: async (id: string, data: Partial<PageSection>): Promise<PageSection | undefined> => {
    await delay();
    const idx = pageSections.findIndex((s) => s.id === id);
    if (idx === -1) return undefined;
    pageSections[idx] = { ...pageSections[idx], ...data };
    pageSections = [...pageSections];
    return pageSections[idx];
  },
  delete: async (id: string): Promise<boolean> => {
    await delay();
    const len = pageSections.length;
    pageSections = pageSections.filter((s) => s.id !== id);
    return pageSections.length < len;
  },
};

// --- Stats API ---
export const statsApi = {
  getDashboardStats: async () => {
    await delay();
    return {
      totalSites: sites.length,
      totalLeads: leads.length + 1845,
      avgConversion: "4.2%",
      totalViews: sites.reduce((sum, s) => sum + s.views, 0),
    };
  },
};
