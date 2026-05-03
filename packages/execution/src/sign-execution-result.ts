import {
  canonicalizeForSigning
} from "./canonical-signing";

import type {
  ExecutionResult,
} from "./execution-result";

import type {
  Signer,
} from "./signer-interface";

/**
 * Signs the canonical form of `result` with `signer` and returns a
 * base64-encoded Ed25519 signature.  The signature is stored in the
 * surrounding {@link ExecutionAttestation} for independent verification.
 */
export function signExecutionResult(
  result: ExecutionResult,
  signer: Signer
): string {

  return signer.sign(
    canonicalizeForSigning(result)
  );
}




