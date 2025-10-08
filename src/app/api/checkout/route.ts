import { NextRequest, NextResponse } from "next/server";
import { getServerStripe, formatAmountForStripe } from "@/lib/stripe";

const stripe = getServerStripe();

export async function POST(req: NextRequest) {
  try {
    const { items } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items provided" }, { status: 400 });
    }

    // calculate subtotal
    const subtotal = items.reduce(
      (sum: number, item: { price: number; quantity: number }) =>
        sum + item.price * item.quantity,
      0
    );

    // create line items for Stripe
    const lineItems = items.map(
      (item: {
        name: string;
        description: string;
        price: number;
        quantity: number;
      }) => ({
        price_data: {
          currency: "chf",
          product_data: {
            name: item.name,
            description: item.description,
          },
          unit_amount: formatAmountForStripe(item.price),
        },
        quantity: item.quantity,
      })
    );

    // determine shipping options based on subtotal
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

    // create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${req.headers.get(
        "origin"
      )}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/cart`,
      shipping_address_collection: {
        allowed_countries: ["CH", "DE", "AT", "FR", "IT"],
      },
      shipping_options: shippingOptions,
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Internal server error";

    console.error("Stripe error:", error);

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
