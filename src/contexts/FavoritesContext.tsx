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

interface FavoritesContextType {
  favorites: Product[];
  addToFavorites: (product: Product) => void;
  removeFromFavorites: (productId: string | number) => void;
  isFavorite: (productId: string | number) => boolean;
  getTotalFavorites: () => number;
  loading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

export function FavoritesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isSignedIn } = useUser();
  const { showToast } = useToast();
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const local = readJSON<Product[]>("favorites", []);

    if (!isSignedIn) {
      setFavorites(local);
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const res = await fetch("/api/favorites");
        const dbItems: Product[] = res.ok ? (await res.json()).items || [] : [];

        if (local.length) {
          await Promise.all(
            local.map((item) =>
              fetch("/api/favorites", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId: item._id }),
              }).catch(() => undefined)
            )
          );

          try {
            window.localStorage.removeItem("favorites");
          } catch {
            // ignore write errors (private mode, etc.)
          }

          const updated = await fetch("/api/favorites");
          setFavorites(
            updated.ok ? (await updated.json()).items || [] : dbItems
          );
        } else {
          setFavorites(dbItems);
        }
      } catch (error) {
        console.error("Error fetching favorites", error);
        setFavorites(local);
      } finally {
        setLoading(false);
      }
    })();
  }, [isSignedIn, user]);

  useEffect(() => {
    if (!isSignedIn) {
      try {
        window.localStorage.setItem("favorites", JSON.stringify(favorites));
      } catch {
        // ignore storage errors
      }
    }
  }, [favorites, isSignedIn]);

  const isFavorite = useCallback(
    (id: string | number) => favorites.some((product) => product._id === id),
    [favorites]
  );

  const addToFavorites = useCallback(
    async (product: Product) => {
      if (isFavorite(product._id)) {
        showToast(`${product.name} is already in favorites`, "info");
        return;
      }

      if (isSignedIn && user) {
        try {
          const res = await fetch("/api/favorites", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId: product._id }),
          });
          if (!res.ok) throw new Error("Failed to save favorites");

          setFavorites((prev) => [...prev, product]);
          showToast(`${product.name} added to favorites`, "success");
        } catch {
          showToast("Failed to add to favorites", "error");
        }
      } else {
        setFavorites((prev) => [...prev, product]);
        showToast(`${product.name} added to favorites`, "success");
      }
    },
    [isFavorite, isSignedIn, user, showToast]
  );

  const removeFromFavorites = useCallback(
    async (id: string | number) => {
      if (isSignedIn && user) {
        try {
          const res = await fetch(`/api/favorites?productId=${id}`, {
            method: "DELETE",
          });
          if (!res.ok) throw new Error("Failed to remove favorite");

          setFavorites((prev) => prev.filter((product) => product._id !== id));
          showToast("Removed from favorites", "info");
        } catch {
          showToast("Failed to remove from favorites", "error");
        }
      } else {
        setFavorites((prev) => prev.filter((product) => product._id !== id));
        showToast("Removed from favorites", "info");
      }
    },
    [isSignedIn, user, showToast]
  );

  const totalFavorites = useMemo(() => favorites.length, [favorites]);

  const value = useMemo<FavoritesContextType>(
    () => ({
      favorites,
      addToFavorites,
      removeFromFavorites,
      isFavorite,
      getTotalFavorites: () => totalFavorites,
      loading,
    }),
    [
      favorites,
      addToFavorites,
      removeFromFavorites,
      isFavorite,
      totalFavorites,
      loading,
    ]
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}
