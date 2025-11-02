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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from "@/contexts/ToastContext";
import { Badge } from "@/components/ui/badge";

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
  const { showToast } = useToast();

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
            const { images: rawImages, image, ...rest } = item;

            const normalizedImages = new Set<string>();
            if (Array.isArray(rawImages)) {
              rawImages
                .filter(Boolean)
                .forEach((img) => normalizedImages.add(img));
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

  useEffect(() => {
    if (error) {
      showToast(error, "error");
    }
  }, [error, showToast]);

  if (loading) return <Loading message="Loading profile..." />;

  return (
    <div className="bg-black/5 pt-48 pb-24 space-y-12">
      <header className="max-w-7xl mx-auto px-8">
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="grid h-24 w-24 place-items-center overflow-hidden rounded-full ring-1 ring-inset ring-black/25 bg-white">
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
              <UserIcon size={32} className="text-black/25" weight="light" />
            )}
          </div>
          <div>
            <h5>{firstName}</h5>
            {email && <p>{email}</p>}
          </div>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-8">
        <div className="mb-4">
          <h5>Order history</h5>
          <span>Tap a row to view details</span>
        </div>

        {orders.length > 0 ? (
          <div className="space-y-4">
            <Accordion
              type="single"
              collapsible
              value={openOrderId ?? undefined}
              onValueChange={(value) => setOpenOrderId(value ?? null)}
              className="space-y-4"
            >
              {paginated.map((order) => {
                const totalItems = itemCount(order.items);
                return (
                  <AccordionItem
                    key={order.id}
                    value={order.id}
                    className="group overflow-hidden border border-black/10 bg-white"
                  >
                    <AccordionTrigger className="px-8 py-4 text-left">
                      <div className="flex w-full items-center justify-between gap-4">
                        <div className="min-w-0 flex-1 space-y-2">
                          <div className="flex items-center gap-4">
                            <span className="truncate text-black">
                              #{order.id.slice(0, 12)}…
                            </span>
                            <Badge className="rounded-full bg-black/5 text-black/75 border-transparent">
                              {totalItems} item{totalItems !== 1 ? "s" : ""}
                            </Badge>{" "}
                          </div>
                          <small className="text-black/50">
                            {fmtDate(order.date)}
                          </small>
                        </div>
                        <span className="text-lg font-semibold">
                          {fmtCHF(order.total)}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="border-t border-black/10">
                      <div className="space-y-4 p-8">
                        <div className="space-y-4">
                          <h6>Items</h6>
                          {order.items.map((item, idx) => (
                            <div
                              key={`${item.productId ?? item.id ?? idx}-${idx}`}
                              className="flex gap-4 border-b border-black/10 pb-4"
                            >
                              <div className="grid h-24 w-24 shrink-0 place-items-center overflow-hidden bg-black/5">
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
                                <h6>{item.name}</h6>
                                <div className="flex flex-col">
                                  <small>
                                    {item.quantity} × {item.size || "—"}
                                  </small>
                                  {item.quantity > 1 && (
                                    <small className="text-black/75">
                                      {fmtCHF(item.price)} each
                                    </small>
                                  )}
                                </div>
                              </div>
                              <div className="text-right">
                                <p>{fmtCHF(item.price * item.quantity)}</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="space-y-2">
                          <h6>Summary</h6>
                          <div className="flex justify-between">
                            <span className="text-black/75">
                              Subtotal ({totalItems} item
                              {totalItems !== 1 ? "s" : ""})
                            </span>
                            <span>{fmtCHF(order.subtotal)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-black/75">Shipping</span>
                            <span>
                              {order.shipping === 0
                                ? "Free"
                                : fmtCHF(order.shipping)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-semibold">Total</span>
                            <span className="font-semibold">
                              {fmtCHF(order.total)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>

            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="inline-flex items-center gap-2 text-sm font-medium hover:text-black/75 disabled:cursor-not-allowed disabled:opacity-50"
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
                  className="inline-flex items-center gap-2 text-sm font-medium hover:text-black/75 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next <CaretRightIcon size={16} />
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white px-6 py-24 text-center">
            <div className="mx-auto mb-4 grid h-20 w-20 place-items-center bg-black/5">
              <PackageIcon size={24} className="text-black/50" />
            </div>
            <h6>No orders yet</h6>
            <p>Start exploring our collection to place your first order.</p>
            <div className="flex justify-center mt-4">
              <Button as="link" href="/collection" variant="tertiary">
                Start shopping
              </Button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
