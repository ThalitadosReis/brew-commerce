"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRightIcon,
  PackageIcon,
  XIcon,
} from "@phosphor-icons/react";
import type { Product } from "@/types/product";
import Drawer from "./common/Drawer";

interface SearchDrawerProps {
  searchQuery: string;
  onQueryChange: (query: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  searchResults: Product[];
  isOpen: boolean;
  onClose: () => void;
}

interface SearchResultRowProps {
  product: Product;
  onClose: () => void;
}

interface SearchStateProps {
  message: string;
}

function SearchResultRow({ product, onClose }: SearchResultRowProps) {
  return (
    <Link
      href={`/collection/${product._id}`}
      onClick={onClose}
      className="group flex items-start gap-4 border border-transparent px-3 py-4 transition-colors hover:border-black/15"
    >
      <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden bg-black/5">
        {product.images?.[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            width={96}
            height={96}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-black/5">
            <PackageIcon size={20} weight="light" className="text-black/30" />
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-medium text-base leading-tight">{product.name}</p>
        <p className="text-sm font-light text-black/50">{product.country}</p>
        <p className="mt-2 text-sm text-black/75">from CHF {product.price}</p>
      </div>
      <ArrowUpRightIcon
        size={16}
        className="mt-1 shrink-0 text-black/30 transition-colors group-hover:text-black/70"
      />
    </Link>
  );
}

function SearchState({ message }: SearchStateProps) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
      <p className="text-sm text-black/50">{message}</p>
    </div>
  );
}

export default function SearchDrawer({
  searchQuery,
  onQueryChange,
  onKeyDown,
  searchResults,
  isOpen,
  onClose,
}: SearchDrawerProps) {
  const hasQuery = searchQuery.trim().length > 0;
  const handleClose = () => {
    onQueryChange("");
    onClose();
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      ariaLabel="Search products"
      showHeader={false}
    >
      <div className="space-y-4">
        <div className="relative border-b border-black/10">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onQueryChange(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Type to search..."
            className="w-full bg-transparent py-4 pr-24 text-sm text-black placeholder:text-black/35 focus:outline-none"
            autoFocus
          />

          <button
            type="button"
            onClick={handleClose}
            className="absolute right-0 top-1/2 -translate-y-1/2 text-black/50 transition-colors hover:text-black/75"
            aria-label="Close search"
          >
            <XIcon size={18} weight="bold" />
          </button>
        </div>

        {searchResults.length > 0 ? (
          <div className="space-y-1">
            {searchResults.map((product) => (
              <SearchResultRow
                key={product._id}
                product={product}
                onClose={handleClose}
              />
            ))}
          </div>
        ) : hasQuery ? (
          <SearchState message="No results found" />
        ) : (
          <SearchState message="Start typing to search" />
        )}
      </div>
    </Drawer>
  );
}
