export interface OrderItem {
  id?: string;
  name: string;
  quantity: number;
  size?: string;
  price: number;
  images?: string;
}

export interface ApiOrder {
  _id?: string;
  sessionId?: string;
  createdAt?: string;
  items?: OrderItem[];
  subtotal?: number;
  total?: number;
  customerEmail?: string;
}

export interface RecentOrder {
  id: string;
  date: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  customerEmail?: string;
}
