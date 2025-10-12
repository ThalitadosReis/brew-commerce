"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { Product } from "@/types/product";

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
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showTastingNotes, setShowTastingNotes] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setProduct(data.product);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

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
        images:
          product.images && product.images.length > 0
            ? [product.image, ...product.images]
            : [product.image, product.image],
        price: sizePrice,
        country: product.country,
        roast: product.category,
        sizes: product.sizes.map((s) => s.size),
      },
      [selectedSize],
      quantity
    );
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
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-accent">Loading product...</p>
            </div>
          ) : !product ? (
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
              {/* image gallery */}
              <div className="space-y-4">
                {/* main image */}
                <div className="relative aspect-square bg-secondary/10 rounded-2xl overflow-hidden group">
                  <button
                    onClick={() =>
                      isInWishlist(product._id)
                        ? removeFromWishlist(product._id)
                        : addToWishlist({
                            id: product._id,
                            name: product.name,
                            description: product.description,
                            images:
                              product.images && product.images.length > 0
                                ? [product.image, ...product.images]
                                : [product.image, product.image],
                            price: product.price,
                            country: product.country,
                            roast: product.category,
                            sizes: product.sizes.map((s) => s.size),
                          })
                    }
                    className="absolute top-4 left-4 z-10 p-2 bg-white rounded-full hover:bg-neutral"
                    title={
                      isInWishlist(product._id)
                        ? "Remove from wishlist"
                        : "Add to wishlist"
                    }
                  >
                    <HeartIcon
                      size={20}
                      weight={isInWishlist(product._id) ? "fill" : "light"}
                      className={`${
                        isInWishlist(product._id)
                          ? "text-primary"
                          : "hover:fill-black"
                      }`}
                    />
                  </button>

                  {/* navigation arrows */}
                  {(() => {
                    const allImages =
                      product.images && product.images.length > 0
                        ? [product.image, ...product.images]
                        : [product.image];
                    return (
                      allImages.length > 1 && (
                        <>
                          <button
                            onClick={() =>
                              setCurrentImageIndex((prev) =>
                                prev === 0 ? allImages.length - 1 : prev - 1
                              )
                            }
                            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/90 rounded-full hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Previous image"
                          >
                            <CaretLeftIcon size={20} weight="bold" />
                          </button>
                          <button
                            onClick={() =>
                              setCurrentImageIndex((prev) =>
                                prev === allImages.length - 1 ? 0 : prev + 1
                              )
                            }
                            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/90 rounded-full hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Next image"
                          >
                            <CaretRightIcon size={20} weight="bold" />
                          </button>
                        </>
                      )
                    );
                  })()}

                  <Image
                    src={(() => {
                      const allImages =
                        product.images && product.images.length > 0
                          ? [product.image, ...product.images]
                          : [product.image];
                      return allImages[currentImageIndex];
                    })()}
                    alt={product.name}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="object-contain"
                  />
                </div>

                {/* thumbnail gallery */}
                {(() => {
                  const allImages =
                    product.images && product.images.length > 0
                      ? [product.image, ...product.images]
                      : [product.image];
                  return (
                    allImages.length > 1 && (
                      <div className="grid grid-cols-4 gap-2">
                        {allImages.map((img, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`relative aspect-square bg-secondary/10 rounded-lg overflow-hidden border-2 transition-all ${
                              currentImageIndex === index
                                ? "border-accent"
                                : "border-transparent hover:border-secondary/30"
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
                    )
                  );
                })()}
              </div>

              {/* content */}
              <div className="space-y-6 lg:p-6">
                <span className="block font-display text-xl text-secondary mb-6">
                  CHF
                  {selectedSize
                    ? product.sizes
                        .find((s) => s.size === selectedSize)
                        ?.price.toFixed(2)
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

                {/* sizes */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-primary block">
                      Size
                    </span>

                    {/* only show stock when size is selected */}
                    {selectedSize && (
                      <span className="flex items-center text-xs font-semibold text-gray-700">
                        <span className="w-2 h-2 bg-accent rounded-full inline-block mr-1"></span>
                        {(() => {
                          const selected = product.sizes.find(
                            (s) => s.size === selectedSize
                          );
                          return selected
                            ? `${selected.stock} in Stock`
                            : "Out of stock";
                        })()}
                      </span>
                    )}
                  </div>

                  {/* sizes buttons */}
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
                        className={`w-fit px-6 py-2 text-xs rounded-md transition-colors ${
                          sizeOption.stock === 0
                            ? "bg-secondary/10 text-secondary/30 cursor-not-allowed line-through"
                            : selectedSize === sizeOption.size
                            ? "bg-accent text-white"
                            : "bg-accent/10 text-primary hover:bg-accent/20"
                        }`}
                      >
                        {sizeOption.size}
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
                        onClick={() => {
                          const selectedSizeOption = product.sizes.find(
                            (s) => s.size === selectedSize
                          );
                          const maxStock = selectedSizeOption?.stock || 10;
                          setQuantity(Math.min(maxStock, quantity + 1));
                        }}
                        className={`px-3 py-3 rounded-md transition-colors ${
                          (() => {
                            const selectedSizeOption = product.sizes.find(
                              (s) => s.size === selectedSize
                            );
                            const maxStock = selectedSizeOption?.stock || 10;
                            return quantity >= maxStock;
                          })()
                            ? "bg-accent/10 opacity-50 cursor-not-allowed"
                            : "bg-accent/10 hover:bg-accent/20"
                        }`}
                        disabled={(() => {
                          const selectedSizeOption = product.sizes.find(
                            (s) => s.size === selectedSize
                          );
                          const maxStock = selectedSizeOption?.stock || 10;
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
                      className={`w-full py-3 text-sm rounded-full transition-colors ${
                        selectedSize &&
                        (() => {
                          const selectedSizeOption = product.sizes.find(
                            (s) => s.size === selectedSize
                          );
                          return (
                            selectedSizeOption && selectedSizeOption.stock > 0
                          );
                        })()
                          ? "bg-accent text-white hover:opacity-80"
                          : "bg-accent/10 opacity-50 cursor-not-allowed"
                      }`}
                    >
                      {!selectedSize
                        ? "Select Size"
                        : (() => {
                            const selectedSizeOption = product.sizes.find(
                              (s) => s.size === selectedSize
                            );
                            return selectedSizeOption?.stock === 0
                              ? "Out of Stock"
                              : "Add to Cart";
                          })()}
                    </button>
                  </div>

                  <div className="flex items-center justify-center gap-6 text-sm text-secondary/70">
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
                        <span>Roast Level: {product.category}</span>
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
                      <p className="mt-4 text-sm font-body text-secondary/70">
                        {product.description} This premium coffee offers a
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
