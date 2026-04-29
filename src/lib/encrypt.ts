import { EncryptJWT, jwtDecrypt } from "jose";

// ── Secret key ─────────────────────────────────────────────────────────────────
// jose's EncryptJWT with "dir" + A256GCM expects exactly 32 bytes (256-bit) key
function getSecretKey(): Uint8Array {
  const secret = process.env.COOKIE_SECRET;
  if (!secret) throw new Error("COOKIE_SECRET env is not set.");

  // Pad or slice to exactly 32 bytes — security comes from the randomness of COOKIE_SECRET
  const encoded = new TextEncoder().encode(secret);
  const key = new Uint8Array(32);
  key.set(encoded.slice(0, 32));
  return key;
}

// ── Encrypt ────────────────────────────────────────────────────────────────────
// Wraps the plain string as a JWE (encrypted JWT) using AES-256-GCM
// Output is opaque — cannot be decoded at jwt.io
export async function encryptToken(plain: string): Promise<string> {
  const key = getSecretKey();

  return new EncryptJWT({ payload: plain })
    .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .encrypt(key);
}

// ── Decrypt ────────────────────────────────────────────────────────────────────
export async function decryptToken(encrypted: string): Promise<string> {
  const key = getSecretKey();

  const { payload } = await jwtDecrypt(encrypted, key);

  if (typeof payload.payload !== "string") {
    throw new Error("Invalid session payload.");
  }

  return payload.payload;
}