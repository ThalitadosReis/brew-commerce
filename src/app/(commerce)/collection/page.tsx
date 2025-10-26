"use client";

import React, { useState, useEffect, useRef } from "react";
import { Product } from "@/types/product";
import Filter, { SortOption } from "@/components/collection/Filter";

import Loading from "@/components/common/Loading";
import PageHeader from "@/components/common/PageHeader";
import CollectionContent from "@/components/collection/CollectionContent";
import QualitySection from "@/components/collection/QualitySection";
import ContentBlock from "@/components/common/ContentBlock";
import { COLLECTION_CONTACT_IMAGE } from "@/lib/images.collection";

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

  if (loading) return <Loading message="Loading..." />;

  return (
    <div className="bg-black/5 py-24 space-y-24">
      <PageHeader
        title="Craft coffee selection"
        description="Discover our carefully curated collection of premium coffee beans sourced from the world's finest growing regions."
      />

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
      <ContentBlock
        className="bg-white"
        title="Brew your perfect moment"
        text="Discover a world of flavor with fresh coffee delivered directly to your doorstep."
        image={COLLECTION_CONTACT_IMAGE}
        buttons={[
          { label: "Contact us", href: "/contact", variant: "primary" },
          { label: "Learn more", href: "/about", variant: "secondary" },
        ]}
      />
    </div>
  );
}
