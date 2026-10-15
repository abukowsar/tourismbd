import { MongoClient } from "mongodb";
import { getMongoUri } from "./mongo-uri";

const uri = getMongoUri();

// One shared connection per server process (kept on `global` so dev hot reloads reuse it).
// A failed connect is forgotten, so the next request retries instead of failing until restart.
function connect() {
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = new MongoClient(uri, { serverSelectionTimeoutMS: 10000 })
      .connect()
      .catch((error) => {
        global._mongoClientPromise = null;
        throw error;
      });
  }
  return global._mongoClientPromise;
}

// Awaitable like the client promise it replaces: `await clientPromise` connects (or retries).
const clientPromise = {
  then: (resolve, reject) => connect().then(resolve, reject),
};

export default clientPromise;
