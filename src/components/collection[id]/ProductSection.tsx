"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { Product } from "@/types/product";
import { useCart } from "@/contexts/CartContext";

import {
  MinusIcon,
  PlusIcon,
  StarIcon,
  StarHalfIcon,
  PackageIcon,
  CaretRightIcon,
  CaretLeftIcon,
} from "@phosphor-icons/react";
import Button from "../common/Button";

const accordionItems = (product: Product | null) => [
  {
    title: "details",
    stateKey: "details",
    content: `Handpicked from ${product?.country}. Roasted in small batches to ensure peak flavor and quality. Each bean tells a story of its origin. Perfect for brewing with various methods including pour-over, French press, and espresso.`,
  },
  {
    title: "shipping",
    stateKey: "shipping",
    content: "Free shipping on orders over $50. Standard shipping times apply.",
  },
  {
    title: "returns",
    stateKey: "returns",
    content:
      "Returns accepted within 30 days of purchase. Product must be in its original condition and packaging.",
  },
];

interface ProductSectionProps {
  product: Product | null;
}

function CarouselThumbnails({
  images,
  productName,
  activeIndex,
  onSelect,
}: {
  images: string[];
  productName: string;
  activeIndex: number;
  onSelect: (index: number) => void;
}) {
  const touchStartRef = React.useRef<number | null>(null);

  const activeImage = images[activeIndex] ?? images[0];
  const showControls = images.length > 1;

  const handlePrevious = () =>
    onSelect((activeIndex - 1 + images.length) % images.length);

  const handleNext = () => onSelect((activeIndex + 1) % images.length);

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    touchStartRef.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartRef.current == null) return;
    const deltaX = event.changedTouches[0]?.clientX - touchStartRef.current;
    touchStartRef.current = null;
    if (!deltaX || Math.abs(deltaX) < 40) return;
    if (deltaX > 0) handlePrevious();
    else handleNext();
  };

  if (images.length === 0) {
    return (
      <div className="relative w-full aspect-square bg-neutral-100 flex items-center justify-center">
        <PackageIcon size={32} className="text-black/50" />
      </div>
    );
  }

  return (
    <div>
      {/* Main image */}
      <div
        className="relative w-full aspect-square bg-neutral-200 overflow-hidden group/carousel"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <Image
          src={activeImage!}
          alt={productName}
          fill
          sizes="(min-width: 1024px) 60vw, 100vw"
          className="object-cover"
        />

        {/* Thumbnails overlaid on left — desktop only */}
        {showControls && (
          <div className="hidden lg:flex absolute left-4 top-12 flex-col gap-2 z-10">
            {images.map((img, index) => {
              const isActive = activeIndex === index;
              return (
                <button
                  key={`${img}-${index}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(index);
                  }}
                  className={`relative w-[88px] h-[88px] overflow-hidden transition-all ${
                    isActive
                      ? "ring-2 ring-white"
                      : "opacity-60 hover:opacity-95"
                  }`}
                  aria-label={`View image ${index + 1}`}
                >
                  <Image
                    src={img}
                    alt={`${productName} thumbnail ${index + 1}`}
                    fill
                    sizes="88px"
                    className="object-cover"
                  />
                </button>
              );
            })}
          </div>
        )}

        {/* Hover navigation zones — show arrows on hover */}
        {showControls && (
          <>
            <div
              onClick={handlePrevious}
              className="absolute inset-y-0 left-0 w-1/2 flex items-center justify-start pl-4 cursor-pointer"
            >
              <CaretLeftIcon
                size={28}
                weight="bold"
                className="text-white drop-shadow-md opacity-0 group-hover/carousel:opacity-80 transition-opacity duration-200"
              />
            </div>
            <div
              onClick={handleNext}
              className="absolute inset-y-0 right-0 w-1/2 flex items-center justify-end pr-4 cursor-pointer"
            >
              <CaretRightIcon
                size={28}
                weight="bold"
                className="text-white drop-shadow-md opacity-0 group-hover/carousel:opacity-80 transition-opacity duration-200"
              />
            </div>
          </>
        )}
      </div>

      {/* Mobile thumbnails — horizontal strip below image */}
      {showControls && (
        <div className="flex lg:hidden gap-1.5 mt-1.5">
          {images.map((img, index) => {
            const isActive = activeIndex === index;
            return (
              <button
                key={`${img}-${index}`}
                onClick={() => onSelect(index)}
                className={`relative w-14 h-14 shrink-0 overflow-hidden bg-neutral-200 transition-opacity ${
                  isActive ? "opacity-100 ring-1 ring-black/40" : "opacity-50"
                }`}
                aria-label={`View image ${index + 1}`}
              >
                <Image
                  src={img}
                  alt={`${productName} thumbnail ${index + 1}`}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function ProductSection({ product }: ProductSectionProps) {
  const { addToCart, items } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showFloating, setShowFloating] = useState(false);
  const cartSectionRef = React.useRef<HTMLDivElement>(null);

  const productImages = useMemo(() => {
    if (!product) return [] as string[];
    if (!Array.isArray(product.images)) return [];
    return Array.from(
      new Set(
        product.images
          .filter((img): img is string => typeof img === "string")
          .map((img) => img.trim())
          .filter((img) => img.length > 0),
      ),
    );
  }, [product]);

  useEffect(() => {
    if (productImages.length === 0) {
      setActiveImageIndex(0);
      return;
    }
    setActiveImageIndex((current) =>
      current >= productImages.length ? productImages.length - 1 : current,
    );
  }, [productImages]);

  const getQuantityInCart = useMemo(
    () => (sizeToCheck: string) => {
      if (!product) return 0;
      const cartItem = items.find(
        (item) =>
          item.id === product._id &&
          JSON.stringify(item.selectedSizes) === JSON.stringify([sizeToCheck]),
      );
      return cartItem ? cartItem.quantity : 0;
    },
    [product, items],
  );

  const selectedSizeOption = useMemo(() => {
    if (!product || !selectedSize) return null;
    return product.sizes.find((s) => s.size === selectedSize);
  }, [product, selectedSize]);

  const availableStock = useMemo(() => {
    if (!selectedSizeOption || !selectedSize) return 0;
    return selectedSizeOption.stock - getQuantityInCart(selectedSize);
  }, [selectedSizeOption, selectedSize, getQuantityInCart]);

  const isOutOfStock = availableStock <= 0;
  const displayPrice = selectedSizeOption?.price ?? product?.price ?? 0;
  const canIncreaseQuantity = quantity < availableStock;

  React.useEffect(() => {
    if (selectedSize && isOutOfStock) {
      setSelectedSize(null);
      setQuantity(1);
    }
  }, [selectedSize, isOutOfStock]);

  React.useEffect(() => {
    setActiveImageIndex(0);
  }, [product?._id]);

  useEffect(() => {
    const el = cartSectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowFloating(!entry!.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleAddToCart = () => {
    if (!product || !selectedSize || !selectedSizeOption) return;

    const currentQuantityInCart = getQuantityInCart(selectedSize);
    const newTotalQuantity = currentQuantityInCart + quantity;

    if (newTotalQuantity > selectedSizeOption.stock) {
      setQuantity(1);
      return;
    }

    if (selectedSizeOption.stock < quantity) {
      setQuantity(1);
      return;
    }

    addToCart(product, [selectedSize], quantity);
    setQuantity(1);
  };

  const handleQuantityIncrease = () => {
    if (canIncreaseQuantity) setQuantity(quantity + 1);
  };

  const handleQuantityDecrease = () => {
    setQuantity(Math.max(1, quantity - 1));
  };

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
    setQuantity(1);
  };

  const toggleSection = (key: string) => {
    setOpenSection((prev) => (prev === key ? null : key));
  };

  if (!product) return null;

  return (
    <div ref={cartSectionRef} className="max-w-7xl mx-auto pb-12 lg:pb-24">
      <div className="grid lg:grid-cols-[3fr_2fr] lg:gap-12">
        {/* Image — left, no padding so it goes edge-to-edge */}
        <div>
          <CarouselThumbnails
            images={productImages}
            productName={product.name}
            activeIndex={activeImageIndex}
            onSelect={setActiveImageIndex}
          />
        </div>

        {/* Info — right */}
        <div className="space-y-6 px-4 md:px-6 lg:px-0 lg:pr-6 pt-6 lg:pt-0">
          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-light tracking-tight">
            {product.name}
          </h1>

          {/* Price + stars */}
          <div className="flex items-center gap-4">
            <span className="text-xl font-medium">
              CHF {displayPrice.toFixed(2)}
            </span>
            <div className="flex items-center gap-1.5">
              <div className="flex items-center">
                <StarIcon size={14} weight="fill" />
                <StarIcon size={14} weight="fill" />
                <StarIcon size={14} weight="fill" />
                <StarIcon size={14} weight="fill" />
                <StarHalfIcon size={14} weight="fill" />
              </div>
              <span className="text-sm text-black/60">(31 Reviews)</span>
            </div>
          </div>

          {/* Origin */}
          <p className="text-sm text-black/60">
            {product.country} · Single Origin
          </p>

          {/* Description */}
          <div className="border-y border-black/10 py-5">
            <p className="text-sm leading-relaxed text-black/75">
              {product.description}
            </p>
          </div>

          {/* Size selector */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium">Size</p>
              {selectedSize && selectedSizeOption && (
                <small className="flex items-center text-black/50">
                  <span className="w-1.5 h-1.5 bg-black rounded-full inline-block mr-2" />
                  {availableStock} in stock
                </small>
              )}
            </div>
            <div className="flex gap-2 flex-wrap">
              {product.sizes.map((sizeOption) => {
                const sizeAvailableStock =
                  sizeOption.stock - getQuantityInCart(sizeOption.size);
                const sizeOutOfStock = sizeAvailableStock <= 0;
                return (
                  <button
                    key={sizeOption.size}
                    onClick={() => handleSizeSelect(sizeOption.size)}
                    disabled={sizeOutOfStock}
                    className={`px-5 py-3 text-xs font-medium transition-colors ${
                      sizeOutOfStock
                        ? "border border-black/20 text-black/40 cursor-not-allowed"
                        : selectedSize === sizeOption.size
                          ? "bg-black text-white"
                          : "bg-black/10 hover:bg-black/15"
                    }`}
                  >
                    {sizeOption.size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity + Add to cart */}
          <div className="space-y-3">
            <div className="flex gap-2">
              {/* Quantity */}
              <div className="flex items-center border border-black/15">
                <button
                  onClick={handleQuantityDecrease}
                  disabled={quantity <= 1}
                  className="px-4 py-3 text-black/60 hover:text-black disabled:opacity-30 transition"
                >
                  <MinusIcon size={16} weight="light" />
                </button>
                <span className="px-4 text-sm min-w-12 text-center">
                  {quantity}
                </span>
                <button
                  onClick={handleQuantityIncrease}
                  disabled={!canIncreaseQuantity}
                  className="px-4 py-3 text-black/60 hover:text-black disabled:opacity-30 transition"
                >
                  <PlusIcon size={16} weight="light" />
                </button>
              </div>

              {/* Add to cart */}
              <Button
                variant="primary"
                onClick={handleAddToCart}
                disabled={!selectedSize || isOutOfStock}
                className="flex-1"
              >
                {!selectedSize
                  ? "Select size"
                  : isOutOfStock
                    ? "Out of stock"
                    : `Add to cart · CHF ${displayPrice.toFixed(2)}`}
              </Button>
            </div>

            <p className="text-xs text-center text-black/50">
              Free shipping on orders over CHF 50
            </p>
          </div>

          {/* Accordion */}
          <div className="border-t border-black/10 divide-y divide-black/10">
            {accordionItems(product).map((item) => {
              const isOpen = openSection === item.stateKey;
              return (
                <div key={item.stateKey}>
                  <button
                    type="button"
                    onClick={() => toggleSection(item.stateKey)}
                    className="flex w-full items-center justify-between gap-3 py-4 text-left"
                    aria-expanded={isOpen}
                    aria-controls={`accordion-${item.stateKey}`}
                  >
                    <span className="text-sm font-medium">{item.title}</span>
                    <PlusIcon
                      className={`h-4 w-4 shrink-0 transition-transform duration-300 ${
                        isOpen ? "rotate-45" : ""
                      }`}
                    />
                  </button>
                  <div
                    id={`accordion-${item.stateKey}`}
                    className={`grid transition-[grid-template-rows] duration-300 ${
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div
                        className={`pb-4 text-sm text-black/60 transition-opacity duration-300 ${
                          isOpen ? "opacity-100" : "opacity-0"
                        }`}
                      >
                        {item.content}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Floating add to cart */}
      <div
        className={`fixed z-50 transition-all duration-300 ${
          showFloating
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none"
        }
        bottom-0 left-0 right-0
        md:bottom-6 md:left-auto md:right-6 md:w-80
        `}
      >
        <div className="bg-white/95 backdrop-blur-sm shadow-xl border border-black/8 p-4">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-base font-light">{product.name}</span>
            <span className="text-base font-medium ml-auto">
              CHF {displayPrice.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center gap-1.5 mb-3">
            <StarIcon size={12} weight="fill" />
            <StarIcon size={12} weight="fill" />
            <StarIcon size={12} weight="fill" />
            <StarIcon size={12} weight="fill" />
            <StarHalfIcon size={12} weight="fill" />
            <span className="text-xs text-black/60 ml-1">(31 Reviews)</span>
          </div>
          <div className="flex gap-1.5 flex-wrap mb-3">
            {product.sizes.map((sizeOption) => {
              const sizeAvailableStock =
                sizeOption.stock - getQuantityInCart(sizeOption.size);
              const sizeOutOfStock = sizeAvailableStock <= 0;
              return (
                <button
                  key={sizeOption.size}
                  onClick={() => handleSizeSelect(sizeOption.size)}
                  disabled={sizeOutOfStock}
                  className={`px-4 py-2 text-xs font-medium transition-colors ${
                    sizeOutOfStock
                      ? "border border-black/20 text-black/40 cursor-not-allowed"
                      : selectedSize === sizeOption.size
                        ? "bg-black text-white"
                        : "bg-black/10 hover:bg-black/15"
                  }`}
                >
                  {sizeOption.size}
                </button>
              );
            })}
          </div>
          <Button
            variant="primary"
            onClick={handleAddToCart}
            disabled={!selectedSize || isOutOfStock}
            className="w-full"
          >
            {!selectedSize
              ? "Select size"
              : isOutOfStock
                ? "Out of stock"
                : `Add to cart · CHF ${displayPrice.toFixed(2)}`}
          </Button>
          <p className="text-xs text-center text-black/50 mt-2">
            Free shipping on orders over CHF 50
          </p>
        </div>
      </div>
    </div>
  );
}
