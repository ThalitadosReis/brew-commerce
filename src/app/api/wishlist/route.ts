import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/mongodb";
import Wishlist from "@/models/Wishlist";
import Product from "@/models/Product";

// fetch user's wishlist
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();

    let wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      wishlist = await Wishlist.create({ userId, items: [] });
    }

    const productIds = wishlist.items.map((item) => item.productId);
    const products = await Product.find({ _id: { $in: productIds } }).lean();

    const wishlistItems = wishlist.items
      .map((item) => {
        const product = products.find(
          (p) => p._id.toString() === item.productId
        );
        if (!product) return null;

        return {
          id: product._id.toString(),
          name: product.name,
          price: product.price,
          images: product.images || [],
          country: product.country,
          addedAt: item.addedAt || new Date(),
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);

    return NextResponse.json({ items: wishlistItems });
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return NextResponse.json(
      { error: "Failed to fetch wishlist" },
      { status: 500 }
    );
  }
}

// add product to wishlist
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { productId } = await request.json();
    if (!productId)
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );

    await connectDB();

    const product = await Product.findById(productId).lean();
    if (!product)
      return NextResponse.json({ error: "Product not found" }, { status: 404 });

    let wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      wishlist = await Wishlist.create({
        userId,
        items: [{ productId, addedAt: new Date() }],
      });
    } else {
      if (wishlist.items.some((item) => item.productId === productId)) {
        return NextResponse.json(
          { message: "Product already in wishlist", wishlist },
          { status: 200 }
        );
      }
      wishlist.items.push({ productId, addedAt: new Date() });
      await wishlist.save();
    }

    return NextResponse.json(
      { message: "Product added to wishlist", wishlist },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    return NextResponse.json(
      { error: "Failed to add to wishlist" },
      { status: 500 }
    );
  }
}

// delete item from wishlist
export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const productId = new URL(request.url).searchParams.get("productId");
    if (!productId)
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );

    await connectDB();

    const wishlist = await Wishlist.findOne({ userId });
    if (!wishlist)
      return NextResponse.json(
        { error: "Wishlist not found" },
        { status: 404 }
      );

    wishlist.items = wishlist.items.filter(
      (item) => item.productId !== productId
    );
    await wishlist.save();

    return NextResponse.json(
      { message: "Product removed from wishlist", wishlist },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    return NextResponse.json(
      { error: "Failed to remove from wishlist" },
      { status: 500 }
    );
  }
}
