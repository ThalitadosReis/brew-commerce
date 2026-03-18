"use client";

import { Fragment, useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import {
  CaretDownIcon,
  EnvelopeIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  PackageIcon,
  ReceiptIcon,
  UserIcon,
  XCircleIcon,
} from "@phosphor-icons/react";

import type { ApiOrder, OrdersResponse, ShippingAddress } from "@/types/orders";
import { useAuth } from "@/contexts/AuthContext";
import Loading from "@/components/common/Loading";

type OrderItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  image?: string;
};

type Order = Required<
  Pick<ApiOrder, "sessionId" | "createdAt" | "subtotal" | "shipping" | "total">
> & {
  id: string;
  date: string;
  customerEmail?: string;
  shippingAddress?: ShippingAddress;
  items: OrderItem[];
};

export default function OrdersManager() {
  const { user, token, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/orders", {
        cache: "no-store",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (response.status === 404) throw new Error("Orders API route not found (404).");
      if (!response.ok) throw new Error(`Failed to fetch orders: ${response.status} ${response.statusText}`);

      const data: OrdersResponse = await response.json();
      if (!Array.isArray(data.orders)) throw new Error("Invalid order data from API");

      const transformedOrders: Order[] = data.orders.map((order) => {
        const createdAt = order.createdAt
          ? new Date(order.createdAt).toISOString()
          : new Date().toISOString();
        return {
          id: order.sessionId || order._id?.toString() || "N/A",
          sessionId: order.sessionId || "",
          createdAt,
          date: createdAt,
          items: (order.items || []).map((item) => ({
            productId: item.productId || "N/A",
            name: item.name || "Unnamed Product",
            price: item.price ?? 0,
            quantity: item.quantity ?? 1,
            size: item.size ?? "",
            image:
              Array.isArray(item.images) && item.images.length > 0
                ? item.images[0]
                : typeof item.image === "string"
                ? item.image
                : undefined,
          })),
          subtotal: order.subtotal ?? 0,
          shipping: order.shipping ?? 0,
          total: order.total ?? 0,
          customerEmail: order.customerEmail,
          shippingAddress: order.shippingAddress,
        };
      });
      setOrders(transformedOrders);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const filterOrders = useCallback(() => {
    if (!searchTerm) { setFilteredOrders(orders); return; }
    const query = searchTerm.toLowerCase();
    setFilteredOrders(
      orders.filter(
        (o) =>
          o.id.toLowerCase().includes(query) ||
          o.items.some((item) => item.name.toLowerCase().includes(query))
      )
    );
  }, [orders, searchTerm]);

  const toggleOrderExpanded = (orderId: string) =>
    setExpandedOrder((prev) => (prev === orderId ? null : orderId));

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated || user?.role !== "admin") { router.replace("/admin-login"); return; }
    fetchOrders();
  }, [authLoading, isAuthenticated, user, router, fetchOrders]);

  useEffect(() => { filterOrders(); }, [filterOrders]);

  if (authLoading) return <Loading message="Checking admin permissions..." />;
  if (!user || user.role !== "admin") return <Loading message="Redirecting..." />;
  if (loading) return <Loading message="Fetching orders..." />;

  if (error) {
    return (
      <div className="py-16 text-center space-y-4">
        <XCircleIcon size={40} className="mx-auto text-red-400" />
        <div>
          <p className="font-medium text-black">Failed to load orders</p>
          <p className="text-sm text-red-500 mt-1">{error}</p>
        </div>
        <button
          type="button"
          onClick={fetchOrders}
          className="text-xs uppercase tracking-[0.2em] border border-black/20 px-4 py-2 hover:bg-black/5 transition-colors"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <section className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-amber-700 mb-2">Orders</p>
          <h1 className="text-3xl font-semibold tracking-[-0.03em] text-black">
            Order management
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Track every customer order and keep deliveries moving.
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <MagnifyingGlassIcon
            size={14}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-black/30"
          />
          <input
            type="text"
            placeholder="Search by order ID or product..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-black/15 bg-white px-3 py-2 pl-9 text-sm text-black outline-none focus:border-black/30 transition-colors"
          />
        </div>
      </div>

      {/* Table */}
      <div className="border border-black/10 bg-white overflow-hidden">
        {filteredOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="border-b border-black/10">
                <tr>
                  <th className="px-5 py-3 text-[10px] uppercase tracking-[0.2em] text-black/40 font-medium">Order</th>
                  <th className="hidden sm:table-cell px-5 py-3 text-[10px] uppercase tracking-[0.2em] text-black/40 font-medium">Date</th>
                  <th className="hidden sm:table-cell px-5 py-3 text-[10px] uppercase tracking-[0.2em] text-black/40 font-medium">Items</th>
                  <th className="hidden sm:table-cell px-5 py-3 text-[10px] uppercase tracking-[0.2em] text-black/40 font-medium">Total</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {filteredOrders.map((order) => {
                  const isExpanded = expandedOrder === order.id;
                  const shipping = order.shippingAddress;
                  const hasShippingAddress =
                    shipping &&
                    Object.values(shipping).some((v) =>
                      typeof v === "string" ? v.trim().length > 0 : Boolean(v)
                    );
                  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
                  const formattedDate = new Date(order.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  });

                  return (
                    <Fragment key={order.id}>
                      <tr
                        className="cursor-pointer hover:bg-neutral-50 transition-colors"
                        onClick={() => toggleOrderExpanded(order.id)}
                      >
                        <td className="px-5 py-4">
                          <span className="text-xs font-mono text-black/60">
                            #{order.id.slice(0, 14)}
                          </span>
                        </td>
                        <td className="hidden sm:table-cell px-5 py-4 text-sm text-black/60">
                          {formattedDate}
                        </td>
                        <td className="hidden sm:table-cell px-5 py-4 text-sm text-black/60">
                          {totalItems} item{totalItems !== 1 ? "s" : ""}
                        </td>
                        <td className="hidden sm:table-cell px-5 py-4 text-sm font-medium text-black tabular-nums">
                          CHF {order.total.toFixed(2)}
                        </td>
                        <td className="px-5 py-4 text-right">
                          <CaretDownIcon
                            size={14}
                            className={`ml-auto text-black/40 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                          />
                        </td>
                      </tr>

                      <tr aria-hidden={!isExpanded}>
                        <td colSpan={5} className="p-0">
                          <div
                            className={`overflow-hidden transition-all duration-300 ease-in-out ${
                              isExpanded ? "max-h-[1200px] opacity-100" : "max-h-0 opacity-0"
                            }`}
                          >
                            <div className="bg-neutral-50 border-t border-black/10 px-5 py-6 grid gap-6 lg:grid-cols-2">
                              {/* Customer */}
                              <div className="space-y-3">
                                <p className="text-[10px] uppercase tracking-[0.25em] text-black/40">
                                  Customer
                                </p>
                                <div className="bg-white border border-black/10 divide-y divide-black/5">
                                  <div className="flex items-start gap-3 px-4 py-3">
                                    <EnvelopeIcon size={14} className="mt-0.5 text-black/30 shrink-0" />
                                    <div>
                                      <p className="text-[10px] uppercase tracking-[0.2em] text-black/30 mb-0.5">Email</p>
                                      <p className="text-sm text-black">{order.customerEmail || "Unknown"}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-start gap-3 px-4 py-3">
                                    <UserIcon size={14} className="mt-0.5 text-black/30 shrink-0" />
                                    <div>
                                      <p className="text-[10px] uppercase tracking-[0.2em] text-black/30 mb-0.5">Recipient</p>
                                      <p className="text-sm text-black">{shipping?.name || "Not provided"}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-start gap-3 px-4 py-3">
                                    <MapPinIcon size={14} className="mt-0.5 text-black/30 shrink-0" />
                                    <div>
                                      <p className="text-[10px] uppercase tracking-[0.2em] text-black/30 mb-0.5">Address</p>
                                      {hasShippingAddress && shipping ? (
                                        <div className="text-sm text-black space-y-0.5">
                                          {[shipping.line1, shipping.line2].filter(Boolean).map((line, i) => (
                                            <p key={i}>{line}</p>
                                          ))}
                                          <p>{[shipping.postal_code, shipping.city].filter(Boolean).join(" ")}</p>
                                          {shipping.country && <p>{shipping.country}</p>}
                                        </div>
                                      ) : (
                                        <p className="text-sm text-black/40">No address provided</p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Items + totals */}
                              <div className="space-y-3">
                                <p className="text-[10px] uppercase tracking-[0.25em] text-black/40">
                                  Items
                                </p>
                                <div className="bg-white border border-black/10 divide-y divide-black/5">
                                  {order.items.map((item) => (
                                    <div
                                      key={`${order.id}-${item.productId}-${item.size}`}
                                      className="flex gap-3 px-4 py-3"
                                    >
                                      <div className="relative h-12 w-12 shrink-0 overflow-hidden bg-black/5">
                                        {item.image ? (
                                          <Image src={item.image} alt={item.name} fill className="object-cover" sizes="48px" unoptimized />
                                        ) : (
                                          <div className="grid h-full w-full place-items-center">
                                            <PackageIcon size={16} className="text-black/30" />
                                          </div>
                                        )}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-black truncate">{item.name}</p>
                                        <p className="text-xs text-black/40">
                                          {item.size && `${item.size} · `}Qty {item.quantity}
                                        </p>
                                      </div>
                                      <p className="text-sm font-medium tabular-nums text-black shrink-0">
                                        CHF {(item.price * item.quantity).toFixed(2)}
                                      </p>
                                    </div>
                                  ))}
                                  <div className="px-4 py-3 space-y-1.5">
                                    <div className="flex justify-between text-xs text-black/50">
                                      <span>Subtotal</span>
                                      <span className="tabular-nums">CHF {order.subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-xs text-black/50">
                                      <span>Shipping</span>
                                      <span className="tabular-nums">CHF {order.shipping.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm font-semibold text-black border-t border-black/10 pt-1.5">
                                      <span>Total paid</span>
                                      <span className="tabular-nums">CHF {order.total.toFixed(2)}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-20 flex flex-col items-center gap-3 text-center">
            <ReceiptIcon size={32} className="text-black/20" />
            <div>
              <p className="text-sm font-medium text-black">No orders found</p>
              <p className="text-xs text-black/40 mt-0.5">
                {searchTerm
                  ? "No orders match your search."
                  : "Orders will appear here once customers check out."}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
