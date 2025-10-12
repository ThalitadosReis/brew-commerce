import mongoose, { Schema, models } from "mongoose";

export interface IProductSize {
  size: "250g" | "500g" | "1kg";
  price: number;
  stock: number;
}

export interface IProduct {
  name: string;
  description: string;
  price: number;
  image: string;
  images: string[];
  category: string;
  country: string;
  stock: number;
  sizes: IProductSize[];
  createdAt: Date;
}

const ProductSizeSchema = new Schema<IProductSize>({
  size: { type: String, enum: ["250g", "500g", "1kg"], required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true, default: 0 },
});

function arrayMinSize(val: IProductSize[]) {
  return val.length > 0;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: false, default: 0 },
    image: { type: String, required: true },
    images: { type: [String], default: [] },
    category: { type: String, required: true },
    country: { type: String, required: true },
    stock: { type: Number, required: false, default: 0 },
    sizes: {
      type: [ProductSizeSchema],
      required: true,
      validate: [arrayMinSize, "At least one size is required"],
    },
  },
  { timestamps: true }
);

const Product =
  models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
