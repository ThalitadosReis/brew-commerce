"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  XIcon,
  MenuIcon,
  Search,
  ShoppingCart,
  ChevronRight,
  ChevronDown,
} from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/collection?search=${encodeURIComponent(
        searchQuery.trim()
      )}`;
    }
  };

  const links = [
    { href: "/", label: "Home" },
    { href: "/product", label: "Collection" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <div className="relative">
      <header className="bg-mist sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center h-20 relative">
            {/* left section */}
            <div className="flex items-center flex-1">
              {/* mobile menu toggle */}
              <button
                className="lg:hidden text-onyx hover:opacity-70 transition-opacity"
                onClick={() => {
                  setIsMenuOpen(!isMenuOpen);
                  setIsSearchOpen(false);
                }}
              >
                {isMenuOpen ? (
                  <XIcon className="h-5 w-5" />
                ) : (
                  <MenuIcon className="h-5 w-5" />
                )}
              </button>

              {/* desktop navigation links */}
              <div className="hidden lg:flex space-x-6">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`
                      uppercase text-xs relative after:content-[''] after:absolute after:h-0.5 after:bg-onyx/80 after:left-0 after:-bottom-1 after:transition-all after:duration-300 duration-200 ${
                        pathname === link.href
                          ? "after:w-full"
                          : "after:w-0 hover:after:w-full"
                      }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* center - logo */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <Link
                href="/"
                className="font-primary text-3xl tracking-wide text-onyx "
              >
                brew.
              </Link>
            </div>

            {/* right section */}
            <div className="flex items-center space-x-4 flex-1 justify-end">
              {/* mobile search button */}
              {!isSearchOpen && (
                <button
                  onClick={() => {
                    setIsSearchOpen(!isSearchOpen);
                    setIsMenuOpen(false);
                  }}
                  className="lg:hidden p-1 text-onyx hover:opacity-70 transition-opacity"
                  title="Search"
                >
                  <Search className="h-5 w-5" />
                </button>
              )}

              {/* search - hidden on mobile */}
              <div className="relative hidden lg:block">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleSearch(e);
                      }
                    }}
                    onFocus={() => setIsSearchOpen(true)}
                    onBlur={() => {
                      if (!searchQuery.trim()) {
                        setIsSearchOpen(false);
                      }
                    }}
                    placeholder="Search coffee..."
                    className={`${
                      isSearchOpen ? "w-72" : "w-56"
                    } text-sm pl-10 pr-4 py-3 bg-onyx/10 rounded-full focus:outline-none text-onyx placeholder-onyx/50 transition-all duration-300`}
                  />
                  <button
                    onClick={() => setIsSearchOpen(true)}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-onyx transition-colors"
                  >
                    <Search className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* cart */}
              <Link
                href="/cart"
                className="text-xs text-onyx relative flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <ShoppingCart className="h-5 w-5" />
                <span className="h-5 w-5 bg-onyx text-white text-xs font-bold absolute -top-2 -right-3 rounded-full  flex items-center justify-center">
                  1
                </span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* mobile menu backdrop */}
      {isMenuOpen && (
        <div
          className="bg-gray/30 fixed lg:hidden inset-0 z-30"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* mobile menu */}
      <div
        className={`w-full bg-mist lg:hidden absolute top-full left-0 transition-transform duration-300 z-40 ${
          isMenuOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <nav className="max-w-7xl mx-auto px-6 pb-4">
          {links.map((link, index) => (
            <Link
              key={link.href}
              href={link.href}
              className={`uppercase font-semibold text-xs flex items-center justify-between py-3 ${
                pathname === link.href
                  ? "text-serene"
                  : "text-onyx/80 hover:text-onyx"
              } ${index < links.length - 1 ? "border-b border-onyx/20" : ""}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <span>{link.label}</span>
              {pathname === link.href ? (
                <ChevronDown className="h-4 w-4 text-onyx" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Link>
          ))}
        </nav>
      </div>

      {/* mobile search backdrop */}
      {isSearchOpen && (
        <div
          className="bg-gray/30 fixed lg:hidden inset-0 z-30"
          onClick={() => setIsSearchOpen(false)}
        />
      )}

      {/* mobile search overlay */}
      <div
        className={`bg-mist lg:hidden absolute top-full left-0 w-full transition-transform duration-300 z-40 ${
          isSearchOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="px-6 pb-4">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSearch(e);
                }
              }}
              placeholder="Search coffee.."
              className="w-full text-onyx pl-10 pr-4 py-3 text-sm bg-onyx/10 rounded-full focus:outline-none  placeholder-onyx/50 transition-all duration-300"
              autoFocus
            />
            <button
              type="button"
              className="text-onyx absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors"
            >
              <Search className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
