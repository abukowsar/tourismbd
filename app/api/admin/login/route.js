import { NextResponse } from "next/server";
import {
  adminCookieOptions,
  checkAdminCredentials,
  createAdminToken,
  getAdminSession,
  verifyPassword,
} from "../../../../lib/admin-auth";
import { ADMIN_COOKIE } from "../../../../lib/admin-constants";
import { DB_CONNECTION_MESSAGE, getDb, isDbConnectionError } from "../../../../lib/admin-crud";

export async function GET(request) {
  const session = await getAdminSession(request);
  return session
    ? NextResponse.json({ username: session.u, role: session.r, name: session.n })
    : NextResponse.json({ message: "Not signed in" }, { status: 401 });
}

/** Looks up an active police admin in the database; returns null when the login doesn't match. */
async function findPoliceAdmin(username, password) {
  const db = await getDb();
  const user = await db
    .collection("admin_users")
    .findOne({ username: username.toLowerCase(), active: true });

  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return null;
  }

  await db.collection("admin_users").updateOne({ _id: user._id }, { $set: { lastLoginAt: new Date() } });
  return { username: user.username, role: "police", name: user.name || user.username };
}

export async function POST(request) {
  try {
    const body = await request.json();
    const username = typeof body.username === "string" ? body.username.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";

    let account = null;
    if (username && password) {
      account = (await checkAdminCredentials(username, password))
        ? { username, role: "super", name: username }
        : await findPoliceAdmin(username, password);
    }

    if (!account) {
      return NextResponse.json({ message: "Incorrect username or password." }, { status: 401 });
    }

    const response = NextResponse.json(account);
    response.cookies.set(
      ADMIN_COOKIE,
      await createAdminToken(account.username, account.role, account.name),
      adminCookieOptions(),
    );
    return response;
  } catch (error) {
    // Only police admin logins reach the database; the super admin can still sign in.
    if (isDbConnectionError(error)) {
      return NextResponse.json(
        { message: `Police admin sign-in is unavailable. ${DB_CONNECTION_MESSAGE}` },
        { status: 503 },
      );
    }
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
