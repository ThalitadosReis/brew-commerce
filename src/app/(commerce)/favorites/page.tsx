"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useWishlist } from "@/contexts/WishlistContext";
import { SortDropdown, SortOption } from "@/components/Filter";
import { CaretRightIcon } from "@phosphor-icons/react";
import ImageCard from "@/components/ImageCard";

export default function FavoritesPage() {
  const { wishlist, removeFromWishlist, loading } = useWishlist();

  const [sortBy, setSortBy] = useState<SortOption>("a-z");

  const sortedWishlist = useMemo(() => {
    return [...wishlist].sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "z-a":
          return b.name.localeCompare(a.name);
        default:
          return a.name.localeCompare(b.name);
      }
    });
  }, [wishlist, sortBy]);

  if (loading) {
    return (
      <section className="min-h-screen bg-secondary/10 py-20">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <h1 className="font-display italic text-5xl md:text-6xl lg:text-7xl text-center mb-8">
            Favorites
          </h1>
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-secondary/70">Loading your favorites...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-secondary/10 py-20">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* header */}
        <h1 className="font-display italic text-5xl md:text-6xl lg:text-7xl text-center mb-8">
          Favorites
        </h1>

        {/* breadcrumb + sort */}
        <div className="flex items-center justify-between m-4">
          <div className="flex gap-2 items-center text-sm">
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
              Shop
            </Link>
            <CaretRightIcon
              size={12}
              weight="light"
              className="text-secondary/70"
            />
            <span className="text-primary underline">Favorites</span>
          </div>

          <SortDropdown sortBy={sortBy} setSortBy={setSortBy} />
        </div>

        {/* content */}
        {sortedWishlist.length > 0 ? (
          <div className="grid md:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedWishlist.map((product) => (
              <ImageCard
                key={product.id}
                id={product.id}
                name={product.name}
                images={product.images}
                price={product.price}
                country={product.country}
                isInWishlist={true}
                onToggleWishlist={() => removeFromWishlist(product.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 rounded-xl bg-accent/10">
            <p className="text-secondary/70 mb-4">
              No favorites yet
              <br />
              Start adding products to your wishlist
            </p>
            <Link
              href="/collection"
              className="inline-block text-sm relative group"
            >
              Shop Collection
              <span className="absolute bottom-0 left-0 w-full h-px bg-secondary" />
              <span className="absolute bottom-0 right-0 w-0 h-px bg-muted transition-all duration-300 ease-out group-hover:w-2/3" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
