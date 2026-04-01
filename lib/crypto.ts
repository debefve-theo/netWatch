/**
 * API key hashing utilities.
 *
 * We use Node's built-in `crypto` module (PBKDF2) so there are zero
 * extra dependencies. The pepper is loaded from env at call time.
 */
import { pbkdf2Sync, randomBytes, timingSafeEqual } from "crypto";

const ITERATIONS = 100_000;
const KEY_LEN = 64;
const DIGEST = "sha512";

function getPepper(): string {
  const pepper = process.env.API_KEY_PEPPER;
  if (!pepper) throw new Error("API_KEY_PEPPER env variable is not set");
  return pepper;
}

/** Generate a cryptographically random API key. */
export function generateApiKey(): string {
  return `nw_${randomBytes(24).toString("hex")}`;
}

/**
 * Hash an API key for storage.
 * Format stored: `pbkdf2:<salt_hex>:<hash_hex>`
 */
export async function hashApiKey(rawKey: string): Promise<string> {
  const pepper = getPepper();
  const salt = randomBytes(16).toString("hex");
  const peppered = pepper + rawKey;
  const hash = pbkdf2Sync(peppered, salt, ITERATIONS, KEY_LEN, DIGEST).toString("hex");
  return `pbkdf2:${salt}:${hash}`;
}

/**
 * Verify a raw key against a stored hash.
 * Returns true if matching.
 */
export async function verifyApiKey(rawKey: string, storedHash: string): Promise<boolean> {
  const pepper = getPepper();
  const parts = storedHash.split(":");
  if (parts.length !== 3 || parts[0] !== "pbkdf2") return false;
  const [, salt, expectedHash] = parts;
  const peppered = pepper + rawKey;
  const hash = pbkdf2Sync(peppered, salt, ITERATIONS, KEY_LEN, DIGEST).toString("hex");
  if (hash.length !== expectedHash.length) {
    return false;
  }
  return timingSafeEqual(Buffer.from(hash, "utf8"), Buffer.from(expectedHash, "utf8"));
}
