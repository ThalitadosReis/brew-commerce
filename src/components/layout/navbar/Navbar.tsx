"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { allProducts } from "@/data/products";
import { Product } from "@/types/cart";
import {
  XIcon,
  MenuIcon,
  Search,
  ShoppingCart,
  ChevronRight,
  ChevronDown,
} from "lucide-react";

interface SearchBarProps {
  searchQuery: string;
  onQueryChange: (query: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  searchResults: Product[];
  onResultClick: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onQueryChange,
  onKeyDown,
  searchResults,
  onResultClick,
}) => (
  <>
    <div className="relative">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => onQueryChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Search coffee..."
        className="w-full text-sm pl-10 pr-4 py-3 rounded-full focus:outline-none focus:ring-1 focus:ring-neutral text-primary placeholder-accent border border-neutral"
        autoFocus
      />
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-accent" />
    </div>

    {searchResults.length > 0 && (
      <div className="mt-3 space-y-2">
        {searchResults.map((product) => (
          <Link
            key={product.id}
            href={`/collection/${product.id}`}
            onClick={onResultClick}
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-neutral/50 transition-colors"
          >
            <Image
              src={product.image}
              alt={product.name}
              width={40}
              height={40}
              className="w-20 h-20 object-contain bg-neutral/30 rounded-lg"
            />
            <div className="flex-1">
              <div className="text-sm font-medium text-primary">
                {product.name}
              </div>
              <div className="text-xs text-accent">
                {product.country} • CHF{product.price}
              </div>
            </div>
          </Link>
        ))}
      </div>
    )}

    {searchQuery.trim() && searchResults.length === 0 && (
      <div className="mt-3 p-2 text-sm text-accent text-center">
        No products found
      </div>
    )}
  </>
);

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const pathname = usePathname();
  const { getTotalItems } = useCart();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/collection?search=${encodeURIComponent(
        searchQuery.trim()
      )}`;
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch(e);
      setIsSearchOpen(false);
    }
    if (e.key === "Escape") {
      setIsSearchOpen(false);
    }
  };

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = allProducts
        .filter(
          (product) =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
        )
        .slice(0, 5);
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const links = [
    { href: "/", label: "Home" },
    { href: "/collection", label: "Collection" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <div className="relative">
      <header className="fixed top-0 left-0 right-0 z-50 px-4">
        <div className="max-w-6xl mx-auto px-6 py-4 bg-white rounded-b-4xl">
          <div className="flex items-center justify-between">
            {/* logo */}
            <div className="flex items-center">
              <Link
                href="/"
                className="font-display text-3xl tracking-wide text-primary"
              >
                brew.
              </Link>
            </div>

            {/* navigation links */}
            <div className="hidden lg:flex space-x-6">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    uppercase text-xs relative after:content-[''] after:absolute after:h-0.5 after:left-0 after:-bottom-1 after:transition-all after:duration-300 duration-200 text-secondary after:bg-primary ${
                      pathname === link.href
                        ? "after:w-full text-primary font-semibold"
                        : "after:w-0 hover:after:w-full hover:text-primary"
                    }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* right section */}
            <div className="flex items-center space-x-2">
              {/* mobile search button */}
              <button
                onClick={() => {
                  setIsSearchOpen(!isSearchOpen);
                  setIsMenuOpen(false);
                }}
                className="lg:hidden p-3 hover:bg-neutral/50 transition-all text-primary border border-neutral rounded-full"
                title="Search"
              >
                <Search className="h-5 w-5" />
              </button>

              {/* desktop search */}
              <div className="relative hidden lg:block">
                <button
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="p-3 hover:bg-neutral/50 transition-all text-primary border border-neutral rounded-full"
                  title="Search"
                >
                  <Search className="h-5 w-5" />
                </button>
              </div>

              {/* cart */}
              <div className="relative">
                <Link
                  href="/cart"
                  className="text-xs relative flex items-center p-3 hover:bg-neutral/50 transition-all text-primary border border-neutral rounded-full"
                  title={`Cart (${getTotalItems()} items)`}
                >
                  <ShoppingCart className="h-5 w-5" />
                  {getTotalItems() > 0 && (
                    <span className="h-4 w-4 text-tiny font-bold absolute top-2 right-2 rounded-full flex items-center justify-center bg-primary text-white">
                      {getTotalItems() > 99 ? "99+" : getTotalItems()}
                    </span>
                  )}
                </Link>
              </div>

              {/* mobile menu toggle */}
              <button
                className="lg:hidden p-3 hover:bg-neutral/50 transition-all text-primary border border-neutral rounded-full"
                onClick={() => {
                  setIsMenuOpen(!isMenuOpen);
                  setIsSearchOpen(false);
                }}
                title="Menu"
              >
                {isMenuOpen ? (
                  <XIcon className="h-5 w-5" />
                ) : (
                  <MenuIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* search bar */}
      {isSearchOpen && (
        <div className="fixed left-0 right-0 top-20 z-40 pt-2">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-end">
            <div className="w-full md:w-1/2 lg:w-1/3 bg-white rounded-3xl p-4">
              <SearchBar
                searchQuery={searchQuery}
                onQueryChange={setSearchQuery}
                onKeyDown={handleSearchKeyDown}
                searchResults={searchResults}
                onResultClick={() => setIsSearchOpen(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* search backdrop */}
      {isSearchOpen && (
        <div
          className="fixed inset-0 z-30 bg-primary/20"
          onClick={() => setIsSearchOpen(false)}
        />
      )}

      {/* mobile menu backdrop */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-primary/20 lg:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* mobile menu */}
      <div
        className={`w-full bg-white rounded-b-4xl lg:hidden fixed left-0 top-0 pt-24 pb-6 transition-transform duration-300 z-40 ${
          isMenuOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <nav className="max-w-6xl mx-auto px-8">
          {links.map((link, index) => (
            <Link
              key={link.href}
              href={link.href}
              className={`uppercase text-sm flex items-center justify-between py-2 ${
                pathname === link.href
                  ? "text-primary font-semibold"
                  : "text-secondary hover:text-primary"
              } ${index < links.length - 1 ? "border-b border-neutral" : ""}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
