"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Button from "@/components/common/Button";
import {
  UserIcon,
  PackageIcon,
  CaretLeftIcon,
  CaretRightIcon,
} from "@phosphor-icons/react";

import type { ApiOrder, OrderItem as ApiOrderItem } from "@/types/orders";
import Loading from "@/components/common/Loading";

type UiOrderItem = Omit<ApiOrderItem, "images"> & { images: string[] };

type UiRecentOrder = {
  id: string;
  date: string;
  items: UiOrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  customerEmail?: string;
};

type Props = {
  firstName: string;
  email: string;
  imageUrl?: string | null;
};

export default function ProfileClient({ firstName, email, imageUrl }: Props) {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<UiRecentOrder[]>([]);
  const [openOrderId, setOpenOrderId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const ordersPerPage = 9;

  useEffect(() => {
    let cancelled = false;

    async function fetchOrders() {
      if (!email) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `/api/orders/user?email=${encodeURIComponent(email)}`,
          { cache: "no-store" }
        );
        if (!res.ok) throw new Error(`Failed to load orders (${res.status})`);

        const data: { orders?: ApiOrder[] } = await res.json();

        const mapped: UiRecentOrder[] = (data?.orders ?? []).map((o) => {
          const items: UiOrderItem[] = (o.items ?? []).map((item) => {
            const {
              images: rawImages,
              image,
              ...rest
            } = item;

            const normalizedImages = new Set<string>();
            if (Array.isArray(rawImages)) {
              rawImages.filter(Boolean).forEach((img) => normalizedImages.add(img));
            } else if (typeof rawImages === "string" && rawImages) {
              normalizedImages.add(rawImages);
            }
            if (image) normalizedImages.add(image);

            return {
              ...rest,
              image,
              images: Array.from(normalizedImages),
            };
          });

          const subtotal =
            items.reduce(
              (s, it) => s + (it.price ?? 0) * (it.quantity ?? 0),
              0
            ) || 0;
          const total = o.total ?? subtotal;
          const shipping = Math.max(0, total - subtotal);

          // Safe, stable id
          const safeId =
            (o.sessionId && String(o.sessionId)) ||
            (o._id && String(o._id)) ||
            (typeof crypto !== "undefined" && crypto.randomUUID()) ||
            `order-${Math.random().toString(36).slice(2)}`;

          return {
            id: safeId,
            date: String(o.createdAt ?? new Date().toISOString()),
            items,
            subtotal,
            shipping,
            total,
            customerEmail: o.customerEmail,
          };
        });

        if (!cancelled) setOrders(mapped);
      } catch (e) {
        if (!cancelled) {
          const errMsg =
            e instanceof Error ? e.message : "Something went wrong";
          setError(errMsg);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchOrders();
    return () => {
      cancelled = true;
    };
  }, [email]);

  const fmtCHF = (n: number) =>
    new Intl.NumberFormat("de-CH", {
      style: "currency",
      currency: "CHF",
    }).format(n);

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleString("en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const totalPages = Math.max(1, Math.ceil(orders.length / ordersPerPage));
  const paginated = useMemo(
    () =>
      orders.slice(
        (currentPage - 1) * ordersPerPage,
        currentPage * ordersPerPage
      ),
    [orders, currentPage]
  );

  const itemCount = (items: UiOrderItem[]) =>
    items.reduce((t, i) => t + (i.quantity ?? 0), 0);
  const toggleOrder = (id: string) =>
    setOpenOrderId((prev) => (prev === id ? null : id));

  if (loading) return <Loading message="Loading profile..." />;

  return (
    <div className="min-h-screen bg-black/5 py-24 space-y-24">
      <header className="max-w-5xl mx-auto px-6 pt-12">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="grid h-24 w-24 place-items-center overflow-hidden rounded-full ring-1 ring-inset ring-black/20 bg-white">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={firstName}
                title={firstName}
                width={96}
                height={96}
                className="h-full w-full object-cover"
              />
            ) : (
              <UserIcon size={32} className="text-black/30" weight="light" />
            )}
          </div>
          <h1 className="text-2xl font-semibold font-heading">{firstName}</h1>
          {email && <p className="text-sm text-black/70">{email}</p>}
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6">
        <div className="mb-4">
          <h2 className="text-xl font-heading font-semibold">Order history</h2>
          <p className="text-sm text-black/70">Tap a row to view details</p>
        </div>

        {error && (
          <div className="mb-6 border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {orders.length > 0 ? (
          <div className="space-y-4">
            {paginated.map((order) => {
              const isOpen = openOrderId === order.id;
              const panelId = `panel-${order.id}`;
              return (
                <div
                  key={order.id}
                  className="border border-black/10 bg-white overflow-hidden"
                >
                  <button
                    onClick={() => toggleOrder(order.id)}
                    className="group w-full px-6 py-4 text-left flex items-center justify-between focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-center gap-3">
                        <span className="truncate text-sm font-medium text-black/70">
                          #{order.id.slice(0, 8)}…
                        </span>
                        <span className="rounded-full bg-black/5 px-3 py-1 text-xs text-black/70">
                          {itemCount(order.items)} item
                          {itemCount(order.items) !== 1 ? "s" : ""}
                        </span>
                      </div>
                      <p className="text-xs text-black/50">
                        {fmtDate(order.date)}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-lg font-semibold">
                        {fmtCHF(order.total)}
                      </span>
                      <CaretRightIcon
                        size={18}
                        className={`opacity-50 transition-transform ${
                          isOpen ? "rotate-90" : "group-hover:translate-x-0.5"
                        }`}
                      />
                    </div>
                  </button>

                  <div
                    id={panelId}
                    role="region"
                    aria-label={`Order ${order.id} details`}
                    className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="min-h-0 overflow-hidden border-t border-black/10">
                      <div className="p-5 space-y-4">
                        <div className="space-y-4">
                          <h4 className="text-sm font-semibold">Items</h4>
                          {order.items.map((item, idx) => (
                            <div
                              key={`${item.productId ?? item.id ?? idx}-${idx}`}
                              className="flex gap-4 border-b border-black/10 pb-4"
                            >
                              <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden bg-black/5 grid place-items-center">
                                {item.images[0] ? (
                                  <Image
                                    src={item.images[0]}
                                    alt={item.name}
                                    width={96}
                                    height={96}
                                    className="h-full w-full object-contain"
                                  />
                                ) : (
                                  <PackageIcon
                                    size={20}
                                    weight="light"
                                    className="text-black/30"
                                  />
                                )}
                              </div>
                              <div className="flex-1 space-y-1">
                                <h5 className="font-heading font-semibold">
                                  {item.name}
                                </h5>
                                <p className="text-xs text-black/50">
                                  {item.quantity} × {item.size || "—"}
                                </p>
                                {item.quantity > 1 && (
                                  <p className="text-xs text-black/50">
                                    {fmtCHF(item.price)} each
                                  </p>
                                )}
                              </div>
                              <div className="text-right">
                                <p className="font-semibold">
                                  {fmtCHF(item.price * item.quantity)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="space-y-2">
                          <h4 className="mb-2 text-base font-semibold">
                            Summary
                          </h4>
                          <div className="flex justify-between text-sm">
                            <span className="text-black/50">
                              Subtotal ({itemCount(order.items)} item
                              {itemCount(order.items) !== 1 ? "s" : ""})
                            </span>
                            <span>{fmtCHF(order.subtotal)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-black/50">Shipping</span>
                            <span>
                              {order.shipping === 0
                                ? "Free"
                                : fmtCHF(order.shipping)}
                            </span>
                          </div>
                          <div className="flex justify-between pt-4">
                            <span className="text-base font-semibold">
                              Total
                            </span>
                            <span className="text-lg font-semibold">
                              {fmtCHF(order.total)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="inline-flex items-center gap-2 text-sm font-medium hover:text-black/70 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <CaretLeftIcon size={16} />
                  Previous
                </button>
                <span className="text-sm text-black/50">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="inline-flex items-center gap-2 text-sm font-medium hover:text-black/70 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next <CaretRightIcon size={16} />
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="border border-black/20 bg-white px-6 py-24 text-center">
            <div className="mx-auto mb-4 grid h-16 w-16 place-items-center bg-black/5">
              <PackageIcon size={24} weight="light" className="text-black/50" />
            </div>
            <h3 className="mb-1 text-lg font-medium">No orders yet</h3>
            <p className="mb-6 text-black/70">
              Start exploring our collection to place your first order.
            </p>
            <Button as="link" href="/collection" variant="tertiary">
              Start shopping
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}
