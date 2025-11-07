"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ClerkProvider } from "@clerk/nextjs";
import { CaretUpIcon } from "@phosphor-icons/react";

import { ToastProvider } from "@/contexts/ToastContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { CartProvider } from "@/contexts/CartContext";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Button from "@/components/common/Button";

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [showScroll, setShowScroll] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
  const heroRef = useRef<HTMLDivElement | null>(null);

  const relaxedPaddingPaths = useMemo(
    () => ["/success", "/sign-in", "/sign-up"],
    []
  );

  const hideLayout = useMemo(() => {
    if (!pathname) return false;
    const hiddenPrefixes = ["/user-profile"];
    return hiddenPrefixes.some((prefix) => pathname.startsWith(prefix));
  }, [pathname]);

  // verify auth only on admin pages to avoid unnecessary calls elsewhere
  const verifyAuth = useMemo(
    () => (pathname ?? "").startsWith("/admin"),
    [pathname]
  );

  const needsStandardPadding = useMemo(() => {
    if (!pathname || pathname === "/") return false;
    return !relaxedPaddingPaths.some((route) => pathname.startsWith(route));
  }, [pathname, relaxedPaddingPaths]);

  // track active scrolling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(true);

      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);

      scrollTimeout.current = setTimeout(() => {
        setIsScrolling(false);
      }, 2000);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // detect page position
  useEffect(() => {
    if (pathname === "/") {
      const heroEl =
        heroRef.current?.querySelector<HTMLElement>("[data-home-hero]") ??
        document.querySelector<HTMLElement>("[data-home-hero]");

      if (!heroEl) {
        const fallback = () => setShowScroll(window.scrollY > 200);
        fallback();
        window.addEventListener("scroll", fallback, { passive: true });
        return () => window.removeEventListener("scroll", fallback);
      }

      const observer = new IntersectionObserver(
        ([entry]) => setShowScroll(!entry.isIntersecting),
        { threshold: 0 }
      );

      observer.observe(heroEl);
      return () => observer.disconnect();
    }

    const checkScroll = () => setShowScroll(window.scrollY > 300);
    checkScroll();
    window.addEventListener("scroll", checkScroll, { passive: true });
    return () => window.removeEventListener("scroll", checkScroll);
  }, [pathname]);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <ToastProvider>
      <AuthProvider verifyOnMount={verifyAuth}>
        <FavoritesProvider>
          <CartProvider>
            {hideLayout ? (
              children
            ) : (
              <>
                <Navbar />
                <div
                  ref={pathname === "/" ? heroRef : undefined}
                  className={`bg-black/5 min-h-screen ${
                    pathname === "/" ? "" : needsStandardPadding ? "pt-32" : ""
                  }`}
                >
                  {children}
                </div>
                <Footer />

                <Button
                  onClick={scrollToTop}
                  aria-label="Scroll to top"
                  variant="primary"
                  className={`fixed! right-8 z-50 px-3! flex items-center justify-center transition-all duration-500 ease-out
                    ${
                      showScroll && isScrolling
                        ? "bottom-6 opacity-100 translate-y-0"
                        : "bottom-0 opacity-0 translate-y-6 pointer-events-none"
                    }`}
                >
                  <CaretUpIcon size={20} />
                </Button>
              </>
            )}
          </CartProvider>
        </FavoritesProvider>
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
    <ClerkProvider
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignOutUrl="/"
    >
      <LayoutContent>{children}</LayoutContent>
    </ClerkProvider>
  );
}
