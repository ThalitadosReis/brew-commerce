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
  image: string;
  images?: string[];
  category: string;
  country: string;
  stock: number;
  sizes: ProductSize[];
  createdAt?: string;
  updatedAt?: string;
}
