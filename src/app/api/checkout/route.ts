import { NextRequest, NextResponse } from "next/server";
import { getServerStripe, formatAmountForStripe } from "@/lib/stripe";

const stripe = getServerStripe();

interface CheckoutItem {
  name: string;
  description: string;
  price: number;
  quantity: number;
}

export async function POST(req: NextRequest) {
  try {
    const { items, email } = await req.json();

    // Validate items
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "No items provided" }, { status: 400 });
    }

    // Validate email
    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    // Calculate subtotal
    const subtotal = items.reduce(
      (sum: number, item: CheckoutItem) => sum + item.price * item.quantity,
      0
    );

    // Create line items for Stripe
    const lineItems = items.map((item: CheckoutItem) => ({
      price_data: {
        currency: "chf",
        product_data: {
          name: item.name,
          description: item.description,
        },
        unit_amount: formatAmountForStripe(item.price),
      },
      quantity: item.quantity,
    }));

    // Determine shipping options based on subtotal
    const shippingOptions =
      subtotal >= 50
        ? [
            {
              shipping_rate_data: {
                type: "fixed_amount" as const,
                fixed_amount: {
                  amount: 0,
                  currency: "chf",
                },
                display_name: "Free Shipping",
                delivery_estimate: {
                  minimum: {
                    unit: "business_day" as const,
                    value: 3,
                  },
                  maximum: {
                    unit: "business_day" as const,
                    value: 5,
                  },
                },
              },
            },
          ]
        : [
            {
              shipping_rate_data: {
                type: "fixed_amount" as const,
                fixed_amount: {
                  amount: 450, // CHF 4.50 in cents
                  currency: "chf",
                },
                display_name: "Standard Shipping",
                delivery_estimate: {
                  minimum: {
                    unit: "business_day" as const,
                    value: 3,
                  },
                  maximum: {
                    unit: "business_day" as const,
                    value: 5,
                  },
                },
              },
            },
          ];

    // Get origin for redirect URLs
    const origin = req.headers.get("origin");
    if (!origin) {
      return NextResponse.json(
        { error: "Origin header is required" },
        { status: 400 }
      );
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart`,
      shipping_address_collection: {
        allowed_countries: ["CH", "DE", "AT", "FR", "IT"],
      },
      shipping_options: shippingOptions,
      customer_email: email,
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Internal server error";

    console.error("Checkout error:", error);

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
