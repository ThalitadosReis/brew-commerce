import type { ProductSize } from "@/types/product";

export interface ProductFormData {
  name: string;
  description: string;
  image: string;
  images: string[];
  category: string;
  country: string;
  sizes: ProductSize[];
}

export const initialProductFormState: ProductFormData = {
  name: "",
  description: "",
  image: "",
  images: [],
  category: "",
  country: "",
  sizes: [{ size: "250g", price: 0, stock: 0 }],
};
