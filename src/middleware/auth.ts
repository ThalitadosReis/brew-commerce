import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    userId: string;
    email: string;
    role: "user" | "admin";
  };
}

export function withAuth(
  handler: (
    request: AuthenticatedRequest,
    context: any
  ) => Promise<NextResponse>
) {
  return async (request: NextRequest, context: any) => {
    try {
      // Get token from cookie or Authorization header
      const token =
        request.cookies.get("token")?.value ||
        request.headers.get("Authorization")?.replace("Bearer ", "");

      if (!token) {
        return NextResponse.json(
          { error: "Authentication required" },
          { status: 401 }
        );
      }

      // Verify token
      const decoded = verifyToken(token);

      // Attach user info to request
      const authenticatedRequest = request as AuthenticatedRequest;
      authenticatedRequest.user = decoded;

      // Pass both request and context to the actual handler
      return handler(authenticatedRequest, context);
    } catch (error) {
      console.error("Auth error:", error);
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }
  };
}

export function withAdmin(
  handler: (
    request: AuthenticatedRequest,
    context: any
  ) => Promise<NextResponse>
) {
  return withAuth(async (request: AuthenticatedRequest, context: any) => {
    if (request.user?.role !== "admin") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    return handler(request, context);
  });
}
