import { NextResponse } from "next/server";
import { hashPassword } from "../../../../lib/admin-auth";
import { errorResponse, getDb, parseId, requireAdmin, sanitize, toJson } from "../../../../lib/admin-crud";

// Police admin accounts, managed by the super admin only.
const COLLECTION = "admin_users";
const USERNAME_PATTERN = /^[a-z0-9._-]{3,40}$/;
const MIN_PASSWORD = 8;

const schema = {
  name: { type: "string", required: true, max: 120 },
  badgeNo: { type: "string", max: 40 },
  station: { type: "string", max: 120 },
  phone: { type: "string", max: 40 },
  active: { type: "bool", default: true },
};

const hidePassword = { projection: { passwordHash: 0 } };

function badRequest(message) {
  return NextResponse.json({ message }, { status: 400 });
}

function checkPassword(password) {
  if (typeof password !== "string" || password.length < MIN_PASSWORD) {
    return `Password must be at least ${MIN_PASSWORD} characters.`;
  }
  return "";
}

export async function GET(request) {
  const { denied } = await requireAdmin(request);
  if (denied) return denied;

  try {
    const db = await getDb();
    const users = await db.collection(COLLECTION).find({}, hidePassword).sort({ name: 1 }).toArray();
    return NextResponse.json({ users: users.map(toJson) });
  } catch (error) {
    return errorResponse(error, "Could not load admin users.");
  }
}

export async function POST(request) {
  const { denied, session } = await requireAdmin(request);
  if (denied) return denied;

  try {
    const body = await request.json();
    const username = typeof body.username === "string" ? body.username.trim().toLowerCase() : "";
    if (!USERNAME_PATTERN.test(username)) {
      return badRequest("Username must be 3–40 characters: letters, numbers, dot, dash or underscore.");
    }
    if (username === String(process.env.ADMIN_USERNAME || "").trim().toLowerCase()) {
      return badRequest("That username is reserved for the super admin.");
    }
    const passwordError = checkPassword(body.password);
    if (passwordError) return badRequest(passwordError);

    const { data, errors } = sanitize(body, schema);
    if (errors.length) return badRequest(errors.join("; "));

    const db = await getDb();
    if (await db.collection(COLLECTION).findOne({ username }, { projection: { _id: 1 } })) {
      return badRequest("That username is already taken.");
    }

    const now = new Date();
    const document = {
      ...data,
      username,
      role: "police",
      passwordHash: await hashPassword(body.password),
      createdBy: session.n,
      createdAt: now,
      updatedAt: now,
    };
    const result = await db.collection(COLLECTION).insertOne(document);
    const { passwordHash, ...visible } = document;
    return NextResponse.json({ item: toJson({ _id: result.insertedId, ...visible }) }, { status: 201 });
  } catch (error) {
    if (error?.code === 11000) return badRequest("That username is already taken.");
    return errorResponse(error, "Could not create the admin.");
  }
}

export async function PATCH(request) {
  const { denied } = await requireAdmin(request);
  if (denied) return denied;

  try {
    const body = await request.json();
    const id = parseId(body.id);
    if (!id) return badRequest("Invalid id");

    const { data, errors } = sanitize(body, schema, { partial: true });
    if (errors.length) return badRequest(errors.join("; "));

    const update = { ...data, updatedAt: new Date() };
    if (body.password) {
      const passwordError = checkPassword(body.password);
      if (passwordError) return badRequest(passwordError);
      update.passwordHash = await hashPassword(body.password);
    }

    const db = await getDb();
    const updated = await db
      .collection(COLLECTION)
      .findOneAndUpdate({ _id: id }, { $set: update }, { returnDocument: "after", ...hidePassword });
    if (!updated) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ item: toJson(updated) });
  } catch (error) {
    return errorResponse(error, "Could not update the admin.");
  }
}

export async function DELETE(request) {
  const { denied } = await requireAdmin(request);
  if (denied) return denied;

  try {
    const id = parseId(new URL(request.url).searchParams.get("id"));
    if (!id) return badRequest("Invalid id");

    const db = await getDb();
    const result = await db.collection(COLLECTION).deleteOne({ _id: id });
    if (!result.deletedCount) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    return errorResponse(error, "Could not delete the admin.");
  }
}
