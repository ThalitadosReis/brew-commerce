"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { CaretRightIcon } from "@phosphor-icons/react";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { user } = useUser();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionId || typeof window === "undefined" || !user) {
      setLoading(false);
      return;
    }

    const saveOrderToDB = async () => {
      try {
        const cartItems = localStorage.getItem("brew-cart");
        if (!cartItems) {
          setLoading(false);
          return;
        }

        await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: cartItems,
        });

        localStorage.removeItem("brew-cart");
        window.dispatchEvent(new Event("cartCleared"));
        window.dispatchEvent(new Event("storage"));
      } catch (error) {
        console.error("Error saving order to DB:", error);
      } finally {
        setLoading(false);
      }
    };

    saveOrderToDB();
  }, [sessionId, user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4" />
          <p>Processing your order...</p>
        </div>
      </div>
    );
  }

  const userName = user?.firstName || "User";

  return (
    <div className="min-h-screen bg-black/10 flex items-center justify-center">
      <div className="px-6 text-center space-y-8">
        <h2 className="text-4xl lg:text-5xl font-heading">
          Thanks, {userName}
          <br /> We received your order
        </h2>

        {sessionId && (
          <div className="bg-white p-8 space-y-4">
            <p className="font-body">Your order confirmation:</p>
            <p className="text-xs font-mono break-all">{sessionId}</p>
          </div>
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
