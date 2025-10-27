import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/mongodb";
import Cart, { ICart } from "@/models/Cart";

// ensure this route is always dynamic (no static caching).
export const dynamic = "force-dynamic";

const noStoreHeaders = { "Cache-Control": "no-store" } as const;

// ------------------------------- utilities -------------------------------
function normalizeSizes(sizes?: readonly string[]) {
  return (sizes ?? []).slice().sort((a, b) => a.localeCompare(b));
}

type SizeEntry = { size: string; stock: number; price?: number };

type IncomingCartItem = {
  id?: string | number;
  _id?: string | number;
  productId?: string | number;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  selectedSizes?: string[];
  images?: string[];
  category?: string;
  country?: string;
  sizes?: SizeEntry[];
};

type PersistedCartItem = {
  productId: string | number;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  selectedSizes: string[];
  images: string[];
  category: string;
  country: string;
  sizes: SizeEntry[];
};

function isValidIncomingCartItem(value: unknown): value is IncomingCartItem {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.name === "string" &&
    typeof v.price === "number" &&
    !Number.isNaN(v.price) &&
    typeof v.quantity === "number" &&
    Number.isFinite(v.quantity)
  );
}

function toPersistedItem(incoming: IncomingCartItem): PersistedCartItem {
  const productId = incoming.id ?? incoming._id ?? incoming.productId ?? "";
  return {
    productId,
    name: incoming.name,
    description: incoming.description ?? "",
    price: incoming.price,
    quantity: incoming.quantity,
    selectedSizes: normalizeSizes(incoming.selectedSizes ?? []),
    images: Array.isArray(incoming.images) ? incoming.images : [],
    category: incoming.category ?? "",
    country: incoming.country ?? "",
    sizes: Array.isArray(incoming.sizes) ? incoming.sizes : [],
  };
}

// ---------------------------------- GET ----------------------------------
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const databaseCart = await Cart.findOne({ userId }).lean<ICart>();
    const items = (databaseCart?.items ?? []).map((item) => ({
      productId: item.productId,
      name: item.name,
      description: item.description,
      price: item.price,
      quantity: item.quantity,
      selectedSizes: normalizeSizes(item.selectedSizes ?? []),
      images: item.images ?? [],
      category: item.category ?? "",
      country: item.country ?? "",
      sizes: item.sizes ?? [],
    }));

    return NextResponse.json({ items }, { headers: noStoreHeaders });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json(
      { error: "Failed to fetch cart" },
      { status: 500 }
    );
  }
}

// ---------------------------------- POST ---------------------------------
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as { items?: unknown };
    if (!Array.isArray(body.items)) {
      return NextResponse.json(
        { error: "Items must be an array" },
        { status: 400 }
      );
    }

    const validatedItems: PersistedCartItem[] = [];
    for (const raw of body.items) {
      if (!isValidIncomingCartItem(raw)) {
        return NextResponse.json(
          { error: "Invalid cart item shape" },
          { status: 400 }
        );
      }

      const item = toPersistedItem(raw);
      if (
        item.productId === "" ||
        item.productId === null ||
        item.productId === undefined
      ) {
        return NextResponse.json(
          { error: "Cart item is missing productId" },
          { status: 400 }
        );
      }
      if (item.quantity <= 0) continue;
      if (!Number.isFinite(item.price) || item.price < 0) {
        return NextResponse.json({ error: "Invalid price" }, { status: 400 });
      }

      validatedItems.push(item);
    }

    await connectDB();

    const updatedCart = await Cart.findOneAndUpdate(
      { userId },
      { userId, items: validatedItems },
      { upsert: true, new: true }
    ).lean<ICart | null>();

    if (!updatedCart) {
      return NextResponse.json(
        {
          message: "Cart saved, but unable to retrieve updated data",
          items: validatedItems,
        },
        { headers: noStoreHeaders }
      );
    }

    return NextResponse.json(
      { message: "Cart saved successfully", items: updatedCart.items },
      { headers: noStoreHeaders }
    );
  } catch (error) {
    console.error("Error saving cart:", error);
    return NextResponse.json({ error: "Failed to save cart" }, { status: 500 });
  }
}

// --------------------------------- DELETE --------------------------------
export async function DELETE() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const clearedCart = await Cart.findOneAndUpdate(
      { userId },
      { items: [] },
      { new: true, upsert: true }
    ).lean<ICart | null>();

    return NextResponse.json(
      {
        message: "Cart cleared successfully",
        items: clearedCart?.items ?? [],
      },
      { headers: noStoreHeaders }
    );
  } catch (error) {
    console.error("Error clearing cart:", error);
    return NextResponse.json(
      { error: "Failed to clear cart" },
      { status: 500 }
    );
  }
}
