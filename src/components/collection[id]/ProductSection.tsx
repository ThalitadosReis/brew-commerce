"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types/product";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";

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

export default function ProductSection({ product }: ProductSectionProps) {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>(
    {}
  );

  const handleAddToCart = () => {
    if (!product || !selectedSize) return;

    // get the price and stock
    const selectedSizeOption = product.sizes.find(
      (s) => s.size === selectedSize
    );

    if (!selectedSizeOption) return;

    // check if stock is available
    if (selectedSizeOption.stock < quantity) {
      alert(`Only ${selectedSizeOption.stock} items available in stock`);
      return;
    }

    const sizePrice = selectedSizeOption.price;

    addToCart(
      {
        id: product._id,
        name: product.name,
        description: product.description,
        images: product.images,
        price: sizePrice,
        country: product.country,
        roast: product.category,
        sizes: product.sizes.map((s) => s.size),
      },
      [selectedSize],
      quantity
    );
  };

  // toggle function
  const toggleAccordion = (key: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="max-w-7xl mx-auto px-6 pt-24">
      <div className="flex-1">
        {!product ? (
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
        ) : (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* image */}
            <div className="lg:order-2">
              <div className="space-y-4">
                <div className="flex lg:hidden gap-1 items-center text-sm font-body">
                  <Link
                    href="/"
                    className="text-black/70 hover:text-black cursor-pointer"
                  >
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
                  <span className="text-black underline">
                    {product ? product.name : "Item Not Found"}
                  </span>
                </div>
                <div className="relative aspect-square bg-black/10 overflow-hidden group">
                  <button
                    onClick={() =>
                      isInWishlist(product._id)
                        ? removeFromWishlist(product._id)
                        : addToWishlist({
                            id: product._id,
                            name: product.name,
                            description: product.description,
                            images: product.images,
                            price: product.price,
                            country: product.country,
                            roast: product.category,
                            sizes: product.sizes.map((s) => s.size),
                          })
                    }
                    className="absolute top-4 left-4 z-10 p-3 bg-white hover:bg-black/10 rounded-full"
                    title={
                      isInWishlist(product._id)
                        ? "Remove from wishlist"
                        : "Add to wishlist"
                    }
                  >
                    <HeartIcon
                      size={20}
                      weight={isInWishlist(product._id) ? "fill" : "light"}
                    />
                  </button>

                  {/* arrows */}
                  {product.images.length > 1 && (
                    <>
                      <button
                        onClick={() =>
                          setCurrentImageIndex((prev) =>
                            prev === 0 ? product.images.length - 1 : prev - 1
                          )
                        }
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-white hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Previous image"
                      >
                        <CaretLeftIcon size={20} weight="bold" />
                      </button>
                      <button
                        onClick={() =>
                          setCurrentImageIndex((prev) =>
                            prev === product.images.length - 1 ? 0 : prev + 1
                          )
                        }
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

                {product.images.length > 1 && (
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
                <div className="hidden lg:flex gap-1 items-center text-sm font-body">
                  <Link
                    href="/"
                    className="text-black/70 hover:text-black cursor-pointer"
                  >
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
                  <span className="text-black underline">
                    {product ? product.name : "Item Not Found"}
                  </span>
                </div>

                <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold font-heading">
                  {product.name}
                </h2>

                <div className="flex items-center gap-4">
                  <h3 className="text-xl md:text-2xl font-semibold">
                    CHF
                    {selectedSize
                      ? product.sizes
                          .find((s) => s.size === selectedSize)
                          ?.price.toFixed(2)
                      : product.price.toFixed(2)}
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

                {/* sizes */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-body">Size</span>

                    {/* only show stock when size is selected */}
                    {selectedSize && (
                      <span className="flex items-center text-xs font-light">
                        <span className="w-2 h-2 bg-black rounded-full inline-block mr-2" />
                        {(() => {
                          const selected = product.sizes.find(
                            (s) => s.size === selectedSize
                          );
                          return selected ? `${selected.stock} in Stock` : null;
                        })()}
                      </span>
                    )}
                  </div>

                  {/* size buttons */}
                  <div className="flex gap-2">
                    {product.sizes.map((sizeOption) => (
                      <button
                        key={sizeOption.size}
                        onClick={() => {
                          setSelectedSize(sizeOption.size);
                          // reset quantity to 1 when changing size
                          setQuantity(1);
                        }}
                        disabled={sizeOption.stock === 0}
                        className={`w-fit px-6 py-3 text-xs transition-colors ${
                          sizeOption.stock === 0
                            ? "border-1 border-black/10 text-black/30 cursor-not-allowed"
                            : selectedSize === sizeOption.size
                            ? "bg-black text-white"
                            : "bg-black/10 hover:bg-black/20"
                        }`}
                      >
                        {sizeOption.size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* quantity controls / add to cart */}
                <div className="text-center space-y-3">
                  <div className="flex flex-row gap-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
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
                        onClick={() => {
                          const selectedSizeOption = product.sizes.find(
                            (s) => s.size === selectedSize
                          );
                          if (!selectedSizeOption) return;
                          const maxStock = Math.min(
                            selectedSizeOption.stock,
                            10
                          );
                          setQuantity(Math.min(maxStock, quantity + 1));
                        }}
                        className={`px-3 py-3 transition-colors ${
                          (() => {
                            const selectedSizeOption = product.sizes.find(
                              (s) => s.size === selectedSize
                            );
                            if (!selectedSizeOption) return true;
                            const maxStock = Math.min(
                              selectedSizeOption.stock,
                              10
                            );
                            return quantity >= maxStock;
                          })()
                            ? "bg-black/10 opacity-50 cursor-not-allowed"
                            : "bg-black/10 hover:bg-black/20"
                        }`}
                        disabled={(() => {
                          const selectedSizeOption = product.sizes.find(
                            (s) => s.size === selectedSize
                          );
                          if (!selectedSizeOption) return true;
                          const maxStock = Math.min(
                            selectedSizeOption.stock,
                            10
                          );
                          return quantity >= maxStock;
                        })()}
                      >
                        <PlusIcon size={20} weight="light" />
                      </button>
                    </div>

                    <button
                      onClick={handleAddToCart}
                      disabled={
                        !selectedSize ||
                        (() => {
                          const selectedSizeOption = product.sizes.find(
                            (s) => s.size === selectedSize
                          );
                          return selectedSizeOption?.stock === 0;
                        })()
                      }
                      className={`w-full py-3 text-sm transition-colors ${
                        selectedSize &&
                        (() => {
                          const selectedSizeOption = product.sizes.find(
                            (s) => s.size === selectedSize
                          );
                          return (
                            selectedSizeOption && selectedSizeOption.stock > 0
                          );
                        })()
                          ? "bg-black text-white hover:opacity-80"
                          : "bg-black/10 opacity-50 cursor-not-allowed"
                      }`}
                    >
                      {!selectedSize
                        ? "Select size"
                        : (() => {
                            const selectedSizeOption = product.sizes.find(
                              (s) => s.size === selectedSize
                            );
                            return selectedSizeOption?.stock === 0
                              ? "Out of stock"
                              : "Add to cart";
                          })()}
                    </button>
                  </div>

                  <span className="block text-xs text-black/70">
                    Free Shipping over $50
                  </span>
                </div>

                {/* accordion */}
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
        )}
      </div>
    </div>
  );
}
