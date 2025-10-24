import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/mongodb";
import Cart, { ICart } from "@/models/Cart";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const cart = await Cart.findOne({ userId }).lean<ICart>();

    const items = (cart?.items || []).map((i) => ({
      ...i,
      sizes: i.sizes || [],
      selectedSizes: i.selectedSizes || [],
      images: i.images || [],
      category: i.category || "",
      country: i.country || "",
    }));

    return NextResponse.json({ items });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json(
      { error: "Failed to fetch cart" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { items } = await request.json();

    if (!Array.isArray(items)) {
      return NextResponse.json(
        { error: "Items must be an array" },
        { status: 400 }
      );
    }

    const validatedItems = items.map((i) => ({
      productId: i.id || i._id,
      name: i.name,
      description: i.description,
      price: i.price,
      quantity: i.quantity,
      selectedSizes: i.selectedSizes || [],
      images: i.images || [],
      category: i.category || "",
      country: i.country || "",
      sizes: i.sizes || [],
    }));

    await connectDB();

    const cart = await Cart.findOneAndUpdate(
      { userId },
      { userId, items: validatedItems },
      { upsert: true, new: true }
    );

    return NextResponse.json({
      message: "Cart saved successfully",
      items: cart.items,
    });
  } catch (error) {
    console.error("Error saving cart:", error);
    return NextResponse.json({ error: "Failed to save cart" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    await Cart.findOneAndUpdate({ userId }, { items: [] });

    return NextResponse.json({
      message: "Cart cleared successfully",
    });
  } catch (error) {
    console.error("Error clearing cart:", error);
    return NextResponse.json(
      { error: "Failed to clear cart" },
      { status: 500 }
    );
  }
}
