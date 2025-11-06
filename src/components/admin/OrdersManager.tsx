"use client";

import { Fragment, useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import {
  CalendarIcon,
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
import { useToast } from "@/contexts/ToastContext";
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
  const { showToast } = useToast();

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

      if (response.status === 404) {
        throw new Error("Orders API route not found (404).");
      }

      if (!response.ok) {
        throw new Error(
          `Failed to fetch orders: ${response.status} ${response.statusText}`
        );
      }

      const data: OrdersResponse = await response.json();
      if (!Array.isArray(data.orders)) {
        throw new Error("Invalid order data from API");
      }

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
      console.error("Error fetching orders:", err);
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  }, [token, showToast]);

  const filterOrders = useCallback(() => {
    if (!searchTerm) {
      setFilteredOrders(orders);
      return;
    }

    const query = searchTerm.toLowerCase();
    const filtered = orders.filter(
      (order) =>
        order.id.toLowerCase().includes(query) ||
        order.items.some((item) => item.name.toLowerCase().includes(query))
    );
    setFilteredOrders(filtered);
  }, [orders, searchTerm]);

  const toggleOrderExpanded = (orderId: string) => {
    setExpandedOrder((prev) => (prev === orderId ? null : orderId));
  };

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated || user?.role !== "admin") {
      router.replace("/admin-login");
      return;
    }
    fetchOrders();
  }, [authLoading, isAuthenticated, user, router, fetchOrders]);

  useEffect(() => {
    filterOrders();
  }, [filterOrders]);

  if (authLoading) {
    return <Loading message="Checking admin permissions..." />;
  }

  if (!user || user.role !== "admin") {
    return <Loading message="Redirecting..." />;
  }

  if (loading) {
    return <Loading message="Fetching orders..." />;
  }

  if (error) {
    return (
      <div className="px-4 py-10 text-black lg:px-6">
        <div className="mx-auto max-w-md space-y-4 rounded-3xl border border-red-200 bg-white p-8 text-center shadow-lg shadow-black/10">
          <XCircleIcon size={48} className="mx-auto text-red-500" />
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Error loading orders</h3>
            <p className="text-sm text-red-500/80">{error}</p>
          </div>
          <button
            type="button"
            onClick={fetchOrders}
            className="inline-flex items-center justify-center rounded-full border border-red-500 bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  const ordersCount = filteredOrders.length;

  return (
    <section className="space-y-10 text-black">
      <header className="rounded-2xl border border-black/10 bg-white p-8 shadow-lg shadow-black/10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="space-y-4">
            <small className="inline-flex uppercase text-black/75 font-normal rounded-full bg-black/5 px-4 py-1 tracking-[0.16em]">
              Management
            </small>
            <div className="space-y-2">
              <h2 className="leading-tight!">Orders Overview</h2>
              <p className="max-w-xl">
                Track every customer order, spot priorities instantly, and keep
                deliveries moving smoothly.
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="overflow-hidden rounded-2xl border border-black/10 bg-white p-8 shadow-lg shadow-black/10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold text-black">
              Order history
            </h3>
            <p className="text-xs text-black/60">
              Complete list of customer orders with details.
            </p>
          </div>
          <div className="relative w-full sm:w-80">
            <MagnifyingGlassIcon
              size={16}
              weight="bold"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-black/40"
            />
            <input
              type="text"
              placeholder="Search by order ID or product..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="w-full rounded-full border border-black/20 bg-white px-3 py-2 pl-9 text-sm text-black outline-none focus:ring-1 focus:ring-black/25"
            />
          </div>
        </div>

        {ordersCount > 0 ? (
          <div className="mt-8 overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-black/5 text-xs uppercase tracking-wide text-black/75">
                <tr>
                  <th className="px-6 py-3 font-semibold">Order ID</th>
                  <th className="hidden px-6 py- font-semibold sm:table-cell">
                    Date
                  </th>
                  <th className="hidden px-6 py-3 font-semibold sm:table-cell">
                    Items
                  </th>
                  <th className="hidden px-6 py-3 font-semibold sm:table-cell">
                    Total
                  </th>
                  <th className="px-6 py-3 font-semibold" />
                </tr>
              </thead>
              <tbody className="divide-y divide-black/10">
                {filteredOrders.map((order) => {
                  const isExpanded = expandedOrder === order.id;
                  const shipping = order.shippingAddress;
                  const hasShippingAddress =
                    shipping &&
                    Object.values(shipping).some((value) =>
                      typeof value === "string"
                        ? value.trim().length > 0
                        : Boolean(value)
                    );
                  const totalItems = order.items.reduce(
                    (sum, item) => sum + item.quantity,
                    0
                  );
                  const formattedDate = new Date(order.date).toLocaleDateString(
                    "en-US",
                    { year: "numeric", month: "short", day: "numeric" }
                  );

                  return (
                    <Fragment key={order.id}>
                      <tr
                        className="cursor-pointer transition hover:bg-black/2"
                        onClick={() => toggleOrderExpanded(order.id)}
                      >
                        <td className="p-4">
                          <small className="inline-flex rounded-full bg-black/5 px-4 py-1 font-mono font-normal">
                            #{order.id.slice(0, 12)}
                          </small>
                        </td>
                        <td className="hidden sm:table-cell">
                          <div className="flex items-center gap-1 text-sm text-black/75 font-normal">
                            <CalendarIcon size={16} />
                            {formattedDate}
                          </div>
                        </td>
                        <td className="hidden sm:table-cell">
                          <div className="flex items-center gap-1 text-sm text-black/75 font-normal">
                            <PackageIcon size={16} />
                            {totalItems} items
                          </div>
                        </td>
                        <td className="hidden sm:table-cell">
                          <div className="font-semibold text-black tabular-nums">
                            CHF {order.total.toFixed(2)}
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              toggleOrderExpanded(order.id);
                            }}
                            aria-expanded={isExpanded}
                            aria-label={
                              isExpanded
                                ? "Collapse order details"
                                : "Expand order details"
                            }
                          >
                            <CaretDownIcon
                              size={16}
                              className={`transition-transform ${
                                isExpanded ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                        </td>
                      </tr>

                      {isExpanded && (
                        <tr>
                          <td colSpan={5} className="bg-black/2 p-4">
                            <div className="grid lg:grid-cols-2 gap-8">
                              <div className="space-y-4">
                                <span className="flex items-center gap-2 font-semibold">
                                  <UserIcon
                                    size={16}
                                    weight="bold"
                                    className="text-black/50"
                                  />
                                  Customer details
                                </span>

                                <div className="space-y-4 rounded-lg border border-black/10 bg-white p-4 shadow-sm">
                                  <div>
                                    <div className="flex items-center gap-2 text-xs text-black/50 font-normal">
                                      <EnvelopeIcon size={16} />
                                      <span className="uppercase tracking-wide">
                                        Email
                                      </span>
                                    </div>
                                    <span className="wrap-break-word text-sm font-normal">
                                      {order.customerEmail || "Unknown"}
                                    </span>
                                  </div>

                                  <div className="h-px bg-black/10" />

                                  <div>
                                    <div className="flex items-center gap-2 text-xs text-black/50 font-normal">
                                      <UserIcon size={16} />
                                      <span className="uppercase tracking-wide">
                                        Recipient
                                      </span>
                                    </div>
                                    <span className="wrap-break-word text-sm font-normal">
                                      {shipping?.name || "Not provided"}
                                    </span>
                                  </div>

                                  <div className="h-px bg-black/10" />

                                  <div>
                                    <div className="flex items-center gap-2 text-xs text-black/50 font-normal">
                                      <MapPinIcon size={16} />
                                      <span className="uppercase tracking-wide">
                                        Shipping address
                                      </span>
                                    </div>
                                    {hasShippingAddress && shipping ? (
                                      <div className="flex flex-col text-sm font-normal">
                                        {[shipping.line1, shipping.line2]
                                          .filter(Boolean)
                                          .map((line, index) => (
                                            <span
                                              key={`${order.id}-addr-${index}`}
                                            >
                                              {line}
                                            </span>
                                          ))}
                                        <span>
                                          {[shipping.postal_code, shipping.city]
                                            .filter(Boolean)
                                            .join(" ")}
                                        </span>
                                        {shipping.country && (
                                          <span>{shipping.country}</span>
                                        )}
                                      </div>
                                    ) : (
                                      <span className="wrap-break-word text-sm font-normal">
                                        No shipping address provided.
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-4">
                                <div className="flex items-center gap-2 text-sm font-semibold text-black">
                                  <span className="flex items-center gap-2 font-semibold">
                                    <ReceiptIcon
                                      size={16}
                                      weight="bold"
                                      className="text-black/50"
                                    />
                                    Order items
                                  </span>
                                </div>

                                <div className="space-y-4 rounded-lg border border-black/10 bg-white p-4 shadow-sm">
                                  {order.items.map((item) => (
                                    <div
                                      key={`${order.id}-${item.productId}-${item.size}`}
                                      className="flex gap-4"
                                    >
                                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-black/10">
                                        {item.image ? (
                                          <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            className="object-cover"
                                            sizes="64px"
                                            unoptimized
                                          />
                                        ) : (
                                          <div className="grid h-full w-full place-items-center text-black/50">
                                            <PackageIcon size={24} />
                                          </div>
                                        )}
                                      </div>
                                      <div className="flex-1">
                                        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
                                          <div>
                                            <span className="block truncate text-sm font-semibold">
                                              {item.name}
                                            </span>
                                            <span className="block text-xs text-black/50">
                                              Quantity: {item.quantity}
                                            </span>
                                            <span className="block text-xs text-black/50">
                                              Size: {item.size || "N/A"}
                                            </span>
                                          </div>
                                          <span className="text-sm font-medium tabular-nums sm:text-right">
                                            CHF{" "}
                                            {(
                                              item.price * item.quantity
                                            ).toFixed(2)}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  ))}

                                  <div className="h-px bg-black/10" />
                                  <div className="space-y-2 text-sm">
                                    <div className="flex justify-between font-normal">
                                      <span className="text-black/50">
                                        Subtotal
                                      </span>
                                      <span className="tabular-nums">
                                        CHF {order.subtotal.toFixed(2)}
                                      </span>
                                    </div>
                                    <div className="flex justify-between font-normal">
                                      <span className="text-black/50">
                                        Shipping
                                      </span>
                                      <span className="tabular-nums">
                                        CHF {order.shipping.toFixed(2)}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="h-px bg-black/10" />
                                  <div className="flex justify-between text-sm font-semibold">
                                    <span>Total paid</span>
                                    <span className="tabular-nums">
                                      CHF {order.total.toFixed(2)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mt-16 flex flex-col items-center gap-4 py-16 text-center">
            <ReceiptIcon size={48} className="text-black/25" />
            <div className="space-y-1">
              <h5>No orders found</h5>
              <p className="text-sm text-black/50">
                {searchTerm
                  ? "No orders match your search criteria."
                  : "Orders will appear here once customers complete their purchases."}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
