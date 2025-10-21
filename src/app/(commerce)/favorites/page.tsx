"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useWishlist } from "@/contexts/WishlistContext";
import { SortDropdown, SortOption } from "@/components/collection/Filter";
import ImageCard from "@/components/collection/ImageCard";
import { CaretRightIcon } from "@phosphor-icons/react";
import Image from "next/image";
import Head from "next/head";

const image =
  "https://images.pexels.com/photos/7541876/pexels-photo-7541876.jpeg";

export default function FavoritesPage() {
  const { wishlist, loading } = useWishlist();
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
      <div className="bg-black/5 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4" />
          <p className="text-black">Loading your favorites...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <link rel="preload" as="image" href={image} />
      </Head>

      <div className="bg-black/5 py-24 space-y-24">
        <div className="max-w-2xl mx-auto text-center pt-24 px-6 space-y-8">
          <h1 className="text-5xl md:text-6xl font-heading text-black">
            Favourites
          </h1>
          <p className="text-sm font-body">
            Your carefully selected coffee selection tells a story of taste and
            passion.
          </p>
        </div>

        <section className="max-w-7xl mx-auto px-6">
          <div className="flex justify-end mb-4">
            <SortDropdown sortBy={sortBy} setSortBy={setSortBy} />
          </div>

          {sortedWishlist.length > 0 ? (
            <div className="grid md:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedWishlist.map((product) => (
                <ImageCard
                  key={product._id}
                  id={product._id}
                  name={product.name}
                  images={product.images}
                  price={product.price}
                  country={product.country}
                  product={product}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-black/10">
              <p className="text-body text-black/70 mb-4">
                No favorites yet
                <br />
                Start adding products to your wishlist
              </p>
              <Link
                href="/collection"
                className="inline-flex items-center gap-2 text-sm font-body relative group mt-8"
              >
                Start shopping
                <CaretRightIcon className="transition-transform duration-300 ease-out group-hover:translate-x-1" />
              </Link>
            </div>
          )}
        </section>

        <section className="max-w-7xl mx-auto px-6">
          <div className="grid auto-cols-fr grid-cols-1 overflow-hidden md:grid-cols-2 gap-8">
            <div className="max-w-lg m-auto space-y-4">
              <h2 className="text-4xl lg:text-5xl font-heading">
                Ready to brew your favorites?
              </h2>
              <p className="font-body text-black/70">
                Transform your saved selections into a delicious reality. Each
                coffee tells a story waiting to be savored.
              </p>
              <Link
                href="/collection"
                className="block w-fit bg-black/5 hover:bg-black/10 font-medium px-6 py-3"
              >
                Explore more
              </Link>
            </div>

            <div className="relative aspect-square">
              <Image
                src={image}
                alt="Packing coffee beans"
                width={600}
                height={400}
                className="w-full h-full object-cover"
                priority
              />
              <div className="absolute inset-0 bg-black/30" />
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
