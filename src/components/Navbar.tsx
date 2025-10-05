"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { allProducts } from "@/data/products";
import { Product } from "@/types/cart";
import {
  XIcon,
  MenuIcon,
  Search,
  ShoppingCart,
  User,
  Heart,
} from "lucide-react";

interface SearchBarProps {
  searchQuery: string;
  onQueryChange: (query: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  searchResults: Product[];
  onResultClick: () => void;
  isSearchOpen: boolean;
  onClose: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onQueryChange,
  onKeyDown,
  searchResults,
  isSearchOpen,
  onClose,
}) => (
  <div  className="h-screen">
    {isSearchOpen && (
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
    )}

    {/* search */}
    <div
      className={`fixed top-4 right-4 bottom-4 w-[calc(100%-2rem)] lg:w-[400px] bg-neutral rounded-2xl z-50 transform transition-transform duration-300 ${
        isSearchOpen ? "translate-x-0" : "translate-x-[calc(100%+2rem)]"
      }
  `}
    >
      <div className="p-6 flex flex-col h-full">
        <button
        onClick={onClose}
        className="mb-2 text-sm underline text-secondary hover:text-accent text-end"
      >
        Back
      </button>

        {/* input */}
        <div className="relative mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onQueryChange(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search coffee..."
            className="w-full text-sm pl-10 pr-10 py-5 text-secondary bg-muted/10 rounded-xl focus:outline-none placeholder-accent"
            autoFocus
          />

          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-accent" />

          {searchQuery && (
            <button
              onClick={() => {
                onQueryChange("");
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-accent hover:text-primary"
            >
              <XIcon className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* results */}
        <div className="flex-1 overflow-y-auto p-6">
          {searchResults.length > 0 ? (
            <div className="space-y-4">
              <Link
                href={`/collection?search=${encodeURIComponent(
                  searchQuery.trim()
                )}`}
                className="block text-sm underline text-accent hover:text-primary"
                onClick={onClose}
              >
                See all results
              </Link>
              {searchResults.map((product) => (
                <Link
                  key={product.id}
                  href={`/collection/${product.id}`}
                  onClick={onClose}
                  className="flex items-center gap-4"
                >
                  <div className="relative w-22 h-22 bg-accent/10 rounded-lg">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-contain p-3"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-sm font-body text-primary">
                      {product.name}
                    </span>
                    <span className="text-xs text-secondary">
                      CHF{product.price}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : searchQuery.trim() ? (
            <div className="mt-6 p-3 text-center text-sm text-muted">
              No products found
            </div>
          ) : null}
        </div>
      </div>
    </div>
  </div>
);

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const pathname = usePathname();
  const { getTotalItems } = useCart();
  const { getTotalWishlistItems } = useWishlist();
  const { isAuthenticated, user } = useAuth();

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

  // handle scroll hide/show
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        // scrolling down
        setShowNavbar(false);
      } else {
        // scrolling up
        setShowNavbar(true);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

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
      <header
        className={`fixed top-0 left-0 right-0 z-50 p-4 transition-transform duration-300 ${
          showNavbar ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="max-w-7xl mx-auto p-4 bg-neutral rounded-2xl">
          <div className="flex items-center justify-between px-1">
            {/* navigation links */}
            <div className="hidden lg:flex gap-4">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative inline-block overflow-hidden group text-sm font-heading"
                >
                  <span className="block transition-transform duration-300 group-hover:-translate-y-full">
                    {link.label}
                  </span>
                  <span className="absolute left-0 top-full block transition-transform duration-300 group-hover:-translate-y-full">
                    {link.label}
                  </span>
                </Link>
              ))}
            </div>

            {/* logo */}
            <Link
              href="/"
              className="lg:absolute lg:left-1/2 transform lg:-translate-x-1/2 text-3xl text-secondary"
            >
              brew.
            </Link>
            {/* right section */}
            <div className="flex items-center gap-4 ml-auto">
              {/* profile */}
              <div>
                {isAuthenticated ? (
                  <Link href="/profile">
                    {user?.profilePicture ? (
                      <div className="h-8 w-8 relative">
                        <Image
                          src={user.profilePicture}
                          alt={user.name}
                          fill
                          className="w-full h-full object-cover rounded-full overflow-hidden"
                        />
                      </div>
                    ) : (
                      <User className="text-secondary h-6 w-6 hover:scale-85 transition-transform duration-300 ease-in-out" />
                    )}
                  </Link>
                ) : (
                  <Link href="/login" title="Login">
                    <User className="text-secondary h-6 w-6 hover:scale-85 transition-transform duration-300 ease-in-out" />
                  </Link>
                )}
              </div>

              {/* search button */}
              <button
                onClick={() => {
                  setIsSearchOpen(!isSearchOpen);
                  setIsMenuOpen(false);
                }}
                title="Search"
              >
                <Search className="text-secondary h-6 w-6 hover:scale-85 transition-transform duration-300 ease-in-out" />
              </button>

              {/* wishlist */}
              <div className="relative">
                <Link
                  href="/profile#wishlist"
                  className="relative flex items-center"
                  title={`Wishlist (${getTotalWishlistItems()} items)`}
                >
                  <Heart className="text-secondary h-6 w-6 hover:scale-85 transition-transform duration-300 ease-in-out" />

                  {getTotalWishlistItems() > 0 && (
                    <span className="absolute top-1 -right-3 -translate-x-1/2 -translate-y-1/2 h-4 w-4 text-tiny font-bold text-white bg-primary rounded-full flex items-center justify-center">
                      {getTotalWishlistItems() > 99
                        ? "99+"
                        : getTotalWishlistItems()}
                    </span>
                  )}
                </Link>
              </div>

              {/* cart */}
              <div className="relative">
                <Link
                  href="/cart"
                  className="relative flex items-center justify-center"
                  title={`Cart (${getTotalItems()} items)`}
                >
                  <ShoppingCart className="text-secondary h-6 w-6 hover:scale-95 transition-transform duration-300 ease-in-out" />

                  {getTotalItems() > 0 && (
                    <span className="absolute top-1 -right-3 -translate-x-1/2 -translate-y-1/2 h-4 w-4 text-tiny font-bold text-white bg-primary rounded-full flex items-center justify-center">
                      {getTotalItems() > 99 ? "99+" : getTotalItems()}
                    </span>
                  )}
                </Link>
              </div>

              {/* mobile menu toggle */}
              <button
                className="lg:hidden"
                onClick={() => {
                  setIsMenuOpen(!isMenuOpen);
                  setIsSearchOpen(false);
                }}
                title="Menu"
              >
                {isMenuOpen ? (
                  <XIcon className="h-6 w-6 text-secondary" />
                ) : (
                  <MenuIcon className="h-6 w-6 text-secondary" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* search bar */}
        <SearchBar
          searchQuery={searchQuery}
          onQueryChange={setSearchQuery}
          onKeyDown={handleSearchKeyDown}
          searchResults={searchResults}
          onResultClick={() => setIsSearchOpen(false)}
          isSearchOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
        />
      </header>

      {/* mobile menu wrapper */}
      <div className="lg:hidden relative z-40">
        {/* overlay */}
        {isMenuOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-10"
            onClick={() => setIsMenuOpen(false)}
          />
        )}

        {/* mobile menu */}
        <div
          className={`lg:hidden absolute top-24 left-4 right-4 bg-white rounded-2xl transition-transform duration-300 z-20
    ${isMenuOpen ? "translate-y-0" : "-translate-y-[calc(100%+6rem)]"} 
  `}
        >
          <nav className="pl-6 py-6">
            {links.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-heading tracking-wide text-sm flex items-center justify-between py-3 ${
                  pathname === link.href
                    ? "text-primary font-semibold"
                    : "text-secondary hover:text-primary"
                } ${
                  index < links.length - 1 ? "border-b border-neutral py-2" : ""
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
