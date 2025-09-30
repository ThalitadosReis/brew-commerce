"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { allProducts, roastLevels, countries } from "@/data/products";
import { ChevronDown, ChevronLeft, ChevronRight, Frown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

type SortOption = "name" | "price-low" | "price-high";

export default function CollectionPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addToCart } = useCart();

  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [sortBy, setSortBy] = useState<SortOption>("name");
  const [showFilters, setShowFilters] = useState(false);
  const [mobileRoastOpen, setMobileRoastOpen] = useState(false);
  const [mobileCountriesOpen, setMobileCountriesOpen] = useState(false);
  const [mobilePriceOpen, setMobilePriceOpen] = useState(false);
  const [mobileSortOpen, setMobileSortOpen] = useState(false);
  const [desktopRoastOpen, setDesktopRoastOpen] = useState(true);
  const [desktopCountriesOpen, setDesktopCountriesOpen] = useState(true);
  const [desktopPriceOpen, setDesktopPriceOpen] = useState(true);
  const [desktopSortOpen, setDesktopSortOpen] = useState(true);
  const [selectedRoasts, setSelectedRoasts] = useState<string[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

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
      const matchesPrice =
        product.price >= priceRange[0] && product.price <= priceRange[1];

      return matchesSearch && matchesRoast && matchesCountry && matchesPrice;
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
  }, [searchQuery, sortBy, selectedRoasts, selectedCountries, priceRange]);

  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedProducts.slice(
      startIndex,
      startIndex + itemsPerPage
    );
  }, [filteredAndSortedProducts, currentPage, itemsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedRoasts, selectedCountries, priceRange, sortBy]);

  return (
    <div className="min-h-screen">
      {/* header */}
      <div className="relative overflow-hidden h-80 lg:h-96 pt-20">
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://images.pexels.com/photos/894695/pexels-photo-894695.jpeg?_gl=1*4zlw1m*_ga*MTE1NTcwMTQwLjE3NTU4ODU3NjQ.*_ga_8JE65Q40S6*czE3NTkwNTIwODYkbzIxJGcxJHQxNzU5MDUyMTAzJGo0MyRsMCRoMA..')",
          }}
        >
          <div className="absolute inset-0 bg-black/30"></div>
        </div>
      </div>

      {/* content */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white mx-auto py-10 rounded-t-4xl -mt-10 relative z-10 space-y-6">
          {/* header section */}
          <div className="flex items-start justify-between px-4 sm:px-6">
            <div>
              <h2 className="uppercase text-2xl sm:text-3xl font-display font-bold text-primary">
                Our Collection
              </h2>
              <p className="text-sm sm:text-base text-accent mt-1">
                Discover our curated selection of premium coffee beans
              </p>
            </div>
            {/* mobile filter toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden underline font-semibold text-sm text-primary hover:text-accent transition-colors"
            >
              Filter
            </button>
          </div>

          {/* mobile filter */}
          {showFilters && (
            <div className="lg:hidden p-4 bg-neutral/30 rounded-lg space-y-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base font-bold text-primary">Filters</h3>
                {(selectedRoasts.length > 0 ||
                  selectedCountries.length > 0 ||
                  priceRange[0] !== 0 ||
                  priceRange[1] !== 100 ||
                  sortBy !== "name") && (
                  <button
                    onClick={() => {
                      setSelectedRoasts([]);
                      setSelectedCountries([]);
                      setPriceRange([0, 100]);
                      setSortBy("name");
                    }}
                    className="text-xs text-accent hover:text-primary underline font-medium"
                  >
                    Reset
                  </button>
                )}
              </div>

              {/* sort by row */}
              <div className="border-b border-neutral pb-3">
                <button
                  onClick={() => setMobileSortOpen(!mobileSortOpen)}
                  className="flex items-center justify-between w-full"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-primary">Sort By</span>
                    <span className="text-xs font-bold text-primary">
                      {sortBy === "name" && "Name"}
                      {sortBy === "price-low" && "Price: Low to High"}
                      {sortBy === "price-high" && "Price: High to Low"}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-accent transition-transform ${
                      mobileSortOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {mobileSortOpen && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {[
                      { value: "name", label: "Name" },
                      { value: "price-low", label: "Low to High" },
                      { value: "price-high", label: "High to Low" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setSortBy(option.value as SortOption)}
                        className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                          sortBy === option.value
                            ? "bg-primary text-white border-primary font-bold"
                            : "bg-white text-secondary border-neutral hover:border-primary"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* price range row */}
              <div className="border-b border-neutral pb-3">
                <button
                  onClick={() => setMobilePriceOpen(!mobilePriceOpen)}
                  className="flex items-center justify-between w-full"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-primary">Price Range</span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-accent transition-transform ${
                      mobilePriceOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {mobilePriceOpen && (
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between text-xs text-accent">
                      <span>CHF {priceRange[0]}</span>
                      <span>CHF {priceRange[1]}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        max={priceRange[1]}
                        value={priceRange[0]}
                        onChange={(e) =>
                          setPriceRange([
                            Math.min(
                              parseInt(e.target.value) || 0,
                              priceRange[1]
                            ),
                            priceRange[1],
                          ])
                        }
                        className="w-full px-2 py-2 text-xs border border-neutral rounded text-primary focus:outline-none"
                        placeholder="Min"
                      />
                      -
                      <input
                        type="number"
                        min={priceRange[0]}
                        max="100"
                        value={priceRange[1]}
                        onChange={(e) =>
                          setPriceRange([
                            priceRange[0],
                            Math.max(
                              parseInt(e.target.value) || 100,
                              priceRange[0]
                            ),
                          ])
                        }
                        className="w-full px-2 py-2 text-xs border border-neutral rounded text-primary focus:outline-none"
                        placeholder="Max"
                      />
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([priceRange[0], parseInt(e.target.value)])
                      }
                      className="w-full h-1 bg-neutral rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                  </div>
                )}
              </div>

              {/* roast types row */}
              <div className="border-b border-neutral pb-3">
                <button
                  onClick={() => setMobileRoastOpen(!mobileRoastOpen)}
                  className="flex items-center justify-between w-full"
                >
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm text-primary">Roast</span>
                    {selectedRoasts.length > 0 && (
                      <span className="text-xs font-bold text-primary">
                        {selectedRoasts.join(", ")}
                      </span>
                    )}
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-accent transition-transform flex-shrink-0 ${
                      mobileRoastOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {mobileRoastOpen && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {roastLevels.map((roast) => (
                      <button
                        key={roast}
                        onClick={() => {
                          if (selectedRoasts.includes(roast)) {
                            setSelectedRoasts(
                              selectedRoasts.filter((r) => r !== roast)
                            );
                          } else {
                            setSelectedRoasts([...selectedRoasts, roast]);
                          }
                        }}
                        className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                          selectedRoasts.includes(roast)
                            ? "bg-primary text-white border-primary font-bold"
                            : "bg-white text-secondary border-neutral hover:border-primary"
                        }`}
                      >
                        {roast}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* countries row */}
              <div>
                <button
                  onClick={() => setMobileCountriesOpen(!mobileCountriesOpen)}
                  className="flex items-center justify-between w-full"
                >
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm text-primary">Countries</span>
                    {selectedCountries.length > 0 && (
                      <span className="text-xs font-bold text-primary">
                        {selectedCountries.slice(0, 2).join(", ")}
                        {selectedCountries.length > 2 &&
                          ` +${selectedCountries.length - 2}`}
                      </span>
                    )}
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-accent transition-transform flex-shrink-0 ${
                      mobileCountriesOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {mobileCountriesOpen && (
                  <div className="mt-3 flex flex-wrap gap-2 max-h-64 overflow-y-auto">
                    {countries.map((country) => (
                      <button
                        key={country}
                        onClick={() => {
                          if (selectedCountries.includes(country)) {
                            setSelectedCountries(
                              selectedCountries.filter((c) => c !== country)
                            );
                          } else {
                            setSelectedCountries([
                              ...selectedCountries,
                              country,
                            ]);
                          }
                        }}
                        className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                          selectedCountries.includes(country)
                            ? "bg-primary text-white border-primary font-bold"
                            : "bg-white text-secondary border-neutral hover:border-primary"
                        }`}
                      >
                        {country}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* show results button */}
              <button
                onClick={() => setShowFilters(false)}
                className="w-full mt-4 py-3 bg-primary text-white rounded-full font-semibold hover:bg-secondary transition-colors text-sm"
              >
                Show {filteredAndSortedProducts.length}{" "}
                {filteredAndSortedProducts.length === 1 ? "result" : "results"}
              </button>
            </div>
          )}

          <div className="flex gap-6 lg:gap-8">
            {/* desktop sidebar filter */}
            <div className="hidden lg:block w-64">
              <div className="sticky top-24 bg-neutral/20 rounded-lg p-4 space-y-3">
                {/* header */}
                <div className="flex items-center justify-between pb-3 border-b border-neutral/50">
                  <h3 className="text-base font-bold text-primary">Filters</h3>
                  {(selectedRoasts.length > 0 ||
                    selectedCountries.length > 0 ||
                    priceRange[0] !== 0 ||
                    priceRange[1] !== 100 ||
                    sortBy !== "name") && (
                    <button
                      onClick={() => {
                        setSelectedRoasts([]);
                        setSelectedCountries([]);
                        setPriceRange([0, 100]);
                        setSortBy("name");
                      }}
                      className="text-xs text-accent hover:text-primary underline font-medium"
                    >
                      Reset
                    </button>
                  )}
                </div>

                {/* sort by row */}
                <div className="border-b border-neutral/50 py-2">
                  <button
                    onClick={() => setDesktopSortOpen(!desktopSortOpen)}
                    className="flex items-center justify-between w-full py-1"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-primary">
                        Sort By
                      </span>
                      <span className="text-xs font-bold text-primary">
                        {sortBy === "name" && "Name"}
                        {sortBy === "price-low" && "Low to High"}
                        {sortBy === "price-high" && "High to Low"}
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-accent transition-transform ${
                        desktopSortOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {desktopSortOpen && (
                    <div className="mt-3 mb-1 flex flex-wrap gap-1.5">
                      {[
                        { value: "name", label: "Name" },
                        { value: "price-low", label: "Low to High" },
                        { value: "price-high", label: "High to Low" },
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setSortBy(option.value as SortOption)}
                          className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                            sortBy === option.value
                              ? "bg-primary text-white border-primary font-bold"
                              : "bg-white text-secondary border-neutral hover:border-primary"
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* price range row */}
                <div className="border-b border-neutral/50 py-2">
                  <button
                    onClick={() => setDesktopPriceOpen(!desktopPriceOpen)}
                    className="flex items-center justify-between w-full py-1"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-primary">
                        Price Range
                      </span>
                      {(priceRange[0] !== 0 || priceRange[1] !== 100) && (
                        <span className="text-xs font-bold text-primary">
                          CHF {priceRange[0]}-{priceRange[1]}
                        </span>
                      )}
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-accent transition-transform ${
                        desktopPriceOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {desktopPriceOpen && (
                    <div className="mt-3 mb-1 space-y-2">
                      <div className="flex items-center justify-between text-xs text-accent">
                        <span>CHF {priceRange[0]}</span>
                        <span>CHF {priceRange[1]}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="0"
                          max={priceRange[1]}
                          value={priceRange[0]}
                          onChange={(e) =>
                            setPriceRange([
                              Math.min(
                                parseInt(e.target.value) || 0,
                                priceRange[1]
                              ),
                              priceRange[1],
                            ])
                          }
                          className="w-full px-2 py-1.5 text-xs border border-neutral rounded text-primary focus:outline-none"
                          placeholder="Min"
                        />
                        -
                        <input
                          type="number"
                          min={priceRange[0]}
                          max="100"
                          value={priceRange[1]}
                          onChange={(e) =>
                            setPriceRange([
                              priceRange[0],
                              Math.max(
                                parseInt(e.target.value) || 100,
                                priceRange[0]
                              ),
                            ])
                          }
                          className="w-full px-2 py-1.5 text-xs border border-neutral rounded text-primary focus:outline-none"
                          placeholder="Max"
                        />
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={priceRange[1]}
                        onChange={(e) =>
                          setPriceRange([
                            priceRange[0],
                            parseInt(e.target.value),
                          ])
                        }
                        className="w-full h-1 bg-neutral rounded-lg appearance-none cursor-pointer accent-primary"
                      />
                    </div>
                  )}
                </div>

                {/* roast types row */}
                <div className="border-b border-neutral/50 py-2">
                  <button
                    onClick={() => setDesktopRoastOpen(!desktopRoastOpen)}
                    className="flex items-center justify-between w-full py-1"
                  >
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-primary">
                        Roast
                      </span>
                      {selectedRoasts.length > 0 && (
                        <span className="text-xs font-bold text-primary">
                          {selectedRoasts.join(", ")}
                        </span>
                      )}
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-accent transition-transform flex-shrink-0 ${
                        desktopRoastOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {desktopRoastOpen && (
                    <div className="mt-3 mb-1 flex flex-wrap gap-1.5">
                      {roastLevels.map((roast) => (
                        <button
                          key={roast}
                          onClick={() => {
                            if (selectedRoasts.includes(roast)) {
                              setSelectedRoasts(
                                selectedRoasts.filter((r) => r !== roast)
                              );
                            } else {
                              setSelectedRoasts([...selectedRoasts, roast]);
                            }
                          }}
                          className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                            selectedRoasts.includes(roast)
                              ? "bg-primary text-white border-primary font-bold"
                              : "bg-white text-secondary border-neutral hover:border-primary"
                          }`}
                        >
                          {roast}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* countries row */}
                <div className="py-2">
                  <button
                    onClick={() =>
                      setDesktopCountriesOpen(!desktopCountriesOpen)
                    }
                    className="flex items-center justify-between w-full py-1"
                  >
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-primary">
                        Countries
                      </span>
                      {selectedCountries.length > 0 && (
                        <span className="text-xs font-bold text-primary">
                          {selectedCountries.slice(0, 2).join(", ")}
                          {selectedCountries.length > 2 &&
                            ` +${selectedCountries.length - 2}`}
                        </span>
                      )}
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-accent transition-transform flex-shrink-0 ${
                        desktopCountriesOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {desktopCountriesOpen && (
                    <div className="mt-3 mb-1 flex flex-wrap gap-1.5 max-h-64 overflow-y-auto">
                      {countries.map((country) => (
                        <button
                          key={country}
                          onClick={() => {
                            if (selectedCountries.includes(country)) {
                              setSelectedCountries(
                                selectedCountries.filter((c) => c !== country)
                              );
                            } else {
                              setSelectedCountries([
                                ...selectedCountries,
                                country,
                              ]);
                            }
                          }}
                          className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                            selectedCountries.includes(country)
                              ? "bg-primary text-white border-primary font-bold"
                              : "bg-white text-secondary border-neutral hover:border-primary"
                          }`}
                        >
                          {country}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* bottom section with result count */}
                <div className="pt-3 border-t border-neutral/50">
                  <div className="text-sm font-bold text-primary text-center px-2.5 py-2 bg-neutral/50 rounded-lg">
                    {filteredAndSortedProducts.length}{" "}
                    {filteredAndSortedProducts.length === 1
                      ? "result"
                      : "results"}
                  </div>
                </div>
              </div>
            </div>

            {/* product grid */}
            <div className="flex-1">
              {filteredAndSortedProducts.length === 0 ? (
                <div className="text-center py-20">
                  <Frown className="h-16 w-16 text-neutral mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-primary mb-2">
                    No products found
                  </h3>
                  <p className="text-accent">
                    Try adjusting your search or filters
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid md:grid-cols-3 gap-8">
                    {paginatedProducts.map((product) => (
                      <div key={product.id} className="space-y-4">
                        <div className="relative aspect-square bg-neutral/50 rounded-3xl overflow-hidden">
                          <span className="absolute top-2 right-2 z-10 bg-white border border-neutral text-secondary font-medium text-xs px-3 py-1 rounded-full">
                            {product.country}
                          </span>
                          <Link href={`/collection/${product.id}`}>
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              className="object-contain hover:scale-105 transition-transform duration-300"
                            />
                          </Link>
                        </div>

                        <div className="space-y-3">
                          <h3 className="font-semibold text-primary text-lg">
                            {product.name}
                          </h3>

                          <div className="flex items-baseline justify-between">
                            <span className="text-sm text-accent">
                              {product.roast}
                            </span>
                            <span className="text-xl font-semibold text-primary">
                              CHF{product.price}
                            </span>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => addToCart(product)}
                              className="w-full p-2 rounded-full border border-neutral text-secondary hover:bg-primary hover:text-white transition-all text-sm font-medium"
                            >
                              Add to Cart
                            </button>
                            <button
                              onClick={() => {
                                addToCart(product);
                                router.push("/cart");
                              }}
                              className="w-full p-2 rounded-full bg-primary text-white hover:bg-secondary transition-all text-sm font-medium"
                            >
                              Buy Now
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* pagination */}
                  {totalPages > 1 && (
                    <div className="mt-12 pt-4 border-t border-neutral">
                      <div className="flex items-center justify-between gap-4">
                        <button
                          onClick={() =>
                            setCurrentPage((prev) => Math.max(1, prev - 1))
                          }
                          disabled={currentPage === 1}
                          className={`flex items-center gap-2 ${
                            currentPage === 1
                              ? "text-accent cursor-not-allowed opacity-50"
                              : "text-primary hover:bg-neutral/30"
                          }`}
                        >
                          <ChevronLeft className="h-4 w-4" />
                          <span>Previous</span>
                        </button>

                        {/* page numbers */}
                        <div className="flex items-center gap-2">
                          {Array.from(
                            { length: totalPages },
                            (_, i) => i + 1
                          ).map((page) => (
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={`w-10 h-10 rounded-xl transition-colors ${
                                currentPage === page
                                  ? "bg-neutral"
                                  : "text-primary hover:bg-neutral/30"
                              }`}
                            >
                              {page}
                            </button>
                          ))}
                        </div>

                        <button
                          onClick={() =>
                            setCurrentPage((prev) =>
                              Math.min(totalPages, prev + 1)
                            )
                          }
                          disabled={currentPage === totalPages}
                          className={`flex items-center gap-2 transition-colors ${
                            currentPage === totalPages
                              ? "text-accent cursor-not-allowed opacity-50"
                              : "text-primary hover:bg-neutral/30"
                          }`}
                        >
                          <span>Next</span>
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
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
