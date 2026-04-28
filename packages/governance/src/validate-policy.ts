import fs from "fs";
import path from "path";

import {
  readManifest,
  verifyManifest,
} from "@manthan/bundle";

import {
  readSignature,
  verifySignature,
} from "@manthan/crypto";

export function validatePolicy(
  policyId: string
): boolean {
  const policyRoot = path.join(
    "./policies",
    policyId
  );

  if (!fs.existsSync(policyRoot)) {
    throw new Error(
      `Policy does not exist: ${policyId}`
    );
  }

  const versions = fs
    .readdirSync(policyRoot)
    .filter((entry) =>
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

    if (!manifestResult.valid) {
      return false;
    }

    const signature =
      readSignature(
        versionDirectory
      );

    const signatureValid =
      verifySignature(
        manifest,
        signature
      );

    if (!signatureValid) {
      return false;
    }
  }

  return true;
}