import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";

export async function GET(request: NextRequest) {
  try {
    // Get token from cookie
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "No authentication token found" },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = verifyToken(token);

    if (!decoded || decoded.role !== "admin") {
      return NextResponse.json(
        { error: "Invalid token or insufficient permissions" },
        { status: 403 }
      );
    }

    // Return user data
    return NextResponse.json(
      {
        success: true,
        user: {
          id: decoded.userId,
          email: decoded.email,
          role: decoded.role,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Admin verify error:", error);
    return NextResponse.json(
      { error: "Token verification failed" },
      { status: 401 }
    );
  }
}
