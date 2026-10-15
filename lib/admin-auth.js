// Signed admin session tokens. Uses Web Crypto so it works in both the proxy and route handlers.
import { ADMIN_COOKIE } from "./admin-constants";

export const ADMIN_SESSION_SECONDS = 60 * 60 * 8;

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function toBase64Url(bytes) {
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(base64 + "=".repeat((4 - (base64.length % 4)) % 4));
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

function safeEqual(a, b) {
  if (a.length !== b.length) {
    return false;
  }
  let diff = 0;
  for (let index = 0; index < a.length; index += 1) {
    diff |= a.charCodeAt(index) ^ b.charCodeAt(index);
  }
  return diff === 0;
}

async function sign(data) {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET is not configured.");
  }

  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(data));
  return toBase64Url(new Uint8Array(signature));
}

async function digest(value) {
  const hash = await crypto.subtle.digest("SHA-256", encoder.encode(String(value)));
  return toBase64Url(new Uint8Array(hash));
}

export async function checkAdminCredentials(username, password) {
  const expectedUser = process.env.ADMIN_USERNAME;
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!expectedUser || !expectedPassword) {
    throw new Error("ADMIN_USERNAME and ADMIN_PASSWORD are not configured.");
  }

  // Compare digests so the comparison time doesn't depend on the input.
  const [userA, userB, passA, passB] = await Promise.all([
    digest(username),
    digest(expectedUser),
    digest(password),
    digest(expectedPassword),
  ]);
  const userOk = safeEqual(userA, userB);
  const passOk = safeEqual(passA, passB);
  return userOk && passOk;
}

const PBKDF2_ITERATIONS = 210000;

async function pbkdf2(password, salt, iterations) {
  const key = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, [
    "deriveBits",
  ]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt, iterations },
    key,
    256,
  );
  return toBase64Url(new Uint8Array(bits));
}

/** Returns "pbkdf2$<iterations>$<salt>$<hash>" for storing in the admin_users collection. */
export async function hashPassword(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hash = await pbkdf2(password, salt, PBKDF2_ITERATIONS);
  return `pbkdf2$${PBKDF2_ITERATIONS}$${toBase64Url(salt)}$${hash}`;
}

export async function verifyPassword(password, stored) {
  const [scheme, iterations, salt, hash] = String(stored || "").split("$");
  if (scheme !== "pbkdf2" || !iterations || !salt || !hash) {
    return false;
  }
  return safeEqual(await pbkdf2(password, fromBase64Url(salt), Number(iterations)), hash);
}

/** `role` is "super" or "police"; `name` is the display name shown in the console. */
export async function createAdminToken(username, role = "super", name = username) {
  const payload = toBase64Url(
    encoder.encode(
      JSON.stringify({
        u: username,
        r: role,
        n: name,
        exp: Math.floor(Date.now() / 1000) + ADMIN_SESSION_SECONDS,
      }),
    ),
  );
  return `${payload}.${await sign(payload)}`;
}

export async function verifyAdminToken(token) {
  if (!token || !token.includes(".")) {
    return null;
  }

  try {
    const [payload, signature] = token.split(".");
    if (!safeEqual(signature, await sign(payload))) {
      return null;
    }

    const data = JSON.parse(decoder.decode(fromBase64Url(payload)));
    if (!data.exp || data.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    // Tokens issued before roles existed all belonged to the super admin.
    return { ...data, r: data.r || "super", n: data.n || data.u };
  } catch {
    return null;
  }
}

export async function getAdminSession(request) {
  return verifyAdminToken(request.cookies.get(ADMIN_COOKIE)?.value);
}

export function adminCookieOptions(maxAge = ADMIN_SESSION_SECONDS) {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  };
}
