"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { allProducts } from "@/data/products";

import {
  MinusIcon,
  PlusIcon,
  CoffeeIcon,
  CaretRightIcon,
  CaretLeftIcon,
  TruckIcon,
  SealCheckIcon,
  UsersThreeIcon,
  PlantIcon,
  HeartIcon,
  SmileySadIcon,
  ArrowsClockwiseIcon,
} from "@phosphor-icons/react";

export default function ProductPage() {
  const params = useParams();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showTastingNotes, setShowTastingNotes] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const product = useMemo(() => {
    return allProducts.find((p) => p.id === parseInt(params.id as string));
  }, [params.id]);

  const handleAddToCart = () => {
    if (!product || !selectedSize) return;

    addToCart(product, [selectedSize], quantity);
  };

  return (
    <div className="min-h-screen py-20 bg-secondary/10">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* breadcrumb */}
        <div className="flex gap-2 items-center text-sm mb-2 lg:ml-4">
          <Link
            href="/"
            className="text-secondary/70 hover:text-primary cursor-pointer"
          >
            Home
          </Link>
          <CaretRightIcon
            size={12}
            weight="light"
            className="text-secondary/70"
          />
          <Link
            href="/collection"
            className="text-secondary/70 hover:text-primary cursor-pointer"
          >
            Collection
          </Link>
          <CaretRightIcon
            size={12}
            weight="light"
            className="text-secondary/70"
          />
          <span className="text-primary underline">
            {product ? product.name : "Item Not Found"}
          </span>
        </div>

        {/* page content */}
        <div className="flex-1">
          {!product ? (
            <div className="mx-auto text-center py-20">
              <SmileySadIcon size={72} weight="light" className="mx-auto" />
              <div>
                <h3 className="uppercase font-heading text-xl text-primary">
                  Product not found
                </h3>
                <p className="font-body text-secondary/70">
                  {"The product you're looking for doesn't exist."}
                </p>
                <Link
                  href="/collection"
                  className="inline-block text-sm font-body relative group mt-8"
                >
                  Back to Collection
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary" />
                  <span className="absolute bottom-0 right-0 w-0 h-0.5 bg-muted transition-all duration-300 ease-out group-hover:w-2/3" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-4">
              {/* image */}
              <div className="relative aspect-square bg-secondary/10 rounded-2xl overflow-hidden group">
                <button
                  onClick={() =>
                    isInWishlist(product.id)
                      ? removeFromWishlist(product.id)
                      : addToWishlist(product)
                  }
                  className="absolute top-4 left-4 z-10 p-2 bg-white rounded-full hover:bg-neutral"
                  title={
                    isInWishlist(product.id)
                      ? "Remove from wishlist"
                      : "Add to wishlist"
                  }
                >
                  <HeartIcon
                    size={20}
                    weight={isInWishlist(product.id) ? "fill" : "light"}
                    className={`${
                      isInWishlist(product.id)
                        ? "text-primary"
                        : "hover:fill-black"
                    }`}
                  />
                </button>

                <Image
                  src={product.images[currentImageIndex]}
                  alt={product.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-contain"
                />

                {/* mobile navigation arrows */}
                <>
                  <button
                    onClick={() => setCurrentImageIndex(currentImageIndex - 1)}
                    disabled={currentImageIndex === 0}
                    className={`mx-4 absolute left-0 top-1/2 -translate-y-1/2 bg-secondary/20  hover:opacity-50 p-2 rounded-lg transition-colors ${
                      currentImageIndex === 0
                        ? "text-white opacity-50 cursor-not-allowed"
                        : "text-white hover:opacity-80"
                    }`}
                    aria-label="Previous image"
                  >
                    <CaretLeftIcon size={20} weight="light" />
                  </button>

                  <button
                    onClick={() => setCurrentImageIndex(currentImageIndex + 1)}
                    disabled={currentImageIndex === product.images.length - 1}
                    className={`mx-4 absolute right-0 top-1/2 -translate-y-1/2 bg-secondary/20 hover:opacity-50 p-2 rounded-lg transition-colors ${
                      currentImageIndex === product.images.length - 1
                        ? "text-white opacity-50 cursor-not-allowed"
                        : "text-white hover:opacity-80"
                    }`}
                    aria-label="Next image"
                  >
                    <CaretRightIcon size={20} weight="light" />
                  </button>

                  {/* slider indicators */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {product.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          currentImageIndex === index
                            ? "bg-primary w-6"
                            : "bg-secondary/50"
                        }`}
                        aria-label={`Go to image ${index + 1}`}
                      />
                    ))}
                  </div>
                </>
              </div>

              {/* content */}
              <div className="space-y-6 lg:p-6">
                <span className="block font-display text-xl text-secondary mb-6">
                  CHF
                  {selectedSize
                    ? product.prices[selectedSize].toFixed(2)
                    : product.price.toFixed(2)}
                </span>

                <div>
                  <h1 className="font-display text-3xl lg:text-4xl">
                    {product.name}
                  </h1>
                  <p className="font-body text-secondary/70">
                    {product.description}
                  </p>
                </div>

                {/* size */}
                <div>
                  <span className="text-xs font-medium text-primary mb-1 block">
                    Size
                  </span>
                  <div className="flex gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`w-fit px-6 py-2 text-xs rounded-md transition-colors ${
                          selectedSize === size
                            ? "bg-accent text-white"
                            : "bg-accent/10 text-primary hover:bg-accent/20"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* quantity controls + add to cart button */}
                <div className="space-y-3">
                  <div className="flex flex-row gap-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className={`px-3 py-3 rounded-md transition-colors ${
                          quantity <= 1
                            ? "bg-accent/10 opacity-50 cursor-not-allowed"
                            : "bg-accent/10 hover:bg-accent/20"
                        }`}
                        disabled={quantity <= 1}
                      >
                        <MinusIcon size={20} weight="light" />
                      </button>

                      <span className="px-5 bg-white rounded-md flex items-center">
                        {quantity}
                      </span>

                      <button
                        onClick={() => setQuantity(Math.min(10, quantity + 1))}
                        className={`px-3 py-3 rounded-md transition-colors ${
                          quantity >= 10
                            ? "bg-accent/10 opacity-50 cursor-not-allowed"
                            : "bg-accent/10 hover:bg-accent/20"
                        }`}
                        disabled={quantity >= 10}
                      >
                        <PlusIcon size={20} weight="light" />
                      </button>
                    </div>

                    <button
                      onClick={handleAddToCart}
                      disabled={!selectedSize}
                      className={`w-full py-3 text-sm rounded-full transition-colors ${
                        selectedSize
                          ? "bg-accent text-white hover:opacity-80"
                          : "bg-accent/10 opacity-50 cursor-not-allowed"
                      }`}
                    >
                      {selectedSize ? `Add to Cart` : "Select Size"}
                    </button>
                  </div>

                  <div className="flex items-center justify-center gap-6 text-sm text-secondary/80">
                    <div className="flex items-center gap-2">
                      <TruckIcon size={16} weight="light" />
                      <span>Free Shipping over $50</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ArrowsClockwiseIcon size={16} weight="light" />
                      <span>14 Days Returns</span>
                    </div>
                  </div>
                </div>

                {/* badges */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 justify-center mb-3">
                  {[
                    { icon: CoffeeIcon, label: "Fresh Roasted" },
                    { icon: SealCheckIcon, label: "Premium Quality" },
                    { icon: UsersThreeIcon, label: "Community Focused" },
                    { icon: PlantIcon, label: "Sustainable" },
                  ].map(({ icon: Icon, label }) => (
                    <div
                      key={label}
                      className="bg-accent/10 rounded-lg p-4 flex flex-col items-center justify-start text-center"
                    >
                      <Icon size={24} weight="light" />
                      <span className="text-xs mt-2">{label}</span>
                    </div>
                  ))}
                </div>

                {/* accordion */}
                <div className="space-y-3">
                  <div className="bg-neutral/70 rounded-xl p-6">
                    <button
                      onClick={() => setShowDetails(!showDetails)}
                      className="w-full flex items-center justify-between group"
                    >
                      <h3 className="text-xl font-display">Details</h3>
                      <span
                        className={`text-xl transition-transform duration-500 ease-in-out ${
                          showDetails ? "" : "group-hover:rotate-[360deg]"
                        }`}
                      >
                        {showDetails ? (
                          <MinusIcon size={20} weight="light" />
                        ) : (
                          <PlusIcon size={20} weight="light" />
                        )}
                      </span>
                    </button>

                    {showDetails && (
                      <div className="mt-4 flex flex-col text-sm font-body text-secondary/80">
                        <span>Origin: {product.country}</span>
                        <span>Roast Level: {product.roast}</span>
                      </div>
                    )}
                  </div>

                  <div className="bg-neutral/70 rounded-2xl p-6">
                    <button
                      onClick={() => setShowTastingNotes(!showTastingNotes)}
                      className="w-full flex items-center justify-between group"
                    >
                      <h3 className="text-xl font-display">Tasting Notes</h3>
                      <span
                        className={`text-xl transition-transform duration-500 ease-in-out ${
                          showTastingNotes ? "" : "group-hover:rotate-[360deg]"
                        }`}
                      >
                        {showTastingNotes ? (
                          <MinusIcon size={20} weight="light" />
                        ) : (
                          <PlusIcon size={20} weight="light" />
                        )}
                      </span>
                    </button>

                    {showTastingNotes && (
                      <p className="mt-4 text-sm font-body text-secondary/80">
                        {product.description}. This premium coffee offers a
                        unique flavor profile that coffee enthusiasts will
                        appreciate. Perfect for brewing with various methods
                        including pour-over, French press, and espresso.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
