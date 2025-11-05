"use client";

import { ReactNode } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import { ToastProvider } from "@/contexts/ToastContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { AdminConsoleNav } from "@/components/admin/AdminConsoleNav";

type AdminLayoutProps = {
  children: ReactNode;
};

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isAdminLogin = pathname === "/admin-login";
  const isAdminRoot = pathname === "/admin";
  const rawTab = searchParams?.get("tab") ?? "overview";
  const allowedTabs = ["overview", "orders", "products"];

  const activeTab = isAdminRoot
    ? allowedTabs.includes(rawTab)
      ? rawTab
      : "overview"
    : "";

  return (
    <ToastProvider>
      <AuthProvider verifyOnMount={!isAdminLogin}>
        {isAdminLogin ? (
          <div className="min-h-screen bg-black/5">{children}</div>
        ) : (
          <AdminConsoleNav activeTab={activeTab}>{children}</AdminConsoleNav>
        )}
      </AuthProvider>
    </ToastProvider>
  );
}
