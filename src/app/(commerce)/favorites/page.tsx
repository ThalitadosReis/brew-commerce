"use client";

import React, { useState, useMemo } from "react";
import { useFavorites } from "@/contexts/FavoritesContext";
import { SortDropdown, SortOption } from "@/components/collection/Filter";
import Loading from "@/components/common/Loading";
import ImageCard from "@/components/collection/ImageCard";
import PageHeader from "@/components/common/PageHeader";
import ContentBlock from "@/components/common/ContentBlock";
import Button from "@/components/common/Button";
import { FAVORITES_CTA_IMAGE } from "@/lib/images/favorites";

export default function FavoritesPage() {
  const { favorites, loading } = useFavorites();
  const [sortBy, setSortBy] = useState<SortOption>("a-z");

  const sortedFavorites = useMemo(() => {
    return [...favorites].sort((a, b) => {
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
  }, [favorites, sortBy]);

  if (loading) return <Loading message="Loading favorites..." />;

  return (
    <div className="bg-black/5 pt-48 pb-24 space-y-24">
      <PageHeader
        title="Favourites"
        description="Your carefully selected coffee selection tells a story of taste and passion."
      />

      <section className="max-w-7xl mx-auto px-6">
        <div className="flex justify-end mb-2">
          <SortDropdown sortBy={sortBy} setSortBy={setSortBy} />
        </div>

        {sortedFavorites.length > 0 ? (
          <div className="grid md:grid-cols-3 xl:grid-cols-4 gap-4">
            {sortedFavorites.map((product) => (
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
          <div className="text-center py-24 bg-white space-y-8 flex flex-col items-center">
            <p>
              No favorites yet
              <br />
              Start adding products to your favorites list
            </p>

            <Button as="link" href="/collection" variant="tertiary">
              Start shopping
            </Button>
          </div>
        )}
      </section>

      <ContentBlock
        className="bg-white"
        title="Ready to brew your favorites?"
        text="Transform your saved selections into a delicious reality. Each coffee tells a story waiting to be savored."
        image={FAVORITES_CTA_IMAGE}
        buttons={[
          {
            label: "Explore more",
            href: "/collection",
            variant: "secondary",
          },
        ]}
      />
    </div>
  );
}
