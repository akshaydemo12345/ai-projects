const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  plan: string;
  credits: number;
  avatar?: string;
}

export interface AuthResponse {
  status: string;
  accessToken?: string;
  token?: string; // fallback
  data?: {
    user: User;
    stats?: {
      totalPages: number;
      publishedPages: number;
      draftPages: number;
      totalLeads: number;
      totalViews: number;
      conversionRate: number | string;
    };
    recentPages?: any[];
    token?: string; // for compatibility
  };
  message?: string;
}

export const authService = {
  async signup(data: any): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async login(data: any): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async getProfile(): Promise<AuthResponse> {
    const token = this.getToken();
    const response = await fetch(`${API_URL}/user/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  },

  async getDashboard(): Promise<AuthResponse> {
    const token = this.getToken();
    const response = await fetch(`${API_URL}/user/dashboard`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  },

  logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
  },

  setToken(token: string) {
    localStorage.setItem("accessToken", token);
  },

  setUser(user: User) {
    localStorage.setItem("user", JSON.stringify(user));
  },

  getToken() {
    return localStorage.getItem("accessToken");
  },

  getUser(): User | null {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated() {
    return !!this.getToken();
  },
};
