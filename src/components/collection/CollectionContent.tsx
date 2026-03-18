"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Product } from "@/types/product";
import ImageCard from "@/components/collection/ImageCard";
import Loading from "../common/Loading";
import {
  GridFourIcon,
  GridNineIcon,
  XIcon,
  SlidersHorizontalIcon,
} from "@phosphor-icons/react";

interface ActiveFilterTag {
  key: string;
  label: string;
}

interface CollectionContentProps {
  filteredProducts: Product[];
  loading?: boolean;
  onOpenFilters: () => void;
  activeFilterTags: ActiveFilterTag[];
  onRemoveFilter: (key: string) => void;
  onClearFilters: () => void;
}

export default function CollectionContent({
  filteredProducts,
  loading = false,
  onOpenFilters,
  activeFilterTags,
  onRemoveFilter,
  onClearFilters,
}: CollectionContentProps) {
  const [gridDense, setGridDense] = useState(false);

  if (loading) return <Loading message="Loading products..." />;

  const gridClass = gridDense
    ? "grid-cols-2 md:grid-cols-4 lg:grid-cols-6"
    : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4";

  const columns = gridDense ? { sm: 2, md: 4, lg: 6 } : { sm: 1, md: 2, lg: 4 };

  return (
    <div className="flex-1">
      <div className="flex items-center justify-between pb-4 border-b border-black/10">
        <span className="hidden md:block text-sm text-black/60">
          {filteredProducts.length} products
        </span>

        <button
          onClick={onOpenFilters}
          className="flex md:hidden items-center gap-1.5 text-sm hover:text-black/60 transition-colors"
        >
          <SlidersHorizontalIcon size={15} />
          Filter &amp; Sort ({filteredProducts.length})
        </button>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-0.5">
            <button
              onClick={() => setGridDense(false)}
              aria-label="Large grid"
              aria-pressed={!gridDense}
              className={`p-1.5 transition-colors ${
                !gridDense ? "text-black" : "text-black/30 hover:text-black/60"
              }`}
            >
              <GridFourIcon size={20} weight="fill" />
            </button>
            <button
              onClick={() => setGridDense(true)}
              aria-label="Small grid"
              aria-pressed={gridDense}
              className={`p-1.5 transition-colors ${
                gridDense ? "text-black" : "text-black/30 hover:text-black/60"
              }`}
            >
              <GridNineIcon size={24} weight="fill" />
            </button>
          </div>

          <span className="hidden md:block w-px h-4 bg-black/25" />

          <button
            onClick={onOpenFilters}
            className="hidden md:flex items-center gap-1.5 text-sm hover:text-black/60 transition-colors"
          >
            <SlidersHorizontalIcon size={15} />
            Filter &amp; Sort
          </button>
        </div>
      </div>

      {/* active filter tags */}
      {activeFilterTags.length > 0 && (
        <div className="flex flex-wrap items-center lg:justify-center gap-2 py-4">
          {activeFilterTags.map((tag) => (
            <button
              key={tag.key}
              onClick={() => onRemoveFilter(tag.key)}
              className="flex items-center gap-1.5 border border-black/25 px-3 py-1.5 text-xs hover:bg-black/5 transition-colors"
            >
              {tag.label}
              <XIcon size={11} weight="bold" className="text-black/50" />
            </button>
          ))}
          <button
            onClick={onClearFilters}
            className="text-xs underline underline-offset-2 text-black/60 hover:text-black transition-colors ml-1"
          >
            Clear all
          </button>
        </div>
      )}

      {filteredProducts.length === 0 ? (
        <div className="mx-auto text-center pt-24">
          <h6 className="text-lg md:text-xl lg:text-2xl font-semibold">
            No products found
          </h6>
          <p className="text-base lg:text-lg text-black/50">
            Try adjusting your filters
          </p>
        </div>
      ) : (
        <div
          className={`grid gap-4 ${gridClass} ${activeFilterTags.length > 0 ? "" : "mt-6"}`}
        >
          {filteredProducts.map((product, i) => {
            const col = i % columns.lg;
            return (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: col * 0.08 + Math.floor(i / columns.lg) * 0.04,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <ImageCard
                  id={product._id}
                  name={product.name}
                  images={product.images}
                  price={product.price}
                  country={product.country}
                  product={product}
                />
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
