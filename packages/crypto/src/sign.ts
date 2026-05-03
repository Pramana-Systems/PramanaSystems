import fs from "fs";

import crypto from "crypto";

import {
  canonicalize,
} from "@pramanasystems/bundle";

import {
  loadPrivateKey,
} from "./keys";

/**
 * Reads the manifest JSON at `manifestPath`, canonicalizes it, and returns a
 * base64-encoded Ed25519 signature produced with the dev private key.
 *
 * @param manifestPath - Absolute or CWD-relative path to a `bundle.manifest.json` file.
 * @returns Base64-encoded Ed25519 signature over the canonical manifest bytes.
 */
export function signManifest(
  manifestPath: string
): string {

  const manifest =
    JSON.parse(
      fs.readFileSync(
        manifestPath,
        "utf8"
      )
    );

  const canonical =
    canonicalize(
      manifest
    );

  const privateKey =
    loadPrivateKey();

  const signature =
    crypto.sign(
      null,

      Buffer.from(
        canonical,
        "utf8"
      ),

      privateKey
    );

  return signature.toString(
    "base64"
  );
}




