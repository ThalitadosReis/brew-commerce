"use client";

import React, { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/contexts/CartContext";
import { allProducts } from "@/data/products";
import {
  ArrowLeft,
  Minus,
  Plus,
  Coffee,
  ChevronRight,
  ChevronDown,
  Truck,
  RotateCcw,
  CircleStar,
  Users,
  Sprout,
  Frown,
} from "lucide-react";

export default function ProductPage() {
  const params = useParams();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [showDetails, setShowDetails] = useState(false);
  const [showTastingNotes, setShowTastingNotes] = useState(false);

  const product = useMemo(() => {
    return allProducts.find((p) => p.id === parseInt(params.id as string));
  }, [params.id]);

  if (!product) {
    return (
      <div className="min-h-screen py-20 mt-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center py-20">
            <Frown className="h-16 w-16 text-neutral mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-primary mb-2">
              Product not found
            </h3>
            <p className="text-accent mb-8">
              {"The product you're looking for doesn't exist."}
            </p>
            <Link
              href="/collection"
              className="uppercase font-primary text-sm inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-full hover:bg-secondary transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Collection
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
  };

  return (
    <div className="min-h-screen py-20 mt-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* breadcrumb */}
        <div className="mb-8">
          <nav className="flex items-center gap-2 text-sm text-accent mb-4">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link
              href="/collection"
              className="hover:text-primary transition-colors"
            >
              Collection
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-primary font-medium">{product.name}</span>
          </nav>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* image */}
          <div className="relative aspect-square bg-neutral/50 rounded-3xl">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-contain"
            />
          </div>

          {/* product details */}
          <div className="space-y-4">
            <div>
              <h1 className="uppercase font-display text-3xl lg:text-5xl font-bold text-primary mb-4">
                {product.name}
              </h1>
              <p className="lg:text-xl text-accent">{product.description}</p>

              <div className="flex items-center gap-12 my-6">
                <div>
                  <span className="text-sm text-accent block">Origin</span>
                  <span className="lg:text-lg font-medium text-primary">
                    {product.country}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-accent block">
                    Roast Level
                  </span>
                  <span className="lg:text-lg font-medium text-primary">
                    {product.roast}
                  </span>
                </div>
              </div>

              <div className="text-2xl lg:text-3xl font-bold text-primary">
                CHF{product.price.toFixed(2)}
              </div>
            </div>

            <div>
              <div className="flex items-stretch gap-2 w-full">
                {/* quantity controls */}
                <div className="flex items-stretch">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className={`bg-neutral/30 rounded-2xl p-5 transition-colors text-primary ${
                      quantity <= 1
                        ? "cursor-not-allowed opacity-50"
                        : "hover:bg-neutral/50"
                    }`}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </button>

                  <span className="px-6 flex items-center justify-center text-center font-medium text-primary">
                    {quantity}
                  </span>

                  <button
                    onClick={() => setQuantity(Math.min(10, quantity + 1))}
                    className={`bg-neutral/30 rounded-2xl p-5 transition-colors text-primary ${
                      quantity >= 10
                        ? "cursor-not-allowed opacity-50"
                        : "hover:bg-neutral/50"
                    }`}
                    disabled={quantity >= 10}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                {/* add to cart button */}
                <button
                  onClick={handleAddToCart}
                  className="flex-1 uppercase font-primary text-sm rounded-full bg-primary text-white p-4 hover:bg-secondary transition-colors"
                >
                  Add to Cart - CHF{(product.price * quantity).toFixed(2)}
                </button>
              </div>

              <div className="flex items-center justify-center gap-4 text-sm text-accent mt-2">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4" />
                  <span>Free Shipping over $50</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="h-4 w-4" />
                  <span>14 Days Returns</span>
                </div>
              </div>
            </div>

            {/* badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 justify-center items-stretch">
              {[
                { icon: Coffee, label: "Fresh Roasted", stroke: 1.5 },
                { icon: CircleStar, label: "Premium Quality", stroke: 1.5 },
                { icon: Users, label: "Community Focused", stroke: 1.5 },
                { icon: Sprout, label: "Sustainable", stroke: 1.5 },
              ].map(({ icon: Icon, label, stroke }) => (
                <div
                  key={label}
                  className="bg-neutral/30 rounded-3xl p-3 flex flex-col items-center justify-center text-center"
                >
                  <Icon
                    strokeWidth={stroke}
                    className="h-6 w-6 text-primary mb-2"
                  />
                  <span className="text-xs font-medium text-primary">{label}</span>
                </div>
              ))}
            </div>

            {/* accordion */}
            <div className="space-y-2">
              <div className="bg-neutral/30 rounded-3xl p-6">
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="flex items-center justify-between w-full"
                >
                  <h3 className="text-lg font-semibold text-primary uppercase font-display">
                    Product Details
                  </h3>
                  <ChevronDown
                    className={`h-5 w-5 text-primary transition-transform ${
                      showDetails ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {showDetails && (
                  <div className="mt-8 pb-6 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-accent">Origin:</span>
                      <span className="text-primary">{product.country}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-accent">Roast Level:</span>
                      <span className="text-primary">{product.roast}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-accent">Weight:</span>
                      <span className="text-primary">250g</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-neutral/30 rounded-3xl p-6">
                <button
                  onClick={() => setShowTastingNotes(!showTastingNotes)}
                  className="flex items-center justify-between w-full"
                >
                  <h3 className="uppercase font-display text-lg font-semibold text-primary">
                    Tasting Notes
                  </h3>
                  <ChevronDown
                    className={`h-5 w-5 text-primary transition-transform ${
                      showTastingNotes ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {showTastingNotes && (
                  <div className="mt-8 pb-6">
                    <p className="text-accent leading-relaxed">
                      {product.description}. This premium coffee offers a unique
                      flavor profile that coffee enthusiasts will appreciate.
                      Perfect for brewing with various methods including
                      pour-over, French press, and espresso.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
