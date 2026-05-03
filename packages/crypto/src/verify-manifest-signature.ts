import crypto from "crypto";

import {
  loadPublicKey,
} from "./keys";

/**
 * Verifies `signature` (base64 Ed25519) over the already-serialized canonical
 * `manifest` string against the dev public key.
 *
 * Unlike `verifySignature`, this function accepts the manifest bytes directly
 * rather than reading them from disk — suited for in-memory verification flows.
 *
 * @param manifest  - Canonical manifest bytes (UTF-8 string).
 * @param signature - Base64-encoded Ed25519 signature.
 */
export function verifyManifestSignature(
  manifest: string,
  signature: string
): boolean {

  const publicKey =
    loadPublicKey();

  return crypto.verify(
    null,

    Buffer.from(
      manifest
    ),

    publicKey,

    Buffer.from(
      signature,
      "base64"
    )
  );
}




