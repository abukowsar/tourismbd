import { NextResponse } from "next/server";
import {
  adminCookieOptions,
  checkAdminCredentials,
  createAdminToken,
  getAdminSession,
} from "../../../../lib/admin-auth";
import { ADMIN_COOKIE } from "../../../../lib/admin-constants";

export async function GET(request) {
  const session = await getAdminSession(request);
  return session
    ? NextResponse.json({ username: session.u })
    : NextResponse.json({ message: "Not signed in" }, { status: 401 });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const username = typeof body.username === "string" ? body.username.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!username || !password || !(await checkAdminCredentials(username, password))) {
      return NextResponse.json({ message: "Incorrect username or password." }, { status: 401 });
    }

    const response = NextResponse.json({ username });
    response.cookies.set(ADMIN_COOKIE, await createAdminToken(username), adminCookieOptions());
    return response;
  } catch (error) {
    return NextResponse.json(
      { message: error?.message || "Could not sign in." },
      { status: 500 },
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ message: "Signed out" });
  response.cookies.set(ADMIN_COOKIE, "", adminCookieOptions(0));
  return response;
}
