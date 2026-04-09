// PageCraft API Service — Scalable modular API layer
// Connects to Node.js/MongoDB backend

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Types
export interface Site {
  _id: string;
  name: string;
  description: string;
  domain?: string;
  status: "published" | "draft";
  stats?: {
    views: number;
    leads: number;
    conversion: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  _id: string;
  name: string;
  description: string;
  url?: string;
  category: string;
  apiToken: string;
  userId: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  pages?: LandingPage[];
  stats?: {
    views: number;
    leads: number;
    conversion: number;
  };
}

export interface LandingPage {
  _id: string;
  name: string;
  title?: string;
  slug: string;
  type: "ppc" | "seo";
  status: "draft" | "published" | "generating" | "archived";
  content?: any;
  styles?: string;
  metaTitle?: string;
  metaDescription?: string;
  publishedUrl?: string; // Virtual/Frontend helper
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  logoUrl?: string;
  generationMethod?: "ai" | "analyze" | "manual";
  aiPrompt?: string;
  apiToken?: string;
  previewToken?: string;
  views: number;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  siteId: string;
  createdAt: string;
}

// Helper for fetch with Auth
async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('pagecraft_token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Unauthorized - clear token and potentially redirect
    localStorage.removeItem('pagecraft_token');
    localStorage.removeItem('pagecraft_user');
    window.location.href = '/login';
    throw new Error('Session expired. Please log in again.');
  }

  const result = await response.json();
  
  if (!response.ok) {
    throw new Error(result.message || 'Something went wrong');
  }

  return result;
}

// --- Auth API ---
export const authApi = {
  login: async (credentials: any) => {
    return apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },
  signup: async (data: any) => {
    return apiFetch('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  getProfile: async () => {
    return apiFetch('/auth/profile');
  },
};

// --- Projects API ---
export const projectsApi = {
  getAll: async () => {
    const res = await apiFetch('/projects');
    return res.data.projects;
  },
  getById: async (id: string) => {
    const res = await apiFetch(`/projects/${id}`);
    return res.data.project;
  },
  create: async (data: any) => {
    return apiFetch('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  update: async (id: string, data: any) => {
    return apiFetch(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  delete: async (id: string) => {
    return apiFetch(`/projects/${id}`, {
      method: 'DELETE',
    });
  },
};

// --- Pages API ---
export const pagesApi = {
  getPagesByProject: async (projectId: string) => {
    const res = await apiFetch(`/projects/${projectId}/pages`);
    return res.data.pages;
  },
  getById: async (projectId: string, pageId: string) => {
    const res = await apiFetch(`/projects/${projectId}/pages/${pageId}`);
    return res.data.page;
  },
  create: async (projectId: string, data: any) => {
    const res = await apiFetch(`/projects/${projectId}/pages`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.data;
  },
  update: async (projectId: string, pageId: string, data: any) => {
    const res = await apiFetch(`/projects/${projectId}/pages/${pageId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return res.data;
  },
  delete: async (projectId: string, pageId: string) => {
    return apiFetch(`/projects/${projectId}/pages/${pageId}`, {
      method: 'DELETE',
    });
  },
  getBySlug: async (slug: string) => {
    // 100% Public endpoint — serves content WITHOUT requiring tokens.
    const response = await fetch(`${API_BASE_URL}/api/public/page/${slug}`);
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Page not found');
    
    // Returns { status, data: content, meta: { title, seo } }
    return result;
  }
};

// --- AI API ---
export const aiApi = {
  generate: async (data: any) => {
    return apiFetch('/ai/generate', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  analyze: async (url: string) => {
    return apiFetch('/ai/analyze-website', {
      method: 'POST',
      body: JSON.stringify({ url }),
    });
  },
  improve: async (sectionData: any) => {
    return apiFetch('/ai/improve', {
      method: 'POST',
      body: JSON.stringify(sectionData),
    });
  },
};

// --- Legacy Compatibility Site API (Maps to Projects/Pages) ---
export const sitesApi = {
  getAll: async (): Promise<Site[]> => {
    // In our new backend, "Sites" are essentially "Pages" or "Projects"
    // For compatibility with old code, we fetch projects and map them
    const projects = await projectsApi.getAll();
    return projects.map((p: any) => ({
      _id: p._id,
      name: p.name,
      url: p.domain ? `https://${p.domain}` : '#',
      status: p.isPublished ? 'published' : 'draft',
      views: 0,
      leads: 0,
      conversion: "0%",
      publishedAt: p.createdAt,
    }));
  },
};

// --- Stats API ---
export const statsApi = {
  getDashboardStats: async () => {
    const res = await authApi.getProfile();
    return res.data.stats;
  },
};

// --- Leads API ---
export interface Lead {
  _id: string;
  name: string;
  email: string;
  phone: string;
  pageId: string;
  projectId: string;
  data?: any;
  createdAt: string;
}

export const leadsApi = {
  getAll: async () => {
    const res = await apiFetch('/leads');
    return res.data;
  },
  getByPage: async (pageId: string) => {
    const res = await apiFetch(`/leads?pageId=${pageId}`);
    return res.data;
  },
  delete: async (id: string) => {
    return apiFetch(`/leads/${id}`, {
      method: 'DELETE',
    });
  },
};
