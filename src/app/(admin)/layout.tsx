"use client";

import { useState } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import AdminNavbar from "@/components/AdminNavbar";

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <AuthProvider>
      <div>
        <AdminNavbar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main>{children}</main>
      </div>
    </AuthProvider>
  );
}
