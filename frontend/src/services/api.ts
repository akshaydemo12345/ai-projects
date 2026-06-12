// PageCraft API Service — Scalable modular API layer
// Connects to Node.js/MongoDB backend

import config from '../config';

const API_BASE_URL = config.api.baseUrl;

// Types
export interface PageSection {
  id: string;
  type: "hero" | "features" | "pricing" | "faq" | "contact" | "footer" | "header" | "testimonials" | "gallery" | "form" | "stats" | "team" | "cta" | "image" | "text" | "grid";
  title?: string;
  content: Record<string, unknown>;
}

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
  websiteUrl?: string;
  category: string;
  industry?: string;
  subIndustry?: string;
  scrapedData?: Record<string, any>;
  apiToken: string;
  userId: string;
  isDeleted: boolean;
  isVerified?: boolean;
  createdAt: string;
  updatedAt: string;
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  preSlug?: string;
  pages?: LandingPage[];
  websiteProfile?: {
    identity?: { favicon?: string; logoUrl?: string; logoFormat?: string; logoSource?: string; };
    industry?: { industry?: string; subIndustry?: string; confidence?: number; };
    logoColors?: { primary?: string; secondary?: string; palette?: string[]; source?: string; };
    colors?: { primary?: string; secondary?: string; accent?: string; palette?: string[]; pagePrimary?: string; pageSecondary?: string; };
    fonts?: { primaryFont?: string; headingFont?: string; bodyFont?: string; googleFonts?: string[]; };
    content?: {
      hero?: { title?: string; subtitle?: string; ctaText?: string; };
      taglines?: string[];
      services?: { title?: string; description?: string; icon?: string; }[];
      features?: { title?: string; description?: string; icon?: string; }[];
      testimonials?: { name?: string; company?: string; text?: string; rating?: number; }[];
      ctas?: { title?: string; description?: string; buttonText?: string; }[];
    };
    seo?: { title?: string; description?: string; keywords?: string[]; };
    extraction?: { sourceUrl?: string; finalUrl?: string; scrapedAt?: string; };
  };
  stats?: {
    views: number;
    leads: number;
    conversion: number;
  };
}

export interface Branding {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textLight: string;
    border: string;
  };
  buttons: {
    primary: {
      backgroundColor: string;
      textColor: string;
      borderRadius: string;
      padding: string;
      fontSize: string;
      fontWeight: string;
      borderColor: string;
    };
    secondary: {
      backgroundColor: string;
      textColor: string;
      borderRadius: string;
      padding: string;
      fontSize: string;
      fontWeight: string;
      borderColor: string;
    };
  };
  navigation: {
    backgroundColor: string;
    textColor: string;
    linkColor: string;
    activeLinkColor: string;
    hoverBackgroundColor: string;
    bordercolor: string;
    height: string;
    fontSize: string;
    padding: string;
    logoMaxHeight: string;
  };
  footer: {
    backgroundColor: string;
    textColor: string;
    linkColor: string;
    borderTopColor: string;
    padding: string;
    fontSize: string;
  };
  brandingSourceUrl?: string;
  lastScrapedAt?: string;
  scrapedBrandingData?: Record<string, any>;
  extractedColors?: string[];
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
  // Dual-page support
  landingPageContent?: any;
  landingPageStyles?: string;
  thankYouPageContent?: any;
  thankYouPageStyles?: string;

  metaTitle?: string;
  metaDescription?: string;
  publishedUrl?: string; // Virtual/Frontend helper
  liveUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  logoUrl?: string;
  mainHeader?: string;
  mainFooter?: string;
  thankYouHeader?: string;
  thankYouFooter?: string;
  thankYouConversionScript?: string;
  thankYouUrl?: string;
  noIndex?: boolean;
  noFollow?: boolean;
  noIndexNoFollow?: boolean;
  generationMethod?: "ai" | "analyze" | "manual" | "template";
  industry?: string;
  subIndustry?: string;
  aiPrompt?: string;
  apiToken?: string;
  previewToken?: string;
  template?: string;
  templateId?: string;
  figmaImage?: string;
  views: number;
  aiUsage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    cost: number;
    imageCount?: number;
    imageCost?: number;
    model: string;
    currency: string;
    lastUsageAt?: string;
  };
  aiUsageHistory?: Array<{
    action: string;
    model: string;
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    cost: number;
    imageCount?: number;
    imageCost?: number;
    createdAt: string;
  }>;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Maps technical/backend errors to clear, concise, user-friendly messages for non-technical users.
