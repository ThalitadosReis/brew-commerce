"use client";

import React, { useState } from "react";
import { roastLevels, countries, sizes } from "@/data/products";
import { Check, ChevronDown } from "lucide-react";

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
}

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
    { value: "price-low", label: "Low to High" },
    { value: "price-high", label: "High to Low" },
  ];

  return (
    <div className="flex items-center gap-1 text-sm text-muted/70">
      <span>Sort by</span>
      <div className="relative">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
          className="text-secondary focus:outline-none cursor-pointer appearance-none pr-4"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <ChevronDown className="w-3 h-3 text-muted/70 absolute right-0 pointer-events-none" />
    </div>
  );
}

export default function Filter({
  selectedRoasts,
  setSelectedRoasts,
  selectedCountries,
  setSelectedCountries,
  selectedSizes,
  setSelectedSizes,
}: FilterProps) {
  // check if any filters are active
  const hasActiveFilters =
    selectedRoasts.length > 0 ||
    selectedCountries.length > 0 ||
    selectedSizes.length > 0;

  // reset filters
  const resetFilters = () => {
    setSelectedRoasts([]);
    setSelectedCountries([]);
    setSelectedSizes([]);
  };

  // accordion state for mobile
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div className="lg:w-42">
      {/* filter mobile */}
      <div className="w-full">
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="w-full p-4 lg:p-0 flex items-center justify-between bg-muted/10 lg:bg-transparent rounded-xl lg:rounded-none transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="text-xl font-display italic">Filters</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform lg:hidden ${
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
              className="underline text-sm text-secondary hover:text-primary"
            >
              Reset
            </span>
          )}
        </button>

        <div
          className={`px-6 lg:px-0 lg:block ${
            isFilterOpen ? "block" : "hidden"
          }`}
        >
          {/* size */}
          <div className="my-4">
            <span className="text-lg font-light font-display italic text-accent/80">
              Size
            </span>
            <div className="w-full flex flex-wrap gap-2 mt-2 lg:grid lg:grid-cols-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() =>
                    selectedSizes.includes(size)
                      ? setSelectedSizes(
                          selectedSizes.filter((s) => s !== size)
                        )
                      : setSelectedSizes([...selectedSizes, size])
                  }
                  className={`lg:w-full px-6 py-2 text-xs rounded-lg transition-colors ${
                    selectedSizes.includes(size)
                      ? "bg-accent text-white"
                      : "bg-accent/10 text-primary hover:bg-accent/30"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* roast */}
          <div className="my-4">
            <span className="text-lg font-light font-display italic text-accent/80">
              Roast
            </span>
            <div className="w-full flex flex-col gap-2 mt-2">
              {roastLevels.map((roast) => {
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
                    className="flex items-center gap-2 text-sm text-primary transition-colors"
                  >
                    <span
                      className={`w-5 h-5 flex items-center justify-center border-1 rounded-sm ${
                        isSelected
                          ? "border-accent"
                          : "border-muted/20 hover:border-accent"
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 text-accent" />}
                    </span>
                    <span>{roast}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* countries */}
          <div className="my-4">
            <span className="text-lg font-light font-display italic text-accent/80">
              Countries
            </span>
            <div className="w-full flex flex-col gap-2 mt-2">
              {countries.map((country) => {
                const isSelected = selectedCountries.includes(country);
                return (
                  <button
                    key={country}
                    onClick={() =>
                      isSelected
                        ? setSelectedCountries(
                            selectedCountries.filter((c) => c !== country)
                          )
                        : setSelectedCountries([...selectedCountries, country])
                    }
                    className="flex items-center gap-2 text-sm text-primary transition-colors"
                  >
                    <span
                      className={`w-5 h-5 flex items-center justify-center border rounded-sm ${
                        isSelected
                          ? "border-accent"
                          : "border-muted/20 hover:border-accent"
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 text-accent" />}
                    </span>
                    <span>{country}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
