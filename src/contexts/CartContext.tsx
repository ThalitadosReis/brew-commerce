"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from "react";
import { useUser } from "@clerk/nextjs";
import type {
  CartItem,
  Product,
  CartContextType,
  ProductSize,
} from "@/types/product";
import type { ICartItem } from "@/models/Cart";
import { useDebouncedEffect } from "@/hooks/useDebouncedEffect";
import { readJSON } from "@/hooks/useLocalStorage";
import { shallowArrayEqual } from "@/utils/array";
import { useToast } from "@/contexts/ToastContext";

//  reducer and action types
type CartAction =
  | { type: "ADD_TO_CART"; payload: CartItem }
  | {
      type: "REMOVE_FROM_CART";
      payload: { id: string | number; selectedSizes?: string[] };
    }
  | {
      type: "UPDATE_QUANTITY";
      payload: {
        id: string | number;
        quantity: number;
        selectedSizes?: string[];
      };
    }
  | { type: "LOAD_CART"; payload: CartItem[] }
  | { type: "CLEAR_CART" };

function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case "ADD_TO_CART": {
      const newItem = action.payload;
      const existingIndex = state.findIndex(
        (cartItem) =>
          cartItem.id === newItem.id &&
          shallowArrayEqual(cartItem.selectedSizes, newItem.selectedSizes)
      );
      if (existingIndex >= 0) {
        const next = [...state];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + newItem.quantity,
        };
        return next;
      }
      return [...state, newItem];
    }

    case "REMOVE_FROM_CART": {
      const { id, selectedSizes } = action.payload;
      return state.filter(
        (cartItem) =>
          !(
            cartItem.id === id &&
            shallowArrayEqual(cartItem.selectedSizes, selectedSizes)
          )
      );
    }

    case "UPDATE_QUANTITY": {
      const { id, quantity, selectedSizes } = action.payload;
      return state
        .map((cartItem) =>
          cartItem.id === id &&
          shallowArrayEqual(cartItem.selectedSizes, selectedSizes)
            ? { ...cartItem, quantity }
            : cartItem
        )
        .filter((cartItem) => cartItem.quantity > 0);
    }

    case "LOAD_CART":
      return action.payload;

    case "CLEAR_CART":
      return [];

    default:
      return state;
  }
}

//  helpers
function validateStock(
  selectedSizes: string[],
  sizes: ProductSize[] = [],
  quantity: number
) {
  if (!sizes?.length) return { ok: true as const };
  for (const selected of selectedSizes) {
    const sizeEntry = sizes.find((entry) => entry.size === selected);
    if (!sizeEntry) continue;
    if (quantity > sizeEntry.stock) {
      return {
        ok: false as const,
        message: `Only ${sizeEntry.stock} in stock for ${selected}`,
      };
    }
  }
  return { ok: true as const };
}

type SizeLike = { size: string; stock: number };

function maxAllowedQtyForSelection(
  selectedSizes: string[],
  sizes?: SizeLike[]
) {
  if (!sizes?.length) return Number.POSITIVE_INFINITY;
  let maxAllowed = Number.POSITIVE_INFINITY;
  for (const selected of selectedSizes) {
    const sizeEntry = sizes.find((entry) => entry.size === selected);
    if (sizeEntry) maxAllowed = Math.min(maxAllowed, sizeEntry.stock);
  }
  return maxAllowed;
}

function keyOf(item: Pick<CartItem, "id" | "selectedSizes">) {
  return `${item.id}::${(item.selectedSizes ?? []).join("|")}`;
}

// Merge by id + selectedSizes. Sum quantities then clamp to stock.
function mergeCartsStockAware(
  listA: CartItem[],
  listB: CartItem[]
): { items: CartItem[]; clampedCount: number } {
  const mergedMap = new Map<string, CartItem>();

  const insert = (incoming: CartItem) => {
    const key = keyOf(incoming);
    const existing = mergedMap.get(key);
    if (existing) {
      const richer =
        (incoming.sizes?.length ?? 0) > (existing.sizes?.length ?? 0)
          ? incoming
          : existing;
      mergedMap.set(key, {
        ...richer,
        quantity: (existing.quantity ?? 0) + (incoming.quantity ?? 0),
      });
    } else {
      mergedMap.set(key, { ...incoming });
    }
  };

  listA.forEach(insert);
  listB.forEach(insert);

  let clampedCount = 0;
  const mergedItems = Array.from(mergedMap.values()).map((cartItem) => {
    const maxAllowed = maxAllowedQtyForSelection(
      cartItem.selectedSizes ?? [],
      cartItem.sizes
    );
    if (cartItem.quantity > maxAllowed) {
      clampedCount++;
      return { ...cartItem, quantity: Math.max(0, maxAllowed) };
    }
    return cartItem;
  });

  return {
    items: mergedItems.filter((cartItem) => cartItem.quantity > 0),
    clampedCount,
  };
}

