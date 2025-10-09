export interface Product {
  id: number;
  name: string;
  price: number;
  images: string[];
  description: string;
  country: string;
  roast: string;
  sizes: string[];
  prices: { [key: string]: number };
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
  removeFromCart: (productId: number, selectedSizes?: string[]) => void;
  updateQuantity: (
    productId: number,
    quantity: number,
    selectedSizes?: string[]
  ) => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}
