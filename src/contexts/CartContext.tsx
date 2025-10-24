"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useRef,
  ReactNode,
} from "react";
import { useUser } from "@clerk/nextjs";
import {
  CartItem,
  Product,
  CartContextType,
  ProductSize,
} from "@/types/product";
import { ICartItem } from "@/models/Cart";

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
      const payload = action.payload;
      const existingItem = state.find(
        (item) =>
          item.id === payload.id &&
          JSON.stringify(item.selectedSizes) ===
            JSON.stringify(payload.selectedSizes)
      );

      if (existingItem) {
        return state.map((item) =>
          item.id === existingItem.id &&
          JSON.stringify(item.selectedSizes) ===
            JSON.stringify(existingItem.selectedSizes)
            ? { ...item, quantity: item.quantity + payload.quantity }
            : item
        );
      }

      return [...state, payload];
    }

    case "REMOVE_FROM_CART": {
      const { id, selectedSizes } = action.payload;
      return state.filter(
        (item) =>
          !(
            item.id === id &&
            JSON.stringify(item.selectedSizes) === JSON.stringify(selectedSizes)
          )
      );
    }

    case "UPDATE_QUANTITY": {
      const { id, quantity, selectedSizes } = action.payload;
      return state
        .map((item) =>
          item.id === id &&
          JSON.stringify(item.selectedSizes) === JSON.stringify(selectedSizes)
            ? { ...item, quantity }
            : item
        )
        .filter((item) => item.quantity > 0);
    }

    case "LOAD_CART":
      return action.payload;

    case "CLEAR_CART":
      return [];

    default:
      return state;
  }
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function validateStock(
  selectedSizes: string[],
  sizes: ProductSize[] = [],
  quantity: number
) {
  if (!sizes.length) return { isValid: true };
  for (const size of selectedSizes) {
    const sizeData = sizes.find((s) => s.size === size);
    if (!sizeData) continue;
    if (quantity > sizeData.stock) {
      return {
        isValid: false,
        errorMessage: `Only ${sizeData.stock} in stock for ${size}`,
      };
    }
  }
  return { isValid: true };
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, dispatch] = useReducer(cartReducer, []);
  const { user, isSignedIn } = useUser();
  const isClientRef = useRef(false);

  useEffect(() => {
    isClientRef.current = true;
  }, []);

  // load cart from localStorage and/or DB
  useEffect(() => {
    if (!isClientRef.current) return;

    const loadCart = async () => {
      // LocalStorage first
      const saved = localStorage.getItem("brew-cart");
      if (saved) {
        try {
          const parsed: CartItem[] = JSON.parse(saved);
          dispatch({ type: "LOAD_CART", payload: parsed });
        } catch (e) {
          console.warn("Failed to parse cart from localStorage", e);
        }
      }

      // then DB if user signed in
      if (isSignedIn && user) {
        try {
          const res = await fetch("/api/cart");
          if (res.ok) {
            const data: { items: ICartItem[] } = await res.json();

            const transformed: CartItem[] = (data.items ?? []).map((i) => ({
              id: i.productId,
              _id: i.productId,
              name: i.name,
              description: i.description,
              price: i.price,
              quantity: i.quantity,
              selectedSizes: i.selectedSizes || [],
              images: i.images || [],
              category: i.category || "",
              country: i.country || "",
              sizes: i.sizes || [],
            }));

            dispatch({ type: "LOAD_CART", payload: transformed });
            localStorage.setItem("brew-cart", JSON.stringify(transformed));
          }
        } catch (e) {
          console.error("Failed to load cart from DB", e);
        }
      }
    };

    loadCart();
  }, [isSignedIn, user]);

  // persist cart to localStorage and DB
  useEffect(() => {
    if (!isClientRef.current) return;
    localStorage.setItem("brew-cart", JSON.stringify(items));

    if (isSignedIn && user) {
      const saveToDB = async () => {
        try {
          await fetch("/api/cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              items: items.map((i) => ({
                id: i.id,
                name: i.name,
                description: i.description,
                price: i.price,
                quantity: i.quantity,
                selectedSizes: i.selectedSizes || [],
                images: i.images || [],
                category: i.category,
                country: i.country,
                sizes: i.sizes,
              })),
            }),
          });
        } catch (e) {
          console.error("Failed to save cart to DB", e);
        }
      };
      const timeout = setTimeout(saveToDB, 500);
      return () => clearTimeout(timeout);
    }
  }, [items, isSignedIn, user]);

  const addToCart = (
    product: Product,
    selectedSizes: string[],
    quantity: number
  ) => {
    const existing = items.find(
      (i) =>
        i.id === product._id &&
        JSON.stringify(i.selectedSizes) === JSON.stringify(selectedSizes)
    );
    const currentQty = existing ? existing.quantity : 0;

    const stockCheck = validateStock(
      selectedSizes,
      product.sizes,
      currentQty + quantity
    );
    if (!stockCheck.isValid) {
      alert(stockCheck.errorMessage);
      return;
    }

    const price =
      product.sizes.find((s) => s.size === selectedSizes[0])?.price ||
      product.price;

    dispatch({
      type: "ADD_TO_CART",
      payload: {
        id: product._id,
        _id: product._id,
        name: product.name,
        description: product.description,
        price,
        images: product.images,
        category: product.category,
        country: product.country,
        selectedSizes,
        quantity,
        sizes: product.sizes,
      },
    });
  };

  const updateQuantity = (
    productId: string | number,
    quantity: number,
    selectedSizes?: string[]
  ) => {
    const item = items.find(
      (i) =>
        i.id === productId &&
        JSON.stringify(i.selectedSizes) === JSON.stringify(selectedSizes)
    );
    if (!item) return;

    const stockCheck = validateStock(item.selectedSizes, item.sizes, quantity);
    if (!stockCheck.isValid) {
      alert(stockCheck.errorMessage);
      return;
    }

    dispatch({
      type: "UPDATE_QUANTITY",
      payload: { id: productId, quantity, selectedSizes },
    });
  };

  const removeFromCart = (
    productId: string | number,
    selectedSizes?: string[]
  ) => {
    dispatch({
      type: "REMOVE_FROM_CART",
      payload: { id: productId, selectedSizes },
    });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
    localStorage.removeItem("brew-cart");
  };

  const getTotalItems = () => items.reduce((sum, i) => sum + i.quantity, 0);
  const getTotalPrice = () =>
    items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}
