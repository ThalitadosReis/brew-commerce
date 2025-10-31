"use client";

import React, { Suspense, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import type { AdminDashboardTab } from "@/types/admin";
import { useAuth } from "@/contexts/AuthContext";
import { useAdminDashboard } from "@/hooks/useAdminDashboard";
import Overview from "@/components/admin/Overview";
import Products from "@/components/admin/ProductsManager";
import Orders from "@/components/admin/OrdersManager";
import Loading from "@/components/common/Loading";

export const dynamic = "force-dynamic";

const VALID_TABS: AdminDashboardTab[] = ["overview", "products", "orders"];

function resolveTab(rawTab: string | null): AdminDashboardTab {
  if (!rawTab) return "overview";
  return (
    VALID_TABS.includes(rawTab as AdminDashboardTab) ? rawTab : "overview"
  ) as AdminDashboardTab;
}

function AdminDashboardContent() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    stats,
    recentOrders,
    loading: dashboardLoading,
  } = useAdminDashboard();

  const activeTab = resolveTab(searchParams?.get("tab"));

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated || user?.role !== "admin") {
      router.push("/admin-login");
    }
  }, [isAuthenticated, user, router, authLoading]);

  useEffect(() => {
    if (!searchParams || searchParams.get("tab")) return;
    const params = new URLSearchParams(searchParams?.toString() ?? "");
    params.set("tab", "overview");
    router.replace(`/admin?${params.toString()}`);
  }, [router, searchParams]);

  const renderedContent = useMemo(() => {
    switch (activeTab) {
      case "products":
        return <Products />;
      case "orders":
        return <Orders />;
      case "overview":
      default:
        return (
          <Overview
            stats={stats}
            recentOrders={recentOrders}
            loadingActivity={dashboardLoading}
          />
        );
    }
  }, [activeTab, stats, recentOrders, dashboardLoading]);

  if (authLoading) {
    return <Loading message="Checking admin permissions..." />;
  }

  if (!user || user.role !== "admin") {
    return <Loading message="Checking admin permissions..." />;
  }

  return <>{renderedContent}</>;
}

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={<Loading message="Loading dashboard..." />}>
      <AdminDashboardContent />
    </Suspense>
  );
}
