"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

import { CheckIcon } from "@phosphor-icons/react";

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

type Order = {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: string;
};

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined" && sessionId) {
      const cartItems = localStorage.getItem("cart");

      if (cartItems) {
        const items: CartItem[] = JSON.parse(cartItems);

        const subtotal = items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );

        const shipping = subtotal >= 50 ? 0 : 4.5;
        const total = subtotal + shipping;

        const order: Order = {
          id: sessionId,
          date: new Date().toISOString(),
          items,
          subtotal,
          shipping,
          total,
          status: "completed",
        };

        const existingOrders = localStorage.getItem("orders");
        const orders: Order[] = existingOrders
          ? JSON.parse(existingOrders)
          : [];

        orders.unshift(order);
        localStorage.setItem("orders", JSON.stringify(orders));

        // clear cart and trigger events
        localStorage.removeItem("cart");
        localStorage.removeItem("brew-cart");
        window.dispatchEvent(new Event("cartCleared"));
        window.dispatchEvent(new Event("storage"));
      }
    }

    setLoading(false);
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-secondary">Processing your order...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/10 py-20">
      <div className="max-w-6xl mx-auto p-3">
        <div className="text-center py-20 px-4 sm:px-6 space-y-8">
          <CheckIcon size={48} weight="light" className="mx-auto mb-4" />
          <h1 className="font-display text-3xl lg:text-4xl text-primary mb-2">
            Order Successful!
          </h1>
          <p className="max-w-md mx-auto text-secondary/70">
            {`Thank you for your order. We've received your payment and will start
            processing it right away.`}
          </p>

          {sessionId && (
            <div className="max-w-md mx-auto bg-white rounded-xl p-8">
              <p className="text-sm text-accent mb-2">Order Confirmation</p>
              <p className="text-xs font-mono break-all">{sessionId}</p>
            </div>
          )}

          <p className="text-sm font-body mb-4">
            You will receive a confirmation email with tracking details shortly.
          </p>

          <Link
            href="/collection"
            className="inline-block text-sm font-body relative group"
          >
            Continue Shopping
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary" />
            <span className="absolute bottom-0 right-0 w-0 h-0.5 bg-neutral transition-all duration-300 ease-out group-hover:w-1/2" />
          </Link>
        </div>
      </div>
    </div>
  );
}
