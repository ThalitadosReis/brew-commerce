import { NextResponse } from "next/server";
import { withAdmin, AuthenticatedRequest } from "@/middleware/auth";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import Order from "@/models/Order";

async function getStats(request: AuthenticatedRequest) {
  try {
    await connectDB();

    const [totalProducts, totalOrders, orderStats, uniqueCustomers] =
      await Promise.all([
        Product.countDocuments(),
        Order.countDocuments(),
        Order.aggregate([
          {
            $group: {
              _id: null,
              totalRevenue: { $sum: "$total" },
            },
          },
        ]),
        Order.aggregate([
          {
            $match: { customerEmail: { $exists: true, $ne: null } },
          },
          {
            $group: {
              _id: "$customerEmail",
            },
          },
          {
            $count: "total",
          },
        ]),
      ]);

    const totalRevenue = orderStats[0]?.totalRevenue || 0;
    const totalUsers = uniqueCustomers[0]?.total || 0;

    return NextResponse.json({
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
    });
  } catch (error) {
    console.error("Get stats error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export const GET = withAdmin(getStats);
