import { NextRequest, NextResponse } from "next/server";
import { withAdmin, AuthenticatedRequest } from "@/middleware/auth";
import connectDB from "@/lib/mongodb";
import Order, { IOrder } from "@/models/Order";
import Product, { IProduct } from "@/models/Product";

interface OrderItem {
  productId: string;
  size?: string;
  quantity: number;
}

// admin get all orders
async function getOrders(request: AuthenticatedRequest) {
  try {
    await connectDB();
    const orders = await Order.find().sort({ createdAt: -1 }).lean<IOrder[]>();
    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

// create new order
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    const {
      sessionId,
      items,
      subtotal,
      shipping,
      total,
      userId,
      customerEmail,
    } = body;

    // validate required fields
    if (!sessionId || typeof sessionId !== "string") {
      return NextResponse.json(
        { error: "Valid sessionId is required" },
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Items array is required and must not be empty" },
        { status: 400 }
      );
    }

    // check if order already exists
    const existingOrder = await Order.findOne({ sessionId }).lean<IOrder>();
    if (existingOrder) {
      return NextResponse.json(
        { error: "Order already exists", order: existingOrder },
        { status: 409 }
      );
    }

    // update stock for each item
    for (const item of items as OrderItem[]) {
      const product = await Product.findById(item.productId).lean<IProduct>();

      if (!product) {
        console.warn(`Product not found: ${item.productId}`);
        continue;
      }

      if (item.size && item.size !== "default") {
        const sizeIndex = product.sizes.findIndex((s) => s.size === item.size);

        if (sizeIndex !== -1) {
          const currentStock = product.sizes[sizeIndex].stock;
          const newStock = Math.max(0, currentStock - item.quantity);

          await Product.updateOne(
            { _id: item.productId },
            { $set: { [`sizes.${sizeIndex}.stock`]: newStock } }
          );
        } else {
          console.warn(
            `Size ${item.size} not found for product ${product.name}`
          );
        }
      }
    }

    // create order
    const order = await Order.create({
      sessionId,
      items,
      subtotal: subtotal || 0,
      shipping: shipping || 0,
      total: total || 0,
      userId,
      customerEmail,
      status: "completed",
    });

    return NextResponse.json(
      { order, message: "Order created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating order:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Failed to create order";

    return NextResponse.json(
      {
        error: errorMessage,
        details: error instanceof Error ? error.toString() : String(error),
      },
      { status: 500 }
    );
  }
}

// GET with admin authentication
export const GET = withAdmin(getOrders);
