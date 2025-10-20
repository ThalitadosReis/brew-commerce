export interface ProductSize {
  size: "250g" | "500g" | "1kg";
  price: number;
  stock: number;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  country: string;
  stock: number;
  sizes: ProductSize[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  id: string | number;
  _id?: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  country: string;
  quantity: number;
  selectedSizes: string[];
  sizes: ProductSize[];
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
