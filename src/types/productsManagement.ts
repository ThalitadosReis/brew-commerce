import type { ProductSize } from "@/types/product";

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  image: string;
  images: string[];
  category: string;
  country: string;
  stock: number;
  sizes: ProductSize[];
}

export const initialProductFormState: ProductFormData = {
  name: "",
  description: "",
  price: 0,
  image: "",
  images: [],
  category: "",
  country: "",
  stock: 0,
  sizes: [
    { size: "250g", price: 0, stock: 0 },
    { size: "500g", price: 0, stock: 0 },
    { size: "1kg", price: 0, stock: 0 },
  ],
};
