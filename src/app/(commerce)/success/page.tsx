"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import type { CartItem } from "@/types/product";
import { useCart } from "@/contexts/CartContext";
import Loading from "@/components/common/Loading";
import Button from "@/components/common/Button";

function SuccessPageContent() {
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
            user?.primaryEmailAddress?.emailAddress ??
            checkoutEmail ??
            undefined,
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
    <div className="min-h-screen bg-black/5 flex items-center justify-center">
      <div className="px-6 text-center space-y-4">
        <h3 className="text-lg md:text-2xl lg:text-3xl font-semibold">
          Thanks, {userName}!
          <br />
          We received your order
        </h3>

        {sessionId && (
          <div className="bg-white p-8 space-y-2">
            <p className="text-sm">Your order confirmation:</p>
            <small className="text-xs font-mono break-all">{sessionId}</small>
          </div>
        )}

        {error && (
          <div className="bg-white p-8 text-red-600">{error}</div>
        )}

        <p className="text-sm font-light">
          You will receive a confirmation email with tracking details as your
          items ship.
        </p>

        <div className="flex justify-center">
          <Button as="link" href="/collection" variant="tertiary">
            Continue shopping
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<Loading message="Processing order..." />}>
      <SuccessPageContent />
    </Suspense>
  );
}
