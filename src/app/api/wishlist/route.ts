import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/mongodb";
import Wishlist, { IWishlist, IWishlistItem } from "@/models/Wishlist";
import Product, { IProduct } from "@/models/Product";

// fetch user's wishlist
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    let wishlist: IWishlist | null = await Wishlist.findOne({ userId });
    if (!wishlist) {
      wishlist = await Wishlist.create({ userId, items: [] });
    }

    // ensure wishlist exists at this point
    if (!wishlist || !wishlist.items) {
      return NextResponse.json({ items: [] });
    }

    const productIds = wishlist.items.map(
      (item: IWishlistItem) => item.productId
    );
    const products = await Product.find({ _id: { $in: productIds } }).lean<
      IProduct[]
    >();

    // map wishlist items with full product details
    const wishlistItems = wishlist.items
      .map((item: IWishlistItem) => {
        const product = products.find(
          (p) => p._id?.toString() === item.productId
        );
        if (!product || !product._id) return null;

        return {
          _id: product._id.toString(),
          name: product.name,
          description: product.description,
          price: product.price,
          images: product.images || [],
          category: product.category,
          country: product.country,
          stock: product.stock,
          sizes: product.sizes,
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
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId } = await request.json();
    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    await connectDB();

    // verify product exists
    const product = await Product.findById(productId).lean<IProduct>();
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    let wishlist: IWishlist | null = await Wishlist.findOne({ userId });

    if (!wishlist) {
      // create new wishlist with the product
      wishlist = await Wishlist.create({
        userId,
        items: [{ productId, addedAt: new Date() }],
      });
    } else {
      // check if product already in wishlist
      const existingItem = wishlist.items.find(
        (item: IWishlistItem) => item.productId === productId
      );

      if (existingItem) {
        return NextResponse.json(
          { message: "Product already in wishlist" },
          { status: 200 }
        );
      }

      // add product to existing wishlist
      wishlist.items.push({ productId, addedAt: new Date() });
      await wishlist.save();
    }

    return NextResponse.json(
      { message: "Product added to wishlist" },
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
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const productId = new URL(request.url).searchParams.get("productId");
    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const wishlist: IWishlist | null = await Wishlist.findOne({ userId });
    if (!wishlist) {
      return NextResponse.json(
        { error: "Wishlist not found" },
        { status: 404 }
      );
    }

    // remove product from wishlist
    const initialLength = wishlist.items.length;
    wishlist.items = wishlist.items.filter(
      (item: IWishlistItem) => item.productId !== productId
    );

    // check if product was removed
    if (wishlist.items.length === initialLength) {
      return NextResponse.json(
        { message: "Product not found in wishlist" },
        { status: 404 }
      );
    }

    await wishlist.save();

    return NextResponse.json(
      { message: "Product removed from wishlist" },
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
