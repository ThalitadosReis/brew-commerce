"use client";

import { usePathname } from "next/navigation";

import { AuthProvider } from "@/contexts/AuthContext";
import { ToastProvider } from "@/contexts/ToastContext";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminLogin = pathname === "/admin-login";

  return (
    <ToastProvider>
      <AuthProvider verifyOnMount={!isAdminLogin}>
        <div className="min-h-screen">{children}</div>
      </AuthProvider>
    </ToastProvider>
  );
}
