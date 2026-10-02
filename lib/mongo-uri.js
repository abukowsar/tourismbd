export function getMongoUri() {
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
  const path = parsedUri.pathname || "/";

  return `mongodb://${auth}${directHosts}${path}?${query.toString()}`;
}
