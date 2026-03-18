"use client";

import { useMemo } from "react";
import Link from "next/link";
import type { DashboardMetrics, RecentOrder } from "@/types/admin";
import { ClockIcon, PackageIcon, ReceiptIcon, UsersIcon } from "@phosphor-icons/react";

interface AdminOverviewProps {
  stats: DashboardMetrics;
  recentOrders: RecentOrder[];
  loadingActivity: boolean;
  currency?: string;
}

export default function AdminOverview({
  stats,
  recentOrders,
  loadingActivity,
  currency = "CHF",
}: AdminOverviewProps) {
  const moneyFormatter = useMemo(
    () =>
      new Intl.NumberFormat(undefined, {
        style: "currency",
        currency,
        minimumFractionDigits: 2,
      }),
    [currency]
  );
  const integerFormatter = useMemo(() => new Intl.NumberFormat(undefined), []);

  const getTimeAgo = (iso: string) => {
    const timestamp = new Date(iso);
    if (Number.isNaN(timestamp.getTime())) return "-";
    const day = String(timestamp.getDate()).padStart(2, "0");
    const month = String(timestamp.getMonth() + 1).padStart(2, "0");
    const year = timestamp.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const statCards = [
    {
      label: "Total revenue",
      value: moneyFormatter.format(stats.totalRevenue),
    },
    {
      label: "Orders",
      value: integerFormatter.format(stats.totalOrders),
    },
    {
      label: "Avg. order value",
      value: moneyFormatter.format(stats.avgOrderValue),
    },
    {
      label: "Items sold",
      value: integerFormatter.format(stats.totalItemsSold),
    },
    {
      label: "Products",
      value: integerFormatter.format(stats.totalProducts),
    },
    {
      label: "Users",
      value: integerFormatter.format(stats.totalUsers),
    },
  ];

  return (
    <section className="space-y-10">
      <div>
        <p className="text-[11px] uppercase tracking-[0.3em] text-amber-700 mb-2">
          Dashboard
        </p>
        <h1 className="text-3xl font-semibold tracking-[-0.03em] text-black">
          Welcome back
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          Store performance at a glance.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 divide-x divide-y divide-black/10 border border-black/10">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white px-6 py-5 space-y-1">
            <p className="text-[11px] uppercase tracking-[0.25em] text-black/40">
              {card.label}
            </p>
            <p className="text-2xl font-semibold tracking-[-0.03em] text-black">
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="border border-black/10 bg-white">
        <div className="flex items-end justify-between px-6 py-5 border-b border-black/10">
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-amber-700 mb-1">
              Activity
            </p>
            <h2 className="text-xl font-semibold tracking-[-0.02em] text-black">
              Recent orders
            </h2>
          </div>
          <Link
            href="/admin?tab=orders"
            className="text-xs uppercase tracking-[0.2em] text-black/50 hover:text-black transition-colors"
          >
            View all
          </Link>
        </div>

        {loadingActivity ? null : recentOrders.length ? (
          <div className="divide-y divide-black/5">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between px-6 py-4">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <ReceiptIcon size={14} className="text-black/30" />
                    <span className="text-sm font-mono text-black/60">
                      #{order.id.slice(0, 14)}
                    </span>
                  </div>
                  <p className="text-xs text-black/40">
                    {order.items[0]?.name}
                    {order.items[0]?.size && ` · ${order.items[0].size}`}
                    {order.items.length > 1 && ` +${order.items.length - 1} more`}
                  </p>
                </div>
                <div className="text-right space-y-0.5">
                  <p className="text-sm font-medium tabular-nums text-black">
                    {moneyFormatter.format(order.total)}
                  </p>
                  <p className="flex items-center justify-end gap-1 text-xs text-black/40">
                    <ClockIcon size={12} />
                    {getTimeAgo(order.date)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <PackageIcon size={32} className="mx-auto mb-3 text-black/20" />
            <p className="text-sm text-black/40">No recent orders yet.</p>
          </div>
        )}
      </div>

      {/* Quick links */}
      <div className="grid sm:grid-cols-2 gap-px bg-black/10 border border-black/10">
        <Link
          href="/admin?tab=orders"
          className="bg-white px-6 py-5 flex items-center justify-between group hover:bg-neutral-50 transition-colors"
        >
          <div className="space-y-1">
            <p className="text-[11px] uppercase tracking-[0.25em] text-black/40">Manage</p>
            <p className="text-sm font-semibold text-black flex items-center gap-2">
              <ReceiptIcon size={16} className="text-black/40" />
              Orders
            </p>
          </div>
          <UsersIcon size={16} className="text-black/20 group-hover:text-black/40 transition-colors" />
        </Link>
        <Link
          href="/admin?tab=products"
          className="bg-white px-6 py-5 flex items-center justify-between group hover:bg-neutral-50 transition-colors"
        >
          <div className="space-y-1">
            <p className="text-[11px] uppercase tracking-[0.25em] text-black/40">Manage</p>
            <p className="text-sm font-semibold text-black flex items-center gap-2">
              <PackageIcon size={16} className="text-black/40" />
              Products
            </p>
          </div>
          <PackageIcon size={16} className="text-black/20 group-hover:text-black/40 transition-colors" />
        </Link>
      </div>
    </section>
  );
}
