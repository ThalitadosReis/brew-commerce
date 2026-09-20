"use client";

import { useMemo, useRef } from "react";
import { usePathname } from "next/navigation";

import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const heroRef = useRef<HTMLDivElement | null>(null);

  const relaxedPaddingPaths = useMemo(() => ["/success"], []);
  const fullBleedHeaderPaths = useMemo(
    () => ["/collection", "/about", "/contact"],
    [],
  );
  const productDetailPattern = useMemo(() => /^\/collection\/.+/, []);

  const hideLayout = useMemo(() => {
    if (!pathname) return false;
    const hiddenPrefixes = ["/user-profile"];
    return hiddenPrefixes.some((prefix) => pathname.startsWith(prefix));
  }, [pathname]);

  // verify auth only on admin pages to avoid unnecessary calls elsewhere
  const verifyAuth = useMemo(
    () => (pathname ?? "").startsWith("/admin"),
    [pathname],
  );

  const needsStandardPadding = useMemo(() => {
    if (!pathname || pathname === "/") return false;
    if (fullBleedHeaderPaths.some((route) => pathname === route)) return false;
    if (productDetailPattern.test(pathname)) return false;
    return !relaxedPaddingPaths.some((route) => pathname.startsWith(route));
  }, [
    pathname,
    fullBleedHeaderPaths,
    relaxedPaddingPaths,
    productDetailPattern,
  ]);

  // product detail pages have no hero header of their own, but the navbar is
  // always solid there — so content just needs enough padding to clear it.
  const needsNavbarClearance = useMemo(
    () => !!pathname && productDetailPattern.test(pathname),
    [pathname, productDetailPattern],
  );

  return (
    <AuthProvider verifyOnMount={verifyAuth}>
      <CartProvider>
        {hideLayout ? (
          children
        ) : (
          <>
            <Navbar />
            <div
              ref={pathname === "/" ? heroRef : undefined}
              className={`bg-black/5 min-h-screen ${
                pathname === "/"
                  ? ""
                  : needsStandardPadding
                    ? "pt-40"
                    : needsNavbarClearance
                      ? "pt-20 lg:pt-40"
                      : ""
              }`}
            >
              {children}
            </div>
            <Footer />
          </>
        )}
      </CartProvider>
    </AuthProvider>
  );
}

export default function CommerceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LayoutContent>{children}</LayoutContent>;
}
