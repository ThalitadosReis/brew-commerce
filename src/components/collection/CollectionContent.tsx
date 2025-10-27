"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Product } from "@/types/product";
import ImageCard from "@/components/collection/ImageCard";
import { SortDropdown, SortOption } from "@/components/collection/Filter";
import Button from "../common/Button";
import Loading from "../common/Loading";

interface CollectionContentProps {
  filteredProducts: Product[];
  sortBy: SortOption;
  setSortBy: (option: SortOption) => void;
  loading?: boolean;
}

export default function CollectionContent({
  filteredProducts,
  sortBy,
  setSortBy,
  loading = false,
}: CollectionContentProps) {
  const [itemsToShow, setItemsToShow] = useState(6);

  const displayedProducts = useMemo(() => {
    return filteredProducts.slice(0, itemsToShow);
  }, [filteredProducts, itemsToShow]);

  useEffect(() => {
    const updateItemsToShow = () => {
      if (typeof window === "undefined") return;
      setItemsToShow(window.innerWidth >= 1280 ? 9 : 6);
    };

    updateItemsToShow();
    window.addEventListener("resize", updateItemsToShow);
    return () => window.removeEventListener("resize", updateItemsToShow);
  }, []);

  if (loading) {
    return (
      <div className="py-24">
        <Loading message="Loading products..." />
      </div>
    );
  }

  return (
    <div className="flex-1">
      <div className="flex justify-end mb-4">
        <SortDropdown sortBy={sortBy} setSortBy={setSortBy} />
      </div>

      {filteredProducts.length === 0 ? (
        <div className="mx-auto text-center py-24">
         
          <h3 className="font-heading text-2xl">No products found</h3>
          <p className="font-body text-black/70">Try adjusting your filters</p>
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-3 gap-4">
            {displayedProducts.map((product) => (
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

          {itemsToShow < filteredProducts.length && (
            <div className="flex flex-col items-center text-center mt-16 space-y-2">
              <span className="text-xs text-black/70">
                {displayedProducts.length} of {filteredProducts.length} products
              </span>
              <Button
                variant="secondary"
                onClick={() =>
                  setItemsToShow((prev) =>
                    Math.min(prev + 6, filteredProducts.length)
                  )
                }
              >
                View more
              </Button>
            </div>
          )}

          {itemsToShow >= filteredProducts.length && (
            <div className="text-center mt-6 text-sm text-black/70">
              Showing all {filteredProducts.length} products
            </div>
          )}
        </>
      )}
    </div>
  );
}
