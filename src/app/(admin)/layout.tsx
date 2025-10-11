"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import Navbar from "@/components/Navbar";

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <div className="admin-layout min-h-screen">
              <Navbar />
              <main className="p-8">{children}</main>
            </div>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ClerkProvider>
  );
}
