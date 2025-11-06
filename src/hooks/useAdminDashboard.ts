"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ApiOrder } from "@/types/orders";
import type { DashboardMetrics, RecentOrder } from "@/types/admin";

interface UseAdminDashboardReturn {
  stats: DashboardMetrics;
  recentOrders: RecentOrder[];
  loading: boolean;
  refresh: () => void;
}

export function useAdminDashboard(): UseAdminDashboardReturn {
  const [stats, setStats] = useState<DashboardMetrics>({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    avgOrderValue: 0,
    totalItemsSold: 0,
    totalUnits: 0,
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshIndex, setRefreshIndex] = useState(0);

  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/stats", { cache: "no-store" });
      if (!response.ok) return;
      const data = await response.json();
      setStats((prev) => ({ ...prev, ...data }));
    } catch (error) {
      console.error("Failed to fetch admin stats", error);
    }
  }, []);

  const fetchRecentOrders = useCallback(async () => {
    try {
      const response = await fetch("/api/orders?limit=10", {
        cache: "no-store",
      });
      if (!response.ok) return;
      const data: { orders: ApiOrder[] } = await response.json();
      const formatted: RecentOrder[] = (data.orders ?? []).map((order) => ({
        id: order.sessionId || order._id?.toString() || "N/A",
        date: order.createdAt
          ? new Date(order.createdAt).toISOString()
          : new Date().toISOString(),
        items: (order.items || []).map((item) => ({
          name: item.name || "Unnamed Product",
          quantity: item.quantity ?? 1,
          size: item.size ?? undefined,
        })),
        total: order.total ?? 0,
        customerEmail: order.customerEmail ?? "",
      }));
      setRecentOrders(formatted.slice(0, 8));
    } catch (error) {
      console.error("Failed to fetch recent orders", error);
    }
  }, []);

  const refresh = useCallback(() => {
    setRefreshIndex((index) => index + 1);
  }, []);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    Promise.all([fetchStats(), fetchRecentOrders()])
      .catch((error) => {
        if (process.env.NODE_ENV !== "production") {
          console.error("Admin dashboard fetch error", error);
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [fetchRecentOrders, fetchStats, refreshIndex]);

  return useMemo(
    () => ({ stats, recentOrders, loading, refresh }),
    [stats, recentOrders, loading, refresh]
  );
}
