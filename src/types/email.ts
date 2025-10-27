import type { IShippingAddress } from "@/models/Order";

export interface EmailOrderItem {
  name: string;
  quantity: number;
  size?: string;
  price: number;
  images?: string[];
}

export interface OrderEmailDetails {
  orderId: string;
  customerName: string;
  customerEmail: string;
  items: EmailOrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  orderDate: string;
  shippingAddress?: IShippingAddress | null;
}
