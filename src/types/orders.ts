export interface OrderItem {
  name: string;
  quantity: number;
  size?: string;
}

export interface ApiOrder {
  _id?: string;
  sessionId?: string;
  createdAt?: string;
  items?: OrderItem[];
  total?: number;
  status?: string;
  customerEmail?: string;
}

export interface RecentOrder {
  id: string;
  date: string;
  items: OrderItem[];
  total: number;
  status: string;
  customerEmail?: string;
}