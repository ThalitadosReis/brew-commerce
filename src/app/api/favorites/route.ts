import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import connectDB from "@/lib/mongodb";
import Favorites, {
  type IFavorites,
  type IFavoriteItem,
} from "@/models/Favorites";
import Product, { type IProduct } from "@/models/Product";

// fetch user's favorites
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    let favorites: IFavorites | null = await Favorites.findOne({ userId });
    if (!favorites) {
      favorites = await Favorites.create({ userId, items: [] });
    }

    if (!favorites || !favorites.items) {
      return NextResponse.json({ items: [] });
    }

    const productIds = favorites.items.map(
      (item: IFavoriteItem) => item.productId
    );
    const products = await Product.find({ _id: { $in: productIds } }).lean<
      IProduct[]
    >();

    const favoriteItems = favorites.items
      .map((item: IFavoriteItem) => {
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

    return NextResponse.json({ items: favoriteItems });
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return NextResponse.json(
      { error: "Failed to fetch favorites" },
      { status: 500 }
    );
  }
}

// add product to favorites
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

    const product = await Product.findById(productId).lean<IProduct>();
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    let favorites: IFavorites | null = await Favorites.findOne({ userId });

    if (!favorites) {
      favorites = await Favorites.create({
        userId,
        items: [{ productId, addedAt: new Date() }],
      });
    } else {
      const existingItem = favorites.items.find(
        (item: IFavoriteItem) => item.productId === productId
      );

      if (existingItem) {
        return NextResponse.json(
          { message: "Product already in favorites" },
          { status: 200 }
        );
      }

      favorites.items.push({ productId, addedAt: new Date() });
      await favorites.save();
    }

    return NextResponse.json(
      { message: "Product added to favorites" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding to favorites:", error);
    return NextResponse.json(
      { error: "Failed to add to favorites" },
      { status: 500 }
    );
  }
}

// delete item from favorites
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

    const favorites: IFavorites | null = await Favorites.findOne({ userId });
    if (!favorites) {
      return NextResponse.json(
        { error: "Favorites not found" },
        { status: 404 }
      );
    }

    const initialLength = favorites.items.length;
    favorites.items = favorites.items.filter(
      (item: IFavoriteItem) => item.productId !== productId
    );

    if (favorites.items.length === initialLength) {
      return NextResponse.json(
        { message: "Product not found in favorites" },
        { status: 404 }
      );
    }

    await favorites.save();

    return NextResponse.json(
      { message: "Product removed from favorites" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error removing from favorites:", error);
    return NextResponse.json(
      { error: "Failed to remove from favorites" },
      { status: 500 }
    );
  }
}
