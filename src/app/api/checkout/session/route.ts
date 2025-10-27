import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getServerStripe } from "@/lib/stripe";
import {
  extractShippingFromSession,
  ensurePaymentIntentShipping,
} from "@/lib/stripe/shipping";

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json(
      { error: "session_id query parameter is required" },
      { status: 400 }
    );
  }

  try {
    const stripe = getServerStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["payment_intent", "payment_intent.shipping", "customer"],
    });

    let paymentIntent =
      typeof session.payment_intent === "object" && session.payment_intent
        ? session.payment_intent
        : null;

    if (!paymentIntent && typeof session.payment_intent === "string") {
      const shipping = await ensurePaymentIntentShipping(
        stripe,
        session.payment_intent
      );
      if (shipping) {
        paymentIntent = {
          id: session.payment_intent,
          object: "payment_intent",
          shipping,
        } as Stripe.PaymentIntent;
      }
    }

    const shippingAddress = extractShippingFromSession(session, paymentIntent);

    const customerEmail =
      session.customer_details?.email ??
      session.customer_email ??
      (typeof session.customer === "object" && session.customer
        ? (
            session.customer as {
              email?: string | null;
            }
          ).email ?? null
        : null);

    return NextResponse.json({
      shippingAddress,
      customerEmail,
    });
  } catch (error) {
    console.error("Failed to retrieve checkout session", error);
    return NextResponse.json(
      { error: "Failed to retrieve checkout session" },
      { status: 500 }
    );
  }
}
