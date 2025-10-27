"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import Loading from "@/components/common/Loading";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, user: adminUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (adminUser) {
      router.replace("/admin");
    }
  }, [adminUser, router]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
    } catch (err) {
      setError((err as Error).message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (adminUser) {
    return <Loading message="Redirecting to dashboard..." />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 px-4 py-12 text-slate-900">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-16 top-10 h-32 w-32 rounded-full bg-slate-200/40 blur-3xl sm:left-24 sm:top-16" />
        <div className="absolute bottom-12 right-16 h-36 w-36 rounded-full bg-slate-300/30 blur-3xl sm:bottom-24 sm:right-24" />
      </div>

      <div className="relative z-10 w-full max-w-md rounded-3xl border border-slate-100 bg-white/90 p-8 shadow-xl backdrop-blur-xl sm:p-10">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-sm font-semibold uppercase tracking-wide text-slate-700">
            BC
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
              brew.commerce
            </p>
            <h1 className="text-lg font-semibold tracking-tight text-slate-900">
              Admin Access
            </h1>
          </div>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <fieldset className="space-y-2">
            <label
              htmlFor="email"
              className="text-xs font-medium uppercase tracking-wide text-slate-500"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              disabled={loading}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 transition focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 disabled:opacity-60"
              placeholder="admin@brewcommerce.com"
            />
          </fieldset>

          <fieldset className="space-y-2">
            <label
              htmlFor="password"
              className="text-xs font-medium uppercase tracking-wide text-slate-500"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              disabled={loading}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 transition focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 disabled:opacity-60"
              placeholder="Enter password"
            />
          </fieldset>

          {error && (
            <p className="rounded-lg border border-red-200 bg-red-100/70 px-3 py-2 text-xs text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 py-3 rounded-xl bg-slate-900 text-sm font-medium text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="mt-8 flex items-center justify-between text-xs text-slate-500">
          <span>Need help? hello@brewcommerce.com</span>
          <Link
            href="/homepage"
            className="font-medium text-slate-700 underline-offset-4 hover:text-slate-900 hover:underline"
          >
            Exit
          </Link>
        </div>
      </div>
    </div>
  );
}
