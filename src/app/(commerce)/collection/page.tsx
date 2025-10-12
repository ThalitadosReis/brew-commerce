"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";

import { useWishlist } from "@/contexts/WishlistContext";
import { Product } from "@/types/product";
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

  // products
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // filters
  const [sortBy, setSortBy] = useState<SortOption>("a-z");
  const [selectedRoasts, setSelectedRoasts] = useState<string[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  // fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // filteredProducts
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  // adjust per screen
  useEffect(() => {
    const updateItemsPerPage = () => {
      if (typeof window === "undefined") return;
      const isXl = window.innerWidth >= 1280;
      setItemsPerPage(isXl ? 9 : 6);
    };

    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);
    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

  // reset page on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedRoasts, selectedCountries, selectedSizes, sortBy]);

  // scroll behavior
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
              "url('https://images.pexels.com/photos/12165304/pexels-photo-12165304.jpeg')",
          }}
        />
        <div className="absolute inset-0 -z-10 bg-black/30" />

        <div className="max-w-7xl mx-auto w-full z-10 p-8">
          <h2 className="font-display text-white text-5xl md:text-6xl lg:text-7xl">
            Our
            <br className="block" />
            Collection
          </h2>

          <div className="mt-4 flex flex-col lg:flex-row lg:justify-between lg:items-end">
            <p className="w-full md:w-2/3 text-sm md:text-base font-body text-white/70">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
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
            products={products}
            onFilter={setFilteredProducts}
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

          {/* products */}
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-accent">Loading products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="mx-auto text-center py-20">
              <SmileySadIcon size={72} weight="light" className="mx-auto" />
              <h3 className="uppercase font-body text-xl text-primary">
                No products found
              </h3>
              <p className="font-body text-secondary/70">
                Try adjusting your filters
              </p>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
                {paginatedProducts.map((product) => (
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
                    isInWishlist={isInWishlist(product._id)}
                    onToggleWishlist={() =>
                      isInWishlist(product._id)
                        ? removeFromWishlist(product._id)
                        : addToWishlist({
                            id: product._id,
                            name: product.name,
                            description: product.description,
                            images:
                              product.images && product.images.length > 0
                                ? [product.image, ...product.images]
                                : [product.image, product.image],
                            price: product.price,
                            country: product.country,
                            roast: product.category,
                            sizes: product.sizes.map((s) => s.size),
                          })
                    }
                  />
                ))}
              </div>

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
