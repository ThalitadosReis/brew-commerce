"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import {
  ChartBarIcon,
  ShoppingCartSimpleIcon,
  PackageIcon,
  CardsThreeIcon,
} from "@phosphor-icons/react";

const ADMIN_PATH = "/admin" as const;

const NAV_ITEMS = [
  { tab: "overview", label: "Overview", icon: ChartBarIcon },
  { tab: "orders", label: "Orders", icon: ShoppingCartSimpleIcon },
  { tab: "products", label: "Products", icon: PackageIcon },
];

export type AdminNavigationDrawerProps = {
  activeTab: string | null;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: () => void;
  userName?: string | null;
  userEmail?: string | null;
  userInitials?: string;
};

export function AdminNavigationDrawer({
  activeTab,
  isOpen,
  onClose,
  onNavigate,
  userName,
  userEmail,
  userInitials,
}: AdminNavigationDrawerProps) {
  const panelRef = useRef<HTMLDivElement | null>(null);

  // Close on ESC
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      panelRef.current?.focus();
    }
  }, [isOpen]);

  return (
    <aside
      className={[
        "fixed inset-y-0 left-0 z-50 w-72 -translate-x-full transform transition-transform duration-300 will-change-transform",
        "bg-white",
        isOpen ? "translate-x-0" : "",
      ].join(" ")}
      role="dialog"
      aria-modal="true"
      aria-label="Admin navigation"
      aria-hidden={!isOpen}
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        className="flex h-full flex-col"
      >
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center p-2 rounded-lg bg-black/10">
              <CardsThreeIcon size={24} />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold">brew.</div>
              <div className="text-xs text-black/75">Commerce</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 mt-4">
          <span className="text-sm uppercase tracking-wide text-black/50">
            Manage
          </span>
          <ul className="mt-2 space-y-2">
            {NAV_ITEMS.map(({ tab, label, icon: Icon }) => {
              const isActive = activeTab === tab;
              return (
                <li key={tab}>
                  <Link
                    href={`${ADMIN_PATH}?tab=${tab}`}
                    onClick={onNavigate}
                    className={[
                      "group flex items-center gap-3 rounded-xl px-4 py-2 text-sm transition",
                      isActive ? "bg-black/10 font-medium" : "hover:bg-black/5",
                    ].join(" ")}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <Icon size={20} weight={isActive ? "fill" : "bold"} />
                    <span className="truncate">{label}</span>
                    {isActive && (
                      <span
                        className="ml-auto h-2 w-2 shrink-0 rounded-full bg-black/25"
                        aria-hidden
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {(userName || userEmail || userInitials) && (
          <div className="border-t border-black/10 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-black/5 text-sm font-semibold ">
                {userInitials?.slice(0, 2) ?? "A"}
              </div>
              <div className="leading-tight">
                <div className="truncate text-sm font-medium">
                  {userName ?? "Administrator"}
                </div>
                <div className="truncate text-xs text-black/50">
                  {userEmail ?? "admin@example.com"}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

export default AdminNavigationDrawer;
