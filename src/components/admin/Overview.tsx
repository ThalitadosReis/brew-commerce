"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { DashboardMetrics, RecentOrder } from "@/types/admin";

import {
  ChartBarIcon,
  ClockIcon,
  PackageIcon,
  ReceiptIcon,
  UsersIcon,
} from "@phosphor-icons/react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

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

  const [revenueView, setRevenueView] = useState<"monthly" | "weekly">(
    "monthly"
  );

  const monthlyChartData = useMemo(() => {
    const data = [];
    const today = new Date();
    const currentYear = today.getFullYear();

    for (let month = 0; month < 12; month++) {
      const monthDate = new Date(currentYear, month, 1);
      const monthName = monthDate.toLocaleDateString("en-US", {
        month: "short",
      });

      const monthOrders = recentOrders.filter((order) => {
        const orderDate = new Date(order.date);
        return (
          orderDate.getFullYear() === currentYear &&
          orderDate.getMonth() === month
        );
      });

      const revenue = monthOrders.reduce((sum, order) => sum + order.total, 0);
      const orders = monthOrders.length;

      data.push({
        label: monthName,
        revenue: Number(revenue.toFixed(2)),
        orders,
      });
    }

    return data;
  }, [recentOrders]);

  const weeklyChartData = useMemo(() => {
    const data = [];
    const today = new Date();
    const startOfWeek = (date: Date) => {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const day = start.getDay();
      start.setDate(start.getDate() - day);
      return start;
    };
    const endOfWeek = (start: Date) => {
      const end = new Date(start);
      end.setHours(23, 59, 59, 999);
      end.setDate(end.getDate() + 6);
      return end;
    };
    const ordersWithDates = recentOrders.map((order) => ({
      ...order,
      orderDate: new Date(order.date),
    }));

    for (let i = 0; i < 12; i++) {
      const weekStart = startOfWeek(today);
      weekStart.setDate(weekStart.getDate() - i * 7);
      const weekEnd = endOfWeek(weekStart);

      const weekOrders = ordersWithDates.filter(
        (order) => order.orderDate >= weekStart && order.orderDate <= weekEnd
      );

      const revenue = weekOrders.reduce((sum, order) => sum + order.total, 0);
      const orders = weekOrders.length;

      const startLabel = weekStart.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      const endLabel = weekEnd.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      data.unshift({
        label: `${startLabel} - ${endLabel}`,
        revenue: Number(revenue.toFixed(2)),
        orders,
      });
    }

    return data;
  }, [recentOrders]);

  const chartData =
    revenueView === "monthly" ? monthlyChartData : weeklyChartData;
  const revenueDescription =
    revenueView === "monthly"
      ? `Monthly revenue for ${new Date().getFullYear()}`
      : "Weekly revenue for the last 12 weeks";

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: Array<{ value: number; payload: { orders: number } }>;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-md border border-black/10 bg-white p-4 shadow-lg">
          <span className="mb-2 text-sm font-semibold">{label}</span>
          <div>
            <div className="flex items-center justify-between gap-4">
              <small className="text-black/50 font-normal">Revenue:</small>
              <span className="text-sm font-semibold">
                {moneyFormatter.format(payload[0].value)}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <small className="text-black/50 font-normal">Orders:</small>
              <span className="text-sm font-semibold">
                {payload[0].payload.orders}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <section className="space-y-8">
      <header className="rounded-2xl border border-black/10 bg-white p-6 shadow-lg shadow-black/10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="space-y-4">
            <small className="inline-flex uppercase text-black/75 font-normal rounded-full bg-black/5 px-4 py-1 tracking-[0.16em]">
              Dashboard
            </small>
            <div className="space-y-2">
              <h2 className="leading-tight!">Welcome back!</h2>
              <p className="max-w-xl">
                Monitor revenue, orders, and customer activity from an
                at-a-glance console designed for calm clarity.
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
        <div className="rounded-2xl border border-black/10 bg-white p-8 shadow-lg shadow-black/10">
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 text-sm font-medium text-black/75 rounded-full bg-black/5 px-4 py-1">
                <ChartBarIcon size={20} />
                Snapshot
              </div>
              <div>
                <p className="font-semibold!">
                  {moneyFormatter.format(stats.totalRevenue)}
                </p>
                <span className="text-sm text-black/75">
                  Across {integerFormatter.format(stats.totalOrders)} fulfilled
                  orders
                </span>
              </div>
            </div>
            <div className="grid gap-4 text-right text-sm">
              <div className="rounded-xl border border-black/10 bg-black/5 px-4 py-2 shadow-sm">
                <span className="text-xs uppercase tracking-widest text-black/50">
                  Items sold
                </span>
                <p className="mt-2 font-semibold!">
                  {integerFormatter.format(stats.totalItemsSold)}
                </p>
              </div>
              <div className="rounded-xl border border-black/10 bg-black/5 px-4 py-2 shadow-sm">
                <span className="text-xs uppercase tracking-widest text-black/50">
                  Avg. order
                </span>
                <p className="mt-2 font-semibold!">
                  {moneyFormatter.format(stats.avgOrderValue)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-lg shadow-black/10">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-black/10 p-2">
                  <ReceiptIcon
                    size={16}
                    weight="bold"
                    className="text-black/50"
                  />
                </div>
                <span className="text-sm font-normal text-black/75">
                  Orders
                </span>
              </div>
              <span className="text-lg font-bold">
                {integerFormatter.format(stats.totalOrders)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-black/10 p-2">
                  <UsersIcon
                    size={16}
                    weight="bold"
                    className="text-black/50"
                  />
                </div>
                <span className="text-sm font-normal text-black/75">Users</span>
              </div>
              <span className="text-lg font-bold">
                {integerFormatter.format(stats.totalUsers)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-black/10 p-2">
                  <PackageIcon
                    size={16}
                    weight="bold"
                    className="text-black/50"
                  />
                </div>
                <span className="text-sm font-normal text-black/75">
                  Products
                </span>
              </div>
              <span className="text-lg font-bold">
                {integerFormatter.format(stats.totalProducts)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-black/10 p-2">
                  <ChartBarIcon
                    size={16}
                    weight="bold"
                    className="text-black/50"
                  />
                </div>
                <span className="text-sm font-normal text-black/75">
                  Total units
                </span>
              </div>
              <span className="text-lg font-bold">
                {integerFormatter.format(stats.totalUnits)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-black/10 bg-white p-6 shadow-lg shadow-black/10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 text-sm font-medium text-black/75 rounded-full bg-black/5 px-4 py-1">
                <ChartBarIcon size={20} />
                Revenue
              </div>
              <div>
                <h4>Revenue overview</h4>
                <span className="text-sm text-black/75">
                  {revenueDescription}
                </span>
              </div>
            </div>
            <div className="inline-flex gap-2 rounded-full bg-black/5 p-1">
              <button
                type="button"
                onClick={() => setRevenueView("monthly")}
                className={`rounded-full px-4 py-1 text-xs font-medium transition ${
                  revenueView === "monthly"
                    ? "bg-white shadow-sm"
                    : "text-black/50"
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setRevenueView("weekly")}
                className={`rounded-full px-4 py-1 text-xs font-medium transition ${
                  revenueView === "weekly"
                    ? "bg-white shadow-sm"
                    : "text-black/50"
                }`}
              >
                Weekly
              </button>
            </div>
          </div>
          <div className="mt-8">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  dataKey="label"
                  tick={{ fill: "#6B7280", fontSize: 12 }}
                  stroke="#D1D5DB"
                />
                <YAxis
                  tick={{ fill: "#6B7280", fontSize: 12 }}
                  tickFormatter={(value) => moneyFormatter.format(value)}
                  stroke="#D1D5DB"
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: "rgba(0,0,0,0.09)" }}
                />
                <Bar
                  dataKey="revenue"
                  fill="rgba(17,24,39,0.7)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-black/10 bg-white p-6 shadow-lg shadow-black/10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 text-sm font-medium text-black/75 rounded-full bg-black/5 px-4 py-1">
                <ReceiptIcon size={20} />
                Orders
              </div>
              <div>
                <h4>Recent orders</h4>
                <span className="text-sm text-black/75">
                  Latest customer purchases and totals.
                </span>
              </div>
            </div>
            <Link
              href="/admin?tab=orders"
              className="inline-flex items-center rounded-full bg-black/5 px-4 py-2 text-xs font-medium transition hover:bg-black/10"
            >
              View all
            </Link>
          </div>
          <div className="mt-8">
            {loadingActivity ? null : recentOrders.length ? (
              <div className="divide-y divide-black/10">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between py-2"
                  >
                    <div className="flex-1 space-y-1">
                      <div className="flex items-start">
                        <small className="inline-flex rounded-full bg-black/5 px-3 py-1 font-mono font-normal">
                          #{order.id.slice(0, 12)}
                        </small>
                      </div>
                      <small className="truncate text-black/50 font-normal">
                        {order.items[0]?.name}
                        {order.items[0]?.size && ` (${order.items[0].size})`}
                        {order.items.length > 1 &&
                          ` +${order.items.length - 1} more`}
                      </small>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-semibold tabular-nums">
                        {moneyFormatter.format(order.total)}
                      </span>
                      <small className="flex items-center justify-end gap-1 text-xs text-black/50 font-normal">
                        <ClockIcon size={12} />
                        {getTimeAgo(order.date)}
                      </small>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-16 text-center">
                <ReceiptIcon size={48} className="mx-auto mb-3 text-black/25" />
                <p className="text-sm text-black/50">No recent orders yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
