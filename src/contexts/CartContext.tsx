"use client";

import React, { createContext, useContext, useReducer, useEffect } from "react";
import { CartItem, Product, CartContextType } from "@/types/product";

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
        images: item.images || [],
      }));
    }

    default:
      return state;
  }
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// helper function to validate stock for selected sizes
function validateStock(
  selectedSizes: string[],
  sizes: { size: string; stock: number; price: number }[],
  quantity: number
): { isValid: boolean; errorMessage?: string } {
  for (const sizeStr of selectedSizes) {
    const sizeData = sizes.find((s) => s.size === sizeStr);
    if (!sizeData) {
      console.warn(`Size ${sizeStr} not found in product`);
      continue;
    }

    if (quantity > sizeData.stock) {
      return {
        isValid: false,
        errorMessage: `Only ${sizeData.stock} available in stock for size ${sizeStr}.`,
      };
    }
  }
  return { isValid: true };
}

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
            images: item.images || [],
          })
        );
        dispatch({ type: "LOAD_CART", payload: parsedCart });
      } catch (error) {
        console.error("Failed to load cart from localStorage:", error);
      }
    }

    // listen for cart cleared event from success page
    const handleCartCleared = () => {
      console.log("cartCleared event received in CartContext");
      dispatch({ type: "LOAD_CART", payload: [] });
      console.log("Cart state cleared");
    };

    window.addEventListener("cartCleared", handleCartCleared);
    console.log("CartContext: cartCleared event listener added");

    return () => {
      window.removeEventListener("cartCleared", handleCartCleared);
    };
  }, []);

  // save cart to localStorage
  useEffect(() => {
    if (!isClient) return;
    localStorage.setItem("brew-cart", JSON.stringify(items));
    window.dispatchEvent(new Event("cartUpdated"));
  }, [items, isClient]);

  // add to cart with stock validation
  const addToCart = (
    product: Product,
    selectedSizes: string[],
    quantity: number
  ) => {
    // check existing quantity in cart for this product and size combination
    const existingItem = items.find(
      (item) =>
        item.id === product._id &&
        JSON.stringify(item.selectedSizes) === JSON.stringify(selectedSizes)
    );

    const currentQuantity = existingItem ? existingItem.quantity : 0;
    const newTotalQuantity = currentQuantity + quantity;

    // validate stock for each selected size
    const stockValidation = validateStock(
      selectedSizes,
      product.sizes,
      newTotalQuantity
    );

    if (!stockValidation.isValid) {
      alert(`Cannot add ${quantity} item(s). ${stockValidation.errorMessage}`);
      return;
    }

    // get the correct price for the selected size
    const selectedSizeData = product.sizes.find(
      (s) => s.size === selectedSizes[0]
    );
    const correctPrice = selectedSizeData
      ? selectedSizeData.price
      : product.price;

    console.log("CartContext - Dispatching ADD_TO_CART:", {
      productId: product._id,
      selectedSizes,
      quantity,
      currentQuantity,
      newTotalQuantity,
      price: correctPrice,
    });

    dispatch({
      type: "ADD_TO_CART",
      payload: {
        id: product._id,
        _id: product._id,
        name: product.name,
        description: product.description,
        price: correctPrice,
        images: product.images,
        category: product.category,
        country: product.country,
        selectedSizes,
        quantity,
        sizes: product.sizes,
      },
    });
  };

  // update quantity
  const updateQuantity = (
    productId: string | number,
    quantity: number,
    selectedSizes?: string[]
  ) => {
    // find the item in cart
    const item = items.find(
      (i) =>
        i.id === productId &&
        JSON.stringify(i.selectedSizes) === JSON.stringify(selectedSizes)
    );

    if (!item) {
      console.warn("Item not found in cart");
      return;
    }

    // validate stock for each selected size
    const stockValidation = validateStock(
      item.selectedSizes,
      item.sizes,
      quantity
    );

    if (!stockValidation.isValid) {
      alert(
        `Cannot set quantity to ${quantity}. ${stockValidation.errorMessage}`
      );
      return;
    }

    dispatch({
      type: "UPDATE_QUANTITY",
      payload: { id: productId, quantity, selectedSizes },
    });
  };

  // remove from cart
  const removeFromCart = (
    productId: string | number,
    selectedSizes?: string[]
  ) => {
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