export function getFriendlyErrorMessage(message: string, status?: number, errors?: any[]): string {
  const msg = (message || '').toLowerCase();

  // 1. If there are field/validation errors (like from Zod), prioritize the first one
  if (Array.isArray(errors) && errors.length > 0) {
    const firstErr = errors[0];
    const field = (firstErr.field || '').toLowerCase();
    const fieldMsg = (firstErr.message || '').toLowerCase();

    if (field === 'email' || fieldMsg.includes('email')) {
      return 'Please enter a valid email address.';
    }
    if (field === 'password' || fieldMsg.includes('password')) {
      return 'Password must be at least 8 characters long.';
    }
    if (field === 'name' || fieldMsg.includes('name')) {
      return 'Please enter your full name.';
    }
    if (fieldMsg.includes('already exists') || fieldMsg.includes('duplicate')) {
      return 'This web address is already in use. Please try a different one.';
    }
    return firstErr.message || 'Please check the highlighted fields.';
  }

  // 2. Handle HTTP status codes
  if (status === 401) {
    if (msg.includes('verify') || msg.includes('verification')) {
      return 'Please verify your email address to continue.';
    }
    return 'Incorrect email or password. Please try again.';
  }
  if (status === 403) {
    return 'You do not have permission to perform this action.';
  }
  if (status === 404) {
    return 'The requested page or project could not be found.';
  }
  if (status && status >= 500) {
    return 'Unable to connect to the server. Please check your connection and try again.';
  }

  // 3. String content checking
  if (msg.includes('failed to fetch') || msg.includes('networkerror') || msg.includes('network error') || msg.includes('load failed')) {
    return 'Unable to connect to the server. Please check your internet connection and try again.';
  }
  if (msg.includes('duplicate key') || msg.includes('already exists') || msg.includes('e11000') || msg.includes('unique constraint')) {
    return 'This web address is already in use. Please try a different one.';
  }
  if (msg.includes('invalid email') || msg.includes('email must be') || msg.includes('enter a valid email')) {
    return 'Please enter a valid email address.';
  }
  if (msg.includes('password') && (msg.includes('short') || msg.includes('characters') || msg.includes('length') || msg.includes('least 8'))) {
    return 'Password must be at least 8 characters long.';
  }
  if (msg.includes('incorrect password') || msg.includes('invalid credentials') || msg.includes('user not found') || msg.includes('wrong password') || msg.includes('invalid password')) {
    return 'Incorrect email or password. Please try again.';
  }
  if (msg.includes('session expired') || msg.includes('please log in again') || msg.includes('token expired') || msg.includes('unauthorized') || msg.includes('jwt')) {
    return 'Your session has expired. Please log in again.';
  }
  if (msg.includes('verify your email') || msg.includes('email address not verified') || msg.includes('not verified')) {
    return 'Please verify your email address to continue.';
  }
  if (msg.includes('limit') || msg.includes('quota') || msg.includes('exceeded') || msg.includes('upgrade') || msg.includes('payment')) {
    return 'You have reached your account limit. Please upgrade your plan to continue.';
  }
  if (msg.includes('ai') || msg.includes('generation') || msg.includes('openai') || msg.includes('gemini') || msg.includes('failed to generate') || msg.includes('content') || msg.includes('missing html')) {
    return 'AI generation failed. Please try a simpler prompt or try again later.';
  }

  return message || 'An unexpected error occurred. Please try again.';
}

// Helper for refreshing the access token using the refresh token cookie.
async function refreshAuthToken() {
  const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || 'Unable to refresh session');
  }

  if (!result.accessToken) {
    throw new Error('Refresh response did not include a new access token');
  }

  localStorage.setItem('pagecraft_token', result.accessToken);
  return result.accessToken;
}


