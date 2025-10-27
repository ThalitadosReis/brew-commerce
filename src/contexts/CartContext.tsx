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
import { useToast } from "@/contexts/ToastContext";

// -------------------------------- helpers --------------------------------

type SizeStock = { size: string; stock: number };

function normalizeSizes(sizes?: readonly string[]) {
  return (sizes ?? []).slice().sort((a, b) => a.localeCompare(b));
}

function areSizesEqual(a?: readonly string[], b?: readonly string[]) {
  const na = normalizeSizes(a);
  const nb = normalizeSizes(b);
  if (na.length !== nb.length) return false;
  for (let i = 0; i < na.length; i++) if (na[i] !== nb[i]) return false;
  return true;
}

function toKeyId(id: string | number | null | undefined) {
  return id == null ? "" : String(id);
}

function keyForCartItem(item: Pick<CartItem, "id" | "selectedSizes">) {
  return `${toKeyId(item.id)}::${normalizeSizes(item.selectedSizes).join("|")}`;
}

function maxAllowedQuantityForSelection(
  selectedSizes: string[],
  sizes?: SizeStock[]
) {
  if (!sizes?.length) return Number.POSITIVE_INFINITY;
  let maxAllowed = Number.POSITIVE_INFINITY;
  for (const selected of selectedSizes) {
    const entry = sizes.find((record) => record.size === selected);
    if (entry) maxAllowed = Math.min(maxAllowed, entry.stock);
  }
  return maxAllowed;
}

// canonicalize sizes, merge duplicates by id + sizes, clamp to stock, drop quantity to 0
function canonicalizeAndDedupe(items: CartItem[]): CartItem[] {
  const cartItemMap = new Map<string, CartItem>();

  for (const rawItem of items) {
    const incomingItem: CartItem = {
      ...rawItem,
      selectedSizes: normalizeSizes(rawItem.selectedSizes),
    };
    const mergedKey = keyForCartItem(incomingItem);
    const existingItem = cartItemMap.get(mergedKey);

    if (!existingItem) {
      cartItemMap.set(mergedKey, { ...incomingItem });
      continue;
    }

    const richerItem =
      (incomingItem.sizes?.length ?? 0) > (existingItem.sizes?.length ?? 0)
        ? incomingItem
        : existingItem;

    cartItemMap.set(mergedKey, {
      ...richerItem,
      id: richerItem.id,
      _id: richerItem._id ?? richerItem.id,
      selectedSizes: normalizeSizes(richerItem.selectedSizes),
      quantity: (existingItem.quantity ?? 0) + (incomingItem.quantity ?? 0),
    });
  }

  return Array.from(cartItemMap.values())
    .map((item) => {
      const maxAllowed = maxAllowedQuantityForSelection(
        item.selectedSizes ?? [],
        item.sizes
      );
      return {
        ...item,
        quantity: Math.max(0, Math.min(item.quantity, maxAllowed)),
      };
    })
    .filter((item) => item.quantity > 0);
}

// -------------------------------- reducer --------------------------------

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
      const newItem: CartItem = {
        ...action.payload,
        selectedSizes: normalizeSizes(action.payload.selectedSizes),
      };

      const existingIndex = state.findIndex(
        (existingItem) =>
          toKeyId(existingItem.id) === toKeyId(newItem.id) &&
          areSizesEqual(existingItem.selectedSizes, newItem.selectedSizes)
      );

      if (existingIndex >= 0) {
        const nextState = [...state];
        nextState[existingIndex] = {
          ...nextState[existingIndex],
          quantity: nextState[existingIndex].quantity + newItem.quantity,
        };
        return canonicalizeAndDedupe(nextState);
      }

      return canonicalizeAndDedupe([...state, newItem]);
    }

    case "REMOVE_FROM_CART": {
      const { id, selectedSizes } = action.payload;
      return canonicalizeAndDedupe(
        state.filter(
          (existingItem) =>
            !(
              toKeyId(existingItem.id) === toKeyId(id) &&
              areSizesEqual(existingItem.selectedSizes, selectedSizes)
            )
        )
      );
    }

    case "UPDATE_QUANTITY": {
      const { id, quantity, selectedSizes } = action.payload;
      const nextState = state
        .map((existingItem) =>
          toKeyId(existingItem.id) === toKeyId(id) &&
          areSizesEqual(existingItem.selectedSizes, selectedSizes)
            ? { ...existingItem, quantity }
            : existingItem
        )
        .filter((item) => item.quantity > 0);
      return canonicalizeAndDedupe(nextState);
    }

    case "LOAD_CART":
      return canonicalizeAndDedupe(action.payload);

    case "CLEAR_CART":
      return [];

    default:
      return state;
  }
}

