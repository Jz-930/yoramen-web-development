import { isValidSignature } from "@sanity/webhook";

export async function validPublicationSignature(
  raw: string, signature: string, primarySecret: string, legacySecret?: string,
): Promise<boolean> {
  for (const secret of new Set([primarySecret, legacySecret])) {
    if (!secret || !secret.trim()) continue;
    try {
      if (await isValidSignature(raw, signature, secret)) return true;
    } catch {
      // Malformed signatures must never be accepted or expose a secret in logs.
    }
  }
  return false;
}
