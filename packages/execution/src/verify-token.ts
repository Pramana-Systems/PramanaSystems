import {
  canonicalizeForSigning
} from "./canonical-signing";

import type {
  ExecutionToken,
} from "./execution-token";

import type {
  Verifier,
} from "./verifier-interface";

/**
 * Verifies that `signature` (base64 Ed25519) was produced over the canonical
 * form of `token` by the authority whose key `verifier` holds.
 *
 * Called internally by {@link executeDecision} as the first gate before any
 * execution side-effects occur.
 */
export function verifyExecutionToken(
  token: ExecutionToken,
  signature: string,
  verifier: Verifier
): boolean {

  return verifier.verify(
    canonicalizeForSigning(token),
    signature
  );
}




