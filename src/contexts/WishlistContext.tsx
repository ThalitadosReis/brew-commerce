"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Product } from "@/types/product";
import { useToast } from "./ToastContext";

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
    const fetchWishlist = async () => {
      setLoading(true);

      if (isSignedIn && user) {
        try {
          const localWishlist = localStorage.getItem("wishlist");
          let localItems: Product[] = [];

          if (localWishlist) {
            try {
              localItems = JSON.parse(localWishlist);
            } catch {
              console.warn("Failed to parse localStorage wishlist");
            }
          }

          const response = await fetch("/api/wishlist");
          const dbItems = response.ok
            ? (await response.json()).items || []
            : [];

          // migrate localStorage items to DB
          if (localItems.length > 0) {
            await Promise.all(
              localItems.map((item) =>
                fetch("/api/wishlist", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ productId: item._id }),
                }).catch(console.error)
              )
            );

            localStorage.removeItem("wishlist");

            // refetch updated DB wishlist
            const updated = await fetch("/api/wishlist");
            setWishlist(
              updated.ok ? (await updated.json()).items || [] : dbItems
            );
          } else {
            setWishlist(dbItems);
          }
        } catch (error) {
          console.error("Error fetching wishlist:", error);
        } finally {
          setLoading(false);
        }
      } else {
        // load wishlist from localStorage for guests
        const saved = localStorage.getItem("wishlist");
        if (saved) {
          try {
            setWishlist(JSON.parse(saved));
          } catch {
            console.warn("Failed to load wishlist from localStorage");
          }
        }
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [isSignedIn, user]);

  // save wishlist to localStorage for guests
  useEffect(() => {
    if (!isSignedIn) {
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
    }
  }, [wishlist, isSignedIn]);

  const addToWishlist = async (product: Product) => {
    if (wishlist.find((item) => item._id === product._id)) return;

    if (isSignedIn && user) {
      try {
        const response = await fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: product._id }),
        });

        if (response.ok) {
          setWishlist((prev) => [...prev, product]);
          showToast(`${product.name} added to favorites`, "success");
        } else {
          showToast("Failed to add to favorites", "error");
        }
      } catch {
        showToast("Failed to add to favorites", "error");
      }
    } else {
      setWishlist((prev) => [...prev, product]);
      showToast(`${product.name} added to favorites`, "success");
    }
  };

  const removeFromWishlist = async (productId: string | number) => {
    if (isSignedIn && user) {
      try {
        const response = await fetch(`/api/wishlist?productId=${productId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setWishlist((prev) => prev.filter((item) => item._id !== productId));
          showToast("Removed from favorites", "info");
        } else {
          showToast("Failed to remove from favorites", "error");
        }
      } catch {
        showToast("Failed to remove from favorites", "error");
      }
    } else {
      setWishlist((prev) => prev.filter((item) => item._id !== productId));
      showToast("Removed from favorites", "info");
    }
  };

  const isInWishlist = (productId: string | number) =>
    wishlist.some((item) => item._id === productId);

  const getTotalWishlistItems = () => wishlist.length;

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        getTotalWishlistItems,
        loading,
      }}
    >
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
