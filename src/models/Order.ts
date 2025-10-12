import mongoose, { Schema, models } from "mongoose";

export interface IOrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  size?: string;
}

export interface IOrder {
  userId?: string;
  sessionId: string;
  items: IOrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: "pending" | "processing" | "completed" | "cancelled";
  customerEmail?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  productId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  size: {
    type: String,
  },
});

const OrderSchema = new Schema<IOrder>(
  {
    userId: {
      type: String,
      required: false,
    },
    sessionId: {
      type: String,
      required: true,
      unique: true,
    },
    items: [OrderItemSchema],
    subtotal: {
      type: Number,
      required: true,
    },
    shipping: {
      type: Number,
      required: true,
      default: 0,
    },
    total: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "cancelled"],
      default: "completed",
    },
    customerEmail: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// delete the existing model if it exists to avoid caching issues
if (models.Order) {
  delete models.Order;
}

const Order = mongoose.model<IOrder>("Order", OrderSchema);

export default Order;
