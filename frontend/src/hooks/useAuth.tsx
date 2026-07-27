import React, { createContext, useContext, useState, useEffect } from "react";
import { authApi } from "@/services/api";
import { signOutUser } from "@/services/firebaseClient";
import { queryClient } from "@/lib/queryClient";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  _id?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, userData: any) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("pagecraft_token"));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem("pagecraft_token");
      const storedUser = localStorage.getItem("pagecraft_user");

      if (storedToken && storedUser) {
        if (storedUser === "undefined") {
          localStorage.removeItem("pagecraft_user");
          localStorage.removeItem("pagecraft_token");
          localStorage.removeItem("token");
          localStorage.removeItem("access_token");
          queryClient.clear();
          setIsLoading(false);
          return;
        }

        let parsedUser: any = null;
        try {
          parsedUser = JSON.parse(storedUser);
        } catch (e) {
          console.error("Failed to parse stored user", e);
          localStorage.removeItem("pagecraft_user");
          localStorage.removeItem("pagecraft_token");
          localStorage.removeItem("token");
          localStorage.removeItem("access_token");
          queryClient.clear();
          setIsLoading(false);
          return;
        }

        // Show the cached session immediately (no flash of "logged out"),
        // then confirm with the server in the background that the token is
        // still valid and the account still exists.
        setToken(storedToken);
        setUser(parsedUser);

        try {
          const res = await authApi.getProfile();
          const freshUser = res?.data?.user || res?.user;
          if (freshUser) {
            // If the logged-in user changed, purge old query cache
            const oldId = parsedUser?._id || parsedUser?.id;
            const newId = freshUser?._id || freshUser?.id;
            if (oldId && newId && oldId !== newId) {
              queryClient.clear();
            }
            setUser(freshUser);
            localStorage.setItem("pagecraft_user", JSON.stringify(freshUser));
          }
        } catch (err) {
          console.warn("Session validation failed, logging out:", err);
          setToken(null);
          setUser(null);
          localStorage.removeItem("pagecraft_token");
          localStorage.removeItem("pagecraft_user");
          localStorage.removeItem("token");
          localStorage.removeItem("access_token");
          queryClient.clear();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = (newToken: string, userData: any) => {
    // 1. Immediately invalidate and clear all in-memory React Query caches from previous user
    queryClient.clear();

    // 2. Remove legacy token keys to avoid cross-user state leaks
    localStorage.removeItem("token");
    localStorage.removeItem("access_token");

    // 3. Set fresh user state & storage
    setToken(newToken);
    setUser(userData);
    localStorage.setItem("pagecraft_token", newToken);
    localStorage.setItem("pagecraft_user", JSON.stringify(userData));
  };

  const logout = async () => {
    // 1. Clear query cache
    queryClient.clear();

    try {
      await authApi.logout();
    } catch (error) {
      console.warn('Logout request failed:', error);
    }

    try {
      await signOutUser();
    } catch (error) {
      console.warn('Firebase sign-out failed:', error);
    }
    setToken(null);
    setUser(null);
    localStorage.removeItem("pagecraft_token");
    localStorage.removeItem("pagecraft_user");
    localStorage.removeItem("token");
    localStorage.removeItem("access_token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};