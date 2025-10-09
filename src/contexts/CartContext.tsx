"use client";

import React, { createContext, useContext, useReducer, useEffect } from "react";
import { CartItem, Product, CartContextType } from "@/types/cart";

type CartAction =
  | { type: "ADD_TO_CART"; payload: CartItem }
  | {
      type: "REMOVE_FROM_CART";
      payload: { id: number; selectedSizes?: string[] };
    }
  | {
      type: "UPDATE_QUANTITY";
      payload: { id: number; quantity: number; selectedSizes?: string[] };
    }
  | { type: "LOAD_CART"; payload: CartItem[] };

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

    case "LOAD_CART": {
      return action.payload.map((item) => ({
        ...item,
        selectedSizes: item.selectedSizes || [],
      }));
    }

    default:
      return state;
  }
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, dispatch] = useReducer(cartReducer, []);
  const [isClient, setIsClient] = React.useState(false);

  // load cart from localStorage
  useEffect(() => {
    setIsClient(true);
    const savedCart = localStorage.getItem("brew-cart");
    if (savedCart) {
      try {
        const parsedCart = (JSON.parse(savedCart) as CartItem[]).map(
          (item) => ({
            ...item,
            selectedSizes: item.selectedSizes || [],
          })
        );
        dispatch({ type: "LOAD_CART", payload: parsedCart });
      } catch (error) {
        console.error("Failed to load cart from localStorage:", error);
      }
    }
  }, []);

  // save cart to localStorage
  useEffect(() => {
    if (!isClient) return;
    localStorage.setItem("brew-cart", JSON.stringify(items));
    window.dispatchEvent(new Event("cartUpdated"));
  }, [items, isClient]);

  // add to cart
  const addToCart = (
    product: Product,
    selectedSizes: string[],
    quantity: number
  ) => {
    dispatch({
      type: "ADD_TO_CART",
      payload: { ...product, selectedSizes, quantity },
    });
  };

  // update quantity
  const updateQuantity = (
    productId: number,
    quantity: number,
    selectedSizes?: string[]
  ) => {
    dispatch({
      type: "UPDATE_QUANTITY",
      payload: { id: productId, quantity, selectedSizes },
    });
  };

  // remove from cart
  const removeFromCart = (productId: number, selectedSizes?: string[]) => {
    dispatch({
      type: "REMOVE_FROM_CART",
      payload: { id: productId, selectedSizes },
    });
  };

  const getTotalItems = () =>
    items.reduce((total, item) => total + item.quantity, 0);

  const getTotalPrice = () =>
    items.reduce((total, item) => total + item.price * item.quantity, 0);

  const value: CartContextType = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    getTotalItems,
    getTotalPrice,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}
