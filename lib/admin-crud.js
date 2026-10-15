import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { getAdminSession } from "./admin-auth";
import clientPromise from "./mongodb";

export async function getDb() {
  const client = await clientPromise;
  return client.db(process.env.MONGODB_DB || "tourist");
}

/** True when MongoDB couldn't be reached at all (DNS, network, or Atlas IP access list). */
export function isDbConnectionError(error) {
  return (
    error?.name === "MongoServerSelectionError" ||
    error?.name === "MongoNetworkError" ||
    /SSL alert|tlsv1 alert|ENOTFOUND|ECONNREFUSED|ETIMEDOUT|querySrv/i.test(error?.message || "")
  );
}

export const DB_CONNECTION_MESSAGE =
  "Can't connect to the database. In MongoDB Atlas, open Network Access and allow this server's IP address (for Vercel, 0.0.0.0/0).";

export function errorResponse(error, fallback) {
  let message = error?.message || fallback;
  if (isDbConnectionError(error)) {
    message = DB_CONNECTION_MESSAGE;
  } else if (error?.code === 121) {
    message = "The database rejected this change. Run `npm run db:setup` to update the collection rules.";
  } else if (error?.codeName === "AuthenticationFailed" || error?.codeName === "AtlasError") {
    message = "MongoDB authentication failed. Check MONGODB_URI username and password.";
  }
  return NextResponse.json({ message }, { status: 500 });
}

/**
 * Checks the session cookie against the roles allowed for a route.
 * Returns `{ session }` when allowed, otherwise `{ denied }` holding the error response.
 */
export async function requireAdmin(request, roles = ["super"]) {
  const session = await getAdminSession(request);
  if (!session) {
    return { denied: NextResponse.json({ message: "Admin login required." }, { status: 401 }) };
  }
  if (!roles.includes(session.r)) {
    return {
      denied: NextResponse.json({ message: "You don't have access to this section." }, { status: 403 }),
    };
  }

  // A police admin disabled or removed by the super admin loses access straight away,
  // not only when their session cookie expires.
  if (session.r === "police") {
    let user;
    try {
      const db = await getDb();
      user = await db
        .collection("admin_users")
        .findOne({ username: session.u, active: true }, { projection: { _id: 1 } });
    } catch (error) {
      return { denied: errorResponse(error, "Could not check your account.") };
    }
    if (!user) {
      return {
        denied: NextResponse.json({ message: "This account has been disabled." }, { status: 401 }),
      };
    }
  }

  return { session };
}

export function toJson(document) {
  const result = { id: document._id.toString() };
  Object.entries(document).forEach(([key, value]) => {
    if (key === "_id") {
      return;
    }
    if (value instanceof Date) {
      result[key] = value.toISOString();
    } else if (Array.isArray(value)) {
      result[key] = value.map((item) =>
        item && typeof item === "object" && !(item instanceof Date)
          ? Object.fromEntries(
              Object.entries(item).map(([k, v]) => [k, v instanceof Date ? v.toISOString() : v]),
            )
          : item,
      );
    } else {
      result[key] = value;
    }
  });
  return result;
}

/**
 * Cleans a request body against a schema.
 * Field spec: { type: "string" | "enum" | "date" | "bool", required?, max?, values?, default? }
 * With `partial`, only fields present in the body are validated and returned.
 */
export function sanitize(body, schema, { partial = false } = {}) {
  const data = {};
  const errors = [];

  Object.entries(schema).forEach(([field, spec]) => {
    const present = Object.prototype.hasOwnProperty.call(body, field);
    if (partial && !present) {
      return;
    }

    let value = present ? body[field] : spec.default;

    if (spec.type === "string") {
      value = typeof value === "string" ? value.trim().slice(0, spec.max || 300) : "";
      if (spec.required && !value) errors.push(`${field} is required`);
    } else if (spec.type === "enum") {
      if (!spec.values.includes(value)) {
        errors.push(`${field} must be one of: ${spec.values.join(", ")}`);
      }
    } else if (spec.type === "date") {
      if (value === "" || value === null || value === undefined) {
        value = null;
        if (spec.required) errors.push(`${field} is required`);
      } else {
        value = new Date(value);
        if (Number.isNaN(value.getTime())) errors.push(`${field} is not a valid date`);
      }
    } else if (spec.type === "bool") {
      value = Boolean(value);
    }

    data[field] = value;
  });

  return { data, errors };
}