// -------------------------------- context --------------------------------

type ExtendedCartContextType = CartContextType & {
  clearServerCart: () => Promise<void>;
};

const CartContext = createContext<ExtendedCartContextType | undefined>(
  undefined
);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, dispatch] = useReducer(cartReducer, []);
  const { isSignedIn, user, isLoaded } = useUser();
  const { showToast } = useToast();

  const isClientRef = useRef(false);
  const previousSignedInRef = useRef<boolean | null>(null);
  const hasLoadedInitialCartRef = useRef(false);
  const itemsRef = useRef<CartItem[]>(items);
  const stableUserIdRef = useRef<string | null>(null);

  useEffect(() => {
    isClientRef.current = true;
  }, []);

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  // --------------------------- one-time initial load ---------------------------
  useEffect(() => {
    if (!isClientRef.current || hasLoadedInitialCartRef.current) return;
    if (!isLoaded) return;

    (async () => {
      if (isSignedIn && user) {
        try {
          const response = await fetch("/api/cart", {
            credentials: "include",
            cache: "no-store",
          });
          if (response.ok) {
            const payload: { items: ICartItem[] } = await response.json();
            const databaseItems: CartItem[] = (payload.items ?? []).map(
              (record) => ({
                id: record.productId,
                _id: record.productId,
                name: record.name,
                description: record.description,
                price: record.price,
                quantity: record.quantity,
                selectedSizes: normalizeSizes(record.selectedSizes || []),
                images: record.images || [],
                category: record.category || "",
                country: record.country || "",
                sizes: record.sizes || [],
              })
            );
            dispatch({ type: "LOAD_CART", payload: databaseItems });
          } else {
            const saved = readJSON<CartItem[]>("brew-cart", []);
            if (saved?.length) dispatch({ type: "LOAD_CART", payload: saved });
          }
        } catch {
          const saved = readJSON<CartItem[]>("brew-cart", []);
          if (saved?.length) dispatch({ type: "LOAD_CART", payload: saved });
        }
      } else {
        const saved = readJSON<CartItem[]>("brew-cart", []);
        if (saved?.length) dispatch({ type: "LOAD_CART", payload: saved });
      }
      hasLoadedInitialCartRef.current = true;
    })();
  }, [isLoaded, isSignedIn, user]);

  // ---------------------- auth transitions login / logout -------------------
  useEffect(() => {
    if (!isLoaded) return;

    const currentUserId = user?.id ?? null;
    const previousUserId = stableUserIdRef.current;
    const wasSignedIn = previousSignedInRef.current;
    const isCurrentlySignedIn = !!isSignedIn;

    // handle logout transition
    if (wasSignedIn === true && !isCurrentlySignedIn) {
      dispatch({ type: "CLEAR_CART" });
      try {
        window.localStorage.removeItem("brew-cart");
      } catch {}
      stableUserIdRef.current = null;
      previousSignedInRef.current = false;
      return;
    }

    // do not handle login merge until initial load is done
    if (!hasLoadedInitialCartRef.current) {
      previousSignedInRef.current = isCurrentlySignedIn;
      if (currentUserId) stableUserIdRef.current = currentUserId;
      return;
    }

    // handle login transition (merge guest cart with DB cart)
    if (!previousUserId && currentUserId && user) {
      (async () => {
        try {
          const response = await fetch("/api/cart", {
            credentials: "include",
            cache: "no-store",
          });
          const payload: { items: ICartItem[] } = response.ok
            ? await response.json()
            : { items: [] };

          const databaseItems: CartItem[] = (payload.items ?? []).map(
            (record) => ({
              id: record.productId,
              _id: record.productId,
              name: record.name,
              description: record.description,
              price: record.price,
              quantity: record.quantity,
              selectedSizes: normalizeSizes(record.selectedSizes || []),
              images: record.images || [],
              category: record.category || "",
              country: record.country || "",
              sizes: record.sizes || [],
            })
          );

          const mergedItems = canonicalizeAndDedupe([
            ...databaseItems,
            ...itemsRef.current,
          ]);

          await fetch("/api/cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            cache: "no-store",
            body: JSON.stringify({ items: mergedItems }),
          }).catch(() => undefined);

          dispatch({ type: "LOAD_CART", payload: mergedItems });
          try {
            window.localStorage.setItem(
              "brew-cart",
              JSON.stringify(mergedItems)
            );
          } catch {}

          const clamped = mergedItems.filter((item) => {
            const maxAllowed = maxAllowedQuantityForSelection(
              item.selectedSizes ?? [],
              item.sizes
            );
            return (
              item.quantity === maxAllowed &&
              maxAllowed !== Number.POSITIVE_INFINITY
            );
          });
          if (clamped.length > 0) {
            showToast(
              `${clamped.length} cart item${
                clamped.length > 1 ? "s" : ""
              } adjusted to available stock`,
              "warning"
            );
          }
        } catch (error) {
          console.error("Cart merge on login failed:", error);
        }
      })();
    }

    previousSignedInRef.current = isCurrentlySignedIn;
    if (currentUserId) stableUserIdRef.current = currentUserId;
  }, [isSignedIn, user, isLoaded, showToast]);

  // ------------- debounced persistence local + db ----------------

  useDebouncedEffect(
    () => {
      if (!isClientRef.current || !isLoaded) return;

      // always mirror to localStorage
      try {
        window.localStorage.setItem("brew-cart", JSON.stringify(items));
      } catch {}

      // save to DB if signed in
      if (isSignedIn && user) {
        const url = `${window.location.origin}/api/cart`;
        void fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items }),
          credentials: "include",
          cache: "no-store",
          keepalive: true,
        }).catch((error) => console.error("Failed to save cart to DB", error));
      }
    },
    [items, isSignedIn, user, isLoaded],
    { delay: 500 }
  );

  useEffect(() => {
    if (!isSignedIn || !user) return;
    const url = `${window.location.origin}/api/cart`;
    const handler = () => {
      try {
        const blob = new Blob([JSON.stringify({ items })], {
          type: "application/json",
        });
        if (navigator.sendBeacon) {
          navigator.sendBeacon(url, blob);
        } else {
          fetch(url, {
            method: "POST",
            body: JSON.stringify({ items }),
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            cache: "no-store",
            keepalive: true,
          }).catch(() => {});
        }
      } catch {}
    };
    window.addEventListener("beforeunload", handler);
    document.addEventListener("visibilitychange", handler);
    return () => {
      window.removeEventListener("beforeunload", handler);
      document.removeEventListener("visibilitychange", handler);
    };
  }, [isSignedIn, user, items]);

  // -------------------------------- actions --------------------------------

  const saveNowIfSignedIn = useCallback(
    (nextItems: CartItem[]) => {
      if (!isSignedIn || !user) return;
      fetch(`${window.location.origin}/api/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: nextItems }),
        credentials: "include",
        cache: "no-store",
        keepalive: true,
      }).catch(() => {});
    },
    [isSignedIn, user]
  );

  const addToCart = useCallback(
    (product: Product, selectedSizes: string[], quantity: number) => {
      const normalizedSizes = normalizeSizes(selectedSizes);
      const existingItem = items.find(
        (item) =>
          toKeyId(item.id) === toKeyId(product._id) &&
          areSizesEqual(item.selectedSizes, normalizedSizes)
      );
      const existingQuantity = existingItem ? existingItem.quantity : 0;

      const stockCheck = validateStock(
        normalizedSizes,
        product.sizes,
        existingQuantity + quantity
      );
      if (!stockCheck.ok) {
        showToast(stockCheck.message!, "warning");
        return;
      }

      const newItem: CartItem = {
        id: product._id,
        _id: product._id,
        name: product.name,
        description: product.description,
        price:
          product.sizes.find((s) => s.size === normalizedSizes[0])?.price ??
          product.price,
        images: product.images,
        category: product.category,
        country: product.country,
        selectedSizes: normalizedSizes,
        quantity,
        sizes: product.sizes,
      };

      dispatch({ type: "ADD_TO_CART", payload: newItem });
      saveNowIfSignedIn(canonicalizeAndDedupe([...items, newItem]));
    },
    [items, showToast, saveNowIfSignedIn]
  );

  const updateQuantity = useCallback(
    (
      productId: string | number,
      quantity: number,
      selectedSizes?: string[]
    ) => {
      const normalizedSizes = normalizeSizes(selectedSizes);
      const targetItem = items.find(
        (item) =>
          toKeyId(item.id) === toKeyId(productId) &&
          areSizesEqual(item.selectedSizes, normalizedSizes)
      );
      if (!targetItem) return;

      const stockCheck = validateStock(
        targetItem.selectedSizes,
        targetItem.sizes,
        quantity
      );
      if (!stockCheck.ok) {
        showToast(stockCheck.message!, "warning");
        return;
      }

      const nextItems = canonicalizeAndDedupe(
        items
          .map((item) =>
            toKeyId(item.id) === toKeyId(productId) &&
            areSizesEqual(item.selectedSizes, normalizedSizes)
              ? { ...item, quantity }
              : item
          )
          .filter((item) => item.quantity > 0)
      );

      dispatch({
        type: "UPDATE_QUANTITY",
        payload: { id: productId, quantity, selectedSizes: normalizedSizes },
      });
      saveNowIfSignedIn(nextItems);
    },
    [items, showToast, saveNowIfSignedIn]
  );

  const removeFromCart = useCallback(
    (productId: string | number, selectedSizes?: string[]) => {
      const normalized = normalizeSizes(selectedSizes);
      const nextItems = canonicalizeAndDedupe(
        items.filter(
          (item) =>
            !(
              toKeyId(item.id) === toKeyId(productId) &&
              areSizesEqual(item.selectedSizes, normalized)
            )
        )
      );

      dispatch({
        type: "REMOVE_FROM_CART",
        payload: { id: productId, selectedSizes: normalized },
      });
      saveNowIfSignedIn(nextItems);
    },
    [items, saveNowIfSignedIn]
  );

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR_CART" });
    try {
      window.localStorage.removeItem("brew-cart");
    } catch {}
  }, []);

  const clearServerCart = useCallback(async () => {
    try {
      if (!isSignedIn || !user) return;
      await fetch("/api/cart", {
        method: "DELETE",
        credentials: "include",
        cache: "no-store",
      });
    } catch (error) {
      console.error("Failed to clear server cart", error);
    }
  }, [isSignedIn, user]);

  // -------------------------------- selectors -------------------------------

  const totalItemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const totalPriceAmount = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  const value = useMemo<ExtendedCartContextType>(
    () => ({
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalItems: () => totalItemCount,
      getTotalPrice: () => totalPriceAmount,
      clearServerCart,
    }),
    [
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItemCount,
      totalPriceAmount,
      clearServerCart,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}

// ---------------------------- stock validation ---------------------------

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
