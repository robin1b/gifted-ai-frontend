import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;

  // 0️⃣ Allow Next.js internals and static files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // 1️⃣ Allow Next.js API routes
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/blog")) {
    return NextResponse.next();
  }

  // 2️⃣ Allow login & register pages (very important!)
  if (pathname === "/login" || pathname === "/register") {
    return NextResponse.next();
  }

  // 3️⃣ Protect dashboard
  if (pathname.startsWith("/dashboard") && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Logged-in users may access dashboard
  if (pathname.startsWith("/dashboard") && token) {
    return NextResponse.next();
  }

  // 4️⃣ Known safe routes
  const known = ["/", "/create"];
  const matchKnown = known.some(
    (r) => pathname === r || pathname.startsWith(`${r}/`)
  );

  if (!matchKnown) {
    // Unknown route
    if (token) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};
