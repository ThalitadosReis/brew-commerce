import { NextRequest, NextResponse } from "next/server";
import { verifyToken, JWTPayload } from "@/lib/jwt";

export interface AuthenticatedRequest extends NextRequest {
  user?: JWTPayload;
}

export type RouteHandler = (
  request: AuthenticatedRequest,
  context: { params?: Record<string, string> }
) => Promise<NextResponse> | NextResponse;

export function withAuth(handler: RouteHandler) {
  return async (
    request: NextRequest & Partial<AuthenticatedRequest>,
    context: { params?: Record<string, string> }
  ): Promise<NextResponse> => {
    try {
      const cookieToken = request.cookies.get("token")?.value;
      const bearerToken = request.headers
        .get("Authorization")
        ?.replace("Bearer ", "");
      const token = cookieToken || bearerToken;

      if (!token) {
        return NextResponse.json(
          { error: "Authentication required" },
          { status: 401 }
        );
      }

      // verification
      const decoded = verifyToken(token);
      if (!decoded) {
        return NextResponse.json(
          { error: "Invalid or expired token" },
          { status: 401 }
        );
      }

      // attach user info
      request.user = decoded;

      return handler(request as AuthenticatedRequest, context);
    } catch (error) {
      console.error("[withAuth] Unexpected error:", error);
      return NextResponse.json(
        { error: "Authentication failed" },
        { status: 500 }
      );
    }
  };
}

export function withAdmin(handler: RouteHandler) {
  return withAuth(async (request, context) => {
    if (request.user?.role !== "admin") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }
    return handler(request, context);
  });
}
