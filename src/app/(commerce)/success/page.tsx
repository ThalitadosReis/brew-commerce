"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { CaretRightIcon } from "@phosphor-icons/react";
import { useCart } from "@/contexts/CartContext";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { user } = useUser();
  const { items: cartItems, clearCart } = useCart();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId || !user) {
      setLoading(false);
      return;
    }

    const saveOrderToDB = async () => {
      try {
        if (!cartItems || cartItems.length === 0) {
          setLoading(false);
          return;
        }

        const formattedItems = cartItems.map((item) => ({
          productId: item.id || item._id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          size: item.selectedSizes?.[0] || "default",
          image: item.images?.[0] || "",
        }));

        const subtotal = formattedItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );

        const orderPayload = {
          sessionId,
          items: formattedItems,
          subtotal,
          shipping: subtotal >= 50 ? 0 : 4.5,
          total: subtotal >= 50 ? subtotal : subtotal + 4.5,
          userId: user.id,
          customerEmail: user.primaryEmailAddress?.emailAddress,
        };

        const response = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderPayload),
        });

        if (!response.ok) {
          const text = await response.text();
          try {
            const json = JSON.parse(text);
            if (json.error === "Order already exists") {
              clearCart();
              setLoading(false);
              return;
            }
          } catch {
            setError("Failed to create order. Please contact support.");
          }

          setLoading(false);
          return;
        }

        await response.json();
        clearCart();
      } catch (err) {
        console.error("Error saving order:", err);
        setError("Unexpected error occurred while processing order.");
      } finally {
        setLoading(false);
      }
    };

    saveOrderToDB();
  }, [sessionId, user, cartItems, clearCart]);

  const userName = user?.firstName || "";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black/5">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-black/20 border-t-black/70 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-black/70 text-sm font-medium">
            Processing order...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black/10 flex items-center justify-center">
      <div className="px-6 text-center space-y-8">
        <h2 className="text-4xl lg:text-5xl font-heading">
          Thanks, {userName}
          <br />
          We received your order
        </h2>

        {sessionId && (
          <div className="bg-white p-8 space-y-4">
            <p className="font-body">Your order confirmation:</p>
            <p className="text-xs font-mono break-all">{sessionId}</p>
          </div>
        )}

        {error && (
          <div className="bg-white p-4 text-red-600 font-body">{error}</div>
        )}

        <p className="text-sm font-body">
          You will receive a confirmation email with tracking details as your
          items ship.
        </p>

        <Link
          href="/collection"
          className="inline-flex items-center gap-2 text-sm font-body relative group"
        >
          Continue shopping
          <CaretRightIcon className="transition-transform duration-300 ease-out group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}
