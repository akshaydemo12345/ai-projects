import { authService } from "./authService";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface PageResponse {
  status: string;
  data?: {
    page: any;
  };
  message?: string;
}

export const pageService = {
  async create(data: { title: string; slug?: string; template?: string; content?: any }): Promise<PageResponse> {
    const token = authService.getToken();
    const response = await fetch(`${API_URL}/pages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async getById(id: string): Promise<PageResponse> {
    const token = authService.getToken();
    const response = await fetch(`${API_URL}/pages/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  },

  async update(id: string, data: any): Promise<PageResponse> {
    const token = authService.getToken();
    const response = await fetch(`${API_URL}/pages/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async delete(id: string): Promise<PageResponse> {
    const token = authService.getToken();
    const response = await fetch(`${API_URL}/pages/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  },

  async publish(id: string, domainData?: { domain?: string; subdomain?: string }): Promise<PageResponse> {
    const token = authService.getToken();
    const response = await fetch(`${API_URL}/pages/${id}/publish`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(domainData || {}),
    });
    return response.json();
  },

  async generateAIContent(data: {
    businessName: string;
    industry: string;
    pageType: string;
    targetAudience: string;
    businessDescription: string;
    ctaText: string;
    figmaUrl?: string; // New field
    aiPrompt?: string;
    pageId?: string;
  }): Promise<any> {
    const token = authService.getToken();
    const response = await fetch(`${API_URL}/ai/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async analyzeWebsite(websiteUrl: string, pageId?: string): Promise<any> {
    const token = authService.getToken();
    const response = await fetch(`${API_URL}/ai/analyze-website`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ websiteUrl, pageId }),
    });
    return response.json();
  },

  async improveContent(data: {
    pageId?: string;
    sectionType: string;
    currentContent: any;
    aiPrompt?: string;
  }): Promise<any> {
    const token = authService.getToken();
    const response = await fetch(`${API_URL}/ai/improve`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },
};
