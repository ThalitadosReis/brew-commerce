"use client";

import React, { useState, useMemo } from "react";
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
} from "@phosphor-icons/react";
import Button from "../common/Button";
import FavoriteToggleButton from "../common/FavoriteToggleButton";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  useCarousel,
} from "@/components/ui/carousel";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Breadcrumb as UiBreadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

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
}: {
  images: string[];
  productName: string;
}) {
  const { api, selectedIndex } = useCarousel();

  if (!api || images.length <= 1) return null;

  return (
    <div className="w-fit absolute inset-x-0 bottom-4 z-10 flex justify-center gap-2 bg-white mx-auto p-2">
      {images.map((img, index) => {
        const isActive = selectedIndex === index;
        return (
          <button
            key={`${img}-${index}`}
            type="button"
            onClick={() => api.scrollTo(index)}
            className={`pointer-events-auto relative h-20 w-20 overflow-hidden bg-black/25 backdrop-blur-sm transition ${
              isActive
                ? "ring-2 ring-black/25"
                : "opacity-50 hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-2"
            }`}
            aria-label={`View image ${index + 1}`}
          >
            <Image
              src={img}
              alt={`${productName} thumbnail ${index + 1}`}
              fill
              sizes="64px"
              className="object-contain"
            />
          </button>
        );
      })}
    </div>
  );
}

// breadcrumb component
function ProductBreadcrumb({ productName }: { productName: string }) {
  return (
    <UiBreadcrumb className="font-body text-sm text-black/50">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link
              href="/homepage"
              className="text-black/50 hover:text-black/75 transition-colors"
            >
              Home
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link
              href="/collection"
              className="text-black/50 hover:text-black/75 transition-colors"
            >
              Collection
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage className="text-black underline">
            {productName}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </UiBreadcrumb>
  );
}

export default function ProductSection({ product }: ProductSectionProps) {
  const { addToCart, items } = useCart();
  const { showToast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

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

  if (!product) {
    return null;
  }

  const hasMultipleImages = product.images.length > 1;

  return (
    <div className="max-w-7xl mx-auto px-8 pt-24">
      <div className="flex-1">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* image */}
          <div className="lg:order-2">
            <div className="space-y-2">
              <div className="lg:hidden">
                <ProductBreadcrumb productName={product.name} />
              </div>

              <div className="relative aspect-square overflow-hidden bg-black/10 group">
                <FavoriteToggleButton
                  productId={product._id}
                  product={product}
                />

                <Carousel className="flex h-full flex-col">
                  <div className="relative flex-1">
                    <CarouselContent className="h-full">
                      {product.images.map((img, index) => (
                        <CarouselItem
                          key={index}
                          className="flex h-full items-center justify-center"
                        >
                          <div className="relative h-full w-full">
                            <Image
                              src={img}
                              alt={`${product.name}-${index + 1}`}
                              fill
                              priority={index === 0}
                              sizes="(max-width: 1024px) 100vw, 33vw"
                              className="object-contain"
                            />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                  </div>

                  {hasMultipleImages && (
                    <CarouselThumbnails
                      images={product.images}
                      productName={product.name}
                    />
                  )}
                </Carousel>
              </div>
            </div>
          </div>

          {/* content */}
          <div className="lg:order-1">
            <div className="space-y-4">
              <div className="hidden lg:block">
                <ProductBreadcrumb productName={product.name} />
              </div>

              <h3 className="font-bold!">
                {product.name}{" "}
                <span className="font-semibold text-black/25">
                  {product.country}
                </span>
              </h3>

              <div className="flex items-center gap-4">
                <h4>CHF {displayPrice.toFixed(2)}</h4>

                <div className="w-px h-8 bg-black/25" />

                <div className="flex items-center gap-1">
                  <StarIcon size={16} weight="fill" />
                  <StarIcon size={16} weight="fill" />
                  <StarIcon size={16} weight="fill" />
                  <StarIcon size={16} weight="fill" />
                  <StarHalfIcon size={16} weight="fill" />
                  <small className="ml-2">4.5 · 31 reviews</small>
                </div>
              </div>

              <p>{product.description}</p>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <p>Size</p>

                  {selectedSize && selectedSizeOption && (
                    <small className="flex items-center font-light">
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
                        className={`w-fit px-6 py-4 text-xs transition-colors ${
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
                    <button
                      onClick={handleQuantityDecrease}
                      className={`p-4 transition-colors ${
                        quantity <= 1
                          ? "bg-black/10 opacity-50 cursor-not-allowed"
                          : "bg-black/10 hover:bg-black/5"
                      }`}
                      disabled={quantity <= 1}
                    >
                      <MinusIcon size={20} weight="light" />
                    </button>

                    <span className="px-6 bg-white flex items-center">
                      {quantity}
                    </span>

                    <button
                      onClick={handleQuantityIncrease}
                      className={`p-4 transition-colors ${
                        !canIncreaseQuantity
                          ? "bg-black/10 opacity-50 cursor-not-allowed"
                          : "bg-black/10 hover:bg-black/5"
                      }`}
                      disabled={!canIncreaseQuantity}
                    >
                      <PlusIcon size={20} weight="light" />
                    </button>
                  </div>

                  <Button
                    variant="primary"
                    onClick={handleAddToCart}
                    disabled={!selectedSize || isOutOfStock}
                    className="w-full text-sm"
                  >
                    {!selectedSize
                      ? "Select size"
                      : isOutOfStock
                      ? "Out of stock"
                      : "Add to cart"}
                  </Button>
                </div>

                <small className="block text-black/50">
                  Free Shipping over $50
                </small>
              </div>

              <Accordion
                type="single"
                collapsible
                className="flex flex-col gap-4"
              >
                {accordionItems(product).map((item) => (
                  <AccordionItem
                    key={item.stateKey}
                    value={item.stateKey}
                    className="overflow-hidden bg-white shadow-sm"
                  >
                    <AccordionTrigger className="px-8 text-lg font-heading">
                      {item.title}
                    </AccordionTrigger>
                    <AccordionContent className="px-8 text-sm font-body text-black/75">
                      {item.content}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
