import { NextResponse } from "next/server";
import { withAdmin, AuthenticatedRequest } from "@/middleware/auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

// Get all users
async function getUsers(request: AuthenticatedRequest) {
  try {
    await connectDB();

    const users = await User.find().select("-password").sort({ createdAt: -1 });

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Get users error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export const GET = withAdmin(getUsers);
