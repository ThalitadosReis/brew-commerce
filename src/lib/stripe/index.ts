import { loadStripe } from "@stripe/stripe-js";
import Stripe from "stripe";

// ----------------------------- client helpers -----------------------------

export const getStripe = () => {
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

  if (!publishableKey) {
    console.error("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not defined");
    throw new Error(
      "Stripe publishable key is missing. Please check your environment variables."
    );
  }

  if (publishableKey === "pk_test_your_publishable_key_here") {
    throw new Error(
      "Please replace the placeholder Stripe publishable key with your actual key from the Stripe Dashboard."
    );
  }

  return loadStripe(publishableKey);
};

// ----------------------------- server helpers -----------------------------

let stripeClient: Stripe | null = null;

export const getServerStripe = (): Stripe => {
  if (stripeClient) {
    return stripeClient;
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY is not defined in environment variables");
  }

  if (secretKey === "sk_test_your_secret_key_here") {
    throw new Error(
      "Please replace the placeholder Stripe secret key with your actual key from the Stripe Dashboard."
    );
  }

  stripeClient = new Stripe(secretKey, {
    apiVersion: "2025-08-27.basil",
    typescript: true,
  });

  return stripeClient;
};

export const stripe = (() => {
  if (typeof window === "undefined") {
    return getServerStripe();
  }

  return new Proxy({} as Stripe, {
    get() {
      throw new Error(
        "Stripe server instance cannot be used on the client side. Use getStripe() instead."
      );
    },
  });
})();

// ----------------------------- utilities ---------------------------------

export const formatAmountForStripe = (amount: number): number =>
  Math.round(amount * 100);
