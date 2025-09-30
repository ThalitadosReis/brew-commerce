"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import {
  ShoppingBag,
  ArrowLeft,
  X,
  ChevronDown,
} from "lucide-react";
import Image from "next/image";

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, getTotalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen py-20 mt-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center py-20">
            <ShoppingBag className="h-24 w-24 text-neutral mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-primary mb-4 uppercase font-display">
              Your Cart is Empty
            </h2>
            <p className="text-accent mb-8 max-w-md mx-auto">
              Looks like you haven&#39;t added anything to your cart yet.
              <br />
              Start exploring our collection!
            </p>
            <Link
              href="/collection"
              className="uppercase font-display text-sm inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-full hover:bg-secondary transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const quantity = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-muted/5 py-20 mt-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* header */}
        <div className="space-y-4 mb-8">
          <Link
            href="/collection"
            className="inline-flex items-center gap-2 text-accent hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Continue Shopping
          </Link>
          <h1 className="uppercase font-display text-4xl lg:text-5xl text-primary">
            Shopping Cart
          </h1>
          <p className="text-accent">
            {quantity} item{quantity !== 1 ? "s" : ""} in your cart
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* cart items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="border border-neutral rounded-3xl overflow-hidden">
                <div className="flex gap-4">
                  <div className="relative w-28 md:w-48 bg-neutral/50">
                    <Image
                      src="/mockup-coffee.png"
                      alt={item.name}
                      fill
                      className="object-contain"
                    />
                  </div>

                  {/* product details */}
                  <div className="flex-1 flex flex-col p-3">
                    <div className="flex flex-row justify-between items-center">
                      <h3 className="font-display text-xl font-semibold text-primary">
                        {item.name}
                      </h3>

                      <div className="flex items-center gap-4 self-end md:self-auto">
                        {/* qty dropdown md */}
                        <div className="relative hidden md:block">
                          <select
                            value={item.quantity}
                            onChange={(e) =>
                              updateQuantity(item.id, Number(e.target.value))
                            }
                            className="text-sm px-4 py-2 pr-10 border border-neutral rounded-lg bg-white
                     focus:outline-none focus:ring-1 focus:ring-accent appearance-none text-primary"
                          >
                            {Array.from({ length: 10 }, (_, i) => i + 1).map(
                              (num) => (
                                <option key={num} value={num}>
                                  {num}
                                </option>
                              )
                            )}
                          </select>
                          <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                            <ChevronDown className="w-5 h-5 text-accent" />
                          </div>
                        </div>

                        {/* remove button */}
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-accent hover:text-primary transition-colors"
                          title="Remove item"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-sm text-accent mt-2">
                      {item.description}
                    </p>

                    {/* price */}
                    <div className="flex justify-between items-center mt-6">
                      <div className="text-left">
                        <div className="text-xs md:text-sm text-accent">
                          CHF{item.price.toFixed(2)} each
                        </div>
                        <div className="text-lg md:text-xl font-bold text-primary">
                          CHF{(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                      <div className="relative md:hidden self-start">
                        <select
                          value={item.quantity}
                          onChange={(e) =>
                            updateQuantity(item.id, Number(e.target.value))
                          }
                          className="text-sm px-4 py-2 pr-8 border border-neutral rounded-lg bg-white
                 focus:outline-none focus:ring-1 focus:ring-accent appearance-none text-primary"
                        >
                          {Array.from({ length: 10 }, (_, i) => i + 1).map(
                            (num) => (
                              <option key={num} value={num}>
                                {num}
                              </option>
                            )
                          )}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                          <ChevronDown className="w-5 h-5 text-accent" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* order summary */}
          <div className="lg:col-span-1 space-y-8">
            <h2 className="hidden lg:block text-2xl font-semibold text-primary uppercase font-display">
              Order Summary
            </h2>

            {/* details */}
            <div className="space-y-3">
              <div className="flex justify-between text-accent">
                <span>
                  Subtotal (
                  {items.reduce((sum, item) => sum + item.quantity, 0)} items)
                </span>
                <span>CHF{getTotalPrice().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-accent">
                <span>Shipping</span>
                <span>{getTotalPrice() < 50 ? "CHF4.50" : "Free"}</span>
              </div>

              <div className="border-t border-neutral pt-3">
                <div className="flex justify-between text-xl font-bold text-primary">
                  <span>Total</span>
                  <span>CHF{getTotalPrice().toFixed(2)}</span>
                </div>
              </div>
            </div>

            <button className="w-full bg-primary text-white rounded-full py-4 hover:bg-secondary transition-colors font-medium uppercase font-display text-sm mb-4">
              Proceed to Checkout
            </button>

            <p className="text-xs text-accent text-center">
              Powered by Stripe
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
