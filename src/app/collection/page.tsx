"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { ChevronRight, Frown } from "lucide-react";
import { useWishlist } from "@/contexts/WishlistContext";
import { allProducts } from "@/data/products";
import ImageCard from "@/components/ImageCard";
import Filter, { SortDropdown, SortOption } from "@/components/Filter";
import Pagination from "@/components/Pagination";

export default function CollectionPage() {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  // filter state
  const [sortBy, setSortBy] = useState<SortOption>("a-z");
  const [selectedRoasts, setSelectedRoasts] = useState<string[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  // filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    const filtered = allProducts.filter((product) => {
      const matchesRoast =
        selectedRoasts.length === 0 || selectedRoasts.includes(product.roast);
      const matchesCountry =
        selectedCountries.length === 0 ||
        selectedCountries.includes(product.country);
      const matchesSize =
        selectedSizes.length === 0 ||
        selectedSizes.some((size) => product.sizes.includes(size));

      return matchesRoast && matchesCountry && matchesSize;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "z-a":
          return b.name.localeCompare(a.name);
        case "a-z":
        default:
          return a.name.localeCompare(b.name);
      }
    });
  }, [sortBy, selectedRoasts, selectedCountries, selectedSizes]);

  // calculate pagination
  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedProducts.slice(
      startIndex,
      startIndex + itemsPerPage
    );
  }, [filteredAndSortedProducts, currentPage, itemsPerPage]);

  // update items per page based on screen size
  useEffect(() => {
    const updateItemsPerPage = () => {
      if (typeof window === "undefined") return;
      setItemsPerPage(window.innerWidth >= 1024 ? 9 : 6);
    };

    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);
    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

  // reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedRoasts, selectedCountries, selectedSizes, sortBy]);

  // scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="relative z-10 py-10 space-y-6">
          {/* header */}
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-primary">
                Our Collection
              </h2>
              <p className="text-sm md:text-base font-body opacity-50">
                Discover our curated selection of premium coffee beans
              </p>
            </div>
          </div>

          <div className="lg:flex lg:gap-16">
            {/* filter sidebar */}
            <div className="lg:sticky lg:top-10 h-fit py-10">
              <Filter
                showFilters={showFilters}
                onClose={() => setShowFilters(false)}
                sortBy={sortBy}
                setSortBy={setSortBy}
                selectedRoasts={selectedRoasts}
                setSelectedRoasts={setSelectedRoasts}
                selectedCountries={selectedCountries}
                setSelectedCountries={setSelectedCountries}
                selectedSizes={selectedSizes}
                setSelectedSizes={setSelectedSizes}
              />
            </div>

            {/* product content */}
            <div className="flex-1">
              {/* breadcrumb + sort */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex gap-2 items-center text-sm">
                  <Link
                    href="/"
                    className="text-muted/70 hover:text-primary cursor-pointer"
                  >
                    Home
                  </Link>
                  <ChevronRight className="w-3 h-3 text-muted/70" />
                  <span className="text-primary underline">Shop</span>
                </div>
                <SortDropdown sortBy={sortBy} setSortBy={setSortBy} />
              </div>

              {/* product list */}
              {filteredAndSortedProducts.length === 0 ? (
                <div className="mx-auto text-center py-20 space-y-2">
                  <Frown className="h-16 w-16 text-accent/50 mx-auto" />
                  <div>
                    <h3 className="uppercase font-body text-xl text-primary">
                      No products found
                    </h3>
                    <p className="font-body text-muted">
                      Try adjusting your filters
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {paginatedProducts.map((product) => (
                      <ImageCard
                        key={product.id}
                        id={product.id}
                        name={product.name}
                        images={product.images}
                        price={product.price}
                        country={product.country}
                        isInWishlist={isInWishlist(product.id)}
                        onToggleWishlist={() =>
                          isInWishlist(product.id)
                            ? removeFromWishlist(product.id)
                            : addToWishlist(product)
                        }
                      />
                    ))}
                  </div>

                  {/* pagination */}
                  {totalPages > 1 && (
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      setCurrentPage={setCurrentPage}
                    />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
