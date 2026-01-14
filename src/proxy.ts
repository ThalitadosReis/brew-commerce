import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

import { verifyTokenEdge } from "@/lib/jwt-edge";

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
  "/api/contact(.*)",
  "/admin-login(.*)",
  "/api/admin/login(.*)",
]);

const isAdminRoute = createRouteMatcher(["/admin", "/admin/((?!login).*)"]);
const isAdminApiRoute = createRouteMatcher([
  "/api/admin(.*)",
  "/api/orders(.*)",
  "/api/checkout(.*)",
]);

const routerMiddleware = clerkMiddleware(async (auth, request: NextRequest) => {
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

      return NextResponse.next();
    } catch {
      return NextResponse.redirect(new URL("/admin-login", request.url));
    }
  }

  if (isAdminApiRoute(request)) {
    return NextResponse.next();
  }

  if (!isPublicRoute(request) && !isAdminRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};

export default routerMiddleware;
