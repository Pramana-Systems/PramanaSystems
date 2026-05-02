import fs from "fs";
import path from "path";

import {
  readManifest,
  verifyManifest,
} from "@pramanasystems/bundle";

import {
  verifySignature,
} from "@pramanasystems/crypto";

export interface BundleVerificationResult {
  valid: boolean;

  manifest_verified: boolean;

  signature_verified: boolean;

  bundle_verified: boolean;
}

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




