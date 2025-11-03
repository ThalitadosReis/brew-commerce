"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useUser, UserButton } from "@clerk/nextjs";

import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { Product } from "@/types/product";
import Cart from "./Cart";
import Drawer from "./common/Drawer";

import {
  HeartIcon,
  ListIcon,
  MagnifyingGlassIcon,
  PackageIcon,
  ShoppingBagIcon,
  UserCirclePlusIcon,
  XIcon,
} from "@phosphor-icons/react";

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
}) => {
  const searchContent = (
    <>
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onQueryChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Search coffee..."
          className="w-full text-sm pl-12 py-4 bg-black/10 focus:outline-none"
          autoFocus
        />

        <MagnifyingGlassIcon
          size={20}
          className="absolute left-4 top-1/2 transform -translate-y-1/2"
        />

        {searchQuery && (
          <button
            onClick={() => onQueryChange("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-xs underline hover:opacity-75"
          >
            Clear
          </button>
        )}
      </div>

      {/* results */}
      {searchResults.length > 0 ? (
        <div className="mt-4 space-y-4">
          {searchResults.map((product) => (
            <Link
              key={product._id}
              href={`/collection/${product._id}`}
              onClick={onClose}
              className="flex items-center gap-4 transform transition-transform duration-200 hover:scale-105"
            >
              <div className="bg-black/5">
                {product.images?.[0] ? (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    width={80}
                    height={100}
                    className="object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-black/5">
                    <PackageIcon
                      size={20}
                      weight="light"
                      className="text-black/30"
                    />
                  </div>
                )}
              </div>
              <div className="flex flex-col">
                <h6>{product.name}</h6>
                <small>from CHF{product.price}</small>
              </div>
            </Link>
          ))}
        </div>
      ) : searchQuery.trim() ? (
        <div className="py-24 text-center text-black/50">
          <p>No products found</p>
          <p>Try adjusting your search</p>
        </div>
      ) : (
        <div className="py-24 text-center text-black/50">
          <MagnifyingGlassIcon size={48} className="mx-auto mb-2" />
          <p>Start typing to search</p>
        </div>
      )}
    </>
  );

  return (
    <Drawer
      isOpen={isSearchOpen}
      onClose={onClose}
      title="Search"
      ariaLabel="Search products"
      showHeader={true}
    >
      {searchContent}
    </Drawer>
  );
};

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  const pathname = usePathname();
  const router = useRouter();
  const { getTotalItems } = useCart();
  const { getTotalFavorites } = useFavorites();
  const { isSignedIn } = useUser();

  // fetch products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        if (response.ok) {
          const dbProducts = await response.json();
          const products: Product[] = dbProducts.map(
            (p: {
              _id: string;
              name: string;
              price: number;
              images: string[];
              description: string;
              country: string;
              category: string;
              stock: number;
            }) => ({
              _id: p._id,
              name: p.name,
              price: p.price,
              images: p.images || [],
              description: p.description,
              country: p.country,
              category: p.category,
              stock: p.stock,
              sizes: ["250g", "500g", "1kg"],
            })
          );
          setAllProducts(products);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(
        `/collection?search=${encodeURIComponent(searchQuery.trim())}`
      );
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch(e);
      setIsSearchOpen(false);
    }
    if (e.key === "Escape") setIsSearchOpen(false);
  };

  // handle scroll hide/show
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) setShowNavbar(false);
      else setShowNavbar(true);
      setLastScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // filter products for search
  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = allProducts
        .filter(
          (product) =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            product.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.category.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5);
      setSearchResults(filtered);
    } else setSearchResults([]);
  }, [searchQuery, allProducts]);

  const links = [
    { href: "/homepage", label: "Home" },
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
        <div className="max-w-7xl mx-auto p-6 bg-white shadow-md">
          <div className="flex items-center justify-between">
            {/* navigation links */}
            <div className="hidden lg:flex gap-6">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative inline-block overflow-hidden font-heading group"
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

            <div className="flex items-center justify-center gap-4">
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
                  <XIcon weight="light" size={20} />
                ) : (
                  <ListIcon weight="light" size={20} />
                )}
              </button>

              {/* logo */}
              <Link
                href="/homepage"
                className="lg:absolute lg:left-1/2 transform lg:-translate-x-1/2 text-2xl font-heading"
              >
                brew.
              </Link>
            </div>

            {/* right section */}
            <div className="flex items-center gap-2 relative justify-end">
              {/* search button */}
              <button
                onClick={() => {
                  setIsSearchOpen(!isSearchOpen);
                  setIsMenuOpen(false);
                }}
                title="Search"
              >
                <MagnifyingGlassIcon
                  size={24}
                  weight="light"
                  className="hover:scale-90 transition-transform duration-300 ease-in-out"
                />
              </button>

              {/* favorites */}
              <div className="relative">
                <Link
                  href="/favorites"
                  className="relative flex items-center"
                  title={`Favorites (${getTotalFavorites()} items)`}
                >
                  <HeartIcon
                    size={24}
                    weight="light"
                    className="hover:scale-90 transition-transform duration-300 ease-in-out"
                  />
                  {getTotalFavorites() > 0 && (
                    <span className="absolute top-1 -right-3 -translate-x-1/2 -translate-y-1/2 h-4 w-4 text-[10px] font-semibold text-white bg-black rounded-full flex items-center justify-center">
                      {getTotalFavorites() > 99 ? "99+" : getTotalFavorites()}
                    </span>
                  )}
                </Link>
              </div>

              {/* cart */}
              <div className="relative">
                <button
                  onClick={() => setCartOpen(true)}
                  className="relative flex items-center justify-center"
                  title={`Cart (${getTotalItems()} items)`}
                >
                  <ShoppingBagIcon
                    size={24}
                    weight="light"
                    className="hover:scale-90 transition-transform duration-300 ease-in-out"
                  />
                  {getTotalItems() > 0 && (
                    <span className="absolute top-1 -right-3 -translate-x-1/2 -translate-y-1/2 h-4 w-4 text-[10px] font-semibold text-white bg-black rounded-full flex items-center justify-center">
                      {getTotalItems() > 99 ? "99+" : getTotalItems()}
                    </span>
                  )}
                </button>
                <Cart isOpen={cartOpen} onClose={() => setCartOpen(false)} />
              </div>

              {/* profile */}
              <div className="relative flex items-center justify-end group">
                {isSignedIn ? (
                  <UserButton
                    appearance={{
                      elements: {
                        userButtonAvatarBox: "w-8 h-8",
                      },
                    }}
                    afterSignOutUrl="/homepage"
                  >
                    <UserButton.MenuItems>
                      <UserButton.Link
                        label="Orders"
                        labelIcon={<PackageIcon size={16} weight="bold" />}
                        href="/profile"
                      />
                    </UserButton.MenuItems>
                  </UserButton>
                ) : (
                  <Link href="/sign-in">
                    <UserCirclePlusIcon
                      size={24}
                      weight="light"
                      className="hover:scale-90 transition-transform duration-300 ease-in-out"
                    />
                  </Link>
                )}
              </div>
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

      {/* mobile menu */}
      <div className="lg:hidden relative z-40">
        {isMenuOpen && (
          <div
            className="fixed inset-0 bg-black/25 z-10"
            onClick={() => setIsMenuOpen(false)}
          />
        )}
        <div
          className={`lg:hidden fixed left-4 right-4 bg-white transition-transform duration-300 z-40 ${
            isMenuOpen ? "translate-y-0" : "-translate-y-[calc(100%+6rem)]"
          }`}
          style={{ top: "var(--navbar-height, 96px)" }}
        >
          <nav className="px-8 py-4">
            {links.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm flex items-center py-2 ${
                  pathname === link.href ? "font-medium" : "hover:text-black/75"
                } ${
                  index < links.length - 1
                    ? "border-b border-black/10 py-2"
                    : ""
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
