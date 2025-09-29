"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { allProducts, roastLevels, countries } from "@/data/products";
import {
  Grid,
  List,
  ChevronDown,
  ShoppingCart,
  Frown,
  Ellipsis,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type SortOption = "name" | "price-low" | "price-high" | "rating";
type ViewMode = "grid" | "list";

export default function CollectionPage() {
  const searchParams = useSearchParams();
  const { addToCart } = useCart();

  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [sortBy, setSortBy] = useState<SortOption>("name");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRoasts, setSelectedRoasts] = useState<string[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);

  useEffect(() => {
    const searchFromUrl = searchParams.get("search");
    if (searchFromUrl) {
      setSearchQuery(searchFromUrl);
    }
  }, [searchParams]);

  const filteredAndSortedProducts = useMemo(() => {
    const filtered = allProducts.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRoast =
        selectedRoasts.length === 0 || selectedRoasts.includes(product.roast);
      const matchesCountry =
        selectedCountries.length === 0 ||
        selectedCountries.includes(product.country);

      return matchesSearch && matchesRoast && matchesCountry;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "name":
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [searchQuery, sortBy, selectedRoasts, selectedCountries]);

  return (
    <div className="min-h-screen py-20 mt-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* header */}
        <div className="text-center space-y-4 mb-8">
          <h1 className="uppercase text-onyx font-primary text-5xl md:text-6xl lg:text-7xl">
            Shop Collection
          </h1>
          <p className="text-onyx/70">
            Discover our curated selection of premium coffee beans from around
            the world.
          </p>
        </div>

        {/* controls */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 mb-6">
          {/* filters */}
          <div className="lg:hidden w-full">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-between w-full text-sm px-4 py-2 bg-onyx/10 text-onyx hover:bg-onyx/20 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span>Filters</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    showFilters ? "rotate-180" : ""
                  }`}
                />
              </div>

              {/* clear filters */}
              {(selectedRoasts.length > 0 || selectedCountries.length > 0) && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedRoasts([]);
                    setSelectedCountries([]);
                  }}
                  className="text-xs text-onyx/50 hover:text-onyx"
                >
                  Clear all
                </button>
              )}
            </button>
          </div>

          <div className="flex items-center justify-between w-full gap-2">
            {/* sort by */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="text-sm px-4 py-2 pr-10 border border-onyx/20 bg-white focus:outline-none focus:ring-2 focus:ring-serene appearance-none text-onyx"
              >
                <option value="name">Sort by Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <ChevronDown className="w-5 h-5 text-onyx/60" />
              </div>
            </div>

            {/* grid/list */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-onyx/70">
                {filteredAndSortedProducts.length} products
              </span>
              <div className="flex border border-onyx/20 overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 ${
                    viewMode === "grid"
                      ? "bg-onyx text-white"
                      : "bg-white text-onyx hover:bg-onyx/5"
                  } transition-colors`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 ${
                    viewMode === "list"
                      ? "bg-onyx text-white"
                      : "bg-white text-onyx hover:bg-onyx/5"
                  } transition-colors`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* mobile filter */}
        {showFilters && (
          <div className="lg:hidden my-2 p-6 border border-onyx/10">
            <div className="grid md:grid-cols-[1fr_2fr] space-y-8">
              {/* roast types */}
              <div>
                <label className="block font-semibold text-onyx mb-2">
                  Roast
                </label>
                <div className="space-y-2">
                  {roastLevels.map((roast) => (
                    <label
                      key={roast}
                      className="flex items-center gap-2 text-sm text-onyx"
                    >
                      <input
                        type="checkbox"
                        checked={selectedRoasts.includes(roast)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedRoasts([...selectedRoasts, roast]);
                          } else {
                            setSelectedRoasts(
                              selectedRoasts.filter((r) => r !== roast)
                            );
                          }
                        }}
                        className="w-4 h-4 text-onyx bg-transparent border-onyx/30 focus:ring-serene focus:ring-2"
                      />
                      <span>{roast}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* by countries */}
              <div>
                <label className="block font-semibold text-onyx mb-2">
                  Countries
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 space-y-2">
                  {countries.map((country) => (
                    <label
                      key={country}
                      className="flex items-center gap-2 text-sm text-onyx"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCountries.includes(country)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCountries([
                              ...selectedCountries,
                              country,
                            ]);
                          } else {
                            setSelectedCountries(
                              selectedCountries.filter((c) => c !== country)
                            );
                          }
                        }}
                        className="w-4 h-4 text-onyx bg-transparent border-onyx/30 focus:ring-serene focus:ring-2"
                      />
                      <span>{country}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* desktop sidebar filter */}
        <div className="flex">
          <div className="hidden lg:block w-56">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-onyx uppercase font-primary">
                  Filters
                </h3>
                {/* clear filters */}
                {(selectedRoasts.length > 0 ||
                  selectedCountries.length > 0) && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedRoasts([]);
                      setSelectedCountries([]);
                    }}
                    className="text-xs text-onyx/50 hover:text-onyx"
                  >
                    Clear all
                  </button>
                )}
              </div>

              <div className="space-y-6">
                {/* roast filter */}
                <div>
                  <label className="block text-sm font-medium text-onyx mb-3">
                    Roast Types
                  </label>
                  <div className="space-y-2">
                    {roastLevels.map((roast) => (
                      <label
                        key={roast}
                        className="flex items-center gap-2 text-sm text-onyx"
                      >
                        <input
                          type="checkbox"
                          checked={selectedRoasts.includes(roast)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedRoasts([...selectedRoasts, roast]);
                            } else {
                              setSelectedRoasts(
                                selectedRoasts.filter((r) => r !== roast)
                              );
                            }
                          }}
                          className="w-4 h-4 text-onyx bg-transparent border-onyx/30 focus:ring-serene focus:ring-2"
                        />
                        <span>{roast}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Countries Filter */}
                <div>
                  <label className="block text-sm font-medium text-onyx mb-3">
                    Countries
                  </label>
                  <div className="space-y-2">
                    {countries.map((country) => (
                      <label
                        key={country}
                        className="flex items-center gap-2 text-sm text-onyx"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCountries.includes(country)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedCountries([
                                ...selectedCountries,
                                country,
                              ]);
                            } else {
                              setSelectedCountries(
                                selectedCountries.filter((c) => c !== country)
                              );
                            }
                          }}
                          className="w-4 h-4 text-onyx bg-transparent border-onyx/30 focus:ring-serene focus:ring-2"
                        />
                        <span>{country}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* product */}
          <div className="flex-1">
            {/* grid/list */}
            {filteredAndSortedProducts.length === 0 ? (
              <div className="text-center py-20">
                <Frown className="h-16 w-16 text-onyx/20 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-onyx mb-2">
                  No products found
                </h3>
                <p className="text-onyx/70">
                  Try adjusting your search or filters
                </p>
              </div>
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "grid md:grid-cols-3 xl:grid-cols-4"
                    : "space-y-4"
                }
              >
                {filteredAndSortedProducts.map((product) => (
                  <div
                    key={product.id}
                    className={` ${
                      viewMode === "list" ? "flex gap-6 p-6" : "p-6"
                    }`}
                  >
                    {/* image*/}
                    <div
                      className={`relative bg-gray/20 flex items-center justify-center ${
                        viewMode === "list"
                          ? "w-48 h-48 flex-shrink-0"
                          : "w-full h-48 mb-4"
                      }`}
                    >
                      <Image
                        src="/mockup-coffee.png"
                        alt={product.name}
                        fill
                        className="object-contain"
                      />

                      {viewMode === "grid" && (
                        <>
                          {/* link to product page */}
                          <Link
                            href={`/product`}
                            // href={`/products/${product.id}`}
                            className="absolute bottom-10 right-0 bg-white p-2 hover:bg-gray transition-colors group"
                            title="View Product"
                          >
                            <Ellipsis className="h-4 w-4 text-onyx" />
                          </Link>

                          {/* add to cart */}
                          <button
                            onClick={() => addToCart(product)}
                            className="absolute bottom-2 right-0 bg-onyx text-white p-2 hover:bg-gray transition-colors group"
                            title="Add to cart"
                          >
                            <ShoppingCart className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>

                    {/* product details */}
                    <div
                      className={`space-y-3 ${
                        viewMode === "list" ? "flex-1" : ""
                      }`}
                    >
                      <h3
                        className={`font-semibold text-onyx ${
                          viewMode === "list" ? "text-lg" : "text-xl"
                        }`}
                      >
                        {product.name}
                      </h3>

                      <p className="text-onyx/80 text-sm">
                        {product.description}
                      </p>

                      <div className="flex items-end justify-between">
                        <div className="flex flex-col">
                          <span className="text-sm text-onyx/60">
                            {product.country}
                          </span>
                          <span className="text-tiny text-onyx/60">
                            {product.roast} Roast
                          </span>
                        </div>
                        <span className="text-lg text-onyx">
                          CHF{product.price}
                        </span>
                      </div>

                      {viewMode === "list" && (
                        <button
                          onClick={() => addToCart(product)}
                          className="uppercase font-primary bg-onyx text-white px-8 py-2 text-sm font-medium hover:bg-gray transition-colors"
                        >
                          Add to Cart
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
