import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, computeSessionToken, isDashboardPasswordConfigured, safeEqual } from "@/lib/session";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Always allow: login page, auth API routes, static assets
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon")
  ) {
    return NextResponse.next();
  }

  // If no password is configured, allow everything (dev / unconfigured)
  if (!isDashboardPasswordConfigured()) {
    return NextResponse.next();
  }

  // Check session cookie
  const sessionCookie = request.cookies.get(SESSION_COOKIE)?.value;
  if (sessionCookie) {
    const expected = await computeSessionToken();
    if (safeEqual(sessionCookie, expected)) {
      return NextResponse.next();
    }
  }

  // Not authenticated → redirect to /login, preserving the original URL
  const loginUrl = new URL("/login", request.url);
  if (pathname !== "/") {
    loginUrl.searchParams.set("from", pathname);
  }
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    /*
     * Match all paths except Next.js internals and static files.
     * /api/auth routes are excluded above in the function body.
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
