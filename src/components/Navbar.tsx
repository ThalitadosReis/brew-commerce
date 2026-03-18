"use client";

import { useEffect, useRef, useState } from "react";
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
  onClick?: () => void;
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

function BrandLink({ className, onClick }: BrandLinkProps) {
  return (
    <Link href="/" className={className} onClick={onClick}>
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

  const brandClickCount = useRef(0);
  const brandClickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleBrandClick = () => {
    brandClickCount.current += 1;
    if (brandClickTimer.current) clearTimeout(brandClickTimer.current);
    if (brandClickCount.current >= 5) {
      brandClickCount.current = 0;
      router.push("/admin-login");
      return;
    }
    brandClickTimer.current = setTimeout(() => {
      brandClickCount.current = 0;
    }, 1500);
  };
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
          <BrandLink className="hidden text-xl uppercase tracking-[0.16em] transition-colors duration-300 md:block text-white" onClick={handleBrandClick} />

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

          <BrandLink className="text-lg uppercase tracking-[0.16em] text-white md:hidden" onClick={handleBrandClick} />

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

            <div className="flex items-center md:hidden">
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
              className="fixed inset-0 z-50 flex flex-col bg-neutral-900 md:hidden"
            >
              {/* header */}
              <div className="flex h-20 items-center justify-between px-6">
                <span className="text-base uppercase tracking-[0.16em] text-white">
                  brew<span className="text-amber-500">.</span>
                </span>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="text-white/40 transition-colors hover:text-white"
                  aria-label="Close menu"
                >
                  <XIcon size={20} weight="light" />
                </button>
              </div>

              {/* nav */}
              <nav className="flex flex-1 flex-col justify-center px-6">
                {NAV_LINKS.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.35,
                      delay: 0.06 + i * 0.07,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`group flex items-center justify-between border-b py-5 transition-colors ${
                        pathname === link.href
                          ? "border-white/20 text-white"
                          : "border-white/10 text-white/40 hover:text-white"
                      }`}
                    >
                      <span className="text-2xl font-light tracking-[-0.02em]">{link.label}</span>
                      <ArrowRightIcon
                        size={16}
                        className="text-white/20 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-white/50"
                      />
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* footer */}
              <div className="px-6 py-8">
                <p className="text-[10px] uppercase tracking-[0.3em] text-amber-500 mb-1">
                  Get in touch
                </p>
                <a
                  href="mailto:hello@brewcommerce.com"
                  className="text-sm text-white/40 transition-colors hover:text-white"
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
