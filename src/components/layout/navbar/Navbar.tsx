"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
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
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isDesktopSearchFocused, setIsDesktopSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { getTotalItems } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/collection?search=${encodeURIComponent(
        searchQuery.trim()
      )}`;
    }
  };

  // background logic
  const getBackgroundClass = () => {
    if (pathname !== "/") {
      return "bg-mist";
    }
    return isScrolled ? "bg-mist" : "bg-transparent";
  };

  // text color logic: always use dark text (onyx) except on homepage when transparent
  const useTextChange = pathname !== "/" || isScrolled || isMenuOpen || isMobileSearchOpen;

  const links = [
    { href: "/", label: "Home" },
    { href: "/collection", label: "Collection" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <div className="relative">
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${getBackgroundClass()}`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center h-20 relative">
            {/* left section */}
            <div className="flex items-center flex-1">
              {/* mobile menu toggle */}
              <button
                className={`lg:hidden hover:opacity-70 transition-opacity ${
                  useTextChange ? "text-onyx" : "text-white"
                }`}
                onClick={() => {
                  setIsMenuOpen(!isMenuOpen);
                  setIsMobileSearchOpen(false);
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
                      uppercase text-xs relative after:content-[''] after:absolute after:h-0.5 after:left-0 after:-bottom-1 after:transition-all after:duration-300 duration-200 ${
                        useTextChange
                          ? "text-onyx after:bg-onyx/80"
                          : "text-white after:bg-white/80"
                      } ${
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
                className={`font-primary text-3xl tracking-wide ${
                  useTextChange ? "text-onyx" : "text-white"
                }`}
              >
                brew.
              </Link>
            </div>

            {/* right section */}
            <div className="flex items-center space-x-4 flex-1 justify-end">
              {/* mobile search button */}
              {!isMobileSearchOpen && (
                <button
                  onClick={() => {
                    setIsMobileSearchOpen(!isMobileSearchOpen);
                    setIsMenuOpen(false);
                  }}
                  className={`lg:hidden p-1 hover:opacity-70 transition-opacity ${
                    useTextChange ? "text-onyx" : "text-white"
                  }`}
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
                    onFocus={() => setIsDesktopSearchFocused(true)}
                    onBlur={() => {
                      if (!searchQuery.trim()) {
                        setIsDesktopSearchFocused(false);
                      }
                    }}
                    placeholder="Search coffee..."
                    className={`${
                      isDesktopSearchFocused ? "w-72" : "w-56"
                    } text-sm pl-10 pr-4 py-3 rounded-full focus:outline-none transition-all duration-300 ${
                      useTextChange 
                        ? "text-onyx bg-onyx/10 placeholder-onyx/50" 
                        : "text-white bg-white/20 backdrop-blur-sm placeholder-white/50"
                    }`}
                  />
                  <button
                    onClick={() => setIsDesktopSearchFocused(true)}
                    className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors ${
                      useTextChange ? "text-onyx" : "text-white"
                    }`}
                  >
                    <Search className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* cart */}
              <div className="relative">
                <Link
                  href="/cart"
                  className={`text-xs relative flex items-center gap-2 hover:opacity-80 transition-opacity ${
                    useTextChange ? "text-onyx" : "text-white"
                  }`}
                  title={`Cart (${getTotalItems()} items)`}
                >
                  <ShoppingCart className="h-5 w-5" />
                  {getTotalItems() > 0 && (
                    <span
                      className={`h-5 w-5 text-xs font-bold absolute -top-2 -right-3 rounded-full flex items-center justify-center ${
                        useTextChange ? "bg-onyx text-white" : "bg-white text-onyx"
                      }`}
                    >
                      {getTotalItems() > 99 ? '99+' : getTotalItems()}
                    </span>
                  )}
                </Link>
              </div>
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
        className={`w-full bg-mist lg:hidden fixed left-0 top-0 pt-20 transition-transform duration-300 z-40 ${
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
      {isMobileSearchOpen && (
        <div
          className="bg-gray/30 fixed lg:hidden inset-0 z-30"
          onClick={() => setIsMobileSearchOpen(false)}
        />
      )}

      {/* mobile search overlay */}
      <div
        className={`bg-mist lg:hidden fixed left-0 top-0 pt-20 w-full transition-transform duration-300 z-40 ${
          isMobileSearchOpen ? "translate-y-0" : "-translate-y-full"
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