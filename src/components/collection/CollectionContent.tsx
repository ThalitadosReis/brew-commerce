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
    return <Loading message="Loading products..." />;
  }

  return (
    <div className="flex-1">
      <div className="flex justify-end mb-2">
        <SortDropdown sortBy={sortBy} setSortBy={setSortBy} />
      </div>

      {filteredProducts.length === 0 ? (
        <div className="mx-auto text-center pt-24">
          <h5>No products found</h5>
          <p className="font-light">Try adjusting your filters</p>
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
            <div className="flex flex-col items-center text-center mt-12 space-y-2">
              <small className="text-black/75">
                {displayedProducts.length} of {filteredProducts.length} products
              </small>
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
            <div className="mt-12 text-center">
              <small className="text-black/75">
                Showing all {filteredProducts.length} products
              </small>
            </div>
          )}
        </>
      )}
    </div>
  );
}
