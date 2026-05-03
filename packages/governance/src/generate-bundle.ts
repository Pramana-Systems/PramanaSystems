import path from "path";

import {
  generateManifest,
  writeManifest,
} from "@pramanasystems/bundle";

import {
  signManifest,
  writeSignature,
} from "@pramanasystems/crypto";

import type {
  BundleGenerationResult,
} from "./types";

/**
 * Generates a signed bundle for `policyId`/`policyVersion` in `policyDirectory`:
 * 1. Hashes all artifacts and writes `bundle.manifest.json`.
 * 2. Signs the manifest and writes `bundle.sig`.
 *
 * The signing key is loaded via `loadPrivateKey()` (dev-keys or env injection).
 *
 * @param policyId        - Policy identifier embedded in the manifest.
 * @param policyVersion   - Policy version string (e.g. `"v1"`).
 * @param policyDirectory - Path to the directory containing the policy artifacts.
 * @returns Paths to the written files and the deterministic bundle hash.
 */
export function generateBundle(
  policyId: string,
  policyVersion: string,
  policyDirectory: string
): BundleGenerationResult {

  const directory =
    path.resolve(
      policyDirectory
    );

  const manifest =
    generateManifest(
      policyId,
      policyVersion,
      directory
    );

  writeManifest(
    manifest,
    directory
  );

  const manifestPath =
    path.join(
      directory,
      "bundle.manifest.json"
    );

  const signature =
    signManifest(
      manifestPath
    );

  writeSignature(
    signature,
    directory
  );

  return {
    success: true,

    manifest_path:
      manifestPath,

    signature_path:
      path.join(
        directory,
        "bundle.sig"
      ),

    bundle_hash:
      manifest.bundle_hash,
  };
}




