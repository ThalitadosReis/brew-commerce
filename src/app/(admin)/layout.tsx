"use client";

import { ReactNode, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import { AuthProvider } from "@/contexts/AuthContext";
import { AdminConsoleNav } from "@/components/admin/AdminConsoleNav";

type AdminLayoutProps = {
  children: ReactNode;
};

function AdminLayoutContent({ children }: AdminLayoutProps) {
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
    <AuthProvider verifyOnMount={!isAdminLogin}>
      {isAdminLogin ? (
        <div className="min-h-screen">{children}</div>
      ) : (
        <AdminConsoleNav activeTab={activeTab}>{children}</AdminConsoleNav>
      )}
    </AuthProvider>
  );
}

export default function AdminLayout(props: AdminLayoutProps) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black/5" />}>
      <AdminLayoutContent {...props} />
    </Suspense>
  );
}
