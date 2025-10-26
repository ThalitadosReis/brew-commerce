"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useUser } from "@clerk/nextjs";
import type { Product } from "@/types/product";
import { useToast } from "@/contexts/ToastContext";
import { readJSON } from "@/hooks/useLocalStorage";

interface WishlistContextType {
  wishlist: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string | number) => void;
  isInWishlist: (productId: string | number) => boolean;
  getTotalWishlistItems: () => number;
  loading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined
);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { user, isSignedIn } = useUser();
  const { showToast } = useToast();
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // fetch wishlist from DB or localStorage
  useEffect(() => {
    setLoading(true);
    const local = readJSON<Product[]>("wishlist", []);
    if (!isSignedIn) {
      setWishlist(local);
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const res = await fetch("/api/wishlist");
        const dbItems: Product[] = res.ok ? (await res.json()).items || [] : [];
        if (local.length) {
          await Promise.all(
            local.map((item) =>
              fetch("/api/wishlist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId: item._id }),
              }).catch(() => undefined)
            )
          );
          try {
            window.localStorage.removeItem("wishlist");
          } catch {}
          const updated = await fetch("/api/wishlist");
          setWishlist(
            updated.ok ? (await updated.json()).items || [] : dbItems
          );
        } else {
          setWishlist(dbItems);
        }
      } catch (e) {
        console.error("Error fetching wishlist", e);
        setWishlist(local);
      } finally {
        setLoading(false);
      }
    })();
  }, [isSignedIn, user]);

  // save wishlist to localStorage for guests
  useEffect(() => {
    if (!isSignedIn) {
      try {
        window.localStorage.setItem("wishlist", JSON.stringify(wishlist));
      } catch {}
    }
  }, [wishlist, isSignedIn]);

  const isInWishlist = useCallback(
    (id: string | number) => wishlist.some((p) => p._id === id),
    [wishlist]
  );

  const addToWishlist = useCallback(
    async (product: Product) => {
      if (isInWishlist(product._id)) {
        showToast(`${product.name} is already in favorites`, "info");
        return;
      }
      if (isSignedIn && user) {
        try {
          const res = await fetch("/api/wishlist", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId: product._id }),
          });
          if (!res.ok) throw new Error("Failed");
          setWishlist((prev) => [...prev, product]);
          showToast(`${product.name} added to favorites`, "success");
        } catch {
          showToast("Failed to add to favorites", "error");
        }
      } else {
        setWishlist((prev) => [...prev, product]);
        showToast(`${product.name} added to favorites`, "success");
      }
    },
    [isInWishlist, isSignedIn, user, showToast]
  );

  const removeFromWishlist = useCallback(
    async (id: string | number) => {
      if (isSignedIn && user) {
        try {
          const res = await fetch(`/api/wishlist?productId=${id}`, {
            method: "DELETE",
          });
          if (!res.ok) throw new Error("Failed");
          setWishlist((prev) => prev.filter((p) => p._id !== id));
          showToast("Removed from favorites", "info");
        } catch {
          showToast("Failed to remove from favorites", "error");
        }
      } else {
        setWishlist((prev) => prev.filter((p) => p._id !== id));
        showToast("Removed from favorites", "info");
      }
    },
    [isSignedIn, user, showToast]
  );

  const total = useMemo(() => wishlist.length, [wishlist]);

  const value = useMemo<WishlistContextType>(
    () => ({
      wishlist,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      getTotalWishlistItems: () => total,
      loading,
    }),
    [wishlist, addToWishlist, removeFromWishlist, isInWishlist, total, loading]
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context)
    throw new Error("useWishlist must be used within a WishlistProvider");
  return context;
}
