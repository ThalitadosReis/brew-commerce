import mongoose, { Types, Schema, models } from "mongoose";

export interface IProductSize {
  size: "250g" | "500g" | "1kg";
  price: number;
  stock: number;
}

export interface IProduct {
  _id?: Types.ObjectId;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  country: string;
  stock: number;
  sizes: IProductSize[];
  createdAt?: Date;
  updatedAt?: Date;
}

const ProductSizeSchema = new Schema<IProductSize>(
  {
    size: {
      type: String,
      enum: ["250g", "500g", "1kg"],
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
  },
  { _id: false }
);

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: false,
      min: 0,
      default: 0,
    },
    images: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      required: true,
      trim: true,
    },
    stock: {
      type: Number,
      required: false,
      min: 0,
      default: 0,
    },
    sizes: {
      type: [ProductSizeSchema],
      required: true,
      validate: {
        validator: (val: IProductSize[]) => val.length > 0,
        message: "At least one size is required",
      },
    },
  },
  { timestamps: true }
);

const Product =
  models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
