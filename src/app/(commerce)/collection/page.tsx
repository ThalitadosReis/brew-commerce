"use client";

import React, { useState, useEffect, useRef } from "react";
import { Product } from "@/types/product";
import Filter, { SortOption } from "@/components/collection/Filter";
import CollectionContent from "@/components/collection/CollectionContent";
import QualitySection from "@/components/collection/QualitySection";
import ContactSection from "@/components/collection/ContactSection";

export default function CollectionPage() {
  const collectionRef = useRef<HTMLDivElement>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // filters
  const [sortBy, setSortBy] = useState<SortOption>("a-z");
  const [selectedRoasts, setSelectedRoasts] = useState<string[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [showFilters, setShowFilters] = useState(false);

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

  if (loading) {
    return (
      <div className="bg-black/5 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4" />
          <p className="text-black">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black/5 py-24 space-y-24 lg:space-y-32">
      <div className="max-w-2xl mx-auto text-center pt-24 px-6 space-y-8">
        <h1 className="text-5xl md:text-6xl font-heading text-black">
          Craft coffee selection
        </h1>
        <p className="text-sm font-body text-black/70">
          {`Discover our carefully curated collection of premium coffee beans sourced from the world's finest growing regions.`}
        </p>
      </div>

      <div
        ref={collectionRef}
        className="max-w-7xl mx-auto px-6 lg:flex lg:gap-12"
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

        <CollectionContent
          filteredProducts={filteredProducts}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />
      </div>

      <QualitySection />
      <ContactSection />
    </div>
  );
}
