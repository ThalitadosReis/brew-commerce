import { NextRequest, NextResponse } from "next/server";

import { verifyTokenEdge } from "@/lib/jwt-edge";

function isAdminRoute(pathname: string) {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}

function isAdminApiRoute(pathname: string) {
  return (
    pathname.startsWith("/api/admin") || pathname.startsWith("/api/orders")
  );
}

async function routerMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!isAdminRoute(pathname) || isAdminApiRoute(pathname)) {
    return NextResponse.next();
  }

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

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};

export default routerMiddleware;
