"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { CaretRightIcon } from "@phosphor-icons/react";
import Loading from "@/components/common/Loading";
import { useCart } from "@/contexts/CartContext";
import type { CartItem } from "@/types/product";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { user, isLoaded: userLoaded } = useUser();
  const { items: cartItems, clearCart, clearServerCart } = useCart();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasProcessed, setHasProcessed] = useState(false);

  useEffect(() => {
    if (hasProcessed) return;

    if (!sessionId) {
      setLoading(false);
      setHasProcessed(true);
      return;
    }

    if (!userLoaded) return;

    const saveOrderToDB = async () => {
      const clearAllCarts = () => {
        setHasProcessed(true);
        clearCart();
        clearServerCart().catch((err) =>
          console.error("Failed to clear server cart", err)
        );
      };

      const itemsSource: CartItem[] = (() => {
        if (cartItems && cartItems.length > 0) return cartItems;
        try {
          const saved = window.localStorage.getItem("brew-cart");
          if (!saved) return [];
          const parsed = JSON.parse(saved) as CartItem[];
          if (Array.isArray(parsed)) return parsed;
        } catch (storageError) {
          console.error("Failed to read fallback cart data", storageError);
        }
        return [];
      })();

      if (itemsSource.length === 0) {
        clearAllCarts();
        setLoading(false);
        return;
      }

      try {
        const formattedItems = itemsSource.map((item) => ({
          productId: item.id || item._id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          size: item.selectedSizes?.[0] || "default",
          image: item.images?.[0] || "",
        }));

        const subtotal = formattedItems.reduce((sum, item) => {
          const lineTotal =
            Number.isFinite(item.price) && Number.isFinite(item.quantity)
              ? item.price * item.quantity
              : 0;
          return sum + lineTotal;
        }, 0);

        let shippingAddress: Record<string, string | undefined> | null = null;
        let checkoutEmail: string | null = null;
        try {
          const sessionRes = await fetch(
            `/api/checkout/session?session_id=${encodeURIComponent(sessionId)}`
          );

          if (sessionRes.ok) {
            const sessionData = await sessionRes.json();
            shippingAddress = sessionData.shippingAddress ?? null;
            checkoutEmail = sessionData.customerEmail ?? null;
          } else if (sessionRes.status === 404) {
            shippingAddress = null;
          }
        } catch (addressError) {
          console.error("Failed to retrieve shipping address", addressError);
        }

        const orderPayload = {
          sessionId,
          items: formattedItems,
          subtotal,
          shipping: subtotal >= 50 ? 0 : 4.5,
          total: subtotal >= 50 ? subtotal : subtotal + 4.5,
          userId: user?.id,
          customerEmail:
            user?.primaryEmailAddress?.emailAddress ?? checkoutEmail ?? undefined,
          shippingAddress,
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
              clearAllCarts();
              return;
            }
          } catch {
            setError("Failed to create order. Please contact support.");
          }

          return;
        }

        await response.json();
        clearAllCarts();
      } catch (err) {
        console.error("Error saving order:", err);
        setError("Unexpected error occurred while processing order.");
      } finally {
        setHasProcessed(true);
        setLoading(false);
      }
    };

    saveOrderToDB();
  }, [
    sessionId,
    user,
    userLoaded,
    cartItems,
    clearCart,
    clearServerCart,
    hasProcessed,
  ]);

  const userName = user?.firstName || "";

  if (loading) {
    return <Loading message="Processing order..." />;
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
