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
            <ShoppingBag className="h-24 w-24 text-onyx/20 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-onyx mb-4 uppercase font-primary">
              Your Cart is Empty
            </h2>
            <p className="text-onyx/70 mb-8 max-w-md mx-auto">
              Looks like you haven&#39;t added anything to your cart yet.
              <br />
              Start exploring our collection!
            </p>
            <Link
              href="/collection"
              className="uppercase font-primary text-sm inline-flex items-center gap-2 bg-onyx text-white px-8 py-3 border-1 hover:bg-white hover:text-onyx transition-colors"
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
    <div className="min-h-screen py-20 mt-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* header */}
        <div className="space-y-4 mb-8">
          <Link
            href="/collection"
            className="inline-flex items-center gap-2 text-onyx/70 hover:text-onyx transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Continue Shopping
          </Link>
          <h1 className="uppercase font-primary text-4xl lg:text-5xl">
            Shopping Cart
          </h1>
          <p className="text-onyx/70">
            {quantity} item{quantity !== 1 ? "s" : ""} in your cart
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* cart items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="border border-onyx/10">
                <div className="flex gap-4">
                  <div className="relative w-28 md:w-48 bg-gray/10">
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
                      <h3 className="font-primary text-xl font-semibold text-onyx">
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
                            className="text-sm px-4 py-2 pr-10 border border-onyx/20 bg-white 
                     focus:outline-none focus:ring-2 focus:ring-serene appearance-none text-onyx"
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
                            <ChevronDown className="w-5 h-5 text-onyx/60" />
                          </div>
                        </div>

                        {/* remove button */}
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-onyx/40 hover:text-onyx transition-colors"
                          title="Remove item"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-sm text-onyx/70 mt-2">
                      {item.description}
                    </p>

                    {/* price */}
                    <div className="flex justify-between items-center mt-6">
                      <div className="text-left">
                        <div className="text-xs md:text-sm text-onyx/70">
                          CHF{item.price.toFixed(2)} each
                        </div>
                        <div className="text-lg md:text-xl font-bold">
                          CHF{(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                      <div className="relative md:hidden self-start">
                        <select
                          value={item.quantity}
                          onChange={(e) =>
                            updateQuantity(item.id, Number(e.target.value))
                          }
                          className="text-sm px-4 py-2 pr-8 border border-onyx/20 bg-white 
                 focus:outline-none focus:ring-2 focus:ring-serene appearance-none text-onyx"
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
                          <ChevronDown className="w-5 h-5 text-onyx/60" />
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
            <h2 className="hidden lg:block text-2xl font-semibold text-onyx uppercase font-primary">
              Order Summary
            </h2>

            {/* details */}
            <div className="space-y-3">
              <div className="flex justify-between text-onyx/70">
                <span>
                  Subtotal (
                  {items.reduce((sum, item) => sum + item.quantity, 0)} items)
                </span>
                <span>CHF{getTotalPrice().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-onyx/70">
                <span>Shipping</span>
                <span>{getTotalPrice() < 50 ? "CHF4.50" : "Free"}</span>
              </div>

              <div className="border-t border-onyx/10 pt-3">
                <div className="flex justify-between text-xl font-bold text-onyx">
                  <span>Total</span>
                  <span>CHF{getTotalPrice().toFixed(2)}</span>
                </div>
              </div>
            </div>

            <button className="w-full bg-onyx text-white py-4 hover:bg-gray transition-colors font-medium uppercase font-primary text-sm mb-4">
              Proceed to Checkout
            </button>

            <p className="text-xs text-onyx/50 text-center">
              Powered by Stripe
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
