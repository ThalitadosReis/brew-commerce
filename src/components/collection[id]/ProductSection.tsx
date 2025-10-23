"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types/product";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useToast } from "@/contexts/ToastContext";

import {
  MinusIcon,
  PlusIcon,
  CaretRightIcon,
  CaretLeftIcon,
  HeartIcon,
  SmileySadIcon,
  StarIcon,
  StarHalfIcon,
} from "@phosphor-icons/react";
import Button from "../common/Button";

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

// breadcrumb component
function Breadcrumb({ productName }: { productName: string }) {
  return (
    <div className="flex gap-1 items-center text-sm font-body">
      <Link href="/" className="text-black/70 hover:text-black cursor-pointer">
        Home
      </Link>
      <CaretRightIcon size={12} weight="light" />
      <Link
        href="/collection"
        className="text-black/70 hover:text-black cursor-pointer"
      >
        Collection
      </Link>
      <CaretRightIcon size={12} weight="light" />
      <span className="text-black underline">{productName}</span>
    </div>
  );
}

export default function ProductSection({ product }: ProductSectionProps) {
  const { addToCart, items } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [isHovered, setIsHovered] = React.useState(false);
  const { showToast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>(
    {}
  );

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

  const handleWishlistToggle = () => {
    if (!product) return;

    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
  };

  const toggleAccordion = (key: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
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

  const navigateImage = (direction: "prev" | "next") => {
    if (!product) return;
    setCurrentImageIndex((prev) => {
      if (direction === "prev") {
        return prev === 0 ? product.images.length - 1 : prev - 1;
      } else {
        return prev === product.images.length - 1 ? 0 : prev + 1;
      }
    });
  };

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-6 pt-24">
        <div className="flex-1">
          <div className="mx-auto text-center py-24">
            <SmileySadIcon
              size={72}
              weight="light"
              className="mx-auto mb-2 text-black/70"
            />
            <h3 className="font-heading text-2xl">Product not found</h3>
            <p className="font-body text-black/70">
              {"The product you're looking for doesn't exist."}
            </p>
            <Link
              href="/collection"
              className="inline-flex items-center gap-2 text-sm font-body relative group mt-8"
            >
              <CaretLeftIcon className="transition-transform duration-300 ease-out group-hover:-translate-x-1" />
              Back to Collection
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isProductInWishlist = isInWishlist(product._id);
  const hasMultipleImages = product.images.length > 1;

  return (
    <div className="max-w-7xl mx-auto px-6 pt-24">
      <div className="flex-1">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* image */}
          <div className="lg:order-2">
            <div className="space-y-4">
              <div className="lg:hidden">
                <Breadcrumb productName={product.name} />
              </div>

              <div className="relative aspect-square bg-black/10 overflow-hidden group">
                <button
                  onClick={handleWishlistToggle}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  className="absolute top-4 left-4 z-10 p-3 bg-white rounded-full"
                  title={
                    isProductInWishlist
                      ? "Remove from wishlist"
                      : "Add to wishlist"
                  }
                >
                  <HeartIcon
                    size={20}
                    weight={isProductInWishlist || isHovered ? "fill" : "light"}
                    className={`text-black transition-opacity ${
                      isProductInWishlist && isHovered
                        ? "opacity-50"
                        : "opacity-100"
                    }`}
                  />
                </button>

                {hasMultipleImages && (
                  <>
                    <button
                      onClick={() => navigateImage("prev")}
                      className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-white hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Previous image"
                    >
                      <CaretLeftIcon size={20} weight="bold" />
                    </button>
                    <button
                      onClick={() => navigateImage("next")}
                      className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-white hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Next image"
                    >
                      <CaretRightIcon size={20} weight="bold" />
                    </button>
                  </>
                )}

                <Image
                  src={product.images[currentImageIndex]}
                  alt={product.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-contain"
                />
              </div>

              {hasMultipleImages && (
                <div className="grid grid-cols-4 gap-4">
                  {product.images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative aspect-square bg-black/10 overflow-hidden transition-all ${
                        currentImageIndex === index ? "" : "opacity-50"
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`${product.name} - ${index + 1}`}
                        fill
                        sizes="100px"
                        className="object-contain"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* content */}
          <div className="lg:order-1">
            <div className="space-y-6">
              <div className="hidden lg:block">
                <Breadcrumb productName={product.name} />
              </div>

              <div className="inline-flex gap-2">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold font-heading">
                  {product.name}
                </h2>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading text-black/20">
                  {product.country}
                </h2>
              </div>

              <div className="flex items-center gap-4">
                <h3 className="text-xl md:text-2xl font-semibold">
                  CHF {displayPrice.toFixed(2)}
                </h3>

                <div className="w-px h-6 bg-black/70" />

                <div className="flex items-center gap-1">
                  <StarIcon size={16} weight="fill" />
                  <StarIcon size={16} weight="fill" />
                  <StarIcon size={16} weight="fill" />
                  <StarIcon size={16} weight="fill" />
                  <StarHalfIcon size={16} weight="fill" />
                  <span className="ml-1 text-black/70 text-sm">
                    4.5 · 31 reviews
                  </span>
                </div>
              </div>

              <p className="font-body text-black/70">{product.description}</p>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-body">Size</span>

                  {selectedSize && selectedSizeOption && (
                    <span className="flex items-center text-xs font-light">
                      <span className="w-2 h-2 bg-black rounded-full inline-block mr-2" />
                      {availableStock} in Stock
                    </span>
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
                        className={`w-fit px-6 py-3 text-xs transition-colors ${
                          sizeOutOfStock
                            ? "border-1 border-black/10 text-black/30 cursor-not-allowed"
                            : selectedSize === sizeOption.size
                            ? "bg-black text-white"
                            : "bg-black/10 hover:bg-black/20"
                        }`}
                      >
                        {sizeOption.size}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="text-center space-y-3">
                <div className="flex flex-row gap-2">
                  <div className="flex gap-2">
                    <button
                      onClick={handleQuantityDecrease}
                      className={`px-3 py-3 transition-colors ${
                        quantity <= 1
                          ? "bg-black/10 opacity-50 cursor-not-allowed"
                          : "bg-black/10 hover:bg-black/20"
                      }`}
                      disabled={quantity <= 1}
                    >
                      <MinusIcon size={20} weight="light" />
                    </button>

                    <span className="px-5 bg-white flex items-center">
                      {quantity}
                    </span>

                    <button
                      onClick={handleQuantityIncrease}
                      className={`px-3 py-3 transition-colors ${
                        !canIncreaseQuantity
                          ? "bg-black/10 opacity-50 cursor-not-allowed"
                          : "bg-black/10 hover:bg-black/20"
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

                <span className="block text-xs text-black/70">
                  Free Shipping over $50
                </span>
              </div>

              <div className="space-y-4">
                {accordionItems(product).map((item) => (
                  <div key={item.stateKey} className="bg-white p-6">
                    <button
                      onClick={() => toggleAccordion(item.stateKey)}
                      className="w-full flex items-center justify-between group"
                    >
                      <h3 className="text-lg font-heading">{item.title}</h3>
                      <span
                        className={`transition-transform duration-200 ease-in-out ${
                          openSections[item.stateKey]
                            ? ""
                            : "group-hover:rotate-[90deg]"
                        }`}
                      >
                        {openSections[item.stateKey] ? (
                          <MinusIcon size={20} weight="light" />
                        ) : (
                          <PlusIcon size={20} weight="light" />
                        )}
                      </span>
                    </button>

                    {openSections[item.stateKey] && (
                      <div className="mt-4 text-sm font-body text-black/70">
                        <div>{item.content}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
