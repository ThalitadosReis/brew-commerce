"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { allProducts } from "@/data/products";
import { Product } from "@/types/cart";
import {
  XIcon,
  MenuIcon,
  Search,
  ShoppingCart,
  User,
  Package,
  LogOut,
  FileText,
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
        className="w-full text-sm pl-10 pr-4 py-3 border border-neutral rounded-full focus:outline-none focus:ring-1 focus:ring-neutral placeholder-accent"
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
            className="flex items-center gap-3 rounded-xl hover:bg-neutral/50 transition-colors"
          >
            <Image
              src={product.image}
              alt={product.name}
              width={100}
              height={120}
              className="w-20 h-20 object-contain"
            />
            <div className="flex-1">
              <div className="text-sm font-medium text-primary">
                {product.name}
              </div>
              <div className="text-sm text-accent">
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
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const pathname = usePathname();
  const router = useRouter();
  const { getTotalItems } = useCart();
  const { isAuthenticated, user, logout } = useAuth();

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
      <header className="fixed top-0 left-0 right-0 z-50 px-3">
        <div className="max-w-6xl mx-auto p-3 bg-white rounded-b-2xl">
          <div className="flex items-center justify-between">
            <div className="space-x-2">
              {/* mobile menu toggle */}
              <button
                className="lg:hidden text-primary/50"
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

              {/* logo */}
              <Link href="/" className="font-display text-3xl text-primary">
                brew.
              </Link>
            </div>

            {/* navigation links */}
            <div className="hidden lg:flex space-x-5">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    uppercase font-heading tracking-wide text-sm relative after:content-[''] after:absolute after:h-0.5 after:left-0 after:-bottom-1 after:transition-all after:duration-300 duration-200 after:bg-primary ${
                      pathname === link.href
                        ? "after:w-full text-primary font-semibold"
                        : "after:w-0 hover:after:w-full text-secondary hover:text-primary"
                    }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* right section */}
            <div className="flex items-center gap-2">
              {/* search button */}
              <button
                onClick={() => {
                  setIsSearchOpen(!isSearchOpen);
                  setIsMenuOpen(false);
                }}
                className="p-3 text-primary hover:bg-neutral/50 transition-all border border-neutral rounded-full"
                title="Search"
              >
                <Search className="h-5 w-5" />
              </button>

              {/* cart */}
              <div className="relative">
                <Link
                  href="/cart"
                  className="p-3 text-primary hover:bg-neutral/50 transition-all border border-neutral rounded-full text-xs relative flex items-center"
                  title={`Cart (${getTotalItems()} items)`}
                >
                  <ShoppingCart className="h-5 w-5" />

                  {getTotalItems() > 0 && (
                    <span className="h-4 w-4 text-tiny font-bold text-white bg-primary rounded-full flex items-center justify-center absolute top-2 right-2">
                      {getTotalItems() > 99 ? "99+" : getTotalItems()}
                    </span>
                  )}
                </Link>
              </div>

              {/* profile */}
              <div className="relative">
                {isAuthenticated ? (
                  <div className="relative">
                    <button
                      onMouseEnter={() => setIsProfileOpen(true)}
                      className="p-3 text-primary hover:bg-neutral/50 transition-all border border-neutral rounded-full text-xs relative flex items-center justify-center overflow-hidden"
                    >
                      {user?.profilePicture ? (
                        <div className="h-5 w-5">
                          <Image
                            src={user.profilePicture}
                            alt={user.name}
                            fill
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <User className="h-5 w-5" />
                      )}
                    </button>

                    {/* dropdown */}
                    {isProfileOpen && (
                      <div
                        className="absolute -right-3 top-full mt-5 w-48 bg-white rounded-2xl border border-neutral overflow-hidden z-50"
                        onMouseEnter={() => setIsProfileOpen(true)}
                        onMouseLeave={() => setIsProfileOpen(false)}
                      >
                        <Link
                          href="/profile#overview"
                          className="flex items-center gap-3 px-4 py-3 hover:bg-neutral/50 transition-colors text-primary"
                        >
                          <User className="h-5 w-5" />
                          <span className="text-sm">Overview</span>
                        </Link>
                        <Link
                          href="/profile#orders"
                          className="flex items-center gap-3 px-4 py-3 hover:bg-neutral/50 transition-colors text-primary"
                        >
                          <Package className="h-5 w-5" />
                          <span className="text-sm">Orders</span>
                        </Link>
                        <Link
                          href="/profile#details"
                          className="flex items-center gap-3 px-4 py-3 hover:bg-neutral/50 transition-colors text-primary"
                        >
                          <FileText className="h-5 w-5" />
                          <span className="text-sm">Personal Details</span>
                        </Link>
                        <button
                          onClick={() => {
                            logout();
                            router.push("/");
                            setIsProfileOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-neutral transition-colors text-primary border-t border-neutral text-left"
                        >
                          <LogOut className="h-5 w-5" />
                          <span className="text-sm">Sign Out</span>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="text-xs relative flex items-center justify-center p-2.5 hover:bg-neutral/50 transition-all text-primary border border-neutral rounded-full overflow-hidden"
                    title="Login"
                  >
                    <User className="h-5 w-5" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* search bar */}
        {isSearchOpen && (
          <div className="fixed w-full left-0 right-0 top-20 z-40 px-3">
            <div className="max-w-6xl mx-auto flex justify-end">
              <div className="w-full lg:w-1/3 bg-white rounded-2xl p-3">
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
      </header>

      {/* mobile menu */}
      <div
        className={`lg:hidden fixed w-full pt-16 pb-2 bg-white rounded-b-2xl transition-transform duration-300 z-40 ${
          isMenuOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <nav className=" px-7">
          {links.map((link, index) => (
            <Link
              key={link.href}
              href={link.href}
              className={`uppercase font-heading tracking-wide text-sm flex items-center justify-between py-2 ${
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
    </div>
  );
}
