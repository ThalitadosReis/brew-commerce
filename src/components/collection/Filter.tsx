"use client";

import React, { useMemo, useState, useEffect } from "react";
import { Product } from "@/types/product";
import { CaretDownIcon, CheckIcon } from "@phosphor-icons/react";
import { useDebouncedEffect } from "@/hooks/useDebouncedEffect";

const sizes = ["250g", "500g", "1kg"] as const;
export type SortOption = "a-z" | "z-a" | "price-low" | "price-high";

interface FilterProps {
  sortBy: SortOption;
  setSortBy: (sort: SortOption) => void;
  selectedRoasts: string[];
  setSelectedRoasts: (roasts: string[]) => void;
  selectedCountries: string[];
  setSelectedCountries: (countries: string[]) => void;
  selectedSizes: string[];
  setSelectedSizes: (sizes: string[]) => void;
  showFilters: boolean;
  onClose: () => void;
  products: Product[];
  onFilter: (filtered: Product[]) => void;
}

// localStorage keys for filter persistence
const LS_KEYS = {
  sortBy: "filters.sortBy",
  roasts: "filters.roasts",
  countries: "filters.countries",
  sizes: "filters.sizes",
} as const;

// sort by dropdown
export function SortDropdown({
  sortBy,
  setSortBy,
}: {
  sortBy: SortOption;
  setSortBy: (sort: SortOption) => void;
}) {
  const options = [
    { value: "a-z", label: "A-Z" },
    { value: "z-a", label: "Z-A" },
    { value: "price-low", label: "Price (Low to High)" },
    { value: "price-high", label: "Price (High to Low)" },
  ] as const;

  return (
    <div className="relative inline-flex items-center">
      <span className="text-sm select-none pointer-events-none">
        <span className="text-black/70">Sort by </span>
        {options.find((o) => o.value === sortBy)?.label}
      </span>

      <CaretDownIcon
        size={12}
        weight="light"
        className="ml-1 pointer-events-none"
      />

      {/* invisible native select */}
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value as SortOption)}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        aria-label="Sort products"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function Filter({
  sortBy,
  setSortBy,
  selectedRoasts,
  setSelectedRoasts,
  selectedCountries,
  setSelectedCountries,
  selectedSizes,
  setSelectedSizes,
  products,
  onFilter,
}: FilterProps) {
  const availableRoasts = useMemo(() => {
    const roasts = new Set<string>();
    products?.forEach((p) => p.category && roasts.add(p.category));
    return Array.from(roasts).sort();
  }, [products]);

  const availableCountries = useMemo(() => {
    const countries = new Set<string>();
    products?.forEach((p) => {
      const hasStock = p.sizes.some((s) => s.stock > 0);
      if (hasStock && p.country) countries.add(p.country);
    });
    return Array.from(countries).sort();
  }, [products]);

  const hasActiveFilters = useMemo(
    () =>
      selectedRoasts.length > 0 ||
      selectedCountries.length > 0 ||
      selectedSizes.length > 0,
    [selectedRoasts, selectedCountries, selectedSizes]
  );

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // from localStorage on first mount
  useEffect(() => {
    try {
      // sortBy
      const savedSort = window.localStorage.getItem(LS_KEYS.sortBy);
      if (
        savedSort === "a-z" ||
        savedSort === "z-a" ||
        savedSort === "price-low" ||
        savedSort === "price-high"
      ) {
        if (savedSort !== sortBy) setSortBy(savedSort as SortOption);
      }

      // roasts
      const savedRoasts = window.localStorage.getItem(LS_KEYS.roasts);
      if (savedRoasts) {
        const parsed = JSON.parse(savedRoasts);
        if (Array.isArray(parsed)) setSelectedRoasts(parsed);
      }

      // countries
      const savedCountries = window.localStorage.getItem(LS_KEYS.countries);
      if (savedCountries) {
        const parsed = JSON.parse(savedCountries);
        if (Array.isArray(parsed)) setSelectedCountries(parsed);
      }

      // sizes
      const savedSizes = window.localStorage.getItem(LS_KEYS.sizes);
      if (savedSizes) {
        const parsed = JSON.parse(savedSizes);
        if (Array.isArray(parsed)) setSelectedSizes(parsed);
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // persist to localStorage when filters change (debounced)
  useDebouncedEffect(
    () => {
      try {
        window.localStorage.setItem(LS_KEYS.sortBy, sortBy);
        window.localStorage.setItem(
          LS_KEYS.roasts,
          JSON.stringify(selectedRoasts)
        );
        window.localStorage.setItem(
          LS_KEYS.countries,
          JSON.stringify(selectedCountries)
        );
        window.localStorage.setItem(
          LS_KEYS.sizes,
          JSON.stringify(selectedSizes)
        );
      } catch {}
    },
    [sortBy, selectedRoasts, selectedCountries, selectedSizes],
    { delay: 200 }
  );

  // reset (also clears localStorage)
  const resetFilters = () => {
    setSelectedRoasts([]);
    setSelectedCountries([]);
    setSelectedSizes([]);
    setSortBy("a-z");
    try {
      window.localStorage.removeItem(LS_KEYS.sortBy);
      window.localStorage.removeItem(LS_KEYS.roasts);
      window.localStorage.removeItem(LS_KEYS.countries);
      window.localStorage.removeItem(LS_KEYS.sizes);
    } catch {}
  };

  // debounced filtering + sorting
  useDebouncedEffect(
    () => {
      if (!products) return;

      const filtered = products.filter((product) => {
        const matchesRoast =
          selectedRoasts.length === 0 ||
          selectedRoasts.includes(product.category);
        const matchesCountry =
          selectedCountries.length === 0 ||
          selectedCountries.includes(product.country);
        const matchesSize =
          selectedSizes.length === 0 ||
          product.sizes.some((s) => selectedSizes.includes(s.size));

        return matchesRoast && matchesCountry && matchesSize;
      });

      const sorted = [...filtered].sort((a, b) => {
        switch (sortBy) {
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

      onFilter(sorted);
    },
    [products, sortBy, selectedRoasts, selectedCountries, selectedSizes],
    { delay: 300 }
  );

  return (
    <div className="lg:w-40 pb-8">
      <div className="w-full space-y-8 mb-8">
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="w-full p-4 lg:p-0 flex items-center justify-between bg-black/5 lg:bg-transparent transition-colors"
          aria-expanded={isFilterOpen}
          aria-controls="filters-panel"
        >
          <div className="flex items-center gap-2">
            <span className="text-xl font-heading">Filters</span>
            <CaretDownIcon
              size={12}
              weight="light"
              className={`transition-transform lg:hidden ${
                isFilterOpen ? "rotate-180" : ""
              }`}
            />
          </div>

          {hasActiveFilters && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                resetFilters();
              }}
              className="text-xs text-black/70 hover:underline"
            >
              Reset
            </span>
          )}
        </button>

        <div
          id="filters-panel"
          className={`px-6 lg:px-0 lg:block ${
            isFilterOpen ? "block" : "hidden"
          }`}
        >
          {/* size */}
          <div className="my-6">
            <h3 className="font-heading">Size</h3>
            <div className="w-full flex flex-col gap-2 mt-2">
              {sizes.map((size) => {
                const isSelected = selectedSizes.includes(size);
                return (
                  <button
                    key={size}
                    onClick={() =>
                      isSelected
                        ? setSelectedSizes(
                            selectedSizes.filter((s) => s !== size)
                          )
                        : setSelectedSizes([...selectedSizes, size])
                    }
                    className="flex items-center gap-2 text-sm transition-colors"
                    aria-pressed={isSelected}
                    aria-label={`Toggle size ${size}`}
                  >
                    <span
                      className={`w-5 h-5 flex items-center justify-center border rounded-sm ${
                        isSelected
                          ? "border-black bg-black"
                          : "border-black/20 hover:border-black"
                      }`}
                    >
                      {isSelected && (
                        <CheckIcon
                          size={12}
                          weight="bold"
                          className="text-white"
                        />
                      )}
                    </span>
                    <span>{size}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* roast */}
          {availableRoasts.length > 0 && (
            <div className="my-6">
              <h3 className="font-heading">Roast</h3>
              <div className="w-full flex flex-col gap-2 mt-2">
                {availableRoasts.map((roast) => {
                  const isSelected = selectedRoasts.includes(roast);
                  return (
                    <button
                      key={roast}
                      onClick={() =>
                        isSelected
                          ? setSelectedRoasts(
                              selectedRoasts.filter((r) => r !== roast)
                            )
                          : setSelectedRoasts([...selectedRoasts, roast])
                      }
                      className="flex items-center gap-2 text-sm transition-colors"
                      aria-pressed={isSelected}
                      aria-label={`Toggle roast ${roast}`}
                    >
                      <span
                        className={`w-5 h-5 flex items-center justify-center border rounded-sm ${
                          isSelected
                            ? "border-black bg-black"
                            : "border-black/20 hover:border-black"
                        }`}
                      >
                        {isSelected && (
                          <CheckIcon
                            size={12}
                            weight="bold"
                            className="text-white"
                          />
                        )}
                      </span>
                      <span>{roast}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* countries */}
          {availableCountries.length > 0 && (
            <div>
              <span className="font-heading">Country</span>
              <div className="w-full flex flex-col gap-2 mt-2">
                {availableCountries.map((country) => {
                  const isSelected = selectedCountries.includes(country);
                  return (
                    <button
                      key={country}
                      onClick={() =>
                        isSelected
                          ? setSelectedCountries(
                              selectedCountries.filter((c) => c !== country)
                            )
                          : setSelectedCountries([
                              ...selectedCountries,
                              country,
                            ])
                      }
                      className="flex items-center gap-2 text-sm transition-colors"
                      aria-pressed={isSelected}
                      aria-label={`Toggle country ${country}`}
                    >
                      <span
                        className={`w-5 h-5 flex items-center justify-center border rounded-sm ${
                          isSelected
                            ? "border-black bg-black"
                            : "border-black/20 hover:border-black"
                        }`}
                      >
                        {isSelected && (
                          <CheckIcon
                            size={12}
                            weight="bold"
                            className="text-white"
                          />
                        )}
                      </span>
                      <span>{country}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
