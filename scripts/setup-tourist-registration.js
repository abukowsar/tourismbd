const fs = require("node:fs");
const path = require("node:path");
const { MongoClient } = require("mongodb");

function getMongoUri() {
  const uri = process.env.MONGODB_URI;
  const directHosts = process.env.MONGODB_DIRECT_HOSTS;

  if (!uri) {
    throw new Error("Please add MONGODB_URI to .env.local");
  }

  if (!uri.startsWith("mongodb+srv://") || !directHosts) {
    return uri;
  }

  const parsedUri = new URL(uri);
  const query = new URLSearchParams(parsedUri.search);

  query.set("tls", "true");
  query.set("authSource", query.get("authSource") || "admin");

  const auth = parsedUri.username
    ? `${parsedUri.username}:${parsedUri.password}@`
    : "";
  const uriPath = parsedUri.pathname || "/";

  return `mongodb://${auth}${directHosts}${uriPath}?${query.toString()}`;
}

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return;
  }

  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    let value = trimmed.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    // Variables already set in the environment win, as with dotenv.
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

async function main() {
  loadEnvFile(path.join(process.cwd(), ".env.local"));

  const uri = getMongoUri();
  const dbName = process.env.MONGODB_DB || "tourist";

  if (!uri || uri.includes("<username>") || uri.includes("<cluster-url>")) {
    throw new Error(
      "MONGODB_URI is missing or still contains placeholder values in .env.local.",
    );
  }

  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 10000,
  });

  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });

    const db = client.db(dbName);
    const collectionName = "tourist_registrations";
    const existing = await db
      .listCollections({ name: collectionName }, { nameOnly: true })
      .toArray();

    // Keep status values in sync with lib/admin-constants.js.
    const validator = {
      $jsonSchema: {
        bsonType: "object",
        required: [
          "fullName",
          "passportCountry",
          "arrivalCity",
          "arrivalDate",
          "hotel",
          "emergencyContact",
          "plannedRoute",
          "createdAt",
        ],
        properties: {
          fullName: { bsonType: "string", minLength: 2 },
          passportCountry: { bsonType: "string", minLength: 2 },
          arrivalCity: { enum: ["Dhaka", "Chattogram", "Sylhet", "Cox's Bazar"] },
          arrivalDate: { bsonType: "date" },
          hotel: { bsonType: "string", minLength: 2 },
          emergencyContact: { bsonType: "string", minLength: 5 },
          plannedRoute: { bsonType: "string", minLength: 5 },
          status: {
            enum: ["new", "contacted", "active", "guide assigned", "completed", "cancelled"],
          },
          guideName: { bsonType: "string" },
          notes: { bsonType: "array" },
          createdAt: { bsonType: "date" },
          updatedAt: { bsonType: "date" },
        },
      },
    };

    if (existing.length === 0) {
      await db.createCollection(collectionName, { validator, validationLevel: "moderate" });
    } else {
      await db.command({ collMod: collectionName, validator, validationLevel: "moderate" });
    }

    const registrations = db.collection(collectionName);

    await registrations.createIndexes([
      { key: { createdAt: -1 }, name: "createdAt_desc" },
      { key: { arrivalDate: 1 }, name: "arrivalDate_asc" },
      { key: { passportCountry: 1 }, name: "passportCountry_asc" },
      { key: { arrivalCity: 1 }, name: "arrivalCity_asc" },
    ]);

    await db.collection("tour_guides").createIndexes([
      { key: { name: 1 }, name: "name_asc" },
      { key: { status: 1 }, name: "status_asc" },
    ]);
    await db.collection("support_requests").createIndexes([
      { key: { createdAt: -1 }, name: "createdAt_desc" },
      { key: { state: 1, priority: 1 }, name: "state_priority" },
    ]);
    await db.collection("travel_alerts").createIndexes([
      { key: { active: 1, createdAt: -1 }, name: "active_createdAt" },
    ]);
    await db.collection("police_operations").createIndexes([
      { key: { startAt: -1 }, name: "startAt_desc" },
      { key: { status: 1 }, name: "status_asc" },
    ]);
    await db.collection("criminal_records").createIndexes([
      { key: { createdAt: -1 }, name: "createdAt_desc" },
      { key: { status: 1, threatLevel: 1 }, name: "status_threatLevel" },
      { key: { caseNo: 1 }, name: "caseNo_asc" },
    ]);
    await db.collection("tourist_spot_reports").createIndexes([
      { key: { createdAt: -1 }, name: "createdAt_desc" },
      { key: { spotName: 1 }, name: "spotName_asc" },
    ]);
    await db.collection("admin_users").createIndexes([
      { key: { username: 1 }, name: "username_unique", unique: true },
    ]);

    console.log(`MongoDB connection OK`);
    console.log(`Database: ${dbName}`);
    console.log(`Collections ready: ${collectionName}, tour_guides, support_requests, travel_alerts, police_operations, criminal_records, tourist_spot_reports, admin_users`);
  } finally {
    await client.close();
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