//  context
const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, dispatch] = useReducer(cartReducer, []);
  const { isSignedIn, user } = useUser();
  const { showToast } = useToast();

  const isClientRef = useRef(false);
  const previousSignedInRef = useRef<boolean | null>(null);

  useEffect(() => {
    isClientRef.current = true;
  }, []);

  // load cart from localStorage and/or DB
  useEffect(() => {
    if (!isClientRef.current) return;
    const saved = readJSON<CartItem[]>("brew-cart", []);
    if (saved?.length) {
      dispatch({ type: "LOAD_CART", payload: saved });
    }
  }, []);

  // handle auth transitions (merge on login, persist & clear on logout)
  useEffect(() => {
    const wasSignedIn = previousSignedInRef.current;
    const isCurrentlySignedIn = !!isSignedIn;

    // guest -> signed-in (login)
    if (wasSignedIn === false && isCurrentlySignedIn === true && user) {
      (async () => {
        try {
          const databaseResponse = await fetch("/api/cart");
          const databaseItemsRaw: { items: ICartItem[] } = databaseResponse.ok
            ? await databaseResponse.json()
            : { items: [] };

          const databaseItems: CartItem[] = (databaseItemsRaw.items ?? []).map(
            (record) => ({
              id: record.productId,
              _id: record.productId,
              name: record.name,
              description: record.description,
              price: record.price,
              quantity: record.quantity,
              selectedSizes: record.selectedSizes || [],
              images: record.images || [],
              category: record.category || "",
              country: record.country || "",
              sizes: record.sizes || [],
            })
          );

          const localItems = readJSON<CartItem[]>("brew-cart", []);
          const { items: mergedItems, clampedCount } = mergeCartsStockAware(
            databaseItems,
            localItems
          );

          await fetch("/api/cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ items: mergedItems }),
          }).catch(() => undefined);

          dispatch({ type: "LOAD_CART", payload: mergedItems });
          try {
            window.localStorage.setItem(
              "brew-cart",
              JSON.stringify(mergedItems)
            );
          } catch {}

          if (clampedCount > 0) {
            showToast(
              `${clampedCount} cart item${
                clampedCount > 1 ? "s" : ""
              } adjusted to available stock`,
              "warning"
            );
          }
        } catch (error) {
          console.error("Cart merge on login failed:", error);
        }
      })();
    }

    // signed-in -> guest (logout)
    if (wasSignedIn === true && isCurrentlySignedIn === false) {
      (async () => {
        try {
          await fetch("/api/cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ items }),
          }).catch(() => undefined);
        } finally {
          dispatch({ type: "CLEAR_CART" });
          try {
            window.localStorage.removeItem("brew-cart");
          } catch {}
        }
      })();
    }

    previousSignedInRef.current = isCurrentlySignedIn;
  }, [isSignedIn, user, items, showToast]);

  // debounced persistence: mirror to localStorage, and if signed in, POST to DB
  useDebouncedEffect(
    () => {
      if (!isClientRef.current) return;

      try {
        window.localStorage.setItem("brew-cart", JSON.stringify(items));
      } catch {}

      if (isSignedIn && user) {
        void fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items }),
        }).catch((error) => console.error("Failed to save cart to DB", error));
      }
    },
    [items, isSignedIn, user],
    { delay: 500 }
  );

  //  actions
  const addToCart = useCallback(
    (product: Product, selectedSizes: string[], quantity: number) => {
      const existing = items.find(
        (cartItem) =>
          cartItem.id === product._id &&
          shallowArrayEqual(cartItem.selectedSizes, selectedSizes)
      );
      const currentQuantity = existing ? existing.quantity : 0;

      const stockCheck = validateStock(
        selectedSizes,
        product.sizes,
        currentQuantity + quantity
      );
      if (!stockCheck.ok) {
        showToast(stockCheck.message!, "warning");
        return;
      }

      const effectivePrice =
        product.sizes.find((sizeEntry) => sizeEntry.size === selectedSizes[0])
          ?.price ?? product.price;

      dispatch({
        type: "ADD_TO_CART",
        payload: {
          id: product._id,
          _id: product._id,
          name: product.name,
          description: product.description,
          price: effectivePrice,
          images: product.images,
          category: product.category,
          country: product.country,
          selectedSizes,
          quantity,
          sizes: product.sizes,
        },
      });
    },
    [items, showToast]
  );

  const updateQuantity = useCallback(
    (
      productId: string | number,
      quantity: number,
      selectedSizes?: string[]
    ) => {
      const target = items.find(
        (cartItem) =>
          cartItem.id === productId &&
          shallowArrayEqual(cartItem.selectedSizes, selectedSizes)
      );
      if (!target) return;

      const stockCheck = validateStock(
        target.selectedSizes,
        target.sizes,
        quantity
      );
      if (!stockCheck.ok) {
        showToast(stockCheck.message!, "warning");
        return;
      }

      dispatch({
        type: "UPDATE_QUANTITY",
        payload: { id: productId, quantity, selectedSizes },
      });
    },
    [items, showToast]
  );

  const removeFromCart = useCallback(
    (productId: string | number, selectedSizes?: string[]) => {
      dispatch({
        type: "REMOVE_FROM_CART",
        payload: { id: productId, selectedSizes },
      });
    },
    []
  );

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR_CART" });
    try {
      window.localStorage.removeItem("brew-cart");
    } catch {}
  }, []);

  // selectors
  const totalItems = useMemo(
    () => items.reduce((sum, cartItem) => sum + cartItem.quantity, 0),
    [items]
  );
  const totalPrice = useMemo(
    () =>
      items.reduce(
        (sum, cartItem) => sum + cartItem.price * cartItem.quantity,
        0
      ),
    [items]
  );

  const value = useMemo<CartContextType>(
    () => ({
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalItems: () => totalItems,
      getTotalPrice: () => totalPrice,
    }),
    [
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}
