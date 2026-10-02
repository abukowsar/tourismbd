import { NextResponse } from "next/server";
import { getAdminSession } from "./lib/admin-auth";

const publicAdminPaths = ["/admin/login", "/api/admin/login"];

export async function proxy(request) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    if (publicAdminPaths.includes(pathname) || (await getAdminSession(request))) {
      return NextResponse.next();
    }

    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ message: "Admin login required." }, { status: 401 });
    }

    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const isAuthenticated =
    request.cookies.get("tourism_bd_auth")?.value === "true";

  if (!isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/api/admin/:path*"],
};
