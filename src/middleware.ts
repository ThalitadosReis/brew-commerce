import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { verifyTokenEdge } from "@/lib/jwt-edge";

// Public routes that don't require Clerk authentication
const isPublicRoute = createRouteMatcher([
  "/",
  "/login(.*)",
  "/signup(.*)",
  "/sign-up(.*)",
  "/collection(.*)",
  "/homepage(.*)",
  "/about(.*)",
  "/contact(.*)",
  "/favorites(.*)",
  "/success(.*)",
  "/api/webhooks(.*)",
  "/api/products(.*)",
  "/admin-login(.*)",
  "/api/admin/login(.*)",
  "/api/admin/verify(.*)",
]);

// Admin routes that require MongoDB-based authentication (excluding login)
const isAdminRoute = createRouteMatcher([
  "/admin",
  "/admin/((?!login).*)", // Match /admin/* but not /admin/login or /admin-login
]);

const isAdminApiRoute = createRouteMatcher([
  "/api/admin(.*)",
  "/api/orders(.*)", // Orders API handles its own auth (GET=admin, POST=public)
  "/api/checkout(.*)", // Stripe checkout is public
]);

export default clerkMiddleware(async (auth, request: NextRequest) => {
  // Handle admin routes with MongoDB authentication
  if (isAdminRoute(request)) {
    try {
      const token = request.cookies.get("token")?.value;
      console.log("[Middleware] Admin route accessed:", request.url);
      console.log("[Middleware] Token found:", !!token);

      if (!token) {
        console.log("[Middleware] No token, redirecting to login");
        return NextResponse.redirect(new URL("/admin-login", request.url));
      }

      const decoded = await verifyTokenEdge(token);
      console.log("[Middleware] Token decoded, role:", decoded.role);

      if (decoded.role !== "admin") {
        console.log("[Middleware] Not admin role, redirecting to login");
        return NextResponse.redirect(new URL("/admin-login", request.url));
      }

      // Allow the request to proceed
      console.log("[Middleware] Admin authenticated, allowing access");
      return NextResponse.next();
    } catch (error) {
      console.log("[Middleware] Error verifying token:", error);
      return NextResponse.redirect(new URL("/admin-login", request.url));
    }
  }

  // Admin API routes are handled by withAuth/withAdmin in the route handlers
  if (isAdminApiRoute(request)) {
    return NextResponse.next();
  }

  // Handle commerce routes with Clerk authentication
  if (!isPublicRoute(request) && !isAdminRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
