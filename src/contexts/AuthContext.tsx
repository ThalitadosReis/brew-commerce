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
  register: (payload: {
    name: string;
    email: string;
    password: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<AdminUser>) => void;
  updateName: (name: string) => void;
  updateProfilePicture: (base64: string) => void;
  hasPermission: (roles: string[]) => boolean;
}

const TOKEN_STORAGE_KEY = "admin_token";
const USER_STORAGE_KEY = "admin_user";

type MaybeAdminPayload = Partial<AdminUser> & { userId?: string };

function normaliseAdminUser(raw: unknown): AdminUser | null {
  if (!raw || typeof raw !== "object") return null;
  const payload = raw as Record<string, unknown>;
  const email = typeof payload.email === "string" ? payload.email : null;
  const role = payload.role === "admin" ? "admin" : null;
  if (!email || !role) return null;

  const idValue =
    typeof payload.id === "string" && payload.id
      ? payload.id
      : typeof payload.userId === "string"
      ? payload.userId
      : "";

  return {
    id: idValue,
    email,
    role,
    name: typeof payload.name === "string" ? payload.name : undefined,
    profilePicture:
      typeof payload.profilePicture === "string"
        ? payload.profilePicture
        : undefined,
  };
}

function decodeAdminToken(token: string): AdminUser | null {
  try {
    const [, payloadBase64] = token.split(".");
    if (!payloadBase64) return null;
    const decoded = JSON.parse(atob(payloadBase64)) as MaybeAdminPayload;
    const enriched = {
      ...decoded,
      role: decoded.role ?? "admin",
      id: decoded.id ?? decoded.userId,
    };
    return normaliseAdminUser(enriched);
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[Auth] Failed to decode admin token", error);
    }
    return null;
  }
}

function safeGetSessionItem(key: string): string | null {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSetSessionItem(key: string, value: string | null) {
  try {
    if (value === null) {
      sessionStorage.removeItem(key);
    } else {
      sessionStorage.setItem(key, value);
    }
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error(`[Auth] Failed to persist ${key}`, error);
    }
  }
}

function safeStoreAdminUser(user: AdminUser | null) {
  if (!user) {
    safeSetSessionItem(USER_STORAGE_KEY, null);
    return;
  }
  try {
    safeSetSessionItem(USER_STORAGE_KEY, JSON.stringify(user));
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[Auth] Failed to serialise admin user", error);
    }
  }
}

function getStoredAdminUser(): AdminUser | null {
  const raw = safeGetSessionItem(USER_STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    const user = normaliseAdminUser(parsed);
    if (!user) {
      safeSetSessionItem(USER_STORAGE_KEY, null);
    }
    return user;
  } catch (error) {
    safeSetSessionItem(USER_STORAGE_KEY, null);
    if (process.env.NODE_ENV !== "production") {
      console.error("[Auth] Failed to parse stored admin user", error);
    }
    return null;
  }
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
  const [hydrated, setHydrated] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();
  const isDev = process.env.NODE_ENV !== "production";

  const persistSession = useCallback(
    ({
      nextUser,
      nextToken,
    }: {
      nextUser: AdminUser | null;
      nextToken: string | null;
    }) => {
      setUser(nextUser);
      safeStoreAdminUser(nextUser);
      setToken(nextToken);
      safeSetSessionItem(TOKEN_STORAGE_KEY, nextToken);
    },
    []
  );

  const clearSession = useCallback(() => {
    persistSession({ nextUser: null, nextToken: null });
  }, [persistSession]);

  // hydrate token and user if present
  useEffect(() => {
    const storedToken = safeGetSessionItem(TOKEN_STORAGE_KEY);
    if (storedToken) {
      setToken(storedToken);
    }

    let storedUser = getStoredAdminUser();
    if (!storedUser && storedToken) {
      storedUser = decodeAdminToken(storedToken);
      if (storedUser) {
        safeStoreAdminUser(storedUser);
      }
    }

    if (storedUser) {
      setUser(storedUser);
    }

    setHydrated(true);
  }, []);

  // optional verification on mount
  useEffect(() => {
    if (!verifyOnMount || !hydrated) return;

    let cancelled = false;

    (async () => {
      try {
        const headers: HeadersInit = {};
        if (token) headers.Authorization = `Bearer ${token}`;

        const response = await fetch("/api/admin/verify", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
          headers,
        });

        if (response.status === 401 || response.status === 403) {
          if (!cancelled) {
            clearSession();
            router.push("/admin-login");
          }
          return;
        }

        const data = await response.json();
        const adminUser = normaliseAdminUser(data.user);
        if (adminUser && !cancelled) {
          persistSession({ nextUser: adminUser, nextToken: token });
        }
      } catch (err) {
        if (isDev) console.error("Auth verification error:", err);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [
    clearSession,
    hydrated,
    isDev,
    persistSession,
    router,
    token,
    verifyOnMount,
  ]);

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
        const adminUser = normaliseAdminUser(data.user);
        if (!adminUser) {
          throw new Error("Access denied: Admin role required");
        }

        const tokenValue =
          typeof data.token === "string" && data.token ? data.token : null;
        persistSession({ nextUser: adminUser, nextToken: tokenValue });

        router.push("/admin");
      } catch (err) {
        if (isDev) console.error("Login error:", err);
        const message =
          err instanceof Error ? err.message : "Authentication failed";
        showToast(message, "error");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [persistSession, router, showToast, isDev]
  );

  const register = useCallback(
    async ({
      name,
      email,
      password,
    }: {
      name: string;
      email: string;
      password: string;
    }) => {
      setLoading(true);
      try {
        const response = await fetch("/api/admin/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
          credentials: "include",
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || "Registration failed");
        }

        const data = await response.json();
        const adminUser = normaliseAdminUser(data.user);
        if (!adminUser) {
          throw new Error("Unable to register admin account");
        }

        const tokenValue =
          typeof data.token === "string" && data.token ? data.token : null;
        persistSession({ nextUser: adminUser, nextToken: tokenValue });

        showToast("Admin account created successfully.", "success");
        router.push("/admin");
      } catch (err) {
        if (isDev) console.error("Registration error:", err);
        const message =
          err instanceof Error ? err.message : "Registration failed";
        showToast(message, "error");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [persistSession, router, showToast, isDev]
  );

  const logout = useCallback(async () => {
    try {
      await fetch("/api/admin/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      if (isDev) console.error("Logout error:", error);
    } finally {
      setLoading(false);
      clearSession();
      router.push("/admin-login");
    }
  }, [clearSession, router, isDev]);

  const updateUser = useCallback((updates: Partial<AdminUser>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...updates };
      safeStoreAdminUser(next);
      return next;
    });
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
      register,
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
      register,
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
