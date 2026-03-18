"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { CartItem } from "@/types/product";
import { useCart } from "@/contexts/CartContext";
import Loading from "@/components/common/Loading";
import Button from "@/components/common/Button";

function SuccessPageContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { items: cartItems, clearCart } = useCart();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasProcessed, setHasProcessed] = useState(false);
  const [customerEmail, setCustomerEmail] = useState<string | null>(null);

  useEffect(() => {
    if (hasProcessed) return;

    if (!sessionId) {
      setLoading(false);
      setHasProcessed(true);
      return;
    }

    const saveOrderToDB = async () => {
      const clearAllCarts = () => {
        setHasProcessed(true);
        clearCart();
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
            setCustomerEmail(checkoutEmail);
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
          customerEmail: checkoutEmail ?? undefined,
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
    cartItems,
    clearCart,
    hasProcessed,
  ]);

  if (loading) {
    return <Loading message="Processing order..." />;
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-24">
      <div className="max-w-lg mx-auto text-center space-y-6">
        <p className="text-[11px] uppercase tracking-[0.3em] text-amber-700">
          Order confirmed
        </p>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-[-0.03em] text-black leading-tight">
          Thanks! Your coffee is on its way
        </h1>

        {sessionId && (
          <div className="border border-black/10 p-6 space-y-2 text-left">
            <p className="text-[11px] uppercase tracking-[0.25em] text-black/40">
              Confirmation
            </p>
            <p className="text-xs font-mono text-black/60 break-all">{sessionId}</p>
          </div>
        )}

        {error && (
          <div className="border border-red-200 bg-red-50 p-6 text-sm text-red-700">
            {error}
          </div>
        )}

        <p className="text-sm leading-7 text-neutral-500">
          {customerEmail ? (
            <>A confirmation will be sent to <span className="text-black">{customerEmail}</span>. </>
          ) : null}
          We&apos;ll send you tracking details as soon as your order ships.
        </p>

        <div className="flex justify-center gap-4 pt-2">
          <Button as="a" href="/collection" variant="primary">
            Continue shopping
          </Button>
          <Button as="a" href="/about" variant="secondary">
            Our story
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
