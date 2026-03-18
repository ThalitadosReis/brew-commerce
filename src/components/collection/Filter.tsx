"use client";

import React, { useState } from "react";
import {
  CaretDownIcon,
  CheckIcon,
  DotOutlineIcon,
  XIcon,
} from "@phosphor-icons/react";

export type SortOption = "a-z" | "z-a" | "price-low" | "price-high";

export interface FilterState {
  sortBy: SortOption;
  roasts: string[];
  countries: string[];
  minPrice: number;
  maxPrice: number;
}

export interface FilterProps {
  state: FilterState;
  onChange: (state: FilterState) => void;
  priceBounds: { min: number; max: number };
  availableRoasts: string[];
  availableCountries: string[];
  activeFilterTags: { key: string; label: string }[];
  onRemoveFilter: (key: string) => void;
}

export const SORT_OPTIONS = [
  { value: "a-z" as const, label: "A - Z" },
  { value: "z-a" as const, label: "Z - A" },
  { value: "price-low" as const, label: "Price: Low to High" },
  { value: "price-high" as const, label: "Price: High to Low" },
];

function AccordionSection({
  label,
  isOpen,
  onToggle,
  children,
}: {
  label: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-black/10">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between py-4 text-sm font-medium text-left"
      >
        {label}
        <CaretDownIcon
          size={14}
          className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      <div
        className={`grid transition-[grid-template-rows] duration-300 ${
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="pb-4 flex flex-col gap-2">{children}</div>
        </div>
      </div>
    </div>
  );
}

function CheckboxRow({
  label,
  checked,
  onToggle,
}: {
  label: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-3 text-sm py-1 text-left"
    >
      <span
        className={`w-4 h-4 shrink-0 flex items-center justify-center border rounded-sm transition-colors ${
          checked ? "bg-black border-black" : "border-black/30"
        }`}
      >
        {checked && (
          <CheckIcon size={10} weight="bold" className="text-white" />
        )}
      </span>
      {label}
    </button>
  );
}

function PriceRangeSlider({
  min,
  max,
  minVal,
  maxVal,
  onMinChange,
  onMaxChange,
}: {
  min: number;
  max: number;
  minVal: number;
  maxVal: number;
  onMinChange: (v: number) => void;
  onMaxChange: (v: number) => void;
}) {
  const range = max - min || 1;
  const leftPct = ((minVal - min) / range) * 100;
  const rightPct = ((maxVal - min) / range) * 100;

  return (
    <div className="relative h-4 flex items-center select-none">
      <div className="absolute w-full h-[1.5px] bg-black/15 rounded-full" />

      <div
        className="absolute h-[1.5px] bg-black rounded-full"
        style={{ left: `${leftPct}%`, width: `${rightPct - leftPct}%` }}
      />

      <input
        type="range"
        min={min}
        max={max}
        value={minVal}
        onChange={(e) =>
          onMinChange(Math.min(Number(e.target.value), maxVal - 1))
        }
        className="absolute w-full h-1 appearance-none bg-transparent cursor-pointer pointer-events-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-[1.5px] [&::-webkit-slider-thumb]:border-black [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-[1.5px] [&::-moz-range-thumb]:border-black [&::-moz-range-thumb]:cursor-pointer"
        style={{ zIndex: minVal > max - 10 ? 5 : 3 }}
      />

      <input
        type="range"
        min={min}
        max={max}
        value={maxVal}
        onChange={(e) =>
          onMaxChange(Math.max(Number(e.target.value), minVal + 1))
        }
        className="absolute w-full h-1 appearance-none bg-transparent cursor-pointer pointer-events-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-[1.5px] [&::-webkit-slider-thumb]:border-black [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-[1.5px] [&::-moz-range-thumb]:border-black [&::-moz-range-thumb]:cursor-pointer"
        style={{ zIndex: 4 }}
      />
    </div>
  );
}

export default function Filter({
  state,
  onChange,
  priceBounds,
  availableRoasts,
  availableCountries,
  activeFilterTags,
  onRemoveFilter,
}: FilterProps) {
  // track which accordion section is open (only one at a time)
  const [openSection, setOpenSection] = useState<string | null>(null);
  const toggle = (key: string) =>
    setOpenSection((prev) => (prev === key ? null : key));

  // helpers to update a single key or toggle an item in a list
  const set = <K extends keyof FilterState>(key: K, value: FilterState[K]) =>
    onChange({ ...state, [key]: value });

  const toggleList = (key: "roasts" | "countries", item: string) => {
    const current = state[key];
    set(
      key,
      current.includes(item)
        ? current.filter((v) => v !== item)
        : [...current, item],
    );
  };

  return (
    <div>
      {activeFilterTags.length > 0 && (
        <div className="flex flex-wrap gap-2 py-4 border-b border-black/10">
          {activeFilterTags.map((tag) => (
            <button
              key={tag.key}
              onClick={() => onRemoveFilter(tag.key)}
              className="flex items-center gap-1.5 border border-black/20 px-3 py-1.5 text-xs hover:bg-black/5 transition-colors"
            >
              {tag.label}
              <XIcon size={11} weight="bold" className="text-black/50" />
            </button>
          ))}
        </div>
      )}

      <AccordionSection
        label="Sort by"
        isOpen={openSection === "sort"}
        onToggle={() => toggle("sort")}
      >
        {SORT_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => set("sortBy", opt.value)}
            className={`flex items-center gap-1.5 text-sm transition-colors ${
              state.sortBy === opt.value
                ? "font-medium"
                : "text-black/60 hover:text-black"
            }`}
          >
            <DotOutlineIcon
              size={28}
              weight={state.sortBy === opt.value ? "fill" : "regular"}
              className={state.sortBy === opt.value ? "" : "opacity-30"}
            />
            {opt.label}
          </button>
        ))}
      </AccordionSection>

      <AccordionSection
        label="Price"
        isOpen={openSection === "price"}
        onToggle={() => toggle("price")}
      >
        <div className="pt-2 pb-1">
          <PriceRangeSlider
            min={priceBounds.min}
            max={priceBounds.max}
            minVal={state.minPrice}
            maxVal={state.maxPrice}
            onMinChange={(v) => set("minPrice", v)}
            onMaxChange={(v) => set("maxPrice", v)}
          />
        </div>

        <div className="flex items-center gap-3 mt-3">
          <div className="flex items-center gap-2 border border-black/15 px-3 py-2 flex-1">
            <span className="text-xs text-black/40 shrink-0">CHF</span>
            <input
              type="number"
              value={state.minPrice}
              min={priceBounds.min}
              max={state.maxPrice - 1}
              onChange={(e) =>
                set(
                  "minPrice",
                  Math.max(
                    priceBounds.min,
                    Math.min(Number(e.target.value), state.maxPrice - 1),
                  ),
                )
              }
              className="w-full text-sm outline-none bg-transparent"
            />
          </div>
          <span className="text-sm text-black/40 shrink-0">to</span>
          <div className="flex items-center gap-2 border border-black/15 px-3 py-2 flex-1">
            <span className="text-xs text-black/40 shrink-0">CHF</span>
            <input
              type="number"
              value={state.maxPrice}
              min={state.minPrice + 1}
              max={priceBounds.max}
              onChange={(e) =>
                set(
                  "maxPrice",
                  Math.min(
                    priceBounds.max,
                    Math.max(Number(e.target.value), state.minPrice + 1),
                  ),
                )
              }
              className="w-full text-sm outline-none bg-transparent"
            />
          </div>
        </div>
      </AccordionSection>

      {availableRoasts.length > 0 && (
        <AccordionSection
          label="Roast"
          isOpen={openSection === "roast"}
          onToggle={() => toggle("roast")}
        >
          {availableRoasts.map((roast) => (
            <CheckboxRow
              key={roast}
              label={roast}
              checked={state.roasts.includes(roast)}
              onToggle={() => toggleList("roasts", roast)}
            />
          ))}
        </AccordionSection>
      )}

      {availableCountries.length > 0 && (
        <AccordionSection
          label="Country"
          isOpen={openSection === "country"}
          onToggle={() => toggle("country")}
        >
          {availableCountries.map((country) => (
            <CheckboxRow
              key={country}
              label={country}
              checked={state.countries.includes(country)}
              onToggle={() => toggleList("countries", country)}
            />
          ))}
        </AccordionSection>
      )}
    </div>
  );
}
