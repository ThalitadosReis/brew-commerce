"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/contexts/ToastContext";

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
  hasPermission: (roles: string[]) => boolean;
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
  const { showToast } = useToast();

  // hydrate token if present
  useEffect(() => {
    try {
      const t = sessionStorage.getItem("admin_token");
      if (t) setToken(t);
    } catch {}
  }, []);

  // optional verification on mount
  useEffect(() => {
    if (!verifyOnMount) return;

    (async () => {
      try {
        const response = await fetch("/api/admin/verify", {
          method: "GET",
          credentials: "include",
        });

        if (response.status === 401 || response.status === 403) {
          setUser(null);
          router.push("/admin-login");
          return;
        }

        const data = await response.json();
        if (data.user && data.user.role === "admin") {
          setUser(data.user as AdminUser);
        }
      } catch (err) {
        console.error("Auth verification error:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [router, verifyOnMount]);

  const login = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      try {
        const response = await fetch("/api/admin/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
          credentials: "include",
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || "Login failed");
        }

        const data = await response.json();
        if (data.user && data.user.role === "admin") {
          setUser(data.user as AdminUser);
          if (data.token) {
            setToken(data.token);
            try {
              sessionStorage.setItem("admin_token", data.token);
            } catch {}
          }
          router.push("/admin");
        } else {
          throw new Error("Access denied: Admin role required");
        }
      } catch (err) {
        console.error("Login error:", err);
        const message =
          err instanceof Error ? err.message : "Authentication failed";
        showToast(message, "error");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [router, showToast]
  );

  const logout = useCallback(async () => {
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
      try {
        sessionStorage.removeItem("admin_token");
      } catch {}
      router.push("/admin-login");
    }
  }, [router]);

  const updateUser = useCallback((updates: Partial<AdminUser>) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : prev));
  }, []);

  const updateName = useCallback(
    (name: string) => updateUser({ name }),
    [updateUser]
  );
  const updateProfilePicture = useCallback(
    (base64: string) => updateUser({ profilePicture: base64 }),
    [updateUser]
  );

  const hasPermission = useCallback(
    (roles: string[]) => roles.includes(user?.role ?? ""),
    [user?.role]
  );

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      isAuthenticated: !!user,
      loading,
      token,
      login,
      logout,
      updateUser,
      updateName,
      updateProfilePicture,
      hasPermission,
    }),
    [
      user,
      loading,
      token,
      login,
      logout,
      updateUser,
      updateName,
      updateProfilePicture,
      hasPermission,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
