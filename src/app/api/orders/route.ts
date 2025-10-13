import { NextRequest, NextResponse } from "next/server";
import { withAdmin, AuthenticatedRequest } from "@/middleware/auth";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";

// admin get all orders
async function getOrders(request: AuthenticatedRequest) {
  try {
    await connectDB();
    const orders = await Order.find().sort({ createdAt: -1 }).lean();

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
      shippingAddress,
    } = body;

    // validate required fields
    if (!sessionId || !items || items.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields: sessionId and items" },
        { status: 400 }
      );
    }

    // check if order already exists
    const existingOrder = await Order.findOne({ sessionId });
    if (existingOrder) {
      return NextResponse.json(
        { error: "Order already exists", order: existingOrder },
        { status: 409 }
      );
    }

    // update stock for each item
    for (const item of items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        console.warn(`Product not found: ${item.productId}`);
        continue;
      }

      // find the specific size and decrease its stock
      if (item.size) {
        const sizeIndex = product.sizes.findIndex(
          (s: { size: string }) => s.size === item.size
        );

        if (sizeIndex !== -1) {
          const currentStock = product.sizes[sizeIndex].stock;
          const newStock = Math.max(0, currentStock - item.quantity);
          product.sizes[sizeIndex].stock = newStock;

          await product.save();
          console.log(
            `Updated stock for ${product.name} (${item.size}): ${currentStock} → ${newStock}`
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
      shippingAddress,
      status: "completed",
    });

    return NextResponse.json(
      { order, message: "Order created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}

// GET with admin authentication
export const GET = withAdmin(getOrders);
