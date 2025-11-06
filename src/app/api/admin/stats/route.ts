import { NextResponse } from "next/server";
import { withAdmin } from "@/middleware/auth";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import Order from "@/models/Order";

async function getStats() {
  try {
    await connectDB();

    const [
      totalProducts,
      totalOrders,
      orderStats,
      uniqueCustomers,
      aggregateItems,
      inventoryAggregate,
    ] = await Promise.all([
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
      Order.aggregate([
        {
          $unwind: "$items",
        },
        {
          $group: {
            _id: null,
            totalQty: { $sum: "$items.quantity" },
          },
        },
      ]),
      Product.aggregate([
        {
          $project: {
            totalStock: {
              $cond: [
                {
                  $gt: [
                    {
                      $size: {
                        $ifNull: ["$sizes", []],
                      },
                    },
                    0,
                  ],
                },
                {
                  $reduce: {
                    input: "$sizes",
                    initialValue: 0,
                    in: {
                      $add: ["$$value", { $ifNull: ["$$this.stock", 0] }],
                    },
                  },
                },
                { $ifNull: ["$stock", 0] },
              ],
            },
          },
        },
        {
          $group: {
            _id: null,
            totalUnits: { $sum: "$totalStock" },
          },
        },
      ]),
    ]);

    const totalRevenue = orderStats[0]?.totalRevenue || 0;
    const totalUsers = uniqueCustomers[0]?.total || 0;
    const totalItemsSold = aggregateItems[0]?.totalQty || 0;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const totalUnits = inventoryAggregate[0]?.totalUnits || 0;

    return NextResponse.json({
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
      avgOrderValue,
      totalItemsSold,
      totalUnits,
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
