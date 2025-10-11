"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { usePathname } from "next/navigation";

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const hideLayout =
    pathname === "/sign-in" ||
    pathname === "/sign-up" ||
    pathname === "/user-profile";

  if (hideLayout) return <>{children}</>;

  return (
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          <Navbar />
          {children}
          <Footer />
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
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
