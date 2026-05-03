import {
  canonicalizeForSigning
} from "./canonical-signing";

import type {
  ExecutionResult,
} from "./execution-result";

import type {
  Verifier,
} from "./verifier-interface";

/**
 * Verifies that `signature` (base64 Ed25519) was produced over the canonical
 * form of `result` by the authority whose key `verifier` holds.
 *
 * Used by both {@link verifyAttestation} in `@pramanasystems/verifier` and
 * directly in custom verification workflows.
 */
export function verifyExecutionResult(
  result: ExecutionResult,
  signature: string,
  verifier: Verifier
): boolean {

  return verifier.verify(
    canonicalizeForSigning(result),
    signature
  );
}




