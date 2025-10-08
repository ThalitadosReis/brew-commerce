"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";

import { allProducts } from "@/data/products";
import { useWishlist } from "@/contexts/WishlistContext";
import Filter, { SortDropdown, SortOption } from "@/components/Filter";
import ImageCard from "@/components/ImageCard";
import Pagination from "@/components/Pagination";

import {
  ArrowDownIcon,
  CaretRightIcon,
  SmileySadIcon,
} from "@phosphor-icons/react";

export default function CollectionPage() {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const collectionRef = useRef<HTMLDivElement>(null);

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

  // scroll to top when page changes and down to collection
  useEffect(() => {
    collectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [currentPage]);

  const scrollToCollection = () => {
    collectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="min-h-screen bg-secondary/10">
      {/* header */}
      <div className="relative overflow-hidden h-[24rem] md:h-[28rem] lg:h-[44rem] flex flex-col justify-end">
        <div
          className="absolute inset-0 -z-10 w-full h-full bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.pexels.com/photos/12165304/pexels-photo-12165304.jpeg?_gl=1*17iakhk*_ga*MTE1NTcwMTQwLjE3NTU4ODU3NjQ.*_ga_8JE65Q40S6*czE3NTk5MDg0OTMkbzI4JGcxJHQxNzU5OTA4NTc3JGozNiRsMCRoMA..')",
          }}
        ></div>

        <div className="absolute inset-0 -z-10 bg-black/30"></div>

        <div className="max-w-7xl mx-auto w-full z-10 p-8">
          <h2 className="font-display text-white text-5xl md:text-6xl lg:text-7xl">
            Our
            <br className="block" />
            Collection
          </h2>
          <div className="mt-4 flex flex-col lg:flex-row lg:justify-between lg:items-end">
            <p className="w-full md:w-2/3 text-sm md:text-base font-body text-white/70">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>

            <div className="hidden lg:block">
              <button
                onClick={scrollToCollection}
                className="flex items-center gap-2 text-sm text-white font-display italic group overflow-hidden whitespace-nowrap"
              >
                Explore Collection
                <span className="relative w-4 h-4 inline-block">
                  <ArrowDownIcon
                    size={16}
                    weight="light"
                    className="absolute left-0 top-0 transition-transform duration-300 group-hover:-translate-y-full"
                  />
                  <ArrowDownIcon
                    size={16}
                    weight="light"
                    className="absolute left-0 top-full transition-transform duration-300 group-hover:-translate-y-full"
                  />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        ref={collectionRef}
        className="max-w-7xl mx-auto px-8 py-10 lg:py-20 lg:flex lg:gap-12"
      >
        {/* filter */}
        <div className="lg:sticky lg:top-10 h-fit">
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

        {/* content */}
        <div className="flex-1">
          {/* breadcrumb + sort */}
          <div className="flex items-center justify-between mb-2">
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
              <span className="text-primary underline">Shop</span>
            </div>
            <SortDropdown sortBy={sortBy} setSortBy={setSortBy} />
          </div>

          {/* product grid */}
          {filteredAndSortedProducts.length === 0 ? (
            <div className="mx-auto text-center py-20">
              <SmileySadIcon size={72} weight="light" className="mx-auto" />
              <div>
                <h3 className="uppercase font-body text-xl text-primary">
                  No products found
                </h3>
                <p className="font-body text-secondary/70">
                  Try adjusting your filters
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
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
    </section>
  );
}
