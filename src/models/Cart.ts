import mongoose, { Schema, models, Types } from "mongoose";

export interface ProductSize {
  size: "250g" | "500g" | "1kg";
  price: number;
  stock: number;
}

export interface ICartItem {
  productId: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  selectedSizes: string[];
  images?: string[];
  category?: string;
  country?: string;
  sizes: ProductSize[];
}

export interface ICart {
  _id?: Types.ObjectId;
  userId: string;
  items: ICartItem[];
  updatedAt?: Date;
  createdAt?: Date;
}

const CartItemSchema = new Schema<ICartItem>(
  {
    productId: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
    selectedSizes: { type: [String], default: [] },
    images: { type: [String], default: [] },
    category: { type: String },
    country: { type: String },
    sizes: {
      type: [{ size: String, price: Number, stock: Number }],
      default: [],
    },
  },
  { _id: false }
);

const CartSchema = new Schema<ICart>(
  {
    userId: { type: String, required: true, unique: true, index: true },
    items: { type: [CartItemSchema], default: [] },
  },
  { timestamps: true }
);

const Cart = models.Cart || mongoose.model<ICart>("Cart", CartSchema);

export default Cart;
