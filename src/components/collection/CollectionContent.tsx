"use client";

import React, { useState, useMemo, useEffect } from "react";
import { SmileySadIcon } from "@phosphor-icons/react";
import { Product } from "@/types/product";
import ImageCard from "@/components/collection/ImageCard";
import { SortDropdown, SortOption } from "@/components/collection/Filter";

interface CollectionContentProps {
  filteredProducts: Product[];
  sortBy: SortOption;
  setSortBy: (option: SortOption) => void;
}

export default function CollectionContent({
  filteredProducts,
  sortBy,
  setSortBy,
}: CollectionContentProps) {
  const [itemsToShow, setItemsToShow] = useState(6);

  // display only the sliced products
  const displayedProducts = useMemo(() => {
    return filteredProducts.slice(0, itemsToShow);
  }, [filteredProducts, itemsToShow]);

  // adjust items per screen size
  useEffect(() => {
    const updateItemsToShow = () => {
      if (typeof window === "undefined") return;
      setItemsToShow(window.innerWidth >= 1280 ? 9 : 6);
    };

    updateItemsToShow();
    window.addEventListener("resize", updateItemsToShow);
    return () => window.removeEventListener("resize", updateItemsToShow);
  }, []);

  return (
    <div className="flex-1">
      <div className="flex justify-end mb-4">
        <SortDropdown sortBy={sortBy} setSortBy={setSortBy} />
      </div>

      {filteredProducts.length === 0 ? (
        <div className="mx-auto text-center py-24">
          <SmileySadIcon
            size={72}
            weight="light"
            className="mx-auto mb-2 text-black/70"
          />
          <h3 className="font-heading text-2xl text-black">
            No products found
          </h3>
          <p className="font-body text-black/70">Try adjusting your filters</p>
        </div>
      ) : (
        <>
          {/* collection grid */}
          <div className="grid md:grid-cols-3 gap-4">
            {displayedProducts.map((product) => (
              <ImageCard
                key={product._id}
                id={product._id}
                name={product.name}
                images={
                  product.images && product.images.length > 0
                    ? [product.image, ...product.images]
                    : [product.image, product.image]
                }
                price={product.price}
                country={product.country}
              />
            ))}
          </div>

          {itemsToShow < filteredProducts.length && (
            <div className="flex flex-col items-center text-center mt-16 space-y-2">
              <span className="text-xs text-black/70">
                {displayedProducts.length} of {filteredProducts.length} products
              </span>
              <button
                className="text-sm border px-6 py-3 transition duration-200 ease-in-out hover:scale-98 text-black"
                onClick={() =>
                  setItemsToShow((prev) =>
                    Math.min(prev + 6, filteredProducts.length)
                  )
                }
              >
                View more
              </button>
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
