// PageCraft API Service — Scalable modular API layer
// Connects to Node.js/MongoDB backend

import config from '../config';

const API_BASE_URL = config.api.baseUrl;

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
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
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
  mainHeader?: string;
  mainFooter?: string;
  thankYouHeader?: string;
  thankYouFooter?: string;
  thankYouUrl?: string;
  generationMethod?: "ai" | "analyze" | "manual" | "template";
  aiPrompt?: string;
  apiToken?: string;
  previewToken?: string;
  template?: string;
  templateId?: string;
  figmaImage?: string;
  views: number;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}



// Helper for fetch with Auth
async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('pagecraft_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  // Create abort controller for timeout
  const controller = new AbortController();
  const timeout = 300000; // 5 minutes timeout for AI generation
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    signal: controller.signal,
  });

  clearTimeout(timeoutId);

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
    if (!res.data || !res.data.pages) return [];
    return res.data.pages.map((p: any) => ({
      ...p,
      name: p.title || p.name || 'Untitled Page'
    }));
  },
  getById: async (projectId: string, pageId: string) => {
    const res = await apiFetch(`/projects/${projectId}/pages/${pageId}`);
    if (!res.data || !res.data.page) return null;
    return {
      ...res.data.page,
      name: res.data.page.title || res.data.page.name || 'Untitled Page'
    };
  },
  create: async (projectId: string, data: any) => {
    // Map frontend fields to backend schema fields
    const payload = {
      ...data,
      // Backend schema uses 'title', frontend uses 'name' — send both
      title: data.name || data.title || 'Untitled Page',
      name: data.name || data.title || 'Untitled Page',
      // Map AI prompt fields
      aiPrompt: data.aiPrompt || data.ai_prompt || '',
      ai_prompt: data.aiPrompt || data.ai_prompt || '',
      // Map branding
      primaryColor: data.primaryColor,
      secondaryColor: data.secondaryColor,
      logoUrl: data.logoUrl,
    };
    const res = await apiFetch(`/projects/${projectId}/pages`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    // Ensure the returned object has 'name' mapped from 'title'
    if (res.data && res.data.title) {
      res.data.name = res.data.title;
    }
    return res.data;
  },
  update: async (projectId: string, pageId: string, data: any) => {
    const payload = {
      ...data,
      ...(data.name ? { title: data.name } : {}),
    };
    const res = await apiFetch(`/projects/${projectId}/pages/${pageId}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
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
      body: JSON.stringify({ websiteUrl: url }),
    });
  },
  inspect: async (url: string) => {
    return apiFetch('/ai/inspect-website', {
      method: 'POST',
      body: JSON.stringify({ url }),
    });
  },
  extractProject: async (url: string) => {
    return apiFetch('/ai/extract-project', {
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
  generateDescription: async (data: { pageName: string; industry: string; projectDesc?: string }) => {
    return apiFetch('/ai/generate-description', {
      method: 'POST',
      body: JSON.stringify(data),
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
  phone?: string;
  message?: string;
  pageId?: string;
  pageSlug?: string;
  projectId?: string;
  ip?: string;
  userAgent?: string;
  createdAt: string;
}

export const leadsApi = {
  getAll: async (params: {
    projectId?: string;
    pageId?: string;
    pageSlug?: string;
    search?: string;
    page?: number;
    limit?: number;
  } = {}) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) queryParams.append(key, String(value));
    });

    const queryString = queryParams.toString();
    const endpoint = `/api/leads${queryString ? `?${queryString}` : ''}`;

    const res = await apiFetch(endpoint);
    // Backend returns { status, results, data: { leads: [] } }
    return {
      leads: res.data.leads as Lead[],
      total: res.results || 0
    };
  },

  create: async (data: Partial<Lead>) => {
    return apiFetch('/api/leads', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string) => {
    return apiFetch(`/api/leads/${id}`, {
      method: 'DELETE',
    });
  },
};

// --- Thank You API ---

export interface ThankYouLayout {
  id: string;
  name: string;
  description: string;
  preview: string;
  industry: string;
  defaultContent: {
    heading: string;
    subheading: string;
    ctaText: string;
    ctaUrl: string;
    phoneNumber?: string;
    offerText?: string;
    customMessage?: string;
  };
  theme: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
  };
  features: string[];
}

export interface ThankYouConfig {
  layout: string;
  content: {
    heading?: string;
    subheading?: string;
    ctaText?: string;
    ctaUrl?: string;
    phoneNumber?: string;
    offerText?: string;
    customMessage?: string;
  };
  tracking: {
    ga4MeasurementId?: string;
    ga4EventName?: string;
    googleAdsConversionId?: string;
    googleAdsLabel?: string;
    metaPixelId?: string;
    metaEventName?: string;
    customTracking?: string[];
  };
  branding: {
    logoUrl?: string;
    primaryColor?: string;
    secondaryColor?: string;
  };
  customTemplate?: string;
  customCss?: string;
}

export const thankYouApi = {
  getLayouts: async (): Promise<ThankYouLayout[]> => {
    const res = await apiFetch('/api/thank-you/layouts');
    return res.data.layouts;
  },

  getConfig: async (pageId: string): Promise<{ config: ThankYouConfig; pageId: string; industry?: string }> => {
    const res = await apiFetch(`/api/thank-you/config/${pageId}`);
    return res.data;
  },

  updateConfig: async (pageId: string, config: Partial<ThankYouConfig>): Promise<ThankYouConfig> => {
    const res = await apiFetch(`/api/thank-you/config/${pageId}`, {
      method: 'PUT',
      body: JSON.stringify(config),
    });
    return res.data.config;
  },

  preview: async (config: { layout: string; content?: any; branding?: any }): Promise<string> => {
    const res = await apiFetch('/api/thank-you/preview', {
      method: 'POST',
      body: JSON.stringify(config),
    });
    return res; // Returns HTML directly
  },
};
