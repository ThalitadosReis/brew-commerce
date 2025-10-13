export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
}

export interface ShippingAddress {
  name?: string;
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
}

export interface Order {
  id: string;
  date: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: string;
  customerEmail?: string;
  shippingAddress?: ShippingAddress;
}

export interface ApiOrder {
  _id: string;
  sessionId: string;
  createdAt: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: string;
  customerEmail?: string;
  shippingAddress?: ShippingAddress;
}

export interface ApiResponse {
  orders: ApiOrder[];
}
