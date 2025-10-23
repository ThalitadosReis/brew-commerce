"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { ClerkProvider } from "@clerk/nextjs";
import { CaretUpIcon } from "@phosphor-icons/react";

import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastProvider } from "@/contexts/ToastContext";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [showScroll, setShowScroll] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
  const heroRef = useRef<HTMLDivElement | null>(null);

  const hideLayout =
    pathname === "/sign-in" ||
    pathname === "/sign-up" ||
    pathname === "/user-profile";

  // detect scrolling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(true);

      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      scrollTimeout.current = setTimeout(() => {
        setIsScrolling(false);
      }, 2000);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // detect page position
  useEffect(() => {
    if (pathname === "/") {
      const hero = heroRef.current;
      if (!hero) return;

      const observer = new IntersectionObserver(
        ([entry]) => setShowScroll(!entry.isIntersecting),
        { threshold: 0 }
      );
      observer.observe(hero);
      return () => observer.unobserve(hero);
    } else {
      const checkScroll = () => setShowScroll(window.scrollY > 300);
      window.addEventListener("scroll", checkScroll);
      return () => window.removeEventListener("scroll", checkScroll);
    }
  }, [pathname]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (hideLayout) return <>{children}</>;

  return (
    <ToastProvider>
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            <Navbar />
            {pathname === "/" ? <div ref={heroRef}>{children}</div> : children}
            <Footer />

            <button
              onClick={scrollToTop}
              aria-label="Scroll to top"
              className={`fixed right-6 lg:right-8 p-3 bg-black text-white overflow-hidden group z-50 transition-all duration-500 ease-out
                ${
                  showScroll && isScrolling
                    ? "bottom-6 opacity-100 translate-y-0"
                    : "bottom-0 opacity-0 translate-y-6 pointer-events-none"
                }`}
            >
              <CaretUpIcon size={20} />

              <span className="pointer-events-none absolute top-[-50px] left-[-75px] w-[50px] h-[155px] bg-white opacity-20 rotate-[35deg] transition-all duration-[550ms] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:left-[120%]" />
            </button>
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default function CommerceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <LayoutContent>{children}</LayoutContent>
    </ClerkProvider>
  );
}
