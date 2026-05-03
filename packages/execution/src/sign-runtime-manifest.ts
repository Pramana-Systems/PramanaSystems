import {
  canonicalize,
} from "@pramanasystems/bundle";

import type {
  RuntimeManifest,
} from "./runtime-manifest";

import type {
  Signer,
} from "./signer-interface";

/**
 * Signs the canonical form of `manifest` with `signer` and returns a
 * base64-encoded Ed25519 signature.  Use this to produce a verifiable
 * attestation that a specific runtime version was active at a given time.
 */
export function signRuntimeManifest(
  manifest: RuntimeManifest,
  signer: Signer
): string {

  return signer.sign(
    canonicalize(manifest)
  );
}




