import fs from "fs";
import path from "path";

import { canonicalize } from "./canonicalize";
import { sha256 } from "./hash";
import { traverseDirectory } from "./traverse";

import type {
  BundleArtifact,
  BundleManifest,
} from "./types";

/**
 * Generates a content-addressed {@link BundleManifest} for `policyId`/`policyVersion`
 * by hashing every file under `directory` (manifest and sig files excluded).
 *
 * JSON files are canonicalized before hashing; other files have CRLF normalized
 * to LF.  The final `bundle_hash` is SHA-256 of the canonical manifest with
 * `bundle_hash` set to `""`, making it a deterministic commitment over all
 * artifact content.
 *
 * @param policyId      - Policy identifier to embed in the manifest.
 * @param policyVersion - Policy version string (e.g. `"v1"`).
 * @param directory     - Absolute path to the bundle directory.
 */
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

      const canonicalContent =
        relativePath.endsWith(".json")
          ? canonicalize(
              JSON.parse(content)
            )
          : content.replace(
              /\r\n/g,
              "\n"
            );

      return {
        path:
          relativePath,

        hash:
          sha256(
            canonicalContent
          ),
      };
    });

  const manifest: BundleManifest = {
    manifest_version:
      "1",

    policy_id:
      policyId,

    policy_version:
      policyVersion,

    artifacts,

    runtime_requirements: {
      required_capabilities: [
        "replay-protection",
        "attestation-signing",
        "bundle-verification",
      ],

      supported_runtime_versions: [
        "1.0.0",
      ],

      supported_schema_versions: [
        "1.0.0",
      ],
    },

    bundle_hash:
      "",
  };

  const canonical =
    canonicalize(
      manifest
    );

  const bundleHash =
    sha256(
      canonical
    );

  manifest.bundle_hash =
    bundleHash;

  return manifest;
}




