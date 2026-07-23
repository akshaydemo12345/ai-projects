import React, { createContext, useContext, useState, useEffect } from "react";
import { authApi } from "@/services/api";
import { signOutUser } from "@/services/firebaseClient";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
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
            setUser(freshUser);
            localStorage.setItem("pagecraft_user", JSON.stringify(freshUser));
          }
        } catch (err) {
          // 401 here means the token is invalid or the user no longer
          // exists (e.g. deleted from the DB) — apiFetch already strips
          // the stored token in that case, so just clear local state too.
          console.warn("Session validation failed, logging out:", err);
          setToken(null);
          setUser(null);
          localStorage.removeItem("pagecraft_token");
          localStorage.removeItem("pagecraft_user");
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = (newToken: string, userData: any) => {
    setToken(newToken);
    setUser(userData);
    localStorage.setItem("pagecraft_token", newToken);
    localStorage.setItem("pagecraft_user", JSON.stringify(userData));
  };

  const logout = async () => {
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