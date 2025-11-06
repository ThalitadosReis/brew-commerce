import { NextResponse } from "next/server";
import { withAdmin, AuthenticatedRequest } from "@/middleware/auth";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

const DEFAULT_IMAGE_PRIMARY =
  "https://res.cloudinary.com/douen1dwv/image/upload/v1760905463/default/mockup-coffee_p93gic.png";
const DEFAULT_IMAGE_SECONDARY =
  "https://res.cloudinary.com/douen1dwv/image/upload/v1760956234/default/mockup-coffee2_pswggc.jpg";

// get all products
async function getProducts() {
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

    if (!name || !description || !category || !country) {
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

    const normalizedImages = [image || DEFAULT_IMAGE_PRIMARY];

    if (Array.isArray(images) && images.length > 0) {
      normalizedImages.push(
        ...images.filter((img: string) => typeof img === "string" && img.trim())
      );
    }

    if (normalizedImages.length === 1) {
      normalizedImages.push(DEFAULT_IMAGE_SECONDARY);
    }

    const product = await Product.create({
      name,
      description,
      price: price || 0,
      images: normalizedImages,
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
