"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useCart } from "@/contexts/CartContext";
import { getStripe } from "@/lib/stripe";

import { XIcon, MinusIcon, PlusIcon } from "@phosphor-icons/react";

export default function Cart({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { items, updateQuantity, removeFromCart, getTotalPrice } = useCart();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      const stripe = await getStripe();
      if (stripe && data.sessionId) {
        await stripe.redirectToCheckout({ sessionId: data.sessionId });
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const subtotal = getTotalPrice();
  const totalQuantity = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 h-screen"
          onClick={onClose}
        />
      )}
      <div
        className={`fixed top-4 right-4 w-[calc(100%-2rem)] md:w-[400px] bg-white rounded-2xl z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-[calc(100%+2rem)]"
        }`}
      >
        {/* header */}
        <div className="m-4 p-4 flex items-center justify-between bg-accent/10 rounded-lg">
          <h2 className="text-xl font-display">Cart ({totalQuantity})</h2>
          <button onClick={onClose}>
            <XIcon size={18} weight="light" className="hover:opacity-50" />
          </button>
        </div>

        {/* items */}
        <div className="flex-1 p-6 space-y-4 overflow-y-auto min-h-[50vh]">
          {items.length === 0 ? (
            <p className="text-center text-secondary/70">Your cart is empty.</p>
          ) : (
            items.map((item, index) => (
              <div
                key={`${item.id}-${item.selectedSizes?.join("-")}`}
                className={`flex justify-between pb-4 ${
                  index !== items.length - 1
                    ? "border-b border-secondary/10"
                    : ""
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="relative w-20 h-20 bg-secondary/10 rounded-lg overflow-hidden shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromCart(item.id, item.selectedSizes);
                      }}
                      className="absolute top-1 left-1 p-1 rounded-full bg-white hover:bg-white/70 z-10"
                      title="Remove item"
                    >
                      <XIcon size={12} className="hover:text-secondary/70" />
                    </button>

                    <Image
                      src={item.images[0]}
                      alt={item.name}
                      fill
                      sizes="w-22 h-22"
                      className="object-contain"
                    />
                  </div>

                  <div className="flex flex-col justify-between h-full">
                    <div>
                      <h3 className="font-display text-base">{item.name}</h3>
                      <p className="text-xs">
                        Size:{" "}
                        <span className="text-secondary/70">
                          {item.selectedSizes?.length
                            ? item.selectedSizes.join(", ")
                            : "—"}
                        </span>
                      </p>
                    </div>

                    <div
                      className="w-fit flex items-center px-2 py-1 gap-2 bg-accent/10 rounded"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateQuantity(
                            item.id,
                            Math.max(1, item.quantity - 1),
                            item.selectedSizes
                          );
                        }}
                      >
                        <MinusIcon
                          size={12}
                          weight="light"
                          className="hover:opacity-50"
                        />
                      </button>

                      <span className="text-sm font-medium w-6 text-center">
                        {item.quantity}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateQuantity(
                            item.id,
                            item.quantity + 1,
                            item.selectedSizes
                          );
                        }}
                      >
                        <PlusIcon
                          size={12}
                          weight="light"
                          className="hover:opacity-50"
                        />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col justify-between items-end">
                  <p className="text-sm font-body tracking-tight">
                    CHF{(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* footer */}
        <div className="m-4 p-6 bg-accent/10 rounded-lg">
          <div className="flex justify-between mb-3">
            <span className="text-sm text-secondary/70">Subtotal</span>
            <span className="font-display text-lg">
              CHF{subtotal.toFixed(2)}
            </span>
          </div>

          <button
            onClick={handleCheckout}
            disabled={loading || items.length === 0}
            className="w-full py-3  text-sm rounded-full bg-accent text-white hover:opacity-80 transition-colors disabled:opacity-50"
          >
            {loading ? "Processing..." : "Checkout"}
          </button>
        </div>
      </div>
    </>
  );
}