// Helper for fetch with Auth
async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('pagecraft_token');
  const fullUrl = `${API_BASE_URL}${endpoint}`;
  const hasRetried = Boolean((options as any)._retry);

  console.log(`🌐 API Request: ${fullUrl}`, { hasToken: !!token, method: options.method });

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  // Create abort controller for timeout
  const controller = new AbortController();
  const timeout = 300000; // 5 minutes timeout for AI generation
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  const { _retry, ...fetchOptions } = options as any;

  const response = await fetch(fullUrl, {
    ...fetchOptions, headers,
    credentials: 'include',
    signal: controller.signal,
  });

  clearTimeout(timeoutId);

  const isPublicAuthRequest = endpoint.includes('/auth/login') ||
    endpoint.includes('/auth/signup') ||
    endpoint.includes('/auth/firebase') ||
    endpoint.includes('/auth/forgot-password') ||
    endpoint.includes('/auth/reset-password') ||
    endpoint.includes('/auth/resend-verification-email');

  if (response.status === 401 && !hasRetried && !isPublicAuthRequest) {
    try {
      const newToken = await refreshAuthToken();
      const retryOptions = {
        ...options,
        _retry: true,
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${newToken}`,
        },
      } as RequestInit;
      return apiFetch(endpoint, retryOptions);
    } catch (err) {
      console.warn('Session refresh failed:', err);
    }
  }

  if (response.status === 401 && !isPublicAuthRequest) {
    // Unauthorized - clear token and potentially redirect
    localStorage.removeItem('pagecraft_token');
    localStorage.removeItem('pagecraft_user');
    window.location.href = '/login';
    throw new Error('Session expired. Please log in again.');
  }

  let result: any;
  try {
    result = await response.json();
  } catch (parseError) {
    result = null;
  }

  if (!response.ok) {
    const rawErrorMessage =
      result?.message ||
      (Array.isArray(result?.errors) ? result.errors.map((e: any) => e.message).join(', ') : response.statusText || 'Something went wrong');
    const errorMessage = getFriendlyErrorMessage(rawErrorMessage, response.status, result?.errors);
    const error = new Error(errorMessage);
    (error as any).status = response.status;
    (error as any).errors = result?.errors;
    throw error;
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
  firebaseSignIn: async (data: any) => {
    return apiFetch('/auth/firebase', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  logout: async () => {
    return apiFetch('/auth/logout', {
      method: 'POST',
    });
  },
  resendVerificationEmail: async (data: any) => {
    return apiFetch('/auth/resend-verification-email', {
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
  getPagesSummary: async (id: string) => {
    const res = await apiFetch(`/projects/${id}/pages/summary`);
    return res.data.pages as LandingPage[];
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
  getBranding: async (id: string) => {
    const res = await apiFetch(`/projects/${id}/branding`);
    return res.data.branding;
  },
  updateBranding: async (id: string, data: any) => {
    return apiFetch(`/projects/${id}/branding`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  extractBrandingFromWebsite: async (id: string, data: any) => {
    return apiFetch(`/projects/${id}/branding/extract-from-website`, {
      method: 'POST',
      body: JSON.stringify(data),
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
  // ── Lean settings endpoints — only the ~14 UI fields, no HTML/CSS blobs ──
  getSettings: async (projectId: string, pageId: string) => {
    const res = await apiFetch(`/projects/${projectId}/pages/${pageId}/settings`);
    if (!res.data || !res.data.page) return null;
    return res.data.page;
  },
  updateSettings: async (projectId: string, pageId: string, data: Partial<LandingPage>) => {
    const normalizeScript = (value = '') => {
      const trimmed = value.trim();
      if (!trimmed) return '';
      const hasScriptTag = /<script[\s\S]*?>[\s\S]*?<\/script>/i.test(trimmed);
      return hasScriptTag ? trimmed : `<script>${trimmed}</script>`;
    };
    const payload = {
      title: data.name || data.title,
      slug: data.slug,
      metaTitle: data.metaTitle,
      metaDescription: data.metaDescription,
      primaryColor: data.primaryColor,
      secondaryColor: data.secondaryColor,
      logoUrl: data.logoUrl,
      mainHeader: data.mainHeader !== undefined ? normalizeScript(data.mainHeader) : undefined,
      mainFooter: data.mainFooter !== undefined ? normalizeScript(data.mainFooter) : undefined,
      thankYouHeader: data.thankYouHeader !== undefined ? normalizeScript(data.thankYouHeader) : undefined,
      thankYouFooter: data.thankYouFooter !== undefined ? normalizeScript(data.thankYouFooter) : undefined,
      thankYouUrl: data.thankYouUrl,
      noIndex: data.noIndex,
      noFollow: data.noFollow,
    };
    // Strip undefined keys so we don't overwrite fields we didn't intend to touch
    const clean = Object.fromEntries(Object.entries(payload).filter(([, v]) => v !== undefined));
    const res = await apiFetch(`/projects/${projectId}/pages/${pageId}/settings`, {
      method: 'PATCH',
      body: JSON.stringify(clean),
    });
    return res.data?.page ?? null;
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
    // Normalization helper
    const normalizeScript = (value = '') => {
      const trimmed = value.trim();
      if (!trimmed) return '';
      const hasScriptTag = /<script[\s\S]*?>[\s\S]*?<\/script>/i.test(trimmed);
      if (hasScriptTag) return trimmed;
      return `<script>${trimmed}</script>`;
    };

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
      // Normalize scripts
      mainHeader: normalizeScript(data.mainHeader),
      mainFooter: normalizeScript(data.mainFooter),
      thankYouHeader: normalizeScript(data.thankYouHeader),
      thankYouFooter: normalizeScript(data.thankYouFooter),
      thankYouConversionScript: normalizeScript(data.thankYouConversionScript),
      ...(data.noIndexNoFollow !== undefined ? { noIndex: data.noIndexNoFollow, noFollow: data.noIndexNoFollow } : {}),
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
  verifySlug: async (projectId: string, data: any) => {
    const payload = {
      ...data,
      title: data.name || data.title || 'Untitled Page',
      name: data.name || data.title || 'Untitled Page',
    };
    const res = await apiFetch(`/projects/${projectId}/pages/verify`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return res.data;
  },
  update: async (projectId: string, pageId: string, data: any) => {
    // Normalization helper
    const normalizeScript = (value = '') => {
      const trimmed = value.trim();
      if (!trimmed) return '';
      const hasScriptTag = /<script[\s\S]*?>[\s\S]*?<\/script>/i.test(trimmed);
      if (hasScriptTag) return trimmed;
      return `<script>${trimmed}</script>`;
    };

    const payload = {
      ...data,
      ...(data.name ? { title: data.name } : {}),
      // Normalize scripts if provided
      ...(data.mainHeader !== undefined ? { mainHeader: normalizeScript(data.mainHeader) } : {}),
      ...(data.mainFooter !== undefined ? { mainFooter: normalizeScript(data.mainFooter) } : {}),
      ...(data.thankYouHeader !== undefined ? { thankYouHeader: normalizeScript(data.thankYouHeader) } : {}),
      ...(data.thankYouFooter !== undefined ? { thankYouFooter: normalizeScript(data.thankYouFooter) } : {}),
      ...(data.thankYouConversionScript !== undefined ? { thankYouConversionScript: normalizeScript(data.thankYouConversionScript) } : {}),
      ...(data.noIndexNoFollow !== undefined ? { noIndex: data.noIndexNoFollow, noFollow: data.noIndexNoFollow } : {}),
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
  getByPageId: async (pageId: string, token?: string) => {
    const params = new URLSearchParams({ page: pageId });
    if (token) params.set('token', token);
    const response = await fetch(`${API_BASE_URL}/api/public/page?${params.toString()}`);
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Page not found');
    return result;
  },
  getBySlug: async (slug: string, token?: string) => {
    // 100% Public endpoint — serves content WITHOUT requiring tokens for published pages.
    // However, for previews/drafts, we pass the previewToken.
    // Add timestamp to bust browser cache
    const cacheBuster = `cb=${Date.now()}`;
    const url = token
      ? `${API_BASE_URL}/api/public/page/${slug}?token=${token}&${cacheBuster}`
      : `${API_BASE_URL}/api/public/page/${slug}?${cacheBuster}`;

    const response = await fetch(url);
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
  editorChat: async (data: { elementTag: string; elementHtml: string; elementCss: string; instruction: string }) => {
    return apiFetch('/ai/editor-chat', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  generateDescription: async (data: { pageName: string; industry: string; projectDesc?: string; currentPrompt?: string }) => {
    return apiFetch('/ai/generate-description', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  projectSuggestions: async (projectId: string) => {
    // Simulation logic to fulfill "Dynamic Suggestions" without backend logic
    // In a real app, this would call /api/pages/project-suggestions
    try {
      // First try to call the real API (if it exists)
      return await apiFetch(`/ai/project-suggestions`, {
        method: 'POST',
        body: JSON.stringify({ projectId }),
      });
    } catch (err) {
      // If backend fails (per dummy UI simulation rule), generate heuristically
      const project = await projectsApi.getById(projectId);
      const industry = project.category || "Service";
      const name = project.name;

      const suggestions = [
        `Premium ${industry} consultation page for ${name}`,
        `${name} - Expert ${industry} solutions landing page`,
        `Book a free ${industry} consultation with ${name}`,
        `${name} ${industry} services lead generation page`,
        `Luxury ${name} ${industry} showcase and inquiry page`,
        `Contact ${name} for professional ${industry} help`
      ];

      return { status: 'success', data: { suggestions } };
    }
  },
  proxyImage: (imageUrl: string) => {
    // Returns the proxy URL for an image
    const encoded = encodeURIComponent(imageUrl);
    return `${API_BASE_URL}/ai/proxy-image?url=${encoded}`;
  },
  getImgBalance: async () => {
    return apiFetch('/ai/getimg-balance', {
      method: 'GET',
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
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  gclid?: string;
  fbclid?: string;
  msclkid?: string;
  data?: Record<string, any>;
  meta?: {
    ip?: string;
    userAgent?: string;
    domain?: string;
    url?: string;
    referer?: string;
  };
  referer?: string;
  url?: string;
  trackingDetails?: {
    ip: any;
    referral_url?: string;
    referral_source?: string;
  };
  formData?: Array<{ name: string; label: string; value: any; type?: string }>;
  createdAt: string;
}

export const leadsApi = {
  getAll: async (params: {
    projectId?: string;
    pageId?: string;
    pageSlug?: string;
    search?: string;
    startDate?: string;
    endDate?: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
  } = {}) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) queryParams.append(key, String(value));
    });

    const queryString = queryParams.toString();
    const endpoint = `/api/leads${queryString ? `?${queryString}` : ''}`;

    const res = await apiFetch(endpoint);
    // Backend returns { status, results, data: { leads: [], formSchema: {} } }
    return {
      leads: res.data.leads as Lead[],
      total: res.total ?? res.data?.total ?? res.results ?? 0,
      todayCount: res.data?.todayCount ?? 0,
      formSchema: res.data.formSchema
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

  export: async (params: {
    projectId?: string;
    pageId?: string;
    search?: string;
    startDate?: string;
    endDate?: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
  } = {}) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) queryParams.append(key, String(value));
    });

    const token = localStorage.getItem('pagecraft_token');
    const url = `${API_BASE_URL}/api/leads/export?${queryParams.toString()}`;

    const response = await fetch(url, {
      headers: {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      }
    });

    if (!response.ok) throw new Error('Export failed');
    return response.blob();
  },

  getFilters: async (projectId?: string) => {
    const endpoint = `/api/leads/get-filters${projectId ? `?projectId=${projectId}` : ''}`;
    const res = await apiFetch(endpoint);
    return res.data as { utmSources: string[]; utmMediums: string[]; utmCampaigns: string[] };
  }
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

  preview: async (previewConfig: { layout: string; content?: any; branding?: any; pageId?: string }): Promise<string> => {
    const token = localStorage.getItem('pagecraft_token');

    // Use consistent API base URL
    const baseUrl = API_BASE_URL || (import.meta.env.MODE === 'development' ? 'http://localhost:5000' : '');
    const fullUrl = `${baseUrl.replace(/\/+$/, '')}/api/thank-you/preview`;

    console.log('📡 Fetching Thank You preview from:', fullUrl);

    const res = await fetch(fullUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify(previewConfig),
    });

    if (!res.ok) {
      throw new Error('Failed to generate preview');
    }

    let html = await res.text();

    // 🎨 DUMMY UI SIMULATION: Frontend-only template rendering
    // Fallback to process mustache tags on the frontend if the backend fails to process them
    const { content = {}, branding = {} } = previewConfig;
    const businessName = 'Preview Business';

    const escapeHtml = (text: string) => {
      if (!text) return '';
      return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
    };

    html = html.replace(/\{\{#phoneNumber\}\}([\s\S]*?)\{\{\/phoneNumber\}\}/g, content.phoneNumber ? '$1' : '');
    html = html.replace(/\{\{\^phoneNumber\}\}([\s\S]*?)\{\{\/phoneNumber\}\}/g, !content.phoneNumber ? '$1' : '');
    html = html.replace(/\{\{#logoUrl\}\}([\s\S]*?)\{\{\/logoUrl\}\}/g, branding.logoUrl ? '$1' : '');
    html = html.replace(/\{\{\^logoUrl\}\}([\s\S]*?)\{\{\/logoUrl\}\}/g, !branding.logoUrl ? '$1' : '');
    html = html.replace(/\{\{#offerText\}\}([\s\S]*?)\{\{\/offerText\}\}/g, content.offerText ? '$1' : '');
    html = html.replace(/\{\{\^offerText\}\}([\s\S]*?)\{\{\/offerText\}\}/g, !content.offerText ? '$1' : '');

    html = html.replace(/\{\{#email\}\}([\s\S]*?)\{\{\/email\}\}/g, content.email ? '$1' : '');
    html = html.replace(/\{\{\^email\}\}([\s\S]*?)\{\{\/email\}\}/g, !content.email ? '$1' : '');

    html = html
      .replace(/\{\{heading\}\}/g, escapeHtml(content.heading || ''))
      .replace(/\{\{subheading\}\}/g, escapeHtml(content.subheading || ''))
      .replace(/\{\{ctaText\}\}/g, escapeHtml(content.ctaText || ''))
      .replace(/\{\{ctaUrl\}\}/g, content.ctaUrl || '#')
      .replace(/\{\{offerText\}\}/g, escapeHtml(content.offerText || ''))
      .replace(/\{\{email\}\}/g, escapeHtml(content.email || ''))
      .replace(/\{\{phoneNumber\}\}/g, escapeHtml(content.phoneNumber || ''))
      .replace(/\{\{customMessage\}\}/g, escapeHtml(content.customMessage || ''))
      .replace(/\{\{primaryColor\}\}/g, escapeHtml(branding.primaryColor || '#7c3aed'))
      .replace(/\{\{secondaryColor\}\}/g, escapeHtml(branding.secondaryColor || '#a855f7'))
      .replace(/PRIMARY_COLOR_PLACEHOLDER/g, escapeHtml(branding.primaryColor || '#7c3aed'))
      .replace(/SECONDARY_COLOR_PLACEHOLDER/g, escapeHtml(branding.secondaryColor || '#a855f7'))
      .replace(/\{\{logoUrl\}\}/g, escapeHtml(branding.logoUrl || ''))
      .replace(/\{\{businessName\}\}/g, escapeHtml(businessName));

    return html;
  },
};

// --- User API ---
export const userApi = {
  updateProfile: async (data: { name?: string; avatar?: string }) => {
    return apiFetch('/user/update-profile', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
  changePassword: async (data: any) => {
    return apiFetch('/user/change-password', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
  deleteAccount: async (data: { password?: string }) => {
    return apiFetch('/user/account', {
      method: 'DELETE',
      body: JSON.stringify(data),
    });
  },
};