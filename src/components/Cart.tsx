"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/contexts/ToastContext";
import type { CartItem } from "@/types/product";
import {
  MinusIcon,
  PlusIcon,
  TrashSimpleIcon,
  PackageIcon,
} from "@phosphor-icons/react";
import Drawer from "./common/Drawer";
import Button from "./common/Button";

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

  const getItemId = () => {
    if (item._id) return item._id;
    return `${item.name}-${selectedSizes.join("-")}`;
  };

  const itemId = getItemId();

  // calculate if user can increase quantity based on stock
  const canIncrease = selectedSizes.every((sizeStr) => {
    const sizeData = item.sizes?.find((s) => s.size === sizeStr);
    if (!sizeData) return true;
    return quantity < sizeData.stock;
  });

  const handleIncreaseQuantity = () => {
    if (!canIncrease || !itemId) return;
    updateQuantity(itemId, quantity + 1, selectedSizes);
  };

  const handleDecreaseQuantity = () => {
    if (!itemId) return;
    if (quantity <= 1) return;
    updateQuantity(itemId, quantity - 1, selectedSizes);
  };

  const handleRemove = () => {
    if (!itemId) return;
    removeFromCart(itemId, selectedSizes);
  };

  const itemTotal = item.price * quantity;

  return (
    <div className="flex justify-between pb-4 border-b border-black/10">
      <div className="flex items-start gap-4">
        <div className="w-24 h-24 bg-black/10 overflow-hidden shrink-0">
          {item?.images ? (
            <Image
              src={item.images[0]}
              alt={item.name}
              width={100}
              height={100}
              className="object-contain"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-black/50">
              <PackageIcon size={32} weight="light" />
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <h3 className="text-lg font-heading">{item.name}</h3>
          <p className="text-sm text-black/70">Size: {selectedSizes}</p>
        </div>
      </div>
      <div className="flex flex-col justify-between">
        <p className="font-semibold">CHF {itemTotal.toFixed(2)}</p>
        <div className="w-fit inline-flex items-center border border-black/10">
          {quantity > 1 ? (
            <button
              onClick={handleDecreaseQuantity}
              className="p-2 bg-black/10 hover:bg-black/15"
              aria-label="Decrease quantity"
            >
              <MinusIcon size={16} weight="light" />
            </button>
          ) : (
            <button
              onClick={handleRemove}
              className="p-2 bg-black/10 hover:bg-black/15"
              aria-label="Remove item from cart"
            >
              <TrashSimpleIcon size={16} weight="light" />
            </button>
          )}

          <span className="text-sm font-body px-3 text-center bg-white">
            {quantity}
          </span>

          <button
            onClick={handleIncreaseQuantity}
            disabled={!canIncrease}
            className={`p-2 bg-black/10 ${
              !canIncrease
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-black/15"
            }`}
            aria-label="Increase quantity"
          >
            <PlusIcon size={16} weight="light" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const {
    items,
    updateQuantity,
    removeFromCart,
    getTotalPrice,
    clearCart,
    clearServerCart,
  } = useCart();
  const { showToast } = useToast();
  const { user } = useUser();
  const router = useRouter();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const subtotal = getTotalPrice();
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleClearCart = () => {
    if (items.length === 0) return;
    clearCart();
    clearServerCart().catch((error) => {
      console.error("Failed to clear server cart", error);
    });
    showToast("All items removed from cart", "success");
  };

  const handleCheckout = async () => {
    if (items.length === 0) return;

    // require login before checkout
    if (!user) {
      const returnUrl = window.location.pathname + window.location.search;
      sessionStorage.setItem("returnAfterLogin", returnUrl);

      router.push(`/sign-in?redirect_url=${encodeURIComponent(returnUrl)}`);
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

  const footerContent = items.length > 0 && (
    <>
      <div className="flex items-center justify-between mb-8">
        <p className="font-body">Subtotal</p>
        <span className="text-lg font-semibold">CHF {subtotal.toFixed(2)}</span>
      </div>
      <Button
        variant="primary"
        onClick={handleCheckout}
        disabled={isCheckingOut}
        className="w-full"
      >
        {isCheckingOut
          ? "Processing..."
          : user
          ? "Checkout"
          : "Sign in to checkout"}
      </Button>
    </>
  );

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={`${totalQuantity} ${totalQuantity === 1 ? "item" : "items"}`}
      footer={footerContent}
      ariaLabel="Shopping cart"
      headerActions={
        items.length > 0 ? (
          <button
            type="button"
            onClick={handleClearCart}
            disabled={isCheckingOut}
            className={`text-sm text-black/70 underline ${
              isCheckingOut ? "" : "hover:text-black"
            }`}
          >
            Clear cart
          </button>
        ) : null
      }
    >
      <div className="space-y-4">
        {items.length === 0 ? (
          <p className="text-center text-black/70">Your cart is empty.</p>
        ) : (
          items.map((item) => (
            <CartItemComponent
              key={`${item.id || item._id}-${item.selectedSizes}`}
              item={item}
              updateQuantity={updateQuantity}
              removeFromCart={removeFromCart}
            />
          ))
        )}
      </div>
    </Drawer>
  );
}
