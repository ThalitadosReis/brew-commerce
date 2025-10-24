"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export interface AdminUser {
  id: string;
  email: string;
  name?: string;
  role: "admin";
  profilePicture?: string;
}

interface AuthContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<AdminUser>) => void;
  updateName: (name: string) => void;
  updateProfilePicture: (base64: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  children,
  verifyOnMount = false,
}: {
  children: React.ReactNode;
  verifyOnMount?: boolean;
}) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(verifyOnMount);
  const router = useRouter();

  // Verify auth
  useEffect(() => {
    if (!verifyOnMount) return;

    const verifyAuth = async () => {
      try {
        const response = await fetch("/api/admin/verify", {
          method: "GET",
          credentials: "include",
        });

        if (response.status === 401 || response.status === 403) {
          // not authenticated or not admin
          setUser(null);
          router.push("/admin-login");
          return;
        }

        const data = await response.json();
        if (data.user && data.user.role === "admin") {
          setUser(data.user);
        }
      } catch (err) {
        console.error("Auth verification error:", err);
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, [router, verifyOnMount]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Login failed");
      }

      const data = await response.json();
      if (data.user && data.user.role === "admin") {
        setUser(data.user);
        if (data.token) setToken(data.token);
        router.push("/admin");
        return;
      } else {
        throw new Error("Access denied: Admin role required");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/admin/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      setLoading(false);
      router.push("/admin-login");
    }
  };

  const updateUser = (updates: Partial<AdminUser>) => {
    if (user) setUser({ ...user, ...updates });
  };

  const updateName = (name: string) => updateUser({ name });
  const updateProfilePicture = (base64: string) =>
    updateUser({ profilePicture: base64 });

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    loading,
    token,
    login,
    logout,
    updateUser,
    updateName,
    updateProfilePicture,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
