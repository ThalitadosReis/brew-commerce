"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Product } from "@/types/cart";

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
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // fetch wishlist from database when user is signed in
  useEffect(() => {
    if (!isClient) return;

    const fetchWishlist = async () => {
      if (isSignedIn && user) {
        try {
          setLoading(true);

          // check if there's a localStorage wishlist to migrate
          const localWishlist = localStorage.getItem("wishlist");
          let localItems: Product[] = [];

          if (localWishlist) {
            try {
              localItems = JSON.parse(localWishlist);
            } catch (error) {
              console.error("Failed to parse localStorage wishlist:", error);
            }
          }

          // fetch database wishlist
          const response = await fetch("/api/wishlist");

          if (response.ok) {
            const data = await response.json();
            const dbItems = data.items || [];

            // migrate localStorage items to database if any exist
            if (localItems.length > 0) {
              const migratePromises = localItems.map((item) =>
                fetch("/api/wishlist", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ productId: item.id }),
                }).catch((err) => console.error("Failed to migrate item:", err))
              );

              await Promise.all(migratePromises);

              // fetch updated wishlist after migration
              const updatedResponse = await fetch("/api/wishlist");
              if (updatedResponse.ok) {
                const updatedData = await updatedResponse.json();
                setWishlist(updatedData.items || []);
              } else {
                setWishlist(dbItems);
              }

              // clear localStorage after successful migration
              localStorage.removeItem("wishlist");
            } else {
              setWishlist(dbItems);
            }
          } else {
            console.error("Failed to fetch wishlist:", response.status);
          }
        } catch (error) {
          console.error("Error fetching wishlist:", error);
        } finally {
          setLoading(false);
        }
      } else {
        // load from localStorage for non-authenticated users
        const savedWishlist = localStorage.getItem("wishlist");
        if (savedWishlist) {
          try {
            setWishlist(JSON.parse(savedWishlist));
          } catch (error) {
            console.error("Failed to load wishlist from localStorage:", error);
          }
        }
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [isSignedIn, user, isClient]);

  // save to localStorage for non-authenticated users
  useEffect(() => {
    if (!isClient || isSignedIn) return;
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist, isClient, isSignedIn]);

  const addToWishlist = async (product: Product) => {
    if (isSignedIn && user) {
      // add to database
      try {
        const response = await fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: product.id }),
        });

        if (response.ok) {
          setWishlist((prev) => {
            if (!prev.find((item) => item.id === product.id)) {
              return [...prev, product];
            }
            return prev;
          });
        } else {
          console.error("Failed to add to wishlist:", response.status);
        }
      } catch (error) {
        console.error("Error adding to wishlist:", error);
      }
    } else {
      // add to localStorage
      setWishlist((prev) => {
        if (!prev.find((item) => item.id === product.id)) {
          return [...prev, product];
        }
        return prev;
      });
    }
  };

  const removeFromWishlist = async (productId: string | number) => {
    if (isSignedIn && user) {
      // remove from database
      try {
        const response = await fetch(`/api/wishlist?productId=${productId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setWishlist((prev) => prev.filter((item) => item.id !== productId));
        } else {
          console.error("Failed to remove from wishlist:", response.status);
        }
      } catch (error) {
        console.error("Error removing from wishlist:", error);
      }
    } else {
      // remove from localStorage
      setWishlist((prev) => prev.filter((item) => item.id !== productId));
    }
  };

  const isInWishlist = (productId: string | number) => {
    return wishlist.some((item) => item.id === productId);
  };

  const getTotalWishlistItems = () => {
    return wishlist.length;
  };

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
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
