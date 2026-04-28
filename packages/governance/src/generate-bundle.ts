import path from "path";

import {
  generateManifest,
  writeManifest,
} from "@manthan/bundle";

import {
  signManifest,
  writeSignature,
} from "@manthan/crypto";

import type {
  BundleGenerationResult,
} from "./types";

export function generateBundle(
  policyId: string,
  policyVersion: string,
  policyDirectory: string
): BundleGenerationResult {
  const directory =
    path.resolve(policyDirectory);

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

  const signature =
    signManifest(manifest);

  writeSignature(
    signature,
    directory
  );

  return {
    success: true,

    manifest_path:
      path.join(
        directory,
        "bundle.manifest.json"
      ),

    signature_path:
      path.join(
        directory,
        "bundle.sig"
      ),

    bundle_hash:
      manifest.bundle_hash,
  };
}