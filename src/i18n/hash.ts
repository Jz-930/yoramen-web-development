/**
 * Canonical normalization shared by export and runtime health checks.
 * It preserves meaningful interior whitespace while removing platform-specific
 * newline differences and insignificant outer/trailing whitespace.
 */
export function normalizeSourceText(value: string): string {
  return value
    .normalize("NFC")
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((line) => line.replace(/[\t ]+$/g, ""))
    .join("\n")
    .trim();
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

/** SHA-256 via Web Crypto, available in supported Next.js server runtimes. */
export async function sha256Hex(value: string): Promise<string> {
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) {
    throw new Error("Web Crypto SHA-256 is unavailable in this runtime.");
  }

  const bytes = new TextEncoder().encode(value);
  const digest = await subtle.digest("SHA-256", bytes);
  return bytesToHex(new Uint8Array(digest));
}

export function isSha256Hex(value: unknown): value is string {
  return typeof value === "string" && /^[a-f\d]{64}$/i.test(value);
}

export async function hashSourceText(value: string): Promise<string> {
  return sha256Hex(normalizeSourceText(value));
}
