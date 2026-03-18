"use client";

import React, { useState, useEffect, useMemo } from "react";
import Reveal from "@/components/Reveal";
import { Product } from "@/types/product";
import Filter, {
  FilterState,
  SortOption,
} from "@/components/collection/Filter";
import Loading from "@/components/common/Loading";
import PageHeader from "@/components/common/PageHeader";
import CollectionContent from "@/components/collection/CollectionContent";
import { CtaSection } from "@/components/homepage/CtaSection";
import Drawer from "@/components/common/Drawer";
import Button from "@/components/common/Button";
import { COLLECTION_CTA_IMAGE, QUALITY_IMAGES } from "@/lib/images";

const DEFAULT_FILTER = (min = 0, max = 9999): FilterState => ({
  sortBy: "a-z" as SortOption,
  roasts: [],
  countries: [],
  minPrice: min,
  maxPrice: max,
});

export default function CollectionPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // pending = what's being edited in the drawer
  const [pending, setPending] = useState<FilterState>(DEFAULT_FILTER());
  // applied = what's actually active
  const [applied, setApplied] = useState<FilterState>(DEFAULT_FILTER());

  const priceBounds = useMemo(() => {
    if (!products.length) return { min: 0, max: 100 };
    const prices = products.map((p) => p.price ?? 0);
    return {
      min: Math.floor(Math.min(...prices)),
      max: Math.ceil(Math.max(...prices)),
    };
  }, [products]);

  // Once products load, set price bounds
  useEffect(() => {
    if (!products.length) return;
    const { min, max } = priceBounds;
    setPending((p) => ({ ...p, minPrice: min, maxPrice: max }));
    setApplied((p) => ({ ...p, minPrice: min, maxPrice: max }));
  }, [priceBounds, products.length]);

  const availableRoasts = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => p.category && set.add(p.category));
    return Array.from(set).sort();
  }, [products]);

  const availableCountries = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => p.country && set.add(p.country));
    return Array.from(set).sort();
  }, [products]);

  const filteredProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const matchesRoast =
        applied.roasts.length === 0 ||
        applied.roasts.includes(product.category);
      const matchesCountry =
        applied.countries.length === 0 ||
        applied.countries.includes(product.country);
      const price = product.price ?? 0;
      const matchesPrice =
        price >= applied.minPrice && price <= applied.maxPrice;
      return matchesRoast && matchesCountry && matchesPrice;
    });

    return [...filtered].sort((a, b) => {
      switch (applied.sortBy) {
        case "price-low":
          return (a.price ?? 0) - (b.price ?? 0);
        case "price-high":
          return (b.price ?? 0) - (a.price ?? 0);
        case "z-a":
          return b.name.localeCompare(a.name);
        default:
          return a.name.localeCompare(b.name);
      }
    });
  }, [products, applied]);

  // Active filter tags for display
  const activeFilterTags = useMemo(() => {
    const tags: { key: string; label: string }[] = [];
    if (
      applied.minPrice > priceBounds.min ||
      applied.maxPrice < priceBounds.max
    ) {
      tags.push({
        key: "price",
        label: `Price: CHF ${applied.minPrice} – ${applied.maxPrice}`,
      });
    }
    applied.roasts.forEach((r) =>
      tags.push({ key: `roast:${r}`, label: `Roast: ${r}` }),
    );
    applied.countries.forEach((c) =>
      tags.push({ key: `country:${c}`, label: `Country: ${c}` }),
    );
    return tags;
  }, [applied, priceBounds]);

  const openFilters = () => {
    setPending({ ...applied }); // sync pending to current applied
    setShowFilters(true);
  };

  const applyFilters = () => {
    setApplied({ ...pending });
    setShowFilters(false);
  };

  const resetFilters = () => {
    const fresh = DEFAULT_FILTER(priceBounds.min, priceBounds.max);
    setPending(fresh);
    setApplied(fresh);
  };

  const removeFilter = (key: string) => {
    setApplied((prev) => {
      if (key === "price") {
        return {
          ...prev,
          minPrice: priceBounds.min,
          maxPrice: priceBounds.max,
        };
      }
      if (key.startsWith("roast:")) {
        return {
          ...prev,
          roasts: prev.roasts.filter((r) => r !== key.slice(6)),
        };
      }
      if (key.startsWith("country:")) {
        return {
          ...prev,
          countries: prev.countries.filter((c) => c !== key.slice(8)),
        };
      }
      return prev;
    });
  };

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
    <>
      <Reveal>
        <PageHeader
          title="Craft coffee selection"
          description="Discover our carefully curated collection of premium coffee beans sourced from the world's finest growing regions."
          backgroundImage={QUALITY_IMAGES[0]}
        />
      </Reveal>

      <Reveal delay={0.08}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 lg:pb-24">
          <CollectionContent
            filteredProducts={filteredProducts}
            loading={loading}
            onOpenFilters={openFilters}
            activeFilterTags={activeFilterTags}
            onRemoveFilter={removeFilter}
            onClearFilters={resetFilters}
          />
        </div>
      </Reveal>

      <Drawer
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        title="filters"
        side="right"
        width="md:w-[420px]"
        footer={
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={resetFilters}
              className="flex-1"
            >
              clear all
            </Button>
            <Button variant="primary" onClick={applyFilters} className="flex-1">
              apply
            </Button>
          </div>
        }
      >
        <Filter
          state={pending}
          onChange={setPending}
          priceBounds={priceBounds}
          availableRoasts={availableRoasts}
          availableCountries={availableCountries}
          activeFilterTags={activeFilterTags}
          onRemoveFilter={removeFilter}
        />
      </Drawer>

      <Reveal delay={0.08}>
        <CtaSection
          subtitle="Have questions?"
          title="We&apos;d love to help you find your perfect cup"
          buttons={[
            { label: "Contact us", href: "/contact", variant: "primary" },
            { label: "Our story", href: "/about", variant: "outline" },
          ]}
          image={COLLECTION_CTA_IMAGE}
        />
      </Reveal>
    </>
  );
}
