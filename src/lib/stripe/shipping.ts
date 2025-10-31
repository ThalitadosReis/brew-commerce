import Stripe from "stripe";
import type { IShippingAddress } from "@/models/Order";

type MaybeShippingInput =
  | {
      name?: string | null;
      line1?: string | null;
      line2?: string | null;
      city?: string | null;
      state?: string | null;
      postal_code?: string | null;
      country?: string | null;
    }
  | null
  | undefined;

export const compactShippingAddress = (
  input: MaybeShippingInput
): IShippingAddress | null => {
  if (!input) return null;

  const normalized: IShippingAddress = {};
  (Object.entries(input) as [keyof IShippingAddress, unknown][]).forEach(
    ([key, value]) => {
      if (typeof value === "string" && value.trim().length > 0) {
        normalized[key] = value.trim();
      }
    }
  );

  return Object.keys(normalized).length > 0 ? normalized : null;
};

export const extractShippingFromSession = (
  session: Stripe.Checkout.Session,
  paymentIntent?: Stripe.PaymentIntent | null
): IShippingAddress | null => {
  const sessionWithShipping = session as Stripe.Checkout.Session & {
    shipping_details?: Stripe.PaymentIntent.Shipping | null;
  };

  const shippingDetails =
    sessionWithShipping.shipping_details ?? paymentIntent?.shipping ?? null;

  const customerDetails = session.customer_details ?? null;
  const expandedCustomer =
    typeof session.customer === "object" && session.customer !== null
      ? (session.customer as {
          name?: string | null;
          address?: Stripe.Address | null;
        })
      : null;

  const address: Stripe.Address | null =
    shippingDetails?.address ??
    customerDetails?.address ??
    expandedCustomer?.address ??
    null;

  return compactShippingAddress({
    name:
      shippingDetails?.name ??
      customerDetails?.name ??
      expandedCustomer?.name ??
      null,
    line1: address?.line1 ?? null,
    line2: address?.line2 ?? null,
    city: address?.city ?? null,
    state: address?.state ?? null,
    postal_code: address?.postal_code ?? null,
    country: address?.country ?? null,
  });
};

export async function ensurePaymentIntentShipping(
  stripe: Stripe,
  paymentIntentId: string
): Promise<Stripe.PaymentIntent.Shipping | null> {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(
      paymentIntentId,
      {
        expand: ["shipping"],
      }
    );
    return paymentIntent.shipping ?? null;
  } catch (error) {
    console.error("Failed to retrieve payment intent shipping:", error);
    return null;
  }
}
