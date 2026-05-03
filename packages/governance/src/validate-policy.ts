import fs from "fs";
import path from "path";

import {
  readManifest,
  verifyManifest,
} from "@pramanasystems/bundle";

import {
  readSignature,
  verifySignature,
} from "@pramanasystems/crypto";

/**
 * Validates every version directory under `./policies/<policyId>` by
 * re-verifying all bundle manifests (content hashes) and cryptographic
 * signatures (bundle.sig).
 *
 * Returns `true` only when every version passes all checks.
 *
 * @param policyId - Policy identifier whose version directories will be checked.
 * @throws When the policy directory does not exist.
 */
export function validatePolicy(
  policyId: string
): boolean {

  const policyRoot =
    path.join(
      "./policies",
      policyId
    );

  if (
    !fs.existsSync(
      policyRoot
    )
  ) {
    throw new Error(
      `Policy does not exist: ${policyId}`
    );
  }

  const versions =
    fs
      .readdirSync(
        policyRoot
      )
      .filter(
        (entry) =>
          entry.startsWith("v")
      )
      .sort();

  for (const version of versions) {

    const versionDirectory =
      path.join(
        policyRoot,
        version
      );

    const manifest =
      readManifest(
        versionDirectory
      );

    const manifestResult =
      verifyManifest(
        manifest,
        versionDirectory
      );

    if (
      !manifestResult.valid
    ) {
      return false;
    }

    const signature =
      readSignature(
        versionDirectory
      );

    const manifestPath =
      path.join(
        versionDirectory,
        "bundle.manifest.json"
      );

    const signatureValid =
      verifySignature(
        manifestPath,
        signature
      );

    if (
      !signatureValid
    ) {
      return false;
    }
  }

  return true;
}




