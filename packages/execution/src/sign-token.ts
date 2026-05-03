import {
  canonicalizeForSigning
} from "./canonical-signing";

import type {
  ExecutionToken,
} from "./execution-token";

import type {
  Signer,
} from "./signer-interface";

/**
 * Signs the canonical form of `token` with `signer` and returns a
 * base64-encoded Ed25519 signature.  Pass the returned string as
 * `token_signature` in the {@link ExecutionContext}.
 */
export function signExecutionToken(
  token: ExecutionToken,
  signer: Signer
): string {

  return signer.sign(
    canonicalizeForSigning(token)
  );
}




