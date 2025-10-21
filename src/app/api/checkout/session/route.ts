import { NextRequest, NextResponse } from "next/server";
import { getServerStripe } from "@/lib/stripe";

const stripe = getServerStripe();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    // retrieve the Stripe session
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    return NextResponse.json(session);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Internal server error";

    console.error("Stripe session retrieval error:", error);

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
