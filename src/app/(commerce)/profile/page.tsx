"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import type { ApiOrder, RecentOrder, OrderItem } from "@/types/orders";
import Button from "@/components/common/Button";
import {
  UserIcon,
  CaretLeftIcon,
  CaretRightIcon,
  PackageIcon,
} from "@phosphor-icons/react";

export default function ProfilePage() {
  const { user, isSignedIn } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<RecentOrder[]>([]);
  const [openOrderId, setOpenOrderId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 9;

  useEffect(() => {
    if (!isSignedIn) return router.push("/homepage");

    const fetchOrders = async () => {
      const email = user?.primaryEmailAddress?.emailAddress;
      if (!email) return setLoading(false);

      try {
        setLoading(true);
        const res = await fetch(
          `/api/orders/user?email=${encodeURIComponent(email)}`
        );
        if (res.ok) {
          const data = await res.json();
          const mappedOrders: RecentOrder[] = (data.orders || []).map(
            (order: ApiOrder) => ({
              id: order.sessionId || order._id || "",
              date: order.createdAt || "",
              items: (order.items || []).map((item: OrderItem) => ({
                id: item.id,
                name: item.name,
                quantity: item.quantity,
                size: item.size || "",
                price: item.price,
                image: item.images,
              })),
              subtotal: order.items
                ? order.items.reduce(
                    (sum, item) => sum + item.price * item.quantity,
                    0
                  )
                : 0,
              shipping:
                order.total !== undefined && order.items
                  ? order.total -
                    order.items.reduce(
                      (sum, item) => sum + item.price * item.quantity,
                      0
                    )
                  : 0,
              total: order.total || 0,
              customerEmail: order.customerEmail,
            })
          );
          setOrders(mappedOrders);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isSignedIn, user, router]);

  // Close any open accordion with ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenOrderId(null);
    };
    if (openOrderId) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openOrderId]);

  const totalPages = Math.ceil(orders.length / ordersPerPage) || 1;
  const paginatedOrders = orders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );

  const getTotalItemCount = (items: OrderItem[]) =>
    items.reduce((total, item) => total + item.quantity, 0);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black/5">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-black/20 border-t-black/70 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-black/70 text-sm font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  const userName = user.firstName || "User";
  const userEmail = user.primaryEmailAddress?.emailAddress || "";

  const toggleOrder = (orderId: string) => {
    setOpenOrderId((prev) => (prev === orderId ? null : orderId));
  };

  return (
    <div className="min-h-screen bg-black/5 py-24 space-y-24">
      <div className="max-w-5xl mx-auto px-6 pt-12">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="grid h-24 w-24 place-items-center overflow-hidden rounded-full ring-1 ring-inset ring-black/20 bg-white">
            {user.imageUrl ? (
              <Image
                src={user.imageUrl}
                alt={userName}
                title={userName}
                width={96}
                height={96}
                className="h-full w-full object-cover"
              />
            ) : (
              <UserIcon size={32} className="text-black/20" weight="light" />
            )}
          </div>
          <h1 className="mb-1 text-2xl font-semibold font-heading">
            {userName}
          </h1>
          <p className="text-sm text-black/70">{userEmail}</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6">
        <div className="mb-4">
          <h2 className="text-xl font-heading font-semibold">Order history</h2>
          <p className="text-sm text-black/70">Tap a row to view details</p>
        </div>

        {orders.length > 0 ? (
          <div className="space-y-4">
            {paginatedOrders.map((order: RecentOrder) => {
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
                          {getTotalItemCount(order.items)} item
                          {getTotalItemCount(order.items) !== 1 ? "s" : ""}
                        </span>
                      </div>
                      <p className="text-xs text-black/50">
                        {new Date(order.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-semibold">
                        CHF {order.total.toFixed(2)}
                      </span>
                      <CaretRightIcon
                        size={18}
                        className={`opacity-50 transition-transform ${
                          isOpen ? "rotate-90" : "group-hover:translate-x-0.5"
                        }`}
                      />
                    </div>
                  </button>

                  {/* accordion */}
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={panelId}
                    className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="min-h-0 overflow-hidden border-t border-black/10">
                      <div className="p-5 space-y-4">
                        <div className="text-sm">
                          {new Date(order.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>

                        <div className="space-y-4">
                          <h4 className="text-sm font-semibold">Items</h4>
                          {order.items.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex gap-4 border-b border-black/10 pb-4"
                            >
                              <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden bg-black/5 grid place-items-center">
                                {item.images ? (
                                  <Image
                                    src={item.images[0]}
                                    alt={item.name}
                                    title={item.name}
                                    width={80}
                                    height={80}
                                    className="h-full w-full object-contain"
                                  />
                                ) : (
                                  <PackageIcon
                                    size={20}
                                    weight="light"
                                    className="text-black/20"
                                  />
                                )}
                              </div>
                              <div className="flex-1 space-y-1">
                                <h5 className="font-heading font-semibold">
                                  {item.name}
                                </h5>
                                <p className="text-xs text-black/50">
                                  {item.quantity} × {item.size}
                                </p>
                                {item.quantity > 1 && (
                                  <p className="text-xs text-black/50">
                                    CHF {item.price.toFixed(2)} each
                                  </p>
                                )}
                              </div>
                              <div className="text-right">
                                <p className="font-semibold">
                                  CHF {(item.price * item.quantity).toFixed(2)}
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
                              Subtotal ({getTotalItemCount(order.items)} item
                              {getTotalItemCount(order.items) !== 1 ? "s" : ""})
                            </span>
                            <span>
                              CHF {(order.subtotal || order.total).toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-black/50">Shipping</span>
                            <span>
                              {order.shipping === 0
                                ? "Free"
                                : `CHF ${order.shipping.toFixed(2)}`}
                            </span>
                          </div>
                          <div className="flex justify-between pt-4">
                            <span className="text-base font-semibold">
                              Total
                            </span>
                            <span className="text-lg font-semibold">
                              CHF {order.total.toFixed(2)}
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
              <div className="flex items-center justify-between">
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
                  Next
                  <CaretRightIcon size={16} />
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
      </div>
    </div>
  );
}
