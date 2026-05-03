import {
  canonicalizeForSigning
} from "./canonical-signing";

import type {
  RuntimeManifest,
} from "./runtime-manifest";

import type {
  Verifier,
} from "./verifier-interface";

/**
 * Verifies that `signature` (base64 Ed25519) was produced over the canonical
 * form of `manifest` by the authority whose key `verifier` holds.
 */
export function verifyRuntimeManifest(
  manifest: RuntimeManifest,
  signature: string,
  verifier: Verifier
): boolean {

  return verifier.verify(
    canonicalizeForSigning(manifest),
    signature
  );
}




