"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { CaretRightIcon, SignOutIcon } from "@phosphor-icons/react";
import { PanelLeft } from "lucide-react";

import { AdminNavigationDrawer } from "@/components/admin/AdminNavigationDrawer";

type AdminConsoleShellProps = {
  children: React.ReactNode;
  activeTab: string;
};

export function AdminConsoleNav({
  children,
  activeTab,
}: AdminConsoleShellProps) {
  const { user, logout } = useAuth();

  const initials =
    (user?.name ?? user?.email ?? "Admin").charAt(0)?.toUpperCase() ?? "A";

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const profileMenuRef = useRef<HTMLDivElement | null>(null);
  const profileButtonRef = useRef<HTMLButtonElement | null>(null);

  const toggleDrawer = useCallback(() => {
    setDrawerOpen((open) => !open);
  }, []);

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
  }, []);

  const handleNavigate = useCallback(() => {
    setDrawerOpen(false);
  }, []);

  const handleLogout = useCallback(() => {
    setProfileMenuOpen(false);
    setDrawerOpen(false);
    logout();
  }, [logout]);

  useEffect(() => {
    if (!profileMenuOpen) return;

    const handleClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        profileMenuRef.current?.contains(target) ||
        profileButtonRef.current?.contains(target)
      ) {
        return;
      }

      setProfileMenuOpen(false);
    };

    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, [profileMenuOpen]);

  return (
    <div className="relative flex min-h-svh flex-col bg-black/5">
      <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-black/10 bg-white px-6">
        <div className="flex items-center gap-3 text-sm">
          <button
            type="button"
            onClick={toggleDrawer}
            className="flex items-center justify-center transition hover:bg-black/5 rounded-md p-2"
            aria-label="Toggle navigation"
          >
          <PanelLeft size={20} />
          </button>
          <span className="h-6 w-px bg-black/10" />
          <div className="flex items-center gap-2">
            <span className="text-black/50">Admin Dashboard</span>
            {activeTab && (
              <span className="inline-flex items-center gap-2">
                <CaretRightIcon size={14} className="text-black/50" />
                <span className="capitalize font-semibold">{activeTab}</span>
              </span>
            )}
          </div>
        </div>

        <div className="relative">
          <button
            type="button"
            ref={profileButtonRef}
            onClick={() => setProfileMenuOpen((open) => !open)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-black/5 text-sm font-semibold transition hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-black/10"
            aria-haspopup="menu"
            aria-expanded={profileMenuOpen}
          >
            {initials}
          </button>
          {profileMenuOpen ? (
            <div
              ref={profileMenuRef}
              className="absolute right-0 mt-2 w-60 rounded-lg border border-black/10 bg-white shadow-sm"
            >
              <div className=" p-4 flex flex-col">
                <span className="text-sm font-semibold text-black">
                  {user?.name ?? "Administrator"}
                </span>
                <span className="text-xs text-black/50">
                  {user?.email ?? "admin@example.com"}
                </span>
              </div>

              {/* Divider */}
              <div className="h-px w-full bg-black/10" />

              <button
                type="button"
                onClick={handleLogout}
                className=" p-4 flex w-full items-center gap-2 text-left text-sm transition hover:bg-black/5"
              >
                <SignOutIcon size={18} weight="bold" />
                <span>Log out</span>
              </button>
            </div>
          ) : null}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6">{children}</div>

      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-200 ${
          drawerOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={closeDrawer}
      />

      <AdminNavigationDrawer
        activeTab={activeTab}
        isOpen={drawerOpen}
        onNavigate={handleNavigate}
        onClose={closeDrawer}
        userName={user?.name}
        userEmail={user?.email}
        userInitials={initials}
      />
    </div>
  );
}
