/**
 * Session utilities — works in both Edge (middleware) and Node.js runtimes
 * using the Web Crypto API available in both environments.
 */

export const SESSION_COOKIE = "nw-session";
export const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function getSecret(): string {
  return (
    process.env.SESSION_SECRET ??
    process.env.API_KEY_PEPPER ??
    "default-secret-please-set-SESSION_SECRET"
  );
}

/**
 * Derive a deterministic session token from the dashboard password + secret.
 * Changing DASHBOARD_PASSWORD invalidates all existing sessions.
 */
export async function computeSessionToken(): Promise<string> {
  const password = process.env.DASHBOARD_PASSWORD ?? "";
  const secret = getSecret();
  const encoder = new TextEncoder();

  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(`netwatch-session:${password}`),
  );

  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Constant-time comparison of two strings (avoids timing attacks). */
export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export function isDashboardPasswordConfigured(): boolean {
  return !!process.env.DASHBOARD_PASSWORD;
}
