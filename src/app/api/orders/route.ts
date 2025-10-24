import { NextRequest, NextResponse } from "next/server";
import { withAdmin, AuthenticatedRequest } from "@/middleware/auth";
import connectDB from "@/lib/mongodb";
import Order, { IOrder, IOrderItem } from "@/models/Order";
import Product, { IProduct } from "@/models/Product";
import {
  sendOrderConfirmationEmail,
  sendAdminOrderNotification,
} from "@/lib/email";

// admin — get all orders
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

    if (!sessionId || typeof sessionId !== "string") {
      return NextResponse.json(
        { error: "Valid sessionId is required" },
        { status: 400 }
      );
    }

    // if order already exists - return it
    const existingOrder = await Order.findOne({ sessionId }).lean<IOrder>();
    if (existingOrder) {
      return NextResponse.json(
        { message: "Order already exists", order: existingOrder },
        { status: 200 }
      );
    }

    // if cart was cleared before saving - allow success page
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        {
          message:
            "Payment successful, but no items were sent to create an order.",
          order: null,
        },
        { status: 200 }
      );
    }

    // update stock item
    for (const item of items) {
      const product = await Product.findById(item.productId).lean<IProduct>();
      if (!product) continue;

      if (item.size && item.size !== "default") {
        const sizeIndex = product.sizes.findIndex((s) => s.size === item.size);
        if (sizeIndex !== -1) {
          const newStock = Math.max(
            0,
            product.sizes[sizeIndex].stock - item.quantity
          );
          await Product.updateOne(
            { _id: product._id },
            { $set: { [`sizes.${sizeIndex}.stock`]: newStock } }
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

    // send email notifications
    if (customerEmail) {
      const emailItems = items.map((item: IOrderItem) => ({
        name: item.name,
        quantity: item.quantity,
        size: item.size,
        price: item.price,
        images: item.image ? [item.image] : undefined,
      }));

      const orderDetails = {
        orderId: sessionId,
        customerName: customerEmail.split("@")[0],
        customerEmail,
        items: emailItems,
        subtotal,
        shipping,
        total,
        orderDate: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      };

      try {
        await Promise.all([
          sendOrderConfirmationEmail({ to: customerEmail, orderDetails }),
          sendAdminOrderNotification({ orderDetails }),
        ]);
      } catch (err) {
        console.error("Email sending failed:", err);
      }
    }

    return NextResponse.json(
      { message: "Order created successfully", order },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Server error while creating order" },
      { status: 500 }
    );
  }
}

export const GET = withAdmin(getOrders);
