export interface ShippingAddress {
  name?: string;
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
}

export interface OrderItem {
  id?: string;
  productId?: string;
  name: string;
  quantity: number;
  size?: string;
  price: number;
  image?: string;
  images?: string | string[];
}

export interface ApiOrder {
  _id?: string;
  sessionId?: string;
  createdAt?: string;
  items?: OrderItem[];
  subtotal?: number;
  shipping?: number;
  total?: number;
  customerEmail?: string;
  shippingAddress?: ShippingAddress;
}

export interface OrdersResponse {
  orders: ApiOrder[];
}

export interface RecentOrder {
  id: string;
  sessionId?: string;
  date: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  customerEmail?: string;
  shippingAddress?: ShippingAddress;
}

export interface ManagedOrder {
  id: string;
  sessionId: string;
  createdAt: string;
  date: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  customerEmail?: string;
  shippingAddress?: ShippingAddress;
}
