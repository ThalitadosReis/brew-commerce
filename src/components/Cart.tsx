"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useCart } from "@/contexts/CartContext";
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
    selectedSizes?: string[],
  ) => void;
  removeFromCart: (
    productId: string | number,
    selectedSizes?: string[],
  ) => void;
}

function getCartItemId(item: CartItem) {
  const selectedSizes = item.selectedSizes ?? [];
  if (item._id) return item._id;
  return `${item.name}-${selectedSizes.join("-")}`;
}

function formatPrice(amount: number) {
  return `CHF ${amount.toFixed(2)}`;
}

function CartItemComponent({
  item,
  updateQuantity,
  removeFromCart,
}: CartItemComponentProps) {
  const selectedSizes = item.selectedSizes ?? [];
  const quantity = item.quantity;
  const itemId = getCartItemId(item);

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
    <div className="flex gap-4 border-b border-black/8 py-5">
      <div className="h-20 w-20 shrink-0 overflow-hidden bg-black/5">
        {item?.images ? (
          <Image
            src={item.images[0]}
            alt={item.name}
            width={80}
            height={80}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-black/30">
            <PackageIcon size={20} />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-sm font-medium leading-snug text-black">
              {item.name}
            </p>
            {selectedSizes.length > 0 && (
              <p className="mt-0.5 text-xs uppercase tracking-[0.15em] text-black/40">
                {selectedSizes.join(", ")}
              </p>
            )}
          </div>
          <button
            onClick={handleRemove}
            className="shrink-0 text-black/25 transition-colors hover:text-black/60"
            aria-label="Remove item from cart"
          >
            <TrashSimpleIcon size={15} />
          </button>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center border border-black/15">
            <button
              onClick={handleDecreaseQuantity}
              className="flex h-7 w-7 items-center justify-center text-black/40 transition-colors hover:text-black"
              aria-label="Decrease quantity"
            >
              <MinusIcon size={11} />
            </button>
            <span className="w-7 text-center text-xs font-medium text-black">
              {quantity}
            </span>
            <button
              onClick={handleIncreaseQuantity}
              disabled={!canIncrease}
              className={`flex h-7 w-7 items-center justify-center transition-colors ${
                !canIncrease
                  ? "cursor-not-allowed opacity-30"
                  : "text-black/40 hover:text-black"
              }`}
              aria-label="Increase quantity"
            >
              <PlusIcon size={11} />
            </button>
          </div>
          <span className="text-sm font-medium text-black tabular-nums">
            {formatPrice(itemTotal)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, updateQuantity, removeFromCart, getTotalPrice } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutEmail, setCheckoutEmail] = useState("");

  const subtotal = getTotalPrice();
  const hasItems = items.length > 0;
  const normalizedCheckoutEmail = useMemo(
    () => checkoutEmail.trim(),
    [checkoutEmail],
  );

  const handleCheckout = async () => {
    if (!hasItems || !normalizedCheckoutEmail) return;
    setIsCheckingOut(true);
    try {
      const checkoutItems = items.map((item) => ({
        name: item.name,
        description: item.description,
        price: item.price,
        quantity: item.quantity,
        selectedSizes: item.selectedSizes,
      }));
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: checkoutItems,
          email: normalizedCheckoutEmail,
        }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Checkout failed");
      }
      const { url } = await response.json();
      if (url) window.location.href = url;
    } catch (error) {
      console.error("Checkout error:", error);
      setIsCheckingOut(false);
    }
  };

  const footerContent = hasItems && (
    <div className="space-y-5">
      <div className="space-y-1.5">
        <label
          htmlFor="cart-checkout-email"
          className="block text-[10px] uppercase tracking-[0.2em] text-black/40"
        >
          Email for order confirmation
        </label>
        <input
          id="cart-checkout-email"
          type="email"
          value={checkoutEmail}
          onChange={(e) => setCheckoutEmail(e.target.value)}
          placeholder="name@email.com"
          className="w-full border-b border-black/20 bg-transparent py-2 text-sm text-black placeholder:text-black/30 outline-none focus:border-black transition-colors"
        />
      </div>

      <div className="flex items-center justify-between border-t border-black/10 pt-4">
        <span className="text-xs uppercase tracking-[0.2em] text-black/40">
          Subtotal
        </span>
        <span className="text-base font-semibold tracking-[-0.02em] tabular-nums text-black">
          {formatPrice(subtotal)}
        </span>
      </div>
      <p className="text-xs text-black/40">Shipping calculated at checkout.</p>

      <Button
        variant="primary"
        onClick={handleCheckout}
        disabled={isCheckingOut || !normalizedCheckoutEmail}
        className="w-full disabled:opacity-50"
      >
        {isCheckingOut ? "Processing..." : "Checkout"}
      </Button>
      <button
        onClick={onClose}
        className="w-full text-center text-xs uppercase tracking-[0.2em] text-black/40 transition-colors hover:text-black/70"
      >
        Continue shopping
      </button>
    </div>
  );

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="your bag"
      footer={footerContent}
      ariaLabel="Shopping cart"
    >
      {!hasItems ? (
        <div className="flex h-full min-h-[50vh] flex-col items-center justify-center gap-5 text-center">
          <div className="space-y-1">
            <p className="text-sm font-medium text-black">Your bag is empty</p>
            <p className="text-xs text-black/40">
              Add something to get started.
            </p>
          </div>
          <Button
            as="link"
            href="/collection"
            variant="primary"
            onClick={onClose}
          >
            Browse collection
          </Button>
        </div>
      ) : (
        <div>
          {items.map((item) => (
            <CartItemComponent
              key={`${item.id || item._id}-${(item.selectedSizes ?? []).join("-")}`}
              item={item}
              updateQuantity={updateQuantity}
              removeFromCart={removeFromCart}
            />
          ))}
        </div>
      )}
    </Drawer>
  );
}
