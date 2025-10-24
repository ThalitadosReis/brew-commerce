import { loadStripe } from "@stripe/stripe-js";
import Stripe from "stripe";

// Client-side Stripe
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

// Server-side Stripe - lazy initialization
let _stripe: Stripe | null = null;

export const getServerStripe = (): Stripe => {
  if (_stripe) {
    return _stripe;
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    throw new Error(
      "STRIPE_SECRET_KEY is not defined in environment variables"
    );
  }

  if (secretKey === "sk_test_your_secret_key_here") {
    throw new Error(
      "Please replace the placeholder Stripe secret key with your actual key from the Stripe Dashboard."
    );
  }

  _stripe = new Stripe(secretKey, {
    apiVersion: "2025-08-27.basil",
    typescript: true,
  });

  return _stripe;
};

// Server-side only Stripe instance - only initialize when actually needed
export const stripe = (() => {
  // Only initialize if we're in a server environment
  if (typeof window === "undefined") {
    return getServerStripe();
  }

  // Return a proxy that throws an error if used on client side
  return new Proxy({} as Stripe, {
    get() {
      throw new Error(
        "Stripe server instance cannot be used on the client side. Use getStripe() instead."
      );
    },
  });
})();

// Utility function to format amount for Stripe (cents)
export const formatAmountForStripe = (amount: number): number => {
  return Math.round(amount * 100);
};

// Utility function to format amount for display
export const formatAmountFromStripe = (amount: number): number => {
  return amount / 100;
};
