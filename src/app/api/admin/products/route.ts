import { NextResponse } from "next/server";
import { withAdmin, AuthenticatedRequest } from "@/middleware/auth";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

// get all products
async function getProducts(request: AuthenticatedRequest) {
  try {
    await connectDB();

    const products = await Product.find().sort({ createdAt: -1 });

    return NextResponse.json({ products });
  } catch (error) {
    console.error("Get products error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// create new product
async function createProduct(request: AuthenticatedRequest) {
  try {
    const body = await request.json();
    const {
      name,
      description,
      price,
      image,
      images,
      category,
      country,
      stock,
      sizes,
    } = body;

    if (!name || !description || !image || !category || !country) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!sizes || sizes.length === 0) {
      return NextResponse.json(
        { error: "At least one size option is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const product = await Product.create({
      name,
      description,
      price: price || 0,
      image,
      images: images || [],
      category,
      country,
      stock: stock || 0,
      sizes,
    });

    return NextResponse.json(
      { product, message: "Product created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create product error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export const GET = withAdmin(getProducts);
export const POST = withAdmin(createProduct);
