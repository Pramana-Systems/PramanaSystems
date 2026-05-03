import fs from "fs";
import path from "path";

import {
  readManifest,
  verifyManifest,
} from "@pramanasystems/bundle";

import {
  verifySignature,
} from "@pramanasystems/crypto";

/** Detailed result of a {@link verifyBundle} call. */
export interface BundleVerificationResult {
  /** `true` when both the manifest content hashes and the cryptographic signature are valid. */
  valid: boolean;

  /** `true` when the content hash commitment in the manifest is consistent. */
  manifest_verified: boolean;

  /** `true` when the manifest signature passes cryptographic verification. */
  signature_verified: boolean;

  /** `true` when the on-disk directory content matches the manifest's artifact hashes. */
  bundle_verified: boolean;
}

/**
 * Performs a full, standalone bundle verification:
 * 1. Re-hashes every artifact in the bundle directory and validates the manifest commitment.
 * 2. Verifies the Ed25519 signature in `signaturePath` against the manifest.
 *
 * Both checks must pass for `valid` to be `true`.
 *
 * @param manifestPath  - Path to `bundle.manifest.json`.
 * @param signaturePath - Path to `bundle.sig` (base64 Ed25519 signature file).
 */
export function verifyBundle(
  manifestPath: string,
  signaturePath: string
): BundleVerificationResult {

  const signature =
    fs.readFileSync(
      signaturePath,
      "utf8"
    );

  const directory =
    path.dirname(
      manifestPath
    );

  const parsedManifest =
    readManifest(directory);

  const bundleVerified =
    verifyManifest(
      parsedManifest,
      directory
    ).valid;

  const signatureVerified =
    verifySignature(
      manifestPath,
      signature
    );

  return {
    valid:
      bundleVerified &&
      signatureVerified,

    manifest_verified:
      bundleVerified &&
      signatureVerified,

    signature_verified:
      signatureVerified,

    bundle_verified:
      bundleVerified,
  };
}




