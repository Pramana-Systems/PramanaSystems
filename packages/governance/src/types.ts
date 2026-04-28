import path from "path";

import {
  generateManifest,
} from "../../bundle/src/manifest";

import {
  writeManifest,
} from "../../bundle/src/write";

import {
  signManifest,
} from "../../crypto/src/sign";

import {
  writeSignature,
} from "../../crypto/src/persist";

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