"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  ListIcon,
  XIcon,
  UserIcon,
  ChartBarIcon,
  ClipboardTextIcon,
  SignOutIcon,
  PackageIcon,
} from "@phosphor-icons/react";

interface AdminNavbarProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}
export default function AdminNavbar({
  activeTab,
  setActiveTab,
}: AdminNavbarProps) {
  const router = useRouter();
  const { user: adminUser, logout: adminLogout } = useAuth();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  const tabs = [
    { id: "overview", label: "Overview", icon: ChartBarIcon },
    { id: "products", label: "Products", icon: PackageIcon },
    { id: "orders", label: "Orders", icon: ClipboardTextIcon },
  ];

  return (
    <div className="relative">
      <header className="fixed top-0 left-0 right-0 z-50 p-4 transition-transform duration-300">
        <div className="max-w-7xl mx-auto p-4 bg-white rounded-xl flex items-center justify-between">
          {/* mobile toggle + logo */}
          <div className="flex items-center space-x-2">
            {adminUser && (
              <button
                className="lg:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                title="Menu"
              >
                {isMenuOpen ? (
                  <XIcon size={20} weight="light" />
                ) : (
                  <ListIcon size={20} weight="light" />
                )}
              </button>
            )}
            <span className="lg:text-3xl text-2xl font-heading">brew.</span>
          </div>

          <nav className="hidden lg:flex items-center gap-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab?.(tab.id)}
                onMouseEnter={() => setHoveredLink(tab.id)}
                onMouseLeave={() => setHoveredLink(null)}
                className={`flex items-center gap-2 text-sm transition-colors ${
                  activeTab === tab.id
                    ? "text-primary font-semibold"
                    : "text-secondary hover:text-primary"
                }`}
              >
                <tab.icon
                  size={18}
                  weight={
                    activeTab === tab.id || hoveredLink === tab.id
                      ? "fill"
                      : "light"
                  }
                />

                {tab.label}
              </button>
            ))}
          </nav>

          {/* desktop profile dropdown */}
          <div className="hidden lg:flex items-center gap-4 relative">
            <button
              onClick={() => {
                if (isMenuOpen) setIsMenuOpen(false);
                setIsDropdownOpen(!isDropdownOpen);
              }}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              title={adminUser?.email || "Admin"}
            >
              {adminUser ? (
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-semibold">
                  {adminUser.email?.charAt(0).toUpperCase()}
                </div>
              ) : (
                <UserIcon size={20} />
              )}
            </button>

            {isDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsDropdownOpen(false)}
                />
                <div className="absolute top-8 -right-4 mt-8 w-60 bg-white rounded-xl overflow-hidden z-50 shadow-lg">
                  {adminUser ? (
                    <>
                      <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-semibold">
                          {adminUser?.email?.charAt(0).toUpperCase() || "A"}
                        </div>
                        <div>
                          <p className="text-sm font-semibold">
                            {adminUser?.name || "Admin"}
                          </p>
                          <p className="text-xs text-secondary/70">
                            {adminUser?.email}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          adminLogout();
                          router.replace("/homepage");
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-accent/5 transition-colors"
                      >
                        <SignOutIcon size={18} /> Sign Out
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => router.push("/admin-login")}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-slate-50 transition-colors"
                    >
                      Sign In
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* mobile menu */}
      {adminUser && isMenuOpen && (
        <div className="lg:hidden relative z-40">
          <div
            className="fixed inset-0 bg-black/40 z-10"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="fixed top-[94px] left-4 right-4 bg-white rounded-xl z-40 transition-transform duration-300">
            <nav className="px-6 py-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab?.(tab.id);
                    setIsMenuOpen(false);
                  }}
                  className={`font-body tracking-wide text-sm flex items-center gap-2 py-3 w-full text-left border-b border-secondary/10 ${
                    activeTab === tab.id
                      ? "text-primary font-semibold"
                      : "text-secondary hover:text-primary"
                  }`}
                  onMouseEnter={() => setHoveredLink(tab.id)}
                  onMouseLeave={() => setHoveredLink(null)}
                >
                  <tab.icon
                    size={18}
                    weight={hoveredLink === tab.id ? "fill" : "light"}
                  />
                  <span>{tab.label}</span>
                </button>
              ))}

              {/* user info */}
              <div className="flex items-center justify-between py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-semibold">
                    {adminUser.email?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">
                      {adminUser.name || "Admin"}
                    </p>
                    <p className="text-xs text-secondary/70">
                      {adminUser.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    adminLogout();
                    router.replace("/homepage");
                  }}
                  className="text-sm hover:opacity-50"
                >
                  Sign Out
                </button>
              </div>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
