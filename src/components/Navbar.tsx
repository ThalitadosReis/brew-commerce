"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";

import { useCart } from "@/contexts/CartContext";
import { Product } from "@/types/product";
import Cart from "./Cart";
import SearchDrawer from "./Search";

import {
  ArrowRightIcon,
  ListIcon,
  MagnifyingGlassIcon,
  ShoppingBagIcon,
  XIcon,
} from "@phosphor-icons/react";
import Button from "./common/Button";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/collection", label: "Collection" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

interface CountBadgeProps {
  count: number;
  className: string;
}

interface BrandLinkProps {
  className: string;
}

function CountBadge({ count, className }: CountBadgeProps) {
  if (count <= 0) return null;

  return (
    <span
      className={`absolute top-1 -right-3 -translate-x-1/2 -translate-y-1/2 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-semibold ${className}`}
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}

function BrandLink({ className }: BrandLinkProps) {
  return (
    <Link href="/" className={className}>
      brew<span className="text-amber-700">.</span>
    </Link>
  );
}

function mapProductForSearch(p: {
  _id: string;
  name: string;
  price: number;
  images: string[];
  description: string;
  country: string;
  category: string;
  stock: number;
}): Product {
  return {
    _id: p._id,
    name: p.name,
    price: p.price,
    images: p.images || [],
    description: p.description,
    country: p.country,
    category: p.category,
    stock: p.stock,
    sizes: [],
  };
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [scrolled, setScrolled] = useState(false);
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  const pathname = usePathname();
  const router = useRouter();
  const { getTotalItems } = useCart();
  const cartCount = getTotalItems();
  const isSolidNavPage =
    /^\/collection\/.+/.test(pathname ?? "") ||
    pathname === "/success";
  const navSurface = scrolled || isMenuOpen || isSearchOpen || isSolidNavPage;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  // fetch products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        if (response.ok) {
          const dbProducts = await response.json();
          const products: Product[] = dbProducts.map(mapProductForSearch);
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
        `/collection?search=${encodeURIComponent(searchQuery.trim())}`,
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

  const toggleSearch = () => {
    setIsSearchOpen((open) => !open);
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen((open) => !open);
    setIsSearchOpen(false);
  };

  const navIconMotionClass =
    "transition-all duration-300 ease-in-out hover:scale-90";
  const navBadgeClass = "bg-white text-black";

  // filter products for search
  useEffect(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    if (normalizedQuery) {
      const filtered = allProducts
        .filter(
          (product) =>
            product.name.toLowerCase().includes(normalizedQuery) ||
            product.description.toLowerCase().includes(normalizedQuery) ||
            product.country.toLowerCase().includes(normalizedQuery) ||
            product.category.toLowerCase().includes(normalizedQuery),
        )
        .slice(0, 5);
      setSearchResults(filtered);
    } else setSearchResults([]);
  }, [searchQuery, allProducts]);

  return (
    <div className="relative">
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          navSurface ? "bg-black" : "bg-transparent"
        }`}
      >
        <div className="mx-auto grid h-20 max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-6 px-4 md:px-6">
          <BrandLink className="hidden text-xl uppercase tracking-[0.16em] transition-colors duration-300 md:block text-white" />

          <div className="hidden items-center justify-center gap-8 md:flex">
            {NAV_LINKS.map(({ href, label }) => (
              <Button
                key={href}
                as="link"
                href={href}
                variant="link"
                className="text-white/75 hover:text-white"
              >
                {label}
              </Button>
            ))}
          </div>

          <BrandLink className="text-lg uppercase tracking-[0.16em] text-white md:hidden" />

          <div className="relative flex items-center justify-end gap-4 text-white">
            <button onClick={toggleSearch} title="Search">
              <MagnifyingGlassIcon
                size={24}
                weight="light"
                className={`${navIconMotionClass}`}
              />
            </button>

            <div className="relative">
              <button
                onClick={() => setCartOpen(true)}
                className="relative flex items-center justify-center"
                title={`Cart (${cartCount} items)`}
              >
                <ShoppingBagIcon
                  size={24}
                  weight="light"
                  className={`${navIconMotionClass}`}
                />
                <CountBadge count={cartCount} className={navBadgeClass} />
              </button>
              <Cart isOpen={cartOpen} onClose={() => setCartOpen(false)} />
            </div>

            <span className="text-sm md:hidden text-white/30">|</span>

            <div className="flex items-center ml-2 md:hidden">
              <button
                className="transition-colors duration-300"
                onClick={toggleMenu}
                title="Menu"
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              >
                {isMenuOpen ? <XIcon size={22} /> : <ListIcon size={22} />}
              </button>
            </div>
          </div>
        </div>

        <SearchDrawer
          searchQuery={searchQuery}
          onQueryChange={setSearchQuery}
          onKeyDown={handleSearchKeyDown}
          searchResults={searchResults}
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
        />
      </header>

      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-neutral-900/45 backdrop-blur-sm md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setIsMenuOpen(false)}
            />

            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-0 z-50 flex flex-col bg-white md:hidden"
            >
              <div className="flex h-20 items-center justify-between border-b border-black/10 px-6">
                <div className="flex flex-col leading-none">
                  <span className="text-lg font-medium tracking-[0.15em] uppercase text-black">
                    brew<span className="text-amber-700">.</span>
                  </span>
                </div>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="text-black/40 transition-colors duration-300 hover:text-black"
                  aria-label="Close menu"
                >
                  <XIcon size={22} weight="light" />
                </button>
              </div>

              <nav className="flex flex-1 flex-col justify-center px-6">
                {NAV_LINKS.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: 0.08 + i * 0.07,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`group flex items-center justify-between border-b border-black/10 py-5 ${
                        pathname === link.href
                          ? "text-black"
                          : "text-black/50 hover:text-black"
                      }`}
                    >
                      <span className="text-xl font-light">{link.label}</span>
                      <ArrowRightIcon
                        size={18}
                        className="text-black/30 transition-transform duration-300 group-hover:translate-x-1"
                      />
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <div className="border-t border-black/10 px-6 py-6">
                <p className="text-[10px] tracking-[0.2em] uppercase text-amber-700">
                  Get in touch
                </p>
                <a
                  href="mailto:hello@brewcommerce.com"
                  className="text-sm text-black/50 transition-colors duration-300 hover:text-black"
                >
                  hello@brewcommerce.com
                </a>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