export function parseId(value) {
  return typeof value === "string" && ObjectId.isValid(value) ? new ObjectId(value) : null;
}

/**
 * Builds GET/POST/PATCH/DELETE handlers for one admin-managed collection.
 * `patchExtras(body)` may return extra update operators (e.g. $push) for PATCH.
 * `roles` lists who may use the collection; with `audit`, records keep createdBy/updatedBy.
 */
export function createCrudHandlers({
  collection,
  key,
  schema,
  sort = { createdAt: -1 },
  patchExtras,
  roles = ["super"],
  audit = false,
}) {
  async function GET(request) {
    const { denied } = await requireAdmin(request, roles);
    if (denied) return denied;

    try {
      const db = await getDb();
      const items = await db.collection(collection).find({}).sort(sort).limit(1000).toArray();
      return NextResponse.json({ [key]: items.map(toJson) });
    } catch (error) {
      return errorResponse(error, `Could not load ${key}.`);
    }
  }

  async function POST(request) {
    const { denied, session } = await requireAdmin(request, roles);
    if (denied) return denied;

    try {
      const body = await request.json();
      const { data, errors } = sanitize(body, schema);
      if (errors.length) {
        return NextResponse.json({ message: errors.join("; ") }, { status: 400 });
      }

      const now = new Date();
      const stamp = audit ? { createdBy: session.n, updatedBy: session.n } : {};
      const document = { ...data, ...stamp, createdAt: now, updatedAt: now };
      const db = await getDb();
      const result = await db.collection(collection).insertOne(document);
      return NextResponse.json({ item: toJson({ _id: result.insertedId, ...document }) }, { status: 201 });
    } catch (error) {
      return errorResponse(error, "Could not save.");
    }
  }

  async function PATCH(request) {
    const { denied, session } = await requireAdmin(request, roles);
    if (denied) return denied;

    try {
      const body = await request.json();
      const id = parseId(body.id);
      if (!id) {
        return NextResponse.json({ message: "Invalid id" }, { status: 400 });
      }

      const { data, errors } = sanitize(body, schema, { partial: true });
      if (errors.length) {
        return NextResponse.json({ message: errors.join("; ") }, { status: 400 });
      }

      const stamp = audit ? { updatedBy: session.n } : {};
      const update = {
        $set: { ...data, ...stamp, updatedAt: new Date() },
        ...(patchExtras?.(body) || {}),
      };
      const db = await getDb();
      const updated = await db
        .collection(collection)
        .findOneAndUpdate({ _id: id }, update, { returnDocument: "after" });

      if (!updated) {
        return NextResponse.json({ message: "Not found" }, { status: 404 });
      }
      return NextResponse.json({ item: toJson(updated) });
    } catch (error) {
      return errorResponse(error, "Could not update.");
    }
  }

  async function DELETE(request) {
    const { denied } = await requireAdmin(request, roles);
    if (denied) return denied;

    try {
      const id = parseId(new URL(request.url).searchParams.get("id"));
      if (!id) {
        return NextResponse.json({ message: "Invalid id" }, { status: 400 });
      }

      const db = await getDb();
      const result = await db.collection(collection).deleteOne({ _id: id });
      if (!result.deletedCount) {
        return NextResponse.json({ message: "Not found" }, { status: 404 });
      }
      return NextResponse.json({ message: "Deleted" });
    } catch (error) {
      return errorResponse(error, "Could not delete.");
    }
  }

  return { GET, POST, PATCH, DELETE };
}
