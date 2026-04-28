import fs from "fs";
import path from "path";

import { canonicalize } from "./canonicalize";
import { sha256 } from "./hash";
import { traverseDirectory } from "./traverse";

import type {
  BundleArtifact,
  BundleManifest,
} from "./types";

export function generateManifest(
  policyId: string,
  policyVersion: string,
  directory: string
): BundleManifest {
  const files =
    traverseDirectory(directory);

  const artifacts: BundleArtifact[] =
    files.map((relativePath) => {
      const fullPath =
        path.join(
          directory,
          relativePath
        );

      const content =
        fs.readFileSync(
          fullPath,
          "utf8"
        );

      return {
        path: relativePath,
        hash: sha256(content),
      };
    });

  const manifest: BundleManifest = {
    manifest_version: "1",

    policy_id: policyId,
    policy_version: policyVersion,

    artifacts,

    bundle_hash: "",
  };

  const canonical =
    canonicalize(manifest);

  const bundleHash =
    sha256(canonical);

  manifest.bundle_hash =
    bundleHash;

  return manifest;
}