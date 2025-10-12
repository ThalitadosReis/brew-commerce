export interface Product {
  id: string | number;
  name: string;
  price: number;
  images: string[];
  description: string;
  country: string;
  roast: string;
  sizes: string[];
  prices?: { [key: string]: number };
}

export interface CartItem extends Product {
  quantity: number;
  selectedSizes: string[];
}
export interface CartContextType {
  items: CartItem[];
  addToCart: (
    product: Product,
    selectedSizes: string[],
    quantity: number
  ) => void;
  removeFromCart: (
    productId: string | number,
    selectedSizes?: string[]
  ) => void;
  updateQuantity: (
    productId: string | number,
    quantity: number,
    selectedSizes?: string[]
  ) => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}
