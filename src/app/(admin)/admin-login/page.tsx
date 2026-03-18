"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { CircleNotchIcon } from "@phosphor-icons/react";

import { useAuth } from "@/contexts/AuthContext";

const inputClass =
  "w-full bg-transparent border-b border-black/20 py-3 text-sm outline-none transition-colors focus:border-black placeholder:text-black/30";

export default function AdminLogin() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      await login(email, password);
      router.replace("/admin");
    } catch (error) {
      console.error("Admin login failed", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left — brand panel */}
      <div className="hidden lg:flex flex-col justify-between bg-neutral-900 px-14 py-16">
        <p className="text-xl uppercase tracking-[0.16em] text-white">
          brew<span className="text-amber-500">.</span>
        </p>
        <div className="space-y-4">
          <p className="text-[11px] uppercase tracking-[0.3em] text-amber-500">
            Admin console
          </p>
          <h2 className="text-3xl font-semibold tracking-[-0.03em] text-white leading-tight max-w-xs">
            Manage your store from one place
          </h2>
        </div>
        <p className="text-xs text-white/30 tracking-wide">
          © {new Date().getFullYear()} Brew Commerce
        </p>
      </div>

      {/* Right — form */}
      <div className="flex items-center justify-center px-6 py-16 bg-white">
        <div className="w-full max-w-sm">
          {/* Mobile brand */}
          <p className="lg:hidden text-xl uppercase tracking-[0.16em] text-black mb-10">
            brew<span className="text-amber-700">.</span>
          </p>

          <div className="mb-10 space-y-2">
            <p className="text-[11px] uppercase tracking-[0.3em] text-amber-700">
              Admin
            </p>
            <h1 className="text-3xl font-semibold tracking-[-0.03em] text-black">
              Sign in
            </h1>
            <p className="text-sm text-black/50">
              Access the Brew Commerce admin console.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            <label className="block">
              <span className="text-[11px] uppercase tracking-[0.2em] text-black/40 mb-2 block">
                Email
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@brewcommerce.com"
                required
                className={inputClass}
              />
            </label>

            <label className="block">
              <span className="text-[11px] uppercase tracking-[0.2em] text-black/40 mb-2 block">
                Password
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className={inputClass}
              />
            </label>

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 bg-black px-4 py-3 text-xs font-medium uppercase tracking-[0.2em] text-white transition-colors hover:bg-black/85 disabled:opacity-50"
            >
              {submitting && (
                <CircleNotchIcon className="w-4 h-4 animate-spin" weight="bold" />
              )}
              {submitting ? "Signing in..." : "Sign in"}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-8 border-t border-black/10 pt-6 space-y-3">
            <p className="text-[11px] uppercase tracking-[0.25em] text-black/40">
              Demo credentials
            </p>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-black/40">Email</span>
                <span className="text-xs font-mono text-black/70">admin@brewcommerce.com</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-black/40">Password</span>
                <span className="text-xs font-mono text-black/70">admin123</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
