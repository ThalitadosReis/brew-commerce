"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/contexts/AuthContext";

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
    <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 py-20 md:px-6">
      <div className="w-full max-w-md border border-black/10 bg-white p-8 shadow-lg shadow-black/5">
        <div className="mb-8 space-y-2 text-center">
          <p className="text-[11px] uppercase tracking-[0.24em] text-black/45">
            Admin
          </p>
          <h1 className="text-3xl font-semibold tracking-[-0.03em] text-black">
            Sign in
          </h1>
          <p className="text-sm text-black/55">
            Access the Brew Commerce admin console.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block space-y-2 text-sm text-black/70">
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="w-full border border-black/10 px-4 py-3 text-sm text-black outline-none transition-colors focus:border-black/25"
            />
          </label>

          <label className="block space-y-2 text-sm text-black/70">
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="w-full border border-black/10 px-4 py-3 text-sm text-black outline-none transition-colors focus:border-black/25"
            />
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-black px-4 py-3 text-xs font-medium uppercase tracking-[0.2em] text-white transition-colors hover:bg-black/85 disabled:opacity-50"
          >
            {submitting ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
