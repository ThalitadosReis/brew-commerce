"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/contexts/ToastContext";
import type { CartItem } from "@/types/product";
import { XIcon, MinusIcon, PlusIcon, CoffeeIcon } from "@phosphor-icons/react";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CartItemComponentProps {
  item: CartItem;
  updateQuantity: (
    productId: string | number,
    quantity: number,
    selectedSizes?: string[]
  ) => void;
  removeFromCart: (
    productId: string | number,
    selectedSizes?: string[]
  ) => void;
}

function CartItemComponent({
  item,
  updateQuantity,
  removeFromCart,
}: CartItemComponentProps) {
  const selectedSizes = item.selectedSizes ?? [];
  const quantity = item.quantity;
  const itemId = item.id || item._id || "";

  // calculate if user can increase quantity based on stock
  const canIncrease = selectedSizes.every((sizeStr) => {
    const sizeData = item.sizes?.find((s) => s.size === sizeStr);
    if (!sizeData) return true;
    return quantity < sizeData.stock;
  });

  const handleIncreaseQuantity = () => {
    if (!canIncrease) return;
    updateQuantity(itemId, quantity + 1, selectedSizes);
  };

  const handleDecreaseQuantity = () => {
    updateQuantity(itemId, Math.max(1, quantity - 1), selectedSizes);
  };

  const itemTotal = item.price * quantity;

  return (
    <div className="flex justify-between pb-4 border-b border-black/10">
      <div className="flex items-start gap-4">
        <div className="relative w-24 h-24 bg-black/10 overflow-hidden shrink-0">
          <button
            onClick={() => removeFromCart(itemId, selectedSizes)}
            className="absolute p-1 bg-white hover:bg-black/20 z-10"
            title="Remove item"
            aria-label="Remove item from cart"
          >
            <XIcon size={12} />
          </button>
          {item.images?.[0] ? (
            <Image
              src={item.images[0]}
              alt={item.name}
              fill
              sizes="80px"
              className="object-contain"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-black/50">
              <CoffeeIcon size={32} weight="light" />
            </div>
          )}
        </div>

        <div className="flex flex-col justify-between h-full">
          <div>
            <h3 className="text-lg font-heading">{item.name}</h3>
            <p className="text-xs text-black/70">
              Size: {selectedSizes.join(", ")}
            </p>
          </div>

          <div className="inline-flex items-center gap-2 mt-1">
            <button
              onClick={handleDecreaseQuantity}
              disabled={quantity <= 1}
              className={quantity <= 1 ? "opacity-30 cursor-not-allowed" : ""}
              aria-label="Decrease quantity"
            >
              <MinusIcon
                size={12}
                className={quantity > 1 ? "hover:opacity-50" : ""}
              />
            </button>

            <span className="text-sm w-8 text-center">{quantity}</span>

            <button
              onClick={handleIncreaseQuantity}
              disabled={!canIncrease}
              className={!canIncrease ? "opacity-30 cursor-not-allowed" : ""}
              aria-label="Increase quantity"
            >
              <PlusIcon
                size={12}
                className={canIncrease ? "hover:opacity-50" : ""}
              />
            </button>
          </div>
        </div>
      </div>

      <p className="font-semibold">CHF {itemTotal.toFixed(2)}</p>
    </div>
  );
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, updateQuantity, removeFromCart, getTotalPrice } = useCart();
  const { showToast } = useToast();
  const { user } = useUser();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const subtotal = getTotalPrice();
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = async () => {
    if (items.length === 0) return;

    // require login before checkout
    if (!user) {
      const returnUrl = window.location.pathname + window.location.search;
      sessionStorage.setItem("returnAfterLogin", returnUrl);

      window.location.href = `/sign-in?redirect_url=${encodeURIComponent(
        returnUrl
      )}`;
      return;
    }

    setIsCheckingOut(true);

    try {
      // prepare items for checkout
      const checkoutItems = items.map((item) => ({
        name: item.name,
        description: item.description,
        price: item.price,
        quantity: item.quantity,
        selectedSizes: item.selectedSizes,
      }));

      // get user email
      const email = user.primaryEmailAddress?.emailAddress;
      if (!email) {
        throw new Error("User email is required for checkout");
      }

      // call checkout API
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: checkoutItems,
          email,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Checkout failed");
      }

      const { url } = await response.json();

      // redirect to Stripe checkout
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error("Checkout error:", error);
      showToast(
        error instanceof Error
          ? error.message
          : "Failed to initiate checkout. Please try again.",
        "error"
      );
      setIsCheckingOut(false);
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="h-screen fixed inset-0 z-40 bg-black/30"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <div
        className={`fixed top-0 right-0 h-screen w-full md:w-[400px] bg-white z-50 transform transition-transform duration-300 flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        {/* header */}
        <div className="flex items-center justify-between p-6 border-b border-black/10 flex-shrink-0">
          <h2 className="text-2xl font-heading">Cart ({totalQuantity})</h2>
          <button
            onClick={onClose}
            className="hover:opacity-50"
            aria-label="Close cart"
          >
            <XIcon size={18} />
          </button>
        </div>

        {/* items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {items.length === 0 ? (
            <p className="text-center text-black/70">Your cart is empty.</p>
          ) : (
            items.map((item) => (
              <CartItemComponent
                key={`${item.id || item._id}-${item.selectedSizes?.join("-")}`}
                item={item}
                updateQuantity={updateQuantity}
                removeFromCart={removeFromCart}
              />
            ))
          )}
        </div>

        {/* footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-black/10 flex-shrink-0 sticky bottom-0 bg-white">
            <div className="flex justify-between items-center mb-6">
              <p className="font-body">Subtotal</p>
              <span className="text-lg font-semibold">
                CHF {subtotal.toFixed(2)}
              </span>
            </div>
            <button
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="w-full py-3 text-sm font-semibold text-white bg-black hover:opacity-70 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCheckingOut
                ? "Processing..."
                : user
                ? "Checkout"
                : "Sign in to checkout"}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
