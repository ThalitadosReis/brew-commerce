export interface DashboardMetrics {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  avgOrderValue: number;
  totalItemsSold: number;
  totalUnits: number;
}

export interface RecentOrderItem {
  name: string;
  quantity: number;
  size?: string;
}

export interface RecentOrder {
  id: string;
  date: string;
  items: RecentOrderItem[];
  total: number;
  customerEmail: string;
  shippingAddress?: {
    name?: string | null;
    line1?: string | null;
    line2?: string | null;
    city?: string | null;
    state?: string | null;
    postal_code?: string | null;
    country?: string | null;
  } | null;
}

export type AdminDashboardTab = "overview" | "products" | "orders";
