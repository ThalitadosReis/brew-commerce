"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useCart } from "@/contexts/CartContext";
import type { CartItem } from "@/types/product";
import {
  MinusIcon,
  PlusIcon,
  ArrowRightIcon,
  ShoppingBagIcon,
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
    <div className="flex gap-4 border-b border-black/5 py-4">
      <div className="flex h-24 w-24 items-center justify-center overflow-hidden bg-black/10 shrink-0">
        {item?.images ? (
          <Image
            src={item.images[0]}
            alt={item.name}
            width={80}
            height={96}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-black/40">
            <PackageIcon size={24} />
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-base leading-tight text-black">{item.name}</p>
            {selectedSizes.length > 0 && (
              <p className="mt-1 text-xs text-black/45">
                {selectedSizes.join(", ")}
              </p>
            )}
          </div>
          <button
            onClick={handleRemove}
            className="ml-2 shrink-0 text-black/25 transition-colors hover:text-black/60"
            aria-label="Remove item from cart"
          >
            <TrashSimpleIcon size={16} weight="light" />
          </button>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 border border-black/15 px-2 py-1">
            <button
              onClick={handleDecreaseQuantity}
              className="text-black/45 transition-colors hover:text-black"
              aria-label="Decrease quantity"
            >
              <MinusIcon size={12} weight="light" />
            </button>
            <span className="w-5 text-center text-xs font-medium text-black/70">
              {quantity}
            </span>
            <button
              onClick={handleIncreaseQuantity}
              disabled={!canIncrease}
              className={`transition-colors ${
                !canIncrease
                  ? "cursor-not-allowed opacity-40"
                  : "text-black/45 hover:text-black"
              }`}
              aria-label="Increase quantity"
            >
              <PlusIcon size={12} weight="light" />
            </button>
          </div>
          <span className="shrink-0 text-sm font-medium text-black">
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
  const checkoutLabel = isCheckingOut ? "Processing..." : "Checkout";

  const handleCheckout = async () => {
    if (!hasItems) return;
    if (!normalizedCheckoutEmail) {
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

      // call checkout API
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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

      // redirect to Stripe checkout
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error("Checkout error:", error);
      setIsCheckingOut(false);
    }
  };

  const footerContent = hasItems && (
    <div className="-m-6 space-y-4 bg-black/5 p-6">
      <div className="space-y-2">
        <label
          htmlFor="cart-checkout-email"
          className="block text-xs uppercase tracking-[0.18em] text-black/45"
        >
          Email
        </label>
        <input
          id="cart-checkout-email"
          type="email"
          value={checkoutEmail}
          onChange={(event) => setCheckoutEmail(event.target.value)}
          placeholder="name@email.com"
          className="w-full border border-black/10 bg-white px-4 py-3 text-sm text-black placeholder:text-black/30 focus:outline-none"
        />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm">Subtotal</span>
        <span className="text-lg">{formatPrice(subtotal)}</span>
      </div>
      <p className="text-sm text-black/50">
        Shipping is calculated at checkout.
      </p>
      <Button
        variant="primary"
        onClick={handleCheckout}
        disabled={isCheckingOut || !normalizedCheckoutEmail}
        className="group w-full transition-colors disabled:opacity-50"
      >
        {checkoutLabel}
      </Button>
      <button
        onClick={onClose}
        className="w-full text-center text-sm text-black/40 transition-colors hover:text-black/65"
      >
        Continue shopping
      </button>
    </div>
  );

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={
        <span className="inline-flex items-center gap-2">
          <ShoppingBagIcon size={18} weight="light" className="text-black/70" />
          <span>Your bag</span>
        </span>
      }
      footer={footerContent}
      ariaLabel="Shopping cart"
    >
      <div className="space-y-4">
        {!hasItems ? (
          <div className="flex h-full min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black/5">
              <ShoppingBagIcon
                size={28}
                weight="thin"
                className="text-black/35"
              />
            </div>
            <p className="text-sm text-black/50">Your bag is empty</p>

            <Button
              as="link"
              href="/collection"
              variant="primary"
              onClick={onClose}
            >
              Continue shopping
            </Button>
          </div>
        ) : (
          items.map((item) => (
            <CartItemComponent
              key={`${item.id || item._id}-${(item.selectedSizes ?? []).join("-")}`}
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
