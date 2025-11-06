"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types/product";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/contexts/ToastContext";

import {
  MinusIcon,
  PlusIcon,
  StarIcon,
  StarHalfIcon,
  PackageIcon,
  CaretDownIcon,
  CaretLeftIcon,
  CaretRightIcon,
} from "@phosphor-icons/react";
import Button from "../common/Button";
import FavoriteToggleButton from "../common/FavoriteToggleButton";

const accordionItems = (product: Product | null) => [
  {
    title: "Details",
    stateKey: "details",
    content: `Handpicked from ${product?.country}. Roasted in small batches to ensure peak flavor and quality. Each bean tells a story of its origin. Perfect for brewing with various methods including pour-over, French press, and espresso.`,
  },
  {
    title: "Shipping",
    stateKey: "shipping",
    content: "Free shipping on orders over $50. Standard shipping times apply.",
  },
  {
    title: "Returns",
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
  if (images.length === 0) {
    return (
      <div className="relative flex h-full items-center justify-center bg-black/5">
        <PackageIcon size={32} className="text-black/40" />
      </div>
    );
  }

  const activeImage = images[activeIndex] ?? images[0];

  const showControls = images.length > 1;

  const handlePrevious = () => {
    const nextIndex = (activeIndex - 1 + images.length) % images.length;
    onSelect(nextIndex);
  };

  const handleNext = () => {
    const nextIndex = (activeIndex + 1) % images.length;
    onSelect(nextIndex);
  };

  return (
    <div className="relative aspect-square w-full overflow-hidden bg-black/5">
      <Image
        src={activeImage}
        alt={productName}
        fill
        sizes="(min-width: 1024px) 600px, 100vw"
        className="object-contain"
      />

      {showControls && (
        <>
          <Button
            onClick={handlePrevious}
            aria-label="Previous image"
            className="flex absolute! left-4 top-1/2 p-2! md:p-4! -translate-y-1/2 items-center justify-center bg-black/10 hover:bg-black/5 transition"
            variant="secondary"
          >
            <CaretLeftIcon className="w-4 h-4 md:w-5 md:h-5" />
          </Button>
          <Button
            onClick={handleNext}
            aria-label="Next image"
            className="flex absolute! p-2! md:p-4! right-4 top-1/2 -translate-y-1/2 items-center justify-center bg-black/10 hover:bg-black/5 transition"
            variant="secondary"
          >
            <CaretRightIcon className="w-4 h-4 md:w-5 md:h-5" />
          </Button>

          <div className="absolute inset-x-0 bottom-4 flex justify-center">
            <div className="flex gap-2 bg-white/95 p-2">
              {images.map((img, index) => {
                const isActive = activeIndex === index;
                return (
                  <button
                    key={`${img}-${index}`}
                    onClick={() => onSelect(index)}
                    className={`relative h-16 w-16 md:h-20 md:w-20 lg:h-24 lg:w-24 overflow-hidden bg-black/10 transition ${
                      isActive
                        ? "ring-2 ring-black/25"
                        : "opacity-75 hover:opacity-100"
                    }`}
                    aria-label={`View image ${index + 1}`}
                  >
                    <Image
                      src={img}
                      alt={`${productName} thumbnail ${index + 1}`}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function Breadcrumb({ productName }: { productName: string }) {
  return (
    <nav aria-label="Breadcrumb" className="font-body text-sm text-black/50">
      <ol className="flex items-center gap-2">
        <li>
          <Link href="/" className="transition-colors hover:text-black">
            Home
          </Link>
        </li>
        <li aria-hidden className="text-black/50">
          <CaretRightIcon size={12} />
        </li>
        <li>
          <Link
            href="/collection"
            className="transition-colors hover:text-black"
          >
            Collection
          </Link>
        </li>
        <li aria-hidden className="text-black/50">
          <CaretRightIcon size={12} />
        </li>
        <li className="text-black underline">{productName}</li>
      </ol>
    </nav>
  );
}

export default function ProductSection({ product }: ProductSectionProps) {
  const { addToCart, items } = useCart();
  const { showToast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [openSection, setOpenSection] = useState<string | null>("details");
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const productImages = useMemo(() => {
    if (!product) return [] as string[];
    if (!Array.isArray(product.images)) return [];
    return Array.from(
      new Set(
        product.images
          .filter((img): img is string => typeof img === "string")
          .map((img) => img.trim())
          .filter((img) => img.length > 0)
      )
    );
  }, [product]);

  useEffect(() => {
    if (productImages.length === 0) {
      setActiveImageIndex(0);
      return;
    }
    setActiveImageIndex((current) =>
      current >= productImages.length ? productImages.length - 1 : current
    );
  }, [productImages]);

  // helper function to get quantity in cart for a specific size
  const getQuantityInCart = useMemo(
    () => (sizeToCheck: string) => {
      if (!product) return 0;
      const cartItem = items.find(
        (item) =>
          item.id === product._id &&
          JSON.stringify(item.selectedSizes) === JSON.stringify([sizeToCheck])
      );
      return cartItem ? cartItem.quantity : 0;
    },
    [product, items]
  );

  const selectedSizeOption = useMemo(() => {
    if (!product || !selectedSize) return null;
    return product.sizes.find((s) => s.size === selectedSize);
  }, [product, selectedSize]);

  // calculate available stock for selected size
  const availableStock = useMemo(() => {
    if (!selectedSizeOption || !selectedSize) return 0;
    return selectedSizeOption.stock - getQuantityInCart(selectedSize);
  }, [selectedSizeOption, selectedSize, getQuantityInCart]);

  // check if selected size is out of stock
  const isOutOfStock = availableStock <= 0;

  // get display price
  const displayPrice = selectedSizeOption?.price ?? product?.price ?? 0;

  // check if can increase quantity
  const canIncreaseQuantity = quantity < availableStock;

  // clear selected size if it becomes out of stock
  React.useEffect(() => {
    if (selectedSize && isOutOfStock) {
      setSelectedSize(null);
      setQuantity(1);
    }
  }, [selectedSize, isOutOfStock]);

  React.useEffect(() => {
    setActiveImageIndex(0);
  }, [product?._id]);

  const handleAddToCart = () => {
    if (!product || !selectedSize || !selectedSizeOption) return;

    const currentQuantityInCart = getQuantityInCart(selectedSize);
    const newTotalQuantity = currentQuantityInCart + quantity;

    // check if total would exceed available stock
    if (newTotalQuantity > selectedSizeOption.stock) {
      if (currentQuantityInCart >= selectedSizeOption.stock) {
        showToast(
          `Cannot add more items. You already have ${currentQuantityInCart} in cart and only ${selectedSizeOption.stock} available in stock for size ${selectedSize}.`,
          "error"
        );
      } else {
        const remainingStock = selectedSizeOption.stock - currentQuantityInCart;
        showToast(
          `Cannot add ${quantity} item(s). You already have ${currentQuantityInCart} in cart. Only ${remainingStock} more available for size ${selectedSize}.`,
          "error"
        );
      }
      setQuantity(1);
      return;
    }

    // stock check
    if (selectedSizeOption.stock < quantity) {
      showToast(
        `Only ${selectedSizeOption.stock} items available in stock`,
        "error"
      );
      setQuantity(1);
      return;
    }

    // show success toast
    showToast(
      `Added ${quantity} ${quantity > 1 ? "items" : "item"} to cart`,
      "success"
    );

    console.log("ProductSection - Adding to cart:", {
      productId: product._id,
      selectedSize,
      quantity,
      price: selectedSizeOption.price,
    });

    addToCart(product, [selectedSize], quantity);

    // reset quantity to 1 after adding to cart
    setQuantity(1);
  };

  const handleQuantityIncrease = () => {
    if (canIncreaseQuantity) {
      setQuantity(quantity + 1);
    }
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

  if (!product) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-6 pt-24">
      <div className="flex-1">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* image */}
          <div className="lg:order-2">
            <div className="space-y-2">
              <div className="lg:hidden">
                <Breadcrumb productName={product.name} />
              </div>
              <div className="relative">
                <FavoriteToggleButton
                  productId={product._id}
                  product={product}
                />
                <CarouselThumbnails
                  images={productImages}
                  productName={product.name}
                  activeIndex={activeImageIndex}
                  onSelect={setActiveImageIndex}
                />
              </div>
            </div>
          </div>

          {/* content */}
          <div className="lg:order-1">
            <div className="space-y-2">
              <div className="hidden lg:block">
                <Breadcrumb productName={product.name} />
              </div>

              <h3 className="text-3xl md:text-3xl lg:text-3xl font-bold">
                {product.name}{" "}
                <span className="font-semibold text-black/25">
                  {product.country}
                </span>
              </h3>

              <div className="flex items-center gap-4">
                <h6 className="text-lg md:text-xl lg:text-2xl font-semibold">
                  CHF {displayPrice.toFixed(2)}
                </h6>

                <div className="w-px h-8 bg-black/25" />

                <div className="flex flex-col items-center sm:flex-row gap-y-1">
                  <div className="flex items-center">
                    <StarIcon size={16} weight="fill" />
                    <StarIcon size={16} weight="fill" />
                    <StarIcon size={16} weight="fill" />
                    <StarIcon size={16} weight="fill" />
                    <StarHalfIcon size={16} weight="fill" />
                  </div>
                  <span className="text-xs md:text-sm ml-2">
                    4.5 · 31 reviews
                  </span>
                </div>
              </div>

              <p className="text-sm md:text-base">{product.description}</p>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <p className="text-sm md:text-base ">Size</p>

                  {selectedSize && selectedSizeOption && (
                    <small className="flex items-center text-black/50">
                      <span className="w-1.5 h-1.5 bg-black rounded-full inline-block mr-2" />
                      {availableStock} in Stock
                    </small>
                  )}
                </div>

                <div className="flex gap-2">
                  {product.sizes.map((sizeOption) => {
                    const sizeAvailableStock =
                      sizeOption.stock - getQuantityInCart(sizeOption.size);
                    const sizeOutOfStock = sizeAvailableStock <= 0;

                    return (
                      <button
                        key={sizeOption.size}
                        onClick={() => handleSizeSelect(sizeOption.size)}
                        disabled={sizeOutOfStock}
                        className={`w-fit px-6 py-4 text-xs font-medium transition-colors ${
                          sizeOutOfStock
                            ? "border border-black/25 text-black/50 cursor-not-allowed"
                            : selectedSize === sizeOption.size
                            ? "bg-black text-white"
                            : "bg-black/10 hover:bg-black/5"
                        }`}
                      >
                        {sizeOption.size}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="text-center space-y-4">
                <div className="flex flex-row gap-2">
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      onClick={handleQuantityDecrease}
                      className={`p-4! transition-colors ${
                        quantity <= 1
                          ? "bg-black/10 opacity-50 cursor-not-allowed"
                          : "bg-black/10 hover:bg-black/5"
                      }`}
                      disabled={quantity <= 1}
                    >
                      <MinusIcon size={20} weight="light" />
                    </Button>

                    <span className="px-6 bg-white flex items-center">
                      {quantity}
                    </span>

                    <Button
                      variant="secondary"
                      onClick={handleQuantityIncrease}
                      className={`p-4! transition-colors ${
                        !canIncreaseQuantity
                          ? "bg-black/10 opacity-50 cursor-not-allowed"
                          : "bg-black/10 hover:bg-black/5"
                      }`}
                      disabled={!canIncreaseQuantity}
                    >
                      <PlusIcon size={20} weight="light" />
                    </Button>
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
                      : "Add to cart"}
                  </Button>
                </div>

                <span className="block text-xs md:text-sm text-black/50">
                  Free Shipping over $50
                </span>
              </div>

              <div className="flex flex-col gap-4">
                {accordionItems(product).map((item) => {
                  const isOpen = openSection === item.stateKey;
                  return (
                    <div
                      key={item.stateKey}
                      className="overflow-hidden bg-white shadow-sm transition-shadow hover:shadow-md"
                    >
                      <button
                        type="button"
                        onClick={() => toggleSection(item.stateKey)}
                        className="flex w-full items-center justify-between gap-3 px-6 py-4 text-left text-lg font-semibold transition hover:bg-black/2"
                        aria-expanded={isOpen}
                        aria-controls={`accordion-${item.stateKey}`}
                      >
                        <h6 className="text-lg md:text-xl lg:text-2xl font-semibold">
                          {item.title}
                        </h6>
                        <CaretDownIcon
                          className={`h-5 w-5 transition-transform duration-300 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      <div
                        id={`accordion-${item.stateKey}`}
                        className={`grid transition-[grid-template-rows] duration-400 ease-in-out ${
                          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                        }`}
                      >
                        <div className="overflow-hidden">
                          <div
                            className={`border-t border-black/5 px-6 py-4 text-sm text-black/75 transition-opacity duration-400 ${
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
        </div>
      </div>
    </div>
  );
}
