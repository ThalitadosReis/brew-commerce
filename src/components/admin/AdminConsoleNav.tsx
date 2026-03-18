"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { SignOutIcon } from "@phosphor-icons/react";

const NAV_ITEMS = [
  { tab: "overview", label: "Overview" },
  { tab: "orders", label: "Orders" },
  { tab: "products", label: "Products" },
] as const;

type AdminConsoleShellProps = {
  children: React.ReactNode;
  activeTab: string;
};

export function AdminConsoleNav({ children, activeTab }: AdminConsoleShellProps) {
  const { user, logout } = useAuth();
  const initials = (user?.name ?? user?.email ?? "A").charAt(0).toUpperCase();

  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);
  const profileButtonRef = useRef<HTMLButtonElement | null>(null);

  const handleLogout = useCallback(() => {
    setProfileMenuOpen(false);
    logout();
  }, [logout]);

  useEffect(() => {
    if (!profileMenuOpen) return;
    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        profileMenuRef.current?.contains(target) ||
        profileButtonRef.current?.contains(target)
      ) return;
      setProfileMenuOpen(false);
    };
    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, [profileMenuOpen]);

  return (
    <div className="flex min-h-svh flex-col bg-neutral-50">
      {/* Top navbar */}
      <header className="sticky top-0 z-30 bg-white border-b border-black/10">
        <div className="flex h-14 items-center justify-between px-4 md:px-6 max-w-7xl mx-auto">
          {/* Brand + nav */}
          <div className="flex items-center gap-6">
            <span className="text-base uppercase tracking-[0.16em] font-medium shrink-0">
              brew<span className="text-amber-700">.</span>
            </span>
            <span className="h-4 w-px bg-black/10" />
            <nav className="flex items-center gap-1">
              {NAV_ITEMS.map(({ tab, label }) => {
                const isActive = activeTab === tab;
                return (
                  <Link
                    key={tab}
                    href={`/admin?tab=${tab}`}
                    className={`px-3 py-1.5 text-xs uppercase tracking-[0.18em] transition-colors ${
                      isActive
                        ? "text-black font-medium"
                        : "text-black/40 hover:text-black/70"
                    }`}
                  >
                    {label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Profile */}
          <div className="relative">
            <button
              type="button"
              ref={profileButtonRef}
              onClick={() => setProfileMenuOpen((o) => !o)}
              className="flex h-8 w-8 items-center justify-center border border-black/10 bg-white text-xs font-semibold transition hover:bg-black/5"
              aria-haspopup="menu"
              aria-expanded={profileMenuOpen}
            >
              {initials}
            </button>

            {profileMenuOpen && (
              <div
                ref={profileMenuRef}
                className="absolute right-0 mt-1 w-52 border border-black/10 bg-white shadow-sm z-50"
              >
                <div className="px-4 py-3 border-b border-black/10">
                  <p className="text-sm font-medium text-black truncate">
                    {user?.name ?? "Administrator"}
                  </p>
                  <p className="text-xs text-black/40 truncate">{user?.email}</p>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm transition hover:bg-black/5"
                >
                  <SignOutIcon size={15} />
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
