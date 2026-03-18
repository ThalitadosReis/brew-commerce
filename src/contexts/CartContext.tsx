"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import type {
  CartItem,
  Product,
  CartContextType,
  ProductSize,
} from "@/types/product";
import { readJSON } from "@/hooks/useLocalStorage";

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

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, dispatch] = useReducer(cartReducer, []);
  useEffect(() => {
    const saved = readJSON<CartItem[]>("brew-cart", []);
    if (saved?.length) {
      dispatch({ type: "LOAD_CART", payload: saved });
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem("brew-cart", JSON.stringify(items));
    } catch {}
  }, [items]);

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
      if (!stockCheck.ok) return;

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
    },
    [items]
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
      if (!stockCheck.ok) return;

      dispatch({
        type: "UPDATE_QUANTITY",
        payload: { id: productId, quantity, selectedSizes: normalizedSizes },
      });
    },
    [items]
  );

  const removeFromCart = useCallback(
    (productId: string | number, selectedSizes?: string[]) => {
      const normalized = normalizeSizes(selectedSizes);
      dispatch({
        type: "REMOVE_FROM_CART",
        payload: { id: productId, selectedSizes: normalized },
      });
    },
    [items]
  );

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR_CART" });
    try {
      window.localStorage.removeItem("brew-cart");
    } catch {}
  }, []);

  // -------------------------------- selectors -------------------------------

  const totalItemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const totalPriceAmount = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  const value = useMemo<CartContextType>(
    () => ({
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalItems: () => totalItemCount,
      getTotalPrice: () => totalPriceAmount,
    }),
    [
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItemCount,
      totalPriceAmount,
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
