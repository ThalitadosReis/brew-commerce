"use client";

import React, { useState } from "react";
import { roastLevels, countries, sizes } from "@/data/products";

import { CaretDownIcon, CheckIcon } from "@phosphor-icons/react";

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
    { value: "price-low", label: "Price (Low to High)" },
    { value: "price-high", label: "Price (High to Low)" },
  ];

  return (
    <div className="relative inline-flex items-center">
      <span className="text-sm select-none pointer-events-none">
        <span className="text-secondary/70">Sort by </span>
        {options.find((o) => o.value === sortBy)?.label}
      </span>

      <CaretDownIcon
        size={12}
        weight="light"
        className="ml-1 text-secondary pointer-events-none"
      />

      {/* invisible native select on top for accessibility */}
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value as SortOption)}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
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
      {/* filter */}
      <div className="w-full space-y-8">
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="w-full p-4 lg:p-0 flex items-center justify-between bg-secondary/10 lg:bg-transparent rounded-xl lg:rounded-none transition-colors lg:mb-2"
        >
          <div className="flex items-center gap-2">
            <span className="text-xl font-display italic ">Filters</span>
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
              className="underline text-sm text-secondary/70 hover:text-primary"
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
            <span className="text-lg font-light font-display italic text-secondary/70">
              Size
            </span>
            <div className="w-full flex lg:grid lg:grid-cols-2 gap-2 mt-2">
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
                  className={`w-full px-6 py-2 text-xs rounded-lg transition-colors ${
                    selectedSizes.includes(size)
                      ? "bg-accent text-white hover:opacity-80"
                      : "bg-accent/10 hover:bg-accent/20"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* roast */}
          <div className="my-4">
            <span className="text-lg font-light font-display italic text-secondary/70">
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
                          : "border-secondary/20 hover:border-accent"
                      }`}
                    >
                      {isSelected && (
                        <CheckIcon
                          size={12}
                          weight="bold"
                          className="text-accent"
                        />
                      )}
                    </span>
                    <span>{roast}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* countries */}
          <div className="my-4">
            <span className="text-lg font-light font-display italic text-secondary/70">
              Countries
            </span>
            <div className="w-full flex flex-col gap-2 mt-2">
              {[...countries]
                .sort((a, b) => a.localeCompare(b))
                .map((country) => {
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
                      className="flex items-center gap-2 text-sm text-primary transition-colors"
                    >
                      <span
                        className={`w-5 h-5 flex items-center justify-center border rounded-sm ${
                          isSelected
                            ? "border-accent"
                            : "border-secondary/20 hover:border-accent"
                        }`}
                      >
                        {isSelected && (
                          <CheckIcon
                            size={12}
                            weight="bold"
                            className="text-accent"
                          />
                        )}
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
