import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { verifyTokenEdge } from "@/lib/jwt-edge";

// Public routes (no Clerk authentication required)
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/collection(.*)",
  "/homepage(.*)",
  "/about(.*)",
  "/contact(.*)",
  "/favorites(.*)",
  "/success(.*)",
  "/api/products(.*)",
  "/api/orders(.*)",
  "/api/checkout(.*)",
  "/api/cart(.*)",
  "/admin-login(.*)",
  "/api/admin/login(.*)",
]);

// Admin routes requiring MongoDB-based authentication
const isAdminRoute = createRouteMatcher(["/admin", "/admin/((?!login).*)"]);

// Admin API routes (auth handled in route handlers)
const isAdminApiRoute = createRouteMatcher([
  "/api/admin(.*)",
  "/api/orders(.*)",
  "/api/checkout(.*)",
]);

export default clerkMiddleware(async (auth, request: NextRequest) => {
  // Handle admin routes with MongoDB authentication
  if (isAdminRoute(request)) {
    try {
      const token = request.cookies.get("token")?.value;

      if (!token) {
        return NextResponse.redirect(new URL("/admin-login", request.url));
      }

      const decoded = await verifyTokenEdge(token);

      if (decoded.role !== "admin") {
        return NextResponse.redirect(new URL("/admin-login", request.url));
      }

      // Allow request to proceed
      return NextResponse.next();
    } catch {
      return NextResponse.redirect(new URL("/admin-login", request.url));
    }
  }

  // Admin API routes bypass middleware auth here
  if (isAdminApiRoute(request)) {
    return NextResponse.next();
  }

  // Protect all other non-public routes with Clerk authentication
  if (!isPublicRoute(request) && !isAdminRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Exclude Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
