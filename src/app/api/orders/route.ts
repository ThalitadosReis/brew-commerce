import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";

import { withAdmin, AuthenticatedRequest } from "@/middleware/auth";
import connectDB from "@/lib/mongodb";
import Order, { IOrder, IOrderItem, IShippingAddress } from "@/models/Order";
import Product, { IProduct } from "@/models/Product";
import {
  sendOrderConfirmationEmail,
  sendAdminOrderNotification,
} from "@/lib/email";
import { getServerStripe } from "@/lib/stripe";
import {
  compactShippingAddress,
  ensurePaymentIntentShipping,
  extractShippingFromSession,
} from "@/lib/stripe/shipping";

type RawOrderItem = Record<string, unknown>;

interface CreateOrderBody {
  sessionId: unknown;
  items: unknown;
  subtotal: unknown;
  shipping: unknown;
  total: unknown;
  userId?: unknown;
  customerEmail?: unknown;
  shippingAddress?: unknown;
}

interface EmailOrderDetails {
  orderId: string;
  customerName: string;
  customerEmail: string;
  items: Array<{
    name: string;
    quantity: number;
    size?: string;
    price: number;
    images?: string[];
  }>;
  subtotal: number;
  shipping: number;
  total: number;
  orderDate: string;
  shippingAddress?: IShippingAddress;
}

// ------------------------------- helpers ---------------------------------

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function coerceCurrency(value: unknown): number {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) return 0;
  return Math.max(0, Number.parseFloat(numericValue.toFixed(2)));
}

function coerceQuantity(value: unknown): number {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) return 0;
  return Math.max(0, Math.floor(numericValue));
}

function normaliseOrderItem(raw: unknown): IOrderItem | null {
  if (!isPlainObject(raw)) return null;

  const productId =
    typeof raw.productId === "string" ? raw.productId.trim() : "";
  const name = typeof raw.name === "string" ? raw.name.trim() : "";

  if (!productId || !name) {
    return null;
  }

  return {
    productId,
    name,
    quantity: coerceQuantity(raw.quantity),
    price: coerceCurrency(raw.price),
    size: typeof raw.size === "string" ? raw.size : undefined,
    image: typeof raw.image === "string" ? raw.image : undefined,
  };
}

async function resolveShippingAddress(
  sessionId: string,
  input: unknown
): Promise<IShippingAddress | null> {
  const initialAddress = compactShippingAddress(
    input as {
      name?: string | null;
      line1?: string | null;
      line2?: string | null;
      city?: string | null;
      state?: string | null;
      postal_code?: string | null;
      country?: string | null;
    }
  );

  if (initialAddress) return initialAddress;

  try {
    const stripe = getServerStripe();
    const session = (await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["payment_intent", "payment_intent.shipping", "customer"],
    })) as Stripe.Checkout.Session;

    const paymentIntent =
      typeof session.payment_intent === "object" && session.payment_intent
        ? session.payment_intent
        : null;

    let shippingDetails =
      session.shipping_details ?? paymentIntent?.shipping ?? null;

    if (!shippingDetails && typeof session.payment_intent === "string") {
      shippingDetails = await ensurePaymentIntentShipping(
        stripe,
        session.payment_intent
      );
    }

    return extractShippingFromSession(
      session,
      paymentIntent ??
        (shippingDetails
          ? ({
              id: session.payment_intent ?? "unknown",
              object: "payment_intent",
              shipping: shippingDetails,
            } as Stripe.PaymentIntent)
          : undefined)
    );
  } catch (error) {
    console.error("Failed to hydrate shipping address from Stripe:", error);
    return null;
  }
}

async function updateInventoryForOrderItems(items: IOrderItem[]) {
  for (const item of items) {
    const product = await Product.findById(item.productId).lean<IProduct>();
    if (!product) continue;

    if (item.size && item.size !== "default") {
      const sizeIndex = product.sizes.findIndex(
        (entry) => entry.size === item.size
      );
      if (sizeIndex === -1) continue;

      const updatedStock = Math.max(
        0,
        product.sizes[sizeIndex].stock - item.quantity
      );
      await Product.updateOne(
        { _id: product._id },
        { $set: { [`sizes.${sizeIndex}.stock`]: updatedStock } }
      );
    }
  }
}

function buildEmailDetails(
  sessionId: string,
  customerEmail: string,
  items: IOrderItem[],
  subtotal: number,
  shipping: number,
  total: number,
  shippingAddress: IShippingAddress | null
): EmailOrderDetails {
  const orderDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return {
    orderId: sessionId,
    customerName: customerEmail.split("@")[0],
    customerEmail,
    items: items.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      size: item.size,
      price: item.price,
      images: item.image ? [item.image] : undefined,
    })),
    subtotal,
    shipping,
    total,
    orderDate,
    shippingAddress: shippingAddress ?? undefined,
  };
}

// ------------------------------ handlers ---------------------------------

async function getAdminOrders(_request: AuthenticatedRequest) {
  void _request;
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

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body: CreateOrderBody = await request.json();

    const sessionId =
      typeof body.sessionId === "string" ? body.sessionId.trim() : "";

    if (!sessionId || typeof sessionId !== "string") {
      return NextResponse.json(
        { error: "Valid sessionId is required" },
        { status: 400 }
      );
    }

    const rawItems = Array.isArray(body.items)
      ? (body.items as RawOrderItem[])
      : [];
    const orderItems = rawItems
      .map((item) => normaliseOrderItem(item))
      .filter((item): item is IOrderItem => Boolean(item));

    if (orderItems.length === 0) {
      if (rawItems.length > 0) {
        return NextResponse.json(
          { error: "Order items are missing product information" },
          { status: 400 }
        );
      }
      return NextResponse.json(
        {
          message:
            "Payment successful, but no items were sent to create an order.",
          order: null,
        },
        { status: 200 }
      );
    }

    const customerEmail =
      typeof body.customerEmail === "string" ? body.customerEmail.trim() : "";
    const userId = typeof body.userId === "string" ? body.userId : undefined;

    const subtotalValue = coerceCurrency(body.subtotal);
    const shippingValue = coerceCurrency(body.shipping);
    const totalValue = coerceCurrency(body.total);

    const shippingAddress = await resolveShippingAddress(
      sessionId,
      body.shippingAddress
    );

    const existingOrder = await Order.findOne({ sessionId });
    if (existingOrder) {
      if (shippingAddress) {
        const alreadyHasAddress =
          existingOrder.shippingAddress &&
          Object.values(existingOrder.shippingAddress).some(Boolean);
        if (!alreadyHasAddress) {
          existingOrder.shippingAddress = shippingAddress;
          await existingOrder.save();
        }
      }
      return NextResponse.json(
        { message: "Order already exists", order: existingOrder.toObject() },
        { status: 200 }
      );
    }

    await updateInventoryForOrderItems(orderItems);

    const order = await Order.create({
      sessionId,
      items: orderItems,
      subtotal: subtotalValue,
      shipping: shippingValue,
      total: totalValue,
      userId,
      customerEmail,
      shippingAddress,
    });

    if (customerEmail) {
      const orderDetails = buildEmailDetails(
        sessionId,
        customerEmail,
        orderItems,
        subtotalValue,
        shippingValue,
        totalValue,
        shippingAddress
      );

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

export const GET = withAdmin(getAdminOrders);
