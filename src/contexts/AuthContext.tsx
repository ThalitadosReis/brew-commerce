"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export interface AdminUser {
  id: string;
  email: string;
  name?: string; // Optional for admins
  role: "admin"; // Fixed to admin
  profilePicture?: string;
}

interface AuthContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  token: string | null; // add this
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<AdminUser>) => void;
  updateName: (name: string) => void;
  updateProfilePicture: (base64: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  // Verify auth on mount (checks cookie via API, no localStorage)
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const response = await fetch("/api/admin/verify", {
          method: "GET",
          credentials: "include", // Include httpOnly cookie
        });

        if (response.ok) {
          const data = await response.json();
          if (data.user && data.user.role === "admin") {
            setUser(data.user);
          }
        }
      } catch (error) {
        console.error("Auth verification error:", error);
        // Silently fail; middleware will handle redirects
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include", // For cookie
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Login failed");
      }

      const data = await response.json();
      console.log("Login response data:", data);
      if (data.user && data.user.role === "admin") {
        console.log("Setting user and redirecting to /admin");
        setUser(data.user);
        if (data.token) setToken(data.token);
        setLoading(false);
        // Force a full page reload to /admin
        window.location.replace("/admin");
        return;
      } else {
        throw new Error("Access denied: Admin role required");
      }
    } catch (error: unknown) {
      console.error("Login error:", error);
      throw error; // Re-throw for form handling
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
    }
    setUser(null);
    setLoading(false);
    router.push("/admin-login");
  };

  // Updates (no localStorage; persist via API if needed)
  const updateUser = (updates: Partial<AdminUser>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      // Optional: Call API to update in MongoDB, e.g., fetch("/api/admin/profile", { method: "PATCH", body: ... })
    }
  };

  const updateName = (name: string) => {
    updateUser({ name });
  };

  const updateProfilePicture = (base64: string) => {
    updateUser({ profilePicture: base64 });
  };

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
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
